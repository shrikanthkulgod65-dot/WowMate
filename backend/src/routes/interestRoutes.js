
import express from "express";

import {
  sendInterest,
  getSentInterests,
  getReceivedInterests,
  respondToInterest,
  cancelInterest,
} from "../controllers/interestController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// All interest routes require authentication.
router.use(authMiddleware);

// Send an interest to another user.
router.post("/", sendInterest);

// View interests sent by the logged-in user.
router.get("/sent", getSentInterests);

// View interests received by the logged-in user.
router.get("/received", getReceivedInterests);

// Accept or reject an incoming interest.
router.patch("/:interestId/respond", respondToInterest);

// Cancel a pending interest sent by the logged-in user.
router.delete("/:interestId", cancelInterest);

export default router;
