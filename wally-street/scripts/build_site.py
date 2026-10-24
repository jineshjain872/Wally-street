import os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))+'/'
import json,shutil,os,re
from PIL import Image
SP=ROOT+'build/'
O=ROOT+'dist/';S=SP+'site/'
SITE='https://your-website.example'
D=json.load(open(S+'_data.json'))
# icons
shutil.copy(SP+'favicon.svg',S+'favicon.svg')
for n,name in [(16,'favicon-16x16.png'),(32,'favicon-32x32.png'),(192,'icon-192.png'),(512,'icon-512.png')]:shutil.copy(S+f'_icon{n}.png',S+name)
Image.open(S+'_icon48.png').save(S+'favicon.ico',sizes=[(16,16),(32,32),(48,48)])
for f in os.listdir(S):
    if f.startswith('_icon'):os.remove(S+f)
os.remove(S+'_data.json')
DESC='Learn the stock market the fun way: bite-sized lessons, streaks and Wally coins, a friendly tutor, and practice trading with $100,000 of paper money.'
icons=('<link rel="icon" href="favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png"><link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">'
       '<link rel="apple-touch-icon" href="apple-touch-icon.png"><link rel="manifest" href="site.webmanifest">')
og=(f'<link rel="canonical" href="{SITE}/"><meta property="og:url" content="{SITE}/"><meta property="og:image" content="{SITE}/og-image.png">'
    '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Wally Street: Wally the wolf, Bruno the bull and Bella the bear next to the words Learn stocks, trade on paper, become a wizard.">'
    f'<meta name="twitter:image" content="{SITE}/og-image.png">')
