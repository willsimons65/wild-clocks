import React from "react";

export default function WaterBalanceSeasonBand({
  xScale,
  chartHeight,
  startMonth = 2, // Feb
  endMonth = 8,   // Aug
}) {
  if (!xScale || !chartHeight) return null;

  const startX = xScale(startMonth - 0.5);
  const endX = xScale(endMonth + 0.5);
  const width = endX - startX;

  if (!Number.isFinite(startX) || !Number.isFinite(endX) || width <= 0) {
    return null;
  }

  return (
    <rect
      x={startX}
      y={0}
      width={width}
      height={chartHeight}
      fill="rgba(240,136,62,0.05)"
      rx="10"
      ry="10"
      pointerEvents="none"
    />
  );
}