from __future__ import annotations

import argparse
from pathlib import Path

import pandas as pd

import re

NORMALISED_COLUMNS = {
    "DaysAbove25C_365": "WarmDay",
    "DaysAbove28C_365": "HeatStress",
    "DaysAbove30C_365": "HighHeatStress",
    "DaysAbove32C_365": "ExtremeHeat",
}


def summarise_member(input_file: Path) -> dict[str, float | int]:
    """Calculate the decade mean for one ensemble member."""

    rows = pd.read_csv(input_file)

    required_columns = {
        "ModelYear",
        "EnsembleMember",
        *NORMALISED_COLUMNS.keys(),
    }

    missing_columns = required_columns.difference(rows.columns)

    if missing_columns:
        raise KeyError(
            f"{input_file.name} is missing required columns: "
            + ", ".join(sorted(missing_columns))
        )

    member_values = rows["EnsembleMember"].dropna().unique()

    if len(member_values) != 1:
        raise ValueError(
            f"{input_file.name} should contain exactly one ensemble member."
        )

    ensemble_member = int(member_values[0])

    if len(rows) != 10:
        raise ValueError(
            f"{input_file.name} contains {len(rows)} annual rows; expected 10."
        )

    record: dict[str, float | int] = {
        "EnsembleMember": ensemble_member,
        "FirstModelYear": int(rows["ModelYear"].min()),
        "LastModelYear": int(rows["ModelYear"].max()),
        "YearsIncluded": len(rows),
    }

    for source_column, output_name in NORMALISED_COLUMNS.items():
        values = pd.to_numeric(
            rows[source_column],
            errors="coerce",
        )

        if values.isna().any():
            raise ValueError(
                f"{input_file.name} contains invalid values in "
                f"{source_column}."
            )

        record[f"Mean{output_name}Days"] = round(
            float(values.mean()),
            2,
        )

    return record


def build_ensemble_summary(
    member_summary: pd.DataFrame,
) -> pd.DataFrame:
    """Calculate ensemble statistics across member decade means."""

    records: list[dict[str, float | int | str]] = []

    metric_columns = {
        "WarmDay": "MeanWarmDayDays",
        "HeatStress": "MeanHeatStressDays",
        "HighHeatStress": "MeanHighHeatStressDays",
        "ExtremeHeat": "MeanExtremeHeatDays",
    }

    for metric_name, column_name in metric_columns.items():
        values = member_summary[column_name]

        records.append(
            {
                "Metric": metric_name,
                "Threshold": {
                    "WarmDay": ">25°C",
                    "HeatStress": ">28°C",
                    "HighHeatStress": ">30°C",
                    "ExtremeHeat": ">32°C",
                }[metric_name],
                "EnsembleMembers": len(values),
                "Minimum": round(float(values.min()), 2),
                "P10": round(float(values.quantile(0.10)), 2),
                "Median": round(float(values.median()), 2),
                "Mean": round(float(values.mean()), 2),
                "P90": round(float(values.quantile(0.90)), 2),
                "Maximum": round(float(values.max()), 2),
            }
        )

    return pd.DataFrame(records)


def main() -> None:
    parser = argparse.ArgumentParser(
        description=(
            "Summarise annual UKCP heat-stress counts across ensemble members."
        )
    )

    parser.add_argument(
        "input_directory",
        type=Path,
        help="Directory containing annual member heat-stress CSV files.",
    )

    parser.add_argument(
        "output_directory",
        type=Path,
        help="Directory for member and ensemble summary CSV files.",
    )

    args = parser.parse_args()

    if not args.input_directory.exists():
        raise FileNotFoundError(
            f"Input directory not found: {args.input_directory}"
        )

    input_files = sorted(
        path
        for path in args.input_directory.glob(
            "cabilla-heat-stress-member-*.csv"
        )
        if re.fullmatch(
            r"cabilla-heat-stress-member-\d{2}-\d{4}-\d{4}\.csv",
            path.name,
        )
    )

    if not input_files:
        raise FileNotFoundError(
            "No annual Cabilla heat-stress member CSVs found in "
            f"{args.input_directory}"
        )

    print(f"Files found: {len(input_files)}")

    member_records: list[dict[str, float | int]] = []
    failed: list[tuple[Path, Exception]] = []

    for input_file in input_files:
        try:
            print(f"Reading: {input_file.name}")
            member_records.append(
                summarise_member(input_file)
            )
        except Exception as error:
            print(f"ERROR: {input_file.name}: {error}")
            failed.append((input_file, error))

    if failed:
        raise RuntimeError(
            f"{len(failed)} member file(s) failed to summarise."
        )

    member_summary = pd.DataFrame(member_records)

    member_summary = member_summary.sort_values(
        ["FirstModelYear", "EnsembleMember"]
    ).reset_index(drop=True)

    args.output_directory.mkdir(
        parents=True,
        exist_ok=True,
    )

    for first_year, period_members in member_summary.groupby(
        "FirstModelYear"
    ):
        period = f"{first_year}-{first_year + 9}"

        ensemble_summary = build_ensemble_summary(
            period_members
        )

        member_output = (
            args.output_directory
            / f"cabilla-heat-stress-member-summary-{period}.csv"
        )

        ensemble_output = (
            args.output_directory
            / f"cabilla-heat-stress-ensemble-summary-{period}.csv"
        )

        period_members.to_csv(
            member_output,
            index=False,
        )

        ensemble_summary.to_csv(
            ensemble_output,
            index=False,
        )

        print(f"\nWritten {period}")
        print(f"  Member summary:   {member_output}")
        print(f"  Ensemble summary: {ensemble_output}")

    print("\n=== OUTPUT ===")
    print(
        f"Member-period summaries processed: "
        f"{len(member_summary)}"
    )


if __name__ == "__main__":
    main()