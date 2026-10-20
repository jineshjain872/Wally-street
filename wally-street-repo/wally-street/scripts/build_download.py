import os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))+'/'
O=ROOT+'dist/'
s=open(O+'stockgpt-laptop.html',encoding='utf8').read()
csp='<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; script-src \'unsafe-inline\'; style-src \'unsafe-inline\' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src \'self\' data: blob:; media-src \'none\'; connect-src \'none\'; object-src \'none\'; frame-src \'none\'; worker-src \'none\'; manifest-src \'self\'; base-uri \'none\'; form-action \'none\'"><meta name="referrer" content="no-referrer">'
i=s.index('<meta charset="utf-8">')+len('<meta charset="utf-8">')
s=s[:i]+csp+s[i:]
k=s.index('<script>',s.index('<body'))+len('<script>')
guard="if(window.top!==window.self&&(()=>{try{return !window.top.location.href}catch(e){return true}})()){document.body.innerHTML='<p style=\"font:16px sans-serif;padding:24px\">For your safety, Wally Street can\\'t run inside another website. Open the file directly.</p>';throw new Error('Wally Street refused to run inside another site')}\n"
s=s[:k]+guard+s[k:]
open(O+'wally-street.html','w',encoding='utf8').write(s);print('dl ok')
