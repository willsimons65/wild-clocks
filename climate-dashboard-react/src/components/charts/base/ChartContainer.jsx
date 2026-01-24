// src/components/charts/base/ChartContainer.jsx

import React, { useState, useRef, useEffect } from "react";
import { useChartScale } from "@/components/charts/base/useChartScale";

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
  xTicksOverride,
  xDomainOverride,
  TooltipComponent,
  metricHeader = null,
  rightPadding = 48,
  leftPaddingOverride,
  interactive = false,
}) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  // Always work with safe data
  const safeData = Array.isArray(data) ? data : [];

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

  const leftPadding = leftPaddingOverride ?? PADDING_LEFT;
  const chartWidth = Math.max(180, containerWidth - leftPadding - rightPadding);
  const totalWidth = chartWidth + leftPadding + rightPadding;

  // ---------------------------
  // X axis
  // ---------------------------
  const lastDay =
    Array.isArray(xDomainOverride) && xDomainOverride.length === 2
      ? xDomainOverride[1]
      : new Date(year, monthIndex, 0).getDate();

  // ✅ IMPORTANT: inset for discrete domains (months)
  const xScale = xDomainOverride
    ? useChartScale(
        [xDomainOverride[0] - 0.5, xDomainOverride[1] + 0.5],
        [0, chartWidth]
      )
    : makeXScale(lastDay, chartWidth);

  const xTicks = xTicksOverride ?? makeXTicks(lastDay);

  // Treat charts with xDomainOverride as "discrete" (e.g. months 1..12)
  const isDiscreteX =
    Array.isArray(xDomainOverride) &&
    xDomainOverride.length === 2 &&
    Number.isFinite(xDomainOverride[0]) &&
    Number.isFinite(xDomainOverride[1]);

  // ---------------------------
  // Hover state
  // ---------------------------
  const [hoverIndex, setHoverIndex] = useState(null);
  const [hoverX, setHoverX] = useState(null);

  // ---------------------------
  // Pointer -> index mapping
  // ---------------------------
  const updateFromClientX = (clientX) => {
    if (!containerRef.current || safeData.length === 0) {
      setHoverIndex(null);
      setHoverX(null);
      return;
    }

    const box = containerRef.current.getBoundingClientRect();
    const mx = clientX - box.left - leftPadding;

    if (!Number.isFinite(mx) || mx < 0 || mx > chartWidth) {
      setHoverIndex(null);
      setHoverX(null);
      return;
    }

    // ✅ Discrete x (months): choose nearest datum by xScale(d.x)
    if (isDiscreteX) {
      let nearestIndex = null;
      let minDist = Infinity;

      for (let i = 0; i < safeData.length; i++) {
        const d = safeData[i];
        const xv = d?.x;
        if (!Number.isFinite(xv)) continue;

        const px = xScale(xv);
        if (!Number.isFinite(px)) continue;

        const dist = Math.abs(px - mx);
        if (dist < minDist) {
          minDist = dist;
          nearestIndex = i;
        }
      }

      if (nearestIndex === null) {
        setHoverIndex(null);
        setHoverX(null);
        return;
      }

      setHoverIndex(nearestIndex);
      setHoverX(xScale(safeData[nearestIndex].x));
      return;
    }

    // ✅ Continuous x (daily): ratio mapping
    const index = Math.round((mx / chartWidth) * (safeData.length - 1));
    const clamped = Math.max(0, Math.min(safeData.length - 1, index));
    const d = safeData[clamped];
    if (!d) return;

    setHoverIndex(clamped);

    const xv = Number.isFinite(d.day) ? d.day : d.x;
    setHoverX(Number.isFinite(xv) ? xScale(xv) : null);
  };

  // ---------------------------
  // Mouse / touch handlers
  // ---------------------------
  const handleMove = (e) => {
    if (!interactive) return;
    updateFromClientX(e.clientX);
  };

  const handleLeave = () => {
    setHoverIndex(null);
    setHoverX(null);
  };

  const handleTouchStart = (e) => {
    if (!interactive || !e.touches.length) return;
    updateFromClientX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!interactive || !e.touches.length) return;
    e.preventDefault();
    updateFromClientX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setHoverIndex(null);
    setHoverX(null);
  };

  // ---------------------------
  // Cursor X (derived from xScale)
  // ---------------------------
  let cursorX = null;

  if (hoverIndex !== null && safeData[hoverIndex]) {
    const d = safeData[hoverIndex];
    const xv = isDiscreteX
      ? d.x
      : Number.isFinite(d.day)
        ? d.day
        : d.x;

    if (Number.isFinite(xv)) {
      cursorX = xScale(xv);
    }
  }

  // ---------------------------
  // Tooltip Y logic
  // ---------------------------
  let yValues = [];
  let isRainfall = false;

  if (hoverIndex !== null && safeData[hoverIndex]) {
    const d = safeData[hoverIndex];

    if (d.max !== undefined && d.min !== undefined) {
      yValues = [d.max, d.min];
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

  const bubblePosition = computeBubblePosition(topY, CHART_HEIGHT, PADDING_TOP);

  let finalBubbleY = null;
  if (topY !== null && bottomY !== null) {
    const OFFSET_ABOVE = 5;
    const OFFSET_BELOW = isRainfall ? 40 : 50;

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
        <g transform={`translate(${leftPadding}, ${PADDING_TOP})`}>
          {enhanced}
        </g>

        {/* Cursor line (not clipped) */}
        {interactive && cursorX !== null && (
          <line
            x1={cursorX + leftPadding}
            x2={cursorX + leftPadding}
            y1={PADDING_TOP}
            y2={PADDING_TOP + CHART_HEIGHT}
            stroke="white"
            strokeWidth={1}
          />
        )}
      </svg>

      {/* Tooltip */}
      {interactive &&
        TooltipComponent &&
        hoverIndex !== null &&
        hoverX !== null &&
        finalBubbleY !== null && (
          <TooltipComponent
            index={hoverIndex}
            x={hoverX + leftPadding}
            y={finalBubbleY}
            data={safeData}
            position={bubblePosition}
          />
        )}
    </div>
  );
}
