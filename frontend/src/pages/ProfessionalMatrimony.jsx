import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Heart,
  ShieldCheck,
  BriefcaseBusiness,
  GraduationCap,
  Stethoscope,
  Code2,
  Building2,
  ArrowRight,
  Users,
} from "lucide-react";

const professionalProfiles = [
  {
    id: 1,
    name: "Aarav",
    age: 29,
    location: "Bengaluru, Karnataka",
    profession: "Software Engineer",
    education: "B.Tech",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600",
    description: "Technology professional with family values",
  },
  {
    id: 2,
    name: "Ananya",
    age: 27,
    location: "Pune, Maharashtra",
    profession: "Doctor",
    education: "MBBS",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600",
    description: "Healthcare professional who values family",
  },
  {
    id: 3,
    name: "Rohan",
    age: 31,
    location: "Hyderabad, Telangana",
    profession: "Business Professional",
    education: "MBA",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600",
    description: "Business-minded and family-oriented",
  },
  {
    id: 4,
    name: "Meera",
    age: 26,
    location: "Mumbai, Maharashtra",
    profession: "IT Professional",
    education: "M.Tech",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600",
    description: "Career-focused and values meaningful relationships",
  },
];

const professionCategories = [
  {
    title: "Doctors & Healthcare",
    description: "Doctors, dentists, nurses, and healthcare professionals",
    icon: Stethoscope,
  },
  {
    title: "IT & Software",
    description: "Software engineers, developers, and technology experts",
    icon: Code2,
  },
  {
    title: "Engineers",
    description: "Professionals across engineering disciplines",
    icon: GraduationCap,
  },
  {
    title: "Business & Management",
    description: "Entrepreneurs, managers, and business professionals",
    icon: Building2,
  },
];

