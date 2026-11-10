"""Local in-memory browser proof: aim from the right grip and break a target. Not iPhone Safari."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import re
R=Path(__file__).resolve().parent.parent
html=re.sub(r'<script[^>]+src="./js/main.js"[^>]*></script>','',(R/'dist/index.html').read_text())
html=re.sub(r'<link[^>]+(?:stylesheet|manifest|icon)[^>]*>','',html)
modules=['core/version.js','core/rng.js','core/ids.js','content/realmCatalog.js','input/vector.js','input/twinStick.js','scene/sanctuaryArt.js','physics/world.js','physics/fixedStep.js','combat/soulbolts.js','combat/combatArt.js','scene/stage.js','platform/pwa.js','main.js']
js='\n'.join((R/'dist/js'/p).read_text() for p in modules)
js=re.sub(r'^import .*?;\s*$','',js,flags=re.M)
js=re.sub(r'^export (?=(?:const|class|function|async)\b)','',js,flags=re.M)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 context=browser.new_context(viewport={'width':844,'height':390},is_mobile=True,has_touch=True,device_scale_factor=2)
 page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content(html);page.add_style_tag(content=(R/'dist/styles.css').read_text())
 page.evaluate("""() => {let s={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>s[k]??null,setItem:(k,v)=>s[k]=String(v),removeItem:k=>delete s[k]}})}""")
 page.add_script_tag(content=js)
 page.wait_for_timeout(250)
 state=lambda:page.evaluate("""() => {const c=document.querySelector('#gameplay-canvas');return {shots:+c.dataset.shots,hits:+c.dataset.hits,shattered:+c.dataset.shattered,bolts:+c.dataset.boltCount,targets:+c.dataset.liveTargets,actor:[+c.dataset.actorX,+c.dataset.actorY],error:null}}""")
 before=state();print('before',before)
 page.evaluate("""() => {const e=document.querySelector('#aim-rune-disc'),r=e.getBoundingClientRect();e.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerId:20,pointerType:'touch',clientX:r.x+r.width*.05,clientY:r.y+r.height*.40}));}""")
 page.wait_for_timeout(1650)
 after=state();print('after',after)
 page.screenshot(path=str(R/'v006-combat-target.png'))
 assert after['shots']>=5 and after['hits']>=3 and after['shattered']>=1, (before,after,errors)
 assert not errors,errors
 assert after['targets']<3,after
 print('PASS: real pointer-driven Soulbolts hit and break a destructible training target in browser.')
 context.close();browser.close()
