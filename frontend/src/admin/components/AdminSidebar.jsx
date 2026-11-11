
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  BriefcaseBusiness,
  CreditCard,
  Receipt,
  Flag,
  BarChart3,
  Settings,
  LogOut,
  Heart,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "Profile Verification", path: "/admin/profiles", icon: ShieldCheck },
  { name: "Brokers", path: "/admin/brokers", icon: BriefcaseBusiness },
  { name: "Subscriptions", path: "/admin/subscriptions", icon: CreditCard },
  { name: "Payments", path: "/admin/payments", icon: Receipt },
  { name: "Reports", path: "/admin/reports", icon: Flag },
  { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="admin-sidebar-overlay" onClick={onClose} />}

      <aside className={`admin-sidebar ${open ? "admin-sidebar-open" : ""}`}>
        <div className="admin-brand">
          <div className="admin-brand-icon">
            <Heart size={22} fill="currentColor" />
          </div>
          <div>
            <h2>WowMate</h2>
            <span>Founder Console</span>
          </div>
          <button className="admin-mobile-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="admin-menu-label">MAIN MENU</div>

        <nav className="admin-navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin/dashboard"}
                className={({ isActive }) =>
                  `admin-nav-link ${isActive ? "active" : ""}`
                }
                onClick={onClose}
              >
                <Icon size={19} strokeWidth={1.8} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-owner-card">
            <div className="admin-owner-avatar">CEO</div>
            <div>
              <strong>Founder & CEO</strong>
              <span>Owner Account</span>
            </div>
          </div>

          <button className="admin-logout" onClick={() => alert("Connect secure logout here.")}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
