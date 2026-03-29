import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateRegister } from "../lib/validation";
import { getUsers, saveUsers } from "../lib/storage";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xnnbkyqk";

export default function Register() {
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Registration data Formspree pe bhejne ke liye
  const sendRegistrationToFormspree = async (userData) => {
    try {
      const body = new FormData();
      body.append("type", "User Registration");
      body.append("name", userData.name || "");
      body.append("email", userData.email || "");
      body.append("username", userData.username || "");
      body.append("category", userData.category || "");
      body.append("subCategory", userData.subCategory || "");
      body.append("createdAt", new Date().toISOString());

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json"
        },
        body
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Formspree registration error:", result);
      } else {
        console.log("Registration sent to Formspree successfully");
      }
    } catch (error) {
      console.error("Registration Formspree submit failed:", error);
    }
  };

  const submit = async () => {
    const err = validateRegister({ name, email, username, password });
    if (err) {
      alert(err);
      return;
    }

    const users = getUsers();

    const exists = users.find((u) => u.username === username);
    if (exists) {
      alert("Username already exists ❌");
      return;
    }

    const newUser = {
      name,
      email,
      username,
      password,
      category: "",
      subCategory: "",
      profileImage: "",
      studyTime: 0,
      streak: 0,
      lastStudyDate: "",
      tasks: [],
      subjects: [],
      completedSessions: 0
    };

    try {
      setLoading(true);

      users.push(newUser);
      saveUsers(users);

      await sendRegistrationToFormspree(newUser);

      alert("Account created ✅");

      setName("");
      setEmail("");
      setUsername("");
      setPassword("");

      nav("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container auth-page-only">
      <h2>Register</h2>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

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

      <button onClick={submit} className="primary" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>
    </div>
  );
}