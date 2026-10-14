# Bộ sinh sơ đồ — quy ước spec và cách chạy

> **Phiên bản:** 1.2 — 10/10/2026 (1.1 — 10/10/2026 thêm mục 7; 1.0 — 08/10/2026). Áp cho main flow (`MF-*`), workflow (`WF-*`) và user flow (`UF-*`). Context và FDD có bộ sinh riêng trong thư mục của chúng.

## 1. Nguồn canonical và cách chạy

- Mỗi sơ đồ là **một tệp spec JSON** trong `Diagrams/specs/<ID>.json`. Đây là **nguồn canonical**: `.drawio`, `.drawio.png` và `.md` đều sinh từ spec. Sửa ở spec, **không** sửa tay `.drawio` rồi để lần sinh sau ghi đè.
- `specs/catalog.json` (coordinator sở hữu) liệt kê mọi mã sơ đồ hiện hành; node `call`/`ref` chỉ được trỏ tới mã có trong đó.
- Chạy từ `Docs/Diagrams`:

```bash
python tools/flowkit.py build specs/WF-09.json --png   # sinh .drawio, .md và PNG (cần draw.io Desktop)
python tools/flowkit.py check "specs/*.json"           # sinh lại trong bộ nhớ và so với tệp đã có
```

Bộ sinh **từ chối ghi** khi có lỗi mô hình (mục 4) hoặc lỗi hình học (node chồng nhau, dây đi xuyên node, hai dây chồng đoạn). Router dùng A* trực giao của `ERD/tools/erd_drawio.py`.

## 2. Quy tắc trình bày

- **Mọi chữ trên hình bằng tiếng Anh** (tiêu đề, làn, node, guard). Chỉ ký tự ASCII cộng `· – — → ←`. Không dùng `−` (dấu trừ Unicode) — viết `T-15`.
- Nền trắng, nét đen, Helvetica 12; không màu, không emoji, **không note/sticky trên hình**. Giải thích, giả định, ngoại lệ nằm trong trường `vi`, `doc` → tệp `.md`.
- Hành động: cụm động từ ngắn (≤ ~45 ký tự), Title Case. Rẽ nhánh: câu hỏi ngắn kết thúc bằng `?`. Guard: chữ thường, ngắn, mô tả điều kiện (`approved`, `not controllable`), bộ sinh tự thêm `[ ]`.
- Mỗi làn là một vai; làn hệ thống tên `SaaS-Sentry`. Vai trò dùng nhãn: `Employee`, `Department Head`, `IT Admin`, `Spending Approver`, `Finance`, `Super Admin`, `SaaS-Sentry`, `Software & SaaS Vendor` (nếu thật sự có trao đổi trong luồng).

## 3. Loại node

| `type` | Ký hiệu UML | Dùng khi |
| --- | --- | --- |
| `start` | Hình tròn đặc | Đúng **một** mỗi sơ đồ |
| `action` | Chữ nhật bo góc | Một việc của vai trong làn |
| `call` | Bo góc + cây đinh ba; cần `"ref": "WF-09a"` | Gọi workflow/main flow khác (mã phải có trong catalog) |
| `decision` | Hình thoi có chữ | Mọi cạnh ra có `guard`, ≥ 2 cạnh ra, tối đa 3 (một đỉnh dành cho cạnh vào) |
| `merge` | Hình thoi nhỏ | ≥ 2 vào, 1 ra; tối đa 3 cạnh vào — nhiều hơn thì nối hai merge |
| `fork` / `join` | Thanh đen | `fork`: 1 vào ≥ 2 ra; `join`: ≥ 2 vào 1 ra. `span: ["IT", "SYS:0"]` cho thanh dài qua nhiều làn (`LANE:slot` giới hạn tới một cột) |
| `event` | Năm cạnh lõm | Chờ một sự kiện từ ngoài luồng |
| `time` | Đồng hồ cát, nhãn bên phải | Chờ mốc thời gian (`T-15 Days Before...`) |
| `end` | Vòng tròn kép | Kết thúc toàn hoạt động — **chỉ dùng trước thanh tách**, hoặc khi kết cục chấm dứt mọi nhánh |
| `flowfinal` | Vòng tròn có dấu nhân | Kết thúc riêng một nhánh; **bắt buộc** cho kết cục nằm sau `fork` |
| *(user flow)* `terminal` | Bo tròn hai đầu | `"role": "start"` cho điểm đầu; các terminal khác là kết cục |
| *(user flow)* `screen` | Chữ nhật, dòng đầu đậm = `"code"` | Màn hình người dùng thao tác (mã màn hình là **đề xuất**) |
| *(user flow)* `system` | Chữ nhật nét đứt | Hệ thống xử lý, người dùng chỉ thấy kết quả |
| *(user flow)* `blocked` | Chữ nhật viền rất đậm | Màn hình chặn/lỗi |
| *(user flow)* `ref` | Chữ nhật hai vạch đứng; cần `"ref"` | Gọi user flow khác; có cạnh ra thì quay lại đi tiếp, không có cạnh ra thì là điểm dừng |

## 4. Kiểm tự động (từ chối ghi khi vi phạm)

Một `start`; `start` 0 vào/1 ra; mọi node tới được từ `start` và tới được một điểm kết thúc (không vòng chết, không nhánh cụt); `decision` ≥ 2 ra, đủ guard, guard không trùng; `merge`/`fork`/`join` đúng số cạnh; `action`/`call`/`event`/`time` đúng **một** cạnh ra (không fork ngầm); guard chỉ ở cạnh ra của `decision`; `call`/`ref` trỏ mã có trong catalog; chữ trên hình là tiếng Anh; mọi node trừ ký hiệu điều khiển có `vi`; đường đi trong `doc.happy/alternates/unhappy` phải đi đúng các cạnh có thật.

