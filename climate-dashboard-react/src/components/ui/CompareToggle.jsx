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
          className={`w-4 h-4 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />

        <span className="text-teal-400 text-base font-light">
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

