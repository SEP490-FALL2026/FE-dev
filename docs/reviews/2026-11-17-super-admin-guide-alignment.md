# Kiểm tra tích hợp Super Admin — 17/11/2026

## Phạm vi và nguồn đối chiếu

Đối chiếu `../docs/Figma UI-UX/API-Integration/roles/super-admin.md`, reference theo nhóm, các flow tài khoản, nhân sự, chính sách, quyền không sử dụng và client Orval hiện có. Giữ nguyên `orval.config.ts`, thư mục generated và ba tài liệu quy tắc được bảo vệ. Không ghi dữ liệu lên backend dùng chung, không commit hoặc triển khai.

Mã đã có trước nhiệm vụ, đặc biệt phần IT Admin và các sửa đổi Super Admin của người dùng, được giữ lại và phát triển tiếp. Bản diff nền được lưu tại `../scratch/super-admin-20261117-baseline.diff`.

## Thay đổi

| Nhóm                 | Kết quả                                                                                                                                                                                                                                                                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Chính sách           | Sửa chữ ký hook, field response, namespace dịch và phân trang. Trang đọc, soạn đầy đủ các mục và điều kiện kiểm tra, lịch sử phiên bản, báo cáo xác nhận có đường dẫn riêng. Chặn công bố khi còn sửa chưa lưu; xác nhận công bố và hủy nháp bằng hộp thoại. Bảo toàn các bước hệ thống và xử lý cache nháp cũ.                                              |
| Tài khoản            | Cho phép chủ động gỡ chặn nghỉ việc trên tài khoản vẫn `ACTIVE`. Tạo tài khoản dùng thư điện tử công việc từ hồ sơ thay vì cho nhập địa chỉ đăng nhập khác. Bổ sung bàn giao ứng dụng qua danh sách phần mềm phòng ban và người quản trị hợp lệ. Chi tiết tài khoản thay thế danh sách.                                                                      |
| Nhân sự              | Chi tiết nghỉ việc, quyền cần thu hồi, lý do chưa đóng, lịch sử thay đổi; chi tiết điều chuyển, quyền cũ, ân hạn, ảnh chụp và ngân sách giải phóng; chi tiết nghỉ dài hạn, thông báo và import. Giữ xác nhận import cùng khóa idempotency. Thêm trường kết thúc hợp đồng có kiểm tra biên và ẩn với nhân viên không thời hạn.                                |
| Quyền không sử dụng  | Ngưỡng theo ứng dụng, khôi phục mặc định, tỷ lệ chấp nhận khuyến nghị, kiểm tra quyết định, lịch sử và chạy phát hiện, trang riêng cho lý do bỏ qua. Chỉ đọc quyết định của trưởng phòng.                                                                                                                                                                    |
| Vận hành             | Báo cáo thời hạn thu hồi có lọc và phân trang, yêu cầu không qua duyệt nhu cầu, mốc thuê bao bị bỏ lỡ. Chi tiết công việc tắc nghẽn thay thế danh sách.                                                                                                                                                                                                      |
| Thiết lập            | Thông báo theo dõi máy công ty và trang công bố mới. Khi lần đầu bật thu thập trạng thái công cụ, bắt buộc xác nhận đã đọc lại. Tiền tệ báo cáo chỉ đọc.                                                                                                                                                                                                     |
| Tổng quan            | Hiển thị các chỉ số nhân sự, điều chuyển, suất hoàn trả và cảnh báo người quản trị nhà cung cấp bị thiếu; hiển thị khoảng lịch ngày làm việc. Không đổi trạng thái thiếu nguồn thành số không.                                                                                                                                                               |
| Kiểm toán            | Chi tiết sự kiện chuyển thành trang; nhãn hành động và trường dữ liệu có bản dịch, bằng chứng nguyên bản tải riêng. Nội dung trí tuệ nhân tạo chỉ đọc khi chủ động yêu cầu, không tự thử lại hay đọc lại khi chuyển tiêu điểm.                                                                                                                               |
| Biểu mẫu và ngôn ngữ | Trường bắt buộc có dấu sao đỏ, trường tùy chọn không có; mô tả và lỗi được liên kết qua thuộc tính trợ năng. Nhãn tham số và lựa chọn được dịch theo ngôn ngữ, không dùng mô tả tiếng Anh của backend trong giao diện tiếng Việt. Nội dung do người dùng soạn và tên phần mềm giữ nguyên bản gốc. Lịch sử ngắn mở hộp thoại, nội dung dài mở trang thay thế. |

## Kiểm chứng thực chạy

- Bộ Vitest Super Admin, form dùng chung và tài nguyên dịch: **32 file, 124 test đều qua**.
- ESLint trong Super Admin, form dùng chung và các bản dịch quản trị: **qua**.
- Prettier cùng phạm vi: **qua**.
- `git diff --check`: **qua**.
- 240 lượt import từ generated trong Super Admin: **không có đường dẫn thiếu**.
- Không có file TypeScript hoặc TSX nào trong Super Admin vượt 500 dòng.
- 100 operation liên kết trong phần danh mục vai Super Admin đều có tham chiếu trong mã chạy của phân hệ. Đây là đối chiếu tĩnh, không phải 100 thao tác đã được thử trên backend thật.
- Đóng gói riêng `super-admin-screen.tsx` bằng Vite production library mode: **qua**, đầu ra kiểm tra tại `../scratch/super-admin-20261117-bundle/`. Đây không phải bản dựng triển khai của toàn ứng dụng.
- `pnpm typecheck`: toàn dự án còn **130 lỗi**, không có lỗi thuộc Super Admin, bản dịch quản trị hoặc form dùng chung vừa chỉnh.
- `pnpm build`: bị chặn ở Finance do thiếu export `useBudgetCyclePublish` và `useBudgetDepartmentCeilingsSet` trong client generated hiện tại.
- `pnpm api:validate`: không kết nối được Swagger tại `wdp.novaproj.site:443` sau cả lần thử ngoài sandbox. Không generate lại hoặc thay dữ liệu contract bằng snapshot tự tạo.

