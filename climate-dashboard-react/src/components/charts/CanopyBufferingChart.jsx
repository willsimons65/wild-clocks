// src/components/charts/CanopyBufferingChart.jsx

import { useEffect, useId, useMemo, useRef, useState } from "react";

const COLORS = {
  cooling: "#FE2E95",
  humidity: "#6066FF",
  moisture: "#F59E0B",
};

const HEIGHT = 360;

const TOP = {
  start: 52,
  end: 130,
};

const BOTTOM = {
  start: 220,
  end: 303,
};

const round1 = (value) =>
  Math.round((value + Number.EPSILON) * 10) / 10;

const numberOrNull = (value) =>
  value == null || !Number.isFinite(Number(value))
    ? null
    : Number(value);

function makeDomain(values, type) {
  const valid = values.filter(Number.isFinite);

  if (type === "humidity") {
    const extent = Math.max(
      5,
      ...valid.map((v) => Math.abs(v))
    );
    const limit = Math.ceil(extent / 5) * 5;
    return [-limit, limit];
  }

  if (type === "moisture") {
    if (!valid.length) return [20, 80];

    const min = Math.floor(
      Math.min(20, ...valid) / 20
    ) * 20;

    const max = Math.ceil(
      Math.max(80, ...valid) / 20
    ) * 20;

    return [Math.max(0, min), Math.min(100, max)];
  }

  if (!valid.length) return [0, 4];

  const min = Math.min(0, ...valid);
  const max = Math.max(4, ...valid);

  return [
    Math.floor(min / 2) * 2,
    Math.ceil(max / 2) * 2,
  ];
}

function getTicks([min, max], type) {
  if (type === "moisture") {
    const ticks = [];
    for (let v = min; v <= max; v += 20) {
      ticks.push(v);
    }
    return ticks;
  }

  return [min, (min + max) / 2, max];
}

function formatValue(value, type, axis = false) {
  if (!Number.isFinite(value)) return "—";

  if (type === "humidity") {
    const number = axis ? `${value}` : round1(value).toFixed(1);
    return `${value > 0 ? "+" : ""}${number}${axis ? "" : " pp"}`;
  }

  if (type === "moisture") {
    return `${axis ? value : round1(value).toFixed(1)}%`;
  }

  return `${axis ? value : round1(value).toFixed(1)}°C`;
}

// Generate separate line segments so missing days
// are never joined by an invented observation.
function makeSegments(rows, getValue, xScale, yScale) {
  const segments = [];
  let current = [];
  let previousDay = null;

  function finish() {
    if (current.length) {
      segments.push(current);
      current = [];
    }
  }

  for (const row of rows) {
    const value = getValue(row);

    if (!Number.isFinite(value)) {
      finish();
      previousDay = null;
      continue;
    }

    if (
      previousDay !== null &&
      row.day !== previousDay + 1
    ) {
      finish();
    }

    current.push([
      xScale(row.day),
      yScale(value),
    ]);

    previousDay = row.day;
  }

  finish();

  return segments;
}


function LineSegments({
  segments,
  color,
  animate = false,
  animationKey = "",
}) {
  return segments.map((points, index) => {
    const path = points
      .map(
        ([x, y], i) =>
          `${i === 0 ? "M" : "L"}${x},${y}`
      )
      .join(" ");

    if (points.length === 1) {
      return (
        <circle
          key={`${animationKey}-${index}`}
          cx={points[0][0]}
          cy={points[0][1]}
          r={2}
          fill={color}
        />
      );
    }

    return (
    <path
        key={`${animationKey}-${index}`}
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={animate ? "1" : undefined}
        strokeDashoffset={animate ? 1 : undefined}
        className={animate ? "canopy-animated-line" : undefined}
        style={
        animate
            ? {
                animation: "canopyLineDraw 700ms ease-out forwards",
            }
            : undefined
         }
      />
    );
  });
}

