# SaaS-Sentry — User Flows nghiệp vụ chi tiết

> ⚠️ **Tài liệu lưu (chuyển chỗ 08/10/2026).** Đây là phần 0–10 của tài liệu *User Flows nghiệp vụ* cũ (`user-flows/index.md` tới v0.13), giữ **nguyên văn** để truy vết bảng chốt phạm vi `F-01` → `F-48` (số đếm `42 / 4 / 2` mà Định nghĩa phạm vi mục 5.2 dẫn) và các quy tắc `BR-xx.x` mà sổ quyết định, BRD và User Stories trích dẫn.
>
> - Nội dung **chưa đồng bộ** `QĐ-49` → `QĐ-60` (vẫn dùng cây quản lý trực tiếp, chưa có phòng ban, cổng mức kiểm soát, thuế ghi nhận…). Khi khác nhau, **sổ quyết định → BRD v3.29 → sơ đồ hiện hành** thắng; tài liệu này **không** phủ định chúng.
> - Ký hiệu `MF-0` → `MF-5` trong tài liệu này là **bộ cũ, khác nghĩa** với 5 main flow hiện hành — bảng chuyển đổi ở [main-flow-selection.md mục 5.2](../main-workflows-activity-diagram/main-flow-selection.md).
> - Phần 11 (user flow mức màn hình) cũ đã được thay bằng bộ `UF-01` → `UF-21` mới: [index](index.md).
> - Đồng bộ nội dung F-xx/BR-xx với quyết định mới thuộc giai đoạn ERD + User Stories (`QĐ-59e`).



> **Cập nhật 05/10/2026 (`QĐ-48a`→`QĐ-48c` — Owner chốt qua prompt phiên; chưa phải xác nhận GVHD; không tăng số phiên bản, không đổi phạm vi `48` = `43 / 3 / 2`):** `UF-09` vẽ lại từ Mermaid (18 → 34 nút): thêm nhánh *đổi ngày làm việc cuối* và *hủy bàn giao*, hai lối chuyển *Đã nghỉ việc* (S0 IT làm tay, S2 hệ thống tự chuyển khi tới ngày cuối — `QĐ-41a`) và các lối từ chối; **sửa thứ tự** — đăng ký thiết bị (`BR-45.7`) và `G2` chỉ sau *Đã nghỉ việc*, không còn ngay khi bắt đầu bàn giao hay khi chỉ qua ngày cuối (`US-03-04` AC-10/AC-12, `US-09-08`). Mục `F-05` (2.5) thêm ngoại lệ tương ứng. `.drawio`, HTML, PDF sinh lại bằng tool. Các `UF` khác không đổi.