## 5. Cấu trúc spec

```json
{
  "id": "WF-09", "kind": "activity", "version": "3.0", "date": "08/10/2026",
  "title": "WF-09 · Access Request Routing & Approval",
  "out": "workflows-activity-diagram/WF-09-access-request-routing-approval",
  "lanes": [{"id": "REQ", "label": "Employee"}, {"id": "IT", "label": "IT Admin", "slots": 2}],
  "nodes": [
    {"id": "st", "type": "start", "lane": "REQ", "row": 0},
    {"id": "a1", "type": "action", "lane": "REQ", "row": 1, "slot": 0, "label": "Submit Request",
     "vi": "Giải thích tiếng Việt", "rules": ["FR-3.2", "QĐ-52c"]}
  ],
  "edges": [{"from": "st", "to": "a1"},
            {"from": "d1", "to": "a2", "guard": "approved", "vi": "điều kiện", "result": "kết quả"}],
  "doc": {"level": "...", "status": "...", "purpose": "...", "scope": "...", "excluded": "...",
          "lanes_vi": {"REQ": ["tác nhân", "trách nhiệm"]}, "trigger": "...", "pre": "...", "post": "...",
          "reading": "...", "sources": [["FR-3.2", "nội dung"]], "happy": ["st", "a1"],
          "alternates": [{"title": "...", "path": ["d1", "a2"], "note": "..."}],
          "unhappy": [{"title": "...", "path": [], "note": "..."}],
          "relations": ["..."], "open": ["..."]}
}
```

## 6. Bố cục — mẹo để hình sạch

- Lưới `lane` × `row` (`slot` khi một làn cần nhiều cột; đặt `"slots": n` ở làn). Mỗi hàng một tầng; node cùng hàng phải khác làn/slot.
- Đặt đích của nhánh **xuống một hàng** so với hình thoi (không cùng hàng) để nhãn guard có chỗ.
- Đặt làn theo thứ tự bàn giao để dây ngắn; làn hệ thống thường đặt cạnh làn trao đổi nhiều nhất.
- Vòng lặp quay lên: cạnh từ hình thoi tới node phía trên tự đi đỉnh trái/phải.
- Có thể ép cạnh: `"sides": ["L", "T"]` (đỉnh ra, cạnh vào).
- Sau khi sinh, **mở PNG và nhìn**: chữ không bị cắt, guard đọc được và nằm cạnh đúng dây, không có đoạn dây khó phân biệt. Số giao cắt in ra ở kết quả; giao cắt được vẽ cung nhảy.

## 7. Ngoại lệ biểu diễn đã chấp nhận (ghi 10/10/2026)

- **Luồng phụ bắt đầu bằng sự kiện cùng nút `end` của nhánh chính.** Một số workflow (WF-02, WF-03, WF-09, WF-15, WF-17, WF-20) có luồng phụ "có thể xảy ra bất cứ lúc nào" (nhắc quá SLA, đợi sự kiện bên ngoài) vẽ bằng `event` không có cạnh vào, trong khi nhánh chính kết thúc bằng `end` (activity final). Đọc chặt theo UML 2.5, activity final hủy cả các luồng phụ đang chờ. **Cách đọc đã chấp nhận:** mỗi luồng phụ là một lần xử lý độc lập kết thúc ở nút cuối riêng của nó; kết thúc nhánh chính **không** hủy việc nhắc hay xử lý đang chạy. Quy ước đọc ngắn gọn: *luồng phụ bắt đầu bằng `event` không có cạnh vào được coi là một lần chạy độc lập*. Dùng `flowfinal` thay `end` ở nơi bản thân nhánh chính kết thúc mà các nhánh khác của **cùng một hoạt động** vẫn phải chạy tiếp tới nút cuối riêng của chúng (như WF-07 `end_ok`, nơi từng công cụ giữ có hạn tự kết thúc). Đây là **quy ước đọc nội bộ đã ghi, không phải bằng chứng hình tuân thủ đầy đủ UML 2.5**: `flowfinal` hoặc tách hoạt động vẫn là cách sạch hơn về lâu dài. Không đổi nghiệp vụ; đổi ký hiệu hàng loạt bị hoãn vì làm đổi hình mà không đổi hành vi. Người đọc `.md` của sáu workflow này được dẫn về mục này ở phần *Cách đọc*.
- **Nhãn guard sát đường dọc của cạnh vào** (ví dụ WF-09a `[pending, under N days]`): chấp nhận khi nhãn không đè chữ và không chạm đỉnh node; bố cục chi tiết nằm trong spec (`sides`, `slot`, `dx`).
- Giao cắt có cầu nhảy (`jumpStyle=arc`) là hợp lệ; số giao cắt in ra ở lần `check`.

## 8. Mục 12 của tài liệu bàn giao ERD + US

[`build_handoff12.py`](build_handoff12.py) sinh mục *12. Kết cục sau lượt thiết kế lại* của [handoff-erd-us-2026-10-09.md](../handoff-erd-us-2026-10-09.md) từ dữ liệu kết cục ghi trong chính script (kết cục từng mục `HO-` theo ba đầu ra User Stories · Conceptual · Logical). Sửa kết cục ở script, rồi chạy `python -I -B Diagrams/tools/build_handoff12.py`; `--check` chỉ so mục 12 với nguồn. Không sửa tay mục 12.
