"""Browser review with optional test-only room-family injection; never a player victory.
In-memory Chromium only; not physical iPhone or a real hosted PWA offline test.
"""
from pathlib import Path
import base64,re
from functools import lru_cache
from posixpath import normpath
from playwright.sync_api import sync_playwright
from PIL import Image,ImageOps,ImageDraw
ROOT=Path(__file__).resolve().parent.parent;DIST=ROOT/'dist'
@lru_cache(maxsize=None)
def data_module(path):
    src=(DIST/'js'/path).read_text()
    def repl(m):
        target=normpath(str(Path(path).parent/m.group(2)))
        return m.group(1)+data_module(target)+m.group(3)
    src=re.sub(r'''(from\s+['"])(\.{1,2}/[^'"\n]+)(['"])''',repl,src)
    if path=='scene/stage.js':
        src=src.replace('getActor: () => ({', '''testJump: (p) => {actor={...p};},
          testFamily: (family) => {if(currentRoom)currentRoom={...currentRoom,family};},
          getActor: () => ({''')
    if path=='main.js':src+='\nwindow.__runegraveTest={stage,controls};\n'
    return 'data:text/javascript;base64,'+base64.b64encode(src.encode()).decode()
HTML=re.sub(r'<script[^>]+src="\./js/main\.js"[^>]*></script>','',(DIST/'index.html').read_text())
HTML=re.sub(r'<link[^>]+(?:stylesheet|manifest|icon)[^>]*>','',HTML)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-web-security'])
    page=b.new_page(viewport={'width':844,'height':390},is_mobile=True,has_touch=True,device_scale_factor=2)
    errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.set_content(HTML);page.add_style_tag(content=(DIST/'styles.css').read_text());page.add_script_tag(type='module',content=f'import "{data_module("main.js")}";')
    page.locator('#guide-start-btn').click();page.wait_for_timeout(160)
    # Real pointer event registration and two independent held/centered indicators.
    for sel,i,xx,yy in [('#move-rune-disc',11,.98,.5),('#aim-rune-disc',22,.5,.04)]:
        page.evaluate('''([sel,id,x,y])=>{const e=document.querySelector(sel),r=e.getBoundingClientRect();e.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerId:id,pointerType:'touch',isPrimary:id===11,clientX:r.left+r.width*x,clientY:r.top+r.height*y}));}''',[sel,i,xx,yy])
    page.wait_for_timeout(140)
    state=page.evaluate('''() => [document.querySelector('#move-rune-disc').dataset.directionGlyph,document.querySelector('#aim-rune-disc').dataset.directionGlyph,document.querySelector('#gameplay-canvas').dataset.shots]''')
    assert state[:2]==['→','↑'] and int(state[2])>0,('two-thumb grip directions or aim failed',state)
    for sel,i in [('#move-rune-disc',11),('#aim-rune-disc',22)]:
        page.evaluate('''([sel,id])=>document.querySelector(sel).dispatchEvent(new PointerEvent('pointercancel',{bubbles:true,pointerId:id,pointerType:'touch'}))''',[sel,i])
    state=page.evaluate('''() => [document.querySelector('#move-rune-disc').dataset.directionGlyph,document.querySelector('#aim-rune-disc').dataset.directionGlyph]''')
    assert state==['·','·'],('thumb indicators did not recenter',state)
    target=page.evaluate('''() => {const c=document.querySelector('#gameplay-canvas');return [+c.dataset.exitX,+c.dataset.exitY]}''')
    page.evaluate('''([x,y])=>window.__runegraveTest.stage.testJump({x,y})''',target)
    page.wait_for_timeout(130)
    assert page.evaluate("document.querySelector('#gameplay-canvas').dataset.room")=='crypt'
    crop=page.locator('#world-frame')
    imgs=[]
    for family in ('ASH','IRON','ROOT','SPIRIT','FATE'):
        page.evaluate('''family=>window.__runegraveTest.stage.testFamily(family)''',family)
        page.wait_for_timeout(80)
        out=ROOT/f'gate-a-v0095-{family.lower()}.png'
        crop.screenshot(path=str(out))
        img=Image.open(out).convert('RGB');img.thumbnail((580,350))
        panel=Image.new('RGB',(600,390),'#132321')
        panel.paste(img,((600-img.width)//2,27))
        ImageDraw.Draw(panel).text((16,8),family,fill='#f1d99c')
        imgs.append(panel)
    assert not errors,errors
    sheet=Image.new('RGB',(600*3,390*2),'#0d1719')
    for n,img in enumerate(imgs):sheet.paste(img,((n%3)*600,(n//3)*390))
    sheet.save(ROOT/'gate-a-v0095-five-room-families.png',optimize=True)
    print('five family variants rendered without JS errors; independent dual-stick test PASS; montage saved',state)
    page.close();b.close()
