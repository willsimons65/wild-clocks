#!/bin/bash

VARIABLE="tasmax"
SCENARIO="rcp85"
START="20701201"
END="20801130"

ORIGINAL_VERSION="v20210615"
ADDITIONAL_VERSION="v20240423"

members=(
01
04
05
06
07
08
09
10
11
12
13
15
23
25
27
29
)

OUTPUT_DIR="$HOME/Documents/wild-clocks-data/cabilla/raw"

mkdir -p "$OUTPUT_DIR"

for member in "${members[@]}"
do
    filename="${VARIABLE}_${SCENARIO}_land-cpm_uk_5km_${member}_day_${START}-${END}.nc"

    if [[ -f "${OUTPUT_DIR}/${filename}" ]]; then
        echo "Skipping ${filename} — already downloaded."
        continue
    fi

    case "$member" in
      23|25|27|29)
        version="$ADDITIONAL_VERSION"
        ;;
      *)
        version="$ORIGINAL_VERSION"
        ;;
    esac

    url="https://dap.ceda.ac.uk/badc/ukcp18/data/land-cpm/uk/5km/${SCENARIO}/${member}/${VARIABLE}/day/${version}/${filename}?download=1"

    echo ""
    echo "Downloading ${filename}..."

    curl \
      -L \
      --fail \
      --show-error \
      --continue-at - \
      -H "Authorization: Bearer $CEDA_TOKEN" \
      --output "${OUTPUT_DIR}/${filename}" \
      "$url"

done

echo ""
echo "Finished."