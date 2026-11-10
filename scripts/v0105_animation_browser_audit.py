"""Gate A v0.09.15: actual in-memory Chromium hero/enemy art with test-only attack state.
This is NOT physical iPhone testing or an unaided victory.
"""
from pathlib import Path
import sys
sys.path.insert(0,str(Path(__file__).resolve().parent))
import v009_browser_audit as base
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent.parent
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-web-security'])
 page=b.new_page(viewport={'width':844,'height':390},device_scale_factor=2,is_mobile=True,has_touch=True)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(base.HTML);page.add_style_tag(content=(base.DIST/'styles.css').read_text())
 page.add_script_tag(type='module',content=f'import "{base.data_module("main.js")}";')
 page.locator('#guide-start-btn').click();page.wait_for_timeout(110)
 exit=page.evaluate("() => {const c=document.querySelector('#gameplay-canvas');return [+c.dataset.exitX,+c.dataset.exitY]}")
 page.evaluate("p=>window.__runegraveTest.stage.testJump({x:p[0],y:p[1]})",exit)
 page.wait_for_timeout(100)
 assert page.locator('#gameplay-canvas').get_attribute('data-room')=='crypt'
 page.evaluate("""() => {for(const e of window.__runegraveTest.stage.getEncounter().enemies){e.state='warning';e.windup=.55;e.dx=1;e.dy=0;}}""")
 for selector,i,x,y in [('#move-rune-disc',41,.83,.31),('#aim-rune-disc',42,.8,.3)]:
  page.evaluate("""([selector,i,x,y])=>{const d=document.querySelector(selector),r=d.getBoundingClientRect();d.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerId:i,pointerType:'touch',isPrimary:i===41,clientX:r.left+r.width*x,clientY:r.top+r.height*y}));}""",[selector,i,x,y])
 page.wait_for_timeout(135)
 assert int(page.locator('#gameplay-canvas').get_attribute('data-shots'))>0
 page.screenshot(path=str(ROOT/'gate-a-v0105-hero-enemy-poses.png'))
 for selector,i in [('#move-rune-disc',41),('#aim-rune-disc',42)]:
  page.evaluate("""([selector,i])=>document.querySelector(selector).dispatchEvent(new PointerEvent('pointercancel',{bubbles:true,pointerId:i,pointerType:'touch'}))""",[selector,i])
 assert not errors,errors
 print('v0.09.15 actual Chromium warning and dual-thumb art PASS; test-only enemy state; zero JS exceptions')
 b.close()
