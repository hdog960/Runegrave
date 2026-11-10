"""v0.09.10 in-memory Chromium bounds + live threat test, not physical Safari.
Real UI and simulation, with test-only character repositioning/attack-state injection.
"""
from pathlib import Path
from functools import lru_cache
from posixpath import normpath
import base64,re
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent.parent
DIST=ROOT/'dist'
@lru_cache(maxsize=None)
def module(path):
 source=(DIST/'js'/path).read_text()
 def subst(m):
  target=normpath(str(Path(path).parent/m.group(2)))
  return m.group(1)+module(target)+m.group(3)
 source=re.sub(r'''(from\s+['"])(\.{1,2}/[^'"\n]+)(['"])''',subst,source)
 if path=='scene/stage.js':
  source=source.replace('getActor: () => ({', 'testJump: (p)=>{actor={...p}},getActor: () => ({')
 if path=='main.js':source+='\nwindow.__runegraveV0100={stage,controls};\n'
 return 'data:text/javascript;base64,'+base64.b64encode(source.encode()).decode()
HTML=re.sub(r'<script[^>]+src="\./js/main\.js"[^>]*></script>','',(DIST/'index.html').read_text())
HTML=re.sub(r'<link[^>]+(?:stylesheet|manifest|icon)[^>]*>','',HTML)
with sync_playwright() as pw:
 browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-web-security'])
 for label,w,h in [('small',667,375),('compact',760,360),('regular',844,390),('plus',932,430)]:
  page=browser.new_page(viewport={'width':w,'height':h},device_scale_factor=2,is_mobile=True,has_touch=True)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(HTML);page.add_style_tag(content=(DIST/'styles.css').read_text());page.add_script_tag(type='module',content=f'import "{module("main.js")}";')
  page.locator('#guide-start-btn').click();page.wait_for_timeout(140)
  threat=page.locator('.threat-strip').bounding_box();disc=page.locator('#move-rune-disc').bounding_box()
  grip=page.locator('.grip-left').bounding_box();world=page.locator('#world-frame').bounding_box()
  assert threat and disc and grip and world,(label,'missing geometry')
  assert threat['y']+threat['height']<=disc['y']+1,(label,'threat covers thumb disc',threat,disc)
  assert threat['x']>=grip['x']-1 and threat['x']+threat['width']<=grip['x']+grip['width']+1,(label,'threat outside grip')
  assert threat['x']+threat['width']<=world['x'],(label,'threat overlays gameplay')
  assert page.locator('[data-threat-label]').inner_text()=='PRACTICE HALL'
  door=page.evaluate('''() => {const c=document.querySelector('#gameplay-canvas');return {x:+c.dataset.exitX,y:+c.dataset.exitY};}''')
  page.evaluate('''p => window.__runegraveV0100.stage.testJump(p)''',door)
  page.wait_for_timeout(120)
  assert page.locator('#gameplay-canvas').get_attribute('data-room')=='crypt'
  assert page.locator('[data-threat-label]').inner_text().startswith('WAVE'),label
  # Explicitly test a genuine warning state exposed by the current enemy model.
  page.evaluate('''() => {const enc=window.__runegraveV0100.stage.getEncounter();const e=enc.snapshot.enemies.find(x=>x.alive); e.state='warning';e.windup=.25;}''')
  page.wait_for_timeout(35)
  assert page.locator('.threat-strip').get_attribute('data-tone')=='urgent',(label,'warning not surfaced',page.locator('[data-threat-label]').inner_text())
  if label=='regular':page.screenshot(path=str(ROOT/'gate-a-v0100-encounter.png'))
  assert not errors,(label,errors)
  print(label,'PASS external threat readout and warning, zero thumb/canvas intersection')
  page.close()
 browser.close()
