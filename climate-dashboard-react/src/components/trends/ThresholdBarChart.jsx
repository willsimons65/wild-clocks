import { useEffect, useState } from "react";

const DEFAULT_MAX_DAYS = 35;

const MOBILE_LAYOUT = {
  width: 390,

  chartLeft: 138,
  chartWidth: 207,

  firstRowY: 36,
  rowGap: 58,
  barHeight: 30,

  labelX: 120,
  labelSize: 14,
  thresholdSize: 12,
  valueSize: 13,
  valueGap: 10,
};

const DESKTOP_LAYOUT = {
  width: 900,

  chartLeft: 125,
  chartWidth: 620,

  firstRowY: 35,
  rowGap: 50,
  barHeight: 28,

  labelX: 105,
  labelSize: 13,
  thresholdSize: 11,
  valueSize: 13,
  valueGap: 14,
};

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

export default function ThresholdBarChart({
  regime,
  maxDays = DEFAULT_MAX_DAYS,
  colours,
  ariaLabel = "Threshold chart",
}) {
  const isMobile = useMediaQuery("(max-width: 639px)");
  const layout = isMobile ? MOBILE_LAYOUT : DESKTOP_LAYOUT;

  const chartHeight =
    layout.firstRowY +
    (regime.categories.length - 1) * layout.rowGap +
    layout.barHeight +
    28;

  return (
    <svg
      viewBox={`0 0 ${layout.width} ${chartHeight}`}
      className="block h-auto w-full"
      role="img"
      aria-label={ariaLabel}
    >
      {regime.categories.map((category, index) => {
        const rowY =
          layout.firstRowY + index * layout.rowGap;

        const safeDays = Math.max(0, category.days);

        const barWidth =
          (Math.min(safeDays, maxDays) / maxDays) *
          layout.chartWidth;

        const valueX =
          layout.chartLeft +
          barWidth +
          layout.valueGap;

        return (
          <g key={category.key}>
            <text
              x={layout.labelX}
              y={rowY + 2}
              textAnchor="end"
              fontSize={layout.labelSize}
              fontWeight="500"
              fill="rgba(255,255,255,0.85)"
            >
              {category.label}
            </text>

            <text
              x={layout.labelX}
              y={rowY + 20}
              textAnchor="end"
              fontSize={layout.thresholdSize}
              fill="rgba(255,255,255,0.45)"
            >
              {category.range}
            </text>

            <rect
              x={layout.chartLeft}
              y={rowY - 10}
              width={barWidth}
              height={layout.barHeight}
              fill={colours[category.key]}
              opacity="0.95"
            />

            <text
              x={valueX}
              y={rowY + 10}
              fontSize={layout.valueSize}
              fill="rgba(255,255,255,0.72)"
            >
              {safeDays.toFixed(1)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}