// src/components/ui/InfoTooltip.jsx

import { useState } from "react";

export default function InfoTooltip({ children, content, label = "More information" }) {
  const [open, setOpen] = useState(false);

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-6 w-6 items-center justify-center rounded-full border border-white/70 text-white/90 transition hover:bg-white/10"
      >
        {children}
      </button>

      {open && (
        <span className="absolute left-1/2 top-9 z-50 w-[360px] -translate-x-1/2 rounded-2xl border border-white/10 bg-[#1E1E1E]/95 p-5 text-left text-sm not-italic text-white/80 shadow-2xl backdrop-blur-md">
          {content}
        </span>
      )}
    </span>
  );
}