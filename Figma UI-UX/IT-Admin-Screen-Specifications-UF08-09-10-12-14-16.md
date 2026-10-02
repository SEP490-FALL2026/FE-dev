# SaaS-Sentry — Đặc tả chi tiết màn hình các User Flow Quản trị & Thực thi (UF-06, UF-07, UF-08, UF-09, UF-10, UF-12, UF-13, UF-14, UF-16)

> **Phiên bản tài liệu:** 1.3 — 19/09/2026  
> **Phạm vi đặc tả:** Các user flow thực thi và quản trị cốt lõi của vai trò **IT Admin** và **Super Admin** gồm:  
> - `UF-06`: IT Admin nạp dữ liệu sử dụng (12 frame)  
> - `UF-07`: IT Admin xử lý hàng đợi chưa khớp danh tính (11 frame)  
> - `UF-08`: IT Admin xử lý hàng đợi cấp phát và thu hồi (16 frame)  
> - `UF-09`: IT Admin xử lý nhân viên nghỉ việc (16 frame)  
> - `UF-10`: IT Admin xử lý bảng tối ưu license (18 frame)  
> - `UF-12`: Phát hiện và hợp thức hóa phần mềm ngoài danh mục (20 frame)  
> - `UF-13`: Super Admin sửa cấu hình và luồng phê duyệt (16 frame)  
> - `UF-14`: IT Admin xử lý sai lệch và mâu thuẫn dữ liệu (16 frame)  
> - `UF-16`: IT Admin triển khai bộ thu thập, nhân viên xác nhận theo dõi (16 frame)  
>
> **Tổng cộng:** **141 trạng thái màn hình (frame)**  
> **Nguồn nghiệp vụ thẩm quyền:** [BRD v3.11](../Requiments/BRD%20-%20HỆ%20THỐNG%20QUẢN%20TRỊ%20BẢN%20QUYỀN%20PHẦN%20MỀM%20%26%20TỐI%20ƯU%20CHI%20PHÍ%20CÔNG%20NGHỆ.md), [User Flows v0.7](../Diagrams/user-flows/index.md), [Luồng màn hình tổng hợp](../Diagrams/user-flows/SaaS-Sentry-Luong-man-hinh.html)  
> **Nguồn thiết kế Figma:** `docs/Figma UI-UX/` (`UF-xx-Figma-Design-Spec.md` và các bộ ảnh `UF-xx-FullFrames`)

---

## Cấu trúc chuẩn của mỗi frame trong tài liệu

Mỗi frame màn hình được phân tích chi tiết theo 5 khía cạnh chuẩn:
1. **Ý nghĩa của màn hình:** Xuất hiện trong ngữ cảnh nào, đại diện cho trạng thái nghiệp vụ gì của hệ thống.
2. **Mục đích của màn hình:** Giải quyết bài toán gì, tại sao cần sự hiện diện của màn hình này trong quy trình.
3. **Thao tác người dùng (IT Admin):** Người dùng xem gì, tương tác với control/nút bấm/form nào.
4. **Xử lý hệ thống & Quy tắc nghiệp vụ:** Hệ thống thực hiện kiểm tra (validation), tính toán, ghi log, kích hoạt tác vụ nền hoặc áp dụng quy tắc nghiệp vụ (BR) nào.
5. **Dữ liệu đầu vào & Đầu ra / Chuyển trạng thái:** Nhận dữ liệu gì từ bước trước, kết quả sinh ra và chuyển tiếp tới frame nào kế tiếp.

---

# PHẦN 1. ĐẶC TẢ CHI TIẾT UF-06 · IT ADMIN NẠP DỮ LIỆU SỬ DỤNG

> **Mục tiêu luồng UF-06:** Quản lý quy trình toàn diện đưa dữ liệu sử dụng phần mềm (Usage Data) từ các file nhật ký hoạt động thô của nhà cung cấp SaaS (như Microsoft 365, Google Workspace, Figma, Zoom) vào hệ thống SaaS-Sentry. Thiết lập cơ chế xác thực đa tầng: kiểm tra mã băm chống trùng lặp, bảo đảm khoảng thời gian bao phủ (Coverage Window), rào chắn chặn ứng dụng liên lạc, cổng thông báo minh bạch cho người lao động, phân tích cấu trúc, khớp danh tính, xem trước trước khi ghi (Preview before Commit), và tự động kích hoạt tính lại chỉ số sử dụng sau khi nạp thành công.  
> **Nguyên tắc bất biến:**  
> - **Bắt buộc khoảng thời gian bao phủ (`BR-17.1`, `INV-10`):** Mọi dữ liệu sử dụng nạp vào hệ thống bắt buộc phải có mốc thời gian bắt đầu và kết thúc xác định (`coverage_from`, `coverage_to`). Nếu file log không tự chứa, IT Admin **bắt buộc phải khai báo tay**; hệ thống khóa cứng nút tiếp tục nếu bỏ trống.  
> - **Định nghĩa hoạt động minh bạch (`BR-17.5`, `INV-11`):** Năng lực phát hiện của từng nguồn là khác nhau (login timestamp, background execution, document edit). Hệ thống phải hiển thị rõ ràng cho IT Admin biết nguồn hiểu "hoạt động" là gì để tránh kết luận sai.  
> - **Nguyên tắc gắn theo sự kiện (`BR-17.6`, `FR-4.7`):** Dữ liệu sử dụng phải được gắn vào thực thể `Assignment` (suất bản quyền) có hiệu lực tại ngày xảy ra sự kiện, **tuyệt đối không được gắn trực tiếp vào thực thể Nhân viên (Employee)**.  
> - **Dung nạp lỗi cục bộ (`BR-17.7`):** File có một số dòng lỗi định dạng không làm hỏng toàn bộ phiên import; hệ thống cho phép tiếp tục nạp phần dữ liệu hợp lệ và xuất file lỗi riêng để IT Admin rà soát.  
> - **Rào chắn nhóm dịch vụ liên lạc (`BR-17.8`, `ADR-10`):** Các ứng dụng thuộc nhóm liên lạc (Communication apps: Slack, Teams chat, Zoom, Zalo) **mặc định bị chặn thu thập dữ liệu nhật ký hoạt động** để bảo vệ quyền riêng tư người lao động; chỉ sử dụng danh sách thành viên (membership roster) để quản trị số lượng bản quyền.  
> - **Cổng thông báo minh bạch lần đầu (`BR-42.2`, `FR-10.4`, `F-42`):** Lần đầu tiên import dữ liệu sử dụng của một ứng dụng, hệ thống bắt buộc phải kiểm tra và xác nhận đã gửi thông báo minh bạch tới toàn bộ nhân viên đang giữ suất bản quyền. Chưa gửi thông báo thì **CHẶN TUYỆT ĐỐI không cho ghi dữ liệu**.  
> - **Bản ghi chưa khớp không dùng kết luận (`BR-18.1`, `INV-12`):** Các định danh chưa khớp tự động được tách ra đưa vào hàng đợi `UF-07`; phần dữ liệu hợp lệ vẫn tiếp tục tới bước xem trước; các bản ghi chưa khớp tuyệt đối không dùng để kết luận nhân viên không dùng phần mềm.  
> - **Xem trước bắt buộc & Hủy ghi 0 dòng (`FR-7.2`, `F-17`):** Xem trước (Preview) là bước bắt buộc trước khi ghi; nếu IT Admin chọn Hủy tại Preview, hệ thống cam kết **ghi đúng 0 dòng** vào cơ sở dữ liệu.

```text
Topology UF-06:
Trung tâm & Cấu hình:  01 (Trung tâm nguồn ITA-08) → 02 (Chọn ứng dụng & mẫu nguồn)
Rào chắn chính sách:   02 → 03 (Kiểm tra chính sách)
                        ├─ Ứng dụng liên lạc: 03 (CHẶN theo ADR-10 / BR-17.8) → Kết thúc
                        ├─ Lần đầu import:    03 → 04 (Cổng thông báo F-42 / BR-42.2) → Đã thông báo
                        └─ Đã thông báo:      03 → 05 (Bước 1 — Tải file)
Quy trình nạp 6 bước:   05 (Bước 1: Tải file & tính hash SHA-256) [OVL-01 nếu trùng hash]
                        → 06 (Bước 2: Phân tích & Khai báo Coverage bắt buộc BR-17.1)
                        → 07 (Bước 3: Khớp danh tính 88.3% → Chuyển 146 unmatched sang UF-07)
                        → 08 (Bước 4: Xem trước 8 nhóm thông tin — chưa ghi dòng nào)
                           ├─ Hủy: [OVL-02] → Kết thúc, ghi 0 dòng
                           └─ Xác nhận: 09 (Dialog cam kết gắn vào Assignment BR-17.6)
                        → 10 (Bước 5: Đang ghi dữ liệu nền — Batch Commit Job)
                        → 11 (Bước 6: Hoàn tất phiên IMP-20250114-7F3A → Handoff UF-07 / UF-10)
Kiểm toán & Lịch sử:   11 → 12 (Lịch sử phiên import & Audit Trail đầy đủ ITA-07/ITA-08)
```

---

### Frame 01 · Trung tâm nguồn dữ liệu sử dụng (Data Sources Workbench - ITA-08)
- **Ý nghĩa của màn hình:** Là trung tâm điều hành quản lý toàn bộ các nguồn nạp dữ liệu hoạt động phần mềm (SaaS connectors, log files, IdP, endpoint collectors) trên toàn doanh nghiệp.
- **Mục đích của màn hình:** Cung cấp bức tranh tổng thể về tình trạng nạp dữ liệu: ứng dụng nào đã có dữ liệu, coverage window gần nhất, độ mới của dữ liệu (recency), cảnh báo các ứng dụng quá hạn cập nhật dữ liệu, và kích hoạt quy trình tạo phiên import mới.
- **Thao tác người dùng (IT Admin):**
  - Quan sát 4 thẻ số liệu tổng quan trên cùng: Tổng số nguồn đã kết nối (12 nguồn), Nguồn đang hoạt động (9), Nguồn cần cập nhật dữ liệu (3), Tổng số sự kiện sử dụng tháng này (142.500 events).
  - Rà soát bảng danh sách nguồn dữ liệu: Microsoft 365 (Lần import cuối: 15/12/2024 · Cần nạp mới kỳ tháng 01/2025), Google Workspace, Figma Professional, GitHub Enterprise, Zoom, Slack.
  - Lọc theo loại nguồn (`CSV Log`, `API Connector`, `Browser Extension`) hoặc trạng thái.
  - Nhấn nút hành động chính ở góc trên bên phải: **“Tạo phiên nạp dữ liệu mới”** (New Import Session).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Tải trạng thái các nguồn nạp dữ liệu từ bảng `data_sources` và `import_sessions`.
  - Tính toán độ trễ dữ liệu: Đánh dấu badge màu vàng `Cần nạp dữ liệu` cho Microsoft 365 vì dữ liệu hiện tại chỉ bao phủ đến 15/12/2024, đã quá chu kỳ 30 ngày.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Danh mục các ứng dụng SaaS và lịch sử nạp dữ liệu.
  - *Đầu ra / Bước tiếp:* Nhấn “Tạo phiên nạp dữ liệu mới” → Mở màn hình chọn ứng dụng và mẫu nguồn tại **Frame 02**.

---

### Frame 02 · Chọn ứng dụng và mẫu nguồn (Select Application & Template - ITA-08)
- **Ý nghĩa của màn hình:** Màn hình cấu hình ban đầu để thiết lập ngữ cảnh kỹ thuật cho phiên nạp dữ liệu sử dụng.
- **Mục đích của màn hình:** Đảm bảo IT Admin lựa chọn chính xác ứng dụng mục tiêu, mẫu cấu hình định dạng (Template parser), loại định danh người dùng và hiểu rõ năng lực phát hiện lãng phí của nguồn trước khi nạp file.
- **Thao tác người dùng (IT Admin):**
  - Tại ô chọn Phần mềm (Application): Chọn `Microsoft 365` (Mã ứng dụng: `APP-M365-01`).
  - Tại ô chọn Mẫu nguồn (Template): Chọn `Microsoft 365 · Usage Report v3 (CSV)`.
  - Chọn Loại định danh chính (Identifier Type): `User Principal Name (UPN)`.
  - Chọn Múi giờ dữ liệu (Timezone): `UTC+07:00 (Indochina Time - ICT)`.
  - Quan sát Panel ngữ cảnh nguồn cố định bên phải:
    - Năng lực nguồn: Nhận diện hoạt động đăng nhập, mở app web/desktop, tương tác file OneDrive/SharePoint.
    - Nhóm lãng phí có thể phát hiện: `G3` (Chưa từng kích hoạt) và `G4` (Không hoạt động lâu ngày).
    - Định nghĩa hoạt động: Có phát sinh ít nhất 1 sự kiện truy cập dịch vụ trong ngày.
    - Số Assignment bị ảnh hưởng dự kiến: ~1.100 license Microsoft 365.
  - Nhấn nút: **“Tiếp tục”** (Proceed).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Nạp schema mẫu cấu hình `Microsoft 365 · Usage v3` gồm các trường bắt buộc: `UserPrincipalName`, `LastActivityDate`, `ProductsAssigned`.
  - Kiểm tra loại ứng dụng: Nếu ứng dụng thuộc danh mục liên lạc (`communication`) → Kích hoạt rào chắn chính sách tại **Frame 03**. Nếu là ứng dụng thông thường, kiểm tra cờ thông báo lần đầu (`has_notified_employees`).
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Lựa chọn ứng dụng Microsoft 365 và Template v3 của IT Admin.
  - *Đầu ra / Bước tiếp:* Nhấn “Tiếp tục” → Chuyển sang bước kiểm tra chính sách tại **Frame 03**.

---

### Frame 03 · Kiểm tra chính sách nguồn & Rào chắn ứng dụng liên lạc (Policy Check & Communication Guard)
- **Ý nghĩa của màn hình:** Màn hình rà soát chính sách bảo vệ quyền riêng tư và kiểm soát tuân thủ trước khi nạp dữ liệu.
- **Mục đích của màn hình:** Thực thi nghiêm ngặt hai rào chắn cốt lõi:
  1. **Rào chắn ứng dụng liên lạc (`BR-17.8`, `ADR-10`):** Nếu người dùng chọn ứng dụng giao tiếp (Slack, Teams chat, Zoom), màn hình chuyển sang trạng thái bị khóa cứng (Blocked State), từ chối thu thập log sử dụng, chỉ cho phép dùng danh sách tài khoản thành viên (roster).
  2. **Kiểm tra thông báo minh bạch (`BR-42.2`, `F-42`):** Với ứng dụng thông thường (Microsoft 365), kiểm tra xem doanh nghiệp đã phát thông báo minh bạch cho nhân viên chưa.
- **Thao tác người dùng (IT Admin):**
  - Quan sát kết quả kiểm tra chính sách:
    - Mục 1: *Kiểm tra nhóm dịch vụ liên lạc:* **ĐẠT (PASSED)** — Microsoft 365 được cấu hình chỉ thu thập log dịch vụ văn phòng (Office Apps, OneDrive, SharePoint), không thu thập nội dung tin nhắn riêng tư.
    - Mục 2: *Kiểm tra thông báo minh bạch (F-42):* **CHƯA HOÀN TẤT (ACTION REQUIRED)** — Đây là phiên nạp dữ liệu sử dụng đầu tiên của Microsoft 365 kể từ khi ban hành chính sách mới; cần kích hoạt thông báo tới nhân viên trước khi upload file.
  - Nhấn nút hành động: **“Chuyển sang Cổng thông báo minh bạch”** (Proceed to Notification Gate).
  - *(Lưu ý: Nếu chọn Slack/Teams chat, nút Tiếp tục bị ẩn hoàn toàn, chỉ có nút "Quay lại chọn ứng dụng khác").*
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Áp dụng `BR-17.8`, `ADR-10`: Chặn tuyệt đối việc nạp log tin nhắn/cuộc gọi của các phần mềm liên lạc; bảo vệ doanh nghiệp khỏi rủi ro pháp lý về quyền riêng tư nơi làm việc.
  - Áp dụng `BR-42.2`: Truy vấn bảng `privacy_notifications`. Nếu chưa có bản ghi thông báo hợp lệ cho ứng dụng Microsoft 365, hệ thống khóa cứng bước upload file cho tới khi cổng F-42 được kích hoạt.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Cấu hình phiên nạp Microsoft 365 từ Frame 02.
  - *Đầu ra / Bước tiếp:* Nhấn chuyển cổng thông báo → Mở cổng F-42 tại **Frame 04**.

---

### Frame 04 · Cổng thông báo minh bạch lần đầu (Employee Notification Gate - ITA-07 / F-42)
- **Ý nghĩa của màn hình:** Cổng kiểm soát tuân thủ `BR-42.2` và `FR-10.4` bảo đảm tính minh bạch đối với người lao động trước khi thu thập dữ liệu sử dụng phần mềm.
- **Mục đích của màn hình:** Bắt buộc gửi thông báo chính thức tới toàn bộ nhân viên đang giữ suất bản quyền của phần mềm mục tiêu, nêu rõ mục đích thu thập (tối ưu chi phí, không đánh giá hiệu suất cá nhân) và thời điểm bắt đầu thu thập.
- **Thao tác người dùng (IT Admin):**
  - Rà soát thông tin chiến dịch thông báo:
    - Ứng dụng mục tiêu: Microsoft 365 E3/E5.
    - Đối tượng nhận thông báo: Toàn bộ **1.089 nhân viên** đang được cấp phát bản quyền Microsoft 365.
    - Kênh gửi: Email thông báo công ty + Thông báo nổi trên Cổng tự phục vụ nhân viên (`EMP-01`).
    - Nội dung thông báo chuẩn: *“Công ty tiến hành thu thập dữ liệu tần suất sử dụng phần mềm Microsoft 365 nhằm mục đích tối ưu hóa tài nguyên công nghệ và chi phí bản quyền. Dữ liệu này tuân thủ quy định bảo vệ dữ liệu nội bộ và không dùng để đánh giá năng suất cá nhân.”*
  - Tick chọn checkbox: *“Tôi xác nhận nội dung thông báo minh bạch và yêu cầu hệ thống gửi thông báo tới 1.089 nhân viên liên quan.”*
  - Nhấn nút: **“Gửi thông báo & Mở khóa bước tải file”** (Send Notification & Unlock Upload).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Áp dụng `BR-42.2`: Sinh bản ghi trong bảng `privacy_notifications` kèm mã băm nội dung, danh sách người nhận và timestamp `14/01/2025 10:20 ICT`.
  - Kích hoạt queue gửi thông báo email và notification trong hệ thống.
  - Mở khóa trạng thái `has_notified_employees = true` cho phiên làm việc hiện tại, cho phép chuyển sang bước tải file dữ liệu.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Danh sách nhân viên đang giữ license Microsoft 365 và mẫu thông báo F-42.
  - *Đầu ra / Bước tiếp:* Bấm gửi thông báo → Mở khóa thành công, chuyển sang **Frame 05**.

---

### Frame 05 · Bước 1 — Tải file dữ liệu & Tính mã băm (Step 1 Upload & SHA-256 Hash - ITA-07)
- **Ý nghĩa của màn hình:** Màn hình tiếp nhận file dữ liệu nhật ký sử dụng thô được trích xuất từ cổng quản trị Microsoft 365 Admin Center.
- **Mục đích của màn hình:** Tải file an toàn, kiểm tra định dạng, tự động tính toán mã băm SHA-256 thời gian thực, và kích hoạt cảnh báo trùng lặp (`OVL-01`) nếu phát hiện file này đã từng được nạp vào hệ thống trước đó.
- **Thao tác người dùng (IT Admin):**
  - Kéo thả file `m365_usage_jan2025.csv` (Dung lượng: 185 KB, 1.248 dòng) vào khu vực Upload Dropzone.
  - Quan sát thanh tiến trình tải file đạt 100% (Parsed successfully).
  - Xem thông số file vừa tính toán:
    - Tên file: `m365_usage_jan2025.csv`
    - Kích thước: 185.3 KB · Tổng số dòng thô: 1.248 dòng.
    - Mã băm toàn vẹn (SHA-256): `7f3a9c21e4b85d60a12f8e4b3c2a10d95e8b7a6c5d4e3f2a1b0c9d8e7f6a5b4c`
    - Trạng thái kiểm tra trùng lặp: *“File hợp lệ — Chưa từng được nạp trong hệ thống (No duplicate found)”*.
    - *(Trường hợp file trùng: Hộp thoại OVL-01 xuất hiện cảnh báo phiên trước đã import lúc nào, IT Admin tick "Tiếp tục có chủ đích" để tiếp tục).*
  - Nhấn nút hành động: **“Phân tích cấu trúc file”** (Parse File).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Tính toán mã băm SHA-256 của file tải lên ngay tại thời điểm tiếp nhận.
  - Truy vấn bảng `import_sessions` theo `file_hash`. Nếu trùng mã băm: Áp dụng `OVL-01` cảnh báo người dùng nhưng **không chặn cứng**, cho phép ghi đè nếu có chủ đích giải trình.
  - Kiểm tra cấu trúc file cơ bản: File CSV có chứa header hợp lệ, mã hóa UTF-8.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* File `m365_usage_jan2025.csv` từ máy trạm của IT Admin.
  - *Đầu ra / Bước tiếp:* Nhấn “Phân tích cấu trúc file” → Chuyển sang Bước 2 tại **Frame 06**.

---

### Frame 06 · Bước 2 — Phân tích cấu trúc & Khai báo Coverage (Step 2 Parse & Coverage Window - ITA-07)
- **Ý nghĩa của màn hình:** Màn hình ánh xạ các cột dữ liệu (Column Mapping) và thiết lập khoảng thời gian bao phủ nghiệp vụ (Coverage Window).
- **Mục đích của màn hình:** Thực thi quy tắc bắt buộc cốt lõi **`BR-17.1`** và **`INV-10`**: Mọi dữ liệu sử dụng bắt buộc phải có mốc thời gian bắt đầu và kết thúc; hiển thị định nghĩa "hoạt động" minh bạch (`BR-17.5`, `INV-11`).
- **Thao tác người dùng (IT Admin):**
  - Rà soát bảng ánh xạ cột tự động:
    - Cột định danh: `UserPrincipalName` → `Identifier (UPN)` (100% mapped)
    - Cột thời gian: `LastActivityDate` → `Event Timestamp` (Định dạng: `YYYY-MM-DD`)
    - Cột gói phần mềm: `ProductsAssigned` → `Subscription / Product SKU`
  - Rà soát khoảng thời gian bao phủ (Coverage Window):
    - Do file log Microsoft 365 chỉ chứa ngày hoạt động gần nhất mà không chứa trường khoảng ngày toàn bộ chu kỳ, hệ thống yêu cầu IT Admin **khai báo tay Date Range bắt buộc**:
    - Nhập Từ ngày: `01/01/2025` · Đến ngày: `31/01/2025` (Tổng cộng: **31 ngày bao phủ**).
    - Cảnh báo inline: *“Khoảng thời gian bao phủ là bắt buộc theo BR-17.1. Không được bỏ trống.”*
  - Xem định nghĩa hoạt động của nguồn tại panel phải: Hoạt động được tính khi người dùng phát sinh ít nhất 1 sự kiện trên các ứng dụng Office 365 trong khoảng ngày đã chọn.
  - Nhấn nút: **“Tiến hành khớp danh tính”** (Proceed to Identity Resolution).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Áp dụng `BR-17.1`, `INV-10`: Kiểm tra hợp lệ trường ngày (`coverage_from <= coverage_to`). Nếu để trống: Báo lỗi đỏ, **vô hiệu hóa hoàn toàn nút “Tiến hành khớp danh tính”**.
  - Áp dụng `BR-17.5`, `INV-11`: Ghi nhận logic xác định active của mẫu Microsoft 365 v3 để chuẩn bị tính toán cho các rule lãng phí G3/G4 ở các bước sau.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Cấu trúc file đã parse và khoảng thời gian bao phủ 01/01/2025–31/01/2025.
  - *Đầu ra / Bước tiếp:* Nhấn tiếp tục → Hệ thống kích hoạt thuật toán so khớp danh tính tại **Frame 07**.

---

### Frame 07 · Bước 3 — Khớp danh tính người dùng (Step 3 Identity Resolution - ITA-07)
- **Ý nghĩa của màn hình:** Màn hình tổng hợp kết quả thuật toán tự động đối soát giữa danh tính bên ngoài (UPN đám mây) và hồ sơ nhân viên nội bộ trong HRIS.
- **Mục đích của màn hình:** Phân định rạch ròi 4 trạng thái khớp, thực thi ranh giới bàn giao theo `BR-18.1`: Các bản ghi chưa khớp được tách riêng sang hàng đợi `UF-07`, trong khi phần dữ liệu hợp lệ vẫn tiếp tục đi vào bước xem trước mà không làm tắc nghẽn toàn bộ file.
- **Thao tác người dùng (IT Admin):**
  - Quan sát 4 thẻ số liệu kết quả so khớp danh tính:
    1. **Khớp chính xác (Exact Match):** **984 định danh** (78.8%) — Khớp 100% email công ty.
    2. **Khớp chuẩn hóa (Normalized Match):** **118 định danh** (9.5%) — Khớp sau khi xử lý chữ hoa/thường, dấu chấm thừa.
    3. **Tổng khớp tự động thành công:** **1.102 định danh** (88.3%).
    4. **Chưa khớp danh tính (Unmatched):** **146 định danh** (11.7%) — Cần xử lý riêng.
  - Đọc thông báo ranh giới nghiệp vụ: *“146 định danh chưa khớp sẽ được tự động chuyển vào Hàng đợi chưa khớp danh tính (UF-07) sau khi phiên import hoàn tất. Dữ liệu chưa khớp KHÔNG dùng để kết luận về nhân viên theo BR-18.1. Phần dữ liệu hợp lệ (1.102 bản ghi) sẵn sàng để xem trước.”*
  - Nhấn nút: **“Xem trước dữ liệu”** (Proceed to Preview).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Thuật toán so khớp chạy theo thứ tự ưu tiên: Khớp exact email → Khớp normalized UPN.
  - Áp dụng `BR-18.1`, `INV-12`: Tách riêng 146 bản ghi chưa khớp sang hàng đợi `UF-07`, gán cờ `is_conclusive = false`.
  - Cho phép 1.102 bản ghi hợp lệ tiếp tục sang bước Preview theo nguyên tắc không làm gián đoạn vận hành (`F-17`).
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* 1.248 dòng dữ liệu đã phân tích cấu trúc.
  - *Đầu ra / Bước tiếp:* Nhấn “Xem trước dữ liệu” → Mở màn hình tổng hợp Preview tại **Frame 08**.

---

### Frame 08 · Bước 4 — Xem trước dữ liệu trước khi ghi (Step 4 Preview Before Commit - ITA-07)
- **Ý nghĩa của màn hình:** Màn hình thẩm định dữ liệu toàn diện và mang tính quyết định trước khi hệ thống thực hiện bất kỳ lệnh ghi nào vào cơ sở dữ liệu.
- **Mục đích của màn hình:** Thực thi nghiêm ngặt quy tắc **`FR-7.2`** và **`F-17`**: Hiển thị đầy đủ **8 nhóm thông tin bắt buộc**, xác nhận **chưa có bất kỳ dòng dữ liệu nào được ghi**, và cung cấp hai lựa chọn rõ ràng: Hủy bỏ (ghi 0 dòng) hoặc Xác nhận ghi dữ liệu.
- **Thao tác người dùng (IT Admin):**
  - Rà soát đầy đủ 8 nhóm thông tin bắt buộc theo quy chuẩn thiết kế:
    1. **Số dòng hợp lệ:** **1.102 dòng** sẵn sàng ghi vào hệ thống.
    2. **Số dòng lỗi định dạng:** **14 dòng** (kèm liên kết: *“Tải danh sách 14 dòng lỗi (.csv)”*).
    3. **Số dòng trùng lặp:** **0 dòng**.
    4. **Số định danh chưa khớp:** **146 định danh** (kèm cảnh báo không dùng để kết luận).
    5. **Cửa sổ bao phủ (Coverage Window):** `01/01/2025 – 31/01/2025` (31 ngày).
    6. **Số Assignment bị ảnh hưởng:** **1.089 license** Microsoft 365 E3/E5 đang hiệu lực.
    7. **Nhóm lãng phí có thể phát hiện:** `G3` (Chưa từng kích hoạt) và `G4` (Không hoạt động lâu ngày).
    8. **Định nghĩa “hoạt động” của nguồn:** Có phát sinh ít nhất 1 sự kiện đăng nhập hoặc sử dụng dịch vụ Office trong 31 ngày.
  - Quan sát bảng xem trước 10 dòng dữ liệu mẫu (Sample Data Table): Hiển thị mã nhân viên, email, số ngày hoạt động, trạng thái active.
  - Cân nhắc 2 hành động:
    - **Nút Hủy bỏ phiên import:** Kích hoạt dialog xác nhận hủy, cam kết ghi đúng 0 dòng.
    - **Nút hành động chính:** **“Xác nhận ghi dữ liệu”** (Proceed to Commit).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Áp dụng `FR-7.2`, `F-17`: Hệ thống ở trạng thái chỉ đọc (Read-only Preview); tuyệt đối không có thao tác INSERT/UPDATE nào được thực thi dưới nền.
  - Áp dụng `BR-17.7`: Cho phép tiếp tục ghi 1.102 dòng hợp lệ và bỏ qua 14 dòng lỗi; cung cấp file xuất chi tiết các dòng lỗi kèm nguyên nhân vi phạm cấu trúc.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Dữ liệu tổng hợp từ các bước 1, 2, 3.
  - *Đầu ra / Bước tiếp:* 
    - Nếu bấm Hủy → Dialog xác nhận hủy OVL-02, kết thúc với 0 dòng được ghi.
    - Nếu bấm Xác nhận → Mở hộp thoại cam kết ghi dữ liệu tại **Frame 09**.

---

### Frame 09 · Xác nhận cam kết ghi dữ liệu (Commit Confirmation Dialog - OVL-02)
- **Ý nghĩa của màn hình:** Hộp thoại kiểm soát phê duyệt cuối cùng (Final Approval Modal) của IT Admin trước khi khởi chạy giao dịch ghi dữ liệu lớn.
- **Mục đích của màn hình:** Thực thi quy tắc tuân thủ kiểm toán **`BR-17.6`**: Yêu cầu người quản trị xác nhận trách nhiệm, cam kết dữ liệu sử dụng sẽ được gắn vào `Assignment` theo ngày sự kiện chứ không gắn trực tiếp vào nhân viên, và đồng ý chuyển 146 bản ghi chưa khớp sang `UF-07`.
- **Thao tác người dùng (IT Admin):**
  - Đọc kỹ thông số tóm tắt trong hộp thoại xác nhận:
    - Phiên import: `IMP-20250114-7F3A` · Ứng dụng: `Microsoft 365`
    - Phạm vi ghi: 1.102 bản ghi sử dụng hợp lệ sẽ được nạp và liên kết với 1.089 Assignment.
    - Xử lý ngoại lệ: 14 dòng lỗi bị bỏ qua; 146 định danh chưa khớp chuyển vào hàng đợi UF-07.
    - Cảnh báo bất biến: *“Dữ liệu ghi vào hệ thống sẽ làm căn cứ để engine tính toán lãng phí license tại UF-10.”*
  - Tick chọn checkbox cam kết bắt buộc: *“Tôi xác nhận các thông số bao phủ (01/01/2025–31/01/2025) và phê duyệt ghi dữ liệu sử dụng vào các Assignment tương ứng theo BR-17.6.”*
  - Nhấn nút hành động: **“Bắt đầu ghi dữ liệu”** (Commit Import Now).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Khóa nút xác nhận cho đến khi checkbox cam kết được tick chọn.
  - Khởi tạo transaction cơ sở dữ liệu: Tạo bản ghi `import_sessions` với trạng thái `COMMITTING`, ghi nhận `created_by = "it-admin@company.com"`, `created_at = CurrentTimestamp()`.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Lệnh phê duyệt từ Frame 08 và cam kết của IT Admin.
  - *Đầu ra / Bước tiếp:* Nhấn bắt đầu ghi → Kích hoạt async worker job, chuyển sang màn hình tiến trình tại **Frame 10**.

---

### Frame 10 · Bước 5 — Đang ghi dữ liệu vào hệ thống (Step 5 Committing Progress - ITA-07)
- **Ý nghĩa của màn hình:** Màn hình trạng thái tiến trình thực thi nền (Asynchronous Worker Progress) thể hiện hệ thống đang thực hiện lệnh chèn dữ liệu hàng loạt.
- **Mục đích của màn hình:** Đảm bảo tính minh bạch và toàn vẹn dữ liệu: Cung cấp tiến độ thực tế theo thời gian thực (real-time progress), khóa toàn bộ tương tác để tránh xung đột dữ liệu, và ngăn chặn việc báo thành công giả tạo trước khi transaction commit hoàn tất.
- **Thao tác người dùng (IT Admin):**
  - Quan sát thanh tiến trình phần trăm và thông số xử lý trực tiếp:
    - Trạng thái: *“Đang ghi dữ liệu vào cơ sở dữ liệu (Batch 3/5)...”*
    - Tiến độ: **68%** hoàn thành.
    - Số dòng đã xử lý: **750 / 1.102 dòng**.
    - Số Assignment đã được liên kết: **742 / 1.089 license**.
    - Tốc độ xử lý: ~250 records/giây.
  - Mọi nút bấm hủy, quay lại hoặc điều hướng trên thanh wizard đều bị vô hiệu hóa hoàn toàn (disabled).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Worker nền thực hiện batch insert dữ liệu vào bảng `usage_events`.
  - Áp dụng `BR-17.6`: Truy vấn `assignment_id` có hiệu lực tại ngày phát sinh sự kiện để gắn foreign key; tuyệt đối không gắn trực tiếp vào bảng `employees`.
  - Đẩy 146 bản ghi chưa khớp vào bảng `identity_unmatched_queue` của phiên `IMP-20250114-7F3A` để sẵn sàng phục vụ cho `UF-07`.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Giao dịch ghi dữ liệu đang chạy.
  - *Đầu ra / Bước tiếp:* Worker hoàn tất 100% và database commit thành công → Chuyển sang màn hình hoàn tất tại **Frame 11**.

---

