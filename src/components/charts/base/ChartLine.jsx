// src/components/charts/base/ChartLine.jsx

import React, { useMemo, useEffect, useRef } from "react";
import { line, curveCatmullRom } from "d3-shape";

export default function ChartLine({ data, xScale, yScale, seriesColor = "white" }) {
  const pathRef = useRef(null);

  const pathD = useMemo(() => {
    const spline = line()
      .x(d => xScale(d.day))
      .y(d => yScale(d.value))
      .curve(curveCatmullRom.alpha(0.5));

    return spline(data);
  }, [data, xScale, yScale]);

  // Animate on mount
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();

    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    requestAnimationFrame(() => {
      path.style.transition = "stroke-dashoffset 1.5s ease-in-out";
      path.style.strokeDashoffset = "0";
    });
  }, [pathD]);

  return (
    <path
      ref={pathRef}
      d={pathD}
      fill="none"
      stroke={seriesColor}
      strokeWidth={2}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  );
}

