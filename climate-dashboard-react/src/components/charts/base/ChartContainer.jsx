// src/components/charts/base/ChartContainer.jsx

import React, { useState, useRef, useEffect } from "react";
import { PADDING_LEFT, PADDING_TOP, CHART_HEIGHT } from "@/constants/chartLayout";
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

  const chartWidth = Math.max(180, containerWidth - PADDING_LEFT - rightPadding);
  const totalWidth = chartWidth + PADDING_LEFT + rightPadding;

  // ---------------------
  // X scale
  // ---------------------
  const lastDay = new Date(year, monthIndex, 0).getDate();
  const xScale = makeXScale(lastDay, chartWidth);
  const xTicks = makeXTicks(lastDay);

  // ---------------------
  // Hover state
  // ---------------------
  const [hoverIndex, setHoverIndex] = useState(null);
  const [hoverX, setHoverX] = useState(null);

  // ---------------------
  // Desktop hover
  // ---------------------
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
    if (d) setHoverX(xScale(d.day));
  };

  const handleLeave = () => setHoverIndex(null);

  // ---------------------
  // ⭐ Mobile touch logic
  // ---------------------

  const handleTouchStart = (e) => {
    if (!interactive) return;
    if (!e.touches || e.touches.length === 0) return;

    const touch = e.touches[0];
    handleTouchMove({ clientX: touch.clientX, preventDefault: () => {} });
  };

  const handleTouchMove = (e) => {
    if (!interactive) return;

    if (e.preventDefault) e.preventDefault();

    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    if (!clientX) return;

    const box = containerRef.current.getBoundingClientRect();
    const mx = clientX - box.left - PADDING_LEFT;

    if (mx < 0 || mx > chartWidth) {
      setHoverIndex(null);
      return;
    }

    const index = Math.round((mx / chartWidth) * (data.length - 1));
    setHoverIndex(index);

    const d = data[index];
    if (d) setHoverX(xScale(d.day));
  };

  const handleTouchEnd = () => setHoverIndex(null);

  // ---------------------
  // Cursor X
  // ---------------------
  const cursorX =
    hoverIndex !== null && data[hoverIndex]
      ? xScale(data[hoverIndex].day)
      : null;

  // ---------------------
  // Tooltip Y positioning
  // ---------------------
  let yValues = [];
  let isRainfall = false;

  if (hoverIndex !== null && data[hoverIndex]) {
    const d = data[hoverIndex];

    if (d.max !== undefined && d.min !== undefined) {
      yValues = [d.max, d.min];
    } else if (d.humidity !== undefined) {
      yValues = [d.humidity];
    } else if (d.hours !== undefined) {
      yValues = [d.hours];
    } else if (d.rainfall !== undefined) {
      yValues = [d.rainfall];
      isRainfall = true;
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
    let OFFSET_BELOW = 50;

    if (isRainfall) OFFSET_BELOW = 40;

    finalBubbleY =
      bubblePosition === "above"
        ? topY - OFFSET_ABOVE
        : bottomY + OFFSET_BELOW;
  }

  // ---------------------
  // Clone children for chart props
  // ---------------------
  const enhanced = React.Children.map(children, (child) =>
    React.isValidElement(child)
      ? React.cloneElement(child, {
          xScale,
          xTicks,
          chartWidth,
          yScale,
          yTicks,
          hoverIndex,
        })
      : child
  );

  // ---------------------
  // RETURN
  // ---------------------
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
      style={{
        touchAction: "none",
        WebkitUserSelect: "none",
      }}
    >
      {metricHeader && hoverIndex != null && (
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
        onTouchStart={interactive ? handleTouchStart : undefined}
        onTouchMove={interactive ? handleTouchMove : undefined}
        onTouchEnd={interactive ? handleTouchEnd : undefined}
        onMouseMove={interactive ? handleMove : undefined}
        onMouseLeave={interactive ? handleLeave : undefined}
      >
        <g transform={`translate(${PADDING_LEFT}, ${PADDING_TOP})`}>
          {enhanced}
        </g>

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
      </svg>

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


