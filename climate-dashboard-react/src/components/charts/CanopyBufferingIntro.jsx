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
            shrink-0 text-white-400
            transition-transform duration-200
            ${expanded ? "rotate-180" : ""}
          `}
        />

        <span>
          How does a woodland canopy affect the temperature and humidity beneath it?
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

            <p>
            Woodlands can create their own microclimate. The canopy provides shade, reduces exposure to wind and can help retain moisture, creating conditions that differ from the open environment around them. These charts compare temperatures and humidity measured outside and beneath the canopy at Cabilla, alongside changes in soil moisture.
          </p>

          <p className="font-medium text-white/90">
            What are we measuring?
          </p>

          <p>
            We want to understand how these differences change through the seasons, particularly during periods when the soil becomes wetter or drier. Over time, these observations may help us understand how effectively the woodland moderates its own microclimate as conditions change.
          </p>
        </div>
      )}
    </section>
  );
}
