// src/components/notes/SequenceSlider.jsx

import React, { useEffect, useMemo, useRef, useState } from "react";

function formatLongDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default function SequenceSlider({
  title,
  entries = [],
  className = "",
  aspect = "portrait", // "portrait" | "landscape" | "square"
  showProgressNote = true,
  progressNote = "This sequence is still in progress and updates daily.",
}) {
const safeEntries = Array.isArray(entries) ? entries : [];
const [index, setIndex] = useState(Math.max(0, safeEntries.length - 1));
const [displayedIndex, setDisplayedIndex] = useState(Math.max(0, safeEntries.length - 1));
const preloadCacheRef = useRef(new Map());

const current = safeEntries[displayedIndex] || null;
const total = safeEntries.length;

const progressPercent = useMemo(() => {
  if (total <= 1) return 0;
  return (index / (total - 1)) * 100;
}, [index, total]);

useEffect(() => {
  if (!total || !safeEntries[index]) return;

  const preloadTargets = [
    safeEntries[index - 2]?.image,
    safeEntries[index - 1]?.image,
    safeEntries[index + 1]?.image,
    safeEntries[index + 2]?.image,
  ].filter(Boolean);

  preloadTargets.forEach((src) => {
    if (preloadCacheRef.current.has(src)) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      preloadCacheRef.current.set(src, true);
    };
  });
}, [index, safeEntries, total]);

useEffect(() => {
  if (!safeEntries[index]?.image) return;

  const targetSrc = safeEntries[index].image;

  if (preloadCacheRef.current.has(targetSrc)) {
    setDisplayedIndex(index);
    return;
  }

  const img = new Image();
  img.src = targetSrc;

  img.onload = () => {
    preloadCacheRef.current.set(targetSrc, true);
    setDisplayedIndex(index);
  };
}, [index, safeEntries]);

useEffect(() => {
  const lastIndex = Math.max(0, safeEntries.length - 1);
  setIndex(lastIndex);
  setDisplayedIndex(lastIndex);
}, [safeEntries.length]);

function handleSliderChange(e) {
  const nextIndex = Number(e.target.value);
  setIndex(nextIndex);
}

  function handleKeyDown(e) {
    if (!total) return;

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setIndex((prev) => Math.max(0, prev - 1));
    }

    if (e.key === "ArrowRight") {
      e.preventDefault();
      setIndex((prev) => Math.min(total - 1, prev + 1));
    }

    if (e.key === "Home") {
      e.preventDefault();
      setIndex(0);
    }

    if (e.key === "End") {
      e.preventDefault();
      setIndex(total - 1);
    }
  }

  const aspectClass =
    aspect === "square"
      ? "aspect-square"
      : aspect === "landscape"
      ? "aspect-[4/3]"
      : "aspect-[3/4]";

  if (!current) {
    return (
      <section
        className={`border border-white/10 bg-[#1E1E1E] px-5 py-8 sm:px-8 sm:py-10 ${className}`}
      >
        {title ? (
          <h2 className="mb-4 text-center text-[22px] font-light tracking-[0.01em] text-white">
            {title}
          </h2>
        ) : null}

        <div className="text-center text-sm text-white/60">
          No sequence images available yet.
        </div>
      </section>
    );
  }

  return (
    <section
      className={`border border-white/10 bg-[#1E1E1E] px-5 py-5 sm:px-8 sm:py-7 ${className}`}
    >
      {title ? (
        <h2 className="mb-5 text-center text-[22px] font-light tracking-[0.01em] text-white">
          {title}
        </h2>
      ) : null}

      <div className="mb-4 flex items-center justify-center gap-6 text-center text-[15px] sm:text-base">
        <div className="text-[#E77DB6]">
          <span className="text-[#E77DB6]/70">Max temp:</span>{" "}
          <span className="font-medium">{current.maxTemp}°C</span>
        </div>
        <div className="text-[#9FCCFF]">
          <span className="text-[#9FCCFF]/70">Min temp:</span>{" "}
          <span className="font-medium">{current.minTemp}°C</span>
        </div>
      </div>

      <div className="mx-auto max-w-[390px] sm:max-w-[420px]">
        <div className={`relative overflow-hidden bg-black/10 ${aspectClass}`}>
        <img
            key={current.image}
            src={current.image}
            alt={current.alt || current.caption || current.date}
            className="h-full w-full object-cover select-none animate-sequence-fade"
            draggable={false}
        />
        </div>
      </div>

      <div className="mx-auto mt-7 w-full max-w-[600px]">
<div className="relative">
  {/* thin persistent line */}
  <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-[1px] -translate-y-1/2 bg-white/30" />

  {/* thicker progress line */}
  <div
    className="pointer-events-none absolute left-0 top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-white/55"
    style={{ width: `${progressPercent}%` }}
  />

  <input
    type="range"
    min={0}
    max={Math.max(total - 1, 0)}
    step={1}
    value={index}
    onChange={handleSliderChange}
    onKeyDown={handleKeyDown}
    aria-label="Sequence timeline"
    className="sequence-slider relative z-10 h-10 w-full cursor-pointer bg-transparent"
  />
</div>

        <div className="mt-3 text-center text-[15px] sm:text-[16px] text-white/88">
          {formatLongDate(current.date)}
        </div>

        {showProgressNote && total < 30 ? (
          <div className="mt-2 text-center text-xs italic text-white/45">
            {progressNote}
          </div>
        ) : null}
      </div>

      {current.caption ? (
        <div className="mx-auto mt-5 max-w-[650px] text-center text-sm leading-6 text-white/68">
          {current.caption}
        </div>
      ) : null}
    </section>
  );
}