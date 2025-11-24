
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// This component will protect both normal and admin routes
const ProtectedRoute = ({ requiredRole }) => {
  const token = localStorage.getItem("token");
  const normalizedRole = localStorage.getItem("role_normalized");

  // If no token, user is not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required (like ADMIN), check it
  if (requiredRole && normalizedRole !== requiredRole.toUpperCase()) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Otherwise, allow access
  return <Outlet />;
};

export default ProtectedRoute;
