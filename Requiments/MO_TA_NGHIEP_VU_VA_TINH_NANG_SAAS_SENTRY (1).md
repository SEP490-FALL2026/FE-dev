# Mô tả nghiệp vụ và tính năng hệ thống SaaS-Sentry

> **Dành cho:** giảng viên, khách hàng, người dùng doanh nghiệp và những người chưa biết về dự án.
>
> **Mục đích:** giải thích bằng ngôn ngữ dễ hiểu: hệ thống giải quyết vấn đề gì, ai sử dụng, làm được gì, hoạt động theo quy tắc nào, và không làm những gì.
>
> **Đây là tài liệu diễn giải, không phải nguồn có thẩm quyền.** Nguồn có thẩm quyền là **BRD SaaS-Sentry v3.11** và **Sổ quyết định dự án** (tới `QĐ-30`, ngày 16/09/2026). Khi tài liệu này và hai nguồn đó khác nhau, hai nguồn đó đúng.
>
> **Cập nhật 18/09/2026:** đồng bộ theo BRD v3.11 — trước đây tài liệu dựa trên v3.7. Thêm vai trò **Người duyệt chi**; Tài chính chuyển sang **kiểm soát ngân sách**; bỏ ủy quyền duyệt; bỏ phòng ban; thêm **tiện ích trình duyệt** làm nguồn bằng chứng sử dụng; viết lại các mục 5.5 → 5.8. Phần về nguồn bằng chứng dựa trên [nghiên cứu và PoC ngày 18/09/2026](../Research-AI/usage-evidence-methods-comparison-and-poc-2026-09-18.md).
>
> **Bổ sung 18/09/2026:** mục **8.1** đề xuất demo ít nhất bốn dịch vụ bằng hoạt động thật từ API chính thức, không cần đo thời gian trên máy. Phân biệt hoạt động quan sát được, tài khoản trả phí và thiết bị công ty; làm rõ gói miễn phí, chi phí demo và Claude/Codex trong IDE. Đây **chưa phải** bốn connector đã kiểm thử thành công hay quyết định thay thế `QĐ-21`/`QĐ-28a`.
>
> **Ký hiệu ᴼ:** nội dung do **Owner / nhóm trưởng chốt** trong sổ quyết định, có tham khảo góp ý của mentor hoặc GVHD, nhưng **chưa có xác nhận trực tiếp** của mentor hoặc GVHD. Đây là các điểm cần được duyệt tại mục 10.

## 1. Tóm tắt đề tài

**SaaS-Sentry** là **hệ thống quản trị nội bộ** cho doanh nghiệp dùng nhiều phần mềm thuê bao qua Internet (SaaS), ví dụ Figma, GitHub, Jira, Notion hay Microsoft 365. Hệ thống gom thông tin về phần mềm, hợp đồng, quyền sử dụng, mức sử dụng và chi phí về một nơi, để doanh nghiệp trả lời được bốn câu hỏi:

1. Doanh nghiệp đang mua những phần mềm nào, theo điều kiện và thời hạn nào?
2. Ai đang được cấp quyền sử dụng từng phần mềm?
3. Quyền đã cấp có thực sự đang được sử dụng không?
4. Khoản chi này thuộc đơn vị chịu chi phí hoặc dự án nào?

Hệ thống không thay thế bộ phận mua sắm, tài chính hay CNTT. Nó giúp các bộ phận này nhìn chung một bức tranh dữ liệu, nhận cảnh báo đúng lúc và ra quyết định dựa trên bằng chứng. **Phạm vi SaaS-Sentry không quản lý doanh thu bán hàng của doanh nghiệp**; hệ thống tập trung vào **chi phí, quyền sử dụng và tiết kiệm phần mềm**.

### 1.1. Thuật ngữ cần biết

Tài liệu ưu tiên tiếng Việt. Một số từ tiếng Anh được giữ trong ngoặc vì hay gặp trên giao diện hoặc trong tài liệu nhà cung cấp.

| Thuật ngữ                                       | Giải thích dễ hiểu                                                                                                                                              |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SaaS**                                        | Phần mềm dùng qua Internet, thường trả tiền theo tháng hoặc năm                                                                                                 |
| **License / quyền sử dụng**                     | Quyền cho doanh nghiệp hoặc một người dùng sử dụng phần mềm theo điều kiện đã mua                                                                               |
| **Seat / suất dùng**                            | Một chỗ sử dụng cho một người trong gói tính tiền theo đầu người. Mua 10 seat Figma thì tối đa 10 người được cấp                                                |
| **Gói tính tiền (pricing model)**               | Cách nhà cung cấp tính phí: theo đầu người, giá cố định, theo mức tiêu thụ… Không phải gói nào cũng đếm được seat                                               |
| **Danh mục phần mềm (Catalog)**                 | Danh sách phần mềm doanh nghiệp đã ghi nhận hoặc phê duyệt                                                                                                      |
| **Business Owner / người sở hữu nghiệp vụ**     | Người hiểu ứng dụng phục vụ việc gì và ai nên dùng. Không phải vai trò đăng nhập riêng                                                                          |
| **Cost center / đơn vị chịu chi phí**           | Đơn vị hoặc dự án mà khoản chi được quy về để theo dõi ngân sách. Mỗi nhân viên thuộc đúng một cost center tại mỗi thời điểm                                    |
| **Quản lý trực tiếp**                           | Người mà nhân viên báo cáo trực tiếp. Hệ thống tổ chức theo **cây quản lý trực tiếp** và cost center, **không** theo phòng ban                                  |
| **Thuê bao (Subscription)**                     | Một lần mua cụ thể: gói nào, bao nhiêu seat, giá bao nhiêu, trong thời gian nào                                                                                 |
| **Yêu cầu (Request)**                           | Phiếu xin cấp mới, đổi gói, gia hạn hoặc trả lại quyền sử dụng                                                                                                  |
| **Cấp quyền (Assignment)**                      | Bản ghi doanh nghiệp đã quyết định cho ai dùng phần mềm nào, trong thời gian nào                                                                                |
| **Tác vụ cấp phát (Provisioning Task)**         | Việc tạo, thu hồi hoặc cập nhật tài khoản thật ở phía nhà cung cấp sau khi đã có quyết định                                                                     |
| **Người duyệt chi**                             | Người có thẩm quyền chi của công ty, mặc định là CEO, quyết định cuối cho các khoản chi phần mềm ᴼ                                                              |
| **Snapshot ngân sách**                          | Ảnh chụp số liệu ngân sách hiện ra ngay tại màn hình duyệt chi: ngân sách, thực chi, cam kết đang giữ, còn lại, phần đang chờ duyệt ᴼ                           |
| **Khoản cam kết ngân sách**                     | Số tiền được _giữ chỗ_ trong ngân sách ngay khi Người duyệt chi duyệt một khoản chi, trước khi có hóa đơn thật ᴼ                                                |
| **Tài khoản / seat / sử dụng**                  | Ba điều khác nhau: _có tài khoản_ ở nhà cung cấp, _đang chiếm một seat_ trả tiền, và _thực sự dùng_. Có hai điều đầu **không** chứng minh điều thứ ba           |
| **Dữ liệu sử dụng (usage)**                     | Dữ liệu cho biết một người có hoạt động hay không. Mỗi nguồn phải nói rõ nó hiểu _hoạt động_ là gì. Đăng nhập **không** được tính là sử dụng                    |
| **Bộ thu thập trên thiết bị**                   | Phần mềm nhỏ chạy trên máy công ty để đo việc dùng các SaaS đã biết. Gồm **tiện ích trình duyệt** (có trong phiên bản đầu) và **agent trên máy** (chỉ thiết kế) |
| **Danh sách cho phép (allowlist)**              | Danh sách tên miền hoặc ứng dụng mà bộ thu thập được phép đo, lấy từ danh mục phần mềm và từ điển nhà cung cấp. Mọi thứ ngoài danh sách bị bỏ ngay trên máy     |
| **Khoảng thời gian dữ liệu bao phủ (coverage)** | Khoảng ngày mà một nguồn thực sự có dữ liệu. Ngoài khoảng này hệ thống không được kết luận người dùng không hoạt động                                           |
| **Độ mới dữ liệu (freshness)**                  | Dữ liệu được cập nhật lần cuối khi nào. Dữ liệu quá cũ thì không dùng để kết luận                                                                               |
| **Ánh xạ danh tính**                            | Việc khớp một tài khoản ở nhà cung cấp, ví dụ `bao.pham+figma@cty.vn`, về đúng một nhân viên                                                                    |
| **Mức độ tin cậy**                              | Bằng chứng mạnh đến đâu, dựa trên chất lượng dữ liệu và độ chắc chắn của phép khớp                                                                              |
| **Shadow IT / phần mềm ngoài danh mục**         | Phần mềm hoặc khoản chi phần mềm mà CNTT chưa ghi nhận. Là mục cần xem xét, **không** mặc định là vi phạm                                                       |
| **Kết nối kỹ thuật (connector)**                | Cầu nối để hệ thống lấy dữ liệu hoặc gửi thao tác tới nhà cung cấp. Chưa có connector thì IT Admin làm thủ công và xác nhận lại trên hệ thống                   |
| **Tài khoản dịch vụ**                           | Tài khoản cho bot, công cụ tự động hoặc hệ thống tích hợp; không đại diện cho một nhân viên                                                                     |
| **Đối soát**                                    | So hai nguồn dữ liệu để tìm chỗ không khớp                                                                                                                      |
| **Nhật ký kiểm toán (Audit Trail)**             | Lịch sử ai thay đổi gì, khi nào, từ giá trị nào sang giá trị nào. Chỉ ghi thêm, không sửa, không xóa                                                            |
| **SLA / thời hạn xử lý**                        | Thời gian mục tiêu để xử lý một bước, ví dụ thời hạn Manager xác nhận yêu cầu                                                                                   |
| **MVP / phiên bản đầu tiên**                    | Phiên bản có các chức năng quan trọng nhất để chứng minh giá trị                                                                                                |
| **Bản cài đặt riêng (dedicated instance)**      | Mỗi doanh nghiệp dùng một bản hệ thống và dữ liệu riêng                                                                                                         |

**Các mã trong tài liệu:** `PP` là vấn đề cần giải quyết; `G` là nhóm phát hiện lãng phí; `BR` là quy tắc nghiệp vụ; `KPI` là chỉ số theo dõi kết quả. Người đọc có thể đọc nội dung bên cạnh mà không cần nhớ mã.

### 1.2. Một tình huống điển hình

Nhân viên Minh cần Figma cho dự án mới và gửi yêu cầu trên hệ thống. Quản lý trực tiếp xác nhận Minh thực sự cần công cụ này.

- **Nếu công ty còn seat Figma trống**, Quản trị viên CNTT cấp quyền luôn — không cần ai duyệt tiền, vì công ty không phải trả thêm.
- **Nếu phải mua thêm seat**, yêu cầu đi tới **Người duyệt chi**. Người này xem snapshot ngân sách, có thể hỏi Tài chính nếu cần, rồi quyết. Khi được duyệt, hệ thống giữ chỗ tiền trong ngân sách. Sau đó Tài chính ghi nhận chính thức, **song song** với việc Quản trị viên CNTT cấp tài khoản.

