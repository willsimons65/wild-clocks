// src/components/archive/ArchiveView.jsx

import { useState } from "react";
import ArchiveAbout from "./ArchiveAbout";
import DailyDataArchive from "./DailyDataArchive";

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


    <div className="pt-10">
      <p className="text-white/80">
        Daily data will be suitable for most purposes. Researchers requiring
        greater temporal detail will be able to request access to the
        full-resolution archive once monitoring begins.
      </p>

      <p className="mt-8 text-white/60">
        No full-resolution data are available yet.
    </p>
    </div>

)}
    </section>
  );
}
