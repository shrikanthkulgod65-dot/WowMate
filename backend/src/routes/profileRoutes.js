
import express from "express";

import {
  getMyProfile,
  updateMyProfile,
  discoverProfiles,
  searchProfiles,
  getPublicProfiles,
  uploadMyProfilePhoto,
} from "../controllers/profileController.js";

import {
  unlockProfileContact,
} from "../controllers/contactUnlockController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import optionalAuth from "../middleware/optionalAuth.js";
import { requireFeature } from "../middleware/subscriptionMiddleware.js";
import profilePhotoUpload from "../middleware/profilePhotoUpload.js";

const router = express.Router();

// Public profile photos only.
router.get("/public", optionalAuth, getPublicProfiles);

// Discovery controller returns only permitted profile information.
router.get("/discover", optionalAuth, discoverProfiles);

// All routes below require login.
router.use(authMiddleware);

router.get("/me", getMyProfile);
router.put("/me", updateMyProfile);

router.post(
  "/me/photo",
  profilePhotoUpload.single("photo"),
  uploadMyProfilePhoto
);

// Unlock an individual member's contact details.
router.post(
  "/:profileId/contact-unlock",
  unlockProfileContact
);

// Advanced profile search: Silver and Gold.
router.get(
  "/search",
  requireFeature("advancedFilters"),
  searchProfiles
);

export default router;
