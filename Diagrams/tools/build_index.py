"""Generate ``Diagrams/index.md`` — the canonical reading index of the diagram set — from
``specs/catalog.json``, ``specs/*.json``, ``specs/CTX.json`` and ``functional-decomposition-diagram/function-tree.json``.

    python tools/build_index.py [--check]      (from Docs/Diagrams)
"""
from __future__ import annotations

import argparse
import glob
import json
import re
import sys
from pathlib import Path

DIAGRAMS = Path(__file__).resolve().parent.parent
SPECS = DIAGRAMS / "specs"
OUT = DIAGRAMS / "index.md"
ID_RE = re.compile(r"\b(MF-\d+|WF-\d+a?|UF-\d+|SF-\d)\b")
# requirement codes used for DIRECT traceability (node `rules` ↔ function requirement column)
REQ_RE = re.compile(r"(FR-\d+\.\d+[a-z]?(?:-\d+)?|BR-\d+\.\d+|QĐ-\d+[a-z]?(?:\(\d\))?)")
BRD = DIAGRAMS.parent / "Requiments" / "BRD - HỆ THỐNG QUẢN TRỊ BẢN QUYỀN PHẦN MỀM & TỐI ƯU CHI PHÍ CÔNG NGHỆ.md"
FR_DEF_RE = re.compile(r"^\s*- \*\*(FR-\d+\.\d+[a-z]?(?:-\d+)?):?\*\*", re.M)
STEP_TYPES = ("action", "decision", "call", "event", "time", "screen", "system", "blocked", "ref")
# functions that are not a flow step by nature (reason shown instead of GAP)
NOT_A_STEP = {
    "11.3": "N/A — bộ chỉ số KPI là đầu ra báo cáo/dashboard (BRD mục 2.3), không phải một bước trong luồng",
}
# disposition of BRD FR codes that have no node/function code (shown in 6.1); the list itself is NOT suppressed
FR_DISPOSITION = {
    "FR-11.1": ("Quy tắc chung (bao trùm)",
                "Quản lý các loại hồ sơ BM-01…BM-08: từng biểu mẫu đã có mã `BM-xx` trên node và ở cột yêu cầu của FDD; mã bao trùm không gắn hàng loạt lên node. Bàn giao: `HO-80`, `HO-03`."),
    "FR-6.10": ("Hoãn / ngoài phạm vi sơ đồ",
                "BRD ghi *không hiện thực ở MVP* (đặc tả cho tương lai); ngoài phạm vi theo BRD 3.2, 5.6.1 và `QĐ-31a`. Ranh giới nêu ở `WF-17` (`excluded`), Context và hướng dẫn FDD; không gắn mã lên node."),
    "FR-8.5": ("Quy tắc chung (tách quyền)",
               "Cụ thể hóa `SoD-1`: Super Admin không thực hiện thao tác nghiệp vụ. Thể hiện bằng việc làn Super Admin chỉ có node quản trị và các điểm nói rõ không duyệt thay (`WF-03 d_act`, `WF-09 s_wait`, `WF-17 d_out`); enforce ở guard API, không phải bước luồng."),
    "FR-9.6": ("Quy tắc chung (phi chức năng, trình bày)",
               "Trạng thái rỗng của màn hình dẫn về bước khởi tạo còn thiếu là quy tắc trình bày xuyên màn hình; chờ UI Spec/Figma (`QĐ-08`, `US-02-04`, `CN-15`). Không có node thể hiện — không phải bước luồng, không gắn lên `WF-01`."),
}


def leaf_fields(leaf):
    """function-tree leaf → (name, requirement text, flows text); accepts list or dict leaves."""
    if isinstance(leaf, dict):
        return leaf.get("name", ""), leaf.get("rules", ""), leaf.get("flows", "")
    return leaf[0], leaf[2], leaf[3]


def code_matches(want, have):
    """`QĐ-52` matches `QĐ-52a`; `FR-3.4` matches `FR-3.4c-1`; `FR-3.1` does not match `FR-3.17`."""
    return have == want or (have.startswith(want) and len(have) > len(want) and have[len(want)].isalpha())


