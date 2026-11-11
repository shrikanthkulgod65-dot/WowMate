import React from "react";

import { Link } from "react-router-dom";
import {
  Heart,
  Users,
  ShieldCheck,
  Handshake,
  Target,
  Eye,
  CheckCircle,
  ArrowRight,
  Crown,
  Code2,
  MessageCircleHeart,
} from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Meaningful Connections",
    description:
      "We aim to help individuals and families discover compatible life partners and build relationships based on understanding and respect.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy and Safety",
    description:
      "We believe personal information should be handled responsibly so users can make informed decisions while connecting with others.",
  },
  {
    icon: Handshake,
    title: "Family Involvement",
    description:
      "We recognize the importance of family preferences and traditions while respecting every individual's choices.",
  },
  {
    icon: Users,
    title: "Inclusive Matchmaking",
    description:
      "Our goal is to help people from different professions, communities, and backgrounds explore suitable matrimonial connections.",
  },
];

const highlights = [
  "Explore profiles based on your preferences.",
  "Discover professional and farmer matrimony categories.",
  "Connect with families and matchmaking services.",
  "Make informed decisions at every stage of your search.",
];

const leadershipTeam = [
  {
    name: "Shrikanth Kulgod",
    role: "Founder & CEO",
    icon: Crown,
    description:
      "Leading the Wowmate vision with a commitment to making matrimonial connections more convenient, meaningful, and accessible.",
  },
  {
    name: "Rahul Kumar",
    role: "Co-Founder",
    icon: Handshake,
    description:
      "Supporting the mission of Wowmate by helping build a platform focused on relationships, family values, and meaningful partnerships.",
  },
];

const developers = [
  {
    name: "Sunil Kumar",
    role: "Development Team",
    number: "01",
  },
  {
    name: "Priya Sharma",
    role: "Development Team",
    number: "02",
  },
  {
    name: "Ajith Singh",
    role: "Development Team",
    number: "03",
  },
];

