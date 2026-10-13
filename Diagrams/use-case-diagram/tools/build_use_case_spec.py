"""Fill the generated tables of ../use-case-specification.md from the model and the owning sources.

    python -X utf8 build_use_case_spec.py            # rewrite the GENERATED blocks in place
    python -X utf8 build_use_case_spec.py --check    # exit 1 if the blocks are stale

Rule text is copied verbatim from its owner (User Flows for BR-ff.n, BRD for SoD/INV), so the
specification can never drift from the source; the model files only say which code maps where.
"""
import argparse
import re
import sys
from pathlib import Path

import usecase_model as M
import usecase_trace as T

HERE = Path(__file__).resolve().parent
UC_DIR = HERE.parent
DOCS = UC_DIR.parent.parent
SPEC = UC_DIR / "use-case-specification.md"
USER_FLOWS = DOCS / "Diagrams" / "user-flows" / "index.md"
BRD = DOCS / "Requiments" / "BRD - HỆ THỐNG QUẢN TRỊ BẢN QUYỀN PHẦN MỀM & TỐI ƯU CHI PHÍ CÔNG NGHỆ.md"
USER_STORIES = DOCS / "BE-UserStory" / "user-stories-and-epics.md"

GROUPS = [
    ("Truy cập và quản trị", ["UC01", "UC02", "UC03", "UC04", "UC05"]),
    ("Tổ chức và vòng đời nhân sự", ["UC06", "UC07", "UC08"]),
    ("Danh mục, hợp đồng, thuê bao", ["UC09", "UC10"]),
    ("Yêu cầu, quyết định, thực thi", ["UC11", "UC13", "UC14", "UC15", "UC55", "UC16", "UC30", "UC43", "UC17",
                                      "UC21", "UC22"]),
    ("Ngân sách và chi phí", ["UC20", "UC32", "UC33", "UC36"]),
    ("Bằng chứng sử dụng và tối ưu license", ["UC24", "UC26", "UC27", "UC48", "UC28", "UC23"]),
    ("Gia hạn", ["UC29"]),
    ("Shadow IT", ["UC42"]),
    ("Báo cáo", ["UC56"]),
    ("Quyền dữ liệu cá nhân", ["UC44", "UC47"]),
    ("Import dùng chung", ["UC54"]),
]
LEVEL = {"UC55": "Trừu tượng", "UC54": "Subfunction", "UC17": "Subfunction (phần mở rộng)"}
UML = {
    "gen": "§9.2.3.2 tr. 100; §9.2.4.2 tr. 102",
    "include": "§18.1.3.3 tr. 641",
    "extend": "§18.1.3.2 tr. 640–641; §18.2.2.5 tr. 648",
}
ACTION_VI = {"keep": "Giữ", "rename": "Đổi tên / mở rộng", "merge": "Gộp", "split": "Tách",
             "subflow": "Thành bước con", "deferred": "Deferred"}
CODE = r"[`*~]*"


# ---------------------------------------------------------------- source parsing
def parse_user_flows():
    """{BR code: (flow code, flow name, text)} from the rule tables of User Flows."""
    rules, flow, names = {}, None, {}
    for line in USER_FLOWS.read_text(encoding="utf-8").splitlines():
        h = re.match(r"^#{2,4}\s+[\d.a-z]+\s+(?:`?F-(\d\d)`?(?:\s+(?:và|,)\s+`?F-(\d\d)`?)*)\s*·\s*(.+)$", line)
        if h:
            names[h.group(1)] = re.sub(r"\s*\*\(.*?\)\*\s*$", "", h.group(3)).strip()
            if h.group(2):
                names[h.group(2)] = names[h.group(1)]
            continue
        m = re.match(rf"^\|\s*{CODE}(BR-(\d\d)\.\d+){CODE}\s*\|\s*(.+?)\s*\|\s*$", line)
        if m:
            rules[m.group(1)] = (f"F-{m.group(2)}", m.group(3))
    return {k: (f, names.get(f[2:], ""), t) for k, (f, t) in rules.items()}


