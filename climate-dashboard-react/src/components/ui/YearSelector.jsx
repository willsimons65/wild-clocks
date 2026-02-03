// src/components/ui/YearSelector.jsx

import React, { useState, useRef, useEffect } from "react";
import NavPill from "@/components/ui/NavPill";

export default function YearSelector({
  years = [],
  selectedYear,
  onYearChange,
  compact = false,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = years.find((y) => y.year === selectedYear);

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

      <NavPill
        onClick={() => setOpen(!open)}
        withChevron
        className={compact ? "h-11 px-4 text-sm" : ""}
        title="Choose year"
      >
        <span>{selected?.year ?? "Year"}</span>
      </NavPill>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-xl bg-[#2A2A2A] border border-white/20 shadow-lg z-50">
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
                  <span className="text-sm text-white/40">No data</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}






