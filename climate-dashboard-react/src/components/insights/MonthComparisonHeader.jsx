// src/components/insights/MonthComparisonHeader.jsx

import MonthSelector from "./MonthSelector";

export default function MonthComparisonHeader({
  monthLabel,
  year,
  monthIndex,
  onMonthChange,
}) {
  return (
    <section className="space-y-3">
      {/* Heading + selector */}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <h2 className="text-lg font-semibold text-white">
            About{" "}
            {monthLabel}
        </h2>

        {/* Month selector drops below on mobile */}
        <div className="w-full flex justify-end md:w-auto md:shrink-0">
          <MonthSelector monthIndex={monthIndex} onChange={onMonthChange} />
        </div>
      </div>
    </section>
  );
}

