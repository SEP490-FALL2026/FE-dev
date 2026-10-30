# Login và toast — kế hoạch thực hiện

**Mục tiêu:** Làm lại login với Motion và cài toast thống nhất cho auth, cập nhật quy tắc cho agent.

**Kiến trúc:** Giữ React Router, Query, auth-session và API hiện tại. Toaster nằm ở shared/ui, gắn một lần trong AppProviders. Đồ họa login nằm trong feature auth.

**Ràng buộc:** Giữ thay đổi chưa commit của người dùng; không sửa generated API hoặc env. Text VI/EN qua i18n. Không thông báo trong Axios interceptor để tránh trùng lặp. Không tạo số liệu sản phẩm giả.

- [x] Thêm test hồi quy cho lỗi login qua toast, đóng toast và countdown rate limit; chạy để xác nhận thất bại trước triển khai.
- [x] Cài Sonner; tạo AppToaster theo theme/i18n, gắn trong AppProviders.
- [x] Làm lại LoginPage và tách LoginShowcase/CSS; giữ redirect an toàn, pending, password toggle, validation và Retry-After.
- [x] Chuyển phản hồi thao tác auth sang toast, giữ page state có hành động khôi phục; cập nhật VI/EN.
- [x] Ghi quy tắc vào AGENTS, UI_UX_DESIGN_GUIDELINES và ARCHITECTURE.
- [x] Chạy test auth/i18n/theme, typecheck, lint, build; kiểm tra browser desktop/mobile, theme, reduced motion và toast khi có trình duyệt.

## Kết quả kiểm chứng

- Typecheck, production build, ESLint cho các file chỉnh sửa và Prettier đều qua.
- Test login/auth gồm toast ngoài form, đóng toast, giữ dữ liệu nhập, chuyển trang sau login, Retry-After và liên kết reset/invitation hết hạn đã qua review độc lập.
- Edge headless xác nhận desktop 1440px, mobile 375px, không tràn ngang, VI/EN, sáng/tối, reduced motion, toast tự ẩn trên mobile và không có lỗi runtime. Ảnh và kết quả nằm tại `../scratch/login-toast-review/`.
- `pnpm lint` toàn repo báo 285 lỗi trong các file dashboard ngoài phạm vi chỉnh sửa. Lần chạy toàn bộ test đồng thời với build/typecheck: 164/173 qua, 9 test dashboard timeout 5 giây. Chạy lại bốn file với một worker: 13/14 qua; test FIN-05 còn lại qua khi chạy riêng với `--testTimeout=15000` (thực tế 4,32 giây). Như vậy cả 173 test ứng dụng đều được xác minh qua các lượt chạy; lệnh toàn bộ ban đầu vẫn có exit code 1 do timeout. Ba kiểm thử script/ESLint rule cũng qua. Không sửa dashboard hoặc tăng timeout mặc định của dự án trong tác vụ này.
