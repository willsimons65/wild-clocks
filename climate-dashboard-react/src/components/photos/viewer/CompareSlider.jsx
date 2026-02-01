// src/components/photos/viewer/CompareSlider.jsx

import { useEffect, useMemo, useRef, useState } from "react";

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

/**
 * Soft "sticky edge" clamp.
 * Inside bounds: returns idealPct.
 * Outside bounds: continues to move, but with heavy damping so it feels resisted.
 */
function softEdgeStick(idealPct, minPct, maxPct, softness = 12) {
  if (idealPct < minPct) {
    const d = minPct - idealPct;
    return minPct - d / (1 + d / softness);
  }

  if (idealPct > maxPct) {
    const d = idealPct - maxPct;
    return maxPct + d / (1 + d / softness);
  }

  return idealPct;
}

export default function CompareSlider({
  leftPhoto,
  rightPhoto,
  leftYear,
  rightYear,
  monthLabel,
  slotIndex,

  split,
  setSplit,

  enabled = true,
}) {
  const wrapRef = useRef(null);
  const draggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const hasBoth = !!leftPhoto && !!rightPhoto;
  const isEnabled = enabled && hasBoth;

  const ariaLabel = useMemo(() => {
    return `Photo compare slider for ${monthLabel || "month"} slot ${
      (slotIndex ?? 0) + 1
    }`;
  }, [monthLabel, slotIndex]);

  function getSplitFromClientX(clientX) {
    const el = wrapRef.current;
    if (!el) return split;

    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    return clamp01(x / rect.width);
  }

  function handlePointerDown(e) {
    if (!isEnabled) return;

    draggingRef.current = true;
    setIsDragging(true);

    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }

    setSplit(getSplitFromClientX(e.clientX));
  }

  function handlePointerMove(e) {
    if (!isEnabled) return;
    if (!draggingRef.current) return;

    setSplit(getSplitFromClientX(e.clientX));
  }

  function handlePointerUp(e) {
    if (!isEnabled) return;

    draggingRef.current = false;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
  }

  // Safety: release pointer even if outside element
  useEffect(() => {
    function endDrag() {
      draggingRef.current = false;
      setIsDragging(false);
    }

    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    return () => {
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, []);

  const splitPct = `${Math.round(split * 100)}%`;

  // ------------------------------------------------------------
  // Label behaviour: split-aware, sticky edge, then fade-out
  // ------------------------------------------------------------
  const EDGE_STOP_PCT = 7; // label stops near this margin (12% / 88%)
  const EDGE_FADE_PCT = 1.5; // quickly fades once pushing past the stop
  const MIN_PCT = EDGE_STOP_PCT;
  const MAX_PCT = 100 - EDGE_STOP_PCT;

  // Ideal label centres (0..100)
  const leftIdealPct = (split * 100) / 2;
  const rightIdealPct = ((1 + split) * 100) / 2;

  // Sticky (soft resisted) centres
  const leftLabelPct = softEdgeStick(leftIdealPct, MIN_PCT, MAX_PCT, 12);
  const rightLabelPct = softEdgeStick(rightIdealPct, MIN_PCT, MAX_PCT, 12);

  // Opacity: full until stop, then fade quickly if dragging beyond bounds
  function stoppedFadeOpacity(idealPct) {
    let over = 0;
    if (idealPct < MIN_PCT) over = MIN_PCT - idealPct;
    else if (idealPct > MAX_PCT) over = idealPct - MAX_PCT;

    return clamp(1 - over / EDGE_FADE_PCT, 0, 1);
  }

  const leftLabelOpacity = stoppedFadeOpacity(leftIdealPct);
  const rightLabelOpacity = stoppedFadeOpacity(rightIdealPct);

  // ------------------------------------------------------------
  // Render
  // ------------------------------------------------------------
  return (
    <div className="space-y-3">
      {/* Slider frame */}
      <div
        ref={wrapRef}
        className={[
          "relative rounded-2xl border border-white/10 bg-black/30 overflow-hidden",
          "mx-auto w-full md:max-w-[600px]", // desktop ~50% shrink
          isEnabled ? "select-none" : "",
        ].join(" ")}
      >
        {/* Split-aware year labels */}
        {hasBoth ? (
          <div className="absolute top-3 left-0 right-0 z-20 pointer-events-none">
            {/* Left label */}
            <div
              className="absolute -translate-x-1/2 transition-all duration-150 ease-out"
              style={{
                left: `${leftLabelPct}%`,
                opacity: leftLabelOpacity,
              }}
            >
              <div className="px-3 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-xs font-medium text-white/80">
                {leftYear}
              </div>
            </div>

            {/* Right label */}
            <div
              className="absolute -translate-x-1/2 transition-all duration-150 ease-out"
              style={{
                left: `${rightLabelPct}%`,
                opacity: rightLabelOpacity,
              }}
            >
              <div className="px-3 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md text-xs font-medium text-white/80">
                {rightYear}
              </div>
            </div>
          </div>
        ) : null}

        {/* Base (right) image */}
        <img
          src={rightPhoto?.url || ""}
          alt={`${monthLabel} slot ${(slotIndex ?? 0) + 1} ${rightYear}`}
          className={[
            "block w-full h-auto object-contain",
            !rightPhoto ? "hidden" : "",
          ].join(" ")}
          draggable={false}
        />

        {/* Overlay (left) image clipped to split */}
        {leftPhoto ? (
          <div
            className="absolute inset-0"
            style={{
              clipPath: `inset(0 ${100 - split * 100}% 0 0)`,
            }}
          >
            <img
              src={leftPhoto.url}
              alt={`${monthLabel} slot ${(slotIndex ?? 0) + 1} ${leftYear}`}
              className="block w-full h-auto object-contain"
              draggable={false}
            />
          </div>
        ) : null}

        {/* subtle vignette for readability */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/15 via-transparent to-black/25" />

        {/* Empty state guard (should not happen if parent is correct, but safe) */}
        {!hasBoth ? (
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <div className="text-white/60 text-sm">
              Slider is unavailable until both photos exist.
            </div>
          </div>
        ) : null}

        {/* Interactive layer */}
        <div
          role="slider"
          aria-label={ariaLabel}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(split * 100)}
          tabIndex={isEnabled ? 0 : -1}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={[
            "absolute inset-0 touch-none", // ✅ key mobile fix
            isEnabled ? "cursor-ew-resize" : "cursor-not-allowed",
          ].join(" ")}
          onKeyDown={(e) => {
            if (!isEnabled) return;
            if (e.key === "ArrowLeft") setSplit(clamp01(split - 0.02));
            if (e.key === "ArrowRight") setSplit(clamp01(split + 0.02));
            if (e.key === "Home") setSplit(0);
            if (e.key === "End") setSplit(1);
          }}
        />

        {/* Divider line */}
        {hasBoth ? (
          <div
            className="absolute top-0 bottom-0 w-px bg-white/40"
            style={{ left: `calc(${split * 100}% - 0.5px)` }}
          />
        ) : null}

        {/* Handle */}
        {hasBoth ? (
          <div
            className="absolute top-0 bottom-0 flex items-center"
            style={{ left: `calc(${split * 100}% - 18px)` }}
          >
            <div
              className={[
                "w-9 h-9 rounded-full",
                "border border-white/20",
                "bg-white/10 backdrop-blur-md",
                "shadow-[0_8px_24px_rgba(0,0,0,0.35)]",
                "flex items-center justify-center",
                "transition-transform",
                isDragging ? "scale-105" : "scale-100",
                isEnabled ? "" : "opacity-60",
              ].join(" ")}
              title={isEnabled ? "Drag to compare" : "Disabled"}
            >
              <div className="text-white/80 text-sm leading-none">↔</div>
            </div>
          </div>
        ) : null}

        {/* Percentage hint (optional but helpful for dev) */}
        {hasBoth ? (
          <div className="absolute left-3 bottom-3 text-xs text-white/50">
            {splitPct}
          </div>
        ) : null}
      </div>
    </div>
  );
}
