import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xnnbkyqk";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    improvement: ""
  });

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      improvement: ""
    });
    setRating(0);
    setHoverRating(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      setErrorMessage("Please fill all required fields.");
      return;
    }

    try {
      setSubmitting(true);

      const body = new FormData();
      body.append("name", formData.name);
      body.append("email", formData.email);
      body.append("subject", formData.subject);
      body.append("message", formData.message);
      body.append("improvement", formData.improvement);
      body.append("rating", rating ? String(rating) : "Not rated");

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json"
        },
        body
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(
          "Your message has been sent successfully. We will try to respond as soon as possible."
        );
        resetForm();
      } else {
        const serverMessage =
          result?.errors?.map((err) => err.message).join(", ") ||
          result?.error ||
          "Something went wrong while sending your message.";

        setErrorMessage(serverMessage);
        console.log("Formspree error:", result);
      }
    } catch (error) {
      setErrorMessage("Unable to send message right now. Please try again.");
      console.error("Contact form error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <div className="dashboard-container">
        <div className="subjects-page-header">
          <div>
            <h1 className="subjects-title">Contact Us</h1>
            <p className="muted">
              We would love to hear from you. Share your questions, feedback,
              or suggestions with us.
            </p>
          </div>
        </div>

        <div className="contact-page-grid">
          <div className="card big-card contact-info-card">
            <h2>Get in Touch</h2>
            <p className="muted">
              If you have any issue, feedback, or support request, feel free to
              contact us. We try to provide a fast and helpful response.
            </p>

            <div className="contact-info-list">
              <div className="contact-info-item">
                <h3>Fast Response</h3>
                <p>
                  We review messages quickly and try to respond as soon as
                  possible with the right help.
                </p>
              </div>

              <div className="contact-info-item">
                <h3>Your Feedback Matters</h3>
                <p>
                  Your suggestions help us improve the platform and create a
                  better learning experience for students.
                </p>
              </div>

              <div className="contact-info-item">
                <h3>What can we improve?</h3>
                <p>
                  Tell us clearly what we can improve for you. Every useful
                  suggestion matters.
                </p>
              </div>
            </div>
          </div>

          <div className="card big-card contact-form-card">
            <h2>Send a Message</h2>

            {successMessage && (
              <div className="contact-success-box">{successMessage}</div>
            )}

            {errorMessage && (
              <div className="contact-error-box">{errorMessage}</div>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-grid">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name *"
                  value={formData.name}
                  onChange={handleChange}
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Your Email *"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <input
                type="text"
                name="subject"
                placeholder="Subject *"
                value={formData.subject}
                onChange={handleChange}
              />

              <textarea
                name="message"
                className="contact-textarea"
                placeholder="Write your message... *"
                value={formData.message}
                onChange={handleChange}
              />

              <div className="contact-rating-box">
                <label className="contact-label">Rate our website</label>

                <div className="contact-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={`star-btn ${
                        (hoverRating || rating) >= star ? "active-star" : ""
                      }`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                name="improvement"
                className="contact-textarea small-textarea"
                placeholder="What can we improve for you?"
                value={formData.improvement}
                onChange={handleChange}
              />

              <button
                type="submit"
                className="primary contact-submit-btn"
                disabled={submitting}
              >
                {submitting ? "Sending..." : "Submit Message"}
              </button>
            </form>
          </div>
        </div>
      </div>

    </>
  );
}