// src/components/archive/DailyDataArchive.jsx

const cabillaDailyData = [];

export default function DailyDataArchive({ place }) {
  if (place !== "thousand-year-trust") return null;

  return (
    <div className="pt-10">
      <p className="text-white/80">
        Daily environmental summaries derived from the full-resolution
        observations. Suitable for most research and analysis.
      </p>

      {cabillaDailyData.length === 0 && (
        <p className="mt-8 text-white/60">
            No daily environmental data are available yet.
        </p>
        )}

      {cabillaDailyData.map((yearGroup) => (
        <div key={yearGroup.year} className="mt-8">
          <h2 className="text-xl font-medium">
            {yearGroup.year}
          </h2>

          <div className="mt-5">
            <div className="grid grid-cols-4 border-b border-white/20 pb-3 font-medium">
              <span>Month</span>
              <span>Coverage</span>
              <span>Size</span>
              <span />
            </div>

            {yearGroup.months.map((file) => (
              <div
                key={file.month}
                className="grid grid-cols-4 py-3"
              >
                <span>{file.month}</span>
                <span>{file.coverage}</span>
                <span>{file.size}</span>

                <a
                  href={file.url}
                  className="text-right text-emerald-400 hover:underline"
                >
                  Download CSV
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}