"""Sinh drawio/UF-xx.drawio từ khối Mermaid của chính UF đó trong index.md (Phần 11).

Chạy tại thư mục user-flows:
    python tools/generate-uf-drawio.py UF-01 UF-15 ...
    python tools/generate-uf-drawio.py --stats UF-01      # chỉ in số nút · cạnh · điểm rẽ nhánh

Mermaid là nguồn. Sửa nút hoặc cạnh thì sửa khối Mermaid rồi chạy lại; không sửa tay .drawio.
Trước khi ghi, chạy K1–K10 của tools/check-user-flow-syntax.py trên Mermaid và trên .drawio vừa sinh;
có vi phạm thì in lỗi, không ghi tệp, exit 1.
Bố cục: xếp tầng theo đường dài nhất từ nút BẮT ĐẦU (bỏ qua cạnh quay lui), sắp thứ tự trong
tầng bằng trọng tâm các nút kề, rồi đặt tọa độ. Kiểu dáng chép từ các UF đã có (classDef); nút `([…])`
luôn vẽ bo tròn hai đầu. Mỗi đoạn ngang giữa hai tầng có làn riêng; nhãn cạnh đặt sát nút đích.
"""
import importlib.util
import re
import sys
from pathlib import Path
from xml.sax.saxutils import escape

_spec = importlib.util.spec_from_file_location(
    "check_user_flow_syntax", Path(__file__).resolve().parent / "check-user-flow-syntax.py")
checker = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(checker)

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.md"
OUT = ROOT / "drawio"

STYLE = {
    "term": "rounded=1;arcSize=50;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#1F2933;strokeWidth=2;fontStyle=1;fontSize=12;fontColor=#1F2933;",
    "ok": "rounded=1;arcSize=50;whiteSpace=wrap;html=1;fillColor=#F2F8F4;strokeColor=#3B7A57;strokeWidth=2;fontStyle=1;fontSize=12;fontColor=#1F2933;",
    "bad": "rounded=1;arcSize=50;whiteSpace=wrap;html=1;fillColor=#FCF4F4;strokeColor=#A83C3C;strokeWidth=2;fontStyle=1;fontSize=12;fontColor=#1F2933;",
    "scr": "rounded=1;arcSize=6;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#2F6690;strokeWidth=1.6;fontSize=12;fontColor=#1F2933;verticalAlign=middle;",
    "sys": "rounded=1;arcSize=6;whiteSpace=wrap;html=1;fillColor=#F1F4F7;strokeColor=#78889B;strokeWidth=1.4;fontSize=12;fontColor=#1F2933;",
    "dec": "rhombus;whiteSpace=wrap;html=1;fillColor=#FFFCF4;strokeColor=#A8761B;strokeWidth=1.6;fontSize=12;fontColor=#1F2933;",
    "blk": "rounded=1;arcSize=6;whiteSpace=wrap;html=1;fillColor=#FCF4F4;strokeColor=#A83C3C;strokeWidth=1.6;fontSize=12;fontColor=#1F2933;",
    "off": "rounded=1;arcSize=20;whiteSpace=wrap;html=1;fillColor=#E7ECF1;strokeColor=#4A5C6E;strokeWidth=1.4;dashed=1;fontSize=12;fontColor=#1F2933;",
}
EDGE = "edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;strokeColor=#5C6B7A;strokeWidth=1.5;endArrow=blockThin;endFill=1;fontSize=11;fontColor=#1F2933;labelBackgroundColor=#FFFFFF;"
REF = "edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;dashed=1;dashPattern=4 4;strokeColor=#4A5C6E;strokeWidth=1.5;endArrow=open;endFill=0;fontSize=11;fontColor=#1F2933;labelBackgroundColor=#FFFFFF;"

NODE = re.compile(r'^\s*(\w+)(\(\[|\[\[|\[|\{)"(.*)"(\]\)|\]\]|\]|\})\s*$')
EDGE_RE = re.compile(r'^\s*(\w+)\s*(?:-->\s*(?:\|"(.*?)"\|)?|-\.\s*"(.*?)"\s*\.->)\s*(\w+)\s*$')


def section(text, uf):
    m = re.search(r"^### 11\.\d+[a-z]?\. `%s` — (.+)$" % uf, text, re.M)
    if not m:
        sys.exit(f"Không thấy mục {uf}")
    body = text[m.end():]
    nxt = re.search(r"^### ", body, re.M)
    body = body[: nxt.start()] if nxt else body
    return m.group(1).strip(), body


