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

      // DAILY DATA SHOULD STILL BE EMPTY
      years: [],
    },

    fullResolution: {
      title: "Full-resolution",

      intro:
        "Original sensor observations at the station recording interval are available for research and educational use. Daily data will be sufficient for most uses; request access where greater temporal detail is required.",

      access: "restricted",
      storage: "research",

      emptyMessage:
        "No full-resolution environmental data are available yet.",

      accessRequest: {
        enabled: true,
        heading: "Request access",
      },

      // DUMMY DATA GOES HERE
      years: [
        {
          year: 2026,
          files: [
            {
            id: "cabilla-private-archive-test",
            month: 9,

            startDate: "2026-09-01",
            endDate: "2026-09-30",

            sizeBytes: 4200000,

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