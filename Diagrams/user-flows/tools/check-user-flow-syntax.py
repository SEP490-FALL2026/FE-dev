"""Kiểm ký pháp K1–K10 (index.md mục 11.2) cho khối Mermaid của từng UF-xx và hình vẽ .drawio.

Chạy tại thư mục user-flows:
    python tools/check-user-flow-syntax.py                     # cả 16 UF
    python tools/check-user-flow-syntax.py UF-01 UF-11 --json out.json
    python tools/check-user-flow-syntax.py --drawio "C:\\Program Files\\draw.io\\draw.io.exe"

Exit 0 khi mọi UF pass K0–K10; exit 1 khi có vi phạm; exit 2 khi không chạy được draw.io.
tools/generate-uf-drawio.py gọi check_uf() và từ chối ghi .drawio nếu có vi phạm.

Ngữ nghĩa, theo bảng ký pháp mục 11.2:
- Điểm bắt đầu = nút class `term`. Điểm kết thúc = mọi nút hình bo tròn hai đầu `([…])` còn lại
  (bảng ký pháp định nghĩa kết thúc bằng HÌNH; màu/class ok·bad·blk chỉ nói kết cục tốt/xấu).
- Nút `[[UF-xx …]]` là ĐIỂM CHUYỂN PHẠM VI: không phải điểm kết thúc, không tính cho K2/K4; được
  phép không có cạnh ra, và K6 chấp nhận đường đi dừng tại nó — với điều kiện nhãn mang đúng một mã
  `UF-xx` là một trong 16 User Flow hiện hành (có mục ### 11.x), khác chính UF đang kiểm. Mã thiếu,
  không tồn tại hoặc tự trỏ về chính mình là reference mồ côi → vi phạm K6.
- Cạnh gồm control-flow `-->` và tham chiếu `-. "…" .->`; bậc vào/ra và khả năng tới được
  tính trên cả hai. K8 chỉ đếm cạnh control-flow.
- K0: dòng Mermaid không nhận dạng, nút/cạnh/class thiếu, .drawio lệch tập nút hoặc cạnh.
- K9, K10: đo trên SVG do chính draw.io Desktop render từ .drawio (`data-cell-id`), nên dùng
  đúng đường cạnh draw.io vẽ, kể cả cạnh tự định tuyến.
- T1 (tràn chữ) CHỈ là cảnh báo: ước lượng theo thước đo của bộ sinh (6,6 px/ký tự, 17 px/dòng),
  chưa hiệu chỉnh với phông thật; không tính vào pass/fail và không thay việc xem ảnh.
"""
import argparse
import html
import io
import json
import math
import os
import re
import subprocess
import sys
import tempfile
import xml.etree.ElementTree as ET
from pathlib import Path

if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.md"
DRAWIO_DIR = ROOT / "drawio"
UF_IDS = [f"UF-{i:02d}" for i in range(1, 17)]
DEFAULT_DRAWIO = [r"C:\Program Files\draw.io\draw.io.exe", r"C:\Program Files (x86)\draw.io\draw.io.exe"]

NODE = re.compile(r'^\s*(\w+)(\(\[|\[\[|\[|\{)"(.*)"(\]\)|\]\]|\]|\})\s*$')
EDGE = re.compile(r'^\s*(\w+)\s*(?:-->\s*(?:\|"(.*?)"\|)?|-\.\s*"(.*?)"\s*\.->)\s*(\w+)\s*$')
CLASS = re.compile(r"^\s*class\s+([\w,]+)\s+(\w+)\s*$")
IGNORED = re.compile(r"^\s*(flowchart\s+TB|classDef\s+\w+\s+.+|linkStyle\s+.+)\s*$")
START, TERMINAL_SHAPE, HANDOFF_SHAPE = {"term"}, "([", "[["
SVG_NS = "{http://www.w3.org/2000/svg}"


class DrawioUnavailable(RuntimeError):
    pass


def find_drawio(explicit=None):
    for c in [explicit, os.environ.get("DRAWIO_PATH"), *DEFAULT_DRAWIO]:
        if c and Path(c).is_file():
            return Path(c)
    raise DrawioUnavailable("Không tìm thấy draw.io Desktop (--drawio hoặc DRAWIO_PATH) — không kiểm được K9/K10.")


