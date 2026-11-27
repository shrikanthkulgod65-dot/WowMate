import express from "express";

import {
  getSubscriptionPlans,
  getMySubscription,
} from "../controllers/subscriptionController.js";

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

// Cashfree subscription payments
router.post("/cashfree/create-order", protect, createCashfreePaymentOrder);
router.post("/cashfree/verify-payment", protect, verifyCashfreePayment);

export default router;
