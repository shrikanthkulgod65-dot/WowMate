
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Download,
  CreditCard,
  Users,
  IndianRupee,
  CheckCircle,
  Clock,
  XCircle,
  CalendarDays,
  Eye,
  X,
  AlertCircle,
  Crown,
  TrendingUp,
  Filter,
} from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

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

const getStatusClass = (status) => {
  const value = String(status || "").toLowerCase();

  if (["active", "success", "paid"].includes(value)) return "success";
  if (["pending", "trial"].includes(value)) return "warning";
  if (["cancelled", "expired", "failed", "suspended"].includes(value))
    return "danger";

  return "neutral";
};

export default function SubscriptionManagement() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [updatingId, setUpdatingId] = useState("");

  const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/admin/subscriptions`, {
        method: "GET",
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load subscriptions.");
      }

      setSubscriptions(
        Array.isArray(data.subscriptions)
          ? data.subscriptions
          : Array.isArray(data)
            ? data
            : []
      );

      setPlans(Array.isArray(data.plans) ? data.plans : []);
    } catch (err) {
      setError(
        err.message ||
          "Could not connect to the subscription management API."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((subscription) => {
      const user = subscription.user || subscription.userId || {};
      const userName =
        typeof user === "string" ? user : user.fullName || user.name || "";
      const userEmail = typeof user === "object" ? user.email || "" : "";

      const planName =
        subscription.planName ||
        subscription.plan?.name ||
        subscription.plan?.title ||
        "";

      const query = search.toLowerCase();

      const matchesSearch =
        userName.toLowerCase().includes(query) ||
        userEmail.toLowerCase().includes(query) ||
        planName.toLowerCase().includes(query) ||
        String(subscription._id || "").toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        String(subscription.status || "").toLowerCase() === statusFilter;

      const matchesPlan =
        planFilter === "all" ||
        planName.toLowerCase() === planFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [subscriptions, search, statusFilter, planFilter]);

  const stats = useMemo(() => {
    const active = subscriptions.filter(
      (item) => String(item.status).toLowerCase() === "active"
    );

    const pending = subscriptions.filter(
      (item) => String(item.status).toLowerCase() === "pending"
    );

    const expired = subscriptions.filter(
      (item) => String(item.status).toLowerCase() === "expired"
    );

    const revenue = subscriptions
      .filter((item) =>
        ["active", "success", "paid"].includes(
          String(item.status).toLowerCase()
        )
      )
      .reduce(
        (total, item) =>
          total + Number(item.amount ?? item.price ?? 0),
        0
      );

    return {
      total: subscriptions.length,
      active: active.length,
      pending: pending.length,
      expired: expired.length,
      revenue,
    };
  }, [subscriptions]);

  const updateSubscriptionStatus = async (id, status) => {
    const confirmed = window.confirm(
      `Are you sure you want to change this subscription status to ${status}?`
    );

    if (!confirmed) return;

    setUpdatingId(id);

    try {
      const response = await fetch(
        `${API_URL}/api/admin/subscriptions/${id}/status`,
        {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Status update failed.");
      }

      await fetchSubscriptions();
      setSelectedSubscription(null);
    } catch (err) {
      window.alert(err.message || "Unable to update subscription.");
    } finally {
      setUpdatingId("");
    }
  };

  const exportCSV = () => {
    const rows = [
      [
        "Subscription ID",
        "Customer",
        "Email",
        "Plan",
        "Amount",
        "Status",
        "Start Date",
        "End Date",
      ],
      ...filteredSubscriptions.map((item) => {
        const user = item.user || item.userId || {};
        const name =
          typeof user === "string"
            ? user
            : user.fullName || user.name || "";

        return [
          item._id || "",
          name,
          typeof user === "object" ? user.email || "" : "",
          item.planName || item.plan?.name || "",
          item.amount ?? item.price ?? 0,
          item.status || "",
          item.startDate || item.createdAt || "",
          item.endDate || item.expiryDate || "",
        ];
      }),
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
    link.download = "wowmate-subscriptions.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="sm-page">
      <style>{`
        .sm-page {
          color: #202438;
          width: 100%;
          font-family: inherit;
        }
        .sm-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 25px;
        }
        .sm-title {
          font-size: 25px;
          font-weight: 750;
          margin: 0;
        }
        .sm-subtitle {
          color: #85899b;
          margin: 7px 0 0;
          font-size: 13px;
        }
        .sm-actions {
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
        }
        .sm-btn {
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
        .sm-btn.primary {
          background: #6746df;
          color: white;
          border-color: #6746df;
        }
        .sm-btn:disabled {
          opacity: .6;
          cursor: not-allowed;
        }
        .sm-stats {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 22px;
        }
        .sm-stat {
          background: white;
          border: 1px solid #eceef4;
          border-radius: 13px;
          padding: 17px;
          min-width: 0;
        }
        .sm-stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #85899b;
          font-size: 12px;
          gap: 8px;
        }
        .sm-stat-icon {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #f0edff;
          color: #6746df;
        }
        .sm-stat-value {
          margin-top: 13px;
          font-size: 24px;
          font-weight: 750;
          overflow-wrap: anywhere;
        }
        .sm-panel {
          background: white;
          border: 1px solid #eceef4;
          border-radius: 13px;
          overflow: hidden;
        }
        .sm-toolbar {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px;
          flex-wrap: wrap;
          border-bottom: 1px solid #eff0f4;
        }
        .sm-search {
          display: flex;
          align-items: center;
          gap: 9px;
          border: 1px solid #e7e9f0;
          border-radius: 9px;
          padding: 0 11px;
          flex: 1;
          min-width: 200px;
          height: 39px;
          color: #9296a7;
        }
        .sm-search input {
          border: 0;
          outline: 0;
          width: 100%;
          font-size: 12px;
          background: transparent;
          color: #202438;
        }
        .sm-select {
          height: 39px;
          padding: 0 11px;
          border: 1px solid #e7e9f0;
          border-radius: 9px;
          color: #51566b;
          background: white;
          outline: none;
          font-size: 12px;
          min-width: 135px;
        }
        .sm-table-wrap {
          overflow-x: auto;
        }
        .sm-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 850px;
          text-align: left;
        }
        .sm-table th {
          padding: 13px 16px;
          background: #fafafe;
          color: #9296a7;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .5px;
          font-weight: 700;
        }
        .sm-table td {
          padding: 15px 16px;
          border-top: 1px solid #f0f1f5;
          font-size: 12px;
          color: #555a6e;
        }
        .sm-user {
          color: #272b40;
          font-weight: 650;
        }
        .sm-muted {
          color: #999daf;
          font-size: 11px;
          margin-top: 4px;
        }
        .sm-badge {
          display: inline-flex;
          padding: 5px 9px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 700;
          text-transform: capitalize;
        }
        .sm-badge.success {
          background: #e8f8ef;
          color: #16834b;
        }
        .sm-badge.warning {
          background: #fff5df;
          color: #a76b00;
        }
        .sm-badge.danger {
          background: #ffeded;
          color: #d44343;
        }
        .sm-badge.neutral {
          background: #f0f1f5;
          color: #656b7e;
        }
        .sm-icon-btn {
          border: 1px solid #e9eaf0;
          background: white;
          border-radius: 8px;
          padding: 7px;
          color: #6746df;
          cursor: pointer;
          display: inline-flex;
        }
        .sm-empty {
          text-align: center;
          padding: 45px 15px;
          color: #969aab;
          font-size: 13px;
        }
        .sm-error {
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
        .sm-plans {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-top: 22px;
        }
        .sm-plan {
          padding: 17px;
          border-radius: 13px;
          border: 1px solid #eceef4;
          background: white;
        }
        .sm-plan-name {
          font-weight: 750;
          font-size: 15px;
          margin-bottom: 8px;
        }
        .sm-plan-price {
          font-size: 22px;
          font-weight: 750;
          margin: 10px 0;
        }
        .sm-plan-meta {
          font-size: 11px;
          color: #8b8fa0;
        }
        .sm-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(20, 22, 38, .5);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
        }
        .sm-modal {
          width: 100%;
          max-width: 510px;
          max-height: 90vh;
          overflow-y: auto;
          background: white;
          border-radius: 15px;
          padding: 22px;
          box-shadow: 0 20px 60px rgba(0,0,0,.15);
        }
        .sm-modal-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }
        .sm-modal-head h3 {
          margin: 0;
          font-size: 18px;
        }
        .sm-detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .sm-detail {
          background: #f8f8fc;
          border-radius: 9px;
          padding: 12px;
          min-width: 0;
          overflow-wrap: anywhere;
        }
        .sm-detail label {
          display: block;
          color: #9296a7;
          font-size: 10px;
          margin-bottom: 6px;
        }
        .sm-detail strong {
          font-size: 12px;
          color: #303449;
        }
        .sm-modal-actions {
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
          margin-top: 20px;
        }
        @media(max-width: 1100px) {
          .sm-stats { grid-template-columns: repeat(3, 1fr); }
        }
        @media(max-width: 650px) {
          .sm-stats { grid-template-columns: repeat(2, 1fr); }
          .sm-plans { grid-template-columns: 1fr; }
          .sm-title { font-size: 21px; }
          .sm-detail-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="sm-header">
        <div>
          <h1 className="sm-title">Subscription Management</h1>
          <p className="sm-subtitle">
            Manage membership plans, subscriptions and revenue.
          </p>
        </div>

        <div className="sm-actions">
          <button
            className="sm-btn"
            onClick={fetchSubscriptions}
            disabled={loading}
          >
            <RefreshCw size={14} />
            Refresh
          </button>

          <button
            className="sm-btn primary"
            onClick={exportCSV}
            disabled={!filteredSubscriptions.length}
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="sm-error">
          <AlertCircle size={17} />
          <span>{error}</span>
        </div>
      )}

      <div className="sm-stats">
        <div className="sm-stat">
          <div className="sm-stat-top">
            Total Subscriptions
            <span className="sm-stat-icon"><CreditCard size={17} /></span>
          </div>
          <div className="sm-stat-value">{stats.total}</div>
        </div>

        <div className="sm-stat">
          <div className="sm-stat-top">
            Active
            <span className="sm-stat-icon"><CheckCircle size={17} /></span>
          </div>
          <div className="sm-stat-value">{stats.active}</div>
        </div>

        <div className="sm-stat">
          <div className="sm-stat-top">
            Pending
            <span className="sm-stat-icon"><Clock size={17} /></span>
          </div>
          <div className="sm-stat-value">{stats.pending}</div>
        </div>

        <div className="sm-stat">
          <div className="sm-stat-top">
            Expired
            <span className="sm-stat-icon"><XCircle size={17} /></span>
          </div>
          <div className="sm-stat-value">{stats.expired}</div>
        </div>

        <div className="sm-stat">
          <div className="sm-stat-top">
            Recorded Revenue
            <span className="sm-stat-icon"><IndianRupee size={17} /></span>
          </div>
          <div className="sm-stat-value">{formatCurrency(stats.revenue)}</div>
        </div>
      </div>

      <div className="sm-panel">
        <div className="sm-toolbar">
          <div className="sm-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search customer, email, plan or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="sm-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
            <option value="failed">Failed</option>
          </select>

          <select
            className="sm-select"
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
          >
            <option value="all">All plans</option>
            {plans.map((plan) => (
              <option
                key={plan._id || plan.name}
                value={plan.name || plan.title}
              >
                {plan.name || plan.title}
              </option>
            ))}
          </select>
        </div>

        <div className="sm-table-wrap">
          <table className="sm-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="sm-empty">
                    Loading subscriptions...
                  </td>
                </tr>
              ) : filteredSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="sm-empty">
                    No subscription records found.
                  </td>
                </tr>
              ) : (
                filteredSubscriptions.map((item) => {
                  const user = item.user || item.userId || {};
                  const name =
                    typeof user === "string"
                      ? user
                      : user.fullName || user.name || "Unknown customer";

                  return (
                    <tr key={item._id}>
                      <td>
                        <div className="sm-user">{name}</div>
                        <div className="sm-muted">
                          {typeof user === "object" ? user.email || "—" : "—"}
                        </div>
                      </td>

                      <td>
                        {item.planName ||
                          item.plan?.name ||
                          item.plan?.title ||
                          "—"}
                      </td>

                      <td>
                        <strong>
                          {formatCurrency(item.amount ?? item.price ?? 0)}
                        </strong>
                      </td>

                      <td>
                        {formatDate(item.startDate || item.createdAt)}
                      </td>

                      <td>
                        {formatDate(item.endDate || item.expiryDate)}
                      </td>

                      <td>
                        <span
                          className={`sm-badge ${getStatusClass(item.status)}`}
                        >
                          {item.status || "Unknown"}
                        </span>
                      </td>

                      <td>
                        <button
                          className="sm-icon-btn"
                          title="View subscription"
                          onClick={() => setSelectedSubscription(item)}
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="sm-plans">
        {plans.length > 0 ? (
          plans.map((plan) => (
            <div className="sm-plan" key={plan._id || plan.name}>
              <div className="sm-plan-name">
                <Crown
                  size={16}
                  style={{
                    display: "inline",
                    marginRight: 7,
                    color: "#6746df",
                  }}
                />
                {plan.name || plan.title || "Membership Plan"}
              </div>

              <div className="sm-plan-price">
                {formatCurrency(plan.price || 0)}
              </div>

              <div className="sm-plan-meta">
                {plan.durationDays
                  ? `${plan.durationDays} days`
                  : plan.duration || "Duration not specified"}
                {" · "}
                {plan.isActive === false ? "Inactive" : "Active"}
              </div>
            </div>
          ))
        ) : (
          <div className="sm-plan">
            <div className="sm-plan-name">Membership Plans</div>
            <p className="sm-plan-meta">
              Plan information will appear here when returned by the backend.
            </p>
          </div>
        )}
      </div>

      {selectedSubscription && (
        <div
          className="sm-modal-overlay"
          onClick={() => setSelectedSubscription(null)}
        >
          <div
            className="sm-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sm-modal-head">
              <h3>Subscription Details</h3>
              <button
                className="sm-icon-btn"
                onClick={() => setSelectedSubscription(null)}
              >
                <X size={17} />
              </button>
            </div>

            {(() => {
              const item = selectedSubscription;
              const user = item.user || item.userId || {};
              const userName =
                typeof user === "string"
                  ? user
                  : user.fullName || user.name || "Unknown customer";

              return (
                <>
                  <div className="sm-detail-grid">
                    <div className="sm-detail">
                      <label>Customer</label>
                      <strong>{userName}</strong>
                    </div>

                    <div className="sm-detail">
                      <label>Email</label>
                      <strong>
                        {typeof user === "object" ? user.email || "—" : "—"}
                      </strong>
                    </div>

                    <div className="sm-detail">
                      <label>Plan</label>
                      <strong>
                        {item.planName || item.plan?.name || "—"}
                      </strong>
                    </div>

                    <div className="sm-detail">
                      <label>Amount</label>
                      <strong>
                        {formatCurrency(item.amount ?? item.price ?? 0)}
                      </strong>
                    </div>

                    <div className="sm-detail">
                      <label>Start Date</label>
                      <strong>
                        {formatDate(item.startDate || item.createdAt)}
                      </strong>
                    </div>

                    <div className="sm-detail">
                      <label>End Date</label>
                      <strong>
                        {formatDate(item.endDate || item.expiryDate)}
                      </strong>
                    </div>

                    <div className="sm-detail">
                      <label>Status</label>
                      <strong>{item.status || "Unknown"}</strong>
                    </div>

                    <div className="sm-detail">
                      <label>Subscription ID</label>
                      <strong>{item._id || "—"}</strong>
                    </div>
                  </div>

                  <div className="sm-modal-actions">
                    {String(item.status).toLowerCase() !== "active" && (
                      <button
                        className="sm-btn primary"
                        disabled={updatingId === item._id}
                        onClick={() =>
                          updateSubscriptionStatus(item._id, "active")
                        }
                      >
                        Activate
                      </button>
                    )}

                    {String(item.status).toLowerCase() === "active" && (
                      <button
                        className="sm-btn"
                        disabled={updatingId === item._id}
                        onClick={() =>
                          updateSubscriptionStatus(item._id, "cancelled")
                        }
                      >
                        Cancel subscription
                      </button>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
