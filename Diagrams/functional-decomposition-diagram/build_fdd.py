"""Build the SaaS-Sentry Functional Decomposition Diagram from ``function-tree.json`` (canonical).

Layout follows the committee sample, with two kinds of line:
  A. system -> feature: one straight segment per feature (edgeStyle=none, no waypoints, no arrow);
  B. feature -> functions: the numbered functions (N.M) are plain text stacked outside the feature,
     gathered by one square bracket on the side facing the feature, and one orthogonal line runs from
     the feature to the middle of that bracket.
Writes the .drawio, the PNG (editable source embedded) and the guide.

    python functional-decomposition-diagram/build_fdd.py [--png] [--check]     (from Docs/Diagrams)
"""
from __future__ import annotations

import argparse
import html
import json
import math
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent.parent / "ERD" / "tools"))
from erd_drawio import embed_png_source, read_png_source  # noqa: E402

DRAWIO = r"C:\Program Files\draw.io\draw.io.exe"
TREE = HERE / "function-tree.json"
OUT = HERE / "saas-sentry-functional-decomposition"
GUIDE = HERE / "functional-decomposition-guide.md"
FONT = "Helvetica"
LEAF_H = 20
LEAF_GAP = 2
FEAT_W, FEAT_H = 236, 62
CENTER_W, CENTER_H = 330, 110
SPINE = 22          # feature edge -> vertical run of the bracket line
BR_W = 8            # bracket cap length
BR_GAP = 18         # vertical run -> bracket bar
TXT_GAP = 3         # bracket cap -> text
BR_PAD = 3          # bracket overhang above the first / below the last line
MARGIN = 26
RING_SLOTS = (1, 5, 3, 5, 1)   # top-right, right column, bottom row, left column, top-left
COL_GAP = 24        # vertical gap between groups in a side column
COL_X = 250.0       # inner edge of a side column at its ends
COL_BULGE = 170.0   # extra outward offset at mid-height, so the columns follow an ellipse
COL_CURVE = 1.35
ROW_GAP = 46        # side columns -> top/bottom rows
TOP_STEP = 330.0
BOTTOM_STEP = 340.0

# Owner's hand edit in draw.io, 09/10/2026 10:33 (commit db15eb4), pinned so regeneration reproduces it.
# The ring above still fixes the page origin/size and where the lists of Features 2-14 sit; the Owner then
# pulled the 15 Feature boxes in towards the centre and moved the lists of Features 1 and 15. Page
# coordinates (top-left, as draw.io's Arrange panel shows them). Only change from the hand edit: Feature 9
# sits 14px higher (Owner: y=1005), because its corner overlapped Feature 8 by 7x1px and the boxes need a
# 13px clearance (MARGIN / 2). After another hand edit in draw.io, copy
# the new values here and rerun the script; --check fails until the two agree.
FEATURE_XY = {1: (1044, 324), 2: (1266, 417), 3: (1280, 541), 4: (1316, 664), 5: (1303, 811),
              6: (1215.5, 975), 7: (1020, 1066), 8: (730, 1066), 9: (501, 991), 10: (411, 853),
              11: (407, 736), 12: (411, 622), 13: (431, 518), 14: (478, 395), 15: (730, 330)}
LIST_XY = {1: (1234, 106), 15: (808, 111)}      # top-left of the bracket of a list the Owner moved
# hand-routed bracket lines: exit point on the Feature, then the bends; the last leg runs level into the
# middle of the bracket. Other lines are derived: H-V-H through the midpoint when a side list sits off the
# Feature's centre line, straight down from the list's spine for Features 7-9.
ROUTE = {1: [(1144.2, 324), (1144.2, 163)],
         15: [(848, 330), (848, 238.9), (771.6, 238.9), (771.6, 135)]}


def esc(s):
    return html.escape(s, quote=True)


# Helvetica advance widths (standard AFM, 1/1000 em) so list widths follow the real text
_HELV = dict(zip(" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",
                 [278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278] + [556] * 10 +
                 [278, 278, 584, 584, 584, 556, 1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833,
                  722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556, 333, 556,
                  556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556,
                  500, 722, 500, 500, 500, 334, 260, 334, 584]))
