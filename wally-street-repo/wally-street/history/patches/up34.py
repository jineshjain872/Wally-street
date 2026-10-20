import json,re
SP='/tmp/claude-0/-home-claude/d6cebc6b-bafa-5f05-9ae9-36df9f9405d6/scratchpad/'
O='/mnt/user-data/outputs/'
s=open(SP+'master-v33.html',encoding='utf8').read()
def rep(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(a[:100],c);s=s.replace(a,b)
# --- learning order, India track, quiz hooks
rep("const ORD=[100,101,102,103,104,105,200,0,1,2,3,4,5,201,","const ORD=[0,1,100,101,102,103,104,105,200,2,3,4,5,201,")
rep("const pathOpen=id=>{const i=ORD.indexOf(id);return i<=0||S.done.includes(ORD[i-1])};","const pathOpen=id=>{if(id>=28&&id<100)return id==28?S.done.includes(1):S.done.includes(id-1);const i=ORD.indexOf(id);return i<=0||S.done.includes(ORD[i-1])};")
rep("function cleanS(o){","function cleanS0(o){");rep("function cleanX(o){","function cleanX0(o){")
rep("function start(id,k){","function start0(id,k){");rep("function finish(){","function finish0(){");rep("function renderLearn(){","function renderLearnOld(){")
rep("else if(k=='s')Q=L.ps.map(mkC).concat(L.q.map(q=>(q.k='Choice',q)));","else if(k=='s')Q=fill10(L.ps.map(mkC).concat(L.q.map(q=>(q.k='Choice',q))));")
rep("if(good){if(!retry.has(q[0]))right++}else{retry.add(q[0]);Q.push(q);","onAnswer(q,good);if(good){if(!retry.has(q[0]))right++}else{retry.add(q[0]);Q.push(q);")
rep("${good?'':'<button class=\"btn ghost\" id=\"ask\">Ask stockgpt why</button>'}","${good?'':'<button class=\"btn ghost\" id=\"ask\">Ask Wally why</button>'}")
rep("${out?'Out of hearts: start practice':'Continue'}</button>`;","${out?'Out of hearts: start practice':'Continue'}</button><button class=\"lnk rptl\" id=\"rpt\">🚩 Report a mistake</button>`;")
rep("else if(id=='fin')quit()};","else if(id=='fin')quit();else if(id=='rpt')openReport(Q[qi])};")
rep("function quit(){","function quit(){setTimeout(afterQuit,0);")
rep("const nx=ORD[ORD.indexOf(lid)+1];","const oi=ORD.indexOf(lid),nx=oi<0?null:ORD[oi+1];")
rep("setInterval(()=>{head();if(S.hr>0)renderLearn()},60000);","let _lh=-1;setInterval(()=>{head();if(S.hr!==_lh){_lh=S.hr;renderLearn()}},60000);")
rep("<div class=\"story\">${k=='s'?L.s:k=='r'?recap(id):CH[id]}</div>","<div class=\"story\">${k=='s'?L.s:k=='r'?recap(id):CH[id]}</div><p><button class=\"lnk\" data-gl=\"1\">📖 Open the glossary</button></p>")
rep("$('#learn').onclick=e=>{if(ctaClick(e))return;","$('#learn').onclick=e=>{if(ctaClick(e))return;if(learnX(e))return;")
rep("the gap between them is the spread.\"","the gap between them is the spread. The regular US session runs from 9:30 am to 4 pm Eastern time; many brokers also offer pre-market trading from 4 am and after-hours trading until 8 pm, when fewer people trade.\"")
# --- tutor
rep("w=t.replace(/[^a-z0-9\\/ -]/g,' ').split(/\\s+/).filter(x=>x.length>2&&!STOP.has(x));","w=t.replace(/[^a-z0-9\\/ -]/g,' ').split(/\\s+/).filter(x=>x.length>2&&!STOP.has(x)&&(!/^\\d+$/.test(x)||IX[x]!=null));")
rep(" {const ak=AQX["," {const it=intentAns(t);if(it)return it}\n {const ak=AQX[")
rep("I'm stockgpt. Ask me","I'm Wally. Ask me");rep("You are stockgpt,","You are Wally,");rep("\\nstockgpt:'","\\nWally:'");rep("hist.push(['stockgpt',out])","hist.push(['Wally',out])")
rep("Hi, I'm **stockgpt**.","Hi, I'm **Wally**, your stock market tutor.");rep("aria-label=\"Ask stockgpt\"","aria-label=\"Ask Wally\"");rep("Ask stockgpt about ${p[1]}","Ask Wally about ${p[1]}")
rep("if(!out){out=local(t)}","if(!out){out=local(t)}relChips(t);")
# --- markets: Top 50 wording, subnav, news, history back link, 4-tab navigation
rep("A published page cannot refresh itself, so ask the builder to refresh it.","Prices are from the 13 October 2026 close (source: ChartRow) and are refreshed with app updates.")
rep("$('#picks').innerHTML=`<div class=\"card\"><h3>Top 50 performers</h3>","$('#picks').innerHTML=subnav('picks')+`<div class=\"card\"><h3>Top 50 performers</h3>")
rep("function renderHist(){$('#hist').innerHTML=`","function renderHist(){$('#hist').innerHTML=`<button class=\"lnk\" data-go=\"learn\">← Back to Learn</button>")
s=re.sub(r"<nav><button class=\"on\" data-t=\"learn\">.*?</nav>",'<nav><button class="on" data-t="learn"><span>📚</span>Learn</button><button data-t="chat"><span>💬</span>Ask</button><button data-t="prac"><span>💰</span>Practice</button><button data-t="picks"><span>📈</span>Markets</button></nav>',s,count=1,flags=re.S)
rep("b.classList.toggle('on',b.dataset.t==t));","b.classList.toggle('on',b.dataset.t==(NAVMAP[t]!=null?NAVMAP[t]:t)));")
rep("const ROUTE={};","const ROUTE={markets:'picks'};")
rep("if(r=='privacy'||r=='terms'||r=='accessibility'){","if(['glossary','tools','badges','replay'].includes(r)){if(!first&&$('#tc').style.display!='flex'){r=='glossary'?showGlossary():r=='tools'?showTools():r=='badges'?showBadges():showReplay()}return}\n if(r=='privacy'||r=='terms'||r=='accessibility'){")
i=s.index("$('#news').innerHTML='<div class=\"card\"><h3>Market news</h3>");j=s.index('\n',i);s=s[:i]+s[j+1:]
NEWS=[["US stocks","Tech sell-off: Nasdaq falls 4.5% in a week","In the week to 16 October the Nasdaq fell 4.5% and the S&P 500 1.9%, while the Dow rose 0.7%. Tech stocks lost about 6% and chip stocks about 11%; Nvidia fell about 7%.","Wealth Enhancement","https://www.wealthenhancement.com/blog/weekly-market-movers-october-19-2026",["Chip stocks fell about 11% in a week. If you owned a semiconductor fund, your investment would most likely…","Fall in value","Rise in value","Stay exactly the same","A sector fund moves with the stocks it holds."]],
["AI financing","CoreWeave drops about 25% on debt worries","The data-centre company's shares fell roughly 25% as some of its debt traded at distressed levels, and investors questioned how AI data centres will be paid for.","Wealth Enhancement","https://www.wealthenhancement.com/blog/weekly-market-movers-october-19-2026",["When a company's debt trades at 'distressed' prices, investors usually see it as…","A sign of higher risk","A guaranteed profit","A dividend increase","Distressed debt means lenders fear they may not be repaid in full."]],
["Oil","US oil tops $100 a barrel","West Texas Intermediate crude rose more than 10% in the week to finish above $100, driven by attacks on shipping and energy sites and a big fall in US crude stocks.","Wealth Enhancement","https://www.wealthenhancement.com/blog/weekly-market-movers-october-19-2026",["Oil jumps above $100. For an airline, whose biggest cost is fuel, this is most likely…","Bad news for profits","Good news for profits","No effect at all","Higher fuel costs squeeze airline profits."]],
["Inflation","US prices rise faster than expected","September consumer prices rose 0.6% and producer prices almost 1.3%, with energy the biggest driver. Core inflation also came in above forecasts.","Wealth Enhancement","https://www.wealthenhancement.com/blog/weekly-market-movers-october-19-2026",["Inflation comes in higher than expected. Central banks are then more likely to…","Keep interest rates high or raise them","Cut rates to zero","Stop all trading","Higher inflation pushes central banks to keep rates high."]],
["Rates","10-year US yield eases to about 5.1%","Treasury yields eased during the stock sell-off: the 10-year ended the week near 5.1% (down from highs near 5.3%), the 2-year near 4.73% and the 30-year at 5.44%.","Wealth Enhancement","https://www.wealthenhancement.com/blog/weekly-market-movers-october-19-2026",["Bond yields fall from 5.3% to 5.1%. Prices of existing bonds most likely…","Rise","Fall","Stay fixed","Bond prices move opposite to yields."]],
["Earnings","Big Tech reports this week","Netflix reports on Tuesday, and Meta, Tesla and IBM on Wednesday. Investors will watch Meta's spending on AI most closely.","Wealth Enhancement","https://www.wealthenhancement.com/blog/weekly-market-movers-october-19-2026",["A company beats analysts' profit estimates and raises its forecast. Its share price most often…","Rises","Falls","Is frozen","Results above expectations usually lift the price."]],
["India","Sensex jumps 1,534 points","On 15 October the Sensex rose 2.11% to 74,315.61 and the Nifty 50 1.66% to 22,997.35, led by IT and banking shares. Tech Mahindra rose 4.75% and ICICI Bank 3.8%.","HDFC Sky","https://hdfcsky.com/hindi/news/stock-market-close-report-october-15-2026-sensex-ends-1533-points-up",["The Nifty 50 rises 1.66% in a day. A Nifty 50 index fund would most likely…","Rise by about the same amount","Fall sharply","Stay flat","An index fund copies its index."]],
["India","Nestle India falls 7.8%","Nestle India was the day's biggest loser on 15 October, falling 7.76% to ₹1,275.80, even as the wider market rallied.","HDFC Sky","https://hdfcsky.com/hindi/news/stock-market-close-report-october-15-2026-sensex-ends-1533-points-up",["The market rises but one stock you own falls 7.8%. This shows why investors…","Spread money across many stocks","Put everything in one stock","Never check prices","One stock can fall even on a good day, and spreading money reduces the damage."]]]
i=s.index("const NEWS=[");j=s.index("]];\n",i)+4;s=s[:i]+"const NEWS="+json.dumps(NEWS,ensure_ascii=False)+";\n"+s[j:]
# --- practice
rep("[\"RELIANCE\",\"Reliance Industries · ₹1,167.70\",\"S\",1167.7/96,\"IN\"]","[\"RELIANCE\",\"Reliance Industries · ₹1,215.00\",\"S\",1215/96,\"IN\"]")
rep("[\"ICICIBANK\",\"ICICI Bank · ₹1,310.60\",\"S\",1310.6/96,\"IN\"]","[\"ICICIBANK\",\"ICICI Bank · ₹1,389.40\",\"S\",1389.4/96,\"IN\"]")
rep("[\"INDA\",\"iShares MSCI India ETF\",\"F\",46.36,\"IN\"]].forEach(x=>MK.push(x));","[\"INDA\",\"iShares MSCI India ETF\",\"F\",46.36,\"IN\"],[\"BHARTIARTL\",\"Bharti Airtel · ₹1,854.00\",\"S\",1854/96,\"IN\"],[\"TECHM\",\"Tech Mahindra · ₹1,650.00\",\"S\",1650/96,\"IN\"],[\"NESTLEIND\",\"Nestle India · ₹1,275.80\",\"S\",1275.8/96,\"IN\"],[\"BEL\",\"Bharat Electronics · ₹380.40\",\"S\",380.4/96,\"IN\"],[\"TRENT\",\"Trent · ₹2,949.70\",\"S\",2949.7/96,\"IN\"]].forEach(x=>MK.push(x));")
rep("const $m=(x,d=2)=>(x<0?'-':'')+'$'+Math.abs(x).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});","const $m=(x,d=2)=>{const inr=S&&S.cur=='INR',v=inr?x*96:x;return (v<0?'-':'')+(inr?'₹':'$')+Math.abs(v).toLocaleString(inr?'en-IN':'en-US',{minimumFractionDigits:d,maximumFractionDigits:d})};")
rep("<div class=\"xp\"><div class=\"tr\" style=\"margin:0 0 12px\">${MKS.map(","<div class=\"xp\" style=\"padding-bottom:0\"><div id=\"pxx\"></div></div><div class=\"xp\"><div class=\"tr\" style=\"margin:0 0 12px\">${MKS.map(")
rep("<div id=\"pn\"></div>","<div id=\"pntabs\" class=\"pntabs\"></div><div id=\"pn\"></div>")
rep("the latest quotes I could find","recent quotes (India: 15 October 2026)")
rep("Closed markets show","Each trade costs 0.1% (at least $0.05, about ₹5), and some holdings pay small simulated dividends each day. Closed markets show")
rep("function drawPN(){$('#pn').innerHTML=PN.map((p,n)=>panelHTML(n)).join('');","function drawPN(){$('#pn').innerHTML=PN.map((p,n)=>panelHTML(n)).join('');{const _b=$('#pxx');if(_b)_b.dataset.k=''}")
rep("b.style.color=b.dataset.mk==mkt?'#f5b942':''","b.classList.toggle('mon',b.dataset.mk==mkt)")
rep("'<span class=\"xs\">Buy a stock and it appears here so you can open its chart.</span>'}","'<span class=\"xs\">No stocks yet. Try the guided first trade above, or tap any company below and buy a small amount.</span>'}paintX();")
rep("hs[i].push(pr[i]);if(hs[i].length>120)hs[i].shift()});paint()}","hs[i].push(pr[i]);if(hs[i].length>120)hs[i].shift()});ordersCheck();paint()}")
rep("$('#prac').onclick=e=>{const t=e.target,g=a=>t.closest('['+a+']'),pn=t.closest('.cd');let x;if(pn)ap=+pn.dataset.n;","$('#prac').onclick=e=>{const t=e.target,g=a=>t.closest('['+a+']'),pn=t.closest('.cd[data-n]');let x;if(pn)ap=+pn.dataset.n;if(pracX(t,g)){paint();return}")
rep("gi('bi',+x.dataset.qb).value=Math.floor(X.cash*100)/100;","gi('bi',+x.dataset.qb).value=Math.floor(toCur(Math.max(0,X.cash-feeOf(X.cash)))*100)/100;")
rep("gi('si',n).value=o?(o.sh*pr[PN[n].i]).toFixed(2):''","gi('si',n).value=o?toCur(o.sh*pr[PN[n].i]).toFixed(2):''")
rep("gi('xt',n).textContent=k[0]+' : '+$m(h[P.hov])}","gi('xt',n).textContent=k[0]+' : '+$m(h[P.hov])}paintPx(n);")
rep("<button class=\"qc\" data-rm=\"${n}\" aria-label=\"Remove this chart\">✕</button></div>","<button class=\"qc\" data-star=\"${n}\" aria-label=\"Add to watchlist\">☆</button><button class=\"qc\" data-rm=\"${n}\" aria-label=\"Remove this chart\">✕</button></div>")
rep("<div class=\"xs\" id=\"po${n}\" style=\"margin-top:8px\"></div>","<div class=\"tr\"><button class=\"qc\" data-otg=\"${n}\">🎯 Orders and alerts</button></div><div class=\"orow\" id=\"orow${n}\" hidden><div class=\"tr\"><select id=\"ot${n}\" aria-label=\"Order type\"><option value=\"lb\">Limit buy</option><option value=\"ls\">Limit sell</option><option value=\"sl\">Stop-loss</option></select><input id=\"op${n}\" type=\"number\" inputmode=\"decimal\" min=\"0\" placeholder=\"Trigger price\" aria-label=\"Trigger price\"></div><div class=\"tr\"><input id=\"oa${n}\" type=\"number\" inputmode=\"decimal\" min=\"0\" placeholder=\"Amount to buy\" aria-label=\"Amount to buy for a limit buy\"><button class=\"bb\" data-po=\"${n}\">Place order</button></div><div class=\"tr\"><input id=\"al${n}\" type=\"number\" inputmode=\"decimal\" min=\"0\" placeholder=\"Alert me at price\" aria-label=\"Alert price\"><button class=\"qc\" data-alrt=\"${n}\">🔔 Set alert</button></div><p class=\"xs\">A limit buy waits for the price to fall to your level. Limit sell and stop-loss sell all your shares when their price is reached. Orders fill only while the market is open.</p></div><div class=\"xs mv\" id=\"mv${n}\"></div><div class=\"xs\" id=\"po${n}\" style=\"margin-top:8px\"></div>")
# --- start, terms, gate, settings, header
rep("<div class=\"tcs\" id=\"tcs\" tabindex=\"0\">${TERMS_HTML}</div>","<div class=\"tcs\" id=\"tcs\" tabindex=\"0\">${view?TERMS_HTML:termsSummary()}</div>")
rep("<button class=\"btn\" id=\"tca\" disabled>","<button class=\"btn\" id=\"tca\">")
rep("Please read to the end. The agree button unlocks when you reach the bottom.","Tapping agree accepts the full Terms and Conditions.")
rep("<label class=\"gk\" style=\"margin-top:10px\"><input type=\"checkbox\" id=\"gagree\"${GAG?' checked':''}> <span>I have read and agree to the <a href=\"#\" id=\"gtl\">Terms and Conditions</a></span></label>",
    "${termsOK()?'<input type=\"checkbox\" id=\"gagree\" checked hidden><p class=\"xs2\" style=\"margin-top:10px\">You agreed to the <a href=\"#\" id=\"gtl\">Terms and Conditions</a>.</p>':'<label class=\"gk\" style=\"margin-top:10px\"><input type=\"checkbox\" id=\"gagree\"'+(GAG?' checked':'')+'> <span>I have read and agree to the <a href=\"#\" id=\"gtl\">Terms and Conditions</a></span></label>'}")
rep("function showGate(m){gmode=m||'in';GAG=false;","function showGate(m){if($('#tc').style.display=='flex'&&!$('#agi')&&!$('#tca')&&!$('[data-su]'))$('#tc').style.display='none';gmode=m||'in';GAG=termsOK();")
rep("async function startup(){showCookie();stat('visit');","async function startup(){stat('visit');setTimeout(()=>{if(!consent()&&(S.done||[]).length)showCookie()},1500);")
rep("}catch(e){}\n showGate('in')}","}catch(e){}\n firstRun()}")
rep("log('info',ss.jwk?'session key moved into the browser vault':'session renewed');","log('info',ss.jwk?'session key moved into the browser vault':'session renewed');setTimeout(wnMaybe,900);")
rep("opsInit();routeInit();","opsInit();routeInit();v4Init();")
rep("<div class=\"tag\" style=\"margin-top:20px\">Appearance</div>","${acExtra()}<div class=\"tag\" style=\"margin-top:20px\">Appearance</div>")
rep("$('#acb').onclick=async e=>{const t=e.target.closest('button');if(!t)return;","$('#acb').onclick=async e=>{const t=e.target.closest('button');if(!t)return;if(acX(t))return;")
rep("const head=()=>{refill();","const head=()=>{refill();streakGuard();")
rep("APP_VER='3.0.0'","APP_VER='4.0.0'")
rep("function refreshAll(){migrate();applyTh();applyFlags();renderLearn();renderHist();head();paint()}","function refreshAll(){migrate();applyTh();applyFlags();applyComfort();refreshBases();renderLearn();renderHist();renderNews();head();paint()}")
rep("const el=$('#tcs'),chk=()=>{const b=$('#tca');if(b&&el.scrollTop+el.clientHeight>=el.scrollHeight-14){b.disabled=false;$('#tcn').textContent='Thanks for reading. You can agree now.'}};el.onscroll=chk;setTimeout(chk,80)}","}")
rep('<span class="xs">100 XP = $1,000 practice cash</span>','<span class="xs" id="xwr">100 XP = $1,000 practice cash</span>')
rep("Hi ${S.name}! You have ${S.xp} XP, a ${eff()}-day streak and ${S.done.length+S.hd.length} lessons done.","Hi ${esc(S.name)}! You have ${S.xp} XP, a ${eff()}-day streak and ${S.done.length+S.hd.length} lesson${S.done.length+S.hd.length==1?'':'s'} done.")
rep('Spend XP in Practice: 100 XP = $1,000.</p>','Spend XP in Practice: 100 XP = ${$m(1000,0)}.</p>')
rep("let ok=0;try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'application/json'}));a.download=nm;document.body.appendChild(a);a.click();a.remove();ok=1}catch(x){}","let ok=0;const dr=await dlSave(nm,t);if(dr=='saved')ok=1;else if(dr!='declined')try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'application/json'}));a.download=nm;document.body.appendChild(a);a.click();a.remove();ok=1}catch(x){}")
# --- add the modules and styles
mods=''.join(open(SP+f,encoding='utf8').read()+'\n' for f in ['v4d.js','v4a.js','v4b.js','v4c.js'])
rep("};\ndrawPN();\nlet rsq='';","};\n"+mods+"drawPN();\nlet rsq='';")
assert s.count('</style>')==1
s=s.replace('</style>',open(SP+'v4.css',encoding='utf8').read()+'</style>')
open(O+'stockgpt.html','w',encoding='utf8').write(s);open(O+'stockgpt-share.html','w',encoding='utf8').write(s);print('ok',len(s))
