import { useEffect, useState } from "react";

const API_URL = (
  import.meta.env.VITE_API_URL || "https://wowmate.co.in/api"
).replace(/\/+$/, "");

export default function PaymentResult() {
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState(
    "Checking your payment with Cashfree..."
  );
  const [subscription, setSubscription] = useState(null);

  const orderId = new URLSearchParams(window.location.search)
    .get("order_id");

  const verifyPayment = async () => {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!orderId) {
      setStatus("error");
      setMessage("Payment order ID is missing.");
      return;
    }

    if (!token) {
      setStatus("error");
      setMessage("Please log in again to verify your payment.");
      return;
    }

    setStatus("checking");
    setMessage("Checking your payment with Cashfree...");

    try {
      const response = await fetch(
        `${API_URL}/subscriptions/cashfree/verify-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderId }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSubscription(data.subscription || null);
        setStatus("success");
        setMessage(
          data.message || "Your membership has been activated."
        );
        return;
      }

      if (response.status === 202 || data.status === "pending") {
        setStatus("pending");
        setMessage(
          "Your payment is still being confirmed. Please check again shortly."
        );
        return;
      }

      setStatus("error");
      setMessage(data.message || "Payment verification failed.");
    } catch (error) {
      console.error("Cashfree verification error:", error);
      setStatus("error");
      setMessage(
        "Unable to contact the payment server. Please retry."
      );
    }
  };

  useEffect(() => {
    verifyPayment();
  }, [orderId]);

  const isSuccess = status === "success";

  return (
    <main
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        padding: "30px 16px",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "480px",
          padding: "32px 24px",
          borderRadius: "16px",
          background: "#ffffff",
          boxShadow: "0 8px 35px rgba(0,0,0,0.09)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "46px",
            marginBottom: "16px",
          }}
        >
          {isSuccess ? "✓" : status === "checking" ? "…" : "!"}
        </div>

        <h1 style={{ color: "#8b1e4f", marginBottom: "12px" }}>
          {isSuccess
            ? "Payment Successful"
            : status === "checking"
              ? "Verifying Payment"
              : status === "pending"
                ? "Payment Pending"
                : "Payment Verification"}
        </h1>

        <p style={{ color: "#555", lineHeight: 1.6 }}>
          {message}
        </p>

        {subscription && (
          <p style={{ color: "#166534", marginTop: "16px" }}>
            Membership: {subscription.plan || "Activated"}
          </p>
        )}

        {status !== "success" && (
          <button
            type="button"
            onClick={verifyPayment}
            disabled={status === "checking"}
            style={{
              marginTop: "20px",
              padding: "12px 24px",
              border: "none",
              borderRadius: "8px",
              background: "#8b1e4f",
              color: "#fff",
              cursor: status === "checking" ? "wait" : "pointer",
            }}
          >
            {status === "checking" ? "Checking..." : "Verify Payment Again"}
          </button>
        )}

        {isSuccess && (
          <a
            href="/dashboard"
            style={{
              display: "inline-block",
              marginTop: "20px",
              padding: "12px 24px",
              borderRadius: "8px",
              background: "#8b1e4f",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            Go to Dashboard
          </a>
        )}
      </section>
    </main>
  );
}