def parse_brd_rules():
    """{SoD-n / INV-nn: text} from the BRD SoD and invariant tables."""
    out = {}
    for line in BRD.read_text(encoding="utf-8").splitlines():
        m = re.match(r"^\|\s*\*\*((?:SoD-\d)|(?:INV-\d\d[ab]?))\*\*\s*\|\s*(.+?)\s*\|", line)
        if m and m.group(1) not in out:
            out[m.group(1)] = m.group(2)
    return out


def parse_user_stories():
    """{US code: set of cited codes} for every story section."""
    stories, cur = {}, None
    for line in USER_STORIES.read_text(encoding="utf-8").splitlines():
        h = re.match(r"^####\s+`(US-\d\d-\d\d)`", line)
        if h:
            cur = h.group(1)
            stories[cur] = set()
            continue
        if re.match(r"^#{1,4}\s", line) and not line.startswith("#####"):
            cur = None
        if cur:
            stories[cur].update(re.findall(r"(?:BR-\d\d\.\d+|FR-\d+\.\d+[a-z]?(?:-\d)?|SoD-\d|INV-\d\d[ab]?)", line))
    return stories


# ---------------------------------------------------------------- helpers
def uc_link(uc):
    return f"[{uc}](#{uc.lower()})"


def actor_ref(a):
    return f"[{a}](#{a.lower()}) {M.ACTORS[a]['label']}"


def codes(xs):
    return ", ".join(f"`{x}`" for x in xs) if xs else "—"


def fr_key(code):
    return (tuple(int(n) for n in re.findall(r"\d+", code)), code)


def rule_key(code):
    kind = 0 if code.startswith("SoD") else 1 if code.startswith("INV") else 2
    return (kind, tuple(int(n) for n in re.findall(r"\d+", code)), code)


def inherited(uc):
    if "A01" in M.actors_of(uc):
        return "A02–A06 qua A12 → A01 (chỉ phạm vi bản thân)"
    if uc == "UC56":
        return "A02–A06 qua A12 (phạm vi theo BRD 5.5.3)"
    if any(g["specific"] == uc for g in M.UC_GENERALIZATIONS):
        return "A05 qua UC55"
    for r in M.EXTENDS:
        if r["source"] == uc and not M.actors_of(uc):
            return f"{', '.join(M.actors_of(r['target']))} trong lần thực hiện {r['target']} ({r['id']})"
    return "—"


def relations_of(uc):
    out = []
    for g in M.UC_GENERALIZATIONS:
        if g["specific"] == uc:
            out.append(f"{g['id']}: chuyên biệt hóa {g['general']}")
        if g["general"] == uc:
            out.append(f"{g['id']}: tổng quát của {g['specific']}")
    for r in M.INCLUDES:
        if r["source"] == uc:
            out.append(f"{r['id']}: «include» {r['target']}")
        if r["target"] == uc:
            out.append(f"{r['id']}: được {r['source']} «include»")
    for r in M.EXTENDS:
        if r["source"] == uc:
            out.append(f"{r['id']}: «extend» {r['target']}")
        if r["target"] == uc:
            out.append(f"{r['id']}: được {r['source']} «extend» tại *{r['point']}*")
    return "; ".join(out) or "—"


def group_of(uc):
    return next(name for name, ucs in GROUPS if uc in ucs)


def uc_brs():
    inv = {}
    for uc, t in T.TRACE.items():
        for code in t["BR"] + t["RULE"]:
            inv.setdefault(code, []).append(uc)
    return inv


