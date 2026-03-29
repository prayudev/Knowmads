import React, { useState } from "react";
import Header from "../components/Header";
import { Helmet } from "react-helmet-async";

export default function About() {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <>
      <div className={showTerms ? "about-page-blur" : ""}>
        <Header />
            
        <div className="dashboard-container">
          <div className="card big-card about-page-card">
            <Helmet>
              <title>About Knowmads - Your Smart Study Companion</title>
              <meta
                name="description"
                content="Learn about Knowmads, the smart and simple learning platform designed to help students stay organized, focused, and consistent in their studies. Discover its features, purpose, and how it can benefit you."
              />
            </Helmet>
            <h1 className="subjects-title">About Knowmads</h1>
            <p className="muted">
              Knowmads is a smart and simple learning platform designed to help
              students stay organized, focused, and consistent in their studies.
            </p>

            <div className="about-section">
              <h3>What Knowmads does</h3>
              <p>
                Knowmads helps students manage subjects, topics, study schedules,
                notes, current affairs, and personal progress in one place. It is
                made to give students a clean and easy study experience without
                confusion.
              </p>
            </div>

            <div className="about-section">
              <h3>Why this platform was created</h3>
              <p>
                Many students face difficulty in managing study material,
                tracking progress, and staying regular every day. Knowmads was
                created to make study planning more practical, motivating, and
                student-friendly.
              </p>
            </div>

            <div className="about-section">
              <h3>Who can use it</h3>
              <p>
                This platform is useful for school students, college students,
                government exam aspirants, and anyone who wants to study in a
                more structured way.
              </p>
            </div>

            <div className="about-section">
              <h3>Main features</h3>
              <ul className="about-list">
                <li>Subject and topic management</li>
                <li>Schedule and task tracking</li>
                <li>Progress analysis</li>
                <li>Timer and study session tracking</li>
                <li>Notes and resources</li>
                <li>Current affairs and important updates</li>
              </ul>
            </div>

            <div className="about-section">
              <h3>Terms & Conditions</h3>
              <button
                type="button"
                className="notes-link-btn"
                onClick={() => setShowTerms(true)}
              >
                Read Terms & Conditions
              </button>
            </div>
          </div>
        </div>

        {/* Floating Contact Buttons */}
        <div className="floating-contact-wrap">

  {/* WhatsApp */}
  <a
    href="https://wa.me/919973307526"
    target="_blank"
    rel="noreferrer"
    className="floating-contact-btn whatsapp-btn"
    title="Chat on WhatsApp"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className="floating-svg-icon"
    >
      <path
        fill="white"
        d="M16 .4C7.3.4.4 7.3.4 16c0 2.8.7 5.4 2 7.7L.4 31.6l8-2c2.2 1.2 4.7 1.9 7.3 1.9 8.7 0 15.6-6.9 15.6-15.6S24.7.4 16 .4zm0 28.7c-2.3 0-4.5-.6-6.5-1.7l-.5-.3-4.7 1.2 1.3-4.6-.3-.5C3.9 21.2 3.3 19 3.3 16 3.3 9.1 9.1 3.3 16 3.3S28.7 9.1 28.7 16 22.9 29.1 16 29.1zm7.4-9.6c-.4-.2-2.3-1.1-2.6-1.2-.4-.1-.6-.2-.9.2-.2.4-1 1.2-1.2 1.4-.2.2-.5.3-.9.1-2.3-1.1-3.8-2-5.3-4.5-.4-.6.4-.6 1-2 .1-.2.1-.5 0-.7-.1-.2-.9-2.1-1.3-2.9-.3-.8-.6-.7-.9-.7h-.7c-.2 0-.7.1-1.1.5-.4.4-1.4 1.4-1.4 3.4s1.4 4 1.6 4.3c.2.3 2.8 4.2 6.8 5.9 1 .4 1.7.6 2.3.8 1 .3 1.9.2 2.6.1.8-.1 2.3-.9 2.7-1.7.3-.8.3-1.5.2-1.7-.1-.2-.3-.3-.7-.5z"
      />
    </svg>
  </a>

  {/* Telegram */}
  <a
    href="https://t.me/YOUR_TELEGRAM_USERNAME"
    target="_blank"
    rel="noreferrer"
    className="floating-contact-btn telegram-btn"
    title="Open Telegram"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 240"
      className="floating-svg-icon"
    >
      <path
        fill="white"
        d="M120 0C53.7 0 0 53.7 0 120s53.7 120 120 120 120-53.7 120-120S186.3 0 120 0zm58.9 82.6l-19.8 93.6c-1.5 6.6-5.5 8.2-11.2 5.1l-31-22.8-15 14.4c-1.7 1.7-3.1 3.1-6.3 3.1l2.2-31.3 56.9-51.4c2.5-2.2-.5-3.4-3.9-1.2l-70.4 44.4-30.3-9.5c-6.6-2.1-6.7-6.6 1.4-9.8l118.3-45.6c5.5-2 10.3 1.3 8.5 9z"
      />
    </svg>
  </a>

</div>
        {/* 
          IMPORTANT:
          Replace YOUR_TELEGRAM_USERNAME in the Telegram link above.
          Example:
          https://t.me/your_username
        */}
      </div>

      {showTerms && (
        <div
          className="subject-modal-overlay about-overlay-strong"
          onClick={() => setShowTerms(false)}
        >
          <div
            className="subject-modal about-terms-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="subject-modal-close"
              onClick={() => setShowTerms(false)}
            >
              ×
            </button>

            <h2>Terms & Conditions</h2>

            <div className="about-terms-content">
              <p>
                Knowmads is created for educational and personal study support
                purposes. Users are expected to use the platform responsibly.
              </p>

              <p>
                Users should not upload harmful, offensive, illegal, or
                misleading content. Public resources should be useful and
                respectful for all learners.
              </p>

              <p>
                Admin resources, notes, and updates are shared to help students,
                but users should still verify important academic or official
                information from trusted sources when needed.
              </p>

              <p>
                Knowmads may improve features, layout, and content sections over
                time to provide a better student experience.
              </p>

              <p>
                By using this platform, users agree to use it only for positive,
                educational, and study-related purposes.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}