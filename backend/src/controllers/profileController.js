
import Profile from "../models/Profile.js";

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function parseInteger(value, fallback, minimum, maximum) {
  if (value === undefined || value === "") return fallback;

  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed >= minimum && parsed <= maximum
    ? parsed
    : null;
}

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
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
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
        message: "Minimum preferred age cannot exceed maximum age.",
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
          ? Object.values(error.errors).map((item) => item.message)
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

// GET /api/profile/search
// Search registered member profiles for the authenticated user.
export const searchProfiles = async (req, res) => {
  const page = parseInteger(req.query.page, 1, 1, 100000);
  const limit = parseInteger(req.query.limit, 12, 1, 50);
  const minAge = parseInteger(req.query.minAge, null, 18, 100);
  const maxAge = parseInteger(req.query.maxAge, null, 18, 100);

  const hasMinAge =
    req.query.minAge !== undefined && req.query.minAge !== "";

  const hasMaxAge =
    req.query.maxAge !== undefined && req.query.maxAge !== "";

  if (
    page === null ||
    limit === null ||
    (hasMinAge && minAge === null) ||
    (hasMaxAge && maxAge === null) ||
    (minAge !== null && maxAge !== null && minAge > maxAge)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid profile search filters.",
    });
  }

  const query = { user: { $ne: req.user.id } };

  const gender = String(req.query.gender || "").trim().toLowerCase();

  const genderValues = {
    female: "Female",
    bride: "Female",
    male: "Male",
    groom: "Male",
    other: "Other",
  };

  if (gender && !genderValues[gender]) {
    return res.status(400).json({
      success: false,
      message: "Invalid gender filter.",
    });
  }

  if (gender) {
    query.gender = genderValues[gender];
  }

  const occupation = String(req.query.occupation || "").trim();
  const category = String(req.query.category || "").trim().toLowerCase();

  const occupationFilters = [];

  if (occupation && occupation.toLowerCase() !== "any profession") {
    occupationFilters.push({
      $regex: escapeRegex(occupation),
      $options: "i",
    });
  }

  if (category === "farmer") {
    occupationFilters.push({
      $regex: "farmer|agricultur",
      $options: "i",
    });
  } else if (category === "professional") {
    occupationFilters.push({
      $not: /farmer|agricultur/i,
    });
  } else if (category) {
    return res.status(400).json({
      success: false,
      message: "Invalid profile category filter.",
    });
  }

  if (occupationFilters.length === 1) {
    query.occupation = occupationFilters[0];
  } else if (occupationFilters.length > 1) {
    query.$and = occupationFilters.map((filter) => ({
      occupation: filter,
    }));
  }

  const city = String(req.query.city || "").trim();

  if (city) {
    query.city = {
      $regex: escapeRegex(city),
      $options: "i",
    };
  }

  if (minAge !== null || maxAge !== null) {
    const today = new Date();
    const dateOfBirth = {};

    if (minAge !== null) {
      const youngestBirthDate = new Date(today);
      youngestBirthDate.setFullYear(
        today.getFullYear() - minAge
      );
      dateOfBirth.$lte = youngestBirthDate;
    }

    if (maxAge !== null) {
      const oldestBirthDate = new Date(today);
      oldestBirthDate.setFullYear(
        today.getFullYear() - maxAge - 1
      );
      dateOfBirth.$gt = oldestBirthDate;
    }

    query.dateOfBirth = dateOfBirth;
  }

  try {
    const [profiles, total] = await Promise.all([
      Profile.find(query)
        .select(
          "user dateOfBirth gender community maritalStatus height education occupation annualIncome aboutMe country state city profilePhoto createdAt"
        )
        .populate("user", "fullName")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),

      Profile.countDocuments(query),
    ]);

    const registeredProfiles = profiles.filter(
      (profile) => profile.user
    );

    return res.status(200).json({
      success: true,
      count: registeredProfiles.length,
      total,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      profiles: registeredProfiles,
    });
  } catch (error) {
    console.error("Profile search error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to search profiles.",
    });
  }
};

// GET /api/profile/public
// Public visitors can see only profile name and photo.
export const getPublicProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({
      profilePhoto: { $exists: true, $nin: ["", null] },
    })
      .select("user profilePhoto")
      .populate({
        path: "user",
        select: "fullName role",
        match: { role: "user" },
      })
      .sort({ createdAt: -1 })
      .lean();

    const publicProfiles = profiles
      .filter((profile) => profile.user)
      .map((profile) => ({
        id: profile._id,
        name: profile.user.fullName,
        profilePhoto: profile.profilePhoto,
      }));

    return res.status(200).json({
      success: true,
      count: publicProfiles.length,
      profiles: publicProfiles,
    });
  } catch (error) {
    console.error("Public profiles error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve public profiles.",
    });
  }
};

// POST /api/profile/me/photo
// Upload the logged-in user's profile photo to Cloudinary.
export const uploadMyProfilePhoto = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({
        success: false,
        message: "Please select a profile photo.",
      });
    }

    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      {
        $set: {
          profilePhoto: req.file.path,
        },
        $setOnInsert: {
          user: req.user.id,
        },
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
      message: "Profile photo uploaded successfully.",
      profilePhoto: req.file.path,
      profile,
    });
  } catch (error) {
    console.error("Profile photo upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to upload profile photo.",
    });
  }
};
