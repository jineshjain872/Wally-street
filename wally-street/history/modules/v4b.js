/* ================= Wally Street 4.0: Practice trading ================= */
/* rough yearly dividend yields used by the simulator (for learning, not real data) */
const DYLD={MSFT:.008,AAPL:.004,JPM:.02,WMT:.009,LLY:.006,AVGO:.012,GOOGL:.003,META:.003,NVDA:.0003,SPY:.012,QQQ:.006,TLT:.04,LQD:.045,EWJ:.02,INDA:.008,ASHR:.02,RELIANCE:.004,HDFCBANK:.011,ICICIBANK:.008,INFY:.025,BHARTIARTL:.004,TECHM:.025,NESTLEIND:.015,BEL:.006,TRENT:.001,'7203':.025,'6758':.006,'600519':.03,'300750':.015,'601318':.05};
const FEE=.001,FEEMIN=.05;/* simulated trading costs: 0.1% of the trade, at least $0.05 (about ₹5) */
const isINR=()=>S&&S.cur=='INR';
const toCur=v=>isINR()?v*FXINR:v,fromCur=v=>isINR()?v/FXINR:v,curSym=()=>isINR()?'₹':'$';
function feeOf(v){return Math.max(FEEMIN,v*FEE)}
function xh(e){if(!Array.isArray(X.h))X.h=[];X.h.push(Object.assign({ts:Date.now()},e));if(X.h.length>200)X.h.shift()}
/* the one place trades happen: market orders, filled limit and stop orders */
function execTrade(i,sd,v,why){const k=MK[i],p=pr[i];if(!isOpen(k[4]))return 'Market closed. You can trade when it reopens.';if(!(v>0))return 'Enter an amount.';
 if(sd=='b'){const fee=feeOf(v);if(v+fee>X.cash+1e-6)return 'Not enough cash. You have '+$m(X.cash)+'.';const o=X.pos[k[0]]||{sh:0,c:0};o.sh+=v/p;o.c+=v+fee;X.pos[k[0]]=o;X.cash=Math.max(0,X.cash-v-fee);xh({tk:k[0],sd:'b',v,px:p,fee,why});stat('trade');dailyBump('t');badgeCheck();missionCheck();return 'Bought '+$m(v)+' of '+k[0]+' at '+$m(p)+' (costs '+$m(fee)+')'+(why?' · '+why:'')}
 const o=X.pos[k[0]];if(!o)return 'You do not own '+k[0]+'.';const t=o.sh*p;let a=Math.min(v,t);if(a>t-.005)a=t;const f=a/t,fee=feeOf(a),cost=o.c*f,pl=a-fee-cost;X.cash+=a-fee;X.real=(X.real||0)+pl;if(f>.9999)delete X.pos[k[0]];else{o.c*=1-f;o.sh*=1-f}
 xh({tk:k[0],sd:'s',v:a,px:p,fee,pl,why});stat('trade');dailyBump('t');badgeCheck();missionCheck();return 'Sold '+$m(a)+' of '+k[0]+' at '+$m(p)+' ('+(pl>=0?'profit ':'loss ')+$m(Math.abs(pl))+' after costs)'+(why?' · '+why:'')}
function trade0(n,sd){const P=PN[n],i=P.i,inp=gi(sd=='b'?'bi':'si',n),v=fromCur(parseFloat(inp.value));const r=execTrade(i,sd,v);say(n,r);if(/^(Bought|Sold)/.test(r)){inp.value='';saveX();if(sd=='b'&&!S.gft){S.gft=1;save()}}paint()}
/* pending orders: limit buy, limit sell (take profit), stop-loss sell */
function placeOrder(n){const P=PN[n],k=MK[P.i],ty=gi('ot',n).value,px=fromCur(parseFloat(gi('op',n).value)),amt=fromCur(parseFloat(gi('oa',n).value));
 if(!(px>0))return say(n,'Enter the trigger price.');if(ty!='lb'&&!X.pos[k[0]])return say(n,'You need to own '+k[0]+' to place a sell order.');if(ty=='lb'&&!(amt>0))return say(n,'Enter how much to buy.');
 if(!Array.isArray(X.ord))X.ord=[];if(X.ord.length>=20)return say(n,'You can have up to 20 open orders.');
 X.ord.push({id:tid(),tk:k[0],ty,px,amt:ty=='lb'?amt:0,ts:Date.now()});saveX();award('ord');gi('op',n).value='';gi('oa',n).value='';
 say(n,{lb:'Limit buy placed: buys when '+k[0]+' falls to '+$m(px)+' or lower.',ls:'Limit sell placed: sells all '+k[0]+' when it rises to '+$m(px)+' or higher.',sl:'Stop-loss placed: sells all '+k[0]+' if it falls to '+$m(px)+' or lower.'}[ty]);paint()}
