# Kiểm chứng lượt vẽ lại bộ sơ đồ — 08/10/2026 (hoàn tất 09/10/2026)

> Ghi lại **những gì đã thực sự kiểm** của lượt vẽ lại sau Review 1. Đây là kiểm của nhóm (trợ lý theo yêu cầu Owner) và một agent review độc lập — **không** phải xác nhận của GVHD hay hội đồng. Index chung: [index.md](index.md).

## 1. Phân biệt trạng thái

| Trạng thái | Phạm vi | Ghi chú |
| --- | --- | --- |
| **Đã vẽ** | Context (1), FDD (1), 5 main flow, 24 workflow, 21 user flow | Nguồn: `specs/*.json`, `function-tree.json`, `specs/CTX.json` |
| **Đã đồng bộ** | `index.md` chung, `workflows-activity-diagram/index.md`, `user-flows/index.md` (sinh từ catalog); `main-workflows-activity-diagram/index.md`; `context-diagram/index.md`; `functional-decomposition-guide.md`; tham chiếu ở Định nghĩa phạm vi Phần VII và BRD §11 (chỉ đường dẫn/phiên bản/trạng thái) | User Stories **chưa** đồng bộ (`QĐ-59e`, giai đoạn ERD + User Stories) |
| **Kiểm cấu trúc (tự động)** | Toàn bộ — mục 2 | Bộ kiểm không bị nới để cho qua |
| **Kiểm hình (xem PNG)** | Toàn bộ 52 hình, xem lại sau lần sửa bộ sinh cuối — mục 3 | |
| **Review độc lập** | Toàn bộ — mục 4 | 5 MAJOR, 10 MINOR, 0 BLOCKER; xử lý ở mục 4 |
| **Chờ Owner / GVHD xem** | Toàn bộ bộ sơ đồ; câu hỏi mở ở mục 5 | Chưa có xác nhận nào của GVHD/hội đồng cho bộ này |

## 2. Kết quả bộ kiểm tự động (lần chạy cuối, 09/10/2026)

Chạy từ `Docs/Diagrams` (Git Bash, `PYTHONIOENCODING=utf-8`):

```text
python tools/flowkit.py check "specs/*.json"                  → 50/50 ok, tổng 15 giao cắt (đều vẽ cầu nhảy)
python context-diagram/tools/build_context_diagram.py --check → ok CTX entities=8 flows=41
python functional-decomposition-diagram/build_fdd.py --check  → ok FDD features=15 functions=84
python tools/build_index.py --check                           → ok index.md · ok workflows-activity-diagram/index.md · ok user-flows/index.md
python tools/check_links.py <Scope> <BRD>                     → ok links checked=581 broken=0
```

`flowkit check` kiểm mô hình (một điểm bắt đầu; decision ≥ 2 nhánh có guard không trùng; merge/fork/join đúng số cạnh; action đúng một cạnh ra; mọi node tới được từ start và tới được điểm kết thúc — không nhánh cụt, không vòng chết; chữ trên hình tiếng Anh; mọi node có `vi`; đường đi trong tài liệu theo cạnh có thật; `call`/`ref` trỏ mã trong catalog) và hình học (không chồng node, nhãn không đè hộp, đường không xuyên node, đếm giao cắt).

Cảnh báo còn lại (không phải lỗi, đã xem hình): nhãn `[transient, retries left]` ở `UF-08` nằm sát đúng cạnh của nó nhưng chạm vùng đệm của hộp bên cạnh; `fallback sides` ở `WF-01` (`d_log→end`), `WF-09` (`d_sa→s_com`, `d_br→m_sa`) — đường đi đúng.

| Sơ đồ | Node | Cạnh | Giao cắt |
| --- | --- | --- | --- |
| MF-2 | 33 | 35 | 2 |
| MF-4 | 29 | 31 | 1 |
| MF-5 | 30 | 32 | 0 |
| MF-7 | 26 | 29 | 0 |
| MF-8 | 27 | 32 | 2 |
| WF-01 | 21 | 22 | 0 |
| WF-02 | 29 | 31 | 3 |
| WF-03 | 24 | 25 | 0 |
| WF-04 | 16 | 17 | 1 |
| WF-05 | 32 | 37 | 0 |
| WF-06 | 16 | 15 | 0 |
| WF-07 | 39 | 44 | 0 |
| WF-08 | 14 | 15 | 0 |
| WF-09 | 48 | 49 | 2 |
| WF-09a | 25 | 28 | 1 |
| WF-10 | 18 | 19 | 0 |
| WF-11 | 18 | 18 | 1 |
| WF-12 | 23 | 25 | 0 |
| WF-12a | 17 | 19 | 0 |
| WF-13 | 31 | 33 | 0 |
| WF-13a | 22 | 29 | 0 |
| WF-14 | 11 | 12 | 0 |
| WF-15 | 36 | 38 | 0 |
| WF-16 | 25 | 29 | 0 |
| WF-17 | 35 | 39 | 2 |
| WF-17a | 18 | 21 | 0 |
| WF-18 | 24 | 23 | 0 |
| WF-19 | 27 | 34 | 0 |
| WF-20 | 18 | 18 | 0 |
| UF-01 → UF-21 | 14 – 32 | 14 – 37 | 0 (cả 21) |

## 3. Ảnh đã mở và xem

Sau lần sửa bộ sinh cuối (đặt nhãn guard trong đúng một đoạn của cạnh, ước lượng bề rộng chữ, gỡ móc ngắn ở cổng, cổng thanh fork/join), **cả 52 ảnh** đã được build lại và mở xem toàn hình:

- Context Diagram; Functional Decomposition (84 chức năng).
- `MF-2`, `MF-7`, `MF-5`, `MF-8`, `MF-4`.
- `WF-01` → `WF-20`, `WF-09a`, `WF-12a`, `WF-13a`, `WF-17a` (24 hình).
- `UF-01` → `UF-21` (21 hình).

Tiêu chí khi xem: nền trắng, chữ đen, một font; không ghi chú dài trên canvas; không chữ bị cắt; không đường xuyên node; nhãn guard nằm sát cạnh của nó; đường vuông góc; một sơ đồ hoàn chỉnh mỗi tệp. PNG có nhúng nguồn draw.io; `.drawio` là XML gốc sửa được.

## 4. Review độc lập và xử lý

Lần 1 (08/10 tối) không hoàn tất vì giới hạn phiên (HTTP 429); 4/5 agent viết UF cũng dừng — điều phối viên tự viết `UF-09`, `UF-10`, `UF-12`, `UF-13`, `UF-15`, `UF-17`, `UF-19` và xem lại 9 UF agent đã viết. Lần 2 (09/10) chạy hết trên toàn bộ 52 hình, chỉ đọc. Kết luận reviewer: Context **PASS**, FDD **PASS** (1 sửa nhỏ), MF **PASS có sửa**, WF **REVISE**, UF **PASS có sửa nhỏ**. Xử lý:

| # | Mức | Phát hiện | Xử lý |
| --- | --- | --- | --- |
| 1 | MAJOR | Bàn giao dữ liệu không đứng trước thu hồi (MF-5, WF-07, UF-09) — FR-2.12, BM-08 | **Đã sửa:** thêm cổng *Data Handover Confirmed?* ngay trước *Reclaim Each Access*; chưa xác nhận mà quá hạn thì thu hồi vẫn tiếp tục và ghi cờ (FR-2.12 *bàn giao không chặn thu hồi quá hạn*) |
| 2 | MAJOR | Nghỉ đột ngột bỏ qua bàn giao (WF-07, UF-09) | **Đã sửa theo cách hiểu an toàn:** nhánh đột ngột vẫn đề nghị trưởng phòng xác nhận bàn giao ngay, không chặn thu hồi. Ghi là câu hỏi Owner O-4 |
| 3 | MAJOR | WF-02: phần mềm nội bộ kết thúc cụt, không có gói K5, không vào danh mục | **Đã sửa:** nhánh nội bộ → *Define K5 Plan: Manual Access, No Seats* → nhập vào *Make Entry Available in Catalog* (QĐ-54a, QĐ-49b) |
| 4 | MAJOR | WF-08 và WF-11 gọi lẫn nhau, nhắc T-7 hai lần, cửa sổ gia hạn mâu thuẫn | **Đã sửa:** WF-08 sở hữu nhắc T-7 và hết hạn, chỉ *đọc* kết quả gia hạn đang chờ (không gọi WF-11); WF-11 chỉ nhận yêu cầu gia hạn gửi trước ngày kết thúc, quyết ở làn trưởng phòng qua WF-09 |
| 5 | MAJOR | Nhãn guard trôi xa cạnh (~35 nhãn) | **Đã sửa trong bộ sinh** (nhãn phải nằm trọn trong một đoạn thẳng của chính cạnh, bề rộng chữ theo font thật); build lại và xem lại cả 52 hình |
| 6 | MINOR | Finance cập nhật thuê bao (MF-8, WF-16, UF-14) — dữ liệu thuê bao do IT nhập | **Chưa đổi** — để Owner chốt (O-5); ghi ở `WF-16` mục 12 |
| 7 | MINOR | FDD 15.3 *Vendor Match Suggestion* có trên hình trình bày, trái `QĐ-49e` | **Đã sửa:** bỏ khỏi hình (FDD còn 84 chức năng), ghi ở mục *Không đưa vào hình*; vẫn vẽ ở mức chi tiết trong `WF-17a` |
| 8 | MINOR | WF-09 phần mềm nội bộ đi qua *Seat Available Now? [yes]* | **Đã sửa:** guard đổi thành *[seat free or not counted]* |
| 9 | MINOR | Chỉ định trưởng phòng mới là bắt buộc (MF-5, WF-07) | **Đã sửa:** *Appoint New Head or Record None Yet* — chưa có người thì ghi tường minh, đi approver dự phòng (FR-3.6) |
| 10 | MINOR | WF-10 cổng *[shared, not allowed]* là suy ra từ QĐ-54d | **Giữ, đánh dấu suy ra**, câu hỏi Owner O-6 (ghi ở `WF-10` mục 12) |
| 11 | MINOR | Người duyệt nhu cầu khi trưởng phòng gửi thay người mới (WF-04, UF-21) | **Giữ**, câu hỏi Owner O-3 (ứng viên `QĐ-61`) |
| 12 | MINOR | WF-01 chỉ định trưởng phòng trước khi có hồ sơ nhân viên | **Đã sửa:** bước *Assign Department Heads and IT Owners* chuyển ra sau import nhân sự |
| 13 | MINOR | Móc/khấc ngắn ở cổng ra của cạnh | **Đã sửa trong bộ sinh** (gộp khấc ≤ 20 px; cổng thanh fork/join trượt theo thanh) |
| 14 | MINOR | Chú giải UF nói *ref* là điểm dừng, trong khi nhiều UF đi tiếp | **Đã sửa:** *gọi user flow khác; có cạnh ra thì quay lại đi tiếp* (README, mục 5 của mỗi UF, index UF) |
| 15 | MINOR | Khoảng trống nhỏ | `UF-08` thêm giới hạn thử lại (*[transient, retries left]* / *[permanent or out of retries]*) — **đã sửa**. `WF-16` thiếu nhánh *chưa xác minh nguyên nhân* — **ghi mở** ở `WF-16` mục 12. `WF-13` các điểm cuối *không kết luận* có ghi trạng thái hiển thị trong `vi` — giữ. MF-4 nhánh quyết định không bị ngắt khi qua hạn chót (nhánh hạn chạy song song) — giữ, theo `MF-4` mục 12 |

Reviewer xác nhận đúng: đúng 5 main flow theo `QĐ-49d`; Finance không nằm trên đường duyệt; `QĐ-52c`, `QĐ-53c`, `QĐ-54`, `QĐ-55b`, `QĐ-56`, `QĐ-57`, `QĐ-59a`, `QĐ-60a`, `QĐ-49e` thể hiện đúng; Context không thêm lại tác nhân đã bỏ; chữ trên hình tiếng Anh; 50 tệp `.md` tiếng Việt đủ 12 mục; không chỗ nào ghi GVHD/hội đồng đã duyệt; `.drawio` sửa được (kiểm MF-5, WF-17, Context).

## 5. Câu hỏi mở cho Owner

| # | Câu hỏi | Ở đâu |
| --- | --- | --- |
| O-1 | Giữ bộ 5 main flow `QĐ-49d` (MF-2, MF-7, MF-5, MF-8, MF-4) hay đổi MF-7 lấy MF-3 (bằng chứng sử dụng — PP-1)? | [main-flow-selection.md](main-workflows-activity-diagram/main-flow-selection.md) |
| O-2 | Dùng mã nhóm hỗ trợ `SF-1` → `SF-4` cho phần không phải main flow? | như trên |
| O-3 | Trưởng phòng gửi yêu cầu thay người mới/nhóm: bước nhu cầu do ai duyệt (trưởng phòng theo BRD 4.6 dòng (a), hay Người duyệt chi theo SoD-4)? | `WF-04`, `UF-21` mục 12 |
| O-4 | Nghỉ đột ngột: có giữ quyền chờ bàn giao dữ liệu một thời gian ngắn, hay thu hồi ngay và chỉ ghi cờ như hình đang vẽ? | `WF-07`, `UF-09` mục 12 |
| O-5 | Ai sửa thuê bao khi sai lệch do *mua đã duyệt chưa được ghi*: Finance (như hình) hay IT Admin? | `WF-16`, `MF-8`, `UF-14` |
| O-6 | Điều khoản không cho dùng chung tài khoản: từ chối yêu cầu, hay buộc chuyển sang cấp cá nhân? | `WF-10` mục 12 |
| O-7 | Các mục `open` khác trong từng `.md` (ví dụ: hoàn trả tự nguyện có cần trưởng phòng xác nhận — `WF-11`; nhãn *bằng chứng không đủ* có hiện cho trưởng phòng — `UF-05`; phòng nhận không có trưởng phòng — `UF-18`; gia hạn còn chờ khi tới hạn — `WF-08`) | từng tệp `.md`, mục 12 |

