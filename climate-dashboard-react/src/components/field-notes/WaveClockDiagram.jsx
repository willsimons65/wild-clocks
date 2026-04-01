// src/components/field-notes/WaveClockDiagram.jsx

import React, { useMemo, useState } from "react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const SERIES = [
  {
    id: "rainfall",
    label: "Rainfall",
    color: "#464FFE",
    type: "bar",
    defaultVisible: true,
    values: [58, 38, 3, 15, 23, 21, 34, 19, 59, 42, 102, 63],
  },
  {
    id: "temperature",
    label: "Temperature",
    color: "#FF2DA1",
    type: "line",
    stave: "climate",
    defaultVisible: true,
    points: [
      [0.0, 0.08],
      [0.8, 0.08],
      [1.6, 0.12],
      [2.2, 0.22],
      [3.0, 0.40],
      [4.0, 0.63],
      [5.0, 0.82],
      [6.0, 0.94],
      [7.0, 0.88],
      [8.0, 0.66],
      [9.0, 0.34],
      [10.0, 0.16],
      [11.0, 0.08],
    ],
  },
  {
    id: "bluebells",
    label: "Bluebells",
    color: "#7A63FF",
    type: "pulse",
    stave: "species",
    defaultVisible: true,
    start: 3.35,
    end: 4.15,
    height: 2.65,
    radius: 18,
  },
  {
    id: "canopy",
    label: "Leaf canopy",
    color: "#14B814",
    type: "pulse",
    stave: "structure",
    defaultVisible: true,
    start: 3.50,
    end: 8.65,
    height: 2.95,
    radius: 18,
  },
  {
    id: "fungi",
    label: "Fungi",
    color: "#955353ff",
    type: "pulse",
    stave: "species",
    defaultVisible: true,
    start: 8.40,
    end: 10.22,
    height: 2.65,
    radius: 18,
  },
];

function createScales(width, height, padding) {
  const xMin = 0;
  const xMax = 11;
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const toX = (x) =>
    padding.left + ((x - xMin) / (xMax - xMin)) * innerWidth;

  return { toX, innerWidth, innerHeight };
}

function buildSmoothStavePath(points, width, height, padding, staveY, riseHeight) {
  const xMin = 0;
  const xMax = 11;
  const innerWidth = width - padding.left - padding.right;

  const toX = (x) =>
    padding.left + ((x - xMin) / (xMax - xMin)) * innerWidth;

  const toY = (value) => staveY - value * riseHeight;

  if (!points.length) return "";

  const coords = points.map(([x, y]) => ({
    x: toX(x),
    y: toY(y),
  }));

  if (coords.length < 2) return "";

  let d = `M ${coords[0].x} ${coords[0].y}`;

  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i - 1] || coords[i];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[i + 2] || p2;

    const tension = 0.18;

    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;

    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return d;
}

