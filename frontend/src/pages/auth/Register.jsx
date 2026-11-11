// src/pages/Register.jsx



import { useEffect, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import {

  Heart,

  UserRound,

  Mail,

  Phone,

  LockKeyhole,

  Eye,

  EyeOff,

  MapPin,

  GraduationCap,

  BriefcaseBusiness,

  Users,

  Sparkles,

  ArrowRight,

  ArrowLeft,

  CheckCircle2,

  ShieldCheck,

  HeartHandshake,

} from "lucide-react";



const MAX_DATE_OF_BIRTH = new Date().toISOString().split("T")[0];
const REGISTERED_PROFILES_KEY = "apnishaadi_registered_profiles";

async function prepareProfilePhoto(file) {
  const image = new Image();
  const objectUrl = URL.createObjectURL(file);

  try {
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error("Unable to read one of your photos."));
      image.src = objectUrl;
    });

    const maxDimension = 640;
    const scale = Math.min(
      1,
      maxDimension / Math.max(image.naturalWidth, image.naturalHeight)
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Unable to process one of your photos.");
    }

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", 0.72);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}



export default function Register() {

  const navigate = useNavigate();
  const location = useLocation();

  // Broker Services should open this same registration page with ?role=broker.
  // Also accept accountType/type for compatibility with existing links.
  const requestedAccountType = (() => {
    const params = new URLSearchParams(location.search);
    const requestedRole = (
      params.get("role") ||
      params.get("accountType") ||
      params.get("type") ||
      ""
    ).toLowerCase();

    return requestedRole === "broker" ? "broker" : "matrimony";
  })();



  const [step, setStep] = useState(1);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [userPhotos, setUserPhotos] = useState([]);



  const [formData, setFormData] = useState({

    accountType: requestedAccountType,

    profileFor: "Self",

    fullName: "",

    email: "",

    mobile: "",

    brokerBusinessName: "",
    brokerExperience: "",
    brokerCity: "",
    brokerServiceArea: "",
    brokerAbout: "",

    password: "",

    confirmPassword: "",



    gender: "",

    dateOfBirth: "",

    height: "",

    maritalStatus: "",



    community: "",

    education: "",

    profession: "",

    annualIncome: "",



    country: "India",

    state: "",

    city: "",



    partnerAgeMin: "23",

    partnerAgeMax: "30",

    partnerEducation: "",

    partnerProfession: "",

    partnerLocation: "",



    interests: [],

    lifestyle: "",

    familyValues: "",

    partnerExpectations: "",



    agreeTerms: false,

  });

  // Keep the selected account type in sync when a user opens
  // /register?role=broker from the Broker Services page.
  useEffect(() => {
    setFormData((previous) => ({
      ...previous,
      accountType: requestedAccountType,
    }));
    setStep(1);
    setError("");
    setSuccess(false);
  }, [requestedAccountType, location.key]);

  const totalSteps = formData.accountType === "broker" ? 1 : 4;



  const updateField = (event) => {

    const { name, value, type, checked } = event.target;



    setFormData((previous) => ({

      ...previous,

      [name]: type === "checkbox" ? checked : value,

    }));



    setError("");

  };



  const handleUserPhotoUpload = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    if (userPhotos.length + files.length > 4) {
      setError("You can upload a maximum of 4 photos.");
      event.target.value = "";
      return;
    }

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError("Please select valid image files.");
        event.target.value = "";
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Each photo must be smaller than 5 MB.");
        event.target.value = "";
        return;
      }
    }

    const newPhotos = files.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }));
    setUserPhotos((previous) => [...previous, ...newPhotos]);
    setError("");
    event.target.value = "";
  };

  const removeUserPhoto = (photoId) => {
    setUserPhotos((previous) => {
      const photoToRemove = previous.find((photo) => photo.id === photoId);
      if (photoToRemove) URL.revokeObjectURL(photoToRemove.preview);
      return previous.filter((photo) => photo.id !== photoId);
    });
    setError("");
  };

  const toggleInterest = (interest) => {

    setFormData((previous) => ({

      ...previous,

      interests: previous.interests.includes(interest)

        ? previous.interests.filter((item) => item !== interest)

        : [...previous.interests, interest],

    }));

  };



  const calculateAge = (dateOfBirth) => {

    if (!dateOfBirth) return 0;



    const birthDate = new Date(dateOfBirth);

    const today = new Date();



    let age = today.getFullYear() - birthDate.getFullYear();



    const monthDifference = today.getMonth() - birthDate.getMonth();



    if (

      monthDifference < 0 ||

      (monthDifference === 0 && today.getDate() < birthDate.getDate())

    ) {

      age--;

    }



    return age;

  };



  const validateStep = () => {

    setError("");



    if (step === 1) {

      if (

        !formData.fullName.trim() ||

        !formData.email.trim() ||

        !formData.mobile.trim() ||

        !formData.password ||

        !formData.confirmPassword

      ) {

        setError("Please complete all required account details.");

        return false;

      }



      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {

        setError("Please enter a valid email address.");

        return false;

      }



      if (!/^\+?[0-9\s()-]{10,18}$/.test(formData.mobile.trim())) {

        setError("Please enter a valid mobile number.");

        return false;

      }



      if (formData.password.length < 8) {

        setError("Your password must contain at least 8 characters.");

        return false;

      }



      if (formData.password !== formData.confirmPassword) {

        setError("Your passwords do not match.");

        return false;

      }

      if (formData.accountType === "broker") {
        if (!formData.brokerBusinessName.trim() || !formData.brokerExperience || !formData.brokerCity.trim() || !formData.brokerServiceArea.trim() || !formData.brokerAbout.trim()) {
          setError("Please complete all required broker details.");
          return false;
        }
        const experience = Number(formData.brokerExperience);
        if (!Number.isFinite(experience) || experience < 0 || experience > 80) {
          setError("Please enter broker experience between 0 and 80 years.");
          return false;
        }
      }

    }



    if (step === 2) {

      if (

        !formData.gender ||

        !formData.dateOfBirth ||

        !formData.maritalStatus ||

        !formData.education ||

        !formData.profession

      ) {

        setError("Please complete the required personal and career details.");

        return false;

      }



      const age = calculateAge(formData.dateOfBirth);



      if (age < 18 || age > 100) {

        setError("Registration is available to adults aged 18 and above.");

        return false;

      }



      if (formData.gender === "Other") {

        // The form accepts this selection.

      }

    }



    if (step === 3) {

      if (!formData.country || !formData.state.trim() || !formData.city.trim()) {

        setError("Please enter your country, state, and city.");

        return false;

      }



      const minAge = Number(formData.partnerAgeMin);

      const maxAge = Number(formData.partnerAgeMax);



      if (

        !Number.isFinite(minAge) ||

        !Number.isFinite(maxAge) ||

        minAge < 18 ||

        maxAge > 100 ||

        minAge > maxAge

      ) {

        setError("Please enter a valid preferred partner age range.");

        return false;

      }

    }



    if (step === 4) {

      if (!formData.agreeTerms) {

        setError("Please accept the Terms and Privacy Policy to continue.");

        return false;

      }

    }



    return true;

  };



  const nextStep = () => {

    if (!validateStep()) return;



    if (step < totalSteps) {

      setStep((previous) => previous + 1);

      window.scrollTo({ top: 0, behavior: "smooth" });

    }

  };



  const previousStep = () => {

    setError("");



    if (step > 1) {

      setStep((previous) => previous - 1);

      window.scrollTo({ top: 0, behavior: "smooth" });

    }

  };



  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateStep()) return;

    setError("");
    try {
      const photos = await Promise.all(
        userPhotos.map(({ file }) => prepareProfilePhoto(file))
      );
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          accountType: formData.accountType,
          role: formData.accountType === "broker" ? "broker" : "user",
          mobile: formData.mobile.trim(),
          ...(formData.accountType === "broker" ? {
            brokerDetails: {
              businessName: formData.brokerBusinessName.trim(),
              experienceYears: Number(formData.brokerExperience),
              city: formData.brokerCity.trim(),
              serviceArea: formData.brokerServiceArea.trim(),
              about: formData.brokerAbout.trim(),
            },
          } : {}),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed. Please try again.");
      }

      if (formData.accountType === "matrimony") {
        const profile = {
          id: `member-${result.user?.id || Date.now()}`,
          name: formData.fullName.trim(),
          age: calculateAge(formData.dateOfBirth),
          gender:
            formData.gender === "Female"
              ? "Bride"
              : formData.gender === "Male"
                ? "Groom"
                : "Other",
          profession: formData.profession,
          education: formData.education,
          location: [formData.city, formData.state, formData.country]
            .filter(Boolean)
            .join(", "),
          category: /farmer|agricultur/i.test(formData.profession)
            ? "Farmer"
            : "Professional",
          height: formData.height,
          image: photos[0] || "",
          photos,
          about:
            formData.partnerExpectations.trim() ||
            [formData.lifestyle, formData.familyValues]
              .filter(Boolean)
              .join(" · ") ||
            "Wowmate member",
          maritalStatus: formData.maritalStatus,
          community: formData.community,
          annualIncome: formData.annualIncome,
          interests: formData.interests,
          profileFor: formData.profileFor,
        };

        try {
          const storedProfiles = localStorage.getItem(REGISTERED_PROFILES_KEY);
          const profiles = storedProfiles ? JSON.parse(storedProfiles) : [];

          if (!Array.isArray(profiles)) {
            throw new Error("Saved profile list is not in a valid format.");
          }

          localStorage.setItem(
            REGISTERED_PROFILES_KEY,
            JSON.stringify([
              ...profiles.filter((existing) => existing.id !== profile.id),
              profile,
            ])
          );
          window.dispatchEvent(new Event("apnishaadi-profiles-updated"));
          setProfileSaved(true);
        } catch (storageError) {
          console.error("Unable to add registered profile to Explore:", storageError);
          setProfileSaved(false);
          setError(
            "Your account was created, but your profile could not be added to Explore on this browser. Check available browser storage and try again."
          );
        }

      } else {
        setProfileSaved(false);
      }

      if (formData.accountType === "broker") {
        navigate(`/login?identifier=${encodeURIComponent(formData.email.trim().toLowerCase())}`, {
          replace: true,
        });
        return;
      }

      // Registration now returns a JWT. Save it so the new member is signed in.
      if (!result.token) {
        throw new Error(
          "Your account was created, but the login token was not returned. Please log in."
        );
      }

      localStorage.setItem("token", result.token);
      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      // Matrimony members go straight to Discover Profiles after registration.
      navigate("/discover-profiles", { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the server. Please try again."
      );
    }
  };



  const interestsList = [

    "Travel",

    "Cooking",

    "Music",

    "Reading",

    "Fitness",

    "Farming",

    "Business",

    "Movies",

    "Nature",

    "Sports",

    "Technology",

    "Family time",

  ];



  const stepLabels = formData.accountType === "broker"
    ? ["Broker account"]
    : ["Account", "About you", "Preferences", "Interests"];


  const inputClass = "register-input";



  return (

    <div className="as-register">

      <style>{`

        @import url('image.png');



        .as-register {

          --as-primary: #8b5cf6;

          --as-primary-dark: #6d28d9;

          --as-rose: #f5f0ff;
          --as-border: #ddd6fe;
          --as-text: #30264a;
          --as-muted: #716783;

          min-height: 100vh;

          padding: 30px 18px 55px;

          background:

            radial-gradient(ellipse at top left, #f5f0ff 0%, transparent 38%),

            radial-gradient(ellipse at bottom right, #f9e7ef 0%, transparent 34%),

            #fffafc;

          color: var(--as-text);

          font-family: 'DM Sans', sans-serif;

        }



        .as-register * {

          box-sizing: border-box;

        }



        .as-register button,

        .as-register input,

        .as-register select,

        .as-register textarea {

          font: inherit;

        }



        .as-register-header {

          max-width: 1160px;

          margin: 0 auto 30px;

          display: flex;

          justify-content: space-between;

          align-items: center;

          gap: 16px;

        }



        .as-register-brand {

          display: flex;

          align-items: center;

          flex-shrink: 0;

          text-decoration: none;

        }



        .as-register-logo {

          display: block;

          width: 230px;

          height: 62px;

          object-fit: contain;

        }



        .as-register-login {

          font-size: 14px;

          color: var(--as-muted);

        }



        .as-register-login a {

          color: var(--as-primary);

          font-weight: 700;

          text-decoration: none;

          margin-left: 4px;

        }



        .as-register-layout {

          max-width: 1160px;

          margin: auto;

          display: grid;

          grid-template-columns: 0.82fr 1.18fr;

          gap: 32px;

          align-items: start;

        }



        .as-register-sidebar {

          padding: 40px 28px;

          position: sticky;

          top: 25px;

          border-radius: 27px;

          overflow: hidden;

          background: linear-gradient(145deg, #8e254f, #5b1735);

          color: white;

          box-shadow: 0 20px 50px #72214225;

        }



        .as-register-sidebar::before,

        .as-register-sidebar::after {

          content: "";

          position: absolute;

          border: 1px solid #ffffff18;

          border-radius: 50%;

          pointer-events: none;

        }



        .as-register-sidebar::before {

          width: 330px;

          height: 330px;

          right: -190px;

          top: -150px;

        }



        .as-register-sidebar::after {

          width: 250px;

          height: 250px;

          left: -165px;

          bottom: -140px;

        }



        .as-register-sidebar-content {

          position: relative;

          z-index: 1;

        }



        .as-register-eyebrow {

          display: inline-flex;

          align-items: center;

          gap: 7px;

          padding: 8px 12px;

          background: #ffffff17;

          border: 1px solid #ffffff20;

          border-radius: 30px;

          font-size: 12px;

          font-weight: 600;

        }



        .as-register-sidebar h1 {

          font-family: 'Playfair Display', serif;

          font-size: clamp(30px, 3.5vw, 43px);

          line-height: 1.2;

          margin: 27px 0 15px;

          letter-spacing: -.7px;

        }



        .as-register-sidebar > p {

          color: #f7e7ed;

          line-height: 1.8;

          font-size: 14px;

          margin: 0;

        }



        .as-register-benefits {

          display: grid;

          gap: 20px;

          margin-top: 35px;

        }



        .as-register-benefit {

          display: flex;

          gap: 13px;

          align-items: flex-start;

        }



        .as-register-benefit-icon {

          width: 41px;

          height: 41px;

          flex-shrink: 0;

          display: grid;

          place-items: center;

          background: #ffffff17;

          border-radius: 13px;

        }



        .as-register-benefit strong {

          display: block;

          font-size: 14px;

          margin-bottom: 5px;

        }



        .as-register-benefit span {

          display: block;

          color: #f4dce6;

          font-size: 12px;

          line-height: 1.6;

        }



        .as-register-sidebar-note {

          margin-top: 35px;

          padding-top: 20px;

          border-top: 1px solid #ffffff24;

          display: flex;

          gap: 9px;

          align-items: center;

          color: #f4dce6;

          font-size: 12px;

          line-height: 1.6;

        }



        .as-register-card {

          background: white;

          border: 1px solid #f0e5eb;

          border-radius: 25px;

          padding: 34px;

          box-shadow: 0 15px 50px #6b244010;

          min-width: 0;

        }



        .as-register-card-heading {

          margin-bottom: 26px;

        }



        .as-register-card-heading h2 {

          margin: 0 0 8px;

          font-family: 'Playfair Display', serif;

          font-size: 30px;

          font-weight: 600;

          letter-spacing: -.5px;

        }



        .as-register-card-heading p {

          margin: 0;

          color: var(--as-muted);

          font-size: 13px;

          line-height: 1.7;

        }



        .as-register-stepper {

          display: grid;

          grid-template-columns: repeat(4, minmax(0, 1fr));

          gap: 8px;

          margin-bottom: 31px;

        }



        .as-register-step {

          min-width: 0;

          position: relative;

        }



        .as-register-step-track {

          height: 5px;

          border-radius: 20px;

          background: #f0e7eb;

          margin-bottom: 10px;

          overflow: hidden;

        }



        .as-register-step-track span {

          display: block;

          width: 0;

          height: 100%;

          border-radius: 20px;

          background: var(--as-primary);

          transition: width .25s ease;

        }



        .as-register-step.active .as-register-step-track span,

        .as-register-step.complete .as-register-step-track span {

          width: 100%;

        }



        .as-register-step-label {

          color: #9c8c94;

          font-size: 10px;

          font-weight: 600;

          white-space: nowrap;

        }



        .as-register-step.active .as-register-step-label,

        .as-register-step.complete .as-register-step-label {

          color: var(--as-primary);

        }



        .as-register-section-title {

          display: flex;

          align-items: center;

          gap: 10px;

          font-size: 15px;

          font-weight: 700;

          margin: 0 0 19px;

        }



        .as-register-section-icon {

          display: grid;

          place-items: center;

          width: 35px;

          height: 35px;

          border-radius: 11px;

          background: var(--as-rose);

          color: var(--as-primary);

          flex-shrink: 0;

        }



        .as-register-grid {

          display: grid;

          grid-template-columns: repeat(2, minmax(0, 1fr));

          gap: 18px 15px;

        }



        .as-register-field {

          min-width: 0;

        }



        .as-register-field.full {

          grid-column: 1 / -1;

        }



        .as-register-field label {

          display: block;

          margin-bottom: 8px;

          color: #4c3a43;

          font-size: 12px;

          font-weight: 700;

        }



        .as-register-field label .required {

          color: #c23768;

          margin-left: 3px;

        }



        .as-register-control {

          position: relative;

        }



        .as-register-control > svg {

          position: absolute;

          left: 13px;

          top: 50%;

          transform: translateY(-50%);

          color: #a38d98;

          pointer-events: none;

        }



        .as-register .register-input,

        .as-register select.register-input,

        .as-register textarea.register-input {

          display: block;

          width: 100%;

          min-width: 0;

          min-height: 46px;

          padding: 12px 13px;

          border: 1px solid var(--as-border);

          border-radius: 11px;

          background: #fff;

          color: var(--as-text);

          outline: none;

          font-size: 12px;

          transition: border-color .2s, box-shadow .2s;

        }



        .as-register-control .register-input {

          padding-left: 40px;

        }



        .as-register .register-input:focus {

          border-color: #b84a75;

          box-shadow: 0 0 0 3px #a72d5c12;

        }



        .as-register .register-input::placeholder {

          color: #b5a5ad;

        }



        .as-register textarea.register-input {

          min-height: 105px;

          resize: vertical;

          line-height: 1.7;

        }



        .as-register-password-toggle {

          position: absolute;

          right: 10px;

          top: 50%;

          transform: translateY(-50%);

          border: 0;

          background: transparent;

          color: #8d7883;

          cursor: pointer;

          padding: 5px;

          display: grid;

          place-items: center;

        }



        .as-register .password-input {

          padding-right: 42px;

        }



        .as-register-help {

          margin: 7px 0 0;

          color: #9b8a93;

          font-size: 10px;

          line-height: 1.6;

        }



        .as-register-profile-options {

          display: grid;

          grid-template-columns: repeat(3, minmax(0, 1fr));

          gap: 10px;

        }



        .as-register-account-types {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 10px;
        }

        .as-register-account-option {
          position: relative;
          min-width: 0;
        }

        .as-register-account-option input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .as-register-account-option label {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          height: 100%;
          min-height: 145px;
          padding: 18px;
          border: 1px solid var(--as-border);
          border-radius: 15px;
          background: #fff;
          color: var(--as-text);
          cursor: pointer;
          transition: border-color .2s, background .2s, box-shadow .2s, transform .2s;
        }

        .as-register-account-option label svg {
          color: var(--as-primary);
        }

        .as-register-account-option label strong {
          font-size: 14px;
        }

        .as-register-account-option label span {
          color: var(--as-muted);
          font-size: 11px;
          line-height: 1.6;
          font-weight: 400;
        }

        .as-register-account-option input:checked + label {
          border-color: var(--as-primary);
          background: #f8f3ff;
          box-shadow: 0 0 0 2px #8b5cf618;
        }

        .as-register-account-option input:focus-visible + label {
          outline: 2px solid var(--as-primary);
          outline-offset: 3px;
        }

        .as-register-option {

          min-width: 0;

          position: relative;

        }



        .as-register-option input {

          position: absolute;

          opacity: 0;

          pointer-events: none;

        }



        .as-register-option label {

          display: flex;

          min-height: 69px;

          justify-content: center;

          align-items: center;

          flex-direction: column;

          gap: 7px;

          padding: 12px 6px;

          text-align: center;

          border: 1px solid var(--as-border);

          border-radius: 12px;

          cursor: pointer;

          color: #6c5661;

          font-size: 11px;

          transition: .2s;

        }



        .as-register-option label svg {

          color: #a75b7c;

        }



        .as-register-option input:checked + label {

          background: #fff3f7;

          border-color: var(--as-primary);

          color: var(--as-primary);

          box-shadow: 0 0 0 2px #8f244f0b;

        }



        .as-register-option input:focus-visible + label {

          outline: 2px solid var(--as-primary);

          outline-offset: 2px;

        }



        .as-register-divider {

          height: 1px;

          background: #f0e6eb;

          margin: 26px 0;

        }



        .as-register-age-row {

          display: grid;

          grid-template-columns: 1fr 1fr;

          gap: 12px;

        }



        .as-register-interest-list {

          display: flex;

          flex-wrap: wrap;

          gap: 9px;

        }



        .as-register-interest {

          border: 1px solid var(--as-border);

          border-radius: 30px;

          padding: 9px 13px;

          color: #775e69;

          background: white;

          cursor: pointer;

          font-size: 11px !important;

          transition: .2s;

        }



        .as-register-interest.selected {

          background: #f5f0ff;

          border-color: #a63c68;

          color: var(--as-primary);

          font-weight: 700;

        }



        .as-register-error {

          display: flex;

          gap: 9px;

          align-items: flex-start;

          background: #fff0f1;

          color: #a5263c;

          border: 1px solid #f6d0d6;

          border-radius: 11px;

          padding: 12px 14px;

          font-size: 12px;

          line-height: 1.6;

          margin: 0 0 20px;

        }



        .as-register-footer {

          display: flex;

          justify-content: space-between;

          align-items: center;

          gap: 12px;

          margin-top: 29px;

          padding-top: 22px;

          border-top: 1px solid #f0e6eb;

        }



        .as-register-btn {

          min-height: 46px;

          padding: 12px 19px;

          border-radius: 11px;

          display: inline-flex;

          align-items: center;

          justify-content: center;

          gap: 9px;

          font-size: 12px;

          font-weight: 700;

          cursor: pointer;

          transition: transform .2s, background .2s;

        }



        .as-register-btn:hover {

          transform: translateY(-1px);

        }



        .as-register-btn.primary {

          border: 1px solid var(--as-primary);

          background: linear-gradient(135deg, #9d315d, #792043);

          color: white;

          box-shadow: 0 7px 17px #8f244f22;

        }



        .as-register-btn.primary:hover {

          background: #6e1a3d;

        }



        .as-register-btn.secondary {

          border: 1px solid var(--as-border);

          color: #775d69;

          background: white;

        }



        .as-register-btn:disabled {

          opacity: .5;

          cursor: not-allowed;

          transform: none;

        }



        .as-register-terms {

          display: flex;

          align-items: flex-start;

          gap: 10px;

          font-size: 11px;

          color: #816d78;

          line-height: 1.8;

        }



        .as-register-terms input {

          margin-top: 4px;

          accent-color: var(--as-primary);

        }



        .as-register-terms a {

          color: var(--as-primary);

          font-weight: 700;

          text-decoration: none;

        }



        .as-register-success {

          text-align: center;

          padding: 45px 12px 25px;

        }



        .as-register-success-icon {

          width: 78px;

          height: 78px;

          display: grid;

          place-items: center;

          margin: 0 auto 22px;

          background: #e9f8ef;

          color: #27834d;

          border-radius: 50%;

        }



        .as-register-success h2 {

          font-family: 'Playfair Display', serif;

          font-size: 30px;

          margin: 0 0 13px;

        }



        .as-register-success p {

          max-width: 420px;

          margin: 0 auto 22px;

          color: var(--as-muted);

          font-size: 13px;

          line-height: 1.9;

        }



        .as-register-demo-notice {

          max-width: 440px;

          margin: 0 auto 25px;

          padding: 13px 15px;

          text-align: left;

          border: 1px solid #f2d9a5;

          background: #fff9e9;

          color: #765721;

          border-radius: 11px;

          font-size: 11px;

          line-height: 1.7;

        }



        .as-register-bottom-note {

          margin-top: 25px;

          text-align: center;

          color: #a18f99;

          font-size: 10px;

          line-height: 1.8;

        }



        @media (max-width: 900px) {

          .as-register-layout {

            grid-template-columns: 1fr;

            max-width: 650px;

          }



          .as-register-sidebar {

            position: static;

            padding: 28px;

          }



          .as-register-sidebar h1 {

            font-size: 34px;

            margin-top: 18px;

          }



          .as-register-benefits {

            grid-template-columns: repeat(3, minmax(0, 1fr));

            gap: 14px;

            margin-top: 25px;

          }



          .as-register-benefit {

            flex-direction: column;

          }



          .as-register-sidebar-note {

            margin-top: 24px;

          }

        }



        /* Added animations only — existing registration logic and layout preserved */
        @keyframes asRegisterFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes asRegisterStepReveal {
          from { opacity: 0; transform: translate3d(0, 14px, 0) scale(.99); }
          to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
        }
        @keyframes asRegisterSoftFloat {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -12px, 0); }
        }
        @keyframes asRegisterGlow {
          0%, 100% { box-shadow: 0 15px 50px #6b244010; }
          50% { box-shadow: 0 22px 58px #8f244f1c; }
        }
        .as-register-header { animation: asRegisterFadeUp .65s ease both; }
        .as-register-sidebar { animation: asRegisterFadeUp .75s ease .08s both; }
        .as-register-card { animation: asRegisterFadeUp .75s ease .16s both; }
        .as-register-sidebar::before { animation: asRegisterSoftFloat 8s ease-in-out infinite; }
        .as-register-sidebar::after { animation: asRegisterSoftFloat 10s ease-in-out infinite reverse; }
        .as-register-card { transition: box-shadow .3s ease, transform .3s ease; }
        .as-register-field, .as-register-section-title, .as-register-benefit {
          animation: asRegisterFadeUp .45s ease both;
        }
        .as-register-section-title {
          animation: asRegisterStepReveal .45s cubic-bezier(.2,.8,.2,1) both;
        }
        .as-register-field {
          animation: asRegisterStepReveal .45s cubic-bezier(.2,.8,.2,1) both;
        }
        .as-register-grid > .as-register-field:nth-child(2) { animation-delay: 45ms; }
        .as-register-grid > .as-register-field:nth-child(3) { animation-delay: 90ms; }
        .as-register-grid > .as-register-field:nth-child(4) { animation-delay: 135ms; }
        .as-register-grid > .as-register-field:nth-child(5) { animation-delay: 180ms; }
        .as-register-grid > .as-register-field:nth-child(6) { animation-delay: 225ms; }
        .as-register-error { animation: asRegisterStepReveal .3s ease both; }
        .as-register-success { animation: asRegisterStepReveal .55s cubic-bezier(.2,.8,.2,1) both; }
        .as-register .register-input, .as-register select.register-input,
        .as-register textarea.register-input {
          transition: border-color .22s ease, box-shadow .22s ease, transform .22s ease, background .22s ease;
        }
        .as-register .register-input:hover { border-color: #c99aaa; }
        .as-register .register-input:focus { transform: translateY(-1px); }
        .as-register-option label, .as-register-interest, .as-register-btn {
          transition: transform .22s ease, box-shadow .22s ease, background .22s ease, border-color .22s ease;
        }
        .as-register-option label:hover, .as-register-interest:hover {
          transform: translateY(-2px);
          box-shadow: 0 7px 18px #8f244f12;
        }
        .as-register-btn.primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 11px 23px #8f244f30;
        }
        .as-register-step-track span { transition: width .4s cubic-bezier(.2,.8,.2,1); }
        .as-register-success-icon { animation: asRegisterSoftFloat 3s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .as-register *, .as-register *::before, .as-register *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
            scroll-behavior: auto !important;
          }
        }

        @media (max-width: 520px) {

          .as-register {

            padding: 18px 12px 35px;

          }



          .as-register-header {

            margin-bottom: 20px;

          }



          .as-register-logo {

            width: min(190px, 52vw);

            height: 52px;

          }



          .as-register-login {

            font-size: 11px;

            text-align: right;

          }



          .as-register-sidebar {

            padding: 23px 20px;

            border-radius: 20px;

          }



          .as-register-sidebar h1 {

            font-size: 30px;

          }



          .as-register-benefits {

            grid-template-columns: 1fr;

          }



          .as-register-benefit {

            flex-direction: row;

          }



          .as-register-card {

            padding: 23px 17px;

            border-radius: 20px;

          }



          .as-register-card-heading h2 {

            font-size: 26px;

          }



          .as-register-grid {

            grid-template-columns: 1fr;

            gap: 16px;

          }

          .as-register-account-types {
            grid-template-columns: 1fr;
          }

          .as-register-account-option label {
            min-height: 0;
          }



          .as-register-field.full {

            grid-column: auto;

          }



          .as-register-profile-options {

            grid-template-columns: repeat(2, minmax(0, 1fr));

          }



          .as-register-step-label {

            font-size: 9px;

          }



          .as-register-footer {

            gap: 8px;

          }



          .as-register-btn {

            padding: 11px 13px;

            font-size: 11px;

          }

        }


        /* WowMate light-lavender visual refresh */
        .as-register {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          background:
            radial-gradient(circle at 8% 12%, rgba(196,181,253,.48), transparent 29%),
            radial-gradient(circle at 92% 82%, rgba(221,214,254,.72), transparent 32%),
            linear-gradient(135deg, #faf8ff 0%, #f1edff 52%, #fbfaff 100%);
        }
        .as-register::before, .as-register::after {
          content: "";
          position: fixed;
          z-index: -1;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(1px);
          background: rgba(167,139,250,.13);
          animation: asRegisterPageFloat 11s ease-in-out infinite;
        }
        .as-register::before { top: 14%; left: -115px; }
        .as-register::after { right: -125px; bottom: 8%; width: 320px; height: 320px; animation-delay: -5s; }
        @keyframes asRegisterPageFloat {
          0%,100% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(18px,-22px,0) scale(1.06); }
        }
        .as-register-layout, .as-register-header { position: relative; z-index: 1; }
        .as-register-sidebar {
          background: linear-gradient(145deg, #a78bfa 0%, #8b5cf6 55%, #6d28d9 100%);
          box-shadow: 0 22px 55px rgba(109,40,217,.18);
        }
        .as-register-card {
          border-color: #e5defd;
          box-shadow: 0 20px 60px rgba(91,64,150,.10);
          backdrop-filter: blur(10px);
        }
        .as-register-btn.primary {
          border-color: #8b5cf6;
          background: linear-gradient(115deg, #a78bfa, #7c3aed);
          box-shadow: 0 9px 22px rgba(124,58,237,.20);
        }
        .as-register-btn.primary:hover { background: linear-gradient(115deg, #8b5cf6, #6d28d9); }
        .as-register .register-input:focus { border-color: #9b7aea; box-shadow: 0 0 0 4px rgba(139,92,246,.12); }
        .as-register-step-track { background: #eee9fc; }
        .as-register-step-track span { background: linear-gradient(90deg,#c4b5fd,#7c3aed); }
        .as-register-option input:checked + label,
        .as-register-account-option input:checked + label,
        .as-register-interest.selected { background: #f3efff; border-color: #9b7aea; color: #6d28d9; }
        .as-register-section-icon { background: #f0ebff; color: #7c3aed; }
        .as-register-benefit-icon { background: rgba(255,255,255,.2); }
        @media (prefers-reduced-motion: reduce) {
          .as-register::before, .as-register::after { animation: none !important; }
        }

      `}</style>



      {/* Header */}

      <header className="as-register-header">

      <Link to="/" className="as-register-brand" aria-label="Wowmate home">

        <img

          src="/image.png"

          alt="Wowmate - Rishton Ki Nayi Shuruaat"

          className="as-register-logo"

        />

      </Link>



        <div className="as-register-login">

          Already a member?

          <Link to="/login">Login</Link>

        </div>

      </header>



      <main className="as-register-layout">

        {/* Left promotional panel */}

        <aside className="as-register-sidebar">

          <div className="as-register-sidebar-content">

            <div className="as-register-eyebrow">

              <Sparkles size={15} />

              Your journey starts here

            </div>



            <h1>

              Your perfect match,

              <br />

              your beautiful story.

            </h1>



            <p>

              Create your Wowmate profile and take the first step towards

              finding someone who shares your values, dreams, and future.

            </p>



            <div className="as-register-benefits">

              <div className="as-register-benefit">

                <div className="as-register-benefit-icon">

                  <HeartHandshake size={21} />

                </div>



                <div>

                  <strong>Meaningful connections</strong>

                  <span>

                    Discover profiles that match your expectations.

                  </span>

                </div>

              </div>



              <div className="as-register-benefit">

                <div className="as-register-benefit-icon">

                  <Sparkles size={21} />

                </div>



                <div>

                  <strong>Smarter matching</strong>

                  <span>

                    Your preferences can power future compatibility

                    recommendations.

                  </span>

                </div>

              </div>



              <div className="as-register-benefit">

                <div className="as-register-benefit-icon">

                  <ShieldCheck size={21} />

                </div>



                <div>

                  <strong>Your details matter</strong>

                  <span>

                    We will connect secure account handling before launch.

                  </span>

                </div>

              </div>

            </div>



            <div className="as-register-sidebar-note">

              <Heart size={17} />

              Every great relationship begins with a first step.

            </div>

          </div>

        </aside>



        {/* Registration form */}

        <section className="as-register-card">

          {!success ? (

            <>

              <div className="as-register-card-heading">

                <h2>
                  {formData.accountType === "broker"
                    ? "Create your broker account"
                    : "Create your profile"}
                </h2>

                <p>
                  {formData.accountType === "broker"
                    ? "Complete the details below to register as a Wowmate broker."
                    : "Complete the details below to set up your matrimonial profile."}
                </p>

              </div>



              {/* Progress */}

              <div

                className="as-register-stepper"

                aria-label={`Registration step ${step} of ${totalSteps}`}

              >

                {stepLabels.map((label, index) => {

                  const stepNumber = index + 1;



                  return (

                    <div

                      className={`as-register-step ${

                        stepNumber === step

                          ? "active"

                          : stepNumber < step

                          ? "complete"

                          : ""

                      }`}

                      key={label}

                    >

                      <div className="as-register-step-track">

                        <span />

                      </div>



                      <div className="as-register-step-label">

                        {stepNumber}. {label}

                      </div>

                    </div>

                  );

                })}

              </div>



              {error && (

                <div className="as-register-error" role="alert">

                  <CheckCircle2 size={17} />

                  <span>{error}</span>

                </div>

              )}



              <form onSubmit={handleSubmit} noValidate>

                {/* STEP 1: ACCOUNT */}

                {step === 1 && (

                  <>

                    <h3 className="as-register-section-title">

                      <span className="as-register-section-icon">

                        <UserRound size={19} />

                      </span>

                      Account information

                    </h3>



                    <div className="as-register-field full" style={{ marginBottom: "20px" }}>
                      <label>Choose account type<span className="required">*</span></label>
                      <div className="as-register-account-types" role="radiogroup" aria-label="Account type">
                        <div className="as-register-account-option">
                          <input
                            id="account-matrimony"
                            type="radio"
                            name="accountType"
                            value="matrimony"
                            checked={formData.accountType === "matrimony"}
                            onChange={updateField}
                          />
                          <label htmlFor="account-matrimony">
                            <Heart size={23} />
                            <strong>Matrimony</strong>
                            <span>Create your personal matrimonial profile and discover matches.</span>
                          </label>
                        </div>
                        <div className="as-register-account-option">
                          <input
                            id="account-broker"
                            type="radio"
                            name="accountType"
                            value="broker"
                            checked={formData.accountType === "broker"}
                            onChange={updateField}
                          />
                          <label htmlFor="account-broker">
                            <HeartHandshake size={23} />
                            <strong>Become a Broker</strong>
                            <span>Manage multiple bride and groom profiles for your clients.</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {formData.accountType === "broker" && (
                      <>
                      <div className="as-register-grid" style={{ marginBottom: "22px" }}>
                        <div className="as-register-field full">
                          <h3 className="as-register-section-title" style={{ marginBottom: "8px" }}>
                            <span className="as-register-section-icon"><UserRound size={19} /></span>
                            Broker account credentials
                          </h3>
                          <p className="as-register-help" style={{ fontSize: "12px", marginBottom: "14px" }}>These details will be used to create and access your broker account.</p>
                        </div>
                        <div className="as-register-field full">
                          <label htmlFor="fullName">Full name<span className="required">*</span></label>
                          <div className="as-register-control">
                            <UserRound size={17} />
                            <input className={inputClass} id="fullName" name="fullName" value={formData.fullName} onChange={updateField} placeholder="Enter your full name" autoComplete="name" required />
                          </div>
                        </div>
                        <div className="as-register-field">
                          <label htmlFor="email">Email address<span className="required">*</span></label>
                          <div className="as-register-control">
                            <Mail size={17} />
                            <input className={inputClass} id="email" name="email" type="email" value={formData.email} onChange={updateField} placeholder="you@example.com" autoComplete="email" required />
                          </div>
                        </div>
                        <div className="as-register-field">
                          <label htmlFor="mobile">Phone number<span className="required">*</span></label>
                          <div className="as-register-control">
                            <Phone size={17} />
                            <input className={inputClass} id="mobile" name="mobile" type="tel" value={formData.mobile} onChange={updateField} placeholder="+91 9876543210" autoComplete="tel" required />
                          </div>
                        </div>
                        <div className="as-register-field">
                          <label htmlFor="password">Password<span className="required">*</span></label>
                          <div className="as-register-control">
                            <LockKeyhole size={17} />
                            <input className={`${inputClass} password-input`} id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={updateField} placeholder="Minimum 8 characters" autoComplete="new-password" required />
                            <button className="as-register-password-toggle" type="button" onClick={() => setShowPassword((previous) => !previous)} aria-label={showPassword ? "Hide password" : "Show password"}>
                              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                          </div>
                        </div>
                        <div className="as-register-field">
                          <label htmlFor="confirmPassword">Confirm password<span className="required">*</span></label>
                          <div className="as-register-control">
                            <LockKeyhole size={17} />
                            <input className={`${inputClass} password-input`} id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={updateField} placeholder="Re-enter password" autoComplete="new-password" required />
                            <button className="as-register-password-toggle" type="button" onClick={() => setShowConfirmPassword((previous) => !previous)} aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}>
                              {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="as-register-grid" style={{ marginBottom: "22px" }}>
                        <div className="as-register-field full">
                          <h3 className="as-register-section-title" style={{ marginBottom: "8px" }}>
                            <span className="as-register-section-icon"><BriefcaseBusiness size={19} /></span>
                            Broker service details
                          </h3>
                          <p className="as-register-help" style={{ fontSize: "12px", marginBottom: "14px" }}>Add your professional details so families can understand your broker services.</p>
                        </div>
                        <div className="as-register-field full">
                          <label htmlFor="brokerBusinessName">Agency / business name<span className="required">*</span></label>
                          <div className="as-register-control">
                            <BriefcaseBusiness size={17} />
                            <input className={inputClass} id="brokerBusinessName" name="brokerBusinessName" value={formData.brokerBusinessName} onChange={updateField} placeholder="Enter your agency or business name" required />
                          </div>
                        </div>
                        <div className="as-register-field">
                          <label htmlFor="brokerExperience">Broker experience (years)<span className="required">*</span></label>
                          <input className={inputClass} id="brokerExperience" name="brokerExperience" type="number" min="0" max="80" value={formData.brokerExperience} onChange={updateField} placeholder="e.g. 5" required />
                        </div>
                        <div className="as-register-field">
                          <label htmlFor="brokerCity">City<span className="required">*</span></label>
                          <div className="as-register-control">
                            <MapPin size={17} />
                            <input className={inputClass} id="brokerCity" name="brokerCity" value={formData.brokerCity} onChange={updateField} placeholder="Your city" required />
                          </div>
                        </div>
                        <div className="as-register-field full">
                          <label htmlFor="brokerServiceArea">Service area<span className="required">*</span></label>
                          <input className={inputClass} id="brokerServiceArea" name="brokerServiceArea" value={formData.brokerServiceArea} onChange={updateField} placeholder="e.g. Hubballi, Dharwad, Belagavi" required />
                        </div>
                        <div className="as-register-field full">
                          <label htmlFor="brokerAbout">About your broker services<span className="required">*</span></label>
                          <textarea className={inputClass} id="brokerAbout" name="brokerAbout" value={formData.brokerAbout} onChange={updateField} placeholder="Describe your experience, the families you assist, and the services you provide" required />
                        </div>
                      </div>
                      </>
                    )}

                    {formData.accountType === "matrimony" && (
                    <div className="as-register-grid">

                      <div className="as-register-field full">

                        <label>Profile created for</label>



                        <div className="as-register-profile-options">

                          {["Self", "Son", "Daughter", "Sibling", "Relative", "Client"].map(

                            (option) => (

                              <div

                                className="as-register-option"

                                key={option}

                              >

                                <input

                                  id={`profile-${option}`}

                                  type="radio"

                                  name="profileFor"

                                  value={option}

                                  checked={formData.profileFor === option}

                                  onChange={updateField}

                                />



                                <label htmlFor={`profile-${option}`}>

                                  <Users size={18} />

                                  {option}

                                </label>

                              </div>

                            )

                          )}

                        </div>

                      </div>



                      <div className="as-register-field full">

                        <label htmlFor="fullName">

                          Full name<span className="required">*</span>

                        </label>



                        <div className="as-register-control">

                          <UserRound size={17} />



                          <input

                            className={inputClass}

                            id="fullName"

                            name="fullName"

                            value={formData.fullName}

                            onChange={updateField}

                            placeholder="Enter full name"

                            autoComplete="name"

                            required

                          />

                        </div>

                      </div>



                      <div className="as-register-field">

                        <label htmlFor="email">

                          Email address<span className="required">*</span>

                        </label>



                        <div className="as-register-control">

                          <Mail size={17} />



                          <input

                            className={inputClass}

                            id="email"

                            name="email"

                            type="email"

                            value={formData.email}

                            onChange={updateField}

                            placeholder="you@example.com"

                            autoComplete="email"

                            required

                          />

                        </div>

                      </div>



                      <div className="as-register-field">

                        <label htmlFor="mobile">

                          Mobile number<span className="required">*</span>

                        </label>



                        <div className="as-register-control">

                          <Phone size={17} />



                          <input

                            className={inputClass}

                            id="mobile"

                            name="mobile"

                            type="tel"

                            value={formData.mobile}

                            onChange={updateField}

                            placeholder="+91 9876543210"

                            autoComplete="tel"

                            required

                          />

                        </div>

                      </div>



                      <div className="as-register-field">

                        <label htmlFor="password">

                          Password<span className="required">*</span>

                        </label>



                        <div className="as-register-control">

                          <LockKeyhole size={17} />



                          <input

                            className={`${inputClass} password-input`}

                            id="password"

                            name="password"

                            type={showPassword ? "text" : "password"}

                            value={formData.password}

                            onChange={updateField}

                            placeholder="Minimum 8 characters"

                            autoComplete="new-password"

                            required

                          />



                          <button

                            className="as-register-password-toggle"

                            type="button"

                            onClick={() =>

                              setShowPassword((previous) => !previous)

                            }

                            aria-label={

                              showPassword ? "Hide password" : "Show password"

                            }

                          >

                            {showPassword ? (

                              <EyeOff size={17} />

                            ) : (

                              <Eye size={17} />

                            )}

                          </button>

                        </div>

                      </div>



                      <div className="as-register-field">

                        <label htmlFor="confirmPassword">

                          Confirm password

                          <span className="required">*</span>

                        </label>



                        <div className="as-register-control">

                          <LockKeyhole size={17} />



                          <input

                            className={`${inputClass} password-input`}

                            id="confirmPassword"

                            name="confirmPassword"

                            type={

                              showConfirmPassword ? "text" : "password"

                            }

                            value={formData.confirmPassword}

                            onChange={updateField}

                            placeholder="Re-enter password"

                            autoComplete="new-password"

                            required

                          />



                          <button

                            className="as-register-password-toggle"

                            type="button"

                            onClick={() =>

                              setShowConfirmPassword(

                                (previous) => !previous

                              )

                            }

                            aria-label={

                              showConfirmPassword

                                ? "Hide confirm password"

                                : "Show confirm password"

                            }

                          >

                            {showConfirmPassword ? (

                              <EyeOff size={17} />

                            ) : (

                              <Eye size={17} />

                            )}

                          </button>

                        </div>

                      </div>

                    </div>
                    )}

                  </>

                )}



                {/* STEP 2: PERSONAL AND CAREER */}

                {step === 2 && (

                  <>

                    <h3 className="as-register-section-title">

                      <span className="as-register-section-icon">

                        <UserRound size={19} />

                      </span>

                      Personal information

                    </h3>



                    <div className="as-register-grid">

                      <div className="as-register-field">

                        <label htmlFor="gender">

                          Gender<span className="required">*</span>

                        </label>



                        <select

                          className={inputClass}

                          id="gender"

                          name="gender"

                          value={formData.gender}

                          onChange={updateField}

                          required

                        >

                          <option value="">Select gender</option>

                          <option value="Male">Male</option>

                          <option value="Female">Female</option>

                          <option value="Other">Other</option>

                        </select>

                      </div>



                      <div className="as-register-field">

                        <label htmlFor="dateOfBirth">

                          Date of birth<span className="required">*</span>

                        </label>



                        <input

                          className={inputClass}

                          id="dateOfBirth"

                          name="dateOfBirth"

                          type="date"

                          max={MAX_DATE_OF_BIRTH}

                          value={formData.dateOfBirth}

                          onChange={updateField}

                          required

                        />



                        <p className="as-register-help">

                          You must be at least 18 years old.

                        </p>

                      </div>



                      <div className="as-register-field">

                        <label htmlFor="height">Height</label>



                        <select

                          className={inputClass}

                          id="height"

                          name="height"

                          value={formData.height}

                          onChange={updateField}

                        >

                          <option value="">Select height</option>

                          {Array.from({ length: 31 }, (_, index) => {

                            const totalInches = 54 + index;

                            const feet = Math.floor(totalInches / 12);

                            const inches = totalInches % 12;

                            const label = `${feet} ft ${inches} in`;



                            return (

                              <option key={label} value={label}>

                                {label}

                              </option>

                            );

                          })}

                        </select>

                      </div>



                      <div className="as-register-field">

                        <label htmlFor="maritalStatus">

                          Marital status<span className="required">*</span>

                        </label>



                        <select

                          className={inputClass}

                          id="maritalStatus"

                          name="maritalStatus"

                          value={formData.maritalStatus}

                          onChange={updateField}

                          required

                        >

                          <option value="">Select status</option>

                          <option value="Never Married">Never Married</option>

                          <option value="Divorced">Divorced</option>

                          <option value="Widowed">Widowed</option>

                          <option value="Awaiting Divorce">

                            Awaiting Divorce

                          </option>

                        </select>

                      </div>



                      <div className="as-register-field">

                        <label htmlFor="community">Community</label>



                        <input

                          className={inputClass}

                          id="community"

                          name="community"

                          value={formData.community}

                          onChange={updateField}

                          placeholder="Optional"

                        />

                      </div>

                    </div>



                    <div className="as-register-divider" />



                    <h3 className="as-register-section-title">

                      <span className="as-register-section-icon">

                        <GraduationCap size={19} />

                      </span>

                      Education and career

                    </h3>



                    <div className="as-register-grid">

                      <div className="as-register-field">

                        <label htmlFor="education">

                          Highest education

                          <span className="required">*</span>

                        </label>



                        <select

                          className={inputClass}

                          id="education"

                          name="education"

                          value={formData.education}

                          onChange={updateField}

                          required

                        >

                          <option value="">Select education</option>

                          <option value="High School">High School</option>

                          <option value="Diploma">Diploma</option>

                          <option value="Bachelor's">Bachelor's</option>

                          <option value="Master's">Master's</option>

                          <option value="Doctorate">Doctorate</option>

                          <option value="Professional Degree">

                            Professional Degree

                          </option>

                          <option value="Other">Other</option>

                        </select>

                      </div>



                      <div className="as-register-field">

                        <label htmlFor="profession">

                          Profession<span className="required">*</span>

                        </label>



                        <div className="as-register-control">

                          <BriefcaseBusiness size={17} />



                          <select

                            className={inputClass}

                            id="profession"

                            name="profession"

                            value={formData.profession}

                            onChange={updateField}

                            required

                          >

                            <option value="">Select profession</option>

                            <option value="Farmer">Farmer</option>

                            <option value="Business">Business</option>

                            <option value="Government Employee">

                              Government Employee

                            </option>

                            <option value="Private Employee">

                              Private Employee

                            </option>

                            <option value="Doctor">Doctor</option>

                            <option value="Engineer">Engineer</option>

                            <option value="Teacher">Teacher</option>

                            <option value="Lawyer">Lawyer</option>

                            <option value="Self Employed">

                              Self Employed

                            </option>

                            <option value="Student">Student</option>

                            <option value="Other">Other</option>

                          </select>

                        </div>

                      </div>



                      <div className="as-register-field full">

                        <label htmlFor="annualIncome">Annual income</label>



                        <select

                          className={inputClass}

                          id="annualIncome"

                          name="annualIncome"

                          value={formData.annualIncome}

                          onChange={updateField}

                        >

                          <option value="">Prefer not to say</option>

                          <option value="Below ₹2 lakh">Below ₹2 lakh</option>

                          <option value="₹2–5 lakh">₹2–5 lakh</option>

                          <option value="₹5–10 lakh">₹5–10 lakh</option>

                          <option value="₹10–20 lakh">₹10–20 lakh</option>

                          <option value="₹20 lakh+">₹20 lakh+</option>

                        </select>

                      </div>

                    </div>

                  </>

                )}



                    <div className="as-register-divider" />

                    <h3 className="as-register-section-title">
                      <span className="as-register-section-icon">
                        <UserRound size={19} />
                      </span>
                      Your Photos
                    </h3>

                    <div className="as-register-field full">
                      <label htmlFor="userPhotos">Upload Your Photos (up to 4)</label>
                      <p className="as-register-help">
                        Upload your personal photos to help potential matches recognize you.
                        Each photo must be an image smaller than 5 MB.
                      </p>
                      <input
                        className={inputClass}
                        id="userPhotos"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleUserPhotoUpload}
                        disabled={userPhotos.length >= 4}
                      />

                      <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", marginTop: "18px" }}>
                        {userPhotos.map((photo, index) => (
                          <div key={photo.id} style={{ position: "relative", width: "110px", height: "110px", flex: "0 0 110px", overflow: "visible" }}>
                            <img
                              src={photo.preview}
                              alt={`Your profile photo ${index + 1}`}
                              style={{ display: "block", width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px", border: "1px solid #eadde3" }}
                            />
                            <button
                              type="button"
                              onClick={() => removeUserPhoto(photo.id)}
                              aria-label={`Remove photo ${index + 1}`}
                              style={{ position: "absolute", top: "-8px", right: "-8px", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "center", width: "30px", height: "30px", minWidth: "30px", minHeight: "30px", padding: 0, margin: 0, boxSizing: "border-box", border: "none", borderRadius: "50%", background: "#6d28d9", color: "#fff", fontSize: "20px", fontWeight: 600, lineHeight: 1, textAlign: "center", cursor: "pointer", appearance: "none" }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="as-register-help">
                        {userPhotos.length} of 4 photos selected. You can remove any photo before continuing.
                      </p>
                    </div>

                {/* STEP 3: PARTNER PREFERENCES AND LOCATION */}

                {step === 3 && (

                  <>

                    <h3 className="as-register-section-title">

                      <span className="as-register-section-icon">

                        <MapPin size={19} />

                      </span>

                      Your location

                    </h3>



                    <div className="as-register-grid">

                      <div className="as-register-field full">

                        <label htmlFor="country">

                          Country<span className="required">*</span>

                        </label>



                        <select

                          className={inputClass}

                          id="country"

                          name="country"

                          value={formData.country}

                          onChange={updateField}

                          required

                        >

                          <option value="India">India</option>

                          <option value="United States">United States</option>

                          <option value="United Kingdom">United Kingdom</option>

                          <option value="Canada">Canada</option>

                          <option value="Australia">Australia</option>

                          <option value="United Arab Emirates">

                            United Arab Emirates

                          </option>

                          <option value="Other">Other</option>

                        </select>

                      </div>



                      <div className="as-register-field">

                        <label htmlFor="state">

                          State<span className="required">*</span>

                        </label>



                        <input

                          className={inputClass}

                          id="state"

                          name="state"

                          value={formData.state}

                          onChange={updateField}

                          placeholder="e.g. Karnataka"

                          required

                        />

                      </div>



                      <div className="as-register-field">

                        <label htmlFor="city">

                          City<span className="required">*</span>

                        </label>



                        <input

                          className={inputClass}

                          id="city"

                          name="city"

                          value={formData.city}

                          onChange={updateField}

                          placeholder="e.g. Bengaluru"

                          required

                        />

                      </div>

                    </div>



                    <div className="as-register-divider" />



                    <h3 className="as-register-section-title">

                      <span className="as-register-section-icon">

                        <HeartHandshake size={19} />

                      </span>

                      Your ideal partner

                    </h3>



                    <div className="as-register-grid">

                      <div className="as-register-field full">

                        <label>

                          Preferred partner age range

                          <span className="required">*</span>

                        </label>



                        <div className="as-register-age-row">

                          <div>

                            <select

                              className={inputClass}

                              name="partnerAgeMin"

                              aria-label="Minimum preferred partner age"

                              value={formData.partnerAgeMin}

                              onChange={updateField}

                            >

                              {Array.from({ length: 83 }, (_, index) => {

                                const age = index + 18;



                                return (

                                  <option key={age} value={age}>

                                    Min age: {age}

                                  </option>

                                );

                              })}

                            </select>

                          </div>



                          <div>

                            <select

                              className={inputClass}

                              name="partnerAgeMax"

                              aria-label="Maximum preferred partner age"

                              value={formData.partnerAgeMax}

                              onChange={updateField}

                            >

                              {Array.from({ length: 83 }, (_, index) => {

                                const age = index + 18;



                                return (

                                  <option key={age} value={age}>

                                    Max age: {age}

                                  </option>

                                );

                              })}

                            </select>

                          </div>

                        </div>

                      </div>



                      <div className="as-register-field">

                        <label htmlFor="partnerEducation">

                          Preferred education

                        </label>



                        <select

                          className={inputClass}

                          id="partnerEducation"

                          name="partnerEducation"

                          value={formData.partnerEducation}

                          onChange={updateField}

                        >

                          <option value="">No specific preference</option>

                          <option value="High School">High School</option>

                          <option value="Diploma">Diploma</option>

                          <option value="Bachelor's">Bachelor's</option>

                          <option value="Master's">Master's</option>

                          <option value="Doctorate">Doctorate</option>

                          <option value="Professional Degree">

                            Professional Degree

                          </option>

                          <option value="Other">Other</option>

                        </select>

                      </div>



                      <div className="as-register-field">

                        <label htmlFor="partnerProfession">

                          Preferred profession

                        </label>



                        <select

                          className={inputClass}

                          id="partnerProfession"

                          name="partnerProfession"

                          value={formData.partnerProfession}

                          onChange={updateField}

                        >

                          <option value="">No specific preference</option>

                          <option value="Farmer">Farmer</option>

                          <option value="Business">Business</option>

                          <option value="Government Employee">

                            Government Employee

                          </option>

                          <option value="Private Employee">

                            Private Employee

                          </option>

                          <option value="Doctor">Doctor</option>

                          <option value="Engineer">Engineer</option>

                          <option value="Teacher">Teacher</option>

                          <option value="Self Employed">

                            Self Employed

                          </option>

                          <option value="Other">Other</option>

                        </select>

                      </div>



                      <div className="as-register-field full">

                        <label htmlFor="partnerLocation">

                          Preferred partner location

                        </label>



                        <input

                          className={inputClass}

                          id="partnerLocation"

                          name="partnerLocation"

                          value={formData.partnerLocation}

                          onChange={updateField}

                          placeholder="e.g. Karnataka, Maharashtra, Anywhere in India"

                        />



                        <p className="as-register-help">

                          Leave blank if you are open to matches anywhere.

                        </p>

                      </div>

                    </div>

                  </>

                )}



                {/* STEP 4: INTERESTS, LIFESTYLE AND FAMILY */}

                {step === 4 && (

                  <>

                    <h3 className="as-register-section-title">

                      <span className="as-register-section-icon">

                        <Sparkles size={19} />

                      </span>

                      Interests and lifestyle

                    </h3>



                    <div className="as-register-field full">

                      <label>

                        Select your interests

                        <span className="required">*</span>

                      </label>



                      <div

                        className="as-register-interest-list"

                        aria-label="Choose your interests"

                      >

                        {interestsList.map((interest) => {

                          const selected =

                            formData.interests.includes(interest);



                          return (

                            <button

                              key={interest}

                              type="button"

                              className={`as-register-interest ${

                                selected ? "selected" : ""

                              }`}

                              aria-pressed={selected}

                              onClick={() => toggleInterest(interest)}

                            >

                              {selected ? "✓ " : "+ "}

                              {interest}

                            </button>

                          );

                        })}

                      </div>



                      <p className="as-register-help">

                        Choose the interests that best describe you. They

                        can help with future compatibility recommendations.

                      </p>

                    </div>



                    <div className="as-register-divider" />



                    <div className="as-register-grid">

                      <div className="as-register-field full">

                        <label htmlFor="lifestyle">Lifestyle</label>



                        <select

                          className={inputClass}

                          id="lifestyle"

                          name="lifestyle"

                          value={formData.lifestyle}

                          onChange={updateField}

                        >

                          <option value="">Select lifestyle</option>

                          <option value="Traditional">Traditional</option>

                          <option value="Moderate">Moderate</option>

                          <option value="Modern">Modern</option>

                          <option value="Mix of traditional and modern">

                            Mix of traditional and modern

                          </option>

                        </select>

                      </div>



                      <div className="as-register-field full">

                        <label htmlFor="familyValues">Family values</label>



                        <select

                          className={inputClass}

                          id="familyValues"

                          name="familyValues"

                          value={formData.familyValues}

                          onChange={updateField}

                        >

                          <option value="">Select family preference</option>

                          <option value="Traditional family">

                            Traditional family

                          </option>

                          <option value="Moderate family">

                            Moderate family

                          </option>

                          <option value="Progressive family">

                            Progressive family

                          </option>

                          <option value="Open to all family values">

                            Open to all family values

                          </option>

                        </select>

                      </div>



                      <div className="as-register-field full">

                        <label htmlFor="partnerExpectations">

                          What do you expect from your future partner?

                        </label>



                        <textarea

                          className={inputClass}

                          id="partnerExpectations"

                          name="partnerExpectations"

                          value={formData.partnerExpectations}

                          onChange={updateField}

                          placeholder="Describe the qualities, values, and expectations that matter to you..."

                          maxLength={1000}

                        />



                        <p className="as-register-help">

                          {formData.partnerExpectations.length}/1000

                          characters

                        </p>

                      </div>

                    </div>



                    <div className="as-register-divider" />



                    <div className="as-register-terms">

                      <input

                        id="agreeTerms"

                        name="agreeTerms"

                        type="checkbox"

                        checked={formData.agreeTerms}

                        onChange={updateField}

                      />



                      <label htmlFor="agreeTerms">

                        I agree to the{" "}

                        <Link to="/terms">Terms and Conditions</Link> and{" "}

                        <Link to="/privacy-policy">Privacy Policy</Link>. I

                        confirm that the information provided is accurate.

                      </label>

                    </div>

                  </>

                )}



                {/* Navigation buttons */}

                <div className="as-register-footer">

                  {step > 1 ? (

                    <button

                      type="button"

                      className="as-register-btn secondary"

                      onClick={previousStep}

                    >

                      <ArrowLeft size={16} />

                      Previous

                    </button>

                  ) : (

                    <span />

                  )}



                  {step < totalSteps ? (

                    <button

                      type="button"

                      className="as-register-btn primary"

                      onClick={nextStep}

                    >

                      Continue

                      <ArrowRight size={16} />

                    </button>

                  ) : (

                    <button

                      type="submit"

                      className="as-register-btn primary"

                    >

                      Complete registration

                      <CheckCircle2 size={16} />

                    </button>

                  )}

                </div>

              </form>



              <div className="as-register-bottom-note">

                <ShieldCheck

                  size={14}

                  style={{

                    display: "inline",

                    verticalAlign: "middle",

                    marginRight: 5,

                  }}

                />

                Your registration details are being handled by the Wowmate

                backend.

              </div>

            </>

          ) : (

            /* Success state */

            <div className="as-register-success">

              <div className="as-register-success-icon">

                <CheckCircle2 size={43} />

              </div>



              <h2>
                {formData.accountType === "broker"
                  ? "Broker account created"
                  : profileSaved
                    ? "Registration complete!"
                    : "Account created"}
              </h2>



              <p>

                Your registration was submitted successfully.

                {formData.accountType === "broker"
                  ? " Your broker account and service details have been submitted. Please log in to continue to your broker workspace."
                  : <> Thank you for starting your Wowmate journey,{" "}
                    <strong>{formData.fullName}</strong>.</>}

              </p>



              {formData.accountType === "matrimony" && (
              <div className="as-register-demo-notice" role="status">
                {profileSaved ? (
                  <>
                    <strong>Profile added:</strong> Your details and photos
                    are now available in Explore Profiles and Search Results
                    on this browser.
                  </>
                ) : (
                  <>
                    <strong>Profile not listed:</strong> Your account was
                    created, but profile storage failed. {error}
                  </>
                )}
              </div>
              )}



              <button

                type="button"

                className="as-register-btn primary"

                onClick={() => navigate("/login")}

              >

                Go to Login

                <ArrowRight size={16} />

              </button>



              <div style={{ marginTop: 15 }}>

                <button

                  type="button"

                  className="as-register-btn secondary"

                  onClick={() => {

                    setSuccess(false);

                    setStep(1);

                    setError("");

                  }}

                >

                  Back to registration

                </button>

              </div>

            </div>

          )}

        </section>

      </main>

    </div>

  );

}