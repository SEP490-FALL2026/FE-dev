# E2E (Playwright)

Chạy có giao diện, mỗi thao tác chờ 1–2 giây, con trỏ đỏ + nhãn "click/type …" hiện trên trang để quan sát.

## Cài đặt

```bash
npm install
npx playwright install chromium   # Ubuntu 26.04: PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64
```

Tạo `.env.e2e` (git bỏ qua, không commit):

```
E2E_SEED_PASSWORD=...            # mật khẩu chung của tài khoản seed
E2E_SUPER_ADMIN_EMAIL=...
E2E_SUPER_ADMIN_PASSWORD=...
E2E_EMPLOYEE_EMAIL=...
E2E_EMPLOYEE_PASSWORD=...
```

## Chạy

```bash
npm run e2e                                  # có UI, toàn bộ
npx playwright test e2e/spending-approver.spec.ts
npx playwright test --ui                     # Playwright UI mode
npm run e2e:headless                         # không hiện trình duyệt
E2E_FAST=1 npm run e2e:headless              # bỏ độ trễ, để kiểm tra nhanh
```

Biến tuỳ chọn: `E2E_DELAY_MIN` / `E2E_DELAY_MAX` (ms, mặc định 1000/2000), `E2E_SLOW_MO`, `E2E_BASE_URL`
(đặt thì không tự mở dev server). Dev server dùng `API_PROXY_TARGET` trong `.env`.

## Kết quả

- `test-results/findings.md`: mọi lỗi 4xx/5xx của API, lỗi console, thông báo lỗi hiện trên màn hình, gom theo test.
- 5xx và exception không bắt được làm test fail; 4xx chỉ ghi lại (nhiều mã là đáp án hợp lệ, ví dụ `AI.DISABLED`).
- `npm run e2e:report` mở báo cáo HTML kèm video, trace.

Test chỉ đọc hoặc dừng trước bước ghi (không gửi/lưu nháp/duyệt/từ chối) vì backend là máy chủ dùng chung.
Riêng bấm "Tóm tắt N yêu cầu" của AI có tạo một bản ghi lần gọi AI.
