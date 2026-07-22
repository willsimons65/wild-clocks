// src/components/trends/WinterColdCard.jsx

import { useEffect, useMemo, useRef, useState } from "react";

import ThresholdBarChart from "./ThresholdBarChart";

const WINTER_COLD_COLOURS = {
  winterChill: "#03BBB6",
  dormancyConditions: "#30CBC7",
  nearFreezing: "#64DBDA",
  frost: "#97EBEB",
  hardFrost: "#C8FCFA",
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

export default function WinterColdCard({
  placeName,
  baselineData,
  currentData,
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
          Winter Cold
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
            {isBaseline ? "Baseline winter cold" : "Current winter cold"}
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
    <div className="rounded-xl bg-white/[0.03] p-4 sm:p-6">
    <ThresholdBarChart
        regime={regime}
        maxDays={365}
        colours={WINTER_COLD_COLOURS}
        ariaLabel="Average number of winter cold days per year"
    />
    </div>

  <p className="mx-auto mt-3 max-w-3xl text-center text-xs leading-relaxed text-white/45">
    {sourceNote}
  </p>
</div>
    </div>

    </section>
  );
}