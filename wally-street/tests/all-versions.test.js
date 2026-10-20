const ROOT=require('path').resolve(__dirname,'..')+'/';
const {chromium}=require('playwright');
const W=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await chromium.launch({...(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),args:['--no-sandbox']});const all={};
for(const [f,vp] of [['stockgpt-share.html',{width:390,height:844}],['wally-street.html',{width:390,height:844}],['stockgpt-laptop.html',{width:1366,height:800}],['stockgpt-index-artifact.html',{width:390,height:844}]]){
 const out={};const errs=[];const ctx=await b.newContext({viewport:vp});try{const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));
 await p.goto('file://'+ROOT+'dist/'+f);await W(500);
 // under-13 is blocked
 await p.fill('#agi','11');await p.click('#agok');await W(300);out.under13=await p.$eval('#tc',e=>e.innerText.slice(0,90).replace(/\n+/g,' '));
 await ctx.clearCookies();await p.evaluate(()=>localStorage.clear());await p.reload();await W(500);
 await p.fill('#agi','25');await p.click('#agok');await W(300);await p.click('#tca');await W(300);await p.click('#suskip');await W(400);
 out.title=await p.title();out.nav=await p.$$eval('nav button',e=>e.map(x=>x.dataset.t).join(','));
 // malicious backup with the new 4.0 fields
 const evil={app:'wally-street',S:{name:'<img src=x onerror=window.__pwn=1>',bd:['first','<img src=x onerror=window.__pwn=2>',{}],mis:[{q:['<img src=x onerror=window.__pwn=3>','a','b','c'],d:'x'},5],cls:{c:'<svg onload=window.__pwn=4>',t:'<img src=x onerror=window.__pwn=5>',l:[0,'<b>',1e9]},ms:{id:'<x>',done:['<y>']},cur:'BTC',tz:'9',hc:'<x>',dg:{d:'<x>',l:'1e9'},fz:1e9,code:'<img src=x onerror=window.__pwn=6>',setup:{g:'<x>',l:1,c:'IN'}},
  X:{cash:1000,pos:{},h:[{tk:'<img src=x onerror=window.__pwn=7>',sd:'b',v:'1e99',px:1,t:'<x>'},{tk:'AAPL',sd:'zz',v:5,px:1,t:1}],ord:[{tk:'AAPL',ty:'<x>',px:1,amt:1},{tk:'<img src=x onerror=window.__pwn=8>',ty:'lb',px:1,amt:1}],w:['AAPL','<img src=x onerror=window.__pwn=9>'],al:[{tk:'<img src=x onerror=window.__pwn=10>',px:1,dir:'up'}],dv:'<x>'}};
 out.globals=await p.evaluate(()=>typeof renderLearn+','+typeof applyBackup+','+typeof S);await p.evaluate(async t=>{await applyBackup(JSON.parse(t))},JSON.stringify(evil)).catch(e=>out.bkErr=e.message);await W(200);
 await p.evaluate(()=>{renderLearn();tab('prac');paintX();showBadges();document.querySelector('#tc').style.display='none';showClass();document.querySelector('#tc').style.display='none';showInvite()});await W(400);
 out.evil=await p.evaluate(()=>({pwn:window.__pwn||0,bd:S.bd,mis:(S.mis||[]).length,cls:S.cls,ms:S.ms,cur:S.cur,tz:S.tz,hc:S.hc,fz:S.fz,code:S.code,setup:S.setup,h:X.h,ord:X.ord,w:X.w,al:X.al,dv:X.dv}));
 await p.evaluate(()=>{document.querySelector('#tc').style.display='none'});
 // routes
 for(const r of ['glossary','tools','badges','replay','markets']){await p.evaluate(r=>{document.querySelector('#tc').style.display='none';location.hash='#/'+r},r);await W(300);(out.routes=out.routes||{})[r]=await p.evaluate(()=>(document.querySelector('#tc').style.display=='flex'?document.querySelector('#tc h2').textContent:'')+' | '+(document.querySelector('nav .on')||{}).dataset?.t+' | '+document.title)}
 await p.screenshot({path:'shots/v-'+f.replace('.html','')+'.png'});
 }catch(e){out.FAIL=e.message.slice(0,200)}out.errs=errs;all[f]=out;await ctx.close()}
console.log(JSON.stringify(all,null,1));await b.close()})().catch(e=>{console.log('FATAL',e.message);process.exit(1)});
