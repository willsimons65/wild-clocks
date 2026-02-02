// src/components/ui/MetricSelector.jsx

import React, { useState, useRef, useEffect, useMemo } from "react";

import TempIcon from "@/images/assets/temperature.svg";
import RainIcon from "@/images/assets/rainfall.svg";
import HumidIcon from "@/images/assets/humidity.svg";
import PhotoIcon from "@/images/assets/photoperiod.svg";

export default function MetricSelector({
  selected,
  onChange,
  disabled = false,
  subtle = false,
  compact = false,
}) {
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
    <div className="relative" ref={ref}>
      {/* BUTTON */}
      <button
  onClick={() => {
    if (disabled) return;
    setOpen((v) => !v);
  }}
  className={`
    header-btn flex items-center gap-1 whitespace-nowrap shrink-0
    ${compact ? "px-3" : ""}
    ${subtle ? "opacity-50" : ""}
    ${disabled ? "cursor-default" : ""}
  `}
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
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </button>

{/* DROPDOWN */}
{open && (
  <div
    className="
      absolute right-0 mt-2 w-44
      rounded-xl
      bg-[#2A2A2A]
      border border-white/20
      shadow-lg
      overflow-hidden
      z-50
    "
  >
    {metrics.map((m) => {
      const isSelected = m.key === selected;

      return (
        <button
          key={m.key}
          onClick={() => {
            onChange(m.key);
            setOpen(false);
          }}
          className={`
            w-full flex items-center gap-3
            px-4 py-3 text-left
            text-sm
            transition-colors
            ${isSelected ? "bg-white/10" : "hover:bg-white/5"}
          `}
        >
          <img
            src={m.icon}
            alt=""
            className="w-4 h-4 opacity-80"
          />
          <span className="text-white">{m.label}</span>
        </button>
      );
    })}
  </div>
)}

    </div>
  );
}
