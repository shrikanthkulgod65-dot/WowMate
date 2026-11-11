import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function createToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from backend environment variables.");
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function publicUser(user) {
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    mobile: user.mobile || "",
    role: user.role,
    brokerDetails:
      user.role === "broker" ? user.brokerDetails || {} : undefined,
    isEmailVerified: Boolean(user.isEmailVerified),
  };
}

function normalizeMobile(value) {
  return String(value || "").replace(/\D/g, "");
}

async function createAccount(req, res, forcedRole = null) {
  try {
    const {
      fullName,
      email,
      password,
      mobile,
      accountType,
      brokerDetails,
    } = req.body || {};

    const role = forcedRole || (accountType === "broker" ? "broker" : "user");
    const normalizedName = String(fullName || "").trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedMobile = normalizeMobile(mobile);

    if (!normalizedName || !normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, and password are required.",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (String(password).length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    if (mobile && (normalizedMobile.length < 10 || normalizedMobile.length > 15)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid mobile number.",
      });
    }

    if (role === "broker") {
      const details = brokerDetails || {};

      if (
        !String(details.businessName || "").trim() ||
        !String(details.city || "").trim() ||
        !String(details.serviceArea || "").trim() ||
        !String(details.about || "").trim()
      ) {
        return res.status(400).json({
          success: false,
          message: "Please complete all required broker service details.",
        });
      }

      const years = Number(details.experienceYears);

      if (!Number.isFinite(years) || years < 0 || years > 80) {
        return res.status(400).json({
          success: false,
          message: "Enter valid broker experience in years.",
        });
      }
    }

    const existing = await User.findOne({ email: normalizedEmail });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    if (normalizedMobile) {
      const mobileExists = await User.findOne({ mobile: normalizedMobile });

      if (mobileExists) {
        return res.status(409).json({
          success: false,
          message: "This mobile number is already registered.",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userData = {
      fullName: normalizedName,
      email: normalizedEmail,
      mobile: normalizedMobile,
      password: hashedPassword,
      role,
    };

    if (role === "broker") {
      userData.brokerDetails = {
        businessName: String(brokerDetails.businessName).trim(),
        experienceYears: Number(brokerDetails.experienceYears),
        city: String(brokerDetails.city).trim(),
        serviceArea: String(brokerDetails.serviceArea).trim(),
        about: String(brokerDetails.about).trim(),
      };
    }

    const user = await User.create(userData);
    const token = createToken(user._id);

    return res.status(201).json({
      success: true,
      message:
        role === "broker"
          ? "Broker account created successfully."
          : "Account created successfully.",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account already exists with these details.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while creating the account.",
    });
  }
}

async function registerUser(req, res) {
  return createAccount(req, res);
}

async function registerBroker(req, res) {
  return createAccount(req, res, "broker");
}

async function loginUser(req, res) {
  try {
    const { email, emailOrMobile, password } = req.body || {};

    const identifier = String(emailOrMobile || email || "").trim();

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/mobile and password are required.",
      });
    }

    const isEmail = identifier.includes("@");

    const lookup = isEmail
      ? { email: identifier.toLowerCase() }
      : { mobile: normalizeMobile(identifier) };

    const user = await User.findOne(lookup).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/mobile or password.",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email/mobile or password.",
      });
    }

    if (user.accountStatus !== "active") {
      return res.status(403).json({
        success: false,
        message:
          "This account is currently unavailable. Please contact support.",
      });
    }

    const token = createToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while logging in.",
    });
  }
}

export { registerUser, registerBroker, loginUser };
