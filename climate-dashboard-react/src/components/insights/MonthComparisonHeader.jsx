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
        <div className="flex items-center justify-between gap-3">
            
            <h2 className="text-lg font-semibold text-white whitespace-nowrap">
            About {monthLabel}
            </h2>

            <div className="shrink-0">
            <MonthSelector
                monthIndex={monthIndex}
                onChange={onMonthChange}
            />
            </div>

        </div>
    </section>
  );
}

