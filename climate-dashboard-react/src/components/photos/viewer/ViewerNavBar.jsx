// src/components/photos/viewer/ViewerNavBar.jsx

import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import ViewerSegmentedControl from "@/components/photos/viewer/ViewerSegmentedControl";
import NavPill from "@/components/ui/NavPill";

function shortMonth(label) {
  if (!label) return "Month";
  const s = String(label).trim();
  const abbrev = s.length > 3 ? s.slice(0, 3) : s;
  return abbrev.charAt(0).toUpperCase() + abbrev.slice(1).toLowerCase();
}

function MenuPanel({ children, align = "right" }) {
  return (
    <div
      className={[
        "absolute mt-2 z-[200]",
        align === "right" ? "right-0" : "left-0",
      ].join(" ")}
    >
      <div className="w-56 rounded-2xl border border-white/10 bg-[#161616] shadow-[0_16px_48px_rgba(0,0,0,0.45)] overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function MenuItem({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full text-left px-4 py-3 text-sm",
        "hover:bg-white/10 transition",
        active ? "bg-white/10 text-white" : "text-white/80",
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

  // Month
  months = [],          // e.g. MONTH_NAMES
  monthIndex = 0,
  onMonthChange,

  // Week/slot
  maxSlots = 4,
  slotIndex = 0,
  onSlotChange,
  slotEnabled = true,

  onBack,
}) {
  const [monthOpen, setMonthOpen] = useState(false);
  const [weekOpen, setWeekOpen] = useState(false);

  const monthRef = useRef(null);
  const weekRef = useRef(null);

  const monthLabel = months?.[monthIndex] || "Month";
  const monthShort = shortMonth(monthLabel);

  const showSlotPill = mode === "compare";

  // Close menus on outside click + ESC
  useEffect(() => {
    function onPointerDown(e) {
      const t = e.target;
      const inMonth = monthRef.current?.contains(t);
      const inWeek = weekRef.current?.contains(t);
      if (!inMonth) setMonthOpen(false);
      if (!inWeek) setWeekOpen(false);
    }

    function onKeyDown(e) {
      if (e.key === "Escape") {
        setMonthOpen(false);
        setWeekOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // If you switch out of compare, close week menu
  useEffect(() => {
    if (mode !== "compare") setWeekOpen(false);
  }, [mode]);

  const weekLabelDesktop = `Week ${slotIndex + 1}`;
  const weekLabelMobile = `${slotIndex + 1}`;

  return (
    <header className="sticky top-0 z-50 bg-[#1E1E1E]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* ROW A */}
        <div className="py-4 flex items-center justify-between relative">
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
            <ViewerSegmentedControl mode={mode} setMode={setMode} />
          </div>

          {/* LEFT */}
          <div className="flex items-center gap-3 min-w-0">
            <NavPill onClick={onBack} ariaLabel="Back" variant="icon">
              <ArrowLeft className="w-5 h-5" />
            </NavPill>

            <h1 className="text-xl font-semibold tracking-tight truncate">
              {title}
            </h1>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            {/* Month dropdown */}
            <div className="relative" ref={monthRef}>
              <NavPill
                onClick={() => {
                  setMonthOpen((v) => !v);
                  setWeekOpen(false);
                }}
                title="Choose month"
                withChevron
              >
                <span className="hidden md:inline">{monthLabel}</span>
                <span className="md:hidden">{monthShort}</span>
              </NavPill>

              {monthOpen ? (
                <MenuPanel align="right">
                  <div className="max-h-[320px] overflow-auto">
                    {(months || []).map((m, i) => (
                      <MenuItem
                        key={`${m}-${i}`}
                        active={i === monthIndex}
                        onClick={() => {
                          onMonthChange?.(i);
                          setMonthOpen(false);
                        }}
                      >
                        {m}
                      </MenuItem>
                    ))}
                  </div>
                </MenuPanel>
              ) : null}
            </div>

            {/* Week dropdown */}
            {showSlotPill ? (
              <div className="relative" ref={weekRef}>
                <NavPill
                  onClick={() => {
                    if (!slotEnabled) return;
                    setWeekOpen((v) => !v);
                    setMonthOpen(false);
                  }}
                  disabled={!slotEnabled}
                  title={slotEnabled ? "Choose week" : "Week only available in Compare"}
                  className="w-[92px] md:w-auto justify-center px-0"
                  withChevron
                >
                  <span className="hidden md:inline">{weekLabelDesktop}</span>
                  <span className="md:hidden">{weekLabelMobile}</span>
                </NavPill>

                {weekOpen && slotEnabled ? (
                  <MenuPanel align="right">
                    {Array.from({ length: maxSlots }, (_, i) => (
                      <MenuItem
                        key={`week-${i}`}
                        active={i === slotIndex}
                        onClick={() => {
                          onSlotChange?.(i);
                          setWeekOpen(false);
                        }}
                      >
                        Week {i + 1}
                      </MenuItem>
                    ))}
                  </MenuPanel>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        {/* ROW B — Mobile controls */}
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