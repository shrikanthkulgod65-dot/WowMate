
import { useEffect, useState } from "react";

import {
  Users,
  UserCheck,
  BriefcaseBusiness,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function formatDate(date) {
  if (!date) return "Date unavailable";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(date) {
  if (!date) return "Recently";

  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  );

  if (!Number.isFinite(seconds) || seconds < 0) {
    return "Recently";
  }

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in to access the admin dashboard.");
      }

      const response = await fetch(
        `${API_URL}/api/admin/dashboard`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to load dashboard data."
        );
      }

      setDashboard(result.data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = [
    {
      title: "Total Members",
      value: dashboard
        ? (dashboard.totalUsers + dashboard.totalBrokers).toLocaleString("en-IN")
        : "—",
      icon: Users,
      color: "blue",
    },
    {
      title: "Verified Emails",
      value: dashboard
        ? dashboard.verifiedEmails.toLocaleString("en-IN")
        : "—",
      icon: UserCheck,
      color: "green",
    },
    {
      title: "Broker Accounts",
      value: dashboard
        ? dashboard.totalBrokers.toLocaleString("en-IN")
        : "—",
      icon: BriefcaseBusiness,
      color: "purple",
    },
    {
      title: "Active Accounts",
      value: dashboard
        ? dashboard.activeAccounts.toLocaleString("en-IN")
        : "—",
      icon: Activity,
      color: "orange",
    },
  ];

  const activities = (dashboard?.recentUsers || []).map((user) => ({
    id: user._id,
    name:
      user.role === "broker"
        ? "New broker registration"
        : "New member registration",
    detail: `${user.fullName} registered (${user.email})`,
    time: timeAgo(user.createdAt),
    type: user.role === "broker" ? "broker" : "member",
    createdAt: user.createdAt,
  }));

  return (
    <div className="admin-dashboard">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">OVERVIEW</span>
          <h1>Founder Dashboard</h1>
          <p>Welcome back. Here's what's happening with WowMate.</p>
        </div>

        <button
          className="admin-date-button"
          onClick={loadDashboard}
          disabled={loading}
        >
          <RefreshCw size={17} />
          {loading ? "Refreshing..." : "Refresh Overview"}
        </button>
      </div>

      {error && (
        <div className="admin-demo-notice">
          <span>Dashboard connection issue</span>
          {error}
          <button
            className="admin-text-button"
            onClick={loadDashboard}
          >
            Try again
          </button>
        </div>
      )}

      <section className="admin-stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article className="admin-stat-card" key={stat.title}>
              <div className="admin-stat-top">
                <div className={`admin-stat-icon ${stat.color}`}>
                  <Icon size={21} />
                </div>

                <button
                  className="admin-more-button"
                  aria-label={`${stat.title} information`}
                  type="button"
                >
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <p>{stat.title}</p>

              <h2>
                {loading ? "Loading..." : stat.value}
              </h2>

              <div className="admin-stat-footer">
                <ArrowUpRight size={16} />
                <strong>Live data</strong>
                <span>From MongoDB</span>
              </div>
            </article>
          );
        })}
      </section>

      <section className="admin-dashboard-grid">
        <article className="admin-panel admin-activity-panel">
          <div className="admin-panel-heading">
            <div>
              <h3>Recent Registrations</h3>
              <p>Latest members registered on WowMate</p>
            </div>
          </div>

          <div className="admin-activity-list">
            {loading ? (
              <p>Loading recent registrations...</p>
            ) : activities.length > 0 ? (
              activities.map((activity) => (
                <div
                  className="admin-activity-item"
                  key={activity.id}
                >
                  <div
                    className={`admin-activity-dot ${activity.type}`}
                  />

                  <div className="admin-activity-text">
                    <strong>{activity.name}</strong>
                    <span>{activity.detail}</span>
                  </div>

                  <time title={formatDate(activity.createdAt)}>
                    {activity.time}
                  </time>
                </div>
              ))
            ) : (
              <p>No registrations found yet.</p>
            )}
          </div>
        </article>

        <article className="admin-panel admin-pending-panel">
          <div className="admin-panel-heading">
            <div>
              <h3>Account Overview</h3>
              <p>Current account status</p>
            </div>
          </div>

          <div className="admin-pending-list">
            <div className="admin-pending-item">
              <span>Active accounts</span>
              <strong>
                {loading ? "—" : dashboard?.activeAccounts ?? 0}
              </strong>
            </div>

            <div className="admin-pending-item">
              <span>Suspended accounts</span>
              <strong>
                {loading ? "—" : dashboard?.suspendedAccounts ?? 0}
              </strong>
            </div>

            <div className="admin-pending-item">
              <span>Blocked accounts</span>
              <strong>
                {loading ? "—" : dashboard?.blockedAccounts ?? 0}
              </strong>
            </div>

            <div className="admin-pending-item">
              <span>Verified emails</span>
              <strong>
                {loading ? "—" : dashboard?.verifiedEmails ?? 0}
              </strong>
            </div>
          </div>

          <div className="admin-pending-note">
            Account statistics are fetched directly from your MongoDB database.
          </div>
        </article>
      </section>

      <div className="admin-demo-notice">
        <span>
          {error ? "Connection required" : "Live dashboard"}
        </span>
        {error
          ? "Dashboard data could not be loaded. Check your backend and Founder account access."
          : "Statistics and recent registrations are fetched from MongoDB. Subscription and revenue reporting will be connected when payment records are implemented."}
      </div>
    </div>
  );
}
