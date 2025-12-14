// src/components/charts/base/ChartContainer.jsx

import React, { useState, useRef, useEffect } from "react";

import {
  PADDING_LEFT,
  PADDING_TOP,
  CHART_HEIGHT,
} from "@/constants/chartLayout";

import { makeXScale, makeXTicks } from "@/utils/xAxis";
import { computeBubblePosition } from "@/utils/tooltipPosition";

const BOTTOM_PADDING = 32;

export default function ChartContainer({
  children,
  data,
  year,
  monthIndex,
  yScale,
  yTicks,
  TooltipComponent,
  metricHeader = null,
  rightPadding = 48,
  interactive = false,
}) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  // ---------------------------
  // Responsive width
  // ---------------------------
  const [containerWidth, setContainerWidth] = useState(300);

  useEffect(() => {
    if (!containerRef.current) return;

    const obs = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });

    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const chartWidth = Math.max(
    180,
    containerWidth - PADDING_LEFT - rightPadding
  );

  const totalWidth = chartWidth + PADDING_LEFT + rightPadding;

  // ---------------------------
  // X-axis
  // ---------------------------
  const lastDay = new Date(year, monthIndex, 0).getDate();
  const xScale = makeXScale(lastDay, chartWidth);
  const xTicks = makeXTicks(lastDay);

  // ---------------------------
  // Hover state
  // ---------------------------
  const [hoverIndex, setHoverIndex] = useState(null);
  const [hoverX, setHoverX] = useState(null);

  // ---------------------------
  // Pointer → index mapping
  // ---------------------------
  const updateFromClientX = (clientX) => {
    const box = containerRef.current.getBoundingClientRect();
    const mx = clientX - box.left - PADDING_LEFT;

    if (mx < 0 || mx > chartWidth) {
      setHoverIndex(null);
      return;
    }

    const index = Math.round((mx / chartWidth) * (data.length - 1));
    const d = data[index];
    if (!d) return;

    setHoverIndex(index);
    setHoverX(xScale(d.day));
  };

  // ---------------------------
  // Mouse handlers
  // ---------------------------
  const handleMove = (e) => {
    if (!interactive) return;
    updateFromClientX(e.clientX);
  };

  const handleLeave = () => {
    setHoverIndex(null);
  };

  // ---------------------------
  // Touch handlers (iOS + Android)
  // ---------------------------
  const handleTouchStart = (e) => {
    if (!interactive || !e.touches.length) return;
    updateFromClientX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!interactive || !e.touches.length) return;
    e.preventDefault(); // stop scroll
    updateFromClientX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setHoverIndex(null);
  };

  // ---------------------------
  // Cursor X position
  // ---------------------------
  const cursorX =
    hoverIndex !== null &&
    hoverIndex >= 0 &&
    hoverIndex < data.length
      ? xScale(data[hoverIndex].day)
      : null;

  // ---------------------------
  // Tooltip Y position logic
  // ---------------------------
  let yValues = [];
  let isRainfall = false;

  if (hoverIndex !== null && data[hoverIndex]) {
    const d = data[hoverIndex];

    if (d.max !== undefined && d.min !== undefined) {
      yValues = [d.max, d.min]; // temperature
    } else if (d.humidity !== undefined) {
      yValues = [d.humidity];
    } else if (d.hours !== undefined) {
      yValues = [d.hours];
    } else if (d.rainfall !== undefined) {
      isRainfall = true;
      yValues = [d.rainfall];
    } else if (d.y !== undefined) {
      yValues = [d.y];
    }
  }

  const yPixels = yValues.map((v) => yScale(v) + PADDING_TOP);
  const topY = yPixels.length ? Math.min(...yPixels) : null;
  const bottomY = yPixels.length ? Math.max(...yPixels) : null;

  const bubblePosition = computeBubblePosition(
    topY,
    CHART_HEIGHT,
    PADDING_TOP
  );

  let finalBubbleY = null;
  if (topY !== null && bottomY !== null) {
    let OFFSET_ABOVE = 5;
    let OFFSET_BELOW = isRainfall ? 40 : 50;

    finalBubbleY =
      bubblePosition === "above"
        ? topY - OFFSET_ABOVE
        : bottomY + OFFSET_BELOW;
  }

  // ---------------------------
  // Clone child chart layers
  // ---------------------------
  const enhanced = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    return React.cloneElement(child, {
      xScale,
      xTicks,
      chartWidth,
      yScale,
      yTicks,
      hoverIndex,
    });
  });

  return (
    <div
      ref={containerRef}
      className="
        relative w-full
        rounded-2xl
        border border-white/20
        bg-[#1E1E1E]
        pt-5
      "
      style={{ touchAction: "none", WebkitUserSelect: "none" }}
    >
      {/* Metric header (max/min labels) */}
      {metricHeader && hoverIndex !== null && (
        <div className="absolute top-2.5 left-0 right-0 flex justify-center z-10 pointer-events-none">
          {metricHeader({ index: hoverIndex })}
        </div>
      )}

      <svg
        ref={svgRef}
        width={totalWidth}
        height={CHART_HEIGHT + PADDING_TOP + BOTTOM_PADDING}
        style={{ touchAction: "none" }}
        pointerEvents="auto"
        onMouseMove={interactive ? handleMove : undefined}
        onMouseLeave={interactive ? handleLeave : undefined}
        onTouchStart={interactive ? handleTouchStart : undefined}
        onTouchMove={interactive ? handleTouchMove : undefined}
        onTouchEnd={interactive ? handleTouchEnd : undefined}
      >
        {/* Chart content */}
        <g transform={`translate(${PADDING_LEFT}, ${PADDING_TOP})`}>
          {enhanced}
        </g>

        {/* Cursor line (middle layer) */}
        {interactive && cursorX !== null && (
          <line
            x1={cursorX + PADDING_LEFT}
            x2={cursorX + PADDING_LEFT}
            y1={PADDING_TOP}
            y2={PADDING_TOP + CHART_HEIGHT}
            stroke="white"
            strokeWidth={1}
          />
        )}

        {/* Hover circles (TOP layer — after cursor line) */}
        {interactive &&
          cursorX !== null &&
          hoverIndex !== null &&
          (() => {
            const d = data[hoverIndex];
            if (!d || d.rainfall !== undefined) return null; // no circles on rainfall

            // Temperature
            if (d.max !== undefined && d.min !== undefined) {
              return (
                <g pointerEvents="none">
                  <circle
                    cx={cursorX + PADDING_LEFT}
                    cy={yScale(d.max) + PADDING_TOP}
                    r={5}
                    fill="#FF2E94"
                    stroke="white"
                    strokeWidth={1.5}
                  />
                  <circle
                    cx={cursorX + PADDING_LEFT}
                    cy={yScale(d.min) + PADDING_TOP}
                    r={5}
                    fill="#7bbaff"
                    stroke="white"
                    strokeWidth={1.5}
                  />
                </g>
              );
            }

            // Single-value charts
            const value = d.humidity ?? d.hours ?? d.y;
            if (value !== undefined) {
              const color =
                d.humidity !== undefined
                  ? "#5F67FF"
                  : "#FFE08A";

              return (
                <g pointerEvents="none">
                  <circle
                    cx={cursorX + PADDING_LEFT}
                    cy={yScale(value) + PADDING_TOP}
                    r={5}
                    fill={color}
                    stroke="white"
                    strokeWidth={1.5}
                  />
                </g>
              );
            }

            return null;
          })()}
      </svg>

      {/* Tooltip (absolute HTML overlay) */}
      {interactive &&
        TooltipComponent &&
        hoverIndex !== null &&
        hoverX !== null &&
        finalBubbleY !== null && (
          <TooltipComponent
            index={hoverIndex}
            x={hoverX + PADDING_LEFT}
            y={finalBubbleY}
            data={data}
            position={bubblePosition}
          />
        )}
    </div>
  );
}