def rule_index(specs):
    idx = {}
    for sid, s in specs.items():
        for n in s["nodes"]:
            for r in n.get("rules", []):
                for c in REQ_RE.findall(r):
                    idx.setdefault(c, set()).add((sid, n["id"]))
    return idx


def fmt_hits(hits, limit=5):
    by = {}
    for sid, nid in sorted(hits):
        by.setdefault(sid, []).append(nid)
    parts = [f"`{sid}`: {', '.join(n for n in nodes[:4])}{' …' if len(nodes) > 4 else ''}" for sid, nodes in by.items()]
    return " · ".join(parts[:limit]) + (f" · +{len(parts) - limit} sơ đồ" if len(parts) > limit else "")


def load_specs():
    specs = {}
    for f in sorted(glob.glob(str(SPECS / "*.json"))):
        d = json.load(open(f, encoding="utf-8"))
        if "nodes" in d:
            specs[d["id"]] = d
    return specs


def files(spec):
    out = spec["out"]
    stem = out.split("/")[-1]
    return out.rsplit("/", 1)[0], stem


def link_row(spec):
    folder, stem = files(spec)
    return f"[.drawio]({folder}/{stem}.drawio) · [PNG]({folder}/{stem}.drawio.png) · [giải thích]({folder}/{stem}.md)"


def refs_of(spec):
    ids = set()
    for n in spec["nodes"]:
        if n.get("ref"):
            ids.add(n["ref"])
    for r in spec.get("doc", {}).get("relations", []):
        ids.update(ID_RE.findall(r))
    ids.discard(spec["id"])
    return ids


