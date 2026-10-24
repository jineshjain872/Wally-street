# Changelog

## 4.3.0 (24 October 2026)

**New**
- Sync across devices: create an account with a username and password, then log in with the same details on any phone or laptop and carry on where you left off. Lessons, Wally coins, hearts, streaks and the practice portfolio all come along. On the website and the download file this works once the sync server in `sync-server/` is set up (a free Cloudflare Worker); the publish workflow switches it on from the `WALLY_SYNC_URL` repository variable.
- Your progress is encrypted with your password on your device before it is uploaded (AES-GCM, 600,000-round PBKDF2). The app proves who you are with a second key made from your password, and the server keeps only a hash of that key, so it never sees your password or your progress.
- After 10 wrong passwords an account is locked for 15 minutes.
- Changing your password on one device signs your other devices out and asks them to log in with the new one. If the sync server can't be reached, the password is left as it was.
- Deleting your account also deletes the copy on the sync server.
- The Privacy Policy and the FAQ explain what the sync server keeps.

**Changed**
- The Learn page is the winding lesson path again, with round buttons, the Start bubble on your next lesson and each unit's revision on the path. The course outline from 4.2.1 is gone.
- Right and wrong answers still show no emoji faces; the sounds, the mascot's hop or shake, the colours and the confetti stay.
- The header fits on 320-pixel-wide phones without sideways scrolling.
- Away from the accounts link and without a sync server, the sign-in screen says plainly that accounts are saved on this device only.

## 4.2.1 (23 October 2026)

**Changed**
- The Learn page is now a course outline instead of a winding path of round buttons. Each unit is a card with its tutorial video, numbered lessons (1.1, 1.2 and so on, S1 to S6 for strategies, IN1 to IN8 for India), and its review at the end. Each row shows whether the lesson is done, ready to start or locked. Finished and locked units are closed and the unit you are on opens by itself; tap any unit's header to open or close it. Levels show as headings with a progress bar.
- Right and wrong answers no longer show emoji faces. The sounds, the mascot's hop or shake, the colours and the confetti stay.

## 4.2.0 (22 October 2026)

**New**
- 64 lessons, up from 38: 22 new lessons inside the 14 core units and 4 more in India essentials. New topics include saving vs investing, how a stock exchange works, reading a stock quote, the Nifty 50 and Sensex, goals and time horizon, starting early, trading hours and T+1 settlement, spotting scams, the cash flow statement, results and annual reports, fund factsheets, growth vs IDCW, comparing with peers, who runs the market, position sizing, bonus and rights issues, core and satellite, inflation and real returns, management and governance, cyclical and defensive businesses, futures and leverage, a trading journal, PPF/EPF/NPS, IPOs in India, gold in India, and circuit limits and price bands.
- A revision at the end of every unit (16 in all), instead of one after every 4 lessons. Each one recaps its unit and mixes one question from every lesson in it with questions from up to 8 earlier units, a different mix each time (10 to 14 questions).
- Hearts: as soon as you lose one, a 5-question practice earns it back (wrong answers there cost nothing). You can repeat it until your hearts are full.
- Buy hearts with Wally coins: 100 coins for 1 heart, from the hearts panel (tap the hearts at the top), the Learn page, the end of a lesson, or the out-of-hearts screen. Buying a heart in the middle of a lesson lets you carry on.

**Changed**
- The practice round now gives 1 heart per round instead of refilling all 5, so earning and buying hearts stay worth it. All 5 still come back at 12:00 AM IST.
- New lessons get ids after the old ones, so saved progress, missions and class codes keep working. Returning players see the new lessons as their next steps.
- The FAQ has a new answer on how many lessons there are, and the hearts answer explains earning and buying hearts.

## 4.1.0 (21 October 2026)

