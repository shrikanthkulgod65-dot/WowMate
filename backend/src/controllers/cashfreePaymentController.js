import crypto from "crypto";

import cashfree from "../config/cashfree.js";
import Payment from "../models/Payment.js";
import Subscription from "../models/Subscription.js";
import { getPlan } from "../config/subscriptionPlans.js";
import {
  activateSubscriptionForPayment,
} from "../services/subscriptionPaymentService.js";

const API_VERSION = "2023-08-01";

function normalizeIndianPhone(value) {
  let phone = String(value || "").replace(/\D/g, "");

  if (phone.startsWith("91") && phone.length === 12) {
    phone = phone.slice(2);
  }

  if (phone.startsWith("0") && phone.length === 11) {
    phone = phone.slice(1);
  }

  return /^\d{10}$/.test(phone) ? phone : "";
}

function getFrontendUrl() {
  return (
    process.env.FRONTEND_URL ||
    process.env.CLIENT_URL ||
    "https://wowmate.co.in"
  ).replace(/\/+$/, "");
}

function getBackendUrl() {
  return (
    process.env.BACKEND_PUBLIC_URL ||
    "https://wowmate-backend.vercel.app"
  ).replace(/\/+$/, "");
}

// Create a Cashfree order for a subscription.
export async function createCashfreePaymentOrder(req, res) {
  try {
    const { planId } = req.body;

    const plan = getPlan(planId);

    if (!plan) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription plan.",
      });
    }

    const user = req.user;
    const phone = normalizeIndianPhone(user.mobile);

    if (!phone) {
      return res.status(400).json({
        success: false,
        message:
          "Please add a valid 10-digit mobile number to your profile before payment.",
      });
    }

    const amount = Number(plan.price);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription amount.",
      });
    }

    const orderId =
      `wm_${Date.now()}_${crypto.randomBytes(8).toString("hex")}`;

    const frontendUrl = getFrontendUrl();
    const backendUrl = getBackendUrl();

    const orderRequest = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",

      customer_details: {
        customer_id: String(user._id),
        customer_name: String(user.fullName || "WowMate Member")
          .replace(/[^a-zA-Z0-9 ]/g, "")
          .slice(0, 100),
        customer_email: user.email || undefined,
        customer_phone: phone,
      },

      order_meta: {
        return_url:
          `${frontendUrl}/payment-result?order_id={order_id}`,
        notify_url:
          `${backendUrl}/api/subscriptions/cashfree/webhook`,
        payment_methods: "upi",
      },

      order_note: `WowMate ${plan.name} Membership`,

      order_tags: {
        userId: String(user._id),
        planId: plan.id,
      },
    };

    const cashfreeResponse = await cashfree.PGCreateOrder(
      orderRequest,
      crypto.randomUUID(),
      orderId
    );

    const cashfreeOrder = cashfreeResponse.data;

    if (
      !cashfreeOrder?.order_id ||
      !cashfreeOrder?.payment_session_id
    ) {
      throw new Error("Cashfree did not return a payment session.");
    }

    const payment = await Payment.create({
      user: user._id,
      plan: plan.id,
      amount,
      currency: "INR",
      provider: "cashfree",
      status: "created",
      cashfreeOrderId: cashfreeOrder.order_id,
      cashfreePaymentSessionId:
        cashfreeOrder.payment_session_id,
    });

    return res.status(201).json({
      success: true,
      message: "Cashfree payment order created.",
      paymentId: payment._id,

      order: {
        id: cashfreeOrder.order_id,
        amount: cashfreeOrder.order_amount,
        currency: cashfreeOrder.order_currency,
        paymentSessionId: cashfreeOrder.payment_session_id,
      },
      environment:
        process.env.CASHFREE_ENV === "PRODUCTION" ? "production" : "sandbox",
      plan: {
        id: plan.id,
        name: plan.name,
        price: amount,
      },
    });
  } catch (error) {
    console.error(
      "Cashfree create order error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to create Cashfree payment order.",
    });
  }
}

// Verify payment directly with Cashfree before activating membership.
export async function verifyCashfreePayment(req, res) {
  try {
    const orderId = String(
      req.body.orderId || req.body.order_id || ""
    ).trim();

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Cashfree order ID is required.",
      });
    }

    const paymentRecord = await Payment.findOne({
      user: req.user._id,
      provider: "cashfree",
      cashfreeOrderId: orderId,
    });

    if (!paymentRecord) {
      return res.status(404).json({
        success: false,
        message: "Cashfree payment order not found.",
      });
    }

    // Fetch order and its transactions directly from Cashfree.
    const [orderResponse, paymentsResponse] = await Promise.all([
      cashfree.PGFetchOrder(orderId),
      cashfree.PGOrderFetchPayments(orderId),
    ]);

    const order = orderResponse.data;
    const payments = paymentsResponse.data || [];

    const expectedAmountInPaise =
      Math.round(paymentRecord.amount * 100);

    if (
      order.order_id !== orderId ||
      order.order_status !== "PAID" ||
      Math.round(Number(order.order_amount) * 100) !==
        expectedAmountInPaise ||
      order.order_currency !== paymentRecord.currency
    ) {
      return res.status(202).json({
        success: false,
        status: "pending",
        message: "Payment is not confirmed yet.",
      });
    }

    const successfulPayment = payments.find((item) =>
      item.order_id === orderId &&
      item.payment_status === "SUCCESS" &&
      item.is_captured === true
    );

    if (!successfulPayment?.cf_payment_id) {
      return res.status(202).json({
        success: false,
        status: "pending",
        message: "Successful payment confirmation is pending.",
      });
    }

    const paymentAmount = Number(successfulPayment.payment_amount);
    const paymentCurrency =
      successfulPayment.payment_currency ||
      successfulPayment.order_currency;

    if (
      !Number.isFinite(paymentAmount) ||
      Math.round(paymentAmount * 100) !== expectedAmountInPaise ||
      paymentCurrency !== paymentRecord.currency
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment amount or currency does not match.",
      });
    }

    const subscription = await activateSubscriptionForPayment({
      orderId,
      paymentId: String(successfulPayment.cf_payment_id),
      amount: paymentAmount,
      currency: paymentCurrency,
      provider: "cashfree",
    });

    return res.json({
      success: true,
      message: "Cashfree payment verified and membership activated.",
      subscription,
    });
  } catch (error) {
    console.error(
      "Cashfree payment verification error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Cashfree payment verification failed.",
    });
  }
}
