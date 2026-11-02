import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const initialBrokers = [
  {
    id: 1,
    name: "Rajesh Patil",
    city: "Belagavi",
    experience: "8 years",
    bureau: "Patil Marriage Bureau",
    phone: "9876543210",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500",
    about:
      "Helping families find suitable matrimonial matches with care and trust.",
  },
  {
    id: 2,
    name: "Suresh Kulkarni",
    city: "Dharwad",
    experience: "5 years",
    bureau: "Kulkarni Matrimony Services",
    phone: "9876543211",
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500",
    about:
      "Connecting brides and grooms from different communities and families.",
  },
  {
    id: 3,
    name: "Priya Desai",
    city: "Hubballi",
    experience: "6 years",
    bureau: "Priya Matchmaking",
    phone: "9876543212",
    photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500",
    about:
      "Dedicated to helping families discover compatible life partners.",
  },
];

const initialBiodata = [
  {
    id: 101,
    brokerId: 1,
    name: "Ananya Patil",
    gender: "Bride",
    age: 25,
    city: "Belagavi",
    education: "B.E. Computer Science",
    occupation: "Software Engineer",
    height: "5 ft 4 in",
    religion: "Hindu",
    photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500",
    about: "Educated, family-oriented, and career-focused.",
  },
  {
    id: 102,
    brokerId: 1,
    name: "Rahul Patil",
    gender: "Groom",
    age: 28,
    city: "Belagavi",
    education: "MBA",
    occupation: "Business Owner",
    height: "5 ft 9 in",
    religion: "Hindu",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500",
    about: "Responsible and family-oriented, with an interest in business.",
  },
  {
    id: 103,
    brokerId: 2,
    name: "Sneha Kulkarni",
    gender: "Bride",
    age: 24,
    city: "Dharwad",
    education: "M.Sc.",
    occupation: "Teacher",
    height: "5 ft 3 in",
    religion: "Hindu",
    photo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500",
    about: "Kind-hearted, well-educated, and values family relationships.",
  },
  {
    id: 104,
    brokerId: 2,
    name: "Amit Kulkarni",
    gender: "Groom",
    age: 29,
    city: "Dharwad",
    education: "B.E. Mechanical",
    occupation: "Engineer",
    height: "5 ft 10 in",
    religion: "Hindu",
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500",
    about: "Well-settled professional looking for a compatible life partner.",
  },
  {
    id: 105,
    brokerId: 3,
    name: "Kavya Desai",
    gender: "Bride",
    age: 26,
    city: "Hubballi",
    education: "MBA",
    occupation: "HR Manager",
    height: "5 ft 5 in",
    religion: "Hindu",
    photo:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500",
    about: "Independent, friendly, and enjoys spending time with family.",
  },
];

const emptyBrokerForm = {
  name: "",
  phone: "",
  city: "",
  experience: "",
  bureau: "",
  email: "",
  password: "",
  about: "",
};

const emptyBiodataForm = {
  name: "",
  gender: "Bride",
  age: "",
  city: "",
  education: "",
  occupation: "",
  height: "",
  religion: "",
  about: "",
};

function getBrokerFromSession() {
  try {
    const user = JSON.parse(
      window.localStorage.getItem("user") ||
        window.sessionStorage.getItem("user") ||
        "null"
    );
    if (!user || String(user.role).toLowerCase() !== "broker") return null;

    const savedProfiles = JSON.parse(
      window.localStorage.getItem("wowmarriageBrokerProfiles") || "[]"
    );
    const profile = Array.isArray(savedProfiles)
      ? savedProfiles.find(
          (item) =>
            item.userId === user.id ||
            item.id === user.id ||
            item.email?.toLowerCase() === user.email?.toLowerCase()
        )
      : null;

    return {
      id: user.id || user._id,
      userId: user.id || user._id,
      name: user.fullName || user.name || profile?.name || "Broker",
      email: user.email || profile?.email || "",
      phone: user.mobile || profile?.phone || "",
      city: user.brokerDetails?.city || profile?.city || "",
      experience: `${user.brokerDetails?.experienceYears ?? 0} years`,
      bureau: user.brokerDetails?.businessName || profile?.bureau || "",
      photo: profile?.photo || "",
      about: user.brokerDetails?.about || profile?.about || "",
      serviceArea: user.brokerDetails?.serviceArea || profile?.serviceArea || "",
      ...profile,
      id: user.id || user._id,
      userId: user.id || user._id,
      name: user.fullName || user.name || profile?.name || "Broker",
      email: user.email || profile?.email || "",
    };
  } catch (error) {
    console.error("Could not restore the broker session:", error);
    return null;
  }
}

function mergeBrokerDirectory(existingBrokers, incomingBrokers) {
  const mergedBrokers = [...existingBrokers];

  for (const broker of incomingBrokers) {
    const brokerIndex = mergedBrokers.findIndex(
      (existingBroker) =>
        (broker.id && String(existingBroker.id) === String(broker.id)) ||
        (broker.email &&
          existingBroker.email?.toLowerCase() === broker.email.toLowerCase())
    );

    if (brokerIndex === -1) {
      mergedBrokers.push(broker);
      continue;
    }

    mergedBrokers[brokerIndex] = {
      ...mergedBrokers[brokerIndex],
      ...broker,
      photo: broker.photo || mergedBrokers[brokerIndex].photo,
      email: broker.email || mergedBrokers[brokerIndex].email,
      phone: broker.phone || mergedBrokers[brokerIndex].phone,
    };
  }

  return mergedBrokers;
}

// Connect this helper to the exact subscription status saved by your checkout flow.
// It intentionally defaults to locked when no active subscription can be confirmed.
function hasActiveMatrimonySubscription() {
  if (typeof window === "undefined") return false;

  const keys = ["userSubscription", "activeSubscription", "subscription", "subscriptionStatus"];
  for (const key of keys) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      const value = JSON.parse(raw);
      if (value && typeof value === "object") {
        const status = String(value.status || value.subscriptionStatus || "").toLowerCase();
        const activeFlag = value.isActive === true || value.active === true;
        const expiry = value.expiresAt || value.expiryDate || value.endDate;
        const notExpired = !expiry || new Date(expiry).getTime() > Date.now();
        if ((activeFlag || ["active", "paid", "success", "completed"].includes(status)) && notExpired) return true;
      } else if (["active", "true", "paid", "success", "completed"].includes(String(value).toLowerCase())) {
        return true;
      }
    } catch {
      const raw = window.localStorage.getItem(key);
      if (["active", "true", "paid", "success", "completed"].includes(String(raw).toLowerCase())) return true;
    }
  }
  return false;
}