### Frame 11 · Bước 6 — Hoàn tất phiên nạp dữ liệu (Step 6 Complete & Handoff - ITA-07)
- **Ý nghĩa của màn hình:** Màn hình kết quả xác nhận phiên import `IMP-20250114-7F3A` đã hoàn tất thành công trọn vẹn và an toàn.
- **Mục đích của màn hình:** Cung cấp biên bản nghiệm thu phiên nạp dữ liệu, thông báo kích hoạt tự động tính toán lại chỉ số sử dụng cho 1.089 Assignment, và mở ra 2 ngã rẽ chuyển giao nghiệp vụ chiến lược: Bàn giao sang `UF-07` hoặc bàn giao sang `UF-10`.
- **Thao tác người dùng (IT Admin):**
  - Quan sát thông báo thành công nổi bật: *“Phiên nạp dữ liệu IMP-20250114-7F3A đã hoàn tất thành công!”*
  - Rà soát bảng tổng kết phiên:
    - Tổng số dòng đã ghi: **1.102 dòng** vào bảng sự kiện sử dụng.
    - Số dòng lỗi định dạng đã bỏ qua: **14 dòng**.
    - Số định danh chưa khớp đã bàn giao: **146 định danh** (sẵn sàng xử lý tại UF-07).
    - Số Assignment đã kích hoạt tính lại: **1.089 license** Microsoft 365 E3/E5.
    - Thời gian hoàn tất: `14/01/2025 · 10:24 ICT` (Tổng thời gian xử lý: 4 phút 12 giây).
  - Lựa chọn 1 trong 2 hành động chuyển giao tiếp theo:
    1. **Hành động ưu tiên (CTA Chính):** **“Xử lý hàng đợi chưa khớp danh tính (146)”** → Điều hướng trực tiếp sang **UF-07 · Frame 01**.
    2. **Hành động kế tiếp (CTA Phụ):** **“Xem Bảng tối ưu License”** → Điều hướng sang **UF-10 · Frame 01**.
    3. **Liên kết phụ:** *“Xem chi tiết phiên trong Nhật ký kiểm toán (Frame 12)”*.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Cập nhật trạng thái phiên trong `import_sessions` thành `COMPLETED`.
  - Kích hoạt tác vụ nền tự động: Tính toán lại mức độ hoạt động (Activity Status), ngày hoạt động gần nhất (Last Active Date) và tỷ lệ sử dụng (Usage Ratio) cho toàn bộ 1.089 Assignment vừa nhận dữ liệu.
  - Phát sinh thông báo hệ thống và ghi nhận sự kiện vào Audit Trail.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Kết quả commit hoàn tất từ Frame 10.
  - *Đầu ra / Bước tiếp:*
    - Bấm “Xử lý hàng đợi chưa khớp” → Bàn giao dữ liệu sang **UF-07** (Frame 01).
    - Bấm “Xem Bảng tối ưu License” → Bàn giao dữ liệu sang **UF-10** (Frame 01).
    - Bấm xem chi tiết → Mở hồ sơ kiểm toán tại **Frame 12**.

---

### Frame 12 · Lịch sử và kiểm toán phiên import (Import History & Audit Trail - ITA-07 / ITA-08)
- **Ý nghĩa của màn hình:** Màn hình tra cứu hồ sơ lưu trữ và dấu vết kiểm toán bất biến (Audit Trail) của toàn bộ các phiên nạp dữ liệu sử dụng trong doanh nghiệp.
- **Mục đích của màn hình:** Thực thi quy định kiểm toán **`FR-8.3`** và **`FR-7.4`**: Cung cấp bằng chứng pháp lý và kỹ thuật phục vụ đối soát, giải trình khiếu nại nhân sự hoặc chứng minh nguồn gốc dữ liệu khi rà soát tối ưu chi phí.
- **Thao tác người dùng (IT Admin):**
  - Quan sát dòng thông tin chi tiết của phiên vừa hoàn tất đứng đầu danh sách:
    - Mã phiên: `IMP-20250114-7F3A` · Trạng thái: `Hoàn tất (Completed)`
    - Ứng dụng: Microsoft 365 · Mẫu nguồn: Usage Report v3
    - File nguồn: `m365_usage_jan2025.csv` (185 KB)
    - Mã băm SHA-256: `7f3a9c21...f6a5b4c`
    - Khoảng bao phủ: `01/01/2025 – 31/01/2025`
    - Người thực hiện: `IT Admin · it-admin@company.com`
    - Thời gian: Bắt đầu 10:20 ICT · Kết thúc 10:24 ICT (14/01/2025)
    - Kết quả: 1.102 dòng ghi / 14 lỗi / 146 chưa khớp / 1.089 license ảnh hưởng.
    - Correlation ID: `COR-M365-20250114-7F3A`
  - Có thể bấm nút: **“Tải gói kiểm toán đầy đủ (.zip)”** (Bao gồm file log gốc, danh sách 14 dòng lỗi, và file JSON audit trail có chữ ký số).
  - Sử dụng bộ lọc tìm kiếm theo ứng dụng, người thực hiện hoặc khoảng thời gian.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Nạp dữ liệu bất biến từ bảng `audit_logs` và `import_sessions`.
  - Đảm bảo tính toàn vẹn dữ liệu kiểm toán: Bản ghi audit chỉ cho phép đọc và trích xuất, tuyệt đối không có quyền sửa hoặc xóa (Append-only per `BR-38.1`).
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Bản ghi phiên import `IMP-20250114-7F3A`.
  - *Đầu ra / Bước tiếp:* Hoàn tất toàn bộ 12 frame của luồng `UF-06`; sẵn sàng cho các quy trình tiếp theo.

---

# PHẦN 2. ĐẶC TẢ CHI TIẾT UF-07 · IT ADMIN XỬ LÝ HÀNG ĐỢI CHƯA KHỚP DANH TÍNH

> **Mục tiêu luồng UF-07:** Thiết lập bàn làm việc tập trung (Queue Workbench) cho IT Admin để rà soát, thẩm định và xử lý dứt điểm các định danh tài khoản người dùng từ nguồn bên ngoài (như Microsoft 365, Google Workspace, IdP) chưa khớp tự động với hồ sơ nhân sự nội bộ sau các phiên import (`UF-06`). Phân định rạch ròi 3 nhánh xử lý: Khớp thủ công có kiểm soát (Manual Match), Bỏ qua có giải trình (Dismiss / Ignore), và Chặn cách ly khi xung đột danh tính đa ứng viên (Ambiguous Conflict Blocked).  
> **Nguyên tắc bất biến:**  
> - **Nguyên tắc bảo vệ nhân viên (`BR-18.1`, `INV-12`, `FR-4.6`, `FR-4.10`):** Bản ghi chưa khớp **tuyệt đối không được dùng để tạo khuyến nghị, đánh giá năng suất hoặc đưa ra bất kỳ kết luận nào về nhân viên**. Dữ liệu này bị loại trừ hoàn toàn khỏi engine tính Ghost Seat và bảng tối ưu hóa license (`UF-10`).  
> - **Nguyên tắc toàn vẹn định danh (`BR-18.2`, `FR-7.6`):** Luôn hiển thị chuỗi gốc (raw identifier) nguyên vẹn bên cạnh chuỗi đã chuẩn hóa (normalized identifier); không được cắt xén làm mất dấu vết phân biệt.  
> - **Nguyên tắc minh bạch kiểm toán (`BR-18.3`, `FR-4.5`):** Khớp thủ công bắt buộc phải ghi nhận định danh người xác nhận (`confirmed_by`), thời điểm (`confirmed_at`), phương pháp khớp (`match_method = "Approximate Email + Display Name (Manual)"`) và độ tin cậy. Không được tự ý sửa nhãn thành khớp tự động hoàn toàn (Exact match).  
> - **Rào chắn chống gán tùy tiện (`BR-18.4`, `FR-7.7`):** Khi một định danh khớp về từ 2 nhân viên trở lên, hệ thống **CHẶN TUYỆT ĐỐI** mọi thao tác gán thủ công hoặc chọn bừa một trong hai. Bản ghi chuyển sang trạng thái `Chờ xử lý xung đột danh tính`; hàng đợi chưa khớp không được giảm.  
> - **Tính toán gắn theo sự kiện (`FR-4.7`, `F-18 bước 4`):** Khớp thành công phải kích hoạt worker nền tính lại tổng hợp dữ liệu sử dụng, gắn dữ liệu usage vào `Assignment` có hiệu lực tại ngày xảy ra sự kiện, **không gắn trực tiếp vào thực thể Nhân viên**.  
> - **Toàn vẹn số liệu hàng đợi (Queue Ledger):** Bắt đầu phiên với 146 bản ghi chưa khớp. Khớp `UQ-0184` thành công giảm còn 145 (1 đã xử lý). Bỏ qua `UQ-0185` giảm còn 144 (2 đã xử lý). Phát hiện xung đột `UQ-0186` giữ nguyên 144 (xung đột chờ: 1; đã xử lý: 2) vì chưa giải quyết dứt điểm.

```text
Topology UF-07:
Hàng đợi tổng quan (146 items): 01 (Bắt đầu phiên)
Nhánh 1 · Khớp duy nhất:         01 → 02 (Xem gợi ý 94%) → 03 (Xác nhận khớp) → 04 (Đang tính lại) → 05 (Thành công, Queue 145)
Nhánh 2 · Bỏ qua có lý do:       01/05 → 06 (Không có ứng viên) → 07 (Nhập lý do ≥10 ký tự) → 08 (Đã bỏ qua, Queue 144)
Nhánh 3 · Chặn xung đột:         01/08 → 09 (Phát hiện 2 ứng viên 82%/80%) → 10 (Chặn chọn theo BR-18.4) → 11 (Chờ xử lý, Queue giữ 144)
```

---

### Frame 01 · Tổng quan hàng đợi chưa khớp danh tính (Identity Unmatched Queue Overview)
- **Ý nghĩa của màn hình:** Là trung tâm chỉ huy (Queue Workbench) cho IT Admin quản lý toàn bộ các định danh người dùng từ nguồn dữ liệu đám mây bên ngoài (Microsoft 365) chưa thể tự động liên kết với mã nhân viên nội bộ sau phiên import `IMP-20250114-7F3A`.
- **Mục đích của màn hình:** Phân loại rõ ràng hiện trạng hàng đợi, áp dụng cảnh báo bảo vệ nhân viên theo `BR-18.1`, hiển thị ngữ cảnh phiên import và cho phép IT Admin bắt đầu xử lý các định danh chưa khớp theo thứ tự ưu tiên (phát hiện trước xử lý trước - FIFO).
- **Thao tác người dùng (IT Admin):**
  - Quan sát panel ngữ cảnh phiên import bên phải (`IMP-20250114-7F3A` · File `m365_usage_jan2025.csv` · Nguồn Microsoft 365 · 14/01/2025 10:24 ICT): Tổng định danh (1.248), Đã khớp trước phiên (1.102), Chưa khớp cần xử lý (**146**), Xung đột đang chờ (0), Đã xử lý trong phiên (0).
  - Đọc banner cảnh báo quy tắc bắt buộc: *“Dữ liệu chưa khớp KHÔNG được dùng để tạo khuyến nghị tối ưu hóa hoặc kết luận về nhân viên theo BR-18.1.”*
  - Sử dụng thanh tìm kiếm hoặc bộ lọc tab trạng thái: `Cần xử lý (146)`, `Xung đột (0)`, `Đã bỏ qua (0)`, `Đã khớp (0)`.
  - Chọn bản ghi đầu tiên trong danh sách bên trái: `UQ-0184` (Chuỗi gốc: `Nguyen.Van_A@acmecloud.onmicrosoft.com`).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Tải snapshot danh sách các `IdentityQueueRow` thuộc phiên `IMP-20250114-7F3A`.
  - Sắp xếp mặc định theo `Thời điểm phát hiện tăng dần` (FIFO) để ưu tiên giải quyết các bản ghi tồn đọng lâu nhất.
  - Áp dụng `BR-18.2`: Bảng hiển thị đồng thời cả cột chuỗi gốc và cột chuỗi đã chuẩn hóa (lowercase, loại bỏ khoảng trắng thừa).
  - Áp dụng `BR-18.1` & `INV-12`: Đánh dấu toàn bộ 146 bản ghi ở cờ `is_conclusive = false` nhằm ngăn các tiến trình phân tích tự động kéo dữ liệu vào báo cáo tối ưu.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Danh sách 146 bản ghi chưa khớp từ kết quả import `UF-06`.
  - *Đầu ra / Bước tiếp:* Chọn bản ghi `UQ-0184` → Mở giao diện thẩm định ứng viên tại **Frame 02**.

---

### Frame 02 · Xem gợi ý khớp cho UQ-0184 (View Identity Match Suggestions - Candidate Review)
- **Ý nghĩa của màn hình:** Màn hình phân tích chi tiết ứng viên nhân viên nội bộ được thuật toán gợi ý cho định danh `UQ-0184`.
- **Mục đích của màn hình:** Cung cấp đầy đủ bằng chứng đối soát (chuỗi gốc, chuỗi chuẩn hóa, họ tên, email công ty, mã nhân viên, trạng thái hoạt động, Assignment phần mềm hiện có) để IT Admin thẩm định trước khi quyết định gán quyền dữ liệu.
- **Thao tác người dùng (IT Admin):**
  - Rà soát khối định danh nguồn `UQ-0184`:
    - Chuỗi gốc: `Nguyen.Van_A@acmecloud.onmicrosoft.com`
    - Chuỗi chuẩn hóa: `nguyen.van_a@acmecloud.onmicrosoft.com`
    - Tên hiển thị từ nguồn: `Nguyen Van A`
    - Metadata: Phát hiện lúc 14/01/2025 10:25 ICT · 23 bản ghi usage · 1 Assignment liên quan.
  - So sánh 3 thẻ ứng viên (Candidate Cards) được xếp hạng theo độ tin cậy (Confidence Score):
    1. **Nguyễn Văn An** · `NV-0241` · `nguyen.van.an@company.com` — **94%** (Trùng họ tên, username gần đúng, trạng thái Active, có Assignment Microsoft 365 E3 đang hiệu lực).
    2. **Nguyễn Văn Anh** · `EMP-0398` · `nguyen.van.anh@company.com` — **63%** (Trùng họ tên gần đúng, khác hậu tố username, không có Assignment M365).
    3. **Văn An Nguyễn** · `EMP-0614` · `van.an.nguyen@company.com` — **51%** (Trùng từ tố họ tên đảo vị trí, định dạng email khác, không có Assignment M365).
  - Nhấn nút hành động chính tại thẻ Nguyễn Văn An: **“Khớp với Nguyễn Văn An (94%)”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Thuật toán fuzzy so sánh chuỗi Levenshtein kết hợp trọng số Display Name và trạng thái Assignment đang sở hữu để tính điểm confidence (94%).
  - Áp dụng nguyên tắc không tự động quyết định: Dù confidence đạt 94%, hệ thống vẫn bắt buộc phải có sự xác nhận có kiểm toán của IT Admin trước khi lưu vào bảng `IdentityMapping`.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Bản ghi `UQ-0184` và danh sách 3 ứng viên nhân sự từ cơ sở dữ liệu nội bộ.
  - *Đầu ra / Bước tiếp:* Bấm “Khớp với Nguyễn Văn An” → Mở dialog xác nhận trách nhiệm tại **Frame 03**.

---

### Frame 03 · Xác nhận khớp thủ công duy nhất (Confirm Manual Match Dialog)
- **Ý nghĩa của màn hình:** Hộp thoại kiểm soát tuân thủ trước khi thiết lập ánh xạ định danh thủ công một-một giữa tài khoản bên ngoài và nhân viên nội bộ.
- **Mục đích của màn hình:** Thực thi nghiêm ngặt `BR-18.3` và `FR-4.5`: Bắt buộc ghi nhận người xác nhận chịu trách nhiệm, đánh dấu phương pháp khớp là thủ công, và cảnh báo phạm vi dữ liệu sẽ được tái tổng hợp (23 usage records).
- **Thao tác người dùng (IT Admin):**
  - Rà soát các thông số trong hộp thoại xác nhận:
    - Định danh nguồn: `Nguyen.Van_A@acmecloud.onmicrosoft.com`
    - Nhân viên thụ hưởng: `Nguyễn Văn An` · Mã `NV-0241` · Phòng ban Kỹ thuật
    - Tác động dữ liệu: 23 bản ghi sử dụng (usage records) sẽ được gắn vào Assignment Microsoft 365 E3 của Nguyễn Văn An.
    - Phương pháp khớp ghi nhận: `Approximate Email + Display Name (Manual Match)`
    - Người xác nhận: `IT Admin · it-admin@company.com` (Trường chỉ đọc, tự động lấy từ phiên làm việc).
  - Tick chọn checkbox bắt buộc: *“Tôi xác nhận định danh này thuộc về nhân viên Nguyễn Văn An và chịu trách nhiệm về việc liên kết dữ liệu sử dụng này.”*
  - Nhấn nút hành động: **“Xác nhận khớp thủ công”** (Confirm Manual Match).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Áp dụng `BR-18.3`, `FR-4.5`: Khóa nút xác nhận cho đến khi IT Admin tick vào checkbox cam kết.
  - Ghi nhận đầy đủ metadata kiểm toán: `confirmed_by = "it-admin@company.com"`, `confirmed_at = CurrentTimestamp()`, `match_method = "Approximate Email + Display Name"`, `confidence = 94%`, `match_type = "MANUAL"`.
  - Tuyệt đối không được chuyển đổi nhãn `match_type` thành tự động (Exact match) để đảm bảo tính liêm chính của nhật ký hệ thống.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Lựa chọn ứng viên `NV-0241` cho `UQ-0184` từ Frame 02.
  - *Đầu ra / Bước tiếp:* Nhấn xác nhận → Hệ thống kích hoạt transaction tạo ánh xạ và chuyển sang màn hình tính toán nền tại **Frame 04**.

---

### Frame 04 · Đang tính lại tổng hợp dữ liệu (Re-aggregating Usage Data - Progress State)
- **Ý nghĩa của màn hình:** Màn hình hiển thị tiến trình xử lý nền (Background Processing) khi hệ thống thực hiện tái tổng hợp dữ liệu sử dụng phần mềm.
- **Mục đích của màn hình:** Thực thi quy tắc `FR-4.7` và `F-18 bước 4`: Ngăn chặn hành vi báo thành công giả tạo khi dữ liệu chưa thực sự được tổng hợp xong; khóa tương tác để tránh xung đột dữ liệu đồng thời.
- **Thao tác người dùng (IT Admin):**
  - Quan sát thanh tiến trình và thông tin 3 pha xử lý:
    - Pha 1: *Lưu ánh xạ định danh vào bảng IdentityMapping* — Hoàn thành (100%).
    - Pha 2: *Gắn 23 bản ghi usage vào Assignment theo ngày sự kiện* — Đang chạy (65%).
    - Pha 3: *Tính lại chỉ số sử dụng trung bình và cập nhật cờ active* — Đang chờ.
  - Mọi nút bấm và tương tác trên trang bị vô hiệu hóa (disabled).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Áp dụng `FR-4.7`: Dữ liệu sử dụng (usage data) phải được gắn vào thực thể `Assignment` có hiệu lực tại ngày xảy ra sự kiện, **tuyệt đối không được gắn trực tiếp vào thực thể Nhân viên (Employee)**.
  - Giữ nguyên số đếm hàng đợi: Bộ đếm trên header vẫn hiển thị **146 bản ghi chưa khớp** trong suốt quá trình worker đang chạy; chỉ giảm số đếm sau khi toàn bộ 3 pha hoàn tất.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Yêu cầu ánh xạ `UQ-0184` → `NV-0241` đã xác nhận.
  - *Đầu ra / Bước tiếp:* Worker nền hoàn tất 100% cả 3 pha → Hệ thống chuyển trạng thái hiển thị thành công tại **Frame 05**.

---

### Frame 05 · Khớp định danh thành công (Identity Matched Successfully - Ledger 145)
- **Ý nghĩa của màn hình:** Màn hình thông báo kết quả xử lý thành công dứt điểm cho bản ghi `UQ-0184`.
- **Mục đích của màn hình:** Cập nhật chính xác sổ số liệu hàng đợi (Queue Ledger), hiển thị nhật ký kiểm toán vừa sinh ra, xác nhận dữ liệu đã sẵn sàng cho các phân hệ khác và điều hướng IT Admin sang bản ghi tiếp theo.
- **Thao tác người dùng (IT Admin):**
  - Xem thông báo kết quả: *“Định danh Nguyen.Van_A@acmecloud.onmicrosoft.com đã khớp thành công với Nguyễn Văn An (NV-0241).”*
  - Kiểm tra sổ số liệu hàng đợi được cập nhật trên header:
    - Chưa khớp cần xử lý: Giảm từ 146 xuống **145 bản ghi**.
    - Đã xử lý trong phiên: Tăng từ 0 lên **1 bản ghi**.
  - Kiểm tra bảng tóm tắt kết quả: 23 bản ghi sử dụng đã được gắn hợp lệ vào Assignment Microsoft 365 E3; chỉ số hoạt động cập nhật: 18 ngày active trong tháng 01/2025.
  - Xem dòng Audit Trail mới: `14/01/2025 10:31 ICT · IT Admin (it-admin@company.com) · MATCH_IDENTITY_MANUAL · UQ-0184 -> NV-0241 · Method: Approximate Email + Display Name · Confidence: 94%`.
  - Nhấn nút hành động: **“Xử lý bản ghi tiếp theo”** (Next Record).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Chuyển trạng thái bản ghi `UQ-0184` thành `Matched`.
  - Cập nhật số liệu ledger: `unmatched_count = 145`, `processed_count = 1`.
  - Dữ liệu sử dụng của Nguyễn Văn An đã sẵn sàng để chuyển giao làm cơ sở phân tích cho engine tối ưu license tại `UF-10`.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Kết quả tổng hợp thành công từ Frame 04.
  - *Đầu ra / Bước tiếp:* Nhấn “Xử lý bản ghi tiếp theo” → Nạp bản ghi kế tiếp `UQ-0185`, chuyển sang **Frame 06**.

---

### Frame 06 · Không tìm thấy ứng viên cho UQ-0185 (No Candidate Found - UQ-0185)
- **Ý nghĩa của màn hình:** Màn hình chi tiết của bản ghi `UQ-0185` (`svc-marketing-automation@acmecloud.onmicrosoft.com`) — một tài khoản dịch vụ tự động không có ứng viên nhân sự tương ứng.
- **Mục đích của màn hình:** Xử lý tình huống định danh bên ngoài là tài khoản tích hợp hệ thống (bot/service account) hoặc nhân sự thuê ngoài không nằm trong danh sách nhân viên công ty, ngăn ngừa việc ép gán nhầm vào nhân viên thật.
- **Thao tác người dùng (IT Admin):**
  - Rà soát thông tin bản ghi `UQ-0185`:
    - Chuỗi gốc: `svc-marketing-automation@acmecloud.onmicrosoft.com`
    - Chuỗi chuẩn hóa: `svc-marketing-automation@acmecloud.onmicrosoft.com`
    - Display Name: `Marketing Automation Service`
    - Metadata: Phát hiện lúc 14/01/2025 10:25 ICT · 31 bản ghi usage · 0 Assignment.
  - Quan sát trạng thái tìm kiếm: *“Không tìm thấy ứng viên nhân viên nào phù hợp (0 candidates found)”*.
  - Có thể sử dụng ô tìm kiếm nội bộ để tra cứu thủ công theo từ khóa; kết quả vẫn trả về 0 ứng viên.
  - Nhấn nút hành động phụ: **“Bỏ qua định danh này”** (Dismiss / Ignore Identity).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Thuật toán so khớp không tìm thấy nhân viên nào đạt điểm confidence cơ sở.
  - Hệ thống không hiển thị nút gán; chỉ cho phép tra cứu lại hoặc kích hoạt nhánh bỏ qua có kiểm soát.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Bản ghi `UQ-0185` từ hàng đợi (Queue: 145).
  - *Đầu ra / Bước tiếp:* Nhấn “Bỏ qua định danh này” → Mở hộp thoại nhập lý do bắt buộc tại **Frame 07**.

---

### Frame 07 · Xác nhận bỏ qua định danh (Confirm Dismiss Identity Dialog)
- **Ý nghĩa của màn hình:** Hộp thoại thu thập giải trình bắt buộc trước khi đóng một bản ghi chưa khớp ra khỏi hàng đợi xử lý.
- **Mục đích của màn hình:** Đảm bảo trách nhiệm giải trình và tính minh bạch trong kiểm toán: Ngăn chặn IT Admin tự ý bỏ qua các tài khoản nghi vấn mà không nêu rõ nguyên nhân nghiệp vụ.
- **Thao tác người dùng (IT Admin):**
  - Đọc cảnh báo nghiệp vụ: *“Định danh bị bỏ qua sẽ không tạo ánh xạ tới bất kỳ nhân viên nào. Dữ liệu sử dụng liên quan (31 bản ghi) sẽ không được dùng để tính toán năng suất hoặc đưa ra kết luận nhân sự theo BR-18.1.”*
  - Nhập lý do bắt buộc vào trường văn bản: *“Tài khoản dịch vụ của nhà cung cấp, không thuộc nhân viên (External vendor service account, not assigned to employee)”*.
  - Nhấn nút: **“Xác nhận bỏ qua”** (Confirm Dismiss).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Áp dụng kiểm tra hợp lệ dữ liệu (Validation): Trường lý do (`dismiss_reason`) là bắt buộc, phải đạt tối thiểu **10 ký tự**. Nút xác nhận bị khóa hoàn toàn khi chưa thỏa mãn điều kiện độ dài.
  - Áp dụng `BR-18.1`: Xác lập cơ chế cách ly vĩnh viễn dữ liệu của `UQ-0185` khỏi các phân hệ báo cáo nhân sự.
  - Giữ nguyên vẹn chuỗi gốc và dữ liệu thô trong cơ sở dữ liệu để phục vụ kiểm toán hoặc tra cứu sau này.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Bản ghi `UQ-0185` và nội dung giải trình của IT Admin.
  - *Đầu ra / Bước tiếp:* Bấm xác nhận → Lưu trạng thái bỏ qua, chuyển sang **Frame 08**.

---

### Frame 08 · Định danh đã được bỏ qua (Identity Dismissed - Ledger 144)
- **Ý nghĩa của màn hình:** Màn hình xác nhận hoàn tất thao tác bỏ qua bản ghi `UQ-0185`.
- **Mục đích của màn hình:** Cập nhật sổ số liệu hàng đợi, lưu nhật ký kiểm toán, xác nhận không tạo `IdentityMapping` tới bất kỳ nhân viên nào và điều hướng xử lý tiếp.
- **Thao tác người dùng (IT Admin):**
  - Quan sát huy hiệu trạng thái: `Đã bỏ qua (Dismissed)`.
  - Xem thông tin ghi nhận:
    - Lý do bỏ qua: *“Tài khoản dịch vụ của nhà cung cấp, không thuộc nhân viên”*.
    - Người xử lý: `IT Admin · it-admin@company.com`.
    - Thời điểm: `14/01/2025 · 10:32 ICT`.
    - Xác nhận kiểm toán: *“Không tạo IdentityMapping. 31 bản ghi usage được cách ly khỏi phân tích nhân viên.”*
  - Kiểm tra sổ số liệu hàng đợi trên header:
    - Chưa khớp cần xử lý: Giảm từ 145 xuống **144 bản ghi**.
    - Đã xử lý trong phiên: Tăng từ 1 lên **2 bản ghi**.
  - Nhấn nút: **“Xử lý bản ghi tiếp theo”** (Next Record).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Cập nhật trạng thái bản ghi `UQ-0185` thành `Dismissed`.
  - Ghi Audit Log: `14/01/2025 10:32 ICT · IT Admin · DISMISS_IDENTITY · UQ-0185 · Reason: External vendor service account...`.
  - Cập nhật bộ đếm hàng đợi: `unmatched_count = 144`, `processed_count = 2`.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Quyết định bỏ qua hợp lệ từ Frame 07.
  - *Đầu ra / Bước tiếp:* Nhấn “Xử lý bản ghi tiếp theo” → Nạp bản ghi kế tiếp `UQ-0186`, chuyển sang **Frame 09**.

---

### Frame 09 · Phát hiện xung đột danh tính cho UQ-0186 (Identity Conflict Detected - UQ-0186)
- **Ý nghĩa của màn hình:** Màn hình chi tiết của bản ghi `UQ-0186` (`n.tran@acmecloud.onmicrosoft.com`) rơi vào tình trạng mơ hồ danh tính: Có 2 nhân viên nội bộ cùng đạt độ tương đồng cao.
- **Mục đích của màn hình:** Nhận diện tình huống rủi ro sai lệch dữ liệu cá nhân, cảnh báo trực quan cho IT Admin về sự hiện diện của hai ứng viên cạnh tranh trước khi kích hoạt rào chắn nghiệp vụ.
- **Thao tác người dùng (IT Admin):**
  - Rà soát thông tin bản ghi `UQ-0186`:
    - Chuỗi gốc: `n.tran@acmecloud.onmicrosoft.com`
    - Chuỗi chuẩn hóa: `n.tran@acmecloud.onmicrosoft.com`
    - Display Name: `N Tran`
    - Metadata: Phát hiện lúc 14/01/2025 10:25 ICT · 18 bản ghi usage · 2 Assignment liên quan.
  - Quan sát cảnh báo màu cam nổi bật: *“Cảnh báo xung đột: Định danh này khớp đồng thời với 2 nhân viên nội bộ với độ tin cậy gần bằng nhau.”*
  - So sánh 2 thẻ ứng viên xung đột:
    1. **Nguyễn Minh Trần** · `EMP-0312` · `nguyen.minh.tran@company.com` — **82%** (Username viết tắt gần đúng, họ Trần, chữ cái đầu N, có Microsoft 365 E3 Active).
    2. **Nguyễn Mai Trần** · `EMP-0448` · `nguyen.mai.tran@company.com` — **80%** (Username viết tắt gần đúng, họ Trần, chữ cái đầu N, có Microsoft 365 E3 Active).
  - Nhận thấy cả hai ứng viên đều khả thi và có mức chênh lệch confidence chỉ 2%.
  - Nhấn nút kiểm tra: **“Đánh giá xung đột danh tính”** (Evaluate Conflict).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Thuật toán so khớp phát hiện trường hợp đa ứng viên có điểm số xấp xỉ nhau (|82% - 80%| = 2% < ngưỡng an toàn).
  - Kích hoạt điều kiện kiểm tra của quy tắc bảo vệ danh tính `BR-18.4`.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Bản ghi `UQ-0186` (Queue count: 144).
  - *Đầu ra / Bước tiếp:* Bấm “Đánh giá xung đột danh tính” → Hệ thống kích hoạt rào chắn khóa cứng tại **Frame 10**.

---

### Frame 10 · Chặn lựa chọn mơ hồ theo BR-18.4 (Ambiguous Selection Blocked per BR-18.4)
- **Ý nghĩa của màn hình:** Màn hình rào chắn an toàn (Safety Guardrail Screen) thực thi ngăn chặn cưỡng chế khi phát hiện xung đột danh tính.
- **Mục đích của màn hình:** Thực thi tuyệt đối quy tắc cốt lõi **`BR-18.4`** và **`FR-7.7`**: Nghiêm cấm mọi hành vi đoán mò hoặc tự ý chọn bừa một trong hai nhân viên khi hệ thống chưa đủ căn cứ xác minh, ngăn chặn nguy cơ xâm phạm dữ liệu cá nhân và làm sai lệch hồ sơ nhân sự.
- **Thao tác người dùng (IT Admin):**
  - Quan sát trạng thái bị khóa chặt (Blocked State) với banner cảnh báo màu đỏ/cam viền đậm:
    - Tiêu đề quy tắc: *“RÀO CHẮN NGHIỆP VỤ BR-18.4 ĐÃ ĐƯỢC KÍCH HOẠT: Không cho phép chọn thủ công khi có xung đột danh tính đa ứng viên.”*
    - Giải thích nguyên nhân: *“Định danh n.tran@acmecloud.onmicrosoft.com có thể thuộc về Nguyễn Minh Trần (82%) hoặc Nguyễn Mai Trần (80%). Hệ thống không có căn cứ kỹ thuật để ưu tiên một trong hai. Việc gán tùy tiện bị cấm để bảo vệ tính toàn vẹn dữ liệu.”*
    - Các nút “Chọn ứng viên này” trên cả hai thẻ candidate bị **vô hiệu hóa hoàn toàn (disabled)** và làm mờ.
  - Thao tác khả thi duy nhất: Nhấn nút **“Chuyển sang chờ xử lý xung đột”** (Escalate to Pending Conflict).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Áp dụng `BR-18.4`, `FR-7.7`: Chặn ở cả tầng giao diện lẫn tầng API. Mọi request tạo `IdentityMapping` cho `UQ-0186` đều bị từ chối với mã lỗi `409 Conflict`.
  - Không cho phép bất kỳ ai (kể cả Super Admin) chọn bừa người thắng trên giao diện này; chỉ cho phép chuyển trạng thái cách ly chờ tài liệu đối soát chính thức từ HR.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Trạng thái xung đột đa ứng viên của `UQ-0186`.
  - *Đầu ra / Bước tiếp:* Nhấn “Chuyển sang chờ xử lý xung đột” → Bản ghi được chuyển sang danh sách cách ly tại **Frame 11**.

---

### Frame 11 · Đang chờ xử lý xung đột danh tính (Awaiting Conflict Resolution - End State)
- **Ý nghĩa của màn hình:** Màn hình trạng thái kết thúc nhánh xung đột, cách ly bản ghi `UQ-0186` vào danh sách chờ xử lý đặc biệt.
- **Mục đích của màn hình:** Đảm bảo nguyên tắc bảo toàn số liệu: Bản ghi xung đột chưa được giải quyết dứt điểm nên **KHÔNG ĐƯỢC PHÉP GIẢM HÀNG ĐỢI**, hiển thị badge cảnh báo riêng, ghi nhận audit trail và cho phép IT Admin quay về hàng đợi tổng quan.
- **Thao tác người dùng (IT Admin):**
  - Quan sát thẻ trạng thái của `UQ-0186`: Mang badge màu cam tím `Xung đột danh tính · Chờ xử lý` (Identity Conflict · Pending Resolution).
  - Rà soát bảng thông tin kiểm soát:
    - Trạng thái: *Đã phong tỏa định danh n.tran@acmecloud.onmicrosoft.com*.
    - Hai ứng viên giữ nguyên vẹn: Nguyễn Minh Trần (82%) và Nguyễn Mai Trần (80%).
    - Người chịu trách nhiệm: *Chưa phân công (Cần đối soát danh tính từ bộ phận Nhân sự)*.
    - Thời điểm phong tỏa: `14/01/2025 · 10:34 ICT`.
  - Kiểm tra sổ số liệu hàng đợi trên header:
    - Chưa khớp cần xử lý: **Vẫn giữ nguyên 144 bản ghi** (Tuyệt đối không trừ vì bản ghi chưa được gán thành công hay bỏ qua).
    - Xung đột đang chờ: Tăng từ 0 lên **1 bản ghi** (Badge lát cắt theo dõi).
    - Đã xử lý trong phiên: Vẫn giữ **2 bản ghi** (Chỉ gồm UQ-0184 đã khớp và UQ-0185 đã bỏ qua).
  - Xem dòng Audit Trail mới: `14/01/2025 10:34 ICT · System/IT Admin · ESCALATE_CONFLICT · UQ-0186 · Status: PENDING_RESOLUTION · Blocked per BR-18.4`.
  - Nhấn nút: **“Quay về hàng đợi chưa khớp”** (Return to Queue Workbench).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Áp dụng `BR-18.1`: Bản ghi `UQ-0186` bị loại hoàn toàn khỏi các phân tích sử dụng và tối ưu hóa license tại `UF-10`.
  - Sổ số liệu bất biến: Bản ghi xung đột vẫn nằm trong tổng 144 bản ghi chưa giải quyết; badge `Xung đột đang chờ: 1` là một góc nhìn lọc (filter slice), không làm thay đổi tổng số cần xử lý.
  - Lưu trữ nguyên trạng hai ứng viên để khi HR cung cấp quyết định chính thức, IT Admin có thể mở lại để hoàn tất.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Quyết định phong tỏa xung đột từ Frame 10.
  - *Đầu ra / Bước tiếp:* Nhấn “Quay về hàng đợi” → Quay về **Frame 01** với bộ đếm mới (144 cần xử lý, 1 xung đột chờ, 2 đã xử lý); hoàn tất trọn vẹn chu trình minh họa 3 nhánh của `UF-07`.

