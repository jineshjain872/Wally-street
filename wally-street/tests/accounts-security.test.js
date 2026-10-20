const ROOT=require('path').resolve(__dirname,'..')+'/';
const {chromium}=require('playwright');
const F='file://'+ROOT+'dist/'+(process.argv[2]||'stockgpt-share.html');
const fake=`(()=>{const M=window.__M=new Map();const doc=p=>({get:async()=>{const v=M.get(p);return{exists:!!v,data:()=>v&&JSON.parse(v)}},set:async v=>{M.set(p,JSON.stringify(v))},delete:async()=>{M.delete(p)}});
 window.claude={use:n=>Promise.resolve(n=='db'?{doc}:n=='user'?{id:()=>Promise.resolve('u_test123')}:null)}})()`;
async function terms(p){await p.waitForTimeout(400);if(await p.$('#agi')){await p.fill('#agi','20');await p.click('#agok');await p.waitForTimeout(300)}if(await p.$('#agi')){await p.fill('#agi','20');await p.click('#agok');await p.waitForTimeout(300)}await p.evaluate(()=>{const e=document.querySelector('#tcs');e.scrollTop=e.scrollHeight});await p.waitForTimeout(150);await p.click('#tca');await p.waitForTimeout(300);await p.evaluate(()=>{const k=document.querySelector('#suskip');if(k)k.click();showGate('in')});await p.waitForTimeout(400);if(await p.$('#ckno')&&await p.$eval('#ckb',e=>e.style.display!='none'))await p.click('#ckno')}
async function gate(p,mode,u,pw,pw2){if(mode=='up')await p.click('[data-gm=up]');await p.fill('#gu',u);await p.fill('#gp',pw);if(mode=='up')await p.fill('#gp2',pw2||pw);await p.evaluate(()=>{const g=document.querySelector('#gagree');if(g&&!g.checked)g.click()});await p.check('#gkeep');await p.click('#gok');await p.waitForFunction(()=>{const b=document.querySelector('#gok');return document.querySelector('#gate').style.display=='none'||(b&&!b.disabled)},null,{timeout:20000});await p.waitForTimeout(200);return p.evaluate(()=>document.querySelector('#gate').style.display=='none'?'(logged in as '+(ACC&&ACC.name)+')':document.querySelector('#ge').textContent)}
(async()=>{const b=await chromium.launch({...(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),args:['--no-sandbox']});const out={};
// ---- A: local accounts
let ctx=await b.newContext();let p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto(F);await terms(p);
out.weak=await gate(p,'up','alice_1','password1');
await p.evaluate(()=>{for(let i=0;i<3;i++);});await p.waitForTimeout(1600);
out.strong=await gate(p,'up','alice_1','Tr4de-Smart-99');
out.gateHidden=await p.$eval('#gate',e=>e.style.display);
out.sess=await p.evaluate(()=>localStorage.getItem('stockgpt:sess'));
out.rec=await p.evaluate(()=>{const r=JSON.parse(localStorage.getItem('stockgpt:acct:'+ACC.uid));return {kdf:r.kdf&&r.kdf.i,salt:!!(r.kdf&&r.kdf.s)}});
await p.reload();await p.waitForTimeout(1500);out.autoLogin=await p.evaluate(()=>ACC&&ACC.name);
await p.evaluate(()=>logout());await p.waitForTimeout(1600);
out.wrongPw=await gate(p,'in','alice_1','nope-nope-1');await p.waitForTimeout(1600);
out.noUser=await gate(p,'in','bob_nobody','whatever12');await p.waitForTimeout(1600);
out.rightPw=await gate(p,'in','alice_1','Tr4de-Smart-99');
// ---- B: malicious backup (XSS + prototype pollution)
await p.evaluate(()=>logout());await p.waitForTimeout(300);await p.click('#ggu').catch(()=>{});
await p.evaluate(()=>{document.querySelector('#gate').style.display='none'});
const evil=JSON.stringify({app:'wally-street',S:{name:'<img src=x onerror="window.__pwn=1">',streak:'<img src=x onerror="window.__pwn=2">',xp:'1e99',__proto__:{polluted:1},done:['<b>',1,2]},X:{cash:'<svg onload=window.__pwn=3>',pos:{'<img src=x onerror=window.__pwn=4>':{sh:1,c:1},NVDA:{sh:2,c:400}}}});
await p.evaluate(async t=>{await applyBackup(JSON.parse(t))},evil).catch(e=>out.bkErr=e.message);
await p.click('[data-t=prac]');await p.waitForTimeout(300);await p.click('#gear');await p.waitForTimeout(300);await p.click('#acx');
out.xss=await p.evaluate(()=>({pwn:window.__pwn||0,name:S.name,streak:S.streak,xp:S.xp,cash:X.cash,pos:Object.keys(X.pos),polluted:({}).polluted||S.polluted||0,done:S.done}));
// ---- C: legacy account + legacy session migration
await ctx.close();ctx=await b.newContext();p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto(F);await terms(p);
await p.evaluate(async()=>{const n='olduser',pw='oldpass1',uid=await uidOf(n);const m=await crypto.subtle.importKey('raw',te.encode(pw),'PBKDF2',false,['deriveKey']);
 const k=await crypto.subtle.deriveKey({name:'PBKDF2',salt:te.encode('stockgpt-salt:'+n),iterations:150000,hash:'SHA-256'},m,{name:'AES-GCM',length:256},true,['encrypt','decrypt']);
 const S0=cleanS({name:'Old',xp:777});localStorage.setItem('stockgpt:acct:'+uid,JSON.stringify({...await seal(k,{S:S0,X:{cash:5e4,pos:{}}}),t:Date.now()}));
 localStorage.setItem('stockgpt:sess',JSON.stringify({iat:Date.now(),name:n,uid,jwk:await crypto.subtle.exportKey('jwk',k)}))});
await p.reload();await p.waitForTimeout(2000);
out.legacySess=await p.evaluate(()=>({acc:ACC&&ACC.name,xp:S.xp,jwkGone:!/jwk/.test(localStorage.getItem('stockgpt:sess')||'')}));
await p.evaluate(()=>logout());await p.waitForTimeout(300);
out.legacyLogin=await gate(p,'in','olduser','oldpass1');
out.legacyUpg=await p.evaluate(async()=>{const r=JSON.parse(localStorage.getItem('stockgpt:acct:'+await uidOf('olduser')));return {i:r.kdf&&r.kdf.i,xp:S.xp}});
await ctx.close();
// ---- D: cloud move to private storage (fake db)
ctx=await b.newContext();await ctx.addInitScript(fake);p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));
await p.goto(F);await terms(p);
await p.evaluate(async()=>{const n='clouduser',pw='cloudpass9',uid=await uidOf(n);const m=await crypto.subtle.importKey('raw',te.encode(pw),'PBKDF2',false,['deriveKey']);
 const k=await crypto.subtle.deriveKey({name:'PBKDF2',salt:te.encode('stockgpt-salt:'+n),iterations:150000,hash:'SHA-256'},m,{name:'AES-GCM',length:256},true,['encrypt','decrypt']);
 window.__M.set('acct/'+uid,JSON.stringify({...await seal(k,{S:cleanS({name:'Cloudy',xp:4321}),X:{cash:1e5,pos:{}}}),t:Date.now()}))});
out.cloudLogin=await gate(p,'in','clouduser','cloudpass9');
out.cloud=await p.evaluate(async()=>{const uid=await uidOf('clouduser');return {keys:[...window.__M.keys()],xp:S.xp,priv:JSON.parse(window.__M.get('data/users/u_test123/'+uid)||'{}').kdf}});
out.errs=errs;console.log(JSON.stringify(out,null,1));await b.close()})();
