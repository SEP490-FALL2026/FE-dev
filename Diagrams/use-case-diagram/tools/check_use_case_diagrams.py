"""Checks for the single SaaS-Sentry use case diagram and its specification.

Reads the real .drawio / .drawio.png (not layouts.json), the specification and the owning
sources (BRD, User Flows, Workflows, User Stories), then writes a JSON evidence file.
A pass is a self-check of mechanical properties; it is not an independent review and does
not replace looking at the rendered picture.

  python -X utf8 check_use_case_diagrams.py [--out <evidence.json>]
"""
import argparse
import glob
import hashlib
import json
import math
import os
import re
import struct
import urllib.parse
import xml.etree.ElementTree as ET
import zlib

import build_use_case_spec as SPECGEN
import usecase_model as M
import usecase_trace as T
from build_use_case_diagrams import (HUMAN_H, HUMAN_W, clip_ellipse, clip_rect, label_w, rect_ellipse_overlap, seg_dist,
                                     seg_ellipse_hit, seg_rect_hit, segs_cross)

HERE = os.path.dirname(os.path.abspath(__file__))
UC_DIR = os.path.dirname(HERE)
DOCS = os.path.normpath(os.path.join(UC_DIR, "..", ".."))
DRAWIO = os.path.join(UC_DIR, M.DIAGRAM_FILE + ".drawio")
PNG = DRAWIO + ".png"
SPEC = os.path.join(UC_DIR, "use-case-specification.md")
STUBS = [os.path.join(UC_DIR, n) for n in ("use-case-catalog.md", "use-case-drawing-guide.md", "use-case-traceability.md")]
WORKFLOWS = os.path.join(DOCS, "Diagrams", "workflows-activity-diagram", "index.md")
A3_W_MM, A3_H_MM = 390.0, 267.0          # A3 landscape minus 15 mm margins
MIN_BODY_PT, MIN_SECONDARY_PT = 9.0, 8.0
SELF_SCOPED = {"UC01", "UC11", "UC13", "UC27", "UC44", "UC48"}   # the only Employee use cases others inherit
MAX_CROSSINGS = 45


def sha(path):
    return hashlib.sha256(open(path, "rb").read()).hexdigest().upper()


def rel(path):
    return os.path.relpath(path, DOCS).replace("\\", "/")


# ---------------------------------------------------------------- files
def check_files(res):
    diagrams = sorted(os.path.basename(p) for p in glob.glob(os.path.join(UC_DIR, "*.drawio")))
    res["files"] = {"drawio": diagrams, "png": sorted(os.path.basename(p) for p in glob.glob(os.path.join(UC_DIR, "*.png")))}
    if diagrams != [M.DIAGRAM_FILE + ".drawio"]:
        res["errors"].append(f"expected exactly one diagram file {M.DIAGRAM_FILE}.drawio, found {diagrams}")
    if res["files"]["png"] != [M.DIAGRAM_FILE + ".drawio.png"]:
        res["errors"].append(f"expected exactly one PNG export, found {res['files']['png']}")


def check_png(res, xml_text):
    out = {"file": os.path.basename(PNG)}
    if not os.path.exists(PNG):
        res["errors"].append("PNG export missing")
        return
    d = open(PNG, "rb").read()
    out["sha256"] = hashlib.sha256(d).hexdigest().upper()
    if d[:8] != b"\x89PNG\r\n\x1a\n":
        res["errors"].append("PNG: bad signature")
        return
    i, last, embedded = 8, None, None
    while i + 8 <= len(d):
        n = struct.unpack(">I", d[i:i + 4])[0]
        t, body = d[i + 4:i + 8], d[i + 8:i + 8 + n]
        if (zlib.crc32(t + body) & 0xFFFFFFFF) != struct.unpack(">I", d[i + 8 + n:i + 12 + n])[0]:
            res["errors"].append(f"PNG: CRC error in {t!r}")
        if t == b"IHDR":
            out["size_px"] = list(struct.unpack(">II", body[:8]))
        if t == b"tEXt" and body.startswith(b"mxfile\x00"):
            embedded = urllib.parse.unquote(body[7:].decode("ascii"))
        last = t
        if t == b"IEND":
            break
        i += 12 + n
    if last != b"IEND":
        res["errors"].append("PNG: IEND missing")
    if embedded != xml_text:
        res["errors"].append("PNG: embedded diagram XML missing or different from the .drawio source")
    else:
        out["embedded_xml"] = "byte-identical to .drawio"
    res["png"] = out