def mermaid_block(text, uf):
    m = re.search(r"^### 11\.\d+[a-z]?\. `%s` — (.+)$" % uf, text, re.M)
    if not m:
        return None, f"không thấy mục ### 11.x. `{uf}`"
    body = text[m.end():]
    nxt = re.search(r"^### ", body, re.M)
    body = body[: nxt.start()] if nxt else body
    blocks = re.findall(r"```mermaid\n(.*?)```", body, re.S)
    if len(blocks) != 1:
        return None, f"mục {uf} có {len(blocks)} khối mermaid, kỳ vọng 1"
    return blocks[0], None


def check_mermaid(uf, text):
    """K0–K8 trên khối Mermaid. Trả về (violations, graph|None)."""
    mer, err = mermaid_block(text, uf)
    if err:
        return [("K0", err)], None
    v, nodes, edges, klass, shape = [], {}, [], {}, {}
    for line in mer.splitlines():
        if not line.strip() or IGNORED.match(line):
            continue
        if m := NODE.match(line):
            if m.group(1) in nodes:
                v.append(("K0", f"nút {m.group(1)} khai báo hai lần"))
            nodes[m.group(1)] = m.group(3)
            shape[m.group(1)] = m.group(2)
        elif m := EDGE.match(line):
            ref = m.group(3) is not None
            edges.append((m.group(1), m.group(4), (m.group(3) if ref else m.group(2)) or "", ref))
        elif m := CLASS.match(line):
            for n in m.group(1).split(","):
                klass[n] = m.group(2)
        else:
            v.append(("K0", f"dòng Mermaid không nhận dạng: {line.strip()[:80]}"))
    for s, t, _, _ in edges:
        for n in (s, t):
            if n not in nodes:
                v.append(("K0", f"cạnh {s}->{t} trỏ tới nút chưa khai báo {n}"))
    for n in nodes:
        if n not in klass:
            v.append(("K0", f"nút {n} thiếu class"))
    if any(c == "K0" for c, _ in v):
        return v, None

    indeg = {n: 0 for n in nodes}
    outdeg = {n: 0 for n in nodes}
    succ = {n: [] for n in nodes}
    for s, t, _, _ in edges:
        outdeg[s] += 1
        indeg[t] += 1
        succ[s].append(t)
    starts = [n for n in nodes if klass[n] in START]
    ends = [n for n in nodes if shape[n] == TERMINAL_SHAPE and klass[n] not in START]

    if len(starts) != 1:
        v.append(("K1", f"có {len(starts)} điểm bắt đầu {starts}, kỳ vọng đúng 1"))
    for n in starts:
        if shape[n] != TERMINAL_SHAPE:
            v.append(("K1", f"điểm bắt đầu {n} không dùng hình bo tròn hai đầu"))
    if not ends:
        v.append(("K2", "không có điểm kết thúc (nút hình bo tròn hai đầu)"))
    for n in starts:
        if indeg[n] != 0:
            v.append(("K3", f"điểm bắt đầu {n} có {indeg[n]} cạnh vào, kỳ vọng 0"))
        if outdeg[n] != 1:
            v.append(("K3", f"điểm bắt đầu {n} có {outdeg[n]} cạnh ra, kỳ vọng đúng 1"))
    for n in ends:
        if outdeg[n] != 0:
            v.append(("K4", f"điểm kết thúc {n} có {outdeg[n]} cạnh ra, kỳ vọng 0"))

    reach, stack = set(), list(starts)
    while stack:
        u = stack.pop()
        if u not in reach:
            reach.add(u)
            stack.extend(succ[u])
    for n in nodes:
        if n in starts:
            continue
        if indeg[n] == 0:
            v.append(("K5", f"nút {n} ({klass[n]}) không có cạnh vào — mồ côi"))
        elif n not in reach:
            v.append(("K5", f"nút {n} ({klass[n]}) không tới được từ điểm bắt đầu — mồ côi"))

    existing_ufs = {u for u in UF_IDS if re.search(r"^### 11\.\d+[a-z]?\. `%s` — " % u, text, re.M)}
    handoffs = []
    for n in nodes:
        if shape[n] != HANDOFF_SHAPE:
            continue
        codes = sorted(set(re.findall(r"\bUF-\d{2}\b", re.sub(r"<[^>]+>", " ", nodes[n]))))
        if len(codes) != 1:
            v.append(("K6", f"điểm chuyển phạm vi {n} cần đúng một mã UF mục tiêu, thấy {codes or 'không có'}"))
        elif codes[0] == uf:
            v.append(("K6", f"điểm chuyển phạm vi {n} trỏ về chính {uf} — reference mồ côi"))
        elif codes[0] not in existing_ufs:
            v.append(("K6", f"điểm chuyển phạm vi {n} trỏ tới {codes[0]} không có trong 16 User Flow hiện hành"))
        else:
            handoffs.append(n)

    can_end, changed = set(ends) | set(handoffs), True
    while changed:
        changed = False
        for n in nodes:
            if n not in can_end and any(t in can_end for t in succ[n]):
                can_end.add(n)
                changed = True
    for n in nodes:
        if n in ends or n in handoffs:
            continue
        if outdeg[n] == 0:
            v.append(("K6", f"nút {n} ({klass[n]}) không có cạnh ra và không phải điểm kết thúc/chuyển phạm vi — nhánh cụt"))
        elif n not in can_end:
            v.append(("K6", f"nút {n} ({klass[n]}) không dẫn tới điểm kết thúc hoặc chuyển phạm vi nào — nhánh cụt"))

    for n in nodes:
        if klass[n] != "dec":
            continue
        outs = [(t, label, ref) for s, t, label, ref in edges if s == n]
        for t, label, _ in outs:
            if not label.strip():
                v.append(("K7", f"cạnh ra {n}->{t} của điểm rẽ nhánh không có guard"))
        ctl = [o for o in outs if not o[2]]
        if len(ctl) < 2:
            v.append(("K8", f"điểm rẽ nhánh {n} có {len(ctl)} cạnh ra control-flow, kỳ vọng ≥ 2"))
    return v, {"nodes": nodes, "edges": edges, "klass": klass}


