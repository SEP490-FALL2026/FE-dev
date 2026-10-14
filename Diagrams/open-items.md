# Danh sách điểm mở của bộ sơ đồ (`DOI-xx`)

> Tệp **sinh tự động** bằng `python tools/build_index.py` từ mục 12 (`doc.open`) của các spec — không sửa tay. Mỗi ghi chú mang nhãn `(LOẠI · mã)`; mã `DOI-xx` (*diagram open item*) gom các ghi chú trùng nhau giữa nhiều sơ đồ. Phân loại và khử trùng lần đầu ngày 09/10/2026 (190 ghi chú thô + `O-1` → `O-7` + review tiếp nối ⟹ 111 mục); 19 mục cần Owner đã được chốt ở `QĐ-62a` → `QĐ-62q`; sau review độc lập 10/10/2026 thêm `QĐ-62s`, `QĐ-62t`, `QĐ-61h`; cùng ngày, `QĐ-63a` (người xác nhận bàn giao ở bốn ca thu hồi do IT thực hiện — trước đó ghi bằng nhãn *SESSION DECISION*) và `QĐ-64a` (seat chồng lấn với ghost seat). Đây là quyết định của Owner, **chưa** phải xác nhận của GVHD/hội đồng.

## 1. Loại và số ghi chú

| Loại | Ý nghĩa | Số ghi chú |
| --- | --- | --- |
| `ĐÃ CHỐT` | Owner đã quyết (`QĐ-61` → `QĐ-64`) — đã thể hiện trên hình hoặc trong mô tả | 34 |
| `ĐÃ CÓ NGUỒN` | Đã có căn cứ ở BRD/Decisions — sửa theo nguồn, ghi căn cứ | 29 |
| `LATER-TECH/UI` | Chi tiết kỹ thuật/UI cho giai đoạn sau (tham số, màn hình, thiết kế BE) | 51 |
| `DEFERRED/OUT` | Đã có quyết định hoãn hoặc ngoài phạm vi (giai đoạn Tools, ERD/User Stories, pháp lý) | 37 |
| `LIMIT` | Giới hạn hợp lệ cần công bố | 27 |
| `CHƯA CHỐT` | (nhãn ngoài danh sách chuẩn) | 2 |

Tổng 180 ghi chú có nhãn trên 50 spec, 91 mã `DOI` đang được dẫn; không còn ghi chú chưa gắn nhãn.

Mục `ĐÃ CHỐT`/`ĐÃ CÓ NGUỒN` vẫn giữ trong spec để người đọc biết điểm từng mở được giải quyết bằng gì. Ghi chú chỉ bị gỡ khi hình đã vẽ đúng nội dung đó hoặc ghi chú bị trùng — danh sách ở [verification-2026-10-08.md](verification-2026-10-08.md) mục 7.

## 2. Theo loại

### `ĐÃ CHỐT`

