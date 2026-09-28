# SaaS-Sentry — Đặc tả thiết kế Figma cho UF-10

> **Phiên bản:** 1.0 — 17/09/2026  
> **Trạng thái:** Đã hiện thực và kiểm chứng  
> **Hình thức bàn giao:** 36 ảnh PNG độc lập — 18 trạng thái Light và 18 trạng thái Dark; mỗi ảnh là một artboard desktop đầy đủ  
> **Phạm vi:** Desktop web 1440 × 1024; user flow `UF-10` — IT Admin xử lý bảng tối ưu license  
> **Nguồn nghiệp vụ:** BRD v3.11, `Diagrams/user-flows/index.md` mục 11.13 và `Diagrams/user-flows/drawio/UF-10.drawio`  
> **Visual reference:** `ThemeDarkExample.jpg`, `ThemeLightExample.jpg`, `UF-07-FullFrames`, `UF-08-FullFrames`, `UF-09-FullFrames`

## 1. Mục tiêu

Thiết kế một branch workspace để IT Admin xem và xử lý bốn nhóm lãng phí `G1`–`G4` mà không trộn nguồn dữ liệu, độ tin cậy hoặc cách ra quyết định. Giao diện phải chứng minh được giá trị tài chính nhưng không cộng sai hai loại tiết kiệm.

Các nguyên tắc khóa:

- `G1` nhắm vào thuê bao và số lượng mua, không nhắm vào một người; hành động là giảm số lượng tại kỳ gia hạn (`BR-19.1`).
- `G2` dùng dữ liệu nội bộ, độ tin cậy tuyệt đối, bỏ qua ngưỡng ngày và không qua Manager (`BR-05.2`, `BR-19.2`).
- `G3` và `G4` chỉ xuất hiện khi nguồn usage đủ năng lực; căn cứ phải là snapshot tại thời điểm sinh (`FR-4.4`, `FR-4.14`, `BR-20.3`).
- `G3/G4` đi qua Manager ở `UF-05`. Chỉ quyết định Thu hồi quay lại IT; Giữ và Tạm miễn trừ kết thúc ở nhánh Manager.
- IT có thể không đồng ý với quyết định Thu hồi nhưng lý do là bắt buộc (`BR-22.1`).
- Nhánh đồng ý tạo tác vụ và bàn giao cho `UF-08`; tạo tác vụ chưa đồng nghĩa seat đã về trống.
- Nhánh `G1` hiện hành đi `UF-15` để Người duyệt chi quyết định, rồi `UF-11` để Finance ghi nhận sau duyệt (`QĐ-29b`).
- Tiết kiệm thực hiện ngay và tiết kiệm tại kỳ gia hạn là hai số độc lập, không có tổng cộng (`FR-4.15`, `BR-20.2`).
- Số ghi vào báo cáo cuối là số thực tế thu được, không phải ước tính ban đầu (`BR-22.2`).
- Light và Dark dùng chung component tree, dữ liệu, ID, timestamp và trạng thái; chỉ thay semantic color token.

## 2. Cách tổ chức giao diện

UF-10 dùng **branch workspace**, không dùng wizard nghiệp vụ giả tuyến tính. Để người xem vẫn theo được 18 artboard, top tracker là bản đồ trình bày sáu chặng:

```text
1 Tổng quan → 2 G1 · Gia hạn → 3 G2 · Nghỉ việc →
4 G3/G4 · Usage → 5 Xử lý → 6 Tiết kiệm
```

Đây là thứ tự walkthrough, không hàm ý G1–G4 xảy ra nối tiếp trong hệ thống. Mọi frame có nhãn `Chặng n / 6`, trong khi badge nhóm luôn cho biết đang ở nhánh `G1`, `G2`, `G3` hoặc `G4`.

App Shell giữ cùng ngôn ngữ thị giác với UF-07/08/09:

1. Sidebar SaaS-Sentry bên trái; `Khuyến nghị` là module chính, `Ứng dụng` dùng ở chi tiết G1 và `Quyền truy cập` dùng khi bàn giao UF-08.
2. Top bar có tìm kiếm, trợ giúp, thông báo và tài khoản IT Admin.
3. Breadcrumb giữ mã lần chạy `RUN-OPT-20260917-0615`.
4. Tracker sáu chặng cố định.
5. Header có frame number, nhóm đang xử lý và mô tả trạng thái.
6. Vùng trung tâm chứa dashboard, bảng, dialog hoặc handoff.
7. Panel phải giữ sổ kiểm soát theo nhánh, nguồn dữ liệu, lịch rule và hai loại tiết kiệm.

## 3. Dữ liệu demo chuẩn

### 3.1. Lần chạy rule

| Trường | Giá trị |
| --- | --- |
| Run ID | `RUN-OPT-20260917-0615` |
| Thời điểm | `17/09/2026 · 06:15 ICT` |
| Actor | `Automation Service` |
| Người xử lý | `IT Admin · it-admin@company.com` |
| Lịch G1/G2 | Hằng ngày |
| Lịch G3/G4 | Hằng tuần |
| Snapshot | Bất biến tại thời điểm sinh |

### 3.2. Tổng quan nhóm

| Nhóm | Số phát hiện | Nguồn | Độ tin cậy | Hành động |
| --- | ---: | --- | --- | --- |
| G1 | 12 seat | Dữ liệu thuê bao nội bộ | 100% | Giảm số lượng tại kỳ gia hạn |
| G2 | 3 seat | HRIS + Assignment nội bộ | 100% | Thu hồi ngay, không qua Manager |
| G3 | 9 seat | Usage có cửa sổ bao phủ hợp lệ | Cao | Manager kiểm tra rồi thu hồi |
| G4 | 14 seat | Ngày hoạt động cuối | Trung bình | Manager xác nhận |

Tổng số phát hiện có thể hiển thị là `38`, nhưng giao diện không tạo một CTA xử lý chung vì bốn nhóm có semantics khác nhau.

### 3.3. Nhánh G1

| Trường | Giá trị |
| --- | --- |
| Subscription | `SUB-M365-E3-01` · Microsoft 365 E3 |
| Purchased / Assigned | `120 / 108` |
| Đề nghị giảm | `12 seat` tại kỳ gia hạn |
| Renewal | `15/12/2026` |
| Notice deadline | `15/11/2026` |
| Unit cost | `500.000 đ/seat/tháng` |
| Ước tính ban đầu | `72.000.000 đ/năm` |
| Renewal decision | `REN-2026-041` |
| Approval | `APV-2026-118` |
| Finance record | `FIN-REN-2026-078` |
| Quyết định cuối | Giảm `8 seat`, giữ buffer `4 seat` |
| Tiết kiệm thực tế tại kỳ gia hạn | `48.000.000 đ/năm` |

Frame 03–04 dùng số đề nghị 12. Frame 05–06 cho thấy Người duyệt chi chỉ duyệt giảm 8. Báo cáo cuối chỉ ghi 48 triệu/năm, không ghi 72 triệu như đã thực hiện.

### 3.4. Nhánh G2

Ba seat của người đã nghỉ việc:

| Người dùng | Assignment | Subscription | Ứng dụng | Tác vụ UF-08 | Loại tiết kiệm |
| --- | --- | --- | --- | --- | --- |
| Nguyễn Hải Yến · `NV-0527` | `ASN-5114` | `SUB-SLK-BP-01` | Slack Business+ | `PV-2058` | `320.000 đ/tháng` ngay |
| Nguyễn Hải Yến · `NV-0527` | `ASN-5115` | `SUB-GH-BIZ-01` | GitHub Business | `PV-2059` | `420.000 đ/tháng` ngay |
| Hồ Tuấn Anh · `NV-0486` | `ASN-5107` | `SUB-NOT-ENT-01` | Notion Enterprise | `PV-2061` | Seat trống sau thu hồi; chuyển thành G1 tiềm năng, chưa ghi tiết kiệm |