def _num(el, key, default=0.0):
    val = el.get(key)
    return float(val) if val not in (None, "") else default


def read_drawio(xml_text):
    """Trả về (violations, vertices{id:(w,h,style,value)}, edges[(id,src,tgt)])."""
    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError as exc:
        return [("K0", f"XML .drawio không đọc được: {exc}")], {}, []
    v = []
    if len(root.findall("diagram")) != 1:
        v.append(("K0", f".drawio có {len(root.findall('diagram'))} trang, kỳ vọng 1"))
    verts, edges = {}, []
    for cell in root.iter("mxCell"):
        cid, geo = cell.get("id"), cell.find("mxGeometry")
        if cell.get("vertex") == "1" and cid not in ("ttl", "sub") and geo is not None:
            verts[cid] = (_num(geo, "width"), _num(geo, "height"), cell.get("style") or "", cell.get("value") or "")
        elif cell.get("edge") == "1":
            edges.append((cid, cell.get("source"), cell.get("target")))
    return v, verts, edges


def _path_points(d):
    toks = re.findall(r"[MLQCZmlqcz]|-?\d*\.?\d+(?:e-?\d+)?", d)
    pts, nums = [], []
    for tok in toks:
        if tok.isalpha():
            continue
        nums.append(float(tok))
        if len(nums) == 2:
            pts.append(tuple(nums))
            nums = []
    return pts


def _shape_of(g):
    """Hình đầu tiên của một cell trong SVG: ('rect', x, y, w, h) hoặc ('poly', [pts])."""
    for el in g.iter():
        tag = el.tag.replace(SVG_NS, "")
        if tag == "foreignObject" or tag == "text":
            return None
        if tag == "rect":
            return ("rect", _num(el, "x"), _num(el, "y"), _num(el, "width"), _num(el, "height"))
        if tag == "ellipse":
            cx, cy, rx, ry = _num(el, "cx"), _num(el, "cy"), _num(el, "rx"), _num(el, "ry")
            return ("rect", cx - rx, cy - ry, 2 * rx, 2 * ry)
        if tag == "path" and el.get("d"):
            pts = _path_points(el.get("d"))
            if len(pts) >= 3:
                return ("poly", pts)
    return None


def _bbox(shape):
    if shape[0] == "rect":
        return shape[1], shape[2], shape[1] + shape[3], shape[2] + shape[4]
    xs, ys = [p[0] for p in shape[1]], [p[1] for p in shape[1]]
    return min(xs), min(ys), max(xs), max(ys)