| Mã | Sơ đồ (mục 12, dòng) | Nội dung |
| --- | --- | --- |
| DOI-19, QĐ-62s | `MF-4` #2 | Quyết định gia hạn/giảm/hủy không tạo khoản cam kết ngân sách; chi phí kỳ gia hạn hiện ở dự báo L1 (FR-5.5). |
| DOI-19, QĐ-62s | `WF-15` #3 | Quyết định gia hạn không tạo khoản cam kết ngân sách; chi phí kỳ gia hạn chỉ hiện ở dự báo L1 (FR-5.5). |
| DOI-20, QĐ-62a | `UF-21` #2 | Yêu cầu trưởng phòng tạo thay = bước nhu cầu đã xác nhận; phần trưởng phòng là người thụ hưởng theo QĐ-52c. |
| DOI-20, QĐ-62a | `WF-04` #1 | Yêu cầu trưởng phòng tạo thay nhân viên phòng mình = bước nhu cầu đã xác nhận; phần trưởng phòng là người thụ hưởng theo QĐ-52c. |
| DOI-33, QĐ-62i | `UF-08` #2 | Tác vụ lỗi: IT chọn thử lại, làm tay kèm bằng chứng hoặc đóng là thất bại có lý do; chỉ khi đóng mới là kết cục cuối. |
| DOI-34, QĐ-62j | `UF-08` #3 | Lời mời chưa được chấp nhận: nhắc sau N ngày, IT được thu lại và đóng thất bại sau M ngày. |
| DOI-36, QĐ-62p | `UF-08` #4 | Đổi mật khẩu/2FA tài khoản dùng chung là tác vụ IT riêng; màn ITA-34 cho thấy IT làm việc đó, không chặn kết quả thu hồi. |
| DOI-37, QĐ-62e | `MF-5` #3 | Nghỉ đột ngột: chỉ gói mất dữ liệu mới giữ việc gỡ ở nhà cung cấp tối đa hạn cấu hình (mặc định 1 ngày làm việc); main flow ghi ở `d_hc`, chi tiết ở WF-07. |
| DOI-37, QĐ-62e | `UF-09` #3 | Nghỉ đột ngột: chặn đăng nhập ngay; chỉ gói mất dữ liệu giữ việc gỡ ở nhà cung cấp tối đa hạn cấu hình; phòng thiếu trưởng phòng thì hết hạn gỡ (QĐ-62c). |
| DOI-43, QĐ-62p | `MF-7` #1 | Đổi chức vụ trong cùng phòng không mở rà soát; bộ chuẩn mới áp cho yêu cầu mới. |
| DOI-43, QĐ-62p | `UF-18` #4 | Đổi chức vụ trong cùng phòng không mở rà soát. |
| DOI-43, QĐ-62p | `WF-05` #2 | Đổi chức vụ trong cùng phòng không mở rà soát; bộ chuẩn mới áp cho yêu cầu mới; công cụ không dùng lộ qua ghost seat. |
| DOI-45, QĐ-62g | `WF-05` #4 | Thành viên tài khoản dùng chung của phòng cũ: tư cách thành viên kết thúc tại ngày hiệu lực, IT đổi mật khẩu — vẽ ở `d_member`. |
| HO-136, DOI-46, FR-2.12, QĐ-63a, QĐ-64a | `UF-08` #8 | Thu hồi gói mất dữ liệu ở bốn ca hết hạn, hủy/giảm thuê bao, không hợp thức hóa, thực thi lại: IT Admin ghi xác nhận bàn giao trước khi gỡ — trừ seat đã quyết Thu hồi ghost seat nằm trong phần vượt khi giảm thuê bao: trưởng phòng đó xác nhận; màn hình xác nhận thuộc giai đoạn UI (DOI-41). |
| DOI-46, QĐ-62f | `WF-05` #5 | Thu hồi sau điều chuyển: trưởng phòng **mới** xác nhận bàn giao trước khi gỡ (bản nhẹ, không chặn sau hạn ngắn); BM-04 do trưởng phòng mới xác nhận. |
| HO-136, DOI-46, FR-2.12, QĐ-63a | `WF-09a` #3 | Ai xác nhận bàn giao dữ liệu khi thu hồi gói mất dữ liệu ở bốn ca hết hạn quyền có thời hạn, hủy/giảm thuê bao (kể cả thuê bao hết hạn không gia hạn — QĐ-66v), không hợp thức hóa, thực thi lại: IT Admin ghi xác nhận (QĐ-63a), không chặn sau hạn ngắn; không đổi người xác nhận ở các ca khác (QĐ-63b). Còn lại cho giai đoạn sau: AC của các Story chứa bốn ca (tối thiểu `US-03-05`, `US-11-02`, `US-11-03`, `US-13-06`, `US-07-05`, `US-07-07`), chỗ lưu người và thời điểm xác nhận ở ERD (HO-136), giá trị hạn ngắn ở thiết kế kỹ thuật. |
| HO-136, DOI-46, FR-2.12, QĐ-64a | `WF-09a` #4 | Seat vừa quyết Thu hồi ghost seat (QĐ-62f) vừa nằm trong phần vượt khi giảm thuê bao (MF-4 c_excess, WF-15 c_rec): một tác vụ thu hồi; trưởng phòng đã quyết Thu hồi xác nhận bàn giao, IT Admin không xác nhận thêm; đã có xác nhận hợp lệ thì dùng lại. (ĐÃ CHỐT · QĐ-66u) Cùng quy tắc áp cho hủy toàn bộ thuê bao, hết hạn quyền có thời hạn, thực thi lại. |
| DOI-46, QĐ-62f | `WF-11` #2 | Bàn giao dữ liệu bản nhẹ: người kích hoạt thu hồi (Employee tự trả, hoặc trưởng phòng báo không cần) xác nhận trước khi gỡ, không chặn sau hạn ngắn. |
| DOI-47, QĐ-62c | `UF-18` #2 | Phòng nhận chưa có trưởng phòng: việc rà soát chờ, không giao ai; cảnh báo IT Admin và Super Admin — hình vẽ ca đã có trưởng phòng. |
| DOI-47, QĐ-62c | `WF-05` #6 | Phòng mới chưa có trưởng phòng: việc rà soát chờ, không giao ai; cảnh báo IT Admin và Super Admin. |
| DOI-52, DOI-53, QĐ-62h | `WF-08` #1 | IT Admin phụ trách xử lý mục quá hạn (FR-2.8, FR-3.17), không cần trưởng phòng xác nhận vì thời hạn đã được duyệt ở bước nhu cầu; yêu cầu gia hạn gửi trước ngày kết thúc mà chưa quyết ⟹ quyền giữ nguyên tới khi có quyết định. |
| DOI-64, QĐ-62p | `UF-05` #4 | Đổi Reclaim thành Keep/Exempt sau khi IT trả lại ⟹ báo nhân viên *thu hồi đã hủy*. |
| DOI-64, QĐ-62p | `WF-13` #2 | Trưởng phòng đổi Reclaim thành Keep/Exempt sau khi IT trả lại ⟹ báo nhân viên *thu hồi đã hủy*. |
| DOI-75, QĐ-62q | `UF-16` #4 | Phiên bản đổi loại dữ liệu hoặc mục đích ⟹ xác nhận lại; chỉ sửa câu chữ ⟹ chỉ thông báo. |
| DOI-75, QĐ-62q | `WF-18` #3 | Phiên bản thông báo đổi loại dữ liệu hoặc mục đích ⟹ phải xác nhận lại trước khi nhận dữ liệu tiếp; chỉ sửa câu chữ ⟹ chỉ thông báo. |
| DOI-85, QĐ-62n | `WF-02` #2 | Ngừng dùng ứng dụng bị chặn tới khi mọi Assignment đã thu hồi và thuê bao đã hủy/hết hạn; hệ thống liệt kê thứ đang chặn. |
| DOI-89, QĐ-62t | `MF-4` #1 | Cảnh báo T-7 (WF-15) được bỏ qua khi cả quyết định lẫn kết quả thực hiện đã ghi trước mốc đó; đã quyết mà chưa thực hiện thì vẫn gửi. |
| DOI-89, QĐ-62t | `UF-20` #2 | T-7 được bỏ qua khi quyết định và kết quả thực hiện đều đã ghi; đã quyết mà chưa thực hiện thì vẫn gửi. |
| DOI-89, QĐ-62t | `WF-15` #1 | T-7 được bỏ qua khi cả quyết định lẫn kết quả thực hiện đã ghi trước mốc đó — vẽ ở `d_t7`. |
| DOI-97, DOI-98, QĐ-62d, QĐ-62c | `WF-17` #1 | Bối cảnh của trưởng phòng chỉ hỏi khi khoản chi gắn được với nhân viên một phòng (FR-6.9) và không chặn quyết định; phòng chưa có trưởng phòng thì yêu cầu treo, chuyển cho trưởng phòng mới. |
| DOI-102, QĐ-62m | `UF-11` #2 | Finance được sửa ngân sách giữa kỳ kèm lý do (lịch sử giữ, snapshot cũ không đổi, báo Người duyệt chi) — chi tiết ở WF-20. |
| DOI-102, QĐ-62m | `WF-20` #1 | Sửa ngân sách giữa kỳ: được, lý do bắt buộc, giữ lịch sử, snapshot cũ không đổi, báo Người duyệt chi — vẽ ở luồng phụ `e_edit`. |
| DOI-105, QĐ-62m | `UF-19` #2 | Không khóa kỳ: báo cáo đã phát hành là bản chụp bất biến có thời điểm; khoản đến muộn hiện ở báo cáo sau dưới nhãn *điều chỉnh kỳ trước*. |
| QĐ-61b, QĐ-61h | `UF-15` #3 | Trên mobile Người duyệt chi duyệt bước chi và bước nhu cầu của yêu cầu do trưởng phòng tự gửi; gia hạn và đối soát chỉ trên web. |

