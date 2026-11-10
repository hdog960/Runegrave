"""Local headless CSS/canvas audit. Browser networking is blocked in this environment, so document is injected in-memory."""
from playwright.sync_api import sync_playwright
import json,re
from pathlib import Path
DIST=Path(__file__).resolve().parent.parent/'dist'
html=(DIST/'index.html').read_text()
html=re.sub(r'<script[^>]+src="./js/main.js"[^>]*></script>','',html)
html=re.sub(r'<link[^>]+(?:stylesheet|manifest|icon)[^>]*>','',html)
css=(DIST/'styles.css').read_text()
modules=['core/version.js','core/rng.js','core/ids.js','content/realmCatalog.js','input/vector.js','input/twinStick.js','scene/stage.js','platform/pwa.js','main.js']
js='\n'.join((DIST/'js'/m).read_text() for m in modules)
js=re.sub(r'^import .*?;\s*$', '',js,flags=re.MULTILINE)
js=re.sub(r'^export (?=(?:const|class|function|async)\b)', '',js,flags=re.MULTILINE)
profiles=[('iphone-small',667,375),('iphone-regular',844,390),('iphone-plus',932,430),('compact',760,360),('portrait',390,844)]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for name,w,h in profiles:
  context=browser.new_context(viewport={'width':w,'height':h},device_scale_factor=2,is_mobile=False,has_touch=True)
  page=context.new_page();errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
  page.set_content(html)
  page.add_style_tag(content=css)
  page.add_script_tag(content=js)
  page.wait_for_timeout(300)
  metrics=page.evaluate('''() => {
   const box=(s)=>{const r=document.querySelector(s).getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}}
   const canvas=box('#gameplay-canvas');
   const collide=(a,b)=> a.x<b.right&&a.right>b.x&&a.y<b.bottom&&a.bottom>b.y;
   const all=[...document.querySelectorAll('.grip,.rune-socket,.rune-key,[data-hud],.screen-status')].map(e=>{const r=e.getBoundingClientRect();return {name:e.className,box:{x:r.x,y:r.y,right:r.right,bottom:r.bottom}}});
   return {version:document.documentElement.dataset.version,landscape:matchMedia('(orientation:landscape)').matches,mainVisible:getComputedStyle(document.querySelector('.handheld')).display!=='none',canvas:canvas,frame:box('.world-frame'),left:box('.grip-left'),right:box('.grip-right'),collisions: all.filter(e=>collide(canvas,e.box)).map(e=>e.name),canvasBitmap:[document.querySelector('#gameplay-canvas').width,document.querySelector('#gameplay-canvas').height]};
  }''')
  page.screenshot(path=str(DIST.parent/f'{name}.png'),full_page=True)
  print(name,'errors=',errs,'metrics=',json.dumps(metrics))
  assert not errs,errs
  if w>h:
   assert metrics['mainVisible'];assert not metrics['collisions'],metrics['collisions'];assert metrics['canvas']['width']>0
   assert metrics['canvas']==metrics['frame']
   assert metrics['canvasBitmap'][0]>600
  else:assert not metrics['mainVisible']
  assert metrics['version']=='0.03.0'
  context.close()
 browser.close()
print('BROWSER CANVAS AND ZERO-OVERLAP CHECKS PASS (not a real iPhone or live Pages check)')