Mọi bước đều được ghi lại: ai quyết gì, lúc nào. Về sau, hệ thống tiếp tục theo dõi xem seat của Minh có còn được dùng không.

## 2. Bài toán nghiệp vụ

Trong doanh nghiệp, dữ liệu về phần mềm thuê bao thường bị tách rời:

- Bộ phận CNTT biết một phần danh mục và ai được cấp tài khoản.
- Tài chính thấy hóa đơn, sao kê nhưng khó biết phần mềm đó phục vụ ai.
- Hợp đồng nằm trong hộp thư của người ký hoặc thư mục riêng.
- Nhu cầu thật nằm ở từng quản lý trực tiếp.

Sự phân mảnh đó gây ra năm vấn đề:

| Mã   | Vấn đề                                                             | Hệ quả nghiệp vụ                                       |
| ---- | ------------------------------------------------------------------ | ------------------------------------------------------ |
| PP-1 | Seat đã mua nhưng không ai dùng, hoặc còn nằm ở người đã nghỉ việc | Lãng phí tiền và có thể để lộ quyền truy cập           |
| PP-2 | Quên hạn báo hủy, bị gia hạn ngoài ý muốn                          | Phải trả thêm một chu kỳ thuê bao                      |
| PP-3 | CNTT và Tài chính không có chung ngôn ngữ dữ liệu                  | Không quy được chi phí về đúng đơn vị chịu trách nhiệm |
| PP-4 | Phần mềm được mua hoặc dùng ngoài quy trình (Shadow IT)            | Dữ liệu công ty nằm ở dịch vụ chưa được đánh giá       |
| PP-5 | Quy trình xin công cụ chính thức chậm                              | Nhân viên đi _đường tắt_, làm Shadow IT tăng lên       |

PP-5 là một nguyên nhân quan trọng làm phát sinh PP-4. Vì vậy SaaS-Sentry vừa phát hiện phần mềm ngoài danh mục, vừa làm cho đường xin công cụ chính thức nhanh và minh bạch hơn.

## 3. Đối tượng áp dụng và người dùng

Hệ thống phù hợp nhất với doanh nghiệp công nghệ, gia công phần mềm hoặc đang chuyển đổi số, khoảng **100–500 nhân sự**, **15–40 phần mềm thuê bao**, có **cây quản lý trực tiếp rõ ràng và cost center**, và 1–3 quản trị viên CNTT. Quy mô này đã khó quản lý bằng bảng tính, nhưng thường chưa đủ nguồn lực vận hành một giải pháp thương mại lớn.

Hệ thống có **sáu vai trò người dùng** và **một tác nhân tự động**:

| Vai trò                                | Trách nhiệm chính                                                                                                                                                                            | Tần suất                       |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| **Nhân viên (Employee)**               | Gửi yêu cầu xin, đổi, gia hạn hoặc trả lại quyền sử dụng; xem dữ liệu hệ thống lưu về mình                                                                                                   | Vài lần một năm                |
| **Quản lý trực tiếp (Manager)**        | **Xác nhận nhu cầu** của nhân viên trực thuộc; quyết định Giữ lại / Thu hồi / Miễn trừ với khuyến nghị lãng phí                                                                              | Vài lần một tuần               |
| **Quản trị viên CNTT (IT Admin)**      | Quản lý danh mục, hợp đồng, seat; **đánh giá rủi ro** phần mềm mới; **thực hiện cấp và thu hồi** sau khi có quyết định hợp lệ; xử lý sai lệch và phần mềm ngoài danh mục                     | Hằng ngày                      |
| **Tài chính (Finance)**                | **Kiểm soát ngân sách**: trả lời khi Người duyệt chi hỏi, ghi nhận ngân sách và khoản cam kết **sau khi** chi đã được duyệt; đối soát hóa đơn. **Không duyệt chi và không chặn khoản chi** ᴼ | Hằng tuần, cao điểm cuối tháng |
| **Người duyệt chi**                    | **Quyết định cuối** cho mọi khoản chi và mọi phần mềm mới đưa vào danh mục; quyết gia hạn, giảm số lượng, hủy thuê bao. Một người do Super Admin cấu hình, mặc định CEO ᴼ                    | Theo số yêu cầu có chi phí     |
| **Quản trị hệ thống (Super Admin)**    | Quản lý tài khoản, vai trò, cấu hình, xem nhật ký kiểm toán. **Không** phê duyệt nghiệp vụ, **không** cấp hoặc thu hồi seat, **không** duyệt thay khi người được giao chậm                   | Hằng tháng                     |
| _Dịch vụ tự động (Automation Service)_ | Chạy quy tắc phát hiện, nhắc việc, sinh khuyến nghị theo lịch. Không tự cấp, tự thu hồi hay tự duyệt                                                                                         | Theo lịch                      |

Ban giám đốc, trừ người giữ vai Người duyệt chi, cùng kiểm toán và bảo mật là nhóm hưởng lợi gián tiếp; họ không cần tài khoản thao tác.

## 4. Nguyên tắc ra quyết định

Hệ thống tách ba loại quyết định để không ai vừa đề xuất, vừa duyệt, vừa thực hiện:

| Loại quyết định                               | Ai quyết              | Ví dụ                                                                                                  |
| --------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------ |
| **Nhu cầu nghiệp vụ**                         | Quản lý trực tiếp     | Nhân viên có thực sự cần Figma không? Seat không còn cần có nên thu hồi không?                         |
| **Chi phí**                                   | **Người duyệt chi** ᴼ | Có mua thêm seat, nâng gói, gia hạn, giảm số lượng, hủy thuê bao, đưa phần mềm mới vào danh mục không? |
| **Thực thi kỹ thuật**                         | Quản trị viên CNTT    | Cấp từ thuê bao nào, qua connector hay làm thủ công, xử lý lỗi cấp phát ra sao?                        |
| _Kiểm soát ngân sách — không phải quyết định_ | Tài chính             | Trả lời _"còn trong hạn mức không"_ khi được hỏi; ghi nhận chính thức sau khi chi đã duyệt             |

**Không ai được duyệt yêu cầu của chính mình.** Khi Người duyệt chi lại chính là người xin hoặc người được hưởng khoản chi, bước duyệt chi được giao cho một **người duyệt thay thế** mà Super Admin đã cấu hình **từ trước** — ví dụ Chủ tịch HĐQT hoặc CFO. Đây không phải ủy quyền: không ai trong luồng tự chọn người thay ᴼ.

**Nguyên tắc trọng tâm:** hệ thống có thể tự động hóa thao tác kỹ thuật _sau khi_ đã có quyết định hợp lệ, nhưng **không** tự quyết cấp quyền, thu hồi quyền, duyệt chi hay chặn ứng dụng chỉ dựa trên cảnh báo.

## 5. Các nhóm tính năng

Phần này mô tả hệ thống từ góc nhìn người dùng: **ai làm gì, hệ thống xử lý thế nào, kết quả nhận được là gì**.

### 5.1. Khởi tạo dữ liệu ban đầu

**Vấn đề:** doanh nghiệp mới triển khai chưa có dữ liệu chuẩn. Bắt nhập tất cả cùng lúc thì dễ bỏ dở.

**Người dùng chính:** Quản trị viên CNTT, với dữ liệu từ Nhân sự và Tài chính.

Hệ thống đưa ra checklist năm bước theo đúng thứ tự phụ thuộc:

1. Nhập nhân sự: email công việc, **quản lý trực tiếp** và **cost center**. Cost center là **trường bắt buộc**; dòng thiếu cost center bị từ chối ᴼ.
2. Khai báo phần mềm đang dùng, người sở hữu nghiệp vụ, mức độ nhạy cảm dữ liệu.
3. Nhập hợp đồng, gói, số seat, giá, kỳ hạn, hạn chót báo hủy.
4. Ghi nhận hiện trạng ai đang giữ seat nào.
5. Kết nối hoặc nhập dữ liệu sử dụng, nếu có.

**Giá trị:** xong bước 4 là đã thấy ngay bao nhiêu seat đã mua nhưng chưa gán (G1) và bao nhiêu seat còn nằm ở người đã nghỉ việc (G2). Bước 5 chỉ mở rộng khả năng phát hiện G3/G4; hệ thống vẫn có ích khi chưa có bước 5.

**Ví dụ:** công ty mua 100 seat Figma, có 82 quyết định cấp quyền còn hiệu lực. Hệ thống hiện ngay 18 seat chưa gán, để cân nhắc giảm số lượng tại kỳ gia hạn.

### 5.2. Danh mục SaaS, hợp đồng và thuê bao

**Vấn đề:** nhiều doanh nghiệp biết có trả tiền cho một phần mềm nhưng không biết ai phụ trách, đang mua gói nào, còn bao lâu phải báo hủy.

**Người dùng chính:** Quản trị viên CNTT quản lý danh mục; Tài chính theo dõi chi phí; người sở hữu nghiệp vụ cung cấp bối cảnh.

Hệ thống lưu tập trung: nhà cung cấp, sản phẩm, gói giá, tên miền liên quan, trạng thái phê duyệt, người sở hữu nghiệp vụ, hợp đồng, hóa đơn, thuê bao. Mỗi ứng dụng phải có một người sở hữu nghiệp vụ đang làm việc. Hệ thống tách rõ:

- **Hợp đồng (Contract):** văn bản pháp lý, có thể kéo dài nhiều năm và gồm nhiều thuê bao.
- **Thuê bao (Subscription):** một chu kỳ mua cụ thể: số seat, đơn giá, ngày bắt đầu và kết thúc, hạn chót báo hủy, có tự gia hạn không.
- **Hóa đơn (Invoice):** một lần thanh toán thực tế.

Tệp hợp đồng và hóa đơn được lưu an toàn, truy cập theo quyền. Mọi khoản tiền lưu kèm loại tiền gốc, tỷ giá áp dụng và giá trị quy đổi về đồng tiền báo cáo.

**Giá trị:** cảnh báo tại **hạn chót báo hủy**, không chỉ tại ngày gia hạn.

**Ví dụ:** gói gia hạn ngày 31/12 nhưng phải báo hủy trước 30 ngày. Hệ thống cảnh báo theo mốc 01/12.

### 5.3. Quản lý nhân sự, seat và cấp phát

**Vấn đề:** khi nhân viên đổi người quản lý, đổi cost center, nghỉ việc hoặc trả công cụ, doanh nghiệp cần biết tại từng thời điểm họ giữ seat nào và chi phí khi đó thuộc cost center nào.

**Người dùng chính:** Quản trị viên CNTT; Quản lý trực tiếp và Tài chính dùng kết quả.

Quan hệ quản lý và cost center có **lịch sử hiệu lực**: khi đổi, hệ thống tạo bản ghi mới thay vì sửa đè. Nhờ vậy hóa đơn tháng trước vẫn được quy về đúng cost center của tháng trước.

Với mỗi thuê bao, hệ thống theo dõi ba con số: số seat đã mua, số seat đang gán, và số seat trống — số trống được tính tự động từ hai số kia.

