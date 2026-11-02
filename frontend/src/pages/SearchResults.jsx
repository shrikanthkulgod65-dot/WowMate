
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const normalize = (value) =>
  String(value ?? "").trim().toLowerCase();

function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return 0;

  const birthDate = new Date(dateOfBirth);

  if (Number.isNaN(birthDate.getTime())) return 0;

  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const birthdayNotReached =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate());

  if (birthdayNotReached) age--;

  return age >= 0 ? age : 0;
}

function normalizeProfile(profile) {
  const user =
    profile.user && typeof profile.user === "object"
      ? profile.user
      : {};

  const fullName =
    profile.fullName ||
    profile.name ||
    user.fullName ||
    "Wowmate Member";

  const occupation =
    profile.occupation ||
    profile.profession ||
    "Not specified";

  const rawCategory = normalize(
    profile.category || profile.matrimonyCategory
  );

  const category = rawCategory.includes("farm")
    ? "farmer"
    : rawCategory.includes("professional")
      ? "professional"
      : normalize(occupation).match(/farmer|agricultur/)
        ? "farmer"
        : "professional";

  const rawGender = normalize(profile.gender);

  const gender =
    rawGender === "female" || rawGender === "bride"
      ? "Bride"
      : rawGender === "male" || rawGender === "groom"
        ? "Groom"
        : profile.gender || "Member";

  const dateOfBirth = profile.dateOfBirth;

  const age =
    Number(profile.age) > 0
      ? Number(profile.age)
      : calculateAge(dateOfBirth);

  const photos = Array.isArray(profile.photos)
    ? profile.photos
    : [];

  const image =
    profile.profilePhoto ||
    profile.image ||
    photos[0] ||
    "";

  return {
    id: profile._id || profile.id || user._id || fullName,
    name: fullName,
    age,
    profession: occupation,
    location:
      profile.city ||
      profile.location ||
      [profile.state, profile.country].filter(Boolean).join(", "),
    education: profile.education || "Not specified",
    category,
    gender,
    image,
  };
}

function extractProfiles(responseData) {
  if (Array.isArray(responseData)) {
    return responseData;
  }

  if (Array.isArray(responseData?.profiles)) {
    return responseData.profiles;
  }

  if (Array.isArray(responseData?.data)) {
    return responseData.data;
  }

  if (Array.isArray(responseData?.results)) {
    return responseData.results;
  }

  return [];
}

