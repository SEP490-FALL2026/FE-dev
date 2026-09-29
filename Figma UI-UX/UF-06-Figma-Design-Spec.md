# SaaS-Sentry — Đặc tả thiết kế Figma cho UF-06

> **Phiên bản:** 0.1 — 16/09/2026
> **Trạng thái:** Đã hiện thực visual storyboard raster trong Figma (Light + Dark); theo giới hạn Figma Starter, đây không phải bộ component/prototype editable.
> **Hình thức bàn giao:** 24 artboard raster độc lập được import vào Figma: 12 trạng thái `UF-06` cho Light và 12 trạng thái tương ứng cho Dark. Mỗi artboard là một canvas desktop đầy đủ, không phải ảnh cắt từ contact sheet; token, component và liên kết prototype sẽ là hạng mục tiếp theo nếu nâng cấp gói hoặc có file hỗ trợ.
> **Phạm vi:** Desktop web 1440 px; hai theme Light và Dark; user flow `UF-06` — IT Admin nạp dữ liệu sử dụng
> **Nguồn nghiệp vụ:** [BRD v3.11](../Requiments/BRD%20-%20HỆ%20THỐNG%20QUẢN%20TRỊ%20BẢN%20QUYỀN%20PHẦN%20MỀM%20%26%20TỐI%20ƯU%20CHI%20PHÍ%20CÔNG%20NGHỆ.md), [User Flows mục UF-06](../Diagrams/user-flows/index.md#119-uf-06--it-admin-nạp-dữ-liệu-sử-dụng), [UF-06.drawio](../Diagrams/user-flows/drawio/UF-06.drawio)
> **Ảnh tham chiếu theme:** [ThemeDarkExample.jpg](ThemeDarkExample.jpg), [ThemeLightExample.jpg](ThemeLightExample.jpg)

## 1. Mục tiêu và ranh giới

Thiết kế một bộ màn hình Figma chỉnh sửa được, có prototype xuyên suốt `UF-06`, giúp IT Admin đưa dữ liệu sử dụng vào hệ thống mà không kết luận sai từ dữ liệu thiếu hoặc chưa khớp danh tính.

Hai ảnh theme chỉ quyết định ngôn ngữ màu, độ tương phản, mật độ, cách dùng card và shell điều hướng. Chúng không phải nguồn nghiệp vụ và không mang thương hiệu `LicenseHub` sang sản phẩm. Giao diện dùng tên **SaaS-Sentry**.

Trong phạm vi:

- Desktop 1440 × 1024; chưa thiết kế tablet/mobile.
- Hai mã màn hình hiện hành: `ITA-08` cho trung tâm/chọn nguồn và `ITA-07` cho wizard import.
- Mười hai frame chính, hai overlay dùng lại, đầy đủ happy path và các nhánh chặn của `UF-06`.
- Light/Dark dùng chung component tree, Auto Layout và semantic variables.
- Prototype dẫn sang `UF-07` và `UF-10` bằng điểm handoff; không thiết kế lại hai flow đó.

Ngoài phạm vi:

- Thay đổi BRD, `F-17`, `F-42`, `BR-17.x`, `BR-18.1` hoặc `BR-42.2`.
- Thiết kế responsive, mobile app hoặc tablet.
- Thiết kế chi tiết toàn bộ `UF-07`, `UF-10` hay phân hệ ngoài `UF-06`.
- Kết luận pháp lý rằng thông báo hoặc xác nhận đã đủ để việc thu thập tuân thủ pháp luật.
- Thiết kế API, cơ sở dữ liệu hoặc cơ chế retry ở backend.

## 2. Quyết định thiết kế đã chốt

### 2.1. Bố cục

Chọn **wizard toàn trang với stepper dọc và panel ngữ cảnh nguồn cố định**.

- Sidebar ứng dụng cố định bên trái.
- Top bar gọn, có breadcrumb, tìm kiếm, thông báo và tài khoản.
- Stepper dọc hiển thị sáu bước: Nguồn → Phân tích → Danh tính → Xem trước → Ghi dữ liệu → Hoàn tất.
- Vùng nội dung trung tâm dành cho form, bảng và trạng thái.
- Panel bên phải giữ ngữ cảnh nguồn xuyên suốt: ứng dụng, template, coverage window, năng lực phát hiện, định nghĩa hoạt động và số Assignment bị ảnh hưởng.

Không chọn wizard một cột vì làm mất ngữ cảnh khi chuyển bước; không chọn workspace hai ngăn vì tăng mật độ và độ khó học không cần thiết cho một phiên import.

### 2.2. Giải quyết hai điểm biểu diễn chưa rõ trong UF-06

Thiết kế Figma theo đặc tả `F-17`, không thu hẹp theo nhãn tóm tắt của sơ đồ:

1. Bước xem trước hiển thị đủ **số quyền bị ảnh hưởng** và **nguồn hiểu “hoạt động” là gì**, ngoài các số hợp lệ, lỗi, trùng, chưa khớp, coverage và năng lực nguồn.
2. Khi còn định danh chưa khớp, các bản ghi đó đi vào `UF-07` và không được dùng để kết luận; **phần hợp lệ vẫn tiếp tục tới preview**. Giao diện không diễn đạt rằng một định danh chưa khớp làm hỏng cả file.

Hai điểm này cần được ghi nhận khi lần tới đồng bộ `index.md`/`.drawio`; task Figma không tự sửa nguồn flow.

## 3. Cấu trúc file Figma

| Page                 | Nội dung                                                                  |
| -------------------- | ------------------------------------------------------------------------- |
| `00 · Foundations`   | Variables, typography, spacing, elevation, iconography, component library |
| `01 · UF-06 · Light` | 12 frame desktop và overlay ở Light mode                                  |
| `02 · UF-06 · Dark`  | Cùng frame, tên và topology ở Dark mode                                   |
| `03 · Prototype Map` | Happy path, blocked path, cancel path, handoff `UF-07`/`UF-10`            |

Quy tắc đặt tên:

- Frame: `UF06/ITA-07/08-Preview/Light`.
- Component: `Import/MetricCard`, `Import/ContextPanel`, `Navigation/WizardStepper`.
- Variable: `color/bg/canvas`, `color/text/primary`, `space/4`, `radius/card`.
- Không gắn mã hex trực tiếp vào component; mọi màu đi qua semantic variable.

## 4. Danh sách frame

| #   | Tên frame                  | Mã màn hình         | Nội dung và trạng thái cuối                                                                                  |
| --- | -------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------ |
| 01  | Trung tâm nguồn dữ liệu    | `ITA-08`            | Danh sách ứng dụng/nguồn, loại nguồn, lần import gần nhất, coverage cuối, độ mới và CTA tạo phiên import     |
| 02  | Chọn ứng dụng và mẫu nguồn | `ITA-08`            | Chọn ứng dụng, template, loại định danh, múi giờ và ma trận năng lực                                         |
| 03  | Kiểm tra chính sách nguồn  | `ITA-08`            | Hiển thị cờ liên lạc và trạng thái đã thông báo; điều hướng sang blocked state, cổng `F-42` hoặc upload      |
| 04  | Cổng thông báo lần đầu     | `ITA-07` · `F-42`   | Đối tượng nhận, nội dung tối thiểu, thời điểm gửi; chỉ mở bước upload sau khi ghi nhận thông báo             |
| 05  | Bước 1 — Tải file          | `ITA-07`            | Dropzone, định dạng hỗ trợ, tên/kích thước file, trạng thái upload và mã băm                                 |
| 06  | Bước 2 — Phân tích         | `ITA-07`            | Mapping cột, định dạng ngày, múi giờ, định nghĩa hoạt động và coverage; coverage thiếu thì bắt buộc nhập tay |
| 07  | Bước 3 — Khớp danh tính    | `ITA-07`            | Tổng số exact/normalized/manual/unmatched, mức tin cậy và handoff sang `UF-07`                               |
| 08  | Bước 4 — Xem trước         | `ITA-07`            | Metric summary, giới hạn nguồn, bảng mẫu, filter lỗi và tải danh sách lỗi; chưa ghi dòng nào                 |
| 09  | Xác nhận ghi dữ liệu       | `ITA-07`            | Tóm tắt phạm vi ảnh hưởng, cam kết gắn vào Assignment và hai hành động Hủy/Xác nhận                          |
| 10  | Bước 5 — Đang ghi          | `ITA-07`            | Tiến độ job, số dòng xử lý, trạng thái hiện hành; không hiển thị thành công sớm                              |
| 11  | Bước 6 — Hoàn tất          | `ITA-07`            | Số dòng đã ghi/bỏ qua/lỗi, thời điểm tính lại usage và CTA sang `UF-10`                                      |
| 12  | Lịch sử phiên import       | `ITA-07` / `ITA-08` | Audit summary: người thao tác, file, mã băm, coverage, kết quả và correlation ID                             |

Mỗi frame trên có Light và Dark mode với cùng tên lớp, component tree và liên kết prototype.

## 5. Overlay và nhánh trạng thái

### 5.1. Overlay dùng lại

| Overlay                               | Kích hoạt                       | Nội dung bắt buộc                                              | Hành động                              |
| ------------------------------------- | ------------------------------- | -------------------------------------------------------------- | -------------------------------------- |
| `OVL-01 · Duplicate hash`             | Mã băm trùng phiên import trước | File, mã băm, người/lúc import trước, cảnh báo không chặn cứng | Hủy hoặc tiếp tục có chủ đích          |
| `OVL-02 · Commit/Cancel confirmation` | Xác nhận ghi hoặc hủy ở preview | Số dòng/quyền ảnh hưởng; nhắc hủy sẽ ghi 0 dòng                | Quay lại, Hủy import hoặc Xác nhận ghi |

### 5.2. Guard và phản hồi

| Trường hợp                   | Cách trình bày                                                        | Trạng thái CTA                                                        |
| ---------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Ứng dụng thuộc nhóm liên lạc | Blocked state toàn vùng nội dung, giải thích chế độ mặc định `ADR-10` | Chỉ cho quay lại chọn ứng dụng; không có CTA vượt guard               |
| Lần đầu nhưng chưa thông báo | Gate card với người nhận, nội dung và audit timestamp                 | Chưa cho sang upload                                                  |
| File trùng                   | `OVL-01`, mức Warning                                                 | Cho tiếp tục có chủ đích; không tự bỏ qua hoặc ghi đè                 |
| Thiếu coverage               | Inline error, focus vào Date Range                                    | Khóa “Tiếp tục”                                                       |
| Có dòng lỗi                  | Metric, filter bảng và tải danh sách lỗi                              | Cho tiếp tục với phần hợp lệ theo `BR-17.7`                           |
| Có định danh chưa khớp       | Metric + message `BR-18.1` + liên kết `UF-07`                         | Phần hợp lệ vẫn được preview; unmatched không dùng kết luận           |
| Hủy ở preview                | `OVL-02`                                                              | Kết thúc với 0 dòng được ghi                                          |
| Commit lỗi hệ thống          | Error summary, correlation ID, không hiển thị success giả             | Thử lại an toàn hoặc về lịch sử; chi tiết retry do backend quyết định |
| Commit thành công            | Success summary                                                       | CTA chính sang `UF-10`, CTA phụ về lịch sử                            |

## 6. Visual system

### 6.1. Kích thước và mật độ

| Thuộc tính          | Giá trị                                |
| ------------------- | -------------------------------------- |
| Frame               | 1440 × 1024 px                         |
| Sidebar             | 248 px                                 |
| Content gutter      | 32 px                                  |
| Grid                | Bội số 8 px                            |
| Table row           | 44 px mặc định                         |
| Card radius         | 12–16 px                               |
| Input/Button radius | 10 px                                  |
| Border              | 1 px                                   |
| Font                | Inter; fallback `Segoe UI`, sans-serif |

Typography sử dụng các cấp 12/14/16 cho body và 20/24/32 cho heading. Số liệu dùng tabular numerals.

### 6.2. Semantic color tokens

| Token                  | Dark      | Light     | Vai trò                                |
| ---------------------- | --------- | --------- | -------------------------------------- |
| `color/bg/canvas`      | `#07182D` | `#FFF9F2` | Nền toàn trang                         |
| `color/bg/sidebar`     | `#061426` | `#FFF4E8` | Sidebar                                |
| `color/bg/surface`     | `#0D223A` | `#FFFFFF` | Card, panel, dialog                    |
| `color/bg/subtle`      | `#102943` | `#FFFAF4` | Header bảng, hover, grouped section    |
| `color/border/default` | `#213D5C` | `#EFDDCA` | Border trung tính                      |
| `color/text/primary`   | `#F5F9FF` | `#2B241F` | Nội dung chính                         |
| `color/text/secondary` | `#91A8C2` | `#897568` | Helper, metadata                       |
| `color/action/primary` | `#2D86FF` | `#FF7417` | CTA, active navigation, focus identity |

Success, Warning và Danger là token ngữ nghĩa độc lập với accent theme. Mọi trạng thái luôn đi cùng icon, nhãn và viền; không dùng màu làm kênh thông tin duy nhất.

## 7. Component inventory

| Nhóm     | Component và variants                                                                      |
| -------- | ------------------------------------------------------------------------------------------ |
| Shell    | `AppShell`, `SidebarItem`, `Topbar`, `Breadcrumb`, `UserMenu`, `ThemeSwitch`               |
| Wizard   | `WizardStepper`: Default, Active, Complete, Error, Disabled                                |
| Context  | `ContextPanel`, `ContextItem`, `CapabilityTag`                                             |
| Form     | Input, Select, Date Range, Checkbox, Field Label, Helper/Error Text                        |
| Upload   | `UploadDropzone`: Idle, Drag, Uploading, Parsed, Invalid                                   |
| Summary  | `MetricCard`: Valid, Error, Duplicate, Unmatched, Affected                                 |
| Feedback | Alert/Badge: Info, Success, Warning, Danger; Toast; Empty/Blocked State                    |
| Data     | `DataTable`, Row Status, Filter Bar, Pagination, Error Detail Drawer                       |
| Overlay  | Dialog: Duplicate, Cancel, Commit, System Failure                                          |
| Action   | Button: Primary, Secondary, Ghost, Danger; trạng thái Default/Hover/Focus/Disabled/Loading |

## 8. Prototype contract

Happy path:

```text
01 Trung tâm nguồn
→ 02 Chọn ứng dụng & mẫu
→ 03 Kiểm tra chính sách
→ [04 Cổng thông báo nếu là lần đầu]
→ 05 Upload
→ [OVL-01 nếu trùng mã băm]
→ 06 Phân tích/coverage
→ 07 Khớp danh tính
→ 08 Preview
→ 09 Xác nhận
→ 10 Đang ghi
→ 11 Hoàn tất
→ UF-10 hoặc 12 Lịch sử
```

Nhánh bắt buộc:

- Ứng dụng liên lạc → blocked state → kết thúc “không import, chỉ dùng danh sách thành viên”.
- Chưa thông báo lần đầu → không đi tới upload.
- Thiếu coverage → không đi tới identity resolution.
- Unmatched → tạo handoff `UF-07`, phần hợp lệ tiếp tục preview.
- Hủy ở preview → `OVL-02` → kết thúc “không ghi một dòng nào”.
- Commit lỗi → error state; không chuyển sang frame thành công.

Theme switch đổi mode bằng variables mà không đổi route hoặc reset trạng thái wizard.

## 9. Nội dung bắt buộc của preview

Frame 08 phải hiển thị:

1. Số dòng hợp lệ.
2. Số dòng lỗi kèm đường dẫn xem/tải chi tiết.
3. Số dòng trùng sẽ bỏ qua hoặc cần xác nhận.
4. Số định danh chưa khớp; ghi rõ không dùng để kết luận.
5. Coverage window.
6. Số Assignment bị ảnh hưởng.
7. Nhóm lãng phí nguồn có thể phát hiện.
8. Định nghĩa “hoạt động” của nguồn.

Panel ngữ cảnh giữ bốn mục cuối luôn nhìn thấy khi người dùng xem bảng mẫu.

## 10. Accessibility và nội dung

- Contrast tối thiểu WCAG AA cho text và control quan trọng.
- Focus ring 2 px rõ ở cả hai theme; thứ tự tab theo thứ tự đọc.
- Label không được thay bằng placeholder.
- Icon trạng thái luôn có nhãn văn bản; tooltip không chứa thông tin duy nhất.
- Button dùng động từ và kết quả: “Phân tích file”, “Xác nhận ghi dữ liệu”, “Tải danh sách lỗi”.
- Destructive action dùng Danger style và dialog xác nhận.
- Giao diện dùng tiếng Việt; thuật ngữ kỹ thuật đã chốt như Assignment có thể hiện kèm giải thích “quyền đang hiệu lực”.
- Không hiển thị họ tên trong bảng usage; ưu tiên mã nhân viên/email theo `OQ-03` và phạm vi API.

## 11. Tiêu chí nghiệm thu thiết kế

1. Có đúng 12 frame chính cho Light và 12 frame tương ứng cho Dark; tên và topology đối xứng.
2. Mọi frame dùng Auto Layout, component variants và semantic variables; không detach component để đổi theme.
3. Prototype click được happy path, blocked path, duplicate path, manual coverage, unmatched handoff, cancel path, failure và success.
4. Không đường prototype nào ghi dữ liệu trước bước xác nhận.
5. Nhánh hủy kết thúc với 0 dòng được ghi; nhánh communication blocked không có đường vượt guard.
6. Bản ghi chưa khớp được phân biệt bằng icon + text, không dùng để kết luận, có handoff `UF-07`; phần hợp lệ vẫn tới preview.
7. Preview chứa đủ tám nhóm thông tin tại mục 9.
8. Cả hai theme đạt contrast AA, có focus state và không dùng màu làm kênh thông tin duy nhất.
9. Không cắt chữ, chồng lớp hay tràn bảng ở frame 1440 × 1024 khi xem 100%.
10. Handoff cho frontend gồm bảng token, component/variant inventory, prototype map và mapping frame → `ITA-07`/`ITA-08` → `F-17`/`F-42`.

## 12. Truy vết nguồn

| Thiết kế                                       | Nguồn                                    |
| ---------------------------------------------- | ---------------------------------------- |
| Sáu bước import và preview trước ghi           | `FR-7.1`, `FR-7.2`, `F-17`               |
| Coverage bắt buộc                              | `FR-4.3`, `BR-17.1`, `INV-10`            |
| Định nghĩa hoạt động                           | `FR-4.16`, `BR-17.5`, `INV-11`           |
| Gắn usage vào Assignment tại thời điểm sự kiện | `FR-4.7`, `BR-17.6`                      |
| Unmatched không dùng kết luận                  | `FR-4.6`, `FR-4.10`, `BR-18.1`, `INV-12` |
| Communication app bị chặn mặc định             | `BR-17.8`, `ADR-10`                      |
| Thông báo trước khi ghi lần đầu                | `FR-10.4`, `F-42`, `BR-42.2`             |
| Hủy preview ghi 0 dòng                         | `FR-7.2`, `F-17`                         |
| Audit/import history                           | `FR-8.3`, `FR-7.4`                       |

## 13. Điểm bàn giao còn phụ thuộc

- Cần cài và kết nối Figma để tạo file cloud, editable layers và prototype trực tiếp.
- `Figma UI-UX/Ui-spec.md` hiện là Screen Flows v1.0 legacy, không phải đặc tả UI chi tiết; không dùng nó làm nguồn visual/component hiện hành.
- Khi sửa lại nguồn user flow, cần đồng bộ hai điểm tại mục 2.2 vào `Diagrams/user-flows/index.md`, `.drawio` và các bản xuất bị ảnh hưởng theo playbook synchronization.
- File Figma chưa được tạo ở giai đoạn đặc tả; không được ghi trạng thái “đã thiết kế” cho tới khi frame, component và prototype được kiểm chứng trực tiếp.
