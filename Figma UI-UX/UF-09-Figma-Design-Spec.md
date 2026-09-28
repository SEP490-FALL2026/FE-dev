# SaaS-Sentry — Đặc tả thiết kế Figma cho UF-09

> **Phiên bản:** 1.0 — 17/09/2026  
> **Trạng thái:** Đã hiện thực và kiểm chứng  
> **Hình thức bàn giao:** 32 ảnh PNG độc lập — 16 trạng thái Light và 16 trạng thái Dark; mỗi ảnh là một artboard desktop đầy đủ, không ghép contact sheet  
> **Phạm vi:** Desktop web 1440 × 1024; user flow `UF-09` — IT Admin xử lý nhân viên nghỉ việc  
> **Nguồn nghiệp vụ:** [BRD v3.11](../Requiments/BRD%20-%20HỆ%20THỐNG%20QUẢN%20TRỊ%20BẢN%20QUYỀN%20PHẦN%20MỀM%20%26%20TỐI%20ƯU%20CHI%20PHÍ%20CÔNG%20NGHỆ.md), [User Flows mục UF-09](../Diagrams/user-flows/index.md#1112-uf-09--it-admin-xử-lý-nhân-viên-nghỉ-việc), [UF-09.drawio](../Diagrams/user-flows/drawio/UF-09.drawio)  
> **Visual reference:** [ThemeDarkExample.jpg](ThemeDarkExample.jpg), [ThemeLightExample.jpg](ThemeLightExample.jpg), bộ ảnh `UF-07-FullFrames` và `UF-08-FullFrames`

## 1. Mục tiêu và nguyên tắc

Thiết kế một chuỗi màn hình liên tục để IT Admin xử lý offboarding từ lúc nhận thông báo nghỉ việc tới khi không còn seat gắn với nhân viên và dữ liệu hoạt động chi tiết được xóa theo chính sách. Giao diện phải cho thấy rõ ba vòng đời tách biệt: trạng thái nhân viên, Assignment nội bộ và ProvisioningTask phía nhà cung cấp.

Các nguyên tắc bắt buộc:

- Chỉ IT Admin được thực hiện thay đổi seat (`SoD-5`); Automation Service chỉ sinh G2 và tác vụ, không tự thu hồi (`SoD-6`).
- Trạng thái đã nghỉ việc bắt buộc có ngày làm việc cuối (`BR-05.3`, `FR-2.1`).
- Khi nhân viên còn là quản lý hoặc Business Owner, phải chỉ định người kế nhiệm; Business Owner không được để trống (`FR-1.7`, `INV-06`).
- Nếu có dữ liệu cần bàn giao, Manager phải xác nhận đã bàn giao trước khi IT thu hồi. Đây là nhánh điều kiện của `F-05`, được biểu diễn thành handoff có kiểm soát; IT không xác nhận thay Manager.
- Đăng ký thiết bị được lên lịch hết hiệu lực tại ngày làm việc cuối; endpoint từ chối dữ liệu gửi sau thời điểm đó (`FR-4.18`, `BR-45.7`, `INV-17`).
- G2 dùng dữ liệu nội bộ, độ tin cậy tuyệt đối, bỏ qua mọi ngưỡng ngày và không cần Manager xác nhận (`BR-05.1`, `BR-05.2`).
- Thu hồi hàng loạt bắt buộc gõ đúng số lượng và nhập lý do chung (`BR-05.4`).
- Assignment và ProvisioningTask không được gộp. Seat chỉ về trống sau khi có bằng chứng tài khoản đã bị xóa hoặc IT xác nhận không cần xóa (`ADR-07`, `BR-14.2`).
- Tiết kiệm phải ghi đúng loại: thực hiện ngay hoặc tại kỳ gia hạn (`BR-22.2`, `FR-4.15`).
- Sau 30 ngày kể từ ngày làm việc cuối, dữ liệu hoạt động chi tiết phải bị xóa thật; dữ liệu tổng hợp phi định danh và Audit Trail được giữ lại (`FR-10.6`, `BR-41.1`, `BR-41.3`).
- Light và Dark dùng cùng nội dung, số liệu, ID, timestamp, component tree và topology; chỉ semantic color token thay đổi.

## 2. Quyết định nguồn và phần làm rõ

BRD v3.11 là nguồn thẩm quyền nghiệp vụ. `index.md` và `.drawio` là tài liệu dẫn xuất. Thiết kế giữ topology chính của UF-09 và làm rõ ba điểm để giao diện có thể kiểm chứng:

1. **Xác nhận bàn giao:** `F-05` yêu cầu Manager xác nhận khi có dữ liệu cần bàn giao nhưng UF-09 chưa vẽ màn hình. Thiết kế thêm trạng thái chờ và trạng thái đã xác nhận, không thêm quyền cho IT.
2. **Thời điểm hết hiệu lực thiết bị:** node `s7` được hiểu là lập lịch `effective_to` bằng ngày làm việc cuối, không cắt thu thập khi nhân viên vẫn đang bàn giao.
3. **Bằng chứng theo từng seat:** vòng lặp `BR-14.2` được thể hiện theo từng ProvisioningTask. Seat có bằng chứng hợp lệ được nhả độc lập; seat chưa đủ bằng chứng tiếp tục chiếm chỗ.

Thiết kế không sửa BRD, `F-05`, `F-41`, `index.md` hoặc `.drawio`. Phần xác nhận bàn giao là chi tiết UI của ngoại lệ đã tồn tại, không phải yêu cầu nghiệp vụ mới.

## 3. Kiến trúc giao diện

UF-09 là **lifecycle workbench tuyến tính có handoff**, không phải một form đơn lẻ. Mỗi frame giữ cùng App Shell của UF-07/UF-08:

1. Sidebar SaaS-Sentry ở trái.
2. Top bar có tìm kiếm, thông báo, trợ giúp và tài khoản IT Admin.
3. Breadcrumb thay đổi theo module; mã `OFF-2026-044` chỉ xuất hiện từ frame 04 sau khi hồ sơ được tạo.
4. Header trang có mã frame, tên trạng thái, nhân viên và ngày làm việc cuối.
5. Stepper bảy bước cố định ở mọi frame.
6. Vùng trung tâm thể hiện màn hình hoặc dialog đang thao tác.
7. Panel phải giữ ngữ cảnh offboarding, số seat, blocker và Audit Timeline.

Stepper cố định:

```text
1 Hồ sơ → 2 Kế nhiệm → 3 Bàn giao → 4 Thu hồi →
5 Thực thi → 6 Bằng chứng → 7 Hoàn tất
```

Mọi frame phải hiển thị đủ `Bước n / 7`. Bước đã qua, hiện tại và chưa tới dùng icon, nhãn và mô tả; không chỉ đổi màu.

## 4. Sổ dữ liệu chuẩn xuyên suốt

### 4.1. Hồ sơ offboarding

| Trường | Giá trị cố định |
| --- | --- |
| Mã offboarding | `OFF-2026-044` |
| Nhân viên | Trần Minh · `NV-0174` |
| Email | `tran.minh@company.com` |
| Cost Center | Marketing · `CC-MKT-01` |
| Manager trực tiếp | Lê Thu Hà · `NV-0311` |
| Trạng thái đầu | Đang làm việc |
| Trạng thái trung gian | Đang bàn giao |
| Ngày làm việc cuối | 17/09/2026 |
| Khởi tạo bởi | IT Admin · `it-admin@company.com` |
| Thời điểm khởi tạo | 10/09/2026 · 09:12 ICT |
| Hạn bàn giao | 16/09/2026 · 17:00 ICT |
| Manager xác nhận bàn giao | Lê Thu Hà · 16/09/2026 · 16:42 ICT |

### 4.2. Quan hệ cần kế nhiệm

| Quan hệ | Trước offboarding | Người kế nhiệm | Có hiệu lực |
| --- | --- | --- | --- |
| Quản lý trực tiếp của 3 nhân viên | Trần Minh | Nguyễn Hoàng Long · `NV-0216` | 18/09/2026 |
| Business Owner của Figma Professional | Trần Minh | Lê Thu Hà · `NV-0311` | 18/09/2026 |

Ba nhân viên trực thuộc được giữ cố định trên mọi frame liên quan: Nguyễn Mai Anh `NV-0384`, Phạm Quốc Bảo `NV-0412`, Võ Gia Hân `NV-0461`.

### 4.3. Thiết bị công ty

| Trường | Giá trị |
| --- | --- |
| Device ID | `DEV-LT-0174` |
| Thiết bị | Dell Latitude 7440 |
| Đăng ký hiện tại | Active |
| `effective_to` | 17/09/2026 · 18:00 ICT |
| Dữ liệu sau mốc | Endpoint từ chối; ghi lý do `DEVICE_REGISTRATION_EXPIRED` |

### 4.4. Năm Assignment cần thu hồi

| # | Ứng dụng | Assignment | Subscription | Kênh | ProvisioningTask | Bằng chứng cuối |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Microsoft 365 E3 | `ASN-3868` | `SUB-M365-E3-01` | Connector | `PV-2043` | `MS365-EVT-771992` |
| 2 | Slack Business+ | `ASN-3869` | `SUB-SLK-BP-01` | Connector | `PV-2044` | `SLK-EVT-772011` |
| 3 | GitHub Business | `ASN-3870` | `SUB-GH-BIZ-01` | Connector | `PV-2045` | `GH-EVT-772086` |
| 4 | Zoom Pro | `ASN-3871` | `SUB-ZOOM-PRO-01` | Manual | `PV-2046` | `ZM-EVT-772733` |
| 5 | Figma Professional | `ASN-3872` | `SUB-FIG-PRO-02` | Manual | `PV-2042` | `FIG-EVT-772904` |

`PV-2042`, `ASN-3872`, `SUB-FIG-PRO-02`, `FIG-EVT-772904` và `OFF-2026-044` phải khớp bộ dữ liệu UF-08 hiện hành.

### 4.5. Ledger trạng thái

| Mốc | Seat còn gắn | Blocker kế nhiệm | Blocker bàn giao | G2 mở | Task đang mở | Seat đã nhả | Usage detail còn lại |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Frame 01–03 | 5 | 2 | 1 | 0 | 0 | 0 | 12.480 |
| Frame 04 | 5 | 2 | 1 | 0 | 0 | 0 | 12.480 |
| Frame 05 | 5 | 0 | 1 | 0 | 0 | 0 | 12.480 |
| Frame 06 | 5 | 0 | 1 | 0 | 0 | 0 | 12.480 |
| Frame 07 | 5 | 0 | 0 | 0 | 0 | 0 | 12.480 |
| Frame 08–10 | 5 | 0 | 0 | 5 | 0 | 0 | 12.480 |
| Frame 11 | 5 | 0 | 0 | 5 | 5 | 0 | 12.480 |
| Frame 12–13 | 1 | 0 | 0 | 1 | 1 | 4 | 12.480 |
| Frame 14–15 | 0 | 0 | 0 | 0 | 0 | 5 | 12.480 |
| Frame 16 | 0 | 0 | 0 | 0 | 0 | 5 | 0 |

Quy tắc ledger:

- G2 chỉ sinh khi nhân viên chuyển sang đã nghỉ việc vào ngày làm việc cuối.
- `Task đang mở` chỉ tăng sau khi IT xác nhận thu hồi hàng loạt.
- Mỗi seat chỉ chuyển từ `còn gắn` sang `đã nhả` khi task tương ứng có đủ bằng chứng `BR-14.2`.
- G2 của Assignment đóng cùng lúc seat được nhả; frame 12–13 còn đúng một G2 cho Figma.
- Usage detail không giảm dần; tác vụ ngày thứ 30 xóa thật toàn bộ 12.480 bản ghi thuộc người đã nghỉ.

### 4.6. Ledger tiết kiệm

| Loại | Giá trị demo | Ứng dụng | Thời điểm được ghi |
| --- | ---: | --- | --- |
| Có thể thực hiện ngay | 740.000 đ/tháng | Slack Business+, GitHub Business | Sau khi bằng chứng hợp lệ và điều khoản giảm giữa kỳ được áp dụng |
| Tại kỳ gia hạn | 13.200.000 đ/năm | Microsoft 365 E3, Figma Professional, Zoom Pro | Gắn với kỳ gia hạn tương ứng, không cộng vào tiết kiệm ngay |

Frame 08–13 chỉ được gọi các số trên là **ước tính theo loại**. Frame 14–15 mới ghi nhận kết quả sau bằng chứng và vẫn tách hai loại; không cộng thành một con số gây hiểu nhầm.

## 5. Danh sách 16 frame

| # | Bước | Tên frame | Màn hình | Nội dung và trạng thái cuối |
| ---: | ---: | --- | --- | --- |
| 01 | 1/7 | Danh sách nhân sự sắp nghỉ | `ITA-12` | Filter `Sắp nghỉ việc`; chọn Trần Minh; hiện 5 seat, 2 quan hệ cần kế nhiệm và 1 thiết bị |
| 02 | 1/7 | Hồ sơ và tác động offboarding | `ITA-12` | Hồ sơ, 5 Assignment, 3 cấp dưới, Figma Business Owner, thiết bị; CTA `Bắt đầu bàn giao` |
| 03 | 1/7 | Thiết lập ngày làm việc cuối | `ITA-13` dialog | Chọn `Đang bàn giao`, ngày 17/09/2026, hạn 16/09; ngày bắt buộc; xác nhận tạo `OFF-2026-044` |
| 04 | 2/7 | Kế hoạch offboarding đã tạo | `ITA-13` | Timeline, 5 seat, lịch hết hiệu lực thiết bị, 2 blocker kế nhiệm và 1 blocker bàn giao |
| 05 | 2/7 | Chỉ định người kế nhiệm | `ITA-14` | Chọn Nguyễn Hoàng Long cho 3 cấp dưới và Lê Thu Hà cho Figma; lưu lịch sử hiệu lực, blocker kế nhiệm về 0 |
| 06 | 3/7 | Chờ xác nhận bàn giao dữ liệu | Handoff trong `ITA-13` | Manager chưa xác nhận; IT chỉ được nhắc, không có CTA thu hồi; hiện checklist và hạn 16/09 |
| 07 | 3/7 | Bàn giao đã được xác nhận | `ITA-13` | Lê Thu Hà xác nhận lúc 16:42; mọi blocker bằng 0; thiết bị vẫn active tới 17/09 18:00; chờ ngày cuối |
| 08 | 4/7 | Sinh năm khuyến nghị G2 | `ITA-10` | Đến ngày cuối: nhân viên thành đã nghỉ; 5 G2 độ tin cậy tuyệt đối, bỏ qua ngưỡng ngày, không cần Manager xác nhận |
| 09 | 4/7 | Chọn thu hồi hàng loạt | `ITA-10` | Chọn đủ 5 G2; bảng tác động theo app, kênh, loại tiết kiệm; CTA `Thu hồi 5 seat` |
| 10 | 4/7 | Xác nhận thu hồi hàng loạt | `ITA-10` dialog | Bắt buộc gõ `5`; lý do `Nhân viên nghỉ việc · OFF-2026-044`; CTA bị khóa nếu sai số lượng hoặc thiếu lý do |
| 11 | 5/7 | Đã tạo tác vụ thực thi | `ITA-10` + handoff UF-08 | Tạo `PV-2042`–`PV-2046`; 5 seat vẫn chiếm chỗ; 3 Connector và 2 Manual; CTA mở hàng đợi UF-08 |
| 12 | 6/7 | Theo dõi bằng chứng thu hồi | `ITA-04` | Bốn task đủ bằng chứng và bốn seat đã nhả; Figma `PV-2042` còn chờ; ledger 4/5 |
| 13 | 6/7 | Bằng chứng Figma chưa đủ | `ITA-04` | Hiện thiếu mã tham chiếu/xác nhận người thật; seat Figma chưa trống; CTA mở `PV-2042` trong UF-08 |
| 14 | 6/7 | Đủ bằng chứng — nhả seat cuối | `ITA-04` | Nhận `FIG-EVT-772904`; seat Figma về trống; 5/5 G2 đóng; ghi tiết kiệm đúng loại |
| 15 | 7/7 | Không còn seat · chờ xóa dữ liệu | Summary | Không còn seat gắn với Trần Minh; hiển thị tiết kiệm tách loại; lịch xóa 12.480 bản ghi vào 17/10/2026 |
| 16 | 7/7 | Đã xóa dữ liệu sau 30 ngày | Compliance/Audit | Xóa thật 12.480 usage detail; giữ 5 dòng tổng hợp phi định danh và Audit Trail; tìm kiếm usage cá nhân trả rỗng |

Mỗi frame có hai ảnh đối xứng:

- `UF-09-Light-01.png` → `UF-09-Light-16.png`
- `UF-09-Dark-01.png` → `UF-09-Dark-16.png`

## 6. Hợp đồng chuyển màn

```text
01 Danh sách nhân sự
→ 02 Hồ sơ Trần Minh
→ 03 đặt ngày làm việc cuối
→ 04 kế hoạch + blocker
→ 05 chỉ định người kế nhiệm
→ 06 chờ Manager xác nhận bàn giao
→ 07 bàn giao đã xác nhận / chờ ngày cuối
→ 08 sinh 5 G2
→ 09 chọn 5 seat
→ 10 xác nhận bằng số lượng + lý do
→ 11 tạo 5 ProvisioningTask / handoff UF-08
→ 12 có 4/5 bằng chứng
→ 13 Figma chưa đủ bằng chứng / lặp UF-08
→ 14 Figma đủ bằng chứng / nhả seat cuối
→ 15 không còn seat / chờ lịch xóa
→ 16 tác vụ ngày thứ 30 xóa dữ liệu
```

Quy tắc continuity:

- `OFF-2026-044`, `NV-0174`, email, ngày làm việc cuối và device ID không đổi trên mọi frame.
- Stepper luôn có đúng bảy bước; số bước hiện tại chỉ tăng, không lùi.
- Timestamp tăng theo thứ tự và không vượt sự kiện phụ thuộc.
- Quan hệ kế nhiệm chỉ đổi sau frame 05 và có hiệu lực từ 18/09/2026; lịch sử cũ không bị ghi đè.
- Trạng thái bàn giao chỉ chuyển sang đã xác nhận ở frame 07 và ghi rõ Manager xác nhận.
- Trước frame 08 không có G2. Frame 08–10 có 5 G2 nhưng chưa có ProvisioningTask.
- Frame 11 mới có năm task; cả năm seat vẫn chiếm chỗ.
- Frame 12–13 là 4 seat trống, 1 seat còn chiếm; frame 14 mới là 5 seat trống.
- `PV-2042` giữ nguyên ID khi đi sang UF-08 và quay lại UF-09; không tạo task mới chỉ vì cập nhật bằng chứng.
- Frame 15 chưa được nói dữ liệu đã xóa; chỉ hiển thị lịch tác vụ. Frame 16 mới là end state xóa thật.
- Light và Dark có cùng text, ID, số liệu, thứ tự, timestamp, pagination và step state.

## 7. Hành vi và guard

### 7.1. Thiết lập offboarding

- Ngày làm việc cuối là trường bắt buộc và không được trước ngày khởi tạo nếu không bật nhánh `Nghỉ việc đột ngột`.
- Nhánh nghỉ việc đột ngột cho phép ngày cuối bằng ngày hiện tại nhưng vẫn phải xử lý kế nhiệm; chỉ bỏ giai đoạn chờ bàn giao khi xác nhận không có dữ liệu cần bàn giao.
- Đăng ký thiết bị nhận `effective_to`; không xóa bản ghi đăng ký.

### 7.2. Kế nhiệm và bàn giao

- Không cho chọn người đã nghỉ việc làm người kế nhiệm.
- Manager kế nhiệm và Business Owner thay thế có thể là cùng một Employee nhưng là hai quyết định riêng trong Audit Trail.
- IT không được tự đánh dấu `Manager đã xác nhận`.
- Nếu quá hạn bàn giao, giao diện cảnh báo và nhắc Manager; không tự xác nhận hoặc tự thu hồi.
- Nếu nhân viên không phải Manager/Business Owner, frame 05 dùng empty state `Không có quan hệ cần kế nhiệm` và chuyển tiếp; topology không đổi.

### 7.3. G2 và thu hồi hàng loạt

- G2 hiển thị nguồn `Nội bộ`, confidence `100%`, reason `Employee status = Terminated`.
- Không render CTA `Gửi Manager xác nhận` cho G2.
- Bulk action chỉ nhận các Assignment của cùng `OFF-2026-044`.
- Xác nhận yêu cầu chuỗi gõ đúng `5`, không dùng checkbox đơn thuần.
- Lý do chung được sao chép vào từng quyết định thu hồi nhưng mỗi task vẫn có Audit Trail riêng.

### 7.4. ProvisioningTask và bằng chứng

- Tạo task không làm seat trống.
- Kênh Connector và Manual dùng cùng điều kiện hoàn tất: bằng chứng tài khoản thật đã bị xóa hoặc IT xác nhận có cấu trúc rằng không cần xóa.
- Phản hồi API thành công nhưng trạng thái nhà cung cấp chưa xác minh không đủ để nhả seat.
- Task thất bại hoặc chờ bằng chứng không biến mất khỏi frame 12–13.
- Mỗi task đủ bằng chứng được phép nhả Assignment tương ứng; không cần chờ cả batch.

### 7.5. Lưu giữ và xóa dữ liệu

- Frame 15 hiển thị ngày dự kiến 17/10/2026 và loại dữ liệu sẽ xóa/giữ.
- Frame 16 ghi số bản ghi đã xóa, thời điểm, job ID và Audit event; không hiển thị nội dung dữ liệu đã xóa.
- Tìm kiếm usage theo `NV-0174` trả rỗng sau frame 16.
- Dữ liệu tổng hợp giữ lại phải dùng nhãn `Đã phi định danh`, không hiển thị employee ID hoặc email.
- Audit Trail chỉ ghi thêm và không bị xóa theo tác vụ này (`INV-05`, `BR-41.3`).

## 8. Visual system

### 8.1. Kích thước và mật độ

| Thuộc tính | Giá trị |
| --- | --- |
| Frame | `1440 × 1024 px` |
| Sidebar | `224 px` |
| Topbar | `64 px` |
| Content gutter | `24 px` |
| Stepper | 7 bước, cao `72–80 px` |
| Main content | 12-column grid |
| Context panel | `280 px` khi có |
| Table row | `56–72 px` |
| Card radius | `12–16 px` |
| Input/Button radius | `10 px` |
| Border | `1 px` |
| Font | Inter; fallback `Segoe UI`, sans-serif |

### 8.2. Semantic color tokens

| Token | Dark | Light | Vai trò |
| --- | --- | --- | --- |
| `color/bg/canvas` | `#07182D` | `#FFF9F2` | Nền trang |
| `color/bg/sidebar` | `#061426` | `#FFF4E8` | Sidebar |
| `color/bg/surface` | `#0D223A` | `#FFFFFF` | Card, panel, dialog |
| `color/bg/subtle` | `#102943` | `#FFFAF4` | Table header, group, hover |
| `color/border/default` | `#213D5C` | `#EFDDCA` | Border trung tính |
| `color/text/primary` | `#F5F9FF` | `#2B241F` | Nội dung chính |
| `color/text/secondary` | `#91A8C2` | `#897568` | Metadata/helper |
| `color/action/primary` | `#2D86FF` | `#FF7417` | CTA, active nav, focus |

Success, Warning, Danger và Info là token ngữ nghĩa độc lập. G2 dùng Danger/Warning cho mức cần xử lý nhưng không dùng màu làm bằng chứng duy nhất. Trạng thái luôn có icon, label và mô tả.

## 9. Component inventory

| Nhóm | Component và variants |
| --- | --- |
| Shell | `AppShell`, `SidebarItem`, `Topbar`, `Breadcrumb`, `UserMenu` |
| Lifecycle | `OffboardingStepper`, `StepState`, `CaseHeader`, `OffboardingTimeline` |
| Employee | `EmployeeQueue`, `EmployeeProfileCard`, `EmploymentStatusBadge`, `ImpactSummary` |
| Succession | `SuccessorAssignment`, `DirectReportList`, `BusinessOwnerTransfer`, `EffectiveDate` |
| Handover | `HandoverChecklist`, `ManagerConfirmation`, `DeadlineAlert`, `ReminderAction` |
| Device | `ManagedDeviceCard`, `RegistrationSchedule`, `IngestionGuardStatus` |
| Recommendation | `G2Card`, `ConfidenceBadge`, `BulkSelection`, `SavingsType` |
| Execution | `ProvisioningTaskList`, `ChannelBadge`, `UF08Handoff`, `EvidenceProgress` |
| Evidence | `EvidenceCard`, `InsufficientEvidence`, `SeatReservationBanner`, `ReleaseSummary` |
| Retention | `DeletionSchedule`, `DeletionJobResult`, `AnonymizedDataSummary`, `AuditTimeline` |
| Overlay | `StartOffboardingDialog`, `BulkRevokeDialog` |
| Feedback | Alert, Badge, Toast, Progress, Empty/Blocked State |
| Action | Primary, Secondary, Ghost, Danger; Default/Hover/Focus/Disabled/Loading |

## 10. Nội dung bắt buộc theo vùng

### 10.1. Header và stepper

- Tên nhân viên, mã case, ngày làm việc cuối và badge trạng thái.
- `Bước n / 7` và đủ bảy nhãn bước.
- Không dùng số frame làm số bước; frame 01–03 đều là bước 1/7.

### 10.2. Panel ngữ cảnh offboarding

- `OFF-2026-044`, `NV-0174`, Cost Center, Manager.
- Số seat còn gắn/đã nhả.
- Blocker kế nhiệm và bàn giao.
- Device registration và thời điểm hết hiệu lực.
- Audit event gần nhất.

### 10.3. Hàng G2

- Ứng dụng, Assignment, Subscription.
- Nguồn nội bộ, confidence 100%, lý do đã nghỉ việc.
- Kênh thu hồi dự kiến.
- Tiết kiệm có thể ngay hoặc tại kỳ gia hạn.
- Trạng thái bằng chứng và seat còn chiếm chỗ hay đã nhả.

### 10.4. Bằng chứng

- ProvisioningTask ID và kênh.
- Loại bằng chứng, mã tham chiếu, người xác nhận, thời điểm.
- Provider/account status đã xác minh.
- Guard `BR-14.2` và lý do nếu chưa đủ.
- Assignment chỉ chuyển trạng thái sau khi Audit event được ghi.

## 11. Accessibility và nội dung

- Text và control quan trọng đạt WCAG AA ở cả hai theme.
- Focus ring 2 px; thứ tự tab đi theo stepper → nội dung chính → hành động → panel ngữ cảnh.
- Stepper có text `Hoàn tất`, `Hiện tại`, `Chưa tới`; không chỉ dùng màu hoặc dấu chấm.
- Label không bị thay bằng placeholder.
- Selected row có border, icon và trạng thái; không chỉ đổi background.
- Bulk dialog giữ focus; Escape chỉ đóng khi chưa thực hiện hành động phá hủy.
- Disabled CTA luôn kèm lý do, ví dụ `Đang chờ Manager xác nhận bàn giao`.
- Dùng động từ và kết quả: `Bắt đầu bàn giao`, `Lưu người kế nhiệm`, `Thu hồi 5 seat`, `Mở tác vụ PV-2042`.
- Không dùng `Hoàn tất` cho case khi còn seat hoặc dữ liệu chưa tới hạn xóa; frame 15 ghi `Offboarding hoàn tất · chờ xóa dữ liệu`, frame 16 ghi `Đã xóa dữ liệu theo lịch`.
- Tên sản phẩm là SaaS-Sentry; không mang thương hiệu LicenseHub từ ảnh tham chiếu.

## 12. Cấu trúc đầu ra dự kiến

```text
Figma UI-UX/
├── UF-09-Figma-Design-Spec.md
├── UF-09-Sources/
│   ├── uf09.html
│   ├── uf09.css
│   ├── uf09-data.js
│   ├── uf09-renderer.js
│   ├── uf09-data.test.js
│   ├── uf09-renderer.test.js
│   ├── capture-uf09.ps1
│   └── verify-uf09-assets.ps1
└── UF-09-FullFrames/
    ├── Light/
    │   ├── UF-09-Light-01.png
    │   └── ... UF-09-Light-16.png
    └── Dark/
        ├── UF-09-Dark-01.png
        └── ... UF-09-Dark-16.png
```

Không tạo storyboard ghép chung. Mỗi PNG là một canvas desktop đầy đủ.

## 13. Tiêu chí nghiệm thu

1. Có đúng 16 PNG Light và 16 PNG Dark, mỗi file `1440 × 1024`.
2. Không có contact sheet thay cho ảnh riêng.
3. Hai theme có cùng ID, số liệu, timestamp, thứ tự, nội dung, topology và step state.
4. Stepper luôn có bảy bước; mapping frame → bước đúng bảng mục 5 và không lùi bước.
5. `OFF-2026-044`, Trần Minh `NV-0174` và năm Assignment giữ nguyên xuyên suốt.
6. Kế nhiệm đóng đủ hai blocker và giữ lịch sử hiệu lực.
7. Manager xác nhận bàn giao; IT không có hành động xác nhận thay.
8. Đăng ký thiết bị hết hiệu lực đúng ngày cuối, không bị cắt ngay khi bắt đầu bàn giao.
9. G2 chỉ sinh ở ngày cuối, có confidence 100%, bỏ qua ngưỡng và không qua Manager xác nhận.
10. Bulk revoke yêu cầu gõ đúng `5` và lý do chung.
11. Frame 11 có năm ProvisioningTask nhưng năm seat vẫn chiếm chỗ.
12. Frame 12–13 có đúng bốn seat đã nhả và Figma vẫn chiếm chỗ; frame 14 mới là 5/5.
13. `PV-2042` và bằng chứng `FIG-EVT-772904` khớp dữ liệu UF-08.
14. Tiết kiệm luôn tách `ngay` và `tại kỳ gia hạn`; không cộng hai loại thành một tổng giả.
15. Frame 15 chỉ lập lịch xóa; frame 16 mới xóa thật 12.480 bản ghi và giữ Audit Trail.
16. Không cắt chữ, chồng lớp hoặc tràn bảng khi xem ảnh ở 100%.
17. Mọi trạng thái có text/icon; không phụ thuộc duy nhất vào màu.
18. Renderer tests kiểm registry, ledger, step mapping, guard quyền, continuity UF-08 và theme parity.
19. Script verify kiểm số file, tên file, kích thước và metadata nguồn.

## 14. Truy vết nguồn

| Thiết kế | Nguồn |
| --- | --- |
| IT là bên duy nhất thay đổi seat | `SoD-5`, `FR-2.4` |
| Automation không tự thu hồi | `SoD-6` |
| Ngày làm việc cuối bắt buộc | `BR-05.3`, `FR-2.1` |
| Business Owner không được trống | `FR-1.7`, `INV-06` |
| Manager xác nhận bàn giao khi có dữ liệu | User Flows `F-05`, mục ngoại lệ |
| G2 nội bộ, confidence tuyệt đối | BRD mục 5.4.1, `BR-05.1` |
| G2 không qua Manager xác nhận | `BR-05.2` |
| Bulk revoke gõ số lượng + lý do | `BR-05.4` |
| Assignment tách ProvisioningTask | `FR-2.5`, `ADR-07` |
| Seat chỉ trống khi đủ bằng chứng | `BR-14.2`, UF-09 node `d2` |
| Tiết kiệm đúng loại | `BR-22.2`, `FR-4.15` |
| Thiết bị hết hiệu lực khi nhân viên nghỉ | `FR-4.18`, `BR-45.7`, `INV-17` |
| Xóa usage detail sau 30 ngày | `FR-10.6`, `BR-41.1` |
| Giữ dữ liệu phi định danh và Audit Trail | `BR-41.2`, `BR-41.3`, `INV-05` |
| Quyết định có Audit Trail | Quy tắc chung User Flows mục 0.3; `FR-8.3` |

## 15. Phần không được tự suy diễn

- Không cho Automation Service tự thu hồi seat khi tới ngày cuối.
- Không cho IT tự xác nhận thay Manager về việc bàn giao dữ liệu.
- Không cắt thu thập thiết bị trước ngày làm việc cuối chỉ vì case chuyển sang đang bàn giao.
- Không để Business Owner rỗng hoặc chọn người đã nghỉ việc làm người kế nhiệm.
- Không gửi G2 tới Manager để xác nhận.
- Không coi việc tạo ProvisioningTask hoặc phản hồi API thành công là bằng chứng đã xóa tài khoản.
- Không nhả cả batch khi vẫn còn một task thiếu bằng chứng.
- Không tạo `PV-2042` mới khi quay lại từ UF-08.
- Không ghi tiết kiệm ước tính thành tiết kiệm đã thực hiện.
- Không xóa Audit Trail cùng usage detail.
- Không khẳng định mốc 30 ngày là kết luận tuân thủ pháp lý; đây là quyết định thiết kế của dự án theo BRD.
- Không sửa BRD, `index.md` hoặc `.drawio` trong hạng mục visual UF-09.

## 16. Kiểm chứng hiện thực

### 16.1. Kiểm chứng dữ liệu

- Test registry có đúng ID `01`–`16`, không trùng hoặc thiếu.
- Test tất cả screen trỏ tới ledger tồn tại.
- Test mapping bước: `01–03 → 1`, `04–05 → 2`, `06–07 → 3`, `08–10 → 4`, `11 → 5`, `12–14 → 6`, `15–16 → 7`.
- Test số bước chỉ tăng và mọi frame có `totalSteps = 7`.
- Test năm Assignment, Subscription và ProvisioningTask không đổi giữa frame.
- Test frame trước 08 có `g2Open = 0`; frame 08–10 có `g2Open = 5`.
- Test frame 11 có `tasksOpen = 5`, `seatReleased = 0`.
- Test frame 12–13 có `seatAttached = 1`, `seatReleased = 4`, task mở duy nhất là `PV-2042`.
- Test frame 14–16 có `seatAttached = 0`, `seatReleased = 5`.
- Test frame 15 có `usageDetail = 12480`, frame 16 có `usageDetail = 0`.
- Test frame 06 không render hành động `confirm-handover-as-it` hoặc `bulk-revoke`.
- Test frame 10 khóa CTA khi typed count khác `5` hoặc lý do rỗng.
- Test continuity `PV-2042` với dữ liệu UF-08 nếu module UF-08 được nạp trong Node test.

### 16.2. Kiểm chứng ảnh

- Xuất từng route `?theme=<light|dark>&screen=<01..16>` bằng Chrome headless.
- Preflight yêu cầu `data-render-ready=true` và `data-overflow=false`.
- Kiểm đúng 32 file và kích thước `1440 × 1024`.
- So metadata nội dung giữa cặp Light/Dark của cùng screen.
- Mở trực tiếp toàn bộ 16 frame Light và 16 frame Dark; kiểm chữ cắt, overflow, overlap, contrast, stepper và trạng thái disabled.
- Walkthrough ba nhánh: cần kế nhiệm, chờ bàn giao, thiếu bằng chứng rồi quay lại UF-08.
- Chạy lại kiểm chứng sau mỗi thay đổi renderer, CSS hoặc dữ liệu chuẩn.

## 17. Ranh giới bàn giao

Bản hiện thực là renderer HTML/CSS/JS cục bộ và 32 PNG độc lập, theo convention UF-07/UF-08. Đây là visual handoff có thể dùng làm đầu vào Figma; không phải component library hoặc prototype Figma editable vì chưa có file Figma cloud và chưa kiểm chứng layer/component trực tiếp trong Figma.

## 18. Artefact và lệnh tái tạo

- Nguồn renderer: [`UF-09-Sources`](UF-09-Sources/).
- 16 artboard Light: [`UF-09-FullFrames/Light`](UF-09-FullFrames/Light/).
- 16 artboard Dark: [`UF-09-FullFrames/Dark`](UF-09-FullFrames/Dark/).
- Tất cả ảnh đã được mở kiểm tra trực quan theo flow; các mốc 01–16, stepper, ledger, dialog, trạng thái vô hiệu hóa và tương phản Light/Dark không bị cắt hoặc chồng lấn.
- Test hồi quy bảo vệ trạng thái nháp trước khi tạo `OFF-2026-044`, quyền xác nhận bàn giao của Manager, dòng thời gian Audit, vòng lặp bằng chứng `PV-2042` và việc chỉ xóa usage detail tại frame 16.

Tái tạo ảnh:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\Figma UI-UX\UF-09-Sources\capture-uf09.ps1" -RootPath "."
```

Kiểm chứng toàn bộ:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\Figma UI-UX\UF-09-Sources\verify-uf09-assets.ps1" -RootPath "."
```

Kết quả cuối: `PASS UF-09 assets: 16 Light + 16 Dark PNGs, all 1440x1024; canonical state and guarded transitions verified.`
