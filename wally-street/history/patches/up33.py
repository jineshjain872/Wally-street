import urllib.parse
SP='/tmp/claude-0/-home-claude/d6cebc6b-bafa-5f05-9ae9-36df9f9405d6/scratchpad/'
O='/mnt/user-data/outputs/'
s=open(SP+'master-v32.html',encoding='utf8').read()
site=open(SP+'site.js',encoding='utf8').read()
def rep(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(a[:90],c);s=s.replace(a,b)
ICON='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22b36f"/><stop offset="1" stop-color="#0f7545"/></linearGradient></defs><rect width="64" height="64" rx="14" fill="url(#g)"/><path d="M11 19 L19.5 46 L28 27 L36.5 46 L45 19" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M41 31 L53 15" stroke="#ffc43d" stroke-width="5" stroke-linecap="round"/><path d="M45.5 14 L54 14 L54 22.5" fill="none" stroke="#ffc43d" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
open(SP+'favicon.svg','w').write(ICON)
DESC='Learn the stock market the fun way: bite-sized lessons, streaks and XP, a friendly tutor, and practice trading with $100,000 of paper money.'
head=('<meta name="description" content="'+DESC+'"><meta name="theme-color" content="#18965c">'
 '<meta property="og:type" content="website"><meta property="og:site_name" content="Wally Street"><meta property="og:title" content="Wally Street: learn stocks, trade on paper">'
 '<meta property="og:description" content="'+DESC+'"><meta name="twitter:card" content="summary_large_image">'
 '<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,'+urllib.parse.quote(ICON,safe=' =:/,.-')+'">')
rep('<title>Wally Street</title>','<title>Wally Street</title>'+head)
# remove the old tab() (replaced by the routed version)
i=s.index("function tab(t){['learn','chat','news','picks','prac','hist'].forEach(");j=s.index('\n',i)+1;s=s[:i]+s[j:]
rep('<section class="view" id="hist"></section>','<section class="view" id="hist"></section>\n<section class="view" id="nf" aria-labelledby="nfh"></section>')
rep('</main>','</main>\n<div id="scta" hidden></div>')
rep('<div class="card"><h3>🔥 ${st}-day streak</h3>','${ctaHTML()}<div class="card"><h3>🔥 ${st}-day streak</h3>')
rep("$('#learn').innerHTML=h;","$('#learn').innerHTML=h;stickyInit();")
rep("$('#learn').onclick=e=>{","$('#learn').onclick=e=>{if(ctaClick(e))return;")
rep("function start(id,k){","function start(id,k){stat('lesson_start');")
rep("function finish(){","function finish(){stat('lesson_done');")
rep("say(n,'Bought '+","stat('trade');say(n,'Bought '+")
rep("say(n,'Sold '+","stat('trade');say(n,'Sold '+")
rep("slice(0,500)}busy=true;","slice(0,500)}busy=true;stat('question');")
rep("async function startup(){try{const ss=","async function startup(){showCookie();stat('visit');try{const ss=")
rep("await enter(keep)}};","await enter(keep);if(gmode=='up')showThanks()}};")
rep('data-a11y="1" style="margin-top:8px">Accessibility statement</button>',
    'data-a11y="1" style="margin-top:8px">Accessibility statement</button><button class="btn ghost" data-doc="privacy" style="margin-top:8px">Privacy Policy</button><button class="btn ghost" data-ck2="1" style="margin-top:8px">Cookie settings</button><button class="btn ghost" data-doc="stats" style="margin-top:8px">Your usage stats</button><button class="btn ghost" data-doc="contact" style="margin-top:8px">Contact</button>')
rep("else if(t.dataset.th){S.th=t.dataset.th;","else if(t.dataset.ck2){try{localStorage.removeItem(CONSK)}catch(x){}$('#ac').style.display='none';showCookie()}\n else if(t.dataset.th){S.th=t.dataset.th;")
rep('<a href="#" id="gal">Accessibility statement</a>','<a href="#" id="gal">Accessibility statement</a> · <a href="#" data-doc="privacy">Privacy Policy</a>')
rep("opsInit();","opsInit();routeInit();")
rep('/* ---------- accounts ---------- */',site+'/* ---------- accounts ---------- */')
css='''#nf{overflow-y:auto;padding:16px}#nf.on{display:block}.nfw{text-align:center;max-width:460px;margin:24px auto}.nfn{font-size:76px;font-weight:900;color:var(--g);line-height:1;margin-top:10px;letter-spacing:-2px}.nfw h1{font-size:26px;margin:4px 0 6px}.nfw p{color:var(--mute);font-weight:600;margin-bottom:6px}.nfw .amts{justify-content:center}
.btn.cta{display:block;width:100%;margin:0 0 18px;font-size:18px;padding:16px 18px;text-align:center}
#scta{position:fixed;left:12px;right:12px;bottom:calc(76px + env(safe-area-inset-bottom,0px));z-index:6;max-width:536px;margin:0 auto}#scta[hidden]{display:none}#scta .btn{width:100%;margin:0;box-shadow:0 4px 0 var(--gd),0 12px 26px -8px rgba(0,0,0,.45)}
#ckb{position:fixed;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));z-index:35;max-width:560px;margin:0 auto;background:var(--card);color:var(--ink);border:2px solid var(--line);border-radius:18px;padding:14px 16px;box-shadow:0 18px 40px -16px rgba(0,0,0,.55);display:none}#ckb p{font-size:14px;font-weight:600;line-height:1.45;margin:0}#ckb a{color:var(--blue);font-weight:800}#ckb .amts{margin:10px 0 0}body.ckon #gate{padding-bottom:250px}
.tyh{text-align:center;margin:10px 0 6px}.tyh .story{margin-top:10px}
'''
assert s.count('</style>')==1
s=s.replace('</style>',css+'</style>')
open(O+'stockgpt.html','w',encoding='utf8').write(s);open(O+'stockgpt-share.html','w',encoding='utf8').write(s);print('ok',len(s))
