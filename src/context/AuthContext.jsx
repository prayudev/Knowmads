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
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // LOGIN
 const login = (userData) => {
  setUser(userData);
  localStorage.setItem("currentUser", JSON.stringify(userData));
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