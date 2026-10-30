# Kết quả kiểm tra tích hợp Super Admin

Ngày thực hiện: 30/10/2026. Bản đồ màn hình/API và các giới hạn contract nằm trong [super-admin-api-integration.md](super-admin-api-integration.md).

## Đã kiểm tra

- `pnpm api:validate`: pass; client được sinh bằng Orval từ `openapi/openapi.yaml` sau khi mở rộng tag filter. Không sửa tay generated code.
- `pnpm typecheck`: pass, gồm route types cho trang tạo/sửa nhân sự riêng.
- `pnpm exec vitest run --maxWorkers=2`: **64 file, 213 test pass**. Dùng hai worker để giảm tranh chấp CPU trên Windows.
- `node --test scripts/*.test.mjs eslint-rules/*.test.cjs`: **3 test pass**.
- ESLint và Prettier trên toàn bộ file authored trong phạm vi tích hợp: pass. `git diff --check`: pass.
- `pnpm build`: pass. Còn cảnh báo bundle lớn hơn 500 kB; dashboard cũ vẫn đóng gói chung nhiều role.
- Rà soát độc lập payload, quyền, lifecycle nhân sự và import: không có finding Critical/Important. Đã sửa countdown Retry-After, card mobile tài khoản và chặn đổi ngày nghỉ việc đã qua hạn.

## Smoke test trình duyệt

Chrome headless, preview bản production, API được chặn và trả dữ liệu giả lập ngay trong phiên kiểm tra; không ghi dữ liệu lên BE:

- Desktop mở Super Admin theo danh tính và vai từ `/me`, checklist lấy dữ liệu API, không còn danh tính demo cũ.
- Mobile 375 × 812: không tràn ngang, body không cuộn, tài khoản hiển thị dạng thẻ, header và sidebar giữ khung.
- CTA có màu thương hiệu đúng; form mời phủ đủ chiều rộng mobile.
- `/dashboard/super-admin/personnel/new` mở form dài trong trang, không có dialog; sidebar chuyển về đúng dashboard tab.
- Không có JavaScript exception và không có request ghi trong smoke test.

## Gate toàn repo còn lỗi nền

`pnpm check` dừng ở Prettier vì 49 file ngoài phạm vi tích hợp chưa đúng format. Chạy riêng `pnpm lint` ghi nhận 285 lỗi cũ, chủ yếu tại các màn IT Admin chưa tích hợp. Các lỗi đó không được tự động sửa lan sang role khác.

Chưa kiểm thử thao tác ghi bằng tài khoản Super Admin trên BE local. Tài liệu API nêu tài khoản này không phát cho FE trên VPS dùng chung. Kiểm thử MSW và trình duyệt xác nhận kết nối, payload, cache, lỗi, pending và layout; không thay thế nghiệm thu nghiệp vụ trên BE local cùng Owner.

Không tạo commit để giữ nguyên các thay đổi auth và cấu hình đang làm dở trong workspace của Owner.

## Chỉnh sửa tổng quan và ô tìm kiếm (30/10/2026)

- Xóa dãy nút điều hướng trùng sidebar; bổ sung khối tiến độ tương phản, ba thẻ số liệu, cảnh báo gom theo phòng và checklist có thể mở rộng. Tiến độ loại bước `NOT_AVAILABLE`; các số liệu đều lấy từ response hiện có.
- Nút kiểm tra cảnh báo mở đúng phòng bằng mã, kể cả khi nằm ở trang API tiếp theo. Bộ lọc, phân trang và lựa chọn phòng nằm trên URL để browser Back khôi phục đúng màn hình. Liên kết nhân sự mở đúng import liên quan; nhiệm vụ trung tâm chi phí giữ trách nhiệm Finance.
- Ô tìm kiếm và bộ lọc văn bản có placeholder VI/EN đặc tả nội dung cần nhập; placeholder tự ẩn khi có giá trị. Bổ sung gợi ý cho các ô nhập ID dùng trong picker/import.
- `pnpm api:validate`, `pnpm typecheck`, ESLint/Prettier trong phạm vi Super Admin, locale và test dashboard: pass. `git diff --check`: pass. Không sửa generated client trong lượt này.
- Chrome production preview với API fixture biệt lập: desktop sáng/tối, mobile 375 × 812, mở checklist, drill-down phòng và placeholder hiện/ẩn đúng. Không tràn ngang, body không cuộn, không có JavaScript exception hoặc request ghi BE.
- Rà soát độc lập phát hiện hai lỗi phân trang tra cứu mã và browser Back; đã sửa và xác nhận lại không còn finding. Bốn test điều hướng thực tế đều pass.
- Lượt test liên quan gồm 11 file/65 test: ban đầu 63 pass, hai test chạm timeout 5 giây khi chạy đồng thời build/typecheck. Chạy riêng hai suite với một worker đạt đủ 40/40, không thay code hoặc tăng timeout; tổng hợp các bài liên quan đều pass. `pnpm build` cuối: pass, còn cảnh báo bundle lớn như trước.
- `pnpm check` toàn repo vẫn dừng ở 49 file format cũ ngoài phạm vi này; không tự động format các role khác.

Ảnh và log kiểm tra cục bộ nằm tại `C:\fe_capstone\scratch\overview-*`.
