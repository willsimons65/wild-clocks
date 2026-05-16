import React, { useMemo } from "react";

function round1(value) {
  return Math.round(value * 10) / 10;
}

function getMonthEntries(dailyData, year, monthIndex) {
  const monthData =
    dailyData?.years?.[String(year)]?.[String(monthIndex)] || {};

  return Object.values(monthData);
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function CabillaRainfallSummary({
  dailyData,
  year,
  monthIndex,
}) {
  const { monthlyTotal, yearToDateTotal, yearToDateMonthLabel } = useMemo(() => {
    if (!dailyData) {
      return {
        monthlyTotal: null,
        yearToDateTotal: null,
      };
    }

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth() + 1;

const isFutureMonth =
  Number(year) > currentYear ||
  (Number(year) === currentYear && monthIndex > currentMonth);

const monthEntries = isFutureMonth
  ? []
  : getMonthEntries(dailyData, year, monthIndex);

const monthlyTotal = monthEntries.reduce(
  (sum, day) => sum + Number(day.rainfall || 0),
  0
);

let yearToDateTotal = 0;

const maxMonth = isFutureMonth
  ? 0
  : Number(year) < currentYear
    ? 12
    : monthIndex;

for (let m = 1; m <= maxMonth; m += 1) {
  const entries = getMonthEntries(dailyData, year, m);

  yearToDateTotal += entries.reduce(
    (sum, day) => sum + Number(day.rainfall || 0),
    0
  );
}

return {
  monthlyTotal: round1(monthlyTotal),
  yearToDateTotal: round1(yearToDateTotal),
  yearToDateMonthLabel: isFutureMonth
    ? MONTHS[monthIndex - 1]
    : MONTHS[maxMonth - 1],
};
  }, [dailyData, year, monthIndex]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-white/[0.04] border border-white/10 px-3 py-3 text-center">
          <p className="text-[11px] uppercase tracking-wide text-white/45">
            Total for the month
          </p>

          <p className="mt-1 leading-none text-[22px] font-medium text-[#7BB8FF]">
            {monthlyTotal == null ? "—" : `${monthlyTotal}mm`}
          </p>
        </div>

        <div className="rounded-xl bg-white/[0.04] border border-white/10 px-3 py-3 text-center">
          <p className="text-[11px] uppercase tracking-wide text-white/45">
            Year total to {yearToDateMonthLabel}
          </p>

          <p className="mt-1 leading-none text-[22px] font-medium text-[#7BB8FF]">
            {yearToDateTotal == null ? "—" : `${yearToDateTotal}mm`}
          </p>
        </div>
      </div>

      <p className="mt-3 text-center text-[12px] leading-relaxed text-white/45">
        Proxy rainfall data from nearby weather station
      </p>
    </div>
  );
}