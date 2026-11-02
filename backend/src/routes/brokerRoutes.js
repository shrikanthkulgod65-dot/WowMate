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

const router = express.Router();

// Public broker directory
router.get("/profiles", getAllBrokers);

// Logged-in broker's own profile
router.get("/profile", protect, brokerOnly, getMyBrokerProfile);
router.put("/profile", protect, brokerOnly, updateMyBrokerProfile);

export default router;