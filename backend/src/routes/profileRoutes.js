
import express from "express";

import {
  getMyProfile,
  updateMyProfile,
  discoverProfiles,
  searchProfiles,
  getPublicProfiles,
  uploadMyProfilePhoto,
} from "../controllers/profileController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import optionalAuth from "../middleware/optionalAuth.js";
import { requireFeature } from "../middleware/subscriptionMiddleware.js";
import profilePhotoUpload from "../middleware/profilePhotoUpload.js";

const router = express.Router();

// Public access: profile photos only.
router.get("/public", optionalAuth, getPublicProfiles);

// Guests and logged-in users can discover profiles.
// Controller applies photo-only, limited, or full access.
router.get("/discover", optionalAuth, discoverProfiles);

// The following routes require login.
router.use(authMiddleware);

router.get("/me", getMyProfile);
router.put("/me", updateMyProfile);

router.post(
  "/me/photo",
  profilePhotoUpload.single("photo"),
  uploadMyProfilePhoto
);

// Advanced profile search: Silver and Gold.
router.get(
  "/search",
  requireFeature("advancedFilters"),
  searchProfiles
);

export default router;
