# Employee — tích hợp API và giới hạn contract

Ngày đối chiếu: 31/10/2026. Nguồn: `../docs/Figma UI-UX/API-Integration/roles/employee.md`, quy ước, reference và enum do BE cung cấp; OpenAPI đang chạy tại `https://wdp.novaproj.site/api/docs-json`.

Snapshot `openapi/openapi.yaml` hiện có SHA-256 `e3838d6fb5dde0f6d3e8b14a15dec7f705f40a999732194e00e1451d6e34647b`, đã được cập nhật trong đợt tích hợp Manager. Đợt chỉnh UI Employee không đổi contract/generated và không đối chiếu Swagger trực tiếp lại.
Tài liệu hướng dẫn BE ghi revision `25d524477406`, hash contract `926f0b757c8989cc...`; đây là revision tài liệu, không phải bằng chứng image VPS hiện tại. Khi có khác biệt, DTO và đường dẫn lấy từ Swagger hiện tại; không sửa tay generated client.

## Luồng được nối

| Màn hình          | Operation được sử dụng                                                                                                                     | Giới hạn hiển thị                                                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Tổng quan         | `meGet`, `accessRequestDraftList`, `handoverDutyList`                                                                                      | Chỉ đếm bản nháp và nhiệm vụ bàn giao mở; không dựng số liệu usage                                                                              |
| Tạo đơn cá nhân   | `accessRequestPreview`, `accessRequestSubmit`, `accessRequestDraftSave`                                                                    | Cần mã gói chính thức từ IT; đổi form bắt buộc xem trước lại                                                                                    |
| Đơn nhóm          | `groupRequestCandidateList`, `groupRequestCheck`, `groupRequestSubmit`, `accessRequestDraftSave`                                           | Picker cùng phòng có phân trang, tối đa 10 người theo BRD; ngày kết thúc theo từng người; mỗi người có seat riêng                               |
| Đề xuất mới       | `accessRequestPropose`                                                                                                                     | Tên, URL, mục đích, dữ liệu xử lý, số người và thời hạn theo DTO                                                                                |
| Gia hạn           | `accessRequestRenewalSubmit`                                                                                                               | Mã assignment, ngày kết thúc mới và lý do; không sửa trực tiếp assignment                                                                       |
| Hoàn trả          | `returnRequestSubmit`, `returnRequestList`, `returnRequestGet`                                                                             | Gửi hoàn trả chưa phải thu hồi thành công; bàn giao đi qua nhiệm vụ BE                                                                          |
| Bản nháp          | `accessRequestDraftList`, `accessRequestDraftSubmit`, `accessRequestDraftDelete`                                                           | Gửi với body `{}`; xác nhận trước gửi/xóa; không dựng nội dung draft mà BE không trả                                                            |
| Theo dõi đơn      | `accessRequestGet`, `accessRequestTimingsGet`, `accessRequestLineList`, `accessRequestWithdraw`, `accessRequestLineWithdraw`               | Mở theo ID trả về khi gửi hoặc từ thông báo; rút đơn/dòng chỉ là khả năng UI, BE kiểm quyền và trạng thái cuối cùng                             |
| Quyền sắp hết hạn | `assignmentExpiryReminderList`                                                                                                             | Chỉ là danh sách nhắc, không phải danh sách toàn bộ assignment                                                                                  |
| Báo lỗi SaaS      | `saasIssueFormOptions`, `saasIssueSubmit`, `saasIssueList`, `saasIssueGet`, `saasIssueEntryList`, `saasIssueAddMessage`, `saasIssueReopen` | Chỉ quyền của chính người báo; dữ liệu nhạy cảm không được nhập vào mô tả; không upload tệp                                                     |
| Chuông thông báo  | `notificationList`, `notificationUnreadCount`, `notificationMarkRead`                                                                      | Nhấn chuông lấy một thông báo chưa đọc, ghi nhận đã đọc và hiện một toast; VI/EN theo code, mã lạ có fallback; số chưa đọc cập nhật mỗi 60 giây |
| Bàn giao          | `handoverDutyList`, `handoverDutyGet`, `handoverDutyConfirm`                                                                               | Chỉ xác nhận khi `canConfirm`, status/source đã biết; giá trị theo nguồn nhiệm vụ                                                               |
| Hồ sơ             | `meGet`                                                                                                                                    | Không có sửa hồ sơ hay upload avatar; đổi mật khẩu dùng route auth hiện có                                                                      |

## Phần BE chưa cung cấp cho Employee

Thông báo chỉ mở qua chuông trên header, không có trang riêng, mục sidebar hoặc lối tắt tổng quan. Khi không còn thông báo chưa đọc, chuông hiện toast trạng thái rỗng. URL cũ `tab=notifications` hiển thị tổng quan; không dùng thao tác đọc tất cả.

- Danh mục ứng dụng/gói: không gọi `planList`/`applicationList` bằng tài khoản employee (`API-GAP-02`).
- Lịch sử đầy đủ các đơn đã gửi/thụ hưởng: không gọi hàng đợi của role khác và không coi thông báo là toàn bộ lịch sử (`API-GAP-01`).
- Danh sách toàn bộ assignment, quyền xem khóa bản quyền: `licenseAssignmentList` chỉ cho IT Admin. Không dùng form options của báo lỗi để giả danh sách này.
- Số liệu usage, lịch sử collector, xuất dữ liệu cá nhân: trạng thái chưa khả dụng, không fixture hay tải tệp giả.

## Ranh giới và kiểm thử

