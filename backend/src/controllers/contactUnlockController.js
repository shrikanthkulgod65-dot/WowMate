
import mongoose from "mongoose";
import ContactUnlock from "../models/ContactUnlock.js";
import Profile from "../models/Profile.js";
import Subscription from "../models/Subscription.js";
import { getPlan } from "../config/subscriptionPlans.js";

export const unlockProfileContact = async (req, res) => {
  try {
    const memberId = req.user?._id || req.user?.id;
    const { profileId } = req.params;
    const now = new Date();

    if (
      !memberId ||
      !mongoose.Types.ObjectId.isValid(profileId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid profile ID is required.",
      });
    }

    const profile = await Profile.findById(profileId)
      .populate({
        path: "user",
        select: "fullName email mobile role",
        match: { role: "user" },
      })
      .lean();

    if (!profile || !profile.user) {
      return res.status(404).json({
        success: false,
        message: "Member profile not found.",
      });
    }

    if (String(profile.user._id) === String(memberId)) {
      return res.status(400).json({
        success: false,
        message: "You cannot unlock your own contact details.",
      });
    }

    if (!profile.user.email && !profile.user.mobile) {
      return res.status(409).json({
        success: false,
        message: "Contact details are not available for this profile.",
      });
    }

    // Previously unlocked contacts remain available to this member.
    const existingUnlock = await ContactUnlock.findOne({
      member: memberId,
      profile: profile._id,
    }).lean();

    if (existingUnlock) {
      return res.status(200).json({
        success: true,
        alreadyUnlocked: true,
        message: "Contact details were already unlocked.",
        contact: {
          name: profile.user.fullName || "",
          email: profile.user.email || "",
          mobile: profile.user.mobile || "",
        },
      });
    }

    await Subscription.updateMany(
      {
        user: memberId,
        status: "active",
        expiresAt: { $lte: now },
      },
      {
        $set: { status: "expired" },
      }
    );

    const subscription = await Subscription.findOne({
      user: memberId,
      status: "active",
      startsAt: { $lte: now },
      expiresAt: { $gt: now },
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!subscription) {
      return res.status(403).json({
        success: false,
        code: "SUBSCRIPTION_REQUIRED",
        message: "Please purchase an active subscription to unlock contacts.",
      });
    }

    const plan = getPlan(subscription.plan);
    const limit = Number(plan?.contactUnlockLimit || 0);

    if (!plan || limit <= 0) {
      return res.status(403).json({
        success: false,
        code: "CONTACT_UNLOCK_NOT_AVAILABLE",
        message: "Your plan does not include contact unlocks.",
      });
    }

    // Initialize counter for subscriptions created before this feature.
    if (subscription.contactUnlocksUsed == null) {
      const existingCount = await ContactUnlock.countDocuments({
        member: memberId,
        subscription: subscription._id,
      });

      await Subscription.updateOne(
        {
          _id: subscription._id,
          contactUnlocksUsed: { $exists: false },
        },
        {
          $set: { contactUnlocksUsed: existingCount },
        }
      );
    }

    // Atomically reserve one unlock credit.
    const reserved = await Subscription.findOneAndUpdate(
      {
        _id: subscription._id,
        user: memberId,
        status: "active",
        startsAt: { $lte: now },
        expiresAt: { $gt: now },
        contactUnlocksUsed: { $lt: limit },
      },
      {
        $inc: { contactUnlocksUsed: 1 },
      },
      { new: true }
    ).lean();

    if (!reserved) {
      const latest = await Subscription.findById(subscription._id).lean();

      return res.status(403).json({
        success: false,
        code: "CONTACT_UNLOCK_LIMIT_REACHED",
        message: "You have used all contact unlocks in your plan.",
        contactUnlockLimit: limit,
        contactUnlocksUsed: latest?.contactUnlocksUsed || 0,
        contactUnlocksRemaining: 0,
      });
    }

    try {
      await ContactUnlock.create({
        member: memberId,
        profile: profile._id,
        profileOwner: profile.user._id,
        subscription: reserved._id,
      });
    } catch (error) {
      await Subscription.updateOne(
        {
          _id: reserved._id,
          contactUnlocksUsed: { $gt: 0 },
        },
        {
          $inc: { contactUnlocksUsed: -1 },
        }
      );

      if (error.code === 11000) {
        const previousUnlock = await ContactUnlock.findOne({
          member: memberId,
          profile: profile._id,
        }).lean();

        if (previousUnlock) {
          return res.status(200).json({
            success: true,
            alreadyUnlocked: true,
            message: "Contact details were already unlocked.",
            contact: {
              name: profile.user.fullName || "",
              email: profile.user.email || "",
              mobile: profile.user.mobile || "",
            },
          });
        }
      }

      throw error;
    }

    return res.status(200).json({
      success: true,
      alreadyUnlocked: false,
      message: "Contact details unlocked successfully.",
      contact: {
        name: profile.user.fullName || "",
        email: profile.user.email || "",
        mobile: profile.user.mobile || "",
      },
      usage: {
        limit,
        used: reserved.contactUnlocksUsed,
        remaining: Math.max(0, limit - reserved.contactUnlocksUsed),
      },
    });
  } catch (error) {
    console.error("Contact unlock error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to unlock contact details.",
    });
  }
};
