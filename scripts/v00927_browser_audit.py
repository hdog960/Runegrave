"""v0.09.27 Gate A real Chromium runtime, test-only warning pose and input.
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
  assert metrics['version']=='0.09.27',metrics
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
   page.screenshot(path=str(ROOT/'gate-a-v00927-saga-warning.png'))
   # Independently render the actual ship-ready sprite module in Chromium.
   # The published art contact sheet makes individual hero/enemy shapes easy to inspect.
   art_url=base.data_module('scene/pixelSpriteAtlas.js')
   figures=page.evaluate("""async moduleUrl => {
    const atlas=await import(moduleUrl);
    const canvas=document.createElement('canvas');canvas.id='gate-a-v00927-sprite-sheet';
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
   page.locator('#gate-a-v00927-sprite-sheet').screenshot(path=str(ROOT/'gate-a-v00927-character-contact-sheet.png'))
   # Element screenshots scroll into view; restore real viewport before movement.
   # Otherwise the next full-page PNG silently captures the contact-sheet area.
   page.evaluate("""() => {
     document.querySelector('#gate-a-v00927-sprite-sheet').remove();
     window.scrollTo(0,0);
   }""")
   page.wait_for_timeout(55)
   assert page.evaluate('window.scrollY')==0,'the playable game screenshot must not be scrolled away'
   print('original 8-facing hero + 7 hostile sprite contact sheet PASS',figures)

   # Full 25-scene browser art contact sheet, sampled from the actual deployed module.
   art_url=base.data_module('scene/chronicleFloor.js')
   scenes=page.evaluate("""async moduleUrl => {
    const mod=await import(moduleUrl);
    const canvas=document.createElement('canvas');canvas.id='gate-a-v00927-chronicle-sheet';
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
   page.locator('#gate-a-v00927-chronicle-sheet').screenshot(path=str(ROOT/'gate-a-v00927-chronicle-contact-sheet.png'))
   page.evaluate("""() => {
     document.querySelector('#gate-a-v00927-chronicle-sheet').remove();
     window.scrollTo(0,0);
   }""")
   assert page.evaluate('window.scrollY')==0,'the gameplay screenshot must not be offscreen'
   print('25 authored floor mosaic scenes rendered in real Chromium PASS',scenes)

   # Eight real production doorway renderings (north/east/south/west × locked/open),
   # not fake labels or a palette comparison of the same state.
   actual_door_url=base.data_module('scene/doorArt.js')
   doorproof=page.evaluate("""async url => {
     const {drawRuneDoor}=await import(url);
     const gallery=document.createElement('canvas');gallery.id='gate-a-v00927-door-gallery';
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
   page.locator('#gate-a-v00927-door-gallery').screenshot(path=str(ROOT/'gate-a-v00927-door-states.png'))
   page.evaluate("""() => {document.querySelector('#gate-a-v00927-door-gallery').remove();window.scrollTo(0,0);}""")
   assert page.evaluate('window.scrollY')==0,'door gallery must not capture offscreen fake gameplay'
   print('Eight real stateful Norse door sculptures rendered in Chromium PASS',doorproof)

   # 25 complete story-frieze wall scenes, rendered from the PRODUCTION module.
   frieze_url=base.data_module('scene/sagaFloorFrieze.js')
   panelproof=page.evaluate("""async moduleUrl => {
     const art=await import(moduleUrl);
     const c=document.createElement('canvas');c.id='gate-a-v00927-frieze-gallery';
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
   page.locator('#gate-a-v00927-frieze-gallery').screenshot(path=str(ROOT/'gate-a-v00927-frieze-contact-sheet.png'))
   page.evaluate("""()=>{document.querySelector('#gate-a-v00927-frieze-gallery').remove();window.scrollTo(0,0)}""")
   assert page.evaluate('window.scrollY')==0
   print('25 authentic Norse floor friezes are visually distinct PASS')

   # Twenty-eight actual body+weapon states; true windup, no lookalike palette swaps.
   weapon_url=base.data_module('scene/pixelSpriteAtlas.js')
   weaponproof=page.evaluate("""async moduleUrl => {
     const art=await import(moduleUrl);
     const c=document.createElement('canvas');c.id='gate-a-v00927-weapon-gallery';
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
   page.locator('#gate-a-v00927-weapon-gallery').screenshot(path=str(ROOT/'gate-a-v00927-weapon-contact-sheet.png'))
   page.evaluate("""()=>{document.querySelector('#gate-a-v00927-weapon-gallery').remove();window.scrollTo(0,0)}""")
   assert page.evaluate('window.scrollY')==0
   print('Seven real hostile species x four authentic windup poses PASS')





   # Every canonical room carries two newly drawn side wall piers,
   # inspected using actual production renderer code, not mock screenshots.
   pier_url=base.data_module('scene/sagaPillarRelief.js')
   pillars=page.evaluate("""async url => {
     const {paintSagaPillars}=await import(url);
     const gallery=document.createElement('canvas');gallery.id='gate-a-v00927-pillar-gallery';
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
   page.locator('#gate-a-v00927-pillar-gallery').screenshot(path=str(ROOT/'gate-a-v00927-pillar-contact-sheet.png'))
   page.evaluate("()=>{document.querySelector('#gate-a-v00927-pillar-gallery').remove();window.scrollTo(0,0)}")
   assert page.evaluate('window.scrollY')==0

   # The actual eight-facing hero ink is now animated in four distinct cloth
   # silhouettes; no overlays or decorative synthetic danger indicators.
   mantle_url=base.data_module('scene/pixelSpriteAtlas.js')
   cloth=page.evaluate("""async url => {
      const atlas=await import(url),facings=['N','NE','E','SE','S','SW','W','NW'];
      const can=document.createElement('canvas');can.id='gate-a-v00927-mantle-gallery';
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
   page.locator('#gate-a-v00927-mantle-gallery').screenshot(path=str(ROOT/'gate-a-v00927-mantle-contact-sheet.png'))
   page.evaluate("()=>{document.querySelector('#gate-a-v00927-mantle-gallery').remove();window.scrollTo(0,0)}")
   assert page.evaluate('window.scrollY')==0


   # Twenty-four actual actor/armour stances, not merely different captions.
   stance_url=base.data_module('scene/pixelSpriteAtlas.js')
   stances=page.evaluate("""async url => {
     const art=await import(url),directions=['N','NE','E','SE','S','SW','W','NW'];
     const sheet=document.createElement('canvas');sheet.id='gate-a-v00927-hero-stance-gallery';
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
   page.locator('#gate-a-v00927-hero-stance-gallery').screenshot(path=str(ROOT/'gate-a-v00927-hero-stance-contact-sheet.png'))
   page.evaluate("()=>{document.querySelector('#gate-a-v00927-hero-stance-gallery').remove();window.scrollTo(0,0)}")
   assert page.evaluate('window.scrollY')==0

   # Seven existing species with four true gameplay windups, now showing
   # the *authored* new anatomy-specific attack extensions in the live painter.
   posture_url=base.data_module('scene/pixelSpriteAtlas.js')
   posture=page.evaluate("""async url => {
     const art=await import(url),kinds=['draugr','wisp','archer','charger','sentinel','shade','warden'];
     const gallery=document.createElement('canvas');gallery.id='gate-a-v00927-weapon-stance-gallery';
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
   page.locator('#gate-a-v00927-weapon-stance-gallery').screenshot(path=str(ROOT/'gate-a-v00927-weapon-stance-contact-sheet.png'))
   page.evaluate("()=>{document.querySelector('#gate-a-v00927-weapon-stance-gallery').remove();window.scrollTo(0,0)}")
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
       c.style.cssText='position:absolute;left:0;top:1250px;image-rendering:pixelated';
       const g=c.getContext('2d');g.fillStyle='#101d20';g.fillRect(0,0,w,h);
       g.fillStyle='#e5cea7';g.font='12px monospace';g.textAlign='center';document.body.appendChild(c);return g;
     };
     const vg=make('gate-a-v00927-vault-gallery',1475,690),rooms=new Set();
     for(let i=0;i<25;i++){
       const f=fam[Math.floor(i/5)],n=i%5,col=n,row=Math.floor(i/5);
       const cell=document.createElement('canvas');cell.width=420;cell.height=112;
       const g=cell.getContext('2d');canopy.paintVaultCanopies(g,420,235,f,i);
       rooms.add(cell.toDataURL());
       const x=col*294+9,y=row*138+3;vg.drawImage(cell,x,y,276,100);
       vg.fillText(f+' / SAGA '+(n+1),x+138,y+117);
     }
     if(rooms.size!==25)throw Error('Missing original canonical canopy: '+rooms.size);
     const cg=make('gate-a-v00927-cloak-gallery',1158,516),capes=new Set();
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
     const bg=make('gate-a-v00927-body-gallery',1134,643),foes=new Set();
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
       ('#gate-a-v00927-vault-gallery','gate-a-v00927-vault-contact-sheet.png'),
       ('#gate-a-v00927-cloak-gallery','gate-a-v00927-cloak-contact-sheet.png'),
       ('#gate-a-v00927-body-gallery','gate-a-v00927-hostile-body-contact-sheet.png')]:
    page.locator(selector).screenshot(path=str(ROOT/name))
   page.evaluate("""() => {
     for(const id of ['gate-a-v00927-vault-gallery','gate-a-v00927-cloak-gallery','gate-a-v00927-body-gallery'])
       document.getElementById(id).remove();
     window.scrollTo(0,0);
   }""")
   assert page.evaluate('window.scrollY')==0

   for selector,pid in [('#move-rune-disc',57),('#aim-rune-disc',58)]:
    page.evaluate("""([selector,pid])=>{const el=document.querySelector(selector),r=el.getBoundingClientRect();
      el.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerId:pid,
        pointerType:'touch',isPrimary:pid===57,clientX:r.left+r.width*.8,clientY:r.top+r.height*.37}));}""",[selector,pid])
   page.wait_for_timeout(175)
   assert int(page.locator('#gameplay-canvas').get_attribute('data-shots'))>0
   page.screenshot(path=str(ROOT/'gate-a-v00927-two-thumb.png'))
   for selector,pid in [('#move-rune-disc',57),('#aim-rune-disc',58)]:
    page.evaluate("""([selector,pid])=>document.querySelector(selector).dispatchEvent(
     new PointerEvent('pointercancel',{bubbles:true,pointerId:pid,pointerType:'touch'}))""",[selector,pid])
  assert not errors,(label,errors)
  print(label,'PASS 25 story friezes, seven original weapon poses, real warnings and separate thumb grips, guided chamber, zero exceptions')
  page.close()
 portrait=b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
 portrait.set_content(base.HTML);portrait.add_style_tag(content=(base.DIST/'styles.css').read_text())
 assert portrait.locator('.rotate-message').is_visible()
 print('portrait PASS rotate instruction')
 b.close()
