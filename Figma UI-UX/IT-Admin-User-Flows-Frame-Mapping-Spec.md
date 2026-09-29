# SaaS-Sentry — Đặc tả luồng IT Admin gắn với frame UI

> **Phiên bản:** 0.1 — 17/09/2026
>
> **Phạm vi:** `UF-06`, `UF-07`, `UF-08`, `UF-09`, `UF-10`, `UF-12`, `UF-14`, `UF-16` — tổng cộng **125 trạng thái frame**
>
> **Mục đích:** Giúp người trình bày mở đúng frame UI và giải thích được màn hình đó nhận dữ liệu gì, dùng để làm gì, hệ thống xử lý gì, tạo ra trạng thái nào và đi tiếp tới đâu.
>
> **Không phải nguồn nghiệp vụ mới:** Khi có khác biệt, [BRD v3.11](../Requiments/BRD%20-%20HỆ%20THỐNG%20QUẢN%20TRỊ%20BẢN%20QUYỀN%20PHẦN%20MỀM%20%26%20TỐI%20ƯU%20CHI%20PHÍ%20CÔNG%20NGHỆ.md), [User Flows v0.7](../Diagrams/user-flows/index.md) và `.drawio` hiện hành có thẩm quyền cao hơn tài liệu diễn giải này.

---

## 1. Cách dùng tài liệu

Mỗi số frame đại diện cho hai bản giao diện có cùng nghiệp vụ:

- `UF-xx-Light-nn.png`: theme sáng.
- `UF-xx-Dark-nn.png`: theme tối.

Khi thuyết trình, không cần mô tả lại mọi control trên màn hình. Với mỗi frame, chỉ cần trả lời năm câu hỏi theo thứ tự:

1. Màn hình này xuất hiện khi nào?
2. Nó nhận dữ liệu nào từ bước trước?
3. Người dùng cần xem hoặc quyết định điều gì?
4. Hệ thống kiểm tra, phân tích hay ghi nhận điều gì?
5. Sau màn hình này trạng thái thay đổi ra sao và chuyển tới đâu?

### 1.1. Thứ tự nguồn khi diễn giải

| Mức | Nguồn                                                        | Dùng để xác định                                                    |
| --- | ------------------------------------------------------------ | ------------------------------------------------------------------- |
| 1   | BRD v3.11                                                    | Quyền, quy tắc, dữ liệu, trạng thái và ranh giới nghiệp vụ          |
| 2   | `Diagrams/user-flows/index.md` và `drawio/UF-xx.drawio`      | Topology, guard, nhánh kết thúc và handoff giữa các flow            |
| 3   | `Figma UI-UX/UF-xx-Figma-Design-Spec.md` và ảnh `FullFrames` | Frame cụ thể hiển thị gì và dùng control nào để biểu diễn nghiệp vụ |

### 1.2. Những điểm không được đọc theo số frame như một chuỗi tuyến tính

- `UF-06`: frame 03 và 04 là hai nhánh thay thế. Ứng dụng liên lạc bị chặn ở frame 03 thì **không** đi tiếp frame 04. Frame 04 chỉ dành cho ứng dụng được phép nhưng đây là lần import đầu tiên.
- `UF-06`: frame 06 có thể hiển thị coverage không hợp lệ. IT phải sửa coverage trước khi sang frame 07.
- `UF-07`: bộ frame minh họa lần lượt ba hồ sơ khác nhau: khớp duy nhất, không tìm thấy và xung đột hai người.
- `UF-08`: các cụm tự động, thủ công, retry, lỗi xác thực và hết hạn mức là các nhánh của cùng hàng đợi; một task không chạy tuần tự qua tất cả 16 frame.
- `UF-10`: G1, G2 và G3/G4 là ba nhánh độc lập; frame 15 và 16 là hai kết quả thay thế của frame 14.
- `UF-12`: frame 16, 18 và 19 là ba kết cục thay thế của quyết định tại frame 15; frame 20 chỉ tổng hợp lịch sử.
- `UF-14`: flow liên vai trò. Frame 08–12 thuộc ngữ cảnh Finance; các frame còn lại chủ yếu thuộc IT Admin/hệ thống.
- `UF-16`: frame 08 là kết thúc nhánh chưa xác nhận; frame 09–16 là nhánh đã xác nhận. Các biện pháp thông báo và xác nhận là **ràng buộc thiết kế**, không phải kết luận rằng việc thu thập đã được chứng nhận hợp pháp.

---

## 2. Bản đồ liên kết các flow

```text
Nguồn file ── UF-06 ──┬── dữ liệu chưa khớp ── UF-07 ──┐
                      └── dữ liệu hợp lệ ───────────────┼── UF-10
Bộ thu thập ── UF-16 ───────────────────────────────────┘

Nhân viên nghỉ việc ── UF-09 ── tạo tác vụ thu hồi ── UF-08

UF-10
├─ G1 ── UF-15 quyết định gia hạn ── UF-11 ghi nhận tài chính
├─ G2 ── UF-08 thực thi thu hồi
└─ G3/G4 ── UF-05 Manager xác nhận ── IT review ── UF-08

UF-12 Shadow IT
├─ Báo nhầm ── đóng finding
├─ Đã duyệt ── vào danh mục + tạo request chính thức
└─ Chưa duyệt ── UF-08 thực thi thu hồi

UF-14 đối soát
├─ hoàn tất task đang chờ chấp nhận từ UF-08
├─ tạo task cấp lại/thu hồi sang UF-08
└─ quyền ngoài quy trình có thể chuyển UF-12 để hợp thức hóa
```

---

## 3. `UF-06` — IT Admin nạp dữ liệu sử dụng

**Mục đích:** Biến file usage thô thành dữ liệu đã kiểm tra, đã xác định coverage, đã khớp với Assignment và sẵn sàng cho rule engine của `UF-10`.

| Thuộc tính       | Giá trị                                                                                                                           |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Tác nhân chính   | IT Admin                                                                                                                          |
| Kích hoạt        | IT có file log sử dụng hoặc bắt đầu một phiên nhập từ Source Hub                                                                  |
| Đầu vào          | Ứng dụng, mẫu nguồn, file CSV/XLSX/JSON, múi giờ, coverage window, định nghĩa “hoạt động”                                         |
| Đầu ra chính     | Usage record hợp lệ gắn với Assignment đúng thời điểm; dòng lỗi/trùng/chưa khớp được tách riêng; audit của phiên import           |
| Handoff          | Dòng chưa khớp → `UF-07`; dữ liệu hợp lệ → `UF-10`; nguồn bộ thu thập cùng đi qua logic khớp của `UF-16`                          |
| Frame tham chiếu | [UF-06 storyboard sáng](UF-06-Raster/UF-06-Light-Storyboard.png) · [UF-06 storyboard tối](UF-06-Raster/UF-06-Dark-Storyboard.png) |

### 3.1. Đường đi đúng

```text
01 → 02 → 03
          ├─ ứng dụng liên lạc → kết thúc: không import usage chi tiết
          ├─ lần đầu, chưa thông báo → 04 → 05
          └─ đã thông báo trước đó → 05
05 → [cảnh báo nếu trùng hash] → 06
06 → [sửa coverage nếu thiếu/sai] → 07
07 → [đẩy unmatched sang UF-07] → 08 → 09
09 ├─ Hủy → kết thúc, ghi 0 dòng
   └─ Xác nhận → 10 → 11 → 12 hoặc UF-10
```

### 3.2. Frame-by-frame

