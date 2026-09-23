import pandas as pd

BASELINE_FILE = (
    "data/ukcp18/base-rainfall/extracted/"
    "cabilla_rainfall_base_summary.csv"
)

FUTURE_FILE = (
    "data/ukcp18/rainfall/extracted/"
    "cabilla_rainfall_decadal_summary.csv"
)

OUTPUT_FILE = (
    "data/ukcp18/rainfall/extracted/"
    "cabilla_rainfall_change_from_baseline.csv"
)

baseline = pd.read_csv(BASELINE_FILE)
future = pd.read_csv(FUTURE_FILE)

# Keep just the values we need from the historical CPM baseline.
baseline = baseline[
    [
        "Metric",
        "Lower",
        "Median",
        "Upper",
    ]
].rename(
    columns={
        "Lower": "BaselineLower",
        "Median": "BaselineMedian",
        "Upper": "BaselineUpper",
    }
)

combined = future.merge(
    baseline,
    on="Metric",
    how="left",
)

for band in ["Lower", "Median", "Upper"]:
    baseline_col = f"Baseline{band}"

    combined[f"{band}Change"] = (
        combined[band] - combined[baseline_col]
    )

    combined[f"{band}PctChange"] = (
        combined[f"{band}Change"]
        / combined[baseline_col]
        * 100
    )

output_columns = [
    "Period",
    "Metric",

    "BaselineLower",
    "Lower",
    "LowerChange",
    "LowerPctChange",

    "BaselineMedian",
    "Median",
    "MedianChange",
    "MedianPctChange",

    "BaselineUpper",
    "Upper",
    "UpperChange",
    "UpperPctChange",
]

result = combined[output_columns]

result.to_csv(
    OUTPUT_FILE,
    index=False,
)

print(f"Wrote {len(result)} rows to:")
print(OUTPUT_FILE)

print()

# Print a cleaner median-only view first,
# as this is easiest to interpret.
median_view = result[
    [
        "Period",
        "Metric",
        "BaselineMedian",
        "Median",
        "MedianChange",
        "MedianPctChange",
    ]
]

print("Median change from 1981–2010 CPM baseline:")
print()

print(
    median_view.to_string(
        index=False,
        formatters={
            "BaselineMedian": "{:.2f}".format,
            "Median": "{:.2f}".format,
            "MedianChange": "{:+.2f}".format,
            "MedianPctChange": "{:+.1f}%".format,
        },
    )
)