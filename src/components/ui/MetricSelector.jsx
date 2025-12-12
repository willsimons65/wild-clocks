// src/components/ui/MetricSelector.jsx

import React, { useState, useRef, useEffect, useMemo } from "react";

import TempIcon from "@/images/assets/temperature.svg";
import RainIcon from "@/images/assets/rainfall.svg";
import HumidIcon from "@/images/assets/humidity.svg";
import PhotoIcon from "@/images/assets/photoperiod.svg";

export default function MetricSelector({ selected, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Memoized metric list (prevents re-creating objects every render)
  const metrics = useMemo(
    () => [
      { key: "temperature", label: "Temperature", icon: TempIcon },
      { key: "rainfall", label: "Rainfall", icon: RainIcon },
      { key: "humidity", label: "Humidity", icon: HumidIcon },
      { key: "photoperiod", label: "Photoperiod", icon: PhotoIcon },
    ],
    []
  );

  const selectedMetric = metrics.find((m) => m.key === selected);

  // Close when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative ml-auto" ref={ref}>
      {/* BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="header-btn flex items-center gap-1"
      >
        <img src={selectedMetric.icon} alt="" className="w-4 h-4" />

        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M1 1L6.16129 6L11 1"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className="
            absolute right-0 mt-2 w-40 rounded-xl
            bg-[#2A2A2A] border border-white/20 shadow-lg z-50
            animate-fadeIn
          "
        >
          {metrics.map((m) => (
            <button
              key={m.key}
              onClick={() => {
                onChange(m.key);
                setOpen(false);
              }}
              className={`
                w-full flex items-center gap-2 px-4 py-3 text-left
                hover:bg-white/10 transition
                ${m.key === selected ? "bg-white/10" : ""}
              `}
            >
              <img src={m.icon} alt="" className="w-4 h-4" />
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
