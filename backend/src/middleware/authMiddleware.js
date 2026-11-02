import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes using JWT authentication
export async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user || user.accountStatus !== "active") {
      return res.status(401).json({
        success: false,
        message: "Invalid or inactive account.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
}

// Allow broker accounts only
export function brokerOnly(req, res, next) {
  if (req.user?.role !== "broker") {
    return res.status(403).json({
      success: false,
      message: "Broker access only.",
    });
  }

  next();
}


export default protect;