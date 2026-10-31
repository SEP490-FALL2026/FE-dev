# Manager — tích hợp API ngày 31/10/2026

## Nguồn

Đã đọc các tài liệu bắt buộc của FE và hướng dẫn BE tại `../docs/Figma UI-UX/API-Integration/`: `roles/manager.md`, `conventions.md`, `ai-integration-guide.md`, flow ngân sách/đơn trả phí, reference tương ứng và enum theo field. Swagger đọc trực tiếp từ `https://wdp.novaproj.site/api/docs-json`: 287 operation. Snapshot lưu tại `openapi/openapi.yaml`; SHA256 tệp JSON compact: `e3838d6fb5dde0f6d3e8b14a15dec7f705f40a999732194e00e1451d6e34647b`. Không suy ra revision triển khai chỉ từ Swagger.

Orval bổ sung tag `delegated-requests`, `spend-submission`, `budget-proposals`, `budgets`, `transfer-reviews`, giữ các tag sẵn có. Tái sinh offline bằng `ORVAL_OPENAPI_SOURCE=./openapi/openapi.yaml` và `pnpm api:generate`. Khi cập nhật BE, thay snapshot trước để validate đúng nguồn sinh. Không sửa tay generated.

## Ma trận operation đang dùng

| Màn hình            | Operation                                                                                                                                       | Hành vi                                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Tổng quan           | `meGet`, `departmentGet`, `spendQueueList`, `transferReviewList`, `handoverDutyList`                                                            | Danh tính, số thành viên và tổng số công việc từ BE; không dựng số liệu minh họa                            |
| Thành viên/công cụ  | `departmentMemberList`, `departmentToolsInUse`                                                                                                  | Phân trang BE; không suy ra usage hoặc tiền                                                                 |
| Chuông/thông báo    | `notificationUnreadCount`, `notificationList`, `notificationMarkRead`                                                                           | Số đếm thật; mở request bằng `params.requestId` đã kiểm UUID                                                |
| Duyệt nhu cầu       | `accessRequestGet`, `accessRequestSimilarSeatList`, `accessRequestNeedDecide`                                                                   | Bước chờ, đúng người được giao, không tự duyệt; chọn dòng kế hoạch/ngoài kế hoạch; từ chối có lý do         |
| Đơn nhóm            | `accessRequestLineList`, `accessRequestLineNeedDecide`                                                                                          | Quyết tất cả người của bước được giao; chặn dữ liệu thiếu trang                                             |
| Kế hoạch/bổ sung    | `accessRequestPlanLineSuggestionList`, `accessRequestPlanLineSet`, `accessRequestSupplementList`, `accessRequestSupplementAdd`                  | Gợi ý có paging; sửa dòng kế hoạch, ngày chi/loại người và lý do                                            |
| Trình lô            | `spendQueueList`, `spendBatchSubmit`, `spendBatchGet`, `spendBatchItemList`                                                                     | Chỉ chọn đơn `readyToSubmit`; hiển thị kết quả từng đơn                                                     |
| Gửi hộ              | `delegatedRequestSend`                                                                                                                          | Chọn một người trong màn gửi hộ cá nhân và một gói; lưu ID đơn BE trả                                       |
| Tạo nhóm            | `groupRequestCandidateList`, `groupRequestCheck`, `groupRequestSubmit`                                                                          | Picker có paging; BE kiểm điều kiện/giá trước xác nhận                                                      |
| Ngân sách hiện hành | `budgetMine`, `budgetMineLineList`                                                                                                              | Theo năm; không đọc số còn lại                                                                              |
| Đề xuất ngân sách   | `budgetProposalList`, `budgetProposalGet`, `budgetProposalLineList`, `budgetProposalSubmit`, `budgetProposalWithdraw`, `budgetProposalResubmit` | Form trang riêng tối đa 200 dòng; mua/kỳ dịch vụ/chu kỳ lặp bắt buộc theo luật BE; resubmit tạo đề xuất mới |
| Điều chuyển         | `transferReviewList`, `transferReviewGet`, `transferReviewItemList`, `transferReviewDecide`                                                     | Chỉ khi `canDecide` và `OPEN`; giải thích `needsNewRequest`                                                 |
| BM-09               | `personnelNoticeList`, `personnelNoticeGet`, `personnelNoticeSend`, `personnelNoticeWithdraw`                                                   | Enum gửi lên riêng; `JOB_TITLE_CHANGE` chỉ đọc lịch sử; drawer; thông báo chưa phải sự kiện có hiệu lực     |
| Bàn giao            | `handoverDutyList`, `handoverDutyGet`, `handoverDutyConfirm`                                                                                    | Phạm vi `mine`; kiểm quyền, status/nguồn/vai đã biết; không coi xác nhận là thu hồi                         |

