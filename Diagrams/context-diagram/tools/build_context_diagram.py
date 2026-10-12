"""Build the SaaS-Sentry business Context Diagram (DFD level 0) from ``Diagrams/specs/CTX.json``.

Every data flow is a horizontal arrow between an external entity box and the process circle; the
arrow ends exactly on the circle perimeter, so no line is diagonal and no two lines cross. Writes the
.drawio, the PNG (with the editable source embedded) and the Markdown explanation.

    python context-diagram/tools/build_context_diagram.py [--png] [--check]     (from Docs/Diagrams)
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
DIAGRAMS = HERE.parent.parent
sys.path.insert(0, str(DIAGRAMS.parent / "ERD" / "tools"))
from erd_drawio import embed_png_source, read_png_source  # noqa: E402

DRAWIO = r"C:\Program Files\draw.io\draw.io.exe"
SPEC = DIAGRAMS / "specs" / "CTX.json"
OUT = DIAGRAMS / "context-diagram" / "SaaS-Sentry-Context-Diagram"
FONT = "Helvetica"
STEP = 40          # vertical distance between two flows
GAP_IN_OUT = 12    # extra space between the in-group and out-group of one entity
BOX_PAD = 22
BLOCK_GAP = 56
BOX_W = 250
LINE_LEN = 360     # horizontal distance from a box to the nearest circle point
CHAR_W = 6.3       # 11 px Helvetica, conservative


def esc(s):
    return html.escape(s, quote=True)


def layout(spec):
    ents = {e["id"]: e for e in spec["entities"]}
    flows = spec["flows"]
    cols = {"L": [e for e in spec["entities"] if e["side"] == "L"], "R": [e for e in spec["entities"] if e["side"] == "R"]}
    ys, boxes = {}, {}
    heights = {}
    for side, es in cols.items():
        y = 60
        for e in es:
            fin = [f for f in flows if f["e"] == e["id"] and f["dir"] == "in"]
            fout = [f for f in flows if f["e"] == e["id"] and f["dir"] == "out"]
            top = y
            fy = y + BOX_PAD
            for f in fin:
                ys[f["id"]] = fy
                fy += STEP
            fy += GAP_IN_OUT
            for f in fout:
                ys[f["id"]] = fy
                fy += STEP
            h = fy - STEP + BOX_PAD - top
            boxes[e["id"]] = [None, top, BOX_W, h]
            y = top + h + BLOCK_GAP
        heights[side] = y - BLOCK_GAP
    total = max(heights.values())
    # centre each column vertically on the same middle line
    for side, es in cols.items():
        shift = (total - heights[side]) / 2
        for e in es:
            boxes[e["id"]][1] += shift
            for f in flows:
                if f["e"] == e["id"]:
                    ys[f["id"]] += shift
    cy = 60 + (total - 60) / 2
    span = max(abs(ys[f["id"]] - cy) for f in flows if f["e"] != "E9")
    r = math.ceil(span / 0.86 / 10) * 10           # every flow meets the circle above 30 degrees of arc
    left_x = 40
    cx = left_x + BOX_W + LINE_LEN + r
    right_x = cx + r + LINE_LEN
    for e in spec["entities"]:
        if e["side"] == "L":
            boxes[e["id"]][0] = left_x
        elif e["side"] == "R":
            boxes[e["id"]][0] = right_x
    em = next(e for e in spec["entities"] if e["side"] == "B")
    boxes[em["id"]] = [cx - BOX_W / 2, cy + r + 150, BOX_W, 60]
    width = right_x + BOX_W + 40
    height = cy + r + 150 + 60 + 40
    return ents, ys, boxes, (cx, cy, r), width, height


def build_xml(spec):
    ents, ys, boxes, (cx, cy, r), W, H = layout(spec)
    cells = ['<mxCell id="0"/>', '<mxCell id="1" parent="0"/>']
    proc = "<br>".join(f"<b>{esc(t)}</b>" if i < 2 else esc(t) for i, t in enumerate(spec["process"].split("\n")))
    cells.append(f'<mxCell id="S" value="{esc(proc)}" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fillColor=#FFFFFF;'
                 f'strokeColor=#000000;strokeWidth=2;fontFamily={FONT};fontSize=20;fontColor=#000000;" vertex="1" parent="1">'
                 f'<mxGeometry x="{cx - r:.1f}" y="{cy - r:.1f}" width="{2 * r}" height="{2 * r}" as="geometry"/></mxCell>')
    for e in spec["entities"]:
        x, y, w, h = boxes[e["id"]]
        cells.append(f'<mxCell id="{e["id"]}" value="{esc("<b>" + html.escape(e["label"]) + "</b>")}" style="rounded=0;whiteSpace=wrap;'
                     f'html=1;fillColor=#FFFFFF;strokeColor=#000000;strokeWidth=1.5;fontFamily={FONT};fontSize=15;fontColor=#000000;" '
                     f'vertex="1" parent="1"><mxGeometry x="{x:.1f}" y="{y:.1f}" width="{w}" height="{h:.1f}" as="geometry"/></mxCell>')
    base = (f"edgeStyle=none;rounded=0;html=1;strokeColor=#000000;strokeWidth=1.2;endArrow=block;endFill=1;endSize=7;"
            f"fontFamily={FONT};fontSize=11;fontColor=#000000;labelBackgroundColor=#FFFFFF;exitPerimeter=0;entryPerimeter=0;")
    for f in spec["flows"]:
        e = ents[f["e"]]
        bx, by, bw, bh = boxes[e["id"]]
        if e["side"] == "B":
            px, py = cx, cy + r
            fx, fy = 0.5, 0.0
            sp = (0.5, 1.0)                    # circle bottom
            src, tgt = ("S", e["id"]) if f["dir"] == "out" else (e["id"], "S")
            ex, ey = (sp, (fx, fy)) if f["dir"] == "out" else ((fx, fy), sp)
            label_x = 0
        else:
            y = ys[f["id"]]
            dx = math.sqrt(max(r * r - (y - cy) ** 2, 0))
            px = cx - dx if e["side"] == "L" else cx + dx
            circ = ((px - (cx - r)) / (2 * r), (y - (cy - r)) / (2 * r))
            boxpt = (1.0 if e["side"] == "L" else 0.0, (y - by) / bh)
            if f["dir"] == "in":
                src, tgt, ex, ey = e["id"], "S", boxpt, circ
            else:
                src, tgt, ex, ey = "S", e["id"], circ, boxpt
            length = abs(px - (bx + bw if e["side"] == "L" else bx))
            lw = len(f["label"]) * CHAR_W + 10
            # label centre sits near the entity end of the line
            rel_from_box = (lw / 2 + 24) / length
            rel = -1 + 2 * rel_from_box if src == e["id"] else 1 - 2 * rel_from_box
            label_x = rel
        style = base + f"exitX={ex[0]:.5f};exitY={ex[1]:.5f};entryX={ey[0]:.5f};entryY={ey[1]:.5f};"
        geo = f'<mxGeometry x="{label_x:.4f}" relative="1" as="geometry"/>'
        cells.append(f'<mxCell id="{f["id"]}" value="{esc(f["label"])}" style="{style}" edge="1" parent="1" source="{src}" '
                     f'target="{tgt}">{geo}</mxCell>')
    page = (f'<diagram id="CTX" name="Context Diagram"><mxGraphModel dx="1400" dy="900" grid="0" gridSize="10" guides="1" '
            f'tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="{W:.0f}" pageHeight="{H:.0f}" '
            f'background="#FFFFFF" math="0" shadow="0"><root>' + "".join(cells) + "</root></mxGraphModel></diagram>")
    return f'<mxfile host="build_context_diagram" version="3.0">{page}</mxfile>\n', (W, H)


def check(spec):
    probs = []
    ids = [f["id"] for f in spec["flows"]]
    if len(ids) != len(set(ids)):
        probs.append("duplicate flow id")
    ents = {e["id"] for e in spec["entities"]}
    for f in spec["flows"]:
        if f["e"] not in ents:
            probs.append(f"{f['id']}: unknown entity")
        if any(ord(c) > 127 for c in f["label"]) or any(w[0].islower() for w in f["label"].replace("&", "").split() if w not in ("of", "and", "on")):
            probs.append(f"{f['id']}: label must be an English Title-Case noun phrase")
        if f["label"].split()[0].lower() in {"submit", "approve", "send", "record", "create", "update", "process", "check"}:
            probs.append(f"{f['id']}: flow label starts with a verb")
    for e in spec["entities"]:
        if not any(f["e"] == e["id"] for f in spec["flows"]):
            probs.append(f"{e['id']}: entity without flow")
    retired = {r["id"] for r in spec.get("retired", [])}
    if retired & set(ids):
        probs.append("retired id reused")
    return probs


def md(spec, size):
    ents = {e["id"]: e for e in spec["entities"]}
    n_in = sum(f["dir"] == "in" for f in spec["flows"])
    L = ["# Context Diagram — SaaS-Sentry (Business DFD Level 0)", "",
         f"> **Loại:** Context Diagram (DFD mức 0, business view) · **Phiên bản:** {spec['version']} — {spec['date']} · "
         "**Trạng thái:** đã vẽ lại theo BRD v3.30 và `QĐ-49` → `QĐ-62`; chờ Owner/GVHD review.", ">",
         "> Sơ đồ là dẫn xuất từ quyết định Owner (`QĐ`) và BRD; quyết định là của Owner, **chưa** phải xác nhận của GVHD/hội đồng.", "",
         "## 1. Mục đích và phạm vi", "",
         "Cho thấy **ranh giới hệ thống**: ai và hệ thống ngoài nào trao đổi dữ liệu gì với SaaS-Sentry. Đây là bản *business view*: "
         "mỗi mũi tên là một **nhóm dữ liệu** (cụm danh từ), không phải một thao tác hay một bước trình tự; không có kho dữ liệu "
         "và không mở bên trong hệ thống (thuộc DFD mức 1).", "",
         "## 2. Tệp", "",
         "| Tệp | Vai trò |", "| --- | --- |",
         "| [SaaS-Sentry-Context-Diagram.drawio](SaaS-Sentry-Context-Diagram.drawio) | Nguồn draw.io chỉnh sửa được (sinh từ spec) |",
         "| [SaaS-Sentry-Context-Diagram.drawio.png](SaaS-Sentry-Context-Diagram.drawio.png) | Bản xuất PNG, nhúng nguồn draw.io |",
         "| [CTX.json](../specs/CTX.json) | **Nguồn canonical** — sửa rồi chạy `python context-diagram/tools/build_context_diagram.py --png` từ `Docs/Diagrams` |",
         "", "![Context Diagram](SaaS-Sentry-Context-Diagram.drawio.png)", "",
         "## 3. Cách đọc", "",
         "| Ký hiệu | Nghĩa |", "| --- | --- |",
         "| Hình tròn `0 SaaS-Sentry` | Toàn bộ hệ thống là **một tiến trình** |",
         "| Hình chữ nhật | Tác nhân ngoài (người hoặc hệ thống) |",
         "| Mũi tên có nhãn | Một nhóm dữ liệu; chiều mũi tên là chiều dữ liệu, **không** phải thứ tự thao tác |", "",
         "Mỗi tác nhân xếp **luồng vào** (tác nhân → hệ thống) phía trên, **luồng ra** (hệ thống → tác nhân) phía dưới. "
         "Mọi dây nằm ngang và không cắt nhau; vị trí hộp không mang nghĩa nghiệp vụ.", "",
         f"**Số đếm:** 1 tiến trình · {len(spec['entities'])} tác nhân ngoài · {len(spec['flows'])} luồng "
         f"({n_in} vào / {len(spec['flows']) - n_in} ra).", "",
         "## 4. Tác nhân ngoài", "",
         "| Mã | Nhãn trên hình | Là ai | Ràng buộc |", "| --- | --- | --- | --- |"]
    for e in spec["entities"]:
        L.append(f"| `{e['id']}` | {e['label']} | {e['vi']} | {e['limit']} |")
    L += ["", "> **Không phải tác nhân:** Automation Service, bộ thu thập trên thiết bị và connector nằm **trong** ranh giới; "
          "Business Owner là thuộc tính của ứng dụng (người giữ là Employee/Manager/IT Admin); phần mềm nội bộ là đối tượng được "
          "quản lý, dữ liệu của nó đi qua IT Admin và Finance (`QĐ-49b`).", "",
          "## 5. Luồng dữ liệu", "",
          "| Mã | Chiều | Tác nhân | Nhãn trên hình | Dữ liệu | Nguồn |", "| --- | --- | --- | --- | --- | --- |"]
    for f in spec["flows"]:
        arrow = "vào hệ thống" if f["dir"] == "in" else "ra tác nhân"
        L.append(f"| `{f['id']}` | {arrow} | {ents[f['e']]['label']} | {f['label']} | {f['vi']} | {f['src']} |")
    L += ["", "**Mã ngừng dùng (không tái sử dụng):**", ""]
    for r in spec.get("retired", []):
        L.append(f"- `{r['id']}` *{r['label']}* — {r['why']}")
    L += ["", "## 6. Lược có chủ đích — không có trên hình", "",
          "| Không vẽ | Lý do |", "| --- | --- |",
          "| Nhà cung cấp mô hình AI | Hai tính năng AI (`QĐ-49e`, phạm vi cam kết theo `QĐ-61e`) và gợi ý nhà cung cấp chạy trong hệ thống; nhà cung cấp model là tích hợp kỹ thuật, lược như bản v2.7 (Owner). Điều kiện gửi dữ liệu tới model còn mở (`OQ-26`) |",
          "| Ứng dụng mobile | **Không** phải tác nhân ngoài: là kênh giao diện của chính Employee, trưởng phòng và Người duyệt chi cho bốn tác vụ của `QĐ-61b`; luồng dữ liệu nghiệp vụ không đổi nên không thêm thực thể hay luồng (`QĐ-61d`) |",
          "| Nguồn tỷ giá tự động | Giả định `GĐ-8`; tỷ giá nhập tay khi cần nằm trong G24 |",
          "| Hệ thống nhân sự, ngân hàng | Dữ liệu vào qua người tải tệp (IT Admin G12, Finance G22); không có tích hợp trực tiếp (`OQ-04`) |",
          "| Ban giám đốc, kiểm toán | Không có tài khoản; chỉ nhận báo cáo ngoài hệ thống |",
          "| Kho dữ liệu, Automation Service | Thuộc bên trong hệ thống (DFD mức 1) |",
          "| Cổng thanh toán, công cụ chặn ứng dụng, log web/proxy/CASB | Ngoài phạm vi (BRD 3.2, 5.6.1) |",
          "| Khôi phục Super Admin ngoài ứng dụng | Thủ tục của người vận hành hạ tầng, không qua ranh giới ứng dụng (`QĐ-47a`) |", "",
          "## 7. Thay đổi so với v2.7 (05/10/2026)", "",
          "- Tác nhân `E2` đổi nhãn thành **Department Head (Manager)** — vai Manager suy ra từ trưởng phòng (`QĐ-52a`).",
          "- `G04` *Business Owner Feedback* **ngừng dùng**: ý kiến Business Owner do IT Admin ghi nhận (BRD 4.4, `OI-05a`), nay trong `G14`.",
          "- Đổi nhãn theo nội dung mới: `G01` (hoàn trả BM-03), `G02` (xác nhận chính sách thiết bị BM-06), `G05` (bộ công cụ chuẩn), "
          "`G08` (bàn giao, rà soát sau điều chuyển, yêu cầu theo nhóm), `G11` (tóm tắt theo phòng), `G12` (kiểu cấp, điều khoản, kho khóa, phòng ban), "
          "`G22` (dòng thuế, hồ sơ thuế), `G24` (đầu vào dự báo), `G28` (bước nhu cầu khi trưởng phòng tự gửi), `G30` (snapshot theo chi phí thực chịu).",
          "- Bố cục mới: mọi dây nằm ngang, tận cùng trên đường tròn; không còn đoạn chéo. Giữ lựa chọn của Owner: **không** có ô tiêu đề và caption trên hình.", "",
          "## 8. Liên hệ với sơ đồ khác", "",
          "- Cấp dưới: [Functional Decomposition](../functional-decomposition-diagram/functional-decomposition-guide.md) phân rã tiến trình `0` thành các chức năng.",
          "- Mỗi nhóm luồng dẫn tới main flow tương ứng: G01/G08/G10/G28/G30/G34 → `MF-2`; G08/G12/G17 → `MF-7`, `MF-5`; G22/G23/G26 → `MF-8`; G07/G27/G28/G31 → `MF-4`. "
          "Bảng đầy đủ ở [index](../index.md).", "",
          "## 9. Giới hạn và vấn đề còn mở", "",
          "- G-3 (từ v2.7): có cần nộp context đầy đủ mọi tích hợp kỹ thuật (tỷ giá, nhà cung cấp model) không — **Owner/GVHD** quyết; bản này là business view.",
          "- Bộ thu thập cụ thể và nguồn usage chốt ở giai đoạn Tools (`QĐ-59a`); G03 chỉ ở mức nghiệp vụ.",
          f"- Bản xuất {size[0]:.0f}×{size[1]:.0f} (đơn vị draw.io), PNG xuất tỷ lệ 2.", ""]
    return "\n".join(L)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--png", action="store_true")
    ap.add_argument("--check", action="store_true")
    a = ap.parse_args()
    spec = json.load(open(SPEC, encoding="utf-8"))
    probs = check(spec)
    xml, size = build_xml(spec)
    text = md(spec, size)
    if a.check:
        for suf, want in ((".drawio", xml),):
            if Path(str(OUT) + suf).read_text(encoding="utf-8") != want:
                probs.append(f"{suf} differs from spec")
        if (OUT.parent / "index.md").read_text(encoding="utf-8") != text:
            probs.append("index.md differs from spec")
        if read_png_source(str(OUT) + ".drawio.png") != xml:
            probs.append("PNG source differs")
    if probs:
        print("FAIL", *probs, sep="\n  ")
        sys.exit(1)
    if not a.check:
        Path(str(OUT) + ".drawio").write_text(xml, encoding="utf-8", newline="\n")
        (OUT.parent / "index.md").write_text(text, encoding="utf-8", newline="\n")
        if a.png:
            png = str(OUT) + ".drawio.png"
            subprocess.run([DRAWIO, "-x", "-f", "png", "-s", "2", "-b", "20", "-o", png, str(OUT) + ".drawio"],
                           check=True, capture_output=True, timeout=180)
            embed_png_source(png, xml)
    print(f"ok CTX entities={len(spec['entities'])} flows={len(spec['flows'])} size={size[0]:.0f}x{size[1]:.0f}")


if __name__ == "__main__":
    main()
