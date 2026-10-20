/* ---------- security hardening ---------- */
const KDF_N=600000,COMMON=new Set('password password1 password12 password123 passw0rd 12345678 123456789 1234567890 87654321 qwerty12 qwerty123 qwertyuiop asdfghjk iloveyou 11111111 00000000 abc12345 abcd1234 letmein1 welcome1 admin123 football baseball sunshine princess monkey123 dragon123 trader123 stocks123 wallstreet wallystreet stockgpt'.split(' '));
function pwIssue(p,n){if(p.length<8)return 'Password must be at least 8 characters.';if(p.length>128)return 'Password must be 128 characters or fewer.';const l=p.toLowerCase();if(COMMON.has(l)||/^(.)\1+$/.test(p)||/^(0123|1234|abcd|qwer)/.test(l)&&p.length<10)return 'That password is too common. Pick something harder to guess.';if(n&&l.includes(n.toLowerCase()))return 'Your password should not contain your username.';return ''}
function newKdf(){return{s:b64(crypto.getRandomValues(new Uint8Array(16))),i:KDF_N}}
function cleanS(o){o=o&&typeof o=='object'&&!Array.isArray(o)?o:{};const num=(v,a,b,df)=>{v=Number(v);return isFinite(v)?Math.min(b,Math.max(a,Math.round(v))):df},ints=a=>Array.isArray(a)?[...new Set(a.map(Number).filter(v=>Number.isInteger(v)&&v>=0&&v<10000))].slice(0,2000):[],str=(v,m)=>typeof v=='string'?v.slice(0,m):'',dre=/^\d{4}-\d{1,2}-\d{1,2}$/;
 const r={xp:num(o.xp,0,1e7,0),done:ints(o.done),streak:num(o.streak,0,1e5,0),last:dre.test(str(o.last,12))?o.last:'',days:Array.isArray(o.days)?o.days.filter(x=>typeof x=='string'&&dre.test(x)).slice(-60):[],
  name:(str(o.name,20).replace(/[<>"'&`\\=]/g,'').trim()||'Trader'),hd:ints(o.hd),th:['auto','light','dark'].includes(o.th)?o.th:'auto',hr:num(o.hr,0,5,5),hday:/^\d{4}-\d{2}-\d{2}$/.test(str(o.hday,12))?o.hday:'',vw:ints(o.vw),vv:o.vv?1:0,chk:ints(o.chk),sv:num(o.sv,1,99,1),ff:{}};
 if(o.ff&&typeof o.ff=='object')['ai','tape','anim'].forEach(k=>{if(o.ff[k]===0)r.ff[k]=0});
 if(typeof o.vn=='string')r.vn=str(o.vn,120).replace(/[<>"&]/g,'');
 if(o.tc&&typeof o.tc=='object')r.tc={v:str(o.tc.v,10).replace(/[^\w.]/g,''),t:str(o.tc.t,40).replace(/[^\w.:+-]/g,'')};
 return r}
function cleanX(o){const r={cash:1e5,pos:{}};if(!o||typeof o!='object')return r;const c=Number(o.cash);r.cash=isFinite(c)?Math.min(1e12,Math.max(0,c)):1e5;
 if(o.pos&&typeof o.pos=='object')Object.keys(o.pos).forEach(t=>{const p=o.pos[t];if(!MK.some(m=>m[0]===t)||!p||typeof p!='object')return;const sh=Number(p.sh),cc=Number(p.c);if(isFinite(sh)&&sh>0&&sh<1e12&&isFinite(cc))r.pos[t]=Object.assign(Object.create(null),{sh,c:cc})});
 r.pos=Object.assign({},r.pos);return r}
function idb(){return new Promise((r,j)=>{try{const q=indexedDB.open('wally-street',1);q.onupgradeneeded=()=>q.result.createObjectStore('k');q.onsuccess=()=>r(q.result);q.onerror=()=>j(q.error)}catch(e){j(e)}})}
async function kput(id,v){const d=await idb();return new Promise((r,j)=>{const t=d.transaction('k','readwrite'),s=t.objectStore('k');if(v==null)s.delete(id);else s.put(v,id);t.oncomplete=()=>r();t.onerror=()=>j(t.error)})}
async function kget(id){const d=await idb();return new Promise((r,j)=>{const q=d.transaction('k').objectStore('k').get(id);q.onsuccess=()=>r(q.result);q.onerror=()=>j(q.error)})}
async function sessSave(){await kput('sess',ACC.key);localStorage.setItem('stockgpt:sess',JSON.stringify(sessStamp({name:ACC.name,uid:ACC.uid,idb:1})))}
async function sessClear(){try{localStorage.removeItem('stockgpt:sess')}catch(e){}try{await kput('sess',null)}catch(e){}}
function forceRelogin(m){sessClear();clearTimeout(syncT);ACC=null;S=cleanS({});X={cash:1e5,pos:{}};$('#ac').style.display='none';refreshAll();showGate('in');renderGate(m);log('warn','logged out: account changed on another device')}
let CUID=null;const userP=new Promise(r=>{try{window.claude.use('user').then(u=>{if(!u)return r();u.id().then(i=>{CUID=typeof i=='string'&&/^[A-Za-z0-9_\-.~:@+]{1,200}$/.test(i)?i:null;r()},()=>r())},()=>r())}catch(e){r()}});
const cpath=uid=>'data/users/'+CUID+'/'+uid;
