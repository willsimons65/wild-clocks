import React, { useState } from "react";
import ChevronDown from "@/images/assets/chevron-down.svg";

export default function CompareToggle({
  title,
  children,
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="pt-0">
      {/* HEADER */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 text-left w-full focus:outline-none"
        aria-expanded={open}
      >
        <img
        src={ChevronDown}
        alt=""
        className={`w-3.5 h-3.5 opacity-80 transition-transform duration-200 ${
            open ? "rotate-180" : ""
        }`}
        />

        <span className="text-teal-400 text-sm font-light">
          {title}
        </span>
      </button>

      {/* CONTENT */}
      {open && (
        <div className="mt-3 w-full">
          {children}
        </div>
      )}
    </div>
  );
}

