// src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "@/pages/Login";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import Home from "@/pages/Home";
import LittleKnepp from "@/pages/LittleKnepp";
import AppletonWoods from "@/pages/AppletonWoods";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#1E1E1E] text-white flex flex-col">
        <div className="flex-1">
          <Routes>

            {/* -------------------- */}
            {/* Public route */}
            {/* -------------------- */}
            <Route path="/login" element={<Login />} />

            {/* -------------------- */}
            {/* Protected routes */}
            {/* -------------------- */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/little-knepp"
              element={
                <ProtectedRoute>
                  <LittleKnepp />
                </ProtectedRoute>
              }
            />

            <Route
              path="/appleton-woods"
              element={
                <ProtectedRoute>
                  <AppletonWoods />
                </ProtectedRoute>
              }
            />

            {/* Redirect old naming */}
            <Route
              path="/parklands"
              element={<Navigate to="/little-knepp" replace />}
            />

            {/* Catch-all */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

















