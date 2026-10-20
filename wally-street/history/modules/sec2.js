/* ---------- security pass 2: private info in chat, account deletion, idle sign-out ---------- */
function luhn(d){let s=0,a=0;for(let i=d.length-1;i>=0;i--){let n=+d[i];if(a){n*=2;if(n>9)n-=9}s+=n;a^=1}return s%10==0}
function secretIn(t){const runs=(t.match(/\d[\d -]{11,22}\d/g)||[]).map(x=>x.replace(/\D/g,''));
 if(runs.some(d=>d.length>=13&&d.length<=19&&luhn(d)))return 'a card number';
 if(/\b\d{4}\s?\d{4}\s?\d{4}\b/.test(t)&&/aadha+r|\buid\b/i.test(t))return 'an ID number';
 if(/\b[A-Z]{5}\d{4}[A-Z]\b/.test(t)||/\b\d{3}-\d{2}-\d{4}\b/.test(t))return 'an ID number';
 if(/\b(my|the)\s+(password|passcode|pin|otp|cvv|upi pin)\s*(is|=|:)/i.test(t)||/\b(password|passcode|otp|cvv)\s*[:=]\s*\S+/i.test(t))return 'a password or code';return ''}
async function pwCheck(pw){const lim=rlBlock('in');if(lim)return lim;const rec=LS('stockgpt:acct:'+ACC.uid);let ok=false;try{await unseal(await mkKey(pw,ACC.name,rec&&rec.kdf),rec);ok=true}catch(e){}rlRecord('in',ok);return ok?'':'Current password is wrong.'}
async function deleteAccount(){const A=ACC;if(!A)return;clearTimeout(syncT);A.cloudOff=1;
 try{localStorage.removeItem('stockgpt:acct:'+A.uid)}catch(e){}
 try{localStorage.setItem('stockgpt:bak',JSON.stringify((LS('stockgpt:bak')||[]).filter(x=>x&&x.uid!==A.uid)))}catch(e){}
 try{const r=LS(RLK)||{};if(r.a)r.a=Math.max(0,r.a-1);localStorage.setItem(RLK,JSON.stringify(r))}catch(e){}
 try{if(localStorage.getItem('stockgpt:last')==A.name)localStorage.removeItem('stockgpt:last')}catch(e){}
 if(cloud){try{await cdoc(cpath(A.uid)).delete()}catch(e){}try{await cdoc('acct/'+A.uid).delete()}catch(e){}}
 dlqClear();log('info','account and its data deleted');ACC=null;logout();renderGate('Your account and its saved data were deleted.')}
let LASTACT=Date.now();['pointerdown','keydown','touchstart'].forEach(ev=>addEventListener(ev,()=>{LASTACT=Date.now()},{passive:true,capture:true}));
setInterval(()=>{if(ACC&&!LS('stockgpt:sess')&&Date.now()-LASTACT>30*6e4){log('info','signed out after 30 minutes without activity');Promise.resolve(pushAcc()).catch(()=>{}).finally(()=>{logout();renderGate('You were signed out after 30 minutes without activity, to protect your account.')})}},60000);
