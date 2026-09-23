import pandas as pd

INPUT_FILE = (
    "data/ukcp18/base-rainfall/extracted/"
    "cabilla_pr_base_all_1981-2010.csv"
)

OUTPUT_FILE = (
    "data/ukcp18/base-rainfall/extracted/"
    "cabilla_rainfall_base_annual_metrics.csv"
)

DRY_THRESHOLD = 0.2
LIGHT_UPPER = 2.0
MODERATE_UPPER = 10.0
HEAVY_THRESHOLD = 10.0
VERY_HEAVY_THRESHOLD = 20.0


def longest_true_run(values):
    longest = 0
    current = 0

    for value in values:
        if value:
            current += 1
            longest = max(longest, current)
        else:
            current = 0

    return longest


df = pd.read_csv(
    INPUT_FILE,
    dtype={"EnsembleMember": str}
)

# Define the UKCP analysis year as December → November.
#
# Dec 2030 → Nov 2031 = AnalysisYear 2031
# Dec 2031 → Nov 2032 = AnalysisYear 2032
# etc.
df["AnalysisYear"] = df["ModelYear"]

df.loc[
    df["Month"] == 12,
    "AnalysisYear"
] = df.loc[
    df["Month"] == 12,
    "ModelYear"
] + 1


results = []

for (member, year), group in df.groupby(
    ["EnsembleMember", "AnalysisYear"],
    sort=True
):
    group = group.sort_values(
        ["ModelYear", "Month", "Day"]
    )

    rainfall = group["Rainfall_mm"]

    days_in_year = len(group)

    dry = rainfall < DRY_THRESHOLD

    light = (
        (rainfall >= DRY_THRESHOLD)
        & (rainfall < LIGHT_UPPER)
    )

    moderate = (
        (rainfall >= LIGHT_UPPER)
        & (rainfall < MODERATE_UPPER)
    )

    heavy = rainfall >= HEAVY_THRESHOLD

    very_heavy = rainfall >= VERY_HEAVY_THRESHOLD

    dry_days = int(dry.sum())
    light_days = int(light.sum())
    moderate_days = int(moderate.sum())
    heavy_days = int(heavy.sum())
    very_heavy_days = int(very_heavy.sum())

    annual_rainfall = float(rainfall.sum())

    annual_rainfall_365 = annual_rainfall * (365 / days_in_year)

    longest_dry_spell = longest_true_run(
        dry.tolist()
    )

    # Put event counts onto a common 365-day basis so
    # 360-, 365- and 366-day model calendars are comparable.
    scale = 365 / days_in_year

    results.append(
        {
            "AnalysisYear": int(year),
            "EnsembleMember": member,
            "DaysInYear": days_in_year,

            "AnnualRainfall_mm": annual_rainfall,
            "AnnualRainfall365_mm": annual_rainfall_365,

            "DryDays": dry_days,
            "DryDays365": dry_days * scale,

            "LightRainDays": light_days,
            "LightRainDays365": light_days * scale,

            "ModerateRainDays": moderate_days,
            "ModerateRainDays365": moderate_days * scale,

            "HeavyRainDays": heavy_days,
            "HeavyRainDays365": heavy_days * scale,

            "VeryHeavyRainDays": very_heavy_days,
            "VeryHeavyRainDays365": very_heavy_days * scale,

            "LongestDrySpell": longest_dry_spell,
        }
    )


annual = pd.DataFrame(results)

annual = annual.sort_values(
    ["EnsembleMember", "AnalysisYear"]
).reset_index(drop=True)

annual.to_csv(
    OUTPUT_FILE,
    index=False
)


print(f"Wrote {len(annual)} annual records to:")
print(OUTPUT_FILE)

print()

print("Analysis years:")
print(
    annual["AnalysisYear"].min(),
    "→",
    annual["AnalysisYear"].max()
)

print()

print("Records by ensemble member:")
print(
    annual.groupby("EnsembleMember").size()
)

print()

print("Days per analysis year:")
print(
    annual.groupby("EnsembleMember")["DaysInYear"]
    .agg(["min", "max"])
)

print()

print("Sample:")
print(
    annual.head(10).to_string(index=False)
)