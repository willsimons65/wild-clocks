import React from "react";

const MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;

  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad)
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    `M ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
  ].join(" ");
}

function monthToAngle(monthIndex, offset = 15) {
  const slice = 360 / 12;
  return (monthIndex - 1) * slice + offset;
}

function monthMidAngle(monthIndex, offset = 15) {
  const slice = 360 / 12;
  return monthToAngle(monthIndex, offset) + slice / 2;
}

export default function MicroClock({
  activeStartMonth = 2,
  activeEndMonth = 6,
  peakMonth = 5,
  activeLabel = "Mar–Jun: active",
  peakLabel = "Peak: May",
  size = 360
}) {

  const cx = size / 2;
  const cy = size / 2;

  /* slightly larger clock */
  const arcRadius = size * 0.37;
  const labelRadius = size * 0.44;

  const strokeWidth = 20;

  const startAngle = monthToAngle(activeStartMonth);
  const endAngle = monthToAngle(activeEndMonth + 1);

  const peakAngle = monthMidAngle(peakMonth);

  const peakOuter = polarToCartesian(cx, cy, arcRadius + strokeWidth / 2 + 4, peakAngle);
  const peakInner = polarToCartesian(cx, cy, arcRadius - strokeWidth / 2 + 2, peakAngle);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-full h-full"
      role="img"
      aria-label={`${activeLabel}. ${peakLabel}`}
    >

      <defs>
        <linearGradient id="microClockGradient" x1="15%" y1="85%" x2="85%" y2="15%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="55%" stopColor="#84CC16" />
          <stop offset="100%" stopColor="#22C55E" />
        </linearGradient>
      </defs>

      {/* base ring */}
      <circle
        cx={cx}
        cy={cy}
        r={arcRadius}
        fill="none"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth={strokeWidth}
      />

      {/* active season arc */}
      <path
        d={describeArc(cx, cy, arcRadius, startAngle, endAngle)}
        fill="none"
        stroke="url(#microClockGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* peak marker
      <line
        x1={peakInner.x}
        y1={peakInner.y}
        x2={peakOuter.x}
        y2={peakOuter.y}
        stroke="rgba(255,255,255,0.9)"
        strokeWidth="2"
        strokeLinecap="round"
      />*/}

      {/* month labels */}
      {MONTHS.map((label, i) => {
        const month = i + 1;
        const angle = monthMidAngle(month);
        const pos = polarToCartesian(cx, cy, labelRadius, angle);

        return (
          <text
            key={label}
            x={pos.x}
            y={pos.y}
            fill="rgba(255,255,255,0.72)"
            fontSize="12"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {label}
          </text>
        );
      })}

      {/* centre text */}
      <text
        x={cx}
        y={cy - 8}
        fill="rgba(255,255,255,0.92)"
        fontSize="16"
        textAnchor="middle"
      >
        {activeLabel}
      </text>

      <text
        x={cx}
        y={cy + 20}
        fill="rgba(255,255,255,0.8)"
        fontSize="16"
        textAnchor="middle"
      >
        {peakLabel}
      </text>

    </svg>
  );
}