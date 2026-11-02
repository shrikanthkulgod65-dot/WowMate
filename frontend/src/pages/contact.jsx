import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Heart,
  MessageCircle,
} from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  }

  return (
    <main className="contact-page">
      <style>{`
        .contact-page {
          font-family: Arial, sans-serif;
          color: #30264a;
          background: #f8f5ff;
          min-height: 100vh;
        }

        .contact-hero {
          background: linear-gradient(135deg, #4c1d95, #8b5cf6);
          color: white;
          padding: 75px 20px;
          text-align: center;
        }

        .contact-hero h1 {
          font-size: clamp(32px, 5vw, 48px);
          margin: 0 0 15px;
        }

        .contact-hero p {
          max-width: 650px;
          margin: auto;
          color: #ede5ff;
          line-height: 1.8;
          font-size: 16px;
        }

        .contact-heart {
          color: #c4b5fd;
          margin-bottom: 15px;
        }

        .contact-container {
          max-width: 1150px;
          margin: auto;
          padding: 60px 20px;
        }

        .contact-heading {
          text-align: center;
          margin-bottom: 40px;
        }

        .contact-heading h2 {
          color: #4c1d95;
          font-size: 30px;
          margin-bottom: 12px;
        }

        .contact-heading p {
          color: #786773;
          line-height: 1.8;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: 30px;
          align-items: start;
        }

        .contact-info {
          background: #4c1d95;
          color: white;
          padding: 32px;
          border-radius: 18px;
        }

        .contact-info h3 {
          font-size: 24px;
          margin-top: 0;
        }

        .contact-info > p {
          color: #ede5ff;
          line-height: 1.8;
          margin-bottom: 30px;
        }

        .contact-info-item {
          display: flex;
          gap: 15px;
          margin: 25px 0;
          align-items: flex-start;
        }

        .contact-info-icon {
          min-width: 44px;
          height: 44px;
          background: #6d28d9;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c4b5fd;
        }

        .contact-info-item h4 {
          margin: 0 0 7px;
          font-size: 15px;
        }

        .contact-info-item p {
          margin: 0;
          color: #ede5ff;
          line-height: 1.6;
          font-size: 14px;
          overflow-wrap: anywhere;
        }

        .contact-form {
          background: white;
          padding: 35px;
          border-radius: 18px;
          box-shadow: 0 8px 35px rgba(76, 29, 149, 0.08);
          border: 1px solid #ddd6fe;
        }

        .contact-form h3 {
          color: #4c1d95;
          font-size: 24px;
          margin-top: 0;
        }

        .contact-form-description {
          color: #786773;
          line-height: 1.7;
          margin-bottom: 25px;
        }

        .contact-form label {
          display: block;
          margin-bottom: 7px;
          color: #49323e;
          font-weight: 600;
          font-size: 14px;
        }

        .contact-form input,
        .contact-form textarea,
        .contact-form select {
          box-sizing: border-box;
          width: 100%;
          padding: 13px 14px;
          border: 1px solid #ddd6fe;
          border-radius: 9px;
          margin-bottom: 20px;
          font: inherit;
          color: #30264a;
          background: #fffafd;
          outline: none;
        }

        .contact-form input:focus,
        .contact-form textarea:focus,
        .contact-form select:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15);
        }

        .contact-form textarea {
          min-height: 130px;
          resize: vertical;
        }

        .contact-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 15px 20px;
          border: none;
          border-radius: 9px;
          background: #8b5cf6;
          color: white;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .contact-submit:hover {
          background: #6d28d9;
        }

        .contact-success {
          background: #effaf1;
          border: 1px solid #b9e6c2;
          color: #216b34;
          padding: 14px;
          border-radius: 9px;
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .contact-footer-note {
          text-align: center;
          padding: 0 20px 45px;
          color: #786773;
          line-height: 1.8;
        }

        .contact-footer-note a {
          color: #6d28d9;
          font-weight: 700;
        }

        @media (max-width: 760px) {
          .contact-hero {
            padding: 55px 20px;
          }

          .contact-container {
            padding: 40px 16px;
          }

          .contact-grid {
            grid-template-columns: 1fr;
          }

          .contact-info,
          .contact-form {
            padding: 24px;
          }
        }
      `}</style>

      <section className="contact-hero">
        <Heart className="contact-heart" size={42} />
        <h1>Contact Us</h1>
        <p>
          Every beautiful relationship begins with a connection.
          We are here to help you on your journey to finding your life partner.
        </p>
      </section>

      <section className="contact-container">
        <div className="contact-heading">
          <h2>We Would Love to Hear From You</h2>
          <p>
            Have a question about Wowmate? Send us a message and
            our team will be happy to assist you.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <h3>Get in Touch</h3>
            <p>
              Need assistance with your profile, account, or matrimony
              journey? Use the contact options below.
            </p>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <Mail size={21} />
              </div>
              <div>
                <h4>Email Us</h4>
                <p>Replace with your official support email</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <Phone size={21} />
              </div>
              <div>
                <h4>Call Us</h4>
                <p>Add your official contact number</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <MapPin size={21} />
              </div>
              <div>
                <h4>Our Location</h4>
                <p>Add your official business address</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <Clock size={21} />
              </div>
              <div>
                <h4>Support Hours</h4>
                <p>Add your actual customer support hours</p>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <h3>Send Us a Message</h3>
            <p className="contact-form-description">
              Fill in the details below to prepare your message.
            </p>

            {submitted && (
              <div className="contact-success" role="status">
                Your form was submitted in this demo. No message has
                been sent to Wowmate yet because the backend is not connected.
              </div>
            )}

            <label htmlFor="contact-name">Full Name</label>
            <input
              id="contact-name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label htmlFor="contact-email">Email Address</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="contact-subject">Subject</label>
            <select
              id="contact-subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            >
              <option value="">Choose a subject</option>
              <option value="profile">Profile Assistance</option>
              <option value="account">Account Support</option>
              <option value="subscription">Subscription Query</option>
              <option value="safety">Safety or Report</option>
              <option value="other">Other Enquiry</option>
            </select>

            <label htmlFor="contact-message">Your Message</label>
            <textarea
              id="contact-message"
              name="message"
              placeholder="How can we help you?"
              value={formData.message}
              onChange={handleChange}
              required
            />

            <button className="contact-submit" type="submit">
              <Send size={18} />
              Submit Message
            </button>
          </form>
        </div>
      </section>

      <div className="contact-footer-note">
        <MessageCircle
          size={20}
          style={{ verticalAlign: "middle", marginRight: 8 }}
        />
        For more information, visit our{" "}
        <Link to="/privacy-policy">Privacy Policy</Link>.
      </div>
    </main>
  );
}