---

# PHẦN 3. ĐẶC TẢ CHI TIẾT UF-08 · IT ADMIN XỬ LÝ HÀNG ĐỢI CẤP PHÁT VÀ THU HỒI

> **Mục tiêu luồng UF-08:** Quản lý vòng đời thực thi thao tác tạo/xóa tài khoản thật phía nhà cung cấp SaaS thông qua hai kênh: Tự động (Connector API) và Thủ công (Manual ticket). Tách bạch rõ giữa quyết định cấp quyền nội bộ (`Assignment`) và kết quả thao tác thực tế tại nhà cung cấp (`ProvisioningTask`).  
> **Nguyên tắc bất biến:** `Assignment` vẫn giữ chỗ (allocated) trong suốt quá trình thực thi, thất bại hoặc chờ đối soát; chỉ khi có bằng chứng tài khoản đã active hoặc đã xóa thì trạng thái cuối mới được ghi nhận.

```text
Topology UF-08:
Tự động:        01 → 02 → 03 → 04 → 05 (Bàn giao UF-14)
Thủ công:       01 → 06 → 07 → 08 → 09 (Hoàn tất)
Lỗi retry:      10 → 11 → 12 → 13 (Chuyển thủ công)
Lỗi xác thực:   10 → 14 (Sửa kết nối / Làm tay / Đóng)
Hết hạn mức:    10 → 15 (Chờ duyệt UF-15) → 16 (Đã mua thêm, quay lại tự động)
```

---

### Frame 01 · Tổng quan hàng đợi thực thi (Provisioning Workbench Overview)
- **Ý nghĩa của màn hình:** Là trung tâm chỉ huy (workbench) cho IT Admin quản lý toàn bộ các tác vụ cấp quyền và thu hồi tài khoản phần mềm đang tồn đọng trong doanh nghiệp.
- **Mục đích của màn hình:** Phân loại rõ ràng khối lượng công việc theo kênh xử lý (`Cần làm tay`, `Đang chạy tự động`, `Chờ chấp nhận`, `Thất bại`) để IT Admin nắm bắt ưu tiên xử lý, không bị sót việc, đồng thời thấy rõ cảnh báo các task bị nghẽn.
- **Thao tác người dùng (IT Admin):**
  - Quan sát 4 thẻ số liệu tổng quan (metric cards): Cần làm tay (8), Tự động (4), Chờ chấp nhận (2), Thất bại (3), và số Hoàn tất hôm nay (12).
  - Lọc danh sách theo loại thao tác (`Cấp quyền` / `Thu hồi`), theo ứng dụng hoặc theo kênh.
  - Chọn một tác vụ cụ thể trong danh sách bên trái để mở chi tiết (ví dụ chọn `PV-2041`, `PV-2042` hoặc mở tab Thất bại).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Hệ thống tải snapshot dữ liệu thời gian thực của các `ProvisioningTask`.
  - Hiển thị banner cảnh báo nghiệp vụ: *“Assignment vẫn chiếm chỗ cho tới khi tác vụ có bằng chứng hoàn tất hoặc đóng hợp lệ theo BR-10.4”*.
  - Nhóm các tác vụ theo ledger chuẩn loại trừ lẫn nhau, không tính trùng task `Chờ chấp nhận` vào `Tự động`.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Danh sách `ProvisioningTask` từ các luồng yêu cầu (`UF-01`), offboarding (`UF-09`), tối ưu (`UF-10`), đối soát (`UF-14`).
  - *Đầu ra / Bước tiếp:* Chọn task tự động `PV-2041` → chuyển sang **Frame 02**; chọn task thủ công `PV-2042` → **Frame 06**; chọn tab Thất bại → **Frame 10**.

---

### Frame 02 · Chi tiết tác vụ tự động (Automated Task Detail - PV-2041)
- **Ý nghĩa của màn hình:** Màn hình kiểm tra điều kiện tiên quyết trước khi phát lệnh gọi API connector tạo tài khoản cho nhân viên.
- **Mục đích của màn hình:** Cho phép IT Admin rà soát tính hợp lệ của phê duyệt, người thụ hưởng, quyền hạn và trạng thái sẵn sàng của connector trước khi kích hoạt worker nền.
- **Thao tác người dùng (IT Admin):**
  - Xem chi tiết tác vụ `PV-2041` (Cấp quyền GitHub Business cho Nguyễn Minh An · `NV-0248`).
  - Đối chiếu mã yêu cầu căn cứ `REQ-2026-0917-084` và mã giữ chỗ `ASN-4901`.
  - Nhấn nút hành động chính: **“Thực thi ngay”** (Execute Now).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Kiểm tra trạng thái connector GitHub: kết nối active, token hợp lệ, quota API còn đủ.
  - Tạo `Idempotency Key` (`COR-7A91-2041`) để chống phát sinh lệnh gọi trùng lặp (duplicate call).
  - Khóa quyền chỉnh sửa cấu hình task khi chuẩn bị kích hoạt worker.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Thông tin task `PV-2041`, Request đã được phê duyệt, Subscription `SUB-GH-BIZ-01`.
  - *Đầu ra / Bước tiếp:* Nhấn “Thực thi ngay” → Task chuyển sang trạng thái đang chạy, giao diện chuyển sang **Frame 03**.

---

### Frame 03 · Connector đang thực thi (Connector Executing Attempt)
- **Ý nghĩa của màn hình:** Màn hình trạng thái động thể hiện worker của hệ thống đang thực hiện lệnh gọi API sang nhà cung cấp bên thứ ba.
- **Mục đích của màn hình:** Cung cấp tính minh bạch (observability) về tiến trình kỹ thuật (attempt, endpoint, thời gian gọi), đồng thời khóa tương tác để ngăn chặn xung đột dữ liệu giữa chừng.
- **Thao tác người dùng (IT Admin):**
  - Quan sát tiến trình thực thi trực tiếp trên giao diện: hiển thị Attempt 1/6, endpoint `api.github.com/orgs/company/invitations`, payload mã hóa danh tính.
  - Các nút hành động thay đổi trạng thái bị vô hiệu hóa hoàn toàn (disabled).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Worker hệ thống gửi HTTP POST request kèm API token và Idempotency Key tới GitHub.
  - Ghi nhận Audit Trail: thời điểm bắt đầu gọi, correlation ID, người phát lệnh (`it-admin@company.com`).
  - Lắng nghe phản hồi HTTP từ GitHub.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Tác vụ `PV-2041` đang thực thi Attempt 1/6.
  - *Đầu ra / Bước tiếp:* 
    - Nhận phản hồi thành công (HTTP 201 Created kèm `invitation_id`) nhưng membership ở trạng thái chờ → chuyển sang **Frame 04**.
    - Nếu API trả lỗi kết nối/timeout → chuyển sang nhánh Retry (**Frame 11**).

---

### Frame 04 · Lời mời đã gửi — chờ chấp nhận (Invitation Sent - Pending Acceptance)
- **Ý nghĩa của màn hình:** Màn hình hiển thị kết quả thành công bước đầu của connector API: nhà cung cấp đã ghi nhận và gửi email lời mời (invitation) tới người dùng.
- **Mục đích của màn hình:** Thể hiện ranh giới nghiệp vụ cốt lõi theo QĐ-03: *“API response thành công không đồng nghĩa với việc tài khoản đã active”*. Ngăn chặn việc đánh dấu hoàn tất sớm khi nhân viên chưa bấm chấp nhận lời mời.
- **Thao tác người dùng (IT Admin):**
  - Xem thông báo kết quả: Đã gửi lời mời tham gia GitHub Organization tới `nguyen.minh.an@company.com`.
  - Ghi nhận trạng thái: Membership hiện tại là `pending`.
  - Kiểm tra số liệu hàng đợi: Số liệu tự động giảm từ 4 xuống 3, số `Chờ chấp nhận` tăng từ 2 lên 3.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Phân tích payload phản hồi từ GitHub: `status: 201`, `state: pending`.
  - Hệ thống **không** chuyển task sang “Hoàn tất”, mà chuyển sang trạng thái `Chờ chấp nhận` (Pending Acceptance).
  - License/Seat `ASN-4901` tiếp tục ở trạng thái chiếm chỗ (`Allocated/Pending`).
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Phản hồi API từ GitHub với mã lời mời `INV-GH-9981`.
  - *Đầu ra / Bước tiếp:* IT Admin bấm nút **“Chuyển sang theo dõi đối soát”** → Chuyển sang **Frame 05**.

---

### Frame 05 · Bàn giao đối soát (Reconciliation Handoff to UF-14)
- **Ý nghĩa của màn hình:** Màn hình kết thúc có kiểm soát của luồng cấp phát tự động trong UF-08, thực hiện bàn giao trách nhiệm xác minh cho phân hệ đối soát UF-14.
- **Mục đích của màn hình:** Hướng dẫn IT Admin và luồng hệ thống chuyển sang `UF-14` để đợi sự kiện đối soát định kỳ xác nhận thành viên chính thức kích hoạt tài khoản.
- **Thao tác người dùng (IT Admin):**
  - Xem tóm tắt bàn giao: Tác vụ `PV-2041` đã chuyển giao sang danh sách theo dõi của phân hệ Đối soát dữ liệu.
  - Bấm nút liên kết: **“Mở phân hệ đối soát (UF-14)”** hoặc quay về Hàng đợi thực thi.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Gắn nhãn `Awaiting Reconciliation` cho `PV-2041`.
  - Đăng ký đối tượng cần đối soát vào bảng công việc của `UF-14` (so khớp ID GitHub `nguyen-an-dev` với email nhân viên).
  - Giữ nguyên Audit Log xác nhận phân định ranh giới giữa UF-08 và UF-14.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Task `PV-2041` ở trạng thái Chờ chấp nhận.
  - *Đầu ra / Bước tiếp:* Handoff sang **UF-14 Frame 02** để đối soát tài khoản thực tế; kết thúc nhánh cấp phát tự động tại UF-08.

---

### Frame 06 · Chi tiết tác vụ thủ công (Manual Task Detail - PV-2042)
- **Ý nghĩa của màn hình:** Màn hình chi tiết của một tác vụ cần người thật xử lý bên ngoài hệ thống (dành cho ứng dụng không có API connector hoặc tác vụ thu hồi nhạy cảm).
- **Mục đích của màn hình:** Cung cấp đầy đủ hướng dẫn, đường dẫn quản trị và căn cứ nghiệp vụ (quyết định nghỉ việc) để IT Admin chuẩn bị thao tác thủ công trên console nhà cung cấp.
- **Thao tác người dùng (IT Admin):**
  - Xem chi tiết tác vụ `PV-2042`: Thu hồi seat Figma Professional của Trần Minh · `NV-0174`.
  - Đọc căn cứ pháp lý/quyết định: Kế hoạch nghỉ việc `OFF-2026-044`, đã có phê duyệt bàn giao của Quản lý.
  - Nhấn nút hành động: **“Tôi đang xử lý”** (I am handling this).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Hiển thị trạng thái ban đầu của task là `Chưa phân công` (Unassigned).
  - Khóa không cho phép người dùng bấm xác nhận hoàn tất khi chưa nhận xử lý.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Tác vụ thu hồi thủ công `PV-2042` sinh ra từ `UF-09`.
  - *Đầu ra / Bước tiếp:* Nhấn “Tôi đang xử lý” → Hệ thống gán quyền sở hữu task cho IT Admin hiện tại, chuyển sang **Frame 07**.

---

### Frame 07 · IT Admin đã nhận xử lý (IT Admin Assigned & In-Progress)
- **Ý nghĩa của màn hình:** Màn hình ghi nhận trách nhiệm cá nhân (ownership) của IT Admin đối với việc xử lý tác vụ thủ công.
- **Mục đích của màn hình:** Ngăn chặn việc hai IT Admin cùng can thiệp vào một tài khoản nhà cung cấp gây xung đột, đồng thời cung cấp checklist thao tác từng bước bên ngoài.
- **Thao tác người dùng (IT Admin):**
  - Xem thông tin người xử lý đã được gán: `IT Admin (it-admin@company.com)`.
  - Bấm vào liên kết ngoài (External Link) để mở trang quản trị Figma Workspace: `admin.figma.com/org/members`.
  - Làm theo checklist hướng dẫn: Tìm thành viên Trần Minh → Chọn Remove seat / Downgrade Viewer-Restricted.
  - Sau khi thao tác xong trên Figma, quay lại hệ thống bấm: **“Xác nhận hoàn tất & Tải bằng chứng”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Cập nhật trường `assigned_to = current_user_id`, thời điểm nhận việc `17/09/2026 10:21 ICT`.
  - Đưa tác vụ vào trạng thái `Đang xử lý` (In Progress).
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Xác nhận nhận việc từ Frame 06.
  - *Đầu ra / Bước tiếp:* Nhấn nút xác nhận hoàn tất → Mở modal nhập bằng chứng tại **Frame 08**.

---

### Frame 08 · Xác nhận hoàn tất thủ công (Manual Completion Evidence Dialog)
- **Ý nghĩa của màn hình:** Modal hộp thoại bắt buộc thu thập bằng chứng kiểm toán trước khi đóng một tác vụ xử lý bằng tay.
- **Mục đích của màn hình:** Thực thi nghiêm ngặt quy tắc BR-10.1: *Không bao giờ cho phép đóng tác vụ thủ công bằng một cú click đơn giản mà không có bằng chứng chứng minh tài khoản đã được thu hồi thật*.
- **Thao tác người dùng (IT Admin):**
  - Chọn loại bằng chứng (Evidence Type): `Mã sự kiện nhà cung cấp (Audit Event ID)` hoặc `Ảnh chụp màn hình (Screenshot)`.
  - Nhập mã tham chiếu bắt buộc: ví dụ `FIG-EVT-772904`.
  - Nhập ghi chú giải trình: ví dụ *“Đã thu hồi seat Editor, chuyển tài khoản về Viewer-Restricted trên Figma Admin Console”*.
  - Người xác nhận hiển thị dạng chỉ đọc (Read-only): `it-admin@company.com`.
  - Nhấn nút: **“Xác nhận & Đóng tác vụ”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Kiểm tra tính đầy đủ (validation): Nút xác nhận bị khóa (disabled) nếu mã tham chiếu để trống hoặc ghi chú dưới 10 ký tự.
  - Ghi nhận bằng chứng vào kho lưu trữ bất biến (Audit Evidence Store).
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Thông tin bằng chứng nhập từ bàn phím và form upload.
  - *Đầu ra / Bước tiếp:* Bấm xác nhận hợp lệ → Hệ thống xử lý cập nhật trạng thái, chuyển sang **Frame 09**.

---

### Frame 09 · Thu hồi thủ công hoàn tất (Manual Revocation Completed)
- **Ý nghĩa của màn hình:** Màn hình xác nhận kết quả cuối cùng: Tác vụ thủ công đã hoàn tất trọn vẹn và seat bản quyền chính thức được giải phóng.
- **Mục đích của màn hình:** Thông báo cho IT Admin biết việc thu hồi thành công, cập nhật lại toàn bộ sổ số liệu (ledger) hàng đợi và thông báo giải phóng seat cho các phân hệ gọi tới.
- **Thao tác người dùng (IT Admin):**
  - Quan sát badge trạng thái chuyển sang xanh lá: `Hoàn tất` (Completed).
  - Kiểm tra số liệu cập nhật: Số `Cần làm tay` giảm từ 8 xuống 7, số `Hoàn tất hôm nay` tăng từ 12 lên 13.
  - Bấm nút quay lại Hàng đợi hoặc mở xem Audit Log chi tiết.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Đổi trạng thái task `PV-2042` sang `COMPLETED`.
  - Đổi trạng thái `Assignment` `ASN-3872` sang `REVOKED` (chính thức nhả 1 seat Figma về kho trống).
  - Kích hoạt sự kiện hoàn tất báo về quy trình cha `UF-09` (Offboarding Trần Minh).
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Bằng chứng hợp lệ từ Frame 08.
  - *Đầu ra / Bước tiếp:* Hoàn tất nhánh thủ công; kết quả trả về cho **UF-09 Frame 14**.

---

### Frame 10 · Hàng đợi thất bại (Failed Tasks Queue)
- **Ý nghĩa của màn hình:** Màn hình phân loại và gom nhóm tất cả các tác vụ gặp lỗi kỹ thuật trong quá trình thực thi tự động.
- **Mục đích của màn hình:** Giúp IT Admin nhìn thấy bức tranh tổng thể các lỗi, phân biệt rõ giữa lỗi có thể thử lại (transient error), lỗi vĩnh viễn/xác thực (permanent/auth error) và lỗi do cạn kiệt hạn mức license.
- **Thao tác người dùng (IT Admin):**
  - Mở tab **“Thất bại (3)”** trên workbench.
  - Xem danh sách 3 task lỗi điển hình:
    1. `PV-2037`: Lỗi kết nối mạng tạm thời (Timeout/503 Service Unavailable).
    2. `PV-2038`: Lỗi xác thực tài khoản kết nối (Token Expired / 401 Unauthorized).
    3. `PV-2039`: Lỗi nhà cung cấp báo hết hạn mức (License Seat Limit Exceeded / 422).
  - Bấm chọn từng task để xem chi tiết cách khắc phục.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Phân loại mã lỗi trả về từ API thành các nhóm hành động nghiệp vụ tiếng Việt dễ hiểu.
  - Ẩn stacktrace kỹ thuật vào ngăn kéo phụ (drawer), ưu tiên hiển thị giải pháp đề xuất.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Các task bị trả lỗi từ connector worker.
  - *Đầu ra / Bước tiếp:* Chọn `PV-2037` → sang **Frame 11**; chọn `PV-2038` → sang **Frame 14**; chọn `PV-2039` → sang **Frame 15**.

---

### Frame 11 · Lỗi tạm thời đang retry (Transient Error Retrying)
- **Ý nghĩa của màn hình:** Màn hình theo dõi cơ chế tự động thử lại (retry backoff) của hệ thống đối với các lỗi tạm thời của mạng hoặc dịch vụ đám mây.
- **Mục đích của màn hình:** Cho IT Admin biết hệ thống đang chủ động khắc phục theo thuật toán lũy thừa (exponential backoff), không cần con người can thiệp vội vàng.
- **Thao tác người dùng (IT Admin):**
  - Quan sát trạng thái task `PV-2037`: Đang ở lần thử 3/6.
  - Xem mốc thời gian lần thử tiếp theo: Dự kiến lúc `10:36 ICT`.
  - Xem lịch sử các lần thử trước (Attempt 1 và 2 đều nhận mã 503).
  - Có thể chọn can thiệp dừng sớm nếu cần.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Áp dụng BR-12.1: Tối đa 6 lần thử lại với khoảng cách thời gian tăng dần (ví dụ: 1m, 2m, 4m, 8m, 16m, 32m).
  - Điều chỉnh tạm thời ledger: Giảm `Failed` từ 3 xuống 2, tăng `Tự động` từ 3 lên 4 trong thời gian worker tái kích hoạt.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Task `PV-2037` gặp lỗi 503 tạm thời.
  - *Đầu ra / Bước tiếp:* 
    - Nếu lần thử kế tiếp thành công → chuyển sang **Frame 04**.
    - Nếu cả 6 lần đều thất bại → chuyển sang **Frame 12**.

---

### Frame 12 · Đã hết sáu lần retry (Max Retries Reached - Manual Intervention)
- **Ý nghĩa của màn hình:** Màn hình báo động khi cơ chế tự động đã cạn kiệt số lần thử mà dịch vụ vẫn không thể hoàn thành.
- **Mục đích của màn hình:** Chấm dứt vòng lặp tự động vô hạn, chuyển quyền quyết định và xử lý sang con người theo quy tắc BR-12.2.
- **Thao tác người dùng (IT Admin):**
  - Đọc thông báo: *“Đã hết 6/6 lần thử lại tự động. Connector không thể kết nối tới dịch vụ nhà cung cấp.”*
  - Xem lịch sử phản hồi kỹ thuật của 6 lần gọi API.
  - Bấm nút hành động: **“Chuyển sang xử lý thủ công”** (Switch to Manual) hoặc **“Đóng tác vụ kèm lý do”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Xóa bỏ lịch hẹn chạy lại (`nextAttemptAt = null`).
  - Đưa task trở lại danh sách `Thất bại` và đánh dấu cờ `Cần người xử lý` (Human Intervention Required).
  - Bảo toàn toàn bộ lịch sử 6 lần attempt trong Audit Log để phục vụ đối soát kỹ thuật.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Kết quả thất bại của Attempt 6/6 từ worker.
  - *Đầu ra / Bước tiếp:* IT Admin bấm chọn “Chuyển sang xử lý thủ công” → Mở dialog xác nhận tại **Frame 13**.

---

### Frame 13 · Chuyển sang làm thủ công (Switch Channel to Manual Dialog)
- **Ý nghĩa của màn hình:** Modal hộp thoại xác nhận việc thay đổi kênh thực thi từ Tự động sang Thủ công ngay trên cùng một mã tác vụ.
- **Mục đích của màn hình:** Bảo đảm tính liên tục của dữ liệu nghiệp vụ: Chuyển kênh xử lý mà không làm mất liên kết với Request gốc, giữ nguyên mã `PV-2037` và không tạo ra task rác.
- **Thao tác người dùng (IT Admin):**
  - Xem thông tin xác nhận: Chuyển task `PV-2037` sang hàng đợi Cần làm tay.
  - Nhập lý do chuyển kênh: ví dụ *“Hệ thống GitHub API đang bảo trì, chuyển cấp thủ công qua giao diện web để kịp tiến độ nhân viên on-board”*.
  - Nhấn nút: **“Xác nhận chuyển kênh”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Cập nhật thuộc tính `channel = MANUAL`, lưu trữ toàn bộ lịch sử connector trước đó.
  - Cập nhật sổ ledger: Số `Thất bại` giảm từ 3 về 2, số `Cần làm tay` tăng từ 7 lên 8.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Yêu cầu chuyển kênh của `PV-2037`.
  - *Đầu ra / Bước tiếp:* Chuyển sang nhánh thủ công tại **Frame 06/07** để IT Admin tiến hành cấp bằng tay.

---

### Frame 14 · Lỗi xác thực — không retry (Authentication Error - No Retry)
- **Ý nghĩa của màn hình:** Màn hình cảnh báo đặc biệt dành cho các lỗi vĩnh viễn (Permanent Errors) như hết hạn OAuth Token, sai API Key, hoặc không đủ quyền quản trị viên.
- **Mục đích của màn hình:** Ngăn chặn tuyệt đối việc tự động retry vô nghĩa gây lãng phí tài nguyên và nguy cơ bị khóa tài khoản API; điều hướng IT Admin khắc phục cấu hình gốc.
- **Thao tác người dùng (IT Admin):**
  - Xem chi tiết lỗi của `PV-2038`: *“Lỗi 401 Unauthorized: Personal Access Token của ứng dụng Figma đã hết hạn vào ngày 16/09”*.
  - Quan sát thấy giao diện **hoàn toàn không có nút Thử lại** (Retry disabled).
  - Chọn một trong ba phương án xử lý:
    1. **Sửa kết nối (Cấu hình lại Token)** → Điều hướng sang cài đặt connector.
    2. **Chuyển làm thủ công** → Sang Frame 13.
    3. **Đóng tác vụ** → Nhập lý do hủy bỏ.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Áp dụng BR-12.1: Nhận diện mã HTTP 401/403 là lỗi vĩnh viễn, cấm đưa vào hàng đợi auto-retry.
  - Ghi nhận sự cố cấu hình vào bảng thông báo cho Quản trị viên hệ thống.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Task `PV-2038` nhận lỗi 401 từ connector.
  - *Đầu ra / Bước tiếp:* Tùy IT Admin chọn sửa kết nối hoặc chuyển thủ công sang **Frame 06**.

---

### Frame 15 · Hết hạn mức license (Seat Limit Exceeded - Wait for Approval)
- **Ý nghĩa của màn hình:** Màn hình thể hiện tình huống xung đột hạn mức: Yêu cầu cấp quyền hợp lệ nhưng số seat thực tế phía nhà cung cấp đã được dùng hết.
- **Mục đích của màn hình:** Phân tách rõ ràng thẩm quyền tài chính: IT Admin không được tự ý mua thêm seat; hệ thống hiển thị trạng thái chờ Người duyệt chi quyết định tại luồng `UF-15`.
- **Thao tác người dùng (IT Admin):**
  - Xem thông số của tác vụ `PV-2039` (Slack Business+):
    - Hạn mức nội bộ quản lý: `49 / 50` đã gán.
    - Hạn mức thực tế phía Slack báo về: `50 / 50` (Hết suất khả dụng).
  - Xem banner thông tin: *“Đã tạo phiếu đề xuất mua thêm suất gửi Người duyệt chi (UF-15). Tác vụ tạm dừng chờ hạn mức mới.”*
  - IT Admin không có nút phê duyệt mua thêm trên màn hình này.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Ngăn chặn worker tiếp tục gọi lệnh tạo user gây lỗi 422 lặp lại.
  - Giữ nguyên trạng thái chiếm chỗ của `ASN-4897` để bảo lưu quyền ưu tiên cấp cho nhân viên.
  - Tạo liên kết tham chiếu tới hồ sơ duyệt ngân sách bên `UF-15`.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Lỗi phản hồi vượt quota từ Slack API cho task `PV-2039`.
  - *Đầu ra / Bước tiếp:* Chuyển luồng sang **UF-15** để Người duyệt chi quyết định mua thêm seat.

---

### Frame 16 · Đã mua thêm — trở lại thực thi (Capacity Expanded - Resume Execution)
- **Ý nghĩa của màn hình:** Màn hình thông báo hạn mức bản quyền đã được mở rộng thành công và tác vụ tự động được kích hoạt trở lại.
- **Mục đích của màn hình:** Thực hiện quy tắc QĐ-29b: *“Sau khi Người duyệt chi phê duyệt và mua thêm suất, IT Admin có thể tiếp tục thực thi ngay mà không phải chờ bộ phận Tài chính hoàn tất thủ tục hạch toán”*.
- **Thao tác người dùng (IT Admin):**
  - Xem thông báo cập nhật: Hạn mức mới đã được nâng lên `51 seats`.
  - Xem tiến trình song song:
    - Nhánh 1 (Tài chính): Phân hệ Finance đang ghi nhận hóa đơn cam kết tại `UF-11`.
    - Nhánh 2 (Thực thi IT): Tác vụ `PV-2039` đã tự động quay lại trạng thái `Sẵn sàng thực thi`.
  - Bấm nút: **“Tiếp tục thực thi tự động”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Cập nhật dung lượng subscription: `capacity = 51`.
  - Di chuyển task `PV-2039` từ nhóm `Thất bại` sang nhóm `Đang chạy tự động` (Ledger: Failed 2→1, Auto 3→4).
  - Chưa ghi nhận hoàn tất cho tới khi worker gọi API thành công có bằng chứng.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Quyết định phê duyệt mua thêm từ `UF-15` và cập nhật hạn mức từ nhà cung cấp.
  - *Đầu ra / Bước tiếp:* Kích hoạt worker gọi API tạo user trên Slack → Quay lại chu trình **Frame 02/03**.

---

# PHẦN 4. ĐẶC TẢ CHI TIẾT UF-09 · IT ADMIN XỬ LÝ NHÂN VIÊN NGHỈ VIỆC

> **Mục tiêu luồng UF-09:** Quản lý quy trình offboarding toàn diện về mặt công nghệ thông tin cho nhân sự nghỉ việc: Chuyển giao quan hệ kế nhiệm, xác nhận bàn giao dữ liệu, thu hồi toàn bộ seat bản quyền có kiểm soát bằng chứng, và lập lịch xóa dữ liệu chi tiết theo quy định bảo vệ quyền riêng tư.  
> **Nguyên tắc bất biến:** Phân tách rạch ròi ba vòng đời: Trạng thái nhân sự (`Employee Status`), Quan hệ phân bổ nội bộ (`Assignment`), và Tác vụ thực thi phía nhà cung cấp (`ProvisioningTask`). Seat chỉ được trả về kho tự do khi có bằng chứng tài khoản đã bị vô hiệu hóa thật.

```text
Topology UF-09:
01 → 02 → 03 → 04
               ├─ Có quan hệ quản lý/owner → 05 (Kế nhiệm)
               └─ Không có → bỏ qua 05
→ 06 (Chờ Manager bàn giao) → Manager duyệt → 07 (Đã xác nhận)
→ Tới ngày cuối → 08 (Sinh G2) → 09 (Chọn thu hồi) → 10 (Xác nhận số lượng) → 11 (Tạo 5 task)
→ 12 (Theo dõi bằng chứng UF-08)
     ├─ Thiếu bằng chứng → 13 → bổ sung UF-08 → 14
     └─ Đủ bằng chứng ────────────────────────→ 14 (Nhả seat cuối)
→ 15 (Chờ xóa dữ liệu) → Sau 30 ngày → 16 (Xóa detail, giữ aggregate)
```

---

### Frame 01 · Danh sách nhân sự sắp nghỉ (Offboarding Employee List)
- **Ý nghĩa của màn hình:** Điểm khởi đầu của quy trình offboarding tại bảng điều khiển nhân sự của IT Admin.
- **Mục đích của màn hình:** Cho phép IT Admin lọc và phát hiện sớm các hồ sơ nhân viên sắp thôi việc do phòng Nhân sự (HR) cập nhật để lên kế hoạch xử lý quyền truy cập kịp thời.
- **Thao tác người dùng (IT Admin):**
  - Sử dụng bộ lọc trạng thái: Chọn tab `Sắp nghỉ việc` (Upcoming Offboarding).
  - Chọn nhân viên cần xử lý: Trần Minh · Mã số `NV-0174` · Chức danh Trưởng nhóm Marketing.
  - Nhìn thấy tóm tắt sơ bộ: 5 seat bản quyền đang giữ, 2 quan hệ trọng yếu cần bàn giao, 1 thiết bị công ty đang cấp phát.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Đồng bộ trạng thái nhân sự từ HRIS.
  - Tổng hợp nhanh số lượng tài nguyên IT đang gắn với định danh nhân viên `NV-0174`.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Danh sách nhân viên từ cơ sở dữ liệu nhân sự.
  - *Đầu ra / Bước tiếp:* Bấm vào hồ sơ Trần Minh → Chuyển sang **Frame 02**.

---

### Frame 02 · Hồ sơ và tác động offboarding (Offboarding Scope & Impact Analysis)
- **Ý nghĩa của màn hình:** Báo cáo phân tích tác động toàn diện trước khi bắt đầu quy trình thu hồi quyền truy cập.
- **Mục đích của màn hình:** Tránh việc thu hồi đột ngột gây đứt gãy vận hành kinh doanh bằng cách liệt kê rõ tất cả những người và hệ thống sẽ bị ảnh hưởng nếu nhân viên này dừng hoạt động.
- **Thao tác người dùng (IT Admin):**
  - Rà soát 4 khối tác động chính:
    1. **Bản quyền cá nhân:** 5 phần mềm đang dùng (Figma, GitHub, Slack, Notion, Google Workspace).
    2. **Cây quản lý trực tiếp:** Đang làm Quản lý trực tiếp của 3 nhân viên cấp dưới.
    3. **Vai trò quản trị:** Đang là `Business Owner` của phần mềm Figma Professional.
    4. **Thiết bị phần cứng:** Đang giữ 1 laptop Dell Latitude `DEV-LT-0174`.
  - Nhấn nút hành động: **“Bắt đầu quy trình bàn giao”** (Initiate Offboarding).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Áp dụng BR-05.3: Bắt buộc lập kế hoạch trước khi can thiệp vào quyền truy cập.
  - Kiểm tra các ràng buộc toàn vẹn: Không được xóa ngang tài khoản khi còn giữ vai trò Business Owner.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Dữ liệu liên kết phân quyền của nhân viên Trần Minh.
  - *Đầu ra / Bước tiếp:* Bấm “Bắt đầu quy trình” → Mở dialog thiết lập thời gian tại **Frame 03**.

---

### Frame 03 · Thiết lập ngày làm việc cuối (Set Last Working Day & Handover Deadline Dialog)
- **Ý nghĩa của màn hình:** Hộp thoại xác lập mốc thời gian có hiệu lực pháp lý và kỹ thuật cho toàn bộ tiến trình offboarding.
- **Mục đích của màn hình:** Định ngày dừng quyền truy cập và hạn chót bàn giao tài sản, làm căn cứ để hệ thống lên lịch thu hồi tự động và lập lịch ngắt kết nối thiết bị.
- **Thao tác người dùng (IT Admin):**
  - Chọn trạng thái mới cho nhân viên: `Đang bàn giao` (Handover in Progress).
  - Chọn ngày làm việc cuối cùng (Last Working Day): `17/09/2026`.
  - Chọn hạn chót bàn giao dữ liệu: `16/09/2026 17:00 ICT`.
  - Nhấn nút: **“Tạo kế hoạch offboarding”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Bắt buộc trường Ngày làm việc cuối (không được bỏ trống theo FR-2.1).
  - Khởi tạo mã hồ sơ offboarding duy nhất: `OFF-2026-044`.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Form thiết lập ngày tháng của IT Admin.
  - *Đầu ra / Bước tiếp:* Nhấn tạo kế hoạch → Tạo thành công hồ sơ `OFF-2026-044`, chuyển sang **Frame 04**.

---

### Frame 04 · Kế hoạch offboarding đã tạo (Offboarding Plan Overview & Blockers)
- **Ý nghĩa của màn hình:** Màn hình trung tâm theo dõi tiến độ kế hoạch offboarding `OFF-2026-044` với bảng điều khiển các rào cản (blockers).
- **Mục đích của màn hình:** Giúp IT Admin nắm rõ các điều kiện chặn (blocker) cần giải quyết trước khi có thể thực hiện thu hồi tài khoản ở bước sau.
- **Thao tác người dùng (IT Admin):**
  - Quan sát thanh tiến trình Stepper 7 bước: Hiện đang ở Bước 1 (Hồ sơ).
  - Kiểm tra bảng cảnh báo: Đang có **2 Blocker cần giải quyết**:
    - Blocker 1: Chưa chỉ định người kế nhiệm vai trò Quản lý và Business Owner.
    - Blocker 2: Chưa có xác nhận bàn giao tài liệu từ Quản lý trực tiếp.
  - Bấm nút: **“Xử lý người kế nhiệm”** (Proceed to Successor Assignment).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Thiết lập thuộc tính `effective_to = 17/09/2026 18:00 ICT` cho thiết bị `DEV-LT-0174`.
  - Khóa toàn bộ các nút bấm thu hồi bản quyền cho tới khi các blocker được giải tỏa.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Hồ sơ `OFF-2026-044` vừa khởi tạo.
  - *Đầu ra / Bước tiếp:* Bấm xử lý kế nhiệm → Chuyển sang **Frame 05**.

---

