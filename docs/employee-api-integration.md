# Employee — tích hợp API và giới hạn contract

## Cập nhật 01/11/2026: Tổng quan và thẩm định IT

- `GET /dashboards/employee` (`employeeDashboardGet`) cung cấp bốn thẻ ở Tổng quan: quyền phần mềm, sắp hết hạn trong 7 ngày, yêu cầu và sự cố đang mở. Giữ `asOf`, chỉ hiện count hợp lệ ở `COUNTED`; `AT_SOURCE` hiện lối mở danh sách, `NOT_AVAILABLE` ghi chưa có số liệu. Không biến số liệu chưa được BE cung cấp thành 0; chưa có count yêu cầu không ngăn mở danh sách `/me/access-requests` đã tích hợp. Thẻ hết hạn mở đúng bộ lọc nhắc hết hạn. Giữ khối bản nháp/bàn giao; phiên `selfServiceOnly` không tải dashboard nghiệp vụ.
- `GET /access-requests/{id}/assessment` (`accessRequestAssessmentGet`) nằm dưới thông tin/timeline của chi tiết yêu cầu có `proposal`. Không tải cho yêu cầu gói thông thường hoặc khi chi tiết lỗi. Hiển thị trạng thái/người thẩm định, phân loại/kiểm soát, nội dung IT, báo giá/ước tính và lý do từ chối/phương án thay thế nếu có. Chỉ đọc; thẩm định hoàn tất không phải duyệt chi. Null khác false, tiền giữ độ chính xác chuỗi thập phân, trạng thái lạ có fallback, lỗi có thử lại.
- Đối chiếu Swagger live: hai operation và schema `EmployeeDashboardResponseDto`, `AssessmentResponseDto` khớp snapshot. Orval bổ sung tag `dashboards`; không sửa tay generated và không nối các dashboard role khác.

Kiểm chứng: 103/103 test Employee/dashboard Employee/i18n qua, gồm 11 test mới cho chỉ số, điều hướng, giới hạn self-service, thẩm định, báo giá giữ độ chính xác, từ chối/thay thế, lỗi/empty/retry và chỉ tải theo proposal. TypeScript, ESLint/Prettier phạm vi sửa và build production qua. Lượt hồi quy đầu có một test dropdown cũ quá thời gian khi chạy cùng kiểm tra biên dịch; chạy riêng file đó 4/4 qua, sau đó chạy lại toàn bộ 103/103 qua. `pnpm check` toàn repo dừng ở 48 file định dạng có sẵn ngoài phạm vi sửa. Chưa kiểm tra trực quan desktop/mobile hoặc với tài khoản BE thật; MSW không thay thế xác minh quyền/dữ liệu triển khai.

## Danh mục phần mềm/gói — 01/11/2026

Đã nối ba API `GET /requestable-applications`, `GET /requestable-applications/{id}`, `GET /requestable-plans` (tiền tố `/api/v1`) vào form cá nhân và nhóm. Phần mềm có tìm theo tên/vendor, lọc loại, paging BE; gói có tìm kiếm, paging và lọc theo phần mềm được chọn. Chi tiết hiển thị vendor, nhóm chức năng, độ nhạy cảm. Không dùng `/applications` hoặc `/plans` đặc quyền, không còn chọn gói từ metadata URL hoặc nhập UUID gói. Đổi phần mềm xóa gói/preview; tìm kiếm/chuyển trang giữ lựa chọn và preview. Gói thiếu giá vẫn được xem trước; bị chặn gửi do tài chính vẫn lưu nháp được. Payload chỉ dùng plan ID lấy từ lựa chọn API và vẫn qua preview/check trước khi gửi. Client/types/enum do Orval sinh sau khi thêm tag `requestable-software`; operation thứ tư đọc chi tiết gói được sinh theo tag nhưng không gọi từ UI. Snapshot khớp live ở cả ba operation và toàn bộ schema Requestable, không cần đổi snapshot.

Các ghi chú `API-GAP-02`, catalog chờ BE và URL gói ở các phần lịch sử phía dưới không còn áp dụng cho Employee. Manager chưa được thay đổi trong tác vụ này.

Kiểm chứng danh mục: 92/92 test Employee/dashboard Employee/i18n qua, gồm 7 test mới cho ba API, filter/paging/search, preview, đổi phần mềm xóa gói, draft bị chặn gửi và lỗi/empty/retry. TypeScript, lint/Prettier phạm vi sửa và build production qua. `pnpm check` toàn repo vẫn dừng tại 48 file định dạng có sẵn ngoài phạm vi sửa. Chưa xác minh trực quan desktop/mobile hoặc thao tác gửi bằng tài khoản BE thật; không ghi dữ liệu vào BE để kiểm thử.

## Cập nhật 01/11/2026: Yêu cầu của tôi

Bổ sung cùng ngày — **Quyền sử dụng** đã nối `GET /api/v1/me/software-rights` qua `useMeSoftwareRightList`. Bộ lọc `accessList` chuyển giữa các phần mềm, nhắc hết hạn, yêu cầu hoàn trả; chỉ query danh sách đang hiển thị. Phần mềm có `rightsView=current|ended`, phân trang BE 20 mục/trang, tổng số từ server và ngày đối chiếu `asOf`; đổi filter về trang 1. Enum lấy từ generated, mã lạ fallback an toàn. Danh sách có tên phần mềm/gói, trạng thái, ngày cấp, ngày hết hạn/kết thúc và dấu sắp hết hạn. `current` có cả quyền sắp có hiệu lực; `ended` là quyền không còn giữ. Nhắc hết hạn là API reminder sắp hết hạn, không phải lịch sử hết hạn đầy đủ. Không có license key, tài khoản, chi phí hoặc usage trong API này. Snapshot và generated không đổi trong lượt nối UI này.

