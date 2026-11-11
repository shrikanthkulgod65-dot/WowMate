
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  BriefcaseBusiness,
  Users,
  CheckCircle,
  Ban,
  AlertCircle,
  MapPin,
  Mail,
  Phone,
  Eye,
  X,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function BrokerManagement() {
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [updatingId, setUpdatingId] = useState("");

  const token = localStorage.getItem("token");

  const fetchBrokers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/admin/brokers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load brokers.");
      }

      const records = Array.isArray(data)
        ? data
        : data.brokers || data.data || [];

      setBrokers(records);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBrokers();
  }, [fetchBrokers]);

  const filteredBrokers = useMemo(() => {
    return brokers.filter((broker) => {
      const name = broker.fullName || "";
      const email = broker.email || "";
      const mobile = broker.mobile || "";
      const business = broker.brokerDetails?.businessName || "";

      const matchesSearch = [
        name,
        email,
        mobile,
        business,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        broker.accountStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [brokers, search, statusFilter]);

  const statistics = {
    total: brokers.length,
    active: brokers.filter(
      (broker) => broker.accountStatus === "active"
    ).length,
    suspended: brokers.filter(
      (broker) => broker.accountStatus === "suspended"
    ).length,
    blocked: brokers.filter(
      (broker) => broker.accountStatus === "blocked"
    ).length,
  };

  async function updateBrokerStatus(broker, newStatus) {
    const confirmed = window.confirm(
      `Are you sure you want to ${newStatus} ${broker.fullName}?`
    );

    if (!confirmed) return;

    setUpdatingId(broker._id);

    try {
      const response = await fetch(
        `${API_URL}/api/admin/brokers/${broker._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ accountStatus: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Status update failed.");
      }

      setBrokers((previous) =>
        previous.map((item) =>
          item._id === broker._id
            ? {
                ...item,
                accountStatus:
                  data.broker?.accountStatus || newStatus,
              }
            : item
        )
      );

      setSelectedBroker((previous) =>
        previous?._id === broker._id
          ? {
              ...previous,
              accountStatus:
                data.broker?.accountStatus || newStatus,
            }
          : previous
      );
    } catch (err) {
      window.alert(err.message);
    } finally {
      setUpdatingId("");
    }
  }

  const statusStyle = (status) => {
    const styles = {
      active: { color: "#15803d", background: "#dcfce7" },
      suspended: { color: "#b45309", background: "#fef3c7" },
      blocked: { color: "#b91c1c", background: "#fee2e2" },
    };

    return styles[status] || {
      color: "#475569",
      background: "#f1f5f9",
    };
  };

  const cardStyle = {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 20,
    minWidth: 0,
  };

  const buttonStyle = {
    border: "1px solid #e5e7eb",
    background: "#fff",
    borderRadius: 8,
    padding: "8px 12px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 13,
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">BROKER MANAGEMENT</span>
          <h1>Broker Management</h1>
          <p>
            Manage broker accounts, business information and account status.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchBrokers}
          disabled={loading}
          style={buttonStyle}
        >
          <RefreshCw size={16} />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div style={cardStyle}>
          <BriefcaseBusiness color="#7c3aed" size={22} />
          <p>Total Brokers</p>
          <h2>{statistics.total}</h2>
        </div>

        <div style={cardStyle}>
          <CheckCircle color="#16a34a" size={22} />
          <p>Active Brokers</p>
          <h2>{statistics.active}</h2>
        </div>

        <div style={cardStyle}>
          <AlertCircle color="#d97706" size={22} />
          <p>Suspended Brokers</p>
          <h2>{statistics.suspended}</h2>
        </div>

        <div style={cardStyle}>
          <Ban color="#dc2626" size={22} />
          <p>Blocked Brokers</p>
          <h2>{statistics.blocked}</h2>
        </div>
      </div>

      <section style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          <div style={{ position: "relative", flex: "1 1 250px" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: 12,
                top: 12,
                color: "#64748b",
              }}
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search broker, business, email..."
              style={{
                width: "100%",
                padding: "11px 12px 11px 40px",
                border: "1px solid #e5e7eb",
                borderRadius: 9,
                boxSizing: "border-box",
              }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            style={{
              padding: "10px 14px",
              border: "1px solid #e5e7eb",
              borderRadius: 9,
              minWidth: 150,
            }}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>

        {error && (
          <div
            style={{
              padding: 14,
              marginBottom: 16,
              background: "#fef2f2",
              color: "#b91c1c",
              borderRadius: 8,
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <p style={{ textAlign: "center", padding: 40 }}>
            Loading broker records...
          </p>
        ) : filteredBrokers.length === 0 ? (
          <div style={{ textAlign: "center", padding: 45 }}>
            <Users size={36} color="#94a3b8" />
            <h3>No brokers found</h3>
            <p>Try changing your search or status filter.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 850,
                textAlign: "left",
              }}
            >
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {[
                    "Broker",
                    "Business",
                    "Contact",
                    "Location",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: 14,
                        borderBottom: "1px solid #e5e7eb",
                        fontSize: 13,
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredBrokers.map((broker) => (
                  <tr key={broker._id}>
                    <td style={{ padding: 14, borderBottom: "1px solid #eee" }}>
                      <strong>{broker.fullName || "Unnamed Broker"}</strong>
                      <div style={{ color: "#64748b", fontSize: 12 }}>
                        ID: {broker._id?.slice(-8)}
                      </div>
                    </td>

                    <td style={{ padding: 14, borderBottom: "1px solid #eee" }}>
                      {broker.brokerDetails?.businessName || "—"}
                      <div style={{ color: "#64748b", fontSize: 12 }}>
                        {broker.brokerDetails?.experienceYears || 0} years experience
                      </div>
                    </td>

                    <td style={{ padding: 14, borderBottom: "1px solid #eee" }}>
                      <div><Mail size={13} /> {broker.email || "—"}</div>
                      <div><Phone size={13} /> {broker.mobile || "—"}</div>
                    </td>

                    <td style={{ padding: 14, borderBottom: "1px solid #eee" }}>
                      <MapPin size={14} />
                      {broker.brokerDetails?.city || "—"}
                    </td>

                    <td style={{ padding: 14, borderBottom: "1px solid #eee" }}>
                      <span
                        style={{
                          ...statusStyle(broker.accountStatus),
                          padding: "5px 10px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {broker.accountStatus || "unknown"}
                      </span>
                    </td>

                    <td style={{ padding: 14, borderBottom: "1px solid #eee" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          type="button"
                          title="View broker"
                          style={buttonStyle}
                          onClick={() => setSelectedBroker(broker)}
                        >
                          <Eye size={15} />
                        </button>

                        {broker.accountStatus !== "active" && (
                          <button
                            type="button"
                            style={buttonStyle}
                            disabled={updatingId === broker._id}
                            onClick={() => updateBrokerStatus(broker, "active")}
                          >
                            Activate
                          </button>
                        )}

                        {broker.accountStatus !== "suspended" && (
                          <button
                            type="button"
                            style={buttonStyle}
                            disabled={updatingId === broker._id}
                            onClick={() => updateBrokerStatus(broker, "suspended")}
                          >
                            Suspend
                          </button>
                        )}

                        {broker.accountStatus !== "blocked" && (
                          <button
                            type="button"
                            style={buttonStyle}
                            disabled={updatingId === broker._id}
                            onClick={() => updateBrokerStatus(broker, "blocked")}
                          >
                            Block
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedBroker && (
        <div
          onClick={() => setSelectedBroker(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(15, 23, 42, 0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
          }}
        >
          <section
            onClick={(event) => event.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 24,
              width: "100%",
              maxWidth: 520,
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2>Broker Details</h2>
              <button
                type="button"
                onClick={() => setSelectedBroker(null)}
                style={buttonStyle}
              >
                <X size={18} />
              </button>
            </div>

            <h3>{selectedBroker.fullName}</h3>
            <p>Email: {selectedBroker.email || "—"}</p>
            <p>Mobile: {selectedBroker.mobile || "—"}</p>
            <p>Business: {selectedBroker.brokerDetails?.businessName || "—"}</p>
            <p>Experience: {selectedBroker.brokerDetails?.experienceYears || 0} years</p>
            <p>City: {selectedBroker.brokerDetails?.city || "—"}</p>
            <p>Service Area: {selectedBroker.brokerDetails?.serviceArea || "—"}</p>
            <p>About: {selectedBroker.brokerDetails?.about || "—"}</p>
            <p>Status: {selectedBroker.accountStatus || "unknown"}</p>
          </section>
        </div>
      )}
    </div>
  );
}
