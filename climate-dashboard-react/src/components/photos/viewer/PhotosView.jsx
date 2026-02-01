// src/components/photos/viewer/PhotosView.jsx

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { MONTH_NAMES } from "@/constants/months";

function getLegacyMonthUrls({ base, place, year, monthIndex, count = 4 }) {
  const monthLabel = MONTH_NAMES[monthIndex] || null;
  const cleanMonth = monthLabel ? monthLabel.toLowerCase() : null;

  if (!base || !place || !Number.isFinite(year) || !cleanMonth) return [];

  return Array.from({ length: count }, (_, i) => {
    const index = i + 1;
    return `${base}/${place}/${year}/${cleanMonth}/${index}.png`;
  });
}

export default function PhotosView({
  place,
  year,
  monthIndex,
  activeIndex,
  setActiveIndex,
}) {
  const base = import.meta.env.VITE_R2_PUBLIC_BASE_URL;
  const monthLabel = MONTH_NAMES[monthIndex] || "Month";

  // Load + validate the 4 slots
  const [urls, setUrls] = useState([null, null, null, null]);

  useEffect(() => {
    const candidates = getLegacyMonthUrls({
      base,
      place,
      year,
      monthIndex,
      count: 4,
    });

    if (!candidates.length) return;

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
  }, [base, place, year, monthIndex]);

  // Safety: if activeIndex points to empty, shift to first available
  useEffect(() => {
    if (activeIndex == null) return;

    const src = urls[activeIndex];
    if (src) return;

    const firstValid = urls.findIndex(Boolean);
    if (firstValid >= 0) setActiveIndex(firstValid);
  }, [activeIndex, urls, setActiveIndex]);

  const safeIndex = useMemo(() => {
    if (activeIndex == null) return null;
    return Math.max(0, Math.min(3, activeIndex));
  }, [activeIndex]);

  const currentSrc = safeIndex != null ? urls[safeIndex] : null;

  // ------------------------------------------------------------
  // Correct prev/next based on actual valid photos
  // ------------------------------------------------------------
  const findPrevIndex = useCallback(
    (i) => {
      for (let j = i - 1; j >= 0; j--) if (urls[j]) return j;
      return null;
    },
    [urls]
  );

  const findNextIndex = useCallback(
    (i) => {
      for (let j = i + 1; j < urls.length; j++) if (urls[j]) return j;
      return null;
    },
    [urls]
  );

  const prevIndex = safeIndex != null ? findPrevIndex(safeIndex) : null;
  const nextIndex = safeIndex != null ? findNextIndex(safeIndex) : null;

  function prev() {
    if (safeIndex == null) return;
    const p = findPrevIndex(safeIndex);
    if (p == null) return;
    setActiveIndex(p);
  }

  function next() {
    if (safeIndex == null) return;
    const n = findNextIndex(safeIndex);
    if (n == null) return;
    setActiveIndex(n);
  }

  // Keyboard controls
  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeIndex, urls]);

  const stripRef = useRef(null);

  // keep active thumb in view
  useEffect(() => {
    if (safeIndex == null) return;
    if (!stripRef.current) return;

    const el = stripRef.current.querySelector(`[data-thumb="${safeIndex}"]`);
    el?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [safeIndex]);

  if (safeIndex == null) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
        No photo selected.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title
      <div className="text-center">
        <div className="text-white text-xl md:text-3xl font-light tracking-wide">
          {monthLabel}
        </div>
      </div> */}

      {/* Main image */}
      <div className="relative flex items-center justify-center">
        <div className="w-full max-w-[620px]">
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/30">
            {currentSrc ? (
              <img
                src={currentSrc}
                alt=""
                className="block w-full h-auto object-contain"
                draggable={false}
              />
            ) : (
              <div className="aspect-square flex items-center justify-center text-white/50">
                Image not available
              </div>
            )}
          </div>

          {/* arrows */}
          <button
            aria-label="Previous image"
            onClick={prev}
            disabled={prevIndex == null}
            className="
              absolute left-3 md:left-6 top-1/2 -translate-y-1/2
              text-white text-4xl md:text-5xl
              hover:text-white/70 disabled:opacity-30
            "
          >
            ‹
          </button>

          <button
            aria-label="Next image"
            onClick={next}
            disabled={nextIndex == null}
            className="
              absolute right-3 md:right-6 top-1/2 -translate-y-1/2
              text-white text-4xl md:text-5xl
              hover:text-white/70 disabled:opacity-30
            "
          >
            ›
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex justify-center w-full">
        <div className="max-w-[70vw] flex justify-center">
          <div
            ref={stripRef}
            className="flex gap-3 overflow-x-auto py-3 px-2 scrollbar-hide"
          >
            {urls.map((src, i) => {
              const valid = Boolean(src);
              return (
                <button
                  key={i}
                  data-thumb={i}
                  disabled={!valid}
                  onClick={() => valid && setActiveIndex(i)}
                  className={[
                    "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition",
                    i === safeIndex
                      ? "border-white shadow-lg"
                      : valid
                      ? "border-white/20 hover:border-white/40"
                      : "border-transparent opacity-20 cursor-not-allowed",
                  ].join(" ")}
                >
                  {valid ? (
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/10" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
