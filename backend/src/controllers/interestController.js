
import mongoose from "mongoose";
import Interest from "../models/Interest.js";
import Profile from "../models/Profile.js";
import Subscription from "../models/Subscription.js";
import { getPlan } from "../config/subscriptionPlans.js";

// POST /api/interests
// Send interest to another user based on subscription limits.
export const sendInterest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId } = req.body;
    const now = new Date();

    if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({
        success: false,
        message: "Valid receiver ID is required.",
      });
    }

    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot send interest to yourself.",
      });
    }

    const receiverProfile = await Profile.findOne({
      user: receiverId,
      isActive: true,
    });

    if (!receiverProfile) {
      return res.status(404).json({
        success: false,
        message: "Member profile not found or inactive.",
      });
    }

    const existingInterest = await Interest.findOne({
      sender: senderId,
      receiver: receiverId,
    });

    if (existingInterest) {
      return res.status(409).json({
        success: false,
        message: "Interest has already been sent to this member.",
        interest: existingInterest,
      });
    }

    // Expire subscriptions that have passed their expiry date.
    await Subscription.updateMany(
      {
        user: senderId,
        status: "active",
        expiresAt: { $lte: now },
      },
      {
        $set: { status: "expired" },
      }
    );

    // Find the user's active subscription.
    const subscription = await Subscription.findOne({
      user: senderId,
      status: "active",
      startsAt: { $lte: now },
      expiresAt: { $gt: now },
    }).sort({ createdAt: -1 });

    if (!subscription) {
      return res.status(403).json({
        success: false,
        code: "SUBSCRIPTION_REQUIRED",
        message: "Please purchase a subscription to send interests.",
      });
    }

    // Get subscription plan details.
    const plan = getPlan(subscription.plan);

    if (!plan) {
      return res.status(403).json({
        success: false,
        message: "Invalid subscription plan.",
      });
    }

    // Count interests already sent by this user.
    const sentInterestCount = await Interest.countDocuments({
      sender: senderId,
    });

    // Check the plan's interest limit.
    // -1 means unlimited.
    if (
      plan.interestLimit !== -1 &&
      sentInterestCount >= plan.interestLimit
    ) {
      return res.status(403).json({
        success: false,
        code: "INTEREST_LIMIT_REACHED",
        message: `You have reached your ${plan.name} plan interest limit.`,
        plan: plan.name,
        interestLimit: plan.interestLimit,
        interestsUsed: sentInterestCount,
        upgradeRequired: true,
      });
    }

    // Create interest.
    const interest = await Interest.create({
      sender: senderId,
      receiver: receiverId,
    });

    return res.status(201).json({
      success: true,
      message: "Interest sent successfully.",
      interest,
      subscription: {
        plan: plan.name,
        interestLimit:
          plan.interestLimit === -1
            ? "Unlimited"
            : plan.interestLimit,
        interestsUsed: sentInterestCount + 1,
        interestsRemaining:
          plan.interestLimit === -1
            ? "Unlimited"
            : plan.interestLimit - (sentInterestCount + 1),
      },
    });
  } catch (error) {
    console.error("Send interest error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Interest has already been sent.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to send interest.",
    });
  }
};

// GET /api/interests/sent
// Get interests sent by logged-in member.
export const getSentInterests = async (req, res) => {
  try {
    const interests = await Interest.find({
      sender: req.user.id,
    })
      .populate("receiver", "fullName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: interests.length,
      interests,
    });
  } catch (error) {
    console.error("Get sent interests error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve sent interests.",
    });
  }
};

// GET /api/interests/received
// Get interests received by logged-in member.
export const getReceivedInterests = async (req, res) => {
  try {
    const interests = await Interest.find({
      receiver: req.user.id,
    })
      .populate("sender", "fullName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: interests.length,
      interests,
    });
  } catch (error) {
    console.error("Get received interests error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve received interests.",
    });
  }
};

// PATCH /api/interests/:interestId/respond
// Accept or reject a received interest.
export const respondToInterest = async (req, res) => {
  try {
    const { interestId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(interestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interest ID.",
      });
    }

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be accepted or rejected.",
      });
    }

    const interest = await Interest.findOne({
      _id: interestId,
      receiver: req.user.id,
    });

    if (!interest) {
      return res.status(404).json({
        success: false,
        message: "Interest request not found.",
      });
    }

    if (interest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This interest request has already been processed.",
      });
    }

    interest.status = status;
    await interest.save();

    return res.status(200).json({
      success: true,
      message: `Interest ${status} successfully.`,
      interest,
    });
  } catch (error) {
    console.error("Respond to interest error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update interest status.",
    });
  }
};

// DELETE /api/interests/:interestId
// Cancel a pending interest sent by logged-in member.
export const cancelInterest = async (req, res) => {
  try {
    const { interestId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(interestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interest ID.",
      });
    }

    const interest = await Interest.findOneAndDelete({
      _id: interestId,
      sender: req.user.id,
      status: "pending",
    });

    if (!interest) {
      return res.status(404).json({
        success: false,
        message: "Pending interest request not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Interest cancelled successfully.",
    });
  } catch (error) {
    console.error("Cancel interest error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to cancel interest.",
    });
  }
};
