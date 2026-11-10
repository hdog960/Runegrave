"""Local Chromium touch/multitouch, pause and zero-overlap regression. Not an iPhone hardware test."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json
import re

OUT=Path(__file__).resolve().parent.parent
DIST=OUT/'dist'
HTML=re.sub(r'<script[^>]+src="./js/main.js"[^>]*></script>','',(DIST/'index.html').read_text())
HTML=re.sub(r'<link[^>]+(?:stylesheet|manifest|icon)[^>]*>','',HTML)
CSS=(DIST/'styles.css').read_text()
MODULES=['core/version.js','core/rng.js','core/ids.js','content/realmCatalog.js','input/vector.js','input/twinStick.js','scene/sanctuaryArt.js','scene/stage.js','platform/pwa.js','main.js']
JS='\n'.join((DIST/'js'/m).read_text() for m in MODULES)
JS=re.sub(r'^import .*?;\s*$','',JS,flags=re.MULTILINE)
JS=re.sub(r'^export (?=(?:const|class|function|async)\b)','',JS,flags=re.MULTILINE)


def dispatch(page, selector, kind, pointer_id, fx, fy):
    return page.evaluate('''([selector,kind,pointerId,fx,fy])=>{
      const e=document.querySelector(selector);const r=e.getBoundingClientRect();
      const ev=new PointerEvent(kind,{bubbles:true,cancelable:true,pointerId,pointerType:'touch',isPrimary:pointerId===11,clientX:r.x+r.width*fx,clientY:r.y+r.height*fy});
      e.dispatchEvent(ev);return [r.width,r.height];
    }''',[selector,kind,pointer_id,fx,fy])

def snapshot(page):
    return page.evaluate('''() => {
     const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height}};
     const cvs=document.querySelector('#gameplay-canvas');const c=rect(cvs);
     const overlap=(a,b)=>a.x<b.right&&a.right>b.x&&a.y<b.bottom&&a.bottom>b.y;
     const selectors=['.grip-left','.grip-right','.screen-status','.rune-socket','.rune-key','#pause-btn','[data-hud]'];
     const nodes=[...document.querySelectorAll(selectors.join(','))];
     const collisions=nodes.filter(el=>overlap(c,rect(el))).map(el=>el.className);
     const frame=rect(document.querySelector('#world-frame'));
     return {version:document.documentElement.dataset.version,handed:document.documentElement.dataset.handed,paused:document.documentElement.dataset.paused||'false',canvas:c,frame,collisions,actor:[+cvs.dataset.actorX,+cvs.dataset.actorY],bolts:+cvs.dataset.boltCount,leftRole:document.querySelector('#move-rune-disc').dataset.role,rightRole:document.querySelector('#aim-rune-disc').dataset.role,status:document.querySelector('[data-run-status]').textContent,panelHidden:document.querySelector('#pause-overlay').hidden};
    }''')

with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    for name,w,h in [('small',667,375),('regular',844,390),('plus',932,430),('compact',760,360),('portrait',390,844)]:
        ctx=browser.new_context(viewport={'width':w,'height':h},is_mobile=True,has_touch=True,device_scale_factor=2)
        page=ctx.new_page();errs=[];page.on('pageerror',lambda err:errs.append(str(err)))
        page.set_content(HTML)
        page.add_style_tag(content=CSS)
        page.evaluate('''() => { const store={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:(k)=>store[k]??null,setItem:(k,v)=>store[k]=String(v),removeItem:(k)=>delete store[k]}}); }''')
        page.add_script_tag(content=JS)
        page.wait_for_timeout(280)
        if name=='portrait':
            assert page.locator('.rotate-message').is_visible();assert not page.locator('.handheld').is_visible()
            page.screenshot(path=str(OUT/'v004-portrait.png'))
            print(name,'portrait orientation gate PASS',errs)
            assert not errs;ctx.close();continue
        before=snapshot(page)
        assert before['version']=='0.04.0',before
        assert before['canvas']==before['frame'],before
        assert before['canvas']['width']>0 and not before['collisions'],before
        # Camera world geometry must precisely match the measured stage surface.
        cam=page.evaluate("""() => {const c=document.querySelector('#gameplay-canvas');return {w:+c.dataset.cameraWidth,h:+c.dataset.cameraHeight}}""")
        assert abs(cam['w']/cam['h']-before['frame']['width']/before['frame']['height'])<.002,(cam,before)
        assert cam['w']>=400 and cam['h']>=100,(cam,before)
        assert before['panelHidden'] and not errs,(before,errs)
        # Two simultaneous independent touch pointers, each tracked by pointer ID in a separate grip.
        dispatch(page,'#move-rune-disc','pointerdown',11,.92,.5)
        dispatch(page,'#aim-rune-disc','pointerdown',22,.5,.05)
        page.wait_for_timeout(330)
        active=snapshot(page)
        assert active['actor'][0]>before['actor'][0]+10,(before,active)
        assert 'SOULBOLT' in active['status'],active
        assert active['bolts']>0,active
        assert not active['collisions'],active
        # Releasing only movement must not release the other thumb's aim.
        dispatch(page,'#move-rune-disc','pointerup',11,.92,.5)
        page.wait_for_timeout(110)
        after_move=snapshot(page)
        assert 'SOULBOLT' in after_move['status'],after_move
        dispatch(page,'#aim-rune-disc','pointercancel',22,.5,.05)
        page.wait_for_timeout(120)
        released=snapshot(page)
        assert 'SOULBOLT' not in released['status'],released
        # Keyboard fallback including auto-release upon background interruption.
        page.keyboard.down('KeyA');page.wait_for_timeout(100)
        moving=snapshot(page)
        assert moving['actor'][0]<released['actor'][0],(released,moving)
        page.evaluate('window.dispatchEvent(new Event("blur"))')
        page.wait_for_timeout(140)
        stopped=snapshot(page)
        page.wait_for_timeout(130)
        stopped2=snapshot(page)
        assert abs(stopped['actor'][0]-stopped2['actor'][0])<1,(stopped,stopped2)
        page.keyboard.up('KeyA')
        # Pause actually stops stage updates, clears input and makes menu visible.
        page.locator('#pause-btn').click();page.wait_for_timeout(100)
        paused=snapshot(page)
        assert paused['paused']=='true' and not paused['panelHidden'],paused
        assert paused['status'].startswith('PAUSED'),paused
        page.wait_for_timeout(220)
        p2=snapshot(page)
        assert p2['actor']==paused['actor'],(paused,p2)
        page.locator('#handed-toggle').check()
        page.locator('#pad-scale').fill('105')
        page.locator('#pad-offset').fill('6')
        page.locator('#dead-zone').fill('20')
        assert page.evaluate("JSON.parse(localStorage.getItem('runegrave:input:v1')).leftHanded") is True
        page.locator('#resume-btn').click();page.wait_for_timeout(70)
        swapped=snapshot(page)
        assert swapped['handed']=='left' and swapped['leftRole']=='aim' and swapped['rightRole']=='move',swapped
        # Right physical grip now drives movement; left drives aim/fire.
        dispatch(page,'#aim-rune-disc','pointerdown',33,.91,.5)
        dispatch(page,'#move-rune-disc','pointerdown',44,.5,.03)
        page.wait_for_timeout(240)
        swapped_moving=snapshot(page)
        assert swapped_moving['actor'][0]>swapped['actor'][0]+5, (swapped,swapped_moving)
        assert 'SOULBOLT' in swapped_moving['status'],swapped_moving
        page.screenshot(path=str(OUT/f'v004-{name}.png'))
        dispatch(page,'#aim-rune-disc','pointercancel',33,.91,.5)
        dispatch(page,'#move-rune-disc','pointercancel',44,.5,.03)
        # Resize in the same running session: stage and status elements remain separate.
        page.set_viewport_size({'width':w+24,'height':h+4});page.wait_for_timeout(180)
        resized=snapshot(page)
        assert resized['canvas']==resized['frame'] and not resized['collisions'],resized
        assert resized['version']=='0.04.0' and not errs,errs
        print(name,'PASS: multitouch, independent cancellation, keyboard, pause, handedness, persistent settings, zero-overlap, errors=0')
        ctx.close()
    browser.close()
print('All 4 landscape browser profiles + portrait PASS; not physical iPhone Safari verification.')