## Kiến trúc và UI

Màn trình lô được đặt tên **Gửi đề nghị chi** (EN: **Submit spending requests**) trên sidebar/header. Tổng quan, nhãn trạng thái chờ gửi và timeline Employee đồng bộ thuật ngữ. Chỉ đổi nội dung hiển thị, giữ tab `weekly-batch`, enum và API; đây là gửi yêu cầu phần mềm lên xét chi, khác đề xuất ngân sách năm chuyển Finance.

`ManagerScreen` thay nhánh preview trong dashboard. Public barrel chỉ export bộ điều phối, chuông và điều hướng; không export fixture. Shell không giữ mảng đã đánh dấu/đã gửi. Preview cũ cô lập khỏi runtime để giữ lịch sử thiết kế/test.

View live nằm đúng slice; shared của Manager sở hữu controls, query state, paging URL, kiểm UUID, picker và mutation feedback. Generated operations dùng Axios/auth adapter chung. `useManagerAction` chỉ điều phối pending, chống click lặp, invalidation, toast, lỗi field, 429/countdown, 403/đọc lại `/me` và khóa gửi lại khi kết quả không xác định; không tự retry mutation. Không điều hướng từ response nếu người dùng đã rời màn hình.

Status từ generated qua `enums/` của slice; Request state dùng `entities/request/enums`. Mã lạ có fallback và không cấp quyền thao tác. Không gửi object GET, optional rỗng hoặc `null` không hợp lệ. Tiền giữ chuỗi thập phân và định dạng qua helper BigInt.

Ngân sách có route `/dashboard/manager/annual-budget/new` và `/dashboard/manager/annual-budget/:proposalId/revise`, cùng `RoleGuard` và shell hiện có. Sidebar trở về đúng tab, giữ `departmentId`. URL sở hữu paging/ID; form/drawer sở hữu draft. Giữ khung/màu hiện tại; bỏ các số liệu không có nguồn thật. Dialog hỗ trợ bottom sheet/mobile và drawer bên phải cho form trung bình. Các danh sách dùng hàng co giãn thành card trên mobile.

## Bố cục Manager sau rà soát UI

- Bỏ mục sidebar “Thông báo nhân sự”. BM-09 được gọi là “Biến động nhân sự”, nằm trong Nhân sự phòng ban, có lịch sử và drawer báo biến động. URL cũ chuyển về đúng ngữ cảnh, giữ ID phòng/bản ghi.
- Chuông mở drawer thông báo ngay trên workspace. Lọc tất cả/chưa đọc, phân trang và đánh dấu đã đọc dùng API hiện có; mở yêu cầu từ thông báo không đồng nghĩa duyệt yêu cầu. Đóng drawer giữ nguyên tab, bộ lọc, phân trang và trả focus về nút đã mở.
- Tổng quan có khối nhận diện phòng, ba tổng số công việc từ API và danh sách yêu cầu chờ trình chi. Các tổng số dùng `pagination.totalItems`, lọc review/handover `OPEN`, handover scope `mine`; không thay lỗi bằng 0, không gắn nhãn hàng đợi NEED cho spend queue.
- Header, section, trạng thái rỗng và bảng có chung quy chuẩn. Bảng nhân sự/công cụ/biến động/điều chuyển/bàn giao/ngân sách có cột rõ ràng, tiền/ngày căn phải; cùng dữ liệu chuyển thành thẻ có nhãn trên mobile. Không lặp tiêu đề trang trong khung rỗng.
- Đề xuất ngân sách mở chi tiết trong drawer; form lập/gửi lại vẫn có route riêng. Dialog nhận biết xác nhận lồng bên trong để Escape không đóng cả drawer cha.

## Giới hạn contract