def build():
    cat = json.load(open(SPECS / "catalog.json", encoding="utf-8"))
    specs = load_specs()
    tree = json.load(open(DIAGRAMS / "functional-decomposition-diagram" / "function-tree.json", encoding="utf-8"))
    ctx = json.load(open(SPECS / "CTX.json", encoding="utf-8"))
    missing = [d["id"] for k in ("main_flows", "workflows", "user_flows") for d in cat[k] if d["id"] not in specs]
    L = ["# SaaS-Sentry — Bộ sơ đồ nghiệp vụ (index)", "",
         f"> **Phiên bản bộ sơ đồ:** {cat['version']} — {cat['date']} · **Căn cứ:** BRD v3.35, Định nghĩa phạm vi v1.24, sổ quyết định `QĐ-01` → `QĐ-66` "
         "(thứ tự căn cứ: `QĐ` → BRD → sơ đồ). Quyết định thể hiện trong sơ đồ là của **Owner**, **chưa** phải xác nhận của GVHD/hội đồng.", ">",
         "> Tệp này **sinh tự động** bằng `python tools/build_index.py` từ catalog và spec — không sửa tay.", "",
         "## 1. Thứ tự đọc", "",
         "| Bước | Cấp | Trả lời câu hỏi | Mở |", "| --- | --- | --- | --- |",
         "| 1 | Context Diagram | Hệ thống trao đổi dữ liệu gì với ai? | [context-diagram/index.md](context-diagram/index.md) |",
         "| 2 | Functional Decomposition | Hệ thống gồm những nhóm chức năng nào? | [functional-decomposition-diagram/functional-decomposition-guide.md](functional-decomposition-diagram/functional-decomposition-guide.md) |",
         "| 3 | 5 Main Flows | Năm quy trình nghiệp vụ chính chạy thế nào, ai quyết gì? | [main-workflows-activity-diagram/index.md](main-workflows-activity-diagram/index.md) |",
         "| 4 | Workflows | Chi tiết từng bước, kiểm quyền, ngoại lệ? | [workflows-activity-diagram/index.md](workflows-activity-diagram/index.md) |",
         "| 5 | User Flows | Người dùng đi qua màn hình nào? | [user-flows/index.md](user-flows/index.md) |", "",
         "Lý do chọn 5 main flow và ánh xạ mã cũ → mới: [main-flow-selection.md](main-workflows-activity-diagram/main-flow-selection.md). "
         "Quy ước sinh hình và ký pháp: [tools/README.md](tools/README.md). "
         "Điểm mở đã phân loại (`DOI-xx`): [open-items.md](open-items.md). Bàn giao ERD/User Stories: [handoff-erd-us-2026-10-09.md](handoff-erd-us-2026-10-09.md). "
         "Kiểm chứng: [verification-2026-10-08.md](verification-2026-10-08.md).", ""]
    if missing:
        L += [f"> ⚠️ Chưa có spec cho: {', '.join(missing)}.", ""]
    n_in = sum(f["dir"] == "in" for f in ctx["flows"])
    nleaf = sum(len(f["leaves"]) for f in tree["features"])
    L += ["## 2. Context và FDD", "",
          "| Sơ đồ | Nội dung | Tệp |", "| --- | --- | --- |",
          f"| Context Diagram v{ctx['version']} | 1 tiến trình · {len(ctx['entities'])} tác nhân ngoài · {len(ctx['flows'])} luồng ({n_in} vào / {len(ctx['flows']) - n_in} ra) | "
          "[.drawio](context-diagram/SaaS-Sentry-Context-Diagram.drawio) · [PNG](context-diagram/SaaS-Sentry-Context-Diagram.drawio.png) · [giải thích](context-diagram/index.md) |",
          f"| Functional Decomposition v{tree['version']} | {len(tree['features'])} nhóm chức năng · {nleaf} chức năng (N.M) | "
          "[.drawio](functional-decomposition-diagram/saas-sentry-functional-decomposition.drawio) · [PNG](functional-decomposition-diagram/saas-sentry-functional-decomposition.drawio.png) · "
          "[giải thích](functional-decomposition-diagram/functional-decomposition-guide.md) |", "",
          "## 3. Năm main flow", "",
          "| # | Mã | Tên | Là gì · phục vụ mục tiêu nào · tạo kết quả gì | Workflow chi tiết | Tệp |", "| --- | --- | --- | --- | --- | --- |"]
    for mf in sorted(cat["main_flows"], key=lambda m: m["order"]):
        s = specs.get(mf["id"])
        wfs = ", ".join(f"`{w['id']}`" for w in cat["workflows"] if w["parent"] == mf["id"])
        if s:
            purpose = s["doc"]["purpose"].split(". ")[0].replace("**", "") + "."
            L.append(f"| {mf['order']} | **{mf['id']}** | {mf['title']} | {purpose} | {wfs} | {link_row(s)} |")
        else:
            L.append(f"| {mf['order']} | **{mf['id']}** | {mf['title']} | — | {wfs} | chưa có |")
    L += ["", "**Nhóm chức năng hỗ trợ** (không phải main flow):", "",
          "| Mã | Nhóm | Mã cũ | Workflow |", "| --- | --- | --- | --- |"]
    for g in cat["supporting_groups"]:
        wfs = ", ".join(f"`{w['id']}`" for w in cat["workflows"] if w["parent"] == g["id"])
        L.append(f"| {g['id']} | {g['title']} | {g['old'] or '—'} | {wfs} |")
    L += ["", "## 4. Workflow", "",
          "| Mã | Tên | Thuộc | Vai trò | Gọi / liên quan | Tệp |", "| --- | --- | --- | --- | --- | --- |"]
    role_vi = {"detail": "chi tiết", "subflow": "luồng con dùng chung", "supporting": "hỗ trợ"}
    for w in cat["workflows"]:
        s = specs.get(w["id"])
        rel = ", ".join(f"`{x}`" for x in sorted(refs_of(s))) if s else "—"
        L.append(f"| {w['id']} | {w['title']} | {w['parent']} | {role_vi.get(w['role'], w['role'])} | {rel} | {link_row(s) if s else 'chưa có'} |")
    L += ["", "## 5. User flow", "",
          "| Mã | Tên | Liên quan | Tệp |", "| --- | --- | --- | --- |"]
    for u in cat["user_flows"]:
        s = specs.get(u["id"])
        rel = ", ".join(f"`{x}`" for x in sorted(refs_of(s))) if s else "—"
        L.append(f"| {u['id']} | {u['title']} | {rel} | {link_row(s) if s else 'chưa có'} |")
    # traceability
    L += ["", "## 6. Truy vết Requirement/Decision → chức năng → sơ đồ", "",
          "Mỗi dòng là một chức năng lá của FDD. Ba mức, **không** coi quan hệ cùng nhóm là bằng chứng thực hiện:", "",
          "- **DIRECT** — có node cụ thể (`sơ đồ`: id node) mang mã yêu cầu của chức năng trong trường `rules`, và sơ đồ đó thuộc phạm vi luồng khai báo "
          "của chức năng (luồng khai báo, main flow/nhóm cha, workflow con, user flow liên hệ). Mã so khớp là `FR`/`BR`; chức năng chỉ có `QĐ` thì so `QĐ`.",
          "- **RELATED** — sơ đồ khai báo hoặc user flow có liên hệ, nhưng không node nào mang mã của chức năng: chỉ liên quan cùng quy trình.",
          "- **GAP** — không có node nào mang mã; **N/A** — chức năng không phải một bước luồng (ghi lý do).", "",
          "Đây là truy vết theo mã do bộ sinh tính, không thay việc đọc node. User Stories/ERD chưa đồng bộ `QĐ-52` → `QĐ-60` nên chưa nối ở đây; "
          "bàn giao theo mã ở [handoff-erd-us-2026-10-09.md](handoff-erd-us-2026-10-09.md) (giai đoạn ERD + User Stories, `QĐ-59e`).", "",
          "| Requirement / Decision | Chức năng | DIRECT (sơ đồ: node) | RELATED (không có node mang mã) | Mức |", "| --- | --- | --- | --- | --- |"]
    wf_parent = {w["id"]: w["parent"] for w in cat["workflows"]}
    children = {}
    for w in cat["workflows"]:
        children.setdefault(w["parent"], set()).add(w["id"])
    uf_by_flow = {}
    for u in cat["user_flows"]:
        s = specs.get(u["id"])
        if s:
            for x in refs_of(s):
                uf_by_flow.setdefault(x, set()).add(u["id"])
    ridx = rule_index(specs)
    leaf_codes = set()
    counts = {"DIRECT": 0, "GAP": 0, "N/A": 0}
    for f in tree["features"]:
        for k, leaf in enumerate(f["leaves"], 1):
            name, req, flows = leaf_fields(leaf)
            fid = f"{f['n']}.{k}"
            codes = REQ_RE.findall(req)
            leaf_codes.update(codes)
            prim = [c for c in codes if not c.startswith("QĐ")] or codes
            declared = set(ID_RE.findall(flows))
            scope = set(declared)
            for x in declared:
                scope |= children.get(x, set())
                if x in wf_parent:
                    scope.add(wf_parent[x])
            ufs = set().union(*(uf_by_flow.get(x, set()) for x in declared)) if declared else set()
            if re.search(r"(?<![\w-])UF(?![\w-])", flows):  # "UF" = every user flow (cross-cutting screens)
                ufs |= {u["id"] for u in cat["user_flows"]}
            scope |= ufs
            hits = {h for want in prim for have, hs in ridx.items() if code_matches(want, have) for h in hs if h[0] in scope}
            hit_specs = {h[0] for h in hits}
            related = sorted((declared | ufs) - hit_specs, key=lambda x: (x[:2], x))
            if hits:
                level = "DIRECT"
            elif fid in NOT_A_STEP:
                level = NOT_A_STEP[fid]
            else:
                level = "GAP — chưa có node mang mã trong luồng khai báo"
            counts["DIRECT" if hits else ("N/A" if fid in NOT_A_STEP else "GAP")] += 1
            L.append(f"| {req} | {fid} {name} | {fmt_hits(hits) or '—'} | {', '.join(related) or '—'} | {level} |")
    L += ["", f"Tổng: **{counts['DIRECT']}** DIRECT · **{counts['GAP']}** GAP · **{counts['N/A']}** N/A trên {sum(counts.values())} chức năng.", ""]
    # reverse checks
    brd_fr = sorted(set(FR_DEF_RE.findall(BRD.read_text(encoding="utf-8")))) if BRD.exists() else []
    node_codes = set(ridx)
    unmapped = [c for c in brd_fr
                if not any(code_matches(c, x) or code_matches(x, c) for x in leaf_codes | node_codes)]
    L += ["### 6.1. Kiểm ngược: yêu cầu BRD chưa có chức năng hoặc node", "",
          f"Mã `FR` được định nghĩa trong BRD: **{len(brd_fr)}**. Chưa xuất hiện ở cột yêu cầu của chức năng nào **và** không node nào mang mã: "
          + (", ".join(f"`{c}`" for c in unmapped) if unmapped else "không có") + ". "
          "Danh sách này là tín hiệu để rà, không tự kết luận yêu cầu bị thiếu. Bộ sinh chỉ đọc **mã đầu** của khoảng mã ở cột yêu cầu (ví dụ `FR-0.1 → 0.4`, `FR-9.1 → 9.7`), nên mã nằm trong khoảng vẫn có thể xuất hiện ở cột yêu cầu dạng khoảng mà không được tính ở đây. "
          "**DIRECT chỉ nghĩa là có ít nhất một node dẫn mã đầu của cột yêu cầu trong phạm vi luồng — không chứng minh mọi mã trong khoảng hay mọi tiêu chí chấp nhận đã được vẽ.**", "",
          "| Mã | Phân loại | Nơi thể hiện / lý do |", "| --- | --- | --- |"]
    for c in unmapped:
        kind, why = FR_DISPOSITION.get(c, ("Chưa phân loại", "Cần rà: nội dung đã thể hiện ở đâu, quy tắc chung, hoãn hay thiếu thật."))
        L.append(f"| `{c}` | {kind} | {why} |")
    L += ["",
          "### 6.2. Kiểm ngược: node sơ đồ chưa dẫn nguồn", "",
          "Node bước (hành động, rẽ nhánh, gọi, sự kiện, màn hình) không có trường `rules`. Phần lớn là bước nối/hiển thị đã giải thích trong `vi`; cần dẫn nguồn nếu bước mang quy tắc nghiệp vụ.", "",
          "| Sơ đồ | Node chưa có `rules` |", "| --- | --- |"]
    for sid, s in specs.items():
        miss = [n["id"] for n in s["nodes"] if n["type"] in STEP_TYPES and not n.get("rules")]
        if miss:
            L.append(f"| `{sid}` | {', '.join(miss)} |")
    L += ["", "## 7. Ánh xạ mã cũ → mới", "",
          "| Mã cũ | Vị trí mới |", "| --- | --- |",
          "| MF-1 Organization Setup | SF-1 → `WF-01`, `WF-02` |",
          "| MF-2, MF-4, MF-5, MF-7, MF-8 | Giữ mã, vẽ lại |",
          "| MF-3 Usage Evidence & Ghost Seat | SF-4 → `WF-12`, `WF-12a`, `WF-13`, `WF-13a`, `WF-14`, `WF-18` |",
          "| MF-6 Shadow IT / Spend Reconciliation | Luồng con của MF-8 → `WF-17`, `WF-17a` |",
          "| `MF-0` → `MF-5` trong tài liệu F-xx cũ | Xem [main-flow-selection.md mục 5.2](main-workflows-activity-diagram/main-flow-selection.md) |",
          "| `UF-01` → `UF-17` (bản Mermaid/Việt) | Giữ mã, vẽ lại bằng tiếng Anh; thêm `UF-18` → `UF-21` |",
          "| Tài liệu F-01 → F-48 (User Flows nghiệp vụ) | Giữ nguyên văn ở [user-flows/business-flow-catalog.md](user-flows/business-flow-catalog.md), chưa đồng bộ |", "",
          "## 8. Kiểm chứng {#kiem-chung}", "",
          "Lệnh kiểm lại toàn bộ (từ `Docs/Diagrams`):", "", "```bash",
          "python tools/flowkit.py check \"specs/*.json\"",
          "python context-diagram/tools/build_context_diagram.py --check",
          "python functional-decomposition-diagram/build_fdd.py --check",
          "python tools/build_index.py --check", "```", "",
          "Kết quả kiểm của lượt vẽ lại 08/10/2026 và danh sách ảnh đã xem: [verification-2026-10-08.md](verification-2026-10-08.md).", ""]
    return "\n".join(L)


