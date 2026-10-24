const ROOT=require('path').resolve(__dirname,'..')+'/';
// the Learn page is the winding lesson path again, and right or wrong answers show no emoji faces
const {chromium,devices}=require('playwright');const W=ms=>new Promise(r=>setTimeout(r,ms));
const ok=(c,m)=>{if(!c)throw new Error('FAILED: '+m)};const C=(p,s)=>p.evaluate(s=>{const e=document.querySelector(s);if(e)e.click();return !!e},s);
(async()=>{const b=await chromium.launch({...(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),args:['--no-sandbox']});const all={};
for(const [f,o] of [['stockgpt-share.html',{...devices['iPhone 13'],colorScheme:'dark'}],['stockgpt-share.html',{...devices['iPhone 13'],colorScheme:'light'}],['stockgpt-laptop.html',{viewport:{width:1366,height:850},colorScheme:'dark'}],['wally-street.html',{viewport:{width:320,height:700}}]]){
const ctx=await b.newContext(o);await ctx.route(/fonts\./,r=>r.abort());const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));const out={};
await p.goto('file://'+ROOT+'dist/'+f);await W(500);
await p.evaluate(()=>{document.querySelector('#agi').value='20';document.querySelector('#agok').click()});await W(200);await C(p,'#tca');await W(200);await C(p,'#suskip');await W(3600);await C(p,'#ckno');
await p.evaluate(()=>{S.done=[0,1,32,33,220,100,101,102];S.xp=500;S.hr=5;save();head();renderLearn()});await W(300);
out.path=await p.evaluate(()=>({mods:document.querySelectorAll('#learn .mod, #learn .mhd').length,units:document.querySelectorAll('#learn .unit').length,paths:document.querySelectorAll('#learn .path').length,
  steps:document.querySelectorAll('#learn .path .step').length,round:getComputedStyle(document.querySelector('#learn .node')).borderRadius,wind:new Set([...document.querySelectorAll('#learn .step')].map(e=>e.style.transform)).size,
  go:[...document.querySelectorAll('#learn .go')].map(g=>g.parentNode.querySelector('.node').dataset.i),rev:[...document.querySelectorAll('#learn .node')].filter(n=>n.textContent.trim()=='🔁'||+n.dataset.i>=200).map(n=>n.dataset.i)}));
ok(out.path.mods==0,'no course outline left');ok(out.path.units>=5&&out.path.paths==out.path.units&&out.path.steps>=30,'the winding path is back '+JSON.stringify(out.path));
ok(out.path.wind>=3,'nodes zig-zag down the page');ok(/px|%/.test(out.path.round)&&parseFloat(out.path.round)>=20,'round nodes '+out.path.round);
ok(out.path.rev.includes('220')&&out.path.rev.includes('200'),'revision lessons sit on the path');
ok(out.path.go.includes('103'),'the next strategy lesson has the Start bubble '+out.path.go);
// a node starts its lesson
await p.evaluate(()=>document.querySelector('#learn .node[data-i="103"]').click());await W(250);out.started=await p.evaluate(()=>lid);ok(out.started==103,'node starts the lesson');
// right and wrong answers: no emoji faces, but the mascot still reacts
await C(p,'#ft #st');await W(120);
await p.evaluate(()=>{const c=opts.indexOf(Q[qi][1]);document.querySelector(`#qb .opt[data-o="${c}"]`).click();document.querySelector('#ft #chk').click()});await W(150);
out.right=await p.evaluate(()=>({mfx:document.querySelectorAll('.mfx').length,mascot:document.querySelector('#qb .mrow .mas').className,ft:document.querySelector('#ft').className}));
await C(p,'#ft #nx');await W(120);
await p.evaluate(()=>{const c=opts.indexOf(Q[qi][1]);document.querySelector(`#qb .opt[data-o="${(c+1)%opts.length}"]`).click();document.querySelector('#ft #chk').click()});await W(150);
out.wrong=await p.evaluate(()=>({mfx:document.querySelectorAll('.mfx').length,mascot:document.querySelector('#qb .mrow .mas').className,emoji:/[\u{1F600}-\u{1F64F}]/u.test(document.querySelector('#ls').innerText)}));
ok(out.right.mfx==0&&out.wrong.mfx==0&&!out.wrong.emoji,'no emoji faces');ok(/hap/.test(out.right.mascot)&&/sad/.test(out.wrong.mascot),'mascot still reacts');
await p.evaluate(()=>quit());await W(300);
// overflow on small screens
out.overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1?[...document.querySelectorAll('#learn .path *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).map(e=>e.className).slice(0,5):0);
await p.evaluate(()=>{document.querySelector('#learn .unit').scrollIntoView({block:'start'})});await W(300);
const tag=f.replace('.html','')+'-'+(o.colorScheme||'light')+'-'+(o.viewport?o.viewport.width:'phone');await p.screenshot({path:'shots/77-path-'+tag+'.png'});
ok(!out.overflow,'no sideways scrolling '+out.overflow);out.errs=errs;ok(!errs.length,'no page errors '+errs.join(' | '));all[tag]=out;await ctx.close()}
console.log(JSON.stringify(all,null,1));console.log('ALL OK');await b.close()})().catch(e=>{console.log(e.message.slice(0,1500));process.exit(1)});
