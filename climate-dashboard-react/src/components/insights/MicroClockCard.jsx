// src/components/insights/MicroClockCard.jsx

import React from "react";
import MicroClock from "@/components/insights/MicroClock";

export default function MicroClockCard({
  year,
  activeStartMonth,
  activeEndMonth,
  peakMonth,
  activeLabel,
  peakLabel,
  showArc,
}) {
  return (
    <div className="rounded-2xl bg-[#161616] p-6">
      <div className="aspect-square w-full">
        <MicroClock
          activeStartMonth={activeStartMonth}
          activeEndMonth={activeEndMonth}
          peakMonth={peakMonth}
          activeLabel={activeLabel}
          peakLabel={peakLabel}
          showArc={showArc}
        />
      </div>
    </div>
  );
}