def local_links(spec):
    stem = files(spec)[1]
    return f"[PNG]({stem}.drawio.png) · [.drawio]({stem}.drawio) · [giải thích]({stem}.md)"


def build_wf_index():
    cat = json.load(open(SPECS / "catalog.json", encoding="utf-8"))
    specs = load_specs()
    titles = {m["id"]: m["title"] for m in cat["main_flows"]} | {g["id"]: g["title"] for g in cat["supporting_groups"]}
    role_vi = {"detail": "chi tiết", "subflow": "luồng con dùng chung", "supporting": "hỗ trợ"}
    L = ["# Business Workflows — workflow chi tiết", "",
         f"> **Phiên bản:** {cat['version']} — {cat['date']} · **Căn cứ:** BRD v3.35, sổ quyết định `QĐ-01` → `QĐ-66` · Quyết định thể hiện là của Owner, **chưa** phải xác nhận của GVHD/hội đồng.",
         ">", "> Tệp **sinh tự động** bằng `python tools/build_index.py` từ `specs/catalog.json` và `specs/WF-*.json` — không sửa tay. "
         "Mỗi workflow có `.drawio` (sửa được), `.drawio.png` (nhúng nguồn) và `.md` giải thích 12 mục.", "",
         "Workflow là cấp chi tiết của main flow: đủ điều kiện, kiểm quyền, ngoại lệ; mọi nhánh kết thúc ở một điểm cuối có ý nghĩa. "
         "Ký pháp UML Activity, xem [tools/README.md](../tools/README.md). Bộ sơ đồ toàn dự án: [index chung](../index.md).", ""]
    order = [m["id"] for m in sorted(cat["main_flows"], key=lambda m: m["order"])] + [g["id"] for g in cat["supporting_groups"]]
    for k, parent in enumerate(order, 1):
        ws = [w for w in cat["workflows"] if w["parent"] == parent]
        if not ws:
            continue
        kind = "main flow" if parent.startswith("MF") else "nhóm hỗ trợ"
        L += [f"## {k}. {parent} — {titles[parent]} ({kind})", "",
              "| Mã | Tên | Vai trò | Mục đích | Gọi / liên quan | Tệp |", "| --- | --- | --- | --- | --- | --- |"]
        for w in ws:
            s = specs.get(w["id"])
            if not s:
                L.append(f"| {w['id']} | {w['title']} | {role_vi.get(w['role'], w['role'])} | — | — | chưa có |")
                continue
            purpose = s["doc"]["purpose"].split(". ")[0].replace("**", "").replace("|", "/").rstrip(".") + "."
            rel = ", ".join(f"`{x}`" for x in sorted(refs_of(s))) or "—"
            L.append(f"| **{w['id']}** | {w['title']} | {role_vi.get(w['role'], w['role'])} | {purpose} | {rel} | {local_links(s)} |")
        L.append("")
    L += ["## Tệp cũ", "",
          "Bộ WF Mermaid/draw.io trước Review 1 (thư mục `drawio/`, tệp gộp, manifest, hướng dẫn đọc cũ) đã được thay bằng bộ này. "
          "Bản cũ còn trong lịch sử Git của repo Docs (commit `e89412e` trở về trước).", ""]
    return "\n".join(L)