Nguồn quyết định chung: `OPT-G2-20260917-014`. Bulk confirmation yêu cầu gõ `3` và lý do `Nhân viên đã nghỉ việc · RUN-OPT-20260917-0615`.

### 3.5. Nhánh G3/G4

| Recommendation | Nhóm | Người dùng | Assignment | Căn cứ snapshot | Confidence | Manager | Kết quả UF-05 |
| --- | --- | --- | --- | --- | ---: | --- | --- |
| `REC-2026-331` | G3 | Phạm Quang · `NV-0293` | `ASN-5098` · Figma | Chưa từng có hoạt động; coverage 120 ngày | 92% | Lê Thu Hà | Thu hồi |
| `REC-2026-332` | G4 | Nguyễn Mai Anh · `NV-0384` | `ASN-5077` · Atlassian | Không hoạt động 94 ngày | 84% | Lê Thu Hà | Giữ |
| `REC-2026-333` | G4 | Vũ Đức Long · `NV-0442` | `ASN-5061` · Miro | Không hoạt động 76 ngày | 78% | Nguyễn Hoàng Long | Miễn trừ tới 17/12/2026 |

Batch Manager: `MBR-2026-W38-009`, gửi `17/09/2026 · 08:30 ICT`. Quyết định Thu hồi `REC-2026-331` quay lại IT lúc `17/09/2026 · 15:42 ICT`.

Nhánh IT đồng ý tạo `PV-2060` cho `ASN-5098`, bàn giao `UF-08`. Nhánh IT không đồng ý là nhánh thay thế từ frame 14: lý do bắt buộc `Dữ liệu import mới đang chờ đối soát; chưa đủ căn cứ thu hồi.` và trả lại Manager lúc `17/09/2026 · 16:05 ICT`.

### 3.6. Hai loại tiết kiệm cuối

| Loại | Giá trị thực tế | Thành phần |
| --- | ---: | --- |
| Thực hiện ngay | `740.000 đ/tháng` | Slack `320.000` + GitHub `420.000` |
| Tại kỳ gia hạn đã được duyệt | `48.000.000 đ/năm` | M365 giảm 8 seat theo `APV-2026-118` |

Seat Notion từ `PV-2061` trở thành G1 tiềm năng sau khi thu hồi nhưng chưa có quyết định giảm thuê bao, nên `3.600.000 đ/năm` chỉ là cơ hội chưa ghi nhận. Figma `REC-2026-331` cũng chỉ được đưa vào báo cáo sau khi `PV-2060` có đủ bằng chứng. Frame 18 mô tả trạng thái trước thời điểm đó: tác vụ đã tạo, khoản tiết kiệm Figma chưa ghi nhận. Không có con số tổng quy đổi năm/tháng.

## 4. Registry 18 frame

