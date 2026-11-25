
import mongoose from "mongoose";

import Payment from "../models/Payment.js";
import Subscription from "../models/Subscription.js";
import { getPlan } from "../config/subscriptionPlans.js";

/**
 * Marks a verified, captured Razorpay payment as paid
 * and activates exactly one subscription for that payment.
 *
 * Call this only after independently verifying the payment
 * with Razorpay or validating an authentic webhook.
 */
export async function activateSubscriptionForPayment({
  orderId,
  paymentId,
  amount,
  currency,
  signature = "",
}) {
  if (!orderId || !paymentId) {
    throw new Error("Payment order ID and payment ID are required.");
  }

  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      const paymentRecord = await Payment.findOne({
        razorpayOrderId: orderId,
      }).session(session);

      if (!paymentRecord) {
        throw new Error("Matching payment order was not found.");
      }

      const expectedAmount = Math.round(paymentRecord.amount * 100);

      if (
        amount !== expectedAmount ||
        currency !== paymentRecord.currency
      ) {
        throw new Error("Payment amount or currency does not match.");
      }

      const plan = getPlan(paymentRecord.plan);

      if (!plan) {
        throw new Error("Subscription plan was not found.");
      }

      if (
        paymentRecord.status === "paid" &&
        paymentRecord.razorpayPaymentId &&
        paymentRecord.razorpayPaymentId !== paymentId
      ) {
        throw new Error("This order is already associated with another payment.");
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
      paymentRecord.razorpayPaymentId = paymentId;

      if (signature) {
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
