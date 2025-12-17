import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user) {
    // Si no hay usuario logueado, redirige a /login
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Si el usuario no tiene el rol requerido, redirige a inicio
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