## 6. Lượt chỉnh bố cục FDD — 09/10/2026

> Mục này **thêm sau**; các mục 1–5 ở trên là kiểm của lượt vẽ lại và **không** áp cho hình FDD mới dưới đây. Chỉ đổi hình thức theo ảnh mẫu Owner gửi; không đổi nghiệp vụ, không đụng các nhóm sơ đồ khác. Vẫn chưa có xác nhận của GVHD/hội đồng.

**Trạng thái trước khi sửa.** `function-tree.json` (15 nhóm, 84 chức năng) là nguồn canonical, `build_fdd.py` sinh `.drawio`, PNG và `functional-decomposition-guide.md`. Bản PNG 01:03 đã có dây Hệ thống → Feature thẳng, nhưng mỗi chức năng là một hộp có dây gấp riêng (84 dây). Tệp `.drawio` lúc 01:30 đã được lưu lại bằng draw.io Desktop với 15 hộp Feature kéo vào gần tâm, còn danh sách và điểm gấp giữ chỗ cũ → dây Feature → danh sách thành bậc thang dài; `build_fdd.py --check` báo `.drawio differs`. Bản lưu này, ảnh render của nó và tệp `.bkp` của draw.io được cất ở `Reviews/diagram-redraw-2026-10-08/fdd-layout-2026-10-09-before/` (gitignored) rồi bị bản sinh mới ghi đè.

**Đã sửa trong `build_fdd.py`** (chỉ FDD, bộ sinh chung `flowkit` không đổi):

| Tầng dây | Trước | Sau |
| --- | --- | --- |
| Hệ thống → Feature | đoạn thẳng (`edgeStyle=none`), Feature đặt theo tia và đẩy ra xa khi va chạm | vẫn đoạn thẳng biên–biên, không điểm gấp, không mũi tên; Feature xếp vòng gọn theo chiều kim đồng hồ (1 trên; 2–6 cột phải; 7–9 hàng dưới; 10–14 cột trái; 15 trên trái), hai cột uốn theo elip để không tia nào đi qua danh sách |
| Feature → danh sách | 84 hộp chức năng, 84 dây gấp vuông riêng | 84 dòng chữ không khung, **một dấu ngoặc vuông** mỗi Feature ở phía hướng về Feature, **một dây** Feature → giữa ngoặc (ngang khi danh sách bên cạnh, gấp vuông khi danh sách trên/dưới) |

Bề rộng danh sách tính theo bảng độ rộng ký tự Helvetica (thay ước lượng 6,7 px/ký tự) để ngoặc sát chữ. Bộ kiểm hình học trong `build_fdd.py` được **siết thêm**, không nới: không hộp/chữ/ngoặc nào chồng nhau; tia chỉ chạm hộp giữa và Feature của nó; dây ngoặc phải vuông góc, chỉ chạm Feature và ngoặc của nó, không cắt tia nào; các nhóm giữ khoảng cách. Canvas 1904×1432 (trước 2969×1698), PNG tỷ lệ 2, nhúng nguồn.

**Kiểm ngữ nghĩa** (so nhãn của bản sinh 01:03 với `.drawio` mới, script tạm): 100/100 nhãn đỉnh giống hệt (hộp giữa + 15 Feature + 84 chức năng), mã `F{n}` / `F{n}.{m}` giữ nguyên, nhãn N.M đúng số; mỗi chức năng nằm trong ngoặc của đúng Feature của nó; số chức năng theo nhóm 5·6·4·8·7·6·7·3·8·5·7·4·6·6·2; không ID trùng, không cạnh treo, không cạnh có mũi tên; 15 tia `SYS → F{n}` không điểm gấp; 15 dây `F{n} → F{n}-list`. Cạnh 99 → 30 (bỏ 84 dây riêng, thêm 15 dây ngoặc). `function-tree.json` không sửa.

**Bộ kiểm tự động** (chạy lại 09/10/2026, sau lần sinh cuối):

```text
python functional-decomposition-diagram/build_fdd.py --check  → ok FDD features=15 functions=84 size=1904x1432
python tools/flowkit.py check "specs/*.json"                  → 50/50 ok
python context-diagram/tools/build_context_diagram.py --check → ok CTX entities=8 flows=41
python tools/build_index.py --check                           → ok (3 index)
python tools/check_links.py <Scope> <BRD>                     → ok links checked=581 broken=0
```

**Ảnh đã mở và xem:** ảnh mẫu Owner gửi; PNG 01:03; render của bản `.drawio` lưu 01:30; PNG mới toàn cảnh (lần 1 còn ngoặc bên trái cách xa chữ → sửa độ rộng; lần 2 đạt); bốn vùng phóng to độ phân giải đầy đủ — cột trái (10–14), cặp trên (15, 1), hàng dưới (7–9), cột phải (2–4). Không thấy chữ bị cắt, dây xuyên hộp/chữ, danh sách đè nhau hay nối nhầm nhóm.

**Giới hạn còn lại:** dây danh sách bên cạnh là đường ngang thẳng (mẫu cho phép gấp vuông, không bắt buộc); nếu kéo một Feature trong draw.io, dây ngoặc sẽ tự định tuyến lại nhưng danh sách không đi theo — sửa bố cục nên làm trong `build_fdd.py` rồi sinh lại, vì lần sinh sau ghi đè chỉnh tay.

## 7. Lượt chốt sau review tiếp nối — 09–10/10/2026

> Thêm sau; mục 1–6 giữ nguyên làm lịch sử. Lượt này thực hiện `PROMPT_CLAUDE_CHOT_DIAGRAMS_SAU_REVIEW_2026-10-09.md` (gồm mục 2A bổ sung) trên working tree hiện tại; đối chiếu review tiếp nối [diagram-redraw-followup-review-2026-10-09.md](../Reviews/diagram-redraw-followup-review-2026-10-09.md) (R1 coi là lịch sử, R2–R6 xử lý dưới đây). Quyết định mới là của **Owner** (`QĐ-61`, `QĐ-62`, hỏi qua câu hỏi có phương án ngày 09/10/2026), **chưa** phải xác nhận của GVHD/hội đồng. Không commit, không sửa BE/FE/DB/.env.

### 7.1. Cách làm và giới hạn của chính lượt này

- Nghiên cứu song song bằng subagent: phân loại 190 ghi chú mở thô, findings BRD A1–A5/C/D, nguồn Mobile/AI, đồng bộ FDD, bàn giao ERD/US. Ba worker sửa spec và worker Report 1 **dừng giữa chừng vì giới hạn phiên (HTTP 429)**; phần còn lại do coordinator tự làm tuần tự bằng script, giữ phần worker đã ghi đúng (WF-09a, bản nháp MF-4/WF-07, DOCX Report 1). Kết quả của worker đã được coordinator đọc lại và xem hình.
- Câu chỉ đạo Mobile/AI lấy nguyên văn từ prompt mục 2A/B; các chi tiết còn lại là câu trả lời của Owner trong phiên.

### 7.2. Quyết định Owner đã ghi

| Mã | Nội dung | Thay cho / đóng |
| --- | --- | --- |
| `QĐ-61a`–`g` | Mobile **native**; MVP bốn tác vụ (yêu cầu của tôi · trưởng phòng duyệt nhu cầu · Người duyệt chi duyệt chi · hộp thông báo); không push, không offline; mobile không thêm vai/flow, không theo dõi điện thoại; AI cam kết = đúng hai tính năng `QĐ-49e`; dữ liệu thật chưa gửi model (`OQ-26`); lệch bản đăng ký L-5, L-6 | BRD 3.2 *không phát triển ứng dụng di động*; mở rộng `QĐ-49e` |
| `QĐ-62a`–`q` | Các điểm nghiệp vụ của bộ sơ đồ (19 mục `DOI` loại OWNER): tạo thay, sửa thuê bao, phòng thiếu trưởng phòng, bối cảnh WF-17, nghỉ đột ngột, bàn giao bản nhẹ, thành viên tài khoản dùng chung, gia hạn quyền còn chờ, tác vụ lỗi, lời mời treo, gia hạn muộn, mốc theo ngày kết thúc, ngân sách/kỳ, ngừng app, phần mềm nội bộ ngoài MVP, thông báo/đổi chức vụ, phiên bản BM-06 | `O-3` → `O-7`; BRD 5.10 dòng `MF-8` (người sửa thuê bao) |
| `QĐ-61h`, `QĐ-62s`, `QĐ-62t` | *(10/10/2026, sau review độc lập — 7.9)* Trên mobile Người duyệt chi duyệt cả bước nhu cầu của yêu cầu do trưởng phòng tự gửi; quyết định gia hạn không tạo khoản cam kết (chi phí ở dự báo L1); T−7 bỏ qua khi cả quyết định lẫn kết quả thực hiện đã ghi | Phát hiện F20, F21 của reviewer; `DOI-19`, `DOI-89` |
| `QĐ-62r` | Mã dự án `FA26SE174`, mã nhóm `GFA26SE125`, `SU26SE166` = bản đăng ký cũ; FDD bỏ mã khỏi bảy nhãn hiển thị | — |

Câu `O-3` được hỏi lại bằng ví dụ sau khi Owner nhắc *"người duyệt chi chỉ có 1 người"*; Owner chọn *trưởng phòng tạo thay = đã xác nhận nhu cầu*. `O-1`/`O-2` đóng theo `QĐ-49d`, không hỏi lại — [main-flow-selection.md](main-workflows-activity-diagram/main-flow-selection.md) mục 7.

### 7.3. Bảng A1–A5, B, C, D

| Mục | Kết luận | Đã sửa | Căn cứ | Còn chờ |
| --- | --- | --- | --- | --- |
| A1 | Xác nhận — *Budget Approver* và *Spending Approver* là một vai | BRD §12 → *Spending Approver* (`SPENDING_APPROVER`); sổ `QĐ-22` chú thích tên chuẩn; ghi chú bản nháp Report 1 | Mã ERD/Use Case, Review 1 | Bản sao lưu, evidence giữ nguyên |
| A2 | Xác nhận 3 tham chiếu cũ; *mục 6.7.1* đúng | ADR-13, `OQ-13`, `OQ-14` (BRD) và hai chỗ ở Scope → link tới heading `6.3.1` của tệp backlog; anchor kiểm bằng checker mới | `QĐ-59a` | User Stories còn 6 chỗ *BRD 6.3.1* — bàn giao |
| A3 | Báo cáo đầu vào **sai một phần**: drawio/PNG chỉ đổi F15 bỏ *(Optional)*; bảy nhãn bỏ mã chỉ có ở chữ §6.1 DOCX | FDD v3.1 (bố cục tay đưa vào `build_fdd.py`), v3.2 (bảy nhãn theo `QĐ-62r`, mã giữ ở cột nguồn); hình 1.6.1 trong Report 1 thay bằng v3.2 | Owner chỉnh tay 09/10 10:33; `QĐ-62r` | — |
| A4 | Xác nhận | Phần mềm nội bộ → **ngoài MVP** (`QĐ-62o`, không cần mã câu hỏi); AI → `OQ-26` mới ở BRD 10.1 (chặn gọi model với dữ liệu thật; không chặn Requirements/sơ đồ/ERD); câu về mục 10.3 viết lại | `QĐ-49b`, `QĐ-61f` | `OQ-26` chờ Owner trước khi hiện thực AI |
| A5a | *15–40* là giả định thiết kế, chỉ SaaS | BRD 3.4 ghi rõ | Reviews/report1 R04 | Report 1 LI-2 (sửa tay) |
| A5b | Quy tắc đã chốt: UTF-8 có/không BOM, UTF-16 phải có BOM | BRD `FR-6.3` | `OQ-MF6-02` (`QĐ-32`), đặc tả MF3/MF6 9.4 | Report 1 LI-12 (sửa tay) |
| B | Mobile và AI trong phạm vi (Owner) | `QĐ-61`; BRD v3.30 (1, 3.1, 3.2, 4.1, 6.1, 6.4, 9, 10.1, 12, C.0, `FR-3.11`); Scope v1.23; báo cáo lệch L-5/L-6; Context chú thích (không thêm tác nhân); UF-01/04/15 ghi kênh mobile; Use Case spec gắn STALE | Prompt 2A/B; câu hỏi có phương án | Thiết kế kỹ thuật mobile, User Stories, kế hoạch đánh giá AI — [bàn giao](handoff-erd-us-2026-10-09.md) |
| C | Zylo 70% (2025, *account for*, IT 26,1%) và 81% (2026, *control*, IT 15%) là hai kỳ, hai định nghĩa | Scope: nguồn là thông cáo, ghi định nghĩa, *expense-based*; Report 1 §4 sửa câu 70%; BRD §12 ngoại lệ ngôn ngữ cho tài liệu nộp trường | Thông cáo Zylo 16/01/2025 và 29/01/2026; SEP490 Student Guide (Fall 2023) | Báo cáo đầy đủ Zylo 2026 chưa đọc (cần biểu mẫu tải) |
| D | Mã mới chỉ dựa trên xác nhận Owner (24/09, 09/10) | BRD §1, §11; Scope; báo cáo lệch (dòng *Nhóm: SU26SE166*) | `QĐ-62r` | Chưa thấy văn bản trường chứa mã mới |

### 7.4. Các gap R2–R6 đã đóng

