// src/components/photos/viewer/PhotosView.jsx

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { MONTH_NAMES } from "@/constants/months";
import { resolvePhotoUrl } from "@/utils/resolvePhotoUrl";

function getLegacyMonthUrlOptions({ place, year, monthIndex, count = 4 }) {
  const monthLabel = MONTH_NAMES[monthIndex] || null;
  const cleanMonth = monthLabel ? monthLabel.toLowerCase() : null;

  if (!place || !Number.isFinite(year) || !cleanMonth) return [];

  return Array.from({ length: count }, (_, i) => {
    const index = i + 1;

    return [
      `/photos/${place}/${year}/${cleanMonth}/${index}.webp`,
      `/photos/${place}/${year}/${cleanMonth}/${index}.png`,
    ];
  });
}

export default function PhotosView({
  place,
  year,
  monthIndex,
  activeIndex,
  setActiveIndex,
  photos = [],
}) {

  const monthLabel = MONTH_NAMES[monthIndex] || "Month";

  // Load + validate the 4 slots
  const [urls, setUrls] = useState([null, null, null, null]);

useEffect(() => {
  const useManifestPhotos = Array.isArray(photos) && photos.length > 0;

  const candidates = useManifestPhotos
    ? Array.from({ length: 4 }, (_, i) => {
        const slot = i + 1;
        const photo = photos.find((p) => Number(p.slot) === slot);

        return photo?.url ? [resolvePhotoUrl(photo.url)] : [];
      })
    : getLegacyMonthUrlOptions({
        place,
        year,
        monthIndex,
        count: 4,
      });

  if (!candidates.length) {
    setUrls([null, null, null, null]);
    return;
  }

  let cancelled = false;

  function testImage(url) {
    return new Promise((resolve) => {
      if (!url) {
        resolve(null);
        return;
      }

      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => resolve(null);
      img.src = url;
    });
  }

  async function resolveSlot(urlOptions) {
    for (const url of urlOptions) {
      const result = await testImage(url);
      if (result) return result;
    }

    return null;
  }

  async function run() {
    const results = await Promise.all(
      candidates.map((urlOptions) => resolveSlot(urlOptions))
    );

    if (!cancelled) setUrls(results);
  }

  run();

  return () => {
    cancelled = true;
  };
}, [place, year, monthIndex, photos]);

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

    const [expanded, setExpanded] = useState(false);

      useEffect(() => {
      setExpanded(false);
    }, [place, year, monthIndex, activeIndex]);

    const isManifestViewer = Array.isArray(photos) && photos.length > 0;

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

  animate("slide-right", () => setActiveIndex(p));
}

function next() {
  if (safeIndex == null) return;
  const n = findNextIndex(safeIndex);
  if (n == null) return;

  animate("slide-left", () => setActiveIndex(n));
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

  // -----------------------------------
// Animation state (legacy lightbox feel)
// -----------------------------------
const [anim, setAnim] = useState("idle");
const [isAnimating, setIsAnimating] = useState(false);

function animate(type, callback) {
  if (isAnimating) return;

  setIsAnimating(true);

  // OUT phase: fast
  setAnim(type);

  setTimeout(() => {
    callback();

    // IN phase: slightly longer / softer
    setAnim("fade");

    setTimeout(() => {
      setAnim("idle");
      setIsAnimating(false);
    }, 220); // ✅ longer "in"
  }, 120); // ✅ faster "out"
}

const animClass =
  anim === "fade"
    ? "opacity-0 scale-[0.992]"
    : anim === "slide-left"
    ? "-translate-x-[14px] -translate-y-[1px] opacity-0"
    : anim === "slide-right"
    ? "translate-x-[14px] -translate-y-[1px] opacity-0"
    : "opacity-100 scale-100 translate-x-0 translate-y-0";

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
  <div
  className={[
    "w-full",
    isManifestViewer && expanded
      ? "max-w-[1200px]"
      : "max-w-[620px]",
  ].join(" ")}
    > 
    <div
      className={[
        "rounded-2xl overflow-hidden border border-white/10 relative",
        isManifestViewer
          ? expanded
            ? "bg-transparent border-transparent flex items-center justify-center"
            : "aspect-square bg-white/[0.04] flex items-center justify-center"
          : "bg-black/30",
      ].join(" ")}
    >

      {/* Foreground main image */}
      {currentSrc ? (
        <img
          src={currentSrc}
          alt=""
          draggable={false}
          onClick={() => {
            if (isManifestViewer) setExpanded(true);
          }}
          className={[
            "relative block object-contain",
            isManifestViewer
              ? expanded
                ? "w-full h-auto max-w-none rounded-none cursor-zoom-out"
                : "w-full h-auto rounded-none cursor-zoom-in"
              : "w-full h-auto",
            "will-change-transform will-change-opacity",
            "transition-[transform,opacity] ease-out",
            anim === "fade" ? "duration-170" : "duration-110",
            animClass,
          ].join(" ")}
        />
              ) : (
        <div className="aspect-square flex items-center justify-center text-white/50">
          Image not available
        </div>
      )}
      
      {expanded && isManifestViewer ? (
        <button
          type="button"
          aria-label="Close expanded image"
          onClick={() => setExpanded(false)}
          className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-black/45 border border-white/15 text-white/80 hover:text-white hover:bg-black/60 transition"
        >
          ×
        </button>

      ) : null}
    </div>

    {/* arrows */}
  {!expanded ? (
  <>
    <button
      aria-label="Previous image"
      onClick={prev}
      disabled={isAnimating || prevIndex == null}
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
      disabled={isAnimating || nextIndex == null}
      className="
        absolute right-3 md:right-6 top-1/2 -translate-y-1/2
        text-white text-4xl md:text-5xl
        hover:text-white/70 disabled:opacity-30 disabled:pointer-events-none
      "
    >
      ›
    </button>
  </>
) : null}


  </div>
</div>

      {/* Thumbnails */}
    {!expanded ? (
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
                  onClick={() => {
                    if (!valid) return;
                    if (i === safeIndex) return;

                    animate(i > safeIndex ? "slide-left" : "slide-right", () =>
                        setActiveIndex(i)
                    );
                    }}
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
                      className="w-full h-full object-contain bg-white/[0.04]"
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
      ) : null}
    </div>  
  );
}
