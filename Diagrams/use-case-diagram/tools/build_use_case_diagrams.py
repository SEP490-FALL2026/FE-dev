"""Build the single SaaS-Sentry use case diagram (.drawio + .drawio.png).

Usage (from this folder):
  python build_use_case_diagrams.py              # write .drawio, export PNG, report layout issues
  python build_use_case_diagrams.py --no-export  # write .drawio only
  python build_use_case_diagrams.py --out-dir <dir>  # write elsewhere (previews)

Business content comes from usecase_model.py; positions from layouts.json (hand
layout: every oval, actor and bend point is placed explicitly). The former
multi-page set P00-P09 is retired and is never produced by this script.

PNG export: draw.io Desktop 29.3.0 writes a corrupt PNG with -e (zTXt CRC error,
no IEND), so the PNG is rendered without -e and the source XML is embedded
afterwards as a tEXt chunk 'mxfile', which draw.io reads back as an editable diagram.
"""
import argparse
import json
import math
import os
import struct
import subprocess
import sys
import urllib.parse
import zlib
from xml.sax.saxutils import escape, quoteattr

import usecase_model as M

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.dirname(HERE)
LAYOUT_FILE = os.path.join(HERE, "layouts.json")
DRAWIO = r"C:\Program Files\draw.io\draw.io.exe"

HUMAN_W, HUMAN_H = 30, 60

STYLE_BOUNDARY = "rounded=0;whiteSpace=wrap;html=1;verticalAlign=top;align=left;spacingLeft=12;fillColor=none;"
STYLE_UC = "ellipse;whiteSpace=wrap;html=1;spacingLeft=10;spacingRight=10;"
STYLE_ACTOR = "shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;"
STYLE_ASSOC = "endArrow=none;html=1;rounded=0;"
STYLE_DEP = "endArrow=open;html=1;rounded=0;dashed=1;endSize=14;"
STYLE_GEN = "endArrow=block;endFill=0;endSize=18;html=1;rounded=0;"


# ---------------------------------------------------------------- geometry
def label_w(text, font):
    return max(40, int(len(text) * 7.2) + 10) * font / 12


def seg_rect_hit(p, q, r, pad=0.0):
    x, y, w, h = r
    x0, y0, x1, y1 = x - pad, y - pad, x + w + pad, y + h + pad
    dx, dy = q[0] - p[0], q[1] - p[1]
    t0, t1 = 0.0, 1.0
    for pk, qk in ((-dx, p[0] - x0), (dx, x1 - p[0]), (-dy, p[1] - y0), (dy, y1 - p[1])):
        if abs(pk) < 1e-12:
            if qk < 0:
                return False
        else:
            t = qk / pk
            if pk < 0:
                t0 = max(t0, t)
            else:
                t1 = min(t1, t)
            if t0 > t1:
                return False
    return True


def seg_ellipse_hit(p, q, c, rx, ry):
    ax, ay = (p[0] - c[0]) / rx, (p[1] - c[1]) / ry
    bx, by = (q[0] - c[0]) / rx, (q[1] - c[1]) / ry
    dx, dy = bx - ax, by - ay
    a = dx * dx + dy * dy
    b = 2 * (ax * dx + ay * dy)
    cc = ax * ax + ay * ay - 1
    if cc <= 0 or bx * bx + by * by <= 1:
        return True
    disc = b * b - 4 * a * cc
    if disc < 0 or a == 0:
        return False
    s = math.sqrt(disc)
    t1, t2 = (-b - s) / (2 * a), (-b + s) / (2 * a)
    return (0 <= t1 <= 1) or (0 <= t2 <= 1)


def clip_rect(center, toward, box):
    x, y, w, h = box
    dx, dy = toward[0] - center[0], toward[1] - center[1]
    ts = []
    if dx:
        ts += [((x + w) - center[0]) / dx if dx > 0 else (x - center[0]) / dx]
    if dy:
        ts += [((y + h) - center[1]) / dy if dy > 0 else (y - center[1]) / dy]
    t = min(t for t in ts if t > 0) if ts else 0
    return (center[0] + dx * t, center[1] + dy * t)


def clip_ellipse(center, toward, rx, ry):
    dx, dy = toward[0] - center[0], toward[1] - center[1]
    if dx == 0 and dy == 0:
        return center
    t = 1.0 / math.sqrt((dx / rx) ** 2 + (dy / ry) ** 2)
    return (center[0] + dx * t, center[1] + dy * t)