def build_uf_index():
    cat = json.load(open(SPECS / "catalog.json", encoding="utf-8"))
    specs = load_specs()
    L = ["# User Flows — luồng màn hình", "",
         f"> **Phiên bản:** {cat['version']} — {cat['date']} · **Căn cứ:** BRD v3.35, sổ quyết định `QĐ-01` → `QĐ-66` · Quyết định thể hiện là của Owner, **chưa** phải xác nhận của GVHD/hội đồng.",
         ">", "> Tệp **sinh tự động** bằng `python tools/build_index.py` từ `specs/catalog.json` và `specs/UF-*.json` — không sửa tay.", "",
         "User flow cho biết người dùng đi qua **màn hình** nào, làm **thao tác** gì và nhận **phản hồi** gì. "
         "Mã màn hình (vd. `EMP-01`) là **đề xuất** cho giai đoạn thiết kế UI (`QĐ-08`), chưa phải màn hình đã chốt.", "",
         "**Ký hiệu:** hình bo tròn = bắt đầu/kết thúc · hộp có dòng mã in đậm = màn hình · hộp viền nét đứt = hệ thống xử lý/gửi thông báo · "
         "hộp viền đậm = bị chặn/không cho đi tiếp · hộp hai vạch dọc = gọi user flow khác (có cạnh ra thì quay lại đi tiếp) · thoi = lựa chọn của người dùng hoặc điều kiện. "
         "Chi tiết: [tools/README.md](../tools/README.md).", "",
         "| Mã | Tên | Vai trò chính | Liên quan | Tệp |", "| --- | --- | --- | --- | --- |"]
    for u in cat["user_flows"]:
        s = specs.get(u["id"])
        if not s:
            L.append(f"| {u['id']} | {u['title']} | — | — | chưa có |")
            continue
        roles = ", ".join(l["label"] for l in s["lanes"])
        rel = ", ".join(f"`{x}`" for x in sorted(refs_of(s))) or "—"
        L.append(f"| **{u['id']}** | {u['title']} | {roles} | {rel} | {local_links(s)} |")
    L += ["", "## Tài liệu liên quan", "",
          "- [business-flow-catalog.md](business-flow-catalog.md) — danh mục nghiệp vụ F-01 → F-48 bản cũ, giữ nguyên văn để tra cứu; **chưa** đồng bộ `QĐ-49` → `QĐ-60`.",
          "- Bộ UF cũ (Mermaid tiếng Việt, HTML, manifest, `drawio/UF-*`) đã được thay bằng bộ này; bản cũ còn trong lịch sử Git của repo Docs.", ""]
    return "\n".join(L)


