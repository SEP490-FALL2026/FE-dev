# Bàn giao ERD và User Stories sau lượt chốt sơ đồ — 09/10/2026

> **Đây là danh sách bàn giao cho giai đoạn *ERD + User Stories* của `QĐ-59e`, không phải bản thiết kế lại.** Tài liệu chỉ nói **tệp nào, mã nào phải đổi, vì sao, theo nguồn nào, sơ đồ nào thể hiện**; nội dung Story/ERD mới do giai đoạn sau soạn. Không tệp nào khác bị sửa trong lượt này.
>
> **Không phải xác nhận của GVHD, hội đồng hay mentor.** Mọi quyết định được dẫn (`QĐ-49` → `QĐ-64`) là quyết định của **Owner**; trạng thái *VALID* dưới đây chỉ có nghĩa *không mâu thuẫn nguồn hiện hành theo lượt rà này*, không có nghĩa đã được duyệt.
>
> **Người soạn:** trợ lý AI theo yêu cầu Owner (worker chỉ đọc, ghi đúng một tệp này). **Không có reviewer độc lập cho chính tệp bàn giao này** — chỉ spot-check `HO-20`, `HO-42`, `HO-49`, `HO-110` trong review độc lập 10/10/2026 và đối chiếu mã node bằng script (mục 10). Các sơ đồ nguồn đã qua review độc lập riêng, kết quả ở [verification §7.9–7.11](verification-2026-10-08.md).

## 0. Nguồn đã đọc và cách đọc

| Loại | Tệp / mã | Ghi chú |
| --- | --- | --- |
| Quyết định | [sổ quyết định](../Decisions/project-decisions.md) — `QĐ-49` → `QĐ-64`, bảng *Trạng thái hiện hành* dòng **7**, **8**, **9**, **10** | Thứ tự căn cứ: `QĐ` → BRD → sơ đồ |
| Nghiệp vụ | [BRD](<../Requiments/BRD - HỆ THỐNG QUẢN TRỊ BẢN QUYỀN PHẦN MỀM & TỐI ƯU CHI PHÍ CÔNG NGHỆ.md>) | BRD **v3.35** (12/10/2026) đã đồng bộ `QĐ-61` → `QĐ-66` (v3.31 và v3.32 chỉ đổi `FR-2.12`: bốn ca của `QĐ-63a`, seat chồng lấn của `QĐ-64a`; v3.33–v3.35: câu chữ, `QĐ-66`, làm rõ `QĐ-66ag`) — mục 3.2 không còn câu *"Không phát triển ứng dụng di động"*. Khi khác nhau, sổ quyết định thắng |
| Sơ đồ | `specs/*.json` (50 spec + `specs/catalog.json`), `functional-decomposition-diagram/function-tree.json`, [index.md](index.md), [verification-2026-10-08.md](verification-2026-10-08.md) | Các sơ đồ đã được cập nhật đồng bộ (`QĐ-61`/`QĐ-62`); các thay đổi làn/node (VD: `MF-8 a_updsub`, `WF-16 a_upd` chuyển sang IT) đã hoàn tất. Kiểm lại mã node ở bản xuất cuối trước khi dùng. |
| User Stories | [user-stories-and-epics.md](../BE-UserStory/user-stories-and-epics.md) **v0.14** — 117 Story, 15 Epic | Không có tham chiếu nào tới `QĐ-49`, `QĐ-50`, `QĐ-52` → `QĐ-62` (đã đếm); `QĐ-51` có ở `US-03-01` |
| ERD | [Conceptual ERD](<../ERD/CONCEPTUAL ERD - DANH SÁCH ENTITY.md>) page **v4.2** — 21 thực thể · 40 quan hệ · 18 bất biến; [Logical ERD S0](../ERD/logical/LOGICAL-ERD-S0.md) **0.10** — 42 thực thể · 103 quan hệ R1–R103 | Bộ sinh: `../ERD/tools/generate-conceptual-erd.py`, `../ERD/tools/generate-logical-erd-s0.py`; checker: `check-erd-consistency.py`, `check-logical-erd-s0.py` |
| Lịch sử | [user-flows/business-flow-catalog.md](user-flows/business-flow-catalog.md) | Tài liệu lưu `F-01` → `F-48`, `BR-xx.x` — mục 8 |

**Hai đoạn nguồn quyết định phạm vi bàn giao (trích nguyên ý từ bảng *Trạng thái hiện hành* của sổ):**

- **Dòng 7** (`QĐ-49`, 05/10/2026): *Logical ERD — `license_assignments.subscription_id` hiện NOT NULL (quyết định `QĐ-49b` cho truy cập không có thuê bao cần đổi), `vendor` đang bắt buộc với sản phẩm, khoản chi nội bộ ↔ Cost Center chưa có chỗ ghi; User Stories — EP-04/05/07/12 cho phần mềm nội bộ, license vĩnh viễn, `QĐ-49f`/`g`/`h`, `QĐ-50a`/`b`/`c` và hai tính năng AI mới: cần story mới.*
- **Dòng 8** (`QĐ-52` → `QĐ-58`, 08/10/2026): *Conceptual/Logical ERD — thêm `Department` (trưởng phòng — một người tối đa một phòng, `INV-19`; IT Admin phụ trách, Cost Center 1–1) và quan hệ nhân viên–phòng có hiệu lực; bỏ `Project` khỏi loại Cost Center; thêm kiểu cấp/mức kiểm soát/điều khoản trên gói, kho khóa bản quyền, hồ sơ thuế nhà cung cấp, dòng thuế hóa đơn, bộ công cụ chuẩn; BE — module tổ chức đang dựa trên `manager_id` và đã có test (`QĐ-51`, BE0032) ⟹ cần thiết kế chuyển đổi; User Stories — EP-01/02/03 và story mới cho kho khóa, điều khoản, thuế, biểu mẫu.*
- **Dòng 9** (`QĐ-61`, `QĐ-62`, 09/10/2026) và **dòng 10** (`QĐ-63`, `QĐ-64`, 10/10/2026) trỏ về chính tệp này cho phần User Stories/ERD; `OQ-26` (điều kiện dữ liệu gửi model) còn mở.

**Trạng thái dùng trong tệp:**

| Trạng thái | Nghĩa |
| --- | --- |
| `VALID` | Không mâu thuẫn `QĐ`/BRD/sơ đồ hiện hành; có thể chỉ cần sửa câu chữ chung ở `HO-04` |
| `NEEDS_UPDATE` | Hành vi chính còn đúng nhưng thiếu/sai một phần AC, nguồn, phạm vi hoặc thuộc tính |
| `STALE` | Hành vi chính mâu thuẫn quyết định hiện hành — phải viết lại hoặc thay |
| `MISSING` | Sơ đồ/BRD có hành vi nhưng chưa có Story hoặc chưa có thực thể/thuộc tính ERD |
| `PENDING-OWNER` | Còn thiếu lựa chọn nghiệp vụ; không viết thành AC/ERD cho tới khi Owner chốt |

Mã bàn giao dùng tiền tố **`HO-`** — đã grep toàn bộ `Docs` và `Code`, không có mã `HO-<số>` nào trước đó.

---

## 1. Số đếm

### 1.1. Theo Story (117 Story của v0.14)

| Trạng thái | Số Story | Story |
| --- | ---: | --- |
| `VALID` | **57** | xem bảng 3 |
| `NEEDS_UPDATE` | **47** | xem bảng 3 |
| `STALE` | **13** | `US-01-02`, `US-02-02`, `US-02-03`, `US-03-01`, `US-03-02`, `US-04-09`, `US-05-03`, `US-05-06`, `US-05-12`, `US-06-04`, `US-12-01`, `US-15-03`, `US-15-04` |
| `PENDING-OWNER` | 0 | Các điểm chờ Owner tách thành mục riêng (mục 6), không treo cả Story |

### 1.2. Theo mục bàn giao `HO-` (106 mục)

| Trạng thái | User Stories (cấp tài liệu + Story) | Story mới | ERD | Tổng |
| --- | ---: | ---: | ---: | ---: |
| `STALE` | 13 | — | 5 | **18** |
| `NEEDS_UPDATE` | 38 | — | 13 | **51** |
| `MISSING` | — | 25 | 11 | **36** |
| `PENDING-OWNER` | 1 | — | — | **1** |
| **Tổng** | 52 | 25 | 29 | **106** |

*Một mục `HO-` có thể gom nhiều Story cùng lý do; số Story ở 1.1 đếm riêng từng Story. Số đếm bảng 1.2 đã **đếm lại từng nhóm từ các dòng `HO-`** ngày 10/10/2026 (106 mã duy nhất): bản 09/10 ghi 105 mục — 47/36/18/4; `HO-91`, `HO-92` nằm ở mục 6 nhưng là `NEEDS_UPDATE`, `HO-93` đã bỏ `PENDING-OWNER`, và `HO-136` được thêm. **Sau `QĐ-63` (10/10/2026):** `HO-136` chuyển từ `PENDING-OWNER` sang `NEEDS_UPDATE` (đã có quyết định, còn AC/ERD) — `NEEDS_UPDATE` 50 → 51, `PENDING-OWNER` 2 → 1; tổng vẫn 106 (52/25/29). Chỉ `HO-90` (`OQ-26`) còn chờ Owner.*

---

## 2. Mục cấp tài liệu — `user-stories-and-epics.md`

| Mã | Đích | Việc cần đổi | Nguồn | Sơ đồ / node | Tác động | Trạng thái |
| --- | --- | --- | --- | --- | --- | --- |
| `HO-01` | Mục A (*Baseline dùng làm nguồn*), B (bảng vai trò, *Năng lực trong MVP*), C.2 (cột nguồn EP-01/02/03/05) | Baseline BRD v3.24 → bản hiện hành; sổ `QĐ-01` → `QĐ-47` → tới `QĐ-62`; Conceptual v4.1 → v4.2; bỏ *"Manager phái sinh từ cây quản lý"*, *"cây quản lý trực tiếp và Cost Center"*; thêm Mobile (4 tác vụ) và hai tính năng AI cam kết; EP-03 bỏ `QĐ-23`, thêm `QĐ-52`, `QĐ-56`, `QĐ-62` | `QĐ-52a`, `QĐ-61a`/`e`, `QĐ-62` | [index.md](index.md) mục 3 (5 main flow), mục 6 | Chỉ văn bản; định hướng mọi Story | `NEEDS_UPDATE` |
| `HO-02` | Cột *Source traceability* của **37 Story** | **110 tham chiếu mức node** (`WF-09 (a1, d1, a2)`, `UF-12 (o1, s4)`…) trỏ tới mã node **không còn tồn tại** sau lượt vẽ lại (đã đối chiếu tự động với `specs/*.json`: 0/110 còn khớp). Bảng gợi ý mã mới ở mục 2.1 | Lượt vẽ lại 08–09/10/2026 | `specs/WF-09.json`, `WF-13`, `WF-15`, `WF-16`, `WF-17`, `WF-18`, `UF-01`, `UF-05`, `UF-10`, `UF-11`, `UF-12`, `UF-15`, `UF-16` | Truy vết sai, không đổi hành vi | `NEEDS_UPDATE` |
| `HO-03` | Mục G.1.1 → G.1.6, G.2 | G.1.1 thiếu **14 mã FR** của BRD: `FR-1.9`, `FR-1.10`, `FR-2.9`→`FR-2.12`, `FR-3.17`→`FR-3.19`, `FR-4.21`, `FR-5.13`, `FR-5.14`, `FR-11.1`, `FR-11.2` (đã so tự động); `FR-4.17/4.19/4.20` chuyển sang tệp nghiên cứu (`QĐ-59a`). G.1.3 ghi 16 UF → hiện **21** (`UF-17` → `UF-21`, tên mới tiếng Anh). G.1.4 ghi 22 trang → hiện **24** (thêm `WF-19`, `WF-20`; `WF-05`, `WF-07`, `WF-16`, `WF-17` đổi nội dung). G.1.5 thiếu `INV-19`, `INV-20`. G.1.6 thêm `QĐ-49` → `QĐ-62`. G.1.2 (`F-*`) ghi rõ là mã lịch sử (mục 8) | BRD 5.12.2, [index.md](index.md) mục 4–6, `specs/catalog.json` | — | Truy vết | `NEEDS_UPDATE` |
| `HO-04` | Câu chữ toàn tệp (cả Story `VALID`) | *Manager* → *trưởng phòng (vai Manager)*; *cấp dưới trực thuộc / cây quản lý / cây người phụ trách* → *nhân viên trong phòng*; *approver dự phòng ở gốc cây* → *approver dự phòng ở gốc*; *quản lý cấp trên* → theo `FR-3.8` (cấp trên của nhân viên là trưởng phòng, của trưởng phòng là Người duyệt chi). Story có thay đổi **phạm vi** thật không thuộc mục này mà ở mục 4 | `QĐ-52a`, `QĐ-52c`, `FR-3.7`, `FR-3.8` | `MF-2 s_route`, `UF-04`, `UF-05`, `UF-21 s_dept` | Chỉ câu chữ | `NEEDS_UPDATE` |
| `HO-05` | D.16 *Sổ ngoài phạm vi* | `OOS-09` *"Ứng dụng di động"* **mâu thuẫn** `QĐ-61a` (Mobile native trong phạm vi) — bỏ, thay bằng mục ngoài phạm vi đúng: push notification, offline, theo dõi usage trên điện thoại, chức năng quản trị/tải tệp/biometrics trên mobile (`QĐ-61c`, `QĐ-61d`). `OOS-10` *"Phòng ban… làm định tuyến, phân quyền, ngưỡng hay báo cáo"* mâu thuẫn `QĐ-52a` — chỉ giữ vế **ngưỡng/hạn mức theo phòng** (`QĐ-57c`, `FR-4.13`). Thêm: chatbot/RAG/trợ lý soạn yêu cầu/tóm tắt gia hạn (`QĐ-61e`), nguồn usage và `G2`–`G4` cho phần mềm nội bộ (`QĐ-62o`), chữ ký số/CA (`QĐ-53a`) | `QĐ-61`, `QĐ-52a`, `QĐ-57c`, `QĐ-62o` | — | Phạm vi | `STALE` |

### 2.1. Gợi ý ánh xạ node cũ → node hiện hành (cho `HO-02`)

| Story | Tham chiếu cũ | Node hiện hành gợi ý |
| --- | --- | --- |
| `US-05-01` | `WF-09 a1,d1,a2` | `UF-01 s_mine, s_pick, d_has, b_has, d_set, s_why, s_review`; `WF-09 a_sub` |
| `US-05-02` | `WF-09 a3,a4` | `WF-09 a_sub, s_need`; `UF-01 s_submit, y_route` |
| `US-05-03` | `WF-09 a4b,nt3` | `WF-09 s_need, d_valid`; `MF-2 s_route`; `UF-04 d_own, b_own` |
| `US-05-04` | `WF-09 a5,d2` | `WF-09 a_need, d_need`; `UF-04 s_queue, s_detail, d_flag, s_decide, d_dec` |
| `US-05-05` | `WF-09 m2` | `WF-09 d_br [a: no new cost]`, `d_seat`; `MF-2 d_branch → m_free` |
| `US-05-07` | `WF-09 nt4` | `WF-09 d_seat [no seat left]` |
| `US-05-09` | `WF-09 a6,a6b`; `UF-15 a1` | `WF-09 e_sla, s_remind`; `UF-15 s_queue` |
| `US-05-11` | `WF-09 a4c,a4d`; `UF-01 s2`; `UF-15 s1` | `WF-09 d_valid [none valid], s_wait, e_cfg`; `UF-01 y_route` |
| `US-05-12` | `WF-09 a4d` | `WF-09 e_data, s_redet`; `WF-05 s_reroute`; `MF-7 s_reroute`; `WF-03 s_redet`; `UF-13 y_redet` |
| `US-05-15` | `WF-09 a8` | `WF-09 s_act`; `MF-2 s_done`; `UF-01 s_track, s_time, d_res` |
| `US-06-01` | `WF-09 a7b,d4`; `WF-10 d4` | `WF-09 s_snap, a_dec, d_sa`; `MF-2 s_snap, a_spend, d_spend`; `WF-10 a_hand`; `UF-15 s_req, d_dec` |
| `US-06-02` | `WF-09 ini2,s1`; `UF-15 s6` | `UF-15 d_ask → r_uf11`; `WF-09 e_ask` |
| `US-06-03` | `WF-09 a7,ff2`; `UF-11 a1,a3,s6` | `WF-09 e_ask, a_ans`; `UF-11 s_ask, s_reply, y_note` |
| `US-06-04` | `WF-09 a11,fk1`; `UF-15 s2` | `WF-09 s_com`; `MF-2 s_commit, f_par`; `UF-15 y_app` |
| `US-06-05` | `WF-09 a9,nt7`; `UF-11 a7,d4,s7` | `WF-09 a_rec`; `MF-2 a_fin`; `UF-11 s_cq, s_op, d_op, y_ntf`; `WF-20 e_com, a_rec, d_op, s_ntf` |
| `US-06-08` | `WF-09 nt6`; `UF-15 d2,s1` | `WF-09 s_sa`; `MF-2 a_spend` |
| `US-07-06` | `WF-16 dq2` | `WF-16 d_src [daily connector job], a_conn, s_cmp, d_diff, s_open` |
| `US-09-02` | `UF-16 s1` | không còn node riêng; `WF-18 c_wf12` (rule `ADR-13`) |
| `US-09-05` | `WF-18 d2`; `UF-16 d2,s5,s6` | `WF-18 d_ack, s_alert, c_wf12`; `UF-16 b_noack, y_rec`; `WF-12 s_feed` |
| `US-09-06` | `UF-16 s4` | `WF-18 c_wf12`; `UF-16 t_run` |
| `US-09-07` | `UF-16 a3` | `UF-16 b_noack`; dashboard IT (`FR-5.14`, chưa có node) |
| `US-09-08` | `WF-07 b3` | `WF-07 s_block`; `MF-5 s_block`; `WF-18 e_leave, s_end` |
| `US-09-09` | `WF-18 nt3` | không có node (bộ thu thập chốt ở giai đoạn Tools, `QĐ-59a`) |
| `US-10-04` | `WF-13 nt0,nt2` | `WF-13 s_gen`; `UF-05 s_ev`; `UF-10 s_rec` |
| `US-10-07` | `WF-13 m1,a7,a8`; `UF-10 d2,a6,s3` | `WF-13 d_it, a_ret, c_reclaim, s_acc`; `UF-10 d_block, s_ret, r_uf08, y_acc` |
| `US-10-08` | `WF-13 a6`; `UF-05 s4` | `WF-13 a_ex`; `WF-13a g7` (mở lại khi hết miễn trừ chưa có node riêng) |
| `US-11-01` | `UF-11 a2,s1` | `WF-15 t15, s_a15, t7, s_a7`; `MF-4 t_alert, s_notify`; `UF-20 s_inbox` |
| `US-11-02` | `WF-15 a6s,d2`; `UF-15 a4,d4`; `UF-10 o1b` | `WF-15 s_snap, a_dec, d_dec`; `MF-4 a_dec, d_dec`; `UF-15 s_ren, s_rdec, y_ren, t_ren`; `UF-10 r_uf20` |
| `US-11-03` | `UF-15 s3,s4`; `UF-11 s2` | `WF-15 d_excess, c_rec, a_exec`; `MF-4 a_exec`; `UF-20 s_exec` |
| `US-11-04` | `UF-11 b1,e3`; `WF-15 d2,a12,d3,a10,a13` | `WF-15 t_dead, d_end, s_inc, s_exp`; `MF-4 d_decided, d_auto, s_incident, s_expire`; `UF-20 d_made, t_inc, t_exp` |
| `US-12-04` | `WF-13 a8` | `WF-13 s_acc`; `WF-15 s_save`; `MF-4 s_save`; `UF-20 y_save` |
| `US-13-01` | `UF-12 a1,s1,d2,s2,a3` | `WF-17 a_imp, s_prev, d_prev, c_norm`; `WF-17a`; `UF-12 s_imp, s_prev, d_prev, y_rec` |
| `US-13-02` | `WF-17 a2`; `UF-12 a2` | không có node (`DEFERRED`) |
| `US-13-03` | `WF-17 a3,d1,a4`; `UF-12 d3,s3,a4` | `WF-17 s_find`; `UF-12 s_queue` |
| `US-13-04` | `WF-17 a2b,nt3`; `UF-12 a8` | không có node (`DEFERRED`) |
| `US-13-05` | `WF-17 a4,a5,d2,a6`; `UF-12 d4,a5,a7,o2` | `WF-17 a_it, a_dh`; `UF-12 s_find, y_ctx, r_uf15b` |
| `US-13-06` | `WF-17 c2,c3,a7,d2`; `UF-12 o1,s4` | `WF-17 d_out, a_cat, c_prov, c_recl, s_drec`; `UF-12 d_out, s_cat, r_prov, r_recl`; `UF-15 s_rc, s_rcdec, y_rc, t_rc` |

