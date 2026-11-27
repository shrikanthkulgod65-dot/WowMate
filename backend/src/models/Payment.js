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
      enum: ["razorpay", "cashfree"],
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

    cashfreeOrderId: {
      type: String,
      default: "",
      index: true,
    },

    cashfreePaymentId: {
      type: String,
      default: "",
      index: true,
    },

    cashfreePaymentSessionId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Preserve existing Razorpay indexes.
paymentSchema.index(
  { razorpayOrderId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      razorpayOrderId: { $type: "string", $gt: "" },
    },
    name: "unique_razorpay_order",
  }
);

paymentSchema.index(
  { razorpayPaymentId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      razorpayPaymentId: { $type: "string", $gt: "" },
    },
    name: "unique_razorpay_payment",
  }
);

// Add Cashfree indexes.
paymentSchema.index(
  { cashfreeOrderId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      cashfreeOrderId: { $type: "string", $gt: "" },
    },
    name: "unique_cashfree_order",
  }
);

paymentSchema.index(
  { cashfreePaymentId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      cashfreePaymentId: { $type: "string", $gt: "" },
    },
    name: "unique_cashfree_payment",
  }
);

const Payment =
  mongoose.models.Payment ||
  mongoose.model("Payment", paymentSchema);

export default Payment;