| Frame UI                                 | Màn hình này dùng để làm gì                                                                               | Dữ liệu đầu vào                                                                                               | Thao tác và xử lý trên màn hình                                                                                                                                          | Đầu ra và bước tiếp theo                                                                                              |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| **01 · Trung tâm nguồn dữ liệu**         | Là điểm bắt đầu để IT chọn cách đưa dữ liệu usage vào hệ thống và xem tình trạng các nguồn đã cấu hình.   | Danh sách ứng dụng/nguồn, lần import gần nhất, coverage, độ mới dữ liệu.                                      | IT chọn tải tệp, kết nối ứng dụng, dùng mẫu hoặc tích hợp API. Hệ thống chỉ mở phiên import, chưa ghi usage.                                                             | Tạo ngữ cảnh nguồn tạm thời → frame 02.                                                                               |
| **02 · Chọn ứng dụng và mẫu nguồn**      | Xác định file sắp nhập thuộc ứng dụng nào và phải được đọc theo cấu hình nào.                             | Ứng dụng, template nguồn, loại định danh, múi giờ, capability của nguồn.                                      | IT chọn ứng dụng/mẫu. Hệ thống nạp mapping cột và kiểm tra cờ `communication`.                                                                                           | Có source context đầy đủ → frame 03.                                                                                  |
| **03 · Kiểm tra chính sách nguồn**       | Chặn nguồn không được phép thu usage chi tiết và xác định có cần qua cổng thông báo lần đầu hay không.    | Source context từ frame 02; cờ ứng dụng liên lạc; lịch sử thông báo.                                          | Hệ thống kiểm `ADR-10` và `BR-17.8`. Nếu là Slack/Teams/ứng dụng liên lạc thì chỉ cho quay lại chọn ứng dụng, không có CTA vượt chặn.                                    | Nhánh liên lạc kết thúc “chỉ dùng danh sách thành viên”; ứng dụng hợp lệ lần đầu → frame 04; đã thông báo → frame 05. |
| **04 · Cổng thông báo lần đầu**          | Ghi nhận rằng người đang giữ seat đã được thông báo trước khi hệ thống nhận usage lần đầu.                | Ứng dụng hợp lệ, danh sách người đang giữ Assignment, nội dung thông báo hiện hành.                           | IT kiểm tra đối tượng nhận và xác nhận gửi/đã thông báo. Hệ thống lưu người nhận, nội dung/phiên bản và timestamp.                                                       | Mở quyền upload → frame 05. **Không phải bước sau của nhánh bị chặn ở frame 03.**                                     |
| **05 · Tải tệp và tạo mã băm**           | Nhận file, kiểm định dạng/kích thước và phát hiện file đã từng nhập.                                      | File usage; source template từ frame 02.                                                                      | IT kéo thả/chọn file. Hệ thống tính SHA-256 và so với lịch sử. Nếu hash trùng, hiển thị cảnh báo; chỉ tiếp tục khi IT chủ đích xác nhận.                                 | File hợp lệ và có hash → frame 06; hủy duplicate → kết thúc, không ghi dữ liệu.                                       |
| **06 · Phân tích và ánh xạ dữ liệu**     | Chuyển cột nguồn thành trường chuẩn và xác định cửa sổ dữ liệu trước khi khớp danh tính.                  | File, template, timezone, column mapping, coverage khai báo/tự suy ra.                                        | Hệ thống kiểm cột, định dạng ngày, timezone, định nghĩa activity và coverage. Nếu file không tự chứa coverage hoặc coverage sai chính sách, khóa CTA cho tới khi IT sửa. | Mapping + coverage hợp lệ → frame 07.                                                                                 |
| **07 · Giải quyết danh tính người dùng** | Cho biết bao nhiêu external identifier đã khớp và tách phần chưa khớp khỏi dữ liệu được dùng để kết luận. | Các định danh nguồn đã chuẩn hóa; danh tính nội bộ và Assignment theo thời gian.                              | Hệ thống chạy thứ tự exact/normalized/manual; IT xem exact, normalized, manual và unmatched. Unmatched được đưa sang `UF-07`, không làm hỏng phần hợp lệ.                | Tập record hợp lệ → frame 08; queue unresolved → `UF-07`.                                                             |
| **08 · Xem trước dữ liệu nhập**          | Cho IT kiểm tra tác động trước commit; chưa có dòng nào được ghi.                                         | Record đã parse; lỗi; trùng; unmatched; coverage; số Assignment ảnh hưởng; capability và định nghĩa activity. | IT lọc bảng mẫu, xem lỗi, tải danh sách lỗi và so các metric. Hệ thống tính phần hợp lệ sẽ ghi và phần sẽ bỏ qua.                                                        | IT quay lại sửa hoặc tiếp tục → frame 09.                                                                             |
| **09 · Xác nhận ghi dữ liệu**            | Tạo điểm quyết định cuối cùng giữa hủy toàn bộ phiên và ghi phần hợp lệ.                                  | Tóm tắt nguồn, file/hash, record hợp lệ/lỗi/trùng, người dùng, ứng dụng, coverage.                            | IT tick xác nhận thông tin chính xác. Hệ thống nhắc dữ liệu sẽ gắn vào Assignment hiệu lực tại ngày sự kiện.                                                             | Hủy → ghi 0 dòng; xác nhận → tạo import job, frame 10.                                                                |
| **10 · Đang ghi dữ liệu**                | Thể hiện tiến độ thật của import job và ngăn người dùng hiểu nhầm là đã hoàn tất.                         | Import job và tập record đã xác nhận.                                                                         | Hệ thống chạy kiểm tra, chuẩn hóa, ghi record, cập nhật chỉ mục và kích hoạt tính lại tổng hợp. Các hành động gây ghi trùng bị khóa.                                     | Job thành công → frame 11; lỗi → error state/correlation ID, không sang success.                                      |
| **11 · Hoàn tất và bàn giao**            | Xác nhận phiên import đã commit và cho biết kết quả thực tế.                                              | Kết quả job: đã ghi, bỏ qua, lỗi, unmatched, thời gian chạy.                                                  | Hệ thống hiển thị số đã ghi và thời điểm usage được tính lại; IT có thể xem dữ liệu, nhập nguồn khác hoặc đi tiếp.                                                       | Dữ liệu sẵn sàng → `UF-10`; xem audit → frame 12.                                                                     |
| **12 · Lịch sử nhập dữ liệu**            | Tra cứu và giải trình các phiên import trước đó.                                                          | Lịch sử import, actor, file/hash, coverage, trạng thái, correlation ID.                                       | IT lọc theo trạng thái/nguồn/thời gian và mở chi tiết phiên. Hệ thống không cho sửa ngược lịch sử.                                                                       | Kết thúc tra cứu hoặc bắt đầu phiên mới tại frame 01.                                                                 |

### 3.3. Câu nói khi trình bày

> “UF-06 không chỉ là màn upload file. Ba cổng quan trọng là chính sách nguồn, coverage và khớp danh tính. Chỉ dữ liệu vượt qua các cổng đó mới được preview; tới frame 09 IT mới cho phép ghi, sau đó dữ liệu mới trở thành đầu vào cho bảng tối ưu.”

---

## 4. `UF-07` — IT Admin xử lý hàng đợi chưa khớp danh tính

**Mục đích:** Biến external identifier chưa biết thành một mapping có người xác nhận, hoặc giữ nó ngoài mọi kết luận khi không đủ căn cứ.

| Thuộc tính     | Giá trị                                                                                            |
| -------------- | -------------------------------------------------------------------------------------------------- |
| Tác nhân chính | IT Admin                                                                                           |
| Kích hoạt      | `UF-06` hoặc `UF-16` tạo ra định danh chưa khớp                                                    |
| Đầu vào        | Chuỗi gốc, chuỗi chuẩn hóa, nguồn, usage record liên quan, danh sách nhân viên/Assignment ứng viên |
| Đầu ra         | Mapping thủ công có audit; bản ghi bị bỏ qua có lý do; hoặc hồ sơ xung đột chờ xử lý               |
| Nguyên tắc     | Chưa khớp/xung đột không được dùng để kết luận về bất kỳ người nào                                 |

### 4.1. Ba kịch bản được đặt nối tiếp trong bộ frame

```text
Hồ sơ A: 01 → 02 → 03 → 04 → 05       khớp duy nhất
Hồ sơ B: 01/05 → 06 → 07 → 08          không tìm thấy, bỏ qua
Hồ sơ C: 01/08 → 09 → 10 → 11          khớp hai người, chặn xung đột
```

### 4.2. Frame-by-frame

| Frame UI                         | Màn hình này dùng để làm gì                                                            | Dữ liệu đầu vào                                                             | Thao tác và xử lý trên màn hình                                                                                  | Đầu ra và bước tiếp theo                                                                                |
| -------------------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **01 · Tổng quan hàng đợi**      | Cho IT thấy khối lượng định danh chưa khớp và chọn hồ sơ cần xử lý.                    | Phiên import `IMP-20250114-7F3A`, 1.248 tổng, 1.102 đã khớp, 146 chưa khớp. | IT lọc Mới/Xung đột/Đã bỏ qua và chọn `UQ-0184`. Hệ thống giữ nguyên cảnh báo các record này chưa dùng cho rule. | Mở hồ sơ → frame 02.                                                                                    |
| **02 · Xem gợi ý ứng viên**      | Đặt chuỗi gốc cạnh chuỗi chuẩn hóa và các ứng viên để người thật đánh giá.             | `UQ-0184`, phương pháp khớp, confidence, ba employee candidate.             | IT xem vì sao Nguyễn Văn An đứng đầu 94%; hệ thống chỉ gợi ý, không tự gán.                                      | Chọn ứng viên duy nhất → frame 03; không thấy ứng viên → frame 06; nhiều ứng viên mâu thuẫn → frame 09. |
| **03 · Xác nhận khớp duy nhất**  | Ngăn thao tác gán tay diễn ra mà không thấy rõ phạm vi ảnh hưởng.                      | External identifier, employee đích, 23 usage record, 1 Assignment.          | IT kiểm tra, tick xác nhận. Hệ thống lấy người xác nhận từ phiên đăng nhập và chuẩn bị ghi method=`manual`.      | Xác nhận → frame 04.                                                                                    |
| **04 · Đang tính lại tổng hợp**  | Thể hiện mapping đã được ghi nhưng kết quả usage chưa sẵn sàng.                        | Mapping thủ công vừa tạo.                                                   | Hệ thống lần lượt lưu mapping, gắn record vào Assignment đúng ngày sự kiện và tính lại trạng thái sử dụng.       | Chỉ khi aggregation xong mới → frame 05.                                                                |
| **05 · Khớp thành công**         | Xác nhận tác động của việc khớp và giảm queue đúng thời điểm.                          | Kết quả aggregation của `UQ-0184`.                                          | Hiển thị audit, 23 record đã tổng hợp và 1 Assignment đã tính lại.                                               | Queue 146→145; xử lý tiếp → frame 06 hoặc về frame 01.                                                  |
| **06 · Không tìm được ứng viên** | Xử lý trường hợp tìm kiếm nội bộ trả 0 kết quả mà không ép gán sai.                    | `UQ-0185`, chuỗi gốc/chuẩn hóa, kết quả search rỗng.                        | IT có thể tìm lại hoặc chọn “Đánh dấu bỏ qua”.                                                                   | Chọn bỏ qua → frame 07.                                                                                 |
| **07 · Xác nhận bỏ qua**         | Buộc IT giải thích vì sao identifier không thuộc nhân viên.                            | Hồ sơ không có candidate.                                                   | IT nhập lý do bắt buộc; CTA khóa khi trống. Hệ thống nhắc record sẽ không được dùng kết luận.                    | Xác nhận → frame 08.                                                                                    |
| **08 · Đã bỏ qua**               | Ghi lại quyết định không tạo IdentityMapping.                                          | Lý do, actor, timestamp của `UQ-0185`.                                      | Hệ thống đóng item dưới trạng thái “Đã bỏ qua” và giữ lịch sử.                                                   | Queue 145→144; mở hồ sơ tiếp → frame 09 hoặc về queue.                                                  |
| **09 · Phát hiện hai ứng viên**  | Cho thấy identifier có thể thuộc hai người và không thể chọn bằng confidence gần nhau. | `UQ-0186`, hai candidate 82%/80%, nguyên nhân mơ hồ.                        | Hệ thống vô hiệu hóa cả nút chọn để tránh quyết định ngẫu nhiên.                                                 | Mở blocked state → frame 10.                                                                            |
| **10 · Chặn xung đột danh tính** | Thực thi `BR-18.4`: không nguồn nào tự thắng khi một identifier khớp hai người.        | Hai candidate và bằng chứng nguồn.                                          | IT chỉ có thể chuyển hồ sơ sang chờ xử lý xung đột; không có CTA khớp.                                           | Xác nhận chuyển chờ → frame 11.                                                                         |
| **11 · Đang chờ xử lý xung đột** | Kết thúc có kiểm soát mà vẫn bảo toàn bằng chứng.                                      | `UQ-0186`, hai candidate, actor và audit event.                             | Hệ thống giữ nguyên candidate và không giảm queue đã xử lý; tăng bộ đếm xung đột chờ.                            | Kết thúc nhánh; quay lại frame 01 khi cần.                                                              |

### 4.3. Câu nói khi trình bày

> “Màn này không cố khớp bằng mọi giá. Nếu có một ứng viên rõ ràng thì IT xác nhận và hệ thống tính lại usage; nếu không có thì bỏ qua có lý do; nếu khớp hai người thì hệ thống chặn hoàn toàn và không dùng record để kết luận.”

---

## 5. `UF-08` — IT Admin xử lý hàng đợi cấp phát và thu hồi

**Mục đích:** Theo dõi việc tạo/xóa tài khoản thật ở nhà cung cấp qua hai kênh tự động và thủ công, gồm retry, lỗi xác thực và hết hạn mức.