---

## 3. Phân loại 117 Story

| Epic | `VALID` | `NEEDS_UPDATE` (mục) | `STALE` (mục) |
| --- | --- | --- | --- |
| EP-01 | `US-01-03`, `US-01-06`, `US-01-07`, `US-01-08`, `US-01-10` | `US-01-01` (`HO-11`), `US-01-04` (`HO-12`), `US-01-05` (`HO-13`), `US-01-09` (`HO-14`) | `US-01-02` (`HO-10`) |
| EP-02 | `US-02-01`, `US-02-06` | `US-02-04` (`HO-17`), `US-02-05` (`HO-18`) | `US-02-02` (`HO-15`), `US-02-03` (`HO-16`) |
| EP-03 | `US-03-03` | `US-03-04` (`HO-21`), `US-03-05` (`HO-22`) | `US-03-01` (`HO-19`), `US-03-02` (`HO-20`) |
| EP-04 | `US-04-05`, `US-04-06`, `US-04-07`, `US-04-08` | `US-04-01` (`HO-23`), `US-04-02` (`HO-24`), `US-04-03` (`HO-25`), `US-04-04` (`HO-26`) | `US-04-09` (`HO-27`) |
| EP-05 | `US-05-07`, `US-05-08`, `US-05-10`, `US-05-11`, `US-05-14`, `US-05-16` (`DEFERRED`) | `US-05-01`, `US-05-02` (`HO-28`), `US-05-04` (`HO-30`), `US-05-05` (`HO-31`), `US-05-09` (`HO-33`), `US-05-13` (`HO-35`), `US-05-15` (`HO-36`) | `US-05-03` (`HO-29`), `US-05-06` (`HO-32`), `US-05-12` (`HO-34`) |
| EP-06 | `US-06-02`, `US-06-03`, `US-06-07`, `US-06-08` | `US-06-01`, `US-06-05`, `US-06-06`, `US-06-09` (`HO-37`) | `US-06-04` (`HO-38`) |
| EP-07 | `US-07-06` | `US-07-01`, `US-07-02` (`HO-39`), `US-07-03`, `US-07-04` (`HO-40`), `US-07-05` (`HO-41`), `US-07-07` (`HO-42`) | — |
| EP-08 | `US-08-01`, `US-08-02`, `US-08-03`, `US-08-04`, `US-08-05`, `US-08-07` | `US-08-06`, `US-08-08` (`HO-43`) | — |
| EP-09 | `US-09-02`, `US-09-04`, `US-09-05`, `US-09-07`, `US-09-08` | `US-09-01`, `US-09-03` (`HO-44`), `US-09-06`, `US-09-09` (`HO-43`) | — |
| EP-10 | `US-10-01`, `US-10-02`, `US-10-03`, `US-10-04`, `US-10-05`, `US-10-08`, `US-10-09` (`DEFERRED`) | `US-10-06`, `US-10-07` (`HO-45`) | — |
| EP-11 | `US-11-04` | `US-11-01`, `US-11-02`, `US-11-03` (`HO-46`) | — |
| EP-12 | `US-12-03`, `US-12-04`, `US-12-06`, `US-12-07`, `US-12-08` (`DEFERRED`) | `US-12-02` (`HO-48`), `US-12-05` (`HO-45`) | `US-12-01` (`HO-47`) |
| EP-13 | `US-13-01`, `US-13-02` (`DEFERRED`), `US-13-03`, `US-13-04` (`DEFERRED`) | `US-13-05`, `US-13-06` (`HO-49`), `US-13-07` (`HO-50`) | — |
| EP-14 | `US-14-01`, `US-14-02`, `US-14-03`, `US-14-04`, `US-14-06` | `US-14-05` (`HO-45`) | — |
| EP-15 | `US-15-01` (giữ **riêng**: chưa qua cổng chất lượng, đang ẩn — `QĐ-37`, `QĐ-61e`; backlog Tools `T-07`, `QĐ-59c`) | `US-15-02` (`HO-51`) | `US-15-03`, `US-15-04` (`HO-51`) |
| **Tổng** | **57** | **47** | **13** |

*Ghi chú `VALID`:* `US-04-08` đúng vì tỷ lệ phân bổ chỉ áp cho `Subscription` (`QĐ-49g`); `US-01-04` AC-5 (*không có cấp ngưỡng theo phòng*) vẫn đúng theo `FR-4.13`/`QĐ-57c` nhưng Story có việc khác ở `HO-12`; `US-10-04`/`US-12-04` giữ hai con số tiết kiệm (`FR-4.15`) — phần mềm nội bộ ngoài phạm vi tiết kiệm MVP (`QĐ-62o`). Mọi Story `VALID` vẫn cần `HO-02`/`HO-04` nếu có tham chiếu node hoặc từ *Manager/cấp dưới*.

---

## 4. Mục bàn giao theo Story (`NEEDS_UPDATE` / `STALE`)

Đích chung: [`../BE-UserStory/user-stories-and-epics.md`](../BE-UserStory/user-stories-and-epics.md).

### 4.1. EP-01, EP-02, EP-03 — tổ chức, tài khoản, nhân sự

| Mã | Đích | Việc cần đổi | Nguồn | Sơ đồ / node | Tác động | Trạng thái |
| --- | --- | --- | --- | --- | --- | --- |
| `HO-10` | `US-01-02` (cả Story, AC-1 → AC-7) | Viết lại: vai Manager suy ra từ **giai đoạn trưởng phòng có hiệu lực** (không từ `manager_id`); phạm vi = **nhân viên trong phòng** có giai đoạn thành viên chứa ngày hiện hành; AC-4 *"không dùng phòng ban"* bỏ; AC-6 đổi thành *Super Admin không được gán làm trưởng phòng* (chặn ở thao tác gán, `FR-8.7`) — Super Admin vẫn thuộc một phòng và gửi yêu cầu tới trưởng phòng đó; AC-7 danh sách nhân viên của phòng | `QĐ-52a`, `QĐ-58a`, `FR-3.1`, `FR-3.7`, `FR-8.7`, `INV-19`, `INV-20` | `WF-01 a_heads`; `WF-05 d_head, a_appoint, s_nohead`; `MF-5 d_head, a_newhead`; `WF-07 a_newhead`; `UF-21 s_dept` | Quyền (phạm vi Manager), dữ liệu (`HO-120`) | `STALE` |
| `HO-11` | `US-01-01` AC-4, AC-17; thêm AC | AC-4: thông báo nêu *Manager suy ra từ trưởng phòng*; AC-17: vai suy ra từ trưởng phòng có hiệu lực; **thêm AC** *Finance tối đa một người giữ vai tại một thời điểm* (cấp vai `FINANCE` cho người thứ hai ⟹ từ chối) | `QĐ-52d`, BRD 4.1 | `WF-03 a_role, d_gate`; `UF-13 s_acct, d_gate` | Quyền; ràng buộc mới (`HO-127`) | `NEEDS_UPDATE` |
| `HO-12` | `US-01-04` danh sách tham số, AC-2, AC-7 | Thêm tham số do Super Admin cấu hình: **số ngày làm việc của hạn rà soát sau điều chuyển** (mặc định 5); hạn giữ gỡ khi nghỉ đột ngột (mặc định 1 ngày làm việc, `QĐ-62e`); số lần thử lại tác vụ, N/M ngày của lời mời chờ (`QĐ-62i`, `QĐ-62j` — giá trị chốt ở thiết kế kỹ thuật). AC-2 (*phiên bản thông báo*) sửa theo `QĐ-62q`: phiên bản mới **chỉ** buộc xác nhận lại khi Super Admin đánh dấu *cần xác nhận lại* (đổi loại dữ liệu/mục đích) | `FR-8.2`, `QĐ-50b`, `QĐ-62e`, `QĐ-62i`, `QĐ-62j`, `QĐ-62q` | `WF-03 a_cfg`; `UF-13 s_cfg`; `WF-05 s_task`; `MF-7 s_task` | Cấu hình | `NEEDS_UPDATE` |
| `HO-13` | `US-01-05` AC-4 | *Trưởng phòng gửi yêu cầu cho chính mình* ⟹ bước nhu cầu tới **Người duyệt chi**; nếu trưởng phòng là Người duyệt chi ⟹ approver dự phòng — thay vế *"quản lý cấp trên của M1"* | `QĐ-52c`, `FR-3.3`, `SoD-4` | `MF-2 s_route`; `WF-09 s_need`; `UF-04 d_own, b_own, r_uf15` | Quyền (định tuyến) | `NEEDS_UPDATE` |
| `HO-14` | `US-01-09` AC-3 | Thêm điều kiện không đủ điều kiện kế nhiệm: **đang là trưởng phòng** | `FR-8.7` | `WF-03 d_succ`; `UF-13 d_succ` | Quyền | `NEEDS_UPDATE` |
| `HO-15` | `US-02-02` (User Story, AC-1 → AC-10) | File nhân sự: cột bắt buộc **phòng ban** và **chức vụ**; Cost Center **suy ra** từ phòng (không còn cột Cost Center, không còn cột quản lý trực tiếp); AC-3 (*thiếu quản lý ⟹ approver dự phòng*) bỏ — thiếu phòng là **lỗi dòng**; AC-5 (*nhãn phòng ban*) bỏ; AC-7 đổi thành *mã phòng chưa có ⟹ lỗi dòng, không tự tạo*; AC-6/AC-10 so khác biệt theo tập cột mới — **tập cột chờ `HO-91`** | `FR-9.7`, `FR-2.1`, `FR-2.2`, `QĐ-52a`, `QĐ-52b`, `INV-20` | `WF-01 a_up, s_prev, a_conf, s_write, d_rej`; `WF-04 a_rec, d_valid, a_fix, s_org` | Dữ liệu (nhân viên–phòng có hiệu lực) | `STALE` |
| `HO-16` | `US-02-03` | Đổi thành *từ chối bản ghi thiếu phòng ban/chức vụ*; bỏ AC-3 (*thực tập sinh gắn Cost Center `Project`*) — nhà thầu/thực tập sinh thuộc **phòng họ làm việc** (BRD 4.5); AC-5 đổi sang mã phòng; giữ AC-4 (*không tạo Cost Center giữ chỗ*) | `FR-9.7`, `QĐ-52b`, BRD 4.5, `INV-14b`, `INV-20` | `WF-01 s_prev` (`FR-9.7`, `INV-20`); `WF-04 d_valid` | Dữ liệu | `STALE` |
| `HO-17` | `US-02-04` | Bước 1 checklist gồm **phòng ban (trưởng phòng, Cost Center, IT Admin phụ trách)** + nhân sự kèm phòng, chức vụ; Cost Center do Finance tạo trước; vị trí cấu hình bộ công cụ chuẩn (sau bước 3) | BRD 5.9, `FR-3.1`, `FR-3.17`, `FR-3.18` | `WF-01 a_cc, a_dept, a_up, a_heads, a_tool, c_cat, c_sub, a_seat` | Thứ tự khởi tạo | `NEEDS_UPDATE` |
| `HO-18` | `US-02-05` AC-7, thêm AC | AC-7: tài khoản dùng chung **của một phòng** ⟹ Cost Center `Unit` của phòng; **toàn công ty** và **tài khoản dịch vụ** ⟹ `Company` (hiện AC bắt buộc `Company` cho mọi loại); hiện trạng seat theo kiểu cấp (K1/K2/K4), K4 cần khóa trong kho; quyền phần mềm nội bộ ghi nhận **không** cần thuê bao; chỉ tài khoản email công ty | `QĐ-54d`, `QĐ-40d` (bị thay một phần), `FR-1.9`, `FR-2.9`, `FR-2.10`, `QĐ-49b` | `WF-01 a_seat`; `WF-19 s_acct` | Dữ liệu (`HO-122`, `HO-123`) | `NEEDS_UPDATE` |
| `HO-19` | `US-03-01` | Thay bằng *IT Admin ghi điều chuyển phòng (và/hoặc chức vụ) kèm ngày hiệu lực* (`BM-04`): giai đoạn phòng cũ đóng, mới mở; Cost Center suy ra; bước nhu cầu đang chờ xác định lại cho trưởng phòng mới (SLA không đặt lại); bước chi/IT giữ người; người được điều chuyển đang **chịu trách nhiệm** tài khoản dùng chung phải được thay **trước** ngày hiệu lực; tư cách **thành viên** tài khoản dùng chung của phòng cũ kết thúc tại ngày hiệu lực + việc đổi mật khẩu cho IT (`QĐ-62g`); đổi **chức vụ trong cùng phòng** không mở rà soát (`QĐ-62p`(3)). AC-1 (*đổi Cost Center trực tiếp*) bỏ; AC-4 (`QĐ-51`) đọc theo `QĐ-52a` (đổi trưởng phòng không đổi thành viên). Phần rà soát 5 ngày ở `HO-62` | `FR-2.2`, `QĐ-52a`, `QĐ-56a`, `QĐ-58d`, `QĐ-62g`, `QĐ-62p`, `FR-3.16` | `MF-7 a_rec, d_shared, a_resp, t_eff, s_period, s_reroute`; `WF-05 a_rec, d_head, d_succ, a_appoint, s_nohead, d_shared, a_resp, t_eff, s_period, s_reroute` | Dữ liệu, định tuyến | `STALE` |
| `HO-20` | `US-03-02` (AC-1, AC-2, AC-5) | Theo `QĐ-62a`: trưởng phòng tạo yêu cầu thay nhân viên **phòng mình** ⟹ **việc tạo thay ghi nhận bước nhu cầu đã xác nhận** (ghi *"trưởng phòng tạo thay"*, người tạo, người thụ hưởng, thời điểm), yêu cầu đi tiếp nhánh chi/IT. AC-2 cũ (*bước giao quản lý cấp trên*) **sai** — bỏ. Nếu trưởng phòng là người thụ hưởng ⟹ bước nhu cầu do Người duyệt chi; trưởng phòng là Người duyệt chi ⟹ approver dự phòng. Bộ công cụ chuẩn hiện trước, ngoài bộ phải có lý do. Yêu cầu theo nhóm ở `HO-63` | `QĐ-62a`, `QĐ-52c`, `QĐ-52e`, `FR-3.2`, `FR-3.18`, BRD 4.6 | `WF-04 d_head, s_kit, a_pick, a_onb, c_req`; `UF-21 s_kit, s_pick, s_why, s_onb, y_route`; `MF-2 a_req` | Quyền, trạng thái bước nhu cầu | `STALE` |
| `HO-21` | `US-03-04` AC-3, AC-7, AC-8, AC-11 → AC-15; thêm AC | AC-8: thay *quản lý kế nhiệm từng cấp dưới* bằng **chỉ định trưởng phòng mới hoặc ghi *chưa có người*** khi người rời là trưởng phòng; bàn giao dữ liệu **theo từng công cụ** dựa trên *lưu ý trước khi thu hồi*, trưởng phòng xác nhận *đã bàn giao/không cần* (`BM-08` bước 1) — không chặn thu hồi quá hạn; người rời là **người chịu trách nhiệm** tài khoản dùng chung ⟹ chỉ định người mới trước khi đóng hồ sơ; **không kế nhiệm license**; thứ tự `BM-08`; nghỉ đột ngột: chặn đăng nhập ngay, **chỉ gói có lưu ý mất dữ liệu** giữ gỡ ở nhà cung cấp chờ xác nhận hoặc tới hạn (mặc định 1 ngày làm việc), trong lúc giữ seat vẫn tính phí và hiện `G2` (`QĐ-62e`); phòng thiếu trưởng phòng ⟹ việc xác nhận chờ, hết hạn thì gỡ (`QĐ-62c`); hồ sơ xong khi việc đổi mật khẩu dùng chung **đã được tạo** (`QĐ-62p`(2)) | `FR-2.12`, `QĐ-56b`, `QĐ-56c`, `QĐ-58d`, `QĐ-62c`, `QĐ-62e`, `QĐ-62p`, `BM-04`, `BM-08` | `MF-5 a_hand, d_head, a_newhead, d_shared, a_resp, s_list, a_data, t_due, d_conf, s_alert, a_left, s_block, s_tasks, d_hc, s_over, c_reclaim, a_lock, s_close`; `WF-07` cùng nhóm node + `d_notice, a_sudden, s_ask`; `UF-09 s_impact, d_head, s_newhead, s_resp, s_sudden, y_ask2, d_hc, s_over, s_lock` | Trạng thái nghỉ việc, dữ liệu (`HO-120`, `HO-128`) | `NEEDS_UPDATE` |
| `HO-22` | `US-03-05` AC-1, AC-2, thêm AC | Nhắc T−7 gửi **Employee**, trưởng phòng và IT Admin (danh mục cảnh báo); yêu cầu gia hạn gửi **trước** ngày kết thúc ⟹ quyền **giữ nguyên tới khi có quyết định**, IT giữ mục trong hàng đợi, bước chờ chạy SLA; từ chối/rút ⟹ IT thu hồi; gửi **sau** ngày kết thúc là yêu cầu mới, không dừng thu hồi | `FR-2.8`, `FR-5.14`, `QĐ-62h` | `WF-08 t_rem, s_notify, e_first, d_first, s_queue, d_pend, e_dec, d_dec, s_upd, c_rec`; `WF-11 a_ext, c_appr` | Trạng thái quyền có thời hạn | `NEEDS_UPDATE` |

### 4.2. EP-04 — danh mục, gói, thuê bao