Quyết định cấp quyền và thao tác tạo tài khoản thật là **hai việc tách biệt**:

- **Quyết định cấp quyền (Assignment):** doanh nghiệp cho một người dùng phần mềm trong một thời gian.
- **Tác vụ cấp phát (Provisioning Task):** thao tác kỹ thuật tạo hoặc xóa tài khoản, qua connector hoặc thủ công. Tác vụ có trạng thái, số lần thử lại và lỗi gần nhất.

Nhờ tách như vậy, hệ thống diễn tả đúng tình huống _"đã duyệt nhưng nhà cung cấp chưa tạo được tài khoản"_.

**Ví dụ:** Người duyệt chi đã duyệt mua thêm seat GitHub. Connector GitHub mới chỉ gửi **lời mời đang chờ chấp nhận**. Tác vụ cấp phát ở trạng thái _chờ chấp nhận_ cho tới khi đối soát thấy người dùng đã vào tổ chức — hệ thống không báo thành công sớm.

### 5.4. Yêu cầu và phê duyệt

**Vấn đề:** nhân viên tự mua công cụ khi quy trình chính thức chậm, không rõ ai duyệt, không biết đang kẹt ở đâu.

**Người dùng chính:** Nhân viên, Quản lý trực tiếp, Người duyệt chi, Tài chính, Quản trị viên CNTT.

Nhân viên gửi yêu cầu cấp mới, đổi gói, gia hạn có thời hạn hoặc trả lại seat, kèm lý do, cost center hoặc dự án, và thời hạn cần dùng. Quản lý trực tiếp có thể tạo yêu cầu thay nhân viên mới.

Có ba nhánh ᴼ:

| Tình huống                                                                                                      | Luồng                                                                                                                                                                                                                     |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **(a)** Phần mềm đã có trong danh mục, **còn seat**, không đổi tiền hay hợp đồng                                | Nhân viên → Quản lý trực tiếp → Quản trị viên CNTT cấp. **Không** qua Người duyệt chi; Người duyệt chi vẫn xem được tổng số seat cấp theo nhánh này trong báo cáo quy trình                                               |
| **(b)** Phần mềm đã có nhưng **phát sinh chi phí** — mua thêm seat, nâng gói, tạo hoặc gia hạn hợp đồng có tiền | Nhân viên → Quản lý trực tiếp → **Người duyệt chi** quyết trên snapshot ngân sách, _có thể hỏi Tài chính_ → hệ thống giữ chỗ khoản cam kết → **song song:** Tài chính ghi nhận chính thức ∥ Quản trị viên CNTT mua và cấp |
| **(c)** Phần mềm **chưa có trong danh mục**, kể cả gói miễn phí                                                 | Nhân viên → Quản lý trực tiếp → Quản trị viên CNTT **đánh giá** danh mục và rủi ro → Người duyệt chi quyết → nếu có chi phí thì giữ chỗ cam kết và Tài chính ghi nhận ∥ Quản trị viên CNTT thực hiện                      |

Một số điểm quan trọng:

- **Hỏi Tài chính là tùy chọn và không làm dừng đồng hồ.** Người duyệt chi quyết được bất cứ lúc nào, kể cả khi Tài chính chưa trả lời. Câu trả lời của Tài chính chỉ là thông tin, không duyệt và không chặn ᴼ.
- **Hết seat khi tới bước cấp:** yêu cầu chuyển sang nhánh (b). Hệ thống không tự mua và không tự từ chối.
- **Mỗi bước có thời hạn xử lý.** Quá hạn thì hệ thống **nhắc** người được giao, **thông báo** cho quản lý cấp trên của người đó, và **cảnh báo** Super Admin khi việc tồn đọng vượt ngưỡng. Hệ thống **không tự duyệt**, **không đổi người duyệt** và **không có ủy quyền duyệt** trong phiên bản đầu ᴼ.
- **Chỉ đổi người duyệt khi dữ liệu thật thay đổi** — ví dụ người được giao nghỉ việc, hoặc Super Admin đổi người giữ vai Người duyệt chi. Đồng hồ thời hạn không được đặt lại ᴼ.
- **Không còn người duyệt hợp lệ:** yêu cầu được giữ ở trạng thái chờ có kiểm soát, tiếp tục nhắc, và báo Super Admin cấu hình lại.
- **Yêu cầu bị hủy, hoặc mua và cấp phát thất bại sau khi đã duyệt chi:** khoản cam kết được giải phóng, không ghi nhận seat đã cấp.

**Giá trị:** nhân viên biết yêu cầu đang ở đâu; mỗi người chỉ nhận đúng việc của mình; hệ thống đo được thời gian của từng bước để tìm chỗ chậm.

### 5.5. Phát hiện quyền sử dụng lãng phí

**Vấn đề:** _"không dùng"_ không phải lúc nào cũng kết luận được từ một cột ngày hoạt động cuối. Hệ thống phải phân biệt trường hợp chắc chắn với trường hợp chỉ là nghi ngờ, để không gây báo động giả.

**Người dùng chính:** Quản trị viên CNTT theo dõi và xử lý; Quản lý trực tiếp xác nhận; Người duyệt chi và Tài chính dùng kết quả khi quyết định gia hạn.

#### Năm nhóm lãng phí

| Nhóm   | Ý nghĩa                                               | Cần dữ liệu gì                                        | Phiên bản đầu           |
| ------ | ----------------------------------------------------- | ----------------------------------------------------- | ----------------------- |
| **G1** | Seat đã mua nhưng chưa gán cho ai                     | Chỉ dữ liệu nội bộ: số seat đã mua, các Assignment    | Có                      |
| **G2** | Seat còn gán cho người đã nghỉ việc                   | Chỉ dữ liệu nội bộ: nhân sự và Assignment             | Có                      |
| **G3** | Seat đã gán nhưng **chưa từng** có hoạt động          | Bằng chứng sử dụng đủ coverage và khớp được danh tính | Có, có điều kiện        |
| **G4** | Seat từng dùng nhưng **đã ngừng**                     | Như G3                                                | Có, có điều kiện        |
| **G5** | Seat vẫn dùng nhưng dùng ít so với gói, có thể hạ gói | Nhật ký chi tiết loại thao tác                        | **Ngoài phiên bản đầu** |

#### Có tài khoản, có seat, có đăng nhập — vẫn chưa phải là _đang dùng_

Hệ thống phân biệt rõ: _có tài khoản_ ở nhà cung cấp; _đang giữ một seat_ trả tiền; _có đăng nhập_; và _có sử dụng thật_. **Ba điều đầu không chứng minh điều thứ tư.** Khi bật đăng nhập tập trung, nhiều ứng dụng tự đăng nhập mỗi sáng; nếu tính đăng nhập là sử dụng thì ai cũng _đang dùng_ và phát hiện lãng phí mất tác dụng.

#### Ba nguồn bằng chứng sử dụng ᴼ

| Nguồn                                                             | Trạng thái                                                                                                                                                              | Chứng minh được                                                                                                                                                                | Không chứng minh được                                                                                                                                                    |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **1. Dữ liệu từ nhà cung cấp** — API, báo cáo quản trị, file xuất | Có trong phiên bản đầu, theo từng connector hoặc file                                                                                                                   | Ai **có tài khoản**, ai **giữ seat**; với gói có hỗ trợ thì thêm ngày hoạt động theo **định nghĩa của nhà cung cấp**, ví dụ GitHub = có commit, Atlassian = xem trang ≥ 2 giây | Phần lớn nhà cung cấp chỉ cho dữ liệu hoạt động theo người ở **gói cao nhất** — Figma, Notion, ChatGPT: Enterprise                                                       |
| **2. Tiện ích trình duyệt trên máy công ty**                      | Có trong phiên bản đầu. Demo bằng cách nạp thủ công (_load unpacked_); cài bắt buộc qua trình duyệt do công ty quản lý **là thiết kế triển khai, chưa được thử nghiệm** | Nhân viên **đã mở và dùng** một SaaS có trong danh sách cho phép trên máy công ty: tab ở phía trước, máy không rảnh, cộng dồn số phút mỗi ngày. **Không cần mua gói cao**      | **Không biết nhân viên dùng tài khoản nào** — tài khoản công ty có seat, tài khoản cá nhân hay chế độ xem miễn phí. Không thấy điện thoại, máy cá nhân, ứng dụng desktop |
| **3. Agent trên máy công ty**                                     | **Chỉ thiết kế** — không có trong phiên bản đầu                                                                                                                         | Nếu được hiện thực: ứng dụng desktop trong danh sách cho phép ở phía trước khi máy không rảnh; phần mềm đã cài                                                                 | Như tiện ích, và không thấy web SaaS cụ thể                                                                                                                              |

Vì mỗi nguồn mạnh ở một chỗ, hệ thống **kết hợp** chúng. Nguồn 1 cho biết _ai giữ seat_. Nguồn 1 hoặc 2 cho biết _có dùng hay không_. Một ứng dụng có nhiều nguồn thì lấy **ngày hoạt động muộn nhất** trong các nguồn còn đủ độ mới và đã khớp danh tính.

#### Điều kiện trước khi kết luận

- **Coverage:** mỗi nguồn phải nói rõ nó có dữ liệu từ ngày nào tới ngày nào. Với tiện ích, coverage chỉ tính từ khi nhân viên **đã xác nhận** và thiết bị **đã đăng ký**.
- **Độ mới:** dữ liệu quá cũ — mặc định quá 7 ngày kể từ ngày bao phủ cuối — thì không chạy quy tắc, chỉ báo _dữ liệu lỗi thời_.
- **Khớp danh tính:** dữ liệu nhà cung cấp phải khớp đúng một nhân viên, và gắn vào đúng quyết định cấp quyền tại thời điểm đó. Dữ liệu tiện ích khớp qua **thiết bị đã đăng ký ↔ nhân viên**.
- **Loại trừ trước khi chạy quy tắc:** gói không tính theo đầu người; tài khoản dịch vụ; nhân viên nghỉ dài hoặc đang bàn giao; seat vừa cấp dưới 14 ngày; seat bắt đầu sau khi dữ liệu bắt đầu; dữ liệu quá cũ; đang trong thời hạn miễn trừ; đã có khuyến nghị đang mở.

#### "Không có dữ liệu" khác "không sử dụng"

| Trạng thái              | Nghĩa                                                      | Hệ thống làm gì                               |
| ----------------------- | ---------------------------------------------------------- | --------------------------------------------- |
| **Không hoạt động**     | Có dữ liệu bao phủ, người này thực sự không xuất hiện      | Được kết luận G3/G4                           |
| **Không có dữ liệu**    | Chưa có nguồn, hoặc bộ thu thập không chạy trong khoảng đó | **Không** kết luận; hiện _chưa đánh giá được_ |
| **Chưa khớp danh tính** | Có hoạt động nhưng chưa biết của ai                        | **Không** kết luận; đưa vào hàng đợi xử lý    |

Báo cáo **không bao giờ** hiện _không có dữ liệu_ thành _0 phút_ hay _không dùng_.

