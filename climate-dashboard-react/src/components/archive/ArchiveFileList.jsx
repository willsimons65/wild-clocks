// src/components/archive/ArchiveFileList.jsx

const STORAGE_BASE_URLS = {
  public: "https://data.wildclocks.io",
  research: "https://research-data.wildclocks.io",
};

function formatMonth(month) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(2026, month - 1, 1)));
}

function formatSize(sizeBytes) {
  if (typeof sizeBytes !== "number") {
    return "—";
  }

  if (sizeBytes < 1024 * 1024) {
    return `${(sizeBytes / 1024).toFixed(1)} KB`;
  }

  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatShortDate(dateString) {
  if (!dateString) return null;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${dateString}T00:00:00Z`));
}

function formatCoverage(file) {
  if (
    typeof file.observedDays === "number" &&
    typeof file.expectedDays === "number"
  ) {
    return `${file.observedDays} of ${file.expectedDays} days`;
  }

  if (file.startDate && file.endDate) {
    return `${formatShortDate(file.startDate)} – ${formatShortDate(
      file.endDate
    )}`;
  }

  return "—";
}

function buildDownloadUrl(storage, objectKey) {
  const baseUrl = STORAGE_BASE_URLS[storage];

  if (!baseUrl || !objectKey) {
    return null;
  }

  return `${baseUrl}/${objectKey}`;
}

export default function ArchiveFileList({
  dataset,
}) {
  const years = dataset?.years ?? [];

  if (years.length === 0) {
    return (
      <p className="mt-8 text-white/60">
        {dataset?.emptyMessage}
      </p>
    );
  }

  return (
    <div className="mt-8">
      {years.map((yearGroup) => (
        <section
          key={yearGroup.year}
          className="mt-8 first:mt-0"
        >
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

            {yearGroup.files.map((file) => {
              const downloadUrl =
                buildDownloadUrl(
                  dataset.storage,
                  file.objectKey
                );

              const format =
                file.format?.toUpperCase() ?? "FILE";

              return (
                <div
                  key={file.objectKey ?? file.id}
                  className="grid grid-cols-4 py-3"
                >
                  <span>
                    {formatMonth(file.month)}
                  </span>

                  <span>
                    {formatCoverage(file)}
                  </span>

                  <span>
                    {formatSize(file.sizeBytes)}
                  </span>

                  <span className="text-right">
                    {file.placeholder ? (
                    <span className="text-white/45">
                        Sample
                    </span>
                    ) : (
                    downloadUrl && (
                        <a
                        href={downloadUrl}
                        className="text-emerald-400 hover:underline"
                        >
                        Download {format}
                        </a>
                    )
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}