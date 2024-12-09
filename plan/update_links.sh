#!/usr/bin/env bash

# This script updates all links in HTML files from the original phase pages
# to the corresponding detailed phase pages.
# Run it in the directory containing index.html and the phase pages.

for file in *.html; do
    sed -i 's/phase-1.html/phase-1-detailed.html/g' "$file"
    sed -i 's/phase-2.html/phase-2-detailed.html/g' "$file"
    sed -i 's/phase-3.html/phase-3-detailed.html/g' "$file"
    sed -i 's/phase-4.html/phase-4-detailed.html/g' "$file"
done

