# Manager: danh sách và nhập ngân sách — 31/10/2026

## Bằng chứng contract

Đối chiếu trực tiếp [Swagger đang triển khai](https://wdp.novaproj.site/api/docs-json) với `openapi/openapi.yaml`: 287 operation, cấu trúc contract trùng nhau. Lượt chỉnh danh sách này không cần đổi snapshot hoặc tái sinh Orval. Không gửi mutation lên BE để kiểm tra.

Nguồn nghiệp vụ bổ sung trong `../../docs/Figma UI-UX/API-Integration/`: `roles/manager.md`, `reference/organization.md`, `reference/budgets.md`, `reference/catalog-plans-subscriptions.md`, `conventions.md` và `changes/CHANGELOG.md` (`API-GAP-03`).

## Danh sách Manager

| Màn hình              | API hiện có                                                              | Giao diện và giới hạn                                                                                                                                                                                        |
| --------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Duyệt nhu cầu         | `GET /api/v1/access-requests/{id}`; chưa có hàng đợi bước NEED được giao | Bỏ khối quy trình; ô tìm ID ở trên, bảng ở dưới. Tìm ID hợp lệ trả một yêu cầu thật; chỉ mở chi tiết khi chọn hàng. Khung danh sách ghi rõ cần bổ sung API; phân trang khóa cho đến khi có dữ liệu hàng đợi. |
| Nhân sự phòng ban     | `GET /api/v1/departments/{id}/employees`, chỉ có `page`, `pageSize`      | Mặc định phân trang BE, 20 bản ghi/trang. Khi tìm tên/mã, đọc đủ các trang (100 bản ghi/lần), lọc không phân biệt hoa/thường và dấu tiếng Việt, rồi phân trang kết quả 20 bản ghi/trang.                     |
| Công cụ đang được cấp | `GET /api/v1/departments/{id}/tools-in-use`, chỉ có `page`, `pageSize`   | Cùng cơ chế trên; tìm theo ứng dụng, gói, người nhận, mã nhân viên hoặc ID cấp phát.                                                                                                                         |

**Lựa chọn của Owner:** giữ giao diện danh sách và ghi rõ API BE cần bổ sung cho hàng đợi NEED. Không dùng thông báo hoặc spend queue thay hàng đợi. Thông báo giao bước vẫn mở được chi tiết yêu cầu qua chuông.

Tìm kiếm nhân sự/công cụ dùng generated client trong TanStack Query, có loading, retry và AbortSignal; cache danh sách tìm kiếm 30 giây. Chỉ hiển thị kết quả sau khi đọc đủ trang; một trang lỗi thì không công bố kết quả thiếu. FE không gửi tham số tìm kiếm chưa có trong contract. Cách này có chi phí tải tăng theo số bản ghi; BE nên bổ sung tìm kiếm phía server cho phòng lớn.

`/me.employee.department` chỉ có `code`, `name`, chưa có UUID hoặc danh sách phòng đang quản lý. Danh sách `/departments` dành cho Super Admin/IT. Manager tiếp tục dùng UUID phòng chính thức trong ngữ cảnh URL, để BE kiểm phạm vi; phần nhập ngữ cảnh được thu gọn. Chưa liên kết phòng thì bảng giải thích trạng thái và khóa tìm kiếm.

## Ngân sách: có upload nhưng chưa dành cho Manager

| Contract                                    | Quyền và dữ liệu thực tế                                                                                                                                                                                                                         |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `POST /api/v1/budget-proposals`             | Manager gửi JSON `{ costCenterId, year, lines }`. Không có `file`, attachment, hoặc ngày bắt đầu chu kỳ ngân sách. Schema không nhận thuộc tính ngoài khai báo.                                                                                  |
| Các dòng `lines[]`                          | Mô tả, tiền, gói/số ghế và cửa sổ mua, kỳ dịch vụ, chu kỳ lặp, hạn báo giá, ghi chú theo contract. `windowFrom`/`windowTo` là cửa sổ mua của từng dòng, không phải ngày bắt đầu năm tài chính/quý.                                               |
| `POST /api/v1/budget-versions/{id}/imports` | **Finance** nhập các dòng vào phiên bản ngân sách đang lập. Multipart field `file`; giới hạn import 2 MiB theo conventions. Trả số dòng và lỗi từng dòng. Đây là import dữ liệu phiên bản Finance, không phải đính kèm file đề xuất của Manager. |
| `/documents`                                | Upload dành cho IT Admin/Finance; liên kết tài liệu hiện tại theo hợp đồng (`contractId`). Không cung cấp đường đính kèm ngân sách cho Manager.                                                                                                  |

Các khoản `q1`–`q4` trong phiên bản Finance là phân bổ tiền theo quý, không phải trường chọn ngày bắt đầu chu kỳ. Form Manager hiện giữ payload JSON hợp lệ; chưa triển khai thao tác upload thành công giả hoặc dùng API Finance cho Manager.

## Yêu cầu BE cần bổ sung

Các mục dưới đây là **đề xuất contract**, chưa tồn tại trong Swagger và chưa được FE gọi.

1. **Hàng đợi NEED của người đăng nhập:** danh sách bước còn chờ được giao, Request và thông tin đơn nhóm, SLA, trạng thái và quyền quyết định; hỗ trợ `page`, `pageSize`, tìm ID, bộ lọc và thứ tự ổn định. Trả `pagination.totalItems` sau lọc. BE tự giới hạn người/phòng, xử lý giao dự phòng và trường hợp Manager tự gửi. Giữ `accessRequestGet` làm nguồn chi tiết và kiểm quyền trước quyết định.
2. **Ngữ cảnh phòng được quản lý:** bổ sung UUID trong `/me` hoặc API danh sách phòng thuộc phạm vi Manager. Không yêu cầu FE dò ID qua directory có quyền cao hơn.
3. **Tìm kiếm nhân sự/công cụ phía BE:** quy định tham số tìm kiếm, field được tìm và cách xử lý dấu; lọc trước phân trang, trả tổng số kết quả sau lọc. Khi contract có thì cập nhật snapshot và tái sinh Orval, thay cơ chế tải đủ trang ở FE.
4. **Luồng đề xuất ngân sách bằng file của Manager:** xác nhận quyền gửi/đọc/tải file, loại và dung lượng file, lưu trữ và liên kết vào đề xuất, ngày bắt đầu chính xác cùng ý nghĩa quý/năm/chu kỳ. Xác định file chỉ là chứng từ hay nguồn import các dòng; nếu import cần mẫu file, preview, validation và lỗi từng dòng. Quy định cost center/currency, tạo/gửi lại/rút đề xuất, lịch sử phiên bản và khả năng Finance đọc/tải. Tách rõ ngày bắt đầu chu kỳ với cửa sổ mua từng dòng.

Sau khi BE xác nhận và triển khai mục 4 mới có thể thay form nhập dòng bằng luồng **chọn ngày bắt đầu → tải file → kiểm tra → gửi đề xuất** đúng nghiệp vụ và quyền của Manager.