def segs_cross(p1, p2, p3, p4):
    def orient(a, b, c):
        return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
    d1, d2 = orient(p3, p4, p1), orient(p3, p4, p2)
    d3, d4 = orient(p1, p2, p3), orient(p1, p2, p4)
    return (d1 * d2 < 0) and (d3 * d4 < 0)


def seg_dist(p1, p2, p3, p4):
    def pt(p, a, b):
        dx, dy = b[0] - a[0], b[1] - a[1]
        L = dx * dx + dy * dy
        t = 0 if L == 0 else max(0, min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L))
        return math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy)
    if segs_cross(p1, p2, p3, p4):
        return 0.0
    return min(pt(p1, p3, p4), pt(p2, p3, p4), pt(p3, p1, p2), pt(p4, p1, p2))


def rect_ellipse_overlap(box, c, rx, ry):
    x, y, w, h = box
    pts = [(x + w * i / 4, y + h * j / 2) for i in range(5) for j in range(3)]
    if any(((px - c[0]) / rx) ** 2 + ((py - c[1]) / ry) ** 2 <= 1 for px, py in pts):
        return True
    extremes = [(c[0] - rx, c[1]), (c[0] + rx, c[1]), (c[0], c[1] - ry), (c[0], c[1] + ry), c]
    return any(x <= px <= x + w and y <= py <= y + h for px, py in extremes)


def disjoint(a, b):
    return a[0] + a[2] <= b[0] or b[0] + b[2] <= a[0] or a[1] + a[3] <= b[1] or b[1] + b[3] <= a[1]


# ---------------------------------------------------------------- scene
class Scene:
    """Concrete positions of every element, read from layouts.json."""

    def __init__(self, layout):
        self.L = layout
        self.font = layout["font"]
        self.rel_font = layout["rel_font"]
        self.bx, self.by, self.bw, self.bh = layout["boundary"]
        self.waypoints = {k: [tuple(p) for p in v] for k, v in layout.get("waypoints", {}).items()}
        self.ext_bases = {e["target"]: e for e in M.EXTENDS}

    def uc_size(self, uc):
        return tuple(self.L.get("uc_sizes", {}).get(uc, self.L["uc_size"]))

    def uc_center(self, uc):
        return tuple(self.L["ucs"][uc])

    def uc_ellipse(self, uc):
        w, h = self.uc_size(uc)
        return self.uc_center(uc), w / 2, h / 2

    def actor_center(self, aid):
        return tuple(self.L["actors"][aid][:2])

    def actor_label_lines(self, aid):
        a = M.ACTORS[aid]
        lines = self.L.get("actor_labels", {}).get(aid, a["label"]).split("<br>")
        if a["kind"] == "system" and self.L.get("system_keyword"):
            lines = ["«system»"] + lines
        return lines

    def label_side(self, aid):
        """'above' for actors above the boundary (downward lines stay clear), 'below' otherwise;
        layouts.json may force 'right' or 'left'."""
        forced = self.L.get("label_side", {}).get(aid)
        if forced:
            return forced
        return "above" if self.actor_center(aid)[1] < self.by else "below"

    def label_above(self, aid):
        return self.label_side(aid) == "above"

    def actor_boxes(self, aid):
        """(figure box, label box)."""
        cx, cy = self.actor_center(aid)
        fig = (cx - HUMAN_W / 2, cy - HUMAN_H / 2, HUMAN_W, HUMAN_H)
        lines = self.actor_label_lines(aid)
        lw = max(label_w(t, self.font) for t in lines)
        lh = 20 * self.font / 12 * len(lines) * 0.75 + 4
        side = self.label_side(aid)
        if side == "above":
            return fig, (cx - lw / 2, cy - HUMAN_H / 2 - 1 - lh, lw, lh)
        if side == "right":
            return fig, (cx + HUMAN_W / 2 + 2, cy - lh / 2, lw, lh)
        if side == "left":
            return fig, (cx - HUMAN_W / 2 - 2 - lw, cy - lh / 2, lw, lh)
        return fig, (cx - lw / 2, cy + HUMAN_H / 2 + 1, lw, lh)

    def rel_label_box(self, rid, p, q):
        """«include»/«extend» keyword box: midpoint of the segment plus a layout offset."""
        ox, oy = self.L.get("rel_labels", {}).get(rid, [0, -18])
        mx, my = (p[0] + q[0]) / 2 + ox, (p[1] + q[1]) / 2 + oy
        w, h = 66 * self.rel_font / 12, 18 * self.rel_font / 12
        return (mx - w / 2, my - h / 2, w, h), (ox, oy)

    # -- shapes the connectors must avoid
    def obstacles(self):
        obs = []
        for uc in M.USE_CASES:
            c, rx, ry = self.uc_ellipse(uc)
            obs.append(("uc", uc, (c, rx + 5, ry + 5)))
        for aid in M.ACTORS:
            fig, lab = self.actor_boxes(aid)
            obs.append(("actor", aid, fig))
            obs.append(("label", aid, lab))
        obs.append(("title", "boundary", (self.bx + 8, self.by + 4, 150, 30)))
        return obs

    def polyline(self, rid, src_pt_fn, dst_pt_fn):
        wps = self.waypoints.get(rid, [])
        if not wps:
            p = src_pt_fn(None)
            return [p, dst_pt_fn(p)]
        return [src_pt_fn(wps[0])] + wps + [dst_pt_fn(wps[-1])]

    def point_on(self, key, toward):
        if key in M.USE_CASES:
            c, rx, ry = self.uc_ellipse(key)
            return clip_ellipse(c, toward, rx, ry) if toward else c
        fig, _ = self.actor_boxes(key)
        c = (fig[0] + fig[2] / 2, fig[1] + fig[3] / 2)
        return clip_rect(c, toward, fig) if toward else c

    def center(self, key):
        return self.point_on(key, None)

    def edges(self):
        """All connectors as polylines: (id, kind, source, target, [points])."""
        out = []

        def poly(rid, s, t):
            pts = self.polyline(rid, lambda w: self.point_on(s, w or self.center(t)),
                                lambda last: self.point_on(t, last))
            if len(pts) == 2:
                pts = [self.point_on(s, self.center(t)), self.point_on(t, self.center(s))]
            return pts
        for a, u, _ in M.ASSOCIATIONS:
            rid = M.association_id(a, u)
            out.append((rid, "assoc", a, u, poly(rid, a, u)))
        for g in M.ACTOR_GENERALIZATIONS + M.UC_GENERALIZATIONS:
            out.append((g["id"], "gen", g["specific"], g["general"], poly(g["id"], g["specific"], g["general"])))
        for r in M.INCLUDES:
            out.append((r["id"], "include", r["source"], r["target"], poly(r["id"], r["source"], r["target"])))
        for r in M.EXTENDS:
            out.append((r["id"], "extend", r["source"], r["target"], poly(r["id"], r["source"], r["target"])))
        return out


