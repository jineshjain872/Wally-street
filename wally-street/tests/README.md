# Tests

Run `npm test` from the project folder after `npm run build`. Each test prints a JSON report; the runner stops with a non-zero exit code if a test crashes.

The tests are written as journeys rather than unit tests, because the app is one page: they click through the app in Chromium, read its state, and save screenshots to `build/shots/`.

Several tests check facts by reading values out of the report (for example `"pwn": 0` means no injected script ran). Read the JSON after a run when you change security code.

Some tests stop with an error message as soon as a check fails, instead of only printing a report: `revisions` (64 lessons, 16 units, a revision at the end of each unit), `hearts` (earning and buying hearts), `learn-path` (the winding lesson path, no emoji faces on answers) and `sync` (sync across devices).

`sync` starts the sync server from `sync-server/dev-server.mjs` on port 8788, with the saves kept in memory, and points a test copy of `dist/wally-street.html` at it.