> **Phiên bản:** 0.13 — 04/10/2026, **`UF-17`** mới: kích hoạt tài khoản, đăng nhập, quên/đặt lại/đổi mật khẩu với đủ trạng thái liên kết hết hạn/đã dùng/bị thay thế, từ chối chung, tạm thời từ chối và bị khóa/nghỉ việc (`QĐ-46`, `QĐ-47`; `US-01-10`; sáu mã màn hình `SYS-06`→`SYS-11` mới) — **không** đổi phạm vi (`48` = `43 / 3 / 2`) · *(0.12 và 0.11 dưới đây)* · *(0.11 — 30/09/2026, **`UF-12`** thêm nhánh đối soát từng khoản chi (`QĐ-33`, `US-13-07`) · *(0.10 đồng bộ BRD v3.15, Định nghĩa Phạm vi v1.9)* · *(0.9 đồng bộ BRD v3.14, Định nghĩa Phạm vi v1.8 — chỉ bảng chốt phạm vi mục 1.2)* · *(0.8 đồng bộ BRD v3.13, Định nghĩa Phạm vi v1.7)* · *(0.7 đồng bộ BRD v3.10, Định nghĩa Phạm vi v1.6)* · *(0.6 đồng bộ BRD v3.9, Định nghĩa Phạm vi v1.5)* · *(0.5 đồng bộ BRD v3.8, Định nghĩa Phạm vi v1.4)* · *(v0.4 đồng bộ BRD v3.5, Định nghĩa Phạm vi v1.1, Context Diagram v0.1, UI Spec v0.1)*
>
> **Thay đổi ở v0.12 — 30/09/2026 tối (trợ lý theo yêu cầu Owner; không phải xác nhận của mentor/GVHD):** vẽ lại **`UF-15`** từ Mermaid — `APV-01` có đủ **bốn loại việc** mà các luồng khác gửi tới: yêu cầu có chi phí/SaaS mới, kỳ gia hạn, **khoản chi chưa có căn cứ** (từ `UF-12`, `QĐ-33b`; người giữ thẻ là Người duyệt chi ⟹ người thay thế, `SoD-7`) và **hồ sơ hợp thức hóa** (tham chiếu `UF-12`, `DQ-06`) — 22 → 31 nút. **Chốt sáu mã màn hình** đang ghi *dự kiến* theo quy ước tiền tố vai + số thứ tự: `APV-01`→`APV-03`, `FIN-07`, `ITA-16`, `EMP-05` (kiểm trùng toàn tài liệu). `UF-12` chỉ đổi nhãn nút `r1` (bỏ *dự kiến*). SLA cho quyết định khoản chi chưa có căn cứ **chưa có nguồn** — để mở, không vẽ.
>
> **Thay đổi ở v0.11 — 30/09/2026, `QĐ-33` (Owner giao trợ lý tiếp nhận `HANDOFF`; không phải xác nhận của mentor/GVHD):** vẽ lại **`UF-12`** từ Mermaid — nhà cung cấp đã được duyệt không còn kết thúc luồng: **từng khoản chi** được đối soát với căn cứ phê duyệt; ngoại lệ (không có căn cứ · ngoài thời hạn · vượt số tiền lũy kế · nhiều căn cứ · khác tiền tệ · căn cứ thiếu dữ liệu) vào màn **`FIN-07` Đối soát khoản chi** *(mã dự kiến)*; Finance/IT liên kết căn cứ (hệ thống kiểm lại, không che phần vượt), đánh dấu lỗi tính tiền, hoặc chuyển **`APV-01` → `APV-02`** — chỉ Người duyệt chi (hoặc người thay thế khi `SoD-7`) chấp nhận/không chấp nhận, kết cục chỉ tạo nhiệm vụ. Tên hiển thị *Đối soát chi phí phần mềm* (`QĐ-33a`), mã giữ nguyên. 20 → 35 nút. `generate-uf-drawio.py UF-12` (K1–K10 pass, draw.io render K9/K10 pass) rồi `export-user-flows.py` sinh lại HTML + PDF; đã xem PNG và HTML (sáng/tối). **Còn lệch nhỏ đã biết:** sơ đồ `UF-15` chưa vẽ loại việc thứ ba *khoản chi chưa có căn cứ* ở `APV-01` — luồng đầy đủ đọc ở `UF-12`.
>
> **Thay đổi ở v0.10 — 29/09/2026, `QĐ-31`, `QĐ-32` (Owner / trợ lý theo ủy quyền; không phải xác nhận của mentor/GVHD):** vẽ lại **`UF-12`** từ Mermaid *(chỉ nguồn CSV; ca mơ hồ/không khớp vào hàng đợi review với một lý do chính; **gợi ý AI tin cậy Thấp, IT xác nhận**; quyết định hợp thức hóa ở **Người duyệt chi** `APV-02` — sửa lệch cũ *“Quyết định của IT?”* trái `DQ-06`; 22 → 20 nút)* và **`UF-16`** *(tiện ích **và agent phiên người dùng**, phút bao phủ, `Gap` không tính, cổng nhận bằng credential thiết bị; topology giữ nguyên)*; sửa mục **6.3** (`F-31`/`F-32` — `F-32` giai đoạn sau, Người duyệt chi quyết), **6.4** (`F-34` bước 1 thuộc Người duyệt chi), **7.8** (`F-46` giai đoạn sau), **7.10** (`F-48` hiện thực mức demo). `tools/generate-uf-drawio.py UF-12 UF-16` (K1–K10 pass) rồi `tools/export-user-flows.py` sinh lại HTML + **PDF 16 trang**; `check-user-flow-syntax.py` 16/16 pass.
>
> **Thay đổi ở v0.9 — `QĐ-31a`, `QĐ-31b`, Owner chốt 28/09/2026 (không phải xác nhận của mentor/GVHD):**
>
> - **Đổi phạm vi ở bảng 1.2:** `F-32` *(phát hiện từ export IdP)* và `F-46` *(phát hiện từ bộ thu thập)* **✅ → 📐 giai đoạn sau** — `MF-6` (bộ main workflows) chỉ hiện thực nguồn CSV `F-31`. `F-48` *(agent trên máy)* **📐 → ✅ mức demo**, chạy trong phiên người dùng, không service/installer. Nguồn **OpenTelemetry của client AI** (`FR-4.20`) là một nguồn usage mới của `F-17`, đăng ký thiết bị theo `F-45`; **không** tạo mã luồng mới. Tổng **`48` = `42 / 4 / 2`**.
> - ⚠️ **Hai hệ số `MF` khác nhau:** cột *MF* ở tài liệu này (mục 1.4→1.9) là nhóm luồng của User Flows — phát hiện ngoài danh mục thuộc **`MF-5` Minh bạch chi tiêu** ở đây. Bộ sơ đồ trình bày [main workflows](../main-workflows-activity-diagram/index.md) gọi cùng nội dung đó là **`MF-6` Shadow IT Discovery**; `MF-3` của bộ đó trùng nghĩa với `MF-3` ở đây. Khi trao đổi, ghi rõ bộ nào.
> - ~~**Chưa làm:** sơ đồ `UF-12`, `UF-16`, `F-32`, `F-46`, `F-48` và HTML/PDF **chưa** vẽ lại~~ — **đã làm ở v0.10** (29/09/2026).
>
> **Thay đổi ở v0.8 — quyết định của Owner trong phiên dựng lại Use Case, 25/09/2026 (không phải xác nhận của mentor/GVHD):**
>
> - **Thêm 31 quy tắc** vào đúng bảng của luồng sở hữu: `BR-01.5`–`BR-01.7`, `BR-05.6`, `BR-06.6`–`BR-06.9`, `BR-07.11`, `BR-13.11`, `BR-13.12`, `BR-20.6`, `BR-20.7`, `BR-26.4`, `BR-27.5`, `BR-29.8`, `BR-29.9`, `BR-31.6`, `BR-34.3`, `BR-36.5`–`BR-36.8`, `BR-38.3`, `BR-40.4`–`BR-40.8`, `BR-42.7`, `BR-45.8`. Mỗi dòng ghi quyết định nguồn (`OI-xx`) hoặc yêu cầu BRD đã có (`BF-04`: `FR-5.8a`, `INV-18`, `FR-9.7`).
> - **Làm rõ, giữ mã và nghĩa:** `BR-07.4`, `BR-15.1`, `BR-39.4` (xác nhận tường minh của Manager — OI-07a), `BR-09.3` (ý kiến không chặn — OI-05a), `BR-45.5` (N = 5 — OI-14b).
> - **Đồng bộ câu chữ:** bảng bốn nhóm mục 4.3 — `G1` do Người duyệt chi quyết tại kỳ gia hạn (`BF-03`); sơ đồ `F-26` thêm Người duyệt chi ở mốc T−15 (`BF-08`); mục đích `F-45` theo danh mục + từ điển (`BF-05`); mục 10 câu 2 và 7 đã chốt.
> - **Không đổi phạm vi** (`48` = `43 / 3 / 2`) và **không** vẽ lại `UF`/HTML/PDF: không `UF` nào đổi bước. Mô hình Use Case dẫn các mã này ở `Docs/Diagrams/use-case-diagram/use-case-specification.md`.
>
> **Thay đổi ở v0.7 — theo `QĐ-29a`, `QĐ-29b`, Owner chốt 15/09/2026:**
>
> - **Tài chính không nằm trên đường duyệt** (`QĐ-29b`): Người duyệt chi quyết trên **snapshot ngân sách**, có thể **hỏi Tài chính** (SLA không dừng); hệ thống tạo khoản cam kết khi duyệt; **Tài chính ghi nhận ∥ IT cấp phát**. Viết lại `MF-2` B2.5/B2.5b, `MF-4` B4.3, `F-07`/`F-08`, `F-09`, `F-27`; sửa `BR-03.4`, `BR-07.6`, `BR-07.9`, `BR-09.3`, `BR-09.4`, `BR-27.4`; mục 8, 9.
> - **Nhánh không phát sinh chi phí không qua Người duyệt chi** — Owner xác nhận (`QĐ-29a`); `F-47` báo cáo quy trình thêm tổng hợp suất cấp theo nhánh này. Đóng BRD `OQ-19`, `OQ-20`.
> - Phần 11: **`UF-11`** vẽ lại và đổi tên *Tài chính kiểm soát ngân sách và theo dõi kỳ gia hạn*; **`UF-15`** vẽ lại (snapshot, nhánh hỏi Tài chính); **`UF-02`** đổi thứ tự; **`UF-08`**, **`UF-10`** đảo thứ tự hai tham chiếu; `UF-01`, `UF-04` đổi nhãn. `.drawio`, HTML, PDF sinh lại bằng tool; HTML có **lọc theo vai trò**.
> - **Không đổi phạm vi:** vẫn `48` = `43 / 3 / 2`.
>
>
> **Thay đổi ở v0.6 — theo `QĐ-27`, `QĐ-28a` → `QĐ-28d`, nhóm trưởng chốt 15/09/2026:**
>
> - **Bỏ ủy quyền duyệt** (`QĐ-27`): `F-13` **giữ mã**, viết lại thành *Xử lý bước duyệt nghẽn, xung đột lợi ích và xác định lại người duyệt*; `BR-13.1`, `BR-13.3`, `BR-13.5`, `BR-13.7` **nghỉ hưu**; thêm `BR-13.8` → `BR-13.10`. `MF-2`, `F-07`/`F-08`, mục 8, 9 sửa theo.
> - **Escalate chỉ là thông báo**; chỉ xác định lại người duyệt khi dữ liệu tổ chức hoặc cấu hình vai trò đổi thật (`QĐ-28d`) — `BR-07.7`, `BR-13.9`.
> - **Người thay thế khi Người duyệt chi xung đột lợi ích**, Quản trị hệ thống cấu hình trước (`QĐ-28c`) — `BR-13.10`.
> - **GitHub đo sử dụng bằng lịch sử commit và tiện ích trình duyệt**, audit log không là nguồn usage (`QĐ-28a`) — `F-17`. **Tiện ích demo bằng load unpacked** (`QĐ-28b`) — `F-45`.
> - Phần 11: **`UF-04`** vẽ lại (bỏ nhánh ủy quyền và màn hình `MGR-06`); `UF-15`, `UF-13` đổi nhãn; `UF-01` sửa bảng truy vết. `.drawio`, HTML, PDF sinh lại bằng tool.
> - **Không đổi phạm vi:** vẫn `48` = `43 / 3 / 2`.
>
> **Thay đổi ở v0.5 — theo `QĐ-20` → `QĐ-25`, nhóm trưởng chốt 14/09/2026:**
>
> - **Thêm tác nhân `DC` — Người duyệt chi** (mục 0.1). Viết lại `MF-2`, `F-07`/`F-08`, `F-09`, `F-27`: Tài chính **ghi ý kiến ngân sách**, Người duyệt chi **quyết**, khoản cam kết ghi song song với cấp phát (`QĐ-22`).
> - **Thêm bốn luồng:** `F-45` tiện ích trình duyệt ✅ · `F-46` phát hiện từ bộ thu thập ✅ · `F-47` báo cáo hiệu suất và chất lượng ✅ · `F-48` agent trên máy 📐. **`F-36` chuyển 📐 → ✅.** Phạm vi **`44` → `48` = `43 / 3 / 2`** (mục 1.2).
> - **Bỏ phòng ban** (`QĐ-23`): `F-03` giữ mã, đổi tên; `F-29` gom theo cost center và cây người phụ trách; `BR-20.1` bỏ cấp phòng ban.
> - `F-17`, `F-42` thêm nguồn bộ thu thập và **xác nhận chủ động**; `F-30` ghi **hoãn lớp L2** (`QĐ-25`).
> - ⚠️ **Chưa đồng bộ lúc chốt v0.5:** sơ đồ `UF` ở Phần 11, bản `.drawio`, `.png`, `.pdf`, `.html` — để phiên sau theo `QĐ-25`. Phần 11 có khối cảnh báo liệt kê từng `UF` bị ảnh hưởng. **✅ Đóng 14/09/2026, cùng ngày, lượt sau:** 16 `.drawio` sinh lại từ Mermaid, `.html`/`.pdf` xuất lại bằng `tools/export-user-flows.py`; chuỗi kiểm cũ đã được rút gọn tại `Docs/Reviews/system-decisions-baseline.md#source-review-history-summary`.
> **Viết cho ai:** cả nhóm, kể cả người không viết code. Tài liệu mô tả **ai làm gì, hệ thống phản hồi ra sao, và quy tắc nào chi phối** — không nhắc màn hình, bảng dữ liệu hay công nghệ.
> **Vì sao tách khỏi màn hình:** thiết kế giao diện còn đổi nhiều lần; luồng nghiệp vụ thì không. Gắn hai thứ vào nhau khiến mỗi lần đổi nút bấm lại phải sửa tài liệu nghiệp vụ.
>
> **Thay đổi ở v0.3 — bổ sung tầng main flow, sửa bốn lỗi tồn:**
>
> - **Bổ sung mục 1.3 → 1.11: sáu Main Flow tổng `MF-0` → `MF-5`.** Trước v0.3, tài liệu nhảy thẳng từ bản đồ năm luồng giá trị vào 43 luồng chi tiết — người đọc thấy được từng luồng nhưng không thấy được **thứ tự và chỗ nối giữa chúng**. Tầng main flow lấp đúng khoảng trống đó: mỗi main flow là một chuỗi bước end-to-end viết thuần chữ, mỗi bước trỏ xuống đúng một hoặc vài mã `F-xx` đã có.
> - **43 mã `F-xx` giữ nguyên, không đánh lại, không gộp, không tách.** BRD v3.5 và Context Diagram v0.1 đang trích các mã này; đổi mã sẽ tạo mã chết ở hai tài liệu khác. Tầng main flow chỉ **thêm bên trên**, không sửa bên dưới.
> - **Số mục cũ giữ nguyên hoàn toàn.** Phần main flow được đặt bên trong Phần 1 (mục 1.3 → 1.11) chứ không chèn thành một phần mới, để mục 1.2 vẫn là *Bảng chốt phạm vi* (Context Diagram mục 8 trỏ vào đây) và mục 10 vẫn là *Cần team quyết* (Context Diagram mục 7 trỏ vào đây).
> - ⚠️ **Sửa lỗi phân loại phạm vi ở mục 1.2.** v0.2 ghi *"37 hiện thực, 5 chỉ đặc tả, 1 ngoài phạm vi"*. Đếm lại trên chính bảng đó: **38 hiện thực, 3 chỉ đặc tả (`F-16`, `F-24`, `F-36`), 2 ngoài phạm vi (`F-25`, `F-33`)**. Tổng vẫn là 43 nên lỗi không lộ ra khi cộng. **Định nghĩa Phạm vi v1.1 mục 5.2 đang chép lại con số sai này và cần sửa theo.**
> - ⚠️ **Sửa mục 0.1** — tiêu đề ghi *"Sáu tác nhân"* nhưng bảng có bảy dòng.
> - **Bổ sung `F-04` vào bản đồ mermaid mục 1.1** — v0.2 có `F-04` trong bảng phạm vi và có mục 2.4 đặc tả, nhưng thiếu trên hình.
> - **Bổ sung hai dòng `F-37`, `F-38` vào bảng tiêu chí hoàn thành mục 8** — hai luồng này ở phạm vi ✅ nhưng v0.2 không ghi tiêu chí nghiệm thu.
>>
> **Thay đổi ở v0.4 — bổ sung tầng thứ ba: user flow mức màn hình:**
>
> - **Bổ sung Phần 11: 14 user flow `UF-01` → `UF-14`**, vẽ bằng flowchart, mỗi nút là một màn hình có mã trong UI Spec. Tài liệu nay chứa **cả ba tầng** — main flow tổng (mục 1.4 → 1.9), luồng nghiệp vụ chi tiết (Phần 2 → 7), và luồng màn hình (Phần 11) — nên không còn tài liệu thứ hai để lệch.
> - **Số mục cũ giữ nguyên hoàn toàn.** Phần 11 đặt sau mục 10, không phần nào bị đánh số lại.
> - **43 mã `F-xx` và mọi mã `BR-xx.x` giữ nguyên.** Tầng `UF` chỉ nối xuống mã màn hình của UI Spec và nối lên mã `F-xx` đã có.
> - **Mỗi user flow được xếp một trong ba mức ưu tiên trình bày** (mục 11.3.1), kèm kịch bản 12 phút và bảng tra ngược *câu hỏi → mở flow nào*. Mức ưu tiên in ngay trên đầu mỗi sơ đồ, và bản `.pdf` được sắp lại theo thứ tự đó.
> - Sơ đồ trong tài liệu này và bản `.drawio` sinh từ **một tệp đặc tả duy nhất**, nên hai bản không thể lệch nhau. Bản `.drawio` (14 trang, và 14 tệp rời), bản `.png`, `.svg`, `.pdf` đi kèm riêng. *(14/09/2026 — tệp đặc tả gốc không có trong kho; từ v0.5, `.drawio` của Phần 11 sinh từ **khối Mermaid trong chính tài liệu này** bằng `tools/generate-uf-drawio.py`: 16 tệp rời. `.pdf`, `.html` chưa sinh lại — xem đầu Phần 11.)*
>
> **Thay đổi ở v0.2:** bổ sung 5 luồng mới phát sinh từ BRD v3.1–v3.4; nâng mức chi tiết của mọi luồng lên mẫu đặc tả thống nhất có quy tắc nghiệp vụ và tiêu chí hoàn thành riêng cho từng luồng.

---

## 0. Cách đọc

### 0.1. Tám ký hiệu tác nhân *(bảy tới v0.4)*

Năm dòng đầu là **tác nhân người** — có tài khoản đăng nhập. `HT` là tác nhân tự động **nằm bên trong** ranh giới hệ thống. `NCC` nằm **ngoài** ranh giới hệ thống. Ba loại này khác nhau về bản chất, không gộp chung (Context Diagram mục 0.3).

| Ký hiệu | Tác nhân           | Là ai                                            | Vị trí so với hệ thống  |
| ------- | ------------------ | ------------------------------------------------ | ----------------------- |
| **NV**  | Nhân viên          | Người cần dùng phần mềm                          | Người dùng              |
| **QL**  | Quản lý trực tiếp  | Người xác nhận nhu cầu nghiệp vụ                 | Người dùng              |
| **TC**  | Tài chính          | Người **kiểm soát ngân sách** — trả lời khi Người duyệt chi hỏi, ghi nhận ngân sách và khoản cam kết **sau** duyệt; **không quyết chi**, **không** nằm trên đường duyệt *(sửa ở v0.5, v0.7)* | Người dùng              |
| **DC**  | Người duyệt chi *(mới ở v0.5)* | Người có thẩm quyền chi, mặc định CEO — quyết định cuối cho khoản chi và SaaS mới, trên snapshot ngân sách *(v0.7)* | Người dùng              |
| **IT**  | Quản trị viên CNTT | Người duy nhất thực hiện thay đổi quyền          | Người dùng              |
| **QT**  | Quản trị hệ thống  | Super Admin — cấu hình, không thao tác nghiệp vụ | Người dùng              |
| **HT**  | Hệ thống           | Bao gồm cả dịch vụ tự động chạy nền              | **Bên trong** ranh giới |
| **NCC** | Nhà cung cấp       | Figma, Slack, GitHub… — nằm ngoài hệ thống       | **Bên ngoài** ranh giới |

### 0.2. Mẫu đặc tả dùng cho mọi luồng

Mỗi luồng có đủ bảy phần. Nếu một phần trống thì ghi rõ là trống, không bỏ đi.

```
Mã · Tên luồng                    thuộc luồng giá trị nào
Mục đích        một câu, nói kết quả chứ không nói thao tác
Kích hoạt bởi   sự kiện hoặc lịch nào làm luồng bắt đầu
Tiền điều kiện  điều gì phải đúng trước khi bắt đầu
Các bước        ai làm gì → hệ thống phản hồi gì
Quy tắc         các ràng buộc nghiệp vụ, có mã BR để trích dẫn
Ngoại lệ        nhánh rẽ và cách xử lý
Xong khi        tiêu chí nghiệm thu, dùng để viết kịch bản kiểm thử
```

### 0.3. Bốn quy tắc đúng ở mọi luồng

Không lặp lại ở từng luồng nhưng luôn áp dụng:

1. **Không ai duyệt yêu cầu của chính mình** — kể cả khi người đó có vai trò cho phép duyệt.
2. **Mọi quyết định đều được ghi lại**: ai, khi nào, quyết định gì, vì lý do gì. Nhật ký này không sửa và không xóa được.
3. **Hệ thống không tự quyết thay người** ở việc có hậu quả: không tự duyệt chi phí, không tự cấp hay thu hồi quyền, không tự kết luận vi phạm.
4. **Khi hai nguồn dữ liệu nói khác nhau, không nguồn nào tự ghi đè nguồn kia** — hệ thống sinh bản ghi sai lệch cho người xử lý (xem F-43).

### 0.4. Phân biệt hai khái niệm hay bị nhầm

| Khái niệm          | Nghĩa                                              | Ví dụ                               |
| ------------------ | -------------------------------------------------- | ----------------------------------- |
| **Quyền được cấp** | Tổ chức đã quyết định người này được dùng phần mềm | "Công ty đồng ý cho Bảo dùng Figma" |
| **Tài khoản thật** | Tài khoản đã thực sự tồn tại bên nhà cung cấp      | "Figma đã có user bao@congty.vn"    |

Hai việc này có thể lệch nhau: đã duyệt nhưng chưa tạo được tài khoản, hoặc có tài khoản mà hệ thống không biết. **Chính khoảng cách giữa chúng là nơi phát sinh mọi vấn đề vận hành thực tế.**

---

## 1. Bản đồ, phạm vi và Main Flows tổng

### 1.1. Năm luồng giá trị

**Nhìn ở mức thấp nhất — một dòng, đọc từ trái sang phải:**

```
Có dữ liệu ── Có người ── Có quyền ── Có bằng chứng dùng ── Cắt được lãng phí ── Thành tiền thật
   MF-0        MF-1       MF-2            MF-3                    MF-3                MF-4
                                                                                        │
                                                            MF-5 · nhìn xuyên mọi chặng ┘
```

Mọi thứ trong tài liệu này đều nằm ở một trong sáu chặng trên. Nếu một luồng không gắn được vào chặng nào, hoặc nó nằm ngoài phạm vi, hoặc bản đồ đang thiếu một chặng.

```mermaid
flowchart TB
    subgraph VS0["VS-0 · Vòng đời nhân sự"]
        A1["F-01 Khởi tạo dữ liệu"]
        A2["F-02 Người mới vào"]
        A3["F-03 Đổi người quản lý / cost center"]
        A4["F-04 Nghỉ dài và quay lại"]
        A5["F-05 Nghỉ việc"]
        A9["F-39 Nhà thầu sắp hết hạn"]
    end
    subgraph VS1["VS-1 · Cấp quyền có kiểm soát"]
        B0["F-06 Khai báo danh mục"]
        B1["F-07/08 Xin cấp suất"]
        B2["F-09 Xin phần mềm mới"]
        B3["F-10/11 Thực thi cấp phát"]
        B4["F-14 Hoàn trả"]
    end
    subgraph VS2["VS-2 · Thu hồi lãng phí"]
        C1["F-17 Import dữ liệu dùng"]
        C2["F-19/20 Phát hiện lãng phí"]
        C3["F-21 Quản lý xác nhận"]
        C4["F-22 Thu hồi"]
    end
    subgraph VS3["VS-3 · Kiểm soát hợp đồng"]
        D1["F-26 Cảnh báo hạn báo hủy"]
        D2["F-27 Quyết định gia hạn"]
    end
    subgraph VS4["VS-4 · Minh bạch chi tiêu"]
        E1["F-31 Phát hiện ngoài danh mục"]
        E2["F-34 Hợp thức hóa"]
    end
    subgraph VSX["Xuyên suốt"]
        X1["F-40/41/42/44 Quyền chủ thể dữ liệu"]
        X2["F-43 Nguồn dữ liệu mâu thuẫn"]
    end

    A1 --> A2 --> B1
    A3 -.-> C2
    A4 -.-> C2
    A5 --> C2
    A5 --> X1
    B0 --> B1
    B1 --> B3
    B2 --> B1
    B3 --> C1
    C1 --> C2 --> C3 --> C4
    C4 --> D2
    D1 --> D2
    E1 --> E2 --> B1
    C1 -.-> X2

    style VS0 fill:#e8f0fe,stroke:#4285f4
    style VS1 fill:#fce8e6,stroke:#ea4335
    style VS2 fill:#f3e8fd,stroke:#a142f4
    style VS3 fill:#e6f4ea,stroke:#34a853
    style VS4 fill:#fef7e0,stroke:#fbbc04
    style VSX fill:#f1f3f4,stroke:#5f6368
```

Hai mũi tên đáng chú ý:
- **C4 → D2**: thu hồi suất chỉ thành tiền thật tại kỳ gia hạn. Mắt xích quyết định giá trị của cả hệ thống.
- **E2 → B1**: một ứng dụng ngoài danh mục được hợp thức hóa sẽ quay lại thành yêu cầu mua chính thức. Vòng lặp khép kín, không phải ngõ cụt.

### 1.2. Bảng chốt phạm vi đầy đủ

**✅ Code** = hiện thực đầy đủ · **📐 Thiết kế** = chỉ đặc tả · **❌ Ngoài** = không làm

Cột **MF** cho biết luồng đó nằm trong main flow nào ở mục 1.4 → 1.9.

| Mã   | Luồng                                           | Thuộc | MF   | Phạm vi | Chi tiết ở mục |
| ---- | ----------------------------------------------- | ----- | ---- | ------- | -------------- |
| F-01 | Khởi tạo dữ liệu ban đầu cho tổ chức            | VS-0  | MF-0 | ✅       | 2.1            |
| F-02 | Nhân viên mới vào                               | VS-0  | MF-1 | ✅       | 2.2            |
| F-03 | Nhân viên đổi người quản lý hoặc cost center *(đổi tên ở v0.5)* | VS-0  | MF-1 | ✅       | 2.3            |
| F-04 | Nhân viên nghỉ dài và quay lại                  | VS-0  | MF-1 | ✅       | 2.4            |
| F-05 | Nhân viên nghỉ việc                             | VS-0  | MF-1 | ✅       | 2.5            |
| F-39 | Nhà thầu, thực tập sinh sắp hết hạn             | VS-0  | MF-1 | ✅       | 2.6            |
| F-06 | Khai báo danh mục, gói, hợp đồng, thuê bao      | VS-1  | MF-0 | ✅       | 3.1            |
| F-07 | Xin cấp suất — không phát sinh chi phí          | VS-1  | MF-2 | ✅       | 3.2            |
| F-08 | Xin cấp suất — có phát sinh chi phí             | VS-1  | MF-2 | ✅       | 3.2            |
| F-09 | Xin phần mềm chưa có trong danh mục             | VS-1  | MF-2 | ✅       | 3.3            |
| F-10 | Thực thi cấp phát qua kết nối tự động           | VS-1  | MF-2 | ✅       | 3.4            |
| F-11 | Thực thi cấp phát thủ công có theo dõi          | VS-1  | MF-2 | ✅       | 3.4            |
| F-12 | Xử lý cấp phát thất bại                         | VS-1  | MF-2 | ✅       | 3.5            |
| F-13 | Xử lý bước duyệt nghẽn, xung đột lợi ích và xác định lại người duyệt *(v0.6; tới v0.5: ủy quyền phê duyệt)* | VS-1  | MF-2 | ✅       | 3.6            |
| F-14 | Hoàn trả suất theo yêu cầu                      | VS-1  | MF-2 | ✅       | 3.7            |
| F-15 | Gia hạn quyền có thời hạn                       | VS-1  | MF-2 | ✅       | 3.7            |
| F-16 | Đổi gói — nâng hoặc hạ                          | VS-1  | MF-2 | 📐       | —              |
| F-17 | Import dữ liệu sử dụng                          | VS-2  | MF-3 | ✅       | 4.1            |
| F-18 | Xử lý hàng đợi chưa khớp danh tính              | VS-2  | MF-3 | ✅       | 4.2            |
| F-19 | Phát hiện lãng phí nhóm G1, G2                  | VS-2  | MF-3 | ✅       | 4.3            |
| F-20 | Phát hiện lãng phí nhóm G3, G4                  | VS-2  | MF-3 | ✅       | 4.3            |
| F-21 | Quản lý xác nhận Giữ / Thu hồi / Miễn trừ       | VS-2  | MF-3 | ✅       | 4.4            |
| F-22 | Thu hồi suất sau xác nhận                       | VS-2  | MF-3 | ✅       | 4.5            |
| F-23 | Mở lại khuyến nghị khi hết hạn miễn trừ         | VS-2  | MF-3 | ✅       | 4.5            |
| F-24 | Rà soát quyền truy cập định kỳ                  | VS-2  | MF-3 | 📐       | —              |
| F-25 | Phát hiện nhóm G5 — hạ gói theo mức dùng        | VS-2  | MF-3 | ❌       | —              |
| F-26 | Cảnh báo trước hạn chót báo hủy                 | VS-3  | MF-4 | ✅       | 5.1            |
| F-27 | Quyết định gia hạn, giảm số lượng hoặc hủy      | VS-3  | MF-4 | ✅       | 5.2            |
| F-28 | Đối soát với nhà cung cấp                       | VS-3  | MF-4 | ✅       | 5.3            |
| F-29 | Bảng chi tiêu, tiết kiệm và phân bổ theo cost center *(đổi tên ở v0.5)* | VS-4  | MF-5 | ✅       | 6.1            |
| F-30 | Dự báo chi phí ba lớp                           | VS-4  | MF-5 | ✅       | 6.2            |
| F-31 | Phát hiện phần mềm ngoài danh mục từ sao kê     | VS-4  | MF-5 | ✅       | 6.3            |
| F-32 | Phát hiện từ dữ liệu cấp quyền của hệ định danh | VS-4  | MF-5 | 📐 *(✅ tới v0.8; giai đoạn sau — `QĐ-31a`)* | 6.3            |
| F-33 | Phát hiện từ nhật ký truy cập web               | VS-4  | MF-5 | ❌       | —              |
| F-34 | Hợp thức hóa ứng dụng vào danh mục              | VS-4  | MF-5 | ✅       | 6.4            |
| F-35 | Đối soát hóa đơn với suất và mức sử dụng        | VS-4  | MF-5 | ✅       | 6.5            |
| F-36 | Lập và theo dõi ngân sách                       | VS-4  | MF-5 | ✅ *(📐 tới v0.4)* | 6.6            |
| F-37 | Quản trị người dùng, vai trò, cấu hình          | —     | MF-0 | ✅       | 7.1            |
| F-38 | Nhật ký kiểm toán và giám sát tác vụ nền        | —     | MF-0 | ✅       | 7.1            |
| F-40 | Nhân viên xem và xuất dữ liệu của chính mình    | —     | MF-0 | ✅       | 7.2            |
| F-41 | Xóa dữ liệu hoạt động của người đã nghỉ         | —     | MF-1 | ✅       | 7.3            |
| F-42 | Thông báo khi bắt đầu theo dõi một ứng dụng     | —     | MF-3 | ✅       | 7.4            |
| F-43 | Xử lý khi các nguồn dữ liệu mâu thuẫn           | —     | MF-0 | ✅       | 7.5            |
| F-44 | Xóa dữ liệu quá hạn lưu giữ theo chính sách     | —     | MF-0 | ✅       | 7.6            |
| **F-45** | Triển khai và vận hành tiện ích trình duyệt trên thiết bị công ty *(mới ở v0.5)* | VS-2 | MF-3 | ✅ | 7.7 |
| **F-46** | Phát hiện SaaS ngoài danh mục từ bộ thu thập *(mới ở v0.5)* | VS-4 | MF-5 | 📐 *(✅ tới v0.8; giai đoạn sau — `QĐ-31a`)* | 7.8 |
| **F-47** | Xem báo cáo hiệu suất và chất lượng *(mới ở v0.5)* | VS-4 | MF-5 | ✅ | 7.9 |
| **F-48** | Agent trên máy công ty *(mới ở v0.5)* | VS-2 | MF-3 | ✅ **mức demo** *(📐 tới v0.8 — `QĐ-31b`; phiên người dùng, không service/installer)* | 7.10 |

**Tổng: 48 luồng — 42 hiện thực, 4 chỉ đặc tả thiết kế, 2 ngoài phạm vi** *(v0.9 — `QĐ-31`)*.

> 🆕 **Cập nhật 28/09/2026 — v0.9, theo `QĐ-31a`, `QĐ-31b`:** đếm lại từng nhóm trên bảng trên — **✅ 42** *(43 cũ − `F-32` − `F-46` + `F-48`)* · **📐 4** — `F-16`, `F-24`, `F-32`, `F-46` · **❌ 2** — `F-25`, `F-33`. 📁 *Dòng tổng `48 — 43 / 3 / 2` và ghi chú v0.5 dưới là lịch sử.*

> 🆕 **Cập nhật 14/09/2026 — v0.5, theo `QĐ-20`, `QĐ-22`, `QĐ-24`:** đếm từng nhóm trên bảng trên — **✅ 43** *(39 cũ + `F-36` + `F-45` + `F-46` + `F-47`)* · **📐 3** — `F-16`, `F-24`, `F-48` · **❌ 2** — `F-25`, `F-33`. `F-33` **vẫn ngoài phạm vi**: nhật ký truy cập web đầy đủ khác tiện ích trình duyệt lọc theo danh sách cho phép (`F-45`, `F-46`). Hoãn lớp L2 (`QĐ-25`) **không** đổi số luồng — `F-30` vẫn ✅ với L1 và L3. 📁 *Dòng tổng `44 — 39 / 3 / 2` và hai ghi chú dưới là lịch sử.*

> 🆕 **`F-44` thêm ngày 09/09/2026.** Trước đó `FR-10.3` *(xóa dữ liệu quá hạn lưu giữ theo chính sách BRD mục 7.5)* **không có luồng nào phủ**: `F-41` chỉ phủ nhánh sự kiện *nghỉ việc* của `FR-10.6`, còn nhánh **định kỳ khi nhân viên vẫn đang làm việc** thì không ai nhận. Đã cân nhắc mở rộng `F-41` và **loại**, vì `F-41` là một bước trong vòng đời nhân sự (`MF-1`, `WF-07`) còn `F-44` là **tác vụ vòng đời dữ liệu độc lập**, chạy theo lịch, không gắn với sự kiện nhân sự nào. Nhồi hai thứ vào một mã sẽ làm tên luồng rộng hơn chỗ nó được gọi. **Không đổi chính sách BRD** — `F-44` chỉ hiện thực `FR-10.3` vốn đã có.
>
> ✅ **`F-44` ĐÃ ĐƯỢC PHÊ DUYỆT — `QĐ-14`, nhóm trưởng, 10/09/2026.** Phê duyệt theo nội dung hiện hành tại mục 7.6; giữ `F-44` thuộc `MF-0`, phạm vi `44` — `39 / 3 / 2`, và phân loại không tạo workflow riêng. Không thay đổi nội dung nghiệp vụ `F-44`. Xem `QĐ-14` trong `Decisions/project-decisions.md`.

> 📁 **Lịch sử — tại thời điểm v0.3 (07/09/2026), khi phạm vi còn là 43 luồng.** Khi đó v0.2 và Định nghĩa Phạm vi v1.1 mục 5.2 đều ghi *37 / 5 / 1*; đếm lại trên chính bảng trên cho **38 / 3 / 2**, tổng 43, nên lỗi không lộ ra khi cộng. ✅ **Đã xử lý xong:** Định nghĩa Phạm vi đã sửa ở v1.2 và cập nhật tiếp ngày 09/09/2026. **Con số hiện hành là `44` — `39 / 3 / 2`**, xem dòng tổng ngay trên. Yêu cầu *"cần sửa Định nghĩa Phạm vi v1.1"* của ghi chú cũ **đã hết hiệu lực**, giữ lại chỉ để truy vết bài học: đối chiếu tổng không thay được đối chiếu từng nhóm.

### 1.3. Ba tầng của tài liệu và cách đọc main flow

| Tầng               | Nội dung                             | Ở đâu             | Dùng khi nào                                                 |
| ------------------ | ------------------------------------ | ----------------- | ------------------------------------------------------------ |
| **L0**             | Một dòng sáu chặng                   | Mục 1.1           | Slide mở đầu, câu trả lời 10 giây                            |
| **L1 · Main flow** | Sáu chuỗi bước end-to-end, thuần chữ | **Mục 1.4 → 1.9** | Giải thích hệ thống chạy thế nào; chương phân tích nghiệp vụ |
| **L2 · Flow con**  | 48 luồng `F-xx` có đủ bảy phần       | Phần 2 → 7        | Viết đặc tả, viết kịch bản kiểm thử, chia việc               |

**Vì sao cần tầng L1.** Bốn mươi tám luồng chi tiết trả lời được câu *"luồng này chạy ra sao"* nhưng không trả lời được câu *"cái gì nối vào cái gì"*. Người đọc lần đầu — giảng viên hướng dẫn, hội đồng, thành viên mới — cần thấy mạch trước khi thấy chi tiết. Đây cũng là cách phân rã quy trình theo cấp mà các khung công nghiệp dùng chung: một cấp cao đủ ngắn để nhớ, mỗi bước của nó phân rã xuống cấp thấp hơn, và **mỗi phần tử cấp thấp thuộc về đúng một phần tử cấp trên**.

**Ký pháp dùng trong mục 1.4 → 1.9:**

| Ký hiệu       | Nghĩa                                                          |
| ------------- | -------------------------------------------------------------- |
| `├─` `└─` `│` | Bước tuần tự và nhánh rẽ trong cùng một main flow              |
| `──>`         | Đi tới bước khác, luồng khác, hoặc main flow khác              |
| `[F-xx]`      | Bước này được đặc tả chi tiết ở flow con mã `F-xx`             |
| `(BR-xx.x)`   | Quy tắc nghiệp vụ chi phối bước này                            |
| `◆`           | Điểm rẽ nhánh do **người** quyết định                          |
| `⚙`           | Bước do **hệ thống** hoặc tác vụ nền tự chạy, không ai bấm nút |
| `⏱`           | Bước có thời hạn xử lý; quá hạn thì nhắc và thông báo — không đổi người (v0.6) |
| `⛔`           | **Cổng chặn** — không đủ điều kiện thì dừng, không đi tiếp     |
| `⭐`           | Mắt xích tạo ra giá trị lớn nhất, đáng chỉ tay vào khi bảo vệ  |
| `↺`           | Vòng lặp quay lại một main flow đã đi qua                      |
| `★ D-x`       | Bước này nằm trong chuỗi demo bắt buộc `D-x`                   |

> **Cách dùng khi trình bày:** một main flow vừa một slide. Đọc từ trên xuống, dừng lại ở các `⛔` và `⭐` — đó là chỗ thể hiện nhóm hiểu vấn đề, phần còn lại chỉ là trình tự.

---

### 1.4. `MF-0` · Nền móng và quản trị

> **Mục đích:** đưa tổ chức từ chỗ chưa có dữ liệu tới chỗ năm main flow còn lại chạy được.
> **Chạy khi nào:** một lần lúc triển khai; sau đó chạy lại từng phần mỗi khi thêm ứng dụng hoặc thuê bao mới.
> **Không có main flow này thì:** không có main flow nào khác bắt đầu được.

```
BẮT ĐẦU · Tổ chức chưa có dữ liệu trong hệ thống
 │
 ├─ B0.1  QT tạo tài khoản (gửi lời mời), gán vai trò, cấu hình ........... [F-37]
 │        đồng tiền báo cáo · múi giờ · ngưỡng · thời hạn xử lý
 │        · chính sách lưu giữ · ngưỡng sai số dự báo
 │        └─ ⛔ QT KHÔNG gán suất, KHÔNG duyệt yêu cầu nghiệp vụ (BR-37.1)
 │
 ├─ B0.2  IT nhập file nhân sự ──> dựng cây tổ chức ................... [F-01] B1
 │        ├─ ⛔ thiếu cột đơn vị chịu chi phí ──> CHẶN, không cho tiếp
 │        │      (không có cột này thì toàn bộ báo cáo chi phí vô nghĩa)
 │        └─ thiếu quản lý trực tiếp ──> cho tiếp, dùng người duyệt dự phòng ở gốc
 │
 ├─ B0.3  IT khai báo danh mục · gói · thuê bao · hợp đồng ............ [F-06]
 │        ├─ ⛔ chưa chỉ định Business Owner ──> CHẶN (BR-06.1)
 │        ├─ ◆ ba câu hỏi phân loại: nhắn tin? gọi/họp? hộp thư?
 │        │    └─ CÓ bất kỳ câu nào ──> gắn cờ nhóm dịch vụ liên lạc
 │        │         └─ mặc định KHÔNG thu thập dữ liệu hoạt động (BR-06.2)
 │        │              ──> ứng dụng này chỉ phát hiện được G1, G2 ở MF-3
 │        ├─ ◆ mô hình giá KHÔNG theo đầu người
 │        │    └─ MF-3 không áp dụng; giao diện hiện "không áp dụng",
 │        │       KHÔNG hiện số 0 (BR-06.4)
 │        └─ tự động gia hạn mà thiếu hạn chót báo hủy ──> cảnh báo ──> MF-4
 │
 ├─ B0.4  IT ghi nhận hiện trạng: ai đang giữ suất nào ............... [F-01] B4
 │        ├─ ⛔ chưa xong B0.2 và B0.3 thì KHÔNG cho làm bước này (BR-01.1)
 │        └─ bản ghi ở bước này được phép KHÔNG có yêu cầu nguồn,
 │           nhưng phải đánh dấu là dữ liệu khởi tạo (BR-01.2)
 │
 ├─ B0.5 ⚙ Hệ thống chạy lần đánh giá đầu tiên cho G1 và G2 ──────────> MF-3
 │        └─ ⭐ TỚI ĐÂY HỆ THỐNG ĐÃ TẠO GIÁ TRỊ ĐO ĐƯỢC
 │           mà chưa cần một dòng nhật ký bên ngoài nào: biết ngay bao nhiêu
 │           suất đã mua chưa gán, bao nhiêu suất nằm trong tay người đã nghỉ
 │
 └─ B0.6  (tùy chọn) IT import file nhật ký sử dụng ─────────────────> MF-3
          ├─ ⛔ lần đầu cho một ứng dụng ──> phải thông báo NLĐ trước [F-42]
          └─ (tùy chọn, v0.5) IT đăng ký thiết bị cho tiện ích trình duyệt ── [F-45]
                 ⛔ nhân viên XÁC NHẬN CHỦ ĐỘNG trước, chưa có thì không nhận dữ liệu
                 agent trên máy ...................................... [F-48] 📐

CHẠY NGẦM SUỐT VÒNG ĐỜI HỆ THỐNG — không có điểm bắt đầu, không có điểm kết thúc
 ├─ ⚙ Nhật ký kiểm toán chỉ ghi thêm · giám sát trạng thái tác vụ nền . [F-38]
 │     └─ ⛔ tác vụ nền thất bại phải hiện lên, không im lặng bỏ qua (BR-38.2)
 ├─ NV mở trang "dữ liệu của tôi", yêu cầu xuất dữ liệu ............... [F-40]
 │     └─ ghi thời điểm tiếp nhận và thời điểm hoàn tất (BR-40.2)
 ├─ ⚙ Quét hằng ngày, xóa dữ liệu QUÁ HẠN LƯU GIỮ .................... [F-44]
 │     ├─ hoạt động chi tiết > 6 tháng ──> xóa, kể cả người ĐANG LÀM VIỆC
 │     │      ⛔ đây là nhánh ĐỊNH KỲ, khác nhánh 30 ngày sau nghỉ việc [F-41]
 │     ├─ tổng hợp phi định danh > 24 tháng · bằng chứng discovery từ sao kê,
 │     │      hóa đơn > 24 tháng ──> XÓA THẬT, không phải ngoại lệ (BRD 7.5)
 │     ├─ ⛔ NGOẠI LỆ DUY NHẤT: nhật ký kiểm toán — chỉ ghi thêm (BR-44.3)
 │     ├─ hồ sơ tài chính phân hệ 5.1/5.5 (hợp đồng, hóa đơn thanh toán,
 │     │      thuê bao, bản ghi chi phí) NGOÀI bảng lưu giữ 7.5 ──> job không quét
 │     └─ ghi nhật ký SỐ BẢN GHI ĐÃ XÓA và thời điểm (BR-44.4)
 └─ ⚙ Hai nguồn dữ liệu nói khác nhau ──> sinh bản ghi cho người xử lý  [F-43]
       ├─ ⛔ giữ nguyên CẢ HAI giá trị, không ghi đè (BR-43.1)
       ├─ ⛔ mỗi bản ghi mâu thuẫn phải có người chịu trách nhiệm
       └─ ⛔ mâu thuẫn KHÔNG được tự đóng theo thời gian (BR-43.3)

XONG KHI: bảng điều khiển hiển thị tổng chi phí, tổng số suất,
          và ít nhất MỘT cảnh báo có thật sinh từ dữ liệu vừa nhập.
```

> **Điểm cần nói khi trình bày `MF-0`:** thứ tự `B0.2 → B0.3 → B0.4` không đổi được, và `B0.5` là chỗ chứng minh đề tài khả thi. Nếu hệ thống chỉ có giá trị sau khi lấy được nhật ký từ nhà cung cấp thì nó phụ thuộc vào thứ mà phần lớn doanh nghiệp vừa không mua nổi — đó là rủi ro lớn nhất của phân hệ Usage, và `B0.5` là câu trả lời cho nó.

---

### 1.5. `MF-1` · Vòng đời nhân sự

> **Mục đích:** giữ cho quyền truy cập và chi phí luôn khớp với trạng thái thật của từng con người.
> **Kích hoạt bởi:** IT cập nhật hồ sơ nhân sự, hoặc tác vụ nền quét ngày kết thúc hằng ngày.
> **Vì sao đứng trước `MF-2`:** không có cây tổ chức thì không biết ai duyệt cho ai, và toàn bộ luồng phê duyệt không chạy được.

```
NGƯỜI MỚI VÀO ...................................................... [F-02]
 │  IT tạo hồ sơ: đơn vị chịu chi phí · quản lý · ngày vào  (v0.5 — bỏ phòng ban)
 │   └─ ⛔ chưa có email công việc ──> CHẶN (email là khóa ánh xạ sang NCC)
 │  QL tạo yêu cầu hộ, chọn nhiều ứng dụng cùng lúc ────────────────> MF-2
 │   ├─ tách thành các yêu cầu riêng theo ứng dụng, gộp chung một mã lô
 │   ├─ người yêu cầu và người thụ hưởng là HAI trường khác nhau (BR-02.1)
 │   └─ ⛔ QL tạo hộ thì KHÔNG tự duyệt bước quản lý ──> lên cấp trên (BR-02.2)
 │
 ↓
ĐANG LÀM VIỆC ── trạng thái ổn định, mọi nhánh dưới đây quay về đây hoặc đi ra
 │
 ├─ ◆ ĐỔI NGƯỜI QUẢN LÝ HOẶC COST CENTER ........................... [F-03]
 │   │  IT cập nhật, kèm NGÀY HIỆU LỰC
 │   ├─ ⚙ KHÔNG ghi đè — đóng giai đoạn cũ, mở giai đoạn mới (BR-03.2)
 │   ├─ chi phí trước ngày hiệu lực vẫn thuộc đơn vị cũ ───────────> MF-5
 │   ├─ yêu cầu đang chờ duyệt chuyển sang QL mới ─────────────────> MF-2
 │   │     └─ ⛔ đã tới bước tài chính hoặc bước IT thì KHÔNG chuyển (BR-03.4)
 │   ├─ suất ĐI THEO NGƯỜI; QL mới nhận danh sách để xem lại ──────> MF-3
 │   ├─ ⛔ người này đang là QL của người khác ──> CHẶN tới khi có người kế nhiệm
 │   └─ người này là Business Owner ──> cảnh báo, nhắc chỉ định người thay
 │
 ├─ ◆ NGHỈ DÀI VÀ QUAY LẠI ......................................... [F-04]
 │   │  IT đổi trạng thái, ghi ngày dự kiến quay lại
 │   ├─ ⚙ LOẠI khỏi phạm vi đánh giá lãng phí ────────> MF-3 cổng lọc số 3
 │   ├─ khuyến nghị đang mở ──> TẠM DỪNG, không đóng
 │   ├─ quay lại ──> đưa lại vào phạm vi, nhưng thời gian nghỉ
 │   │     KHÔNG tính vào số ngày không hoạt động (BR-04.1)
 │   └─ ⛔ quá thời hạn dự kiến ──> nhắc IT, hệ thống KHÔNG tự đổi trạng thái
 │
 ├─ ◆ NGƯỜI LÀM CÓ THỜI HẠN SẮP HẾT HẠN ............................ [F-39]
 │   │  ⚙ quét hằng ngày; còn 7 ngày thì báo IT và QL
 │   │  ⛔ quyền cấp cho nhà thầu, freelancer, TTS BẮT BUỘC có ngày kết thúc
 │   ├─ QL chọn gia hạn ──> tạo yêu cầu loại gia hạn ──────> MF-2 B2.1 [F-15]
 │   │     └─ ⛔ gia hạn quá 12 tháng liên tiếp ──> xác nhận thêm (BR-39.4)
 │   │          (dấu hiệu người này thực chất là nhân viên chính thức)
 │   └─ QL không làm gì ──> tới hạn thì vào hàng đợi cần thu hồi ──> MF-3 B3.5
 │         ├─ ⛔ hệ thống KHÔNG tự thu hồi khi tới hạn (BR-39.2)
 │         │      tự thu hồi có thể cắt quyền của người đang làm dở việc
 │         └─ quá hạn chưa xử lý ──> nổi lên bảng điều khiển IT như một mục nợ
 │
 └─ ◆ NGHỈ VIỆC .......................................... [F-05]  ★ D-3
     │  IT chuyển sang "đang bàn giao", đặt ngày làm việc cuối
     │  ⛔ trạng thái đã nghỉ việc BẮT BUỘC có ngày nghỉ (BR-05.3)
     ├─ ⚙ liệt kê toàn bộ suất đang giữ ──> gửi QL kèm hạn xử lý
     ├─ QL xác nhận đã bàn giao dữ liệu trước khi IT thu hồi
     ├─ ⛔ người này là QL của người khác ──> chuyển yêu cầu cho người kế nhiệm
     ├─ ⛔ người này là Business Owner ──> cảnh báo, chỉ định người thay
     ├─ nghỉ đột ngột, không có giai đoạn bàn giao ──> cho chuyển thẳng
     │
     ├─ ⚙ TỚI NGÀY LÀM VIỆC CUỐI
     │    └─ sinh lãng phí nhóm G2 cho MỌI suất còn lại ────────────> MF-3
     │       ├─ ⭐ độ tin cậy TUYỆT ĐỐI, bỏ qua mọi ngưỡng ngày (BR-05.1)
     │       └─ ⛔ G2 KHÔNG cần QL xác nhận ──> thẳng tới IT (BR-05.2)
     │            người đã nghỉ thì không có gì để bàn
     │
     ├─ IT thu hồi hàng loạt ────────────────────────────> MF-3 B3.5 [F-22]
     │    └─ ⛔ bắt buộc GÕ SỐ LƯỢNG để xác nhận + lý do chung (BR-05.4)
     │
     └─ ⚙ SAU 30 NGÀY kể từ ngày làm việc cuối ...................... [F-41]
          ├─ xóa dữ liệu hoạt động chi tiết — ⛔ xóa THẬT, không đánh dấu ẩn
          └─ GIỮ LẠI: dữ liệu tổng hợp phi định danh + nhật ký kiểm toán

XONG KHI: không còn suất nào gắn với người đã nghỉ, số tiết kiệm được ghi vào
          báo cáo, và sau 30 ngày dữ liệu hoạt động chi tiết không còn trong hệ thống.
```

> **`F-05` là kịch bản demo giá trị nhất** — nó vừa là chi phí vừa là lỗ hổng bảo mật, và độ chắc chắn tuyệt đối vì chỉ dùng dữ liệu nội bộ. Không cần xin API của nhà cung cấp nào để chứng minh nó đúng.

---

### 1.6. `MF-2` · Cấp quyền có kiểm soát ★ D-1

> **Mục đích:** làm cho đường chính thức nhanh hơn đường tắt.
> **Kích hoạt bởi:** nhân viên cần một công cụ; hoặc quản lý xin hộ người mới (`MF-1`); hoặc hợp thức hóa một ứng dụng ngoài danh mục (`MF-5`).
> **Đo bằng:** `KPI-2` — thời gian trung bình từ lúc gửi yêu cầu tới lúc có tài khoản.

```
KÍCH HOẠT · NV cần một công cụ
 │
 ├─ ◆ Công cụ đã có trong danh mục đã duyệt chưa?
 │    │
 │    ├─ CHƯA CÓ ──> XIN PHẦN MỀM MỚI ............................ [F-09]
 │    │    ├─ NV khai: tên · trang chủ · mục đích · LOẠI DỮ LIỆU sẽ đưa vào
 │    │    │      (câu hỏi về loại dữ liệu là điểm khác so với F-07)
 │    │    ├─ QL xác nhận nhu cầu nghiệp vụ
 │    │    ├─ ⛔ IT ĐÁNH GIÁ danh mục và rủi ro   ← vai trò 1 của IT
 │    │    │    ├─ đã có công cụ tương đương ──> KHÔNG DUYỆT + gợi ý thay thế
 │    │    │    │     (BR-09.2: đây là kết quả HỢP LỆ và TÍCH CỰC)
 │    │    │    └─ dữ liệu nhạy cảm cao ──> cần ý kiến Business Owner nhóm đó
 │    │    ├─ TC GHI Ý KIẾN NGÂN SÁCH — chỉ khi có chi phí, KHÔNG chặn
 │    │    ├─ ⏱ DC NGƯỜI DUYỆT CHI QUYẾT — kể cả SaaS MIỄN PHÍ (BR-09.4)
 │    │    │     vì thêm một SaaS là thêm một nơi dữ liệu công ty nằm
 │    │    └─ IT THỰC HIỆN: thêm vào danh mục ──> MF-0 B0.3 [F-06] ──┐
 │    │         ⛔ BR-09.1: đánh giá rủi ro và triển khai/cấp phát     │
 │    │            là HAI trách nhiệm IT khác nhau, KHÔNG gộp.         │
 │    │            Đánh giá của IT và ý kiến ngân sách của Tài chính   │
 │    │            chỉ là dữ liệu đầu vào: Tài chính KHÔNG duyệt và    │
 │    │            KHÔNG từ chối yêu cầu mua — chỉ Người duyệt chi     │
 │    │            mới có quyền quyết định cuối cùng. Thiếu đánh giá   │
 │    │            rủi ro thì Người duyệt chi có thể phải quyết định   │
 │    │            chi cho ứng dụng chưa được đánh giá đầy đủ          │
 │    └─ ĐÃ CÓ ────────────────────────────────────────────────────────┤
 │                                                                     │
 ├─ B2.1  NV chọn phần mềm, nhập lý do · đơn vị chịu chi phí ──────────┘
 │        · khoảng thời gian cần dùng
 │        ├─ ⛔ đã có quyền đang hiệu lực cho ứng dụng đó
 │        │      ──> CHẶN ngay từ bước 1, hiện thông tin quyền đang có (BR-07.3)
 │        └─ thời hạn cần dùng > 12 tháng ──> xác nhận thêm (BR-07.4)
 │
 ├─ B2.2 ⚙ HỆ THỐNG HIỆN TRƯỚC KHI GỬI
 │        chi phí quy đổi · chuỗi người duyệt · thời gian dự kiến từng bước
 │        └─ ⛔ BƯỚC NÀY KHÔNG ĐƯỢC BỎ (BR-07.1)
 │              ⭐ biện pháp rẻ nhất để giảm yêu cầu thừa, và là chỗ biến
 │                 thời hạn xử lý từ con số nội bộ thành lời hứa nhìn thấy được
 │
 ├─ B2.3  NV gửi ──> ⚙ CHỐT CỨNG chính sách duyệt vào yêu cầu (BR-07.2)
 │        │   QT sửa chính sách giữa chừng thì yêu cầu đang chạy vẫn theo luật cũ
 │        └─ ◆ còn suất trống không?
 │             ├─ CÒN ──> chính sách không phát sinh chi phí .......... [F-07]
 │             └─ HẾT ──> VẪN CHO GỬI, gắn cờ phát sinh chi phí ....... [F-08]
 │
 ├─ B2.4 ⏱ ◆ QUẢN LÝ TRỰC TIẾP QUYẾT ĐỊNH
 │        │  ⭐ hiển thị kèm các suất người này đang giữ ở phần mềm
 │        │     CÙNG NHÓM CHỨC NĂNG — phát hiện trùng lặp TRƯỚC khi tiêu tiền
 │        │     rẻ hơn nhiều so với phát hiện sau sáu tháng qua báo cáo
 │        ├─ Duyệt ────────────────────────────────────> B2.5
 │        ├─ Từ chối ──> ⛔ BẮT BUỘC có lý do (BR-07.5) ──> KẾT THÚC
 │        ├─ người yêu cầu chính là QL ──> chuyển lên cấp trên một bậc
 │        ├─ không có QL trực tiếp ──> người duyệt dự phòng ở gốc cây,
 │        │      nói rõ cho người yêu cầu biết
 │        ├─ QL vắng mặt hoặc nghẽn ──> ⛔ KHÔNG ủy quyền, KHÔNG đổi người (v0.6 — QĐ-27)
 │        │      ├─ nhắc QL, thông báo cấp trên của QL ..................... [F-13]
 │        │      └─ vượt ngưỡng backlog hoặc quá SLA ──> cảnh báo QT,
 │        │             đưa vào bảng theo dõi nghẽn; QT KHÔNG duyệt thay (BR-13.8)
 │        ├─ QL nghỉ việc hoặc manager_id của NV đổi giữa chừng
 │        │      ──> XÁC ĐỊNH LẠI người duyệt theo cây mới (BR-13.9) ────> MF-1
 │        │      ⛔ đồng hồ thời hạn KHÔNG đặt lại — thời hạn thuộc về BƯỚC (BR-13.2)
 │        ├─ NV rút yêu cầu ──> cho phép nếu chưa tới bước IT thực hiện
 │        └─ ⏱ QUÁ HẠN ──> nhắc → THÔNG BÁO cấp trên (escalate = thông báo, QĐ-28d)
 │               ⛔ KHÔNG BAO GIỜ TỰ DUYỆT, KHÔNG ĐỔI NGƯỜI (BR-07.7)
 │
 ├─ B2.5 ◆ HẾT SUẤT GIỮA LUỒNG?          ← chỉ khi phát sinh chi phí (v0.7 — QĐ-29b)
 │        └─ hết suất ──> ⛔ CHÈN bước duyệt chi vào CHUỖI HIỆN CÓ,
 │              KHÔNG hủy yêu cầu bắt làm lại (BR-07.6)
 │              ⭐ bắt QL duyệt lại thứ họ đã duyệt chính là loại ma sát
 │                 sinh ra Shadow IT
 │        ⛔ TÀI CHÍNH KHÔNG NẰM TRÊN ĐƯỜNG DUYỆT (v0.7 — QĐ-29b)
 │
 ├─ B2.5b ⏱ ◆ DC NGƯỜI DUYỆT CHI QUYẾT    ← chỉ chạy khi phát sinh chi phí (v0.5)
 │        │  SNAPSHOT NGÂN SÁCH cạnh nút quyết: ngân sách · thực chi · cam kết đang giữ
 │        │     · còn lại · đang chờ duyệt · nhu cầu đã được QL xác nhận (FR-3.14)
 │        ├─ Cần thêm thông tin ──> HỎI TÀI CHÍNH (tùy chọn) ─────────> [F-08]
 │        │      bước VẪN của DC · ⛔ SLA KHÔNG dừng, KHÔNG đặt lại (BR-07.9)
 │        │      TC trả lời trong hạn mức / vượt / chưa có — KHÔNG duyệt, KHÔNG chặn
 │        ├─ Duyệt ──> hệ thống tạo KHOẢN CAM KẾT Đang giữ
 │        │      ──> song song: TC GHI NHẬN ngân sách ∥ ───> B2.6 (IT KHÔNG chờ TC)
 │        ├─ Từ chối ──> ⛔ BẮT BUỘC có lý do ──> KẾT THÚC, không tạo cam kết
 │        ├─ DC là người yêu cầu hoặc người thụ hưởng ──> bước duyệt chi TẠO THẲNG
 │        │      cho người thay thế khi xung đột, QT cấu hình TRƯỚC (BR-13.10, QĐ-28c)
 │        │      ⛔ không ai trong luồng tự chọn · không ứng viên song song
 │        │      chưa cấu hình ──> chờ có kiểm soát (SoD-7, FR-3.12)
 │        ├─ QL trực tiếp CHÍNH LÀ DC ──> vẫn HAI bước riêng, nhật ký gắn cờ (BR-07.8)
 │        ├─ DC vắng mặt hoặc nghẽn ──> KHÔNG dùng người thay thế; nhắc,
 │        │      cảnh báo QT (BR-13.8) — người thay thế CHỈ dành cho xung đột
 │        └─ ⏱ QUÁ HẠN ──> nhắc → thông báo, ⛔ KHÔNG TỰ DUYỆT, KHÔNG ĐỔI NGƯỜI
 │              ⚠️ một DC duy nhất có thể thành nút thắt — đo riêng trong KPI-2
 │
 ├─ B2.6 ⏱ IT THỰC THI CẤP PHÁT           ← vai trò 2 của IT
 │        │  kiểm tra còn chỗ trong MỘT giao dịch có khóa
 │        ├─ ◆ ứng dụng có kết nối tự động không?
 │        │    ├─ CÓ ──> hệ thống gọi nhà cung cấp ................... [F-10]
 │        │    │      bằng chứng lưu nhật ký: nội dung phản hồi của nhà cung cấp
 │        │    │      ├─ ⛔ phản hồi API thành công KHÔNG PHẢI là hoàn tất.
 │        │    │      │     Với nhà cung cấp mà thao tác cấp quyền chỉ tạo
 │        │    │      │     LỜI MỜI CHỜ CHẤP NHẬN, phải ĐỐI SOÁT danh sách
 │        │    │      │     thành viên rồi mới ghi hoàn tất (BRD 6.3, QĐ-03)
 │        │    │      ├─ đang chờ chấp nhận ──> giữ tác vụ ở trạng thái
 │        │    │      │     "chờ chấp nhận"; suất VẪN CHIẾM CHỖ (BR-10.4)
 │        │    │      │     ──> kết thúc riêng: "đã gửi lời mời, CHƯA hoàn tất"
 │        │    │      └─ ⭐ đây là vế đối xứng của BR-10.1 cho kênh tự động:
 │        │    │            không coi phản hồi máy là bằng chứng đã cấp xong
 │        │    └─ KHÔNG ──> sinh việc làm tay có theo dõi ............ [F-11]
 │        │           ├─ IT bấm "tôi đang xử lý" ──> thao tác trên trang
 │        │           │    quản trị NCC ──> bấm "đã hoàn tất"
 │        │           └─ ⛔ hệ thống KHÔNG tự chuyển sang hoàn tất;
 │        │                phải có TÊN NGƯỜI THẬT xác nhận (BR-10.1)
 │        │    ⭐ hai kênh dùng CHUNG một hàng đợi và một cách đo (BR-10.3)
 │        │       — phần lớn phần mềm doanh nghiệp VN không có kết nối
 │        │         tự động, nên kênh thủ công quan trọng hơn kênh tự động
 │        │
 │        ├─ ⛔ quyền VẪN CHIẾM CHỖ suốt thời gian đang thực hiện,
 │        │      kể cả khi thất bại (BR-10.4) — nhả chỗ thì người khác
 │        │      được gán, và khi thử lại thành công sẽ vượt hạn mức
 │        │
 │        └─ THẤT BẠI ──> phân bốn loại lỗi ......................... [F-12]
 │             ├─ tạm thời ──> thử lại tự động, tối đa 6 lần, giãn cách tăng
 │             ├─ vĩnh viễn ──> ⛔ KHÔNG thử lại, báo người thật ngay (BR-12.1)
 │             ├─ xác thực ──> không thử lại, báo QT
 │             ├─ hết hạn mức ──> đẩy sang nhánh mua thêm suất ──> B2.5
 │             ├─ mua hoặc cấp phát thất bại hẳn sau khi đã duyệt chi
 │             │     ──> ⛔ GIẢI PHÓNG khoản cam kết (BRD FR-5.8)
 │             ├─ ⛔ việc thất bại KHÔNG biến mất khỏi tầm nhìn (BR-12.2)
 │             ├─ ⛔ quá 7 ngày chưa xử lý ──> nổi lên bảng điều khiển
 │             └─ NGƯỜI YÊU CẦU CŨNG ĐƯỢC BÁO, để họ không chờ vô ích
 │
 ├─ B2.7 ✅ NV CÓ QUYỀN — thông báo kèm hướng dẫn truy cập
 │        └─ ⚙ ghi thời gian xử lý toàn trình, TÁCH THEO TỪNG BƯỚC ──> KPI-2
 │
 └─ SAU KHI CÓ QUYỀN
      ├─ quyền vào tầm ngắm của phân hệ phát hiện ─────────────────> MF-3
      ├─ NV tự trả, hoặc QL xác nhận không còn nhu cầu ............. [F-14]
      │     ├─ ⛔ không cho thu hồi "không lý do" — mọi thu hồi phải gắn
      │     │      với một nguồn quyết định truy được (BR-14.1)
      │     └─ ⛔ suất về trạng thái trống CHỈ SAU KHI tài khoản thật đã
      │            bị xóa, hoặc IT xác nhận không cần xóa (BR-14.2)
      ├─ quyền có thời hạn, sắp hết ──> gia hạn .................... [F-15]
      │     └─ ⛔ gia hạn tạo bản ghi quyết định MỚI, không sửa ngày
      │            trên bản ghi cũ
      └─ đổi gói nâng hoặc hạ ..................... [F-16] 📐 chỉ đặc tả

XONG KHI: người yêu cầu nhận được thông báo có quyền truy cập, và hệ thống
          ghi được tổng thời gian từ lúc gửi tới lúc xong, tách theo từng bước.
```

---

### 1.7. `MF-3` · Thu hồi lãng phí có bằng chứng ★ D-2

> **Mục đích:** đưa ra khuyến nghị thu hồi mà người nhận **phản biện được**, không phải phải tin.
> **Kích hoạt bởi:** tác vụ nền chạy theo lịch (G1, G2 hằng ngày; G3, G4 hằng tuần); hoặc IT import file nhật ký.
> **Đo bằng:** `KPI-3` tỷ lệ suất đang hoạt động trên tổng suất đã mua · `KPI-5` tỷ lệ khuyến nghị bị bác bỏ · `TC-2` số báo động giả bằng 0.

```
HAI ĐƯỜNG VÀO — khác nhau ở chỗ CÓ CẦN DỮ LIỆU NGOÀI KHÔNG

ĐƯỜNG A · chỉ dùng dữ liệu nội bộ      │ ĐƯỜNG B · cần nhật ký sử dụng
 ⚙ chạy hằng ngày ............ [F-19]  │  B3.1 IT import file .......... [F-17]
 │                                     │   │
 │ G1 · suất đã mua CHƯA GÁN cho ai    │   ├─ ⛔ LẦN ĐẦU cho một ứng dụng
 │      ──> nhắm vào THUÊ BAO,         │   │    ──> phải thông báo NLĐ TRƯỚC,
 │          không nhắm vào người;      │   │        chặn trước bước ghi .. [F-42]
 │          hành động = giảm số lượng  │   │    ├─ nội dung tối thiểu: ứng dụng
 │          tại kỳ gia hạn (BR-19.1)   │   │    │   nào · dữ liệu gì · mục đích
 │      độ chắc chắn: TUYỆT ĐỐI        │   │    │   · lưu bao lâu · xem lại ở đâu
 │                                     │   │    ├─ ⛔ KHÔNG cho ghi dữ liệu
 │ G2 · suất của người ĐÃ NGHỈ VIỆC    │   │    │      trước khi thông báo được
 │      <──────────────── MF-1 [F-05]  │   │    │      ghi nhận (BR-42.2)
 │      ⛔ bỏ qua MỌI ngưỡng ngày      │   │    └─ ⭐ đây KHÔNG phải tính năng
 │      ⛔ KHÔNG cần QL xác nhận,      │   │         tùy chọn mà là ĐIỀU KIỆN để
 │         chuyển thẳng IT (BR-05.2)   │   │         việc thu thập hợp pháp
 │      độ chắc chắn: TUYỆT ĐỐI        │   │
 │                                     │   ├─ ⛔ ứng dụng nhóm dịch vụ liên lạc
 │                                     │   │    ──> KHÔNG import, trừ khi đã bật
 │                                     │   │        có chủ đích (BR-17.8)
 │                                     │   │
 │                                     │   ├─ KHUNG IMPORT SÁU BƯỚC
 │                                     │   │   Tải lên (tính mã băm)
 │                                     │   │    ──> Đọc theo mẫu cấu hình
 │                                     │   │    ──> Khớp danh tính
 │                                     │   │    ──> ⛔ XEM TRƯỚC, bắt buộc xác nhận
 │                                     │   │    ──> Ghi dữ liệu
 │                                     │   │    ──> Tính lại tình trạng sử dụng
 │                                     │   │   └─ hủy ở bước xem trước
 │                                     │   │       ──> KHÔNG ghi một dòng nào
 │                                     │   │
 │                                     │   ├─ ⛔ KHOẢNG THỜI GIAN BAO PHỦ bắt buộc
 │                                     │   │    khai; file không tự chứa thì IT
 │                                     │   │    khai tay, không cho bỏ qua (BR-17.1)
 │                                     │   ├─ ⛔ mẫu cấu hình bắt buộc khai NGUỒN
 │                                     │   │    HIỂU "HOẠT ĐỘNG" LÀ GÌ (BR-17.5)
 │                                     │   │    Atlassian tính "xem một trang từ
 │                                     │   │    2 giây" là hoạt động — nhận con số
 │                                     │   │    mà không biết nghĩa của nó thì
 │                                     │   │    mọi người đều "đang dùng"
 │                                     │   ├─ ⛔ sự kiện chỉ mang tính XÁC THỰC
 │                                     │   │    KHÔNG tính là hoạt động (BR-17.4)
 │                                     │   ├─ ⭐ dữ liệu hoạt động gắn vào QUYỀN
 │                                     │   │    ĐANG HIỆU LỰC TẠI NGÀY XẢY RA
 │                                     │   │    SỰ KIỆN, KHÔNG gắn vào con người
 │                                     │   │    (BR-17.6)  <─────── MF-2 B2.7
 │                                     │   │
 │                                     │   └─ định danh chưa khớp ──> hàng đợi [F-18]
 │                                     │        ├─ giữ CẢ chuỗi gốc lẫn bản đã
 │                                     │        │    chuẩn hóa (BR-18.2)
 │                                     │        ├─ khớp thủ công bắt buộc ghi
 │                                     │        │    tên người xác nhận
 │                                     │        ├─ ⛔ một định danh khớp về hai
 │                                     │        │    nhân viên ──> CHẶN (BR-18.4)
 │                                     │        └─ ⛔ bản ghi chưa khớp KHÔNG BAO
 │                                     │             GIỜ dùng để kết luận (BR-18.1)
 │                                     │
 │                                     │  G3 · đã gán nhưng CHƯA TỪNG dùng — cao
 │                                     │  G4 · từng dùng nhưng ĐÃ NGỪNG — trung bình
 │                                     │  ⚙ chạy hằng tuần ............ [F-20]
 └───────────────────┬─────────────────┘
                     ↓
 B3.2 ⚙ TÁM CỔNG LỌC — chạy TRƯỚC mọi đánh giá
      1 gói tính theo đầu người?      5 cấp sau khi dữ liệu bắt đầu?
      2 tài khoản máy móc?            6 nguồn quá cũ?
      3 đang nghỉ dài?  <── MF-1      7 đang miễn trừ?
      4 vừa cấp, còn ân hạn?          8 đã có khuyến nghị đang mở?
      ├─ không qua cổng ──> bỏ qua, GHI LÝ DO (không im lặng bỏ)
      └─ ⛔ cổng 6 làm CẢ LẦN CHẠY DỪNG cho ứng dụng đó, báo dữ liệu lỗi thời
             — KHÔNG âm thầm chạy với dữ liệu cũ (BR-20.4)
      ⭐ tám cổng lọc quan trọng ngang với chính thuật toán phát hiện:
         chứng minh hệ thống KHÔNG BÁO ĐỘNG GIẢ có giá trị hơn chứng minh
         nó tìm ra nhiều (TC-2)
                     ↓
 B3.3 ⚙ SINH KHUYẾN NGHỊ
      ├─ ⛔ bằng chứng là BẢN CHỤP tại thời điểm sinh, không phải con trỏ
      │      tới nguồn (BR-20.3) — nguồn bị import đè thì khuyến nghị cũ
      │      sẽ hiển thị căn cứ của dữ liệu mới
      ├─ ngưỡng phân giải theo thứ tự:
      │      từng ứng dụng > tổ chức > mặc định hệ thống  (v0.5 — bỏ phòng ban)
      ├─ mức THEO DÕI     · 30–59 ngày ──> ⛔ CHỈ hiện bảng điều khiển
      │                                       CỦA IT, KHÔNG hiện màn hình QL,
      │                                       KHÔNG gửi thông báo (BR-20.5;
      │                                       FR-4.12 chốt ở QĐ-09)
      ├─ mức CẦN XEM XÉT  · từ 60 ngày ──> gửi QL
      └─ mức CẦN XỬ LÝ    · từ 90 ngày, hoặc chưa từng dùng, hoặc đã nghỉ
                                        ──> gửi QL và IT
      ⭐ nếu mọi phát hiện đều gửi thư, quản lý sẽ lọc vào thùng rác trong tuần đầu
                     ↓
 B3.4 ◆ QUẢN LÝ XÁC NHẬN ......................................... [F-21]
      │  gộp theo tuần, nhóm theo NHÂN VIÊN (không nhóm theo ứng dụng)
      │  hiển thị đầy đủ: số ngày không hoạt động · tên nguồn · ngày import
      │  · độ dài cửa sổ bao phủ · phương pháp khớp danh tính
      │  · định nghĩa "hoạt động" của nguồn · mức tin cậy
      │  · HAI con số tiết kiệm TÁCH BIỆT
      │  ├─ ⛔ QL KHÔNG xem được nhật ký hoạt động thô (BR-21.1)
      │  └─ ⭐ BẮT BUỘC nêu rõ giới hạn dữ liệu (BR-21.4), ví dụ
      │        "nguồn chỉ bao phủ 30 ngày — chưa đủ để kết luận chưa từng dùng"
      │        một khuyến nghị sai trình bày với giọng chắc nịch sẽ làm hỏng
      │        niềm tin vào cả trăm khuyến nghị đúng còn lại
      │
      ├─ GIỮ LẠI ──> đóng lần này, ⛔ chu kỳ sau VẪN HỎI LẠI (BR-21.5)
      │                "giữ lại" là phát biểu CÓ THỜI HẠN
      ├─ THU HỒI ──────────────────────────────────> B3.5
      ├─ TẠM MIỄN TRỪ ──> ⛔ BẮT BUỘC ngày hết hạn, tối đa 12 tháng
      │      chặn ở CẢ BA TẦNG: giao diện, dịch vụ, cơ sở dữ liệu (BR-21.3)
      │      └─ ⚙ báo trước 7 ngày · tới hạn ──> mở lại khuyến nghị .. [F-23]
      ├─ chọn hàng loạt ──> ⛔ bắt buộc MỘT lý do chung, không để trống
      └─ ⚙ khuyến nghị bị dữ liệu mới phủ định ──> đóng IM LẶNG (BR-21.6)
             số lượng khuyến nghị bị phủ định là một chỉ số chất lượng
             của rule engine ──> KPI-5

      ↑ G2 KHÔNG đi qua bước B3.4 — chuyển thẳng từ B3.3 xuống B3.5
                     ↓
 B3.5  IT THU HỒI ................................................ [F-22]
      ├─ thực hiện qua kênh tự động hoặc thủ công ──> dùng lại MF-2 B2.6
      ├─ IT có quyền KHÔNG đồng ý với xác nhận của QL, nhưng phải ghi lý do
      └─ ⛔ suất về trạng thái trống CHỈ SAU KHI tài khoản thật đã bị xóa
                     ↓
 B3.6 💰 GHI NHẬN TIẾT KIỆM — ⛔ ĐÚNG LOẠI, KHÔNG BAO GIỜ CỘNG HAI LOẠI
      ├─ THỰC HIỆN NGAY  · chỉ > 0 khi gói theo tháng, hoặc hợp đồng
      │                     cho giảm giữa kỳ (BR-20.2)
      └─ TẠI KỲ GIA HẠN  · mọi trường hợp còn lại ──────────────────> MF-4
            ⭐ ĐÂY LÀ MẮT XÍCH QUYẾT ĐỊNH GIÁ TRỊ CỦA CẢ HỆ THỐNG
               một danh sách khuyến nghị tách rời khỏi lịch hợp đồng
               thì phát hiện đúng nhưng không bao giờ thành tiền
      └─ ⛔ số ghi vào báo cáo là số THỰC TẾ THU ĐƯỢC, không phải số
             ước tính ban đầu (BR-22.2)

CHẠY SONG SONG
 ├─ Rà soát quyền truy cập định kỳ .............. [F-24] 📐 chỉ đặc tả
 └─ Phát hiện G5 hạ gói theo mức dùng ........... [F-25] ❌ ngoài phạm vi

XONG KHI: mỗi khuyến nghị kèm đủ căn cứ để người nhận phản biện được,
          và không có khuyến nghị nào sinh ra từ dữ liệu chưa đủ điều kiện.
```

---

### 1.8. `MF-4` · Kiểm soát hợp đồng và kỳ gia hạn

> **Mục đích:** không bao giờ bị gia hạn ngoài ý muốn, và biến khuyến nghị của `MF-3` thành tiền thật.
> **Kích hoạt bởi:** tác vụ chạy hằng ngày quét hạn chót báo hủy.
> **Đo bằng:** `KPI-4` — số thuê bao gia hạn mà không có quyết định được ghi nhận.

```
 ⚙ TÁC VỤ CHẠY HẰNG NGÀY — quét hạn chót báo hủy của mọi thuê bao
 │  ⛔ BR-26.1: đếm từ HẠN CHÓT BÁO HỦY, KHÔNG đếm từ ngày gia hạn
 │     cảnh báo trước ngày gia hạn 7 ngày trong khi hợp đồng buộc báo hủy
 │     trước 30 ngày là MỘT CẢNH BÁO VÔ DỤNG ĐƯỢC GỬI ĐÚNG GIỜ
 │
 ├─ ◆ dữ liệu về hạn báo hủy đang ở tình trạng nào?
 │    ├─ có rõ ràng ──> cảnh báo theo mốc đó
 │    ├─ chỉ có số ngày báo trước trong hợp đồng ──> suy ra,
 │    │     ⛔ GHI RÕ là số liệu suy ra, chưa xác nhận
 │    └─ không có cả hai, mà hợp đồng tự gia hạn
 │          ──> ⛔ KHÔNG SUY ĐOÁN. Hiện cảnh báo thiếu dữ liệu
 │
 ├─ B4.1  T−15 ngày ──> báo IT · TC · Business Owner · DC ........ [F-26] (v0.8 — BR-26.4)
 ├─ B4.2  T−7 ngày  ──> báo thêm QT
 │        └─ ⭐ MỖI MỐC CẢNH BÁO HIỂN THỊ KÈM CÁC KHUYẾN NGHỊ LÃNG PHÍ
 │              ĐANG MỞ CỦA CHÍNH THUÊ BAO ĐÓ (BR-26.2)  <────────── MF-3
 │              "gói này sắp gia hạn, và đang có 6 suất không ai dùng"
 │              — đây là nơi hai phân hệ gặp nhau và tạo ra giá trị lớn nhất
 │                của toàn hệ thống: thông tin ĐỦ ĐỂ RA QUYẾT ĐỊNH giảm số lượng
 │
 ├─ B4.3 ◆ DC QUYẾT ĐỊNH TRÊN SNAPSHOT NGÂN SÁCH ................... [F-27]
 │        │  Người duyệt chi (DC) quyết, hệ thống hiển thị snapshot ngân sách,
 │        │  số liệu sử dụng và so sánh số suất kỳ này với kỳ trước;
 │        │  DC có thể HỎI TC — KHÔNG chặn; TC ghi nhận SAU quyết định (QĐ-29b)
 │        ├─ GIA HẠN NGUYÊN TRẠNG ──> tạo BẢN GHI THUÊ BAO MỚI,
 │        │     bản ghi cũ chuyển sang hết hạn
 │        │     ⛔ KHÔNG sửa đè ngày trên bản ghi cũ (BR-27.1) — sửa đè
 │        │        sẽ xóa mất lịch sử giá và số lượng
 │        ├─ GIA HẠN + GIẢM SỐ LƯỢNG ──> 💰 GHI NHẬN TIẾT KIỆM THẬT ──> MF-5
 │        │     ⛔ chỉ ghi nhận khi số suất kỳ mới THẤP HƠN kỳ cũ (BR-27.2)
 │        ├─ HỦY DỊCH VỤ ──> gửi thông báo hủy trước hạn
 │        │     └─ ⛔ kiểm tra còn quyền nào đang hiệu lực không,
 │        │            cảnh báo người đang dùng (BR-27.3)
 │        └─ ⛔ KHÔNG AI XỬ LÝ ──> tự động gia hạn,
 │               GHI NHẬN LÀ MỘT SỰ CỐ ──────────────────────────> KPI-4
 │
 ├─ B4.4 ⚙ chuyển các quyền đang hiệu lực sang thuê bao mới,
 │        trong CÙNG MỘT giao dịch
 │
 └─ CHẠY SONG SONG · ⚙ ĐỐI SOÁT VỚI NHÀ CUNG CẤP .................. [F-28]
      │  ⛔ CHỈ đối soát ứng dụng CÓ kết nối tự động; ứng dụng không có
      │     kết nối KHÔNG sinh sai lệch giả (BR-28.1)
      ├─ hệ thống CÓ, nhà cung cấp KHÔNG có ──> mức TRUNG BÌNH
      │     người dùng không truy cập được dù đã được duyệt
      │     ──> IT cấp lại, hoặc xác nhận không cần
      ├─ nhà cung cấp CÓ, hệ thống KHÔNG BIẾT ──> ⚠ MỨC RẤT CAO
      │     ⭐ "CÓ NGƯỜI ĐƯỢC CẤP QUYỀN NGOÀI QUY TRÌNH"
      │     ──> IT điều tra ──> hợp thức hóa ──> MF-5 B5.6, hoặc thu hồi ──> MF-3
      └─ ⛔ hệ thống KHÔNG tự sửa để hai bên khớp nhau (BR-28.2) ──> [F-43]
             tự đồng bộ cho khớp là xóa mất chính bằng chứng của vấn đề

XONG KHI: mọi thuê bao có tự động gia hạn đều có một quyết định được ghi nhận
          TRƯỚC hạn báo hủy; và mọi sai lệch đều có quyết định của người thật.
```

---

### 1.9. `MF-5` · Minh bạch chi tiêu và phát hiện ngoài danh mục ★ D-4

> **Mục đích:** Tài chính trả lời được *"khoản này của ai, phục vụ việc gì"*, và bộ phận CNTT thấy được thứ đang tồn tại ngoài hệ thống.
> **Kích hoạt bởi:** nhánh 1 luôn sẵn sàng, không có điểm bắt đầu; nhánh 2 bắt đầu khi có file sao kê hoặc dữ liệu cấp quyền.
> **Đo bằng:** `KPI-1` — tỷ lệ chi tiêu nằm trong danh mục đã duyệt.

```
NHÁNH 1 · BẢNG CHI TIÊU — luôn sẵn sàng, không có điểm bắt đầu
 │
 ├─ B5.1  Phân bổ chi phí theo cost center và cây người phụ trách .. [F-29]
 │   ├─ ⭐ gói theo đầu người ──> quy về cost center của nhân viên
 │   │     TẠI THỜI ĐIỂM PHÁT SINH, không phải cost center hiện tại (BR-29.3)
 │   │     <──────────────────────────────── MF-1 B "đổi người quản lý / cost center"
 │   │     bỏ ràng buộc này thì báo cáo tháng trước sẽ đổi số mỗi lần
 │   │     ai đó đổi cost center
 │   ├─ gói cố định và gói dùng chung ──> chia theo tỷ lệ khai ở cấp thuê bao
 │   ├─ ⛔ luôn hiển thị CƠ SỞ GHI NHẬN đang xem: theo kỳ hay theo dòng tiền
 │   │     (BR-29.2) — không để người dùng đọc một con số mà không biết nó là gì
 │   ├─ mọi số tiền theo đồng tiền báo cáo; di chuột hiện nguyên tệ + tỷ giá
 │   ├─ hiển thị THỜI ĐIỂM DỮ LIỆU CẬP NHẬT GẦN NHẤT; chỉ gọi là thời gian
 │   │     thực khi nguồn thực sự hỗ trợ (BR-29.5)
 │   ├─ ⭐ cột "CHI PHÍ TRÊN MỖI SUẤT ĐANG HOẠT ĐỘNG"  <──────────── MF-3
 │   │     không phải trên mỗi suất ĐÃ MUA — đây là con số tài chính quan tâm
 │   │     nhất mà hầu như không hệ thống nào hiển thị: nó cho thấy ngay
 │   │     ứng dụng nào đang trả tiền cho không khí
 │   └─ mọi con số BẤM ĐƯỢC để xem căn cứ tính
 │
 └─ B5.2  Dự báo chi phí ba lớp ................................... [F-30]
     ├─ L1 · chi phí ĐÃ CAM KẾT ──> công thức xác định từ hợp đồng
     │     ⛔ KHÔNG dùng mô hình thống kê cho lớp này (BR-30.1) — dùng sẽ
     │        cho kết quả KÉM CHÍNH XÁC HƠN đọc thẳng hợp đồng
     ├─ L2 · biến động theo mức tiêu thụ ──> ⛔ QUA CỔNG KIỂM CHỨNG
     │     ├─ < 12 tháng dữ liệu ──> "chưa đủ dữ liệu lịch sử để dự báo
     │     │      có kiểm chứng"
     │     └─ sai số kiểm chứng lùi > ngưỡng (mặc định 20%)
     │            ──> ⛔ ẨN dự báo mô hình, chỉ hiện khoảng kịch bản,
     │                NÊU RÕ LÝ DO ẨN
     ├─ L3 · phụ thuộc quyết định ──> ba kịch bản theo giả định người dùng nhập
     └─ ⛔ KHÔNG hiển thị con số dự báo TRẦN TRỤI trong bất kỳ trường hợp nào
            luôn kèm bốn thứ: khoảng dữ liệu · giả định · sai số đo được
            · thời điểm tính (BR-30.2, BR-30.3)

NHÁNH 2 · PHÁT HIỆN NGOÀI DANH MỤC — có điểm bắt đầu rõ ràng
 │
 ├─ B5.3  Nguồn bằng chứng
 │   ├─ TC import sao kê, danh sách hóa đơn ...................... [F-31]
 │   ├─ IT import dữ liệu cấp quyền của hệ định danh ............. [F-32]
 │   └─ nhật ký truy cập web, proxy, CASB ....... [F-33] ❌ NGOÀI PHẠM VI
 │        ba lý do: vướng khung pháp lý · không có hạ tầng kiểm chứng
 │        · giá trị không tương xứng rủi ro
 │
 ├─ B5.4 ⚙ Chuẩn hóa mô tả giao dịch về tên nhà cung cấp
 │   │    ⛔ mức tin cậy tính TỪ PHƯƠNG PHÁP KHỚP, không lấy con số
 │   │       do mô hình tự khai
 │   ├─ khớp chính xác từ điển ....... CAO         ──> tự động chuẩn hóa
 │   ├─ khớp theo mẫu ................ KHÁ         ──> tự động, có thể xem lại
 │   ├─ khớp mờ ...................... TRUNG BÌNH  ──> hàng đợi xem lại
 │   └─ gợi ý bởi mô hình ngôn ngữ ... THẤP        ──> ⛔ BẮT BUỘC người xác nhận
 │   └─ ⛔ lưu CẢ giá trị thô LẪN giá trị đã chuẩn hóa, kèm phương pháp khớp,
 │          để giải trình được (BR-31.4)
 │
 ├─ B5.5 ⚙ Đối chiếu với danh mục đã duyệt ──> sinh bản ghi "cần xem xét"
 │   ├─ ⛔ đây KHÔNG PHẢI kết luận vi phạm — là "CÓ DẤU HIỆU một phần mềm
 │   │      chưa nằm trong danh mục", chờ người xem xét (BR-31.1)
 │   ├─ ⛔ mỗi nhà cung cấp chỉ có MỘT bản ghi đang mở; xuất hiện lại thì
 │   │      cập nhật lần thấy gần nhất và số lần (BR-31.2)
 │   └─ phân tầng rủi ro theo: mức nhạy cảm dữ liệu · số nhân viên liên quan
 │          · ứng dụng có hỗ trợ đăng nhập tập trung không
 │
 ├─ B5.6 ◆ IT XỬ LÝ — hỏi QL bối cảnh nghiệp vụ nếu liên quan nhiều người dùng
 │   │
 │   ├─ BÁO NHẦM ──> đóng; ⛔ xuất hiện lại thì MỞ LẠI (BR-31.3)
 │   │
 │   ├─ CHƯA DUYỆT ──> thu hồi, hướng người dùng sang công cụ sẵn có
 │   │
 │   └─ ĐÃ DUYỆT = HỢP THỨC HÓA ................................. [F-34]
 │         ⭐ BR-34.1: đây là KẾT CỤC BÌNH THƯỜNG VÀ TÍCH CỰC, không phải
 │            ngoại lệ — Shadow IT thường là tín hiệu bộ công cụ đã duyệt
 │            còn thiếu
 │         ├─ khai báo đầy đủ vào danh mục ────────────> MF-0 B0.3 [F-06]
 │         │     Business Owner · mức nhạy cảm · ba câu hỏi phân loại
 │         ├─ tạo yêu cầu mua chính thức để hợp thức hóa chi phí
 │         │     đang phát sinh ───────────────────────> MF-2 B2.1
 │         └─ người đang dùng ──> ghi nhận thành quyền chính thức,
 │               ⛔ KHÔNG bắt xin lại từ đầu (BR-34.2)
 │         ↺ VÒNG LẶP KHÉP KÍN — không phải ngõ cụt
 │
 ├─ B5.7  Đối soát hóa đơn ...................................... [F-35]
 │   │  ghép dòng hóa đơn về thuê bao tương ứng
 │   ├─ hiện BA con số cạnh nhau: trên hóa đơn · khai trong thuê bao
 │   │      · đang thực sự dùng
 │   ├─ ⛔ hệ thống KHÔNG tự sửa thuê bao theo hóa đơn (BR-35.1) ──> [F-43]
 │   └─ chênh lệch phải quy được về MỘT trong ba nguyên nhân:
 │          đã mua thêm chưa cập nhật · nhà cung cấp tính sai · dữ liệu nội bộ sai
 │
 ├─ Lập và theo dõi ngân sách, khoản cam kết .... [F-36] ✅ (📐 tới v0.4)
 ├─ Phát hiện SaaS ngoài danh mục từ bộ thu thập . [F-46] ✅ (mới ở v0.5)
 └─ Báo cáo hiệu suất và chất lượng ............. [F-47] ✅ (mới ở v0.5)

XONG KHI: mọi con số trên bảng bấm được để xem căn cứ tính; mỗi bản ghi phát
          hiện có người chịu trách nhiệm và một quyết định cuối, không tự đóng.
```

---

### 1.10. Bảng truy vết Main flow ↔ Flow con

Mỗi mã `F-xx` có **đúng một** main flow chủ sở hữu. Cột cuối ghi các main flow khác **gọi tới** luồng đó — đây là chỗ để kiểm tra không có luồng nào mồ côi và không có luồng nào bị hai chỗ cùng nhận.

| Main flow                       | Luồng con thuộc về                                         | Số luồng | Được gọi từ                                                   | Chuỗi demo |
| ------------------------------- | ---------------------------------------------------------- | -------- | ------------------------------------------------------------- | ---------- |
| **MF-0** Nền móng và quản trị   | F-01, F-06, F-37, F-38, F-40, F-43, **F-44**               | 7        | MF-2 gọi F-06 · MF-5 gọi F-06 · MF-4 gọi F-43 · MF-5 gọi F-43 | —          |
| **MF-1** Vòng đời nhân sự       | F-02, F-03, F-04, F-05, F-39, F-41                         | 6        | —                                                             | **D-3**    |
| **MF-2** Cấp quyền có kiểm soát | F-07, F-08, F-09, F-10, F-11, F-12, F-13, F-14, F-15, F-16 | 10       | MF-1 gọi F-15 · MF-3 dùng lại B2.6 (F-10, F-11)               | **D-1**    |
| **MF-3** Thu hồi lãng phí       | F-17, F-18, F-19, F-20, F-21, F-22, F-23, F-24, F-25, F-42, **F-45, F-48** | 12       | MF-0 gọi F-42 · MF-1 gọi F-22                                 | **D-2**    |
| **MF-4** Kiểm soát hợp đồng     | F-26, F-27, F-28                                           | 3        | —                                                             | —          |
| **MF-5** Minh bạch chi tiêu     | F-29, F-30, F-31, F-32, F-33, F-34, F-35, F-36, **F-46, F-47** | 10       | MF-4 gọi B5.6 khi hợp thức hóa · **MF-4 gọi `F-35`** qua `WF-16` | **D-4**    |
|                                 | **Tổng**                                                   | **48** *(44 tới v0.4)* |                                                               | 4 chuỗi    |

**Đối chiếu ngược — mỗi main flow phục vụ pain point nào:**

| Main flow | Pain point xử lý                            | Năng lực   | Chỉ số đo                    |
| --------- | ------------------------------------------- | ---------- | ---------------------------- |
| MF-0      | *(nền móng — không xử lý PP nào trực tiếp)* | —          | điều kiện để mọi KPI đo được |
| MF-1      | PP-1 nhóm G2                                | NL-2       | KPI-3                        |
| MF-2      | PP-5 quy trình chậm, PP-4 gián tiếp         | NL-3       | KPI-2                        |
| MF-3      | PP-1 ghost seat                             | NL-2, NL-4 | KPI-3, KPI-5, TC-2           |
| MF-4      | PP-2 auto-renewal                           | NL-1       | KPI-4                        |
| MF-5      | PP-3 bất đối xứng, PP-4 Shadow IT           | NL-5, NL-6 | KPI-1                        |

> Không có main flow nào không gắn với một pain point, trừ `MF-0` — và `MF-0` không gắn được là **đúng**, vì nó là điều kiện tiên quyết chứ không phải năng lực nghiệp vụ. Nếu buộc `MF-0` phải gắn với một pain point thì đó là dấu hiệu bảng đang được ép cho đẹp.

### 1.11. Năm mắt xích nối giữa các main flow

Đây là phần mà 48 luồng chi tiết **không thể hiện được**, và là lý do tầng main flow tồn tại. Mỗi mắt xích dưới đây là một chỗ mà bỏ đi thì hệ thống vẫn chạy, vẫn không báo lỗi, chỉ **mất tác dụng**.

| #     | Mắt xích                                                     | Từ → Tới                                 | Vì sao đây là chỗ chết người                                                                                                                                                                                                                                                                                |
| ----- | ------------------------------------------------------------ | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1** | ⭐ Khuyến nghị thu hồi → kỳ gia hạn                           | `MF-3` B3.6 → `MF-4` B4.2                | Với hợp đồng cam kết theo năm, thu hồi suất giữa kỳ **không tiết kiệm được đồng nào**. Tiền chỉ thật khi giảm số lượng tại ngày gia hạn. Một danh sách khuyến nghị tách rời khỏi lịch hợp đồng là phát hiện đúng nhưng không bao giờ thành tiền — đây là lý do nhiều nỗ lực tối ưu license không đi tới đâu |
| **2** | Nhật ký hoạt động neo vào **quyền**, không neo vào **người** | `MF-2` B2.7 → `MF-3` B3.1                | `BR-17.6`. Một người có thể được cấp suất, trả lại, rồi được cấp lại — ba lần cấp quyền riêng biệt. Neo vào người thì lần cấp mới thừa hưởng lịch sử lần cũ và **không bao giờ** bị phát hiện. Lỗi này không gây báo lỗi, không hiện trong nhật ký, chỉ làm phân hệ âm thầm mất tác dụng                    |
| **3** | Đơn vị chịu chi phí lấy **tại thời điểm phát sinh**          | `MF-1` F-03 → `MF-5` B5.1                | `BR-29.3`. Lấy đơn vị hiện tại thì báo cáo tháng trước đổi số mỗi lần có người đổi cost center, và mọi báo cáo đã phát hành thành vô nghĩa                                                                                                                                                                 |
| **4** | Hợp thức hóa quay lại thành yêu cầu mua                      | `MF-5` B5.6 → `MF-2` B2.1 và `MF-0` B0.3 | Vòng lặp khép kín. Nếu phát hiện Shadow IT chỉ dừng ở việc "ghi nhận rồi để đó", phân hệ trở thành một danh sách buộc tội không dẫn tới hành động nào                                                                                                                                                       |
| **5** | Thông báo phải đi **trước** dữ liệu                          | `MF-0` B0.6 → `MF-3` `F-42`              | `BR-42.1`. Đây không phải tính năng tùy chọn mà là **điều kiện để việc thu thập dữ liệu hợp pháp**. Bỏ nó thì cả phân hệ phát hiện mất cơ sở                                                                                                                                                                |

---

## 2. VS-0 — Vòng đời nhân sự

*Thuộc `MF-1`, trừ `F-01` thuộc `MF-0`. Xem mạch tổng ở mục 1.5.*

### 2.1. F-01 · Khởi tạo dữ liệu ban đầu

|                    |                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **Mục đích**       | Đưa doanh nghiệp từ trạng thái chưa có dữ liệu tới trạng thái hệ thống tạo được cảnh báo có thật |
| **Kích hoạt bởi**  | Lần đầu triển khai                                                                               |
| **Tiền điều kiện** | Có một tài khoản quản trị hệ thống đã tạo; tổ chức đã cấu hình đồng tiền báo cáo và múi giờ      |

**Các bước:**

| #   | Ai  | Làm gì                                                                                                      | Hệ thống phản hồi                                                                                              |
| --- | --- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 1   | IT  | Nhập file nhân sự: mã, họ tên, email công việc, đơn vị chịu chi phí, quản lý trực tiếp, ngày vào *(v0.5 — cột phòng ban nếu có chỉ lưu làm nhãn hiển thị)* | Dựng cây tổ chức; báo số nhân viên không xác định được quản lý                                                 |
| 2   | IT  | Khai báo từng ứng dụng đang dùng                                                                            | Yêu cầu điền người sở hữu nghiệp vụ và mức nhạy cảm dữ liệu; hỏi ứng dụng có thuộc nhóm dịch vụ liên lạc không |
| 3   | IT  | Nhập hợp đồng, gói, số suất đã mua, kỳ hạn, **hạn chót báo hủy**                                            | Cảnh báo nếu thuê bao tự động gia hạn mà thiếu hạn báo hủy                                                     |
| 4   | IT  | Ghi nhận hiện trạng ai đang giữ suất nào                                                                    | Tính ngay số suất trống; đánh dấu các bản ghi này là dữ liệu khởi tạo                                          |
| 5   | HT  | —                                                                                                           | **Chạy lần đánh giá đầu tiên cho nhóm G1 và G2**, hiển thị kết quả lên bảng điều khiển                         |
| 6   | IT  | Import file nhật ký sử dụng nếu lấy được                                                                    | Nêu rõ nguồn này phát hiện được nhóm lãng phí nào                                                              |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                                                                              |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| BR-01.1 | Không cho sang bước 4 nếu bước 1 và bước 3 chưa xong — không thể gán suất khi chưa có người và chưa có thuê bao                                       |
| BR-01.2 | Bản ghi cấp quyền nhập ở bước 4 được phép **không có** yêu cầu nguồn, và phải đánh dấu là dữ liệu khởi tạo để phân biệt với bản ghi sinh từ quy trình |
| BR-01.3 | Mọi bước dùng chung khung import sáu bước, gồm cả bước xem trước bắt buộc — không có luồng nhập liệu riêng cho khởi tạo                               |
| BR-01.4 | Trạng thái rỗng của mọi màn hình chính phải dẫn về đúng bước khởi tạo còn thiếu, không hiển thị trang trắng                                           |
| BR-01.5 | Dòng nhân sự **thiếu Cost Center** bị từ chối ở bước xem trước, nêu đúng dòng và cột; hệ thống **không** tạo nhân viên không có Cost Center và **không** dùng Cost Center kiểu *Chưa phân loại* để lách *(mới ở v0.8 — BRD `FR-9.7`, `INV-14b`, `QĐ-30c` — đồng bộ `BF-04`)* |
| BR-01.6 | Mã Cost Center trong file nhân sự phải **đã có** trong danh mục Cost Center do **Finance** quản lý; mã chưa có bị từ chối theo dòng ở bước xem trước, **không** tự tạo mã khi import *(mới ở v0.8 — OI-04 (Owner 25/09/2026))* |
| BR-01.7 | Giai đoạn khởi tạo — giai đoạn duy nhất được nhập Assignment **không có Request** — kết thúc khi IT Admin **chốt hoàn tất bước 4** trên checklist (ghi Audit Trail). Sau đó mọi Assignment phải có Request; không mở lại trong MVP; chênh lệch phát hiện sau đi qua đối soát sai lệch *(mới ở v0.8 — OI-10 (Owner 25/09/2026); BRD `FR-9.4`)* |

**Ngoại lệ:**

| Tình huống                                             | Xử lý                                                                     |
| ------------------------------------------------------ | ------------------------------------------------------------------------- |
| Nhân viên không xác định được quản lý trực tiếp        | Cho phép tiếp tục; những người này sẽ dùng người duyệt dự phòng ở gốc cây |
| Không có dữ liệu hợp đồng, chỉ biết đang dùng ứng dụng | Cho tạo thuê bao ở trạng thái nháp, đánh dấu thiếu dữ liệu tài chính      |
| File nhân sự thiếu cột đơn vị chịu chi phí             | Chặn — không có cột này thì toàn bộ báo cáo chi phí vô nghĩa              |

> **Điểm cần nhấn:** sau **bước 5**, hệ thống đã tạo giá trị đo được mà **chưa cần một dòng nhật ký bên ngoài nào**. Nó biết ngay bao nhiêu suất đã mua chưa gán, và bao nhiêu suất còn nằm trong tay người đã nghỉ. Bước 6 chỉ mở khóa thêm hai nhóm lãng phí tinh vi hơn. Điều này quan trọng vì nó cho thấy hệ thống **không phụ thuộc hoàn toàn** vào việc lấy được nhật ký từ nhà cung cấp — vốn là rủi ro lớn nhất của phân hệ Usage.

**Xong khi:** bảng điều khiển hiển thị được tổng chi phí phần mềm, tổng số suất, và **ít nhất một cảnh báo có thật** sinh từ dữ liệu vừa nhập.

---

### 2.2. F-02 · Nhân viên mới vào

|                    |                                                            |
| ------------------ | ---------------------------------------------------------- |
| **Mục đích**       | Người mới có đủ công cụ trong ngày đầu, không phải chờ     |
| **Kích hoạt bởi**  | IT thêm nhân viên mới, hoặc quản lý tạo yêu cầu onboarding |
| **Tiền điều kiện** | Đã có cây tổ chức và danh mục ứng dụng                     |

**Các bước:**

| #   | Ai  | Làm gì                                                                               | Hệ thống phản hồi                                                      |
| --- | --- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| 1   | IT  | Tạo hồ sơ nhân viên, gán đơn vị chịu chi phí, quản lý trực tiếp, ngày vào *(v0.5 — bỏ phòng ban)* | Tạo bản ghi quan hệ tổ chức có hiệu lực từ ngày vào                    |
| 2   | QL  | Tạo yêu cầu hộ cho nhân viên mới, chọn nhiều ứng dụng cùng lúc                       | Tách thành các yêu cầu riêng theo từng ứng dụng, gộp chung một mã lô   |
| 3   | HT  | —                                                                                    | Mỗi yêu cầu chạy luồng phê duyệt riêng theo chính sách của ứng dụng đó |
| 4   | IT  | Xử lý các yêu cầu đã duyệt                                                           | Gộp hiển thị theo người để IT làm một lượt                             |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                                                            |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| BR-02.1 | Quản lý được tạo yêu cầu hộ, nhưng **người thụ hưởng vẫn là nhân viên mới** — hai trường người yêu cầu và người thụ hưởng khác nhau |
| BR-02.2 | Quản lý tạo hộ thì **không tự duyệt bước quản lý** của chính yêu cầu đó; yêu cầu chuyển lên cấp trên                                |
| BR-02.3 | Yêu cầu cho người chưa tới ngày vào làm được phép tạo trước, nhưng ngày hiệu lực của quyền không sớm hơn ngày vào                   |

**Ngoại lệ:** nhân viên mới chưa có email công việc → chặn bước 2, vì email là khóa ánh xạ chính sang nhà cung cấp.

**Xong khi:** nhân viên đăng nhập được vào toàn bộ ứng dụng đã duyệt trong ngày làm việc đầu tiên, và mỗi quyền đều truy được về một yêu cầu.

---

### 2.3. F-03 · Nhân viên đổi người quản lý hoặc cost center

> **Đổi tên ở v0.5 — `QĐ-23`.** Tên cũ *"Nhân viên chuyển phòng ban"*. Hệ thống không còn quản lý phòng ban; mã `F-03` **giữ nguyên** vì BRD, Context Diagram và Business Workflows đang trích. Nội dung luồng không đổi bản chất: vẫn là thay đổi quan hệ tổ chức có ngày hiệu lực.

|                    |                                                          |
| ------------------ | -------------------------------------------------------- |
| **Mục đích**       | Giữ cho chi phí được quy đúng đơn vị theo từng thời điểm |
| **Kích hoạt bởi**  | IT cập nhật quan hệ tổ chức                              |
| **Tiền điều kiện** | Nhân viên đang ở trạng thái đang làm việc                |

**Các bước:**

| #   | Ai  | Làm gì                                                                      | Hệ thống phản hồi                                                                  |
| --- | --- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 1   | IT  | Cập nhật đơn vị chịu chi phí và/hoặc quản lý mới, kèm **ngày hiệu lực**     | **Không ghi đè** dữ liệu cũ — đóng giai đoạn cũ, mở giai đoạn mới                  |
| 2   | HT  | —                                                                           | Chi phí trước ngày hiệu lực vẫn thuộc đơn vị cũ; từ ngày hiệu lực thuộc đơn vị mới |
| 3   | HT  | —                                                                           | Chuyển các yêu cầu đang chờ duyệt sang quản lý mới, thông báo cả hai người         |
| 4   | HT  | —                                                                           | Lập danh sách suất người này đang giữ, gửi quản lý mới xem lại                     |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                                                        |
| ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| BR-03.1 | Ngày hiệu lực được phép đặt trong quá khứ, nhưng phải cảnh báo là sẽ làm thay đổi báo cáo chi phí đã phát hành                  |
| BR-03.2 | Các giai đoạn quan hệ tổ chức của cùng một nhân viên **không được chồng lấn** nhau                                              |
| BR-03.3 | Suất **đi theo người**; chỉ đơn vị chịu chi phí thay đổi. Nhưng quản lý mới nhận danh sách để xem lại                           |
| BR-03.4 | Yêu cầu đã tới bước duyệt chi hoặc bước IT thì **không** chuyển approver — giữ nguyên để không mất tính liên tục của quyết định *(sửa ở v0.5, v0.7)* |

**Ngoại lệ:**

| Tình huống                                           | Xử lý                                                                 |
| ---------------------------------------------------- | --------------------------------------------------------------------- |
| Người này đang là quản lý của người khác             | Chặn cho tới khi chỉ định người kế nhiệm cho các nhân viên trực thuộc |
| Người này là người sở hữu nghiệp vụ của một ứng dụng | Cảnh báo, cho phép tiếp tục nhưng nhắc chỉ định người thay            |

**Xong khi:** báo cáo chi phí của tháng trước ngày đổi vẫn hiển thị cost center cũ, tháng sau hiển thị cost center mới, và báo cáo theo cây người phụ trách phản ánh đúng người quản lý tại từng thời điểm.

---

### 2.4. F-04 · Nhân viên nghỉ dài và quay lại

|                   |                                                                 |
| ----------------- | --------------------------------------------------------------- |
| **Mục đích**      | Không sinh khuyến nghị thu hồi sai với người đang nghỉ phép dài |
| **Kích hoạt bởi** | IT cập nhật trạng thái sang nghỉ dài, và sau đó quay lại        |

| #   | Ai  | Làm gì                                                  | Hệ thống phản hồi                                                                             |
| --- | --- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1   | IT  | Đổi trạng thái sang nghỉ dài, ghi ngày dự kiến quay lại | **Loại nhân viên khỏi phạm vi đánh giá lãng phí** kể từ thời điểm này                         |
| 2   | HT  | —                                                       | Các khuyến nghị đang mở của người này chuyển sang trạng thái tạm dừng, không đóng             |
| 3   | IT  | Đổi trạng thái về đang làm việc khi người đó quay lại   | Đưa lại vào phạm vi đánh giá, nhưng **thời gian nghỉ không tính vào số ngày không hoạt động** |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                                                            |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| BR-04.1 | Số ngày không hoạt động tính bằng tổng ngày trừ đi khoảng thời gian nghỉ dài — nếu không, người vừa nghỉ ba tháng về sẽ bị báo ngay |
| BR-04.2 | Trạng thái nghỉ dài do IT cập nhật tay; hệ thống **không** tích hợp hệ thống nhân sự                                                |
| BR-04.3 | Nghỉ dài quá thời hạn dự kiến mà chưa cập nhật thì hệ thống nhắc IT, không tự đổi trạng thái                                        |

**Xong khi:** người vừa quay lại sau kỳ nghỉ dài không xuất hiện trong hàng đợi khuyến nghị trong vòng thời gian ân hạn.

---

### 2.5. F-05 · Nhân viên nghỉ việc

**Đây là kịch bản demo giá trị nhất** — vừa là chi phí vừa là lỗ hổng bảo mật, và độ chắc chắn tuyệt đối vì chỉ dùng dữ liệu nội bộ.

|                   |                                                      |
| ----------------- | ---------------------------------------------------- |
| **Mục đích**      | Không để người đã rời công ty còn giữ quyền truy cập |
| **Kích hoạt bởi** | IT chuyển trạng thái sang đang bàn giao              |

```mermaid
sequenceDiagram
    participant IT as IT Admin
    participant HT as Hệ thống
    participant QL as Quản lý
    participant NCC as Nhà cung cấp

    IT->>HT: Chuyển sang "đang bàn giao", đặt ngày làm việc cuối
    HT->>HT: Liệt kê suất đang giữ, cấp dưới trực tiếp và trách nhiệm Business Owner
    alt Có cấp dưới trực tiếp (người nghỉ là quản lý)
        HT->>IT: Yêu cầu cập nhật quản lý đang làm việc cho cấp dưới
        IT->>HT: Ghi nhận quan hệ quản lý mới; xác định lại bước duyệt theo FR-3.16
    else Không có cấp dưới trực tiếp
        HT->>HT: Bỏ qua chuyển quan hệ quản lý
    end
    opt Người nghỉ là Business Owner của ứng dụng SaaS
        HT->>IT: Cảnh báo cần chuyển trách nhiệm ứng dụng
        IT->>HT: Gán Employee đang làm việc làm Business Owner
    end
    HT->>QL: Danh sách bàn giao kèm hạn xử lý
    QL->>HT: Xác nhận dữ liệu công việc đã bàn giao (quản lý của người nghỉ)
    HT->>IT: Danh sách việc thu hồi theo từng ứng dụng
    opt Ngày làm việc cuối đổi hoặc nhân viên ở lại (QĐ-48)
        IT->>HT: Đổi ngày làm việc cuối hoặc hủy bàn giao, kèm lý do bắt buộc
        HT->>HT: Kiểm lại ánh xạ kế nhiệm; hủy phần chưa hiệu lực, giữ phần đã hiệu lực
    end
    Note over HT: Lát S0: IT chuyển tay. Lát S2: hệ thống tự chuyển khi tới ngày làm việc cuối. Qua ngày cuối mà chưa chuyển thì chưa có gì thay đổi
    HT->>HT: Chuyển sang "đã nghỉ việc"
    HT->>HT: Cho đăng ký thiết bị công ty hết hiệu lực, từ chối usage mới
    HT->>HT: Xác định lại người giữ bước duyệt đang chờ theo FR-3.16
    HT->>HT: Sinh lãng phí nhóm G2 cho mọi suất còn lại, mức cần xử lý ngay
    HT->>IT: Cảnh báo mức rất cao
    IT->>HT: Thu hồi hàng loạt
    HT->>NCC: Yêu cầu xóa tài khoản
    NCC-->>HT: Xác nhận
    HT->>HT: Trả suất về trạng thái trống
    HT->>IT: Báo cáo số suất thu hồi và tiết kiệm ước tính
    Note over HT: Tác vụ retention độc lập với kết quả thu hồi, kể cả thất bại
    Note over HT: Hạn 6 tháng hoặc 30 ngày sau ngày cuối, lấy mốc sớm hơn
    HT->>HT: Xóa usage chi tiết; giữ audit và tổng hợp phi định danh (F-41)
```

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                                                                 |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| BR-05.1 | Khuyến nghị nhóm G2 có mức độ tin cậy tuyệt đối và mức xử lý cao nhất, **bỏ qua mọi ngưỡng ngày**                                        |
| BR-05.2 | G2 **không cần** quản lý xác nhận — chuyển thẳng cho IT thực hiện. Người đã nghỉ thì không có gì để bàn                                  |
| BR-05.3 | Trạng thái đã nghỉ việc bắt buộc có ngày nghỉ; không cho để trống                                                                        |
| BR-05.4 | Thu hồi hàng loạt yêu cầu **gõ số lượng để xác nhận** và nhập lý do chung                                                                |
| BR-05.5 | Dữ liệu hoạt động chi tiết bị xóa sau 30 ngày kể từ ngày làm việc cuối; dữ liệu tổng hợp phi định danh và nhật ký kiểm toán được giữ lại |
| BR-05.6 | Hạn Manager xác nhận danh sách bàn giao mặc định là **1 ngày làm việc trước ngày làm việc cuối**; quá hạn chỉ nhắc. Tới ngày làm việc cuối IT **vẫn thu hồi**, ghi cờ *chưa xác nhận bàn giao* — bảo mật ưu tiên hơn bàn giao *(mới ở v0.8 — OI-14c (Owner 25/09/2026) — `OQ-US-08`)* |

**Ngoại lệ:**

| Tình huống                                           | Xử lý                                                                 |
| ---------------------------------------------------- | --------------------------------------------------------------------- |
| Nhà cung cấp không xóa được tự động                  | Sinh việc làm tay cho IT, vẫn nằm trong cùng hàng đợi, không biến mất |
| Có dữ liệu cần bàn giao trước khi xóa tài khoản      | Quản lý xác nhận đã bàn giao trước khi IT thu hồi                     |
| Người này là quản lý của người khác                  | IT cập nhật quản lý đang làm việc cho cấp dưới; hệ thống xác định lại người giữ bước duyệt theo `FR-3.16`, không đổi chuỗi bước hoặc đặt lại SLA. Không yêu cầu tuyển người thay vị trí |
| Người này là người sở hữu nghiệp vụ của một ứng dụng | Cảnh báo IT chỉ định người thay thế, không để trống                   |
| Nghỉ việc đột ngột, không có giai đoạn bàn giao      | Cho chuyển thẳng sang đã nghỉ; hệ thống sinh G2 ngay                  |
| Ngày làm việc cuối thay đổi *(`QĐ-48a`→`QĐ-48c`, `US-03-04` AC-14)* | IT đổi ngày khi hôm nay ≤ ngày cuối hiện tại, ngày mới ≥ max(hôm nay, ngày vào), **bắt buộc lý do**; ánh xạ kế nhiệm mang sang ngày sau ngày mới và kiểm lại; thiếu kế nhiệm thì chặn kèm danh sách. Đã qua ngày cuối thì không đổi được — chỉ còn hủy hoặc cho nghỉ việc |
| Nhân viên ở lại *(`QĐ-48a`, `QĐ-48c`, `US-03-04` AC-15)* | IT hủy bàn giao bất kỳ lúc nào trước *đã nghỉ việc*, kèm lý do. Kế nhiệm chưa hiệu lực bị hủy; kế nhiệm đã hiệu lực (kể cả *không có quản lý*) giữ và vẫn hiện hành — cấp dưới **không** tự trả về, IT đổi quản lý có ngày hiệu lực (`F-03`) nếu cần. Đã *đã nghỉ việc* thì không hủy được |
| Qua ngày làm việc cuối mà chưa chuyển *đã nghỉ việc* *(`QĐ-41a`, `US-03-04` AC-10/AC-12)* | Chưa có gì xảy ra: tài khoản vẫn dùng được, **không** thu hồi, **không** sinh `G2`, đăng ký thiết bị chưa hết hiệu lực; IT thấy nhân viên trong danh sách quá hạn bàn giao. Lát S0 IT chuyển tay; tự chuyển theo ngày là job lát S2 |

**Xong khi:** không còn suất nào gắn với người đã nghỉ, số tiết kiệm được ghi vào báo cáo, và sau 30 ngày dữ liệu hoạt động chi tiết của người đó không còn trong hệ thống.

---

### 2.6. F-39 · Nhà thầu và thực tập sinh sắp hết hạn

|                    |                                                                    |
| ------------------ | ------------------------------------------------------------------ |
| **Mục đích**       | Không để quyền của người làm có thời hạn tồn tại quá ngày kết thúc |
| **Kích hoạt bởi**  | Tác vụ chạy hằng ngày quét ngày kết thúc dự kiến                   |
| **Tiền điều kiện** | Bản ghi cấp quyền có ngày kết thúc dự kiến                         |

| #   | Ai  | Làm gì                                          | Hệ thống phản hồi                                                            |
| --- | --- | ----------------------------------------------- | ---------------------------------------------------------------------------- |
| 1   | HT  | Quét mọi quyền có ngày kết thúc dự kiến         | Lọc những bản ghi còn 7 ngày là hết hạn                                      |
| 2   | HT  | —                                               | Thông báo IT và quản lý trực tiếp, kèm hai lựa chọn: gia hạn hoặc để hết hạn |
| 3   | QL  | Chọn gia hạn có thời hạn mới, hoặc không làm gì | Gia hạn thì tạo yêu cầu loại gia hạn; không làm gì thì tiếp tục đếm          |
| 4   | HT  | Tới ngày hết hạn mà chưa gia hạn                | Đưa quyền vào hàng đợi cần thu hồi, **không tự thu hồi**                     |
| 5   | IT  | Thu hồi                                         | Chạy tiếp theo F-22                                                          |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                                     |
| ------- | ------------------------------------------------------------------------------------------------------------ |
| BR-39.1 | Quyền cấp cho nhà thầu, freelancer, thực tập sinh **bắt buộc** có ngày kết thúc dự kiến — không cho để trống |
| BR-39.2 | Hệ thống **không tự thu hồi** khi tới hạn. Tự thu hồi có thể cắt quyền của người đang làm dở việc            |
| BR-39.3 | Quá hạn mà chưa xử lý thì nổi lên bảng điều khiển IT như một mục nợ, không im lặng                           |
| BR-39.4 | Gia hạn quá 12 tháng liên tiếp phải có xác nhận thêm — dấu hiệu người này thực chất là nhân viên chính thức; là **xác nhận tường minh của Manager** trong bước xét nhu cầu như `BR-07.4` *(làm rõ ở v0.8 — OI-07a)* |

**Xong khi:** không có quyền nào của người làm có thời hạn tồn tại quá 7 ngày sau ngày kết thúc mà không có quyết định được ghi nhận.

---

## 3. VS-1 — Cấp quyền có kiểm soát

*Thuộc `MF-2`, trừ `F-06` thuộc `MF-0`. Xem mạch tổng ở mục 1.6.*

### 3.1. F-06 · Khai báo danh mục, gói, hợp đồng, thuê bao

|                   |                                                 |
| ----------------- | ----------------------------------------------- |
| **Mục đích**      | Dựng dữ liệu nền để các luồng khác chạy được    |
| **Kích hoạt bởi** | IT thêm ứng dụng mới, hoặc hợp thức hóa từ F-34 |

| #   | Ai  | Làm gì                                                                                                        | Hệ thống phản hồi                                                |
| --- | --- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 1   | IT  | Khai báo ứng dụng: tên, nhà cung cấp, tên miền, mức nhạy cảm dữ liệu, người sở hữu nghiệp vụ                  | Gợi ý nhà cung cấp từ từ điển dùng chung                         |
| 2   | IT  | Trả lời ba câu hỏi phân loại: có nhắn tin người-với-người không, có gọi hoặc họp không, có phải hộp thư không | Nếu có bất kỳ câu nào → **gắn cờ nhóm dịch vụ liên lạc**         |
| 3   | IT  | Khai báo gói, kèm **mô hình giá**                                                                             | Mô hình giá quyết định các phân hệ sau có áp dụng được hay không |
| 4   | IT  | Khai báo thuê bao: số suất, đơn giá, kỳ hạn, **hạn chót báo hủy**, cờ tự động gia hạn, cờ cho giảm giữa kỳ    | Cảnh báo nếu tự động gia hạn mà thiếu hạn báo hủy                |
| 5   | IT  | Đính kèm hợp đồng và hóa đơn gốc                                                                              | Lưu có kiểm soát truy cập, không để công khai                    |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                                                                                         |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BR-06.1 | Người sở hữu nghiệp vụ **bắt buộc** và phải là người đang làm việc                                                                                               |
| BR-06.2 | Cờ nhóm dịch vụ liên lạc quyết định chế độ xử lý dữ liệu: nhóm này **mặc định không thu thập dữ liệu hoạt động**, chỉ dùng danh sách thành viên                  |
| BR-06.3 | Bình luận trong tài liệu, ghi chú trong công cụ quản lý công việc, nhận xét trên bản thiết kế **không** tính là nhắn tin                                         |
| BR-06.4 | Mô hình giá không phải theo đầu người thì các phân hệ phát hiện lãng phí và đếm suất **không áp dụng** — giao diện hiển thị "không áp dụng", không hiển thị số 0 |
| BR-06.5 | Bật thu thập dữ liệu hoạt động cho nhóm liên lạc cần xác nhận của quản trị hệ thống, ghi nhật ký kiểm toán kèm lý do                                             |
| BR-06.6 | Chuyển ứng dụng sang *ngừng sử dụng* là thao tác của IT Admin: kiểm tra quyền còn hiệu lực và ghi **xác nhận của Business Owner** (người, thời điểm, nội dung) làm căn cứ. Business Owner không có thao tác trên hệ thống *(mới ở v0.8 — OI-05b (Owner 25/09/2026) — `OQ-US-10`; BRD 4.4)* |
| BR-06.7 | Business Owner nghỉ việc: giữ người cũ kèm cờ *cần thay thế* và cảnh báo IT tới khi có người mới đang làm việc; `INV-06` ghi nhận là vi phạm tạm thời có cảnh báo. Cảnh báo gia hạn **không** gửi cho người đã nghỉ *(mới ở v0.8 — OI-05c (Owner 25/09/2026) — `OQ-US-12`; BRD `FR-1.7`)* |
| BR-06.8 | Tệp gốc hợp đồng/hóa đơn chỉ mở qua đường dẫn có thời hạn: IT Admin trong quản lý hợp đồng, Finance trong đối soát, **Người duyệt chi chỉ của hồ sơ đang được giao quyết**; Manager không mở (`SoD-2`) *(mới ở v0.8 — OI-08a (Owner 25/09/2026) — `OQ-US-11`; BRD `FR-1.5`)* |
| BR-06.9 | Mỗi mục danh mục có một **nhóm chức năng** chọn từ danh sách do IT Admin duy trì; dùng để hiện công cụ tương tự khi Manager xét nhu cầu và kiểm trùng chức năng khi đánh giá SaaS mới/Shadow IT. Không dùng cho `G5` (ngoài phạm vi) *(mới ở v0.8 — OI-14e (Owner 25/09/2026) — `OQ-US-14`)* |

**Ngoại lệ:** ứng dụng không có trong từ điển nhà cung cấp → cho khai báo tự do, đồng thời đề xuất bổ sung vào từ điển.

**Xong khi:** ứng dụng xuất hiện trong danh mục để nhân viên chọn được ở F-07, và lịch cảnh báo gia hạn đã có mốc.

---

### 3.2. F-07 và F-08 · Xin cấp suất

Hai luồng chỉ khác nhau ở chỗ F-08 có thêm **bước duyệt chi của Người duyệt chi** vì phát sinh chi phí; Tài chính **không** nằm trên đường duyệt — chỉ trả lời khi Người duyệt chi hỏi và ghi nhận ngân sách **sau** khi đã duyệt. *(Viết lại ở v0.7 — `QĐ-29b`. v0.5 → v0.6: Tài chính ghi ý kiến trước Người duyệt chi. Tới v0.4, Tài chính là người duyệt chi phí.)*

|                    |                                                                               |
| ------------------ | ----------------------------------------------------------------------------- |
| **Mục đích**       | Làm cho đường chính thức nhanh hơn đường tắt                                  |
| **Kích hoạt bởi**  | Nhân viên gửi yêu cầu, hoặc quản lý gửi hộ                                    |
| **Tiền điều kiện** | Nhân viên đang làm việc hoặc nghỉ dài; ứng dụng đang hoạt động trong danh mục |

```mermaid
sequenceDiagram
    participant NV as Nhân viên
    participant HT as Hệ thống
    participant QL as Quản lý
    participant TC as Tài chính
    participant DC as Người duyệt chi
    participant IT as IT Admin

    NV->>HT: Chọn phần mềm, nhập lý do và thời hạn cần dùng
    HT->>NV: Hiện chi phí ước tính, chuỗi người duyệt, thời gian dự kiến
    NV->>HT: Gửi yêu cầu
    HT->>QL: Chuyển tới quản lý trực tiếp
    QL->>HT: Duyệt hoặc từ chối kèm lý do
    Note over HT: Chỉ khi phát sinh chi phí (F-08)
    HT->>DC: Chuyển tới Người duyệt chi, kèm snapshot ngân sách
    opt Người duyệt chi cần thêm thông tin
        DC->>HT: Hỏi Tài chính, SLA bước duyệt chi không dừng
        HT->>TC: Chuyển yêu cầu thông tin ngân sách
        TC->>HT: Trả lời, không duyệt và không chặn
    end
    DC->>HT: Duyệt hoặc từ chối kèm lý do
    par Song song khi đã duyệt chi
        HT->>TC: Tạo khoản cam kết Đang giữ, Tài chính ghi nhận
    and
        HT->>IT: Chuyển tới IT để thực hiện
    end
    IT->>HT: Chọn thuê bao và cấp suất
    HT->>NV: Thông báo đã có quyền, kèm hướng dẫn truy cập
```

**Các bước chi tiết:**

| #   | Ai  | Làm gì                                                               | Hệ thống phản hồi                                                                                         |
| --- | --- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 1   | NV  | Chọn phần mềm từ danh mục đã duyệt                                   | Hiện ngay tình trạng: còn suất, hết suất, hoặc không áp dụng                                              |
| 2   | NV  | Nhập lý do nghiệp vụ, đơn vị chịu chi phí, khoảng thời gian cần dùng | Mặc định đơn vị theo quan hệ tổ chức hiện hành                                                            |
| 3   | HT  | —                                                                    | **Hiện chi phí quy đổi và chuỗi người duyệt kèm thời gian dự kiến, trước khi gửi**                        |
| 4   | NV  | Gửi                                                                  | Chọn chính sách duyệt, **chốt cứng** chính sách đó vào yêu cầu, sinh toàn bộ bước, đặt thời hạn từng bước |
| 5   | QL  | Xem và quyết định                                                    | Hiển thị kèm **các suất người này đang giữ ở phần mềm cùng nhóm chức năng**                               |
| 6   | DC  | **Duyệt chi hoặc từ chối kèm lý do** *(chỉ F-08)*                    | Hiển thị **snapshot ngân sách**: ngân sách kỳ · thực chi · khoản cam kết đang giữ · còn lại · đang chờ duyệt của cost center, cùng nhu cầu đã được quản lý xác nhận. Chưa có ngân sách thì ghi rõ, không hiện 0 *(sửa ở v0.7)* |
| 6b  | TC  | *(tùy chọn, chỉ khi Người duyệt chi hỏi)* **Trả lời yêu cầu thông tin**: Trong hạn mức · Vượt hạn mức · Chưa có ngân sách | Bước duyệt chi **vẫn** của Người duyệt chi; SLA **không** dừng; câu trả lời **không chặn** *(mới ở v0.7)* |
| 8   | HT + TC | Hệ thống tạo **khoản cam kết**; Tài chính **ghi nhận ngân sách chính thức** *(chỉ F-08, song song với bước 9)* | Khoản cam kết ở trạng thái *Đang giữ*, gắn đúng yêu cầu này. Ghi *Vượt hạn mức*/*Chưa có ngân sách* ⟹ thông báo Người duyệt chi, **không** hoàn tác, **không** dừng cấp phát *(sửa ở v0.7)* |
| 9   | IT  | Chọn thuê bao và cấp suất                                            | Kiểm tra còn chỗ trong một giao dịch có khóa                                                              |
| 10  | HT  | —                                                                    | Thông báo, ghi nhật ký, tính thời gian xử lý toàn trình **tách theo từng bước**                           |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                                                                   |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| BR-07.1 | Bước 3 **không được bỏ**. Người yêu cầu phải nhìn thấy con số và thời gian dự kiến trước khi gửi — biện pháp rẻ nhất để giảm yêu cầu thừa  |
| BR-07.2 | Chính sách duyệt được **chốt cứng tại thời điểm gửi**. Nếu quản trị hệ thống sửa chính sách giữa chừng, yêu cầu đang chạy vẫn theo luật cũ. *(v0.6 — phân phạm vi với `QĐ-28d`)* Thứ được chốt là **nhánh và chuỗi loại bước**; **người cụ thể** giữ một bước đang chờ vẫn được xác định lại khi có sự kiện dữ liệu theo `BR-13.9` |
| BR-07.3 | Một nhân viên không được có hai quyền đang hiệu lực trên cùng một thuê bao                                                                 |
| BR-07.4 | Thời hạn cần dùng quá 12 tháng phải có xác nhận thêm — là **xác nhận tường minh của Manager** ngay trong bước xét nhu cầu, kèm lý do; không thêm bước duyệt *(làm rõ ở v0.8 — OI-07a, Owner 25/09/2026)* |
| BR-07.5 | Từ chối **bắt buộc** có lý do; duyệt thì không bắt buộc                                                                                    |
| BR-07.6 | Hết suất giữa luồng thì **chèn thêm bước duyệt chi vào chuỗi hiện có**, không hủy yêu cầu bắt làm lại *(sửa ở v0.5, v0.7)* |
| BR-07.7 | Quá hạn xử lý thì nhắc người được giao và **thông báo** cấp trên — *escalate chỉ là thông báo*, **không đổi người duyệt**. **Không bao giờ tự duyệt** *(sửa ở v0.6 — `QĐ-28d`, BRD `FR-3.8`)* |
| BR-07.8 | *(mới ở v0.5)* **Quản lý trực tiếp chính là Người duyệt chi** ⟹ vẫn **hai bước riêng** cho cùng một người, nhật ký **gắn cờ *cùng người***. Người duyệt chi là người yêu cầu hoặc người thụ hưởng ⟹ không tự duyệt; bước duyệt chi **tạo thẳng cho người thay thế khi xung đột** đã cấu hình trước (`BR-13.10`), chưa cấu hình thì chờ có kiểm soát — BRD `SoD-7`, `FR-3.15`, `FR-3.12` *(sửa ở v0.6 — trước đó đi theo ủy quyền)* |
| BR-07.9 | *(mới ở v0.5; viết lại ở v0.7 — `QĐ-29b`)* **Tài chính không nằm trên đường duyệt.** Người duyệt chi quyết trên snapshot ngân sách; **hỏi Tài chính là tùy chọn**, bước vẫn thuộc Người duyệt chi, **SLA không dừng, không đặt lại**; câu trả lời và ghi nhận sau duyệt **không chặn** — Người duyệt chi quyết cả khi *Chưa có ngân sách* hoặc Tài chính chưa trả lời — BRD `FR-3.14` |
| BR-07.10 | *(mới ở v0.5)* Khoản cam kết **chỉ sinh khi duyệt chi**. Từ chối thì không sinh; yêu cầu bị hủy hoặc cấp phát thất bại hẳn thì **giải phóng** — BRD `FR-5.8`, `INV-16` |
| BR-07.11 | Người yêu cầu được **rút** yêu cầu tới khi tác vụ cấp phát còn *chờ thực thi*, kể cả khi đã duyệt đủ; khoản cam kết (nếu có) được **giải phóng ngay** và Finance, IT được thông báo. Tác vụ đã *đang thực thi* thì không rút, dùng hoàn trả sau khi có quyền *(mới ở v0.8 — OI-06 (Owner 25/09/2026) — `BF-12`; BRD 5.12.3, `FR-5.8`)* |

**Ngoại lệ:**

| Tình huống                       | Xử lý                                                                               |
| -------------------------------- | ----------------------------------------------------------------------------------- |
| Đã có quyền cho ứng dụng đó      | Chặn ngay từ bước 1, hiện thông tin quyền đang có                                   |
| Hết suất trống                   | **Vẫn cho gửi**, gắn cờ phát sinh chi phí, chuyển sang chính sách có bước duyệt chi *(sửa ở v0.5, v0.7)* |
| Người duyệt chi vắng mặt hoặc nghẽn *(sửa ở v0.6)* | **Không** ủy quyền, **không** dùng người thay thế khi xung đột; nhắc, thông báo, cảnh báo Quản trị hệ thống — xem F-13, `BR-13.8` |
| Yêu cầu bị hủy hoặc cấp phát thất bại hẳn sau khi đã duyệt chi *(v0.5)* | Giải phóng khoản cam kết, ghi nhật ký              |
| Tài chính ghi nhận *Vượt hạn mức* hoặc *Chưa có ngân sách* sau khi đã duyệt chi *(mới ở v0.7)* | Thông báo Người duyệt chi; quyết định và cấp phát giữ nguyên |
| Không có quản lý trực tiếp       | Dùng người duyệt dự phòng ở gốc cây, nói rõ cho người yêu cầu biết                  |
| Người yêu cầu chính là quản lý   | Chuyển lên cấp trên một bậc *(định tuyến theo cây `FR-3.3`, không phải ủy quyền)*   |
| Người duyệt chi là người yêu cầu hoặc người thụ hưởng *(mới ở v0.6)* | Bước duyệt chi tạo cho người thay thế khi xung đột; chưa cấu hình thì chờ có kiểm soát — `BR-13.10` |
| Người duyệt vắng mặt hoặc nghẽn *(sửa ở v0.6)* | **Không** đổi người; nhắc, thông báo cấp trên, cảnh báo Quản trị hệ thống khi vượt ngưỡng backlog — xem F-13, `BR-13.8` |
| Người yêu cầu rút yêu cầu        | Cho phép nếu chưa tới bước IT thực hiện                                             |
| Người duyệt nghỉ việc giữa chừng, hoặc `manager_id` của người yêu cầu đổi *(sửa ở v0.6)* | Xác định lại người duyệt theo cây tổ chức mới, SLA không đặt lại — xem F-13, `BR-13.9` |

> **Ba chi tiết tạo ra khác biệt.** Bước 3 đặt kỳ vọng đúng và biến thời hạn xử lý thành lời hứa nhìn thấy được. Bước 5 cho quản lý thấy người này đang giữ công cụ tương tự nào — phát hiện trùng lặp *trước khi* tiêu tiền rẻ hơn nhiều so với phát hiện sau sáu tháng qua báo cáo. BR-07.6 tránh bắt quản lý duyệt lại thứ họ đã duyệt, vốn là loại ma sát sinh ra Shadow IT.

**Xong khi:** người yêu cầu nhận được thông báo có quyền truy cập, và hệ thống ghi được tổng thời gian từ lúc gửi tới lúc xong, tách theo từng bước. *(v0.5)* Với `F-08`: có đúng **một** khoản cam kết ở trạng thái *Đang giữ* gắn với yêu cầu, và bước duyệt chi được đo riêng.

---

### 3.3. F-09 · Xin phần mềm chưa có trong danh mục

|                   |                                                           |
| ----------------- | --------------------------------------------------------- |
| **Mục đích**      | Cho Shadow IT một đường chính thức thay vì chặn nó        |
| **Kích hoạt bởi** | Nhân viên không tìm thấy phần mềm cần dùng trong danh mục |

| #   | Ai  | Làm gì                                                                                                                      | Ghi chú                                          |
| --- | --- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| 1   | NV  | Nhập tên phần mềm, trang chủ, mục đích, **loại dữ liệu sẽ đưa vào**                                                         | Câu hỏi về loại dữ liệu là điểm khác so với F-07 |
| 2   | QL  | Xác nhận nhu cầu nghiệp vụ                                                                                                  |                                                  |
| 3   | IT  | **Đánh giá danh mục và rủi ro** — đã có công cụ tương đương chưa, mức nhạy cảm dữ liệu, có hỗ trợ đăng nhập tập trung không | Bước riêng, không gộp với bước thực hiện         |
| 4   | DC  | **Duyệt hoặc từ chối** — **luôn chạy, kể cả SaaS miễn phí** *(mới ở v0.5)*; có chi phí thì thấy snapshot ngân sách và có thể hỏi Tài chính *(v0.7)* | Xem `BR-09.4`, `BR-07.9`                        |
| 5   | IT + TC | IT thêm vào danh mục theo F-06, tạo thuê bao, cấp suất; **song song** hệ thống tạo khoản cam kết và Tài chính ghi nhận ngân sách **nếu có chi phí** *(sửa ở v0.7)* | IT không chờ Tài chính                          |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                                                                            |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| BR-09.1 | Bước 3 và bước 5 là **hai vai trò khác nhau của cùng bộ phận**: đánh giá được phép dùng hay không, và thực hiện. Không gộp                          |
| BR-09.2 | Kết quả "không duyệt" là kết quả hợp lệ và tích cực nếu công ty đã có công cụ tương đương — khi đó hệ thống hướng người yêu cầu sang công cụ sẵn có |
| BR-09.3 | Ứng dụng chạm dữ liệu ở mức nhạy cảm cao: IT **ghi nhận ý kiến** của người sở hữu nghiệp vụ ứng dụng tương đương (nếu có) hoặc Manager của người yêu cầu **trước** bước 4 *(bước duyệt chi)*. Ý kiến là **đầu vào không chặn** — không thêm bước, SLA hay người duyệt; không lấy được thì ghi rõ lý do *(làm rõ ở v0.8 — OI-05a, Owner 25/09/2026)* |
| BR-09.4 | *(mới ở v0.5 — `QĐ-22`)* **SaaS chưa có trong danh mục luôn đi qua Người duyệt chi, kể cả gói miễn phí** — thêm một SaaS nghĩa là thêm một nơi dữ liệu công ty nằm và thêm một đối tượng phải quản trị. Snapshot ngân sách, khoản cam kết và ghi nhận của Tài chính **chỉ có khi có chi phí** *(sửa ở v0.7)* |

> **Vì sao IT xuất hiện hai lần:** gộp lại sẽ khiến người quyết chi phải duyệt tiền cho một ứng dụng chưa ai đánh giá rủi ro — sai thứ tự nghiệp vụ, và sẽ bị hỏi ngay khi bảo vệ.

**Xong khi:** ứng dụng được thêm vào danh mục **hoặc** có quyết định không duyệt kèm lý do và gợi ý thay thế.

---

### 3.4. F-10 và F-11 · Thực thi cấp phát

**Vì sao luồng thủ công quan trọng hơn luồng tự động:** phần lớn phần mềm doanh nghiệp Việt Nam đang dùng **không** có sẵn kết nối tự động. Nếu hệ thống chỉ hỗ trợ tự động, nó chỉ dùng được cho vài ứng dụng.

```mermaid
flowchart TB
    ST["Đã đủ phê duyệt"] --> CH{"Ứng dụng có kết nối<br/>tự động không?"}
    CH -->|Có| AUTO["Hệ thống gọi<br/>nhà cung cấp"]
    CH -->|Không| MAN["Sinh việc làm tay<br/>kèm hướng dẫn"]
    AUTO --> OK{"Thành công?"}
    MAN --> ITDO["IT thao tác trên<br/>trang quản trị nhà cung cấp"]
    ITDO --> CONF["IT bấm đã hoàn tất"]
    OK -->|Có| DONE["✅ Người dùng có quyền"]
    OK -->|"Lỗi tạm thời"| RETRY["Thử lại sau,<br/>giãn cách tăng dần"]
    OK -->|"Lỗi vĩnh viễn"| FAIL["⚠️ Sinh việc cho IT<br/>báo cả người yêu cầu"]
    RETRY --> AUTO
    CONF --> DONE

    style DONE fill:#e6f4ea,stroke:#34a853
    style FAIL fill:#fce8e6,stroke:#ea4335
```

**Hai kênh, cùng một cách theo dõi:**

| Bước       | Kênh tự động                             | Kênh thủ công                                |
| ---------- | ---------------------------------------- | -------------------------------------------- |
| Nhận việc  | Worker nhặt khỏi hàng đợi                | IT bấm "tôi đang xử lý"                      |
| Thực hiện  | Gọi giao diện lập trình của nhà cung cấp | IT thao tác trên trang quản trị              |
| Hoàn tất   | **Không phải khi API trả về thành công.** Với nhà cung cấp mà thao tác cấp quyền tạo ra **lời mời chờ chấp nhận**, phản hồi thành công chỉ chứng minh *lời mời đã gửi*. Chỉ hoàn tất khi **đối soát thấy tài khoản trong danh sách thành viên** | IT bấm "đã hoàn tất", ghi tên người xác nhận |
| Bằng chứng | Nội dung phản hồi lưu vào nhật ký        | Ghi chú tùy chọn                             |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                                                                                         |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BR-10.1 | Với kênh thủ công, hệ thống **không** tự chuyển sang hoàn tất; phải có tên người thật xác nhận                                                                   |
| BR-10.2 | Khóa chống gọi trùng sinh từ dữ liệu nghiệp vụ, không sinh ngẫu nhiên — sinh ngẫu nhiên mỗi lần thử lại thì không chống được gì                                  |
| BR-10.3 | Hai kênh dùng chung một hàng đợi và một cách đo, để so sánh được thời gian xử lý giữa ứng dụng có kết nối và ứng dụng làm tay                                    |
| BR-10.4 | Quyền vẫn **chiếm chỗ** trong suốt thời gian đang thực hiện, kể cả khi thất bại — nếu nhả chỗ, người khác sẽ được gán và khi thử lại thành công thì vượt hạn mức |

**Xong khi:** có bằng chứng **tài khoản đã tồn tại phía nhà cung cấp** — bằng **xác nhận của người thật** (kênh thủ công), hoặc bằng **kết quả đối soát danh sách thành viên** (kênh tự động). **Riêng phản hồi thành công của lời gọi API thì chưa đủ.**

> 🔗 **Ràng buộc từ BRD mục 6.3 và `QĐ-03` — sửa ở lượt review diagram 08/09/2026.** Bản trước của mục này ghi *"Hoàn tất = nhà cung cấp trả về thành công"* và *"Xong khi: … hoặc phản hồi thành công"*. Câu đó **mâu thuẫn với BRD mục 6.3**, vốn quy định: *"`ProvisioningTask` **không được** chuyển sang trạng thái hoàn tất chỉ vì `PUT` trả về thành công — cần một bước đối soát lại bằng `GET .../members` hoặc bằng trạng thái membership."*
>
> **Vì sao:** với API thành viên tổ chức của GitHub, `PUT /orgs/{org}/memberships/{username}` cho người **chưa** là thành viên sẽ **gửi lời mời**, và tư cách thành viên ở trạng thái **`pending` cho tới khi người đó chấp nhận** *(kiểm chứng tại `docs.github.com/en/rest/orgs/members`)*. Đây là **ràng buộc của nhà cung cấp**, không phải lựa chọn thiết kế của nhóm.
>
> **Hệ quả cho ba loại "thành công" — không được đánh đồng:**
>
> | Thứ được xác nhận | Nghĩa là gì | Đủ để hoàn tất `ProvisioningTask`? |
> | --- | --- | --- |
> | **Phản hồi API** thành công | Yêu cầu đã được nhà cung cấp nhận | ❌ **Không** |
> | **Trạng thái phía nhà cung cấp** là `pending` | Lời mời đã gửi, chưa được chấp nhận | ❌ **Không** — suất vẫn chiếm chỗ theo `BR-10.4` |
> | **Trạng thái phía nhà cung cấp** là thành viên đang hoạt động | Tài khoản đã tồn tại thật | ✅ **Có** |
>
> **Đối xứng với `BR-10.1`:** `BR-10.1` đã cấm **kênh thủ công** tự chuyển sang hoàn tất khi chưa có người thật xác nhận. Ràng buộc trên là vế còn thiếu cho **kênh tự động**: không được coi phản hồi máy là bằng chứng đã cấp xong.
>
> **Nơi thể hiện:** `UF-08` và `WF-09a` có kết thúc riêng *"đã gửi lời mời, chờ chấp nhận"*; `UF-14` và `WF-16` có guard **bỏ qua** suất đang có lời mời chờ, để không sinh sai lệch giả *(nhóm trưởng chốt 08/09/2026)*. **Không đặt thêm thời hạn hay số lần thử mới** — chỉ dùng nhịp đối soát đã có.

---

### 3.5. F-12 · Xử lý cấp phát thất bại

**Bốn loại lỗi, xử lý khác nhau:**

| Loại        | Ví dụ                                     | Xử lý                                             | Thông điệp hiển thị                                            |
| ----------- | ----------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------- |
| Tạm thời    | Nhà cung cấp phản hồi chậm                | Thử lại tự động, tối đa 6 lần, giãn cách tăng dần | "Nhà cung cấp phản hồi chậm. Đã thử 3/6 lần, lần kế lúc 10:24" |
| Vĩnh viễn   | Email sai định dạng, tài khoản đã tồn tại | **Không thử lại**, báo người thật ngay            | "Nhà cung cấp từ chối: email đã tồn tại trong tổ chức"         |
| Xác thực    | Kết nối tới nhà cung cấp hết hạn          | Không thử lại, báo quản trị hệ thống              | "Kết nối tới Figma đã hết hạn"                                 |
| Hết hạn mức | Nhà cung cấp báo vượt số license          | Không thử lại, đẩy sang nhánh mua thêm suất       | "Đã dùng hết số license Figma đã mua"                          |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                                                           |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| BR-12.1 | Thử lại một lỗi vĩnh viễn là vô nghĩa và gây hại — nó tạo sáu dòng nhật ký giống nhau và trì hoãn thời điểm có người thật nhìn vào |
| BR-12.2 | Việc thất bại **không biến mất khỏi tầm nhìn**; nằm trong hàng đợi cho tới khi có người quyết định thử lại hay đóng lại            |
| BR-12.3 | Thất bại quá 7 ngày chưa xử lý thì nổi lên bảng điều khiển như một mục nợ                                                          |
| BR-12.4 | Thông báo lỗi cho người dùng cuối bằng tiếng Việt, không hiện mã lỗi kỹ thuật; mã lỗi để trong phần chi tiết mở rộng cho IT        |
| BR-12.5 | Người yêu cầu **cũng được báo** khi cấp phát thất bại — để họ biết mà không chờ vô ích                                             |

**Xong khi:** mọi việc thất bại đều có một quyết định được ghi nhận — thử lại, chuyển sang làm tay, hoặc đóng kèm lý do.

---

### 3.6. F-13 · Xử lý bước duyệt nghẽn, xung đột lợi ích và xác định lại người duyệt *(tới v0.5: “Ủy quyền phê duyệt”)*

> **Viết lại ở v0.6 — `QĐ-27`, `QĐ-28c`, `QĐ-28d`.** Giữ mã `F-13` vì BRD, Context Diagram và Business Workflows đang trích. **Không còn ủy quyền duyệt**: người được giao tự nhận và tự quyết. Luồng này mô tả ba việc hệ thống làm thay cho ủy quyền — nhắc và cảnh báo khi nghẽn, tạo bước cho người thay thế **chỉ** khi Người duyệt chi xung đột lợi ích, và xác định lại người duyệt **chỉ** khi dữ liệu tổ chức hoặc cấu hình vai trò đổi thật.

|                    |                                                                                         |
| ------------------ | --------------------------------------------------------------------------------------- |
| **Mục đích**       | Giữ luồng không treo vô hạn mà **không** chuyền quyền duyệt, để việc của ai người đó nhận |
| **Kích hoạt bởi**  | Bước quá SLA · backlog vượt ngưỡng · Người duyệt chi là người yêu cầu/thụ hưởng · sự kiện dữ liệu tổ chức |
| **Tiền điều kiện** | Request đã được gửi và chính sách duyệt đã chốt (`BR-07.2`)                            |

| #   | Ai | Làm gì | Hệ thống phản hồi |
| --- | --- | --- | --- |
| 1   | HT | Khi tạo bước duyệt chi: kiểm Người duyệt chi có phải người yêu cầu hoặc người thụ hưởng không | Có ⟹ **tạo thẳng** bước cho **người thay thế khi xung đột** Quản trị hệ thống đã cấu hình; ghi lý do *xung đột lợi ích*. Chưa cấu hình hoặc người thay thế cũng xung đột ⟹ chờ có kiểm soát (`BR-13.6`) |
| 2   | HT | Mỗi bước đang chờ: theo dõi người được giao, thời điểm nhận, tuổi SLA, số lần nhắc | Quá SLA ⟹ nhắc người được giao, **thông báo** cấp trên của người đó (nếu có). **Không** đổi người |
| 3   | HT | Số bước đang chờ của một người vượt ngưỡng backlog, hoặc có bước quá SLA | Cảnh báo Quản trị hệ thống, đưa vào **bảng theo dõi nghẽn** (BRD `FR-5.11`) |
| 4   | QT | Xem bảng theo dõi nghẽn | Chỉ được sửa cấu hình, dữ liệu tổ chức, hoặc ghi nhận sự cố. **Không** có nút duyệt thay |
| 5   | HT | Nhận sự kiện dữ liệu: `manager_id` của người yêu cầu đổi · người được giao nghỉ việc · QT đổi người giữ vai Người duyệt chi, người thay thế khi xung đột, hoặc người duyệt dự phòng ở gốc | **Xác định lại** người duyệt của bước đang chờ theo đúng quy tắc định tuyến gốc; ghi sự kiện nguồn, người cũ, người mới. SLA **không** đặt lại |
| 6   | Người được giao | Tự nhận và quyết định | Người quyết thực tế **phải trùng** người được giao hiện hành |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung |
| ------- | -------- |
| ~~BR-13.1~~ | 📁 **Nghỉ hưu ở v0.6** — chặn ủy quyền vòng tròn; không còn ủy quyền (`QĐ-27`) |
| BR-13.2 | Mọi lần xác định lại người duyệt **không đặt lại đồng hồ thời hạn xử lý**. Thời hạn thuộc về bước, không thuộc về người *(tới v0.5 phát biểu cho ủy quyền; nghĩa gốc giữ nguyên)* |
| ~~BR-13.3~~ | 📁 **Nghỉ hưu ở v0.6** — ràng buộc của người được ủy quyền; không còn ủy quyền. Nguyên tắc không tự duyệt vẫn giữ ở `SoD-4`, `INV-08` |
| BR-13.4 | Nhật ký ghi tách **người được giao** và **người quyết thực tế**, cộng lịch sử mọi lần xác định lại. Từ v0.6 hai người phải trùng nhau tại lúc quyết — lệch là lỗi phân quyền, không phải ủy quyền |
| ~~BR-13.5~~ | 📁 **Nghỉ hưu ở v0.6** — người được ủy quyền trùng người yêu cầu (`QĐ-12`, bị `QĐ-27` thay thế) |
| BR-13.6 | **Hết người duyệt hợp lệ trong cả chuỗi ⟹ giữ Request ở trạng thái chờ**, gắn cờ *chưa có người duyệt hợp lệ*, nhắc và **thông báo** theo `FR-3.8`, **báo Quản trị hệ thống cấu hình lại**. Không tự duyệt, không tự từ chối, không giao quyền duyệt cho Quản trị hệ thống *(`SoD-1`)* — `QĐ-13`, BRD `FR-3.12` *(sửa ở v0.6: bỏ chữ “leo cấp”)* |
| ~~BR-13.7~~ | 📁 **Nghỉ hưu ở v0.6** — Người duyệt chi ủy quyền được; không còn ủy quyền |
| BR-13.8 | *(mới ở v0.6 — `QĐ-27`, `QĐ-28d`)* **Nghẽn chỉ được xử lý bằng nhắc, thông báo và cảnh báo.** Không ủy quyền, không đổi người, không tự duyệt, không tự từ chối. Quản trị hệ thống **không** được duyệt thay — BRD `FR-3.5`, `FR-3.8` |
| BR-13.9 | *(mới ở v0.6 — `QĐ-28d`)* **Chỉ xác định lại người duyệt khi có sự kiện dữ liệu thật** — `manager_id` đổi, người được giao nghỉ việc hoặc không còn hợp lệ, Quản trị hệ thống đổi cấu hình vai trò. Nghỉ phép, vắng mặt, backlog cao **không** phải sự kiện — BRD `FR-3.16` |
| BR-13.10 | *(mới ở v0.6 — `QĐ-28c`)* **Người thay thế khi xung đột** là cấu hình tĩnh của Quản trị hệ thống, lập trước. Chỉ áp khi Người duyệt chi là người yêu cầu hoặc người thụ hưởng; **không** do Quản lý, Người duyệt chi hay người yêu cầu chọn; **không** áp cho backlog; **không** tạo ứng viên song song; **không** dùng để né SLA — bước được tạo thẳng cho người thay thế ngay từ đầu. Người thay thế chịu đủ `SoD-7`, `SoD-8` — BRD `FR-3.15` |
| BR-13.11 | SLA của mọi loại bước tính theo **giờ làm việc** của tổ chức; mặc định **2 ngày làm việc**, Super Admin chỉnh theo từng loại bước *(mới ở v0.8 — OI-14a (Owner 25/09/2026) — `OQ-US-02`; BRD `FR-3.8`)* |
| BR-13.12 | Không lưu được cấu hình *Người duyệt chi thay thế khi xung đột* **trùng** Người duyệt chi (kể cả khi đổi Người duyệt chi thành chính người thay thế) *(mới ở v0.8 — OI-17 (Owner 25/09/2026) — `OQ-US-01`; BRD `FR-3.15`)* |

**Ngoại lệ:**

| Tình huống | Xử lý |
| --- | --- |
| Người duyệt chi nghỉ phép dài | Không phải sự kiện dữ liệu, không phải xung đột ⟹ nhắc và cảnh báo backlog; nếu tổ chức muốn đổi người giữ vai thì Quản trị hệ thống đổi **cấu hình**, việc xác định lại theo `BR-13.9` |
| Người thay thế khi xung đột nghỉ việc trong lúc đang giữ bước | Sự kiện dữ liệu ⟹ xác định lại theo `BR-13.9`; không còn ai hợp lệ ⟹ `BR-13.6` |
| Quản lý trực tiếp cũng là Người duyệt chi, **không** phải người yêu cầu | Không phải xung đột ⟹ giữ hai bước, gắn cờ *cùng người* (`BR-07.8`) |

> **Vì sao người thay thế khi xung đột không phải ủy quyền:** ủy quyền là người đang giữ quyền **tự chọn** người thay, theo **thời gian vắng mặt**, áp lên **mọi** bước. Người thay thế ở đây là **cấu hình tổ chức** lập trước, áp theo **điều kiện xung đột trên đúng một Request**, và không ai trong luồng chọn được.

**Xong khi:** không bước nào bị đổi người vì nghẽn; mọi lần xác định lại truy được về một sự kiện dữ liệu; khoản chi mà Người duyệt chi là người yêu cầu hoặc thụ hưởng vẫn đi tới được một quyết định; và **không có đường nào dẫn tới việc một người tự duyệt yêu cầu của chính mình**.

---

### 3.7. F-14 và F-15 · Hoàn trả và gia hạn có thời hạn

| Luồng                        | Kích hoạt bởi                                             | Điểm cần chú ý                                                                     |
| ---------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **F-14 Hoàn trả**            | Nhân viên tự trả, hoặc quản lý xác nhận không còn nhu cầu | Nguồn quyết định phải truy được: yêu cầu hoàn trả, xác nhận thu hồi, hay nghỉ việc |
| **F-15 Gia hạn có thời hạn** | Sắp tới ngày kết thúc dự kiến                             | Gia hạn tạo bản ghi quyết định mới, không sửa ngày trên bản ghi cũ                 |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                                  |
| ------- | --------------------------------------------------------------------------------------------------------- |
| BR-14.1 | Không cho thu hồi "không lý do" — mọi thu hồi phải gắn với một nguồn quyết định                           |
| BR-14.2 | Suất được nhả về trạng thái trống **chỉ sau khi** tài khoản thật đã bị xóa hoặc IT xác nhận không cần xóa |
| BR-15.1 | Gia hạn quá 12 tháng liên tiếp cần xác nhận thêm — **xác nhận tường minh của Manager** trong bước xét nhu cầu như `BR-07.4` *(làm rõ ở v0.8 — OI-07a)* |

**Xong khi:** suất về trạng thái trống và có thể tái phân bổ, hoặc được ghi nhận để giảm số lượng tại kỳ gia hạn.

---

## 4. VS-2 — Thu hồi lãng phí có bằng chứng

*Thuộc `MF-3`. Xem mạch tổng ở mục 1.7.*

### 4.1. F-17 · Import dữ liệu sử dụng

|                    |                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------- |
| **Mục đích**       | Đưa dữ liệu hoạt động từ bên ngoài vào **mà không kết luận sai trên dữ liệu thiếu** |
| **Kích hoạt bởi**  | IT tải file lên; *(v0.5)* hoặc **bộ thu thập trên thiết bị gửi bản tổng hợp theo ngày** — xem `F-45` |
| **Tiền điều kiện** | Ứng dụng đã có trong danh mục và có mẫu cấu hình nguồn                              |

```mermaid
flowchart LR
    A["1· Tải file lên<br/>tính mã băm"] --> B["2· Đọc theo<br/>mẫu cấu hình"]
    B --> C["3· Khớp danh tính"]
    C --> D["4· XEM TRƯỚC<br/>bắt buộc xác nhận"]
    D --> E["5· Ghi dữ liệu"]
    E --> F["6· Tính lại<br/>tình trạng sử dụng"]
    D -.->|"người dùng hủy"| X["Không ghi gì cả"]
    style D fill:#fef7e0,stroke:#fbbc04,stroke-width:3px
```

**Nội dung bắt buộc của bước 4 — không được rút gọn:**

| Hệ thống cho biết                              | Vì sao quan trọng                                 |
| ---------------------------------------------- | ------------------------------------------------- |
| Số dòng hợp lệ, số dòng lỗi kèm lý do          | Tải về được danh sách lỗi để sửa                  |
| Số dòng trùng sẽ bỏ qua                        |                                                   |
| Số định danh **chưa khớp** được                | Những dòng này **không** được dùng để kết luận    |
| **Khoảng thời gian file này bao phủ**          | Quyết định suất nào đánh giá được, suất nào không |
| Số quyền sẽ bị ảnh hưởng                       | Cho thấy quy mô tác động trước khi ghi            |
| **Nguồn này phát hiện được nhóm lãng phí nào** | Không để người dùng kỳ vọng sai                   |
| **Nguồn này hiểu "hoạt động" là gì**           | Xem BR-17.5                                       |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                                    |
| ------- | ----------------------------------------------------------------------------------------------------------- |
| BR-17.1 | Khoảng thời gian bao phủ **bắt buộc**. File không tự chứa thì IT khai tay, không cho bỏ qua                 |
| BR-17.2 | Chuẩn hóa múi giờ về múi giờ tổ chức **trước khi** cắt theo ngày                                            |
| BR-17.3 | Chuẩn hóa email theo đúng một hàm dùng chung, áp cả khi tạo ánh xạ lẫn khi đối chiếu                        |
| BR-17.4 | Sự kiện chỉ mang tính xác thực — đăng nhập, chuyển hướng đăng nhập một lần — **không** tính là hoạt động    |
| BR-17.5 | Mẫu cấu hình **bắt buộc** khai báo nguồn hiểu "hoạt động" là gì. Nguồn có định nghĩa lỏng bị hạ mức tin cậy |
| BR-17.6 | Dữ liệu hoạt động gắn vào **quyền đang hiệu lực tại ngày xảy ra sự kiện**, không gắn vào con người          |
| BR-17.7 | Lỗi ở một dòng không làm hỏng cả file                                                                       |
| BR-17.8 | Không import dữ liệu hoạt động cho ứng dụng có cờ nhóm dịch vụ liên lạc, trừ khi đã được bật có chủ đích    |
| BR-17.9 | *(mới ở v0.5 — `QĐ-20`)* Dữ liệu từ bộ thu thập **không đi qua bước xem trước** vì đến tự động theo ngày, nhưng vẫn qua đủ **khớp danh tính, cửa sổ bao phủ, định nghĩa hoạt động**; và **bị từ chối ngay tại cổng nhận** nếu thiết bị chưa đăng ký, nhân viên chưa xác nhận, hoặc bản ghi mang trường ngoài lược đồ — BRD `INV-17`, `ADR-13` |

> **BR-17.6 là chi tiết dễ bỏ sót nhất của cả phân hệ.** Một nhân viên có thể được cấp suất, trả lại, rồi được cấp lại — ba lần cấp quyền riêng biệt. Nếu gắn nhật ký vào con người rồi lấy ngày hoạt động gần nhất, lần cấp mới sẽ thừa hưởng lịch sử của lần cũ và **không bao giờ** bị phát hiện. Lỗi này không gây báo lỗi, không hiện trong nhật ký, chỉ làm phân hệ âm thầm mất tác dụng.
>
> **BR-17.5 xuất phát từ một phát hiện thực tế:** Atlassian tính "xem một trang từ 2 giây" là hoạt động. Nhận con số ngày hoạt động cuối mà không biết nó nghĩa là gì thì mọi người đều "đang dùng".

**Ngoại lệ:**

| Tình huống                               | Xử lý                                                              |
| ---------------------------------------- | ------------------------------------------------------------------ |
| Mã băm trùng file đã import              | Cảnh báo, cho ghi đè có chủ đích, không chặn cứng                  |
| Chưa có mẫu cấu hình cho nhà cung cấp    | Hướng dẫn tạo mẫu mới bằng giao diện ánh xạ cột — **không sửa mã** |
| Người dùng hủy ở bước 4                  | Không ghi một dòng nào                                             |
| Hai file cùng ứng dụng, cửa sổ chồng lấn | Xem F-43                                                           |

**Xong khi:** không dòng nào được ghi trước khi người dùng xác nhận, và sau khi ghi thì tình trạng sử dụng của các quyền liên quan đã được tính lại.

> **Ví dụ nguồn GitHub — v0.6, `QĐ-28a`.** GitHub có **hai** nguồn usage riêng, mỗi nguồn khai cửa sổ bao phủ và định nghĩa hoạt động riêng: **(1) lịch sử commit** vào repo của org — hoạt động = có commit trong ngày, định danh là `login`; **(2) tiện ích trình duyệt** với `github.com` theo `F-45`. Ngày hoạt động cuối lấy **muộn nhất trong các nguồn còn đủ độ mới và đã khớp danh tính**. **Audit log organization không phải nguồn usage** — nó chỉ ghi hành động quản trị. Không có commit hoặc không có dữ liệu tiện ích mà cửa sổ không đủ thì là *không có dữ liệu*, **không** phải *không hoạt động* (BRD `FR-4.10`).

---

### 4.2. F-18 · Xử lý hàng đợi chưa khớp danh tính

| #   | Ai  | Làm gì                                 | Hệ thống phản hồi                                                              |
| --- | --- | -------------------------------------- | ------------------------------------------------------------------------------ |
| 1   | HT  | Sau mỗi lần import                     | Đưa các định danh không khớp vào hàng đợi, kèm chuỗi gốc nguyên văn            |
| 2   | IT  | Xem chuỗi gốc, tìm nhân viên tương ứng | Gợi ý ứng viên gần đúng                                                        |
| 3   | IT  | Gán tay, hoặc đánh dấu bỏ qua          | Ghi phương pháp khớp là thủ công, mức tin cậy tương ứng, và tên người xác nhận |
| 4   | HT  | —                                      | **Chạy lại tổng hợp** cho các quyền liên quan tới định danh vừa khớp           |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                                                          |
| ------- | --------------------------------------------------------------------------------------------------------------------------------- |
| BR-18.1 | Bản ghi chưa khớp **không bao giờ** được dùng để kết luận về bất kỳ ai                                                            |
| BR-18.2 | Giữ **cả chuỗi gốc lẫn bản đã chuẩn hóa** — khi IT phải giải thích vì sao kết luận `baovh` là Vũ Hoàng Bảo, họ cần thấy chuỗi gốc |
| BR-18.3 | Khớp thủ công bắt buộc ghi tên người xác nhận                                                                                     |
| BR-18.4 | Một định danh khớp về hai nhân viên khác nhau thì chặn, đưa lên cho người xử lý                                                   |

**Xong khi:** hàng đợi chưa khớp có xu hướng giảm sau mỗi kỳ import, và không có kết luận nào được sinh từ dữ liệu chưa khớp.

---

### 4.3. F-19 và F-20 · Phát hiện lãng phí

**Bốn nhóm, khác nhau về nguồn dữ liệu và độ chắc chắn:**

| Nhóm   | Là gì                                | Cần dữ liệu ngoài | Độ chắc chắn | Ai quyết định      |
| ------ | ------------------------------------ | ----------------- | ------------ | ------------------ |
| **G1** | Suất đã mua chưa gán cho ai          | ❌                 | Tuyệt đối    | Người duyệt chi, tại kỳ gia hạn — IT đề xuất *(sửa ở v0.8 — `FR-3.13`, `BR-27.4`; đóng `BF-03`)* |
| **G2** | Suất của người **đã nghỉ việc**      | ❌                 | Tuyệt đối    | IT, thu hồi ngay   |
| **G3** | Suất đã gán nhưng **chưa từng** dùng | ✅                 | Cao          | Quản lý xác nhận   |
| **G4** | Suất từng dùng nhưng **đã ngừng**    | ✅                 | Trung bình   | Quản lý xác nhận   |

**Tám cổng lọc chạy trước mọi đánh giá:**

```mermaid
flowchart TB
    IN["Mọi suất đang chiếm chỗ"] --> F1{"1· Gói tính theo<br/>đầu người?"}
    F1 -->|Không| OUT["Bỏ qua, ghi lý do"]
    F1 -->|Có| F2{"2· Tài khoản máy móc?"}
    F2 -->|Có| OUT
    F2 -->|Không| F3{"3· Đang nghỉ dài?"}
    F3 -->|Có| OUT
    F3 -->|Không| F4{"4· Vừa được cấp,<br/>chưa hết ân hạn?"}
    F4 -->|Có| OUT
    F4 -->|Không| F5{"5· Cấp sau khi<br/>dữ liệu bắt đầu?"}
    F5 -->|Có| OUT
    F5 -->|Không| F6{"6· Nguồn quá cũ?"}
    F6 -->|Có| STALE["Dừng đánh giá<br/>báo dữ liệu lỗi thời"]
    F6 -->|Không| F7{"7· Đang miễn trừ?"}
    F7 -->|Có| OUT
    F7 -->|Không| F8{"8· Đã có khuyến nghị<br/>đang mở?"}
    F8 -->|Có| OUT
    F8 -->|Không| EVAL["Đánh giá và<br/>sinh khuyến nghị"]

    style STALE fill:#fce8e6,stroke:#ea4335
    style EVAL fill:#e6f4ea,stroke:#34a853
```

**Ba mức độ, và không phải mức nào cũng gửi thông báo:**

| Mức         | Điều kiện mặc định                                 | Gửi thông báo                   |
| ----------- | -------------------------------------------------- | ------------------------------- |
| Theo dõi    | Không dùng 30–59 ngày                              | ❌ Chỉ hiện trên bảng điều khiển **của IT Admin** — không hiện trên màn hình của quản lý |
| Cần xem xét | Từ 60 ngày                                         | ✅ Gửi quản lý                   |
| Cần xử lý   | Từ 90 ngày, hoặc chưa từng dùng, hoặc đã nghỉ việc | ✅ Gửi quản lý và IT             |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                                                                                |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BR-19.1 | G1 nhắm vào **thuê bao**, không nhắm vào người — hành động là giảm số lượng tại kỳ gia hạn                                                              |
| BR-19.2 | G2 bỏ qua mọi ngưỡng ngày và không cần quản lý xác nhận                                                                                                 |
| BR-20.1 | Ngưỡng phân giải theo thứ tự: từng ứng dụng > tổ chức > mặc định hệ thống *(sửa ở v0.5 — bỏ cấp phòng ban, `QĐ-23`)*                                     |
| BR-20.2 | Số tiết kiệm thực hiện được ngay chỉ lớn hơn 0 khi gói theo tháng hoặc hợp đồng cho giảm giữa kỳ                                                        |
| BR-20.3 | Bằng chứng là **bản chụp tại thời điểm sinh**, không phải con trỏ tới nguồn — nếu nguồn bị import đè, khuyến nghị cũ sẽ hiển thị căn cứ của dữ liệu mới |
| BR-20.4 | Cổng lọc số 6 làm cả lần chạy dừng cho ứng dụng đó, **không** âm thầm chạy với dữ liệu cũ                                                               |
| BR-20.5 | Mức "theo dõi" **không gửi thông báo** — nếu mọi phát hiện đều gửi thư, quản lý sẽ lọc vào thùng rác trong tuần đầu. **Chốt ở `QĐ-09`, đã ghi vào `FR-4.12`:** mức này **chỉ IT Admin thấy**, không hiện trên màn hình của quản lý; quản lý chỉ nhận từ mức *cần xem xét* trở lên |
| BR-20.6 | `G1`, `G2` chỉ áp **cổng 1** (gói per-seat) và **cổng 8** (không trùng khuyến nghị mở); cổng 2–7 là cổng bằng chứng sử dụng/người dùng, chỉ áp `G3`, `G4` *(mới ở v0.8 — OI-12a (Owner 25/09/2026) — `OQ-US-22`; BRD `FR-4.9`)* |
| BR-20.7 | Cổng 5 chỉ dùng các ngày bao phủ **từ ngày bắt đầu Assignment**: đủ ngưỡng tầng tương ứng (`FR-4.12`) thì được kết luận, thiếu thì không kết luận và ghi lý do cổng 5 *(mới ở v0.8 — OI-12b (Owner 25/09/2026) — `OQ-US-23`)* |

> **Tám cổng lọc quan trọng ngang với chính thuật toán phát hiện.** Chứng minh hệ thống **không báo động giả** có giá trị hơn chứng minh nó tìm ra nhiều.

**Xong khi:** mỗi khuyến nghị kèm đủ căn cứ để người nhận phản biện được, và không có khuyến nghị nào sinh ra từ dữ liệu chưa đủ điều kiện.

---

### 4.4. F-21 · Quản lý xác nhận

| #   | Ai  | Làm gì                                | Hệ thống phản hồi                                                                                                                                                                                       |
| --- | --- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | HT  | Gửi hàng đợi xác nhận, gộp theo tuần  | Nhóm theo **nhân viên**, không nhóm theo ứng dụng                                                                                                                                                       |
| 2   | QL  | Xem từng dòng                         | Hiển thị đầy đủ: số ngày không hoạt động, tên nguồn, ngày import, độ dài cửa sổ bao phủ, phương pháp khớp danh tính, định nghĩa hoạt động của nguồn, mức tin cậy, và **hai** con số tiết kiệm tách biệt |
| 3   | QL  | Chọn Giữ lại / Thu hồi / Tạm miễn trừ | Bắt buộc nhập lý do                                                                                                                                                                                     |
| 4   | HT  | —                                     | Thu hồi thì chuyển việc cho IT; miễn trừ thì đặt lịch mở lại                                                                                                                                            |

**Ba lựa chọn và hệ quả:**

| Lựa chọn         | Nghĩa            | Hệ quả                                                     |
| ---------------- | ---------------- | ---------------------------------------------------------- |
| **Giữ lại**      | Vẫn cần suất này | Đóng khuyến nghị lần này, **nhưng chu kỳ sau vẫn hỏi lại** |
| **Thu hồi**      | Không cần nữa    | Chuyển cho IT thực hiện                                    |
| **Tạm miễn trừ** | Chưa quyết được  | **Bắt buộc có ngày hết hạn**, tối đa 12 tháng              |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                                        |
| ------- | --------------------------------------------------------------------------------------------------------------- |
| BR-21.1 | Quản lý **không** xem được nhật ký hoạt động thô — chỉ thấy số liệu tổng hợp                                    |
| BR-21.2 | Chọn hàng loạt phải nhập **một** lý do chung, không cho để trống                                                |
| BR-21.3 | Miễn trừ không có ngày hết hạn bị chặn ở cả ba tầng: giao diện, dịch vụ, cơ sở dữ liệu                          |
| BR-21.4 | Hiển thị phải nêu rõ giới hạn dữ liệu, ví dụ *"nguồn chỉ bao phủ 30 ngày — chưa đủ để kết luận chưa từng dùng"* |
| BR-21.5 | "Giữ lại" **không** đóng vĩnh viễn; chu kỳ sau vẫn hỏi nhưng hiển thị kèm quyết định lần trước                  |
| BR-21.6 | Khuyến nghị bị dữ liệu mới phủ định thì đóng **im lặng**, không thông báo                                       |

> **BR-21.4 quyết định phân hệ này sống hay chết.** Quản lý là người có bối cảnh mà hệ thống không có; họ chỉ hợp tác nếu tin rằng hệ thống đang nói thật về mức độ chắc chắn của nó. Một khuyến nghị sai được trình bày với giọng chắc nịch sẽ làm hỏng niềm tin vào cả trăm khuyến nghị đúng còn lại.
>
> **BR-21.5** — "giữ lại" là phát biểu có thời hạn: *tại thời điểm này tôi vẫn cần*. Nếu đóng vĩnh viễn, sau vài chu kỳ phần lớn suất lãng phí sẽ nằm trong vùng không bao giờ được hỏi lại.
>
> **BR-21.6** — gửi thông báo *"khuyến nghị hôm trước không còn đúng"* chỉ làm giảm niềm tin. Đóng im lặng, vẫn ghi nhật ký, và **số lượng khuyến nghị bị phủ định là một chỉ số chất lượng của rule engine**.

**Xong khi:** mọi khuyến nghị mức cần xem xét trở lên đều có một quyết định kèm lý do trong vòng một chu kỳ.

---

### 4.5. F-22 và F-23 · Thu hồi và mở lại khuyến nghị

| Luồng            | Nội dung                                                                    | Điểm cần chú ý                                                     |
| ---------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **F-22 Thu hồi** | IT nhận việc từ xác nhận của quản lý, thực hiện thu hồi theo F-10 hoặc F-11 | Ghi số tiết kiệm **đúng loại** — thực hiện ngay hay tại kỳ gia hạn |
| **F-23 Mở lại**  | Tới ngày hết hạn miễn trừ, hệ thống sinh khuyến nghị mới                    | Ghi chú "đã từng miễn trừ tới ngày X vì lý do Y"                   |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                     |
| ------- | -------------------------------------------------------------------------------------------- |
| `BR-22.1` | OI-02: Manager quyết cuối Keep/Reclaim/Exempt; IT trả lại tối đa một lần có lý do kỹ thuật/hợp đồng, sau đó thực thi nếu Reclaim. G2 không qua Manager; lỗi kỹ thuật không là quyền phủ quyết lần hai. |
| BR-22.2 | Số tiết kiệm ghi nhận vào báo cáo là số **thực tế thu được**, không phải số ước tính ban đầu |
| BR-23.1 | Thông báo trước 7 ngày khi miễn trừ sắp hết hạn, để quản lý chuẩn bị                         |

**Xong khi:** suất về trạng thái trống, khuyến nghị đóng ở trạng thái đã xử lý, và số tiết kiệm được ghi đúng loại.

---

## 5. VS-3 — Kiểm soát hợp đồng

*Thuộc `MF-4`. Xem mạch tổng ở mục 1.8.*

### 5.1. F-26 · Cảnh báo trước hạn chót báo hủy

|                   |                                       |
| ----------------- | ------------------------------------- |
| **Mục đích**      | Không bao giờ bị gia hạn ngoài ý muốn |
| **Kích hoạt bởi** | Tác vụ chạy hằng ngày                 |

```mermaid
flowchart LR
    T1["Hạn báo hủy<br/>trừ 15 ngày"] --> N1["Báo IT, Tài chính,<br/>người sở hữu nghiệp vụ,<br/>Người duyệt chi"]
    T2["Hạn báo hủy<br/>trừ 7 ngày"] --> N2["Báo thêm<br/>quản trị hệ thống"]
    N1 --> DEC{"Quyết định"}
    N2 --> DEC
    DEC -->|"Gia hạn nguyên trạng"| R1["Tạo chu kỳ mới"]
    DEC -->|"Gia hạn, giảm số lượng"| R2["💰 Ghi nhận tiết kiệm thật"]
    DEC -->|"Hủy dịch vụ"| R3["Gửi thông báo hủy trước hạn"]
    DEC -->|"Không ai xử lý"| R4["⚠️ Tự động gia hạn,<br/>ghi nhận là sự cố"]

    style R2 fill:#e6f4ea,stroke:#34a853
    style R4 fill:#fce8e6,stroke:#ea4335
```

**Ba tình huống về dữ liệu:**

| Tình huống                                     | Xử lý                                                  |
| ---------------------------------------------- | ------------------------------------------------------ |
| Có hạn chót báo hủy rõ ràng                    | Cảnh báo theo mốc đó                                   |
| Không có, nhưng hợp đồng ghi số ngày báo trước | Suy ra, và **ghi rõ là số liệu suy ra, chưa xác nhận** |
| Không có cả hai, mà hợp đồng tự gia hạn        | **Không suy đoán.** Hiện cảnh báo thiếu dữ liệu        |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                                           |
| ------- | ------------------------------------------------------------------------------------------------------------------ |
| BR-26.1 | Cảnh báo tính từ **hạn chót báo hủy**, không tính từ ngày gia hạn                                                  |
| BR-26.2 | Mỗi mốc cảnh báo hiển thị kèm **các khuyến nghị lãng phí đang mở của chính thuê bao đó**                           |
| BR-26.3 | Thuê bao tự gia hạn mà không có quyết định được ghi nhận trước hạn báo hủy được đếm vào chỉ số KPI-4 như một sự cố |
| BR-26.4 | Mốc T−15 gửi cảnh báo cho IT Admin, Finance, Business Owner **và Người duyệt chi**; mốc T−7 báo thêm Super Admin *(mới ở v0.8 — OI-09a (Owner 25/09/2026) — `BF-08`; BRD 4.4, `FR-1.4`)* |

> Cảnh báo trước ngày gia hạn 7 ngày trong khi hợp đồng buộc báo hủy trước 30 ngày là **một cảnh báo vô dụng được gửi đúng giờ** — nó tạo cảm giác an toàn giả.
>
> **BR-26.2 là nơi hai phân hệ gặp nhau** và tạo ra giá trị lớn nhất của toàn hệ thống: quản lý thấy *"gói này sắp gia hạn, và đang có 6 suất không ai dùng"* — thông tin đủ để ra quyết định giảm số lượng.

**Xong khi:** mọi thuê bao có tự động gia hạn đều có một quyết định được ghi nhận trước hạn báo hủy.

---

### 5.2. F-27 · Quyết định gia hạn

| #   | Ai       | Làm gì                                                    | Hệ thống phản hồi                                                         |
| --- | -------- | --------------------------------------------------------- | ------------------------------------------------------------------------- |
| 1   | IT và TC | Xem mốc gia hạn kèm khuyến nghị lãng phí đang mở          | Hiển thị so sánh số suất kỳ này với kỳ trước                              |
| 1b  | TC       | *(tùy chọn, khi Người duyệt chi hỏi)* **Trả lời yêu cầu thông tin ngân sách** *(sửa ở v0.7)* | Không chặn, SLA của Người duyệt chi không dừng                   |
| 2   | **DC** *(sửa ở v0.5 — tới v0.4 là TC)* | Quyết định: gia hạn nguyên trạng, giảm số lượng, hoặc hủy | Hiển thị cạnh nút quyết: **snapshot ngân sách**, khuyến nghị đang mở, tiết kiệm tại kỳ gia hạn *(sửa ở v0.7)* |
| 3   | HT       | —                                                         | Gia hạn thì **tạo bản ghi thuê bao mới**, bản ghi cũ chuyển sang hết hạn  |
| 4   | HT       | —                                                         | Chuyển các quyền đang hiệu lực sang thuê bao mới trong cùng một giao dịch |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                  |
| ------- | ----------------------------------------------------------------------------------------- |
| BR-27.1 | Gia hạn **không sửa đè** ngày trên bản ghi cũ — sửa đè sẽ xóa mất lịch sử giá và số lượng |
| BR-27.2 | Số tiết kiệm thật chỉ được ghi nhận khi số suất kỳ mới **thấp hơn** kỳ cũ                 |
| BR-27.3 | Hủy dịch vụ phải kiểm tra còn quyền nào đang hiệu lực không, và cảnh báo người đang dùng  |
| BR-27.4 | *(mới ở v0.5 — `QĐ-22`; sửa ở v0.7 — `QĐ-29b`)* Quyết định gia hạn, giảm, hủy thuộc **Người duyệt chi**, trên snapshot ngân sách; hỏi Tài chính là tùy chọn, Tài chính ghi nhận **sau** quyết định. Cùng một nguyên tắc với luồng mua mới — BRD `FR-3.13`, `FR-3.14` |
| BR-27.5 | Quyết định **giảm** xuống dưới số Assignment đang hiệu lực: hệ thống liệt kê phần vượt (ưu tiên khuyến nghị lãng phí đang mở), IT thu hồi **trước** ngày bắt đầu kỳ mới; kỳ mới chỉ được ghi khi số Assignment ≤ số đã mua (`INV-01`) *(mới ở v0.8 — OI-11c (Owner 25/09/2026) — `OQ-US-25`)* |

**Xong khi:** có bản ghi thuê bao kỳ mới với số suất phản ánh đúng quyết định, và so sánh được với kỳ trước.

---

### 5.3. F-28 · Đối soát với nhà cung cấp

| Loại lệch                                | Nghĩa                                           | Mức nghiêm trọng | Xử lý                                  |
| ---------------------------------------- | ----------------------------------------------- | ---------------- | -------------------------------------- |
| Hệ thống có, nhà cung cấp không có       | Người dùng không truy cập được dù đã được duyệt | Trung bình       | IT cấp lại hoặc xác nhận không cần     |
| **Nhà cung cấp có, hệ thống không biết** | **Có người được cấp quyền ngoài quy trình**     | **Cao**          | IT điều tra, hợp thức hóa hoặc thu hồi |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                        |
| ------- | ----------------------------------------------------------------------------------------------- |
| BR-28.1 | Chỉ đối soát ứng dụng có kết nối tự động; ứng dụng không có kết nối **không sinh sai lệch giả** |
| BR-28.2 | Hệ thống **không tự sửa** để hai bên khớp nhau — xem F-43                                       |
| BR-28.3 | Sai lệch loại "có ở nhà cung cấp nhưng hệ thống không biết" gửi thông báo mức rất cao           |

**Xong khi:** mọi sai lệch đều có một quyết định của người thật, không có sai lệch nào tự đóng.

---

## 6. VS-4 — Minh bạch chi tiêu

*Thuộc `MF-5`. Xem mạch tổng ở mục 1.9.*

### 6.1. F-29 · Bảng chi tiêu, tiết kiệm và phân bổ

|                   |                                                            |
| ----------------- | ---------------------------------------------------------- |
| **Mục đích**      | Tài chính và Người duyệt chi trả lời được "khoản này của ai, phục vụ việc gì, và hệ thống đã tiết kiệm được bao nhiêu" *(mở rộng ở v0.5 — `QĐ-24`)* |
| **Kích hoạt bởi** | Người dùng mở bảng điều khiển                              |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                                                                |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| BR-29.1 | Mọi số tiền hiển thị theo đồng tiền báo cáo; di chuột thì hiện nguyên tệ và tỷ giá đã dùng                                              |
| BR-29.2 | Bảng luôn hiển thị **cơ sở ghi nhận đang xem** — theo kỳ hay theo dòng tiền — không để người dùng đọc một con số mà không biết nó là gì |
| BR-29.3 | Chi phí của gói theo đầu người quy về **cost center** của nhân viên **tại thời điểm phát sinh**, không phải cost center hiện tại *(sửa chữ ở v0.5)* |
| BR-29.4 | Chi phí của gói cố định và gói dùng chung chia theo tỷ lệ khai ở cấp thuê bao                                                           |
| BR-29.5 | Hiển thị **thời điểm dữ liệu cập nhật gần nhất**; chỉ gọi là thời gian thực khi nguồn thực sự hỗ trợ                                    |
| BR-29.6 | *(mới ở v0.5 — `QĐ-23`, `QĐ-24`)* Thêm các chiều nhóm **theo ứng dụng, nhà cung cấp, và cây người phụ trách** — tổng chi của mọi người dưới quyền một người, theo quan hệ quản lý có hiệu lực tại thời điểm phát sinh. **Không** có chiều nhóm theo phòng ban |
| BR-29.7 | *(mới ở v0.5)* Tách ba con số **ngân sách — thực chi — khoản cam kết đang giữ**. Bảng **tiết kiệm** luôn đặt cạnh tổng chi, với *tiết kiệm thực hiện ngay* và *tiết kiệm tại kỳ gia hạn* **tách riêng, không cộng** — BRD `FR-5.8`, `FR-5.9` |
| BR-29.8 | Manager thấy **thực chi và cam kết đang giữ** quy về người trong cây cấp dưới (theo hiệu lực thời gian), nhóm theo ứng dụng/nhà cung cấp; **không** thấy ngân sách, số còn lại, tổng công ty hay cây khác *(mới ở v0.8 — OI-08b (Owner 25/09/2026) — `OQ-US-26`; BRD 5.5.3, `SoD-2`)* |
| BR-29.9 | Danh mục Cost Center (`Unit`/`Project`/`Company`) do **Finance** tạo, sửa và ngừng dùng; IT Admin không tạo mã; không tạo Cost Center *Chưa phân loại* *(mới ở v0.8 — OI-04 (Owner 25/09/2026) — `OQ-US-05`; BRD `FR-3.1`, `FR-9.7`)* |

> Cột **chi phí trên mỗi suất đang hoạt động** — chứ không phải trên mỗi suất đã mua — là con số tài chính quan tâm nhất mà hầu như không hệ thống nào hiển thị. Nó cho thấy ngay ứng dụng nào đang trả tiền cho không khí.

**Xong khi:** mọi con số trên bảng đều bấm được để xem căn cứ tính.

---

### 6.2. F-30 · Dự báo chi phí ba lớp

| Lớp    | Nội dung                            | Cơ chế                                    |
| ------ | ----------------------------------- | ----------------------------------------- |
| **L1** | Chi phí đã cam kết                  | Công thức xác định từ hợp đồng            |
| **L2** | Chi phí biến động theo mức tiêu thụ | Mô hình xu hướng **có cổng kiểm chứng** — ⏸️ **hoãn, không hiện thực trong MVP** *(v0.5 — `QĐ-25`)*; giao diện ghi rõ *"dự báo theo mô hình chưa được hiện thực"* |
| **L3** | Chi phí phụ thuộc quyết định        | Ba kịch bản theo giả định người dùng nhập |

**Cổng kiểm chứng cho L2:**

| Điều kiện                                        | Không đạt thì sao                                                    |
| ------------------------------------------------ | -------------------------------------------------------------------- |
| Có tối thiểu 12 tháng dữ liệu                    | Hiện *"chưa đủ dữ liệu lịch sử để dự báo có kiểm chứng"*             |
| Sai số kiểm chứng lùi trong ngưỡng, mặc định 20% | **Ẩn dự báo mô hình**, chỉ hiển thị khoảng kịch bản, nêu rõ lý do ẩn |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                                                                    |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| BR-30.1 | Không dùng mô hình thống kê cho lớp L1 — dùng sẽ cho kết quả **kém chính xác hơn** đọc thẳng hợp đồng                                       |
| BR-30.2 | **Không** hiển thị con số dự báo trần trụi trong bất kỳ trường hợp nào; luôn kèm khoảng dữ liệu, giả định, sai số đo được và thời điểm tính |
| BR-30.3 | Sai số đo được hiển thị cạnh dự báo, không chỉ dùng ngầm để bật tắt                                                                         |

**Xong khi:** dự báo hoặc hiển thị kèm đủ bốn thông tin bắt buộc, hoặc không hiển thị kèm lý do rõ ràng. *(v0.5)* Trong MVP: L1 và L3 hiển thị đủ; L2 hiển thị lý do chưa hiện thực.

---

### 6.3. F-31 và F-32 · Phát hiện phần mềm ngoài danh mục

> *(29/09/2026 tối — `QĐ-33`, ghi chú, **sơ đồ chưa vẽ lại**)* Luồng này là **tính năng bổ sung *Đối soát chi phí phần mềm***; mã `F-31`, `F-34`, `UF-12` giữ nguyên. Nghiệp vụ mới: **từng khoản chi** được đối soát với căn cứ phê duyệt — ngoại lệ do Finance/IT xử lý, chỉ Người duyệt chi chấp nhận khoản chi không có căn cứ (hình canonical `WF-17` nhánh `rx1`/`rd1`, `US-13-07`). ~~Màn hình và nhánh này chưa có trong sơ đồ `UF-12` và HTML/PDF v0.10 — `HANDOFF`~~ → **đã vẽ ở v0.11 (30/09/2026)**: màn `FIN-07` *(mã dự kiến)* và bước quyết `APV-01` → `APV-02` — xem mục 11.15.
>
> *(v0.10 — 29/09/2026)* **`F-32` (export IdP) là giai đoạn sau** (`QĐ-31a`) — sơ đồ dưới chỉ vẽ `F-31` (CSV sao kê/hóa đơn). Quyết định hợp thức hóa thuộc **Người duyệt chi** (`DQ-06`, `FR-3.4c-1`); IT Admin điều tra và thực thi. Gợi ý AI chỉ là gợi ý tin cậy Thấp ở hàng đợi review (`QĐ-32a`).

```mermaid
sequenceDiagram
    participant TC as Tài chính
    participant HT as Hệ thống
    participant IT as IT Admin
    participant QL as Quản lý
    participant DC as Người duyệt chi

    TC->>HT: Import CSV sao kê hoặc hóa đơn (xem trước rồi xác nhận)
    HT->>HT: Chuẩn hóa mô tả; đối soát khoản chi đã có (trùng thì liên kết)
    HT->>IT: Hàng đợi review cho ca mơ hồ/không khớp (một lý do chính; gợi ý AI tin cậy Thấp nếu đã qua cổng)
    IT->>HT: Xác nhận nhà cung cấp hoặc đánh dấu không phải phần mềm
    HT->>HT: Đối chiếu với danh mục đã duyệt
    HT->>IT: Tạo bản ghi "cần xem xét" cho mục ngoài danh mục
    IT->>QL: Hỏi bối cảnh nghiệp vụ nếu liên quan nhân viên trực thuộc
    QL->>IT: Giải thích những người này đang dùng để làm gì
    IT->>DC: Gửi hồ sơ để quyết định
    DC->>HT: Báo nhầm / Không duyệt / Duyệt hợp thức hóa (hai kết cục đầu có lý do bắt buộc)
```

**Mức độ tin cậy tính từ phương pháp khớp, không lấy con số do mô hình tự khai:**

| Phương pháp                | Tin cậy    | Xử lý                       |
| -------------------------- | ---------- | --------------------------- |
| Khớp chính xác từ điển     | Cao        | Tự động chuẩn hóa           |
| Khớp theo mẫu              | Khá        | Tự động, có thể xem lại     |
| Khớp mờ                    | Trung bình | Đưa vào hàng đợi xem lại    |
| Gợi ý bởi mô hình ngôn ngữ | Thấp       | **Bắt buộc** người xác nhận |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                                                     |
| ------- | ---------------------------------------------------------------------------------------------------------------------------- |
| BR-31.1 | Bản ghi phát hiện **không phải** kết luận vi phạm — là "có dấu hiệu một phần mềm chưa nằm trong danh mục", chờ người xem xét |
| BR-31.2 | Mỗi nhà cung cấp chỉ có một bản ghi đang mở; xuất hiện lại thì cập nhật lần thấy gần nhất và số lần, không tạo bản ghi mới   |
| BR-31.3 | Bản ghi đã đóng ở trạng thái báo nhầm mà xuất hiện lại thì được mở lại                                                       |
| BR-31.4 | Lưu **cả giá trị thô lẫn giá trị đã chuẩn hóa** kèm phương pháp khớp, để giải trình được                                     |
| BR-31.5 | Phân tầng rủi ro theo mức nhạy cảm dữ liệu, số nhân viên liên quan, và ứng dụng có hỗ trợ đăng nhập tập trung không          |
| BR-31.6 | Bản ghi đã đóng *duyệt hợp thức hóa* không mở lại (ứng dụng đã vào danh mục). Bản ghi đã đóng *không duyệt* mà bằng chứng xuất hiện lại thì **mở lại chính bản ghi đó** với cờ *tái xuất hiện sau khi không duyệt* và nâng mức rủi ro *(mới ở v0.8 — OI-14f (Owner 25/09/2026) — `OQ-US-29`; BRD `FR-6.7`, `INV-13`)* |

**Xong khi:** mỗi bản ghi có người chịu trách nhiệm và một quyết định cuối, không có bản ghi nào tự đóng.

---

### 6.4. F-34 · Hợp thức hóa ứng dụng vào danh mục

| #   | Ai  | Làm gì                                                                              | Hệ thống phản hồi                                                 |
| --- | --- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 1   | Người duyệt chi | Quyết định hợp thức hóa *(v0.10 — sửa theo `DQ-06`; trước ghi IT)*                  | Chuyển sang luồng F-06 để IT khai báo đầy đủ; cấp quyền không duyệt chi lần hai |
| 2   | IT  | Chỉ định người sở hữu nghiệp vụ, mức nhạy cảm dữ liệu, trả lời ba câu hỏi phân loại |                                                                   |
| 3   | HT  | —                                                                                   | Tạo yêu cầu mua chính thức để hợp thức hóa chi phí đang phát sinh |
| 4   | HT  | —                                                                                   | Đóng bản ghi phát hiện ở trạng thái đã duyệt                      |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                                                           |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| BR-34.1 | "Đã duyệt" là **kết cục bình thường và tích cực**, không phải ngoại lệ. Shadow IT thường là tín hiệu bộ công cụ đã duyệt còn thiếu |
| BR-34.2 | Người đang dùng ứng dụng đó được ghi nhận thành quyền chính thức, không bắt xin lại từ đầu                                         |
| BR-34.3 | Quyết định *không duyệt* và *báo nhầm* **bắt buộc có lý do**; *duyệt hợp thức hóa* không bắt buộc *(mới ở v0.8 — OI-14g (Owner 25/09/2026) — `OQ-US-30`)* |

**Xong khi:** ứng dụng có mặt trong danh mục với đầy đủ thông tin, và những người đang dùng có quyền chính thức.

---

### 6.5. F-35 · Đối soát hóa đơn

| #   | Ai  | Làm gì         | Hệ thống phản hồi                                                                 |
| --- | --- | -------------- | --------------------------------------------------------------------------------- |
| 1   | TC  | Import hóa đơn | Ghép dòng hóa đơn về thuê bao tương ứng                                           |
| 2   | HT  | —              | So sánh số suất trên hóa đơn với số suất khai trong thuê bao và số suất đang dùng |
| 3   | TC  | Xem chênh lệch | Hiển thị ba con số cạnh nhau, không tự sửa cái nào                                |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                                                        |
| ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| BR-35.1 | Hệ thống **không tự sửa** thuê bao theo hóa đơn — xem F-43                                                                      |
| BR-35.2 | Chênh lệch phải quy được về một trong ba nguyên nhân: đã mua thêm chưa cập nhật, nhà cung cấp tính sai, hoặc dữ liệu nội bộ sai |

**Xong khi:** mọi dòng hóa đơn đều ghép được về một thuê bao, hoặc được đánh dấu là chi phí ngoài danh mục. *(v0.5)* Hóa đơn khớp một yêu cầu đã duyệt chi thì khoản cam kết tương ứng chuyển sang *Đã thành chi phí*.

---

### 6.6. F-36 · Lập và theo dõi ngân sách *(✅ từ v0.5 — tới v0.4 chỉ đặc tả)*

|                    |                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------- |
| **Mục đích**       | Có ngân sách để snapshot của bước duyệt chi và ghi nhận của Tài chính có số để so *(sửa ở v0.7)*, và để thấy tiền đã chi, đã hứa chi, còn lại |
| **Kích hoạt bởi**  | Tài chính nhập ngân sách cho kỳ mới; hoặc một khoản cam kết đổi trạng thái              |
| **Tiền điều kiện** | Đã có cost center (`F-01`)                                                             |

> **Vì sao chuyển từ 📐 sang ✅ — `QĐ-22`:** *(v0.7 — `QĐ-29b`: nay là **snapshot ngân sách** của bước duyệt chi và ghi nhận của Tài chính)* bước *ý kiến ngân sách* của `F-08`, `F-09`, `F-27` cần một con số *ngân sách còn lại*. Không có `F-36` thì bước đó chỉ còn là ý kiến cảm tính. Phạm vi hiện thực **tối thiểu**: nhập ngân sách, xem ba con số, theo dõi khoản cam kết — **không** gồm lập kế hoạch ngân sách nhiều phiên bản hay phê duyệt ngân sách.

**Các bước:**

| #   | Ai  | Làm gì                                                        | Hệ thống phản hồi                                                                  |
| --- | --- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 1   | TC  | Nhập ngân sách cho từng cost center theo kỳ, nhập tay hoặc import file | Dùng khung import có bước xem trước (`FR-7.1`)                               |
| 2   | HT  | —                                                             | Tính **ngân sách còn lại = ngân sách kỳ − thực chi − khoản cam kết đang giữ**      |
| 3   | HT  | —                                                             | Khi Người duyệt chi duyệt một yêu cầu có chi phí: tạo khoản cam kết *Đang giữ*    |
| 4   | HT  | —                                                             | Hóa đơn khớp (`F-35`) ⟹ *Đã thành chi phí*; yêu cầu bị hủy hoặc cấp phát thất bại hẳn ⟹ *Đã giải phóng* |
| 5   | TC  | Xem bảng ngân sách theo cost center và kỳ                     | Ba con số cạnh nhau; bấm vào khoản cam kết thì mở yêu cầu nguồn                    |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung |
| ------- | -------- |
| BR-36.1 | Mỗi khoản cam kết gắn **đúng một** yêu cầu đã được Người duyệt chi duyệt; một yêu cầu có **tối đa một** khoản cam kết — BRD `INV-16` |
| BR-36.2 | Khoản cam kết **không chuyển ngược** từ *Đã thành chi phí* |
| BR-36.3 | Vượt ngân sách **không chặn** việc duyệt chi — chỉ hiện cảnh báo và ý kiến của Tài chính (`BR-07.9`) |
| BR-36.4 | Mọi số tiền theo quy tắc đa tiền tệ của `BR-29.1` |
| BR-36.5 | Duyệt chi khi **chưa có ngân sách** vẫn tạo khoản cam kết, mang lý do *Chưa có ngân sách*; ngân sách của đúng Cost Center và kỳ được lập sau thì **tự gắn ngược** các khoản đó *(mới ở v0.8 — BRD `FR-5.8a`, `INV-18`, `QĐ-30b` — đồng bộ `BF-04`)* |
| BR-36.6 | Số còn lại được phép **âm** khi cam kết gắn ngược vượt hạn mức, kèm nhãn *đã cam kết vượt hạn mức*; không làm tròn về 0, không tạo ngân sách 0 giữ chỗ *(mới ở v0.8 — BRD `FR-5.8a`, `QĐ-30b` — đồng bộ `BF-04`)* |
| BR-36.7 | Hóa đơn khớp một phần: mỗi hóa đơn chuyển **đúng số tiền đó** thành chi phí, phần còn lại vẫn *Đang giữ*; hết số còn lại thì *Đã thành chi phí*; Finance được giải phóng phần dư kèm lý do khi không còn hóa đơn; không trừ hai lần *(mới ở v0.8 — OI-11a (Owner 25/09/2026) — `OQ-US-18`; BRD `FR-5.8`)* |
| BR-36.8 | Kỳ ngân sách là **một loại kỳ cho toàn tổ chức** (tháng/quý/năm) do Super Admin đặt một lần, mặc định **quý**; không đổi khi đã có ngân sách. Snapshot tính *tổng Request có chi phí đang chờ duyệt* trong **cùng Cost Center và kỳ** của Request *(mới ở v0.8 — OI-11b, OI-11d (Owner 25/09/2026) — `OQ-US-19`, `OQ-US-17`)* |

**Xong khi:** ngân sách còn lại luôn bằng ngân sách kỳ trừ thực chi trừ khoản cam kết đang giữ; không có khoản cam kết nào không gắn với một yêu cầu đã duyệt chi.

---

## 7. Luồng xuyên suốt

*`F-37`, `F-38`, `F-40`, `F-43`, `F-44` thuộc `MF-0` (mục 1.4) · `F-41` thuộc `MF-1` (mục 1.5) · `F-42` thuộc `MF-3` (mục 1.7).*

### 7.1. F-37 và F-38 · Quản trị hệ thống và nhật ký

| Luồng    | Nội dung                                                                                                                              |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **F-37** | Quản trị hệ thống quản lý tài khoản đăng nhập *(04/10/2026 — `QĐ-46`: tạo từ nhân viên có sẵn, gửi lời mời; người dùng tự đặt mật khẩu)*, gán vai trò, cấu hình ngưỡng, thời hạn xử lý, chính sách lưu giữ, ngưỡng sai số dự báo |
| **F-38** | Xem nhật ký kiểm toán và trạng thái các tác vụ nền                                                                                    |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                      |
| ------- | ----------------------------------------------------------------------------- |
| BR-37.1 | Quản trị hệ thống **không** gán suất và **không** phê duyệt yêu cầu nghiệp vụ |
| BR-37.2 | Sửa **chính sách duyệt** (nhánh, chuỗi loại bước) không ảnh hưởng các yêu cầu đang chạy. *(v0.6 — `QĐ-28d`)* Đổi **người giữ vai** — Người duyệt chi, người thay thế khi xung đột, người duyệt dự phòng ở gốc — thì bước đang chờ được xác định lại theo `BR-13.9`, SLA không đặt lại |
| BR-38.1 | Nhật ký kiểm toán chỉ ghi thêm, không sửa không xóa                           |
| BR-38.2 | Tác vụ nền thất bại phải hiện lên, không im lặng bỏ qua                       |
| BR-38.3 | Chỉ **Super Admin** tra cứu Audit Trail. Vai khác thấy lịch sử quyết định/trạng thái của đối tượng trong phạm vi của mình ngay trong chức năng tương ứng *(mới ở v0.8 — OI-08c (Owner 25/09/2026) — `OQ-US-04`; BRD `FR-8.3`)* |

**Xong khi:**
- **F-37** — mỗi vai trò chỉ làm được đúng những việc thuộc vai trò đó; **tám** nguyên tắc phân tách trách nhiệm đều có ít nhất một trường hợp bị hệ thống chặn *(sáu tới v0.4)*. *(v0.5)* Quản trị hệ thống cấu hình thêm **Người duyệt chi** và **nội dung thông báo theo dõi có đánh phiên bản**; cấu hình không phải phê duyệt.
- **F-38** — mọi thay đổi có hậu quả đều truy được về một dòng nhật ký, và mọi tác vụ nền thất bại đều hiển thị được, không có tác vụ nào hỏng trong im lặng.

---

### 7.2. F-40 · Nhân viên xem và xuất dữ liệu của chính mình

|                   |                                                           |
| ----------------- | --------------------------------------------------------- |
| **Mục đích**      | Đáp ứng quyền truy cập dữ liệu của chủ thể dữ liệu        |
| **Kích hoạt bởi** | Nhân viên mở trang cá nhân, hoặc gửi yêu cầu xuất dữ liệu |

| #   | Ai  | Làm gì                   | Hệ thống phản hồi                                                                               |
| --- | --- | ------------------------ | ----------------------------------------------------------------------------------------------- |
| 1   | NV  | Mở trang dữ liệu của tôi | Hiển thị: các suất được cấp, lịch sử yêu cầu, và dữ liệu sử dụng đã tổng hợp **của chính mình** |
| 2   | NV  | Bấm xuất dữ liệu         | Ghi nhận thời điểm tiếp nhận yêu cầu                                                            |
| 3   | HT  | —                        | Sinh file, thông báo khi xong, ghi nhận thời điểm hoàn tất                                      |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                                                       |
| ------- | ------------------------------------------------------------------------------------------------------------------------------ |
| BR-40.1 | Nhân viên chỉ xem được dữ liệu của chính mình, không xem được của đồng nghiệp                                                  |
| BR-40.2 | Hệ thống ghi nhận **thời điểm tiếp nhận và thời điểm hoàn tất** mỗi yêu cầu, phục vụ chứng minh đáp ứng đúng thời hạn quy định |
| BR-40.3 | Dữ liệu xuất ra ở định dạng đọc được, không phải kết xuất kỹ thuật thô                                                         |
| BR-40.4 | Yêu cầu **dừng thu thập** được xử lý trong **2 ngày làm việc** (mặc định, cấu hình được); quá hạn thì nhắc và cảnh báo nghẽn như `FR-3.8`. Căn cứ pháp lý của con số còn chờ kiểm chứng văn bản gốc *(mới ở v0.8 — OI-01a (Owner 25/09/2026); BRD 5.11)* |
| BR-40.5 | Yêu cầu dừng thu thập **hợp lệ** (thiết bị đã đăng ký của chính người gửi) **luôn được thực hiện**; IT chỉ đóng yêu cầu **không hợp lệ** (không phải thiết bị của mình, trùng, đã dừng) kèm lý do; nhân viên gửi lại được; không có luồng kháng nghị trong MVP *(mới ở v0.8 — OI-01b (Owner 25/09/2026))* |
| BR-40.6 | IT Admin được tự xử lý yêu cầu quyền dữ liệu của chính mình; Audit Trail gắn cờ *tự xử lý* *(mới ở v0.8 — OI-01c (Owner 25/09/2026))* |
| BR-40.7 | Nhân viên được **yêu cầu chỉnh sửa** dữ liệu cá nhân (ví dụ email, liên kết thiết bị sai); IT Admin xử lý. Không sửa dữ liệu usage gốc hay Audit Trail; dữ liệu nhân sự sai được sửa theo nguồn nhân sự *(mới ở v0.8 — OI-13 (Owner 25/09/2026) — `OQ-US-31`; BRD 5.11)* |
| BR-40.8 | Yêu cầu chỉnh sửa và **ngoại lệ xuất dữ liệu** được xử lý trong **10 ngày** (mặc định, cấu hình được); quá hạn thì nhắc và cảnh báo nghẽn. Căn cứ pháp lý còn chờ kiểm chứng *(mới ở v0.8 — OI-13b (Owner 25/09/2026); BRD 5.11)* |

**Xong khi:** nhân viên nhận được file chứa đầy đủ dữ liệu hệ thống đang lưu về mình, và thời gian xử lý được ghi nhận.

---

### 7.3. F-41 · Xóa dữ liệu hoạt động của người đã nghỉ

|                   |                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------- |
| **Mục đích**      | Đáp ứng nghĩa vụ xóa dữ liệu cá nhân của người lao động khi chấm dứt quan hệ lao động |
| **Kích hoạt bởi** | Tác vụ chạy hằng ngày                                                                 |

| #   | Ai  | Làm gì                                                      | Hệ thống phản hồi                                                  |
| --- | --- | ----------------------------------------------------------- | ------------------------------------------------------------------ |
| 1   | HT  | Quét nhân viên đã nghỉ quá 30 ngày kể từ ngày làm việc cuối | Lọc danh sách cần xóa                                              |
| 2   | HT  | —                                                           | Xóa bản ghi hoạt động chi tiết theo ngày                           |
| 3   | HT  | —                                                           | **Giữ lại** dữ liệu tổng hợp đã phi định danh và nhật ký kiểm toán |
| 4   | HT  | —                                                           | Ghi nhật ký: số bản ghi đã xóa, thời điểm thực hiện                |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                                                                |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| BR-41.1 | Xóa là **xóa thật**, không phải đánh dấu ẩn                                                                                             |
| BR-41.2 | Dữ liệu tổng hợp giữ lại phải **không truy ngược được** về cá nhân                                                                      |
| BR-41.3 | Nhật ký kiểm toán không bị xóa theo chính sách này — nó phục vụ nghĩa vụ pháp luật khác                                                 |
| BR-41.4 | Muốn giữ lâu hơn mốc 30 ngày thì phải có thỏa thuận trong hợp đồng lao động hoặc chính sách nội bộ đã thông báo, không chỉ đặt cấu hình |

**Xong khi:** sau 30 ngày kể từ ngày làm việc cuối, tìm kiếm dữ liệu hoạt động của người đó trả về rỗng, nhưng báo cáo chi phí lịch sử vẫn đúng.

---

### 7.4. F-42 · Thông báo khi bắt đầu theo dõi một ứng dụng

|                   |                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------- |
| **Mục đích**      | Đáp ứng điều kiện minh bạch khi áp dụng biện pháp công nghệ để quản lý người lao động |
| **Kích hoạt bởi** | IT lần đầu import dữ liệu sử dụng cho một ứng dụng                                    |

| #   | Ai  | Làm gì                          | Hệ thống phản hồi                                                                 |
| --- | --- | ------------------------------- | --------------------------------------------------------------------------------- |
| 1   | IT  | Import lần đầu cho một ứng dụng | Phát hiện đây là lần đầu, chặn trước bước ghi                                     |
| 2   | HT  | —                               | Yêu cầu xác nhận đã thông báo cho người lao động, hoặc gửi thông báo qua hệ thống |
| 3   | HT  | —                               | Gửi thông báo tới **mọi nhân viên đang giữ suất của ứng dụng đó**                 |
| 4   | HT  | —                               | Ghi nhật ký thời điểm thông báo, sau đó mới cho phép ghi dữ liệu                  |

**Nội dung thông báo tối thiểu:**

| Mục           | Nội dung                                                |
| ------------- | ------------------------------------------------------- |
| Ứng dụng nào  | Tên ứng dụng đang bắt đầu được theo dõi                 |
| Dữ liệu gì    | Ngày hoạt động và số lượt — **không** thu thập nội dung |
| Mục đích      | Phát hiện license không dùng để cắt giảm chi phí        |
| Lưu bao lâu   | Theo chính sách lưu giữ                                 |
| Xem lại ở đâu | Dẫn tới F-40                                            |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                                                          |
| ------- | --------------------------------------------------------------------------------------------------------------------------------- |
| BR-42.1 | Đây **không phải tính năng tùy chọn**. *(Sửa ở v0.5:)* Nó là **biện pháp thiết kế** hiện thực yêu cầu *"người lao động biết rõ biện pháp đó"* của **Điều 25 khoản 3 Luật 91/2025/QH15, đã đọc nguyên văn**. Tài liệu **không** khẳng định có nó thì việc thu thập đã hợp pháp — xem BRD mục 7.7.7 |
| BR-42.2 | Không cho ghi dữ liệu trước khi thông báo được ghi nhận                                                                           |
| BR-42.3 | Nhân viên được cấp suất **sau** thời điểm thông báo cũng nhận thông báo tại thời điểm được cấp                                    |
| BR-42.4 | *(mới ở v0.5 — `QĐ-20`)* Với **bộ thu thập trên thiết bị**, thông báo **đơn thuần là không đủ**: nhân viên phải **bấm xác nhận chủ động**, hệ thống lưu **phiên bản nội dung thông báo và thời điểm**. Chưa xác nhận thì **không nhận dữ liệu** từ thiết bị đó — BRD `FR-4.18`, `INV-17` |
| BR-42.5 | *(mới ở v0.5)* Nội dung thông báo đổi ⟹ **phiên bản mới** ⟹ nhân viên phải xác nhận lại trước khi thiết bị tiếp tục gửi dữ liệu |
| BR-42.6 | *(mới ở v0.5)* Nhân viên có **nút yêu cầu dừng thu thập**; yêu cầu đi theo quy trình quyền chủ thể dữ liệu (`F-40`, BRD `FR-10.5`) |
| BR-42.7 | Kênh thông báo MVP: **trong ứng dụng** cho mọi thông báo; **thư điện tử** (khi kênh email được cấu hình) chỉ thêm cho **cảnh báo trước hạn báo hủy** (`F-26`) và **thông báo trước khi theo dõi** (`F-42`). Lỗi gửi thư không được coi là đã thông báo *(mới ở v0.8 — OI-EMAIL, OI-09b (Owner 25/09/2026) — `OQ-US-07`, `TE-05`)* |

**Xong khi:** không có dữ liệu hoạt động nào được ghi cho một ứng dụng mà chưa có bản ghi thông báo tương ứng.

---

### 7.5. F-43 · Xử lý khi các nguồn dữ liệu mâu thuẫn

|                   |                                                                       |
| ----------------- | --------------------------------------------------------------------- |
| **Mục đích**      | Không để hệ thống tự xóa mất bằng chứng của một vấn đề nghiệp vụ thật |
| **Kích hoạt bởi** | Bất kỳ lúc nào hai nguồn nói khác nhau                                |

**Nguyên tắc phân định:**

> **Dữ liệu nội bộ đã qua quy trình phê duyệt là nguồn chân lý về *ý định*. Dữ liệu từ nhà cung cấp là nguồn chân lý về *thực tế*. Khi hai thứ lệch nhau, đó là một sự kiện nghiệp vụ cần người xử lý, không phải lỗi dữ liệu cần tự sửa.**

**Bảy tình huống:**

| Tình huống                                                   | Nguồn nào thắng                             | Hệ thống làm gì                                     |
| ------------------------------------------------------------ | ------------------------------------------- | --------------------------------------------------- |
| Nhân sự nói đã nghỉ, nhà cung cấp vẫn còn tài khoản          | Nhân sự thắng **về trạng thái nhân viên**   | Sinh lãng phí G2 mức cần xử lý ngay                 |
| Nhà cung cấp có tài khoản, hệ thống không có quyền tương ứng | **Không nguồn nào thắng**                   | Sinh sai lệch; **không** tự tạo quyền               |
| Hệ thống có quyền, nhà cung cấp không có tài khoản           | **Không nguồn nào thắng**                   | Sinh sai lệch                                       |
| Số suất trên hóa đơn khác số suất khai trong thuê bao        | **Không nguồn nào thắng**                   | Đưa vào màn hình đối soát; **không** tự sửa         |
| File nhân sự mới thiếu một người đang giữ suất               | **Không nguồn nào thắng**                   | Không tự đánh dấu đã nghỉ, không tự xóa             |
| Hai file nhật ký cùng ứng dụng, cửa sổ chồng lấn             | Nguồn có cửa sổ **kết thúc muộn hơn** thắng | Hợp nhất theo khóa; ghi nguồn đã dùng cho từng dòng |
| Một định danh khớp về hai nhân viên                          | **Không nguồn nào thắng**                   | Đẩy vào hàng đợi chưa khớp, không dùng để kết luận  |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                              |
| ------- | --------------------------------------------------------------------- |
| BR-43.1 | Hệ thống giữ nguyên **cả hai giá trị** khi có mâu thuẫn, không ghi đè |
| BR-43.2 | Mỗi bản ghi mâu thuẫn phải có người chịu trách nhiệm xử lý            |
| BR-43.3 | Mâu thuẫn không được tự đóng theo thời gian                           |

> **Vì sao không cho tự ghi đè:** ba trong bảy tình huống trên là **dấu hiệu của một vấn đề nghiệp vụ thật** — có người được cấp quyền ngoài quy trình, có người nghỉ việc mà chưa thu hồi, hoặc hóa đơn tính sai. Nếu hệ thống tự đồng bộ cho khớp, nó xóa mất chính bằng chứng mà nó sinh ra để tìm.

**Xong khi:** mọi mâu thuẫn đều có một quyết định của người thật được ghi nhận.


### 7.6. F-44 · Xóa dữ liệu quá hạn lưu giữ theo chính sách

> **Phân biệt với `F-41` — hai luồng, hai trigger, không thay nhau được:**
>
> | | `F-41` | `F-44` |
> | --- | --- | --- |
> | **Nguồn** | `FR-10.6` | **`FR-10.3`** |
> | **Kích hoạt** | Nhân viên chuyển sang *đã nghỉ việc* | **Tác vụ chạy hằng ngày**, không gắn sự kiện nhân sự |
> | **Đối tượng** | Người **đã nghỉ** | **Mọi** chủ thể dữ liệu, gồm người **đang làm việc** |
> | **Mốc** | 30 ngày sau ngày làm việc cuối | **6 tháng** *(hoạt động chi tiết)* · **24 tháng** *(tổng hợp, bằng chứng discovery)* |
> | **Thuộc** | `MF-1` · `WF-07` | `MF-0` · không phải workflow *(Business Workflows mục 2.3)* |
>
> Hai mốc của **cùng một bản ghi hoạt động chi tiết** chạy song song; **cái nào đến trước thì cái đó xóa** (BRD mục 7.5). Với người đã nghỉ, mốc 30 ngày gần như luôn đến trước — nhưng `F-44` vẫn phải phủ, vì người **chưa** nghỉ không có mốc nào khác.

|                    |                                                                                        |
| ------------------ | -------------------------------------------------------------------------------------- |
| **Mục đích**       | Không giữ dữ liệu lâu hơn chính sách đã công bố, và chứng minh được điều đó            |
| **Kích hoạt bởi**  | Tác vụ chạy hằng ngày                                                                  |
| **Tiền điều kiện** | Quản trị hệ thống đã cấu hình chính sách lưu giữ (`F-37`); mọi bản ghi có mốc thời gian |

**Năm lớp dữ liệu trong phạm vi chính sách và cách xử lý — theo BRD mục 7.5, không diễn giải thêm:**

| Lớp dữ liệu                                                | Thời hạn                                                   | Hành động          |
| ---------------------------------------------------------- | ---------------------------------------------------------- | ------------------ |
| Bản ghi hoạt động chi tiết theo ngày — **mọi ứng dụng**    | **6 tháng**, hoặc 30 ngày sau ngày làm việc cuối *(`F-41`)* | Xóa thật           |
| Bản ghi hoạt động của **nhóm dịch vụ liên lạc**            | Như trên; chỉ phát sinh khi doanh nghiệp **chủ động bật** thu thập | Xóa thật   |
| Dữ liệu tổng hợp **đã phi định danh** theo ứng dụng, đơn vị | **24 tháng**                                               | Xóa thật           |
| Bằng chứng discovery từ sao kê, hóa đơn                    | **24 tháng**                                               | Xóa thật           |
| **Nhật ký kiểm toán**                                      | Theo pháp luật kế toán, kiểm toán và nội quy doanh nghiệp  | ⛔ **KHÔNG xóa**   |

> ⚠️ **Hai thứ khác nhau, đừng gộp — sửa 09/09/2026 sau kiểm chéo (`UF-RET-01`):**
>
> | | Là gì | `F-44` làm gì | Nguồn |
> | --- | --- | --- | --- |
> | **Bằng chứng discovery từ sao kê, hóa đơn** | Dữ liệu import của phân hệ phát hiện ngoài danh mục *(BRD mục 5.6, `FR-6.3`)* | **Xóa thật ở mốc 24 tháng.** Đây **không** phải ngoại lệ, kể cả khi bản ghi là một dòng hóa đơn | BRD mục 7.5, hàng cuối bảng lưu giữ |
> | **Hồ sơ tài chính của phân hệ hợp đồng và chi tiêu** — hợp đồng, tệp hóa đơn/thanh toán đính kèm, thuê bao, bản ghi chi phí | Dữ liệu doanh nghiệp của phân hệ 5.1 và 5.5 *(BRD mục 7.7.2)* | **Không quét tới** — chúng **không nằm trong** bảng lưu giữ BRD mục 7.5, nên không có mốc để xóa. Đây là *ngoài phạm vi chính sách*, **không** phải *được miễn xóa* | BRD mục 7.5 *(không liệt kê)* và mục 7.7.2 |
>
> **Ngoại lệ được ghi trong chính sách chỉ có một: nhật ký kiểm toán** — BRD mục 7.5 ghi *"chỉ ghi thêm; **không** xóa theo chính sách này"*. Muốn đặt mốc lưu giữ cho nhóm hồ sơ tài chính thì phải có **chính sách riêng, nêu tên loại hồ sơ, phạm vi và nguồn** — `F-44` không tự đặt. Đây là đồng bộ đặc tả thiết kế, **không** phải kết luận pháp lý.

**Các bước:**

| #   | Ai  | Làm gì                                          | Hệ thống phản hồi                                                              |
| --- | --- | ----------------------------------------------- | ------------------------------------------------------------------------------ |
| 1   | HT  | Quét từng lớp dữ liệu theo mốc riêng của lớp đó | Lập danh sách bản ghi quá hạn, tách theo lớp                                   |
| 2   | HT  | —                                               | Xóa thật các bản ghi quá hạn                                                   |
| 3   | HT  | —                                               | **Giữ nguyên nhật ký kiểm toán** — ngoại lệ duy nhất của chính sách. Không chạm hồ sơ tài chính phân hệ 5.1/5.5 vì chúng nằm **ngoài** bảng lưu giữ |
| 4   | HT  | —                                               | Ghi nhật ký: **số bản ghi đã xóa** theo từng lớp, thời điểm thực hiện          |
| 5   | QT  | Xem trạng thái tác vụ nền                       | Hiện lần chạy gần nhất, kết quả, số bản ghi xử lý và lỗi — dùng chung `F-38`   |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung                                                                                                                                                   |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BR-44.1 | Mốc **6 tháng** áp cho **mọi** nhân viên, không chỉ người đã nghỉ. Người đang làm việc vẫn được xóa dữ liệu hoạt động cũ hơn mốc                          |
| BR-44.2 | Xóa là **xóa thật**, không đánh dấu ẩn và không "phi định danh" bằng cách chỉ đổi tên hiển thị                                                             |
| BR-44.3 | **Ngoại lệ duy nhất của chính sách này là nhật ký kiểm toán** — chỉ ghi thêm, không xóa (BRD mục 7.5). **Bằng chứng discovery từ sao kê và hóa đơn KHÔNG phải ngoại lệ**: vẫn xóa thật ở mốc 24 tháng. Hồ sơ tài chính của phân hệ 5.1/5.5 nằm ngoài bảng lưu giữ nên tác vụ này không quét tới; đặt mốc cho chúng cần một chính sách riêng có tên và nguồn |
| BR-44.4 | Mỗi lần chạy ghi **số bản ghi đã xóa theo từng lớp** và thời điểm — đây là bằng chứng đáp ứng `FR-10.3`, không phải log kỹ thuật                           |
| BR-44.5 | Muốn giữ lâu hơn mốc đã công bố thì phải có **thỏa thuận** trong hợp đồng lao động hoặc chính sách nội bộ đã thông báo, không chỉ đổi cấu hình (`BR-41.4`) |

**Ngoại lệ:**

| Tình huống                                                     | Xử lý                                                                                     |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Bản ghi vừa quá hạn 6 tháng nhưng người đó cũng vừa nghỉ việc | Không xóa hai lần; lớp dữ liệu chỉ có một trạng thái, mốc nào đến trước thì lần chạy đó xử lý |
| Tác vụ chạy thất bại                                           | Nổi lên bảng trạng thái tác vụ nền, **không im lặng bỏ qua** (`BR-38.2`)                  |
| Doanh nghiệp chưa bật thu thập cho nhóm dịch vụ liên lạc       | Không có dữ liệu loại đó để xóa; không coi là lỗi                                         |

**Xong khi:** không còn bản ghi nào cũ hơn mốc lưu giữ của lớp mình — **kể cả bằng chứng discovery từ sao kê, hóa đơn quá 24 tháng**; **nhật ký kiểm toán vẫn nguyên vẹn**; hồ sơ tài chính của phân hệ 5.1/5.5 không bị tác vụ này đụng tới vì nằm ngoài bảng lưu giữ; và mỗi lần chạy đều có con số bản ghi đã xóa theo từng lớp để trình bày.

---

### 7.7. F-45 · Triển khai và vận hành tiện ích trình duyệt trên thiết bị công ty *(mới ở v0.5 — `QĐ-20`)*

|                    |                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| **Mục đích**       | Biết nhân viên **có thật sự mở** một SaaS **đã biết** — trong danh mục **hoặc** trong từ điển nhà cung cấp — mà máy chủ không bao giờ nhận dữ liệu vượt mục đích *(sửa ở v0.8 theo Định nghĩa Phạm vi v1.7 mục 1.5; đóng `BF-05`)* |
| **Kích hoạt bởi**  | IT đăng ký một thiết bị công ty cho một nhân viên; sau đó tiện ích gửi bản tổng hợp mỗi ngày      |
| **Tiền điều kiện** | Doanh nghiệp quản lý được trình duyệt trên máy công ty cấp (BRD `GĐ-9`); đã có danh mục và từ điển nhà cung cấp; nội dung thông báo theo dõi đã được cấu hình (`F-37`) |
| **Cách cài trong demo** *(v0.6 — `QĐ-28b`)* | Tiện ích nạp bằng **Developer mode → Load unpacked** trên máy thành viên nhóm. **Cài bắt buộc** qua chính sách trình duyệt được quản lý là **thiết kế triển khai** tại doanh nghiệp — **chưa** triển khai hay kiểm chứng live (BRD `OQ-18`) |

**Các bước:**

| #   | Ai  | Làm gì                                                                 | Hệ thống phản hồi                                                                                     |
| --- | --- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 1   | IT  | Đăng ký thiết bị công ty ↔ nhân viên, có ngày hiệu lực                  | Ghi đăng ký; **chưa** nhận dữ liệu từ thiết bị                                                         |
| 2   | HT  | —                                                                      | Sinh **danh sách cho phép**: tên miền của SaaS trong danh mục và từ điển, **trừ mọi ứng dụng mang cờ liên lạc** |
| 3   | HT  | —                                                                      | Gửi thông báo theo dõi cho nhân viên theo `F-42`                                                        |
| 4   | NV  | Đọc thông báo và **bấm xác nhận**                                       | Lưu phiên bản nội dung và thời điểm; mở cổng nhận dữ liệu cho thiết bị                                 |
| 5   | HT  | *(tiện ích trên máy)* Đo thời gian tab thuộc danh sách đang ở phía trước khi trình duyệt không rảnh | **Bỏ ngay trên máy** mọi tên miền ngoài danh sách, URL đầy đủ, tiêu đề, nội dung                    |
| 6   | HT  | *(tiện ích trên máy)* Gửi bản tổng hợp theo ngày: thiết bị, tên miền, ngày, số phút làm tròn | Cổng nhận kiểm tra: thiết bị đã đăng ký, nhân viên đã xác nhận, không có trường ngoài lược đồ — sai thì **từ chối** |
| 7   | HT  | —                                                                      | Đưa vào nguồn usage theo `F-17` (khớp danh tính, cửa sổ bao phủ, định nghĩa hoạt động)                 |
| 8   | IT  | Xem trạng thái bộ thu thập                                             | Số thiết bị đã đăng ký, đã xác nhận, lần gửi gần nhất, số bản ghi bị từ chối và lý do                  |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung |
| ------- | -------- |
| BR-45.1 | **Chưa xác nhận thì không có dữ liệu.** Không có đường nào để dữ liệu từ thiết bị vào hệ thống trước bước 4 — BRD `INV-17` |
| BR-45.2 | **Lọc tại nguồn là bắt buộc**, lọc ở máy chủ chỉ là lớp phòng thủ thứ hai — BRD `ADR-13` |
| BR-45.3 | **Không bao giờ** thu: URL đầy đủ, tiêu đề trang, nội dung, phím bấm, ảnh màn hình, vị trí, tên miền ngoài danh sách |
| BR-45.4 | Ứng dụng mang cờ liên lạc **không bao giờ** nằm trong danh sách cho phép — `ADR-10` giữ nguyên |
| BR-45.5 | Định nghĩa hoạt động khai báo theo `FR-4.16`: đang ở phía trước **và** không rảnh, cộng dồn **≥ N phút/ngày** — mặc định **N = 5**, Super Admin cấu hình *(làm rõ ở v0.8 — OI-14b, Owner 25/09/2026)* |
| BR-45.6 | Chỉ dùng cho tối ưu license. **Không** có màn hình xếp hạng thời gian dùng theo người; Manager chỉ thấy *có / không hoạt động* — BRD `SoD-2`, `ĐK-09` |
| BR-45.7 | Nhân viên nghỉ việc ⟹ đăng ký thiết bị hết hiệu lực; dữ liệu xóa theo `F-41`, `F-44` |
| BR-45.8 | Một nhân viên có thể có **nhiều** thiết bị đăng ký, mỗi thiết bị xác nhận riêng; thiết bị **dùng chung** nhiều người **không** đăng ký thu thập trong MVP (ghi là điểm mù) *(mới ở v0.8 — OI-14d (Owner 25/09/2026) — `OQ-US-21`)* |

**Ngoại lệ:**

| Tình huống                                   | Xử lý                                                                          |
| -------------------------------------------- | ------------------------------------------------------------------------------ |
| Nhân viên không xác nhận                     | Không nhận dữ liệu; ứng dụng của người đó chỉ còn G1/G2 từ nguồn nhà cung cấp; hiện trên trạng thái bộ thu thập |
| Nhân viên yêu cầu dừng thu thập              | Đi theo `F-40`; khi xử lý xong thì thiết bị ngừng được nhận dữ liệu            |
| Nội dung thông báo đổi                       | Phiên bản mới; nhân viên phải xác nhận lại (`BR-42.5`)                        |
| Thiết bị không gửi dữ liệu nhiều ngày        | Không suy ra *không hoạt động*; cửa sổ bao phủ của nguồn dừng ở ngày gửi cuối |
| Tiện ích bị gỡ | Trong demo *load unpacked*, người dùng gỡ được — ghi thành điểm mù, không kết luận *không hoạt động*. Việc cài bắt buộc chặn gỡ trên trình duyệt được quản lý là thiết kế triển khai, chưa kiểm chứng (`OQ-18`) *(sửa ở v0.6)* |

**Xong khi:** không có bản ghi nào từ thiết bị chưa đăng ký hoặc nhân viên chưa xác nhận; kiểm thử gửi tên miền ngoài danh sách, ứng dụng liên lạc, hay trường ngoài lược đồ **đều bị chặn**; và ít nhất một ứng dụng chỉ có G1/G2 từ nhà cung cấp được đánh giá G3/G4 bằng dữ liệu tiện ích thật.

---

### 7.8. F-46 · Phát hiện SaaS ngoài danh mục từ bộ thu thập *(mới ở v0.5 — `QĐ-20`; ⏸️ giai đoạn sau từ v0.9 — `QĐ-31a`)*

> ⏸️ **Không hiện thực trong đợt này** (`QĐ-31a`): bộ thu thập vẫn là nguồn usage của `MF-3` (`F-45`, `F-48`), nhưng **không** làm nguồn phát hiện ngoài danh mục. Đặc tả dưới giữ nguyên để làm tiếp ở giai đoạn sau.

|                    |                                                                          |
| ------------------ | ------------------------------------------------------------------------ |
| **Mục đích**       | Thêm nguồn bằng chứng thứ ba *"ai đang thực sự mở"* cho các SaaS **đã biết** nhưng chưa được duyệt |
| **Kích hoạt bởi**  | Tác vụ tổng hợp dữ liệu bộ thu thập, chạy theo lịch                     |
| **Tiền điều kiện** | `F-45` đang chạy; tên miền nằm trong **từ điển nhà cung cấp** nhưng **không** thuộc danh mục đã duyệt |

| #   | Ai  | Làm gì                             | Hệ thống phản hồi                                                                    |
| --- | --- | ---------------------------------- | ------------------------------------------------------------------------------------ |
| 1   | HT  | Tổng hợp tên miền trong từ điển mà không thuộc danh mục | Tạo hoặc cập nhật bản ghi phát hiện theo nhà cung cấp — **dùng chung** quy trình `F-31`/`F-32` |
| 2   | HT  | —                                  | Ghi bằng chứng: số nhân viên đã xác nhận có mở, khoảng ngày — **không** ghi URL      |
| 3   | IT  | Xử lý như `F-31`/`F-32`            | Đã duyệt → `F-34`; chưa duyệt; báo nhầm                                              |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung |
| ------- | -------- |
| BR-46.1 | **Chỉ tên miền đã có trong từ điển** mới được xét. Tên miền lạ chưa có trong từ điển đã bị bỏ ngay trên máy (`BR-45.3`), nên nguồn này **mù với SaaS hoàn toàn mới** — ghi rõ khi trình bày |
| BR-46.2 | Một nhà cung cấp chỉ có **một** bản ghi phát hiện đang mở, dù bằng chứng đến từ ba nguồn — BRD `INV-13` |
| BR-46.3 | Bản ghi phát hiện **không phải kết luận vi phạm** — BRD `FR-6.6` |

**Xong khi:** mỗi SaaS đã biết mà nhân viên đang mở ngoài danh mục đều có đúng một bản ghi phát hiện với bằng chứng từ bộ thu thập, và có quyết định của IT.

---

### 7.9. F-47 · Xem báo cáo hiệu suất và chất lượng *(mới ở v0.5 — `QĐ-24`)*

|                   |                                                                   |
| ----------------- | ----------------------------------------------------------------- |
| **Mục đích**      | Trả lời *"hệ thống chạy có hiệu quả không, và tin được tới đâu"*  |
| **Kích hoạt bởi** | Người dùng mở màn hình báo cáo                                    |

**Nội dung theo nhóm báo cáo — BRD `FR-5.10` → `FR-5.12`:**

| Nhóm | Chỉ số | Ai xem |
| --- | --- | --- |
| **Hiệu suất sử dụng** | `KPI-3`; số suất theo G1 → G4; **chi phí trên mỗi người dùng có hoạt động** | IT Admin; Người duyệt chi dạng tóm tắt; Manager chỉ phạm vi cấp dưới, tổng hợp |
| **Hiệu suất quy trình** | `KPI-2` tách theo từng bước — nhu cầu, đánh giá IT, duyệt chi, cấp phát; thời gian Tài chính phản hồi và ghi nhận **đo riêng**; **tỷ lệ bước quá SLA**; `KPI-4`; **tổng hợp suất cấp theo nhánh không chi phí** *(v0.7 — `QĐ-29a`, `QĐ-29b`)* | IT Admin, Super Admin; Người duyệt chi dạng tóm tắt |
| **Chất lượng** | `KPI-5`; `KPI-1`; tỷ lệ định danh đã khớp; độ mới từng nguồn; số sai lệch đang mở; tỷ lệ thuê bao thiếu hạn chót báo hủy; **trạng thái bộ thu thập** | IT Admin; Super Admin (gồm `KPI-5`) |

**Quy tắc nghiệp vụ:**

| Mã      | Nội dung |
| ------- | -------- |
| BR-47.1 | *Chi phí trên mỗi người dùng có hoạt động* **chỉ tính** cho gói theo đầu người **và** ứng dụng có nguồn phát hiện được G3/G4; không đủ điều kiện thì **ẩn kèm lý do** |
| BR-47.2 | **Không đặt con số mục tiêu** cho KPI — BRD `OQ-10` |
| BR-47.3 | Mọi con số bấm được để xem căn cứ tính, như `F-29` |
| BR-47.4 | Không có báo cáo nào xếp hạng nhân viên theo thời gian sử dụng (`BR-45.6`) |

**Xong khi:** mỗi vai trò chỉ thấy đúng nhóm báo cáo của mình; mọi chỉ số hiển thị kèm khoảng thời gian tính và thời điểm cập nhật, hoặc ẩn kèm lý do.

---

### 7.10. F-48 · Agent trên máy công ty *(mới ở v0.5; ✅ mức demo từ v0.9 — `QĐ-31b`)*

> ✅ **Hiện thực mức demo** (`QĐ-31b`, Owner 28/09/2026): agent **Go** (`QĐKT-04`) chạy trong **phiên người dùng**, không cần quyền quản trị, **không** Windows Service/installer/updater. `Gap` (khóa máy, Modern Standby, ngủ, tắt) là **không quan sát được** — không cộng thời gian, nằm ngoài bao phủ; agent tự gắn nguyên nhân *tạm dừng* từ System log. Gửi phút theo ngày + phút bao phủ, xác thực bằng credential thiết bị (`QĐ-32c`). *(📐 tới v0.8 — `QĐ-20`.)*

|                    |                                                                         |
| ------------------ | ----------------------------------------------------------------------- |
| **Mục đích**       | Mở rộng `F-45` sang **ứng dụng desktop** — Figma desktop, Cursor, ứng dụng văn phòng |
| **Kích hoạt bởi**  | Như `F-45`                                                              |
| **Tiền điều kiện** | Như `F-45`, cộng: doanh nghiệp cài được phần mềm trên máy công ty       |

**Khác biệt so với `F-45`, còn lại áp nguyên vẹn `BR-45.1` → `BR-45.7`:**

| Mục | Agent |
| --- | --- |
| Quan sát | **Tên tiến trình** trong danh sách cho phép; thời gian cửa sổ ở phía trước khi máy không rảnh; danh sách phần mềm đã cài |
| **Không bao giờ thu** | **Tiêu đề cửa sổ** *(có thể chứa tên tài liệu, nội dung tin nhắn)*, phím bấm, ảnh màn hình, tiến trình ngoài danh sách |
| Công nghệ hiện thực *(v0.10)* | Agent Go tự viết (prototype `agent-go` 0.2.0; bản C# giữ làm đối chứng) — không dùng ActivityWatch. **Đã đánh giá trước đó:** ActivityWatch *(MPL-2.0, lưu cục bộ, có REST API — **mặc định ghi tiêu đề cửa sổ**, nên cần bộ xuất dữ liệu bỏ tiêu đề trước khi gửi)*; osquery để kiểm kê phần mềm và tiện ích đã cài |

**Xong khi:** đạt đủ tiêu chí của `F-45`, cộng kiểm thử chứng minh **không có tiêu đề cửa sổ nào** rời khỏi máy, và `Gap` không bao giờ được cộng thành thời gian dùng.

---

## 8. Bảng tổng hợp tiêu chí hoàn thành

Dùng để viết kịch bản kiểm thử. Cột **MF** cho biết luồng nằm ở main flow nào.

| Luồng    | MF   | Coi là xong khi                                                                                                                   |
| -------- | ---- | --------------------------------------------------------------------------------------------------------------------------------- |
| F-01     | MF-0 | Bảng điều khiển hiển thị tổng chi phí, tổng suất và ít nhất một cảnh báo có thật                                                  |
| F-02     | MF-1 | Nhân viên mới đăng nhập được vào mọi ứng dụng đã duyệt trong ngày đầu                                                             |
| F-03     | MF-1 | Báo cáo chi phí tháng trước ngày chuyển vẫn hiển thị đơn vị cũ                                                                    |
| F-04     | MF-1 | Người vừa quay lại sau nghỉ dài không xuất hiện trong hàng đợi khuyến nghị                                                        |
| F-05     | MF-1 | Không còn suất nào gắn với người đã nghỉ; sau 30 ngày dữ liệu hoạt động đã xóa                                                    |
| F-39     | MF-1 | Không có quyền có thời hạn nào tồn tại quá 7 ngày sau hạn mà không có quyết định                                                  |
| F-06     | MF-0 | Ứng dụng xuất hiện trong danh mục và lịch cảnh báo gia hạn đã có mốc                                                              |
| F-07/08  | MF-2 | Người yêu cầu nhận thông báo có quyền; đo được thời gian từng bước. *(v0.5)* `F-08`: đúng một khoản cam kết *Đang giữ*; bước duyệt chi đo riêng |
| F-09     | MF-2 | Ứng dụng vào danh mục, hoặc có quyết định không duyệt kèm gợi ý thay thế                                                          |
| F-10/11  | MF-2 | Có bằng chứng tài khoản đã tồn tại phía nhà cung cấp                                                                              |
| F-12     | MF-2 | Mọi việc thất bại đều có một quyết định được ghi nhận                                                                             |
| F-13     | MF-2 | Không bước nào bị đổi người vì nghẽn; mọi lần xác định lại truy được về sự kiện dữ liệu; khoản chi Người duyệt chi xung đột vẫn có quyết định *(v0.6)* |
| F-14/15  | MF-2 | Suất về trạng thái trống, hoặc được ghi nhận để giảm tại kỳ gia hạn                                                               |
| F-17     | MF-3 | Không dòng nào được ghi trước khi người dùng xác nhận                                                                             |
| F-18     | MF-3 | Không có kết luận nào sinh từ dữ liệu chưa khớp danh tính                                                                         |
| F-19/20  | MF-3 | Mỗi khuyến nghị kèm đủ căn cứ để phản biện được                                                                                   |
| F-21     | MF-3 | Mọi khuyến nghị mức cần xem xét trở lên có quyết định kèm lý do trong một chu kỳ                                                  |
| F-22/23  | MF-3 | Suất về trống, khuyến nghị đóng, tiết kiệm ghi **đúng loại**                                                                      |
| F-26     | MF-4 | Mọi thuê bao tự gia hạn đều có quyết định trước hạn báo hủy                                                                       |
| F-27     | MF-4 | Có bản ghi thuê bao kỳ mới, so sánh được với kỳ trước; *(v0.7)* quyết định do Người duyệt chi trên snapshot ngân sách, Tài chính ghi nhận sau |
| F-28     | MF-4 | Mọi sai lệch có quyết định của người thật                                                                                         |
| F-29     | MF-5 | Mọi con số bấm được để xem căn cứ tính                                                                                            |
| F-30     | MF-5 | Dự báo hiển thị kèm đủ bốn thông tin, hoặc không hiển thị kèm lý do                                                               |
| F-31/32  | MF-5 | Mỗi bản ghi có người chịu trách nhiệm và quyết định cuối                                                                          |
| F-34     | MF-5 | Ứng dụng có mặt trong danh mục đầy đủ; người đang dùng có quyền chính thức                                                        |
| F-35     | MF-5 | Mọi dòng hóa đơn ghép được về thuê bao, hoặc đánh dấu ngoài danh mục                                                              |
| **F-36** | MF-5 | **Ngân sách còn lại luôn bằng ngân sách kỳ − thực chi − cam kết đang giữ; không khoản cam kết nào mồ côi** *(✅ từ v0.5)*            |
| **F-37** | MF-0 | **Mỗi vai trò chỉ làm được việc thuộc vai trò đó; tám nguyên tắc phân tách trách nhiệm đều có trường hợp bị chặn** *(mới ở v0.3; tám từ v0.5)* |
| **F-38** | MF-0 | **Mọi thay đổi có hậu quả truy được về một dòng nhật ký; không tác vụ nền nào hỏng trong im lặng** *(mới ở v0.3)*                 |
| F-40     | MF-0 | Nhân viên nhận được file đầy đủ dữ liệu về mình; thời gian xử lý được ghi                                                         |
| F-41     | MF-1 | Sau 30 ngày, dữ liệu hoạt động rỗng nhưng báo cáo chi phí lịch sử vẫn đúng                                                        |
| F-42     | MF-3 | Không có dữ liệu hoạt động nào được ghi mà chưa có bản ghi thông báo; *(v0.5)* với bộ thu thập — chưa có xác nhận chủ động thì không nhận dữ liệu |
| F-43     | MF-0 | Mọi mâu thuẫn có một quyết định của người thật                                                                                    |
| F-44     | MF-0 | Không còn bản ghi nào cũ hơn mốc lưu giữ của lớp mình, kể cả bằng chứng discovery quá 24 tháng; nhật ký kiểm toán vẫn nguyên vẹn |
| **F-45** | MF-3 | **Không bản ghi nào từ thiết bị chưa đăng ký hoặc chưa xác nhận; tên miền ngoài danh sách, ứng dụng liên lạc, trường ngoài lược đồ đều bị chặn** *(mới ở v0.5)* |
| **F-46** | MF-5 | **Mỗi SaaS đã biết đang được mở ngoài danh mục có đúng một bản ghi phát hiện kèm quyết định** *(mới ở v0.5)* |
| **F-47** | MF-5 | **Mỗi vai trò chỉ thấy đúng nhóm báo cáo của mình; chỉ số kèm khoảng tính, hoặc ẩn kèm lý do** *(mới ở v0.5)* |

> Bảng này **không có dòng** cho `F-16`, `F-24`, `F-48` (📐 chỉ đặc tả) và `F-25`, `F-33` (❌ ngoài phạm vi) — đúng theo phạm vi ở mục 1.2. *(v0.5 — `F-36` nay có dòng vì đã chuyển sang ✅.)*

---

## 9. Mười chỗ luồng dễ đứt *(tám tới v0.4)*

| #   | Chỗ đứt                                 | Ở main flow nào       | Hậu quả                                                  | Cách phòng                                              |
| --- | --------------------------------------- | --------------------- | -------------------------------------------------------- | ------------------------------------------------------- |
| 1   | Người duyệt vắng hoặc nghẽn *(sửa ở v0.6)* | MF-2 B2.4             | Toàn bộ luồng treo, nhân viên quay lại đường tắt         | **Không** ủy quyền: SLA từng bước, nhắc, thông báo, cảnh báo backlog cho Quản trị hệ thống (`BR-13.8`); người duyệt dự phòng ở gốc khi không có quản lý |
| 2   | Hết suất khi đã tới bước IT             | MF-2 B2.5             | Hủy phiếu bắt làm lại thì mất niềm tin vào quy trình     | Chèn bước duyệt chi vào luồng đang chạy *(v0.5; sửa v0.7)* |
| 3   | Cấp phát thất bại rồi bị quên           | MF-2 B2.6             | Nhân viên đã được duyệt nhưng không bao giờ có tài khoản | Việc lỗi nổi lên bảng điều khiển sau 7 ngày             |
| 4   | Import thiếu khoảng bao phủ             | MF-3 B3.1             | Kết luận sai hàng loạt mà không có dấu hiệu gì           | Bắt buộc khai; chỉ đánh giá suất nằm trong cửa sổ       |
| 5   | Không biết nguồn hiểu "hoạt động" là gì | MF-3 B3.1             | Nhận nhiễu làm tín hiệu, kết quả phát hiện về gần 0      | Mẫu cấu hình bắt buộc khai định nghĩa hoạt động         |
| 6   | Quản lý bị ngập thông báo               | MF-3 B3.3             | Bỏ qua toàn bộ, phân hệ mất tác dụng dù chạy đúng        | Mức theo dõi không gửi thông báo; gộp theo tuần         |
| 7   | Khuyến nghị tách rời khỏi lịch gia hạn  | MF-3 B3.6 → MF-4 B4.2 | Phát hiện đúng nhưng không bao giờ thành tiền            | Mốc gia hạn hiển thị kèm khuyến nghị của chính thuê bao |
| 8   | Thu thập dữ liệu trước khi thông báo    | MF-0 B0.6 → MF-3 F-42 | Mất cơ sở pháp lý cho toàn bộ phân hệ phát hiện          | F-42 chặn ghi dữ liệu trước khi có bản ghi thông báo    |
| **9** | **Thiết bị gửi dữ liệu trước khi nhân viên xác nhận** *(v0.5)* | MF-3 F-45 | Xử lý dữ liệu nhạy cảm trái Điều 25 khoản 3 Luật 91/2025; phạt tới 3 tỷ đồng với tổ chức | Cổng nhận từ chối theo `INV-17`; kiểm thử phủ định bắt buộc |
| **10** | **Người duyệt chi duy nhất thành nút thắt** *(v0.5)* | MF-2 B2.5b | Yêu cầu có chi phí dồn về một người, nhân viên quay lại đường tắt | Nhánh không chi phí không đi qua *(Owner xác nhận — `QĐ-29a`)*; Tài chính không nằm trên đường duyệt (`QĐ-29b`); cảnh báo backlog `BR-13.8`; KPI-2 đo riêng bước duyệt chi — chậm thì mở lại ma trận nhiều mức *(v0.6 — bỏ ủy quyền)* |

> Bảy trong tám chỗ đứt nằm ở `MF-2` và `MF-3` — đúng hai main flow phục vụ `PP-5` và `PP-1`, hai pain point có nhiều người hưởng lợi nhất và cũng là hai chuỗi demo được ưu tiên phát triển trước. Đây không phải trùng hợp: chỗ nào tạo ra nhiều giá trị nhất thì cũng là chỗ có nhiều mắt xích nhất để đứt.

---

## 10. Cần team quyết

| #      | Câu hỏi                                                                                               | Đề xuất                                                                                                                                                                                                                                              |
| ------ | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1      | Seat có đi theo người khi đổi người quản lý hoặc cost center không? *(sửa chữ ở v0.5)*                | Có; chỉ đổi đơn vị chịu chi phí. Quản lý mới nhận danh sách xem lại                                                                                                                                                                                  |
| 2      | ~~Thời gian xử lý tính theo giờ làm việc hay giờ đồng hồ?~~ **ĐÃ CHỐT** | ✅ **OI-14a (Owner 25/09/2026)** — **giờ làm việc**, mặc định **2 ngày làm việc** cho mỗi loại bước, Super Admin chỉnh được. Đã ghi `BR-13.11` và BRD `FR-3.8` |
| 3      | ~~Rule phát hiện chạy hằng ngày hay hằng tuần?~~ **ĐÃ CHỐT**                                          | ✅ **`QĐ-09` (08/09/2026)** — hằng ngày cho `G1`/`G2`, hằng tuần cho `G3`/`G4`. Đã ghi vào BRD **`FR-4.12b`**                                                                                                                                        |
| 4      | ~~Mức "theo dõi" có hiện cho quản lý không?~~ **ĐÃ CHỐT**                                             | ✅ **`QĐ-09` (08/09/2026)** — **không**, chỉ IT Admin thấy. Đã ghi vào BRD **`FR-4.12`**; đã đồng bộ vào mục 1.7 `B3.3`, mục 4.3 và `BR-20.5` ở lượt review 09/09/2026                                                                              |
| 5      | Cấp phát thử lại tối đa mấy lần?                                                                      | 6 lần, giãn cách tăng dần, tổng khoảng 1 giờ                                                                                                                                                                                                         |
| 6      | ~~Ai đóng vai người duyệt dự phòng ở gốc cây?~~ **ĐÃ CHỐT**                                           | ✅ **`QĐ-02` (08/09/2026)** — **một Employee cụ thể do Super Admin cấu hình**, duyệt **với tư cách vai Manager**, không thêm vai trò thứ sáu. Đã ghi vào BRD **`FR-3.6`**; đã vẽ trên `UF-01` và `UF-04`. ⚠️ `WF-09` **chưa có nhánh này** — xem mục 11.20 |
| 7      | ~~F-42 gửi thông báo qua kênh nào?~~ **ĐÃ CHỐT** | ✅ **OI-EMAIL, OI-09b (Owner 25/09/2026)** — trong ứng dụng cho mọi thông báo; **thư điện tử** (khi được cấu hình) chỉ thêm cho cảnh báo trước hạn báo hủy (`F-26`) và thông báo trước khi theo dõi (`F-42`). Đã ghi `BR-42.7`. Mẫu nội dung vẫn cấu hình có phiên bản ở `F-37` |
| **8**  | ~~**Sửa con số phạm vi ở Định nghĩa Phạm vi mục 5.2**~~ **ĐÃ XONG**                                   | ✅ *Định nghĩa Phạm vi* **v1.2 mục 5.2** nay ghi **`38 / 3 / 2`** *(kiểm 09/09/2026: khối changelog dòng 21 và mục 5.2 dòng 396 đều đã sửa)*. Đã grep BRD: **không** chỗ nào chép lại bộ số này                                                     |
| **9**  | **`MF-0` có cần một chuỗi demo riêng không?** *(mới ở v0.3)*                                          | **Không cần chuỗi riêng, nhưng `B0.5` — hệ thống sinh cảnh báo có thật khi chưa có một dòng log ngoài nào — nên được diễn ngay đầu chuỗi `D-2` để chặn trước câu hỏi *"nếu không lấy được API của nhà cung cấp thì hệ thống còn dùng được không?"*** |
| **10** | **Khi thầy hỏi “main flows”, nhóm đưa tài liệu nào?** *(mới ở v0.4)*                                  | **Hỏi lại một câu trước khi đưa. Xem mục 11.1** — ba tầng trả lời ba câu hỏi khác nhau, đưa nhầm tầng là tự tạo ra câu hỏi vặn                                                                                                                       |
| **11** | ~~Ai duyệt chi phí — Tài chính hay người có thẩm quyền chi?~~ **ĐÃ CHỐT** *(mới ở v0.5)*               | ✅ **`QĐ-22` (14/09/2026)** — **Người duyệt chi**, một người, mặc định CEO; Tài chính chỉ ghi ý kiến *(v0.7 — `QĐ-29b`: trả lời khi được hỏi và ghi nhận sau duyệt)*. Lưu ý: câu 6 ghi *"không thêm vai trò thứ sáu"* là cho **người duyệt dự phòng**; `QĐ-22` thêm vai trò thứ sáu cho **một loại quyết định khác**, không mâu thuẫn |
| **12** | ~~Theo dõi nhân viên có thật sự dùng phần mềm bằng cách nào?~~ **ĐÃ CHỐT** *(mới ở v0.5)*               | ✅ **`QĐ-20` (14/09/2026)** — nhà cung cấp + tiện ích trình duyệt ✅ + agent 📐; xác nhận chủ động |
| **13** | Tiện ích trình duyệt hỗ trợ trình duyệt nào? *(mới ở v0.5)*                                           | Chưa chốt — BRD `OQ-17`, quyết ở thiết kế kỹ thuật `CN-17` |
| **14** | **Khoảng trống màn hình cho vòng đời mật khẩu** *(mới 04/10/2026 — `QĐ-46`, quyết định của Owner, chưa phải xác nhận của GVHD)* | ✅ **Đóng một phần cùng ngày — `UF-17` (mục 11.17c)** vẽ kích hoạt qua lời mời, đăng nhập, quên/đặt lại và đổi mật khẩu (`SYS-01`, `SYS-06`→`SYS-11`). **Còn mở:** màn hình Super Admin quản lý tài khoản (`ADM-01`), chuyển giao vai Super Admin và IT nhập nhân viên **chưa** có `UF` riêng. *Câu gốc (trước `UF-17`):* Bộ `UF` hiện **chưa có** màn hình hay luồng cho kích hoạt tài khoản qua lời mời, quên/đặt lại mật khẩu và đổi mật khẩu; `SYS-01` Đăng nhập và `ADM-01` chưa mô tả các trạng thái này. Nghiệp vụ nằm ở BRD `FR-8.6`, `FR-8.11` và `US-01-10`. **Không** thiết kế màn hình trong lượt đồng bộ này; cần Owner quyết có thêm `UF`/màn hình hay để UI Spec đảm nhiệm. Tài khoản có thể giữ vai nhưng vai chưa có hiệu lực tới khi kích hoạt (`FR-8.6`) |


---