- **R2 — WF-16:** thêm `Cause Verified? [not yet]` → hồ sơ còn mở (WF-16 v3.2, MF-8 v2.1), khớp UF-14.
- **R2 — MF-4, WF-15, UF-20:** nhánh hạn chót có bốn kết cục (không gì thêm · cờ *thực hiện trễ* · sự cố KPI-4 · đánh dấu hết hạn trừ khi gia hạn trước ngày kết thúc); quyết định muộn không bị hủy (`d_late → s_next`); kiểm kết quả nhà cung cấp (`d_vout`); tiết kiệm chỉ khi chi phí giảm; mốc theo ngày kết thúc (`QĐ-62l`). Năm walkthrough ghi ở `doc.alternates/unhappy` của MF-4 và WF-15: (1) quyết và thực hiện trước hạn → `ff_ok`; (2) chưa quyết khi qua hạn → `d_auto` (sự cố KPI-4 hoặc hết hạn); (3) quyết trước hạn, IT thực hiện sau → `s_late`; (4) quyết sau hạn → `d_late [yes] → s_next`; (5) nhà cung cấp từ chối hoặc chưa xác nhận → `d_vout → a_act`.
- **R2 — WF-08:** đường *extension approved first*; quy tắc chờ quyết định theo `QĐ-62h`.
- **R3:** 190 ghi chú thô cùng `O-1` → `O-7` và R2–R6 gom thành 111 mục `DOI`; mọi ghi chú hiện có nhãn loại — [open-items.md](open-items.md), sinh tự động.
- **R4:** ghi chú lỗi thời ở WF-07, MF-4, UF-14, WF-02, UF-11 và các tệp khác đã sửa; `rules/domain-guardrails.md` theo mô hình phòng ban `QĐ-52`, `INV-01` → `INV-20`.
- **R5:** truy vết DIRECT/RELATED/GAP/N/A theo mã `rules` của node, kèm kiểm ngược FR → chức năng và node chưa dẫn nguồn — [index.md](index.md) mục 6 (83 DIRECT · 0 GAP · 1 N/A). Hai tính năng AI tách mã `QĐ-49e(1)`/`(2)`.
- **R6:** tệp autosave `.$saas-sentry-functional-decomposition.drawio.bkp` (09/10 10:33, git đang theo dõi) **giữ nguyên** — nội dung đã có trong bản sao lưu `Reviews/diagram-redraw-2026-10-08/fdd-labels-2026-10-09-before/`; xóa khi Owner đồng ý.

Ghi chú bị **gỡ** vì hình đã vẽ đúng hoặc trùng: WF-16 *chưa vẽ nhánh chưa xác minh*; WF-07 *không có nhánh bàn giao cho nghỉ đột ngột*; UF-14 *WF-16 không vẽ nhánh này*; WF-02 *dừng ở bước đăng ký*; UF-11 *đổi tham chiếu UF-13*; UF-04 *UF-15 cần nhận bước nhu cầu*; UF-05 *lý do bắt buộc* (FR-3.10); WF-13 *G2 không báo IT*, *dưới 30 ngày*; WF-08 *mốc T-7 áp chung* (chuyển vào `t_rem`); WF-09a và UF-08 các mục đã thành nhánh. Số ghi chú: 192 (HEAD) → 173 có nhãn.

### 7.5. Sơ đồ đã đổi

Context: chỉ index, hình không đổi. FDD v3.1 → v3.2. 50/50 spec đổi phiên bản hoặc nội dung mô tả. Đổi cấu trúc (node/cạnh): MF-2, MF-4, MF-8, WF-02, WF-05, WF-07, WF-08, WF-09, WF-09a, WF-12, WF-15, WF-16, WF-17, WF-20, UF-06, UF-08, UF-14, UF-18 (tham chiếu UF-01), UF-20. Còn lại đổi mô tả, ghi chú, mã `rules`. `catalog.json` 1.1. Bộ sinh và checker: `tools/build_index.py` (truy vết mới, `open-items.md`), `tools/check_links.py` (anchor, link `<…>`, `--all-docs`), `build_fdd.py` (bố cục tay, kiểm hình học), chuỗi căn cứ BRD v3.30/`QĐ-62` trong ba bộ sinh.

### 7.6. Kiểm tự động (lần chạy trước review; số liệu cuối ở 7.9)

```text
python tools/flowkit.py check "specs/*.json"                  → 50/50 ok (cảnh báo bố cục: UF-08, WF-01, WF-07, WF-09, WF-09a, WF-15, WF-16)
python context-diagram/tools/build_context_diagram.py --check → ok CTX entities=8 flows=41
python functional-decomposition-diagram/build_fdd.py --check  → ok FDD features=15 functions=84 size=1902x1432
python tools/build_index.py --check                           → ok index.md · workflows · user-flows · open-items.md
python tools/check_links.py <Scope> <BRD> <Decisions> <báo cáo lệch> <domain-guardrails>
    → 651 link, 12 anchor; 7 gãy — đều là link lịch sử tới tài liệu BE đã gỡ ở commit BE 6396bbf (đã chú thích ở đầu sổ quyết định)
python tools/check_links.py --all-docs
    → 2204 link, 1038 anchor, 90 gãy: ERD (giai đoạn sau), CI-CD, Use Case cũ, Review 1 và Research-AI lịch sử, BE đã gỡ — không có link gãy mới do lượt này
```

Hash SHA-256 (16 ký tự đầu) lúc ghi: FDD PNG `1d91f0e2158def7f` · `function-tree.json` `83a06601752774a3` · Context drawio `95c33dd49bb15ac3` · tổng `specs/*.json` `d49dcb0a638aace1` · BRD `09218941d06d9e44` · Report 1 DOCX `0cd120eb31093b1b`. Tệp đổi sau thời điểm này phải chạy lại lệnh trên.

**Ảnh đã mở và xem trong lượt:** WF-16 (3 lần), MF-8 (2 vùng), WF-08, MF-4, WF-15, UF-20 (2 nửa), WF-17 vùng dưới, WF-02 vùng ngừng dùng, WF-20 vùng dưới, WF-07 vùng giữ có hạn, WF-05 vùng điều chuyển, WF-12 vùng dưới, MF-2, WF-09 (toàn hình và phần trên), UF-08 (3 lần), WF-09a; FDD do agent xem (toàn hình và 4 vùng); trang 6 và 9 của Report 1 bản render Word. Spec chỉ đổi mô tả/ghi chú (bố cục không đổi) **không** mở lại từng ảnh. WF-09a còn 13 giao cắt (có cầu nhảy, đọc được) — giới hạn bố cục, chưa tối ưu.

### 7.7. Việc còn mở và nơi bàn giao

| Việc | Ai / giai đoạn | Nơi ghi |
| --- | --- | --- |
| `OQ-26` điều kiện dữ liệu cho AI | Owner, trước khi hiện thực/đánh giá AI | BRD 10.1 |
| Báo GVHD điểm lệch L-1 → L-6, ghi biên bản | Owner | [báo cáo lệch](../Decisions/bao-cao-lech-ban-dang-ky-2026-10-08.md) |
| ERD/User Stories theo `QĐ-52` → `QĐ-62` (106 mục `HO-` sau 10/10/2026, gồm `HO-136`), thiết kế kỹ thuật mobile, kế hoạch đánh giá AI | Giai đoạn ERD + US (`QĐ-59e`) | [handoff-erd-us-2026-10-09.md](handoff-erd-us-2026-10-09.md) |
| Report 1 §6 sửa tay (10 điểm) — trường không cho dùng AI ở §6 | Nhóm | `Reports/report-1/section-6-project-scope-and-limitations.md`, cuối tệp |
| Bản đăng ký `SU26SE166_…_vi.md` có thay đổi chưa commit của Owner, kèm DOCX mới chưa theo dõi — đang ghi *mobile ngoài MVP*, trái `QĐ-61` | Owner quyết lưu thành bản nháp mới hay khôi phục | Không sửa trong lượt này |
| User flow riêng cho màn hình mobile; màn hình trưởng phòng xác nhận bàn giao/bối cảnh (`DOI-41`) | Giai đoạn UI (`QĐ-08`) | [open-items.md](open-items.md) |
| Các giới hạn và tham số kỹ thuật khác (T−7 đã chốt ở `QĐ-62t`, xem 7.9) | Công bố / thiết kế kỹ thuật | [open-items.md](open-items.md) |

### 7.8. Đọc thế nào

1. [open-items.md](open-items.md) — mọi điểm mở theo loại; mục `ĐÃ CHỐT` dẫn mã `QĐ-62x`.
2. Sổ quyết định `QĐ-61`, `QĐ-62` (cuối tệp) và BRD v3.30 (bảng lịch sử phiên bản ở đầu).
3. Các hình đổi cấu trúc ở 7.5 — nhất là MF-4/WF-15 (gia hạn) và WF-07 (nghỉ đột ngột).
4. [index.md](index.md) mục 6 — truy vết; [bàn giao ERD/US](handoff-erd-us-2026-10-09.md).

**Trạng thái:** bộ sơ đồ đã chốt các nhánh nghiệp vụ còn thiếu theo nguồn và `QĐ-61`/`QĐ-62`; checker sơ đồ PASS. Có thể dùng làm đầu vào giai đoạn ERD/User Stories cho phạm vi web hiện hành; Mobile và AI mới ở mức nghiệp vụ (chưa có thiết kế kỹ thuật, `OQ-26` còn mở). Chưa có xác nhận của GVHD/hội đồng. Kết quả reviewer độc lập: mục 7.9.

### 7.9. Review độc lập và xử lý — 10/10/2026

Reviewer độc lập (subagent không tham gia sửa) đọc lại BRD v3.30, `QĐ-61`/`QĐ-62`, 50 spec, các hình và bộ sinh; báo cáo ở `Reviews/diagram-closure-independent-review-2026-10-10.md` (thư mục `Reviews/` không theo dõi bằng git). Kết luận của reviewer: **không có blocker**, 5 MAJOR, 21 MINOR. Reviewer đã tự kiểm và xác nhận đúng: năm walkthrough gia hạn, chặn tự duyệt, `d_cost`, WF-16, WF-08, WF-07; không có chỗ nào tự nhận GVHD đã duyệt.

| Mã | Mức | Xử lý | Ở đâu |
| --- | --- | --- | --- |
| F1 | MAJOR | Sửa: *IT Admin cập nhật thuê bao theo căn cứ; Finance đính chứng từ* (`QĐ-62b`) | WF-16 `d_gap→a_upd`; MF-8 `d_cause→a_updsub` và `doc.alternates/unhappy`; UF-14 `d_gap→y_upd` |
| F2 | MAJOR | Sửa theo `QĐ-62c`: phòng chưa có trưởng phòng ⟹ yêu cầu bối cảnh **treo, không giao ai**, chuyển cho trưởng phòng mới; quyết định không chờ (`QĐ-62d`) — khớp BRD `FR-3.6` | BRD `FR-6.9`; WF-17 `d_dept`, `s_ask`, ghi chú `DOI-97/98`; UF-12 `y_ctx`; handoff `HO-49` |
| F3 | MAJOR | Bỏ nhánh `[invite pending] → e_acc` ở WF-09 — WF-09a giữ vòng chờ lời mời bên trong, chỉ trả *thành công* hoặc *đóng thất bại* | WF-09 `d_res` |
| F4 | MAJOR | `s_rec`: **người kích hoạt thu hồi** xác nhận bàn giao (Employee khi tự trả, trưởng phòng ở nhánh *không cần*); ghi chú `DOI-46`; WF-09a `d_dl` liệt kê đủ bên gọi | WF-11 `s_rec`; WF-09a `d_dl` |
| F5 | MAJOR | `a_fail`/`end_fail` viết lại: tác vụ đã bị IT **đóng thất bại** (`QĐ-62i`), quyền còn ⟹ vẫn hiện G2, muốn thu lại thì mở tác vụ mới; WF-07 `c_reclaim` ghi cùng quy tắc | WF-11; WF-07 |
| F6 | MINOR | BRD `FR-3.18` thêm *đổi chức vụ trong cùng phòng không mở rà soát* (`QĐ-62p`) | BRD |
| F7 | MINOR | Lane `NEED` → *Need Approver (Head, Spending Approver or Fallback)* | MF-2, WF-09 |
| F8 | MINOR | Yêu cầu theo nhóm xét **theo từng người thụ hưởng** — ghi ở `d_beh` và BRD `FR-3.2` | MF-2, WF-09, BRD |
| F9 | MINOR | `a_act`: theo dõi đóng bằng kết quả đã xác nhận; xác nhận đúng sau đó thì ghi kết quả, kỳ mới, tiết kiệm nếu giảm | MF-4, WF-15, UF-20 |
| F10 | MINOR | Thu hồi chạy tại **thời điểm thực hiện** đã xác định (giữa kỳ nếu gói cho phép, nếu không kỳ kế) | MF-4 `c_all`, `c_excess`; WF-15 `c_rec` |
| F11 | MINOR | Nhãn kết thúc → *Marked to Expire Unless Renewed* | UF-20 `t_exp` |
| F12 | MINOR | Nhãn *… for This Tool?*; `end_ok` đổi thành flow final để nhánh giữ có hạn của từng công cụ tự kết thúc; `doc.reading` ghi rõ | WF-07 |
| F13 | MINOR | `d_dl [no]` thêm ca thu hồi **khi nghỉ việc** (bàn giao xử lý ở WF-07) | WF-09a |
| F14 | MINOR | `s_rem` thêm cảnh báo Super Admin khi quá SLA (`FR-3.8`, `FR-5.14`) | WF-15 |
| F15 | MINOR | 33 `doc.status` *BRD v3.29* → *BRD v3.30* (thêm *đồng bộ QĐ-61/QĐ-62* nếu chưa có mã đó) | 33 spec |
| F16 | MINOR | `QĐ-62` dẫn tới `open-items.md` (danh sách sinh tự động), §7 chỉ là kiểm chứng | Sổ quyết định |
| F17 | MINOR | `OPEN_RE` nhận mã có ngoặc (`FR-4.21(1)`, `FR-8.10(d)`); ghi chú UF-20 #2 tách làm hai | `tools/build_index.py`; UF-20 |
| F18 | MINOR | `DOI-103` ghi *suy ra* từ `FR-5.8a`, `INV-18`; bỏ `QĐ-62m` làm căn cứ của quy tắc một ngân sách | WF-20 |
| F19 | MINOR | `DOI-42` căn cứ → `FR-3.1`, `QĐ-52a`, `INV-19`, `INV-20` (bỏ `FR-2.12`) | WF-05 `d_head` |
| F20 | Câu hỏi Owner | Owner chọn: gia hạn **không** tạo khoản cam kết (`QĐ-62s`); T−7 **bỏ qua** khi đã quyết và đã thực hiện (`QĐ-62t`) — WF-15 thêm `d_t7 → m_t7`; ghi chú đổi sang `ĐÃ CHỐT` | Sổ quyết định; BRD `FR-1.4`, `FR-5.8`; MF-4, WF-15, UF-20; handoff `HO-46` |
| F21 | Câu hỏi Owner | Owner chọn: trên mobile Người duyệt chi duyệt **cả bước nhu cầu** của yêu cầu do trưởng phòng tự gửi (`QĐ-61h`) | Sổ quyết định; BRD 3.1; UF-15 (`scope`, ghi chú), UF-04; handoff `HO-84` |
| F22 | MINOR | Chạy lại, số liệu ở dưới | 7.9 |
| F23 | Hình | Lane Spending Approver thêm một slot; chuỗi `d_sav` dịch vào trong lane — cạnh `[renew]` và `d_sav [no]` không còn chạy sát đường làn | WF-15 |
| F24 | Hình | Lane SYS thêm một slot — vòng `e_cfg → s_need` nằm giữa lane | WF-09 |
| F25 | Hình | **Chưa sửa** — WF-09a vẫn 13 giao cắt (có cầu nhảy, đọc được); giới hạn bố cục | — |
| F26 | Hình | **Chưa sửa** — nhãn UF-08 sát đường dọc (flowkit đã cảnh báo); đọc được | — |

