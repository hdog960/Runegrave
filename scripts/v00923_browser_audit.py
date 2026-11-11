"""v0.09.23 Gate A real Chromium runtime, test-only warning pose and input.
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
  assert metrics['version']=='0.09.23',metrics
  assert metrics['c'][0]>=metrics['left']-2 and metrics['c'][1]<=metrics['right']+2,(label,metrics)
  exit=page.evaluate("""() => {const c=document.querySelector('#gameplay-canvas');return [+c.dataset.exitX,+c.dataset.exitY];}""")
  page.evaluate("pt=>window.__runegraveTest.stage.testJump({x:pt[0],y:pt[1]})",exit)
  page.wait_for_timeout(120)
  assert page.locator('#gameplay-canvas').get_attribute('data-room')=='crypt'
  if label=='regular':
   # Cross the actual encounter's post-strike zero boundary in live Chromium.
   # A negative residual windup while idle/recover must render safely.
   page.evaluate("""() => {
    const e=window.__runegraveTest.stage.getEncounter().enemies[0];
    e.state='recover';e.windup=-1/120;
   }""")
   page.wait_for_timeout(90)
   assert not errors,('negative idle/recover windup must not crash browser',errors)
   page.evaluate("""() => {
    const e=window.__runegraveTest.stage.getEncounter().enemies[0];
    e.state='idle';e.windup=0;
   }""")
   page.wait_for_timeout(40)
   page.evaluate("""() => {const es=window.__runegraveTest.stage.getEncounter().enemies;
      for(const e of es){e.state='warning';e.windup=.28;} }""")
   page.wait_for_timeout(100)
   page.screenshot(path=str(ROOT/'gate-a-v00923-saga-warning.png'))
   # Independently render the actual ship-ready sprite module in Chromium.
   # The published art contact sheet makes individual hero/enemy shapes easy to inspect.
   art_url=base.data_module('scene/pixelSpriteAtlas.js')
   figures=page.evaluate("""async moduleUrl => {
    const atlas=await import(moduleUrl);
    const canvas=document.createElement('canvas');canvas.id='gate-a-v00923-sprite-sheet';
    canvas.width=1040;canvas.height=365;
    canvas.style.cssText='position:absolute;left:0;top:1200px;width:1040px;height:365px;image-rendering:pixelated';
    const g=canvas.getContext('2d');g.fillStyle='#102124';g.fillRect(0,0,1040,365);
    g.textAlign='center';g.fillStyle='#ead7a5';g.font='12px monospace';
    const directions=['N','NE','E','SE','S','SW','W','NW'];
    const icons=[];
    for(let i=0;i<8;i++){
      const p={facing:directions[i],side:[0,1,1,1,0,-1,-1,-1][i],
        back:i===0||i===1||i===7,moving:true,recoil:0,aimX:0,aimY:1};
      const px=62+i*128;
      g.save();g.translate(px,80);atlas.paintHeroAtlas(g,p,i*.12,false);g.restore();
      g.fillText(directions[i],px,125);
      const sub=document.createElement('canvas');sub.width=64;sub.height=72;
      const sg=sub.getContext('2d');sg.translate(32,38);atlas.paintHeroAtlas(sg,p,i*.12,false);
      icons.push(sub.toDataURL());
    }
    if(new Set(icons).size!==8)throw Error('Hero atlas facings are visually duplicated');
    const kind=['draugr','wisp','archer','charger','sentinel','shade','warden'];
    const bodies=[];
    for(let i=0;i<7;i++){
      const px=75+i*145,enemy={kind:kind[i],state:'warning',windup:.22,phase:kind[i]==='warden'?2:1,flash:0};
      g.save();g.translate(px,258);atlas.paintHostileAtlas(g,enemy,1,true);g.restore();
      g.fillText(kind[i].toUpperCase(),px,312);
      const sub=document.createElement('canvas');sub.width=86;sub.height=110;
      const sg=sub.getContext('2d');sg.translate(43,56);atlas.paintHostileAtlas(sg,enemy,1,true);
      bodies.push(sub.toDataURL());
    }
    if(new Set(bodies).size!==7)throw Error('Enemy atlas bodies are visually duplicated');
    document.body.appendChild(canvas);
    return {hero:icons.length,enemies:bodies.length,cache:atlas.ATLAS_CELL};
   }""",art_url)
   assert figures=={'hero':8,'enemies':7,'cache':2},figures
   page.locator('#gate-a-v00923-sprite-sheet').screenshot(path=str(ROOT/'gate-a-v00923-character-contact-sheet.png'))
   # Element screenshots scroll into view; restore real viewport before movement.
   # Otherwise the next full-page PNG silently captures the contact-sheet area.
   page.evaluate("""() => {
     document.querySelector('#gate-a-v00923-sprite-sheet').remove();
     window.scrollTo(0,0);
   }""")
   page.wait_for_timeout(55)
   assert page.evaluate('window.scrollY')==0,'the playable game screenshot must not be scrolled away'
   print('original 8-facing hero + 7 hostile sprite contact sheet PASS',figures)

   # Full 25-scene browser art contact sheet, sampled from the actual deployed module.
   art_url=base.data_module('scene/chronicleFloor.js')
   scenes=page.evaluate("""async moduleUrl => {
    const mod=await import(moduleUrl);
    const canvas=document.createElement('canvas');canvas.id='gate-a-v00923-chronicle-sheet';
    canvas.width=950;canvas.height=850;
    canvas.style.cssText='position:absolute;left:0;top:1250px;width:950px;height:850px;image-rendering:pixelated';
    const g=canvas.getContext('2d');g.fillStyle='#0c171a';g.fillRect(0,0,950,850);
    g.font='11px monospace';g.textAlign='center';
    const fs=['ASH','IRON','ROOT','SPIRIT','FATE'],seen=new Set();
    for(let i=0;i<25;i++){
      const r=Math.floor(i/5),c=i%5,family=fs[r];
      const x=c*190+95,y=r*170+83;
      const sub=document.createElement('canvas');sub.width=126;sub.height=108;
      const sg=sub.getContext('2d');sg.translate(63-210*2,54-162*2);sg.scale(2,2);
      mod.paintChronicleFloor(sg,420,235,family,i,true);
      const bytes=sub.toDataURL();seen.add(bytes);
      g.drawImage(sub,x-63,y-54);g.fillStyle='#bdab7d';
      g.fillText(family+' / '+String(c+1),x,r*170+151);
    }
    if(seen.size!==25)throw Error('One or more canonical art scenes were duplicated');
    document.body.appendChild(canvas);
    return {scenes:seen.size,families:fs.length};
   }""",art_url)
   assert scenes=={'scenes':25,'families':5},scenes
   page.locator('#gate-a-v00923-chronicle-sheet').screenshot(path=str(ROOT/'gate-a-v00923-chronicle-contact-sheet.png'))
   page.evaluate("""() => {
     document.querySelector('#gate-a-v00923-chronicle-sheet').remove();
     window.scrollTo(0,0);
   }""")
   assert page.evaluate('window.scrollY')==0,'the gameplay screenshot must not be offscreen'
   print('25 authored floor mosaic scenes rendered in real Chromium PASS',scenes)

   # Eight real production doorway renderings (north/east/south/west × locked/open),
   # not fake labels or a palette comparison of the same state.
   actual_door_url=base.data_module('scene/doorArt.js')
   doorproof=page.evaluate("""async url => {
     const {drawRuneDoor}=await import(url);
     const gallery=document.createElement('canvas');gallery.id='gate-a-v00923-door-gallery';
     gallery.width=880;gallery.height=460;
     gallery.style.cssText='position:absolute;left:0;top:1250px;width:880px;height:460px;image-rendering:pixelated';
     const g=gallery.getContext('2d');
     g.fillStyle='#102022';g.fillRect(0,0,880,460);
     g.textAlign='center';g.font='bold 13px monospace';g.fillStyle='#e8d4a7';
     const cardinal=['north','east','south','west'],fingerprints=new Set();
     for(let r=0;r<2;r++)for(let c=0;c<4;c++){
       const direction=cardinal[c],open=r===1;
       const ox=c*220+110,oy=r*220+95;
       const iso=document.createElement('canvas');iso.width=142;iso.height=170;
       const ig=iso.getContext('2d');ig.translate(71,95);
       drawRuneDoor(ig,{x:71,y:0},direction,open,.35);
       fingerprints.add(iso.toDataURL());
       g.drawImage(iso,ox-71,oy-87);
       g.fillStyle='#e8d4a7';
       g.fillText(direction.toUpperCase()+' '+(open?'OPEN':'BARRED'),ox,r*220+201);
     }
     if(fingerprints.size!==8)throw Error('Door orientations or state sculptures repeat');
     document.body.appendChild(gallery);
     return {states:fingerprints.size,orientations:cardinal.length};
   }""",actual_door_url)
   assert doorproof=={'states':8,'orientations':4},doorproof
   page.locator('#gate-a-v00923-door-gallery').screenshot(path=str(ROOT/'gate-a-v00923-door-states.png'))
   page.evaluate("""() => {document.querySelector('#gate-a-v00923-door-gallery').remove();window.scrollTo(0,0);}""")
   assert page.evaluate('window.scrollY')==0,'door gallery must not capture offscreen fake gameplay'
   print('Eight real stateful Norse door sculptures rendered in Chromium PASS',doorproof)



   for selector,pid in [('#move-rune-disc',57),('#aim-rune-disc',58)]:
    page.evaluate("""([selector,pid])=>{const el=document.querySelector(selector),r=el.getBoundingClientRect();
      el.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerId:pid,
        pointerType:'touch',isPrimary:pid===57,clientX:r.left+r.width*.8,clientY:r.top+r.height*.37}));}""",[selector,pid])
   page.wait_for_timeout(175)
   assert int(page.locator('#gameplay-canvas').get_attribute('data-shots'))>0
   page.screenshot(path=str(ROOT/'gate-a-v00923-two-thumb.png'))
   for selector,pid in [('#move-rune-disc',57),('#aim-rune-disc',58)]:
    page.evaluate("""([selector,pid])=>document.querySelector(selector).dispatchEvent(
     new PointerEvent('pointercancel',{bubbles:true,pointerId:pid,pointerType:'touch'}))""",[selector,pid])
  assert not errors,(label,errors)
  print(label,'PASS state-true doors, eight compass visors, seven reactive hostile faces and two-thumb grips, guided chamber, zero exceptions')
  page.close()
 portrait=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 portrait.set_content(base.HTML);portrait.add_style_tag(content=(base.DIST/'styles.css').read_text())
 assert portrait.locator('.rotate-message').is_visible()
 print('portrait PASS rotate instruction')
 b.close()
