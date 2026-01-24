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
      <button
        onClick={() => setOpen(v => !v)}
        className="
          header-btn flex items-center gap-1
          px-4 py-2 rounded-full
        "
      >
        {MONTHS[monthIndex].slice(0, 3)}
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M1 1L6 6L11 1"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

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
