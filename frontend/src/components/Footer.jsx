
import { Link } from "react-router-dom";

const CURRENT_YEAR = new Date().getFullYear();

const footerLinks = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about" },
  { label: "Professional Matrimony", path: "/professional-matrimony" },
  { label: "Farmer Matrimony", path: "/farmer-matrimony" },
  { label: "Broker Services", path: "/broker-matrimony" },
  { label: "Subscription Plans", path: "/subscription-plans" },
  { label: "Blog", path: "/blog" },
  { label: "Contact Us", path: "/contact" },
  { label: "Privacy Policy", path: "/privacy-policy" },
  { label: "Terms & Conditions", path: "/terms" },
];

export default function Footer() {
  return (
    <footer className="wowmate-footer">
      <style>{`
        .wowmate-footer {
          --footer-purple: #7c3aed;
          --footer-light: #c4b5fd;
          position: relative;
          isolation: isolate;
          overflow: hidden;
          padding: 75px 24px 24px;
          background: linear-gradient(
            135deg,
            #1e1042 0%,
            #35166b 45%,
            #5326a2 100%
          );
          color: #fff;
          font-family: inherit;
        }

        .wowmate-footer * {
          box-sizing: border-box;
        }

        /* Animated background decorations */
        .footer-glow {
          position: absolute;
          z-index: -1;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: rgba(167, 139, 250, 0.16);
          filter: blur(75px);
          pointer-events: none;
          animation: footerFloat 9s ease-in-out infinite alternate;
        }

        .footer-glow-one {
          top: -140px;
          left: -90px;
        }

        .footer-glow-two {
          right: -100px;
          bottom: -120px;
          background: rgba(236, 72, 153, 0.13);
          animation-delay: -4s;
        }

        .footer-decoration {
          position: absolute;
          z-index: -1;
          width: 180px;
          height: 180px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 50%;
          pointer-events: none;
          animation: footerRotate 25s linear infinite;
        }

        .footer-decoration-one {
          top: 30px;
          right: 12%;
        }

        .footer-decoration-two {
          bottom: 30px;
          left: 5%;
          width: 110px;
          height: 110px;
          animation-direction: reverse;
        }

        @keyframes footerFloat {
          from {
            transform: translate(0, 0) scale(1);
          }
          to {
            transform: translate(45px, 35px) scale(1.2);
          }
        }

        @keyframes footerRotate {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes footerFadeUp {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .footer-container {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer-main {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr;
          gap: 65px;
          padding-bottom: 48px;
          animation: footerFadeUp 0.9s ease both;
        }

        /* Brand */
        .footer-brand {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 22px;
        }

        .footer-logo-link {
          display: block;
          flex-shrink: 0;
        }

        .footer-logo {
          display: block;
          width: 75px;
          height: 75px;
          padding: 5px;
          border-radius: 18px;
          background: #fff;
          object-fit: contain;
          box-shadow: 0 8px 30px rgba(103, 0, 247, 0.85);
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }

        .footer-logo-link:hover .footer-logo {
          transform: rotate(-7deg) scale(1.08);
          box-shadow: 0 12px 35px rgba(196,181,253,0.35);
        }

        .footer-brand-name {
          margin: 0;
          color: #fff;
          font-size: 30px;
          font-weight: 900;
          letter-spacing: 0.5px;
        }

        .footer-tagline {
          margin: 7px 0 0;
          color: #d8c8ff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .footer-description {
          max-width: 390px;
          margin: 0;
          color: #ddd4f4;
          font-size: 14px;
          line-height: 1.9;
        }

        .footer-highlight {
          display: inline-block;
          margin-top: 20px;
          padding: 9px 15px;
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 30px;
          background: rgba(255,255,255,0.08);
          color: #a564ec;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.4px;
          transition: background 0.3s ease, transform 0.3s ease;
        }

        .footer-highlight:hover {
          transform: translateY(-3px);
          background: rgba(255,255,255,0.15);
        }

        /* Footer headings */
        .footer-column h3 {
          position: relative;
          display: inline-block;
          margin: 7px 0 25px;
          padding-bottom: 12px;
          color: #fff;
          font-size: 17px;
          font-weight: 800;
        }

        .footer-column h3::after {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 38px;
          height: 3px;
          border-radius: 5px;
          background: linear-gradient(90deg, #3708f4, #f0abfc);
          content: "";
          transition: width 0.3s ease;
        }

        .footer-column:hover h3::after {
          width: 75px;
        }

        /* Footer links */
        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .footer-links a {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          width: fit-content;
          color: #7646dd;
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.25s ease, transform 0.25s ease;
        }

        .footer-links a::before {
          width: 6px;
          height: 6px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #a78bfa;
          content: "";
          transition: transform 0.25s ease, background 0.25s ease;
        }

        .footer-links a:hover {
          color: #fff;
          transform: translateX(6px);
        }

        .footer-links a:hover::before {
          transform: scale(1.5);
          background: #f0abfc;
        }

        /* Call to action */
        .footer-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          margin: 0 0 35px;
          padding: 28px 32px;
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 18px;
          background: linear-gradient(
            110deg,
            rgba(255,255,255,0.12),
            rgba(239, 40, 40, 0.04)
          );
          backdrop-filter: blur(12px);
          animation: footerFadeUp 1.1s ease both;
        }

        .footer-cta h3 {
          margin: 0 0 7px;
          color: #e9e5e5;
          font-size: 21px;
        }

        .footer-cta p {
          margin: 0;
          color: #d9cfee;
          font-size: 13px;
          line-height: 1.7;
        }

        .footer-cta-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          min-height: 46px;
          padding: 0 22px;
          border: 1px solid #f2e5e5;
          border-radius: 30px;
          background: #fff;
          color: #a173f1;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .footer-cta-button:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.22);
        }

        /* Bottom section */
        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding-top: 23px;
          border-top: 1px solid rgba(255,255,255,0.18);
          color: #d6caee;
          font-size: 12px;
        }

        .footer-bottom p {
          margin: 0;
        }

        .footer-bottom-brand {
          color: #ededed;
          font-weight: 800;
        }

        @media (max-width: 850px) {
          .footer-main {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }

          .footer-brand-section {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 600px) {
          .wowmate-footer {
            padding: 55px 20px 22px;
          }

          .footer-main {
            grid-template-columns: 1fr 1fr;
            gap: 32px 18px;
          }

          .footer-brand-section {
            grid-column: 1 / -1;
          }

          .footer-brand-name {
            font-size: 26px;
          }

          .footer-logo {
            width: 65px;
            height: 65px;
          }

          .footer-column h3 {
            font-size: 15px;
          }

          .footer-links {
            gap: 13px;
          }

          .footer-links a {
            font-size: 12px;
          }

          .footer-cta {
            align-items: flex-start;
            flex-direction: column;
            padding: 23px;
          }

          .footer-cta h3 {
            font-size: 19px;
          }

          .footer-bottom {
            align-items: flex-start;
            flex-direction: column;
            text-align: left;
          }

          .footer-decoration-one {
            right: -80px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wowmate-footer *,
          .wowmate-footer *::before,
          .wowmate-footer *::after {
            animation: none !important;
            scroll-behavior: auto !important;
            transition: none !important;
          }
        }
      `}</style>

      {/* Animated background */}
      <div className="footer-glow footer-glow-one" />
      <div className="footer-glow footer-glow-two" />
      <div className="footer-decoration footer-decoration-one" />
      <div className="footer-decoration footer-decoration-two" />

      <div className="footer-container">

        {/* Main footer */}
        <div className="footer-main">

          {/* Brand section */}
          <div className="footer-brand-section">
            <div className="footer-brand">
              <Link
                to="/"
                className="footer-logo-link"
                aria-label="Wowmate home"
              >
                <img
                  src="/image.png"
                  alt="Wowmate logo"
                  className="footer-logo"
                />
              </Link>

              <div>
                <h2 className="footer-brand-name">Wowmate</h2>
                <p className="footer-tagline">
                  RISHTON KI NAYI SHURUAAT
                </p>
              </div>
            </div>

            <p className="footer-description">
              Discover meaningful connections and take the next
              step toward finding your life partner with Wowmate.
              Where beautiful relationships begin and forever
              stories are created.
            </p>

            <div className="footer-highlight">
              ♥ Find Your Perfect Connection
            </div>
          </div>

          {/* Quick links */}
          <div className="footer-column">
            <h3>Explore Wowmate</h3>

            <nav aria-label="Explore Wowmate">
              <ul className="footer-links">
                {footerLinks.slice(0, 7).map((item) => (
                  <li key={item.path}>
                    <Link to={item.path}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Support links */}
          <div className="footer-column">
            <h3>Help & Support</h3>

            <nav aria-label="Help and support">
              <ul className="footer-links">
                {footerLinks.slice(7).map((item) => (
                  <li key={item.path}>
                    <Link to={item.path}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

        </div>

        {/* Registration call to action */}
        <div className="footer-cta">
          <div>
            <h3>Your Forever Story Starts Here</h3>
            <p>
              Create your free profile and discover meaningful
              connections with Wowmate.
            </p>
          </div>

          <Link to="/register" className="footer-cta-button">
            Join Wowmate →
          </Link>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>
            © {CURRENT_YEAR} <span className="footer-bottom-brand">
              Wowmate
            </span>. All rights reserved.
          </p>

          <p>Made with ♥ for beautiful relationships.</p>
        </div>

      </div>
    </footer>
  );
}