| Thuộc tính     | Giá trị                                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| Tác nhân chính | IT Admin; worker hệ thống                                                                                |
| Kích hoạt      | Request đã đủ quyết định hoặc một luồng khác tạo `ProvisioningTask`                                      |
| Đầu vào        | Request/Assignment, task, connector capability, seat limit, quyết định mua thêm, bằng chứng nhà cung cấp |
| Đầu ra         | Task hoàn tất có bằng chứng; task chờ chấp nhận; task chuyển kênh; hoặc task đóng có lý do               |
| Nguyên tắc     | Assignment vẫn chiếm chỗ trong khi thực thi/thất bại; API success không đồng nghĩa account đã active     |

### 5.1. Các nhánh

```text
Tự động: 01 → 02 → 03 → 04 → 05 → UF-14
Thủ công: 01 → 06 → 07 → 08 → 09
Retry: 10 → 11 → 12 → 13 → nhánh thủ công
Auth/permanent: 10 → 14 → sửa kết nối / làm tay / đóng có lý do
Hết hạn mức: 10 → 15 → UF-15 quyết → UF-11 ghi nhận song song → 16 → thực thi lại
```

### 5.2. Frame-by-frame

| Frame UI                                | Màn hình này dùng để làm gì                                                                          | Dữ liệu đầu vào                                                        | Thao tác và xử lý trên màn hình                                                                                   | Đầu ra và bước tiếp theo                                                 |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **01 · Tổng quan hàng đợi thực thi**    | Cho IT phân loại nhanh task cần làm tay, đang tự động, chờ chấp nhận và thất bại.                    | Toàn bộ `ProvisioningTask`, tuổi task, ứng dụng, kênh, trạng thái.     | IT chọn task; hệ thống hiển thị metric, phân bố và cảnh báo task cũ nhưng chưa đổi ledger.                        | Chọn auto → frame 02; manual → 06; failed → 10.                          |
| **02 · Chi tiết tác vụ tự động**        | Kiểm tra task có đủ quyết định, Assignment giữ chỗ và connector sẵn sàng trước khi gọi nhà cung cấp. | `PV-2041`, Request đã duyệt, Assignment, connector GitHub.             | IT bấm “Thực thi ngay”; hệ thống tạo idempotency key và khóa chạy trùng.                                          | Worker bắt đầu → frame 03.                                               |
| **03 · Connector đang thực thi**        | Theo dõi attempt đang chạy và ngăn thay đổi task giữa chừng.                                         | `PV-2041`, attempt 1/6, endpoint, timestamp, idempotency key.          | Hệ thống gọi API; IT chỉ xem log, không thể chạy lặp hoặc đổi kênh lúc worker active.                             | API trả về → frame 04 hoặc nhánh lỗi frame 10/11/14/15.                  |
| **04 · Lời mời đã gửi — chờ chấp nhận** | Phân biệt API response thành công với membership thực sự active.                                     | Response thành công nhưng membership=`pending`.                        | Hệ thống chuyển task sang “Chờ chấp nhận”, vẫn giữ seat; không hiển thị “Hoàn tất”.                               | Bàn giao đối soát → frame 05.                                            |
| **05 · Bàn giao đối soát**              | Kết thúc phần thực thi ban đầu khi nhà cung cấp mới chỉ gửi invitation.                              | `PV-2041` pending, audit API, Assignment đang giữ chỗ.                 | IT mở `UF-14` hoặc xem Audit Trail.                                                                               | `UF-14` xác minh active rồi mới hoàn tất chính task này.                 |
| **06 · Chi tiết tác vụ thủ công**       | Cung cấp hướng dẫn và căn cứ cho ứng dụng không có connector hoặc task thu hồi thủ công.             | `PV-2042`, quyết định offboarding, hướng dẫn thao tác Figma.           | IT bấm “Tôi đang xử lý”.                                                                                          | Task được gán cho IT → frame 07.                                         |
| **07 · IT Admin đã nhận xử lý**         | Ghi ownership và trình bày checklist thao tác ngoài hệ thống.                                        | Task manual, actor đăng nhập, link trang quản trị NCC.                 | IT thực hiện ở nhà cung cấp; hệ thống lưu người nhận và thời điểm.                                                | Có kết quả → frame 08.                                                   |
| **08 · Xác nhận hoàn tất thủ công**     | Thu thập bằng chứng trước khi task được coi là hoàn tất.                                             | Kết quả thao tác ngoài hệ thống.                                       | IT nhập loại bằng chứng, mã tham chiếu, ghi chú; người xác nhận là trường chỉ đọc. Thiếu bằng chứng thì khóa CTA. | Đủ bằng chứng → frame 09.                                                |
| **09 · Thu hồi thủ công hoàn tất**      | Chỉ tại đây mới đóng task và trả seat về trống.                                                      | Bằng chứng tài khoản đã bị xóa/không cần xóa.                          | Hệ thống ghi audit, hoàn tất task, cập nhật Assignment.                                                           | Manual 8→7, hoàn tất 12→13; trả kết quả về flow gọi như `UF-09`/`UF-10`. |
| **10 · Hàng đợi thất bại**              | Gom task lỗi để IT thấy lỗi nào có thể retry và lỗi nào cần người xử lý.                             | `PV-2037`, `PV-2038`, `PV-2039` và loại lỗi.                           | Hiển thị thông báo tiếng Việt; mã kỹ thuật chỉ ở drawer.                                                          | Lỗi tạm thời → 11; auth/permanent → 14; hết hạn mức → 15.                |
| **11 · Lỗi tạm thời đang retry**        | Cho thấy lịch thử lại và số attempt còn lại.                                                         | `PV-2037`, attempt 3/6, backoff, lịch sử response.                     | Hệ thống lên lịch retry; IT theo dõi.                                                                             | Thành công → quay luồng 03/04; hết 6 lần → frame 12.                     |
| **12 · Đã hết sáu lần retry**           | Dừng vòng lặp tự động và trả quyền quyết định cho người thật.                                        | Attempt 6/6 vẫn lỗi; `nextAttemptAt` rỗng.                             | Hệ thống bỏ trạng thái “Đang lên lịch”, giữ đủ lịch sử sáu lần thử.                                               | IT chuyển làm tay → frame 13 hoặc đóng có lý do.                         |
| **13 · Chuyển sang làm thủ công**       | Đổi kênh trên chính task mà không xóa lịch sử connector.                                             | `PV-2037` và sáu attempt.                                              | IT xác nhận chuyển; hệ thống giữ ID task, history và đưa vào tab Manual.                                          | Sang nhánh frame 06; ledger Failed giảm, Manual tăng.                    |
| **14 · Lỗi xác thực — không retry**     | Tránh retry vô ích khi connector hết hạn hoặc lỗi vĩnh viễn.                                         | `PV-2038`, connector Figma hết hạn.                                    | IT chọn sửa kết nối, chuyển làm tay hoặc đóng kèm lý do; không có CTA retry.                                      | Theo lựa chọn: cấu hình lại, frame 06 hoặc end state có audit.           |
| **15 · Hết hạn mức license**            | Hiển thị vì sao IT chưa thể cấp và bàn giao quyết định chi phí đúng vai trò.                         | `PV-2039`, số seat nội bộ/NCC, snapshot ngân sách và trạng thái duyệt. | IT chỉ xem, không tự mua/tự duyệt. Người duyệt chi xử lý ở `UF-15`; Finance ghi nhận sau duyệt ở `UF-11`.         | Mua thêm bị từ chối → task đóng/chờ quyết định; được duyệt → frame 16.   |
| **16 · Đã mua thêm — trở lại thực thi** | Đưa task về hàng đợi ngay khi hạn mức hợp lệ, không bắt IT chờ Finance ghi nhận xong.                | Hạn mức mới 51, approval và BudgetCommitment.                          | Hệ thống cập nhật capacity; hiển thị hai activity song song: Finance ghi nhận và IT tiếp tục.                     | Task quay lại frame 02/03; chưa được tính hoàn tất.                      |

### 5.3. Câu nói khi trình bày

> “UF-08 quản lý một máy trạng thái chung cho cả tự động và thủ công. Task chỉ hoàn tất khi có bằng chứng tài khoản thật đã được tạo hoặc xóa; API trả về thành công nhưng invitation còn pending thì chuyển sang UF-14 để đối soát, seat vẫn bị giữ.”

---

## 6. `UF-09` — IT Admin xử lý nhân viên nghỉ việc

**Mục đích:** Chấm dứt an toàn mọi quyền của người nghỉ việc, xử lý kế nhiệm/bàn giao, thu hồi có bằng chứng và xóa usage detail đúng mốc.

| Thuộc tính     | Giá trị                                                                                                                                         |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Tác nhân chính | IT Admin; Manager tham gia xác nhận bàn giao khi cần                                                                                            |
| Kích hoạt      | Nhân sự báo người sắp nghỉ; IT chuyển hồ sơ sang “Đang bàn giao” và đặt ngày làm việc cuối                                                      |
| Đầu vào        | Hồ sơ nhân viên, Assignment, quan hệ quản lý/Business Owner, thiết bị công ty, ngày làm việc cuối                                               |
| Đầu ra         | Không còn Assignment gắn với người nghỉ; quan hệ kế nhiệm có lịch sử; usage detail bị xóa theo mốc sớm hơn của chính sách; Audit Trail được giữ |
| Handoff        | Tạo các task thu hồi sang `UF-08`; khi thiếu bằng chứng quay lại đúng task ở `UF-08`                                                            |

### 6.1. Đường đi

```text
01 → 02 → 03 → 04
               ├─ có quan hệ cần kế nhiệm → 05
               └─ không có → bỏ qua 05
→ 06 → Manager xác nhận → 07 → tới ngày cuối → 08 → 09 → 10 → 11
→ UF-08 thực thi → 12
                    ├─ thiếu bằng chứng → 13 → UF-08 → 14
                    └─ đủ bằng chứng ───────────────→ 14
→ 15 → tới mốc xóa → 16
```

### 6.2. Frame-by-frame

