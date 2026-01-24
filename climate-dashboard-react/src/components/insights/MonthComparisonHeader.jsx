// src/components/insights/MonthComparisonHeader.jsx

import MonthSelector from "./MonthSelector";

export default function MonthComparisonHeader({
  monthLabel,
  year,
  monthIndex,
  onMonthChange,
}) {
  return (
    <section className="relative space-y-1">
      {/* Month selector */}
      <div className="absolute top-0 right-0">
        <MonthSelector
          monthIndex={monthIndex}
          onChange={onMonthChange}
        />
      </div>

      <h2 className="text-lg font-semibold text-white">
        This month’s temperature and rainfall compared to the historical pattern for {monthLabel}
      </h2>

    </section>
  );
}
