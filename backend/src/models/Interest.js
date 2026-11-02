
import mongoose from "mongoose";

const interestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// A user cannot send duplicate interests to the same person.
interestSchema.index(
  { sender: 1, receiver: 1 },
  { unique: true }
);

// Prevent a user from expressing interest in themselves.
interestSchema.pre("validate", function () {
  if (
    this.sender &&
    this.receiver &&
    this.sender.toString() === this.receiver.toString()
  ) {
    this.invalidate("receiver", "You cannot send interest to yourself.");
  }
});

const Interest = mongoose.model("Interest", interestSchema);

export default Interest;