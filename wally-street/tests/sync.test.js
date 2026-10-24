const ROOT=require('path').resolve(__dirname,'..')+'/';
// sync across devices: sign up on one device, log in on another, change the password, delete the account
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');const W=ms=>new Promise(r=>setTimeout(r,ms));
const ok=(c,m)=>{if(!c)throw new Error('FAILED: '+m)};
const DS=[__dirname+'/sync-server/dev-server.mjs',__dirname+'/../sync-server/dev-server.mjs'].find(f=>fs.existsSync(f));
const PORT=8788,URLS='http://127.0.0.1:'+PORT;
async function terms(p){await W(400);await p.evaluate(()=>{const a=document.querySelector('#agi');if(a){a.value='20';document.querySelector('#agok').click()}});await W(300);
 await p.evaluate(()=>{const t=document.querySelector('#tca');if(t)t.click()});await W(300);await p.evaluate(()=>{const k=document.querySelector('#suskip');if(k)k.click();showGate('in')});await W(400);
 await p.evaluate(()=>{const c=document.querySelector('#ckno');if(c&&c.offsetParent)c.click()})}
async function gate(p,mode,u,pw){if(mode=='up')await p.evaluate(()=>document.querySelector('[data-gm=up]').click());await W(100);
 await p.fill('#gu',u);await p.fill('#gp',pw);if(mode=='up')await p.fill('#gp2',pw);
 await p.evaluate(()=>{const g=document.querySelector('#gagree');if(g&&!g.checked)g.click();const k=document.querySelector('#gkeep');if(k&&!k.checked)k.click();document.querySelector('#gok').click()});
 await p.waitForFunction(()=>{const b=document.querySelector('#gok');return document.querySelector('#gate').style.display=='none'||(b&&!b.disabled)},null,{timeout:30000});await W(300);
 return p.evaluate(()=>document.querySelector('#gate').style.display=='none'?'in:'+(ACC&&ACC.name):document.querySelector('#ge').textContent)}
async function playLesson(p,id){await p.evaluate(id=>start(id),id);for(let n=0;n<60;n++){await W(80);
  if(await p.evaluate(()=>{const b=document.querySelector('#ft #st');if(b){b.click();return 1}return 0}))continue;
  if(await p.$('#ft #fin')){await p.evaluate(()=>document.querySelector('#ft #fin').click());return 'end'}
  if(await p.evaluate(()=>{const b=document.querySelector('#ft #nx');if(b){b.click();return 1}return 0}))continue;
  await p.evaluate(()=>{const c=opts.indexOf(Q[qi][1]);document.querySelector(`#qb .opt[data-o="${c}"]`).click();document.querySelector('#ft #chk').click()})}return 'loop'}