### Frame 05 · Chỉ định người kế nhiệm (Assign Successor for Manager & Business Owner)
- **Ý nghĩa của màn hình:** Màn hình tái cấu trúc quan hệ tổ chức và bàn giao quyền sở hữu ứng dụng trước ngày nhân viên rời đi.
- **Mục đích của màn hình:** Thực thi quy tắc INV-06: Ngăn chặn tình trạng mồ côi (orphaned) nhân viên cấp dưới và ứng dụng SaaS không có người chịu trách nhiệm quản trị chi phí.
- **Thao tác người dùng (IT Admin):**
  - Tại mục Quản lý trực tiếp của 3 nhân viên (Nguyễn Mai Anh, Phạm Quốc Bảo, Võ Gia Hân): Chọn người thay thế là `Nguyễn Hoàng Long (NV-0216)`.
  - Tại mục Business Owner ứng dụng Figma Professional: Chọn người tiếp quản là `Lê Thu Hà (NV-0311)`.
  - Chọn ngày bắt đầu có hiệu lực: `18/09/2026`.
  - Bấm nút: **“Lưu & Cập nhật quan hệ kế nhiệm”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Kiểm tra người được chỉ định: Phải là nhân viên đang ở trạng thái Hoạt động (Active).
  - Ghi nhận lịch sử chuyển giao quan hệ quản trị vào bảng kiểm toán.
  - Giải tỏa Blocker kế nhiệm (Blocker count giảm từ 2 về 1).
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Danh sách nhân sự phù hợp để kế nhiệm.
  - *Đầu ra / Bước tiếp:* Cập nhật thành công → Chuyển sang **Frame 06**.

---

### Frame 06 · Chờ xác nhận bàn giao dữ liệu (Wait for Manager Handover Confirmation)
- **Ý nghĩa của màn hình:** Màn hình thể hiện trạng thái chờ phê duyệt độc lập từ Quản lý trực tiếp của nhân viên.
- **Mục đích của màn hình:** Đảm bảo dữ liệu kinh doanh quan trọng trên các nền tảng đám mây (Google Drive, Notion, Figma projects) đã được chuyển giao an toàn cho đồng nghiệp trước khi IT ngắt quyền truy cập.
- **Thao tác người dùng (IT Admin):**
  - Xem danh sách checklist bàn giao đang giao cho Quản lý Lê Thu Hà (`NV-0311`).
  - IT Admin chỉ có quyền: Bấm nút **“Gửi nhắc nhở (Send Reminder)”**; **tuyệt đối không có nút xác nhận thay Manager**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Gửi thông báo và task công việc sang cổng tự phục vụ của Manager Lê Thu Hà.
  - Khóa chặt tiến trình: Hệ thống không cho phép sinh tác vụ thu hồi license khi Manager chưa tick xác nhận hoàn tất bàn giao.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Checklist bàn giao tài sản số của Trần Minh.
  - *Đầu ra / Bước tiếp:* Quản lý đăng nhập xác nhận → Hệ thống nhận sự kiện chuyển sang **Frame 07**.

---

### Frame 07 · Bàn giao đã được xác nhận (Handover Confirmed by Manager)
- **Ý nghĩa của màn hình:** Màn hình xác nhận bằng chứng Quản lý đã hoàn tất việc nhận bàn giao tài sản số.
- **Mục đích của màn hình:** Đánh dấu việc giải tỏa blocker cuối cùng trong giai đoạn chuẩn bị, chuyển hồ sơ sang trạng thái sẵn sàng thu hồi khi đến ngày làm việc cuối.
- **Thao tác người dùng (IT Admin):**
  - Quan sát bằng chứng xác nhận: *“Lê Thu Hà đã xác nhận hoàn tất 100% checklist bàn giao lúc 16/09/2026 16:42 ICT”*.
  - Kiểm tra số lượng blocker: `0 Blocker`.
  - Xem thông báo lịch: *“Hệ thống sẽ kích hoạt nhóm khuyến nghị thu hồi G2 vào lúc 00:00 ngày 17/09/2026”*.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Đóng hoàn toàn giai đoạn chuẩn bị bàn giao.
  - Tài khoản và thiết bị của nhân viên vẫn được giữ nguyên hoạt động bình thường đến hết ngày 17/09 để phục vụ ngày công cuối cùng.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Chữ ký số / xác nhận của Manager Lê Thu Hà.
  - *Đầu ra / Bước tiếp:* Đến ngày 17/09/2026, chuyển nhân viên sang `Terminated` → Chuyển sang **Frame 08**.

---

### Frame 08 · Sinh năm khuyến nghị G2 (Generate 5 G2 Offboarding Recommendations)
- **Ý nghĩa của màn hình:** Màn hình hiển thị kết quả của rule engine tự động kích hoạt vào ngày làm việc cuối cùng của nhân viên.
- **Mục đích của màn hình:** Thực hiện BR-05.1 & BR-05.2: Khi nhân viên chuyển sang trạng thái đã nghỉ việc (`Terminated`), hệ thống tự động sinh 5 khuyến nghị nhóm `G2` với độ tin cậy tuyệt đối 100%, bỏ qua mọi ngưỡng đo lường sử dụng và không cần qua Manager duyệt nữa.
- **Thao tác người dùng (IT Admin):**
  - Xem danh sách 5 khuyến nghị G2 vừa được sinh ra cho Trần Minh:
    1. Figma Professional (`ASN-3872`)
    2. GitHub Business (`ASN-3873`)
    3. Slack Business+ (`ASN-3874`)
    4. Notion Plus (`ASN-3875`)
    5. Google Workspace Enterprise (`ASN-3876`)
  - Bấm nút: **“Xử lý thu hồi hàng loạt (Proceed to Bulk Revocation)”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Rule engine quét trạng thái nhân sự `NV-0174 = Terminated`.
  - Tự động gắn nhãn G2 - Độ tin cậy 100% - Phân loại: Thu hồi ngay lập tức.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Trạng thái nghỉ việc có hiệu lực và 5 Assignment đang active.
  - *Đầu ra / Bước tiếp:* Chuyển sang giao diện chọn thu hồi tại **Frame 09**.

---

### Frame 09 · Chọn thu hồi hàng loạt (Select Bulk Revocation for Offboarding Seats)
- **Ý nghĩa của màn hình:** Bảng danh sách chọn các license cần thu hồi đồng thời cho cùng một hồ sơ thôi việc.
- **Mục đích của màn hình:** Cho phép IT Admin rà soát lại kênh thực thi tương ứng của từng ứng dụng (3 ứng dụng có connector tự động: GitHub, Slack, Google; 2 ứng dụng thủ công: Figma, Notion) và ước tính chi phí tiết kiệm.
- **Thao tác người dùng (IT Admin):**
  - Tích chọn cả 5 mục trong danh sách (Select All 5 items).
  - Xem tổng giá trị tiết kiệm ước tính: `1.850.000 đ/tháng` (tiết kiệm ngay).
  - Nhấn nút: **“Thu hồi 5 license đã chọn”** (Revoke 5 Selected Seats).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Nhóm 5 Assignment vào một lô xử lý (batch action).
  - Phân loại kênh thực thi ngầm để chuẩn bị tạo đúng loại task ở bước tiếp theo.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* 5 khuyến nghị G2 từ Frame 08.
  - *Đầu ra / Bước tiếp:* Bấm nút thu hồi → Mở modal xác thực kép tại **Frame 10**.

---

### Frame 10 · Xác nhận thu hồi hàng loạt (Confirm Bulk Revocation Dialog)
- **Ý nghĩa của màn hình:** Hộp thoại kiểm soát an toàn nghiêm ngặt (Safe-guard modal) cho thao tác thu hồi quyền truy cập số lượng lớn.
- **Mục đích của màn hình:** Thực thi BR-05.4: Ngăn chặn thao tác bấm nhầm gây xóa hàng loạt tài khoản người dùng bằng cơ chế bắt buộc gõ lại chính xác số lượng và nhập lý do nghiệp vụ.
- **Thao tác người dùng (IT Admin):**
  - Đọc cảnh báo: Thao tác này sẽ tạo lệnh thu hồi tài khoản trên 5 hệ thống.
  - Nhập chính xác số lượng vào ô kiểm tra: Gõ số `5`.
  - Nhập lý do thu hồi bắt buộc: ví dụ *“Hoàn tất offboarding nhân sự Trần Minh theo kế hoạch OFF-2026-044”*.
  - Nút **“Xác nhận tạo lệnh thu hồi”** chỉ sáng lên khi số lượng gõ vào khớp chính xác là `5`.
  - Nhấn nút xác nhận.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Kiểm tra điều kiện form: `input_count === 5` và `length(reason) >= 10`.
  - Tạo một phiên quyết định thu hồi hàng loạt có gắn Audit Log và danh tính IT Admin.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Lựa chọn 5 seat và chuỗi xác nhận an toàn.
  - *Đầu ra / Bước tiếp:* Bấm xác nhận → Hệ thống sinh 5 task thực thi và chuyển sang **Frame 11**.

---

### Frame 11 · Đã tạo năm tác vụ thực thi (Batch Provisioning Tasks Created)
- **Ý nghĩa của màn hình:** Màn hình thông báo kết quả khởi tạo các tác vụ thực thi kỹ thuật và chuyển giao cho hàng đợi UF-08.
- **Mục đích của màn hình:** Thể hiện rõ nguyên tắc kiến trúc: *“Đã quyết định thu hồi chưa đồng nghĩa với việc tài khoản đã bị xóa thật”*. Cả 5 seat vẫn đang chiếm chỗ trên hệ thống cho tới khi từng task hoàn thành.
- **Thao tác người dùng (IT Admin):**
  - Quan sát danh sách 5 mã tác vụ vừa sinh ra:
    - `PV-2042`: Thu hồi Figma (Thủ công)
    - `PV-2043`: Thu hồi Notion (Thủ công)
    - `PV-2044`: Thu hồi GitHub (Connector)
    - `PV-2045`: Thu hồi Slack (Connector)
    - `PV-2046`: Thu hồi Google Workspace (Connector)
  - Nhấn nút: **“Theo dõi tiến độ thực thi tại UF-08”** hoặc **“Tiếp tục theo dõi tại đây”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Khởi tạo 5 bản ghi `ProvisioningTask` với trạng thái ban đầu là `PENDING`.
  - Đẩy 3 task tự động vào worker nền của connector; đẩy 2 task thủ công vào hàng đợi làm tay của IT Admin.
  - Toàn bộ 5 Assignment vẫn ở trạng thái giữ chỗ (`ALLOCATED`).
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Quyết định thu hồi hàng loạt từ Frame 10.
  - *Đầu ra / Bước tiếp:* Hệ thống theo dõi tiến độ các task hoàn thành tại UF-08 → Chuyển sang **Frame 12**.

---

### Frame 12 · Theo dõi bằng chứng thu hồi (Track Revocation Evidence Progress)
- **Ý nghĩa của màn hình:** Màn hình dashboard theo dõi tiến độ thu thập bằng chứng độc lập cho từng license trong quy trình offboarding.
- **Mục đích của màn hình:** Thể hiện quy tắc BR-14.2: *Hệ thống giải phóng seat độc lập theo từng task có đủ bằng chứng, không bắt buộc phải chờ toàn bộ cả lô hoàn tất mới được nhả*.
- **Thao tác người dùng (IT Admin):**
  - Quan sát trạng thái xử lý của 5 task:
    - 4 task đã hoàn tất có bằng chứng hợp lệ: GitHub, Slack, Notion, Google Workspace → Seat đã về trống.
    - 1 task còn lại: `PV-2042` (Figma Professional) vẫn ở trạng thái `Thiếu bằng chứng (Waiting Evidence)` → Seat vẫn đang chiếm chỗ.
  - Nhấp chuột vào task `PV-2042` để kiểm tra nguyên nhân nghẽn.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Nhận webhook/kết quả từ UF-08: Giải phóng 4 Assignment đã hoàn tất (`REVOKED`).
  - Giữ nguyên trạng thái chiếm chỗ của `ASN-3872` (Figma).
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Kết quả thực thi từ UF-08 trả về.
  - *Đầu ra / Bước tiếp:* Nhấn vào task Figma thiếu bằng chứng → Mở giao diện chi tiết tại **Frame 13**.

---

### Frame 13 · Bằng chứng Figma chưa đủ (Figma Insufficient Evidence Drill-down)
- **Ý nghĩa của màn hình:** Màn hình giải thích chi tiết lý do vì sao một seat cụ thể chưa thể đóng và chưa thể giải phóng bản quyền.
- **Mục đích của màn hình:** Cung cấp đường dẫn quay ngược lại chính tác vụ đó trong UF-08 để bổ sung bằng chứng, không để quy trình rơi vào trạng thái bế tắc (deadlock).
- **Thao tác người dùng (IT Admin):**
  - Đọc cảnh báo: *“Tác vụ PV-2042 chưa được cung cấp mã tham chiếu sự kiện xóa tài khoản từ Figma Admin Console. Assignment vẫn tiếp tục giữ chỗ.”*
  - Nhấn nút: **“Mở tác vụ PV-2042 trong Hàng đợi UF-08 để nhập bằng chứng”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Ngăn chặn việc đóng hồ sơ offboarding khi còn task dở dang.
  - Tạo đường link điều hướng ngữ cảnh (deep-link) sang đúng Frame 08 của UF-08.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Tác vụ `PV-2042` đang thiếu trường audit reference.
  - *Đầu ra / Bước tiếp:* IT Admin điều hướng sang UF-08 hoàn tất nhập bằng chứng `FIG-EVT-772904` → Quay trở lại **Frame 14**.

---

### Frame 14 · Đủ bằng chứng — nhả seat cuối (Complete Final Revocation - Seat Released)
- **Ý nghĩa của màn hình:** Màn hình ghi nhận việc giải phóng seat bản quyền cuối cùng của nhân viên sau khi đã bổ sung đầy đủ chứng từ kiểm toán.
- **Mục đích của màn hình:** Xác nhận toàn bộ 5/5 tài khoản của nhân viên đã được thu hồi thực tế, chính thức đóng cả 5 khuyến nghị G2 và đưa số seat gắn với nhân sự này về số không.
- **Thao tác người dùng (IT Admin):**
  - Quan sát kết quả cập nhật: Task `PV-2042` đã nhận bằng chứng `FIG-EVT-772904` và chuyển sang xanh lá `Hoàn tất`.
  - Đọc thông báo: *“Toàn bộ 5/5 seat đã được thu hồi thành công. Tổng chi phí tiết kiệm thực tế ghi nhận: 1.850.000 đ/tháng.”*
  - Bấm nút: **“Chuyển sang giai đoạn lưu trữ và xóa dữ liệu”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Đổi trạng thái Assignment cuối cùng `ASN-3872` sang `REVOKED`.
  - Ghi nhận số liệu tiết kiệm thực hiện ngay vào sổ tài chính.
  - Đóng hoàn toàn mục thu hồi bản quyền trong hồ sơ `OFF-2026-044`.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Bằng chứng hợp lệ bổ sung cho task `PV-2042`.
  - *Đầu ra / Bước tiếp:* Chuyển sang bước lưu trữ dữ liệu tại **Frame 15**.

---

### Frame 15 · Không còn seat, chờ xóa dữ liệu (All Seats Revoked - Scheduled Detail Retention)
- **Ý nghĩa của màn hình:** Màn hình chuyển giao giữa vòng đời phân bổ quyền truy cập và vòng đời bảo lưu/xóa dữ liệu cá nhân (Data Retention Lifecycle).
- **Mục đích của màn hình:** Thể hiện sự minh bạch tuân thủ chính sách bảo vệ dữ liệu (BR-41.1): Sau khi nghỉ việc, dữ liệu chi tiết hành vi sử dụng của nhân viên không được lưu giữ vĩnh viễn mà phải được lập lịch tiêu hủy.
- **Thao tác người dùng (IT Admin):**
  - Xem bảng thống kê:
    - Số seat đang gán cho nhân viên: `0 seat`.
    - Số bản ghi hoạt động chi tiết (usage detail logs) đang lưu trong hệ thống: `12.480 bản ghi`.
    - Lịch tiêu hủy tự động: Đã lập lịch chạy vào ngày `17/10/2026 00:00 ICT` (Đúng 30 ngày sau ngày làm việc cuối).
  - Đọc lưu ý: Các báo cáo tổng hợp chi phí cấp phòng ban và Audit Log kiểm toán sẽ được ẩn danh hóa và giữ lại theo luật định.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Đăng ký cron job tiêu hủy dữ liệu cho `NV-0174` vào hàng đợi Retention Service.
  - Ngăn chặn việc xóa dữ liệu trước hạn nếu chưa có yêu cầu đặc biệt.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Hồ sơ nhân viên đã hoàn tất thu hồi seat và mốc ngày 17/09/2026.
  - *Đầu ra / Bước tiếp:* Đến hạn 30 ngày sau (17/10/2026), cron job thực thi xóa dữ liệu → Chuyển sang **Frame 16**.

---

### Frame 16 · Đã xóa dữ liệu sau 30 ngày (Detail Data Purged - 30-Day Retention Executed)
- **Ý nghĩa của màn hình:** Màn hình báo cáo kết quả kiểm toán sau khi hệ thống đã thực thi việc xóa vĩnh viễn dữ liệu hoạt động chi tiết của nhân viên nghỉ việc.
- **Mục đích của màn hình:** Cung cấp bằng chứng tuân thủ cho các đợt kiểm toán an toàn thông tin và quyền riêng tư (Privacy Audit), chứng minh dữ liệu cá nhân đã bị tiêu hủy mà không làm hỏng tính toàn vẹn của báo cáo tài chính lịch sử.
- **Thao tác người dùng (IT Admin):**
  - Quan sát kết quả công việc retention:
    - 12.480 bản ghi chi tiết (URL, timestamp chi tiết, logs) đã bị xóa hoàn toàn khỏi cơ sở dữ liệu.
    - 5 bản ghi thống kê tổng hợp (daily aggregate) được giữ lại nhưng đã tách bỏ định danh cá nhân (gắn nhãn `ANONYMIZED_USER`).
    - Thử tìm kiếm nhật ký hoạt động theo mã `NV-0174` → Hệ thống trả về kết quả rỗng.
  - Xem mã chứng nhận phiên chạy tiêu hủy: `RET-JOB-20261017-0044`.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Thực thi lệnh hard-delete đối với bảng `usage_details` có `user_id = NV-0174`.
  - Chuyển `user_id` trong bảng `usage_aggregates` thành giá trị băm/ẩn danh.
  - Bảo toàn bảng `audit_logs` phục vụ giải trình pháp lý. Đóng vĩnh viễn hồ sơ `OFF-2026-044`.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Lệnh thực thi từ Retention Service tới hạn 30 ngày.
  - *Đầu ra / Bước tiếp:* Hoàn tất trọn vẹn toàn bộ quy trình offboarding của `UF-09`.

---

# PHẦN 5. ĐẶC TẢ CHI TIẾT UF-10 · IT ADMIN XỬ LÝ BẢNG TỐI ƯU LICENSE

> **Mục tiêu luồng UF-10:** Xử lý có hệ thống 4 nhóm lãng phí bản quyền phần mềm (`G1`, `G2`, `G3`, `G4`) dựa trên dữ liệu sử dụng và bằng chứng kiểm toán. Tuyệt đối không gộp chung các nguồn dữ liệu khác nhau về độ tin cậy và không cộng gộp sai hai loại giá trị tài chính: Tiết kiệm thực hiện ngay (Immediate Savings) và Tiết kiệm tại kỳ gia hạn (Renewal Savings).  
> **Nguyên tắc phân định 4 nhóm lãng phí:**  
> - **G1 (Thừa seat cấp thuê bao):** Dữ liệu nội bộ 100% → Đề xuất giảm mua tại kỳ gia hạn → Chuyển Người duyệt chi (`UF-15`) → Tài chính ghi nhận (`UF-11`).  
> - **G2 (Người đã nghỉ việc):** Dữ liệu nội bộ 100% → Thu hồi ngay, không qua Manager → Bàn giao `UF-08`.  
> - **G3 (Chưa từng kích hoạt):** Dữ liệu usage có coverage → Gửi Manager xác nhận (`UF-05`) → IT Admin review → Bàn giao `UF-08`.  
> - **G4 (Không hoạt động lâu ngày):** Dữ liệu usage có coverage → Gửi Manager xác nhận (`UF-05`) → IT Admin review → Bàn giao `UF-08`.

```text
Topology UF-10:
01 (Dashboard) → 02 (So sánh 4 nhóm)
      ├─ G1: 03 (Danh sách) → 04 (Chi tiết) → 05 (Gửi duyệt UF-15) → 06 (Đã duyệt & ghi nhận)
      ├─ G2: 07 (Danh sách) → 08 (Xác nhận hàng loạt) → 09 (Tạo task bàn giao UF-08)
      └─ G3/G4: 10 (Danh sách) → 11 (Snapshot bằng chứng) → 12 (Gửi batch Manager)
                 → 13 (Kết quả Manager) → 14 (IT Review)
                     ├─ Đồng ý → 15 (Tạo task UF-08) → 18 (Tổng kết)
                     └─ Không đồng ý → 16 (Lý do từ chối) → 17 (Trả lại Manager)
```

---

### Frame 01 · Dashboard tối ưu license (Optimization Dashboard Overview)
- **Ý nghĩa của màn hình:** Trung tâm điều hành tối ưu hóa chi phí phần mềm định kỳ của doanh nghiệp.
- **Mục đích của màn hình:** Cho IT Admin thấy bức tranh tổng thể về các cơ hội cắt giảm lãng phí được sinh ra từ đợt chạy rule engine gần nhất, thể hiện rõ hai loại giá trị tài chính riêng biệt.
- **Thao tác người dùng (IT Admin):**
  - Xem thông tin phiên chạy: `RUN-OPT-20260917-0615` (chạy tự động lúc 06:15 sáng bởi Automation Service).
  - Xem tổng số phát hiện: `38 khuyến nghị` phân bổ theo 4 nhóm G1 (12), G2 (3), G3 (9), G4 (14).
  - Đọc hai thẻ tài chính độc lập:
    - Ô màu xanh lá: **Tiết kiệm thực hiện ngay: 2.590.000 đ/tháng** (từ G2 và các seat thu hồi được).
    - Ô màu xanh dương: **Tiết kiệm tại kỳ gia hạn: 72.000.000 đ/năm** (từ giảm số lượng mua G1).
  - Chọn nút: **“Xem giải thích & so sánh 4 nhóm”** hoặc chọn trực tiếp một nhóm để xử lý.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Áp dụng BR-20.2: Cấm cộng gộp cơ học số tiền tiết kiệm hàng tháng hiện tại với số tiền kỳ vọng tại ngày gia hạn trong tương lai.
  - Cố định snapshot dữ liệu tại thời điểm chạy rule, bảo đảm dữ liệu không bị biến động trong phiên phân tích.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Kết quả chạy rule engine tối ưu ngày 17/09/2026.
  - *Đầu ra / Bước tiếp:* Nhấn so sánh 4 nhóm → Chuyển sang **Frame 02**.

---

### Frame 02 · So sánh bốn nhóm lãng phí (Compare G1-G4 Groups & Rules)
- **Ý nghĩa của màn hình:** Màn hình ma trận chính sách giải thích cơ chế hoạt động và ranh giới thẩm quyền của từng nhóm khuyến nghị.
- **Mục đích của màn hình:** Giúp IT Admin hiểu rõ lý do vì sao mỗi nhóm lãng phí lại có độ tin cậy khác nhau, đòi hỏi bằng chứng khác nhau và có quy trình phê duyệt hoàn toàn khác nhau.
- **Thao tác người dùng (IT Admin):**
  - Rà soát bảng so sánh ma trận 4 nhóm:
    - `G1`: Nguồn nội bộ (Hợp đồng vs Gán), tin cậy 100%, không cần usage, hành động: Giảm mua tại Renewal, Người duyệt chi phê duyệt.
    - `G2`: Nguồn nội bộ (HRIS vs Gán), tin cậy 100%, không cần usage, hành động: Thu hồi ngay, IT quyết định trực tiếp.
    - `G3`: Nguồn hoạt động (Usage), tin cậy Cao, cần Coverage hợp lệ, hành động: Thu hồi, bắt buộc Manager xác nhận.
    - `G4`: Nguồn hoạt động (Usage), tin cậy Trung bình, cần Coverage hợp lệ, hành động: Tối ưu/Thu hồi, bắt buộc Manager xác nhận.
  - Chọn một nhánh để bắt đầu walkthrough: Bấm **“Xử lý nhánh G1”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Trình bày trực quan các rule nghiệp vụ `BR-19.1`, `BR-19.2`, `BR-20.3` để người dùng không thao tác sai quy trình.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Cấu hình luật nghiệp vụ từ tài liệu kiến trúc.
  - *Đầu ra / Bước tiếp:* Chọn G1 → **Frame 03**; chọn G2 → **Frame 07**; chọn G3/G4 → **Frame 10**.

---

### Frame 03 · Danh sách khuyến nghị G1 (G1 Unassigned Seats at Subscription Level)
- **Ý nghĩa của màn hình:** Bảng kê các gói thuê bao phần mềm đang có số lượng seat mua vượt trội so với số lượng thực tế đã phân bổ cho nhân viên.
- **Mục đích của màn hình:** Phát hiện lãng phí ở cấp độ hợp đồng thuê bao (Subscription Level), hoàn toàn không nhắm vào việc đánh giá hay tước quyền của bất kỳ cá nhân nào.
- **Thao tác người dùng (IT Admin):**
  - Quan sát danh sách các hợp đồng có seat chưa gán (Unassigned Seats).
  - Chọn gói phần mềm tiêu biểu: `Microsoft 365 E3` (`SUB-M365-E3-01`):
    - Số lượng mua theo hợp đồng: `120 seats`.
    - Số lượng thực tế đang gán sử dụng: `108 seats`.
    - Số lượng dư thừa: `12 seats` không sử dụng trong suốt 90 ngày qua.
  - Nhấn nút: **“Xem chi tiết phương án gia hạn”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Đối chiếu giữa trường `purchased_quantity` và `assigned_quantity` của bảng hợp đồng.
  - Xác minh thời hạn thông báo hủy (Notice Deadline) của hợp đồng.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Dữ liệu hợp đồng thuê bao từ phân hệ Quản lý ứng dụng.
  - *Đầu ra / Bước tiếp:* Bấm xem chi tiết → Chuyển sang **Frame 04**.

---

### Frame 04 · Chi tiết G1 tại kỳ gia hạn (G1 Renewal Opportunity Detail)
- **Ý nghĩa của màn hình:** Bản đề xuất phương án điều chỉnh số lượng cho kỳ tái ký hợp đồng tiếp theo.
- **Mục đích của màn hình:** Tính toán chính xác giá trị tiết kiệm hàng năm và cảnh báo thời hạn chót gửi thông báo cắt giảm cho nhà cung cấp để không bị tự động gia hạn số lượng cũ.
- **Thao tác người dùng (IT Admin):**
  - Kiểm tra các mốc thời gian của gói Microsoft 365 E3:
    - Ngày hết hạn hợp đồng: `15/12/2026`.
    - Hạn chót gửi thông báo cắt giảm (Notice Deadline - 30 ngày trước hạn): `15/11/2026`.
  - Xem phương án khuyến nghị từ hệ thống:
    - Giảm số lượng mua từ `120` xuống `108` seats (cắt giảm 12 seats).
    - Đơn giá: `500.000 đ/seat/tháng` → Tiết kiệm dự kiến: **72.000.000 đ/năm**.
  - Nhấn nút: **“Chuyển Người duyệt chi phê duyệt (UF-15)”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Tạo một phiếu đề xuất gia hạn có mã `REN-2026-041`.
  - Đóng gói toàn bộ snapshot bằng chứng số lượng gán thực tế để Người duyệt chi làm căn cứ ra quyết định.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Thông số chi tiết hợp đồng Microsoft 365.
  - *Đầu ra / Bước tiếp:* Bấm chuyển duyệt → Chuyển sang giao diện bàn giao tại **Frame 05**.

---

### Frame 05 · Bàn giao duyệt G1 (Handoff G1 Downsizing Approval to UF-15)
- **Ý nghĩa của màn hình:** Màn hình xác nhận chuyển giao quyền quyết định cắt giảm số lượng hợp đồng sang đúng vai trò có thẩm quyền ngân sách.
- **Mục đích của màn hình:** Thực hiện triệt để QĐ-29b: Quyết định giảm quy mô thuê bao thuộc thẩm quyền của **Người duyệt chi** (Approver), không thuộc thẩm quyền của IT Admin hay Finance.
- **Thao tác người dùng (IT Admin):**
  - Xem thông báo: Hồ sơ `REN-2026-041` đã được chuyển tới hàng đợi phê duyệt của Giám đốc tài chính / Người duyệt chi tại phân hệ `UF-15`.
  - Trạng thái hồ sơ: `Chờ Người duyệt chi phê duyệt`.
  - Bấm nút liên kết xem luồng duyệt hoặc quay lại dashboard.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Gửi thông báo tới Người duyệt chi có thẩm quyền đối với ngân sách Cost Center tương ứng.
  - Khóa không cho phép sửa đổi số lượng đề xuất trong khi hồ sơ đang nằm trên bàn duyệt.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Hồ sơ đề xuất `REN-2026-041`.
  - *Đầu ra / Bước tiếp:* Luồng chuyển sang **UF-15**; sau khi được duyệt và ghi nhận sẽ cập nhật tại **Frame 06**.

---

### Frame 06 · G1 đã duyệt và ghi nhận (G1 Approved & Recorded)
- **Ý nghĩa của màn hình:** Màn hình thể hiện kết quả phê duyệt thực tế và sự phân kỳ giữa con số đề xuất ban đầu và con số được chốt thực tế.
- **Mục đích của màn hình:** Thực thi BR-22.2: Số tiền ghi nhận vào báo cáo tiết kiệm phải là số thực tế đã được duyệt, không dùng số ước tính ban đầu của hệ thống.
- **Thao tác người dùng (IT Admin):**
  - Quan sát kết quả từ Người duyệt chi (Quyết định `APV-2026-118`):
    - Đề xuất ban đầu: Giảm 12 seats (tiết kiệm 72 triệu/năm).
    - **Quyết định thực tế của Người duyệt chi:** Chỉ đồng ý giảm **8 seats**, giữ lại **4 seats làm dự phòng (buffer)** cho kế hoạch tuyển dụng quý tới.
    - Tiết kiệm được phê duyệt chính thức: **48.000.000 đ/năm**.
  - Xem trạng thái đối soát: Phân hệ Tài chính đã ghi nhận cam kết mới tại `FIN-REN-2026-078` trên `UF-11`.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Cập nhật số lượng gia hạn dự kiến của hợp đồng Microsoft 365 thành `112 seats`.
  - Ghi nhận chính xác 48.000.000 đ/năm vào thẻ Tiết kiệm tại kỳ gia hạn (sẽ hiển thị ở Frame 18).
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Quyết định chính thức từ UF-15 và xác nhận ghi nhận từ UF-11.
  - *Đầu ra / Bước tiếp:* Kết thúc nhánh G1; IT Admin chuyển sang xử lý nhánh G2 tại **Frame 07**.

---

### Frame 07 · Danh sách khuyến nghị G2 (G2 Terminated Employee Seats List)
- **Ý nghĩa của màn hình:** Danh sách các tài khoản bản quyền đang gắn với nhân sự đã chính thức nghỉ việc (Terminated) nhưng chưa được thu hồi.
- **Mục đích của màn hình:** Giúp IT Admin xử lý dứt điểm các trường hợp lãng phí hiển nhiên với độ tin cậy tuyệt đối 100%, không cần qua bước thẩm định của Quản lý.
- **Thao tác người dùng (IT Admin):**
  - Quan sát danh sách 3 tài khoản thuộc nhóm G2:
    1. Đặng Hữu Nam · Đã nghỉ việc ngày 10/09 · License: JetBrains All Products
    2. Vũ Thị Mai · Đã nghỉ việc ngày 12/09 · License: Adobe Creative Cloud
    3. Hoàng Văn Thái · Đã nghỉ việc ngày 14/09 · License: Zoom Pro
  - Đọc banner hướng dẫn: *“Nhóm G2 có căn cứ nhân sự tuyệt đối, không cần gửi Quản lý phê duyệt. IT Admin có quyền thu hồi trực tiếp.”*
  - Chọn cả 3 mục và nhấn: **“Thu hồi hàng loạt G2”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Kiểm tra trạng thái nhân sự từ HRIS: Cả 3 nhân viên đều có cờ `Terminated = true`.
  - Ẩn hoàn toàn các nút gửi phê duyệt Manager đối với nhóm này.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* 3 bản ghi khuyến nghị G2.
  - *Đầu ra / Bước tiếp:* Nhấn thu hồi hàng loạt → Mở dialog xác nhận tại **Frame 08**.

---

### Frame 08 · Xác nhận G2 hàng loạt (Confirm G2 Bulk Revocation Dialog)
- **Ý nghĩa của màn hình:** Hộp thoại xác nhận trách nhiệm của IT Admin trước khi tạo các lệnh thu hồi tài khoản thật.
- **Mục đích của màn hình:** Đảm bảo IT Admin kiểm tra lại phạm vi tác động và nhập lý do bắt buộc để lưu trữ vào Audit Trail.
- **Thao tác người dùng (IT Admin):**
  - Đọc tóm tắt: Chuẩn bị thu hồi 3 seat của 3 nhân viên đã thôi việc.
  - Gõ xác nhận số lượng: Nhập số `3`.
  - Nhập lý do nghiệp vụ: *“Thu hồi license định kỳ theo kết quả rà soát nhân sự nghỉ việc đợt 17/09”*.
  - Nhấn nút: **“Xác nhận & Tạo tác vụ thực thi”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Kiểm tra điều kiện gõ đúng số lượng `3`.
  - Nhắc nhở IT Admin: Tạo tác vụ chưa làm seat về trống ngay, seat chỉ được nhả khi có bằng chứng từ UF-08.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Lệnh thu hồi 3 license G2.
  - *Đầu ra / Bước tiếp:* Nhấn xác nhận → Chuyển sang thông báo tạo task tại **Frame 09**.

---

### Frame 09 · Đã tạo tác vụ G2 (G2 Provisioning Tasks Created)
- **Ý nghĩa của màn hình:** Màn hình bàn giao thực thi kỹ thuật từ phân hệ tối ưu sang phân hệ hàng đợi cấp phát/thu hồi UF-08.
- **Mục đích của màn hình:** Chuyển giao trách nhiệm xóa tài khoản thật sang `UF-08`, bảo toàn trạng thái chiếm chỗ của Assignment cho tới khi có bằng chứng xác thực.
- **Thao tác người dùng (IT Admin):**
  - Quan sát 3 mã tác vụ vừa được sinh ra:
    - `PV-2058`: Thu hồi JetBrains (Kênh Connector)
    - `PV-2059`: Thu hồi Adobe CC (Kênh Manual)
    - `PV-2061`: Thu hồi Zoom Pro (Kênh Connector)
  - Xem lưu ý: Báo cáo tiết kiệm thực hiện ngay sẽ chỉ được cộng dồn khi 3 tác vụ này chuyển sang trạng thái Hoàn tất.
  - Bấm nút: **“Mở Hàng đợi UF-08”** hoặc **“Chuyển sang xử lý nhánh G3/G4”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Khởi tạo 3 bản ghi `ProvisioningTask` bàn giao sang `UF-08`.
  - Cập nhật trạng thái khuyến nghị G2: `Đang thực thi thu hồi`.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* 3 quyết định thu hồi từ Frame 08.
  - *Đầu ra / Bước tiếp:* Bàn giao sang **UF-08**; IT Admin chuyển sang xử lý nhánh G3/G4 tại **Frame 10**.

