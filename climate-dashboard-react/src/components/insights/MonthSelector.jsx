// src/components/insights/MonthSelector.jsx

import NavPill from "@/components/ui/NavPill";
import { useState, useRef, useEffect } from "react";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function MonthSelector({
  monthIndex,
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
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
    <div ref={ref} className="relative">
      {/* Button */}
        <NavPill
            onClick={() => setOpen((v) => !v)}
            withChevron
            title="Choose month"
            className="h-11 px-4 text-sm"
        >
        {MONTHS[monthIndex]?.slice(0, 3) || "Mon"}
        </NavPill>

      {/* Dropdown */}
      {open && (
        <div
          className="
            absolute right-0 mt-2 w-40
            rounded-xl bg-[#2A2A2A]
            border border-white/20
            shadow-lg z-50
            animate-fadeIn
          "
        >
          {MONTHS.map((label, index) => (
            <button
              key={label}
              onClick={() => {
                onChange(index);
                setOpen(false);
              }}
              className={`
                w-full px-4 py-2 text-left
                hover:bg-white/10
                ${index === monthIndex ? "bg-white/10" : ""}
              `}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
