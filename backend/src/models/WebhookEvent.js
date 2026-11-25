
import mongoose from "mongoose";

const webhookEventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
    },

    eventType: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["processing", "processed", "failed"],
      default: "processing",
      index: true,
    },

    paymentId: {
      type: String,
      default: "",
    },

    errorMessage: {
      type: String,
      default: "",
    },

    processedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Match the unique index already created in MongoDB Atlas.
webhookEventSchema.index(
  { eventId: 1 },
  {
    unique: true,
    name: "unique_webhook_event",
  }
);

const WebhookEvent =
  mongoose.models.WebhookEvent ||
  mongoose.model("WebhookEvent", webhookEventSchema);

export default WebhookEvent;
