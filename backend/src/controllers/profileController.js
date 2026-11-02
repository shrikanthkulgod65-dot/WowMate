
import Profile from "../models/Profile.js";

const allowedFields = [
  "dateOfBirth",
  "gender",
  "religion",
  "community",
  "maritalStatus",
  "height",
  "education",
  "occupation",
  "annualIncome",
  "aboutMe",
  "country",
  "state",
  "city",
  "profilePhoto",
  "partnerPreferences",
];

// GET /api/profile/me
// Retrieve the logged-in user's profile.
export const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", "fullName email");

    if (!profile) {
      return res.status(200).json({
        success: true,
        message: "Profile has not been created yet.",
        profile: null,
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve profile.",
    });
  }
};

// PUT /api/profile/me
// Create or update the logged-in user's profile.
export const updateMyProfile = async (req, res) => {
  try {
    const updates = {};

    for (const field of allowedFields) {
      if (
        Object.prototype.hasOwnProperty.call(req.body, field)
      ) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide profile information to save.",
      });
    }

    // Validate nested partner preference fields.
    if (
      updates.partnerPreferences !== undefined &&
      (
        updates.partnerPreferences === null ||
        typeof updates.partnerPreferences !== "object" ||
        Array.isArray(updates.partnerPreferences)
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Partner preferences must be an object.",
      });
    }

    // Validate minimum and maximum preferred age.
    const existingProfile = await Profile.findOne({
      user: req.user.id,
    }).select("partnerPreferences");

    const existingPreferences =
      existingProfile?.partnerPreferences?.toObject?.() ||
      existingProfile?.partnerPreferences ||
      {};

    const incomingPreferences = updates.partnerPreferences || {};

    const minAge =
      incomingPreferences.minAge !== undefined
        ? incomingPreferences.minAge
        : existingPreferences.minAge;

    const maxAge =
      incomingPreferences.maxAge !== undefined
        ? incomingPreferences.maxAge
        : existingPreferences.maxAge;

    if (
      minAge != null &&
      maxAge != null &&
      Number(minAge) > Number(maxAge)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Minimum preferred age cannot exceed maximum age.",
      });
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      {
        $set: updates,
        $setOnInsert: { user: req.user.id },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    ).populate("user", "fullName email");

    return res.status(200).json({
      success: true,
      message: "Profile saved successfully.",
      profile,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid profile information.",
        errors: error.errors
          ? Object.values(error.errors).map(
              (item) => item.message
            )
          : [error.message],
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to save profile.",
    });
  }
};

// GET /api/profile/discover
// Fetch registered profiles, excluding the logged-in user.
export const discoverProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({
      user: { $ne: req.user.id },
    })
      .select(
        "user dateOfBirth gender religion community maritalStatus height education occupation annualIncome aboutMe country state city profilePhoto createdAt"
      )
      .populate("user", "fullName")
      .sort({ createdAt: -1 });

    // Exclude profiles whose User account no longer exists.
    const registeredProfiles = profiles.filter(
      (profile) => profile.user
    );

    return res.status(200).json({
      success: true,
      count: registeredProfiles.length,
      profiles: registeredProfiles,
    });
  } catch (error) {
    console.error("Discover profiles error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve registered profiles.",
    });
  }
};
