"""Append/replace section 12 of Diagrams/handoff-erd-us-2026-10-09.md (HO outcomes per artefact).

Run from anywhere:  python -I -B Diagrams/tools/build_handoff12.py [--check]
The outcome data below is the canonical source of section 12 — edit here, then regenerate.
Outcome legend: DONE = AC/mô hình viết đủ theo nguồn (kể cả AC suy ra bắt buộc, có nguồn + lập luận ở Story)
· PARTIAL = còn câu hỏi chặn hoặc AC đề xuất chờ Owner (ghi mã) · — = không thuộc đầu ra đó · OPEN = việc của phiên sau.
"""
import re
import sys
from pathlib import Path

HANDOFF = Path(__file__).resolve().parents[1] / "handoff-erd-us-2026-10-09.md"

US = {}
for h in [1, 2, 3, 4, 5] + list(range(10, 25)) + [26, 27, 28, 30, 31, 33, 34, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45,
          46, 47, 48, 49, 50, 51, 60, 61, 62, 65, 68, 69, 70, 71, 72, 79, 80, 81, 92, 93]:
    US[h] = ("DONE", "")
US.update({
    25: ("DONE", "`OQ-B-07`, `OQ-B-06` đóng theo nguồn (11/10)"),
    29: ("DONE", "`OQ-C-05` — Owner chọn `QĐ-66k`"),
    32: ("DONE", "`OQ-C-01` — Owner chọn `QĐ-66j`"),
    35: ("DONE", "`OQ-A-23` — Owner chọn `QĐ-66p`"),
    63: ("DONE", "`OQ-C-03` — `QĐ-66m`; cách lưu phần theo người (`OQ-C-09`) ở thiết kế C4"),
    64: ("DONE", "`OQ-C-10` — Owner chọn `QĐ-66l`"),
    66: ("DONE", "`OQ-C-12`, `OQ-C-13` đóng theo nguồn (11/10)"),
    67: ("DONE", "`OQ-B-12` — `QĐ-66al`; mốc rà soát (`OQ-B-11a`) ở thiết kế"),
    73: ("DONE", "`OQ-B-06` đóng theo nguồn; phí thẻ/tỷ giá `QĐ-66y`"),
    74: ("DONE", "`OQ-F-07` — `QĐ-66y`"),
    75: ("DONE", "`OQ-F-09` đóng theo nguồn (`FR-5.3`)"),
    76: ("DONE", "`OQ-F-11` — `QĐ-66z`"),
    77: ("DONE", "`OQ-A-12` — `QĐ-66e`"),
    78: ("DONE", "`OQ-F-12` — `QĐ-66aa`; `OQ-F-13` — `QĐ-66ab`"),
    82: ("PARTIAL", "`OQ-26` chặn-thiết-kế (AC ép dữ liệu giả lập)"),
    83: ("PARTIAL", "`OQ-26` chặn-thiết-kế; `OQ-G-07` — `QĐ-66ac`"),
    84: ("DONE", "`OQ-G-10` — `QĐ-66o`"),
    90: ("PARTIAL", "`OQ-26` vẫn **chờ Owner**"),
    91: ("DONE", "Story xong; sổ đã ghi *bị thay một phần* cho `QĐ-40a/40c/48b/48d` (11/10)"),
    136: ("DONE", "`OQ-D-06` — `QĐ-66u`; thuê bao hết hạn `QĐ-66v`; *hạn ngắn* ở thiết kế"),
})
STORY = {1: "đầu tài liệu", 2: "mọi Epic", 3: "mục G (sinh tự động)", 4: "mọi Epic", 5: "D.16",
         10: "`US-01-02`", 11: "`US-01-01`", 12: "`US-01-04`", 13: "`US-01-05`", 14: "`US-01-09`", 15: "`US-02-02`",
         16: "`US-02-03`", 17: "`US-02-04`", 18: "`US-02-05`", 19: "`US-03-01`", 20: "`US-03-02`", 21: "`US-03-04`",
         22: "`US-03-05`", 23: "`US-04-01`", 24: "`US-04-02`", 25: "`US-04-03`", 26: "`US-04-04`", 27: "`US-04-09`",
         28: "`US-05-01`, `US-05-02`", 29: "`US-05-03`", 30: "`US-05-04`", 31: "`US-05-05`", 32: "`US-05-06`",
         33: "`US-05-09`", 34: "`US-05-12`", 35: "`US-05-13`", 36: "`US-05-15`", 37: "`US-06-01`, `-05`, `-06`, `-09`",
         38: "`US-06-04`", 39: "`US-07-01`, `US-07-02`", 40: "`US-07-03`, `US-07-04`", 41: "`US-07-05`", 42: "`US-07-07`",
         43: "`US-08-06`, `-08`, `US-09-06`, `-09`", 44: "`US-09-01`, `US-09-03`", 45: "`US-10-06`, `-07`, `US-12-05`, `US-14-05`",
         46: "`US-11-01`→`US-11-03`", 47: "`US-12-01`", 48: "`US-12-02`", 49: "`US-13-05`, `US-13-06`", 50: "`US-13-07`",
         51: "`US-15-02`→`-04` `RETIRED`", 60: "`US-03-06`", 61: "`US-04-10`", 62: "`US-03-07`", 63: "`US-05-17`",
         64: "`US-05-18`", 65: "`US-05-19`", 66: "`US-05-20` (+ `US-04-01/02`)", 67: "`US-04-11`", 68: "`US-04-12`",
         69: "`US-07-08`", 70: "`US-03-08`", 71: "`US-03-09`", 72: "`US-01-11`", 73: "`US-12-09`", 74: "`US-12-10`",
         75: "`US-12-11`", 76: "`US-12-12`", 77: "`US-12-13`", 78: "`US-12-14`", 79: "`US-12-15`", 80: "`US-01-12`",
         81: "`US-11-05`", 82: "`US-15-05`", 83: "`US-15-06`", 84: "`US-16-01`→`US-16-04`", 90: "`US-15-05`, `US-15-06`",
         91: "`US-02-02`, `US-03-04`", 92: "`US-03-01`, `US-03-06`", 93: "`US-05-06`, `US-06-01`", 136: "`US-07-09` (+ 8 Story giao điểm)"}
