import React from "react";
import MicroClock from "@/components/insights/MicroClock";

export default function MicroClockCard({
  activeStartMonth,
  activeEndMonth,
  peakMonth,
  activeLabel,
  peakLabel,
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
        />
      </div>
    </div>
  );
}