function ordersCheck(){if(!Array.isArray(X.ord)||!X.ord.length){alertsCheck();return}let ch=0;
 X.ord=X.ord.filter(o=>{const i=IX[o.tk];if(i==null)return false;if(!isOpen(MK[i][4]))return true;const p=pr[i];let hit=false,msg='';
  if(o.ty=='lb'&&p<=o.px){msg=execTrade(i,'b',Math.min(o.amt,Math.max(0,X.cash-feeOf(o.amt))),'limit order filled');hit=true}
  else if(o.ty=='ls'&&p>=o.px&&X.pos[o.tk]){msg=execTrade(i,'s',X.pos[o.tk].sh*p,'limit sell filled');hit=true}
  else if(o.ty=='sl'&&p<=o.px&&X.pos[o.tk]){msg=execTrade(i,'s',X.pos[o.tk].sh*p,'stop-loss triggered');hit=true}
  else if(o.ty!='lb'&&!X.pos[o.tk])return false;
  if(hit){ch=1;toast(msg,'🎯')}return !hit});
 if(ch)saveX();alertsCheck()}
/* watchlist and price alerts */
function toggleWatch(tk){if(!Array.isArray(X.w))X.w=[];X.w=X.w.includes(tk)?X.w.filter(x=>x!=tk):X.w.concat(tk).slice(-20);saveX()}
function addAlert(n){const k=MK[PN[n].i],px=fromCur(parseFloat(gi('al',n).value));if(!(px>0))return say(n,'Enter a price for the alert.');if(!Array.isArray(X.al))X.al=[];
 const dir=px>=pr[PN[n].i]?'up':'down';X.al.push({tk:k[0],px,dir});X.al=X.al.slice(-20);saveX();gi('al',n).value='';say(n,'Alert set: we will tell you when '+k[0]+(dir=='up'?' rises to ':' falls to ')+$m(px)+'.')}
function alertsCheck(){if(!Array.isArray(X.al)||!X.al.length)return;let ch=0;X.al=X.al.filter(a=>{const i=IX[a.tk];if(i==null)return false;const p=pr[i];if(a.dir=='up'?p>=a.px:p<=a.px){toast(a.tk+' is now '+$m(p)+' (your alert: '+$m(a.px)+')','🔔');sfx('badge');ch=1;return false}return true});if(ch)saveX()}
/* dividends: paid once a day on holdings that pay them (rough yields) */
function divCheck(){const d=ds(new Date());if(X.dv===d)return;const last=X.dv;X.dv=d;if(!last){saveX();return}const days=Math.min(30,Math.max(1,Math.round((Date.parse(d)-Date.parse(last))/864e5)||1));let tot=0;
 Object.keys(X.pos).forEach(tk=>{const y=DYLD[tk];if(!y)return;const i=IX[tk];const amt=X.pos[tk].sh*pr[i]*y/365*days;if(amt>=.01){tot+=amt;X.cash+=amt;xh({tk,sd:'d',v:amt,px:pr[i]})}});
 if(tot>0){X.real=(X.real||0)+tot;toast('Dividends paid: '+$m(tot),'💵')}saveX()}
