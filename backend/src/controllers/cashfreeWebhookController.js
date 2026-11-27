import crypto from "crypto";

import cashfree from "../config/cashfree.js";
import Payment from "../models/Payment.js";
import WebhookEvent from "../models/WebhookEvent.js";

import {
  activateSubscriptionForPayment,
} from "../services/subscriptionPaymentService.js";

export async function handleCashfreeWebhook(req, res) {
  let eventId = "";
  let claimedEvent = false;

  try {
    // Cashfree signature verification requires the original raw body.
    if (!Buffer.isBuffer(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Raw webhook body is required.",
      });
    }

    const rawBody = req.body.toString("utf8");
    const signature = req.headers["x-webhook-signature"];
    const timestamp = req.headers["x-webhook-timestamp"];

    if (!signature || !timestamp) {
      return res.status(400).json({
        success: false,
        message: "Cashfree webhook signature headers are missing.",
      });
    }

    // Verify authenticity before processing the payload.
    const verified = cashfree.PGVerifyWebhookSignature(
      signature,
      rawBody,
      timestamp
    );

    const event = verified?.object || verified;

    const eventType = event?.type;
    const order = event?.data?.order;
    const payment = event?.data?.payment;

    const supportedEvents = [
      "PAYMENT_SUCCESS_WEBHOOK",
      "PAYMENT_FAILED_WEBHOOK",
      "PAYMENT_USER_DROPPED_WEBHOOK",
    ];

    if (!supportedEvents.includes(eventType)) {
      return res.status(200).json({
        success: true,
        message: "Cashfree event acknowledged.",
      });
    }

    const orderId = String(order?.order_id || "");
    const paymentId = String(payment?.cf_payment_id || "");
    const paymentStatus = String(payment?.payment_status || "");

    if (!orderId || !paymentId) {
      throw new Error("Cashfree webhook payment details are incomplete.");
    }

    // Stable event key because Cashfree's payment webhook payload
    // does not require a separate event ID header.
    eventId = crypto
      .createHash("sha256")
      .update(
        `${eventType}|${orderId}|${paymentId}|${paymentStatus}`
      )
      .digest("hex");

    // Atomically claim the event to prevent duplicate processing.
    try {
      await WebhookEvent.create({
        eventId,
        eventType,
        status: "processing",
        paymentId,
      });

      claimedEvent = true;
    } catch (error) {
      if (error.code !== 11000) {
        throw error;
      }

      const existingEvent = await WebhookEvent.findOne({ eventId });

      if (!existingEvent) {
        throw new Error("Unable to retrieve Cashfree webhook event.");
      }

      if (existingEvent.status === "processed") {
        return res.status(200).json({
          success: true,
          message: "Webhook event already processed.",
        });
      }

      // Retry an event that previously failed.
      if (existingEvent.status === "failed") {
        const retry = await WebhookEvent.findOneAndUpdate(
          { eventId, status: "failed" },
          {
            $set: {
              status: "processing",
              errorMessage: "",
              paymentId,
            },
          },
          { new: true }
        );

        claimedEvent = Boolean(retry);
      }

      // Recover an interrupted event after five minutes.
      if (
        !claimedEvent &&
        existingEvent.status === "processing" &&
        existingEvent.updatedAt < new Date(Date.now() - 5 * 60 * 1000)
      ) {
        const recovered = await WebhookEvent.findOneAndUpdate(
          {
            eventId,
            status: "processing",
            updatedAt: existingEvent.updatedAt,
          },
          {
            $set: {
              errorMessage: "",
              paymentId,
            },
          },
          { new: true }
        );

        claimedEvent = Boolean(recovered);
      }

      if (!claimedEvent) {
        return res.status(500).json({
          success: false,
          message: "Webhook event is already being processed. Retry later.",
        });
      }
    }

    const paymentRecord = await Payment.findOne({
      provider: "cashfree",
      cashfreeOrderId: orderId,
    });

    if (!paymentRecord) {
      throw new Error("Matching Cashfree payment record was not found.");
    }

    if (eventType === "PAYMENT_SUCCESS_WEBHOOK") {
      if (
        paymentStatus !== "SUCCESS" ||
        !Number.isFinite(Number(payment.payment_amount)) ||
        !payment.payment_currency ||
        Number(order.order_amount) !== Number(paymentRecord.amount) ||
        order.order_currency !== paymentRecord.currency
      ) {
        throw new Error(
          "Cashfree payment status, amount or currency does not match."
        );
      }

      await activateSubscriptionForPayment({
        orderId,
        paymentId,
        amount: Number(payment.payment_amount),
        currency: payment.payment_currency,
        provider: "cashfree",
      });
    }

    if (
      eventType === "PAYMENT_FAILED_WEBHOOK" ||
      eventType === "PAYMENT_USER_DROPPED_WEBHOOK"
    ) {
      if (paymentRecord.status !== "paid") {
        await Payment.updateOne(
          {
            _id: paymentRecord._id,
            status: { $ne: "paid" },
          },
          {
            $set: { status: "failed" },
          }
        );
      }
    }

    await WebhookEvent.updateOne(
      { eventId, status: "processing" },
      {
        $set: {
          status: "processed",
          processedAt: new Date(),
          errorMessage: "",
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Cashfree webhook processed.",
    });
  } catch (error) {
    console.error(
      "Cashfree webhook error:",
      error.response?.data || error.message
    );

    if (claimedEvent && eventId) {
      try {
        await WebhookEvent.updateOne(
          { eventId, status: "processing" },
          {
            $set: {
              status: "failed",
              errorMessage: error.message || "Webhook processing failed.",
            },
          }
        );
      } catch (updateError) {
        console.error(
          "Cashfree webhook event update error:",
          updateError.message
        );
      }
    }

    return res.status(500).json({
      success: false,
      message: "Cashfree webhook processing failed.",
    });
  }
}
