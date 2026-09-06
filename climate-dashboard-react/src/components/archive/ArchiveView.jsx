// src/components/archive/ArchiveView.jsx

import { useState } from "react";
import ArchiveAbout from "./ArchiveAbout";
import DailyDataArchive from "./DailyDataArchive";
import FullResolutionArchive from "./FullResolutionArchive";

export default function ArchiveView({ place }) {
  const [archiveView, setArchiveView] = useState("about");

  return (
    <section>
      <nav className="border-b border-white/20">
        <div className="flex gap-10">
          <button
            type="button"
            onClick={() => setArchiveView("about")}
            className={`pb-3 transition-colors ${
              archiveView === "about"
                ? "border-b-2 border-white text-white"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            About
          </button>

          <button
            type="button"
            onClick={() => setArchiveView("daily")}
            className={`pb-3 transition-colors ${
              archiveView === "daily"
                ? "border-b-2 border-white text-white"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            Daily data
          </button>

          <button
            type="button"
            onClick={() => setArchiveView("full")}
            className={`pb-3 transition-colors ${
              archiveView === "full"
                ? "border-b-2 border-white text-white"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            Full-resolution
          </button>
        </div>
      </nav>

{archiveView === "about" && (
  <ArchiveAbout />
)}

{archiveView === "daily" && (
  <DailyDataArchive place={place} />
)}

{archiveView === "full" && (
  <FullResolutionArchive place={place} />
)}
    </section>
  );
}
