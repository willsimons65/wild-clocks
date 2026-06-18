from pathlib import Path
import pandas as pd
import xarray as xr

RAW_ROOT = Path.home() / "Documents/ceda/cabilla"
OUTPUT = "src/data/haduk/extracted/cardinham_tasmax_1961_1974.csv"

EASTING = 211500
NORTHING = 67500

files = sorted(RAW_ROOT.glob("*/max-temp/tasmax_hadukgrid_uk_1km_day_*.nc"))

frames = []

print(f"Found {len(files)} tasmax files")

for file in files:
    print(f"Processing {file.name}")

    ds = xr.open_dataset(file)

    point = ds.sel(
        projection_x_coordinate=EASTING,
        projection_y_coordinate=NORTHING,
        method="nearest",
    )

    df = point[["tasmax"]].to_dataframe().reset_index()
    df = df[["time", "tasmax"]]
    df.columns = ["Date", "TasMax"]

    frames.append(df)

if not frames:
    raise RuntimeError("No tasmax files found")

combined = pd.concat(frames, ignore_index=True)
combined["Date"] = pd.to_datetime(combined["Date"])
combined = combined.sort_values("Date")

# Master dataset with dates
combined.to_csv(OUTPUT, index=False)

# One-column Numbers import
tasmax_only = combined[["TasMax"]].round(1)

tasmax_only.to_csv(
    "src/data/haduk/extracted/cardinham_tasmax_values_only.csv",
    index=False,
)

print(f"Wrote {OUTPUT}")
print("Wrote src/data/haduk/extracted/cardinham_tasmax_values_only.csv")

print(f"Rows: {len(combined)}")
print(combined.head())
print(combined.tail())