**Kiểm tự động sau khi xử lý (10/10/2026):**

```text
python tools/flowkit.py check "specs/*.json"                  → 50/50 ok
python context-diagram/tools/build_context_diagram.py --check → ok CTX entities=8 flows=41
python functional-decomposition-diagram/build_fdd.py --check  → ok FDD features=15 functions=84 size=1902x1432
python tools/build_index.py --check                           → ok index.md · workflows · user-flows · open-items.md
                                                                (83 DIRECT · 0 GAP · 1 N/A; 174 ghi chú có nhãn, không còn ghi chú chưa gắn nhãn)
python tools/check_links.py                                   → 583 link, 0 gãy
python tools/check_links.py <Scope> <BRD> <Decisions> <báo cáo lệch> <domain-guardrails>
    → 667 link, 12 anchor; 7 gãy — đều là link lịch sử tới tài liệu BE đã gỡ ở commit BE 6396bbf
python tools/check_links.py --all-docs
    → 2220 link, 1038 anchor, 90 gãy — cùng nhóm lịch sử như 7.6, không có link gãy mới
```

Hash SHA-256 (16 ký tự đầu): FDD PNG `1d91f0e2158def7f` · `function-tree.json` `83a06601752774a3` · Context drawio `95c33dd49bb15ac3` · tổng `specs/*.json` (nối theo tên) `c33493ab955c844f` · BRD `7ed9b6053e973ffb` · sổ quyết định `9f08fd9967fa80e9` · Report 1 DOCX `0cd120eb31093b1b` (không đổi trong lượt này).

**Ảnh đã mở lại sau xử lý:** WF-15 (2 lần), WF-09 (2 lần), WF-07. Các spec còn lại của 7.9 chỉ đổi chữ (nhãn, mô tả, guard), bố cục không đổi — đã build lại PNG nhưng không mở từng ảnh.

**Trạng thái sau review:** mọi phát hiện MAJOR đã đóng; MINOR đóng trừ F25, F26 (hình, đọc được). Không còn câu hỏi Owner nào đang chờ trong phạm vi sơ đồ. Còn mở ngoài phạm vi: `OQ-26` (dữ liệu cho AI), báo GVHD điểm lệch L-1 → L-6, Report 1 §6 sửa tay. Chưa có xác nhận của GVHD/hội đồng.

### 7.10. Khép lượt review — 10/10/2026 (follow-up của 7.9)

> Thêm sau; 7.1–7.9 giữ nguyên làm lịch sử. Thực hiện `PROMPT_CLAUDE_KHEP_REVIEW_DIAGRAMS_2026-10-10.md` trên working tree hiện tại, theo báo cáo kiểm lại của Codex ([diagram-closure-followup-2026-10-10.md](../Reviews/diagram-closure-followup-2026-10-10.md)). Quyết định dưới đây là của **Owner**, chưa phải xác nhận của GVHD/hội đồng. Không commit, không stage, không sửa BE/FE/DB/.env.

#### 7.10.1. Cách làm và giới hạn

- Coordinator tự sửa nguồn chung (WF-11, UF-15, handoff, index, README công cụ, các spec text) và tự **mở ảnh** WF-11, UF-15, WF-08, UF-04, WF-09a, UF-08 cùng các vùng đổi nhãn của WF-16, UF-09.
- Subagent có phạm vi riêng, không hai agent ghi cùng tệp: rà ngữ nghĩa (đọc, model opus) · phân loại 7 mã FR (đọc, sonnet) · baseline link so với HEAD (đọc, sonnet) · bố cục WF-09a/UF-08 (ghi, sonnet; chỉ hai spec đó và bản xuất của chúng) · **reviewer độc lập** (đọc, opus; hai lượt: kiểm bản cuối, rồi kiểm lại các sửa R12). Báo cáo ở `Reviews/` (thư mục không theo dõi bằng git): `diagram-closure-semantic-recheck-…`, `diagram-fr-disposition-…`, `diagram-links-baseline-…`, `diagram-layout-wf09a-uf08-…`, `diagram-closure-final-review-…`.
- Skill đã nạp thật: `drawio`, `verification-before-completion`, `dispatching-parallel-agents`. **Không** nạp `documentation-and-adrs`, `source-driven-development`, `writing-plans`. MCP draw.io không dùng; xuất PNG bằng draw.io Desktop qua `flowkit.py`. Không gọi model AI nào của sản phẩm.
- Nhận định về nguồn: đầu lượt, `specs/WF-11.json` và `specs/UF-15.json` đã được sửa trước đó nhưng bản xuất chưa sinh lại (flowkit báo FAIL) — lượt này sinh lại và xem ảnh. Không có bản sao lưu trước-sửa của WF-09a/UF-08 (bản của worker bị phiên khác xóa) nên "chỉ đổi bố cục" được xác nhận qua đối chiếu mô tả với reviewer, không so byte.

#### 7.10.2. Findings

| Mã | Kết quả | Ghi chú |
| --- | --- | --- |
| R10-01 (F5) | **Đóng** | WF-11: `[closed as failed]` → *Record Return Failed; Access Remains* → end; WF-08 thêm nhánh `d_rres [success]/[closed as failed]`; mọi bên gọi WF-09a (MF-2 unhappy, MF-4, MF-5, MF-7, WF-05, WF-07, WF-13, WF-15, WF-16, WF-17, UF-09, UF-10, UF-12, UF-14, UF-18, UF-20) ghi quy tắc `QĐ-62i` |
| R10-02 | **Đóng** | UF-15 `y_ren`/`t_ren`/alternates trung tính; dẫn WF-15/UF-20; không thêm luồng, không đổi QĐ |
| R10-03 (F25/F26) | **Đóng** | WF-09a 13 → 4 giao cắt, UF-08 2 → 2; cảnh báo nhãn 3 → 0 và 1 → 0; giao cắt còn lại đều có cầu nhảy (topology nội tại). Sửa nằm ở `sides`/`slot`/`dx` trong spec |
| R10-04 | **Đóng** | Bảng ảnh 7.10.5; ảnh đã mở bởi coordinator và reviewer độc lập |
| R10-05 | **Đóng** | Handoff mục 0/10: bỏ lời "worker đang sửa", ghi rõ phần lịch sử; sửa tham chiếu sai `UF-08 t_fail_c` → `t_fail`; đếm lại bảng 1.2 từ các dòng `HO-` |
| R11-01 → R11-12, R11-15, R11-16 | **Đóng** | Reviewer độc lập kiểm lại nguyên văn: F1 còn sót ở `lanes_vi` (MF-8, WF-16) · MF-2 unhappy · MF-5/WF-08/WF-07 kết cục thu hồi thất bại · WF-05 `doc.pre` · UF-04 `d_own` đổi *Is the Beneficiary Me?* · UF-09 · UF-15 `s_queue` · UF-20/WF-15 chữ *hết hạn* và thời điểm thực hiện · WF-15 `excluded` · WF-08 guard · WF-07 ngoại lệ biểu diễn · MF-2 `d_need` |
| R11-13 | **Đóng bằng SESSION DECISION** | Owner chọn *IT Admin xác nhận bàn giao* cho các ca hết hạn, hủy/giảm thuê bao, không hợp thức hóa, thực thi lại. Ghi ở WF-09a `d_dl`/`s_ask`/`e_hc` và các bên gọi, nhãn **SESSION DECISION**; **chưa ghi sổ QĐ và BRD** — bàn giao `HO-136` |
| R11-14, R11-17 | **Đóng** | UF-08 `post`/`excluded`; mục 7.10 này |
| R12-01 → R12-13 | **Đóng hoặc chấp nhận** | R12-01 UF-09 · R12-02 WF-08 `[none pending]` + ca duyệt muộn trong `vi` · R12-03 ngoại lệ biểu diễn MF-5/UF-09 · R12-04 WF-16 `sides` · R12-05 WF-09a `s_ask` · R12-07 `HO-136` · R12-09 index MF · R12-10 UF-11/12/14 · R12-11 README công cụ mục 7 (ngoại lệ biểu diễn, không đổi ký hiệu). NIT chấp nhận: R12-06 (nhãn WF-09a), R12-13 (đoạn dây MF-2) |

**Còn mở / ghi nhận — không chặn việc đọc bộ sơ đồ:** `doc.reading` của sáu spec có luồng phụ chưa dẫn tới `tools/README.md` mục 7 (chỉ MF-5 và UF-09 dẫn); số 83 DIRECT/0 GAP/1 N/A là thống kê *có node dẫn mã đầu của cột yêu cầu*, **không** phải chứng nhận mọi requirement/AC đã đủ.

#### 7.10.3. Truy vết FR (index §6.1)

Bảy mã chưa có mã tại feature/node, đã phân loại bằng đọc nội dung ([báo cáo](../Reviews/diagram-fr-disposition-2026-10-10.md)): `FR-0.2` → `WF-09 s_act`, `FR-0.3` → `WF-19 a_pub`, `FR-6.1` → `WF-02 a_reg` (đã gắn mã vì nội dung khớp); `FR-6.10` hoãn/ngoài phạm vi sơ đồ; `FR-8.5` quy tắc chung (tách quyền); `FR-9.6` quy tắc trình bày xuyên màn hình (chờ UI Spec); `FR-11.1` quy tắc bao trùm (từng `BM-xx` đã có mã). Phân loại nằm ở `build_index.py` (`FR_DISPOSITION`), hiện ở [index.md](index.md) §6.1. Không thêm mã để ép 0 GAP; bộ sinh không bung khoảng mã nên danh sách vẫn nêu cả ba mã nằm trong khoảng ở FDD.

#### 7.10.4. Kiểm tự động — từng loại, không gộp

| Loại | Lệnh | Kết quả | Ghi chú |
| --- | --- | --- | --- |
| Source ↔ xuất | `flowkit.py check "specs/*.json"` | **PASS** 50/50 | 5 cảnh báo *fallback sides* có từ trước: WF-01 `d_log→end`, WF-07 `f_hold→t_cap`, WF-09 `d_br→m_sa`, WF-15 `f1→t7`, WF-16 `c_leg→m_res`; WF-09a và UF-08 không còn cảnh báo |
| Context | `build_context_diagram.py --check` | **PASS** | 8 tác nhân / 41 luồng |
| FDD | `build_fdd.py --check` | **PASS** | 15 feature / 84 chức năng |
| Index | `build_index.py --check` | **PASS** | 4 tệp; 83 DIRECT · 0 GAP · 1 N/A |
| Link — bộ sơ đồ | `check_links.py` | **PASS** | 591 link, 1 anchor, 0 gãy (584 trước khi thêm §7.10) |
| Link — phạm vi mở rộng (Scope, BRD, Decisions, báo cáo lệch, domain-guardrails) | `check_links.py <5 tệp>` | **FAIL (ngoại lệ lịch sử)** | 675 link, 12 anchor, 7 gãy (668 trước khi thêm §7.10) — cả 7 tới tài liệu BE đã gỡ ở commit BE `6396bbf`, đã chú thích ở đầu sổ quyết định |
| Link — toàn Docs | `check_links.py --all-docs` | **FAIL (ngoại lệ, không mới)** | 2228 link, 1038 anchor, 90 gãy (2221 trước khi thêm §7.10) |

