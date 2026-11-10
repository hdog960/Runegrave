"""In-memory Chromium DOM/runtime health audit. Test-only damage injection verifies UI wiring.
No real iPhone or HTTP service-worker lifecycle is claimed by this script.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import re

ROOT=Path(__file__).resolve().parent.parent
DIST=ROOT/'dist'
HTML=re.sub(r'<script[^>]+src="./js/main.js"[^>]*></script>','',(DIST/'index.html').read_text())
HTML=re.sub(r'<link[^>]+(?:stylesheet|manifest|icon)[^>]*>','',HTML)
MODULES=['core/version.js','core/rng.js','core/ids.js','content/realmCatalog.js','input/vector.js','input/twinStick.js','scene/sanctuaryArt.js','physics/world.js','physics/fixedStep.js','combat/soulbolts.js','combat/combatArt.js','health/mortalHearts.js','health/emberTrial.js','health/healthArt.js','scene/stage.js','platform/pwa.js','main.js']
JS='\n'.join((DIST/'js'/m).read_text() for m in MODULES)
JS=re.sub(r'^import .*?;\s*$','',JS,flags=re.MULTILINE)
JS=re.sub(r'^export (?=(?:const|class|function|async)\b)','',JS,flags=re.MULTILINE)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 ctx=browser.new_context(viewport={'width':844,'height':390},has_touch=True,is_mobile=True,device_scale_factor=2)
 page=ctx.new_page();errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
 page.set_content(HTML);page.add_style_tag(content=(DIST/'styles.css').read_text());page.add_script_tag(content=JS)
 page.wait_for_timeout(250)
 c=page.locator('#gameplay-canvas')
 assert c.get_attribute('data-heart-units')=='6'
 assert page.locator('[data-heart-icons] .mortal-full').count()==3
 assert page.locator('#death-overlay').is_hidden()
 assert page.locator('#pause-btn').is_enabled()
 # Exercise the real fixed-step stage with a TEST-ONLY environmental damage injection.
 # Pure unit tests separately check the real ember hazard collision, timings, and healing.
 page.evaluate('''() => {
   const old=EmberTrial.prototype.step;
   let injected=false;
   EmberTrial.prototype.step=function(dt,hero,hearts){
     const actual=old.call(this,dt,hero,hearts);
     if(!injected){injected=true;hearts.hurt(6,'browser-health-regression');return {damage:'dead',healed:0,source:'browser-health-regression'};}
     return actual;
   };
 }''')
 page.wait_for_timeout(120)
 assert c.get_attribute('data-heart-units')=='0'
 assert c.get_attribute('data-dead')=='true'
 assert page.locator('[data-heart-icons] .mortal-empty').count()==3
 assert page.locator('#death-overlay').is_visible()
 assert page.locator('#pause-overlay').is_hidden()
 assert page.locator('#pause-btn').is_disabled()
 ticks_before=int(c.get_attribute('data-physics-tick'))
 page.wait_for_timeout(170)
 ticks_after=int(c.get_attribute('data-physics-tick'))
 assert ticks_before==ticks_after,(ticks_before,ticks_after)
 assert 'THREAD SEVERED' in page.locator('[data-run-status]').inner_text()
 page.screenshot(path=str(ROOT/'v007-death.png'))
 page.locator('#restart-btn').click();page.wait_for_timeout(120)
 assert page.locator('#death-overlay').is_hidden()
 assert c.get_attribute('data-heart-units')=='6'
 assert c.get_attribute('data-dead')=='false'
 assert c.get_attribute('data-restarts')=='1'
 assert page.locator('[data-heart-icons] .mortal-full').count()==3
 assert page.locator('#pause-btn').is_enabled()
 assert page.evaluate('''() => Math.hypot(+document.querySelector('#gameplay-canvas').dataset.actorX-210,+document.querySelector('#gameplay-canvas').dataset.actorY-151.4)<60''')
 assert not errors,errors
 page.screenshot(path=str(ROOT/'v007-restarted.png'))
 print('PASS: actual browser stage life/death/restart UI, controls gated while dead, simulation stopped, 3 hearts restored, no JS errors.')
 browser.close()
