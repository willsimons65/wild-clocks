// src/components/trends/PossibleFuturesCard.jsx


export default function PossibleFuturesCard({
  anchorId,
  title,
  period,
  periodControl,
  introCopy,
  summaryCopy = [],
  sourceNote,
  children,
}) {
  const periodLabel =
    typeof period === "string"
      ? period
      : period?.label ?? "";

  return (
    <section
      id={anchorId}
      className="
        scroll-mt-24
        rounded-2xl
        border border-white/10
        bg-white/[0.04]
        px-6 py-7
        md:px-8 md:py-8
      "
    >
      <header className="mb-8">
        <h2 className="text-xl font-semibold text-white">
          {title}
        </h2>

        {introCopy && (
          <p className="mt-4 max-w-[90%] text-sm leading-relaxed text-white/75 md:text-base">
            {introCopy}
          </p>
        )}
      </header>

      <div className="grid gap-8 md:grid-cols-[240px_minmax(0,1fr)] md:items-stretch">
        <div className="md:pr-4">
          <h3 className="text-base font-semibold text-white">
            Climatic period
          </h3>

          <div className="mt-2">
            {periodControl ?? (
              <p className="text-xl font-semibold text-white">
                {periodLabel}
              </p>
            )}
          </div>

          {summaryCopy.length > 0 && (
            <div className="mt-6 space-y-4 text-sm leading-snug text-white/70">
              {summaryCopy.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
          </div>
          )}
        </div>

        <div>
          <div className="min-h-[220px] rounded-xl bg-white/[0.03] p-6">
            {children}
          </div>

          {sourceNote && (
            <p className="mx-auto mt-3 max-w-3xl text-center text-xs leading-relaxed text-white/45">
              {sourceNote}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
