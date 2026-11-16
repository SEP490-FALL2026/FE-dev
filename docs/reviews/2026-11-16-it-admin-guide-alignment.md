# Đối chiếu giao diện quản trị công nghệ thông tin ngày 16/11/2026

## Nguồn kiểm tra

Hướng dẫn: `../../../docs/Figma UI-UX/API-Integration/README.md`, `conventions.md`, `roles/it-admin.md`, các luồng và reference liên quan. Revision tài liệu là máy chủ `dev` `94a8ee84`, contract 423 operation. Swagger trực tiếp qua cấu hình Orval đã kiểm tra hợp lệ. Sinh lại bằng `pnpm api:generate` không tạo khác biệt trong thư mục generated.

Feedback cũ là yêu cầu giao diện, không phải bằng chứng API đã tồn tại. Các tài liệu quy tắc dự án được giữ nguyên; phần mô tả hiện trạng cũ trong đó không được dùng thay contract mới.

## Ánh xạ chức năng

| Khu vực             | API và cách dùng                                                                                                                                                                                                                                            |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tổng quan           | `itAdminDashboardGet`; giữ khác biệt số xác nhận, mở tại nguồn và chưa có dữ liệu. Kỳ thiếu hóa đơn mở danh sách kỳ thiếu; tác vụ mở đúng hàng xử lý.                                                                                                       |
| Cấp phát            | `grantQueueList` mặc định lọc chờ cấp; cho xem các trạng thái khác và mở `execution.taskId`. `provisioningTaskGrant` chỉ mở việc thực hiện, không đồng nghĩa đã hoàn tất cấp. Hoàn tất tài khoản cá nhân gửi các bước từ `provisioningTaskGet.k1Checklist`. |
| Kho dùng chung      | Gói → thuê bao → sức chứa hoặc kho khóa; không coi số suất trống là số khóa hợp lệ. Không tạo kho cho phần mềm nội bộ. File mẫu lấy từ `importTemplateGet`.                                                                                                 |
| Danh mục            | Tạo ứng dụng kèm gói đầu bằng `applicationCreate`; mô hình giá để máy chủ suy ra; thuê bao bản quyền khóa chỉ có loại vĩnh viễn. Đơn giá thuê bao và kỳ gia hạn dùng đồng Việt Nam.                                                                         |
| Phần mềm theo phòng | `departmentSoftwareList` và `departmentSoftwareListChange`. Gửi phần thêm/bỏ, không thay toàn bộ danh sách từ một trang. Giữ lựa chọn qua tìm kiếm/phân trang; bỏ mục không xóa quyền đã cấp hoặc yêu cầu lịch sử.                                          |
| Hợp đồng/chứng từ   | `contractList`, `contractGet`, `contractCreate`; tải tệp theo khai báo → lưu trữ → xác nhận → gắn hợp đồng.                                                                                                                                                 |
| Hóa đơn mua         | `purchaseInvoiceMissingPeriodList`, `purchaseInvoiceList/Get`, `Preview/Submit/Resubmit`. Tệp hóa đơn khai báo → lưu trữ → xác nhận, không gắn hợp đồng. Nộp mới sau trả lại gửi đủ thông tin và tệp mới.                                                   |
| Dữ liệu sử dụng     | Phòng → thành viên → ứng dụng → `usageEmployeeSoftwareGet`; tổng hợp bằng `usageOverviewList`. Khoảng ngày và nguồn giữ trong đường dẫn. Không cộng chỉ số khác đơn vị hoặc tạo nội dung câu lệnh.                                                          |
| Nhập sử dụng        | `usageSourceList/Get`, `usageImportList/Upload/Get/RowList/Confirm/Cancel`; lỗi dòng, khoảng dữ liệu và thông báo theo dõi là bước riêng.                                                                                                                   |
| Thiết bị            | Danh sách → chi tiết → lịch sử người giữ/đăng ký/kết quả thu thập trên trang riêng. Chỉ thao tác web được phép; không gọi API dành riêng cho bộ thu thập bằng phiên người dùng.                                                                             |
| Tối ưu              | `ghostSeatRecommendationList/Get`; chuyển sớm sang trưởng phòng bằng `ghostSeatEscalationCreate` với câu trả lời chính sách bước `5.3`; thu hồi/trả quyết định theo quyền và trạng thái máy chủ.                                                            |
| Phần mềm bên ngoài  | Hàng thẩm định và các operation assessment; bắt buộc câu trả lời chính sách. Chấp nhận không tự mua, cấu hình danh mục hoặc cấp quyền.                                                                                                                      |
| Nghỉ việc           | Chặn tài khoản, mở thu hồi, xử lý từng quyền, ghi khóa hộp thư theo thứ tự; quyền thao tác dựa vào `accessBlocked`, không đợi trạng thái nhân sự đã nghỉ. Hệ thống tự đóng. Hồ sơ hủy không cho tiếp tục thao tác.                                          |
| Điều chuyển         | Giữ quyền trong ân hạn; tác vụ thu hồi thuộc quản trị viên phụ trách phòng mới; mở đúng tác vụ và hệ thống tự đóng. Xin lại là yêu cầu thông thường tại phòng mới.                                                                                          |

