/* ================= Wally Street 4.0: saved-data rules for the new settings ================= */
function cleanS(o){const r=cleanS0(o);o=o&&typeof o=='object'&&!Array.isArray(o)?o:{};const str=(v,m)=>typeof v=='string'?v.slice(0,m).replace(/[<>"&`\\]/g,''):'',int=(v,a,b,d)=>{v=Number(v);return Number.isFinite(v)?Math.min(b,Math.max(a,Math.round(v))):d},one=(v,l,d)=>l.includes(v)?v:d;
 if(o.setup&&typeof o.setup=='object')r.setup={g:one(o.setup.g,['learn','invest','trade'],'learn'),l:one(o.setup.l,['new','some','pro'],'new'),c:one(o.setup.c,['IN','US','OT'],'OT')};
 r.cur=one(o.cur,['USD','INR'],'USD');r.snd=o.snd===0?0:1;r.pxd=o.pxd?1:0;r.tz=int(o.tz,0,2,0);r.hc=o.hc?1:0;r.fz=int(o.fz,0,2,0);r.pt=o.pt?1:0;r.savep=o.savep?1:0;r.gft=o.gft?1:0;r.inv=o.inv?1:0;r.rv=int(o.rv,0,1e6,0);
 if(typeof o.code=='string'&&/^WALLY-[A-Z0-9]{4}$/.test(o.code))r.code=o.code;r.wn=str(o.wn,12);r.nq=str(o.nq,12);
 if(o.dg&&typeof o.dg=='object')r.dg={d:str(o.dg.d,12),l:int(o.dg.l,0,999,0),t:int(o.dg.t,0,999,0),b:o.dg.b?1:0};
 const BID='first perfect s3 s7 s30 l10 lvl1 t1 t10 ord g5 rev pt mis crash plan india news share goal'.split(' ');r.bd=Array.isArray(o.bd)?[...new Set(o.bd.filter(x=>BID.includes(x)))]:[];
 r.mis=Array.isArray(o.mis)?o.mis.filter(m=>m&&Array.isArray(m.q)&&m.q.length==4).slice(-60).map(m=>({q:m.q.map(x=>String(x).slice(0,300).replace(/[<>]/g,'')),w:String(m.w||'').slice(0,400).replace(/[<>]/g,''),f:m.f?1:0,st:int(m.st,0,2,0),due:int(m.due,0,9e15,Date.now())})):[];
 if(o.ms&&typeof o.ms=='object'){const MID=['phone','first500','crash'];r.ms={id:one(o.ms.id,MID.concat(''),''),calc:o.ms.calc?1:0,rp:o.ms.rp?1:0,done:Array.isArray(o.ms.done)?o.ms.done.filter(x=>MID.includes(x)):[],lastM:int(o.ms.lastM,0,1e9,5000)}}
 if(o.wk&&typeof o.wk=='object')r.wk={w:str(o.wk.w,12),v:Number.isFinite(+o.wk.v)&&+o.wk.v>0?+o.wk.v:1e5,best:Number.isFinite(+o.wk.best)?+o.wk.best:0};
 const ids=a=>Array.isArray(a)?a.map(Number).filter(n=>Number.isInteger(n)&&n>=0&&n<100).slice(0,80):[];
 if(o.cls&&typeof o.cls=='object')r.cls={c:str(o.cls.c,40),t:str(o.cls.t,30),l:ids(o.cls.l)};
 if(o.tch&&typeof o.tch=='object')r.tch={c:str(o.tch.c,40),l:ids(o.tch.l),res:Array.isArray(o.tch.res)?o.tch.res.slice(-60).map(x=>({n:str(x&&x.n,20),d:int(x&&x.d,0,99,0),x:int(x&&x.x,0,1e7,0)})):[]};
 return r}
function cleanX(o){const r=cleanX0(o);if(!o||typeof o!='object')return r;const ok=t=>typeof t=='string'&&MK.some(m=>m[0]===t),num=v=>Number.isFinite(+v)?+v:0;
 r.h=Array.isArray(o.h)?o.h.filter(x=>x&&ok(x.tk)&&['b','s','d'].includes(x.sd)).slice(-200).map(x=>({ts:num(x.ts),tk:x.tk,sd:x.sd,v:num(x.v),px:num(x.px),fee:num(x.fee),pl:num(x.pl),why:typeof x.why=='string'?x.why.slice(0,40).replace(/[<>"&]/g,''):''})):[];
 r.ord=Array.isArray(o.ord)?o.ord.filter(x=>x&&ok(x.tk)&&['lb','ls','sl'].includes(x.ty)&&num(x.px)>0).slice(0,20).map(x=>({id:String(x.id||'').replace(/[^a-z0-9]/g,'').slice(0,12)||tid(),tk:x.tk,ty:x.ty,px:num(x.px),amt:num(x.amt),ts:num(x.ts)})):[];
 r.w=Array.isArray(o.w)?[...new Set(o.w.filter(ok))].slice(-20):[];
 r.al=Array.isArray(o.al)?o.al.filter(x=>x&&ok(x.tk)&&num(x.px)>0&&['up','down'].includes(x.dir)).slice(-20).map(x=>({tk:x.tk,px:num(x.px),dir:x.dir})):[];
 r.dv=typeof o.dv=='string'&&/^\d{4}-\d{1,2}-\d{1,2}$/.test(o.dv)?o.dv:'';r.real=num(o.real);return r}
