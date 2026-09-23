import pandas as pd

INPUT_FILE = (
    "data/ukcp18/rainfall/extracted/"
    "cabilla_rainfall_annual_metrics.csv"
)

OUTPUT_FILE = (
    "data/ukcp18/rainfall/extracted/"
    "cabilla_rainfall_decadal_summary.csv"
)

# Use the same lower / middle / upper structure
# as the heat-stress futures.
LOWER_Q = 0.10
MEDIAN_Q = 0.50
UPPER_Q = 0.90

METRICS = [
    "AnnualRainfall365_mm",
    "DryDays365",
    "LightRainDays365",
    "ModerateRainDays365",
    "HeavyRainDays365",
    "VeryHeavyRainDays365",
    "LongestDrySpell",
]

DECADES = [
    (2031, 2040),
    (2041, 2050),
    (2051, 2060),
    (2061, 2070),
    (2071, 2080),
]


df = pd.read_csv(
    INPUT_FILE,
    dtype={"EnsembleMember": str}
)

rows = []

for start_year, end_year in DECADES:
    period = f"{start_year}–{end_year}"

    decade = df[
        (df["AnalysisYear"] >= start_year)
        & (df["AnalysisYear"] <= end_year)
    ]

    print(
        f"{period}: "
        f"{len(decade)} annual outcomes"
    )

    if len(decade) != 160:
        print(
            f"WARNING: expected 160 outcomes, "
            f"found {len(decade)}"
        )

    for metric in METRICS:
        values = decade[metric].dropna()

        rows.append(
            {
                "Period": period,
                "Metric": metric,
                "Lower": values.quantile(LOWER_Q),
                "Median": values.quantile(MEDIAN_Q),
                "Upper": values.quantile(UPPER_Q),
                "Min": values.min(),
                "Max": values.max(),
                "N": len(values),
            }
        )


summary = pd.DataFrame(rows)

summary.to_csv(
    OUTPUT_FILE,
    index=False
)

print()
print(f"Wrote {len(summary)} rows to:")
print(OUTPUT_FILE)

print()
print(summary.to_string(index=False))