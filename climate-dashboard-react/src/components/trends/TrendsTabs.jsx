
export default function TrendsTabs({
  activeTab,
  onTabChange,
}) {
  return (
    <nav
      className="border-b border-white/20"
      aria-label="Trends views"
    >
      <div className="flex gap-10">
        {[
          { key: "observations", label: "Climate record" },
          { key: "projections", label: "Projections" },
        ].map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onTabChange(key)}
            aria-current={
              activeTab === key ? "page" : undefined
            }
            className={`pb-3 transition-colors ${
              activeTab === key
                ? "border-b-2 border-white text-white"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}
