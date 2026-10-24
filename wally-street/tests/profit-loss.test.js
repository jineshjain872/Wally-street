const ROOT=require('path').resolve(__dirname,'..')+'/';
const {chromium,devices}=require('playwright');const W=ms=>new Promise(r=>setTimeout(r,ms));
const SH=ROOT+'build/shots/';
(async()=>{const b=await chromium.launch({...(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),args:['--no-sandbox']});const all={};
for(const [f,o] of [['stockgpt-share.html',{...devices['iPhone 13']}],['stockgpt-laptop.html',{viewport:{width:1366,height:800}}]]){
 const ctx=await b.newContext(o);const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));const out={};
 await p.goto('file://'+ROOT+'dist/'+f);await W(500);await p.fill('#agi','20');await p.click('#agok');await W(200);await p.click('#tca');await W(200);await p.click('#suskip');await W(400);
 await p.evaluate(()=>{window.isOpen=()=>true;tab('prac');PN[0].i=IX['AAPL'];drawPN();paint()});await W(300);
 const box=()=>p.$eval('#plx0',e=>e.innerText.replace(/\n+/g,' | '));
 out.none=await box();
 out.below=await p.evaluate(()=>{const s=document.querySelector('[data-sell="0"]').closest('.tr');return s.nextElementSibling&&s.nextElementSibling.id});
 await p.fill('#bi0','1000');await p.click('[data-buy="0"]');await W(300);out.bought=await box();
 await p.evaluate(()=>{pr[IX['AAPL']]*=1.1;paint()});await W(200);out.up=await box();
 await p.screenshot({path:SH+'50-pl-up-'+f.replace('.html','')+'.png'});
 await p.fill('#si0','500');await p.click('[data-sell="0"]');await W(300);out.partSell=await box();
 await p.evaluate(()=>{pr[IX['AAPL']]*=0.8;paint()});await W(200);out.down=await box();
 await p.evaluate(()=>{S.pxd=1;applyComfort();paint()});await W(200);await p.screenshot({path:SH+'51-pl-down-dark-'+f.replace('.html','')+'.png'});
 await p.click('[data-qs="0"]');await p.click('[data-sell="0"]');await W(300);out.allSold=await box();
 out.cash=await p.evaluate(()=>X.cash);out.errs=errs;all[f]=out;await ctx.close()}
console.log(JSON.stringify(all,null,1));await b.close()})().catch(e=>{console.log('FATAL',e.message.slice(0,800));process.exit(1)});
