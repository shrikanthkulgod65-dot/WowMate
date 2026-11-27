import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import AdminApp from "./admin/AdminApp";

import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import AIMatch from "./pages/AIMatch";
import Blog from "./pages/Blog";
import Brokerservices from "./pages/Brokerservices";
import Contact from "./pages/contact";
import DiscoverProfiles from "./pages/DiscoverProfiles";
import FarmerMatrimony from "./pages/FarmerMatrimony";
import Home from "./pages/Home";
import MyProfile from "./pages/MyProfile";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ProfessionalMatrimony from "./pages/ProfessionalMatrimony";
import SearchResults from "./pages/SearchResults";
import PaymentResult from "./pages/PaymentResult";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import Terms from "./pages/Terms";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import "./admin/styles/admin.css";
import "./index.css";

function ComingSoon({ title }) {
  return (
    <main className="coming-soon">
      <span className="eyebrow">WOWMATE</span>
      <h1>{title}</h1>
      <p>This page is part of our upcoming development phase.</p>
      <Link to="/" className="primary-button">
        Back to Home
      </Link>
    </main>
  );
}

function RequireSubscription({ children, requiredFeature }) {
  const location = useLocation();
  const [access, setAccess] = useState("checking");

  useEffect(() => {
    let cancelled = false;

    async function verifySubscription() {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      if (!token) {
        if (!cancelled) setAccess("blocked");
        return;
      }

      try {
        const response = await fetch("/api/subscriptions/me", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json().catch(() => ({}));

        const featureAllowed = requiredFeature
          ? data.features?.[requiredFeature] === true
          : data.features?.browsePublicProfiles === true;

        if (!cancelled) {
          setAccess(
            response.ok && data.active === true && featureAllowed
              ? "allowed"
              : "blocked"
          );
        }
      } catch (error) {
        console.error("Subscription verification failed:", error);
        if (!cancelled) setAccess("blocked");
      }
    }

    verifySubscription();

    return () => {
      cancelled = true;
    };
  }, [requiredFeature]);

  if (access === "checking") {
    return <main style={{ padding: 30, textAlign: "center" }}>Checking subscription access...</main>;
  }

  if (access !== "allowed") {
    return (
      <Navigate
        to="/subscription-plans"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}

function AppRoutes() {
  const { pathname } = useLocation();

  const isAuthPage =
    pathname === "/login" || pathname === "/register";

  const isAdminPage = pathname.startsWith("/admin");

  return (
    <>
      {!isAuthPage && !isAdminPage && <Navbar />}

      <Routes>
        {/* PUBLIC WEBSITE ROUTES */}

        <Route path="/" element={<Home />} />

        <Route
          path="/farmer-matrimony"
          element={<FarmerMatrimony />}
        />

        <Route
          path="/professional-matrimony"
          element={<ProfessionalMatrimony />}
        />

        <Route path="/broker" element={<Brokerservices />} />
        <Route path="/broker-matrimony" element={<Brokerservices />} />
        <Route path="/broker-services" element={<Brokerservices />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/dashboard/my-profile" element={<MyProfile />} />

        <Route path="/search" element={<RequireSubscription requiredFeature="advancedFilters"><SearchResults /></RequireSubscription>} />
        <Route path="/search-results" element={<RequireSubscription requiredFeature="advancedFilters"><SearchResults /></RequireSubscription>} />

        <Route
          path="/discover"
          element={
            <RequireSubscription>
              <DiscoverProfiles />
            </RequireSubscription>
          }
        />

        <Route
          path="/discover-profiles"
          element={
            <RequireSubscription>
              <DiscoverProfiles />
            </RequireSubscription>
          }
        />

        <Route path="/AIMatch" element={<AIMatch />} />

        <Route
          path="/my-interests"
          element={<ComingSoon title="My Interests" />}
        />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
          <Route path="/payment-result" element={<PaymentResult />} />
        <Route
          path="/subscription-plans"
          element={<SubscriptionPlans />}
        />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/blog" element={<Blog />} />

        {/* FOUNDER & CEO ADMIN PANEL */}

        <Route path="/admin/*" element={<AdminApp />} />

        {/* PAGE NOT FOUND */}

        <Route
          path="*"
          element={<ComingSoon title="Page Not Found" />}
        />
      </Routes>

      {!isAuthPage && !isAdminPage && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
