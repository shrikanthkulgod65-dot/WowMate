
import mongoose from "mongoose";

// Cache the connection across serverless invocations (Vercel reuses warm instances).
let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error("MONGO_URI is missing from the environment variables.");
  }

  // Return existing connection if already established.
  if (cached.conn) {
    return cached.conn;
  }

  // Reuse an in-flight connection promise to avoid duplicate connections.
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongoURI, {
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 15000,
        bufferCommands: false,
      })
      .then((connection) => {
        console.log("MongoDB connected:", connection.connection.host);
        return connection;
      })
      .catch((error) => {
        cached.promise = null; // Allow retry on next request.
        console.error("MongoDB connection failed:", error.message);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;
