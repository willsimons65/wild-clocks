import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { PLACES, getPlaceBySlug } from "@/constants/places";

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

  const currentPlace = useMemo(
    () => getPlaceBySlug(place) || PLACES[0],
    [place]
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
    if (pathname === "/little-knepp" || pathname === "/appleton-woods") {
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
    <div className={`relative ${className}`} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-3 text-white font-semibold text-xl md:text-1xl"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Choose location"
      >
        <span className="truncate">{currentPlace.name}</span>
        <ChevronDown
          className={`w-6 h-6 transition-transform ${open ? "rotate-0" : ""}`}
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
          {PLACES.map((item) => {
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
                {/*<span className="ml-4 w-6 flex justify-center">
                  {isActive ? <Check className="w-5 h-5" /> : null}
                </span>*/}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}