# ---------------------------------------------------------------- diagram
def box(c):
    g = c.find("mxGeometry")
    return tuple(float(g.get(k, 0)) for k in ("x", "y", "width", "height"))


def plain(value):
    return re.sub(r"<[^>]+>", " ", value or "").replace("&nbsp;", " ")


def style_of(c):
    return dict(kv.split("=", 1) for kv in (c.get("style") or "").split(";") if "=" in kv)


def check_diagram(res):
    xml_text = open(DRAWIO, encoding="utf-8").read()
    root = ET.fromstring(xml_text)
    pages = root.findall("diagram")
    res["stats"]["pages"] = len(pages)
    if len(pages) != 1:
        res["errors"].append(f"diagram file must have exactly one page, found {len(pages)}")
    cells = {c.get("id"): c for c in pages[0].iter("mxCell")}
    err, warn = res["errors"].append, res["warnings"].append

    # -- structure
    b = cells.get("boundary")
    if b is None or plain(b.get("value")).strip() != "SaaS-Sentry":
        err("system boundary 'SaaS-Sentry' missing")
        return xml_text
    bb = box(b)
    st = style_of(b)
    if st.get("align") != "left" or st.get("verticalAlign") != "top":
        err("boundary name must sit at the top-left (UML 2.5.1 §18.1.4)")
    vertices = {k: c for k, c in cells.items() if c.get("vertex") == "1"}
    edges = {k: c for k, c in cells.items() if c.get("edge") == "1"}
    ucs = {k: c for k, c in vertices.items() if (c.get("style") or "").startswith("ellipse")}
    actors = {k: c for k, c in vertices.items() if "shape=umlActor" in (c.get("style") or "")}
    if set(ucs) != set(M.USE_CASES):
        err(f"use case ovals differ from model: missing {sorted(set(M.USE_CASES) - set(ucs))}, "
            f"extra {sorted(set(ucs) - set(M.USE_CASES))}")
    if set(actors) != set(M.ACTORS):
        err(f"actors differ from model: missing {sorted(set(M.ACTORS) - set(actors))}, extra {sorted(set(actors) - set(M.ACTORS))}")
    for d in M.DEFERRED_USE_CASES:
        if d in cells:
            err(f"deferred {d} must not be drawn")
    extra_vertices = set(vertices) - set(ucs) - set(actors) - {"boundary"}
    if extra_vertices:
        err(f"unexpected shapes (icons, notes, legends) on the page: {sorted(extra_vertices)}")
    for uc, c in ucs.items():
        if uc not in M.USE_CASES:
            continue  # already reported as an extra oval above
        x, y, w, h = box(c)
        if not (x >= bb[0] and y >= bb[1] and x + w <= bb[0] + bb[2] and y + h <= bb[1] + bb[3]):
            err(f"{uc} is not inside the boundary")
        v = c.get("value") or ""
        if uc not in plain(v) or M.USE_CASES[uc]["name"].split()[0] not in plain(v):
            err(f"{uc} label must carry its code and name")
        if M.USE_CASES[uc].get("abstract") and "<i>" not in v:
            err(f"abstract {uc} must be italic (UML 2.5.1 §9.2.4.1)")
    for aid, c in actors.items():
        if aid not in M.ACTORS:
            continue  # already reported as an extra actor above
        x, y, w, h = box(c)
        if not (x + w <= bb[0] or x >= bb[0] + bb[2] or y + h <= bb[1] or y >= bb[1] + bb[3]):
            err(f"actor {aid} must be outside the boundary")
        v = plain(c.get("value"))
        if M.ACTORS[aid]["kind"] == "system" and "«system»" not in v:
            err(f"system actor {aid} must carry «system»")
        if M.ACTORS[aid].get("abstract") and "<i>" not in (c.get("value") or ""):
            err(f"abstract actor {aid} must be italic")
    for c in vertices.values():
        s = style_of(c)
        if s.get("fillColor", "none") not in ("none", "#ffffff", "#FFFFFF", "default") or s.get("strokeColor", "default") not in ("default", "#000000"):
            err(f"{c.get('id')}: only white background and black lines are allowed")

    # -- semantics: exact edge set and notation
    want = {}
    for a, u, _ in M.ASSOCIATIONS:
        want[M.association_id(a, u)] = ("assoc", a, u)
    for g in M.ACTOR_GENERALIZATIONS + M.UC_GENERALIZATIONS:
        want[g["id"]] = ("gen", g["specific"], g["general"])
    for r in M.INCLUDES:
        want[r["id"]] = ("include", r["source"], r["target"])
    for r in M.EXTENDS:
        want[r["id"]] = ("extend", r["source"], r["target"])
    if set(edges) != set(want):
        err(f"edges differ from model: missing {sorted(set(want) - set(edges))}, extra {sorted(set(edges) - set(want))}")
    for eid, (kind, s, t) in want.items():
        c = edges.get(eid)
        if c is None:
            continue
        if (c.get("source"), c.get("target")) != (s, t):
            err(f"{eid}: direction must be {s} -> {t}, found {c.get('source')} -> {c.get('target')}")
        st = style_of(c)
        if kind == "assoc" and (st.get("endArrow") != "none" or st.get("dashed") == "1"):
            err(f"{eid}: association must be a solid line without arrowhead")
        if kind == "gen" and (st.get("endArrow") != "block" or st.get("endFill") != "0" or st.get("dashed") == "1"):
            err(f"{eid}: generalization needs a solid line with hollow triangle at the general end")
        if kind in ("include", "extend"):
            word = "«include»" if kind == "include" else "«extend»"
            if st.get("dashed") != "1" or st.get("endArrow") != "open" or plain(c.get("value")).strip() != word:
                err(f"{eid}: {word} needs a dashed line, open arrowhead and the keyword")
    for r in M.EXTENDS:
        base_label = plain(ucs.get(r["target"], ET.Element("x")).get("value"))
        if "extension points" not in base_label or r["point"] not in base_label:
            err(f"{r['id']}: extended {r['target']} must show extension point '{r['point']}' (UML 2.5.1 §18.2.2.5)")
    # model-level rules that the notation cannot show
    inherited_from_employee = {u for a, u, _ in M.ASSOCIATIONS if a in ("A01", "A12")}
    if not inherited_from_employee <= SELF_SCOPED | {"UC56"}:
        err(f"actor generalization would leak rights: A01/A12 own {sorted(inherited_from_employee - SELF_SCOPED)}")
    for a, u, _ in M.ASSOCIATIONS:
        parents = [g["general"] for g in M.ACTOR_GENERALIZATIONS if g["specific"] == a]
        while parents:
            p = parents.pop()
            if (p, u) in {(x, y) for x, y, _ in M.ASSOCIATIONS}:
                warn(f"{a}-{u} repeats an association inherited from {p}")
            parents += [g["general"] for g in M.ACTOR_GENERALIZATIONS if g["specific"] == p]
    for uc in M.USE_CASES:
        direct = M.actors_of(uc)
        via_parent = [g for g in M.UC_GENERALIZATIONS if g["specific"] == uc and M.actors_of(g["general"])]
        via_extend = [r for r in M.EXTENDS if r["source"] == uc]
        if not (direct or via_parent or via_extend):
            err(f"{uc} has no participating actor")
    for d in M.DEFERRED_USE_CASES:
        if M.actors_of(d):
            err(f"deferred {d} must have no association")

    # -- geometry of the real file
    geo = {}
    for k, c in ucs.items():
        x, y, w, h = box(c)
        geo[k] = ("uc", ((x + w / 2, y + h / 2), w / 2, h / 2))
    font = float(style_of(next(iter(ucs.values()))).get("fontSize", 12))
    label_boxes = {}
    for k, c in actors.items():
        x, y, w, h = box(c)
        geo[k] = ("actor", (x, y, w, h))
        lines = [plain(t) for t in re.split(r"<br\s*/?>", c.get("value") or "")]
        lw = max(label_w(t.strip(), font) for t in lines)
        lh = 20 * font / 12 * len(lines) * 0.75 + 4
        s = style_of(c)
        cx, cy = x + w / 2, y + h / 2
        if s.get("labelPosition") == "right":
            label_boxes[k] = (x + w + 2, cy - lh / 2, lw, lh)
        elif s.get("labelPosition") == "left":
            label_boxes[k] = (x - 2 - lw, cy - lh / 2, lw, lh)
        elif s.get("verticalLabelPosition") == "top":
            label_boxes[k] = (cx - lw / 2, y - 1 - lh, lw, lh)
        else:
            label_boxes[k] = (cx - lw / 2, y + h + 1, lw, lh)

    def center(k):
        kind, g = geo[k]
        return g[0] if kind == "uc" else (g[0] + g[2] / 2, g[1] + g[3] / 2)

    def clip(k, toward):
        kind, g = geo[k]
        return clip_ellipse(g[0], toward, g[1], g[2]) if kind == "uc" else clip_rect(center(k), toward, g)

    polys = {}
    for eid, c in edges.items():
        s, t = c.get("source"), c.get("target")
        if s not in geo or t not in geo:
            err(f"{eid}: connector is not attached to a use case/actor at both ends")
            continue
        pts = [(float(p.get("x")), float(p.get("y"))) for p in c.iter("mxPoint") if p.get("as") is None]
        if pts:
            polys[eid] = [clip(s, pts[0])] + pts + [clip(t, pts[-1])]
        else:
            polys[eid] = [clip(s, center(t)), clip(t, center(s))]
    obstacles = [(k, g) for k, g in geo.items()] + [("label:" + k, ("label", b)) for k, b in label_boxes.items()]
    obstacles.append(("boundary-title", ("label", (bb[0] + 8, bb[1] + 4, 150, 30))))
    collisions, crossings, near = [], [], []
    segs = []
    for eid, pts in polys.items():
        s, t = edges[eid].get("source"), edges[eid].get("target")
        for i in range(len(pts) - 1):
            ends = ({s} if i == 0 else set()) | ({t} if i == len(pts) - 2 else set())
            segs.append((eid, ends, pts[i], pts[i + 1]))
            for key, (kind, g) in obstacles:
                own = key.split(":")[-1]
                if kind in ("uc", "actor") and key in ends:
                    continue
                if kind == "uc":
                    (c0, rx, ry) = g
                    hit = seg_ellipse_hit(pts[i], pts[i + 1], c0, rx + 5, ry + 5)
                else:
                    hit = seg_rect_hit(pts[i], pts[i + 1], g, 1 if own in ends else 3)
                if hit:
                    collisions.append([eid, key])
    gen_ids = {g["id"] for g in M.ACTOR_GENERALIZATIONS}
    for i in range(len(segs)):
        for j in range(i + 1, len(segs)):
            a, b2 = segs[i], segs[j]
            if a[0] == b2[0] or (a[0] in gen_ids and b2[0] in gen_ids):
                continue
            if a[1] & b2[1]:
                ang = abs(math.remainder(math.atan2(a[3][1] - a[2][1], a[3][0] - a[2][0])
                                         - math.atan2(b2[3][1] - b2[2][1], b2[3][0] - b2[2][0]), 2 * math.pi))
                if ang < math.radians(6):
                    near.append([a[0], b2[0]])
                continue
            if segs_cross(a[2], a[3], b2[2], b2[3]):
                crossings.append([a[0], b2[0]])
            elif seg_dist(a[2], a[3], b2[2], b2[3]) < 4:
                near.append([a[0], b2[0]])
    boxes = [(k, (g[0][0] - g[1], g[0][1] - g[2], 2 * g[1], 2 * g[2]) if kind == "uc" else g) for k, (kind, g) in geo.items()]
    boxes += [("label:" + k, b) for k, b in label_boxes.items()] + [("boundary-title", (bb[0] + 8, bb[1] + 4, 150, 30))]
    overlaps = []
    for i in range(len(boxes)):
        for j in range(i + 1, len(boxes)):
            (a, r1), (b2, r2) = boxes[i], boxes[j]
            if a.split(":")[-1] == b2.split(":")[-1]:
                continue
            if not (r1[0] + r1[2] <= r2[0] or r2[0] + r2[2] <= r1[0] or r1[1] + r1[3] <= r2[1] or r2[1] + r2[3] <= r1[1]):
                overlaps.append([a, b2])
    rel_label_hits = []
    for eid in [r["id"] for r in M.INCLUDES + M.EXTENDS]:
        c = edges.get(eid)
        if c is None:
            continue
        p, q = polys[eid][0], polys[eid][1]
        off = c.find("mxGeometry").find("mxPoint[@as='offset']")
        ox, oy = (float(off.get("x", 0)), float(off.get("y", 0))) if off is not None else (0.0, 0.0)
        rf = float(style_of(c).get("fontSize", 12))
        w, h = 66 * rf / 12, 18 * rf / 12
        lb = ((p[0] + q[0]) / 2 + ox - w / 2, (p[1] + q[1]) / 2 + oy - h / 2, w, h)
        for k, (kind, g) in geo.items():
            if (kind == "uc" and rect_ellipse_overlap(lb, *g)) or (kind == "actor" and not (
                    lb[0] + lb[2] <= g[0] or g[0] + g[2] <= lb[0] or lb[1] + lb[3] <= g[1] or g[1] + g[3] <= lb[1])):
                rel_label_hits.append([eid, k])
    res["geometry"] = {"collisions": collisions, "crossings": len(crossings), "crossing_pairs": crossings,
                       "near_parallel": near, "shape_overlaps": overlaps, "relationship_labels_on_shapes": rel_label_hits}
    if collisions:
        err(f"{len(collisions)} connector(s) pass through a shape or label: {collisions[:8]}")
    if overlaps:
        err(f"overlapping shapes/labels: {overlaps[:8]}")
    if rel_label_hits:
        err(f"«include»/«extend» keyword on a shape: {rel_label_hits}")
    if near:
        warn(f"{len(near)} near-parallel connector pair(s): {near[:6]}")
    if len(crossings) > MAX_CROSSINGS:
        err(f"{len(crossings)} crossings exceed the agreed ceiling {MAX_CROSSINGS}")

    # -- A3 print size
    xs, ys = [], []
    for c in vertices.values():
        x, y, w, h = box(c)
        xs += [x, x + w]; ys += [y, y + h]
    for pts in polys.values():
        xs += [p[0] for p in pts]; ys += [p[1] for p in pts]
    for b3 in label_boxes.values():
        xs += [b3[0], b3[0] + b3[2]]; ys += [b3[1], b3[1] + b3[3]]
    wpx, hpx = max(xs) - min(xs), max(ys) - min(ys)
    scale = min(A3_W_MM / (wpx * 25.4 / 96), A3_H_MM / (hpx * 25.4 / 96))
    body_pt = round(font * 0.75 * scale, 2)
    secondary = [float(v) for c in edges.values() if c.get("value") for v in [style_of(c).get("fontSize", "12")]]
    secondary += [float(v) for c in ucs.values() for v in re.findall(r"font-size:\s*([\d.]+)px", c.get("value") or "")]
    sec_pt = round(min(secondary) * 0.75 * scale, 2) if secondary else None
    res["stats"].update({"drawing_px": [round(wpx), round(hpx)], "a3_scale": round(scale, 3), "a3_body_pt": body_pt,
                         "a3_secondary_pt": sec_pt, "use_cases": len(ucs), "actors": len(actors),
                         "associations": sum(1 for v in want.values() if v[0] == "assoc"),
                         "generalizations": sum(1 for v in want.values() if v[0] == "gen"),
                         "includes": len(M.INCLUDES), "extends": len(M.EXTENDS)})
    if body_pt < MIN_BODY_PT:
        err(f"A3: labels print at {body_pt} pt (< {MIN_BODY_PT})")
    if sec_pt is not None and sec_pt < MIN_SECONDARY_PT:
        err(f"A3: keywords/extension points print at {sec_pt} pt (< {MIN_SECONDARY_PT})")
    return xml_text


