import pandas as pd

FILE = "data/ukcp18/rainfall/extracted/cabilla_pr_all_2031-2080.csv"

df = pd.read_csv(
    FILE,
    dtype={"EnsembleMember": str}
)

print("Rows by ensemble member:")
print(
    df.groupby("EnsembleMember").size()
)

print("\nRows by ensemble member and model year:")
year_counts = (
    df.groupby(["EnsembleMember", "ModelYear"])
      .size()
      .reset_index(name="Days")
)

print(year_counts.to_string(index=False))

print("\nUnique year lengths by ensemble member:")
summary = (
    year_counts.groupby("EnsembleMember")["Days"]
    .agg(
        min_days="min",
        max_days="max",
        unique_lengths=lambda s: ", ".join(
            str(v) for v in sorted(s.unique())
        ),
    )
)

print(summary.to_string())