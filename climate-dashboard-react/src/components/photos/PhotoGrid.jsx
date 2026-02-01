// src/components/photos/PhotoGrid.jsx

import React, { useEffect, useState } from "react";
import { MONTH_NAMES } from "@/constants/months";

export default function PhotoGrid({ year, place, month, onPhotoClick }) {
  const base = import.meta.env.VITE_R2_PUBLIC_BASE_URL;

  const monthNameRaw = MONTH_NAMES[month - 1] || null;
  const monthName = monthNameRaw ? monthNameRaw.toLowerCase() : null;

  // Holds the 4 image URLs (or null)
  const [urls, setUrls] = useState([null, null, null, null]);

  // ------------------------------------------------------------
  // Load & validate images for the month
  // ------------------------------------------------------------
useEffect(() => {
  if (!monthName) {
    console.warn("PhotoGrid: invalid month prop:", month);
  }
  if (!monthName || !place || !year || !base) return;

  const candidates = Array.from({ length: 4 }, (_, i) => {
    return `${base}/${place}/${year}/${monthName}/${i + 1}.png`;
  });

  let cancelled = false;

  async function run() {
    const results = await Promise.all(
      candidates.map(
        (url) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(url);
            img.onerror = () => resolve(null);
            img.src = url;
          })
      )
    );

    if (cancelled) return;
    setUrls(results);
  }

  run();

  return () => {
    cancelled = true;
  };
}, [monthName, place, year, base, month]);

  const cornerClasses = [
    "rounded-tl-2xl",
    "rounded-tr-2xl",
    "rounded-bl-2xl",
    "rounded-br-2xl",
  ];

  return (
    <div className="w-full grid grid-cols-2 grid-rows-2 gap-[5px]">
      {urls.map((src, i) => (
        <PhotoCell
          key={i}
          src={src}
          rounded={cornerClasses[i]}
          onClick={() => {
            if (!src) return;
            onPhotoClick?.(i);
          }}
        />
      ))}
    </div>
  );
}

// ------------------------------------------------------------
// Photo Cell Component
// ------------------------------------------------------------
function PhotoCell({ src, rounded, onClick }) {
  const showPlaceholder = !src;

  return (
    <div
      className={`aspect-square overflow-hidden ${rounded} ${
        !showPlaceholder ? "cursor-pointer" : ""
      }`}
      onClick={!showPlaceholder ? onClick : undefined}
    >
      {!showPlaceholder ? (
        <img src={src} alt="" className="w-full h-full object-cover" />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center
          bg-[#1A1A1A] border border-white/15 rounded-[inherit] select-none"
        >
          <div className="text-white/40 text-[0.75rem] tracking-wide">
            Image not available
          </div>
        </div>
      )}
    </div>
  );
}