### `ĐÃ CÓ NGUỒN`

| Mã | Sơ đồ (mục 12, dòng) | Nội dung |
| --- | --- | --- |
| DOI-21 | `UF-04` #3 | Người duyệt chi không có cấp trên: FR-3.8 chỉ thông báo cấp trên *nếu có*; quá SLA ⟹ nhắc và cảnh báo Super Admin (FR-5.14). |
| DOI-21 | `UF-20` #3 | Người duyệt chi không có cấp trên — quá SLA nhắc người được giao và cảnh báo Super Admin (FR-3.8, FR-5.14). |
| DOI-21 | `WF-09` #1 | Người duyệt chi không có cấp trên: FR-3.8 chỉ thông báo cấp trên *nếu có*; quá SLA ⟹ nhắc người được giao và cảnh báo Super Admin (bảng theo dõi nghẽn, FR-5.14). |
| DOI-21 | `WF-15` #4 | Người duyệt chi không có cấp trên: FR-3.8 chỉ thông báo cấp trên “nếu có”; quá SLA ⟹ nhắc người được giao và cảnh báo Super Admin (bảng theo dõi nghẽn, FR-5.14). |
| DOI-22 | `UF-02` #3 | Bước đánh giá IT có SLA theo FR-3.8 (loại bước *đánh giá IT*); nhắc quá hạn ở WF-09. |
| DOI-22 | `WF-10` #3 | Bước đánh giá IT có SLA (loại bước *đánh giá IT*, BRD 5.12.1 C4; FR-3.8 *mỗi loại bước*); nhắc quá hạn ở WF-09. |
| DOI-23 | `UF-02` #2 | Phần mềm có bản quyền không tốn tiền: vẫn qua Người duyệt chi để vào danh mục, không tạo khoản cam kết (WF-09 `d_cost`). |
| DOI-23 | `WF-10` #1 | Phần mềm có bản quyền không tốn tiền: vẫn qua Người duyệt chi để vào danh mục (FR-3.4c), không tạo khoản cam kết — vẽ ở WF-09/MF-2 `d_cost`. |
| DOI-24 | `WF-10` #4 | Nhánh [shared, not allowed]: FR-2.11 — gói không cho chia sẻ thì yêu cầu dùng chung bị từ chối ở bước đánh giá của IT; chuyển sang cấp cá nhân là yêu cầu mới (FR-3.19), định tuyến lại theo FR-3.4. |
| DOI-25 | `WF-10` #2 | *Công cụ trùng chức năng* là trường của BM-02 và gợi ý thay thế, không phải cổng từ chối. |
| DOI-35 | `UF-08` #5 | Kho K4 hết khóa = hết sức chứa (FR-2.10, INV-01): WF-09 `d_seat` quay về nhánh mua thêm. |
| DOI-42 | `WF-05` #1 | Trưởng phòng cũ là người được điều chuyển: chỉ định trưởng phòng mới hoặc ghi *chưa có* — FR-3.1, QĐ-52a, INV-19, INV-20 (một phòng một trưởng phòng; người điều chuyển chỉ thuộc phòng mới). |
| DOI-48 | `UF-18` #3 | Cần công cụ mới: trưởng phòng ghi nhu cầu, nhân viên tự gửi yêu cầu (UF-01) — FR-3.2 chỉ cho tạo thay khi onboarding hoặc theo nhóm. |
| DOI-57 | `WF-11` #1 | Hoàn trả tự nguyện không có bước duyệt nhu cầu (BRD 4.6 dòng *Hoàn trả / thu hồi*: trưởng phòng chỉ khi thu hồi theo quyết định của phòng); cảnh báo FR-5.14 đã sửa thành *khi Employee tự hoàn trả* (BRD v3.30). |
| DOI-59, suy ra | `UF-06` #1 | Xem trước và xác nhận chỉ áp cho tệp tải lên; nguồn tự đẩy theo ngày tự ghi — vẽ ở `d_src2`. |
| DOI-59, suy ra | `WF-12` #1 | Khung xem trước và xác nhận của FR-7.1 áp cho tệp tải lên; nguồn tự đẩy theo ngày (FR-4.1, FR-2.6) tự ghi, không xác nhận thủ công từng đợt — vẽ ở `d_src2`. |
| DOI-60, QĐ-01 | `UF-06` #2 | Người mới được cấp seat của ứng dụng đang được theo dõi nhận thông báo FR-10.4 trước khi dữ liệu của họ được ghi. |
| DOI-60, QĐ-01 | `WF-12` #2 | Người mới được cấp seat của ứng dụng đang được theo dõi nhận thông báo FR-10.4 trước khi dữ liệu của họ được ghi — `d_first`; WF-09a `s_act` cũng ghi. |
| DOI-68 | `UF-05` #2 | Trưởng phòng chỉ nhận thứ cần quyết, từ tầng *Cần xem xét* (FR-4.12); seat *bằng chứng không đủ*, *không có dữ liệu*, *chưa khớp danh tính* không tới trưởng phòng mà hiện ở báo cáo hiệu quả sử dụng (FR-5.10). |
| DOI-70, QĐ-52a | `WF-13a` #1 | Cổng 7 *miễn trừ do Manager xác nhận*: Manager là trưởng phòng có hiệu lực — sơ đồ dùng Department Head. |
| DOI-71 | `WF-13a` #2 | Cảnh báo dữ liệu lỗi thời (cổng 6) hiện trong báo cáo chất lượng dữ liệu cho IT Admin và Super Admin (FR-5.12, FR-4.9). |
| DOI-73, FR-4.21(1), QĐ-53a | `UF-16` #2 | BM-06 ký trên văn bản tại bàn giao máy, ngoài ứng dụng, không chữ ký số; IT lưu bản ký; xác nhận trong ứng dụng là bước riêng. |
| DOI-79 | `WF-01` #1 | Phòng ban nhập trước nhân sự: FR-9.7 — mã phòng trong tệp nhân sự phải đã có, mã chưa có bị từ chối theo dòng; trưởng phòng chỉ định sau khi có hồ sơ nhân viên, phòng tạm chưa có trưởng phòng theo FR-3.6. |
| DOI-93, QĐ-62b | `UF-14` #1 | IT Admin đóng hồ sơ sai lệch kèm quyết định và căn cứ — BRD 5.10 dòng *Đối soát nhà cung cấp* (*IT Admin xử lý*); ca *nhà cung cấp tính sai* kèm ghi chú xác minh của Finance. |
| DOI-93, QĐ-62b | `WF-16` #1 | IT Admin đóng hồ sơ sai lệch kèm quyết định và căn cứ — BRD 5.10 dòng *Đối soát nhà cung cấp* (*IT Admin xử lý*); ca *nhà cung cấp tính sai* kèm ghi chú xác minh của Finance. |
| DOI-95 | `UF-14` #2 | Phân biệt *phía nào chưa theo kịp quyết định* theo nguyên tắc BRD 5.7.1: dữ liệu nội bộ là nguồn về ý định đã được duyệt, nhà cung cấp là nguồn về thực tế quan sát được; sai lệch được xử lý theo quyết định đã có, không nguồn nào tự ghi đè nguồn kia (FR-7.7). |
| DOI-95 | `WF-16` #2 | Phân biệt *phía nào chưa theo kịp quyết định* theo nguyên tắc BRD 5.7.1: dữ liệu nội bộ là nguồn về ý định đã được duyệt, nhà cung cấp là nguồn về thực tế quan sát được; sai lệch được xử lý theo quyết định đã có, không nguồn nào tự ghi đè nguồn kia (FR-7.7). |
| DOI-103, FR-5.8a, INV-18 | `UF-11` #3 | Mỗi (Cost Center, kỳ) tối đa một ngân sách — suy ra từ việc khoản cam kết chưa gắn ngân sách được gắn ngược vào ngân sách *của đúng Cost Center và kỳ đó*; BRD không có câu nói thẳng. Chi tiết ở WF-20. |
| DOI-103, suy ra | `WF-20` #2 | Mỗi (Cost Center, kỳ) tối đa một ngân sách — suy ra từ FR-5.8a, INV-18 (*ngân sách của đúng Cost Center và kỳ đó*); BRD chưa ghi thành câu riêng; ràng buộc duy nhất ở ERD (QĐ-59e). |

