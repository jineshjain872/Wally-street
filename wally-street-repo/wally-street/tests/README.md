# Tests

Run `npm test` from the project folder after `npm run build`. Each test prints a JSON report; the runner stops with a non-zero exit code if a test crashes.

The tests are written as journeys rather than unit tests, because the app is one page: they click through the app in Chromium, read its state, and save screenshots to `build/shots/`.

Several tests check facts by reading values out of the report (for example `"pwn": 0` means no injected script ran). Read the JSON after a run when you change security code.
