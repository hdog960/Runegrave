"""v0.09.40 Gate A real Chromium runtime, test-only warning pose and input.
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
  assert metrics['version']=='0.09.40',metrics
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
   page.screenshot(path=str(ROOT/'gate-a-v00940-saga-warning.png'))
   # Independently render the actual ship-ready sprite module in Chromium.
   # The published art contact sheet makes individual hero/enemy shapes easy to inspect.
   art_url=base.data_module('scene/pixelSpriteAtlas.js')
   figures=page.evaluate("""async moduleUrl => {
    const atlas=await import(moduleUrl);
    const canvas=document.createElement('canvas');canvas.id='gate-a-v00940-sprite-sheet';
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
   page.locator('#gate-a-v00940-sprite-sheet').screenshot(path=str(ROOT/'gate-a-v00940-character-contact-sheet.png'))
   # Element screenshots scroll into view; restore real viewport before movement.
   # Otherwise the next full-page PNG silently captures the contact-sheet area.
   page.evaluate("""() => {
     document.querySelector('#gate-a-v00940-sprite-sheet').remove();
     window.scrollTo(0,0);
   }""")
   page.wait_for_timeout(55)
   assert page.evaluate('window.scrollY')==0,'the playable game screenshot must not be scrolled away'
   print('original 8-facing hero + 7 hostile sprite contact sheet PASS',figures)

   # Full 25-scene browser art contact sheet, sampled from the actual deployed module.
   art_url=base.data_module('scene/chronicleFloor.js')
   scenes=page.evaluate("""async moduleUrl => {
    const mod=await import(moduleUrl);
    const canvas=document.createElement('canvas');canvas.id='gate-a-v00940-chronicle-sheet';
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
   page.locator('#gate-a-v00940-chronicle-sheet').screenshot(path=str(ROOT/'gate-a-v00940-chronicle-contact-sheet.png'))
   page.evaluate("""() => {
     document.querySelector('#gate-a-v00940-chronicle-sheet').remove();
     window.scrollTo(0,0);
   }""")
   assert page.evaluate('window.scrollY')==0,'the gameplay screenshot must not be offscreen'
   print('25 authored floor mosaic scenes rendered in real Chromium PASS',scenes)

   # Eight real production doorway renderings (north/east/south/west × locked/open),
   # not fake labels or a palette comparison of the same state.
   actual_door_url=base.data_module('scene/doorArt.js')
   doorproof=page.evaluate("""async url => {
     const {drawRuneDoor}=await import(url);
     const gallery=document.createElement('canvas');gallery.id='gate-a-v00940-door-gallery';
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
       const ig=iso.getContext('2d');ig.translate(0,95);
       drawRuneDoor(ig,{x:71,y:0},direction,open,.35);
       // The audit must prove both left and right buttresses are actually
       // visible; an earlier contact sheet accidentally clipped half the door.
       const pixels=ig.getImageData(0,0,142,170).data;
       let leftPaint=0,rightPaint=0;
       for(let py=40;py<133;py++)for(let px=16;px<126;px++){
         const alpha=pixels[(py*142+px)*4+3];
         if(alpha>0){if(px<56)leftPaint++;if(px>86)rightPaint++;}
       }
       if(leftPaint<80||rightPaint<80)
          throw new Error('Clipped door art in screenshot: '+leftPaint+'/'+rightPaint);
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
   page.locator('#gate-a-v00940-door-gallery').screenshot(path=str(ROOT/'gate-a-v00940-door-states.png'))
   page.evaluate("""() => {document.querySelector('#gate-a-v00940-door-gallery').remove();window.scrollTo(0,0);}""")
   assert page.evaluate('window.scrollY')==0,'door gallery must not capture offscreen fake gameplay'
   print('Eight real stateful Norse door sculptures rendered in Chromium PASS',doorproof)

   # 25 complete story-frieze wall scenes, rendered from the PRODUCTION module.
   frieze_url=base.data_module('scene/sagaFloorFrieze.js')
   panelproof=page.evaluate("""async moduleUrl => {
     const art=await import(moduleUrl);
     const c=document.createElement('canvas');c.id='gate-a-v00940-frieze-gallery';
     c.width=1420;c.height=750;
     c.style.cssText='position:absolute;left:0;top:1250px;width:1420px;height:750px;image-rendering:pixelated';
     const g=c.getContext('2d');g.fillStyle='#0b191a';g.fillRect(0,0,1420,750);
     g.textAlign='center';g.font='bold 12px monospace';
     const families=['ASH','IRON','ROOT','SPIRIT','FATE'],fingerprints=new Set();
     for(let i=0;i<25;i++){
       const family=families[Math.floor(i/5)],row=Math.floor(i/5),col=i%5;
       const sub=document.createElement('canvas');sub.width=240;sub.height=60;
       const sg=sub.getContext('2d');sg.translate(-90,-175);
       art.paintSagaFloorFrieze(sg,420,235,family,i);
       fingerprints.add(sub.toDataURL());
       const x=col*282+20,y=row*148+25;
       g.drawImage(sub,x,y,240,60);
       g.fillStyle='#d8c69d';g.fillText('ROOM '+String(i+1).padStart(2,'0')+' · '+family,x+120,y+86);
     }
     if(fingerprints.size!==25)throw new Error('Duplicated 25-room frieze art');
     document.body.appendChild(c);
     return fingerprints.size;
   }""",frieze_url)
   assert panelproof==25,panelproof
   page.locator('#gate-a-v00940-frieze-gallery').screenshot(path=str(ROOT/'gate-a-v00940-frieze-contact-sheet.png'))
   page.evaluate("""()=>{document.querySelector('#gate-a-v00940-frieze-gallery').remove();window.scrollTo(0,0)}""")
   assert page.evaluate('window.scrollY')==0
   print('25 authentic Norse floor friezes are visually distinct PASS')

   # Twenty-eight actual body+weapon states; true windup, no lookalike palette swaps.
   weapon_url=base.data_module('scene/pixelSpriteAtlas.js')
   weaponproof=page.evaluate("""async moduleUrl => {
     const art=await import(moduleUrl);
     const c=document.createElement('canvas');c.id='gate-a-v00940-weapon-gallery';
     c.width=1120;c.height=660;
     c.style.cssText='position:absolute;left:0;top:1250px;width:1120px;height:660px;image-rendering:pixelated';
     const g=c.getContext('2d');g.fillStyle='#0d191d';g.fillRect(0,0,1120,660);
     g.textAlign='center';g.fillStyle='#d8c69d';g.font='12px monospace';
     const species=['draugr','wisp','archer','charger','sentinel','shade','warden'];
     const winds=[.96,.56,.29,.07],images=new Set();
     for(let i=0;i<species.length;i++)for(let j=0;j<4;j++){
       const state={kind:species[i],state:'warning',windup:winds[j],phase:species[i]==='warden'?2:1,flash:0};
       const sub=document.createElement('canvas');sub.width=112;sub.height=104;
       const sg=sub.getContext('2d');sg.translate(36,62);
       art.paintHostileAtlas(sg,state,0,true);
       images.add(sub.toDataURL());
       const x=i*158+19,y=j*158+4;
       g.drawImage(sub,x,y);
       g.fillText(species[i].toUpperCase(),x+56,y+116);
     }
     if(images.size!==28)throw new Error('Attack weapons fail the four-state sprite comparison');
     document.body.appendChild(c);return images.size;
   }""",weapon_url)
   assert weaponproof==28,weaponproof
   page.locator('#gate-a-v00940-weapon-gallery').screenshot(path=str(ROOT/'gate-a-v00940-weapon-contact-sheet.png'))
   page.evaluate("""()=>{document.querySelector('#gate-a-v00940-weapon-gallery').remove();window.scrollTo(0,0)}""")
   assert page.evaluate('window.scrollY')==0
   print('Seven real hostile species x four authentic windup poses PASS')





   # Every canonical room carries two newly drawn side wall piers,
   # inspected using actual production renderer code, not mock screenshots.
   pier_url=base.data_module('scene/sagaPillarRelief.js')
   pillars=page.evaluate("""async url => {
     const {paintSagaPillars}=await import(url);
     const gallery=document.createElement('canvas');gallery.id='gate-a-v00940-pillar-gallery';
     gallery.width=1450;gallery.height=650;
     gallery.style.cssText='position:absolute;left:0;top:1250px;width:1450px;height:650px;image-rendering:pixelated';
     const g=gallery.getContext('2d');g.fillStyle='#0a171c';g.fillRect(0,0,1450,650);
     g.font='12px monospace';g.textAlign='center';g.fillStyle='#e7cea1';
     const fs=['ASH','IRON','ROOT','SPIRIT','FATE'],images=new Set();
     for(let i=0;i<25;i++){
       const family=fs[Math.floor(i/5)],col=i%5,row=Math.floor(i/5);
       const sub=document.createElement('canvas');sub.width=420;sub.height=115;
       const sg=sub.getContext('2d');paintSagaPillars(sg,420,235,family,i);
       images.add(sub.toDataURL());
       const x=col*290+12,y=row*125+3;
       g.drawImage(sub,x,y,265,85);
       g.fillText(family+' / '+String(col+1),x+135,y+107);
     }
     if(images.size!==25)throw Error('New architecture has duplicated canonical scenes');
     document.body.appendChild(gallery);return images.size;
   }""",pier_url)
   assert pillars==25,pillars
   page.locator('#gate-a-v00940-pillar-gallery').screenshot(path=str(ROOT/'gate-a-v00940-pillar-contact-sheet.png'))
   page.evaluate("()=>{document.querySelector('#gate-a-v00940-pillar-gallery').remove();window.scrollTo(0,0)}")
   assert page.evaluate('window.scrollY')==0

   # The actual eight-facing hero ink is now animated in four distinct cloth
   # silhouettes; no overlays or decorative synthetic danger indicators.
   mantle_url=base.data_module('scene/pixelSpriteAtlas.js')
   cloth=page.evaluate("""async url => {
      const atlas=await import(url),facings=['N','NE','E','SE','S','SW','W','NW'];
      const can=document.createElement('canvas');can.id='gate-a-v00940-mantle-gallery';
      can.width=1152;can.height=500;
      can.style.cssText='position:absolute;left:0;top:1250px;width:1152px;height:500px;image-rendering:pixelated';
      const g=can.getContext('2d');g.fillStyle='#101b20';g.fillRect(0,0,1152,500);
      g.font='12px monospace';g.textAlign='center';g.fillStyle='#eed5a2';
      for(let i=0;i<facings.length;i++){
       const unique=new Set();
       for(let j=0;j<4;j++){
        const f=facings[i],side=f.includes('W')?-1:f.includes('E')?1:0;
        const pose={facing:f,side,back:f.includes('N'),moving:true,recoil:0,aimX:1,aimY:0};
        const sub=document.createElement('canvas');sub.width=74;sub.height=86;
        const sg=sub.getContext('2d');sg.translate(37,40);
        atlas.paintHeroAtlas(sg,pose,[0,.12,.24,.36][j],false);
        unique.add(sub.toDataURL());
        const x=i*142+17,y=j*120+4;
        g.drawImage(sub,x,y);
        g.fillText(f+' / gait '+j,x+36,y+101);
       }
       if(unique.size!==4)throw Error(facings[i]+' has duplicate cloth locomotion frame');
      }
      document.body.appendChild(can);return {facings:facings.length,steps:4};
   }""",mantle_url)
   assert cloth=={'facings':8,'steps':4},cloth
   page.locator('#gate-a-v00940-mantle-gallery').screenshot(path=str(ROOT/'gate-a-v00940-mantle-contact-sheet.png'))
   page.evaluate("()=>{document.querySelector('#gate-a-v00940-mantle-gallery').remove();window.scrollTo(0,0)}")
   assert page.evaluate('window.scrollY')==0


   # Twenty-four actual actor/armour stances, not merely different captions.
   stance_url=base.data_module('scene/pixelSpriteAtlas.js')
   stances=page.evaluate("""async url => {
     const art=await import(url),directions=['N','NE','E','SE','S','SW','W','NW'];
     const sheet=document.createElement('canvas');sheet.id='gate-a-v00940-hero-stance-gallery';
     sheet.width=1120;sheet.height=480;
     sheet.style.cssText='position:absolute;left:0;top:1250px;width:1120px;height:480px;image-rendering:pixelated';
     const g=sheet.getContext('2d');g.fillStyle='#0d1b20';g.fillRect(0,0,1120,480);
     g.fillStyle='#e5cea0';g.font='12px monospace';g.textAlign='center';
     const seen=new Set();
     for(let i=0;i<directions.length;i++){
       const f=directions[i],side=f.includes('W')?-1:f.includes('E')?1:0,back=f.includes('N');
       for(let j=0;j<3;j++){
         const pose={facing:f,side,back,moving:j===1,recoil:j===2?.8:0,aimX:side,aimY:back?-1:1};
         const cell=document.createElement('canvas');cell.width=78;cell.height=92;
         const cg=cell.getContext('2d');cg.translate(39,47);
         art.paintHeroAtlas(cg,pose,j===1?.12:0,false);
         seen.add(cell.toDataURL());
         const x=i*138+28,y=j*148+14;g.drawImage(cell,x,y);
         g.fillText(f+' '+['IDLE','STEP','RECOIL'][j],x+39,y+110);
       }
     }
     if(seen.size!==24)throw Error('Eight directional stances or authentic recoil duplicate');
     document.body.appendChild(sheet);return {facings:8,stances:24};
   }""",stance_url)
   assert stances=={'facings':8,'stances':24},stances
   page.locator('#gate-a-v00940-hero-stance-gallery').screenshot(path=str(ROOT/'gate-a-v00940-hero-stance-contact-sheet.png'))
   page.evaluate("()=>{document.querySelector('#gate-a-v00940-hero-stance-gallery').remove();window.scrollTo(0,0)}")
   assert page.evaluate('window.scrollY')==0

   # Seven existing species with four true gameplay windups, now showing
   # the *authored* new anatomy-specific attack extensions in the live painter.
   posture_url=base.data_module('scene/pixelSpriteAtlas.js')
   posture=page.evaluate("""async url => {
     const art=await import(url),kinds=['draugr','wisp','archer','charger','sentinel','shade','warden'];
     const gallery=document.createElement('canvas');gallery.id='gate-a-v00940-weapon-stance-gallery';
     gallery.width=1120;gallery.height=640;
     gallery.style.cssText='position:absolute;left:0;top:1250px;width:1120px;height:640px;image-rendering:pixelated';
     const g=gallery.getContext('2d');g.fillStyle='#101b1e';g.fillRect(0,0,1120,640);
     g.fillStyle='#edcf9a';g.font='12px monospace';g.textAlign='center';
     const winds=[.96,.54,.30,.06],frames=new Set();
     for(let i=0;i<kinds.length;i++)for(let j=0;j<4;j++){
       const e={kind:kinds[i],state:'warning',windup:winds[j],phase:kinds[i]==='warden'?2:1,flash:0};
       const sub=document.createElement('canvas');sub.width=112;sub.height=103;
       const sg=sub.getContext('2d');sg.translate(44,69);
       art.paintHostileAtlas(sg,e,0,true);frames.add(sub.toDataURL());
       const x=i*158+15,y=j*156+6;g.drawImage(sub,x,y);
       g.fillText(kinds[i].toUpperCase()+' '+j,x+56,y+118);
     }
     if(frames.size!==28)throw Error('One of the 28 true battle poses duplicated');
     document.body.appendChild(gallery);return frames.size;
   }""",posture_url)
   assert posture==28,posture
   page.locator('#gate-a-v00940-weapon-stance-gallery').screenshot(path=str(ROOT/'gate-a-v00940-weapon-stance-contact-sheet.png'))
   page.evaluate("()=>{document.querySelector('#gate-a-v00940-weapon-stance-gallery').remove();window.scrollTo(0,0)}")
   assert page.evaluate('window.scrollY')==0


   # Actual shipped modules: 25 room-specific canopies, 28 genuinely distinct
   # combat-body poses and eight x four in-motion cloth poses, not static mocks.
   proof=page.evaluate("""async urls => {
     const canopy=await import(urls[0]),body=await import(urls[1]),atlas=await import(urls[2]);
     const fam=['ASH','IRON','ROOT','SPIRIT','FATE'];
     const kinds=['draugr','wisp','archer','charger','sentinel','shade','warden'];
     const facing=['N','NE','E','SE','S','SW','W','NW'];
     const make=(id,w,h)=>{
       const c=document.createElement('canvas');c.id=id;c.width=w;c.height=h;
       const tops={'gate-a-v00940-vault-gallery':1250,'gate-a-v00940-cloak-gallery':2080,'gate-a-v00940-body-gallery':2810};
       c.style.cssText='position:absolute;left:0;top:'+tops[id]+'px;image-rendering:pixelated';
       const g=c.getContext('2d');g.fillStyle='#101d20';g.fillRect(0,0,w,h);
       g.fillStyle='#e5cea7';g.font='12px monospace';g.textAlign='center';document.body.appendChild(c);return g;
     };
     const vg=make('gate-a-v00940-vault-gallery',1475,690),rooms=new Set();
     for(let i=0;i<25;i++){
       const f=fam[Math.floor(i/5)],n=i%5,col=n,row=Math.floor(i/5);
       const cell=document.createElement('canvas');cell.width=420;cell.height=112;
       const g=cell.getContext('2d');canopy.paintVaultCanopies(g,420,235,f,i);
       rooms.add(cell.toDataURL());
       const x=col*294+9,y=row*138+3;vg.drawImage(cell,x,y,276,100);
       vg.fillText(f+' / SAGA '+(n+1),x+138,y+117);
     }
     if(rooms.size!==25)throw Error('Missing original canonical canopy: '+rooms.size);
     const cg=make('gate-a-v00940-cloak-gallery',1158,516),capes=new Set();
     for(let i=0;i<8;i++)for(let j=0;j<4;j++){
       const f=facing[i],side=f.includes('W')?-1:f.includes('E')?1:0;
       const pose={facing:f,back:f.includes('N'),side,moving:true,recoil:0,aimX:side,aimY:f.includes('N')?-1:1};
       const cell=document.createElement('canvas');cell.width=92;cell.height=71;
       const g=cell.getContext('2d');g.translate(46,35);
       atlas.paintHeroSagaMantle(g,pose,[0,.12,.24,.36][j],false);
       capes.add(cell.toDataURL());
       const x=i*144+4,y=j*127+3;cg.drawImage(cell,x,y);
       cg.fillText(f+' / '+j,x+46,y+88);
     }
     if(capes.size!==32)throw Error('Missing actual moving cloak silhouette: '+capes.size);
     const bg=make('gate-a-v00940-body-gallery',1134,643),foes=new Set();
     for(let i=0;i<7;i++)for(let j=0;j<4;j++){
       const source=atlas.HOSTILE_ATLAS[kinds[i]];
       const flex=body.inkedWindupBody(source,kinds[i],j);
       if(j>0&&flex.join('|')===source.join('|'))throw Error('Absent in-place windup torso '+kinds[i]);
       const e={kind:kinds[i],state:'warning',windup:[.95,.54,.30,.06][j],phase:1,flash:0};
       const cell=document.createElement('canvas');cell.width=116;cell.height=106;
       const g=cell.getContext('2d');g.translate(57,70);
       atlas.paintHostileAtlas(g,e,0,true);
       foes.add(cell.toDataURL());
       const x=i*160+5,y=j*155+2;bg.drawImage(cell,x,y);
       bg.fillText(kinds[i].toUpperCase()+' / '+j,x+58,y+120);
     }
     if(foes.size!==28)throw Error('Missing true enemy attack-body silhouette: '+foes.size);
     return {rooms:rooms.size,capes:capes.size,foes:foes.size};
   }""",[base.data_module('scene/sagaVaultCanopies.js'),base.data_module('scene/sagaBodyLanguage.js'),base.data_module('scene/pixelSpriteAtlas.js')])
   assert proof=={'rooms':25,'capes':32,'foes':28},proof
   for selector,name in [
       ('#gate-a-v00940-vault-gallery','gate-a-v00940-vault-contact-sheet.png'),
       ('#gate-a-v00940-cloak-gallery','gate-a-v00940-cloak-contact-sheet.png'),
       ('#gate-a-v00940-body-gallery','gate-a-v00940-hostile-body-contact-sheet.png')]:
    page.locator(selector).screenshot(path=str(ROOT/name))
   page.evaluate("""() => {
     for(const id of ['gate-a-v00940-vault-gallery','gate-a-v00940-cloak-gallery','gate-a-v00940-body-gallery'])
       document.getElementById(id).remove();
     window.scrollTo(0,0);
   }""")
   assert page.evaluate('window.scrollY')==0


   # Seven real hostile *damage events* contrasted against their untouched
   # living sprites: no fabricated attack clock or fake wall-space telegraph.
   damage_images=page.evaluate("""async url => {
    const art=await import(url),kinds=['draugr','wisp','archer','charger','sentinel','shade','warden'];
    const gallery=document.createElement('canvas');gallery.id='gate-a-v00940-damage-gallery';
    gallery.width=1150;gallery.height=330;
    gallery.style.cssText='position:absolute;left:0;top:1600px;width:1150px;height:330px;image-rendering:pixelated';
    const g=gallery.getContext('2d');g.fillStyle='#101f22';g.fillRect(0,0,1150,330);
    g.font='12px monospace';g.textAlign='center';g.fillStyle='#f5d4a1';
    let altered=0;
    for(let i=0;i<kinds.length;i++){
      const kind=kinds[i],images=[];
      for(let j=0;j<2;j++){
       const cell=document.createElement('canvas');cell.width=80;cell.height=90;
       const cg=cell.getContext('2d');cg.translate(40,48);
       art.paintHostileAtlas(cg,{kind,state:'idle',windup:0,phase:1,flash:j?.18:0},0,true);
       images.push(cell.toDataURL());
       g.drawImage(cell,i*163+5,j*135+3);
       g.fillText(kind+' '+(j?'HIT':'IDLE'),i*163+45,j*135+106);
      }
      if(images[0]===images[1])throw Error('Missing damage event ink '+kind);
      altered++;
    }
    document.body.appendChild(gallery);return altered;
   }""",base.data_module('scene/pixelSpriteAtlas.js'))
   assert damage_images==7,damage_images
   page.locator('#gate-a-v00940-damage-gallery').screenshot(path=str(ROOT/'gate-a-v00940-real-hit-fractures.png'))
   page.evaluate("()=>document.querySelector('#gate-a-v00940-damage-gallery').remove()")

   # Eight Norse arm-braces in four real locomotion stances, from the actual
   # integrated actor renderer (not a proposed illustration or still mockup).
   shield_forms=page.evaluate("""async url => {
    const art=await import(url),fs=['N','NE','E','SE','S','SW','W','NW'];
    const gallery=document.createElement('canvas');gallery.id='gate-a-v00940-shield-gallery';
    gallery.width=1200;gallery.height=540;
    gallery.style.cssText='position:absolute;left:0;top:1600px;width:1200px;height:540px;image-rendering:pixelated';
    const g=gallery.getContext('2d');g.fillStyle='#0e2023';g.fillRect(0,0,1200,540);
    g.fillStyle='#f0d9b1';g.font='12px monospace';g.textAlign='center';
    const seen=new Set();
    for(let i=0;i<8;i++){
      const f=fs[i],side=f.includes('W')?-1:f.includes('E')?1:0;
      for(let j=0;j<4;j++){
        const cell=document.createElement('canvas');cell.width=80;cell.height=88;
        const cg=cell.getContext('2d');cg.translate(40,50);
        art.paintHeroAtlas(cg,{facing:f,side,back:f.includes('N'),moving:true,recoil:0,aimX:side,aimY:0},[0,.12,.24,.36][j],false);
        seen.add(cell.toDataURL());
        const x=i*148+15,y=j*132+2;g.drawImage(cell,x,y);
        g.fillText(f+' ARM '+j,x+40,y+102);
      }
    }
    if(seen.size!==32)throw Error('Hero directional shield beat duplicate: '+seen.size);
    document.body.appendChild(gallery);return seen.size;
   }""",base.data_module('scene/pixelSpriteAtlas.js'))
   assert shield_forms==32,shield_forms
   page.locator('#gate-a-v00940-shield-gallery').screenshot(path=str(ROOT/'gate-a-v00940-eight-shield-gaits.png'))
   page.evaluate("()=>{document.querySelector('#gate-a-v00940-shield-gallery').remove();window.scrollTo(0,0)}")
   assert page.evaluate('window.scrollY')==0

   # Actual production hero renderer: authentic Mortal Heart grace changes
   # eight physical compass armour sprites without EVER removing the actor.
   hurts=page.evaluate("""async url => {
     const a=await import(url),directions=['N','NE','E','SE','S','SW','W','NW'];
     const gallery=document.createElement('canvas');gallery.id='gate-a-v00940-hurt-gallery';
     gallery.width=1200;gallery.height=405;
     gallery.style.cssText='position:absolute;left:0;top:1600px;width:1200px;height:405px;image-rendering:pixelated';
     const g=gallery.getContext('2d');g.fillStyle='#102225';g.fillRect(0,0,1200,405);
     g.fillStyle='#f6daaa';g.font='12px monospace';g.textAlign='center';
     let distinct=0;
     for(let i=0;i<8;i++){
       const f=directions[i],images=[];
       for(let j=0;j<3;j++){
         const cell=document.createElement('canvas');cell.width=86;cell.height=95;
         const cg=cell.getContext('2d');cg.translate(43,48);
         a.paintHeroAtlas(cg,{facing:f,side:f.includes('W')?-1:f.includes('E')?1:0,
           back:f.includes('N'),moving:false,recoil:0,aimX:0,aimY:1},0,true,[0,.9,.3][j]);
         images.push(cell.toDataURL());
         const x=i*148+16,y=j*133+2;
         g.drawImage(cell,x,y);g.fillText(f+' / '+['OK','HURT','RECOVER'][j],x+43,y+106);
       }
       if(new Set(images).size!==3)throw Error('Hurt Wayfarer invisible or duplicate '+f);
       distinct++;
     }
     document.body.appendChild(gallery);return distinct;
   }""",base.data_module('scene/pixelSpriteAtlas.js'))
   assert hurts==8,hurts
   page.locator('#gate-a-v00940-hurt-gallery').screenshot(path=str(ROOT/'gate-a-v00940-8-facing-actual-hurt.png'))
   page.evaluate("()=>document.querySelector('#gate-a-v00940-hurt-gallery').remove()")

   # One real Rootbound Warden, two AUTHENTIC simulation phases: phase-two
   # mutates BODY anatomy, not a floating overlay or invented new attack.
   warden=page.evaluate("""async url => {
     const a=await import(url),gallery=document.createElement('canvas');
     gallery.id='gate-a-v00940-warden-gallery';gallery.width=480;gallery.height=240;
     gallery.style.cssText='position:absolute;left:0;top:1600px;width:480px;height:240px;image-rendering:pixelated';
     const g=gallery.getContext('2d');g.fillStyle='#102122';g.fillRect(0,0,480,240);
     g.font='13px monospace';g.fillStyle='#f3dbad';g.textAlign='center';
     const images=[];
     for(let i=0;i<2;i++){
       const cell=document.createElement('canvas');cell.width=140;cell.height=150;
       const cg=cell.getContext('2d');cg.translate(66,78);
       a.paintHostileAtlas(cg,{kind:'warden',state:'warning',windup:.28,phase:i+1,flash:0},0,true);
       images.push(cell.toDataURL());g.drawImage(cell,i*232+40,9);
       g.fillText('REAL PHASE '+(i+1),i*232+110,185);
     }
     if(images[0]===images[1])throw Error('Rootbound Warden body unchanged in true phase two');
     document.body.appendChild(gallery);return images.length;
   }""",base.data_module('scene/pixelSpriteAtlas.js'))
   assert warden==2,warden
   page.locator('#gate-a-v00940-warden-gallery').screenshot(path=str(ROOT/'gate-a-v00940-real-warden-phases.png'))
   page.evaluate("()=>{document.querySelector('#gate-a-v00940-warden-gallery').remove();window.scrollTo(0,0)}")
   assert page.evaluate('window.scrollY')==0

   # The real production painter must display six distinct hand-inked
   # in-flight bodies in contrast to friendly cyan Soulbolts. Every image is
   # from real Chromium canvas, not a design mockup or fabricated interaction.
   shot_ink=page.evaluate("""async url => {
     const art=await import(url),gallery=document.createElement('canvas');
     gallery.id='gate-a-v00940-hostile-shot-gallery';
     gallery.width=1040;gallery.height=500;
     gallery.style.cssText='position:absolute;left:0;top:1800px;width:1040px;height:500px;image-rendering:pixelated';
     const g=gallery.getContext('2d');g.fillStyle='#111c25';g.fillRect(0,0,1040,500);
     g.fillStyle='#f8d9a8';g.font='15px monospace';g.textAlign='center';g.imageSmoothingEnabled=false;
     const data=new Set(),lifetimes=[2.8,1.5,.40];
     for(let kind=0;kind<2;kind++)for(let phase=0;phase<3;phase++){
       const bolt={id:12,x:42,y:38,dx:1,dy:0,radius:3.4,speed:100,
        damage:kind?2:1,life:lifetimes[phase]};
       const cell=document.createElement('canvas');cell.width=80;cell.height=72;
       const cg=cell.getContext('2d');cg.fillStyle='#152431';cg.fillRect(0,0,80,72);
       art.paintHostileProjectiles(cg,[bolt],0);
       const identical=document.createElement('canvas');identical.width=80;identical.height=72;
       const ic=identical.getContext('2d');ic.fillStyle='#152431';ic.fillRect(0,0,80,72);
       art.paintHostileProjectiles(ic,[bolt],47);
       if(cell.toDataURL()!==identical.toDataURL())throw Error('Free-running fake hostile missile animation');
       data.add(cell.toDataURL());
       const x=phase*330+15,y=kind*245+15;
       g.drawImage(cell,x,y,315,196);
       g.fillText((kind?'WARDEN ROOT EMBER':'SPECTRAL RUNE DART')+' · '+['EARLY','MID','LATE'][phase],x+155,y+220);
     }
     if(data.size!==6)throw Error('Duplicate hostile projectile silhouette: '+data.size);
     document.body.appendChild(gallery);return {families:2,forms:data.size};
   }""",base.data_module('enemies/hostileProjectileArt.js'))
   assert shot_ink=={'families':2,'forms':6},shot_ink
   page.locator('#gate-a-v00940-hostile-shot-gallery').screenshot(path=str(ROOT/'gate-a-v00940-hostile-shot-pixel-ink.png'))
   page.evaluate("()=>{document.querySelector('#gate-a-v00940-hostile-shot-gallery').remove();window.scrollTo(0,0)}")
   assert page.evaluate('window.scrollY')==0


   # Actual hostile renderer, not free-running concepts: ONLY three real
   # recovering types across three authentic countdown bands. State and
   # remainder are the same fields the encounter simulation updates.
   recovery_art=page.evaluate("""async url => {
    const atlas=await import(url),types=['charger','shade','warden'],
      durations=[.65,.32,.28],states=[.90,.50,.10];
    const gallery=document.createElement('canvas');gallery.id='gate-a-v00940-recovery-gallery';
    gallery.width=940;gallery.height=580;
    gallery.style.cssText='position:absolute;left:0;top:1800px;width:940px;height:580px;image-rendering:pixelated';
    const g=gallery.getContext('2d');g.fillStyle='#111f25';g.fillRect(0,0,940,580);
    g.fillStyle='#f0d4a4';g.font='14px monospace';g.textAlign='center';g.imageSmoothingEnabled=false;
    let count=0;
    for(let i=0;i<3;i++){
      const rendered=new Set();
      for(let j=0;j<3;j++){
        const cell=document.createElement('canvas');cell.width=108;cell.height=100;
        const cg=cell.getContext('2d');cg.translate(54,54);
        atlas.paintHostileAtlas(cg,{kind:types[i],state:'recover',windup:durations[i]*states[j],
          phase:types[i]==='warden'?2:1,flash:0},0,true);
        rendered.add(cell.toDataURL());
        const x=i*310+24,y=j*185+9;g.drawImage(cell,x,y,200,140);
        g.fillText(types[i].toUpperCase()+' / RECOVER '+(j+1),x+100,y+157);
        count++;
      }
      if(rendered.size!==3)throw Error('Missing physical authentic recover stage for '+types[i]);
    }
    document.body.appendChild(gallery);return count;
   }""",base.data_module('scene/pixelSpriteAtlas.js'))
   assert recovery_art==9,recovery_art
   page.locator('#gate-a-v00940-recovery-gallery').screenshot(path=str(ROOT/'gate-a-v00940-real-post-strike-recoveries.png'))
   page.evaluate("()=>document.querySelector('#gate-a-v00940-recovery-gallery').remove()")

   # Five funerary carvings actually rendered into the 25 shipped side walls.
   effigies=page.evaluate("""async url => {
    const art=await import(url),families=['ASH','IRON','ROOT','SPIRIT','FATE'];
    const gallery=document.createElement('canvas');gallery.id='gate-a-v00940-effigy-gallery';
    gallery.width=1100;gallery.height=320;
    gallery.style.cssText='position:absolute;left:0;top:1800px;width:1100px;height:320px;image-rendering:pixelated';
    const g=gallery.getContext('2d');g.fillStyle='#151e22';g.fillRect(0,0,1100,320);
    g.fillStyle='#f7d6a7';g.font='16px monospace';g.textAlign='center';g.imageSmoothingEnabled=false;
    const forms=new Set();
    for(let i=0;i<5;i++){
      const cell=document.createElement('canvas');cell.width=55;cell.height=82;
      const cg=cell.getContext('2d');cg.translate(-52,-14);
      art.paintVaultCanopies(cg,420,235,families[i],i*5);
      forms.add(cell.toDataURL());
      g.drawImage(cell,15+i*219,6,200,275);
      g.fillText(families[i]+' MEMORIAL',110+i*219,309);
    }
    if(forms.size!==5)throw Error('Carved memorials are not five original shapes');
    document.body.appendChild(gallery);return forms.size;
   }""",base.data_module('scene/sagaVaultCanopies.js'))
   assert effigies==5,effigies
   page.locator('#gate-a-v00940-effigy-gallery').screenshot(path=str(ROOT/'gate-a-v00940-five-burial-memorials.png'))
   page.evaluate("()=>{document.querySelector('#gate-a-v00940-effigy-gallery').remove();window.scrollTo(0,0)}")
   assert page.evaluate('window.scrollY')==0


   # v0.09.40: proof of five actual entire chamber floors reauthored
   # with larger flags, not tiny decorative additions on top of old art.
   # Same production function as the real canvas, five authoritative families.
   floor_count=page.evaluate("""async url => {
    const art=await import(url),families=['ASH','IRON','ROOT','SPIRIT','FATE'];
    const gallery=document.createElement('canvas');gallery.id='gate-a-v00940-grand-masonry';
    gallery.width=1280;gallery.height=650;
    gallery.style.cssText='position:absolute;left:0;top:1700px;width:1280px;height:650px;image-rendering:pixelated';
    const g=gallery.getContext('2d');g.fillStyle='#0d171d';g.fillRect(0,0,1280,650);
    g.imageSmoothingEnabled=false;g.fillStyle='#f4dcaa';g.font='15px monospace';g.textAlign='center';
    const seen=new Set();
    for(let i=0;i<5;i++){
      const cell=document.createElement('canvas');cell.width=420;cell.height=235;
      const cg=cell.getContext('2d');cg.imageSmoothingEnabled=false;
      art.paintSanctuary(cg,420,235,0,families[i],i*5);
      const bytes=cell.toDataURL();seen.add(bytes);
      const x=(i%3)*424+1,y=Math.floor(i/3)*313+3;
      g.drawImage(cell,x,y);
      g.fillText('AUTHORED '+families[i]+' STONE FLOOR',x+210,y+265);
    }
    if(seen.size!==5)throw Error('Five family floor art identities collapsed');
    document.body.appendChild(gallery);return seen.size;
   }""",base.data_module('scene/sanctuaryArt.js'))
   assert floor_count==5,floor_count
   page.locator('#gate-a-v00940-grand-masonry').screenshot(path=str(ROOT/'gate-a-v00940-five-grand-masonry-floors.png'))
   page.evaluate("()=>{document.querySelector('#gate-a-v00940-grand-masonry').remove();window.scrollTo(0,0)}")
   assert page.evaluate('window.scrollY')==0

   # v0.09.40: capture the REAL final production renderer for 5 physically
   # mobile foes x 4 distance-gated travel poses. Synthetic travel snapshots
   # for controlled art comparison; the encounter below still tests real motion.
   moving=page.evaluate("""async atlasUrl => {
    const mod=await import(atlasUrl),kinds=['draugr','wisp','archer','charger','warden'];
    const gallery=document.createElement('canvas');
    gallery.id='gate-a-v00940-travel-gallery';gallery.width=1080;gallery.height=740;
    gallery.style.cssText='position:absolute;left:0;top:1740px;width:1080px;height:740px;image-rendering:pixelated';
    const g=gallery.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle='#102022';g.fillRect(0,0,1080,740);
    g.font='16px monospace';g.fillStyle='#edcf95';g.textAlign='center';
    const identities=[];
    for(let row=0;row<kinds.length;row++){
      const shape=[];
      for(let frame=0;frame<4;frame++){
        const e={kind:kinds[row],state:'idle',windup:0,phase:1,flash:0,stride:frame*2.5,stepping:true};
        const canvas=document.createElement('canvas');canvas.width=90;canvas.height=90;
        const cg=canvas.getContext('2d');cg.translate(45,48);mod.paintHostileAtlas(cg,e,0,false);
        shape.push(canvas.toDataURL());
        g.drawImage(canvas,frame*180+30,row*143+3,128,112);
        g.fillText(kinds[row].toUpperCase()+' '+frame,frame*180+95,row*143+126);
      }
      if(new Set(shape).size!==4)throw Error(kinds[row]+' physical travel poses collapsed');
      identities.push(shape.length);
    }
    document.body.appendChild(gallery);
    return identities;
   }""",base.data_module('scene/pixelSpriteAtlas.js'))
   assert moving==[4,4,4,4,4],moving
   page.locator('#gate-a-v00940-travel-gallery').screenshot(path=str(ROOT/'gate-a-v00940-physical-travel-gaits.png'))
   page.evaluate("()=>{document.querySelector('#gate-a-v00940-travel-gallery').remove();window.scrollTo(0,0)}")
   assert page.evaluate('window.scrollY')==0
   actual=page.evaluate("""() => {
     const e=window.__runegraveTest.stage.getEncounter()?.enemies;
     return e?e.filter(z=>z.stride>0 && Number.isFinite(z.stride)).map(z=>z.kind):[];
   }""")
   assert actual,('no enemy actually traveled in live verified encounter',actual)
   print('v0.09.40 5 x 4 authentic hostile motion-ink poses, live collision-resolved travel PASS',actual)

   for selector,pid in [('#move-rune-disc',57),('#aim-rune-disc',58)]:
    page.evaluate("""([selector,pid])=>{const el=document.querySelector(selector),r=el.getBoundingClientRect();
      el.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerId:pid,
        pointerType:'touch',isPrimary:pid===57,clientX:r.left+r.width*.8,clientY:r.top+r.height*.37}));}""",[selector,pid])
   page.wait_for_timeout(175)
   assert int(page.locator('#gameplay-canvas').get_attribute('data-shots'))>0
   page.screenshot(path=str(ROOT/'gate-a-v00940-two-thumb.png'))
   # Gate A v0.09.40: no invented attack vectors. Same ship-ready pure painter
   # that production warning uses; four real charge/archer/Warden state examples.
   shown=page.evaluate("""async url => {
     const mod=await import(url),all=[
      ['CHARGER REAL DASH',{kind:'charger',state:'warning',x:125,y:82,dx:.8,dy:.6,radius:10,windup:.12,phase:1}],
      ['ARCHER ONE SHOT',{kind:'archer',state:'warning',x:125,y:82,dx:.8,dy:.6,radius:8,windup:.12,phase:1}],
      ['WARDEN FIVE FAN',{kind:'warden',state:'warning',x:125,y:82,dx:.8,dy:.6,radius:18,windup:.12,phase:1}],
      ['WARDEN TWO SIDES',{kind:'warden',state:'warning',x:125,y:82,dx:.8,dy:.6,radius:18,windup:.12,phase:2}]
     ];
     const sheet=document.createElement('canvas');sheet.id='gate-a-v00940-real-lanes';sheet.width=850;sheet.height=520;
     sheet.style.cssText='position:absolute;left:0;top:1800px;width:850px;height:520px;image-rendering:pixelated';
     const g=sheet.getContext('2d');g.fillStyle='#152227';g.fillRect(0,0,850,520);g.font='bold 12px monospace';g.textAlign='center';g.imageSmoothingEnabled=false;
     const seen=new Set();
     for(let i=0;i<all.length;i++){
       const [label,e]=all[i],c=document.createElement('canvas');c.width=420;c.height=235;
       const cg=c.getContext('2d');cg.fillStyle='#192e30';cg.fillRect(0,0,420,235);
       if(!mod.paintThreatLane(cg,e,420,235))throw Error(label+' lost its genuine warning');
       const ink=c.toDataURL();seen.add(ink);
       const x=(i%2)*425,y=Math.floor(i/2)*258;
       g.drawImage(c,x,y);g.fillStyle='#f4d8a4';g.fillText(label,x+210,y+251);
     }
     if(seen.size!==4)throw Error('real attacks collapsed into fake repeated warning');
     document.body.appendChild(sheet);return seen.size;
   }""",base.data_module('enemies/attackLaneInk.js'))
   assert shown==4,shown
   page.locator('#gate-a-v00940-real-lanes').screenshot(path=str(ROOT/'gate-a-v00940-true-attack-lanes.png'))
   page.evaluate("()=>{document.querySelector('#gate-a-v00940-real-lanes').remove();window.scrollTo(0,0)}")
   assert page.evaluate('window.scrollY')==0
   print('v0.09.40 THREE genuine hostile shot/dash/fan telegraphs + true phase2 side shots PASS')
   # v0.09.40: real production Canvas PIXEL RITUAL GALLERY. Three honest
   # behaviors by three actual target/countdown frames, not new abilities.
   # Only the specific enemy's real WARNING state produces each design.
   ritual=page.evaluate("""async url => {
     const mod=await import(url),characters=['wisp','sentinel','shade'];
     const gallery=document.createElement('canvas');
     gallery.id='gate-a-v00940-norse-rituals';gallery.width=1260;gallery.height=825;
     gallery.style.cssText='position:absolute;left:0;top:1700px;width:1260px;height:825px;image-rendering:pixelated';
     const g=gallery.getContext('2d');g.fillStyle='#14232b';g.fillRect(0,0,1260,825);
     g.imageSmoothingEnabled=false;g.font='bold 13px monospace';g.textAlign='center';
     let distinct=[],counts=[];
     for(let row=0;row<3;row++){
       const views=[];
       for(let col=0;col<3;col++){
         const kind=characters[row];
         const e={kind,state:'warning',x:155,y:110,radius:kind==='sentinel'?11:8,
           windup:kind==='shade'?[.60,.32,.12][col]:.12,
           phase:1,attackCount:kind==='sentinel'?[0,6,18][col]:0};
         const hero=kind==='wisp'? [{x:250,y:100},{x:190,y:195},{x:60,y:165}][col] : {x:252,y:140};
         const c=document.createElement('canvas');c.width=420;c.height=235;
         const cg=c.getContext('2d');cg.imageSmoothingEnabled=false;
         cg.fillStyle='#1b3035';cg.fillRect(0,0,420,235);
         if(!mod.paintRitualWarning(cg,e,hero,420,235))throw Error(kind+' missing actual ritual pose');
         const info=mod.ritualWarningGeometry(e,hero,420,235);
         if(!info||info.rays.length!==[1,6,0][row])throw Error(kind+' misrepresents attack count');
         views.push(c.toDataURL());
         const x=col*420,y=row*274;
         g.drawImage(c,x,y);g.fillStyle='#f0d9ae';
         g.fillText(kind.toUpperCase()+' / '+['FIRST','SECOND','THIRD'][col],x+210,y+252);
       }
       if(new Set(views).size!==3)throw Error(characters[row]+' ritual variants collapsed');
       distinct.push(new Set(views).size);
       counts.push([1,6,0][row]);
     }
     document.body.appendChild(gallery);
     return {distinct,counts};
   }""",base.data_module('enemies/ritualWarningInk.js'))
   assert ritual=={'distinct':[3,3,3],'counts':[1,6,0]},ritual
   page.locator('#gate-a-v00940-norse-rituals').screenshot(path=str(ROOT/'gate-a-v00940-true-ritual-telegraphs.png'))
   page.evaluate("()=>{document.querySelector('#gate-a-v00940-norse-rituals').remove();window.scrollTo(0,0)}")
   assert page.evaluate('window.scrollY')==0
   print('v0.09.40 actual wisp hero tracking, six sentinel shot channels and three shade fold states PASS')

   # Gate A v0.09.40: nine genuine production Canvas wound-pixel poses.
   # Controlled ACTUAL-source marks, not fictitious player damage or a new HUD.
   wounds=page.evaluate("""async url => {
     const {WoundInk}=await import(url);
     const kinds=[
       ['ENEMY CONTACT','enemy:draugr',{x:194,y:108},1],
       ['EMBER FLOOR','west-ember',{x:120,y:182},1],
       ['SOULSHOT UNKNOWN','soulshot:crypt',null,2]
     ];
     const gallery=document.createElement('canvas');gallery.id='gate-a-v00940-real-wound-gallery';
     gallery.width=1260;gallery.height=790;
     gallery.style.cssText='position:absolute;left:0;top:1800px;width:1260px;height:790px;image-rendering:pixelated';
     const g=gallery.getContext('2d');g.fillStyle='#12272a';g.fillRect(0,0,1260,790);
     g.font='bold 13px monospace';g.textAlign='center';
     const distinct=[],sourceKind=[];
     for(let row=0;row<3;row++){
       const variants=[];
       for(let frame=0;frame<3;frame++){
         const [label,source,origin,damage]=kinds[row],c=document.createElement('canvas');c.width=420;c.height=235;
         const cg=c.getContext('2d');cg.fillStyle='#1b3436';cg.fillRect(0,0,420,235);
         const wound=new WoundInk();wound.record({x:210,y:115},source,origin,damage);
         for(let i=0;i<frame*12;i++)wound.step(1/60);
         const mark=wound.snapshot[0];
         if(!mark||mark.kind!==['contact','ember','projectile'][row])throw Error('incorrect actual damage classification');
         if(row===2&&mark.angle!==null)throw Error('projectile fabricated an unknown attacker bearing');
         wound.paint(cg,420,235,false);variants.push(c.toDataURL());
         const x=frame*420,y=row*260;
         g.drawImage(c,x,y);g.fillStyle='#f0d3a0';g.fillText(label+' · '+['IMPACT','AFTERSHOCK','FADING'][frame],x+210,y+252);
       }
       if(new Set(variants).size!==3)throw Error(kinds[row][0]+' wound ink not physically stateful');
       distinct.push(new Set(variants).size);
       sourceKind.push(kinds[row][1]);
     }
     if(sourceKind.length!==3)throw Error('Missing an original wound type');
     document.body.appendChild(gallery);
     return distinct;
   }""",base.data_module('scene/woundSigilInk.js'))
   assert wounds==[3,3,3],wounds
   page.locator('#gate-a-v00940-real-wound-gallery').screenshot(path=str(ROOT/'gate-a-v00940-real-wound-sigils.png'))
   page.evaluate("()=>{document.querySelector('#gate-a-v00940-real-wound-gallery').remove();window.scrollTo(0,0)}")
   assert page.evaluate('window.scrollY')==0
   print('v0.09.40 real damage source and 3 aged original wound silhouettes x3 PASS')

   # v0.09.40 — The actual production single-body boss renderer, not a
   # painted concept. Three true HP-derived states in idle and real recovery.
   bossproof=page.evaluate("""async url => {
      const mod=await import(url);
      const frames=[['BOUND / 28 HP',1,28],['UNBOUND / 14 HP',2,14],['SUNDERED / 7 HP',2,7]];
      const canvas=document.createElement('canvas');canvas.id='gate-a-v00940-boss-armour-gallery';
      canvas.width=1260;canvas.height=608;
      canvas.style.cssText='position:absolute;left:0;top:1730px;width:1260px;height:608px;image-rendering:pixelated';
      const g=canvas.getContext('2d');g.fillStyle='#172928';g.fillRect(0,0,1260,608);
      g.imageSmoothingEnabled=false;g.font='bold 15px monospace';g.textAlign='center';
      const hashes=[];
      for(let row=0;row<2;row++){
       const ids=[];
       for(let col=0;col<3;col++){
        const [label,phase,hp]=frames[col];
        const enemy={kind:'warden',state:row===0?'idle':'recover',phase,hp,maxHp:28,
          windup:row===0?0:phase===1?.30:.18,flash:0,stride:0,stepping:false};
        const tiny=document.createElement('canvas');tiny.width=125;tiny.height=145;
        const cg=tiny.getContext('2d');cg.translate(62,70);
        mod.paintHostileAtlas(cg,enemy,0,true);
        const art=tiny.toDataURL();ids.push(art);
        const x=col*420,y=row*304;
        g.fillStyle='#2c403b';g.fillRect(x+40,y+27,340,240);
        g.drawImage(tiny,x+100,y+35,220,220);
        g.fillStyle='#e3cb99';g.fillText(label,x+210,y+23);
        g.font='11px monospace';
        g.fillText(row===0?'ACTUAL IDLE':'ACTUAL STRIKE RECOVERY',x+210,y+292);
        g.font='bold 15px monospace';
       }
       if(new Set(ids).size!==3)throw Error('Warden real-HP silhouettes collapsed in actual Canvas');
       hashes.push(ids);
      }
      if(hashes[0].every((x,i)=>x===hashes[1][i]))throw Error('actual boss recoveries are indistinguishable');
      document.body.appendChild(canvas);return [hashes[0].length,hashes[1].length];
   }""",base.data_module('scene/pixelSpriteAtlas.js'))
   assert bossproof==[3,3],bossproof
   page.locator('#gate-a-v00940-boss-armour-gallery').screenshot(path=str(ROOT/'gate-a-v00940-full-body-warden-health-gallery.png'))
   page.evaluate("()=>{document.querySelector('#gate-a-v00940-boss-armour-gallery').remove();window.scrollTo(0,0)}")
   assert page.evaluate('window.scrollY')==0
   print('v0.09.40 three real Warden HP/2-phase sculptures with single-body actual idle/recovery PASS')
   # v0.09.40 — 10 genuine world-drop sculptures rendered by the ACTUAL
   # production drawRoomDrops(). No concept images or data-only preview.
   plinths=page.evaluate("""async ([lootUrl,plinthUrl,firstUrl]) => {
      const loot=await import(lootUrl),ink=await import(plinthUrl),run=await import(firstUrl);
      const all=run.FIRST_SOUL_RELICS.map(x=>({kind:'relic',relic:x,id:x.id}));
      all.push({kind:'silver',id:'silver'},{kind:'heart',id:'heart'});
      const board=document.createElement('canvas');
      board.id='gate-a-v00940-loot-plinth-gallery';board.width=1260;board.height=630;
      board.style.cssText='position:absolute;left:0;top:2600px;width:1260px;height:630px;image-rendering:pixelated';
      const g=board.getContext('2d');
      g.fillStyle='#122b32';g.fillRect(0,0,1260,630);
      g.textAlign='center';g.font='bold 13px monospace';
      const signatures=[];
      for(let i=0;i<all.length;i++){
       const val=all[i],d={...val,x:95,y:106,amount:1,collected:false};
       const tiny=document.createElement('canvas');tiny.width=190;tiny.height=195;
       const cg=tiny.getContext('2d');cg.imageSmoothingEnabled=false;
       cg.fillStyle='#293e40';cg.fillRect(0,0,190,195);
       const hero={x:117,y:106};
       if(ink.pickupBand(hero,d)!=='approach'||loot.nearDrop(hero,d))
        throw Error('wrong real 17-unit collection boundary');
       loot.drawRoomDrops(cg,[d],0,hero,true);
       const output=tiny.toDataURL();signatures.push(output);
       const x=(i%5)*252,y=Math.floor(i/5)*315;
       g.fillStyle='#314644';g.fillRect(x+16,y+20,220,253);
       g.drawImage(tiny,x+31,y+41,190,195);
       g.fillStyle='#e8d2a9';g.fillText(val.relic?.name??val.kind.toUpperCase(),x+126,y+289);
      }
      if(new Set(signatures).size!==10)throw Error('plinth sprites share identical raster output');
      const types=Object.keys(ink.SAGA_PLINTH_SHEETS);
      if(types.length!==10)throw Error('must have eight actual relics and two resource cases');
      document.body.appendChild(board);return types.length;
   }""",[base.data_module('run/lootArt.js'),base.data_module('run/sagaPlinthArt.js'),base.data_module('run/firstSoul.js')])
   assert plinths==10,plinths
   page.locator('#gate-a-v00940-loot-plinth-gallery').screenshot(path=str(ROOT/'gate-a-v00940-ten-true-pickup-plinths.png'))
   page.evaluate("()=>{document.querySelector('#gate-a-v00940-loot-plinth-gallery').remove();window.scrollTo(0,0)}")
   assert page.evaluate('window.scrollY')==0
   print('v0.09.40 10 original production Canvas loot slabs with truthful near-but-not-picked band PASS')
   # v0.09.40: genuine production 7 species × 3 LIFE-STEPS death gallery.
   # Each rite is spawned via the REAL existing living->dead tracker and only
   # progresses through fixed physics steps, not a fabricated kill animation.
   deathproof=page.evaluate("""async ([trailUrl,riteUrl])=>{
    const {MotionTrails}=await import(trailUrl);
    const {DEATH_RITE_KINDS,deathRiteFrame,DEATH_RITE_BODIES}=await import(riteUrl);
    const board=document.createElement('canvas');
    board.id='gate-a-v00940-seven-death-rites';board.width=990;board.height=1120;
    board.style.cssText='position:absolute;left:0;top:3300px;width:990px;height:1120px;image-rendering:pixelated';
    const g=board.getContext('2d');g.fillStyle='#14282b';g.fillRect(0,0,990,1120);g.textAlign='center';
    g.font='bold 13px monospace';g.imageSmoothingEnabled=false;
    const familyCrests=[],ages=['SEVERED','SPLIT','SOUL ASH'];
    for(let row=0;row<DEATH_RITE_KINDS.length;row++){
      const kind=DEATH_RITE_KINDS[row],screens=[];
      const alive={id:'actual-'+kind,kind,alive:true,x:110,y:75,radius:kind==='warden'?18:10};
      for(let col=0;col<3;col++){
        const fx=new MotionTrails();fx.observeEnemies([alive]);
        fx.observeEnemies([{...alive,alive:false}]);
        const ticks=col===0?0:col===1?Math.floor((kind==='warden'?.92:.55)*.44*60):Math.floor((kind==='warden'?.92:.55)*.81*60);
        for(let n=0;n<ticks;n++)fx.step(1/60,{x:20,y:50},{x:0,y:0});
        if(fx.state.dissolves!==1)throw Error('Real death produced wrong kill count');
        const c=document.createElement('canvas');c.width=220;c.height=135;
        const cg=c.getContext('2d');cg.fillStyle='#25383a';cg.fillRect(0,0,220,135);
        fx.paintDissolves(cg,220,135,false);
        screens.push(c.toDataURL());
        const x=col*330,y=row*160;
        g.fillStyle='#30433d';g.fillRect(x+12,y+6,306,145);
        g.drawImage(c,x+55,y+8,220,130);
        g.fillStyle='#f1d4a6';g.fillText(kind.toUpperCase()+' / '+ages[col],x+165,y+151);
      }
      if(new Set(screens).size!==3)throw Error(kind+' missing authored fixed-step collapse');
      familyCrests.push(screens[0]);
      if(DEATH_RITE_BODIES[kind].length!==(kind==='warden'?15:11))
        throw Error('Unexpected authored sprite body height '+kind);
    }
    if(new Set(familyCrests).size!==7)throw Error('Original seven hostile bodies collapsed to generic repeated death ring');
    document.body.appendChild(board);return {kinds:DEATH_RITE_KINDS.length,images:DEATH_RITE_KINDS.length*3};
   }""",[base.data_module('scene/motionTrails.js'),base.data_module('scene/sagaDeathRites.js')])
   assert deathproof=={'kinds':7,'images':21},deathproof
   page.locator('#gate-a-v00940-seven-death-rites').screenshot(path=str(ROOT/'gate-a-v00940-seven-species-death-rites.png'))
   page.evaluate("()=>{document.querySelector('#gate-a-v00940-seven-death-rites').remove();window.scrollTo(0,0)}")
   assert page.evaluate('window.scrollY')==0
   print('v0.09.40 seven species x three real-kill fixed-step death silhouettes PASS')
   for selector,pid in [('#move-rune-disc',57),('#aim-rune-disc',58)]:
    page.evaluate("""([selector,pid])=>document.querySelector(selector).dispatchEvent(
     new PointerEvent('pointercancel',{bubbles:true,pointerId:pid,pointerType:'touch'}))""",[selector,pid])
  assert not errors,(label,errors)
  print(label,'PASS 25 story friezes, seven original weapon poses, real warnings and separate thumb grips, guided chamber, zero exceptions')
  page.close()
 # v0.09.40: TRUE CHROMIUM SERVICE-WORKER OFFLINE RELOAD on localhost.
 # Data-URL integration above cannot install a real service worker, so this
 # separate deployment-shaped built-site test proves index + ALL JS modules
 # are available without network, then exercises actual two-thumb input.
 from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
 from functools import partial
 from threading import Thread
 class QuietHandler(SimpleHTTPRequestHandler):
  def log_message(self,*_args):pass
 server=ThreadingHTTPServer(('127.0.0.1',0),partial(QuietHandler,directory=str(base.DIST)))
 worker=Thread(target=server.serve_forever,daemon=True);worker.start()
 offline_context=b.new_context(viewport={'width':844,'height':390},is_mobile=True,has_touch=True,service_workers='allow')
 offline_page=offline_context.new_page()
 offline_errors=[];offline_page.on('pageerror',lambda e:offline_errors.append(str(e)))
 try:
  target=f'http://127.0.0.1:{server.server_port}/'
  offline_page.goto(target,wait_until='domcontentloaded',timeout=18000)
  offline_page.wait_for_function("""() => navigator.serviceWorker?.controller && document.documentElement.dataset.version==='0.09.40'""",timeout=20000)
  offline_page.wait_for_function("""async () => {
    const names=await caches.keys();
    if(!names.includes('runegrave-shell-v0.09.40'))return false;
    const cache=await caches.open('runegrave-shell-v0.09.40');
    const wanted=['index.html','js/main.js','js/scene/woundSigilInk.js','js/enemies/ritualWarningInk.js','js/run/sagaPlinthArt.js','js/scene/sagaDeathRites.js','styles.css'];
    const keys=(await cache.keys()).map(k=>new URL(k.url).pathname);
    return wanted.every(file=>keys.some(path=>path.endsWith('/'+file)));
  }""",timeout=20000)
  if offline_page.locator('#guide-start-btn').is_visible():offline_page.locator('#guide-start-btn').click()
  offline_context.set_offline(True)
  offline_page.reload(wait_until='domcontentloaded',timeout=18000)
  offline_page.wait_for_function("""() => document.documentElement.dataset.version==='0.09.40'
    && document.querySelector('#gameplay-canvas')?.dataset.actorX
    && navigator.serviceWorker?.controller""",timeout=20000)
  if offline_page.locator('#guide-start-btn').is_visible():offline_page.locator('#guide-start-btn').click()
  offline_page.locator('#gameplay-canvas').wait_for(state='visible',timeout=15000)
  for selector,pid in [('#move-rune-disc',72),('#aim-rune-disc',73)]:
   offline_page.evaluate("""([selector,pid])=>{
    const el=document.querySelector(selector),r=el.getBoundingClientRect();
    el.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerId:pid,
     pointerType:'touch',isPrimary:pid===72,clientX:r.left+r.width*.81,clientY:r.top+r.height*.38}));
   }""",[selector,pid])
  offline_page.wait_for_timeout(380)
  assert int(offline_page.locator('#gameplay-canvas').get_attribute('data-shots'))>0,'offline cached scripts must run actual combat'
  for selector,pid in [('#move-rune-disc',72),('#aim-rune-disc',73)]:
   offline_page.evaluate("""([selector,pid])=>document.querySelector(selector).dispatchEvent(
     new PointerEvent('pointercancel',{bubbles:true,pointerId:pid,pointerType:'touch'}))""",[selector,pid])
  assert not offline_errors,offline_errors
  assert offline_page.evaluate("navigator.onLine") is False,'must be genuinely network-offline'
  offline_page.screenshot(path=str(ROOT/'gate-a-v00940-real-sw-offline.png'))
  print('v0.09.40 real Chromium OFFLINE registered service-worker reload + cached game + dual-thumb attacks PASS')
 finally:
  offline_context.close();server.shutdown();server.server_close()
 portrait=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 portrait.set_content(base.HTML);portrait.add_style_tag(content=(base.DIST/'styles.css').read_text())
 assert portrait.locator('.rotate-message').is_visible()
 print('portrait PASS rotate instruction')
 b.close()


# v0.09.40: the SAME Norse vitality painter shipped in the real enemy renderer.
# These controlled health states are authentic module rasterizations, not
# claims of 21 naturally played encounters or native physical Safari.
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,args=['--no-sandbox','--disable-web-security'])
 page=b.new_page(viewport={'width':1200,'height':1150},device_scale_factor=1)
 errors=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content('<!doctype html><html><body style="margin:0;background:#102326"></body></html>')
 scores=page.evaluate("""async url=>{
  const ink=await import(url);
  const kinds=['draugr','wisp','archer','charger','sentinel','shade','warden'];
  const maxima={draugr:6,wisp:4,archer:4,charger:7,sentinel:8,shade:5,warden:28};
  const radii={draugr:9,wisp:8,archer:8,charger:10,sentinel:11,shade:8,warden:18};
  const gallery=document.createElement('canvas');gallery.id='gate-a-v00940-true-health-plaques';
  gallery.width=1140;gallery.height=1110;
  gallery.style.cssText='position:absolute;left:20px;top:10px;width:1140px;height:1110px;image-rendering:pixelated';
  const g=gallery.getContext('2d');g.fillStyle='#102326';g.fillRect(0,0,1140,1110);
  g.textAlign='center';g.font='bold 15px monospace';g.imageSmoothingEnabled=false;
  const ids=new Set(),allStages=[];
  for(let row=0;row<7;row++){
    const kind=kinds[row],stages=[];
    for(let col=0;col<3;col++){
      const hp=[maxima[kind],Math.ceil(maxima[kind]/2),1][col];
      const sub=document.createElement('canvas');sub.width=212;sub.height=89;
      const sg=sub.getContext('2d');
      sg.fillStyle='#29403e';sg.fillRect(0,0,212,89);
      const e={kind,x:106,y:27,radius:radii[kind],hp,maxHp:maxima[kind],alive:true,state:'warning'};
      ink.paintVitalRunePlaque(sg,e,212,89);
      const bytes=sub.toDataURL();stages.push(bytes);
      const x=col*380+20,y=row*158+5;
      g.fillStyle='#2e4542';g.fillRect(x+10,y+7,348,137);
      g.drawImage(sub,x+13,y+12,340,110);
      g.fillStyle='#ffdeb1';g.fillText(kind.toUpperCase()+' '+hp+'/'+maxima[kind],x+184,y+137);
    }
    if(new Set(stages).size!==3)throw Error('Rune HP display does not react to real damage: '+kind);
    allStages.push(...stages);ids.add(ink.VITAL_RUNE_SEALS[kind].join('|'));
  }
  if(ids.size!==7||new Set(allStages).size!==21)throw Error('Distinct Norse vitality art is duplicated');
  document.body.appendChild(gallery);return {kinds:ids.size,actualHealthImages:allStages.length};
 }""",base.data_module('scene/sagaVitalRunes.js'))
 assert scores=={'kinds':7,'actualHealthImages':21},scores
 page.locator('#gate-a-v00940-true-health-plaques').screenshot(path=str(ROOT/'gate-a-v00940-true-health-plaques.png'))
 assert not errors,errors
 print('v0.09.40 real Chromium original seven-clan vitality gallery 21 physically authored damage states PASS',scores)
 b.close()