| Frame UI                                 | Màn hình này dùng để làm gì                                                                 | Dữ liệu đầu vào                                                                 | Thao tác và xử lý trên màn hình                                                                                  | Đầu ra và bước tiếp theo                                              |
| ---------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| **01 · Danh sách nhân sự sắp nghỉ**      | Giúp IT nhìn ra ngay người nào cần offboard và mức ảnh hưởng ban đầu.                       | Danh sách nhân sự, trạng thái, 5 seat, 2 nhóm quan hệ cần kế nhiệm, 1 thiết bị. | IT lọc “Sắp nghỉ việc” và chọn Trần Minh.                                                                        | Mở hồ sơ → frame 02.                                                  |
| **02 · Hồ sơ và tác động offboarding**   | Tổng hợp mọi thứ sẽ bị ảnh hưởng trước khi khởi tạo kế hoạch.                               | `NV-0174`, 5 Assignment, 3 cấp dưới, vai Figma Business Owner, thiết bị.        | IT kiểm tra phạm vi và bấm “Bắt đầu bàn giao”.                                                                   | Mở dialog thiết lập → frame 03.                                       |
| **03 · Thiết lập ngày làm việc cuối**    | Tạo mốc thời gian có thẩm quyền cho toàn bộ tiến trình offboarding.                         | Hồ sơ nhân viên và thông báo nghỉ.                                              | IT chọn trạng thái “Đang bàn giao”, nhập ngày cuối và hạn bàn giao; hệ thống không cho bỏ trống ngày.            | Tạo `OFF-2026-044` → frame 04.                                        |
| **04 · Kế hoạch offboarding đã tạo**     | Cho thấy timeline, blocker và lịch hết hiệu lực thiết bị trong cùng một chỗ.                | `OFF-2026-044`, 5 seat, các quan hệ, thiết bị, ngày cuối.                       | Hệ thống liệt kê 2 blocker kế nhiệm và 1 blocker bàn giao; thiết bị nhận `effective_to`, không bị xóa record.    | Có quan hệ → frame 05; không có → frame 06.                           |
| **05 · Chỉ định người kế nhiệm**         | Ngăn cây quản lý và Business Owner bị để trống sau ngày nghỉ.                               | Danh sách cấp dưới, ứng dụng do người nghỉ sở hữu, employee còn hiệu lực.       | IT chọn người kế nhiệm cho vai quản lý và Business Owner; hệ thống ghi các quyết định riêng và lịch sử hiệu lực. | Blocker kế nhiệm về 0 → frame 06.                                     |
| **06 · Chờ xác nhận bàn giao dữ liệu**   | Bảo đảm dữ liệu/tài sản cần bàn giao được Manager xác nhận trước khi IT thu hồi.            | Checklist bàn giao, hạn xử lý, Manager chịu trách nhiệm.                        | IT chỉ theo dõi/nhắc; không có CTA xác nhận thay Manager hoặc thu hồi sớm.                                       | Manager xác nhận → frame 07; quá hạn chỉ cảnh báo, không tự xác nhận. |
| **07 · Bàn giao đã được xác nhận**       | Ghi bằng chứng Manager đã hoàn tất bàn giao và chờ đúng ngày làm việc cuối.                 | Xác nhận của Lê Thu Hà, timestamp, checklist hoàn tất.                          | Hệ thống đưa blocker về 0; thiết bị và seat vẫn active tới thời điểm hiệu lực kết thúc.                          | Tới ngày cuối → frame 08.                                             |
| **08 · Sinh năm khuyến nghị G2**         | Chuyển toàn bộ seat còn lại thành vấn đề cần xử lý ngay, không phụ thuộc usage.             | Employee chuyển `Terminated`, 5 Assignment còn active.                          | Rule engine sinh 5 G2, confidence 100%, bỏ qua ngưỡng ngày và không gửi Manager xác nhận.                        | IT mở nhóm G2 → frame 09.                                             |
| **09 · Chọn thu hồi hàng loạt**          | Cho IT xem tác động theo ứng dụng/kênh và chọn đúng 5 seat của cùng hồ sơ offboarding.      | Năm G2, loại connector/manual và loại tiết kiệm.                                | IT chọn 5 seat và bấm “Thu hồi 5 seat”.                                                                          | Mở xác nhận mạnh → frame 10.                                          |
| **10 · Xác nhận thu hồi hàng loạt**      | Giảm nguy cơ thu hồi nhầm bằng số lượng gõ lại và lý do bắt buộc.                           | 5 Assignment đã chọn, nguồn `OFF-2026-044`.                                     | IT phải gõ đúng `5` và nhập lý do; hệ thống khóa CTA khi không khớp.                                             | Tạo batch quyết định → frame 11.                                      |
| **11 · Đã tạo tác vụ thực thi**          | Phân biệt “đã quyết định thu hồi” với “đã xóa tài khoản thật”.                              | Batch 5 seat đã xác nhận.                                                       | Hệ thống tạo `PV-2042`–`PV-2046`, gồm 3 Connector và 2 Manual; năm seat vẫn chiếm chỗ.                           | Mở hàng đợi `UF-08`; sau thực thi quay frame 12.                      |
| **12 · Theo dõi bằng chứng thu hồi**     | Theo dõi tiến độ từng task thay vì chờ cả batch.                                            | Kết quả `UF-08`: 4 task đủ bằng chứng, `PV-2042` còn chờ.                       | Hệ thống nhả 4 Assignment đã đủ bằng chứng; Figma vẫn chiếm chỗ.                                                 | Mở task thiếu → frame 13.                                             |
| **13 · Bằng chứng Figma chưa đủ**        | Giải thích rõ vì sao seat cuối chưa thể trả về trống.                                       | `PV-2042`, thông tin còn thiếu: mã tham chiếu/xác nhận người thật.              | IT bấm mở chính `PV-2042` trong `UF-08`; không tạo task mới.                                                     | Bổ sung bằng chứng ở `UF-08` → frame 14.                              |
| **14 · Đủ bằng chứng — nhả seat cuối**   | Hoàn tất thu hồi seat thứ năm và đóng năm khuyến nghị G2.                                   | `FIG-EVT-772904` và confirmation hợp lệ.                                        | Hệ thống hoàn tất `PV-2042`, trả Figma seat về trống, ghi tiết kiệm đúng loại.                                   | 5/5 G2 đóng → frame 15.                                               |
| **15 · Không còn seat, chờ xóa dữ liệu** | Cho thấy offboarding về quyền đã xong nhưng nghĩa vụ xóa dữ liệu còn là việc được lập lịch. | Không còn Assignment; 12.480 usage detail; ngày cuối 17/09.                     | Hệ thống hiển thị tiết kiệm tách loại và lịch xóa 17/10/2026; chưa nói dữ liệu đã bị xóa.                        | Tới mốc sớm hơn theo chính sách → frame 16.                           |
| **16 · Đã xóa dữ liệu sau 30 ngày**      | Chứng minh việc xóa thật đã chạy mà vẫn giữ audit và aggregate phi định danh.               | Retention job, 12.480 usage detail, 5 dòng tổng hợp.                            | Hệ thống xóa detail, ghi job/audit, giữ aggregate gắn nhãn phi định danh; tìm usage theo `NV-0174` trả rỗng.     | Kết thúc `UF-09`.                                                     |

### 6.3. Câu nói khi trình bày

> “UF-09 tách ba việc rất rõ: bàn giao trước ngày nghỉ, thu hồi có bằng chứng vào ngày nghỉ, và xóa usage detail sau đó. Tạo task chưa làm seat trống; chỉ khi UF-08 trả về bằng chứng thì Assignment tương ứng mới được nhả.”

---

## 7. `UF-10` — IT Admin xử lý bảng tối ưu license

**Mục đích:** Xử lý bốn nhóm lãng phí theo đúng loại bằng chứng và biến quyết định thành hành động thu hồi hoặc giảm thuê bao.

| Thuộc tính     | Giá trị                                                                                                                 |
| -------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Tác nhân chính | IT Admin; Manager/Người duyệt chi/Finance tham gia qua các flow liên kết                                                |
| Kích hoạt      | Rule engine sinh recommendation theo lịch                                                                               |
| Đầu vào        | Snapshot dữ liệu thuê bao, nhân sự/Assignment, usage đủ coverage, evidence và confidence                                |
| Đầu ra         | Quyết định G1 tại kỳ gia hạn; G2 task thu hồi trực tiếp; G3/G4 được Manager và IT xem xét; hai loại tiết kiệm tách biệt |
| Nguyên tắc     | G1–G4 không trộn; G3/G4 chưa đủ coverage/identity không được sinh; không cộng tiết kiệm ngay với tiết kiệm tại gia hạn  |

### 7.1. Topology

```text
01 → 02
      ├─ G1: 03 → 04 → 05 → UF-15 → 06 ← UF-11 ghi nhận
      ├─ G2: 07 → 08 → 09 → UF-08
      └─ G3/G4: 10 → 11 → 12 → UF-05 → 13 → 14
                                             ├─ Đồng ý → 15 → UF-08 → 18
                                             └─ Không đồng ý → 16 → 17
```

### 7.2. Frame-by-frame

