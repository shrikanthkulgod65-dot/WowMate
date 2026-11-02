
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import interestRoutes from "./routes/interestRoutes.js";
import brokerRoutes from "./routes/brokerRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Parse incoming request bodies
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/interests", interestRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/broker", brokerRoutes);

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

// Error handling must remain last
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
