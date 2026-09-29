# SaaS-Sentry — Đặc tả thiết kế Figma cho UF-08

> **Phiên bản:** 1.0 — 17/09/2026  
> **Trạng thái:** Đã hiện thực và kiểm chứng  
> **Hình thức bàn giao:** 32 ảnh PNG độc lập — 16 trạng thái Light và 16 trạng thái Dark; mỗi ảnh là một artboard desktop đầy đủ, không ghép contact sheet  
> **Phạm vi:** Desktop web 1440 × 1024; user flow `UF-08` — IT Admin xử lý hàng đợi cấp phát  
> **Nguồn nghiệp vụ:** [BRD v3.11](../Requiments/BRD%20-%20HỆ%20THỐNG%20QUẢN%20TRỊ%20BẢN%20QUYỀN%20PHẦN%20MỀM%20%26%20TỐI%20ƯU%20CHI%20PHÍ%20CÔNG%20NGHỆ.md), [User Flows mục UF-08](../Diagrams/user-flows/index.md#1111-uf-08--it-admin-xử-lý-hàng-đợi-cấp-phát), [UF-08.drawio](../Diagrams/user-flows/drawio/UF-08.drawio)  
> **Visual reference:** [ThemeDarkExample.jpg](ThemeDarkExample.jpg), [ThemeLightExample.jpg](ThemeLightExample.jpg), bộ ảnh `UF-07-FullFrames`

## 1. Mục tiêu và nguyên tắc

Thiết kế một workbench giúp IT Admin theo dõi và xử lý `ProvisioningTask` qua cả kênh tự động và thủ công, không đánh đồng quyết định cấp quyền với bằng chứng tài khoản đã tồn tại hoặc đã bị xóa phía nhà cung cấp.

Các nguyên tắc bắt buộc:

- `Assignment` ghi nhận quyền đã được tổ chức quyết định; `ProvisioningTask` ghi nhận thao tác thật phía nhà cung cấp. Hai vòng đời không được gộp (`ADR-07`, BRD mục 5.12.3).
- Tác vụ thủ công chỉ hoàn tất sau khi người thật xác nhận và cung cấp bằng chứng (`BR-10.1`).
- API trả thành công nhưng mới tạo lời mời `pending` không phải cấp phát hoàn tất; tác vụ chuyển sang `Chờ chấp nhận` và được UF-14 đối soát (`QĐ-03`).
- Assignment vẫn chiếm chỗ trong lúc đang thực thi, chờ chấp nhận hoặc thất bại (`BR-10.4`).
- Lỗi tạm thời được retry tối đa sáu lần với giãn cách tăng dần; lỗi vĩnh viễn và lỗi xác thực không được tự retry (`BR-12.1`).
- Tác vụ thất bại không biến mất; phải có quyết định của người thật và Audit Trail (`BR-12.2`, `BR-12.3`).
- Hết hạn mức license quay lại nhánh mua thêm suất. Người duyệt chi quyết; Finance ghi nhận song song và không chặn IT tiếp tục (`FR-3.4`, `FR-3.14`, `QĐ-29b`).
- Light và Dark dùng cùng nội dung, số liệu, component tree và trạng thái; chỉ semantic color token thay đổi.

## 2. Quyết định nguồn và cách xử lý khoảng trống của sơ đồ

BRD v3.11 là nguồn thẩm quyền nghiệp vụ. `index.md` và `.drawio` là tài liệu dẫn xuất. Thiết kế giữ topology chính của UF-08 nhưng làm rõ ba điểm mà sơ đồ hiện tại chưa biểu diễn kín:

1. **Hết lần retry:** cạnh retry không lặp vô hạn. Sau lần thứ sáu vẫn thất bại, tác vụ quay về hàng đợi `Thất bại` và chờ quyết định của người thật.
2. **Lỗi không được retry:** frame dành cho lỗi vĩnh viễn/xác thực không hiển thị hành động `Thử lại`; chỉ cho sửa kết nối, chuyển làm tay hoặc đóng kèm lý do tùy loại lỗi.
3. **Mua thêm suất:** sau khi được duyệt và mua thêm, tác vụ quay lại hàng đợi IT. Finance ghi nhận khoản cam kết song song, không phải bước mà IT phải chờ.

Đặc tả này không sửa BRD, `index.md` hoặc `.drawio`. Ba điểm trên phải được ghi nhận khi tài liệu user flow được đồng bộ ở một hạng mục riêng.

## 3. Kiến trúc giao diện

UF-08 dùng **Provisioning Workbench**, không dùng wizard tuyến tính. Một `ProvisioningTask` có thể đổi nhóm nhiều lần và đi vào nhánh đối soát, retry, thủ công hoặc duyệt mua thêm; stepper chung sẽ diễn đạt sai vòng đời.

Bố cục cố định trên cả 16 frame:

1. Sidebar sản phẩm bên trái, giữ shell SaaS-Sentry của UF-07.
2. Topbar có tìm kiếm, thông báo, trợ giúp và tài khoản IT Admin.
3. Breadcrumb: `Quyền truy cập → Hàng đợi thực thi → <mã tác vụ>`.
4. Header trang `Hàng đợi thực thi cấp phát`, kèm nguồn lọc và thời điểm cập nhật.
5. Bốn metric loại trừ nhau: `Cần làm tay`, `Đang chạy tự động`, `Chờ chấp nhận`, `Thất bại`; thêm số phụ `Hoàn tất hôm nay`.
6. Cột trái là danh sách tác vụ, tab và bộ lọc theo loại thao tác `Cấp quyền` / `Thu hồi`.
7. Vùng trung tâm là chi tiết tác vụ, trạng thái thực thi, bằng chứng và hành động.
8. Panel phải giữ ngữ cảnh Request/nguồn quyết định, Assignment, Subscription, người thụ hưởng và Audit Timeline.
9. Banner cố định nhắc Assignment vẫn chiếm chỗ cho tới khi có bằng chứng hoàn tất hoặc quyết định hợp lệ.

Dialog xác nhận vẫn được xuất thành ảnh toàn màn riêng với scrim để mỗi trạng thái bàn giao là một PNG độc lập.

## 4. Sổ dữ liệu chuẩn xuyên suốt

### 4.1. Ledger hàng đợi

Bốn metric là các nhóm loại trừ nhau. `Chờ chấp nhận` không nằm trong `Đang chạy tự động`.

| Mốc         | Cần làm tay | Tự động | Chờ chấp nhận | Thất bại | Hoàn tất hôm nay | Sự kiện                                                        |
| ----------- | ----------: | ------: | ------------: | -------: | ---------------: | -------------------------------------------------------------- |
| Frame 01–03 |           8 |       4 |             2 |        3 |               12 | Baseline; `PV-2041` chuẩn bị và chạy connector                 |
| Frame 04–05 |           8 |       3 |             3 |        3 |               12 | `PV-2041`: tự động → chờ chấp nhận                             |
| Frame 06–08 |           8 |       3 |             3 |        3 |               12 | `PV-2042` đang được xử lý thủ công                             |
| Frame 09–10 |           7 |       3 |             3 |        3 |               13 | `PV-2042` hoàn tất có bằng chứng                               |
| Frame 11    |           7 |       4 |             3 |        2 |               13 | `PV-2037`: thất bại → đang retry tự động                       |
| Frame 12    |           7 |       3 |             3 |        3 |               13 | Retry lần sáu vẫn lỗi                                          |
| Frame 13–15 |           8 |       3 |             3 |        2 |               13 | `PV-2037` chuyển sang làm tay; `PV-2039` vẫn chờ mua thêm suất |
| Frame 16    |           8 |       4 |             3 |        1 |               13 | `PV-2039` được mua thêm suất và quay lại thực thi tự động      |

Mọi frame Light/Dark phải lấy dữ liệu từ cùng một object nguồn; không sao chép số liệu riêng theo theme.

### 4.2. Tác vụ chuẩn

| Task      | Thao tác  | Ứng dụng           | Đối tượng                  | Kênh               | Trạng thái được trình bày                               |
| --------- | --------- | ------------------ | -------------------------- | ------------------ | ------------------------------------------------------- |
| `PV-2041` | Cấp quyền | GitHub Business    | Nguyễn Minh An · `NV-0248` | Connector          | Chuẩn bị → chạy → lời mời `pending` → bàn giao UF-14    |
| `PV-2042` | Thu hồi   | Figma Professional | Trần Minh · `NV-0174`      | Manual             | Chưa nhận → đang xử lý → xác nhận bằng chứng → hoàn tất |
| `PV-2037` | Cấp quyền | GitHub Business    | Lê Thu Hà · `NV-0311`      | Connector → Manual | Lỗi tạm thời → retry 6/6 → chuyển làm tay               |
| `PV-2038` | Cấp quyền | Figma Professional | Phạm Quang · `NV-0293`     | Connector          | Lỗi xác thực; không retry                               |
| `PV-2039` | Cấp quyền | Slack Business+    | Đoàn Anh · `NV-0276`       | Connector          | Hết hạn mức → duyệt mua thêm → quay lại IT              |

### 4.3. Định danh nghiệp vụ dùng trong panel

| Task      | Nguồn quyết định    | Assignment | Subscription     | Correlation ID  |
| --------- | ------------------- | ---------- | ---------------- | --------------- |
| `PV-2041` | `REQ-2026-0917-084` | `ASN-4901` | `SUB-GH-BIZ-01`  | `COR-7A91-2041` |
| `PV-2042` | `OFF-2026-044`      | `ASN-3872` | `SUB-FIG-PRO-02` | `COR-2D44-2042` |
| `PV-2037` | `REQ-2026-0916-219` | `ASN-4894` | `SUB-GH-BIZ-01`  | `COR-1C73-2037` |
| `PV-2038` | `REQ-2026-0916-228` | `ASN-4895` | `SUB-FIG-PRO-02` | `COR-63BE-2038` |
| `PV-2039` | `REQ-2026-0916-241` | `ASN-4897` | `SUB-SLK-BP-01`  | `COR-8F20-2039` |

### 4.4. Ledger hạn mức cho `PV-2039`

| Mốc          | Nội bộ    | Nhà cung cấp | Diễn giải                                                                                |
| ------------ | --------- | ------------ | ---------------------------------------------------------------------------------------- |
| Trước duyệt  | `49 / 50` | `50 / 50`    | Nội bộ dự kiến còn một suất nhưng nhà cung cấp báo đã hết; tác vụ chưa hoàn tất          |
| Sau mua      | `50 / 51` | `50 / 51`    | Assignment đang giữ một suất; nhà cung cấp đã tăng hạn mức nhưng tài khoản chưa được cấp |
| Sau cấp thật | `50 / 51` | `51 / 51`    | Chỉ ghi mốc này khi có bằng chứng nhà cung cấp; nằm ngoài frame 16                       |

Không frame nào được hiển thị `51 / 51` như kết quả đã cấp ngay sau quyết định mua thêm.

## 5. Danh sách 16 frame

| #   | Tên frame                      | Task trọng tâm | Nội dung và trạng thái cuối                                                                                           |
| --- | ------------------------------ | -------------- | --------------------------------------------------------------------------------------------------------------------- |
| 01  | Tổng quan hàng đợi thực thi    | Toàn hàng đợi  | Bốn metric, phân bố theo ứng dụng/kênh, tác vụ cũ nhất và cảnh báo `BR-10.4`; chưa thay đổi ledger                    |
| 02  | Chi tiết tác vụ tự động        | `PV-2041`      | Request đã đủ duyệt, Assignment đang giữ chỗ, connector GitHub sẵn sàng; CTA `Thực thi ngay`                          |
| 03  | Connector đang thực thi        | `PV-2041`      | Attempt `1/6`, idempotency key, endpoint, thời điểm bắt đầu; hành động thay đổi bị khóa khi worker đang chạy          |
| 04  | Lời mời đã gửi — chờ chấp nhận | `PV-2041`      | Phản hồi API thành công nhưng membership `pending`; ledger `Tự động 4→3`, `Chờ chấp nhận 2→3`                         |
| 05  | Bàn giao đối soát              | `PV-2041`      | End state có kiểm soát: chưa hoàn tất, seat vẫn chiếm chỗ; CTA `Mở đối soát UF-14` và xem Audit Trail                 |
| 06  | Chi tiết tác vụ thủ công       | `PV-2042`      | Hướng dẫn thu hồi Figma, nguồn quyết định offboarding, chưa có người nhận; CTA `Tôi đang xử lý`                       |
| 07  | IT Admin đã nhận xử lý         | `PV-2042`      | Người nhận `IT Admin`, timestamp `17/09/2026 · 10:21 ICT`, checklist thao tác và liên kết trang quản trị nhà cung cấp |
| 08  | Xác nhận hoàn tất thủ công     | `PV-2042`      | Dialog yêu cầu loại bằng chứng, mã tham chiếu, ghi chú và người xác nhận; không cho xác nhận khi thiếu bằng chứng     |
| 09  | Thu hồi thủ công hoàn tất      | `PV-2042`      | Có bằng chứng tài khoản đã bị xóa; seat mới về trống; ledger `Manual 8→7`, `Hoàn tất 12→13`                           |
| 10  | Hàng đợi thất bại              | Toàn hàng đợi  | Bốn loại lỗi, thông báo tiếng Việt, mã kỹ thuật chỉ trong drawer; `PV-2037`, `PV-2038`, `PV-2039` cùng hiện           |
| 11  | Lỗi tạm thời đang retry        | `PV-2037`      | Attempt `3/6`, lần kế tiếp `10:36 ICT`, backoff và lịch sử phản hồi; ledger tạm thời `Failed 3→2`, `Auto 3→4`         |
| 12  | Đã hết sáu lần retry           | `PV-2037`      | Attempt `6/6` vẫn lỗi; tự động dừng; task quay về `Thất bại`; không còn lịch chạy kế tiếp                             |
| 13  | Chuyển sang làm thủ công       | `PV-2037`      | Dialog xác nhận chuyển kênh trên chính task; giữ sáu attempt; ledger `Failed 3→2`, `Manual 7→8`                       |
| 14  | Lỗi xác thực — không retry     | `PV-2038`      | Connector Figma hết hạn; CTA `Sửa kết nối`, `Chuyển làm tay`, `Đóng kèm lý do`; không có CTA retry                    |
| 15  | Hết hạn mức license            | `PV-2039`      | Hiện snapshot nội bộ/nhà cung cấp, trạng thái chờ Người duyệt chi; Finance không phải approver và không chặn IT       |
| 16  | Đã mua thêm — trở lại thực thi | `PV-2039`      | Hạn mức `51`, task quay lại tự động; Finance ghi nhận song song; ledger `Failed 2→1`, `Auto 3→4`; chưa cộng hoàn tất  |

Mỗi frame có hai ảnh đối xứng Light/Dark với tên:

- `UF-08-Light-01.png` → `UF-08-Light-16.png`
- `UF-08-Dark-01.png` → `UF-08-Dark-16.png`

## 6. Hành vi và chuyển trạng thái

### 6.1. Kênh tự động và lời mời pending

```text
PV-2041 · Đang chạy tự động
→ API nhận yêu cầu thành công
→ membership = pending
→ Chờ chấp nhận
→ handoff UF-14
```

- Frame 04 không dùng từ `Hoàn tất` trong tiêu đề, badge hoặc toast.
- Panel bằng chứng phân biệt `API response`, `Membership status` và `Reconciliation result`.
- Frame 05 là kết thúc của UF-08 nhưng không phải kết thúc của `ProvisioningTask`.

### 6.2. Kênh thủ công

```text
PV-2042 · Cần làm tay
→ IT Admin nhận việc
→ thao tác ở trang quản trị Figma
→ nhập bằng chứng
→ người thật xác nhận
→ Hoàn tất
```

- Tên người nhận và người xác nhận lấy từ phiên đăng nhập, chỉ đọc.
- Xác nhận yêu cầu ít nhất một bằng chứng: mã sự kiện nhà cung cấp, ảnh/chứng từ hoặc ghi chú kiểm chứng có cấu trúc.
- Thu hồi chỉ trả seat về trống sau frame 09.

### 6.3. Retry lỗi tạm thời

```text
PV-2037 · Thất bại tạm thời
→ Retry attempt 3/6
→ ...
→ Retry attempt 6/6 vẫn lỗi
→ dừng tự động
→ người thật chọn chuyển làm tay
```

- Mỗi attempt có timestamp, loại lỗi và thời điểm thử kế tiếp.
- Sau lần sáu, `nextAttemptAt` phải rỗng và giao diện không còn trạng thái `Đang lên lịch`.
- Chuyển làm tay không tạo ID mới, không xóa lịch sử connector.

### 6.4. Lỗi vĩnh viễn và lỗi xác thực

- Lỗi xác thực ưu tiên `Sửa kết nối`; có thể chuyển làm tay khi nghiệp vụ cho phép.
- Lỗi vĩnh viễn cho phép chuyển làm tay hoặc đóng kèm lý do.
- Không có nút `Thử lại` trên frame 14.
- Mã kỹ thuật nằm trong phần `Chi tiết kỹ thuật`, không đặt trong thông báo chính cho người dùng cuối (`BR-12.4`).

### 6.5. Hết hạn mức license

```text
PV-2039 · Hết hạn mức
→ Người duyệt chi quyết mua thêm
→ hệ thống cập nhật hạn mức và khoản cam kết
→ song song:
   ├─ Finance ghi nhận
   └─ PV-2039 trở lại hàng đợi IT
```

- Frame 15 chỉ đọc trạng thái duyệt, không cho IT tự mua hoặc tự duyệt.
- Frame 16 thể hiện hai nhánh song song bằng hai activity item độc lập.
- IT không chờ Finance ghi nhận xong mới tiếp tục.

## 7. Trạng thái, guard và phản hồi

| Tình huống                     | Cách trình bày                              | Hành động hợp lệ                               |
| ------------------------------ | ------------------------------------------- | ---------------------------------------------- |
| Worker đang chạy               | Progress + khóa hành động làm thay đổi task | Xem log; không chạy trùng                      |
| API thành công nhưng `pending` | Info/Warning, không dùng Success end state  | Mở đối soát UF-14                              |
| Manual chưa có người nhận      | Badge `Chưa nhận`                           | `Tôi đang xử lý`                               |
| Manual thiếu bằng chứng        | Inline error trong dialog                   | Không cho hoàn tất                             |
| Lỗi tạm thời còn lượt          | Retry schedule và attempt counter           | Xem log; hủy lịch chỉ khi có quyết định hợp lệ |
| Lỗi tạm thời hết lượt          | Warning/Danger, không có lịch kế tiếp       | Làm tay hoặc đóng kèm lý do                    |
| Lỗi vĩnh viễn/xác thực         | Danger + loại lỗi bằng text/icon            | Sửa kết nối, làm tay hoặc đóng; không retry    |
| Hết hạn mức                    | Cost approval handoff                       | Chờ quyết định; không tự cấp vượt số lượng     |
| Mua thêm được duyệt            | Activity song song Finance/IT               | IT tiếp tục ngay                               |
| Đóng tác vụ                    | Dialog yêu cầu lý do                        | Ghi Audit Trail; không xóa lịch sử             |

## 8. Visual system

### 8.1. Kích thước và mật độ

| Thuộc tính          | Giá trị                                |
| ------------------- | -------------------------------------- |
| Frame               | `1440 × 1024 px`                       |
| Sidebar             | `224 px`                               |
| Topbar              | `64 px`                                |
| Content gutter      | `24 px`                                |
| Grid                | Bội số `8 px`                          |
| Queue row           | `72–84 px` tùy lượng metadata          |
| Card radius         | `12–16 px`                             |
| Input/Button radius | `10 px`                                |
| Border              | `1 px`                                 |
| Font                | Inter; fallback `Segoe UI`, sans-serif |

Typography dùng các cấp 12/14/16 cho body và 20/24/32 cho heading. Task ID, timestamp, attempt và số lượng seat dùng tabular numerals.

### 8.2. Semantic color tokens

| Token                  | Dark      | Light     | Vai trò                         |
| ---------------------- | --------- | --------- | ------------------------------- |
| `color/bg/canvas`      | `#07182D` | `#FFF9F2` | Nền trang                       |
| `color/bg/sidebar`     | `#061426` | `#FFF4E8` | Sidebar                         |
| `color/bg/surface`     | `#0D223A` | `#FFFFFF` | Card, panel, dialog             |
| `color/bg/subtle`      | `#102943` | `#FFFAF4` | Group, table header, hover      |
| `color/border/default` | `#213D5C` | `#EFDDCA` | Border trung tính               |
| `color/text/primary`   | `#F5F9FF` | `#2B241F` | Nội dung chính                  |
| `color/text/secondary` | `#91A8C2` | `#897568` | Metadata/helper                 |
| `color/action/primary` | `#2D86FF` | `#FF7417` | CTA, active nav, focus identity |

Success, Warning và Danger là token ngữ nghĩa độc lập. Trạng thái luôn có icon, nhãn và mô tả; không dùng màu làm kênh duy nhất.

## 9. Component inventory

| Nhóm      | Component và variants                                                                       |
| --------- | ------------------------------------------------------------------------------------------- |
| Shell     | `AppShell`, `SidebarItem`, `Topbar`, `Breadcrumb`, `UserMenu`                               |
| Queue     | `ProvisioningMetric`, `QueueTabs`, `ProvisioningQueueRow`, `QueueFilter`, `QueuePagination` |
| Task      | `TaskDetailHeader`, `OperationBadge`, `ChannelBadge`, `AssignmentReservationBanner`         |
| Execution | `ExecutionTimeline`, `ConnectorAttempt`, `RetrySchedule`, `ManualInstructionCard`           |
| Evidence  | `EvidenceCard`, `MembershipStatus`, `ProviderResponse`, `AuditTimeline`                     |
| Failure   | `FailureClassification`, `TechnicalDetailDrawer`, `FailureDecisionPanel`                    |
| Handoff   | `ReconciliationHandoff`, `ApprovalHandoff`, `ParallelActivity`                              |
| Overlay   | `EvidenceConfirmationDialog`, `SwitchToManualDialog`, `CloseTaskDialog`                     |
| Feedback  | Alert, Badge, Toast, Progress, Empty/Blocked State                                          |
| Action    | Primary, Secondary, Ghost, Danger; Default/Hover/Focus/Disabled/Loading                     |

## 10. Nội dung bắt buộc theo vùng

### 10.1. Queue row

Mỗi hàng hiển thị:

- Task ID và loại thao tác `Cấp quyền` hoặc `Thu hồi`.
- Ứng dụng, người thụ hưởng và nguồn quyết định.
- Kênh Connector/Manual.
- Trạng thái, tuổi tác vụ và SLA.
- Attempt hiện tại nếu có.
- Người đang xử lý nếu là kênh thủ công.

### 10.2. Context panel

Panel phải giữ:

- Request hoặc nguồn quyết định offboarding/reclaim.
- Assignment ID và trạng thái chiếm chỗ.
- Subscription, số lượng đã mua và đang chiếm.
- Người thụ hưởng, email nhà cung cấp.
- Correlation ID.
- Audit events gần nhất.

### 10.3. Technical detail

- HTTP status/provider code.
- Endpoint hoặc adapter.
- Idempotency key.
- Attempt count và timestamps.
- Provider response đã lược bỏ dữ liệu nhạy cảm.
- Correlation ID để hỗ trợ điều tra.

Thông tin này mặc định thu gọn và không thay thế thông điệp tiếng Việt.

## 11. Accessibility và nội dung

- Text và control quan trọng đạt WCAG AA ở cả hai theme.
- Focus ring 2 px; thứ tự tab: metric/filter → queue → detail → action → context.
- Selected row có border, indicator và `aria-current`, không chỉ đổi màu nền.
- Label không được thay bằng placeholder.
- Progress/attempt có cả số và mô tả, không chỉ dùng thanh tiến độ.
- Dialog giữ focus; Escape chỉ đóng dialog không phá hủy.
- Nút dùng động từ và kết quả: `Tôi đang xử lý`, `Xác nhận đã thu hồi`, `Chuyển sang làm tay`, `Mở đối soát`.
- Hành động đóng task dùng Danger style và bắt buộc lý do.
- Không dùng cụm `Hoàn tất` cho lời mời `pending`, quyết định mua thêm hoặc phản hồi API chưa được đối soát.
- Tên sản phẩm là SaaS-Sentry; không mang thương hiệu LicenseHub từ ảnh tham chiếu.

## 12. Cấu trúc đầu ra

```text
Figma UI-UX/
├── UF-08-Figma-Design-Spec.md
├── UF-08-Sources/
│   ├── uf08.html
│   ├── uf08.css
│   ├── uf08-data.js
│   ├── uf08-renderer.js
│   ├── uf08-data.test.js
│   ├── uf08-renderer.test.js
│   ├── capture-uf08.ps1
│   └── verify-uf08-assets.ps1
└── UF-08-FullFrames/
    ├── Light/
    │   ├── UF-08-Light-01.png
    │   └── ... UF-08-Light-16.png
    └── Dark/
        ├── UF-08-Dark-01.png
        └── ... UF-08-Dark-16.png
```

Không tạo storyboard ghép chung. Mỗi PNG là một canvas desktop đầy đủ.

## 13. Tiêu chí nghiệm thu

1. Có đúng 16 PNG Light và 16 PNG Dark, mỗi file `1440 × 1024`.
2. Không có contact sheet thay cho ảnh riêng.
3. Hai theme có cùng task ID, số liệu, timestamp, thứ tự, nội dung và topology.
4. Ledger chuyển đúng các mốc tại mục 4.1; tổng outstanding chỉ giảm khi `PV-2042` thực sự hoàn tất.
5. `PV-2041` ở trạng thái `pending` không được tính hoàn tất và có handoff UF-14.
6. Manual completion yêu cầu người xác nhận và bằng chứng; seat chỉ về trống ở frame 09.
7. Retry dừng ở lần sáu; frame 12 không còn `nextAttemptAt`.
8. Lỗi vĩnh viễn/xác thực không có hành động retry.
9. Chuyển làm tay giữ nguyên Task ID và đủ sáu attempt trong audit.
10. Hết hạn mức không cho vượt `purchased_quantity`; frame 16 quay lại IT nhưng chưa ghi cấp phát thành công.
11. Finance được biểu diễn là nhánh ghi nhận song song, không phải approver hoặc bước chặn.
12. Mã lỗi kỹ thuật chỉ nằm trong chi tiết mở rộng; thông báo chính bằng tiếng Việt.
13. Mọi trạng thái có text/icon, không phụ thuộc duy nhất vào màu.
14. Không cắt chữ, chồng lớp hoặc tràn bảng khi xem ảnh ở 100%.
15. Renderer tests kiểm được screen registry, ledger, các guard cấm và theme parity.
16. Script verify kiểm đúng số lượng file, kích thước ảnh, quy tắc tên và nội dung metadata nguồn.

## 14. Truy vết nguồn

| Thiết kế                                     | Nguồn                                      |
| -------------------------------------------- | ------------------------------------------ |
| Assignment và ProvisioningTask tách vòng đời | `FR-2.5`, `ADR-07`, BRD mục 5.12.3         |
| Hai kênh dùng chung hàng đợi                 | `BR-10.3`, BRD mục 6.2                     |
| Manual cần người thật xác nhận               | `BR-10.1`                                  |
| Chống gọi trùng                              | `BR-10.2`, BRD mục 6.2                     |
| Seat vẫn chiếm chỗ                           | `BR-10.4`, `INV-01`                        |
| Pending không phải hoàn tất                  | BRD mục 5.12.3, mục 6.3, `QĐ-03`           |
| UF-14 đối soát pending → active              | User Flows `UF-14`, mục 11.17              |
| Bốn loại lỗi                                 | `F-12`                                     |
| Không retry lỗi vĩnh viễn/xác thực           | `BR-12.1`                                  |
| Thất bại không biến mất                      | `BR-12.2`, `BR-12.3`                       |
| Thông báo tiếng Việt, ẩn mã kỹ thuật         | `BR-12.4`                                  |
| Báo người yêu cầu khi thất bại               | `BR-12.5`                                  |
| Hết seat quay lại duyệt mua thêm             | `FR-3.4`, bảng ngoại lệ BRD mục 5.3        |
| Người duyệt chi quyết, Finance không chặn    | `FR-3.13`, `FR-3.14`, `QĐ-29b`, `SoD-3`    |
| Audit quyết định                             | Quy tắc chung User Flows mục 0.3, `FR-8.3` |

## 15. Phần không được tự suy diễn

- Không tự động hoàn tất một lời mời `pending`.
- Không tạo retry thứ bảy.
- Không cho IT Admin tự duyệt mua thêm seat.
- Không đặt Finance lên đường duyệt hoặc bắt IT chờ Finance ghi nhận.
- Không tự nhả seat khi tác vụ thất bại.
- Không tạo một `ProvisioningTask` mới khi chỉ đổi từ Connector sang Manual.
- Không xóa lịch sử attempt hoặc lỗi khi task đổi kênh.
- Không tự đặt thời hạn chấp nhận lời mời ngoài nhịp đối soát đã có.
- Không thiết kế chi tiết màn UF-14, UF-15 hoặc UF-11 trong hạng mục này; chỉ tạo handoff có kiểm soát.
- Không sửa BRD, `index.md` hoặc `.drawio` trong hạng mục visual UF-08.

## 16. Kế hoạch kiểm chứng khi hiện thực

### 16.1. Kiểm chứng dữ liệu

- Test registry có đúng ID `01`–`16`, không trùng hoặc thiếu.
- Test ledger ở từng frame đúng bảng mục 4.1.
- Test `pending !== completed` và `purchaseApproved !== provisioned`.
- Test frame 12 có `attempt = 6`, `maxAttempts = 6`, `nextAttemptAt = null`.
- Test frame 14 không render action `retry`.
- Test frame 13 giữ `taskId = PV-2037` và đủ sáu audit attempt.
- Test frame 16 thể hiện Finance/IT song song và trạng thái task là `queued`, không phải `completed`.

### 16.2. Kiểm chứng ảnh

- Xuất từng route `?theme=<light|dark>&screen=<01..16>` bằng trình duyệt headless.
- Kiểm đúng 32 file và kích thước `1440 × 1024`.
- So metadata nội dung giữa cặp Light/Dark của cùng screen.
- Mở và nhìn trực tiếp ít nhất toàn bộ 16 frame Light cùng 16 frame Dark; kiểm chữ cắt, overflow, overlap, contrast và trạng thái focus/disabled.
- Chạy lại kiểm chứng sau mỗi thay đổi renderer, CSS hoặc dữ liệu chuẩn.

## 17. Ranh giới bàn giao

Bản hiện thực là renderer HTML/CSS cục bộ và 32 PNG độc lập, theo convention UF-07. Đây là visual handoff có thể dùng làm đầu vào Figma; không được gọi là component library hoặc prototype Figma editable nếu chưa có file Figma cloud và chưa kiểm chứng layer/component trực tiếp trong Figma.

## 18. Kết quả hiện thực và lệnh tái tạo

- Nguồn renderer: `Figma UI-UX/UF-08-Sources/`.
- Ảnh Light: `Figma UI-UX/UF-08-FullFrames/Light/UF-08-Light-01.png` đến `UF-08-Light-16.png`.
- Ảnh Dark: `Figma UI-UX/UF-08-FullFrames/Dark/UF-08-Dark-01.png` đến `UF-08-Dark-16.png`.
- Mỗi route `?theme=<light|dark>&screen=<01..16>` đã qua preflight `data-render-ready=true` và `data-overflow=false`.
- Toàn bộ 32 ảnh đã được rà soát trực quan ở kích thước bàn giao; lỗi badge BR-12.1 bị cắt ở frame 14 đã có kiểm thử hồi quy.

Chạy lại toàn bộ capture:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File '.\Figma UI-UX\UF-08-Sources\capture-uf08.ps1' -RootPath '.'
```

Tiếp tục sau khi tiến trình bị gián đoạn:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File '.\Figma UI-UX\UF-08-Sources\capture-uf08.ps1' -RootPath '.' -Resume
```

Capture lại một hoặc nhiều frame chỉ định, ví dụ frame 14:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File '.\Figma UI-UX\UF-08-Sources\capture-uf08.ps1' -RootPath '.' -Screens 14
```

Xác minh dữ liệu, renderer, tên file và kích thước ảnh:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File '.\Figma UI-UX\UF-08-Sources\verify-uf08-assets.ps1' -RootPath '.'
```