def evaluate(scene):
    """Layout issues: connector through a shape/label, crossings, near-merges, overlapping shapes."""
    issues = {"collision": [], "crossing": [], "near": [], "shape_overlap": [], "label_on_shape": []}
    segs = []
    for rid, kind, s, t, pts in scene.edges():
        for k in range(len(pts) - 1):
            ends = set()
            if k == 0:
                ends.add(s)
            if k == len(pts) - 2:
                ends.add(t)
            segs.append((rid, kind, ends, pts[k], pts[k + 1], s, t))
    obs = scene.obstacles()
    for rid, kind, ends, p, q, s, t in segs:
        for okind, key, geo in obs:
            if key in ends and okind in ("uc", "actor"):
                continue
            if key in ends and okind == "label":
                hit = seg_rect_hit(p, q, geo, 1)
            elif okind == "uc":
                hit = seg_ellipse_hit(p, q, *geo)
            else:
                hit = seg_rect_hit(p, q, geo, 3)
            if hit:
                issues["collision"].append((rid, f"{okind}:{key}"))
    rel_boxes = {}
    for rid, kind, s, t, pts in scene.edges():
        if kind in ("include", "extend"):
            box, _ = scene.rel_label_box(rid, pts[0], pts[1])
            rel_boxes[rid] = box
            for okind, key, geo in obs:
                hit = rect_ellipse_overlap(box, *geo) if okind == "uc" else not disjoint(box, geo)
                if hit:
                    issues["label_on_shape"].append((rid, key))
    for rid, kind, ends, p, q, s, t in segs:
        for lid, box in rel_boxes.items():
            if lid != rid and seg_rect_hit(p, q, box, 1):
                issues["collision"].append((rid, f"label:{lid}"))
    gen_ids = {g["id"] for g in M.ACTOR_GENERALIZATIONS}
    for i in range(len(segs)):
        for j in range(i + 1, len(segs)):
            a, b = segs[i], segs[j]
            if a[0] == b[0]:
                continue
            # generalization branches to the same parent share their last legs by design
            if a[0] in gen_ids and b[0] in gen_ids:
                continue
            shared = a[2] & b[2]
            if shared:
                ang = abs(math.remainder(math.atan2(a[4][1] - a[3][1], a[4][0] - a[3][0])
                                         - math.atan2(b[4][1] - b[3][1], b[4][0] - b[3][0]), 2 * math.pi))
                if ang < math.radians(6):
                    issues["near"].append((a[0], b[0]))
                continue
            if segs_cross(a[3], a[4], b[3], b[4]):
                issues["crossing"].append((a[0], b[0]))
            elif seg_dist(a[3], a[4], b[3], b[4]) < 4:
                issues["near"].append((a[0], b[0]))
    boxes = []
    for uc in M.USE_CASES:
        (cx, cy), rx, ry = scene.uc_ellipse(uc)
        boxes.append((uc, (cx - rx, cy - ry, 2 * rx, 2 * ry)))
    for aid in M.ACTORS:
        fig, lab = scene.actor_boxes(aid)
        boxes.append((aid, fig))
        boxes.append((aid + ":label", lab))
    boxes.append(("boundary-title", (scene.bx + 8, scene.by + 4, 150, 30)))
    for i in range(len(boxes)):
        for j in range(i + 1, len(boxes)):
            (a, r1), (b, r2) = boxes[i], boxes[j]
            if a.split(":")[0] == b.split(":")[0]:
                continue
            if not disjoint(r1, r2):
                issues["shape_overlap"].append((a, b))
    return issues