Kiểm chứng: 85/85 test Employee/dashboard Employee/i18n qua (8 test mới dành cho quyền sử dụng), TypeScript và lint/Prettier phạm vi sửa qua. `pnpm check` vẫn dừng ở 48 file định dạng có sẵn ngoài phạm vi sửa; kiểm chứng bằng tài khoản BE thật và trực quan desktop/mobile chưa thực hiện.

Swagger hiện có **306 operation**; snapshot SHA-256 `b809607f81b9b96b00c27d2e21b067b1239cb8d24c087bd01b3a96edd7f83082`. Đã validate/tái sinh Orval từ snapshot mới. API `GET /me/access-requests` trả đơn **do người dùng gửi**, có filter và paging thật; ghi chú `API-GAP-01` bên dưới thuộc đợt đối chiếu cũ, không còn áp dụng cho danh sách người gửi.

Bố cục dọc: tra cứu mã ở đầu, danh sách đã gửi có filter view/state/type và phân trang server bên dưới, bản nháp riêng cuối trang. URL lưu filter/page, `draftsPage` độc lập; đổi bộ lọc về trang 1. Chi tiết contract và các API mới ngoài phạm vi: [Employee request list audit](employee-request-list-api-audit.md).

Các phần ghi ngày 31/10 phía dưới giữ làm lịch sử tích hợp; giới hạn catalog/quyền sử dụng/dashboard cần đối chiếu lại Swagger mới, phân biệt API đã có và UI chưa nối.

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

Thông báo chỉ mở qua chuông trên header, không có trang riêng, mục sidebar hoặc lối tắt tổng quan. Cập nhật 01/11: chuông mở bảng xổ xuống dùng chung với Manager (`entities/notification`), hiển thị cả mục đã đọc/chưa đọc, ngày giờ, đánh dấu từng mục, đọc tất cả (`notificationMarkAllRead`) và Tải thêm theo trang BE. Không tự đánh dấu đã đọc khi mở; thao tác ghi cập nhật danh sách và badge sau phản hồi. Có loading/rỗng/lỗi/thử lại, fallback code lạ, Escape/đóng ngoài và giới hạn viewport. URL cũ `tab=notifications` vẫn hiển thị tổng quan. Mô tả toast một mục trong bảng và kết quả kiểm thử 31/10 bên dưới chỉ là lịch sử.

Kiểm chứng popover 01/11: 18 test thông báo Employee/Manager qua, gồm không tự đọc, chống nhấn lặp, đọc tất cả khi badge chưa kịp poll, tải thêm/thử lại giữ dữ liệu, fallback an toàn, đóng bảng và điều hướng đúng role. Typecheck, build production và lint/format phạm vi sửa qua. Hồi quy bị timeout khi chạy cùng build đã qua khi chạy riêng một worker. `pnpm check` vẫn bị chặn ở 48 file định dạng ngoài phạm vi sửa. Computer Use dừng vì không xác định chắc chắn URL Chrome; chưa xác minh trực quan hoặc tài khoản BE thật.

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

### Dropdown tạo yêu cầu nhóm — 01/11/2026

- Người thụ hưởng đặt trước nhãn dự án. Thay danh sách checkbox mở sẵn/nút “Theo dõi theo mã” bằng dropdown tên/email có tìm kiếm và phân trang; giữ lựa chọn, cho bỏ chọn và giới hạn 10 người. `groupRequestCandidateList` qua Orval vẫn là nguồn theo phạm vi phòng, không dùng directory đặc quyền.
- Ngày kết thúc quyền từng người nằm ngay dưới picker, giữ khi thêm/bỏ người khác, tìm kiếm hoặc chuyển trang. Payload/draft chỉ gửi employeeId và ngày, không gửi tên/email. Thay lựa chọn/ngày phải kiểm tra lại; tìm kiếm chỉ để lọc lựa chọn không hủy preview hợp lệ.
- Gói trong mode nhóm thành dropdown, bỏ ô nhập ID. Swagger kiểm tra lại vẫn chỉ cho IT/Finance đọc `/plans`; Owner đã chọn giữ dropdown ghi rõ chờ API danh mục. Có thể chọn gói từ link IT (`planId`, `planName`, `applicationName`) như Manager; nhãn URL không chứng minh quyền/eligibility, BE vẫn kiểm ở preview/gửi. Thiếu gói hoặc người thì khóa preview/lưu nháp/gửi. Mode cá nhân/đề xuất/gia hạn/hoàn trả giữ flow hiện có.
- `WorkspaceChoiceSelect` ở `app/shared/ui` dùng chung với Manager; wrapper của mỗi role chỉ cung cấp bản dịch. Primitive không import API/feature; không import nội bộ Manager sang Employee. Bộ kiểm thử Manager cần chạy lại khi đổi primitive chung.

Kiểm chứng: 4 test mới của dropdown qua; 6 test form/bản dịch chạy lại sau đồng bộ hướng dẫn nhóm qua. Lượt hồi quy Employee/Manager/dashboard/locale có 106/107 test qua, một test Manager còn kỳ vọng nhãn “Awaiting batch submission” từ trước lần đổi tên. Đã cập nhật nhãn và chạy lại cả file Manager API: 8/8 qua, hoàn tất kiểm tra 107 test liên quan. Typecheck cuối, build production và ESLint/Prettier phạm vi sửa qua. `pnpm check` vẫn dừng ở cùng 48 file lỗi định dạng ngoài task. Browser host không khả dụng, native inventory bị timeout; chưa xác minh ảnh desktop/mobile hoặc gửi dữ liệu bằng tài khoản BE thật. Không sửa generated/Orval hoặc ghi dữ liệu vào BE.

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