- Chưa có hàng đợi NEED hoặc lịch sử đầy đủ request: Owner chọn giữ bảng có thông báo cần API BE, khóa phân trang hàng đợi; tra cứu UUID trả một hàng thật, chọn hàng mới mở chi tiết. Bỏ khối quy trình duyệt. Không dùng thông báo/spend queue làm hàng đợi NEED.
- `/me` chỉ có mã/tên phòng. Danh sách phòng chỉ cho Super Admin/IT; tổng quan/thành viên/công cụ nhận ID phòng chính thức, giữ trên URL và để BE kiểm phạm vi.
- Roster không có `employeeId`. Picker nhóm trả ID người hợp lệ; gửi hộ ngoài picker/BM-09 cần ID chính thức do quản trị viên cấp. Không chuyển mã nhân viên thành UUID giả.
- `reportingCurrencyGet` chỉ cho Super Admin. Form dùng mã báo cáo do Finance cung cấp, BE kiểm currency/scale; không hardcode VND.
- Chưa có API usage, ghost seats, rà soát định kỳ, AI, export sử dụng hoặc upload chứng từ đề xuất ngân sách. URL cũ hiện trạng thái chưa hỗ trợ; điều chuyển có API riêng.
- Chính Manager trong yêu cầu gửi hộ vẫn được BE định tuyến nhu cầu cho người khác; FE không tự duyệt.

## Danh sách và rà soát upload ngân sách

Nhân sự và công cụ có ô tìm kiếm gọn trên danh sách, mặc định vẫn phân trang BE. Hai API chỉ nhận `page`, `pageSize`: khi tìm thì đọc đủ các trang (100 bản ghi/lần), lọc toàn bộ tên/mã không phân biệt dấu/hoa thường, rồi phân trang kết quả 20 bản ghi. Công cụ tìm thêm ứng dụng/gói/ID cấp phát. Một trang tải lỗi thì có retry và không hiển thị kết quả thiếu. Thay tìm kiếm/xóa tìm kiếm đưa về trang đầu, giữ ngữ cảnh phòng. Ngữ cảnh UUID thu gọn; thiếu ID thì bảng có hướng dẫn và khóa tìm kiếm.

Swagger live vẫn trùng snapshot 287 operation. Upload ngân sách hiện có tại `POST /budget-versions/{id}/imports` thuộc Finance, không dùng cho Manager. Manager proposal chưa nhận file/ngày bắt đầu chu kỳ; cửa sổ mua không thay cho ngày này. Bằng chứng, giới hạn tải và danh sách yêu cầu BE: [Manager list/budget API audit](manager-list-budget-api-audit.md).

## Chọn nhân viên và gói khi tạo yêu cầu

- Thay textarea ID nhân viên và input ID gói trong cả yêu cầu nhóm/gửi hộ bằng dropdown. Nhân viên đọc từ `GET /group-request-candidates` qua generated hook: tìm tên/email có debounce, paging BE 20 người/trang, loading/lỗi/retry/rỗng và giữ lựa chọn qua các trang. Không đổi mã nhân viên thành UUID.
- Nhóm chọn tối đa 10 người; màn gửi hộ cá nhân chọn một người (API delegated vẫn hỗ trợ nhiều người nhưng UI cá nhân gửi một người). Tên/email phân biệt người trùng tên; nhóm có nhãn người đã chọn và nút bỏ chọn. Bàn phím mũi tên điều hướng lựa chọn, Escape đóng và trả focus. Search/page picker không ghi vào paging URL của workspace.
- Dialog xác nhận hiển thị tên người, email, tên gói/ứng dụng. Payload group/delegated giữ đúng contract và chỉ lấy ID từ lựa chọn; group vẫn phải qua `groupRequestCheck` và chỉ gửi khi BE xác nhận eligible. Không gửi tự động khi chọn.
- Swagger kiểm tra lại: `/plans`, `/plans/{id}` vẫn chỉ cho IT Admin/Finance. **Owner chọn giữ dropdown gói ghi rõ chờ API danh mục**, không dùng công cụ đang cấp làm danh mục tạm. Chưa có lựa chọn gói thì khóa nút gửi. Không gọi endpoint đặc quyền, không dựng gói demo.
- Để giữ khả năng nhận gói chính thức từ IT như luồng trước, form hỗ trợ liên kết có `planId=<UUID>&planName=<tên gói>&applicationName=<tên ứng dụng>` (URL-encode nhãn). Gói hiện thành một lựa chọn, không yêu cầu gõ ID. Nhãn URL chỉ phục vụ hiển thị, không chứng minh gói hợp lệ/quyền gửi; BE kiểm lúc check/gửi. Không có liên kết thì dropdown rỗng và thông báo thiếu API.
- Yêu cầu BE (`API-GAP-02`): danh mục rút gọn cho người gửi/Manager, có tìm kiếm và phân trang; trả UUID/tên ứng dụng/tên gói, nhánh/kiểu cấp và thông tin cần cho eligibility, không lộ số ngân sách. Khi có contract, cập nhật snapshot/tái sinh Orval rồi nối vào dropdown hiện có. Dropdown nhân viên hiện chỉ có người có email công việc; nếu gửi hộ onboarding cần người chưa có email, BE phải bổ sung nguồn picker đúng phạm vi.