---

### Frame 10 · Danh sách khuyến nghị G3/G4 (G3/G4 Usage-based Inactive Seats List)
- **Ý nghĩa của màn hình:** Bảng kê các tài khoản bị phát hiện lãng phí dựa trên phân tích dữ liệu hoạt động thực tế (Usage Data).
- **Mục đích của màn hình:** Tách biệt rõ giữa hai loại không hoạt động:
  - **G3 (Chưa từng dùng):** Được cấp quyền từ lâu nhưng chưa phát sinh bất kỳ hoạt động nào.
  - **G4 (Không dùng lâu ngày):** Có hoạt động trong quá khứ nhưng đã ngừng sử dụng liên tục vượt ngưỡng (ví dụ: > 60 ngày).
- **Thao tác người dùng (IT Admin):**
  - Xem danh sách khuyến nghị kèm các chỉ số chất lượng nguồn (Source Quality) và độ bao phủ (Coverage).
  - Chọn một trường hợp tiêu biểu để thẩm định bằng chứng: `REC-2026-331` (Lê Anh Tuấn · License: JetBrains All Products · Nhóm G3).
  - Nhấn nút: **“Xem bằng chứng chi tiết (Inspect Evidence Snapshot)”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Áp dụng BR-20.3: Chỉ hiển thị các khuyến nghị G3/G4 khi nguồn dữ liệu usage đáp ứng đủ cửa sổ bao phủ hợp lệ (Coverage Window valid) và định danh đã khớp thành công.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Dữ liệu usage đã chuẩn hóa từ `UF-06` hoặc `UF-16`.
  - *Đầu ra / Bước tiếp:* Nhấn xem bằng chứng → Chuyển sang **Frame 11**.

---

### Frame 11 · Snapshot bằng chứng usage (Evidence Snapshot Drill-down - REC-2026-331)
- **Ý nghĩa của màn hình:** Màn hình thẩm định bằng chứng chi tiết bất biến (Immutable Evidence Snapshot) làm cơ sở cho khuyến nghị thu hồi.
- **Mục đích của màn hình:** Chứng minh tính khách quan và khoa học của khuyến nghị, bảo đảm rằng quyết định thu hồi không dựa trên suy đoán mà dựa trên dữ liệu đo lường cụ thể có kiểm toán.
- **Thao tác người dùng (IT Admin):**
  - Rà soát các thông số kỹ thuật trong snapshot:
    - Cửa sổ đo lường (Coverage Window): `120 ngày liên tục` (từ 20/05 đến 17/09/2026).
    - Nguồn dữ liệu: Git commit logs từ GitHub Enterprise + Plugin telemetry.
    - Định nghĩa hoạt động hợp lệ (Activity Definition): Có commit code hoặc tương tác IDE ≥ 15 phút/ngày.
    - Kết quả ghi nhận: `0 ngày hoạt động` (Hoàn toàn không sử dụng kể từ khi cấp).
    - Độ tin cậy tính toán: `92%`.
  - Sau khi kiểm tra thấy bằng chứng hoàn toàn thuyết phục, nhấn: **“Đưa vào lô gửi Quản lý xác nhận”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Đóng băng snapshot bằng chứng, gắn mã băm xác thực để bằng chứng không bị thay đổi ngay cả khi dữ liệu nguồn tiếp tục biến động.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Khuyến nghị `REC-2026-331` và bảng kê usage logs.
  - *Đầu ra / Bước tiếp:* Đưa vào hàng chờ gửi duyệt → Chuyển sang **Frame 12**.

---

### Frame 12 · Gửi batch cho Manager (Send Batch Review to Managers - UF-05)
- **Ý nghĩa của màn hình:** Màn hình gom nhóm và phát hành các yêu cầu thẩm định nhu cầu sử dụng tới các Quản lý trực tiếp.
- **Mục đích của màn hình:** Thực hiện gom nhóm thông minh theo tuần và theo Quản lý (`Manager Batching`) để tránh làm phiền Quản lý bằng các thông báo lẻ tẻ hàng ngày.
- **Thao tác người dùng (IT Admin):**
  - Xem bảng tổng hợp các lô gửi duyệt:
    - Lô `MBR-2026-W38-009`: Gửi cho Quản lý Đỗ Khắc Cường (quản lý 3 nhân sự trong danh sách G3/G4).
    - Gồm khuyến nghị `REC-2026-331` của Lê Anh Tuấn.
  - Thiết lập hạn chót phản hồi: `5 ngày làm việc`.
  - Nhấn nút: **“Phát hành lô thẩm định sang UF-05”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Khởi tạo gói thẩm định `Manager Batch Review` chuyển giao sang phân hệ `UF-05`.
  - Gửi email và thông báo trên hệ thống tới Quản lý Đỗ Khắc Cường.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Danh sách khuyến nghị G3/G4 đã chọn.
  - *Đầu ra / Bước tiếp:* Chuyển luồng sang **UF-05** để Quản lý phản hồi; kết quả quay về tại **Frame 13**.

---

### Frame 13 · Kết quả phản hồi từ Manager (Manager Review Results Summary)
- **Ý nghĩa của màn hình:** Màn hình tiếp nhận kết quả thẩm định nhu cầu từ Quản lý trực tiếp gửi về cho IT Admin.
- **Mục đích của màn hình:** Phân loại rõ 3 hướng quyết định của Quản lý theo quy định nghiệp vụ:
  1. **Đồng ý thu hồi:** Chuyển sang bước IT Admin xem xét thực thi.
  2. **Yêu cầu giữ lại:** Quản lý giải trình lý do dự án đặc thù → Khuyến nghị đóng lại, không thu hồi.
  3. **Tạm miễn trừ:** Tạm dừng đánh giá trong 30/60 ngày do nhân viên nghỉ thai sản/công tác → Đặt lịch đánh giá lại.
- **Thao tác người dùng (IT Admin):**
  - Xem bảng kết quả phản hồi của Quản lý Đỗ Khắc Cường:
    - 1 trường hợp Giữ lại (kèm lý do: nhân viên sắp chuyển sang dự án mới).
    - 1 trường hợp Tạm miễn trừ (nghỉ ốm dài hạn).
    - 1 trường hợp: **Đồng ý thu hồi** đối với `REC-2026-331` (Lê Anh Tuấn · JetBrains).
  - Chọn trường hợp Đồng ý thu hồi và nhấn: **“Mở phiên xem xét của IT Admin”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Đóng các khuyến nghị thuộc nhánh Giữ lại và lưu trữ lý do của Quản lý.
  - Đưa trường hợp Đồng ý thu hồi vào hàng đợi thẩm tra của IT Admin.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Quyết định phản hồi từ Quản lý trong `UF-05`.
  - *Đầu ra / Bước tiếp:* Mở xem xét IT → Chuyển sang **Frame 14**.

---

### Frame 14 · IT review quyết định thu hồi (IT Admin Review Revocation Request)
- **Ý nghĩa của màn hình:** Cổng kiểm soát phân tách trách nhiệm (Separation of Duties - SoD-5): Quản lý chỉ xác nhận về mặt nhu cầu nghiệp vụ, nhưng **chính IT Admin mới là người có thẩm quyền quyết định thay đổi quyền truy cập hệ thống**.
- **Mục đích của màn hình:** Cho phép IT Admin rà soát lần cuối góc độ kỹ thuật và bảo mật trước khi phê chuẩn việc thu hồi.
- **Thao tác người dùng (IT Admin):**
  - Rà soát hồ sơ tổng hợp của `REC-2026-331`:
    - Bằng chứng usage 0 ngày hoạt động.
    - Quản lý trực tiếp đã đồng ý thu hồi với ghi chú: *“Nhân viên không còn nhu cầu dùng IDE cao cấp”*.
  - Lựa chọn một trong hai hành động:
    - **Phương án A: Đồng ý thu hồi** → Tiếp tục quy trình thu hồi.
    - **Phương án B: Không đồng ý** → Bác bỏ yêu cầu và giải trình.
  - IT Admin bấm chọn **“Đồng ý thu hồi”** (Walkthrough nhánh A).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Phân nhánh xử lý: Nếu chọn Đồng ý → sang Frame 15; nếu chọn Không đồng ý → sang Frame 16.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Khuyến nghị đã có sự đồng thuận của Quản lý.
  - *Đầu ra / Bước tiếp:* Chọn Đồng ý → Chuyển sang **Frame 15** (hoặc chọn Không đồng ý → **Frame 16**).

---

### Frame 15 · Nhánh A · IT đồng ý thu hồi (Branch A: IT Approves & Creates PV-2060)
- **Ý nghĩa của màn hình:** Màn hình thông qua quyết định thu hồi chính thức từ cả hai phía Quản lý và IT Admin.
- **Mục đích của màn hình:** Khởi tạo tác vụ thực thi thu hồi tài khoản kỹ thuật và bàn giao sang hàng đợi UF-08.
- **Thao tác người dùng (IT Admin):**
  - Xem thông báo: Quyết định thu hồi license JetBrains của Lê Anh Tuấn đã được phê chuẩn chính thức.
  - Xem mã tác vụ vừa được tạo: `PV-2060` (Kênh Connector JetBrains Hub).
  - Đọc lưu ý: Assignment vẫn đang chiếm chỗ cho tới khi `PV-2060` có bằng chứng hoàn tất từ UF-08.
  - Nhấn nút: **“Xem tổng kết bảng tiết kiệm”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Tạo bản ghi `ProvisioningTask` `PV-2060` bàn giao sang `UF-08`.
  - Chuyển trạng thái khuyến nghị `REC-2026-331` sang `Awaiting Execution`.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Phê chuẩn của IT Admin tại Frame 14.
  - *Đầu ra / Bước tiếp:* Chuyển sang **Frame 18** để xem tổng kết số tiền tiết kiệm.

---

### Frame 16 · Nhánh B · IT không đồng ý thu hồi (Branch B: IT Rejects Revocation Dialog)
- **Ý nghĩa của màn hình:** Hộp thoại xử lý tình huống bất đồng ý kiến khi IT Admin không chấp thuận đề xuất thu hồi của Quản lý.
- **Mục đích của màn hình:** Thực thi BR-22.1: Bắt buộc IT Admin phải nhập lý do giải trình rõ ràng khi bác bỏ quyết định của Quản lý, ngăn chặn việc tùy tiện hủy bỏ quy trình.
- **Thao tác người dùng (IT Admin):**
  - Mở modal khi bấm nút “Không đồng ý” tại Frame 14.
  - Nhập lý do từ chối bắt buộc: ví dụ *“Nhân viên Lê Anh Tuấn sắp được điều động vào dự án Core Banking từ ngày 01/10, cần duy trì cấu hình môi trường IDE để không làm gián đoạn tiến độ bàn giao dự án”*.
  - Nút xác nhận bị khóa nếu lý do để trống.
  - Nhấn nút: **“Xác nhận không đồng ý & Trả lại Manager”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Lưu lý do phản hồi của IT Admin vào trường `it_rejection_reason`.
  - Giữ nguyên trạng thái hoạt động của Assignment, không sinh tác vụ thu hồi.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Form nhập lý do từ chối của IT Admin.
  - *Đầu ra / Bước tiếp:* Bấm xác nhận → Chuyển sang **Frame 17**.

---

### Frame 17 · Trả lại Manager xem xét (Return to Manager for Reconsideration)
- **Ý nghĩa của màn hình:** Màn hình thông báo kết thúc có kiểm soát của nhánh không đồng ý, đưa hồ sơ quay trở lại Quản lý để nắm bắt thông tin.
- **Mục đích của màn hình:** Bảo toàn lịch sử trao đổi đa chiều giữa Quản lý và IT Admin, đảm bảo tính minh bạch và tránh việc quyết định bị rơi vào ngõ cụt.
- **Thao tác người dùng (IT Admin):**
  - Xem tóm tắt thông tin trả về: Hồ sơ đã được hoàn trả lại cho Quản lý Đỗ Khắc Cường kèm toàn bộ giải trình của IT Admin.
  - Trạng thái khuyến nghị: `Returned to Manager for Re-evaluation`.
  - Bấm nút quay lại danh sách hoặc đóng luồng.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Gửi thông báo cập nhật cho Quản lý trong phân hệ UF-05.
  - Giữ nguyên snapshot dữ liệu để tái đánh giá trong chu kỳ chạy rule tiếp theo nếu cần.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Hồ sơ bị IT từ chối từ Frame 16.
  - *Đầu ra / Bước tiếp:* Kết thúc nhánh B; hồ sơ chuyển về thẩm quyền quản lý của UF-05.

---

### Frame 18 · Tổng kết bảng tiết kiệm chi phí (Cost Savings Summary)
- **Ý nghĩa của màn hình:** Báo cáo tổng kết giá trị tài chính thực tế thu được sau khi đã hoàn tất các vòng xử lý của đợt tối ưu hóa.
- **Mục đích của màn hình:** Trình bày minh bạch và phân định rõ ràng giữa hai dòng tiền giá trị theo đúng tiêu chuẩn kiểm toán tài chính: Tiết kiệm ngay và Tiết kiệm tại kỳ gia hạn.
- **Thao tác người dùng (IT Admin):**
  - Quan sát hai khối giá trị tài chính đã được chứng thực bằng quyết định và bằng chứng:
    1. **Tiết kiệm thực hiện ngay (Immediate Savings):**
       - Ghi nhận: **740.000 đ/tháng** (tương đương 8.880.000 đ/năm) từ các seat G2 đã hoàn tất thu hồi có bằng chứng ở UF-08.
       - Lưu ý: Các task chưa hoàn tất như `PV-2060` không được cộng non vào đây.
    2. **Tiết kiệm tại kỳ gia hạn (Renewal Savings):**
       - Ghi nhận: **48.000.000 đ/năm** từ quyết định cắt giảm 8 seat Microsoft 365 E3 đã được Người duyệt chi phê chuẩn.
  - Xem danh sách chi tiết các quyết định đóng góp vào con số trên.
  - Xuất báo cáo (Export PDF/Excel) gửi Ban Giám đốc và phòng Tài chính.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Áp dụng BR-22.2 & FR-4.15: Chỉ kết xuất các con số đã có quyết định phê chuẩn chính thức và bằng chứng kỹ thuật.
  - Lưu phiên bản báo cáo tài chính tối ưu vào lịch sử kiểm toán doanh nghiệp.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Toàn bộ kết quả xử lý từ nhánh G1, G2, G3/G4.
  - *Đầu ra / Bước tiếp:* Hoàn tất quy trình tối ưu của `UF-10`.

---

# PHẦN 6. ĐẶC TẢ CHI TIẾT UF-12 · PHÁT HIỆN VÀ HỢP THỨC HÓA PHẦN MỀM NGOÀI DANH MỤC (SHADOW IT)

> **Mục tiêu luồng UF-12:** Xử lý các phát hiện (findings) về phần mềm SaaS chưa được phê duyệt đang hoạt động trong doanh nghiệp thông qua 3 nguồn bằng chứng: Sao kê tài chính, Dữ liệu danh tính IdP, và Dữ liệu bộ thu thập trên máy trạm. Chuyển hóa bằng chứng thô thành finding có giải trình, và đưa ra 1 trong 3 kết cục dứt điểm: Báo nhầm (False Positive), Hợp thức hóa vào danh mục (Regularize), hoặc Không chấp thuận và thu hồi (Unapproved & Revoke).  
> **Nguyên tắc bất biến:** Bằng chứng thô chỉ là cơ sở nghi vấn, **tuyệt đối không kết tội vi phạm** khi chưa có thẩm định của con người; mỗi nhà cung cấp (vendor) chỉ duy trì duy nhất một finding mở để chống trùng lặp dữ liệu.

```text
Topology UF-12:
01 (Dashboard) → 02 (Bản đồ nguồn) → Nạp nguồn: 03 (Finance) / 04 (IdP) / 05 (Collector)
→ 06 (Pipeline chuẩn hóa)
   ├─ Tự động exact/regex → 07
   └─ Fuzzy/AI → 08 (Bắt buộc IT xác nhận)
→ 09 (Đối chiếu Catalog)
   ├─ Đã có trong catalog → 10 (Gắn ứng dụng, kết thúc)
   └─ Chưa có trong catalog → 11 (Chống trùng finding) → 12 (Hàng đợi Finding)
→ 13 (Chi tiết bằng chứng) → 14 (Hỏi bối cảnh Quản lý) → 15 (Quyết định của IT)
     ├─ Kết cục 1: Báo nhầm → 16 (Đóng finding)
     ├─ Kết cục 2: Hợp thức hóa → 17 (Form Catalog) → 18 (Tạo Request chính thức)
     └─ Kết cục 3: Chưa duyệt → 19 (Bàn giao UF-08 thu hồi)
→ 20 (Sổ nhật ký kiểm toán Discovery)
```

---

### Frame 01 · Dashboard Discovery (Shadow IT Discovery Dashboard)
- **Ý nghĩa của màn hình:** Trung tâm giám sát và phát hiện phần mềm ngoài danh mục quản trị của doanh nghiệp.
- **Mục đích của màn hình:** Cho IT Admin và Finance cái nhìn tổng quan về tình hình sử dụng SaaS tự phát, số lượng finding đang mở theo từng cấp độ rủi ro (Risk Tier) mà không gán nhãn quy chụp vi phạm.
- **Thao tác người dùng (IT Admin / Finance):**
  - Quan sát 3 khối trạng thái nạp dữ liệu từ 3 nguồn: Tài chính (Sao kê thẻ tín dụng), Định danh (IdP Enterprise Apps), và Bộ thu thập (Browser Extension).
  - Xem số lượng finding đang mở: `6 findings` (phân theo Tier 1 - Rủi ro cao, Tier 2 - Trung bình, Tier 3 - Thấp).
  - Xem ước tính chi tiêu ngoài danh mục: `~15.400.000 đ/tháng`.
  - Chọn nút: **“Xem bản đồ năng lực nguồn bằng chứng”** hoặc chọn nạp dữ liệu nguồn mới.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Tổng hợp dữ liệu từ bảng `discovery_findings` đang ở trạng thái `OPEN`.
  - Áp dụng nguyên tắc tôn trọng dữ liệu: Sử dụng thuật ngữ trung tính *“Phát hiện ngoài danh mục”* thay vì *“Vi phạm an ninh”*.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Dữ liệu tổng hợp từ các đợt quét discovery.
  - *Đầu ra / Bước tiếp:* Chọn xem nguồn → Chuyển sang **Frame 02**; chọn nạp nguồn cụ thể → **Frame 03/04/05**.

---

### Frame 02 · Bản đồ nguồn bằng chứng (Evidence Source Capability Map)
- **Ý nghĩa của màn hình:** Bảng giải thích chi tiết năng lực chứng minh và giới hạn pháp lý/kỹ thuật của từng loại nguồn dữ liệu.
- **Mục đích của màn hình:** Giúp người vận hành hiểu rõ mỗi nguồn chứng minh được điều gì và không thể chứng minh điều gì, tránh việc ngộ nhận hoặc lạm dụng dữ liệu thu thập.
- **Thao tác người dùng (IT Admin):**
  - Rà soát đặc tính của 3 nguồn bằng chứng:
    1. **Finance (Sao kê/Hóa đơn):** Chứng minh được có chi tiền và mức độ cam kết tài chính; không chứng minh được ai đang dùng hàng ngày.
    2. **IdP (Single Sign-On / Enterprise Apps):** Chứng minh được có cấp quyền tài khoản; không chứng minh được chi phí thực tế.
    3. **Bộ thu thập (Collector):** Chứng minh được có mở ứng dụng trên máy công ty; **hoàn toàn mù với domain ngoài allowlist, không lưu URL path, không ghi lại nội dung**.
  - Chọn một nguồn để thực hiện intake mẫu: Chọn **“Finance Intake”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Công khai các giới hạn bảo mật và quyền riêng tư theo tiêu chuẩn thiết kế minh bạch.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Ma trận chính sách thu thập dữ liệu.
  - *Đầu ra / Bước tiếp:* Chuyển sang nạp nguồn sao kê tại **Frame 03**.

---

### Frame 03 · Nhập nguồn sao kê tài chính (Finance Intake - Statement/Invoice)
- **Ý nghĩa của màn hình:** Giao diện nạp dữ liệu hóa đơn, bảng kê chi tiêu thẻ tín dụng công ty từ bộ phận Tài chính.
- **Mục đích của màn hình:** Đưa bằng chứng chi tiêu thực tế vào hệ thống để phát hiện các khoản thanh toán định kỳ cho các nhà cung cấp SaaS chưa ký hợp đồng doanh nghiệp.
- **Thao tác người dùng (Finance / IT Admin):**
  - Tải lên tệp sao kê ngân hàng: `CreditCard_Statement_Sep2026.xlsx`.
  - Xem trước dòng dữ liệu thô (Raw Value): `PAYPAL *CANVA PRO 0926 - 13.99 USD`.
  - Nhấn nút: **“Xác nhận nạp bằng chứng tài chính”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Bảo toàn giá trị thô gốc trong trường `raw_evidence_value`.
  - Khởi tạo mã định danh bằng chứng duy nhất: `EVD-FIN-8891`.
  - Đẩy bản ghi vào đường ống chuẩn hóa (Normalization Pipeline).
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Tệp sao kê tài chính từ máy tính.
  - *Đầu ra / Bước tiếp:* Nạp thành công → Đưa vào pipeline xử lý tại **Frame 06**.

---

### Frame 04 · Nhập nguồn định danh IdP (IdP Intake - Enterprise Apps)
- **Ý nghĩa của màn hình:** Giao diện nhập dữ liệu từ hệ thống quản lý danh tính doanh nghiệp (Microsoft Entra ID / Google Workspace SAML).
- **Mục đích của màn hình:** Phát hiện các ứng dụng đám mây mà người dùng tự tích hợp đăng nhập bằng tài khoản công ty (Social Login / OAuth App) mà chưa báo cáo IT.
- **Thao tác người dùng (IT Admin):**
  - Đồng bộ hoặc tải lên tệp xuất Enterprise Applications: `IdP_App_Consent_Report.csv`.
  - Xem dòng dữ liệu thô: `App: "Canva Design Tool", ClientID: "canva-oauth-981", User: "le.thu.ha@company.com"`.
  - Nhấn nút: **“Nạp bằng chứng IdP”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Khởi tạo mã bằng chứng định danh: `EVD-IDP-4420`.
  - Chuẩn hóa thông tin định danh người dùng theo email doanh nghiệp.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Tệp xuất dữ liệu IdP.
  - *Đầu ra / Bước tiếp:* Đưa vào pipeline chuẩn hóa tại **Frame 06**.

---

### Frame 05 · Nhập nguồn bộ thu thập thiết bị (Collector Intake - Browser Extension)
- **Ý nghĩa của màn hình:** Giao diện tiếp nhận các gói dữ liệu tổng hợp hàng ngày được gửi về từ tiện ích trình duyệt trên các máy trạm đã xác nhận theo dõi.
- **Mục đích của màn hình:** Bổ sung bằng chứng về tần suất truy cập thực tế của nhân viên trên các trang web công cụ trực tuyến.
- **Thao tác người dùng (IT Admin):**
  - Xem gói dữ liệu nạp định kỳ từ Extension Gateway: Batch `EVD-COL-1728`.
  - Quan sát cấu trúc dữ liệu đã được lọc sạch: Chỉ gồm `domain = "canva.com"`, `date = "16/09/2026"`, `active_minutes = 45`, `user_count = 7`.
  - Xác nhận tính tuân thủ: Hoàn toàn không có URL đầy đủ, không có tham số tìm kiếm, không có tiêu đề trang.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Kiểm tra chữ ký gateway: Xác thực gói dữ liệu xuất phát từ thiết bị hợp lệ đã qua xác nhận của nhân viên trong `UF-16`.
  - Lọc bỏ ngay lập tức nếu payload chứa bất kỳ trường dữ liệu lạ nào vi phạm quyền riêng tư.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Batch dữ liệu tổng hợp từ Extension Gateway.
  - *Đầu ra / Bước tiếp:* Gói dữ liệu hợp lệ → Đưa vào pipeline chuẩn hóa tại **Frame 06**.

---

### Frame 06 · Pipeline chuẩn hóa bằng chứng (Normalization & Dictionary Pipeline)
- **Ý nghĩa của màn hình:** Sơ đồ quy trình kỹ thuật thể hiện các chặng chuyển đổi từ chuỗi dữ liệu thô thành thông tin nhà cung cấp có cấu trúc.
- **Mục đích của màn hình:** Đảm bảo khả năng giải trình (explainability) của hệ thống: Cho phép IT Admin xem lại chính xác thuật toán nào đã phân tích chuỗi văn bản của ngân hàng thành tên phần mềm cụ thể.
- **Thao tác người dùng (IT Admin):**
  - Quan sát 4 chặng chuyển đổi trực quan:
    1. `Raw Evidence`: Chuỗi thô ban đầu từ file nạp.
    2. `Cleaned Text`: Bỏ ký tự đặc biệt, chuẩn hóa chữ hoa/thường.
    3. `Vendor Dictionary Match`: So khớp với Từ điển nhà cung cấp toàn cầu.
    4. `Catalog Comparison`: Đối chiếu với Danh mục phần mềm nội bộ.
  - Nhấp vào chặng so khớp từ điển để xem chi tiết phương pháp.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Tách luồng xử lý: Nếu khớp dạng Exact/Regex rõ ràng → tự động ánh xạ (Frame 07); nếu khớp dạng mờ Fuzzy/AI → bắt buộc đưa ra hàng chờ IT xác nhận (Frame 08).
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Các bản ghi bằng chứng thô `EVD-FIN`, `EVD-IDP`, `EVD-COL`.
  - *Đầu ra / Bước tiếp:* Chuyển sang so khớp tự động tại **Frame 07** hoặc gợi ý xác nhận tại **Frame 08**.

---

### Frame 07 · Khớp từ điển tự động (Exact/Regex Automated Dictionary Match)
- **Ý nghĩa của màn hình:** Giao diện thể hiện các quy tắc ánh xạ tự động có độ tin cậy tuyệt đối.
- **Mục đích của màn hình:** Xử lý tự động và nhanh chóng các chuỗi thanh toán phổ biến đã được định nghĩa mẫu biểu thức chính quy (Regex Pattern) mà không làm tốn công sức của IT Admin.
- **Thao tác người dùng (IT Admin):**
  - Xem kết quả nhận diện mẫu:
    - Chuỗi thô: `PAYPAL *CANVA PRO 0926`.
    - Biểu thức khớp: `^PAYPAL\s*\*CANVA.*$`.
    - Nhà cung cấp nhận diện: `Canva Pty Ltd` (Ứng dụng: Canva).
    - Độ tin cậy: `100% (Exact Regex Match)`.
  - Bấm nút: **“Tiếp tục đối chiếu Catalog”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Ghi nhận phương thức ánh xạ: `match_method = "EXACT_REGEX"`.
  - Lưu trữ dấu vết nhận diện vào bảng bằng chứng đã chuẩn hóa.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Bản ghi `EVD-FIN-8891`.
  - *Đầu ra / Bước tiếp:* Chuyển sang bước so khớp với Danh mục nội bộ tại **Frame 09**.

---

### Frame 08 · Gợi ý vendor cần IT xác nhận (Fuzzy/AI Match - IT Confirmation Required)
- **Ý nghĩa của màn hình:** Màn hình kiểm duyệt các trường hợp nhận diện chuỗi văn bản có độ tương đồng mờ hoặc do mô hình trí tuệ nhân tạo gợi ý.
- **Mục đích của màn hình:** Ngăn chặn tuyệt đối việc tự động gán nhầm nhà cung cấp khi độ tin cậy không đạt tuyệt đối, bắt buộc người thật phải bấm xác nhận.
- **Thao tác người dùng (IT Admin):**
  - Xem gợi ý nhận diện:
    - Chuỗi thô: `CNV-DSGN-SUB-SYDNEY`.
    - AI gợi ý: `Canva` (Độ tin cậy: `78%`).
    - Các ứng cử viên khác: `Canvas LMS (12%)`, `Cnova (5%)`.
  - IT Admin xem xét bối cảnh và bấm: **“Xác nhận đúng là Canva”** (hoặc chọn nhà cung cấp khác từ dropdown).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Khóa không cho phép hệ thống tự động sinh finding nếu người dùng chưa bấm xác nhận.
  - Ghi nhận danh tính người xác nhận: `confirmed_by = it-admin@company.com`, `method = "HUMAN_CONFIRMED_FUZZY"`.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Chuỗi văn bản mơ hồ cần con người thẩm định.
  - *Đầu ra / Bước tiếp:* Sau khi xác nhận đúng vendor → Chuyển sang **Frame 09**.

---

### Frame 09 · Đối chiếu với SaaS Catalog (Catalog Cross-Reference Check)
- **Ý nghĩa của màn hình:** Màn hình kiểm tra xem nhà cung cấp vừa nhận diện đã tồn tại trong Danh mục phần mềm chính thức (SaaS Catalog) của tổ chức hay chưa.
- **Mục đích của màn hình:** Xác định ngã rẽ nghiệp vụ: Nếu phần mềm đã có hợp đồng và nằm trong danh mục thì chỉ gắn bằng chứng vào ứng dụng đó; nếu chưa có thì chính thức tạo một Finding ngoài danh mục.
- **Thao tác người dùng (IT Admin):**
  - Quan sát kết quả đối chiếu tự động:
    - Nhà cung cấp: `Canva Pty Ltd`.
    - Trạng thái trong SaaS Catalog: **Chưa có (Not in Catalog)**.
  - Nhấn nút: **“Tiếp tục kiểm tra trùng lặp finding”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Quét bảng `saas_catalog` tìm kiếm theo `vendor_id`.
  - Nếu tìm thấy (Cataloged) → Chuyển sang Frame 10 (kết thúc không tạo finding).
  - Nếu không tìm thấy (Uncataloged) → Kích hoạt cơ chế chống trùng lặp tại Frame 11.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Vendor Canva đã chuẩn hóa và dữ liệu bảng SaaS Catalog.
  - *Đầu ra / Bước tiếp:* Vendor chưa có trong catalog → Chuyển sang **Frame 11**.

---

### Frame 10 · Vendor đã có trong catalog (Vendor Already Cataloged - Link & Close)
- **Ý nghĩa của màn hình:** Màn hình thể hiện tình huống kết thúc bình thường khi bằng chứng phát hiện thuộc về một phần mềm đã được công ty mua và quản lý từ trước (ví dụ: phát hiện chi tiêu Microsoft 365).
- **Mục đích của màn hình:** Đóng quy trình một cách an toàn mà không sinh ra các cảnh báo Shadow IT giả, liên kết bằng chứng vừa nạp vào hồ sơ ứng dụng đã có để phục vụ đối soát tài chính.
- **Thao tác người dùng (IT Admin):**
  - Xem thông báo: *“Ứng dụng Microsoft 365 đã tồn tại trong SaaS Catalog (Mã CAT-M365-01). Bằng chứng chi tiêu đã được chuyển giao tự động sang phân hệ Đối soát hóa đơn (UF-14).”*
  - Bấm nút đóng màn hình hoặc xem ứng dụng trong danh mục.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Cập nhật liên kết bằng chứng vào bảng `subscription_invoices`.
  - Không tạo bất kỳ finding nào trong bảng `discovery_findings`.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Bằng chứng thuộc về vendor đã có trong danh mục.
  - *Đầu ra / Bước tiếp:* Kết thúc nhánh xử lý; không phát sinh finding ngoài danh mục.

---

### Frame 11 · Chống trùng lặp finding (Finding Deduplication Engine)
- **Ý nghĩa của màn hình:** Cơ chế gom cụm bằng chứng thông minh (Finding Deduplication).
- **Mục đích của màn hình:** Thực thi nguyên tắc cốt lõi: *Mỗi nhà cung cấp ngoài danh mục chỉ duy trì duy nhất một finding đang mở*. Tránh tình trạng mỗi lần nạp sao kê hay quét extension lại sinh ra một dòng finding mới gây rác hàng đợi.
- **Thao tác người dùng (IT Admin):**
  - Xem thông báo phân tích:
    - Hệ thống phát hiện đã có finding `FND-2026-045` (Canva) đang ở trạng thái `OPEN`.
    - Hành động: Thay vì tạo finding mới, hệ thống tự động gộp bằng chứng sao kê mới `EVD-FIN-8891` vào chuỗi bằng chứng của `FND-2026-045`.
  - Nhấn nút: **“Mở Hàng đợi finding để xử lý”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Cập nhật trường `last_seen_date = 16/09/2026`.
  - Tăng bộ đếm bằng chứng liên kết (`evidence_count = 3`, gồm 1 Finance, 1 IdP, 1 Collector).
  - Cập nhật số người dùng liên quan ước tính lên `7 người`.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Bằng chứng mới và finding Canva đang mở.
  - *Đầu ra / Bước tiếp:* Chuyển sang danh sách hàng đợi tại **Frame 12**.

---

### Frame 12 · Hàng đợi finding ngoài danh mục (Shadow IT Findings Queue)
- **Ý nghĩa của màn hình:** Bảng danh sách quản lý tất cả các phát hiện phần mềm ngoài danh mục đang chờ IT Admin xử lý.
- **Mục đích của màn hình:** Cho phép IT Admin lọc, sắp xếp theo mức độ rủi ro, phòng ban liên quan và chọn hồ sơ ưu tiên xử lý.
- **Thao tác người dùng (IT Admin):**
  - Sử dụng bộ lọc: Lọc theo Cấp độ rủi ro (Risk Tier), theo Trạng thái (Mới phát hiện / Đang chờ bối cảnh / Sẵn sàng quyết định).
  - Chọn finding tiêu biểu: `FND-2026-045` — Ứng dụng: **Canva** (Pty Ltd) · Rủi ro: Tier 2 · 7 người dùng · Chi tiêu ước tính: 350.000 đ/tháng.
  - Nhấn nút: **“Xem chi tiết chuỗi bằng chứng”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Hiển thị danh sách finding đã được dedupe sạch sẽ.
  - Áp dụng thang điểm rủi ro: Cân nhắc dựa trên quyền truy cập dữ liệu, số người dùng và chi phí phát sinh.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Danh sách các finding mở từ cơ sở dữ liệu.
  - *Đầu ra / Bước tiếp:* Chọn finding Canva → Chuyển sang **Frame 13**.

---

