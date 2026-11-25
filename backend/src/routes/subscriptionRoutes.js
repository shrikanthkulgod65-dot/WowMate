
import express from "express";

import {
  getSubscriptionPlans,
  getMySubscription,
} from "../controllers/subscriptionController.js";

import {
  createPaymentOrder,
  verifyPayment,
} from "../controllers/paymentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public subscription plans
router.get("/plans", getSubscriptionPlans);

// Logged-in user's subscription
router.get("/me", protect, getMySubscription);

// Create Razorpay payment order
router.post("/create-order", protect, createPaymentOrder);

// Verify Razorpay payment
router.post("/verify-payment", protect, verifyPayment);

export default router;