# ---------------------------------------------------------------- drawio XML
def cell(cid, value, style, geo, vertex=True, parent="1", extra=""):
    kind = 'vertex="1"' if vertex else 'edge="1"'
    return (f'<mxCell id={quoteattr(cid)} value={quoteattr(value)} style={quoteattr(style)} '
            f'{kind} parent="{parent}"{extra}>{geo}</mxCell>')


def vgeo(x, y, w, h):
    return f'<mxGeometry x="{x:.0f}" y="{y:.0f}" width="{w:.0f}" height="{h:.0f}" as="geometry"/>'


def egeo(points=None, offset=None):
    inner = ""
    if points:
        inner += '<Array as="points">' + "".join(f'<mxPoint x="{x:.0f}" y="{y:.0f}"/>' for x, y in points) + "</Array>"
    if offset:
        inner += f'<mxPoint x="{offset[0]:.0f}" y="{offset[1]:.0f}" as="offset"/>'
    return f'<mxGeometry relative="1" as="geometry">{inner}</mxGeometry>'


def uc_value(uc, scene):
    u = M.USE_CASES[uc]
    name = escape(u["name"])
    # layouts.json may force a line break inside a long name ("uc_name_breaks": {"UCxx": "word before break"})
    brk = scene.L.get("uc_name_breaks", {}).get(uc)
    if brk and name.startswith(brk + " "):
        name = f"{brk}<br>{name[len(brk) + 1:]}"
    if u.get("abstract"):
        name = f"<i>{name}</i>"
    label = f"<b>{uc}</b> {name}"
    e = scene.ext_bases.get(uc)
    if e:
        label += (f'<hr><span style="font-size:{scene.L["ext_point_font"]}px">extension points<br>'
                  f'{escape(e["point"])}</span>')
    return label