**Đối chiếu baseline (HEAD `db15eb4`):** link gãy **mới** so với HEAD = **0** ở cả ba phạm vi (tập tệp nguồn/đích trùng 100%). Phân loại 90: 7 lịch sử có chú thích · 12 có đích đúng nhưng ở tài liệu cũ/phụ · 62 ngoài phạm vi bàn giao (49 nằm trong đầu vào hoặc README của ERD/US) · 9 false positive của checker (cú pháp `file.md:dòng`). Không sửa link nào vì không có link gãy hiện hành trong phạm vi bộ sơ đồ/BRD/Scope/QĐ. Chi tiết: [báo cáo baseline](../Reviews/diagram-links-baseline-2026-10-10.md). Cần biết: **User Stories v0.14 có 3 link, `LOGICAL-ERD-S0.md` 42 link, Conceptual ERD 1 link, `ERD/README.md` 3 link gãy** — là đầu vào bàn giao (handoff mục 10); và **11 link từ tệp đã theo dõi tới tệp chưa theo dõi** (`handoff-erd-us-2026-10-09.md`, `open-items.md`) — phải commit cùng nhau, nếu không sẽ gãy.

Hash SHA-256 (16 ký tự đầu) lúc khóa: BRD `7ed9b6053e973ffb` · sổ quyết định `9f08fd9967fa80e9` · `function-tree.json` `83a06601752774a3` · FDD PNG `1d91f0e2158def7f` · tổng `specs/*.json` (52 tệp, nối theo tên) `12513407b146284c` · handoff `93b766a3dab752b8` · `index.md` `52be22bf593aa590`. BRD, sổ quyết định và FDD **không đổi** trong lượt này.

#### 7.10.5. Bảng ảnh cuối

Nguồn = `specs/<ID>.json`. Hash 10 ký tự đầu. **Đã xem** ghi người kiểm; reviewer độc lập đã xem 21 ảnh (19 ảnh trong danh sách đổi + UF-09, MF-5 lấy mẫu). `flowkit check` xác nhận XML nhúng trong từng PNG khớp `.drawio`; điều đó **không** thay việc xem pixel.

| Sơ đồ | Phiên bản | Hash spec | Hash drawio | Hash PNG | Render | Đã xem · người kiểm |
| --- | --- | --- | --- | --- | --- | --- |
| `MF-2` | 3.3 | `79aa30661b` | `4c9fef6623` | `3e80005c12` | 10/10 16:14 | reviewer |
| `MF-4` | 3.3 | `5f56d12917` | `aac16d2269` | `1cf153a6cb` | 10/10 15:28 | reviewer |
| `MF-5` | 3.4 | `cd9e62ddd2` | `a97fbe9df5` | `44329a4e00` | 10/10 16:21 | mẫu · reviewer |
| `MF-7` | 2.2 | `59cf4607c4` | `95a313f9d3` | `5af9120a42` | 10/10 15:28 | chưa mở lại lượt này — không đổi nhãn/guard/lane/topology kể từ lần kiểm trước |
| `MF-8` | 2.2 | `45ee8ea34e` | `76696162bd` | `580a3c5c72` | 10/10 15:28 | reviewer |
| `UF-01` | 1.2 | `4c8f9e3795` | `6108f44284` | `71e51a9468` | 10/10 15:29 | chưa mở lại lượt này — không đổi nhãn/guard/lane/topology kể từ lần kiểm trước |
| `UF-02` | 1.1 | `029993a583` | `0135741ec5` | `d62992485d` | 10/10 10:42 | chưa mở lại lượt này — không đổi nhãn/guard/lane/topology kể từ lần kiểm trước |
| `UF-03` | 1.1 | `4ce792ed9f` | `40224aed95` | `ba006280ca` | 10/10 10:36 | chưa mở lại lượt này — không đổi nhãn/guard/lane/topology kể từ lần kiểm trước |
| `UF-04` | 1.4 | `5453af74a8` | `11b894c7ad` | `2ba3690496` | 10/10 16:21 | toàn hình · coordinator + reviewer |
| `UF-05` | 1.1 | `6d6bc3464f` | `ae1adf5312` | `3d19f2aa47` | 10/10 10:33 | chưa mở lại lượt này — không đổi nhãn/guard/lane/topology kể từ lần kiểm trước |
| `UF-06` | 1.1 | `7d9ac39919` | `737c295907` | `a4eea56009` | 10/10 10:34 | reviewer |
| `UF-07` | 1.1 | `96fcf4e46f` | `cba97dc270` | `0e2baa8ca2` | 10/10 10:36 | chưa mở lại lượt này — không đổi nhãn/guard/lane/topology kể từ lần kiểm trước |
| `UF-08` | 1.4 | `f564027278` | `ec9eeb6a29` | `c7223722c9` | 10/10 16:14 | toàn hình · coordinator + reviewer |
| `UF-09` | 1.4 | `a1520e91eb` | `286f7caa63` | `9eb573e682` | 10/10 16:21 | vùng cuối · coordinator + reviewer |
| `UF-10` | 1.2 | `263658e8ee` | `084dbc6f55` | `8f2de0461b` | 10/10 15:29 | chưa mở lại lượt này — không đổi nhãn/guard/lane/topology kể từ lần kiểm trước |
| `UF-11` | 1.2 | `5ec0185c5b` | `d8d8656180` | `0fa3e54715` | 10/10 16:14 | chưa mở lại lượt này — không đổi nhãn/guard/lane/topology kể từ lần kiểm trước |
| `UF-12` | 1.3 | `e4ad366ec1` | `049fc82b03` | `22f90608ad` | 10/10 16:14 | reviewer |
| `UF-13` | 1.1 | `bdfd75ae11` | `878342435b` | `85530b4f5a` | 10/10 10:47 | chưa mở lại lượt này — không đổi nhãn/guard/lane/topology kể từ lần kiểm trước |
| `UF-14` | 1.2 | `7e11c90874` | `913eb5d5bb` | `18098cc4d3` | 10/10 16:14 | reviewer |
| `UF-15` | 1.3 | `0de41dad31` | `cb74cf2124` | `fa3992f12d` | 10/10 15:29 | toàn hình · coordinator + reviewer |
| `UF-16` | 1.1 | `6f8a7a375a` | `5d3851990c` | `0dc9374a82` | 10/10 10:36 | chưa mở lại lượt này — không đổi nhãn/guard/lane/topology kể từ lần kiểm trước |
| `UF-17` | 1.1 | `ac1365b3d5` | `f4ba83e467` | `c6c08628ef` | 10/10 10:47 | chưa mở lại lượt này — không đổi nhãn/guard/lane/topology kể từ lần kiểm trước |
| `UF-18` | 1.2 | `f92f109a48` | `86c7d5ba95` | `1879250bdf` | 10/10 15:29 | reviewer |
| `UF-19` | 1.1 | `1d5b2dc352` | `56017353e6` | `71ff8aa818` | 10/10 10:47 | chưa mở lại lượt này — không đổi nhãn/guard/lane/topology kể từ lần kiểm trước |
| `UF-20` | 1.3 | `64c57701eb` | `1b35e6327a` | `fcb7bc1ff1` | 10/10 15:29 | reviewer |
| `UF-21` | 1.1 | `3ce99ae970` | `c4a2ac1a95` | `99d072731b` | 10/10 10:42 | chưa mở lại lượt này — không đổi nhãn/guard/lane/topology kể từ lần kiểm trước |
| `WF-01` | 3.1 | `d726107cb9` | `cae7ee4ee4` | `bacc920391` | 10/10 10:28 | chưa mở lại lượt này — không đổi nhãn/guard/lane/topology kể từ lần kiểm trước |
| `WF-02` | 3.1 | `3da25c99fb` | `7edea3b426` | `3082a4a10b` | 10/10 15:24 | chưa mở lại lượt này — không đổi nhãn/guard/lane/topology kể từ lần kiểm trước |
| `WF-03` | 3.1 | `5e19dcd6b4` | `70f92ce6b6` | `0f329a9040` | 10/10 10:28 | chưa mở lại lượt này — không đổi nhãn/guard/lane/topology kể từ lần kiểm trước |
| `WF-04` | 3.1 | `3f09fa22e3` | `c3e36a099a` | `871f1e10de` | 10/10 10:41 | chưa mở lại lượt này — không đổi nhãn/guard/lane/topology kể từ lần kiểm trước |
| `WF-05` | 3.2 | `f6817701d4` | `437365ee4e` | `2ae1a3c867` | 10/10 15:28 | reviewer |
| `WF-06` | 2.1 | `e66da1f016` | `2fe14b709b` | `45035c13b0` | 10/10 10:36 | chưa mở lại lượt này — không đổi nhãn/guard/lane/topology kể từ lần kiểm trước |
| `WF-07` | 3.2 | `b19f205212` | `d57f4d9015` | `52cada6b52` | 10/10 15:28 | reviewer + lượt 7.9 |
| `WF-08` | 2.4 | `88141750ec` | `f68fece947` | `adefa92ee3` | 10/10 16:14 | toàn hình + vùng giữa · coordinator + reviewer |
| `WF-09` | 3.1 | `b8f75c7260` | `73481ec179` | `1f4329c36c` | 10/10 15:24 | lượt 7.9 (không mở lại lượt này) |
| `WF-09a` | 3.4 | `4cb51ff87b` | `9a2a01ad86` | `56998c0fef` | 10/10 16:14 | toàn hình + vùng trên · coordinator + reviewer |
| `WF-10` | 3.1 | `e828d8601a` | `49b6c82a1c` | `4400a15732` | 10/10 10:42 | chưa mở lại lượt này — không đổi nhãn/guard/lane/topology kể từ lần kiểm trước |
| `WF-11` | 3.2 | `02fc1f3808` | `7dcc39a41d` | `fa9cc7f128` | 10/10 15:13 | toàn hình · coordinator + reviewer |
| `WF-12` | 3.1 | `ea1ff4dca1` | `11c2a4b982` | `5f2e94ecdb` | 10/10 10:34 | chưa mở lại lượt này — không đổi nhãn/guard/lane/topology kể từ lần kiểm trước |
| `WF-12a` | 3.1 | `d8dab4b4cf` | `dfe56ffd93` | `5c49fd5497` | 10/10 10:36 | chưa mở lại lượt này — không đổi nhãn/guard/lane/topology kể từ lần kiểm trước |
| `WF-13` | 3.2 | `cd76a7bbe0` | `5158089ac0` | `b39713dc36` | 10/10 15:29 | chưa mở lại lượt này — không đổi nhãn/guard/lane/topology kể từ lần kiểm trước |
| `WF-13a` | 3.1 | `d51b1b8c0b` | `31c1b99dc0` | `8dd1054e99` | 10/10 10:36 | chưa mở lại lượt này — không đổi nhãn/guard/lane/topology kể từ lần kiểm trước |
| `WF-14` | 3.1 | `2f99af9467` | `182d1cf76d` | `966c9dd90e` | 10/10 10:36 | chưa mở lại lượt này — không đổi nhãn/guard/lane/topology kể từ lần kiểm trước |
| `WF-15` | 3.3 | `efcaf1873f` | `6d84e77069` | `93c5c6c20a` | 10/10 15:29 | lượt 7.9 (không mở lại lượt này) |
| `WF-16` | 3.5 | `c8a5cf7595` | `d1a3988c09` | `dc361da998` | 10/10 16:14 | vùng IT sau sửa · coordinator + reviewer |
| `WF-17` | 3.3 | `8dabc7663d` | `b63c0bf640` | `72e87972ac` | 10/10 15:29 | reviewer |
| `WF-17a` | 1.2 | `2aa64e6ed1` | `a37c9d9973` | `f56f663785` | 10/10 10:47 | chưa mở lại lượt này — không đổi nhãn/guard/lane/topology kể từ lần kiểm trước |
| `WF-18` | 3.1 | `dd00657aa7` | `ae50df9c11` | `0e1936d214` | 10/10 10:36 | chưa mở lại lượt này — không đổi nhãn/guard/lane/topology kể từ lần kiểm trước |
| `WF-19` | 1.1 | `8183dd1d6d` | `db2fd767f2` | `fffa5d3cf8` | 10/10 15:24 | chưa mở lại lượt này — không đổi nhãn/guard/lane/topology kể từ lần kiểm trước |
| `WF-20` | 1.1 | `c912d8da49` | `996436c546` | `cfe9efa8fd` | 10/10 14:43 | reviewer |

#### 7.10.6. Phạm vi sẵn sàng

| Hạng mục | Trạng thái |
| --- | --- |
| Bộ sơ đồ (Context · FDD · 5 main flow · 24 workflow · 21 user flow) | **Sẵn sàng đọc/review**. Chưa có xác nhận GVHD/hội đồng; phần lớn ảnh không đổi nhãn/guard/lane/topology chưa được mở lại lượt này |
| ERD v4.2 / Logical S0 0.10 / User Stories v0.14 | **Chỉ sẵn sàng nhận bàn giao** — còn là bản cũ; 106 mục `HO-` ở [handoff](handoff-erd-us-2026-10-09.md), **không mục nào đã triển khai** |
| Mobile (bốn tác vụ, `QĐ-61`) | Mức nghiệp vụ; chưa có thiết kế kỹ thuật |
| AI (hai tính năng `QĐ-49e`) | **Chưa qua điều kiện dữ liệu/chất lượng**: `OQ-26` mở; chưa hiện thực, chưa kiểm chứng model; không gọi model với dữ liệu thật |
| Report 1 §6 | Quy định trường: **không dùng AI viết**; chỉ có checklist ở cuối `Reports/report-1/section-6-project-scope-and-limitations.md`; **chưa nhận bản nhóm sửa** nên không coi là đã đồng bộ |
| Bản đăng ký `SU26SE166_…_vi.md` / DOCX | Giữ nguyên thay đổi của Owner; Owner cần phân loại *lịch sử* hay *bản nháp hiện hành* trước khi xử lý câu *mobile ngoài MVP* |
| Điểm lệch L-1 → L-6 | Chờ Owner báo GVHD và ghi biên bản; không có bằng chứng phê duyệt |
| Autosave `.bkp` của FDD | **Giữ.** Không tiến trình draw.io nào đang mở; chỉ khác bản sao lưu ở viewport và nhãn cũ *(Optional)*, không chứa bố cục duy nhất; tệp đang được git theo dõi — Owner quyết xóa |

