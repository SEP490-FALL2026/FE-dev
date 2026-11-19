# Tích hợp Spending Approver — 02/11/2026

Nguồn contract: `openapi/openapi.yaml` của workspace, đối chiếu tài liệu `../docs/Figma UI-UX/API-Integration/roles/spending-approver.md` và các reference ngân sách, duyệt chi, yêu cầu nhóm. Orval sinh từ snapshot cục bộ; bổ sung tag `spend-approvals`, `spend-submission`, `notifications`, giữ các tag đã có. Không sửa tay thư mục generated.

| Giao diện         | Operation                                                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Tổng quan         | `spendApprovalList`, `budgetVersionList` lấy tổng từ pagination, không tính tổng từ trang đầu                                 |
| Nhu cầu được giao | `notificationList` (`STEP_ASSIGNED`, `stepKind = NEED`), `accessRequestGet`, `accessRequestNeedDecide`                        |
| Nhu cầu nhóm      | `accessRequestLineList`, `accessRequestLineNeedDecide`; tải đủ các trang và quyết đúng bước được giao                         |
| Hàng đợi chi      | `spendApprovalList`; lọc trong trang có nhãn phạm vi, mở trực tiếp bằng UUID                                                  |
| Chi tiết chi      | `accessRequestGet` xác định loại yêu cầu; `spendApprovalGet`, `budgetCheckGet`, `budgetCheckYearList`, `financeReviewGet`     |
| Quyết định chi    | `spendApprovalDecide`; `spendApprovalLineDecide` cho nhóm, duyệt/từ chối từng người đã xác nhận nhu cầu                       |
| Trao đổi Finance  | `budgetInformationOfRequest`, `budgetInformationAsk`; câu hỏi mở không khóa quyết định chi                                    |
| Duyệt lô          | `spendBatchGet`, `spendBatchItemList`, `spendBatchDecide`; hiển thị từng kết quả và lý do `SKIPPED`, không override hàng loạt |
| Ngân sách năm     | `budgetVersionList`, `budgetVersionGet`, `budgetVersionLineList`, `budgetVersionHistoryList`, `budgetVersionDecide`           |
| Đề xuất phòng ban | `budgetProposalList`, `budgetProposalGet`, `budgetProposalLineList`, chỉ đọc                                                  |

Mã trạng thái/decision dùng lại constant và type generated qua `enums/` của từng slice. Payload chi gửi `APPROVE`/`REJECT`; ngân sách năm gửi `APPROVE`/`REJECT`/`REQUEST_CHANGES`. Status đọc về không trộn với mã gửi lên hoặc lựa chọn bộ lọc. Trạng thái chưa nhận diện hiển thị nhãn dự phòng và chặn thao tác phụ thuộc.

Server state thuộc TanStack Query. Mutation làm mới các query liên quan theo key generated, kể cả khi cần đọc lại kết quả ghi không rõ ràng; 429 giữ cache và có countdown. Các form giữ draft khi lỗi, khóa gửi ngay từ lần submit đầu, phản hồi bằng Sonner. Tiền giữ chuỗi thập phân; helper dùng chung tại `app/shared/lib/money.ts` phục vụ Finance và Approver.

Đã xóa dữ liệu, store và màn hình demo cũ của role, bỏ badge/tên người dùng giả; header dùng phiên thật. Placeholder VI/EN mô tả rõ nội dung cần nhập. Bảng có card trên mobile, select dùng điều khiển bàn phím, số/tiền/ngày căn phải.

Giới hạn contract:

Trường kế hoạch/ngày chi khi duyệt nhu cầu chỉ gửi nếu `/me` xác nhận vai `MANAGER` và mã phòng của người dùng trùng phòng của Request. Spending Approver được giao duyệt nhu cầu thay trưởng phòng gửi quyết định nhu cầu và xác nhận thời hạn khi cần, không gửi `spend` dành riêng cho trưởng phòng.

- Không có tìm kiếm toàn hàng đợi trên API; bộ lọc trong trang không đại diện dữ liệu toàn hệ thống.
- Chưa có hàng đợi NEED riêng; thông báo phân trang có thể chứa lượt giao cũ, chi tiết luôn kiểm tra lại quyền/trạng thái.
- API chưa cung cấp sổ quyết định toàn cục, báo cáo chi tiêu, đề xuất tối ưu hoặc khoản phí vượt mức theo các màn demo cũ. Các URL cũ này hiển thị chưa hỗ trợ; không dựng endpoint hoặc số liệu thay thế.
- Phiên bản ngân sách chưa có `sentBy`; frontend chặn người tạo từ `createdBy`, còn xung đột người gửi được BE xử lý bằng `BUDGET.OWN_VERSION`.
- Chưa kiểm thử bằng tài khoản/dữ liệu BE thật; kiểm thử tích hợp dùng HTTP adapter/MSW cô lập.

Các file `AGENTS.md`, `ARCHITECTURE.md`, `UI_UX_DESIGN_GUIDELINES.md` giữ nguyên. Mô tả hiện trạng mock trong tài liệu kiến trúc có thể cần cập nhật ở nhiệm vụ tài liệu riêng có sự cho phép.

Kiểm chứng:

- OpenAPI validate và sinh Orval từ snapshot thành công; SHA-256 snapshot: `68639fa96dc15d5ae621d121909987badde92e58373b066413b205ad4998d694`.
- Typecheck, build SPA, ESLint và Prettier trong phạm vi sửa đều thành công. Kiểm thử Node của validator/rule ESLint: 3/3 qua.
- Bộ kiểm thử liên quan gồm toàn bộ role, dashboard shell/điều hướng, i18n và tiền tệ dùng chung đã qua; có kiểm tra gửi trùng, refetch trùng, draft khi lỗi, override, trạng thái lạ và quyền trưởng phòng.
- Lần chạy toàn ứng dụng: 322/326 qua, 4 lỗi ở `super-admin/departments/organization-workflows.test.tsx` (nhãn Employee ID và designateSuccessor) và `super-admin/shared/admin-technical-presentation.test.tsx` (nhãn fallback EN/VI). Các file này không được sửa trong nhiệm vụ này.
- `pnpm check` dừng ở 27 file ngoài phạm vi chưa đạt Prettier. Chạy lint toàn dự án riêng phát hiện 5 lỗi ngoài phạm vi: 2 import chưa dùng ở Employee overview và 3 chuỗi JSX/aria-label trong test Super Admin. Không chỉnh sửa các file này để mở rộng phạm vi.