# index.html = the full game
g=open(O+'wally-street.html',encoding='utf8').read()
i=g.index('<link rel="icon" type="image/svg+xml"');j=g.index('>',i)+1
g=g[:i]+icons+og+g[j:]
assert g.count("worker-src 'none'")==1
g=g.replace("worker-src 'none'","worker-src 'self'")
g=g.replace('</body></html>','<script>if(\'serviceWorker\' in navigator&&location.protocol==\'https:\')addEventListener(\'load\',()=>navigator.serviceWorker.register(\'sw.js\').catch(()=>{}))</script></body></html>')
assert 'serviceWorker' in g
open(S+'index.html','w',encoding='utf8').write(g)
# shared look for the small standalone pages
CSP='<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; img-src \'self\' data:; base-uri \'none\'; form-action \'none\'">'
def page(title,desc,body,path,noindex=False):
    B=SITE+'/' if noindex else './'  # the 404 page can be shown at any depth, so it needs full addresses
    ic=icons.replace('href="','href="'+SITE+'/') if noindex else icons
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8">{CSP}<meta name="viewport" content="width=device-width, initial-scale=1"><title>{title}</title><meta name="description" content="{desc}">{'<meta name="robots" content="noindex">' if noindex else f'<link rel="canonical" href="{SITE}/{path}">'}<meta name="theme-color" content="#18965c">{ic}
<meta property="og:type" content="website"><meta property="og:site_name" content="Wally Street"><meta property="og:title" content="{title}"><meta property="og:description" content="{desc}"><meta property="og:image" content="{SITE}/og-image.png">
<style>:root{{--bg:#f4f8f1;--card:#fff;--ink:#1d2b2a;--mute:#66767a;--line:#dce6de;--g:#18965c}}@media(prefers-color-scheme:dark){{:root{{--bg:#101a19;--card:#182524;--ink:#eaf3ef;--mute:#8fa3a0;--line:#2a3b39}}}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--bg);color:var(--ink);font:600 16px/1.6 'Segoe UI',system-ui,-apple-system,sans-serif}}a{{color:var(--g);font-weight:800}}
header{{display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:2px solid var(--line);max-width:820px;margin:0 auto}}header img{{width:36px;height:36px}}header b{{font-size:22px;font-weight:900}}header b span{{color:var(--g)}}
main{{max-width:820px;margin:0 auto;padding:16px 16px 40px}}h1{{font-size:30px;line-height:1.2;margin:12px 0 4px}}h3{{color:var(--g);font-size:17px;margin:24px 0 6px}}.tcm{{color:var(--mute);margin:2px 0}}ul{{padding-left:22px}}li{{margin:6px 0}}hr{{border:0;border-top:2px solid var(--line);margin:22px 0}}
.btn{{display:inline-block;background:var(--g);color:#fff;text-decoration:none;border-radius:14px;padding:12px 18px;font-weight:900;margin:6px 6px 0 0}}.btn.ghost{{background:var(--card);color:var(--ink);border:2px solid var(--line)}}
footer{{max-width:820px;margin:0 auto;padding:18px 16px 30px;border-top:2px solid var(--line);color:var(--mute);font-size:14px}}footer a{{margin-right:14px}}footer p{{margin:10px 0 0}}.skip{{position:absolute;left:12px;top:-60px;background:var(--ink);color:var(--bg);padding:10px 14px;border-radius:10px;font-weight:900;text-decoration:none;z-index:9}}.skip:focus{{top:10px}}a:hover{{text-decoration-thickness:3px}}.btn:hover{{filter:brightness(1.07)}}.btn.ghost:hover{{border-color:var(--g)}}details.faq{{border:2px solid var(--line);border-radius:14px;background:var(--card);margin:0 0 8px;padding:0 14px}}details.faq summary{{cursor:pointer;font-weight:900;padding:12px 0}}details.faq summary:hover{{color:var(--g)}}details.faq p{{margin:0 0 12px}}@media print{{header,.skip,footer a,.btn{{display:none}}body{{background:#fff;color:#000}}main{{max-width:none;padding:0}}a[href^=http]::after{{content:' (' attr(href) ')';font-size:85%}}details.faq{{break-inside:avoid;border-color:#999}}details.faq>p{{display:block}}}}</style></head>
<body><a class="skip" href="#content">Skip to main content</a><header><a href="{B}" aria-label="Wally Street home"><img src="{B}favicon.svg" alt=""></a><b><span>Wally</span> Street</b></header><main id="content" tabindex="-1">{body}</main>
<footer><a href="{B}">Play Wally Street</a><a href="{B}faq.html">FAQ</a><a href="{B}privacy.html">Privacy Policy</a><a href="{B}terms.html">Terms and Conditions</a><p>Last updated {D["lastUpdated"]}</p></footer></body></html>'''
FAQB=D['faq'].replace('<details class="faq"','<details class="faq" open')
open(S+'faq.html','w',encoding='utf8').write(page('FAQ · Wally Street','Answers to common questions about Wally Street, the stock market learning game.','<h1>Frequently asked questions</h1>'+FAQB+'<p><a class="btn" href="./">📚 Play Wally Street</a></p>','faq.html'))
open(S+'privacy.html','w',encoding='utf8').write(page('Privacy Policy · Wally Street','How Wally Street keeps your progress, account and choices private.','<h1>Privacy Policy</h1>'+D['privacy'],'privacy.html'))
open(S+'terms.html','w',encoding='utf8').write(page('Terms and Conditions · Wally Street','The rules for using Wally Street, a stock market learning game.','<h1>Terms and Conditions</h1>'+D['terms'],'terms.html'))
nf=f'''<div style="text-align:center;padding:30px 0"><img src="{D['wolf']}" alt="Wally the wolf" style="width:140px;height:140px;border-radius:50%;border:4px solid var(--g)"><div style="font-size:84px;font-weight:900;color:var(--g);line-height:1;margin-top:8px">404</div><h1>Page not found</h1><p style="color:var(--mute)">Wally looked everywhere, but this page doesn't exist or has moved.</p><a class="btn" href="{SITE}/">📚 Go to Wally Street</a><a class="btn ghost" href="{SITE}/#/ask">💬 Ask the tutor</a></div>'''
open(S+'404.html','w',encoding='utf8').write(page('Page not found · Wally Street','This page does not exist on Wally Street.',nf,'404.html',noindex=True))
open(S+'robots.txt','w').write(f'User-agent: *\nAllow: /\nDisallow: /404.html\n\nSitemap: {SITE}/sitemap.xml\n')
open(S+'sitemap.xml','w').write(f'''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>{SITE}/</loc><lastmod>2026-10-22</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>{SITE}/privacy.html</loc><lastmod>2026-10-21</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>{SITE}/faq.html</loc><lastmod>2026-10-21</lastmod><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>{SITE}/terms.html</loc><lastmod>2026-10-22</lastmod><changefreq>yearly</changefreq><priority>0.3</priority></url>
</urlset>
''')
json.dump({"name":"Wally Street","short_name":"Wally Street","description":DESC,"start_url":"./","scope":"./","display":"standalone","background_color":"#f4f8f1","theme_color":"#18965c",
 "icons":[{"src":"icon-192.png","sizes":"192x192","type":"image/png"},{"src":"icon-512.png","sizes":"512x512","type":"image/png"},{"src":"favicon.svg","sizes":"any","type":"image/svg+xml"}]},open(S+'site.webmanifest','w'),indent=2)
open(S+'sw.js','w').write("""/* Wally Street offline support: network first, cached copy when offline */
const C='wally-street-4.3.0';
const FILES=['./','index.html','404.html','faq.html','privacy.html','terms.html','favicon.svg','favicon.ico','favicon-32x32.png','icon-192.png','icon-512.png','apple-touch-icon.png','site.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(m=>m||(r.mode==='navigate'?caches.match('index.html'):Response.error()))))});
""")
open(S+'ANALYTICS-optional.txt','w').write("""OPTIONAL: VISITOR STATS WITH PLAUSIBLE
=======================================

The game already keeps private visit and lesson counts on each device
(Settings > System status). Those never leave the device.

If you also want site-wide visitor numbers, Plausible is a privacy-friendly
option (no cookies, no personal data). It is a paid service with a free trial.

1. Sign up at https://plausible.io and add your site address.
2. In index.html, find the Content-Security-Policy line near the top and change
     script-src 'unsafe-inline'      to   script-src 'unsafe-inline' https://plausible.io
     connect-src 'none'              to   connect-src https://plausible.io
     (if sync is on, add  https://plausible.io  after the sync server's address instead)
3. Paste this just before </head> in index.html (use your own domain):
     <script defer data-domain="your-website.example" src="https://plausible.io/js/script.js"></script>
4. Add one line to privacy.html saying you use Plausible for anonymous visit counts.

If you skip this, nothing breaks: the site simply has no outside analytics.
""")
open(S+'SYNC-optional.txt','w').write("""OPTIONAL: SYNC ACROSS DEVICES
=============================

Players can make an account with a username and password. To let them log in
on another phone or laptop and carry on where they left off, set up the free
sync server. It takes about 10 minutes and only needs a web browser.

Progress is encrypted with each player's password on their device before it is
uploaded, so nobody running the server can read it. The server keeps only that
encrypted copy, a hash of a key made from the password, the time of the last
save, and for 15 minutes a count of wrong passwords.

1. Sign up or log in at https://dash.cloudflare.com (the free plan is enough).
2. Storage & Databases > KV > Create a namespace. Name it  wally-street-saves
3. Workers & Pages > Create > Start with Hello World! Name it  wally-street-sync
   and click Deploy.
4. Click Edit code, delete everything, paste ALL the code at the bottom of this
   file (below the line of dashes) and click Deploy.
5. In the Worker, open Bindings (or Settings > Bindings) > Add binding >
   KV namespace. Variable name:  WALLY   Namespace: wally-street-saves. Save.
6. Open the Worker's address (https://wally-street-sync.YOUR-NAME.workers.dev).
   You should see {"ok":true,"service":"wally-street-sync","version":1}
7. Optional: Settings > Variables and Secrets > add ALLOW_ORIGIN set to your
   website's address (for example https://wallystreet.com). Leave it out if
   players also use the download file.
8. In index.html change two things:
     const SYNC_URL='';   to   const SYNC_URL='https://wally-street-sync.YOUR-NAME.workers.dev';
     connect-src 'none'   to   connect-src https://wally-street-sync.YOUR-NAME.workers.dev
   (the second one is in the Content-Security-Policy line near the top)
9. Upload index.html again. The sign-in screen now says "Sync is on".

Free plan limits: 100,000 requests and 1,000 saves a day for the whole server.
The game saves at most once a minute while someone plays, so that is roughly
100 play sessions a day. Saves can take up to a minute to reach a device far away.

A forgotten password cannot be recovered. Deleting an account in the game
deletes its copy on the server too.

---------------- sync server code (worker.mjs) ----------------
"""+open(ROOT+'build/sync-server/worker.mjs',encoding='utf8').read())
open(S+'README.txt','w').write(f'''WALLY STREET: WEBSITE FILES
============================

Upload everything in this folder to the top level of your website
(for example GitHub Pages, Netlify or Cloudflare Pages).

BEFORE YOU UPLOAD: CHANGE 2 THINGS
1. Your web address.
   Replace  {SITE}  with your real address in these files:
   index.html, 404.html, privacy.html, terms.html, robots.txt, sitemap.xml
   (Use your editor's Find and Replace. No slash at the end.)
   Example: https://wallystreet.com  or  https://yourname.github.io/wally-street

2. Your contact address.
   Open index.html, search for  const CONTACT=''  and put your email between
   the quotes, for example  const CONTACT='hello@wallystreet.com'.
   It then shows in the app, the Privacy Policy and the Terms.
   (privacy.html is a copy made today. After adding your email, rebuild it
   with the build script, or edit its Contact section by hand.)

WHAT EACH FILE DOES
index.html          The whole game in one file.
404.html            The page people see if they open a link that doesn't exist.
                    GitHub Pages, Netlify and Cloudflare Pages use it automatically.
faq.html            Frequently asked questions.
privacy.html        Privacy Policy.
terms.html          Terms and Conditions.
robots.txt          Tells search engines they may index the site, and where the sitemap is.
sitemap.xml         The list of pages for Google and Bing.
og-image.png        The picture shown when someone shares your link (1200 x 630).
favicon.ico, favicon.svg, favicon-16x16.png, favicon-32x32.png
                    Browser tab icons.
apple-touch-icon.png, icon-192.png, icon-512.png, site.webmanifest
                    Icons for phone home screens and "Add to Home Screen".
sw.js               Lets the game open offline and be installed as an app
                    (works once the site is on https).
ANALYTICS-optional.txt
                    How to add Plausible visitor stats, if you want them.
SYNC-optional.txt   How to let players log in on any device with a free sync
                    server, with the server code.

AFTER YOU UPLOAD
- Check your share preview: paste your link into https://www.opengraph.xyz
- Submit sitemap.xml in Google Search Console and Bing Webmaster Tools.
''')
print(sorted(os.listdir(S)))
