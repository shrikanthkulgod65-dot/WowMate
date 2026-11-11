
import Subscription from "../models/Subscription.js";
import { getPlan } from "../config/subscriptionPlans.js";

export function requireFeature(featureName) {
  return async (req, res, next) => {
    try {
      if (!req.user?._id) {
        return res.status(401).json({
          success: false,
          message: "Authentication required.",
        });
      }

      const now = new Date();

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
        return res.status(403).json({
          success: false,
          code: "SUBSCRIPTION_REQUIRED",
          message: "Please purchase a subscription to access this feature.",
        });
      }

      const plan = getPlan(subscription.plan);

      if (!plan || plan.features[featureName] !== true) {
        return res.status(403).json({
          success: false,
          code: "FEATURE_NOT_AVAILABLE",
          message: "This feature is not included in your current plan.",
          requiredFeature: featureName,
        });
      }

      req.subscription = subscription;
      req.subscriptionPlan = plan;

      next();
    } catch (error) {
      console.error("Subscription middleware error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to verify subscription access.",
      });
    }
  };
}