| Frame | Chặng | State | Nội dung bắt buộc |
| --- | ---: | --- | --- |
| 01 | 1 | `optimization-dashboard` | Bốn thẻ G1–G4, tổng 38 phát hiện, lịch chạy và hai ô tiết kiệm tách biệt |
| 02 | 1 | `group-comparison` | So sánh nguồn, confidence, Manager gate và hành động của từng nhóm |
| 03 | 2 | `g1-list` | 12 seat G1 theo thuê bao; không hiển thị người dùng như đối tượng quyết định |
| 04 | 2 | `g1-renewal-detail` | `SUB-M365-E3-01`, đề nghị giảm 12, notice deadline và ước tính 72 triệu/năm |
| 05 | 2 | `g1-approval-handoff` | Handoff `UF-15`, `REN-2026-041`; Người duyệt chi quyết định trước Finance |
| 06 | 2 | `g1-approved-recorded` | Duyệt giảm 8, `APV-2026-118`; Finance ghi `FIN-REN-2026-078`; thực tế 48 triệu/năm |
| 07 | 3 | `g2-list` | Ba G2, confidence 100%, banner không cần Manager |
| 08 | 3 | `g2-bulk-confirm` | Gõ `3`, lý do chung, cảnh báo tạo tác vụ chưa nhả seat |
| 09 | 3 | `g2-tasks-created` | `PV-2058`, `PV-2059`, `PV-2061`; handoff UF-08 |
| 10 | 4 | `usage-list` | Tách G3/G4, ba recommendation demo, quality/source badge |
| 11 | 4 | `usage-evidence` | Snapshot chi tiết của `REC-2026-331`, coverage, match, định nghĩa activity |
| 12 | 4 | `manager-batch-send` | Gom batch tuần `MBR-2026-W38-009`, hai Manager, ba recommendation |
| 13 | 4 | `manager-results` | Kết quả UF-05: Thu hồi, Giữ, Miễn trừ; chỉ Thu hồi quay lại IT |
| 14 | 5 | `it-review` | IT xem `REC-2026-331`, chọn Đồng ý hoặc Không đồng ý |
| 15 | 5 | `it-agree` | Nhánh A: tạo `PV-2060`, giữ Assignment tới khi đủ bằng chứng, handoff UF-08 |
| 16 | 5 | `it-disagree-dialog` | Nhánh B từ frame 14: dialog bắt buộc lý do, chưa thay đổi seat |
| 17 | 5 | `returned-to-manager` | Nhánh B: trả Manager xem xét, giữ snapshot và lịch sử; không tạo task |
| 18 | 6 | `savings-summary` | Walkthrough tiếp tục nhánh A; seat G2 đã nhả, `PV-2060` đang mở, hai số tiết kiệm riêng |

## 5. Quan hệ giữa các frame

```text
01 → 02
      ├─ G1: 03 → 04 → 05 (UF-15) → 06 (UF-11)
      ├─ G2: 07 → 08 → 09 (UF-08)
      └─ G3/G4: 10 → 11 → 12 (UF-05) → 13 → 14
                                             ├─ Đồng ý → 15 (UF-08) → 18
                                             └─ Không đồng ý → 16 → 17
```

Frame 15 và 16 là hai kết quả thay thế của frame 14. Frame 18 tiếp tục nhánh A để có thể minh họa tiền thực tế; nhánh B kết thúc ở frame 17 và không tạo tác vụ hay tiết kiệm.

## 6. Sổ kiểm soát xuyên suốt

Panel phải hiển thị cùng thứ tự:

1. `G1 mở`
2. `G2 mở`
3. `Chờ Manager`
4. `Chờ IT review`
5. `Tác vụ UF-08 mở`
6. `Seat đã nhả`
7. `Tiết kiệm ngay`
8. `Tiết kiệm tại gia hạn`

Các mốc chính:

| Mốc | G1 mở | G2 mở | Chờ Manager | Chờ IT | Task mở | Seat nhả hiện tại | Giảm đã duyệt tại renewal |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Dashboard | 12 | 3 | 23 | 0 | 0 | 0 | 0 |
| G1 đã ghi nhận | 4 buffer | 3 | 23 | 0 | 0 | 0 | 8 |
| G2 task đã tạo | 4 buffer | 3 | 23 | 0 | 3 | 0 | 8 |
| Manager đã trả kết quả | 4 buffer | 3 | 0 | 1 | 3 | 0 | 8 |
| Nhánh A tạo task | 4 buffer | 3 | 0 | 0 | 4 | 0 | 8 |
| Nhánh B trả Manager | 4 buffer | 3 | 1 | 0 | 3 | 0 | 8 |
| Tổng kết nhánh A | 4 buffer + 1 Notion mới | 0 | 0 | 0 | 1 | 3 | 8 |