_HELV.update({"–": 556, "—": 1000, "·": 278})


def text_w(s, size=12):
    return sum(_HELV.get(c, 600) for c in s) * size / 1000


def rect_overlap(a, b, m=0):
    return a[0] - m < b[0] + b[2] and b[0] - m < a[0] + a[2] and a[1] - m < b[1] + b[3] and b[1] - m < a[1] + a[3]


def seg_hits(p, q, r):
    """True if segment p-q passes through rectangle r (sampled)."""
    for t in range(1, 400):
        x = p[0] + (q[0] - p[0]) * t / 400
        y = p[1] + (q[1] - p[1]) * t / 400
        if r[0] < x < r[0] + r[2] and r[1] < y < r[1] + r[3]:
            return True
    return False


def group_geometry(f, fx, fy, mode):
    """Feature centred at (fx, fy); ``mode`` says where its list goes: up, down, right or left."""
    feat = (fx - FEAT_W / 2, fy - FEAT_H / 2, FEAT_W, FEAT_H)
    labels = [f"{f['n']}.{i} {leaf[0]}" for i, leaf in enumerate(f["leaves"], 1)]
    lw = math.ceil(max(text_w(t) for t in labels)) + 14
    col_h = len(labels) * LEAF_H + (len(labels) - 1) * LEAF_GAP
    if mode in ("up", "down"):
        # list stacks above/below the feature, bracket on its left; line leaves the top/bottom edge
        spine_x = feat[0] + 18
        bx = spine_x + BR_GAP
        lx = bx + BR_W + TXT_GAP
        top = feat[1] - SPINE - BR_PAD - col_h if mode == "up" else feat[1] + FEAT_H + SPINE + BR_PAD
        side = "left"
    else:
        # list beside the feature, centred on it, bracket on the side facing the feature
        top = fy - col_h / 2
        if mode == "right":
            spine_x = feat[0] + FEAT_W + SPINE
            bx = spine_x
            lx = bx + BR_W + TXT_GAP
            side = "left"
        else:
            spine_x = feat[0] - SPINE
            bx = spine_x - BR_W
            lx = bx - TXT_GAP - lw
            side = "right"
    leaves = [(lx, top + k * (LEAF_H + LEAF_GAP), lw, LEAF_H) for k in range(len(labels))]
    bracket = (bx, top - BR_PAD, BR_W, col_h + 2 * BR_PAD)
    return finish({"feat": feat, "leaves": leaves, "labels": labels, "bracket": bracket, "side": side,
                   "mode": mode, "spine_x": spine_x, "route": None})


def finish(g):
    """Bracket line, spoke and bounding box from the Feature box and the list (bracket + text)."""
    feat, (bx, by, _, bh) = g["feat"], g["bracket"]
    fx, fy = feat[0] + FEAT_W / 2, feat[1] + FEAT_H / 2
    bmid = by + bh / 2
    bar_x = bx if g["side"] == "left" else bx + BR_W
    if g["route"]:
        path = list(g["route"]) + [(bar_x, bmid)]
    elif g["mode"] in ("up", "down"):
        sy = feat[1] if g["mode"] == "up" else feat[1] + FEAT_H
        path = [(g["spine_x"], sy), (g["spine_x"], bmid), (bar_x, bmid)]
    else:
        ex = feat[0] + FEAT_W if g["mode"] == "right" else feat[0]
        mx = (ex + bar_x) / 2
        path = [(ex, fy), (bar_x, bmid)] if abs(fy - bmid) < 0.05 else [(ex, fy), (mx, fy), (mx, bmid), (bar_x, bmid)]
    xs = [feat[0], feat[0] + FEAT_W, bx, bx + BR_W] + [lb[0] for lb in g["leaves"]] + [lb[0] + lb[2] for lb in g["leaves"]]
    ys = [feat[1], feat[1] + FEAT_H, by, by + bh] + [p[1] for p in path]
    xs += [p[0] for p in path]
    g.update(path=path, spoke=((0.0, 0.0), (fx, fy)), bbox=(min(xs), min(ys), max(xs) - min(xs), max(ys) - min(ys)))
    return g


