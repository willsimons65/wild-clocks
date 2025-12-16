// src/components/auth/ProtectedRoute.jsx

import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  // ✅ Allow everything in local dev
  if (import.meta.env.DEV) {
    return children;
  }

  const token = localStorage.getItem("wc_auth");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

