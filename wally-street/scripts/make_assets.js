const ROOT=require('path').resolve(__dirname,'..')+'/';
const {chromium}=require('playwright');const fs=require('fs');
const D=ROOT+'build/';
(async()=>{const b=await chromium.launch({...(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),args:['--no-sandbox']});
const svg=fs.readFileSync(D+'favicon.svg','utf8');
for(const n of [16,32,48,180,192,512]){const p=await b.newPage({viewport:{width:n,height:n}});await p.setContent(`<html><body style="margin:0;background:transparent">${svg.replace('<svg ','<svg width="'+n+'" height="'+n+'" ')}</body></html>`);await p.screenshot({path:D+'site/_icon'+n+'.png',omitBackground:true});await p.close()}
// maskable/apple icon with solid background (no rounded transparency)
const p0=await b.newPage({viewport:{width:180,height:180}});await p0.setContent(`<html><body style="margin:0;background:#18965c">${svg.replace('<svg ','<svg width="180" height="180" ').replace('rx="14"','rx="0"')}</body></html>`);await p0.screenshot({path:D+'site/apple-touch-icon.png'});
// pull page data out of the built app
const q=await b.newPage();await q.goto('file://'+ROOT+'dist/stockgpt-share.html');await q.waitForTimeout(400);
const data=await q.evaluate(()=>({privacy:privacyHTML(),terms:TERMS_HTML,termsV:TERMS_V,wolf:WOLF,bull:BULL,bear:BEAR}));fs.writeFileSync(D+'site/_data.json',JSON.stringify(data));
// Open Graph image 1200x630
const og=await b.newPage({viewport:{width:1200,height:630}});
await og.setContent(`<html><head><style>body{margin:0;width:1200px;height:630px;font-family:'Nunito','Segoe UI',Arial,sans-serif;background:radial-gradient(900px 500px at 75% 0%,#2fbf7d55,transparent),linear-gradient(135deg,#0f2a22,#0b3d2c 55%,#0f7545);color:#fff;display:flex;align-items:center;overflow:hidden}
.l{padding:0 0 0 80px;flex:1}.k{display:inline-block;background:#ffc43d;color:#3d2a00;font-weight:900;border-radius:999px;padding:8px 18px;font-size:22px;letter-spacing:.5px}
h1{font-size:104px;line-height:1;margin:22px 0 10px;font-weight:900;letter-spacing:-3px}h1 span{color:#5ee0a0}p{font-size:34px;line-height:1.3;margin:0;font-weight:700;opacity:.95;max-width:560px}
.r{width:470px;height:630px;position:relative}.m{position:absolute;border-radius:50%;border:8px solid #18965c;background:#0cab55;box-shadow:0 24px 50px -16px rgba(0,0,0,.7);object-fit:cover}
.chart{position:absolute;left:60px;bottom:40px;opacity:.35}</style></head><body><div class="l"><div class="k">📈 FREE STOCK MARKET GAME</div><h1><span>Wally</span> Street</h1><p>Learn stocks. Trade on paper. Become a wizard.</p></div>
<div class="r"><img class="m" src="${data.wolf}" style="width:300px;height:300px;left:70px;top:150px"><img class="m" src="${data.bull}" style="width:170px;height:170px;left:0;top:60px"><img class="m" src="${data.bear}" style="width:170px;height:170px;left:290px;top:400px"></div>
<svg class="chart" width="700" height="200" viewBox="0 0 700 200"><polyline points="0,170 80,150 150,160 230,110 300,125 380,70 450,90 530,40 600,55 700,10" fill="none" stroke="#5ee0a0" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg></body></html>`);
await og.waitForTimeout(300);await og.screenshot({path:D+'site/og-image.png'});
await b.close();console.log('assets ok')})();
