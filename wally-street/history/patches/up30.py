SP='/tmp/claude-0/-home-claude/d6cebc6b-bafa-5f05-9ae9-36df9f9405d6/scratchpad/'
O='/mnt/user-data/outputs/'
s=open(SP+'master-v29.html',encoding='utf8').read()
def rep(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(a[:90],c);s=s.replace(a,b)
rep('<p class=\\"tcm\\">Made by Claude, an AI by Anthropic.</p>','')
i=s.index('<h3>ABOUT WALLY STREET</h3>');j=s.index('<h3>KEY PRINCIPLES</h3>',i);s=s[:i]+s[j:]
rep("Wally Street · Made by Claude (AI) · Effective 19 October 2026 · Version","Wally Street · Effective 19 October 2026 · Version")
rep('If a summary and a section ever seem to differ, the section controls.</p><h3>2. WHO MAY USE',
    'If a summary and a section ever seem to differ, the section controls.</p><p>Claude AI assisted in the making of this application.</p><h3>2. WHO MAY USE')
assert 'Made by Claude' not in s and 'ABOUT WALLY STREET' not in s
open(O+'stockgpt.html','w',encoding='utf8').write(s)
open(O+'stockgpt-share.html','w',encoding='utf8').write(s)
print('ok')