`EmployeeScreen` là bộ điều phối duy nhất trong dashboard. Public barrel chỉ xuất screen, bell và navigation; các view preview cũ không còn được export vào luồng chạy. Các slice không import nội bộ của nhau; dữ liệu dùng chung trong `employee/shared`, enum request dùng chung ở `entities/request/enums`.

Orval giữ cơ chế `tags-operations`, shared Axios và TanStack Query. Query phân trang có tham số trong key, state trang nằm trong URL. Mutation không tự retry; toast sau response, giữ form khi lỗi, countdown theo `Retry-After`, 403 đọc lại `/me`. Lỗi ghi không rõ kết quả khóa gửi lại trên form hiện tại và yêu cầu kiểm tra dữ liệu/thông báo. POST xem trước chỉ đọc nên lỗi mạng không bị hiểu thành kết quả ghi chưa biết.

Money dùng chuỗi thập phân và BigInt khi định dạng; không chuyển tiền sang Number. Status lạ hiển thị fallback và không mở thao tác phụ thuộc status. `selfServiceOnly` chỉ cho tổng quan hạn chế, thông báo, bàn giao và hồ sơ.

Kiểm thử MSW và component nằm tại `employee-api.test.tsx`, `employee-support-api.test.tsx`, `dashboard-employee.test.tsx`; fixture có type nằm trong `test/fixtures/employee-api.ts`. Chúng chứng minh request, payload, pending, phân trang, lỗi và cache trong môi trường kiểm thử. Chúng không thay thế kiểm tra đăng nhập và nghiệp vụ trên BE đang chạy.

Điều chỉnh chuông thông báo: 28 test trong 5 file liên quan đạt, gồm test riêng tại `notifications/employee-notification-bell.test.tsx`. Bao phủ một toast cho mỗi lần nhấn, chặn nhấn lặp, cập nhật số chưa đọc, fallback mã lạ, trạng thái rỗng, lỗi API và giữ trang hiện tại. `pnpm typecheck` và ESLint các file sửa đạt.

## Rà soát giao diện Employee

- Dùng chung header, section, empty state và bảng responsive tại `app/shared/ui/workspace-*`; Employee và Manager chỉ dùng wrapper bản dịch của mình. Không import chéo role hoặc nối thêm endpoint đặc quyền.
- Tổng quan có khối nhận diện nhân viên, tổng số bản nháp và việc bàn giao từ BE, danh sách tối đa bốn bàn giao đang mở và các thao tác nhanh. Không đếm một trang làm tổng, không biến lỗi thành 0, không thêm số liệu usage hay toàn bộ assignment.
- Quyền sử dụng phân biệt nhắc hết hạn với lịch sử hoàn trả; giữ hai bộ phân trang độc lập, nút gia hạn dùng đúng `assignmentId`. Bản nháp có bảng, menu thao tác và vùng tra cứu yêu cầu riêng; không gọi đó là lịch sử toàn bộ đơn.
- Biểu mẫu giữ payload, draft và quy tắc kiểm tra lại trước khi gửi. Chi tiết yêu cầu có vùng timeline riêng; chi tiết sự cố có tóm tắt và khu vực trao đổi. Hồ sơ/bảo mật có phân cấp rõ; privacy hiển thị đúng dữ liệu chưa có.
- Chuông Employee giữ nguyên cơ chế một thông báo/toast mỗi lần nhấn; không tạo trang hoặc lối tắt thông báo mới. Giữ giới hạn `selfServiceOnly`, xác nhận mobile dùng sheet và vùng thao tác form dài ghim cuối form.

Kiểm chứng sau chỉnh UI: 78 test Employee/locale và các luồng Manager dùng chung UI đều qua. Ba test mới xác nhận tổng số do BE báo, phục hồi số đếm sau lỗi, phân trang độc lập và gia hạn đúng assignment. TypeScript, build production, ESLint và Prettier phạm vi sửa đều qua. Build còn cảnh báo kích thước chunk dashboard. Không sửa generated/Orval hoặc ghi dữ liệu vào BE thật trong đợt này.

Chưa kiểm tra hình ảnh desktop/mobile: công cụ báo browser access host và native pipe không khả dụng. Các test MSW không thay thế kiểm tra giao diện hay nghiệp vụ có tài khoản trên BE thật.

## Kết quả xác minh trước rà soát UI

- `api:validate` và Orval generation từ snapshot đã đối chiếu: đạt.
- ESLint trên toàn bộ file thay đổi do tác vụ này: đạt. Các file TS/TSX viết tay được sửa/tạo đều không vượt 500 dòng.
- `pnpm typecheck` và `pnpm build`: đạt. Build còn cảnh báo kích thước chunk dashboard của kiến trúc hiện có.
- `pnpm exec vitest run --maxWorkers=1 --testTimeout=15000`: 70 file, 238 test đạt. Dùng một worker và timeout 15 giây vì lượt chạy song song hoặc ngưỡng mặc định 5 giây có timeout khi máy tải cao; không sửa cấu hình test trong repo.
- `node --test scripts/*.test.mjs eslint-rules/*.test.cjs`: 3 test đạt.
- `pnpm check` chưa đạt: Prettier phát hiện 48 file có định dạng cũ; ESLint toàn dự án còn lỗi ở các module ngoài phần Employee. Không sửa hàng loạt Finance/IT trong tác vụ này.
- Chưa xác minh giao diện trực quan trong trình duyệt và các thao tác với tài khoản Employee trên BE thật. MSW không chứng minh CORS, dữ liệu triển khai, quyền theo dữ liệu hay kết quả xử lý nghiệp vụ trên VPS.
