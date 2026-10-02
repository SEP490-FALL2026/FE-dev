# SaaS-Sentry — Đặc tả thiết kế Figma cho UF-14

> **Phiên bản:** 1.0 — 17/09/2026  
> **Trạng thái:** Đã hiện thực và kiểm chứng  
> **Hình thức bàn giao:** 32 ảnh PNG độc lập — 16 trạng thái Light và 16 trạng thái Dark; mỗi ảnh là một artboard desktop đầy đủ (1440 × 1024), không ghép contact sheet  
> **Phạm vi:** Desktop web 1440 × 1024; user flow `UF-14` — IT Admin xử lý sai lệch và mâu thuẫn dữ liệu  
> **Nguồn nghiệp vụ:** [BRD v3.11](../Requiments/BRD%20-%20HỆ%20THỐNG%20QUẢN%20TRỊ%20BẢN%20QUYỀN%20PHẦN%20MỀM%20%26%20TỐI%20ƯU%20CHI%20PHÍ%20CÔNG%20NGHỆ.md), [User Flows mục 11.17](../Diagrams/user-flows/index.md#1117-uf-14--it-admin-xử-lý-sai-lệch-và-mâu-thuẫn-dữ-liệu), [UF-14.drawio](../Diagrams/user-flows/drawio/UF-14.drawio)  
> **Visual reference:** [ThemeDarkExample.jpg](ThemeDarkExample.jpg), [ThemeLightExample.jpg](ThemeLightExample.jpg), bộ ảnh `UF-07-FullFrames`, `UF-08-FullFrames`

---

## 1. Mục tiêu và nguyên tắc

Thiết kế giao diện workbench giúp **IT Admin** và **Finance (Tài chính)** đối soát, phát hiện và xử lý các mâu thuẫn dữ liệu giữa hệ thống nội bộ, nhà cung cấp SaaS (qua API connector) và hóa đơn thanh toán thực tế.

### Các nguyên tắc nghiệp vụ bắt buộc:

1. **Giữ nguyên CẢ HAI giá trị (`BR-43.1`, `BR-28.2`, `BR-35.1`):**
   Dữ liệu nội bộ đã qua phê duyệt là nguồn chân lý về *ý định*. Dữ liệu từ nhà cung cấp là nguồn chân lý về *thực tế*. Khi hai nguồn nói khác nhau, đó là sự kiện nghiệp vụ cần người xử lý. Hệ thống **tuyệt đối không tự động sửa/ghi đè** để hai bên khớp nhau (tránh tự xóa mất bằng chứng của một vi phạm hoặc lỗi thanh toán thật).
2. **Không tự đóng theo thời gian & Có người chịu trách nhiệm (`BR-43.2`, `BR-43.3`):**
   Mỗi bản ghi sai lệch/mâu thuẫn bắt buộc phải có một **người chịu trách nhiệm (assignee)**. Mâu thuẫn **không bao giờ tự biến mất hoặc tự đóng theo thời gian**; chỉ đóng khi có quyết định của người thật kèm lý do và bằng chứng.
3. **Không sinh sai lệch giả cho ứng dụng không có API (`BR-28.1`):**
   Chỉ đối soát tự động với các ứng dụng có API connector. Với ứng dụng quản lý thủ công, hệ thống không chạy đối soát tự động và **không sinh sai lệch giả**.
4. **Cảnh báo mức RẤT CAO cho Shadow Access (`BR-28.3`):**
   Trường hợp *"Nhà cung cấp có tài khoản, nhưng hệ thống không biết (không có Assignment nội bộ)"* là dấu hiệu có người được cấp quyền ngoài quy trình kiểm soát (Shadow IT/Access). Hệ thống phát cảnh báo mức **RẤT CAO**, yêu cầu điều tra và chuyển sang quy trình hợp thức hóa hoặc thu hồi khẩn cấp (`UF-12`).
5. **Đối soát hóa đơn với BA con số cạnh nhau (`BR-35.1`, `BR-35.2`):**
   Khi đối soát hóa đơn với thuê bao, hệ thống hiển thị đồng thời 3 con số: **[1] Trên hóa đơn**, **[2] Khai trong thuê bao nội bộ**, **[3] Đang thực sự sử dụng**. Mọi chênh lệch bắt buộc phải được quy về đúng 1 trong 3 nguyên nhân:
   - *Mua thêm chưa cập nhật nội bộ*
   - *Nhà cung cấp tính sai*
   - *Dữ liệu nội bộ sai*
6. **Bắt tay kiểm tra ProvisioningTask chờ chấp nhận (`QĐ-03`, `BRD mục 5.12.3 · 6.3`):**
   Nếu chênh lệch tài khoản gắn với một `ProvisioningTask` đang ở trạng thái `CHỜ CHẤP NHẬN` (từ `UF-08`):
   - Nếu thành viên đã chấp nhận và active đúng tài khoản: Hệ thống ghi nhận bằng chứng API, tự động hoàn tất `ProvisioningTask` (`CHỜ CHẤP NHẬN` → `HOÀN TẤT`) và không coi là sai lệch.
   - Nếu vẫn đang chờ chấp nhận và lời mời còn hạn: Giữ nguyên trạng thái chờ, không sinh sai lệch.
   - Nếu lời mời hết hạn hoặc sai tài khoản: Đưa vào hàng đợi sai lệch để IT Admin xử lý.
7. **Tính đối xứng và đồng nhất giữa Light và Dark:**
   Hai theme dùng chung hoàn toàn cây component, Auto Layout, typography, dữ liệu ledger, breadcrumb, stepper và trạng thái tương tác; chỉ hoán đổi semantic color tokens theo chuẩn `ThemeLightExample.jpg` và `ThemeDarkExample.jpg`.

---

## 2. Chuẩn Thiết Kế Hệ Thống & Bảng Màu

### 2.1. Light Theme (`ThemeLightExample.jpg`)
- Canvas nền (`--bg`): `#fff9f2` (warm cream)
- Sidebar (`--sidebar`): `#fff4e8`
- Surface / Cards (`--surface`): `#ffffff` (viền `#efddca`, bo góc `8px`–`12px`)
- Accent Brand Color (`--primary`): `#ff7417` (warm energetic SaaS orange)
- Chữ chính (`--text`): `#2b241f`, Chữ phụ (`--muted`): `#897568`
- Badge trạng thái:
  * Info: `#237df0` / soft: `#eaf4ff`
  * Success: `#16875a` / soft: `#eaf8f1`
  * Warning: `#b86a00` / soft: `#fff3d8`
  * Danger / Very High: `#d84040` / soft: `#fff0ef`
  * Manual / External: `#8757c7` / soft: `#f3ecff`

### 2.2. Dark Theme (`ThemeDarkExample.jpg`)
- Canvas nền (`--bg`): `#07182d` (deep rich navy)
- Sidebar (`--sidebar`): `#061426`
- Surface / Cards (`--surface`): `#0d223a` (viền `#213d5c`, bo góc `8px`–`12px`)
- Accent Brand Color (`--primary`): `#2d86ff` (vibrant electric blue)
- Chữ chính (`--text`): `#f5f9ff`, Chữ phụ (`--muted`): `#91a8c2`
- Badge trạng thái:
  * Info: `#4d9cff` / soft: `#123b69`
  * Success: `#43d59a` / soft: `#123e38`
  * Warning: `#ffb53f` / soft: `#4b3716`
  * Danger / Very High: `#ff6d72` / soft: `#4b222b`
  * Manual / External: `#b78aff` / soft: `#342954`

---

## 3. Kiến Trúc Bố Cục & Sổ Dữ Liệu Đồng Bộ

### 3.1. Bố cục Artboard (Desktop 1440 × 1024)
1. **Sidebar cố định bên trái (240px):** Logo SaaS-Sentry, menu điều hướng chính (*Tổng quan, Thuê bao, Cấp phát & Thu hồi, Đối soát dữ liệu [Active], Báo cáo tối ưu, Cài đặt*), thẻ tài khoản người dùng đang đăng nhập (`IT Admin · it-admin@company.com` hoặc `Finance · finance@company.com`).
2. **Top Bar (Cao 64px):** Thanh tìm kiếm toàn cục, chuông thông báo (kèm badge số lượng), trợ giúp, nút chuyển theme mô phỏng.
3. **Breadcrumb & Sub-header:**
   `Đối soát dữ liệu → [Tên phiên hoặc phân hệ] → [Mã bản ghi / Mã màn hình]`.
4. **Stepper 6 Chặng ngang (Stage Indicator):**
   `[1] Tổng quan đối soát` → `[2] Đối soát nhà cung cấp` → `[3] Lệch thiếu tài khoản` → `[4] Đối soát hóa đơn` → `[5] Lệch Shadow Access` → `[6] Sổ nhật ký kiểm toán`.
5. **Khu vực làm việc trung tâm:** Card bảng dữ liệu, side-by-side comparison, panel chi tiết thực thể, hoặc Modal hội thoại với nền scrim tối mờ (`rgba(0, 0, 0, 0.5)`).

---

### 3.2. Sổ Dữ Liệu Chuẩn Xuyên Suốt (Synchronized State Ledger)

Các biến chỉ số trên toàn bộ 16 frame được tính toán và biến động chính xác theo từng bước hành động của người dùng:

| Sau Frame | Sai lệch NCC mở (`openMemberDiscrepancies`) | Lệch Hóa đơn mở (`openInvoiceDiscrepancies`) | Tác vụ chờ chấp nhận (`pendingAcceptanceTasks`) | Đã xử lý hôm nay (`resolvedTodayCount`) | Diễn giải sự kiện nghiệp vụ |
|:---:|:---:|:---:|:---:|:---:|---|
| **01** | 3 | 1 | 2 | 4 | **Baseline ban đầu**: Có 3 lệch NCC, 1 lệch hóa đơn, 2 task chờ chấp nhận. |
| **02** | 3 | 1 | 2 | 4 | Xem chi tiết GitHub: phát hiện `PV-2041` có thể đã active. |
| **03** | 3 | 1 | **1** | **5** | `PV-2041` active trên GitHub → Hoàn tất task (`s5`), không coi là sai lệch. Task chờ giảm: 2 → 1. |
| **04** | 3 | 1 | 1 | 5 | Canva không có API connector (`d2=không`) → Không sinh sai lệch giả (`e0`). |
| **05** | 3 | 1 | 1 | 5 | Chọn xử lý `DISC-2026-081` (Figma: Hệ thống có, NCC thiếu). |
| **06** | 3 | 1 | 1 | 5 | Mở modal `ITA-05` chọn kích hoạt Re-provisioning task sang `UF-08`. |
| **07** | **2** | 1 | 1 | **6** | `DISC-2026-081` đã đóng với quyết định cấp lại (`s4`). Lệch NCC giảm: 3 → 2. |
| **08** | 2 | 1 | 1 | 6 | Mở hóa đơn Slack `INV-2026-09-001`, ghép về `SUB-SLK-BP-01`. |
| **09** | 2 | 1 | 1 | 6 | Đối chiếu 3 con số: Hóa đơn 55 vs Thuê bao 50 vs Dùng thật 48. |
| **10** | 2 | 1 | 1 | 6 | Phân định nguyên nhân: *(1) Mua thêm 5 seats đợt mở rộng Q3 chưa cập nhật*. |
| **11** | 2 | 1 | 1 | 6 | Mở `ITA-04` điều chỉnh số lượng khai trong thuê bao từ 50 → 55. |
| **12** | 2 | **0** | 1 | **7** | Đóng đối soát hóa đơn Slack (`s4`). Lệch hóa đơn giảm: 1 → 0. |
| **13** | 2 | 0 | 1 | 7 | Chọn xử lý `DISC-2026-094` (GitHub: NCC có, Hệ thống không biết - Shadow Access). |
| **14** | 2 | 0 | 1 | 7 | Mở `ITA-15` điều tra: Tài khoản `alex.vu@partner-corp.com` do dev-lead tạo ngoài luồng. |
| **15** | 2 | 0 | 1 | 7 | Modal xác nhận: Quyết định thu hồi khẩn cấp phía GitHub và mở kiểm tra bảo mật. |
| **16** | **1** | 0 | 1 | **8** | Bản ghi `DISC-2026-094` đóng kèm biên bản (`s4`). Ledger tổng kết: 100% minh bạch, không bản ghi tự đóng. |

---

## 4. Danh Sách 16 Màn Hình Chi Tiết

### Frame 01: `UF-14-01` · Trung tâm đối soát dữ liệu (`ITA-11`)
- **Vai trò:** IT Admin & Finance
- **Mục tiêu:** Màn hình chính của Reconciliation Workbench.
- **Thành phần:**
  * 4 Cards chỉ số: *Sai lệch thành viên NCC (3)*, *Lệch số suất hóa đơn (1)*, *Tác vụ chờ chấp nhận (2)*, *Đã giải quyết hôm nay (4)*.
  * Bảng danh sách các đợt đối soát gần nhất: GitHub Business (Đang chạy), Figma Professional (Phát hiện sai lệch), Slack Business+ (Hóa đơn lệch), Canva Team (Chưa kết nối API).
  * Nút CTA: `[+ Chạy đối soát ngay]`, `[Nhập hóa đơn đối chiếu]`.

### Frame 02: `UF-14-02` · Chi tiết đối soát thành viên GitHub Business (`ITA-11`)
- **Vai trò:** IT Admin
- **Mục tiêu:** Thực hiện nhánh `d1=với nhà cung cấp` → `a1=ITA-11` → `d2=có kết nối API` → `dq=có ProvisioningTask chờ chấp nhận`.
- **Thành phần:**
  * Header ứng dụng: `GitHub Business Enterprise (SUB-GH-BIZ-01)`.
  * Trạng thái kết nối API: `Xanh lục · Đang hoạt động (Lần quét: 17/09/2026 · 14:30)`.
  * Thẻ cảnh báo: Phát hiện 1 thành viên trên GitHub trùng với lời mời chờ chấp nhận từ `UF-08` (`PV-2041` · Nguyễn Minh An · `NV-0248`).
  * CTA: `[Kiểm tra trạng thái lời mời]`.

### Frame 03: `UF-14-03` · Bắt tay UF-08: Tự động hoàn tất tác vụ chờ chấp nhận (`ITA-11` · `s5` → `e2`)
- **Vai trò:** Hệ thống & IT Admin
- **Mục tiêu:** Nhánh `dq2=đã active đúng tài khoản` → `s5` (Ghi bằng chứng NCC, chuyển `ProvisioningTask` `CHỜ CHẤP NHẬN` → `HOÀN TẤT` theo `QĐ-03`, BRD mục 5.12.3).
- **Thành phần:**
  * Thẻ xác minh lời mời: GitHub API xác nhận user `an.nguyen@company.com` đã chấp nhận invitation vào Organization lúc 14:15.
  * Banner thông báo màu xanh: `Tác vụ cấp phát PV-2041 ĐÃ HOÀN TẤT TỰ ĐỘNG`. Hệ thống tự cập nhật Assignment `ASN-4901` sang `Active` và ghi Audit Trail.
  * Chỉ số Tác vụ chờ chấp nhận giảm từ 2 xuống 1.

### Frame 04: `UF-14-04` · Ứng dụng không có API connector — Không sinh sai lệch giả (`ITA-11` · `d2` → `e0`)
- **Vai trò:** IT Admin
- **Mục tiêu:** Thể hiện rõ nhánh `d2=không có kết nối` → `e0` (`BR-28.1`).
- **Thành phần:**
  * Xem chi tiết ứng dụng `Canva Team (SUB-CNV-01)`.
  * Banner thông tin màu xám/xanh dương: *"Ứng dụng chưa cấu hình API Connector tự động (chế độ quản lý thủ công). SaaS-Sentry TUYỆT ĐỐI KHÔNG sinh sai lệch giả khi chưa có dữ liệu API (`BR-28.1`)."*
  * Lịch sử cấp phát hiển thị trạng thái quản lý thủ công bằng giấy tờ/vé hỗ trợ.

### Frame 05: `UF-14-05` · Hàng đợi sai lệch thành viên: Hệ thống có, NCC không có (`ITA-11` · `a3` → `s2`)
- **Vai trò:** IT Admin
- **Mục tiêu:** Thể hiện trường hợp sai lệch loại 1: `Hệ thống có, nhà cung cấp không có` (Mức Trung bình · `BR-28.2`, `BR-43.1`).
- **Thành phần:**
  * Chọn bản ghi `DISC-2026-081` (Figma Professional).
  * Panel đối chiếu song song:
    - *Nội bộ (Ý định):* Assignment `ASN-4102` (Đặng Hoàng Long · `NV-0195`), QL duyệt ngày 10/09/2026, gói Figma Pro.
    - *Figma (Thực tế):* Không tìm thấy account `long.dang@company.com` trong Workspace Figma.
  * Badge: `MỨC TRUNG BÌNH · Người dùng không truy cập được dù đã được duyệt`.
  * Người chịu trách nhiệm: `IT Admin · it-admin@company.com` (`BR-43.2`).

### Frame 06: `UF-14-06` · Modal Xử lý sai lệch: Cấp lại hoặc xác nhận không cấp (`ITA-05` · `a4`)
- **Vai trò:** IT Admin
- **Mục tiêu:** Màn hình/Modal `ITA-05` để người thật ra quyết định (`a4` → `o1`).
- **Thành phần:**
  * Hộp thoại toàn màn có scrim: `Xử lý sai lệch DISC-2026-081 (Figma Professional)`.
  * Hai tùy chọn radio:
    - `(•) Kích hoạt cấp lại tài khoản (Tạo ProvisioningTask mới sang hàng đợi UF-08)`.
    - `( ) Xác nhận không cần cấp lại (Hủy Assignment nội bộ kèm phê duyệt)`.
  * Trường nhập bắt buộc: `Lý do xử lý: "Tài khoản bị sót sau đợt reset workspace đầu tháng 9, cần cấp lại ngay"`.
  * Nút CTA: `[Xác nhận & Chuyển UF-08]`, `[Đóng]`.

### Frame 07: `UF-14-07` · Hoàn tất đóng sai lệch kèm quyết định người thật (`ITA-11` · `s4` → `e1`)
- **Vai trò:** IT Admin
- **Mục tiêu:** Thể hiện kết thúc nhánh 1: Đóng bản ghi `DISC-2026-081` kèm quyết định và liên kết task sang `UF-08`.
- **Thành phần:**
  * Trạng thái bản ghi chuyển sang: `ĐÃ GIẢI QUYẾT · Chờ thực thi tại UF-08 (Task PV-2065)`.
  * Audit Trail ghi nhận: `Người quyết: it-admin@company.com · Thời gian: 17/09/2026 14:45 · Mã quyết định DEC-4401`.
  * Metric sai lệch NCC giảm từ 3 xuống 2; Đã giải quyết hôm nay tăng từ 5 lên 6.

### Frame 08: `UF-14-08` · Bàn làm việc đối soát hóa đơn Tài chính (`FIN-04` · `d1` → `a2`)
- **Vai trò:** Finance (Tài chính)
- **Mục tiêu:** Nhánh đối soát hóa đơn: Import hóa đơn và ghép về thuê bao (`a2`).
- **Thành phần:**
  * Top bar hiển thị ngữ cảnh vai trò: `Finance Analyst · finance@company.com`.
  * Chi tiết hóa đơn: `INV-2026-09-001 (Slack Technologies Inc.)`, Số tiền: `$825.00 USD`, Ngày lập: `05/09/2026`.
  * Hệ thống tự động ghép với Thuê bao nội bộ: `SUB-SLK-BP-01 (Slack Business+)`.
  * Badge trạng thái: `Cần đối soát số lượng suất (Detected Mismatch)`.

### Frame 09: `UF-14-09` · Bảng đối chiếu BA con số cạnh nhau (`FIN-04` · `s0`)
- **Vai trò:** Finance
- **Mục tiêu:** Thể hiện chuẩn quy tắc `BR-35.1`: Hiển thị BA con số cạnh nhau, không tự sửa.
- **Thành phần:**
  * Thẻ so sánh 3 cột nổi bật:
    1. **Trên hóa đơn:** `55 seats` · `$825.00 / tháng` (Nguồn: Invoice PDF parsed).
    2. **Khai trong thuê bao nội bộ:** `50 seats` · `$750.00 / tháng` (Nguồn: Quản lý hợp đồng).
    3. **Đang thực sự sử dụng:** `48 seats active` (Nguồn: Slack API usage data).
  * Chênh lệch phát hiện: `+5 seats phát sinh trên hóa đơn ($75.00/tháng)`.
  * Cảnh báo: `Hệ thống giữ nguyên cả hai giá trị, không tự sửa thuê bao theo hóa đơn (BR-43.1 · BR-35.1)`.

### Frame 10: `UF-14-10` · Phân định nguyên nhân chênh lệch hóa đơn (`FIN-04` · `s1`)
- **Vai trò:** Finance
- **Mục tiêu:** Tuân thủ `BR-35.2`: Bắt buộc quy về đúng 1 trong 3 nguyên nhân.
- **Thành phần:**
  * Form phân loại nguyên nhân với 3 radio buttons:
    - `(•) Đã mua thêm nhưng chưa cập nhật hồ sơ thuê bao nội bộ`.
    - `( ) Nhà cung cấp tính sai / thanh toán thừa`.
    - `( ) Dữ liệu nội bộ sai sót do nhập liệu`.
  * Nhập mã chứng từ / Ticket tham chiếu: `REQ-2026-0889 (Duyệt chi mở rộng 5 seats Slack cho team Dự án AI)`.
  * Người chịu trách nhiệm: `Nguyễn Thị Hoa (Kế toán trưởng)` + `Lê Văn Nam (IT Lead)`.

### Frame 11: `UF-14-11` · Điều chỉnh dữ liệu thuê bao nội bộ (`ITA-04` · `a5`)
- **Vai trò:** IT Admin / Finance
- **Mục tiêu:** Màn hình `ITA-04`: Sửa dữ liệu nội bộ theo nguyên nhân đã xác định (`a5`).
- **Thành phần:**
  * Form chỉnh sửa Thuê bao `SUB-SLK-BP-01`:
    - Số lượng suất cũ: `50 seats` ($750/tháng).
    - Số lượng suất mới: `55 seats` ($825/tháng).
    - Căn cứ điều chỉnh: `Hóa đơn INV-2026-09-001 & Ticket REQ-2026-0889`.
  * Lịch sử phiên bản: Lưu giữ cả 2 giá trị cũ và mới trong Audit Log, không ghi đè mất dấu lịch sử (`BR-43.1`).

### Frame 12: `UF-14-12` · Đóng đối soát hóa đơn và giải phóng cam kết (`FIN-04` · `s4` → `e1`)
- **Vai trò:** Finance
- **Mục tiêu:** Hoàn tất đối soát hóa đơn: Trạng thái hóa đơn thành công, chuyển khoản cam kết sang chi phí (`F-35`).
- **Thành phần:**
  * Banner thông báo: `Hóa đơn INV-2026-09-001 ĐÃ KHỚP & ĐÓNG ĐỐI SOÁT`.
  * Khoản cam kết `COM-2026-0889` ($75.00) chuyển từ `Đang giữ` → `Đã thành chi phí` (`F-35`, `INV-16`).
  * Chỉ số Lệch hóa đơn giảm từ 1 xuống 0; Đã giải quyết hôm nay tăng từ 6 lên 7.

### Frame 13: `UF-14-13` · Phát hiện quyền ngoài quy trình: NCC có, Hệ thống không biết (`ITA-11` · `BR-28.3`)
- **Vai trò:** IT Admin
- **Mục tiêu:** Trường hợp sai lệch loại 2: `Nhà cung cấp có, hệ thống không biết` (Shadow Access · `BR-28.3`).
- **Thành phần:**
  * Danh sách chọn bản ghi `DISC-2026-094` trên `GitHub Business`.
  * Chi tiết sai lệch: Account `alex.vu@partner-corp.com` đang giữ vai trò `Member` trong GitHub Organization, nhưng trong SaaS-Sentry **không có bất kỳ Assignment nào**.
  * Badge cảnh báo nổi bật màu đỏ: `MỨC RẤT CAO · CÓ NGƯỜI ĐƯỢC CẤP QUYỀN NGOÀI QUY TRÌNH (BR-28.3)`.
  * Người chịu trách nhiệm: `Trần Quốc Bảo (IT Security Lead)`.
  * Nút CTA: `[Mở điều tra bảo mật (ITA-15)]`.

### Frame 14: `UF-14-14` · Màn hình điều tra tài khoản ngoài luồng (`ITA-15` · `a6`)
- **Vai trò:** IT Admin / Security
- **Mục tiêu:** Màn hình `ITA-15`: Phân tích nguồn gốc tài khoản Shadow Access trước khi xử lý (`a6`).
- **Thành phần:**
  * Thông tin tài khoản nhà cung cấp: Tạo lúc `22:15 · 12/09/2026` bởi GitHub Admin `dev-lead@company.com`.
  * Bằng chứng truy cập: Đã tương tác với 3 repositories dự án khách hàng (`core-banking-api`, `payment-gateway`, `infra-terraform`).
  * Hai hướng xử lý theo quy định:
    1. `Hợp thức hóa quyền (Chuyển sang UF-12 nếu nhân sự hợp lệ)`.
    2. `Thu hồi tài khoản khẩn cấp (Khóa quyền ngay lập tức phía nhà cung cấp)`.

### Frame 15: `UF-14-15` · Modal quyết định xử lý vi phạm (`ITA-15` · `o2` → `s4`)
- **Vai trò:** IT Security Lead
- **Mục tiêu:** Quyết định của người thật để đóng bản ghi điều tra (`s4`).
- **Thành phần:**
  * Modal xác nhận quyết định an ninh thông tin.
  * Chọn hành động: `Thu hồi tài khoản khẩn cấp và gửi báo cáo vi phạm an toàn thông tin`.
  * Nhập kết luận điều tra: *"Tài khoản đối tác nhà thầu phụ chưa qua phê duyệt chính thức theo quy trình F-07/F-08. Yêu cầu thu hồi ngay lập tức và rà soát quyền hạn của dev-lead."*
  * Chuyển tác vụ thu hồi sang hàng đợi `UF-08`.

### Frame 16: `UF-14-16` · Sổ nhật ký kiểm toán toàn diện & Kết thúc đối soát (`ITA-11` · `e1`)
- **Vai trò:** IT Admin & Auditor
- **Mục tiêu:** Bảng Master Ledger chứng minh 100% sai lệch có người thật quyết định, không bản ghi nào tự đóng (`BR-43.2`, `BR-43.3` · `e1`).
- **Thành phần:**
  * Bảng tổng hợp lịch sử đối soát hoàn chỉnh với 4 bản ghi tiêu biểu:
    - `DISC-2026-081` (Figma): Thiếu quyền NCC → Đã cấp lại qua `UF-08` (`PV-2065`) · Quyết định bởi `it-admin@company.com`.
    - `INV-2026-09-001` (Slack): Lệch số suất → Đã điều chỉnh thuê bao nội bộ 50→55 seats · Quyết định bởi Kế toán trưởng & IT Lead.
    - `DISC-2026-094` (GitHub): Shadow Access → Đã thu hồi khẩn cấp & lập biên bản · Quyết định bởi Security Lead.
    - `PV-2041` (GitHub): Chờ chấp nhận → Tự động hoàn tất có bằng chứng API.
  * Thẻ cam kết tuân thủ hiển thị `BR-43.1 / BR-43.2 / BR-43.3: Tuân thủ 100%`.
  * Chỉ số: Đã giải quyết hôm nay: `8 bản ghi`.

---

## 5. Danh Mục File Giao Nhận

```
docs/
├── Figma UI-UX/
│   ├── UF-14-Figma-Design-Spec.md
│   ├── UF-14-Implementation-Plan.md
│   ├── UF-14-FullFrames/
│   │   ├── Light/
│   │   │   ├── UF-14-Light-01.png
│   │   │   └── ... (đến UF-14-Light-16.png)
│   │   └── Dark/
│   │       ├── UF-14-Dark-01.png
│   │       └── ... (đến UF-14-Dark-16.png)
│   └── UF-14-Sources/
│       ├── uf14-data.js
│       ├── uf14-data.test.js
│       ├── uf14-renderer.js
│       ├── uf14-renderer.test.js
│       ├── uf14.css
│       ├── uf14.html
│       ├── capture-uf14.ps1
│       └── verify-uf14-assets.ps1
```
