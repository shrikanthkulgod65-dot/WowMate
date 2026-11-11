
import Subscription from "../models/Subscription.js";
import { getPlan, getPublicPlans } from "../config/subscriptionPlans.js";

// Public: Get all available plans
export const getSubscriptionPlans = (req, res) => {
  return res.status(200).json({
    success: true,
    plans: getPublicPlans(),
  });
};

// Authenticated: Get the logged-in user's subscription
export const getMySubscription = async (req, res) => {
  try {
    const now = new Date();

    // Mark expired subscriptions automatically when checked.
    await Subscription.updateMany(
      {
        user: req.user._id,
        status: "active",
        expiresAt: { $lte: now },
      },
      {
        $set: { status: "expired" },
      }
    );

    const subscription = await Subscription.findOne({
      user: req.user._id,
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

    return res.status(200).json({
      success: true,
      active: true,
      subscription,
      features: plan.features,
      interestLimit: plan.interestLimit,
    });
  } catch (error) {
    console.error("Get subscription error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve subscription.",
    });
  }
};
