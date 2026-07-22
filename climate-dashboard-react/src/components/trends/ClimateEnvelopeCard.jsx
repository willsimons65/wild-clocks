// src/components/trends/ClimateEnvelopeCard.jsx

import { useEffect, useMemo, useRef, useState } from "react";

import ClimateEnvelopeChart from "./ClimateEnvelopeChart";

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function lerp(start, end, t) {
  return start + (end - start) * t;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function buildWaveEnvelope(fromEnvelope, toEnvelope, progress) {
  const pointDelay = 0.040;

  return {
    ...toEnvelope,
    peakGDD: lerp(fromEnvelope.peakGDD, toEnvelope.peakGDD, progress),
    peakMoistureDeficit: lerp(
      fromEnvelope.peakMoistureDeficit,
      toEnvelope.peakMoistureDeficit,
      progress
    ),
    chartData: toEnvelope.chartData.map((point, index) => {
      const fromPoint = fromEnvelope.chartData[index];

      const localProgress = clamp(
        (progress - index * pointDelay) / (1 - index * pointDelay)
      );

      const eased = easeOutCubic(localProgress);

      return {
        month: point.month,
        gdd: lerp(fromPoint.gdd, point.gdd, eased),
        moisture: lerp(fromPoint.moisture, point.moisture, eased),
      };
    }),
  };
}

export default function ClimateEnvelopeCard({
  placeName,
  baselineEnvelope,
  currentEnvelope,
  baselineLabel = "1961–1990",
  currentLabel = "2021–2025",
  sourceNote,
  baselineCopy,
  currentCopy,
}) {
const [period, setPeriod] = useState("baseline");
const [fromEnvelope, setFromEnvelope] = useState(baselineEnvelope);
const [toEnvelope, setToEnvelope] = useState(baselineEnvelope);
const [animationProgress, setAnimationProgress] = useState(1);

const animationRef = useRef(null);

const isBaseline = period === "baseline";

const envelope = useMemo(
  () => buildWaveEnvelope(fromEnvelope, toEnvelope, animationProgress),
  [fromEnvelope, toEnvelope, animationProgress]
);

function changePeriod(nextPeriod) {
  if (nextPeriod === period) return;

  const nextEnvelope =
    nextPeriod === "baseline" ? baselineEnvelope : currentEnvelope;

  const currentEnvelopeState = buildWaveEnvelope(
    fromEnvelope,
    toEnvelope,
    animationProgress
  );

  setFromEnvelope(currentEnvelopeState);
  setToEnvelope(nextEnvelope);
  setPeriod(nextPeriod);
  setAnimationProgress(0);

  if (animationRef.current) {
    cancelAnimationFrame(animationRef.current);
  }

  const duration = 600;
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
          Annual climate envelope
        </h2>

        <p className="mt-4 max-w-[90%] text-sm md:text-base text-white/75 leading-relaxed">
          The chart shows the annual climate envelope experienced by {placeName}. Accumulated warmth is shown above the line and seasonal
          moisture deficit below it.
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
            {isBaseline ? "Baseline envelope" : "Current envelope"}
            <br />
            {isBaseline ? baselineLabel : currentLabel}
            </h3>

          <dl className="mt-6 space-y-1 text-sm font-semibold text-white">
            <div>
              <dt className="inline">Peak GDD: </dt>
              <dd className="inline">
                {Math.round(envelope.peakGDD).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="inline">Peak moisture deficit: </dt>
              <dd className="inline">
                {Math.round(envelope.peakMoistureDeficit).toLocaleString()}</dd>
            </div>
          </dl>

<div className="mt-8 space-y-4 text-sm leading-snug text-white/70">
  {(isBaseline ? baselineCopy : currentCopy).map((paragraph) => (
    <p key={paragraph}>{paragraph}</p>
  ))}
</div>
        </div>

        <div>
<div className="rounded-xl bg-white/[0.03] p-4 sm:p-6">
  <ClimateEnvelopeChart
    envelope={envelope}
    ariaLabel={`Annual climate envelope for ${placeName}`}
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
