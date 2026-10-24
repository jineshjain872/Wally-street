const ROOT=require('path').resolve(__dirname,'..')+'/';
const {chromium,devices}=require('playwright');const W=ms=>new Promise(r=>setTimeout(r,ms));
const SH=ROOT+'build/shots/';
async function setup(p,url){await p.goto(url);await W(500);await p.fill('#agi','20');await p.click('#agok');await W(250);await p.click('#tca');await W(250);await p.click('#suskip');await W(500)}
(async()=>{const b=await chromium.launch({...(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),args:['--no-sandbox']});const all={};
for(const [f,ctxo] of [['stockgpt-share.html',{...devices['iPhone 13']}],['stockgpt-laptop.html',{viewport:{width:1366,height:800}}],['wally-street.html',{viewport:{width:390,height:844}}]]){
 const out={};const errs=[];const ctx=await b.newContext(ctxo);const p=await ctx.newPage();p.on('pageerror',e=>errs.push(e.message));
 const tag=f.replace('.html','');
 await setup(p,'file://'+ROOT+'dist/'+f+'?utm_source=instagram&utm_medium=reel&utm_campaign=launch#/learn');
 out.urlAfter=await p.evaluate(()=>location.search+location.hash);
 out.utmPending=await p.evaluate(()=>sessionStorage.getItem('stockgpt:utm'));
 // skip link
 if(!ctxo.isMobile){await p.evaluate(()=>{document.body.setAttribute('tabindex','-1');document.body.focus();document.body.removeAttribute('tabindex')});await p.keyboard.press('Tab');out.firstTab=await p.evaluate(()=>document.activeElement.id+' '+document.activeElement.textContent);await p.keyboard.press('Enter');await W(100);out.afterSkip=await p.evaluate(()=>document.activeElement.id||document.activeElement.tagName)}
 // floating help button + search entry
 out.fab=await p.evaluate(()=>{const f=document.querySelector('#fab');const r=f.getBoundingClientRect();const n=document.querySelector('nav').getBoundingClientRect();return {hidden:f.hidden,bottomGap:Math.round(n.top-r.bottom),right:Math.round(innerWidth-r.right)}});
 await p.screenshot({path:SH+'41-learn-'+tag+'.png'});
 out.tcBefore=await p.evaluate(()=>document.querySelector('#tc').style.display+' '+document.querySelector('#tc').innerText.slice(0,80));await p.click('#fab');await W(300);out.help=await p.$eval('#tc',e=>e.innerText.slice(0,160).replace(/\n+/g,' | '));await p.screenshot({path:SH+'42-help-'+tag+'.png'});
 await p.click('#tc [data-hx="faq"]');await W(300);out.faqCount=await p.$$eval('#tc details.faq',e=>e.length);await p.click('#tc details.faq:nth-of-type(3) summary');await W(100);out.faqOpen=await p.$$eval('#tc details.faq[open]',e=>e.length);
 await p.screenshot({path:SH+'43-faq-'+tag+'.png'});
 // print the FAQ
 await p.evaluate(()=>dispatchEvent(new Event('beforeprint')));await p.emulateMedia({media:'print'});await W(100);
 out.print=await p.evaluate(()=>({cls:document.documentElement.className,app:getComputedStyle(document.querySelector('#app')).display,tc:getComputedStyle(document.querySelector('#tc')).position,open:document.querySelectorAll('details[open]').length,hdr:getComputedStyle(document.querySelector('header')).display}));
 if(f=='stockgpt-laptop.html')await p.pdf({path:SH+'faq-print.pdf',format:'A4'}).catch(e=>out.pdfErr=e.message);
 await p.emulateMedia({media:'screen'});await p.evaluate(()=>dispatchEvent(new Event('afterprint')));
 await p.click('#tcx');await W(200);
 // search with "/"
 await p.keyboard.press('/');await W(300);out.searchOpen=await p.evaluate(()=>document.activeElement.id);
 await p.keyboard.type('sip');await W(300);out.sip=await p.$$eval('#srr .srk, #srr .sri b',e=>e.map(x=>x.textContent).slice(0,12));await p.screenshot({path:SH+'44-search-'+tag+'.png'});
 await p.fill('#srq','nvda');await W(250);await p.click('#srr .sri');await W(500);out.nvda=await p.evaluate(()=>({tab:document.querySelector('main .view.on').id,stock:MK[PN[ap].i][0]}));
 // FAB hidden on practice, reset confirmation
 out.fabPrac=await p.evaluate(()=>document.querySelector('#fab').hidden);
 await p.evaluate(()=>{X.cash=5;saveX()});await p.click('#rx');await W(200);out.cfm=await p.evaluate(()=>!!document.querySelector('.cfm')&&document.activeElement.textContent);await p.screenshot({path:SH+'45-confirm-'+tag+'.png'});
 await p.keyboard.press('Escape');await W(150);out.afterEsc=await p.evaluate(()=>({open:!!document.querySelector('.cfm'),cash:X.cash}));
 await p.click('#rx');await W(200);await p.click('.cfm [data-cf="1"]');await W(300);out.afterOk=await p.evaluate(()=>X.cash);
 // search: no match, Top 50, lesson lock
 await p.evaluate(()=>showSearch('qqzzxx'));await W(200);out.none=await p.$eval('#srr',e=>e.innerText.slice(0,80));
 await p.fill('#srq','moderna');await W(250);await p.click('#srr .sri');await W(400);out.top=await p.evaluate(()=>({tab:document.querySelector('main .view.on').id,exp:!!document.querySelector('#picks .row[aria-expanded="true"]')}));
 await p.evaluate(()=>showSearch('tax on gains'));await W(250);out.taxRes=await p.$$eval('#srr .sri b',e=>e.map(x=>x.textContent).slice(0,4));
 // back to top and progress bar on the Learn page
 await p.evaluate(()=>{document.querySelector('#tc').style.display='none';tab('learn')});await W(200);
 await p.evaluate(()=>{const v=document.querySelector('#learn');v.scrollTop=v.scrollHeight});await W(300);
 out.scroll=await p.evaluate(()=>({bar:!document.querySelector('#spb').hidden,w:document.querySelector('#spb i').style.width,btt:document.querySelector('#btt').classList.contains('on')}));
 await p.screenshot({path:SH+'46-scrolled-'+tag+'.png'});
 await p.click('#btt');await W(900);out.top0=await p.evaluate(()=>document.querySelector('#learn').scrollTop);
 // password toggle and busy button
 await p.evaluate(()=>showGate('up'));await W(300);out.eyes=await p.$$eval('#gate .eye',e=>e.length);
 await p.click('#gate .eye');out.pwType=await p.$eval('#gp',e=>e.type);await p.click('#gate .eye');out.pwType2=await p.$eval('#gp',e=>e.type);
 await p.screenshot({path:SH+'47-gate-'+tag+'.png'});
 await p.fill('#gu','neo_42');await p.fill('#gp','Bright-Owl-77');await p.fill('#gp2','Bright-Owl-77');await p.evaluate(()=>{const g=document.querySelector('#gagree');if(!g.checked)g.click()});
 await p.click('#gok');out.busy=await p.evaluate(()=>{const b=document.querySelector('#gok');return b?b.className+' '+b.textContent:'gone'});
 await p.waitForFunction(()=>document.querySelector('#gate').style.display=='none',null,{timeout:20000});await W(800);await p.evaluate(()=>{const x=document.querySelector('#tyx');if(x)x.click()});
 // consent then UTM stored, stats doc shows campaigns
 await p.evaluate(()=>setConsent(1));out.utm=await p.evaluate(()=>JSON.parse(localStorage.getItem('stockgpt:utm')||'null'));
 await p.evaluate(()=>showDoc('Your usage stats',statsHTML()));await W(200);out.stats=await p.$eval('#tc .tcs',e=>e.innerText.slice(-220).replace(/\n+/g,' | '));
 await p.click('#tc #stclr');await W(200);out.stclrCfm=!!(await p.$('.cfm'));await p.click('.cfm [data-cf="0"]');
 await p.click('#tcx');await W(150);
 // settings: last updated and account password eyes; delete account asks to confirm
 await p.click('#gear');await W(400);out.settings=await p.evaluate(()=>{const t=document.querySelector('#ac').innerText;const i=t.indexOf('Last updated');return t.slice(i-25,i+30)});out.acEyes=await p.$$eval('#ac .eye',e=>e.length);
 await p.fill('#op','Bright-Owl-77');await p.click('[data-del]');await W(300);out.delCfm=await p.evaluate(()=>document.querySelector('.cfm')&&document.querySelector('.cfm h3').textContent);await p.click('.cfm [data-cf="0"]');await W(200);out.stillAcc=await p.evaluate(()=>!!ACC);
 // hover state
 if(!ctxo.isMobile){await p.click('#acx').catch(()=>{});await W(200);await p.evaluate(()=>tab('learn'));await W(200);await p.hover('#cta');await W(200);out.hover=await p.$eval('#cta',e=>getComputedStyle(e).filter+' '+getComputedStyle(e).transform)}
 // chat thinking dots go away
 await p.evaluate(()=>{const a=document.querySelector('#acx');if(a)a.click();tab('chat')});await W(200);await p.fill('#in','what is a dividend');await p.press('#in','Enter');await W(1200);out.dots=await p.$$eval('#msgs .dots',e=>e.length);
 out.whatsnew=await p.evaluate(()=>{showWhatsNew();return document.querySelector('#tc').innerText.slice(0,120).replace(/\n+/g,' | ')});
 out.errs=errs;all[f]=out;await ctx.close()}
console.log(JSON.stringify(all,null,1));await b.close()})().catch(e=>{console.log('FATAL',e.message.slice(0,3000));process.exit(1)});
