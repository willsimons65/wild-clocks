from pathlib import Path
import pandas as pd
import xarray as xr

RAW_ROOT = Path.home() / "Documents/ceda/cabilla"
OUTPUT = "src/data/haduk/extracted/cardinham_tasmin_2020_2024.csv"

EASTING = 211500
NORTHING = 67500

START_YEAR = 2020
END_YEAR = 2024

files = []

for year in range(START_YEAR, END_YEAR + 1):
    files.extend(
        sorted(
            (RAW_ROOT / str(year) / "min-temp").glob(
                "tasmin_hadukgrid_uk_1km_day_*.nc"
            )
        )
    )

frames = []

print(f"Found {len(files)} tasmin files")

for file in files:
    print(f"Processing {file.name}")

    ds = xr.open_dataset(file)

    point = ds.sel(
        projection_x_coordinate=EASTING,
        projection_y_coordinate=NORTHING,
        method="nearest",
    )

    df = point[["tasmin"]].to_dataframe().reset_index()
    df = df[["time", "tasmin"]]
    df.columns = ["Date", "TasMin"]

    frames.append(df)

if not frames:
    raise RuntimeError("No tasmin files found")

combined = pd.concat(frames, ignore_index=True)
combined["Date"] = pd.to_datetime(combined["Date"])
combined = combined.sort_values("Date")

Path("src/data/haduk/extracted").mkdir(parents=True, exist_ok=True)

# Master dataset with dates
combined.to_csv(OUTPUT, index=False)

# One-column Numbers import
tasmin_only = combined[["TasMin"]].round(1)

tasmin_only.to_csv(
    "src/data/haduk/extracted/cardinham_tasmin_2020_2024_values_only.csv",
    index=False,
)

print(f"Wrote {OUTPUT}")
print("Wrote src/data/haduk/extracted/cardinham_tasmin_2020_2024_values_only.csv")

print(f"Rows: {len(combined)}")
print(combined.head())
print(combined.tail())