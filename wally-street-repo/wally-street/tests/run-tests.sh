#!/usr/bin/env bash
# Runs the browser tests against dist/ and build/site (run scripts/build.sh first)
set -uo pipefail
cd "$(dirname "$0")/.."
mkdir -p build/frame build/shots
echo '<!doctype html><iframe src="http://127.0.0.1:8762/wally-street.html" width="400" height="700"></iframe>' > build/frame/index.html
python3 -m http.server 8771 -d build/site >/dev/null 2>&1 & S1=$!
python3 -m http.server 8762 -d dist >/dev/null 2>&1 & S2=$!
python3 -m http.server 8763 -d build/frame >/dev/null 2>&1 & S3=$!
trap 'kill $S1 $S2 $S3 2>/dev/null' EXIT
sleep 1
cd build
fail=0
for t in walkthrough all-versions downloads accounts-security lessons-tutor website-pages website-offline framing-guard; do
  echo "== $t"
  if ! timeout 400 node ../tests/$t.test.js; then echo "!! $t failed"; fail=1; fi
done
# privacy-guards includes a 30-minute idle check driven by a fake clock; it takes about 2 minutes
echo "== privacy-guards"; timeout 400 node ../tests/privacy-guards.test.js || { echo "!! privacy-guards failed"; fail=1; }
exit $fail
