
import User from "../models/User.js";
import Profile from "../models/Profile.js";
import Subscription from "../models/Subscription.js";
import { getPlan } from "../config/subscriptionPlans.js";

// Public broker directory:
// Guests and Starter subscribers see photos only.
// Silver and Gold subscribers can see broker details.
export async function getAllBrokers(req, res) {
  try {
    const brokers = await User.find({
      role: "broker",
      accountStatus: "active",
    })
      .select("_id fullName email mobile brokerDetails createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const brokerIds = brokers.map((broker) => broker._id);

    const photos = await Profile.find({
      user: { $in: brokerIds },
    })
      .select("user profilePhoto")
      .lean();

    const photoMap = new Map(
      photos.map((profile) => [
        profile.user.toString(),
        profile.profilePhoto || "",
      ])
    );

    let plan = null;

    if (req.user?._id) {
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

      if (subscription) {
        plan = getPlan(subscription.plan);
      }
    }

    const canViewDetails =
      plan?.features?.protectedBrokerDetails === true;

    const canViewContact =
      plan?.features?.contactDetails === true;

    // Guests and Starter subscribers receive photos only.
    if (!canViewDetails) {
      const profiles = brokers
        .map((broker) => ({
          profilePhoto: photoMap.get(broker._id.toString()) || "",
        }))
        .filter((broker) => broker.profilePhoto);

      return res.status(200).json({
        success: true,
        accessLevel: "photo-only",
        count: profiles.length,
        profiles,
      });
    }

    // Silver and Gold subscribers receive broker details.
    const profiles = brokers.map((broker) => ({
      id: broker._id.toString(),
      fullName: broker.fullName,
      profilePhoto: photoMap.get(broker._id.toString()) || "",
      brokerDetails: broker.brokerDetails || {},
      ...(canViewContact
        ? {
            email: broker.email,
            mobile: broker.mobile || "",
          }
        : {}),
    }));

    return res.status(200).json({
      success: true,
      accessLevel: "full",
      count: profiles.length,
      profiles,
    });
  } catch (error) {
    console.error("Get brokers error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load broker profiles.",
    });
  }
}

// Logged-in broker's own profile
export async function getMyBrokerProfile(req, res) {
  try {
    const user = req.user;

    return res.status(200).json({
      success: true,
      profile: {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile || "",
        brokerDetails: user.brokerDetails || {},
      },
    });
  } catch (error) {
    console.error("Get broker profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load your broker profile.",
    });
  }
}

// Update logged-in broker's own profile
export async function updateMyBrokerProfile(req, res) {
  try {
    const {
      businessName,
      experienceYears,
      city,
      serviceArea,
      about,
    } = req.body || {};

    const years = Number(experienceYears);

    if (
      !String(businessName || "").trim() ||
      !String(city || "").trim() ||
      !String(serviceArea || "").trim() ||
      !String(about || "").trim() ||
      !Number.isFinite(years) ||
      years < 0 ||
      years > 80
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter all valid broker profile details.",
      });
    }

    req.user.brokerDetails = {
      businessName: String(businessName).trim(),
      experienceYears: years,
      city: String(city).trim(),
      serviceArea: String(serviceArea).trim(),
      about: String(about).trim(),
    };

    await req.user.save();

    return res.status(200).json({
      success: true,
      message: "Broker profile updated successfully.",
      profile: {
        id: req.user._id.toString(),
        fullName: req.user.fullName,
        email: req.user.email,
        mobile: req.user.mobile || "",
        brokerDetails: req.user.brokerDetails,
      },
    });
  } catch (error) {
    console.error("Update broker profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update your broker profile.",
    });
  }
}
