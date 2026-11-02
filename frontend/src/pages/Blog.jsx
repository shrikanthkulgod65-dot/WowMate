import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  CalendarDays,
  Clock,
  ArrowRight,
  Search,
  BookOpen,
  X,
  ChevronRight,
} from "lucide-react";

const blogPosts = [
  {
    id: 1,
    category: "Marriage Advice",
    title: "10 Things to Discuss Before Getting Married",
    description:
      "A strong marriage starts with honest conversations. Discover the important topics every couple should discuss before taking the next step.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85",
    date: "October 10, 2026",
    readTime: "6 min read",
    content: [
      "Marriage is an important life decision. Taking time to understand each other's expectations can help couples build a stronger foundation.",
      "Discuss family expectations, career goals, finances, living arrangements, children, personal values, and communication styles. These conversations help both partners understand what matters most to each other.",
      "Talk about how you handle disagreements. Respectful communication and a willingness to listen are valuable skills that can help couples navigate difficult situations.",
      "Remember that you do not need to agree on everything. What matters is understanding each other and deciding how you will handle differences together.",
    ],
  },
  {
    id: 2,
    category: "Finding Your Partner",
    title: "How to Create an Impressive Matrimony Profile",
    description:
      "Your profile introduces you to potential partners. Learn how to present your personality, interests, and expectations authentically.",
    image:
      "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1000&q=85",
    date: "October 12, 2026",
    readTime: "5 min read",
    content: [
      "Your matrimony profile is an opportunity to introduce yourself to someone who may share your hopes for the future.",
      "Choose a recent photograph that clearly represents you. Write a friendly introduction about your personality, interests, education, career, and family values.",
      "Be honest about the information you share. Clear and accurate details help other people understand whether your expectations and lifestyles may be compatible.",
      "Explain the qualities you value in a life partner without making the description unnecessarily restrictive. A thoughtful profile can encourage meaningful conversations.",
    ],
  },
  {
    id: 3,
    category: "Relationships",
    title: "The Secret to Building a Happy Married Life",
    description:
      "Lasting relationships grow through trust, respect, understanding, and small acts of kindness. Explore habits that bring couples closer.",
    image:
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1000&q=85",
    date: "October 14, 2026",
    readTime: "7 min read",
    content: [
      "A happy married life is not about having a perfect relationship. It is about two people making a consistent effort to understand and support each other.",
      "Make time for conversations without distractions. Listen carefully, appreciate each other's efforts, and express affection in ways that feel meaningful to both partners.",
      "Share responsibilities and discuss decisions together. Small misunderstandings can become bigger problems when they are ignored, so try to address concerns calmly and respectfully.",
      "Most importantly, remember that every relationship is different. Find the habits and routines that help both of you feel valued, secure, and understood.",
    ],
  },
  {
    id: 4,
    category: "Family & Traditions",
    title: "Balancing Family Traditions and Modern Relationships",
    description:
      "Learn how couples can honor their cultural roots while creating a relationship that reflects their shared values and individual choices.",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=85",
    date: "October 16, 2026",
    readTime: "6 min read",
    content: [
      "Family traditions can provide a sense of belonging, identity, and connection across generations. At the same time, every couple brings their own experiences and preferences into a marriage.",
      "Talk openly about the traditions that matter most to each of you. Explain why they are meaningful, and listen when your partner shares a different perspective.",
      "You can preserve important customs while creating new traditions together. The goal is not to choose between family and your relationship, but to find respectful ways to balance both.",
      "When discussions become difficult, approach them with curiosity rather than judgment. Shared decisions are easier to maintain when both partners feel heard.",
    ],
  },
  {
    id: 5,
    category: "Farmer Matrimony",
    title: "Finding a Life Partner Who Understands Your Rural Lifestyle",
    description:
      "Shared values, family connections, and an understanding of agricultural life can be important considerations when choosing a partner.",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=85",
    date: "October 18, 2026",
    readTime: "5 min read",
    content: [
      "Agricultural life can involve seasonal responsibilities, changing schedules, and a strong connection to family and community. For many people, these experiences are an important part of their identity.",
      "When looking for a life partner, discuss your lifestyle, future plans, family responsibilities, and expectations about where you would like to live.",
      "A compatible partner does not need to have exactly the same background. Mutual respect and a willingness to understand each other's experiences can be just as important.",
      "Be open about your aspirations, whether they involve farming, education, business, or other career opportunities. Honest conversations help couples plan a future that works for both of them.",
    ],
  },
  {
    id: 6,
    category: "First Meeting",
    title: "How to Make Your First Matrimony Meeting Comfortable",
    description:
      "Feeling nervous before meeting a potential partner is normal. Use these practical suggestions to make the conversation more relaxed and natural.",
    image:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1000&q=85",
    date: "October 20, 2026",
    readTime: "4 min read",
    content: [
      "Meeting someone for the first time can feel exciting and a little uncomfortable. Remember that the purpose is to get to know each other, not to impress someone with perfect answers.",
      "Choose a comfortable, mutually agreed-upon public location. Arrive on time, be yourself, and ask open-ended questions about interests, goals, and everyday life.",
      "Give each other room to speak. You do not need to discuss every serious topic during the first meeting, but you can begin understanding what matters to each of you.",
      "Take your time after the meeting to reflect on how you felt. A respectful conversation and a sense of comfort can be useful starting points for deciding whether to meet again.",
    ],
  },
];

