# Wally Street

A gamified stock market learning app: short lessons with streaks and Wally coins, a friendly tutor, and a practice exchange with paper money. The whole app is one HTML file with no build-time dependencies. It runs without a server; an optional small sync server (in `sync-server/`) lets players log in on any device.

**Version 4.3.0** · Educational only, not financial advice.

**Play it:** open this repository's GitHub Pages site (the link is under **Deployments** on the right of the repository page), or download `dist/wally-street.html` and open it in any browser.

**Publishing your own copy:** see [HOW-TO-PUBLISH.md](HOW-TO-PUBLISH.md).

## What's inside

| Area | What it does |
|---|---|
| **Learn** | A winding lesson path, one round button per lesson, with the next one marked Start. 64 lessons in 16 units: 14 units over 6 levels, a trading-strategies unit and an India essentials unit (SIPs, mutual funds, demat accounts, tax on gains, PPF, EPF and NPS, IPOs, gold, circuit limits). Every unit ends with a revision that mixes in questions from all earlier units. Wally coins (golden coins with Wally on them, formerly XP), hearts you can earn back with a 5-question practice or buy for 100 coins, a placement test, a mistakes review with spaced repetition, missions, a daily goal, streak freezes, 20 badges and level certificates |
| **Ask** | An offline tutor (built-in notes, 50 listed questions, intent answers for common beginner questions), plus optional online answers on links that offer them. Guards block secrets such as card numbers, IDs and passwords |
| **Practice** | A paper exchange with US, China, Japan and India markets, rupee or dollar display, fees, simulated dividends, limit and stop-loss orders, price alerts, a watchlist, trade history with stats, and a guided first trade |
| **Markets** | Top 50 performers, a weekly news snapshot with a news quiz, and stock history stories |
| **Tools** | SIP time machine, compound interest, rule of 72, Indian capital-gains tax estimate, glossary (100+ terms), crash replays (1987, 2000, 2008, 2020) |
| **Social** | Share cards and certificates made on the device, invite codes, classroom codes with a local leaderboard |
| **Help** | Site search (press /), an expandable FAQ, a floating help and contact button, and a general problem report form |
| **Accounts and safety** | Encrypted accounts (AES-GCM with a 600,000-round PBKDF2 key), sync across devices with a username and password (through the optional sync server, or private cloud storage on the accounts link), sanitised imports, rate limits, idle sign-out, account deletion, an age check (13+), Terms and Privacy pages |

## Folder layout

```
docs/                   The website GitHub Pages publishes (the game, FAQ, 404, privacy and terms pages, icons, sitemap, offline support)
dist/                   Other built versions of the game, ready to use
src/app.html            The source of the app (everything in one file)
src/laptop-layout.html  Wider layout and keyboard shortcuts used for the laptop build
src/favicon.svg         App icon
scripts/                Build scripts
tests/                  Browser tests (Playwright)
sync-server/            Optional sync server (a free Cloudflare Worker) for logging in on any device
.github/workflows/      Publishes docs/ to GitHub Pages on every push to main
```

## Built files (`dist/`)

| File | Use |
|---|---|
| `wally-street.html` | Download version: open it in any browser. Adds a Content Security Policy and refuses to run inside another site |
| `stockgpt-share.html` / `stockgpt.html` | Same app without the extra policy, for shared links |
| `stockgpt-laptop.html` | Wider layout with keyboard shortcuts |
| `stockgpt.js` + `index.html` | The app as one JavaScript file plus a tiny page that loads it |
| `stockgpt-index-artifact.html` | The JavaScript version inlined into one page |

The `stockgpt` file names are kept so older links and saved progress (stored under `stockgpt:` keys in the browser) keep working.

## Build

Needs Python 3 with Pillow, Node 18+, `zip` and Playwright (only for making the icons and running tests).

```bash
npm install            # installs Playwright
npx playwright install chromium
npm run build          # writes dist/ and docs/
```

Edit `src/app.html`, then run the build. The same source always gives the same HTML and JavaScript files.

## Test

```bash
npm test
```

This starts three small local web servers (ports 8762, 8763 and 8771) and runs:

- `walkthrough`: the full first-run journey on a phone and a laptop (age check, Terms, quick setup, first lesson, review, tutor, practice orders and alerts, news quiz, tools, replays, badges, share cards, settings, placement test, India unit, reload)
- `all-versions`: every built file, the under-13 block, a hostile backup full of script tags, and app routes
- `downloads`: saving pictures and backups with and without the host's download prompt
- `website-basics`: search, FAQ, help button, confirmations, password toggle, skip link, back to top, progress bar, printing, campaign links, hover states and loading animations
- `accounts-security`: weak and strong passwords, auto log-in, wrong passwords, malicious backups, legacy account upgrade, private cloud storage
- `privacy-guards`: secret detection in chat, password-change rate limits, account deletion, idle sign-out
- `lessons-tutor`: lesson question mix, hearts, practice markets, news and tutor answers
- `revisions`: the 64 lessons, the 16 units and the revision at the end of each unit, including the mix of questions from earlier units
- `learn-path`: the winding lesson path (round nodes that zig-zag, the Start bubble on the next lesson, revisions on the path, no sideways scrolling even at 320 px) and no emoji faces on right or wrong answers
- `sync`: sync across devices against a local copy of the sync server (sign up on one device, log in on another, progress both ways, wrong passwords, lock-out after 10 wrong tries, a password change that signs other devices out, account deletion, and a check that the server holds nothing readable)
- `hearts`: earning a heart back with a practice round, buying hearts with Wally coins, and the out-of-hearts screens
- `website-pages`, `website-offline`, `framing-guard`: the website kit, its service worker, and the anti-framing guard

To use an existing Chromium instead of the downloaded one, set `CHROMIUM=/path/to/chromium`.

## Publishing the website

See [HOW-TO-PUBLISH.md](HOW-TO-PUBLISH.md). The workflow in `.github/workflows/publish.yml` copies `docs/`, replaces the placeholder address `https://your-website.example` with your real GitHub Pages address, and publishes it. To host somewhere else (Netlify, Cloudflare Pages), upload `docs/` and replace the placeholder yourself.

## Sync across devices

Players create an account with a username and password, then log in with the same details on another phone or laptop and carry on where they left off. On the website and the download file this needs the small sync server in [`sync-server/`](sync-server/README.md), which runs free on Cloudflare. Set it up once, put its address in the `WALLY_SYNC_URL` repository variable, and the publish workflow switches sync on. Without it, accounts stay on each device.

Progress is encrypted with the player's password on their device before it is uploaded. The server only ever sees the encrypted save and a hash of a key made from the password, so it cannot read anyone's progress, and a forgotten password cannot be recovered.

## Things that need a server

These are not in the app because a single file cannot do them safely: a real friends leaderboard, rewarding the person who invited a friend, push reminders, live price feeds, and site-wide analytics (an optional Plausible setup is described in HOW-TO-PUBLISH.md).

## License

All rights reserved. Using the app is covered by the end-user license agreement (EULA) in section 12 of the Terms and Conditions (Terms version 1.3). No open-source license has been chosen for this code.

