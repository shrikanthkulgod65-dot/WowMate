
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  IndianRupee,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  RefreshCw,
  Download,
  Eye,
  X,
} from "lucide-react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function PaymentsManagement() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/admin/payments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to fetch payment records."
        );
      }

      const records = Array.isArray(data)
        ? data
        : data.payments || data.data || [];

      setPayments(records);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const getStatus = (payment) =>
    String(payment.status || payment.paymentStatus || "unknown")
      .toLowerCase();

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const customerName =
        payment.user?.fullName ||
        payment.customerName ||
        "";

      const email =
        payment.user?.email ||
        payment.email ||
        "";

      const transactionId =
        payment.transactionId ||
        payment.razorpayPaymentId ||
        payment.paymentId ||
        "";

      const searchText = [
        customerName,
        email,
        transactionId,
        payment.planName || "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.includes(
        search.toLowerCase()
      );

      const matchesStatus =
        statusFilter === "all" ||
        getStatus(payment) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, search, statusFilter]);

  const amountOf = (payment) =>
    Number(payment.amount || payment.totalAmount || 0);

  const formatAmount = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: paymentCurrency,
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0);

  const paymentCurrency = "INR";

  const totalAmount = payments.reduce(
    (sum, payment) =>
      getStatus(payment) === "success"
        ? sum + amountOf(payment)
        : sum,
    0
  );

  const successfulCount = payments.filter(
    (payment) => getStatus(payment) === "success"
  ).length;

  const pendingCount = payments.filter(
    (payment) => getStatus(payment) === "pending"
  ).length;

  const failedCount = payments.filter(
    (payment) => getStatus(payment) === "failed"
  ).length;

  const cardStyle = {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 20,
  };

  const buttonStyle = {
    display: "inline-flex",
    alignItems: "center",
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
      success: { color: "#15803d", background: "#dcfce7" },
      completed: { color: "#15803d", background: "#dcfce7" },
      pending: { color: "#b45309", background: "#fef3c7" },
      failed: { color: "#b91c1c", background: "#fee2e2" },
      refunded: { color: "#1d4ed8", background: "#dbeafe" },
    };

    return styles[status] || {
      color: "#475569",
      background: "#f1f5f9",
    };
  };

  function exportCSV() {
    if (!filteredPayments.length) {
      window.alert("No payment records available to export.");
      return;
    }

    const headers = [
      "Customer",
      "Email",
      "Transaction ID",
      "Plan",
      "Amount",
      "Status",
      "Payment Method",
      "Date",
    ];

    const rows = filteredPayments.map((payment) => [
      payment.user?.fullName || payment.customerName || "",
      payment.user?.email || payment.email || "",
      payment.transactionId ||
        payment.razorpayPaymentId ||
        payment.paymentId ||
        "",
      payment.planName || "",
      amountOf(payment),
      getStatus(payment),
      payment.paymentMethod || "",
      payment.createdAt
        ? new Date(payment.createdAt).toLocaleString("en-IN")
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
    link.download = "wowmate-payments.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="admin-dashboard">
      <div
        className="admin-page-heading"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <span className="admin-eyebrow">FINANCE MANAGEMENT</span>
          <h1>Payment Management</h1>
          <p>Monitor transactions and payment activity.</p>
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
            onClick={fetchPayments}
            disabled={loading}
            style={buttonStyle}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div style={cardStyle}>
          <IndianRupee color="#7c3aed" size={23} />
          <p>Total Successful Revenue</p>
          <h2>{formatAmount(totalAmount)}</h2>
        </div>

        <div style={cardStyle}>
          <CheckCircle color="#16a34a" size={23} />
          <p>Successful Payments</p>
          <h2>{successfulCount}</h2>
        </div>

        <div style={cardStyle}>
          <Clock color="#d97706" size={23} />
          <p>Pending Payments</p>
          <h2>{pendingCount}</h2>
        </div>

        <div style={cardStyle}>
          <XCircle color="#dc2626" size={23} />
          <p>Failed Payments</p>
          <h2>{failedCount}</h2>
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
              placeholder="Search customer or transaction ID..."
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
            onChange={(event) => setStatusFilter(event.target.value)}
            style={{
              padding: "10px 14px",
              border: "1px solid #e5e7eb",
              borderRadius: 9,
              minWidth: 150,
            }}
          >
            <option value="all">All Payments</option>
            <option value="success">Successful</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
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
            Loading payment records...
          </p>
        ) : filteredPayments.length === 0 ? (
          <div style={{ textAlign: "center", padding: 45 }}>
            <CreditCard size={38} color="#94a3b8" />
            <h3>No payment records found</h3>
            <p>Payment records will appear here when available.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                minWidth: 850,
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {[
                    "Customer",
                    "Transaction ID",
                    "Plan",
                    "Amount",
                    "Date",
                    "Status",
                    "Action",
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
                {filteredPayments.map((payment) => {
                  const status = getStatus(payment);

                  return (
                    <tr key={payment._id || payment.transactionId}>
                      <td style={{ padding: 14, borderBottom: "1px solid #eee" }}>
                        <strong>
                          {payment.user?.fullName ||
                            payment.customerName ||
                            "Customer"}
                        </strong>
                        <div style={{ color: "#64748b", fontSize: 12 }}>
                          {payment.user?.email || payment.email || "—"}
                        </div>
                      </td>

                      <td style={{ padding: 14, borderBottom: "1px solid #eee" }}>
                        {payment.transactionId ||
                          payment.razorpayPaymentId ||
                          payment.paymentId ||
                          "—"}
                      </td>

                      <td style={{ padding: 14, borderBottom: "1px solid #eee" }}>
                        {payment.planName || "—"}
                      </td>

                      <td style={{ padding: 14, borderBottom: "1px solid #eee" }}>
                        <strong>{formatAmount(amountOf(payment))}</strong>
                      </td>

                      <td style={{ padding: 14, borderBottom: "1px solid #eee" }}>
                        {payment.createdAt
                          ? new Date(payment.createdAt).toLocaleDateString("en-IN")
                          : "—"}
                      </td>

                      <td style={{ padding: 14, borderBottom: "1px solid #eee" }}>
                        <span
                          style={{
                            ...statusStyle(status),
                            padding: "5px 10px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {status}
                        </span>
                      </td>

                      <td style={{ padding: 14, borderBottom: "1px solid #eee" }}>
                        <button
                          type="button"
                          style={buttonStyle}
                          onClick={() => setSelectedPayment(payment)}
                        >
                          <Eye size={15} />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {selectedPayment && (
        <div
          onClick={() => setSelectedPayment(null)}
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
              maxWidth: 500,
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2>Payment Details</h2>
              <button
                type="button"
                style={buttonStyle}
                onClick={() => setSelectedPayment(null)}
              >
                <X size={18} />
              </button>
            </div>

            <p>
              <strong>Customer:</strong>{" "}
              {selectedPayment.user?.fullName ||
                selectedPayment.customerName ||
                "—"}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {selectedPayment.user?.email ||
                selectedPayment.email ||
                "—"}
            </p>
            <p>
              <strong>Transaction ID:</strong>{" "}
              {selectedPayment.transactionId ||
                selectedPayment.razorpayPaymentId ||
                selectedPayment.paymentId ||
                "—"}
            </p>
            <p>
              <strong>Plan:</strong>{" "}
              {selectedPayment.planName || "—"}
            </p>
            <p>
              <strong>Amount:</strong>{" "}
              {formatAmount(amountOf(selectedPayment))}
            </p>
            <p>
              <strong>Status:</strong> {getStatus(selectedPayment)}
            </p>
            <p>
              <strong>Payment Method:</strong>{" "}
              {selectedPayment.paymentMethod || "—"}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {selectedPayment.createdAt
                ? new Date(selectedPayment.createdAt).toLocaleString("en-IN")
                : "—"}
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
