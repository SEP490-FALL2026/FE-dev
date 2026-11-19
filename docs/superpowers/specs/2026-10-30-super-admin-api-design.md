# Super Admin — tích hợp API thật

Yêu cầu đã được Owner cho phép triển khai trực tiếp trong workspace hiện tại; giữ toàn bộ thay đổi auth chưa commit. Nguồn: AGENTS.md, ARCHITECTURE.md, UI_UX_DESIGN_GUIDELINES.md, OpenAPI snapshot và `../docs/Figma UI-UX/API-Integration` (BE 25d524477406). Contract máy đọc được thắng flow prototype cũ khi khác nhau.

## Thiết kế

- Orval sinh các tag phục vụ Super Admin từ snapshot đã có; không sửa generated code. Query và mutation qua shared Axios/auth adapter và TanStack Query.
- Accounts: chọn hồ sơ nhân viên để mời, đọc tài khoản/activation riêng, khóa/mở kèm lý do, cấp/thu hồi vai trực tiếp, quản lý ba trách nhiệm phê duyệt, chuyển giao Super Admin có xác nhận. MANAGER và SPENDING_APPROVER không nằm trong picker cấp vai trực tiếp.
- Departments: danh sách và chi tiết, tạo/sửa/ngừng dùng, trưởng phòng/người kế nhiệm, thành viên và dự án. Nhân sự đổi phòng qua sự kiện có căn cứ, không sửa mảng thành viên trên FE.
- Personnel: tạo/sửa hồ sơ chính thức, import xem trước/xác nhận với idempotency key; ghi/điều chỉnh/hủy điều chuyển, nghỉ dài hạn, nghỉ việc; xử lý BM-09. Chỉ hiện thao tác của Super Admin trong contract, không làm thay IT Admin.
- Overview: checklist và watch từ BE. Reminders/settings: tham số vận hành, lịch nghỉ, tiền tệ báo cáo. Audit: lọc và phân trang phía BE. Không dựng lại biểu đồ/KPI không có nguồn API.
- Mỗi slice sở hữu hooks/components/enums. Enum dùng tập mã generated, nhãn VI/EN và fallback trung tính; mã không biết không mở thao tác thay đổi trạng thái.
- Loading/error/retry/empty riêng, phân trang server, mutation pending chống gửi lặp, toast sau phản hồi BE, giữ form khi lỗi. Không tự retry mutation. 409/404/response không xác định cần đọc lại dữ liệu.
- Giữ design tokens, shell cố định, một primary CTA, bảng responsive, actions menu, form 4–10 trường dùng drawer; text qua i18n.
- Xóa toàn bộ fixture/handlers demo của Super Admin và auth đã hết dùng; giữ fixture của role khác và fixture chỉ phục vụ test. Định danh thiết bị, mô phỏng gửi email nhắc không có API nên loại khỏi luồng thật.

## Kiểm chứng

Test request payload/phân trang, loading/error/empty, thất bại giữ form, pending chặn double submit, invalidation sau thành công, status lạ và quyền. Chạy api:validate/generate, test liên quan, typecheck và pnpm check. Không ghi dữ liệu lên VPS chung để thử Super Admin.
