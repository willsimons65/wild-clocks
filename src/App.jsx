// src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import LittleKnepp from "./pages/LittleKnepp";
import AppletonWoods from "./pages/AppletonWoods";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#1E1E1E] text-white flex flex-col">

        <div className="flex-1">
          <Routes>

            {/* Home */}
            <Route path="/" element={<Home />} />

            {/* Updated route — matches PlacesGrid URL */}
            <Route path="/little-knepp" element={<LittleKnepp />} />

            {/* Appleton Woods */}
            <Route path="/appleton-woods" element={<AppletonWoods />} />

            {/* Redirect old naming */}
            <Route path="/parklands" element={<Navigate to="/little-knepp" replace />} />

            {/* Catch-all: redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </div>

      </div>
    </Router>
  );
}
















