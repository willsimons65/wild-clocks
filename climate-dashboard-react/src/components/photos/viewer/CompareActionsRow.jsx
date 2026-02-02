// src/components/photos/viewer/CompareActionsRow.jsx

import swapIcon from "@/images/assets/swap.svg";
import shareIcon from "@/images/assets/share.svg";

export default function CompareActionsRow({
  onSwap,
  onShare,
  swapDisabled = false,
}) {
  return (
    // tighter spacing: pt-4 -> pt-2 (≈50% gap reduction)
    <div className="max-w-[1200px] mx-auto px-4 pt-6">
      {/* ✅ match CompareSlider desktop width */}
      <div className="mx-auto w-full md:max-w-[600px]">
        <div className="relative flex items-center justify-center">
          {/* Swap centered */}
          <button
            onClick={onSwap}
            disabled={swapDisabled}
            className={[
              "h-9 w-9 rounded-full border transition",
              "flex items-center justify-center",
              swapDisabled
                ? "border-white/10 bg-white/5 cursor-not-allowed"
                : "border-white/15 bg-white/5 hover:bg-white/10",
            ].join(" ")}
            title="Swap years"
          >
            <img
              src={swapIcon}
              alt=""
              className={[
                "w-4 h-4",
                swapDisabled ? "opacity-30" : "opacity-90",
              ].join(" ")}
              draggable={false}
            />
          </button>

          {/* Share pinned right (now aligns to image edge) */}
          <button
            onClick={onShare}
            className="
              absolute right-0
              h-9 w-9 rounded-full
              border border-white/15 bg-white/5 hover:bg-white/10
              flex items-center justify-center
              transition
            "
            title="Copy link"
          >
            <img
              src={shareIcon}
              alt=""
              className="w-4 h-4 opacity-90"
              draggable={false}
            />
          </button>
        </div>
      </div>
    </div>
  );
}


