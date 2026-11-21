
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
import profilePhotoUpload from "../middleware/profilePhotoUpload.js";

const router = express.Router();

// PUBLIC ROUTE - no login required.
// Visitors can see only names and profile photos.
router.get("/public", getPublicProfiles);

// All routes below this line require authentication.
router.use(authMiddleware);

// Get logged-in user's profile.
router.get("/me", getMyProfile);

// Create or update logged-in user's profile.
router.put("/me", updateMyProfile);

// Upload logged-in user's profile photo to Cloudinary.
// Frontend must send FormData with the field name "photo".
router.post(
  "/me/photo",
  profilePhotoUpload.single("photo"),
  uploadMyProfilePhoto
);

// Get other registered members for Discover Profiles.
router.get("/discover", discoverProfiles);

// Search registered members.
router.get("/search", searchProfiles);

export default router;
