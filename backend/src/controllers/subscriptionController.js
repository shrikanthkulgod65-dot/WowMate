
import Subscription from "../models/Subscription.js";
import Interest from "../models/Interest.js";
import ContactUnlock from "../models/ContactUnlock.js";
import { getPlan, getPublicPlans } from "../config/subscriptionPlans.js";

// Public: Get all available plans.
export const getSubscriptionPlans = (req, res) => {
  return res.status(200).json({
    success: true,
    plans: getPublicPlans(),
  });
};

// Authenticated: Get the logged-in user's subscription.
export const getMySubscription = async (req, res) => {
  try {
    const now = new Date();
    const userId = req.user._id || req.user.id;

    await Subscription.updateMany(
      {
        user: userId,
        status: "active",
        expiresAt: { $lte: now },
      },
      {
        $set: { status: "expired" },
      }
    );

    const subscription = await Subscription.findOne({
      user: userId,
      status: "active",
      startsAt: { $lte: now },
      expiresAt: { $gt: now },
    }).sort({ createdAt: -1 });

    if (!subscription) {
      return res.status(200).json({
        success: true,
        active: false,
        message: "No active subscription found.",
        subscription: null,
      });
    }

    const plan = getPlan(subscription.plan);

    if (!plan) {
      return res.status(403).json({
        success: false,
        message: "Invalid subscription plan.",
      });
    }

    const periodStart =
      subscription.startsAt || subscription.createdAt;

    const periodFilter = {
      createdAt: {
        $gte: periodStart,
        $lt: now,
      },
    };

    const [
      actualInterests,
      actualPriorityInterests,
      actualContactUnlocks,
    ] = await Promise.all([
      Interest.countDocuments({
        sender: userId,
        ...periodFilter,
      }),

      Interest.countDocuments({
        sender: userId,
        isPriority: true,
        ...periodFilter,
      }),

      ContactUnlock.countDocuments({
        member: userId,
        subscription: subscription._id,
      }),
    ]);

    const interestsUsed = Math.max(
      subscription.interestsUsed || 0,
      actualInterests
    );

    const priorityInterestsUsed = Math.max(
      subscription.priorityInterestsUsed || 0,
      actualPriorityInterests
    );

    const contactUnlocksUsed = Math.max(
      subscription.contactUnlocksUsed || 0,
      actualContactUnlocks
    );

    return res.status(200).json({
      success: true,
      active: true,
      subscription,
      features: plan.features,

      entitlements: {
        interestLimit: plan.interestLimit,
        interestsUsed,
        interestsRemaining:
          plan.interestLimit === -1
            ? "Unlimited"
            : Math.max(0, plan.interestLimit - interestsUsed),

        contactUnlockLimit: plan.contactUnlockLimit,
        contactUnlocksUsed,
        contactUnlocksRemaining: Math.max(
          0,
          plan.contactUnlockLimit - contactUnlocksUsed
        ),

        priorityInterestLimit: plan.priorityInterestLimit,
        priorityInterestsUsed,
        priorityInterestsRemaining: Math.max(
          0,
          plan.priorityInterestLimit - priorityInterestsUsed
        ),

        profileBoostLimit: plan.profileBoostLimit,
        profileBoostsUsed: subscription.profileBoostsUsed || 0,
        profileBoostsRemaining: Math.max(
          0,
          plan.profileBoostLimit -
            (subscription.profileBoostsUsed || 0)
        ),
      },
    });
  } catch (error) {
    console.error("Get subscription error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve subscription.",
    });
  }
};
