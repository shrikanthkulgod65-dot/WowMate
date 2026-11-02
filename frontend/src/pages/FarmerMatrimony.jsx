import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Heart,
  ShieldCheck,
  Users,
  Sprout,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const farmerProfiles = [
  {
    id: 1,
    name: "Rahul",
    age: 28,
    location: "Belagavi, Karnataka",
    profession: "Farmer",
    education: "B.Sc. Agriculture",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600",
    details: "Family-owned agricultural land",
  },
  {
    id: 2,
    name: "Priya",
    age: 25,
    location: "Dharwad, Karnataka",
    profession: "Agriculture Professional",
    education: "B.Sc. Agriculture",
    image:
      "farmer1.png",
    details: "Values family and tradition",
  },
  {
    id: 3,
    name: "Vikram",
    age: 30,
    location: "Vijayapura, Karnataka",
    profession: "Progressive Farmer",
    education: "Graduate",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600",
    details: "Modern farming and family values",
  },
  {
    id: 4,
    name: "Sneha",
    age: 26,
    location: "Bagalkot, Karnataka",
    profession: "Agriculture Professional",
    education: "Postgraduate",
    image:
      "farmer2.png",
    details: "Interested in a family-oriented match",
  },
];

export default function FarmerMatrimony() {
  const navigate = useNavigate();

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
        console.error("Unable to load the page account profile:", error);
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
  const homeAction =
    homeRole === "broker"
      ? { label: "My Broker Workspace →", link: "/broker-matrimony" }
      : homeRole === "user"
        ? {
            label: homeProfile ? "View My Profile →" : "Complete Your Profile →",
            link: "/dashboard",
          }
        : { label: "Create Your Profile →", link: "/register" };

  const [lookingFor, setLookingFor] = useState("Bride");
  const [minAge, setMinAge] = useState("21");
  const [maxAge, setMaxAge] = useState("30");
  const [location, setLocation] = useState("");
  const [savedProfiles, setSavedProfiles] = useState([]);

  const handleSearch = (event) => {
    event.preventDefault();

    const params = new URLSearchParams({
      category: "farmer",
      lookingFor,
      minAge,
      maxAge,
      location,
    });

    navigate(`/search-results?${params.toString()}`);
  };

  const toggleSaved = (id) => {
    setSavedProfiles((previous) =>
      previous.includes(id)
        ? previous.filter((profileId) => profileId !== id)
        : [...previous, id]
    );
  };

  return (
    <main className="farmer-page">
      <style>{`
        .farmer-page {
          --farmer-primary: #8b5cf6;
          --farmer-dark: #4c1d95;
          --farmer-gold: #a78bfa;
          --farmer-cream: #f8f5ff;
          --farmer-text: #30264a;
          color: var(--farmer-text);
          background: #fff;
          font-family: inherit;
        }

        .farmer-page * {
          box-sizing: border-box;
        }

        .farmer-hero {
          min-height: 540px;
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
          background:
            linear-gradient(90deg, rgba(15, 43, 24, .91), rgba(15, 43, 24, .66), rgba(15, 43, 24, .12)),
            url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1800") center/cover;
        }

        .farmer-hero-content {
          max-width: 1200px;
          width: 100%;
          margin: auto;
          padding: 75px 25px 110px;
          color: #fff;
        }

        .farmer-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #f1d28b;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 12px;
          font-weight: 800;
          margin-bottom: 20px;
        }

        .farmer-hero h1 {
          color: #fff;
          max-width: 720px;
          font-size: clamp(36px, 5.5vw, 65px);
          line-height: 1.12;
          margin: 0 0 22px;
        }

        .farmer-hero h1 span {
          color: #f1d28b;
        }

        .farmer-hero p {
          color: #f4f1e8;
          max-width: 600px;
          line-height: 1.8;
          font-size: 17px;
          margin-bottom: 30px;
        }

        .farmer-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }

        .farmer-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 48px;
          padding: 13px 23px;
          border-radius: 8px;
          background: var(--farmer-primary);
          color: #fff;
          text-decoration: none;
          font-weight: 700;
          border: 1px solid var(--farmer-primary);
          cursor: pointer;
          transition: .2s ease;
        }

        .farmer-btn:hover {
          background: var(--farmer-dark);
          color: #fff;
          transform: translateY(-2px);
        }

        .farmer-btn-light {
          background: #fff;
          border-color: #fff;
          color: var(--farmer-dark);
        }

        .farmer-btn-light:hover {
          background: #f8efd9;
          color: var(--farmer-dark);
        }

        .farmer-search-wrap {
          max-width: 1150px;
          margin: -48px auto 0;
          padding: 0 22px;
          position: relative;
          z-index: 2;
        }

        .farmer-search-card {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr)) auto;
          align-items: end;
          gap: 17px;
          padding: 28px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 15px 45px rgba(30, 55, 35, .13);
        }

        .farmer-field label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 9px;
          color: #4b554a;
        }

        .farmer-field select,
        .farmer-field input {
          width: 100%;
          height: 46px;
          padding: 0 12px;
          border: 1px solid #dce4d8;
          border-radius: 7px;
          background: #fff;
          color: #303a30;
          outline-color: var(--farmer-primary);
        }

        .farmer-section {
          padding: 82px 24px;
        }

        .farmer-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .farmer-section-heading {
          text-align: center;
          max-width: 720px;
          margin: 0 auto 42px;
        }

        .farmer-section-heading > span {
          color: var(--farmer-primary);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .farmer-section-heading h2 {
          color: var(--farmer-dark);
          font-size: clamp(28px, 4vw, 42px);
          line-height: 1.2;
          margin: 13px 0;
        }

        .farmer-section-heading p {
          color: #74776f;
          line-height: 1.8;
          margin: 0;
        }

        .farmer-profile-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 23px;
        }

        .farmer-profile-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-width: 0;
          background: #fff;
          border: 1px solid #e8ece4;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 7px 25px rgba(25, 55, 30, .06);
          transition: transform .25s ease, box-shadow .25s ease;
        }

        .farmer-profile-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 35px rgba(25, 55, 30, .12);
        }

        .farmer-profile-image {
          display: block;
          width: 100%;
          height: 300px;
          min-height: 300px;
          flex: 0 0 300px;
          object-fit: cover;
          object-position: center top;
          background: #edf1e8;
        }

        .farmer-profile-body {
          display: flex;
          flex: 1;
          flex-direction: column;
          min-width: 0;
          padding: 20px;
        }

        .farmer-profile-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .farmer-profile-top h3 {
          margin: 0;
          color: var(--farmer-dark);
          font-size: 20px;
        }

        .farmer-save {
          border: 0;
          background: #f2f6ef;
          color: #60715d;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          cursor: pointer;
          display: grid;
          place-items: center;
        }

        .farmer-save.is-saved {
          color: #c62848;
          background: #fff0f3;
        }

        .farmer-profile-meta {
          color: #73776e;
          font-size: 13px;
          line-height: 1.7;
          margin: 12px 0;
        }

        .farmer-profile-tag {
          display: inline-block;
          background: #eef5e9;
          color: #315b37;
          border-radius: 20px;
          padding: 6px 10px;
          font-size: 11px;
          font-weight: 700;
          margin: 4px 3px 12px 0;
        }

        .farmer-profile-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid #edf0e9;
          color: var(--farmer-primary);
          text-decoration: none;
          font-weight: 700;
          font-size: 13px;
        }

        .farmer-benefits {
          background: var(--farmer-cream);
        }

        .farmer-benefit-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }

        .farmer-benefit-card {
          background: #fff;
          padding: 30px;
          border: 1px solid #eee7d5;
          border-radius: 14px;
        }

        .farmer-benefit-icon {
          width: 55px;
          height: 55px;
          display: grid;
          place-items: center;
          background: #eaf2e5;
          color: var(--farmer-primary);
          border-radius: 13px;
          margin-bottom: 20px;
        }

        .farmer-benefit-card h3 {
          color: var(--farmer-dark);
          font-size: 20px;
          margin: 0 0 12px;
        }

        .farmer-benefit-card p {
          color: #73776e;
          line-height: 1.8;
          margin: 0;
          font-size: 14px;
        }

        .farmer-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
          margin-top: 42px;
        }

        .farmer-stat {
          text-align: center;
          padding: 25px 12px;
          border-radius: 12px;
          background: #fff;
          border: 1px solid #e7eadf;
        }

        .farmer-stat strong {
          display: block;
          color: var(--farmer-primary);
          font-size: 28px;
          margin-bottom: 7px;
        }

        .farmer-stat span {
          color: #6f756a;
          font-size: 13px;
        }

        .farmer-cta {
          margin: 0 24px 80px;
          padding: 55px 25px;
          border-radius: 20px;
          text-align: center;
          background:
            linear-gradient(120deg, rgba(24, 62, 39, .96), rgba(40, 92, 54, .92)),
            url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1800/") center/cover;
          color: #fff;
        }

        .farmer-cta h2 {
          color: #fff;
          font-size: clamp(28px, 4vw, 40px);
          margin: 0 0 14px;
        }

        .farmer-cta p {
          color: #e9eee5;
          line-height: 1.7;
          max-width: 650px;
          margin: 0 auto 25px;
        }

        .farmer-cta .farmer-btn {
          background: #f1d28b;
          border-color: #f1d28b;
          color: #183e27;
        }

        @media (max-width: 1000px) {
          .farmer-search-card {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .farmer-profile-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .farmer-search-card > button {
            width: 100%;
          }
        }

        @media (max-width: 650px) {
          .farmer-hero {
            min-height: 520px;
            background-position: 58% center;
          }

          .farmer-hero-content {
            padding: 60px 22px 90px;
          }

          .farmer-hero p {
            font-size: 15px;
          }

          .farmer-search-wrap {
            margin-top: -35px;
            padding: 0 15px;
          }

          .farmer-search-card {
            grid-template-columns: 1fr;
            padding: 22px;
          }

          .farmer-section {
            padding: 60px 18px;
          }

          .farmer-profile-grid,
          .farmer-benefit-grid,
          .farmer-stats {
            grid-template-columns: 1fr;
          }

          .farmer-profile-image {
            height: 300px;
            min-height: 300px;
            flex-basis: 300px;
          }

          .farmer-cta {
            margin: 0 15px 55px;
            padding: 40px 20px;
          }
        }
      `}</style>

      {/* HERO SECTION */}
      <section className="farmer-hero">
        <div className="farmer-hero-content">
          <div className="farmer-eyebrow">
            <Sprout size={18} />
            Farmer Matrimony
          </div>

          <h1>
            Where Farming Traditions
            <br />
            Meet <span>Forever Love</span>
          </h1>

          <p>
            Find a life partner who understands your roots, respects your
            family values, and shares your dreams for a beautiful future.
          </p>

          <div className="farmer-hero-actions">
            <a href="#farmer-search" className="farmer-btn">
              Find Your Match <ArrowRight size={18} />
            </a>

            <Link to={homeAction.link} className="farmer-btn farmer-btn-light">
              {homeAction.label}
            </Link>
          </div>
        </div>
      </section>

      {/* SEARCH SECTION */}
      <section
        className="farmer-search-wrap"
        id="farmer-search"
        aria-label="Search farmer matrimony profiles"
      >
        <form className="farmer-search-card" onSubmit={handleSearch}>
          <div className="farmer-field">
            <label htmlFor="farmer-looking-for">I'm looking for</label>
            <select
              id="farmer-looking-for"
              value={lookingFor}
              onChange={(event) => setLookingFor(event.target.value)}
            >
              <option value="Bride">Bride</option>
              <option value="Groom">Groom</option>
            </select>
          </div>

          <div className="farmer-field">
            <label htmlFor="farmer-min-age">Minimum age</label>
            <select
              id="farmer-min-age"
              value={minAge}
              onChange={(event) => setMinAge(event.target.value)}
            >
              {Array.from({ length: 18 }, (_, index) => index + 18).map(
                (age) => (
                  <option key={age} value={age}>
                    {age} years
                  </option>
                )
              )}
            </select>
          </div>

          <div className="farmer-field">
            <label htmlFor="farmer-max-age">Maximum age</label>
            <select
              id="farmer-max-age"
              value={maxAge}
              onChange={(event) => setMaxAge(event.target.value)}
            >
              {Array.from({ length: 23 }, (_, index) => index + 21).map(
                (age) => (
                  <option key={age} value={age}>
                    {age} years
                  </option>
                )
              )}
            </select>
          </div>

          <div className="farmer-field">
            <label htmlFor="farmer-location">Preferred location</label>
            <input
              id="farmer-location"
              type="text"
              placeholder="City or state"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </div>

          <button className="farmer-btn" type="submit">
            <Search size={18} /> Search
          </button>
        </form>
      </section>

      {/* FEATURED PROFILES */}
      <section className="farmer-section">
        <div className="farmer-container">
          <div className="farmer-section-heading">
            <span>Discover Your Match</span>
            <h2>Featured Farmer Profiles</h2>
            <p>
              Explore sample profiles of people who value agriculture,
              tradition, family, and a meaningful partnership.
            </p>
          </div>

          <div className="farmer-profile-grid">
            {farmerProfiles.map((profile) => (
              <article className="farmer-profile-card" key={profile.id}>
                <img
                  className="farmer-profile-image"
                  src={profile.image}
                  alt={`Sample profile of ${profile.name}`}
                  loading="lazy"
                />

                <div className="farmer-profile-body">
                  <div className="farmer-profile-top">
                    <h3>
                      {profile.name}, {profile.age}
                    </h3>

                    <button
                      type="button"
                      className={`farmer-save ${
                        savedProfiles.includes(profile.id) ? "is-saved" : ""
                      }`}
                      aria-label={
                        savedProfiles.includes(profile.id)
                          ? `Unsave ${profile.name}`
                          : `Save ${profile.name}`
                      }
                      aria-pressed={savedProfiles.includes(profile.id)}
                      onClick={() => toggleSaved(profile.id)}
                    >
                      <Heart
                        size={19}
                        fill={
                          savedProfiles.includes(profile.id)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>
                  </div>

                  <div className="farmer-profile-meta">
                    <div>
                      <MapPin
                        size={14}
                        style={{
                          display: "inline",
                          verticalAlign: "middle",
                          marginRight: 5,
                        }}
                      />
                      {profile.location}
                    </div>
                    <div>{profile.education}</div>
                    <div>{profile.details}</div>
                  </div>

                  <span className="farmer-profile-tag">
                    {profile.profession}
                  </span>

                  <Link
                    to="/login"
                    className="farmer-profile-link"
                  >
                    View Profile <ArrowRight size={17} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 38 }}>
            <Link to="/discover-profiles" className="farmer-btn">
              Explore More Profiles <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY FARMER MATRIMONY */}
      <section className="farmer-section farmer-benefits">
        <div className="farmer-container">
          <div className="farmer-section-heading">
            <span>Rooted in Values</span>
            <h2>A Match That Understands Your World</h2>
            <p>
              A meaningful relationship begins with understanding,
              respect, shared values, and trust between families.
            </p>
          </div>

          <div className="farmer-benefit-grid">
            <article className="farmer-benefit-card">
              <div className="farmer-benefit-icon">
                <Sprout size={27} />
              </div>
              <h3>Shared Agricultural Values</h3>
              <p>
                Discover people who understand farming life, rural
                communities, and the importance of agricultural traditions.
              </p>
            </article>

            <article className="farmer-benefit-card">
              <div className="farmer-benefit-icon">
                <Users size={27} />
              </div>
              <h3>Family Compatibility</h3>
              <p>
                Search for a partner whose family values, lifestyle,
                and future goals are compatible with yours.
              </p>
            </article>

            <article className="farmer-benefit-card">
              <div className="farmer-benefit-icon">
                <ShieldCheck size={27} />
              </div>
              <h3>Privacy and Trust</h3>
              <p>
                Build a profile and explore matches while keeping your
                privacy in mind. Always verify a person's identity independently.
              </p>
            </article>
          </div>

          <div className="farmer-stats">
            <div className="farmer-stat">
              <strong>
                <Users
                  size={23}
                  style={{ display: "inline", verticalAlign: "middle" }}
                />
              </strong>
              <span>Community-focused matching</span>
            </div>

            <div className="farmer-stat">
              <strong>
                <Heart
                  size={23}
                  style={{ display: "inline", verticalAlign: "middle" }}
                />
              </strong>
              <span>Meaningful relationships</span>
            </div>

            <div className="farmer-stat">
              <strong>
                <CheckCircle
                  size={23}
                  style={{ display: "inline", verticalAlign: "middle" }}
                />
              </strong>
              <span>Compatibility-focused search</span>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="farmer-cta">
        <h2>Your Roots. Your Values. Your Forever.</h2>
        <p>
          Start discovering potential life partners who appreciate your
          lifestyle and share your hopes for the future.
        </p>

        <Link to={homeAction.link} className="farmer-btn">
          {homeAction.label} <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}
