// src/components/trends/RainfallRegimeCard.jsx

import { useEffect, useMemo, useRef, useState } from "react";

import PossibleFuturesCard from "./PossibleFuturesCard";
import FutureRainfallChart from "./FutureRainfallChart";
import ThresholdBarChart from "./ThresholdBarChart";

import ChevronDown from "@/images/assets/chevron-down.svg";

const BAR_COLOURS = {
  dry: "#84a3f2ff",
  light: "#5f88ea",
  moderate: "#3569e6",
  heavy: "#1a52ef",
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
      "Rainfall could remain abundant overall, but become less evenly distributed through the year.",
      "Dry days may become more common while very heavy rainfall events begin to occur more frequently.",
    ],
  },
  {
    period: "2041–2050",
    summaryCopy: [
      "The rainfall regime could become increasingly intermittent.",
      "Longer gaps between rainfall events may develop alongside a gradual increase in very heavy rainfall.",
    ],
  },
  {
    period: "2051–2060",
    summaryCopy: [
      "Dry periods could become more pronounced even if annual rainfall remains high.",
      "Moderate rainfall becomes less frequent, while very heavy rainfall and longer dry spells become more common.",
    ],
  },
  {
    period: "2061–2070",
    summaryCopy: [
      "Rainfall could become increasingly concentrated into fewer, heavier events.",
      "Longer dry spells may place greater seasonal pressure on soil moisture despite continued high annual rainfall.",
    ],
  },
  {
    period: "2071–2080",
    summaryCopy: [
      "Cabilla could remain a very wet woodland overall, while experiencing substantially more dry days through the year.",
      "Longer dry spells and more very heavy rainfall events suggest a less even and more episodic rainfall regime.",
    ],
  },
];

export default function RainfallRegimeCard({
  placeName,
  baselineRegime,
  currentRegime,

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
  const [fromRegime, setFromRegime] = useState(baselineRegime);
  const [toRegime, setToRegime] = useState(baselineRegime);
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
    () =>
      buildAnimatedRegime(
        fromRegime,
        toRegime,
        animationProgress
      ),
    [fromRegime, toRegime, animationProgress]
  );

  function changePeriod(nextPeriod) {
    if (nextPeriod === period) return;

    const nextRegime =
      nextPeriod === "baseline"
        ? baselineRegime
        : currentRegime;

    const currentRegimeState =
      buildAnimatedRegime(
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
        animationRef.current =
          requestAnimationFrame(tick);
      }
    }

    animationRef.current =
      requestAnimationFrame(tick);
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
              isBaseline
                ? "bg-white/15 text-white"
                : "text-white/55 hover:text-white/80"
            }`}
          >
            Baseline
          </button>

          <button
            onClick={() => changePeriod("current")}
            className={`rounded-full px-8 py-1 transition-colors ${
              !isBaseline
                ? "bg-white/15 text-white"
                : "text-white/55 hover:text-white/80"
            }`}
          >
            Current
          </button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[240px_minmax(0,1fr)] md:items-stretch">
        <div className="md:pr-4">
          <h3 className="text-base font-semibold text-white">
            {isBaseline
              ? "Baseline regime"
              : "Current regime"}
            <br />
            {isBaseline
              ? baselineLabel
              : currentLabel}
          </h3>

          <div className="mt-6 space-y-4 text-sm leading-snug text-white/70">
            {(isBaseline
              ? baselineCopy
              : currentCopy
            ).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div>
          <div className="rounded-xl bg-white/[0.03] p-4 sm:p-6">
            <ThresholdBarChart
              regime={regime}
              maxDays={365}
              colours={BAR_COLOURS}
              ariaLabel="Average number of days in each rainfall category per year"
            />
          </div>

          <p className="mx-auto mt-3 max-w-3xl text-center text-xs leading-relaxed text-white/45">
            {sourceNote}
          </p>
        </div>
      </div>

      {futureData && (
        <div className="mt-8">
          <PossibleFuturesCard
            anchorId="cabilla-rainfall-futures"
            period={
              selectedFutureData?.period ??
              selectedFuturePeriod?.replace("-", "–")
            }
            periodControl={
              <div className="relative inline-flex items-center">
                <select
                  value={selectedFuturePeriod}
                  onChange={(event) =>
                    setSelectedFuturePeriod(
                      event.target.value
                    )
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
              <FutureRainfallChart
                data={selectedFutureData}
                maxDays={200}
                maxSpellDays={40}
              />
            )}
          </PossibleFuturesCard>
        </div>
      )}
    </section>
  );
}