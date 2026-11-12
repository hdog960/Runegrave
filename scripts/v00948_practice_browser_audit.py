"""v0.09.48 controlled genuine shipping Canvas inspection of real training-target art.
Two existing non-hostile target kinds x 3 honest HP states, NOT six enemies,
and not proof of native physical-iPhone satisfaction.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import v009_browser_audit as base
ROOT=Path(__file__).resolve().parent.parent
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,args=['--no-sandbox','--disable-web-security'])
 page=b.new_page(viewport={'width':1050,'height':690},device_scale_factor=1)
 errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.set_content('<!doctype html><html><body style="margin:0;background:#101d24"></body></html>')
 proof=page.evaluate("""async ([renderUrl,carvingUrl])=>{
  const [render,art]=await Promise.all([import(renderUrl),import(carvingUrl)]);
  const sheet=document.createElement('canvas');sheet.id='gate-a-v00948-authentic-practice-carvings';
  sheet.width=1040;sheet.height=650;
  sheet.style.cssText='position:absolute;left:4px;top:4px;width:1040px;height:650px;image-rendering:pixelated';
  const g=sheet.getContext('2d');g.imageSmoothingEnabled=false;
  g.fillStyle='#101d24';g.fillRect(0,0,1040,650);
  const imgs=new Set(),types=new Set(),hps=[['INTACT',6],['WOUNDED',5],['CRITICAL',2]];
  for(const [i,kind] of ['effigy','urn'].entries()){
   types.add(art.PRACTICE_CARVINGS[kind].join('|'));
   for(const [j,[label,hp]] of hps.entries()){
    const d={id:'true-training',kind,x:65,y:66,radius:kind==='effigy'?12:10,
      hp,maxHp:6,alive:true,flash:0,respawn:0};
    const c=document.createElement('canvas');c.width=130;c.height=124;
    const cg=c.getContext('2d');cg.fillStyle='#3a4e50';cg.fillRect(0,0,130,124);
    render.drawPracticeTargets(cg,[d],0);
    if(art.practiceCarvingPhase(d.hp,d.maxHp)!==j)throw Error('wrong real HP phase');
    const png=c.toDataURL();if(imgs.has(png))throw Error('unreadable duplicate real practice appearance');
    imgs.add(png);
    const x=j*345+3,y=i*322+4;
    g.fillStyle='#284146';g.fillRect(x,y,333,312);
    g.drawImage(c,x+19,y+12,294,278);
    g.fillStyle='#f2d8a4';g.font='bold 13px monospace';g.textAlign='center';
    g.fillText((kind==='effigy'?'ASH WARD EFFIGY':'OATH URN')+' · '+label,x+166,y+303);
   }
  }
  if(imgs.size!==6||types.size!==2)throw Error('not six true production appearances');
  document.body.appendChild(sheet);
  return {actualTargetKinds:2,genuineHpStates:3,distinctRealProductionImages:6};
 }""",[base.data_module('combat/combatArt.js'),base.data_module('combat/sagaPracticeCarvings.js')])
 assert proof=={'actualTargetKinds':2,'genuineHpStates':3,'distinctRealProductionImages':6},proof
 page.locator('#gate-a-v00948-authentic-practice-carvings').screenshot(path=str(ROOT/'gate-a-v00948-authentic-practice-carvings.png'))
 assert not errors,errors
 print('REAL 2 authored training target kinds x 3 genuinely HP-based original Canvas silhouettes PASS',proof)
 b.close()
