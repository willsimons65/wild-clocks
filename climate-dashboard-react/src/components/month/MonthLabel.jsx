import { useState } from "react";
import TemperatureModal from "@/components/modals/TemperatureModal";
import ModalControlIcon from "@/components/icons/ModalControlIcon";

export default function MonthLabel({ month }) {
  console.log("MonthLabel rendered:", month);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <h2 className="text-lg font-medium tracking-tight opacity-90">
          {month}
        </h2>

        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open averages"
          className="w-12 h-12 flex items-center justify-center shrink-0 bg-red-500"
        >
          TEST
        </button>
      </div>

      {isOpen && (
        <TemperatureModal
          month={month}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}







