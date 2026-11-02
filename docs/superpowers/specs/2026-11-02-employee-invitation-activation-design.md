# Hoàn thiện trang nhận lời mời kích hoạt tài khoản

Ngày: 2026-11-02. Trạng thái: đã triển khai theo phương án người dùng duyệt; kết quả kiểm chứng tại `docs/reviews/2026-11-02-employee-invitation-activation.md`.

## Mục tiêu và nguồn

Employee mở liên kết từ email mời do Super Admin tạo, đặt và xác nhận mật khẩu, kích hoạt tài khoản qua BE rồi đăng nhập.

Nguồn contract: `../../../../docs/Figma UI-UX/API-Integration/reference/auth-session.md`, mục `authRedeemInvitation`; mục tạo tài khoản và gửi lại lời mời trong `accounts-and-roles.md` cùng thư mục.

Code hiện có đã khai báo `/activate-account` trong `app/routes.ts`; route `app/routes/activate-account.tsx` render `AuthActionPage` với `action='activate'`. Trang đã đọc fragment, xóa fragment khỏi URL, gọi generated API và xử lý lời mời không hợp lệ. Vì vậy công việc là hoàn thiện trang có sẵn, tránh tạo một URL kích hoạt thứ hai.

Tài liệu xác nhận token nằm ở `#token=...` nhưng mục redeem không ghi cụ thể pathname của link email mời. `/activate-account` là URL hiện có của FE; không khẳng định đã kiểm chứng template email BE. Liên kết tương thích của FE là `${APP_PUBLIC_URL}/activate-account#token=...`.

## Phương án

1. **Đề xuất: hoàn thiện trang auth hiện có.** Giữ route và giao diện hiện hành, bổ sung điều hướng sau thành công, thông báo riêng cho kết quả chưa chắc chắn và kiểm thử luồng mời. Ít thay đổi, giữ nhất quán với các trang mật khẩu.
2. Tách một trang kích hoạt độc lập trong feature auth. Dễ phát triển UI riêng nhưng phải tách shell hoặc lặp giao diện, trong khi luồng chỉ có hai trường nhập và một mutation.

## Thiết kế được đề xuất

- Trang công khai `/activate-account` tiếp nhận token từ fragment. Không lấy token từ query string, không lưu vào storage, không tự gọi redeem khi mở link. Token giữ trong bộ nhớ và được xóa khỏi thanh địa chỉ bằng replaceState.
- Thiếu token, token trắng, token dài hơn 256 ký tự hoặc token xuất hiện nhiều lần: hiển thị trạng thái liên kết không hợp lệ, hướng dẫn nhờ Super Admin gửi lại lời mời; không gửi API. BE quyết định hiệu lực token còn lại.
- Form gồm mật khẩu và xác nhận, autocomplete phù hợp, hướng dẫn 12–128 ký tự. Không trim mật khẩu. Không gửi khi hai trường chưa khớp hoặc độ dài sai; thông báo validation liên kết với trường nhập. Nội dung có đủ VI/EN.
- Submit dùng generated `authRedeemInvitation({ token, password })` qua TanStack Query, với `skipAuth: true`, `skipAuthRefresh: true`, không retry mutation tự động. Disable gửi trong lúc pending và hiển thị spinner.
- Sau response thành công, toast xác nhận rồi chuyển tới `/login` bằng replace. Không tự đăng nhập, không tạo session từ response kích hoạt, không tự chọn role employee: quyền đăng nhập lấy từ BE.
- `AUTH.INVITATION_INVALID`: thay form bằng trạng thái liên kết không dùng được và hướng dẫn nhờ Super Admin gửi lại. Giữ đường dẫn đăng nhập cho người đã kích hoạt.
- `VALIDATION_ERROR`: ánh xạ field `password` theo issue path; `AUTH.PASSWORD_POLICY_VIOLATION`: hướng dẫn sửa mật khẩu. Giữ dữ liệu khi lỗi có thể thử lại.
- `SERVICE_UNAVAILABLE`, lỗi 5xx hoặc mất phản hồi: toast riêng giải thích chưa xác định được kết quả; hướng dẫn thử đăng nhập bằng mật khẩu vừa đặt, hoặc chủ động thử lại. Không tự gửi lại. Nếu lần thử lại báo lời mời không dùng được, hướng dẫn đăng nhập vẫn có sẵn.
- Rate limit tiếp tục dùng Retry-After và countdown hiện có.

## Phạm vi file

- `app/features/auth/auth-action-page.tsx`: hoàn thiện hành vi kích hoạt trong trang hiện có; giữ các nhánh mật khẩu khác theo hành vi hiện hành.
- Helper token nhỏ trong feature auth nếu cần tách parse/validation để kiểm thử trực tiếp.
- `app/shared/i18n/locales/{vi,en}/auth.ts`: thông báo và hướng dẫn riêng cho kích hoạt.
- Test riêng cho luồng invitation trong feature auth, sử dụng HTTP fixture có type và chỉ nằm trong test.
- Ghi chú URL email tích hợp và kết quả kiểm chứng trong tài liệu review của thay đổi.

Không sửa generated code, API contract, chức năng mời của Super Admin hoặc các tài liệu quy tắc được bảo vệ. Không tự commit/push/deploy.

## Kiểm chứng

Kiểm tra route thật nhận fragment, xóa token khỏi URL, không submit trước thao tác, payload và endpoint đúng, không Authorization/refresh kể cả có session khác; validation phía client; chặn gửi lặp trong pending; thành công chuyển login; link thiếu/sai/hết hạn/đã dùng; lỗi policy/validation; 503 hoặc lỗi mạng không retry tự động; thao tác thử lại; cooldown 429; VI/EN.

Chạy test auth liên quan, `pnpm typecheck` và `pnpm check`. Phân biệt lỗi đã có ở workspace với lỗi do thay đổi mới. Không mô tả kiểm thử bằng HTTP fixture là đã kiểm tra email hoặc BE thật.

## Tự rà soát

Phạm vi chỉ gồm điểm nhận link và kết thúc kích hoạt. Contract request/response rõ ràng; không phát sinh endpoint kiểm tra lời mời hoặc API gửi lại công khai. Path email BE chưa có bằng chứng được ghi rõ thay vì tạo alias theo suy đoán. Code được triển khai sau khi người dùng duyệt đề xuất.