# ---------------------------------------------------------------- tables
def table_uc_list():
    rows = ["| UC | Tên (EN · VN) | Mức | Actor chính | Actor hỗ trợ | Tham gia qua kế thừa | Quan hệ UC–UC | Nhóm |",
            "| --- | --- | --- | --- | --- | --- | --- | --- |"]
    for _, ucs in GROUPS:
        for uc in ucs:
            u = M.USE_CASES[uc]
            name = f"*{u['name']}*" if u.get("abstract") else u["name"]
            prim = [a for a, x, r in M.ASSOCIATIONS if x == uc and r == "primary"]
            sup = [a for a, x, r in M.ASSOCIATIONS if x == uc and r == "support"]
            rows.append(f"| {uc_link(uc)} | {name} · {u['vi']} | {LEVEL.get(uc, 'User goal')} | "
                        f"{', '.join(actor_ref(a) for a in prim) or '—'} | {', '.join(actor_ref(a) for a in sup) or '—'} | "
                        f"{inherited(uc)} | {relations_of(uc)} | {group_of(uc)} |")
    n_goal = sum(1 for uc in M.USE_CASES if uc not in LEVEL)
    rows.append("")
    rows.append(f"**Tổng:** {len(M.USE_CASES)} UC trên sơ đồ — {n_goal} user goal, "
                f"{sum(1 for v in LEVEL.values() if v.startswith('Subfunction'))} subfunction, 1 trừu tượng; "
                f"{len(M.DEFERRED_USE_CASES)} UC deferred ở [mục 4.12](#deferred). "
                f"Mọi UC có ít nhất một actor tham gia trực tiếp hoặc qua kế thừa; UC17 tham gia qua UC cơ sở UC55.")
    return "\n".join(rows)


def table_relationships():
    rows = ["| ID | Loại | Từ | Tới | Ý nghĩa · extension point · điều kiện | UML 2.5.1 |",
            "| --- | --- | --- | --- | --- | --- |"]
    for g in M.ACTOR_GENERALIZATIONS:
        s, t = g["specific"], g["general"]
        rows.append(f"| {g['id']} | Generalization (actor) | {actor_ref(s)} | {actor_ref(t)} | "
                    f"Mỗi {M.ACTORS[s]['label']} là một {M.ACTORS[t]['label']}; chỉ kế thừa association của actor cha | "
                    f"{UML['gen']} |")
    for g in M.UC_GENERALIZATIONS:
        s, t = g["specific"], g["general"]
        rows.append(f"| {g['id']} | Generalization (use case) | {uc_link(s)} {M.uc_label(s)} | {uc_link(t)} "
                    f"*{M.uc_label(t)}* | Kế thừa hành vi quyết định chung, association với A05 và extension point "
                    f"*Assess Budget* | {UML['gen']} |")
    for r in M.INCLUDES:
        rows.append(f"| {r['id']} | «include» | {uc_link(r['source'])} {M.uc_label(r['source'])} | "
                    f"{uc_link(r['target'])} {M.uc_label(r['target'])} | {r['behaviour']} | {UML['include']} |")
    for r in M.EXTENDS:
        rows.append(f"| {r['id']} | «extend» | {uc_link(r['source'])} {M.uc_label(r['source'])} | "
                    f"{uc_link(r['target'])} {M.uc_label(r['target'])} | Extension point *{r['point']}*; điều kiện "
                    f"`{r['condition']}` | {UML['extend']} |")
    rows += ["", f"**Association ({len(M.ASSOCIATIONS)})** — đường liền, không mũi tên; *chính* = actor sở hữu mục tiêu, "
             "*hỗ trợ* = cung cấp đầu vào/dịch vụ hoặc nhận kết quả. Hai loại vẽ giống nhau (UML không phân biệt); "
             "mã của mỗi đường là `AS-<actor>-<UC>`.", "",
             "| Actor | Chính | Hỗ trợ | Số |", "| --- | --- | --- | --- |"]
    for a in M.ACTORS:
        prim = [u for x, u, r in M.ASSOCIATIONS if x == a and r == "primary"]
        sup = [u for x, u, r in M.ASSOCIATIONS if x == a and r == "support"]
        if prim or sup:
            rows.append(f"| {actor_ref(a)} | {', '.join(uc_link(u) for u in prim) or '—'} | "
                        f"{', '.join(uc_link(u) for u in sup) or '—'} | {len(prim) + len(sup)} |")
    n_rel = len(M.ACTOR_GENERALIZATIONS) + len(M.UC_GENERALIZATIONS) + len(M.INCLUDES) + len(M.EXTENDS)
    rows += ["", f"**Tổng quan hệ trên sơ đồ:** {len(M.ASSOCIATIONS)} association + {len(M.ACTOR_GENERALIZATIONS)} "
             f"generalization actor + {len(M.UC_GENERALIZATIONS)} generalization use case + {len(M.INCLUDES)} «include» + "
             f"{len(M.EXTENDS)} «extend» = {len(M.ASSOCIATIONS) + n_rel}."]
    return "\n".join(rows)


