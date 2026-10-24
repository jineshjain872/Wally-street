const ROOT=require('path').resolve(__dirname,'..')+'/';
// 64 lessons in 16 units, and a revision at the end of every unit that mixes in questions from earlier units
const {chromium,devices}=require('playwright');const W=ms=>new Promise(r=>setTimeout(r,ms));
const ok=(c,m)=>{if(!c)throw new Error('FAILED: '+m)};
async function play(p){for(let n=0;n<80;n++){await W(90);if(await p.evaluate(()=>{const b=document.querySelector('#ft #st');if(b){b.click();return 1}return 0}))continue;if(await p.$('#ft #fin'))return 'end';
 if(await p.evaluate(()=>{const b=document.querySelector('#ft #nx');if(b){b.click();return 1}return 0}))continue;
 const i=await p.evaluate(()=>opts.indexOf(Q[qi][1]));await p.evaluate(i=>{document.querySelector(`#qb .opt[data-o="${i}"]`).click();document.querySelector('#ft #chk').click()},i)}return 'loop'}
(async()=>{const b=await chromium.launch({...(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),args:['--no-sandbox']});const all={};
for(const [f,o] of [['stockgpt-share.html',{...devices['iPhone 13']}],['wally-street.html',{viewport:{width:1366,height:800}}],['stockgpt-laptop.html',{viewport:{width:1366,height:800}}]]){
const ctx=await b.newContext(o);await ctx.route(/fonts\./,r=>r.abort());const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));const out={};
await p.goto('file://'+ROOT+'dist/'+f);await W(500);
await p.evaluate(()=>{document.querySelector('#agi').value='20';document.querySelector('#agok').click()});await W(200);await p.evaluate(()=>document.querySelector('#tca').click());await W(200);await p.evaluate(()=>document.querySelector('#suskip').click());await W(300);
const st=await p.evaluate(()=>{const core=U.filter(u=>!u.india);return {F:F.length,ST:ST.length,total:F.length+ST.length,units:core.length+2,perUnit:core.map(u=>u.L.length),india:INDIA_IDS.length,
 levels:LEVELS4.map(l=>l.ids.length),revs:ORD.filter(i=>i>=200).length+1,ordLessons:ORD.filter(i=>i<200).length,chOk:F.every((l,i)=>typeof CH[i]=='string'&&CH[i].length>40),
 qOk:F.every(l=>l.q.length>=3&&l.q.every(q=>q.length>=3&&q.slice(1).every(x=>typeof x=='string'&&x))),dupNames:F.length-new Set(F.map(l=>l.n)).size,
 lastOfUnit:core.map((u,ui)=>{const ids=u.L.map(l=>F.indexOf(l));return ORD[ORD.indexOf(ids[ids.length-1])+1]===220+ui}).every(Boolean),
 stratAfterU1:ORD.slice(ORD.indexOf(220)+1,ORD.indexOf(220)+8).join(','),oldIdsKept:F[0].n=='What is a stock?'&&F[27].n=='Behavior'&&F[28].n.startsWith('SIPs')&&F[31].n.startsWith('Tax'),revAfterIndia:REVAFTER[INDIA_IDS[7]]==40}});
out.structure=st;
ok(st.total==64,'64 lessons, got '+st.total);ok(st.units==16,'16 units');ok(st.revs==16,'16 revisions, got '+st.revs);ok(st.chOk&&st.qOk,'every lesson has a chapter and well-formed questions');ok(st.dupNames==0,'no duplicate lesson names');
ok(st.lastOfUnit,'each core unit is followed by its revision');ok(st.stratAfterU1=='100,101,102,103,104,105,200','strategies follow the unit 1 revision');ok(st.oldIdsKept,'old lesson ids unchanged');ok(st.revAfterIndia,'India revision follows the India unit');
// the whole path, unlocked
await p.evaluate(()=>{S.done=ORD.concat(INDIA_IDS,[240]);save();renderLearn()});await W(250);
out.nodes=await p.evaluate(()=>({nodes:document.querySelectorAll('#learn .path .node').length,revNodes:[...document.querySelectorAll('#learn .path .node')].filter(n=>+n.dataset.i>=200).length,labels:[...document.querySelectorAll('#learn .path .lbl')].map(e=>e.textContent).filter(t=>/revision/i.test(t))}));
ok(out.nodes.nodes==80,'80 nodes on the path (64 lessons + 16 revisions), got '+out.nodes.nodes);ok(out.nodes.revNodes==16,'16 revision nodes');
// gates: unit 1 lessons done -> its revision open, strategies locked until it is done
await p.evaluate(()=>{S.done=U[0].L.map(l=>F.indexOf(l));save();renderLearn()});
out.gate=await p.evaluate(()=>({rev1:pathOpen(220),s1:pathOpen(100),u2:pathOpen(F.indexOf(U[1].L[0])),india1:pathOpen(INDIA_IDS[0]),india2:pathOpen(INDIA_IDS[1]),indiaRev:pathOpen(240)}));
ok(out.gate.rev1&&!out.gate.s1&&!out.gate.u2&&out.gate.india1&&!out.gate.india2&&!out.gate.indiaRev,'gates '+JSON.stringify(out.gate));
// unit 1 revision: no earlier units, so 10 questions all from unit 1
await p.evaluate(()=>start(220));await W(250);
out.r1=await p.evaluate(()=>{const u1=new Set(U[0].L.flatMap(l=>l.q));return {n:Q.length,allU1:Q.every(q=>u1.has(q)),recap:[...document.querySelectorAll('#qb .rc li b')].map(e=>e.textContent),intro:document.querySelector('#qb .bub').textContent,title:document.querySelector('#qb h2').textContent}});
ok(out.r1.n==10&&out.r1.allU1&&out.r1.recap.length==4,'unit 1 revision '+JSON.stringify(out.r1));
out.r1play=await play(p);await p.evaluate(()=>document.querySelector('#ft #fin').click());await W(300);ok(await p.evaluate(()=>S.done.includes(220)&&pathOpen(100)),'unit 1 revision done opens strategies');
// unit 14 revision: covers unit 14 and mixes in at least 8 earlier units
await p.evaluate(()=>{S.done=ORD.slice(0,ORD.indexOf(233));save()});
const r14=[];for(let t=0;t<4;t++){await p.evaluate(()=>start(233));await W(150);r14.push(await p.evaluate(()=>{const u=revUnits(),cur=new Set(U[13].L.flatMap(l=>l.q));const from=new Set(Q.map(q=>u.findIndex(x=>x.ls.some(l=>l.q.includes(q)))));return {n:Q.length,cur:Q.filter(q=>cur.has(q)).length,units:from.size,curLessons:U[13].L.filter(l=>l.q.some(q=>Q.includes(q))).length,earlier:[...from].filter(i=>i>=0&&u[i].k!=33).sort((a,b)=>a-b).join(',')}}));await p.evaluate(()=>quit());await W(100)}
out.r14=r14;ok(r14.every(r=>r.n==14&&r.cur==6&&r.curLessons==4&&r.units==9),'unit 14 revision mixes '+JSON.stringify(r14));ok(new Set(r14.map(r=>r.earlier)).size>1,'a different mix of earlier units each time');
await p.evaluate(()=>start(233));await W(150);out.r14recap=await p.evaluate(()=>[document.querySelector('#qb .rc + p')&&document.querySelector('#qb .rc + p').textContent,document.querySelector('#qb .bub').textContent]);await p.evaluate(()=>quit());
// strategies revision mixes strategies with unit 1, plus 2 chart questions
await p.evaluate(()=>start(200));await W(150);out.rs=await p.evaluate(()=>{const s=new Set(ST.flatMap(e=>e.q)),u1=new Set(U[0].L.flatMap(l=>l.q));return {n:Q.length,st:Q.filter(q=>s.has(q)).length,u1:Q.filter(q=>u1.has(q)).length,charts:Q.filter(q=>q.k=='Chart reading').length}});await p.evaluate(()=>quit());
ok(out.rs.st>=6&&out.rs.u1>=1&&out.rs.charts==2,'strategies revision '+JSON.stringify(out.rs));
// India revision: all 8 India lessons, plus earlier units
await p.evaluate(()=>{S.done=ORD.slice(0,12).concat(INDIA_IDS);save()});await p.evaluate(()=>start(240));await W(150);
out.ri=await p.evaluate(()=>{const ind=new Set(INDIA_IDS.flatMap(i=>F[i].q));return {n:Q.length,ind:Q.filter(q=>ind.has(q)).length,name:document.querySelector('#qb h2').textContent}});
ok(out.ri.ind==8&&out.ri.n>=10,'India revision '+JSON.stringify(out.ri));out.riplay=await play(p);await p.evaluate(()=>document.querySelector('#ft #fin').click());await W(200);
// a brand-new lesson plays like any other (10 questions, coins, done)
await p.evaluate(()=>{S.done=[0,1];S.hr=5;save()});const nid=await p.evaluate(()=>F.indexOf(U[0].L[2]));await p.evaluate(id=>start(id),nid);await W(150);
out.newLesson=await p.evaluate(()=>({h:document.querySelector('#qb h2').textContent,story:document.querySelector('#qb .story').textContent.slice(0,60)}));out.newPlay=await play(p);
out.newDone=await p.evaluate(id=>S.done.includes(id),nid);await p.evaluate(()=>document.querySelector('#ft #fin').click());ok(out.newDone,'new lesson completes');
// placement test marks Level 1, the strategies and their revisions done
await p.evaluate(()=>{S.done=[];S.pt=0;save()});await p.evaluate(()=>start(0,'pt'));out.pt=await play(p);await p.evaluate(()=>document.querySelector('#ft #fin').click());await W(200);
out.ptDone=await p.evaluate(()=>({lv1:LEVELS4[0].ids.every(i=>S.done.includes(i)),revs:S.done.filter(i=>i>=200).sort(),next:lessonName(nextLesson())}));
ok(out.ptDone.lv1&&out.ptDone.revs.join()=='200,220,221,222,223','placement test '+JSON.stringify(out.ptDone));
// returning player with the old structure: progress still counts, new lessons show as next
await p.evaluate(()=>{S.done=[0,1,100,101,102,103,104,105,200,2,3,201,4,5,6,7,202,8,9];save();renderLearn()});out.returning=await p.evaluate(()=>({next:lessonName(nextLesson()),cta:document.querySelector('#cta').textContent}));
await p.evaluate(()=>{S.done=U[0].L.map(l=>F.indexOf(l));save();renderLearn();document.querySelector('.node[data-i="220"]').scrollIntoView({block:'center'})});await W(250);
await p.screenshot({path:'shots/72-unit-revision-'+f.replace('.html','')+'.png'});
out.errs=errs;ok(!errs.length,'no page errors '+errs.join(' | '));all[f]=out;await ctx.close()}
console.log(JSON.stringify(all,null,1));console.log('ALL OK');await b.close()})().catch(e=>{console.log(e.message.slice(0,1500));process.exit(1)});
