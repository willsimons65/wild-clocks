// src/components/photos/viewer/CompareActionRows.jsx

export default function CompareActionsRow({
  onSwap,
  onShare,
  swapDisabled = false,
}) {
  return (
    <div className="max-w-[1200px] mx-auto px-4 pt-4">
      <div className="relative flex items-center justify-center">
        {/* Swap centered */}
        <button
          onClick={onSwap}
          disabled={swapDisabled}
          className={[
            "h-11 px-4 rounded-full border text-sm transition",
            "flex items-center justify-center",
            swapDisabled
              ? "border-white/10 bg-white/5 text-white/35 cursor-not-allowed"
              : "border-white/15 bg-white/5 hover:bg-white/10 text-white/85",
          ].join(" ")}
          title="Swap years"
        >
          ⇄
        </button>

        {/* Share pinned right */}
        <button
          onClick={onShare}
          className="absolute right-0 h-11 px-4 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white/85 text-sm transition"
          title="Copy link"
        >
          ⤴︎
        </button>
      </div>
    </div>
  );
}
