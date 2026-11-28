
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

    isPriority: {
      type: Boolean,
      default: false,
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

interestSchema.index(
  { sender: 1, receiver: 1 },
  { unique: true }
);

interestSchema.pre("validate", function () {
  if (
    this.sender &&
    this.receiver &&
    this.sender.toString() === this.receiver.toString()
  ) {
    this.invalidate("receiver", "You cannot send interest to yourself.");
  }
});

const Interest =
  mongoose.models.Interest ||
  mongoose.model("Interest", interestSchema);

export default Interest;
