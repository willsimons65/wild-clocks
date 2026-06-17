import xarray as xr

INPUT = "src/data/haduk/raw/rainfall_hadukgrid_uk_1km_day_19621201-19621231.nc"
OUTPUT = "src/data/haduk/extracted/cardinham_rainfall_dec_1962.csv"

EASTING = 211500
NORTHING = 67500

ds = xr.open_dataset(INPUT)

point = ds.sel(
    projection_x_coordinate=EASTING,
    projection_y_coordinate=NORTHING,
    method="nearest",
)

df = point[["rainfall"]].to_dataframe().reset_index()

df = df[["rainfall"]]
df.columns = ["Rainfall"]

df.to_csv(OUTPUT, index=False)

print(f"Wrote {OUTPUT}")
print(df.head())