// src/components/photos/viewer/ViewerSegmentedControl.jsx

export default function ViewerSegmentedControl({ mode, setMode }) {
  return (
    <div className="rounded-full border border-white/10 bg-white/5 p-1 flex gap-1">
      <button
        onClick={() => setMode("photos")}
        className={[
          "px-4 py-2 rounded-full text-sm font-medium transition",
          mode === "photos"
            ? "bg-white/10 text-white"
            : "text-white/60 hover:text-white",
        ].join(" ")}
      >
        Photos
      </button>

      <button
        onClick={() => setMode("compare")}
        className={[
          "px-4 py-2 rounded-full text-sm font-medium transition",
          mode === "compare"
            ? "bg-white/10 text-white"
            : "text-white/60 hover:text-white",
        ].join(" ")}
      >
        Compare
      </button>
    </div>
  );
}
