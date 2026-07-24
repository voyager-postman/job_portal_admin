import React, { createContext, useState, useEffect } from "react";
import {
  clearStoredToken,
  persistAuthToken,
} from "../utils/authToken";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const loginAdmin = (adminData, token) => {
    clearStoredToken();

    if (token) {
      persistAuthToken(token);
    }

    localStorage.setItem("admin", JSON.stringify(adminData));
    setAdmin(adminData);
  };

  const updateAdmin = (updatedAdmin) => {
    localStorage.setItem("admin", JSON.stringify(updatedAdmin));
    setAdmin(updatedAdmin);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    localStorage.removeItem("authMode");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loginAdmin, updateAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
