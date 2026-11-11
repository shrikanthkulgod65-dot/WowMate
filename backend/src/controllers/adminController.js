
import User from "../models/User.js";

// GET /api/admin/dashboard
export async function getAdminDashboard(req, res) {
  try {
    const [
      totalUsers,
      totalBrokers,
      activeAccounts,
      suspendedAccounts,
      blockedAccounts,
      verifiedEmails,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "broker" }),
      User.countDocuments({ accountStatus: "active" }),
      User.countDocuments({ accountStatus: "suspended" }),
      User.countDocuments({ accountStatus: "blocked" }),
      User.countDocuments({ isEmailVerified: true }),
      User.find({})
        .select("-password")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalBrokers,
        activeAccounts,
        suspendedAccounts,
        blockedAccounts,
        verifiedEmails,
        recentUsers,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load admin dashboard.",
    });
  }
}

// GET /api/admin/users
export async function getAdminUsers(req, res) {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number(req.query.limit) || 20)
    );

    const search = String(req.query.search || "").trim();
    const filter = {};

    if (["user", "broker"].includes(req.query.role)) {
      filter.role = req.query.role;
    }

    if (
      ["active", "suspended", "blocked"].includes(
        req.query.status
      )
    ) {
      filter.accountStatus = req.query.status;
    }

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Admin users error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load registered users.",
    });
  }
}