/* stats panel, guided first trade, watchlist, orders, history */
function pxStats(){const h=(X.h||[]),tr=h.filter(x=>x.sd=='b'||x.sd=='s'),sells=h.filter(x=>x.sd=='s'),wins=sells.filter(x=>x.pl>0).length,fees=tr.reduce((a,x)=>a+(x.fee||0),0),div=h.filter(x=>x.sd=='d').reduce((a,x)=>a+x.v,0);
 const best=sells.reduce((a,x)=>!a||x.pl>a.pl?x:a,null),worst=sells.reduce((a,x)=>!a||x.pl<a.pl?x:a,null);return {tr:tr.length,sells:sells.length,wins,fees,div,real:X.real||0,best,worst}}
function paintX(){{const w=$('#xwr');if(w)w.textContent='100 XP = '+$m(1000,0)+' practice cash'}const box=$('#pxx');if(!box)return;const st=pxStats(),w=(X.w||[]),firstI=MK.findIndex(m=>m[4]==mkt&&m[2]=='F')>=0?MK.findIndex(m=>m[4]==mkt&&m[2]=='F'):MK.findIndex(m=>m[4]==mkt),amt=isINR()?500:100;
 const key=[st.tr,w.join(),(X.ord||[]).map(o=>o.id).join(),(X.al||[]).length,S.cur,S.gft,mkt,S.pxd,ap,PN.length].join('|');if(box.dataset.k===key)return;box.dataset.k=key;
 let h='';
 if(!st.tr&&!S.gft)h+=`<div class="cd coach"><b>👋 Your first trade, step by step</b><ol><li>Pick a company or fund from the list below (we picked <b>${esc(MK[firstI][0])}</b> for you).</li><li>Type an amount in the Buy box, for example ${curSym()}${amt.toLocaleString()}.</li><li>Tap <b>Buy</b>. You can sell any time the market is open.</li></ol><div class="tr"><button class="bb" data-guide="${firstI}">Fill it in for me</button><button class="qc" data-guide="x">Skip</button></div></div>`;
 h+=`<div class="cd"><div class="tr" style="margin:0;justify-content:space-between"><b>⭐ Watchlist</b><span class="xs">Tap ☆ on a chart to add</span></div><div class="tr">${w.length?w.map(t=>`<button class="qc" data-hv="${esc(t)}">⭐ ${esc(t)}</button>`).join(''):'<span class="xs">Nothing here yet. Star the companies you want to keep an eye on.</span>'}</div>
 ${(X.ord||[]).length?`<div class="tr" style="margin-top:10px"><b>🎯 Open orders</b></div>${X.ord.map(o=>`<div class="tr ordl"><span class="xs">${{lb:'Limit buy',ls:'Limit sell',sl:'Stop-loss'}[o.ty]} · ${esc(o.tk)} at ${$m(o.px)}${o.amt?' · '+$m(o.amt):''}</span><button class="qc" data-cxo="${o.id}">Cancel</button></div>`).join('')}`:''}
 ${(X.al||[]).length?`<div class="tr" style="margin-top:10px"><b>🔔 Alerts</b></div>${X.al.map((a,j)=>`<div class="tr ordl"><span class="xs">${esc(a.tk)} ${a.dir=='up'?'rises to':'falls to'} ${$m(a.px)}</span><button class="qc" data-cxa="${j}">Remove</button></div>`).join('')}`:''}</div>
 <details class="cd hst"><summary><b>📒 Trade history and stats</b> <span class="xs">${st.tr} trade${st.tr==1?'':'s'}</span></summary>${st.tr?`<div class="st2"><div><small>REALISED P/L</small><b style="color:${st.real>=0?G:R}">${sg(st.real)}</b></div><div><small>WINNING SELLS</small><b>${st.sells?Math.round(st.wins/st.sells*100)+'%':'–'}</b></div><div><small>COSTS PAID</small><b>${$m(st.fees)}</b></div><div><small>DIVIDENDS</small><b>${$m(st.div)}</b></div></div>${st.best?`<p class="xs">Best sell: ${esc(st.best.tk)} ${sg(st.best.pl)} · Worst sell: ${esc(st.worst.tk)} ${sg(st.worst.pl)}</p>`:''}<div class="hl2">${(X.h||[]).slice(-30).reverse().map(x=>`<div><span>${new Date(x.ts).toLocaleString([], {month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</span><b>${{b:'Buy',s:'Sell',d:'Dividend'}[x.sd]}</b><span>${esc(x.tk)}</span><span>${$m(x.v)}</span></div>`).join('')}</div><div class="tr"><button class="qc" data-card="portfolio">📸 Share my returns</button></div>`:'<p class="xs">No trades yet. Your buys, sells and dividends will show up here, with your wins and losses.</p>'}</details>`;
 box.innerHTML=h;pnTabs()}
