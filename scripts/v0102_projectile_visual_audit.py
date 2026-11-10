"""In-memory Chromium screenshot of REAL runtime art using TEST-ONLY hostile bolt injection.
Not physical Safari, live GitHub Pages, or natural enemy AI firing evidence.
"""
from pathlib import Path
from functools import lru_cache
from posixpath import normpath
import base64,re
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent.parent
DIST=ROOT/'dist'
@lru_cache(None)
def module(path):
 src=(DIST/'js'/path).read_text()
 def fix(m):
  sub=normpath(str(Path(path).parent/m.group(2)))
  return m.group(1)+module(sub)+m.group(3)
 src=re.sub(r'''(from\s+['"])(\.{1,2}/[^'"\n]+)(['"])''',fix,src)
 if path=='scene/stage.js':src=src.replace('getActor: () => ({','testJump: p => {actor={...p}},getActor: () => ({')
 if path=='main.js':src+='\nwindow.__runegraveArtTest={stage,controls};\n'
 return 'data:text/javascript;base64,'+base64.b64encode(src.encode()).decode()
HTML=re.sub(r'<script[^>]+src="\./js/main\.js"[^>]*></script>','',(DIST/'index.html').read_text())
HTML=re.sub(r'<link[^>]+(?:stylesheet|manifest|icon)[^>]*>','',HTML)
with sync_playwright() as pw:
 b=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-web-security'])
 page=b.new_page(viewport={'width':844,'height':390},is_mobile=True,has_touch=True,device_scale_factor=2)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(HTML);page.add_style_tag(content=(DIST/'styles.css').read_text());page.add_script_tag(type='module',content=f'import "{module("main.js")}";')
 page.locator('#guide-start-btn').click();page.wait_for_timeout(160)
 x,y=page.evaluate('''() => {const c=document.querySelector('#gameplay-canvas');return [+c.dataset.exitX,+c.dataset.exitY]}''')
 page.evaluate('''([x,y])=>window.__runegraveArtTest.stage.testJump({x,y})''',[x,y]);page.wait_for_timeout(210)
 assert page.locator('#gameplay-canvas').get_attribute('data-room')=='crypt'
 page.evaluate('''() => {const encounter=window.__runegraveArtTest.stage.getEncounter(); const a=encounter.projectiles; a.push({id:4001,x:302,y:180,dx:1,dy:0,damage:1,radius:3.4,speed:0,life:2.8}); a.push({id:4002,x:330,y:205,dx:0,dy:-1,damage:2,radius:3.4,speed:0,life:2.8});}''')
 page.wait_for_timeout(85)
 game=page.locator('#gameplay-canvas').bounding_box();grips=[page.locator('.grip-left').bounding_box(),page.locator('.grip-right').bounding_box()]
 assert all(game['x']+game['width']<=q['x'] or q['x']+q['width']<=game['x'] for q in grips),'control overlay in canvas'
 assert not errors,errors
 page.screenshot(path=str(ROOT/'gate-a-v0102-hostile-art.png'))
 print('PASS: live compiled v0.09.12 canvas, 2 injected hostile visual weights, zero HUD overlaps, zero JS errors')
 b.close()
