# WHY — Sự cần thiết của dự án SaaS-Sentry

> **Dự án:** SaaS-Sentry — Hệ thống quản trị bản quyền phần mềm và tối ưu chi phí công nghệ  
> **Mục đích tài liệu:** Làm rõ vì sao doanh nghiệp cần hệ thống, dựa trên pain point nghiệp vụ và các số liệu tham khảo có nguồn.

---

## 1. Tóm tắt vấn đề

Doanh nghiệp ngày càng sử dụng nhiều phần mềm theo mô hình thuê bao (SaaS) như Microsoft 365, GitHub, Jira, Figma, Slack, Zoom và các công cụ AI. SaaS giúp triển khai nhanh và linh hoạt, nhưng cũng làm dữ liệu về phần mềm, license, người dùng, hợp đồng, hóa đơn và chi phí bị phân tán giữa IT, Finance và từng phòng ban.

Khi doanh nghiệp chưa có một đầu mối quản trị, năm vấn đề thường xuất hiện đồng thời:

1. License đã mua nhưng không còn được sử dụng vẫn tiếp tục phát sinh phí.
2. Subscription tự gia hạn vì không ai theo dõi hạn báo hủy.
3. Finance nhìn thấy khoản chi nhưng không xác định được phần mềm, người dùng hoặc Cost Center chịu trách nhiệm.
4. Nhân viên/phòng ban tự đăng ký công cụ ngoài quy trình, tạo Shadow IT và rủi ro dữ liệu.
5. Quy trình xin cấp phần mềm chậm khiến người dùng có động cơ đi đường vòng.

SaaS-Sentry được đề xuất để tập trung hóa dữ liệu và quy trình quản trị SaaS. Hệ thống cung cấp thông tin, cảnh báo, lịch sử kiểm toán và hỗ trợ ra quyết định; hệ thống **không tự động phê duyệt chi tiêu, cấp/thu hồi quyền hoặc kết luận một phần mềm là vi phạm**.

---

## 2. Dẫn chứng: chi phí và số lượng SaaS đang tăng

Theo **2025 SaaS Management Index** của Zylo, báo cáo phân tích hơn **40 triệu SaaS licenses** và **40 tỷ USD chi tiêu SaaS** trong tập dữ liệu do Zylo quản lý:

- Chi tiêu SaaS bình quân là **4.830 USD trên mỗi nhân viên**, tăng **21,9%** so với cùng kỳ năm trước.
- Chi tiêu cho các ứng dụng AI-native tăng **75,2%** theo năm.
- **66,5%** lãnh đạo IT được khảo sát cho biết đã gặp các khoản phí SaaS phát sinh ngoài dự kiến do mô hình tính phí theo mức sử dụng hoặc AI.

