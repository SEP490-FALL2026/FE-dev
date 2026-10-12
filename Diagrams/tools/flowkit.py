"""Spec-driven generator for SaaS-Sentry activity diagrams (main flows, workflows) and screen flows.

One JSON spec per diagram (``Diagrams/specs/<ID>.json``) is the canonical source. This module:

* lays nodes out on a lane x row grid (draw.io swimlanes, nodes are children of their lane),
* routes every edge orthogonally with the A* router of ``ERD/tools/erd_drawio.py`` (boxes are
  obstacles, crossings drawn with jump arcs), places guard labels where they hit nothing,
* checks the model (UML activity rules / screen-flow rules) and the geometry before writing,
* writes ``<out>.drawio``, the PNG ``<out>.drawio.png`` with the editable source embedded, and the
  Markdown explanation ``<out>.md`` whose node/transition tables come from the same spec.

Usage (from ``Docs/Diagrams``)::

    python tools/flowkit.py build specs/MF-2.json [--png]
    python tools/flowkit.py check specs/*.json        # regenerate in memory, compare with files
"""
from __future__ import annotations

import argparse
import glob
import hashlib
import html
import json
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path

DIAGRAMS = Path(__file__).resolve().parent.parent
DOCS = DIAGRAMS.parent
sys.path.insert(0, str(DOCS / "ERD" / "tools"))
from erd_drawio import (Router, cross, embed_png_source, label_rel, rect_overlap,  # noqa: E402
                        read_png_source, seg_hits_box, segs, validate)

DRAWIO = os.environ.get("DRAWIO_PATH", r"C:\Program Files\draw.io\draw.io.exe")
FONT = "Helvetica"
FS = 12          # node font size
FS_EDGE = 11     # guard label font size
CHAR_W = 6.9     # conservative average glyph width at 12 px Helvetica
LINE_H = 15
SLOT_W = 240
HEADER_H = 36
ROW_GAP = 58
TOP_PAD = 26
TITLE_H = 40

ALLOWED_NON_ASCII = set("·–—→←↔≥≤×’‘“”…")
VI_CHARS = re.compile(r"[À-ỹĐđ]")


# ------------------------------------------------------------------ text
def wrap(text: str, width_px: float, size: int = FS) -> list[str]:
    cw = CHAR_W * size / FS
    max_chars = max(6, int(width_px / cw))
    lines = []
    for para in text.split("\n"):
        words, cur = para.split(), ""
        for w in words:
            if not cur:
                cur = w
            elif len(cur) + 1 + len(w) <= max_chars:
                cur += " " + w
            else:
                lines.append(cur)
                cur = w
        lines.append(cur)
    return lines


def text_box(text: str, size: int = FS) -> tuple[float, float]:
    lines = text.split("\n")
    w = max(len(line) for line in lines) * CHAR_W * size / FS
    return w, len(lines) * (size + 3)


# approximate Arial/Helvetica advance widths (em) — used only for single-line edge labels
_NARROW = set("iljtfI.,:;!|'[]() ")
_MID = set("r-\"*")
_WIDE = set("mwMW@")


def edge_text_w(text: str, size: int) -> float:
    em = 0.0
    for ch in text:
        if ch in _NARROW:
            em += 0.278
        elif ch in _MID:
            em += 0.333
        elif ch in _WIDE:
            em += 0.833
        elif ch.isupper():
            em += 0.667
        else:
            em += 0.556
    return em * size


def esc(s: str) -> str:
    return html.escape(s, quote=True)


def label_html(lines: list[str], bold_first: bool = False) -> str:
    out = []
    for i, line in enumerate(lines):
        t = html.escape(line, quote=False)
        out.append(f"<b>{t}</b>" if bold_first and i == 0 else t)
    return "<br>".join(out)


# ------------------------------------------------------------------ styles
BASE = f"html=1;whiteSpace=wrap;fontFamily={FONT};fontSize={FS};fontColor=#000000;strokeColor=#000000;strokeWidth=1.2;"
STYLE = {
    "action": "rounded=1;arcSize=18;fillColor=#FFFFFF;" + BASE,
    "call": "shape=mxgraph.sysml.callBehAct;fillColor=#FFFFFF;spacingRight=14;" + BASE,
    "decision": "rhombus;fillColor=#FFFFFF;fontSize=11;spacing=6;" + BASE.replace(f"fontSize={FS};", ""),
    "merge": "rhombus;fillColor=#FFFFFF;" + BASE,
    "start": "ellipse;fillColor=#000000;" + BASE,
    "end": "ellipse;shape=endState;fillColor=#000000;" + BASE,
    "flowfinal": "shape=sumEllipse;perimeter=ellipsePerimeter;fillColor=#FFFFFF;" + BASE,
    "fork": "rounded=0;fillColor=#000000;" + BASE,
    "join": "rounded=0;fillColor=#000000;" + BASE,
    "event": "shape=mxgraph.sysml.accEvent;fillColor=#FFFFFF;spacingLeft=18;" + BASE,
    "time": "shape=mxgraph.sysml.timeEvent;fillColor=#FFFFFF;labelPosition=right;verticalLabelPosition=middle;align=left;verticalAlign=middle;spacingLeft=6;" + BASE.replace("whiteSpace=wrap;", "whiteSpace=nowrap;"),
    # screen-flow node types
    "terminal": "rounded=1;arcSize=50;fillColor=#FFFFFF;strokeWidth=2;" + BASE.replace("strokeWidth=1.2;", ""),
    "screen": "rounded=0;fillColor=#FFFFFF;" + BASE,
    "system": "rounded=0;fillColor=#FFFFFF;dashed=1;dashPattern=6 3;" + BASE,
    "blocked": "rounded=0;fillColor=#FFFFFF;strokeWidth=3;" + BASE.replace("strokeWidth=1.2;", ""),
    "ref": "shape=process;size=0.07;fillColor=#FFFFFF;" + BASE,
}
EDGE = (f"edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;html=1;strokeColor=#000000;strokeWidth=1.2;"
        f"endArrow=block;endFill=1;endSize=7;jumpStyle=arc;jumpSize=10;fontFamily={FONT};fontSize={FS_EDGE};"
        "fontColor=#000000;labelBackgroundColor=#FFFFFF;")
LANE = (f"swimlane;horizontal=1;startSize={HEADER_H};html=1;whiteSpace=wrap;fillColor=#FFFFFF;swimlaneFillColor=#FFFFFF;"
        f"strokeColor=#000000;strokeWidth=1;fontFamily={FONT};fontSize=13;fontStyle=1;fontColor=#000000;collapsible=0;")
ROUND_TYPES = {"start", "end", "flowfinal", "merge", "decision"}
ACTIVITY_TYPES = {"start", "end", "flowfinal", "action", "call", "decision", "merge", "fork", "join", "event", "time"}
SCREEN_TYPES = {"terminal", "screen", "system", "decision", "blocked", "ref", "merge"}


