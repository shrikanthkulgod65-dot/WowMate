
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function optionalAuth(req, res, next) {
  req.user = null;

  try {
    const authHeader = req.headers.authorization;

    // No token: continue as a public visitor.
    if (!authHeader?.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.slice(7).trim();

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    // Invalid or inactive account: continue with photo-only access.
    if (!user || user.accountStatus !== "active") {
      return next();
    }

    req.user = user;

    return next();
  } catch (error) {
    // Invalid or expired token: treat the request as a guest.
    req.user = null;
    return next();
  }
}
