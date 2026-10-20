const ROOT=require('path').resolve(__dirname,'..')+'/';
const {chromium}=require('playwright');const W=ms=>new Promise(r=>setTimeout(r,ms));
const fake=`window.__saves=[];window.claude={use:n=>Promise.resolve(n=='downloads'?{save:async r=>{window.__saves.push([r.filename,r.data instanceof Blob?'blob:'+r.data.size:typeof r.data+':'+r.data.length]);return {status:'saved'}}}:null)}`;
(async()=>{const b=await chromium.launch({...(process.env.CHROMIUM?{executablePath:process.env.CHROMIUM}:{}),args:['--no-sandbox']});const out={};
for(const mode of ['artifact','plain']){const ctx=await b.newContext({acceptDownloads:true});if(mode=='artifact')await ctx.addInitScript(fake);const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 const dls=[];p.on('download',d=>dls.push(d.suggestedFilename()));
 await p.goto('file://'+ROOT+'dist/stockgpt-share.html');await W(500);await p.fill('#agi','20');await p.click('#agok');await W(200);await p.click('#tca');await W(200);await p.click('#suskip');await W(300);
 await p.evaluate(()=>{const b=document.createElement('button');b.dataset.card='streak';document.body.appendChild(b);b.click();b.remove()});await W(900);
 await p.click('#shd');await W(600);
 await p.evaluate(()=>{document.querySelector('#tc').style.display='none';const x=document.createElement('button');x.dataset.op='dl';document.body.appendChild(x);opsClick({target:x})}).catch(e=>errs.push('ops '+e.message));await W(800);
 out[mode]={saves:await p.evaluate(()=>window.__saves||null),downloads:dls,errs};await ctx.close()}
console.log(JSON.stringify(out,null,1));await b.close()})();
