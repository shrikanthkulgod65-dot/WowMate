
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const plans = [
  {
    id: "starter",
    name: "Starter",
    description: "Try the premium experience at a low price.",
    price: "₹9",
    period: "7 days",
    features: [
      "Create your matrimony profile",
      "Browse public profiles",
      "Send up to 3 interests",
      "Basic matchmaking",
      "Limited profile details",
      "Explore broker profiles",
    ],
    action: "Choose Starter",
    theme: "starter",
  },
  {
    id: "silver",
    name: "Silver",
    description: "Take the next step towards meaningful connections.",
    price: "₹299",
    period: "30 days",
    features: [
      "Everything in Starter",
      "Send up to 25 interests",
      "View eligible contact details",
      "Advanced profile search filters",
      "View more profile information",
      "Save favourite profiles",
      "Access eligible protected broker details",
    ],
    action: "Choose Silver",
    theme: "silver",
    featured: true,
  },
  {
    id: "gold",
    name: "Gold",
    description: "Enjoy a more complete matchmaking experience.",
    price: "₹699",
    period: "90 days",
    features: [
      "Everything in Silver",
      "Unlimited interests",
      "Access eligible contact details",
      "Advanced matchmaking filters",
      "Priority profile visibility",
      "Priority assistance",
      "Access eligible protected broker details",
    ],
    action: "Choose Gold",
    theme: "gold",
  },
];

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () =>
        resolve(Boolean(window.Razorpay))
      );
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
}

export default function SubscriptionPlans() {
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const getToken = () =>
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
  };

  const handleSubscribe = async (plan) => {
    if (loadingPlan) return;

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    setLoadingPlan(plan.id);
    setMessage("");

    try {
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error("Unable to load Razorpay Checkout. Please retry.");
      }

      // Step 1: Create order through backend
      const orderResponse = await fetch(
        `${API_URL}/subscriptions/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            planId: plan.id,
          }),
        }
      );

      const orderData = await orderResponse.json();

      if (!orderResponse.ok || !orderData.success) {
        throw new Error(
          orderData.message || "Unable to create payment order."
        );
      }

      // Step 2: Open Razorpay Checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "WowMarriage",
        description: `${plan.name} Membership`,
        order_id: orderData.order.id,

        theme: {
          color: "#8b1e4f",
        },

        handler: async function (response) {
          try {
            // Step 3: Verify payment through backend
            const verifyResponse = await fetch(
              `${API_URL}/subscriptions/verify-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_payment_id:
                    response.razorpay_payment_id,
                  razorpay_order_id:
                    response.razorpay_order_id,
                  razorpay_signature:
                    response.razorpay_signature,
                }),
              }
            );

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.success) {
              throw new Error(
                verifyData.message || "Payment verification failed."
              );
            }

            showMessage(
              `${plan.name} membership activated successfully!`,
              "success"
            );
          } catch (error) {
            showMessage(
              error.message ||
                "Payment received, but verification is pending. Please contact support before retrying.",
              "error"
            );
          } finally {
            setLoadingPlan(null);
          }
        },

        modal: {
          ondismiss: function () {
            setLoadingPlan(null);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        showMessage(
          response.error?.description ||
            "Payment failed. Please try again.",
          "error"
        );

        setLoadingPlan(null);
      });

      razorpay.open();
    } catch (error) {
      showMessage(
        error.message || "Something went wrong. Please try again.",
        "error"
      );

      setLoadingPlan(null);
    }
  };

  return (
    <main>
      <section className="pricing-section">
        <div className="pricing-container">
          <div className="pricing-heading">
            <span className="pricing-label">
              MEMBERSHIP PLANS
            </span>

            <h1>Find Your Perfect Match with WowMarriage</h1>

            <p>
              Choose an affordable membership and take the next step
              towards your happily ever after.
            </p>
          </div>

          {message && (
            <div
              role="status"
              aria-live="polite"
              style={{
                padding: "14px",
                marginBottom: "20px",
                borderRadius: "8px",
                background:
                  messageType === "success" ? "#e8f8ee" : "#fff0f0",
                color:
                  messageType === "success" ? "#166534" : "#b91c1c",
              }}
            >
              {message}
            </div>
          )}

          <div className="pricing-grid">
            {plans.map((plan) => (
              <article
                className={`pricing-card pricing-${plan.theme}${
                  plan.featured ? " pricing-featured" : ""
                }`}
                key={plan.id}
              >
                {plan.featured && (
                  <span className="pricing-badge">
                    MOST POPULAR
                  </span>
                )}

                {plan.name === "Starter" && (
                  <span className="pricing-badge">
                    BUDGET FRIENDLY
                  </span>
                )}

                {plan.name === "Gold" && (
                  <span className="pricing-badge">
                    BEST VALUE
                  </span>
                )}

                <h3>{plan.name}</h3>

                <p className="pricing-description">
                  {plan.description}
                </p>

                <div className="pricing-price">
                  {plan.price} <span>/ {plan.period}</span>
                </div>

                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <span aria-hidden="true">✓</span> {feature}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className="pricing-button"
                  onClick={() => handleSubscribe(plan)}
                  disabled={Boolean(loadingPlan)}
                >
                  {loadingPlan === plan.id
                    ? "Processing..."
                    : plan.action}
                </button>
              </article>
            ))}
          </div>

          <div className="pricing-note">
            <p>
              <strong>Secure payments:</strong> Payments are
              processed through Razorpay. Your membership activates
              after successful payment verification.
            </p>

            <p>
              Subscription duration starts after payment verification.
              All prices are in Indian Rupees (INR).
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
