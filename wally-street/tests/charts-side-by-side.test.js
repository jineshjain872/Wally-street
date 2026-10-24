const ROOT=require('path').resolve(__dirname,'..')+'/';
const {chromium,devices}=require('playwright');const W=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch({...(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),args:['--no-sandbox']});const all={};
for(const [f,o] of [['stockgpt-share.html',{...devices['iPhone 13']}],['wally-street.html',{viewport:{width:1366,height:800}}]]){
const tag=f.replace('.html','');const ctx=await b.newContext(o);const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));const out={};
await p.goto('file://'+ROOT+'dist/'+f);await W(500);await p.fill('#agi','20');await p.click('#agok');await W(200);await p.click('#tca');await W(200);await p.click('#suskip');await W(3600);
await p.evaluate(()=>{const c=document.querySelector('#ckno');if(c&&c.offsetParent)c.click();tab('prac');PN[0].i=IX['AAPL'];drawPN();paint()});await W(300);
await p.click('#addc');await W(400);
out.two=await p.evaluate(()=>[...document.querySelectorAll('#pn .cd')].map(e=>{const r=e.getBoundingClientRect();return [Math.round(r.left),Math.round(r.top),Math.round(r.width),getComputedStyle(e).display]}));
out.overflow=await p.evaluate(()=>{const pn=document.querySelector('#pn');const bad=[];pn.querySelectorAll('.cd *').forEach(el=>{const r=el.getBoundingClientRect(),c=el.closest('.cd').getBoundingClientRect();if(r.width&&r.right>c.right+1)bad.push(el.tagName+'.'+el.className+'#'+el.id)});return [document.documentElement.scrollWidth>innerWidth+1,bad.slice(0,8)]});
await p.evaluate(()=>{document.querySelector('#pn').scrollIntoView({block:'start'})});await W(300);await p.screenshot({path:'shots/70-two-'+tag+'.png'});
await p.click('#addc');await W(400);out.three=await p.evaluate(()=>[...document.querySelectorAll('#pn .cd')].map(e=>{const r=e.getBoundingClientRect();return [Math.round(r.left),Math.round(r.top),Math.round(r.width)]}));
await p.evaluate(()=>{document.querySelector('#pn').scrollIntoView({block:'start'})});await W(300);await p.screenshot({path:'shots/71-three-'+tag+'.png'});
// trading still works from the second chart
await p.evaluate(()=>{window.isOpen=()=>true});await p.fill('#bi1','200');await p.click('[data-buy="1"]');await W(300);out.buy2=await p.$eval('#ms1',e=>e.innerText);out.pl2=await p.$eval('#plx1',e=>e.innerText.split('\n')[0]);
out.errs=errs;all[f]=out;await ctx.close()}
console.log(JSON.stringify(all,null,1));await b.close()})().catch(e=>{console.log('FATAL',e.message.slice(0,500));process.exit(1)});
