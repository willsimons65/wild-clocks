// src/components/charts/base/ChartLine.jsx

import React, { useMemo, useEffect, useRef } from "react";
import * as d3 from "d3";

export default function ChartLine({
  data,
  xScale,
  yScale,
  seriesColor = "white",
  animate = true,
  visible = true,
  strokeWidth = 2,
}) {
  const pathRef = useRef(null);

  const safeData = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);

  const pathD = useMemo(() => {
  const spline = d3
  .line()
  .defined((d) => {
    const x = Number.isFinite(d.x) ? d.x : d.day;
    const y = Number.isFinite(d.y) ? d.y : d.value;
    return Number.isFinite(x) && Number.isFinite(y);
  })
  .x((d) => xScale(Number.isFinite(d.x) ? d.x : d.day))
  .y((d) => yScale(Number.isFinite(d.y) ? d.y : d.value))
  .curve(d3.curveMonotoneX);

    return spline(safeData);
  }, [safeData, xScale, yScale]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path || !pathD) return;

    path.style.transition = "none";
    path.style.strokeDasharray = "none";
    path.style.strokeDashoffset = "0";

    if (!animate) return;

    const length = path.getTotalLength();

    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    requestAnimationFrame(() => {
      path.style.transition = "stroke-dashoffset 1.5s ease-in-out";
      path.style.strokeDashoffset = "0";
    });
  }, [pathD, animate]);

  if (!pathD) return null;

  return (
    <path
      ref={pathRef}
      d={pathD}
      fill="none"
      stroke={visible ? seriesColor : "transparent"}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
      pointerEvents="none"
    />
  );
}