function buildSearchQuery(searchParams) {
  const params = new URLSearchParams();

  const minAge = searchParams.get("minAge");
  const maxAge = searchParams.get("maxAge");
  const lookingFor = searchParams.get("lookingFor");
  const category = searchParams.get("category");
  const profession = searchParams.get("profession");
  const location = searchParams.get("location");

  if (minAge) params.set("minAge", minAge);
  if (maxAge) params.set("maxAge", maxAge);

  if (lookingFor && lookingFor !== "Any") {
    const gender =
      normalize(lookingFor) === "bride"
        ? "Female"
        : normalize(lookingFor) === "groom"
          ? "Male"
          : lookingFor;

    params.set("gender", gender);
  }

  if (category) {
    params.set("category", category);
  }

  if (profession && profession !== "Any Profession") {
    params.set("occupation", profession);
  }

  if (location) {
    params.set("city", location);
  }

  params.set("page", searchParams.get("page") || "1");
  params.set("limit", searchParams.get("limit") || "12");

  return params.toString();
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();

  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalProfiles, setTotalProfiles] = useState(null);

  const searchQuery = useMemo(
    () => buildSearchQuery(searchParams),
    [searchParams]
  );

  const fetchProfiles = useCallback(
    async (signal) => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `${API_BASE_URL}/profile/search?${searchQuery}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            signal,
          }
        );

        let data;

        try {
          data = await response.json();
        } catch {
          throw new Error("The server returned an invalid response.");
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              `Unable to search profiles (${response.status}).`
          );
        }

        const results = extractProfiles(data).map(normalizeProfile);

        setProfiles(results);

        const total =
          data.pagination?.total ??
          data.total ??
          data.totalProfiles;

        setTotalProfiles(
          Number.isFinite(Number(total)) ? Number(total) : null
        );
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("Profile search failed:", err);

        setProfiles([]);
        setTotalProfiles(null);
        setError(
          err.message ||
            "Unable to load profiles. Please try again."
        );
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [searchQuery]
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchProfiles(controller.signal);

    return () => controller.abort();
  }, [fetchProfiles]);

  const filteredProfiles = useMemo(() => {
    const category = normalize(searchParams.get("category"));
    const lookingFor = normalize(
      searchParams.get("lookingFor") || "Bride"
    );
    const minAge = Number(searchParams.get("minAge") || 18);
    const maxAge = Number(searchParams.get("maxAge") || 40);
    const profession = normalize(
      searchParams.get("profession") || "Any Profession"
    );
    const location = normalize(searchParams.get("location"));

    return profiles.filter((profile) => {
      const profileCategory = normalize(profile.category);
      const profileGender = normalize(profile.gender);

      const matchesCategory =
        !category ||
        profileCategory === category ||
        profileCategory.includes(category);

      // Do not exclude profiles when their age is unavailable.
      const matchesAge =
        !profile.age ||
        (profile.age >= minAge && profile.age <= maxAge);

      const matchesProfession =
        profession === "any profession" ||
        normalize(profile.profession).includes(profession);

      const matchesLocation =
        !location ||
        normalize(profile.location).includes(location);

      const matchesLookingFor =
        lookingFor === "any" ||
        (lookingFor === "bride" && profileGender === "bride") ||
        (lookingFor === "groom" && profileGender === "groom");

      return (
        matchesCategory &&
        matchesAge &&
        matchesProfession &&
        matchesLocation &&
        matchesLookingFor
      );
    });
  }, [profiles, searchParams]);

  return (
    <main
      className="search-results-page"
      style={{
        padding: "48px 20px",
        minHeight: "60vh",
        background: "#fffafd",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <Link
            to="/"
            style={{
              color: "#6d28d9",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            ← Back to home
          </Link>
        </div>

        <h1 style={{ marginBottom: 10, color: "#2f1d2d" }}>
          Search Results
        </h1>

        <p style={{ marginBottom: 30, color: "#665864" }}>
          {loading
            ? "Searching compatible profiles..."
            : `Showing ${
                totalProfiles ?? filteredProfiles.length
              } compatible profile${
                (totalProfiles ?? filteredProfiles.length) === 1
                  ? ""
                  : "s"
              }.`}
        </p>

        {loading ? (
          <div
            role="status"
            style={{
              padding: 30,
              textAlign: "center",
              background: "#fff",
              borderRadius: 16,
              color: "#665864",
            }}
          >
            Loading profiles...
          </div>
        ) : error ? (
          <div
            role="alert"
            style={{
              background: "#fff7fa",
              border: "1px solid #f0d3df",
              borderRadius: 16,
              padding: 28,
              color: "#6d28d9",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Unable to load profiles</h2>

            <p>{error}</p>

            <button
              type="button"
              onClick={() => {
                const controller = new AbortController();
                fetchProfiles(controller.signal);
              }}
              style={{
                background: "#8b5cf6",
                color: "#fff",
                border: 0,
                borderRadius: 8,
                padding: "10px 18px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Try Again
            </button>
          </div>
        ) : filteredProfiles.length > 0 ? (
          <div style={{ display: "grid", gap: 20 }}>
            {filteredProfiles.map((profile) => (
              <article
                key={profile.id}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "180px minmax(0, 1fr)",
                  gap: 20,
                  background: "#fff",
                  border: "1px solid #f0d8e4",
                  borderRadius: 18,
                  padding: 20,
                  boxShadow:
                    "0 10px 28px rgba(76, 26, 50, 0.06)",
                }}
              >
                <div
                  style={{
                    borderRadius: 16,
                    background:
                      "linear-gradient(135deg, #f7d9e7, #ead9ff)",
                    minHeight: 170,
                    overflow: "hidden",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 800,
                    fontSize: 28,
                    color: "#4b1c39",
                  }}
                >
                  {profile.image ? (
                    <img
                      src={profile.image}
                      alt={`${profile.name}'s profile`}
                      style={{
                        width: "100%",
                        height: "100%",
                        minHeight: 170,
                        objectFit: "cover",
                        display: "block",
                      }}
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    profile.name.charAt(0).toUpperCase()
                  )}
                </div>

                <div>
                  <h2
                    style={{
                      margin: "0 0 8px",
                      fontSize: 28,
                      color: "#311b2d",
                    }}
                  >
                    {profile.name}
                  </h2>

                  <p style={{ margin: "0 0 8px", color: "#5f4961" }}>
                    {profile.age > 0
                      ? `${profile.age} years`
                      : "Age not specified"}
                    {" • "}
                    {profile.profession}
                    {" • "}
                    {profile.location || "Location not specified"}
                  </p>

                  <p style={{ margin: "0 0 12px", color: "#5f4961" }}>
                    Education: {profile.education}
                  </p>

                  <span
                    style={{
                      display: "inline-block",
                      background: "#f5f0ff",
                      color: "#6d28d9",
                      borderRadius: 999,
                      padding: "6px 12px",
                      fontWeight: 700,
                      fontSize: 12,
                      textTransform: "uppercase",
                    }}
                  >
                    {profile.category}
                  </span>

                  {profile.gender &&
                    profile.gender !== "Member" && (
                      <span
                        style={{
                          display: "inline-block",
                          marginLeft: 8,
                          background: "#f1eafa",
                          color: "#613b7b",
                          borderRadius: 999,
                          padding: "6px 12px",
                          fontWeight: 700,
                          fontSize: 12,
                        }}
                      >
                        {profile.gender}
                      </span>
                    )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div
            style={{
              background: "#fff7fa",
              border: "1px solid #f0d3df",
              borderRadius: 16,
              padding: 28,
              color: "#4a2b3a",
            }}
          >
            No profiles match your current filters. Try widening the
            age or location range.
          </div>
        )}

        <p
          style={{
            marginTop: 24,
            fontSize: 12,
            color: "#8a7784",
            lineHeight: 1.6,
          }}
        >
          Profiles are loaded from the Wowmate backend. Only
          profiles returned by the search API are displayed.
        </p>
      </div>
    </main>
  );
}
