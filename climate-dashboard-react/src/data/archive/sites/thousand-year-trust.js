export const thousandYearTrustArchive = {
  siteKey: "thousand-year-trust",
  archiveKey: "cabilla",

  placeName: "Cabilla",
  hostOrganisation: "Thousand Year Trust",

  datasets: {
    daily: {
      title: "Daily data",

      intro:
        "Daily environmental summaries derived from the full-resolution observations. Suitable for most research and analysis.",

      access: "public",
      storage: "public",

      emptyMessage:
        "No daily environmental data are available yet. The page is still being tested.",

      downloadAll: null,

      // DAILY DATA
      years: [
          {
            year: 2026,
            files: [
            {
                month: 8,

                startDate: "2026-08-28",
                endDate: "2026-08-31",

                sizeBytes: 649,

                format: "csv",

                objectKey:
                "cabilla/daily/2026/cabilla-daily-2026-08.csv",
            },
            {
                month: 9,

                startDate: "2026-09-01",
                endDate: "2026-09-30",

                sizeBytes: 2875,

                format: "csv",

                objectKey:
                "cabilla/daily/2026/cabilla-daily-2026-09.csv",
            },
            ],
        },
        ],
    },

    fullResolution: {
      title: "Full-resolution",

      intro:
        "Original sensor observations at the station recording interval are available for research and educational use. Daily data will be sufficient for most uses; full-resolution downloads require approval. Select a file to continue.",

      access: "restricted",
      storage: "research",

      emptyMessage:
        "No full-resolution environmental data are available yet.",

      accessRequest: {
        enabled: true,
        heading: "Request access",
      },

      // DATA GOES HERE
        years: [
        {
            year: 2026,
            files: [
            {
                month: 8,

                startDate: "2026-08-28",
                endDate: "2026-08-31",

                sizeBytes: 146850,

                format: "csv",

                objectKey:
                "cabilla/full-resolution/2026/august/cabilla-full-resolution-2026-08.csv",

                placeholder: false,
            },

            {
                month: 9,

                startDate: "2026-09-01",
                endDate: "2026-09-30",

                sizeBytes: 1105086,

                format: "csv",

                objectKey:
                "cabilla/full-resolution/2026/september/cabilla-full-resolution-2026-09.csv",

                placeholder: false,
            },
            ],
        },
        ],
    },
  },
};