ERD = {101: ("DONE", "`Department` + *belongs to*, *headed by*, *supported by*, *charged to*"),
       102: ("DONE", "bỏ *manages*, *funds*; định nghĩa mới"),
       103: ("DONE", "20 bất biến, `INV-19`, `INV-20`; `INV-14a/b` suy ra"),
       104: ("DONE", "`Plan` là hộp"),
       105: ("DONE", "kho khóa: mô tả `Subscription`/`LicenseAssignment` + ánh xạ mục 6.1; bảng ở Logical (`HO-125`)"),
       106: ("DONE", "`Invoice` hộp; hồ sơ thuế thuộc `Vendor`; dòng thuế chi tiết `Invoice`"),
       107: ("DONE", "*standardizes* (`Department` → `Plan`); chức vụ là thuộc tính"),
       108: ("DONE", "*holds* + thành viên dùng chung (mô tả, Logical); `Unit`/`Company`"),
       109: ("DONE", "thiết bị: mô tả `UsageRecord` + ánh xạ mục 6.1; sổ thiết bị, xác nhận ở Logical"),
       110: ("DONE", "hồ sơ sai lệch: vòng đời ghi ở ánh xạ mục 6.1; bảng ở Logical"),
       111: ("DONE", "`RenewalDecision`"), 112: ("DONE", "1..* người thụ hưởng; quyết theo từng người `QĐ-66m`; cách lưu phần theo người ở Logical C4 (`OQ-C-09`)"),
       113: ("DONE", "v5.1 (`QĐ-65`), README, manifest, checker, script, bộ ghép mô tả trong `ERD/tools/`"),
       135: ("PARTIAL", "ánh xạ; lưu hay không chờ `OQ-G-06`")}
ERD_IMPACT = {10: 101, 15: 101, 16: 101, 19: 101, 27: 121, 60: 101, 61: 107, 66: 104, 67: 104, 68: 105, 69: 108,
              73: 106, 74: 106, 75: 132, 76: 133, 78: 134, 80: 112, 81: 111, 42: 110, 44: 109, 136: 128}
LOGICAL = {h: "OPEN — phiên Logical" for h in range(120, 136)}


def row(h):
    code = f"`HO-{h:02d}`" if h < 100 else f"`HO-{h}`"
    us = US.get(h)
    us_cell = f"`{us[0]}`" + (f" — {us[1]}" if us and us[1] else "") if us else "—"
    erd = ERD.get(h)
    erd_cell = f"`{erd[0]}` — {erd[1]}" if erd else (f"phản ánh ở `HO-{ERD_IMPACT[h]}`" if h in ERD_IMPACT else "—")
    log = LOGICAL.get(h, "OPEN — xem `HO-120`→`HO-135`" if h in ERD_IMPACT else "—")
    if 101 <= h <= 113:
        log = "OPEN — Logical chưa vẽ lại"
    return f"| {code} | {STORY.get(h, '—')} | {us_cell} | {erd_cell} | {log} |"


