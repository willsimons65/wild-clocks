// src/components/photos/PhotoGrid.jsx

import React, { useEffect, useState, useCallback } from "react";
import Lightbox from "./Lightbox";
import { MONTH_NAMES } from "@/constants/months";

export default function PhotoGrid({ year, place, month }) {
  const base = import.meta.env.VITE_R2_PUBLIC_BASE_URL;

  const monthNameRaw = MONTH_NAMES[month - 1] || null;
  const monthName = monthNameRaw ? monthNameRaw.toLowerCase() : null;

  // Holds the 4 image URLs (or null)
  const [urls, setUrls] = useState([null, null, null, null]);

  // Swipe state
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [touchStartX, setTouchStartX] = useState(null);

  // ------------------------------------------------------------
  //  Load & validate images for the month
  // ------------------------------------------------------------
  useEffect(() => {
    if (!monthName || !place || !year || !base) return;

    const candidates = Array.from({ length: 4 }, (_, i) => {
      return `${base}/${place}/${year}/${monthName}/${i + 1}.png`;
    });

    const checkImages = async () => {
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

      setUrls(results);
    };

    checkImages();
  }, [monthName, place, year, base]);

  // ------------------------------------------------------------
  //  Swipe gesture handlers (for Lightbox)
  // ------------------------------------------------------------

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    // prevent scroll interference
    e.preventDefault();
  };

  const handleTouchEnd = useCallback(
    (e) => {
      if (touchStartX === null) return;

      const endX = e.changedTouches[0].clientX;
      const diff = endX - touchStartX;

      const SWIPE_THRESHOLD = 50;

      if (Math.abs(diff) > SWIPE_THRESHOLD) {
        if (diff > 0) {
          // → swipe right: go to previous image
          setLightboxIndex((i) => (i > 0 ? i - 1 : i));
        } else {
          // → swipe left: go to next image
          setLightboxIndex((i) =>
            i < urls.length - 1 ? i + 1 : i
          );
        }
      }

      setTouchStartX(null);
    },
    [touchStartX, urls.length]
  );

  // ------------------------------------------------------------
  //  Render
  // ------------------------------------------------------------

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
          onClick={() => src && setLightboxIndex(i)}
        />
      ))}

      {/* LIGHTBOX WITH SWIPE HANDLERS */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Lightbox
          images={urls}
          index={lightboxIndex}
          monthName={monthNameRaw}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => Math.max(0, i - 1))}
          onNext={() =>
            setLightboxIndex((i) => Math.min(urls.length - 1, i + 1))
          }
          onJump={(newIndex) => setLightboxIndex(newIndex)}
        />
      </div>
    </div>
  );
}

// ------------------------------------------------------------
//  Photo Cell Component
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



