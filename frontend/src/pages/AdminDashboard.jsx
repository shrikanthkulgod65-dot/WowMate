
import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  CreditCard,
  Flag,
  Heart,
  MessageCircle,
  Bell,
  BarChart3,
  Settings,
  Search,
  Menu,
  X,
  Check,
  Ban,
  ArrowUpRight,
  ShieldCheck,
  Filter,
  TrendingUp,
  Clock,
} from "lucide-react";

const initialMembers = [
  {
    id: 1001,
    name: "Aarav Patil",
    email: "aarav@example.com",
    category: "Professional",
    status: "Verified",
    joined: "Today",
  },
  {
    id: 1002,
    name: "Priya Deshmukh",
    email: "priya@example.com",
    category: "Professional",
    status: "Pending",
    joined: "Today",
  },
  {
    id: 1003,
    name: "Rohan Kulkarni",
    email: "rohan@example.com",
    category: "Farmer",
    status: "Pending",
    joined: "Yesterday",
  },
  {
    id: 1004,
    name: "Sneha Patil",
    email: "sneha@example.com",
    category: "Farmer",
    status: "Verified",
    joined: "Yesterday",
  },
  {
    id: 1005,
    name: "Aditya Sharma",
    email: "aditya@example.com",
    category: "Professional",
    status: "Rejected",
    joined: "2 days ago",
  },
];

const initialStories = [
  { id: 1, couple: "Rahul & Sneha", status: "Published" },
  { id: 2, couple: "Amit & Pooja", status: "Pending" },
];

const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Members", icon: Users },
  { label: "Profile Verification", icon: UserCheck },
  { label: "Subscriptions", icon: CreditCard },
  { label: "Reports & Safety", icon: Flag },
  { label: "Success Stories", icon: Heart },
  { label: "Support Tickets", icon: MessageCircle },
  { label: "Notifications", icon: Bell },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

const readStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Keep the interface usable if local storage is unavailable.
  }
};

const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');

.ap-admin {
  --primary: #8b5cf6;
  --primary-dark: #6d28d9;
  --text: #292437;
  --muted: #858094;
  --border: #efedf3;
  min-height: 100vh;
  display: flex;
  color: var(--text);
  background: #f8f7fb;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
}
.ap-admin * { box-sizing: border-box; }
.ap-admin button, .ap-admin input, .ap-admin select { font: inherit; }
.ap-admin button { cursor: pointer; }

