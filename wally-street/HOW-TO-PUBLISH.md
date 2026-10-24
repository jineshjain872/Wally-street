# How to publish Wally Street on GitHub

This folder is a complete GitHub repository. The website is in `docs/`, and a small workflow in `.github/workflows/` publishes it to GitHub Pages every time you upload changes.

**You need:** a free GitHub account and a computer. Uploading folders from a phone is very hard.

**Time:** about 10 minutes.

---

## 1. Create the repository

1. Sign in at [github.com](https://github.com). Click **+** (top right) → **New repository**.
2. Give it a name, for example `wally-street`. The name becomes part of your web address:
   `https://YOUR-USERNAME.github.io/wally-street/`
3. Choose **Public**. GitHub Pages is free for public repositories.
4. Leave "Add a README" **unticked**, because this folder already has one.
5. Click **Create repository**.

## 2. Turn on GitHub Pages

1. In your new repository, open **Settings** → **Pages** (in the left menu).
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. GitHub may suggest some workflows. Ignore them: the one in this folder will be used.

## 3. Upload the files

1. Unzip `wally-street-github.zip`, then open the `wally-street` folder inside it.
2. Show hidden files, so you can see the `.github` folder:
   - **Mac:** in Finder, press **Cmd + Shift + .** (full stop)
   - **Windows:** in File Explorer, choose **View → Show → Hidden items**
3. On your repository page, click **uploading an existing file** (or **Add file → Upload files**).
4. Select **everything inside** the `wally-street` folder, including `.github`. Drag it into the browser window.
   Drag the folder's contents, not the `wally-street` folder itself.
5. Type a short message such as `First upload` and click **Commit changes**.

## 4. Wait for it to go live

1. Open the **Actions** tab. A run called **Publish website** starts by itself and takes about a minute.
2. A green tick means your game is live at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`. The link also appears in **Settings → Pages** and under **Deployments** on the right of your repository page.

The workflow automatically writes your real web address into the share previews, `sitemap.xml`, `robots.txt` and the 404 page. You don't need to edit anything.

## 5. Turn on sync across devices (optional, about 10 minutes)

Players can already make an account with a username and password. To let them log in on another phone or laptop and carry on where they left off, set up the free sync server:

1. Follow **Set it up on Cloudflare** in [`sync-server/README.md`](sync-server/README.md). At the end you have an address like `https://wally-street-sync.YOUR-NAME.workers.dev`.
2. In your repository, open **Settings → Secrets and variables → Actions → Variables** and click **New repository variable**. Name: `WALLY_SYNC_URL`. Value: that address.
3. Open **Actions → Publish website → Run workflow**. When it finishes, the sign-in screen on your site says "Sync is on".

Progress is encrypted with each player's password before it is uploaded, so nobody running the server can read it.

---

## If something goes wrong

| What you see | What to do |
|---|---|
| No **Publish website** run in the Actions tab | The `.github` folder didn't upload. Upload it again: **Add file → Upload files**, then drag in the `.github` folder |
| Red cross saying **Get Pages site failed** | Pages isn't set to GitHub Actions yet. Do step 2, then go to **Actions → Publish website → Run workflow** |
| "404 There isn't a GitHub Pages site here" | Wait a minute after the green tick, then refresh |
| The sign-in screen doesn't say "Sync is on" | Check that the `WALLY_SYNC_URL` variable starts with `https://`, then run the workflow again. The run's log shows the line `Sync is on:` when it worked |
| You'd rather not use Actions | In **Settings → Pages**, choose **Deploy from a branch → main → /docs**. The game works, but share previews and the 404 page will use the placeholder address `https://your-website.example` until you replace it in the files in `docs/` |

---

## Optional extras

**Show a contact email.** Open `docs/index.html` on GitHub, click the pencil icon, press Ctrl+F (Cmd+F on Mac) and search for `const CONTACT=''`. Put your email between the quotes, for example `const CONTACT='hello@example.com'`, and click **Commit changes**. The site republishes itself. Anyone can see this address.

**Use your own domain.** Go to **Settings → Pages → Custom domain**. The workflow uses whatever address Pages reports, so share previews follow your domain.

**Get found on Google.** Add your site in [Google Search Console](https://search.google.com/search-console) and submit `sitemap.xml`.

**Check your share preview.** Paste your link into [opengraph.xyz](https://www.opengraph.xyz).

**Licence.** Section 12 of the Terms is the app's end-user license agreement (EULA). With no `LICENSE` file, your code stays "all rights reserved": people can look at it on GitHub but can't reuse it, which matches the EULA. If you later add an open-source licence (**Add file → Create new file**, name it `LICENSE`, then **Choose a license template**), that licence covers the code, and the EULA says so in section 12.5. The Wally Street name, lessons and characters stay covered by the Terms either way.

**Visitor stats (Plausible).** The game already counts visits privately on each device. For site-wide numbers:
1. Sign up at [plausible.io](https://plausible.io). It's a paid service with a free trial.
2. In `docs/index.html`, find the `Content-Security-Policy` line near the top and change:
   - `script-src 'unsafe-inline'` to `script-src 'unsafe-inline' https://plausible.io`
   - `connect-src 'none'` to `connect-src https://plausible.io` (if sync is on, add ` https://plausible.io` after the sync server's address instead)
3. Paste this just before `</head>`, using your own address:
   `<script defer data-domain="YOUR-USERNAME.github.io" src="https://plausible.io/js/script.js"></script>`
4. Add a line to `docs/privacy.html` saying you use Plausible for anonymous visit counts.

**Updating the game later.** Replace the files in `docs/` with new ones and commit. If you edit the source instead, change `src/app.html` and run `npm run build` (see `README.md`). Every commit to `main` republishes the site.
