# Chuẩn hóa quản trị công nghệ thông tin theo hướng dẫn máy chủ

**Mục tiêu:** sửa ánh xạ và luồng quản trị theo contract 423 operation của ngày 16/11/2026; giữ các thay đổi đang có của người dùng.

**Thiết kế:** giữ kiến trúc chức năng dọc, dữ liệu máy chủ qua Orval và TanStack Query. Điều hướng phòng ban → thành viên → phần mềm → dữ liệu sử dụng. Nội dung dài thay thế danh sách bằng trang chi tiết; xác nhận và form ngắn dùng hộp thoại. Không tự sửa ba tài liệu quy tắc được bảo vệ.

**Công nghệ:** React Router, React Query, TypeScript, i18next, Recharts, Vitest.

## Ràng buộc

- UI tiếng Việt và tiếng Anh tách theo ngôn ngữ; diễn đạt đầy đủ, không hiện mã quy tắc hay enum như nhãn nghiệp vụ.
- Trường bắt buộc có dấu sao đỏ; mọi trường có mô tả và liên kết mô tả truy cập được.
- Không tự tính tiền bằng số thực, không tạo dữ liệu sử dụng/credential, không suy không sử dụng từ thiếu dữ liệu.
- Chỉ xác nhận ghi thành công sau phản hồi máy chủ; khóa gửi lặp và đọc lại sau kết quả không xác định.
- Luồng nghỉ việc dựa vào mốc chặn truy cập, thu hồi từng quyền, hệ thống tự đóng. Luồng điều chuyển giữ ân hạn, thu hồi tại phòng mới, không có nút đóng thủ công.

## Công việc

- [x] Đọc quy tắc dự án, hướng dẫn chung, vai quản trị, luồng nghỉ việc/điều chuyển và feedback cũ; kiểm tra trạng thái Git trước sửa.
- [x] Xác minh Swagger trực tiếp; sinh lại client bằng cấu hình hiện có, đối chiếu operation và enum hướng dẫn.
- [x] Sửa hồi quy nghỉ việc/điều chuyển, trạng thái an toàn, liên kết tác vụ chính xác và điều hướng giữ ngữ cảnh.
- [x] Hoàn thiện mức sử dụng, nguồn nhập, biểu đồ và chuyển khuyến nghị có danh sách kiểm tra theo chính sách.
- [x] Chuyển chi tiết/lịch sử thiết bị dài sang trang riêng, giữ biểu mẫu ngắn và chọn nhân viên theo phòng.
- [x] Chuẩn hóa cấp phát/danh mục phòng ban/chứng từ theo contract mới; rà lại field và bản dịch trong phạm vi.
- [x] Chạy test liên quan, kiểm tra kiểu, chất lượng mã và build; rà diff, báo giới hạn kiểm chứng và chỗ tài liệu/API mâu thuẫn.

## Kiểm chứng

Kiểm thử hành vi bằng phản hồi API ở biên HTTP: tải/rỗng/lỗi, điều hướng, payload chính xác, pending, không gửi lặp và không thay đổi trạng thái giả. Chạy `pnpm api:validate`, `pnpm api:generate`, `pnpm typecheck`, `pnpm vitest run app/features/dashboard/it-admin`, sau đó `pnpm check`. Không thực hiện ghi dữ liệu lên môi trường demo để kiểm thử.

## Nguồn

`../docs/Figma UI-UX/API-Integration/README.md`, `conventions.md`, `roles/it-admin.md`, `flows/offboarding.md`, `flows/department-transfer.md`, các trang reference tương ứng và Swagger trực tiếp. Feedback cũ là ý định giao diện; không dùng làm bằng chứng endpoint/field đã tồn tại.