export default function ProfessionalMatrimony() {
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
  const [minAge, setMinAge] = useState("23");
  const [maxAge, setMaxAge] = useState("32");
  const [location, setLocation] = useState("");
  const [profession, setProfession] = useState("Any Profession");
  const [savedProfiles, setSavedProfiles] = useState([]);

  const handleSearch = (event) => {
    event.preventDefault();

    const params = new URLSearchParams({
      category: "professional",
      lookingFor,
      minAge,
      maxAge,
      location,
      profession,
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
    <main className="professional-page">
      <style>{`
        .professional-page {
          --pro-primary: #8b5cf6;
          --pro-dark: #4c1d95;
          --pro-accent: #a78bfa;
          --pro-background: #f8f5ff;
          --pro-text: #30264a;
          background: #fff;
          color: var(--pro-text);
          font-family: inherit;
        }

        .professional-page * {
          box-sizing: border-box;
        }

        .pro-hero {
          position: relative;
          min-height: 550px;
          display: flex;
          align-items: center;
          overflow: hidden;
          background:
            linear-gradient(
              90deg,
              rgba(31, 23, 58, .94) 0%,
              rgba(48, 35, 78, .80) 48%,
              rgba(48, 35, 78, .15) 100%
            ),
            url("https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1800")
            center/cover;
        }

        .pro-hero-content {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 25px 115px;
          color: #fff;
        }

        .pro-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #e8cf9b;
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 22px;
        }

        .pro-hero h1 {
          max-width: 750px;
          color: #fff;
          font-size: clamp(36px, 5.5vw, 66px);
          line-height: 1.12;
          margin: 0 0 22px;
        }

        .pro-hero h1 span {
          color: #e8cf9b;
        }

        .pro-hero p {
          max-width: 620px;
          color: #eeebf5;
          font-size: 17px;
          line-height: 1.8;
          margin: 0 0 30px;
        }

        .pro-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
        }

        .pro-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          min-height: 48px;
          padding: 13px 23px;
          border: 1px solid var(--pro-primary);
          border-radius: 8px;
          background: var(--pro-primary);
          color: #fff;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          transition: .2s ease;
        }

        .pro-btn:hover {
          background: var(--pro-dark);
          border-color: var(--pro-dark);
          color: #fff;
          transform: translateY(-2px);
        }

        .pro-btn-light {
          background: #fff;
          color: var(--pro-dark);
          border-color: #fff;
        }

        .pro-btn-light:hover {
          background: #f2edf9;
          color: var(--pro-dark);
          border-color: #f2edf9;
        }

        .pro-search-wrap {
          max-width: 1160px;
          margin: -48px auto 0;
          padding: 0 22px;
          position: relative;
          z-index: 2;
        }

        .pro-search-card {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          align-items: end;
          padding: 28px;
          background: #fff;
          border: 1px solid #eee8f6;
          border-radius: 16px;
          box-shadow: 0 15px 45px rgba(39, 25, 67, .12);
        }

        .pro-field label {
          display: block;
          margin-bottom: 9px;
          color: #51475f;
          font-size: 13px;
          font-weight: 700;
        }

        .pro-field input,
        .pro-field select {
          width: 100%;
          height: 46px;
          padding: 0 12px;
          border: 1px solid #e0d9eb;
          border-radius: 7px;
          background: #fff;
          color: #352b43;
          outline-color: var(--pro-primary);
        }

        .pro-search-card .pro-btn {
          width: 100%;
        }

        .pro-section {
          padding: 82px 24px;
        }

        .pro-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .pro-heading {
          max-width: 740px;
          margin: 0 auto 42px;
          text-align: center;
        }

        .pro-heading > span {
          color: var(--pro-accent);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .pro-heading h2 {
          color: var(--pro-dark);
          font-size: clamp(28px, 4vw, 42px);
          line-height: 1.2;
          margin: 13px 0;
        }

        .pro-heading p {
          color: #77717f;
          line-height: 1.8;
          margin: 0;
        }

        .pro-profile-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 23px;
        }

        .pro-profile-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-width: 0;
          overflow: hidden;
          background: #fff;
          border: 1px solid #ebe6f1;
          border-radius: 14px;
          box-shadow: 0 7px 25px rgba(39, 25, 67, .06);
          transition: transform .25s ease, box-shadow .25s ease;
        }

        .pro-profile-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 15px 35px rgba(39, 25, 67, .12);
        }

        .pro-profile-image {
          display: block;
          width: 100%;
          height: 300px;
          min-height: 300px;
          flex: 0 0 300px;
          object-fit: cover;
          object-position: center top;
          background: #efedf4;
        }

        .pro-profile-body {
          display: flex;
          flex: 1;
          flex-direction: column;
          padding: 20px;
          min-width: 0;
        }

        .pro-profile-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .pro-profile-top h3 {
          color: var(--pro-dark);
          font-size: 20px;
          margin: 0;
        }

        .pro-save {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border: 0;
          border-radius: 50%;
          background: #f2eef8;
          color: #66577e;
          cursor: pointer;
        }

        .pro-save.is-saved {
          color: #c62848;
          background: #fff0f3;
        }

        .pro-profile-meta {
          margin: 12px 0;
          color: #77717f;
          font-size: 13px;
          line-height: 1.8;
        }

        .pro-profile-tag {
          display: inline-block;
          padding: 6px 10px;
          margin: 4px 3px 12px 0;
          border-radius: 20px;
          background: #f0ebf8;
          color: #49356d;
          font-size: 11px;
          font-weight: 700;
        }

        .pro-profile-link {
          display: flex;
          margin-top: auto;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid #eee9f4;
          color: var(--pro-primary);
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
        }

        .pro-categories {
          background: var(--pro-background);
        }

        .pro-category-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 20px;
        }

        .pro-category-card {
          padding: 28px 22px;
          background: #fff;
          border: 1px solid #ebe5f3;
          border-radius: 13px;
          transition: transform .2s ease, box-shadow .2s ease;
        }

        .pro-category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(39, 25, 67, .09);
        }

        .pro-category-icon {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          margin-bottom: 20px;
          background: #eee8f8;
          color: var(--pro-primary);
          border-radius: 12px;
        }

        .pro-category-card h3 {
          color: var(--pro-dark);
          font-size: 18px;
          margin: 0 0 11px;
        }

        .pro-category-card p {
          color: #77717f;
          font-size: 13px;
          line-height: 1.8;
          margin: 0;
        }

        .pro-benefit-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }

        .pro-benefit-card {
          padding: 30px;
          border: 1px solid #ebe5f3;
          border-radius: 14px;
          background: #fff;
        }

        .pro-benefit-icon {
          width: 55px;
          height: 55px;
          display: grid;
          place-items: center;
          margin-bottom: 20px;
          border-radius: 13px;
          background: #f0ebf8;
          color: var(--pro-primary);
        }

        .pro-benefit-card h3 {
          color: var(--pro-dark);
          font-size: 20px;
          margin: 0 0 12px;
        }

        .pro-benefit-card p {
          color: #77717f;
          font-size: 14px;
          line-height: 1.8;
          margin: 0;
        }

        .pro-cta {
          margin: 0 24px 80px;
          padding: 55px 25px;
          border-radius: 20px;
          background:
            linear-gradient(120deg, rgba(38, 27, 70, .96), rgba(67, 49, 111, .92)),
            url("https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1400")
            center/cover;
          color: #fff;
          text-align: center;
        }

        .pro-cta h2 {
          color: #fff;
          font-size: clamp(28px, 4vw, 40px);
          margin: 0 0 14px;
        }

        .pro-cta p {
          max-width: 650px;
          margin: 0 auto 25px;
          color: #eee9f7;
          line-height: 1.8;
        }

        .pro-cta .pro-btn {
          background: #e8cf9b;
          border-color: #e8cf9b;
          color: #261b46;
        }

        @media (max-width: 1000px) {
          .pro-profile-grid,
          .pro-category-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .pro-hero {
            min-height: 520px;
            background-position: 60% center;
          }

          .pro-hero-content {
            padding: 60px 22px 90px;
          }

          .pro-hero p {
            font-size: 15px;
          }

          .pro-search-wrap {
            margin-top: -35px;
            padding: 0 15px;
          }

          .pro-search-card {
            grid-template-columns: 1fr;
            padding: 22px;
          }

          .pro-section {
            padding: 60px 18px;
          }

          .pro-profile-grid,
          .pro-category-grid,
          .pro-benefit-grid {
            grid-template-columns: 1fr;
          }

          .pro-profile-image {
            height: 300px;
            min-height: 300px;
            flex-basis: 300px;
          }

          .pro-cta {
            margin: 0 15px 55px;
            padding: 40px 20px;
          }
        }
      `}</style>

      {/* HERO SECTION */}
      <section className="pro-hero">
        <div className="pro-hero-content">
          <div className="pro-eyebrow">
            <BriefcaseBusiness size={18} />
            Professional Matrimony
          </div>

          <h1>
            Successful Careers.
            <br />
            <span>Beautiful Partnerships.</span>
          </h1>

          <p>
            Meet educated, ambitious, and family-oriented professionals
            who share your values and dreams for a fulfilling future.
          </p>

          <div className="pro-actions">
            <a href="#professional-search" className="pro-btn">
              Find Your Match <ArrowRight size={18} />
            </a>

            <Link to={homeAction.link} className="pro-btn pro-btn-light">
              {homeAction.label}
            </Link>
          </div>
        </div>
      </section>

      {/* SEARCH SECTION */}
      <section
        className="pro-search-wrap"
        id="professional-search"
        aria-label="Search professional matrimony profiles"
      >
        <form className="pro-search-card" onSubmit={handleSearch}>
          <div className="pro-field">
            <label htmlFor="pro-looking-for">I'm looking for</label>
            <select
              id="pro-looking-for"
              value={lookingFor}
              onChange={(event) => setLookingFor(event.target.value)}
            >
              <option value="Bride">Bride</option>
              <option value="Groom">Groom</option>
            </select>
          </div>

          <div className="pro-field">
            <label htmlFor="pro-min-age">Minimum age</label>
            <select
              id="pro-min-age"
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

          <div className="pro-field">
            <label htmlFor="pro-max-age">Maximum age</label>
            <select
              id="pro-max-age"
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

          <div className="pro-field">
            <label htmlFor="pro-location">Preferred location</label>
            <input
              id="pro-location"
              type="text"
              placeholder="City or state"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </div>

          <div className="pro-field">
            <label htmlFor="pro-profession">Profession</label>
            <select
              id="pro-profession"
              value={profession}
              onChange={(event) => setProfession(event.target.value)}
            >
              <option>Any Profession</option>
              <option>Doctor</option>
              <option>Engineer</option>
              <option>IT Professional</option>
              <option>Business Professional</option>
              <option>Teacher</option>
              <option>Government Employee</option>
              <option>Finance Professional</option>
            </select>
          </div>

          <button className="pro-btn" type="submit">
            <Search size={18} /> Search Profiles
          </button>
        </form>
      </section>

      {/* FEATURED PROFILES */}
      <section className="pro-section">
        <div className="pro-container">
          <div className="pro-heading">
            <span>Discover Your Match</span>
            <h2>Featured Professional Profiles</h2>
            <p>
              Explore sample profiles representing different careers,
              educational backgrounds, and life goals.
            </p>
          </div>

          <div className="pro-profile-grid">
            {professionalProfiles.map((profile) => (
              <article className="pro-profile-card" key={profile.id}>
                <img
                  className="pro-profile-image"
                  src={profile.image}
                  alt={`Sample profile of ${profile.name}`}
                  loading="lazy"
                />

                <div className="pro-profile-body">
                  <div className="pro-profile-top">
                    <h3>
                      {profile.name}, {profile.age}
                    </h3>

                    <button
                      type="button"
                      className={`pro-save ${
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

                  <div className="pro-profile-meta">
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
                    <div>{profile.description}</div>
                  </div>

                  <span className="pro-profile-tag">
                    {profile.profession}
                  </span>

                  <Link to="/login" className="pro-profile-link">
                    View Profile <ArrowRight size={17} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 38 }}>
            <Link to="/discover-profiles" className="pro-btn">
              Explore More Profiles <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* PROFESSIONAL CATEGORIES */}
      <section className="pro-section pro-categories">
        <div className="pro-container">
          <div className="pro-heading">
            <span>Explore By Profession</span>
            <h2>Meet Someone Who Understands Your Journey</h2>
            <p>
              Explore potential matches across a variety of professional
              fields and educational backgrounds.
            </p>
          </div>

          <div className="pro-category-grid">
            {professionCategories.map((category) => {
              const Icon = category.icon;

              return (
                <article className="pro-category-card" key={category.title}>
                  <div className="pro-category-icon">
                    <Icon size={27} />
                  </div>
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY PROFESSIONAL MATRIMONY */}
      <section className="pro-section">
        <div className="pro-container">
          <div className="pro-heading">
            <span>Why Wowmate?</span>
            <h2>More Than Careers. A Shared Future.</h2>
            <p>
              A strong partnership brings together mutual respect,
              personal aspirations, family values, and trust.
            </p>
          </div>

          <div className="pro-benefit-grid">
            <article className="pro-benefit-card">
              <div className="pro-benefit-icon">
                <GraduationCap size={27} />
              </div>
              <h3>Education & Compatibility</h3>
              <p>
                Explore profiles and consider educational backgrounds,
                interests, values, and long-term expectations.
              </p>
            </article>

            <article className="pro-benefit-card">
              <div className="pro-benefit-icon">
                <ShieldCheck size={27} />
              </div>
              <h3>Privacy & Safety</h3>
              <p>
                Be thoughtful about the information you share and
                independently verify potential matches.
              </p>
            </article>

            <article className="pro-benefit-card">
              <div className="pro-benefit-icon">
                <Users size={27} />
              </div>
              <h3>Family & Future Goals</h3>
              <p>
                Find people who respect your career ambitions and
                share your hopes for family life.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="pro-cta">
        <h2>Your Next Chapter Starts Here</h2>
        <p>
          Build your profile and begin exploring potential life partners
          who share your values, ambitions, and hopes for the future.
        </p>

        <Link to={homeAction.link} className="pro-btn">
          {homeAction.label} <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}