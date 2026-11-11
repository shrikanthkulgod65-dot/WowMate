
import {
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  BriefcaseBusiness,
  CreditCard,
  IndianRupee,
  Flag,
  Settings,
  LogOut,
  BarChart3,
} from "lucide-react";

// Existing admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminSettings from "./pages/AdminSettings";
import BrokerManagement from "./pages/BrokerManagement";
import PaymentsManagement from "./pages/PaymentsManagement";
import ProfileManagement from "./pages/ProfileManagement";
import ReportsManagement from "./pages/ReportsManagement";
import SubscriptionManagement from "./pages/SubscriptionManagement";
import UsersManagement from "./pages/UsersManagement";

// Sidebar menu
const menuItems = [
  { title: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Users", path: "/admin/users", icon: Users },
  { title: "Profile Verification", path: "/admin/profile-verification", icon: ShieldCheck },
  { title: "Brokers", path: "/admin/brokers", icon: BriefcaseBusiness },
  { title: "Subscriptions", path: "/admin/subscriptions", icon: CreditCard },
  { title: "Payments", path: "/admin/payments", icon: IndianRupee },
  { title: "Reports", path: "/admin/reports", icon: Flag },
  { title: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  { title: "Settings", path: "/admin/settings", icon: Settings },
];

// Admin sidebar and layout
function AdminLayout() {
  function handleLogout() {
    const confirmed = window.confirm(
      "Are you sure you want to log out?"
    );

    if (!confirmed) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/admin/login";
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <h2>WOWMATE</h2>
          <span>Founder Console</span>
        </div>

        <div className="admin-sidebar-section">
          <span className="admin-sidebar-label">WORKSPACE</span>

          <nav className="admin-sidebar-nav">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `admin-sidebar-link ${isActive ? "active" : ""}`
                  }
                >
                  <Icon size={20} />
                  <span>{item.title}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="admin-sidebar-bottom">
          <div className="admin-owner-card">
            <div className="admin-owner-avatar">F</div>
            <div>
              <strong>Founder & CEO</strong>
              <span>Owner Account</span>
            </div>
          </div>

          <button
            type="button"
            className="admin-sidebar-link admin-logout-button"
            onClick={handleLogout}
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

// Analytics page
function AdminAnalytics() {
  return (
    <div className="admin-dashboard">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">INSIGHTS</span>
          <h1>Analytics</h1>
          <p>Monitor WowMate platform performance.</p>
        </div>
      </div>

      <section className="admin-panel" style={{ padding: 24 }}>
        <h3>Platform Analytics</h3>
        <p>
          Analytics workspace is ready. Registration trends,
          membership growth, broker performance, and revenue
          charts can be connected in the next phase.
        </p>
      </section>
    </div>
  );
}

// Main Admin App
export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />

      <Route element={<AdminLayout />}>
        <Route
          index
          element={<Navigate to="dashboard" replace />}
        />

        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="profile-verification" element={<ProfileManagement />} />
        <Route path="brokers" element={<BrokerManagement />} />
        <Route path="subscriptions" element={<SubscriptionManagement />} />
        <Route path="payments" element={<PaymentsManagement />} />
        <Route path="reports" element={<ReportsManagement />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="settings" element={<AdminSettings />} />

        <Route
          path="*"
          element={<Navigate to="dashboard" replace />}
        />
      </Route>
    </Routes>
  );
}