def _inside(shape, px, py, pad=2.0):
    x0, y0, x1, y1 = _bbox(shape)
    if not (x0 + pad < px < x1 - pad and y0 + pad < py < y1 - pad):
        return False
    if shape[0] == "rect":
        return True
    pts, cx, cy = shape[1], (x0 + x1) / 2, (y0 + y1) / 2
    k = max(0.0, 1 - 2 * pad / max(1.0, min(x1 - x0, y1 - y0)))
    poly = [(cx + (x - cx) * k, cy + (y - cy) * k) for x, y in pts]
    hit, j = False, len(poly) - 1
    for i in range(len(poly)):
        (xi, yi), (xj, yj) = poly[i], poly[j]
        if (yi > py) != (yj > py) and px < (xj - xi) * (py - yi) / ((yj - yi) or 1e-9) + xi:
            hit = not hit
        j = i
    return hit


def render_svg(xml_text, drawio_exe):
    with tempfile.TemporaryDirectory(prefix="uf-check-") as tmp:
        src, out = Path(tmp) / "page.drawio", Path(tmp) / "page.svg"
        src.write_text(xml_text, encoding="utf-8")
        proc = subprocess.run([str(drawio_exe), "-x", "-f", "svg", "-b", "10", "--svg-theme", "light",
                               "-o", str(out), str(src)], capture_output=True, text=True)
        if proc.returncode != 0 or not out.is_file():
            raise DrawioUnavailable(f"draw.io không render được SVG (exit {proc.returncode}): {proc.stderr.strip()[:200]}")
        return out.read_text(encoding="utf-8")


def check_geometry(uf, xml_text, graph, drawio_exe):
    """K0 (đồng bộ với Mermaid), K9, K10 trên SVG draw.io; T1 là cảnh báo."""
    v, warn = [], []
    rv, verts, dedges = read_drawio(xml_text)
    v += rv
    if graph is not None and not rv:
        missing, extra = sorted(set(graph["nodes"]) - set(verts)), sorted(set(verts) - set(graph["nodes"]))
        if missing or extra:
            v.append(("K0", f".drawio lệch tập nút so với Mermaid — thiếu {missing}, thừa {extra}"))
        want = sorted((s, t) for s, t, _, _ in graph["edges"])
        have = sorted((s, t) for _, s, t in dedges)
        if want != have:
            from collections import Counter
            cw, ch = Counter(want), Counter(have)
            v.append(("K0", f".drawio lệch tập cạnh so với Mermaid — thiếu {sorted((cw - ch).elements())}, "
                            f"thừa {sorted((ch - cw).elements())}"))
    if rv:
        return v, warn, len(verts), len(dedges)

    svg = ET.fromstring(render_svg(xml_text, drawio_exe))
    shapes, paths = {}, {}
    edge_ids = {cid for cid, _, _ in dedges}
    for g in svg.iter(f"{SVG_NS}g"):
        cid = g.get("data-cell-id")
        if not cid:
            continue
        if cid in verts and cid not in shapes:
            shp = _shape_of(g)
            if shp:
                shapes[cid] = shp
        elif cid in edge_ids and cid not in paths:
            first = next((p for p in g.iter(f"{SVG_NS}path") if p.get("fill") == "none"), None)
            if first is not None:
                paths[cid] = _path_points(first.get("d"))
    for cid in verts:
        if cid not in shapes:
            v.append(("K0", f"không đọc được hình của nút {cid} trong SVG draw.io"))
    for cid, _, _ in dedges:
        if cid not in paths:
            v.append(("K0", f"không đọc được đường của cạnh {cid} trong SVG draw.io"))

    ids = list(shapes)
    for i, a in enumerate(ids):
        ax0, ay0, ax1, ay1 = _bbox(shapes[a])
        for b in ids[i + 1:]:
            bx0, by0, bx1, by1 = _bbox(shapes[b])
            ix0, iy0, ix1, iy1 = max(ax0, bx0), max(ay0, by0), min(ax1, bx1), min(ay1, by1)
            if ix1 - ix0 <= 0.5 or iy1 - iy0 <= 0.5:
                continue
            grid = [(ix0 + (ix1 - ix0) * p / 8, iy0 + (iy1 - iy0) * q / 8) for p in range(9) for q in range(9)]
            if any(_inside(shapes[a], x, y) and _inside(shapes[b], x, y) for x, y in grid):
                v.append(("K9", f"nút {a} và {b} chồng lên nhau"))

    ends = {cid: (s, t) for cid, s, t in dedges}
    for cid, pts in paths.items():
        s, t = ends[cid]
        hits = set()
        for (px, py), (qx, qy) in zip(pts, pts[1:]):
            n = max(1, int(math.hypot(qx - px, qy - py) / 2))
            for k in range(n + 1):
                x, y = px + (qx - px) * k / n, py + (qy - py) * k / n
                for other, shp in shapes.items():
                    if other not in (s, t) and _inside(shp, x, y):
                        hits.add(other)
        for other in sorted(hits):
            v.append(("K10", f"cạnh {s}->{t} ({cid}) đi xuyên qua nút {other}"))

    for cid, (w, h, style, value) in verts.items():
        is_dec = "rhombus" in style
        avail_w, avail_h = w - 34 - (50 if is_dec else 0), h - (36 if is_dec else 0)
        lines_txt = [re.sub(r"<[^>]+>", "", p) for p in re.split(r"<br\s*/?>", html.unescape(value))]
        lines = sum(max(1, math.ceil(len(l) * 6.6 / avail_w)) for l in lines_txt) if avail_w > 0 else 99
        if lines * 17 + 28 > avail_h + 0.5:
            warn.append(("T1", f"nút {cid} có thể tràn chữ (ước lượng): cần {lines * 17 + 28}px, có {avail_h:.0f}px"))
    return v, warn, len(verts), len(dedges)


