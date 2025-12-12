// src/components/layout/Header.jsx

import { ArrowLeft } from "lucide-react";
import YearSelector from "@/components/ui/YearSelector";
import MetricSelector from "@/components/ui/MetricSelector";
import { useNavigate } from "react-router-dom";

export default function Header({ placeName, year, setYear, metric, setMetric }) {
  const navigate = useNavigate();

  // Hybrid back button: go back if possible, else go home
  function handleBack() {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-[#1E1E1E]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="header-btn">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold tracking-tight">{placeName}</h1>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          <YearSelector selectedYear={year} onYearChange={setYear} />
          <MetricSelector selected={metric} onChange={setMetric} />
        </div>
      </div>
    </header>
  );
}



 
