
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import healthRoutes from "./routes/healthRoutes.js";

const PORT = process.env.PORT || 5000;

// Register Health API
app.use("/api/health", healthRoutes);

const startServer = async () => {
  try {
    // Connect to MongoDB before starting the API server.
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Wowmate backend is running on port ${PORT}`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use.`);
      } else {
        console.error("Server error:", error.message);
      }

      process.exit(1);
    });
  } catch (error) {
    console.error(
      "Failed to start Wowmate:",
      error.message
    );

    process.exit(1);
  }
};

startServer();