| Mã | Đích | Việc cần đổi | Nguồn | Sơ đồ / node | Tác động | Trạng thái |
| --- | --- | --- | --- | --- | --- | --- |
| `HO-23` | `US-04-01` (User Story, AC-1, AC-8) | Danh mục gồm SaaS trả phí, phần mềm thương mại có bản quyền, **phần mềm nội bộ** (nhà cung cấp **không bắt buộc**, đăng ký cùng Business Owner, không qua Người duyệt chi); **từ chối** thêm phần mềm miễn phí bên ngoài; AC-8 (*ngừng sử dụng*): **bị chặn** tới khi mọi Assignment đã thu hồi và thuê bao đã hủy/hết hạn, hệ thống liệt kê thứ đang chặn | `QĐ-49a`, `QĐ-49b`, `QĐ-49h`, `QĐ-50a`, `FR-1.1`, `QĐ-62n` | `WF-02 d_type, end_free, a_reg, a_bo, d_bo, a_flag, d_int, e_ret, a_ret, a_stat` | Dữ liệu (`HO-122`, `HO-129`) | `NEEDS_UPDATE` |
| `HO-24` | `US-04-02` | Gói khai thêm **kiểu cấp K1–K5**, **mức kiểm soát mặc định** (*Đầy đủ / Một phần / Không kiểm soát được*), **lưu ý trước khi thu hồi**; khuyến nghị K2 từ 3 người (không chặn); phần mềm nội bộ có **gói K5** *cấp thủ công, không đếm seat* (mô hình giá không áp dụng) | `FR-1.9`, `QĐ-54a`, `QĐ-53c` | `WF-02 a_plan, d_int, a_k5` | Dữ liệu (`HO-124`) | `NEEDS_UPDATE` |
| `HO-25` | `US-04-03` AC-2 → AC-4 | **License vĩnh viễn**: không có ngày kết thúc/gia hạn/hạn chót/tự gia hạn, không cảnh báo `FR-1.4`; thuê bao không có hạn chót, không có số ngày báo trước **và không tự gia hạn** ⟹ cảnh báo T−15/T−7 **theo ngày kết thúc**, ghi *"theo ngày kết thúc"* (AC-3 hiện chỉ có ca tự gia hạn); hồ sơ thuế nhà cung cấp có trước khi nhập giá | `QĐ-49c`, `FR-1.3`, `FR-1.4`, `QĐ-62l`, `FR-5.13` | `WF-02 d_perp, a_perp, a_term, s_alert, a_tax`; `WF-15 d_dl, s_der, s_dq` | Dữ liệu (`HO-126`) | `NEEDS_UPDATE` |
| `HO-26` | `US-04-04` AC-6 | Mục đích tệp thêm: **chứng từ thuế nộp thay**, bản ký `BM-06`, chứng từ mua `BM-05` (báo giá, hợp đồng, hóa đơn); quyền xem theo `FR-1.5` | `FR-1.5`, `FR-5.13` mục 3, `BM-05`, `BM-06` | `WF-02 a_doc`; `WF-18 a_store`; `UF-16 s_store` | Dữ liệu tệp | `NEEDS_UPDATE` |
| `HO-27` | `US-04-09` (User Story, AC-1, AC-3, AC-4) | Loại Cost Center chỉ còn **`Unit`, `Company`** (bỏ `Project` — AC-1 ví dụ `PRJ-ALPHA` sai); mỗi phòng gắn **đúng một** `Unit` (1–1), Cost Center phải có **trước** khi tạo phòng; đổi tên phòng/đổi trưởng phòng không đổi Cost Center; tách/gộp ⟹ Cost Center mới, cũ ngừng dùng; AC-3 *còn nhân viên* đọc qua phòng | `QĐ-52b`, `FR-3.1`, `OI-04` | `WF-01 a_cc`; `WF-20 a_cc`; `UF-11 s_cc` | Dữ liệu (`HO-121`) | `STALE` |

### 4.3. EP-05, EP-06 — yêu cầu, phê duyệt, duyệt chi

| Mã | Đích | Việc cần đổi | Nguồn | Sơ đồ / node | Tác động | Trạng thái |
| --- | --- | --- | --- | --- | --- | --- |
| `HO-28` | `US-05-01` AC-1, AC-5; `US-05-02` | Bộ công cụ chuẩn (phòng × chức vụ) hiện trước; ngoài bộ **bắt buộc lý do** và gắn cờ cho trưởng phòng; xem trước chi phí **giá trước thuế · thuế ước tính (tách được/không được khấu trừ) · chi phí ước tính · tổng phải trả ước tính**; chuỗi duyệt hiện trưởng phòng / Người duyệt chi (trưởng phòng tự gửi) / approver dự phòng (phòng chưa có trưởng phòng); `US-05-02`: loại *cá nhân / dùng chung*, Cost Center **lấy theo phòng** (không chọn), dự án chỉ là ngữ cảnh, phiếu `BM-01` | `FR-3.2`, `FR-3.18`, `FR-5.13` mục 2, `QĐ-52c`, `QĐ-52e`, `BM-01` | `UF-01 s_mine, d_set, s_why, s_detail, s_review, s_submit`; `MF-2 a_req`; `WF-09 a_sub` | Dữ liệu yêu cầu (`HO-112`) | `NEEDS_UPDATE` |
| `HO-29` | `US-05-03` (cả Story) | Viết lại định tuyến bước nhu cầu: **trưởng phòng của người yêu cầu**; trưởng phòng tự gửi ⟹ **Người duyệt chi**; trưởng phòng đó là Người duyệt chi ⟹ approver dự phòng; phòng **chưa có** trưởng phòng ⟹ approver dự phòng; yêu cầu do trưởng phòng tạo thay ⟹ bước nhu cầu ghi nhận đã xác nhận (`QĐ-62a`); bỏ *"lên cấp trên một bậc"*. AC-4 (*dự phòng trùng người yêu cầu ⟹ chờ có kiểm soát*) giữ | `QĐ-52c`, `QĐ-62a`, `FR-3.3`, `FR-3.6`, `FR-3.12` | `MF-2 s_route`; `WF-09 s_need, d_valid, s_wait`; `UF-04 d_own, b_own, r_uf15`; `UF-21 y_route` | Quyền, trạng thái `ApprovalStep` | `STALE` |
| `HO-30` | `US-05-04` | Người quyết là **trưởng phòng** (hoặc Người duyệt chi khi trưởng phòng tự gửi — Story phải cho phép vai này ở bước nhu cầu); phạm vi = nhân viên trong phòng; hiện cờ *ngoài bộ chuẩn* và lý do; quyết định lưu là **bản ghi phê duyệt điện tử** (người, vai tại thời điểm, thời điểm, quyết định, lý do); tác vụ có trên **Mobile** (`HO-84`); bản tóm tắt AI là Story riêng (`HO-82`) | `QĐ-52c`, `QĐ-53a`, `FR-3.7`, `FR-3.18`, `QĐ-61b` | `WF-09 a_need, d_need`; `MF-2 a_need, d_need`; `UF-04 s_queue, s_detail, d_flag, s_flag, s_decide, d_dec, s_rej` | Quyền | `NEEDS_UPDATE` |
| `HO-31` | `US-05-05` | Nhánh (a) gồm **phần mềm nội bộ đã có trong danh mục, không phí**: Employee → trưởng phòng → IT cấp thủ công kèm bằng chứng, **không** kiểm sức chứa seat, **không** tạo cam kết | `QĐ-50a`, `FR-3.4` (a) ghi chú 2, `FR-2.3` | `MF-2 d_branch [a: no new cost] → m_free`; `WF-09 d_br, d_seat [seat free or not counted]` | Trạng thái Request | `NEEDS_UPDATE` |
| `HO-32` | `US-05-06` (cả Story; AC-2 mâu thuẫn trực tiếp) | AC-2 *"Miễn phí vẫn qua Người duyệt chi"* **trái** `QĐ-49h` ⟹ công cụ miễn phí bên ngoài: **IT đóng yêu cầu** kèm lý do, không qua Người duyệt chi, không vào danh mục. Thêm: phân loại *miễn phí bên ngoài / nội bộ / trả phí-có bản quyền*; nội bộ ⟹ IT đăng ký cùng Business Owner rồi đi đường không phí; trả phí ⟹ **cổng mức kiểm soát** (*không kiểm soát được* ⟹ IT từ chối ngay, báo Employee và trưởng phòng, lý do bắt buộc, gợi ý thay thế, không tới Người duyệt chi; *một phần* đi tiếp và hiện cho Người duyệt chi); tài khoản dùng chung trên gói cấm chia sẻ ⟹ từ chối ở bước đánh giá (`FR-2.11`); hồ sơ `BM-02`. Có thể tách thành `HO-64`/`HO-65`/`HO-66` | `QĐ-49h`, `QĐ-50a`, `QĐ-53c`, `QĐ-58d`, `FR-3.19`, `FR-2.11`, `BM-02` | `WF-10 a_bm02, d_type, a_close, a_reg, d_ctrl, d_share, a_rej, s_nrej, d_sens, a_bo, a_hand`; `MF-2 c_assess, d_kind, a_close, a_reg, d_ctrl, a_rej`; `UF-02 y_it, d_ass, s_closed, s_rej, d_alt, d_path, y_int` | Trạng thái Request (kết cục *đóng*, *IT từ chối*) | `STALE` |
| `HO-33` | `US-05-09` AC-1, AC-4 | *Thông báo cấp trên*: cấp trên của nhân viên là **trưởng phòng**, của trưởng phòng là **Người duyệt chi**; Người duyệt chi không có cấp trên được quy định (ghi giới hạn, không tự đặt) | `FR-3.8`, `QĐ-52c` | `WF-09 e_sla, s_remind`; `WF-15 e_sla, s_rem` | Thông báo | `NEEDS_UPDATE` |
| `HO-34` | `US-05-12` (User Story, AC-1, AC-5) | Sự kiện kích hoạt xác định lại: **phòng của người yêu cầu đổi** · **trưởng phòng của phòng đó đổi** · người được giao *đã nghỉ việc* · Super Admin đổi người giữ vai — thay *"`manager_id` đổi"*; việc của trưởng phòng đang chờ chuyển cho trưởng phòng mới, hạn không đặt lại (`QĐ-62c`) | `FR-3.16`, `QĐ-28d`, `QĐ-52a`, `QĐ-62c` | `WF-09 e_data, s_redet`; `WF-05 s_reroute`; `MF-7 s_reroute`; `WF-03 s_redet`; `UF-13 y_redet` | Trạng thái `ApprovalStep` | `STALE` |
| `HO-35` | `US-05-13` | Trưởng phòng (không phải *Manager trực tiếp*) xác nhận *không còn nhu cầu* (`BM-03`); **bàn giao bản nhẹ**: hiện *lưu ý trước khi thu hồi*, **người kích hoạt** (nhân viên tự trả / trưởng phòng) xác nhận trước khi gỡ ở nhà cung cấp, không chặn sau hạn ngắn; Employee nhận cảnh báo *thu hồi sắp thực hiện* | `QĐ-62f`, `FR-5.14`, BRD 4.6, `BM-03` | `WF-11 d_start, a_ret, a_dh, s_rec, c_rec, d_res, s_done, a_fail` | Trạng thái thu hồi | `NEEDS_UPDATE` |
| `HO-36` | `US-05-15` | Thêm kết cục được thông báo: *đóng — công cụ miễn phí bên ngoài*, *IT từ chối ở cổng mức kiểm soát* (kèm phương án thay thế), *tác vụ thất bại chỉ là cuối khi IT đóng* (`QĐ-62i`); thông báo theo **danh mục cảnh báo duy nhất**; hộp thông báo trong ứng dụng có trên **Mobile**, không push | `FR-3.11`, `FR-5.14`, `QĐ-57a`, `QĐ-62i`, `QĐ-61b`(4), `QĐ-61c` | `UF-01 s_track, s_time, d_res`; `UF-02 s_closed, s_rej`; `WF-10 s_nrej`; `MF-2 s_done, s_fail` | Thông báo | `NEEDS_UPDATE` |
| `HO-37` | `US-06-01`, `US-06-05`, `US-06-06`, `US-06-09` | Snapshot, khoản cam kết, Budget vs Actual tính trên **chi phí thực chịu** (giá + thuế **không** được khấu trừ + phí thẻ/chênh lệch tỷ giá); GTGT được khấu trừ ở **cột riêng**; `US-06-01`: hiện **mức kiểm soát/rủi ro** (nhánh c) và lưu bản ghi phê duyệt điện tử; tác vụ có trên **Mobile** với snapshot chỉ đọc (`QĐ-61b`(3)); `US-06-06`: khớp hóa đơn chuyển phần **chi phí thực chịu** tương ứng; `US-06-09`: Finance **được sửa ngân sách giữa kỳ** với lý do bắt buộc, có lịch sử, snapshot đã chụp giữ nguyên, Người duyệt chi được báo; **không khóa kỳ** (`QĐ-62m`) | `QĐ-60a`, `FR-5.13`, `FR-3.14`, `FR-5.1`, `FR-5.8`, `QĐ-53a`, `QĐ-53c`, `QĐ-62m`, `QĐ-61b` | `MF-2 s_snap, a_spend, d_spend, s_commit, a_fin`; `WF-09 s_snap, a_dec, s_com, a_rec`; `WF-20 a_bud, s_upd, a_rec`; `UF-11 s_op, s_bud`; `UF-15 s_req` | Dữ liệu tiền (`HO-112`, `HO-134`) | `NEEDS_UPDATE` |
| `HO-38` | `US-06-04` AC-1, AC-4 | AC-4 *"nhánh (c) miễn phí được duyệt"* **không còn tồn tại** (miễn phí bên ngoài bị đóng; nội bộ không qua bước chi) — bỏ; khoản cam kết ghi **chi phí ước tính** (chi phí thực chịu), không phải giá niêm yết | `QĐ-49h`, `QĐ-50a`, `QĐ-60a`, `FR-5.8` | `MF-2 s_commit, f_par`; `WF-09 s_com`; `UF-15 y_app` | Dữ liệu cam kết | `STALE` |

### 4.4. EP-07 → EP-09 — cấp phát, usage, thiết bị

| Mã | Đích | Việc cần đổi | Nguồn | Sơ đồ / node | Tác động | Trạng thái |
| --- | --- | --- | --- | --- | --- | --- |
| `HO-39` | `US-07-01`, `US-07-02` | Cấp theo **kiểu cấp của gói** (K1 mua trên tài khoản công ty; K2 thêm vào workspace do IT làm owner; K4 gán khóa từ kho; K5 thủ công kèm bằng chứng); **chỉ tài khoản email công ty**; hàng đợi giao mặc định **IT Admin phụ trách phòng**, IT Admin khác xử lý thay có Audit Trail; quyền nội bộ không chọn thuê bao, không giữ chỗ seat | `FR-1.9`, `FR-2.3`, `FR-2.9`, `FR-2.10`, `FR-3.17`, `QĐ-54a`, `QĐ-54c`, `QĐ-58b`, `QĐ-49b` | `WF-09a s_task, d_ch, a_man, d_man`; `MF-2 c_prov`; `UF-08 s_queue, d_ch, s_card, d_k4, s_key, s_done` | Quyền IT, dữ liệu (`HO-122`, `HO-125`) | `NEEDS_UPDATE` |
| `HO-40` | `US-07-03`, `US-07-04` | `US-07-04`: lỗi vĩnh viễn/hết lượt ⟹ IT chọn **thử lại** cùng kênh, **chuyển làm tay** kèm bằng chứng, hoặc **đóng thất bại** (lý do bắt buộc); **chỉ khi đóng** Request/Assignment mới thất bại, cam kết giải phóng, người yêu cầu được báo; thu hồi lỗi thì `G2`/lãng phí vẫn hiện. `US-07-03`: lời mời chưa chấp nhận ⟹ seat vẫn chiếm, đối soát hằng ngày tiếp tục, sau **N** ngày nhắc nhân viên và IT, sau **M** ngày IT được thu lại lời mời và đóng thất bại (N, M cấu hình) — Story vẫn `RESEARCH-DEPENDENT` cho phần ghi qua connector (`TE-11b`, giai đoạn Tools) | `QĐ-62i`, `QĐ-62j`, `FR-2.5`, `FR-5.8`, `INV-01` | `WF-09a d_api, s_retry, s_err, d_pend, s_pend`; `UF-08 d_api, y_retry, b_err, d_fix, s_close, t_fail, d_pend, y_pend`; `MF-2 d_prov, s_fail` | Trạng thái `ProvisioningTask` (`HO-128`) | `NEEDS_UPDATE` |
| `HO-41` | `US-07-05` AC-1, thêm AC | Thu hồi theo kiểu cấp (K1 hủy gia hạn + khóa tài khoản công ty; K2 gỡ thành viên; K4 gỡ kích hoạt, **khóa về kho** nếu điều khoản cho chuyển máy, không thì *ngừng dùng*; K5 thủ công kèm bằng chứng); thành viên tài khoản dùng chung rời ⟹ tạo việc **đổi mật khẩu/thiết bị xác thực**; nguồn thu hồi thêm: *sau điều chuyển (trưởng phòng mới)*, *giảm số lượng/hủy ở gia hạn*, *không duyệt hợp thức hóa*; bàn giao bản nhẹ trước khi gỡ (`QĐ-62f`); giữ gỡ khi nghỉ đột ngột (`QĐ-62e`) | `FR-2.4`, `FR-2.10`, `FR-2.11`, `QĐ-54b`, `QĐ-54d`, `QĐ-62e`, `QĐ-62f` | `WF-09a d_op, s_free, d_shr, s_rot`; `UF-08 y_free, d_shr, y_rot, s_rot`; `MF-7 c_revoke`; `MF-4 c_all, c_excess`; `WF-17 c_recl` | Trạng thái Assignment/khóa (`HO-125`, `HO-128`) | `NEEDS_UPDATE` |
| `HO-42` | `US-07-07` | Kết cục hồ sơ sai lệch: **giữ mở chờ bằng chứng** khi chưa xác minh nguyên nhân; *nhà cung cấp tính sai* ⟹ đóng kèm **ghi chú xác minh của Finance**, hóa đơn vẫn là chi thực tế, điều chỉnh đến sau bằng hóa đơn mới; *mua đã duyệt nhưng thuê bao chưa ghi* ⟹ **IT Admin** cập nhật thuê bao theo căn cứ, Finance đính hóa đơn, **IT Admin đóng hồ sơ**; *truy cập ngoài quy trình* ⟹ hợp thức hóa/thu hồi; *tài khoản nhà cung cấp khác quyết định* ⟹ cấp lại/thu hồi; chênh lệch **chỉ do thuế/tỷ giá** không mở hồ sơ. | `QĐ-49f`, `QĐ-62b`, `QĐ-34a`, `QĐ-34b`, `FR-5.4`, `FR-7.7`, `FR-5.13` | `WF-16 d_var, s_tax, s_open, a_invs, d_ver, s_keep, d_cause, d_gap, a_berr, c_leg, a_upd, c_exec, a_close`; `MF-8 d_var, s_tax, s_disc, c_inv, d_ver, d_cause, a_updsub, a_billerr, c_leg`; `UF-14 d_ver, t_open, d_cause, s_berr, d_gap, y_upd, s_close` | Trạng thái `Discrepancy` (`HO-110`) | `NEEDS_UPDATE` |
| `HO-43` | `US-08-06`, `US-08-08`, `US-09-06`, `US-09-09` (ghi chú cho `US-09-02`, `US-09-05`) | Nguồn đặc tả bộ thu thập (`FR-4.17`, `FR-4.19`, `FR-4.20`, BRD 6.3.1 cũ, ràng buộc connector GitHub) **chuyển nguyên văn** sang [tệp nghiên cứu tool & vendor](../Research-AI/tool-vendor-usage-research-backlog.md); loại bộ thu thập và mức hiện thực **chốt lại ở giai đoạn Tools**; nội dung Story giữ làm **giả định hiện tại**; phương pháp usage đang nghiên cứu lại (`QĐ-57d`) | `QĐ-59a`, `QĐ-59c`, `QĐ-57d` | `WF-12 s_feed` (`FR-4.3a`, `DQ-04`); `WF-18 c_wf12`; `WF-13 d_col` (`FR-4.14a`) | Truy vết; chưa đổi hành vi | `NEEDS_UPDATE` |
| `HO-44` | `US-09-01`, `US-09-03` | **Sổ thiết bị**: mã tài sản, hệ điều hành, tên máy, người giữ, khoảng hiệu lực; **không lưu IP**; máy cá nhân và máy dùng chung **không** đăng ký; khi bàn giao máy, nhân viên **ký `BM-06` "xác nhận đã biết rõ"** (không gọi *đồng ý*), IT lưu bản ký, rồi xác nhận lại trong hệ thống; chưa xác nhận ⟹ không nhận dữ liệu + **cảnh báo IT Admin**; `US-09-03` AC-3: chỉ phiên bản đánh dấu *cần xác nhận lại* mới dừng nhận dữ liệu (`QĐ-62q`) | `FR-4.21`, `QĐ-57b`, `QĐ-58f`, `QĐ-62q`, `FR-4.18`, `INV-17`, Phụ lục D.2 | `WF-18 a_reg, d_dev, end_not, a_hand, a_sign, a_store, s_notice, d_ack, s_rec, s_alert`; `UF-16 s_reg, d_dev, b_per, s_hand, s_sign, s_store, s_notice, d_ack, b_noack` | Dữ liệu cá nhân (`HO-109`) | `NEEDS_UPDATE` |

