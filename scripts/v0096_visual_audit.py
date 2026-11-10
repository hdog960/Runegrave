"""Visual QA only: screenshots compare eight original relic emblems in one test room.
Uses test-injected chamber completion; no gameplay balance or production source edits.
"""
from pathlib import Path
import base64,re
from functools import lru_cache
from posixpath import normpath
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
ROOT=Path(__file__).resolve().parent.parent
DIST=ROOT/'dist'
@lru_cache(maxsize=None)
def data_module(path):
    src=(DIST/'js'/path).read_text()
    def repl(m):
        target=normpath(str(Path(path).parent/m.group(2)))
        return m.group(1)+data_module(target)+m.group(3)
    src=re.sub(r'''(from\s+['"])(\.{1,2}/[^'"\n]+)(['"])''',repl,src)
    if path=='scene/stage.js':
        src=src.replace('getDrops: () => drops.map', '''testJump: (p) => {actor={...p};},
          testRelic: (idx) => {const r=drops.find(d=>d.kind==='relic'&&!d.collected); if(r)r.relic=FIRST_SOUL_RELICS[idx];},
          getDrops: () => drops.map''')
    if path=='main.js':src+='\nwindow.__runegraveTest={stage,controls};\n'
    return 'data:text/javascript;base64,'+base64.b64encode(src.encode()).decode()
HTML=re.sub(r'<script[^>]+src="\./js/main\.js"[^>]*></script>','',(DIST/'index.html').read_text())
HTML=re.sub(r'<link[^>]+(?:stylesheet|manifest|icon)[^>]*>','',HTML)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-web-security'])
    page=b.new_page(viewport={'width':844,'height':390},is_mobile=True,has_touch=True,device_scale_factor=2)
    errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
    page.set_content(HTML);page.add_style_tag(content=(DIST/'styles.css').read_text())
    page.add_script_tag(type='module',content=f'import "{data_module("main.js")}";')
    page.locator('#guide-start-btn').click();page.wait_for_timeout(150)
    xy=page.evaluate('''() => {const c=document.querySelector('#gameplay-canvas');return [+c.dataset.exitX,+c.dataset.exitY]}''')
    page.evaluate('''xy=>window.__runegraveTest.stage.testJump({x:xy[0],y:xy[1]})''',xy)
    page.wait_for_timeout(150)
    assert page.locator('#gameplay-canvas').get_attribute('data-room')=='crypt'
    for _ in range(3):
        if page.locator('#gameplay-canvas').get_attribute('data-room-phase')=='gate':break
        page.evaluate('''() => {const e=window.__runegraveTest.stage.getEncounter();for(const enemy of [...e.enemies])if(enemy.alive)for(let i=0;i<40&&enemy.alive;i++)e.hitAt(enemy,3,5,{x:0,y:0});}''')
        page.wait_for_timeout(100)
    assert page.locator('#gameplay-canvas').get_attribute('data-room-phase')=='gate'
    names=['WYRD FANG','SKALD DRUM','STORM FEATHER','HUGIN LENS','ASH ANCHOR','SHIELDROOT','EIR THREAD','RAVEN HOARD']
    imgs=[]
    for i,name in enumerate(names):
        page.evaluate('''index=>window.__runegraveTest.stage.testRelic(index)''',i)
        page.wait_for_timeout(75)
        image_path=ROOT/f'gate-a-v0096-relic-{i+1}.png'
        page.locator('#world-frame').screenshot(path=str(image_path))
        img=Image.open(image_path).convert('RGB');img.thumbnail((400,225))
        panel=Image.new('RGB',(420,258),'#101f20');panel.paste(img,((420-img.width)//2,25))
        ImageDraw.Draw(panel).text((12,7),name,fill='#f0d2a2')
        imgs.append(panel)
    sheet=Image.new('RGB',(420*4,258*2),'#0a1719')
    for i,im in enumerate(imgs):sheet.paste(im,((i%4)*420,(i//4)*258))
    out=ROOT/'gate-a-v0096-eight-relic-forms.png';sheet.save(out,optimize=True)
    assert not errs,errs
    print('8 distinct in-game collectible art frames rendered; no JS errors; all collected in one visual comparison',out)
    page.close();b.close()