/* phones: one chart at a time, with tabs and swipe */
function pnTabs(){const t=$('#pntabs');if(!t)return;t.innerHTML=PN.length>1?PN.map((p,n)=>`<button class="qc${n==ap?' mon':''}" data-pt2="${n}" aria-pressed="${n==ap}">${esc(MK[p.i][0])}</button>`).join('')+'<span class="xs swh">Swipe to switch</span>':'';
 document.querySelectorAll('#pn .cd').forEach(c=>c.classList.toggle('act',+c.dataset.n==ap))}
let SWX=null;function pnSwipe(){const pn=$('#pn');if(!pn||pn.dataset.sw)return;pn.dataset.sw=1;pn.addEventListener('touchstart',e=>{SWX=e.touches[0].clientX},{passive:true});
 pn.addEventListener('touchend',e=>{if(SWX==null||innerWidth>=700||PN.length<2)return;const dx=e.changedTouches[0].clientX-SWX;SWX=null;if(Math.abs(dx)<60)return;ap=(ap+(dx<0?1:-1)+PN.length)%PN.length;paint()},{passive:true})}
/* per-chart extras: star, alert, order row, big-move note, chart description */
function paintPx(n){const P=PN[n],i=P.i,k=MK[i],p=pr[i],b=k[3],ch=p/b-1,E=document.querySelector('.cd[data-n="'+n+'"]');if(!E)return;
 const st=E.querySelector('[data-star]');if(st){const on=(X.w||[]).includes(k[0]);st.textContent=on?'★':'☆';st.setAttribute('aria-pressed',on);st.setAttribute('aria-label',(on?'Remove ':'Add ')+k[0]+(on?' from':' to')+' watchlist')}
 const mv=gi('mv',n);if(mv)mv.textContent=Math.abs(ch)>=.03?(ch>0?'📈 Big move: ':'📉 Big move: ')+pc(ch)+' since base. Prices here are simulated. In real markets, moves this big usually follow news such as results, interest-rate changes or sector news.':'';
 const svg=E.querySelector('svg');if(svg)svg.setAttribute('aria-label',`${k[0]} price chart: ${$m(p)} now, ${pc(ch)} since the base price of ${$m(b)}, ${ch>=0?'up':'down'} overall`);
 ['bi','si'].forEach(id=>{const x=gi(id,n);if(x)x.placeholder=(id=='bi'?'Buy ':'Sell ')+curSym()});}
function pracX(t,g){let x;
 if(x=g('data-star')){toggleWatch(MK[PN[+x.dataset.star].i][0]);return true}
 if(x=g('data-alrt')){addAlert(+x.dataset.alrt);return true}
 if(x=g('data-po')){placeOrder(+x.dataset.po);return true}
 if(x=g('data-cxo')){X.ord=(X.ord||[]).filter(o=>o.id!=x.dataset.cxo);saveX();return true}
 if(x=g('data-cxa')){X.al=(X.al||[]).filter((a,j)=>j!=+x.dataset.cxa);saveX();return true}
 if(x=g('data-pt2')){ap=+x.dataset.pt2;return true}
 if(x=g('data-guide')){if(x.dataset.guide=='x'){S.gft=1;save();return true}const i=+x.dataset.guide;PN[ap].i=i;const inp=gi('bi',ap);if(inp){inp.value=isINR()?500:100;inp.focus()}say(ap,'Now tap Buy to place your first practice trade.');return true}
 if(x=g('data-otg')){const n=+x.dataset.otg,r=gi('orow',n);if(r)r.hidden=!r.hidden;return true}
 return false}
function applyPx(){const p=$('#prac');if(p)p.classList.toggle('pxl',!S.pxd)}
