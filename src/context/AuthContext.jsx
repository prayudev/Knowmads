import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  getUsers,
  saveUsers
} from "../lib/storage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const savedUser = getCurrentUser();

    if (savedUser) {
      setUser(savedUser);
    }

    setAuthReady(true);
  }, []);

  const login = (userData) => {
    setUser(userData);
    setCurrentUser(userData);
  };

  const logout = () => {
    setUser(null);
    clearCurrentUser();
  };

  const updateUser = (updatedUser, oldUsername = null) => {
    const users = getUsers();

    const updatedUsers = users.map((u) => {
      if (oldUsername) {
        return u.username === oldUsername ? updatedUser : u;
      }
      return u.username === updatedUser.username ? updatedUser : u;
    });

    saveUsers(updatedUsers);
    setCurrentUser(updatedUser);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        authReady
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}