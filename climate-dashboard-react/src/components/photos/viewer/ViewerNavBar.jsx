// src/components/photos/viewer/ViewerNavBar.jsx

import ViewerSegmentedControl from "@/components/photos/viewer/ViewerSegmentedControl";

function NavPillButton({ children, onClick, disabled, title }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={[
        "h-12 px-4 rounded-full border text-sm font-medium transition",
        "flex items-center justify-center gap-2",
        disabled
          ? "border-white/10 bg-white/5 text-white/35 cursor-not-allowed"
          : "border-white/15 bg-white/5 hover:bg-white/10 text-white/85",
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
  return (
    <div className="border-b border-white/10 bg-[#1E1E1E]/60 backdrop-blur-xl">
      <div className="max-w-[1200px] mx-auto px-4 py-4">
        {/* 3-column grid: matches Feed/Insights header */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
          {/* LEFT */}
          <div className="flex items-center gap-3 min-w-0">
            <NavPillButton onClick={onBack} title="Back">
              <span className="text-lg leading-none">←</span>
            </NavPillButton>

            <div className="text-white/90 font-semibold truncate">
              {title}
            </div>
          </div>

          {/* CENTER */}
          <div className="flex justify-center">
            <ViewerSegmentedControl mode={mode} setMode={setMode} />
          </div>

          {/* RIGHT */}
          <div className="flex items-center justify-end gap-3">
            <NavPillButton onClick={onMonthClick} title="Choose month">
              {monthLabel} <span className="text-white/60">▾</span>
            </NavPillButton>

            <NavPillButton
              onClick={onSlotClick}
              disabled={!slotEnabled}
              title={slotEnabled ? "Choose slot" : "Slot only available in Compare"}
            >
              {slotLabel} <span className="text-white/60">▾</span>
            </NavPillButton>
          </div>
        </div>
      </div>
    </div>
  );
}
