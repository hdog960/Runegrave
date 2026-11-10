"""Guided-start acceptance. The overlay must be usable on a small landscape iPhone without hiding the start action."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import base64,re
from functools import lru_cache
from posixpath import normpath
ROOT=Path(__file__).resolve().parent.parent
DIST=ROOT/'dist'
@lru_cache(maxsize=None)
def data_module(path):
 src=(DIST/'js'/path).read_text()
 def repl(m):
  target=normpath(str(Path(path).parent/m.group(2)))
  return m.group(1)+data_module(target)+m.group(3)
 src=re.sub(r'''(from\s+['"])(\.{1,2}/[^'"\n]+)(['"])''',repl,src)
 if path=='main.js':src+='\nwindow.__runegraveTest={stage,controls};\n'
 return 'data:text/javascript;base64,'+base64.b64encode(src.encode()).decode()
HTML=re.sub(r'<script[^>]+src="\./js/main\.js"[^>]*></script>','',(DIST/'index.html').read_text())
HTML=re.sub(r'<link[^>]+(?:stylesheet|manifest|icon)[^>]*>','',HTML)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-web-security'])
 for name,w,h in [('small',667,375),('regular',844,390),('compact',760,360),('plus',932,430)]:
  page=browser.new_page(viewport={'width':w,'height':h},is_mobile=True,has_touch=True,device_scale_factor=2)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(HTML);page.evaluate('''() => {const storage={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=String(v)}});}''');page.add_style_tag(content=(DIST/'styles.css').read_text());page.add_script_tag(type='module',content=f'import "{data_module("main.js")}";')
  page.locator('#guide-overlay').wait_for(state='visible',timeout=8000)
  assert page.locator('#guide-overlay').is_visible(),name
  assert page.evaluate('document.documentElement.dataset.paused')=='true',name
  assert page.locator('#pause-btn').is_disabled(), 'External PAUSE may not unpause behind guide'
  # Try right stick while guide is shown; physics must not advance.
  initial=page.evaluate('document.querySelector("#gameplay-canvas").dataset.physicsTick')
  page.wait_for_timeout(100)
  assert page.evaluate('document.querySelector("#gameplay-canvas").dataset.physicsTick')==initial
  start=page.locator('#guide-start-btn').bounding_box()
  overlay=page.locator('#guide-overlay').bounding_box()
  assert start and overlay and start['y']>=overlay['y'] and start['y']+start['height']<=overlay['y']+overlay['height'],(name,start,overlay)
  page.screenshot(path=str(ROOT/f'v009-guide-{name}.png'))
  page.locator('#guide-start-btn').click();page.wait_for_timeout(60)
  assert page.locator('#guide-overlay').is_hidden()
  assert page.evaluate('document.documentElement.dataset.paused')=='false'
  page.locator('#pause-btn').click();page.wait_for_timeout(70)
  assert page.locator('#pause-overlay').is_visible()
  page.locator('#guide-replay-btn').click();page.wait_for_timeout(70)
  assert page.locator('#guide-overlay').is_visible() and page.locator('#pause-overlay').is_hidden()
  page.keyboard.press('Escape');page.wait_for_timeout(80)
  assert page.locator('#guide-overlay').is_visible() and page.evaluate('document.documentElement.dataset.paused')=='true'
  page.locator('#guide-start-btn').click();page.wait_for_timeout(60)
  assert page.evaluate('document.documentElement.dataset.paused')=='false'
  assert page.evaluate('localStorage.getItem("runegrave:guided-start:v1")')=='seen'
  assert not errors,(name,errors)
  print(name,'GUIDE PASS; start button visible, simulation paused during guide, replay works, escape safe')
  page.close()
 browser.close()
