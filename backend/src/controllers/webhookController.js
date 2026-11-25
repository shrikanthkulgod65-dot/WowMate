
import crypto from "crypto";

import Payment from "../models/Payment.js";
import WebhookEvent from "../models/WebhookEvent.js";
import {
  activateSubscriptionForPayment,
} from "../services/subscriptionPaymentService.js";

export async function handleRazorpayWebhook(req, res) {
  const signature = req.headers["x-razorpay-signature"];
  const eventId = req.headers["x-razorpay-event-id"];

  let claimedEvent = false;

  try {
    // Verify original raw request body
    if (!Buffer.isBuffer(req.body)) {
      return res.status(400).json({
        success: false,
        message: "Raw webhook body is required.",
      });
    }

    if (
      !signature ||
      !eventId ||
      !process.env.RAZORPAY_WEBHOOK_SECRET
    ) {
      return res.status(400).json({
        success: false,
        message: "Webhook verification details are missing.",
      });
    }

    // Validate signature format before comparison
    if (
      typeof signature !== "string" ||
      !/^[a-fA-F0-9]{64}$/.test(signature)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature format.",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(req.body)
      .digest("hex");

    const received = Buffer.from(signature, "hex");
    const expected = Buffer.from(expectedSignature, "hex");

    if (
      received.length !== expected.length ||
      !crypto.timingSafeEqual(received, expected)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature.",
      });
    }

    // Parse verified webhook payload
    let event;

    try {
      event = JSON.parse(req.body.toString("utf8"));
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook JSON.",
      });
    }

    const eventType = event.event;
    const entity = event.payload?.payment?.entity;

    if (!eventType) {
      return res.status(400).json({
        success: false,
        message: "Webhook event type is missing.",
      });
    }

    // Atomically claim this webhook event.
    try {
      await WebhookEvent.create({
        eventId,
        eventType,
        status: "processing",
        paymentId: entity?.id || "",
      });

      claimedEvent = true;
    } catch (error) {
      if (error.code !== 11000) {
        throw error;
      }

      const existingEvent = await WebhookEvent.findOne({ eventId });

      if (!existingEvent) {
        throw new Error("Unable to retrieve existing webhook event.");
      }

      if (existingEvent.status === "processed") {
        return res.status(200).json({
          success: true,
          message: "Webhook event already processed.",
        });
      }

      // Allow retry of a previously failed event.
      if (existingEvent.status === "failed") {
        const retryEvent = await WebhookEvent.findOneAndUpdate(
          {
            eventId,
            status: "failed",
          },
          {
            $set: {
              status: "processing",
              errorMessage: "",
              paymentId: entity?.id || "",
            },
          },
          { returnDocument: "after" }
        );

        if (retryEvent) {
          claimedEvent = true;
        }
      }

      // Recover an event stuck in processing for over 5 minutes.
      if (
        !claimedEvent &&
        existingEvent.status === "processing" &&
        existingEvent.updatedAt < new Date(Date.now() - 5 * 60 * 1000)
      ) {
        const recoveredEvent = await WebhookEvent.findOneAndUpdate(
          {
            eventId,
            status: "processing",
            updatedAt: existingEvent.updatedAt,
          },
          {
            $set: {
              status: "processing",
              errorMessage: "",
            },
          },
          { returnDocument: "after" }
        );

        if (recoveredEvent) {
          claimedEvent = true;
        }
      }

      if (!claimedEvent) {
        return res.status(500).json({
          success: false,
          message: "Webhook event is already being processed. Please retry.",
        });
      }
    }

    // Handle successful captured payments.
    if (eventType === "payment.captured") {
      if (
        !entity?.order_id ||
        !entity?.id ||
        entity.status !== "captured"
      ) {
        throw new Error(
          "Captured payment details are incomplete or invalid."
        );
      }

      await activateSubscriptionForPayment({
        orderId: entity.order_id,
        paymentId: entity.id,
        amount: entity.amount,
        currency: entity.currency,
      });
    }

    // Handle failed payments without changing paid records.
    if (eventType === "payment.failed") {
      if (!entity?.order_id || !entity?.id) {
        throw new Error("Failed payment details are incomplete.");
      }

      await Payment.updateOne(
        {
          razorpayOrderId: entity.order_id,
          status: { $ne: "paid" },
        },
        {
          $set: {
            status: "failed",
            razorpayPaymentId: entity.id,
          },
        }
      );
    }

    // Mark the event processed only after successful handling.
    await WebhookEvent.updateOne(
      {
        eventId,
        status: "processing",
      },
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
      message: "Webhook processed.",
    });
  } catch (error) {
    console.error("Razorpay webhook error:", error);

    // Allow Razorpay to retry failed processing.
    if (claimedEvent && eventId) {
      try {
        await WebhookEvent.updateOne(
          {
            eventId,
            status: "processing",
          },
          {
            $set: {
              status: "failed",
              errorMessage:
                error.message || "Webhook processing failed.",
            },
          }
        );
      } catch (updateError) {
        console.error(
          "Webhook event status update error:",
          updateError.message
        );
      }
    }

    return res.status(500).json({
      success: false,
      message: "Webhook processing failed.",
    });
  }
}
