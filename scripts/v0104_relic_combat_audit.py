"""Actual compiled Chromium game artwork, test-only relic acquisition injection.
Not evidence of a human-collected relic or physical iPhone playthrough.
"""
from pathlib import Path
from functools import lru_cache
from posixpath import normpath
import base64,re
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent.parent;DIST=ROOT/'dist'
@lru_cache(None)
def module(path):
 src=(DIST/'js'/path).read_text()
 def fix(m):return m.group(1)+module(normpath(str(Path(path).parent/m.group(2))))+m.group(3)
 src=re.sub(r'''(from\s+['"])(\.{1,2}/[^'"\n]+)(['"])''',fix,src)
 if path=='scene/stage.js':
  src=src.replace('getActor: () => ({', '''qaGrant: () => {for(const r of FIRST_SOUL_RELICS)inventory.acquire(r.id,health);combat?.setProfile(inventory.profile());emitState();render(lastTime);},getActor: () => ({''')
 if path=='main.js':src+='\nwindow.__runegraveVisualQA={stage,controls};\n'
 return 'data:text/javascript;base64,'+base64.b64encode(src.encode()).decode()
html=re.sub(r'<script[^>]+src="\./js/main\.js"[^>]*></script>','',(DIST/'index.html').read_text())
html=re.sub(r'<link[^>]+(?:stylesheet|manifest|icon)[^>]*>','',html)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-web-security'])
 page=b.new_page(viewport={'width':844,'height':390},is_mobile=True,has_touch=True,device_scale_factor=2)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html);page.add_style_tag(content=(DIST/'styles.css').read_text());page.add_script_tag(type='module',content=f'import "{module("main.js")}";')
 page.locator('#guide-start-btn').click();page.wait_for_timeout(120)
 page.evaluate('window.__runegraveVisualQA.stage.qaGrant()')
 assert page.evaluate('document.querySelector("#gameplay-canvas").dataset.relicCount')=='8'
 e=page.locator('#aim-rune-disc');r=e.bounding_box()
 page.evaluate('''([x,y])=>{const e=document.querySelector('#aim-rune-disc');e.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerId:22,pointerType:'touch',clientX:x,clientY:y,isPrimary:false}));}''',[r['x']+r['width']*.93,r['y']+r['height']*.5])
 page.wait_for_timeout(220)
 assert int(page.evaluate('document.querySelector("#gameplay-canvas").dataset.shots'))>=1
 page.screenshot(path=str(ROOT/'gate-a-v0104-earned-relic-combat.png'))
 assert not errors,errors
 frame=page.locator('#gameplay-canvas').bounding_box();grips=[x.bounding_box() for x in [page.locator('.grip-left'),page.locator('.grip-right')]]
 assert all(frame['x']+frame['width']<=r['x'] or r['x']+r['width']<=frame['x'] for r in grips)
 print('v0.09.14 actual in-memory Chromium game PASS: eight acquired relic visual markings, live Soulbolt shots, no errors, grips isolated')
 b.close()
