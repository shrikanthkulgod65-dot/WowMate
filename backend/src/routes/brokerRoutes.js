
import express from "express";

import {
  getAllBrokers,
  getMyBrokerProfile,
  updateMyBrokerProfile,
} from "../controllers/brokerController.js";

import {
  protect,
  brokerOnly,
} from "../middleware/authMiddleware.js";

import optionalAuth from "../middleware/optionalAuth.js";

const router = express.Router();

// Public broker directory.
// Guests see photos only; subscription permissions are checked by the controller.
router.get("/profiles", optionalAuth, getAllBrokers);

// Logged-in broker's own profile
router.get("/profile", protect, brokerOnly, getMyBrokerProfile);
router.put("/profile", protect, brokerOnly, updateMyBrokerProfile);

export default router;