#### 7.10.7. Việc cần Owner/giai đoạn sau (ngắn)

1. Ghi **SESSION DECISION 10/10/2026** thành `QĐ` mới và cập nhật BRD `FR-2.12` (hiện chỉ nêu 4 ca của `QĐ-62f`); sau đó `HO-136` mới thành AC. **→ Đã xử lý ở 7.11:** `QĐ-63`, BRD v3.31; `HO-136` là `NEEDS_UPDATE`.
2. `OQ-26` — bảng lựa chọn ở handoff mục 6 (dữ liệu · nơi chạy model · che/ẩn danh · đánh giá chất lượng · điều khoản nhà cung cấp).
3. Báo GVHD L-1 → L-6; lưu phản hồi thật.
4. Sổ quyết định dòng ~323 (bảng *Chỗ phải sửa* của `QĐ-20`) ghi *FR-6.10 nay đã hiện thực*, trái BRD v3.30 và `QĐ-31a` — chỉ báo, không sửa (nguồn canonical). **→ Đã xử lý ở 7.11:** thêm đính chính, giữ dòng cũ làm lịch sử.
5. Link gãy trong đầu vào ERD/US (handoff mục 10): chọn chú thích lịch sử, trỏ bản còn lại hoặc tái xuất PNG/PDF.
6. Nhóm tự sửa Report 1 §6 theo checklist hiện có.

**Đọc ngắn cho Owner:** [open-items.md](open-items.md) (mục `SESSION DECISION` **đã đóng ở 7.11** — tìm `HO-136` trong mục `ĐÃ CHỐT`) → báo cáo kiểm lại cuối `Reviews/diagram-closure-final-review-2026-10-10.md` → [handoff](handoff-erd-us-2026-10-09.md) mục 0, 6, 10 → ảnh WF-11, WF-08, WF-09a, UF-04.

### 7.11. Đồng bộ nguồn và bàn giao ERD/US — 10/10/2026 (follow-up của 7.10)

> Thêm sau; 7.1–7.10 giữ nguyên làm lịch sử (hai việc ở 7.10.7 mục 1 và 4 được xử lý ở đây). Thực hiện `PROMPT_CLAUDE_DONG_BO_NGUON_VA_BAN_GIAO_ERD_US_2026-10-10.md`. Không stage/commit/push; không sửa BE/FE/DB/`.env`; không dịch vụ trả phí. Quyết định là của **Owner**, chưa phải xác nhận của GVHD/hội đồng.

#### 7.11.1. Cách làm và giới hạn

- Coordinator tự sửa nguồn chung: sổ quyết định, BRD, spec, README công cụ, `build_index.py`, handoff, `rules/domain-guardrails.md`. Một **reviewer độc lập** (chỉ đọc, model opus) kiểm bản cuối — kết quả ở 7.11.8. Không giao worker rà tham chiếu: tự `grep` toàn Docs.
- Skill: các skill nêu trong prompt (`documentation-and-adrs`, `source-driven-development`, `drawio`, `verification-before-completion`) **không có** trong danh sách skill khả dụng của phiên này nên **không nạp**. Không dùng MCP draw.io vì không sửa hình; `.md` sinh bằng `flowkit.py build`.
- **Bằng chứng Owner gốc** tìm lại được trong bản ghi phiên làm việc cục bộ (transcript Claude Code, phiên `2e5c9fe7…`, 10/10/2026 08:30 UTC, câu hỏi nhóm *Bàn giao*). Ba phương án: *IT Admin xác nhận (khuyến nghị)* · *Trưởng phòng của người dùng* · *Chỉ hiện lưu ý, không xác nhận*; Owner chọn phương án đầu. Đây là bằng chứng trực tiếp, **không** phải báo cáo của reviewer. Tệp transcript không nằm trong repo.

#### 7.11.2. Việc đã làm

| Việc | Kết quả |
| --- | --- |
| Ghi `QĐ-63` | Sổ quyết định: **`QĐ-63a`** IT Admin ghi xác nhận bàn giao ở bốn ca (hết hạn, giảm/hủy thuê bao, không hợp thức hóa, thực thi lại); **`QĐ-63b`** giới hạn (chỉ bổ sung bốn ca; người ghi xác nhận ≠ người sở hữu dữ liệu, IT Admin không duyệt nhu cầu/chi; xác nhận tách khỏi kết quả thu hồi; *hạn ngắn* chưa chọn). Dòng `QĐ-62f` có con trỏ sang `QĐ-63a`; dải mã đầu sổ `QĐ-01` → `QĐ-63`; bảng *Việc tiếp theo* thêm dòng 10 |
| BRD | **v3.31** (10/10/2026): chỉ `FR-2.12` (thêm bốn ca) và dòng lịch sử phiên bản. *Định nghĩa Phạm vi* **không đổi** (v1.23): không có mục nào nêu người xác nhận cho ca thu hồi |
| Đính chính `FR-6.10` | Ở sổ quyết định, ngay dưới bảng *Chỗ phải sửa — `QĐ-20`*; **dòng cũ giữ nguyên** làm lịch sử. Vế *"`FR-6.10` nay đã hiện thực"* không còn đúng: BRD hiện hành ghi `FR-6.10` là đặc tả thiết kế cho tương lai, không hiện thực ở MVP (log web/proxy đầy đủ); tiện ích trình duyệt là `FR-4.17`. Vế nguồn bằng chứng thứ ba (c) cho `MF-6` bị `QĐ-31a` thu hẹp. Không tự nhận đã kiểm code |
| Spec và dẫn xuất | 16 spec đổi chữ (`MF-2`, `MF-4`, `MF-5`, `UF-08`, `UF-09`, `UF-12`, `UF-20`, `WF-02`, `WF-03`, `WF-08`, `WF-09`, `WF-09a`, `WF-15`, `WF-16`, `WF-17`, `WF-20`), nâng phiên bản; `.md` sinh lại; **`.drawio` và PNG không đổi byte** (chữ nằm trong `vi`/`doc`, không nằm trên hình). Nhãn *SESSION DECISION* không còn trong spec; ghi chú `doc.open` đổi sang `ĐÃ CHỐT · HO-136, DOI-46, FR-2.12, QĐ-63a`. `build_index.py`: bỏ nhãn `SESSION DECISION` khỏi danh sách loại; căn cứ index `BRD v3.31` / `QĐ-01` → `QĐ-63`; catalog 1.2. Index main flow sửa tay dòng căn cứ. Sau review độc lập (7.11.8): `doc.status`, `doc.sources`, `trigger`, `relations`, `alternates` của `WF-09a` và mảng `rules` của 11 node gọi/được gọi (`QĐ-63a`) cũng được cập nhật |
| `HO-136` | `PENDING-OWNER` → `NEEDS_UPDATE`; đếm lại từ các dòng `HO-`: **51 · 18 · 36 · 1 = 106** (`NEEDS_UPDATE` · `STALE` · `MISSING` · `PENDING-OWNER`); theo cột 52/25/29 giữ nguyên. Chỉ `HO-90` (`OQ-26`) còn chờ Owner. Mã node của `HO-136` đối chiếu lại với `specs/*.json`: không thiếu mã nào |
| Handoff | Dẫn `QĐ-49` → `QĐ-63`, BRD v3.31, verification §7.9–7.11; §6 ghi rõ chỉ `HO-90` còn chờ; §9 dòng 12; §10 trạng thái cuối; **mục 11 mới** — bốn bước bắt đầu giai đoạn ERD/US và bảng ngoài phạm vi (người xử lý, mức chặn). Không tạo tài liệu nghiệp vụ song song |
| Rules | `rules/domain-guardrails.md`: thêm một quy tắc về người xác nhận bàn giao theo ca và ranh giới của IT Admin |

#### 7.11.3. NIT của review cuối (7.4) và điểm chấp nhận có chủ đích

| Mã | Kết quả | Ghi chú |
| --- | --- | --- |
| R12-03 (MF-5/UF-09, nghỉ đột ngột, gói không mất dữ liệu) | **Đóng** | `doc.reading` đã có câu *gỡ ngay, không chờ* từ trước (giữ). Thêm vế: ca này đi nhánh *chưa xác nhận* với cờ *thu hồi khi chưa xác nhận bàn giao*, đúng `WF-07 d_hold → s_over`; chữ *overdue* của guard `d_hc` đọc là *không còn lý do chờ*. Guard không đổi |
| R12-11 (README §7) | **Đóng** | Thêm câu quy ước đọc *luồng phụ bắt đầu bằng `event` không có cạnh vào = một lần chạy độc lập* và nói rõ đây là **quy ước nội bộ, không phải bằng chứng hình tuân thủ đầy đủ UML 2.5**; README 1.2. `doc.reading` của WF-02/03/09/15/17/20 dẫn link tới §7 (anchor được `check_links` kiểm). **Chưa đổi sang `flowfinal`**: giữ lý do cũ (đổi hình mà không đổi hành vi); ảnh hưởng — người đọc theo UML chặt thấy nhánh chính `end`, đã có chú thích |
| R12-12 (UF-04 `doc.status`, MF-2 `lanes_vi.NEED`) | **Đóng** | UF-04 `doc.status` **đã** có vế *approver dự phòng* từ trước → giữ, không làm lại. MF-2 `lanes_vi.NEED` thêm *hoặc khi trưởng phòng tự gửi mà chính là Người duyệt chi* (`FR-3.6`); WF-09 `lanes_vi.NEED` thay *"khi cần"* bằng điều kiện cụ thể cùng nội dung |
| R12-06 (nhãn guard WF-09a sát dây dọc) · R12-13 (đoạn dây MF-2) | **Chấp nhận, không đổi** | Nhãn cách dây khoảng 10 px, không đè chữ, không chạm đỉnh node; chỉ ảnh hưởng thị giác, không đổi guard/topology; đã ghi ở README §7. Không gộp với các lỗi đã sửa |

#### 7.11.4. Hash và cách tái lập

**Hash tổng `specs/*.json`** — thuật toán, chạy từ `Docs/Diagrams`:

```bash
python -c "import glob,hashlib;print(hashlib.sha256(b''.join(open(f,'rb').read() for f in sorted(glob.glob('specs/*.json')))).hexdigest()[:16])"
```

SHA-256 trên **byte thô nối tiếp** của 52 tệp (50 spec + `CTX.json` + `catalog.json`), thứ tự `sorted()` theo tên tệp so ký tự (`CTX.json` đứng trước `MF-2.json`, `catalog.json` đứng cuối), **không chuẩn hóa xuống dòng** (cả 52 tệp là LF, 0 CRLF; chuẩn hóa CRLF → LF cho cùng kết quả), lấy 16 ký tự hex đầu. Sắp theo tên không phân biệt hoa thường cho kết quả **khác** (`9aa137f713be8d1a`) nên thứ tự phải nêu rõ.

- **Giá trị hiện tại (sau `QĐ-63` và các sửa theo review độc lập): `19a4f050e1bbc027`.**
- **Số cũ `12513407b146284c` (7.10.4) bị thu hồi.** Codex tính lại ở trạng thái trước lượt này bằng thuật toán trên được `d5376aaab8bfa115`; tôi không tái lập được `12513407b146284c` và không biết thuật toán đã dùng (có thể khác thứ tự, chuẩn hóa hay tập tệp). Không đổi số cũ cho khớp. Trạng thái trước lượt này không còn nguyên để tính lại, nên `d5376aaab8bfa115` chỉ là báo cáo của Codex; **bảng hash từng tệp mới là bằng chứng**.

**Bảng hash từng tệp (7.10.5):** đối chiếu lại 50 hàng với tệp hiện tại — **34 hàng khớp nguyên**; **16 hàng đổi hash spec, hash `.drawio` và PNG giữ nguyên** (hash 10 ký tự đầu của SHA-256 nội dung):

| Sơ đồ | Phiên bản | Hash spec cũ → mới | `.drawio` / PNG |
| --- | --- | --- | --- |
| `MF-2` | 3.3 → 3.4 | `79aa30661b` → `52bb44698b` | không đổi |
| `MF-4` | 3.3 → 3.4 | `5f56d12917` → `b9ed80e5e6` | không đổi |
| `MF-5` | 3.4 → 3.5 | `cd9e62ddd2` → `44b9eb6341` | không đổi |
| `UF-08` | 1.4 → 1.5 | `f564027278` → `b0a0c0dc79` | không đổi |
| `UF-09` | 1.4 → 1.5 | `a1520e91eb` → `557e13f4bf` | không đổi |
| `UF-12` | 1.3 → 1.4 | `e4ad366ec1` → `0831daf950` | không đổi |
| `UF-20` | 1.3 → 1.4 | `64c57701eb` → `e6d652a0a4` | không đổi |
| `WF-02` | 3.1 → 3.2 | `3da25c99fb` → `15b0ff9ed2` | không đổi |
| `WF-03` | 3.1 → 3.2 | `5e19dcd6b4` → `ddb9a513b6` | không đổi |
| `WF-08` | 2.4 → 2.5 | `88141750ec` → `a6d55b976a` | không đổi |
| `WF-09` | 3.1 → 3.2 | `b8f75c7260` → `9d66cdba88` | không đổi |
| `WF-09a` | 3.4 → 3.5 | `4cb51ff87b` → `1afc49b8e0` | không đổi |
| `WF-15` | 3.3 → 3.4 | `efcaf1873f` → `af1f6bc57c` | không đổi |
| `WF-16` | 3.5 → 3.6 | `c8a5cf7595` → `ce89225e7c` | không đổi |
| `WF-17` | 3.3 → 3.4 | `8dabc7663d` → `7ed90d3878` | không đổi |
| `WF-20` | 1.1 → 1.2 | `c912d8da49` → `216748aaa3` | không đổi |