### Frame 13 · Chi tiết finding và chuỗi bằng chứng (Finding Details & Immutable Evidence Chain)
- **Ý nghĩa của màn hình:** Hồ sơ bệnh án kỹ thuật chi tiết của một phát hiện phần mềm ngoài danh mục.
- **Mục đích của màn hình:** Cung cấp đầy đủ chuỗi bằng chứng đa nguồn bất biến (Immutable Evidence Chain) để IT Admin có đầy đủ cơ sở thực tế trước khi đưa ra quyết định hoặc liên hệ phòng ban.
- **Thao tác người dùng (IT Admin):**
  - Rà soát 3 mắt xích bằng chứng đính kèm:
    1. *Bằng chứng Tài chính:* Hóa đơn PayPal 13.99 USD thanh toán bằng thẻ công ty do Lê Thu Hà đứng tên.
    2. *Bằng chứng IdP:* Ứng dụng Canva Design Tool được cấp quyền OAuth đăng nhập qua email công ty.
    3. *Bằng chứng Collector:* 7 máy trạm phòng Marketing có truy cập `canva.com` trung bình 45 phút/ngày.
  - Xem danh sách 7 nhân sự liên quan trong nhóm Marketing.
  - Nhận thấy chưa rõ mục đích công việc cụ thể, bấm nút: **“Yêu cầu cung cấp bối cảnh từ Quản lý”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Khóa không cho phép ra quyết định vội vàng khi thiếu thông tin nghiệp vụ từ người dùng.
  - Lưu trữ liên kết chuỗi bằng chứng không thể chỉnh sửa.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Hồ sơ finding `FND-2026-045`.
  - *Đầu ra / Bước tiếp:* Bấm yêu cầu bối cảnh → Chuyển sang **Frame 14**.

---

### Frame 14 · Thu thập bối cảnh từ Manager/Owner (Manager Context Request)
- **Ý nghĩa của màn hình:** Kênh đối thoại nội bộ có cấu trúc giữa IT Admin và Quản lý phòng ban liên quan.
- **Mục đích của màn hình:** Thu thập lý do nghiệp vụ thực tế (Business Justification) từ phía người sử dụng, đồng thời giới hạn phạm vi hiển thị thông tin để đảm bảo quyền riêng tư của nhân viên.
- **Thao tác người dùng (IT Admin / Manager):**
  - IT Admin gửi biểu mẫu câu hỏi tới Quản lý Marketing: Lê Thu Hà.
  - Phía Quản lý Lê Thu Hà nhận biểu mẫu trên cổng tự phục vụ và trả lời:
    *“Nhóm Marketing cần Canva để thiết kế nhanh các ấn phẩm mạng xã hội cho chiến dịch Thu-Đông 2026. Công cụ Photoshop hiện tại quá phức tạp cho các bạn content creator.”*
  - Quản lý đề xuất: Mong muốn công ty xem xét mua gói Canva for Teams chính thức.
  - IT Admin đọc câu trả lời và nhấn: **“Tiến hành ra quyết định xử lý”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Quản lý chỉ được nhìn thấy thông tin của nhân sự trực thuộc phòng ban mình, không thấy dữ liệu của phòng ban khác.
  - Gắn câu trả lời của Quản lý vào hồ sơ finding làm tài liệu kiểm toán.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Biểu mẫu câu hỏi của IT và câu trả lời của Quản lý.
  - *Đầu ra / Bước tiếp:* Đã đủ căn cứ nghiệp vụ → Chuyển sang bảng quyết định tại **Frame 15**.

---

### Frame 15 · Quyết định của IT Admin (IT Admin Tri-decision Panel)
- **Ý nghĩa của màn hình:** Ngã ba quyết định (Tri-decision point) của quy trình xử lý Shadow IT.
- **Mục đích của màn hình:** Cung cấp 3 lối thoát dứt điểm cho một finding ngoài danh mục theo đúng chuẩn quản trị công nghệ thông tin:
  1. **Báo nhầm (False Positive):** Phát hiện không chính xác hoặc không phải SaaS.
  2. **Đã duyệt / Hợp thức hóa (Approved / Regularize):** Công nhận nhu cầu chính đáng, đưa vào danh mục và tạo quy trình mua sắm chính thức.
  3. **Chưa duyệt / Chặn (Unapproved):** Không chấp thuận do rủi ro bảo mật hoặc đã có công cụ tương đương → Thu hồi tài khoản.
- **Thao tác người dùng (IT Admin):**
  - Xem tóm tắt toàn bộ hồ sơ: Bằng chứng 3 nguồn + Bối cảnh Quản lý giải trình.
  - Chọn một trong 3 nút hành động lớn:
    - Nút 1: **“Đánh dấu Báo nhầm”** (Walkthrough kết cục 1 → Frame 16).
    - Nút 2: **“Chấp thuận & Hợp thức hóa vào danh mục”** (Walkthrough kết cục 2 → Frame 17).
    - Nút 3: **“Không duyệt & Bàn giao thu hồi”** (Walkthrough kết cục 3 → Frame 19).
  - Chọn phương án Hợp thức hóa (phương án phổ biến nhất khi nhu cầu hợp lệ).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Bắt buộc người dùng phải chọn 1 trong 3 phương án, không có trạng thái lơ lửng.
  - Ghi nhận danh tính người ra quyết định: `decided_by = it-admin@company.com`.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Hồ sơ finding đầy đủ bằng chứng và bối cảnh.
  - *Đầu ra / Bước tiếp:* Tùy chọn nút: Báo nhầm → **Frame 16**; Hợp thức hóa → **Frame 17**; Chưa duyệt → **Frame 19**.

---

### Frame 16 · Kết cục 1 · Đóng do Báo nhầm (Outcome 1: False Positive Closed)
- **Ý nghĩa của màn hình:** Màn hình ghi nhận việc đóng finding khi xác định đây không phải là phần mềm doanh nghiệp trái phép (ví dụ: trang tin tức, cổng thanh toán cá nhân nhầm lẫn).
- **Mục đích của màn hình:** Đóng finding một cách minh bạch, lưu trữ lý do đóng nhưng vẫn giữ nguyên cơ chế mở lại tự động (Auto Reopen) nếu trong tương lai xuất hiện bằng chứng mới có giá trị chi tiêu lớn hơn.
- **Thao tác người dùng (IT Admin):**
  - Xem thông báo: Finding đã được đóng dưới trạng thái `Đóng - Báo nhầm` (Closed - False Positive).
  - Đọc quy tắc lưu trữ: Bằng chứng cũ vẫn được lưu trong kho lưu trữ, không bị xóa để phục vụ giải trình.
  - Bấm nút quay lại Hàng đợi Discovery.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Chuyển trạng thái `FND-2026-045` sang `CLOSED_FALSE_POSITIVE`.
  - Thiết lập cờ `reopen_on_new_evidence = true`.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Quyết định báo nhầm từ Frame 15.
  - *Đầu ra / Bước tiếp:* Kết thúc nhánh Báo nhầm; quay về hàng đợi hoặc xem sổ nhật ký tại Frame 20.

---

### Frame 17 · Form hợp thức hóa vào danh mục (Catalog Regularization Form)
- **Ý nghĩa của màn hình:** Biểu mẫu thu thập thông tin quản trị để chính thức hóa phần mềm ngoài danh mục vào hệ sinh thái SaaS được công ty quản lý.
- **Mục đích của màn hình:** Thu thập đầy đủ các trường quản lý bắt buộc (Business Owner, Gói thuê bao dự kiến, Chính sách bảo mật) trước khi chuyển sang quy trình mua sắm chính thức.
- **Thao tác người dùng (IT Admin):**
  - Điền các trường quản trị cho ứng dụng Canva:
    - Tên ứng dụng chính thức: `Canva for Enterprise`.
    - Chỉ định Business Owner: `Lê Thu Hà (Trưởng nhóm Marketing)`.
    - Cost Center chịu chi phí: `CC-MKT-01`.
    - Gói bản quyền dự kiến: `Team License (7 seats ban đầu)`.
  - Xem danh sách 7 nhân sự hiện tại: Hệ thống tự động điền sẵn để tạo quyền mà không bắt họ phải nộp đơn xin cấp lại từ đầu.
  - Nhấn nút: **“Xác nhận hợp thức hóa & Tạo yêu cầu chính thức”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Kiểm tra tính hợp lệ của các trường quản trị theo chuẩn BRD mục 5.1.
  - Khởi tạo mã danh mục mới: `CAT-CANVA-01`.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Form thông tin hợp thức hóa do IT Admin nhập.
  - *Đầu ra / Bước tiếp:* Nhấn xác nhận → Chuyển sang **Frame 18**.

---

### Frame 18 · Kết cục 2 · Hợp thức hóa thành công (Outcome 2: Successfully Regularized)
- **Ý nghĩa của màn hình:** Màn hình xác nhận việc khép lại vòng đời Shadow IT và đưa phần mềm vào quy trình quản trị dòng chính (mainstream workflow).
- **Mục đích của màn hình:** Thông báo việc tạo thành công mã yêu cầu mua sắm chính thức (`REQ-2026-212`) để đưa qua luồng phê duyệt ngân sách chuẩn, bảo vệ quyền lợi làm việc liên tục cho 7 nhân sự hiện hữu.
- **Thao tác người dùng (IT Admin):**
  - Quan sát kết quả tích hợp:
    - Finding `FND-2026-045` đã chuyển sang trạng thái: **Đã hợp thức hóa (Regularized)**.
    - Đã tạo yêu cầu mua sắm chính thức: `REQ-2026-212` đang chuyển sang luồng duyệt chi `UF-15`.
    - 7 nhân viên hiện tại được bảo lưu quyền tạm thời với nguồn gốc: *“Regularized from Shadow IT Finding”*.
  - Bấm nút: **“Hoàn tất & Mở yêu cầu REQ-2026-212”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Đóng finding `FND-2026-045` với kết quả thành công.
  - Chuyển tiếp hồ sơ mua sắm sang quy trình duyệt ngân sách tiêu chuẩn của công ty.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Thông tin form hợp thức hóa từ Frame 17.
  - *Đầu ra / Bước tiếp:* Kết thúc thành công nhánh Hợp thức hóa; luồng mua sắm tiếp tục tại **UF-15**.

---

### Frame 19 · Kết cục 3 · Chưa duyệt, tạo task thu hồi (Outcome 3: Unapproved - Handoff to UF-08)
- **Ý nghĩa của màn hình:** Màn hình xử lý tình huống IT Admin không chấp thuận phần mềm (ví dụ: ứng dụng vi phạm tiêu chuẩn bảo mật dữ liệu khách hàng hoặc công ty đã có giải pháp thay thế bắt buộc).
- **Mục đích của màn hình:** Thực thi việc chấm dứt sử dụng có kiểm soát: Tuyệt đối không tự ý ngắt quyền đột ngột ngay trên màn hình finding, mà tạo một tác vụ thu hồi chính thống bàn giao sang hàng đợi UF-08, kèm thông báo hướng dẫn người dùng chuyển đổi dữ liệu.
- **Thao tác người dùng (IT Admin):**
  - Xem tóm tắt quyết định: Từ chối cấp phép cho ứng dụng ngoài danh mục.
  - Nhập thông báo hướng dẫn chuyển đổi cho 7 nhân viên: *“Công ty không phê duyệt sử dụng Canva do lo ngại chính sách bảo mật dữ liệu đám mây. Đề nghị các nhân sự chuyển sang sử dụng bộ công cụ Adobe Creative Cloud đã được cấp phép.”*
  - Xem mã tác vụ thu hồi/ngắt quyền được sinh ra: `PV-2074`.
  - Nhấn nút: **“Bàn giao tác vụ sang UF-08 để thực thi”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Chuyển trạng thái finding sang `CLOSED_UNAPPROVED`.
  - Khởi tạo tác vụ `PV-2074` chuyển sang `UF-08` để IT Admin tiến hành ngắt quyền đăng nhập OAuth hoặc thu hồi thẻ thanh toán.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Quyết định không duyệt từ Frame 15.
  - *Đầu ra / Bước tiếp:* Bàn giao sang **UF-08** thực thi thu hồi; finding được đóng có lưu vết.

---

### Frame 20 · Sổ nhật ký và kiểm toán Discovery (Discovery Audit Trail & Resolution History)
- **Ý nghĩa của màn hình:** Sổ nhật ký kiểm toán toàn diện của phân hệ Quản lý phần mềm ngoài danh mục.
- **Mục đích của màn hình:** Phục vụ công tác thanh tra, kiểm toán công nghệ thông tin định kỳ, chứng minh rằng mọi phát hiện Shadow IT đều được xử lý công minh, minh bạch, có sự tham gia của con người và có quyết định lưu vết rõ ràng.
- **Thao tác người dùng (IT Admin / Auditor):**
  - Sử dụng bộ lọc tra cứu lịch sử: Lọc theo thời gian, theo loại kết cục (Báo nhầm, Hợp thức hóa, Không duyệt), theo người ra quyết định.
  - Xem dòng thời gian của các finding mẫu đã xử lý.
  - Bấm xem chi tiết gói bằng chứng gốc bất biến đính kèm từng hồ sơ.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Khóa toàn bộ dữ liệu nhật ký ở chế độ chỉ đọc (Read-only immutable store).
  - Đảm bảo tính toàn vẹn dữ liệu cho các báo cáo tuân thủ an toàn thông tin doanh nghiệp (ISO 27001 / SOC 2).
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Toàn bộ lịch sử xử lý finding trong hệ thống.
  - *Đầu ra / Bước tiếp:* Hoàn tất quy trình kiểm tra và kết thúc `UF-12`.

---

# PHẦN 7. ĐẶC TẢ CHI TIẾT UF-14 · IT ADMIN XỬ LÝ SAI LỆCH VÀ MÂU THUẪN DỮ LIỆU

> **Mục tiêu luồng UF-14:** Bàn làm việc đối soát dữ liệu (Reconciliation Workbench) ba bên: Hệ thống nội bộ (Intended State), Nhà cung cấp SaaS (Observed State), và Hóa đơn tài chính (Financial State). Xử lý dứt điểm các trường hợp lệch số lượng seat, tài khoản ma, tài khoản ngoài quy trình và xác minh hoàn tất các tác vụ đang chờ chấp nhận.  
> **Nguyên tắc bất biến:** Nội bộ là nguồn phản ánh ý định quản trị; Nhà cung cấp là nguồn phản ánh thực tế vận hành; **không bên nào được tự tiện ghi đè bên nào**. Mọi sai lệch (Discrepancy) đều phải được quy về một người chịu trách nhiệm (owner) và có quyết định giải quyết có kiểm toán.

```text
Topology UF-14:
01 (Trung tâm đối soát)
├─ Kênh có Connector:
│  ├─ Task chờ chấp nhận → 02 (Kiểm tra GitHub) → Active thật → 03 (Hoàn tất task PV-2041)
│  ├─ Hệ thống có, NCC không có → 05 (Xem lệch) → 06 (Modal cấp lại) → 07 (Đóng lệch, tạo task UF-08)
│  └─ NCC có, hệ thống không biết → 13 (Phát hiện ngoài luồng) → 14 (Điều tra) → 15 (Quyết định an ninh)
├─ Kênh không có Connector → 04 (Chặn đối soát giả, giải thích giới hạn)
└─ Kênh Hóa đơn tài chính:
   08 (Bàn làm việc hóa đơn) → 09 (Ba con số cạnh nhau) → 10 (Phân định nguyên nhân)
   → 11 (Điều chỉnh nội bộ) → 12 (Đóng đối soát hóa đơn)
→ 16 (Sổ nhật ký đối soát toàn diện)
```

---

### Frame 01 · Trung tâm đối soát dữ liệu (Reconciliation Workbench)
- **Ý nghĩa của màn hình:** Trung tâm điều hành kiểm tra tính khớp đúng dữ liệu định kỳ của IT Admin và chuyên viên Tài chính.
- **Mục đích của màn hình:** Cho người dùng thấy bức tranh tổng hợp các điểm mâu thuẫn dữ liệu giữa hệ thống nội bộ và thế giới bên ngoài, chia thành 3 khu vực rõ rệt để xử lý.
- **Thao tác người dùng (IT Admin / Finance):**
  - Quan sát 4 khối số liệu đối soát:
    - `3 sai lệch thành viên nhà cung cấp` (Member Discrepancies).
    - `1 sai lệch số lượng trên hóa đơn` (Invoice Mismatch).
    - `2 tác vụ đang chờ chấp nhận lời mời` (Pending Acceptance Tasks).
    - Thời điểm chạy phiên đối soát tự động gần nhất: `17/09/2026 06:00 ICT`.
  - Chọn nút: **“Chạy phiên đối soát mới ngay”** hoặc bấm vào một ứng dụng cụ thể để xử lý sai lệch.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Chạy ngầm job so sánh giữa bảng `assignments`, API nhà cung cấp và bảng `invoices`.
  - Phân loại các mâu thuẫn vào các hàng đợi nghiệp vụ tương ứng.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Dữ liệu tổng hợp từ các connector và phân hệ tài chính.
  - *Đầu ra / Bước tiếp:* Chọn đối soát GitHub → sang **Frame 02**; chọn app thủ công Canva → **Frame 04**; chọn lệch thiếu tài khoản Figma → **Frame 05**; chọn đối soát hóa đơn Slack → **Frame 08**; chọn tài khoản ngoài luồng → **Frame 13**.

---

### Frame 02 · Chi tiết đối soát tài khoản GitHub (GitHub Account Reconciliation & Pending Task Match)
- **Ý nghĩa của màn hình:** Màn hình đối soát chuyên sâu cho ứng dụng GitHub Business nhằm ghép nối các tài khoản thành viên mới với các tác vụ đang chờ.
- **Mục đích của màn hình:** Kiểm tra xem thành viên mới xuất hiện trên GitHub có phải là kết quả của tác vụ `PV-2041` (cấp cho Nguyễn Minh An) đã gửi lời mời trước đó tại `UF-08` hay không.
- **Thao tác người dùng (IT Admin):**
  - Quan sát danh sách thành viên GitHub trả về từ API:
    - Tài khoản GitHub username: `nguyen-an-dev`.
    - Trạng thái phía GitHub: Đã chuyển từ `pending` sang `active` (người dùng đã bấm chấp nhận lời mời qua email).
    - Hệ thống tự động nhận diện khớp với tác vụ đang chờ: `PV-2041` · Nhân viên: Nguyễn Minh An · Mã giữ chỗ `ASN-4901`.
  - Nhấn nút: **“Xác nhận khớp đúng & Hoàn tất tác vụ”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - So khớp email nhận lời mời với email tài khoản đăng ký của nhân viên.
  - Phân biệt rõ: Đây không phải là một lỗi sai lệch (discrepancy), mà là sự kiện hoàn tất hợp lệ của một quy trình chờ đối soát.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Danh sách thành viên active từ GitHub API và task `PV-2041` đang pending.
  - *Đầu ra / Bước tiếp:* Bấm xác nhận → Chuyển sang **Frame 03**.

---

### Frame 03 · Hoàn tất task chờ chấp nhận (Complete Pending Provisioning Task PV-2041)
- **Ý nghĩa của màn hình:** Màn hình xác nhận chính thức việc kích hoạt thành công quyền truy cập sau khi đã có bằng chứng người dùng active.
- **Mục đích của màn hình:** Đóng trọn vẹn vòng đời của tác vụ cấp phát `PV-2041` khởi nguồn từ `UF-08`, chuyển trạng thái `Assignment` từ giữ chỗ sang đang hoạt động chính thức.
- **Thao tác người dùng (IT Admin):**
  - Quan sát kết quả cập nhật:
    - Tác vụ `PV-2041` chuyển sang trạng thái: **Hoàn tất (Completed)**.
    - Bằng chứng kiểm toán: Đã gắn chứng từ xác thực `GH-MBR-88219`.
    - Số lượng tác vụ `Chờ chấp nhận` trên workbench giảm từ 2 xuống 1.
  - Bấm nút quay lại trung tâm đối soát.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Đổi trạng thái `PV-2041` sang `COMPLETED`.
  - Đổi trạng thái `ASN-4901` từ `ALLOCATED_PENDING` sang `ACTIVE`.
  - Báo trạng thái hoàn tất về cho luồng yêu cầu ban đầu của nhân viên (`UF-01`).
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Bằng chứng active từ Frame 02.
  - *Đầu ra / Bước tiếp:* Hoàn tất xử lý task chờ; quay lại workbench tại **Frame 01**.

---

### Frame 04 · Ứng dụng không có connector (Unmanaged App Limitation Guard)
- **Ý nghĩa của màn hình:** Màn hình cảnh báo giới hạn đối soát đối với các ứng dụng quản lý thủ công (Manual/Unmanaged Apps).
- **Mục đích của màn hình:** Ngăn chặn việc hệ thống suy đoán sai lầm rằng *“nhà cung cấp thiếu tài khoản”* đối với các ứng dụng không có API connector (như Canva, phần mềm mua key rời).
- **Thao tác người dùng (IT Admin):**
  - Đọc thông báo minh bạch từ hệ thống:
    *“Ứng dụng Canva được cấu hình quản lý thủ công, không có API kết nối nhà cung cấp. Hệ thống không thể tự động kéo danh sách thành viên thực tế để đối soát.”*
  - Xem lịch sử đối soát bằng tay gần nhất: Thực hiện bởi IT Admin ngày 01/09/2026.
  - Bấm nút: **“Tải danh sách phân bổ nội bộ để kiểm tra bằng tay”** hoặc quay lại.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Vô hiệu hóa tính năng so khớp tự động đối với các ứng dụng có cờ `has_connector = false`.
  - Tuyệt đối không sinh các sai lệch giả mạo gây nhiễu cho IT Admin.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Cấu hình ứng dụng Canva trong hệ thống.
  - *Đầu ra / Bước tiếp:* Kết thúc nhánh ứng dụng không connector; quay về **Frame 01**.

---

### Frame 05 · Sai lệch: Hệ thống có, NCC không có (Discrepancy: Internal Active, Provider Missing)
- **Ý nghĩa của màn hình:** Màn hình chi tiết của một mâu thuẫn dữ liệu nghiêm trọng: Hệ thống nội bộ ghi nhận nhân viên có quyền, nhưng kiểm tra thực tế trên nhà cung cấp thì tài khoản không hề tồn tại.
- **Mục đích của màn hình:** Đặt song song hai nguồn dữ liệu để người vận hành nhìn thấy sự sai lệch: Ý định nội bộ (đã duyệt và cấp quyền) và Thực tế nhà cung cấp (tài khoản đã bị xóa ngoài luồng hoặc cấp lỗi).
- **Thao tác người dùng (IT Admin):**
  - Xem chi tiết sai lệch `DISC-2026-081`:
    - Ứng dụng: Figma Professional.
    - Nhân sự: Phạm Minh Hoàng (`NV-0299`).
    - Nguồn nội bộ (SaaS-Sentry): Đang ghi nhận `Assignment` hoạt động từ ngày 15/08/2026 (Mã `ASN-4102`).
    - Nguồn thực tế (Figma API): Trả về `User Not Found` (Hoàn toàn không có tài khoản trên Figma Organization).
  - Nhấn nút: **“Xử lý sai lệch (Resolve Discrepancy)”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Bảo toàn cả hai giá trị dữ liệu, không tự tiện xóa bản ghi nội bộ và không tự tiện sửa dữ liệu nhà cung cấp.
  - Gắn mã sai lệch duy nhất và xác định mức độ ưu tiên cao (High Priority).
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Kết quả job đối soát tự động cho thấy sự vắng mặt của tài khoản trên Figma.
  - *Đầu ra / Bước tiếp:* Nhấn xử lý sai lệch → Mở modal quyết định tại **Frame 06**.

---

### Frame 06 · Quyết định cấp lại hoặc không cấp lại (Re-provision or Dismiss Decision Modal)
- **Ý nghĩa của màn hình:** Modal hộp thoại bắt buộc người thật phải đưa ra phán quyết xử lý đối với sai lệch thiếu tài khoản.
- **Mục đích của màn hình:** Phân định rõ nguyên nhân: Nếu nhân viên vẫn cần dùng mà tài khoản bị lỗi thì tạo lệnh cấp lại; nếu nhân viên đã chuyển bộ phận hoặc không cần nữa thì thu hồi luôn quyền nội bộ.
- **Thao tác người dùng (IT Admin):**
  - Xem xét hai phương án giải quyết:
    - **Phương án A: Tạo tác vụ cấp lại tài khoản (Re-provision):** Tạo một task mới đẩy sang UF-08 để cấp lại tài khoản thật trên Figma.
    - **Phương án B: Xác nhận không cần cấp lại (Dismiss & Revoke):** Hủy bỏ Assignment nội bộ vì nhân viên không còn nhu cầu.
  - Chọn phương án A: “Cấp lại tài khoản”.
  - Nhập lý do bắt buộc: *“Tài khoản bị admin vô tình xóa nhầm trên Figma console, tạo lệnh cấp phát lại để hoàn trả quyền làm việc cho nhân viên”*.
  - Nhấn nút: **“Xác nhận quyết định”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Bắt buộc trường lý do nghiệp vụ.
  - Ghi nhận danh tính IT Admin và thời điểm ra quyết định.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Lựa chọn giải pháp từ form modal.
  - *Đầu ra / Bước tiếp:* Bấm xác nhận → Chuyển sang **Frame 07**.

---

### Frame 07 · Đóng sai lệch tài khoản có quyết định (Close Account Discrepancy with Decision & PV-2065)
- **Ý nghĩa của màn hình:** Màn hình xác nhận việc đóng hồ sơ sai lệch sau khi đã có quyết định xử lý và liên kết tác vụ thực thi.
- **Mục đích của màn hình:** Đóng sai lệch `DISC-2026-081` một cách có căn cứ, tạo ra tác vụ thực thi `PV-2065` đẩy sang hàng đợi UF-08 để giải quyết triệt để vấn đề kỹ thuật.
- **Thao tác người dùng (IT Admin):**
  - Xem thông báo: Sai lệch `DISC-2026-081` đã được đóng với quyết định `Cấp lại tài khoản`.
  - Xem mã tác vụ thực thi vừa sinh ra: `PV-2065` (Cấp quyền Figma Professional cho Phạm Minh Hoàng).
  - Đọc liên kết kiểm toán: Quyết định được lưu với mã `DEC-4401`.
  - Bấm nút: **“Mở UF-08 để theo dõi cấp phát”** hoặc quay lại workbench.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Chuyển trạng thái `DISC-2026-081` sang `RESOLVED_REPROVISION`.
  - Khởi tạo tác vụ `PV-2065` bên `UF-08` kèm ghi chú liên kết nguồn gốc từ sai lệch đối soát.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Quyết định từ Frame 06.
  - *Đầu ra / Bước tiếp:* Bàn giao task sang **UF-08** thực thi; sai lệch được gỡ khỏi danh sách mở.

---

### Frame 08 · Bàn làm việc đối soát hóa đơn (Invoice Reconciliation Workbench)
- **Ý nghĩa của màn hình:** Bàn làm việc đối soát chi phí giữa hóa đơn nhà cung cấp gửi về và cấu hình hợp đồng thuê bao nội bộ.
- **Mục đích của màn hình:** Giúp chuyên viên Tài chính và IT Admin ghép nối hóa đơn thanh toán thực tế với đúng gói phần mềm trong hệ thống trước khi kiểm tra số lượng seat.
- **Thao tác người dùng (Finance / IT Admin):**
  - Chọn hóa đơn cần đối soát: Hóa đơn tháng 09/2026 từ nhà cung cấp Slack Technologies (`INV-2026-09-001`).
  - Kiểm tra thông tin hóa đơn: Tổng tiền thanh toán `825.00 USD`, số lượng ghi trên hóa đơn là `55 seats`.
  - Hệ thống tự động đề xuất gói thuê bao tương ứng: `Slack Business+` (`SUB-SLK-BP-01`).
  - Nhấn nút: **“Bắt đầu so khớp ba con số”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Nhận diện vendor và kỳ thanh toán của hóa đơn.
  - Chuẩn bị dữ liệu từ 3 nguồn: Hóa đơn, Hợp đồng thuê bao nội bộ, và Số lượng người dùng đang hoạt động thực tế.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Bản ghi hóa đơn nhập từ phân hệ tài chính.
  - *Đầu ra / Bước tiếp:* Bắt đầu so khớp → Chuyển sang **Frame 09**.

---

### Frame 09 · Ba con số cạnh nhau (Invoice vs Subscription vs Active Seats Comparison)
- **Ý nghĩa của màn hình:** Màn hình phân tích chênh lệch ba chiều kinh điển trong quản trị phần mềm SaaS (The Three-Number Comparison).
- **Mục đích của màn hình:** Làm rõ sự mâu thuẫn giữa 3 con số mà không được tự ý sửa đổi dữ liệu:
  1. Số lượng tính tiền trên hóa đơn: `55 seats`.
  2. Số lượng khai báo trong hợp đồng nội bộ: `50 seats`.
  3. Số lượng nhân viên thực tế đang sử dụng: `48 seats`.
- **Thao tác người dùng (Finance / IT Admin):**
  - Quan sát 3 cột so sánh trực quan:
    - Chênh lệch Hóa đơn vs Hợp đồng: **Thừa +5 seats** (Phát sinh tăng chi phí 75 USD/tháng ngoài kế hoạch).
    - Chênh lệch Hợp đồng vs Thực dùng: **Dư 2 seats chưa gán**.
  - Nhấn nút: **“Phân định nguyên nhân sai lệch hóa đơn”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Giữ nguyên toàn bộ số liệu của 3 nguồn độc lập.
  - Cảnh báo khoản chi vượt ngân sách cam kết nội bộ.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Dữ liệu 3 nguồn từ Frame 08.
  - *Đầu ra / Bước tiếp:* Nhấn phân định nguyên nhân → Chuyển sang **Frame 10**.

---

### Frame 10 · Phân định nguyên nhân sai lệch hóa đơn (Classify Invoice Discrepancy Root Cause)
- **Ý nghĩa của màn hình:** Màn hình thẩm định và phân loại nguyên nhân cốt lõi gây ra sự chênh lệch hóa đơn.
- **Mục đích của màn hình:** Quy kết sai lệch về đúng 1 trong 3 nhóm nguyên nhân để có biện pháp xử lý phù hợp:
  1. **Mua thêm chưa cập nhật vào hệ thống:** Nhân viên tự nâng cấp gói hoặc IT mua thêm suất nhưng quên sửa số lượng trên SaaS-Sentry.
  2. **Nhà cung cấp tính cước sai:** Nhà cung cấp áp sai đơn giá hoặc tính tiền các tài khoản đã hủy.
  3. **Sai sót dữ liệu nội bộ:** Nhập sai số liệu ban đầu.
- **Thao tác người dùng (Finance / IT Admin):**
  - Xem xét chứng từ kiểm tra: Phòng Kỹ thuật xác nhận đã mua thêm 5 seat Slack vào đầu tháng để phục vụ dự án mới, có phiếu phê duyệt chi tiêu đính kèm.
  - Chọn nguyên nhân: **“Mua thêm hợp lệ nhưng chưa cập nhật dữ liệu nội bộ”**.
  - Đính kèm mã phê duyệt căn cứ: `APV-2026-0901-SLK`.
  - Nhấn nút: **“Tiến hành điều chỉnh hợp đồng nội bộ”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Buộc người dùng phải chọn đúng nguyên nhân có bằng chứng chứng từ đi kèm.
  - Mở quyền điều chỉnh dữ liệu cho phép cập nhật số lượng thuê bao.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Lựa chọn nguyên nhân và chứng từ từ form.
  - *Đầu ra / Bước tiếp:* Chọn điều chỉnh nội bộ → Chuyển sang **Frame 11**.

---

### Frame 11 · Điều chỉnh subscription nội bộ (Adjust Internal Subscription Seats to 55)
- **Ý nghĩa của màn hình:** Biểu mẫu điều chỉnh thông số gói thuê bao phần mềm theo kết quả đối soát thực tế.
- **Mục đích của màn hình:** Cập nhật số lượng seat của gói Slack Business+ từ `50` lên `55` seats để khớp với thực tế thanh toán, đồng thời bảo toàn toàn bộ lịch sử thay đổi phiên bản cũ.
- **Thao tác người dùng (Finance / IT Admin):**
  - Nhập số lượng mới: Sửa từ `50` thành `55` seats.
  - Xem hạn mức ngân sách mới: Tự động tính lại thành `825.00 USD/tháng`.
  - Nhập lý do điều chỉnh: *“Cập nhật 5 seat mua thêm theo phê duyệt APV-2026-0901-SLK đã đối soát khớp với hóa đơn tháng 09”*.
  - Nhấn nút: **“Lưu phiên bản hợp đồng mới & Đối soát lại”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Không ghi đè bản ghi cũ; tạo một phiên bản hợp đồng mới (`Version 2`) với thời điểm hiệu lực từ 01/09/2026.
  - Ghi nhận Audit Log: Người sửa, giá trị cũ (50), giá trị mới (55).
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Số lượng mới và lý do điều chỉnh.
  - *Đầu ra / Bước tiếp:* Lưu thành công → Chuyển sang đóng đối soát tại **Frame 12**.

---

### Frame 12 · Đóng đối soát hóa đơn (Close Invoice Reconciliation)
- **Ý nghĩa của màn hình:** Màn hình xác nhận việc đối soát hóa đơn đã hoàn tất trọn vẹn và số liệu đã đạt trạng thái cân bằng.
- **Mục đích của màn hình:** Chuyển trạng thái hóa đơn sang đã đối soát khớp (Reconciled), cập nhật sổ cái chi phí thực tế và xóa bỏ cảnh báo sai lệch trên bảng điều khiển.
- **Thao tác người dùng (Finance):**
  - Quan sát kết quả so khớp lại:
    - Số lượng trên hóa đơn: `55 seats`.
    - Số lượng trên hợp đồng nội bộ: `55 seats`.
    - Độ lệch: **0 seats (Hoàn toàn khớp đúng)**.
  - Trạng thái hóa đơn chuyển sang xanh lá: `Đã đối soát (Reconciled)`.
  - Bấm nút: **“Hoàn tất & Lưu trữ hồ sơ đối soát”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Chuyển trạng thái hóa đơn `INV-2026-09-001` sang `RECONCILED`.
  - Giảm bộ đếm sai lệch hóa đơn trên dashboard từ 1 về 0.
  - Cập nhật số liệu chi phí thực tế vào báo cáo tài chính của phân hệ `UF-11`.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Dữ liệu hợp đồng đã sửa và hóa đơn tháng 09.
  - *Đầu ra / Bước tiếp:* Đóng thành công; quay về trung tâm đối soát hoặc xem sổ nhật ký tại **Frame 16**.

---

### Frame 13 · Phát hiện tài khoản ngoài luồng (Unmapped Provider Account Detected)
- **Ý nghĩa của màn hình:** Màn hình cảnh báo an ninh khi phát hiện một tài khoản có quyền truy cập thực tế phía nhà cung cấp nhưng hệ thống nội bộ hoàn toàn không có thông tin quản lý (Shadow Access / Rogue Account).
- **Mục đích của màn hình:** Phát hiện sớm các rủi ro rò rỉ dữ liệu do việc tự ý cấp quyền trực tiếp trên console nhà cung cấp mà không thông qua quy trình phê duyệt của công ty.
- **Thao tác người dùng (IT Admin):**
  - Xem thông tin tài khoản lạ được phát hiện từ GitHub API:
    - Username: `temp-dev-outsider`.
    - Quyền hạn: `Owner / Admin` trên tổ chức GitHub của công ty.
    - Thời điểm tạo: 3 ngày trước.
    - Cảnh báo: **Không có bất kỳ Assignment nào gắn với tài khoản này**.
  - Nhấn nút: **“Tiến hành điều tra an ninh (Investigate)”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Đánh dấu mức độ nghiêm trọng: Rất cao (Critical Security Alert).
  - Không tự ý xóa ngay tài khoản khi chưa điều tra nguồn gốc người tạo.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Dữ liệu quét từ GitHub API phát hiện user lạ.
  - *Đầu ra / Bước tiếp:* Bấm điều tra → Chuyển sang **Frame 14**.

