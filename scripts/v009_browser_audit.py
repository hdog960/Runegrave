"""In-memory Chromium runtime integration. Explicitly not physical iPhone or HTTPS SW test."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import base64,re
from functools import lru_cache
ROOT=Path(__file__).resolve().parent.parent
DIST=ROOT/'dist'
@lru_cache(maxsize=None)
def data_module(path):
  src=(DIST/'js'/path).read_text()
  def subst(m):
    target=(Path(path).parent/m.group(2)).as_posix()
    # Resolve foo/../bar without filesystem absolute base
    from posixpath import normpath
    return m.group(1)+'data:text/javascript;base64,'+base64.b64encode((DIST/'js'/normpath(target)).read_text().encode()).decode()+m.group(3)
  # recursively replace module paths; dependency graph is acyclic
  def replace(m):
    from posixpath import normpath
    target=normpath(str(Path(path).parent/m.group(2)))
    return m.group(1)+data_module(target)+m.group(3)
  src=re.sub(r'''(from\s+['"])(\.{1,2}/[^'"\n]+)(['"])''',replace,src)
  if path=='scene/stage.js':
    src=src.replace('getActor: () => ({','testJump: (point) => {actor={...point};},\n        getActor: () => ({')
  if path=='main.js':src+='\nwindow.__runegraveTest={stage,controls};\n'
  return 'data:text/javascript;base64,'+base64.b64encode(src.encode()).decode()

HTML=re.sub(r'<script[^>]+src="\./js/main\.js"[^>]*></script>','',(DIST/'index.html').read_text())
HTML=re.sub(r'<link[^>]+(?:stylesheet|manifest|icon)[^>]*>','',HTML)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-web-security'])
 for name,w,h in [('small',667,375),('regular',844,390),('plus',932,430),('compact',760,360),('portrait',390,844)]:
  page=browser.new_page(viewport={'width':w,'height':h},is_mobile=True,has_touch=True,device_scale_factor=2)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(HTML);page.add_style_tag(content=(DIST/'styles.css').read_text())
  page.add_script_tag(type='module',content=f'import "{data_module("main.js")}";')
  page.wait_for_timeout(350)
  if name != 'portrait':
   assert page.locator('#guide-overlay').is_visible(), 'First launch must show HOW TO PLAY'
   assert page.evaluate('document.documentElement.dataset.paused')=='true', 'Tutorial must pause combat'
   # The guide is a paused screen, never floating over the live action.
   page.locator('#guide-start-btn').click();page.wait_for_timeout(75)
   assert page.locator('#guide-overlay').is_hidden()
   assert page.evaluate('document.documentElement.dataset.paused')=='false'
  if name=='portrait':
   assert page.locator('.rotate-message').is_visible();assert not errors,errors
   page.screenshot(path=str(ROOT/'v009-portrait.png'))
   print('portrait PASS');page.close();continue
  state=page.evaluate('''() => {const c=document.querySelector('#gameplay-canvas');const r=c.getBoundingClientRect();const frame=document.querySelector('#world-frame').getBoundingClientRect();const overlap=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;return {version:document.documentElement.dataset.version,room:c.dataset.room,frame:[frame.x,frame.y,frame.width,frame.height],canvas:[r.x,r.y,r.width,r.height],intersections:[...document.querySelectorAll('.grip,[data-hud],#pause-btn,.rune-socket')].filter(e=>overlap(r,e.getBoundingClientRect())).length,actor:[+c.dataset.actorX,+c.dataset.actorY],exit:c.dataset.roomPhase,hearts:c.dataset.heartUnits};}''')
  assert not errors,(name,errors)
  assert state['version']=='0.09.9' and state['room']=='practice',state
  assert state['frame']==state['canvas'] and not state['intersections'],state
  assert state['actor'][0]>0 and state['hearts']=='6',state
  page.screenshot(path=str(ROOT/f'v009-{name}.png'))
  page.keyboard.down('d');page.wait_for_timeout(330);page.keyboard.up('d')
  # One grip movement and other grip auto-firing in genuine runtime
  def point(sel,typ,i,x,y):
   page.evaluate('''([s,typ,i,x,y])=>{const e=document.querySelector(s),r=e.getBoundingClientRect();e.dispatchEvent(new PointerEvent(typ,{bubbles:true,cancelable:true,pointerId:i,pointerType:'touch',isPrimary:i===11,clientX:r.left+r.width*x,clientY:r.top+r.height*y}));}''',[sel,typ,i,x,y])
  point('#move-rune-disc','pointerdown',11,.96,.5)
  point('#aim-rune-disc','pointerdown',22,.5,.02)
  page.wait_for_timeout(240)
  assert page.evaluate('document.querySelector("#gameplay-canvas").dataset.shots')!='0',(name,'no combat shots')
  point('#move-rune-disc','pointercancel',11,.96,.5)
  point('#aim-rune-disc','pointercancel',22,.5,.02)
  page.locator('#pause-btn').click();page.wait_for_timeout(70)
  assert not page.locator('#pause-overlay').is_hidden()
  page.locator('#handed-toggle').check()
  page.locator('#resume-btn').click();page.wait_for_timeout(70)
  assert not errors,(name,errors)
  print(name,'PASS',state['room'],'camera and controls',len(errors),'JS errors');page.close()
 browser.close()
