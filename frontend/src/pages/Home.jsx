import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  // Keep the Home page in sync with the login/logout events from Login.jsx.
  const [homeUser, setHomeUser] = useState(null);
  const [homeProfile, setHomeProfile] = useState(null);

  useEffect(() => {
    const refreshHomeAccount = () => {
      try {
        const savedUser =
          window.localStorage.getItem("user") ||
          window.sessionStorage.getItem("user");
        const user = savedUser ? JSON.parse(savedUser) : null;
        setHomeUser(user);

        if (!user || String(user.role || "").toLowerCase() !== "user") {
          setHomeProfile(null);
          return;
        }

        const savedProfiles = window.localStorage.getItem(
          "apnishaadi_registered_profiles"
        );
        const profiles = savedProfiles ? JSON.parse(savedProfiles) : [];
        const profile = Array.isArray(profiles)
          ? profiles.find(
              (item) =>
                item.id === `member-${user.id || user._id}` ||
                item.email?.toLowerCase() === user.email?.toLowerCase()
            ) || null
          : null;

        setHomeProfile(profile);
      } catch (error) {
        console.error("Unable to load the Home account profile:", error);
        setHomeUser(null);
        setHomeProfile(null);
      }
    };

    refreshHomeAccount();
    window.addEventListener("authChanged", refreshHomeAccount);
    window.addEventListener("storage", refreshHomeAccount);
    window.addEventListener("apnishaadi-profiles-updated", refreshHomeAccount);

    return () => {
      window.removeEventListener("authChanged", refreshHomeAccount);
      window.removeEventListener("storage", refreshHomeAccount);
      window.removeEventListener("apnishaadi-profiles-updated", refreshHomeAccount);
    };
  }, []);

  const homeRole = String(homeUser?.role || "").toLowerCase();
  const homeAction = homeRole === "broker"
    ? { label: "My Broker Workspace →", link: "/broker-matrimony" }
    : homeRole === "user"
      ? {
          label: homeProfile ? "View My Profile →" : "Complete Your Profile →",
          link: "/dashboard",
        }
      : { label: "Create Your Profile →", link: "/register" };

  const [search, setSearch] = useState({
    category: "",
    lookingFor: "",
    minAge: "21",
    maxAge: "35",
  });

  const handleSearch = (e) => {
    e.preventDefault();

    if (Number(search.minAge) > Number(search.maxAge)) {
      alert("Minimum age cannot be greater than maximum age.");
      return;
    }

    const params = new URLSearchParams(search);
    navigate(`/search-results?${params.toString()}`);
  };

  const categories = [
    {
      icon: "💼",
      title: "Professional Matrimony",
      description: "Meet educated professionals who share your ambitions.",
      link: "/professional-matrimony",
    },
    {
      icon: "🌾",
      title: "Farmer Matrimony",
      description: "Find a partner who understands your roots and values.",
      link: "/farmer-matrimony",
    },
    {
      icon: "🤝",
      title: "Broker Services",
      description: "Connect with matrimonial brokers and matchmaking services.",
      link: "/broker-matrimony",
    },
    {
      icon: "💖",
      title: "Discover Profiles",
      description: "Explore profiles and discover meaningful connections.",
      link: "/discover-profiles",
    },
  ];

  const profiles = [
    {
      name: "Priya",
      age: 27,
      profession: "Software Professional",
      location: "Bengaluru",
      image: "/image1.avif",
    },
    {
      name: "Rahul",
      age: 29,
      profession: "Business Professional",
      location: "Pune",
      image: "/image2.jpeg",
    },
    {
      name: "Ananya",
      age: 26,
      profession: "Doctor",
      location: "Mumbai",
      image: "/image3.png",
    },
  ];

  return (
    <main className="as-home">
      <style>{`
        .as-home {
          --primary: #8b5cf6;
          --primary-dark: #6d28d9;
          --text: #30264a;
          --muted: #786975;
          --border: #ddd6fe;
          width: 100%;
          overflow: hidden;
          background: #fff;
          color: var(--text);
          font-family: Arial, sans-serif;
        }

        .as-home *,
        .as-home *::before,
        .as-home *::after {
          box-sizing: border-box;
        }

        .as-container {
          width: min(1180px, calc(100% - 40px));
          margin: auto;
        }

        .as-section {
          padding: 75px 0;
        }

        .as-heading {
          max-width: 720px;
          margin: 0 auto 42px;
          text-align: center;
        }

        .as-heading span {
          color: var(--primary);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .as-heading h2 {
          margin: 14px 0;
          font-family: Georgia, serif;
          font-size: clamp(29px, 4vw, 43px);
          line-height: 1.2;
        }

        .as-heading p {
          color: var(--muted);
          font-size: 15px;
          line-height: 1.8;
        }

        .as-home .as-btn {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          padding: 14px 22px;
          border: 1px solid var(--primary);
          border-radius: 9px;
          background: var(--primary);
          color: white;
          text-decoration: none;
          font-weight: 700;
          cursor: pointer;
          transition: .2s ease;
        }

        .as-home .as-btn:hover {
          transform: translateY(-2px);
          background: var(--primary-dark);
        }

        /* HERO */

        .as-hero {
          position: relative;
          isolation: isolate;
          display: flex;
          align-items: center;
          min-height: 620px;
          padding: 75px 0;
          overflow: hidden;
          background: #351323;
        }

        .as-hero-video {
          position: absolute;
          inset: 0;
          z-index: -2;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .as-hero-overlay {
          position: absolute;
          inset: 0;
          z-index: -1;
          background: linear-gradient(
            90deg,
            rgba(35, 10, 22, .88),
            rgba(35, 10, 22, .65),
            rgba(35, 10, 22, .2)
          );
        }

        .as-hero-content {
          max-width: 720px;
          color: white;
        }

        .as-hero-label {
          display: inline-block;
          padding: 10px 15px;
          border: 1px solid #ffffff70;
          border-radius: 30px;
          background: #ffffff15;
          font-size: 12px;
          letter-spacing: 1px;
        }

        .as-hero h1 {
          margin: 24px 0;
          color: white;
          font-family: Georgia, serif;
          font-size: clamp(42px, 6vw, 74px);
          line-height: 1.08;
        }

        .as-hero h1 span {
          display: block;
          color: #ffd6e5;
        }

        .as-hero-content > p {
          max-width: 600px;
          color: #ffffffdf;
          font-size: 17px;
          line-height: 1.8;
        }

        .as-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 28px;
        }

        .as-home .as-btn-light {
          border-color: white;
          background: transparent;
          color: white;
        }

        .as-home .as-btn-light:hover {
          background: white;
          color: var(--primary);
        }

        /* SEARCH */

        .as-search-wrap {
          position: relative;
          margin-top: -40px;
        }

        .as-search-card {
          padding: 28px;
          border: 1px solid var(--border);
          border-radius: 18px;
          background: white;
          box-shadow: 0 18px 50px #56183418;
        }

        .as-search-card h2 {
          margin: 0 0 8px;
          font-size: 22px;
        }

        .as-search-card > p {
          margin-bottom: 24px;
          color: var(--muted);
          font-size: 14px;
        }

        .as-search-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr)) auto;
          gap: 14px;
          align-items: end;
        }

        .as-field label {
          display: block;
          margin-bottom: 8px;
          font-size: 13px;
          font-weight: 700;
        }

        .as-field select {
          width: 100%;
          min-height: 46px;
          padding: 10px;
          border: 1px solid #e8d9e0;
          border-radius: 8px;
          background: white;
          color: var(--text);
        }

        .as-field select:focus {
          outline: 2px solid #bd145533;
          border-color: var(--primary);
        }

        /* CATEGORY CARDS */

        .as-category-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 22px;
        }

        .as-category-card {
          display: flex;
          flex-direction: column;
          min-height: 250px;
          padding: 25px;
          border: 1px solid var(--border);
          border-radius: 15px;
          background: white;
          text-decoration: none;
          transition: .25s ease;
        }

        .as-category-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 35px #56183412;
        }

        .as-category-icon {
          display: grid;
          width: 56px;
          height: 56px;
          margin-bottom: 20px;
          place-items: center;
          border-radius: 14px;
          background: #f5f0ff;
          font-size: 28px;
        }

        .as-category-card h3 {
          margin: 0 0 10px;
          color: var(--text);
          font-size: 18px;
        }

        .as-category-card p {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.7;
        }

        .as-category-link {
          margin-top: auto;
          color: var(--primary);
          font-size: 13px;
          font-weight: 800;
        }

        /* PROFILE CARDS */

        .as-featured {
          background: #fff8fb;
        }

        .as-profile-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }

        .as-profile-card {
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 16px;
          background: white;
          transition: .25s ease;
        }

        .as-profile-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px #56183414;
        }

        .as-profile-image {
          width: 100%;
          height: 300px;
          object-fit: cover;
          background: #f7e8ef;
        }

        .as-profile-info {
          padding: 22px;
        }

        .as-profile-info h3 {
          margin: 0 0 12px;
          font-size: 21px;
        }

        .as-profile-info p {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.6;
        }

        .as-center {
          margin-top: 32px;
          text-align: center;
        }

        /* HOW IT WORKS */

        .as-steps-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 28px;
        }

        .as-step {
          padding: 25px;
          text-align: center;
        }

        .as-step-number {
          display: grid;
          width: 65px;
          height: 65px;
          margin: 0 auto 20px;
          place-items: center;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          font-size: 25px;
          font-weight: 800;
        }

        .as-step h3 {
          font-size: 19px;
        }

        .as-step p {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.8;
        }

        /* CTA */

        .as-cta {
          padding: 60px 25px;
          border-radius: 20px;
          background: linear-gradient(135deg, #9f0e46, #d52b70);
          color: white;
          text-align: center;
        }

        .as-cta h2 {
          color: white;
          font-family: Georgia, serif;
          font-size: clamp(29px, 4vw, 43px);
        }

        .as-cta p {
          max-width: 700px;
          margin: 18px auto 28px;
          color: #ffffffdf;
          font-size: 15px;
          line-height: 1.8;
        }

        .as-cta .as-btn {
          border-color: white;
          background: white;
          color: var(--primary);
        }

        /* PRICING */

        .as-pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }

        .as-price-card {
          display: flex;
          flex-direction: column;
          padding: 30px;
          border: 1px solid var(--border);
          border-radius: 16px;
          background: white;
          box-shadow: 0 10px 30px #56183408;
        }

        .as-price-card h3 {
          margin: 0 0 10px;
          font-size: 23px;
        }

        .as-price {
          margin: 18px 0;
          color: var(--primary);
          font-size: 32px;
          font-weight: 800;
        }

        .as-price small {
          color: var(--muted);
          font-size: 12px;
          font-weight: 400;
        }

        .as-price-card ul {
          display: grid;
          gap: 14px;
          padding: 0;
          margin: 0 0 25px;
          list-style: none;
        }

        .as-price-card li {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.6;
        }

        .as-price-card .as-btn {
          margin-top: auto;
          text-align: center;
        }

        .as-price-featured {
          border: 2px solid var(--primary);
          box-shadow: 0 15px 40px #bd14551a;
        }

        /* RESPONSIVE */

        @media (max-width: 1000px) {
          .as-search-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .as-search-grid .as-btn {
            width: 100%;
          }

          .as-category-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .as-pricing-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .as-section {
            padding: 52px 0;
          }

          .as-hero {
            min-height: 540px;
            padding: 55px 0;
          }

          .as-hero h1 {
            font-size: clamp(38px, 9vw, 54px);
          }

          .as-hero-content > p {
            font-size: 15px;
          }

          .as-search-card {
            padding: 22px 17px;
          }

          .as-profile-grid,
          .as-steps-grid,
          .as-pricing-grid {
            grid-template-columns: 1fr;
          }

          .as-profile-grid {
            max-width: 420px;
            margin: auto;
          }

          .as-profile-image {
            height: 320px;
          }

          .as-category-grid {
            gap: 14px;
          }

          .as-category-card {
            padding: 18px;
          }

          .as-cta {
            padding: 42px 20px;
          }
        }

        @media (max-width: 420px) {
          .as-container {
            width: calc(100% - 28px);
          }

          .as-search-grid,
          .as-category-grid {
            grid-template-columns: 1fr;
          }

          .as-hero-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .as-hero-actions .as-btn {
            width: 100%;
          }
        }
      `}</style>

      {/* HERO SECTION */}

      <section className="as-hero">
        <video
          className="as-hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/image.mp4" type="video/mp4" />
        </video>

        <div className="as-hero-overlay" />

        <div className="as-container">
          <div className="as-hero-content">
            <div className="as-hero-label">
              ♥ &nbsp; RISHTON KI NAYI SHURUAAT
            </div>

            <h1>
              Two Hearts.
              <span>One Beautiful Journey.</span>
            </h1>

            <p>
              Discover meaningful connections and begin a beautiful new
              chapter with someone who shares your values, dreams, and
              traditions. Your journey to forever starts here.
            </p>

            <div className="as-hero-actions">
              <Link to={homeAction.link} className="as-btn">
                {homeAction.label}
              </Link>

              <Link
                to="/discover-profiles"
                className="as-btn as-btn-light"
              >
                Explore Profiles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH FORM */}

      <section className="as-search-wrap">
        <div className="as-container">
          <div className="as-search-card">
            <h2>Find Your Life Partner</h2>

            <p>
              Select your preferences to begin discovering profiles.
            </p>

            <form onSubmit={handleSearch}>
              <div className="as-search-grid">
                <div className="as-field">
                  <label htmlFor="category">Matrimony Category</label>

                  <select
                    id="category"
                    value={search.category}
                    onChange={(e) =>
                      setSearch({ ...search, category: e.target.value })
                    }
                  >
                    <option value="">All Categories</option>
                    <option value="professional">Professional</option>
                    <option value="farmer">Farmer</option>
                    <option value="broker">Broker Services</option>
                  </select>
                </div>

                <div className="as-field">
                  <label htmlFor="lookingFor">Looking For</label>

                  <select
                    id="lookingFor"
                    value={search.lookingFor}
                    onChange={(e) =>
                      setSearch({ ...search, lookingFor: e.target.value })
                    }
                  >
                    <option value="">Any</option>
                    <option value="bride">Bride</option>
                    <option value="groom">Groom</option>
                  </select>
                </div>

                <div className="as-field">
                  <label htmlFor="minAge">Minimum Age</label>

                  <select
                    id="minAge"
                    value={search.minAge}
                    onChange={(e) =>
                      setSearch({ ...search, minAge: e.target.value })
                    }
                  >
                    {Array.from({ length: 28 }, (_, i) => i + 18).map(
                      (age) => (
                        <option key={age} value={age}>
                          {age} years
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="as-field">
                  <label htmlFor="maxAge">Maximum Age</label>

                  <select
                    id="maxAge"
                    value={search.maxAge}
                    onChange={(e) =>
                      setSearch({ ...search, maxAge: e.target.value })
                    }
                  >
                    {Array.from({ length: 28 }, (_, i) => i + 18).map(
                      (age) => (
                        <option key={age} value={age}>
                          {age} years
                        </option>
                      )
                    )}
                  </select>
                </div>

                <button type="submit" className="as-btn">
                  Search Profiles →
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}

      <section className="as-section">
        <div className="as-container">
          <div className="as-heading">
            <span>Explore Wowmate</span>
            <h2>Find a Match That Fits Your World</h2>
            <p>
              Discover matrimonial communities that reflect your lifestyle,
              values, and dreams for the future.
            </p>
          </div>

          <div className="as-category-grid">
            {categories.map((category) => (
              <Link
                to={category.link}
                className="as-category-card"
                key={category.title}
              >
                <div className="as-category-icon">{category.icon}</div>

                <h3>{category.title}</h3>

                <p>{category.description}</p>

                <span className="as-category-link">
                  Explore Now →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROFILES */}

      <section className="as-section as-featured">
        <div className="as-container">
          <div className="as-heading">
            <span>Discover Connections</span>
            <h2>Featured Profiles</h2>
            <p>
              Explore sample profiles and discover the possibilities of
              finding someone special.
            </p>
          </div>

          <div className="as-profile-grid">
            {profiles.map((profile) => (
              <article className="as-profile-card" key={profile.name}>
                <img
                  className="as-profile-image"
                  src={profile.image}
                  alt={`Sample profile of ${profile.name}`}
                  loading="lazy"
                />

                <div className="as-profile-info">
                  <h3>
                    {profile.name}, {profile.age}
                  </h3>

                  <p>💼 {profile.profession}</p>
                  <p>📍 {profile.location}</p>
                  <p>Sample profile · Demo content</p>

                  <Link
                    to="/discover-profiles"
                    className="as-btn"
                  >
                    Explore Profiles →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="as-center">
            <Link to="/discover-profiles" className="as-btn">
              View All Profiles →
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}

      <section className="as-section">
        <div className="as-container">
          <div className="as-heading">
            <span>Simple and Meaningful</span>
            <h2>Your Journey to Forever</h2>
            <p>
              Three simple steps to begin your matrimonial journey.
            </p>
          </div>

          <div className="as-steps-grid">
            <article className="as-step">
              <div className="as-step-number">1</div>
              <h3>Create Your Profile</h3>
              <p>
                Share your background, interests, values, and the qualities
                you hope to find in your life partner.
              </p>
            </article>

            <article className="as-step">
              <div className="as-step-number">2</div>
              <h3>Discover Your Match</h3>
              <p>
                Explore profiles and discover people whose values and
                future plans align with yours.
              </p>
            </article>

            <article className="as-step">
              <div className="as-step-number">3</div>
              <h3>Begin Your Story</h3>
              <p>
                Start a conversation and take the next step towards
                building a meaningful relationship.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}

      <section className="as-section">
        <div className="as-container">
          <div className="as-cta">
            <h2>Your Beautiful Story Could Begin Today</h2>

            <p>
              Create your profile, discover meaningful connections, and
              take the first step towards your forever.
            </p>

            <Link to={homeAction.link} className="as-btn">
              {homeRole === "broker"
                ? "My Broker Workspace ♥"
                : homeRole === "user"
                  ? homeProfile
                    ? "View My Profile ♥"
                    : "Complete Your Profile ♥"
                  : "Join Wowmate ♥"}
            </Link>
          </div>
        </div>
      </section>

     
    </main>
  );
}