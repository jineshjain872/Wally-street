WALLY STREET: WEBSITE FILES
============================

Upload everything in this folder to the top level of your website
(for example GitHub Pages, Netlify or Cloudflare Pages).

BEFORE YOU UPLOAD: CHANGE 2 THINGS
1. Your web address.
   Replace  https://your-website.example  with your real address in these files:
   index.html, 404.html, privacy.html, terms.html, robots.txt, sitemap.xml
   (Use your editor's Find and Replace. No slash at the end.)
   Example: https://wallystreet.com  or  https://yourname.github.io/wally-street

2. Your contact address.
   Open index.html, search for  const CONTACT=''  and put your email between
   the quotes, for example  const CONTACT='hello@wallystreet.com'.
   It then shows in the app, the Privacy Policy and the Terms.
   (privacy.html is a copy made today. After adding your email, ask Claude
   to rebuild it, or edit its Contact section by hand.)

WHAT EACH FILE DOES
index.html          The whole game in one file.
404.html            The page people see if they open a link that doesn't exist.
                    GitHub Pages, Netlify and Cloudflare Pages use it automatically.
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

AFTER YOU UPLOAD
- Check your share preview: paste your link into https://www.opengraph.xyz
- Submit sitemap.xml in Google Search Console and Bing Webmaster Tools.
