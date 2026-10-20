SP='/tmp/claude-0/-home-claude/d6cebc6b-bafa-5f05-9ae9-36df9f9405d6/scratchpad/'
O='/mnt/user-data/outputs/'
s=open(SP+'master-v27.html',encoding='utf8').read()
sec=open(SP+'sec.js',encoding='utf8').read()
def rep(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(a[:90],c);s=s.replace(a,b)
# --- state sanitizing everywhere data is loaded
rep("try{Object.assign(S,JSON.parse(localStorage.getItem('stockgpt:v1')||'{}'))}catch(e){}","try{S=cleanS(JSON.parse(localStorage.getItem('stockgpt:v1')||'{}'))}catch(e){}")
rep("try{const z=JSON.parse(localStorage.getItem('stockgpt:px'));if(z&&z.pos)X=z}","try{const z=JSON.parse(localStorage.getItem('stockgpt:px'));if(z&&z.pos)X=cleanX(z)}")
rep("const d=await unseal(ACC.key,o.enc);S=Object.assign(defS(),d.S);X=d.X||X}else{if(ACC)throw new Error('This is a guest backup. Log out to restore it.');S=Object.assign(defS(),o.S);X=o.X&&o.X.pos?o.X:{cash:1e5,pos:{}}}",
    "let d;try{d=await unseal(ACC.key,o.enc)}catch(e){throw new Error('This backup was locked with an older password or key, so it cannot be opened now.')}S=cleanS(d.S);X=d.X?cleanX(d.X):X}else{if(ACC)throw new Error('This is a guest backup. Log out to restore it.');S=cleanS(o.S);X=cleanX(o.X)}")
rep("if(z)S=Object.assign(defS(),z);const p=LS('stockgpt:px');if(p&&p.pos)X=p;","if(z)S=cleanS(z);const p=LS('stockgpt:px');if(p&&p.pos)X=cleanX(p);")
rep("const d=await unseal(ACC.key,LS('stockgpt:acct:'+ACC.uid));S=Object.assign(defS(),d.S);X=d.X||X;","const d=await unseal(ACC.key,LS('stockgpt:acct:'+ACC.uid));S=cleanS(d.S);X=d.X?cleanX(d.X):X;")
# --- key derivation: random salt + 600k rounds, non-extractable keys
rep("async function mkKey(pw,n){const m=await crypto.subtle.importKey('raw',te.encode(pw),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt:te.encode('stockgpt-salt:'+n.toLowerCase()),iterations:150000,hash:'SHA-256'},m,{name:'AES-GCM',length:256},true,['encrypt','decrypt'])}",
    "async function mkKey(pw,n,k){const m=await crypto.subtle.importKey('raw',te.encode(pw),'PBKDF2',false,['deriveKey']),ok=k&&typeof k.s=='string'&&k.s.length<200;return crypto.subtle.deriveKey({name:'PBKDF2',salt:ok?ub(k.s):te.encode('stockgpt-salt:'+n.toLowerCase()),iterations:ok?Math.min(5e6,Math.max(1e5,Number(k.i)||KDF_N)):150000,hash:'SHA-256'},m,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}")
# --- private per-person cloud storage
rep("const cloudP=new Promise(r=>{try{window.claude.use('db').then(d=>{cloud=d;r()},()=>r())}catch(e){r()}})",
    "const cloudP=new Promise(r=>{try{window.claude.use('db').then(async d=>{await userP;cloud=d&&CUID?d:null;if(d&&!CUID)log('warn','cloud save needs you to be signed in to claude.ai');r()},()=>r())}catch(e){r()}})")
rep("'☁️ Synced to the cloud. Log in from any device.'","'☁️ Synced to your private cloud space. Log in on any device where you use the same claude.ai account.'")
rep("'☁️ Cloud sync is on: log in from any device with your username and password.'","'☁️ Cloud sync is on. Your data is kept in your own private space: log in on any device signed in to the same claude.ai account.'")
rep("const A=ACC,b={...await seal(A.key,{S,X}),t:Date.now(),api:API_V,sv:SCHEMA_V};","const A=ACC,b={...await seal(A.key,{S,X}),t:Date.now(),api:API_V,sv:SCHEMA_V,...(A.kdf?{kdf:A.kdf}:{})};")
rep("cdoc('acct/'+A.uid).set(b)","cdoc(cpath(A.uid)).set(b)")
rep("""async function syncFromCloud(){if(!ACC||!cloud||ACC.cloudOff)return;try{const sn=await gw('cloud.read',()=>cdoc('acct/'+ACC.uid).get(),{retries:2}),l=LS('stockgpt:acct:'+ACC.uid);
 if(!sn.exists){await pushAcc();return}const c=sn.data();let d;try{d=await unseal(ACC.key,c)}catch(e){ACC.cloudOff=1;return}
 if(!l||c.t>l.t){S=Object.assign(defS(),d.S);X=d.X||X;try{localStorage.setItem('stockgpt:acct:'+ACC.uid,JSON.stringify(c))}catch(e){}refreshAll()}else if(c.t<l.t)await pushAcc();else ACC.cloud=true}catch(e){}}""",
"""async function syncFromCloud(){if(!ACC||!cloud||ACC.cloudOff)return;const A=ACC;try{let sn=await gw('cloud.read',()=>cdoc(cpath(A.uid)).get(),{retries:2}),legacy=false;
 if(!sn.exists){try{const lg=await cdoc('acct/'+A.uid).get();if(lg.exists){sn=lg;legacy=true}}catch(e){}}
 const l=LS('stockgpt:acct:'+A.uid);if(!sn.exists){await pushAcc();return}const c=sn.data();let d;
 try{d=await unseal(A.key,c)}catch(e){if(legacy)return;forceRelogin('Your account was changed on another device (for example, a new password). Please log in again.');return}
 if(!l||c.t>l.t){S=cleanS(d.S);X=d.X?cleanX(d.X):X;try{localStorage.setItem('stockgpt:acct:'+A.uid,JSON.stringify(c))}catch(e){}refreshAll()}
 if(legacy){await pushAcc();if(A.cloud){try{await cdoc('acct/'+A.uid).delete()}catch(e){}log('info','cloud copy moved to private storage')}return}
 if(c.t<l.t)await pushAcc();else A.cloud=true}catch(e){}}""")
rep("""async function signup(n,pw){const uid=await uidOf(n);let c=null;if(cloud){try{const sn=await gw('cloud.read',()=>cdoc('acct/'+uid).get(),{retries:1});if(sn.exists)c=1}catch(e){}}""",
    """async function signup(n,pw){const uid=await uidOf(n);let c=null;if(cloud){try{const sn=await gw('cloud.read',()=>cdoc(cpath(uid)).get(),{retries:1});if(sn.exists)c=1}catch(e){}}""")
rep("if(S.name=='Trader')S.name=n;ACC={name:n,uid,key:await mkKey(pw,n)};await pushAcc();return ''}",
    "if(S.name=='Trader')S.name=n;const kdf=newKdf();ACC={name:n,uid,kdf,key:await mkKey(pw,n,kdf)};await pushAcc();return ''}")
rep("""async function login(n,pw){const uid=await uidOf(n);let c=null;if(cloud){try{const sn=await gw('cloud.read',()=>cdoc('acct/'+uid).get(),{retries:1});if(sn.exists)c=sn.data()}catch(e){}}
 const l=LS('stockgpt:acct:'+uid),b=c&&l?(c.t>=l.t?c:l):(c||l);if(!b)return 'No account found with that username.'+(cloud?'':' Accounts on this link are saved on this device only.');
 let key,d;try{key=await mkKey(pw,n);d=await unseal(key,b)}catch(e){return 'Wrong username or password.'}
 S=Object.assign(defS(),d.S);X=d.X||{cash:1e5,pos:{}};ACC={name:n,uid,key};await pushAcc();return ''}""",
"""async function login(n,pw){const uid=await uidOf(n),C=[],bad='Wrong username or password.'+(cloud?'':' On this link, accounts are saved on this device only.');let legacy=false;
 if(cloud){try{const sn=await gw('cloud.read',()=>cdoc(cpath(uid)).get(),{retries:1});if(sn.exists)C.push(sn.data());else{try{const lg=await cdoc('acct/'+uid).get();if(lg.exists){C.push(lg.data());legacy=true}}catch(e){}}}catch(e){}}
 const l=LS('stockgpt:acct:'+uid);if(l&&l.iv)C.push(l);if(!C.length)return bad;
 C.sort((a,b)=>(b.t||0)-(a.t||0));let key,d,rec;for(const b of C){try{const k=await mkKey(pw,n,b.kdf);d=await unseal(k,b);key=k;rec=b;break}catch(e){}}
 if(!d)return bad;let kdf=rec.kdf;if(!kdf||!kdf.s||!(kdf.i>=KDF_N)){kdf=newKdf();key=await mkKey(pw,n,kdf);log('info','password protection upgraded to a random salt and 600,000 rounds')}
 S=cleanS(d.S);X=d.X?cleanX(d.X):{cash:1e5,pos:{}};ACC={name:n,uid,key,kdf};await pushAcc();
 if(legacy&&ACC.cloud){try{await cdoc('acct/'+uid).delete()}catch(e){}log('info','cloud copy moved to private storage')}return ''}""")
rep("if(keep)localStorage.setItem('stockgpt:sess',JSON.stringify({iat:Date.now(),sid:tid(),name:ACC.name,uid:ACC.uid,jwk:await crypto.subtle.exportKey('jwk',ACC.key)}));else localStorage.removeItem('stockgpt:sess')}catch(e){}",
    "if(keep){try{await sessSave()}catch(e){log('warn','this browser could not keep you signed in');try{localStorage.removeItem('stockgpt:sess')}catch(x){}}}else await sessClear()}catch(e){}")
rep("function logout(){try{localStorage.removeItem('stockgpt:sess')}catch(e){}clearTimeout(syncT);ACC=null;S=defS();","function logout(){sessClear();clearTimeout(syncT);ACC=null;S=cleanS({});")
rep("""if(ss&&ss.iat&&Date.now()-ss.iat>30*864e5){localStorage.removeItem('stockgpt:sess');log('info','session expired after 30 days; please log in again')}else if(ss){const l=LS('stockgpt:acct:'+ss.uid),key=await crypto.subtle.importKey('jwk',ss.jwk,{name:'AES-GCM'},true,['encrypt','decrypt']),d=await unseal(key,l);
 S=Object.assign(defS(),d.S);X=d.X||{cash:1e5,pos:{}};ACC={name:ss.name,uid:ss.uid,key};try{localStorage.setItem('stockgpt:sess',JSON.stringify(sessStamp(ss)))}catch(e){}log('info','session renewed');""",
"""if(ss&&ss.iat&&Date.now()-ss.iat>30*864e5){await sessClear();log('info','session expired after 30 days; please log in again')}else if(ss&&/^[0-9a-f]{32}$/.test(ss.uid||'')&&/^[A-Za-z0-9_]{3,20}$/.test(ss.name||'')){const l=LS('stockgpt:acct:'+ss.uid),key=ss.jwk?await crypto.subtle.importKey('jwk',ss.jwk,{name:'AES-GCM'},false,['encrypt','decrypt']):await kget('sess'),d=await unseal(key,l);
 S=cleanS(d.S);X=d.X?cleanX(d.X):{cash:1e5,pos:{}};ACC={name:ss.name,uid:ss.uid,key,kdf:l.kdf};try{await sessSave()}catch(e){if(ss.jwk)try{localStorage.removeItem('stockgpt:sess')}catch(x){}}log('info',ss.jwk?'session key moved into the browser vault':'session renewed');""")
# --- password change
rep("if(nw.length<6){am.textContent='New password must be at least 6 characters.';return}","{const pi=pwIssue(nw,ACC.name);if(pi){am.textContent=pi;return}}")
rep("try{await unseal(await mkKey(o,ACC.name),LS('stockgpt:acct:'+ACC.uid))}catch(e){am.textContent='Current password is wrong.';return}",
    "const rec=LS('stockgpt:acct:'+ACC.uid);try{await unseal(await mkKey(o,ACC.name,rec&&rec.kdf),rec)}catch(e){am.textContent='Current password is wrong.';return}")
i=s.index("ACC.key=await mkKey(nw,ACC.name);");j=s.index("await pushAcc();am.textContent='Password changed.",i)
s=s[:i]+"ACC.kdf=newKdf();ACC.key=await mkKey(nw,ACC.name,ACC.kdf);if(LS('stockgpt:sess')){try{await sessSave()}catch(e){}}\n  "+s[j:]
rep('placeholder="New password (6+ characters)"','placeholder="New password (8+ characters)" maxlength="128"')
# --- gate: escape, password policy, hint
rep('autocapitalize="none" value="${LN}">','autocapitalize="none" spellcheck="false" value="${esc(LN)}">')
rep('<input id="gp" class="inp" type="password" autocomplete=','<input id="gp" class="inp" type="password" maxlength="128" autocomplete=')
rep("""${gmode=='up'?'<label for="gp2">Confirm password</label>""","""${gmode=='up'?'<p class="xs2" style="margin:-4px 0 8px">At least 8 characters, not a common password, and not your username.</p><label for="gp2">Confirm password</label>""")
rep("if(pw.length<6)return renderGate('Password must be at least 6 characters.');","if(gmode=='up'){const pi=pwIssue(pw,n);if(pi)return renderGate(pi)}else if(pw.length<6||pw.length>128)return renderGate('Wrong username or password.');")
rep("<h3>👤 ${ACC.name}</h3>","<h3>👤 ${esc(ACC.name)}</h3>")
rep("const er=()=>Promise.reject(new Error('rate limit'));return{get:er,set:er}","const er=()=>Promise.reject(new Error('rate limit'));return{get:er,set:er,delete:er}")
rep('target="_blank" rel="noopener"','target="_blank" rel="noopener noreferrer"')
# --- checklist wording
rep("✅ Each account is encrypted with a key made from its own password, so one user cannot open another user's data.","✅ Each account is encrypted with a key made from its own password, and its cloud copy sits in that person's private space, so nobody else can read, change or delete it.")
rep("✅ The cloud copy is encrypted before upload, so storage only ever holds scrambled data.","✅ The cloud copy is encrypted before upload and kept in private, per-person storage that other viewers cannot list or read.")
rep("✅ Passwords are never stored. PBKDF2-SHA-256 with 150,000 rounds turns them into a key.","✅ Passwords are never stored. PBKDF2-SHA-256 with a random salt and 600,000 rounds turns them into a key. New passwords need 8+ characters, and common ones are refused.")
rep("✅ Sessions expire after 30 days, and the session record is renewed on every visit.","✅ Sessions expire after 30 days and are renewed on every visit. The session key sits in the browser's key vault and cannot be copied out.")
rep("✅ Each account can open only its own encrypted data.","✅ Each person's cloud data is private to their claude.ai account, and each Wally account opens only with its own password.")
# --- insert hardening helpers right before the accounts section
rep('/* ---------- accounts ---------- */',sec+'/* ---------- accounts ---------- */')
assert 'exportKey' not in s and "cdoc('acct/'+A.uid).set" not in s
open(O+'stockgpt.html','w',encoding='utf8').write(s)
open(O+'stockgpt-share.html','w',encoding='utf8').write(s)
print('ok',len(s))
