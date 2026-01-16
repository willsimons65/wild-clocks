// src/components/layout/MonthBlock.jsx

import { useState, useMemo, useEffect } from "react";

import PhotoGrid from "@/components/photos/PhotoGrid";
import ChartCard from "@/components/layout/ChartCard";
import TemperatureChart from "@/components/charts/TemperatureChart";
import RainfallChart from "@/components/charts/RainfallChart";
import HumidityChart from "@/components/charts/HumidityChart";
import PhotoperiodChart from "@/components/charts/PhotoperiodChart";
import TemperatureModal from "@/components/modals/TemperatureModal";
import RainfallModal from "@/components/modals/RainfallModal";
import { transformRainfallMonth } from "@/data/rainfall/transformRainfallMonth";
import { transformTemperatureMonth } from "@/data/temperature/transformTemperature";
import ModalControlIcon from "@/components/icons/ModalControlIcon";
import { buildInsightsAvailability } from "@/data/insights/buildInsightsAvailability";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function normalizeRainfallRows(rows) {
  if (!Array.isArray(rows)) return [];

  return rows.map((r) => {
    if (typeof r.month === "string") return r;

    if (typeof r.month === "number") {
      return {
        ...r,
        month: MONTHS[r.month - 1],
      };
    }

    return r;
  });
}

export default function MonthBlock({
  month,
  year,
  place,
  metric,
  data,
  fullData,
  temperatureData,
}) {
  const [openModal, setOpenModal] = useState(null);

  const hasData = Array.isArray(data) && data.length > 0;

  const monthIndex0 = MONTHS.indexOf(month);
  const monthIndex = monthIndex0 + 1;

  // 🔍 DEBUG: inspect rainfall years per place
  useEffect(() => {
    if (!Array.isArray(fullData)) return;

      console.log(
    "All rainfall places:",
    [...new Set(fullData.map(r => r.place))].sort()
  );

    const years = fullData
      .filter(
        (r) =>
          typeof r.place === "string" &&
          r.place.toLowerCase().replace(/\s/g, "") === place
      )
      .map((r) => r.year);

    console.log(
      `[Rainfall years for ${place}]`,
      [...new Set(years)].sort()
    );
  }, [fullData, place]);

  // ✅ Rainfall modal data
  const rainfallModalData = useMemo(() => {
    if (metric !== "rainfall") return null;
    if (!Array.isArray(fullData)) return null;

    const placeFilteredRows = fullData;

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

  const yearRows = hasData
  ? data.filter((d) => Number(d.year) === Number(year))
  : [];


const availability = useMemo(() => {
  return buildInsightsAvailability({
    monthRows,
    yearRows,
  });
}, [monthRows, yearRows]);

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
  onClick={() => {
    if (availability.monthStatus !== "complete") return;
    setOpenModal(metric);
  }}
  disabled={availability.monthStatus !== "complete"}
  className={`w-12 h-12 flex items-center justify-center transition ${
    availability.monthStatus !== "complete"
      ? "opacity-30 cursor-not-allowed"
      : "opacity-70 hover:opacity-100"
  }`}
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
          monthIndex={monthIndex0}
          raw={temperatureData}
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