# ------------------------------------------------------------------ sizing
def size_of(n: dict) -> tuple[int, int, list[str]]:
    t, label = n["type"], n.get("label", "")
    if t == "start":
        return 28, 28, []
    if t in ("end", "flowfinal"):
        return 30, 30, []
    if t == "merge":
        return 34, 34, []
    if t in ("fork", "join"):
        return n.get("width", 200), 8, []
    if t == "time":
        return 30, 40, wrap(label, n.get("label_width", 92))
    if t == "decision":
        w = n.get("width", 176)
        lines = wrap(label, w * 0.56, 11)
        h = max(84, len(lines) * 14 + 46)
        return w, h, lines
    w = n.get("width", 200)
    pad = 26 if t in ("call", "event", "ref") else 16
    lines = wrap(label, w - pad)
    h = max(46, len(lines) * LINE_H + 18)
    return w, h, lines


def snap(v: float) -> int:
    return int(round(v / 10.0) * 10)


# ------------------------------------------------------------------ layout
class Diagram:
    def __init__(self, spec: dict):
        self.spec = spec
        self.kind = spec.get("kind", "activity")
        self.nodes = {n["id"]: n for n in spec["nodes"]}
        self.edges = spec["edges"]
        self.lanes = spec["lanes"]
        self.lane_ix = {l["id"]: i for i, l in enumerate(self.lanes)}
        self.problems: list[str] = []
        self.warnings: list[str] = []

    # geometry -----------------------------------------------------------
    def layout(self):
        slots = {l["id"]: l.get("slots", 1) for l in self.lanes}
        slot_w = {l["id"]: l.get("slot_width", self.spec.get("slot_width", SLOT_W)) for l in self.lanes}
        x = 20
        self.lane_box = {}
        for l in self.lanes:
            w = slots[l["id"]] * slot_w[l["id"]]
            self.lane_box[l["id"]] = [x, TITLE_H + 10, w, 0]
            x += w
        self.width = x + 20
        sizes = {nid: size_of(n) for nid, n in self.nodes.items()}
        rows = sorted({n["row"] for n in self.nodes.values()})
        row_h = {r: max(sizes[nid][1]
                        for nid in self.nodes if self.nodes[nid]["row"] == r) for r in rows}
        extra = self.spec.get("row_gap", {})
        y = TITLE_H + 10 + HEADER_H + TOP_PAD
        row_top = {}
        prev = None
        for r in range(rows[0], rows[-1] + 1):
            if r not in row_h:
                row_h[r] = 20
            if prev is not None:
                y += ROW_GAP + extra.get(str(r), 0)
            row_top[r] = y
            y += row_h[r]
            prev = r
        self.height = y + 40
        for lb in self.lane_box.values():
            lb[3] = self.height - lb[1] - 10
        self.box, self.lines = {}, {}
        for nid, n in self.nodes.items():
            w, h, lines = sizes[nid]
            lx = self.lane_box[n["lane"]][0]
            sw = slot_w[n["lane"]]
            cx = lx + (n.get("slot", 0) + 0.5) * sw + n.get("dx", 0)
            if n["type"] in ("fork", "join") and "span" in n:
                def edge_x(ref, right):
                    lane, _, slot = ref.partition(":")
                    lb, w_ = self.lane_box[lane], slot_w[lane]
                    if slot:
                        k = int(slot)
                        return lb[0] + w_ * (k + (0.85 if right else 0.15))
                    return lb[0] + (lb[2] - w_ * 0.15 if right else w_ * 0.15)
                a, b = edge_x(n["span"][0], False), edge_x(n["span"][1], True)
                cx, w = (a + b) / 2, b - a
            cy = row_top[n["row"]] + row_h[n["row"]] / 2
            bx, by = snap(cx - w / 2), snap(cy - h / 2)
            if n["type"] in ("start", "end", "flowfinal", "merge"):
                bx, by = cx - w / 2, cy - h / 2
            self.box[nid] = (bx, by, w, h)
            self.lines[nid] = lines
        self.page_h = self.height + 10

    def obstacles(self):
        obs = dict(self.box)
        for nid, n in self.nodes.items():
            if n["type"] == "time":   # the label sits below the hourglass
                x, y, w, h = self.box[nid]
                tw = max(text_box(l, FS)[0] for l in self.lines[nid]) if self.lines[nid] else 0
                lh = len(self.lines[nid]) * 15 + 4
                obs[nid + "#lbl"] = (x + w + 2, y + h / 2 - lh / 2, tw + 12, lh)
        return obs

    # routing ------------------------------------------------------------
    def route(self):
        obs = self.obstacles()
        router = SlotRouter(obs, self.nodes, self.width + 40, self.page_h + 40)
        x0 = min(b[0] for b in self.lane_box.values())
        x1 = max(b[0] + b[2] for b in self.lane_box.values())
        y0 = min(b[1] for b in self.lane_box.values())
        y1 = max(b[1] + b[3] for b in self.lane_box.values())
        router.wall(x0, y0 + HEADER_H, x1, y1)
        router.borders = {round(b[0] / 10) for b in self.lane_box.values()} | {round(x1 / 10)}
        self.routes = {}
        order = sorted(range(len(self.edges)), key=lambda i: self._edge_rank(i))
        for i in order:
            e = self.edges[i]
            s, t = e["from"], e["to"]
            ss, ts = self._sides(e)
            try:
                r = router.route(s, t, ss, ts)
            except RuntimeError:
                r = router.route(s, t, "TBLR", "TBLR")
                self.warnings.append(f"edge {s}->{t}: fallback sides")
            self.routes[i] = r
        for i, r in self.routes.items():
            e = self.edges[i]
            r["poly"] = self._unhook(r["poly"], obs, {e["from"], e["to"]})
            self._straighten_bar_port(r, e, obs)
        self.place_labels(obs)

    def _straighten_bar_port(self, r, e, obs):
        """A fork/join bar is wide: slide the port along the bar instead of a short jog next to it."""
        poly = [tuple(p) for p in r["poly"]]
        own = {e["from"], e["to"]}
        clear = lambda a, b: not any(seg_hits_box(a, b, box, pad=2) for k, box in obs.items() if k not in own)
        src, tgt = self.nodes[e["from"]], self.nodes[e["to"]]
        if src["type"] in ("fork", "join") and r["s_side"] in ("T", "B") and len(poly) >= 4:
            a, b, c, d = poly[:4]
            if a[0] == b[0] and b[1] == c[1] and c[0] == d[0] and abs(b[1] - a[1]) <= 40:
                bx, _, bw, _ = self.box[e["from"]]
                if bx + 4 <= c[0] <= bx + bw - 4 and clear((c[0], a[1]), d):
                    poly = [(c[0], a[1])] + poly[3:]
                    r["s_frac"] = (c[0] - bx) / bw
        if tgt["type"] in ("fork", "join") and r["t_side"] in ("T", "B") and len(poly) >= 4:
            d, c, b, a = poly[-4:]
            if a[0] == b[0] and b[1] == c[1] and c[0] == d[0] and abs(b[1] - a[1]) <= 40:
                bx, _, bw, _ = self.box[e["to"]]
                if bx + 4 <= c[0] <= bx + bw - 4 and clear(d, (c[0], a[1])):
                    poly = poly[:-3] + [(c[0], a[1])]
                    r["t_frac"] = (c[0] - bx) / bw
        r["poly"] = [list(p) for p in poly]

    @staticmethod
    def _unhook(poly, obs, own, short=20):
        """Collapse small port hooks/steps: a long run, two short legs (<= `short`), then a perpendicular run
        become one corner, when the straightened legs touch no other node."""
        pts = [tuple(p) for p in poly]
        changed = True
        while changed:
            changed = False
            for i in range(len(pts) - 4):
                a, b, c, d, e = pts[i:i + 5]
                horiz = a[1] == b[1]
                if horiz and not (b[0] == c[0] and c[1] == d[1] and d[0] == e[0]):
                    continue
                if not horiz and not (a[0] == b[0] and b[1] == c[1] and c[0] == d[0] and d[1] == e[1]):
                    continue
                if abs(c[0] - b[0]) + abs(c[1] - b[1]) > short or abs(d[0] - c[0]) + abs(d[1] - c[1]) > short:
                    continue
                q = (d[0], b[1]) if horiz else (b[0], d[1])
                if any(seg_hits_box(s0, s1, box, pad=2) for k, box in obs.items() if k not in own
                       for s0, s1 in ((a, q), (q, e))):
                    continue
                pts = pts[:i + 1] + [q] + pts[i + 4:]
                changed = True
                break
        return [list(p) for p in pts] if poly and isinstance(poly[0], list) else pts

    def _edge_rank(self, i):
        e = self.edges[i]
        sb, tb = self.box[e["from"]], self.box[e["to"]]
        back = tb[1] + tb[3] / 2 < sb[1] + sb[3] / 2 - 5
        dist = abs(sb[0] - tb[0]) + abs(sb[1] - tb[1])
        straight = abs((sb[0] + sb[2] / 2) - (tb[0] + tb[2] / 2)) < 2
        return (1 if back else 0, 0 if straight else 1, dist)

    def _decision_sides(self, nid):
        """Give each outgoing edge of a decision its own vertex: left-most target L, right-most R, rest B."""
        if not hasattr(self, "_dec_cache"):
            self._dec_cache = {}
        if nid in self._dec_cache:
            return self._dec_cache[nid]
        sb = self.box[nid]
        scx = sb[0] + sb[2] / 2
        outs = [i for i, e in enumerate(self.edges) if e["from"] == nid and "sides" not in e]
        cx = {i: self.box[self.edges[i]["to"]][0] + self.box[self.edges[i]["to"]][2] / 2 for i in outs}
        res, free = {}, ["L", "B", "R"]
        incoming = [e for e in self.edges if e["to"] == nid]
        for e in incoming:                      # a loop-back may enter through a side vertex
            fb = self.box[e["from"]]
            if fb[1] + fb[3] / 2 > sb[1] + sb[3] / 2 + 8:
                side = "R" if fb[0] + fb[2] / 2 >= scx else "L"
                if side in free and len(free) > len(outs):
                    free.remove(side)
        cyt = {i: self.box[self.edges[i]["to"]][1] + self.box[self.edges[i]["to"]][3] / 2 for i in outs}
        tb_ = {i: self.box[self.edges[i]["to"]] for i in outs}
        below = [i for i in outs if tb_[i][0] + 6 < scx < tb_[i][0] + tb_[i][2] - 6 and cyt[i] > sb[1] + sb[3] / 2]
        for i in below[:1]:
            res[i] = "B"
            free.remove("B")
        rest = sorted((i for i in outs if i not in res), key=lambda i: abs(cx[i] - scx))
        for i in rest:
            want = "L" if cx[i] < scx - 4 else "R"
            if want in free:
                res[i] = want
            elif "B" in free:
                res[i] = "B"
            else:
                res[i] = free[0] if free else "B"
            if res[i] in free:
                free.remove(res[i])
        self._dec_cache[nid] = res
        return res

    def _sides(self, e):
        if "sides" in e:
            return e["sides"]
        s, t = e["from"], e["to"]
        sb, tb = self.box[s], self.box[t]
        scy, tcy = sb[1] + sb[3] / 2, tb[1] + tb[3] / 2
        scx, tcx = sb[0] + sb[2] / 2, tb[0] + tb[2] / 2
        stype, ttype = self.nodes[s]["type"], self.nodes[t]["type"]
        if stype == "decision":
            ss = self._decision_sides(s)[self.edges.index(e)]
            if tcy > scy + 8:
                return ss, ("T" if ttype not in ("merge",) else "TLR")
            if tcy < scy - 8:
                return ss, ("R" if tcx >= scx else "L") if ttype in ("merge", "decision") else "LR"
            return ss, ("L" if tcx > scx else "R")
        if tcy > scy + 8:   # downward
            if stype == "fork":
                ss = "B"
            else:
                ss = "B"
            ts = "T" if ttype not in ("merge", "join") or abs(tcx - scx) < 4 else ("TLR")
            if ttype == "join":
                ts = "T"
            return ss, ts
        if tcy < scy - 8:   # loop back up
            side = "R" if tcx >= scx else "L"
            if ttype in ("merge", "decision"):
                return ("LR" if stype not in ("fork", "join") else "B"), side
            return "LR", "LR"
        return ("R", "L") if tcx > scx else ("L", "R")

    def place_labels(self, obs):
        self.label_pos = {}
        placed = []
        all_segs = {i: list(segs(r["poly"])) for i, r in self.routes.items()}
        for i in sorted(self.routes):
            e = self.edges[i]
            g = e.get("guard")
            if not g:
                continue
            text = f"[{g}]"
            lw, lh = edge_text_w(text, FS_EDGE), FS_EDGE + 3
            lw, lh = lw + 8, lh + 4
            poly = self.routes[i]["poly"]
            total = sum(abs(b[0] - a[0]) + abs(b[1] - a[1]) for a, b in segs(poly))
            best = None
            # first pass: the whole label must sit inside one straight segment of its own edge
            # (on the line, or beside it), so it never spills past a bend and looks detached
            for a, b in segs(poly):
                horiz = a[1] == b[1]
                length = abs(b[0] - a[0]) + abs(b[1] - a[1])
                half = lw / 2 + 6 if horiz else lh / 2 + 6
                if length < 2 * half:
                    continue
                sgn = 1 if (b[0] - a[0] if horiz else b[1] - a[1]) > 0 else -1
                cands = (((0, 0), (0, -lh / 2 - 4), (0, lh / 2 + 4)) if horiz
                         else ((0, 0), (lw / 2 + 6, 0), (-lw / 2 - 6, 0)))
                t = half
                while t <= length - half and not best:
                    p = (a[0] + sgn * t, a[1]) if horiz else (a[0], a[1] + sgn * t)
                    for off in cands:
                        cx, cy = p[0] + off[0], p[1] + off[1]
                        rect = (cx - lw / 2, cy - lh / 2, lw, lh)
                        if self._label_ok(rect, i, obs, placed, all_segs, own_on_line=(off == (0, 0))):
                            best = (p, off, rect)
                            break
                    t += 8
                if best:
                    break
            d = 18
            while not best and d < total - 12:
                p, seg_dir = point_at(poly, d)
                cands = (((0, 0), (0, -lh / 2 - 4), (0, lh / 2 + 4)) if seg_dir == "h"
                         else ((0, 0), (lw / 2 + 6, 0), (-lw / 2 - 6, 0)))
                for off in cands:
                    cx, cy = p[0] + off[0], p[1] + off[1]
                    rect = (cx - lw / 2, cy - lh / 2, lw, lh)
                    if self._label_ok(rect, i, obs, placed, all_segs, own_on_line=(off == (0, 0))):
                        best = (p, off, rect)
                        break
                if best:
                    break
                d += 8
            if not best:
                p, _ = point_at(poly, min(28, total / 2))
                rect = (p[0] - lw / 2, p[1] - lh / 2, lw, lh)
                best = (p, (0, 0), rect)
                self.warnings.append(f"label [{g}] on {e['from']}->{e['to']} could not avoid all objects")
            placed.append(best[2])
            self.label_pos[i] = (label_rel(poly, best[0]), best[1])

    def _label_ok(self, rect, i, obs, placed, all_segs, own_on_line):
        pad = (rect[0] - 3, rect[1] - 3, rect[2] + 6, rect[3] + 6)
        for k, b in obs.items():
            if rect_overlap(pad, b):
                if self.nodes.get(k, {}).get("type") == "decision" and not rect_hits_diamond(pad, b):
                    continue
                return False
        for r in placed:
            if rect_overlap(pad, r):
                return False
        for j, ss in all_segs.items():
            if j == i:
                continue
            for a, b in ss:
                if seg_hits_box(a, b, pad, pad=0):
                    return False
        if not own_on_line:
            for a, b in all_segs[i]:
                if seg_hits_box(a, b, pad, pad=0):
                    return False
        for lb in self.lane_box.values():   # do not straddle a lane border
            if pad[0] < lb[0] < pad[0] + pad[2] and lb[0] > 25:
                return False
        return True

    # checks ------------------------------------------------------------
    def check_model(self, known_ids: set[str] | None = None):
        P = self.problems
        types = ACTIVITY_TYPES if self.kind == "activity" else SCREEN_TYPES
        ids = set(self.nodes)
        for nid, n in self.nodes.items():
            if n["type"] not in types:
                P.append(f"{nid}: type {n['type']} not allowed in {self.kind}")
            if n["lane"] not in self.lane_ix:
                P.append(f"{nid}: unknown lane {n['lane']}")
            if nid.startswith("_"):
                P.append(f"{nid}: ids starting with _ are reserved")
        ins = {n: [] for n in ids}
        outs = {n: [] for n in ids}
        for e in self.edges:
            if e["from"] not in ids or e["to"] not in ids:
                P.append(f"edge {e['from']}->{e['to']}: dangling end")
                continue
            outs[e["from"]].append(e)
            ins[e["to"]].append(e)
        starts = [n for n in ids if self.nodes[n]["type"] in ("start",) or
                  (self.nodes[n]["type"] == "terminal" and self.nodes[n].get("role") == "start")]
        initiators = [n for n in ids if self.nodes[n].get("initiator")]
        if len(starts) != 1:
            P.append(f"expected exactly one start node, found {len(starts)}")
        finals = {n for n in ids if self.nodes[n]["type"] in ("end", "flowfinal", "ref")
                  or (self.nodes[n]["type"] == "terminal" and self.nodes[n].get("role") != "start")}
        for nid, n in self.nodes.items():
            t, i, o = n["type"], len(ins[nid]), len(outs[nid])
            if nid in starts:
                if i or o != 1:
                    P.append(f"{nid}: start must have 0 in / 1 out (has {i}/{o})")
                continue
            if nid in finals:
                if t == "ref" and o > 1:
                    P.append(f"{nid}: reference node has more than one out edge")
                if t != "ref" and o:
                    P.append(f"{nid}: final node must not have outgoing edges")
                if not i:
                    P.append(f"{nid}: final node has no incoming edge")
                continue
            if t == "decision":
                if o < 2:
                    P.append(f"{nid}: decision needs >= 2 outgoing edges")
                gs = [e.get("guard") for e in outs[nid]]
                if not all(gs):
                    P.append(f"{nid}: every outgoing edge of a decision needs a guard")
                if len(set(gs)) != len(gs):
                    P.append(f"{nid}: duplicate guards")
                if i < 1:
                    P.append(f"{nid}: decision without incoming edge")
            elif t == "merge":
                if i < 2 or o != 1:
                    P.append(f"{nid}: merge needs >= 2 in / 1 out (has {i}/{o})")
            elif t == "fork":
                if i != 1 or o < 2:
                    P.append(f"{nid}: fork needs 1 in / >= 2 out (has {i}/{o})")
            elif t == "join":
                if i < 2 or o != 1:
                    P.append(f"{nid}: join needs >= 2 in / 1 out (has {i}/{o})")
            else:
                if o != 1:
                    P.append(f"{nid}: {t} needs exactly one outgoing edge (has {o})")
                if i < 1 and nid not in initiators:
                    P.append(f"{nid}: {t} has no incoming edge")
                if t in ("action", "event", "time", "screen", "system", "blocked") and any(e.get("guard") for e in outs[nid]) and t not in ("time",):
                    P.append(f"{nid}: guards belong on decision outputs, not on {t}")
            if t == "call" and known_ids is not None and n.get("ref") not in known_ids:
                P.append(f"{nid}: call references unknown diagram {n.get('ref')}")
            if t == "ref" and known_ids is not None and n.get("ref") not in known_ids:
                P.append(f"{nid}: reference to unknown diagram {n.get('ref')}")
        # reachability
        seen, stack = set(), list(starts) + initiators
        while stack:
            c = stack.pop()
            if c in seen:
                continue
            seen.add(c)
            stack += [e["to"] for e in outs.get(c, [])]
        for nid in ids - seen:
            P.append(f"{nid}: not reachable from the start")
        # every node can reach a final
        rev = {n: [] for n in ids}
        for e in self.edges:
            if e["from"] in ids and e["to"] in ids:
                rev[e["to"]].append(e["from"])
        ok, stack = set(), list(finals)
        while stack:
            c = stack.pop()
            if c in ok:
                continue
            ok.add(c)
            stack += rev[c]
        for nid in ids - ok:
            P.append(f"{nid}: cannot reach any final node (dead loop or dead end)")
        # english-only canvas text
        texts = [self.spec["title"]] + [l["label"] for l in self.lanes]
        texts += [n.get("label", "") for n in self.nodes.values()] + [e.get("guard", "") or "" for e in self.edges]
        for t in texts:
            bad = [c for c in t if ord(c) > 127 and c not in ALLOWED_NON_ASCII]
            if bad or VI_CHARS.search(t):
                P.append(f"non-English character in canvas text: {t!r}")
        # documented paths follow real edges
        pairs = {(e["from"], e["to"]) for e in self.edges}
        doc = self.spec.get("doc", {})
        for key in ("happy",):
            self._check_path(doc.get(key, []), pairs, key)
        for key in ("alternates", "unhappy"):
            for item in doc.get(key, []):
                self._check_path(item.get("path", []), pairs, f"{key}:{item.get('title')}")
        for nid, n in self.nodes.items():
            if n["type"] not in ("start", "end", "flowfinal", "merge", "fork", "join") and not n.get("vi"):
                P.append(f"{nid}: missing Vietnamese explanation (vi)")

    def _check_path(self, path, pairs, name):
        for a, b in zip(path, path[1:]):
            if (a, b) not in pairs:
                self.problems.append(f"documented path {name}: no edge {a}->{b}")
        for p in path:
            if p not in self.nodes:
                self.problems.append(f"documented path {name}: unknown node {p}")

    def check_geometry(self):
        obs = self.obstacles()
        routes = {f"{self.edges[i]['from']}->{self.edges[i]['to']}#{i}": (self.edges[i]["from"], self.edges[i]["to"], r["poly"])
                  for i, r in self.routes.items()}
        probs, crossings = validate(obs, routes)
        self.problems += [p for p in probs if "#lbl" not in p.split(":")[0]]
        self.crossings = crossings
        names = list(self.box)
        for i, a in enumerate(names):
            for b in names[i + 1:]:
                if rect_overlap(self.box[a], self.box[b]):
                    self.problems.append(f"node {a} overlaps node {b}")
        for nid, (x, y, w, h) in self.box.items():
            lb = self.lane_box[self.nodes[nid]["lane"]]
            if self.nodes[nid]["type"] in ("fork", "join") and "span" in self.nodes[nid]:
                continue
            if x < lb[0] + 4 or x + w > lb[0] + lb[2] - 4:
                self.problems.append(f"node {nid} sticks out of lane {self.nodes[nid]['lane']}")

    # xml ---------------------------------------------------------------
    def xml(self) -> str:
        s = self.spec
        cells = ['<mxCell id="0"/>', '<mxCell id="1" parent="0"/>']
        title = s["title"]
        cells.append(f'<mxCell id="_title" value="{esc(title)}" style="text;html=1;align=left;verticalAlign=middle;'
                     f'fontFamily={FONT};fontSize=16;fontStyle=1;fontColor=#000000;" vertex="1" parent="1">'
                     f'<mxGeometry x="20" y="6" width="{self.width - 40}" height="34" as="geometry"/></mxCell>')
        for l in self.lanes:
            x, y, w, h = self.lane_box[l["id"]]
            cells.append(f'<mxCell id="_lane_{l["id"]}" value="{esc(l["label"])}" style="{LANE}" vertex="1" parent="1">'
                         f'<mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" as="geometry"/></mxCell>')
        for nid, n in self.nodes.items():
            x, y, w, h = self.box[nid]
            lx, ly = self.lane_box[n["lane"]][:2]
            t = n["type"]
            style = STYLE[t]
            lines = self.lines[nid]
            bold = t in ("screen", "blocked") and n.get("code")
            if bold:
                lines = [n["code"]] + lines
            value = label_html(lines, bold_first=bool(bold)) if lines else ""
            if t in ("fork", "join") and "span" in n:   # a bar across lanes belongs to no single lane
                cells.append(f'<mxCell id="{nid}" value="" style="{style}" vertex="1" parent="1">'
                             f'<mxGeometry x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h}" as="geometry"/></mxCell>')
                continue
            cells.append(f'<mxCell id="{nid}" value="{esc(value)}" style="{style}" vertex="1" parent="_lane_{n["lane"]}">'
                         f'<mxGeometry x="{x - lx:.1f}" y="{y - ly:.1f}" width="{w}" height="{h}" as="geometry"/></mxCell>')
        for i, e in enumerate(self.edges):
            r = self.routes[i]
            sx = {"T": (r["s_frac"], 0), "B": (r["s_frac"], 1), "L": (0, r["s_frac"]), "R": (1, r["s_frac"])}[r["s_side"]]
            tx = {"T": (r["t_frac"], 0), "B": (r["t_frac"], 1), "L": (0, r["t_frac"]), "R": (1, r["t_frac"])}[r["t_side"]]
            style = EDGE + f"exitX={sx[0]:.4f};exitY={sx[1]:.4f};exitDx=0;exitDy=0;entryX={tx[0]:.4f};entryY={tx[1]:.4f};entryDx=0;entryDy=0;"
            if e.get("style") == "dashed":
                style += "dashed=1;"
            label = f"[{e['guard']}]" if e.get("guard") else ""
            pts = r["poly"][1:-1]
            if i in self.label_pos:
                rel, off = self.label_pos[i]
                geo = f'<mxGeometry x="{rel:.4f}" relative="1" as="geometry">'
            else:
                off = (0, 0)
                geo = '<mxGeometry relative="1" as="geometry">'
            if pts:
                geo += '<Array as="points">' + "".join(f'<mxPoint x="{p[0]:.1f}" y="{p[1]:.1f}"/>' for p in pts) + "</Array>"
            if off != (0, 0):
                geo += f'<mxPoint x="{off[0]:.1f}" y="{off[1]:.1f}" as="offset"/>'
            geo += "</mxGeometry>"
            cells.append(f'<mxCell id="_e{i}" value="{esc(label)}" style="{style}" edge="1" parent="1" '
                         f'source="{e["from"]}" target="{e["to"]}">{geo}</mxCell>')
        page = (f'<diagram id="{esc(s["id"])}" name="{esc(s["id"])}"><mxGraphModel dx="1400" dy="900" grid="0" gridSize="10" '
                f'guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="{self.width}" '
                f'pageHeight="{self.page_h}" background="#FFFFFF" math="0" shadow="0"><root>' + "".join(cells) +
                "</root></mxGraphModel></diagram>")
        return f'<mxfile host="flowkit" version="1.0">{page}</mxfile>\n'


