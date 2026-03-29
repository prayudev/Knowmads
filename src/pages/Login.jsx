import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUsers, saveUsers } from "../lib/storage";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotUsername, setForgotUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [matchedUserIndex, setMatchedUserIndex] = useState(-1);

  const submit = () => {
    if (!username.trim() || !password.trim()) {
      alert("Username and password required ❌");
      return;
    }

    const users = getUsers();
    const foundUser = users.find(
      (u) => u.username === username.trim() && u.password === password
    );

    if (!foundUser) {
      alert("Invalid username or password ❌");
      return;
    }

    login(foundUser);
    alert("Login successful ✅");

    if (!foundUser.category || !foundUser.subCategory) {
      nav("/select-class");
    } else {
      nav("/");
    }
  };

  const openForgotPassword = () => {
    setShowForgotPassword(true);
    setForgotStep(1);
    setForgotUsername("");
    setNewPassword("");
    setConfirmNewPassword("");
    setMatchedUserIndex(-1);
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotStep(1);
    setForgotUsername("");
    setNewPassword("");
    setConfirmNewPassword("");
    setMatchedUserIndex(-1);
  };

  const handleCheckUsername = () => {
    if (!forgotUsername.trim()) {
      alert("Please enter username ❌");
      return;
    }

    const users = getUsers();
    const userIndex = users.findIndex(
      (u) => u.username === forgotUsername.trim()
    );

    if (userIndex === -1) {
      alert("Username not found ❌");
      return;
    }

    setMatchedUserIndex(userIndex);
    setForgotStep(2);
  };

  const handleResetPassword = () => {
    if (!newPassword.trim() || !confirmNewPassword.trim()) {
      alert("Please fill both password fields ❌");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    const users = getUsers();

    if (matchedUserIndex === -1 || !users[matchedUserIndex]) {
      alert("Something went wrong. Please try again ❌");
      return;
    }

    users[matchedUserIndex] = {
      ...users[matchedUserIndex],
      password: newPassword
    };

    saveUsers(users);

    alert("Password changed successfully ✅");
    closeForgotPassword();
  };

  const handleForgotUsername = () => {
    window.open("https://t.me/YOUR_TELEGRAM_USERNAME", "_blank");
  };

  return (
    <>
      <div className={`container auth-page-only ${showForgotPassword ? "auth-blur-bg" : ""}`}>
        <h2>Login</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={submit} className="primary">
          Login
        </button>

        <div className="login-help-row">
          <button
            type="button"
            className="login-help-btn"
            onClick={openForgotPassword}
          >
            Forgot Password?
          </button>

          <button
            type="button"
            className="login-help-btn"
            onClick={handleForgotUsername}
          >
            Forgot Username?
          </button>

          <Link to="/register" className="login-help-link">
            Register
          </Link>
        </div>
      </div>

      {showForgotPassword && (
        <div
          className="subject-modal-overlay auth-overlay-strong"
          onClick={closeForgotPassword}
        >
          <div
            className="subject-modal forgot-password-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="subject-modal-close"
              onClick={closeForgotPassword}
            >
              ×
            </button>

            <h2>Forgot Password</h2>

            {forgotStep === 1 && (
              <>
                <p className="muted">Enter your username to continue.</p>

                <input
                  placeholder="Enter Username"
                  value={forgotUsername}
                  onChange={(e) => setForgotUsername(e.target.value)}
                />

                <button
                  type="button"
                  className="primary forgot-password-submit"
                  onClick={handleCheckUsername}
                >
                  Continue
                </button>
              </>
            )}

            {forgotStep === 2 && (
              <>
                <p className="muted">Username verified. Set your new password.</p>

                <input
                  type="password"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="primary forgot-password-submit"
                  onClick={handleResetPassword}
                >
                  Change Password
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}