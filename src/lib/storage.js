// ================= USERS STORAGE =================

// Get all users
export const getUsers = () => {
  return JSON.parse(localStorage.getItem("users")) || [];
};

// Save all users
export const saveUsers = (users) => {
  localStorage.setItem("users", JSON.stringify(users));
};

// ================= CURRENT USER =================

// Set current logged in user
export const setCurrentUser = (user) => {
  localStorage.setItem("currentUser", JSON.stringify(user));
};

// Get current logged in user
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("currentUser"));
};

// Logout (clear current user)
export const clearCurrentUser = () => {
  localStorage.removeItem("currentUser");
};