---

### Frame 14 · Điều tra tài khoản ngoài quy trình (Investigate Rogue/Unmanaged Account)
- **Ý nghĩa của màn hình:** Giao diện điều tra nguồn gốc và lịch sử thao tác của tài khoản ngoài quy trình.
- **Mục đích của màn hình:** Xác định ai là người đã mời tài khoản này vào hệ thống và tài khoản này đã truy cập vào những tài nguyên nào, từ đó lựa chọn phương án xử lý hợp lý.
- **Thao tác người dùng (IT Admin / Security):**
  - Rà soát nhật ký kiểm toán từ nhà cung cấp (GitHub Audit Log):
    - Người gửi lời mời: Nguyễn Văn Bách (`NV-0188` - Tech Lead dự án Fintech).
    - Mục đích trao đổi: Thuê chuyên gia tư vấn bảo mật bên ngoài rà soát lỗ hổng hợp đồng thông minh trong 3 ngày.
    - Tài nguyên đã truy cập: 2 repository private.
  - Nhận thấy công việc có tính chất dự án nhưng làm sai quy trình cấp quyền chính thức.
  - Nhấn nút: **“Đưa ra phán quyết an ninh”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Tổng hợp hồ sơ bằng chứng điều tra.
  - Chuẩn bị 2 phương án: Thu hồi khẩn cấp hoặc Chuyển sang hợp thức hóa có kiểm soát qua `UF-12`.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Dữ liệu audit log nhà cung cấp và giải trình của Tech Lead.
  - *Đầu ra / Bước tiếp:* Chuyển sang bảng xác nhận quyết định tại **Frame 15**.

---

### Frame 15 · Xác nhận quyết định an ninh (Confirm Security Decision: Revoke or Regularize)
- **Ý nghĩa của màn hình:** Hộp thoại phán quyết xử lý đối với tài khoản ngoài quy trình.
- **Mục đích của màn hình:** Buộc cán bộ An ninh/IT Admin đưa ra quyết định xử lý và lưu vết trách nhiệm:
  - Nếu là nguy cơ xâm nhập: Thu hồi ngay lập tức qua `UF-08`.
  - Nếu là đối tác hợp lệ làm sai quy trình: Yêu cầu chuyển giao sang `UF-12` để tạo hồ sơ hợp thức hóa và ký cam kết bảo mật (NDA).
- **Thao tác người dùng (IT Admin / Security):**
  - Chọn phương án: **“Thu hồi khẩn cấp tài khoản ngoài quy trình”** (Do chuyên gia đã xong việc nhưng chưa xóa quyền Admin).
  - Nhập kết luận điều tra: *“Công việc rà soát đã kết thúc ngày 16/09, tiến hành thu hồi khẩn cấp quyền truy cập GitHub để bảo đảm an toàn thông tin”*.
  - Nhấn nút: **“Tạo lệnh thu hồi khẩn cấp”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Khởi tạo tác vụ thu hồi khẩn cấp chuyển sang `UF-08`.
  - Đóng hồ sơ điều tra với kết luận vi phạm quy trình cấp quyền và gửi email nhắc nhở Tech Lead.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Quyết định và kết luận từ cán bộ an ninh.
  - *Đầu ra / Bước tiếp:* Tạo task sang **UF-08** thu hồi; chuyển sang sổ nhật ký tại **Frame 16**.

---

### Frame 16 · Sổ nhật ký đối soát toàn diện (Comprehensive Reconciliation Audit Ledger)
- **Ý nghĩa của màn hình:** Báo cáo nhật ký lưu trữ toàn bộ lịch sử các phiên đối soát và quyết định giải quyết mâu thuẫn dữ liệu.
- **Mục đích của màn hình:** Chứng minh với các đoàn kiểm toán độc lập rằng: Doanh nghiệp có quy trình kiểm soát chặt chẽ đối với mọi sai lệch về tài khoản, số lượng và chi phí; không có bất kỳ mâu thuẫn nào bị bỏ qua hoặc bị xóa dấu vết.
- **Thao tác người dùng (IT Admin / Auditor):**
  - Xem bảng nhật ký chi tiết các vụ việc đã xử lý:
    - Vụ việc hoàn tất task GitHub `PV-2041`.
    - Vụ việc xử lý sai lệch thiếu tài khoản Figma `DISC-2026-081`.
    - Vụ việc điều chỉnh hợp đồng hóa đơn Slack `INV-2026-09-001`.
    - Vụ việc thu hồi tài khoản ngoài quy trình `temp-dev-outsider`.
  - Lọc và xuất báo cáo đối soát định kỳ.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Lưu trữ bất biến toàn bộ các quyết định (`DEC-xxxx`), liên kết tác vụ (`PV-xxxx`) và mã bằng chứng.
  - Phân định rạch ròi giữa việc xác nhận task pending hợp lệ và việc xử lý sai lệch có can thiệp của con người.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Cơ sở dữ liệu nhật ký đối soát.
  - *Đầu ra / Bước tiếp:* Hoàn tất quy trình đối soát của `UF-14`.

---

# PHẦN 8. ĐẶC TẢ CHI TIẾT UF-16 · IT ADMIN TRIỂN KHAI BỘ THU THẬP, NHÂN VIÊN XÁC NHẬN THEO DÕI

> **Mục tiêu luồng UF-16:** Thiết lập cơ chế thu thập dữ liệu sử dụng phần mềm tối thiểu thông qua tiện ích trình duyệt (Browser Extension) trên các thiết bị máy trạm công ty. Đảm bảo triệt để các nguyên tắc thiết kế về quyền riêng tư (Privacy by Design): Chỉ thu thập khi thiết bị đã được đăng ký, chỉ gửi dữ liệu sau khi nhân viên đã chủ động đọc và tick xác nhận thông báo minh bạch, và thực hiện lọc bỏ dữ liệu nhạy cảm ngay tại máy trạm trước khi gửi lên máy chủ.  
> **Nguyên tắc bất biến:** Các biện pháp thông báo và xác nhận là **ràng buộc thiết kế kỹ thuật bắt buộc**, không phải là chứng nhận hoàn tất tuân thủ pháp luật; Gateway chặn tuyệt đối mọi payload từ thiết bị chưa đăng ký hoặc chưa có xác nhận hợp lệ.

```text
Topology UF-16:
01 (Dashboard thiết bị) → 02 (Đăng ký thiết bị) → 03 (Sinh Allowlist) → 04 (Phát hành thông báo v1.2)
→ Cổng nhân viên: 05 (Nhận thông báo) → 06 (Xem chi tiết minh bạch) → [07 Quyền yêu cầu dừng]
→ Quyết định xác nhận của nhân viên:
   ├─ Nhánh A: Chưa xác nhận → 08 (Gateway khóa, kết thúc)
   └─ Nhánh B: Đã xác nhận → 09 (Xác nhận chủ động) → 10 (Mở Gateway, cấp Token)
→ 11 (Extension lọc tại máy) → 12 (Gateway từ chối payload sai) / 13 (Gateway nhận payload đúng)
→ 14 (Khớp danh tính & Đánh giá Activity) → 15 (Giám sát vận hành) → 16 (Bàn giao dữ liệu cho UF-10)
```

---

### Frame 01 · Dashboard bộ thu thập và thiết bị (Collector & Device Dashboard)
- **Ý nghĩa của màn hình:** Trung tâm điều phối và theo dõi việc triển khai tiện ích thu thập dữ liệu trên toàn bộ thiết bị máy trạm công ty.
- **Mục đích của màn hình:** Cho IT Admin theo dõi độ phủ triển khai thiết bị, tỷ lệ nhân viên đã xác nhận và tình trạng hoạt động của bộ thu thập mà không biến giao diện thành bảng xếp hạng thời gian làm việc cá nhân.
- **Thao tác người dùng (IT Admin):**
  - Quan sát các chỉ số vận hành tổng thể:
    - Tổng thiết bị đăng ký: `24 thiết bị`.
    - Đã xác nhận theo dõi: `18 thiết bị`.
    - Đang chờ xác nhận: `6 thiết bị`.
    - Số bản ghi bị Gateway từ chối hôm nay: `3 bản ghi lỗi`.
  - Tuyệt đối không có bảng xếp hạng nhân viên nào làm việc nhiều hay ít giờ nhất.
  - Nhấn nút: **“Đăng ký thiết bị mới”** (Register New Device).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Áp dụng nguyên tắc không xâm phạm quyền riêng tư: Ẩn các thống kê chi tiết từng người dùng trên trang tổng quan.
  - Quản lý thiết bị theo định danh phần cứng máy trạm.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Bảng danh sách thiết bị và trạng thái xác nhận của nhân viên.
  - *Đầu ra / Bước tiếp:* Nhấn đăng ký thiết bị mới → Chuyển sang **Frame 02**.

---

### Frame 02 · Đăng ký thiết bị gắn với nhân viên (Register Device to Employee)
- **Ý nghĩa của màn hình:** Biểu mẫu xác lập mối quan hệ quản trị có thời hạn giữa một thiết bị phần cứng công ty và một nhân viên cụ thể.
- **Mục đích của màn hình:** Chỉ định rõ ai là người chịu trách nhiệm đối với thiết bị, làm cơ sở để gửi đúng thông báo minh bạch tới tài khoản của nhân viên đó.
- **Thao tác người dùng (IT Admin):**
  - Nhập thông tin thiết bị máy trạm:
    - Mã thiết bị: `DEV-MBP-2026-088`.
    - Số sê-ri máy (Serial Number): `C02G89A1MD6R` (MacBook Pro 14 inch).
  - Chọn nhân viên tiếp nhận: Hoàng Kim Ngân · Mã nhân viên `NV-0288` · Phòng Thiết kế.
  - Ngày bàn giao: `17/09/2026`.
  - Thời hạn hiệu lực: Gắn liền với thời gian làm việc của nhân viên tại công ty.
  - Nhấn nút: **“Xác nhận đăng ký thiết bị”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Kiểm tra tính duy nhất: Số sê-ri máy chưa từng tồn tại trên thiết bị active khác.
  - Khởi tạo trạng thái thiết bị: `REGISTERED_PENDING_CONFIRMATION`.
  - Cập nhật số liệu: Số thiết bị đăng ký tăng từ 24 lên 25, số chờ xác nhận tăng từ 6 lên 7.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Thông số phần cứng và mã nhân viên.
  - *Đầu ra / Bước tiếp:* Đăng ký thành công → Chuyển sang sinh allowlist tại **Frame 03**.

---

### Frame 03 · Cấu hình Allowlist và danh sách loại trừ (Configure Domain Allowlist & Exclusions)
- **Ý nghĩa của màn hình:** Màn hình cấu hình chính sách lọc domain nghiêm ngặt cho tiện ích trình duyệt trước khi kích hoạt trên máy nhân viên.
- **Mục đích của màn hình:** Thực thi nguyên tắc bảo vệ quyền riêng tư tuyệt đối theo ADR-10 và BR-17.8: Chỉ cho phép đo lường trên các domain công việc trong danh mục; cấm thu thập và loại trừ hoàn toàn các ứng dụng liên lạc/chat cá nhân.
- **Thao tác người dùng (IT Admin):**
  - Rà soát danh sách tên miền được phép đo lường (Domain Allowlist): `github.com`, `figma.com`, `notion.so`, `jira.company.com`.
  - Kiểm tra **Danh sách loại trừ tuyệt đối (Strict Exclusion List):**
    - `slack.com`, `teams.microsoft.com`, `zoom.us`, `mail.google.com`, `zalo.me`, v.v.
    - Hệ thống đánh dấu cờ đỏ: Các domain này bị cấm đo lường thời gian, extension sẽ tự động bỏ qua khi nhân viên mở các tab này.
  - Bấm nút: **“Phê duyệt chính sách cấu hình Allowlist”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Đồng bộ danh mục allowlist từ bảng `saas_catalog` và `vendor_dictionary`.
  - Khóa cấu hình: Tiện ích chạy trên máy nhân viên sẽ nhận cấu hình này và chỉ kích hoạt bộ đếm giờ khi tab trình duyệt khớp với allowlist.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Danh mục phần mềm cho phép đo lường.
  - *Đầu ra / Bước tiếp:* Phê duyệt xong → Chuyển sang phát hành thông báo tại **Frame 04**.

---

### Frame 04 · Phát hành thông báo minh bạch phiên bản (Publish Transparency Notice v1.2)
- **Ý nghĩa của màn hình:** Giao diện phát hành tài liệu minh bạch thông tin có quản lý phiên bản (Versioned Transparency Notice).
- **Mục đích của màn hình:** Tạo bằng chứng pháp lý và quy trình: Gửi thông báo chính thức có phiên bản rõ ràng (`Notice Version 1.2`) tới cổng tự phục vụ của nhân viên sở hữu máy trạm mới đăng ký.
- **Thao tác người dùng (IT Admin):**
  - Xem lại nội dung thông báo phiên bản `v1.2` cập nhật ngày 17/09/2026.
  - Chỉ định đối tượng nhận: Nhân viên Hoàng Kim Ngân (`NV-0288`) gắn với thiết bị `DEV-MBP-2026-088`.
  - Nhấn nút: **“Phát hành thông báo tới cổng nhân viên”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Tạo bản ghi thông báo trong cơ sở dữ liệu kèm mã băm nội dung phiên bản `v1.2`.
  - Gửi thông báo đẩy (Push Notification) và email tới tài khoản của Hoàng Kim Ngân.
  - Giữ nguyên trạng thái khóa của Gateway: Chưa mở cổng nhận dữ liệu từ thiết bị này.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Bản thảo thông báo phiên bản v1.2 và danh tính nhân viên.
  - *Đầu ra / Bước tiếp:* Phát hành thành công → Chuyển luồng sang cổng người dùng của nhân viên tại **Frame 05**.

---

### Frame 05 · Cổng thông báo của nhân viên (Employee Self-Service Notice Notification)
- **Ý nghĩa của màn hình:** Giao diện cổng tự phục vụ của nhân viên (Employee Portal) nhận thông báo về việc trang bị thiết bị và cài đặt tiện ích đo lường.
- **Mục đích của màn hình:** Thu hút sự chú ý của nhân viên một cách minh bạch, thông báo rõ ràng rằng máy trạm công ty cấp đã được tích hợp tiện ích hỗ trợ quản trị bản quyền phần mềm.
- **Thao tác người dùng (Nhân viên Hoàng Kim Ngân):**
  - Đăng nhập vào cổng SaaS-Sentry bằng tài khoản công ty.
  - Nhìn thấy banner thông báo nổi bật: *“Công ty đã bàn giao thiết bị DEV-MBP-2026-088 cho bạn. Vui lòng đọc và xác nhận thông báo về tiện ích hỗ trợ quản lý bản quyền phần mềm.”*
  - Nhấn nút: **“Xem chi tiết thông báo minh bạch”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Nhận diện đúng phiên đăng nhập của `NV-0288`.
  - Điều hướng người dùng tới màn hình đọc chi tiết các điều khoản minh bạch.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Thông báo từ Frame 04 hiển thị trên giao diện nhân viên.
  - *Đầu ra / Bước tiếp:* Nhấn xem chi tiết → Chuyển sang **Frame 06**.

---

### Frame 06 · Chi tiết thông báo minh bạch dữ liệu (Detailed Transparency Notice Modal)
- **Ý nghĩa của màn hình:** Màn hình điều khoản minh bạch chi tiết (Transparency Notice Terms) trình bày rõ ràng toàn bộ chính sách thu thập dữ liệu.
- **Mục đích của màn hình:** Cung cấp thông tin đầy đủ, dễ hiểu cho nhân viên theo 5 nội dung bắt buộc:
  1. Mục đích thu thập: Tối ưu chi phí bản quyền, phát hiện seat không dùng để tái cấp phát.
  2. Những gì **CÓ THU THẬP**: Tên miền công việc được duyệt, ngày sử dụng, tổng số phút hoạt động trong ngày.
  3. Những gì **TUYỆT ĐỐI KHÔNG THU THẬP**: Lịch sử duyệt web cá nhân, URL chi tiết, nội dung trang web, phím gõ (keystrokes), ảnh chụp màn hình, vị trí địa lý, cuộc trò chuyện trên Slack/Teams.
  4. Nơi lưu trữ và thời hạn: Lưu trữ an toàn trong 6 tháng sau đó xóa chi tiết.
  5. Quyền của người dùng: Quyền xem dữ liệu của chính mình và quyền gửi yêu cầu dừng thu thập.
- **Thao tác người dùng (Nhân viên Hoàng Kim Ngân):**
  - Cuộn chuột đọc toàn bộ nội dung thông báo.
  - Có thể bấm nút xem thông tin về quyền yêu cầu dừng (Frame 07) hoặc chuyển sang bước xác nhận (Frame 09).
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Theo dõi thanh cuộn: Bắt buộc người dùng phải cuộn xuống cuối văn bản trước khi các nút xác nhận khả dụng.
  - Lưu ý thiết kế: Ghi rõ đây là cam kết kỹ thuật của tổ chức, không tự ý tuyên bố là chứng nhận tuân thủ pháp luật hoàn tất.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Nội dung văn bản thông báo phiên bản v1.2.
  - *Đầu ra / Bước tiếp:* Nhân viên có thể xem quyền dừng tại **Frame 07** hoặc bấm xác nhận tại **Frame 09** (nếu không xác nhận → **Frame 08**).

---

### Frame 07 · Nhân viên thực hiện quyền yêu cầu dừng (Employee Request Opt-out/Stop Tracking)
- **Ý nghĩa của màn hình:** Giao diện cho phép nhân viên thực thi quyền của chủ thể dữ liệu (Data Subject Right) theo quy định an toàn thông tin (FR-10.5).
- **Mục đích của màn hình:** Cung cấp kênh chính thống có kiểm soát để nhân viên gửi yêu cầu dừng thu thập dữ liệu khi có lý do chính đáng (ví dụ: máy chuyển sang phục vụ nghiên cứu bảo mật đặc biệt), thay vì tự ý gỡ cài đặt tiện ích trái phép.
- **Thao tác người dùng (Nhân viên Hoàng Kim Ngân):**
  - Chọn lý do yêu cầu dừng: ví dụ *“Thiết bị đang được sử dụng để thử nghiệm môi trường sandbox cô lập cho dự án an ninh mạng nội bộ”*.
  - Nhấn nút: **“Gửi yêu cầu tới IT Admin”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Tạo bản ghi yêu cầu hỗ trợ theo mã `REQ-OPT-2026-012`.
  - Hệ thống ghi nhận yêu cầu nhưng **chưa tự tiện xóa dữ liệu lịch sử**; yêu cầu được chuyển sang hàng đợi của IT Admin để xem xét phê duyệt.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Form yêu cầu dừng thu thập của nhân viên.
  - *Đầu ra / Bước tiếp:* Gửi yêu cầu thành công; thiết bị chuyển sang trạng thái chờ IT xử lý.

---

### Frame 08 · Nhánh A · Chưa xác nhận — Gateway khóa (Branch A: Unconfirmed - Gateway Blocks Ingestion)
- **Ý nghĩa của màn hình:** Màn hình kỹ thuật thể hiện trạng thái phòng vệ của máy chủ khi nhân viên chưa bấm xác nhận thông báo.
- **Mục đích của màn hình:** Chứng minh bằng chứng kỹ thuật về nguyên tắc *“Chặn mặc định (Default-deny)”*: Nếu nhân viên chưa chủ động tick đồng ý, Gateway sẽ từ chối tuyệt đối mọi payload gửi lên từ thiết bị, bảo đảm không có dữ liệu chui lọt vào hệ thống.
- **Thao tác người dùng (IT Admin):**
  - Quan sát trạng thái thiết bị `DEV-MBP-2026-088` trên trang quản trị:
    - Trạng thái: `Chưa xác nhận (Pending Employee Confirmation)`.
    - Trạng thái Gateway: **Đang khóa (Locked / Ingestion Disabled)**.
    - Mã thông báo: `Notice v1.2 - Sent, Not Acknowledged`.
  - Hệ thống cảnh báo: Tuyệt đối không được suy diễn rằng nhân viên “không hoạt động” chỉ vì chưa nhận được dữ liệu từ bộ thu thập.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Extension Gateway kiểm tra cờ xác nhận: `is_confirmed == false` → Trả về HTTP 403 Forbidden đối với mọi gói tin từ thiết bị này.
  - Không sinh bất kỳ khuyến nghị tối ưu nào đối với các ứng dụng của nhân viên này nếu chỉ dựa vào nguồn collector.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Trạng thái chưa xác nhận của thiết bị.
  - *Đầu ra / Bước tiếp:* Kết thúc nhánh A; dữ liệu chỉ được thu thập khi chuyển sang nhánh B tại Frame 09.

---

### Frame 09 · Nhánh B · Nhân viên xác nhận chủ động (Branch B: Employee Active Confirmation)
- **Ý nghĩa của màn hình:** Hành động xác nhận chủ động (Active Affirmative Action) của nhân viên trên giao diện cổng tự phục vụ.
- **Mục đích của màn hình:** Thu thập bằng chứng kiểm toán chứng minh nhân viên đã tự tay tick chọn đồng ý sau khi đã đọc kỹ thông tin, gắn liền với phiên bản nội dung cụ thể.
- **Thao tác người dùng (Nhân viên Hoàng Kim Ngân):**
  - Tích chọn vào ô kiểm bắt buộc (Checkbox):
    *“Tôi xác nhận đã đọc, hiểu rõ mục đích và chính sách bảo vệ quyền riêng tư của tiện ích theo phiên bản v1.2.”*
  - Nút xác nhận sáng lên.
  - Nhấn nút: **“Xác nhận & Kích hoạt tiện ích”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Ghi nhận bản ghi xác nhận vào cơ sở dữ liệu:
    - `employee_id = NV-0288`
    - `device_id = DEV-MBP-2026-088`
    - `notice_version = v1.2`
    - `confirmed_at = 17/09/2026 14:15:22 ICT`
  - Kích hoạt sự kiện cấp quyền mở cổng tiếp nhận dữ liệu.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Thao tác tick chọn và bấm nút của nhân viên.
  - *Đầu ra / Bước tiếp:* Xác nhận thành công → Hệ thống mở cổng Gateway tại **Frame 10**.

---

### Frame 10 · Kích hoạt và mở gateway cho thiết bị (Device Gateway Activated & Token Issued)
- **Ý nghĩa của màn hình:** Màn hình hệ thống ghi nhận việc mở khóa tiếp nhận dữ liệu cho thiết bị vừa được nhân viên xác nhận.
- **Mục đích của màn hình:** Chuyển trạng thái thiết bị sang Hoạt động hợp lệ, cấp phát mã chứng thực kỹ thuật (Technical Ingestion Token) cho tiện ích trên máy trạm.
- **Thao tác người dùng (IT Admin):**
  - Xem số liệu cập nhật trên dashboard:
    - Số thiết bị đã xác nhận tăng từ 18 lên 19.
    - Số thiết bị chờ xác nhận giảm từ 7 xuống 6.
    - Thiết bị `DEV-MBP-2026-088` hiển thị trạng thái xanh lá: **Đã mở Gateway (Ingestion Active)**.
  - Lưu ý giao diện: Tuyệt đối không hiển thị mã khóa bí mật (Secret Key) thô trên màn hình để tránh lộ lọt thông tin.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Sinh mã token gửi ngầm xuống tiện ích trình duyệt thông qua kênh bảo mật.
  - Cập nhật danh sách trắng các thiết bị được phép đẩy dữ liệu vào Gateway.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Sự kiện xác nhận từ Frame 09.
  - *Đầu ra / Bước tiếp:* Tiện ích trên máy trạm bắt đầu hoạt động và thu thập theo quy tắc tại **Frame 11**.

---

### Frame 11 · Tiện ích lọc tại máy và sinh payload tối giản (Local Extension Filtering & Minimal Payload)
- **Ý nghĩa của màn hình:** Màn hình minh họa kiến trúc hoạt động bên trong tiện ích trình duyệt trên máy trạm của nhân viên.
- **Mục đích của màn hình:** Thực hiện nguyên tắc tối thiểu hóa dữ liệu tại nguồn (Data Minimization at Local Source): Tiện ích tự động loại bỏ mọi thông tin nhạy cảm ngay trên RAM của máy trạm trước khi đóng gói payload gửi đi.
- **Thao tác người dùng (Minh họa hoạt động của Extension):**
  - Khi nhân viên mở tab `figma.com/file/xyz/Design-System`:
    - Tiện ích kiểm tra domain `figma.com` thuộc Allowlist → Bắt đầu tính thời gian tab hoạt động (active tab, không tính thời gian máy ngủ/idle).
    - **Quá trình cắt gọt dữ liệu ngay tại máy:**
      - Cắt bỏ toàn bộ đường dẫn `/file/xyz/Design-System`.
      - Cắt bỏ tiêu đề trang web, nội dung trang, hình ảnh, phím bấm.
      - Chỉ giữ lại: `domain = "figma.com"`, `date = "17/09/2026"`, `active_minutes = 85`.
  - Định kỳ cuối ngày, đóng gói thành payload JSON tối giản để gửi về máy chủ.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Thuật toán client-side chỉ gửi dữ liệu tổng hợp theo ngày (Daily Aggregate), không gửi luồng sự kiện theo thời gian thực (no real-time streaming).
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Hành vi mở tab trình duyệt của nhân viên trên máy công ty.
  - *Đầu ra / Bước tiếp:* Tạo payload JSON gửi tới Extension Gateway → Gateway kiểm tra tại **Frame 12/13**.

---

### Frame 12 · Gateway kiểm tra và từ chối payload sai (Gateway Rejects Invalid Schema/Unregistered Device)
- **Ý nghĩa của màn hình:** Màn hình nhật ký an ninh của máy chủ Gateway khi phát hiện và ngăn chặn các gói dữ liệu không hợp lệ.
- **Mục đích của màn hình:** Thể hiện lớp bảo mật thứ hai: Ngay cả khi gói tin đã được gửi lên, Gateway sẽ lập tức từ chối và ghi log cảnh báo nếu payload chứa thông tin vi phạm schema hoặc đến từ thiết bị giả mạo.
- **Thao tác người dùng (IT Admin):**
  - Xem danh sách các gói tin bị từ chối:
    - Gói tin từ thiết bị chưa đăng ký `DEV-UNKNOWN-999`: Từ chối do không có token hợp lệ (`ERR_UNREGISTERED_DEVICE`).
    - Gói tin chứa trường dữ liệu lạ `full_url = "https://figma.com/..."`: Từ chối do vi phạm cấu trúc schema tối thiểu (`ERR_INVALID_PAYLOAD_SCHEMA`).
  - Số lượng bản ghi bị từ chối tăng từ 3 lên 4.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Trả về mã lỗi HTTP 400/403 cho client.
  - Hủy bỏ toàn bộ gói tin, tuyệt đối không cho phép bất kỳ dữ liệu sai chuẩn nào lọt vào cơ sở dữ liệu phân tích usage.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Gói tin lỗi từ client gửi lên.
  - *Đầu ra / Bước tiếp:* Ghi nhật ký lỗi và kết thúc gói tin hỏng; xem báo cáo vận hành tại Frame 15.

---

### Frame 13 · Gateway xác thực payload hợp lệ (Gateway Verifies & Ingests Daily Aggregate)
- **Ý nghĩa của màn hình:** Màn hình xác nhận gói dữ liệu hợp lệ đã vượt qua toàn bộ 3 chốt kiểm soát an ninh của Gateway.
- **Mục đích của màn hình:** Đóng dấu xác thực (Verified Badge) cho gói dữ liệu sử dụng trước khi chuyển giao cho bộ phận phân tích danh tính.
- **Thao tác người dùng (IT Admin):**
  - Quan sát gói dữ liệu hợp lệ gửi từ thiết bị `DEV-MBP-2026-088`:
    - Chốt 1: Thiết bị đã đăng ký hợp lệ (`Passed`).
    - Chốt 2: Nhân viên đã chủ động xác nhận phiên bản v1.2 (`Passed`).
    - Chốt 3: Cấu trúc payload đúng schema tối thiểu (`Passed`).
  - Gói dữ liệu được chấp nhận: `Hoàng Kim Ngân (NV-0288) · figma.com · Ngày 17/09 · 85 phút`.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Đóng dấu xác nhận `status = VERIFIED`.
  - Nạp bản ghi vào bảng tạm tiếp nhận dữ liệu để chuẩn bị khớp với Assignment.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Payload hợp lệ từ máy trạm của Hoàng Kim Ngân.
  - *Đầu ra / Bước tiếp:* Chuyển sang bước khớp danh tính và quyền tại **Frame 14**.

---

### Frame 14 · Khớp danh tính và gắn vào Assignment (Identity Resolution & Assignment Linking)
- **Ý nghĩa của màn hình:** Giao diện thể hiện quá trình liên kết dữ liệu đo lường từ thiết bị với bản ghi bản quyền nội bộ (`Assignment`).
- **Mục đích của màn hình:** Xác định xem số phút sử dụng phần mềm có tương ứng với một license đang được cấp chính thức hay không, và áp dụng định nghĩa hoạt động để đánh dấu ngày hoạt động (Active Day).
- **Thao tác người dùng (IT Admin):**
  - Quan sát kết quả so khớp tự động:
    - Nhân viên: Hoàng Kim Ngân (`NV-0288`).
    - Ứng dụng: Figma Professional.
    - Bản ghi phân bổ nội bộ: Khớp chính xác với `ASN-4901`.
    - Số phút ghi nhận: `85 phút`.
    - So sánh với ngưỡng quy định: Ngưỡng hoạt động là `≥ 15 phút/ngày` → Đánh dấu là một **Ngày hoạt động hợp lệ (Active Day)**.
  - Trường hợp nếu không tìm thấy Assignment: Đẩy dữ liệu vào hàng đợi chưa khớp `UF-07` để xử lý, không tự tiện kết luận.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Áp dụng BR-18: Khớp định danh thiết bị với hồ sơ nhân sự và phân bổ bản quyền tương ứng.
  - Cập nhật bảng tổng hợp hoạt động ngày cho `ASN-4901`.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Bản ghi verified từ Frame 13 và bảng Assignment.
  - *Đầu ra / Bước tiếp:* Cập nhật thành công → Chuyển sang theo dõi vận hành tại **Frame 15**.

---

### Frame 15 · Bảng giám sát vận hành bộ thu thập (Collector Health & Operational Monitoring)
- **Ý nghĩa của màn hình:** Màn hình chẩn đoán kỹ thuật dành riêng cho IT Admin theo dõi sức khỏe của hạ tầng thu thập dữ liệu.
- **Mục đích của màn hình:** Cho phép IT Admin phát hiện các máy trạm bị mất kết nối, extension bị tắt, hoặc các lỗi gửi tin bất thường để bảo trì kỹ thuật kịp thời, giữ vững tính trung thực và khách quan của dữ liệu.
- **Thao tác người dùng (IT Admin):**
  - Xem các chỉ số sức khỏe của bộ thu thập:
    - Tỷ lệ gói tin hợp lệ trong ngày: `98.5%`.
    - Số thiết bị gửi dữ liệu đều đặn trong 24 giờ qua: `19/19 thiết bị active`.
    - Xem chi tiết danh sách thiết bị và thời điểm gửi tin gần nhất (Last Seen).
  - Bấm kiểm tra kết nối tới Extension Gateway.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Báo cáo lỗi kỹ thuật: Nếu một thiết bị đã xác nhận nhưng không gửi tin quá 7 ngày, hệ thống chỉ gắn cờ *“Kiểm tra kết nối thiết bị”*, tuyệt đối không tự ý suy diễn là nhân viên không làm việc.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Nhật ký kết nối của toàn bộ các thiết bị cài extension.
  - *Đầu ra / Bước tiếp:* Hạ tầng vận hành ổn định → Chuyển sang bàn giao dữ liệu tại **Frame 16**.

---

### Frame 16 · Bàn giao dữ liệu cho rule engine tối ưu (Usage Data Ready Handoff to UF-10)
- **Ý nghĩa của màn hình:** Màn hình hoàn tất của luồng UF-16, bàn giao dữ liệu đã được làm sạch và chứng thực sang cho động cơ phân tích tối ưu bản quyền.
- **Mục đích của màn hình:** Kết nối liền mạch giữa luồng thu thập dữ liệu kỹ thuật (`UF-16`) và luồng ra quyết định tối ưu hóa chi phí (`UF-10`), bảo đảm dữ liệu đưa vào rule engine là dữ liệu minh bạch, có độ bao phủ hợp lệ và có sự đồng thuận của người dùng.
- **Thao tác người dùng (IT Admin):**
  - Xem thông báo bàn giao:
    *“Dữ liệu hoạt động từ bộ thu thập trên 19 thiết bị đã được chuẩn hóa, đáp ứng đầy đủ cửa sổ bao phủ (Coverage Window) và sẵn sàng phục vụ phân tích nhóm G3/G4 trong đợt chạy tối ưu tiếp theo.”*
  - Bấm nút: **“Mở Bảng tối ưu bản quyền (UF-10)”** để kiểm tra kết quả ứng dụng dữ liệu.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Cập nhật trạng thái nguồn dữ liệu collector trong cơ sở dữ liệu: `ready_for_optimization = true`.
  - Cung cấp đầu vào đáng tin cậy cho rule engine của `UF-10`.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Dữ liệu usage tổng hợp đã qua kiểm tra và gắn với Assignment.
  - *Đầu ra / Bước tiếp:* Handoff sang **UF-10**; hoàn tất toàn bộ chu trình của `UF-16`.

# PHẦN 9. ĐẶC TẢ CHI TIẾT UF-13 · SUPER ADMIN SỬA CẤU HÌNH VÀ LUỒNG PHÊ DUYỆT

> **Mục tiêu luồng UF-13:** Cho phép **Super Admin (Quản trị hệ thống)** quản lý các tham số cốt lõi toàn doanh nghiệp: Thiết lập phạm vi và ngưỡng lãng phí đa tầng (`ADM-02`), chỉ định vai trò Người duyệt chi (DC) và Người thay thế khi xung đột lợi ích, phát hành phiên bản thông báo minh bạch, biên tập luồng duyệt linh hoạt và kiểm chứng bắt buộc qua Khối xem thử mô phỏng Sandbox (`ADM-03`). Đồng thời thực thi cơ chế **Chặn phân quyền tối thượng (`SYS-04`)** khi Super Admin cố can thiệp vào tác nghiệp thường nhật.  
> **Nguyên tắc bất biến:**  
> - **Phân tách trách nhiệm tối thượng (`SoD-1`, `BR-37.1`):** Super Admin chỉ cấu hình luật, tuyệt đối không gán suất bản quyền và không duyệt yêu cầu nghiệp vụ. Mọi vi phạm bị chặn ngay lập tức tại `SYS-04` và ghi Audit Log.  
> - **Thứ tự ưu tiên ghi đè ngưỡng (`BR-20.1`):** Phân giải 3 tầng: `Từng ứng dụng > Toàn tổ chức > Mặc định hệ thống` (đã bỏ cấp phòng ban theo `QĐ-23`).  
> - **Người duyệt chi & Người thay thế (`FR-3.13`, `BR-13.10`):** DC mặc định là CEO; Người thay thế khi xung đột (COO) được cấu hình tĩnh trước, chỉ kích hoạt khi CEO là người yêu cầu hoặc thụ hưởng.  
> - **Khối xem thử Sandbox (`ADM-03`):** Bắt buộc chạy mô phỏng giả định để phát hiện sai sót luồng trước khi lưu áp dụng; không cho phép lưu "mù".  
> - **Quy tắc 0 VNĐ (`QĐ-29a`):** Cấp từ kho sẵn có không phát sinh chi phí được bỏ qua bước duyệt chi của DC, chỉ cần Quản lý duyệt.  
> - **Audit Log Append-Only & Hiệu lực chính sách (`BR-37.2`, `BR-38.1`):** Nhật ký kiểm toán chỉ ghi thêm không sửa xóa; chính sách mới chỉ áp dụng cho yêu cầu tạo từ nay, 5 yêu cầu đang chạy (in-flight) giữ nguyên chuỗi cũ.

