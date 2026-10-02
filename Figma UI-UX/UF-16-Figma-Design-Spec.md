# SaaS-Sentry — Đặc tả thiết kế Figma cho UF-16

> **Phiên bản:** 1.0 — 17/09/2026  
> **Trạng thái:** Đã hiện thực và kiểm chứng  
> **Hình thức bàn giao:** 32 ảnh PNG độc lập — 16 trạng thái Light và 16 trạng thái Dark; mỗi ảnh là một artboard desktop đầy đủ (1440 × 1024), không ghép contact sheet  
> **Phạm vi:** Desktop web 1440 × 1024; user flow `UF-16` — IT Admin triển khai bộ thu thập, nhân viên xác nhận theo dõi  
> **Nguồn nghiệp vụ:** [BRD v3.11](../Requiments/BRD%20-%20HỆ%20THỐNG%20QUẢN%20TRỊ%20BẢN%20QUYỀN%20PHẦN%20MỀM%20%26%20TỐI%20ƯU%20CHI%20PHÍ%20CÔNG%20NGHỆ.md), [User Flows mục 11.17b](../Diagrams/user-flows/index.md#1117b-uf-16--it-admin-triển-khai-bộ-thu-thập-nhân-viên-xác-nhận-theo-dõi-mới-ở-v05--qđ-20), [UF-16.drawio](../Diagrams/user-flows/drawio/UF-16.drawio)  
> **Visual reference:** [ThemeDarkExample.jpg](ThemeDarkExample.jpg), [ThemeLightExample.jpg](ThemeLightExample.jpg), bộ ảnh `UF-07-FullFrames`, `UF-08-FullFrames`, `UF-14-FullFrames`

---

## 1. Mục tiêu và nguyên tắc

Thiết kế bộ giao diện workbench giúp **IT Admin** quản lý việc triển khai tiện ích trình duyệt trên thiết bị công ty (`ITA-16`) và cổng thông tin nhân viên (`EMP-05`) để **nhân viên (Employee)** đọc thông báo minh bạch và chủ động xác nhận theo dõi trước khi hệ thống tiếp nhận dữ liệu đo lường mức độ sử dụng SaaS.

### Các nguyên tắc nghiệp vụ bắt buộc:

1. **Chưa xác nhận thì không có dữ liệu (`BR-45.1`, `INV-17`):**
   Thiết bị công ty chưa được nhân viên bấm xác nhận chủ động thì cổng nhận dữ liệu khóa chặt; tuyệt đối không thu thập ngầm và không tiếp nhận bất kỳ dữ liệu nào từ thiết bị trước khi có xác nhận.
2. **Lọc tại nguồn là bắt buộc (`BR-45.2`, `ADR-13`):**
   Tiện ích trình duyệt chỉ đo tab thuộc danh sách đang ở phía trước khi trình duyệt không rảnh; bỏ ngay trên máy mọi URL đầy đủ, tiêu đề, nội dung, phím bấm, ảnh chụp, vị trí, hay tên miền ngoài danh mục.
3. **Loại trừ tuyệt đối ứng dụng liên lạc (`BR-45.4`, `ADR-10`):**
   Danh sách cho phép (Allowlist) sinh tự động từ danh mục và từ điển nhà cung cấp, TRỪ TOÀN BỘ ứng dụng liên lạc (Slack, Teams, Zoom, Gmail, Zalo...).
4. **Minh bạch 5 mục theo Luật 91/2025 (`BR-42.4`):**
   Thông báo có đánh phiên bản (`v1.2`), nêu rõ 5 mục bắt buộc:
   - *Thu gì:* Tên miền trong danh mục và số phút hoạt động làm tròn.
   - *KHÔNG thu gì:* Không thu URL chi tiết, tiêu đề trang, nội dung email/tin nhắn, lịch sử duyệt web cá nhân, phím gõ, ảnh chụp màn hình hay webcam.
   - *Mục đích:* Tối ưu hóa chi phí bản quyền phần mềm doanh nghiệp, phát hiện lãng phí license không dùng.
   - *Thời hạn lưu trữ:* 6 tháng (chi tiết mức phút) theo chính sách lưu giữ (`F-44`).
   - *Quyền yêu cầu dừng:* Nhân viên có quyền gửi yêu cầu dừng theo diện quyền chủ thể dữ liệu (`F-40`, `BR-42.6`).
5. **Nghiêm cấm xếp hạng thời gian theo con người (`BR-45.6`, `SoD-2`):**
   Chỉ dùng cho tối ưu license. Tuyệt đối không bao giờ hiển thị bảng xếp hạng thời gian sử dụng theo cá nhân hoặc dùng để chấm công, đánh giá nhân sự (Manager chỉ thấy trạng thái *có / không hoạt động* theo ngưỡng `BR-45.5`).
6. **Định nghĩa hoạt động chuẩn (`BR-45.5`, `FR-4.16`):**
   Tab thuộc danh sách đang ở phía trước **và** trình duyệt không ở trạng thái rảnh rỗi (idle), thời gian sử dụng cộng dồn **≥ 15 phút/ngày** được tính là một ngày hoạt động (Active day).
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
  * Danger: `#d84040` / soft: `#fff0ef`
  * Manual: `#8757c7` / soft: `#f3ecff`

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
  * Danger: `#ff6d72` / soft: `#4b222b`
  * Manual: `#b78aff` / soft: `#342954`

---

## 3. Kiến Trúc Bố Cục & Sổ Dữ Liệu Đồng Bộ

### 3.1. Bố cục Artboard (Desktop 1440 × 1024)
1. **Sidebar cố định bên trái (240px):**
   - Logo SaaS-Sentry, menu điều hướng (*Tổng quan, Danh mục, Cấp quyền, Đối soát, Bộ thu thập & Thiết bị [Active], Cài đặt*).
   - Thẻ tài khoản: Khi ở màn hình IT Admin hiển thị `Trần Quốc Bảo · IT Admin`; khi ở màn hình nhân viên `EMP-05` hiển thị `Lê Hoàng Long · Nhân viên (long.le@company.com)`.
2. **Top Bar (Cao 60px):** Thanh tìm kiếm, thẻ mã màn hình (`ITA-16` / `EMP-05`), breadcrumb, badge thông tin.
3. **Stepper 6 Chặng ngang (Stage Indicator):**
   `[1] Tổng quan thiết bị` → `[2] Cấu hình Allowlist` → `[3] Thông báo minh bạch` → `[4] Xác nhận chủ động` → `[5] Cổng nhận & Dữ liệu` → `[6] Bảng giám sát bộ thu thập`.
4. **Khu vực làm việc trung tâm:** Card thông tin thiết bị, bảng danh sách tên miền allowlist, bảng so sánh đối chiếu thu thập, mô phỏng payload JSON tối giản, và modal hội thoại.

---

### 3.2. Sổ Dữ Liệu Chuẩn Xuyên Suốt (Synchronized State Ledger)

| Sau Frame | Thiết bị đã đăng ký (`registeredDevices`) | Đã xác nhận (`confirmedDevices`) | Chờ xác nhận (`pendingConfirmation`) | Bản ghi bị từ chối (`rejectedRecords`) | Diễn giải sự kiện nghiệp vụ |
|:---:|:---:|:---:|:---:|:---:|---|
| **01** | 24 | 18 | 6 | 3 | **Baseline ban đầu**: 24 thiết bị công ty, 18 đã xác nhận, 6 chờ xác nhận, 3 bản ghi gateway từ chối. |
| **02** | **25** | 18 | **7** | 3 | Đăng ký thiết bị mới `DEV-MBP-2026-088` gán cho Lê Hoàng Long (`a1`). Đã đăng ký tăng 24 ➔ 25, Chờ xác nhận tăng 6 ➔ 7. |
| **03** | 25 | 18 | 7 | 3 | Sinh Allowlist tự động và danh sách loại trừ ứng dụng liên lạc (`s1` · `BR-45.4`). |
| **04** | 25 | 18 | 7 | 3 | Phát hành thông báo đánh phiên bản `v1.2` tới nhân viên (`s2`). |
| **05** | 25 | 18 | 7 | 3 | Nhân viên Lê Hoàng Long nhận thông báo trong cổng `EMP-05`. |
| **06** | 25 | 18 | 7 | 3 | Nhân viên đọc chi tiết 5 mục minh bạch theo Luật 91/2025 (`a2` · `BR-42.4`). |
| **07** | 25 | 18 | 7 | 3 | Nhân viên xem quyền yêu cầu dừng thu thập dữ liệu cá nhân (`BR-42.6` · `F-40`). |
| **08** | 25 | 18 | 7 | 3 | **Nhánh CHƯA XÁC NHẬN (`b1` ➔ `e1`)**: Cổng nhận khóa chặt (`BR-45.1`), thiết bị chưa gửi dữ liệu. |
| **09** | 25 | 18 | 7 | 3 | Nhân viên bấm xác nhận chủ động (`d1` ➔ `s3`). Lưu timestamp và phiên bản `v1.2`. |
| **10** | 25 | **19** | **6** | 3 | Mở cổng nhận dữ liệu (`s3` · `BR-42.4`). Đã xác nhận tăng 18 ➔ 19; Chờ xác nhận giảm 7 ➔ 6. |
| **11** | 25 | 19 | 6 | 3 | Tiện ích client gửi bản tổng hợp ngày tối giản (tên miền, ngày, số phút · `BR-45.2`/`45.3`). |
| **12** | 25 | 19 | 6 | **4** | Cổng nhận từ chối bản ghi lạ/sai lược đồ (`d2=sai` ➔ `s5`). Bản ghi từ chối tăng 3 ➔ 4. |
| **13** | 25 | 19 | 6 | 4 | Cổng nhận xác thực bản ghi hợp lệ từ `DEV-MBP-2026-088` (`d2=đúng` ➔ `s6`). |
| **14** | 25 | 19 | 6 | 4 | Khớp danh tính, tính 85 phút GitHub ➔ Đánh dấu `Active` (≥15 phút/ngày theo `BR-45.5`). |
| **15** | 25 | 19 | 6 | 4 | Bảng giám sát sức khỏe bộ thu thập: TUYỆT ĐỐI KHÔNG XẾP HẠNG THỜI GIAN THEO NGƯỜI (`BR-45.6`). |
| **16** | 25 | 19 | 6 | 4 | Tổng kết dữ liệu tiện ích trình duyệt sẵn sàng bàn giao sang `UF-10` (`e2`). |

---

## 4. Danh Sách 16 Màn Hình Chi Tiết

### Frame 01: `UF-16-01` · Dashboard Trung tâm Bộ thu thập & Thiết bị (`ITA-16`)
- **Vai trò:** IT Admin
- **Nội dung:** Tổng quan tình hình triển khai tiện ích trình duyệt trên máy công ty. 4 thẻ metrics: Đã đăng ký (24), Đã xác nhận (18), Chờ xác nhận (6), Bản ghi bị từ chối (3). Danh sách thiết bị công ty, nút CTA `[+ Đăng ký thiết bị mới]`.

### Frame 02: `UF-16-02` · Modal Đăng ký thiết bị công ty ↔ Nhân viên (`ITA-16` · `a1`)
- **Vai trò:** IT Admin
- **Nội dung:** Hộp thoại đăng ký: Mã thiết bị `DEV-MBP-2026-088` (MacBook Pro M3), Số serial máy, Nhân viên thụ hưởng: `Lê Hoàng Long (NV-0255 · Phòng Kỹ thuật)`, Ngày bàn giao & hiệu lực: `17/09/2026`. Số lượng thiết bị tăng lên 25, Chờ xác nhận tăng lên 7.

### Frame 03: `UF-16-03` · Sinh Allowlist tự động & Danh sách loại trừ (`ITA-16` · `s1` · `BR-45.4`)
- **Vai trò:** Hệ thống & IT Admin
- **Nội dung:** Cấu hình chính sách thu thập: Bảng tên miền được phép theo dõi (github.com, figma.com, atlassian.net, notion.so). Bảng DANH SÁCH BỊ LOẠI TRỪ TUYỆT ĐỐI (Slack, Teams, Zoom, Gmail, Zalo - các ứng dụng liên lạc mang cờ communication flag theo `BR-45.4` và `ADR-10`).

### Frame 04: `UF-16-04` · Phát hành thông báo có đánh phiên bản v1.2 (`ITA-16` · `s2`)
- **Vai trò:** IT Admin
- **Nội dung:** Thiết lập phiên bản nội dung thông báo `v1.2` (cập nhật chính sách Luật 91/2025). Hệ thống tự động gửi thông báo đến hòm thư và tài khoản nội bộ của Lê Hoàng Long (`long.le@company.com`).

### Frame 05: `UF-16-05` · Cổng tự phục vụ nhân viên nhận thông báo (`EMP-05` · `a2`)
- **Vai trò:** Nhân viên (Lê Hoàng Long · `NV-0255`)
- **Nội dung:** Giao diện Employee Self-service Portal. Header hiển thị user `Lê Hoàng Long`. Hộp thư thông báo nổi bật màu cam: *"Yêu cầu xác nhận chính sách đo lường mức sử dụng phần mềm công ty (Phiên bản v1.2) trên máy DEV-MBP-2026-088"*. Nút `[Xem chi tiết thông báo]`.

### Frame 06: `UF-16-06` · Màn hình chi tiết thông báo minh bạch 5 mục (`EMP-05` · `BR-42.4`)
- **Vai trò:** Nhân viên
- **Nội dung:** Bản tuyên bố minh bạch theo đúng Điều 25 Luật 91/2025:
  1. *Thu thập gì:* Chỉ ghi nhận tên miền thuộc Allowlist và số phút hoạt động.
  2. *KHÔNG thu thập gì:* KHÔNG thu URL chi tiết, KHÔNG đọc nội dung trang/email, KHÔNG ghi phím gõ, KHÔNG chụp màn hình hay webcam.
  3. *Mục đích:* Tối ưu hóa chi phí bản quyền phần mềm doanh nghiệp, cắt giảm license thừa.
  4. *Thời hạn lưu trữ:* 6 tháng theo quy định `F-44`.
  5. *Quyền yêu cầu dừng:* Nhân viên có quyền yêu cầu dừng thu thập bất kỳ lúc nào.

### Frame 07: `UF-16-07` · Quyền chủ thể dữ liệu & Yêu cầu dừng thu thập (`EMP-05` · `BR-42.6`)
- **Vai trò:** Nhân viên
- **Nội dung:** Modal giải thích quyền chủ thể dữ liệu: Nhân viên có nút `[Yêu cầu tạm dừng thu thập]`. Quy trình chuyển tới phân hệ Quyền chủ thể dữ liệu (`F-40`), cho phép tạm ngưng tiện ích khi máy dùng cho việc nghiên cứu riêng biệt có phê duyệt.

### Frame 08: `UF-16-08` · Trạng thái CHƯA XÁC NHẬN — Khóa cổng Gateway (`ITA-16` · `b1` ➔ `e1`)
- **Vai trò:** IT Admin
- **Nội dung:** Thể hiện nhánh `d1=chưa xác nhận`: Thiết bị `DEV-MBP-2026-088` hiển thị trạng thái `CHƯA XÁC NHẬN`. Cổng nhận Gateway báo đỏ: `Khóa nhận dữ liệu (BR-45.1)`. Hệ thống không nhận dữ liệu, ứng dụng của người này chỉ còn nguồn G1/G2 từ nhà cung cấp (`e1`).

### Frame 09: `UF-16-09` · Nhân viên bấm xác nhận chủ động (`EMP-05` · `d1` ➔ `s3`)
- **Vai trò:** Nhân viên
- **Nội dung:** Nhân viên tích chọn checkbox: `[x] Tôi đã đọc và hiểu rõ các quyền và nội dung theo dõi minh bạch`. Bấm nút `[Xác nhận đồng ý kích hoạt]`. Hệ thống ghi nhận biên bản điện tử: Timestamp `17/09/2026 15:20:14 ICT`, IP nội bộ, Mã phiên bản `v1.2` (`BR-42.4`).

### Frame 10: `UF-16-10` · Mở Cổng Gateway & Cấp Token tiếp nhận (`ITA-16` · `s3`)
- **Vai trò:** Hệ thống & IT Admin
- **Nội dung:** Thiết bị `DEV-MBP-2026-088` chuyển sang `ĐÃ XÁC NHẬN (v1.2)`. Cổng Ingestion Gateway mở khóa, cấp Token xác thực an toàn cho tiện ích trình duyệt. Số thiết bị Đã xác nhận tăng: 18 ➔ 19; Chờ xác nhận giảm: 7 ➔ 6.

### Frame 11: `UF-16-11` · Tiện ích lọc tại máy client & Payload tối giản (`ITA-16` · `s4`)
- **Vai trò:** Tiện ích trình duyệt (Client Extension)
- **Nội dung:** Mô phỏng cơ chế `BR-45.2` (lọc tại nguồn). Card hiển thị gói dữ liệu JSON tối giản được gửi đi:
  ```json
  {
    "device_id": "DEV-MBP-2026-088",
    "domain": "github.com",
    "date": "2026-09-17",
    "active_minutes": 85
  }
  ```
  Nhấn mạnh: Hoàn toàn không có URL path, query params, hay nội dung nhạy cảm (`BR-45.3`).

### Frame 12: `UF-16-12` · Cổng nhận từ chối bản ghi sai lược đồ (`ITA-16` · `d2=sai` ➔ `s5`)
- **Vai trò:** Cổng Ingestion Gateway
- **Nội dung:** Thể hiện nhánh `d2=sai`: Một gói dữ liệu từ thiết bị chưa đăng ký hoặc chứa trường lạ (`"full_url": "https://..."`) gửi tới Gateway bị từ chối ngay lập tức. Ghi mã lỗi `ERR_INVALID_SCHEMA` vào audit log. Bản ghi bị từ chối tăng: 3 ➔ 4.

### Frame 13: `UF-16-13` · Cổng nhận xác thực bản ghi hợp lệ (`ITA-16` · `d2=đúng` ➔ `s6`)
- **Vai trò:** Cổng Ingestion Gateway
- **Nội dung:** Thể hiện nhánh `d2=đúng`: Bản ghi của `DEV-MBP-2026-088` vượt qua kiểm tra 3 bước (Đã đăng ký, Đã xác nhận v1.2, Đúng lược đồ). Gateway đóng dấu `VERIFIED` và chuyển sang bộ xử lý khớp danh tính.

### Frame 14: `UF-16-14` · Khớp danh tính & Đánh giá mức độ sử dụng (`ITA-16` · `s6` · `BR-45.5`)
- **Vai trò:** Hệ thống
- **Nội dung:** Ghép 85 phút trên `github.com` về Assignment `ASN-4901` (GitHub Business) của Lê Hoàng Long. So sánh với ngưỡng hoạt động (`BR-45.5`: ≥ 15 phút/ngày) ➔ Đánh dấu ngày 17/09/2026 là **Active Day**.

### Frame 15: `UF-16-15` · Bảng giám sát bộ thu thập — Cấm xếp hạng người (`ITA-16` · `a3` · `BR-45.6`)
- **Vai trò:** IT Admin
- **Nội dung:** Bảng điều khiển quản lý thiết bị: Tên thiết bị, Nhân viên, Phiên bản thông báo (`v1.2`), Ngày gửi cuối, Tình trạng kết nối. Banner quy chuẩn màu vàng nổi bật: **QUY TẮC BR-45.6: TUYỆT ĐỐI KHÔNG HIỂN THỊ BẢNG XẾP HẠNG THỜI GIAN THEO CON NGƯỜI**.

### Frame 16: `UF-16-16` · Bàn giao dữ liệu sẵn sàng cho UF-10 (`ITA-16` · `e2`)
- **Vai trò:** IT Admin & Hệ thống
- **Nội dung:** Kết thúc `e2`: Dữ liệu mức độ sử dụng từ tiện ích trình duyệt đã được tổng hợp, kiểm chứng tính hợp pháp, sẵn sàng làm đầu vào cho `UF-10` (Bảng tối ưu license và cắt giảm lãng phí `G3/G4`).

---

## 5. Danh Mục File Giao Nhận

```
docs/
├── Figma UI-UX/
│   ├── UF-16-Figma-Design-Spec.md
│   ├── UF-16-Implementation-Plan.md
│   ├── UF-16-FullFrames/
│   │   ├── Light/
│   │   │   ├── UF-16-Light-01.png
│   │   │   └── ... (đến UF-16-Light-16.png)
│   │   └── Dark/
│   │       ├── UF-16-Dark-01.png
│   │       └── ... (đến UF-16-Dark-16.png)
│   └── UF-16-Sources/
│       ├── uf16-data.js
│       ├── uf16-data.test.js
│       ├── uf16-renderer.js
│       ├── uf16-renderer.test.js
│       ├── uf16.css
│       ├── uf16.html
│       ├── capture-uf16.ps1
│       └── verify-uf16-assets.ps1
```
