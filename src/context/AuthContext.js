import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  // Load admin from localStorage on refresh
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const loginAdmin = (adminData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("admin", JSON.stringify(adminData));
    setAdmin(adminData);
  };

  const updateAdmin = (updatedAdmin) => {
    localStorage.setItem("admin", JSON.stringify(updatedAdmin));
    setAdmin(updatedAdmin);
  };

  const logout = () => {
    localStorage.clear();
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loginAdmin, updateAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
