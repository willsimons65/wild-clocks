// src/components/trends/HeatStressCard.jsx

import { useEffect, useMemo, useRef, useState } from "react";

import PossibleFuturesCard from "./PossibleFuturesCard";
import FutureHeatStressChart from "./FutureHeatStressChart";

import ChevronDown from "@/images/assets/chevron-down.svg";

const CHART_MAX_DAYS = 35;

const BAR_COLOURS = {
  warm: "#FFE4A1",       // pale yellow
  heatStress: "#FFBD4B",     // mid yellow
  highHeatStress: "#FF913C",  // orange
  extremeHeat: "#FF602F",     // deep orange
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

function normalisePeriod(value = "") {
  return value.replace(/–/g, "-");
}

const PERIOD_OPTIONS = [
  {
    period: "2031–2040",
    summaryCopy: [
      "Warm days are likely to become more frequent than they are today.",
      "Heat stress remains relatively uncommon, but hotter summers are beginning to emerge and the direction of change is becoming apparent.",
    ],
  },
  {
    period: "2041–2050",
    summaryCopy: [
      "Periods of unusually warm weather could become a regular feature of summer.",
      "Heat stress may occur more often, increasing seasonal water demand and making some summers noticeably more challenging for trees and woodland plants.",
    ],
  },
  {
    period: "2051–2060",
    summaryCopy: [
      "Heat stress could become a recurring feature of the growing season.",
      "Summers once considered exceptional may become more common, placing greater pressure on tree growth, soil moisture and the woodland understorey.",
    ],
  },
  {
    period: "2061–2070",
    summaryCopy: [
      "Hot summers could become a defining feature of the local climate.",
      "More frequent periods of high temperature may place sustained pressure on the woodland, favouring species better adapted to warmer and drier conditions.",
    ],
  },
  {
    period: "2071–2080",
    summaryCopy: [
      "Temperatures above 25°C could occur several times more often than they do today.",
      "Heat stress may become a regular part of summer, with implications for tree health, woodland structure and the long-term composition of the forest.",
    ],
  },
];

export default function HeatStressCard({
  placeName,
  baselineData,
  currentData,

  futureData,
  futureIntroCopy,
  futureSummaryCopy,
  futureSourceNote,

  baselineLabel = "1961–1990",
  currentLabel = "2021–2025",

  sourceNote,
  introCopy,
  baselineCopy,
  currentCopy,
}) {

  const [period, setPeriod] = useState("baseline");
  const [fromRegime, setFromRegime] = useState(baselineData);
  const [toRegime, setToRegime] = useState(baselineData);
  const [animationProgress, setAnimationProgress] = useState(1);
  const [selectedFuturePeriod, setSelectedFuturePeriod] =
    useState("");

const futurePeriods = useMemo(
    () => (futureData ? Object.keys(futureData) : []),
    [futureData]
  );

  const selectedFutureData =
  futureData?.[selectedFuturePeriod] ?? null;

const selectedFutureCopy =
  PERIOD_OPTIONS.find(
    (option) =>
      normalisePeriod(option.period) ===
      normalisePeriod(selectedFuturePeriod)
  )?.summaryCopy ?? futureSummaryCopy ?? [];

  useEffect(() => {
    if (
      futurePeriods.length > 0 &&
      !futurePeriods.includes(selectedFuturePeriod)
    ) {
      setSelectedFuturePeriod(
        futurePeriods[futurePeriods.length - 1]
      );
    }
  }, [futurePeriods, selectedFuturePeriod]);

  const animationRef = useRef(null);

const isBaseline = period === "baseline";

const regime = useMemo(
  () => buildAnimatedRegime(fromRegime, toRegime, animationProgress),
  [fromRegime, toRegime, animationProgress]
);

function changePeriod(nextPeriod) {
  if (nextPeriod === period) return;

  const nextRegime =
    nextPeriod === "baseline" ? baselineData : currentData;

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
          Heat Stress
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
            {isBaseline ? "Baseline heat stress" : "Current heat stress"}
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
    const chartLeft = 125;
    const chartWidth = 620;
    const rowY = 35 + index * 50;
    const barHeight = 28;

    const barWidth = (category.days / CHART_MAX_DAYS) * chartWidth;

    return (
      <g key={category.key}>
        <text
          x="105"
          y={rowY + 3}
          textAnchor="end"
          fontSize="13"
          fill="rgba(255,255,255,0.85)"
        >
          {category.label}
        </text>

        <text
          x="105"
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
          opacity="0.95"
        />

        <text
          x={chartLeft + barWidth + 14}
          y={rowY + 10}
          fontSize="13"
          fill="rgba(255,255,255,0.72)"
        >
          {category.days.toFixed(1)}
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

{futureData && (
<div className="mt-8">
    <PossibleFuturesCard
    anchorId="cabilla-heat-stress-futures"
    period={
            selectedFutureData?.period ??
            selectedFuturePeriod?.replace("-", "–")
            }
      periodControl={
        <div className="relative inline-flex items-center">
          <select
            value={selectedFuturePeriod}
            onChange={(event) =>
              setSelectedFuturePeriod(event.target.value)
            }
            className="
              appearance-none
              cursor-pointer
              border-0
              bg-transparent
              p-0
              pr-7
              w-auto
              min-w-0
              font-semibold
              text-white
              outline-none
            "
          >
            {futurePeriods.map((periodKey) => (
              <option
                key={periodKey}
                value={periodKey}
                className="bg-neutral-900 text-white"
              >
                {periodKey.replace("-", "–")}
              </option>
            ))}
          </select>

          <img
            src={ChevronDown}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute right-0 h-4 w-4"
          />
        </div>
        }
        introCopy={futureIntroCopy}
        summaryCopy={selectedFutureCopy}
        sourceNote={futureSourceNote}
        >
      {selectedFutureData && (
        <FutureHeatStressChart
          data={selectedFutureData}
          maxDays={60}
        />
      )}
    </PossibleFuturesCard>
  </div>
)}

    </section>
  );
}