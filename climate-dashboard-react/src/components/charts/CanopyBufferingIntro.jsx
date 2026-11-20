// src/components/charts/CanopyBufferingIntro.jsx

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function CanopyBufferingIntro() {
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();

  return (
    <section
      className="
        rounded-xl
        border border-white/20
        bg-[#262626]
        px-5 py-4
      "
      aria-label="About canopy buffering"
    >
      <h2
        className="
          text-xs font-medium
          uppercase tracking-[0.12em]
          text-[#F5B800]
        "
      >
        Canopy buffering
      </h2>

      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-expanded={expanded}
        aria-controls={contentId}
        className="
          mt-2 flex w-full items-start gap-3
          text-left
          text-sm text-white/80
          hover:text-white
          transition-colors
          focus-visible:outline
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-white/70
        "
      >
        <ChevronDown
          size={20}
          aria-hidden="true"
          className={`
            shrink-0 text-emerald-400
            transition-transform duration-200
            ${expanded ? "rotate-180" : ""}
          `}
        />

        <span>
          Explore how the woodland microclimate varies
          as soil moisture changes.
        </span>
      </button>

      {expanded && (
        <div
          id={contentId}
          className="
            mt-4 space-y-2
            text-sm leading-relaxed
            text-white/75
          "
        >
          <p className="font-medium text-white/90">
            What are we measuring?
          </p>

          <p>
            These charts compare daily temperature or
            humidity differences between outside and
            beneath the canopy with changes in soil
            moisture. Follow the lines through the month to explore
            how the measurements vary together.
          </p>

          <p className="text-white/50">
            Monthly averages use days with sufficient
            observations. The charts may also show
            individual days that are excluded from
            those averages.
          </p>
        </div>
      )}
    </section>
  );
}