def parse(body):
    mer = re.search(r"```mermaid\n(.*?)```", body, re.S).group(1)
    nodes, order, edges, klass, shape = {}, [], [], {}, {}
    for line in mer.splitlines():
        if m := NODE.match(line):
            nodes[m.group(1)] = m.group(3)
            order.append(m.group(1))
            shape[m.group(1)] = m.group(2)
        elif m := EDGE_RE.match(line):
            ref = m.group(3) is not None
            edges.append((m.group(1), m.group(4), m.group(2) if not ref else m.group(3), ref))
        elif m := re.match(r"^\s*class\s+([\w,]+)\s+(\w+)\s*$", line):
            for n in m.group(1).split(","):
                klass[n] = m.group(2)
    for s, t, _, _ in edges:
        for n in (s, t):
            if n not in nodes:
                sys.exit(f"Cạnh trỏ tới nút chưa khai báo: {n}")
    missing = [n for n in nodes if n not in klass]
    if missing:
        sys.exit(f"Nút thiếu class: {missing}")
    return nodes, order, edges, klass, shape


def node_style(cls, shp):
    style = STYLE[cls]
    if shp == "([":
        style = re.sub(r"arcSize=\d+", "arcSize=50", style)
        if "fontStyle=1" not in style:
            style += "fontStyle=1;"
    return style


def meta(body):
    def row(key):
        m = re.search(r"^\| \*\*%s\*\*\s*\|\s*(.*?)\s*\|\s*$" % re.escape(key), body, re.M)
        return re.sub(r"[*`]", "", m.group(1)).strip() if m else ""
    return row("Vai trò"), row("Ưu tiên trình bày")


def layout(nodes, order, edges):
    """Trả về các tầng (gồm nút ảo cho cạnh vượt tầng) và chuỗi nút ảo của từng cạnh."""
    succ = {n: [] for n in nodes}
    for s, t, _, _ in edges:
        succ[s].append(t)
    back, state = set(), {}

    def dfs(u):
        state[u] = 1
        for v in succ[u]:
            if state.get(v) == 1:
                back.add((u, v))
            elif v not in state:
                dfs(v)
        state[u] = 2

    for n in order:
        if n not in state:
            dfs(n)
    fwd = [(s, t) for s, t, _, _ in edges if (s, t) not in back]
    rank = {n: 0 for n in nodes}
    for _ in range(len(nodes) + 1):
        changed = False
        for s, t in fwd:
            if rank[t] < rank[s] + 1:
                rank[t] = rank[s] + 1
                changed = True
        if not changed:
            break
    layers, chains, links = {}, {}, []
    for n in order:
        layers.setdefault(rank[n], []).append(n)
    for i, (s, t, _, _) in enumerate(edges):
        if (s, t) in back:
            continue
        prev, chain = s, []
        for r in range(rank[s] + 1, rank[t]):
            d = f"__d{i}_{r}"
            layers[r].append(d)
            chain.append(d)
            links.append((prev, d))
            prev = d
        links.append((prev, t))
        chains[i] = chain
    allnodes = [n for r in layers for n in layers[r]]
    preds = {n: [x for x, y in links if y == n] for n in allnodes}
    succs = {n: [y for x, y in links if x == n] for n in allnodes}
    for sweep in range(12):
        down = sweep % 2 == 0
        for r in (sorted(layers) if down else sorted(layers, reverse=True)):
            nb = preds if down else succs
            other = layers.get(r - 1 if down else r + 1, [])
            pos = {n: i for i, n in enumerate(other)}
            cur = {n: i for i, n in enumerate(layers[r])}
            def key(n, pos=pos, cur=cur, nb=nb):
                ks = [pos[p] for p in nb[n] if p in pos]
                return sum(ks) / len(ks) if ks else cur[n]
            layers[r] = sorted(layers[r], key=key)
    return layers, chains, back


def size(label, cls):
    lines = label.split("<br/>")
    text_w = max(len(re.sub(r"<[^>]+>", "", l)) for l in lines)
    w = min(max(text_w * 6.6 + 34, 190), 330)
    h = len(lines) * 17 + 28
    if cls == "dec":
        w, h = w + 50, h + 36
    return round(w), round(h)