# ---------------------------------------------------------------- markdown
def slugify(h):
    h = re.sub(r"<[^>]+>", "", h).strip().lower()
    return re.sub(r"[^\w\- ]", "", h, flags=re.UNICODE).replace(" ", "-")


def anchors_of(path):
    text = open(path, encoding="utf-8").read()
    return set(re.findall(r'<a id="([^"]+)"', text)) | {slugify(h) for h in re.findall(r"^#{1,6} (.+)$", text, flags=re.M)}


def check_links(path):
    text = re.sub(r"```.*?```", "", open(path, encoding="utf-8").read(), flags=re.S)
    problems = []
    refs = dict(re.findall(r"^\[([^\]]+)\]:\s*<?([^>\n]+?)>?\s*$", text, flags=re.M))
    for r in set(re.findall(r"\]\[([^\]]+)\]", text)) - set(refs):
        problems.append(f"undefined reference [{r}]")
    for t in re.findall(r"\]\(<([^>]+)>\)", text) + re.findall(r"\]\(([^)<\s]+)\)", text) + list(refs.values()):
        t = t.strip()
        if re.match(r"^[a-z]+://", t) or t.startswith("mailto:"):
            continue
        file_part, _, frag = t.partition("#")
        target = path if not file_part else os.path.normpath(os.path.join(os.path.dirname(path), urllib.parse.unquote(file_part)))
        if not os.path.exists(target):
            problems.append(f"missing file: {t}")
        elif frag and target.endswith(".md") and frag not in anchors_of(target):
            problems.append(f"missing anchor: {t}")
    return problems


