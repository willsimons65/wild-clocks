import { useEffect, useRef, useState } from "react";
import NavPill from "@/components/ui/NavPill";

export default function MonthSortControl({
  sortOrder,
  onSortChange,
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onPointerDown(e) {
      if (!menuRef.current?.contains(e.target)) {
        setOpen(false);
      }
    }

    function onKeyDown(e) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const options = [
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
  ];

  const selectedLabel =
    options.find((option) => option.value === sortOrder)?.label ??
    "Newest first";

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-white/85">
        Sort by:
      </span>

      <div className="relative" ref={menuRef}>
        <NavPill
          onClick={() => setOpen((v) => !v)}
          withChevron
          ariaLabel={`Sort by: ${selectedLabel}`}
          className="min-w-[150px] !h-[32px]"
        >
          {selectedLabel}
        </NavPill>

        {open && (
          <div className="absolute right-0 mt-2 z-[200] w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#292929] shadow-[0_16px_48px_rgba(0,0,0,0.45)]">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onSortChange(option.value);
                  setOpen(false);
                }}
                aria-pressed={sortOrder === option.value}
                className={[
                  "w-full text-left px-4 py-3 text-sm",
                  "hover:bg-white/10 transition",
                  sortOrder === option.value
                    ? "bg-white/10 text-white"
                    : "text-white/80",
                ].join(" ")}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}