def hand_layout(tree, groups, ox, oy):
    """Apply the Owner's pinned positions (page coordinates) on top of the ring layout."""
    for f, g in zip(tree["features"], groups):
        n = f["n"]
        if n in FEATURE_XY:
            x, y = FEATURE_XY[n]
            g["feat"] = (x - ox, y - oy, FEAT_W, FEAT_H)
        if n in LIST_XY:
            dx, dy = LIST_XY[n][0] - ox - g["bracket"][0], LIST_XY[n][1] - oy - g["bracket"][1]
            g["bracket"] = (g["bracket"][0] + dx, g["bracket"][1] + dy, *g["bracket"][2:])
            g["leaves"] = [(lx + dx, ly + dy, lw, lh) for lx, ly, lw, lh in g["leaves"]]
            g["spine_x"] += dx
        if n in ROUTE:
            g["route"] = [(x - ox, y - oy) for x, y in ROUTE[n]]
        finish(g)


def group_height(f):
    n = len(f["leaves"])
    return max(FEAT_H, n * LEAF_H + (n - 1) * LEAF_GAP + 2 * BR_PAD)


def layout(tree):
    """Clockwise from the top, like the committee sample: top-right, right column (top to bottom),
    bottom row (right to left), left column (bottom to top), top-left."""
    feats = tree["features"]
    t_r, right_n, bottom_n, left_n, t_l = RING_SLOTS
    if t_r + right_n + bottom_n + left_n + t_l != len(feats):
        raise SystemExit(f"RING_SLOTS {RING_SLOTS} does not add up to {len(feats)} features")
    k = 0
    top_r = feats[k:k + t_r]; k += t_r
    right = feats[k:k + right_n]; k += right_n
    bottom = feats[k:k + bottom_n]; k += bottom_n
    left = feats[k:k + left_n]; k += left_n
    top_l = feats[k:k + t_l]

    def column(fs):
        hs = [group_height(f) for f in fs]
        total = sum(hs) + COL_GAP * (len(fs) - 1)
        y, ys = -total / 2, []
        for h in hs:
            ys.append(y + h / 2)
            y += h + COL_GAP
        return ys, total / 2

    rys, rhalf = column(right)
    lys, lhalf = column(left[::-1])
    half = max(rhalf, lhalf)
    yb = half * COL_CURVE

    def col_x(y):
        return COL_X + COL_BULGE * math.sqrt(max(0.0, 1 - (y / yb) ** 2))

    groups = {}
    for f, y in zip(right, rys):
        groups[f["n"]] = group_geometry(f, col_x(y) + FEAT_W / 2, y, "right")
    for f, y in zip(left[::-1], lys):
        groups[f["n"]] = group_geometry(f, -col_x(y) - FEAT_W / 2, y, "left")
    y_top = -half - ROW_GAP - FEAT_H / 2
    y_bot = half + ROW_GAP + FEAT_H / 2
    tops = top_l + top_r                                   # left to right
    for i, f in enumerate(tops):
        groups[f["n"]] = group_geometry(f, (i - (len(tops) - 1) / 2) * TOP_STEP, y_top, "up")
    for i, f in enumerate(bottom):                         # right to left
        groups[f["n"]] = group_geometry(f, ((len(bottom) - 1) / 2 - i) * BOTTOM_STEP, y_bot, "down")
    groups = [groups[f["n"]] for f in feats]
    centre = (-CENTER_W / 2, -CENTER_H / 2, CENTER_W, CENTER_H)
    placed = [centre] + [g["bbox"] for g in groups]
    xs = [b[0] for b in placed] + [b[0] + b[2] for b in placed]
    ys = [b[1] for b in placed] + [b[1] + b[3] for b in placed]
    ox, oy = -min(xs) + 40, -min(ys) + 40
    W, H = max(xs) - min(xs) + 80, max(ys) - min(ys) + 80
    hand_layout(tree, groups, ox, oy)      # page origin and size stay those of the ring layout
    return groups, (ox, oy), (ox, oy), (W, H), centre