OPEN_RE = re.compile(r"^\(([^·)]+?)\s*·\s*((?:[^()]|\([^()]*\))*)\)\s*(.*)$", re.S)   # codes may hold "QĐ-49e(1)"
DOI_RE = re.compile(r"DOI-\d+")
CATEGORY_VI = {
    "ĐÃ CHỐT": "Owner đã quyết (`QĐ-61` → `QĐ-64`) — đã thể hiện trên hình hoặc trong mô tả",
    "ĐÃ CÓ NGUỒN": "Đã có căn cứ ở BRD/Decisions — sửa theo nguồn, ghi căn cứ",
    "LATER-TECH/UI": "Chi tiết kỹ thuật/UI cho giai đoạn sau (tham số, màn hình, thiết kế BE)",
    "DEFERRED/OUT": "Đã có quyết định hoãn hoặc ngoài phạm vi (giai đoạn Tools, ERD/User Stories, pháp lý)",
    "LIMIT": "Giới hạn hợp lệ cần công bố",
}


def build_open_items():
    """Register of open notes, generated from the `(CATEGORY · codes) text` prefix of every spec's doc.open."""
    specs = load_specs()
    rows, untagged = [], []
    for sid, s in sorted(specs.items(), key=lambda kv: (kv[0][:2], kv[0])):
        for k, note in enumerate(s.get("doc", {}).get("open", []), 1):
            m = OPEN_RE.match(note)
            if not m:
                untagged.append((sid, k, note))
                continue
            cat, codes, text = m.group(1).strip(), m.group(2).strip(), m.group(3).strip()
            rows.append((cat, codes, sid, k, text))
    counts = {}
    for r in rows:
        counts[r[0]] = counts.get(r[0], 0) + 1
    dois = sorted({d for r in rows for d in DOI_RE.findall(r[1])}, key=lambda x: int(x[4:]))
    L = ["# Danh sách điểm mở của bộ sơ đồ (`DOI-xx`)", "",
         "> Tệp **sinh tự động** bằng `python tools/build_index.py` từ mục 12 (`doc.open`) của các spec — không sửa tay. "
         "Mỗi ghi chú mang nhãn `(LOẠI · mã)`; mã `DOI-xx` (*diagram open item*) gom các ghi chú trùng nhau giữa nhiều sơ đồ. "
         "Phân loại và khử trùng lần đầu ngày 09/10/2026 (190 ghi chú thô + `O-1` → `O-7` + review tiếp nối ⟹ 111 mục); "
         "19 mục cần Owner đã được chốt ở `QĐ-62a` → `QĐ-62q`; sau review độc lập 10/10/2026 thêm `QĐ-62s`, `QĐ-62t`, `QĐ-61h`; cùng ngày, `QĐ-63a` (người xác nhận bàn giao ở bốn ca thu hồi do IT thực hiện — trước đó ghi bằng nhãn *SESSION DECISION*) và `QĐ-64a` (seat chồng lấn với ghost seat). Đây là quyết định của Owner, **chưa** phải xác nhận của GVHD/hội đồng.", "",
         "## 1. Loại và số ghi chú", "", "| Loại | Ý nghĩa | Số ghi chú |", "| --- | --- | --- |"]
    for cat, vi in CATEGORY_VI.items():
        L.append(f"| `{cat}` | {vi} | {counts.get(cat, 0)} |")
    other = {c: n for c, n in counts.items() if c not in CATEGORY_VI}
    for cat, n in sorted(other.items()):
        L.append(f"| `{cat}` | (nhãn ngoài danh sách chuẩn) | {n} |")
    L += ["", f"Tổng {len(rows)} ghi chú có nhãn trên {len(specs)} spec, {len(dois)} mã `DOI` đang được dẫn"
          + (f"; **{len(untagged)} ghi chú chưa gắn nhãn**" if untagged else "; không còn ghi chú chưa gắn nhãn") + ".", "",
          "Mục `ĐÃ CHỐT`/`ĐÃ CÓ NGUỒN` vẫn giữ trong spec để người đọc biết điểm từng mở được giải quyết bằng gì. Ghi chú chỉ bị gỡ khi hình đã vẽ đúng nội dung đó hoặc ghi chú bị trùng — danh sách ở [verification-2026-10-08.md](verification-2026-10-08.md) mục 7.", "",
          "## 2. Theo loại", ""]
    for cat in list(CATEGORY_VI) + sorted(other):
        sel = [r for r in rows if r[0] == cat]
        if not sel:
            continue
        L += [f"### `{cat}`", "", "| Mã | Sơ đồ (mục 12, dòng) | Nội dung |", "| --- | --- | --- |"]
        for _, codes, sid, k, text in sorted(sel, key=lambda r: (int(DOI_RE.findall(r[1])[0][4:]) if DOI_RE.findall(r[1]) else 9999, r[2], r[3])):
            L.append(f"| {codes.replace('|', '/')} | `{sid}` #{k} | {text.replace('|', '/')} |")
        L.append("")
    if untagged:
        L += ["## 3. Chưa gắn nhãn", "", "| Sơ đồ | Dòng | Nội dung |", "| --- | --- | --- |"]
        L += [f"| `{sid}` | {k} | {t.replace('|', '/')} |" for sid, k, t in untagged]
        L.append("")
    return "\n".join(L)


TARGETS = {
    OUT: build,
    DIAGRAMS / "workflows-activity-diagram" / "index.md": build_wf_index,
    DIAGRAMS / "user-flows" / "index.md": build_uf_index,
    DIAGRAMS / "open-items.md": build_open_items,
}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    a = ap.parse_args()
    bad = 0
    for path, fn in TARGETS.items():
        text = fn()
        rel = path.relative_to(DIAGRAMS).as_posix()
        if a.check:
            if not path.exists() or path.read_text(encoding="utf-8") != text:
                print(f"FAIL {rel} differs from catalog/specs (run tools/build_index.py)")
                bad += 1
            else:
                print("ok", rel)
        else:
            path.write_text(text, encoding="utf-8", newline="\n")
            print("wrote", rel)
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
