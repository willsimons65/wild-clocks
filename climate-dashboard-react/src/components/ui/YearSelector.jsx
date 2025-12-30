// src/components/selectors/YearSelector.jsx

import React, { useState, useRef, useEffect } from "react";

export default function YearSelector({
  years = [],            // [{ year: number, disabled?: boolean }]
  selectedYear,
  onYearChange,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = years.find((y) => y.year === selectedYear);

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
        <span>{selected?.year}</span>

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
          {years.map(({ year, disabled }) => (
            <button
              key={year}
              disabled={disabled}
              onClick={() => {
                if (disabled) return;
                onYearChange(year);
                setOpen(false);
              }}
              className={`
                w-full px-4 py-3 text-left
                transition
                ${
                  disabled
                    ? "text-white/40 cursor-not-allowed"
                    : "text-white hover:bg-white/10"
                }
                ${year === selectedYear ? "bg-white/10" : ""}
              `}
            >
              <div className="flex items-center justify-between">
                <span>{year}</span>
                {disabled && (
                  <span className="text-sm text-white/40">
                    No data
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}






