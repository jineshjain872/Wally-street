SP='/tmp/claude-0/-home-claude/d6cebc6b-bafa-5f05-9ae9-36df9f9405d6/scratchpad/'
O='/mnt/user-data/outputs/'
s=open(SP+'master-v28.html',encoding='utf8').read()
age=open(SP+'age.js',encoding='utf8').read()
def rep(a,b,n=1):
    global s
    c=s.count(a);assert c==n,(a[:90],c);s=s.replace(a,b)
rep('Effective date: 18 October 2026</p><p class=\\"tcm\\">Version: 1.0</p>',
    'Effective date: 19 October 2026</p><p class=\\"tcm\\">Version: 1.1</p><p class=\\"tcm\\">Made by Claude, an AI by Anthropic.</p>')
rep('<h3>KEY PRINCIPLES</h3>','<h3>ABOUT WALLY STREET</h3><p>Wally Street was made by Claude, an AI model created by Anthropic. Claude wrote the app, its lessons, quizzes, tutorials and tutor notes. AI can make mistakes, so check anything important with other sources.</p><h3>KEY PRINCIPLES</h3>')
rep('<h3>2. WHO MAY USE THE SERVICE</h3><p>You must be at least 13 years old to use Wally Street.</p>',
    '<h3>2. WHO MAY USE THE SERVICE</h3><p>You must be at least 13 years old to use Wally Street. The app asks your age before you start and does not let anyone under 13 in. If you are under 18, you may use it only with the permission of a parent or guardian.</p>')
rep("const TERMS_V='1.0'","const TERMS_V='1.1'")
rep("Wally Street · Effective 18 October 2026 · Version","Wally Street · Made by Claude (AI) · Effective 19 October 2026 · Version")
open(O+'stockgpt.html','w',encoding='utf8').write(s)
open(O+'stockgpt-share.html','w',encoding='utf8').write(s)
print('ok',len(s))
