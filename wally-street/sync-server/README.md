# Sync server (optional)

This small server lets players log in with their username and password on any device and carry on where they left off. It runs as a Cloudflare Worker, which is free for a small site, and takes about 10 minutes to set up. You only need a web browser.

Without it, the game still works, and accounts are saved on each device.

## What it keeps

- An **encrypted copy** of each player's progress. The game encrypts it with the player's password before it leaves their device, so you (and Cloudflare) cannot read it.
- A **hash of a key made from the password**, used to check that a player is who they say they are. The password itself is never sent.
- The time of the last save, and for 15 minutes a count of wrong passwords. After 10 wrong passwords an account is locked for 15 minutes.

A forgotten password cannot be recovered, because nobody else holds it. Deleting an account in the game deletes its copy here too.

## Set it up on Cloudflare

1. Sign up or log in at [dash.cloudflare.com](https://dash.cloudflare.com). The free plan is enough.
2. **Create the storage.** Open **Storage & Databases → KV** and click **Create a namespace**. Name it `wally-street-saves`.
3. **Create the Worker.** Open **Workers & Pages**, click **Create**, choose **Start with Hello World!**, name it `wally-street-sync` and click **Deploy**.
4. **Paste the code.** Click **Edit code**. Delete everything in the editor, paste the whole of [`worker.mjs`](worker.mjs) and click **Deploy**.
5. **Connect the storage.** Go back to the Worker and open **Bindings** (on some accounts it is under **Settings → Bindings**). Click **Add binding → KV namespace**. Set **Variable name** to `WALLY` (capitals, exactly) and pick `wally-street-saves`. Save, and deploy if asked.
6. **Check it.** Open the Worker's address, which looks like `https://wally-street-sync.YOUR-NAME.workers.dev`. You should see `{"ok":true,"service":"wally-street-sync","version":1}`.
7. **Optional, recommended:** under **Settings → Variables and Secrets**, add a text variable `ALLOW_ORIGIN` set to your website's address without a path, for example `https://your-username.github.io`. Browsers on other websites can then not use your server. Leave it out if players also use the download file, which has no web address of its own.

## Switch it on in the game

**GitHub Pages (this repository).** On your repository page open **Settings → Secrets and variables → Actions**, choose the **Variables** tab, click **New repository variable**, and add:

- Name: `WALLY_SYNC_URL`
- Value: your Worker's address, for example `https://wally-street-sync.YOUR-NAME.workers.dev`

Then open **Actions → Publish website → Run workflow** (or just commit any change). The workflow writes the address into the game and allows the page to talk to that server and nothing else. The sign-in screen then says "Sync is on".

**Any other host, or the download file.** Open `index.html` (or `wally-street.html`) in a text editor and change two things:

1. `const SYNC_URL='';` to `const SYNC_URL='https://wally-street-sync.YOUR-NAME.workers.dev';`
2. In the `Content-Security-Policy` line near the top, `connect-src 'none'` to `connect-src https://wally-street-sync.YOUR-NAME.workers.dev`

Players who were already signed in before you switched sync on should log out and log in again once, so their device gets its sync key.

## Limits on the free plan

Cloudflare's free plan allows 100,000 requests and 1,000 saves a day across the whole server. The game uploads at most once a minute while someone plays, and straight away when they leave the page, so a 10-minute session is usually about 10 saves. That covers around 100 play sessions a day. For more, Cloudflare's paid Workers plan raises the limits a lot.

Saves can take up to about a minute to show on another device far away, because Cloudflare copies them around the world.

## Deploy from the command line (optional)

If you use Cloudflare's `wrangler` tool, `wrangler.toml` in this folder is ready. Create the namespace with `npx wrangler kv namespace create wally-street-saves`, paste the id it prints into `wrangler.toml`, then run `npx wrangler deploy`.

## Test it on your own computer

`node sync-server/dev-server.mjs 8788` runs the same code with the saves kept in memory. `tests/sync.test.js` uses it to check signing up, logging in on a second device, wrong passwords, the lock-out, password changes and deleting an account.

## API

All requests carry `Authorization: Bearer <64 hex characters>`. The account id is 32 hex characters worked out from the username.

| Request | Reply |
|---|---|
| `GET /v1/accounts/<id>` | `200 {exists:true, data}`, `404 {exists:false}`, `403` wrong key, `429` locked |
| `PUT /v1/accounts/<id>` with `{data:{iv,d,...}, rotate?}` | `200 {ok:true, created}`; `rotate` (a hash of a new key) changes the password, and only the current key can send it |
| `DELETE /v1/accounts/<id>` | `200 {ok:true}` |

Saves over 600 KB are refused (`413`).