def rule_status(code, retired):
    new = {c: src for rows in T.NEW_BR.values() for c, _, src in rows}
    if retired:
        return "Nghỉ hưu"
    if code in new:
        return "Mới 25/09/2026 — OWNER DECISION"
    if code in T.BR_CLARIFIED:
        return "Làm rõ 25/09/2026 — OWNER DECISION"
    return "Hiện hành"


def table_business_rules():
    flows = parse_user_flows()
    brd = parse_brd_rules()
    stories = parse_user_stories()
    by_rule = uc_brs()
    new_src = {c: src for rows in T.NEW_BR.values() for c, _, src in rows}
    rows = ["| BR | Nội dung (nguyên văn nguồn) | Phạm vi | UC | US | FR | Nguồn | Trạng thái |",
            "| --- | --- | --- | --- | --- | --- | --- | --- |"]
    all_codes = sorted(set(brd) | set(flows), key=rule_key)
    for code in all_codes:
        if code in brd:
            text, scope = brd[code], ("BRD 4.2 — phân tách nhiệm vụ" if code.startswith("SoD") else "BRD 5.12.2 — bất biến")
            source = "BRD"
        else:
            f, fname, text = flows[code]
            scope = f"`{f}` {fname}".strip()
            source = f"User Flows `{f}`" + (f" · {new_src[code]}" if code in new_src else "")
        ucs = by_rule.get(code, [])
        us = sorted(u for u, cited in stories.items() if code in cited)
        fr = set(re.findall(r"FR-\d+\.\d+[a-z]?(?:-\d)?", text))
        uc_fr = {x for uc in ucs for x in T.TRACE[uc]["FR"]}
        for u in us:
            fr |= {x for x in stories[u] if x.startswith("FR-") and x in uc_fr}
        retired = code in T.NOT_MODELLED
        uc_cell = ", ".join(uc_link(u) for u in ucs) if ucs else ("— *(nghỉ hưu)*" if retired else "—")
        rows.append(f"| `{code}` | {text} | {scope} | {uc_cell} | {codes(us)} | "
                    f"{codes(sorted(fr, key=fr_key))} | {source} | {rule_status(code, retired)} |")
    rows += ["", f"**Tổng:** {len(all_codes)} quy tắc — {len(brd)} SoD/INV của BRD, {len(flows)} BR của User Flows "
             f"({sum(len(v) for v in T.NEW_BR.values())} mới, {len(T.BR_CLARIFIED)} làm rõ, "
             f"{sum(1 for c in T.NOT_MODELLED if c.startswith('BR-'))} nghỉ hưu). Cột *US* liệt kê story có trích mã "
             "quy tắc trong đặc tả/AC; *FR* là FR được chính quy tắc hoặc story đó trích và thuộc UC liên quan."]
    return "\n".join(rows)