def build_xml(tree):
    groups, (ccx, ccy), (ox, oy), (W, H), centre = layout(tree)
    cells = ['<mxCell id="0"/>', '<mxCell id="1" parent="0"/>']
    box = ("rounded=1;arcSize=12;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#000000;fontColor=#000000;"
           f"fontFamily={FONT};")
    sysl = tree["system"].split("\n")
    sval = "<br>".join(f"<b>{esc(t)}</b>" if i == 0 else esc(t) for i, t in enumerate(sysl))
    cells.append(f'<mxCell id="SYS" value="{esc(sval)}" style="{box}strokeWidth=2.5;fontSize=17;" vertex="1" parent="1">'
                 f'<mxGeometry x="{centre[0] + ox:.1f}" y="{centre[1] + oy:.1f}" width="{CENTER_W}" height="{CENTER_H}" as="geometry"/></mxCell>')
    line = "html=1;rounded=0;strokeColor=#000000;strokeWidth=1.2;endArrow=none;startArrow=none;"
    for f, g in zip(tree["features"], groups):
        fid = f"F{f['n']}"
        fx, fy, fw, fh = g["feat"]
        val = f"<b>Feature {f['n']}</b><br>{esc(f['name'])}"
        cells.append(f'<mxCell id="{fid}" value="{esc(val)}" style="{box}strokeWidth=1.6;fontSize=13;" vertex="1" parent="1">'
                     f'<mxGeometry x="{fx + ox:.1f}" y="{fy + oy:.1f}" width="{fw}" height="{fh}" as="geometry"/></mxCell>')
        # tier A: straight spoke, perimeter to perimeter, no waypoints
        cells.append(f'<mxCell id="e-{fid}" style="edgeStyle=none;{line}" edge="1" parent="1" source="SYS" target="{fid}">'
                     f'<mxGeometry relative="1" as="geometry"/></mxCell>')
        for k, (lb, text) in enumerate(zip(g["leaves"], g["labels"]), 1):
            lx, ly, lw, lh = lb
            cells.append(f'<mxCell id="{fid}.{k}" value="{esc(text)}" style="text;html=1;whiteSpace=nowrap;fillColor=none;'
                         f'strokeColor=none;fontColor=#000000;fontFamily={FONT};fontSize=12;align=left;verticalAlign=middle;'
                         f'spacingLeft=2;spacingRight=2;" vertex="1" parent="1"><mxGeometry x="{lx + ox:.1f}" y="{ly + oy:.1f}" '
                         f'width="{lw:.0f}" height="{lh}" as="geometry"/></mxCell>')
        # tier B: one bracket gathering the list, one orthogonal line from the feature to the bracket
        bid = f"{fid}-list"
        bx, by, bw, bh = g["bracket"]
        sides = "left=1;right=0;" if g["side"] == "left" else "left=0;right=1;"
        cells.append(f'<mxCell id="{bid}" value="" style="shape=partialRectangle;html=1;whiteSpace=wrap;fillColor=none;'
                     f'strokeColor=#000000;strokeWidth=1.2;top=1;bottom=1;{sides}" vertex="1" parent="1">'
                     f'<mxGeometry x="{bx + ox:.1f}" y="{by + oy:.1f}" width="{bw}" height="{bh:.1f}" as="geometry"/></mxCell>')
        p0 = g["path"][0]
        ex, ey = (p0[0] - fx) / fw, (p0[1] - fy) / fh
        entx = 0 if g["side"] == "left" else 1
        pts = "".join(f'<mxPoint x="{x + ox:.1f}" y="{y + oy:.1f}"/>' for x, y in g["path"][1:-1])
        cells.append(f'<mxCell id="e-{bid}" style="edgeStyle=orthogonalEdgeStyle;{line}exitX={ex:.4f};exitY={ey:.4f};'
                     f'exitDx=0;exitDy=0;entryX={entx};entryY=0.5;entryDx=0;entryDy=0;" edge="1" parent="1" '
                     f'source="{fid}" target="{bid}"><mxGeometry relative="1" as="geometry"><Array as="points">{pts}</Array>'
                     f'</mxGeometry></mxCell>')
    page = (f'<diagram id="FDD" name="Functional Decomposition"><mxGraphModel dx="1400" dy="900" grid="0" gridSize="10" '
            f'guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="{W:.0f}" '
            f'pageHeight="{H:.0f}" background="#FFFFFF" math="0" shadow="0"><root>' + "".join(cells) +
            "</root></mxGraphModel></diagram>")
    # geometry check: nothing overlaps; a spoke touches only SYS and its own feature; a bracket line is
    # orthogonal and touches only its own feature and bracket; groups keep a clear margin
    boxes = [("SYS", centre)] + [(f"F{f['n']}", g["feat"]) for f, g in zip(tree["features"], groups)]
    boxes += [(f"F{f['n']}-list", g["bracket"]) for f, g in zip(tree["features"], groups)]
    boxes += [(f"F{f['n']}.{k}", lb) for f, g in zip(tree["features"], groups) for k, lb in enumerate(g["leaves"], 1)]
    probs = []
    for i, (a, ra) in enumerate(boxes):
        for b, rb in boxes[i + 1:]:
            if rect_overlap(ra, rb, 1):
                probs.append(f"{a} overlaps {b}")
    # groups keep a clear margin piece by piece (box, bracket, each line of text, each leg of the bracket
    # line): the Owner's layout interleaves group bounding boxes, so a whole-bbox test would be meaningless
    def parts(g):
        legs = [(min(p[0], q[0]), min(p[1], q[1]), abs(p[0] - q[0]), abs(p[1] - q[1])) for p, q in zip(g["path"], g["path"][1:])]
        return [g["feat"], g["bracket"], *g["leaves"], *legs]
    for (fa, ga), (fb, gb) in ((x, y) for i, x in enumerate(zip(tree["features"], groups))
                               for y in list(zip(tree["features"], groups))[i + 1:]):
        if any(rect_overlap(a, b, MARGIN / 2) for a in parts(ga) for b in parts(gb)):
            probs.append(f"groups F{fa['n']} and F{fb['n']} closer than {MARGIN / 2:.0f}px")
    for name, r in boxes:
        if not (0 <= r[0] + ox and r[0] + r[2] + ox <= W and 0 <= r[1] + oy and r[1] + r[3] + oy <= H):
            probs.append(f"{name} outside the page")
    for f, g in zip(tree["features"], groups):
        fid = f"F{f['n']}"
        (p0x, p0y), feat = g["path"][0], g["feat"]
        on_x = abs(p0x - feat[0]) < 0.05 or abs(p0x - feat[0] - FEAT_W) < 0.05
        on_y = abs(p0y - feat[1]) < 0.05 or abs(p0y - feat[1] - FEAT_H) < 0.05
        if not ((on_x and feat[1] <= p0y <= feat[1] + FEAT_H) or (on_y and feat[0] <= p0x <= feat[0] + FEAT_W)):
            probs.append(f"bracket line of {fid} does not start on its Feature's border")
        bar_x = g["path"][-1][0]
        if (g["path"][-2][0] >= bar_x) if g["side"] == "left" else (g["path"][-2][0] <= bar_x):
            probs.append(f"bracket line of {fid} enters its bracket from the wrong side")
        for b, rb in boxes:
            if b not in ("SYS", fid) and seg_hits(*g["spoke"], rb):
                probs.append(f"spoke of {fid} crosses {b}")
        pts = g["path"]
        for p, q in zip(pts, pts[1:]):
            if abs(p[0] - q[0]) > 0.01 and abs(p[1] - q[1]) > 0.01:
                probs.append(f"bracket line of {fid} not orthogonal")
            for b, rb in boxes:
                if b not in (fid, f"{fid}-list") and seg_hits(p, q, rb):
                    probs.append(f"bracket line of {fid} crosses {b}")
            for gb in groups:
                if gb is not g and seg_hits(*gb["spoke"], (min(p[0], q[0]) - 1, min(p[1], q[1]) - 1,
                                                           abs(p[0] - q[0]) + 2, abs(p[1] - q[1]) + 2)):
                    probs.append(f"bracket line of {fid} crosses a spoke")
    return f'<mxfile host="build_fdd" version="{esc(tree["version"])}">{page}</mxfile>\n', (W, H), probs


