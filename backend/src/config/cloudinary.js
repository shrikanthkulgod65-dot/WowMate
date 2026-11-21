
import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

// Check that all required Cloudinary credentials exist.
const requiredVariables = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const missingVariables = requiredVariables.filter(
  (variable) => !process.env[variable]?.trim()
);

if (missingVariables.length > 0) {
  throw new Error(
    `Missing Cloudinary environment variables: ${missingVariables.join(", ")}`
  );
}

// Configure Cloudinary.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
  api_key: process.env.CLOUDINARY_API_KEY.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET.trim(),
  secure: true,
});

export default cloudinary;