**New**
- Terms 1.3 (22 October 2026): section 12 is now the end-user license agreement (EULA), covering ownership, the license, what you may and may not do with copies, public source code, updates, virtual items, third-party components, app stores and when the license ends. Everyone who agreed to an earlier version is asked to agree again, with a short note explaining why.
- XP is now **Wally coins**: golden coins with Wally's silhouette, drawn as an SVG. The coins shine, fly into the counter when you earn them (from wherever you tapped), burst out of the end-of-lesson screen with sparkles and a coin sound, and the counter counts up or shakes when you spend. Motion is reduced when the device asks for it. Saved data still uses the same field, so nobody loses their balance.
- Terms 1.2 only rename XP to Wally coins, so agreeing to 1.1 still counts.
- Site search for lessons, glossary terms, stocks, the Top 50, news, tools, pages and FAQ answers. Open it from the search bar on Learn and Markets, the help button, or by pressing / (or Ctrl+K) on a keyboard. Routes: `#/search`, `#/faq`, `#/help`.
- An expandable FAQ with 16 answers, in the app and as `faq.html` on the website.
- A floating help and contact button on Learn and Markets, with search, the FAQ, Ask Wally, a general "Report a problem" form and the contact details.
- Confirmation dialogs before deleting your account, resetting Practice, restoring a backup, deleting usage stats, converting all XP and buying a streak freeze.
- Show and hide buttons on every password box.
- A back-to-top button and a scroll progress bar.
- Loading animations: a spinner on the loading screen and while signing in, animated "thinking" dots in the tutor, and a spinner while pictures are drawn.
- A "Skip to main content" link for keyboard users, in the app and on the website pages.
- A print stylesheet: the open page or document prints on its own, in light colours, with every FAQ answer expanded.
- Campaign link (UTM) tracking: `utm_source`, `utm_medium` and `utm_campaign` are counted with the private on-device stats (only after "Accept all") and removed from the address bar.
- Hover states on the phone layout when used with a mouse (the laptop layout already had them).
- "Last updated" dates in Settings, the FAQ, What's new and the website footers.
- Practice: a profit and loss box under Sell on every chart, showing the gain or loss on the shares you hold now (amount and %), what you paid, what they are worth, and profit already taken from earlier sales.
- Only one notice (toast) shows at a time, so they no longer overlap.
- A revision lesson after every 4 lessons (was every 6), plus an India revision after the India unit. Each revision recaps its 4 lessons and asks 10 questions. The placement test also completes the revisions inside Level 1.
- The "More levels ahead" card now says "These lessons were not certified by a professional."
- The end of the Learn page no longer hides behind the sticky lesson button on phones.
- Practice: two charts sit side by side again on phones (4.0 showed one at a time with swiping). A third chart spans the full width underneath. Shorter market labels fit the narrower charts.
- Practice: the US market is open around the clock, every day. The status shows whether the real US market is open (pre-market, regular hours, after-hours or closed). China, Japan and India still follow their real hours.

**Changed**
- Privacy Policy 1.1 mentions campaign tags.
- No text names the tools used to make or host the app. The tutor's optional online answers and the hosting platform are described in general terms in the Privacy Policy.

**Already there, so not changed:** dark mode toggle, cookie banner, mobile menu (tab bar), sticky header, copy buttons (invite and class codes), form success states (welcome page, saved messages) and form error messages.

## 4.0.0 (20 October 2026)

**Start and navigation**
- Guest-first start: age check, a one-screen Terms summary (full text one tap away), then a 3-question quick setup. No account needed to begin.
- Four tabs: Learn, Ask, Practice, Markets (News and Top 50 share the Markets tab; History lives in Learn).
- The cookie and storage choice appears after the first lesson instead of on the first screen, above the tab bar.
- "What's new" screen for returning learners.

**Learning**
- "What is a stock?" comes first; every strategy lesson has 10 questions.
- New unit: India essentials (SIPs, mutual funds in India, demat and trading accounts, tax on gains).
- Placement test, mistakes review with spaced repetition (reviews give no XP), 3 missions, daily goal, streak freezes, weekly challenge.
- 20 badges, level certificates and share cards made on the device.
- Sounds, confetti and mascot reactions (sounds can be turned off).
- Report a mistake on any question; glossary link inside every lesson; US market hours explained.

**Tutor**
- Instant answers for common beginner questions (getting started, SIPs, Nifty, Sensex, demat, direct vs regular funds, tax, F&O risk, emergency funds).
- Related-question chips; plain numbers no longer trigger unrelated answers.

**Practice**
- Rupee or dollar display, 0.1% fees (at least $0.05), simulated dividends, realised profit and loss.
- Limit buy, limit sell and stop-loss orders, price alerts, watchlist, trade history and stats, guided first trade.
- Light Practice screen by default; one chart at a time with swipe on phones.
- Updated Indian prices (15 October 2026 close) and five more Indian stocks.

**Markets and tools**
- News for 13 to 16 October 2026 with a news quiz; freshness labels on Top 50.
- SIP time machine, compound interest, rule of 72, Indian capital-gains tax estimate, crash replays.

**Social and settings**
- Invite codes, classroom codes with a local leaderboard.
- Text size, high contrast, sounds, Practice theme, install button.

**Saving files**
- Pictures, certificates and backups save through the host's download prompt on shared links, and as normal downloads everywhere else.

**Website kit**
- Offline support and installable app (service worker), optional Plausible setup guide.

**Fixes**
- Crash replay showed money 100 times too large.
- Tapping inside the first-trade guide could break the Practice screen.

## 3.x
- Two security passes: stronger account encryption (600,000-round PBKDF2 with random salts), private cloud storage, a browser-vault session key, sanitised imports, chat guards for secrets, rate limits, idle sign-out, account deletion, a Content Security Policy and anti-framing guard for the download.
- Age check (13+), Terms v1.1, website checklist (routes, 404, page titles, privacy page, cookie choice, private stats, contact setting), website kit.
- Reliability layer and System status panel, 50 offline questions with an "Available questions" list.

## 1.x to 2.x
- Started as "stockgpt": tutor chatbot, Duolingo-style path, levels, news, Top 50, practice trading, mascots and hearts. Then laptop and JavaScript versions, passwords, tutorial videos, Terms, and the rename to Wally Street.
