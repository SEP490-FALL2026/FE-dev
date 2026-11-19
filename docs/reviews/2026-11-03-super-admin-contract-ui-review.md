# Super Admin: đối chiếu API và giao diện ngày 03/11/2026

## Nguồn đối chiếu

- Đã đọc `AGENTS.md`, `ARCHITECTURE.md`, `UI_UX_DESIGN_GUIDELINES.md`, hướng dẫn tích hợp, quy ước và reference theo vai trong `../docs/Figma UI-UX/API-Integration/`.
- Contract đích: BE `dev 30d14ac4`, 302 operation. Snapshot OpenAPI và generated client hiện có đã chứa `employeeList`, `employeeGet`, `employeeFirstPlacement`, `superAdminDashboardGet`; không cần sinh lại client và không sửa tay generated code trong lần này.
- Kiểm tra Swagger trực tiếp lúc 21:19 ngày 03/11/2026 (Asia/Bangkok): VPS hiện có 302 operation, 262 path. So sánh chuẩn hóa toàn bộ `paths` và `components.schemas` với snapshot FE: **không có khác biệt**. Thông tin “chưa deploy” trong README đã cũ; kiểm tra này xác minh contract HTTP, không chứng minh toàn bộ nghiệp vụ/DB.
- Kế hoạch UI mẫu cũ có quy tắc một role/tài khoản và thao tác mô phỏng. Luồng production dùng contract mới: `roles` là mảng, gán vai trực tiếp, BE quyết định tổ hợp được phép; không đưa nghiệp vụ mô phỏng vào ứng dụng.
- Giữ nguyên ba tài liệu quy ước được bảo vệ và các thay đổi có sẵn trong workspace.

## Kết quả

### Tổng quan

Gọi dashboard Super Admin cùng checklist/watch. Chỉ hiện số nguyên hợp lệ khi `state=COUNTED`; `AT_SOURCE` mở đúng màn nguồn, `NOT_AVAILABLE` không thay bằng 0. Làm mới đồng thời ba query. Ứng viên tài khoản mở ngay form mời; cấu hình Người duyệt chi mở danh sách theo role; thông báo nhân sự mở tab BM-09; tình trạng người giữ Super Admin dẫn đến khối watch hiện có.

### Nhân sự và import

Danh bạ toàn công ty dùng tìm kiếm `q`, sáu bộ lọc BE và phân trang. Hồ sơ lấy từ API chi tiết, có lịch sử xếp phòng và trạng thái tài khoản/vai. Người chưa xếp phòng có luồng xếp lần đầu; ngày không trước ngày vào làm hoặc ngày local hiện tại, BE kiểm tra ngày nghiệp vụ cuối cùng. Người đã xếp phòng dùng luồng điều chuyển.

Liên kết hồ sơ → sửa thông tin/tài khoản và thành viên phòng → hồ sơ dùng ID chính thức. Tab nhân sự đồng bộ URL và Back. Mutation làm mới danh bạ, chi tiết đã cache, nguồn chọn nhân viên và dashboard bị ảnh hưởng.

Import vẫn giữ hai bước xem trước/xác nhận và idempotency key. Bổ sung tóm tắt nhân viên chưa xếp phòng, số mới theo phòng, phòng thiếu trưởng và hàng cần rà soát theo số liệu BE. Hướng dẫn đã sửa `department_code` thành tùy chọn; để trống tạo nhân viên chưa xếp phòng.

### Phòng ban và tài khoản

Form sửa phòng gửi PATCH chỉ các trường đổi, sau đó gọi riêng gán/để trống trưởng phòng. Picker trưởng phòng lọc `MANAGER`, phòng và ngày hiệu lực. Khi lưu một phần, giữ draft và không gửi lại PATCH đã chấp nhận. Kết quả ghi không rõ được đọc lại; người dùng đối chiếu trước khi thử tiếp. Lỗi 403 cập nhật `/me`; lỗi schema sử dụng đường dẫn field để gắn trạng thái invalid/mô tả.

