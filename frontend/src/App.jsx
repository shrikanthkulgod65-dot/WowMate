import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import About from "./pages/About";
import AdminDashboard from "./pages/AdminDashboard";
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

function AppRoutes() {
  const { pathname } = useLocation();

  const isAuthPage =
    pathname === "/login" || pathname === "/register";

  const isAdminPage = pathname.startsWith("/admin");

  return (
    <>
      {!isAuthPage && !isAdminPage && <Navbar />}

      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Matrimony categories */}
        <Route
          path="/farmer-matrimony"
          element={<FarmerMatrimony />}
        />

        <Route
          path="/professional-matrimony"
          element={<ProfessionalMatrimony />}
        />

        {/* Broker Services: primary route and legacy aliases */}
        <Route path="/broker" element={<Brokerservices />} />

        <Route
          path="/broker-matrimony"
          element={<Brokerservices />}
        />

        <Route
          path="/broker-services"
          element={<Brokerservices />}
        />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />

        {/* User dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/my-profile" element={<MyProfile />} />

        <Route
          path="/dashboard/my-profile"
          element={<MyProfile />}
        />

        {/* Discovery and search */}
        <Route path="/search" element={<SearchResults />} />

        <Route
          path="/search-results"
          element={<SearchResults />}
        />

        <Route path="/discover" element={<DiscoverProfiles />} />

        <Route
          path="/discover-profiles"
          element={<DiscoverProfiles />}
        />

        <Route path="/AIMatch" element={<AIMatch />} />

        {/* User interests */}
        <Route
          path="/my-interests"
          element={<ComingSoon title="My Interests" />}
        />

        {/* Information pages */}
        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route
          path="/subscription-plans"
          element={<SubscriptionPlans />}
        />

        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />

        <Route path="/terms" element={<Terms />} />

        <Route path="/blog" element={<Blog />} />

        {/* Page not found */}
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