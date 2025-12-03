
import React from "react";
import { Navigate, Outlet } from "react-router-dom";


const ProtectedRoute = ({ requiredRole }) => {
  const token = localStorage.getItem("token");
  const normalizedRole = localStorage.getItem("role_normalized");


  if (!token) {
    return <Navigate to="/login" replace />;
  }

 
  if (requiredRole && normalizedRole !== requiredRole.toUpperCase()) {
    return <Navigate to="/unauthorized" replace />;
  }

  
  return <Outlet />;
};

export default ProtectedRoute;
