# SaaS-Sentry — Đặc tả thiết kế Figma cho UF-07

> **Phiên bản:** 0.1 — 17/09/2026
> **Trạng thái:** Đã hiện thực visual storyboard raster (Light + Dark); đây là bộ PNG độc lập, không phải component/prototype Figma editable
> **Hình thức bàn giao:** 22 ảnh PNG độc lập: 11 trạng thái Light và 11 trạng thái Dark; mỗi ảnh là một artboard desktop đầy đủ, không ghép contact sheet
> **Phạm vi:** Desktop web 1440 × 1024; user flow `UF-07` — IT Admin xử lý hàng đợi chưa khớp danh tính
> **Nguồn nghiệp vụ:** [BRD v3.11](../Requiments/BRD%20-%20HỆ%20THỐNG%20QUẢN%20TRỊ%20BẢN%20QUYỀN%20PHẦN%20MỀM%20%26%20TỐI%20ƯU%20CHI%20PHÍ%20CÔNG%20NGHỆ.md), [User Flows mục UF-07](../Diagrams/user-flows/index.md#1110-uf-07--it-admin-xử-lý-hàng-đợi-chưa-khớp-danh-tính), [UF-07.drawio](../Diagrams/user-flows/drawio/UF-07.drawio)
> **Visual reference:** [ThemeDarkExample.jpg](ThemeDarkExample.jpg), [ThemeLightExample.jpg](ThemeLightExample.jpg), bộ ảnh `UF-06-FullFrames`

## 1. Mục tiêu và nguyên tắc

Thiết kế một workbench cho IT Admin xử lý từng định danh chưa khớp sau phiên import Microsoft 365 của `UF-06`. Giao diện phải giúp người xử lý thấy được chuỗi gốc, chuỗi đã chuẩn hóa, phương pháp gợi ý, độ tin cậy và hậu quả của từng quyết định.

Các nguyên tắc bắt buộc:

- Bản ghi chưa khớp không được dùng để kết luận về bất kỳ nhân viên nào (`BR-18.1`, `INV-12`).
- Luôn hiển thị chuỗi gốc bên cạnh chuỗi đã chuẩn hóa (`BR-18.2`).
- Khớp thủ công phải ghi người xác nhận và phương pháp thủ công (`BR-18.3`, `FR-4.5`).
- Một định danh khớp về hai nhân viên thì chặn; giao diện không có hành động chọn bừa một người (`BR-18.4`, `FR-7.7`).
- Khớp thành công phải chạy lại tổng hợp cho Assignment liên quan; không kết thúc giả trước khi tác vụ hoàn tất.
- Light và Dark dùng cùng nội dung, số liệu, component tree và trạng thái. Chỉ semantic color token thay đổi.

## 2. Quyết định bố cục

UF-07 là **queue workbench**, không phải wizard tuyến tính. Không sử dụng stepper sáu bước của `UF-06` vì mỗi bản ghi có thể đi vào một trong ba nhánh độc lập.

Bố cục cố định trên cả 11 frame:

1. Sidebar sản phẩm bên trái, giữ shell SaaS-Sentry của `UF-06`.
2. Top bar có tìm kiếm, thông báo, trợ giúp và tài khoản IT Admin.
3. Breadcrumb: `Nhập dữ liệu → Phiên IMP-20250114-7F3A → Hàng đợi chưa khớp`.
4. Header trang gồm tên hàng đợi, nguồn Microsoft 365 và badge quy tắc `Không dùng để kết luận`.
5. Cột trái là danh sách hàng đợi và bộ lọc trạng thái.
6. Vùng trung tâm là chi tiết định danh, ứng viên và hành động.
7. Panel phải cố định ngữ cảnh phiên import và nhật ký xử lý.

Các dialog xác nhận vẫn được xuất thành ảnh toàn màn riêng, có lớp scrim, để đáp ứng yêu cầu mỗi trạng thái là một ảnh độc lập.

## 3. Sổ dữ liệu chuẩn xuyên suốt

### 3.1. Phiên import

| Trường                  | Giá trị cố định                   |
| ----------------------- | --------------------------------- |
| Nguồn                   | Microsoft 365                     |
| File                    | `m365_usage_jan2025.csv`          |
| Import session          | `IMP-20250114-7F3A`               |
| Thời điểm import        | 14/01/2025 · 10:24 ICT            |
| Người import            | IT Admin · `it-admin@company.com` |
| Tổng định danh duy nhất | 1.248                             |
| Đã khớp trước UF-07     | 1.102                             |
| Chưa khớp khi bắt đầu   | 146                               |
| Mẫu nguồn               | `Microsoft 365 · Usage v3`        |
| Loại định danh          | User Principal Name               |
| Coverage window         | 01/01/2025–31/01/2025             |

### 3.2. Ba hồ sơ minh họa

| ID        | Chuỗi gốc                                            | Chuỗi chuẩn hóa                          | Kết quả                              |
| --------- | ---------------------------------------------------- | ---------------------------------------- | ------------------------------------ |
| `UQ-0184` | `Nguyen.Van_A@acmecloud.onmicrosoft.com`             | `nguyen.van_a@acmecloud.onmicrosoft.com` | Khớp duy nhất với Nguyễn Văn An; 94% |
| `UQ-0185` | `svc-marketing-automation@acmecloud.onmicrosoft.com` | Giữ nguyên                               | Không có ứng viên; bỏ qua có lý do   |
| `UQ-0186` | `n.tran@acmecloud.onmicrosoft.com`                   | Giữ nguyên                               | Hai ứng viên gần nhau; bị chặn       |

Ứng viên của `UQ-0184`:

- Nguyễn Văn An · `NV-0241` · `nguyen.van.an@company.com`.
- Phương pháp gợi ý: email gần đúng + họ tên từ Display Name.
- Độ tin cậy: 94%.
- 23 bản ghi usage liên quan, thuộc 1 Assignment đang hiệu lực.
- Người xác nhận khi khớp tay: IT Admin · `it-admin@company.com`.

Ứng viên xung đột của `UQ-0186`:

- Nguyễn Minh Trần · `NV-0312` · `nguyen.minh.tran@company.com` · 82%.
- Nguyễn Mai Trần · `NV-0448` · `nguyen.mai.tran@company.com` · 80%.
- Phương pháp: username viết tắt + họ tên gần đúng.
- Không ứng viên nào được chọn; bản ghi chuyển sang `Xung đột danh tính`.

### 3.3. Ledger số lượng

| Sau hành động             | Chưa khớp cần xử lý | Xung đột đang chờ | Đã xử lý trong phiên |
| ------------------------- | ------------------: | ----------------: | -------------------: |
| Mở UF-07                  |                 146 |                 0 |                    0 |
| Khớp `UQ-0184` hoàn tất   |                 145 |                 0 |                    1 |
| Bỏ qua `UQ-0185` hoàn tất |                 144 |                 0 |                    2 |
| Chặn `UQ-0186`            |                 144 |                 1 |                    2 |

`UQ-0186` vẫn nằm trong tổng 144 vì chưa được giải quyết. Badge `Xung đột đang chờ: 1` là một lát cắt của hàng đợi, không cộng thêm vào tổng.

## 4. Danh sách 11 frame

| #   | Tên frame               | Trạng thái nghiệp vụ                  | Nội dung bắt buộc                                                                                                                    |
| --- | ----------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 01  | Tổng quan hàng đợi      | Bắt đầu, 146 chưa khớp                | Metric 1.248 / 1.102 / 146; bảng hàng đợi; filter Mới/Xung đột/Đã bỏ qua; cảnh báo `BR-18.1`; chọn `UQ-0184`                         |
| 02  | Xem gợi ý cho UQ-0184   | Đã chọn bản ghi                       | Chuỗi gốc và chuẩn hóa đặt cạnh nhau; ba ứng viên; phương pháp, confidence; candidate Nguyễn Văn An 94% đứng đầu                     |
| 03  | Xác nhận khớp duy nhất  | Dialog trước khi gán tay              | External identifier, employee đích, 23 usage records, 1 Assignment, người xác nhận, checkbox xác nhận; CTA `Xác nhận khớp thủ công`  |
| 04  | Đang tính lại tổng hợp  | Mapping đã ghi, aggregation đang chạy | Progress theo ba pha: lưu ánh xạ → gắn usage vào Assignment theo ngày sự kiện → tính lại trạng thái; không hiển thị thành công sớm   |
| 05  | Khớp thành công         | `UQ-0184` hoàn tất                    | Queue còn 145; audit entry; 23 bản ghi đã tổng hợp; 1 Assignment được tính lại; CTA `Xử lý bản ghi tiếp theo`                        |
| 06  | Không tìm được ứng viên | Mở `UQ-0185`                          | Search nội bộ trả 0 kết quả; chuỗi gốc/chuẩn hóa; cho tìm lại hoặc `Đánh dấu bỏ qua`; queue 145                                      |
| 07  | Xác nhận bỏ qua         | Dialog có trường lý do bắt buộc       | Lý do `Tài khoản dịch vụ của nhà cung cấp, không thuộc nhân viên`; cảnh báo bản ghi không dùng kết luận; CTA bị khóa khi lý do trống |
| 08  | Đã bỏ qua               | `UQ-0185` hoàn tất                    | Queue còn 144; badge `Đã bỏ qua`; lý do, người và thời điểm xử lý; khẳng định không tạo IdentityMapping tới nhân viên                |
| 09  | Phát hiện hai ứng viên  | Mở `UQ-0186`                          | Hai candidate card 82%/80%; nguyên nhân mơ hồ; cả nút chọn đều vô hiệu hóa; queue 144                                                |
| 10  | Chặn xung đột danh tính | `BR-18.4` kích hoạt                   | Blocked state; giải thích không nguồn nào thắng; CTA duy nhất `Chuyển sang chờ xử lý xung đột`; không có CTA khớp                    |
| 11  | Đang chờ xử lý xung đột | End state                             | Queue vẫn 144; xung đột đang chờ 1; audit trail; danh sách hai candidate được giữ nguyên; CTA về hàng đợi                            |

## 5. Hợp đồng chuyển màn

```text
01 Queue 146
→ 02 UQ-0184 / candidates
→ 03 confirm unique match
→ 04 recompute
→ 05 success / queue 145
→ 06 UQ-0185 / no candidate
→ 07 ignore with required reason
→ 08 ignored / queue 144
→ 09 UQ-0186 / two candidates
→ 10 blocked conflict
→ 11 waiting conflict / queue remains 144
```

Quy tắc continuity:

- `IMP-20250114-7F3A`, nguồn, file và coverage không đổi trên mọi frame.
- Thời gian hành động tăng theo thứ tự: 10:31 → 10:32 → 10:34 ICT.
- Badge queue chỉ giảm sau khi hành động đạt end state.
- Frame 04 vẫn hiển thị 146 cho tới khi aggregation hoàn tất; frame 05 mới đổi thành 145.
- Frame 07 vẫn hiển thị 145; frame 08 mới đổi thành 144.
- Frame 09–11 luôn là 144 vì conflict chưa được giải quyết.
- Light và Dark có cùng text, ID, số liệu, thứ tự bảng, pagination và timestamp.

## 6. Visual system

### 6.1. Kích thước

| Thuộc tính          | Giá trị                                |
| ------------------- | -------------------------------------- |
| Frame               | 1440 × 1024 px                         |
| Sidebar             | 224 px                                 |
| Top bar             | 64 px                                  |
| Content gutter      | 24 px                                  |
| Queue column        | 328 px                                 |
| Context panel       | 280 px                                 |
| Grid                | 8 px                                   |
| Table row           | 48 px                                  |
| Card radius         | 12 px                                  |
| Input/button radius | 8–10 px                                |
| Font                | Inter; fallback `Segoe UI`, sans-serif |

### 6.2. Theme tokens

| Token                  | Dark      | Light     | Vai trò             |
| ---------------------- | --------- | --------- | ------------------- |
| `color/bg/canvas`      | `#07182D` | `#FFF9F2` | Nền trang           |
| `color/bg/sidebar`     | `#061426` | `#FFF4E8` | Sidebar             |
| `color/bg/surface`     | `#0D223A` | `#FFFFFF` | Card, panel, dialog |
| `color/bg/subtle`      | `#102943` | `#FFFAF4` | Header bảng, hover  |
| `color/border/default` | `#213D5C` | `#EFDDCA` | Border              |
| `color/text/primary`   | `#F5F9FF` | `#2B241F` | Text chính          |
| `color/text/secondary` | `#91A8C2` | `#897568` | Metadata            |
| `color/action/primary` | `#2D86FF` | `#FF7417` | CTA, focus, active  |

Success, Warning, Danger và Info giữ ý nghĩa giống nhau giữa hai theme. Không dùng màu làm kênh duy nhất: mọi trạng thái có icon, label và mô tả.

## 7. Component inventory

| Nhóm     | Component                                                                   |
| -------- | --------------------------------------------------------------------------- |
| Shell    | `AppShell`, `SidebarItem`, `Topbar`, `Breadcrumb`, `UserMenu`               |
| Queue    | `QueueMetric`, `QueueFilter`, `IdentityQueueRow`, `QueuePagination`         |
| Identity | `RawNormalizedPair`, `CandidateCard`, `ConfidenceMeter`, `MatchMethodBadge` |
| Context  | `ImportContextPanel`, `SourceSummary`, `AuditTimeline`                      |
| Feedback | Alert, Badge, EmptyState, BlockedState, ProgressPanel, Toast                |
| Overlay  | `ConfirmManualMatchDialog`, `IgnoreIdentityDialog`                          |
| Action   | Primary, Secondary, Ghost, Danger, Disabled, Loading                        |

## 8. Nội dung và hành vi chi tiết

### 8.1. Queue overview

- Bảng mặc định sắp theo `Thời điểm phát hiện tăng dần` để xử lý bản ghi cũ trước.
- Cột: ID, chuỗi gốc, chuỗi chuẩn hóa, ứng viên tốt nhất, độ tin cậy, trạng thái, cập nhật cuối.
- Filter: `Cần xử lý`, `Xung đột`, `Đã bỏ qua`, `Đã khớp`.
- Banner cố định: `Dữ liệu chưa khớp không được dùng để tạo khuyến nghị hoặc kết luận về nhân viên.`

### 8.2. Candidate review

- Chuỗi gốc không bị cắt mất phần phân biệt; cho phép copy.
- Mỗi candidate hiển thị tên, mã nhân viên, email, trạng thái đang làm việc, Assignment liên quan, phương pháp và confidence.
- Confidence không tự động quyết định; IT Admin vẫn phải xác nhận.
- Khi có hai candidate gần nhau, chọn candidate bị khóa theo `BR-18.4`.

### 8.3. Manual mapping

- Dialog ghi rõ đây là `Khớp thủ công`, không đổi thành exact match.
- Người xác nhận lấy từ phiên đăng nhập và chỉ đọc.
- Audit ghi: external key, employee đích, phương pháp, confidence tại lúc quyết định, người và timestamp.
- Aggregation gắn usage vào Assignment có hiệu lực tại ngày sự kiện, không gắn trực tiếp vào Employee (`FR-4.7`).

### 8.4. Ignore

- Lý do bắt buộc, tối thiểu 10 ký tự.
- Bỏ qua không xóa chuỗi gốc và không tạo IdentityMapping tới nhân viên.
- End state hiển thị rõ bản ghi không được dùng làm bằng chứng hay khuyến nghị.

### 8.5. Conflict

- Giữ nguyên hai giá trị/candidate; không có candidate thắng mặc định.
- Không hiển thị nút `Chọn người này` ở frame 10.
- Trạng thái cuối là `Xung đột danh tính · Chờ xử lý`; queue không giảm.
- Không tự đặt một vai trò hay cá nhân xử lý mới ngoài nguồn nghiệp vụ; panel chỉ ghi `Chưa phân công`.

## 9. Accessibility

- Text và control quan trọng đạt WCAG AA.
- Focus ring 2 px; thứ tự tab: queue → detail → candidates → action → context.
- Label không thay bằng placeholder.
- Confidence có cả phần trăm và mô tả; không chỉ dùng thanh màu.
- Disabled action kèm lý do hiển thị trực tiếp.
- Dialog giữ focus, hỗ trợ Escape cho hành động không phá hủy.
- Bảng có header rõ, selected row có border + icon ngoài thay đổi màu nền.

## 10. Cấu trúc đầu ra

```text
Figma UI-UX/
├── UF-07-Figma-Design-Spec.md
└── UF-07-FullFrames/
    ├── Light/
    │   ├── UF-07-Light-01.png
    │   └── ... UF-07-Light-11.png
    └── Dark/
        ├── UF-07-Dark-01.png
        └── ... UF-07-Dark-11.png
```

Không tạo storyboard ghép chung trừ khi người dùng yêu cầu riêng. Mỗi PNG phải là một canvas desktop đầy đủ.

## 11. Tiêu chí nghiệm thu

1. Có đúng 11 PNG Light và 11 PNG Dark, mỗi file 1440 × 1024.
2. Không có contact sheet thay cho ảnh riêng.
3. Hai theme có cùng nội dung, số liệu, ID, timestamp, thứ tự và topology.
4. Ledger 146 → 145 → 144 → 144 đúng ở mọi frame.
5. Chuỗi gốc và chuẩn hóa luôn hiển thị đồng thời ở màn chi tiết.
6. Manual match ghi phương pháp và người xác nhận.
7. Frame 04 thể hiện aggregation chưa hoàn tất; frame 05 mới hiển thị success.
8. Ignore bắt buộc có lý do và không tạo kết luận về nhân viên.
9. Conflict có hai ứng viên nhưng không cho chọn; queue không giảm.
10. Mọi trạng thái có text/icon, không phụ thuộc duy nhất vào màu.
11. Không cắt chữ, chồng lớp hoặc tràn bảng ở tỷ lệ xem 100%.
12. Tên sản phẩm là SaaS-Sentry; không mang thương hiệu LicenseHub từ ảnh theme.

## 12. Truy vết nguồn

| Thiết kế                                               | Nguồn                                     |
| ------------------------------------------------------ | ----------------------------------------- |
| Bảng IdentityMapping lưu method, confidence, confirmer | `FR-4.5`                                  |
| Unmatched vào queue, không dùng kết luận               | `FR-4.6`, `FR-4.10`, `BR-18.1`, `INV-12`  |
| Usage gắn Assignment tại ngày sự kiện                  | `FR-4.7`                                  |
| Giữ chuỗi gốc và chuẩn hóa                             | `BR-18.2`, `FR-7.6`                       |
| Manual match ghi người xác nhận                        | `BR-18.3`, `FR-4.5`                       |
| Hai nhân viên thì chặn                                 | `BR-18.4`, `FR-7.7`                       |
| Chạy lại tổng hợp sau khi khớp                         | `F-18` bước 4                             |
| Audit quyết định                                       | Quy tắc chung user flow mục 0.3; `FR-8.3` |

## 13. Phần không được tự suy diễn

- Không tạo vai trò mới để xử lý xung đột.
- Không đặt ngưỡng confidence tự động khớp vì BRD chưa chốt ngưỡng.
- Không tự xóa bản ghi bị bỏ qua.
- Không dùng dữ liệu chưa khớp cho dashboard tối ưu hay Ghost Seat Recommendation.
- Không thay đổi BRD, `F-18`, `BR-18.x`, `index.md` hoặc `.drawio` trong hạng mục visual này.

## 14. Bản hiện thực

- Renderer cục bộ: [`UF-07-Sources/uf07.html`](UF-07-Sources/uf07.html), [`uf07-renderer.js`](UF-07-Sources/uf07-renderer.js), [`uf07.css`](UF-07-Sources/uf07.css).
- Dữ liệu chuẩn và ledger: [`UF-07-Sources/uf07-data.js`](UF-07-Sources/uf07-data.js).
- Script xuất ảnh: [`UF-07-Sources/capture-uf07.ps1`](UF-07-Sources/capture-uf07.ps1).
- Kiểm chứng tự động: [`UF-07-Sources/verify-uf07-assets.ps1`](UF-07-Sources/verify-uf07-assets.ps1), `uf07-data.test.js`, `uf07-renderer.test.js`.
- Ảnh Light: `UF-07-FullFrames/Light/UF-07-Light-01.png` → `UF-07-Light-11.png`.
- Ảnh Dark: `UF-07-FullFrames/Dark/UF-07-Dark-01.png` → `UF-07-Dark-11.png`.

Lệnh tái sinh:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File 'Figma UI-UX\UF-07-Sources\capture-uf07.ps1' -RootPath (Get-Location)
```

Lệnh kiểm chứng:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File 'Figma UI-UX\UF-07-Sources\verify-uf07-assets.ps1' -RootPath (Get-Location)
```