*(Các hash spec/aggregate ở đây là giá trị **cuối của lượt 7.11.8** — giá trị sau `QĐ-64` ở 7.11.9; giá trị tính trước review là `696ad85a305eabc2`.)* Hash 16 ký tự: BRD v3.31 `07dd1f9d96f83f0e` · sổ quyết định `9d265bc5d0ffd82e` · `function-tree.json` `83a06601752774a3` và FDD PNG `1d91f0e2158def7f` (**không đổi** so với 7.10.4) · tổng `specs/*.json` `19a4f050e1bbc027`.

#### 7.11.5. Kiểm tự động — từng loại, không gộp

Chạy lại sau khi sửa (10/10/2026, `python -X utf8 -B`, từ `Docs/Diagrams`):

| Loại | Lệnh | Kết quả | Ghi chú |
| --- | --- | --- | --- |
| Source ↔ xuất | `tools/flowkit.py check "specs/*.json"` | **PASS** 50/50 | 5 cảnh báo *fallback sides* có từ trước (`WF-01`, `WF-07`, `WF-09`, `WF-15`, `WF-16`); không cảnh báo mới |
| Context | `context-diagram/tools/build_context_diagram.py --check` | **PASS** | 8 tác nhân / 41 luồng |
| FDD | `functional-decomposition-diagram/build_fdd.py --check` | **PASS** | 15 feature / 84 chức năng; FDD không đổi trong lượt này |
| Index | `tools/build_index.py --check` | **PASS** | 4 tệp, gồm `open-items.md` |
| Link — bộ sơ đồ | `tools/check_links.py` | **PASS** | 597 link, 7 anchor, 0 gãy (591/1 ở 7.10.4; thêm link và anchor ở handoff mục 11, README §7, sáu `doc.reading`) |
| Link — phạm vi mở rộng (Scope, BRD, Decisions, báo cáo lệch, domain-guardrails) | `tools/check_links.py <5 tệp>` | **FAIL (ngoại lệ lịch sử, không mới)** | 681 link, 18 anchor, 7 gãy — cùng 7 link tới tài liệu BE đã gỡ ở commit BE `6396bbf`, đã chú thích ở đầu sổ |
| Link — toàn Docs | `tools/check_links.py --all-docs` | **FAIL (ngoại lệ, không mới)** | 2234 link, 1044 anchor, **90 gãy** — cùng số với 7.10.4; không báo là *toàn Docs PASS* |
| Ngữ nghĩa | script đối chiếu mã node `HO-136` + đếm lại 106 dòng `HO-` | **PASS** | không thiếu node; không trùng mã |
| Hình | so hash `.drawio`/PNG trước–sau khi sinh lại 16 spec | **Không có ảnh đổi** | nên không mở lại ảnh; bằng chứng xem ảnh của 7.10.5 còn hiệu lực cho các hình này |

**Baseline link:** báo cáo `Reviews/diagram-links-baseline-2026-10-10.md` so working tree với HEAD `db15eb4` bằng bản export `git archive` **cộng lớp phủ** (overlay) các thư mục bị `.gitignore` và `../Code`, `../Tools` lấy từ chính môi trường hiện tại. Nó cho biết *trong cùng môi trường này* không có link gãy **mới** so với HEAD; **không** chứng minh nội dung các thư mục ignored là lịch sử bất biến. Phân loại 7 / 90 giữ như 7.10.4; không chạy lại baseline vì không có tệp đích nào đổi và số gãy không đổi.

#### 7.11.6. Danh sách tệp cần chia sẻ (chỉ lập danh sách, không stage/commit)

Chủ máy có thể review tại chỗ mà không cần commit. Nếu chia sẻ qua git, các nhóm dưới đây phải đi cùng nhau vì `index.md`, verification và các `.md` sinh tự động dẫn tới nhau:

1. **Chưa được git theo dõi (bàn giao của bộ sơ đồ):** `Diagrams/handoff-erd-us-2026-10-09.md`, `Diagrams/open-items.md` — được `index.md`, `verification-2026-10-08.md`, `specs` và các `.md` dẫn tới; thiếu chúng link sẽ gãy.
2. **Chưa được theo dõi, không thuộc việc này:** `Requiments/Software License Management & Optimization System.docx` (Owner) và tệp khóa `Requiments/~$ftware License Management & Optimization System.docx` — **không** chia sẻ tệp khóa.
3. **Đã theo dõi, sửa trong lượt này (chưa commit):** `Decisions/project-decisions.md`; `Requiments/BRD - HỆ THỐNG ….md`; `rules/domain-guardrails.md`; `Diagrams/verification-2026-10-08.md`, `Diagrams/index.md`, `Diagrams/tools/README.md`, `Diagrams/tools/build_index.py`, `Diagrams/specs/catalog.json`; 16 spec ở 7.11.4 và các `.md` sinh từ chúng; ba `index.md` của workflow/user flow/main flow.
4. **Không theo dõi bằng git (`Reviews/`, gitignored) nhưng được dẫn từ tài liệu trên:** `diagram-closure-followup-2026-10-10.md`, `diagram-fr-disposition-2026-10-10.md`, `diagram-links-baseline-2026-10-10.md`, `diagram-redraw-followup-review-2026-10-09.md`; ngoài ra báo cáo review cuối `diagram-closure-final-review-2026-10-10.md` nêu ở 7.10.7. Cần gửi riêng nếu người nhận không có thư mục này.
5. **Thay đổi của Owner trong cùng cây làm việc, không đụng tới:** `Requiments/SU26SE166_…_vi.md` và `Requiments/Origins/…docx` (cùng với tệp ở mục 2).

#### 7.11.7. Phạm vi sẵn sàng và việc còn lại

| Hạng mục | Trạng thái |
| --- | --- |
| Bộ sơ đồ + `QĐ-63` | Quyết định đã ghi sổ và BRD đã đồng bộ; sơ đồ **sẵn sàng đọc/review**. Chưa có xác nhận GVHD/hội đồng |
| ERD v4.2 / Logical S0 0.10 / User Stories v0.14 | **Chỉ sẵn sàng nhận bàn giao**; còn là bản cũ; 106 mục `HO-`, không mục nào đã triển khai; **không gói code nào** được đánh dấu sẵn sàng |
| `HO-136` | Đã có quyết định; ca chồng lấn *(trước đây chưa chọn — đã chốt `QĐ-64a`, xem 7.11.9)*; còn AC ở các Story chứa bốn ca (tối thiểu `US-03-05`, `US-11-02`, `US-11-03`, `US-13-06`, `US-07-05`, `US-07-07`) và chỗ lưu người/thời điểm xác nhận ở ERD; giá trị *hạn ngắn* ở thiết kế kỹ thuật |
| `OQ-26` / AI | Phiên AI cùng Owner; chưa cho phép gửi dữ liệu thật tới model ngoài; không chặn review nghiệp vụ lõi |
| Report 1 §6 | Nhóm tự sửa theo quy định trường; không soạn thay |
| Bản đăng ký / DOCX | Owner phân loại lịch sử hay bản nháp hiện hành; giữ nguyên |
| L-1 → L-6 | Owner báo GVHD, lưu phản hồi thực tế; kết luận ghi bằng `QĐ` mới |
| Autosave FDD `.bkp` | Giữ; Owner quyết xóa; không chặn nghiệp vụ |
| Tệp dẫn xuất còn nhắc *BRD v3.30* (26 spec trong mô tả/trạng thái, Context index, FDD guide) | **Giữ nguyên có chủ đích:** v3.31 chỉ đổi `FR-2.12`; chín spec chạm `QĐ-63a` (`WF-09a`, `WF-08`, `MF-4`, `WF-15`, `WF-16`, `WF-17`, `UF-08`, `UF-12`, `UF-20`) đã ghi *BRD v3.31* ở `doc.status`; các hình còn lại không chạm nội dung đó. Index chung, index WF/UF/MF dùng *căn cứ BRD v3.31* |

#### 7.11.8. Reviewer độc lập — bản cuối (QĐ → FR → node/guard/actor/end state → handoff)

Reviewer độc lập (chỉ đọc, model opus, một lượt; không sửa tệp nào). Lưu ý của reviewer: mục 7.11 được ghi đồng thời nên lần đọc đầu chưa có §7.11 — kết luận dựa trên lần đọc sau. Báo cáo là dữ liệu; **từng phát hiện được tôi kiểm lại với nguồn** trước khi sửa:

| Mã | Mức | Phát hiện | Kiểm lại | Xử lý |
| --- | --- | --- | --- | --- |
| R-01 | MAJOR | Story đích ghi sai `US-07`/`US-12` (không phải mã Story; EP-12 là chi tiêu) ở sổ, handoff, `WF-09a`, verification | **Đúng.** Không có tiêu đề `US-07`; `US-07-05`, `US-07-07`, `US-11-02`, `US-11-03`, `US-13-06`, `US-03-05` có thật và chứa bốn ca (AC-5 giảm thuê bao; *Không duyệt* → IT thu hồi; hết hạn nhà thầu `WF-08`) | **Đã sửa** ở 5 nguồn (sổ ×2, handoff, `WF-09a`, verification) → `.md`/`open-items.md` sinh lại. Ghi *tối thiểu … chốt khi viết lại* vì danh sách Story chưa được rà đủ |
| R-02 | MINOR | `WF-09a` `doc.status/sources/alternates/trigger/relations` chưa theo `QĐ-63`; tám spec khác còn *BRD v3.30* ở `doc.status` | **Đúng** | **Đã sửa** cho chín spec; câu cũ *"bốn spec liên quan đã sửa"* thay bằng dòng ở 7.11.7 |
| R-03 | NIT | Không mảng `rules` nào chứa `QĐ-63a` | **Đúng** (0/11 node) | **Đã sửa:** 11 node (`d_dl`, `s_ask`, `e_hc`, `WF-08 c_rec`, `MF-4 c_all`/`c_excess`, `WF-15 c_rec`, `WF-16 c_exec`, `WF-17 c_recl`, `UF-12`/`UF-20 r_recl`) |
| R-04 | MINOR | Handoff §11 nhóm (d) gắn nhãn EP-07 nhưng chứa mục của EP-03 | **Đúng** (`HO-71`, `HO-62` ghi EP-03; `HO-21` = `US-03-04`) | **Đã sửa:** EP-07 (`HO-40`, `HO-136`) tách khỏi phần vòng đời nhân sự của EP-03 |
| R-05 | MINOR | Ca chồng lấn: seat đã quyết thu hồi ghost seat (trưởng phòng xác nhận, `QĐ-62f`) nằm trong phần vượt khi giảm thuê bao (IT xác nhận, `QĐ-63a`); chưa có thứ tự | **Đúng** (`MF-4 c_excess`: *ưu tiên seat G1/G3/G4 đã có quyết định thu hồi*; `d_dl` chỉ xét *bên gọi đã ghi xác nhận*) | **Không tự đặt quy tắc** (Owner chưa chọn). Ghi là *chưa chọn* ở `QĐ-63b`, `HO-136`, `WF-09a` `doc.open` (`LIMIT`), §6 handoff. **Câu hỏi cho Owner** (ứng viên `QĐ-64`) — **đã chốt ở 7.11.9** |
| R-06 | NIT | Handoff dòng 13 ghi dòng 7, 8, 9 trong khi sổ đã có dòng 10 | **Đúng** | **Đã sửa** |

**Đã kiểm và đúng (theo reviewer, đã chọn lọc kiểm lại):** `QĐ-63a`/`FR-2.12`/dòng v3.31 khớp về bốn ca, actor, *không chặn sau hạn ngắn*; `QĐ-63` không thêm actor hay hạn, mọi ý của `QĐ-63b` suy ra từ `SoD-5`, `SoD-7`, `QĐ-62c/e/f/i`; actor IT Admin nhất quán ở các node gọi; không còn *chờ Owner* hay *`QĐ-62f` chỉ phủ 4 ca* ở dạng hiện hành; đếm lại 106 mã `HO-` (không trùng): 51 · 18 · 36 · 1, cột 52/25/29; §11 đúng yêu cầu; đính chính `FR-6.10` đúng BRD và `QĐ-31a`; NIT MF-5/UF-09/MF-2/WF-09 khớp `WF-07` và `FR-3.6`; bullet `domain-guardrails.md` không mâu thuẫn.

**Reviewer không kiểm được:** transcript gốc (ngoài repo) — tôi đã đọc trực tiếp, ghi ở 7.11.1; nội dung `WF-09a` trước `QĐ-63`; các hash/checker; không mở ảnh (không có ảnh đổi). **Chưa có lượt review thứ hai** cho các sửa R-01 → R-06 *(đã có ở 7.11.9)*; các sửa này là chữ, đã chạy lại `flowkit check`, `build_index --check`, `check_links` và so hash `.drawio`/PNG (không đổi).

#### 7.11.9. Chốt ca chồng lấn — `QĐ-64` (10/10/2026, follow-up của 7.11.8)

