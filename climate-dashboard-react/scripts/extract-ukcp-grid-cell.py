from __future__ import annotations

import argparse
import re
from pathlib import Path

import numpy as np
import pandas as pd
import xarray as xr


MEMBER_PATTERN = re.compile(
    r"_uk_5km_(\d+)_day_(\d{8})-(\d{8})\.nc$"
)


def decode_text(value: object) -> str:
    """Convert NetCDF byte strings or other values to clean text."""
    if isinstance(value, bytes):
        return value.decode("utf-8").strip()
    return str(value).strip()


def build_output_filename(input_file: Path) -> str:
    """
    Build a consistent CSV filename from the UKCP NetCDF filename.

    Example:
    tasmax_rcp85_land-cpm_uk_5km_04_day_20701201-20801130.nc

    becomes:
    cabilla-tasmax-member-04-2070-2080.csv
    """
    match = MEMBER_PATTERN.search(input_file.name)

    if not match:
        raise ValueError(
            f"Could not parse ensemble member and dates from filename: "
            f"{input_file.name}"
        )

    member, start_date, end_date = match.groups()

    start_year = start_date[:4]
    end_year = end_date[:4]

    return (
        f"cabilla-tasmax-member-{member}-"
        f"{start_year}-{end_year}.csv"
    )


def extract_file(
    input_file: Path,
    output_file: Path,
    easting: float,
    northing: float,
) -> dict[str, object]:
    """Extract the nearest UKCP grid cell from one NetCDF file."""

    print(f"\nOpening: {input_file}")

    with xr.open_dataset(input_file) as ds:
        required = {
            "tasmax",
            "projection_x_coordinate",
            "projection_y_coordinate",
            "yyyymmdd",
            "year",
            "month_number",
            "ensemble_member",
        }

        calendar = ds["time"].encoding.get(
            "calendar",
            ds["time"].attrs.get("calendar", "unknown"),
        )

        missing = required.difference(ds.variables)

        if missing:
            raise KeyError(
                "Dataset is missing required variables: "
                + ", ".join(sorted(missing))
            )

        point = ds.sel(
            projection_x_coordinate=easting,
            projection_y_coordinate=northing,
            method="nearest",
        )

        selected_easting = float(
            point.projection_x_coordinate.values
        )
        selected_northing = float(
            point.projection_y_coordinate.values
        )
        latitude = float(point.latitude.values)
        longitude = float(point.longitude.values)

        distance = float(
            np.hypot(
                selected_easting - easting,
                selected_northing - northing,
            )
        )

        tasmax = point["tasmax"].squeeze(drop=True)

        units = str(tasmax.attrs.get("units", "")).strip()
        values = tasmax.values.astype(float)

        ensemble_member = int(
            point["ensemble_member"].values.item()
        )

        if units.lower() in {"k", "kelvin"}:
            values = values - 273.15
            output_units = "°C"
        else:
            output_units = units or "°C"

        dates = [
            decode_text(value)
            for value in point["yyyymmdd"].values
        ]

        rows = pd.DataFrame(
            {
                "Date": dates,
                "Year": point["year"].values.astype(int),
                "Month": point["month_number"].values.astype(int),
                "Tmax_C": values,
                "EnsembleMember": ensemble_member,
            }
        )

        rows = rows.dropna(subset=["Tmax_C"])

        if rows.empty:
            raise ValueError(
                f"No valid tasmax rows were extracted from {input_file}"
            )

        output_file.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        rows.to_csv(output_file, index=False)

        print(f"Member:            {ensemble_member:02d}")
        print(f"Calendar:           {calendar}")
        print(f"Rows written:       {len(rows)}")
        print(f"Selected cell:      {selected_easting}, {selected_northing}")
        print(f"Distance to centre: {distance:.1f} metres")
        print(f"Latitude:           {latitude:.6f}")
        print(f"Longitude:          {longitude:.6f}")
        print(f"Temperature units:  {output_units}")
        print(f"First date:         {rows.iloc[0]['Date']}")
        print(f"Last date:          {rows.iloc[-1]['Date']}")
        print(f"Minimum Tmax:       {rows['Tmax_C'].min():.2f}°C")
        print(f"Maximum Tmax:       {rows['Tmax_C'].max():.2f}°C")
        print(f"Saved to:           {output_file}")

        return {
            "member": ensemble_member,
            "rows": len(rows),
            "calendar": calendar,
            "selected_easting": selected_easting,
            "selected_northing": selected_northing,
            "latitude": latitude,
            "longitude": longitude,
            "distance": distance,
            "output_file": output_file,
        }


def main() -> None:
    parser = argparse.ArgumentParser(
        description=(
            "Extract daily UKCP tasmax values for the nearest grid cell "
            "from one NetCDF file or every matching file in a directory."
        )
    )

    parser.add_argument(
        "input_path",
        type=Path,
        help="Path to a UKCP NetCDF file or a directory containing NetCDF files.",
    )

    parser.add_argument(
        "output_path",
        type=Path,
        help="Path to an output CSV or an output directory.",
    )

    parser.add_argument(
        "--easting",
        type=float,
        default=213750,
        help="British National Grid easting. Default: 213750",
    )

    parser.add_argument(
        "--northing",
        type=float,
        default=71250,
        help="British National Grid northing. Default: 71250",
    )

    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Overwrite existing CSV files.",
    )

    args = parser.parse_args()

    if not args.input_path.exists():
        raise FileNotFoundError(
            f"Input path not found: {args.input_path}"
        )

    if args.input_path.is_file():
        if args.output_path.suffix.lower() != ".csv":
            raise ValueError(
                "When the input is one file, the output must be a CSV path."
            )

        extract_file(
            input_file=args.input_path,
            output_file=args.output_path,
            easting=args.easting,
            northing=args.northing,
        )

        return

    input_files = sorted(
        args.input_path.glob(
            "tasmax_rcp85_land-cpm_uk_5km_*_day_*.nc"
        )
    )

    if not input_files:
        raise FileNotFoundError(
            f"No matching UKCP tasmax NetCDF files found in "
            f"{args.input_path}"
        )

    args.output_path.mkdir(
        parents=True,
        exist_ok=True,
    )

    completed: list[dict[str, object]] = []
    skipped = 0
    failed: list[tuple[Path, Exception]] = []

    print(f"Files found: {len(input_files)}")

    for input_file in input_files:
        output_file = (
            args.output_path
            / build_output_filename(input_file)
        )

        if output_file.exists() and not args.overwrite:
            print(
                f"\nSkipping {input_file.name} — "
                f"{output_file.name} already exists."
            )
            skipped += 1
            continue

        try:
            result = extract_file(
                input_file=input_file,
                output_file=output_file,
                easting=args.easting,
                northing=args.northing,
            )

            completed.append(result)

        except Exception as error:
            print(
                f"\nERROR processing {input_file.name}: {error}"
            )
            failed.append((input_file, error))

    print("\n=== BATCH SUMMARY ===")
    print(f"Files found:      {len(input_files)}")
    print(f"Files processed:  {len(completed)}")
    print(f"Files skipped:    {skipped}")
    print(f"Files failed:     {len(failed)}")

    if completed:
        members = sorted(
            int(result["member"])
            for result in completed
        )

        print(
            "Members processed: "
            + ", ".join(f"{member:02d}" for member in members)
        )

    if failed:
        print("\nFailed files:")

        for input_file, error in failed:
            print(f"- {input_file.name}: {error}")

        raise RuntimeError(
            f"{len(failed)} NetCDF file(s) failed to process."
        )


if __name__ == "__main__":
    main()