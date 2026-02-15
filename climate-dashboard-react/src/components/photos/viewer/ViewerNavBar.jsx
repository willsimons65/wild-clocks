// src/components/photos/viewer/ViewerNavBar.jsx

import { ArrowLeft } from "lucide-react";
import ViewerSegmentedControl from "@/components/photos/viewer/ViewerSegmentedControl";
import NavPill from "@/components/ui/NavPill";
import chevronDown from "@/images/assets/chevron-down.svg";

function shortMonth(label) {
  if (!label) return "Month";
  const s = String(label).trim();
  const abbrev = s.length > 3 ? s.slice(0, 3) : s;
  // Make sure it's "Jan" not "JAN"/"jan"
  return abbrev.charAt(0).toUpperCase() + abbrev.slice(1).toLowerCase();
}

export default function ViewerNavBar({
  title = "Photo Viewer",
  mode,
  setMode,

  monthLabel,
  onMonthClick,

  slotLabel,        // e.g. "Slot 2"
  slotShortLabel,   // e.g. "2"
  onSlotClick,
  slotEnabled = true,

  onBack,
}) {
  const monthShort = shortMonth(monthLabel);

  const showSlotPill = mode === "compare";

  return (
    <header className="sticky top-0 z-50 bg-[#1E1E1E]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* =========================
            ROW A — Context Bar
           ========================= */}
        <div className="py-4 flex items-center justify-between relative">
          {/* Desktop: centered segmented control */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
            <ViewerSegmentedControl mode={mode} setMode={setMode} />
          </div>

          {/* LEFT: back + title */}
          <div className="flex items-center gap-3 min-w-0">
            <NavPill onClick={onBack} ariaLabel="Back" variant="icon">
              <ArrowLeft className="w-5 h-5" />
            </NavPill>

            <h1 className="text-xl font-semibold tracking-tight truncate">
              {title}
            </h1>
          </div>

            {/* RIGHT: month + week */}
            <div className="flex items-center gap-3">
            {/* Month pill */}
            <NavPill onClick={onMonthClick} title="Choose month" withChevron>
                <span className="hidden md:inline">{monthLabel || "Month"}</span>
                <span className="md:hidden">{monthShort}</span>
            </NavPill>

            {/* Week pill */}
            {showSlotPill ? (
                <NavPill
                onClick={onSlotClick}
                disabled={!slotEnabled}
                title={
                    slotEnabled ? "Choose week" : "Week only available in Compare"
                }
                className="w-[52px] md:w-auto justify-center px-0"
                withChevron
                >
                {/* desktop = Week 3, mobile = 3 */}
                <span className="hidden md:inline">
                    {slotLabel?.replace("Slot", "Week") || "Week"}
                </span>
                <span className="md:hidden">
                    {slotShortLabel || ""}
                </span>
                </NavPill>
            ) : null}
            </div>

        </div>

        {/* =========================
            ROW B — Mobile Controls
          ========================= */}
        <div className="pb-4 md:hidden grid grid-cols-[72px_auto_72px] items-center">
          <div />
          <div className="flex justify-center">
            <ViewerSegmentedControl mode={mode} setMode={setMode} />
          </div>
          <div />
        </div>
      </div>
    </header>
  );
}
