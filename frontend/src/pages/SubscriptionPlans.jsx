
import { Link } from "react-router-dom";

const plans = [
  {
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
    to: "/contact?subject=subscription&plan=Starter",
    theme: "starter",
  },
  {
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
    to: "/contact?subject=subscription&plan=Silver",
    theme: "silver",
    featured: true,
  },
  {
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
    to: "/contact?subject=subscription&plan=Gold",
    theme: "gold",
  },
];

export default function SubscriptionPlans() {
  return (
    <main>
      <section className="pricing-section">
        <div className="pricing-container">
          <div className="pricing-heading">
            <span className="pricing-label">MEMBERSHIP PLANS</span>

            <h1>Find Your Perfect Match with WowMarriage</h1>

            <p>
              Choose an affordable membership and take the next step
              towards your happily ever after.
            </p>
          </div>

          <div className="pricing-grid">
            {plans.map((plan) => (
              <article
                className={`pricing-card pricing-${plan.theme}${
                  plan.featured ? " pricing-featured" : ""
                }`}
                key={plan.name}
              >
                {plan.featured && (
                  <span className="pricing-badge">MOST POPULAR</span>
                )}

                {plan.name === "Starter" && (
                  <span className="pricing-badge">BUDGET FRIENDLY</span>
                )}

                {plan.name === "Gold" && (
                  <span className="pricing-badge">BEST VALUE</span>
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

                <Link className="pricing-button" to={plan.to}>
                  {plan.action}
                </Link>
              </article>
            ))}
          </div>

          <div className="pricing-note">
            <p>
              <strong>Please note:</strong> Online payments are not yet
              available. Selecting a plan opens a demo contact enquiry;
              no payment will be processed.
            </p>

            <p>
              Membership benefits and protected profile access will require
              subscription verification before launch.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
