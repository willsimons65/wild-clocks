// src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "@/pages/Login";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import Home from "@/pages/Home";
import LittleKnepp from "@/pages/LittleKnepp";
import AppletonWoods from "@/pages/AppletonWoods";
import littleKneppClimate from "@/data/aggregates/little-knepp.json";
import appletonWoodsClimate from "@/data/aggregates/appleton-woods.json";
import About from "@/pages/About";
import InsightsPage from "@/components/insights/InsightsPage";
import PhotoViewer from "@/pages/PhotoViewer";

export default function App() {
  const DEFAULT_YEAR = 2026;

  // ✅ useState at top level (initializer function is OK)
  const [year, setYear] = useState(() => {
    const stored = localStorage.getItem("wildclocks:year");
    return stored ? Number(stored) : DEFAULT_YEAR;
  });

  const [place, setPlace] = useState(() => {
    return localStorage.getItem("wildclocks:place") || "little-knepp";
  });

  const climateData = place === "appleton-woods"
  ? appletonWoodsClimate
  : littleKneppClimate;

  // ✅ useEffect at top level
  useEffect(() => {
    localStorage.setItem("wildclocks:year", String(year));
  }, [year]);

  useEffect(() => {
    localStorage.setItem("wildclocks:place", place);
  }, [place]); 

  return (
    <Router>
      <div className="min-h-screen bg-[#1E1E1E] text-white flex flex-col">
        <div className="flex-1">
          <Routes>

            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/about"
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              }
            />

            <Route
              path="/little-knepp"
              element={
                <LittleKnepp
                  year={year}
                  setYear={setYear}
                  setPlace={() => setPlace("little-knepp")}
                />
              }
            />

            <Route
              path="/appleton-woods"
              element={
                <AppletonWoods
                  year={year}
                  setYear={setYear}
                  setPlace={() => setPlace("appleton-woods")}
                />
              }
            />

            <Route
              path="/viewer/:place/:year/:month"
              element={
                <ProtectedRoute>
                  <PhotoViewer />
                </ProtectedRoute>
              }
            />

            <Route
              path="/insights"
              element={
                <ProtectedRoute>
                  <InsightsPage
                    year={year}
                    setYear={setYear}
                    place={place}
                    climateData={climateData}
                  />
                </ProtectedRoute>
              }
            />


            <Route path="/parklands" element={<Navigate to="/little-knepp" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}
















