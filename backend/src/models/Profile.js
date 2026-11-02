import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      default: null,
    },

    religion: {
      type: String,
      trim: true,
      default: "",
    },

    community: {
      type: String,
      trim: true,
      default: "",
    },

    maritalStatus: {
      type: String,
      enum: [
        "Never Married",
        "Divorced",
        "Widowed",
        "Awaiting Divorce",
      ],
      default: "Never Married",
    },

    height: {
      type: String,
      trim: true,
      default: "",
    },

    education: {
      type: String,
      trim: true,
      default: "",
    },

    occupation: {
      type: String,
      trim: true,
      default: "",
    },

    annualIncome: {
      type: String,
      trim: true,
      default: "",
    },

    aboutMe: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    country: {
      type: String,
      trim: true,
      default: "India",
    },

    state: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      default: "",
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    partnerPreferences: {
      minAge: {
        type: Number,
        min: 18,
        default: null,
      },

      maxAge: {
        type: Number,
        min: 18,
        default: null,
      },

      preferredCity: {
        type: String,
        trim: true,
        default: "",
      },

      preferredEducation: {
        type: String,
        trim: true,
        default: "",
      },

      preferredOccupation: {
        type: String,
        trim: true,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

profileSchema.index({ city: 1, gender: 1 });
profileSchema.index({ education: 1, occupation: 1 });

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;