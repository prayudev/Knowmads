export const isValidUsername = (username) => {
  return /^[a-z0-9]+$/.test(username);
};

export const isValidPassword = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/.test(password);
};

export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateRegister = ({ name, email, username, password }) => {
  if (!name || !email || !username || !password) {
    return "All fields required ❌";
  }

  if (!isValidEmail(email)) {
    return "Enter a valid email ❌";
  }

  if (!isValidUsername(username)) {
    return "Username must be small letters + numbers only (no space) ❌";
  }

  if (!isValidPassword(password)) {
    return "Password must have Capital, small & symbol (min 6 chars) ❌";
  }

  return null;
};