// src/contexts/AuthContext.js

import React, { createContext, useState, useEffect } from "react";

// Create a Context for the auth state
export const AuthContext = createContext();

// Create a Provider component
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    // Check for authentication (e.g., check local storage or make an API call)
    const storedAuth = JSON.parse(localStorage.getItem("auth"));
    setAuth(storedAuth);
  }, []);

  const login = (user) => {
    setAuth(user);
    localStorage.setItem("auth", JSON.stringify(user));
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