`8 tại renewal` không được hiển thị như seat đã nhả ở hiện tại. Ledger UI dùng nhãn `Đã duyệt giảm tại renewal`, không gộp với `Seat đã nhả`.

## 7. Theme tokens

Light giữ nền kem ấm và primary cam:

- canvas `#FFF9F2`, sidebar `#FFF4E8`, surface `#FFFFFF`
- border `#EFDDCA`, text `#2B241F`, secondary `#897568`
- primary `#FF7417`

Dark giữ navy và primary xanh điện:

- canvas `#07182D`, sidebar `#061426`, surface `#0D223A`
- border `#213D5C`, text `#F5F9FF`, secondary `#91A8C2`
- primary `#2D86FF`

Semantic màu giống UF-09: success xanh lá, warning vàng, danger đỏ, info xanh. Badge G1–G4 dùng màu riêng nhưng phải giữ contrast ở cả hai theme.

## 8. Kiểm chứng bắt buộc

- Registry đúng `01`–`18`, mapping chặng `[1,1,2,2,2,2,3,3,3,4,4,4,4,5,5,5,5,6]`.
- Mọi frame có đủ sáu nhãn tracker và metadata ledger.
- Frame 03–06 chỉ quyết định ở cấp Subscription; không render employee như đối tượng G1.
- Frame 05 có thứ tự `UF-15 → UF-11`; không để Finance thành người duyệt.
- Frame 07–09 không có Manager confirmation.
- Frame 09 có ba task nhưng seat chưa tự động về trống.
- Frame 11 hiển thị snapshot, không đọc căn cứ động từ nguồn hiện tại.
- Frame 13 chỉ đưa quyết định Thu hồi về IT.
- Frame 16 bắt buộc lý do; frame 17 không có `PV-2060`.
- Frame 15 có `PV-2060`; Assignment vẫn chiếm chỗ tới khi UF-08 đủ bằng chứng.
- Frame 18 không có tổng cộng giữa `740.000 đ/tháng` và `48.000.000 đ/năm`; cơ hội Notion `3.600.000 đ/năm` vẫn chưa ghi nhận.
- Light/Dark của cùng frame giống tuyệt đối về nội dung và topology.
- Đúng 18 ảnh mỗi theme, mỗi ảnh `1440 × 1024`, không overflow.

## 9. Ranh giới bàn giao

Bản hiện thực sẽ là renderer HTML/CSS/JS cục bộ, test dữ liệu/renderer, script Chrome headless và 36 PNG độc lập trong `UF-10-FullFrames/Light` và `UF-10-FullFrames/Dark`. Đây là visual handoff dùng làm đầu vào Figma, không phải file Figma editable hoặc component library cloud.

Không sửa BRD, `index.md`, `UF-10.drawio`, UF-06/07/08/09 hoặc các ảnh tham chiếu.

## 10. Kết quả hiện thực và kiểm chứng

- Nguồn renderer: `Figma UI-UX/UF-10-Sources/`.
- Ảnh Light: `Figma UI-UX/UF-10-FullFrames/Light/UF-10-Light-01.png` đến `UF-10-Light-18.png`.
- Ảnh Dark: `Figma UI-UX/UF-10-FullFrames/Dark/UF-10-Dark-01.png` đến `UF-10-Dark-18.png`.
- Kiểm chứng tự động: `verify-uf10-assets.ps1` chạy hai bộ test Node, kiểm đủ tên file và kích thước PNG.
- Kết quả: `18 Light + 18 Dark`, toàn bộ `1440 × 1024`; continuity nhánh, thứ tự handoff và hai đơn vị tiết kiệm đều đạt.
- Rà trực quan: đã mở đủ 36 artboard để kiểm tra cắt chữ, bảng, tracker, nhãn nhánh, số liệu và tương phản. Lỗi selector làm badge nhánh 15–18 bị biến dạng đã có test hồi quy và được sửa trước khi xuất lại.
