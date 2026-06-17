from pathlib import Path
import pandas as pd
import xarray as xr

RAW_ROOT = Path.home() / "Documents/ceda/cabilla"
OUTPUT = "src/data/haduk/extracted/cardinham_rainfall_1961_1974.csv"

EASTING = 211500
NORTHING = 67500

files = sorted(RAW_ROOT.glob("*/rainfall/rainfall_hadukgrid_uk_1km_day_*.nc"))

frames = []

print(f"Found {len(files)} rainfall files")

for file in files:
    print(f"Processing {file.name}")

    ds = xr.open_dataset(file)

    point = ds.sel(
        projection_x_coordinate=EASTING,
        projection_y_coordinate=NORTHING,
        method="nearest",
    )

    df = point[["rainfall"]].to_dataframe().reset_index()
    df = df[["rainfall"]]
    df.columns = ["Rainfall"]

    frames.append(df)

if not frames:
    raise RuntimeError("No rainfall files found")

combined = pd.concat(frames, ignore_index=True)
combined["Date"] = pd.to_datetime(combined["Date"])
combined = combined.sort_values("Date")

# Master dataset
combined.to_csv(OUTPUT, index=False)

# Numbers import file
rainfall_only = combined[["Rainfall"]].round(1)

rainfall_only.to_csv(
    "src/data/haduk/extracted/cardinham_rainfall_values_only.csv",
    index=False,
)

print(f"Wrote {OUTPUT}")
print("Wrote src/data/haduk/extracted/cardinham_rainfall_values_only.csv")

print(f"Rows: {len(combined)}")
print(combined.head())
print(combined.tail())