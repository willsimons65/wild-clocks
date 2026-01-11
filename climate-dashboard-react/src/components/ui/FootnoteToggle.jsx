// src/components/ui/FootnoteToggle.jsx

import React, { useState } from "react";
import ChevronDown from "@/images/assets/chevron-down.svg";

export default function FootnoteToggle({ title, children, noBorder = false }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="pt-2">
      {/* TOGGLE HEADER */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 text-left w-full focus:outline-none"
        aria-expanded={open}
      >
        <img
          src={ChevronDown}
          alt=""
          className={`w-4 h-4 transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />

        <span className="text-teal-400 text-base md:text-text-base font-light">
          {title}
        </span>
      </button>

      {/* EXPANDABLE CONTENT */}
      {open && (
        <div className="mt-6 flex">
          {/* LEFT RULE (aligned with chevron) */}
          {!noBorder && (
            <div className="w-[6px] bg-white/30 shrink-0" />
          )}

          {/* CONTENT */}
          <div className="pl-6 text-white/70 leading-relaxed space-y-4 w-full">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}


