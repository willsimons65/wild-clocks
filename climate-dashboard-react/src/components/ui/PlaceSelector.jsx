// src/components/ui/PlaceSelector.jsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { places, getPlaceBySlug } from "@/data/places";

export default function PlaceSelector({
  place,
  setPlace,
  className = "",
  align = "left",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

const slugFromPath = location.pathname.replace("/", "");

const currentPlace = useMemo(
  () => getPlaceBySlug(place) || getPlaceBySlug(slugFromPath) || places[0],
  [place, slugFromPath]
);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    function handleEscape(e) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function buildNextPath(nextSlug) {
    const pathname = location.pathname;

    // Place pages
    if (
      pathname === "/little-knepp" ||
      pathname === "/appleton-woods" ||
      pathname === "/thousand-year-trust"
    ) {
      return `/${nextSlug}`;
    }

    // Insights stays on insights, but updates app-level place state
    if (pathname === "/insights") {
      return "/insights";
    }

    // Fallback: go to chosen place root
    return `/${nextSlug}`;
  }

  function handleSelect(nextPlace) {
    if (!nextPlace) return;

    setPlace(nextPlace.slug);
    navigate(buildNextPath(nextPlace.slug));
    setOpen(false);
  }

  const menuAlignClass =
    align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left";

return (
  <div className={`relative min-w-0 ${className}`} ref={ref}>
<button
  type="button"
  onClick={() => setOpen((prev) => !prev)}
  className="inline-flex min-w-0 items-start gap-2 md:gap-3 text-white font-semibold text-xl md:text-xl mt-[10px] md:mt-0"
  aria-haspopup="listbox"
  aria-expanded={open}
  aria-label="Choose location"
>
  <span className="block min-w-0 max-w-[16ch] md:max-w-none break-words leading-tight text-left">
    {currentPlace.name}
  </span>
  <ChevronDown
    className={`w-5 h-5 md:w-6 md:h-6 shrink-0 mt-[2px] transition-transform ${open ? "rotate-0" : ""}`}
  />
</button>

    {open && (
      <div
        className={`
          absolute mt-4 min-w-[220px] overflow-hidden
          rounded-[10px] border border-white/15
          bg-[#2f2f2f]/95 backdrop-blur-xl shadow-2xl z-50
          ${menuAlignClass}
        `}
        role="listbox"
        aria-label="Locations"
      >
        {places.map((item) => {
          const isActive = item.slug === currentPlace.slug;

          return (
            <button
              key={item.slug}
              type="button"
              onClick={() => handleSelect(item)}
              role="option"
              aria-selected={isActive}
              className={`
                w-full flex items-center justify-between
                px-5 py-4 text-left text-white text-base leading-none
                transition
                ${isActive ? "bg-white/10" : "hover:bg-white/5"}
              `}
            >
              <span>{item.name}</span>
            </button>
          );
        })}
      </div>
    )}
  </div>
);
}