// /components/insights/IndexesSection.jsx

import WaterBalanceLiteCard from "./WaterBalanceLiteCard";

export default function IndexesSection({
  climateData,
  year,
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-white">
        Climate index
      </h2>

      <div className="w-full space-y-6">
        <WaterBalanceLiteCard climateData={climateData} year={year} />
      </div>
    </section>
  );
}

