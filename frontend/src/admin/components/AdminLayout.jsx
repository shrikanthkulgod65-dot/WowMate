
import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import "../styles/admin.css";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-shell">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="admin-main">
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