def rect_hits_diamond(r, b):
    cx, cy, hw, hh = b[0] + b[2] / 2, b[1] + b[3] / 2, b[2] / 2, b[3] / 2
    x0, y0, x1, y1 = r[0], r[1], r[0] + r[2], r[1] + r[3]
    pts = [(x0 + (x1 - x0) * t / 20, y) for t in range(21) for y in (y0, y1)]
    pts += [(x, y0 + (y1 - y0) * t / 10) for t in range(11) for x in (x0, x1)]
    if any(abs(px - cx) / hw + abs(py - cy) / hh <= 1.0 for px, py in pts):
        return True
    return x0 <= cx <= x1 and y0 <= cy <= y1


def point_at(poly, d):
    acc = 0
    for a, b in segs(poly):
        L = abs(b[0] - a[0]) + abs(b[1] - a[1])
        if acc + L >= d:
            f = (d - acc) / (L or 1)
            return (a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f), ("h" if a[1] == b[1] else "v")
        acc += L
    return poly[-1], "h"


class SlotRouter(Router):
    """Router whose round/diamond nodes expose one port per side (their vertices)."""

    def __init__(self, boxes, nodes, width, height):
        super().__init__(boxes, int(width), int(height), cross=80.0, bend=8.0, margin=12)
        self.nodes = nodes
        self.borders = set()
        self.inside = None

    def wall(self, x0, y0, x1, y1):
        self.inside = (int(x0 // 10) + 1, int(y0 // 10) + 1, int(x1 // 10) - 1, int(y1 // 10) - 1)

    def route(self, src, tgt, sides_s="TBLR", sides_t="TBLR", prefer=None):
        """Same A* as erd_drawio.Router.route, plus: stay inside the pool, never travel vertically on a lane border."""
        import heapq
        from erd_drawio import DIRS, NEAR, SIDE_DIR
        starts, goals = [], {}
        for side in sides_s:
            for f in self.port_slots(src, side):
                cell, pt = self.port_cell(src, side, f)
                starts.append((cell, SIDE_DIR[side], side, f, pt))
        for side in sides_t:
            for f in self.port_slots(tgt, side):
                cell, pt = self.port_cell(tgt, side, f)
                into = {"T": "D", "B": "U", "L": "R", "R": "L"}[side]
                goals.setdefault(cell, []).append((into, side, f, pt))
        if not starts or not goals:
            raise RuntimeError(f"no free port {src}->{tgt}")
        tx = sum(c[0] for c in goals) / len(goals)
        ty = sum(c[1] for c in goals) / len(goals)
        heap, best, prev = [], {}, {}
        for cell, d, side, f, pt in starts:
            g = abs(f - 0.5) * 2.0
            best[(cell, d)] = g
            prev[(cell, d)] = ("START", side, f, pt)
            heapq.heappush(heap, (g + abs(cell[0] - tx) + abs(cell[1] - ty), g, cell, d))
        ins = self.inside
        while heap:
            _, g, cell, d = heapq.heappop(heap)
            if best.get((cell, d), 1e18) < g:
                continue
            if cell in goals:
                for into, side, f, pt in goals[cell]:
                    if d == into:
                        return self._finish(prev, (cell, d), src, tgt, side, f, pt)
            for nd, (dx, dy) in DIRS.items():
                if {nd, d} in ({"R", "L"}, {"U", "D"}):
                    continue
                nc = (cell[0] + dx, cell[1] + dy)
                if not (0 <= nc[0] < self.nx and 0 <= nc[1] < self.ny):
                    continue
                if ins and nc not in goals and not (ins[0] <= nc[0] <= ins[2] and ins[1] <= nc[1] <= ins[3]):
                    continue
                horiz = nd in "LR"
                if not horiz and nc[0] in self.borders and nc not in goals:
                    continue
                if nc in self.blocked and nc not in goals:
                    continue
                if horiz and nc in self.wire_h:
                    continue
                if not horiz and nc in self.wire_v:
                    continue
                cost = 1.0
                if nd != d:
                    if (horiz and cell in self.wire_h) or (not horiz and cell in self.wire_v):
                        continue
                    if cell[0] in self.borders:
                        continue
                    cost += self.bend
                if (horiz and nc in self.wire_v) or (not horiz and nc in self.wire_h):
                    cost += self.cross
                for ox, oy in ((0, 1), (0, -1)) if horiz else ((1, 0), (-1, 0)):
                    nb = (nc[0] + ox, nc[1] + oy)
                    if (horiz and nb in self.wire_h) or (not horiz and nb in self.wire_v):
                        cost += NEAR
                ng = g + cost
                if ng < best.get((nc, nd), 1e18):
                    best[(nc, nd)] = ng
                    prev[(nc, nd)] = (cell, d)
                    heapq.heappush(heap, (ng + abs(nc[0] - tx) + abs(nc[1] - ty), ng, nc, nd))
        raise RuntimeError(f"no route {src}->{tgt}")

    def port_slots(self, box_id, side):
        n = self.nodes.get(box_id)
        if n and n["type"] in ROUND_TYPES | {"time"}:
            return [] if self.used_ports.get((box_id, side)) else [0.5]
        if n and n["type"] in ("fork", "join"):
            if side in "LR":
                return []
            x, y, w, h = self.boxes[box_id]
            k = max(1, int(w // 30))
            fr = [(i + 0.5) / k for i in range(k)]
            used = self.used_ports.get((box_id, side), [])
            return [f for f in fr if all(abs(f - u) * w >= 28 for u in used)]
        x, y, w, h = self.boxes[box_id]
        length = w if side in "TB" else h
        k = max(1, int(length // 20))
        if k % 2 == 0:
            k -= 1
        fr = [(i + 0.5) / k for i in range(k)]
        used = self.used_ports.get((box_id, side), [])
        return [f for f in fr if all(abs(f - u) * length >= 18 for u in used)]


# ------------------------------------------------------------------ markdown
TYPE_VI = {
    "start": "Nút bắt đầu", "end": "Kết thúc hoạt động", "flowfinal": "Kết thúc nhánh (flow final)",
    "action": "Hành động", "call": "Gọi workflow con", "decision": "Rẽ nhánh", "merge": "Hợp nhánh",
    "fork": "Tách song song", "join": "Gộp song song", "event": "Chờ sự kiện", "time": "Chờ mốc thời gian",
    "terminal": "Điểm đầu/cuối", "screen": "Màn hình", "system": "Hệ thống xử lý", "blocked": "Màn hình chặn/lỗi",
    "ref": "Chuyển sang user flow khác",
}
LEGEND_ACTIVITY = [
    ("Hình tròn đặc", "Bắt đầu hoạt động (initial node)"),
    ("Hình chữ nhật bo góc", "Hành động (action) của tác nhân ở làn chứa nó"),
    ("Hình chữ nhật bo góc có ký hiệu cây đinh ba ở góc", "Gọi workflow con (call behavior) — mã workflow ghi trong nhãn"),
    ("Hình thoi có chữ", "Rẽ nhánh; mỗi cạnh ra mang điều kiện trong ngoặc vuông `[...]`"),
    ("Hình thoi nhỏ không chữ", "Hợp nhánh (merge)"),
    ("Thanh đen ngang", "Tách hoặc gộp các nhánh chạy song song (fork/join)"),
    ("Hình năm cạnh lõm", "Chờ một sự kiện từ bên ngoài luồng (accept event)"),
    ("Đồng hồ cát", "Chờ một mốc thời gian (time event)"),
    ("Vòng tròn kép đặc", "Kết thúc toàn bộ hoạt động (activity final)"),
    ("Vòng tròn có dấu nhân", "Kết thúc riêng nhánh đó, các nhánh khác vẫn chạy (flow final)"),
    ("Dây có cung nhảy", "Hai dây giao nhau nhưng **không** nối với nhau"),
]
LEGEND_SCREEN = [
    ("Hình chữ nhật bo tròn hai đầu, viền đậm", "Điểm bắt đầu hoặc kết cục của hành trình"),
    ("Hình chữ nhật viền liền, dòng đầu in đậm", "Màn hình người dùng thao tác; dòng đầu là mã màn hình đề xuất"),
    ("Hình chữ nhật viền nét đứt", "Hệ thống tự xử lý; người dùng chỉ thấy kết quả"),
    ("Hình chữ nhật viền rất đậm", "Màn hình chặn hoặc trạng thái lỗi"),
    ("Hình thoi", "Rẽ nhánh; cạnh ra mang điều kiện `[...]`"),
    ("Hình chữ nhật hai vạch đứng", "Gọi user flow khác (mã `UF-xx` trong nhãn); có cạnh ra thì hành trình quay lại và đi tiếp, không có cạnh ra thì sơ đồ này dừng tại đó"),
    ("Dây có cung nhảy", "Hai dây giao nhau nhưng **không** nối với nhau"),
]


def md_table(header, rows):
    out = ["| " + " | ".join(header) + " |", "| " + " | ".join("---" for _ in header) + " |"]
    for r in rows:
        out.append("| " + " | ".join(str(c).replace("|", "\\|").replace("\n", " ") for c in r) + " |")
    return "\n".join(out)


def node_name(n):
    lab = n.get("label") or ""
    if n["type"] in ("screen", "blocked") and n.get("code"):
        lab = f"{n['code']} — {lab}"
    return lab.replace("\n", " ") or "—"


def render_md(d: Diagram, out: Path, png_rel: str, drawio_rel: str, spec_rel: str) -> str:
    s, doc = d.spec, d.spec.get("doc", {})
    lane_label = {l["id"]: l["label"] for l in d.lanes}
    L = [f"# {s['id']} — {s['title'].split(' · ', 1)[-1]}", ""]
    L.append(f"> **Loại:** {doc.get('level', '')} · **Phiên bản:** {s.get('version', '1.0')} — {s.get('date', '')} · "
             f"**Trạng thái:** {doc.get('status', 'Đã vẽ, chờ Owner/GVHD review')}")
    L.append(">")
    L.append("> Sơ đồ là **dẫn xuất** từ quyết định Owner (`QĐ`) và BRD hiện hành; khi khác nhau, `QĐ` → BRD thắng. "
             "Quyết định trong sơ đồ là của Owner, **chưa** phải xác nhận của GVHD/hội đồng.")
    L += ["", "## 1. Mục đích và phạm vi", "", doc.get("purpose", ""), ""]
    if doc.get("scope"):
        L += ["**Phạm vi:** " + doc["scope"], ""]
    if doc.get("excluded"):
        L += ["**Không nằm trong sơ đồ này:** " + doc["excluded"], ""]
    L += ["## 2. Tệp", "", md_table(["Tệp", "Vai trò"], [
        [f"[{Path(drawio_rel).name}]({drawio_rel})", "Nguồn draw.io chỉnh sửa được (sinh từ spec)"],
        [f"[{Path(png_rel).name}]({png_rel})", "Bản xuất PNG, nhúng sẵn nguồn draw.io"],
        [f"[{Path(spec_rel).name}]({spec_rel})", "**Nguồn canonical** — sửa ở đây rồi chạy `python tools/flowkit.py build` từ `Docs/Diagrams`"],
    ]), "", f"![{s['id']}]({png_rel})", ""]
    L += ["## 3. Nguồn nghiệp vụ", "", md_table(["Mã", "Nội dung dùng trong sơ đồ"],
                                                 [[f"`{a}`", b] for a, b in doc.get("sources", [])]), ""]
    L += ["## 4. Tác nhân, kích hoạt, điều kiện", ""]
    lanes_vi = doc.get("lanes_vi", {})
    L.append(md_table(["Làn (tiếng Anh trên hình)", "Tác nhân", "Trách nhiệm trong sơ đồ"],
                      [[l["label"], lanes_vi.get(l["id"], ["", ""])[0], lanes_vi.get(l["id"], ["", ""])[1]] for l in d.lanes]))
    L += ["", f"- **Kích hoạt:** {doc.get('trigger', '')}", f"- **Tiền điều kiện:** {doc.get('pre', '')}",
          f"- **Hậu điều kiện:** {doc.get('post', '')}", ""]
    L += ["## 5. Cách đọc ký hiệu", ""]
    present = {n["type"] for n in d.nodes.values()}
    legend = LEGEND_ACTIVITY if d.kind == "activity" else LEGEND_SCREEN
    keys = {"Hình tròn đặc": "start", "Hình chữ nhật bo góc": "action", "Hình chữ nhật bo góc có ký hiệu cây đinh ba ở góc": "call",
            "Hình thoi có chữ": "decision", "Hình thoi nhỏ không chữ": "merge", "Thanh đen ngang": "fork",
            "Hình năm cạnh lõm": "event", "Đồng hồ cát": "time", "Vòng tròn kép đặc": "end", "Vòng tròn có dấu nhân": "flowfinal",
            "Hình chữ nhật bo tròn hai đầu, viền đậm": "terminal", "Hình chữ nhật viền liền, dòng đầu in đậm": "screen",
            "Hình chữ nhật viền nét đứt": "system", "Hình chữ nhật viền rất đậm": "blocked", "Hình thoi": "decision",
            "Hình chữ nhật hai vạch đứng": "ref"}
    rows = [[a, b] for a, b in legend if keys.get(a) in present or (keys.get(a) == "fork" and "join" in present)
            or a == "Dây có cung nhảy"]
    L.append(md_table(["Ký hiệu", "Nghĩa"], rows))
    L += ["", doc.get("reading", "Đọc từ trên xuống; mỗi làn là một tác nhân, hành động nằm ở làn của người thực hiện."), ""]
    L += ["## 6. Bảng node", ""]
    nrows = []
    for nid, n in d.nodes.items():
        who = lane_label[n["lane"]]
        rules = ", ".join(f"`{r}`" for r in n.get("rules", []))
        if n["type"] in ("call", "ref") and n.get("ref"):
            rules = (rules + ", " if rules else "") + f"→ `{n['ref']}`"
        nrows.append([f"`{nid}`", TYPE_VI[n["type"]], node_name(n), n.get("vi", "—"), who, rules or "—"])
    L.append(md_table(["ID", "Loại", "Nhãn trên hình", "Ý nghĩa", "Làn / người thực hiện", "Quy tắc"], nrows))
    L += ["", "## 7. Bảng chuyển tiếp", ""]
    erows = []
    for i, e in enumerate(d.edges):
        fn, tn = d.nodes[e["from"]], d.nodes[e["to"]]
        erows.append([f"`{e['from']}` → `{e['to']}`", f"`[{e['guard']}]`" if e.get("guard") else "—",
                      e.get("vi", "—"), e.get("result", f"Sang {node_name(tn)}")])
    L.append(md_table(["Từ → tới", "Nhãn điều kiện", "Điều kiện", "Kết quả"], erows))
    L += ["", f"Số đếm: **{len(d.nodes)} node · {len(d.edges)} cạnh · "
          f"{sum(1 for n in d.nodes.values() if n['type'] == 'decision')} rẽ nhánh**; giao cắt dây: **{len(d.crossings)}**.", ""]
    if doc.get("happy"):
        L += ["## 8. Happy path", ""]
        for k, nid in enumerate([p for p in doc["happy"] if d.nodes[p]["type"] not in ("merge",)], 1):
            L.append(f"{k}. `{nid}` — {node_name(d.nodes[nid])}: {d.nodes[nid].get('vi', '')}".rstrip(": "))
        L.append("")
    for key, head, none in (("alternates", "## 9. Nhánh thay thế / if-else", "Không có nhánh thay thế ngoài happy path."),
                            ("unhappy", "## 10. Nhánh lỗi / từ chối và cách kết thúc", "Sơ đồ này không có nhánh lỗi/từ chối riêng; mọi kết cục đã nêu ở mục 8–9.")):
        L += [head, ""]
        for a in doc.get(key, []):
            L.append(f"- **{a['title']}** — {' → '.join('`'+p+'`' for p in a.get('path', []))}. {a.get('note', '')}")
        if not doc.get(key):
            L.append(none)
        L.append("")
    L += ["## 11. Liên hệ với sơ đồ khác", ""]
    rel = list(doc.get("relations", []))
    for n in d.nodes.values():
        if n["type"] in ("call", "ref") and n.get("ref"):
            rel.append(f"`{n['ref']}` — gọi/chuyển tại node `{n['id']}`")
    L += [f"- {r}" for r in dict.fromkeys(rel)] + [""]
    L += ["## 12. Giới hạn và vấn đề còn mở", ""]
    L += [f"- {o}" for o in doc.get("open", ["Không có."])] + [""]
    return "\n".join(L)


# ------------------------------------------------------------------ export
def export_png(drawio_path: Path, png_path: Path, xml: str):
    cmd = [DRAWIO, "-x", "-f", "png", "-s", "2", "-b", "16", "-o", str(png_path), str(drawio_path)]
    subprocess.run(cmd, check=True, capture_output=True, timeout=180)
    embed_png_source(str(png_path), xml)


def load_known_ids():
    cat = json.load(open(DIAGRAMS / "specs" / "catalog.json", encoding="utf-8"))
    return {d["id"] for k in ("main_flows", "workflows", "user_flows") for d in cat[k]}


def build(spec_path: str, png: bool, write: bool = True):
    spec = json.load(open(spec_path, encoding="utf-8"))
    d = Diagram(spec)
    d.check_model(load_known_ids())
    d.layout()
    d.route()
    d.check_geometry()
    out = DIAGRAMS / spec["out"]
    xml = d.xml()
    md = render_md(d, out, png_rel=out.name + ".drawio.png", drawio_rel=out.name + ".drawio",
                   spec_rel=os.path.relpath(Path(spec_path).resolve(), out.parent).replace(os.sep, "/"))
    report = {"id": spec["id"], "problems": d.problems, "warnings": d.warnings, "crossings": len(d.crossings),
              "nodes": len(d.nodes), "edges": len(d.edges), "size": [d.width, d.page_h]}
    if write and not d.problems:
        out.parent.mkdir(parents=True, exist_ok=True)
        dp = out.with_suffix(".drawio") if out.suffix == "" else Path(str(out) + ".drawio")
        dp = Path(str(out) + ".drawio")
        dp.write_text(xml, encoding="utf-8", newline="\n")
        Path(str(out) + ".md").write_text(md, encoding="utf-8", newline="\n")
        if png:
            export_png(dp, Path(str(out) + ".drawio.png"), xml)
    return report, xml, md


def check(spec_path: str):
    spec = json.load(open(spec_path, encoding="utf-8"))
    report, xml, md = build(spec_path, png=False, write=False)
    out = DIAGRAMS / spec["out"]
    issues = list(report["problems"])
    for suffix, want in ((".drawio", xml), (".md", md)):
        p = Path(str(out) + suffix)
        if not p.exists():
            issues.append(f"missing {p.name}")
        elif p.read_text(encoding="utf-8") != want:
            issues.append(f"{p.name} differs from spec (regenerate)")
    png = Path(str(out) + ".drawio.png")
    if not png.exists():
        issues.append(f"missing {png.name}")
    elif read_png_source(str(png)) != xml:
        issues.append(f"{png.name} embedded source differs from .drawio (re-export)")
    report["problems"] = issues
    return report


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", choices=["build", "check"])
    ap.add_argument("specs", nargs="+")
    ap.add_argument("--png", action="store_true")
    a = ap.parse_args()
    paths = [p for s in a.specs for p in sorted(glob.glob(s))
             if "nodes" in json.load(open(p, encoding="utf-8"))]
    bad = 0
    for p in paths:
        rep = build(p, a.png)[0] if a.cmd == "build" else check(p)
        status = "FAIL" if rep["problems"] else "ok"
        bad += bool(rep["problems"])
        print(f"{status:4} {rep['id']:8} nodes={rep['nodes']} edges={rep['edges']} crossings={rep['crossings']} "
              f"size={rep['size'][0]}x{rep['size'][1]}")
        for x in rep["problems"]:
            print("     problem:", x)
        for x in rep["warnings"]:
            print("     warning:", x)
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