function renderPulse(series, toX, staveY, riseHeight) {
  const left = toX(series.start);
  const right = toX(series.end);
  const top = staveY - series.height * riseHeight;

  const width = right - left;
  const radius = Math.min(series.radius ?? 18, width / 2 - 2);

  // outward flare at the feet
  const flare = Math.min(12, width * 0.10);

  // how high above the stave the lower foot curve rises
  const footRise = 16;

  return (
    <path
      key={series.id}
      d={`
        M ${left - flare} ${staveY}
        Q ${left} ${staveY} ${left} ${staveY - footRise}
        L ${left} ${top + radius}
        Q ${left} ${top} ${left + radius} ${top}
        L ${right - radius} ${top}
        Q ${right} ${top} ${right} ${top + radius}
        L ${right} ${staveY - footRise}
        Q ${right} ${staveY} ${right + flare} ${staveY}
      `}
      fill="none"
      stroke={series.color}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

export default function WaveClockDiagram() {
  const [visible, setVisible] = useState(
    Object.fromEntries(SERIES.map((s) => [s.id, s.defaultVisible]))
  );

  const width = 900;
  const height = 540;

  const padding = {
    top: 70,
    right: 28,
    bottom: 85,
    left: 92,
  };

  const { toX, innerWidth, innerHeight } = createScales(width, height, padding);

const baselineY = padding.top + innerHeight * 0.98;

const staveGap = 38;

const staveYs = {
  species: baselineY - staveGap,
  climate: baselineY - staveGap * 2,
  structure: baselineY - staveGap * 3,
};

  const staveRise = {
    structure: innerHeight * 0.22,
    climate: innerHeight * 0.40,
    species: innerHeight * 0.26,
  };

  const rainfallSeries = SERIES.find((s) => s.id === "rainfall");
  const maxRain = Math.max(...rainfallSeries.values);

  const toggle = (id) => {
    setVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const monthPositions = useMemo(() => {
    return MONTHS.map((_, i) => toX(i));
  }, [toX]);

  const lineSeries = SERIES.filter((s) => s.type === "line" && visible[s.id]);
  const pulseSeries = SERIES.filter((s) => s.type === "pulse" && visible[s.id]);

  return (
    <div className="my-10 border border-white/20 bg-[#1E1E1E] px-5 py-5 md:px-7 md:py-6">
      <div className="mb-5 md:mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap md:items-center md:justify-center gap-x-4 gap-y-3 md:gap-x-8">
          {SERIES.map((series) => (
            <label
              key={series.id}
              className="inline-flex items-center gap-2 cursor-pointer select-none whitespace-nowrap text-sm md:text-[14px]"
            >
              <input
                type="checkbox"
                checked={visible[series.id]}
                onChange={() => toggle(series.id)}
                className="h-3.5 w-3.5 md:h-4 md:w-4 accent-white bg-transparent border-white/60 rounded-sm shrink-0"
              />
              <span style={{ color: series.color }}>{series.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
          role="img"
          aria-label="Wave Clock diagram showing seasonal intensity across the year"
        >
          {/* Y-axis label */}
          <text
            x="26"
            y={padding.top + innerHeight / 2}
            fill="rgba(255,255,255,0.88)"
            fontSize="24"
            fontWeight="300"
            transform={`rotate(-90, 26, ${padding.top + innerHeight / 2})`}
            textAnchor="middle"
          >
            Seasonal intensity
          </text>

          {/* Staves: species, climate, structure */}
          {[staveYs.structure, staveYs.climate, staveYs.species].map((y, index) => (
            <line
              key={`stave-${index}`}
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="rgba(255,255,255,0.10)"
              strokeWidth="1.25"
            />
          ))}

          {/* Bottom baseline for month labels / rainfall grounding */}
          <line
            x1={padding.left}
            y1={baselineY}
            x2={width - padding.right}
            y2={baselineY}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1.25"
          />

          {/* Rainfall bars */}
          {visible.rainfall &&
            rainfallSeries.values.map((value, index) => {
              const barWidth = 14;
              const x = toX(index) - barWidth / 2;
              const h = (value / maxRain) * (innerHeight * 0.34);
              const y = baselineY - h;

              return (
                <rect
                  key={`rain-${index}`}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={h}
                  fill={rainfallSeries.color}
                  opacity="0.95"
                  rx="2"
                />
              );
            })}

          {/* Line series */}
          {lineSeries.map((series) => (
            <path
              key={series.id}
              d={buildSmoothStavePath(
                series.points,
                width,
                height,
                padding,
                staveYs[series.stave],
                staveRise[series.stave]
              )}
              fill="none"
              stroke={series.color}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}

          {/* Pulse series */}
          {pulseSeries.map((series) =>
            renderPulse(
              series,
              toX,
              staveYs[series.stave],
              staveRise[series.stave]
            )
          )}

          {/* Month labels */}
          {MONTHS.map((month, i) => (
            <text
              key={month}
              x={monthPositions[i]}
              y={height - 55}
              fill="rgba(255,255,255,0.88)"
              fontSize="20"
              fontWeight="300"
              textAnchor="middle"
            >
              {month}
            </text>
          ))}

          {/* Caption */}
{/* Caption */}
<text
  x={width / 2}
  y={height - 22}
  fill="rgba(255,255,255,0.75)"
  fontSize="14"
  fontStyle="italic"
  textAnchor="middle"
>
  <tspan x={width / 2} dy="0">
    Each line and bar shows the relative timing, duration and character of a seasonal wave or pulse, rather than a
  </tspan>
  <tspan x={width / 2} dy="18">
    literal shared scale.
  </tspan>
</text>
        </svg>
      </div>
    </div>
  );
}