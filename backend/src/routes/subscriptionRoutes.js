
import express from "express";

import {
  getSubscriptionPlans,
  getMySubscription,
} from "../controllers/subscriptionController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public plan list
router.get("/plans", getSubscriptionPlans);

// Logged-in user's subscription
router.get("/me", protect, getMySubscription);

export default router;