### 4.5. EP-10 → EP-15 — lãng phí, gia hạn, chi tiêu, đối soát, quyền dữ liệu, AI

| Mã | Đích | Việc cần đổi | Nguồn | Sơ đồ / node | Tác động | Trạng thái |
| --- | --- | --- | --- | --- | --- | --- |
| `HO-45` | `US-10-06`, `US-10-07`, `US-12-05` AC-4, `US-14-05` AC-3 | Phạm vi **trưởng phòng = nhân viên trong phòng** (không *cấp dưới trực thuộc*); `US-10-06`: chọn *Thu hồi* ⟹ báo Employee *thu hồi sắp thực hiện*; đổi sang *Giữ/Miễn trừ* sau khi IT trả lại ⟹ báo *"thu hồi đã hủy"* (`QĐ-62p`(1)); phòng thiếu trưởng phòng ⟹ xác nhận **chờ, không giao ai**, IT/Super Admin thấy cảnh báo (`QĐ-62c`); `US-10-07`: bàn giao bản nhẹ do **trưởng phòng** xác nhận trước khi gỡ (`QĐ-62f`); `US-12-05`: báo cáo hiệu suất **theo ứng dụng và theo phòng ban** | `FR-3.7`, `FR-3.10`, `FR-5.10`, `FR-5.14`, `QĐ-52a`, `QĐ-57a`, `QĐ-62c`, `QĐ-62f`, `QĐ-62p` | `WF-13 a_view, d_att, a_ex, s_notify, d_it, a_ret, c_reclaim, s_acc`; `UF-05 s_list, d_choice, s_rec, y_notify, d_ret`; `UF-10 y_sent, d_att, d_block` | Quyền xem, thông báo | `NEEDS_UPDATE` |
| `HO-46` | `US-11-01`, `US-11-02`, `US-11-03` | `US-11-01`: chỉ áp cho **thuê bao/khoản mua có thời hạn** (không license vĩnh viễn, không phần mềm nội bộ); thêm mốc *theo ngày kết thúc* (`QĐ-62l`); `US-11-02`: snapshot theo **chi phí thực chịu**; đề xuất của IT có checklist điều khoản (`HO-81`); tác vụ **chỉ trên web** (`QĐ-61b`); quyết định ghi **sau hạn chót** không bị hủy — thực hiện từ lúc còn làm được (giữa kỳ nếu gói cho phép, không thì kỳ kế tiếp); `US-11-03`: tới hạn chót mà đã quyết nhưng **chưa ghi kết quả thực hiện** ⟹ cảnh báo IT và Người duyệt chi + cờ **thực hiện trễ** (không tính `KPI-4`); kết quả nhà cung cấp khác quyết định ⟹ ghi **kết quả thực tế**, tiết kiệm chỉ khi chi phí giảm thật; mốc T−7 **bỏ qua** khi cả quyết định lẫn kết quả thực hiện đã ghi (`QĐ-62t`); quyết định gia hạn **không tạo khoản cam kết** — chi phí kỳ gia hạn ở dự báo L1 (`QĐ-62s`) | `QĐ-49c`, `QĐ-62k`, `QĐ-62l`, `QĐ-60a`, `FR-1.3`, `FR-1.4`, `FR-3.13`, `FR-4.15`, `DQ-07`, `QĐ-62s`, `QĐ-62t` | `WF-15 d_dl, t15, s_a15, d_t7, a_terms, a_prop, s_snap, a_dec, d_dec, a_exec, d_sav, s_save, t_dead, d_end`; `MF-4 s_check, a_prop, a_dec, d_dec, a_exec, s_save`; `UF-20 s_prop, d_made, s_exec, d_sav`; `UF-15 s_ren, s_rdec, y_ren, t_ren` | Trạng thái gia hạn (`HO-111`, `HO-126`) | `NEEDS_UPDATE` |
| `HO-47` | `US-12-01` (User Story, AC-3, AC-4, AC-7) | Chiều gom: **Cost Center, phòng ban, ứng dụng, nhà cung cấp** — bỏ *dự án* (không phải Cost Center) và *cây người phụ trách* (AC-4); AC-3 chia **theo ngày** khi điều chuyển (mỗi ngày vào Cost Center có hiệu lực của ngày đó; hóa đơn theo ngày hóa đơn), không theo tháng; mọi số so ngân sách theo **chi phí thực chịu**, GTGT được khấu trừ cột riêng; dòng **"Chưa phân bổ Cost Center"**; AC-7 phạm vi trưởng phòng = phòng mình; báo cáo đã phát hành là **bản chụp bất biến**, khoản đến muộn hiện ở kỳ sau nhãn *điều chỉnh kỳ trước* (`QĐ-62m`) | `FR-5.1`, `FR-5.2`, `FR-5.3`, `QĐ-55b`, `QĐ-60a`, `QĐ-50c`, `QĐ-52a`, `QĐ-62m` | `WF-19 d_type, d_basis, s_unal, d_alloc, s_ratio, s_seat, s_acct, s_bases, s_report`; `UF-19 s_alloc, s_bva`; `MF-8 s_alloc, s_report` | Dữ liệu báo cáo | `STALE` |
| `HO-48` | `US-12-02` | Finance ghi hóa đơn với **từng dòng thuế đúng chứng từ** (loại, tỷ lệ, số tiền, *nhà cung cấp thu* / *doanh nghiệp nộp thay*, **được khấu trừ có/không** — mặc định theo hồ sơ thuế, Finance sửa theo chứng từ); chênh lệch do thuế/tỷ giá/phí ghi riêng, **không** mở `Discrepancy`; *nhà cung cấp tính sai* theo `HO-42` | `FR-5.13`, `FR-5.4`, `QĐ-55a`, `QĐ-60a`, `QĐ-60b`, `QĐ-49f` | `WF-16 a_inv, s_match, d_var, s_tax`; `MF-8 a_inv, s_match, d_var, s_tax` | Dữ liệu (`HO-106`) | `NEEDS_UPDATE` |
| `HO-49` | `US-13-05`, `US-13-06` | IT đánh giá **mức kiểm soát chỉ là đầu vào** — cổng *không kiểm soát được* **không** áp cho hợp thức hóa; bối cảnh của **trưởng phòng** (không *Manager theo cây*) chỉ hỏi khi khoản chi gắn được với nhân viên một phòng, **không chặn** — Người duyệt chi quyết được khi chưa có (`QĐ-62d`); phòng chưa có trưởng phòng ⟹ yêu cầu bối cảnh **treo, không giao ai**, chuyển cho trưởng phòng mới khi được bổ nhiệm (`QĐ-62c`); hồ sơ `BM-07`; hợp thức hóa: thêm vào danh mục kèm gói/kiểu cấp, cấp cho người đang dùng **trên tài khoản công ty** (tài khoản cá nhân được công ty trả tiền không được ghi thành Assignment) | `QĐ-58d`, `QĐ-62d`, `QĐ-62c`, `FR-6.9`, `FR-3.4c-1`, `FR-2.9`, `BM-07` | `WF-17 a_it, a_dh, d_out, a_cat, c_prov, c_recl, s_drec`; `UF-12 s_find, y_ctx, r_uf15b, d_out, s_cat, r_prov, r_recl`; `UF-15 s_rc, s_rcdec, y_rc, t_rc` | Quyền, dữ liệu | `NEEDS_UPDATE` |
| `HO-50` | `US-13-07` AC-9, thêm AC | Phần khoản chi **không được hóa đơn nào giải thích**: vẫn là thực chi, không đếm hai lần; có căn cứ ⟹ đặt theo căn cứ (thuê bao ⟹ quy tắc phân bổ của thuê bao; cam kết ⟹ Cost Center của yêu cầu, **không** đổi trạng thái cam kết); chưa có căn cứ ⟹ dòng **"Chưa phân bổ Cost Center"**, mục ngoại lệ **vẫn mở** tới khi Người duyệt chi chấp nhận/không; phí thẻ/chênh lệch tỷ giá vào chi phí thực chịu | `QĐ-50c`, `FR-5.2`, `FR-5.4`, `FR-5.13` mục 4, `FR-9.7` | `WF-17 s_link, s_rec, d_stat, s_exc, s_unal, a_fin, a_itx, d_exr, a_berr, a_sach`; `WF-19 d_basis, s_req, s_unal`; `UF-12 s_exc, d_exr, r_uf15a` | Dữ liệu tiền (`HO-133`) | `NEEDS_UPDATE` |
| `HO-51` | `US-15-02`, `US-15-03`, `US-15-04` (EP-15 trạng thái Epic) | `US-15-03` (*diễn giải chi phí*, `DEFERRED`) **mâu thuẫn** `QĐ-49e`(2)/`QĐ-61e` (tính năng **cam kết**) — thay bằng Story ở `HO-83`; `US-15-04` (*tóm tắt tình trạng license của cấp dưới*, `DEFERRED`, theo cây `QĐ-23`) **khác** tính năng cam kết `QĐ-49e`(1) (*tóm tắt request đang chờ mình duyệt*) — đóng/thay bằng `HO-82`; `US-15-02` (RAG hợp đồng): `QĐ-61e` loại khỏi phạm vi cam kết ⟹ chuyển sổ ngoài phạm vi hoặc ghi rõ *không thuộc phạm vi*. **`US-15-01` giữ nguyên, tách riêng**: chưa qua cổng chất lượng, đang ẩn, không tính là tính năng AI mới | `QĐ-49e`, `QĐ-61e`, `QĐ-37`, `QĐ-59c` | `MF-2 a_need`; `MF-8 d_ai, s_ai, a_edit`; `WF-17a d_ai, a_ai` (chỉ `US-15-01`) | Phạm vi AI | `STALE` |

---

## 5. Story còn thiếu (`MISSING`)