### `LATER-TECH/UI`

| Mã | Sơ đồ (mục 12, dòng) | Nội dung |
| --- | --- | --- |
| DOI-01, QĐ-08 | `UF-01` #1 | Mã màn hình EMP-xx là đề xuất, chưa có UI Spec hiện hành. |
| DOI-01, QĐ-08 | `UF-02` #1 | Mã màn hình EMP-xx là đề xuất, chưa có UI Spec hiện hành; EMP-25 và EMP-26 là màn hình mới của UF này. |
| DOI-01, QĐ-08 | `UF-03` #1 | Mã màn hình EMP-xx là đề xuất, chưa có UI Spec hiện hành. |
| DOI-01, QĐ-08 | `UF-04` #1 | Mã màn hình MGR-xx là đề xuất, chưa có UI Spec hiện hành. |
| DOI-01, QĐ-08 | `UF-05` #1 | Mã màn hình MGR-xx là đề xuất, chưa có UI Spec hiện hành. |
| DOI-01, QĐ-08 | `UF-06` #5 | Mã màn hình ITA-07, ITA-08 dùng lại từ bản cũ (v0.7); chưa có UI Spec hiện hành. |
| DOI-01, QĐ-08 | `UF-08` #7 | Mã ITA-33 (kho khóa), ITA-34 (đổi mật khẩu), ITA-35 (đóng tác vụ lỗi) là mã mới đề xuất; ITA-05 dùng lại từ bản cũ. |
| DOI-01, QĐ-08 | `UF-09` #1 | Mã màn hình ITA-12/13/14 giữ từ bản cũ, là đề xuất. |
| DOI-01, QĐ-08 | `UF-10` #1 | Mã màn hình ITA-10 giữ từ bản cũ, là đề xuất. |
| DOI-01, QĐ-08 | `UF-11` #1 | Mã màn hình FIN-xx là đề xuất, chưa có UI Spec hiện hành; FIN-20 → FIN-22 là mã mới của bản vẽ này. |
| DOI-01, QĐ-08 | `UF-12` #1 | Mã màn hình FIN-04, FIN-07, ITA-15, ITA-03 giữ từ bản cũ, là đề xuất. |
| DOI-01, QĐ-08 | `UF-13` #1 | Mã ADM-02, SYS-04 giữ từ bản cũ; ADM-20 → ADM-22 mới; tất cả là đề xuất. |
| DOI-01, QĐ-08 | `UF-14` #4 | Mã màn hình ITA-51, ITA-52, ITA-66 là mã mới của bản vẽ này; ITA-11 dùng lại mã cũ (đối soát thành viên phía nhà cung cấp); UI Spec chưa chốt. |
| DOI-01, QĐ-08 | `UF-15` #1 | Mã APV-01 → APV-03 giữ từ bản cũ, là đề xuất. |
| DOI-01, QĐ-08 | `UF-16` #1 | Mã màn hình ITA-6x và EMP-3x là đề xuất, chưa có UI Spec hiện hành; EMP-30 chỉ là màn hình nhân viên xem văn bản BM-06 — chữ ký ở ngoài ứng dụng. |
| DOI-01, QĐ-08 | `UF-17` #1 | Mã màn hình SYS-xx giữ từ bản cũ, là đề xuất; chưa có UI Spec hiện hành. |
| DOI-01, QĐ-08 | `UF-18` #1 | Mã màn hình MGR-xx là đề xuất, chưa có UI Spec hiện hành. |
| DOI-01, QĐ-08 | `UF-19` #1 | Mã FIN-30 → FIN-34 là đề xuất mới. |
| DOI-01, QĐ-08 | `UF-20` #5 | Mã màn hình ITA-53 → ITA-57 và ITA-65 là mã mới của bản vẽ này; ITA-04 dùng lại mã cũ (chi tiết thuê bao); UI Spec chưa chốt. |
| DOI-01, QĐ-08 | `UF-21` #1 | Mã màn hình MGR-xx là đề xuất, chưa có UI Spec hiện hành. |
| DOI-26 | `UF-04` #2 | Yêu cầu của chính trưởng phòng trong MGR-02/MGR-03: hình vẽ hướng an toàn — xem được trạng thái, không có nút quyết (SoD-4). |
| DOI-28 | `UF-04` #4 | Thời hạn quá 12 tháng phải xác nhận tường minh mới duyệt được (OI-07a) — hình vẽ hướng an toàn; giao diện chặn chốt ở UI Spec. |
| DOI-31 | `UF-02` #4 | Thứ tự phân loại đối tượng trước, cổng mức kiểm soát sau như WF-10; kết quả phía nhân viên gộp thành ba kết cục (đóng · từ chối · chấp nhận). |
| DOI-31 | `UF-06` #4 | Nhãn bước 1 và bước 4 theo khung import 6 bước của FR-7; các bước 2, 3, 5, 6 là bước hệ thống nên không có mã màn hình riêng. |
| DOI-31, QĐ-08 | `UF-07` #4 | Chuyển từ *nhiều ứng viên* sang *không ai* ở màn ITA-09 là cách trình bày giao diện. |
| DOI-31 | `UF-15` #2 | Kết cục đối soát gộp vào một màn hình chọn kết cục; nhánh chi tiết vẽ ở UF-12 và WF-17. |
| DOI-31 | `UF-17` #2 | Ba trường hợp từ chối đăng nhập gộp vào một màn hình SYS-11 với nội dung khác nhau — câu chữ chính xác để UI Spec chốt, miễn không lộ email có tồn tại. |
| DOI-31 | `UF-21` #4 | Yêu cầu nhóm có kết cục khác nhau theo từng thành viên: hình gộp một điểm kết cục; chi tiết theo người ở MGR-26. |
| DOI-32 | `UF-08` #1 | Số lần thử lại tối đa của connector và số ngày N/M của lời mời chờ là tham số cấu hình ở thiết kế kỹ thuật (FR-2.5 chỉ yêu cầu ghi số lần thử). |
| DOI-32 | `WF-09a` #1 | Số lần thử lại tối đa của connector và số ngày N (nhắc) / M (được thu lại lời mời), hạn ngắn chờ xác nhận bàn giao là tham số cấu hình ở thiết kế kỹ thuật (FR-2.5 chỉ yêu cầu ghi số lần thử và lỗi gần nhất; QĐ-62 để tham số kỹ thuật cho thiết kế kỹ thuật). |
| DOI-41 | `UF-09` #2 | Màn hình xác nhận bàn giao của trưởng phòng chưa có user flow riêng — chỉ hiện ở đây như bước hệ thống (WF-07 vẽ đầy đủ). |
| DOI-41, QĐ-62d | `UF-12` #2 | Bối cảnh của trưởng phòng là luồng phụ không chặn (WF-17 `e_ctx`), chưa có màn hình riêng của trưởng phòng — ở đây là bước hệ thống. |
| DOI-41 | `UF-13` #2 | Màn hình cấu hình phòng ban (trưởng phòng, IT phụ trách phòng — QĐ-58) thuộc khởi tạo tổ chức (WF-01); chưa có user flow riêng. |
| DOI-51 | `WF-06` #3 | Bảng chuyển trạng thái Employee đầy đủ thuộc thiết kế kỹ thuật (BRD 5.12); nhánh *nghỉ dài → nghỉ việc* suy ra từ thứ tự trạng thái. |
| DOI-51 | `WF-06` #4 | Đổi ngày dự kiến quay lại khi kỳ nghỉ kéo dài: IT cập nhật lại trường ngày, không có bước duyệt. |
| DOI-61 | `UF-07` #1 | Người xác nhận của phép khớp tự động ghi là hệ thống/mã luật; khớp thủ công ghi tên IT Admin (WF-12a). |
| DOI-61 | `UF-07` #2 | Thời điểm tổng hợp lại sau khi IT khớp thủ công chốt ở thiết kế kỹ thuật; sơ đồ chỉ nêu kết quả gắn Assignment hoặc sai lệch như WF-12a. |
| DOI-61 | `WF-12a` #1 | Người xác nhận của phép khớp tự động ghi là hệ thống/mã luật (trường người xác nhận của FR-4.5); khớp thủ công ghi tên IT Admin. |
| DOI-61 | `WF-12a` #2 | Thời điểm tổng hợp lại trạng thái sử dụng sau khi IT khớp thủ công (ngay hay ở lần import kế) chốt ở thiết kế kỹ thuật. |
| DOI-72, OI-12a | `WF-13a` #3 | Với G1 (đối tượng là thuê bao) cổng 1 và cổng 8 được hiểu theo thuê bao — khóa của rule engine chốt ở thiết kế BE. |
| DOI-74 | `UF-16` #3 | Nhịp nhắc khi nhân viên chưa xác nhận là tham số thiết kế; xác nhận muộn ⟹ chỉ nhận dữ liệu từ thời điểm xác nhận (INV-17 *tại thời điểm ghi nhận*). |
| DOI-74 | `WF-18` #2 | Nhịp nhắc khi nhân viên chưa xác nhận là tham số thiết kế; xác nhận muộn ⟹ chỉ nhận dữ liệu từ thời điểm xác nhận (INV-17 *tại thời điểm ghi nhận*). |
| DOI-76 | `UF-03` #2 | *Ngoại lệ xuất dữ liệu* là các ca lỗi kỹ thuật (kích thước, quá thời gian, thiếu nguồn) — chốt ở thiết kế BE; nhân viên thấy qua trạng thái. |
| DOI-80 | `WF-01` #2 | Tài khoản Finance/IT Admin đầu tiên: tài khoản chỉ tạo từ hồ sơ nhân viên đã có (FR-8.6) — bước khởi tạo hạ tầng ghi ở hướng dẫn triển khai BE. |
| DOI-81 | `WF-01` #3 | Vị trí cấu hình bộ công cụ chuẩn (FR-3.18) trong thứ tự năm bước: đặt sau bước 3 vì cần có gói — chỉ là thứ tự màn hình. |
| DOI-83 | `WF-02` #1 | Hồ sơ thuế nhà cung cấp do Finance khai (FR-5.13); chưa có hồ sơ thì dùng mặc định theo QĐ-60b, đánh dấu *ước tính* — thứ tự nhập so với thuê bao chốt ở thiết kế. |
| DOI-88 | `WF-03` #2 | *Gửi lại lời mời* không vẽ thành bước riêng — FR-8.8/FR-8.11 đã quy định; gộp vào nhánh đổi vai/khóa. |
| DOI-88 | `WF-03` #3 | Cổng quy tắc vẽ chung cho ba việc; nội dung thông báo từ chối cho Super Admin chốt ở UI Spec. |
| DOI-99 | `WF-17` #2 | Thực thi *đăng ký thuê bao* sau hợp thức hóa: BM-07 ghi *tạo thuê bao*; bản vẽ để IT Admin ghi trong cùng bước, chi tiết màn hình chốt ở giai đoạn UI. |
| DOI-100 | `WF-19` #2 | Ai nhập giả định cho kịch bản L3: FR-5.5 ghi *người dùng*; đề xuất Finance — chốt ở giai đoạn User Stories (QĐ-59e). |
| DOI-101 | `WF-19` #3 | FR-5.8 cho Finance giải phóng phần dư khoản cam kết *khi không còn hóa đơn*, không nêu thời điểm; bản vẽ đặt lựa chọn này lúc khép kỳ (lựa chọn bố cục). |

