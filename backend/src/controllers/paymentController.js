
import crypto from "crypto";

import razorpay from "../config/razorpay.js";
import Payment from "../models/Payment.js";
import Subscription from "../models/Subscription.js";
import { getPlan } from "../config/subscriptionPlans.js";
import {
  activateSubscriptionForPayment,
} from "../services/subscriptionPaymentService.js";

// Create Razorpay order
export async function createPaymentOrder(req, res) {
  try {
    const { planId } = req.body;

    const plan = getPlan(planId);

    if (!plan) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription plan.",
      });
    }

    const amountInPaise = Math.round(plan.price * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `sub_${req.user._id}_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        planId: plan.id,
      },
    });

    const payment = await Payment.create({
      user: req.user._id,
      plan: plan.id,
      amount: plan.price,
      currency: "INR",
      provider: "razorpay",
      status: "created",
      razorpayOrderId: order.id,
    });

    return res.status(201).json({
      success: true,
      message: "Payment order created.",
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      paymentId: payment._id,
      keyId: process.env.RAZORPAY_KEY_ID,
      plan: {
        id: plan.id,
        name: plan.name,
        price: plan.price,
      },
    });
  } catch (error) {
    console.error("Create payment order error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create payment order.",
    });
  }
}

// Verify Razorpay payment
export async function verifyPayment(req, res) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment verification details are required.",
      });
    }

    const paymentRecord = await Payment.findOne({
      user: req.user._id,
      razorpayOrderId: razorpay_order_id,
    });

    if (!paymentRecord) {
      return res.status(404).json({
        success: false,
        message: "Payment order not found.",
      });
    }

    // Handle repeated verification safely
    if (paymentRecord.status === "paid") {
      const existingSubscription = await Subscription.findOne({
        payment: paymentRecord._id,
      });

      if (!existingSubscription) {
        return res.status(409).json({
          success: false,
          message: "Payment is marked paid but subscription is not available. Please contact support.",
        });
      }

      return res.json({
        success: true,
        message: "Payment already verified.",
        subscription: existingSubscription,
      });
    }

    // Verify Razorpay checkout signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const signatureBuffer = Buffer.from(razorpay_signature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature.",
      });
    }

    // Confirm payment directly with Razorpay
    const razorpayPayment = await razorpay.payments.fetch(
      razorpay_payment_id
    );

    if (
      razorpayPayment.order_id !== razorpay_order_id ||
      razorpayPayment.status !== "captured" ||
      razorpayPayment.amount !== Math.round(paymentRecord.amount * 100) ||
      razorpayPayment.currency !== paymentRecord.currency
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment is not captured or payment details do not match.",
      });
    }

    // Activate subscription using shared transaction service
    const subscription = await activateSubscriptionForPayment({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      amount: razorpayPayment.amount,
      currency: razorpayPayment.currency,
      signature: razorpay_signature,
    });

    return res.json({
      success: true,
      message: "Payment verified and subscription activated.",
      subscription,
    });
  } catch (error) {
    console.error("Verify payment error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed.",
    });
  }
}