#### Khuyến nghị chỉ hỗ trợ quyết định

Mỗi khuyến nghị ghi đủ căn cứ: nguồn dữ liệu, khoảng bao phủ, cách khớp danh tính, định nghĩa _hoạt động_ của nguồn, số ngày không hoạt động, mức tin cậy. Quản lý trực tiếp chọn **Giữ lại**, **Thu hồi** hoặc **Miễn trừ có thời hạn** (tối đa 12 tháng, phải có lý do). Chỉ sau đó Quản trị viên CNTT mới thu hồi. Hệ thống không tự thu hồi.

**Về tiền:** với hợp đồng năm, **thu hồi seat giữa kỳ không tiết kiệm được đồng nào ngay**; tiền chỉ giảm khi giảm số lượng tại kỳ gia hạn. Hệ thống tách hai con số này và không cộng chúng lại.

#### Ví dụ theo từng nguồn

- **Nguồn 1 — GitHub, dữ liệu thật:** một tài khoản thành viên (ví dụ giả định `demo-member-01`) có trong tổ chức và giữ seat, nhưng không có commit nào vào repo của tổ chức trong 64 ngày. Nhưng tổ chức GitHub của nhóm mới tạo ngày 03/08/2026, nên **trước 02/10/2026** chưa đủ 60 ngày dữ liệu. Hệ thống phải hiện _chưa đánh giá được_, không được hiện _cần xem xét_. Người chỉ review code mà không commit sẽ không được thấy — đây là điểm mù phải nói rõ.
- **Nguồn 1 — Microsoft 365, dữ liệu mô phỏng có nhãn:** báo cáo người dùng hoạt động có _Last Activity Date_ 95 ngày trước, bao phủ 180 ngày, email khớp chính xác ⟹ _Cần xử lý_.
- **Nguồn 2 — tiện ích, Notion gói Business:** Notion không cho dữ liệu hoạt động theo người ở gói này. Nhân viên B đã xác nhận thông báo, máy công ty đã đăng ký, tiện ích có dữ liệu bao phủ hợp lệ trong 60 ngày nhưng không có phút nào trên `notion.so` ⟹ _Cần xem xét_, gửi Quản lý trực tiếp xác nhận. Nếu không chứng minh được tiện ích đã chạy trong khoảng đó — máy tắt, dùng trình duyệt khác — thì _chưa đánh giá được_. _(Cách tiện ích khai khoảng bao phủ đang được đề xuất cho đặc tả kỹ thuật, chưa chốt — xem nghiên cứu 18/09, đề xuất `P-02`.)_
- **Nguồn 3 — agent, chỉ minh họa thiết kế:** nếu sau này được hiện thực, agent có thể cho biết _Figma desktop ở phía trước 0 phút trong 90 ngày_ trên máy đã đăng ký. **Phiên bản đầu không có tính năng này.**

### 5.6. Báo cáo chi phí, tiết kiệm và dự báo

**Vấn đề:** Tài chính thấy số tiền đã trả nhưng thiếu bối cảnh phần mềm, seat và người dùng; CNTT biết phần mềm nhưng khó thấy ngân sách.

**Người dùng chính:** Người duyệt chi, Tài chính, Quản trị viên CNTT. Quản lý trực tiếp chỉ thấy phạm vi cấp dưới, không thấy số tài chính toàn công ty.

#### SaaS-Sentry không báo cáo doanh thu

Đây là **hệ thống quản trị chi phí nội bộ**, không bán hàng nên **không có doanh thu**. Câu hỏi _"hệ thống mang lại bao nhiêu tiền"_ được trả lời bằng **tổng chi đặt cạnh số tiền tiết kiệm được**. Hệ thống **không** gọi tiết kiệm là doanh thu hay ROI ᴼ.

#### Năm nhóm báo cáo ᴼ

| Nhóm                    | Trả lời câu hỏi                                 | Nội dung chính                                                                                                                                    |
| ----------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tổng chi**            | Đã chi bao nhiêu, còn bao nhiêu?                | **Ngân sách · thực chi · khoản cam kết đang giữ · còn lại**, theo cost center, ứng dụng, nhà cung cấp, cây người phụ trách, kỳ; hai cách ghi nhận |
| **Tiết kiệm**           | Tiết kiệm được bao nhiêu, bao giờ tiền thật về? | **Tiết kiệm có thể thực hiện ngay** tách riêng **tiết kiệm tại kỳ gia hạn**; kèm seat đã thu hồi và khuyến nghị làm căn cứ                        |
| **Hiệu suất sử dụng**   | Seat đã mua có được dùng không?                 | Tỷ lệ seat đang hoạt động; số seat G1 → G4; chi phí trên mỗi người dùng có hoạt động                                                              |
| **Hiệu suất quy trình** | Xin công cụ mất bao lâu, kẹt ở đâu?             | Thời gian từng bước, tỷ lệ bước quá hạn, bảng việc tồn đọng, số thuê bao tự gia hạn khi chưa có quyết định                                        |
| **Chất lượng dữ liệu**  | Có tin được các con số trên không?              | Tỷ lệ khớp danh tính, độ mới từng nguồn, sai lệch đang mở, thuê bao thiếu hạn chót báo hủy, trạng thái bộ thu thập, tỷ lệ khuyến nghị bị bác bỏ   |

#### Cách đọc các con số

- **Còn lại = ngân sách − thực chi − khoản cam kết đang giữ.** Trừ cả cam kết để hai yêu cầu duyệt song song không cùng thấy _"còn đủ"_ rồi cùng vượt hạn mức.
- **Chưa có ngân sách** thì hiện _Chưa có ngân sách_, **không** hiện 0. Khi ngân sách được lập sau, các khoản cam kết đã có được gắn vào; nếu vượt thì hiện **số âm** kèm nhãn _đã cam kết vượt hạn mức_ — đó là thông tin đúng, không phải lỗi ᴼ.
- **Hai cách ghi nhận:** _theo dòng tiền_ ghi tại ngày hóa đơn, dùng để đối soát thanh toán; _theo kỳ_ chia đều theo thời gian sử dụng, dùng để theo dõi ngân sách.
- **Chi phí trên mỗi người dùng có hoạt động** chỉ tính cho gói theo đầu người **và** ứng dụng có nguồn phát hiện được G3/G4. Không đủ điều kiện thì ẩn kèm lý do.
- Màn hình luôn ghi **thời điểm dữ liệu cập nhật gần nhất**, để không ai nhầm dữ liệu nhập từ file là dữ liệu thời gian thực.

#### Ví dụ số đơn giản

Cost center _Dự án A_, tháng 10, đồng tiền báo cáo VND:

| Mục                                                            | Số tiền       |
| -------------------------------------------------------------- | ------------- |
| Ngân sách                                                      | 50.000.000    |
| Thực chi (hóa đơn đã đối soát)                                 | 30.000.000    |
| Khoản cam kết đang giữ (hai yêu cầu đã duyệt, chưa có hóa đơn) | 12.000.000    |
| **Còn lại**                                                    | **8.000.000** |
| Yêu cầu có chi phí đang chờ duyệt                              | 10.000.000    |

Người duyệt chi thấy ngay: duyệt thêm yêu cầu 10 triệu thì _Dự án A_ vượt hạn mức 2 triệu. Họ vẫn có quyền duyệt; hệ thống chỉ cho thấy đủ thông tin.

**Tiết kiệm:** thu hồi 5 seat Figma của hợp đồng năm, giá 360.000 VND/seat/tháng. _Tiết kiệm ngay_ = **0 VND**, vì hợp đồng năm đã cam kết. _Tiết kiệm tại kỳ gia hạn_ = 5 × 360.000 × 12 = **21.600.000 VND/năm** nếu giảm số lượng khi gia hạn. Hai số hiện riêng, không cộng.

**Hai cách ghi nhận:** hóa đơn năm 12.000 USD trả tháng 1 là 12.000 USD _theo dòng tiền_ trong tháng 1, nhưng 1.000 USD/tháng _theo kỳ_.

#### Dự báo ba lớp

| Lớp                                   | Nội dung                                                                            | Phiên bản đầu                                                  |
| ------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **L1 — Chi phí đã cam kết**           | Tính thẳng từ hợp đồng và thuê bao                                                  | Có                                                             |
| **L2 — Chi phí biến động**            | Mô hình xu hướng, chỉ hiện khi có ≥ 12 tháng dữ liệu **và** sai số kiểm chứng ≤ 20% | **Hoãn** — chỉ giữ đặc tả, giao diện nói rõ _chưa hiện thực_ ᴼ |
| **L3 — Chi phí phụ thuộc quyết định** | Ba kịch bản theo giả định do người dùng nhập, ví dụ tuyển thêm 10 người             | Có                                                             |

**Vì sao không đưa dự báo khi dữ liệu chưa đủ:** một con số dự báo sai nhưng trông chắc chắn còn nguy hiểm hơn không có con số nào. Hệ thống **im lặng về kết luận nhưng nói rõ lý do**.

### 5.7. Phát hiện SaaS ngoài danh mục (Shadow IT)

**Vấn đề:** CNTT chỉ biết phần mềm đã khai báo, trong khi Tài chính thấy các khoản thanh toán lạ, và hệ thống đăng nhập tập trung thấy ứng dụng được cấp quyền vào dữ liệu công ty.

**Người dùng chính:** Quản trị viên CNTT xử lý; Tài chính cung cấp dữ liệu chi; Quản lý trực tiếp hoặc người sở hữu nghiệp vụ cung cấp bối cảnh.

Phiên bản đầu nhận **ba nguồn bằng chứng**:

| Nguồn                                                                                                   | Trả lời câu hỏi                                                                                        | Điểm mù                                                                                                            |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| **Sao kê, hóa đơn chi phí**                                                                             | Công ty đang **trả tiền** cho ai?                                                                      | Không thấy công cụ miễn phí; mô tả giao dịch hay mơ hồ; khoản hoàn ứng cá nhân                                     |
| **Xuất dữ liệu cấp quyền (OAuth) hoặc danh sách ứng dụng doanh nghiệp từ hệ thống đăng nhập tập trung** | Ứng dụng nào đã được **cấp quyền** vào dữ liệu công ty?                                                | Ứng dụng đăng ký bằng tài khoản cá nhân                                                                            |
| **Tiện ích trình duyệt trên máy công ty**                                                               | Ai đang **thực sự mở** một SaaS **đã có trong từ điển nhà cung cấp** nhưng **chưa có trong danh mục**? | SaaS chưa có trong từ điển; ứng dụng desktop; trình duyệt không được quản lý; máy cá nhân; nhân viên chưa xác nhận |

Hệ thống chuẩn hóa dữ liệu, nhận diện nhà cung cấp, đối chiếu danh mục và tạo **bản ghi cần xem xét (Discovery Finding)**. Ví dụ, giao dịch `PAYPAL*CANVA` được nhận diện là Canva; Canva chưa có trong danh mục thì hệ thống tạo bản ghi kèm dữ liệu gốc và mức chắc chắn của phép nhận diện. Mỗi nhà cung cấp chỉ có một bản ghi đang mở; bằng chứng mới được cập nhật vào bản ghi cũ.

