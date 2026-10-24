#!/usr/bin/env bash
# Builds every version of Wally Street from src/app.html into dist/
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p dist build
cp src/app.html dist/stockgpt.html
cp src/app.html dist/stockgpt-share.html
cp src/laptop-layout.html build/laptop-old.html
cp src/favicon.svg build/favicon.svg
mkdir -p build/sync-server && cp sync-server/worker.mjs build/sync-server/worker.mjs
python3 scripts/build_variants.py      # laptop file, JavaScript file, index pages
python3 scripts/build_download.py      # wally-street.html (download, with CSP and anti-framing)
rm -rf build/site && mkdir -p build/site
node scripts/make_assets.js            # icons, social image, page data (needs Playwright)
python3 scripts/build_site.py          # website kit in build/site
# docs/ is what GitHub Pages publishes
rm -rf docs && cp -r build/site docs && rm -f docs/README.txt docs/ANALYTICS-optional.txt docs/SYNC-optional.txt
echo "Built dist/ and docs/"
