const ROOT=require('path').resolve(__dirname,'..')+'/';
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({...(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),args:['--no-sandbox']});const out={};
for(const pg of ['index.html','404.html','faq.html','privacy.html','terms.html']){const p=await b.newPage({viewport:{width:360,height:780}});const c=[],errs=[];p.on('console',m=>{if(/Content Security|Refused|Failed to load/i.test(m.text())&&!/fonts\.g/.test(m.text()))c.push(m.text().slice(0,140))});p.on('pageerror',e=>errs.push(e.message));
 const r=await p.goto('http://127.0.0.1:8771/'+pg);await p.waitForTimeout(700);
 out[pg]={status:r.status(),title:await p.title(),h1:await p.evaluate(()=>{const h=document.querySelector('main h1, #tc h2');return h?h.textContent:''}),hscroll:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),imgsNoAlt:await p.evaluate(()=>[...document.images].filter(i=>!i.hasAttribute('alt')).length),csp:c,errs};
 if(pg=='404.html')await p.screenshot({path:'site404.png'});await p.close()}
const p=await b.newPage();for(const f of ['favicon.ico','favicon.svg','favicon-32x32.png','apple-touch-icon.png','icon-512.png','og-image.png','robots.txt','sitemap.xml','site.webmanifest']){const r=await p.goto('http://127.0.0.1:8771/'+f);(out.files=out.files||{})[f]=r.status()}
const m=await (await p.goto('http://127.0.0.1:8771/site.webmanifest')).json();out.manifest=m.name;
console.log(JSON.stringify(out,null,1));await b.close()})();
