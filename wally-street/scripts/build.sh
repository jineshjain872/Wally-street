#!/usr/bin/env bash
# Builds every version of Wally Street from src/app.html into dist/
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p dist build
cp src/app.html dist/stockgpt.html
cp src/app.html dist/stockgpt-share.html
cp src/laptop-layout.html build/laptop-old.html
cp src/favicon.svg build/favicon.svg
python3 scripts/build_variants.py      # laptop file, JavaScript file, index pages
python3 scripts/build_download.py      # wally-street.html (download, with CSP and anti-framing)
rm -rf build/site && mkdir -p build/site
node scripts/make_assets.js            # icons, social image, page data (needs Playwright)
python3 scripts/build_site.py          # website kit in build/site
rm -f dist/wally-street-website.zip
(cd build/site && zip -qr ../../dist/wally-street-website.zip .)
echo "Built: $(ls dist | tr '\n' ' ')"