Nguồn: [Zylo — 2025 SaaS Management Index](https://zylo.com/news/2025-saas-management-index).

Một khảo sát năm 2025 của BetterCloud với khoảng **600 chuyên gia IT** cho thấy một tổ chức trung bình sử dụng **106 ứng dụng SaaS**. Báo cáo cũng ghi nhận hơn một nửa người trả lời chịu áp lực ngân sách và tình trạng ứng dụng/license sử dụng chưa hiệu quả.

Nguồn: [BetterCloud — 2025 State of SaaS Trends](https://www.bettercloud.com/monitor/2025-state-of-saas-trends/).

### Ý nghĩa đối với dự án

Khi số phần mềm và hình thức tính phí tăng, doanh nghiệp không thể chỉ lưu danh sách SaaS. Họ cần liên kết được từng ứng dụng với gói thuê bao, hợp đồng, hóa đơn, ngày gia hạn, Cost Center, người sử dụng và mức độ sử dụng thực tế. Đây là lý do SaaS-Sentry có các phân hệ **SaaS Catalog**, **Subscription/Contract/Invoice** và **Financial Dashboard**.

> **Lưu ý học thuật:** Các số liệu trên là benchmark quốc tế từ dữ liệu/khảo sát của nhà cung cấp giải pháp SaaS Management; không được diễn giải là số liệu đại diện trực tiếp cho doanh nghiệp Việt Nam. Chúng được dùng để chứng minh xu hướng và quy mô của bài toán.

---

## 3. Lãng phí license chưa sử dụng (Ghost Seat)

Ghost Seat là license đã được mua hoặc cấp cho người dùng nhưng không còn tạo ra giá trị tương ứng. Ví dụ, doanh nghiệp mua 100 tài khoản Figma nhưng chỉ 70 người còn hoạt động; 30 tài khoản còn lại vẫn có thể bị tính phí định kỳ.

Zylo báo cáo mức lãng phí trung bình **21 triệu USD mỗi năm** cho các license SaaS chưa sử dụng trong các tổ chức thuộc tập dữ liệu của họ, tăng **14,2%** so với năm trước.

Nguồn: [Zylo — 2025 SaaS Management Index](https://zylo.com/news/2025-saas-management-index).

### Vì sao doanh nghiệp khó tự phát hiện?

- Dữ liệu số seat đã mua nằm trong hợp đồng hoặc hóa đơn.
- Dữ liệu seat đã cấp nằm trong trang quản trị của từng nhà cung cấp.
- Dữ liệu hoạt động nằm trong usage export hoặc API khác.
- Manager mới biết người dùng còn cần công cụ cho công việc hay không.

Nếu không đối chiếu các nguồn này, doanh nghiệp chỉ biết đã mua bao nhiêu license chứ không biết license nào thực sự đem lại giá trị.

### SaaS-Sentry giải quyết như thế nào?

- Lưu số lượng seat đã mua, đã cấp, còn trống và đã thu hồi.
- Import dữ liệu usage, đặc biệt là ngày hoạt động gần nhất khi nguồn cung cấp.
- Áp dụng quy tắc phát hiện license ít dùng theo ngưỡng cấu hình.
- Tạo khuyến nghị Ghost Seat để Manager xác nhận **Keep / Reclaim / Exempt** kèm lý do.
- Chỉ IT Admin mới thực hiện thao tác thu hồi sau khi có đủ phê duyệt.

Thiết kế này cân bằng giữa tối ưu chi phí và an toàn vận hành: dữ liệu hỗ trợ phát hiện, nhưng con người quyết định hành động cuối cùng.

---

## 4. Rủi ro gia hạn ngoài ý muốn (Auto-Renewal Trap)

Nhiều SaaS tự động gia hạn. Rủi ro không chỉ nằm ở ngày gia hạn mà còn ở **hạn chót báo hủy**: doanh nghiệp có thể phải thông báo trước 30–60 ngày. Nếu phát hiện muộn, doanh nghiệp có thể bị ràng buộc trả thêm một chu kỳ thuê bao dù dự án đã kết thúc hoặc nhu cầu sử dụng đã giảm.

BetterCloud ghi nhận trong báo cáo State of SaaS 2025 rằng **40%** tổ chức vẫn theo dõi ngày gia hạn thủ công, **34%** dùng cảnh báo tự động, còn **25%** không có hành động và để ứng dụng tự gia hạn.

Nguồn: [BetterCloud — 2025 State of SaaS Trends](https://www.bettercloud.com/monitor/2025-state-of-saas-trends/).

### SaaS-Sentry giải quyết như thế nào?

- Quản lý riêng Contract, Subscription và Invoice để tránh nhầm lẫn dữ liệu.
- Lưu ngày gia hạn, điều khoản, hạn báo hủy và người chịu trách nhiệm nghiệp vụ.
- Cảnh báo theo hạn báo hủy thay vì chỉ cảnh báo theo ngày gia hạn.
- Ghi nhận quyết định gia hạn/hủy và lịch sử phê duyệt.

Nhờ vậy, doanh nghiệp có thể chủ động ra quyết định trước khi mất quyền hủy, thay vì chỉ biết khoản chi sau khi đã phát sinh.

---

## 5. Bất đối xứng thông tin giữa Finance, IT và phòng ban sử dụng

Finance thường nhìn thấy giao dịch trên sao kê hoặc hóa đơn, nhưng không biết chính xác:

- Đó là phần mềm nào và có trong danh mục được phê duyệt không?
- Phòng ban, dự án hoặc Cost Center nào chịu chi phí?
- Ai là người sở hữu nghiệp vụ và ai đang dùng?
- Khoản chi có nằm trong ngân sách hay không?

Ngược lại, IT có thể biết một phần phần mềm đang dùng nhưng không nắm đầy đủ ngân sách và giao dịch tài chính. Sự tách rời này khiến doanh nghiệp khó đối soát, khó phân bổ chi phí và khó chứng minh trách nhiệm.

### SaaS-Sentry giải quyết như thế nào?

Hệ thống liên kết **Catalog Entry → Subscription → Contract/Invoice → License Assignment → Employee/Team/Cost Center**. Từ đó, Finance và IT có cùng một bức tranh dữ liệu về chi tiêu SaaS. Dashboard tài chính hiển thị Budget vs Actual, chi phí theo Cost Center/dự án và thời điểm dữ liệu được cập nhật gần nhất.

---

## 6. Shadow IT và rủi ro bảo mật, tuân thủ

Microsoft định nghĩa Shadow IT là các ứng dụng hoặc dịch vụ được sử dụng khi bộ phận IT không biết hoặc chưa phê duyệt. Các rủi ro gồm bảo mật, tuân thủ, thất thoát dữ liệu và chi phí/ license trùng lặp.

Nguồn: [Microsoft Learn — Discover applications and Shadow IT](https://learn.microsoft.com/en-us/entra/global-secure-access/tutorial-internet-access-application-discovery).

BetterCloud 2025 cho biết gần **60%** nhân sự IT được khảo sát vẫn lo ngại ở mức độ nào đó về Shadow IT. Báo cáo này cũng cho thấy **95%** công ty được khảo sát đã đầu tư vào các use case AI — điều làm nhu cầu kiểm soát công cụ bên thứ ba và dữ liệu doanh nghiệp trở nên cấp thiết hơn.

Nguồn: [BetterCloud — 2025 State of SaaS Trends](https://www.bettercloud.com/monitor/2025-state-of-saas-trends/).

### Hệ quả trong doanh nghiệp

- IT không biết dữ liệu công ty được đưa lên dịch vụ nào để đánh giá rủi ro hoặc thu hồi quyền khi nhân viên nghỉ việc.
- Finance thấy khoản chi nhưng không xác định được công cụ và mục đích sử dụng.
- Các phòng ban có thể mua nhiều công cụ trùng chức năng.
- Công cụ AI có thể nhận dữ liệu nội bộ mà chưa qua đánh giá bảo mật.

### SaaS-Sentry giải quyết như thế nào?

Hệ thống đối chiếu SaaS Catalog đã được phê duyệt với các nguồn bằng chứng được phép, chẳng hạn sao kê/hóa đơn tài chính hoặc export từ Identity Provider. Nếu có mục không khớp, hệ thống tạo bản ghi **Potential Unapproved SaaS** để IT Admin xem xét.

Điểm quan trọng là hệ thống không khẳng định đây là hành vi vi phạm, không tự động chặn ứng dụng và không cam kết phát hiện 100% Shadow IT. Mục tiêu là đưa rủi ro từ trạng thái **“không ai biết”** sang **“có bằng chứng, có người chịu trách nhiệm và có quyết định được ghi nhận”**.

---

## 7. Quy trình cấp phần mềm chậm là nguyên nhân gốc của Shadow IT

Người dùng thường tìm công cụ bên ngoài khi quy trình chính thức quá chậm hoặc không minh bạch. Vì vậy, chỉ phát hiện Shadow IT là xử lý phần ngọn; doanh nghiệp cần cải thiện con đường chính thức để nhân viên có thể yêu cầu và nhận quyền truy cập đúng lúc.

BetterCloud 2025 cho biết tỷ lệ IT trên nhân viên đã lên tới **1 nhân sự IT trên 108 nhân viên**, tăng **31%** so với tỷ lệ 1:82 trước đó. Đây là áp lực thực tế làm tăng nhu cầu tự động hóa các công việc quản trị SaaS lặp lại.

Nguồn: [BetterCloud — State of SaaS 2025, trang tóm tắt PDF](https://pages.bettercloud.com/rs/719-KZY-706/images/BetterCloud-State-of-SaaS-2025.pdf).

### SaaS-Sentry giải quyết như thế nào?

- Nhân viên gửi yêu cầu cấp mới, thay đổi, gia hạn, hoàn trả license hoặc yêu cầu SaaS mới.
- Hệ thống định tuyến theo Team, Manager, Cost Center và loại yêu cầu.
- Manager xác nhận nhu cầu nghiệp vụ; Finance phê duyệt khoản chi khi cần; IT Admin thực hiện thao tác kỹ thuật.
- Hệ thống đo thời gian từ lúc gửi yêu cầu đến lúc license được cấp, đồng thời tách được thời gian chậm theo từng bước duyệt.

Như vậy, hệ thống vừa kiểm soát được quyền truy cập vừa giảm động cơ khiến người dùng tự mua hoặc tự đăng ký công cụ bên ngoài.

---

## 8. Bối cảnh Việt Nam và nhóm doanh nghiệp mục tiêu

Quyết định **1121/QĐ-TTg** phê duyệt Chương trình hành động quốc gia phát triển và chuyển đổi sang sử dụng nền tảng điện toán đám mây giai đoạn 2025–2030. Đây là cơ sở cho thấy bài toán quản trị SaaS phù hợp với xu hướng ứng dụng cloud tại Việt Nam.

Nguồn: [Cổng Văn bản Chính phủ — Quyết định 1121/QĐ-TTg](https://vanban.chinhphu.vn/?classid=0&docid=213903&pageid=27160).

SaaS-Sentry hướng tới công ty công nghệ, software outsourcing và doanh nghiệp đang chuyển đổi số, quy mô khoảng **100–500 nhân sự**, có khoảng **15–40 ứng dụng SaaS**, nhiều phòng ban/Cost Center và số lượng IT Admin giới hạn. Ở quy mô này, bảng tính thường không còn đủ để quản lý, trong khi các nền tảng SaaS Management thương mại lớn có thể vượt quá ngân sách hoặc nhu cầu triển khai của doanh nghiệp.

---

## 9. Kết luận: giá trị cốt lõi của SaaS-Sentry

SaaS-Sentry cần thiết vì SaaS đang trở thành một khoản chi phí và rủi ro vận hành quan trọng, nhưng dữ liệu quản trị thường bị phân mảnh. Hệ thống giúp doanh nghiệp:

- **Tối ưu chi phí:** phát hiện license ít dùng, quản lý ngày báo hủy và theo dõi ngân sách.
- **Tăng minh bạch:** liên kết chi phí với phần mềm, người dùng, phòng ban và Cost Center.
- **Giảm rủi ro:** đưa Shadow IT vào diện xem xét và bảo vệ dữ liệu bằng phân quyền, Audit Trail.
- **Nâng hiệu quả vận hành:** chuẩn hóa yêu cầu–phê duyệt–cấp/thu hồi quyền và đo được điểm nghẽn quy trình.
- **Hỗ trợ quyết định có trách nhiệm:** sử dụng dữ liệu và quy tắc có thể giải thích, nhưng vẫn giữ quyết định tài chính, nghiệp vụ và kỹ thuật ở con người.

### Phiên bản ngắn dùng khi thuyết trình

> SaaS-Sentry được xây dựng để giải quyết tình trạng quản lý SaaS phân tán: license không sử dụng, gia hạn ngoài ý muốn, chi phí thiếu minh bạch và Shadow IT. Các báo cáo thị trường cho thấy doanh nghiệp đang sử dụng hàng trăm ứng dụng SaaS và chịu áp lực lớn về chi phí, bảo mật cũng như khối lượng vận hành IT. Hệ thống tập trung hóa dữ liệu SaaS, license, hợp đồng, hóa đơn, usage và ngân sách; đồng thời chuẩn hóa luồng yêu cầu–phê duyệt–cấp quyền để doanh nghiệp kiểm soát chi phí và rủi ro tốt hơn mà không thay thế quyết định của con người.

---

## 10. Danh mục nguồn tham khảo

1. Zylo. (2025, January 16). _2025 SaaS Management Index Reveals First Increase in Average SaaS Spend in Three Years_. https://zylo.com/news/2025-saas-management-index
2. BetterCloud. (2025, April 30). _2025 State of SaaS Trends_. https://www.bettercloud.com/monitor/2025-state-of-saas-trends/
3. BetterCloud. (2025). _State of SaaS 2025 — Biggest Takeaways_. https://pages.bettercloud.com/rs/719-KZY-706/images/BetterCloud-State-of-SaaS-2025.pdf
4. Microsoft Learn. _Discover applications and Shadow IT_. https://learn.microsoft.com/en-us/entra/global-secure-access/tutorial-internet-access-application-discovery
5. Thủ tướng Chính phủ. (2025). _Quyết định số 1121/QĐ-TTg: Phê duyệt Chương trình hành động quốc gia phát triển và chuyển đổi sang sử dụng nền tảng điện toán đám mây giai đoạn 2025–2030_. https://vanban.chinhphu.vn/?classid=0&docid=213903&pageid=27160