def check_docs(res):
    err = res["errors"].append
    link_problems = {}
    for p in [SPEC] + STUBS:
        probs = check_links(p)
        if probs:
            link_problems[rel(p)] = probs
    # active documents anywhere in Docs must not point at retired or missing Use Case files
    for p in glob.glob(os.path.join(DOCS, "**", "*.md"), recursive=True):
        rp = rel(p)
        if "/evidence/" in f"/{rp}" or p in [SPEC] + STUBS:
            continue
        text = open(p, encoding="utf-8").read()
        if "use-case-diagram/" not in text:
            continue
        probs = [x for x in check_links(p) if "use-case-diagram/" in x]
        if probs:
            link_problems[rp] = probs
    res["markdown"] = {"link_problems": link_problems}
    if link_problems:
        err(f"broken Markdown links/anchors: {sum(len(v) for v in link_problems.values())}")
    spec = open(SPEC, encoding="utf-8").read()
    anchors = anchors_of(SPEC)
    for code in list(M.USE_CASES) + list(M.DEFERRED_USE_CASES) + list(M.ACTORS):
        if code.lower() not in anchors:
            err(f"specification has no section anchor for {code}")
    if SPECGEN.render(spec) != spec:
        err("generated tables of the specification are stale (run build_use_case_spec.py)")
    for u in M.USE_CASES:
        if f"#### {u} — " not in spec:
            err(f"specification lacks the detailed section of {u}")


