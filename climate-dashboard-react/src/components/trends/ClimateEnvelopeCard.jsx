// src/components/trends/ClimateEnvelopeCard.jsx

import { baselineEnvelope } from "@/data/climate-envelope/baseline-envelope";

export default function ClimateEnvelopeCard() {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-7 md:px-8 md:py-8">
      <header className="mb-8">
        <h2 className="text-xl font-semibold text-white">
          Annual climate envelope (component under development)
        </h2>

        <p className="mt-4 max-w-[90%] text-sm md:text-base text-white/75 leading-relaxed">
          The chart shows the annual climate envelope experienced by Appleton
          Woods. Accumulated warmth is shown above the line and seasonal
          moisture deficit below it.
        </p>
      </header>

      <div className="mb-8 flex justify-center">
        <div className="inline-flex rounded-full border border-white/15 bg-black/20 p-1 text-sm">
          <button className="rounded-full bg-white/15 px-8 py-1.5 text-white">
            Baseline
          </button>
          <button className="rounded-full px-8 py-1.5 text-white/55">
            Current
          </button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[240px_minmax(0,1fr)] md:items-stretch">
        <div className="md:pr-4">
          <h3 className="text-base font-semibold text-white">
            Baseline envelope
            <br />
            1961–1990
          </h3>

          <dl className="mt-6 space-y-1 text-sm font-semibold text-white">
            <div>
              <dt className="inline">Peak GDD: </dt>
              <dd className="inline">2,100</dd>
            </div>
            <div>
              <dt className="inline">Peak moisture deficit: </dt>
              <dd className="inline">−2,100</dd>
            </div>
          </dl>

          <div className="mt-8 space-y-4 text-sm leading-snug text-white/70">
            <p>
              The 1961–1990 baseline represents the historical climate envelope
              for this woodland before accelerated regional warming.
            </p>

            <p>
              During this thirty-year reference period, both seasonal heat
              accumulation and the summer moisture deficit remained within
              tightly defined boundaries.
            </p>
          </div>
        </div>

        <div>
        <div className="min-h-[340px] rounded-xl bg-white/[0.03] p-6">
        <svg viewBox="0 0 900 360" className="h-full w-full">
            {/* zero line */}
            <line
            x1="70"
            y1="160"
            x2="860"
            y2="160"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1"
            />

            {/* GDD area */}
            <polygon
            points={[
                "70,160",
                ...baselineEnvelope.chartData.map((d, i) => {
                const x = 70 + i * (790 / (baselineEnvelope.chartData.length - 1));
                const y = 160 - (d.gdd / baselineEnvelope.peakGDD) * 120;
                return `${x},${y}`;
                }),
                "860,160",
            ].join(" ")}
            fill="#f59e0b"
            opacity="0.95"
            />

            {/* Moisture area */}
            <polygon
            points={[
                "70,160",
                ...baselineEnvelope.chartData.map((d, i) => {
                const x = 70 + i * (790 / (baselineEnvelope.chartData.length - 1));
                const y =
                    160 +
                    (Math.abs(d.moisture) /
                    Math.abs(baselineEnvelope.peakMoistureDeficit)) *
                    120;
                return `${x},${y}`;
                }),
                "860,160",
            ].join(" ")}
            fill="#3b82f6"
            opacity="0.95"
            />

            {[140, 105, 70, 35, -35, -70, -105, -140].map((offset) => {
            const yValue = 160 - offset;
            return (
                <line
                key={offset}
                x1="70"
                y1={yValue}
                x2="860"
                y2={yValue}
                stroke="rgba(255,255,255,0.09)"
                strokeWidth="1"
                />
            );
            })}

            <line
            x1="70"
            y1="160"
            x2="860"
            y2="160"
            stroke="rgba(255, 255, 255, 0.4)" 
            strokeWidth="1.5"
            />

{/* Y-axis labels */}
{[
  { y: 20, label: "4000" },
  { y: 55, label: "3000" },
  { y: 90, label: "2000" },
  { y: 125, label: "1000" },
  { y: 160, label: "0" },
  { y: 195, label: "-1000" },
  { y: 230, label: "-2000" },
  { y: 265, label: "-3000" },
  { y: 300, label: "-4000" },
].map(({ y, label }) => (
  <text
    key={label}
    x="58"
    y={y + 4}
    textAnchor="end"
    fontSize="11"
    fill="rgba(255,255,255,0.7)"
  >
    {label}
  </text>
))}

{/* Section labels */}
<text
  x="8"
  y="100"
  transform="rotate(-90 8 100)"
  textAnchor="middle"
  fontSize="12"
  fill="rgba(255,255,255,0.45)"
>
  Accumulated GDD
</text>

<text
  x="8"
  y="245"
  transform="rotate(-90 8 245)"
  textAnchor="middle"
  fontSize="12"
  fill="rgba(255,255,255,0.45)"
>
  Moisture deficit
</text>

{/* Month labels */}
{[
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
].map((month, i) => {
            const x = 70 + (i * 790) / 11;

            return (
                <text
                key={month}
                x={x}
                y="325"
                textAnchor="middle"
                fontSize="11"
                fill="rgba(255,255,255,0.7)"
                >
                {month}
                </text>
            );
            })}

            
        </svg>
        
    </div>
      <p className="mt-3 text-xs leading-relaxed text-white/45">
    Historical climate data are derived from the Radcliffe Observatory,
    Oxford, approximately 4 miles from Appleton Woods. Recent temperature
    records are drawn from the Observatory, while rainfall observations are
    collected locally.
  </p>
    
    </div>
    </div>

    </section>
  );
}