def table_traceability():
    stories = parse_user_stories()
    rows = ["| UC | Actor | FR | SoD / INV | BR | Luồng F | WF | UF | US | Quyết định |",
            "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |"]
    order = [uc for _, ucs in GROUPS for uc in ucs] + list(M.DEFERRED_USE_CASES)
    for uc in order:
        t = T.TRACE[uc]
        acts = ", ".join(M.actors_of(uc)) if uc in M.USE_CASES else "*(deferred)*"
        if uc in M.USE_CASES and not M.actors_of(uc):
            parent = [g["general"] for g in M.UC_GENERALIZATIONS if g["specific"] == uc]
            base = [r["target"] for r in M.EXTENDS if r["source"] == uc]
            acts = f"{', '.join(M.actors_of((parent or base)[0]))} *(qua {(parent or base)[0]})*"
        rows.append(f"| {uc_link(uc)} | {acts or '—'} | {codes(t['FR'])} | {codes(t['RULE'])} | {codes(t['BR'])} | "
                    f"{codes(t['F'])} | {codes(t['WF'])} | {codes(t['UF'])} | {codes(t['US'])} | {codes(t['DEC'])} |")
    us_to_uc = {}
    for uc in order:
        for u in T.TRACE[uc]["US"]:
            us_to_uc.setdefault(u, []).append(uc)
    rows += ["", "**Chiều ngược — User Story → UC** (mọi story của User Stories; story của TE/EP kỹ thuật không có "
             "mục tiêu actor thì ghi *kỹ thuật*):", "", "| Epic | US → UC |", "| --- | --- |"]
    epics = {}
    for u in sorted(set(stories) | set(us_to_uc)):
        epics.setdefault(u[3:5], []).append(u)
    for ep, us in sorted(epics.items()):
        cells = [f"`{u}` → {', '.join(us_to_uc[u]) if u in us_to_uc else '*kỹ thuật*'}" for u in us]
        rows.append(f"| EP-{ep} | {'; '.join(cells)} |")
    fr_to_uc = {}
    for uc in order:
        for f in T.TRACE[uc]["FR"]:
            fr_to_uc.setdefault(f, []).append(uc)
    rows += ["", "**Chiều ngược — FR → UC:**", "", "| Nhóm | FR → UC |", "| --- | --- |"]
    groups = {}
    for f in sorted(fr_to_uc, key=fr_key):
        groups.setdefault(f.split(".")[0], []).append(f)
    for g, frs in sorted(groups.items(), key=lambda kv: fr_key(kv[0])):
        rows.append(f"| {g}.x | {'; '.join(f'`{f}` → ' + ', '.join(fr_to_uc[f]) for f in frs)} |")
    rows += ["", "**Mã có chủ đích không gán UC:**", "", "| Mã | Lý do |", "| --- | --- |"]
    rows += [f"| `{c}` | {why} |" for c, why in T.NOT_MODELLED.items()]
    return "\n".join(rows)


def table_old_to_new():
    rows = ["| UC cũ | Tên cũ | Hành động | UC mới | Lý do |", "| --- | --- | --- | --- | --- |"]
    for old, (action, new, label, why) in M.OLD_TO_NEW.items():
        rows.append(f"| {old} | {label} | {ACTION_VI[action]} | {', '.join(uc_link(u) for u in new)} | {why} |")
    rows += ["", "| UC mới | Tên | Nguồn gốc |", "| --- | --- | --- |"]
    rows += [f"| {uc_link(u)} | {M.uc_label(u)} | {why} |" for u, why in M.NEW_USE_CASES.items()]
    rows += ["", "| Quan hệ cũ | Nay là |", "| --- | --- |"]
    rows += [f"| {k} | {v} |" for k, v in M.OLD_RELATIONS_TO_NEW.items()]
    counts = {}
    for action, *_ in M.OLD_TO_NEW.values():
        counts[action] = counts.get(action, 0) + 1
    rows += ["", "**Tổng:** " + ", ".join(f"{ACTION_VI[k]} {v}" for k, v in counts.items())
             + f" = {len(M.OLD_TO_NEW)} mã cũ (48 MVP + 5 deferred); {len(M.NEW_USE_CASES)} mã mới. "
             "Không mã cũ nào bị dùng lại với nghĩa khác."]
    return "\n".join(rows)


BLOCKS = {
    "uc-list": table_uc_list,
    "relationship-ledger": table_relationships,
    "br-table": table_business_rules,
    "traceability": table_traceability,
    "old-to-new": table_old_to_new,
}


def render(text):
    for name, fn in BLOCKS.items():
        begin, end = f"<!-- GENERATED:{name}:BEGIN -->", f"<!-- GENERATED:{name}:END -->"
        if text.count(begin) != 1 or text.count(end) != 1:
            raise SystemExit(f"marker {name} missing or duplicated in {SPEC.name}")
        a, b = text.index(begin) + len(begin), text.index(end)
        text = text[:a] + "\n" + fn() + "\n" + text[b:]
    return text


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()
    old = SPEC.read_text(encoding="utf-8")
    new = render(old)
    if args.check:
        if new != old:
            print(f"STALE: {SPEC.name} generated tables differ from the model/sources; run build_use_case_spec.py")
            sys.exit(1)
        print("generated tables up to date")
        return
    if new != old:
        SPEC.write_text(new, encoding="utf-8", newline="\n")
    print(f"wrote {SPEC.name}")


if __name__ == "__main__":
    main()