Tài khoản hỗ trợ deep link từ hồ sơ và dashboard; cấp/thu hồi vai dùng contract trực tiếp. Bổ sung ánh xạ lỗi Người duyệt chi, Manager còn phụ trách phòng và tài khoản chưa đủ điều kiện. Loại bỏ picker bàn giao Super Admin đã không còn dùng; không gọi API bàn giao đã gỡ.

### Tham số và giao diện

Tên, nhóm và đơn vị tham số lấy từ `label`, `groupLabel`, `unitLabel` BE. Editor dựng từ constraints `int`, `enum`, `int-list`, kiểm tra miền giá trị/độ dài/thứ tự nghiêm ngặt và gửi đúng kiểu JSON. Kind lạ chỉ đọc; giá trị lạ được hiển thị JSON an toàn.

Thêm placeholder VI/EN, màu pressed/selected, focus bàn phím, pending/disabled và màu hàng bảng. Thanh tab nhân sự nằm một hàng cuộn ngang trên mobile. Vùng nội dung giữ trong App Shell; đã sửa containing block khiến tiêu đề bảng ẩn tạo cuộn dư. Nút liên kết tên nhân viên có vùng bấm tối thiểu 44px trên mobile.

Tham khảo [Carbon data table](https://www.carbondesignsystem.com/building-blocks/core/components/data-table/specifications) về trạng thái và toolbar, [Atlassian textfield](https://atlassian.design/components/textfield/code) về gợi ý nhập và nhãn trường.

## Kiểm chứng

- `pnpm api:validate`: đạt; snapshot có 302 operation.
- `pnpm typecheck`: đạt.
- `pnpm lint`: đạt.
- `pnpm test`: 117 file / 553 test Vitest đạt; 3 test Node đạt.
- Chạy lại riêng Super Admin sau review: 19 file / 73 test đạt.
- Sau khi nối thành viên phòng tới hồ sơ qua `employeeId`: test workflow phòng ban 8/8 đạt, typecheck đạt.
- `pnpm build`: đạt; còn cảnh báo kích thước chunk hiện có.
- Prettier phạm vi Super Admin, form dùng chung và locale admin: đạt.
- `pnpm check`: lượt cuối chưa đạt vì bước Prettier toàn repository phát hiện **15 file ngoài phạm vi** chưa đúng định dạng, gồm `.codex/instructions.md`, `.github/copilot-instructions.md`, các locale role khác và tài liệu gốc. Không tự format các tài liệu/chức năng ngoài phạm vi để làm lệnh xanh.
- Review chéo các luồng nhân sự, tài khoản, phòng ban và tham số đã xử lý các phát hiện quan trọng.

## Kiểm tra trình duyệt

Edge headless với API giả lập theo contract, 1440×1000 và 375×812, light/dark:

- Không có exception JavaScript hoặc request ghi dữ liệu thật.
- Tab được chọn có màu nền khác trạng thái thường; form email và hồ sơ có placeholder đúng ngôn ngữ.
- KPI ứng viên mở `?tab=accounts&action=invite` và form mời tương ứng.
- Mobile: `scrollWidth=375`, chiều cao tài liệu 812 bằng viewport; body không cuộn, main cuộn riêng; font input 16px.
- Kết quả và ảnh nằm tại `C:/fe_capstone/scratch/super-admin-20261103-browser-result.json` và các ảnh cùng tiền tố.

## Giới hạn kiểm thử môi trường thật

Tài khoản Super Admin không phát cho FE trên VPS dùng chung theo tài liệu. Đã xác minh contract HTTP trực tiếp khớp snapshot, nhưng chưa xác minh đăng nhập/thao tác Super Admin trên BE thật; cần môi trường local có seed hoặc phiên cùng Owner. Không dùng mật khẩu các role khác để suy ra quyền Super Admin, không lưu mật khẩu/token vào source hoặc báo cáo.

Ngày tối thiểu trên form hỗ trợ người dùng theo lịch trình duyệt; BE vẫn quyết định ngày nghiệp vụ của tổ chức.