### `DEFERRED/OUT`

| Mã | Sơ đồ (mục 12, dòng) | Nội dung |
| --- | --- | --- |
| DOI-02, QĐ-59e | `MF-2` #1 | Mã màn hình và User Stories EP-05/06/07 chưa đồng bộ QĐ-52 → QĐ-62 — bàn giao ở `handoff-erd-us-2026-10-09.md`. |
| DOI-02, QĐ-59e | `WF-09` #2 | Mã màn hình và User Stories chưa đồng bộ QĐ-52 → QĐ-62 — bàn giao ở `handoff-erd-us-2026-10-09.md`. |
| DOI-03, QĐ-61e | `MF-2` #2 | Tóm tắt AI hàng đợi của trưởng phòng là phạm vi cam kết nhưng chưa hiện thực, chưa kiểm chứng model; chưa gửi dữ liệu thật tới model (`OQ-26`). |
| DOI-03, QĐ-49e, QĐ-61e | `MF-8` #1 | Hai tính năng AI là phạm vi cam kết nhưng chưa hiện thực, chưa kiểm chứng model; chưa gửi dữ liệu thật tới model (`OQ-26`). |
| DOI-03, QĐ-61e | `WF-19` #1 | Bản nháp diễn giải AI là phạm vi cam kết nhưng chưa hiện thực, chưa kiểm chứng model; chưa gửi dữ liệu thật tới model (`OQ-26`). |
| DOI-05 | `MF-7` #2 | Module tổ chức ở BE vẫn dựa trên `manager_id` (`QĐ-51`) — thiết kế chuyển đổi sau ERD (QĐ-59e). |
| DOI-05 | `WF-05` #7 | Module tổ chức ở BE vẫn dựa trên `manager_id` (`QĐ-51`) — thiết kế chuyển đổi sau ERD (QĐ-59e). |
| DOI-06, QĐ-41a | `MF-5` #1 | Tự động chuyển đã nghỉ việc khi tới ngày cuối là lát sau; ở S0 IT làm tay. |
| DOI-06, QĐ-41a | `WF-07` #2 | Tự động chuyển đã nghỉ việc khi tới ngày cuối là lát sau; ở S0 IT làm tay. Không vẽ mốc *ngày làm việc cuối* thành nút thời gian vì trạng thái, không phải ngày, quyết định việc chặn. |
| DOI-07, QĐ-59e | `MF-8` #2 | ERD chưa có hồ sơ thuế và dòng thuế có cờ được khấu trừ (`QĐ-60`) — giai đoạn ERD. |
| DOI-07, QĐ-59e | `WF-16` #3 | ERD chưa có hồ sơ thuế và dòng thuế có cờ được khấu trừ (`QĐ-60`). |
| DOI-07, QĐ-59e | `WF-19` #4 | ERD chưa có hồ sơ thuế và dòng thuế có cờ được khấu trừ (`QĐ-60`). |
| DOI-09, QĐ-59a, QĐ-57d | `UF-06` #3 | Loại bộ thu thập, cách báo bao phủ và quy tắc hợp nhất nhiều bộ thu thập do giai đoạn Tools chốt. |
| DOI-09, QĐ-59a, QĐ-57d | `WF-12` #3 | Loại bộ thu thập, cách báo bao phủ và quy tắc hợp nhất nhiều bộ thu thập do giai đoạn Tools chốt. |
| DOI-09, QĐ-59a | `WF-13` #5 | Hợp nhất bằng chứng khi một ứng dụng có nhiều nguồn (kể cả nhiều bộ thu thập) thuộc giai đoạn Tools. |
| DOI-09, QĐ-59a | `WF-18` #6 | Loại bộ thu thập và cách báo bao phủ do giai đoạn Tools chốt; sơ đồ chỉnh nếu quy tắc nhận dữ liệu thay đổi. |
| DOI-10, QĐ-59c | `UF-07` #5 | Luật bí danh và ngưỡng khớp chốt ở giai đoạn Tools. |
| DOI-10, QĐ-59c | `WF-12a` #3 | Luật bí danh và ngưỡng khớp của tầng ánh xạ chốt ở giai đoạn Tools. |
| DOI-11, QĐ-59c | `UF-14` #3 | Quyền ghi Members của connector GitHub chưa kiểm (TE-11b): thực thi lại cấp phát qua connector chưa kiểm. |
| DOI-11, QĐ-59c | `WF-16` #4 | Quyền ghi `Members` của connector GitHub chưa kiểm (`TE-11b`) — job đọc chạy được, thực thi lại cấp phát qua connector chưa kiểm. |
| DOI-12, QĐ-37, QĐ-59c | `WF-17a` #1 | Cổng chất lượng model gợi ý nhà cung cấp chưa qua, nên nhánh gắn gợi ý AI hiện bị ẩn với người dùng; `US-15-01` không phải một trong hai tính năng AI cam kết (QĐ-61e). |
| DOI-12, QĐ-37 | `WF-17a` #2 | F60 còn mở: khớp mờ có thể đưa ứng viên sai cho IT Admin với mô tả chứa văn bản giống chỉ dẫn; chưa có quyết định xử lý — không vẽ. |
| DOI-12 | `WF-17a` #3 | Tính năng AI gợi ý nhà cung cấp chưa hiện thực. |
| DOI-13, QĐ-59b | `UF-16` #5 | Chữ ký BM-06 cùng xác nhận trong hệ thống có thay được sự đồng ý tự nguyện theo luật hay không là câu hỏi pháp lý hoãn (OQ-16, OQ-23); không khẳng định đã tuân thủ. |
| DOI-13, QĐ-59b | `WF-18` #1 | Chữ ký BM-06 kèm xác nhận trong hệ thống có thay được sự đồng ý tự nguyện theo luật hay không là câu hỏi pháp lý hoãn có điều kiện (OQ-16, OQ-23); sơ đồ chỉ thể hiện biện pháp thiết kế, không khẳng định tuân thủ. |
| DOI-16, BRD 3.2, QĐ-34 | `MF-4` #3 | Hệ thống không thanh toán hay tự hủy ở nhà cung cấp — IT thực hiện ngoài hệ thống rồi ghi nhận. |
| DOI-17, QĐ-62o | `WF-12` #4 | Nguồn usage, G2–G4 và tiết kiệm cho phần mềm nội bộ ngoài MVP. |
| DOI-17, QĐ-62o | `WF-13` #4 | Nguồn usage, G2–G4 và tiết kiệm cho phần mềm nội bộ ngoài MVP. |
| DOI-18 | `WF-14` #1 | Rà soát quyền định kỳ (`F-24`) chỉ đặc tả thiết kế, không code (Định nghĩa Phạm vi 5.2): chu kỳ, cách cấu hình kỳ và phạm vi chưa đặt. |
| DOI-18 | `WF-14` #2 | Quá hạn khi trưởng phòng không phản hồi: chưa vẽ; áp nhắc và cảnh báo nghẽn như FR-3.8 nếu `F-24` được hiện thực. Phòng thiếu trưởng phòng ⟹ việc chờ (QĐ-62c). |
| DOI-18 | `WF-14` #3 | Quy tắc IT trả lại tối đa một lần (OI-02) chưa áp cho access review. |
| DOI-18 | `WF-14` #4 | Thu hồi thất bại do WF-09a xử lý (QĐ-62i); cách ghi bằng chứng rà soát khi thu hồi thất bại chốt khi `F-24` được hiện thực. |
| DOI-39, QĐ-59e | `WF-07` #1 | Nguồn hiện hành của việc thay trưởng phòng: BRD 5.10 dòng MF-5 và QĐ-52a (chỉ định trưởng phòng mới hoặc ghi chưa có người). Câu chữ `QĐ-40a`/User Stories còn theo cây `manager_id` cũ (*chỉ định quản lý mới cho từng cấp dưới*) — đồng bộ ở giai đoạn User Stories. |
| DOI-50, QĐ-59e | `WF-06` #1 | *Ngày dự kiến quay lại* và *nhắc khi quá ngày* lấy từ User Flows `BR-04.3`, `US-03-03`; BRD không nhắc — giữ vẽ, chốt lại khi thiết kế lại User Stories. |
| DOI-50 | `WF-06` #2 | Khuyến nghị đang mở *tạm dừng* trong kỳ nghỉ (`US-03-03`) không vẽ thành bước riêng; cổng 3 của FR-4.9 đã chặn khuyến nghị G3/G4 mới. |
| DOI-58, QĐ-59e | `WF-11` #3 | Thời hạn mới khi gia hạn ghi thế nào trong lịch sử Assignment (sửa ngày hay mở khoảng hiệu lực mới) — để ERD quyết; hình ghi *ngày kết thúc mới* có Audit Trail. |
| QĐ-62o, QĐ-49c | `UF-20` #4 | Tiết kiệm khi chi phí phần mềm nội bộ giảm nằm ngoài MVP và ngoài luồng gia hạn. |