Nhật ký kiểm tra ở `../scratch/super-admin-20261117-*-final.log`; nhật ký build ở `../scratch/super-admin-20261117-build.log`.

## Giới hạn cần lưu ý

1. `EmployeeDetailResponseDtoData` đang thiếu `contractEndDate` mà guide mô tả, dù create/update đã hỗ trợ. Frontend đọc giá trị qua kiểm tra kiểu tại biên, giữ khả năng hiển thị khi backend trả field; nếu backend không trả thì không thể khôi phục giá trị hiện tại từ API chi tiết. Cần backend bổ sung field vào response và Swagger rồi generate lại.
2. Super Admin không được gọi `applicationList`. Bộ chọn ứng dụng dùng `departmentSoftwareList` có quyền hợp lệ và phân trang. Ứng dụng chưa được đưa vào danh sách phần mềm phòng ban chưa có nguồn tìm kiếm toàn cục dành cho Super Admin.
3. Các kiểm thử giao tiếp sử dụng MSW. Chưa xác minh luồng ghi trên backend thật hoặc kiểm thử trình duyệt thủ công; không khẳng định toàn ứng dụng đã sẵn sàng triển khai khi typecheck/build còn lỗi ngoài phạm vi.

## Khôi phục bố cục Nhân sự đã thống nhất

Sau phản hồi của người dùng, đối chiếu lại commit `ccc3ec4` (gom thao tác nghỉ việc và điều chuyển vào hồ sơ) và `d43b3aa` (hoàn thiện phần xem trước tác động). Lượt tích hợp ngày 17/11 đã thêm lại mục Tài khoản riêng trên sidebar; đây là thay đổi không đúng bố cục đã thống nhất và đã được bỏ.

- Sidebar giữ một đầu vào Nhân sự; hồ sơ nhân viên chứa thông tin tài khoản, vai trò và các thao tác nhân sự.
- Từ Tổng quan, mời tài khoản mở trong Nhân sự; xem người duyệt chi mở bộ lọc vai trò của danh bạ nhân sự.
- Liên kết tài khoản cũ vẫn hoạt động để tương thích; sidebar đánh dấu mục Nhân sự, không tạo mục tài khoản thứ hai.
- Nghỉ việc và điều chuyển vẫn bắt đầu từ nhân viên đang mở, xem trước tác động rồi xác nhận cùng payload. Mã trình bày xem trước `event-impact-preview.tsx` không khác phiên bản `d43b3aa`.
- Thêm kiểm thử tích hợp từ `SuperAdminScreen` cho quản lý tài khoản và quay về hồ sơ, xem trước/xác nhận nghỉ việc và điều chuyển, lời mời tài khoản và bộ lọc vai trò trong cùng khu vực Nhân sự. Các sửa lỗi contract và trang chi tiết mới được giữ lại.

Kiểm chứng sau khôi phục: **29/29 test trong 5 file liên quan qua**, ESLint và Prettier qua. Typecheck vẫn ghi nhận 130 lỗi cũ ngoài phần sửa, không có lỗi trong Super Admin hoặc sidebar vừa chỉnh. Nhật ký tại `../scratch/super-admin-unified-workspace-tests.log` và `../scratch/super-admin-unified-workspace-typecheck.log`.

## Hộp thoại mời tài khoản

Đã tái hiện trên Edge bằng dữ liệu giả: vùng cuộn đặt trên `fieldset` cho phép các thẻ nhân viên vẽ xuyên xuống thanh nút. Chuyển vùng cuộn sang `div` bao ngoài, giữ `fieldset` để vô hiệu hóa các trường khi đang gửi; tiêu đề và thanh nút không co lại, phần thân được cuộn và cắt trong khung.

Danh sách gợi ý hiển thị tối đa 5 nhân viên. API chỉ có tham số tìm kiếm nên giới hạn được áp dụng ở phần hiển thị; không tự thêm query chưa có trong contract. Người dùng vẫn tìm được người ngoài 5 mục đầu theo tên, mã hoặc thư điện tử công việc. Nội dung hướng dẫn Việt/Anh đã đồng bộ với giới hạn này.

Kiểm tra trình duyệt ở 1280×720, 1024×600, 390×600 với tiếng Việt và 1280×720 với tiếng Anh: không tràn khung, không chồng lên thanh nút, vẫn cuộn tới được các lựa chọn vai trò. Kết quả và ảnh nằm tại `../scratch/invite-after-layout.json` và `../scratch/invite-after-*.png`. Đây là kiểm tra giao diện có dữ liệu giả, không gửi lời mời tới backend thật.

Kiểm thử sau sửa: 14/14 test qua; ESLint, Prettier và kiểm tra khoảng trắng qua. Typecheck còn 130 lỗi đã có ở phạm vi khác, không có lỗi trong hộp thoại mời tài khoản, form dùng chung hoặc các bản dịch vừa sửa.
