const ROOT=require('path').resolve(__dirname,'..')+'/';
const {chromium,devices}=require('playwright');const W=ms=>new Promise(r=>setTimeout(r,ms));
const SH=ROOT+'build/shots/';
async function play(p){for(let n=0;n<60;n++){await W(100);const st=await p.$('#ft #st');if(st){await st.click();continue}if(await p.$('#ft #fin'))return 'end';const nx=await p.$('#ft #nx');if(nx){await nx.click();continue}
 const i=await p.evaluate(()=>opts.indexOf(Q[qi][1]));await p.evaluate(i=>document.querySelector(`#qb .opt[data-o="${i}"]`).click(),i);await p.click('#ft #chk')}return 'loop'}
(async()=>{const b=await chromium.launch({...(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),args:['--no-sandbox']});const all={};
for(const [f,o] of [['stockgpt-share.html',{...devices['iPhone 13']}],['wally-street.html',{viewport:{width:1366,height:800}}]]){
const tag=f.replace('.html','');const ctx=await b.newContext(o);const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));const out={};
await p.goto('file://'+ROOT+'dist/'+f);await W(500);await p.fill('#agi','20');await p.click('#agok');await W(200);await p.click('#tca');await W(200);await p.click('#suskip');await W(3600);
out.pill=await p.evaluate(()=>({html:document.querySelector('#hx').innerHTML.slice(0,140),text:document.querySelector('#hx').innerText}));
await p.screenshot({path:SH+'60-header-'+tag+'.png',clip:{x:0,y:0,width:o.viewport?1366:390,height:80}});
await p.evaluate(()=>start(0));out.play=await play(p);await W(450);
out.finish=await p.evaluate(()=>({stat:(document.querySelector('#qb .wcs')||{}).innerText,flying:document.querySelectorAll('.wcf').length}));
await p.screenshot({path:SH+'61-finish-'+tag+'.png'});
await W(1200);await p.click('#ft #fin');await W(250);out.fly=await p.evaluate(()=>document.querySelectorAll('.wcf').length);await p.screenshot({path:SH+'62-flying-'+tag+'.png'});
await W(900);out.mid=await p.evaluate(()=>({n:document.querySelector('#hx .wcn').textContent,bump:document.querySelector('#hx').className}));
await W(1500);out.after=await p.evaluate(()=>({n:document.querySelector('#hx .wcn').textContent,xp:S.xp,left:document.querySelectorAll('.wcf,.wcsp').length}));
// spending: give 300 coins, convert all in Practice
await p.evaluate(()=>{const c=document.querySelector('#ckno');if(c&&c.offsetParent)c.click();S.xp=300;save();head()});await W(1800);
await p.evaluate(()=>{window.isOpen=()=>true;tab('prac')});await W(400);out.wallet=await p.evaluate(()=>document.querySelector('#prac .tb').innerText.replace(/\n+/g,' | '));
await p.screenshot({path:SH+'63-wallet-'+tag+'.png'});
await p.click('[data-xp="all"]');await W(300);out.cfm=await p.evaluate(()=>document.querySelector('.cfm')&&document.querySelector('.cfm').innerText.replace(/\n+/g,' | '));await p.click('.cfm [data-cf="1"]');await W(250);
out.drain=await p.evaluate(()=>document.querySelector('#hx').className);await W(1200);out.spent=await p.evaluate(()=>({n:document.querySelector('#hx .wcn').textContent,xp:S.xp,cash:X.cash}));
// no "XP" left anywhere a player can see
const pages=await p.evaluate(()=>{const r={};const chk=n=>{const t=document.body.innerText;r[n]=(t.match(/\bXP\b/g)||[]).length};tab('learn');chk('learn');tab('prac');chk('prac');tab('picks');chk('picks');showFAQ();chk('faq');document.querySelector('#tc').style.display='none';showInvite();chk('invite');document.querySelector('#tc').style.display='none';showWhatsNew();chk('whatsnew');document.querySelector('#tc').style.display='none';showTerms(true);chk('terms');document.querySelector('#tc').style.display='none';document.querySelector('#gear').click();chk('settings');return r});out.xpVisible=pages;
out.errs=errs;all[f]=out;await ctx.close()}
// a player who agreed to Terms 1.1 is not asked again
const ctx=await b.newContext();const p=await ctx.newPage();await p.goto('file://'+ROOT+'dist/stockgpt-share.html');await p.evaluate(()=>{localStorage.setItem('stockgpt:age',JSON.stringify({ok:1,t:Date.now()}));localStorage.setItem('stockgpt:terms',JSON.stringify({v:'1.1',t:new Date().toISOString()}))});await p.reload();await W(900);
all.terms11=await p.evaluate(()=>({termsOK:termsOK(),screen:document.querySelector('#tc').style.display=='flex'?document.querySelector('#tc h2').textContent:'none'}));
console.log(JSON.stringify(all,null,1));await b.close()})().catch(e=>{console.log('FATAL',e.message.slice(0,600));process.exit(1)});
