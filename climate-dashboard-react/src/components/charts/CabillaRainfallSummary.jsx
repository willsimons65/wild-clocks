import React, { useMemo } from "react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function getRainfallValue(row) {
  return Number(row?.rainfall ?? row?.precipitation ?? row?.rainfallMm ?? 0);
}

function round(value) {
  return Math.round(value);
}

export default function CabillaRainfallSummary({
  data,
  fullData,
  year,
  month,
}) {
  const monthIndex = MONTHS.indexOf(month);

  const { monthlyTotal, yearToDateTotal } = useMemo(() => {
    const safeMonthRows = Array.isArray(data) ? data : [];
    const safeFullRows = Array.isArray(fullData) ? fullData : [];

    const monthlyTotal = safeMonthRows.reduce(
      (sum, row) => sum + getRainfallValue(row),
      0
    );

    const yearToDateRows = safeFullRows.filter((row) => {
      const rowYear = Number(row.year);
      const rowMonthIndex =
        typeof row.month === "number"
          ? row.month - 1
          : MONTHS.indexOf(row.month);

      return (
        rowYear === Number(year) &&
        rowMonthIndex >= 0 &&
        rowMonthIndex <= monthIndex
      );
    });

    const yearToDateTotal = yearToDateRows.reduce(
      (sum, row) => sum + getRainfallValue(row),
      0
    );

    return {
      monthlyTotal: round(monthlyTotal),
      yearToDateTotal: round(yearToDateTotal),
    };
  }, [data, fullData, year, monthIndex]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-white/[0.04] border border-white/10 px-3 py-3 text-center">
          <p className="text-[11px] uppercase tracking-wide text-white/45">
            Total for the month
          </p>

          <p className="mt-1 leading-none text-[22px] font-medium text-blue-300">
            {monthlyTotal}mm
          </p>
        </div>

        <div className="rounded-xl bg-white/[0.04] border border-white/10 px-3 py-3 text-center">
          <p className="text-[11px] uppercase tracking-wide text-white/45">
            Year total to {month}
          </p>

          <p className="mt-1 leading-none text-[22px] font-medium text-teal-300">
            {yearToDateTotal}mm
          </p>
        </div>
      </div>

      <p className="mt-3 text-center text-[12px] leading-relaxed text-white/45">
        Proxy rainfall data from nearby weather station
      </p>
    </div>
  );
}