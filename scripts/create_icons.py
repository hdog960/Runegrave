from PIL import Image,ImageDraw,ImageFont,ImageFilter
from math import sin,cos,pi
from pathlib import Path
out=Path(__file__).resolve().parent.parent/'public'/'icons';out.mkdir(exist_ok=True,parents=True)
N=1024
im=Image.new('RGB',(N,N),(10,22,25));d=ImageDraw.Draw(im)
# deep carved-stone field, original palette
for y in range(N):
    t=abs(y-N*.48)/N
    col=(int(14+15*(1-t)), int(27+13*(1-t)),int(31+13*(1-t)))
    d.line((0,y,N,y),fill=col)
# etched shield framing
p=[(512,70),(832,132),(904,279),(872,680),(754,875),(512,964),(270,875),(152,680),(120,279),(192,132)]
d.polygon(p, fill=(35,49,49),outline=(200,163,94),width=22)
q=[(512,110),(795,168),(864,297),(831,654),(715,832),(512,915),(309,832),(193,654),(160,297),(229,168)]
d.line(q+[q[0]],fill=(89,74,52),width=22,joint='curve')
d.line(q+[q[0]],fill=(191,160,96),width=5,joint='curve')
# moon halo
for r,width in [(250,9),(219,5),(187,3)]:
 d.arc((512-r,493-r,512+r,493+r),45,340,fill=(157,197,170) if r==250 else (117,139,117),width=width)
for n in range(16):
 a=(n*2*pi/16)-pi/2;x=512+252*cos(a);y=493+252*sin(a)
 d.ellipse((x-8,y-8,x+8,y+8),fill=(218,183,104))
# tree roots trunk
for xy,sw,col in [([(512,690),(512,550),(515,404),(493,316)],58,(22,33,34)), ([(512,690),(512,550),(515,404),(493,316)],37,(185,157,100)), ([(509,690),(499,540),(500,396),(487,313)],9,(224,193,124))]:d.line(xy,fill=col,width=sw,joint='curve')
branches=[([(510,435),(434,357),(345,324),(293,257)],26), ([(514,447),(589,362),(677,322),(728,260)],29), ([(512,393),(435,301),(427,226)],19), ([(505,395),(570,296),(615,216)],21), ([(515,460),(644,425),(748,415)],22), ([(515,464),(399,425),(270,399)],22)]
for pts,w in branches:
 d.line(pts,fill=(207,166,103),width=w,joint='curve')
 d.line(pts,fill=(111,86,60),width=max(4,w//4),joint='curve')
# interleaved lower roots
roots=[([(510,690),(436,741),(326,792)],32), ([(512,690),(585,752),(704,789)],31), ([(509,700),(489,779),(433,843)],23), ([(515,696),(544,785),(593,833)],24), ([(512,700),(512,835)],15)]
for pts,w in roots:d.line(pts,fill=(178,139,84),width=w,joint='curve')
# leaves as small luminous teal diamonds
for x,y in [(313,244),(333,288),(367,304),(397,264),(427,213),(613,211),(655,250),(700,266),(741,236),(718,408),(747,391),(297,391),(256,366)]:
 d.polygon([(x,y-14),(x+11,y),(x,y+14),(x-11,y)],fill=(86,176,168),outline=(205,217,152),width=2)
# carved runes lower inset
try:
 font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',66)
 d.text((512,813),'ᚱ   ᛟ   ᚷ',font=font,fill=(220,187,115),anchor='mm',stroke_width=0)
except Exception:pass
# subtle glint overlay
for cx,cy in [(282,230),(728,249),(482,320)]:d.ellipse((cx-4,cy-4,cx+4,cy+4),fill=(245,212,143))
for size in (180,192,512):
 icon=im.resize((size,size),Image.Resampling.LANCZOS)
 icon.quantize(colors=96,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE).save(out/f'runegrave-{size}.png',optimize=True)
print('Generated 180, 192, 512 square original Runegrave icons.')
