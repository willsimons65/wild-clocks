// src/components/charts/base/ChartContainer.jsx

import React, {
  useState,
  useRef,
  useEffect
} from "react";

import {
  PADDING_LEFT,
  PADDING_TOP,
  CHART_HEIGHT
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

  // ---------------------
  // Responsive width
  // ---------------------
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

  // ---------------------
  // X-axis setup
  // ---------------------
  const lastDay = new Date(year, monthIndex, 0).getDate();
  const xScale = makeXScale(lastDay, chartWidth);
  const xTicks = makeXTicks(lastDay);

  // ---------------------
  // Hover logic
  // ---------------------
  const [hoverIndex, setHoverIndex] = useState(null);
  const [hoverX, setHoverX] = useState(null);

  const handleMove = (e) => {
    if (!interactive) return;

    const box = containerRef.current.getBoundingClientRect();
    const mx = e.clientX - box.left - PADDING_LEFT;

    if (mx < 0 || mx > chartWidth) {
      setHoverIndex(null);
      return;
    }

    const index = Math.round((mx / chartWidth) * (data.length - 1));
    setHoverIndex(index);

    const d = data[index];
    if (!d) return;

    setHoverX(xScale(d.day));
  };

  const handleLeave = () => setHoverIndex(null);

// ---------------------
// Touch logic (mobile)
// ---------------------

const getTouchX = (e) => {
  const touch = e.touches?.[0] || e.changedTouches?.[0];
  return touch?.clientX ?? null;
};

// Touch start
const handleTouchStart = (e) => {
  if (!interactive) return;
  const clientX = getTouchX(e);
  if (clientX == null) return;
  handleTouchMove(e); // immediately show cursor
};

// Touch move (drag)
const handleTouchMove = (e) => {
  if (!interactive) return;

  // Stop page from scrolling
  e.preventDefault();

  const clientX = getTouchX(e);
  if (clientX == null) return;

  const box = containerRef.current.getBoundingClientRect();
  const mx = clientX - box.left - PADDING_LEFT;

  if (mx < 0 || mx > chartWidth) {
    setHoverIndex(null);
    return;
  }

  const index = Math.round((mx / chartWidth) * (data.length - 1));
  setHoverIndex(index);

  const d = data[index];
  if (d) {
    setHoverX(xScale(d.day));
  }
};

// Touch end
const handleTouchEnd = () => {
  setHoverIndex(null);
};

  const cursorX =
    hoverIndex !== null &&
    hoverIndex >= 0 &&
    hoverIndex < data.length
      ? xScale(data[hoverIndex].day)
      : null;

  // -------------------------------------------
  // Unified extraction of ALL possible Y-values
  // -------------------------------------------
  let yValues = [];
  let isRainfall = false;
  if (hoverIndex !== null && data[hoverIndex]) {
    const d = data[hoverIndex];

    // Temperature charts → two values
    if (d.max !== undefined && d.min !== undefined) {
      yValues = [d.max, d.min];
    }
    // Humidity
    else if (d.humidity !== undefined) {
      yValues = [d.humidity];
    }
    // Photoperiod
    else if (d.hours !== undefined) {
      yValues = [d.hours];
    }
    else if (d.rainfall !== undefined) {
    yValues = [d.rainfall];
    isRainfall = true;  // ⭐ mark rainfall
    }
    // Generic Y-only charts
    else if (d.y !== undefined) {
      yValues = [d.y];
    }
  }

  // Convert values → pixel positions
  const yPixels = yValues.map(v => yScale(v) + PADDING_TOP);

  // Determine bubble flipping
  const topY = yPixels.length ? Math.min(...yPixels) : null;
  const bottomY = yPixels.length ? Math.max(...yPixels) : null;

  const bubblePosition = computeBubblePosition(
    topY,              // top-most
    CHART_HEIGHT,
    PADDING_TOP
  );

  // Final bubble Y: above = topY - offset, below = bottomY + offset
  let finalBubbleY = null;
if (topY !== null && bottomY !== null) {
  let OFFSET_ABOVE = 5;   // bubble distance above the highest value
  let OFFSET_BELOW = 50;  // bubble distance below the lowest value

  // ⭐ Rainfall tuning
  if (isRainfall) {
    OFFSET_ABOVE = 5; // tighter above bar
    OFFSET_BELOW = 40; // closer below bar
  }

  finalBubbleY =
    bubblePosition === "above"
      ? topY - OFFSET_ABOVE
      : bottomY + OFFSET_BELOW;
}


  // ---------------------
  // Clone children with chart props
  // ---------------------
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
    >
      {/* Metric header (Temperature: Max/Min labels) */}
      {metricHeader && hoverIndex != null && (
        <div className="absolute top-2.5 left-0 right-0 flex justify-center z-10 pointer-events-none">
          {metricHeader({ index: hoverIndex })}
        </div>
      )}

      <svg
        ref={svgRef}
        width={totalWidth}
        height={CHART_HEIGHT + PADDING_TOP + BOTTOM_PADDING}
        onMouseMove={interactive ? handleMove : undefined}
        onMouseLeave={interactive ? handleLeave : undefined}

        // ⭐ allow touchmove preventDefault
        touchAction="none"
        
        // ⭐ Touch interactions
        onTouchStart={interactive ? handleTouchStart : undefined}
        onTouchMove={interactive ? handleTouchMove : undefined}
        onTouchEnd={interactive ? handleTouchEnd : undefined}
      >

        <g transform={`translate(${PADDING_LEFT}, ${PADDING_TOP})`}>
          {enhanced}
        </g>

        {/* Cursor line */}
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

        {/* Hover Circles */}
        {interactive && cursorX !== null && hoverIndex !== null && (
          <g pointerEvents="none">
            {(() => {
              const d = data[hoverIndex];
              if (!d) return null;

              // Temperature (max + min)
              if (d.max !== undefined && d.min !== undefined) {
                return (
                  <>
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
                  </>
                );
              }

              // Single-value charts
              const value =
                d.humidity ??
                d.hours ??
                d.y;

              if (value !== undefined) {
                const color =
                  d.humidity !== undefined ? "#5F67FF" :
                  d.hours !== undefined ? "#FFE08A" :
                  "#FFE08A";

                return (
                  <circle
                    cx={cursorX + PADDING_LEFT}
                    cy={yScale(value) + PADDING_TOP}
                    r={5}
                    fill={color}
                    stroke="white"
                    strokeWidth={1.5}
                  />
                );
              }

              return null;
            })()}
          </g>
        )}
      </svg>

      {/* Tooltip Bubble */}
      {interactive &&
        TooltipComponent &&
        hoverIndex != null &&
        hoverX != null &&
        finalBubbleY != null && (
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


