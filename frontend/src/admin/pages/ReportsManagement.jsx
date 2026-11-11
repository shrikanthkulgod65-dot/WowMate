
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  RefreshCw,
  Flag,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  X,
  AlertTriangle,
  Download,
  User,
  Calendar,
  FileText,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ReportsManagement() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);
  const [updatingId, setUpdatingId] = useState("");

  const token = localStorage.getItem("token");

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/admin/reports`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load reports."
        );
      }

      const records = Array.isArray(data)
        ? data
        : data.reports || data.data || [];

      setReports(records);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const getStatus = (report) =>
    String(report.status || "pending").toLowerCase();

  const getCategory = (report) =>
    report.category || report.reason || "Other";

  const getReporterName = (report) =>
    report.reporter?.fullName ||
    report.reporterName ||
    "Unknown user";

  const getReportedName = (report) =>
    report.reportedUser?.fullName ||
    report.reportedUserName ||
    "Unknown member";

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const searchableText = [
        getReporterName(report),
        getReportedName(report),
        report.description || "",
        getCategory(report),
        report.reportedUser?.email || "",
        report.reporter?.email || "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(
        search.toLowerCase()
      );

      const matchesStatus =
        statusFilter === "all" ||
        getStatus(report) === statusFilter;

      const matchesCategory =
        categoryFilter === "all" ||
        getCategory(report).toLowerCase() ===
          categoryFilter.toLowerCase();

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [reports, search, statusFilter, categoryFilter]);

  const statistics = {
    total: reports.length,
    pending: reports.filter(
      (report) => getStatus(report) === "pending"
    ).length,
    reviewing: reports.filter(
      (report) => getStatus(report) === "under_review"
    ).length,
    resolved: reports.filter(
      (report) => getStatus(report) === "resolved"
    ).length,
    dismissed: reports.filter(
      (report) => getStatus(report) === "dismissed"
    ).length,
  };

  const categories = useMemo(() => {
    return [...new Set(reports.map(getCategory))];
  }, [reports]);

  const cardStyle = {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 20,
  };

  const buttonStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    padding: "9px 12px",
    border: "1px solid #e5e7eb",
    background: "#fff",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
  };

  const statusStyle = (status) => {
    const styles = {
      pending: {
        color: "#b45309",
        background: "#fef3c7",
      },
      under_review: {
        color: "#1d4ed8",
        background: "#dbeafe",
      },
      resolved: {
        color: "#15803d",
        background: "#dcfce7",
      },
      dismissed: {
        color: "#64748b",
        background: "#f1f5f9",
      },
    };

    return styles[status] || {
      color: "#475569",
      background: "#f1f5f9",
    };
  };

  async function updateReportStatus(report, newStatus) {
    const labels = {
      under_review: "move this report under review",
      resolved: "mark this report as resolved",
      dismissed: "dismiss this report",
    };

    const confirmed = window.confirm(
      `Are you sure you want to ${labels[newStatus]}?`
    );

    if (!confirmed) return;

    setUpdatingId(report._id);

    try {
      const response = await fetch(
        `${API_URL}/api/admin/reports/${report._id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update report."
        );
      }

      const updatedStatus =
        data.report?.status || newStatus;

      setReports((previous) =>
        previous.map((item) =>
          item._id === report._id
            ? { ...item, status: updatedStatus }
            : item
        )
      );

      setSelectedReport((previous) =>
        previous?._id === report._id
          ? { ...previous, status: updatedStatus }
          : previous
      );
    } catch (err) {
      window.alert(err.message);
    } finally {
      setUpdatingId("");
    }
  }

  function exportCSV() {
    if (!filteredReports.length) {
      window.alert("No reports available to export.");
      return;
    }

    const headers = [
      "Report ID",
      "Reporter",
      "Reported Member",
      "Category",
      "Description",
      "Status",
      "Date",
    ];

    const rows = filteredReports.map((report) => [
      report._id || "",
      getReporterName(report),
      getReportedName(report),
      getCategory(report),
      report.description || "",
      getStatus(report),
      report.createdAt
        ? new Date(report.createdAt).toLocaleString("en-IN")
        : "",
    ]);

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "wowmate-reports.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="admin-dashboard">
      {/* Page heading */}
      <div
        className="admin-page-heading"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <span className="admin-eyebrow">
            REPORTS & SAFETY
          </span>

          <h1>Reports Management</h1>

          <p>
            Review member complaints and maintain platform safety.
          </p>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={exportCSV}
            style={buttonStyle}
          >
            <Download size={16} />
            Export CSV
          </button>

          <button
            type="button"
            onClick={fetchReports}
            disabled={loading}
            style={buttonStyle}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(170px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div style={cardStyle}>
          <Flag size={23} color="#7c3aed" />
          <p>Total Reports</p>
          <h2>{statistics.total}</h2>
        </div>

        <div style={cardStyle}>
          <Clock size={23} color="#d97706" />
          <p>Pending</p>
          <h2>{statistics.pending}</h2>
        </div>

        <div style={cardStyle}>
          <AlertTriangle size={23} color="#2563eb" />
          <p>Under Review</p>
          <h2>{statistics.reviewing}</h2>
        </div>

        <div style={cardStyle}>
          <CheckCircle size={23} color="#16a34a" />
          <p>Resolved</p>
          <h2>{statistics.resolved}</h2>
        </div>

        <div style={cardStyle}>
          <XCircle size={23} color="#64748b" />
          <p>Dismissed</p>
          <h2>{statistics.dismissed}</h2>
        </div>
      </div>

      {/* Reports table */}
      <section style={cardStyle}>
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              position: "relative",
              flex: "1 1 240px",
            }}
          >
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
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search reports, members, reasons..."
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "11px 12px 11px 40px",
                border: "1px solid #e5e7eb",
                borderRadius: 9,
              }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            style={{
              padding: "10px 14px",
              border: "1px solid #e5e7eb",
              borderRadius: 9,
            }}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
            style={{
              padding: "10px 14px",
              border: "1px solid #e5e7eb",
              borderRadius: 9,
            }}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div
            style={{
              padding: 14,
              background: "#fef2f2",
              color: "#b91c1c",
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <p style={{ textAlign: "center", padding: 40 }}>
            Loading reports...
          </p>
        ) : filteredReports.length === 0 ? (
          <div style={{ textAlign: "center", padding: 45 }}>
            <Flag size={38} color="#94a3b8" />
            <h3>No reports found</h3>
            <p>There are no reports matching your filters.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                minWidth: 900,
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {[
                    "Reporter",
                    "Reported Member",
                    "Category",
                    "Description",
                    "Date",
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
                {filteredReports.map((report) => {
                  const status = getStatus(report);

                  return (
                    <tr key={report._id}>
                      <td
                        style={{
                          padding: 14,
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <strong>{getReporterName(report)}</strong>
                      </td>

                      <td
                        style={{
                          padding: 14,
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {getReportedName(report)}
                      </td>

                      <td
                        style={{
                          padding: 14,
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {getCategory(report)}
                      </td>

                      <td
                        style={{
                          padding: 14,
                          borderBottom: "1px solid #eee",
                          maxWidth: 220,
                        }}
                      >
                        {report.description || "—"}
                      </td>

                      <td
                        style={{
                          padding: 14,
                          borderBottom: "1px solid #eee",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {report.createdAt
                          ? new Date(
                              report.createdAt
                            ).toLocaleDateString("en-IN")
                          : "—"}
                      </td>

                      <td
                        style={{
                          padding: 14,
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <span
                          style={{
                            ...statusStyle(status),
                            padding: "5px 10px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {status.replace("_", " ")}
                        </span>
                      </td>

                      <td
                        style={{
                          padding: 14,
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 6,
                            flexWrap: "wrap",
                          }}
                        >
                          <button
                            type="button"
                            style={buttonStyle}
                            onClick={() =>
                              setSelectedReport(report)
                            }
                          >
                            <Eye size={15} />
                          </button>

                          {status === "pending" && (
                            <button
                              type="button"
                              style={buttonStyle}
                              disabled={updatingId === report._id}
                              onClick={() =>
                                updateReportStatus(
                                  report,
                                  "under_review"
                                )
                              }
                            >
                              Review
                            </button>
                          )}

                          {status !== "resolved" && (
                            <button
                              type="button"
                              style={buttonStyle}
                              disabled={updatingId === report._id}
                              onClick={() =>
                                updateReportStatus(
                                  report,
                                  "resolved"
                                )
                              }
                            >
                              Resolve
                            </button>
                          )}

                          {status !== "dismissed" && (
                            <button
                              type="button"
                              style={buttonStyle}
                              disabled={updatingId === report._id}
                              onClick={() =>
                                updateReportStatus(
                                  report,
                                  "dismissed"
                                )
                              }
                            >
                              Dismiss
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Report detail modal */}
      {selectedReport && (
        <div
          onClick={() => setSelectedReport(null)}
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
              maxWidth: 540,
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2>Report Details</h2>

              <button
                type="button"
                style={buttonStyle}
                onClick={() => setSelectedReport(null)}
              >
                <X size={18} />
              </button>
            </div>

            <p>
              <User size={16} /> <strong>Reporter:</strong>{" "}
              {getReporterName(selectedReport)}
            </p>

            <p>
              <User size={16} /> <strong>Reported Member:</strong>{" "}
              {getReportedName(selectedReport)}
            </p>

            <p>
              <FileText size={16} /> <strong>Category:</strong>{" "}
              {getCategory(selectedReport)}
            </p>

            <p>
              <Calendar size={16} /> <strong>Date:</strong>{" "}
              {selectedReport.createdAt
                ? new Date(
                    selectedReport.createdAt
                  ).toLocaleString("en-IN")
                : "—"}
            </p>

            <p>
              <strong>Description:</strong>
            </p>

            <div
              style={{
                padding: 14,
                background: "#f8fafc",
                borderRadius: 8,
                lineHeight: 1.6,
              }}
            >
              {selectedReport.description || "No description provided."}
            </div>

            <p>
              <strong>Status:</strong>{" "}
              {getStatus(selectedReport).replace("_", " ")}
            </p>

            {selectedReport.adminNotes && (
              <p>
                <strong>Admin Notes:</strong>{" "}
                {selectedReport.adminNotes}
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
