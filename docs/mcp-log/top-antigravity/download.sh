#!/bin/bash
TOKEN="${FIGMA_ACCESS_TOKEN:?Set FIGMA_ACCESS_TOKEN env var}"
FILE_KEY="gaau2jhfNSbjm3ui50Du74"
OUT_DIR="src/img/top-antigravity"

mkdir -p "$OUT_DIR"

echo "Downloading PNGs..."
PNG_IDS="2071:4306,2071:3784,2071:3785,2071:3828,2071:3837,2071:3846,2071:3855,2071:3863,2071:3870,2071:3879,2071:3884"

RESPONSE=$(curl -sS -H "X-Figma-Token: $TOKEN" "https://api.figma.com/v1/images/$FILE_KEY?ids=$PNG_IDS&format=png&scale=2")

declare -A PNG_MAP=(
  ["2071:4306"]="fv-bg"
  ["2071:3784"]="fv-cert1"
  ["2071:3785"]="fv-cert2"
  ["2071:3828"]="concept-bg"
  ["2071:3837"]="service-bg"
  ["2071:3846"]="service-item1"
  ["2071:3855"]="service-item2"
  ["2071:3863"]="service-item3"
  ["2071:3870"]="service-item4"
  ["2071:3879"]="service-item5"
  ["2071:3884"]="service-item6"
)

for ID in "${!PNG_MAP[@]}"; do
  FILENAME="${PNG_MAP[$ID]}"
  URL=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['images'].get('$ID', ''))")
  if [ -n "$URL" ]; then
    echo "Downloading $FILENAME.png from $URL"
    curl -sL "$URL" -o "$OUT_DIR/$FILENAME.png"
  else
    echo "Failed to get URL for $FILENAME ($ID)"
  fi
done

echo "Downloading SVGs..."
SVG_IDS="2071:3799,2071:3826"
RESPONSE_SVG=$(curl -sS -H "X-Figma-Token: $TOKEN" "https://api.figma.com/v1/images/$FILE_KEY?ids=$SVG_IDS&format=svg")

declare -A SVG_MAP=(
  ["2071:3799"]="icon-mail"
  ["2071:3826"]="icon-arrow"
)

for ID in "${!SVG_MAP[@]}"; do
  FILENAME="${SVG_MAP[$ID]}"
  URL=$(echo "$RESPONSE_SVG" | python3 -c "import sys, json; print(json.load(sys.stdin)['images'].get('$ID', ''))")
  if [ -n "$URL" ]; then
    echo "Downloading $FILENAME.svg from $URL"
    curl -sL "$URL" -o "$OUT_DIR/$FILENAME.svg"
  else
    echo "Failed to get URL for $FILENAME ($ID)"
  fi
done

echo "Download completed."
