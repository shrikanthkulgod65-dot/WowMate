

import { useEffect, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import {

  Mail,

  LockKeyhole,

  Eye,

  EyeOff,

  ArrowRight,

  ShieldCheck,

  HeartHandshake,

  Sparkles,

  Users,

  AlertCircle,

} from "lucide-react";



const CURRENT_YEAR = new Date().getFullYear();



export default function Login() {

  const navigate = useNavigate();



  
  const location = useLocation();
const [formData, setFormData] = useState({

    emailOrMobile: new URLSearchParams(location.search).get("identifier") || "",

    password: "",

    rememberMe: true,

  });



  
  useEffect(() => {
    const identifier = new URLSearchParams(location.search).get("identifier");
    if (identifier) setFormData((previous) => ({ ...previous, emailOrMobile: identifier }));
  }, [location.search]);
const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);



  const handleChange = (event) => {

    const { name, value, type, checked } = event.target;



    setFormData((previous) => ({

      ...previous,

      [name]: type === "checkbox" ? checked : value,

    }));



    setError("");

  };



  const handleSubmit = async (event) => {

    event.preventDefault();

    setError("");



    const identifier = formData.emailOrMobile.trim();

    const password = formData.password;



    if (!identifier || !password) {

      setError("Please enter your email address and password.");

      return;

    }



    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    const isMobile = /^\+?[0-9\s()-]{10,18}$/.test(identifier);



    if (!isEmail && !isMobile) {

      setError("Please enter a valid email address.");

      return;

    }
setLoading(true);



    try {

      const response = await fetch(

        "http://localhost:5000/api/auth/login",

        {

          method: "POST",

          headers: {

            "Content-Type": "application/json",

          },

          body: JSON.stringify({

            emailOrMobile: identifier,

            password,

          }),

        }

      );



      const data = await response.json();



      if (!response.ok) {

        throw new Error(

          data.message || data.error || "Login failed. Please try again."

        );

      }



      if (!data.token) {

        throw new Error("Login succeeded, but the server did not return a token.");

      }



      // Clear any previous login session.

      localStorage.removeItem("token");

      localStorage.removeItem("user");

      sessionStorage.removeItem("token");

      sessionStorage.removeItem("user");



      // Save the session according to the Remember Me option.

      const storage = formData.rememberMe ? localStorage : sessionStorage;



      storage.setItem("token", data.token);



      if (data.user) {

        storage.setItem("user", JSON.stringify(data.user));

      }



      // Notify the Navbar and other components that login status changed.

      window.dispatchEvent(new Event("authChanged"));



      // Brokers go to Broker Services; regular members keep the normal home redirect.
      if (String(data.user?.role || "").toLowerCase() === "broker") {
        navigate("/broker-matrimony", { replace: true });
      } else {
        navigate("/", { replace: true });
      }

    } catch (err) {

      setError(

        err.message ||

          "Unable to connect to the server. Please check that your backend is running."

      );

    } finally {

      setLoading(false);

    }

  };



  return (

    <div className="as-login">

      <style>{`

        .as-login {

          min-height: 100vh;

          background: #fff8f6;

          color: #302326;

          font-family: Arial, Helvetica, sans-serif;

        }



        .as-login \* {

          box-sizing: border-box;

        }



        .as-login-header {

          min-height: 76px;

          padding: 16px 7%;

          display: flex;

          align-items: center;

          justify-content: space-between;

          background: #ffffff;

          border-bottom: 1px solid #f4e7e5;

        }



        .as-login-logo {

          display: inline-flex;

          align-items: center;

          gap: 10px;

          color: #a51d46;

          text-decoration: none;

          font-size: 25px;

          font-weight: 800;

          letter-spacing: -0.7px;

        }



        .as-login-logo-icon {

          display: flex;

          align-items: center;

          justify-content: center;

          width: 40px;

          height: 40px;

          border-radius: 13px;

          background: #a51d46;

          color: white;

        }



        .as-login-header-right {

          display: flex;

          align-items: center;

          gap: 8px;

          font-size: 14px;

          color: #6e5c61;

        }



        .as-login-header-right a {

          color: #a51d46;

          font-weight: 700;

          text-decoration: none;

        }



        .as-login-layout {

          display: grid;

          grid-template-columns: 1fr 0.85fr;

          max-width: 1200px;

          min-height: calc(100vh - 135px);

          margin: 0 auto;

          padding: 45px 35px;

          gap: 65px;

          align-items: center;

        }



        .as-login-hero {

          position: relative;

          padding: 20px 0;

        }



        .as-login-badge {

          display: inline-flex;

          align-items: center;

          gap: 8px;

          padding: 9px 15px;

          border-radius: 30px;

          background: #fbe5ec;

          color: #a51d46;

          font-size: 13px;

          font-weight: 700;

          margin-bottom: 25px;

        }



        .as-login-hero h1 {

          max-width: 540px;

          margin: 0 0 20px;

          font-size: clamp(36px, 4.5vw, 58px);

          line-height: 1.12;

          letter-spacing: -1.8px;

          color: #342126;

        }



        .as-login-hero h1 span {

          color: #b32752;

        }



        .as-login-hero > p {

          max-width: 490px;

          margin: 0;

          color: #79676c;

          font-size: 16px;

          line-height: 1.8;

        }



        .as-login-benefits {

          display: grid;

          gap: 18px;

          margin-top: 35px;

        }



        .as-login-benefit {

          display: flex;

          align-items: center;

          gap: 13px;

          color: #554349;

          font-size: 14px;

        }



        .as-login-benefit-icon {

          display: flex;

          align-items: center;

          justify-content: center;

          flex-shrink: 0;

          width: 42px;

          height: 42px;

          border-radius: 13px;

          color: #a51d46;

          background: #fbe5ec;

        }



        .as-login-benefit strong {

          display: block;

          margin-bottom: 4px;

          color: #38262c;

        }



        .as-login-card {

          width: 100%;

          max-width: 450px;

          margin: 0 auto;

          padding: 36px;

          border: 1px solid #f1e2e4;

          border-radius: 22px;

          background: #ffffff;

          box-shadow: 0 18px 60px rgba(106, 39, 59, 0.08);

        }



        .as-login-card-icon {

          display: flex;

          align-items: center;

          justify-content: center;

          width: 52px;

          height: 52px;

          margin-bottom: 22px;

          border-radius: 16px;

          color: #a51d46;

          background: #fbe5ec;

        }



        .as-login-card h2 {

          margin: 0 0 9px;

          font-size: 28px;

          color: #342126;

          letter-spacing: -0.5px;

        }



        .as-login-card-description {

          margin: 0 0 27px;

          color: #806d73;

          font-size: 14px;

          line-height: 1.6;

        }



        .as-login-error {

          display: flex;

          align-items: flex-start;

          gap: 9px;

          padding: 12px;

          margin-bottom: 19px;

          border: 1px solid #f2c5cb;

          border-radius: 10px;

          background: #fff0f1;

          color: #a32335;

          font-size: 13px;

          line-height: 1.5;

        }



        .as-login-error svg {

          flex-shrink: 0;

          margin-top: 1px;

        }



        .as-login-field {

          margin-bottom: 19px;

        }



        .as-login-field label {

          display: block;

          margin-bottom: 9px;

          color: #47343a;

          font-size: 13px;

          font-weight: 700;

        }



        .as-login-input-wrap {

          display: flex;

          align-items: center;

          gap: 11px;

          min-height: 49px;

          padding: 0 14px;

          border: 1px solid #e8dadd;

          border-radius: 10px;

          background: #fff;

          color: #a08c92;

          transition: border-color 0.2s, box-shadow 0.2s;

        }



        .as-login-input-wrap:focus-within {

          border-color: #b32752;

          box-shadow: 0 0 0 3px rgba(179, 39, 82, 0.09);

        }



        .as-login-input-wrap input {

          width: 100%;

          min-width: 0;

          border: 0;

          outline: none;

          background: transparent;

          color: #342126;

          font: inherit;

          font-size: 14px;

        }



        .as-login-input-wrap input::placeholder {

          color: #b5a5aa;

        }



        .as-login-password-toggle {

          display: flex;

          align-items: center;

          justify-content: center;

          padding: 3px;

          border: 0;

          background: transparent;

          color: #927d84;

          cursor: pointer;

        }



        .as-login-options {

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 12px;

          margin: 3px 0 23px;

          font-size: 12px;

        }



        .as-login-remember {

          display: flex;

          align-items: center;

          gap: 7px;

          color: #78666c;

          cursor: pointer;

        }



        .as-login-remember input {

          accent-color: #a51d46;

        }



        .as-login-options a,

        .as-login-signup a {

          color: #a51d46;

          font-weight: 700;

          text-decoration: none;

        }



        .as-login-submit {

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 10px;

          width: 100%;

          min-height: 50px;

          padding: 13px 18px;

          border: 0;

          border-radius: 11px;

          background: #a51d46;

          color: #ffffff;

          font-size: 14px;

          font-weight: 700;

          cursor: pointer;

          transition: background 0.2s, transform 0.2s;

        }



        .as-login-submit:hover:not(:disabled) {

          background: #851536;

          transform: translateY(-1px);

        }



        .as-login-submit:disabled {

          opacity: 0.7;

          cursor: not-allowed;

        }



        .as-login-secure {

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 7px;

          margin: 20px 0 0;

          color: #9a888e;

          font-size: 11px;

        }



        .as-login-divider {

          display: flex;

          align-items: center;

          gap: 13px;

          margin: 23px 0;

          color: #a39197;

          font-size: 11px;

        }



        .as-login-divider::before,

        .as-login-divider::after {

          content: "";

          flex: 1;

          height: 1px;

          background: #f0e5e7;

        }



        .as-login-signup {

          margin: 0;

          text-align: center;

          color: #806d73;

          font-size: 13px;

        }



        .as-login-footer {

          display: flex;

          align-items: center;

          justify-content: space-between;

          gap: 15px;

          padding: 22px 7%;

          border-top: 1px solid #f4e7e5;

          background: #ffffff;

          color: #98858b;

          font-size: 11px;

        }



        .as-login-footer-links {

          display: flex;

          gap: 18px;

        }



        .as-login-footer a {

          color: #806d73;

          text-decoration: none;

        }



        /* Added motion effects only; existing login behavior and layout remain intact. */
        @keyframes asLoginFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes asLoginFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes asLoginSoftFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .as-login-header {
          animation: asLoginFadeIn 650ms ease both;
        }
        .as-login-hero {
          animation: asLoginFadeUp 750ms cubic-bezier(.2,.7,.2,1) both;
        }
        .as-login-badge {
          animation: asLoginFadeUp 650ms ease 100ms both;
        }
        .as-login-hero h1 {
          animation: asLoginFadeUp 700ms ease 160ms both;
        }
        .as-login-hero > p {
          animation: asLoginFadeUp 700ms ease 230ms both;
        }
        .as-login-benefit {
          animation: asLoginFadeUp 600ms ease both;
          transition: transform 220ms ease;
        }
        .as-login-benefit:nth-child(2) { animation-delay: 120ms; }
        .as-login-benefit:nth-child(3) { animation-delay: 220ms; }
        .as-login-benefit:hover { transform: translateX(5px); }
        .as-login-benefit-icon {
          transition: transform 250ms ease, background 250ms ease;
        }
        .as-login-benefit:hover .as-login-benefit-icon {
          transform: rotate(-5deg) scale(1.06);
          background: #f7d4e0;
        }
        .as-login-card {
          animation: asLoginFadeUp 800ms cubic-bezier(.2,.7,.2,1) 100ms both;
          transition: box-shadow 250ms ease, border-color 250ms ease;
        }
        .as-login-card:hover {
          box-shadow: 0 22px 68px rgba(106, 39, 59, 0.12);
          border-color: #ebcbd4;
        }
        .as-login-card-icon {
          animation: asLoginSoftFloat 3.8s ease-in-out 1s infinite;
        }
        .as-login-input-wrap {
          transition: border-color 220ms ease, box-shadow 220ms ease, transform 220ms ease;
        }
        .as-login-input-wrap:focus-within {
          transform: translateY(-1px);
        }
        .as-login-submit {
          position: relative;
          overflow: hidden;
        }
        .as-login-submit::after {
          content: "";
          position: absolute;
          top: -60%;
          left: -80%;
          width: 45%;
          height: 220%;
          transform: rotate(22deg);
          background: rgba(255,255,255,.18);
          transition: left 500ms ease;
          pointer-events: none;
        }
        .as-login-submit:hover:not(:disabled)::after { left: 140%; }
        .as-login-logo-icon {
          transition: transform 250ms ease, border-radius 250ms ease;
        }
        .as-login-logo:hover .as-login-logo-icon {
          transform: rotate(-7deg) scale(1.05);
          border-radius: 50%;
        }
        .as-login a {
          transition: color 180ms ease;
        }
        @media (prefers-reduced-motion: reduce) {
          .as-login *,
          .as-login *::before,
          .as-login *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }

        @media (max-width: 850px) {

          .as-login-layout {

            grid-template-columns: 1fr;

            gap: 30px;

            padding: 35px 22px;

          }



          .as-login-hero {

            text-align: center;

          }



          .as-login-hero h1,

          .as-login-hero > p {

            margin-left: auto;

            margin-right: auto;

          }



          .as-login-benefits {

            max-width: 430px;

            margin: 25px auto 0;

            text-align: left;

          }



          .as-login-card {

            max-width: 500px;

          }

        }



        @media (max-width: 520px) {

          .as-login-header {

            padding: 14px 18px;

          }



          .as-login-logo {

            font-size: 21px;

          }



          .as-login-header-right {

            font-size: 12px;

          }



          .as-login-layout {

            padding: 25px 16px;

          }



          .as-login-hero h1 {

            font-size: 36px;

          }



          .as-login-card {

            padding: 25px 20px;

            border-radius: 17px;

          }



          .as-login-footer {

            flex-direction: column;

            text-align: center;

          }

        }

      `}</style>



      <header className="as-login-header">

        <Link to="/" className="as-login-logo">

          <span className="as-login-logo-icon">

            <HeartHandshake size={23} />

          </span>

          WowMate

        </Link>



        <div className="as-login-header-right">

          New to WowMate?

          <Link to="/register">Create account</Link>

        </div>

      </header>



      <main className="as-login-layout">

        <section className="as-login-hero">

          <div className="as-login-badge">

            <Sparkles size={15} />

            Your journey to forever starts here

          </div>



          <h1>

            Find your

            <br />

            perfect <span>life partner.</span>

          </h1>



          <p>

            Welcome back to WowMate. Sign in to discover meaningful

            connections, meet compatible people, and take the next step toward

            your happily ever after.

          </p>



          <div className="as-login-benefits">

            <div className="as-login-benefit">

              <div className="as-login-benefit-icon">

                <ShieldCheck size={20} />

              </div>

              <div>

                <strong>Privacy you can trust</strong>

                Your information matters to us.

              </div>

            </div>



            <div className="as-login-benefit">

              <div className="as-login-benefit-icon">

                <Users size={20} />

              </div>

              <div>

                <strong>Meaningful connections</strong>

                Discover profiles that match your values.

              </div>

            </div>



            <div className="as-login-benefit">

              <div className="as-login-benefit-icon">

                <HeartHandshake size={20} />

              </div>

              <div>

                <strong>Relationships that last</strong>

                Start building your future together.

              </div>

            </div>

          </div>

        </section>



        <section className="as-login-card">

          <div className="as-login-card-icon">

            <HeartHandshake size={27} />

          </div>



          <h2>Welcome back!</h2>

          <p className="as-login-card-description">

            Sign in to continue your WowMate journey.

          </p>



          {error && (

            <div className="as-login-error" role="alert">

              <AlertCircle size={17} />

              <span>{error}</span>

            </div>

          )}



          <form onSubmit={handleSubmit}>

            <div className="as-login-field">

              <label htmlFor="emailOrMobile">Email address</label>



              <div className="as-login-input-wrap">

                <Mail size={18} />



                <input

                  id="emailOrMobile"

                  name="emailOrMobile"

                  type="text"

                  autoComplete="username"

                  placeholder="Enter your registered email"

                  value={formData.emailOrMobile}

                  onChange={handleChange}

                  required

                />

              </div>

            </div>



            <div className="as-login-field">

              <label htmlFor="password">Password</label>



              <div className="as-login-input-wrap">

                <LockKeyhole size={18} />



                <input

                  id="password"

                  name="password"

                  type={showPassword ? "text" : "password"}

                  autoComplete="current-password"

                  placeholder="Enter your password"

                  value={formData.password}

                  onChange={handleChange}

                  required

                />



                <button

                  type="button"

                  className="as-login-password-toggle"

                  onClick={() => setShowPassword((previous) => !previous)}

                  aria-label={showPassword ? "Hide password" : "Show password"}

                >

                  {showPassword ? (

                    <EyeOff size={18} />

                  ) : (

                    <Eye size={18} />

                  )}

                </button>

              </div>

            </div>



            <div className="as-login-options">

              <label className="as-login-remember">

                <input

                  type="checkbox"

                  name="rememberMe"

                  checked={formData.rememberMe}

                  onChange={handleChange}

                />

                Remember me

              </label>



              <Link to="/forgot-password">Forgot password?</Link>

            </div>



            <button

              type="submit"

              className="as-login-submit"

              disabled={loading}

            >

              {loading ? "Signing in..." : "Sign in"}

              {!loading && <ArrowRight size={17} />}

            </button>

          </form>



          <div className="as-login-divider">SECURE SIGN IN</div>



          <p className="as-login-signup">

            Don't have an account? <Link to="/register">Create one</Link>

          </p>



          <p className="as-login-secure">

            <ShieldCheck size={14} />

            Your account information is protected.

          </p>

        </section>

      </main>



      <footer className="as-login-footer">

        <span>© {CURRENT_YEAR} WowMate. All rights reserved.</span>



        <div className="as-login-footer-links">

          <Link to="/privacy-policy">Privacy</Link>

          <Link to="/terms">Terms</Link>

        </div>

      </footer>

    </div>

  );

}