| Mã | Story đề xuất (tên tạm) | Hành vi phải có | Nguồn | Sơ đồ / node | Tác động | Trạng thái |
| --- | --- | --- | --- | --- | --- | --- |
| `HO-60` | Quản lý hồ sơ phòng ban và trưởng phòng có hiệu lực (EP-03) | Tạo/đổi tên/ngừng phòng (một cấp phẳng); hồ sơ: mã, tên, chức năng, Cost Center `Unit` 1–1, IT Admin phụ trách, danh sách dự án **chỉ mô tả**; gán/đổi trưởng phòng có hiệu lực (`INV-19` hai chiều); Super Admin không làm trưởng phòng; *công cụ đang dùng của phòng* là giá trị tổng hợp; cảnh báo **phòng thiếu trưởng phòng / IT Admin phụ trách**; phòng thiếu trưởng phòng ⟹ việc ngoài bước nhu cầu **chờ**, chuyển cho trưởng phòng mới khi có, hạn không đặt lại | `FR-3.1`, `FR-3.17`, `QĐ-52a`, `QĐ-52d`, `QĐ-58a`, `QĐ-62c`, `FR-8.7`, `INV-19` | `WF-01 a_dept, a_heads`; `WF-05 a_appoint, s_nohead`; `WF-07 a_newhead`; `UF-21 s_dept`; FDD `1.1`, `1.2` | Dữ liệu tổ chức, quyền Manager | `MISSING` |
| `HO-61` | Bộ công cụ chuẩn theo phòng × chức vụ (EP-04/05) | IT Admin cấu hình theo đề xuất trưởng phòng và được chủ động cập nhật; lý do bắt buộc, Audit Trail, **thông báo trưởng phòng**; hiện trước khi tạo yêu cầu; không tự cấp/thu hồi; không AI; đổi chức vụ trong cùng phòng không mở rà soát, bộ mới chỉ áp cho yêu cầu mới | `FR-3.18`, `QĐ-52e`, `QĐ-58c`, `QĐ-62p`(3) | `WF-01 a_tool`; `WF-04 s_kit`; `UF-01 s_mine, d_set`; `UF-21 s_kit`; FDD `1.5` | Dữ liệu | `MISSING` |
| `HO-62` | Trưởng phòng mới rà soát công cụ ngoài bộ chuẩn sau điều chuyển (EP-03) | Công cụ thuộc bộ chuẩn phòng mới ⟹ giữ; ngoài bộ ⟹ trưởng phòng **mới** quyết *còn cần / không còn cần / cần công cụ mới* trong **5 ngày làm việc** (cấu hình); quá hạn chỉ **nhắc trưởng phòng + cảnh báo IT**, không tự thu hồi; quyền giữ tới khi có quyết định; *không còn cần* ⟹ bàn giao bản nhẹ (`QĐ-62f`) rồi IT thu hồi; phòng nhận chưa có trưởng phòng ⟹ chờ (`QĐ-62c`); chi phí chia theo ngày | `QĐ-50b`, `QĐ-56a`, `QĐ-62c`, `QĐ-62f`, `FR-3.8`, `FR-3.18`, `QĐ-55b` | `MF-7 s_compare, d_out, s_keepall, s_task, a_review, t_due, d_choice, d_open, c_revoke, c_req, s_remind`; `WF-05` cùng tên node; `UF-18` toàn bộ | Trạng thái việc rà soát (`HO-117`) | `MISSING` |
| `HO-63` | Trưởng phòng gửi yêu cầu theo nhóm cho gói team (EP-05) | Một yêu cầu kèm danh sách người (thành viên phòng mình) ⟹ **mỗi người một Assignment**; bước nhu cầu ghi nhận đã xác nhận do trưởng phòng tạo thay; trưởng phòng có tên trong danh sách ⟹ phần đó tới Người duyệt chi; kết cục theo từng người | `QĐ-54d`, `QĐ-62a`, `FR-2.11`, `FR-3.2` | `WF-04 d_kind, a_grp`; `UF-21 d_kind, s_grp, s_submit, y_route, s_track`; FDD `4.2` | Dữ liệu yêu cầu (`HO-112`) | `MISSING` |
| `HO-64` | IT đánh giá mức kiểm soát và từ chối phần mềm không kiểm soát được (EP-05) | Xem `HO-32`; kết luận mức kiểm soát trong `BM-02`; *không kiểm soát được* ⟹ từ chối ngay, lý do bắt buộc, gợi ý thay thế, báo Employee + trưởng phòng; Employee gửi yêu cầu mới nếu chọn thay thế | `FR-3.19`, `QĐ-53c`, `QĐ-58d` | `WF-10 d_ctrl, a_rej, s_nrej`; `MF-2 d_ctrl, a_rej`; `UF-02 s_rej, d_alt, r_uf01`; FDD `4.4` | Trạng thái Request | `MISSING` |
| `HO-65` | IT đóng yêu cầu công cụ miễn phí bên ngoài (EP-05) | Lý do cố định *"phần mềm miễn phí bên ngoài — ngoài phạm vi quản lý"* + hướng dẫn chính sách; không qua Người duyệt chi; không vào danh mục; kết cục *đóng* khác *từ chối* | `QĐ-49h`, `FR-3.4` đường đặc biệt 1 | `WF-10 d_type, a_close`; `MF-2 d_kind, a_close`; `UF-02 d_ass, s_closed`; `WF-02 end_free` | Trạng thái Request | `MISSING` |
| `HO-66` | Phần mềm nội bộ: đăng ký và đường yêu cầu không phí (EP-04/05) | IT đăng ký cùng Business Owner, không Người duyệt chi; gói K5; yêu cầu đã có trong danh mục: Employee → trưởng phòng → IT cấp thủ công kèm bằng chứng, không kiểm seat, không cam kết; chưa có trong danh mục ⟹ IT đăng ký rồi đi tiếp đường không phí; usage/`G2`–`G4`/tiết kiệm **ngoài MVP** (`QĐ-62o`) | `QĐ-49b`, `QĐ-50a`, `QĐ-54a`, `QĐ-62o` | `WF-10 a_reg`; `WF-02 d_int, a_k5`; `MF-2 a_reg`; `WF-09 d_ass [internal registered]`; `UF-02 d_path, y_int` | Dữ liệu (`HO-122`) | `MISSING` |
| `HO-67` | Điều khoản nhà cung cấp và cảnh báo rà soát/vi phạm (EP-04/11) | Liên kết điều khoản, ngày rà soát gần nhất, checklist sáu điểm (chia sẻ tài khoản, dữ liệu huấn luyện AI, nơi lưu, giới hạn cài đặt, dùng thương mại, hủy/tự gia hạn/hoàn tiền); cảnh báo tới hạn rà soát (trước hạn chót báo hủy) và **vi phạm** (dùng chung trên gói cấm chia sẻ, vượt số cài đặt); IT ghi điều đọc được, không diễn giải pháp lý | `FR-1.10`, `QĐ-54e`, `FR-5.14` | `WF-02 a_terms`; `WF-15 a_terms`; `MF-4 a_terms`; `UF-20 s_terms`; FDD `2.5` | Dữ liệu (`HO-104`) | `MISSING` |
| `HO-68` | Kho khóa bản quyền K4 (EP-04/07) | IT import lô khóa; lưu **mã hóa**, hiển thị che bớt; chỉ IT Admin xem đầy đủ khi cấp, **mỗi lần xem ghi Audit Trail**; mỗi khóa tối đa **một** Assignment đang hiệu lực, kèm thiết bị công ty đã cài; số khóa = sức chứa; thu hồi = gỡ kích hoạt, về kho hoặc *ngừng dùng* theo điều khoản | `FR-2.10`, `QĐ-54b`, `INV-01` | `WF-02 d_k4, a_keys, s_keys`; `UF-08 d_k4, s_key`; `WF-09a a_man, s_free`; FDD `5.3` | Dữ liệu bí mật (`HO-105`, `HO-125`) | `MISSING` |
| `HO-69` | Tài khoản dùng chung: chính sách chia sẻ, người chịu trách nhiệm, thành viên, đổi mật khẩu (EP-07) | Chỉ xin được khi chính sách chia sẻ của gói cho phép (không cho ⟹ từ chối ở bước đánh giá, `FR-2.11`); người chịu trách nhiệm mặc định trưởng phòng; danh sách người đang dùng; **không lưu mật khẩu**; thành viên rời (nghỉ việc, điều chuyển — kết thúc tại ngày hiệu lực) ⟹ **tác vụ IT riêng** đổi mật khẩu/thiết bị xác thực có cảnh báo; chi phí `Unit` của phòng hoặc `Company` | `FR-2.11`, `QĐ-54d`, `QĐ-56c`, `QĐ-62g`, `QĐ-62p`(2) | `WF-10 d_share`; `WF-09a d_shr, s_rot`; `UF-08 d_shr, y_rot, s_rot`; `WF-19 s_acct`; FDD `5.4` | Dữ liệu (`HO-123`) | `MISSING` |
| `HO-70` | Chuyển người chịu trách nhiệm tài khoản dùng chung trước điều chuyển/nghỉ việc (EP-03) | Người chịu trách nhiệm rời ⟹ chỉ định người mới **trước** ngày hiệu lực điều chuyển hoặc trước khi đóng hồ sơ nghỉ việc (mặc định trưởng phòng; trưởng phòng rời thì trưởng phòng mới); phòng giải thể/gộp ⟹ chuyển sang phòng nhận hoặc đóng; dòng Assignment mới nối chuỗi (`QĐ-43a`) | `QĐ-56a`, `QĐ-56c`, `QĐ-58d`, `FR-2.12`, `QĐ-43a` | `MF-7 d_shared, a_resp`; `WF-05 d_shared, a_resp`; `MF-5 d_shared, a_resp`; `WF-07 d_shared, a_resp`; `UF-09 d_shared, s_resp` | Trạng thái chuyển tiếp | `MISSING` |
| `HO-71` | Trưởng phòng xác nhận bàn giao dữ liệu theo từng công cụ (EP-03) | Danh sách quyền kèm *lưu ý trước khi thu hồi*; trưởng phòng xác nhận *đã bàn giao / không cần* từng công cụ (`BM-08` bước 1); hạn `OI-14c`; quá hạn không chặn thu hồi, gắn cờ; nghỉ đột ngột theo `QĐ-62e`; phòng thiếu trưởng phòng ⟹ chờ, hết hạn thì gỡ. Hiện chưa có UF riêng cho màn của trưởng phòng (`UF-09` ghi mở) | `FR-2.12`, `QĐ-56b`, `QĐ-62c`, `QĐ-62e`, `BM-08`, `OI-14c` | `MF-5 s_list, a_data, ff_data, d_hc, s_over`; `WF-07 s_ask, s_list, a_data, d_hc, s_over`; `UF-09 y_ask, y_ask2, d_hc, s_over` | Trạng thái bàn giao (`HO-117`) | `MISSING` |
| `HO-72` | Phạm vi IT Admin theo phòng được giao (EP-01/07) | Tác vụ cấp/thu hồi, rà soát, cảnh báo kỹ thuật của phòng giao mặc định cho IT Admin phụ trách; IT Admin khác xử lý thay có Audit Trail; IT Admin quản lý dữ liệu phòng (`QĐ-52d` suy ra, `QĐ-58b`) | `FR-3.17`, `QĐ-52d`, `QĐ-58b` | `UF-08 s_queue`; `WF-09a s_err`; `WF-08 s_queue`; `MF-5 s_tasks`; `WF-07 s_tasks` | Quyền | `MISSING` |
| `HO-73` | Finance khai hồ sơ thuế nhà cung cấp T1–T3 (EP-12) | T1 trong nước · T2 nước ngoài, doanh nghiệp khấu trừ nộp thay (**mặc định**) · T3 nước ngoài, thuế đã thu trên chứng từ; tỷ lệ ước tính từng loại thuế; cờ *được khấu trừ* mặc định; hệ thống chỉ ghi nhận | `FR-5.13` mục 1, `QĐ-55a`, `QĐ-60b` | `WF-02 a_tax`; FDD `9.4` | Dữ liệu (`HO-106`) | `MISSING` |
| `HO-74` | Ghi dòng thuế hóa đơn và cờ được khấu trừ (EP-12) | Xem `HO-48`; chứng từ thuế nộp thay đính kèm (`FR-1.5`); hệ thống **không** tự quyết khoản nào được khấu trừ | `FR-5.13` mục 3–5, `QĐ-60a` | `WF-16 a_inv, s_tax`; `MF-8 a_inv, s_tax`; FDD `9.3` | Dữ liệu (`HO-106`) | `MISSING` |
| `HO-75` | Finance ghi chi phí phần mềm nội bộ vào đúng một Cost Center (EP-12) | Mỗi khoản đúng **một** Cost Center; muốn chia ghi nhiều khoản; không tỷ lệ (`INV-03` chỉ cho thuê bao) | `QĐ-49g`, `FR-5.2` | `MF-8 a_inv`; `WF-19 d_type [internal cost item], a_int`; `UF-19 d_int, s_int` | Dữ liệu (`HO-132`) | `MISSING` |
| `HO-76` | Đặt khoản chi chưa căn cứ vào dòng *Chưa phân bổ Cost Center* (System Story, EP-12) | Xem `HO-50`; dòng báo cáo, **không** là bản ghi Cost Center | `QĐ-50c`, `FR-5.2`, `FR-9.7` | `WF-17 s_unal`; `WF-19 d_basis, s_unal`; `UF-19 s_alloc` | Dữ liệu báo cáo (`HO-133`) | `MISSING` |
| `HO-77` | Chia chi phí theo ngày khi điều chuyển (System Story, EP-12) | Theo kỳ: mỗi ngày vào Cost Center có hiệu lực của nhân viên ngày đó; theo dòng tiền: hóa đơn theo ngày hóa đơn; không viết lại chi phí đã phát sinh | `QĐ-55b`, `FR-5.3` | `WF-19 d_alloc [personal seat], s_seat, s_bases`; `WF-05 s_period`; `MF-7 s_period`; `UF-18 y_keep` | Dữ liệu (`HO-120`) | `MISSING` |
| `HO-78` | Finance khép kỳ và phát hành báo cáo chi phí theo vai (EP-12) | Chuyển cam kết khớp thành chi phí, giải phóng phần dư có lý do, ghi chi phí nội bộ, phân bổ, Budget vs Actual theo chi phí thực chịu, dự báo L1/L3, phát hành theo phạm vi vai; báo cáo đã phát hành là **bản chụp bất biến**, khoản đến muộn ở kỳ sau nhãn *điều chỉnh kỳ trước*, **không khóa kỳ** | `QĐ-62m`, `FR-5.1`, `FR-5.8`, BRD 5.5.3 | `WF-19 s_conv, d_rem, a_rel, s_report, s_fc, a_pub`; `UF-19` toàn bộ; `MF-8 s_commit, s_report, a_pub` | Dữ liệu báo cáo (`HO-134`) | `MISSING` |
| `HO-79` | Dashboard theo vai và danh mục cảnh báo duy nhất (EP-01/12) | Sáu trang tổng quan theo BRD 5.5.4; danh mục cảnh báo (gì, gửi ai, khi nào) gồm cảnh báo cho **Employee** dựa trên dữ liệu nội bộ (quyền có thời hạn sắp hết, thu hồi sắp thực hiện, trạng thái yêu cầu), phòng thiếu trưởng phòng, bộ chuẩn đổi, bàn giao chưa xác nhận, đổi mật khẩu dùng chung, máy chưa xác nhận, lời mời chờ N ngày (`QĐ-62j`), **thực hiện trễ** gia hạn (`QĐ-62k`), mốc theo ngày kết thúc (`QĐ-62l`); cảnh báo dựa trên **usage** chờ `QĐ-57d` | `FR-5.14`, `QĐ-57a`, `QĐ-62j`, `QĐ-62k`, `QĐ-62l` | FDD `11.1`, `11.2` (không có workflow); `UF-15 t_start` (`FR-5.14`) | Thông báo, quyền xem | `MISSING` |
| `HO-80` | Hồ sơ/biểu mẫu `BM-01` → `BM-08` và bản ghi phê duyệt điện tử (xuyên Epic) | Mỗi loại: trường bắt buộc, bước phát sinh, người nộp, người xem; thiếu trường không qua bước; gắn đúng một đối tượng; **không sửa** sau khi bước đã quyết — sửa bằng hồ sơ bổ sung có lý do; *ký duyệt* = bản ghi phê duyệt điện tử + Audit Trail, **không** chữ ký số | `FR-11.1`, `FR-11.2`, `QĐ-53a`, `QĐ-53b`, BRD 5.13 | `MF-2 a_req (BM-01), c_assess (BM-02), d_spend (QĐ-53a)`; `WF-11 a_ret (BM-03)`; `MF-7 a_rec (BM-04)`; `WF-02 a_doc (BM-05)`; `WF-18 a_sign (BM-06)`; `WF-17 a_it (BM-07)`; `MF-5 c_reclaim (BM-08)` | Dữ liệu (`HO-118`) | `MISSING` |
| `HO-81` | IT Admin lập đề xuất gia hạn và ghi kết quả thực hiện (EP-11) | Xem dữ liệu hạn chót, rà điều khoản, usage, ý kiến Business Owner (không chặn); đề xuất *gia hạn / giảm / hủy*; sau quyết định: thu hồi phần vượt trước kỳ mới, thực hiện với nhà cung cấp ngoài hệ thống, ghi **kết quả thực tế** và kỳ mới; cờ *thực hiện trễ* (`QĐ-62k`) | `FR-3.13`, `FR-1.10`, `FR-4.15`, `QĐ-62k`, `BM-05`, BRD 4.6 dòng Gia hạn | `WF-15 a_terms, a_use, a_prop, d_excess, c_rec, a_exec, d_sav, s_save`; `UF-20` toàn bộ; `MF-4 a_terms, a_prop, a_exec` | Trạng thái gia hạn (`HO-111`) | `MISSING` |
| `HO-82` | AI tóm tắt các request đang chờ trưởng phòng duyệt (EP-15, **phạm vi cam kết**) | Chỉ hàng đợi của chính người duyệt (`SoD-2`); mỗi dòng dẫn liên kết request nguồn; không duyệt/từ chối/bỏ qua bước; AI tắt/lỗi ⟹ hàng đợi chạy như cũ; **chỉ dữ liệu giả lập** cho tới khi chốt `OQ-26` (`QĐ-61f`); chưa có kế hoạch đánh giá model | `QĐ-49e`(1), `QĐ-61e`, `QĐ-61f`, BRD 6.4 | `MF-2 a_need` (`QĐ-49e(1)`); `WF-09 a_need`; `UF-04 s_queue`; FDD `15.1` | Dữ liệu gửi model (`HO-90`, `HO-135`) | `MISSING` |
| `HO-83` | AI bản nháp diễn giải báo cáo chi phí cho Finance (EP-15, **phạm vi cam kết**) | Backend tính mọi con số; mỗi con số truy về số liệu báo cáo đã dùng; chỉ dữ liệu Finance được thấy; Finance **xem và sửa** trước khi phát hành; AI tắt/lỗi ⟹ phát hành như cũ; chỉ dữ liệu giả lập tới khi chốt `OQ-26` | `QĐ-49e`(2), `QĐ-61e`, `QĐ-61f`, BRD 6.4 | `MF-8 d_ai, s_ai, a_edit`; `WF-19 d_ai, s_ai, a_edit`; `UF-19 d_ai, y_ai, s_edit`; FDD `15.2` | Dữ liệu gửi model (`HO-90`, `HO-135`) | `MISSING` |
| `HO-84` | Kênh Mobile native — bốn tác vụ MVP (xuyên EP-01/05/06) | (1) Employee xem phần mềm và yêu cầu của mình, gửi/rút yêu cầu đơn giản (bộ chuẩn hiện trước); (2) trưởng phòng duyệt/từ chối **bước nhu cầu** của phòng mình; (3) Người duyệt chi duyệt/từ chối **bước duyệt chi** trên snapshot chỉ đọc, và **bước nhu cầu** của yêu cầu do trưởng phòng tự gửi (`QĐ-61h`); (4) mọi vai đăng nhập và **hộp thông báo trong ứng dụng**. Cùng nghiệp vụ và phân quyền với web, không vai mới, không bỏ SoD; **không push, không offline, không quản trị/tải tệp/biometrics**; điện thoại vẫn là vùng không theo dõi usage. Có thể viết thành AC kênh cho `US-05-01`, `US-05-08`, `US-05-04`, `US-06-01`, `US-05-15`, `US-01-10` thay vì Story riêng | `QĐ-61a`→`QĐ-61d`, `QĐ-61g` (lệch L-5) | Không vẽ UF riêng: dùng `UF-01`, `UF-04`, `UF-15`, `UF-17` (`QĐ-61` ghi rõ) | Kênh giao diện; không thêm bảng push (`QĐ-61c`) | `MISSING` |

---

## 6. Phụ thuộc chờ Owner (`PENDING-OWNER`)

Mục này gom các điểm từng chờ Owner. **Chỉ `HO-90` (`OQ-26`) còn `PENDING-OWNER`**; `HO-91`, `HO-92`, `HO-93` và `HO-136` đã có căn cứ hoặc quyết định (`NEEDS_UPDATE`) và được giữ ở đây để truy vết. Các câu `O-3`, `O-4`, `O-5`, `O-7` của [verification-2026-10-08.md](verification-2026-10-08.md) mục 5 **đã được chốt** ở `QĐ-62a`, `QĐ-62e`, `QĐ-62b`, `QĐ-62c`/`f`/`h`/`p`; `O-6` (gói cấm dùng chung) đã có câu trả lời ở BRD `FR-2.11` (*từ chối ở bước đánh giá của IT*); hoàn trả tự nguyện không cần trưởng phòng duyệt — người kích hoạt xác nhận bàn giao bản nhẹ (`QĐ-62f`, *suy ra*).

| Mã | Điểm chờ | Ảnh hưởng | Sơ đồ / node | Trạng thái |
| --- | --- | --- | --- | --- |
| `HO-90` | **`OQ-26`** — điều kiện gửi dữ liệu thật tới nhà cung cấp model (BRD 10.1). Tới khi chốt: chỉ dữ liệu giả lập, không dữ liệu cá nhân (`QĐ-61f`) | AC dữ liệu của `HO-82`, `HO-83`; ERD nhật ký AI (`HO-135`) | `MF-2 a_need`; `MF-8 s_ai`; `WF-19 s_ai`; `UF-19 y_ai` | `PENDING-OWNER` |
| `HO-91` | Phạm vi còn hiệu lực của `QĐ-40a`, `QĐ-40c`, `QĐ-48b`, `QĐ-48d` dưới mô hình phòng ban: bốn quyết định viết theo cây `manager_id` (kế nhiệm từng cấp dưới, mã quản lý sai, ánh xạ kế nhiệm khi đổi ngày, **bảy cột** so khi import lại gồm *mã Cost Center, mã quản lý trực tiếp, nhãn phòng ban*) nhưng sổ **chưa** ghi là bị thay. Sơ đồ đã áp lại thành *chỉ định trưởng phòng mới* (`WF-07` ghi mở). *Suy ra từ nguồn, không cần Owner chọn lại (09/10/2026):* nguyên tắc của `QĐ-48d` là *so mọi cột không phải khóa* — áp sang bộ cột mới của tệp nhân sự (mã phòng, chức vụ… theo `FR-9.7`, `HO-15`); ánh xạ kế nhiệm từng cấp dưới của `QĐ-40a`/`QĐ-48b` thay bằng *chỉ định trưởng phòng mới hoặc ghi chưa có* vì cấp dưới gắn với phòng (`QĐ-52a`, `QĐ-51` đọc cùng `QĐ-52a`). Ghi chú *bị thay một phần* cho `QĐ-40a`/`QĐ-48b`/`QĐ-48d` ở sổ khi viết lại US | `HO-15`, `HO-21`; Logical `handover_successor_mappings`, `C-21`, `C-38` (`HO-120`) | `WF-07 d_head, a_newhead`; `MF-5 d_head, a_newhead`; `WF-01 s_prev` | `NEEDS_UPDATE` |
| `HO-92` | **Người được điều chuyển đang là trưởng phòng cũ**: phải chỉ định trưởng phòng mới hoặc ghi *chưa có* — có căn cứ: `FR-3.1`, `QĐ-52a`, `INV-19`, `INV-20` (mỗi phòng có đúng một trưởng phòng có hiệu lực; một người làm trưởng tối đa một phòng); phòng thiếu trưởng phòng ⟹ `QĐ-62c` (DOI-42). `FR-2.12` chỉ nói người chịu trách nhiệm **tài khoản dùng chung** rời phòng (mặc định trưởng phòng, trưởng phòng rời thì trưởng phòng mới) — không phải căn cứ chỉ định trưởng phòng | `HO-19`, `HO-60` | `WF-05 d_head, d_succ, a_appoint, s_nohead` | `NEEDS_UPDATE` |
| `HO-93` | **Phần mềm có bản quyền nhưng không tốn tiền** (nhánh c): `FR-3.4` (c) ghi snapshot và khoản cam kết *"chỉ khi có chi phí"*; Người duyệt chi vẫn quyết việc đưa phần mềm vào danh mục (`QĐ-22`). Sơ đồ **đã vẽ** nhánh này sau bước duyệt chi: `d_cost [no cost] → m_buy`, không tạo khoản cam kết. *Câu hỏi cũ (sơ đồ không vẽ nhánh không chi phí) đã được trả lời bởi BRD và sơ đồ hiện hành; còn lại là AC/trạng thái của Story — không cần Owner chọn (10/10/2026).* | `HO-32`, `HO-38`; trạng thái Request | `WF-09 d_cost`; `MF-2 d_cost`; `WF-10 d_ctrl → a_hand`; `UF-02 d_path` | `NEEDS_UPDATE` |
| `HO-136` | **Người xác nhận bàn giao dữ liệu khi thu hồi do IT thực hiện** — hết hạn quyền, giảm/hủy thuê bao, không hợp thức hóa, thực thi lại (`QĐ-63a`, `QĐ-63b`); **ca chồng lấn:** seat đã quyết *Thu hồi* ghost seat nằm trong phần vượt khi giảm thuê bao (`QĐ-64a`). **Đã ghi sổ 10/10/2026; `FR-2.12` đã cập nhật (BRD v3.32)** — không còn chờ Owner | **IT Admin** ghi xác nhận đã xử lý bàn giao (người, thời điểm) trước khi gỡ ở nhà cung cấp; không chặn sau *hạn ngắn* cấu hình được; quá hạn chưa xác nhận ⟹ đi tiếp, cờ *chưa xác nhận bàn giao*. **Ngoại lệ (`QĐ-64a`):** seat vừa có quyết định *Thu hồi* ghost seat của trưởng phòng vừa nằm trong phần vượt khi giảm thuê bao ⟹ **một** tác vụ thu hồi, **trưởng phòng đó** xác nhận, IT Admin không xác nhận thêm; đã có xác nhận hợp lệ thì dùng lại. **Giữ nguyên** người xác nhận ở ca nghỉ việc/nghỉ đột ngột, bốn ca của `QĐ-62f` và các seat khác của đợt giảm. **Khi viết AC/ERD phải phân biệt:** người ghi xác nhận ≠ người sở hữu dữ liệu ≠ người thực thi thu hồi; IT Admin không là người duyệt nhu cầu/chi phí; bản ghi xác nhận **tách** khỏi kết quả thu hồi thực tế (`QĐ-62i`; thu hồi thất bại không có nghĩa quyền đã mất). **Việc còn lại:** AC của các Story chứa các ca (tối thiểu `US-03-05`, `US-11-02`, `US-11-03`, `US-13-06`, `US-07-05`, `US-07-07`, và `US-10-06`, `US-10-07` cho ca `QĐ-64a`; chốt khi viết lại); ERD cần chỗ lưu actor và thời điểm xác nhận (không gộp vào trạng thái thu hồi) và cách ghi **lý do thu hồi thứ hai** trên cùng tác vụ. **Chưa chọn — không tự đặt:** giá trị *hạn ngắn*, cách lưu bản ghi. **Chưa hỏi, không suy rộng (`QĐ-64b`):** cùng cấu trúc ở hủy toàn bộ thuê bao, hết hạn, thực thi lại. Phụ thuộc: `HO-21`, `HO-40`, `HO-71` | `WF-09a d_dl, s_ask, e_hc`; `WF-08 c_rec`; `MF-4 c_all, c_excess`; `WF-15 c_rec`; `WF-16 c_exec`; `WF-17 c_recl`; `WF-13 c_reclaim`; `UF-08`; `UF-12 r_recl`; `UF-20 r_recl` | `NEEDS_UPDATE` |

