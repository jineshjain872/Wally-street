import os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))+'/'
import re,sys
O=ROOT+'dist/'
s=open(O+'stockgpt-share.html',encoding='utf8').read()
old=open(ROOT+'build/laptop-old.html',encoding='utf8').read()
# --- laptop CSS block + keydown handler taken from the previous laptop file
i=old.index('@media(min-width:700px){\n#app{max-width:1280px')
d=0;j=i
while True:
    c=old[j]
    if c=='{':d+=1
    elif c=='}':
        d-=1
        if d==0:j+=1;break
    j+=1
blk=old[i:j]
assert blk.count('#learn,#news,#picks,#hist{')==1
blk=blk.replace('#learn,#news,#picks,#hist{','#learn,#news,#picks,#hist,#dev{')
blk=blk.rstrip()[:-1]+"#dev .pic{max-width:640px;display:block;margin-left:auto;margin-right:auto}#dev .cl{columns:2}nav button{flex:0 0 auto}\n}"
k=old.index("addEventListener('keydown'",old.index("termsOK()?startup():showTerms();"))
kend=old.index('renderLearn();head();\n</script>',k)
key=old[k:kend]
key="document."+key if not key.startswith('document.') else key
assert s.count('</style>')==1
L=s.replace('</style>',blk+'\n</style>')
tail='ageGate();\nrenderLearn();head();\n</script>'
assert L.count(tail)==1
L=L.replace(tail,'ageGate();\n'+key+'renderLearn();head();\n</script>')
L=L.replace('<title>stockgpt</title>','<title>Wally Street (laptop)</title>') if '<title>stockgpt</title>' in L else L
open(O+'stockgpt-laptop.html',encoding='utf8',mode='w').write(L)
print('laptop',len(L))
# --- JS conversion from the laptop file
css=re.findall(r'<style>(.*?)</style>',L,re.S);assert len(css)==1;css=css[0]
bi=L.index('<body>')+6;si=L.index('<script>',bi)
body=L[bi:si].strip()
scr=re.findall(r'<script>(.*?)</script>',L,re.S);assert len(scr)==1;scr=scr[0]
for nm,t in(('css',css),('body',body)):
    assert '`' not in t and '${' not in t and '\\' not in t.replace('\\n',''),(nm,[m.start() for m in re.finditer(r'[`\\]',t)][:5])
js="""/* Wally Street: the whole app (styles, markup and logic) as one JavaScript file.
   Use it by loading it on an otherwise empty page: <script src="stockgpt.js"></script> */
(function () {
  function boot() {
    var d = document;
    d.documentElement.lang = 'en';
    d.title = 'Wally Street';

    var meta = d.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
    d.head.appendChild(meta);

    var pre = d.createElement('link');
    pre.rel = 'preconnect'; pre.href = 'https://fonts.googleapis.com';
    d.head.appendChild(pre);
    var font = d.createElement('link');
    font.rel = 'stylesheet'; font.href = 'https://fonts.googleapis.com/css2?family=Nunito:wght@600;800;900&family=JetBrains+Mono:wght@500;700&display=swap';
    d.head.appendChild(font);

    var style = d.createElement('style');
    style.textContent = `
"""+css.strip()+"""
`;
    d.head.appendChild(style);

    d.body.insertAdjacentHTML('afterbegin', `
"""+body+"""
`);

    (function () {
"""+scr.strip()+"""
    })();
  }
  if (document.body) boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();
"""
open(O+'stockgpt.js',encoding='utf8',mode='w').write(js)
open(O+'index.html',encoding='utf8',mode='w').write('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<title>Wally Street</title>\n</head>\n<body>\n<script src="stockgpt.js"></script>\n</body>\n</html>\n')
inl=js.replace('</script>','<\\/script>')
assert '<!--' not in inl
art='<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<title>Wally Street (single file)</title>\n</head>\n<body>\n<script>\n'+inl+'\n</script>\n</body>\n</html>\n'
open(O+'stockgpt-index-artifact.html',encoding='utf8',mode='w').write(art)
print('js',len(js),'art',len(art))
