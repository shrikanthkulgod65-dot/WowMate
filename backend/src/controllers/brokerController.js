import User from "../models/User.js";

// Public API: fetch all active registered brokers
export async function getAllBrokers(req, res) {
  try {
    const brokers = await User.find({
      role: "broker",
      accountStatus: "active",
    })
      .select("fullName brokerDetails createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const profiles = brokers.map((broker) => ({
      id: broker._id.toString(),
      fullName: broker.fullName,
      brokerDetails: broker.brokerDetails || {},
    }));

    return res.status(200).json({
      success: true,
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

// Protected API: fetch logged-in broker's profile
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

// Protected API: update logged-in broker's profile
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
      message: "Unable to update broker profile.",
    });
  }
}