export default function BrokerMatrimony() {
  const navigate = useNavigate();
  // Broker management is available only to accounts whose backend role is "broker".
  const currentUser = (() => {
    try {
      return JSON.parse(
        window.localStorage.getItem("user") ||
          window.sessionStorage.getItem("user") ||
          "null"
      );
    } catch {
      return null;
    }
  })();
  const isBroker = String(currentUser?.role || "").toLowerCase() === "broker";
  const hasSubscription = true; // Broker Services profiles are publicly viewable.
  const [activeTab, setActiveTab] = useState(isBroker ? "dashboard" : "find");
  const [brokers, setBrokers] = useState(() => {
    try {
      const saved = window.localStorage.getItem("wowmarriageBrokerProfiles");
      const savedBrokers = saved ? JSON.parse(saved) : [];
      return Array.isArray(savedBrokers) ? [...initialBrokers, ...savedBrokers] : initialBrokers;
    } catch (error) {
      console.error("Could not load saved broker profiles:", error);
      return initialBrokers;
    }
  });
  const [brokerDirectoryLoading, setBrokerDirectoryLoading] = useState(true);
  const [biodata, setBiodata] = useState(() => {
    try {
      const saved = window.localStorage.getItem("wowmateBrokerBiodata");
      return saved ? JSON.parse(saved) : initialBiodata;
    } catch (error) {
      console.error("Could not load saved biodata:", error);
      return initialBiodata;
    }
  });

  const [selectedBroker, setSelectedBroker] = useState(null);
  const [selectedBiodata, setSelectedBiodata] = useState(null);

  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [experienceFilter, setExperienceFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("name");
  const [genderFilter, setGenderFilter] = useState("All");

  const [brokerForm, setBrokerForm] = useState(emptyBrokerForm);
  const [brokerPhoto, setBrokerPhoto] = useState("");
  const [biodataForm, setBiodataForm] = useState(emptyBiodataForm);
  const [biodataPhoto, setBiodataPhoto] = useState("");
  const [editingBiodataId, setEditingBiodataId] = useState(null);

  const [registeredBroker, setRegisteredBroker] = useState(getBrokerFromSession);
  const [showBrokerProfileForm, setShowBrokerProfileForm] = useState(false);
  const [brokerProfileLoading, setBrokerProfileLoading] = useState(false);
  const [brokerProfileSaving, setBrokerProfileSaving] = useState(false);
  const [brokerProfileForm, setBrokerProfileForm] = useState({
    businessName: "",
    experienceYears: 0,
    city: "",
    serviceArea: "",
    about: "",
  });
  const [showBiodataForm, setShowBiodataForm] = useState(false);
  const [notice, setNotice] = useState("");
  const [brokerAuthMode, setBrokerAuthMode] = useState("register");
  const [brokerLoginForm, setBrokerLoginForm] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [brokerAuthError, setBrokerAuthError] = useState("");

  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    city: "",
    service: "Find a suitable match",
    message: "",
  });

  useEffect(() => {
    let cancelled = false;

    async function loadBrokerDirectory() {
      try {
        const response = await fetch("http://localhost:5000/api/broker/profiles");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load broker profiles.");
        }
        if (!Array.isArray(data.profiles)) {
          throw new Error("The broker directory response was invalid.");
        }

        const registeredProfiles = data.profiles.map((profile) => {
          const details = profile.brokerDetails || {};
          return {
            id: profile.id,
            userId: profile.id,
            name: profile.fullName || "Matrimony Broker",
            city: details.city || "",
            experience: `${details.experienceYears ?? 0} years`,
            bureau: details.businessName || "",
            serviceArea: details.serviceArea || "",
            about: details.about || "",
          };
        });

        if (!cancelled) {
          setBrokers((previous) =>
            mergeBrokerDirectory(previous, registeredProfiles)
          );
        }
      } catch (error) {
        console.error("Loading public broker directory failed:", error);
        if (!cancelled) {
          setNotice(
            error.message || "Could not load registered broker profiles."
          );
        }
      } finally {
        if (!cancelled) setBrokerDirectoryLoading(false);
      }
    }

    loadBrokerDirectory();
    return () => {
      cancelled = true;
    };
  }, []);

  // Load the authenticated broker's saved profile from MongoDB.
  useEffect(() => {
    let cancelled = false;

    async function loadBrokerProfile() {
      if (!isBroker) return;

      const token =
        window.localStorage.getItem("token") ||
        window.sessionStorage.getItem("token");

      if (!token) {
        if (!cancelled) setNotice("Please log in again to load your broker profile.");
        return;
      }

      try {
        setBrokerProfileLoading(true);
        const response = await fetch("http://localhost:5000/api/broker/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Unable to load broker profile.");

        const profile = data.profile || {};
        const details = profile.brokerDetails || {};
        const updatedBroker = {
          ...(registeredBroker || {}),
          id: profile.id,
          userId: profile.id,
          name: profile.fullName || "Broker",
          email: profile.email || "",
          phone: profile.mobile || "",
          city: details.city || "",
          experience: `${details.experienceYears ?? 0} years`,
          bureau: details.businessName || "",
          serviceArea: details.serviceArea || "",
          about: details.about || "",
        };

        if (cancelled) return;
        setRegisteredBroker(updatedBroker);
        setBrokerProfileForm({
          businessName: details.businessName || "",
          experienceYears: details.experienceYears ?? 0,
          city: details.city || "",
          serviceArea: details.serviceArea || "",
          about: details.about || "",
        });
        setBrokers((previous) => {
          const withoutCurrent = previous.filter(
            (item) => String(item.id) !== String(profile.id)
          );
          return [...withoutCurrent, updatedBroker];
        });
      } catch (error) {
        console.error("Loading broker profile failed:", error);
        if (!cancelled) setNotice(error.message || "Could not load broker profile.");
      } finally {
        if (!cancelled) setBrokerProfileLoading(false);
      }
    }

    loadBrokerProfile();
    return () => { cancelled = true; };
  // The session role is read from storage when this page mounts.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBroker]);

  async function handleBrokerProfileUpdate(event) {
    event.preventDefault();
    if (!isBroker || !registeredBroker) {
      setNotice("Please log in with your broker account.");
      return;
    }

    const token =
      window.localStorage.getItem("token") ||
      window.sessionStorage.getItem("token");
    if (!token) {
      setNotice("Your login session has expired. Please log in again.");
      return;
    }

    try {
      setBrokerProfileSaving(true);
      setNotice("");
      const response = await fetch("http://localhost:5000/api/broker/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          businessName: brokerProfileForm.businessName,
          experienceYears: Number(brokerProfileForm.experienceYears),
          city: brokerProfileForm.city,
          serviceArea: brokerProfileForm.serviceArea,
          about: brokerProfileForm.about,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Profile update failed.");

      const profile = data.profile || {};
      const details = profile.brokerDetails || {};
      const updatedBroker = {
        ...registeredBroker,
        id: profile.id || registeredBroker.id,
        userId: profile.id || registeredBroker.id,
        name: profile.fullName || registeredBroker.name,
        email: profile.email || registeredBroker.email,
        phone: profile.mobile || registeredBroker.phone || "",
        city: details.city || "",
        experience: `${details.experienceYears ?? 0} years`,
        bureau: details.businessName || "",
        serviceArea: details.serviceArea || "",
        about: details.about || "",
      };

      setRegisteredBroker(updatedBroker);
      setSelectedBroker((current) =>
        current && String(current.id) === String(updatedBroker.id) ? updatedBroker : current
      );
      setBrokers((previous) => {
        const exists = previous.some((item) => String(item.id) === String(updatedBroker.id));
        return exists
          ? previous.map((item) => String(item.id) === String(updatedBroker.id) ? updatedBroker : item)
          : [...previous, updatedBroker];
      });
      setBrokerProfileForm({
        businessName: details.businessName || "",
        experienceYears: details.experienceYears ?? 0,
        city: details.city || "",
        serviceArea: details.serviceArea || "",
        about: details.about || "",
      });
      setShowBrokerProfileForm(false);
      setNotice(data.message || "Your broker profile has been updated successfully.");
    } catch (error) {
      console.error("Broker profile update failed:", error);
      setNotice(error.message || "Unable to update broker profile.");
    } finally {
      setBrokerProfileSaving(false);
    }
  }

  const filteredBrokers = brokers
    .filter((broker) => {
      const searchText = search.trim().toLowerCase();
      const matchesSearch =
        broker.name.toLowerCase().includes(searchText) ||
        (broker.city || "").toLowerCase().includes(searchText) ||
        (broker.bureau || "").toLowerCase().includes(searchText);
      const matchesCity = cityFilter === "All" || broker.city === cityFilter;
      const years = Number.parseInt(broker.experience, 10) || 0;
      const matchesExperience =
        experienceFilter === "All" ||
        (experienceFilter === "0-4" && years <= 4) ||
        (experienceFilter === "5-9" && years >= 5 && years <= 9) ||
        (experienceFilter === "10+" && years >= 10);
      return matchesSearch && matchesCity && matchesExperience;
    })
    .sort((a, b) => {
      if (sortOrder === "experience") {
        return (Number.parseInt(b.experience, 10) || 0) - (Number.parseInt(a.experience, 10) || 0);
      }
      return a.name.localeCompare(b.name);
    });

  const brokerCities = [...new Set(brokers.map((broker) => broker.city).filter(Boolean))].sort();

  const visibleBiodata = biodata.filter((person) => {
    const matchesBroker =
      selectedBroker &&
      String(person.brokerId) === String(selectedBroker.id);

    const matchesGender =
      genderFilter === "All" || person.gender === genderFilter;

    return matchesBroker && matchesGender;
  });

  function handleBrokerPhoto(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setNotice("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setNotice("Please select an image smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setBrokerPhoto(typeof reader.result === "string" ? reader.result : "");
      setNotice("");
    };
    reader.onerror = () => setNotice("The photo could not be read. Please choose another image.");
    reader.readAsDataURL(file);
  }

  function handleBiodataPhoto(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setNotice("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setNotice("Please select an image smaller than 5 MB.");
      return;
    }

    setBiodataPhoto(URL.createObjectURL(file));
    setNotice("");
  }

  async function handleBrokerLogin(event) {
    event.preventDefault();
    setBrokerAuthError("");

    const email = brokerLoginForm.email.trim().toLowerCase();
    if (!email || !brokerLoginForm.password) {
      setBrokerAuthError("Please enter your email address and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: brokerLoginForm.password }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.token || !data.user) {
        throw new Error(data.message || data.error || "Login failed. Please try again.");
      }
      if (String(data.user.role).toLowerCase() !== "broker") {
        throw new Error("This account is not registered as a broker.");
      }

      window.localStorage.removeItem("token");
      window.localStorage.removeItem("user");
      window.sessionStorage.removeItem("token");
      window.sessionStorage.removeItem("user");
      const storage = brokerLoginForm.rememberMe
        ? window.localStorage
        : window.sessionStorage;
      storage.setItem("token", data.token);
      storage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("authChanged"));

      const savedProfiles = JSON.parse(
        window.localStorage.getItem("wowmarriageBrokerProfiles") || "[]"
      );
      const savedProfile = Array.isArray(savedProfiles)
        ? savedProfiles.find(
            (profile) =>
              profile.userId === data.user.id ||
              profile.id === data.user.id ||
              profile.email?.toLowerCase() === email
          )
        : null;
      const broker = {
        id: data.user.id || data.user._id,
        userId: data.user.id || data.user._id,
        name: data.user.fullName || savedProfile?.name || "Broker",
        email: data.user.email || email,
        phone: "",
        city: "",
        experience: "0 years",
        bureau: "",
        photo: "",
        about: "",
        ...savedProfile,
      };

      setRegisteredBroker(broker);
      setSelectedBroker(broker);
      setBrokerLoginForm({ email: "", password: "", rememberMe: true });
      setActiveTab("dashboard");
      setNotice("Welcome back. Your broker account is signed in.");
      requestAnimationFrame(() => {
        document.getElementById("broker-content")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (error) {
      console.error("Broker login failed:", error);
      setBrokerAuthError(
        error instanceof Error
          ? error.message
          : "Could not connect to the backend. Make sure the server is running on port 5000."
      );
    }
  }

  async function handleBrokerRegistration(event) {
    event.preventDefault();
    setNotice("");
    setBrokerAuthError("");

    const name = brokerForm.name.trim();
    const phone = brokerForm.phone.trim();
    const city = brokerForm.city.trim();
    const email = brokerForm.email.trim().toLowerCase();
    const experience = Number(brokerForm.experience);
    const password = brokerForm.password;

    if (!brokerPhoto) {
      setBrokerAuthError("Please upload your profile photo.");
      return;
    }
    if (!name || !city || !email || !password) {
      setBrokerAuthError("Please complete all required fields.");
      return;
    }
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      setBrokerAuthError("Please enter a valid mobile number.");
      return;
    }
    if (!Number.isFinite(experience) || experience < 0 || experience > 80) {
      setBrokerAuthError("Please enter experience between 0 and 80 years.");
      return;
    }
    if (password.length < 8 || password.length > 72) {
      setBrokerAuthError("Please enter a password between 8 and 72 characters.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register-broker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: name, email, password }),
      });
      const data = await response.json().catch(() => ({}));

      // Registration must succeed on the server before we switch to the login form.
      if (!response.ok) {
        throw new Error(data.message || data.error || "Broker registration failed. Please try again.");
      }
      if (data.user?.role && String(data.user.role).toLowerCase() !== "broker") {
        throw new Error("The server did not create a broker account. Please check registerBroker in authController.js.");
      }
      if (data.success === false) {
        throw new Error(data.message || "Broker registration failed. Please try again.");
      }

      // Store non-sensitive profile details only. Do not sign the user in automatically.
      // Profile extras remain browser-only until a broker-profile API is implemented.
      const newBroker = {
        id: data.user?.id || data.user?._id || `broker-${Date.now()}`,
        userId: data.user?.id || data.user?._id || null,
        name: data.user?.fullName || name,
        phone,
        city,
        experience: `${experience} years`,
        bureau: brokerForm.bureau.trim(),
        email: data.user?.email || email,
        photo: brokerPhoto,
        about: brokerForm.about.trim() || "Matrimony broker helping families find suitable matches.",
        profileCount: 0,
      };

      const savedRaw = window.localStorage.getItem("wowmarriageBrokerProfiles");
      const savedProfiles = savedRaw ? JSON.parse(savedRaw) : [];
      const profiles = Array.isArray(savedProfiles) ? savedProfiles : [];
      const withoutDuplicate = profiles.filter((profile) => profile.email?.toLowerCase() !== email);
      withoutDuplicate.push(newBroker);
      window.localStorage.setItem("wowmarriageBrokerProfiles", JSON.stringify(withoutDuplicate));
      setBrokers((previous) => [
        ...previous.filter((broker) => broker.email?.toLowerCase() !== email),
        newBroker,
      ]);

      // Hide registration and show login, pre-filling only the email address.
      setBrokerForm(emptyBrokerForm);
      setBrokerPhoto("");
      setBrokerLoginForm({ email, password: "", rememberMe: true });
      setBrokerAuthMode("login");
      setBrokerAuthError("");
      setNotice("Registration successful! Please log in with the email and password you just registered.");
      setActiveTab("become");
      requestAnimationFrame(() => {
        document.getElementById("broker-content")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch (error) {
      console.error("Broker registration failed:", error);
      setBrokerAuthError(
        error instanceof TypeError
          ? "Could not reach the backend. Check that the server is running on port 5000, the API route is /api/auth/register-broker, and CORS allows your frontend origin."
          : error instanceof Error
            ? error.message
            : "Broker registration failed. Please try again."
      );
    }
  }

  function handleBrokerLogout() {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    window.sessionStorage.removeItem("token");
    window.sessionStorage.removeItem("user");
    window.dispatchEvent(new Event("authChanged"));
    setRegisteredBroker(null);
    setSelectedBroker(null);
    setSelectedBiodata(null);
    setBrokerAuthMode("login");
    setBrokerAuthError("");
    setNotice("You have been signed out of your broker account.");
    setActiveTab("find");
  }

  function saveBiodata(updatedBiodata) {
    try {
      window.localStorage.setItem(
        "wowmateBrokerBiodata",
        JSON.stringify(updatedBiodata)
      );
      setBiodata(updatedBiodata);
      return true;
    } catch (error) {
      console.error("Could not save biodata:", error);
      setNotice("Could not save biodata in this browser. Please try a smaller photo.");
      return false;
    }
  }

  function handleBiodataSubmit(event) {
    event.preventDefault();

    if (!isBroker || !registeredBroker) {
      setNotice("Only a logged-in broker can manage biodata.");
      return;
    }

    const existingProfile = editingBiodataId
      ? biodata.find(
          (item) =>
            item.id === editingBiodataId &&
            String(item.brokerId) === String(registeredBroker.id)
        )
      : null;
    const photo = biodataPhoto || existingProfile?.photo;

    if (!photo) {
      setNotice("Please upload a photo for this biodata.");
      return;
    }

    const profileData = {
      ...biodataForm,
      id: editingBiodataId || Date.now(),
      brokerId: registeredBroker.id,
      age: Number(biodataForm.age),
      photo,
    };

    const updatedBiodata = editingBiodataId
      ? biodata.map((item) =>
          item.id === editingBiodataId &&
          String(item.brokerId) === String(registeredBroker.id)
            ? profileData
            : item
        )
      : [...biodata, profileData];

    if (!saveBiodata(updatedBiodata)) return;
    setBiodataForm(emptyBiodataForm);
    setBiodataPhoto("");
    setEditingBiodataId(null);
    setShowBiodataForm(false);
    setNotice(
      editingBiodataId
        ? "Biodata updated successfully."
        : "Biodata added successfully."
    );
  }

  function handleEditBiodata(profile) {
    if (
      !isBroker ||
      !registeredBroker ||
      String(profile.brokerId) !== String(registeredBroker.id)
    ) return;

    setBiodataForm({
      name: profile.name || "",
      gender: profile.gender || "Bride",
      age: String(profile.age || ""),
      city: profile.city || "",
      education: profile.education || "",
      occupation: profile.occupation || "",
      height: profile.height || "",
      religion: profile.religion || "",
      about: profile.about || "",
    });
    setBiodataPhoto(profile.photo || "");
    setEditingBiodataId(profile.id);
    setShowBiodataForm(true);
    setActiveTab("become");
    setNotice("");
    requestAnimationFrame(() =>
      document.getElementById("broker-content")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    );
  }

  function handleDeleteBiodata(profile) {
    if (
      !isBroker ||
      !registeredBroker ||
      String(profile.brokerId) !== String(registeredBroker.id)
    ) return;

    const confirmed = window.confirm(
      `Delete ${profile.name}'s biodata? This cannot be undone.`
    );
    if (!confirmed) return;

    const updatedBiodata = biodata.filter(
      (item) =>
        !(
          item.id === profile.id &&
          String(item.brokerId) === String(registeredBroker.id)
        )
    );
    if (!saveBiodata(updatedBiodata)) return;

    if (selectedBiodata?.id === profile.id) setSelectedBiodata(null);
    setNotice(`${profile.name}'s biodata was deleted.`);
  }

  function handleContactSubmit(event) {
    event.preventDefault();

    setNotice(
      "Thank you! This is a frontend demo. Connect the backend to save your enquiry."
    );

    setContactForm({
      name: "",
      phone: "",
      city: "",
      service: "Find a suitable match",
      message: "",
    });
  }

  function openBroker(broker) {
    setSelectedBroker(broker);
    setSelectedBiodata(null);
    setGenderFilter("All");
    setActiveTab("find");
    setNotice("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function returnToBrokerList() {
    setSelectedBroker(null);
    setSelectedBiodata(null);
    setNotice("");
  }

  function selectTab(tab) {
    // Registered brokers use this page as their private management workspace.
    // Public broker discovery and broker registration remain for non-broker visitors.
    const nextTab = isBroker && (tab === "find" || tab === "become")
      ? "dashboard"
      : tab;

    setActiveTab(nextTab);
    setSelectedBroker(null);
    setSelectedBiodata(null);
    setNotice("");

    requestAnimationFrame(() => {
      document
        .getElementById("broker-content")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <div className="broker-page">
      <style>{`
        .broker-page {
          --primary: #8b5cf6;
          --primary-dark: #6d28d9;
          --pink: #f3edff;
          --gold: #a78bfa;
          --text: #29202a;
          --muted: #746b75;
          color: var(--text);
          background: #faf8ff;
          min-height: 100vh;
          font-family: Arial, Helvetica, sans-serif;
        }

        .broker-page * {
          box-sizing: border-box;
        }

        .broker-page button,
        .broker-page input,
        .broker-page textarea,
        .broker-page select {
          font: inherit;
        }

        .broker-page button {
          cursor: pointer;
        }

        .broker-container {
          width: min(1160px, 92%);
          margin: auto;
        }

        .broker-topbar {
          background: white;
          border-bottom: 1px solid #e9ddff;
          position: sticky;
          top: 0;
          z-index: 20;
        }

        .broker-nav {
          min-height: 78px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 20px;
          flex-wrap: wrap;
          padding-top: 12px;
          padding-bottom: 12px;
        }

        .broker-nav-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .broker-btn {
          border: 1px solid var(--primary);
          border-radius: 9px;
          padding: 12px 19px;
          font-weight: 700;
          transition: .2s;
        }

        .broker-btn:hover {
          transform: translateY(-1px);
        }

        .broker-btn-primary {
          background: var(--primary);
          color: white;
        }

        .broker-btn-primary:hover {
          background: var(--primary-dark);
        }

        .broker-btn-outline {
          background: white;
          color: var(--primary);
        }

        .broker-btn-outline:hover {
          background: var(--pink);
        }

        .broker-hero {
          background: radial-gradient(circle at 85% 20%, #ede5ff 0, transparent 34%), linear-gradient(120deg, #faf7ff, #ffffff 60%, #f5f0ff);
          padding: 66px 0 58px;
        }

        .broker-hero-grid {
          display: grid;
          grid-template-columns: 1.2fr .8fr;
          align-items: center;
          gap: 38px;
        }

        .broker-eyebrow {
          color: var(--primary);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 12px;
        }

        .broker-hero h1 {
          font-size: clamp(34px, 5vw, 52px);
          line-height: 1.13;
          margin: 15px 0;
        }

        .broker-hero h1 span {
          color: var(--primary);
        }

        .broker-hero p {
          color: var(--muted);
          font-size: 16px;
          line-height: 1.8;
          max-width: 610px;
        }

        .broker-hero-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 25px;
        }

        .broker-hero-image {
          width: 100%;
          height: 350px;
          object-fit: cover;
          border-radius: 24px;
          box-shadow: 0 22px 55px #6d28d926;
        }

        .broker-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-top: 30px;
          max-width: 560px;
        }

        .broker-stat {
          background: white;
          border: 1px solid #e8ddff;
          border-radius: 12px;
          padding: 16px;
        }

        .broker-stat strong {
          display: block;
          color: var(--primary);
          font-size: 23px;
          margin-bottom: 5px;
        }

        .broker-stat span {
          color: var(--muted);
          font-size: 12px;
        }

        .broker-section {
          padding: 55px 0;
          scroll-margin-top: 90px;
        }

        .broker-section-heading {
          text-align: center;
          margin-bottom: 30px;
        }

        .broker-section-heading h2 {
          font-size: clamp(27px, 4vw, 36px);
          margin: 0 0 10px;
        }

        .broker-section-heading p {
          color: var(--muted);
          line-height: 1.7;
          margin: 0 auto;
          max-width: 650px;
        }

        .broker-toolbar {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          flex-wrap: wrap;
          margin-bottom: 25px;
        }

        .broker-listing-toolbar {
          align-items: center;
          justify-content: flex-start;
          padding: 18px;
          background: #fff;
          border: 1px solid #e9e0fb;
          border-radius: 16px;
          box-shadow: 0 8px 28px #6d28d90d;
        }

        .broker-filter-select {
          width: auto;
          min-width: 155px;
          flex: 0 1 180px;
        }

        .broker-results-summary {
          color: var(--muted);
          font-size: 14px;
          margin: -8px 0 20px;
        }

        .broker-results-summary strong {
          color: var(--primary);
        }

        .broker-listing-toolbar .broker-btn {
          white-space: nowrap;
        }

        .broker-input {
          width: 100%;
          border: 1px solid #ded4f5;
          border-radius: 9px;
          padding: 12px 13px;
          outline: none;
          background: white;
          color: var(--text);
        }

        .broker-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px #8b5cf61c;
        }

        .broker-search {
          max-width: 390px;
          flex: 1;
        }

        .broker-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .broker-card {
          display: flex;
          flex-direction: column;
          height: 100%;
          min-width: 0;
          background: white;
          border: 1px solid #e9e0fb;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 28px #6d28d90d;
          transition: transform .2s, box-shadow .2s;
        }

        .broker-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 38px #6d28d91c;
        }

        .broker-card-image {
          display: block;
          flex: 0 0 245px;
          width: 100%;
          height: 245px;
          min-height: 245px;
          object-fit: cover;
          object-position: center 25%;
          background: var(--pink);
        }

        .broker-card-content {
          display: flex;
          flex: 1 1 auto;
          flex-direction: column;
          align-items: stretch;
          min-width: 0;
          padding: 19px;
        }

        .broker-card-content > .broker-card-actions {
          margin-top: auto;
          padding-top: 14px;
        }

        .broker-card h3 {
          margin: 0 0 8px;
          font-size: 20px;
        }

        .broker-muted {
          color: var(--muted);
          font-size: 14px;
          line-height: 1.7;
        }

        .broker-card-actions {
          display: flex;
          gap: 9px;
          margin-top: 17px;
          flex-wrap: wrap;
        }

        .broker-card-actions .broker-btn {
          flex: 1;
          padding: 10px;
          font-size: 13px;
        }

        .broker-tag {
          display: inline-block;
          padding: 6px 10px;
          background: var(--pink);
          color: var(--primary);
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .broker-back {
          margin-bottom: 24px;
        }

        .broker-profile-heading {
          display: flex;
          align-items: center;
          gap: 22px;
          background: white;
          border: 1px solid #e9e0fb;
          padding: 22px;
          border-radius: 16px;
          margin-bottom: 30px;
        }

        .broker-profile-heading img {
          display: block;
          flex: 0 0 120px;
          width: 120px;
          height: 120px;
          object-fit: cover;
          object-position: center 25%;
          border-radius: 14px;
          background: var(--pink);
        }

        .broker-profile-heading h2 {
          margin: 0 0 8px;
        }

        .broker-form-wrap {
          max-width: 850px;
          margin: auto;
          background: white;
          border: 1px solid #e9e0fb;
          border-radius: 18px;
          padding: 30px;
          box-shadow: 0 18px 48px #6d28d916;
        }

        .broker-auth-switch {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin: 0 auto 18px;
        }

        .broker-auth-error {
          margin: 14px 0;
          padding: 12px 14px;
          border: 1px solid #fecaca;
          border-radius: 10px;
          background: #fef2f2;
          color: #b91c1c;
          line-height: 1.5;
        }

        .broker-remember {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 18px;
          color: #3f315c;
          font-size: 14px;
        }

        .broker-remember input {
          width: 16px;
          height: 16px;
          accent-color: #8b5cf6;
        }

        .broker-auth-submit {
          width: 100%;
          margin-top: 22px;
          padding: 14px;
        }

        .broker-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .broker-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .broker-field label {
          font-weight: 700;
          font-size: 13px;
        }

        .broker-field-full {
          grid-column: 1 / -1;
        }

        .broker-field textarea {
          min-height: 100px;
          resize: vertical;
        }

        .broker-upload {
          border: 2px dashed #b9a1f5;
          border-radius: 13px;
          padding: 22px;
          text-align: center;
          background: linear-gradient(135deg, #faf7ff, #f3edff);
        }

        .broker-upload img {
          display: block;
          width: min(100%, 220px);
          height: 220px;
          border-radius: 14px;
          object-fit: contain;
          object-position: center;
          background: #f3edff;
          margin: 0 auto 14px;
        }

        .broker-upload input {
          max-width: 100%;
          margin-top: 12px;
          padding: 10px;
          border: 1px solid #ded4f5;
          border-radius: 10px;
          background: #fff;
        }

        /* Registration form polish: purple and white theme */
        .broker-form-wrap {
          position: relative;
          overflow: hidden;
          border: 1px solid #e5dcfa;
          border-radius: 24px;
          padding: clamp(22px, 4vw, 38px);
          box-shadow: 0 22px 60px #6d28d916;
        }

        .broker-form-wrap::before {
          content: "";
          position: absolute;
          inset: 0 0 auto;
          height: 6px;
          background: linear-gradient(90deg, #8b5cf6, #c4b5fd, #6d28d9);
        }

        .broker-form-wrap h3 {
          color: #4c1d95;
          font-size: 25px;
          letter-spacing: -0.4px;
          margin-bottom: 8px;
        }

        .broker-form-wrap .broker-field label {
          color: #3f315c;
          font-size: 14px;
        }

        .broker-form-wrap .broker-input {
          min-height: 47px;
          border: 1px solid #ded4f5;
          border-radius: 12px;
          padding: 12px 14px;
          transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
        }

        .broker-form-wrap .broker-input:hover {
          border-color: #b9a1f5;
        }

        .broker-form-wrap .broker-input:focus {
          border-color: #8b5cf6;
          background: #fff;
          box-shadow: 0 0 0 4px #8b5cf61c;
        }

        .broker-form-wrap .broker-upload {
          border: 2px dashed #b9a1f5;
          border-radius: 18px;
          padding: 28px 20px;
          background: linear-gradient(135deg, #fbf9ff, #f1ebff);
          transition: border-color .2s ease, transform .2s ease;
        }

        .broker-form-wrap .broker-upload:hover {
          border-color: #8b5cf6;
        }

        .broker-form-wrap .broker-upload strong {
          display: block;
          color: #4c1d95;
          margin-top: 8px;
        }

        .broker-form-wrap .broker-btn-primary {
          min-height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #8b5cf6, #6d28d9);
          box-shadow: 0 8px 18px #6d28d92b;
        }

        .broker-form-wrap .broker-btn-primary:hover {
          background: linear-gradient(135deg, #7c3aed, #5b21b6);
          box-shadow: 0 11px 24px #6d28d936;
        }

        .broker-form-wrap .broker-muted {
          color: #786b91;
        }

        .broker-notice {
          background: #f0fdf4;
          color: #176b37;
          border: 1px solid #bde7ca;
          padding: 13px 15px;
          border-radius: 9px;
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .broker-empty {
          padding: 35px 20px;
          background: white;
          border: 1px dashed #cfc0f3;
          border-radius: 14px;
          text-align: center;
          color: var(--muted);
          grid-column: 1 / -1;
        }

        .broker-detail {
          background: white;
          border: 1px solid #e9e0fb;
          border-radius: 18px;
          padding: 25px;
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 28px;
        }

        .broker-detail > img {
          display: block;
          width: 100%;
          height: 360px;
          object-fit: cover;
          object-position: center 25%;
          border-radius: 14px;
          background: var(--pink);
        }

        .broker-detail h2 {
          margin-top: 0;
        }

        .broker-detail-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 13px;
          margin: 20px 0;
        }

        .broker-detail-item {
          padding: 13px;
          background: #fff6fa;
          border-radius: 9px;
        }

        .broker-detail-item span {
          display: block;
          font-size: 12px;
          color: var(--muted);
          margin-bottom: 6px;
        }

        .broker-detail-item strong {
          overflow-wrap: anywhere;
        }

        .broker-services {
          background: white;
        }

        .broker-service-card {
          padding: 24px;
          background: linear-gradient(135deg, #faf7ff, #f3edff);
          border: 1px solid #f1e0e8;
          border-radius: 14px;
        }

        .broker-service-icon {
          font-size: 30px;
        }

        .broker-service-card h3 {
          margin-bottom: 8px;
        }

        .broker-footer {
          background: #351023;
          color: white;
          text-align: center;
          padding: 27px 15px;
          line-height: 1.8;
        }

        .broker-footer p {
          margin: 0;
          color: #f3dfe8;
          font-size: 13px;
        }

        .broker-dashboard { max-width: 1080px; margin: 0 auto; }
        .broker-dashboard-empty, .broker-dashboard-heading, .broker-dashboard-profile,
        .broker-dashboard-stat, .broker-dashboard-action-card {
          background: #fff; border: 1px solid #e8ddff; border-radius: 22px;
          box-shadow: 0 12px 34px rgba(91, 33, 182, .07);
        }
        .broker-dashboard-empty { text-align: center; padding: 54px 28px; }
        .broker-dashboard-empty-icon { width: 74px; height: 74px; display: grid;
          place-items: center; border-radius: 22px; margin: 0 auto 18px;
          background: linear-gradient(135deg, #ede5ff, #faf5ff); font-size: 34px; }
        .broker-dashboard-empty h2, .broker-dashboard-heading h2 { color: #4c1d95; margin: 10px 0; }
        .broker-dashboard-empty p, .broker-dashboard-heading p { color: #746b75; line-height: 1.7; }
        .broker-dashboard-empty > p { max-width: 600px; margin: 0 auto 22px; }
        .broker-dashboard-demo-note { color: #75658f; background: #f4efff; border: 1px solid #e4d7ff;
          border-radius: 12px; padding: 12px 15px; font-size: 12px; line-height: 1.6; margin-top: 20px; }
        .broker-dashboard-heading { display: flex; align-items: center; justify-content: space-between;
          gap: 20px; padding: 25px 28px; margin-bottom: 18px; }
        .broker-dashboard-status { white-space: nowrap; border-radius: 999px; padding: 9px 13px;
          color: #6d28d9; background: #f3edff; font-size: 12px; font-weight: 700; }
        .broker-dashboard-profile { display: flex; align-items: center; gap: 20px; padding: 22px;
          margin-bottom: 18px; flex-wrap: wrap; }
        .broker-dashboard-profile > img { display: block; flex: 0 0 92px; width: 92px; height: 92px; border-radius: 50%; object-fit: cover; object-position: center 25%;
          border: 4px solid #ede5ff; }
        .broker-dashboard-profile-copy { flex: 1; min-width: 180px; }
        .broker-dashboard-profile-copy h3 { margin: 0 0 8px; color: #4c1d95; font-size: 20px; }
        .broker-dashboard-profile-copy p { margin: 5px 0; color: #746b75; font-size: 13px; }
        .broker-dashboard-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin-bottom: 18px; }
        .broker-dashboard-stat { padding: 20px; display: flex; flex-direction: column; align-items: flex-start; gap: 7px; }
        .broker-dashboard-stat-icon { font-size: 24px; }
        .broker-dashboard-stat-label { color: #746b75; font-size: 13px; }
        .broker-dashboard-stat strong { color: #4c1d95; font-size: 28px; }
        .broker-dashboard-stat small { color: #8a8192; font-size: 11px; line-height: 1.5; }
        .broker-dashboard-actions { display: grid; gap: 14px; }
        .broker-dashboard-action-card { display: flex; align-items: center; gap: 16px; padding: 20px; }
        .broker-dashboard-action-icon { width: 48px; height: 48px; border-radius: 15px; display: grid; place-items: center;
          background: #f3edff; font-size: 23px; flex-shrink: 0; }
        .broker-dashboard-action-card > div:nth-child(2) { flex: 1; }
        .broker-dashboard-action-card h3 { margin: 0 0 6px; color: #4c1d95; font-size: 16px; }
        .broker-dashboard-action-card p { margin: 0; color: #746b75; font-size: 13px; }
        .broker-dashboard-biodata { margin-top: 24px; }
        .broker-dashboard-biodata-heading { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 16px; }
        .broker-dashboard-biodata-heading h3 { margin: 7px 0; color: #4c1d95; font-size: 22px; }
        .broker-dashboard-biodata-heading p { margin: 0; color: #746b75; font-size: 13px; line-height: 1.6; }
        .broker-dashboard-biodata-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 15px; }
        .broker-dashboard-biodata-card { display: flex; align-items: center; gap: 14px; padding: 17px; background: #fff; border: 1px solid #e8ddff; border-radius: 18px; box-shadow: 0 8px 24px rgba(91,33,182,.06); min-width: 0; }
        .broker-dashboard-biodata-card > img { display: block; flex: 0 0 76px; width: 76px; height: 90px; object-fit: cover; object-position: center 25%; border-radius: 13px; background: #f3edff; }
        .broker-dashboard-biodata-copy { flex: 1; min-width: 0; }
        .broker-dashboard-biodata-copy h4 { color: #4c1d95; margin: 7px 0 5px; font-size: 16px; overflow-wrap: anywhere; }
        .broker-dashboard-biodata-copy p { color: #746b75; font-size: 12px; margin: 4px 0; overflow-wrap: anywhere; }
        .broker-dashboard-biodata-tag { display: inline-block; color: #6d28d9; background: #f3edff; border-radius: 999px; padding: 4px 8px; font-size: 10px; font-weight: 800; }
        .broker-dashboard-biodata-buttons { display: flex; flex-direction: column; gap: 8px; }
        .broker-btn-danger { color: #b42318; background: #fff; border: 1px solid #f2c9c5; }
        .broker-dashboard-biodata-empty { text-align: center; background: #fff; border: 1px dashed #c4b5fd; border-radius: 18px; padding: 28px; color: #746b75; }
        .broker-dashboard-biodata-empty > span { font-size: 30px; }
        .broker-dashboard-biodata-empty h4 { color: #4c1d95; margin: 9px 0; }
        .broker-dashboard-biodata-empty p { margin: 0; font-size: 13px; }

        @media (max-width: 850px) {
          .broker-hero-grid {
            grid-template-columns: 1fr;
          }

          .broker-hero-image {
            height: 300px;
          }

          .broker-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .broker-detail {
            grid-template-columns: 1fr;
          }

          .broker-detail > img {
            max-width: 320px;
          }
        }

        @media (max-width: 560px) {
          .broker-nav {
            justify-content: center;
          }

          .broker-listing-toolbar {
            padding: 13px;
          }

          .broker-listing-toolbar .broker-search,
          .broker-filter-select,
          .broker-listing-toolbar .broker-btn {
            width: 100%;
            max-width: none;
            flex: 1 1 100%;
          }

          .broker-nav-actions {
            width: 100%;
          }

          .broker-nav-actions .broker-btn {
            flex: 1;
            padding: 11px 8px;
            font-size: 12px;
          }

          .broker-dashboard-heading { align-items: flex-start; flex-direction: column; padding: 20px; }
          .broker-dashboard-stats { grid-template-columns: 1fr; }
          .broker-dashboard-profile { align-items: flex-start; }
          .broker-dashboard-action-card { align-items: flex-start; flex-direction: column; }
          .broker-dashboard-action-card .broker-btn { width: 100%; }

          .broker-hero {
            padding: 42px 0;
          }

          .broker-grid {
            grid-template-columns: 1fr;
          }

          .broker-stats {
            gap: 8px;
          }

          .broker-stat {
            padding: 11px 8px;
          }

          .broker-stat strong {
            font-size: 19px;
          }

          .broker-stat span {
            font-size: 10px;
          }

          .broker-form-wrap {
            padding: 18px;
          }

          .broker-form-grid {
            grid-template-columns: 1fr;
          }

          .broker-field-full {
            grid-column: auto;
          }

          .broker-profile-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .broker-detail-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* HERO */}
      <section className="broker-hero">
        <div className="broker-container broker-hero-grid">
          <div>
            <div className="broker-eyebrow">
              Trusted Matrimony Network
            </div>

            <h1>
              Find the Right Match
              <br />
              with <span>Trusted Brokers</span>
            </h1>

            <p>
              Connect with matrimonial brokers who help families find
              suitable brides and grooms. Browse broker profiles or
              register your own matrimonial service with Wowmate.
            </p>

            {!isBroker && (
              <div className="broker-hero-buttons">
                <button
                  type="button"
                  className="broker-btn broker-btn-primary"
                  onClick={() => selectTab("find")}
                >
                  Find a Broker →
                </button>

                <button
                  type="button"
                  className="broker-btn broker-btn-outline"
                  onClick={() => {
                    setBrokerAuthMode("register");
                    selectTab("become");
                  }}
                >
                  Become a Broker
                </button>
              </div>
            )}

            <div className="broker-stats">
              <div className="broker-stat">
                <strong>{brokers.length}+</strong>
                <span>Brokers Available</span>
              </div>

              <div className="broker-stat">
                <strong>{biodata.length}+</strong>
                <span>Biodata Profiles</span>
              </div>

              <div className="broker-stat">
                <strong>100%</strong>
                <span>Matchmaking Focus</span>
              </div>
            </div>
          </div>

          <img
            className="broker-hero-image"
            src="brokers.png"
            alt="Indian wedding celebration"
          />
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main id="broker-content" className="broker-section">
        <div className="broker-container">
          {notice && (
            <div className="broker-notice" role="status">
              {notice}
            </div>
          )}

          {/* FIND A BROKER */}
          {!isBroker && activeTab === "find" && !selectedBroker && (
            <>
              {isBroker && registeredBroker && (
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 18 }}>
                  <button
                    type="button"
                    className="broker-btn broker-btn-primary"
                    onClick={() => {
                      setSelectedBroker(null);
                      setSelectedBiodata(null);
                      setActiveTab("dashboard");
                      setNotice("");
                    }}
                  >
                    Manage Your Profiles →
                  </button>
                </div>
              )}

              <div className="broker-section-heading">
                <div className="broker-eyebrow">Find Your Matchmaker</div>
                <h2>Find a Trusted Matrimony Broker</h2>
                <p>
                  Explore broker profiles, learn about their services,
                  and browse the bride and groom biodata they manage.
                </p>
              </div>

              <div className="broker-toolbar broker-listing-toolbar">
                <input
                  className="broker-input broker-search"
                  type="search"
                  placeholder="Search by broker name, city, or bureau..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search brokers"
                />

                <select
                  className="broker-input broker-filter-select"
                  value={cityFilter}
                  onChange={(event) => setCityFilter(event.target.value)}
                  aria-label="Filter brokers by city"
                >
                  <option value="All">All cities</option>
                  {brokerCities.map((city) => <option key={city} value={city}>{city}</option>)}
                </select>

                <select
                  className="broker-input broker-filter-select"
                  value={experienceFilter}
                  onChange={(event) => setExperienceFilter(event.target.value)}
                  aria-label="Filter brokers by experience"
                >
                  <option value="All">Any experience</option>
                  <option value="0-4">0–4 years</option>
                  <option value="5-9">5–9 years</option>
                  <option value="10+">10+ years</option>
                </select>

                <select
                  className="broker-input broker-filter-select"
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                  aria-label="Sort brokers"
                >
                  <option value="name">Sort: Name A–Z</option>
                  <option value="experience">Sort: Most experienced</option>
                </select>

                <button
                  type="button"
                  className="broker-btn broker-btn-outline"
                  onClick={() => {
                    setSearch("");
                    setCityFilter("All");
                    setExperienceFilter("All");
                    setSortOrder("name");
                    setSelectedBroker(null);
                  }}
                >
                  Reset Filters
                </button>
              </div>

              {brokerDirectoryLoading && (
                <p className="broker-results-summary" role="status">
                  Loading registered broker profiles…
                </p>
              )}

              <div className="broker-results-summary" aria-live="polite">
                Showing <strong>{filteredBrokers.length}</strong> of <strong>{brokers.length}</strong> brokers
              </div>

              <div className="broker-grid">
                {filteredBrokers.map((broker) => {
                  const count = biodata.filter(
                    (person) =>
                      String(person.brokerId) === String(broker.id)
                  ).length;

                  return (
                    <article className="broker-card" key={broker.id}>
                      <img
                        className="broker-card-image"
                        src={broker.photo || "brokers.png"}
                        alt={broker.name}
                      />

                      <div className="broker-card-content">
                        <span className="broker-tag">
                          Matrimony Broker
                        </span>

                        <h3>{broker.name}</h3>

                        {hasSubscription ? (
                          <>
                            <p className="broker-muted">📍 {broker.city}</p>
                            <p className="broker-muted">💼 Experience: {broker.experience}</p>
                            <p className="broker-muted">🏢 {broker.bureau || "Independent Broker"}</p>
                            <p className="broker-muted">👥 {count} biodata profiles</p>
                            {broker.phone && (
                              <p className="broker-muted">📞 {broker.phone}</p>
                            )}
                          </>
                        ) : (
                          <div className="broker-service-card" style={{ marginTop: 12 }}>
                            <strong>🔒 Broker details locked</strong>
                            <p className="broker-muted">Subscribe to view contact information and full profile details.</p>
                          </div>
                        )}

                        <div className="broker-card-actions">
                          <button
                            className="broker-btn broker-btn-outline"
                            onClick={() => openBroker(broker)}
                          >
                            View Profile
                          </button>

                          <button
                            className="broker-btn broker-btn-primary"
                            onClick={() => hasSubscription ? openBroker(broker) : navigate("/subscription-plans")}
                          >
                            {hasSubscription ? "View Biodata" : "Subscribe to View Details"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}

                {filteredBrokers.length === 0 && (
                  <div className="broker-empty">
                    <h3>No brokers found</h3>
                    <p>
                      Try another name or city, or register as a broker.
                    </p>

                    <button
                      type="button"
                      className="broker-btn broker-btn-primary"
                      onClick={() => selectTab("become")}
                    >
                      Become a Broker
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* SELECTED BROKER AND BIODATA */}
          {!isBroker && activeTab === "find" &&
            selectedBroker &&
            !selectedBiodata && (
              <>
                <button
                  className="broker-btn broker-btn-outline broker-back"
                  onClick={returnToBrokerList}
                >
                  ← Back to Brokers
                </button>

                <div className="broker-profile-heading">
                  <img
                    src={selectedBroker.photo}
                    alt={selectedBroker.name}
                  />

                  <div>
                    <span className="broker-tag">
                      Matrimony Broker
                    </span>

                    <h2>{selectedBroker.name}</h2>

                    {hasSubscription ? (
                      <>
                        <p className="broker-muted">📍 {selectedBroker.city}</p>
                        <p className="broker-muted">💼 {selectedBroker.experience} experience</p>
                        <p className="broker-muted">🏢 {selectedBroker.bureau || "Independent Broker"}</p>
                        <p className="broker-muted">📞 {selectedBroker.phone}</p>
                        <p className="broker-muted">✉️ {selectedBroker.email || "Not provided"}</p>
                        <p className="broker-muted">{selectedBroker.about}</p>
                      </>
                    ) : (
                      <div className="broker-service-card" style={{ marginTop: 14 }}>
                        <h3>🔒 Unlock Broker Details</h3>
                        <p className="broker-muted">The photo and name are public. Subscribe using the existing Wowmate matrimony plan to view the broker's phone number, experience, location, bureau and full profile.</p>
                        <button type="button" className="broker-btn broker-btn-primary" onClick={() => navigate("/subscription-plans")}>View Subscription Plans →</button>
                      </div>
                    )}
                  </div>
                </div>

                {hasSubscription ? <>
                <div className="broker-section-heading">
                  <h2>
                    Biodata Managed by {selectedBroker.name}
                  </h2>

                  <p>
                    Select a profile to view its available details.
                    These are demonstration profiles.
                  </p>
                </div>

                <div className="broker-toolbar">
                  <div className="broker-search">
                    <label
                      htmlFor="broker-gender-filter"
                      style={{
                        display: "block",
                        marginBottom: 8,
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      Filter profiles
                    </label>

                    <select
                      id="broker-gender-filter"
                      className="broker-input"
                      value={genderFilter}
                      onChange={(event) =>
                        setGenderFilter(event.target.value)
                      }
                    >
                      <option value="All">All Profiles</option>
                      <option value="Bride">Brides</option>
                      <option value="Groom">Grooms</option>
                    </select>
                  </div>
                </div>

                <div className="broker-grid">
                  {visibleBiodata.map((person) => (
                    <article className="broker-card" key={person.id}>
                      <img
                        className="broker-card-image"
                        src={person.photo}
                        alt={person.name}
                      />

                      <div className="broker-card-content">
                        <span className="broker-tag">
                          {person.gender}
                        </span>

                        <h3>{person.name}</h3>

                        <p className="broker-muted">
                          🎂 {person.age} years
                        </p>

                        <p className="broker-muted">
                          📍 {person.city}
                        </p>

                        <p className="broker-muted">
                          🎓 {person.education}
                        </p>

                        <button
                          className="broker-btn broker-btn-primary"
                          style={{ width: "100%", marginTop: 10 }}
                          onClick={() => setSelectedBiodata(person)}
                        >
                          View Biodata Details
                        </button>
                      </div>
                    </article>
                  ))}

                  {visibleBiodata.length === 0 && (
                    <div className="broker-empty">
                      <h3>No biodata available</h3>
                      <p>
                        There are no profiles in this category for this
                        broker yet.
                      </p>
                    </div>
                  )}
                </div>
                </> : (
                  <div className="broker-service-card">
                    <h3>🔒 Bride and Groom Biodata Is for Subscribers</h3>
                    <p className="broker-muted">Subscribe to the existing matrimony plan to view this broker's managed biodata and profile details.</p>
                    <button type="button" className="broker-btn broker-btn-primary" onClick={() => navigate("/subscription-plans")}>Subscribe to View Details →</button>
                  </div>
                )}
              </>
            )}

          {/* BIODATA DETAILS */}
          {!isBroker && activeTab === "find" && selectedBiodata && hasSubscription && (
            <>
              <button
                className="broker-btn broker-btn-outline broker-back"
                onClick={() => setSelectedBiodata(null)}
              >
                ← Back to Biodata
              </button>

              <div className="broker-detail">
                <img
                  src={selectedBiodata.photo}
                  alt={selectedBiodata.name}
                />

                <div>
                  <span className="broker-tag">
                    {selectedBiodata.gender} Profile
                  </span>

                  <h2>{selectedBiodata.name}</h2>

                  <p className="broker-muted">
                    {selectedBiodata.about}
                  </p>

                  <div className="broker-detail-list">
                    <div className="broker-detail-item">
                      <span>Age</span>
                      <strong>{selectedBiodata.age} years</strong>
                    </div>

                    <div className="broker-detail-item">
                      <span>City</span>
                      <strong>{selectedBiodata.city}</strong>
                    </div>

                    <div className="broker-detail-item">
                      <span>Education</span>
                      <strong>{selectedBiodata.education}</strong>
                    </div>

                    <div className="broker-detail-item">
                      <span>Occupation</span>
                      <strong>{selectedBiodata.occupation}</strong>
                    </div>

                    <div className="broker-detail-item">
                      <span>Height</span>
                      <strong>{selectedBiodata.height}</strong>
                    </div>

                    <div className="broker-detail-item">
                      <span>Religion</span>
                      <strong>{selectedBiodata.religion}</strong>
                    </div>
                  </div>

                  <div className="broker-service-card">
                    <h3>Managed by</h3>

                    <p className="broker-muted">
                      {brokers.find(
                        (broker) =>
                          String(broker.id) ===
                          String(selectedBiodata.brokerId)
                      )?.name || "Wowmate Broker"}
                    </p>

                    <p className="broker-muted">
                      Contact details and private biodata should only
                      be shared through an authorized, consent-based
                      process.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* BROKER DASHBOARD — FRONTEND DEMO */}
          {activeTab === "dashboard" && (
            <section className="broker-dashboard">
              {!isBroker || !registeredBroker ? (
                <div className="broker-dashboard-empty">
                  <div className="broker-dashboard-empty-icon">👋</div>
                  <span className="broker-eyebrow">BROKER WORKSPACE</span>
                  <h2>Your broker dashboard starts here</h2>
                  <p>
                    Create a broker account or sign in to manage your profile and biodata.
                  </p>
                  <button
                    type="button"
                    className="broker-btn broker-btn-primary"
                    onClick={() => {
                      setBrokerAuthMode("register");
                      selectTab("become");
                    }}
                  >
                    Register as a Broker →
                  </button>
                  <button
                    type="button"
                    className="broker-btn broker-btn-outline"
                    onClick={() => {
                      setBrokerAuthMode("login");
                      selectTab("become");
                    }}
                  >
                    Login to your account
                  </button>
                </div>
              ) : (
                <>
                  <div className="broker-dashboard-heading">
                    <div>
                      <span className="broker-eyebrow">BROKER WORKSPACE</span>
                      <h2>Welcome back, {registeredBroker.name}!</h2>
                      <p>Manage your broker profile and matchmaking activity.</p>
                    </div>
                    <button
                      type="button"
                      className="broker-btn broker-btn-outline"
                      onClick={handleBrokerLogout}
                    >
                      Sign Out
                    </button>
                  </div>

                  <div className="broker-dashboard-profile">
                    <img
                      src={registeredBroker.photo || "brokers.png"}
                      alt={registeredBroker.name}
                    />
                    <div className="broker-dashboard-profile-copy">
                      <h3>{registeredBroker.name}</h3>
                      <p>📍 {registeredBroker.city}</p>
                      <p>🏢 {registeredBroker.bureau || "Independent Broker"}</p>
                      <p>✉️ {registeredBroker.email}</p>
                    </div>
                    <button
                      type="button"
                      className="broker-btn broker-btn-outline"
                      onClick={() => {
                        setActiveTab("find");
                        setSelectedBroker(registeredBroker);
                        setSelectedBiodata(null);
                      }}
                    >
                      View Public Profile
                    </button>
                  </div>

                  <div className="broker-dashboard-stats">
                    <article className="broker-dashboard-stat">
                      <span className="broker-dashboard-stat-icon">📄</span>
                      <span className="broker-dashboard-stat-label">My biodata</span>
                      <strong>{biodata.filter((item) => String(item.brokerId) === String(registeredBroker.id)).length}</strong>
                      <small>Bride and groom profiles</small>
                    </article>
                    <article className="broker-dashboard-stat">
                      <span className="broker-dashboard-stat-icon">👁️</span>
                      <span className="broker-dashboard-stat-label">Profile status</span>
                      <strong>Demo</strong>
                      <small>Not submitted for verification</small>
                    </article>
                    <article className="broker-dashboard-stat">
                      <span className="broker-dashboard-stat-icon">📬</span>
                      <span className="broker-dashboard-stat-label">Enquiries</span>
                      <strong>0</strong>
                      <small>Enquiries are not connected yet</small>
                    </article>
                  </div>

                  <div className="broker-dashboard-actions">
                    <article className="broker-dashboard-action-card">
                      <div className="broker-dashboard-action-icon">💑</div>
                      <div>
                        <h3>Manage Bride & Groom Biodata</h3>
                        <p>Add sample biodata to your broker profile.</p>
                      </div>
                      <button
                        type="button"
                        className="broker-btn broker-btn-primary"
                        onClick={() => {
                          setActiveTab("become");
                          setBiodataForm(emptyBiodataForm);
                          setBiodataPhoto("");
                          setEditingBiodataId(null);
                          setShowBiodataForm(true);
                          setNotice("");
                        }}
                      >
                        + Add Biodata
                      </button>
                    </article>
                    <article className="broker-dashboard-action-card">
                      <div className="broker-dashboard-action-icon">👤</div>
                      <div>
                        <h3>Broker Profile</h3>
                        <p>Review the public profile details you registered.</p>
                      </div>
                      <button
                        type="button"
                        className="broker-btn broker-btn-outline"
                        onClick={() => {
                          setActiveTab("find");
                          setSelectedBroker(registeredBroker);
                          setSelectedBiodata(null);
                        }}
                      >
                        View Profile
                      </button>
                      <button
                        type="button"
                        className="broker-btn broker-btn-primary"
                        onClick={() => {
                          setBrokerProfileForm({
                            businessName: registeredBroker.bureau || "",
                            experienceYears: Number.parseInt(registeredBroker.experience, 10) || 0,
                            city: registeredBroker.city || "",
                            serviceArea: registeredBroker.serviceArea || "",
                            about: registeredBroker.about || "",
                          });
                          setShowBrokerProfileForm(true);
                          setNotice("");
                        }}
                      >
                        ✏️ Edit Profile
                      </button>
                    </article>
                  </div>

                  {showBrokerProfileForm && (
                    <form
                      className="broker-form-wrap"
                      onSubmit={handleBrokerProfileUpdate}
                      style={{ marginTop: 25, marginBottom: 25 }}
                    >
                      <h3>Edit Your Broker Profile</h3>
                      <p className="broker-muted">
                        Update your business details. Changes are saved to your Wowmate account.
                      </p>

                      {brokerProfileLoading ? (
                        <p>Loading your broker profile...</p>
                      ) : (
                        <>
                          <div className="broker-form-grid">
                            <div className="broker-field">
                              <label htmlFor="broker-business-name">Business Name *</label>
                              <input
                                id="broker-business-name"
                                className="broker-input"
                                value={brokerProfileForm.businessName}
                                onChange={(event) => setBrokerProfileForm({ ...brokerProfileForm, businessName: event.target.value })}
                                required
                              />
                            </div>
                            <div className="broker-field">
                              <label htmlFor="broker-experience">Experience (Years) *</label>
                              <input
                                id="broker-experience"
                                className="broker-input"
                                type="number"
                                min="0"
                                max="80"
                                value={brokerProfileForm.experienceYears}
                                onChange={(event) => setBrokerProfileForm({ ...brokerProfileForm, experienceYears: event.target.value })}
                                required
                              />
                            </div>
                            <div className="broker-field">
                              <label htmlFor="broker-city">City *</label>
                              <input
                                id="broker-city"
                                className="broker-input"
                                value={brokerProfileForm.city}
                                onChange={(event) => setBrokerProfileForm({ ...brokerProfileForm, city: event.target.value })}
                                required
                              />
                            </div>
                            <div className="broker-field">
                              <label htmlFor="broker-service-area">Service Area *</label>
                              <input
                                id="broker-service-area"
                                className="broker-input"
                                value={brokerProfileForm.serviceArea}
                                onChange={(event) => setBrokerProfileForm({ ...brokerProfileForm, serviceArea: event.target.value })}
                                required
                              />
                            </div>
                            <div className="broker-field broker-field-full">
                              <label htmlFor="broker-about">About Your Services *</label>
                              <textarea
                                id="broker-about"
                                className="broker-input"
                                value={brokerProfileForm.about}
                                onChange={(event) => setBrokerProfileForm({ ...brokerProfileForm, about: event.target.value })}
                                required
                              />
                            </div>
                          </div>
                          <div className="broker-card-actions">
                            <button type="submit" className="broker-btn broker-btn-primary" disabled={brokerProfileSaving || brokerProfileLoading}>
                              {brokerProfileSaving ? "Saving..." : "Save Profile"}
                            </button>
                            <button type="button" className="broker-btn broker-btn-outline" onClick={() => setShowBrokerProfileForm(false)} disabled={brokerProfileSaving}>
                              Cancel
                            </button>
                          </div>
                        </>
                      )}
                    </form>
                  )}

                  <section className="broker-dashboard-biodata">
                    <div className="broker-dashboard-biodata-heading">
                      <div>
                        <span className="broker-eyebrow">YOUR RECORDS</span>
                        <h3>Manage Bride & Groom Biodata</h3>
                        <p>Review, edit, or remove the biodata you added in this session.</p>
                      </div>
                      <button type="button" className="broker-btn broker-btn-primary" onClick={() => {
                        setBiodataForm(emptyBiodataForm); setBiodataPhoto(""); setEditingBiodataId(null);
                        setShowBiodataForm(true); setActiveTab("become"); setNotice("");
                      }}>+ Add Biodata</button>
                    </div>
                    {biodata.filter((item) => String(item.brokerId) === String(registeredBroker.id)).length === 0 ? (
                      <div className="broker-dashboard-biodata-empty">
                        <span>💑</span><h4>No biodata added yet</h4>
                        <p>Add a bride or groom profile to manage it here.</p>
                      </div>
                    ) : (
                      <div className="broker-dashboard-biodata-grid">
                        {biodata.filter((item) => String(item.brokerId) === String(registeredBroker.id)).map((profile) => (
                          <article className="broker-dashboard-biodata-card" key={profile.id}>
                            <img src={profile.photo} alt={profile.name} />
                            <div className="broker-dashboard-biodata-copy">
                              <span className="broker-dashboard-biodata-tag">{profile.gender}</span>
                              <h4>{profile.name}</h4>
                              <p>{profile.age} years · {profile.city}</p>
                              <p>{profile.education || "Education not added"}</p>
                              <p>{profile.occupation || "Occupation not added"}</p>
                            </div>
                            <div className="broker-dashboard-biodata-buttons">
                              <button type="button" className="broker-btn broker-btn-outline" onClick={() => handleEditBiodata(profile)}>✏️ Edit</button>
                              <button type="button" className="broker-btn broker-btn-danger" onClick={() => handleDeleteBiodata(profile)}>🗑 Delete</button>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </section>

                  <p className="broker-dashboard-demo-note">
                    Demo only: biodata changes stay in this page session and may be lost after refresh. Enquiries, secure access, and admin approval are not connected to a backend. Only manage profiles with the person's permission.
                  </p>
                </>
              )}
            </section>
          )}

          {/* BECOME A BROKER */}
          {activeTab === "become" && (
            <>
              <div className="broker-section-heading">
                <div className="broker-eyebrow">
                  {showBiodataForm ? "Broker Workspace" : "Join Wowmate"}
                </div>

                <h2>
                  {showBiodataForm
                    ? `${editingBiodataId ? "Edit" : "Add"} Bride or Groom Biodata`
                    : "Become a Matrimony Broker"}
                </h2>

                <p>
                  {showBiodataForm
                    ? "Add the profile details you have permission to share with families."
                    : "Create your broker profile and upload your photo for free. Your photo and name can be discovered publicly; users need an active matrimony subscription to view your contact information and full broker details."}
                </p>
              </div>

              {isBroker && registeredBroker && showBiodataForm ? (
                <form className="broker-form-wrap" onSubmit={handleBiodataSubmit}>
                  <div className="broker-form-grid">
                    <div className="broker-field">
                      <label htmlFor="biodata-name">Full name *</label>
                      <input
                        id="biodata-name"
                        className="broker-input"
                        value={biodataForm.name}
                        onChange={(event) =>
                          setBiodataForm({ ...biodataForm, name: event.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="broker-field">
                      <label htmlFor="biodata-gender">Profile type *</label>
                      <select
                        id="biodata-gender"
                        className="broker-input"
                        value={biodataForm.gender}
                        onChange={(event) =>
                          setBiodataForm({ ...biodataForm, gender: event.target.value })
                        }
                        required
                      >
                        <option value="Bride">Bride</option>
                        <option value="Groom">Groom</option>
                      </select>
                    </div>

                    <div className="broker-field">
                      <label htmlFor="biodata-age">Age *</label>
                      <input
                        id="biodata-age"
                        className="broker-input"
                        type="number"
                        min="18"
                        max="100"
                        value={biodataForm.age}
                        onChange={(event) =>
                          setBiodataForm({ ...biodataForm, age: event.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="broker-field">
                      <label htmlFor="biodata-city">City *</label>
                      <input
                        id="biodata-city"
                        className="broker-input"
                        value={biodataForm.city}
                        onChange={(event) =>
                          setBiodataForm({ ...biodataForm, city: event.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="broker-field">
                      <label htmlFor="biodata-education">Education</label>
                      <input
                        id="biodata-education"
                        className="broker-input"
                        value={biodataForm.education}
                        onChange={(event) =>
                          setBiodataForm({ ...biodataForm, education: event.target.value })
                        }
                      />
                    </div>

                    <div className="broker-field">
                      <label htmlFor="biodata-occupation">Occupation</label>
                      <input
                        id="biodata-occupation"
                        className="broker-input"
                        value={biodataForm.occupation}
                        onChange={(event) =>
                          setBiodataForm({ ...biodataForm, occupation: event.target.value })
                        }
                      />
                    </div>

                    <div className="broker-field">
                      <label htmlFor="biodata-height">Height</label>
                      <input
                        id="biodata-height"
                        className="broker-input"
                        value={biodataForm.height}
                        onChange={(event) =>
                          setBiodataForm({ ...biodataForm, height: event.target.value })
                        }
                      />
                    </div>

                    <div className="broker-field">
                      <label htmlFor="biodata-religion">Religion</label>
                      <input
                        id="biodata-religion"
                        className="broker-input"
                        value={biodataForm.religion}
                        onChange={(event) =>
                          setBiodataForm({ ...biodataForm, religion: event.target.value })
                        }
                      />
                    </div>

                    <div className="broker-field broker-field-full">
                      <label htmlFor="biodata-about">About</label>
                      <textarea
                        id="biodata-about"
                        className="broker-input"
                        value={biodataForm.about}
                        onChange={(event) =>
                          setBiodataForm({ ...biodataForm, about: event.target.value })
                        }
                      />
                    </div>

                    <div className="broker-field broker-field-full">
                      <label htmlFor="biodata-photo">Profile photo *</label>
                      <div className="broker-upload">
                        {biodataPhoto && (
                          <img src={biodataPhoto} alt="Biodata profile preview" />
                        )}
                        <input
                          id="biodata-photo"
                          type="file"
                          accept="image/*"
                          onChange={handleBiodataPhoto}
                          required={!biodataPhoto}
                        />
                        <p className="broker-muted">Choose an image smaller than 5 MB.</p>
                      </div>
                    </div>
                  </div>

                  <div className="broker-card-actions">
                    <button type="submit" className="broker-btn broker-btn-primary">
                      {editingBiodataId ? "Save Changes" : "Add Biodata"}
                    </button>
                    <button
                      type="button"
                      className="broker-btn broker-btn-outline"
                      onClick={() => {
                        setShowBiodataForm(false);
                        setBiodataForm(emptyBiodataForm);
                        setBiodataPhoto("");
                        setEditingBiodataId(null);
                        setActiveTab("dashboard");
                        setNotice("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : isBroker && registeredBroker ? (
                <div className="broker-form-wrap">
                  <h3>Welcome, {registeredBroker.name}!</h3>
                  <p className="broker-muted">
                    Your broker account is active. Manage your profile and biodata from your dashboard.
                  </p>
                  <button
                    type="button"
                    className="broker-btn broker-btn-primary"
                    onClick={() => setActiveTab("dashboard")}
                  >
                    Manage Your Profiles →
                  </button>
                </div>
              ) : (
                <div className="broker-form-wrap">
                  <h3 style={{ marginTop: 0 }}>Join Wowmate as a Broker</h3>
                  <p className="broker-muted">
                    Broker registration and login are handled securely through the main Wowmate account pages.
                  </p>
                  <div className="broker-auth-switch">
                    <Link className="broker-btn broker-btn-primary" to="/register?role=broker">
                      Become a Broker
                    </Link>
                    <Link className="broker-btn broker-btn-outline" to="/login">
                      Broker Login
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* SERVICES */}
      <section className="broker-section broker-services">
        <div className="broker-container">
          <div className="broker-section-heading">
            <div className="broker-eyebrow">Our Services</div>
            <h2>How Wowmate Brokers Help</h2>
            <p>
              Support for families and brokers throughout the
              matchmaking process.
            </p>
          </div>

          <div className="broker-grid">
            <div className="broker-service-card">
              <div className="broker-service-icon">👰</div>
              <h3>Bride Profiles</h3>
              <p className="broker-muted">
                Organize bride biodata and help families discover
                compatible matches.
              </p>
            </div>

            <div className="broker-service-card">
              <div className="broker-service-icon">🤵</div>
              <h3>Groom Profiles</h3>
              <p className="broker-muted">
                Manage groom profiles and support meaningful family
                connections.
              </p>
            </div>

            <div className="broker-service-card">
              <div className="broker-service-icon">🤝</div>
              <h3>Matchmaking Support</h3>
              <p className="broker-muted">
                Help families communicate and explore suitable
                matrimonial matches.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="broker-section">
        <div className="broker-container">
          <div className="broker-section-heading">
            <div className="broker-eyebrow">Need Assistance?</div>
            <h2>Contact Our Team</h2>
            <p>
              Send an enquiry about broker services or matchmaking
              assistance.
            </p>
          </div>

          <form
            className="broker-form-wrap"
            onSubmit={handleContactSubmit}
          >
            <div className="broker-form-grid">
              <div className="broker-field">
                <label>Your Name *</label>

                <input
                  className="broker-input"
                  value={contactForm.name}
                  onChange={(event) =>
                    setContactForm({
                      ...contactForm,
                      name: event.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="broker-field">
                <label>Mobile Number *</label>

                <input
                  className="broker-input"
                  type="tel"
                  value={contactForm.phone}
                  onChange={(event) =>
                    setContactForm({
                      ...contactForm,
                      phone: event.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="broker-field">
                <label>City *</label>

                <input
                  className="broker-input"
                  value={contactForm.city}
                  onChange={(event) =>
                    setContactForm({
                      ...contactForm,
                      city: event.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="broker-field">
                <label>Service Required *</label>

                <select
                  className="broker-input"
                  value={contactForm.service}
                  onChange={(event) =>
                    setContactForm({
                      ...contactForm,
                      service: event.target.value,
                    })
                  }
                >
                  <option>Find a suitable match</option>
                  <option>Become a broker</option>
                  <option>Manage bride/groom biodata</option>
                  <option>General enquiry</option>
                </select>
              </div>

              <div className="broker-field broker-field-full">
                <label>Message</label>

                <textarea
                  className="broker-input"
                  value={contactForm.message}
                  onChange={(event) =>
                    setContactForm({
                      ...contactForm,
                      message: event.target.value,
                    })
                  }
                  placeholder="How can we help you?"
                />
              </div>
            </div>

            <button
              type="submit"
              className="broker-btn broker-btn-primary"
              style={{ width: "100%", marginTop: 20 }}
            >
              Submit Enquiry
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="broker-footer">
        <div className="broker-container">
          <strong style={{ fontSize: 22 }}>
            Wow<span style={{ color: "#cd15f6" }}>Mate</span>
          </strong>

          <p>
            Helping families begin beautiful new journeys together.
          </p>

          <p style={{ marginTop: 10 }}>
            © {new Date().getFullYear()} Wowmate. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}