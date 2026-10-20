import re
SP='/tmp/claude-0/-home-claude/d6cebc6b-bafa-5f05-9ae9-36df9f9405d6/scratchpad/'
O='/mnt/user-data/outputs/'
s=open(SP+'master-v25.html',encoding='utf8').read()
ops=open(SP+'ops.js',encoding='utf8').read()
def rep(a,b,n=1):
    global s
    c=s.count(a)
    assert c==n,(a[:80],c)
    s=s.replace(a,b)
# 1. remove the Dev tab
rep('<button data-t="dev"><span>🛡️</span>Dev</button>','')
rep('<section class="view" id="dev"></section>\n','')
rep("['learn','chat','news','picks','prac','hist','dev']","['learn','chat','news','picks','prac','hist']")
i=s.index('],DEVIMG=[');j=s.index('"];\n',i)
s=s[:i+1]+';\n'+s[j+4:]
i=s.index('function renderDev(){');j=s.index("$('#dev').onchange=",i);j=s.index('\n',j)+1
s=s[:i]+s[j:]
rep('function refreshAll(){applyTh();renderLearn();renderHist();renderDev();head();paint()}','function refreshAll(){migrate();applyTh();applyFlags();renderLearn();renderHist();head();paint()}')
rep('renderDev();\ntermsOK()?startup():showTerms();','opsInit();\ntermsOK()?startup():showTerms();')
assert 'renderDev' not in s and 'DEVIMG' not in s
# 3. hooks
rep("const save=()=>{if(ACC)return queueSync();try{localStorage.setItem('stockgpt:v1',JSON.stringify(S))}catch(e){}};",
    "const save=()=>{if(ACC)return queueSync();let ok=1;try{localStorage.setItem('stockgpt:v1',JSON.stringify(S))}catch(e){ok=0}metric('save.local',0,ok);bcast()};")
rep("function local(q){","function local0(q){")
rep(" const D=[];\n"," let D=DIDX;if(!D){D=[];\n")
rep(" const has=(z,x)=>new RegExp"," DIDX=D}\n const has=(z,x)=>new RegExp")
rep("t=(t||'').trim();if(!t||busy)return;busy=true;",
    "t=(t||'').trim();if(!t||busy)return;{const g=chatGuard(t);if(g){$('#in').value='';add(t.slice(0,500),'u');add(g,'a');return}t=t.replace(/[\\u0000-\\u001f\\u007f]/g,' ').slice(0,500)}busy=true;")
rep("if(!sample)throw 0;","if(!sample||!flag('ai'))throw 0;")
rep("const r=await sample(","const r=await gw('ai.answer',()=>sample(")
rep("msgs.scrollTop=msgs.scrollHeight}});\n  out=r.text","msgs.scrollTop=msgs.scrollHeight}}),{timeout:45000,retries:1});\n  out=r.text")
rep("msgs.appendChild(d);msgs.scrollTop","msgs.appendChild(d);while(msgs.children.length>80)msgs.firstChild.remove();msgs.scrollTop")
rep("hist.push(['stockgpt',out]);","hist.push(['stockgpt',out]);if(hist.length>40)hist.splice(0,hist.length-40);")
rep("setInterval(()=>{if($('#prac').classList.contains('on'))tick()},1200);","setInterval(()=>{if(!document.hidden&&$('#prac').classList.contains('on'))tickA()},1200);")
rep("function trade(n,sd){","function trade0(n,sd){")
rep("else if(x=g('data-xp')){","else if((x=g('data-xp'))&&once('xp:'+x.dataset.xp,900)){")
# cloud calls through the gateway, DLQ, payload limit, locks
rep("""async function pushAcc(){if(!ACC)return;const b={...await seal(ACC.key,{S,X}),t:Date.now()};try{localStorage.setItem('stockgpt:acct:'+ACC.uid,JSON.stringify(b))}catch(e){}
 if(cloud&&!ACC.cloudOff){try{await cdoc('acct/'+ACC.uid).set(b);ACC.cloud=true}catch(e){ACC.cloud=false}}}""",
"""async function pushAcc(){if(!ACC)return;const A=ACC,b={...await seal(A.key,{S,X}),t:Date.now(),api:API_V,sv:SCHEMA_V};let ok=1;try{localStorage.setItem('stockgpt:acct:'+A.uid,JSON.stringify(b))}catch(e){ok=0}metric('save.local',0,ok);bcast();
 if(cloud&&!A.cloudOff){if(JSON.stringify(b).length>5e5){log('error','save is over 500 KB, so it was kept on this device only');return}if(!navigator.onLine){dlqAdd();return}
  try{await withLock('wally-street-sync',()=>gw('cloud.write',()=>cdoc('acct/'+A.uid).set(b)));A.cloud=true;dlqClear()}catch(e){A.cloud=false;dlqAdd()}}}""")
