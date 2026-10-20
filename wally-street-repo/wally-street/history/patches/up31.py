SP='/tmp/claude-0/-home-claude/d6cebc6b-bafa-5f05-9ae9-36df9f9405d6/scratchpad/'
O='/mnt/user-data/outputs/'
s=open(SP+'master-v30.html',encoding='utf8').read()
def rep(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(a[:90],c);s=s.replace(a,b)
rep("e.textContent=sample?'✨ AI answers are on':'📚 Answering from my lesson notes (AI answers only work inside Claude, with permission)'","e.textContent=sample?'✨ AI answers are on':''")
rep("if(!out){out=local(t);const e=off?null:$('#aist');if(e)e.textContent='📚 Answering from my lesson notes (AI answers only work inside Claude, with permission)'}","if(!out){out=local(t)}")
assert 'Answering from my lesson notes' not in s
open(O+'stockgpt.html','w',encoding='utf8').write(s);open(O+'stockgpt-share.html','w',encoding='utf8').write(s);print('ok')
