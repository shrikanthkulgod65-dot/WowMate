
import express from "express";

import {
  getMyProfile,
  updateMyProfile,
  discoverProfiles,
  getPublicProfiles,
} from "../controllers/profileController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// PUBLIC ROUTE - no login required.
// Visitors can see only names and profile photos.
router.get("/public", getPublicProfiles);

// All existing routes require authentication.
router.use(authMiddleware);

// Get logged-in user's profile.
router.get("/me", getMyProfile);

// Create or update logged-in user's profile.
router.put("/me", updateMyProfile);

// Get other registered members for Discover Profiles.
router.get("/discover", discoverProfiles);

export default router;
