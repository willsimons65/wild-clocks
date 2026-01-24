// src/components/ui/tooltip/InfoTooltip.jsx

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

export default function InfoTooltip({
  content,
  align = "right",
  maxWidth = "280px",
  hideIcon = false,
  children,
}) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState(null);

  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);

  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  // Positioning
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();

    setPosition({
      top: rect.bottom + 8,
      left:
        align === "right"
          ? rect.right - parseInt(maxWidth, 10)
          : rect.left,
    });
  }, [open, align, maxWidth]);

  // Outside click
  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e) {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // ESC key
  useEffect(() => {
    if (!open) return;

    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  // Fade timing
  useEffect(() => {
    if (open) {
      setVisible(true);
      return;
    }

    const t = setTimeout(() => setVisible(false), 160);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <>
      {!hideIcon ? (
        <button
          ref={triggerRef}
          type="button"
          aria-label="More information"
          className="w-5 h-5 flex items-center justify-center
                     rounded-full border border-white/20
                     text-xs italic opacity-60 hover:opacity-100 transition"
          onMouseEnter={() => !isTouch && setOpen(true)}
          onMouseLeave={() => !isTouch && setOpen(false)}
          onClick={() => isTouch && setOpen(v => !v)}
        >
          i
        </button>
      ) : (
        <div
          ref={triggerRef}
          onMouseEnter={() => !isTouch && setOpen(true)}
          onMouseLeave={() => !isTouch && setOpen(false)}
          onClick={() => isTouch && setOpen(v => !v)}
        >
          {children}
        </div>
      )}

      {visible &&
        position &&
        createPortal(
          <div
            ref={tooltipRef}
            className={`
              fixed z-[9999]
              rounded-xl
              bg-[#161616]
              border border-white/15
              shadow-2xl
              px-4 py-3
              text-xs leading-relaxed
              text-white/80
              transition-all
              duration-150
              ease-out
              ${open
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-1"}
            `}
            style={{
              top: position.top,
              left: position.left,
              width: maxWidth,
            }}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
}

