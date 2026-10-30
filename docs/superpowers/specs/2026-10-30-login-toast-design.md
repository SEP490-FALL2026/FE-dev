# Login và thông báo thao tác

Thiết kế theo yêu cầu làm lại login của người dùng: bỏ hai thẻ mô tả, thay bằng panel thương hiệu xanh đậm với đồ họa kết nối phần mềm và chuyển động nhẹ. Form dùng token theme hiện có, giữ email, mật khẩu, hiện/ẩn mật khẩu, quên mật khẩu và đổi ngôn ngữ/theme. Mobile ưu tiên form, không tải ảnh ngoài. Motion và CSS tôn trọng prefers-reduced-motion.

Dùng Sonner với một Toaster trong AppProviders, theo theme và i18n, tự ẩn, có nút đóng, giới hạn ba thông báo cùng lúc. Kết quả login và thao tác auth dùng toast từ callback mutation. Không thay đổi contract, token storage, redirect an toàn hoặc RBAC. Lỗi validation vẫn đánh dấu đúng input; Retry-After hiện đếm ngược ở nút để không phụ thuộc toast còn hiển thị.

Các trang forgot/reset/activate/change dùng toast cho phản hồi thao tác; trạng thái trang không thể thao tác (thiếu token, không kiểm tra được phiên) giữ nội dung giải thích và hành động khôi phục. Hướng dẫn agent phân biệt phản hồi thao tác tạm thời và trạng thái trang/validation lâu dài.

Kiểm chứng: test API adapter thật qua login, thông báo ngoài form có thể đóng, rate limit và countdown, luồng auth hiện có; typecheck, lint, build và kiểm tra trình duyệt desktop/mobile nếu có công cụ.
