// /components/insights/IndexesSection.jsx

import AnnualBaselineCard from "./AnnualBaselineCard";
import WaterBalanceLiteCard from "./WaterBalanceLiteCard";

export default function IndexesSection({
  annualBaseline,
  climateData,
  year,
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-white">
        Climate indexes
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-4">
        <AnnualBaselineCard rainfallData={climateData} />
        <WaterBalanceLiteCard climateData={climateData} year={year} />
      </div>
    </section>
  );
}