| Frame UI                              | Màn hình này dùng để làm gì                                                               | Dữ liệu đầu vào                                                                     | Thao tác và xử lý trên màn hình                                                                                                                 | Đầu ra và bước tiếp theo                                                |
| ------------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **01 · Dashboard tối ưu**             | Cho IT thấy số phát hiện G1–G4, lịch chạy và giá trị tài chính mà không gộp sai.          | `RUN-OPT-20260917-0615`, 38 phát hiện, snapshot bất biến.                           | IT chọn nhóm cần xử lý; hệ thống hiển thị hai ô “tiết kiệm ngay” và “tại gia hạn” riêng.                                                        | Mở giải thích nhóm → frame 02.                                          |
| **02 · So sánh bốn nhóm**             | Giải thích vì sao mỗi nhóm dùng nguồn, confidence và đường quyết định khác nhau.          | Metadata G1–G4 và rule version.                                                     | IT xem G1/G2 nguồn nội bộ 100%; G3/G4 cần usage và Manager gate.                                                                                | Chọn G1 → 03; G2 → 07; G3/G4 → 10.                                      |
| **03 · Danh sách G1**                 | Tìm seat chưa gán ở cấp thuê bao, không biến nó thành đánh giá cá nhân.                   | Subscription, purchased quantity, assigned quantity.                                | IT chọn `SUB-M365-E3-01` có 12 seat dư.                                                                                                         | Mở chi tiết gia hạn → frame 04.                                         |
| **04 · Chi tiết G1 tại gia hạn**      | Tính cơ hội giảm số lượng tại renewal và cho biết hạn báo hủy.                            | 120 mua/108 gán, unit cost, renewal 15/12, notice deadline 15/11.                   | Hệ thống đề nghị giảm 12 và ước tính 72 triệu/năm; đây chưa phải tiết kiệm thực tế.                                                             | Tạo handoff quyết định → frame 05.                                      |
| **05 · Bàn giao duyệt G1**            | Chuyển quyết định giảm số lượng sang đúng Người duyệt chi.                                | `REN-2026-041`, snapshot và căn cứ G1.                                              | IT gửi `UF-15`; Người duyệt chi quyết trên snapshot, không phải Finance.                                                                        | Quyết định xong → frame 06; Finance ghi nhận qua `UF-11`.               |
| **06 · G1 đã duyệt và ghi nhận**      | Hiển thị quyết định thực tế khác đề nghị ban đầu và chỉ ghi số đã duyệt.                  | `APV-2026-118` giảm 8; `FIN-REN-2026-078`.                                          | Hệ thống ghi giảm 8, giữ buffer 4, tiết kiệm tại gia hạn 48 triệu/năm.                                                                          | Kết thúc nhánh G1; số này xuất hiện ở frame 18.                         |
| **07 · Danh sách G2**                 | Xử lý seat của người đã nghỉ việc với confidence tuyệt đối.                               | Ba Assignment có Employee=`Terminated`.                                             | IT xem banner “không cần Manager”; hệ thống không cung cấp CTA gửi xác nhận.                                                                    | Chọn ba seat → frame 08.                                                |
| **08 · Xác nhận G2 hàng loạt**        | Buộc IT xác nhận số lượng/lý do trước khi tạo task.                                       | `OPT-G2-20260917-014`, ba Assignment.                                               | IT gõ `3`, nhập lý do; hệ thống nhắc tạo task chưa nhả seat.                                                                                    | Xác nhận → frame 09.                                                    |
| **09 · Đã tạo task G2**               | Bàn giao thực thi sang `UF-08` mà không báo tiết kiệm sớm.                                | `PV-2058`, `PV-2059`, `PV-2061`.                                                    | Hệ thống giữ Assignment cho tới khi từng task đủ bằng chứng.                                                                                    | Mở `UF-08`; task hoàn tất mới cập nhật frame 18.                        |
| **10 · Danh sách G3/G4**              | Cho IT xem recommendation dựa trên usage, tách chưa từng dùng và không dùng lâu.          | Ba recommendation, source quality, coverage, match state.                           | IT lọc G3/G4 và chọn `REC-2026-331`.                                                                                                            | Mở evidence → frame 11.                                                 |
| **11 · Snapshot bằng chứng usage**    | Giúp người xem giải thích được recommendation đã sinh từ dữ liệu nào.                     | Coverage 120 ngày, identity match, activity definition, Assignment, confidence 92%. | IT kiểm tra source freshness, coverage, mapping và căn cứ “chưa từng hoạt động”.                                                                | Đủ căn cứ → frame 12; thiếu cổng thì recommendation không được gửi.     |
| **12 · Gửi batch cho Manager**        | Gom recommendation theo Manager và tuần để tránh thông báo rời rạc.                       | `MBR-2026-W38-009`, hai Manager, ba recommendation.                                 | IT/hệ thống gửi batch `UF-05`; snapshot evidence được cố định.                                                                                  | Chờ kết quả → frame 13.                                                 |
| **13 · Kết quả từ Manager**           | Phân biệt Thu hồi, Giữ và Miễn trừ; chỉ Thu hồi quay lại IT.                              | Kết quả `UF-05` cho ba recommendation.                                              | Hệ thống đóng nhánh Giữ, lưu hạn của Miễn trừ và đưa `REC-2026-331` Thu hồi vào IT queue.                                                       | Mở IT review → frame 14.                                                |
| **14 · IT review quyết định thu hồi** | Giữ phân tách trách nhiệm: Manager xác nhận nhu cầu, IT quyết và thực thi thay đổi quyền. | `REC-2026-331`, quyết định Manager, evidence snapshot.                              | IT chọn Đồng ý hoặc Không đồng ý.                                                                                                               | Đồng ý → frame 15; không đồng ý → frame 16.                             |
| **15 · IT đồng ý**                    | Tạo task thu hồi nhưng chưa nhả Assignment hay ghi tiết kiệm.                             | Recommendation đã được cả Manager và IT đồng ý.                                     | Hệ thống tạo `PV-2060`, giữ Assignment đến khi có bằng chứng.                                                                                   | Handoff `UF-08`, sau đó → frame 18.                                     |
| **16 · IT không đồng ý**              | Thu lý do bắt buộc khi IT bác kết quả thu hồi.                                            | Recommendation và evidence có thể chưa đủ/mới thay đổi.                             | IT nhập lý do; không thay đổi seat và không tạo task.                                                                                           | Xác nhận → frame 17.                                                    |
| **17 · Trả lại Manager xem xét**      | Bảo toàn snapshot và lịch sử khi cần đánh giá lại.                                        | Lý do IT không đồng ý và recommendation gốc.                                        | Hệ thống trả item về Manager, giữ audit, tăng lại hàng chờ Manager.                                                                             | Kết thúc nhánh B; có thể quay `UF-05` trong vòng sau.                   |
| **18 · Tổng kết tiết kiệm**           | Trình bày giá trị đã đủ điều kiện ghi nhận và phần vẫn chỉ là cơ hội.                     | G2 task results, G1 approval, `PV-2060` còn mở.                                     | Hệ thống hiển thị 740.000đ/tháng tiết kiệm ngay và 48 triệuđ/năm tại gia hạn trong hai ô riêng; Figma/Notion chưa đủ điều kiện không được cộng. | Kết thúc nhánh A hiện tại; cập nhật khi task/renewal có bằng chứng mới. |

### 7.3. Câu nói khi trình bày

> “Bốn nhóm lãng phí nhìn giống nhau ở dashboard nhưng không xử lý giống nhau. G1 là quyết định số lượng ở kỳ gia hạn, G2 thu hồi thẳng vì người đã nghỉ, còn G3/G4 phải đi qua Manager và IT. Hai loại tiết kiệm luôn tách riêng để không báo cáo phóng đại.”

---

## 8. `UF-12` — Phát hiện và hợp thức hóa phần mềm ngoài danh mục

**Mục đích:** Biến bằng chứng về SaaS chưa nằm trong danh mục thành một finding cần xem xét, sau đó để IT quyết định báo nhầm, hợp thức hóa hoặc chưa duyệt.

| Thuộc tính | Giá trị                                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| Tác nhân   | Finance nhập nguồn tài chính; IT Admin nhập nguồn IdP, xem finding và quyết định; Manager cung cấp bối cảnh đúng phạm vi |
| Kích hoạt  | Có sao kê, dữ liệu enterprise app/IdP hoặc bằng chứng từ bộ thu thập                                                     |
| Đầu vào    | Raw evidence, vendor dictionary, SaaS Catalog, phương pháp khớp, confidence, owner context                               |
| Đầu ra     | Finding đóng là báo nhầm; ứng dụng được hợp thức hóa và request chính thức; hoặc task thu hồi qua `UF-08`                |
| Nguyên tắc | Finding ngoài danh mục là bản ghi cần xem xét, **không phải kết luận vi phạm**; một vendor chỉ có một finding mở         |

### 8.1. Topology

```text
01 → 02 → chọn nguồn 03 / 04 / 05
→ 06 → phương pháp khớp
       ├─ exact/regex → 07
       └─ fuzzy/AI → 08 bắt buộc IT xác nhận
→ 09 → catalog?
       ├─ đã có → 10 kết thúc, không tạo finding
       └─ chưa có → 11 dedupe → 12 → 13 → 14 → 15
                                                ├─ Báo nhầm → 16
                                                ├─ Đã duyệt → 17 → 18
                                                └─ Chưa duyệt → 19 → UF-08
→ 20 xem audit tổng hợp ba loại kết cục
```

### 8.2. Frame-by-frame

