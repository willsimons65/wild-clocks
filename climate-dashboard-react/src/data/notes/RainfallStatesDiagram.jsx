import React, { useMemo, useState } from "react";
import {
  RAINFALL_DIAGRAM_COPY,
  RAINFALL_MONTHS,
  RAINFALL_STATE_META,
  RAINFALL_STATE_ORDER,
  RAINFALL_STATE_SERIES,
} from "@/data/notes/rainfallStates";

const CHART_MAX = 420;

function formatMm(value) {
  if (value == null) return "—";
  return Number.isInteger(value) ? `${value}` : `${value.toFixed(1)}`;
}

function splitLines(text) {
  return String(text).split("\n");
}

export default function RainfallStatesDiagram({
  defaultState = "balanced",
  defaultMonth = 7,
  className = "",
}) {
  const [selectedState, setSelectedState] = useState(defaultState);
  const [activeMonth, setActiveMonth] = useState(defaultMonth);

  const series = RAINFALL_STATE_SERIES[selectedState];
  const stateMeta = RAINFALL_STATE_META[selectedState];

  const activeValue = series?.[activeMonth] ?? null;
  const activeMonthLabel =
    RAINFALL_MONTHS.find((m) => m.key === activeMonth)?.label ?? "";

  const yTicks = useMemo(() => [100, 200, 300, 400], []);

  return (
    <section className={`w-full ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-[20px] md:text-[22px] font-medium text-white">
          {RAINFALL_DIAGRAM_COPY.title}
        </h2>
        <p className="mt-3 text-[15px] md:text-[16px] text-white/90">
          {RAINFALL_DIAGRAM_COPY.intro}
        </p>
      </div>

      <div className="border border-[rgba(255,255,255,0.20)] bg-transparent px-5 md:px-8 py-6 md:py-8">
        <div className="text-center mb-6 md:mb-8">
          <div className="text-[#4D5BFF] text-[16px] md:text-[18px] font-medium leading-tight">
            {stateMeta.label}
          </div>
          <div className="mt-1 text-[#4D5BFF] text-[15px] md:text-[16px] leading-tight">
            Median rainfall accumulated by {activeMonthLabel}: {formatMm(activeValue)} mm
          </div>
        </div>

        <div className="relative max-w-[700px] mx-auto">
          <div className="relative h-[320px] md:h-[360px] pl-14 md:pl-16 pr-4">
            <div className="absolute inset-x-4 left-14 md:left-16 bottom-16 border-t border-white/10" />

            {yTicks.map((tick) => {
              const bottom = 72 + (tick / CHART_MAX) * 250;
              return (
                <div
                  key={tick}
                  className="absolute left-0 right-0 pointer-events-none"
                  style={{ bottom: `${bottom}px` }}
                >
                  <div className="absolute left-0 text-[12px] md:text-[13px] text-white/90">
                    {tick} mm
                  </div>
                </div>
              );
            })}

<div className="absolute inset-x-4 left-14 md:left-16 top-0 bottom-0">
  <div className="absolute inset-x-0 top-0 bottom-16 flex items-end justify-between gap-4 md:gap-6">
    {RAINFALL_MONTHS.map((month) => {
      const value = series[month.key];
      const height = (value / CHART_MAX) * 250;
      const isActive = activeMonth === month.key;

      return (
        <div
          key={month.key}
          className="relative flex-1 h-full"
          onMouseEnter={() => setActiveMonth(month.key)}
          onFocus={() => setActiveMonth(month.key)}
        >
            {isActive && (
            <div
                className="absolute left-1/2 -translate-x-1/2 bottom-0 w-px bg-white/80 z-20 pointer-events-none"
                style={{ height: "270px" }}
                aria-hidden="true"
            />
            )}

          <button
            type="button"
            className="absolute left-1/2 -translate-x-1/2 bottom-0 flex items-end justify-center outline-none"
            onClick={() => setActiveMonth(month.key)}
            aria-label={`${month.label}: ${formatMm(value)} millimetres`}
          >
            <div
              className={`w-[24px] rounded-t-[2px] transition-all duration-150 ${
                isActive ? "bg-[#5A5DFF]" : "bg-[#4D5BFF]"
              }`}
              style={{ height: `${Math.max(height, 4)}px` }}
            />
          </button>
        </div>
      );
    })}
  </div>

  <div className="absolute inset-x-0 bottom-0 h-16 flex items-start justify-between gap-4 md:gap-6">
    {RAINFALL_MONTHS.map((month) => (
      <div
        key={month.key}
        className="flex-1 text-center text-[18px] md:text-[19px] text-white/90 pt-3"
      >
        {month.label}
      </div>
    ))}
  </div>
</div>
          </div>

          <div className="max-w-[470px] mx-auto mt-7 md:mt-8">
            <div className="relative flex items-start justify-between">
            <div className="absolute left-[30px] right-[30px] top-[14px] h-px bg-white/35" />

            {RAINFALL_STATE_ORDER.map((stateKey) => {
                const meta = RAINFALL_STATE_META[stateKey];
                const isSelected = stateKey === selectedState;

                return (
                <button
                    key={stateKey}
                    type="button"
                    onClick={() => setSelectedState(stateKey)}
                    className="relative z-10 flex flex-col items-center text-center outline-none"
                    aria-label={meta.label}
                    aria-pressed={isSelected}
                >
                    <div className="h-6 md:h-7 flex items-center justify-center">
                    <span
                        className={`block rounded-full border transition-all duration-150 ${
                        isSelected
                            ? "w-5 h-5 md:w-6 md:h-6 bg-white border-white"
                            : "w-4 h-4 md:w-5 md:h-5 bg-[#7A7A7A] border-[#7A7A7A]"
                        }`}
                    />
                    </div>
                    <span
                    className={`mt-2 min-h-[2.6em] text-[11px] md:text-[12px] leading-[1.15] whitespace-pre-line ${
                        isSelected ? "text-white" : "text-white/45"
                    }`}
                    >
                    {splitLines(meta.shortLabel).join("\n")}
                    </span>
                </button>
                );
            })}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-5 text-[14px] md:text-[15px] italic text-white/90">
        {RAINFALL_DIAGRAM_COPY.caption}
      </p>
    </section>
  );
}