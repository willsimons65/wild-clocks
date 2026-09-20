// src/components/archive/FullResolutionArchive.jsx

import { useState } from "react";

import ArchiveAccessRequestForm from "./ArchiveAccessRequestForm";
import ArchiveFileList from "./ArchiveFileList";
import { getArchiveConfig } from "@/data/archive/archiveRegistry";

export default function FullResolutionArchive({
  place,
}) {
  const archiveConfig = getArchiveConfig(place);

  const [selectedDownload, setSelectedDownload] =
    useState(null);

  const [showRequestForm, setShowRequestForm] =
    useState(false);

  if (!archiveConfig) {
    return null;
  }

  const fullResolution =
    archiveConfig.datasets.fullResolution;

  function handleDownloadRequest(download) {
    setSelectedDownload(download);
    setShowRequestForm(false);
  }

  return (
    <div className="pt-10">
      <div className="max-w-4xl">
        <p className="text-white/80 leading-relaxed">
          {fullResolution.intro}
        </p>

        <p className="mt-3 text-sm text-white/55">
          Full-resolution downloads require approval.
          Select a file to continue or request access.
        </p>
      </div>

      <ArchiveFileList
        dataset={fullResolution}
        onDownloadRequest={handleDownloadRequest}
      />

      {selectedDownload && (
        <div className="mt-10 max-w-4xl border-t border-white/15 pt-8">
          <h2 className="text-xl md:text-2xl font-medium">
            Full-resolution access
          </h2>

          <p className="mt-4 text-white/80 leading-relaxed">
            {selectedDownload.monthLabel}{" "}
            {selectedDownload.year} ·{" "}
            {selectedDownload.format}
          </p>

          <div className="mt-7 space-y-6">
            <div>
              <h3 className="font-medium">
                Already have access?
              </h3>

              <p className="mt-2 text-sm text-white/60 leading-relaxed">
                Continue to the protected archive.
                You may be asked to verify your approved
                email address using a one-time PIN.
              </p>

              <a
                href={selectedDownload.downloadUrl}
                className="mt-4 inline-block rounded-full border border-white px-7 py-2 text-[#36e0b4] hover:bg-white/5 transition-colors"
              >
                Continue to download
              </a>
            </div>

            {!showRequestForm && (
              <div>
                <h3 className="font-medium">
                  Need access?
                </h3>

                <p className="mt-2 text-sm text-white/60">
                  Submit a request for access to the
                  full-resolution archive.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setShowRequestForm(true)
                  }
                  className="mt-3 text-[#36e0b4] hover:underline"
                >
                  Request access
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showRequestForm &&
        fullResolution.accessRequest?.enabled && (
          <div className="mt-4 max-w-4xl">
            <ArchiveAccessRequestForm
              place={place}
              heading={
                fullResolution.accessRequest
                  .heading ?? "Request access"
              }
            />
          </div>
        )}
    </div>
  );
}