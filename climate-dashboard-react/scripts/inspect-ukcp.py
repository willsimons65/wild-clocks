from pathlib import Path
import xarray as xr

# Change this to match your filename
FILE = Path.home() / "Documents/wild-clocks-data/cabilla/raw/tasmax_rcp85_land-cpm_uk_5km_01_day_20701201-20801130.nc"

ds = xr.open_dataset(FILE)

print("\n=== DATASET ===")
print(ds)

print("\n=== VARIABLES ===")
print(list(ds.data_vars))

print("\n=== COORDINATES ===")
print(list(ds.coords))

print("\n=== ATTRIBUTES ===")
for key, value in ds.attrs.items():
    print(f"{key}: {value}")