def check_tree(tree):
    probs = []
    names = {}
    for f in tree["features"]:
        for leaf in f["leaves"]:
            key = leaf[0].lower()
            if key in names:
                probs.append(f"duplicate function name {leaf[0]} in features {names[key]} and {f['n']}")
            names[key] = f["n"]
            if any(ord(c) > 127 and c not in "–—·" for c in leaf[0] + f["name"]):
                probs.append(f"non-English text: {leaf[0]}")
            if not leaf[2]:
                probs.append(f"{leaf[0]}: missing source")
    ns = [f["n"] for f in tree["features"]]
    if ns != list(range(1, len(ns) + 1)):
        probs.append("features must be numbered 1..N in order")
    return probs


def guide(tree, size):
    nleaf = sum(len(f["leaves"]) for f in tree["features"])
    L = ["# Functional Decomposition Diagram — SaaS-Sentry", "",
         f"> **Loại:** Sơ đồ phân rã chức năng (FDD) · **Phiên bản:** {tree['version']} — {tree['date']} · **Trạng thái:** vẽ lại theo bố cục mẫu "
         "của hội đồng và BRD v3.30, `QĐ-49` → `QĐ-62`; chờ Owner/GVHD review.", ">",
         "> Ảnh mẫu của hội đồng chỉ là **mẫu trình bày**; mọi chức năng lấy từ BRD và sổ quyết định, không chép chức năng mẫu.", "",
         "## 1. Mục đích và cách đọc", "",
         "Sơ đồ trả lời *hệ thống gồm những nhóm chức năng nào và mỗi nhóm làm được gì*. Hộp giữa là toàn hệ thống; mỗi hộp "
         "**Feature N** là một nhóm chức năng nối thẳng với hệ thống; danh sách **N.M** bên ngoài là các chức năng của nhóm đó.", "",
         "Hai tầng dây, theo ảnh mẫu của hội đồng:", "",
         "- **Hệ thống → Feature:** mỗi Feature một đoạn thẳng từ biên hộp giữa tới biên hộp Feature, tỏa quanh tâm; "
         "không gấp khúc, không mũi tên. Feature xếp theo chiều kim đồng hồ: 1 ở trên, 2–6 cột phải, 7–9 hàng dưới, 10–14 cột trái, 15 trên trái.",
         "- **Feature → danh sách:** các dòng N.M là chữ thường (không đóng hộp), gom bằng **một dấu ngoặc vuông** ở phía hướng về Feature; "
         "một đường duy nhất từ Feature tới giữa dấu ngoặc, chỉ gồm đoạn ngang/dọc — thẳng ngang khi danh sách nằm ngang hàng Feature, "
         "có một bậc khi danh sách lệch lên/xuống, gấp vuông khi danh sách nằm trên/dưới Feature.", "",
         "- Đây **không** phải sơ đồ luồng: không có thứ tự, không có rẽ nhánh Có/Không. Trình tự nằm ở main flow và workflow.",
         "- Mỗi chức năng xuất hiện **đúng một lần**; chức năng dùng chung được đặt ở nhóm sở hữu nghiệp vụ và dẫn chiếu từ luồng.",
         "- Không tự thêm CRUD, xóa hàng loạt, khôi phục hay import/export mà BRD không có.", "",
         "## 2. Tệp", "",
         "| Tệp | Vai trò |", "| --- | --- |",
         "| [saas-sentry-functional-decomposition.drawio](saas-sentry-functional-decomposition.drawio) | Nguồn draw.io chỉnh sửa được (sinh từ cây chức năng). "
         "Vị trí Owner kéo tay được ghi trong `build_fdd.py` (`FEATURE_XY`, `LIST_XY`, `ROUTE`); sửa tay trên draw.io thì chép tọa độ và nhãn mới về đó "
         "và `function-tree.json` rồi chạy lại script, nếu không `--check` báo lệch |",
         "| [saas-sentry-functional-decomposition.drawio.png](saas-sentry-functional-decomposition.drawio.png) | Bản xuất PNG, nhúng nguồn draw.io |",
         "| [function-tree.json](function-tree.json) | **Nguồn canonical** — sửa rồi chạy `python functional-decomposition-diagram/build_fdd.py --png` từ `Docs/Diagrams`; script sinh lại cả hình và tài liệu này |",
         "", "![Functional Decomposition](saas-sentry-functional-decomposition.drawio.png)", "",
         f"**Số đếm:** {len(tree['features'])} nhóm chức năng · {nleaf} chức năng.", "",
         "## 3. Nhóm chức năng và chức năng", ""]
    for f in tree["features"]:
        L += [f"### Feature {f['n']} — {f['name']}", "", f"{f['vi']}. Dẫn tới: {f['flows']}.", "",
              "| Mã | Chức năng (trên hình) | Ý nghĩa | Nguồn | Dùng trong luồng |", "| --- | --- | --- | --- | --- |"]
        for k, leaf in enumerate(f["leaves"], 1):
            L.append(f"| {f['n']}.{k} | {leaf[0]} | {leaf[1]} | {leaf[2]} | {leaf[3]} |")
        L.append("")
    L += ["## 4. Không đưa vào hình", "",
          "| Nội dung | Lý do |", "| --- | --- |",
          "| Đăng nhập, xem danh sách, CRUD kỹ thuật riêng lẻ | Là thao tác nền, không phải chức năng nghiệp vụ; đăng nhập gộp trong 14.1 |",
          "| Tích hợp HRM, cổng thanh toán, chặn ứng dụng, log web/proxy/CASB | Ngoài phạm vi (BRD 3.2) |",
          "| Hạn mức/quota theo phòng ban | Ngoài phạm vi (`QĐ-57c`) |",
          "| G5 hạ gói theo mức sử dụng, dự báo L2 | Ngoài phạm vi / chỉ đặc tả (BRD 5.4.1, `QĐ-25`) |",
          "| Tính, kê khai, khấu trừ thuế | Hệ thống chỉ ghi nhận (`QĐ-55a`) |",
          "| Chi tiết bộ thu thập, ma trận nhà cung cấp | Chốt ở giai đoạn Tools (`QĐ-59a`) |",
          "| Gợi ý nhà cung cấp bằng AI (`US-15-01`) | Vẫn trong phạm vi nhưng đang ẩn và **không đưa vào phần trình bày** (`QĐ-49e`); vẽ ở mức chi tiết trong `WF-17a` |", "",
          "## 5. Thay đổi so với bản trước (v2.x, 04/10/2026)", "",
          "- Bố cục chuyển sang dạng **hộp trung tâm + Feature N + danh sách N.M** theo mẫu hội đồng; đánh số phân cấp.",
          "- Bỏ nhóm *Manager & Cost Center* dựa trên cây quản lý trực tiếp (`QĐ-23` đã bị `QĐ-52` thay); thêm Feature 1 theo phòng ban, trưởng phòng, chức vụ, bộ công cụ chuẩn.",
          "- Thêm chức năng của Review 1: kiểu cấp và mức kiểm soát, điều khoản nhà cung cấp, kho khóa, tài khoản dùng chung, chỉ tài khoản công ty, "
          "bàn giao dữ liệu, hồ sơ thuế và dòng thuế, chi phí thực chịu, dashboard theo vai và danh mục cảnh báo, sổ thiết bị và BM-06.",
          "- Tách *Company Devices & Monitoring* và *AI Assistance* thành nhóm riêng để trả lời trực tiếp câu hỏi của hội đồng; AI chỉ có hai tính năng của `QĐ-49e`; `US-15-01` đang ẩn không vẽ trên hình (mục 4).",
          "- **Chỉnh bố cục 09/10/2026 (chỉ hình thức, nội dung giữ nguyên):** danh sách N.M bỏ khung từng dòng và bỏ dây riêng tới từng chức năng, "
          "thay bằng một dấu ngoặc và một đường cho mỗi Feature; Feature xếp thành vòng gọn quanh hộp giữa theo mẫu hội đồng. "
          "Mã, tên, thứ tự, quan hệ cha–con và nguồn của 15 nhóm / 84 chức năng không đổi — kiểm ở `verification-2026-10-08.md` mục 6.",
          "- **Owner chỉnh tay trên draw.io 09/10/2026 (v3.1):** nhãn Feature 15 bỏ chữ *(Optional)* — chỉ đổi cách ghi trên hình; "
          "AI vẫn chỉ hỗ trợ, mọi quy trình chạy đủ khi AI tắt (`QĐ-49e`), không thêm chức năng AI. Mười lăm hộp Feature kéo gần hộp giữa; "
          "danh sách 1 và 15 dời chỗ, danh sách 2–14 giữ nguyên nên đường tới dấu ngoặc có một bậc. Feature 9 đặt cao hơn bản kéo tay 14px "
          "vì góc hộp chạm Feature 8. Không đổi mã, tên chức năng, thứ tự hay nguồn.",
          "- **Bỏ mã khỏi nhãn hiển thị 09/10/2026 (v3.2, `QĐ-62r`):** Owner bỏ mã biểu mẫu/rule khỏi bảy nhãn trên hình, theo danh sách chữ "
          "trong Report 1 — 3.2 *Purchase Documents*, 4.1 *Access Request Form*, 4.4 *New Software Assessment*, 6.2 *Offboarding Handover*, "
          "7.3 *Exclusion Gates & Waste Detection*, 8.2 *Monitoring Acknowledgment*, 10.5 *Legitimization Decision*. Các mã BM-01, BM-02, "
          "BM-04, BM-05, BM-06, BM-07, BM-08 và G1–G4 vẫn nằm ở cột *Nguồn* để truy vết; mã `N.M`, thứ tự và bố cục không đổi.", "",
          "## 6. Liên hệ", "",
          "- Cấp trên: [Context Diagram](../context-diagram/index.md) — tiến trình `0` được phân rã ở đây.",
          "- Cấp dưới: [5 main flow](../main-workflows-activity-diagram/index.md) và workflow; cột *Dùng trong luồng* cho biết chức năng được dùng ở đâu. "
          "Bảng truy vết đầy đủ ở [index](../index.md).", "",
          "## 7. Giới hạn", "",
          "- Tên chức năng là tên nghiệp vụ, chưa phải tên màn hình hay API; mã màn hình chốt ở giai đoạn Figma (`QĐ-08`).",
          "- Nhóm 7, 8 phụ thuộc kết quả nghiên cứu phương pháp usage (`QĐ-57d`); hình chỉ ở mức nghiệp vụ.",
          f"- Kích thước bản vẽ {size[0]:.0f}×{size[1]:.0f}; PNG xuất tỷ lệ 2.", ""]
    return "\n".join(L)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--png", action="store_true")
    ap.add_argument("--check", action="store_true")
    a = ap.parse_args()
    tree = json.load(open(TREE, encoding="utf-8"))
    probs = check_tree(tree)
    xml, size, geo = build_xml(tree)
    probs += geo
    text = guide(tree, size)
    if a.check:
        if Path(str(OUT) + ".drawio").read_text(encoding="utf-8") != xml:
            probs.append(".drawio differs from function-tree.json")
        if GUIDE.read_text(encoding="utf-8") != text:
            probs.append("guide differs from function-tree.json")
        if read_png_source(str(OUT) + ".drawio.png") != xml:
            probs.append("PNG source differs")
    if probs:
        print("FAIL", *probs, sep="\n  ")
        sys.exit(1)
    if not a.check:
        Path(str(OUT) + ".drawio").write_text(xml, encoding="utf-8", newline="\n")
        GUIDE.write_text(text, encoding="utf-8", newline="\n")
        if a.png:
            png = str(OUT) + ".drawio.png"
            subprocess.run([DRAWIO, "-x", "-f", "png", "-s", "2", "-b", "20", "-o", png, str(OUT) + ".drawio"],
                           check=True, capture_output=True, timeout=180)
            embed_png_source(png, xml)
    print(f"ok FDD features={len(tree['features'])} functions={sum(len(f['leaves']) for f in tree['features'])} "
          f"size={size[0]:.0f}x{size[1]:.0f}")


if __name__ == "__main__":
    main()