| Frame UI                                | Màn hình này dùng để làm gì                                                                      | Dữ liệu đầu vào                                                            | Thao tác và xử lý trên màn hình                                                                                                                   | Đầu ra và bước tiếp theo                                         |
| --------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **01 · Dashboard Discovery**            | Cho IT/Finance thấy ba nguồn bằng chứng và số finding đang mở mà không gọi chúng là vi phạm.     | Các run gần nhất, 6 finding mở, trạng thái nguồn Finance/IdP/Collector.    | Người dùng chọn nguồn hoặc finding. Hệ thống chỉ tổng hợp, chưa kết luận.                                                                         | Xem đặc tính nguồn → frame 02 hoặc đi thẳng intake 03–05.        |
| **02 · Bản đồ nguồn bằng chứng**        | Giải thích mỗi nguồn chứng minh được gì và giới hạn ở đâu.                                       | Metadata ba nguồn và yêu cầu dữ liệu tối thiểu.                            | Người xem so sánh sao kê, enterprise app và collector; hệ thống nêu collector không có URL/nội dung và mù với domain chưa có trong từ điển.       | Chọn nguồn → frame 03, 04 hoặc 05.                               |
| **03 · Finance intake**                 | Nhận sao kê/hóa đơn làm bằng chứng có chi tiêu cho SaaS.                                         | File Finance, dòng raw `PAYPAL*CANVA PRO 0926`.                            | Finance upload và preview; hệ thống giữ nguyên raw value, tạo `EVD-FIN-8891`.                                                                     | Evidence vào pipeline chuẩn hóa → frame 06.                      |
| **04 · IdP intake**                     | Nhận dữ liệu ứng dụng doanh nghiệp/cấp quyền từ hệ thống định danh.                              | Export enterprise app, `EVD-IDP-4420`.                                     | IT import/preview; hệ thống chuẩn hóa identifier nhưng giữ nguồn gốc.                                                                             | Evidence vào pipeline → frame 06.                                |
| **05 · Collector intake**               | Nhận bằng chứng “có mở” từ thiết bị đã xác nhận mà không nhận dữ liệu vượt mục đích.             | Batch `EVD-COL-1728`, domain, khoảng ngày, số nhân viên đã xác nhận.       | Hệ thống kiểm privacy guard: không URL path, nội dung hay domain ngoài từ điển.                                                                   | Evidence hợp lệ → frame 06.                                      |
| **06 · Tổng quan chuẩn hóa**            | Cho thấy đường biến đổi từ raw evidence tới vendor và finding để có thể giải trình.              | Evidence từ 03/04/05.                                                      | Hệ thống chạy raw → normalized → match dictionary → compare catalog → finding.                                                                    | Mở phương pháp cụ thể → frame 07 hoặc 08.                        |
| **07 · Khớp tự động**                   | Xử lý exact/regex có quy tắc rõ và gắn confidence theo method.                                   | Raw/normalized value và VendorDictionary.                                  | Hệ thống tự map khi exact hoặc regex; lưu method và confidence.                                                                                   | So catalog → frame 09.                                           |
| **08 · Gợi ý cần IT xác nhận**          | Ngăn fuzzy/AI confidence thấp trở thành quyết định tự động.                                      | Gợi ý Canva, evidence và candidate vendor.                                 | IT xem raw value và xác nhận/bác gợi ý; hệ thống không cho đi tiếp nếu chưa có người xác nhận.                                                    | Mapping có audit → frame 09.                                     |
| **09 · Đối chiếu với SaaS Catalog**     | Xác định vendor đã nằm trong danh mục được duyệt hay chưa.                                       | Vendor đã chuẩn hóa và catalog hiện hành.                                  | Hệ thống đối chiếu `VendorDictionary` với catalog tổ chức.                                                                                        | Đã có → frame 10; chưa có → frame 11/12.                         |
| **10 · Vendor đã có trong catalog**     | Kết thúc bình thường khi evidence thuộc ứng dụng đã quản trị.                                    | Microsoft 365 đã khớp catalog.                                             | Hệ thống gắn evidence vào ứng dụng hiện có, không tạo finding Shadow IT.                                                                          | Kết thúc nhánh.                                                  |
| **11 · Chống trùng finding**            | Hợp nhất evidence mới với finding đang mở của cùng vendor.                                       | `EVD-COL-1741` và `FND-2026-045` Canva đang mở.                            | Hệ thống cập nhật last seen/evidence list, không sinh finding thứ hai.                                                                            | Mở queue → frame 12.                                             |
| **12 · Hàng đợi finding**               | Cho IT sắp xếp 6 finding theo risk tier, owner và trạng thái xử lý.                              | Danh sách finding đã dedupe.                                               | IT lọc và chọn `FND-2026-045`; hệ thống không dùng nhãn kết tội.                                                                                  | Mở chi tiết → frame 13.                                          |
| **13 · Chi tiết finding và evidence**   | Cung cấp bằng chứng bất biến để giải thích raw value đã được hiểu thế nào.                       | Finding, raw/normalized value, method, confidence, các evidence liên quan. | IT xem chain of evidence, 7 người liên quan và ước tính chi tiêu; chưa quyết định ở màn này.                                                      | Cần bối cảnh → frame 14; đủ căn cứ → frame 15.                   |
| **14 · Bối cảnh từ owner/Manager**      | Thu thêm lý do nghiệp vụ trong đúng cây quản lý trực tiếp.                                       | Owner candidate và người liên quan trong phạm vi Manager.                  | Hệ thống gửi yêu cầu bối cảnh; Manager trả lời “Marketing dùng Canva…”; không cho xem raw activity ngoài phạm vi.                                 | Bối cảnh được gắn finding → frame 15.                            |
| **15 · Quyết định của IT**              | Là điểm người thật chọn một trong ba kết cục và nhập lý do/audit.                                | Finding, evidence, risk tier, owner context.                               | IT chọn Báo nhầm / Đã duyệt / Chưa duyệt. Hệ thống buộc trường cần thiết theo lựa chọn.                                                           | Báo nhầm → 16; Đã duyệt → 17; Chưa duyệt → 19.                   |
| **16 · Kết cục Báo nhầm**               | Đóng finding nhưng cho phép mở lại khi có evidence mới.                                          | Quyết định và lý do báo nhầm.                                              | Hệ thống ghi actor/timestamp/rule reopen; không xóa evidence.                                                                                     | Kết thúc nhánh; evidence mới có thể reopen.                      |
| **17 · Form hợp thức hóa vào danh mục** | Thu đủ thông tin catalog khi IT chọn “Đã duyệt”.                                                 | Vendor, business context, 7 người dùng hiện tại.                           | IT khai application/package/Business Owner và thông tin quản trị bắt buộc.                                                                        | Tạo catalog item và dữ liệu cho request → frame 18.              |
| **18 · Hợp thức hóa thành công**        | Khép vòng Shadow IT về quy trình chính thức mà không bắt người dùng hiện hữu xin lại từ đầu.     | `CAT-CANVA-01`, `REQ-2026-212`, 7 người dùng.                              | Hệ thống tạo request mua chính thức để đi qua luồng duyệt phù hợp, ghi 7 quyền với nguồn “Regularized from finding” và đánh dấu finding Đã duyệt. | Tiếp tục luồng request/cấp phát tương ứng; kết thúc nhánh UF-12. |
| **19 · Chưa duyệt, bàn giao thu hồi**   | Chuyển quyết định không chấp nhận sang thực thi có kiểm soát; không tự revoke ngay trên finding. | Finding và lý do chưa duyệt.                                               | Hệ thống tạo handoff/task `PV-2074` cho `UF-08` và hướng người dùng sang công cụ đã duyệt.                                                        | `UF-08` thực thi; finding theo dõi kết quả.                      |
| **20 · Audit summary**                  | Cho phép giải trình lịch sử và ba loại kết cục của phân hệ.                                      | Timeline các finding mẫu.                                                  | Người xem lọc actor, evidence và quyết định. Ba kết cục được minh họa song song nhưng không phải một finding đã đi qua cả ba.                     | Kết thúc tra cứu.                                                |

### 8.3. Câu nói khi trình bày

> “UF-12 bắt đầu từ bằng chứng chứ không bắt đầu từ kết luận. Hệ thống giữ cả giá trị thô và cách chuẩn hóa, chống trùng finding, lấy thêm bối cảnh rồi mới để IT chọn báo nhầm, hợp thức hóa hoặc chưa duyệt.”

---

## 9. `UF-14` — IT Admin xử lý sai lệch và mâu thuẫn dữ liệu

**Mục đích:** So sánh ý định nội bộ với thực tế nhà cung cấp/hóa đơn, giữ cả hai giá trị và buộc mọi sai lệch thật có owner cùng quyết định xử lý.

| Thuộc tính | Giá trị                                                                                                                           |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Tác nhân   | IT Admin, Finance, hệ thống đối soát; Security tham gia nhánh quyền ngoài quy trình                                               |
| Kích hoạt  | Job đối soát định kỳ hoặc Finance import hóa đơn                                                                                  |
| Đầu vào    | Assignment/ProvisioningTask nội bộ, danh sách thành viên NCC, hóa đơn, subscription và usage thực tế                              |
| Đầu ra     | Task pending được hoàn tất bằng bằng chứng; sai lệch được cấp lại/điều chỉnh/thu hồi/hợp thức hóa; audit giữ đủ hai nguồn         |
| Nguyên tắc | Nội bộ là nguồn ý định, NCC là nguồn thực tế; không nguồn nào tự ghi đè nguồn kia; app không có connector không sinh sai lệch giả |

### 9.1. Các nhánh

```text
01
├─ Nhà cung cấp có connector
│  ├─ task chờ chấp nhận → 02 → active đúng tài khoản → 03
│  ├─ hệ thống có, NCC không có → 05 → 06 → 07 → UF-08
│  └─ NCC có, hệ thống không biết → 13 → 14 → 15 → UF-08 hoặc UF-12 → 16
├─ Nhà cung cấp không connector → 04 kết thúc, không sinh sai lệch
└─ Hóa đơn → 08 → 09 → 10 → 11 → 12 → 16
```

### 9.2. Frame-by-frame

| Frame UI                                  | Màn hình này dùng để làm gì                                                             | Dữ liệu đầu vào                                                           | Thao tác và xử lý trên màn hình                                                                                                                                  | Đầu ra và bước tiếp theo                                                               |
| ----------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **01 · Trung tâm đối soát dữ liệu**       | Là workbench chung để chọn đối soát thành viên, hóa đơn hoặc task pending.              | 3 lệch NCC, 1 lệch hóa đơn, 2 task chờ chấp nhận, các run gần nhất.       | IT/Finance chọn ứng dụng/run hoặc chạy đối soát mới.                                                                                                             | NCC → frame 02/04/05/13; hóa đơn → frame 08.                                           |
| **02 · Chi tiết đối soát GitHub**         | Kiểm tra xem thành viên mới có liên quan tới task `UF-08` đang chờ chấp nhận hay không. | Danh sách GitHub active/pending, `PV-2041`, employee/account expected.    | IT bấm kiểm tra trạng thái; hệ thống ghép đúng task và đúng tài khoản.                                                                                           | Active đúng tài khoản → frame 03; vẫn pending → giữ chờ; sai/hết hạn → queue sai lệch. |
| **03 · Hoàn tất task chờ chấp nhận**      | Dùng bằng chứng NCC để chuyển chính task cũ từ pending sang hoàn tất.                   | GitHub xác nhận account active đúng identity.                             | Hệ thống ghi evidence, hoàn tất `PV-2041`, cập nhật Assignment và audit; đây không phải tự đóng một discrepancy vì record được nhận diện là task pending hợp lệ. | Trả kết quả về `UF-08`; pending count giảm.                                            |
| **04 · Ứng dụng không có connector**      | Ngăn hệ thống suy đoán thiếu tài khoản khi không có dữ liệu nhà cung cấp.               | Canva quản lý thủ công, không API connector.                              | Hiển thị giới hạn nguồn và lịch sử manual; không tạo comparison giả.                                                                                             | Kết thúc nhánh với “không đối soát”.                                                   |
| **05 · Hệ thống có, NCC không có**        | Trình bày song song quyền đã duyệt và việc tài khoản thật đang thiếu.                   | `DISC-2026-081`, Assignment Figma, kết quả NCC không tìm thấy account.    | IT xem ý định nội bộ, thực tế NCC, mức độ và owner; hệ thống giữ cả hai.                                                                                         | Mở quyết định → frame 06.                                                              |
| **06 · Modal cấp lại hoặc không cấp lại** | Buộc người thật chọn cách xử lý discrepancy thiếu account.                              | Sai lệch Figma và căn cứ phê duyệt.                                       | IT chọn tạo task cấp lại hoặc xác nhận không cần cấp lại, nhập lý do bắt buộc.                                                                                   | Cấp lại → tạo task sang `UF-08`; quyết định được ghi → frame 07.                       |
| **07 · Đóng sai lệch có quyết định**      | Kết thúc record sau khi có owner/actor/lý do và liên kết task thực thi.                 | Decision `DEC-4401`, task `PV-2065` nếu cấp lại.                          | Hệ thống đóng discrepancy theo quyết định, giữ link task và audit.                                                                                               | `UF-08` thực thi task; quay workbench.                                                 |
| **08 · Bàn làm việc đối soát hóa đơn**    | Ghép invoice Finance nhập với đúng subscription trước khi so số lượng.                  | `INV-2026-09-001`, vendor Slack, amount/currency/date.                    | Finance kiểm tra match với `SUB-SLK-BP-01`.                                                                                                                      | Có subscription đích → frame 09.                                                       |
| **09 · Ba con số cạnh nhau**              | Làm rõ chênh lệch giữa hóa đơn, hợp đồng nội bộ và mức đang dùng mà không tự sửa.       | 55 seat trên hóa đơn, 50 khai nội bộ, 48 active.                          | Finance xem ba nguồn và chênh +5/$75; hệ thống giữ nguyên các giá trị.                                                                                           | Phân loại nguyên nhân → frame 10.                                                      |
| **10 · Phân định nguyên nhân hóa đơn**    | Buộc discrepancy về một trong ba nguyên nhân có thể hành động.                          | Invoice, subscription, usage và chứng từ liên quan.                       | Finance chọn: mua thêm chưa cập nhật / NCC tính sai / dữ liệu nội bộ sai; nhập chứng từ và owner.                                                                | Nếu dữ liệu nội bộ cần sửa → frame 11; khiếu nại NCC hoặc xử lý khác theo nguyên nhân. |
| **11 · Điều chỉnh subscription nội bộ**   | Sửa dữ liệu nội bộ theo nguyên nhân đã được xác định mà không xóa lịch sử cũ.           | `SUB-SLK-BP-01`, 50→55 seat, invoice và request căn cứ.                   | IT/Finance lưu phiên bản mới; hệ thống giữ old/new value cùng actor và timestamp.                                                                                | Đối soát lại → frame 12.                                                               |
| **12 · Đóng đối soát hóa đơn**            | Xác nhận hóa đơn đã khớp và cập nhật trạng thái tài chính liên quan.                    | Invoice đã reconcile, subscription đã sửa, BudgetCommitment liên quan.    | Finance đóng reconciliation; hệ thống ghi chi phí thực tế/chuyển trạng thái cam kết theo vòng đời, không xóa lịch sử.                                            | Invoice mismatch về 0 → frame 16 hoặc quay frame 01.                                   |
| **13 · NCC có, hệ thống không biết**      | Phát hiện quyền ngoài quy trình và nâng mức ưu tiên để điều tra.                        | Account GitHub active nhưng không có Assignment.                          | IT xem account, role, ứng dụng và owner; hệ thống gắn mức rất cao nhưng chưa tự tạo Assignment hay tự thu hồi.                                                   | Mở điều tra → frame 14.                                                                |
| **14 · Điều tra tài khoản ngoài luồng**   | Thu thập nguồn gốc và tác động trước khi chọn hợp thức hóa hay thu hồi.                 | Account, người tạo, timestamp, repo/resource đã truy cập.                 | IT/Security xem bằng chứng; chọn đề xuất hợp thức hóa qua `UF-12` hoặc thu hồi qua `UF-08`.                                                                      | Mở xác nhận quyết định → frame 15.                                                     |
| **15 · Xác nhận quyết định an ninh**      | Ghi quyết định của người thật, kết luận điều tra và task thực thi.                      | Evidence điều tra và lựa chọn xử lý.                                      | Security/IT nhập kết luận, chọn thu hồi khẩn hoặc chuyển hợp thức hóa; hệ thống không tự quyết.                                                                  | Thu hồi → `UF-08`; hợp thức hóa → `UF-12`; record đóng có quyết định.                  |
| **16 · Sổ nhật ký đối soát**              | Chứng minh mọi discrepancy đều giữ nguồn, owner, quyết định và liên kết task.           | Lịch sử member mismatch, invoice mismatch, shadow access và pending task. | IT/Auditor lọc và xem bằng chứng/audit. Pending task active được phân biệt với discrepancy có human decision.                                                    | Kết thúc `UF-14` hoặc mở lại record liên kết.                                          |

