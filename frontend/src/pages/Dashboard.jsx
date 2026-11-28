
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Users,
  Eye,
  MessageCircle,
  UserRound,
  Settings,
  LogOut,
  Camera,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  MapPin,
  BriefcaseBusiness,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";

import {
  sendInterest as sendInterestRequest,
  getSentInterests,
} from "../services/interestService.js";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://wowmate.co.in/api"
).replace(/\/+$/, "");

const initialActivity = [
  {
    id: 1,
    icon: Eye,
    title: "Profile visibility",
    description: "Your profile can be discovered by other members.",
    time: "Profile settings",
  },
  {
    id: 2,
    icon: Heart,
    title: "Find your match",
    description: "Explore profiles that match your preferences.",
    time: "Discover profiles",
  },
  {
    id: 3,
    icon: ShieldCheck,
    title: "Complete your profile",
    description: "Add your details to help others know you better.",
    time: "Profile completion",
  },
];

function getAuthToken() {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
}

function readStoredUser() {
  try {
    const storedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

function calculateAge(dateOfBirth) {
  if (!dateOfBirth) return null;

  const birthDate = new Date(dateOfBirth);

  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();

  let age =
    today.getFullYear() - birthDate.getFullYear();

  const monthDifference =
    today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 &&
      today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age >= 18 && age <= 100 ? age : null;
}

// Normalize real profiles returned by the backend.
function mapDiscoverProfile(profile) {
  const user = profile?.user;

  const userId =
    typeof user === "string"
      ? user
      : user?._id ||
        user?.id ||
        profile?.userId;

  const fullName =
    typeof user === "object" && user
      ? user.fullName || user.name
      : profile?.fullName || profile?.name;

  const location = [
    profile?.city,
    profile?.state,
    profile?.country,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    ...profile,

    // Profile document ID is used for contact unlocking.
    profileId: String(
      profile?._id ||
        profile?.profileId ||
        profile?.id ||
        ""
    ),

    // User ID is used for sending interests.
    id: String(userId || profile?._id || ""),
    user: userId ? String(userId) : "",
    userId: userId ? String(userId) : "",

    name: fullName || "Wowmate Member",
    age: calculateAge(profile?.dateOfBirth),
    location: location || "Location not added",
    profession: profile?.occupation || "Occupation not added",
    education: profile?.education || "Education not added",

    // Do not display another person's stock photo as a member photo.
    image: profile?.profilePhoto || "",

    contactUnlocked: profile?.contactUnlocked === true,
    contactDetails: null,
    compatibility: null,
  };
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(readStoredUser);
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [matches, setMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [matchesError, setMatchesError] = useState("");
  const [sentInterests, setSentInterests] = useState([]);
  const [interestLoadingId, setInterestLoadingId] = useState(null);
  const [notice, setNotice] = useState("");

  // Subscription contact credits.
  const [contactUnlockLimit, setContactUnlockLimit] = useState(0);
  const [contactUnlocksUsed, setContactUnlocksUsed] = useState(0);
  const [contactUnlocksRemaining, setContactUnlocksRemaining] =
    useState(0);
  const [contactLoadingId, setContactLoadingId] = useState(null);

  // Check subscription before opening Discover Profiles.
  const handleProtectedDiscover = async (event) => {
    event.preventDefault();

    const token = getAuthToken();

    if (!token) {
      navigate("/subscription-plans");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/subscriptions/me`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.active === true) {
        navigate("/discover");
      } else {
        navigate("/subscription-plans");
      }
    } catch (error) {
      console.error(
        "Subscription verification failed:",
        error
      );

      navigate("/subscription-plans");
    }
  };

  // Load only registered member profiles from the backend.
  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      setMatches([]);
      setMatchesLoading(false);
      setMatchesError(
        "Please log in to view registered member profiles."
      );

      return undefined;
    }

    let isMounted = true;

    const loadDiscoverProfiles = async () => {
      try {
        setMatchesLoading(true);
        setMatchesError("");

        const response = await fetch(
          `${API_BASE_URL}/profile/discover`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json().catch(() => ({}));
        const payload = data.data || data;

        if (!response.ok) {
          throw new Error(
            data.message ||
              `Unable to load profiles (${response.status}).`
          );
        }

        const profiles = Array.isArray(payload.profiles)
          ? payload.profiles
          : [];

        if (isMounted) {
          setContactUnlockLimit(
            Number(payload.contactUnlockLimit || 0)
          );

          setContactUnlocksUsed(
            Number(payload.contactUnlocksUsed || 0)
          );

          setContactUnlocksRemaining(
            Number(payload.contactUnlocksRemaining || 0)
          );

          const currentUser = readStoredUser();

          const currentUserId = String(
            currentUser?._id ||
              currentUser?.id ||
              currentUser?.userId ||
              ""
          );

          const mappedProfiles = profiles
            .map(mapDiscoverProfile)
            .filter(
              (profile) =>
                profile.user &&
                /^[a-f\d]{24}$/i.test(profile.user) &&
                profile.user !== currentUserId &&
                /^[a-f\d]{24}$/i.test(profile.profileId)
            );

          setMatches(mappedProfiles);
        }
      } catch (error) {
        if (isMounted) {
          setMatches([]);
          setMatchesError(
            error.message ||
              "Unable to load registered profiles. Please try again."
          );
        }
      } finally {
        if (isMounted) {
          setMatchesLoading(false);
        }
      }
    };

    loadDiscoverProfiles();

    return () => {
      isMounted = false;
    };
  }, []);

  // Load interests already sent by the logged-in member.
  useEffect(() => {
    if (!getAuthToken()) {
      return undefined;
    }

    let isMounted = true;

    getSentInterests()
      .then((response) => {
        if (!isMounted) return;

        const interests = Array.isArray(response)
          ? response
          : response.interests || [];

        const receiverIds = interests
          .map((item) => {
            const receiver = item.receiver;

            return typeof receiver === "string"
              ? receiver
              : receiver?._id || receiver?.id;
          })
          .filter(Boolean)
          .map(String);

        setSentInterests(receiverIds);
      })
      .catch((error) => {
        if (isMounted) {
          setNotice(
            error.message || "Unable to load sent interests."
          );
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Refresh stored account information after login/logout.
  useEffect(() => {
    const updateUser = () => {
      setUser(readStoredUser());
    };

    window.addEventListener("authChanged", updateUser);

    return () => {
      window.removeEventListener("authChanged", updateUser);
    };
  }, []);

  const displayName =
    user?.fullName ||
    user?.name ||
    user?.firstName ||
    "Member";

  const email = user?.email || "";

  const profileCompletion = user?.profileCompletion || 35;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    window.dispatchEvent(new Event("authChanged"));

    navigate("/", { replace: true });
  };

  const toggleSave = (profileId) => {
    setSavedProfiles((previous) =>
      previous.includes(profileId)
        ? previous.filter((id) => id !== profileId)
        : [...previous, profileId]
    );
  };

  // Send interest to a real registered member.
  const handleSendInterest = async (profile) => {
    const token = getAuthToken();

    if (!token) {
      setNotice("Please log in to express interest.");
      return;
    }

    const receiverId =
      typeof profile.user === "string"
        ? profile.user
        : profile.user?._id || profile.userId;

    if (
      !receiverId ||
      !/^[a-f\d]{24}$/i.test(String(receiverId))
    ) {
      setNotice(
        "This profile is missing a valid registered member ID. Please refresh the profiles or contact support."
      );

      return;
    }

    const normalizedReceiverId = String(receiverId);

    if (sentInterests.includes(normalizedReceiverId)) {
      setNotice("You have already sent interest to this member.");
      return;
    }

    if (interestLoadingId === profile.id) {
      return;
    }

    try {
      setInterestLoadingId(profile.id);
      setNotice("");

      const response = await sendInterestRequest(
        normalizedReceiverId
      );

      setSentInterests((previous) =>
        previous.includes(normalizedReceiverId)
          ? previous
          : [...previous, normalizedReceiverId]
      );

      setNotice(
        response.message || "Interest sent successfully."
      );
    } catch (error) {
      setNotice(
        error.message ||
          "Unable to send interest. Please try again."
      );
    } finally {
      setInterestLoadingId(null);
    }
  };

  // Unlock a registered member's phone/email using the active subscription.
  const handleUnlockContact = async (profile) => {
    const token = getAuthToken();

    if (!token) {
      setNotice("Please log in to unlock contact details.");
      return;
    }

    const profileId = String(profile.profileId || "");

    if (!/^[a-f\d]{24}$/i.test(profileId)) {
      setNotice("Invalid profile ID. Please refresh the profiles.");
      return;
    }

    if (contactLoadingId === profile.id) {
      return;
    }

    if (
      !profile.contactUnlocked &&
      contactUnlocksRemaining <= 0
    ) {
      setNotice(
        "You have used all your contact unlock credits. Please upgrade your subscription."
      );

      return;
    }

    try {
      setContactLoadingId(profile.id);
      setNotice("");

      const response = await fetch(
        `${API_BASE_URL}/profile/${encodeURIComponent(
          profileId
        )}/contact-unlock`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to unlock contact details."
        );
      }

      const updatedProfile = {
        ...profile,
        contactUnlocked: true,
        contactDetails: data.contact || {},
      };

      setMatches((previous) =>
        previous.map((item) =>
          item.profileId === profileId
            ? updatedProfile
            : item
        )
      );

      if (typeof data.usage?.limit === "number") {
        setContactUnlockLimit(data.usage.limit);
      }

      if (typeof data.usage?.used === "number") {
        setContactUnlocksUsed(data.usage.used);
      } else if (!data.alreadyUnlocked) {
        setContactUnlocksUsed((current) => current + 1);
      }

      if (typeof data.usage?.remaining === "number") {
        setContactUnlocksRemaining(data.usage.remaining);
      } else if (!data.alreadyUnlocked) {
        setContactUnlocksRemaining((current) =>
          Math.max(0, current - 1)
        );
      }

      setNotice(
        data.alreadyUnlocked
          ? "Previously unlocked contact details loaded."
          : "Contact details unlocked successfully."
      );
    } catch (error) {
      setNotice(
        error.message || "Unable to unlock contact details."
      );
    } finally {
      setContactLoadingId(null);
    }
  };

  return (
    <div className="as-dashboard">
      <style>{`
        .as-dashboard {
          min-height: 100vh;
          background: #fff8f7;
          color: #332329;
          font-family: Arial, Helvetica, sans-serif;
        }

        .as-dashboard * {
          box-sizing: border-box;
        }

        .as-dash-main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 30px 5% 55px;
        }

        .as-dash-welcome {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          padding: 32px;
          overflow: hidden;
          border-radius: 22px;
          background: linear-gradient(115deg, #6d28d9, #8b5cf6);
          color: white;
        }

        .as-dash-welcome-label {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 13px;
          color: #ffe5ec;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .as-dash-welcome h1 {
          margin: 0 0 12px;
          font-size: clamp(26px, 3vw, 38px);
          letter-spacing: -1px;
        }

        .as-dash-welcome p {
          max-width: 570px;
          margin: 0;
          color: #ffe7ed;
          font-size: 14px;
          line-height: 1.8;
        }

        .as-dash-welcome-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          flex-shrink: 0;
          padding: 14px 19px;
          border-radius: 11px;
          background: white;
          color: #6732b8;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
        }

        .as-dash-section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin: 33px 0 18px;
        }

        .as-dash-section-heading h2 {
          margin: 0 0 7px;
          font-size: 21px;
          letter-spacing: -0.4px;
        }

        .as-dash-section-heading p {
          margin: 0;
          color: #977c85;
          font-size: 13px;
          line-height: 1.6;
        }

        .as-dash-text-link {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #6d28d9;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          white-space: nowrap;
        }

        .as-dash-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 17px;
        }

        .as-dash-stat {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          min-width: 0;
          padding: 22px 18px;
          border: 1px solid #f1e5e7;
          border-radius: 16px;
          background: white;
        }

        .as-dash-stat-icon {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 45px;
          height: 45px;
          border-radius: 13px;
          background: #f5f0ff;
          color: #6d28d9;
        }

        .as-dash-stat:nth-child(2) .as-dash-stat-icon {
          background: #e9f2ff;
          color: #376eb5;
        }

        .as-dash-stat:nth-child(3) .as-dash-stat-icon {
          background: #e8f7ed;
          color: #24824a;
        }

        .as-dash-stat:nth-child(4) .as-dash-stat-icon {
          background: #fff2df;
          color: #b26a16;
        }

        .as-dash-stat-value {
          margin: 1px 0 7px;
          font-size: 27px;
          font-weight: 800;
          line-height: 1;
        }

        .as-dash-stat-label {
          color: #806d73;
          font-size: 12px;
          line-height: 1.5;
        }

        .as-dash-columns {
          display: grid;
          grid-template-columns: minmax(0, 1.7fr) minmax(270px, 0.85fr);
          align-items: start;
          gap: 22px;
        }

        .as-dash-panel {
          min-width: 0;
          padding: 23px;
          border: 1px solid #f1e5e7;
          border-radius: 17px;
          background: white;
        }

        .as-dash-panel-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 22px;
        }

        .as-dash-panel-heading h3 {
          margin: 0 0 6px;
          font-size: 17px;
        }

        .as-dash-panel-heading p {
          margin: 0;
          color: #907b82;
          font-size: 12px;
        }

        .as-dash-match-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .as-dash-match-card {
          overflow: hidden;
          border: 1px solid #f0e5e7;
          border-radius: 14px;
          background: #fff;
        }

        .as-dash-match-photo {
          position: relative;
          height: 170px;
          overflow: hidden;
          background: #f8e8ed;
        }

        .as-dash-match-photo img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .as-dash-no-photo {
          display: flex;
          width: 100%;
          height: 100%;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 9px;
          background: #f3eefb;
          color: #806c9c;
          font-size: 12px;
          font-weight: 600;
        }

        .as-dash-compatibility {
          position: absolute;
          left: 9px;
          bottom: 9px;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 8px;
          border-radius: 20px;
          background: white;
          color: #6d28d9;
          font-size: 10px;
          font-weight: 800;
        }

        .as-dash-save {
          position: absolute;
          top: 9px;
          right: 9px;
          display: grid;
          place-items: center;
          width: 33px;
          height: 33px;
          border: 0;
          border-radius: 50%;
          background: white;
          color: #6d28d9;
          cursor: pointer;
        }

        .as-dash-match-body {
          padding: 13px;
        }

        .as-dash-match-body h4 {
          margin: 0 0 8px;
          font-size: 15px;
        }

        .as-dash-match-detail {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          margin-bottom: 7px;
          color: #8b777e;
          font-size: 11px;
          line-height: 1.5;
        }

        .as-dash-match-detail svg {
          flex-shrink: 0;
          margin-top: 1px;
        }

        .as-dash-interest-button {
          width: 100%;
          margin-top: 9px;
          padding: 10px 7px;
          border: 1px solid #8b5cf6;
          border-radius: 9px;
          background: #8b5cf6;
          color: white;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .as-dash-interest-button.sent {
          background: #f5f0ff;
          color: #6d28d9;
        }

        .as-dash-interest-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .as-dash-contact-button {
          width: 100%;
          margin-top: 9px;
          padding: 10px 7px;
          border: 1px solid #8b5cf6;
          border-radius: 9px;
          background: #f5f0ff;
          color: #6d28d9;
          font-size: 11px;
          font-weight: 750;
          cursor: pointer;
        }

        .as-dash-contact-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .as-dash-contact-box {
          margin-top: 9px;
          padding: 11px;
          border: 1px solid #ddd6fe;
          border-radius: 9px;
          background: #faf8ff;
          color: #43305f;
          font-size: 11px;
          line-height: 1.7;
          overflow-wrap: anywhere;
        }

        .as-dash-contact-box p {
          margin: 4px 0;
        }

        .as-dash-contact-balance {
          margin: 0 0 15px;
          padding: 11px 13px;
          border: 1px solid #e7ddff;
          border-radius: 10px;
          background: #faf8ff;
          color: #6d28d9;
          font-size: 12px;
          font-weight: 700;
        }

        .as-dash-profile-progress {
          margin-bottom: 25px;
          padding: 19px;
          border: 1px solid #f1e5e7;
          border-radius: 15px;
          background: #fff;
        }

        .as-dash-progress-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
        }

        .as-dash-progress-top strong {
          font-size: 14px;
        }

        .as-dash-progress-top span {
          color: #6d28d9;
          font-size: 13px;
          font-weight: 800;
        }

        .as-dash-progress-track {
          height: 8px;
          overflow: hidden;
          border-radius: 20px;
          background: #f5e9ec;
        }

        .as-dash-progress-fill {
          height: 100%;
          border-radius: 20px;
          background: #8b5cf6;
        }

        .as-dash-progress-note {
          margin: 12px 0 15px;
          color: #8a757c;
          font-size: 12px;
          line-height: 1.6;
        }

        .as-dash-outline-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          width: 100%;
          padding: 11px;
          border: 1px solid #ead5dc;
          border-radius: 10px;
          background: #fff;
          color: #6d28d9;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
        }

        .as-dash-activity-list {
          display: grid;
          gap: 18px;
        }

        .as-dash-activity {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .as-dash-activity-icon {
          display: grid;
          place-items: center;
          flex-shrink: 0;
          width: 38px;
          height: 38px;
          border-radius: 11px;
          background: #f5f0ff;
          color: #6d28d9;
        }

        .as-dash-activity strong {
          display: block;
          margin: 1px 0 5px;
          font-size: 12px;
        }

        .as-dash-activity p {
          margin: 0 0 6px;
          color: #8b777e;
          font-size: 11px;
          line-height: 1.6;
        }

        .as-dash-activity span {
          color: #6d28d9;
          font-size: 10px;
          font-weight: 700;
        }

        .as-dash-notice {
          margin-top: 17px;
          padding: 12px 14px;
          border: 1px solid #e9d3dc;
          border-radius: 10px;
          background: #fff;
          color: #8e183d;
          font-size: 12px;
          line-height: 1.6;
        }

        .as-dash-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 20px 5%;
          border-top: 1px solid #f0e4e7;
          background: #fff;
          color: #907b82;
          font-size: 11px;
        }

        .as-dash-footer-links {
          display: flex;
          gap: 17px;
        }

        .as-dash-footer a {
          color: #806d73;
          text-decoration: none;
        }

        @media (max-width: 1100px) {
          .as-dash-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .as-dash-columns {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .as-dash-welcome {
            align-items: flex-start;
            flex-direction: column;
            padding: 25px 21px;
          }

          .as-dash-match-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 480px) {
          .as-dash-main {
            padding: 20px 14px 35px;
          }

          .as-dash-stats {
            gap: 10px;
          }

          .as-dash-stat {
            gap: 10px;
            padding: 15px 12px;
          }

          .as-dash-stat-icon {
            width: 37px;
            height: 37px;
          }

          .as-dash-stat-value {
            font-size: 23px;
          }

          .as-dash-match-grid {
            grid-template-columns: 1fr;
          }

          .as-dash-match-photo {
            height: 220px;
          }

          .as-dash-panel {
            padding: 16px;
          }

          .as-dash-footer {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>

      <main className="as-dash-main">
        <section className="as-dash-welcome">
          <div>
            <div className="as-dash-welcome-label">
              <Sparkles size={15} />
              Your matrimony journey
            </div>

            <h1>Welcome back, {displayName}!</h1>

            <p>
              Your journey to finding a life partner continues here.
              Discover profiles, explore compatible matches, and take
              the next step toward your future together.
            </p>
          </div>

          <Link
            to="/subscription-plans"
            className="as-dash-welcome-button"
            onClick={handleProtectedDiscover}
          >
            Discover Matches
            <ChevronRight size={17} />
          </Link>
        </section>

        <section>
          <div className="as-dash-section-heading">
            <div>
              <h2>Your dashboard</h2>
              <p>
                Here is a quick overview of your matrimony activity.
              </p>
            </div>

            <Link to="/my-profile" className="as-dash-text-link">
              View profile <ChevronRight size={16} />
            </Link>
          </div>

          <div className="as-dash-stats">
            <div className="as-dash-stat">
              <div className="as-dash-stat-icon">
                <Users size={21} />
              </div>

              <div>
                <div className="as-dash-stat-value">
                  {matches.length}
                </div>

                <div className="as-dash-stat-label">
                  Suggested matches
                </div>
              </div>
            </div>

            <div className="as-dash-stat">
              <div className="as-dash-stat-icon">
                <Heart size={21} />
              </div>

              <div>
                <div className="as-dash-stat-value">
                  {savedProfiles.length}
                </div>

                <div className="as-dash-stat-label">
                  Saved profiles
                </div>
              </div>
            </div>

            <div className="as-dash-stat">
              <div className="as-dash-stat-icon">
                <MessageCircle size={21} />
              </div>

              <div>
                <div className="as-dash-stat-value">
                  {sentInterests.length}
                </div>

                <div className="as-dash-stat-label">
                  Interests sent
                </div>
              </div>
            </div>

            <div className="as-dash-stat">
              <div className="as-dash-stat-icon">
                <Eye size={21} />
              </div>

              <div>
                <div className="as-dash-stat-value">—</div>

                <div className="as-dash-stat-label">
                  Profile views
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="as-dash-section-heading">
          <div>
            <h2>Find your compatible match</h2>

            <p>
              Explore profiles of registered members from our database.
            </p>
          </div>

          <Link
            to="/subscription-plans"
            className="as-dash-text-link"
            onClick={handleProtectedDiscover}
          >
            View all <ChevronRight size={16} />
          </Link>
        </div>

        <div className="as-dash-columns">
          <section className="as-dash-panel">
            <div className="as-dash-panel-heading">
              <div>
                <h3>Recommended profiles</h3>
                <p>Suggestions for your matrimony journey</p>
              </div>

              <Sparkles size={20} color="#8b5cf6" />
            </div>

            {contactUnlockLimit > 0 && (
              <div className="as-dash-contact-balance">
                Contact unlocks remaining:{" "}
                {contactUnlocksRemaining} / {contactUnlockLimit}
                {" · "}
                Used: {contactUnlocksUsed}
              </div>
            )}

            {matchesLoading && (
              <p className="as-dash-match-detail">
                Loading registered profiles...
              </p>
            )}

            {matchesError && (
              <p className="as-dash-match-detail" role="alert">
                {matchesError}
              </p>
            )}

            {!matchesLoading &&
              !matchesError &&
              matches.length === 0 && (
                <p className="as-dash-match-detail">
                  No registered profiles are available yet. New members
                  will appear here after completing their profiles.
                </p>
              )}

            <div className="as-dash-match-grid">
              {matches.map((profile) => {
                const isSaved = savedProfiles.includes(profile.id);

                const receiverId =
                  typeof profile.user === "string"
                    ? profile.user
                    : profile.user?._id || profile.userId;

                const interestSent =
                  Boolean(receiverId) &&
                  sentInterests.includes(String(receiverId));

                const interestLoading =
                  interestLoadingId === profile.id;

                const contactLoading =
                  contactLoadingId === profile.id;

                return (
                  <article
                    className="as-dash-match-card"
                    key={profile.id}
                  >
                    <div className="as-dash-match-photo">
                      {profile.image ? (
                        <img
                          src={profile.image}
                          alt={profile.name}
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="as-dash-no-photo"
                          role="img"
                          aria-label="No profile photo"
                        >
                          <UserRound size={42} />
                          <span>No photo uploaded</span>
                        </div>
                      )}

                      <span className="as-dash-compatibility">
                        <CheckCircle2 size={12} />
                        Registered member
                      </span>

                      <button
                        type="button"
                        className="as-dash-save"
                        aria-label={
                          isSaved
                            ? "Remove saved profile"
                            : "Save profile"
                        }
                        onClick={() => toggleSave(profile.id)}
                      >
                        <Heart
                          size={17}
                          fill={isSaved ? "currentColor" : "none"}
                        />
                      </button>
                    </div>

                    <div className="as-dash-match-body">
                      <h4>
                        {profile.name}
                        {profile.age ? `, ${profile.age}` : ""}
                      </h4>

                      <div className="as-dash-match-detail">
                        <MapPin size={13} />
                        {profile.location}
                      </div>

                      <div className="as-dash-match-detail">
                        <BriefcaseBusiness size={13} />
                        {profile.profession}
                      </div>

                      <div className="as-dash-match-detail">
                        <GraduationCap size={13} />
                        {profile.education}
                      </div>

                      <button
                        type="button"
                        className={`as-dash-interest-button ${
                          interestSent ? "sent" : ""
                        }`}
                        onClick={() => handleSendInterest(profile)}
                        disabled={interestSent || interestLoading}
                        aria-busy={interestLoading}
                        title="Send interest"
                      >
                        {interestLoading
                          ? "Sending..."
                          : interestSent
                            ? "Interest Sent"
                            : "Show Interest"}
                      </button>

                      <button
                        type="button"
                        className="as-dash-contact-button"
                        onClick={() =>
                          handleUnlockContact(profile)
                        }
                        disabled={
                          contactLoading ||
                          (
                            !profile.contactUnlocked &&
                            contactUnlocksRemaining <= 0
                          )
                        }
                      >
                        {contactLoading
                          ? "Unlocking..."
                          : profile.contactUnlocked
                            ? "View Contact"
                            : contactUnlocksRemaining > 0
                              ? "Unlock Contact"
                              : "No Unlocks Remaining"}
                      </button>

                      {profile.contactUnlocked &&
                        profile.contactDetails && (
                          <div className="as-dash-contact-box">
                            <strong>Contact Information</strong>

                            <p>
                              Email:{" "}
                              {profile.contactDetails.email ||
                                "Not available"}
                            </p>

                            <p>
                              Mobile:{" "}
                              {profile.contactDetails.mobile ||
                                "Not available"}
                            </p>
                          </div>
                        )}
                    </div>
                  </article>
                );
              })}
            </div>

            {notice && (
              <div className="as-dash-notice" role="status">
                {notice}
              </div>
            )}
          </section>

          <aside>
            <section className="as-dash-profile-progress">
              <div className="as-dash-panel-heading">
                <div>
                  <h3>Profile completion</h3>
                  <p>Make your profile stand out</p>
                </div>

                <UserRound size={21} color="#8b5cf6" />
              </div>

              <div className="as-dash-progress-top">
                <strong>Your profile</strong>
                <span>{profileCompletion}%</span>
              </div>

              <div className="as-dash-progress-track">
                <div
                  className="as-dash-progress-fill"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(
                        0,
                        Number(profileCompletion) || 0
                      )
                    )}%`,
                  }}
                />
              </div>

              <p className="as-dash-progress-note">
                Complete your personal details and preferences to help
                potential matches get to know you better.
              </p>

              <Link
                to="/my-profile"
                className="as-dash-outline-button"
              >
                <Camera size={15} />
                Complete My Profile
              </Link>
            </section>

            <section className="as-dash-panel">
              <div className="as-dash-panel-heading">
                <div>
                  <h3>Quick actions</h3>
                  <p>Manage your account</p>
                </div>

                <Settings size={19} color="#8b5cf6" />
              </div>

              <div className="as-dash-activity-list">
                {initialActivity.map((activity) => {
                  const ActivityIcon = activity.icon;

                  return (
                    <div
                      className="as-dash-activity"
                      key={activity.id}
                    >
                      <div className="as-dash-activity-icon">
                        <ActivityIcon size={18} />
                      </div>

                      <div>
                        <strong>{activity.title}</strong>
                        <p>{activity.description}</p>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {email && (
                <div className="as-dash-notice">
                  <CheckCircle2
                    size={15}
                    style={{
                      verticalAlign: "middle",
                      marginRight: 6,
                    }}
                  />
                  Signed in as {email}
                </div>
              )}

              <button
                type="button"
                className="as-dash-outline-button"
                style={{ marginTop: 20, cursor: "pointer" }}
                onClick={handleLogout}
              >
                <LogOut size={15} />
                Log Out
              </button>
            </section>
          </aside>
        </div>
      </main>

      <footer className="as-dash-footer">
        <span>
          © {new Date().getFullYear()} Wowmate. All rights reserved.
        </span>

        <div className="as-dash-footer-links">
          <Link to="/privacy-policy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
