"""Gate A browser integration: actual stage transitions and pickup collection, with test-only
hostile damage/actor teleports. NOT a human-played, unaided win or iPhone ergonomics check.
"""
from pathlib import Path
import sys
sys.path.insert(0,str(Path(__file__).resolve().parent))
import v009_browser_audit as base
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent.parent
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-web-security'])
 page=browser.new_page(viewport={'width':844,'height':390},device_scale_factor=2,is_mobile=True,has_touch=True)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(base.HTML);page.add_style_tag(content=(base.DIST/'styles.css').read_text());page.add_script_tag(type='module',content=f'import "{base.data_module("main.js")}";')
 page.wait_for_timeout(150)
 assert page.locator('#guide-overlay').is_visible()
 page.locator('#guide-start-btn').click()
 page.wait_for_timeout(70)
 def state():return page.evaluate('''() => {const c=document.querySelector('#gameplay-canvas');return {room:c.dataset.room,phase:c.dataset.roomPhase,index:+c.dataset.roomIndex,relics:+c.dataset.relicCount,silver:+c.dataset.silver,remaining:+c.dataset.remainingDrops,gate:c.dataset.relicGateReady,actor:[+c.dataset.actorX,+c.dataset.actorY],exit:[+c.dataset.exitX,+c.dataset.exitY],wave:+c.dataset.roomWave,alive:+c.dataset.hostilesAlive,hearts:+c.dataset.heartUnits,bossDead:c.dataset.bossDefeated}}''')
 def jump(point):page.evaluate('''([x,y])=>window.__runegraveTest.stage.testJump({x,y})''',point);page.wait_for_timeout(120)
 def move_to_exit():
  route=page.evaluate('''() => window.__runegraveTest.stage.getPathToExit()''')
  assert len(route)>1,('path not found',state())
  jump(state()['exit'])
 def wipe_wave():
  page.evaluate('''() => {const e=window.__runegraveTest.stage.getEncounter();for(const enemy of [...e.enemies])if(enemy.alive)for(let i=0;i<40&&enemy.alive;i++)e.hitAt(enemy,3,5,{x:0,y:0});}''')
  page.wait_for_timeout(120)
 def collect(kind):
  a=page.evaluate('''kind=>window.__runegraveTest.stage.getDrops().find(d=>d.kind===kind&&!d.collected)''',kind)
  if not a:return False
  jump([a['x'],a['y']]);return True
 assert state()['room']=='practice',state()
 move_to_exit();assert state()['room']=='crypt' and state()['index']==1,state()
 page.screenshot(path=str(ROOT/'v009-first-chamber.png'))
 for chamber in range(1,9):
  s=state();assert s['room']=='crypt' and s['index']==chamber,(chamber,s)
  for round in range(3):
   if state()['phase']=='gate':break
   wipe_wave()
  assert state()['phase']=='gate',('cannot clear room',state())
  if chamber==1:page.screenshot(path=str(ROOT/'v009-relic-pedestal.png'))
  # Relic mandatory: exit must remain sealed until the physical pedestal is touched.
  assert state()['gate']=='false',('relic incorrectly auto-collected',state())
  # Test-friendly near gate position must not transition without reward.
  move_to_exit();assert state()['room']=='crypt' and state()['index']==chamber,'exit did not enforce relic pickup'
  assert collect('relic'),('no pickup',chamber)
  assert state()['relics']==chamber,('relic failed to bind',state())
  if chamber==6:assert state()['hearts']>=6,'Shieldroot should increase heart capacity or preserve damage'
  collect('silver');collect('heart')
  if chamber==8:page.screenshot(path=str(ROOT/'v009-eight-relics.png'))
  move_to_exit()
  if chamber<8:assert state()['room']=='crypt' and state()['index']==chamber+1,(chamber,state())
  else:assert state()['room']=='warden',state()
 assert state()['relics']==8 and state()['silver']>0,state()
 page.screenshot(path=str(ROOT/'v009-warden.png'))
 wipe_wave();assert state()['phase']=='gate' and state()['bossDead']=='true',state()
 collect('silver')
 move_to_exit();assert state()['room']=='complete',state()
 assert page.locator('#trial-clear-overlay').is_visible(),state()
 page.screenshot(path=str(ROOT/'v009-victory.png'))
 assert not errors,errors
 page.locator('#trial-new-run-btn').click();page.wait_for_timeout(120)
 assert state()['room']=='practice' and state()['relics']==0 and state()['silver']==0 and state()['hearts']==6,state()
 print('v0.09 COMPLETE CONNECTED ROUTE PASS (TEST-INJECTED HITS)',state(),'no script errors',errors)
 browser.close()
