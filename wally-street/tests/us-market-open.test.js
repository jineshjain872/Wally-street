const ROOT=require('path').resolve(__dirname,'..')+'/';
const {chromium,devices}=require('playwright');const W=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch({...(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),args:['--no-sandbox']});const all={};
for(const [f,o] of [['stockgpt-share.html',{...devices['iPhone 13']}],['wally-street.html',{viewport:{width:1366,height:800}}]]){
const ctx=await b.newContext(o);const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+ROOT+'dist/'+f);await W(500);await p.fill('#agi','20');await p.click('#agok');await W(200);await p.click('#tca');await W(200);await p.click('#suskip');await W(300);
await p.evaluate(()=>{tab('prac');mkt='US';document.querySelectorAll('.mk').forEach(d=>d.hidden=d.dataset.m!=mkt);PN[0].i=IX['AAPL'];drawPN();paint()});await W(400);
const out={nowNY:await p.evaluate(()=>{const x=lt2('US');return Math.floor(x.m/60)+':'+String(x.m%60).padStart(2,'0')+' day '+x.wd}),status:await p.$eval('#mc0',e=>e.innerText),markets:await p.$$eval('[data-mk]',e=>e.map(x=>x.textContent)),p0:await p.evaluate(()=>pr[IX['AAPL']])};
await W(3500);out.p1=await p.evaluate(()=>pr[IX['AAPL']]);
await p.fill('#bi0','500');await p.click('[data-buy="0"]');await W(300);out.msg=await p.$eval('#ms0',e=>e.innerText);out.pl=await p.$eval('#plx0',e=>e.innerText.replace(/\n+/g,' | '));
out.realIN=await p.evaluate(()=>[isOpen('IN'),realOpen('IN'),isOpen('JP'),isOpen('CN')]);
await p.screenshot({path:'shots/52-us-open-'+f.replace('.html','')+'.png'});out.errs=errs;all[f]=out;await ctx.close()}
console.log(JSON.stringify(all,null,1));await b.close()})();
