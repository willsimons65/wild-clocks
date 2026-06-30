// src/components/trends/RainfallRegimeCard.jsx

import { useEffect, useMemo, useRef, useState } from "react";

const CHART_MAX_DAYS = 365;

const BAR_COLOURS = {
  dry: "#84a3f2ff",       // pale blue
  light: "#5f88ea",     // mid blue
  moderate: "#3569e6",  // stronger blue
  heavy: "#1a52ef",     // deep blue
};

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function buildAnimatedRegime(fromRegime, toRegime, progress) {
  const rowDelay = 0.08;

  return {
    ...toRegime,
    categories: toRegime.categories.map((category, index) => {
      const fromCategory = fromRegime.categories[index];

      const localProgress = clamp(
        (progress - index * rowDelay) / (1 - index * rowDelay)
      );

      const eased = easeOutCubic(localProgress);

      return {
        ...category,
        days: lerp(fromCategory.days, category.days, eased),
      };
    }),
  };
}

export default function RainfallRegimeCard({
  placeName,
  baselineRegime,
  currentRegime,
  baselineLabel = "1961–1990",
  currentLabel = "2021–2025",
  sourceNote,
  introCopy,
  baselineCopy,
  currentCopy,
}) {
const [period, setPeriod] = useState("baseline");
const [fromRegime, setFromRegime] = useState(baselineRegime);
const [toRegime, setToRegime] = useState(baselineRegime);
const [animationProgress, setAnimationProgress] = useState(1);

const animationRef = useRef(null);

const isBaseline = period === "baseline";

const regime = useMemo(
  () => buildAnimatedRegime(fromRegime, toRegime, animationProgress),
  [fromRegime, toRegime, animationProgress]
);

function changePeriod(nextPeriod) {
  if (nextPeriod === period) return;

  const nextRegime =
    nextPeriod === "baseline" ? baselineRegime : currentRegime;

  const currentRegimeState = buildAnimatedRegime(
    fromRegime,
    toRegime,
    animationProgress
  );

  setFromRegime(currentRegimeState);
  setToRegime(nextRegime);
  setPeriod(nextPeriod);
  setAnimationProgress(0);

  if (animationRef.current) {
    cancelAnimationFrame(animationRef.current);
  }

  const duration = 500;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = clamp(elapsed / duration);

    setAnimationProgress(progress);

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(tick);
    }
  }

  animationRef.current = requestAnimationFrame(tick);
}

useEffect(() => {
  return () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };
}, []);

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-7 md:px-8 md:py-8">
      <header className="mb-8">
        <h2 className="text-xl font-semibold text-white">
          Annual rainfall
        </h2>

        <p className="mt-4 max-w-[90%] text-sm md:text-base text-white/75 leading-relaxed">
        {introCopy}
        </p>
      </header>

      <div className="mb-8 flex justify-center">
        <div className="inline-flex rounded-full border border-white/15 bg-black/20 p-0.5 text-sm">
            <button
            onClick={() => changePeriod("baseline")}
            className={`rounded-full px-8 py-1 transition-colors ${
                isBaseline ? "bg-white/15 text-white" : "text-white/55 hover:text-white/80"
            }`}
            >
            Baseline
            </button>

            <button
            onClick={() => changePeriod("current")}
            className={`rounded-full px-8 py-1 transition-colors ${
                !isBaseline ? "bg-white/15 text-white" : "text-white/55 hover:text-white/80"
            }`}
            >
            Current
            </button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[240px_minmax(0,1fr)] md:items-stretch">
        <div className="md:pr-4">
            <h3 className="text-base font-semibold text-white">
            {isBaseline ? "Baseline regime" : "Current regime"}
            <br />
            {isBaseline ? baselineLabel : currentLabel}
            </h3>


<div className="mt-6 space-y-4 text-sm leading-snug text-white/70">
  {(isBaseline ? baselineCopy : currentCopy).map((paragraph) => (
    <p key={paragraph}>{paragraph}</p>
  ))}
</div>
        </div>

        <div>
        <div className="min-h-[220px] rounded-xl bg-white/[0.03] p-6">
<svg viewBox="0 0 900 220" className="h-full w-full">
  {regime.categories.map((category, index) => {
    const chartLeft = 95;
    const chartWidth = 620;
    const rowY = 35 + index * 50;
    const barHeight = 28;

    const barWidth = (category.days / CHART_MAX_DAYS) * chartWidth;

    return (
      <g key={category.key}>
        <text
          x="65"
          y={rowY + 3}
          textAnchor="end"
          fontSize="13"
          fill="rgba(255,255,255,0.85)"
        >
          {category.label}
        </text>

        <text
          x="65"
          y={rowY + 19}
          textAnchor="end"
          fontSize="11"
          fill="rgba(255,255,255,0.45)"
        >
          {category.range}
        </text>

        <rect
          x={chartLeft}
          y={rowY - 8}
          width={barWidth}
          height={barHeight}
          rx="0"
          fill={BAR_COLOURS[category.key]}
          opacity={category.key === "light" ? 0.82 : 0.95}
        />

        <text
          x={chartLeft + barWidth + 16}
          y={rowY + 10}
          fontSize="13"
          fill="rgba(255,255,255,0.72)"
        >
          {Math.round(category.days)}
        </text>
      </g>
    );
  })}
</svg>
        
    </div>
      <p className="mx-auto mt-3 max-w-3xl text-center text-xs leading-relaxed text-white/45">
        {sourceNote}
  </p>
    
    </div>
    </div>

    </section>
  );
}