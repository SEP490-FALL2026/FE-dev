# Rà soát khởi tạo frontend — 30/10/2026

## Nguyên nhân và bản sửa

1. Tailwind tự dò class từ root, bao gồm tài liệu và `.agents/skills/`. Đo bằng scanner hiện có: 743 file / khoảng 9,6 giây; chỉ quét `app/`: 520 file / khoảng 0,2 giây. `app/app.css` dùng `source('./')` để giới hạn phạm vi. Đây là phép đo riêng của scanner, không phải thời gian khởi động toàn ứng dụng.
2. Log dev ghi nhận Vite phát hiện muộn `axios`, `sonner`, tối ưu dependency lại và reload. Đã thêm hai dependency vào `optimizeDeps.include`. Vẫn giữ cơ chế cache của Vite, không xóa cache mỗi lần dev.
3. Route import trực tiếp workspace nên khách chưa đăng nhập cũng tải 232 module dashboard. Đã thêm `DashboardEntry` lazy-load bên trong `RoleGuard`, áp dụng cho cả sáu route role và route tham số. Lượt đo sau chỉ tải một module dashboard entry trước khi về login; tổng request giảm từ 384 xuống 151 trong ngữ cảnh browser mới và cache dependency đã có.
4. Axios chưa có timeout, nên API refresh hoặc `/me` có thể giữ trạng thái kiểm tra phiên vô hạn. Đã đặt mặc định 15 giây/request và tắt retry tự động cho `/me` trong auth bootstrap. Lỗi tạm thời giữ refresh token, chuyển sang giao diện thử lại hiện có. Timeout tính riêng từng request, không phải toàn bộ chuỗi refresh + `/me`.
5. `/me` có thể bị TanStack Query pause khi browser phát sự kiện offline, trước khi HTTP timeout bắt đầu. Query bootstrap dùng `networkMode: 'always'` để HTTP trả lỗi mạng/timeout và kết thúc trạng thái checking; không thay đổi network mode toàn ứng dụng.

## Phạm vi kiểm chứng

- Test hồi quy: timeout mặc định, `/me` không tự retry, giữ token và phục hồi sau timeout refresh/profile, browser offline khi chuyển từ refresh sang profile.
- Trình duyệt Edge headless, API được chặn và trả response theo contract để không cần dùng tài khoản thật: API treo, thử lại không reload, mở cả sáu role, sai role hiển thị 403 và không tải workspace.
- Typecheck, production build, ESLint và Prettier cho các file sửa. Log và công cụ đo cục bộ ở `C:/fe_capstone/scratch/`.
- Lượt regression cuối: `pnpm vitest run app/features/auth app/shared/api/axios-client.test.ts app/routes/dashboard.test.tsx --maxWorkers=1 --testTimeout=15000` qua 8 file / 33 test. Typecheck và production build cuối đều exit 0; build còn cảnh báo chunk lớn như phần giới hạn bên dưới.
- Ba file test lọc bảng chạm giới hạn 5 giây (`finance/list-filters-spend`, `finance/list-filters-planning`, `approvals/approver-list-filters-queue`) đã chạy lại với `--maxWorkers=1 --testTimeout=15000`: qua 11/11 test, không sửa logic bảng hoặc tăng timeout mặc định của repo.
- Lượt Vitest toàn repo với `--maxWorkers=1` hoàn tất: 174/177 test qua; 3 test còn lại chính là các test lọc bảng timeout 5 giây đã qua khi chạy lại ở trên. Không mô tả lệnh kiểm tra mặc định toàn repo là đã xanh.
- `pnpm check` toàn repo dừng tại bước Prettier: 92 file chưa đúng định dạng. Chạy riêng lint toàn repo ghi nhận 285 lỗi ở source hiện có ngoài phạm vi bản sửa. Không format hoặc refactor hàng loạt những file đó trong nhiệm vụ này.

## Giới hạn

- Các số đo phụ thuộc cache, phần cứng và tải CPU. Lần đầu sau thay đổi lockfile/config vẫn cần pre-bundle dependency; không suy diễn một mẫu đo thành cam kết thời gian tải.
- Workspace sau khi xác thực vẫn gom các màn hình của sáu role trong `DashboardPage`; production build còn cảnh báo chunk dashboard khoảng 1,5 MB trước gzip. Bản sửa này tách workspace khỏi đường khởi tạo/xác thực; chưa chia từng màn hình thành chunk riêng.
- Kiểm chứng trình duyệt dùng API kiểm soát, không xác nhận độ trễ hoặc tính sẵn sàng của backend triển khai thực tế.

Tham khảo: [Vite dependency pre-bundling](https://vite.dev/guide/dep-pre-bundling.html), [Tailwind source detection](https://tailwindcss.com/docs/detecting-classes-in-source-files), [TanStack Query network mode](https://tanstack.com/query/latest/docs/framework/react/guides/network-mode).
