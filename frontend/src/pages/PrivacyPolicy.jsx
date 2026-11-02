import { Link } from "react-router-dom";
import { ShieldCheck, Heart, Lock, UserCheck } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <main className="privacy-page">
      <style>{`
        .privacy-page {
          background: #f8f5ff;
          color: #30264a;
          min-height: 100vh;
          font-family: Arial, sans-serif;
        }

        .privacy-hero {
          background: linear-gradient(135deg, #4c1d95, #8b5cf6);
          color: white;
          text-align: center;
          padding: 70px 20px;
        }

        .privacy-hero-icon {
          color: #c4b5fd;
          margin-bottom: 15px;
        }

        .privacy-hero h1 {
          font-size: clamp(32px, 5vw, 46px);
          margin: 0 0 14px;
        }

        .privacy-hero p {
          max-width: 700px;
          margin: auto;
          color: #ede5ff;
          line-height: 1.8;
        }

        .privacy-container {
          max-width: 950px;
          margin: 0 auto;
          padding: 50px 20px 70px;
        }

        .privacy-intro {
          background: white;
          border: 1px solid #ddd6fe;
          border-left: 5px solid #8b5cf6;
          border-radius: 12px;
          padding: 24px;
          line-height: 1.9;
          margin-bottom: 30px;
        }

        .privacy-section {
          background: white;
          padding: 26px;
          margin-bottom: 20px;
          border: 1px solid #ddd6fe;
          border-radius: 14px;
          box-shadow: 0 5px 20px rgba(76, 29, 149, 0.06);
        }

        .privacy-section h2 {
          color: #4c1d95;
          font-size: 21px;
          margin: 0 0 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .privacy-section p,
        .privacy-section li {
          color: #685662;
          line-height: 1.9;
          font-size: 15px;
        }

        .privacy-section ul {
          padding-left: 22px;
        }

        .privacy-section li {
          margin-bottom: 8px;
        }

        .privacy-links {
          display: flex;
          flex-wrap: wrap;
          gap: 18px;
          margin-top: 30px;
        }

        .privacy-links a {
          color: #6d28d9;
          font-weight: 700;
          text-decoration: none;
        }

        .privacy-links a:hover {
          text-decoration: underline;
        }

        @media (max-width: 600px) {
          .privacy-hero {
            padding: 50px 18px;
          }

          .privacy-container {
            padding: 30px 15px 50px;
          }

          .privacy-section,
          .privacy-intro {
            padding: 20px;
          }

          .privacy-section h2 {
            font-size: 19px;
          }
        }
      `}</style>

      <section className="privacy-hero">
        <ShieldCheck
          className="privacy-hero-icon"
          size={44}
        />
        <h1>Privacy Policy</h1>
        <p>
          Your privacy matters to us. Learn how Wowmate intends to
          handle your information and help protect your personal details.
        </p>
      </section>

      <div className="privacy-container">
        <div className="privacy-intro">
          <strong>Welcome to Wowmate.</strong>
          <p>
            This page is a starter privacy policy for the Wowmate
            matrimony website. It must be reviewed and updated to reflect
            the actual services, technologies, and data practices of the
            business before it is published as an official policy.
          </p>
          <p>
            <strong>Effective date:</strong> Add your actual effective date.
          </p>
        </div>

        <section className="privacy-section">
          <h2>
            <UserCheck size={22} />
            1. Information We May Collect
          </h2>
          <p>
            Depending on the features you provide, Wowmate may collect
            information such as:
          </p>
          <ul>
            <li>Name, age, and contact details.</li>
            <li>Matrimony profile information and partner preferences.</li>
            <li>Photographs and other information you choose to provide.</li>
            <li>Account credentials and account settings.</li>
            <li>Support messages and communications with our team.</li>
            <li>Technical information needed to operate and secure the website.</li>
            <li>Subscription or transaction records, if paid services are offered.</li>
          </ul>
          <p>
            Only list categories that your website actually collects.
            Do not collect unnecessary or excessive personal information.
          </p>
        </section>

        <section className="privacy-section">
          <h2>
            <Lock size={22} />
            2. How Information May Be Used
          </h2>
          <p>
            Information may be used, where applicable and legally permitted, to:
          </p>
          <ul>
            <li>Create and manage user accounts and matrimony profiles.</li>
            <li>Provide search, matching, and profile discovery features.</li>
            <li>Respond to customer support requests.</li>
            <li>Protect users and investigate suspected misuse.</li>
            <li>Process subscriptions and related transactions.</li>
            <li>Maintain, troubleshoot, and improve the website.</li>
            <li>Meet applicable legal obligations.</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>
            <ShieldCheck size={22} />
            3. Profile Visibility and Sharing
          </h2>
          <p>
            Matrimony profiles may contain personal information visible
            to other users, depending on the website's privacy settings.
            Before launch, clearly explain which profile details are public,
            which are restricted, and how users can change their settings.
          </p>
          <p>
            Personal information should only be shared with service providers
            or other parties when appropriate, with a valid legal basis,
            and in accordance with the published policy and applicable law.
          </p>
        </section>

        <section className="privacy-section">
          <h2>
            <Lock size={22} />
            4. Data Security
          </h2>
          <p>
            Appropriate technical and organizational safeguards should be
            implemented to help protect personal information against
            unauthorized access, loss, misuse, or disclosure.
          </p>
          <p>
            No online service can guarantee absolute security. Implement
            and document safeguards that match the actual systems used
            by Wowmate.
          </p>
        </section>

        <section className="privacy-section">
          <h2>
            <UserCheck size={22} />
            5. Your Choices and Rights
          </h2>
          <p>
            Depending on applicable law, users may have rights relating
            to access, correction, deletion, withdrawal of consent,
            grievances, and other personal information requests.
          </p>
          <p>
            Explain here how users can exercise their applicable rights,
            manage profile visibility, and request account deletion.
            Requests should be handled according to applicable law and
            the website's actual capabilities.
          </p>
        </section>

        <section className="privacy-section">
          <h2>
            <ShieldCheck size={22} />
            6. Data Retention and Children's Privacy
          </h2>
          <p>
            Specify how long different categories of personal information
            are retained, when they are deleted, and which legal or
            operational reasons may require retention.
          </p>
          <p>
            Wowmate should clearly state its intended age requirements
            and implement appropriate safeguards so that the service is
            used only by eligible individuals.
          </p>
        </section>

        <section className="privacy-section">
          <h2>
            <Heart size={22} />
            7. Changes to This Policy
          </h2>
          <p>
            This policy may need to change when the website's features,
            data practices, or legal obligations change. The published
            policy should explain how material updates will be communicated
            and when they take effect.
          </p>
        </section>

        <section className="privacy-section">
          <h2>8. Contact and Grievances</h2>
          <p>
            Add the official privacy contact or grievance contact details
            for Wowmate before publishing this policy.
          </p>
          <p>
            Do not publish this page as a final legal policy until its
            contents, contact details, and procedures have been verified.
          </p>
        </section>

        <nav className="privacy-links" aria-label="Related pages">
          <Link to="/contact">Contact Us</Link>
          <Link to="/terms">Terms &amp; Conditions</Link>
          <Link to="/">Back to Home</Link>
        </nav>
      </div>
    </main>
  );
}