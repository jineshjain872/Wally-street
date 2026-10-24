const ROOT=require('path').resolve(__dirname,'..')+'/';
const {chromium,devices}=require('playwright');const W=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch({...(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),args:['--no-sandbox']});const all={};
for(const [f,o] of [['stockgpt-share.html',{...devices['iPhone 13']}],['wally-street.html',{viewport:{width:1366,height:800}}]]){
const ctx=await b.newContext(o);const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));const out={};
await p.goto('file://'+ROOT+'dist/'+f);await W(500);await p.fill('#agi','20');await p.click('#agok');await W(300);
out.summary=await p.$eval('#tcs',e=>[...e.querySelectorAll('ul.opl li')].map(x=>x.textContent).slice(-1)[0]);
out.header=await p.$eval('#tc .tch .xs2',e=>e.textContent);
out.eula=await p.evaluate(()=>{const d=document.querySelector('#tcs details');d.open=true;const h=[...d.querySelectorAll('h3')].map(x=>x.textContent).filter(t=>/^12\./.test(t));const subs=[...d.querySelectorAll('p b')].map(x=>x.textContent).filter(t=>/^12\./.test(t));return {h,subs}});
await p.screenshot({path:'shots/80-terms-'+f.replace('.html','')+'.png'});
await p.click('#tca');await W(300);out.stored=await p.evaluate(()=>JSON.parse(localStorage.getItem('stockgpt:terms')).v);
await p.click('#suskip').catch(()=>{});await W(300);
// returning player who agreed to 1.2
await p.evaluate(()=>{const t=JSON.parse(localStorage.getItem('stockgpt:terms'));t.v='1.2';localStorage.setItem('stockgpt:terms',JSON.stringify(t))});await p.reload();await W(900);
out.returning=await p.evaluate(()=>({screen:document.querySelector('#tc').style.display=='flex'?document.querySelector('#tc h2').textContent:'none',notice:(document.querySelector('#tcs .tcm')||{}).textContent||''}));
await p.screenshot({path:'shots/81-terms-again-'+f.replace('.html','')+'.png'});
await p.click('#tca');await W(500);out.after=await p.evaluate(()=>({ok:termsOK(),tc:document.querySelector('#tc').style.display}));
out.view=await p.evaluate(()=>{showTerms(true);return document.querySelector('#tcs').innerText.match(/12\.4 What you may not do[^\n]*/)[0]});
out.errs=errs;all[f]=out;await ctx.close()}
console.log(JSON.stringify(all,null,1));await b.close()})().catch(e=>{console.log('FATAL',e.message.slice(0,500));process.exit(1)});
