import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  getUsers,
  saveUsers
} from "../lib/storage";

const Ctx = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // LOAD USER ON REFRESH
  useEffect(() => {
  const savedUser = JSON.parse(localStorage.getItem("currentUser"));
  if (savedUser) {
    setUser(savedUser);
  }
}, []);

  // LOGIN
  const login = (userData) => {
    setUser(userData);
    setCurrentUser(userData);
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    clearCurrentUser();
  };

  // UPDATE USER (🔥 MOST IMPORTANT FIX)
 const updateUser = (updatedUser, oldUsername = null) => {
  setUser(updatedUser);
  setCurrentUser(updatedUser);

  const users = getUsers();

  const updatedUsers = users.map((u) =>
    u.username === (oldUsername || updatedUser.username) ? updatedUser : u
  );

  saveUsers(updatedUsers);
};

  return (
    <Ctx.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);