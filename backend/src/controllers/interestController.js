
import mongoose from "mongoose";
import Interest from "../models/Interest.js";
import Profile from "../models/Profile.js";
import Subscription from "../models/Subscription.js";
import { getPlan } from "../config/subscriptionPlans.js";

async function reserveUsageCounter({
  subscription,
  senderId,
  field,
  limit,
  now,
  extraFilter = {},
}) {
  const periodStart = subscription.startsAt || subscription.createdAt;

  // Initialize counters for subscriptions created before these
  // usage fields were introduced.
  if (subscription[field] == null) {
    const used = await Interest.countDocuments({
      sender: senderId,
      createdAt: {
        $gte: periodStart,
        $lt: now,
      },
      ...extraFilter,
    });

    await Subscription.updateOne(
      {
        _id: subscription._id,
        [field]: { $exists: false },
      },
      {
        $set: { [field]: used },
      }
    );
  }

  return Subscription.findOneAndUpdate(
    {
      _id: subscription._id,
      user: senderId,
      status: "active",
      startsAt: { $lte: now },
      expiresAt: { $gt: now },
      [field]: { $lt: limit },
    },
    {
      $inc: { [field]: 1 },
    },
    { new: true }
  ).lean();
}

async function releaseUsageCounter(subscriptionId, field) {
  await Subscription.updateOne(
    {
      _id: subscriptionId,
      [field]: { $gt: 0 },
    },
    {
      $inc: { [field]: -1 },
    }
  );
}

// POST /api/interests
export const sendInterest = async (req, res) => {
  let mainReserved = false;
  let priorityReserved = false;
  let subscriptionId = null;

  try {
    const senderId = req.user?._id || req.user?.id;
    const { receiverId } = req.body;
    const isPriority = req.body?.isPriority === true;
    const now = new Date();

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({
        success: false,
        message: "Valid receiver ID is required.",
      });
    }

    if (String(senderId) === String(receiverId)) {
      return res.status(400).json({
        success: false,
        message: "You cannot send interest to yourself.",
      });
    }

    // Profile schema currently has no isActive field.
    const receiverProfile = await Profile.findOne({
      user: receiverId,
    });

    if (!receiverProfile) {
      return res.status(404).json({
        success: false,
        message: "Member profile not found.",
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
      });
    }

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

    const subscription = await Subscription.findOne({
      user: senderId,
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
        message: "Please purchase a subscription to send interests.",
      });
    }

    subscriptionId = subscription._id;

    const plan = getPlan(subscription.plan);

    if (!plan) {
      return res.status(403).json({
        success: false,
        message: "Invalid subscription plan.",
      });
    }

    const priorityLimit = Number(plan.priorityInterestLimit || 0);

    if (isPriority && priorityLimit <= 0) {
      return res.status(403).json({
        success: false,
        code: "PRIORITY_INTEREST_NOT_AVAILABLE",
        message: "Your subscription does not include priority interests.",
      });
    }

    const totalLimit =
      plan.interestLimit === -1
        ? Number.MAX_SAFE_INTEGER
        : Number(plan.interestLimit);

    // Reserve one normal interest credit.
    const reservedMain = await reserveUsageCounter({
      subscription,
      senderId,
      field: "interestsUsed",
      limit: totalLimit,
      now,
    });

    if (!reservedMain) {
      const latest = await Subscription.findById(subscription._id).lean();

      return res.status(403).json({
        success: false,
        code: "INTEREST_LIMIT_REACHED",
        message: `You have reached your ${plan.name} plan interest limit.`,
        interestLimit: totalLimit,
        interestsUsed: latest?.interestsUsed || 0,
        upgradeRequired: true,
      });
    }

    mainReserved = true;

    // Priority interests also consume one normal interest credit.
    if (isPriority) {
      const reservedPriority = await reserveUsageCounter({
        subscription,
        senderId,
        field: "priorityInterestsUsed",
        limit: priorityLimit,
        now,
        extraFilter: { isPriority: true },
      });

      if (!reservedPriority) {
        await releaseUsageCounter(subscription._id, "interestsUsed");
        mainReserved = false;

        const latest = await Subscription.findById(subscription._id).lean();

        return res.status(403).json({
          success: false,
          code: "PRIORITY_INTEREST_LIMIT_REACHED",
          message: "You have used all priority interests in this plan.",
          priorityInterestLimit: priorityLimit,
          priorityInterestsUsed: latest?.priorityInterestsUsed || 0,
          upgradeRequired: true,
        });
      }

      priorityReserved = true;
    }

    const interest = await Interest.create({
      sender: senderId,
      receiver: receiverId,
      isPriority,
    });

    const latest = await Subscription.findById(subscription._id).lean();

    return res.status(201).json({
      success: true,
      message: isPriority
        ? "Priority interest sent successfully."
        : "Interest sent successfully.",
      interest,
      subscription: {
        plan: plan.name,
        interestLimit: plan.interestLimit,
        interestsUsed: latest?.interestsUsed || 0,
        interestsRemaining:
          plan.interestLimit === -1
            ? "Unlimited"
            : Math.max(
                0,
                plan.interestLimit - (latest?.interestsUsed || 0)
              ),
        priorityInterestLimit: priorityLimit,
        priorityInterestsUsed: latest?.priorityInterestsUsed || 0,
        priorityInterestsRemaining: Math.max(
          0,
          priorityLimit - (latest?.priorityInterestsUsed || 0)
        ),
      },
    });
  } catch (error) {
    if (mainReserved && subscriptionId) {
      await releaseUsageCounter(subscriptionId, "interestsUsed");
    }

    if (priorityReserved && subscriptionId) {
      await releaseUsageCounter(subscriptionId, "priorityInterestsUsed");
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Interest has already been sent.",
      });
    }

    console.error("Send interest error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send interest.",
    });
  }
};

// GET /api/interests/sent
export const getSentInterests = async (req, res) => {
  try {
    const interests = await Interest.find({
      sender: req.user.id,
    })
      .populate("receiver", "fullName")
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
export const getReceivedInterests = async (req, res) => {
  try {
    const interests = await Interest.find({
      receiver: req.user.id,
    })
      .populate("sender", "fullName")
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

    // Cancelling a request does not refund an interest credit.

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
