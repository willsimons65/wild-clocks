import React, { useState } from "react";
import ChevronDown from "@/images/assets/chevron-down.svg";

export default function FootnoteToggle({ title, children }) {
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

        <span className="text-white text-base md:text-text-base font-light">
          {title}
        </span>
      </button>

      {/* EXPANDABLE CONTENT */}
      {open && (
        <div className="mt-6 pl-6 border-l-[6px] border-white/30">
          <div className="text-white/70 leading-relaxed space-y-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
