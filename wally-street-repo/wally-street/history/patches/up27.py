import json
SP='/tmp/claude-0/-home-claude/d6cebc6b-bafa-5f05-9ae9-36df9f9405d6/scratchpad/'
O='/mnt/user-data/outputs/'
s=open(SP+'master-v26.html',encoding='utf8').read()
AQ=json.load(open(SP+'aq.json'))
assert sum(len(g[1]) for g in AQ)==50
def rep(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(a[:80],c);s=s.replace(a,b)
rep('<div id="tools"><span class="xs" id="aist"></span></div>',
    '<div id="tools"><button class="chip" id="aqb" aria-expanded="false" aria-controls="aqp">📋 Available questions (50)</button> <span class="xs" id="aist"></span></div>\n<div id="aqp" hidden></div>')
rep("function local0(q){",
    "const AQ="+json.dumps(AQ,ensure_ascii=False)+",AQX={};AQ.forEach(g=>g[1].forEach(x=>AQX[x[1].toLowerCase().replace(/[?!.\\s]+$/,'')]=x[0]));\nfunction local0(q){")
rep(" let D=DIDX;if(!D){D=[];",
    " {const ak=AQX[t.trim().replace(/[?!.\\s]+$/,'')],e=ak&&EXF.find(x=>x[0].toLowerCase()==ak.toLowerCase());if(e)return '**'+e[0]+'**: '+e[1]}\n let D=DIDX;if(!D){D=[];")
rep("async function send(t){","async function send(t,off){")
rep("try{if(!sample)await Promise.race([sampleP,new Promise(r=>setTimeout(r,2500))]);if(!sample||!flag('ai'))throw 0;",
    "try{if(!sample&&!off)await Promise.race([sampleP,new Promise(r=>setTimeout(r,2500))]);if(off||!sample||!flag('ai'))throw 0;")
rep("if(!out){out=local(t);const e=$('#aist');if(e)e.textContent=","if(!out){out=local(t);const e=off?null:$('#aist');if(e)e.textContent=")
rep('return "I don\'t have notes on that yet. Try asking about','return "I don\'t have notes on that yet. Tap 📋 Available questions to see 50 questions I can always answer, or try asking about')
rep("$('#chips').onclick=e=>{if(e.target.classList.contains('chip'))send(e.target.textContent)};",
"""$('#chips').onclick=e=>{if(e.target.classList.contains('chip'))send(e.target.textContent)};
$('#aqp').innerHTML='<p class="xs2">Tap a question to ask it. These 50 are answered from built-in notes, so they work with no internet and no AI.</p>'+AQ.map(g=>`<div class="aqg"><b>${g[0]} (${g[1].length})</b><div>${g[1].map(x=>`<button class="chip" data-aq="${x[1].replace(/"/g,'&quot;')}">${x[1]}</button>`).join('')}</div></div>`).join('');
function aqShow(v){const p=$('#aqp'),b=$('#aqb');p.hidden=!v;$('#chips').hidden=v;b.setAttribute('aria-expanded',v);b.textContent=v?'✕ Hide available questions':'📋 Available questions (50)'}
$('#aqb').onclick=()=>aqShow($('#aqp').hidden);
$('#aqp').onclick=e=>{const b=e.target.closest('[data-aq]');if(!b||busy)return;aqShow(false);send(b.dataset.aq,1)};""")
css="#aqp{max-height:42vh;overflow-y:auto;padding:4px 16px 10px;border-top:2px solid var(--line);width:100%;max-width:820px;margin:0 auto}#aqp .aqg{margin:10px 0}#aqp .aqg b{display:block;font-size:13px;color:var(--mute);margin-bottom:6px}#aqp .aqg div{display:flex;flex-wrap:wrap;gap:6px}#aqp .chip{font-size:13px;padding:6px 10px;text-align:left}#tools .chip{padding:6px 12px;font-size:13px}\n"
assert s.count('</style>')==1
s=s.replace('</style>',css+'</style>')
open(O+'stockgpt.html','w',encoding='utf8').write(s)
open(O+'stockgpt-share.html','w',encoding='utf8').write(s)
print('ok',len(s))