**Những điều hệ thống cam kết giữ:**

- Bản ghi là **hồ sơ cần xem xét, không phải kết luận vi phạm**. Quản trị viên CNTT đánh dấu Đã duyệt, Chưa duyệt hoặc Báo nhầm, gán người chịu trách nhiệm, hoặc mở quy trình đưa ứng dụng vào danh mục. Đưa một ứng dụng hữu ích vào danh mục là kết quả **tích cực**.
- **Không cam kết phát hiện 100%.** Nhân viên dùng công cụ AI miễn phí bằng tài khoản cá nhân trên máy cá nhân thì cả ba nguồn đều không thấy.
- **Không giám sát máy cá nhân** và không thấy điện thoại.
- **Không chặn website.** Hệ thống chỉ ghi nhận để xem xét.
- **Không thu nội dung trang**, URL đầy đủ, tiêu đề trang; không thu tên miền ngoài danh sách cho phép.
- **AI chỉ hỗ trợ gợi ý** nhận diện nhà cung cấp, và bắt buộc có người xác nhận. AI **không** tự đóng bản ghi, **không** kết luận vi phạm.

### 5.8. Nhập dữ liệu, đối soát và nhật ký kiểm toán

**Vấn đề:** dữ liệu đầu vào thường là file xuất từ Nhân sự, Tài chính, trang quản trị nhà cung cấp — có thể sai định dạng, trùng lặp hoặc mâu thuẫn. Ghi thẳng vào hệ thống thì một file lỗi có thể tạo ra hàng loạt kết luận sai.

**Người dùng chính:** Quản trị viên CNTT và Tài chính, tùy loại dữ liệu.

**Các loại dữ liệu nhập:** nhân sự, danh mục, hợp đồng, hóa đơn, quyết định cấp quyền hiện có, dữ liệu sử dụng, sao kê. Dữ liệu từ tiện ích trình duyệt đi theo đường riêng nhưng cũng qua kiểm tra lược đồ.

Mọi loại nhập dùng chung sáu bước:

```text
Tải lên → Phân tích → Ánh xạ danh tính → Xem trước → Ghi nhận → Tổng hợp lại
```

- **Xem trước là bắt buộc.** Trước khi ghi, người dùng thấy số dòng hợp lệ, dòng lỗi, bản ghi trùng sẽ bỏ qua, định danh chưa khớp, khoảng bao phủ và số bản ghi bị ảnh hưởng.
- **Lỗi theo dòng:** một dòng lỗi không làm hỏng cả file. Hệ thống chỉ rõ dòng, cột, lý do, và cho tải danh sách lỗi về sửa.
- **Chống trùng:** hệ thống nhận ra file đã nhập trước đó và cảnh báo.
- **Ánh xạ danh tính:** định danh chưa khớp vào hàng đợi, không bị bỏ qua im lặng, không dùng để kết luận.
- **Khoảng bao phủ:** mỗi file dữ liệu sử dụng phải khai khoảng ngày có dữ liệu.

**Khi hai nguồn nói khác nhau, không nguồn nào tự ghi đè nguồn kia.** Dữ liệu nội bộ đã qua phê duyệt cho biết doanh nghiệp **định làm gì**; dữ liệu nhà cung cấp cho biết **thực tế đang xảy ra gì**. Lệch nhau là một **việc cần người xử lý**, không phải lỗi cần tự sửa cho đẹp.

**Ví dụ — nhân viên đã nghỉ nhưng tài khoản vẫn hoạt động:** file nhân sự ghi C nghỉ việc từ 31/08. Danh sách thành viên Figma lấy ngày 10/09 vẫn có tài khoản của C, còn quyết định cấp quyền trong hệ thống vẫn hiệu lực. Hệ thống **giữ cả hai dữ liệu**, sinh cảnh báo **G2 — cần xử lý ngay**, và tạo việc thu hồi cho Quản trị viên CNTT. Hệ thống **không** tự xóa tài khoản ở nhà cung cấp, cũng **không** tự sửa hồ sơ nhân sự. Nếu còn thấy hoạt động mới của tài khoản sau ngày nghỉ, đó là dấu hiệu rủi ro bảo mật cần xử lý ngay.

**Đối soát định kỳ** với các ứng dụng có connector tìm hai loại sai lệch: _có trong hệ thống nhưng không có ở nhà cung cấp_ và _có ở nhà cung cấp nhưng không có quyết định cấp quyền_. Loại thứ hai là dấu hiệu seat được cấp ngoài quy trình. Hệ thống **không** tự tạo quyết định cấp quyền để lấp chỗ lệch.

**Thao tác gửi tới nhà cung cấp** có khóa chống gọi trùng và cơ chế **thử lại có giãn cách**; thất bại thì tác vụ ở trạng thái lỗi để thử lại hoặc làm thủ công, yêu cầu và nhật ký vẫn được giữ.

**Nhật ký kiểm toán** lưu ai thao tác, thao tác gì, vai trò lúc đó, giá trị trước và sau, thời điểm. Nhật ký chỉ ghi thêm, không cho sửa hay xóa.

## 6. Quy tắc nghiệp vụ chi tiết

Đây là các _ranh giới không được vi phạm_. Mã `BR-xx` là mã tham chiếu riêng của tài liệu này; khi cần chi tiết, xem BRD.

| Mã    | Quy tắc                                                                                                                                                                                                 |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BR-01 | Mỗi phần mềm trong danh mục phải có một người sở hữu nghiệp vụ đang làm việc. Người này nghỉ thì Quản trị viên CNTT chỉ định người khác.                                                                |
| BR-02 | Mỗi gói phải nêu rõ cách tính tiền. Quy tắc phát hiện seat lãng phí chỉ áp cho gói tính theo đầu người.                                                                                                 |
| BR-03 | Không được cấp nhiều seat hơn số đã mua. Số seat trống tính từ số đã mua trừ các assignment đang hiệu lực và các slot đang được giữ theo trạng thái provisioning; không chỉ đếm assignment đã hoàn tất. |
| BR-04 | Một nhân viên không được có hai quyền sử dụng còn hiệu lực cho cùng một thuê bao.                                                                                                                       |
| BR-05 | Khi nhân viên đổi quản lý trực tiếp hoặc cost center, hệ thống giữ lịch sử thay vì xóa thông tin cũ; báo cáo các tháng trước vẫn đúng.                                                                  |
| BR-06 | Người gửi yêu cầu không được tự duyệt yêu cầu của mình. Super Admin không phê duyệt nghiệp vụ, không cấp hoặc thu hồi seat, không duyệt thay.                                                           |
| BR-07 | Chỉ Quản trị viên CNTT thực hiện cấp hoặc thu hồi seat, và chỉ sau khi đủ các bước duyệt của nhánh. Dịch vụ tự động chỉ nhắc việc hoặc tạo khuyến nghị.                                                 |
| BR-08 | Phiên bản đầu **không có ủy quyền duyệt**. Khi Người duyệt chi là người xin hoặc người hưởng khoản chi, bước duyệt chi giao cho người duyệt thay thế đã được Super Admin cấu hình trước ᴼ.              |
| BR-09 | Không còn người duyệt hợp lệ thì yêu cầu được giữ ở trạng thái chờ, tiếp tục nhắc, và báo Super Admin cấu hình lại. Hệ thống không tự duyệt, không tự từ chối.                                          |
| BR-10 | Quản lý trực tiếp miễn trừ việc thu hồi một seat thì phải nêu lý do, thời hạn không quá 12 tháng. Hết hạn thì đưa lại vào hàng đợi rà soát.                                                             |
| BR-11 | Dữ liệu sử dụng chưa xác định được của ai thì không được dùng để kết luận một người không dùng phần mềm.                                                                                                |
| BR-12 | Không phát hiện G3/G4 khi bằng chứng chưa đủ: dữ liệu quá cũ, chưa đủ khoảng bao phủ, seat vừa cấp, người nghỉ dài, tài khoản dịch vụ, hoặc đã có khuyến nghị đang chờ.                                 |
| BR-13 | Đăng nhập không được tính là sử dụng. Mỗi nguồn phải nói rõ thế nào là _hoạt động_.                                                                                                                     |
| BR-14 | Ngưỡng phát hiện ưu tiên ngưỡng riêng của ứng dụng, rồi tới ngưỡng toàn doanh nghiệp, cuối cùng là ngưỡng mặc định.                                                                                     |
| BR-15 | Báo cáo tách tiền tiết kiệm được ngay khỏi tiền chỉ giảm được ở kỳ gia hạn; không cộng hai số này.                                                                                                      |
| BR-16 | Dữ liệu nội bộ thể hiện doanh nghiệp **định làm gì**; dữ liệu nhà cung cấp thể hiện **thực tế**. Khác nhau thì giữ cả hai để người có trách nhiệm xử lý.                                                |
| BR-17 | Mỗi nhà cung cấp chỉ có một bản ghi phần mềm ngoài danh mục đang mở; bằng chứng mới cập nhật vào bản ghi cũ.                                                                                            |
| BR-18 | Phần mềm ngoài danh mục chỉ là mục cần xem xét; không gán nhãn vi phạm trước khi Quản trị viên CNTT đánh giá.                                                                                           |
| BR-19 | Mỗi khoản tiền lưu số gốc, loại tiền, tỷ giá, ngày áp dụng tỷ giá và số đã quy đổi. Báo cáo quá khứ không đổi vì tỷ giá hôm nay khác.                                                                   |
| BR-20 | Dữ liệu sử dụng chi tiết, kể cả từ bộ thu thập, lưu tối đa 6 tháng hoặc tới 30 ngày sau ngày làm việc cuối, lấy mốc đến trước. Dữ liệu tổng hợp không còn nhận diện được cá nhân có thể giữ 24 tháng.   |

## 7. Kiểm soát dữ liệu cá nhân và riêng tư

Hệ thống xử lý dữ liệu nhân sự cơ bản và một phần **dữ liệu hành vi**, như ngày hoạt động gần nhất hay số phút dùng một SaaS. Dữ liệu từ bộ thu thập trên thiết bị được coi là **dữ liệu nhạy cảm** ᴼ. Vì vậy thiết kế áp dụng các biện pháp thận trọng:

