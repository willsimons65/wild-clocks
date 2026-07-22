// src/components/trends/ClimateEnvelopeChart.jsx

import { useEffect, useState } from "react";

const GDD_AXIS_MAX = 4000;
const MOISTURE_AXIS_MIN = -4000;

const MOBILE_LAYOUT = {
  width: 390,
  height: 310,

  chartLeft: 58,
  chartRight: 372,
  zeroY: 150,
  halfHeight: 112,

  yLabelX: 48,
  monthY: 286,

  axisLabelSize: 10,
  tickLabelSize: 10,
  monthLabelSize: 10,
};

const DESKTOP_LAYOUT = {
  width: 900,
  height: 320,

  chartLeft: 70,
  chartRight: 860,
  zeroY: 160,
  halfHeight: 120,

  yLabelX: 58,
  monthY: 300,

  axisLabelSize: 12,
  tickLabelSize: 11,
  monthLabelSize: 11,
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const Y_TICKS = [
  4000,
  3000,
  2000,
  1000,
  0,
  -1000,
  -2000,
  -3000,
];

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    function handleChange(event) {
      setMatches(event.matches);
    }

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}

export default function ClimateEnvelopeChart({
  envelope,
  ariaLabel = "Annual climate envelope",
}) {
  const isMobile = useMediaQuery("(max-width: 639px)");
  const layout = isMobile ? MOBILE_LAYOUT : DESKTOP_LAYOUT;

  const chartWidth =
    layout.chartRight - layout.chartLeft;

  const pointCount = envelope.chartData.length;

  function getX(index) {
    if (pointCount <= 1) {
      return layout.chartLeft;
    }

    return (
      layout.chartLeft +
      index * (chartWidth / (pointCount - 1))
    );
  }

  function getGddY(value) {
    return (
      layout.zeroY -
      (value / GDD_AXIS_MAX) * layout.halfHeight
    );
  }

  function getMoistureY(value) {
    return (
      layout.zeroY +
      (Math.abs(value) / Math.abs(MOISTURE_AXIS_MIN)) *
        layout.halfHeight
    );
  }

  function getTickY(value) {
    if (value >= 0) {
      return (
        layout.zeroY -
        (value / GDD_AXIS_MAX) * layout.halfHeight
      );
    }

    return (
      layout.zeroY +
      (Math.abs(value) / Math.abs(MOISTURE_AXIS_MIN)) *
        layout.halfHeight
    );
  }

  const gddPoints = [
    `${layout.chartLeft},${layout.zeroY}`,
    ...envelope.chartData.map(
      (point, index) =>
        `${getX(index)},${getGddY(point.gdd)}`
    ),
    `${layout.chartRight},${layout.zeroY}`,
  ].join(" ");

  const moisturePoints = [
    `${layout.chartLeft},${layout.zeroY}`,
    ...envelope.chartData.map(
      (point, index) =>
        `${getX(index)},${getMoistureY(point.moisture)}`
    ),
    `${layout.chartRight},${layout.zeroY}`,
  ].join(" ");

  return (
    <svg
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      className="block h-auto w-full"
      role="img"
      aria-label={ariaLabel}
    >
      {Y_TICKS.filter((value) => value !== 0).map(
        (value) => {
          const y = getTickY(value);

          return (
            <line
              key={value}
              x1={layout.chartLeft}
              y1={y}
              x2={layout.chartRight}
              y2={y}
              stroke="rgba(255,255,255,0.09)"
              strokeWidth="1"
            />
          );
        }
      )}

      <polygon
        points={gddPoints}
        fill="#f59e0b"
        opacity="0.95"
      />

      <polygon
        points={moisturePoints}
        fill="#3b82f6"
        opacity="0.95"
      />

      <line
        x1={layout.chartLeft}
        y1={layout.zeroY}
        x2={layout.chartRight}
        y2={layout.zeroY}
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.5"
      />

      {Y_TICKS.map((value) => (
        <text
          key={value}
          x={layout.yLabelX}
          y={getTickY(value) + 4}
          textAnchor="end"
          fontSize={layout.tickLabelSize}
          fill="rgba(255,255,255,0.7)"
        >
          {value}
        </text>
      ))}

      {!isMobile && (
        <>
          <text
            x="22"
            y="100"
            transform="rotate(-90 8 100)"
            textAnchor="middle"
            fontSize={layout.axisLabelSize}
            fill="rgba(255,255,255,0.45)"
          >
            Accumulated GDD
          </text>

          <text
            x="37"
            y="245"
            transform="rotate(-90 8 245)"
            textAnchor="middle"
            fontSize={layout.axisLabelSize}
            fill="rgba(255,255,255,0.45)"
          >
            Moisture deficit
          </text>
        </>
      )}

      {MONTHS.map((month, index) => {
        const x =
          layout.chartLeft +
          index * (chartWidth / (MONTHS.length - 1));

        return (
          <text
            key={month}
            x={x}
            y={layout.monthY}
            textAnchor="middle"
            fontSize={layout.monthLabelSize}
            fill="rgba(255,255,255,0.7)"
          >
            {month}
          </text>
        );
      })}
    </svg>
  );
}