**Bàn giao `OQ-26` cho phiên AI (`HO-90`) — các lựa chọn Owner cần chốt, chưa chọn thay:**

| Trục | Phương án đang có trong nguồn | Căn cứ / tác động |
| --- | --- | --- |
| Dữ liệu được gửi | Chỉ dữ liệu giả lập (hiện hành) · dữ liệu tổng hợp đã che · dữ liệu thật trong phạm vi vai | `QĐ-61f`; Manager chỉ thấy hàng đợi của mình (`SoD-2`), Finance chỉ dữ liệu Finance được thấy — AI không mở rộng quyền xem (BRD 6.4) |
| Nơi chạy model | Model local (llama.cpp, adapter OpenAI-compatible) · dịch vụ hosted (free tier chỉ nhận dữ liệu tổng hợp) · hosted trả phí | `QĐKT-05`, `QĐ-34d`; ngân sách trả phí đang bằng 0 |
| Che / ẩn danh hóa | Che thông tin cá nhân trước khi gửi · gửi số liệu đã tổng hợp từ backend | `FR-10.4`, ma trận BRD 7.7.2; backend luôn tính mọi con số |
| Đánh giá chất lượng | Cổng chất lượng trên tập giữ lại trước khi hiện kết quả (kiểu `US-15-01`) · kiểm tay có nguồn dẫn | `QĐ-32b`, `QĐ-37b`; hai tính năng mới chưa kiểm chứng model |
| Điều kiện nhà cung cấp | Điều khoản dữ liệu nào chấp nhận được; có lưu/huấn luyện trên dữ liệu gửi không | chưa đánh giá (BRD 6.4, 10.1) |

Phiên AI **không** gọi model với dữ liệu thật, không chạy benchmark hay trả phí cho tới khi Owner chốt `OQ-26`; quy trình nghiệp vụ phải chạy đủ khi AI tắt.

*Không tính là chờ Owner:* `O-1`/`O-2` (bộ main flow và mã `SF-1` → `SF-4` — [main-flow-selection.md](main-workflows-activity-diagram/main-flow-selection.md) mục cuối ghi *giữ*), không ảnh hưởng Story/ERD; câu hỏi pháp lý `OQ-11`, `OQ-16`, `OQ-23` (hoãn có điều kiện, `QĐ-59b`); phương pháp usage chờ GVHD (`QĐ-57d`); giá trị N, M, số lần thử lại (thiết kế kỹ thuật, `QĐ-62`); thiết kế kỹ thuật Mobile/AI (dòng 9 *Trạng thái hiện hành*).

---

## 7. ERD

### 7.1. Conceptual ERD — [`../ERD/CONCEPTUAL ERD - DANH SÁCH ENTITY.md`](<../ERD/CONCEPTUAL ERD - DANH SÁCH ENTITY.md>) (+ `../ERD/tools/generate-conceptual-erd.py`, `.drawio`, manifest)

| Mã | Đích (thực thể / quan hệ / bất biến) | Việc cần đổi | Nguồn | Sơ đồ / node | Tác động | Trạng thái |
| --- | --- | --- | --- | --- | --- | --- |
| `HO-101` | Thực thể mới `Department` (C2) | Thêm `Department`; quan hệ: `Employee —belongs to→ Department` (có hiệu lực, đúng một phòng mỗi thời điểm); `Department —headed by→ Employee` (có hiệu lực, `INV-19` hai chiều); `Department —charged to→ CostCenter` (1–1, loại `Unit`); `Department —served by→` IT Admin phụ trách; dự án chỉ là thuộc tính mô tả, **không** là thực thể có thành viên | `QĐ-52a`, `QĐ-52b`, `QĐ-52d`, `QĐ-58a`, `FR-3.1`, `FR-3.17`, `INV-19`, `INV-20`, dòng 8 (1) | `WF-01 a_dept, a_heads`; `WF-05 s_period`; `MF-7 s_period` (`INV-20`) | Đổi số thực thể/quan hệ | `MISSING` |
| `HO-102` | Quan hệ `Employee —manages→ Employee`; `CostCenter —funds→ Employee`; định nghĩa `CostCenter` (*"Không có phòng ban/đội nhóm (QĐ-23)"*), `Employee` (*"chỉ bằng quan hệ manages"*), `Role` (*"Manager suy ra từ manages"*), mục 3 *Tổ chức và tài khoản*; `AppUser` *"đăng nhập qua định danh liên kết"* | Bỏ `manages`; `funds` biểu diễn lại là **suy ra** qua phòng (hoặc giữ cạnh có ghi *suy ra*); viết lại các định nghĩa; Manager suy ra từ trưởng phòng; `AppUser` theo xác thực nội bộ (`QĐ-46`) | `QĐ-52a`, `QĐ-52b`, `QĐ-46` | `WF-03 a_acct`; `UF-17` | Mâu thuẫn trực tiếp | `STALE` |
| `HO-103` | Mục 4 bất biến (18 / 19 dòng) | Thêm `INV-19`, `INV-20`; `INV-14a`/`INV-14b` ghi *suy ra từ `INV-20` và Cost Center 1–1 của phòng*; BRD hiện có **20 bất biến (21 dòng)**; `INV-01` thêm sức chứa K4 = số khóa | BRD 5.12.2, `QĐ-58a`, `FR-2.10` | `WF-02 s_keys` (`INV-01`) | Checker đếm theo khai báo | `NEEDS_UPDATE` |
| `HO-104` | `Plan` (đang trừu tượng hóa trong *sold as*) | Quyết định có cho `Plan` hộp riêng không, vì gói nay mang **kiểu cấp K1–K5, mức kiểm soát, lưu ý trước khi thu hồi, chính sách chia sẻ, điều khoản (liên kết, ngày rà soát, checklist sáu điểm)**; gói K5 cho phần mềm nội bộ | `FR-1.9`, `FR-1.10`, `QĐ-54a`, `QĐ-54e`, `QĐ-53c` | `WF-02 a_plan, a_k5, a_terms` | Đổi mức trừu tượng | `MISSING` |
| `HO-105` | Kho khóa bản quyền (C3) | Thêm khái niệm khóa bản quyền: thuộc một khoản mua K4; gắn tối đa một `LicenseAssignment` đang hiệu lực; gắn thiết bị công ty đã cài | `FR-2.10`, `QĐ-54b` | `WF-02 a_keys, s_keys`; `UF-08 s_key` | Thực thể mới | `MISSING` |
| `HO-106` | `Invoice` (đang là *chi tiết hỗ trợ*), hồ sơ thuế (C7) | Quyết định đưa `Invoice` thành hộp (nay mang dòng thuế); thêm hồ sơ thuế nhà cung cấp (T1–T3, gắn `Vendor`) và dòng thuế hóa đơn (cờ *được khấu trừ*, *ai thu/nộp*) | `FR-5.13`, `QĐ-55a`, `QĐ-60a`, `QĐ-60b`, dòng 8 (1), bảng tra nhanh dòng `QĐ-60a/b` | `WF-02 a_tax`; `WF-16 a_inv, s_tax`; `MF-8 a_inv` | Thực thể mới | `MISSING` |
| `HO-107` | Bộ công cụ chuẩn, chức vụ (C2) | Thêm *bộ công cụ chuẩn* (phòng × chức vụ → mục danh mục/gói); chức vụ là thuộc tính nhân sự có hiệu lực (không cấp quyền) | `FR-3.18`, `QĐ-52a`, `QĐ-52e` | `WF-01 a_tool`; `WF-04 s_kit` | Thực thể mới | `MISSING` |
| `HO-108` | Ghi chú mục 3 về tài khoản dùng chung/dịch vụ (*"chi phí quy về Cost Center loại Company (QĐ-40d)"*) | Tài khoản dùng chung **của một phòng** ⟹ `Unit` của phòng; toàn công ty và dịch vụ ⟹ `Company`; có danh sách thành viên; không lưu mật khẩu | `QĐ-54d` (thay một phần `QĐ-40d`) | `WF-19 s_acct`; `WF-09a d_shr` | Mâu thuẫn | `STALE` |
| `HO-109` | `ManagedDevice`, `MonitoringAcknowledgment` (mục 3 C5, *chi tiết hỗ trợ*) | Ghi thuộc tính sổ thiết bị (mã tài sản, hệ điều hành, tên máy, người giữ, khoảng hiệu lực; **không IP**); bản ký `BM-06`; phiên bản thông báo có cờ *cần xác nhận lại* | `QĐ-57b`, `QĐ-58f`, `QĐ-62q`, `FR-4.21` | `WF-18 a_reg, a_sign, a_store, d_ack` | Dữ liệu cá nhân | `NEEDS_UPDATE` |
| `HO-110` | `Discrepancy` (mục 6, *chi tiết hỗ trợ*) | Mô tả vòng đời: mở (giữ cả hai giá trị) → *chờ bằng chứng* → đóng theo quyết định {nhà cung cấp tính sai (ghi chú bắt buộc), mua chưa ghi (IT cập nhật thuê bao), truy cập ngoài quy trình, tài khoản khác quyết định}; người đóng là IT Admin; chênh lệch thuế/tỷ giá không phải `Discrepancy` | `QĐ-15`, `QĐ-34a`, `QĐ-49f`, `QĐ-62b`, `FR-7.7` | `WF-16 s_open, d_ver, s_keep, d_cause, a_close` | Thực thể/trạng thái | `MISSING` |
| `HO-111` | Quyết định gia hạn | Chưa có chỗ ghi quyết định *gia hạn/giảm/hủy* của Người duyệt chi (snapshot, lý do), sự cố `KPI-4`, cờ **thực hiện trễ**, **kết quả thực tế** khác quyết định; `ApprovalStep` hiện chỉ gắn `AccessRequest` (tương tự `CERD4-02`) | `FR-3.13`, `DQ-07`, `QĐ-62k`, `QĐ-49c` | `WF-15 a_dec, d_dec, a_exec, d_end, s_inc`; `MF-4 a_dec, a_exec, s_incident` | Thực thể/quan hệ mới | `MISSING` |
| `HO-112` | `AccessRequest`, `ApprovalStep`, `BudgetCommitment` (C4, C7) | Request: loại *cá nhân/dùng chung/nhóm*, người tạo ≠ người thụ hưởng (tạo thay, `QĐ-62a`), lý do ngoài bộ chuẩn, dự án chỉ ngữ cảnh, **giá trước thuế/thuế ước tính/chi phí ước tính/tổng ước tính**, kết cục *đóng — miễn phí bên ngoài*, *IT từ chối*; ApprovalStep: bước nhu cầu *ghi nhận do tạo thay*, đánh giá IT có **mức kiểm soát**, bản ghi phê duyệt điện tử (vai tại thời điểm, snapshot); BudgetCommitment ghi **chi phí ước tính** (chi phí thực chịu) | `QĐ-52c`, `QĐ-53a`, `QĐ-53c`, `QĐ-54d`, `QĐ-60a`, `QĐ-62a`, `FR-5.13` | `MF-2 a_req, s_route, d_ctrl, s_snap, s_commit`; `WF-09 s_need, s_com`; `UF-21 s_grp` | Đầu vào thiết kế C4/C7 | `NEEDS_UPDATE` |
| `HO-113` | Đầu tệp, mục 6 (ánh xạ), mục 7 (điểm mở), nhãn page `v4.2`, `README.md` của ERD | Căn cứ BRD v3.24 → bản hiện hành, sổ tới `QĐ-62`, User Stories bản mới; số `21 · 40 · 18` sẽ đổi — cập nhật cả khai báo `<!-- erd-model … -->`, README và manifest để checker không lệch; mục 6 thêm dòng `Department`, khóa, thuế, bộ chuẩn | Quy ước bảo trì ERD | — | Truy vết/checker | `NEEDS_UPDATE` |

### 7.2. Logical ERD S0 — [`../ERD/logical/LOGICAL-ERD-S0.md`](../ERD/logical/LOGICAL-ERD-S0.md) (+ `../ERD/tools/generate-logical-erd-s0.py`, `.drawio`)

