"""v0.09.18 Gate A real Chromium runtime, test-only warning pose and input.
Not a physical iPhone Safari check, unaided boss victory or installed PWA test.
"""
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent))
import v009_browser_audit as base
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent.parent
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,args=['--no-sandbox','--disable-web-security'])
 for label,w,h in [('small',667,375),('regular',844,390),('plus',932,430),('large',1024,440)]:
  page=b.new_page(viewport={'width':w,'height':h},device_scale_factor=2,is_mobile=True,has_touch=True)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(base.HTML);page.add_style_tag(content=(base.DIST/'styles.css').read_text())
  page.add_script_tag(type='module',content=f'import "{base.data_module("main.js")}";')
  page.locator('#guide-start-btn').click();page.wait_for_timeout(140)
  metrics=page.evaluate("""() => {
   const b=s=>document.querySelector(s).getBoundingClientRect();
   const c=b('#gameplay-canvas'),left=b('.grip-left'),right=b('.grip-right');
   return {c:[c.left,c.right],left:left.right,right:right.left,version:document.documentElement.dataset.version};
  }""")
  assert metrics['version']=='0.09.18',metrics
  assert metrics['c'][0]>=metrics['left']-2 and metrics['c'][1]<=metrics['right']+2,(label,metrics)
  exit=page.evaluate("""() => {const c=document.querySelector('#gameplay-canvas');return [+c.dataset.exitX,+c.dataset.exitY];}""")
  page.evaluate("pt=>window.__runegraveTest.stage.testJump({x:pt[0],y:pt[1]})",exit)
  page.wait_for_timeout(120)
  assert page.locator('#gameplay-canvas').get_attribute('data-room')=='crypt'
  if label=='regular':
   page.evaluate("""() => {const es=window.__runegraveTest.stage.getEncounter().enemies;
      for(const e of es){e.state='warning';e.windup=.28;} }""")
   page.wait_for_timeout(100)
   page.screenshot(path=str(ROOT/'gate-a-v00918-saga-warning.png'))
   for selector,pid in [('#move-rune-disc',57),('#aim-rune-disc',58)]:
    page.evaluate("""([selector,pid])=>{const el=document.querySelector(selector),r=el.getBoundingClientRect();
      el.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerId:pid,
        pointerType:'touch',isPrimary:pid===57,clientX:r.left+r.width*.8,clientY:r.top+r.height*.37}));}""",[selector,pid])
   page.wait_for_timeout(175)
   assert int(page.locator('#gameplay-canvas').get_attribute('data-shots'))>0
   page.screenshot(path=str(ROOT/'gate-a-v00918-two-thumb.png'))
   for selector,pid in [('#move-rune-disc',57),('#aim-rune-disc',58)]:
    page.evaluate("""([selector,pid])=>document.querySelector(selector).dispatchEvent(
     new PointerEvent('pointercancel',{bubbles:true,pointerId:pid,pointerType:'touch'}))""",[selector,pid])
  assert not errors,(label,errors)
  print(label,'PASS new saga art, separate grips, guided chamber, zero exceptions')
  page.close()
 portrait=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 portrait.set_content(base.HTML);portrait.add_style_tag(content=(base.DIST/'styles.css').read_text())
 assert portrait.locator('.rotate-message').is_visible()
 print('portrait PASS rotate instruction')
 b.close()
