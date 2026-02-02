export default function SegmentedControl({
  options = [], // [{ key, label, onClick }]
  selectedKey,
  widthClass = "w-[200px] md:w-[220px]",
}) {
  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.key === selectedKey)
  );

  const count = Math.max(1, options.length);
  const segmentWidth = 100 / count;

  return (
    <div
      className={[
        "relative flex items-center",
        "rounded-full border border-white/20 bg-white/1",
        "p-1 overflow-hidden",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]",
        "h-9",
        widthClass,
      ].join(" ")}
    >
      {/* active pill */}
      <div
        className="absolute top-1 bottom-1 rounded-full bg-white/15 transition-transform duration-200"
        style={{
          width: `calc(${segmentWidth}% - 0.25rem)`,
          transform: `translateX(${selectedIndex * 100}%)`,
        }}
      />

      {options.map((opt) => {
        const isActive = opt.key === selectedKey;

        return (
          <button
            key={opt.key}
            onClick={opt.onClick}
            className={[
              "relative z-10 flex-1 h-full",
              "text-sm font-semibold leading-none",
              "transition",
              isActive ? "text-white" : "text-white/55 hover:text-white/80",
            ].join(" ")}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