| Mã | Đích (bảng / thuộc tính / ràng buộc) | Việc cần đổi | Nguồn | Sơ đồ / node | Tác động | Trạng thái |
| --- | --- | --- | --- | --- | --- | --- |
| `HO-120` | Mục 1 dòng C2 (*"không có Department/Team (QĐ-23)"*), 4.3: `employees.department_label` (*"chỉ nhãn hiển thị"*), `employee_manager_periods`, `employee_cost_center_periods`, `handover_successor_mappings`; ràng buộc `C-03`, `C-04`, `C-20` (vế `MANAGER`), `C-21`, `C-33`, `C-38`; bảng 6.14 | Thêm `departments`, `department_head_periods` (loại trừ khoảng **hai chiều** — `INV-19`), `employee_department_periods` kèm **chức vụ** (không chồng lấn, không rỗng — `INV-20`); Cost Center của nhân viên **suy ra** từ phòng (`employee_cost_center_periods` bỏ hoặc thành dẫn xuất có ràng buộc khớp phòng); bỏ `department_label`; bỏ/đổi `employee_manager_periods`, `C-04` (không vòng), `C-21`; `handover_successor_mappings`/`C-38` chờ `HO-91`; `C-20` suy `MANAGER` từ trưởng phòng; **BE**: module tổ chức dựa trên `manager_id` và có test (`QĐ-51`, BE0032) — cần thiết kế chuyển đổi ở repo BE | `QĐ-52a`, `QĐ-52b`, `QĐ-58a`, `FR-2.2`, `FR-9.7`, `INV-19`, `INV-20`, dòng 8 (1)(2) | `WF-01 a_dept, a_up, a_heads`; `WF-04 s_org`; `WF-05 s_period`; `WF-07 a_newhead` | Dữ liệu tổ chức, quyền, BE | `STALE` |
| `HO-121` | `cost_centers.type` {`UNIT`, `PROJECT`, `COMPANY`} | Bỏ `PROJECT`; ràng buộc **1–1** phòng ↔ Cost Center `UNIT`; tách/gộp phòng ⟹ Cost Center mới, cũ `INACTIVE` | `QĐ-52b`, `FR-3.1` | `WF-01 a_cc`; `WF-20 a_cc` | Dữ liệu | `STALE` |
| `HO-122` | `license_assignments.subscription_id` (**B** — NOT NULL), `saas_products.vendor_id` (**B**) | Theo **dòng 7** và `CERD4-02b`: `subscription_id` **0..1** + thêm `saas_product_id` bắt buộc + ràng buộc *cùng phần mềm khi có thuê bao*; `vendor_id` 0..1 theo loại phần mềm (nội bộ không có); quyền nội bộ không tính `INV-01`; **không** tạo thuê bao/hợp đồng/nhà cung cấp giả | `QĐ-49b`, `QĐ-50a`, Conceptual v4.2 *accessed via*, dòng 7 (1) | `WF-02 d_int, a_k5`; `WF-09 d_seat [seat free or not counted]`; `WF-09a a_man` (`QĐ-49b`) | Dữ liệu — chặn lưu quyền nội bộ | `NEEDS_UPDATE` |
| `HO-123` | `license_assignments.account_kind`, `cost_center_id`, ràng buộc `C-22` (*`account_kind ≠ PERSONAL` ⇔ Cost Center loại `COMPANY`*) | `C-22` **trái** `QĐ-54d`: dùng chung của phòng ⟹ `UNIT` của phòng; chỉ dùng chung toàn công ty và dịch vụ ⟹ `COMPANY`; thêm thành viên tài khoản dùng chung (có hiệu lực, kết thúc khi điều chuyển — `QĐ-62g`); phân biệt *gói team* (mỗi người một Assignment, `PERSONAL`) với *tài khoản dùng chung* | `QĐ-54d`, `QĐ-62g`, `FR-2.11` | `WF-19 s_acct`; `WF-09a d_shr, s_rot` | Mâu thuẫn ràng buộc | `STALE` |
| `HO-124` | `plans` (`pricing_model` bắt buộc) | Thêm `provisioning_type` {K1…K5}, `control_level` {đầy đủ, một phần, không kiểm soát được}, `pre_revocation_notes`, `sharing_policy`, liên kết điều khoản, ngày rà soát, checklist sáu điểm; gói K5 không có mô hình giá/không đếm seat | `FR-1.9`, `FR-1.10`, `QĐ-54a`, `QĐ-54e` | `WF-02 a_plan, a_k5, a_terms` | Dữ liệu | `NEEDS_UPDATE` |
| `HO-125` | Bảng mới khóa bản quyền | Khóa lưu **mã hóa**, dạng che; trạng thái {trong kho, đã gán, ngừng dùng}; tối đa **một** Assignment hiệu lực mỗi khóa (duy nhất có điều kiện); thiết bị đã cài; mỗi lần xem đầy đủ ghi `audit_events`; sức chứa K4 = số khóa (`C-01` mở rộng) | `FR-2.10`, `QĐ-54b`, `INV-01` | `WF-02 s_keys`; `UF-08 s_key`; `WF-09a s_free` | Dữ liệu bí mật | `MISSING` |
| `HO-126` | `subscriptions` (`billing_cycle`, ngày, `notice_deadline_source`, `end_reason`) | Phân biệt **kỳ có thời hạn** và **license vĩnh viễn** (trường gia hạn không áp dụng); `notice_deadline_source` thêm giá trị *theo ngày kết thúc* (`QĐ-62l`); trạng thái/kết quả gia hạn: quyết định, cờ thực hiện trễ, kết quả thực tế (liên kết `HO-111`) | `QĐ-49c`, `QĐ-62k`, `QĐ-62l`, `FR-1.3`, `FR-1.4` | `WF-02 d_perp, a_perp`; `WF-15 d_dl, a_exec` | Dữ liệu, cảnh báo | `NEEDS_UPDATE` |
| `HO-127` | Ràng buộc mới quanh `user_role_grants`, `departments`, `organizations` | **Finance tối đa một grant hiệu lực** mỗi tổ chức (như `C-27` cho Super Admin); người có `SUPER_ADMIN` **không** được làm trưởng phòng (mở rộng `C-18`); danh sách **tên miền email công ty** để chặn Assignment trả phí trên tài khoản cá nhân (`FR-2.9`) | `QĐ-52d`, `FR-8.7`, `QĐ-54c`, `FR-2.9` | `WF-03 d_gate`; `WF-09a s_task` (`QĐ-54c`) | Quyền, dữ liệu | `MISSING` |
| `HO-128` | `provisioning_tasks.status`, `license_assignments.status`, `revocation_source`; bảng 6.4, 6.5 | Thêm hành động sau thất bại: thử lại / chuyển `MANUAL` kèm bằng chứng / đóng thất bại (lý do bắt buộc) — chỉ *đóng* là cuối (`QĐ-62i`); lời mời chờ: mốc N ngày nhắc, M ngày thu lại (`QĐ-62j`); trạng thái **giữ gỡ** khi nghỉ đột ngột với hạn (`QĐ-62e`); xác nhận bàn giao bản nhẹ trước khi gỡ (`QĐ-62f`); `revocation_source` thêm điều chuyển, giảm/hủy gia hạn, không duyệt hợp thức hóa; `attempt_count` tối đa hiện ghi cứng 6 — chuyển thành tham số | `QĐ-62e`, `QĐ-62f`, `QĐ-62i`, `QĐ-62j`, `FR-2.12` | `WF-09a d_api, s_retry, s_err, s_pend`; `UF-08 b_err`; `WF-07 d_hc, s_over` | Trạng thái | `NEEDS_UPDATE` |
| `HO-129` | `saas_products.catalog_status`, bảng 6.2, `C-07` | Chuyển `RETIRED` **bị chặn** khi còn Assignment chưa kết thúc hoặc thuê bao chưa hủy/hết hạn (liệt kê thứ đang chặn); loại phần mềm (SaaS trả phí / có bản quyền / nội bộ) | `QĐ-62n`, `QĐ-49a` | `WF-02 e_ret, a_ret, a_stat` | Chuyển trạng thái | `NEEDS_UPDATE` |
| `HO-130` | Mục 14 *Ngoài S0 — bản đồ phụ thuộc* | Bổ sung đầu vào đã chốt: **C4** — `QĐ-52c`, `QĐ-53a`, `QĐ-53c`, `QĐ-62a`, renewal step (`HO-111`); **C3** — kho khóa, trạng thái `Discrepancy` (`QĐ-49f`, `QĐ-62b`), tác vụ (`QĐ-62i`/`j`); **C5** — sổ thiết bị không IP, `BM-06`, phiên bản cần xác nhận lại (`QĐ-62q`), usage nội bộ ngoài MVP (`QĐ-62o`); **C7** — thuế (`QĐ-60a`/`b`), chi phí nội bộ, dòng *Chưa phân bổ*, chi phí thực chịu, lịch sử sửa ngân sách, bản chụp báo cáo (`QĐ-62m`); **C8** — danh mục cảnh báo `FR-5.14`, hồ sơ `BM-01`→`BM-08`, **không** bảng token push (`QĐ-61c`) | `QĐ-49` → `QĐ-62` | — | Kế hoạch lát | `NEEDS_UPDATE` |
| `HO-131` | Mục 7.2 *Story/AC → thực thể/ràng buộc* | Làm lại sau khi Story được viết lại (`HO-10`, `HO-15`, `HO-16`, `HO-19`, `HO-21`, `HO-27`, `HO-29`, `HO-34`) — hiện trỏ AC theo cây quản lý | — | — | Truy vết | `NEEDS_UPDATE` |
| `HO-132` | Khoản chi phí phần mềm nội bộ (C7) | Thực thể *khoản chi phí nội bộ*: phần mềm nội bộ, kỳ, số tiền (đủ bộ `INV-04`), **đúng một** `cost_center_id` bắt buộc; không qua `CostAllocation` | `QĐ-49g`, dòng 7 (1) | `WF-19 a_int`; `UF-19 s_int` | Dữ liệu | `MISSING` |
| `HO-133` | Dòng *"Chưa phân bổ Cost Center"* (C6/C7) | Ràng buộc thiết kế: phần khoản chi không được hóa đơn giải thích và **không có căn cứ** không gán Cost Center — là dòng báo cáo, **không** tạo bản ghi Cost Center (giữ `FR-9.7`, `OOS-11`); khớp cam kết không đổi trạng thái cam kết | `QĐ-50c`, `FR-5.2`, `FR-9.7` | `WF-17 s_unal`; `WF-19 s_unal` | Dữ liệu báo cáo | `NEEDS_UPDATE` |
| `HO-134` | Ngân sách và báo cáo kỳ (C7) | Lịch sử sửa ngân sách (lý do bắt buộc, người, thời điểm); bản chụp báo cáo đã phát hành (bất biến, có thời điểm); nhãn *điều chỉnh kỳ trước*; **không** khóa kỳ | `QĐ-62m` | `WF-20 a_bud`; `WF-19 a_pub`; `UF-19 s_pub` | Dữ liệu | `MISSING` |
| `HO-135` | Đầu ra/nhật ký AI (C8, nếu cần) | Quyết định ở thiết kế kỹ thuật có lưu bản tóm tắt/bản nháp AI và nguồn trích không (Finance sửa bản nháp); dữ liệu gửi model phụ thuộc `OQ-26`. `US-15-01` thuộc C6, giữ riêng | `QĐ-61` (*"ERD — đầu ra/nhật ký AI nếu cần"*), `QĐ-61f` | `MF-8 s_ai, a_edit`; `WF-19 s_ai, a_edit` | Thiết kế | `NEEDS_UPDATE` |

### 7.3. Phần ERD còn đúng (không cần mục `HO-`)

`BudgetCommitment` với `INV-16`, `INV-18` và gắn ngược ngân sách; `DiscoveryEvidence`/`DiscoveryFinding` với `INV-13`; từ điển nhà cung cấp (`QĐ-38`); chuỗi `continues` (`QĐ-35c`, `QĐ-43a`); `ProvisioningTask` tách khỏi Assignment (`ADR-07`); mô hình xác thực nội bộ của Logical S0 (`QĐ-46`, `QĐ-47`); `approval_role_holders` với ba vai cấu hình (approver dự phòng giữ nghĩa *chỉ cho bước nhu cầu* — `QĐ-62c`). Vẫn phải đổi câu chữ/số khi sinh lại theo `HO-113`.

---

## 8. `user-flows/business-flow-catalog.md` — giữ làm lịch sử

**Kết luận: giữ, không xóa.** Tệp đã có nhãn *"Tài liệu lưu (chuyển chỗ 08/10/2026)… chưa đồng bộ `QĐ-49` → `QĐ-60`"* ở đầu và [index.md](index.md) mục 7 trỏ tới nó; nên thêm `QĐ-61`, `QĐ-62` vào nhãn ở giai đoạn sau (không sửa trong lượt này).

**Mã còn được trích ở nơi khác** (quét mọi tệp `.md/.json/.drawio/.py/.txt/.csv/.html` trong `Docs`, trừ chính tệp catalog và bản sao lưu `_backup-docs-2026-10-08`; tách riêng `Reviews/`, `Reports/` vì Git bỏ qua):

| Nhóm mã | Định nghĩa trong catalog | Còn được trích ở ≥ 1 tệp Git theo dõi | Tệp trích chính |
| --- | ---: | ---: | --- |
| `F-01` → `F-48` | 48 | **48 / 48** | `BE-UserStory/user-stories-and-epics.md` (cả 48), `Diagrams/use-case-diagram/use-case-specification.md` (cả 48), `Diagrams/use-case-diagram/tools/usecase_trace.py` (cả 48), `Decisions/project-decisions.md` (29), *Định nghĩa phạm vi & nghiệp vụ* (13), `Research-AI/*` (15), `Diagrams/index.md` (`F-01`, `F-24`, `F-48`), `specs/WF-14.json` + `functional-decomposition-diagram/function-tree.json` (`F-24`) |
| `BR-01.1` → `BR-47.4` | 196 | **196 / 196** | `use-case-specification.md` (196), `usecase_trace.py` (174), User Stories (170 trích trực tiếp; phần còn lại qua dải `BR-xx.1→BR-xx.y`), sổ quyết định (50), Logical ERD S0 (14), `specs/WF-06.json` + `WF-06-*.md` (`BR-04.1`, `BR-04.3`), BRD (`BR-07.7`) |

26 mã `BR` chỉ còn được trích ở đặc tả Use Case và/hoặc `usecase_trace.py` (ví dụ `BR-03.2`, `BR-12.2`→`BR-12.4`, `BR-13.1`, `BR-21.2`, `BR-31.2`, `BR-47.3`) — xóa catalog sẽ làm hỏng truy vết của Use Case. Khi viết lại Story theo tệp này, giữ mã `F`/`BR` cũ ở cột nguồn **kèm** mã sơ đồ mới (`MF`/`WF`/`UF` + node), không thay thế im lặng.

---

## 9. Mười lăm mục tác động lớn nhất

| # | Mục | Vì sao |
| --- | --- | --- |
| 1 | `HO-120` | Mô hình tổ chức Logical (phòng ban, `INV-19`, `INV-20`, bỏ `manager_id`) — chặn Story EP-01/02/03/05 và đòi thiết kế chuyển đổi module BE đã có test |
| 2 | `HO-101`, `HO-102` | Conceptual thiếu `Department`, còn `manages` — nền của mọi định tuyến và phạm vi xem |
| 3 | `HO-10` | `US-01-02` suy vai Manager từ cây — sai quyền ở mọi thao tác của trưởng phòng |
| 4 | `HO-29`, `HO-20` | Định tuyến bước nhu cầu (`QĐ-52c`) và tạo thay (`QĐ-62a`) — lõi `MF-2`, `D-1` |
| 5 | `HO-15`, `HO-16` | Import nhân sự theo phòng + chức vụ (`FR-9.7`) — bước 1 khởi tạo |
| 6 | `HO-122` | `subscription_id` NOT NULL — không lưu được quyền phần mềm nội bộ (dòng 7) |
| 7 | `HO-32` + `HO-64`/`HO-65`/`HO-66` | `US-05-06` AC-2 trái `QĐ-49h`; thiếu cổng mức kiểm soát và đường nội bộ |
| 8 | `HO-37`, `HO-48`, `HO-73`, `HO-74`, `HO-106` | Thuế và chi phí thực chịu đổi mọi con số ngân sách, cam kết, Budget vs Actual |
| 9 | `HO-02` | 110/110 tham chiếu node trong User Stories đã chết |
| 10 | `HO-121`, `HO-27` | Bỏ `Project` khỏi Cost Center — sửa ràng buộc và Story Finance |
| 11 | `HO-19`, `HO-62` | Điều chuyển phòng và rà soát 5 ngày (`MF-7`) chưa có Story đúng |
| 12 | `HO-21`, `HO-71`, `HO-136` | Nghỉ việc: bàn giao dữ liệu theo công cụ, giữ gỡ khi nghỉ đột ngột (`QĐ-62e`), `BM-08`; người xác nhận bàn giao ở bốn ca do IT thực hiện (`QĐ-63`) và ca seat chồng lấn với ghost seat (`QĐ-64`) |
| 13 | `HO-123`, `HO-69` | `C-22` trái `QĐ-54d`; vòng đời tài khoản dùng chung chưa có Story |
| 14 | `HO-84`, `HO-05` | Mobile native vào phạm vi (`QĐ-61`) — `OOS-09` sai, chưa có AC kênh mobile |
| 15 | `HO-82`, `HO-83`, `HO-51`, `HO-90` | Hai tính năng AI cam kết chưa có Story; `US-15-03/04` sai trạng thái; `OQ-26` chặn dữ liệu thật — `US-15-01` giữ riêng |

---

## 10. Kiểm chứng đã chạy và giới hạn

- Đếm Story bằng script đọc tiêu đề `#### \`US-xx-yy\`` của User Stories v0.14: **117**; phân loại từng Story bằng đọc trường *User Story*, *Business rules*, *Alternative flows*, tiêu đề AC và AC chọn lọc — **không** đọc lại từng AC của mọi Story `VALID`.
- So mã FR giữa BRD và G.1.1 của User Stories bằng script: 14 mã chỉ có ở BRD (mục `HO-03`).
- Kiểm 110 tham chiếu node trong User Stories với `specs/*.json`: 0 còn tồn tại.
- *(Lịch sử, lúc soạn 09/10)* Dump node của 50 spec hai lần (trước và sau khi nhận `QĐ-61`/`QĐ-62`): không thấy node đổi; lúc đó spec còn được sửa song song.
- *(Cập nhật 10/10/2026)* Spec đã ổn định sau lượt chốt. Đối chiếu bằng script mọi tham chiếu dạng `` `SPEC node, node` `` của tệp này với `specs/*.json` hiện hành: **sửa một tham chiếu sai** (`HO-40`: `UF-08 t_fail_c` → `d_fix, s_close, t_fail`). Hai nhóm không tính là lỗi: các mã node cũ của User Stories liệt kê có chủ đích ở mục `HO-02` (đã chết), và chú thích trong ngoặc vuông kèm mã node (ví dụ `WF-19 d_type [internal cost item]`). Mã node ở `HO-46`, `HO-49`, `HO-84` tồn tại trong spec hiện hành. Spec nào đổi sau ngày này phải đối chiếu lại.
- Grep `HO-<số>` trong `Docs` và `Code`: không có trước tệp này.
- Grep mã `F-xx`, `BR-xx.x` ngoài catalog (mục 8).
- **Không** chạy checker ERD hay bộ sinh sơ đồ (không đổi nguồn nào). **Không** sửa tệp nào khác ngoài tệp này. *(Phạm vi lúc soạn; các lượt sửa sau của sơ đồ ghi ở verification §7.9–7.10.)*
- *(Lịch sử)* Tệp BRD đọc lúc soạn chưa thấy dấu v3.30; BRD hiện hành đã là v3.30 (header, 09/10/2026). Nếu BRD đổi/thêm mã FR sau này, cập nhật `HO-03`.
- **Link gãy nằm ngay trong đầu vào bàn giao (đo 10/10/2026 so với HEAD `db15eb4`, không phải lỗi mới của lượt này — chi tiết `Reviews/diagram-links-baseline-2026-10-10.md`, thư mục không theo dõi git):** User Stories v0.14 — 3 link tới tài liệu BE đã gỡ ở commit BE `6396bbf`; `LOGICAL-ERD-S0.md` — 42 link (37 tới tài liệu BE đã gỡ, 5 tới PNG/PDF xuất); Conceptual ERD v4.2 — 1 link PNG; `ERD/README.md` — 3 link PNG/PDF. Các link BE ở US và Logical **chưa có chú thích gỡ** như sổ quyết định; nội dung còn trên nhánh `main`/`origin/main`/`feat/native-schema` của repo BE và ở `6396bbf^` trên `dev`. PNG/PDF của ERD đã bị bỏ khỏi theo dõi git ở `a24813b`; nguồn `.drawio` và manifest còn. Giai đoạn ERD/US phải chọn: chú thích lịch sử, trỏ tới bản còn lại, hoặc tái xuất PNG/PDF — lượt này không sửa.
- *(Cập nhật 10/10/2026, sau `QĐ-63`)* Sinh lại `.md` của 16 spec đã sửa chữ; `.drawio`/PNG không đổi byte. Mã node của `HO-136` (`WF-09a d_dl, s_ask, e_hc`; `WF-08 c_rec`; `MF-4 c_all, c_excess`; `WF-15 c_rec`; `WF-16 c_exec`; `WF-17 c_recl`; `WF-13 c_reclaim`; `UF-12 r_recl`; `UF-20 r_recl`) đối chiếu lại với `specs/*.json` hiện hành bằng script — xem verification §7.11. Spec nào đổi sau ngày này phải đối chiếu lại.
- **Trạng thái cuối bàn giao (10/10/2026, sau `QĐ-63`, `QĐ-64`):** 106 mục `HO-` là **danh sách việc cho giai đoạn sau, không có mục nào đã được triển khai** — không phải bằng chứng ERD/US đã đồng bộ. Mốc nhận bàn giao: bộ sơ đồ sẵn sàng đọc/review (verification §7.10, §7.11); ERD v4.2/Logical 0.10 và User Stories v0.14 vẫn là bản cũ. Cách bắt đầu giai đoạn sau: mục 11.

---

## 11. Bắt đầu giai đoạn ERD + User Stories

> Thứ tự làm việc theo `QĐ-59e`, nằm trong tệp này — **không** có bản nghiệp vụ song song. Đây là thứ tự làm, không phải xác nhận ERD/US đã sẵn sàng implement; **không gói nào** được đánh dấu sẵn sàng bởi tệp này.

