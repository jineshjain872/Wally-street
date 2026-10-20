const ROOT=require('path').resolve(__dirname,'..')+'/';
const {chromium,devices}=require('playwright');
const F='file://'+ROOT+'dist/'+(process.argv[2]||'stockgpt-share.html');
const SH=ROOT+'build/shots/';
const W=ms=>new Promise(r=>setTimeout(r,ms));
async function playQuiz(p,wrongFirst){for(let n=0;n<60;n++){await W(120);
  const st=await p.$('#ft #st');if(st){await st.click();continue}
  const fin=await p.$('#ft #fin');if(fin)return 'end';
  const nx=await p.$('#ft #nx');if(nx){await nx.click();continue}
  const pr=await p.$('#ft #pr');if(pr)return 'outofhearts';
  const idx=await p.evaluate(w=>{if(typeof opts=='undefined'||!Q[qi])return -1;const c=opts.indexOf(Q[qi][1]);return w&&!window.__wd?(window.__wd=1,(c+1)%opts.length):c},wrongFirst);
  if(idx<0)return 'noq';await p.click(`#qb .opt[data-o="${idx}"]`);await p.click('#ft #chk')}return 'loop'}
(async()=>{const b=await chromium.launch({...(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),args:['--no-sandbox']});const out={};const errs=[];
 const ctx=await b.newContext({...devices['iPhone 13'],deviceScaleFactor:2});const p=await ctx.newPage();
 p.on('pageerror',e=>errs.push('PE '+e.message));p.on('console',m=>{if(m.type()=='error')errs.push('CE '+m.text())});
 await p.goto(F);await W(500);
 await p.fill('#agi','20');await p.click('#agok');await W(300);
 out.termsSummary=await p.$eval('#tcs',e=>e.innerText.slice(0,160));out.agreeEnabled=await p.$eval('#tca',e=>!e.disabled);
 await p.screenshot({path:SH+'01-terms.png'});
 await p.click('#tca');await W(400);
 out.setupQ=await p.$eval('#tc h2',e=>e.textContent);await p.screenshot({path:SH+'02-setup.png'});
 await p.click('[data-su=invest]');await W(150);await p.click('[data-su=new]');await W(150);await p.click('[data-su=IN]');await W(500);
 out.afterSetup=await p.evaluate(()=>({setup:S.setup,cur:S.cur,mkt,ms:S.ms&&S.ms.id,gate:document.querySelector('#gate').style.display,nav:[...document.querySelectorAll('nav button')].map(b=>b.innerText.replace(/\s+/g,' ').trim())}));
 out.cookieEarly=await p.evaluate(()=>{const c=document.querySelector('#ckb');return !!c&&c.style.display!='none'&&getComputedStyle(c).display!='none'});
 await p.screenshot({path:SH+'03-learn-phone.png',fullPage:true});
 out.unitTitles=await p.$$eval('.unit h2, .unit h3, .unit b',e=>e.map(x=>x.textContent).slice(0,12));
 // first lesson
 await p.evaluate(()=>start(0));out.l0=await playQuiz(p,true);await W(400);
 out.afterL0=await p.evaluate(()=>({done:S.done,xp:S.xp,bd:S.bd,mis:(S.mis||[]).length,dg:S.dg,svp:!!document.querySelector('[data-svp]'),share:!!document.querySelector('#qb [data-card]')}));
 await p.screenshot({path:SH+'04-finish.png'});
 await p.click('#ft #fin');await W(1400);
 out.cookieAfterL0=await p.evaluate(()=>{const c=document.querySelector('#ckb');return !!c&&c.style.display!='none'});
 if(out.cookieAfterL0)await p.click('#ckno').catch(()=>{});
 await p.screenshot({path:SH+'05-learn-after.png',fullPage:true});
 // mistakes review
 out.review=await p.evaluate(()=>{const c=[...document.querySelectorAll('[data-rv]')];return c.length});
 await p.evaluate(()=>start(0,'v'));out.rv=await playQuiz(p);await W(200);out.rvMsg=await p.$eval('#qb .end p',e=>e.textContent).catch(()=>null);await p.click('#ft #fin');await W(300);
 // tutor
 await p.click('nav [data-t=chat]');await W(300);
 for(const q of ['What is a SIP?','what is nifty','should I buy tesla','How is tax on shares calculated in India?','what is 2+2']){await p.fill('#in',q);await p.press('#in','Enter');await W(900)}
 out.chat=await p.evaluate(()=>[...document.querySelectorAll('#msgs > *')].slice(-6).map(e=>e.innerText.slice(0,110)));
 out.relChips=await p.$$eval('#chat .sug button, #chat [data-q]',e=>e.map(x=>x.textContent).slice(0,8));
 await p.screenshot({path:SH+'06-chat.png'});
 // practice
 await p.click('nav [data-t=prac]');await W(800);
 out.prac=await p.evaluate(()=>({pxl:document.querySelector('#prac').classList.contains('pxl'),coach:!!document.querySelector('#pxx .coach'),tabs:document.querySelector('#pntabs').innerText.slice(0,80),mkt,cur:S.cur,base:document.querySelector('.tl .mu')&&document.querySelector('.tl .mu').textContent}));
 await p.screenshot({path:SH+'07-prac-phone.png',fullPage:true});
 out.guide=await p.evaluate(()=>{const g=document.querySelector('[data-guide]');if(g)g.click();return !!g});await W(600);
 await p.screenshot({path:SH+'08-guide.png',fullPage:true});
 // trade via api, then orders, alert, star
 out.trade=await p.evaluate(()=>{const i=IX['RELIANCE'];PN[0].i=i;drawPN();try{execTrade(i,'b',5000,'test')}catch(e){return 'ERR '+e.message}return {cash:X.cash,pos:X.pos.RELIANCE,h:(X.h||[]).length,dg:S.dg}});
 await W(300);
 out.ui=await p.evaluate(()=>{const r={};const o=document.querySelector('[data-otg="0"]');o&&o.click();r.orow=!document.querySelector('#orow0').hidden;
  document.querySelector('#ot0').value='lb';document.querySelector('#op0').value='1';document.querySelector('#oa0').value='1000';document.querySelector('[data-po="0"]').click();
  r.ord=(X.ord||[]).map(o=>[o.ty,o.tk,o.px,o.amt]);
  document.querySelector('#al0').value='99999';document.querySelector('[data-alrt="0"]').click();r.al=(X.al||[]).length;
  document.querySelector('[data-star="0"]').click();r.w=X.w;return r});
 await W(300);out.paintX=await p.$eval('#pxx',e=>e.innerText.slice(0,400));
 await p.evaluate(()=>{window.__io=isOpen;window.isOpen=()=>true;X.ord.forEach(o=>o.px=1e9);ordersCheck();window.isOpen=window.__io});await W(200);out.orderFill=await p.evaluate(()=>({ord:(X.ord||[]).length,h:X.h.length}));
 await p.screenshot({path:SH+'09-prac-orders.png',fullPage:true});
 // markets + news quiz
 await p.click('nav [data-t=picks]');await W(400);out.subnav=await p.$$eval('.subnav button',e=>e.map(x=>x.textContent));
 await p.screenshot({path:SH+'10-markets.png'});
 await p.evaluate(()=>{const b=[...document.querySelectorAll('.subnav button')].find(x=>/News/i.test(x.textContent));b&&b.click()});await W(400);
 out.news=await p.$$eval('#news h3',e=>e.map(x=>x.textContent).slice(0,10));await p.screenshot({path:SH+'11-news.png',fullPage:true});
 await p.evaluate(()=>{document.querySelector('[data-nq]').click()});out.nq=await playQuiz(p);await W(200);await p.click('#ft #fin');await W(300);
 // tools, glossary, replay, badges, invite, class
 await p.evaluate(()=>showTools());await W(400);await p.screenshot({path:SH+'12-tools.png'});
 out.tools=await p.evaluate(()=>({sip:document.querySelector('#c_out, #t_out, #k_out')&&[...document.querySelectorAll('[id$=_out]')].map(e=>e.innerText.slice(0,90))}));
 await p.evaluate(()=>{const e=document.querySelector('#t_s');if(e){e.value='300000';e.dispatchEvent(new Event('input',{bubbles:true}))}});await W(200);
 out.tax=await p.evaluate(()=>document.querySelector('#t_out')&&document.querySelector('#t_out').innerText);
 await p.evaluate(()=>{document.querySelector('#tc').style.display='none';showGlossary('sip')});await W(300);out.gloss=await p.evaluate(()=>document.querySelector('#gll').innerText.slice(0,160));
 await p.evaluate(()=>{document.querySelector('#tc').style.display='none';showReplay('2008')});await W(300);await p.screenshot({path:SH+'13-replay.png'});
 out.replay=await p.evaluate(async()=>{for(let i=0;i<40;i++){const b=document.querySelector('#rp_s');if(!b)break;b.click();await new Promise(r=>setTimeout(r,20))}return document.querySelector('#tc').innerText.slice(0,300)});
 await p.evaluate(()=>{document.querySelector('#tc').style.display='none';showBadges()});await W(300);out.badges=await p.$$eval('.bd.on b',e=>e.map(x=>x.textContent));await p.screenshot({path:SH+'14-badges.png'});
 out.card=await p.evaluate(async()=>{try{const b=document.createElement('button');b.dataset.card='streak';document.body.appendChild(b);b.click();b.remove()}catch(e){return 'ERR '+e.message}await new Promise(r=>setTimeout(r,600));const i=document.querySelector('.shimg');return i?i.src.slice(0,30)+' '+i.naturalWidth:'none'});
 await p.screenshot({path:SH+'15-card.png'});
 out.cert=await p.evaluate(async()=>{try{const c=await makeCert(0);return c&&c.length}catch(e){return 'ERR '+e.message}});
 await p.evaluate(()=>{document.querySelector('#tc').style.display='none';showInvite()});await W(300);out.invite=await p.evaluate(()=>document.querySelector('#tc').innerText.slice(0,200));
 await p.evaluate(()=>{document.querySelector('#tc').style.display='none';showClass()});await W(300);await p.screenshot({path:SH+'16-class.png'});out.classT=await p.evaluate(()=>document.querySelector('#tc').innerText.slice(0,240));
 await p.evaluate(()=>{document.querySelector('#tc').style.display='none';showWhatsNew()});await W(300);out.wn=await p.evaluate(()=>document.querySelector('#tc').innerText.slice(0,200));await p.screenshot({path:SH+'17-whatsnew.png'});
 await p.evaluate(()=>{document.querySelector('#tc').style.display='none';try{document.querySelector('#app').inert=false}catch(e){}});
 // settings
 await p.click('#gear');await W(400);await p.screenshot({path:SH+'18-settings.png',fullPage:true});
 out.set=await p.evaluate(()=>{const c=k=>{const b=document.querySelector(`[data-set="${k}"]`);b&&b.click();return !!b};const r={tz:c('tz:1'),hc:c('hc:1'),cur:c('cur:USD'),pxd:c('pxd:1')};r.cls=document.documentElement.className;r.S={tz:S.tz,hc:S.hc,cur:S.cur,pxd:S.pxd};return r});
 await p.screenshot({path:SH+'19-settings-after.png'});
 await p.evaluate(()=>{const b=document.querySelector('[data-set="tz:0"]');b&&b.click();const h=document.querySelector('[data-set="hc:0"]');h&&h.click()});
 // placement test in a fresh state
 await p.evaluate(()=>{document.querySelectorAll('#acx,.acx').forEach(b=>b.click())});
 await p.evaluate(()=>start(0,'pt'));out.pt=await playQuiz(p);await W(200);out.ptRes=await p.evaluate(()=>({pt:S.pt,done:S.done.slice().sort((a,b)=>a-b)}));await p.click('#ft #fin');await W(300);
 // India unit
 out.india=await p.evaluate(()=>({ids:INDIA_IDS,open28:pathOpen(28),open29:pathOpen(29),names:INDIA_IDS.map(i=>F[i].n),q:INDIA_IDS.map(i=>F[i].q.length)}));
 await p.evaluate(()=>start(INDIA_IDS[0]));out.ind=await playQuiz(p);await W(200);await p.click('#ft #fin');await W(300);
 out.saveRoundTrip=await p.evaluate(()=>{const a=JSON.stringify(cleanS(JSON.parse(JSON.stringify(S))).bd),b2=JSON.stringify(cleanX(JSON.parse(JSON.stringify(X))).h.length);return [a,b2]});
 await p.reload();await W(1200);out.afterReload=await p.evaluate(()=>({done:S.done.length,bd:S.bd,cur:S.cur,h:(X.h||[]).length,w:X.w,al:(X.al||[]).length,setup:!!S.setup,tc:document.querySelector('#tc').style.display,gate:document.querySelector('#gate').style.display}));
 await p.screenshot({path:SH+'20-reload.png'});
 // laptop
 const c2=await b.newContext({viewport:{width:1366,height:850}});const q=await c2.newPage();q.on('pageerror',e=>errs.push('PE2 '+e.message));
 await q.goto(F);await W(400);await q.fill('#agi','30');await q.click('#agok');await W(300);await q.click('#tca');await W(300);await q.click('[data-su=learn]');await W(100);await q.click('[data-su=some]');await W(100);await q.click('[data-su=US]');await W(500);
 await q.screenshot({path:SH+'21-learn-laptop.png'});
 out.laptopPT=await q.evaluate(()=>!!document.querySelector('[data-pt]'));
 await q.click('nav [data-t=prac]');await W(700);await q.screenshot({path:SH+'22-prac-laptop.png'});
 await q.evaluate(()=>{S.pxd=1;applyComfort()});await W(200);await q.screenshot({path:SH+'23-prac-dark.png'});
 out.errs=errs;console.log(JSON.stringify(out,null,1));await b.close()})().catch(e=>{console.log('FATAL',e.message);process.exit(1)});
