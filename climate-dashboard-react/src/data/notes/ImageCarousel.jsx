// src/data/notes/ImageCarousel.jsx

import React, { useEffect, useMemo, useState } from "react";

export default function ImageCarousel({
  images = [],
  className = "",
  aspect = "landscape", // "landscape" | "portrait" | "square"
}) {
  const safeImages = useMemo(
    () => (Array.isArray(images) ? images.filter(Boolean) : []),
    [images]
  );

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index > safeImages.length - 1) {
      setIndex(0);
    }
  }, [index, safeImages.length]);

  if (safeImages.length === 0) return null;

  const current = safeImages[index];

  const aspectClass =
    aspect === "portrait"
      ? "aspect-[4/5]"
      : aspect === "square"
        ? "aspect-square"
        : "aspect-[4/3]";

  function goToPrevious() {
    setIndex((currentIndex) =>
      currentIndex === 0 ? safeImages.length - 1 : currentIndex - 1
    );
  }

  function goToNext() {
    setIndex((currentIndex) =>
      currentIndex === safeImages.length - 1 ? 0 : currentIndex + 1
    );
  }

  return (
    <figure
      className={`
        border border-white/10 bg-[#1E1E1E]
        px-4 py-6 md:px-8 md:py-8
        ${className}
      `}
    >
      <div className="relative mx-auto w-full max-w-[760px]">
        <div className={`${aspectClass} overflow-hidden bg-black/20`}>
          <img
            src={current.src}
            alt={current.alt || ""}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous image"
              className="
                absolute left-3 top-1/2 -translate-y-1/2
                flex h-9 w-9 items-center justify-center
                rounded-full bg-black/35 text-white/80
                hover:bg-black/55 hover:text-white
                transition-colors
              "
            >
              ‹
            </button>

            <button
              type="button"
              onClick={goToNext}
              aria-label="Next image"
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                flex h-9 w-9 items-center justify-center
                rounded-full bg-black/35 text-white/80
                hover:bg-black/55 hover:text-white
                transition-colors
              "
            >
              ›
            </button>
          </>
        )}
      </div>

      {safeImages.length > 1 && (
        <div className="mt-5 flex justify-center gap-3">
          {safeImages.map((image, dotIndex) => {
            const isActive = dotIndex === index;

            return (
              <button
                key={image.id || image.src || dotIndex}
                type="button"
                onClick={() => setIndex(dotIndex)}
                aria-label={`Show image ${dotIndex + 1}`}
                aria-current={isActive ? "true" : undefined}
                className={`
                  h-2.5 w-2.5 rounded-full transition
                  ${isActive ? "bg-white" : "bg-white/35 hover:bg-white/60"}
                `}
              />
            );
          })}
        </div>
      )}

      {current.caption && (
        <figcaption className="mt-4 text-center text-sm text-white/55">
          {current.caption}
        </figcaption>
      )}
    </figure>
  );
}