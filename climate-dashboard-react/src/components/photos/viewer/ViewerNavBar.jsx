// src/components/photos/viewer/ViewerNavBar.jsx

import { ArrowLeft } from "lucide-react";
import ViewerSegmentedControl from "@/components/photos/viewer/ViewerSegmentedControl";
import PillButton from "@/components/ui/PillButton";


function ShortMonth(label) {
  if (!label) return "Month";
  const s = String(label);
  return s.length > 3 ? s.slice(0, 3) : s;
}

function HeaderBtn({ children, onClick, disabled, title }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={[
        "header-btn flex items-center gap-1 whitespace-nowrap shrink-0",
        disabled ? "opacity-40 cursor-not-allowed" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}


export default function ViewerNavBar({
  title = "Photo Viewer",
  mode,
  setMode,

  monthLabel,
  onMonthClick,

  slotLabel,
  onSlotClick,
  slotEnabled = true,

  onBack,
}) {
  const monthShort = ShortMonth(monthLabel);

  return (
    <header className="sticky top-0 z-50 bg-[#1E1E1E]/80 backdrop-blur-xl border-b border-white/10">
      {/* Outer wrapper */}
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
            <button onClick={onBack} className="header-btn" aria-label="Back">
              <ArrowLeft className="w-5 h-5" />
            </button>

            <h1 className="text-xl font-semibold tracking-tight truncate">
              {title}
            </h1>
          </div>

          {/* RIGHT: month + slot */}
          <div className="flex items-center gap-3">
            <HeaderBtn onClick={onMonthClick} title="Choose month">
              {monthLabel} <span className="text-white/60">▾</span>
            </HeaderBtn>

            <HeaderBtn
              onClick={onSlotClick}
              disabled={!slotEnabled}
              title={
                slotEnabled ? "Choose slot" : "Slot only available in Compare"
              }
            >
              {slotLabel} <span className="text-white/60">▾</span>
            </HeaderBtn>
          </div>
        </div>

        {/* =========================
            ROW B — Mobile Controls
          ========================= */}
        <div className="pb-4 md:hidden grid grid-cols-[72px_auto_72px] items-center">
          {/* LEFT spacer */}
          <div />

          {/* CENTER: segmented control */}
          <div className="flex justify-center">
            <ViewerSegmentedControl mode={mode} setMode={setMode} />
          </div>

          {/* RIGHT spacer */}
          <div />
        </div>
      </div>
    </header>
  );
}
