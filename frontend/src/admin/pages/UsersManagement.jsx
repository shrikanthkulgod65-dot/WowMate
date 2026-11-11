
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  RefreshCw,
  Download,
  Users,
  UserCheck,
  UserX,
  ShieldAlert,
  Eye,
  X,
  CheckCircle,
  AlertCircle,
  Ban,
  Mail,
  Phone,
  CalendarDays,
  Filter,
  Briefcase,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const statusClass = (status) => {
  switch (String(status || "").toLowerCase()) {
    case "active":
      return "success";
    case "suspended":
      return "warning";
    case "blocked":
      return "danger";
    default:
      return "neutral";
  }
};

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const [selectedUser, setSelectedUser] = useState(null);
  const [updatingId, setUpdatingId] = useState("");

  const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/admin/users`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load users."
        );
      }

      setUsers(
        Array.isArray(data.users)
          ? data.users
          : Array.isArray(data)
            ? data
            : []
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the users API."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = search.trim().toLowerCase();

      const matchesSearch =
        String(user.fullName || "")
          .toLowerCase()
          .includes(query) ||
        String(user.email || "")
          .toLowerCase()
          .includes(query) ||
        String(user.mobile || "")
          .toLowerCase()
          .includes(query) ||
        String(user._id || "")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        String(user.accountStatus || "active").toLowerCase() ===
          statusFilter;

      const matchesRole =
        roleFilter === "all" ||
        String(user.role || "user").toLowerCase() ===
          roleFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRole
      );
    });
  }, [users, search, statusFilter, roleFilter]);

  const stats = useMemo(() => {
    return {
      total: users.length,

      active: users.filter(
        (user) =>
          String(user.accountStatus || "active").toLowerCase() ===
          "active"
      ).length,

      suspended: users.filter(
        (user) =>
          String(user.accountStatus).toLowerCase() ===
          "suspended"
      ).length,

      blocked: users.filter(
        (user) =>
          String(user.accountStatus).toLowerCase() ===
          "blocked"
      ).length,
    };
  }, [users]);

  const updateUserStatus = async (userId, accountStatus) => {
    const action =
      accountStatus.charAt(0).toUpperCase() +
      accountStatus.slice(1);

    const confirmed = window.confirm(
      `Are you sure you want to ${action.toLowerCase()} this account?`
    );

    if (!confirmed) return;

    setUpdatingId(userId);

    try {
      const response = await fetch(
        `${API_URL}/api/admin/users/${userId}/status`,
        {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify({ accountStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update account status."
        );
      }

      await fetchUsers();
      setSelectedUser(null);
    } catch (err) {
      window.alert(
        err.message || "Account status update failed."
      );
    } finally {
      setUpdatingId("");
    }
  };

  const exportCSV = () => {
    const rows = [
      [
        "User ID",
        "Full Name",
        "Email",
        "Mobile",
        "Role",
        "Account Status",
        "Email Verified",
        "Registration Date",
      ],

      ...filteredUsers.map((user) => [
        user._id || "",
        user.fullName || "",
        user.email || "",
        user.mobile || "",
        user.role || "user",
        user.accountStatus || "active",
        user.isEmailVerified ? "Yes" : "No",
        user.createdAt || "",
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value ?? "").replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "wowmate-users.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="um-page">
      <style>{`
        .um-page {
          width: 100%;
          color: #202438;
          font-family: inherit;
        }

        .um-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 24px;
        }

        .um-title {
          font-size: 25px;
          font-weight: 750;
          margin: 0;
        }

        .um-subtitle {
          font-size: 13px;
          color: #85899b;
          margin-top: 7px;
        }

        .um-actions {
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
        }

        .um-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 14px;
          border: 1px solid #e6e8ef;
          border-radius: 9px;
          background: white;
          color: #41465b;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
        }

        .um-btn.primary {
          background: #6746df;
          border-color: #6746df;
          color: white;
        }

        .um-btn.danger {
          color: #d44343;
          border-color: #ffdada;
          background: #fff6f6;
        }

        .um-btn:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .um-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 22px;
        }

        .um-stat {
          background: white;
          border: 1px solid #eceef4;
          border-radius: 13px;
          padding: 17px;
          min-width: 0;
        }

        .um-stat-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          color: #85899b;
          font-size: 12px;
        }

        .um-stat-icon {
          width: 35px;
          height: 35px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #f0edff;
          color: #6746df;
        }

        .um-stat-value {
          font-size: 25px;
          font-weight: 750;
          margin-top: 13px;
        }

        .um-panel {
          background: white;
          border: 1px solid #eceef4;
          border-radius: 13px;
          overflow: hidden;
        }

        .um-toolbar {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
          padding: 16px;
          border-bottom: 1px solid #eff0f4;
        }

        .um-search {
          display: flex;
          align-items: center;
          gap: 9px;
          border: 1px solid #e7e9f0;
          border-radius: 9px;
          padding: 0 11px;
          height: 39px;
          flex: 1;
          min-width: 200px;
          color: #9296a7;
        }

        .um-search input {
          width: 100%;
          border: 0;
          outline: none;
          background: transparent;
          font-size: 12px;
          color: #202438;
        }

        .um-select {
          height: 39px;
          padding: 0 11px;
          border: 1px solid #e7e9f0;
          border-radius: 9px;
          background: white;
          color: #51566b;
          outline: none;
          font-size: 12px;
          min-width: 135px;
        }

        .um-table-wrap {
          overflow-x: auto;
        }

        .um-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          min-width: 850px;
        }

        .um-table th {
          padding: 13px 16px;
          background: #fafafe;
          color: #9296a7;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .5px;
          font-weight: 700;
        }

        .um-table td {
          padding: 15px 16px;
          border-top: 1px solid #f0f1f5;
          font-size: 12px;
          color: #555a6e;
        }

        .um-user {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .um-avatar {
          width: 35px;
          height: 35px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #f0edff;
          color: #6746df;
          font-weight: 750;
          flex-shrink: 0;
        }

        .um-user-name {
          font-weight: 650;
          color: #272b40;
        }

        .um-muted {
          color: #999daf;
          font-size: 11px;
          margin-top: 4px;
        }

        .um-badge {
          display: inline-flex;
          padding: 5px 9px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 700;
          text-transform: capitalize;
        }

        .um-badge.success {
          background: #e8f8ef;
          color: #16834b;
        }

        .um-badge.warning {
          background: #fff5df;
          color: #a76b00;
        }

        .um-badge.danger {
          background: #ffeded;
          color: #d44343;
        }

        .um-badge.neutral {
          background: #f0f1f5;
          color: #656b7e;
        }

        .um-icon-btn {
          border: 1px solid #e9eaf0;
          background: white;
          border-radius: 8px;
          padding: 7px;
          color: #6746df;
          cursor: pointer;
          display: inline-flex;
        }

        .um-empty {
          text-align: center;
          padding: 45px 15px;
          color: #969aab;
          font-size: 13px;
        }

        .um-error {
          display: flex;
          gap: 10px;
          align-items: center;
          padding: 14px;
          border: 1px solid #ffdada;
          background: #fff6f6;
          color: #bd3838;
          border-radius: 10px;
          margin-bottom: 15px;
          font-size: 12px;
        }

        .um-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(20, 22, 38, .5);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
        }

        .um-modal {
          width: 100%;
          max-width: 530px;
          max-height: 90vh;
          overflow-y: auto;
          background: white;
          border-radius: 15px;
          padding: 22px;
          box-shadow: 0 20px 60px rgba(0,0,0,.15);
        }

        .um-modal-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .um-modal-head h3 {
          margin: 0;
          font-size: 18px;
        }

        .um-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 13px;
        }

        .um-detail {
          background: #f8f8fc;
          border-radius: 9px;
          padding: 12px;
          min-width: 0;
          overflow-wrap: anywhere;
        }

        .um-detail label {
          display: block;
          color: #9296a7;
          font-size: 10px;
          margin-bottom: 6px;
        }

        .um-detail strong {
          font-size: 12px;
          color: #303449;
        }

        .um-modal-actions {
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
          margin-top: 20px;
        }

        @media(max-width: 900px) {
          .um-stats {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media(max-width: 600px) {
          .um-title {
            font-size: 21px;
          }

          .um-detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="um-header">
        <div>
          <h1 className="um-title">Users Management</h1>
          <p className="um-subtitle">
            Manage registered members and their account status.
          </p>
        </div>

        <div className="um-actions">
          <button
            className="um-btn"
            onClick={fetchUsers}
            disabled={loading}
          >
            <RefreshCw size={14} />
            Refresh
          </button>

          <button
            className="um-btn primary"
            onClick={exportCSV}
            disabled={!filteredUsers.length}
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="um-error">
          <AlertCircle size={17} />
          <span>{error}</span>
        </div>
      )}

      <div className="um-stats">
        <div className="um-stat">
          <div className="um-stat-top">
            Total Users
            <span className="um-stat-icon">
              <Users size={17} />
            </span>
          </div>
          <div className="um-stat-value">{stats.total}</div>
        </div>

        <div className="um-stat">
          <div className="um-stat-top">
            Active Users
            <span className="um-stat-icon">
              <UserCheck size={17} />
            </span>
          </div>
          <div className="um-stat-value">{stats.active}</div>
        </div>

        <div className="um-stat">
          <div className="um-stat-top">
            Suspended
            <span className="um-stat-icon">
              <ShieldAlert size={17} />
            </span>
          </div>
          <div className="um-stat-value">{stats.suspended}</div>
        </div>

        <div className="um-stat">
          <div className="um-stat-top">
            Blocked
            <span className="um-stat-icon">
              <UserX size={17} />
            </span>
          </div>
          <div className="um-stat-value">{stats.blocked}</div>
        </div>
      </div>

      <div className="um-panel">
        <div className="um-toolbar">
          <div className="um-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search name, email, mobile or user ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="um-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="blocked">Blocked</option>
          </select>

          <select
            className="um-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All roles</option>
            <option value="user">User</option>
            <option value="broker">Broker</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="um-table-wrap">
          <table className="um-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Mobile</th>
                <th>Role</th>
                <th>Email Verification</th>
                <th>Account Status</th>
                <th>Joined Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="um-empty">
                    Loading registered users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="um-empty">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="um-user">
                        <div className="um-avatar">
                          {(user.fullName || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <div className="um-user-name">
                            {user.fullName || "Unknown"}
                          </div>
                          <div className="um-muted">
                            {user.email || "—"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>{user.mobile || "—"}</td>

                    <td>
                      <span className="um-badge neutral">
                        {user.role || "user"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`um-badge ${
                          user.isEmailVerified
                            ? "success"
                            : "warning"
                        }`}
                      >
                        {user.isEmailVerified
                          ? "Verified"
                          : "Not verified"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`um-badge ${statusClass(
                          user.accountStatus || "active"
                        )}`}
                      >
                        {user.accountStatus || "active"}
                      </span>
                    </td>

                    <td>{formatDate(user.createdAt)}</td>

                    <td>
                      <button
                        className="um-icon-btn"
                        title="View user details"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div
          className="um-modal-overlay"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="um-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="um-modal-head">
              <h3>Member Details</h3>

              <button
                className="um-icon-btn"
                onClick={() => setSelectedUser(null)}
              >
                <X size={17} />
              </button>
            </div>

            <div className="um-detail-grid">
              <div className="um-detail">
                <label>Full Name</label>
                <strong>{selectedUser.fullName || "—"}</strong>
              </div>

              <div className="um-detail">
                <label>Email Address</label>
                <strong>{selectedUser.email || "—"}</strong>
              </div>

              <div className="um-detail">
                <label>Mobile Number</label>
                <strong>{selectedUser.mobile || "—"}</strong>
              </div>

              <div className="um-detail">
                <label>Role</label>
                <strong>{selectedUser.role || "user"}</strong>
              </div>

              <div className="um-detail">
                <label>Account Status</label>
                <strong>
                  {selectedUser.accountStatus || "active"}
                </strong>
              </div>

              <div className="um-detail">
                <label>Email Verification</label>
                <strong>
                  {selectedUser.isEmailVerified
                    ? "Verified"
                    : "Not verified"}
                </strong>
              </div>

              <div className="um-detail">
                <label>Registration Date</label>
                <strong>{formatDate(selectedUser.createdAt)}</strong>
              </div>

              <div className="um-detail">
                <label>User ID</label>
                <strong>{selectedUser._id || "—"}</strong>
              </div>
            </div>

            <div className="um-modal-actions">
              {selectedUser.accountStatus !== "active" && (
                <button
                  className="um-btn primary"
                  disabled={updatingId === selectedUser._id}
                  onClick={() =>
                    updateUserStatus(selectedUser._id, "active")
                  }
                >
                  <CheckCircle size={14} />
                  Activate
                </button>
              )}

              {selectedUser.accountStatus !== "suspended" && (
                <button
                  className="um-btn"
                  disabled={updatingId === selectedUser._id}
                  onClick={() =>
                    updateUserStatus(selectedUser._id, "suspended")
                  }
                >
                  <ShieldAlert size={14} />
                  Suspend
                </button>
              )}

              {selectedUser.accountStatus !== "blocked" && (
                <button
                  className="um-btn danger"
                  disabled={updatingId === selectedUser._id}
                  onClick={() =>
                    updateUserStatus(selectedUser._id, "blocked")
                  }
                >
                  <Ban size={14} />
                  Block
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
