
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "Server authentication is not configured.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select(
      "_id fullName email role accountStatus"
    );

    if (!user || user.accountStatus !== "active") {
      return res.status(401).json({
        success: false,
        message: "Your account is unavailable.",
      });
    }

    const ownerEmail = String(
      process.env.OWNER_ADMIN_EMAIL || ""
    ).trim().toLowerCase();

    if (
      user.role !== "admin" ||
      !ownerEmail ||
      user.email.toLowerCase() !== ownerEmail
    ) {
      return res.status(403).json({
        success: false,
        message: "Founder & CEO access only.",
      });
    }

    req.admin = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
}
