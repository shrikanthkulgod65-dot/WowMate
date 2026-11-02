
import express from "express";

import {
  getMyProfile,
  updateMyProfile,
  discoverProfiles,
} from "../controllers/profileController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// All profile routes require authentication.
router.use(authMiddleware);

// Get logged-in user's profile.
router.get("/me", getMyProfile);

// Create or update logged-in user's profile.
router.put("/me", updateMyProfile);

// Get other registered members for Discover Profiles.
router.get("/discover", discoverProfiles);

export default router;
