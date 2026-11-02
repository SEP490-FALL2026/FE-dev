# Nhận lời mời và kích hoạt tài khoản employee

## Điểm nhận link email

FE tiếp tục dùng route công khai hiện có:

```text
${APP_PUBLIC_URL}/activate-account#token=<invitation-token>
```

`APP_PUBLIC_URL` phải trỏ tới origin triển khai FE. Token nằm trong fragment, được đọc một lần vào bộ nhớ và xóa khỏi URL, kể cả khi định dạng không hợp lệ. Không dùng `?token=...`, không lưu token lời mời vào storage và không tự gửi redeem khi mở link.

Tài liệu `docs/Figma UI-UX/API-Integration/reference/auth-session.md` ở repository tài liệu xác nhận fragment và API bên dưới, nhưng mục redeem không ghi pathname của email mời. `/activate-account` là pathname đã có trong FE. Chưa kiểm chứng template email BE hoặc việc gửi/nhận email thật; cần đối chiếu link của email môi trường tích hợp với URL trên.

## Luồng được hoàn thiện

1. Employee mở link, nhập mật khẩu mới và xác nhận. FE kiểm tra độ dài 12–128 ký tự và hai trường khớp nhau; giữ nguyên khoảng trắng của mật khẩu.
2. Gọi `POST /api/v1/auth/invitations/redeem` với `{ token, password }` bằng generated client. Request không mang Authorization của phiên khác, không refresh và không tự retry. Nút gửi có spinner và chặn gửi lặp trong lúc pending.
3. Thành công: toast xác nhận rồi điều hướng thay thế sang `/login`. BE không trả phiên đăng nhập; employee đăng nhập bằng email tài khoản và mật khẩu vừa đặt.
4. Thiếu/sai/hết hạn/đã dùng/thay thế token: bỏ form, hướng dẫn liên hệ Super Admin gửi lại. Giữ lựa chọn đăng nhập nếu người dùng đã gửi yêu cầu kích hoạt trước đó.
5. Lỗi mạng hoặc 5xx: giữ form và hướng dẫn thử đăng nhập bằng mật khẩu vừa đặt vì chưa chắc yêu cầu trước thất bại. Chỉ gửi lại khi người dùng chủ động thao tác. Lỗi validation gắn với đúng trường; rate limit có countdown. Nội dung đủ VI/EN.

## Kiểm chứng

- TDD: lần chạy đầu có 15 test thất bại, xác nhận các khoảng trống về token, điều hướng, recovery và accessibility trước khi sửa; một test cooldown được điều chỉnh để chờ timer thật.
- Test tập trung: 25/25 pass trong hai file invitation và auth-action-page; 21 case invitation kiểm thử route thật, generated API/Axios qua MSW và cả hai ngôn ngữ.
- `pnpm vitest run app/features/auth`: 54/54 test pass trong 8 file.
- `pnpm typecheck`: pass.
- `pnpm build`: pass; có đầu ra route `activate-account`. Build có cảnh báo chunk lớn hơn 500 kB.
- ESLint cho bốn file TS/TSX thay đổi: pass. Review độc lập không ghi nhận vấn đề cần sửa; scoped `git diff --check` pass.
- `pnpm check`: dừng ở Prettier, báo 27 file ngoài phạm vi thay đổi.
- `pnpm lint`: 5 lỗi ngoài phạm vi: unused imports ở employee overview và hardcoded JSX/attribute ở hai test Super Admin.
- `pnpm test`: Vitest có 344/348 test pass (86/88 file pass). Bốn lỗi nằm trong hai file ngoài auth:
  - `app/features/dashboard/super-admin/departments/organization-workflows.test.tsx`: hai case không tìm được label `Employee ID`.
  - `app/features/dashboard/super-admin/shared/admin-technical-presentation.test.tsx`: hai case mong tên accessible `Setup step` / `Bước thiết lập`, trong khi UI dùng nhãn bước chưa xác định.
  - Các test Node trong scripts/eslint-rules ở phần sau lệnh `pnpm test` không chạy vì Vitest trả exit code 1.

Test dùng HTTP fixture, không thay thế kiểm chứng tích hợp email và BE thật. Các kiểm tra toàn workspace có lỗi ngoài auth được giữ nguyên để tránh thay đổi công việc khác của người dùng.
