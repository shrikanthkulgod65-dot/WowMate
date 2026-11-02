import { Link } from "react-router-dom";
import {
  FileText,
  UserCheck,
  ShieldCheck,
  Heart,
  AlertCircle,
  CreditCard,
} from "lucide-react";

export default function Terms() {
  return (
    <main className="terms-page">
      <style>{`
        .terms-page {
          background: #f8f5ff;
          color: #30264a;
          min-height: 100vh;
          font-family: Arial, sans-serif;
        }

        .terms-hero {
          background: linear-gradient(135deg, #4c1d95, #8b5cf6);
          color: white;
          padding: 70px 20px;
          text-align: center;
        }

        .terms-hero-icon {
          color: #c4b5fd;
          margin-bottom: 15px;
        }

        .terms-hero h1 {
          font-size: clamp(32px, 5vw, 46px);
          margin: 0 0 14px;
        }

        .terms-hero p {
          max-width: 700px;
          margin: auto;
          color: #ede5ff;
          line-height: 1.8;
        }

        .terms-container {
          max-width: 950px;
          margin: auto;
          padding: 50px 20px 70px;
        }

        .terms-notice {
          background: #f5f0ff;
          border: 1px solid #ddd6fe;
          border-left: 5px solid #8b5cf6;
          border-radius: 12px;
          padding: 22px;
          line-height: 1.9;
          margin-bottom: 30px;
        }

        .terms-section {
          background: white;
          padding: 26px;
          margin-bottom: 20px;
          border: 1px solid #ddd6fe;
          border-radius: 14px;
          box-shadow: 0 5px 20px rgba(76, 29, 149, 0.06);
        }

        .terms-section h2 {
          color: #4c1d95;
          font-size: 21px;
          margin: 0 0 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .terms-section p,
        .terms-section li {
          color: #685662;
          line-height: 1.9;
          font-size: 15px;
        }

        .terms-section ul {
          padding-left: 22px;
        }

        .terms-section li {
          margin-bottom: 8px;
        }

        .terms-links {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          margin-top: 30px;
        }

        .terms-links a {
          color: #6d28d9;
          font-weight: 700;
          text-decoration: none;
        }

        .terms-links a:hover {
          text-decoration: underline;
        }

        @media (max-width: 600px) {
          .terms-hero {
            padding: 50px 18px;
          }

          .terms-container {
            padding: 30px 15px 50px;
          }

          .terms-section,
          .terms-notice {
            padding: 20px;
          }

          .terms-section h2 {
            font-size: 19px;
          }
        }
      `}</style>

      <section className="terms-hero">
        <FileText
          className="terms-hero-icon"
          size={44}
        />
        <h1>Terms &amp; Conditions</h1>
        <p>
          Please read these terms carefully to understand the rules
          and responsibilities associated with using Wowmate.
        </p>
      </section>

      <div className="terms-container">
        <div className="terms-notice">
          <strong>Important notice</strong>
          <p>
            This page is a starter terms template for Wowmate.
            It must be reviewed, customized, and approved for your actual
            business and applicable law before it is published as a binding
            agreement.
          </p>
          <p>
            <strong>Effective date:</strong> Add your actual effective date.
          </p>
        </div>

        <section className="terms-section">
          <h2>
            <FileText size={22} />
            1. Acceptance of Terms
          </h2>
          <p>
            These terms are intended to govern access to and use of the
            Wowmate website and its services. Before launch, identify
            the legal entity operating the service and ensure users are
            appropriately informed of and agree to the applicable terms.
          </p>
        </section>

        <section className="terms-section">
          <h2>
            <UserCheck size={22} />
            2. Eligibility and Accounts
          </h2>
          <p>
            Users must meet the service's published eligibility and
            minimum-age requirements. Users should provide accurate
            information, protect their account credentials, and promptly
            update information that becomes inaccurate.
          </p>
          <p>
            Specify the actual age requirements and any additional
            eligibility conditions that apply to Wowmate.
          </p>
        </section>

        <section className="terms-section">
          <h2>
            <Heart size={22} />
            3. Profiles and User Conduct
          </h2>
          <p>Users should agree to the following rules:</p>
          <ul>
            <li>Provide truthful and non-misleading profile information.</li>
            <li>Use the service for legitimate matrimony purposes.</li>
            <li>Respect the privacy and boundaries of other users.</li>
            <li>Do not impersonate another person or create deceptive profiles.</li>
            <li>Do not harass, threaten, defraud, or exploit other users.</li>
            <li>Do not upload unlawful or unauthorized content.</li>
            <li>Report suspicious profiles or conduct through the available channels.</li>
          </ul>
        </section>

        <section className="terms-section">
          <h2>
            <ShieldCheck size={22} />
            4. Safety and Verification
          </h2>
          <p>
            If Wowmate offers profile verification, explain what is
            checked and what verification does and does not establish.
            Do not imply that a verified profile guarantees a person's
            identity, intentions, background, or suitability as a partner
            unless that claim is demonstrably supported.
          </p>
          <p>
            Users should exercise care when communicating with others,
            sharing personal details, arranging meetings, or making
            financial commitments.
          </p>
        </section>

        <section className="terms-section">
          <h2>
            <CreditCard size={22} />
            5. Subscriptions and Payments
          </h2>
          <p>
            If paid plans are offered, disclose the available plans,
            prices, billing periods, included features, renewal rules,
            cancellation process, and applicable refund terms before
            a user purchases a subscription.
          </p>
          <p>
            Add the actual payment, cancellation, and refund policy
            applicable to Wowmate. Do not publish unverified promises
            about refunds or subscription benefits.
          </p>
        </section>

        <section className="terms-section">
          <h2>
            <AlertCircle size={22} />
            6. Misuse and Account Restrictions
          </h2>
          <p>
            Explain the circumstances in which accounts or content may
            be reviewed, restricted, suspended, or removed. Establish a
            fair process for reports and complaints, consistent with
            applicable law and the service's actual moderation capabilities.
          </p>
        </section>

        <section className="terms-section">
          <h2>7. Content and Intellectual Property</h2>
          <p>
            Identify the rights held by Wowmate in its website design,
            branding, software, and original content. Explain the limited
            permissions users receive when accessing the service.
          </p>
          <p>
            Users should only upload photographs and other content that
            they are authorized to share. Add clear procedures for
            reporting alleged copyright or other intellectual property
            violations.
          </p>
        </section>

        <section className="terms-section">
          <h2>8. Privacy</h2>
          <p>
            Use of the service also involves the applicable privacy
            practices described in the Privacy Policy. Explain how the
            two documents relate to one another and ensure they are
            consistent.
          </p>
          <p>
            <Link to="/privacy-policy">Read our Privacy Policy</Link>
          </p>
        </section>

        <section className="terms-section">
          <h2>9. Service Availability and Liability</h2>
          <p>
            Describe service availability, maintenance, limitations,
            and responsibility for user interactions accurately.
            Any warranty exclusions or liability limitations must be
            drafted to comply with applicable law.
          </p>
          <p>
            Do not include exclusions that would unlawfully remove
            rights that users are entitled to retain.
          </p>
        </section>

        <section className="terms-section">
          <h2>10. Changes to These Terms</h2>
          <p>
            Explain how updates to these terms will be communicated,
            when they become effective, and whether renewed acceptance
            is required for material changes.
          </p>
        </section>

        <section className="terms-section">
          <h2>11. Contact and Complaints</h2>
          <p>
            Add your official business contact details and any applicable
            grievance or complaint procedure before publishing these terms.
          </p>
          <p>
            Make sure the published contact information is monitored and
            the described complaint-handling process is operational.
          </p>
        </section>

        <nav className="terms-links" aria-label="Related pages">
          <Link to="/contact">Contact Us</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/">Back to Home</Link>
        </nav>
      </div>
    </main>
  );
}