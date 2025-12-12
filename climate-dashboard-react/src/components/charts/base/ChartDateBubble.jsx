// src/components/charts/base/ChartDateBubble.jsx

import React from "react";

export default function ChartDateBubble({ x, y, label, position = "above" }) {
  if (x == null || y == null || label == null) return null;

  const size = 26;
  const OFFSET = 10; // better flip distance

const bubbleTop =
  position === "above"
    ? y - size - OFFSET    // above highest circle
    : y + OFFSET;           // below lowest circle

  return (
    <div
      className="
        absolute flex items-center justify-center
        rounded-full border border-white/25
        bg-black/10 backdrop-blur-md
        text-white text-[11px] font-semibold
        shadow-md
        pointer-events-none select-none
      "
      style={{
        width: size,
        height: size,
        left: x - size / 2,
        top: bubbleTop,
        zIndex: 40,
      }}
    >
      {label}
    </div>
  );
}


