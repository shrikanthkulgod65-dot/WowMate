import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { sendInterest, getSentInterests } from "../services/interestService.js";


const demoProfiles = [
  { id: "demo-priya", isDemo: true, name: "Priya Sharma", age: 27, gender: "Bride", profession: "Software Engineer", education: "B.Tech", location: "Bengaluru, Karnataka", category: "Professional", height: "5'4\"", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80", photos: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"], about: "Demo preview profile for checking the design and profile cards." },
  { id: "demo-ananya", isDemo: true, name: "Ananya Rao", age: 26, gender: "Bride", profession: "Doctor", education: "MBBS", location: "Mysuru, Karnataka", category: "Professional", height: "5'3\"", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80", photos: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80"], about: "Demo preview profile for checking the design and profile cards." },
  { id: "demo-sneha", isDemo: true, name: "Sneha Kulkarni", age: 25, gender: "Bride", profession: "Teacher", education: "M.A., B.Ed.", location: "Belagavi, Karnataka", category: "Professional", height: "5'5\"", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80", photos: ["https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80"], about: "Demo preview profile for checking the design and profile cards." },
];

const defaultFilters = {
  keyword: "",
  gender: "",
  category: "",
  minAge: "21",
  maxAge: "35",
  location: "",
};

export default function DiscoverProfiles() {
  const [filters, setFilters] = useState(defaultFilters);
  const [sortBy, setSortBy] = useState("recommended");
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [interestLoadingId, setInterestLoadingId] = useState(null);
  const [sentInterestIds, setSentInterestIds] = useState([]);
  const [backendProfiles, setBackendProfiles] = useState([]);
  const [profilesLoading, setProfilesLoading] = useState(true);
  const [profilesError, setProfilesError] = useState("");

  // Fetch only real profiles from MongoDB. Demo and browser-only profiles are not shown.
  React.useEffect(() => {
    let cancelled = false;

    const loadBackendProfiles = async () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (!token) {
        setBackendProfiles([]);
        setProfilesError("Please log in to view registered member profiles.");
        setProfilesLoading(false);
        return;
      }

      const apiBase = (
        import.meta.env.VITE_API_URL || "http://localhost:5000/api"
      ).replace(/\/+$/, "");

      try {
        setProfilesLoading(true);
        setProfilesError("");

        const response = await fetch(`${apiBase}/profile/discover`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(
            data.message || `Unable to load profiles (HTTP ${response.status}).`
          );
        }

        const records = Array.isArray(data.profiles)
          ? data.profiles
          : Array.isArray(data.data?.profiles)
            ? data.data.profiles
            : Array.isArray(data.data)
              ? data.data
              : [];

        let currentUserId = "";
        try {
          const currentUser = JSON.parse(
            localStorage.getItem("user") ||
              sessionStorage.getItem("user") ||
              "null"
          );
          currentUserId = String(
            currentUser?._id || currentUser?.id || currentUser?.userId || ""
          );
        } catch {
          currentUserId = "";
        }

        const normalized = records
          .map((item) => {
            const rawUser = item?.user;
            const receiverId =
              typeof rawUser === "string"
                ? rawUser
                : rawUser?._id || rawUser?.id || item?.userId || "";

            if (!/^[a-f\d]{24}$/i.test(String(receiverId))) return null;
            if (currentUserId && String(receiverId) === currentUserId) return null;

            const user =
              rawUser && typeof rawUser === "object" ? rawUser : {};
            const dob = item.dateOfBirth ? new Date(item.dateOfBirth) : null;
            let age = null;

            if (dob && !Number.isNaN(dob.getTime())) {
              const today = new Date();
              age = today.getFullYear() - dob.getFullYear();
              const beforeBirthday =
                today.getMonth() < dob.getMonth() ||
                (today.getMonth() === dob.getMonth() &&
                  today.getDate() < dob.getDate());
              if (beforeBirthday) age -= 1;
              if (age < 18 || age > 100) age = null;
            }

            const occupation = item.occupation || "Not specified";
            const category = /farm|agri/i.test(occupation)
              ? "Farmer"
              : "Professional";
            const location = [item.city, item.state, item.country]
              .filter(Boolean)
              .join(", ");

            return {
              id: String(item._id || receiverId),
              user: String(receiverId),
              userId: String(receiverId),
              name: user.fullName || user.name || "Wowmate Member",
              age,
              gender:
                item.gender === "Female"
                  ? "Bride"
                  : item.gender === "Male"
                    ? "Groom"
                    : "",
              profession: occupation,
              education: item.education || "Not specified",
              location: location || "Location not specified",
              category,
              height: item.height || "",
              image: item.profilePhoto || "",
              photos: item.profilePhoto ? [item.profilePhoto] : [],
              about: item.aboutMe || "",
              isBackendProfile: true,
            };
          })
          .filter(Boolean);

        if (!cancelled) setBackendProfiles(normalized);
      } catch (error) {
        if (!cancelled) {
          setBackendProfiles([]);
          setProfilesError(error.message || "Unable to load registered profiles.");
        }
      } finally {
        if (!cancelled) setProfilesLoading(false);
      }
    };

    loadBackendProfiles();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load already-sent interests so buttons show the correct state after refresh.
  React.useEffect(() => {
    let cancelled = false;
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return undefined;

    getSentInterests()
      .then((response) => {
        if (cancelled) return;
        const interests = Array.isArray(response)
          ? response
          : response.interests || [];
        const ids = interests
          .map((entry) => {
            const receiver = entry.receiver;
            return typeof receiver === "string" ? receiver : receiver?._id;
          })
          .filter((id) => /^[a-f\d]{24}$/i.test(String(id || "")))
          .map(String);
        setSentInterestIds(ids);
      })
      .catch((error) => {
        if (!cancelled) console.error("Load sent interests error:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const resetFilters = () => setFilters(defaultFilters);

  const filteredProfiles = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();
    const location = filters.location.trim().toLowerCase();
    const minAge = Number(filters.minAge);
    const maxAge = Number(filters.maxAge);

    // Keep a few demo photo cards for UI testing; backend members remain separate.
    const allProfiles = [...backendProfiles, ...demoProfiles];

    const results = allProfiles.filter((profile) => {
      const searchableText = [
        profile.name,
        profile.profession,
        profile.education,
        profile.location,
        profile.category,
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!keyword || searchableText.includes(keyword)) &&
        (!filters.gender || profile.gender === filters.gender) &&
        (!filters.category || profile.category === filters.category) &&
        (profile.age == null || (profile.age >= minAge && profile.age <= maxAge)) &&
        (!location || profile.location.toLowerCase().includes(location))
      );
    });

    if (sortBy === "age-asc") {
      return results.sort((a, b) => a.age - b.age);
    }

    if (sortBy === "age-desc") {
      return results.sort((a, b) => b.age - a.age);
    }

    return results;
  }, [filters, sortBy, backendProfiles]);

  const toggleSaved = (id) => {
    setSavedProfiles((current) =>
      current.includes(id)
        ? current.filter((profileId) => profileId !== id)
        : [...current, id]
    );
  };

  const handleSendInterest = async (profile) => {
    if (profile.isDemo) {
      window.alert("This is a demo preview photo. To test Express Interest, use a registered member profile linked to a backend account.");
      return;
    }

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      window.alert("Please log in to express interest.");
      return;
    }

    // This page now renders backend profiles only. Use the linked User ID,
    // never the Profile document ID, as the interest receiver.
    const receiverId = String(profile.userId || profile.user || "");

    if (!profile.isBackendProfile || !/^[a-f\d]{24}$/i.test(receiverId)) {
      window.alert("This member profile is not linked to a valid backend user account. Please refresh profiles or contact support.");
      return;
    }

    if (interestLoadingId === profile.id || sentInterestIds.includes(receiverId)) {
      return;
    }

    try {
      setInterestLoadingId(profile.id);
      const response = await sendInterest(receiverId);
      setSentInterestIds((current) =>
        current.includes(receiverId) ? current : [...current, receiverId]
      );
      window.alert(response.message || "Interest sent successfully.");
    } catch (error) {
      window.alert(error.message || "Unable to send interest. Please try again.");
    } finally {
      setInterestLoadingId(null);
    }
  };

  return (
    <main className="discover-page">
      <style>{`
        .discover-page {
          --primary: #8b5cf6;
          --primary-dark: #6d28d9;
          --ink: #30264a;
          --muted: #766872;
          --border: #ddd6fe;
          background: #f8f5ff;
          color: #30202a;
          min-height: 75vh;
          font-family: Inter, "Segoe UI", Arial, sans-serif;
        }

        .discover-page *,
        .discover-page *::before,
        .discover-page *::after {
          box-sizing: border-box;
        }

        .discover-page button,
        .discover-page input,
        .discover-page select {
          font: inherit;
        }

        .discover-container {
          width: min(1180px, calc(100% - 40px));
          margin: auto;
        }

        .discover-hero {
          padding: 58px 0 65px;
          background: linear-gradient(125deg, #401326, #c815d8, #c008e0);
          color: white;
        }

        .discover-breadcrumb {
          margin-bottom: 18px;
          font-size: 13px;
          color: #ffe0ec;
        }

        .discover-breadcrumb a {
          color: white;
          text-decoration: none;
        }

        .discover-hero h1 {
          margin: 0 0 15px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(34px, 5vw, 53px);
        }

        .discover-hero p {
          max-width: 650px;
          margin: 0;
          color: #ffedf4;
          line-height: 1.8;
        }

        .discover-benefits {
          display: flex;
          flex-wrap: wrap;
          gap: 12px 25px;
          margin-top: 24px;
          font-size: 13px;
        }

        .discover-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
          margin: 32px 0 22px;
        }

        .discover-toolbar h2 {
          margin: 0 0 7px;
          color: var(--ink);
          font: 700 28px Georgia, "Times New Roman", serif;
        }

        .discover-toolbar p {
          margin: 0;
          color: var(--muted);
          font-size: 13px;
        }

        .discover-toolbar-actions {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .discover-button,
        .discover-secondary,
        .discover-sort {
          min-height: 42px;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 13px;
          cursor: pointer;
        }

        .discover-button {
          border: 1px solid var(--primary);
          background: var(--primary);
          color: white;
          font-weight: 700;
        }

        .discover-button:hover {
          background: var(--primary-dark);
        }

        .discover-secondary,
        .discover-sort {
          border: 1px solid var(--border);
          background: white;
          color: #553b48;
        }

        .discover-layout {
          display: grid;
          grid-template-columns: 255px minmax(0, 1fr);
          gap: 24px;
          align-items: start;
          padding-bottom: 65px;
        }

        .discover-filters {
          padding: 22px;
          border: 1px solid var(--border);
          border-radius: 15px;
          background: white;
          box-shadow: 0 8px 28px #50143008;
        }

        .discover-filter-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .discover-filter-heading h3 {
          margin: 0;
          color: var(--ink);
          font-size: 18px;
        }

        .discover-reset {
          border: 0;
          background: none;
          color: var(--primary);
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .discover-field {
          margin-bottom: 17px;
        }

        .discover-field label {
          display: block;
          margin-bottom: 8px;
          color: #513543;
          font-size: 12px;
          font-weight: 750;
        }

        .discover-field input,
        .discover-field select {
          width: 100%;
          min-height: 43px;
          padding: 10px;
          border: 1px solid #e7d7df;
          border-radius: 8px;
          background: white;
          color: #4b3440;
          outline: none;
          font-size: 13px;
        }

        .discover-field input:focus,
        .discover-field select:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px #bd145514;
        }

        .discover-age-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .discover-apply {
          width: 100%;
        }

        .discover-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .discover-card {
          min-width: 0;
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 15px;
          background: white;
          box-shadow: 0 8px 26px #50143008;
          transition: transform .2s ease, box-shadow .2s ease;
        }

        .discover-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 32px #50143015;
        }

        .discover-image-wrap {
          position: relative;
          height: 245px;
          overflow: hidden;
          background: #f5e6ed;
        }

        .discover-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 35%;
        }

        .discover-badge {
          position: absolute;
          top: 13px;
          left: 13px;
          padding: 7px 10px;
          border-radius: 30px;
          background: white;
          color: var(--primary);
          font-size: 11px;
          font-weight: 750;
        }

        .discover-save {
          position: absolute;
          top: 10px;
          right: 10px;
          display: grid;
          place-items: center;
          width: 39px;
          height: 39px;
          border: 0;
          border-radius: 50%;
          background: #ffffffed;
          color: var(--primary);
          font-size: 23px;
          cursor: pointer;
        }

        .discover-card-content {
          padding: 18px;
        }

        .discover-name-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
        }

        .discover-name-row h3 {
          margin: 0 0 9px;
          color: var(--ink);
          font-size: 19px;
        }

        .discover-demo-tag {
          color: #198754;
          font-size: 10px;
          font-weight: 700;
        }

        .discover-meta {
          margin: 7px 0;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.6;
        }

        .discover-about {
          min-height: 58px;
          margin: 12px 0 16px;
          color: #6d5a64;
          font-size: 12px;
          line-height: 1.7;
        }

        .discover-card-actions {
          display: flex;
          gap: 9px;
        }

        .discover-card-actions button {
          flex: 1;
          min-height: 40px;
          padding: 9px 7px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 750;
          cursor: pointer;
        }

        .discover-view {
          border: 1px solid var(--primary);
          background: var(--primary);
          color: white;
        }

        .discover-interest {
          border: 1px solid var(--border);
          background: white;
          color: var(--primary);
        }

        .discover-empty {
          grid-column: 1 / -1;
          padding: 45px 20px;
          border: 1px dashed #e7cbd8;
          border-radius: 14px;
          background: white;
          text-align: center;
        }

        .discover-empty h3 {
          color: var(--ink);
        }

        .discover-empty p {
          color: var(--muted);
          font-size: 13px;
        }

        .discover-note {
          padding: 0 0 35px;
          color: #8a7781;
          text-align: center;
          font-size: 11px;
          line-height: 1.7;
        }

        .discover-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: grid;
          place-items: center;
          padding: 20px;
          background: #1e0a149e;
        }

        .discover-modal {
          position: relative;
          display: grid;
          grid-template-columns: .85fr 1.15fr;
          width: min(720px, 100%);
          max-height: 90vh;
          overflow: auto;
          border-radius: 16px;
          background: white;
        }

        .discover-modal-image {
          width: 100%;
          height: 100%;
          min-height: 330px;
          object-fit: cover;
        }

        .discover-modal-photo-column {
          min-width: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .discover-modal-gallery {
          display: flex;
          gap: 8px;
          padding: 12px;
          flex-wrap: wrap;
          align-items: center;
          background: white;
        }

        .discover-photo-thumb {
          width: 76px;
          height: 76px;
          padding: 0;
          border: 2px solid transparent;
          border-radius: 9px;
          overflow: hidden;
          background: #f7edf2;
          cursor: pointer;
        }

        .discover-photo-thumb.active {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px #bd145522;
        }

        .discover-photo-thumb img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .discover-modal-content {
          padding: 28px;
        }

        .discover-modal-content h2 {
          margin: 0 0 15px;
          color: var(--ink);
          font: 700 28px Georgia, "Times New Roman", serif;
        }

        .discover-modal-content p {
          color: var(--muted);
          font-size: 13px;
          line-height: 1.8;
        }

        .discover-close {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 1;
          width: 36px;
          height: 36px;
          border: 0;
          border-radius: 50%;
          background: white;
          color: #4a2435;
          font-size: 23px;
          cursor: pointer;
        }

        .discover-modal-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 20px;
        }

        .discover-modal-actions a {
          padding: 11px 14px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 12px;
          font-weight: 750;
        }

        .discover-register {
          background: var(--primary);
          color: white;
        }

        .discover-home-link {
          border: 1px solid var(--border);
          color: var(--primary);
        }

        @media (max-width: 900px) {
          .discover-layout {
            grid-template-columns: 220px minmax(0, 1fr);
            gap: 16px;
          }

          .discover-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 650px) {
          .discover-container {
            width: calc(100% - 30px);
          }

          .discover-hero {
            padding: 42px 0 50px;
          }

          .discover-layout {
            grid-template-columns: 1fr;
          }

          .discover-image-wrap {
            height: 285px;
          }

          .discover-modal {
            grid-template-columns: 1fr;
          }

          .discover-modal-image {
            height: 230px;
            min-height: 0;
          }

          .discover-modal-content {
            padding: 22px;
          }
        }
      `}</style>

      <section className="discover-hero">
        <div className="discover-container">
          <div className="discover-breadcrumb">
            <Link to="/">Home</Link> / Discover Profiles
          </div>

          <h1>Discover Your Perfect Match</h1>

          <p>
            Explore matrimonial profiles, find shared values, and take
            the first step towards a meaningful relationship with Wowmate.
          </p>

          <div className="discover-benefits">
            <span>✓ Search by your preferences</span>
            <span>✓ Explore different categories</span>
            <span>✓ Save profiles you like</span>
          </div>
        </div>
      </section>

      <div className="discover-container">
        <div className="discover-toolbar">
          <div>
            <h2>Discover Profiles</h2>
            <p>
              {filteredProfiles.length} {filteredProfiles.length === 1 ? "profile" : "profiles"} found
              {" · "}
              {savedProfiles.length} saved
            </p>
          </div>

          <div className="discover-toolbar-actions">
            <button
              type="button"
              className="discover-secondary"
              onClick={() => setShowFilters((value) => !value)}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>

            <select
              className="discover-sort"
              aria-label="Sort profiles"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="recommended">Recommended</option>
              <option value="age-asc">Age: Low to High</option>
              <option value="age-desc">Age: High to Low</option>
            </select>
          </div>
        </div>

        <div className="discover-layout">
          {showFilters && (
            <aside className="discover-filters">
              <div className="discover-filter-heading">
                <h3>Filter Profiles</h3>
                <button
                  type="button"
                  className="discover-reset"
                  onClick={resetFilters}
                >
                  Reset
                </button>
              </div>

              <div className="discover-field">
                <label htmlFor="dp-keyword">Name or profession</label>
                <input
                  id="dp-keyword"
                  type="search"
                  placeholder="Search profiles..."
                  value={filters.keyword}
                  onChange={(event) =>
                    updateFilter("keyword", event.target.value)
                  }
                />
              </div>

              <div className="discover-field">
                <label htmlFor="dp-gender">Looking for</label>
                <select
                  id="dp-gender"
                  value={filters.gender}
                  onChange={(event) =>
                    updateFilter("gender", event.target.value)
                  }
                >
                  <option value="">Bride or Groom</option>
                  <option value="Bride">Bride</option>
                  <option value="Groom">Groom</option>
                </select>
              </div>

              <div className="discover-field">
                <label htmlFor="dp-category">Matrimony category</label>
                <select
                  id="dp-category"
                  value={filters.category}
                  onChange={(event) =>
                    updateFilter("category", event.target.value)
                  }
                >
                  <option value="">All Categories</option>
                  <option value="Professional">Professional</option>
                  <option value="Farmer">Farmer</option>
                  <option value="Broker">Broker</option>
                </select>
              </div>

              <div className="discover-field">
                <label>Age range</label>
                <div className="discover-age-grid">
                  <select
                    aria-label="Minimum age"
                    value={filters.minAge}
                    onChange={(event) =>
                      updateFilter("minAge", event.target.value)
                    }
                  >
                    {Array.from({ length: 43 }, (_, i) => i + 18).map(
                      (age) => (
                        <option key={age} value={age}>
                          Min {age}
                        </option>
                      )
                    )}
                  </select>

                  <select
                    aria-label="Maximum age"
                    value={filters.maxAge}
                    onChange={(event) =>
                      updateFilter("maxAge", event.target.value)
                    }
                  >
                    {Array.from({ length: 43 }, (_, i) => i + 18).map(
                      (age) => (
                        <option key={age} value={age}>
                          Max {age}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div className="discover-field">
                <label htmlFor="dp-location">Location</label>
                <input
                  id="dp-location"
                  type="text"
                  placeholder="e.g. Karnataka"
                  value={filters.location}
                  onChange={(event) =>
                    updateFilter("location", event.target.value)
                  }
                />
              </div>

              <button
                type="button"
                className="discover-button discover-apply"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </button>
            </aside>
          )}

          <section aria-label="Matching matrimonial profiles">
            {profilesLoading && (
              <p className="discover-note" role="status">Loading registered Wowmate profiles...</p>
            )}
            {profilesError && (
              <p className="discover-note" role="alert">
                {profilesError} Make sure the backend GET /api/profile/discover endpoint is configured.
              </p>
            )}
            <div className="discover-grid">
              {filteredProfiles.map((profile) => (
                <article className="discover-card" key={profile.id}>
                  <div className="discover-image-wrap">
                    <img
                      className="discover-image"
                      src={profile.image || profile.photos?.[0] || "https://placehold.co/800x800/f5e6ed/8e103f?text=Wowmate"}
                      alt={`Profile photo of ${profile.name}`}
                      loading="lazy"
                    />

                    <span className="discover-badge">
                      {profile.category} Matrimony
                    </span>

                    <button
                      type="button"
                      className="discover-save"
                      aria-label={
                        savedProfiles.includes(profile.id)
                          ? "Remove saved profile"
                          : "Save profile"
                      }
                      title={
                        savedProfiles.includes(profile.id)
                          ? "Remove from saved"
                          : "Save profile"
                      }
                      onClick={() => toggleSaved(profile.id)}
                    >
                      {savedProfiles.includes(profile.id) ? "♥" : "♡"}
                    </button>
                  </div>

                  <div className="discover-card-content">
                    <div className="discover-name-row">
                      <h3>
                        {profile.name}, {profile.age}
                      </h3>
                      {profile.isDemo && <span className="discover-demo-tag">DEMO</span>}
                    </div>

                    <p className="discover-meta">
                      💼 {profile.profession}
                    </p>
                    <p className="discover-meta">
                      🎓 {profile.education}
                    </p>
                    <p className="discover-meta">
                      📍 {profile.location}
                    </p>

                    <p className="discover-about">{profile.about}</p>

                    <div className="discover-card-actions">
                      <button
                        type="button"
                        className="discover-view"
                        onClick={() => {
                          setSelectedProfile(profile);
                          setSelectedPhoto(profile.image || profile.photos?.[0] || "https://placehold.co/800x800/f5e6ed/8e103f?text=Wowmate");
                        }}
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        className="discover-interest"
                        onClick={() => handleSendInterest(profile)}
                        disabled={
                          profile.isDemo ||
                          interestLoadingId === profile.id ||
                          sentInterestIds.includes(String(profile.userId || profile.user))
                        }
                        aria-busy={interestLoadingId === profile.id}
                      >
                        {profile.isDemo
                          ? "Demo Preview"
                          : interestLoadingId === profile.id
                            ? "Sending..."
                            : sentInterestIds.includes(String(profile.userId || profile.user))
                              ? "Interest Sent"
                              : "Express Interest"}
                      </button>
                    </div>
                  </div>
                </article>
              ))}

              {!profilesLoading && !profilesError && filteredProfiles.length === 0 && (
                <div className="discover-empty">
                  <div style={{ fontSize: 38 }}>🔎</div>
                  <h3>No matching profiles found</h3>
                  <p>
                    Try changing your search, age range, category, or location.
                  </p>
                  <button
                    type="button"
                    className="discover-button"
                    onClick={resetFilters}
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>

        <p className="discover-note">
          Registered member profiles are loaded from your Wowmate backend. Demo preview photos are shown for layout testing only and cannot receive interest requests.
        </p>
      </div>

      {selectedProfile && (
        <div
          className="discover-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedProfile(null);
            }
          }}
        >
          <section
            className="discover-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dp-profile-title"
          >
            <button
              type="button"
              className="discover-close"
              aria-label="Close profile details"
              onClick={() => setSelectedProfile(null)}
            >
              ×
            </button>

            {(() => {
              const photos = Array.isArray(selectedProfile.photos)
                ? selectedProfile.photos.filter(Boolean)
                : [];
              const gallery = photos.length
                ? photos
                : [selectedProfile.image].filter(Boolean);
              const fallback =
                "https://placehold.co/800x800/f5e6ed/8e103f?text=Wowmate";
              const mainPhoto = selectedPhoto || gallery[0] || fallback;

              return (
                <div className="discover-modal-photo-column">
                  <img
                    className="discover-modal-image"
                    src={mainPhoto}
                    alt={`Profile photo of ${selectedProfile.name}`}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = fallback;
                    }}
                  />
                  {gallery.length > 1 && (
                    <div className="discover-modal-gallery" aria-label="Profile photos">
                      {gallery.map((photo, index) => (
                        <button
                          key={`${selectedProfile.id}-photo-${index}`}
                          type="button"
                          className={`discover-photo-thumb ${mainPhoto === photo ? "active" : ""}`}
                          onClick={() => setSelectedPhoto(photo)}
                          aria-label={`Show photo ${index + 1}`}
                          aria-pressed={mainPhoto === photo}
                        >
                          <img src={photo} alt={`${selectedProfile.name} photo ${index + 1}`} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="discover-modal-content">
              <h2 id="dp-profile-title">
                {selectedProfile.name}, {selectedProfile.age}
              </h2>

              <p><strong>Profession:</strong> {selectedProfile.profession}</p>
              <p><strong>Education:</strong> {selectedProfile.education}</p>
              <p><strong>Location:</strong> {selectedProfile.location}</p>
              <p><strong>Category:</strong> {selectedProfile.category}</p>
              <p><strong>Height:</strong> {selectedProfile.height}</p>
              <p><strong>Looking for:</strong> {selectedProfile.gender === "Bride" ? "Groom" : selectedProfile.gender === "Groom" ? "Bride" : "Not specified"}</p>
              <p>{selectedProfile.about}</p>
              {Array.isArray(selectedProfile.photos) && selectedProfile.photos.length > 1 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                  {selectedProfile.photos.map((photo, index) => (
                    <button
                      key={`${selectedProfile.id}-photo-${index}`}
                      type="button"
                      onClick={() => setSelectedPhoto(photo)}
                      aria-label={`View ${selectedProfile.name}'s photo ${index + 1}`}
                      aria-pressed={selectedPhoto === photo}
                      style={{
                        padding: 0,
                        border: selectedPhoto === photo ? "2px solid #c2185b" : "2px solid transparent",
                        borderRadius: 10,
                        background: "transparent",
                        cursor: "pointer",
                        lineHeight: 0,
                      }}
                    >
                      <img
                        src={photo}
                        alt={`${selectedProfile.name} photo ${index + 1}`}
                        style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 8, display: "block" }}
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="discover-modal-actions">
                <Link
                  className="discover-home-link"
                  to="/"
                  onClick={() => setSelectedProfile(null)}
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}