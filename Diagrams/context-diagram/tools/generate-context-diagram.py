"""Sinh SaaS-Sentry-Context-Diagram.drawio từ bảng mục 3 và mục 4 của index.md.

Chạy tại thư mục context-diagram:  python tools/generate-context-diagram.py
Sửa luồng thì sửa bảng trong index.md rồi chạy lại — không sửa tay file .drawio.

Bố cục: vòng tròn hệ thống là một elip đứng ở giữa; tác nhân xếp hai bên;
mỗi luồng là một đường ngang riêng, cắt elip tại đúng điểm của nó, nên
không có hai mũi tên nào dùng chung điểm nối và không có nhãn nào chồng nhau.
"""
import math
import re
import sys
from pathlib import Path
from xml.sax.saxutils import escape

HERE = Path(__file__).resolve().parent.parent
INDEX = HERE / "index.md"
OUT = HERE / "SaaS-Sentry-Context-Diagram.drawio"

# Bên trái: hệ thống ngoài, người nhận báo cáo, người vận hành. Bên phải: người dùng nghiệp vụ.
LEFT = ["E6", "E7", "E8", "E9", "E10", "E4", "E5"]
RIGHT = ["E1", "E2", "E3", "E11"]
SYSTEMS = {"E6", "E7", "E8", "E9"}

ROW = 30          # khoảng cách giữa hai luồng
PAD = 18          # đệm trên/dưới trong hộp tác nhân
GAP_ACTORS = 46   # khoảng cách giữa hai hộp tác nhân
ACTOR_W = 200
GAP = 470         # từ mép hộp tác nhân tới chỗ rộng nhất của elip
HALF_W = 230      # nửa bề rộng elip
TOP = 210
LABEL_D = 240     # tâm nhãn cách mép hộp tác nhân


def clean(md: str) -> str:
    md = re.sub(r"\*\(.*?\)\*", "", md)
    md = md.replace("**", "").replace("*", "").replace("`", "")
    return re.sub(r"\s+", " ", md).strip()


def parse(text: str):
    actors, flows = {}, []
    section = None
    current = None
    for line in text.splitlines():
        if line.startswith("## "):
            section = line[3:5]
        if line.startswith("### 4."):
            m = re.search(r"\b(E\d+)\b", line)
            current = m.group(1) if m else None
            if line.startswith("### 4.8"):
                current = "STOP"
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if section == "3." and re.fullmatch(r"\*\*E\d+\*\*", cells[0]):
            code = cells[0].strip("*")
            parts = [clean(p) for p in cells[1].split("<br/>")]
            actors[code] = [p for p in parts if p]
        elif section == "4." and current not in (None, "STOP"):
            if not re.fullmatch(r"L\d\d", cells[0]):
                continue  # tiêu đề, dòng kẻ, hoặc luồng đã ngừng dùng (~~Lxx~~)
            direction = cells[1]
            if re.fullmatch(r"E\d+", cells[2]):
                actor, name = cells[2], cells[3]
            else:
                actor, name = current, cells[2]
            flows.append((cells[0], actor, direction == "→", clean(name)))
    return actors, flows


