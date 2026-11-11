"""Gate A v0.09.17 Chromium canvas/controls smoke, not real iPhone approval."""
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent))
import v009_browser_audit as base
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent.parent
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,args=['--no-sandbox','--disable-web-security'])
 for label,w,h in [('compact',667,375),('regular',844,390),('plus',932,430),('large',1024,440)]:
  page=b.new_page(viewport={'width':w,'height':h},device_scale_factor=2,is_mobile=True,has_touch=True)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(base.HTML);page.add_style_tag(content=(base.DIST/'styles.css').read_text())
  page.add_script_tag(type='module',content=f'import "{base.data_module("main.js")}";')
  page.locator('#guide-start-btn').click();page.wait_for_timeout(160)
  metrics=page.evaluate("""() => {
    const r=s=>document.querySelector(s).getBoundingClientRect();
    const c=r('#gameplay-canvas'),l=r('.grip-left'),rt=r('.grip-right');
    return {canvas:c.width,left:l.right,right:rt.left,room:document.querySelector('#gameplay-canvas').dataset.room};
  }""")
  assert metrics['canvas']>180,(label,metrics)
  assert metrics['left']<=metrics['right'],(label,'overlapping rails',metrics)
  exit=page.evaluate("""() => {const c=document.querySelector('#gameplay-canvas');return [+c.dataset.exitX,+c.dataset.exitY]}""")
  page.evaluate("p=>window.__runegraveTest.stage.testJump({x:p[0],y:p[1]})",exit)
  page.wait_for_timeout(110)
  assert page.locator('#gameplay-canvas').get_attribute('data-room')=='crypt',(label,'no chamber')
  if label=='regular':
   page.screenshot(path=str(ROOT/'gate-a-v00917-chamber.png'))
   for selector,i in [('#move-rune-disc',45),('#aim-rune-disc',46)]:
    page.evaluate("""([selector,i])=>{const d=document.querySelector(selector),r=d.getBoundingClientRect();d.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerId:i,pointerType:'touch',isPrimary:i===45,clientX:r.left+r.width*.82,clientY:r.top+r.height*.40}));}""",[selector,i])
   page.wait_for_timeout(160)
   assert int(page.locator('#gameplay-canvas').get_attribute('data-shots'))>0
   for selector,i in [('#move-rune-disc',45),('#aim-rune-disc',46)]:
    page.evaluate("""([selector,i])=>document.querySelector(selector).dispatchEvent(new PointerEvent('pointercancel',{bubbles:true,pointerId:i,pointerType:'touch'}))""",[selector,i])
  assert not errors,(label,errors)
  print('PASS',label,'world/rails, guided entry, new art and no JS exceptions')
  page.close()
 portrait=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 portrait.set_content(base.HTML);portrait.add_style_tag(content=(base.DIST/'styles.css').read_text())
 assert portrait.locator('.rotate-message').is_visible()
 print('PASS portrait orientation instruction')
 b.close()