## Khác biệt nghiệp vụ cần giữ

- Danh sách phần mềm của phòng là gợi ý. Gói nằm ngoài danh sách vẫn có thể được xin theo quyền máy chủ. Không diễn đạt thành danh sách cho phép/cấm.
- Kho dùng chung và quyền cá nhân có hạn là hai nguồn khác nhau; hết hạn quyền cá nhân không phải hết hạn thuê bao.
- Hướng dẫn thu hồi có mâu thuẫn: luồng cho phép mở tác vụ thay thế sau khi đóng thất bại, còn reference yêu cầu quyền chọn có `revocable=true` và `revocation=null`. Giao diện tuân theo cờ và projection máy chủ, dẫn tới đúng tác vụ thất bại và cho tải lại; không tự bỏ kiểm soát bằng cách coi tác vụ thất bại là chưa tồn tại.
- Người không có dữ liệu, dữ liệu thiếu một phần và không có hoạt động đã được đo là ba tình trạng khác nhau.
- Dữ liệu nhà cung cấp có thể là văn bản gốc. Nhãn và hướng dẫn do giao diện sở hữu luôn theo ngôn ngữ được chọn; không tự dịch hoặc thay đổi chứng cứ nguồn.

## Kiểm chứng và giới hạn

Các kiểm thử hồi quy dùng biên HTTP mô phỏng; không ghi thử dữ liệu lên môi trường dùng chung. Chúng kiểm tra payload, thứ tự thao tác, phân trang, đường dẫn, quyền thao tác, tải chứng từ và giữ số tiền dạng chuỗi.

Lượt xác nhận cuối: `pnpm vitest run app/features/dashboard/it-admin app/shared/ui app/shared/i18n --maxWorkers=4 --reporter=dot` qua toàn bộ **195 kiểm thử trong 60 tệp**. ESLint trong khu vực quản trị và các phần dùng chung đã sửa không có lỗi; Prettier trong khu vực quản trị, tài nguyên ngôn ngữ và các tài liệu mới qua kiểm tra. `git diff --check` sạch; không thay đổi tài liệu quy tắc được bảo vệ hoặc mã generated.

Màn đối soát dùng ba nguồn thật: `invoiceDiscrepancyList/Get` chỉ đọc cho vai quản trị; `vendorAccountDiscrepancyList/Decide` để kết luận báo nhầm hoặc ngoài quy trình; `outOfProcessCaseList/Close` để ghi nhận báo cáo, báo nhầm hoặc xác nhận thu hồi tài sản công ty kèm tệp bằng chứng mới. Không mở quyền ghi khoản chi của bộ phận tài chính. Đối soát tài khoản và hồ sơ ngoài quy trình không có API chi tiết riêng, nên giao diện giữ trang/bộ lọc của danh sách làm nguồn mở chi tiết, không tự tạo endpoint.

Đối chiếu Swagger trực tiếp với `coverage-manifest.json`: 423/423 thao tác khớp định danh, phương thức và đường dẫn. Không có thao tác bị thiếu hoặc thay đổi trong phép so này. Kiểm tra kiểu mới nhất báo 131 lỗi ở các vai trò/fixture khác, không có lỗi trong `it-admin` hoặc đăng ký bản dịch. Kiểm tra tổng hợp dừng tại 10 tệp sai định dạng ngoài phạm vi quản trị. Build chung bị chặn bởi hai import API ngân sách đã bỏ ở phần tài chính; chưa xác nhận giao diện trên trình duyệt hay thao tác thật lên máy chủ.

Tham khảo thiết kế biểu mẫu: [GOV.UK về nhãn và hướng dẫn trường nhập](https://design-system.service.gov.uk/components/text-input/), [W3C về trường bắt buộc và mô tả truy cập được](https://design-system.w3.org/styles/forms.html). Dấu sao đỏ theo yêu cầu của người dùng; nội dung dài dùng trang riêng, nội dung ngắn dùng hộp thoại theo lượng ngữ cảnh.

Kiểm tra kiểu và build toàn dự án hiện phát hiện code các vai trò khác chưa cập nhật contract mới: ví dụ phần tài chính còn import `useBudgetCyclePublish` và `useBudgetDepartmentCeilingsSet`, trong khi máy chủ đã bỏ hai API đó. Các lỗi này được báo riêng, không sửa bằng cách khôi phục API giả hoặc nới kiểu generated. Kết quả cuối cùng của bộ kiểm thử quản trị và kiểm tra chất lượng được báo trong phần bàn giao.