### 9.3. Câu nói khi trình bày

> “UF-14 không chọn một nguồn rồi ghi đè nguồn còn lại. Nội bộ nói tổ chức định làm gì, nhà cung cấp/hóa đơn nói thực tế đang xảy ra gì; độ lệch giữa hai bên được giữ lại thành việc có owner và quyết định.”

---

## 10. `UF-16` — IT Admin triển khai bộ thu thập, nhân viên xác nhận theo dõi

**Mục đích:** Thu usage tối thiểu từ tiện ích trình duyệt trên thiết bị công ty, chỉ sau khi thiết bị được đăng ký và nhân viên xác nhận đã đọc thông báo; lọc dữ liệu ngay tại máy trước khi gửi.

| Thuộc tính | Giá trị                                                                                                               |
| ---------- | --------------------------------------------------------------------------------------------------------------------- |
| Tác nhân   | IT Admin đăng ký/cấu hình; Employee đọc và xác nhận; extension/gateway xử lý tự động                                  |
| Kích hoạt  | IT đăng ký một thiết bị công ty cho nhân viên                                                                         |
| Đầu vào    | Device registration, employee, thời gian hiệu lực, catalog/vendor dictionary, communication flag, phiên bản thông báo |
| Đầu ra     | Daily aggregate đã kiểm schema và khớp Assignment; trạng thái thiết bị/confirmation; record bị từ chối có lý do       |
| Handoff    | Dữ liệu hợp lệ vào cùng tầng identity/usage của `UF-06`, sau đó sẵn sàng cho G3/G4 ở `UF-10`                          |
| Giới hạn   | Chỉ là biện pháp thiết kế về minh bạch, tối thiểu hóa và xác nhận; không phải chứng nhận tuân thủ pháp luật           |

### 10.1. Topology

```text
01 → 02 → 03 → 04 → 05 → 06 → [07 nếu xem/yêu cầu dừng]
→ quyết định xác nhận
   ├─ Chưa xác nhận → 08 kết thúc, gateway khóa
   └─ Đã xác nhận → 09 → 10 → 11
                               ├─ payload sai → 12 từ chối
                               └─ payload đúng → 13 → 14 → 15 → 16 → UF-10
```

### 10.2. Frame-by-frame

| Frame UI                                      | Màn hình này dùng để làm gì                                                               | Dữ liệu đầu vào                                                                         | Thao tác và xử lý trên màn hình                                                                                                                         | Đầu ra và bước tiếp theo                                                            |
| --------------------------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **01 · Dashboard bộ thu thập và thiết bị**    | Cho IT theo dõi độ phủ triển khai và chất lượng tiếp nhận ở mức thiết bị.                 | 24 thiết bị đăng ký, 18 xác nhận, 6 chờ, 3 record bị từ chối.                           | IT lọc/xem thiết bị hoặc bấm đăng ký mới. Không có bảng xếp hạng thời gian theo người.                                                                  | Mở đăng ký → frame 02; xem trạng thái vận hành → frame 15.                          |
| **02 · Đăng ký thiết bị ↔ nhân viên**         | Tạo quan hệ có thời hạn giữa máy công ty và người đang sử dụng.                           | Device ID/serial, employee, ngày bàn giao/effective period.                             | IT nhập và xác nhận; hệ thống kiểm thiết bị/nhân viên hợp lệ, tạo registration nhưng chưa nhận usage.                                                   | Registered 24→25, pending 6→7 → frame 03.                                           |
| **03 · Sinh allowlist và danh sách loại trừ** | Xác định domain nào được phép đo trước khi extension chạy.                                | SaaS Catalog, VendorDictionary, communication flag.                                     | Hệ thống sinh allowlist và loại tuyệt đối Slack/Teams/Zoom/Gmail/Zalo hoặc app liên lạc khác; IT xem lại cấu hình.                                      | Chính sách nguồn cho thiết bị → frame 04.                                           |
| **04 · Phát hành thông báo phiên bản**        | Gửi đúng nội dung minh bạch đang có hiệu lực tới nhân viên của thiết bị.                  | Notification content version `v1.2`, employee, device.                                  | IT phát hành; hệ thống gửi qua kênh nội bộ/email và lưu phiên bản, đối tượng, timestamp.                                                                | Employee nhận thông báo → frame 05.                                                 |
| **05 · Cổng nhân viên nhận thông báo**        | Đưa yêu cầu đọc thông báo vào đúng tài khoản tự phục vụ của nhân viên.                    | Notification `v1.2` gắn với `DEV-MBP-2026-088`.                                         | Employee mở chi tiết; hệ thống chưa mở gateway chỉ vì thông báo đã gửi.                                                                                 | Xem nội dung → frame 06.                                                            |
| **06 · Chi tiết thông báo minh bạch**         | Giải thích rõ dữ liệu thu/không thu, mục đích, lưu giữ và quyền yêu cầu dừng.             | Phiên bản nội dung hiện hành và policy của tổ chức.                                     | Employee đọc năm nhóm thông tin. Mốc 6 tháng là chính sách thiết kế hiện hành; màn hình không được diễn đạt thành kết luận pháp lý.                     | Xem quyền → frame 07 hoặc tới bước xác nhận frame 09.                               |
| **07 · Quyền yêu cầu dừng thu thập**          | Cung cấp đường gửi yêu cầu của chủ thể dữ liệu thay vì nút tắt không audit.               | Device/employee registration và policy request.                                         | Employee gửi yêu cầu dừng; hệ thống tạo yêu cầu theo `F-40`/`FR-10.5`. Yêu cầu chưa tự xóa dữ liệu hoặc giả trạng thái đã xử lý.                        | Khi yêu cầu được xử lý, thiết bị ngừng được nhận dữ liệu; quay trạng thái giám sát. |
| **08 · Chưa xác nhận — gateway khóa**         | Chứng minh không có đường dữ liệu vào trước active confirmation.                          | Registration tồn tại nhưng chưa có confirmation cho `v1.2`.                             | IT xem trạng thái khóa; gateway từ chối mọi payload của thiết bị. Hệ thống không suy “không hoạt động” từ việc thiếu dữ liệu.                           | Kết thúc nhánh chưa xác nhận; app chỉ được đánh giá bằng nguồn khác đủ điều kiện.   |
| **09 · Nhân viên xác nhận chủ động**          | Thu hành động xác nhận rõ ràng và gắn với đúng phiên bản nội dung.                        | Thông báo `v1.2`, employee và device.                                                   | Employee tick đã đọc/hiểu và xác nhận. Hệ thống lưu version, timestamp và metadata cần thiết; không dùng wording này để khẳng định consent pháp lý.     | Confirmation hợp lệ → frame 10.                                                     |
| **10 · Mở gateway cho thiết bị**              | Chuyển registration sang trạng thái được phép gửi dữ liệu.                                | Registration + confirmation `v1.2`.                                                     | Hệ thống cập nhật confirmed 18→19, pending 7→6 và cấp credential kỹ thuật cho extension; UI không hiển thị secret thô.                                  | Extension bắt đầu tổng hợp → frame 11.                                              |
| **11 · Lọc tại máy và payload tối giản**      | Minh họa dữ liệu được bỏ bớt trước khi rời thiết bị.                                      | Hoạt động tab foreground/non-idle và allowlist.                                         | Extension chỉ giữ `device_id`, domain, date, active_minutes; loại URL path/query/title/content/keystroke/screenshot/location và domain ngoài allowlist. | Gửi daily aggregate → frame 12 hoặc 13.                                             |
| **12 · Gateway từ chối record sai**           | Cho IT thấy lớp bảo vệ thứ hai khi payload/thiết bị không hợp lệ.                         | Payload từ thiết bị chưa đăng ký, chưa xác nhận hoặc chứa field lạ như `full_url`.      | Gateway từ chối, ghi `ERR_INVALID_SCHEMA`/lý do audit; không đưa record vào usage pipeline.                                                             | Rejected 3→4; kết thúc record lỗi, xem ở frame 15.                                  |
| **13 · Gateway xác thực record hợp lệ**       | Xác nhận ba guard đã vượt qua trước khi record vào phân tích.                             | Payload từ device đã đăng ký, đã xác nhận đúng version và đúng schema.                  | Gateway kiểm registration, confirmation, schema rồi đóng dấu verified.                                                                                  | Chuyển identity/usage processor → frame 14.                                         |
| **14 · Khớp danh tính và đánh giá activity**  | Gắn aggregate thiết bị với đúng Assignment và áp dụng định nghĩa hoạt động của nguồn.     | Device registration, employee, domain→application, 85 phút GitHub, Assignment hiệu lực. | Hệ thống khớp về `ASN-4901`; so với ngưỡng ≥15 phút/ngày và đánh dấu Active Day. Nếu không khớp thì đưa vào queue `UF-07`, không kết luận.              | Usage aggregate hợp lệ → frame 15/16.                                               |
| **15 · Bảng giám sát bộ thu thập**            | Giúp IT vận hành chất lượng nguồn mà không biến dữ liệu thành công cụ xếp hạng nhân viên. | Registration, confirmation version, last sent, rejected count/reason.                   | IT xem sức khỏe thiết bị và lỗi; màn hình không có xếp hạng số phút theo người.                                                                         | Khắc phục nguồn hoặc xem bàn giao → frame 16.                                       |
| **16 · Bàn giao dữ liệu cho tối ưu**          | Xác nhận daily aggregate đã qua guard và sẵn sàng cho rule G3/G4.                         | Record đã verified, matched, có coverage/activity definition.                           | Hệ thống cập nhật nguồn usage và độ mới; không tự sinh recommendation nếu coverage/identity chưa đạt cổng.                                              | Handoff `UF-10`.                                                                    |