export default function About() {
  return (
    <main className="about-page">
      <style>{`
        .about-page {
          --about-primary: #8b5cf6;
          --about-secondary: #6d28d9;
          --about-soft: #f5f0ff;
          --about-text: #30264a;
          --about-muted: #716783;

          width: 100%;
          color: var(--about-text);
          background: #ffffff;
          font-family: Arial, sans-serif;
          overflow: hidden;
        }

        .about-page *,
        .about-page *::before,
        .about-page *::after {
          box-sizing: border-box;
        }

        .about-container {
          width: min(1160px, 92%);
          margin: 0 auto;
        }

        /* HERO SECTION */

        .about-hero {
          position: relative;
          overflow: hidden;
          padding: 85px 0;
          background:
            radial-gradient(
              circle at 88% 12%,
              #f5d3e1 0,
              transparent 28%
            ),
            linear-gradient(
              120deg,
              #fff4f8,
              #ffffff 65%,
              #fce8f0
            );
        }

        .about-hero-grid {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          align-items: center;
          gap: 55px;
        }

        .about-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 15px;
          border-radius: 30px;
          background: #ffffff;
          color: var(--about-primary);
          font-size: 13px;
          font-weight: 700;
          box-shadow: 0 5px 20px #7d204c0d;
        }

        .about-hero h1 {
          margin: 22px 0 18px;
          font-size: clamp(36px, 5vw, 58px);
          line-height: 1.13;
          letter-spacing: -1.7px;
        }

        .about-highlight {
          color: var(--about-primary);
        }

        .about-hero-copy {
          max-width: 570px;
          color: var(--about-muted);
          font-size: 17px;
          line-height: 1.85;
        }

        .about-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 13px;
          margin-top: 28px;
        }

        .about-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 14px 21px;
          border: 1px solid var(--about-primary);
          border-radius: 9px;
          background: var(--about-primary);
          color: #ffffff;
          font-weight: 700;
          text-decoration: none;
          transition: 0.2s ease;
          cursor: pointer;
        }

        .about-btn:hover {
          background: #e8dfe3;
          color: #ffffff;
          transform: translateY(-2px);
        }

        .about-btn-outline {
          background: #ffffff;
          color: var(--about-primary);
        }

        .about-btn-outline:hover {
          background: var(--about-soft);
          color: var(--about-primary);
        }

        .about-visual {
          position: relative;
          min-height: 420px;
          display: grid;
          place-items: center;
        }

        .about-photo {
          width: 100%;
          max-width: 450px;
          height: 410px;
          overflow: hidden;
          border-radius: 180px 180px 25px 25px;
          background: #f4dce6;
          box-shadow: 0 25px 70px #73244920;
        }

        .about-photo img {
          display: block;
          width: 150%;
          height: 100%;
          object-fit: cover;
        }

        .about-floating {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px 17px;
          border-radius: 13px;
          background: #ffffff;
          box-shadow: 0 12px 38px #45203216;
        }

        .about-floating.top {
          top: 35px;
          left: -15px;
        }

        .about-floating.bottom {
          right: -10px;
          bottom: 35px;
        }

        .about-floating-icon {
          display: grid;
          place-items: center;
          width: 43px;
          height: 43px;
          flex-shrink: 0;
          border-radius: 12px;
          background: var(--about-soft);
          color: var(--about-primary);
        }

        .about-floating strong {
          display: block;
          font-size: 13px;
        }

        .about-floating span {
          display: block;
          margin-top: 4px;
          color: var(--about-muted);
          font-size: 12px;
        }

        /* GENERAL SECTIONS */

        .about-section {
          padding: 76px 0;
        }

        .about-section-soft {
          background: #fff7fa;
        }

        .about-heading {
          max-width: 720px;
          margin: 0 auto 42px;
          text-align: center;
        }

        .about-heading h2 {
          margin: 0 0 14px;
          font-size: clamp(28px, 4vw, 40px);
          line-height: 1.2;
        }

        .about-heading p {
          margin: 0;
          color: var(--about-muted);
          font-size: 16px;
          line-height: 1.8;
        }

        /* OUR STORY */

        .about-story-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 45px;
          align-items: center;
        }

        .about-story-copy h2 {
          margin: 20px 0 18px;
          font-size: clamp(28px, 4vw, 38px);
          line-height: 1.25;
        }

        .about-story-copy p {
          color: var(--about-muted);
          font-size: 15px;
          line-height: 1.9;
        }

        .about-check-list {
          display: grid;
          gap: 15px;
          margin: 25px 0 0;
          padding: 0;
          list-style: none;
        }

        .about-check-list li {
          display: flex;
          align-items: flex-start;
          gap: 11px;
          font-size: 14px;
          line-height: 1.7;
        }

        .about-check-list svg {
          flex-shrink: 0;
          margin-top: 2px;
          color: var(--about-primary);
        }

        .about-story-image {
          min-height: 150px;
          overflow: hidden;
          border-radius: 0;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .about-story-image img {
          display: block;
          width: 100%;
          max-width: 650px;
          height: auto;
          min-height: 0;
          object-fit: contain;
          background: transparent;
        }

        /* VALUES */

        .about-value-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 20px;
        }

        .about-value-card {
          padding: 26px 22px;
          border: 1px solid #f0e1e8;
          border-radius: 15px;
          background: #ffffff;
          transition: 0.2s ease;
        }

        .about-value-card:hover {
          transform: translateY(-5px);
          border-color: #e7bfd0;
          box-shadow: 0 15px 38px #7022470d;
        }

        .about-value-icon {
          display: grid;
          place-items: center;
          width: 53px;
          height: 53px;
          margin-bottom: 19px;
          border-radius: 14px;
          background: var(--about-soft);
          color: var(--about-primary);
        }

        .about-value-card h3 {
          margin: 0 0 12px;
          font-size: 18px;
        }

        .about-value-card p {
          margin: 0;
          color: var(--about-muted);
          font-size: 14px;
          line-height: 1.8;
        }

        /* OUR TEAM */

        .about-team-section {
          position: relative;
          padding: 82px 0;
          background:
            radial-gradient(
              circle at 0% 0%,
              #f9dce8 0,
              transparent 28%
            ),
            linear-gradient(135deg, #fff8fb, #ffffff 55%, #fff0f6);
        }

        .about-team-intro {
          max-width: 760px;
          margin: 0 auto 48px;
          text-align: center;
        }

        .about-team-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 15px;
          border: 1px solid #f2d6e2;
          border-radius: 30px;
          background: #ffffff;
          color: var(--about-primary);
          font-size: 13px;
          font-weight: 700;
        }

        .about-team-intro h2 {
          margin: 19px 0 14px;
          font-size: clamp(30px, 4vw, 43px);
          line-height: 1.2;
        }

        .about-team-intro p {
          margin: 0;
          color: var(--about-muted);
          font-size: 16px;
          line-height: 1.85;
        }

        .about-team-subtitle {
          margin: 0 0 24px;
          text-align: center;
          font-size: 25px;
          color: var(--about-text);
        }

        .about-leadership-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 25px;
          max-width: 850px;
          margin: 0 auto;
        }

        .about-person-card {
          position: relative;
          overflow: hidden;
          padding: 32px 27px;
          border: 1px solid #f0dce5;
          border-radius: 20px;
          background: #ffffff;
          text-align: center;
          box-shadow: 0 15px 45px #7c244a0a;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .about-person-card::before {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: linear-gradient(
            90deg,
            #8b5cf6,
            #c8799a
          );
          content: "";
        }

        .about-person-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 45px #7c244a16;
        }

        .about-person-avatar {
          display: grid;
          place-items: center;
          width: 100px;
          height: 100px;
          margin: 0 auto 19px;
          border: 5px solid #ffffff;
          border-radius: 50%;
          background: linear-gradient(135deg, #4c1d95, #8b5cf6);
          color: #ffffff;
          box-shadow: 0 0 0 2px #f2d3e0;
        }

        .about-person-card h4 {
          margin: 0 0 8px;
          font-size: 23px;
          line-height: 1.35;
        }

        .about-person-role {
          display: inline-block;
          margin-bottom: 14px;
          padding: 7px 13px;
          border-radius: 20px;
          background: var(--about-soft);
          color: var(--about-primary);
          font-size: 12px;
          font-weight: 700;
        }

        .about-person-card p {
          margin: 0;
          color: var(--about-muted);
          font-size: 14px;
          line-height: 1.8;
        }

        .about-team-divider {
          width: 100%;
          height: 1px;
          margin: 55px 0 45px;
          background: linear-gradient(
            90deg,
            transparent,
            #e9c6d5,
            transparent
          );
        }

        .about-developers-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .about-developer-card {
          display: flex;
          align-items: center;
          gap: 17px;
          padding: 23px 20px;
          border: 1px solid #f0dfe7;
          border-radius: 15px;
          background: #ffffff;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .about-developer-card:hover {
          transform: translateY(-4px);
          border-color: #dba9bf;
        }

        .about-developer-icon {
          display: grid;
          place-items: center;
          width: 58px;
          height: 58px;
          flex-shrink: 0;
          border-radius: 15px;
          background: var(--about-soft);
          color: var(--about-primary);
        }

        .about-developer-number {
          display: block;
          margin-bottom: 4px;
          color: #f2edef;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .about-developer-card h4 {
          margin: 0 0 6px;
          font-size: 17px;
          line-height: 1.4;
        }

        .about-developer-card p {
          margin: 0;
          color: var(--about-muted);
          font-size: 12px;
        }

        .about-team-message {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 38px;
          padding: 23px;
          border: 1px solid #f0d9e4;
          border-radius: 15px;
          background: #ffffffb8;
          color: var(--about-primary);
          text-align: center;
        }

        .about-team-message p {
          margin: 0;
          font-size: 14px;
          line-height: 1.8;
        }

        /* MISSION AND VISION */

        .about-mission-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
        }

        .about-mission-card {
          padding: 32px;
          border: 1px solid #f0dfe7;
          border-radius: 17px;
          background: #ffffff;
          transition: transform 0.2s ease;
        }

        .about-mission-card:hover {
          transform: translateY(-4px);
        }

        .about-mission-icon {
          display: grid;
          place-items: center;
          width: 54px;
          height: 54px;
          margin-bottom: 20px;
          border-radius: 14px;
          background: var(--about-soft);
          color: var(--about-primary);
        }

        .about-mission-card h3 {
          margin: 0 0 13px;
          font-size: 24px;
        }

        .about-mission-card p {
          margin: 0;
          color: var(--about-muted);
          line-height: 1.9;
        }

        /* FINAL CALL TO ACTION */

        .about-cta {
          padding: 55px 0;
          background: linear-gradient(110deg, #7e1c48, #ae3568);
          color: #ffffff;
        }

        .about-cta-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
        }

        .about-cta h2 {
          margin: 0 0 10px;
          font-size: clamp(26px, 4vw, 36px);
        }

        .about-cta p {
          margin: 0;
          color: #ffe5ef;
          line-height: 1.8;
        }

        .about-cta .about-btn {
          flex-shrink: 0;
          border-color: #ffffff;
          background: #ffffff;
          color: var(--about-primary);
        }

        .about-cta .about-btn:hover {
          background: #fff1f6;
        }

        /* TABLET RESPONSIVE */

        @media (max-width: 950px) {
          .about-value-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .about-hero-grid {
            gap: 28px;
          }

          .about-developers-grid {
            grid-template-columns: 1fr;
            max-width: 650px;
            margin: 0 auto;
          }
        }

        /* MOBILE RESPONSIVE */

        @media (max-width: 680px) {
          .about-hero {
            padding: 50px 0;
          }

          .about-hero-grid,
          .about-story-grid,
          .about-mission-grid,
          .about-leadership-grid {
            grid-template-columns: 1fr;
          }

          .about-hero h1 {
            font-size: 38px;
            letter-spacing: -1px;
          }

          .about-hero-copy {
            font-size: 15px;
          }

          .about-visual {
            min-height: 340px;
            margin-top: 10px;
          }

          .about-photo {
            max-width: 340px;
            height: 320px;
          }

          .about-floating {
            gap: 8px;
            padding: 11px;
          }

          .about-floating.top {
            top: 12px;
            left: 0;
          }

          .about-floating.bottom {
            right: 0;
            bottom: 12px;
          }

          .about-floating strong {
            font-size: 11px;
          }

          .about-floating span {
            font-size: 10px;
          }

          .about-section,
          .about-team-section {
            padding: 52px 0;
          }

          .about-value-grid {
            grid-template-columns: 1fr;
          }

          .about-story-image {
            min-height: 280px;
          }

          .about-story-image img {
            min-height: 0;
          }

          .about-team-intro {
            margin-bottom: 35px;
          }

          .about-person-card {
            padding: 29px 22px;
          }

          .about-developers-grid {
            gap: 14px;
          }

          .about-developer-card {
            padding: 18px 15px;
          }

          .about-team-divider {
            margin: 40px 0 32px;
          }

          .about-team-message {
            align-items: flex-start;
            padding: 18px;
          }

          .about-mission-card {
            padding: 25px;
          }

          .about-cta-inner {
            align-items: flex-start;
            flex-direction: column;
          }

          .about-cta .about-btn {
            width: 100%;
          }
        }

        @media (max-width: 380px) {
          .about-container {
            width: 90%;
          }

          .about-hero h1 {
            font-size: 33px;
          }

          .about-floating {
            max-width: 190px;
          }

          .about-person-card h4 {
            font-size: 20px;
          }

          .about-developer-card h4 {
            font-size: 15px;
          }
        }
      `}</style>

    
      {/* OUR STORY */}

      <section className="about-section">
        <div className="about-container about-story-grid">
          <div className="about-story-copy">
            <div className="about-eyebrow">
              <Heart size={16} />
              Our Story
            </div>

            <h2>
              A New Beginning for
              <span className="about-highlight">
                {" "}Every Relationship
              </span>
            </h2>

            <p>
              Finding a life partner is one of life's most meaningful
              decisions. It involves hopes, family expectations, shared
              values, and the desire to build a happy future together.
            </p>

            <p>
              Wowmate aims to make the search more convenient by
              bringing matrimonial profiles and matchmaking options
              together in one place. Our goal is to help people explore
              possibilities and take the next step at their own pace.
            </p>

            <ul className="about-check-list">
              {highlights.map((highlight) => (
                <li key={highlight}>
                  <CheckCircle size={20} />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="about-story-image">
            <img
              src="/image.png"
              alt="WowMate Logo"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* OUR VALUES */}

      <section className="about-section about-section-soft">
        <div className="about-container">
          <div className="about-heading">
            <h2>What Matters to Us</h2>

            <p>
              Our approach is guided by respect, meaningful connections,
              thoughtful choices, and the importance of trust in the
              matchmaking journey.
            </p>
          </div>

          <div className="about-value-grid">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article
                  className="about-value-card"
                  key={value.title}
                >
                  <div className="about-value-icon">
                    <Icon size={25} />
                  </div>

                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOUNDER, CO-FOUNDER AND DEVELOPMENT TEAM */}

      <section className="about-team-section">
        <div className="about-container">
          <div className="about-team-intro">
            <div className="about-team-label">
              <Users size={16} />
              Meet Our Team
            </div>

            <h2>
              The People Behind{" "}
              <span className="about-highlight">Wowmate</span>
            </h2>

            <p>
              Every meaningful connection begins with a vision.
              Meet the people working together to bring the Wowmate
              vision to life and make the matrimonial journey more
              convenient for individuals and families.
            </p>
          </div>

          {/* LEADERSHIP */}

          <h3 className="about-team-subtitle">
            Our Leadership
          </h3>

          <div className="about-leadership-grid">
            {leadershipTeam.map((person) => {
              const Icon = person.icon;

              return (
                <article
                  className="about-person-card"
                  key={person.name}
                >
                  <div className="about-person-avatar">
                    <Icon size={42} strokeWidth={1.7} />
                  </div>

                  <h4>{person.name}</h4>

                  <span className="about-person-role">
                    {person.role}
                  </span>

                  <p>{person.description}</p>
                </article>
              );
            })}
          </div>

          <div className="about-team-divider" />

          {/* DEVELOPMENT TEAM */}

          <h3 className="about-team-subtitle">
            Our Development Team
          </h3>

          <div className="about-developers-grid">
            {developers.map((developer) => (
              <article
                className="about-developer-card"
                key={developer.name}
              >
                <div className="about-developer-icon">
                  <Code2 size={28} />
                </div>

                <div>
                  <span className="about-developer-number">
                    TEAM MEMBER {developer.number}
                  </span>

                  <h4>{developer.name}</h4>

                  <p>{developer.role}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="about-team-message">
            <MessageCircleHeart
              size={27}
              style={{ flexShrink: 0 }}
            />

            <p>
              <strong>One vision. One team. Meaningful connections.</strong>
              <br />
              Together, we are building Wowmate with care, dedication,
              and a focus on helping people begin their next chapter.
            </p>
          </div>
        </div>
      </section>

      {/* MISSION AND VISION */}

      <section className="about-section">
        <div className="about-container">
          <div className="about-heading">
            <h2>Our Mission &amp; Vision</h2>

            <p>
              We want to make exploring matrimonial connections more
              approachable, respectful, and convenient.
            </p>
          </div>

          <div className="about-mission-grid">
            <article className="about-mission-card">
              <div className="about-mission-icon">
                <Target size={27} />
              </div>

              <h3>Our Mission</h3>

              <p>
                To provide a convenient platform where individuals and
                families can explore matrimonial profiles, communicate
                preferences, and discover potential life partners with
                greater confidence.
              </p>
            </article>

            <article className="about-mission-card">
              <div className="about-mission-icon">
                <Eye size={27} />
              </div>

              <h3>Our Vision</h3>

              <p>
                To become a trusted destination for people seeking
                meaningful matrimonial connections, bringing together
                modern convenience and the values that make relationships
                special.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}

      <section className="about-cta">
        <div className="about-container about-cta-inner">
          <div>
            <h2>Your New Beginning Starts Here</h2>

            <p>
              Take the first step toward discovering a meaningful
              connection with Wowmate.
            </p>
          </div>
          

          <Link to="/register" className="about-btn">
            Create Your Profile <ArrowRight size={18} />
          </Link>
        
        </div>
      </section>
    </main>
  );
}