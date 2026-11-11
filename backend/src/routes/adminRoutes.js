
import express from "express";
import {
  getAdminDashboard,
  getAdminUsers,
} from "../controllers/adminController.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = express.Router();

// Every route in this file requires Founder & CEO authentication.
router.use(requireAdmin);

router.get("/dashboard", getAdminDashboard);
router.get("/users", getAdminUsers);

export default router;