(async()=>{const {start,memoryKV}=await import(DS);const env={WALLY:memoryKV()};let puts=0;
 const srv=await start(PORT,env);srv.server.on('request',req=>{if(req.method=='PUT')puts++});
 // a test copy of the download file that points at the local sync server
 let h=fs.readFileSync(ROOT+'dist/wally-street.html','utf8');ok(h.includes("const SYNC_URL='';"),'build has an empty SYNC_URL by default');
 h=h.replace("const SYNC_URL='';","const SYNC_URL='"+URLS+"';").replace("connect-src 'none'","connect-src "+URLS);const T=path.resolve('sync-test.html');fs.writeFileSync(T,h);
 const b=await chromium.launch({...(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),args:['--no-sandbox']});const out={},errs=[];
 const dev=async()=>{const c=await b.newContext({viewport:{width:390,height:844}});await c.route(/fonts\./,r=>r.abort());const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));await p.goto('file://'+T);await terms(p);return p};
 // without a sync server the plain download file still says "this device only"
 {const c=await b.newContext();const p=await c.newPage();await p.goto('file://'+ROOT+'dist/wally-street.html');await terms(p);out.plain=await p.$eval('#gst',e=>e.textContent);await c.close()}
 ok(!/Sync is on/.test(out.plain),'no sync without a server');
 // device A signs up
 const A=await dev();out.gateA=await A.$eval('#gst',e=>e.textContent);ok(/Sync is on/.test(out.gateA),'gate says sync is on');
 out.signup=await gate(A,'up','sync_ana','Tr4de-Smart-99');ok(out.signup=='in:sync_ana','sign up '+out.signup);
 const id=await A.evaluate(()=>ACC.uid);let rec=await env.WALLY.get('acct:'+id,'json');
 ok(rec&&/^[0-9a-f]{64}$/.test(rec.auth)&&rec.data.iv&&rec.data.d,'server has the encrypted save');
 const raw=env.WALLY.map.get('acct:'+id).value;ok(!/sync_ana|Tr4de|"done"|"xp"/.test(raw),'server copy has no username, password or progress in plain text');
 out.settings=await A.evaluate(()=>syncTxt());
 // A finishes a lesson and saves
 out.lessonA=await playLesson(A,0);await W(300);await A.evaluate(async()=>{REMLAST=0;await pushAcc()});
 const a1=await A.evaluate(()=>({done:S.done.slice(),xp:S.xp}));out.a1=a1;ok(a1.done.includes(0),'lesson done on A');
 // uploads are spaced out while playing
 const p0=puts;await A.evaluate(async()=>{REMLAST=Date.now();await pushAcc();await pushAcc()});await W(200);out.throttled={puts:puts-p0,timer:await A.evaluate(()=>!!REMTIMER)};ok(out.throttled.puts==0&&out.throttled.timer,'saves while playing wait up to a minute');
 await A.evaluate(()=>{clearTimeout(REMTIMER);REMTIMER=0;REMLAST=0});
 // device B logs in and gets the same progress
 const B=await dev();out.loginB=await gate(B,'in','sync_ana','Tr4de-Smart-99');ok(out.loginB=='in:sync_ana','login on B '+out.loginB);
 const b1=await B.evaluate(()=>({done:S.done.slice(),xp:S.xp}));out.b1=b1;ok(b1.done.includes(0)&&b1.xp==a1.xp,'B has A\'s progress');
 // B plays another lesson; A picks it up when it syncs
 out.lessonB=await playLesson(B,1);await W(300);await B.evaluate(async()=>{REMLAST=0;await pushAcc()});await A.evaluate(()=>syncFromCloud());await W(500);
 out.aAfterB=await A.evaluate(()=>S.done.slice());ok(out.aAfterB.includes(1),'A picks up B\'s lesson');
 // device C: wrong password
 const C=await dev();out.wrongC=await gate(C,'in','sync_ana','not-the-password-1');ok(/Wrong username or password/.test(out.wrongC),'wrong password refused');
 out.fails=await env.WALLY.get('fail:'+id);ok(out.fails=='1','wrong password counted on the server');
 // A changes the password
 await A.evaluate(()=>document.querySelector('#gear').click());await W(400);
 await A.evaluate(()=>{document.querySelector('#op').value='Tr4de-Smart-99';document.querySelector('#np').value='N3w-Better-Pass-7';document.querySelector('[data-pw]').click()});
 await A.waitForFunction(()=>/Password changed|Could not reach/.test(document.querySelector('#am').textContent),null,{timeout:30000});out.pwMsg=await A.$eval('#am',e=>e.textContent);
 ok(/Password changed/.test(out.pwMsg),'password changed '+out.pwMsg);rec=await env.WALLY.get('acct:'+id,'json');out.authRotated=rec.auth;
 // B still has the old key: its next sync asks it to log in again
 await B.evaluate(()=>syncFromCloud());await W(800);out.bForced=await B.evaluate(()=>({acc:!!ACC,gate:document.querySelector('#gate').style.display,msg:(document.querySelector('#ge')||{}).textContent}));
 ok(!out.bForced.acc&&/changed on another device/.test(out.bForced.msg),'B is asked to log in again '+JSON.stringify(out.bForced));
 // the old password no longer works anywhere; the new one does
 await W(1600);out.oldPw=await gate(C,'in','sync_ana','Tr4de-Smart-99');ok(/Wrong username or password/.test(out.oldPw),'old password refused');
 await W(1600);out.newPw=await gate(C,'in','sync_ana','N3w-Better-Pass-7');ok(out.newPw=='in:sync_ana','new password works on C');
 out.c1=await C.evaluate(()=>S.done.slice());ok(out.c1.includes(0)&&out.c1.includes(1),'C has all the progress');
 // staying signed in keeps sync working after a reload
 await A.reload();await W(2500);out.reloadA=await A.evaluate(()=>({acc:ACC&&ACC.name,tok:REMTOK.length,remote:cloud===REMOTE}));ok(out.reloadA.acc=='sync_ana'&&out.reloadA.tok==64&&out.reloadA.remote,'reload keeps sync '+JSON.stringify(out.reloadA));
 // A deletes the account: the server copy goes too
 await A.evaluate(()=>{document.querySelector('#gear').click()});await W(400);
 await A.evaluate(()=>{document.querySelector('#op').value='N3w-Better-Pass-7';document.querySelector('[data-del]').click()});await W(300);
 await A.evaluate(()=>{const y=document.querySelector('[data-cf="1"]');if(y)y.click()});await W(2500);
 out.deleted=!(await env.WALLY.get('acct:'+id));ok(out.deleted,'server copy deleted');
 const D=await dev();out.afterDel=await gate(D,'in','sync_ana','N3w-Better-Pass-7');ok(/Wrong username or password/.test(out.afterDel),'deleted account cannot log in');
 // the server itself: wrong keys get locked out, bad requests are refused
 const k='a'.repeat(64),id2='b'.repeat(32),api=(m,key,body)=>fetch(URLS+'/v1/accounts/'+id2,{method:m,headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});
 out.create=(await api('PUT',k,{data:{iv:'x',d:'y'}})).status;
 out.noAuth=(await fetch(URLS+'/v1/accounts/'+id2)).status;out.badSave=(await api('PUT',k,{data:'nope'})).status;out.huge=(await api('PUT',k,{data:{iv:'x',d:'y'.repeat(700000)}})).status;
 out.rightKey=(await api('GET',k)).status;let st=[];for(let i=0;i<11;i++)st.push((await api('GET','c'.repeat(64))).status);out.lock=st.join(',');out.lockedRight=(await api('GET',k)).status;
 ok(out.rightKey==200&&out.lockedRight==429,'locked account refuses even the right key for 15 minutes');
 ok(out.create==200&&st.slice(0,10).every(x=>x==403)&&st[10]==429&&out.noAuth==401&&out.badSave==400&&out.huge==413,'server checks '+JSON.stringify([out.create,out.lock,out.noAuth,out.badSave,out.huge]));
 out.errs=errs;ok(!errs.length,'no page errors '+errs.join(' | '));
 console.log(JSON.stringify(out,null,1));console.log('ALL OK');await b.close();srv.server.close();try{fs.unlinkSync(T)}catch(e){}})().catch(e=>{console.log(e.message.slice(0,1500));process.exit(1)});
