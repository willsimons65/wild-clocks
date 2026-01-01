// src/components/layout/MonthBlock.jsx

import { useState, useMemo } from "react";
import PhotoGrid from "@/components/photos/PhotoGrid";
import ChartCard from "@/components/layout/ChartCard";
import TemperatureChart from "@/components/charts/TemperatureChart";
import RainfallChart from "@/components/charts/RainfallChart";
import HumidityChart from "@/components/charts/HumidityChart";
import PhotoperiodChart from "@/components/charts/PhotoperiodChart";
import TemperatureModal from "@/components/modals/TemperatureModal";
import RainfallModal from "@/components/modals/RainfallModal";
import { transformRainfallMonth } from "@/data/rainfall/transformRainfallMonth";
import ModalControlIcon from "@/components/icons/ModalControlIcon";
import { transformTemperatureMonth } from "@/data/temperature/transformTemperature";


const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function normalizeRainfallRows(rows) {
  if (!Array.isArray(rows)) return [];

  return rows.map((r) => {
    // If month is already a string, leave it alone
    if (typeof r.month === "string") return r;

    // If month is a number (1–12), convert to name
    if (typeof r.month === "number") {
      return {
        ...r,
        month: MONTHS[r.month - 1],
      };
    }

    // Fallback: return row unchanged
    return r;
  });
}

export default function MonthBlock({
  month,
  year,
  place,
  metric,
  data,            // current year rows (charts)
  fullData,        // ALL years daily rows (rainfall modal only)
  temperatureData, // ✅ aggregated temperature data (temperature modal)
}) {
  const [openModal, setOpenModal] = useState(null);

  const hasData = Array.isArray(data) && data.length > 0;

  const monthIndex0 = MONTHS.indexOf(month);
  const monthIndex = monthIndex0 + 1;

  // ✅ Rainfall modal data (derived here, not in modal)
// ✅ Rainfall modal data (derived here, not in modal)
const rainfallModalData = useMemo(() => {
  if (metric !== "rainfall") return null;
  if (!Array.isArray(fullData)) return null;

  const placeFilteredRows = fullData.filter(
    (r) =>
      typeof r.place === "string" &&
      r.place.toLowerCase().replace(/\s/g, "") === place
  );

  if (placeFilteredRows.length === 0) return null;

  const normalizedRows = normalizeRainfallRows(placeFilteredRows);

  return transformRainfallMonth(
    normalizedRows,
    year,
    month
  );
}, [metric, fullData, year, month, place]);

const temperatureModalData = useMemo(() => {
  if (metric !== "temperature") return null;
  if (!temperatureData) return null;

  return transformTemperatureMonth(
    temperatureData,
    year,
    monthIndex0
  );
}, [metric, temperatureData, year, monthIndex0]);

  const monthRows = hasData
  ? data.filter(
      (d) =>
        Number(d.year) === Number(year) &&
        d.month === month
    )
  : [];

  const renderChart = () => {
    switch (metric) {
      case "temperature":
        return (
          <TemperatureChart
            data={monthRows}
            month={month}
            monthIndex={monthIndex}
            year={year}
          />
        );

      case "rainfall":
        return (
          <RainfallChart
            data={monthRows}
            month={month}
            monthIndex={monthIndex}
            year={year}
          />
        );

      case "humidity":
        return (
          <HumidityChart
            data={monthRows}
            month={month}
            monthIndex={monthIndex}
            year={year}
          />
        );

      case "photoperiod":
        return (
          <PhotoperiodChart
            data={monthRows}
            month={month}
            monthIndex={monthIndex}
            year={year}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 relative overflow-visible">
        <div className="rounded-2xl bg-[#1E1E1E] relative">
          <PhotoGrid month={monthIndex} year={year} place={place} />
        </div>

        <ChartCard>
          <div className="relative overflow-visible">
            <div className="relative px-4 py-6 h-10">
              <h2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-medium tracking-tight opacity-90">
                {month}
              </h2>

              <div className="absolute right-0 top-1/2 -translate-y-1/2">
                <button
                  aria-label="Open details"
                  className="w-12 h-12 flex items-center justify-center opacity-70 hover:opacity-100 transition"
                  onClick={() => {
                    if (metric === "rainfall" && !rainfallModalData?.hasData) return;
                    if (
                      metric === "temperature" &&
                      !temperatureModalData?.hasSelectedYearData
                    ) return;
                    setOpenModal(metric);
                  }}
                >
                  <ModalControlIcon className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {renderChart()}
          </div>
        </ChartCard>
      </div>

      {openModal === "temperature" && (
        <TemperatureModal
          month={month}
          year={year}
          monthIndex={monthIndex0}   // ✅ 0-based
          raw={temperatureData}      // ✅ NOT fullData
          onClose={() => setOpenModal(null)}
        />
      )}


      {openModal === "rainfall" && rainfallModalData && (
  <RainfallModal
    year={year}
    monthLabel={month}
    data={rainfallModalData}
    onClose={() => setOpenModal(null)}
  />
)}

    </>
  );
}