def main():
    actors, flows = parse(INDEX.read_text(encoding="utf-8"))
    placed = set(LEFT) | set(RIGHT)
    missing = set(actors) ^ placed
    if missing:
        sys.exit(f"Tác nhân trong bảng không khớp bố cục: {sorted(missing)}")
    codes = [f[0] for f in flows]
    if len(codes) != len(set(codes)):
        sys.exit("Trùng mã luồng")

    by_actor = {a: [] for a in placed}
    for f in flows:
        by_actor[f[1]].append(f)
    for a in by_actor:  # luồng vào trước, luồng ra sau
        by_actor[a].sort(key=lambda f: (not f[2],))

    def column(order):
        y, boxes, rows = TOP, {}, []
        for a in order:
            n = max(len(by_actor[a]), 1)
            h = 2 * PAD + (n - 1) * ROW + 16
            boxes[a] = (y, h)
            for i, f in enumerate(by_actor[a]):
                rows.append((f, y + PAD + 8 + i * ROW))
            y += h + GAP_ACTORS
        return boxes, rows, y - GAP_ACTORS

    lboxes, lrows, lbottom = column(LEFT)
    rboxes, rrows, rbottom = column(RIGHT)
    rshift = (lbottom - rbottom) / 2  # canh giữa cột phải theo chiều dọc
    rboxes = {a: (y + rshift, h) for a, (y, h) in rboxes.items()}
    rrows = [(f, y + rshift) for f, y in rrows]

    span_top = TOP
    span_bot = lbottom
    cy = (span_top + span_bot) / 2
    semi_h = (span_bot - span_top) / 2 / 0.9 + 20
    cx = 40 + ACTOR_W + GAP + HALF_W
    right_x = cx + HALF_W + GAP
    page_w = right_x + ACTOR_W + 60
    page_h = cy + semi_h + 150

    cells = []

    def vertex(cid, value, x, y, w, h, style):
        cells.append(
            f'<mxCell id="{cid}" value="{escape(value, {chr(34): "&quot;"})}" style="{style}" vertex="1" parent="1">'
            f'<mxGeometry x="{x:.0f}" y="{y:.0f}" width="{w:.0f}" height="{h:.0f}" as="geometry"/></mxCell>'
        )

    vertex("title", "<b>Context Diagram (DFD mức 0) — SaaS-Sentry</b><br>11 tác nhân ngoài · "
           f"{len(flows)} luồng dữ liệu · nguồn: index.md mục 3, 4",
           40, 30, page_w - 80, 50,
           "text;html=1;align=center;verticalAlign=middle;fontSize=18;")
    sys_y = cy - semi_h
    vertex("sys", "<b>0</b><br><br><b>SaaS-Sentry</b><br>Hệ thống quản trị<br>bản quyền phần mềm<br>"
           "và tối ưu chi phí công nghệ",
           cx - HALF_W, sys_y, 2 * HALF_W, 2 * semi_h,
           "ellipse;whiteSpace=wrap;html=1;fillColor=#1A73E8;strokeColor=#174EA6;strokeWidth=3;"
           "fontColor=#FFFFFF;fontSize=18;fontStyle=1;perimeter=ellipsePerimeter;")

    def boundary_dx(y):
        t = (y - cy) / semi_h
        return HALF_W * math.sqrt(max(0.0, 1 - t * t))

    def actors_and_edges(boxes, rows, left_side):
        ax = 40 if left_side else right_x
        for a, (y, h) in boxes.items():
            human = a not in SYSTEMS
            fill, stroke = ("#E8F0FE", "#4285F4") if human else ("#E6F4EA", "#34A853")
            if a == "E10":
                fill, stroke = "#F1F3F4", "#5F6368"
            label = f"<b>{a}</b><br>" + "<br>".join(escape(p) for p in actors[a])
            vertex(a, label, ax, y, ACTOR_W, h,
                   f"rounded=0;whiteSpace=wrap;html=1;fillColor={fill};strokeColor={stroke};"
                   "fontSize=13;verticalAlign=middle;")
        for (code, actor, inbound, name), y in rows:
            by, bh = boxes[actor]
            fy = (y - by) / bh
            actor_edge_x = ax + ACTOR_W if left_side else ax
            sys_edge_x = cx - boundary_dx(y) if left_side else cx + boundary_dx(y)
            ex = (sys_edge_x - (cx - HALF_W)) / (2 * HALF_W)
            ey = (y - sys_y) / (2 * semi_h)
            length = abs(sys_edge_x - actor_edge_x)
            actor_side = f"exitX={1 if left_side else 0};exitY={fy:.4f};exitDx=0;exitDy=0;exitPerimeter=0;"
            sys_side = f"entryX={ex:.4f};entryY={ey:.4f};entryDx=0;entryDy=0;entryPerimeter=0;"
            if inbound:
                src, tgt = actor, "sys"
                ends = actor_side + sys_side
                lx = -1 + 2 * LABEL_D / length
                color = "#444444"
            else:
                src, tgt = "sys", actor
                ends = (actor_side.replace("exit", "entry")
                        + sys_side.replace("entry", "exit"))
                lx = 1 - 2 * LABEL_D / length
                color = "#1967D2"
            style = (f"edgeStyle=none;html=1;{ends}fontSize=11;strokeColor={color};fontColor={color};"
                     "endArrow=block;endFill=1;labelBackgroundColor=#FFFFFF;")
            cells.append(
                f'<mxCell id="{code}" value="{escape(code + " · " + name)}" style="{style}" edge="1" '
                f'parent="1" source="{src}" target="{tgt}"><mxGeometry x="{lx:.4f}" relative="1" as="geometry">'
                '<mxPoint as="offset"/></mxGeometry></mxCell>'
            )

    actors_and_edges(lboxes, lrows, True)
    actors_and_edges(rboxes, rrows, False)

    vertex("legend", "<b>Cách đọc</b><br>Mũi tên xám: dữ liệu <b>vào</b> hệ thống<br>"
           "Mũi tên xanh: dữ liệu hệ thống <b>trả ra</b><br>Hộp xanh dương: người dùng có tài khoản<br>"
           "Hộp xanh lá: hệ thống ngoài · Hộp xám: chỉ nhận báo cáo",
           right_x - 140, cy + semi_h + 30, ACTOR_W + 180, 100,
           "text;html=1;align=left;verticalAlign=top;fontSize=11;strokeColor=#BDBDBD;spacing=8;")

    xml = ('<mxfile host="app.diagrams.net" type="device"><diagram name="Context Diagram — SaaS-Sentry">'
           f'<mxGraphModel dx="1400" dy="900" grid="0" gridSize="10" guides="1" tooltips="1" connect="1" '
           f'arrows="1" fold="1" page="1" pageScale="1" pageWidth="{page_w:.0f}" pageHeight="{page_h:.0f}" '
           'math="0" shadow="0"><root><mxCell id="0"/><mxCell id="1" parent="0"/>'
           + "".join(cells) + "</root></mxGraphModel></diagram></mxfile>")
    OUT.write_text(xml, encoding="utf-8")
    print(f"{len(actors)} tác nhân, {len(flows)} luồng -> {OUT.name}")


if __name__ == "__main__":
    main()
