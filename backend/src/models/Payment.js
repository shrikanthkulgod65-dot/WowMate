
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    plan: {
      type: String,
      enum: ["starter", "silver", "gold"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    provider: {
      type: String,
      enum: ["razorpay"],
      default: "razorpay",
    },

    status: {
      type: String,
      enum: ["created", "paid", "failed", "refunded"],
      default: "created",
      index: true,
    },

    razorpayOrderId: {
      type: String,
      default: "",
      index: true,
    },

    razorpayPaymentId: {
      type: String,
      default: "",
      index: true,
    },

    razorpaySignature: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Payment =
  mongoose.models.Payment ||
  mongoose.model("Payment", paymentSchema);

export default Payment;