- Chỉ thu trường cần thiết để quản trị quyền sử dụng; **không** thu nội dung chat, nội dung file, nội dung form, cookie, mật khẩu, token, phím bấm, clipboard, ảnh màn hình.
- **Bộ thu thập chỉ chạy trên thiết bị do công ty cấp và đã đăng ký**, không cài trên máy cá nhân.
- **Nhân viên phải bấm xác nhận** đã đọc thông báo — lưu phiên bản thông báo và thời điểm — **trước khi** hệ thống nhận bất kỳ dữ liệu nào. Im lặng không phải là đồng ý. Có **nút yêu cầu dừng thu thập**.
- Tiện ích **lọc ngay trên máy**: chỉ tên miền trong danh sách cho phép, ngày và số phút làm tròn. Máy chủ **từ chối** mọi dữ liệu có trường ngoài danh sách cho phép.
- Dữ liệu chỉ dùng để **tối ưu license**, không dùng để chấm năng suất hay kỷ luật. Quản lý trực tiếp chỉ thấy trạng thái tổng hợp của cấp dưới, không thấy nhật ký chi tiết, không có bảng xếp hạng thời gian dùng theo người.
- Nhân viên có thể xem và yêu cầu xuất dữ liệu hệ thống lưu về mình.
- Hệ thống tự xóa dữ liệu hết hạn nhưng giữ dữ liệu tổng hợp đã phi định danh và nhật ký kiểm toán theo chính sách.
- Ứng dụng liên lạc như Slack, Teams, Zoom, Gmail, Outlook **mặc định không thu** dữ liệu sử dụng chi tiết, kể cả qua tiện ích.
- **Việc ngoài phần mềm** mà doanh nghiệp triển khai phải tự làm: đưa chính sách vào nội quy lao động, và lập hồ sơ đánh giá tác động xử lý dữ liệu cá nhân.

**Lưu ý:** đây là lựa chọn thiết kế thận trọng của đồ án, dựa trên việc đọc Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 (đặc biệt Điều 25 khoản 3). Đây **không** phải kết luận pháp lý. Câu hỏi _thông báo cộng xác nhận có đủ thay sự đồng ý không_ vẫn cần ý kiến chuyên môn.

## 8. Phạm vi phiên bản đầu tiên và những gì hệ thống không làm

### Trong phạm vi phiên bản đầu tiên

- Nhập file là nền tảng: nhân sự, danh mục, hợp đồng, hóa đơn, quyết định cấp quyền, dữ liệu sử dụng, sao kê.
- Luồng yêu cầu và phê duyệt ba nhánh có Người duyệt chi, snapshot ngân sách và khoản cam kết.
- **Một kết nối thật với GitHub** để minh chứng cấp phát, đối soát và bằng chứng sử dụng qua commit. Ứng dụng chưa có kết nối vẫn được cấp phát thủ công và theo dõi đầy đủ.
- **Tiện ích trình duyệt** trên máy công ty, có đăng ký thiết bị và xác nhận của nhân viên. Demo bằng _load unpacked_; cài bắt buộc qua trình duyệt được quản lý là thiết kế triển khai.
- G1/G2 chạy với dữ liệu nội bộ; G3/G4 chạy khi có bằng chứng sử dụng đạt điều kiện ở mục 5.5.
- Năm nhóm báo cáo; dự báo lớp L1 và L3.

### Chỉ thiết kế, chưa hiện thực

- **Agent trên máy tính** cho ứng dụng desktop.
- Dự báo lớp L2 bằng mô hình xu hướng.

### Ngoài phạm vi phiên bản đầu tiên

- Ứng dụng di động.
- Cổng thanh toán, tự mua hoặc tự hủy gói tại nhà cung cấp.
- Thu **nhật ký truy cập web đầy đủ**, CASB, tường lửa hay máy chủ trung gian (proxy). Tiện ích trình duyệt **khác** các công cụ này: nó chỉ giữ tên miền trong danh sách cho phép, lọc ngay trên máy.
- Tự động chặn ứng dụng hoặc tự thu hồi quyền chỉ dựa trên cảnh báo.
- G5: hạ gói dựa trên hành vi sử dụng chi tiết.
- Ủy quyền duyệt; ma trận nhiều ngưỡng tiền cho thẩm quyền chi.
- Quản lý theo phòng ban hay đội nhóm.
- Mô hình nhiều tổ chức dùng chung một nền tảng; mỗi doanh nghiệp một bản cài đặt riêng.

### 8.1. Đề xuất demo ít nhất bốn dịch vụ bằng dữ liệu thật

**Trạng thái:** phương án trình bày và thử nghiệm bổ sung theo yêu cầu của Owner, **chưa kiểm thử live đủ bốn dịch vụ**, chưa thay đổi baseline. Theo [Sổ quyết định](../Decisions/project-decisions.md), `QĐ-21`/`QĐ-28a` hiện vẫn chọn GitHub và tiện ích cho tầng A; Microsoft 365, Atlassian, Figma dùng dữ liệu mô phỏng ở tầng B; Slack, Notion chứng minh G1/G2 ở tầng C. Phương án dưới đây mở rộng cách lấy bằng chứng thật cho Jira, Notion và Figma; cần xác nhận trước khi chuyển thành cam kết hiện thực. Nó không tự loại tiện ích khỏi MVP.

#### Mục tiêu và điều không được đánh đồng

Mục tiêu là trả lời **“Tài khoản được cấp có hoạt động được ghi nhận gần đây không?”**, không cần đo số phút, đọc màn hình hay theo dõi tiến trình trên máy. Dịch vụ cung cấp định danh người thực hiện và thời điểm hoạt động qua API chính thức; hệ thống khớp về nhân viên và Assignment đúng thời điểm.

Ba câu hỏi cần tách riêng:

- **Có hoạt động không?** Có thể chứng minh bằng commit, chỉnh sửa trang hoặc tạo phiên bản trong phạm vi được kết nối.
- **Có dùng đúng quyền trả phí không?** Có hoạt động của tài khoản chưa chứng minh tài khoản đã dùng tính năng trả phí; phải đối chiếu thêm loại quyền và dữ liệu của nhà cung cấp.
- **Có dùng trên máy công ty không?** Các API hoạt động đề xuất dưới đây không đủ chứng minh thiết bị thực hiện hoạt động.

Giao diện nên ghi **“Hoạt động cuối quan sát được”**, kèm loại hoạt động, phạm vi repository/project/file, nguồn và thời điểm đồng bộ. Không gọi đó là _lần sử dụng cuối của toàn tài khoản_ nếu nguồn chỉ thấy một phần hoạt động. Các nhãn diễn giải như _Có hoạt động / Cần xác minh / Chưa đủ dữ liệu_ không thay thế điều kiện G3/G4 tại mục 5.5.

#### Bốn dịch vụ đề xuất và cách tạo bằng chứng thật

| Dịch vụ    | Thao tác thật của thành viên khi demo             | Dữ liệu dự kiến lấy qua API                                               | Điều kiện và giới hạn                                                                                                                                                                                                  |
| ---------- | ------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GitHub** | Tạo và push commit vào repository của nhóm        | Định danh tác giả và thời điểm commit; lọc theo tác giả, khoảng thời gian | Cần quyền đọc repo và ánh xạ tác giả đúng tài khoản. Không thấy người chỉ đọc/review nếu chỉ lấy commit; không chứng minh đã dùng tính năng trả phí                                                                    |
| **Jira**   | Ghi một worklog trên issue demo                   | `author.accountId` và thời điểm tạo worklog                               | Cần quyền xem issue/worklog và cấu hình cho phép ghi worklog. Dùng thời điểm tạo bản ghi, không coi ngày làm việc tự khai là thời điểm tương tác. Chỉ chứng minh thao tác ghi worklog, không bao phủ mọi lần dùng Jira |
| **Notion** | Chỉnh sửa trang demo đã cấp quyền cho integration | `last_edited_by`, `last_edited_time` của trang                            | Chỉ thấy người sửa cuối và lần sửa cuối của trang, không phải lịch sử toàn tài khoản. Người khác sửa tiếp có thể che mất dấu vết trước khi đồng bộ; không thấy người chỉ đọc                                           |
| **Figma**  | Chỉnh thiết kế rồi lưu một phiên bản có tên       | Người tạo phiên bản và `created_at` từ `GET /v1/files/:key/versions`      | Cần quyền truy cập file và scope `file_versions:read`; chịu hạn mức API và lịch sử còn được giữ. Đây là **Version History**, không phải **Activity Logs** dành cho Enterprise; không ghi mọi thao tác xem/chỉnh sửa    |

