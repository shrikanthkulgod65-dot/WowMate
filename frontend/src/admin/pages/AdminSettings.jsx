
import React from "react";
import { Settings, ShieldCheck, User, Lock } from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="admin-dashboard">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">CONFIGURATION</span>
          <h1>Admin Settings</h1>
          <p>Manage your WowMate Founder & CEO account settings.</p>
        </div>
      </div>

      <section className="admin-panel" style={{ padding: 24 }}>
        <h3>
          <Settings size={20} /> General Settings
        </h3>

        <p>Founder account and platform configuration.</p>

        <div style={{ marginTop: 24 }}>
          <p><User size={17} /> Account type: Founder & CEO</p>
          <p><ShieldCheck size={17} /> Access: Full administrator access</p>
          <p><Lock size={17} /> Security: Protected admin login</p>
        </div>
      </section>
    </div>
  );
}
