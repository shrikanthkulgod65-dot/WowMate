import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function MyProfile() {
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const [profile, setProfile] = useState({
    fullName: "",
    age: "",
    gender: "",
    maritalStatus: "",
    religion: "",
    community: "",
    profession: "",
    education: "",
    location: "",
    income: "",
    about: "",
    partnerAge: "",
    partnerLocation: "",
    partnerEducation: "",
    partnerProfession: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage("");
  }

  function handleSave(event) {
    event.preventDefault();

    try {
      localStorage.setItem("apnishaadiMyProfile", JSON.stringify(profile));
      setIsEditing(false);
      setMessage("Your profile has been saved successfully!");
    } catch {
      setMessage("Unable to save your profile in this browser.");
    }
  }

  React.useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("apnishaadiMyProfile");

      if (savedProfile) {
        setProfile((previous) => ({
          ...previous,
          ...JSON.parse(savedProfile),
        }));
      }
    } catch {
      setMessage("Unable to load your saved profile.");
    }
  }, []);

  const displayName = profile.fullName.trim() || "Your Name";

  return (
    <main className="mp-page">
      <header className="mp-header">
        <Link to="/" className="mp-brand">
          ❤️ Wowmate
        </Link>

        <h1>My Profile</h1>

        <p>
          Your journey to finding your perfect life partner starts here.
        </p>
      </header>

      <div className="mp-layout">
        <aside className="mp-sidebar">
          <div className="mp-avatar">
            {profile.fullName.trim()
              ? profile.fullName.trim().charAt(0).toUpperCase()
              : "♡"}
          </div>

          <h2>{displayName}</h2>

          <p className="mp-muted">
            {profile.profession || "Add your profession"}
          </p>

          <p className="mp-location">
            📍 {profile.location || "Add your location"}
          </p>

          <div className="mp-profile-status">
            <span className="mp-status-dot" />
            Profile details
          </div>

          <button
            type="button"
            className="mp-edit-button"
            onClick={() => {
              setIsEditing((previous) => !previous);
              setMessage("");
            }}
          >
            {isEditing ? "Cancel Editing" : "✏️ Edit Profile"}
          </button>

          <nav className="mp-navigation">
            <button
              type="button"
              className={activeTab === "personal" ? "active" : ""}
              onClick={() => setActiveTab("personal")}
            >
              👤 Personal Details
            </button>

            <button
              type="button"
              className={activeTab === "partner" ? "active" : ""}
              onClick={() => setActiveTab("partner")}
            >
              💕 Partner Preferences
            </button>
          </nav>
        </aside>

        <section className="mp-content">
          <div className="mp-content-heading">
            <div>
              <span className="mp-eyebrow">WOWMATE MEMBER</span>

              <h2>
                {activeTab === "personal"
                  ? "Personal Information"
                  : "Partner Preferences"}
              </h2>

              <p>
                {activeTab === "personal"
                  ? "Tell us more about yourself."
                  : "Tell us what you are looking for in a life partner."}
              </p>
            </div>

            {!isEditing && (
              <button
                type="button"
                className="mp-small-edit"
                onClick={() => {
                  setIsEditing(true);
                  setMessage("");
                }}
              >
                ✏️ Edit
              </button>
            )}
          </div>

          {message && (
            <div className="mp-message" role="status">
              {message}
            </div>
          )}

          <form onSubmit={handleSave}>
            {activeTab === "personal" ? (
              <>
                <h3 className="mp-section-title">Basic Details</h3>

                <div className="mp-grid">
                  <label>
                    Full Name *
                    <input
                      name="fullName"
                      value={profile.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                      disabled={!isEditing}
                    />
                  </label>

                  <label>
                    Age *
                    <input
                      name="age"
                      type="number"
                      min="18"
                      max="100"
                      value={profile.age}
                      onChange={handleChange}
                      placeholder="Enter your age"
                      required
                      disabled={!isEditing}
                    />
                  </label>

                  <label>
                    Gender *
                    <select
                      name="gender"
                      value={profile.gender}
                      onChange={handleChange}
                      required
                      disabled={!isEditing}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </label>

                  <label>
                    Marital Status
                    <select
                      name="maritalStatus"
                      value={profile.maritalStatus}
                      onChange={handleChange}
                      disabled={!isEditing}
                    >
                      <option value="">Select status</option>
                      <option value="Never Married">Never Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Awaiting Divorce">
                        Awaiting Divorce
                      </option>
                    </select>
                  </label>

                  <label>
                    Religion
                    <input
                      name="religion"
                      value={profile.religion}
                      onChange={handleChange}
                      placeholder="Enter religion"
                      disabled={!isEditing}
                    />
                  </label>

                  <label>
                    Community
                    <input
                      name="community"
                      value={profile.community}
                      onChange={handleChange}
                      placeholder="Enter community"
                      disabled={!isEditing}
                    />
                  </label>
                </div>

                <h3 className="mp-section-title">Education & Career</h3>

                <div className="mp-grid">
                  <label>
                    Education
                    <input
                      name="education"
                      value={profile.education}
                      onChange={handleChange}
                      placeholder="Your qualification"
                      disabled={!isEditing}
                    />
                  </label>

                  <label>
                    Profession
                    <input
                      name="profession"
                      value={profile.profession}
                      onChange={handleChange}
                      placeholder="Your occupation"
                      disabled={!isEditing}
                    />
                  </label>

                  <label>
                    Annual Income
                    <input
                      name="income"
                      value={profile.income}
                      onChange={handleChange}
                      placeholder="e.g. ₹5–8 lakh"
                      disabled={!isEditing}
                    />
                  </label>

                  <label>
                    City / Village
                    <input
                      name="location"
                      value={profile.location}
                      onChange={handleChange}
                      placeholder="Enter your location"
                      disabled={!isEditing}
                    />
                  </label>
                </div>

                <h3 className="mp-section-title">About Me</h3>

                <label className="mp-full-field">
                  Tell us about yourself
                  <textarea
                    name="about"
                    value={profile.about}
                    onChange={handleChange}
                    placeholder="Write about your personality, interests, family and lifestyle..."
                    rows="5"
                    disabled={!isEditing}
                  />
                </label>
              </>
            ) : (
              <>
                <h3 className="mp-section-title">
                  Your Ideal Life Partner
                </h3>

                <div className="mp-grid">
                  <label>
                    Preferred Age Range
                    <input
                      name="partnerAge"
                      value={profile.partnerAge}
                      onChange={handleChange}
                      placeholder="e.g. 25–30"
                      disabled={!isEditing}
                    />
                  </label>

                  <label>
                    Preferred Location
                    <input
                      name="partnerLocation"
                      value={profile.partnerLocation}
                      onChange={handleChange}
                      placeholder="City, state or anywhere"
                      disabled={!isEditing}
                    />
                  </label>

                  <label>
                    Preferred Education
                    <input
                      name="partnerEducation"
                      value={profile.partnerEducation}
                      onChange={handleChange}
                      placeholder="Preferred qualification"
                      disabled={!isEditing}
                    />
                  </label>

                  <label>
                    Preferred Profession
                    <input
                      name="partnerProfession"
                      value={profile.partnerProfession}
                      onChange={handleChange}
                      placeholder="Preferred occupation"
                      disabled={!isEditing}
                    />
                  </label>
                </div>

                <p className="mp-help">
                  These preferences can be used later when connecting this
                  profile to the Wowmate matching system.
                </p>
              </>
            )}

            {isEditing && (
              <div className="mp-form-actions">
                <button
                  type="submit"
                  className="mp-save-button"
                >
                  💾 Save Profile
                </button>

                <button
                  type="button"
                  className="mp-cancel-button"
                  onClick={() => {
                    try {
                      const saved = localStorage.getItem(
                        "apnishaadiMyProfile"
                      );

                      setProfile(
                        saved
                          ? {
                              fullName: "",
                              age: "",
                              gender: "",
                              maritalStatus: "",
                              religion: "",
                              community: "",
                              profession: "",
                              education: "",
                              location: "",
                              income: "",
                              about: "",
                              partnerAge: "",
                              partnerLocation: "",
                              partnerEducation: "",
                              partnerProfession: "",
                              ...JSON.parse(saved),
                            }
                          : {
                              fullName: "",
                              age: "",
                              gender: "",
                              maritalStatus: "",
                              religion: "",
                              community: "",
                              profession: "",
                              education: "",
                              location: "",
                              income: "",
                              about: "",
                              partnerAge: "",
                              partnerLocation: "",
                              partnerEducation: "",
                              partnerProfession: "",
                            }
                      );
                    } catch {
                      setMessage("Unable to restore saved details.");
                    }

                    setIsEditing(false);
                    setMessage("");
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </section>
      </div>

      <footer className="mp-footer">
        <Link to="/">← Back to Home</Link>
        <span>© 2026 Wowmate. Rishton Ki Nayi Shuruaat.</span>
      </footer>
    </main>
  );
}