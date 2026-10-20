SP='/tmp/claude-0/-home-claude/d6cebc6b-bafa-5f05-9ae9-36df9f9405d6/scratchpad/'
O='/mnt/user-data/outputs/'
s=open(SP+'master-v31.html',encoding='utf8').read()
sec=open(SP+'sec2.js',encoding='utf8').read()
def rep(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(a[:90],c);s=s.replace(a,b)
# chat: block card numbers, ID numbers and passwords, and never echo them
rep("function chatGuard(t){","function chatGuard(t){{const sx=secretIn(t);if(sx){log('warn','private information kept out of the chat');return \"That looks like \"+sx+\", so I didn't send it anywhere. Never share card numbers, ID numbers, passwords or codes with anyone, including chatbots.\"}}")
rep("add(t.slice(0,500),'u');add(g,'a');return}","add(secretIn(t)?'🔒 (hidden: private information)':t.slice(0,500),'u');add(g,'a');return}")
# password change: rate limited, fields cleared
rep("""  const rec=LS('stockgpt:acct:'+ACC.uid);try{await unseal(await mkKey(o,ACC.name,rec&&rec.kdf),rec)}catch(e){am.textContent='Current password is wrong.';return}""",
    """  {const pe=await pwCheck(o);$('#op').value='';if(pe){am.textContent=pe;return}}""")
rep("await pushAcc();am.textContent='Password changed. Use the new one on your other devices.'}","await pushAcc();$('#np').value='';am.textContent='Password changed. Use the new one on your other devices.'}")
# account deletion
rep('data-pw="1">Change password</button><button class="btn ghost" id="lo">Log out</button></div></div>',
    'data-pw="1">Change password</button><button class="btn ghost" id="lo">Log out</button></div><div class="tag" style="margin-top:14px">Delete account</div><p class="xs2" style="margin:2px 0 8px">Removes this account and its saved progress from this device and the cloud. This cannot be undone. Type your current password in the box above first.</p><button class="btn ghost" data-del="1" style="color:var(--r)">Delete my account</button></div>')
rep("else if(t.dataset.th){S.th=t.dataset.th;save();applyTh();renderAc()}",
    "else if(t.dataset.del){const am=$('#am'),o=$('#op').value;if(!o){am.textContent='Type your current password in the box above, then tap Delete my account again.';return}\n  if(rsq!='del'){rsq='del';t.textContent='Tap again to delete for good';am.textContent='Are you sure? Tap the red button again to delete your account.';return}rsq='';\n  t.disabled=true;const pe=await pwCheck(o);$('#op').value='';if(pe){t.disabled=false;t.textContent='Delete my account';am.textContent=pe;return}await deleteAccount()}\n else if(t.dataset.th){S.th=t.dataset.th;save();applyTh();renderAc()}")
# voice names escaped
rep('v.map(x=>`<option value="${x.name}"${S.vn==x.name?\' selected\':\'\'}>${x.name} (${x.lang})</option>`)','v.map(x=>`<option value="${esc(x.name)}"${S.vn==x.name?\' selected\':\'\'}>${esc(x.name)} (${esc(x.lang)})</option>`)')
# shared devices: not kept signed in by default, username only remembered when kept, password cleared from the page
rep('<label class="gk"><input type="checkbox" id="gkeep" checked> Keep me signed in on this device</label>',
    '<label class="gk"><input type="checkbox" id="gkeep"> Keep me signed in on this device</label><p class="xs2" style="margin:2px 0 0 26px">Leave this off on a shared or public device. You will be signed out after 30 minutes without activity.</p>')
rep("try{localStorage.setItem('stockgpt:last',ACC.name);if(keep){","$('#gate').innerHTML='';try{if(keep)localStorage.setItem('stockgpt:last',ACC.name);else localStorage.removeItem('stockgpt:last');if(keep){")
rep('/* ---------- accounts ---------- */',sec+'/* ---------- accounts ---------- */')
open(O+'stockgpt.html','w',encoding='utf8').write(s);open(O+'stockgpt-share.html','w',encoding='utf8').write(s);print('ok')