# ---------------------------------------------------------------- coverage against owning sources
def read(path):
    return open(path, encoding="utf-8").read()


def check_coverage(res):
    err = res["errors"].append
    brd, uf, wf, us_text = read(SPECGEN.BRD), read(SPECGEN.USER_FLOWS), read(WORKFLOWS), read(SPECGEN.USER_STORIES)
    fr_defined = set(re.findall(r"\*\*`?(FR-\d+\.\d+[a-z]?(?:-\d)?)`?(?::\*\*|\s—|\*\*)", brd))
    rules = SPECGEN.parse_brd_rules()
    brs = SPECGEN.parse_user_flows()
    stories = set(SPECGEN.parse_user_stories())
    flows = set(re.findall(r"^\|\s*\**(F-\d\d)\**\s*\|", uf, flags=re.M))  # scope table, User Flows 1.2
    ufs = set(re.findall(r"`(UF-\d\d)`", uf))
    wfs = set(re.findall(r"`(WF-\d\d[a-z]?)`", wf))
    traced = {k: set() for k in ("FR", "RULE", "BR", "F", "WF", "UF", "US")}
    for t in T.TRACE.values():
        for k in traced:
            traced[k] |= set(t[k])
    unknown = {"FR": traced["FR"] - fr_defined, "RULE": traced["RULE"] - set(rules), "BR": traced["BR"] - set(brs),
               "F": traced["F"] - flows, "UF": traced["UF"] - ufs, "WF": traced["WF"] - wfs, "US": traced["US"] - stories}
    uncovered = {"FR": fr_defined - traced["FR"] - set(T.NOT_MODELLED),
                 "BR": set(brs) - traced["BR"] - set(T.NOT_MODELLED),
                 "US": stories - traced["US"]}
    new_missing = []
    for rows in T.NEW_BR.values():
        for code, rule, _ in rows:
            if code not in brs or not brs[code][2].startswith(rule):
                new_missing.append(code)
    res["coverage"] = {"fr_defined": len(fr_defined), "br_defined": len(brs), "rules_defined": len(rules),
                       "stories": len(stories), "unknown_codes": {k: sorted(v) for k, v in unknown.items() if v},
                       "uncovered_codes": {k: sorted(v) for k, v in uncovered.items() if v},
                       "new_rules_not_in_user_flows": new_missing}
    if any(unknown.values()):
        err(f"trace cites codes that do not exist in their owning source: {res['coverage']['unknown_codes']}")
    if any(uncovered.values()):
        err(f"source codes without a use case: {res['coverage']['uncovered_codes']}")
    if new_missing:
        err(f"rules added for this model are missing or differ in User Flows: {new_missing}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out")
    args = ap.parse_args()
    res = {"generatedBy": "Diagrams/use-case-diagram/tools/check_use_case_diagrams.py", "kind": "self-check",
           "diagram": rel(DRAWIO), "sha256": {}, "errors": [], "warnings": [], "stats": {}}
    check_files(res)
    if os.path.exists(DRAWIO):
        res["sha256"][rel(DRAWIO)] = sha(DRAWIO)
        xml_text = check_diagram(res)
        check_png(res, xml_text)
        if os.path.exists(PNG):
            res["sha256"][rel(PNG)] = sha(PNG)
    else:
        res["errors"].append("diagram file missing")
    res["sha256"][rel(SPEC)] = sha(SPEC)
    check_docs(res)
    check_coverage(res)
    res["status"] = "pass" if not res["errors"] else "fail"
    text = json.dumps(res, ensure_ascii=False, indent=1)
    if args.out:
        open(args.out, "w", encoding="utf-8").write(text + "\n")
    print(f"status={res['status']} errors={len(res['errors'])} warnings={len(res['warnings'])} "
          f"crossings={res.get('geometry', {}).get('crossings')} a3_body_pt={res['stats'].get('a3_body_pt')} "
          f"a3_secondary_pt={res['stats'].get('a3_secondary_pt')}")
    for e in res["errors"]:
        print("ERROR", e)
    for w in res["warnings"]:
        print("WARN ", w)
    raise SystemExit(0 if not res["errors"] else 1)


if __name__ == "__main__":
    main()
