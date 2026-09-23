import pandas as pd

INPUT_FILE = (
    "data/ukcp18/base-rainfall/extracted/"
    "cabilla_rainfall_base_annual_metrics.csv"
)

OUTPUT_FILE = (
    "data/ukcp18/base-rainfall/extracted/"
    "cabilla_rainfall_base_summary.csv"
)

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

df = pd.read_csv(
    INPUT_FILE,
    dtype={"EnsembleMember": str}
)

rows = []

for metric in METRICS:
    values = df[metric].dropna()

    rows.append(
        {
            "Period": "1981–2010",
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

print(f"Wrote {len(summary)} rows to:")
print(OUTPUT_FILE)

print()
print(summary.to_string(index=False))