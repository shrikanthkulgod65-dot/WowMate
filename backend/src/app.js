
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import interestRoutes from "./routes/interestRoutes.js";
import brokerRoutes from "./routes/brokerRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";

import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow native apps and requests without an Origin header.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Parse incoming request bodies
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

// API routes
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