```text
Topology UF-13:
Chặng 1: 01 (Tổng quan ADM-02) → 02 (Thiết lập ngưỡng đa tầng) → 03 (Ma trận phân giải s1)
Chặng 2: 04 (Giả lập can thiệp tác nghiệp d2) → 05 (SYS-04 CHẶN PHÂN QUYỀN SoD-1)
Chặng 3: 06 (Cấu hình DC mặc định CEO) → 07 (Cấu hình Người thay thế xung đột)
         → 08 (Cấu hình Ngưỡng Backlog SLA) → 09 (Nâng phiên bản thông báo v1.3)
Chặng 4: 10 (Danh mục chính sách ADM-03) → 11 (Soạn thảo điều kiện & chuỗi bước a2)
Chặng 5: 12 (Khối xem thử Sandbox a3) → 13 (Phát hiện thiếu sót d3 ➔ a4)
         → 14 (Sửa nhánh 0 VNĐ & mô phỏng lại thành công)
Chặng 6: 15 (Lưu áp dụng v2.2 & Audit Log s3) → 16 (Xác nhận hiệu lực s4 ➔ e2)
```

---

### Frame 01 · Bàn làm việc Quản trị Hệ thống & Cấu hình Phạm vi (ADM-02 Overview)
- **Ý nghĩa của màn hình:** Trung tâm điều hành cấp cao nhất (Control Plane) của Super Admin trên toàn bộ hệ thống SaaS-Sentry.
- **Mục đích của màn hình:** Cung cấp bức tranh toàn cảnh về các tham số vận hành lõi: Số lượng chính sách phê duyệt đang hoạt động (12 chính sách), phiên bản thông báo theo dõi hiện hành (`v1.2`), tổng số dòng nhật ký kiểm toán bất biến (842 logs) và 5 yêu cầu đang chạy trong hệ thống.
- **Thao tác người dùng (Super Admin):**
  - Quan sát thanh Stepper 6 chặng phía trên: Đang ở Chặng 1 (`Tổng quan & Ngưỡng lãng phí`).
  - Kiểm tra các thẻ thông số vận hành hệ thống.
  - Chọn menu bên trái hoặc nút hành động chính: **“Cấu hình ngưỡng phát hiện lãng phí”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Tải trạng thái đồng bộ từ `ledgers.l01`.
  - Hiển thị badge quyền hạn: `Super Admin (SoD-1 Active)` trên Top Bar để nhắc nhở về ranh giới quyền hạn.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Dữ liệu cấu hình tổng thể hệ thống.
  - *Đầu ra / Bước tiếp:* Nhấn cấu hình ngưỡng → Chuyển sang **Frame 02**.

---

### Frame 02 · Thiết lập Ngưỡng Lãng phí Đa tầng (BR-20.1 Multi-tier Threshold Configuration)
- **Ý nghĩa của màn hình:** Giao diện thiết lập thời gian không hoạt động (Inactivity Thresholds) làm căn cứ cho rule engine nhóm G4 quét lãng phí.
- **Mục đích của màn hình:** Thực hiện BR-20.1: Cho phép tổ chức linh hoạt cài đặt các ngưỡng thời gian khác nhau cho từng loại phần mềm đặc thù thay vì áp một con số cứng nhắc cho tất cả.
- **Thao tác người dùng (Super Admin):**
  - Cấu hình ngưỡng cấp toàn tổ chức (Organization Default): Đặt `60 ngày`.
  - Cấu hình ngưỡng ghi đè riêng cho ứng dụng đắt tiền:
    - `Figma Enterprise`: Đặt `30 ngày` (do chi phí license thiết kế cao).
    - `GitHub Enterprise`: Đặt `45 ngày`.
  - Bấm nút: **“Xem ma trận phân giải ưu tiên ghi đè”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Áp dụng QĐ-23: Bỏ hoàn toàn cấp phòng ban, chỉ duy trì 3 tầng phân giải.
  - Kiểm tra tính hợp lệ: Ngưỡng ngày phải là số nguyên dương từ 7 đến 365 ngày.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Giá trị số ngày không hoạt động do Super Admin nhập.
  - *Đầu ra / Bước tiếp:* Bấm xem ma trận → Chuyển sang **Frame 03**.

---

### Frame 03 · Ma trận Phân giải Ưu tiên Ghi đè Ngưỡng (Threshold Precedence Resolution Matrix)
- **Ý nghĩa của màn hình:** Màn hình trực quan hóa cơ chế phân giải thứ tự ưu tiên ghi đè (Precedence Resolution Engine).
- **Mục đích của màn hình:** Giúp Super Admin và kiểm toán viên thấy rõ quy tắc: `Từng ứng dụng (Mức 1) > Toàn tổ chức (Mức 2) > Mặc định hệ thống 90 ngày (Mức 3)`. Chứng minh Figma sẽ áp dụng đúng 30 ngày chứ không bị mức 60 ngày của tổ chức đè bẹp.
- **Thao tác người dùng (Super Admin):**
  - Quan sát bảng ma trận phân giải:
    - Figma Enterprise: Áp dụng `30 ngày` (Cờ Ghi đè: `BẬT`, nguồn `POL-APP-FIGMA`).
    - GitHub Enterprise: Áp dụng `45 ngày` (Cờ Ghi đè: `BẬT`, nguồn `POL-APP-GITHUB`).
    - Các SaaS thông thường (Notion, Jira, Miro...): Tự động kế thừa mức toàn tổ chức `60 ngày`.
  - Nhấn nút: **“Tiếp tục sang kiểm tra phân quyền & SoD”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Hệ thống tính toán cây phân giải kế thừa theo thời gian thực.
  - Cố định quy tắc tính toán cho các đợt chạy rule tối ưu của `UF-10`.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Cấu hình ngưỡng từ Frame 02.
  - *Đầu ra / Bước tiếp:* Chuyển sang Chặng 2 (Phân quyền & SoD) tại **Frame 04**.

---

### Frame 04 · Giả lập Thao tác Tác nghiệp Cấp phát / Duyệt (Operational Action Attempt Simulation)
- **Ý nghĩa của màn hình:** Màn hình giả lập tình huống thử nghiệm (Simulated Scenario) để kiểm tra hàng rào an ninh phân tách trách nhiệm.
- **Mục đích của màn hình:** Mô phỏng việc Super Admin vì lý do tiện lợi hoặc nhầm lẫn cố tình bấm nút “Gán suất bản quyền trực tiếp cho nhân viên NV-0255” hoặc “Duyệt đơn xin cấp phần mềm”.
- **Thao tác người dùng (Super Admin):**
  - Super Admin truy cập vào bảng người dùng và nhấn thử vào nút: **“Gán trực tiếp License Figma cho NV-0255”** hoặc **“Phê duyệt yêu cầu REQ-8891”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Bộ kiểm soát an ninh (Security Interceptor) bắt giữ sự kiện `ACTION_ATTEMPT`.
  - Nhận diện vai trò hiện tại của phiên đăng nhập: `SUPER_ADMIN`.
  - Đối chiếu với ma trận phân tách trách nhiệm SoD-1: Super Admin nằm trong danh sách cấm tác nghiệp thường nhật.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Lệnh thao tác trực tiếp của Super Admin.
  - *Đầu ra / Bước tiếp:* Hệ thống ngắt lệnh ngay lập tức, chuyển sang màn hình chặn cảnh báo tại **Frame 05**.

---

### Frame 05 · CHẶN PHÂN QUYỀN — Vi phạm SoD-1 (SYS-04 - Separation of Duties Blocked Modal)
- **Ý nghĩa của màn hình:** Màn hình cảnh báo an ninh tối thượng `SYS-04` thực thi nguyên tắc phân tách trách nhiệm cốt lõi của doanh nghiệp.
- **Mục đích của màn hình:** Thực thi nghiêm ngặt SoD-1 và BR-37.1: Ngăn chặn triệt để nguy cơ tập trung quyền lực tuyệt đối (vừa sửa luật vừa cấp quyền), từ chối thực hiện thao tác và tự động ghi log vi phạm vào sổ kiểm toán.
- **Thao tác người dùng (Super Admin):**
  - Màn hình chuyển sang giao diện cảnh báo vi phạm viền đỏ nghiêm trọng `SYS-04`:
    *“THAO TÁC BỊ CHẶN: Super Admin (Quản trị hệ thống) không được phép gán suất hoặc phê duyệt yêu cầu cấp phát bản quyền theo quy định SoD-1 và BR-37.1.”*
  - Xem hướng dẫn: Thao tác này phải do Quản lý trực tiếp phê duyệt và IT Admin thực thi tại UF-08.
  - Bấm nút duy nhất: **“Đã hiểu & Quay lại bàn làm việc cấu hình”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Hủy bỏ hoàn toàn thao tác gán suất (Rollback transaction).
  - Tự động ghi một dòng kiểm toán vi phạm bảo mật: `AUD-2026-9940` · Action: `SOD_BLOCKED` · Status: `DENIED & LOGGED` · Kèm mã băm SHA-256.
  - Số dòng Audit Log trong hệ thống tăng từ 842 lên **843 dòng**.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Thao tác bị chặn từ Frame 04.
  - *Đầu ra / Bước tiếp:* Bấm quay lại → Chuyển sang Chặng 3 (Vai trò & Chính sách) tại **Frame 06**.

---

### Frame 06 · Cấu hình Người duyệt chi (DC) mặc định CEO (FR-3.13 - Default Approver Configuration)
- **Ý nghĩa của màn hình:** Giao diện chỉ định chức danh nhân sự giữ vai trò Người duyệt chi tối cao của doanh nghiệp.
- **Mục đích của màn hình:** Thực thi FR-3.13: Chỉ định đích danh một nhân viên đang hoạt động giữ vai trò Người duyệt chi (DC - Default là CEO) để phê duyệt các yêu cầu mua sắm phát sinh chi phí mới hoặc quyết định gia hạn tại `UF-15`.
- **Thao tác người dùng (Super Admin):**
  - Tại mục Người duyệt chi (DC): Tìm kiếm và chọn `Phạm Hoàng Nam` (Chức danh: `Tổng Giám đốc / CEO` · Email: `nv_ceo@company.com`).
  - Đọc nguyên tắc: Người duyệt chi sẽ ra quyết định dựa trên Snapshot ngân sách chứ không bị bộ phận Tài chính chặn đường duyệt (QĐ-29b).
  - Bấm nút: **“Lưu & Chuyển sang cấu hình người thay thế”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Kiểm tra trạng thái của người được chọn: Phải là nhân sự active, có thẩm quyền phê duyệt chi ngân sách.
  - Lưu cấu hình vào biến hệ thống `system_config.default_approver_id = NV-CEO-001`.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Danh sách nhân sự cấp cao.
  - *Đầu ra / Bước tiếp:* Lưu thành công → Chuyển sang **Frame 07**.

---

### Frame 07 · Cấu hình Người thay thế khi Xung đột Lợi ích (BR-13.10 - Conflict of Interest Substitute)
- **Ý nghĩa của màn hình:** Giao diện thiết lập quy tắc chuyển tuyến tự động khi người có thẩm quyền phê duyệt rơi vào tình huống xung đột lợi ích.
- **Mục đích của màn hình:** Thực hiện BR-13.10: Thiết lập cấu hình tĩnh trước, ngăn chặn tình trạng "tự duyệt đơn của chính mình" (ví dụ CEO làm đơn xin cấp tài khoản Figma cho chính mình thì không được tự duyệt).
- **Thao tác người dùng (Super Admin):**
  - Tại mục Người thay thế khi xung đột lợi ích của CEO: Chọn cấu hình tĩnh là `Vũ Đình Khoa` (Chức danh: `Giám đốc Vận hành / COO` · Email: `nv_coo@company.com`).
  - Đọc quy tắc: Hệ thống không cho phép người nộp đơn tự chọn người duyệt thay thế, cũng không tạo danh sách ứng viên song song để tránh tùy tiện.
  - Bấm nút: **“Xác nhận lưu cấu hình người thay thế”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Lưu vào biến hệ thống: `system_config.approver_conflict_substitute_id = NV-COO-002`.
  - Kích hoạt quy tắc rà soát: Bất kỳ yêu cầu nào có `requester_id === default_approver_id` hoặc `beneficiary_id === default_approver_id` sẽ tự động chuyển bước duyệt chi sang cho COO.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Chỉ định nhân sự thay thế COO.
  - *Đầu ra / Bước tiếp:* Chuyển sang cấu hình SLA backlog tại **Frame 08**.

---

### Frame 08 · Cấu hình Ngưỡng Backlog & Cảnh báo Tắc nghẽn (FR-3.8 - SLA Backlog Alert Thresholds)
- **Ý nghĩa của màn hình:** Bảng điều chỉnh các chỉ số giới hạn tồn đọng công việc nhằm duy trì hiệu suất xử lý yêu cầu.
- **Mục đích của màn hình:** Thực thi FR-3.8: Giúp hệ thống phát hiện sớm các bước duyệt bị ngâm hồ sơ quá lâu để gửi cảnh báo nhắc nhở (Escalation notification), không làm đình trệ công việc của nhân viên.
- **Thao tác người dùng (Super Admin):**
  - Cài đặt hai ngưỡng cảnh báo tắc nghẽn (Bottleneck Thresholds):
    - Ngưỡng thời gian tồn đọng tối đa: `> 3 ngày làm việc`.
    - Ngưỡng số lượng hồ sơ chờ tối đa trên một người duyệt: `> 8 yêu cầu`.
  - Bật cờ thông báo tự động gửi email nhắc nhở khi chạm ngưỡng.
  - Nhấn nút: **“Lưu thiết lập SLA & Cảnh báo”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Áp dụng QĐ-28d: Cảnh báo quá hạn chỉ là thông báo nhắc nhở, **tuyệt đối không tự động vượt quyền hoặc tự ý đổi người duyệt** khi thông tin tổ chức chưa thay đổi.
  - Đăng ký ngưỡng vào worker giám sát SLA định kỳ.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Các giá trị số ngày và số ticket giới hạn.
  - *Đầu ra / Bước tiếp:* Chuyển sang cập nhật thông báo minh bạch tại **Frame 09**.

---

### Frame 09 · Cập nhật Nội dung Thông báo Minh bạch v1.3 (BR-42.5 - Transparency Notice Versioning)
- **Ý nghĩa của màn hình:** Trình soạn thảo văn bản thông báo theo dõi có quản lý phiên bản nghiêm ngặt.
- **Mục đích của màn hình:** Thực hiện BR-42.5: Khi Super Admin chỉnh sửa dù chỉ một câu chữ trong chính sách minh bạch thu thập dữ liệu (ví dụ: bổ sung điều khoản tuân thủ Luật Bảo vệ dữ liệu cá nhân mới), hệ thống bắt buộc phải sinh **phiên bản mới `v1.3`**, yêu cầu 100% nhân viên phải tick xác nhận lại trước khi thiết bị tiếp tục gửi dữ liệu.
- **Thao tác người dùng (Super Admin):**
  - Xem văn bản thông báo hiện hành `v1.2`.
  - Soạn thảo nội dung cập nhật: Bổ sung cam kết mã hóa đầu cuối và cập nhật căn cứ pháp lý mới.
  - Xem cảnh báo hệ thống: *“Cập nhật nội dung này sẽ nâng phiên bản từ v1.2 lên v1.3. Toàn bộ nhân viên sẽ phải xác nhận lại tại cổng tự phục vụ.”*
  - Nhấn nút: **“Phát hành phiên bản thông báo v1.3”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Nâng `noticeVersion = "v1.3"`.
  - Sinh mã băm nội dung SHA-256 mới cho phiên bản `v1.3`.
  - Ghi nhật ký kiểm toán `AUD-2026-9941` (Audit log count tăng từ 843 lên **844 dòng**).
  - Đặt lại cờ xác nhận trên các thiết bị: Yêu cầu nhân viên mở lại cổng UF-16 Frame 06/09 để xác nhận.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Nội dung văn bản mới do Super Admin biên tập.
  - *Đầu ra / Bước tiếp:* Chuyển sang Chặng 4 (Biên tập luồng duyệt) tại **Frame 10**.

---

### Frame 10 · Quản lý Danh mục Chính sách Phê duyệt Luồng (ADM-03 - Approval Policy Catalog)
- **Ý nghĩa của màn hình:** Danh mục quản lý tập trung toàn bộ các quy trình phê duyệt cấp phát phần mềm của tổ chức.
- **Mục đích của màn hình:** Cho phép Super Admin kiểm soát 12 chính sách đang kích hoạt, phân loại theo nhóm phần mềm (Thiết kế, Lập trình, Quản lý dự án, Tri thức, An toàn thông tin) và chọn chính sách cần nâng cấp.
- **Thao tác người dùng (Super Admin):**
  - Quan sát danh sách chính sách: `POL-DES-2026` (Figma), `POL-DEV-2026` (GitHub), `POL-PM-2026` (Jira)...
  - Chọn chính sách cần biên tập lại: Nhấp chọn `POL-DES-2026` (Chính sách cấp phần mềm Thiết kế Figma Enterprise, hiện đang ở phiên bản `v2.1`).
  - Nhấn nút: **“Biên tập luồng phê duyệt”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Tải cấu hình chi tiết của chính sách `POL-DES-2026 v2.1`.
  - Đưa chính sách vào trạng thái `Đang sửa đổi (Draft Editing)`.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Danh mục chính sách từ bảng `approval_policies`.
  - *Đầu ra / Bước tiếp:* Mở trình soạn thảo quy trình tại **Frame 11**.

---

### Frame 11 · Trình soạn thảo Điều kiện & Chuỗi Bước Duyệt mới (Policy Rule & Sequence Editor)
- **Ý nghĩa của màn hình:** Công cụ thiết kế trực quan luồng phê duyệt đa bước (Visual Approval Workflow Builder).
- **Mục đích của màn hình:** Cho phép Super Admin cấu hình các điều kiện rẽ nhánh phức tạp dựa trên chi phí, vai trò người yêu cầu và sắp xếp thứ tự các bước phê duyệt cần thiết.
- **Thao tác người dùng (Super Admin):**
  - Thiết lập điều kiện kích hoạt: Yêu cầu mua mới bản quyền Figma có giá trị `> 5.000.000 VNĐ`.
  - Cấu hình chuỗi bước duyệt tuyến tính:
    - **Bước 1:** Quản lý trực tiếp (Direct Manager · `QL`) thẩm định nhu cầu sử dụng.
    - **Bước 2:** Người duyệt chi (Decision Maker · `DC`) quyết định chi ngân sách dựa trên Snapshot tài chính.
  - Bấm nút bắt buộc: **“Chuyển sang Khối xem thử mô phỏng (Sandbox)”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Kiểm tra tính toàn vẹn của chuỗi bước: Không có bước duyệt trùng lặp, các vai trò duyệt hợp lệ.
  - **Khóa nút Lưu chính thức:** Hệ thống cấm Super Admin bấm lưu áp dụng ngay tại màn hình này; bắt buộc phải đi qua Khối xem thử Sandbox theo quy tắc thiết kế `ADM-03`.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Sơ đồ bước duyệt vừa thiết lập.
  - *Đầu ra / Bước tiếp:* Chuyển sang Chặng 5 (Khối xem thử Sandbox) tại **Frame 12**.

---

### Frame 12 · Khối Xem Thử — Mô phỏng Tình huống Giả định (Simulation Sandbox)
- **Ý nghĩa của màn hình:** Môi trường thử nghiệm mô phỏng độc lập (Sandbox Environment) bên trong trình quản trị.
- **Mục đích của màn hình:** Giải quyết triệt để rủi ro *“sửa chính sách trong bóng tối”*: Cho phép Super Admin nhập thử một tình huống giả định để xem hệ thống sẽ vẽ ra chuỗi người duyệt như thế nào trước khi ban hành thật.
- **Thao tác người dùng (Super Admin):**
  - Nhập dữ liệu mô phỏng tình huống 1:
    - Người yêu cầu: `Trần Văn Bình (Nhân viên Thiết kế)`.
    - Phần mềm: `Figma Enterprise`.
    - Số tiền phát sinh: `12.000.000 VNĐ` (Cần mua thêm 1 seat mới).
  - Nhấn nút: **“Chạy thử mô phỏng (Run Simulation)”**.
  - Quan sát kết quả chuỗi bước sinh ra: `Trần Văn Bình` ➔ `Bước 1: Quản lý trực tiếp Lê Thu Hà` ➔ `Bước 2: CEO Phạm Hoàng Nam (DC)` ➔ `IT Admin cấp phát`.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Chạy engine phân giải chính sách trên dữ liệu giả lập.
  - Hiển thị trực quan từng chặng và người duyệt dự kiến.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Dữ liệu giả lập tình huống mua mới.
  - *Đầu ra / Bước tiếp:* Chuyển sang thử nghiệm tình huống thứ hai tại **Frame 13**.

---

### Frame 13 · Phát hiện Chuỗi Bước Chưa Đúng Ý trong Sandbox (Flaw Detected in Sandbox)
- **Ý nghĩa của màn hình:** Màn hình phát hiện lỗi logic chính sách nhờ vào môi trường mô phỏng.
- **Mục đích của màn hình:** Chứng minh giá trị sống còn của Khối xem thử: Phát hiện ra chính sách vừa soạn thảo đang bắt tất cả các yêu cầu đều phải qua CEO duyệt, kể cả khi trong kho công ty đã có sẵn seat trống (0 VNĐ), gây quá tải cho lãnh đạo và vi phạm QĐ-29a.
- **Thao tác người dùng (Super Admin):**
  - Chạy thử tình huống mô phỏng 2:
    - Yêu cầu cấp Figma cho nhân viên nhưng chọn kho có sẵn: Chi phí phát sinh là **0 VNĐ**.
    - Kết quả mô phỏng trả về: Hệ thống **vẫn bắt đưa qua CEO duyệt chi** (Sai lệch với quy định QĐ-29a).
  - Đọc cảnh báo lỗi logic: *“Chính sách chưa có nhánh rẽ cho trường hợp không phát sinh chi phí (0 VNĐ).”*
  - Nhấn nút: **“Quay lại Chỉnh sửa điều kiện & Chuỗi bước”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Sandbox đánh dấu trạng thái kiểm thử: `TEST_FAILED (Chưa đúng ý)`.
  - Khóa quyền ban hành chính sách cho tới khi lỗi logic được sửa đổi và chạy mô phỏng đạt kết quả đúng.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Kết quả mô phỏng lỗi từ tình huống 0 VNĐ.
  - *Đầu ra / Bước tiếp:* Quay lại trình soạn thảo để sửa chuỗi bước tại **Frame 14**.

---

### Frame 14 · Sửa Chuỗi Bước & Mô phỏng Lại Thành Công (Fast-track Added & Validated)
- **Ý nghĩa của màn hình:** Giao diện hoàn thiện luồng duyệt sau khi đã bổ sung nhánh rẽ đặc thù theo chuẩn kiến trúc.
- **Mục đích của màn hình:** Bổ sung quy tắc nghiệp vụ QĐ-29a: Nếu yêu cầu cấp quyền từ kho bản quyền sẵn có (Chi phí = 0 VNĐ), hệ thống tự động **bỏ qua bước duyệt chi của DC**, chỉ cần Quản lý trực tiếp phê duyệt là chuyển thẳng sang IT cấp phát.
- **Thao tác người dùng (Super Admin):**
  - Bổ sung nhánh điều kiện rẽ nhánh (Conditional Branching):
    - *Nhánh A (Có phát sinh chi phí > 0 VNĐ):* `QL ➔ DC (Snapshot ngân sách) ➔ IT Admin`.
    - *Nhánh B (Kho sẵn có = 0 VNĐ):* `QL ➔ Chuyển thẳng IT Admin cấp phát`.
  - Bấm chạy lại mô phỏng cho cả 2 tình huống: Cả 2 tình huống đều trả về chuỗi bước duyệt chính xác 100%.
  - Trạng thái kiểm thử chuyển sang xanh lá: **Khớp hoàn toàn (Simulation Passed)**.
  - Nút **“Lưu & Áp dụng chính sách v2.2”** chính thức sáng lên.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Hệ thống đóng dấu chứng thực kiểm thử thành công: `simulation_verified = true`.
  - Mở khóa quyền lưu và chuyển giao sang chặng áp dụng cuối cùng.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Luồng duyệt đã sửa đổi và kết quả mô phỏng thành công.
  - *Đầu ra / Bước tiếp:* Nhấn lưu áp dụng → Chuyển sang Chặng 6 (Áp dụng & Audit Log) tại **Frame 15**.

---

### Frame 15 · Lưu Áp dụng Chính sách & Audit Log Append-Only (Save Policy v2.2 & Append Audit Log)
- **Ý nghĩa của màn hình:** Màn hình xác nhận ban hành chính sách mới và ghi nhận nhật ký kiểm toán bảo mật bất biến.
- **Mục đích của màn hình:** Thực thi BR-38.1: Mọi thay đổi về chính sách phê duyệt đều được ghi vào sổ nhật ký kiểm toán theo nguyên tắc chỉ ghi thêm (Append-only), gắn kèm chữ ký điện tử và mã băm SHA-256, tuyệt đối không ai (kể cả Super Admin) có thể chỉnh sửa hay xóa bỏ.
- **Thao tác người dùng (Super Admin):**
  - Quan sát kết quả công bố:
    - Chính sách Figma Enterprise chính thức nâng phiên bản: `POL-DES-2026 v2.2`.
    - Tổng số chính sách kích hoạt cập nhật lên: `13 chính sách`.
    - Dòng Audit Log vừa được ghi thêm: `AUD-2026-9942` · User: `quan.nguyen (Super Admin)` · Action: `PUBLISH_APPROVAL_POLICY` · Target: `POL-DES-2026 v2.2 (Added 0 VND fast-track)` · Hash: `7b22...41cc`.
    - Tổng số dòng Audit Log tăng từ 844 lên **845 dòng**.
  - Nhấn nút: **“Xác nhận hiệu lực & Hoàn tất quy trình”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Lưu bản ghi chính sách mới với `version = "v2.2"`, `is_active = true`.
  - Đóng bản ghi v2.1 vào lịch sử lưu trữ (Archived).
  - Ghi bản ghi append-only vào bảng `audit_logs` có tính toán chuỗi băm (Hash chaining).
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Chính sách v2.2 đã qua kiểm thử từ Frame 14.
  - *Đầu ra / Bước tiếp:* Chuyển sang màn hình xác nhận hiệu lực tại **Frame 16**.

---

### Frame 16 · Xác nhận Hiệu lực Chính sách & Handoff Yêu cầu Mới (Policy Effective & In-flight Intact)
- **Ý nghĩa của màn hình:** Màn hình phân định ranh giới hiệu lực thi hành giữa các yêu cầu cũ và yêu cầu mới.
- **Mục đích của màn hình:** Thực thi nghiêm ngặt BR-37.2:
  - **5 yêu cầu đang chạy dở dang (in-flight requests):** Giữ nguyên vẹn chuỗi phê duyệt theo chính sách cũ `v2.1`, không bị xáo trộn hay bắt duyệt lại từ đầu.
  - **Các yêu cầu tạo từ thời điểm này trở đi:** Sẽ tự động áp dụng chuỗi phê duyệt thông minh của phiên bản mới `v2.2`.
- **Thao tác người dùng (Super Admin):**
  - Xem bảng đối soát ranh giới hiệu lực:
    - Mục In-flight: 5 yêu cầu đang duyệt vẫn hiển thị cờ `Preserved v2.1 Rules`.
    - Mục New Requests: Sẵn sàng tiếp nhận các yêu cầu mới từ nhân viên (`UF-01`).
  - Xem tóm tắt toàn bộ phiên làm việc của Super Admin: Cấu hình ngưỡng đa tầng thành công, kiểm thử SoD an toàn, hoàn tất ban hành chính sách mới có kiểm toán.
  - Nhấn nút: **“Hoàn tất & Quay về Trang chủ Quản trị”**.
- **Xử lý hệ thống & Quy tắc nghiệp vụ:**
  - Kích hoạt phân luồng cho `UF-01` (Nhân viên xin cấp phần mềm): Các yêu cầu tạo mới sẽ tự động nạp chính sách `POL-DES-2026 v2.2`.
  - Hoàn tất phiên cấu hình, bảo đảm toàn vẹn dữ liệu hệ thống.
- **Dữ liệu đầu vào & Đầu ra:**
  - *Đầu vào:* Hồ sơ hiệu lực chính sách v2.2.
  - *Đầu ra / Bước tiếp:* Hoàn tất trọn vẹn toàn bộ 16 frame của `UF-13`; kết thúc quy trình Super Admin.

---

## BẢNG TỔNG HỢP LIÊN KẾT CHUYỂN GIAO (HANDOFF MATRIX) GIỮA CÁC USER FLOW

| Flow phát sinh | Sự kiện / Điều kiện bàn giao | Dữ liệu chuyển giao | Flow tiếp nhận | Hành động tại flow tiếp nhận |
| :--- | :--- | :--- | :--- | :--- |
| **UF-06** | Hoàn tất import danh sách sử dụng từ nhà cung cấp (Microsoft 365) | Phiên import `IMP-20250114-7F3A`, 146 định danh chưa khớp | **UF-07** | Đưa vào hàng đợi chưa khớp danh tính để IT Admin xử lý thẩm định |
| **UF-06** | Dữ liệu sử dụng của 1.102 tài khoản đã nạp thành công và gắn vào Assignment | 1.102 usage events, 1.089 Assignment Microsoft 365 | **UF-10** | Cung cấp dữ liệu usage thực tế cho rule engine tính toán lãng phí G3/G4 |
| **UF-07** | Khớp thủ công thành công, đã tái tổng hợp dữ liệu vào Assignment | Ánh xạ `IdentityMapping`, 23 bản ghi usage của Nguyễn Văn An | **UF-10** | Cung cấp dữ liệu usage đáng tin cậy cho rule engine tính toán lãng phí G3/G4 |
| **UF-07** | Phát hiện xung đột danh tính đa ứng viên (bị chặn theo `BR-18.4`) | Mã `UQ-0186`, 2 candidate `EMP-0312` & `EMP-0448` | **UF-14** | Đưa vào diện theo dõi mâu thuẫn dữ liệu hoặc đối soát danh tính với HR |
| **UF-08** | Lời mời API thành công nhưng tài khoản ở trạng thái `pending` | Mã task `PV-2041`, mã Assignment `ASN-4901`, email người nhận | **UF-14** | Đối soát danh sách thành viên nhà cung cấp; xác nhận active thật mới đóng task |
| **UF-08** | Hết hạn mức license (lỗi 422 từ nhà cung cấp) | Mã task `PV-2039`, snapshot hạn mức nội bộ vs thực tế | **UF-15** | Người duyệt chi phê duyệt ngân sách mua thêm suất |
| **UF-09** | Nhân viên nghỉ việc, IT Admin xác nhận thu hồi hàng loạt | Batch 5 task `PV-2042` đến `PV-2046`, mã hồ sơ `OFF-2026-044` | **UF-08** | Thực thi xóa tài khoản thật trên cả kênh tự động và thủ công |
| **UF-09** | Task thủ công thiếu bằng chứng kiểm toán | Mã task `PV-2042`, lý do thiếu mã tham chiếu sự kiện | **UF-08** | Mở lại dialog Frame 08 của UF-08 để IT Admin bổ sung mã tham chiếu |
| **UF-10** | Đề xuất giảm số lượng mua tại kỳ gia hạn (Nhóm G1) | Phiếu đề xuất `REN-2026-041`, snapshot số lượng gán thực tế | **UF-15** | Người duyệt chi chốt số lượng giảm (chuyển `UF-11` ghi nhận song song) |
| **UF-10** | Thu hồi license nhân viên đã nghỉ việc (Nhóm G2) | 3 task thu hồi `PV-2058`, `PV-2059`, `PV-2061` | **UF-08** | Thực thi thu hồi trực tiếp không cần qua Quản lý |
| **UF-10** | IT Admin đồng ý thu hồi license không dùng (Nhóm G3/G4) | Khuyến nghị đã có Quản lý duyệt, mã task `PV-2060` | **UF-08** | Thực thi thu hồi tài khoản có kiểm soát bằng chứng |
| **UF-12** | IT Admin quyết định không chấp thuận phần mềm ngoài danh mục | Finding `FND-2026-045`, mã task thu hồi `PV-2074` | **UF-08** | Thực thi thu hồi quyền đăng nhập OAuth hoặc chấm dứt thẻ thanh toán |
| **UF-12** | IT Admin quyết định hợp thức hóa phần mềm ngoài danh mục | Mã catalog `CAT-CANVA-01`, yêu cầu mua sắm `REQ-2026-212` | **UF-15** | Đưa vào luồng phê duyệt mua sắm chính thức của doanh nghiệp |
| **UF-13** | Super Admin cập nhật nội dung thông báo minh bạch lên `v1.3` | Phiên bản `v1.3`, mã băm nội dung mới, ngày ban hành | **UF-16** | Yêu cầu toàn bộ nhân viên đọc và tick xác nhận lại trên cổng tự phục vụ |
| **UF-13** | Ban hành chính sách duyệt mới `POL-DES-2026 v2.2` (có nhánh 0 VNĐ) | Cấu hình điều kiện, chuỗi bước duyệt, phân luồng giá trị | **UF-01** | Áp dụng chuỗi người duyệt tự động cho tất cả yêu cầu tạo mới |
| **UF-13** | Chỉ định Người duyệt chi (CEO) và Người thay thế khi xung đột (COO) | Định danh `default_approver_id`, `conflict_substitute_id` | **UF-15** | Định tuyến yêu cầu duyệt chi tới đúng lãnh đạo có thẩm quyền |
| **UF-14** | Phát hiện thiếu tài khoản thật, IT quyết định cấp lại | Mã sai lệch `DISC-2026-081`, mã task mới `PV-2065` | **UF-08** | Thực thi cấp lại tài khoản cho nhân viên |
| **UF-14** | Phát hiện tài khoản ngoài quy trình, quyết định thu hồi khẩn | Bằng chứng điều tra, mã tài khoản lạ `temp-dev-outsider` | **UF-08** | Thực thi xóa tài khoản khẩn cấp trên nhà cung cấp |
| **UF-16** | Dữ liệu tổng hợp từ bộ thu thập đã verified và khớp Assignment | Bảng tổng hợp số phút hoạt động hợp lệ theo ngày, coverage | **UF-10** | Cung cấp dữ liệu usage đáng tin cậy cho rule engine tính lãng phí G3/G4 |

