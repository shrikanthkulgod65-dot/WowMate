import express from "express";
import {
  registerUser,
  registerBroker,
  loginUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/register-broker", registerBroker); // Kept for compatibility with older clients.
router.post("/login", loginUser);

export default router;
