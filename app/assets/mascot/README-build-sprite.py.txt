import sys, math
from collections import deque
from PIL import Image, ImageDraw, ImageFilter
src = Image.open(sys.argv[1]).convert('RGBA')
out = sys.argv[2]
W = src.size[0]
# --- keep only the largest alpha component (drop floating leaves)
S = 4
small = src.split()[3].resize((W//S, W//S))
w = W//S
px = small.load()
seen = [[False]*w for _ in range(w)]
best = []
for y in range(w):
    for x in range(w):
        if px[x,y] > 40 and not seen[y][x]:
            comp=[]; q=deque([(x,y)]); seen[y][x]=True
            while q:
                cx,cy=q.popleft(); comp.append((cx,cy))
                for nx,ny in ((cx+1,cy),(cx-1,cy),(cx,cy+1),(cx,cy-1)):
                    if 0<=nx<w and 0<=ny<w and not seen[ny][nx] and px[nx,ny]>40:
                        seen[ny][nx]=True; q.append((nx,ny))
            if len(comp)>len(best): best=comp
keep = Image.new('L',(w,w),0); kp=keep.load()
for x,y in best: kp[x,y]=255
keep = keep.filter(ImageFilter.MaxFilter(5)).resize((W,W)).filter(ImageFilter.GaussianBlur(2))
alpha = src.split()[3]
from PIL import ImageChops
src.putalpha(ImageChops.multiply(alpha, keep))
bbox = src.getbbox()
print('body bbox', bbox)

def lid(img, cx, cy, rx, ry, mode, tilt=0):
    """mode: 'half' upper lid, 'closed' full lid + lash, 'happy' ^ arc"""
    d = ImageDraw.Draw(img)
    fur = (246, 226, 205, 255)
    shade = (232, 196, 166, 255)
    lash = (58, 34, 26, 255)
    if mode == 'half':
        d.chord([cx-rx-17, cy-ry-17, cx+rx+17, cy+ry+12], 180, 360, fill=fur)
        d.arc([cx-rx-4, cy-ry*0.25-6, cx+rx+4, cy+ry*0.25+6], 0, 180, fill=lash, width=9)
    else:
        d.ellipse([cx-rx-17, cy-ry-17, cx+rx+17, cy+ry+17], fill=fur)
        d.ellipse([cx-rx-8, cy-ry*0.1, cx+rx+8, cy+ry+12], fill=shade)
        d.ellipse([cx-rx-2, cy-ry*0.55, cx+rx+2, cy+ry+2], fill=fur)
        if mode == 'closed':
            d.arc([cx-rx, cy-ry*0.5, cx+rx, cy+ry*0.5], 15, 165, fill=lash, width=11)
        else:  # happy ^
            d.arc([cx-rx, cy-ry*0.35, cx+rx, cy+ry*1.1], 200, 340, fill=lash, width=13)

EYES = [(605,342,64,56),(846,288,48,58)]
def face(mode):
    img = src.copy()
    if mode != 'open':
        layer = Image.new('RGBA', img.size, (246,226,205,0))
        for e in EYES: lid(layer, *e, mode)
        layer = layer.filter(ImageFilter.GaussianBlur(2.5))
        # soft-clip lids to body alpha
        img.alpha_composite(layer)
    return img.crop(bbox)

FR = 192
def frame(body, rot=0, sx=1.0, sy=1.0, dy=0.0):
    bw, bh = body.size
    base = FR*0.86/max(bw,bh)
    nw, nh = max(1,int(bw*base*sx)), max(1,int(bh*base*sy))
    b = body.resize((nw*2, nh*2), Image.LANCZOS)
    if rot: b = b.rotate(rot, resample=Image.BICUBIC, expand=True, center=(b.size[0]/2, b.size[1]*0.92))
    b = b.resize((b.size[0]//2, b.size[1]//2), Image.LANCZOS)
    canvas = Image.new('RGBA',(FR,FR),(0,0,0,0))
    # anchor feet to bottom
    x = (FR - b.size[0])//2
    y = int(FR - b.size[1] - 4 + dy*FR)
    canvas.alpha_composite(b, (x, y))
    return canvas

open_, half, closed, happy = face('open'), face('half'), face('closed'), face('happy')
idle = [frame(open_)]*5 + [frame(half), frame(closed), frame(half)]
idle += [frame(open_)]*2
hop = [
    frame(happy, sx=1.06, sy=0.92),
    frame(happy, sx=0.95, sy=1.06, dy=-0.06),
    frame(happy, sx=0.97, sy=1.04, dy=-0.12, rot=-4),
    frame(happy, dy=-0.15, rot=-6),
    frame(happy, dy=-0.12, rot=-3),
    frame(happy, sx=0.97, sy=1.03, dy=-0.06),
    frame(happy, sx=1.07, sy=0.91),
    frame(happy, sx=1.02, sy=0.97),
    frame(open_),
    frame(open_),
]
cheer = [frame(happy, rot=r) for r in (0, 9, 14, 9, 0, -9, -14, -9, 0)] + [frame(open_)]
rows = [idle, hop, cheer]
cols = max(len(r) for r in rows)
sheet = Image.new('RGBA',(FR*cols, FR*len(rows)),(0,0,0,0))
for ri,r in enumerate(rows):
    for ci,f in enumerate(r): sheet.alpha_composite(f,(ci*FR, ri*FR))
sheet.save(out, 'WEBP', quality=86, method=6)
prev = Image.new('RGBA', sheet.size, (60,60,90,255)); prev.alpha_composite(sheet); prev.convert('RGB').save('preview.png')
print('frames per row', [len(r) for r in rows], 'cols', cols)
