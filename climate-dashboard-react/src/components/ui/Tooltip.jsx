// src/components/ui/Tooltip.jsx

import React, { useRef, useEffect, useState } from "react";

export default function Tooltip({ x, y, children, svgRef }) {
  if (x == null || y == null) return null;

  const ref = useRef(null);
  const [offsetLeft, setOffsetLeft] = useState(40);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ref.current || !svgRef?.current) return;

    const tipRect = ref.current.getBoundingClientRect();
    const svgRect = svgRef.current.getBoundingClientRect();

    const BASE_OFFSET = 40;
    const FLIP_GAP = 8;

    const rightEdge = x + BASE_OFFSET + tipRect.width;
    const shouldFlip = rightEdge > svgRect.right - svgRect.left;

    setOffsetLeft(shouldFlip ? -(tipRect.width + FLIP_GAP) : BASE_OFFSET);
    setReady(true);
  }, [x, y, children, svgRef]);

  if (!ready) {
    return (
      <div
        ref={ref}
        style={{
          position: "absolute",
          opacity: 0,
          left: -9999,
          top: -9999,
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="absolute pointer-events-none z-[9999]"
      style={{
        left: x + offsetLeft,
        top: y - 90,
        background: "rgba(30,30,30,0.9)",
        border: "2px solid rgba(255,255,255,0.15)",
        borderRadius: 12,
        padding: "10px 12px",
        backdropFilter: "blur(6px)",
        transition: "left 0.18s ease-out, top 0.18s ease-out",
      }}
    >
      {children}
    </div>
  );
}





