### `LIMIT`

| Mã | Sơ đồ (mục 12, dòng) | Nội dung |
| --- | --- | --- |
| DOI-04, RB-4, QĐ-54c | `MF-2` #3 | Tài khoản công ty và workspace do IT làm owner được mô phỏng trong demo. |
| DOI-04, RB-4 | `MF-5` #2 | Khóa tài khoản email công ty diễn ra ở hệ thống của doanh nghiệp (Google Workspace/Microsoft 365) — hệ thống chỉ ghi nhận; demo mô phỏng vì không có tenant công ty. |
| DOI-04, RB-4, QĐ-54c | `UF-08` #6 | Tài khoản công ty và workspace do IT làm owner được mô phỏng trong demo; K3 SSO/SCIM chỉ đặc tả. |
| DOI-04, RB-4, QĐ-54c | `WF-04` #3 | Tạo tài khoản email công ty ở hệ thống của doanh nghiệp nằm ngoài hệ thống và được mô phỏng trong demo. |
| DOI-04 | `WF-07` #3 | Khóa tài khoản email công ty diễn ra ở hệ thống của doanh nghiệp — hệ thống chỉ ghi nhận; demo mô phỏng vì không có tenant công ty (`RB-4`). |
| DOI-04 | `WF-09a` #2 | Tài khoản công ty và workspace do IT làm owner được **mô phỏng** trong demo (RB-4, QĐ-54c); K3 SSO/SCIM chỉ đặc tả. |
| DOI-08, QĐ-32c | `MF-8` #3 | Không có dữ liệu ngân hàng thật để kiểm mẫu CSV. |
| DOI-08, QĐ-32c | `WF-17` #3 | Không có dữ liệu ngân hàng thật để kiểm mẫu CSV theo ngân hàng. |
| DOI-14, OI-14d | `UF-16` #6 | Thiết bị dùng chung nhiều người là điểm mù được ghi nhận, chưa có chỗ ghi trong hình. |
| DOI-14, OI-14d | `WF-18` #5 | Thiết bị dùng chung nhiều người là điểm mù được ghi nhận, chưa có chỗ ghi trong sơ đồ. |
| DOI-15, FR-4.21, FR-10.5 | `WF-18` #4 | Hệ quả của việc dừng thu thập theo nội quy lao động do doanh nghiệp quyết, ngoài phạm vi hệ thống. |
| DOI-30 | `UF-21` #3 | Không có cảnh báo *có nhân viên mới trong phòng* (FR-5.14); hình bắt đầu từ việc trưởng phòng tự mở danh sách thành viên. |
| DOI-30 | `WF-04` #2 | Không có cảnh báo *có nhân viên mới trong phòng* cho trưởng phòng (FR-5.14) — trưởng phòng tự chủ động. |
| DOI-40 | `WF-07` #4 | Business Owner của một ứng dụng nghỉ việc: giữ người cũ kèm cờ *cần thay thế* và cảnh báo IT (`FR-1.7`, `OI-05c`) — không vẽ thành bước riêng. |
| DOI-44, QĐ-56c, FR-3.1 | `WF-05` #3 | Phòng giải thể hoặc gộp: không có luồng điều chuyển hàng loạt; tài khoản dùng chung chuyển sang phòng nhận hoặc đóng; Cost Center mới, cũ ngừng dùng. |
| DOI-54, OI-07a | `WF-08` #2 | Không có giới hạn tổng thời gian gia hạn; thời hạn quá 12 tháng chỉ cần trưởng phòng xác nhận tường minh ở bước nhu cầu. |
| DOI-62, FR-4.6 | `UF-07` #3 | Nguồn hiện hành chỉ có *để lại hàng đợi*; không có thao tác *bỏ qua kèm lý do* như bản cũ v0.7. |
| DOI-63, OI-02 | `UF-05` #3 | IT chỉ được trả lại một lần: hình vẽ bằng cạnh quay lại, không biểu diễn bộ đếm — lần trả thứ hai phải bị từ chối bằng test. |
| DOI-63, OI-02 | `UF-10` #2 | IT chỉ được trả lại một lần: hình vẽ bằng cạnh quay lại, không biểu diễn bộ đếm — lần trả thứ hai phải bị từ chối bằng test. |
| DOI-63, OI-02 | `WF-13` #1 | IT chỉ được trả lại một lần: hình vẽ bằng cạnh quay lại, không biểu diễn bộ đếm — lần trả thứ hai phải bị từ chối bằng test. |
| DOI-66 | `WF-13` #3 | Trạng thái khuyến nghị bị dữ liệu mới phủ định (superseded, tính vào KPI-5) không vẽ thành cạnh — xem máy trạng thái BRD 5.12.3. |
| DOI-77 | `UF-03` #3 | Thời hạn 10 ngày và 2 ngày làm việc là mặc định cấu hình được; bảng thời hạn tham chiếu Nghị định 356/2025/NĐ-CP cần kiểm lại tại văn bản gốc (ghi trong BRD). |
| DOI-78, FR-10.5 | `UF-03` #4 | Yêu cầu chỉnh sửa dữ liệu chỉ có hai kết cục: thực hiện, hoặc đóng vì không hợp lệ — không có *từ chối một phần*. |
| DOI-86, ADR-10, FR-1.8 | `WF-02` #3 | Chế độ xử lý dữ liệu và việc bật thu thập usage cho nhóm ứng dụng liên lạc không vẽ ở đây ngoài cờ liên lạc. |
| DOI-87, FR-8.10(d), QĐ-47a | `WF-03` #1 | Khôi phục ngoài ứng dụng do người vận hành hạ tầng thực hiện theo phiếu phê duyệt bằng văn bản (mở khóa, chuyển lại vai, khôi phục thông tin đăng nhập); không có đường HTTP nên không vẽ thành nút. |
| DOI-91 | `WF-15` #2 | Giảm số lượng giữa kỳ chỉ khi cờ FR-1.3 cho phép; không vẽ thành bước riêng — cờ thể hiện ở đề xuất, ở `s_next` (quyết định muộn) và ở bước ghi tiết kiệm (FR-4.15). |
| DOI-92 | `UF-20` #1 | Mốc cảnh báo theo BRD FR-1.4 là 15 và 7 ngày trước hạn chót (cấu hình được); các mốc T-90/T-60 của brief cũ không vẽ. |