def main():
    hos = sorted({int(x) for x in re.findall(r"^\| `HO-(\d+)`", HANDOFF.read_text(encoding="utf-8"), re.M)})
    assert len(hos) == 106, len(hos)
    for h in range(120, 136):
        US.setdefault(h, ("—", "")) if False else None
    rows = [row(h) for h in hos]
    counts = {}
    for h in hos:
        if h in US:
            counts[US[h][0]] = counts.get(US[h][0], 0) + 1
    body = f"""
---

## 12. Kết cục sau lượt thiết kế lại 10–11/10/2026

> **Cập nhật 11/10/2026 sau `QĐ-66`:** các mục chặn bởi câu hỏi Owner đã được trả lời chuyển `DONE`; còn `PARTIAL` chỉ khi còn `OQ-26`/`OQ-G-06` hoặc câu chưa hỏi.
>
> **Phạm vi lượt này (điều chỉnh của Owner 11/10/2026):** User Stories + AC (ưu tiên cao nhất) và Conceptual ERD. **Use Case hoãn** sang phiên sau — mọi mục HO có tác động Use Case vẫn **mở ở đầu ra Use Case**; không mục nào được tuyên bố đã đồng bộ Use Case. **Logical ERD không vẽ lại** — các mục `HO-120` → `HO-135` và phần Logical của mục khác vẫn **mở**. Kết cục dưới đây là của trợ lý theo nguồn; **không** phải phê duyệt của Owner hay GVHD.
>
> **Đầu ra:** [User Stories v0.15](../BE-UserStory/user-stories-and-epics.md) (tệp sinh từ `BE-UserStory/src/`) · [Conceptual ERD v5.1](<../ERD/CONCEPTUAL ERD - DANH SÁCH ENTITY.md>) (mức tổng thể, `QĐ-65`; ánh xạ 32 thực thể v5.0 ở mục 6.1) · [index ERD](../ERD/README.md). Mục này sinh bởi [`tools/build_handoff12.py`](tools/build_handoff12.py) — sửa dữ liệu kết cục ở đó. Báo cáo bàn giao chi tiết (checker, ảnh đã xem, review độc lập): `Reviews/us-erd-uc-redesign-2026-10-10/HANDOFF.md` (thư mục bị Git bỏ qua).

**Chú giải:** `DONE` = viết đủ theo nguồn (AC suy ra **bắt buộc** từ quy tắc có sẵn ghi nguồn + lập luận ở Story) · `PARTIAL` = còn câu hỏi chặn **hoặc** AC là đề xuất chờ Owner xác nhận (ghi mã; im lặng không phải duyệt) · `OPEN` = việc của phiên sau · `—` = không thuộc đầu ra đó.

**Đếm đầu ra User Stories trên {len(hos)} mục:** {", ".join(f"`{k}` {v}" for k, v in sorted(counts.items()))} (mục có kết cục US); 16 mục `HO-120` → `HO-135` là Logical (không thuộc US). **Conceptual:** mẫu số là **{len(ERD)} mục có kết cục Conceptual riêng** (`HO-101` → `HO-113`, `HO-135`): {sum(1 for v in ERD.values() if v[0] == "DONE")} `DONE`, {sum(1 for v in ERD.values() if v[0] == "PARTIAL")} `PARTIAL` ({", ".join(f"`HO-{k}`" for k, v in sorted(ERD.items()) if v[0] == "PARTIAL")}); {len(ERD_IMPACT)} mục khác chỉ *phản ánh* qua các mục đó (cột Conceptual ghi mục nhận); `HO-120` → `HO-134` thuộc Logical, **không** tính vào mẫu số Conceptual.

| HO | Story / vị trí | User Stories v0.15 | Conceptual v5.1 | Logical / BE |
| --- | --- | --- | --- | --- |
""" + "\n".join(rows) + "\n"
    text = HANDOFF.read_text(encoding="utf-8")
    marker = "\n---\n\n## 12. Kết cục sau lượt thiết kế lại"
    if marker in text:
        text = text[: text.index(marker)]
    new = text.rstrip("\n") + "\n" + body
    if "--check" in sys.argv:
        same = HANDOFF.read_text(encoding="utf-8") == new
        print("section 12:", "khop nguon" if same else "LECH nguon")
        sys.exit(0 if same else 1)
    HANDOFF.write_text(new, encoding="utf-8", newline="\n")
    print("ok", counts)


if __name__ == "__main__":
    main()