.ad-sidebar {
  width: 255px;
  min-width: 255px;
  height: 100vh;
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  padding: 24px 15px 18px;
  overflow-y: auto;
  background: white;
  border-right: 1px solid var(--border);
  z-index: 30;
}
.ad-brand { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; padding: 0 8px 29px; }
.ad-logo {
  display: block; width: 205px; max-width: 100%; height: 55px;
  flex-shrink: 0; object-fit: contain; object-position: left center;
}
.ad-brand-caption { color: #9b96a8; font-size: 9px; font-weight: 700; letter-spacing: 1.7px; }
.ad-section-label { padding: 0 12px; margin-bottom: 12px; color: #a09bac; font-size: 10px; font-weight: 700; letter-spacing: 1.6px; }
.ad-nav { display: grid; gap: 5px; }
.ad-nav button {
  width: 100%; min-height: 44px; display: flex; align-items: center; gap: 11px;
  padding: 0 12px; border: 0; border-radius: 10px; color: #777487;
  background: transparent; text-align: left; transition: .2s;
}
.ad-nav button:hover { color: var(--primary); background: #fbf4f8; }
.ad-nav button.active { color: var(--primary); background: #f8eaf1; font-weight: 700; }
.ad-nav button > span:nth-child(2) { flex: 1; }
.ad-count { padding: 4px 7px; border-radius: 6px; color: #a65025; background: #fff0e4; font-size: 10px; }
.ad-sidebar-bottom { margin-top: auto; padding-top: 24px; }
.ad-help { padding: 15px; margin-bottom: 16px; border: 1px solid #ddd6fe; border-radius: 13px; background: linear-gradient(145deg,#f8f5ff,#f5f0ff); }
.ad-help-icon { width: 35px; height: 35px; display: grid; place-items: center; margin-bottom: 10px; border-radius: 10px; color: var(--primary); background: #f5e4ed; }
.ad-help strong { font-size: 12px; }
.ad-help p { margin: 5px 0 0; color: var(--muted); font-size: 11px; line-height: 1.6; }
.ad-user { display: flex; align-items: center; gap: 10px; padding: 14px 5px 0; border-top: 1px solid var(--border); }
.ad-avatar { width: 36px; height: 36px; flex-shrink: 0; display: grid; place-items: center; border-radius: 50%; color: white; background: linear-gradient(135deg,#ad4c79,#71314f); font-weight: 700; }
.ad-user-info { flex: 1; min-width: 0; }
.ad-user-info strong, .ad-user-info small { display: block; }
.ad-user-info strong { font-size: 12px; }
.ad-user-info small { margin-top: 4px; color: var(--muted); font-size: 10px; }
.ad-online { width: 7px; height: 7px; border-radius: 50%; background: #2bb981; }

.ad-main { flex: 1; min-width: 0; }
.ad-topbar { min-height: 84px; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 17px 30px; border-bottom: 1px solid var(--border); background: white; }
.ad-topbar-left, .ad-top-actions { display: flex; align-items: center; gap: 14px; }
.ad-breadcrumb { margin-bottom: 5px; color: #9792a4; font-size: 11px; }
.ad-topbar h1 { margin: 0; font: 800 22px 'Manrope',sans-serif; letter-spacing: -.7px; }
.ad-live { display: inline-flex; align-items: center; gap: 7px; color: #6f6a7c; font-size: 11px; }
.ad-live span { width: 7px; height: 7px; border-radius: 50%; background: #2bb981; }
.ad-icon-button { width: 38px; height: 38px; position: relative; display: grid; place-items: center; border: 1px solid var(--border); border-radius: 11px; color: #716c7e; background: white; }
.ad-notification-dot { position: absolute; top: 7px; right: 7px; width: 7px; height: 7px; border: 1px solid white; border-radius: 50%; background: #e84e77; }
.ad-top-avatar { width: 37px; height: 37px; display: grid; place-items: center; border-radius: 50%; color: white; background: linear-gradient(135deg,#ad4c79,#71314f); font-weight: 700; }
.ad-page { width: 100%; max-width: 1650px; padding: 27px 30px 18px; margin: 0 auto; }

.ad-welcome {
  min-height: 168px; position: relative; display: flex; align-items: center;
  justify-content: space-between; gap: 20px; padding: 30px 33px; margin-bottom: 22px;
  overflow: hidden; border-radius: 18px; color: white;
  background: linear-gradient(115deg,#702343,#963b64 56%,#bd6385);
  box-shadow: 0 12px 28px #8b31591b;
}
.ad-welcome:before, .ad-welcome:after { position: absolute; content: ''; border: 1px solid #ffffff21; border-radius: 50%; pointer-events: none; }
.ad-welcome:before { width: 300px; height: 300px; top: -190px; right: 100px; }
.ad-welcome:after { width: 235px; height: 235px; right: -65px; bottom: -160px; }
.ad-welcome-copy { position: relative; z-index: 1; }
.ad-eyebrow { display: inline-block; padding: 6px 10px; margin-bottom: 12px; border: 1px solid #ffffff3a; border-radius: 6px; color: #ffe9f2; font-size: 9px; font-weight: 700; letter-spacing: 1.5px; }
.ad-welcome h2 { margin: 0; font: 800 clamp(21px,2.3vw,29px) 'Manrope',sans-serif; letter-spacing: -.8px; }
.ad-welcome p { margin: 9px 0 0; color: #f7e8ef; font-size: 13px; }
.ad-welcome-symbol { width: 87px; height: 87px; flex-shrink: 0; position: relative; z-index: 1; display: grid; place-items: center; border: 1px solid #ffffff36; border-radius: 25px; color: white; background: #ffffff17; transform: rotate(-7deg); }

.ad-stats { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 16px; margin-bottom: 22px; }
.ad-stat { min-width: 0; padding: 19px; border: 1px solid var(--border); border-radius: 15px; background: white; box-shadow: 0 4px 12px #29203b05; transition: .2s; }
.ad-stat:hover { transform: translateY(-3px); box-shadow: 0 10px 22px #29203b0c; }
.ad-stat-icon { width: 41px; height: 41px; display: grid; place-items: center; margin-bottom: 15px; border-radius: 12px; }
.ad-purple { color: #8050c9; background: #f1e9ff; }
.ad-green { color: #218a65; background: #e3f7ef; }
.ad-orange { color: #bd7b2d; background: #fff1dc; }
.ad-pink { color: #c04d79; background: #fbe7f0; }
.ad-stat-label { margin: 0 0 7px; color: #858094; font-size: 12px; }
.ad-stat h3 { margin: 0; font: 800 28px 'Manrope',sans-serif; letter-spacing: -1px; }
.ad-stat-detail { margin: 9px 0 0; color: #a09bab; font-size: 10px; }

.ad-grid { display: grid; grid-template-columns: minmax(0,1.55fr) minmax(260px,1fr); gap: 19px; align-items: start; margin-bottom: 21px; }
.ad-panel { min-width: 0; padding: 22px; border: 1px solid var(--border); border-radius: 15px; background: white; box-shadow: 0 4px 12px #29203b04; }
.ad-panel-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 20px; }
.ad-panel-heading h3 { margin: 0; font: 800 16px 'Manrope',sans-serif; letter-spacing: -.3px; }
.ad-panel-heading p { margin: 6px 0 0; color: var(--muted); font-size: 11px; line-height: 1.5; }
.ad-text-button { display: inline-flex; align-items: center; gap: 6px; padding: 7px 0 7px 8px; border: 0; color: var(--primary); background: transparent; font-size: 11px; font-weight: 700; }
.ad-secondary { padding: 9px 12px; border: 1px solid #ddd6fe; border-radius: 8px; color: var(--primary); background: #f8f5ff; font-size: 11px; font-weight: 700; }
.ad-secondary:hover { background: #f9eaf1; }
.ad-quick { display: grid; gap: 7px; }
.ad-quick button { width: 100%; display: flex; align-items: center; gap: 10px; padding: 12px 8px; border: 1px solid transparent; border-radius: 11px; color: var(--text); background: white; text-align: left; }
.ad-quick button:hover { border-color: #f1dfe8; background: #fdf7fa; }
.ad-quick-icon { width: 38px; height: 38px; flex-shrink: 0; display: grid; place-items: center; border-radius: 11px; }
.ad-quick-copy { min-width: 0; flex: 1; }
.ad-quick strong, .ad-quick small { display: block; }
.ad-quick strong { font-size: 12px; }
.ad-quick small { margin-top: 4px; color: var(--muted); font-size: 10px; }

.ad-table-wrap { width: 100%; overflow-x: auto; }
.ad-table { width: 100%; border-collapse: collapse; text-align: left; white-space: nowrap; }
.ad-table th { padding: 12px 10px; border-top: 1px solid #f1eff4; border-bottom: 1px solid #f1eff4; color: #9792a4; background: #fbfafc; font-size: 10px; font-weight: 700; }
.ad-table td { padding: 12px 10px; border-bottom: 1px solid #f2f0f5; color: #6f6a7c; font-size: 11px; }
.ad-table tbody tr:last-child td { border-bottom: 0; }
.ad-table tbody tr:hover td { background: #fdfbfc; }
.ad-member { display: flex; align-items: center; gap: 9px; }
.ad-member-avatar { width: 34px; height: 34px; display: grid; place-items: center; flex-shrink: 0; border-radius: 10px; color: #874161; background: #f7e6ee; font-size: 10px; font-weight: 700; }
.ad-member strong, .ad-member small { display: block; }
.ad-member strong { color: #393448; font-size: 11px; }
.ad-member small { margin-top: 4px; color: #9b96a8; font-size: 10px; }
.ad-status { display: inline-flex; align-items: center; gap: 5px; padding: 5px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; }
.ad-status:before { content: ''; width: 6px; height: 6px; flex-shrink: 0; border-radius: 50%; background: currentColor; }
.ad-status.verified, .ad-status.published { color: #25855f; background: #e7f7ef; }
.ad-status.pending { color: #b87928; background: #fff4df; }
.ad-status.rejected { color: #be4966; background: #fceaf0; }
.ad-status.open { color: #7950bc; background: #f1e9ff; }
.ad-actions { display: flex; gap: 6px; }
.ad-row-action { width: 29px; height: 29px; display: grid; place-items: center; border: 0; border-radius: 8px; }
.ad-row-action.approve { color: #25855f; background: #e7f7ef; }
.ad-row-action.reject { color: #be4966; background: #fceaf0; }
.ad-empty { padding: 28px !important; color: var(--muted) !important; text-align: center; }
.ad-note { margin: 15px 0 0; color: #a09bab; font-size: 10px; line-height: 1.6; }
.ad-toolbar { display: flex; align-items: center; gap: 11px; margin-bottom: 18px; }
.ad-search { min-width: 150px; flex: 1; display: flex; align-items: center; gap: 9px; padding: 0 11px; border: 1px solid #eae7ef; border-radius: 10px; color: #9993a6; background: white; }
.ad-search:focus-within { border-color: #bd7195; box-shadow: 0 0 0 3px #8b31590d; }
.ad-search input { width: 100%; min-width: 0; height: 42px; border: 0; outline: 0; color: var(--text); background: transparent; font-size: 12px; }
.ad-filter { display: flex; align-items: center; gap: 6px; padding: 0 9px; border: 1px solid #eae7ef; border-radius: 10px; color: #817b90; background: white; }
.ad-filter select { max-width: 130px; height: 42px; border: 0; outline: 0; color: #625c70; background: transparent; font-size: 11px; }
.ad-record-count { padding: 7px 10px; border-radius: 7px; color: var(--primary); background: #f8eaf1; font-size: 10px; font-weight: 700; }
.ad-empty-state { display: grid; justify-items: center; gap: 10px; padding: 30px; color: #268761; }
.ad-empty-state p { margin: 0; color: #777184; font-size: 12px; }

.ad-inline-form { display: flex; gap: 10px; margin-bottom: 17px; }
.ad-inline-form input { min-width: 0; flex: 1; height: 42px; padding: 0 12px; border: 1px solid #eae7ef; border-radius: 9px; outline: 0; }
.ad-inline-form input:focus { border-color: #bd7195; }
.ad-primary { padding: 0 16px; border: 0; border-radius: 9px; color: white; background: var(--primary); font-size: 12px; font-weight: 700; }
.ad-primary:hover { background: var(--primary-dark); }
.ad-notice { padding: 10px 12px; border-radius: 8px; color: #25855f; background: #e7f7ef; font-size: 12px; }
.ad-story-row { display: flex; align-items: center; gap: 12px; padding: 13px 0; border-bottom: 1px solid #f1eff4; }
.ad-story-row > div:nth-child(2) { flex: 1; }
.ad-story-row strong, .ad-story-row small { display: block; }
.ad-story-row strong { font-size: 12px; }
.ad-story-row small { margin-top: 4px; color: var(--muted); font-size: 10px; }
.ad-settings-row { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 17px 0; border-bottom: 1px solid #f1eff4; }
.ad-settings-row:last-child { border-bottom: 0; }
.ad-settings-row strong { font-size: 12px; }
.ad-settings-row p { margin: 5px 0 0; color: var(--muted); font-size: 11px; line-height: 1.6; }
.ad-tag { padding: 6px 9px; border-radius: 7px; color: #8050a0; background: #f4ebfb; font-size: 10px; font-weight: 700; white-space: nowrap; }
.ad-feature { max-width: 560px; padding: 35px 20px; margin: auto; text-align: center; }
.ad-feature-icon { width: 64px; height: 64px; display: grid; place-items: center; margin: 0 auto 16px; border-radius: 19px; color: var(--primary); background: #f8eaf1; }
.ad-feature h4 { margin: 0; font: 800 19px 'Manrope',sans-serif; }
.ad-feature > p { max-width: 430px; margin: 10px auto 0; color: #858094; font-size: 12px; line-height: 1.8; }
.ad-metrics { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; margin-top: 24px; text-align: left; }
.ad-metric { padding: 16px; border: 1px solid var(--border); border-radius: 11px; background: #fcfbfd; }
.ad-metric span, .ad-metric strong { display: block; }
.ad-metric span { color: #858094; font-size: 11px; }
.ad-metric strong { margin-top: 8px; font: 800 23px 'Manrope',sans-serif; }

.ad-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; padding: 20px 2px 0; color: #9691a2; font-size: 10px; }
.ad-footer button { padding: 5px 0 5px 8px; border: 0; color: var(--primary); background: transparent; font-size: 10px; font-weight: 700; }
.ad-footer button:hover { text-decoration: underline; }
.ad-menu-button, .ad-mobile-close { display: none; }
.ad-overlay { display: none; }

@media (max-width: 1180px) {
  .ad-sidebar { width: 225px; min-width: 225px; }
  .ad-page { padding-right: 21px; padding-left: 21px; }
  .ad-topbar { padding-right: 21px; padding-left: 21px; }
  .ad-stats { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .ad-grid { grid-template-columns: 1fr; }
}
@media (max-width: 760px) {
  .ad-sidebar { width: 275px; min-width: 0; position: fixed; inset: 0 auto 0 0; height: 100dvh; transform: translateX(-105%); transition: transform .25s ease; box-shadow: none; }
  .ad-sidebar.open { transform: translateX(0); box-shadow: 18px 0 45px #1f173522; }
  .ad-overlay { position: fixed; inset: 0; display: block; z-index: 29; border: 0; background: #1b152b66; }
  .ad-mobile-close { display: grid; place-items: center; width: 32px; height: 32px; margin-left: auto; border: 0; border-radius: 8px; color: #6c667b; background: #f7f5f9; }
  .ad-menu-button { width: 37px; height: 37px; display: grid; place-items: center; flex-shrink: 0; border: 1px solid var(--border); border-radius: 10px; color: #6f6a7c; background: white; }
  .ad-topbar { min-height: 74px; padding: 13px 15px; }
  .ad-topbar h1 { font-size: 18px; }
  .ad-top-actions { gap: 9px; }
  .ad-live { display: none; }
  .ad-top-avatar { width: 34px; height: 34px; }
  .ad-page { padding: 17px 14px 20px; }
  .ad-welcome { min-height: 145px; padding: 22px 19px; border-radius: 14px; }
  .ad-welcome p { max-width: 260px; font-size: 11px; line-height: 1.7; }
  .ad-welcome-symbol { width: 55px; height: 55px; border-radius: 17px; }
  .ad-welcome-symbol svg { width: 24px; }
  .ad-stats { gap: 11px; margin-bottom: 16px; }
  .ad-stat { padding: 14px; border-radius: 12px; }
  .ad-stat-icon { width: 35px; height: 35px; margin-bottom: 11px; }
  .ad-stat h3 { font-size: 23px; }
  .ad-stat-label { font-size: 11px; line-height: 1.5; }
  .ad-grid { gap: 14px; margin-bottom: 15px; }
  .ad-panel { padding: 15px 12px; border-radius: 12px; }
  .ad-panel-heading { align-items: flex-start; gap: 9px; margin-bottom: 15px; }
  .ad-panel-heading h3 { font-size: 14px; }
  .ad-table th, .ad-table td { padding: 12px 8px; }
  .ad-toolbar { align-items: stretch; flex-direction: column; }
  .ad-search { width: 100%; }
  .ad-filter { align-self: flex-start; }
  .ad-inline-form { flex-direction: column; }
  .ad-primary { min-height: 40px; }
  .ad-footer { align-items: flex-start; flex-direction: column; padding-top: 18px; }
}
@media (max-width: 380px) {
  .ad-welcome-symbol { display: none; }
  .ad-stats { grid-template-columns: 1fr; }
  .ad-stat { display: grid; grid-template-columns: 40px 1fr; column-gap: 12px; align-items: center; }
  .ad-stat-icon { grid-row: span 3; margin: 0; }
  .ad-stat-label, .ad-stat h3, .ad-stat-detail { margin: 0; }
  .ad-stat h3 { font-size: 22px; }
  .ad-stat-detail { margin-top: 4px; }
}
`;

function StatusBadge({ status }) {
  const className = status.toLowerCase().replace(/\s+/g, "-");
  return <span className={`ad-status ${className}`}>{status}</span>;
}

function MemberTable({ members, compact = false, onApprove, onReject }) {
  return (
    <div className="ad-table-wrap">
      <table className="ad-table">
        <thead>
          <tr>
            <th>MEMBER</th>
            <th>CATEGORY</th>
            <th>STATUS</th>
            {!compact && <th>JOINED</th>}
            {(onApprove || onReject) && <th>ACTIONS</th>}
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>
                <div className="ad-member">
                  <div className="ad-member-avatar">
                    {member.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <strong>{member.name}</strong>
                    <small>{member.email}</small>
                  </div>
                </div>
              </td>
              <td>{member.category}</td>
              <td><StatusBadge status={member.status} /></td>
              {!compact && <td>{member.joined}</td>}
              {(onApprove || onReject) && (
                <td>
                  <div className="ad-actions">
                    {onApprove && member.status === "Pending" && (
                      <button
                        className="ad-row-action approve"
                        aria-label={`Approve ${member.name}`}
                        title="Approve"
                        onClick={() => onApprove(member.id)}
                      >
                        <Check size={16} />
                      </button>
                    )}
                    {onReject && member.status === "Pending" && (
                      <button
                        className="ad-row-action reject"
                        aria-label={`Reject ${member.name}`}
                        title="Reject"
                        onClick={() => onReject(member.id)}
                      >
                        <Ban size={16} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
          {members.length === 0 && (
            <tr>
              <td colSpan="5" className="ad-empty">No matching records found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function Overview({ members, setPage }) {
  const verified = members.filter((m) => m.status === "Verified").length;
  const pending = members.filter((m) => m.status === "Pending").length;
  const rejected = members.filter((m) => m.status === "Rejected").length;

  const stats = [
    { label: "Total members", value: members.length, detail: "Demo member records", icon: Users, color: "ad-purple" },
    { label: "Verified profiles", value: verified, detail: "Profiles approved", icon: ShieldCheck, color: "ad-green" },
    { label: "Pending verification", value: pending, detail: "Require your review", icon: Clock, color: "ad-orange" },
    { label: "Rejected profiles", value: rejected, detail: "Demo moderation records", icon: Flag, color: "ad-pink" },
  ];

  return (
    <>
      <section className="ad-welcome">
        <div className="ad-welcome-copy">
          <span className="ad-eyebrow">ADMIN WORKSPACE</span>
          <h2>Welcome back, Admin 👋</h2>
          <p>Manage your Wowmate community from one place.</p>
        </div>
        <div className="ad-welcome-symbol"><Heart size={32} fill="currentColor" /></div>
      </section>

      <section className="ad-stats">
        {stats.map(({ label, value, detail, icon: Icon, color }) => (
          <article className="ad-stat" key={label}>
            <div className={`ad-stat-icon ${color}`}><Icon size={21} /></div>
            <p className="ad-stat-label">{label}</p>
            <h3>{value.toLocaleString()}</h3>
            <p className="ad-stat-detail">{detail}</p>
          </article>
        ))}
      </section>

      <section className="ad-grid">
        <article className="ad-panel">
          <div className="ad-panel-heading">
            <div><h3>Recent members</h3><p>Latest demo member records</p></div>
            <button className="ad-text-button" onClick={() => setPage("Members")}>View all <ArrowUpRight size={16} /></button>
          </div>
          <MemberTable members={members.slice(0, 4)} compact />
        </article>

        <article className="ad-panel">
          <div className="ad-panel-heading">
            <div><h3>Quick actions</h3><p>Jump to important tasks</p></div>
          </div>
          <div className="ad-quick">
            <button onClick={() => setPage("Profile Verification")}>
              <span className="ad-quick-icon ad-orange"><UserCheck size={19} /></span>
              <span className="ad-quick-copy"><strong>Verify profiles</strong><small>Review member profiles</small></span>
              <ArrowUpRight size={16} />
            </button>
            <button onClick={() => setPage("Success Stories")}>
              <span className="ad-quick-icon ad-pink"><Heart size={19} /></span>
              <span className="ad-quick-copy"><strong>Success stories</strong><small>Manage couple stories</small></span>
              <ArrowUpRight size={16} />
            </button>
            <button onClick={() => setPage("Reports & Safety")}>
              <span className="ad-quick-icon ad-purple"><Flag size={19} /></span>
              <span className="ad-quick-copy"><strong>Safety reports</strong><small>Review demo reports</small></span>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </article>
      </section>

      <section className="ad-panel">
        <div className="ad-panel-heading">
          <div><h3>Verification queue</h3><p>Profiles waiting for review</p></div>
          <button className="ad-secondary" onClick={() => setPage("Profile Verification")}>Open queue</button>
        </div>
        {pending === 0 ? (
          <div className="ad-empty-state"><Check size={25} /><p>All demo profiles have been reviewed.</p></div>
        ) : (
          <MemberTable members={members.filter((m) => m.status === "Pending")} compact />
        )}
      </section>
    </>
  );
}

function ManagementPage({ page, members, stories, setStories }) {
  const [couple, setCouple] = useState("");
  const [notice, setNotice] = useState("");

  const descriptions = {
    Subscriptions: "Review subscription plans and demo subscription activity.",
    "Reports & Safety": "Review reports and plan your member-safety workflow.",
    "Support Tickets": "Manage incoming member support requests.",
    Notifications: "Prepare announcements for your community.",
    Analytics: "Review the demo metrics available in this frontend.",
  };

  if (page === "Success Stories") {
    function addStory(event) {
      event.preventDefault();
      const name = couple.trim();
      if (!name) return;

      const updated = [
        ...stories,
        { id: Date.now(), couple: name, status: "Pending" },
      ];
      setStories(updated);
      writeStorage("apnishaadi-admin-stories", updated);
      setCouple("");
      setNotice("Demo success story added.");
    }

    return (
      <section className="ad-panel">
        <div className="ad-panel-heading"><div><h3>Success stories</h3><p>Manage demo couple stories</p></div></div>
        <form className="ad-inline-form" onSubmit={addStory}>
          <input value={couple} onChange={(e) => setCouple(e.target.value)} placeholder="Enter couple names" aria-label="Couple names" maxLength={100} />
          <button className="ad-primary" type="submit">Add story</button>
        </form>
        {notice && <p className="ad-notice" role="status">{notice}</p>}
        {stories.map((story) => (
          <div className="ad-story-row" key={story.id}>
            <span className="ad-quick-icon ad-pink"><Heart size={19} /></span>
            <div><strong>{story.couple}</strong><small>Success story</small></div>
            <StatusBadge status={story.status} />
          </div>
        ))}
      </section>
    );
  }

  if (page === "Settings") {
    return (
      <section className="ad-panel">
        <div className="ad-panel-heading"><div><h3>Admin settings</h3><p>Frontend preview settings</p></div></div>
        {[
          ["Admin notifications", "Display notifications within this dashboard.", "Preview"],
          ["Profile verification", "Manage pending profiles from the verification screen.", "Available"],
          ["Data storage", "Demo changes are saved in this browser only.", "Local"],
        ].map(([title, description, tag]) => (
          <div className="ad-settings-row" key={title}>
            <div><strong>{title}</strong><p>{description}</p></div>
            <span className="ad-tag">{tag}</span>
          </div>
        ))}
      </section>
    );
  }

  const Icon = page === "Subscriptions" ? CreditCard :
    page === "Reports & Safety" ? Flag :
    page === "Support Tickets" ? MessageCircle :
    page === "Notifications" ? Bell : BarChart3;

  return (
    <section className="ad-panel">
      <div className="ad-panel-heading">
        <div><h3>{page}</h3><p>{descriptions[page] || "Manage this admin workspace section."}</p></div>
      </div>
      <div className="ad-feature">
        <div className="ad-feature-icon"><Icon size={28} /></div>
        <h4>{page} workspace</h4>
        <p>This section currently displays a frontend preview. Real records and server-side actions require backend integration.</p>
        <div className="ad-metrics">
          <div className="ad-metric"><span>Member records</span><strong>{members.length}</strong></div>
          <div className="ad-metric"><span>Demo success stories</span><strong>{stories.length}</strong></div>
        </div>
      </div>
    </section>
  );
}

export default function AdminDashboard() {
  const [page, setPage] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [members, setMembers] = useState(() =>
    readStorage("apnishaadi-admin-members", initialMembers)
  );
  const [stories, setStories] = useState(() =>
    readStorage("apnishaadi-admin-stories", initialStories)
  );

  const pending = members.filter((m) => m.status === "Pending").length;

  const filteredMembers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return members.filter((member) => {
      const matchesText =
        member.name.toLowerCase().includes(term) ||
        member.email.toLowerCase().includes(term) ||
        member.category.toLowerCase().includes(term);
      return matchesText && (filter === "All" || member.status === filter);
    });
  }, [members, search, filter]);

  function updateMember(id, status) {
    const updated = members.map((m) => m.id === id ? { ...m, status } : m);
    setMembers(updated);
    writeStorage("apnishaadi-admin-members", updated);
  }

  function choosePage(label) {
    setPage(label);
    setSidebarOpen(false);
    setSearch("");
    setFilter("All");
  }

  function resetDemoData() {
    if (!window.confirm("Reset demo members and stories to the original sample data?")) return;
    setMembers(initialMembers);
    setStories(initialStories);
    writeStorage("apnishaadi-admin-members", initialMembers);
    writeStorage("apnishaadi-admin-stories", initialStories);
    setSearch("");
    setFilter("All");
    setPage("Overview");
  }

  const pageTitle = page === "Overview" ? "Dashboard overview" : page;

  return (
    <div className="ap-admin">
      <style>{styles}</style>

      <aside className={`ad-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="ad-brand">
          <img
            src="/image.png"
            alt="Wowmate - Rishton Ki Nayi Shuruaat"
            className="ad-logo"
          />
          <div className="ad-brand-caption">ADMIN CONSOLE</div>
          <button className="ad-mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Close navigation"><X size={20} /></button>
        </div>

        <div className="ad-section-label">WORKSPACE</div>
        <nav className="ad-nav">
          {navigation.map(({ label, icon: Icon }) => (
            <button key={label} className={page === label ? "active" : ""} onClick={() => choosePage(label)}>
              <Icon size={19} />
              <span>{label}</span>
              {label === "Profile Verification" && pending > 0 && <span className="ad-count">{pending}</span>}
            </button>
          ))}
        </nav>

        <div className="ad-sidebar-bottom">
          <div className="ad-help">
            <div className="ad-help-icon"><ShieldCheck size={21} /></div>
            <strong>Admin workspace</strong>
            <p>Frontend development preview</p>
          </div>
          <div className="ad-user">
            <div className="ad-avatar">A</div>
            <div className="ad-user-info"><strong>Administrator</strong><small>Development mode</small></div>
            <span className="ad-online" title="Local preview" />
          </div>
        </div>
      </aside>

      {sidebarOpen && <button className="ad-overlay" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}

      <main className="ad-main">
        <header className="ad-topbar">
          <div className="ad-topbar-left">
            <button className="ad-menu-button" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><Menu size={22} /></button>
            <div>
              <div className="ad-breadcrumb">Admin / {pageTitle}</div>
              <h1>{pageTitle}</h1>
            </div>
          </div>
          <div className="ad-top-actions">
            <span className="ad-live"><span /> Live preview</span>
            <button className="ad-icon-button" onClick={() => choosePage("Notifications")} aria-label="Open notifications" title="Notifications">
              <Bell size={20} /><span className="ad-notification-dot" />
            </button>
            <div className="ad-top-avatar">A</div>
          </div>
        </header>

        <div className="ad-page">
          {page === "Overview" && <Overview members={members} setPage={choosePage} />}

          {(page === "Members" || page === "Profile Verification") && (
            <section className="ad-panel">
              <div className="ad-panel-heading">
                <div>
                  <h3>{page === "Members" ? "Member management" : "Verify profiles"}</h3>
                  <p>{page === "Members" ? "Search and review demo member records." : "Approve or reject pending demo profiles."}</p>
                </div>
                <span className="ad-record-count">{filteredMembers.length} records</span>
              </div>
              <div className="ad-toolbar">
                <label className="ad-search">
                  <Search size={18} />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, category..." aria-label="Search members" />
                </label>
                <label className="ad-filter">
                  <Filter size={16} />
                  <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter member status">
                    <option value="All">All statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Verified">Verified</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </label>
              </div>
              <MemberTable
                members={page === "Profile Verification" ? filteredMembers.filter((m) => m.status === "Pending") : filteredMembers}
                onApprove={(id) => updateMember(id, "Verified")}
                onReject={(id) => updateMember(id, "Rejected")}
              />
              <p className="ad-note">Demo only: approvals and rejections are stored in this browser, not sent to a server.</p>
            </section>
          )}

          {page !== "Overview" && page !== "Members" && page !== "Profile Verification" && (
            <ManagementPage page={page} members={members} stories={stories} setStories={setStories} />
          )}

          <footer className="ad-footer">
            <span>© {new Date().getFullYear()} Wowmate Admin</span>
            <span><span className="ad-online" style={{ display: "inline-block", marginRight: 7 }} /> Development preview</span>
            <button onClick={resetDemoData}>Reset demo data</button>
          </footer>
        </div>
      </main>
    </div>
  );
}
