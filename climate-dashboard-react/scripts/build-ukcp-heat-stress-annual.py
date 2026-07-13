from __future__ import annotations

import argparse
import re
from pathlib import Path

import pandas as pd


THRESHOLDS = {
    "DaysAbove25C": 25.0,
    "DaysAbove28C": 28.0,
    "DaysAbove30C": 30.0,
    "DaysAbove32C": 32.0,
}

INPUT_PATTERN = re.compile(
    r"cabilla-tasmax-member-(\d+)-(\d{4})-(\d{4})\.csv$"
)


def build_output_filename(input_file: Path) -> str:
    """
    Example:

    cabilla-tasmax-member-04-2070-2080.csv

    becomes:

    cabilla-heat-stress-member-04-2071-2080.csv
    """
    match = INPUT_PATTERN.search(input_file.name)

    if not match:
        raise ValueError(
            "Could not parse ensemble member and years from filename: "
            f"{input_file.name}"
        )

    member, start_year, end_year = match.groups()

    first_model_year = int(start_year) + 1

    return (
        f"cabilla-heat-stress-member-{member}-"
        f"{first_model_year}-{end_year}.csv"
    )


def process_file(
    input_file: Path,
    output_file: Path,
) -> dict[str, object]:
    """Calculate annual threshold counts for one extracted UKCP CSV."""

    print(f"\nReading: {input_file}")

    rows = pd.read_csv(
        input_file,
        dtype={"Date": str},
    )

    required_columns = {
        "Date",
        "Year",
        "Month",
        "Tmax_C",
        "EnsembleMember",
    }

    missing_columns = required_columns.difference(rows.columns)

    if missing_columns:
        raise KeyError(
            "Input CSV is missing required columns: "
            + ", ".join(sorted(missing_columns))
        )

    for column in ["Year", "Month", "Tmax_C", "EnsembleMember"]:
        rows[column] = pd.to_numeric(
            rows[column],
            errors="coerce",
        )

    invalid_rows = rows[
        rows[
            ["Year", "Month", "Tmax_C", "EnsembleMember"]
        ].isna().any(axis=1)
    ]

    if not invalid_rows.empty:
        raise ValueError(
            f"Found {len(invalid_rows)} rows with missing or invalid values."
        )

    rows["Year"] = rows["Year"].astype(int)
    rows["Month"] = rows["Month"].astype(int)
    rows["EnsembleMember"] = rows["EnsembleMember"].astype(int)

    if not rows["Month"].between(1, 12).all():
        raise ValueError("Month values must be between 1 and 12.")

    duplicate_dates = rows.duplicated(
        subset=["Date", "EnsembleMember"],
        keep=False,
    )

    if duplicate_dates.any():
        raise ValueError(
            f"Found {duplicate_dates.sum()} duplicate date/member rows."
        )

    ensemble_members = rows["EnsembleMember"].unique()

    if len(ensemble_members) != 1:
        raise ValueError(
            "Expected exactly one ensemble member per input file, found: "
            + ", ".join(str(value) for value in ensemble_members)
        )

    ensemble_member = int(ensemble_members[0])

    # UKCP files run from 1 December to 30 November.
    #
    # December 2070 through November 2071 is labelled ModelYear 2071.
    rows["ModelYear"] = rows["Year"]
    rows.loc[rows["Month"] == 12, "ModelYear"] += 1

    annual_records: list[dict[str, int | float]] = []

    grouped = rows.groupby(
        "ModelYear",
        sort=True,
    )

    for model_year, year_rows in grouped:
        days_in_year = len(year_rows)

        if days_in_year not in {360, 365, 366}:
            raise ValueError(
                f"Unexpected year length for member {ensemble_member:02d}, "
                f"model year {model_year}: {days_in_year} days"
            )

        record: dict[str, int | float] = {
            "ModelYear": int(model_year),
            "EnsembleMember": ensemble_member,
            "DaysInModelYear": days_in_year,
        }

        for output_name, threshold in THRESHOLDS.items():
            raw_count = int(
                (year_rows["Tmax_C"] > threshold).sum()
            )

            normalised_count = (
                raw_count * 365.0 / days_in_year
            )

            record[output_name] = raw_count
            record[f"{output_name}_365"] = round(
                normalised_count,
                2,
            )

        annual_records.append(record)

    annual = pd.DataFrame(annual_records)

    if annual.empty:
        raise ValueError("No annual records were produced.")

    annual = annual.sort_values(
        "ModelYear"
    ).reset_index(drop=True)

    output_file.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    annual.to_csv(
        output_file,
        index=False,
    )

    print("\n=== ANNUAL THRESHOLD COUNTS ===")
    print(annual.to_string(index=False))

    print("\n=== SUMMARY ===")
    print(f"Member:             {ensemble_member:02d}")
    print(f"Input rows:         {len(rows)}")
    print(f"Annual records:     {len(annual)}")
    print(
        "Model-year range:   "
        f"{annual['ModelYear'].min()}–{annual['ModelYear'].max()}"
    )
    print(
        "Year lengths:       "
        + ", ".join(
            str(value)
            for value in sorted(
                annual["DaysInModelYear"].unique()
            )
        )
    )
    print(f"Saved to:           {output_file}")

    return {
        "member": ensemble_member,
        "annual_records": len(annual),
        "output_file": output_file,
    }


def main() -> None:
    parser = argparse.ArgumentParser(
        description=(
            "Calculate annual UKCP heat-stress threshold counts from one "
            "extracted daily CSV or every matching CSV in a directory."
        )
    )

    parser.add_argument(
        "input_path",
        type=Path,
        help=(
            "Path to one extracted UKCP daily CSV or a directory "
            "containing member CSVs."
        ),
    )

    parser.add_argument(
        "output_path",
        type=Path,
        help=(
            "Path to one annual output CSV or an output directory."
        ),
    )

    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Overwrite existing annual CSV files.",
    )

    args = parser.parse_args()

    if not args.input_path.exists():
        raise FileNotFoundError(
            f"Input path not found: {args.input_path}"
        )

    # Single-file mode
    if args.input_path.is_file():
        if args.output_path.suffix.lower() != ".csv":
            raise ValueError(
                "When the input is one file, the output must be a CSV path."
            )

        process_file(
            input_file=args.input_path,
            output_file=args.output_path,
        )

        return

    # Batch mode
    input_files = sorted(
        args.input_path.glob(
            "cabilla-tasmax-member-*-*.csv"
        )
    )

    if not input_files:
        raise FileNotFoundError(
            "No matching Cabilla UKCP member CSV files found in "
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
            result = process_file(
                input_file=input_file,
                output_file=output_file,
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
            + ", ".join(
                f"{member:02d}"
                for member in members
            )
        )

    if failed:
        print("\nFailed files:")

        for input_file, error in failed:
            print(f"- {input_file.name}: {error}")

        raise RuntimeError(
            f"{len(failed)} CSV file(s) failed to process."
        )


if __name__ == "__main__":
    main()