### `CHƯA CHỐT`

| Mã | Sơ đồ (mục 12, dòng) | Nội dung |
| --- | --- | --- |
| DOI-106, QĐ-66v | `MF-4` #4 | Đã vẽ nhánh mở tác vụ thu hồi khi thuê bao hết hạn không gia hạn (`c_exp`). Còn lại: nếu sau khi tác vụ thu hồi đã mở mà một quyết định gia hạn được **ghi sau hạn chót** hoặc gia hạn được **thực hiện trước ngày kết thúc** (mệnh đề *trừ khi* ở `s_expire`; nhánh *quyết định ghi sau hạn chót* `d_late → s_next`), QĐ-66v và `US-11-04` AC-11 chỉ nêu ca không có quyết định gia hạn — số phận các tác vụ thu hồi đã mở **chưa được quyết** và hình không vẽ nhánh này. |
| DOI-106, QĐ-66v | `WF-15` #5 | Đã vẽ nhánh mở tác vụ thu hồi khi thuê bao hết hạn không gia hạn (`c_exp`). Còn lại: nếu sau khi tác vụ thu hồi đã mở mà một quyết định gia hạn được **ghi sau hạn chót** hoặc gia hạn được **thực hiện trước ngày kết thúc** (mệnh đề *trừ khi* ở `s_exp`; nhánh *quyết định ghi sau hạn chót* `d_late → s_next`), QĐ-66v và `US-11-04` AC-11 chỉ nêu ca không có quyết định gia hạn — số phận các tác vụ thu hồi đã mở **chưa được quyết** và hình không vẽ nhánh này. |
