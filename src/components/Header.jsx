import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import ProfilePanel from "./ProfilePanel";

export default function Header() {
  const { logout } = useAuth();
  const location = useLocation();

  const [time, setTime] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Subjects", path: "/subjects" },
    { name: "Schedule", path: "/schedule" },
    { name: "Timer", path: "/timer" },
    { name: "Progress", path: "/progress" },
    { name: "Current Affairs", path: "/CurrentAffairs" },
    { name: "Notes", path: "/notes" },
    { name: "About", path: "/about" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact", path: "/contact"}
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const formatDay = (date) => {
    return date.toLocaleDateString("en-IN", {
      weekday: "long"
    });
  };

  const handleLogout = () => {
    setProfileOpen(false);
    setMenuOpen(false);
    logout();
  };

  const handleCloseProfile = () => {
    setProfileOpen(false);
  };

  const handleProfileClick = () => {
    setProfileOpen(!profileOpen);
    setMenuOpen(false);
  };

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
    setProfileOpen(false);
  };

  return (
    <>
      <div className="navbar">
        {/* LEFT */}
        <div className="nav-left">
          <img
            src="https://pub-1407f82391df4ab1951418d04be76914.r2.dev/uploads/e43e5c9d-237c-4ff4-a262-35f6b426f264.png"
            alt="knowmads Logo"
            className="logo-img"
          />
          <h2 className="logo-text">Knowmads</h2>
        </div>

        {/* CENTER */}
        <div className="nav-center-wrap">
          <div className="nav-live-time desktop-time">
            ⏱ {formatTime(time)}
          </div>

          <div className="nav-center">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={location.pathname === item.path ? "active-link" : ""}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="nav-live-date desktop-date">
            <span className="nav-day">{formatDay(time)}</span>
            <span className="nav-date">{formatDate(time)}</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="nav-right">
          <ThemeToggle />

          <div className="profile-wrapper">
            <div className="profile-icon" onClick={handleProfileClick}>
              👤
            </div>
          </div>

          <div className="hamburger" onClick={handleMenuClick}>
            ☰
          </div>
        </div>
      </div>

      {/* MOBILE / TABLET INFO BAR */}
      <div className="mobile-time-bar">
        <span className="mobile-time">⏱ {formatTime(time)}</span>
        <span className="mobile-date">
          {formatDay(time)}, {formatDate(time)}
        </span>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={location.pathname === item.path ? "active-link" : ""}
              onClick={() => setMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}

      <ProfilePanel
        open={profileOpen}
        onClose={handleCloseProfile}
        onLogout={handleLogout}
      />
    </>
  );
}