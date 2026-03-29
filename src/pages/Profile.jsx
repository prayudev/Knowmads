import React from "react";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <>
      <Header />

      <div className="container">
        <h2>Your Profile</h2>

        <div className="profile-box">
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Category:</strong> {user?.category}</p>
          <p><strong>Goal:</strong> {user?.subCategory}</p>
        </div>
      </div>
    </>
  );
}