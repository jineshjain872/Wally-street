const ROOT=require('path').resolve(__dirname,'..')+'/';
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({...(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),args:['--no-sandbox']});const p=await b.newPage();const c=[];p.on('console',m=>{if(/Content Security|Refused/i.test(m.text()))c.push(m.text().slice(0,160))});
await p.goto('http://localhost:8771/');await p.waitForTimeout(800);
const r=await p.evaluate(async()=>{const reg=await navigator.serviceWorker.register('sw.js');await navigator.serviceWorker.ready;await new Promise(r=>setTimeout(r,800));const k=await caches.keys();const c=await caches.open(k[0]);return {scope:reg.scope,caches:k,files:(await c.keys()).length}});
const ctx=p.context();await ctx.setOffline(true);await p.reload();await p.waitForTimeout(800);const off=await p.evaluate(()=>document.querySelector('#tc')&&document.querySelector('#tc').innerText.slice(0,60));await ctx.setOffline(false);
console.log(JSON.stringify({sw:r,offline:off,csp:c}));await b.close()})();
