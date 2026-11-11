
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Eye, EyeOff, LockKeyhole } from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Login using existing WowMate authentication API
      const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const loginResult = await loginResponse.json();

      if (!loginResponse.ok || !loginResult.success) {
        throw new Error(
          loginResult.message || "Invalid email or password."
        );
      }

      const { token, user } = loginResult;

      if (!token || !user) {
        throw new Error("Invalid login response from server.");
      }

      // Step 2: Only admin accounts may continue
      if (user.role !== "admin") {
        throw new Error(
          "Access denied. Founder & CEO account required."
        );
      }

      // Step 3: Verify actual Founder access with protected backend API
      const verifyResponse = await fetch(
        `${API_URL}/api/admin/dashboard`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const verifyResult = await verifyResponse.json();

      if (!verifyResponse.ok || !verifyResult.success) {
        throw new Error(
          verifyResult.message || "You are not authorized to access the admin panel."
        );
      }

      // Step 4: Store credentials only after server verification
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="wm-admin-login">
      <style>{`
        .wm-admin-login {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: linear-gradient(135deg, #f5f3ff, #eef2ff);
          font-family: Inter, Arial, sans-serif;
        }

        .wm-login-card {
          width: 100%;
          max-width: 430px;
          padding: 38px;
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 18px 60px rgba(55, 40, 110, 0.12);
        }

        .wm-login-logo {
          width: 58px;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          border-radius: 17px;
          color: white;
          background: linear-gradient(135deg, #7547e8, #5634c7);
        }

        .wm-login-card h1 {
          margin: 0;
          color: #202033;
          text-align: center;
          font-size: 27px;
          font-weight: 750;
        }

        .wm-login-subtitle {
          margin: 10px 0 28px;
          color: #85859a;
          text-align: center;
          font-size: 14px;
          line-height: 1.6;
        }

        .wm-login-label {
          display: block;
          margin: 17px 0 8px;
          color: #36364a;
          font-size: 13px;
          font-weight: 650;
        }

        .wm-login-input-wrap {
          position: relative;
        }

        .wm-login-input {
          box-sizing: border-box;
          width: 100%;
          height: 48px;
          padding: 0 45px 0 14px;
          border: 1px solid #e2e2ed;
          border-radius: 9px;
          outline: none;
          color: #252538;
          background: #fff;
          font-size: 14px;
        }

        .wm-login-input:focus {
          border-color: #7547e8;
          box-shadow: 0 0 0 3px rgba(117, 71, 232, 0.10);
        }

        .wm-login-eye {
          position: absolute;
          top: 50%;
          right: 13px;
          transform: translateY(-50%);
          display: flex;
          border: none;
          color: #85859a;
          background: transparent;
          cursor: pointer;
        }

        .wm-login-error {
          margin-top: 15px;
          padding: 11px 12px;
          border-radius: 8px;
          color: #b42318;
          background: #fff0ef;
          font-size: 13px;
          line-height: 1.5;
        }

        .wm-login-submit {
          width: 100%;
          height: 49px;
          margin-top: 24px;
          border: none;
          border-radius: 9px;
          color: #fff;
          background: linear-gradient(100deg, #7547e8, #5935cf);
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }

        .wm-login-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .wm-login-security {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin-top: 23px;
          color: #88889a;
          font-size: 12px;
        }

        .wm-login-footer {
          margin-top: 25px;
          color: #aaaabb;
          text-align: center;
          font-size: 11px;
        }

        @media (max-width: 480px) {
          .wm-login-card {
            padding: 28px 22px;
          }
        }
      `}</style>

      <div className="wm-login-card">
        <div className="wm-login-logo">
          <ShieldCheck size={31} />
        </div>

        <h1>Founder Login</h1>

        <p className="wm-login-subtitle">
          Welcome to the WowMate administration console.
          Sign in with your authorized Founder & CEO account.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="wm-login-label" htmlFor="admin-email">
            Email Address
          </label>

          <input
            id="admin-email"
            className="wm-login-input"
            type="email"
            name="email"
            placeholder="Enter founder email"
            value={form.email}
            onChange={handleChange}
            autoComplete="username"
            required
          />

          <label className="wm-login-label" htmlFor="admin-password">
            Password
          </label>

          <div className="wm-login-input-wrap">
            <input
              id="admin-password"
              className="wm-login-input"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />

            <button
              type="button"
              className="wm-login-eye"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>

          {error && (
            <div className="wm-login-error" role="alert">
              {error}
            </div>
          )}

          <button
            className="wm-login-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Verifying access..." : "Secure Login"}
          </button>
        </form>

        <div className="wm-login-security">
          <LockKeyhole size={15} />
          Founder & CEO restricted access
        </div>

        <div className="wm-login-footer">
          © {new Date().getFullYear()} WowMate. All rights reserved.
        </div>
      </div>
    </div>
  );
}
