# Danh sách yêu cầu Employee — 01/11/2026

Đọc Swagger tại `https://wdp.novaproj.site/api/docs-json`: **306 operation**, tăng từ 287; không có operation bị xóa. Cập nhật snapshot `openapi/openapi.yaml`, validate và tái sinh Orval từ snapshot bằng `ORVAL_OPENAPI_SOURCE=./openapi/openapi.yaml`. Không sửa tay generated hoặc gửi mutation lên BE thật.

## API sử dụng

`GET /api/v1/me/access-requests` — `meAccessRequestList`, tag `me`.

- Chỉ liệt kê yêu cầu **do người đăng nhập gửi**, mới nhất trước rồi theo ID. Không gồm bản nháp, yêu cầu người khác gửi hộ hoặc yêu cầu chỉ được giao xét duyệt. Super Admin không gửi đơn nên không được xem danh sách này.
- `page`, `pageSize` (1–100, mặc định 20); FE dùng 20/trang.
- `view=open|ended`: đang xử lý hoặc đã kết thúc; bỏ trống lấy cả hai. `AWAITING_IT_CLOSE` vẫn thuộc nhóm đang xử lý.
- `state`: một hoặc nhiều trạng thái ngăn bằng dấu phẩy, không trùng; UI hiện chọn một trạng thái. State giao với view khi cùng được truyền.
- `type=GRANT|SERVICE_ACCOUNT|RENEWAL|GROUP_GRANT`.
- `from` bao gồm đầu khoảng, `to` không bao gồm cuối khoảng, kiểu date-time. Contract có hỗ trợ; UI hiện chỉ dùng view/state/type.
- Response có danh sách và pagination, tên ứng dụng/gói hoặc phần mềm đề xuất, người thụ hưởng, số dòng nhóm, state, thời gian, bước nhu cầu/chi và quyền rút gợi ý. Không có tiền/ngân sách còn lại; chi tiết đọc bằng ID. UI chỉ mở chi tiết, không tự rút/phê duyệt từ hàng.

## Giao diện và state

Xếp dọc ở mọi kích thước: **Theo dõi theo mã → Yêu cầu đã gửi → Bản nháp**. Tra cứu gọn ở đầu. Bảng có bộ lọc và tổng số từ BE, loading/rỗng/lỗi/retry, mở chi tiết và phân trang server. Không dùng thông báo hoặc bản nháp làm lịch sử đơn đã gửi.

URL giữ `requestView`, `requestState`, `requestType`, `page`; đổi/xóa bộ lọc bỏ `page` để về trang 1. Chỉ truyền enum hợp lệ; URL sai không được gửi thành filter lạ. `draftsPage` độc lập. Tên và thời gian dùng bảng responsive/formatter chung.

Gửi đơn, gửi bản nháp và rút đơn thành công invalidate query key danh sách cá nhân. Thao tác bản nháp vẫn có xác nhận và payload đúng contract.

## Thay đổi so với đặc tả cũ

`API-GAP-01` trong tài liệu BE cũ đã được giải quyết **cho danh sách người gửi**; chưa có căn cứ coi endpoint này là danh sách mọi đơn mà Employee là người thụ hưởng.

Swagger mới cũng có `requestable-applications`, `requestable-plans`, `me/software-rights`, dashboard và hàng đợi NEED. Chúng chưa được nối vào các màn tương ứng trong lượt chỉnh trang này; ghi chú “chưa có API” từ snapshot 287 phải kiểm tra lại theo Swagger 306, phân biệt contract đã có với UI chưa tích hợp. Các dropdown gói cần cập nhật trong tác vụ catalog riêng, không gọi `/plans` đặc quyền.

Cập nhật sau lượt chỉnh trang yêu cầu: `me/software-rights` đã được nối vào màn Quyền sử dụng ngày 01/11, với ba danh sách chọn riêng, lọc current/ended và phân trang BE. Xem `employee-api-integration.md`; ghi chú chưa nối ở đoạn trên chỉ là lịch sử của tác vụ danh sách yêu cầu.

## Kiểm chứng

Validate/Orval generation, TypeScript, build production và ESLint/Prettier phạm vi sửa qua. **118/118 test liên quan** Employee/Manager/dashboard/locale qua, gồm 7 test mới cho thứ tự trang, filter/paging server, ID lookup, paging bản nháp độc lập, lỗi/retry và cache sau gửi nháp. `pnpm check` vẫn dừng ở 48 file lỗi định dạng ngoài tác vụ. Browser host không khả dụng, native inventory bị timeout; chưa xác minh hình ảnh desktop/mobile hoặc nghiệp vụ bằng tài khoản BE thật.