| Bước | Việc | Đầu vào / quy tắc | Xong khi |
| --- | --- | --- | --- |
| 1 | **Xử lý nguồn tham chiếu hỏng trong đầu vào** (mục 10): User Stories v0.14 — 3 link; `LOGICAL-ERD-S0.md` — 42 link; Conceptual ERD v4.2 — 1 link; `ERD/README.md` — 3 link | Link tới tài liệu BE đã gỡ (commit BE `6396bbf`): đánh dấu **lịch sử** kèm nơi còn bản gốc (`6396bbf^` trên `dev`, hoặc nhánh `main`/`origin/main`/`feat/native-schema`) hoặc dẫn nguồn hiện hành nếu có. PNG/PDF ERD đã bỏ theo dõi ở `a24813b`: tái xuất đúng phiên bản bằng bộ sinh khi sửa ERD ở phiên sau, hoặc dẫn `.drawio` và manifest. **Không** dựng lại ADR/tài liệu BE đã bị bỏ chỉ để link không gãy | Mỗi link hỏng có một trong ba trạng thái: lịch sử có chú thích · trỏ nguồn hiện hành · chờ tái xuất (ghi rõ phiên) |
| 2 | **Đọc QĐ/BRD đã chốt và 106 mục `HO-`**, gom theo phụ thuộc nghiệp vụ | Thứ tự phụ thuộc (theo mục 9 và các mục 4, 7): **(a)** tổ chức/tài khoản/nhân sự — EP-01 → EP-03, `Department` (`HO-120`, `HO-101`, `HO-102`, `HO-10`, `HO-15`, `HO-16`, `HO-121`) → **(b)** danh mục/gói/thuê bao — EP-04 (`HO-122`, `HO-123`) → **(c)** yêu cầu/duyệt/duyệt chi — EP-05, EP-06 (`HO-29`, `HO-20`, `HO-32`) → **(d)** cấp phát/thu hồi/bàn giao — EP-07 (`HO-40`, `HO-136`) và phần vòng đời nhân sự của EP-03: nghỉ việc, điều chuyển (`HO-21`, `HO-71`, `HO-19`, `HO-62`) → **(e)** usage/lãng phí/thiết bị — EP-08 → EP-10 → **(f)** gia hạn/chi tiêu/thuế/đối soát — EP-11 → EP-13 (`HO-37`, `HO-48`, `HO-73`, `HO-74`, `HO-106`) → **(g)** quyền dữ liệu, Mobile, AI — EP-14, EP-15 (`HO-84`, `HO-05`, `HO-82`, `HO-83`, `HO-51`, `HO-135`) | Mỗi nhóm có danh sách `HO-` và quyết định/BRD làm căn cứ; không mục nào bị bỏ sót hoặc đếm hai lần |
| 3 | **Review/sửa User Stories và AC; đồng bộ Conceptual/Logical** theo nguồn mới | Thứ tự căn cứ `QĐ` → BRD → sơ đồ. **Không** lấy schema/Prisma hay Logical S0 cũ làm chuẩn ngược. `HO-136`: AC phân biệt người ghi xác nhận, người sở hữu dữ liệu và kết quả thu hồi (`QĐ-63b`) | User Stories bản mới và ERD bản mới được Owner review; các mục `STALE`/`MISSING` đã có kết cục (sửa, thay, hoặc ghi lý do giữ) |
| 4 | **Sau review thiết kế mới**, mới lập spec/plan/test và chia gói code | Readiness **theo từng gói**, không gọi cả ERD/US là sẵn sàng. Mobile/AI cần thiết kế kỹ thuật riêng (`QĐ-61`) | Có bảng readiness theo gói; chỉ gói nằm trong bảng đó mới được implement |

### 11.1. Ngoài phạm vi bàn giao này — người xử lý và mức chặn

| Mục | Người xử lý | Mức chặn |
| --- | --- | --- |
| `OQ-26` — điều kiện gửi dữ liệu thật tới model (`HO-90`) | Phiên AI cùng Owner; **chưa cho phép** gửi dữ liệu thật tới model ngoài (`QĐ-61f`) | **Không** chặn review nghiệp vụ lõi; chặn AC dữ liệu `HO-82`, `HO-83`, ERD nhật ký AI `HO-135` và mọi lần gọi model với dữ liệu thật |
| Report 1 §6 | **Nhóm tự sửa** theo quy định của trường (không dùng AI viết; không soạn đoạn nộp thay nhóm); checklist có sẵn ở `Reports/report-1/section-6-project-scope-and-limitations.md` | Không chặn ERD/US; chặn việc coi Report 1 đã đồng bộ |
| Bản đăng ký `SU26SE166_…_vi.md` / DOCX của Owner | **Owner** phân loại *lịch sử* hay *bản nháp hiện hành*; giữ nguyên tới lúc đó | Không chặn ERD/US; chặn việc xử lý câu *mobile ngoài MVP* trong bản này |
| Điểm lệch L-1 → L-6 | **Owner** báo GVHD, lưu phản hồi thực tế; kết luận ghi bằng mã `QĐ` mới | Không chặn thiết kế; kết luận của GVHD có thể đổi phạm vi |
| Autosave `.bkp` của FDD | **Owner** quyết xóa; giữ khi chưa có yêu cầu dọn rõ | Không chặn nghiệp vụ |

---

## 12. Kết cục sau lượt thiết kế lại 10–11/10/2026

> **Cập nhật 11/10/2026 sau `QĐ-66`:** các mục chặn bởi câu hỏi Owner đã được trả lời chuyển `DONE`; còn `PARTIAL` chỉ khi còn `OQ-26`/`OQ-G-06` hoặc câu chưa hỏi.
>
> **Phạm vi lượt này (điều chỉnh của Owner 11/10/2026):** User Stories + AC (ưu tiên cao nhất) và Conceptual ERD. **Use Case hoãn** sang phiên sau — mọi mục HO có tác động Use Case vẫn **mở ở đầu ra Use Case**; không mục nào được tuyên bố đã đồng bộ Use Case. **Logical ERD không vẽ lại** — các mục `HO-120` → `HO-135` và phần Logical của mục khác vẫn **mở**. Kết cục dưới đây là của trợ lý theo nguồn; **không** phải phê duyệt của Owner hay GVHD.
>
> **Đầu ra:** [User Stories v0.15](../BE-UserStory/user-stories-and-epics.md) (tệp sinh từ `BE-UserStory/src/`) · [Conceptual ERD v5.1](<../ERD/CONCEPTUAL ERD - DANH SÁCH ENTITY.md>) (mức tổng thể, `QĐ-65`; ánh xạ 32 thực thể v5.0 ở mục 6.1) · [index ERD](../ERD/README.md). Mục này sinh bởi [`tools/build_handoff12.py`](tools/build_handoff12.py) — sửa dữ liệu kết cục ở đó. Báo cáo bàn giao chi tiết (checker, ảnh đã xem, review độc lập): `Reviews/us-erd-uc-redesign-2026-10-10/HANDOFF.md` (thư mục bị Git bỏ qua).

**Chú giải:** `DONE` = viết đủ theo nguồn (AC suy ra **bắt buộc** từ quy tắc có sẵn ghi nguồn + lập luận ở Story) · `PARTIAL` = còn câu hỏi chặn **hoặc** AC là đề xuất chờ Owner xác nhận (ghi mã; im lặng không phải duyệt) · `OPEN` = việc của phiên sau · `—` = không thuộc đầu ra đó.

**Đếm đầu ra User Stories trên 106 mục:** `DONE` 74, `PARTIAL` 3 (mục có kết cục US); 16 mục `HO-120` → `HO-135` là Logical (không thuộc US). **Conceptual:** mẫu số là **14 mục có kết cục Conceptual riêng** (`HO-101` → `HO-113`, `HO-135`): 13 `DONE`, 1 `PARTIAL` (`HO-135`); 21 mục khác chỉ *phản ánh* qua các mục đó (cột Conceptual ghi mục nhận); `HO-120` → `HO-134` thuộc Logical, **không** tính vào mẫu số Conceptual.

| HO | Story / vị trí | User Stories v0.15 | Conceptual v5.1 | Logical / BE |
| --- | --- | --- | --- | --- |
| `HO-01` | đầu tài liệu | `DONE` | — | — |
| `HO-02` | mọi Epic | `DONE` | — | — |
| `HO-03` | mục G (sinh tự động) | `DONE` | — | — |
| `HO-04` | mọi Epic | `DONE` | — | — |
| `HO-05` | D.16 | `DONE` | — | — |
| `HO-10` | `US-01-02` | `DONE` | phản ánh ở `HO-101` | OPEN — xem `HO-120`→`HO-135` |
| `HO-11` | `US-01-01` | `DONE` | — | — |
| `HO-12` | `US-01-04` | `DONE` | — | — |
| `HO-13` | `US-01-05` | `DONE` | — | — |
| `HO-14` | `US-01-09` | `DONE` | — | — |
| `HO-15` | `US-02-02` | `DONE` | phản ánh ở `HO-101` | OPEN — xem `HO-120`→`HO-135` |
| `HO-16` | `US-02-03` | `DONE` | phản ánh ở `HO-101` | OPEN — xem `HO-120`→`HO-135` |
| `HO-17` | `US-02-04` | `DONE` | — | — |
| `HO-18` | `US-02-05` | `DONE` | — | — |
| `HO-19` | `US-03-01` | `DONE` | phản ánh ở `HO-101` | OPEN — xem `HO-120`→`HO-135` |
| `HO-20` | `US-03-02` | `DONE` | — | — |
| `HO-21` | `US-03-04` | `DONE` | — | — |
| `HO-22` | `US-03-05` | `DONE` | — | — |
| `HO-23` | `US-04-01` | `DONE` | — | — |
| `HO-24` | `US-04-02` | `DONE` | — | — |
| `HO-25` | `US-04-03` | `DONE` — `OQ-B-07`, `OQ-B-06` đóng theo nguồn (11/10) | — | — |
| `HO-26` | `US-04-04` | `DONE` | — | — |
| `HO-27` | `US-04-09` | `DONE` | phản ánh ở `HO-121` | OPEN — xem `HO-120`→`HO-135` |
| `HO-28` | `US-05-01`, `US-05-02` | `DONE` | — | — |
| `HO-29` | `US-05-03` | `DONE` — `OQ-C-05` — Owner chọn `QĐ-66k` | — | — |
| `HO-30` | `US-05-04` | `DONE` | — | — |
| `HO-31` | `US-05-05` | `DONE` | — | — |
| `HO-32` | `US-05-06` | `DONE` — `OQ-C-01` — Owner chọn `QĐ-66j` | — | — |
| `HO-33` | `US-05-09` | `DONE` | — | — |
| `HO-34` | `US-05-12` | `DONE` | — | — |
| `HO-35` | `US-05-13` | `DONE` — `OQ-A-23` — Owner chọn `QĐ-66p` | — | — |
| `HO-36` | `US-05-15` | `DONE` | — | — |
| `HO-37` | `US-06-01`, `-05`, `-06`, `-09` | `DONE` | — | — |
| `HO-38` | `US-06-04` | `DONE` | — | — |
| `HO-39` | `US-07-01`, `US-07-02` | `DONE` | — | — |
| `HO-40` | `US-07-03`, `US-07-04` | `DONE` | — | — |
| `HO-41` | `US-07-05` | `DONE` | — | — |
| `HO-42` | `US-07-07` | `DONE` | phản ánh ở `HO-110` | OPEN — xem `HO-120`→`HO-135` |
| `HO-43` | `US-08-06`, `-08`, `US-09-06`, `-09` | `DONE` | — | — |
| `HO-44` | `US-09-01`, `US-09-03` | `DONE` | phản ánh ở `HO-109` | OPEN — xem `HO-120`→`HO-135` |
| `HO-45` | `US-10-06`, `-07`, `US-12-05`, `US-14-05` | `DONE` | — | — |
| `HO-46` | `US-11-01`→`US-11-03` | `DONE` | — | — |
| `HO-47` | `US-12-01` | `DONE` | — | — |
| `HO-48` | `US-12-02` | `DONE` | — | — |
| `HO-49` | `US-13-05`, `US-13-06` | `DONE` | — | — |
| `HO-50` | `US-13-07` | `DONE` | — | — |
| `HO-51` | `US-15-02`→`-04` `RETIRED` | `DONE` | — | — |
| `HO-60` | `US-03-06` | `DONE` | phản ánh ở `HO-101` | OPEN — xem `HO-120`→`HO-135` |
| `HO-61` | `US-04-10` | `DONE` | phản ánh ở `HO-107` | OPEN — xem `HO-120`→`HO-135` |
| `HO-62` | `US-03-07` | `DONE` | — | — |
| `HO-63` | `US-05-17` | `DONE` — `OQ-C-03` — `QĐ-66m`; cách lưu phần theo người (`OQ-C-09`) ở thiết kế C4 | — | — |
| `HO-64` | `US-05-18` | `DONE` — `OQ-C-10` — Owner chọn `QĐ-66l` | — | — |
| `HO-65` | `US-05-19` | `DONE` | — | — |
| `HO-66` | `US-05-20` (+ `US-04-01/02`) | `DONE` — `OQ-C-12`, `OQ-C-13` đóng theo nguồn (11/10) | phản ánh ở `HO-104` | OPEN — xem `HO-120`→`HO-135` |
| `HO-67` | `US-04-11` | `DONE` — `OQ-B-12` — `QĐ-66al`; mốc rà soát (`OQ-B-11a`) ở thiết kế | phản ánh ở `HO-104` | OPEN — xem `HO-120`→`HO-135` |
| `HO-68` | `US-04-12` | `DONE` | phản ánh ở `HO-105` | OPEN — xem `HO-120`→`HO-135` |
| `HO-69` | `US-07-08` | `DONE` | phản ánh ở `HO-108` | OPEN — xem `HO-120`→`HO-135` |
| `HO-70` | `US-03-08` | `DONE` | — | — |
| `HO-71` | `US-03-09` | `DONE` | — | — |
| `HO-72` | `US-01-11` | `DONE` | — | — |
| `HO-73` | `US-12-09` | `DONE` — `OQ-B-06` đóng theo nguồn; phí thẻ/tỷ giá `QĐ-66y` | phản ánh ở `HO-106` | OPEN — xem `HO-120`→`HO-135` |
| `HO-74` | `US-12-10` | `DONE` — `OQ-F-07` — `QĐ-66y` | phản ánh ở `HO-106` | OPEN — xem `HO-120`→`HO-135` |
| `HO-75` | `US-12-11` | `DONE` — `OQ-F-09` đóng theo nguồn (`FR-5.3`) | phản ánh ở `HO-132` | OPEN — xem `HO-120`→`HO-135` |
| `HO-76` | `US-12-12` | `DONE` — `OQ-F-11` — `QĐ-66z` | phản ánh ở `HO-133` | OPEN — xem `HO-120`→`HO-135` |
| `HO-77` | `US-12-13` | `DONE` — `OQ-A-12` — `QĐ-66e` | — | — |
| `HO-78` | `US-12-14` | `DONE` — `OQ-F-12` — `QĐ-66aa`; `OQ-F-13` — `QĐ-66ab` | phản ánh ở `HO-134` | OPEN — xem `HO-120`→`HO-135` |
| `HO-79` | `US-12-15` | `DONE` | — | — |
| `HO-80` | `US-01-12` | `DONE` | phản ánh ở `HO-112` | OPEN — xem `HO-120`→`HO-135` |
| `HO-81` | `US-11-05` | `DONE` | phản ánh ở `HO-111` | OPEN — xem `HO-120`→`HO-135` |
| `HO-82` | `US-15-05` | `PARTIAL` — `OQ-26` chặn-thiết-kế (AC ép dữ liệu giả lập) | — | — |
| `HO-83` | `US-15-06` | `PARTIAL` — `OQ-26` chặn-thiết-kế; `OQ-G-07` — `QĐ-66ac` | — | — |
| `HO-84` | `US-16-01`→`US-16-04` | `DONE` — `OQ-G-10` — `QĐ-66o` | — | — |
| `HO-90` | `US-15-05`, `US-15-06` | `PARTIAL` — `OQ-26` vẫn **chờ Owner** | — | — |
| `HO-91` | `US-02-02`, `US-03-04` | `DONE` — Story xong; sổ đã ghi *bị thay một phần* cho `QĐ-40a/40c/48b/48d` (11/10) | — | — |
| `HO-92` | `US-03-01`, `US-03-06` | `DONE` | — | — |
| `HO-93` | `US-05-06`, `US-06-01` | `DONE` | — | — |
| `HO-101` | — | — | `DONE` — `Department` + *belongs to*, *headed by*, *supported by*, *charged to* | OPEN — Logical chưa vẽ lại |
| `HO-102` | — | — | `DONE` — bỏ *manages*, *funds*; định nghĩa mới | OPEN — Logical chưa vẽ lại |
| `HO-103` | — | — | `DONE` — 20 bất biến, `INV-19`, `INV-20`; `INV-14a/b` suy ra | OPEN — Logical chưa vẽ lại |
| `HO-104` | — | — | `DONE` — `Plan` là hộp | OPEN — Logical chưa vẽ lại |
| `HO-105` | — | — | `DONE` — kho khóa: mô tả `Subscription`/`LicenseAssignment` + ánh xạ mục 6.1; bảng ở Logical (`HO-125`) | OPEN — Logical chưa vẽ lại |
| `HO-106` | — | — | `DONE` — `Invoice` hộp; hồ sơ thuế thuộc `Vendor`; dòng thuế chi tiết `Invoice` | OPEN — Logical chưa vẽ lại |
| `HO-107` | — | — | `DONE` — *standardizes* (`Department` → `Plan`); chức vụ là thuộc tính | OPEN — Logical chưa vẽ lại |
| `HO-108` | — | — | `DONE` — *holds* + thành viên dùng chung (mô tả, Logical); `Unit`/`Company` | OPEN — Logical chưa vẽ lại |
| `HO-109` | — | — | `DONE` — thiết bị: mô tả `UsageRecord` + ánh xạ mục 6.1; sổ thiết bị, xác nhận ở Logical | OPEN — Logical chưa vẽ lại |
| `HO-110` | — | — | `DONE` — hồ sơ sai lệch: vòng đời ghi ở ánh xạ mục 6.1; bảng ở Logical | OPEN — Logical chưa vẽ lại |
| `HO-111` | — | — | `DONE` — `RenewalDecision` | OPEN — Logical chưa vẽ lại |
| `HO-112` | — | — | `DONE` — 1..* người thụ hưởng; quyết theo từng người `QĐ-66m`; cách lưu phần theo người ở Logical C4 (`OQ-C-09`) | OPEN — Logical chưa vẽ lại |
| `HO-113` | — | — | `DONE` — v5.1 (`QĐ-65`), README, manifest, checker, script, bộ ghép mô tả trong `ERD/tools/` | OPEN — Logical chưa vẽ lại |
| `HO-120` | — | — | — | OPEN — phiên Logical |
| `HO-121` | — | — | — | OPEN — phiên Logical |
| `HO-122` | — | — | — | OPEN — phiên Logical |
| `HO-123` | — | — | — | OPEN — phiên Logical |
| `HO-124` | — | — | — | OPEN — phiên Logical |
| `HO-125` | — | — | — | OPEN — phiên Logical |
| `HO-126` | — | — | — | OPEN — phiên Logical |
| `HO-127` | — | — | — | OPEN — phiên Logical |
| `HO-128` | — | — | — | OPEN — phiên Logical |
| `HO-129` | — | — | — | OPEN — phiên Logical |
| `HO-130` | — | — | — | OPEN — phiên Logical |
| `HO-131` | — | — | — | OPEN — phiên Logical |
| `HO-132` | — | — | — | OPEN — phiên Logical |
| `HO-133` | — | — | — | OPEN — phiên Logical |
| `HO-134` | — | — | — | OPEN — phiên Logical |
| `HO-135` | — | — | `PARTIAL` — ánh xạ; lưu hay không chờ `OQ-G-06` | OPEN — phiên Logical |
| `HO-136` | `US-07-09` (+ 8 Story giao điểm) | `DONE` — `OQ-D-06` — `QĐ-66u`; thuê bao hết hạn `QĐ-66v`; *hạn ngắn* ở thiết kế | phản ánh ở `HO-128` | OPEN — xem `HO-120`→`HO-135` |