const categories = [
  "All",
  "Marriage Advice",
  "Finding Your Partner",
  "Relationships",
  "Family & Traditions",
  "Farmer Matrimony",
  "First Meeting",
];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      activeCategory === "All" || post.category === activeCategory;

    const search = searchText.toLowerCase().trim();

    const matchesSearch =
      post.title.toLowerCase().includes(search) ||
      post.description.toLowerCase().includes(search) ||
      post.category.toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="wowmate-blog">
      <style>{`
        .wowmate-blog {
          --blog-primary: #8b5cf6;
          --blog-dark: #4c1d95;
          --blog-pink: #c4b5fd;
          --blog-light: #f8f5ff;
          --blog-text: #30264a;
          font-family: Arial, sans-serif;
          color: var(--blog-text);
          background: var(--blog-light);
          min-height: 100vh;
        }

        .blog-hero {
          position: relative;
          overflow: hidden;
          padding: 85px 20px 90px;
          text-align: center;
          color: white;
          background: linear-gradient(135deg, #351125, #76234b, #b34375);
        }

        .blog-hero::before,
        .blog-hero::after {
          content: "";
          position: absolute;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.06);
          pointer-events: none;
        }

        .blog-hero::before {
          top: -100px;
          left: -70px;
        }

        .blog-hero::after {
          bottom: -130px;
          right: -50px;
          width: 320px;
          height: 320px;
        }

        .blog-hero-content {
          position: relative;
          z-index: 1;
          max-width: 800px;
          margin: 0 auto;
        }

        .blog-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 16px;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 30px;
          background: rgba(255,255,255,0.1);
          color: #ffe0ed;
          font-size: 13px;
          margin-bottom: 22px;
        }

        .blog-hero h1 {
          font-size: clamp(36px, 6vw, 58px);
          line-height: 1.15;
          margin: 0 0 20px;
          font-weight: 800;
        }

        .blog-hero h1 span {
          color: #ffb8d2;
        }

        .blog-hero p {
          max-width: 680px;
          margin: 0 auto;
          color: #f9e5ee;
          line-height: 1.9;
          font-size: 16px;
        }

        .blog-container {
          max-width: 1200px;
          padding: 55px 20px 75px;
          margin: 0 auto;
        }

        .blog-section-heading {
          text-align: center;
          margin-bottom: 35px;
        }

        .blog-section-heading .eyebrow {
          color: var(--blog-primary);
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .blog-section-heading h2 {
          font-size: clamp(26px, 4vw, 36px);
          color: var(--blog-dark);
          margin: 12px 0;
        }

        .blog-section-heading p {
          color: #7b6974;
          line-height: 1.8;
          max-width: 650px;
          margin: 0 auto;
        }

        .blog-search-row {
          display: flex;
          justify-content: center;
          margin-bottom: 25px;
        }

        .blog-search {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          max-width: 520px;
          padding: 0 16px;
          background: white;
          border: 1px solid #ecd8e3;
          border-radius: 12px;
          box-shadow: 0 5px 18px rgba(64, 23, 46, 0.04);
          color: var(--blog-primary);
        }

        .blog-search input {
          width: 100%;
          min-width: 0;
          border: none;
          outline: none;
          padding: 15px 0;
          background: transparent;
          color: var(--blog-text);
          font-size: 14px;
        }

        .blog-search input::placeholder {
          color: #a08b97;
        }

        .blog-categories {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-bottom: 38px;
        }

        .blog-category-button {
          border: 1px solid #ead5e0;
          border-radius: 30px;
          background: white;
          color: #715565;
          padding: 10px 16px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .blog-category-button:hover {
          border-color: var(--blog-primary);
          color: var(--blog-primary);
        }

        .blog-category-button.active {
          background: var(--blog-primary);
          color: white;
          border-color: var(--blog-primary);
        }

        .blog-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 26px;
        }

        .blog-card {
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
          background: white;
          border: 1px solid #f0e2e9;
          border-radius: 17px;
          box-shadow: 0 6px 24px rgba(64, 23, 46, 0.05);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .blog-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(64, 23, 46, 0.12);
        }

        .blog-card-image-wrap {
          position: relative;
          height: 225px;
          overflow: hidden;
          background: #f1dce6;
        }

        .blog-card-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .blog-card:hover .blog-card-image {
          transform: scale(1.05);
        }

        .blog-card-category {
          position: absolute;
          left: 15px;
          top: 15px;
          background: white;
          color: var(--blog-primary);
          padding: 8px 12px;
          border-radius: 30px;
          font-size: 11px;
          font-weight: 700;
          box-shadow: 0 3px 12px rgba(0,0,0,0.08);
        }

        .blog-card-body {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 22px;
        }

        .blog-card-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          color: #917d89;
          font-size: 11px;
          margin-bottom: 15px;
        }

        .blog-card-meta span {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .blog-card-title {
          color: var(--blog-dark);
          font-size: 19px;
          line-height: 1.5;
          margin: 0 0 12px;
        }

        .blog-card-description {
          color: #796874;
          font-size: 13px;
          line-height: 1.9;
          margin: 0 0 22px;
        }

        .blog-read-more {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          align-self: flex-start;
          margin-top: auto;
          padding: 0;
          border: none;
          background: transparent;
          color: var(--blog-primary);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        .blog-read-more:hover {
          color: #c04b80;
        }

        .blog-empty {
          grid-column: 1 / -1;
          padding: 55px 20px;
          text-align: center;
          background: white;
          border: 1px solid #f0e2e9;
          border-radius: 16px;
        }

        .blog-empty h3 {
          color: var(--blog-dark);
        }

        .blog-empty p {
          color: #796874;
        }

        .blog-empty button {
          margin-top: 10px;
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          background: var(--blog-primary);
          color: white;
          cursor: pointer;
        }

        .blog-cta {
          margin-top: 65px;
          padding: 45px 25px;
          text-align: center;
          border-radius: 20px;
          background: linear-gradient(135deg, #4c1d95, #8b5cf6);
          color: white;
        }

        .blog-cta-icon {
          color: #ffb8d2;
          margin-bottom: 12px;
        }

        .blog-cta h2 {
          font-size: clamp(25px, 4vw, 34px);
          margin: 0 0 13px;
        }

        .blog-cta p {
          max-width: 620px;
          margin: 0 auto 25px;
          color: #f4dce7;
          line-height: 1.8;
          font-size: 14px;
        }

        .blog-cta-button {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          background: white;
          color: var(--blog-primary);
          text-decoration: none;
          font-weight: 700;
          padding: 14px 23px;
          border-radius: 9px;
          transition: transform 0.2s ease;
        }

        .blog-cta-button:hover {
          transform: translateY(-2px);
        }

        .blog-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(32, 12, 24, 0.75);
          backdrop-filter: blur(4px);
        }

        .blog-modal {
          position: relative;
          width: 100%;
          max-width: 760px;
          max-height: 90vh;
          overflow-y: auto;
          background: white;
          border-radius: 18px;
          box-shadow: 0 20px 80px rgba(0,0,0,0.25);
        }

        .blog-modal-image {
          display: block;
          width: 100%;
          height: 270px;
          object-fit: cover;
          background: #f1dce6;
        }

        .blog-modal-content {
          padding: 30px;
        }

        .blog-modal-category {
          color: var(--blog-primary);
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .blog-modal-content h2 {
          color: var(--blog-dark);
          font-size: clamp(23px, 4vw, 32px);
          line-height: 1.4;
          margin: 12px 0 18px;
        }

        .blog-modal-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          color: #917d89;
          font-size: 12px;
          margin-bottom: 24px;
        }

        .blog-modal-content p {
          color: #685662;
          line-height: 1.95;
          font-size: 15px;
          margin-bottom: 17px;
        }

        .blog-modal-close {
          position: absolute;
          z-index: 2;
          top: 14px;
          right: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 50%;
          background: white;
          color: var(--blog-dark);
          box-shadow: 0 3px 12px rgba(0,0,0,0.15);
          cursor: pointer;
        }

        .blog-modal-close:hover {
          background: #fff0f6;
        }

        .blog-modal-footer {
          border-top: 1px solid #f0e2e9;
          margin-top: 25px;
          padding-top: 20px;
        }

        .blog-modal-footer a {
          color: var(--blog-primary);
          font-weight: 700;
          text-decoration: none;
        }

        @media (max-width: 950px) {
          .blog-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px;
          }
        }

        @media (max-width: 600px) {
          .blog-hero {
            padding: 65px 18px;
          }

          .blog-hero p {
            font-size: 14px;
          }

          .blog-container {
            padding: 40px 15px 55px;
          }

          .blog-grid {
            grid-template-columns: 1fr;
          }

          .blog-card-image-wrap {
            height: 230px;
          }

          .blog-card-body {
            padding: 20px;
          }

          .blog-cta {
            padding: 35px 20px;
            margin-top: 45px;
          }

          .blog-modal-backdrop {
            padding: 10px;
          }

          .blog-modal {
            max-height: 94vh;
          }

          .blog-modal-image {
            height: 200px;
          }

          .blog-modal-content {
            padding: 22px 18px;
          }
        }
      `}</style>

      {/* HERO SECTION */}
      <section className="blog-hero">
        <div className="blog-hero-content">
          <div className="blog-hero-badge">
            <Heart size={16} />
            WOWMATE JOURNAL
          </div>

          <h1>
            Stories of Love,
            <br />
            <span>Marriage &amp; Togetherness</span>
          </h1>

          <p>
            Discover helpful marriage advice, relationship insights,
            matrimony tips, and inspiring ideas to help you take
            your next step toward a meaningful connection.
          </p>
        </div>
      </section>

      {/* BLOG CONTENT */}
      <section className="blog-container">
        <div className="blog-section-heading">
          <span className="eyebrow">Read · Learn · Connect</span>

          <h2>Explore Our Latest Articles</h2>

          <p>
            Helpful guidance for every step of your matrimony journey,
            from creating your profile to building a lasting relationship.
          </p>
        </div>

        {/* SEARCH */}
        <div className="blog-search-row">
          <div className="blog-search">
            <Search size={20} />

            <input
              type="search"
              placeholder="Search marriage tips, relationships..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              aria-label="Search blog articles"
            />
          </div>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="blog-categories" aria-label="Filter blog categories">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                activeCategory === category
                  ? "blog-category-button active"
                  : "blog-category-button"
              }
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
            >
              {category}
            </button>
          ))}
        </div>

        {/* BLOG CARDS */}
        <div className="blog-grid">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <article className="blog-card" key={post.id}>
                <div className="blog-card-image-wrap">
                  <img
                    className="blog-card-image"
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                  />

                  <span className="blog-card-category">
                    {post.category}
                  </span>
                </div>

                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    <span>
                      <CalendarDays size={14} />
                      {post.date}
                    </span>

                    <span>
                      <Clock size={14} />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="blog-card-title">{post.title}</h3>

                  <p className="blog-card-description">
                    {post.description}
                  </p>

                  <button
                    type="button"
                    className="blog-read-more"
                    onClick={() => setSelectedPost(post)}
                  >
                    Read Full Article
                    <ArrowRight size={17} />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="blog-empty">
              <BookOpen size={35} color="#8b5cf6" />

              <h3>No articles found</h3>

              <p>
                Try another search term or select a different category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchText("");
                  setActiveCategory("All");
                }}
              >
                Show All Articles
              </button>
            </div>
          )}
        </div>

        {/* CALL TO ACTION */}
        <section className="blog-cta">
          <Heart className="blog-cta-icon" size={38} />

          <h2>Your Beautiful Story Starts Here</h2>

          <p>
            Ready to take the next step? Create your Wowmate profile
            and begin exploring meaningful connections.
          </p>

          <Link to="/register" className="blog-cta-button">
            Create Your Profile
            <ChevronRight size={18} />
          </Link>
        </section>
      </section>

      {/* FULL ARTICLE MODAL */}
      {selectedPost && (
        <div
          className="blog-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedPost(null);
            }
          }}
        >
          <article
            className="blog-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="blog-modal-title"
          >
            <button
              type="button"
              className="blog-modal-close"
              onClick={() => setSelectedPost(null)}
              aria-label="Close article"
            >
              <X size={22} />
            </button>

            <img
              className="blog-modal-image"
              src={selectedPost.image}
              alt={selectedPost.title}
            />

            <div className="blog-modal-content">
              <span className="blog-modal-category">
                {selectedPost.category}
              </span>

              <h2 id="blog-modal-title">{selectedPost.title}</h2>

              <div className="blog-modal-meta">
                <span>
                  <CalendarDays
                    size={14}
                    style={{ verticalAlign: "middle", marginRight: 5 }}
                  />
                  {selectedPost.date}
                </span>

                <span>
                  <Clock
                    size={14}
                    style={{ verticalAlign: "middle", marginRight: 5 }}
                  />
                  {selectedPost.readTime}
                </span>
              </div>

              {selectedPost.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}

              <div className="blog-modal-footer">
                <p>
                  Every relationship is unique. Take time to understand
                  your own values and what matters to you in a life partner.
                </p>

                <Link
                  to="/register"
                  onClick={() => setSelectedPost(null)}
                >
                  Start Your Matrimony Journey <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </article>
        </div>
      )}
    </main>
  );
}