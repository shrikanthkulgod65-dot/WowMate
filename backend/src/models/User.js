import mongoose from "mongoose";

const brokerDetailsSchema = new mongoose.Schema(
  {
    businessName: { type: String, trim: true, default: "" },
    experienceYears: { type: Number, min: 0, default: 0 },
    city: { type: String, trim: true, default: "" },
    serviceArea: { type: String, trim: true, default: "" },
    about: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    mobile: { type: String, trim: true, default: "" },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["user", "broker", "admin"],
      default: "user",
      index: true,
    },
    brokerDetails: {
      type: brokerDetailsSchema,
      default: undefined,
    },
    accountStatus: {
      type: String,
      enum: ["active", "suspended", "blocked"],
      default: "active",
    },
    isEmailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
