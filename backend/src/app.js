
import "dotenv/config";

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import interestRoutes from "./routes/interestRoutes.js";
import brokerRoutes from "./routes/brokerRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";

import {
  handleRazorpayWebhook,
} from "./controllers/webhookController.js";

import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middleware/errorMiddleware.js";

const app = express();

// CORS configuration
const allowedOrigins = [
  "http://wowmate.co.in",
  "https://wowmate.co.in",
  "https://www.wowmate.co.in",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,
]
  .filter(Boolean)
  .map((origin) => origin.replace(/\/+$/, ""));

app.use(
  cors({
    origin(origin, callback) {
      // Allow native apps and requests without an Origin header.
      if (
        !origin ||
        allowedOrigins.includes(origin.replace(/\/+$/, ""))
      ) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-razorpay-signature",
      "x-razorpay-event-id",
    ],

    credentials: true,
  })
);

// Ensure MongoDB is connected before every API request.
// Supports Vercel serverless deployments.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    return next();
  } catch (error) {
    console.error("DB connection error:", error.message);

    return res.status(503).json({
      success: false,
      message: "Service temporarily unavailable. Please try again.",
    });
  }
});

// Razorpay webhook must receive the original raw request body.
// Keep this BEFORE express.json().
app.post(
  "/api/subscriptions/webhook",
  express.raw({
    type: "application/json",
    limit: "1mb",
  }),
  handleRazorpayWebhook
);

// Parse other incoming request bodies
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Root API
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Wowmate API",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Wowmate API is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Existing API routes
app.use("/api/interests", interestRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/broker", brokerRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

// Founder & CEO Admin API
app.use("/api/admin", adminRoutes);

// Error handling must remain last
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
