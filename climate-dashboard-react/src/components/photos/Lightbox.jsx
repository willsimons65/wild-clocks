// src/components/photos/Lightbox.jsx

import React from "react";

export default function Lightbox({
  images,
  index,
  monthName,
  onClose,
  onPrev,
  onNext,
  onJump,
}) {
  // -----------------------------------
  // State (animation + interaction lock)
  // -----------------------------------
  const [anim, setAnim] = React.useState("idle");
  const [isAnimating, setIsAnimating] = React.useState(false);
  const stripRef = React.useRef(null);

  // The lightbox is considered "open"
  const isOpen = index !== null && images?.[index];
  const safeImage = isOpen ? images[index] : null;

  // -----------------------------------
  // Auto-center active thumbnail
  // -----------------------------------
  React.useEffect(() => {
    if (!isOpen) return;
    if (!stripRef.current) return;

    const activeThumb = stripRef.current.querySelector(
      `[data-thumb="${index}"]`
    );

    activeThumb?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [index, isOpen]);

  // -----------------------------------
  // Keyboard controls
  // -----------------------------------
  React.useEffect(() => {
    if (!isOpen) return;

    function handleKey(e) {
      if (isAnimating) return;

      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, isAnimating, index]);

  // -----------------------------------
  // Animation wrapper
  // -----------------------------------
  const animate = (type, callback) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setAnim(type);

    setTimeout(() => {
      callback();
      setAnim("fade");

      setTimeout(() => {
        setAnim("idle");
        setIsAnimating(false);
      }, 150);
    }, 150);
  };

  const doPrev = () => animate("slide-right", onPrev);
  const doNext = () => animate("slide-left", onNext);
  const doJump = (newIndex) => {
    if (newIndex === index) return;

    animate(
      newIndex > index ? "slide-left" : "slide-right",
      () => onJump(newIndex)
    );
  };

  // -----------------------------------
  // Animation class
  // -----------------------------------
  const animClass =
    anim === "fade"
      ? "opacity-0 scale-95"
      : anim === "slide-left"
      ? "-translate-x-16 opacity-0"
      : anim === "slide-right"
      ? "translate-x-16 opacity-0"
      : "opacity-100 scale-100 translate-x-0";

  // -----------------------------------
  // Render
  // -----------------------------------
  return (
    <>
      {!isOpen ? null : (
        <div
          role="dialog"
          aria-modal="true"
          className="
            fixed inset-0 z-50 
            bg-black/60 backdrop-blur-xl
            flex flex-col items-center justify-center p-8
          "
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* Title */}
          {monthName && (
          <div className="
              text-white 
              text-xl md:text-3xl   /* mobile → xl, desktop → 3xl */
              font-light 
              mb-4 
              tracking-wide
            "
          >
          {monthName}
          </div>
          )}

          <div
            className="relative flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button
            aria-label="Close"
            onClick={onClose}
            className="
                absolute 
                -top-10 md:-top-12   /* move closer on mobile */
                right-0 
                text-white 
                text-2.5xl md:text-3xl  /* smaller icon on mobile */
                hover:text-white/70 
                select-none
              "
            >
            ×
            </button>

            {/* MAIN IMAGE */}
            <div className="relative flex items-center justify-center w-full">

              <img
                key={safeImage}
                src={safeImage}
                alt=""
                className={`
                  w-[90vw]            /* ⭐ much larger image on mobile */
                  h-[90vw]            /* ⭐ keeps it square */
                  max-w-[600px]       /* desktop constraint */
                  max-h-[600px]       /* desktop constraint */
                  object-contain 
                  rounded-xl shadow-2xl
                  transition-all duration-300
                  ${animClass}
                `}
                onLoad={() => {
                  requestAnimationFrame(() => {
                    setAnim("idle");
                    setIsAnimating(false);
                  });
                }}
              />

              {/* Left arrow */}
              <button
                aria-label="Previous image"
                onClick={doPrev}
                disabled={isAnimating || index === 0}
                className="
                  absolute 
                  left-3 md:left-6          /* ⭐ reduced by 50% */
                  top-1/2 -translate-y-1/2
                  text-white text-4xl md:text-5xl  /* slightly smaller on mobile */
                  hover:text-white/70 
                  disabled:opacity-30
                "
              >
                ‹
              </button>

              {/* Right arrow */}
              <button
                aria-label="Next image"
                onClick={doNext}
                disabled={isAnimating || index === images.length - 1}
                className="
                  absolute 
                  right-3 md:right-6         /* ⭐ reduced by 50% */
                  top-1/2 -translate-y-1/2
                  text-white text-4xl md:text-5xl
                  hover:text-white/70
                  disabled:opacity-30
                "
              >
                ›
              </button>
            </div>

            {/* THUMBNAILS */}
            <div className="mt-10 flex justify-center w-full">
              <div className="max-w-[70vw] flex justify-center">
                <div
                  ref={stripRef}
                  className="
                    flex gap-3 overflow-x-auto
                    py-3 px-2 scrollbar-hide
                  "
                >
                  {images.map((src, i) => {
                    const valid = Boolean(src);
                    return (
                      <button
                        key={i}
                        data-thumb={i}
                        disabled={!valid}
                        onClick={() => valid && doJump(i)}
                        className={`
                          flex-shrink-0
                          w-20 h-20 rounded-lg overflow-hidden
                          border-2 transition
                          ${
                            i === index
                              ? "border-white shadow-lg"
                              : valid
                              ? "border-white/20 hover:border-white/40"
                              : "border-transparent opacity-20"
                          }
                        `}
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
        </div>
      )}
    </>
  );
}
