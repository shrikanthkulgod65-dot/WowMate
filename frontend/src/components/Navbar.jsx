
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  UserRound,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

import "./Navbar.css";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Farmer", path: "/farmer-matrimony" },
  { label: "Professional", path: "/professional-matrimony" },
  { label: "Broker Services", path: "/broker" },
  { label: "AI Match", path: "/AIMatch" },
  { label: "Pricing", path: "/subscription-plans" },
  { label: "About Us", path: "/about" },
];

function getStoredToken() {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
}

export default function Navbar() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(
    () => Boolean(getStoredToken())
  );

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updateAuthState = () => {
      setIsLoggedIn(Boolean(getStoredToken()));
    };

    window.addEventListener("authChanged", updateAuthState);
    window.addEventListener("storage", updateAuthState);

    updateAuthState();

    return () => {
      window.removeEventListener("authChanged", updateAuthState);
      window.removeEventListener("storage", updateAuthState);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [navigate]);

  const handleLogout = () => {
    // Only clear login information; preserve registered profiles.
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    // Notify the homepage and navbar about logout.
    window.dispatchEvent(new Event("authChanged"));

    setIsLoggedIn(false);
    setMenuOpen(false);

    // Return to homepage after logout.
    navigate("/", { replace: true });
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="site-navbar">
      <div className="navbar-container">
        {/* Website Logo */}
        <Link
          to="/"
          className="navbar-brand"
          onClick={closeMenu}
          aria-label="Wowmate home"
        >
          <img
            src="image.png"
            alt="Wowmate Matrimony"
            className="navbar-logo-image"
          />
        </Link>

        {/* Mobile menu button */}
        <button
          type="button"
          className="navbar-menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>

        {/* Navigation */}
        <nav
          id="main-navigation"
          className={`navbar-navigation ${
            menuOpen ? "navbar-navigation-open" : ""
          }`}
          aria-label="Main navigation"
        >
          <div className="navbar-links">
            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `navbar-link ${isActive ? "navbar-link-active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Authentication actions */}
          <div className="navbar-actions">
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="navbar-dashboard-button"
                  onClick={closeMenu}
                >
                  <LayoutDashboard size={17} />
                  <span>Dashboard</span>
                </Link>

                <button
                  type="button"
                  className="navbar-logout-button"
                  onClick={handleLogout}
                >
                  <LogOut size={17} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="navbar-login-button"
                  onClick={closeMenu}
                >
                  <UserRound size={17} />
                  <span>Login</span>
                </Link>

                <Link
                  to="/register"
                  className="navbar-register-button"
                  onClick={closeMenu}
                >
                  Register Free
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
