
import mongoose from "mongoose";

const contactUnlockSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },

    profileOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
      index: true,
    },

    unlockedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

contactUnlockSchema.index(
  { member: 1, profile: 1 },
  {
    unique: true,
    name: "unique_member_profile_contact_unlock",
  }
);

contactUnlockSchema.index({ subscription: 1, member: 1 });

const ContactUnlock =
  mongoose.models.ContactUnlock ||
  mongoose.model("ContactUnlock", contactUnlockSchema);

export default ContactUnlock;