## Kiểm chứng

Test MSW kiểm payload, tiền lớn, quyền, status lạ, pending/double submit, cache invalidation, phân trang, eligibility, BM-09 và điều chuyển. Các lệnh bắt buộc: validate/generate từ snapshot, typecheck, test liên quan và `pnpm check`; kết quả thực chạy được ghi trong bàn giao.

Kết quả: validate/generate offline, TypeScript và build production thành công; 29 test Manager/locale, 4 test Manager trong shell và 3 kiểm tra Node đều qua. Lint và Prettier các file thuộc task qua. `pnpm check` toàn repo dừng ở 48 file có lỗi định dạng sẵn có; lint toàn repo báo 283 lỗi ngoài phạm vi Manager. Lượt chạy full suite chưa qua, còn lỗi ở các test Finance/Approvals/IT/Super Admin; các kỳ vọng preview Manager đã được cập nhật và chạy lại riêng. Không mô tả full suite là đã qua.

Browser QA chưa thực hiện: công cụ báo `browser access host is unavailable` và native pipe không khả dụng. Chưa xác minh ảnh desktop/mobile hoặc luồng có tài khoản BE thật. Không ghi dữ liệu vào VPS dùng chung để kiểm thử.

Sau rà soát UI: 34 test Manager/điều hướng/locale/dialog và 4 test Manager trong shell đều qua (38 tổng); bao gồm chuyển URL BM-09 cũ, giữ context khi đóng chuông, lọc/phân trang thông báo độc lập, mở yêu cầu không duyệt ngầm, tổng số từ server và không hiển thị lỗi thành 0. Typecheck, build production và kiểm tra scoped được chạy lại. Browser QA vẫn bị chặn bởi cùng lỗi host; chưa khẳng định đã xác minh trực quan trên thiết bị.

Sau thay đổi danh sách/tìm kiếm: **99/99 test** Manager, Employee, dashboard và locale qua, gồm tra cứu ID không tự mở/duyệt, tìm nhân sự qua nhiều trang và bỏ dấu, phân trang kết quả/công cụ, xóa tìm kiếm giữ context và tải lỗi không hiển thị kết quả thiếu. Typecheck, ESLint/Prettier phạm vi sửa và build production qua. `pnpm check` toàn repo vẫn dừng ở cùng 48 file lỗi định dạng ngoài phạm vi này. Kiểm tra lại công cụ browser vẫn báo host/native pipe không khả dụng; chưa xác minh trực quan hoặc luồng tài khoản BE thật.

Sau đổi dropdown: 20 test tạo yêu cầu/API/picker qua. Lượt hồi quy Manager/Employee/dashboard/locale có 102/103 test qua; một test shell còn kỳ vọng input ID cũ. Đã cập nhật kỳ vọng dropdown và chạy lại toàn bộ file shell: 14/14 qua, hoàn tất kiểm tra các 103 test liên quan. Typecheck, build production, ESLint/Prettier phạm vi sửa qua. `pnpm check` vẫn dừng ở cùng 48 file lỗi định dạng ngoài task. Browser host/native pipe tiếp tục không khả dụng, chưa có xác minh ảnh desktop/mobile hoặc gửi yêu cầu bằng tài khoản BE thật. Không sửa snapshot/Orval vì contract danh mục chưa được BE bổ sung.