**Mức kiểm chứng:** các cơ chế trên có căn cứ tài liệu chính thức đã tra trong trao đổi ngày 18/09/2026; **chưa có kết quả gọi thử đủ bốn dịch vụ bằng tài khoản nhóm**. Nguồn: [GitHub commits](https://docs.github.com/en/rest/commits/commits#list-commits), [Jira worklogs](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-worklogs/), [Notion Page](https://developers.notion.com/reference/page), [Figma Version History](https://developers.figma.com/docs/rest-api/version-history-types/) và [endpoint file versions](https://developers.figma.com/docs/rest-api/version-history-endpoints/).

Chỉ dùng tài khoản và tài nguyên demo được phép truy cập. Connector chỉ giữ định danh, thời gian, loại hoạt động và tham chiếu cần thiết; không đưa nội dung code, tài liệu, thiết kế, worklog hay token vào báo cáo hoặc bằng chứng công khai. Không chạy tự động thao tác ghi bằng tài khoản integration rồi gán hoạt động đó cho nhân viên.

#### Chi phí demo và quản lý gói miễn phí

**Chưa cần mua Enterprise để thử phương án này.** Có thể bắt đầu bằng [GitHub Free](https://github.com/pricing), [Jira Free](https://www.atlassian.com/licensing/jira), [Notion Free](https://www.notion.com/pricing) và [Figma Starter](https://www.figma.com/pricing/). Có gói miễn phí không đồng nghĩa mọi API, quyền quản trị hoặc lịch sử đều không giới hạn; riêng Figma áp [hạn mức theo endpoint, loại seat và gói của tài nguyên](https://developers.figma.com/docs/rest-api/rate-limits/). Phải thử lấy được bản ghi thật trước khi quyết định mua gói; không cam kết cả bốn tích hợp chạy được chỉ dựa vào trang giá.

- **Gói miễn phí vẫn có giá trị quản lý:** danh mục, người phụ trách, tài khoản được cấp, nhu cầu sử dụng và quy trình thu hồi quyền. Không tự coi giới hạn người dùng miễn phí là số seat trả phí đã mua.
- **Thu hồi quyền miễn phí không tạo tiền tiết kiệm:** khoản tiết kiệm thuê bao là **0**. Lợi ích là giảm quyền truy cập không cần thiết; không gọi đó là lãng phí tài chính đã thu hồi.
- **Pro/Ultra hoặc gói cá nhân phục vụ công việc** vẫn có thể ghi nhận thuê bao, người dùng và chi phí; tên gói không bảo đảm có API hoạt động hay cơ chế chuyển seat. Phải theo điều kiện từng nhà cung cấp.
- Nếu yêu cầu **cả chi phí cũng là dữ liệu thật**, cần thuê bao trả phí thực tế và chứng từ phù hợp. Không gán giá Enterprise cho tài khoản Free rồi gọi là tiết kiệm thật. Thu hồi giữa kỳ có giảm tiền không phải xét hợp đồng, như mục 5.6.

#### Kịch bản trình diễn

1. **Chuẩn bị:** hai thành viên A/B dùng tài khoản riêng thật; ghi nhận ứng dụng, gói thực tế và ánh xạ ID nhà cung cấp về hồ sơ nhân viên. Kết nối đúng repo, project và trang/file demo, với quyền tối thiểu cần thiết.
2. **Đồng bộ lần đầu:** hiện hoạt động đang quan sát được. B chưa có bản ghi thì hiện _Chưa ghi nhận hoạt động trong phạm vi kết nối_, không hiện _B không dùng_.
3. **Thao tác trực tiếp:** A push commit GitHub, ghi worklog Jira, sửa trang Notion và lưu phiên bản Figma.
4. **Đồng bộ lại:** lấy bản ghi API thật và cập nhật người thực hiện, thời gian, nguồn. Mở màn hình dịch vụ để đối chiếu. Hoạt động tạo phục vụ buổi demo vẫn là **dữ liệu thật trong môi trường demo**, không phải số liệu vận hành doanh nghiệp thật.
5. **Quyết định quản lý:** A có hoạt động gần đây là căn cứ cân nhắc giữ quyền; B thiếu bằng chứng thì cần xác minh. Quản lý xác nhận không còn nhu cầu mới đi theo luồng thu hồi hợp lệ. IT làm thủ công nếu dịch vụ chưa có connector thu hồi; đọc được usage không đồng nghĩa tự cấp/thu hồi được.

**Tiêu chí trước khi cam kết demo:** mỗi dịch vụ phải có ít nhất một lần lấy bản ghi thật đúng người và thời gian; kiểm tra quyền, phân trang/hạn mức liên quan, xử lý lỗi và kết quả khớp danh tính; lưu bằng chứng đã loại thông tin nhạy cảm. Chỉ khi cả bốn đạt mới ghi _đã kiểm thử live bốn dịch vụ_. Nếu một dịch vụ không đạt, phải nêu thiếu điều kiện hoặc thống nhất dịch vụ thay thế, không âm thầm thay bằng fixture.

#### Demo lãng phí và ngưỡng 30/60/90 ngày

**Không thể tạo tài khoản hôm nay rồi ngày mai có bằng chứng thật về 90 ngày không dùng.** Có thể dùng lịch sử cũ thật nếu nguồn đủ bao phủ, hoặc bắt đầu thu thập từ bây giờ cho lần bảo vệ sau. Ngày hoạt động cũ nhất/mới nhất của vài tài nguyên **không tự chứng minh** đã quan sát đầy đủ khoảng thời gian đó. Với hợp đồng cho phép giảm giữa kỳ, cần tách khoản tiết kiệm giữa kỳ khỏi khoản chỉ hiện thực tại kỳ gia hạn.

Nếu cần minh họa ngay bộ luật, có thể đề xuất một kịch bản thử nghiệm riêng với ngưỡng ngắn, ghi rõ _kiểm thử quy tắc với cấu hình thử nghiệm_. Đây **không** phải kết luận lãng phí theo ngưỡng nghiệp vụ thật, không được thay ngưỡng baseline hay bỏ các cổng loại trừ như seat mới cấp. Phương án này cần thống nhất, chưa phải chế độ đã hiện thực.

Notion/Figma theo phương pháp trên chủ yếu chứng minh **có hoạt động**. Thiếu sự kiện không đủ kết luận G3/G4 hoặc tự thu hồi. Muốn cam kết phát hiện không sử dụng cần nguồn đủ coverage, danh tính, độ mới và định nghĩa hoạt động phù hợp tại mục 5.5.

#### Xác minh tài khoản trên máy công ty

Các API trong bảng không đủ xác định máy đã thực hiện hoạt động. Demo trên laptop nhóm được quy ước là máy công ty chỉ chứng minh **điều kiện buổi trình diễn**, không chứng minh SaaS-Sentry có chức năng tự xác minh thiết bị.

Tiện ích hiện tại quan sát tên miền trên thiết bị đăng ký nhưng không biết tài khoản đăng nhập. Ghép _A có seat_ với _máy A mở website_ vẫn không chứng minh phiên đó dùng seat công ty. Muốn kiểm tra chính sách _chỉ dùng máy công ty_ phải có nguồn nhận diện hoặc kiểm soát thiết bị đáng tin cậy, chẳng hạn hạ tầng quản lý thiết bị/chính sách truy cập phù hợp; đây chưa phải năng lực đã được PoC chứng minh. Không thu cookie, mật khẩu hoặc nội dung trang để bù khoảng trống này.

#### Claude Code và Codex trong IDE

**Tiện ích trình duyệt không quan sát được hoạt động bên trong IDE.** Thấy VS Code mở cũng không chứng minh Claude/Codex được sử dụng. Nguồn phù hợp là dữ liệu phía nhà cung cấp nếu đúng sản phẩm, gói và quyền:

- **Claude Code:** [tài liệu usage analytics](https://support.claude.com/en/articles/12157520-claude-code-usage-analytics) mô tả analytics cho Console và chủ sở hữu Team/Enterprise, gồm export CSV email thành viên và số dòng code chấp nhận trong tháng. Đây là bổ sung so với việc chỉ xét Claude Enterprise Analytics API trong nghiên cứu trước. Tổng tháng không tự cho biết ngày dùng cuối; số dòng bằng 0 không chứng minh không dùng. Trang hỗ trợ được tra ngày 18/09/2026 ghi analytics này chưa dành cho Pro/Max cá nhân. Phải kiểm tra dữ liệu export thực tế trước khi chọn làm nguồn G3/G4.
- **Codex:** [hướng dẫn quản trị chính thức](https://learn.chatgpt.com/docs/enterprise/admin-setup) và [Analytics API](https://learn.chatgpt.com/docs/enterprise/analytics-api) mô tả các kênh báo cáo doanh nghiệp. Chưa kiểm chứng quyền truy cập/schema trên workspace của nhóm; không cam kết lấy được _last active theo nhân viên_ chỉ từ tài khoản cá nhân đang dùng. Cũng không suy dữ liệu hoạt động thành bằng chứng máy công ty.

Hai sản phẩm này **chưa nằm trong bốn dịch vụ bắt buộc của đề xuất**. Chỉ bổ sung/thay thế sau khi lấy được dữ liệu thật có định danh và thời gian phù hợp, xét độ trễ và phạm vi; không thu nội dung prompt/code chỉ để biết có hoạt động.

#### Câu trình bày ngắn trước giảng viên

> Nhóm đề xuất demo GitHub, Jira, Notion và Figma bằng hoạt động thật trên tài khoản thật, lấy metadata qua API chính thức, không theo dõi máy. Hệ thống hiển thị hoạt động cuối quan sát được và nguồn bằng chứng để hỗ trợ quyết định giữ hay thu hồi quyền. Không ghi nhận hoạt động chưa đồng nghĩa không sử dụng; việc xác minh máy công ty là phạm vi riêng. Phương án cần hoàn tất kiểm thử live từng dịch vụ trước khi cam kết.

## 9. Cách đo kết quả

| Chỉ số | Ý nghĩa                                                                                                                                                     |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| KPI-1  | Tỷ lệ chi tiêu quan sát được nằm trong danh mục đã phê duyệt                                                                                                |
| KPI-2  | Thời gian từ gửi yêu cầu tới khi có tài khoản, tách theo từng bước                                                                                          |
| KPI-3  | Tỷ lệ seat đang hoạt động trên tổng seat đã mua, với gói tính theo đầu người; mẫu số cần mentor chốt rõ có loại trừ seat miễn phí và slot pending hay không |
| KPI-4  | Số thuê bao tự gia hạn mà không có quyết định được ghi nhận trước hạn báo hủy                                                                               |
| KPI-5  | Tỷ lệ khuyến nghị bị bác bỏ hoặc bị dữ liệu mới phủ định — hệ thống tự đo mức báo nhầm của mình                                                             |

Với dữ liệu demo mô phỏng, nhóm **không** cam kết KPI của một doanh nghiệp thật. Hệ thống phải đạt các tiêu chí kiểm thử: phát hiện đúng G1/G2; không báo động giả trên các ca đặt bẫy (người mới, nghỉ dài, tài khoản dịch vụ, định danh chưa khớp, dữ liệu cũ hoặc thiếu coverage); mọi khuyến nghị truy được bằng chứng; không kết luận khi dữ liệu chưa đủ.

## 10. Checklist câu hỏi mentor/GVHD

Mỗi dòng chỉ hỏi một việc. `Need confirmation` nghĩa Owner đã có phương án nhưng chưa được mentor/GVHD xác nhận; `Need evidence` nghĩa cần thử nghiệm/tài liệu trước khi chốt.

| Mã        | Câu hỏi và bối cảnh                                                                                                 | Phương án hiện tại / điều cần xác nhận                                                                                                                                    | Tài liệu & việc bị chặn                                               | Ưu tiên · trạng thái          |
| --------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------- |
| MENTOR-01 | Quy trình `QĐ-29`/`QĐ-30` (Finance cung cấp/ghi nhận, Spending Approver quyết) có được duyệt không?                 | Giữ nguyên, Finance không nằm trên control path.                                                                                                                          | BRD, Scope, ERD, WF-09; Logical ERD/User Stories.                     | Blocker · Need confirmation   |
| MENTOR-02 | Nhánh còn seat/không phát sinh chi phí có bỏ Spending Approver không?                                               | Giữ nhánh Manager → IT theo `QĐ-29a`.                                                                                                                                     | BRD/Scope/WF-09; acceptance criteria.                                 | High · Need confirmation      |
| MENTOR-03 | Có chấp nhận demo GitHub/Jira/Notion/Figma bằng API thật nhưng giới hạn coverage không?                             | Đây là đề xuất demo, chưa là baseline; cần test live từng connector.                                                                                                      | QĐ-21/QĐ-28a, Scope, script demo; demo/code.                          | High · Need confirmation      |
| MENTOR-04 | Có được dùng token/repository thuộc owner GitHub nào và phạm vi quyền tối thiểu ra sao?                             | Chỉ dùng tài khoản/tài nguyên demo được phép.                                                                                                                             | Research, demo runbook; demo.                                         | High · Need evidence          |
| MENTOR-05 | Gói miễn phí có được dùng để chứng minh activity nhưng không tính savings không?                                    | Có, tách activity khỏi chi phí/savings.                                                                                                                                   | Mục 8.1, KPI; demo.                                                   | Medium · Need confirmation    |
| MENTOR-06 | Browser collector có bắt buộc xác minh đúng SaaS account trên company device không?                                 | Baseline hiện chỉ biết domain/registered device, không biết account; cần chốt có mở rộng không.                                                                           | QĐ-20/QĐ-28b, WF-18; Logical/implementation.                          | Blocker · Need confirmation   |
| MENTOR-07 | Thông báo + acknowledgement + nút dừng có đủ cho demo collector không?                                              | Đây là thiết kế thận trọng, không phải kết luận pháp lý.                                                                                                                  | BRD privacy, WF-18; demo/policy.                                      | High · Need confirmation      |
| MENTOR-08 | Agent desktop có tiếp tục là design-only không?                                                                     | Giữ ngoài MVP.                                                                                                                                                            | Scope, WF-18; code.                                                   | Later · Deferred              |
| MENTOR-09 | Có nguồn usage nào đủ coverage để chạy G3/G4 trong demo không?                                                      | Nếu không, chỉ minh họa G1/G2 và “chưa đủ dữ liệu”.                                                                                                                       | Research, BRD 5.5; demo/acceptance.                                   | High · Need evidence          |
| MENTOR-10 | Công thức KPI-3 có loại trừ free seat, pending slot và non-seat plan không?                                         | Chưa chốt mẫu số; không tự chọn công thức.                                                                                                                                | Description, BRD KPI; Logical/report.                                 | High · Need confirmation      |
| MENTOR-11 | Hai relation/cardinality `IdentityMapping` và `DiscoveryEvidence` trong ERD artifact được hiểu theo matrix hay XML? | **Closed — artifact consistency.** Matrix–Mermaid–Draw.io đã khớp; checker và 13 mutation test pass. Đây là sửa biểu diễn theo quy ước hiện có, không thay đổi nghiệp vụ. | ERD source/manifest; không còn chặn Logical ERD về kỹ thuật artifact. | Closed — artifact consistency |
| MENTOR-12 | Result contract của các node gọi `WF-09a`/ghi savings có cần guard explicit không?                                  | Bổ sung acceptance criteria trước Logical, không sửa diagram lượt này.                                                                                                    | Workflow source/BRD; Logical/User Stories.                            | High · Need confirmation      |
| MENTOR-13 | UI Spec đã hoãn có cần mở lại không?                                                                                | Không; `Deferred`, làm song song glossary/criteria.                                                                                                                       | Scope/Decisions; không chặn tài liệu hiện tại.                        | Later · Deferred              |
| MENTOR-14 | Nội dung nào phải chốt trước User Stories/chia task/code?                                                           | Chốt role/authority, evidence coverage và workflow outcomes còn mở; có thể làm glossary, traceability, test fixtures song song.                                           | BRD/Scope/Decisions; US/task/code gate.                               | Blocker · Need confirmation   |

### 10.1. Phân biệt câu hỏi cần quyết định và việc nhóm phải kiểm chứng

**Ghi chú review 19/09/2026:** finding mức High không tự có nghĩa là nghiệp vụ chưa được mentor quyết định. Cần phân biệt ba việc:

- **Cần xác nhận phạm vi/quyền hạn:** ví dụ mức bằng chứng usage chấp nhận được, có bắt buộc xác minh đúng tài khoản SaaS trên máy công ty hay không, và xác nhận các quyết định Owner chưa được mentor/GVHD duyệt. Xem `MENTOR-01`–`MENTOR-03`, `MENTOR-06`–`MENTOR-07`.
- **Cần bằng chứng kỹ thuật:** nhóm phải thử API bằng tài khoản/quyền thật, kiểm tra nguồn và khoảng bao phủ; mentor đồng ý phương án không thay thế kết quả thử nghiệm. Xem `MENTOR-04`, `MENTOR-09`. API activity và domain trên thiết bị là hai loại bằng chứng có giới hạn khác nhau; việc thiếu dữ liệu không tự chứng minh không sử dụng.
- **Cần sửa cách thể hiện hoặc đặc tả theo baseline:** nếu BRD đã quy định, nhóm đối chiếu và bổ sung điều kiện chuyển bước, tiêu chí nghiệm thu. Với `MENTOR-12`, trạng thái pending/lỗi không được diễn giải thành đã cấp hoặc đã thu hồi thành công; không cần xin mentor cho phép bỏ quy tắc này. Chỉ đưa ra quyết định mới khi còn tình huống mà baseline chưa phân định.

### 10.2. Ba ghi chú Workflow cần mang vào review

Các ghi chú dưới đây tập trung vào nghiệp vụ và điều kiện nghiệm thu. Nguồn đối chiếu: [BRD hiện hành](BRD%20-%20HỆ%20THỐNG%20QUẢN%20TRỊ%20BẢN%20QUYỀN%20PHẦN%20MỀM%20%26%20TỐI%20ƯU%20CHI%20PHÍ%20CÔNG%20NGHỆ.md) và [Workflow index](../Diagrams/workflows-activity-diagram/index.md). Đây chưa phải quyết định mới của Owner/mentor.

#### Savings giữa kỳ — WF-13, liên quan WF-07 và WF-15

**Đã chốt trong baseline:** `FR-4.15` và `BR-20.2` cho phép tiết kiệm có thể thực hiện ngay với gói theo tháng **hoặc hợp đồng cho giảm số lượng giữa kỳ**. Thu hồi quyền không tự làm hóa đơn giảm. Với hợp đồng cam kết không cho giảm giữa kỳ, lợi ích tài chính chỉ hiện thực khi giảm số lượng ở kỳ gia hạn; hai con số phải trình bày riêng.

**Finding cần nhóm sửa:** note `nt2` của `WF-13` đang ghi “Immediate savings are non-zero only for monthly plans”, hẹp hơn chính bảng `BR-20.2` của index. Đây là lỗi diễn giải so với quy tắc đã có. Ngoài ra, cần nối kết quả thực thi `WF-09a` với `WF-13/a8` và `WF-07/a5` để không ghi đã thu hồi khi thực thi còn pending/lỗi, cũng không ghi tiền tiết kiệm thực tế chỉ vì seat đã trống.

**Role/chức năng:** Manager xác nhận nhu cầu theo nhánh; IT Admin thực hiện thu hồi; System ghi kết quả và phân loại tiết kiệm; Người duyệt chi quyết giảm số lượng/gia hạn tại `WF-15`; Finance cung cấp và ghi nhận thông tin tài chính. Liên quan phát hiện lãng phí, offboarding và báo cáo tiết kiệm.

Ví dụ: thu hồi 2 seat trong hợp đồng năm đã cam kết vẫn có thể tiết kiệm ngay **0 đồng**. Con số giảm chi ở kỳ sau chỉ trở thành thực tế khi doanh nghiệp gia hạn với số lượng thấp hơn.

**Việc còn cần làm:** nhóm bổ sung ca nghiệm thu cho hợp đồng có/không cho giảm giữa kỳ, pending/failure và đối chiếu khoản giảm tiền. Mentor chỉ cần chốt thêm nếu yêu cầu cách tính hoặc bằng chứng tài chính vượt nội dung baseline. Việc đang phụ thuộc: đặc tả báo cáo/savings, User Stories và code liên quan; không phải blocker của toàn bộ dự án.

#### Đường hợp thức hóa Shadow IT — WF-17

**Đã chốt trong baseline:** `FR-3.4(c)` yêu cầu SaaS mới đi qua Người duyệt chi, kể cả miễn phí. `BR-34.2` cho phép ghi nhận người đang dùng thành quyền chính thức, không buộc họ xin lại từ đầu. Hai quy tắc phải cùng được giữ.

**Finding cần làm rõ:** sơ đồ đi từ IT Admin `d2 [approved, legitimize]` → `c2` đăng ký catalog qua `WF-02` → `c3` gọi `WF-09` → `a7` ghi nhận người đang dùng. Nếu `WF-09` chỉ xét trạng thái catalog sau khi đã thêm, nguồn gốc “SaaS mới cần duyệt” có thể bị mất. Cần thể hiện nơi ghi nhận quyết định của Người duyệt chi và cách tái sử dụng quyết định; chưa tự chọn phải gọi `WF-10` hay thêm bước riêng.

**Role/chức năng:** Finance cung cấp sao kê/hóa đơn; Manager giải thích nhu cầu; IT Admin đánh giá finding và thực hiện hợp thức hóa; Người duyệt chi quyết thay đổi danh mục; System giữ nguồn và lịch sử quyết định. Liên quan Discovery, catalog và request approval.

**MENTOR-15 — Quyết định của Người duyệt chi được ghi ở bước nào khi hợp thức hóa SaaS mới phát hiện qua WF-17?**

- Bối cảnh: cần giữ thẩm quyền duyệt SaaS mới và tránh bắt người đang dùng gửi lại request.
- Phương án hiện tại của nhóm: giữ hai quy tắc baseline trên; vị trí bước và cơ chế dùng lại quyết định chưa được chốt trong ghi chú này.
- Mong xác nhận: vị trí quyết định trong luồng hợp thức hóa và căn cứ để luồng sau nhận biết đã duyệt hợp lệ.
- Tài liệu bị ảnh hưởng: Workflow index, source WF-17/WF liên quan, User Flows và acceptance criteria; BRD/Decisions chỉ đổi nếu thực sự đổi nghiệp vụ.
- Việc phụ thuộc: đặc tả, User Stories và code hợp thức hóa Shadow IT. **High · Need confirmation**.

#### Điều kiện overdue — WF-15

**Đã chốt trong baseline:** Người duyệt chi quyết gia hạn/giảm/hủy (`FR-3.13`, `BR-27.4`); cảnh báo dựa trên hạn chót báo hủy (`BR-26.1`); tự gia hạn không có quyết định được tính là sự cố (`BR-26.3`). Quá SLA duyệt không tự tạo quyết định chấp thuận.

**Finding cần làm rõ:** `d2 [overdue, unhandled]` nối thẳng tới `a10 Auto-renew & Record as an Incident`; note `nt3` nhắc SLA nhưng guard chưa phân biệt quá SLA, quá hạn báo hủy và thời điểm nhà cung cấp thực sự gia hạn. Cần làm rõ cả trường hợp thuê bao không bật tự gia hạn. Chưa đủ căn cứ để diễn giải mọi overdue thành sự cố tự gia hạn đã xảy ra.

**Role/chức năng:** System theo dõi mốc thời gian và bằng chứng trạng thái thuê bao; IT Admin xử lý cảnh báo; Người duyệt chi ra quyết định; Finance hỗ trợ thông tin/ghi nhận. Liên quan quản lý gia hạn, cảnh báo và KPI-4.

**MENTOR-16 — Điều kiện chính xác nào cho phép WF-15 chuyển sang “Auto-renew & Record as an Incident”?**

- Bối cảnh: cần phân biệt chậm duyệt, mất cơ hội báo hủy và gia hạn thực tế để không báo sai trạng thái/KPI-4.
- Phương án hiện tại của nhóm: giữ nguyên thẩm quyền và quy tắc sự cố trong baseline; đề nghị đặc tả riêng các mốc SLA, cancellation deadline, renewal date và trạng thái auto-renew.
- Mong xác nhận: sự kiện/bằng chứng nào đủ ghi incident và cách xử lý thuê bao không tự gia hạn; đây là chi tiết còn cần xác nhận, chưa thành baseline mới.
- Tài liệu bị ảnh hưởng: WF-15/index, User Flows, đặc tả cảnh báo/KPI-4; BRD/Decisions nếu thay đổi định nghĩa sự cố.
- Việc phụ thuộc: acceptance criteria, User Stories và code gia hạn/KPI-4. **High · Need confirmation**.

## 11. Kết luận đề xuất duyệt

SaaS-Sentry không nhằm trở thành công cụ giám sát nhân viên, cũng không phải nền tảng tự động cắt giảm chi phí. Giá trị cốt lõi là một quy trình quản trị SaaS có dữ liệu thống nhất, phân quyền rõ ràng, bằng chứng truy vết được, và quyết định do đúng người đưa ra.

Nếu được duyệt theo hướng này, nhóm dùng tài liệu làm mốc thống nhất để hoàn thiện luồng sử dụng, màn hình, kịch bản demo và kiểm thử nghiệp vụ.
