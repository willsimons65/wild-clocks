import xarray as xr

ds = xr.open_dataset(
    "src/data/haduk/raw/rainfall_hadukgrid_uk_1km_day_19620101-19620131.nc"
)

print(ds)