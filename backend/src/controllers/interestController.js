
import mongoose from "mongoose";
import Interest from "../models/Interest.js";
import Profile from "../models/Profile.js";

// POST /api/interests
// Send interest to another member.
export const sendInterest = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId } = req.body;

    if (!receiverId || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({
        success: false,
        message: "Valid receiver ID is required.",
      });
    }

    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot send interest to yourself.",
      });
    }

    const receiverProfile = await Profile.findOne({
      user: receiverId,
      isActive: true,
    });

    if (!receiverProfile) {
      return res.status(404).json({
        success: false,
        message: "Member profile not found or inactive.",
      });
    }

    const existingInterest = await Interest.findOne({
      sender: senderId,
      receiver: receiverId,
    });

    if (existingInterest) {
      return res.status(409).json({
        success: false,
        message: "Interest has already been sent to this member.",
        interest: existingInterest,
      });
    }

    const interest = await Interest.create({
      sender: senderId,
      receiver: receiverId,
    });

    return res.status(201).json({
      success: true,
      message: "Interest sent successfully.",
      interest,
    });
  } catch (error) {
    console.error("Send interest error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Interest has already been sent.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to send interest.",
    });
  }
};

// GET /api/interests/sent
// Get interests sent by logged-in member.
export const getSentInterests = async (req, res) => {
  try {
    const interests = await Interest.find({
      sender: req.user.id,
    })
      .populate("receiver", "fullName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: interests.length,
      interests,
    });
  } catch (error) {
    console.error("Get sent interests error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve sent interests.",
    });
  }
};

// GET /api/interests/received
// Get interests received by logged-in member.
export const getReceivedInterests = async (req, res) => {
  try {
    const interests = await Interest.find({
      receiver: req.user.id,
    })
      .populate("sender", "fullName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: interests.length,
      interests,
    });
  } catch (error) {
    console.error("Get received interests error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve received interests.",
    });
  }
};

// PATCH /api/interests/:interestId/respond
// Accept or reject a received interest.
export const respondToInterest = async (req, res) => {
  try {
    const { interestId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(interestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interest ID.",
      });
    }

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be accepted or rejected.",
      });
    }

    const interest = await Interest.findOne({
      _id: interestId,
      receiver: req.user.id,
    });

    if (!interest) {
      return res.status(404).json({
        success: false,
        message: "Interest request not found.",
      });
    }

    if (interest.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This interest request has already been processed.",
      });
    }

    interest.status = status;
    await interest.save();

    return res.status(200).json({
      success: true,
      message: `Interest ${status} successfully.`,
      interest,
    });
  } catch (error) {
    console.error("Respond to interest error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update interest status.",
    });
  }
};

// DELETE /api/interests/:interestId
// Cancel a pending interest sent by logged-in member.
export const cancelInterest = async (req, res) => {
  try {
    const { interestId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(interestId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid interest ID.",
      });
    }

    const interest = await Interest.findOneAndDelete({
      _id: interestId,
      sender: req.user.id,
      status: "pending",
    });

    if (!interest) {
      return res.status(404).json({
        success: false,
        message: "Pending interest request not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Interest cancelled successfully.",
    });
  } catch (error) {
    console.error("Cancel interest error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to cancel interest.",
    });
  }
};
