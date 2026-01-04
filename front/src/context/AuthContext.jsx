// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Multiple user accounts with different roles
  const USERS = [
    {
      username: "admin",
      password: "admin123",
      role: "admin",
      email: "admin@selectionstore.com",
      name: "Admin User"
    },
    {
      username: "moderator",
      password: "mod123",
      role: "moderator",
      email: "moderator@selectionstore.com",
      name: "Moderator User"
    }
  ];

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (username, password) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find user by username and password
    const foundUser = USERS.find(
      u => u.username === username && u.password === password
    );

    if (foundUser) {
      const userData = {
        username: foundUser.username,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        loginTime: new Date().toISOString(),
      };
      
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      return { success: true, user: userData };
    } else {
      return { success: false, error: "Invalid username or password" };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    hasRole,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};