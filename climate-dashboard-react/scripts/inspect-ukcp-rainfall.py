import xarray as xr

FILE = "data/ukcp18/rainfall/raw/pr_rcp85_land-cpm_uk_5km_01_day_20301201-20401130.nc"

ds = xr.open_dataset(FILE)

print(ds)

print("\nDATA VARIABLES:")
print(ds.data_vars)

print("\nCOORDINATES:")
print(ds.coords)

if "pr" in ds:
    print("\nPR VARIABLE:")
    print(ds["pr"])

    print("\nPR ATTRIBUTES:")
    print(ds["pr"].attrs)

    print("\nPR UNITS:")
    print(ds["pr"].attrs.get("units"))