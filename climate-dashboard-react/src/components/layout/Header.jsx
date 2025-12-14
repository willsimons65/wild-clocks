// src/components/layout/Header.jsx

import { ArrowLeft, ChevronDown } from "lucide-react";
import YearSelector from "@/components/ui/YearSelector";
import MetricSelector from "@/components/ui/MetricSelector";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header({ placeName, year, setYear, metric, setMetric }) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Back logic
  function handleBack() {
    if (window.history.length > 1) navigate(-1);
    else navigate("/");
  }

  // Year list
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 1 + i);

  return (
    <header className="sticky top-0 z-50 bg-[#1E1E1E]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center justify-between">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-3 relative">
          <button onClick={handleBack} className="header-btn">
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Place name */}
          <h1 className="text-xl font-semibold tracking-tight flex items-center gap-1">
            {placeName}

            {/* ⭐ MOBILE CHEVRON ONLY (hidden on md+) */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden"
            >
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  mobileOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </h1>

          {/* MOBILE DROPDOWN */}
          {mobileOpen && (
            <div className="absolute top-12 left-10 w-32 bg-[#2A2A2A] border border-white/10 rounded-xl shadow-xl md:hidden">
              {years.map((y) => (
                <button
                  key={y}
                  className={`w-full text-left px-4 py-2 text-white hover:bg-white/10 ${
                    y === year ? "bg-white/10" : ""
                  }`}
                  onClick={() => {
                    setYear(y);
                    setMobileOpen(false);
                  }}
                >
                  {y}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDE — desktop only */}
        <div className="hidden md:flex items-center gap-3">
          <YearSelector selectedYear={year} onYearChange={setYear} />
          <MetricSelector selected={metric} onChange={setMetric} />
        </div>

        {/* On mobile only, keep metrics button on right */}
        <div className="md:hidden">
          <MetricSelector selected={metric} onChange={setMetric} />
        </div>
      </div>
    </header>
  );
}




 