> Thực hiện `PROMPT_CLAUDE_CHOT_CA_CHONG_LAN_VA_BAN_GIAO_2026-10-10.md`. 7.11.1–7.11.8 giữ nguyên làm lịch sử. Không stage/commit/push; không BE/FE/DB/`.env`. Quyết định là của **Owner**, chưa phải xác nhận của GVHD/hội đồng.

**Câu hỏi và bằng chứng.** Câu hỏi: một seat trên gói mất dữ liệu đã được trưởng phòng quyết *Thu hồi* (ghost seat, `QĐ-62f`) và cùng lúc nằm trong phần vượt khi giảm thuê bao (`QĐ-63a`); chỉ một tác vụ thu hồi — ai ghi xác nhận khi chưa có xác nhận hợp lệ?
- *Kiểm lịch sử trước khi hỏi:* quét bản ghi các phiên 08–10/10/2026 tìm câu hỏi có phương án về ca này — **không có** (chỉ có câu của `QĐ-63a`).
- *Câu trả lời:* Owner trả lời trực tiếp trong lượt này qua câu hỏi có phương án (kết quả công cụ hỏi–đáp của phiên): **"Trưởng phòng xác nhận"**. Ba phương án: trưởng phòng · IT Admin · theo tác vụ tạo trước. Phương án trợ lý khuyến nghị trùng với phương án Owner chọn; khuyến nghị **không** được coi là duyệt trước khi Owner trả lời. Tiền đề kèm theo: đã có xác nhận hợp lệ thì dùng lại (không hỏi lại).

| Việc | Kết quả |
| --- | --- |
| Ghi sổ | `QĐ-64a` (trưởng phòng đã quyết *Thu hồi* ghost seat xác nhận; một tác vụ thu hồi; IT Admin không xác nhận thêm; đã có xác nhận hợp lệ thì dùng lại) · `QĐ-64b` (giới hạn: chỉ phần vượt khi giảm thuê bao; ba ca còn lại của `QĐ-63a` **chưa hỏi, không suy rộng**; người xác nhận ≠ người thực thi ≠ kết quả; không thêm hạn/quyền; cách ghi *lý do thu hồi thứ hai* để ERD). Con trỏ ở dòng `QĐ-62f`, `QĐ-63a`, ô *Chưa chọn* của `QĐ-63b` (**giữ nguyên văn lịch sử**), danh sách *bị thay một phần*, dòng 10 bảng *Việc tiếp theo* |
| BRD | **v3.32**: `FR-2.12` thêm một câu cho ca chồng lấn; dòng lịch sử 3.32. Scope không đổi (v1.23) |
| Rules | `rules/domain-guardrails.md`: bullet thu hồi thêm ca `QĐ-64a` |
| Spec và dẫn xuất | `WF-09a` 3.6 (`d_dl`, `s_ask`, `e_hc`, `doc.open` đổi từ `LIMIT` sang `ĐÃ CHỐT`, nguồn, `alternates`, status) · `WF-13` 3.3 (`c_reclaim`) · `MF-4` 3.5 (**chỉ** `c_excess`; `c_all` không mang ngoại lệ) · `WF-15` 3.5 · `UF-08` 1.6 · `UF-20` 1.5; `rules` có `QĐ-64a`. `.md`, `open-items.md` (`LIMIT` 28 → 27), index sinh lại; `build_index.py` căn cứ BRD v3.32 / `QĐ-64`; catalog 1.3. **`.drawio` và PNG không đổi byte** so với đầu phiên (so hash 105 tệp) nên không phải xem lại ảnh |
| Handoff | `HO-136` ghi `QĐ-64a`, thêm `US-10-06`, `US-10-07`, node `WF-13 c_reclaim`, `UF-12 r_recl`, `UF-20 r_recl`; §6 bỏ câu về ca chồng lấn chưa chọn; §0/§9/§10 dẫn `QĐ-64`, BRD v3.32. Đếm lại theo mã duy nhất: **106 mã · 51 `NEEDS_UPDATE` · 18 `STALE` · 36 `MISSING` · 1 `PENDING-OWNER`** (không có mục con nào phải tách). Chỉ `HO-90` (`OQ-26`) còn chờ Owner |

**Review độc lập lượt 2 (R-01…R-06 trên nguồn cuối)** — reviewer chỉ đọc, model opus; mỗi phát hiện được tôi đối chiếu nguồn trước khi sửa:

| Mã | Mức | Phát hiện | Xử lý |
| --- | --- | --- | --- |
| F-1 | MINOR | Câu *"không còn chờ Owner"* (handoff §1.2, `HO-136`; verification) mâu thuẫn với câu hỏi chồng lấn đang hỏi | **Đúng tại thời điểm đó.** Sau `QĐ-64` các câu đó đúng trở lại; câu ghi ca chồng lấn *chưa chọn* đã được thay |
| F-2 | MINOR | Điểm cần Owner chọn bị gắn nhãn `LIMIT` | **Đã sửa:** `ĐÃ CHỐT · … QĐ-64a`; phần chưa hỏi ghi rõ là *chưa hỏi, không suy rộng* trong nội dung |
| F-3 | MINOR | `MF-4 c_excess`, `WF-15 c_rec`, `UF-20 r_recl` viết như đã chọn IT Admin cho ca chồng lấn | **Đã sửa:** thêm vế ngoại lệ `QĐ-64a` ở ba node (và `WF-13 c_reclaim`) |
| F-4 | NIT | Dòng 10 bảng *Việc tiếp theo* thiếu điểm chồng lấn | **Đã sửa** |
| F-5 | NIT | Cột node của `HO-136` thiếu `UF-12 r_recl`, `UF-20 r_recl` | **Đã sửa** (thêm cả `WF-13 c_reclaim`) |
| F-6 | NIT | `QĐ-63` *Tài liệu đổi* thiếu `rules/domain-guardrails.md` | **Đã sửa** |

Reviewer xác nhận R-01 → R-06 đã vào nguồn; mã Story tồn tại (US-07-07 chỉ liên quan gián tiếp — danh sách ghi *tối thiểu*, không khẳng định đầy đủ); thu hồi đóng thất bại không bị coi là mất quyền ở mọi node liên quan; hash/đếm `HO-` khớp. **Reviewer lượt 3** kiểm đúng diff `QĐ-64` — kết quả ở 7.11.10.

**Hash (thuật toán và lệnh ở 7.11.4; `sorted()` trên chuỗi đường dẫn):**
- Tổng `specs/*.json` (52 tệp): **`c0ceefec58e20010`** (sau sửa theo reviewer lượt 3, xem 7.11.10; trước đó `832ed5ae1a8565ff`; trước `QĐ-64`: `19a4f050e1bbc027`).
- BRD v3.32 `9dd58bb8b1971018` · sổ quyết định `8134f73d7513babd` · `function-tree.json` `83a06601752774a3` và FDD PNG `1d91f0e2158def7f` (không đổi).
- Sáu spec đổi hash (hash 10 ký tự; `.drawio`/PNG giữ nguyên): `MF-4` `12acfd9396` · `UF-08` `9404eb706f` · `UF-20` `794e61cd14` · `WF-09a` `27cc9c8999` · `WF-13` `a56800951b` · `WF-15` `80353a7d34`. Mười spec khác của 7.11.4 giữ hash đã ghi ở đó.

**Kiểm tự động (chạy lại sau `QĐ-64`):**

| Loại | Kết quả |
| --- | --- |
| `flowkit check "specs/*.json"` | **PASS** 50/50 (5 cảnh báo *fallback sides* có từ trước) |
| Context · FDD · `build_index --check` | **PASS** (8/41 · 15/84 · 4 tệp) |
| Link — bộ sơ đồ | **PASS** 597 link, 7 anchor, 0 gãy |
| Link — phạm vi mở rộng 5 tệp | **FAIL (lịch sử, không mới)** 681 link, 18 anchor, 7 gãy — cùng 7 link BE đã gỡ (`6396bbf`) |
| Link — toàn Docs | **FAIL (lịch sử, không mới)** 2234 link, 1044 anchor, **90 gãy** — cùng số; không báo *toàn Docs PASS*. Baseline so trong cùng môi trường có overlay thư mục ignored (xem 7.11.5) |
| Ngữ nghĩa | mã node của `HO-136` tồn tại trong `specs/*.json` (không thiếu); `.drawio`/PNG không đổi nên không có ảnh phải xem |

**Bàn giao (bốn điểm của prompt):**
1. **Bộ diagram** (Context · FDD · 5 main flow · 24 workflow · 21 user flow): *sẵn sàng đọc/review*; quyết định `QĐ-49` → `QĐ-64` đã thể hiện; chưa có xác nhận GVHD/hội đồng.
2. **ERD/US bắt đầu ngay** theo handoff mục 11, nhóm (a) → (f): tổ chức/tài khoản · danh mục/gói/thuê bao · yêu cầu/duyệt · cấp phát/thu hồi/bàn giao · usage/lãng phí/thiết bị · gia hạn/chi tiêu/thuế/đối soát; và Mobile ở nhóm (g). **`HO-136` viết AC được ngay.** Chỉ **chờ**: `OQ-26` (`HO-90`) — chặn phần dữ liệu của AC AI (`HO-82`, `HO-83`) và ERD nhật ký AI (`HO-135`), không chặn phần còn lại. Hai điểm không chờ Owner nhưng cần chốt khi thiết kế: giá trị *hạn ngắn* (kỹ thuật) và cách ghi *lý do thu hồi thứ hai* (ERD). Ba ca còn lại của `QĐ-63a` vẫn theo `QĐ-63a` (IT Admin); việc Owner có muốn ngoại lệ tương tự hay không **chưa được hỏi** — không chặn AC.
3. **106 mục `HO-` là đầu vào cần xử lý**, không phải ERD/US đã đồng bộ hay gói code sẵn sàng; không mục nào đã triển khai; không gói nào được đánh dấu sẵn sàng.
4. **Tệp cần gửi cùng, chưa tự commit:** như 7.11.6 — `handoff-erd-us-2026-10-09.md`, `open-items.md` (chưa được git theo dõi); các tệp đã theo dõi nhưng sửa chưa commit gồm cả `Decisions/project-decisions.md`, `Requiments/BRD…md`, `rules/domain-guardrails.md`, `Diagrams/verification-2026-10-08.md`, sáu spec của lượt này và các `.md` sinh từ chúng; `Reviews/` (gitignored) gồm báo cáo review cuối nếu người nhận cần.

**Ngoài phạm vi, không đổi:** `OQ-26` (phiên AI/Owner) · Report 1 §6 (nhóm tự viết) · bản đăng ký/DOCX (Owner phân loại) · L-1 → L-6 (Owner trao đổi GVHD) · autosave FDD `.bkp`.

#### 7.11.10. Reviewer lượt 3 — đúng diff `QĐ-64`

Reviewer độc lập (chỉ đọc, model opus). Mỗi phát hiện được tôi đối chiếu nguồn trước khi sửa:

| Mã | Mức | Phát hiện | Kiểm lại | Xử lý |
| --- | --- | --- | --- | --- |
| R3-1 | MAJOR | `WF-09a` `e_hc.vi`, `doc.alternates`, `UF-08` `doc.excluded` thiếu vế *nằm trong phần vượt khi giảm thuê bao*: đọc theo chữ, ngoại lệ áp cho cả hủy/hết hạn/thực thi lại — suy rộng, trái `QĐ-64b` | **Đúng** (`d_dl`, `s_ask`, `doc.open` có vế đó; ba chỗ này thiếu) | **Đã sửa** ba chỗ; `.md` sinh lại |
| R3-2 | MINOR | `WF-15 c_rec`, `UF-20 r_recl` gộp Giảm và Hủy; câu ngoại lệ đứng sau câu chung nên có thể bị đọc là áp cả cho hủy toàn bộ | **Đúng** | **Đã sửa:** *Riêng phần vượt khi giảm thuê bao (không áp cho hủy toàn bộ thuê bao): …* |
| R3-3 | MINOR | Dòng 10 bảng *Việc tiếp theo* đã dẫn `QĐ-64` nhưng ghi BRD v3.31 | **Đúng** | **Đã sửa:** BRD v3.32 |

**Kiểm sau sửa:** script quét mọi câu có `QĐ-64a` trong spec — chỉ còn câu của `MF-4 c_excess` (node chuyên về phần vượt) và hai dòng `doc.status` (chỉ trích mã) không nêu *phần vượt* trong cùng câu, đều không mở rộng phạm vi; `flowkit check` 50/50, `build_index --check` 4/4, link bộ sơ đồ 597/0 gãy, `.drawio`/PNG không đổi byte. Reviewer xác nhận (trước sửa): `QĐ-64a` đúng lựa chọn Owner, `QĐ-64b` ghi *suy ra* và *chưa hỏi, không suy rộng*, lịch sử `QĐ-63b` còn nguyên, BRD `FR-2.12` đúng phạm vi, `MF-4` chỉ `c_excess` mang ngoại lệ, `HO-136` 5 ô và mọi node tồn tại, đếm 51/18/36/1 = 106, `US-10-06`/`US-10-07` có thật.

**Giới hạn:** reviewer không có bản trước `QĐ-64` (toàn bộ thay đổi `QĐ-61` → `QĐ-64` chưa commit) nên kiểm trạng thái hiện tại, không kiểm diff từng dòng; không xem nhãn `.drawio`/PNG (không đổi). Ba sửa R3 là **thu hẹp chữ cho khớp quyết định đã ghi**, không đổi nội dung nghiệp vụ nên không giao reviewer lượt 4; đã kiểm bằng script và chạy lại checker.
