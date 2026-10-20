const ROOT=require('path').resolve(__dirname,'..')+'/';
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({...(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),args:['--no-sandbox']});const p=await b.newPage();
await p.goto('http://localhost:8763/');await p.waitForTimeout(1500);
const fr=p.frames().find(f=>f.url().includes('wally-street'));const framed=fr?await fr.evaluate(()=>document.body.innerText.slice(0,100)):'no frame';
const q=await b.newPage();await q.goto('http://127.0.0.1:8762/wally-street.html');await q.waitForTimeout(800);const direct=await q.evaluate(()=>document.querySelector('#tc h2')&&document.querySelector('#tc h2').textContent);
console.log(JSON.stringify({framed,direct}));await b.close()})();
