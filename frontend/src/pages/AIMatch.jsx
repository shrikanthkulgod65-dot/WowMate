
import React from "react";

export default function AIMatch() {
  return (
    <main className="ai-coming-page">
      <div className="ai-coming-content">
        <span className="ai-label">WOWMATE AI MATCH</span>

        <div className="ai-icon">💞</div>

        <h1>
          Your Perfect Match,
          <span> Powered by AI</span>
        </h1>

        <h2>COMING SOON</h2>

        <p>
          Discover smarter matchmaking with intelligent
          compatibility, personalized preferences and
          meaningful connections.
        </p>

        <div className="ai-features">
          <span>✦ Smart Compatibility</span>
          <span>✦ Personalized Matches</span>
          <span>✦ Better Connections</span>
        </div>

        <a href="/" className="ai-home-btn">
          Back to Home
        </a>
      </div>

      <style>{`
        .ai-coming-page {
          min-height: 85vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 50px 20px;
          background:
            radial-gradient(circle at top, #fce8ef, transparent 50%),
            linear-gradient(135deg, #fff8fb, #f5eaf3);
          text-align: center;
        }

        .ai-coming-content {
          max-width: 750px;
        }

        .ai-label {
          display: inline-block;
          color: #a04470;
          font-weight: 800;
          letter-spacing: 3px;
          font-size: 13px;
          margin-bottom: 25px;
        }

        .ai-icon {
          font-size: 65px;
          margin-bottom: 15px;
        }

        .ai-coming-content h1 {
          font-size: clamp(32px, 5vw, 55px);
          color: #39213e;
          margin: 0 0 20px;
          line-height: 1.2;
        }

        .ai-coming-content h1 span {
          color: #b34c78;
        }

        .ai-coming-content h2 {
          font-size: 25px;
          letter-spacing: 7px;
          color: #c18a43;
          margin: 25px 0;
        }

        .ai-coming-content p {
          color: #6c596c;
          font-size: 17px;
          line-height: 1.8;
          margin-bottom: 30px;
        }

        .ai-features {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 35px;
        }

        .ai-features span {
          background: white;
          color: #70405e;
          padding: 12px 17px;
          border-radius: 30px;
          box-shadow: 0 5px 18px #4b204015;
          font-size: 13px;
        }

        .ai-home-btn {
          display: inline-block;
          padding: 14px 30px;
          border-radius: 30px;
          color: white;
          background: linear-gradient(135deg, #a63e70, #713c80);
          text-decoration: none;
          font-weight: 700;
        }

        @media (max-width: 600px) {
          .ai-coming-page { min-height: 75vh; }
          .ai-coming-content p { font-size: 15px; }
        }
      `}</style>
    </main>
  );
}
