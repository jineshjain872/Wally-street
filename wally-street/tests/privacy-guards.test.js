const ROOT=require('path').resolve(__dirname,'..')+'/';
const {chromium}=require('playwright');
const fake=`(()=>{const M=window.__M=new Map();const doc=p=>({get:async()=>{const v=M.get(p);return{exists:!!v,data:()=>v&&JSON.parse(v)}},set:async v=>{M.set(p,JSON.stringify(v))},delete:async()=>{M.delete(p)}});
 window.claude={use:n=>Promise.resolve(n=='db'?{doc}:n=='user'?{id:()=>Promise.resolve('u_test123')}:null)}})()`;
(async()=>{const b=await chromium.launch({...(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),args:['--no-sandbox']});const out={};
const ctx=await b.newContext({viewport:{width:390,height:844}});await ctx.addInitScript(fake);const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+ROOT+'dist/stockgpt-share.html');await p.waitForTimeout(400);await p.fill('#agi','20');await p.click('#agok');await p.waitForTimeout(300);
await p.evaluate(()=>{const e=document.querySelector('#tcs');e.scrollTop=e.scrollHeight});await p.waitForTimeout(200);await p.click('#tca');await p.waitForTimeout(300);await p.evaluate(()=>{const k=document.querySelector('#suskip');if(k)k.click();showGate('in')});await p.waitForTimeout(400);
out.keepDefault=await p.$eval('#gkeep',e=>e.checked);
await p.click('[data-gm=up]');await p.fill('#gu','dana_9');await p.fill('#gp','Green-Bull-42');await p.fill('#gp2','Green-Bull-42');await p.evaluate(()=>{const g=document.querySelector('#gagree');if(g&&!g.checked)g.click()});await p.click('#gok');
await p.waitForFunction(()=>document.querySelector('#gate').style.display=='none',null,{timeout:20000});await p.waitForTimeout(700);await p.evaluate(()=>{const x=document.querySelector('#tyx');if(x)x.click()});
out.gateCleared=await p.$eval('#gate',e=>e.innerHTML.length);out.lastName=await p.evaluate(()=>localStorage.getItem('stockgpt:last'));
// chat secrets
await p.click('[data-t=chat]');const msgs=[];
for(const q of ['My card is 4111 1111 1111 1111','my password is hunter22','PAN ABCDE1234F please check','What is 1234 times 10?','Apple has 15000000000 shares, is that a lot?']){await p.fill('#in',q);await p.press('#in','Enter');await p.waitForTimeout(3200);msgs.push(await p.$$eval('#msgs .m',x=>x.slice(-2).map(e=>e.textContent.slice(0,70))))}
out.chat=msgs;out.secretsInHist=await p.evaluate(()=>JSON.stringify(hist).includes('4111'));
// password change lockout
await p.click('#gear');await p.waitForTimeout(200);const pc=[];
for(let i=0;i<6;i++){await p.fill('#op','wrong-pass-'+i);await p.fill('#np','Another-Pass-77');await p.click('[data-pw]');await p.waitForTimeout(1700);pc.push(await p.$eval('#am',e=>e.textContent))}
out.pwChange=pc;out.opCleared=await p.$eval('#op',e=>e.value);
await p.evaluate(()=>localStorage.removeItem('stockgpt:rl'));
// delete account
const uid=await p.evaluate(()=>ACC.uid);out.beforeDel=await p.evaluate(u=>({local:!!localStorage.getItem('stockgpt:acct:'+u),cloud:[...window.__M.keys()]}),uid);
await p.click('[data-del]');out.del1=await p.$eval('#am',e=>e.textContent);
await p.fill('#op','Green-Bull-42');await p.click('[data-del]');await p.waitForSelector('.cfm');out.del2=await p.$eval('.cfm',e=>e.innerText.replace(/\n+/g,' | '));await p.click('.cfm [data-cf="0"]');out.delCancelled=await p.evaluate(()=>!!ACC);
await p.fill('#op','Green-Bull-42');await p.click('[data-del]');await p.waitForSelector('.cfm');await p.click('.cfm [data-cf="1"]');await p.waitForTimeout(2500);
out.afterDel=await p.evaluate(u=>({acc:!!ACC,local:!!localStorage.getItem('stockgpt:acct:'+u),cloud:[...window.__M.keys()],msg:document.querySelector('#ge')&&document.querySelector('#ge').textContent}),uid);
// idle sign-out
await p.fill('#gu','erin_5');await p.click('[data-gm=up]');await p.fill('#gu','erin_5');await p.fill('#gp','Quiet-Owl-58');await p.fill('#gp2','Quiet-Owl-58');await p.evaluate(()=>{const g=document.querySelector('#gagree');if(g&&!g.checked)g.click()});await p.click('#gok');
await p.waitForFunction(()=>document.querySelector('#gate').style.display=='none',null,{timeout:20000});
await p.evaluate(()=>{LASTACT=Date.now()-31*6e4});await p.waitForTimeout(61500);
out.idle=await p.evaluate(()=>({acc:!!ACC,msg:document.querySelector('#ge')&&document.querySelector('#ge').textContent}));
out.errs=errs;console.log(JSON.stringify(out,null,1));await b.close()})();
