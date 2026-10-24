const ROOT=require('path').resolve(__dirname,'..')+'/';
// hearts: earn one back as soon as you lose one, buy one for 100 Wally coins, and the out-of-hearts flow
const {chromium,devices}=require('playwright');const W=ms=>new Promise(r=>setTimeout(r,ms));
const ok=(c,m)=>{if(!c)throw new Error('FAILED: '+m)};
const C=(p,s)=>p.evaluate(s=>{const e=document.querySelector(s);if(e)e.click();return !!e},s);
async function answer(p,right){await p.evaluate(r=>{const c=opts.indexOf(Q[qi][1]),i=r?c:(c+1)%opts.length;document.querySelector(`#qb .opt[data-o="${i}"]`).click();document.querySelector('#ft #chk').click()},right);await W(80)}
async function play(p){for(let n=0;n<60;n++){await W(80);if(await C(p,'#ft #st'))continue;if(await p.$('#ft #fin'))return 'end';if(await C(p,'#ft #nx'))continue;await answer(p,true)}return 'loop'}
async function confirmYes(p){await W(120);return p.evaluate(()=>{const b=document.querySelector('[data-cf="1"]');if(b){b.click();return true}return false})}
(async()=>{const b=await chromium.launch({...(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),args:['--no-sandbox']});const all={};
for(const [f,o] of [['stockgpt-share.html',{...devices['iPhone 13']}],['wally-street.html',{viewport:{width:1366,height:800}}]]){
const ctx=await b.newContext(o);await ctx.route(/fonts\./,r=>r.abort());const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));const out={};
await p.goto('file://'+ROOT+'dist/'+f);await W(500);
await p.evaluate(()=>{document.querySelector('#agi').value='20';document.querySelector('#agok').click()});await W(200);await C(p,'#tca');await W(200);await C(p,'#suskip');await W(300);
await p.evaluate(()=>{S.done=[0,1,32,33,220,100,101];S.hr=5;S.xp=250;save();head();renderLearn()});
out.fullCard=await p.evaluate(()=>!!document.querySelector('#learn .card.hrt'));ok(!out.fullCard,'no hearts card while hearts are full');
// lose one heart in a lesson -> lesson end offers to earn it back, and Learn shows the card
await p.evaluate(()=>start(2));await W(150);await C(p,'#ft #st');await W(100);await answer(p,false);
out.afterWrong=await p.evaluate(()=>({hr:S.hr,lh:document.querySelector('#lh').textContent,ft:document.querySelector('#ft').innerText.slice(0,60)}));ok(out.afterWrong.hr==4,'a wrong answer costs a heart');
await C(p,'#ft #nx');out.play=await play(p);
out.endCard=await p.evaluate(()=>{const c=document.querySelector('#qb .card.hrt');return c&&[c.querySelector('h3').textContent,!!c.querySelector('[data-hp]'),!!c.querySelector('[data-bh]')]});
ok(out.endCard&&out.endCard[0]=='❤️ 4 of 5 hearts'&&out.endCard[1]&&out.endCard[2],'lesson end shows the hearts card '+JSON.stringify(out.endCard));
await p.screenshot({path:'shots/73-heart-end-'+f.replace('.html','')+'.png'});
await C(p,'#ft #fin');await W(1500);await C(p,'#ckno');await W(100);
out.learnCard=await p.evaluate(()=>{const c=document.querySelector('#learn .card.hrt');return c&&c.innerText.replace(/\s+/g,' ')});ok(out.learnCard&&/4 of 5/.test(out.learnCard),'Learn shows the hearts card');
// earn a heart: 5 questions, wrong answers cost nothing, +1 heart, no coins
const xp0=await p.evaluate(()=>S.xp);
await p.evaluate(()=>document.querySelector('#learn #pq').click());await W(150);
out.practice=await p.evaluate(()=>({h:document.querySelector('#qb h2').textContent,n:Q.length,noh:NOH}));ok(out.practice.n==5&&out.practice.noh&&out.practice.h=='Earn a heart','practice round '+JSON.stringify(out.practice));
await C(p,'#ft #st');await W(80);await answer(p,false);out.hrAfterPracticeWrong=await p.evaluate(()=>S.hr);ok(out.hrAfterPracticeWrong==4,'wrong answers in practice cost nothing');await C(p,'#ft #nx');
out.pplay=await play(p);out.pend=await p.evaluate(()=>({hr:S.hr,xp:S.xp,h:document.querySelector('#qb h2').textContent,stats:document.querySelector('#qb .stats').innerText,again:!!document.querySelector('#ft #pr')}));
ok(out.pend.hr==5&&out.pend.xp==xp0&&out.pend.h=='Heart earned!'&&!out.pend.again,'practice earns 1 heart and no coins '+JSON.stringify(out.pend));
await C(p,'#ft #fin');await W(300);
// buy a heart from the hearts panel: 100 coins for 1 heart
await p.evaluate(()=>{S.hr=2;save();head();renderLearn()});await C(p,'#hh');await W(200);out.panel=await p.evaluate(()=>document.querySelector('#tc').innerText.replace(/\s+/g,' ').slice(0,260));ok(/2 of 5/.test(out.panel),'hearts panel');
await p.screenshot({path:'shots/74-hearts-panel-'+f.replace('.html','')+'.png'});
await p.evaluate(()=>document.querySelector('#tc [data-bh]').click());out.confirm=await confirmYes(p);await W(300);
out.bought=await p.evaluate(()=>({hr:S.hr,xp:S.xp,hh:document.querySelector('#hh').textContent,panel:document.querySelector('#tc').innerText.replace(/\s+/g,' ').slice(0,80)}));
ok(out.bought.hr==3&&out.bought.xp==xp0-100&&/3/.test(out.bought.hh),'bought a heart '+JSON.stringify(out.bought));
// earn from the panel too
await p.evaluate(()=>document.querySelector('#tc [data-hp]').click());await W(150);ok(await p.evaluate(()=>KD=='p'&&document.querySelector('#tc').style.display=='none'),'practice starts from the panel');await p.evaluate(()=>quit());await W(200);
// not enough coins
await p.evaluate(()=>{S.xp=40;save();head()});await p.evaluate(()=>document.querySelector('#learn [data-bh]').click());await W(250);
out.poor=await p.evaluate(()=>({hr:S.hr,xp:S.xp,toast:(document.querySelector('.tst')||{}).textContent}));ok(out.poor.hr==3&&out.poor.xp==40&&/100 Wally coins/.test(out.poor.toast),'needs 100 coins '+JSON.stringify(out.poor));
// full hearts: nothing to buy
await p.evaluate(()=>{S.hr=5;S.xp=500;save();head()});await C(p,'#hh');await W(150);out.fullPanel=await p.evaluate(()=>({buy:!!document.querySelector('#tc [data-bh]'),t:document.querySelector('#tc').innerText.includes('full')}));ok(!out.fullPanel.buy&&out.fullPanel.t,'full hearts panel');await C(p,'#tcx');await W(100);
// out of hearts mid-lesson: buy a heart and carry on with the same lesson
await p.evaluate(()=>{S.hr=1;S.xp=300;save();head()});await p.evaluate(()=>start(3));await W(150);await C(p,'#ft #st');await W(80);await answer(p,false);
out.out=await p.evaluate(()=>({hr:S.hr,pr:!!document.querySelector('#ft #pr'),bh:!!document.querySelector('#ft #bh'),txt:document.querySelector('#ft').innerText.replace(/\s+/g,' ')}));ok(out.out.hr==0&&out.out.pr&&out.out.bh,'out of hearts offers practice and buy '+JSON.stringify(out.out));
await p.screenshot({path:'shots/75-out-of-hearts-'+f.replace('.html','')+'.png'});
const qi0=await p.evaluate(()=>qi);await C(p,'#ft #bh');await confirmYes(p);await W(300);
out.carryOn=await p.evaluate(q0=>({hr:S.hr,xp:S.xp,qi,moved:qi==q0+1,lid,lh:document.querySelector('#lh').textContent,opts:document.querySelectorAll('#qb .opt').length}),qi0);ok(out.carryOn.hr==1&&out.carryOn.xp==200&&out.carryOn.moved&&out.carryOn.lid==3&&out.carryOn.opts>0,'carry on after buying '+JSON.stringify(out.carryOn));
await p.evaluate(()=>quit());await W(200);
// starting a lesson with 0 hearts: offer screen, buying starts the lesson you picked
await p.evaluate(()=>{S.hr=0;S.xp=150;save();head();renderLearn()});out.cta=await p.evaluate(()=>document.querySelector('#cta').textContent);
await p.evaluate(()=>start(4));await W(150);out.offer=await p.evaluate(()=>({h:document.querySelector('#qb h2').textContent,pr:!!document.querySelector('#ft #pr'),bh:!!document.querySelector('#ft #bh')}));ok(out.offer.pr&&out.offer.bh,'offer screen '+JSON.stringify(out.offer));
await C(p,'#ft #bh');await confirmYes(p);await W(300);out.afterOfferBuy=await p.evaluate(()=>({hr:S.hr,lid,h:document.querySelector('#qb h2').textContent}));ok(out.afterOfferBuy.hr==1&&out.afterOfferBuy.lid==4,'buying starts the chosen lesson '+JSON.stringify(out.afterOfferBuy));
await p.evaluate(()=>quit());await W(150);
// out of hearts: practice still works from the offer screen and gives 1 heart
await p.evaluate(()=>{S.hr=0;save();head()});await p.evaluate(()=>start(4));await W(150);await C(p,'#ft #pr');await W(150);out.p0=await play(p);out.p0hr=await p.evaluate(()=>({hr:S.hr,again:!!document.querySelector('#ft #pr')}));ok(out.p0hr.hr==1&&out.p0hr.again,'practice at 0 hearts gives 1 heart and offers another '+JSON.stringify(out.p0hr));
await C(p,'#ft #pr');await W(150);out.p1=await play(p);out.p1hr=await p.evaluate(()=>S.hr);ok(out.p1hr==2,'earn another heart');await C(p,'#ft #fin');await W(200);
// FAQ and What's new
out.faq=await p.evaluate(()=>FAQ.filter(x=>/hearts|lessons are there/.test(x[0])).map(x=>x[1].slice(0,90)));out.wn=await p.evaluate(()=>[APP_VER,WHATSNEW42.length]);
out.errs=errs;ok(!errs.length,'no page errors '+errs.join(' | '));all[f]=out;await ctx.close()}
console.log(JSON.stringify(all,null,1));console.log('ALL OK');await b.close()})().catch(e=>{console.log(e.message.slice(0,1500));process.exit(1)});
