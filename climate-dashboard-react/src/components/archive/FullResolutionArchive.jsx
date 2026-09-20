// src/components/archive/FullResolutionArchive.jsx

import ArchiveAccessRequestForm from "./ArchiveAccessRequestForm";
import ArchiveFileList from "./ArchiveFileList";
import { getArchiveConfig } from "@/data/archive/archiveRegistry";

export default function FullResolutionArchive({
  place,
}) {
  const archiveConfig = getArchiveConfig(place);

  if (!archiveConfig) {
    return null;
  }

  const fullResolution =
    archiveConfig.datasets.fullResolution;

  return (
    <div className="pt-10">
      <div className="max-w-4xl">
        <p className="text-white/80 leading-relaxed">
          {fullResolution.intro}
        </p>
      </div>

      <ArchiveFileList
        dataset={fullResolution}
      />

      {fullResolution.accessRequest?.enabled && (
        <div className="mt-12 border-t border-white/15 pt-2">
          <ArchiveAccessRequestForm
            place={place}
            heading={
              fullResolution.accessRequest.heading ??
              "Request access"
            }
          />
        </div>
      )}
    </div>
  );
}