def page_xml(scene):
    L = scene.L
    f = f"fontSize={scene.font};"
    rf = f"fontSize={scene.rel_font};"
    parts = ['<mxCell id="0"/>', '<mxCell id="1" parent="0"/>']
    parts.append(cell("boundary", "SaaS-Sentry", STYLE_BOUNDARY + f"fontSize={L['boundary_font']};fontStyle=1;",
                      vgeo(scene.bx, scene.by, scene.bw, scene.bh)))
    for uc in M.USE_CASES:
        (cx, cy), rx, ry = scene.uc_ellipse(uc)
        parts.append(cell(uc, uc_value(uc, scene), STYLE_UC + f, vgeo(cx - rx, cy - ry, 2 * rx, 2 * ry)))
    for aid, a in M.ACTORS.items():
        cx, cy = scene.actor_center(aid)
        lines = [escape(t) for t in scene.actor_label_lines(aid)]
        value = "<br>".join(lines)
        if a.get("abstract"):
            value = f"<i>{value}</i>"
        style = STYLE_ACTOR + f
        side = scene.label_side(aid)
        if side == "above":
            style = style.replace("verticalLabelPosition=bottom;verticalAlign=top;",
                                  "verticalLabelPosition=top;verticalAlign=bottom;")
        elif side in ("right", "left"):
            style = style.replace("verticalLabelPosition=bottom;verticalAlign=top;",
                                  f"labelPosition={side};verticalLabelPosition=middle;"
                                  f"align={'left' if side == 'right' else 'right'};verticalAlign=middle;")
        parts.append(cell(aid, value, style, vgeo(cx - HUMAN_W / 2, cy - HUMAN_H / 2, HUMAN_W, HUMAN_H)))
    for rid, kind, s, t, pts in scene.edges():
        wps = scene.waypoints.get(rid)
        if kind == "assoc":
            parts.append(cell(rid, "", STYLE_ASSOC, egeo(wps), vertex=False, extra=f' source="{s}" target="{t}"'))
        elif kind == "gen":
            parts.append(cell(rid, "", STYLE_GEN, egeo(wps), vertex=False, extra=f' source="{s}" target="{t}"'))
        else:
            _, off = scene.rel_label_box(rid, pts[0], pts[1])
            word = "«include»" if kind == "include" else "«extend»"
            parts.append(cell(rid, word, STYLE_DEP + rf, egeo(wps, off), vertex=False,
                              extra=f' source="{s}" target="{t}"'))
    return "".join(parts)


def mxfile(scene):
    W, H = scene.L["canvas"]
    return ('<mxfile host="drawio" agent="build_use_case_diagrams.py" version="29.3.0">'
            f'<diagram id="uc-main" name={quoteattr(M.DIAGRAM_TITLE)}>'
            f'<mxGraphModel dx="{W}" dy="{H}" grid="0" gridSize="10" guides="1" tooltips="1" connect="1" '
            f'arrows="1" fold="1" page="0" pageScale="1" pageWidth="1654" pageHeight="1169" math="0" shadow="0">'
            f'<root>{page_xml(scene)}</root></mxGraphModel></diagram></mxfile>\n')


# ---------------------------------------------------------------- export
def embed_png(png_path, xml_text):
    data = open(png_path, "rb").read()
    assert data[:8] == b"\x89PNG\r\n\x1a\n"
    n = struct.unpack(">I", data[8:12])[0]
    ihdr_end = 8 + 12 + n
    payload = b"mxfile\x00" + urllib.parse.quote(xml_text, safe="-_.!~*'()").encode("ascii")
    chunk = struct.pack(">I", len(payload)) + b"tEXt" + payload
    chunk += struct.pack(">I", zlib.crc32(b"tEXt" + payload) & 0xFFFFFFFF)
    open(png_path, "wb").write(data[:ihdr_end] + chunk + data[ihdr_end:])


def export(drawio_path, png_path):
    if os.path.exists(png_path):
        os.remove(png_path)
    r = subprocess.run([DRAWIO, "-x", "-f", "png", "-b", "10", "-s", "2", "-o", png_path, drawio_path],
                       capture_output=True, text=True)
    if not os.path.exists(png_path):
        raise SystemExit(f"export failed: {drawio_path}\n{r.stdout}\n{r.stderr}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--no-export", action="store_true")
    ap.add_argument("--out-dir", default=OUT_DIR)
    ap.add_argument("--layout", default=LAYOUT_FILE)
    args = ap.parse_args()
    scene = Scene(json.load(open(args.layout, encoding="utf-8")))
    issues = evaluate(scene)
    xml = mxfile(scene)
    base = os.path.join(args.out_dir, M.DIAGRAM_FILE + ".drawio")
    open(base, "w", encoding="utf-8", newline="\n").write(xml)
    print(f"-> {base}")
    for k, v in issues.items():
        print(f"{k}: {len(v)}")
        for item in v:
            print("   ", item)
    if not args.no_export:
        export(base, base + ".png")
        embed_png(base + ".png", xml)
        print(f"-> {base}.png")
    return 0


if __name__ == "__main__":
    sys.exit(main())
