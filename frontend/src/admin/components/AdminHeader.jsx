
import { Menu, Search, Bell, ChevronDown } from "lucide-react";

export default function AdminHeader({ onMenuClick }) {
  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <button className="admin-menu-toggle" onClick={onMenuClick}>
          <Menu size={22} />
        </button>

        <div className="admin-search">
          <Search size={18} />
          <input type="text" placeholder="Search anything..." />
          <span>⌘ K</span>
        </div>
      </div>

      <div className="admin-header-right">
        <button className="admin-notification" aria-label="Notifications">
          <Bell size={20} />
          <span />
        </button>

        <div className="admin-header-profile">
          <div className="admin-profile-avatar">CEO</div>
          <div className="admin-profile-info">
            <strong>Founder & CEO</strong>
            <span>Super Administrator</span>
          </div>
          <ChevronDown size={16} />
        </div>
      </div>
    </header>
  );
}
