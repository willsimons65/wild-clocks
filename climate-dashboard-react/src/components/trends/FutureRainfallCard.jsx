// src/components/trends/FutureRainfallCard.jsx

import { useEffect, useMemo, useState } from "react";

import PossibleFuturesCard from "./PossibleFuturesCard";
import FutureRainfallChart from "./FutureRainfallChart";

import ChevronDown from "@/images/assets/chevron-down.svg";

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

export default function FutureRainfallCard({
  futureData,
  futureIntroCopy,
  futureSummaryCopy,
  futureSourceNote,
}) {
  const futurePeriods = useMemo(
    () => (futureData ? Object.keys(futureData) : []),
    [futureData]
  );

  const [selectedFuturePeriod, setSelectedFuturePeriod] =
    useState("");

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

  const selectedFutureData =
    futureData?.[selectedFuturePeriod] ?? null;

  const selectedFutureCopy =
    PERIOD_OPTIONS.find(
      (option) =>
        normalisePeriod(option.period) ===
        normalisePeriod(selectedFuturePeriod)
    )?.summaryCopy ?? futureSummaryCopy ?? [];

  if (!futurePeriods.length) {
    return null;
  }

  return (
    <PossibleFuturesCard
      anchorId="cabilla-rainfall-futures"
      title="Annual rainfall"
      period={
        selectedFutureData?.period ??
        selectedFuturePeriod.replace("-", "–")
      }
      periodControl={
        <div className="relative inline-flex items-center">
          <select
            value={selectedFuturePeriod}
            onChange={(event) =>
              setSelectedFuturePeriod(event.target.value)
            }
            aria-label="Climatic period"
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
  );
}
