"""Gate A visual/performance browser audit using an in-memory compiled build.
NOT physical iPhone, HTTPS service-worker, or a natural unaided player victory.
"""
from pathlib import Path
import base64,re
from functools import lru_cache
from posixpath import normpath
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent.parent
DIST=ROOT/'dist'
@lru_cache(maxsize=None)
def data_module(path):
    src=(DIST/'js'/path).read_text()
    def replace(m):
        target=normpath(str(Path(path).parent/m.group(2)))
        return m.group(1)+data_module(target)+m.group(3)
    src=re.sub(r'''(from\s+['"])(\.{1,2}/[^'"\n]+)(['"])''',replace,src)
    if path=='scene/stage.js':
        src=src.replace('getActor: () => ({','testJump: (point) => {actor={...point};},\n        getActor: () => ({')
    if path=='main.js':src+='\nwindow.__runegraveTest={stage,controls};\n'
    return 'data:text/javascript;base64,'+base64.b64encode(src.encode()).decode()
HTML=re.sub(r'<script[^>]+src="\./js/main\.js"[^>]*></script>','',(DIST/'index.html').read_text())
HTML=re.sub(r'<link[^>]+(?:stylesheet|manifest|icon)[^>]*>','',HTML)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--disable-web-security'])
    for label,w,h in [('small',667,375),('regular',844,390),('plus',932,430)]:
        page=b.new_page(viewport={'width':w,'height':h},is_mobile=True,has_touch=True,device_scale_factor=2)
        errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        page.set_content(HTML);page.add_style_tag(content=(DIST/'styles.css').read_text());page.add_script_tag(type='module',content=f'import "{data_module("main.js")}";')
        page.wait_for_timeout(150)
        assert page.locator('#guide-overlay').is_visible(),label
        page.locator('#guide-start-btn').click()
        page.wait_for_timeout(120)
        page.evaluate('''() => {
          window.__polish={heart:0,footer:0,canvasAttrs:0};
          new MutationObserver(m=>window.__polish.heart+=m.length).observe(document.querySelector('[data-heart-icons]'),{childList:true,subtree:true,characterData:true});
          new MutationObserver(m=>window.__polish.footer+=m.length).observe(document.querySelector('[data-run-status]'),{childList:true,subtree:true,characterData:true});
          new MutationObserver(m=>window.__polish.canvasAttrs+=m.length).observe(document.querySelector('#gameplay-canvas'),{attributes:true});
        }''')
        page.wait_for_timeout(650)
        stats=page.evaluate('window.__polish')
        assert stats['heart']==0,(label,'static hearts should not be recreated each tick',stats)
        assert stats['footer']==0,(label,'static objective should not be redrawn each tick',stats)
        assert stats['canvasAttrs']<190,(label,'too many canvas dataset mutations under 650ms idle',stats)
        page.locator('#pause-btn').click()
        page.locator('#threat-guide summary').click()
        assert page.locator('#threat-guide li').count()==7
        assert page.locator('#threat-guide').get_attribute('open') is not None
        page.locator('#resume-btn').click(force=True);page.wait_for_timeout(100)
        assert page.locator('#pause-overlay').is_hidden()
        # Physically enter crypt via the legal eastern practice gate; no script-injected kills.
        xy=page.evaluate('''() => {const c=document.querySelector('#gameplay-canvas');return [+c.dataset.exitX,+c.dataset.exitY]}''')
        page.evaluate('''xy=>window.__runegraveTest.stage.testJump({x:xy[0],y:xy[1]})''',xy)
        page.wait_for_timeout(250)
        state=page.evaluate('''() => ({room:document.querySelector('#gameplay-canvas').dataset.room, family:window.__runegraveTest.stage.getRoute()[0].family,version:document.documentElement.dataset.version})''')
        assert state['room']=='crypt' and state['version']=='0.09.11',state
        if label=='regular':
            page.screenshot(path=str(ROOT/'gate-a-v0094-chamber.png'))
            # Only the QA browser may alter an enemy's warn state for an exact art
            # frame. This does NOT alter the real game or prove a combat victory.
            page.evaluate('''() => {
              const enemy=window.__runegraveTest.stage.getEncounter().enemies[0];
              enemy.kind='charger';enemy.state='warning';enemy.windup=.23;
              enemy.dx=.92;enemy.dy=.39;enemy.cooldown=1;
            }''')
            page.wait_for_timeout(55)
            page.screenshot(path=str(ROOT/'gate-a-v0094-telegraph.png'))
        assert not errors,(label,errors)
        print(label,'PASS',state,'idle DOM mutations',stats,'threat guide + real gate transition')
        page.close()
    b.close()
