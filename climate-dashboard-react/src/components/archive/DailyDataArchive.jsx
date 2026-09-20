// src/components/archive/DailyDataArchive.jsx

import { getArchiveConfig } from "@/data/archive/archiveRegistry";
import ArchiveFileList from "./ArchiveFileList";

export default function DailyDataArchive({
  place,
}) {
  const archiveConfig = getArchiveConfig(place);

  if (!archiveConfig) {
    return null;
  }

  const daily = archiveConfig.datasets.daily;

  return (
    <div className="pt-10">
      <p className="text-white/80">
        {daily.intro}
      </p>

      <ArchiveFileList dataset={daily} />
    </div>
  );
}