export default function CanopyBufferingChart({
  dailyData,
  year,
  monthIndex,
  metric = "cooling",
}) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const clipId = useId().replace(/:/g, "");

  const [width, setWidth] = useState(320);
  const [hoverDay, setHoverDay] = useState(null);

  const isHumidity = metric === "humidity";

  const upperType = isHumidity
    ? "humidity"
    : "cooling";

  const upperLabel = isHumidity
    ? "Humidity difference"
    : "Canopy cooling";

  const upperColor = isHumidity
    ? COLORS.humidity
    : COLORS.cooling;

  const lastDay = new Date(
    year,
    monthIndex,
    0
  ).getDate();

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Clear the cursor when changing the selected chart.
  useEffect(() => {
    setHoverDay(null);
  }, [year, monthIndex, metric]);

  const rows = useMemo(() => {
    const source =
      dailyData?.years?.[String(year)]?.[
        String(monthIndex)
      ] ?? {};

    return Array.from(
      { length: lastDay },
      (_, index) => {
        const day = index + 1;
        const record = source[String(day)];

        return {
          day,
          cooling: numberOrNull(
            record?.buffering?.canopyCooling
          ),
          humidity: numberOrNull(
            record?.buffering?.humidityDifference
          ),
          moisture: numberOrNull(
            record?.soilMoisture?.mean
          ),
          eligible:
            record?.buffering?.eligible === true,
        };
      }
    );
  }, [dailyData, year, monthIndex, lastDay]);

  const upperValue = (row) =>
    isHumidity ? row.humidity : row.cooling;

  const hasAnyData = rows.some(
    (row) =>
      Number.isFinite(upperValue(row)) ||
      Number.isFinite(row.moisture)
  );

  const left = 40;
  const right = 54;
  const plotWidth = Math.max(
    1,
    width - left - right
  );

  const xScale = (day) =>
    left +
    ((day - 1) / Math.max(1, lastDay - 1)) *
      plotWidth;

  const upperDomain = makeDomain(
    rows.map(upperValue),
    upperType
  );

  const moistureDomain = makeDomain(
    rows.map((row) => row.moisture),
    "moisture"
  );

  const createYScale = (domain, plot) => (value) => {
    const [min, max] = domain;
    const fraction = (value - min) / (max - min || 1);

    return (
      plot.end -
      fraction * (plot.end - plot.start)
    );
  };

  const upperY = createYScale(
    upperDomain,
    TOP
  );

  const moistureY = createYScale(
    moistureDomain,
    BOTTOM
  );

  const upperSegments = makeSegments(
    rows,
    upperValue,
    xScale,
    upperY
  );

  const moistureSegments = makeSegments(
    rows,
    (row) => row.moisture,
    xScale,
    moistureY
  );

  const selected = hoverDay == null
    ? null
    : rows[hoverDay - 1];

    const activeDay =
    selected &&
    Number.isFinite(upperValue(selected))
        ? selected
        : null;

  const cursorX = activeDay
    ? xScale(activeDay.day)
    : null;

  const updatePointer = (event) => {
    const svg = svgRef.current;
    if (!svg) return;

    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;

    if (x < left || x > width - right) {
      setHoverDay(null);
      return;
    }

    const candidateDays = rows.filter(
    (row) => Number.isFinite(upperValue(row))
    );

    if (!candidateDays.length) {
      setHoverDay(null);
      return;
    }

    const nearest = candidateDays.reduce(
      (best, row) =>
        Math.abs(xScale(row.day) - x) <
        Math.abs(xScale(best.day) - x)
          ? row
          : best
    );

    setHoverDay(nearest.day);
  };

  const xTicks = [
    1, 7, 13, 19, 25, lastDay
  ].filter(
    (day, index, arr) =>
      day <= lastDay && arr.indexOf(day) === index
  );

  const renderAxis = (domain, type, scale) =>
    getTicks(domain, type).map((tick) => (
      <text
        key={tick}
        x={width - 9}
        y={scale(tick) + 4}
        textAnchor="end"
        fontSize="11"
        fill="#D1D1D1"
      >
        {formatValue(tick, type, true)}
      </text>
    ));

  if (!hasAnyData) {
    return (
      <div className="rounded-2xl border border-white/20 bg-[#1E1E1E] px-4 py-16 text-center text-sm text-white/50">
        No canopy buffering observations available
        for this month
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="
        relative w-full
        overflow-hidden
        rounded-2xl
        border border-white/20
        bg-[#1E1E1E]
      "
    >
    
    <style>
    {`
        @keyframes canopyLineDraw {
        from {
            stroke-dashoffset: 1;
        }
        to {
            stroke-dashoffset: 0;
        }
        }

        @media (prefers-reduced-motion: reduce) {
        .canopy-animated-line {
            animation: none !important;
            stroke-dashoffset: 0 !important;
        }
        }
    `}
    </style>

      <svg
        ref={svgRef}
        width="100%"
        height={HEIGHT}
        viewBox={`0 0 ${width} ${HEIGHT}`}
        onPointerMove={updatePointer}
        onPointerDown={updatePointer}
        onPointerLeave={() => setHoverDay(null)}
        onPointerCancel={() => setHoverDay(null)}
        style={{
          display: "block",
          touchAction: "pan-y",
          userSelect: "none",
        }}
        role="img"
        aria-label={`${upperLabel} and soil moisture for ${year}, month ${monthIndex}`}
      >
        <defs>
          <clipPath id={clipId}>
            <rect
              x={left}
              y={TOP.start}
              width={plotWidth}
              height={BOTTOM.end - TOP.start}
            />
          </clipPath>
        </defs>

        {/* Upper label */}
        <text
          x={width / 2}
          y={22}
          textAnchor="middle"
          fontSize="12"
          fill="#BDBDBD"
        >
          {upperLabel}
        </text>

        {/* Daily value shown on interaction */}
        {activeDay && (
          <text
            x={width / 2}
            y={43}
            textAnchor="middle"
            fontSize="12"
            fill={upperColor}
          >
            {formatValue(
              upperValue(activeDay),
              upperType
            )}
          </text>
        )}

        {/* Upper scale */}
        {renderAxis(
          upperDomain,
          upperType,
          upperY
        )}

        {/* Humidity zero reference */}
        {isHumidity && (
        <line
            x1={left}
            x2={width - right}
            y1={upperY(0)}
            y2={upperY(0)}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth={1}
            strokeDasharray="3 4"
            pointerEvents="none"
        />
        )}

        {/* Upper line */}
        <g clipPath={`url(#${clipId})`}>
          <LineSegments
            segments={upperSegments}
            color={upperColor}
            animate
            animationKey={metric}
        />
        </g>

        {/* Divider */}
        <line
          x1={left}
          x2={width - right}
          y1={161}
          y2={161}
          stroke="rgba(255,255,255,0.16)"
        />

        {/* Lower label */}
        <text
          x={width / 2}
          y={185}
          textAnchor="middle"
          fontSize="12"
          fill="#BDBDBD"
        >
          Soil moisture
        </text>

        {/* Daily soil moisture value */}
        {activeDay && Number.isFinite(activeDay.moisture) && (
          <text
            x={width / 2}
            y={206}
            textAnchor="middle"
            fontSize="12"
            fill={COLORS.moisture}
          >
            {formatValue(
              activeDay.moisture,
              "moisture"
            )}
          </text>
        )}

        {/* Soil moisture scale */}
        {renderAxis(
          moistureDomain,
          "moisture",
          moistureY
        )}

        {/* Soil moisture line */}
        <g clipPath={`url(#${clipId})`}>
          <LineSegments
            segments={moistureSegments}
            color={COLORS.moisture}
          />
        </g>

        {/* Shared cursor, split across two plots */}
        {cursorX !== null && (
          <g
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.2"
            pointerEvents="none"
          >
            <line
              x1={cursorX}
              x2={cursorX}
              y1={55}
              y2={140}
            />
            <line
              x1={cursorX}
              x2={cursorX}
              y1={BOTTOM.start}
              y2={323}
            />
          </g>
        )}

        {/* Shared date bubble */}
        {activeDay && (
          <g pointerEvents="none">
            <circle
              cx={cursorX}
              cy={295}
              r={12}
              fill="#242424"
              stroke="#8C8C8C"
              strokeWidth="1"
            />
            <text
              x={cursorX}
              y={299}
              textAnchor="middle"
              fontSize="11"
              fill="white"
            >
              {activeDay.day}
            </text>
          </g>
        )}

        {/* Shared date axis */}
        {xTicks.map((day) => (
          <text
            key={day}
            x={xScale(day)}
            y={336}
            textAnchor="middle"
            fontSize="11"
            fill="#E5E5E5"
          >
            {day}
          </text>
        ))}
      </svg>
    </div>
  );
}
