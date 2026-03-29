import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUsers, setCurrentUser } from "../lib/storage";
import { Helmet } from "react-helmet-async";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const found = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!found) {
    alert("Invalid credentials");
    return;
  }

  login(found);

  // ✅ CHECK: profile complete or not
  if (found.category && found.subCategory) {
    nav("/", { replace: true }); // dashboard
  } else {
    nav("/select-class", { replace: true }); // new user
  }
};

  return (
    <div className="container">
       <Helmet>
        <title>Login - Knowmads Study Planner</title>
        <meta
          name="description"
          content="Login to your Knowmads account and access your personalized study planner, schedule, and resources. Stay organized and focused on your learning journey with Knowmads."
        />
      </Helmet>  
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

      <button onClick={submit}>Login</button>

      <Link to="/register" className="link">
        Create account
      </Link>
    </div>
  );
}