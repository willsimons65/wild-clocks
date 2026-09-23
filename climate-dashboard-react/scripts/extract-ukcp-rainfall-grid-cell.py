from pathlib import Path
import re

import numpy as np
import pandas as pd
import xarray as xr


RAW_DIR = Path("data/ukcp18/base-rainfall/raw")
OUTPUT_DIR = Path("data/ukcp18/base-rainfall/extracted")

OUTPUT_FILE = OUTPUT_DIR / "cabilla_pr_base_all_1981-2010.csv"

EASTING = 213750
NORTHING = 71250

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

files = sorted(
    RAW_DIR.glob("pr_rcp85_land-cpm_uk_5km_*_day_*.nc")
)

if not files:
    raise FileNotFoundError(
        f"No rainfall NetCDF files found in {RAW_DIR}"
    )

frames = []

pattern = re.compile(
    r"pr_rcp85_land-cpm_uk_5km_(\d+)_day_(\d{8})-(\d{8})\.nc"
)


def decode_yyyymmdd(value):
    if isinstance(value, (bytes, np.bytes_)):
        value = value.decode("utf-8")

    value = str(value).strip()

    # Keep only the YYYYMMDD part
    return value[:8]


print(f"Found {len(files)} NetCDF files")
print()

for file in files:
    match = pattern.fullmatch(file.name)

    if not match:
        print(f"Skipping unexpected filename: {file.name}")
        continue

    ensemble_member = match.group(1)

    print(f"Processing {file.name}")

    ds = xr.open_dataset(file)

    point = ds.sel(
        projection_x_coordinate=EASTING,
        projection_y_coordinate=NORTHING,
        method="nearest",
    )

    selected_x = float(point.projection_x_coordinate.values)
    selected_y = float(point.projection_y_coordinate.values)

    print(f"  Ensemble member: {ensemble_member}")
    print(f"  Selected grid cell: {selected_x}, {selected_y}")

    pr = point["pr"].squeeze()

    raw_dates = point["yyyymmdd"].values
    date_values = [decode_yyyymmdd(v) for v in raw_dates]

    frame = pd.DataFrame(
        {
            "Date": [
                f"{d[:4]}-{d[4:6]}-{d[6:8]}"
                for d in date_values
            ],
            "ModelYear": [
                int(d[:4])
                for d in date_values
            ],
            "Month": [
                int(d[4:6])
                for d in date_values
            ],
            "Day": [
                int(d[6:8])
                for d in date_values
            ],
            "Rainfall_mm": pr.values,
            "EnsembleMember": ensemble_member,
        }
    )

    frames.append(frame)

    ds.close()


if not frames:
    raise RuntimeError(
        "No valid rainfall files were processed."
    )

combined = pd.concat(frames, ignore_index=True)

combined = combined.sort_values(
    by=["EnsembleMember", "Date"]
).reset_index(drop=True)

output_file = OUTPUT_FILE

combined.to_csv(output_file, index=False)

print()
print(f"Wrote {len(combined)} rows to:")
print(output_file)

print()
print("Ensemble members found:")
print(
    ", ".join(
        sorted(combined["EnsembleMember"].unique())
    )
)

print()
print("Date range:")
print(
    combined["Date"].min(),
    "→",
    combined["Date"].max()
)

print()
print("Rows by ensemble member:")
print(
    combined.groupby("EnsembleMember").size()
)