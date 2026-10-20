# Wally Street

A gamified stock market learning app: short lessons with streaks and XP, a friendly tutor, and a practice exchange with paper money. The whole app is one HTML file with no server and no build-time dependencies.

**Version 4.0.0** · Educational only, not financial advice.

## What's inside

| Area | What it does |
|---|---|
| **Learn** | 32 lessons in 6 levels, 6 trading-strategy lessons, revision rounds, an India essentials unit (SIPs, mutual funds, demat accounts, tax on gains), a placement test, a mistakes review with spaced repetition, missions, a daily goal, streak freezes, 20 badges and level certificates |
| **Ask** | An offline tutor (built-in notes, 50 listed questions, intent answers for common beginner questions) that can use AI when the page runs inside Claude with permission. Guards block secrets such as card numbers, IDs and passwords |
| **Practice** | A paper exchange with US, China, Japan and India markets, rupee or dollar display, fees, simulated dividends, limit and stop-loss orders, price alerts, a watchlist, trade history with stats, and a guided first trade |
| **Markets** | Top 50 performers, a weekly news snapshot with a news quiz, and stock history stories |
| **Tools** | SIP time machine, compound interest, rule of 72, Indian capital-gains tax estimate, glossary (100+ terms), crash replays (1987, 2000, 2008, 2020) |
| **Social** | Share cards and certificates made on the device, invite codes, classroom codes with a local leaderboard |
| **Accounts and safety** | Encrypted accounts (AES-GCM with a 600,000-round PBKDF2 key), private cloud storage on claude.ai, sanitised imports, rate limits, idle sign-out, account deletion, an age check (13+), Terms and Privacy pages |

## Folder layout

```
src/app.html            The source of the app (everything in one file)
src/laptop-layout.html  Wider layout and keyboard shortcuts used for the laptop build
src/favicon.svg         App icon
scripts/                Build scripts
tests/                  Browser tests (Playwright)
history/                How each version was made: patch scripts and the modules they added
dist/                   Built files, ready to use
```

## Built files (`dist/`)

| File | Use |
|---|---|
| `wally-street.html` | Download version: open it in any browser. Adds a Content Security Policy and refuses to run inside another site |
| `stockgpt-share.html` / `stockgpt.html` | Same app without the extra policy, for claude.ai artifacts |
| `stockgpt-laptop.html` | Wider layout with keyboard shortcuts |
| `stockgpt.js` + `index.html` | The app as one JavaScript file plus a tiny page that loads it |
| `stockgpt-index-artifact.html` | The JavaScript version inlined into one page |
| `wally-street-website.zip` | Website kit: the app plus 404, privacy and terms pages, icons, social image, sitemap, robots.txt, web manifest and offline support |

The `stockgpt` file names are kept so older links and saved progress (stored under `stockgpt:` keys in the browser) keep working.

## Build

Needs Python 3 with Pillow, Node 18+, `zip` and Playwright (only for making the icons and running tests).

```bash
npm install            # installs Playwright
npx playwright install chromium
npm run build          # writes everything into dist/
```

Edit `src/app.html`, then run the build. The same source always gives the same HTML and JavaScript files.

## Test

```bash
npm test
```

This starts three small local web servers (ports 8762, 8763 and 8771) and runs:

- `walkthrough`: the full first-run journey on a phone and a laptop (age check, Terms, quick setup, first lesson, review, tutor, practice orders and alerts, news quiz, tools, replays, badges, share cards, settings, placement test, India unit, reload)
- `all-versions`: every built file, the under-13 block, a hostile backup full of script tags, and app routes
- `downloads`: saving pictures and backups with and without the claude.ai download prompt
- `accounts-security`: weak and strong passwords, auto log-in, wrong passwords, malicious backups, legacy account upgrade, private cloud storage
- `privacy-guards`: secret detection in chat, password-change rate limits, account deletion, idle sign-out
- `lessons-tutor`: lesson question mix, hearts, practice markets, news and tutor answers
- `website-pages`, `website-offline`, `framing-guard`: the website kit, its service worker, and the anti-framing guard

To use an existing Chromium instead of the downloaded one, set `CHROMIUM=/path/to/chromium`.

## Publishing the website

See `README.txt` inside `wally-street-website.zip`. In short: replace `https://your-website.example` with your address, optionally set `const CONTACT=''` in `index.html`, and upload the folder to GitHub Pages, Netlify or Cloudflare Pages.

## Things that need a server

These are not in the app because a single file cannot do them safely: a real friends leaderboard, rewarding the person who invited a friend, push reminders, live price feeds, and site-wide analytics (an optional Plausible setup is described in the website kit).

## Credits

Claude AI assisted in the making of this application.