### 10.3. Câu nói khi trình bày

> “UF-16 không gửi lịch sử duyệt web thô lên máy chủ. IT đăng ký thiết bị, hệ thống sinh allowlist và gửi thông báo; chỉ sau khi nhân viên xác nhận đúng phiên bản thì gateway mới mở. Extension lọc ngay trên máy, còn gateway tiếp tục chặn thiết bị hoặc schema không hợp lệ.”

---

## 11. Bảng handoff giữa các flow

| Flow nguồn | Điều kiện bàn giao                            | Dữ liệu/bản ghi được giữ nguyên                                | Flow đích | Ý nghĩa                                          |
| ---------- | --------------------------------------------- | -------------------------------------------------------------- | --------- | ------------------------------------------------ |
| `UF-06`    | Có external identifier chưa khớp              | Import ID, source, raw/normalized identifier, usage record     | `UF-07`   | Xử lý identity mà không chặn phần file hợp lệ    |
| `UF-06`    | Commit phần hợp lệ thành công                 | Coverage, activity definition, Assignment-linked usage         | `UF-10`   | Rule engine có đầu vào đủ căn cứ                 |
| `UF-16`    | Payload verified và khớp Assignment           | Device/source metadata, date, domain, active minutes, coverage | `UF-10`   | Bổ sung nguồn usage cho G3/G4                    |
| `UF-07`    | Mapping hoàn tất                              | IdentityMapping, actor, method, confidence                     | `UF-10`   | Tính lại usage/recommendation liên quan          |
| `UF-09`    | IT đã xác nhận batch thu hồi                  | `OFF-2026-044`, Assignment, `PV-2042…2046`                     | `UF-08`   | Thực thi xóa account thật                        |
| `UF-10`    | G2 hoặc G3/G4 được IT đồng ý thu hồi          | Recommendation, Assignment, evidence snapshot, task ID         | `UF-08`   | Thay đổi quyền có kiểm soát                      |
| `UF-08`    | Invitation còn pending                        | Chính `ProvisioningTask`, expected identity, provider response | `UF-14`   | Đối soát active membership trước khi hoàn tất    |
| `UF-14`    | Sai lệch cần cấp lại/thu hồi                  | Discrepancy ID, decision, Assignment/account, task ID          | `UF-08`   | Thực thi quyết định mà vẫn giữ dấu vết mâu thuẫn |
| `UF-14`    | Account ngoài quy trình có thể được chấp nhận | Discrepancy/evidence/owner context                             | `UF-12`   | Hợp thức hóa qua quyết định và danh mục          |
| `UF-12`    | IT chọn Chưa duyệt                            | Finding, decision, user/account, `PV-2074`                     | `UF-08`   | Thu hồi; không tự revoke từ màn finding          |

---

## 12. Thứ tự trình bày đề xuất

Nếu cần trình bày toàn bộ nhóm flow IT Admin theo một câu chuyện liên tục, dùng thứ tự sau:

1. **Nguồn dữ liệu:** `UF-06` và `UF-16` giải thích usage đến từ file hoặc bộ thu thập như thế nào.
2. **Chất lượng danh tính:** `UF-07` giải thích cách loại dữ liệu chưa khớp khỏi kết luận.
3. **Tạo giá trị:** `UF-10` cho thấy dữ liệu trở thành G1–G4 và tiết kiệm như thế nào.
4. **Thực thi:** `UF-08` cho thấy quyết định được biến thành account thật/thu hồi thật và xử lý lỗi ra sao.
5. **Kịch bản ưu tiên:** `UF-09` trình bày offboarding đầu-cuối, vừa giảm chi phí vừa đóng quyền truy cập.
6. **Shadow IT:** `UF-12` giải thích phát hiện ngoài danh mục nhưng không kết tội.
7. **Đối soát:** `UF-14` giải thích khi dữ liệu nội bộ, NCC và hóa đơn không khớp thì hệ thống xử lý thế nào.

Nếu thời gian ngắn, trình bày `UF-09 → UF-10 → UF-08`. Nếu bị hỏi “dữ liệu usage ở đâu ra”, mở `UF-06`; nếu hỏi về theo dõi trên thiết bị, mở `UF-16`; nếu hỏi hai nguồn mâu thuẫn, mở `UF-14`.

---

## 13. Ghi chú về các artefact hiện có

1. **UF-06 storyboard là tập trạng thái, không phải 12 bước luôn nối thẳng.** Ở bản Light, frame 03 chặn Slack nhưng frame 04 vẫn dùng Slack làm ví dụ thông báo lần đầu. Theo BRD/draw.io, hai frame này không được nối thành một đường chạy: Slack đã bị chặn ở frame 03 thì phải kết thúc. Bản Dark biểu diễn đúng ý nhánh rõ hơn: frame 03 dùng Microsoft Teams cho nhánh chặn, frame 04 dùng Microsoft 365 cho nhánh lần đầu.
2. **UF-06 frame 06 có trạng thái coverage lỗi.** Đây là màn validation; không được thuyết trình rằng hệ thống vẫn cho đi tiếp khi chưa sửa khoảng ngày.
3. **UF-16 frame 06/16 có câu chữ mạnh hơn nguồn nghiệp vụ.** Khi trình bày, dùng cách diễn đạt trong tài liệu này: hệ thống áp dụng biện pháp thiết kế minh bạch, tối thiểu hóa và xác nhận; không nói “đã kiểm chứng tính hợp pháp”.
4. **UF-12 finding không phải vi phạm.** Chỉ sau điều tra và quyết định của người thật mới có hành động tiếp theo.
5. **UF-08/UF-10 phải giữ đúng phân tách trách nhiệm hiện hành:** Người duyệt chi quyết định; hệ thống tạo khoản cam kết; Finance ghi nhận sau duyệt và không chặn IT thực thi.
6. [`Ui-spec.md`](Ui-spec.md) là Screen Flows v1.0 cũ, không phải nguồn UI hiện hành cho tám flow này. Dùng các spec `UF-xx-Figma-Design-Spec.md` và ảnh FullFrames.

---

## 14. Truy vết nguồn

| Flow    | Nguồn topology                                             | Nguồn frame/UI                                                                                                                   |
| ------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `UF-06` | [UF-06.drawio](../Diagrams/user-flows/drawio/UF-06.drawio) | [UF-06 Figma spec](UF-06-Figma-Design-Spec.md) · [Light frames](UF-06-FullFrames/Light/) · [Dark frames](UF-06-FullFrames/Dark/) |
| `UF-07` | [UF-07.drawio](../Diagrams/user-flows/drawio/UF-07.drawio) | [UF-07 Figma spec](UF-07-Figma-Design-Spec.md) · [Light frames](UF-07-FullFrames/Light/) · [Dark frames](UF-07-FullFrames/Dark/) |
| `UF-08` | [UF-08.drawio](../Diagrams/user-flows/drawio/UF-08.drawio) | [UF-08 Figma spec](UF-08-Figma-Design-Spec.md) · [Light frames](UF-08-FullFrames/Light/) · [Dark frames](UF-08-FullFrames/Dark/) |
| `UF-09` | [UF-09.drawio](../Diagrams/user-flows/drawio/UF-09.drawio) | [UF-09 Figma spec](UF-09-Figma-Design-Spec.md) · [Light frames](UF-09-FullFrames/Light/) · [Dark frames](UF-09-FullFrames/Dark/) |
| `UF-10` | [UF-10.drawio](../Diagrams/user-flows/drawio/UF-10.drawio) | [UF-10 Figma spec](UF-10-Figma-Design-Spec.md) · [Light frames](UF-10-FullFrames/Light/) · [Dark frames](UF-10-FullFrames/Dark/) |
| `UF-12` | [UF-12.drawio](../Diagrams/user-flows/drawio/UF-12.drawio) | [UF-12 Figma spec](UF-12-Figma-Design-Spec.md) · [Light frames](UF-12-FullFrames/Light/) · [Dark frames](UF-12-FullFrames/Dark/) |
| `UF-14` | [UF-14.drawio](../Diagrams/user-flows/drawio/UF-14.drawio) | [UF-14 Figma spec](UF-14-Figma-Design-Spec.md) · [Light frames](UF-14-FullFrames/Light/) · [Dark frames](UF-14-FullFrames/Dark/) |
| `UF-16` | [UF-16.drawio](../Diagrams/user-flows/drawio/UF-16.drawio) | [UF-16 Figma spec](UF-16-Figma-Design-Spec.md) · [Light frames](UF-16-FullFrames/Light/) · [Dark frames](UF-16-FullFrames/Dark/) |

Các nhóm yêu cầu BRD được dùng trực tiếp: `FR-4.x` (usage, identity, G1–G4, collector), `FR-6.x` (Shadow IT), `FR-7.x` (import/preview/mâu thuẫn nguồn), `FR-10.x` (minh bạch, quyền chủ thể, lưu giữ); cùng các vòng đời `Assignment`, `ProvisioningTask`, `Recommendation/Finding` và `BudgetCommitment` tại mục 5.12.3.
