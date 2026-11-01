
import { useEffect, useMemo, useState } from "react";

import PossibleFuturesCard from "./PossibleFuturesCard";
import FutureHeatStressChart from "./FutureHeatStressChart";

import ChevronDown from "@/images/assets/chevron-down.svg";

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
      "Temperatures above 25°C could occur multiple times more often than they do today.",
      "Heat stress may become a regular part of summer, with implications for tree health, woodland structure and the long-term composition of the forest.",
    ],
  },
];

export default function FutureHeatStressCard({
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
      anchorId="cabilla-heat-stress-futures"
      title="Heat stress"
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
        <FutureHeatStressChart
          data={selectedFutureData}
          maxDays={60}
        />
      )}
    </PossibleFuturesCard>
  );
}
