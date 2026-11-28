
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = (
  import.meta.env.VITE_API_URL || "https://wowmate.co.in/api"
).replace(/\/+$/, "");

const plans = [
  {
    id: "starter",
    name: "Starter",
    description: "Start your matchmaking journey at an affordable price.",
    price: "₹9",
    period: "7 days",
    interestLimit: 3,
    contactUnlockLimit: 3,
    priorityInterestLimit: 0,
    profileBoostLimit: 0,
    features: [
      "Create your matrimony profile",
      "Browse registered public profiles",
      "Send up to 3 interests",
      "Basic matchmaking",
      "Limited profile details",
      "Explore broker profiles",
      "Unlock up to 3 contact details",
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
    interestLimit: 30,
    contactUnlockLimit: 10,
    priorityInterestLimit: 2,
    profileBoostLimit: 0,
    features: [
      "Create your matrimony profile",
      "Browse registered public profiles",
      "Send up to 30 interests",
      "Unlock up to 10 contact details",
      "Get 2 priority interests",
      "Advanced profile search filters",
      "View full eligible profile information",
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
    period: "30 days",
    interestLimit: 100,
    contactUnlockLimit: 30,
    priorityInterestLimit: 10,
    profileBoostLimit: 5,
    features: [
      "Everything included in Silver",
      "Send up to 100 interests",
      "Unlock up to 30 contact details",
      "Get 10 priority interests",
      "5 profile boosts",
      "Advanced matchmaking filters",
      "Priority profile visibility",
      "Priority assistance",
      "Access eligible protected broker details",
    ],
    action: "Choose Gold",
    theme: "gold",
  },
];

function loadCashfreeScript() {
  return new Promise((resolve) => {
    if (window.Cashfree) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://sdk.cashfree.com/js/v3/cashfree.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener(
        "load",
        () => resolve(Boolean(window.Cashfree)),
        { once: true }
      );

      existingScript.addEventListener(
        "error",
        () => resolve(false),
        { once: true }
      );

      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;

    script.onload = () => resolve(Boolean(window.Cashfree));
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
      // Load Cashfree Checkout SDK.
      const scriptLoaded = await loadCashfreeScript();

      if (!scriptLoaded) {
        throw new Error(
          "Unable to load Cashfree Checkout. Please retry."
        );
      }

      // Create payment order through the backend.
      const orderResponse = await fetch(
        `${API_URL}/subscriptions/cashfree/create-order`,
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

      const orderData = await orderResponse.json().catch(() => ({}));

      if (!orderResponse.ok || !orderData.success) {
        throw new Error(
          orderData.message ||
            "Unable to create Cashfree payment order."
        );
      }

      const paymentSessionId =
        orderData.order?.paymentSessionId;

      const environment = orderData.environment;

      if (
        !paymentSessionId ||
        !["sandbox", "production"].includes(environment)
      ) {
        throw new Error(
          "Invalid Cashfree payment session."
        );
      }

      // Initialize Cashfree Checkout.
      const cashfree = window.Cashfree({
        mode: environment,
      });

      // Open hosted Cashfree checkout.
      const checkoutResult = await cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_self",
      });

      if (checkoutResult?.error) {
        throw new Error(
          checkoutResult.error.message ||
            "Cashfree checkout failed."
        );
      }
    } catch (error) {
      console.error("Cashfree checkout error:", error);

      showMessage(
        error.message ||
          "Unable to start payment. Please try again.",
        "error"
      );

      setLoadingPlan(null);
    }
  };

  return (
    <main>
      <section className="pricing-section">
        <div className="pricing-container">

          {/* Pricing heading */}

          <div className="pricing-heading">
            <span className="pricing-label">
              MEMBERSHIP PLANS
            </span>

            <h1>
              Find Your Perfect Match with WowMarriage
            </h1>

            <p>
              Choose an affordable membership and take
              the next step towards your happily ever after.
            </p>
          </div>

          {/* Payment status message */}

          {message && (
            <div
              role="status"
              aria-live="polite"
              style={{
                padding: "14px",
                marginBottom: "20px",
                borderRadius: "8px",
                background:
                  messageType === "success"
                    ? "#e8f8ee"
                    : "#fff0f0",
                color:
                  messageType === "success"
                    ? "#166534"
                    : "#b91c1c",
              }}
            >
              {message}
            </div>
          )}

          {/* Subscription plan cards */}

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

                {/* Plan limits */}

                <div className="pricing-limits">
                  <p>
                    <strong>Interests:</strong>{" "}
                    {plan.interestLimit}
                  </p>

                  <p>
                    <strong>Contact unlock quota:</strong>{" "}
                    {plan.contactUnlockLimit}
                  </p>

                  <p>
                    <strong>Priority interests:</strong>{" "}
                    {plan.priorityInterestLimit}
                  </p>

                  <p>
                    <strong>Profile boosts:</strong>{" "}
                    {plan.profileBoostLimit}
                  </p>
                </div>

                {/* Plan features */}

                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <span aria-hidden="true">✓</span>{" "}
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Payment button */}

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

          {/* Payment information */}

          <div className="pricing-note">
            <p>
              <strong>Secure payments:</strong> Payments are
              processed securely through Cashfree. Your
              membership activates after successful payment
              verification.
            </p>

            <p>
              Subscription duration starts after payment
              verification. All prices are in Indian Rupees (INR).
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
