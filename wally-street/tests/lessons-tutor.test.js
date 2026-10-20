const ROOT=require('path').resolve(__dirname,'..')+'/';
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({...(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),args:['--no-sandbox']});const out={};
const p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+ROOT+'dist/stockgpt-share.html');await p.waitForTimeout(400);await p.fill('#agi','16');await p.click('#agok');await p.waitForTimeout(200);
await p.evaluate(()=>{const e=document.querySelector('#tcs');e.scrollTop=e.scrollHeight});await p.waitForTimeout(200);await p.click('#tca');await p.waitForTimeout(300);await p.evaluate(()=>{const k=document.querySelector('#suskip');if(k)k.click();showGate('in')});await p.waitForTimeout(300);await p.evaluate(()=>{const b=document.querySelector('#ckno');if(b&&b.offsetParent)b.click()});await p.evaluate(()=>{const g=document.querySelector('#gagree');if(g&&!g.checked)g.click()});await p.click('#ggu');await p.waitForTimeout(300);
await p.click('#cta');await p.waitForTimeout(200);await p.screenshot({path:'u-chapter.png'});await p.click('#st');
out.strategyQ=await p.evaluate(()=>Q.length);const kinds=await p.evaluate(()=>Q.map(q=>q.k));out.kinds=kinds;
// answer all questions correctly
for(let i=0;i<20;i++){const done=await p.evaluate(()=>!!document.querySelector('#fin'));if(done)break;
 const ok=await p.evaluate(()=>{const q=Q[qi];const btn=[...document.querySelectorAll('.opt')].find(o=>o.textContent===q[1]);if(btn){btn.click();return true}return false});
 if(!ok)break;await p.click('#chk');await p.waitForTimeout(150);if(i==0)await p.screenshot({path:'u-answer.png'});await p.click('#nx').catch(()=>{});await p.waitForTimeout(150)}
out.end=await p.$eval('#qb',e=>e.innerText.slice(0,160));await p.screenshot({path:'u-end.png'});await p.click('#fin');
// core lesson 1 (unlock all strategy first)
await p.evaluate(()=>{S.done=[100,101,102,103,104,105,200];save();renderLearn()});await p.click('#cta');await p.waitForTimeout(200);await p.click('#st');
out.coreQ=await p.evaluate(()=>({n:Q.length,kinds:Q.map(q=>q.k)}));
await p.screenshot({path:'u-coreq.png'});
// wrong answer -> hearts
await p.evaluate(()=>{const q=Q[qi];const btn=[...document.querySelectorAll('.opt')].find(o=>o.textContent!==q[1]);btn.click()});await p.click('#chk');await p.waitForTimeout(150);out.afterWrong=await p.$eval('#ft',e=>e.innerText.slice(0,200));out.hearts=await p.evaluate(()=>S.hr);
await p.click('#x');
// practice tab
await p.click('nav [data-t=prac]');await p.waitForTimeout(1500);await p.screenshot({path:'u-prac.png'});
out.prac=await p.evaluate(()=>({open:MKS.map(m=>[m[0],isOpen(m[0])]),panel:document.querySelector('#pn').innerText.slice(0,200)}));
// news + top50 dates
await p.evaluate(()=>tab('news'));out.news=await p.$eval('#news .card p',e=>e.textContent);
await p.click('nav [data-t=picks]');out.picks=await p.$eval('#picks .xs2',e=>e.textContent);
// tutor a few natural questions
await p.click('nav [data-t=chat]');const qs=['how do i start investing with 500 rupees','what is sip','is nifty good','what is a stock split','should i buy tesla'];out.tutor=[];
for(const q of qs){await p.fill('#in',q);await p.press('#in','Enter');await p.waitForTimeout(3100);out.tutor.push([q,await p.$$eval('#msgs .m',x=>x.at(-1).textContent.slice(0,110))])}
out.errs=errs;console.log(JSON.stringify(out,null,1));await b.close()})();
