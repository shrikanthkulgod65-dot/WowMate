import mongoose from "mongoose";

import Payment from "../models/Payment.js";
import Subscription from "../models/Subscription.js";
import { getPlan } from "../config/subscriptionPlans.js";

/**
 * Activates a subscription only after payment has been independently
 * verified through the payment provider or an authentic webhook.
 *
 * Razorpay amounts are supplied in paise.
 * Cashfree amounts are supplied in INR.
 */
export async function activateSubscriptionForPayment({
  orderId,
  paymentId,
  amount,
  currency,
  signature = "",
  provider = "cashfree",
}) {
  if (!orderId || !paymentId) {
    throw new Error("Payment order ID and payment ID are required.");
  }

  if (!["razorpay", "cashfree"].includes(provider)) {
    throw new Error("Unsupported payment provider.");
  }

  const orderField =
    provider === "cashfree" ? "cashfreeOrderId" : "razorpayOrderId";

  const transactionField =
    provider === "cashfree" ? "cashfreePaymentId" : "razorpayPaymentId";

  const receivedAmount = Number(amount);

  if (!Number.isFinite(receivedAmount)) {
    throw new Error("Invalid payment amount.");
  }

  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      const paymentRecord = await Payment.findOne({
        [orderField]: orderId,
        provider,
      }).session(session);

      if (!paymentRecord) {
        throw new Error("Matching payment order was not found.");
      }

      const expectedAmount =
        provider === "cashfree"
          ? Number(paymentRecord.amount.toFixed(2))
          : Math.round(paymentRecord.amount * 100);

      if (
        Math.abs(receivedAmount - expectedAmount) > 0.001 ||
        String(currency).toUpperCase() !==
          String(paymentRecord.currency).toUpperCase()
      ) {
        throw new Error("Payment amount or currency does not match.");
      }

      const plan = getPlan(paymentRecord.plan);

      if (!plan) {
        throw new Error("Subscription plan was not found.");
      }

      const existingPaymentId = paymentRecord[transactionField];

      if (
        paymentRecord.status === "paid" &&
        existingPaymentId &&
        existingPaymentId !== paymentId
      ) {
        throw new Error(
          "This order is already associated with another payment."
        );
      }

      let subscription = await Subscription.findOne({
        payment: paymentRecord._id,
      }).session(session);

      if (!subscription) {
        const now = new Date();

        const expiresAt = new Date(
          now.getTime() +
            plan.durationDays * 24 * 60 * 60 * 1000
        );

        [subscription] = await Subscription.create(
          [
            {
              user: paymentRecord.user,
              plan: plan.id,
              amount: paymentRecord.amount,
              currency: paymentRecord.currency,
              status: "active",
              startsAt: now,
              expiresAt,
              payment: paymentRecord._id,
            },
          ],
          { session }
        );
      }

      paymentRecord.status = "paid";
      paymentRecord[transactionField] = paymentId;

      // Preserve Razorpay signature for historical compatibility.
      if (provider === "razorpay" && signature) {
        paymentRecord.razorpaySignature = signature;
      }

      await paymentRecord.save({ session });

      result = subscription;
    });

    return result;
  } finally {
    await session.endSession();
  }
}
