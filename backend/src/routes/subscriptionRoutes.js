import express from "express";

import {
  getSubscriptionPlans,
  getMySubscription,
} from "../controllers/subscriptionController.js";

import {
  createPaymentOrder,
  verifyPayment,
} from "../controllers/paymentController.js";

import {
  createCashfreePaymentOrder,
  verifyCashfreePayment,
} from "../controllers/cashfreePaymentController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public subscription plans
router.get("/plans", getSubscriptionPlans);

// Logged-in user's subscription
router.get("/me", protect, getMySubscription);

// Existing Razorpay routes
router.post("/create-order", protect, createPaymentOrder);
router.post("/verify-payment", protect, verifyPayment);

// Cashfree payment routes
router.post("/cashfree/create-order", protect, createCashfreePaymentOrder);
router.post("/cashfree/verify-payment", protect, verifyCashfreePayment);

export default router;
