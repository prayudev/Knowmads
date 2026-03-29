import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">

        {/* TOP */}
        <div className="site-footer-top">

          {/* BRAND */}
          <div className="footer-brand">
            <h2 className="footer-logo-text">Knowmads</h2>
            <p className="footer-tagline">
              Smart study platform to manage subjects, notes, schedule,
              current affairs and track your daily progress easily.
            </p>
          </div>

          {/* SITEMAP */}
          <div className="footer-links-block">
            <h3>Quick Links</h3>
            <div className="footer-links">
              <Link to="/">Dashboard</Link>
              <Link to="/subjects">Subjects</Link>
              <Link to="/schedule">Schedule</Link>
              <Link to="/timer">Timer</Link>
              <Link to="/progress">Progress</Link>
              <Link to="/notes">Notes</Link>
              <Link to="/CurrentAffairs">Current Affairs</Link>
              <Link to="/about">About</Link>
              <Link to="/faq">FAQ</Link>
              <Link to="/contact">Contact</Link>  
            </div>
          </div>

          {/* SOCIAL */}
          <div className="footer-social-block">
            <h3>Connect</h3>

            <div className="footer-socials">

              <a
                href="https://wa.me/919973307526"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>

              <a
                href="https://t.me/priyastudydiary"
                target="_blank"
                rel="noreferrer"
              >
                Telegram
              </a>

              {/* 
                IMPORTANT:
                Replace YOUR_TELEGRAM_USERNAME
              */}

              <a
                href="https://instagram.com/YOUR_INSTAGRAM_USERNAME"
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>

              {/* Replace YOUR_INSTAGRAM_USERNAME */}

            </div>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="site-footer-bottom">
          <p>© 2026 Knowmads. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}