def build(uf):
    text = INDEX.read_text(encoding="utf-8")
    title, body = section(text, uf)
    title = re.sub(r"\s*\*\(.*?\)\*", "", title).replace("`", "").strip()
    nodes, order, edges, klass, shape = parse(body)
    role, prio = meta(body)
    layers, chains, back = layout(nodes, order, edges)
    sizes = {n: size(nodes[n], klass[n]) for n in nodes}
    DUMMY_W = 30
    wof = lambda n: DUMMY_W if n.startswith("__d") else sizes[n][0]
    GAP_X, GAP_Y, TOP = 46, 84, 80
    widths = {r: sum(wof(n) for n in ns) + GAP_X * (len(ns) - 1) for r, ns in layers.items()}
    full = max(widths.values())
    # Mỗi đoạn ngang trong khe dưới tầng r có làn riêng: bus rẽ nhánh của một nguồn, hoặc bước chuyển
    # cột của một cạnh vượt tầng — hai cạnh khác nhau không chạy chồng cùng một y. Đáy khe dành
    # LABEL_ZONE cho nhãn cạnh đặt ngay trên nút đích; khe nhiều làn được nới cao.
    rank = {n: r for r, ns in layers.items() for n in ns}
    groups_at = {}
    for i, (s, t, _, _) in enumerate(edges):
        if (s, t) in back:
            continue
        if chains.get(i):
            for k, r in enumerate(range(rank[s], rank[t])):
                groups_at.setdefault(r, {})[("c", i, r)] = ([s] + chains[i])[k]
        else:
            groups_at.setdefault(rank[s], {})[("f", s)] = s
    LABEL_ZONE, LANE_TOP, LANE_STEP = 40, 8, 12
    gap = {r: max(GAP_Y, LABEL_ZONE + LANE_TOP + LANE_STEP * (len(groups_at.get(r, {})) + 1)) for r in layers}
    geo, y, band = {}, TOP, {}
    for r in sorted(layers):
        ns = layers[r]
        x = (full - widths[r]) / 2
        hmax = max((sizes[n][1] for n in ns if not n.startswith("__d")), default=40)
        band[r] = (y, hmax)
        for n in ns:
            w = wof(n)
            h = hmax if n.startswith("__d") else sizes[n][1]
            geo[n] = (x, y + (hmax - h) / 2, w, h)
            x += w + GAP_X
        y += hmax + gap[r]
    cx_of = lambda n: geo[n][0] + geo[n][2] / 2
    lane = {}
    for r, groups in groups_at.items():
        keys = sorted(groups, key=lambda g: (cx_of(groups[g]), str(g)))
        base, room = band[r][0] + band[r][1] + LANE_TOP, gap[r] - LABEL_ZONE - LANE_TOP
        for k, g in enumerate(keys):
            lane[g] = base + room * (k + 1) / (len(keys) + 1)
    q = lambda v: escape(v, {chr(34): "&quot;"})
    cells = [
        f'<mxCell id="ttl" parent="1" style="text;html=1;fontSize=19;fontStyle=1;fontColor=#1F2933;align=left;verticalAlign=middle;" value="{q(uf + " · " + title)}" vertex="1"><mxGeometry x="0" y="0" width="{max(full, 900):.0f}" height="30" as="geometry"/></mxCell>',
        f'<mxCell id="sub" parent="1" style="text;html=1;fontSize=12;fontColor=#5C6B7A;align=left;verticalAlign=middle;" value="{q("Vai trò: " + role + " — Ưu tiên trình bày: " + prio)}" vertex="1"><mxGeometry x="0" y="30" width="{max(full, 900):.0f}" height="22" as="geometry"/></mxCell>',
    ]
    for n in order:
        x, yy, w, h = geo[n]
        cells.append(f'<mxCell id="{n}" parent="1" style="{node_style(klass[n], shape[n])}" value="{q(nodes[n].replace("<br/>", "<br>"))}" vertex="1">'
                     f'<mxGeometry x="{x:.0f}" y="{yy:.0f}" width="{w}" height="{h}" as="geometry"/></mxCell>')
    indeg = {n: sum(1 for _, t2, _, _ in edges if t2 == n) for n in nodes}
    bend = {}
    for i, (s, t, label, ref) in enumerate(edges):
        style = REF if ref else EDGE
        pts = ""
        if chains.get(i):
            rs = rank[s]
            p = [(cx_of(s), lane[("c", i, rs)])]
            for k, d in enumerate(chains[i]):
                r = rs + 1 + k
                p += [(cx_of(d), lane[("c", i, r - 1)]), (cx_of(d), lane[("c", i, r)])]
            style += "exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;"
            p.append((cx_of(t), lane[("c", i, rank[t] - 1)]))
            bend[i] = (p[-2][0], p[-1][1])
            pts = '<Array as="points">' + "".join(f'<mxPoint x="{a:.0f}" y="{b:.0f}"/>' for a, b in p) + "</Array>"
        elif (s, t) not in back:
            gy = lane[("f", s)]
            bend[i] = (cx_of(s), gy)
            sx, sy, sw, sh = geo[s]
            tx, ty, tw, th = geo[t]
            style += "exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;"
            pts = f'<Array as="points"><mxPoint x="{sx + sw / 2:.0f}" y="{gy:.0f}"/><mxPoint x="{tx + tw / 2:.0f}" y="{gy:.0f}"/></Array>'
        else:
            sx, sy, sw, sh = geo[s]
            tx, ty, tw, th = geo[t]
            k = sorted(e for e in back).index((s, t))
            side = full + 40 + 24 * k
            rs = next(r for r in layers if s in layers[r])
            rt = next(r for r in layers if t in layers[r])
            y1 = band[rs][0] + band[rs][1] + LANE_TOP / 2
            y2 = band[rt - 1][0] + band[rt - 1][1] + LANE_TOP / 2 if rt > 0 else band[rt][0] - LANE_TOP
            style += "exitX=0.5;exitY=1;exitDx=0;exitDy=0;entryX=0.5;entryY=0;entryDx=0;entryDy=0;"
            p = [(sx + sw / 2, y1), (side, y1), (side, y2), (tx + tw / 2, y2)]
            bend[i] = ("back", side, (y1 + y2) / 2)
            pts = '<Array as="points">' + "".join(f'<mxPoint x="{a:.0f}" y="{b:.0f}"/>' for a, b in p) + "</Array>"
        # Nhãn đặt ngay trên mũi tên vào nút đích. Nếu nút đích nhận nhiều cạnh (đoạn cuối dùng chung),
        # nhãn chuyển lên làn ngang riêng của cạnh, sát khúc rẽ cuối, về phía cạnh đi tới.
        offset = ""
        if label:
            lines = label.split("<br")
            lift = 6 + 7 * len(lines)
            tx, ty, tw, th = geo[t]
            wlab = max(len(re.sub(r"<[^>]+>|^>", "", ln)) for ln in lines) * 6 + 10
            if bend[i][0] == "back":
                # Cạnh quay lui: nhãn đứng cạnh đường dọc bên phải sơ đồ, ngoài mọi nút.
                _, bx, my = bend[i]
                offset = f'<mxPoint x="{bx + wlab / 2 + 6 - cx_of(t):.0f}" y="{my - ty:.0f}" as="offset"/>'
            elif indeg[t] == 1:
                offset = f'<mxPoint y="-{lift}" as="offset"/>'
            else:
                bx, by = bend[i]
                side = 1 if bx >= cx_of(t) else -1
                dx = side * (wlab / 2 + 8)
                dy = by - ty - (4 + 7 * len(lines))
                offset = f'<mxPoint x="{dx:.0f}" y="{dy:.0f}" as="offset"/>'
        cells.append(f'<mxCell id="{uf}_e{i}" edge="1" parent="1" source="{s}" target="{t}" style="{style}" value="{q(label or "")}">'
                     f'<mxGeometry relative="1" as="geometry"{' x="1"' if label else ''}>{pts}{offset}</mxGeometry></mxCell>')
    xml = ('<mxfile host="app.diagrams.net" type="device">'
           f'<diagram id="{uf}" name="{q(uf + " " + title)}">'
           f'<mxGraphModel grid="0" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" '
           f'pageScale="1" pageWidth="{max(full + 40 + 24 * len(back), 900) + 40:.0f}" pageHeight="{y + 40:.0f}" math="0" shadow="0">'
           '<root><mxCell id="0"/><mxCell id="1" parent="0"/>' + "".join(cells) + "</root></mxGraphModel></diagram></mxfile>")
    return xml, nodes, edges, klass


def stats(nodes, edges, klass):
    return len(nodes), len(edges), sum(1 for n in nodes if klass[n] == "dec")


def main():
    args = sys.argv[1:]
    only_stats = "--stats" in args
    failed = False
    for uf in [a for a in args if a != "--stats"]:
        xml, nodes, edges, klass = build(uf)
        n, e, d = stats(nodes, edges, klass)
        try:
            report = checker.check_uf(uf, INDEX.read_text(encoding="utf-8"), xml)
        except checker.DrawioUnavailable as exc:
            sys.exit(f"{uf}: TỪ CHỐI SINH — {exc}")
        if report["violations"]:
            failed = True
            print(f"{uf}: TỪ CHỐI SINH — {len(report['violations'])} vi phạm ký pháp", file=sys.stderr)
            for item in report["violations"]:
                print(f"   {item['check']}: {item['message']}", file=sys.stderr)
            continue
        if not only_stats:
            (OUT / f"{uf}.drawio").write_text(xml, encoding="utf-8")
        print(f"{uf}: {n} nút · {e} cạnh · {d} điểm rẽ nhánh" + ("" if only_stats else f" -> drawio/{uf}.drawio"))
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main()
