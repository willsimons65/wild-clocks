// src/components/selectors/YearSelector.jsx

import { ChevronDown } from "lucide-react";

export default function YearSelector({ selectedYear, onYearChange }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 1 + i);

  return (
    <div className="relative">
      <select
        value={selectedYear}
        onChange={(e) => onYearChange(Number(e.target.value))}
        className="
          header-btn
          appearance-none
          pr-10
          bg-transparent
          text-white
        "
      >
        {years.map((y) => (
          <option key={y} value={y} className="text-black">
            {y}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
    </div>
  );
}