def check_uf(uf, text, drawio_xml, drawio_exe=None):
    exe = drawio_exe or find_drawio()
    mv, graph = check_mermaid(uf, text)
    gv, warn, n_nodes, n_edges = check_geometry(uf, drawio_xml, graph, exe)
    return {
        "uf": uf,
        "mermaidNodes": len(graph["nodes"]) if graph else None,
        "mermaidEdges": len(graph["edges"]) if graph else None,
        "drawioNodes": n_nodes,
        "drawioEdges": n_edges,
        "violations": [{"check": c, "message": m} for c, m in mv + gv],
        "warnings": [{"check": c, "message": m} for c, m in warn],
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("ufs", nargs="*", help="Mặc định cả 16 UF")
    ap.add_argument("--json", help="Ghi kết quả JSON ra đường dẫn này")
    ap.add_argument("--drawio", help="Đường dẫn draw.io.exe")
    args = ap.parse_args()
    try:
        exe = find_drawio(args.drawio)
    except DrawioUnavailable as exc:
        print(exc, file=sys.stderr)
        sys.exit(2)
    text = INDEX.read_text(encoding="utf-8")
    results = []
    for uf in args.ufs or UF_IDS:
        f = DRAWIO_DIR / f"{uf}.drawio"
        if not f.is_file():
            results.append({"uf": uf, "violations": [{"check": "K0", "message": f"thiếu {f.name}"}], "warnings": []})
        else:
            try:
                results.append(check_uf(uf, text, f.read_text(encoding="utf-8"), exe))
            except DrawioUnavailable as exc:
                print(exc, file=sys.stderr)
                sys.exit(2)
        r = results[-1]
        status = "PASS" if not r["violations"] else f"FAIL ({len(r['violations'])})"
        print(f"{uf}: {status} · Mermaid {r.get('mermaidNodes')} nút/{r.get('mermaidEdges')} cạnh · "
              f"drawio {r.get('drawioNodes')} nút/{r.get('drawioEdges')} cạnh · cảnh báo T1: {len(r['warnings'])}")
        for item in r["violations"]:
            print(f"   {item['check']}: {item['message']}")
    counts = {}
    for r in results:
        for item in r["violations"]:
            counts[item["check"]] = counts.get(item["check"], 0) + 1
    failed = [r["uf"] for r in results if r["violations"]]
    summary = {"checked": len(results), "passed": len(results) - len(failed), "failed": failed,
               "violationsByCheck": counts, "t1Warnings": sum(len(r["warnings"]) for r in results),
               "drawio": str(exe)}
    print(f"Tổng: {summary['passed']}/{summary['checked']} pass · vi phạm: {counts or 0} · cảnh báo T1: {summary['t1Warnings']}")
    if args.json:
        Path(args.json).write_text(json.dumps({"summary": summary, "results": results}, ensure_ascii=False, indent=2),
                                   encoding="utf-8")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