rep("await cdoc('acct/'+ACC.uid).get()","await gw('cloud.read',()=>cdoc('acct/'+ACC.uid).get(),{retries:2})")
rep("await cdoc('acct/'+uid).get()","await gw('cloud.read',()=>cdoc('acct/'+uid).get(),{retries:1})",2)
# session expiry + rotation
rep("JSON.stringify({name:ACC.name,uid:ACC.uid,jwk:","JSON.stringify({iat:Date.now(),sid:tid(),name:ACC.name,uid:ACC.uid,jwk:",2)
rep("async function startup(){try{const ss=LS('stockgpt:sess');if(ss){",
    "async function startup(){try{const ss=LS('stockgpt:sess');if(ss&&ss.iat&&Date.now()-ss.iat>30*864e5){localStorage.removeItem('stockgpt:sess');log('info','session expired after 30 days; please log in again')}else if(ss){")
rep("ACC={name:ss.name,uid:ss.uid,key};$('#gate').style.display='none';",
    "ACC={name:ss.name,uid:ss.uid,key};try{localStorage.setItem('stockgpt:sess',JSON.stringify(sessStamp(ss)))}catch(e){}log('info','session renewed');$('#gate').style.display='none';")
# account screen entry point
rep('<div class="tag" style="margin-top:20px">Appearance</div>','<div class="tag" style="margin-top:20px">System</div><button class="btn ghost" data-ops="1">🩺 System status, security and backups</button><p class="xs2">Health checks, backups, feature flags, incidents and the security checklist.</p>\n<div class="tag" style="margin-top:20px">Appearance</div>')
rep("else if(t.dataset.terms)showTerms(true);","else if(t.dataset.terms)showTerms(true);\n else if(t.dataset.ops)showOps();")
# 2. insert the ops layer before the terms section
rep('/* ---------- terms and conditions ---------- */',ops+'/* ---------- terms and conditions ---------- */')
# CSS
css='''#alrt{position:fixed;left:50%;transform:translateX(-50%);top:calc(8px + env(safe-area-inset-top,0px));z-index:60;max-width:min(560px,calc(100% - 24px));display:none;gap:10px;align-items:center;background:#7a1d1a;color:#fff;border-radius:14px;padding:10px 12px 10px 14px;font-size:14px;font-weight:700;box-shadow:0 10px 24px -10px rgba(0,0,0,.6)}#alrt.off{background:#33404a}#alrt button{background:none;border:0;color:#fff;font-size:18px;cursor:pointer;flex:none}
.opl{padding-left:22px}.opl li{margin:6px 0}.opt2{overflow-x:auto}.opt2 table{border-collapse:collapse;font-size:13px;min-width:100%}.opt2 th,.opt2 td{border-bottom:1px solid var(--line);padding:6px 8px;text-align:left;white-space:nowrap}
.oplog{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:12px;line-height:1.5;max-height:260px;overflow-y:auto;background:var(--card);border:2px solid var(--line);border-radius:12px;padding:8px 10px}.oplog .lv-warn{color:#b7791f}.oplog .lv-error{color:var(--r)}
.tcs .ck{display:flex;gap:8px;align-items:center;margin:6px 0}.tcs .ck input{width:18px;height:18px}
html.notape .tape{display:none}html.noanim *{animation:none!important;transition:none!important}
'''
assert s.count('</style>')==1
s=s.replace('</style>',css+'</style>')
open(O+'stockgpt.html','w',encoding='utf8').write(s)
open(O+'stockgpt-share.html','w',encoding='utf8').write(s)
print('master',len(s))
