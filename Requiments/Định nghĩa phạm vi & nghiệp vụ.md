# SaaS-Sentry — WHY / WHAT / WHO và Định hướng nghiên cứu

> **Phiên bản:** 1.24 — 12/10/2026 — đồng bộ **BRD v3.35**, theo sổ quyết định `QĐ-01` → `QĐ-66`.
>
> **Mục đích:** trả lời bốn câu hỏi nền của đồ án — *vì sao cần*, *làm gì*, *ai dùng*, *cần nghiên cứu gì* — ở mức đủ để trình bày và bảo vệ.
>
> **Quan hệ với BRD:** **BRD** là **nguồn chân lý duy nhất** về phạm vi, yêu cầu chức năng, mô hình miền nghiệp vụ và quyết định kiến trúc. Tài liệu này **không lặp lại** BRD; nó trả lời phần "vì sao" và "nghiên cứu gì", và dẫn chiếu sang BRD ở những chỗ đã có. **Thứ tự căn cứ:** sổ quyết định (`QĐ`) → BRD hiện hành → tài liệu này → sơ đồ và hình trình bày.
>
> **Cách đọc:** tài liệu chỉ ghi **nội dung đang có hiệu lực**; nhật ký sửa từng đợt và nội dung đã bị thay nằm ở sổ quyết định và lịch sử git của repo Docs. Quyết định trong tài liệu là của **nhóm trưởng/Owner**; trừ chỗ ghi rõ, **chưa phải xác nhận** của hội đồng, GVHD hay mentor.
>
> **Đọc nhanh:** nếu chỉ có 2 phút, đọc **Problem Statement** ở mục 1.1, sơ đồ **Đầu vào → Xử lý → Đầu ra** ở mục 2.2, và **bảng liên kết WHY → WHAT → WHO** ở Phần IV.

### Lịch sử phiên bản

| Phiên bản | Ngày | Thay đổi chính | Nguồn |
| --- | --- | --- | --- |
| 0.5 – 1.0 | 08/2026 | Problem Statement; mô hình Đầu vào → Xử lý → Đầu ra; bảng WHY → WHAT → WHO; 16 chủ đề lý thuyết, 16 chủ đề kỹ thuật; sổ theo dõi kiểm chứng bốn trạng thái; baseline có điều kiện thay đổi truy được tác động | — |
| 1.1 – 1.3 | 31/08–08/09/2026 | NestJS (`ADR-11`); gỡ Domain Spec về BRD 5.12; phân vai theo bản nộp GVHD (`QĐ-05`, `QĐ-06`); đổi mã quyết định kỹ thuật thành `QĐKT-xx` | `QĐ-05`, `QĐ-06`, `QĐ-10` |
| 1.4 – 1.7 | 14–16/09/2026 | Người duyệt chi; Finance kiểm soát ngân sách; bộ thu thập trên thiết bị; bỏ ủy quyền duyệt; GitHub đo bằng commit; danh sách cho phép từ Catalog + từ điển nhà cung cấp | `QĐ-20` → `QĐ-30` |
| 1.8 – 1.12 | 28/09–02/10/2026 | Phạm vi luồng `42 / 4 / 2`; Desktop Agent và OTel mức demo; một tính năng AI; *Đối soát chi phí phần mềm*; ranh giới tài chính | `QĐ-31` → `QĐ-38` |
| 1.13 – 1.17 | 02–04/10/2026 | Xác thực nội bộ thay OIDC; một Super Admin; khôi phục | `QĐ-39` → `QĐ-47` |
| 1.18 | 05/10/2026 | Ba loại đối tượng quản lý; bộ năm main flow; hai tính năng AI | `QĐ-49`, `QĐ-50` |
| 1.19 | 08/10/2026 | Review 1 của hội đồng: tổ chức theo phòng ban; ma trận trách nhiệm; biểu mẫu; kiểu cấp, kho khóa, tài khoản công ty và dùng chung; ghi nhận thuế; nghiên cứu lại phương pháp usage — BRD 4.6, 5.13 (`BM-01` → `BM-08`), `FR-1.9`, `FR-1.10`, `FR-2.9` → `FR-2.12`, `FR-3.17` → `FR-3.19`, `FR-5.13`, `FR-5.14` | `QĐ-51` → `QĐ-57` |
| 1.20 | 08/10/2026 | Một người làm trưởng tối đa một phòng (`OQ-24` đóng); phạm vi IT Admin theo phòng được giao; ngân sách so trên tổng chi gồm thuế; chính sách thiết bị công ty `FR-4.21`; **dọn tài liệu chỉ còn nội dung hiện hành** | `QĐ-58` |
| 1.21 | 08/10/2026 | Tập trung vào nghiệp vụ: chi tiết bộ thu thập và kịch bản nguồn usage của `D-2` chuyển sang tệp nghiên cứu tool & vendor; câu hỏi pháp lý *hoãn có điều kiện*; câu hỏi kỹ thuật chuyển giai đoạn Tools; thứ tự công việc sau Requirements | `QĐ-59` |
| 1.22 | 08/10/2026 | Thuế đã kiểm chứng trên văn bản gốc: ngân sách so trên **chi phí thực chịu**; ma trận dữ liệu cá nhân và mẫu văn bản minh bạch đã soạn; báo cáo lệch bản đăng ký cho GVHD | `QĐ-60` |
| 1.23 | 09/10/2026 | **Ứng dụng mobile native** (bốn tác vụ) và hai tính năng AI là phạm vi cam kết; phần mềm nội bộ: usage, `G2`–`G4`, tiết kiệm ngoài MVP; nguồn Zylo ghi rõ thông cáo và định nghĩa chỉ số; link ma trận nhà cung cấp; mã dự án/nhóm. *Bổ sung 10/10/2026:* mobile — Người duyệt chi duyệt cả bước nhu cầu của yêu cầu do trưởng phòng tự gửi | `QĐ-61`, `QĐ-62` |
| **1.24** | **12/10/2026** | Đồng bộ bảng tài liệu liên quan (Phần VII) theo phiên bản thực tế: BRD v3.35, `QĐ-01` → `QĐ-66`, User Stories v0.15, Conceptual ERD v5.1, bộ sơ đồ. **Nội dung WHY/WHAT/WHO không đổi** | `QĐ-63` → `QĐ-66` |

---

## PHẦN I — WHY: Vì sao dự án này cần thiết

### 1.1. Phát biểu vấn đề

> **Problem Statement**
>
> Doanh nghiệp vừa ngày càng phụ thuộc vào phần mềm thuê bao, nhưng thông tin về **hợp đồng, quyền truy cập, mức độ sử dụng và chi phí** lại nằm phân tán ở nhiều bộ phận và nhiều nguồn dữ liệu khác nhau, không nơi nào giữ bức tranh đầy đủ.
>
> Hệ quả là doanh nghiệp không phát hiện được license đang trả tiền mà không ai dùng, bỏ lỡ thời điểm duy nhất có thể tối ưu hợp đồng, không quy được chi phí về đúng đơn vị chịu trách nhiệm, và không kiểm soát được phần mềm được mua ngoài quy trình.

### 1.2. Vấn đề hình thành như thế nào

Vấn đề đi qua năm bước. Đây là mạch nên dùng khi trình bày.

```mermaid
flowchart LR
    A["Số lượng phần mềm<br/>thuê bao tăng nhanh"] --> B["Dữ liệu bị phân mảnh<br/>theo bộ phận và nguồn"]
    B --> C["Không ai có<br/>bức tranh đầy đủ"]
    C --> D["Quyết định chậm<br/>hoặc sai thời điểm"]
    D --> E["Lãng phí chi phí<br/>+ rủi ro quản trị"]

    style A fill:#e8f0fe,stroke:#4285f4
    style C fill:#fef7e0,stroke:#fbbc04
    style E fill:#fce8e6,stroke:#ea4335
```

| Bước | Biểu hiện cụ thể trong doanh nghiệp |
| ---- | ----------------------------------- |
| Phần mềm thuê bao tăng | Rào cản mua thấp; một trưởng nhóm có thể đưa cả team lên công cụ mới trong mười phút |
| Dữ liệu phân mảnh | Thuê bao ở phòng ban, hợp đồng trong hộp thư người ký, hóa đơn ở kế toán, người dùng thật thì không ở đâu cả |
| Không có bức tranh đầy đủ | Không trả lời được bốn câu hỏi: mua gì, ai được cấp, có dùng không, tiền của ai |
| Quyết định chậm hoặc sai | Gia hạn khi chưa rà soát; cấp quyền trùng lặp; phát hiện lãng phí sau khi đã trả tiền |
| Lãng phí và rủi ro | Tiền trả cho suất không ai dùng; người đã nghỉ còn quyền truy cập; dữ liệu nằm ở dịch vụ chưa ai đánh giá |

### 1.3. Số liệu tham khảo

Các số liệu dưới đây được tra lại tại nguồn gốc, **ngày truy cập 29/08/2026**. Chúng dùng để cho thấy **cơ chế và xu hướng** của bài toán, không dùng để suy ra con số cho một doanh nghiệp Việt Nam cụ thể — xem lưu ý ở cuối mục.

| Liên quan tới | Số liệu | Nguồn | Nói lên điều gì |
| ------------- | ------- | ----- | --------------- |
| **Gốc của mọi vấn đề** | **81%** chi tiêu SaaS do các bộ phận nghiệp vụ kiểm soát; bộ phận CNTT chỉ trực tiếp quản lý **15%** | Zylo 2026 | Đây chính là phát biểu vấn đề ở mục 1.1, diễn đạt bằng số |
| Quy mô bài toán | Trung bình **106** ứng dụng SaaS mỗi tổ chức; dự báo **118** cho năm 2026 | BetterCloud 2025, 2026 | Vượt xa ngưỡng quản lý được bằng bảng tính |
| **PP-1** Ghost seat | **36%** license SaaS không được sử dụng | Zylo 2026 | Là **tỷ lệ** nên minh họa quy mô vấn đề tốt hơn con số tuyệt đối — nhưng vẫn là benchmark quốc tế |
| **PP-1** Ghost seat | Lãng phí trung bình **21 triệu USD/năm**, tăng **14,2%** | Zylo 2025 | Quy mô tuyệt đối, chỉ đúng với tổ chức lớn |
| **PP-2** Auto-renewal | **40%** theo dõi ngày gia hạn thủ công · **34%** chỉ dựa vào cảnh báo tự động · **25%** không làm gì và để tự gia hạn | BetterCloud 2025 | Một phần tư tổ chức **hoàn toàn không kiểm soát** việc gia hạn |
| **PP-3** Bất đối xứng | **78%** lãnh đạo CNTT gặp khoản phí ngoài dự kiến từ mô hình tính theo mức dùng hoặc AI; **61%** phải cắt dự án vì chi phí phát sinh (khảo sát 218 lãnh đạo CNTT) | Zylo 2026 | Hệ quả tài chính có thật, không phải rủi ro lý thuyết |
| **PP-4** Shadow IT | Chi tiêu SaaS qua báo cáo chi phí của nhân viên (*expense-based*) tăng **267%** theo năm | Zylo 2026 | Shadow IT đang **tăng**, không giảm |
| **PP-4** Shadow IT | Gần **60%** nhân sự CNTT vẫn lo ngại về Shadow IT ở mức độ nào đó | BetterCloud 2025 | Vấn đề được thừa nhận rộng rãi nhưng chưa giải quyết được |
| **PP-4** Rủi ro AI | **22%** bộ công cụ hiện là ứng dụng có AI; **67%** coi mất dữ liệu hoặc tác nhân AI mất kiểm soát là rủi ro lớn hơn việc chậm áp dụng AI | BetterCloud 2026 | Công cụ AI làm bài toán kiểm soát cấp thiết hơn |
| **PP-5** Quy trình chậm | Tỷ lệ **1 nhân sự CNTT trên 108 nhân viên** | BetterCloud 2025 | Áp lực vận hành thật, giải thích vì sao quy trình thủ công không mở rộng được |

**Ba con số nên dùng khi trình bày:**

**81% / 15%** — chi tiêu SaaS chủ yếu nằm ngoài tầm quản lý trực tiếp của bộ phận CNTT. Con số này nói đúng cơ chế gây ra cả năm pain point: **quyền mua và quyền quản lý không nằm cùng một chỗ**.

**36% license không được sử dụng** — đây là tỷ lệ nên phù hợp hơn con số tuyệt đối 21 triệu USD khi minh họa quy mô vấn đề. Tuy nhiên, đây **vẫn là benchmark quốc tế** và **không được suy trực tiếp thành tỷ lệ của doanh nghiệp vừa tại Việt Nam**. Nói đúng vế thứ hai này ngay khi đưa con số ra — nó trả lời trước câu *"tại sao số liệu doanh nghiệp lớn lại áp cho doanh nghiệp Việt Nam?"*

**267% tăng trưởng chi tiêu SaaS qua báo cáo chi phí (*expense-based*)** — trả lời trực tiếp câu hỏi *"Shadow IT có còn là vấn đề không hay đã được giải quyết rồi?"*

> **Lưu ý khi trích dẫn — nên chủ động nói ra trước khi bị hỏi.** Toàn bộ số liệu trên là benchmark quốc tế từ dữ liệu và khảo sát của **các nhà cung cấp giải pháp quản trị SaaS**, chủ yếu phản ánh tổ chức lớn ở thị trường Âu Mỹ. Chúng cho thấy bài toán **có thật và đang lớn dần**, nhưng **không** nói được mức chi tiêu hay tỷ lệ lãng phí của bất kỳ doanh nghiệp Việt Nam nào. Dự án không cam kết một tỷ lệ tiết kiệm cố định khi chưa có dữ liệu thực tế của khách hàng.
>
> Một lưu ý kỹ thuật khi trích dẫn: Zylo 2025 công bố chi tiêu **trung bình** 4.830 USD/nhân viên, còn Zylo 2026 công bố **trung vị** 9.455 USD/nhân viên. Hai chỉ số khác nhau về bản chất, **không được so sánh trực tiếp** để suy ra mức tăng trưởng.

### 1.4. Ba mức nhìn vấn đề

Câu trả lời cần đứng được ở cả ba mức. Chỉ có mức 1 thì thành một bài tổng hợp thị trường; chỉ có mức 2 thì thành một công cụ nội bộ không có tính khái quát.

**Mức 1 — Cách doanh nghiệp mua phần mềm đã thay đổi, cách quản lý thì chưa.**

Mười năm trước, mua phần mềm là một quyết định lớn: có hợp đồng, có bên mua sắm, có triển khai. Mô hình thuê bao xóa bỏ toàn bộ ma sát đó. Tốc độ này là ưu điểm thật, nhưng nó khiến quyền sở hữu thông tin bị phân mảnh.

Ở Việt Nam, Quyết định 1121/QĐ-TTg phê duyệt Chương trình hành động quốc gia về chuyển đổi sang nền tảng điện toán đám mây giai đoạn 2025–2030 cho thấy xu hướng này còn tiếp tục tăng.

**Mức 2 — Năm nỗi đau quan sát được, và chúng khác nhau về bản chất.**

Điểm cần nhấn: năm pain point trong BRD mục 2.2 **không cùng một loại vấn đề**, nên không thể xử lý bằng một tính năng duy nhất.

| Pain point | Bản chất vấn đề | Loại giải pháp cần |
| ---------- | --------------- | ------------------ |
| PP-1 Ghost seat | Vấn đề **dữ liệu** — không ai biết ai đang dùng gì | Thu thập và đối chiếu bằng chứng |
| PP-2 Auto-renewal | Vấn đề **thời điểm** — biết, nhưng biết quá muộn | Cảnh báo tính từ đúng mốc |
| PP-3 Bất đối xứng thông tin | Vấn đề **ngôn ngữ chung** — Tài chính và CNTT nói hai thứ tiếng | Mô hình dữ liệu chung có đơn vị chịu chi phí |
| PP-4 Shadow IT | Vấn đề **tầm nhìn** — có thứ tồn tại ngoài hệ thống | Đối chiếu nhiều nguồn bằng chứng |
| PP-5 Quy trình chậm | Vấn đề **quy trình** — đường chính thức chậm hơn đường tắt | Rút ngắn và đo được thời gian |

> **Một điểm cần nói rõ khi bảo vệ:** trong phạm vi bài toán mà SaaS-Sentry tập trung xử lý, **PP-5 là một nguyên nhân quan trọng làm phát sinh PP-4**. Nhân viên không đi đường vòng vì muốn phá luật; họ đi vòng vì đường chính thức mất ba ngày còn đăng ký bằng thẻ cá nhân mất ba phút. Vì vậy phân hệ phê duyệt xử lý **một nguyên nhân gốc**, còn phân hệ phát hiện xử lý **phần biểu hiện đã phát sinh** — hai phân hệ bổ trợ nhau chứ không thay thế nhau.
>
> Nói *"một nguyên nhân quan trọng"* chứ không nói *"nguyên nhân"*, vì Shadow IT còn đến từ những chỗ khác mà hệ thống không xử lý được: nhân viên không biết đã có công cụ tương đương trong danh mục, thói quen mua bằng thẻ cá nhân, nhu cầu thử nhanh một công cụ mới, hoặc doanh nghiệp chưa có chính sách nào về việc này.

**Mức 3 — Vì sao cách làm hiện tại không đủ.**

Phần lớn doanh nghiệp vừa ở Việt Nam quản lý việc này bằng một bảng tính và một hộp thư. Cách đó thất bại ở bốn điểm, và mỗi điểm là một yêu cầu của hệ thống:

| Bảng tính + hộp thư không làm được | Hệ thống phải làm được |
| ---------------------------------- | ---------------------- |
| Không biết ai *thực sự* dùng — chỉ biết ai *được cấp* | Đối chiếu danh sách cấp phát với dữ liệu hoạt động |
| Không tự nhắc, và nhắc sai mốc | Cảnh báo tính từ hạn chót báo hủy |
| Không có dấu vết ai quyết định gì, khi nào | Nhật ký kiểm toán chỉ ghi thêm |
| Không phát hiện được thứ nằm ngoài chính nó | Đối chiếu nhiều nguồn bằng chứng độc lập |

**Vì sao doanh nghiệp không tự phát hiện được lãng phí, dù rất muốn:** bốn mảnh dữ liệu cần thiết nằm ở bốn nơi khác nhau, thuộc bốn người khác nhau.

| Mảnh dữ liệu | Nằm ở đâu | Ai giữ |
| ------------ | --------- | ------ |
| Số suất **đã mua** | Hợp đồng hoặc hóa đơn | Tài chính, hoặc người ký hợp đồng |
| Số suất **đã cấp** | Trang quản trị của từng nhà cung cấp | Bộ phận CNTT, hoặc người tạo tài khoản |
| **Mức độ sử dụng thật** | Bản xuất dữ liệu hoạt động hoặc API của nhà cung cấp | Không ai chủ động lấy về |
| **Còn cần hay không** | Trong đầu trưởng phòng | Quản lý của người dùng |

Ghép được bốn mảnh này là toàn bộ công việc của phân hệ phát hiện lãng phí. Thiếu một mảnh thì kết luận cuối cùng hoặc sai, hoặc không đưa ra được — và đó là lý do hệ thống có tầng ánh xạ danh tính, cửa sổ dữ liệu bao phủ và vòng xác nhận của trưởng phòng.

### 1.5. Hai câu hỏi thường gặp

**"Đã có Zylo, Torii, Productiv, Microsoft Entra rồi, làm lại để làm gì?"**

Các nền tảng thương mại đó được xây cho doanh nghiệp lớn quốc tế và **giả định** khách hàng đã có sẵn ba thứ: một hệ thống định danh tập trung, quyền truy cập API ở gói cao của từng nhà cung cấp, và một đội CNTT đủ lớn để vận hành. Doanh nghiệp công nghệ vừa ở Việt Nam thường không có đủ cả ba.

Vì vậy đề tài đặt ranh giới ở chỗ khác: **ranh giới giữa hệ thống và thế giới bên ngoài là định dạng dữ liệu, không phải nhà cung cấp**.

[Ma trận tra cứu nhà cung cấp](../Research-AI/tool-vendor-usage-research-backlog.md#631-ma-trận-khả-năng-truy-xuất-dữ-liệu-usage-theo-nhà-cung-cấp) (BRD 6.3.1 cũ, chuyển theo `QĐ-59a`) củng cố lập luận này bằng số liệu thật: trong **mười một** nhà cung cấp được tra (14/09/2026), chỉ **GitHub** cho đọc được bằng chứng sử dụng thật ở gói miễn phí — qua **lịch sử commit** của repo thuộc org, không phải audit log vốn chỉ ghi hành động quản trị (`QĐ-28a`); **Figma, Notion, ChatGPT** chỉ có dữ liệu hoạt động theo người ở gói **Enterprise**; Microsoft cần **Entra ID P1/P2** cho ngày đăng nhập cuối. Một hệ thống dựa hoàn toàn vào API sẽ không thấy được phần lớn danh mục của một doanh nghiệp vừa. *(Phương pháp thu thập usage đang được nghiên cứu lại theo góp ý của GVHD — sổ 6.9 dòng 13.)*

Đó cũng là lý do đề tài thêm **bộ thu thập trên thiết bị công ty** (`QĐ-20`): một tiện ích trình duyệt, cài trên máy công ty cấp, chỉ gửi **tên miền nằm trong danh sách cho phép** cùng số phút dùng mỗi ngày, và chỉ sau khi nhân viên xác nhận. Nhân viên ký văn bản **xác nhận đã biết rõ** chính sách theo dõi khi nhận máy công ty; dịch vụ của công ty chỉ dùng trên máy công ty; máy cá nhân không đăng ký và không bị thu dữ liệu (BRD `FR-4.21`). Danh sách cho phép dựng từ **Catalog của tổ chức cộng từ điển nhà cung cấp** (`VendorDictionary`), **không** phải chỉ các SaaS công ty đang trả tiền: nếu chỉ quan sát thứ đã trả tiền thì tiện ích **không bao giờ** nhìn thấy SaaS miễn phí hoặc chưa có trong danh mục (`SA-07`). **Trạng thái thanh toán và trạng thái có trong danh mục là hai thuộc tính của kết quả, không phải điều kiện để quan sát.** Ranh giới vẫn giữ nguyên: danh sách cho phép là hữu hạn và khai báo được, **không** thu nhật ký truy cập web tùy ý; mọi tên miền ngoài danh sách bị lọc **ngay trên máy** và máy chủ không bao giờ nhận (`ADR-13`). Nó trả lời đúng câu GVHD hỏi — *"nhân viên mua rồi có dùng không"* — mà không cần doanh nghiệp mua gói cao nhất của từng nhà cung cấp. Tại doanh nghiệp, tiện ích được cài bắt buộc qua chính sách trình duyệt được quản lý — đó là **thiết kế triển khai**. Trong demo đồ án, tiện ích chạy bằng **load unpacked** trên máy nhóm; không trình bày là đã force-install (`QĐ-28b`).

> **Ranh giới giữa bộ thu thập và SaaS miễn phí bên ngoài** (`QĐ-49a`, `QĐ-31a`). Phần mềm/SaaS **miễn phí bên ngoài không phải đối tượng quản lý**: không có mục trong danh mục, không có seat, không có chi phí, không là đối tượng của gia hạn hay tiết kiệm. Việc dùng bộ thu thập để phát hiện công cụ ngoài danh mục là **giai đoạn sau**; khi (và nếu) làm, một công cụ miễn phí mà bộ thu thập quan sát được chỉ là **thông tin** để IT Admin và trưởng phòng biết — **không** tự thành mục danh mục, seat hay khoản chi. Yêu cầu của nhân viên cho một công cụ miễn phí bên ngoài do IT Admin đóng với lý do ngoài phạm vi quản lý (`QĐ-49h`). Điều này **không** cấm dùng thư viện mã nguồn mở, API miễn phí hay gói Free/Trial để **kiểm thử/demo** của đồ án.

**"Sao không dùng học máy cho phần phát hiện lãng phí?"**

Bài toán có nhãn xác định (dùng hoặc không dùng), quyết định cuối vẫn do con người, không có tập dữ liệu huấn luyện có nhãn, và điều người dùng cần nhất là **hiểu được lý do để phản biện**.

> Lập luận này còn được củng cố bởi một phát hiện thực tế: Atlassian tính **xem một trang từ 2 giây** là "hoạt động". Với dữ liệu đầu vào có định nghĩa lỏng như vậy, một mô hình học máy sẽ học đúng cái nhiễu đó mà không ai phát hiện được. Hệ dựa trên luật buộc phải khai báo tường minh nguồn hiểu "hoạt động" là gì (BRD FR-4.16, và bất biến `INV-11`) — chính sự tường minh đó giữ được chất lượng kết luận.

### 1.6. Đo bằng gì

Năm chỉ số thành công KPI-1 → KPI-5 và bốn tiêu chí nghiệm thu TC-1 → TC-4 nằm ở **BRD mục 2.4**.

Điểm đáng nhấn khi trình bày: **KPI-5 đo tỷ lệ khuyến nghị bị bác bỏ** — tức là hệ thống tự đo mức độ mình sai. Và **TC-2 yêu cầu số báo động giả trên các hồ sơ đặt bẫy bằng 0**. Hai con số này thể hiện rằng nhóm hiểu mục tiêu không phải "tìm ra nhiều" mà là "tìm ra đúng".

### 1.7. Phiên bản rút gọn dùng khi thuyết trình

**Bản 30 giây:**

> Chi tiêu phần mềm thuê bao của doanh nghiệp phần lớn nằm ngoài tầm quản lý trực tiếp của bộ phận CNTT — dữ liệu về hợp đồng, quyền truy cập, mức sử dụng và chi phí bị chia nhỏ giữa nhiều bộ phận. Hệ quả là trả tiền cho license không ai dùng, bị gia hạn ngoài ý muốn, không quy được chi phí về đúng phòng ban, và không kiểm soát được phần mềm mua ngoài quy trình. SaaS-Sentry tập trung bốn nhóm dữ liệu đó về một chỗ và chuẩn hóa luồng yêu cầu — phê duyệt — cấp quyền, để doanh nghiệp ra quyết định đúng lúc và có bằng chứng.

**Bản 10 giây, khi bị hỏi "đề tài làm gì":**

> Một hệ thống giúp doanh nghiệp biết mình đang mua phần mềm gì, ai được cấp quyền, quyền đó có thực sự được dùng không, và chi phí thuộc về phòng ban nào.

---

## PHẦN II — WHAT: Dự án sẽ làm những gì

### 2.1. Phát biểu một câu

> SaaS-Sentry là **hệ thống quản trị nội bộ doanh nghiệp**, đóng vai trò nơi duy nhất trả lời được bốn câu hỏi: đang mua phần mềm gì, ai được cấp quyền, quyền đó có thực sự được dùng không, và chi phí thuộc về phòng ban nào.

*Về định vị "hệ thống" chứ không phải "nền tảng": xem BRD mục 1 và ADR-01.*

> **Đối tượng quản lý** (`QĐ-49a`): SaaS bên ngoài có trả phí; phần mềm thương mại có bản quyền (có thể là license vĩnh viễn — không mặc định là thuê bao); phần mềm/dịch vụ do công ty tự xây dựng. Phần mềm/SaaS **miễn phí bên ngoài** không phải đối tượng quản lý — nhưng **không** có nghĩa cấm dùng thư viện mã nguồn mở, API miễn phí hay gói Free/Trial để kiểm thử/demo. Chi tiết: BRD mục 3.1, 3.3.

### 2.2. Đầu vào → Xử lý → Đầu ra

Mô hình này để người chưa đọc BRD nắm nhanh kiến trúc nghiệp vụ.

```mermaid
flowchart LR
    subgraph IN["ĐẦU VÀO"]
        I1["Phòng ban, chức vụ<br/>và nhân sự"]
        I2["Danh mục, hợp đồng,<br/>thuê bao"]
        I3["Hiện trạng<br/>ai giữ suất nào"]
        I4["Bản xuất dữ liệu<br/>sử dụng"]
        I5["Sao kê,<br/>hóa đơn"]
    end
    subgraph PROC["SaaS-Sentry XỬ LÝ"]
        P1["Chuẩn hóa và<br/>ánh xạ danh tính"]
        P2["Theo dõi vòng đời<br/>quyền truy cập"]
        P3["Điều phối yêu cầu<br/>và phê duyệt"]
        P4["Phát hiện dựa trên luật,<br/>qua 8 cổng lọc"]
        P5["Phân bổ chi phí<br/>và quy đổi tiền tệ"]
        P6["Chấm bằng chứng<br/>và mức tin cậy"]
    end
    subgraph OUT["ĐẦU RA"]
        O1["Danh mục<br/>tập trung"]
        O2["Cảnh báo trước<br/>hạn báo hủy"]
        O3["Khuyến nghị thu hồi<br/>kèm bằng chứng"]
        O4["Bản ghi phần mềm<br/>ngoài danh mục"]
        O5["Bảng chi tiêu<br/>theo phòng ban"]
        O6["Nhật ký<br/>kiểm toán"]
    end

    IN --> PROC --> OUT

    style IN fill:#e8f0fe,stroke:#4285f4
    style PROC fill:#fef7e0,stroke:#fbbc04
    style OUT fill:#e6f4ea,stroke:#34a853
```

**Điều kiện của từng đầu vào:**

| Đầu vào | Bắt buộc | Nguồn | Không có thì mất gì |
| ------- | -------- | ----- | ------------------- |
| Nhân sự và cơ cấu tổ chức — **phòng ban, trưởng phòng, chức vụ** (`QĐ-52`) | ✅ Bắt buộc | File xuất từ hệ thống nhân sự | **Toàn bộ luồng phê duyệt không chạy được** |
| Danh mục, hợp đồng, thuê bao | ✅ Bắt buộc | Nhập tay hoặc file | Mất cảnh báo gia hạn và mọi con số chi phí |
| Hiện trạng ai giữ suất nào | ✅ Bắt buộc | File hoặc nhập tay | Mất toàn bộ phân hệ phát hiện lãng phí |
| Bản xuất dữ liệu sử dụng | ⚪ Tùy chọn | File hoặc kết nối tự động | Chỉ mất G3 và G4; **G1 và G2 vẫn chạy** |
| **Dữ liệu từ bộ thu thập trên thiết bị** | ⚪ Tùy chọn | Bộ thu thập trên máy công ty, sau khi nhân viên xác nhận — loại cụ thể chốt ở giai đoạn Tools (`QĐ-59a`) | Ứng dụng không có bản xuất hoạt động ở gói đang dùng chỉ còn G1, G2 |
| Sao kê, hóa đơn (kèm dòng thuế theo chứng từ) | ⚪ Tùy chọn | File từ kế toán | Mất phân hệ phát hiện ngoài danh mục |

> **Điểm đáng chú ý ở mô hình này:** hệ thống tạo được giá trị **chỉ với ba đầu vào bắt buộc**, tất cả đều là dữ liệu nội bộ doanh nghiệp đã có sẵn. Nó biết ngay bao nhiêu suất đã mua chưa gán và bao nhiêu suất còn nằm trong tay người đã nghỉ. Hai đầu vào tùy chọn mở khóa thêm năng lực, nhưng **không phải điều kiện để hệ thống có ích** — và đó là lý do đề tài khả thi trong bối cảnh phần lớn nhà cung cấp không cho truy xuất dữ liệu ở gói doanh nghiệp vừa mua được.

### 2.3. Sáu nhóm năng lực

| # | Năng lực | Trả lời câu hỏi | Xử lý |
| - | -------- | --------------- | ----- |
| **NL-1** | Nắm giữ danh mục và hợp đồng | Đang mua gì, của ai, điều kiện nào, tới khi nào | PP-2, PP-3 |
| **NL-2** | Theo dõi ai được cấp quyền gì | Ai đang giữ suất nào, từ bao giờ, do quyết định nào | PP-1, PP-3 |
| **NL-3** | Điều phối yêu cầu và phê duyệt có kiểm soát | Ai được duyệt, trong bao lâu, vì lý do gì | PP-5 |
| **NL-4** | Đối chiếu quyền được cấp với việc dùng thật | Quyền đó có được dùng không, và chắc chắn tới mức nào | PP-1 |
| **NL-5** | Làm minh bạch chi phí theo phòng ban | Tiền này của ai, phục vụ việc gì | PP-3 |
| **NL-6** | Phát hiện phần mềm ngoài danh mục | Có thứ gì đang tồn tại mà bộ phận CNTT chưa biết không | PP-4 |

### 2.4. Bốn điểm khác biệt

Nếu chỉ mô tả sáu năng lực trên, đề tài trông giống một hệ thống quản lý danh mục thông thường. Bốn điểm dưới đây là phần khác biệt của đề tài.

**KB-1 — Mọi kết luận đều kèm bằng chứng và mức độ chắc chắn.**
Hệ thống không bao giờ nói "suất này lãng phí". Nó nói: *"Không hoạt động 87 ngày. Nguồn: bản xuất hoạt động Figma nhập ngày 05/08, bao phủ 120 ngày. Khớp danh tính bằng email chính xác. Nguồn này hiểu hoạt động là có sự kiện chỉnh sửa."* Người quản lý phải phản biện được, không phải tin.

**KB-2 — Xử lý nguyên nhân, không chỉ triệu chứng.**
Phân hệ phê duyệt tồn tại để làm đường chính thức nhanh hơn đường tắt. Hệ thống đo và hiển thị thời gian xử lý từng bước, biến thời hạn xử lý từ con số nội bộ thành một lời hứa nhìn thấy được.

**KB-3 — Trung thực về con số tiết kiệm.**
Với hợp đồng cam kết theo năm, thu hồi suất giữa kỳ **không tiết kiệm được đồng nào**; tiền chỉ thật khi giảm số lượng tại ngày gia hạn. Hệ thống tách hai con số và **không bao giờ cộng chúng lại**.

**KB-4 — Không tạo ra dữ liệu mà mình không cần.**
Hệ thống chủ động **không thu thập** dữ liệu hoạt động của nhóm ứng dụng nhắn tin và họp trực tuyến, vì nhóm đó nằm ở vùng xám pháp lý mà nhóm chưa đủ căn cứ xử lý (BRD `ADR-10`). Cách rẻ nhất để loại một rủi ro là không tạo ra dữ liệu gây rủi ro. Nguyên tắc này áp luôn cho **bộ thu thập trên thiết bị**: tiện ích **lọc ngay trên máy** — chỉ tên miền trong danh sách cho phép, bỏ mọi ứng dụng liên lạc, không gửi URL, tiêu đề, nội dung hay địa chỉ IP — nên **máy chủ không bao giờ nhận** phần dữ liệu vượt mục đích (BRD `ADR-13`).

### 2.5. Hệ thống KHÔNG làm gì

Danh sách đầy đủ tại BRD mục 3.2 và 5.6.1. Các điều đáng nhắc lại khi trình bày:

- Không tự chặn ứng dụng, không tự phê duyệt chi phí, và **không tự quyết định** cấp hay thu hồi quyền
- Không thay thế bộ phận mua sắm — hệ thống ghi nhận quyết định mua, không đàm phán hay thanh toán
- Không cam kết phát hiện 100% Shadow IT — có kịch bản mù hoàn toàn
- Không xử lý nhật ký truy cập web, proxy, CASB **đầy đủ** — nằm ngoài phạm vi vì lý do pháp lý và hạ tầng. Tiện ích trình duyệt lọc theo danh sách cho phép **không** thuộc dòng này
- Không quản lý phần mềm/SaaS **miễn phí bên ngoài** (`QĐ-49a`; không cấm dùng chúng để kiểm thử/demo)
- Với **phần mềm/dịch vụ nội bộ** chỉ quản lý danh mục, Business Owner, quyền sử dụng và chi phí đã ghi nhận — **không** có API cấp/thu hồi riêng, **không** quản trị vận hành máy chủ (`QĐ-49b`); nguồn usage, `G2`–`G4` và tiết kiệm cho phần mềm nội bộ **ngoài MVP** (`QĐ-62o`)
- AI **chỉ hỗ trợ** — phạm vi cam kết là đúng hai tính năng của `QĐ-49e` (`QĐ-61e`), mọi con số do backend tính, không duyệt, không cấp/thu hồi, không kết luận vi phạm; quy trình chạy đủ khi AI tắt
- **Ứng dụng mobile native** chỉ cho bốn tác vụ — yêu cầu của tôi, trưởng phòng duyệt nhu cầu, Người duyệt chi duyệt chi (kể cả bước nhu cầu của yêu cầu do trưởng phòng tự gửi — `QĐ-61h`), hộp thông báo; **không** push, **không** offline, **không** chức năng quản trị (`QĐ-61`). Ứng dụng mobile **không** theo dõi usage trên điện thoại
- Không **tính hay kê khai thuế** — chỉ ghi nhận dòng thuế theo chứng từ và hiển thị thuế ước tính (`QĐ-55a`)
- Không hỗ trợ tổ chức **duyệt nhiều cấp** (phòng ban là một cấp phẳng) và không quản lý **dự án** như đối tượng có thành viên hay bước duyệt (`QĐ-52`)
- Không cấp quyền trả phí vào **tài khoản cá nhân**, không lưu mật khẩu tài khoản dùng chung (`QĐ-54`)
- Không đặt **hạn mức/quota theo phòng ban** (`QĐ-57c`)
- Không lưu địa chỉ IP, không theo dõi máy cá nhân, và **không chặn kỹ thuật** việc dùng dịch vụ của công ty trên máy cá nhân — chính sách thiết bị (`FR-4.21`) là quy định nội bộ: nhân viên ký *xác nhận đã biết rõ* khi nhận máy, vi phạm do doanh nghiệp xử lý ngoài phạm vi hệ thống (`QĐ-57b`, `QĐ-58f`)
- Không dùng chữ ký số — "ký duyệt" là bản ghi phê duyệt điện tử kèm nhật ký kiểm toán (`QĐ-53a`)

> **Phân biệt hai thứ hay bị gộp làm một: tự quyết định và tự thực thi.** Hệ thống **không tự quyết định** "người này nên được cấp" hay "suất này nên bị thu hồi" — quyết định luôn thuộc về trưởng phòng, Người duyệt chi hoặc IT Admin theo ba loại quyết định ở mục 3.2, và `SoD-6` của BRD cấm Automation Service tự cấp hoặc tự thu hồi seat. Nhưng **sau khi đã có một quyết định nghiệp vụ hợp lệ**, bước thực thi hoàn toàn có thể tự động hóa qua cổng cấp phát và `CN-2` SCIM 2.0, ở những nhà cung cấp có hỗ trợ.
>
> Đây chính là `ADR-07` của BRD — *Assignment* ghi nhận ý định của tổ chức, *ProvisioningTask* ghi nhận thao tác thật phía nhà cung cấp, hai thực thể có vòng đời riêng (BRD mục 5.12.3). Phát biểu chính xác của BRD mục 3.2 là **"không tự động chặn ứng dụng hoặc thu hồi quyền chỉ dựa trên cảnh báo"** — vế *chỉ dựa trên cảnh báo* là phần quan trọng nhất và không được lược đi khi tóm tắt.

---

## PHẦN III — WHO: Ai tham gia và ai sử dụng

*Hồ sơ tổ chức mục tiêu — quy mô nhân sự, số ứng dụng, cơ cấu — nằm ở **BRD mục 3.4**. Bảng vai trò chi tiết ở **BRD mục 4.1**; ma trận trách nhiệm theo loại yêu cầu ở **BRD mục 4.6**.*

### 3.1. Phân loại nhóm người liên quan

Câu hỏi *"ai thực sự là người dùng chính của hệ thống?"* cần trả lời bằng một phân loại, không phải bằng câu "có sáu vai trò".

| Nhóm | Ai | Có tài khoản đăng nhập | Giá trị nhận được |
| ---- | -- | ---------------------- | ----------------- |
| **Người dùng chính** | IT Admin (nhiều người, mỗi người phụ trách một số phòng), Finance (một người) | ✅ | Vận hành và quản trị toàn bộ danh mục, hợp đồng và chi phí hằng ngày |
| **Người dùng không thường xuyên** | Manager (= trưởng phòng, `QĐ-52a`), Employee | ✅ | Gửi yêu cầu, phê duyệt, xác nhận khuyến nghị |
| **Người quyết định chi** | Người duyệt chi — mặc định CEO | ✅ | Quyết định cuối cho khoản chi mới và cho việc đưa phần mềm bên ngoài có trả phí/có bản quyền vào danh mục (phần mềm nội bộ do IT đăng ký cùng Business Owner — `QĐ-50a`); duyệt bước nhu cầu khi trưởng phòng tự gửi yêu cầu (`QĐ-52c`); xem tổng chi và tiết kiệm |
| **Người quản trị hệ thống** | Super Admin | ✅ | Quản lý tài khoản, vai trò, cấu hình, giám sát nhật ký |
| **Tác nhân tự động** | Automation Service | ❌ | Chạy rule theo lịch, sinh cảnh báo và khuyến nghị |
| **Người hưởng lợi gián tiếp** | Ban giám đốc, trừ người giữ vai Người duyệt chi | ❌ | Báo cáo chi tiêu và tiết kiệm |
| **Bên bảo đảm** | Kiểm toán, bộ phận bảo mật | ❌ | Nhật ký kiểm toán, bằng chứng rà soát quyền, cảnh báo người đã nghỉ còn tài khoản |

> **Ghi chú về cách phân loại.** Nhiều khung phân tích đặt "người ra quyết định" thành một nhóm riêng và gán cho Ban giám đốc. Với hệ thống này, quyền quyết định nằm ở các nhóm có tài khoản đăng nhập và được phân tách theo **loại quyết định** — trình bày tại mục 3.2. Trong doanh nghiệp thật, người có thẩm quyền chi — thường là CEO hoặc CTO — mới là người duyệt cuối khoản chi, không phải kế toán; vì vậy **một** người trong Ban giám đốc giữ vai **Người duyệt chi** và có tài khoản (`QĐ-22`). Phần còn lại của Ban giám đốc hưởng lợi gián tiếp.

### 3.2. Ba loại quyết định, ba người khác nhau

Đây là cách trả lời câu hỏi "ai là người ra quyết định", và nó khớp với nguyên tắc phân tách trách nhiệm.

| Loại quyết định | Ai quyết | Quyết cái gì |
| --------------- | -------- | ------------ |
| **Quyết định nhu cầu** | Manager — **trưởng phòng** (trưởng phòng tự gửi yêu cầu thì Người duyệt chi quyết nhu cầu — `QĐ-52c`) | Nhân viên này có thực sự cần công cụ này không; suất không dùng có nên thu hồi không |
| **Quyết định chi phí** | **Người duyệt chi** | Có duyệt khoản chi này không; có đưa phần mềm bên ngoài có trả phí/có bản quyền vào danh mục không (phần mềm nội bộ: IT đăng ký — `QĐ-50a`); gia hạn, giảm số lượng hay hủy |
| *Kiểm soát ngân sách — không phải quyết định* | Finance | Trả lời khi Người duyệt chi hỏi *còn trong hạn mức không*; ghi nhận ngân sách và khoản cam kết **sau khi** chi được duyệt — **không** nằm trên đường duyệt (`QĐ-29b`) |
| **Quyết định kỹ thuật** | IT Admin | Cấp từ thuê bao nào, theo kiểu cấp nào; xử lý sai lệch và lỗi cấp phát ra sao; phần mềm mới có **kiểm soát được** không — không kiểm soát được thì từ chối ngay, không tới Người duyệt chi (`QĐ-53c`). Đây là cổng kỹ thuật, **không** phải quyết định chi |

> **Người quyết định nhu cầu, người quyết định chi và người thực hiện kỹ thuật là ba vai khác nhau; Tài chính kiểm soát ngân sách nhưng không quyết chi. Và không ai được duyệt yêu cầu của chính mình.**
>
> Tám nguyên tắc SoD-1 → SoD-8 tại BRD mục 4.2 đều suy ra từ câu này; bất biến `INV-08` là cách nó được ràng buộc ở tầng hệ thống. Một ngoại lệ có chủ đích — khi người duyệt nhu cầu chính là Người duyệt chi, hệ thống vẫn giữ hai bước riêng và gắn cờ, xem BRD mục 4.2.
>
> Ma trận đầy đủ *ai tạo · ai kiểm tra · ai duyệt nhu cầu · ai duyệt chi · ai thực hiện · hồ sơ nào* cho từng loại yêu cầu nằm ở **BRD mục 4.6**; danh mục biểu mẫu ở **BRD mục 5.13**. "Ký duyệt" là bản ghi phê duyệt điện tử kèm nhật ký kiểm toán chỉ ghi thêm (`QĐ-53a`).

### 3.3. Sáu vai trò nhìn theo nhịp sử dụng

| Vai trò | Mối quan tâm chính | Tần suất | Hệ quả thiết kế |
| ------- | ------------------ | -------- | --------------- |
| **IT Admin** | Không sót việc, không cấp nhầm, không mất dấu vết | Hằng ngày | Ưu tiên tốc độ thao tác, chấp nhận giao diện dày; hàng đợi theo các phòng được giao — cấp phát, thu hồi, dữ liệu phòng; IT Admin khác xử lý thay được, có nhật ký kiểm toán (`QĐ-58b`) |
| **Manager** (trưởng phòng) | Nhân viên trong phòng có đủ công cụ, và không bị hỏi những câu vô nghĩa | Vài lần một tuần | Mỗi người làm trưởng tối đa một phòng (`QĐ-58a`). Mỗi lần hỏi phải kèm đủ bằng chứng để quyết ngay; bộ công cụ chuẩn của phòng giảm số câu phải hỏi — IT cấu hình theo đề xuất của trưởng phòng hoặc chủ động cập nhật (`QĐ-52e`, `QĐ-58c`) |
| **Finance** | Chi tiêu trong ngân sách, giải trình được từng khoản | Hằng tuần, cao điểm cuối tháng | Số liệu phải truy được về nguồn; trả lời yêu cầu thông tin và ghi nhận sau duyệt phải nhanh, nhưng **không** chặn đường duyệt |
| **Người duyệt chi** | Chi đúng chỗ, không để yêu cầu chờ mình quá lâu | Vài lần một tuần, theo số yêu cầu có chi phí | Mỗi yêu cầu phải hiện sẵn **snapshot ngân sách** theo chi phí thực chịu (giá + thuế không được khấu trừ) — ngân sách, thực chi, cam kết đang giữ, còn lại, phần đang chờ duyệt — cùng nhu cầu đã được trưởng phòng xác nhận; hỏi Finance chỉ khi cần — quyết trong một màn hình |
| **Employee** | Xin được công cụ cần dùng, nhanh | **Vài lần một năm** | Màn hình phải tự giải thích, không giả định người dùng nhớ gì; hiện bộ công cụ chuẩn trước khi xin |
| **Super Admin** | Hệ thống chạy đúng, phân quyền đúng, có dấu vết | Hằng tháng | Ưu tiên rõ ràng hơn tiện lợi |

> **Employee dùng hệ thống vài lần một năm — đây là một ràng buộc thiết kế, không phải chi tiết nhỏ.** Ngược lại, hàng đợi của IT Admin dùng hằng ngày nên có thể đánh đổi sự dễ hiểu lấy tốc độ thao tác.

---

## PHẦN IV — LIÊN KẾT WHY → WHAT → WHO

Bảng này trả lời câu hỏi: *mỗi năng lực tồn tại để giải quyết vấn đề gì, cho ai, và đo bằng gì.* Nó cũng cho thấy nhóm **xuất phát từ vấn đề rồi mới thiết kế tính năng**, không phải làm ngược lại.

| WHY — Vấn đề | WHAT — Năng lực xử lý | WHO — Hưởng lợi chính | Đo bằng |
| ------------ | --------------------- | --------------------- | ------- |
| **PP-1** Trả tiền cho suất không ai dùng | NL-2 theo dõi quyền + NL-4 đối chiếu sử dụng — từ nhà cung cấp **và từ bộ thu thập trên thiết bị** — khuyến nghị kèm bằng chứng và mức tin cậy; thu hồi kèm bàn giao dữ liệu | IT Admin, trưởng phòng, Finance | **KPI-3** tỷ lệ suất đang hoạt động trên tổng suất đã mua |
| **PP-2** Bị gia hạn ngoài ý muốn | NL-1 vòng đời hợp đồng, cảnh báo tính từ **hạn chót báo hủy** chứ không phải ngày gia hạn; rà soát điều khoản nhà cung cấp trước kỳ gia hạn | IT Admin, Finance | **KPI-4** số thuê bao gia hạn không có quyết định được ghi nhận |
| **PP-3** Tài chính và CNTT không nói cùng ngôn ngữ | NL-5 mô hình chi phí chung theo phòng ban và Cost Center, hai cơ sở ghi nhận, đối soát hóa đơn kèm dòng thuế, **snapshot ngân sách, ghi nhận của Finance và khoản cam kết** theo chi phí thực chịu | Finance, **Người duyệt chi**, IT Admin, Ban giám đốc | **KPI-1** tỷ lệ chi tiêu nằm trong danh mục đã duyệt |
| **PP-4** Phần mềm mua ngoài tầm kiểm soát | NL-6 đối chiếu bằng chứng tài chính với danh mục đã duyệt, phân tầng rủi ro; chỉ tài khoản công ty; cổng mức kiểm soát cho phần mềm mới | IT Admin, bộ phận bảo mật | **KPI-1** như trên |
| **PP-5** Quy trình chính thức quá chậm | NL-3 yêu cầu và phê duyệt có kiểm soát, thời hạn từng bước, cảnh báo nghẽn **không ủy quyền** (`QĐ-27`), đo thời gian toàn trình; yêu cầu **không phát sinh chi phí không đi qua Người duyệt chi** (`QĐ-29a`); Finance **không** nằm trên đường duyệt (`QĐ-29b`); bộ công cụ chuẩn theo phòng × chức vụ | Employee, trưởng phòng, IT Admin, Người duyệt chi | **KPI-2** thời gian trung bình từ gửi yêu cầu tới có tài khoản |

**Ba điều bảng này cho thấy:**

- Không có năng lực nào không gắn với một pain point — nghĩa là không có tính năng thừa.
- Không có pain point nào không có chỉ số đo — nghĩa là mọi lời hứa đều kiểm chứng được.
- **PP-1 và PP-5 có nhiều người hưởng lợi nhất**, và đó cũng là hai chuỗi demo được ưu tiên phát triển trước.

> **Phần WHY / WHAT / WHO là baseline phạm vi hiện tại.** Chuỗi lập luận **Vấn đề → Pain point → Năng lực → Người dùng → Chỉ số đo → Chuỗi demo** đã khép kín: mỗi mắt xích đều dẫn được sang mắt xích kế tiếp, và bảng trên là chỗ nối.
>
> Baseline nghĩa là: nhóm **không chủ động mở rộng** thêm pain point, vai trò, năng lực, chỉ số đo, chủ đề lý thuyết hay đối thủ so sánh **nếu không có bằng chứng mới hoặc góp ý mới** — như góp ý Review 1 của hội đồng đã dẫn tới `QĐ-52` → `QĐ-58`. Đây **không phải** tuyên bố "không được thay đổi".
>
> **Điều kiện thay đổi sau baseline:** mọi đề xuất thay đổi phải chỉ rõ tác động lan tới đâu theo đúng chuỗi **Pain point → Năng lực → Người dùng → Chỉ số đo → Chuỗi demo**, rồi cập nhật đồng thời mọi mắt xích bị ảnh hưởng. Nói ngắn: **muốn đổi thì phải truy được tác động**, không phải **không được đổi**.

---

## PHẦN V — Phạm vi các luồng nghiệp vụ, bản tóm tắt

*Bảng chốt phạm vi đầy đủ nằm ở tài liệu **User Flows nghiệp vụ**.*

### 5.1. Năm luồng giá trị

```mermaid
flowchart LR
    VS0["VS-0 · Nền móng<br/>Vòng đời nhân sự và phòng ban"]
    VS1["VS-1 · Cấp quyền có kiểm soát<br/>PP-5"]
    VS2["VS-2 · Thu hồi lãng phí có bằng chứng<br/>PP-1"]
    VS3["VS-3 · Kiểm soát hợp đồng<br/>PP-2"]
    VS4["VS-4 · Minh bạch chi tiêu<br/>PP-3, PP-4"]

    VS0 --> VS1
    VS0 --> VS2
    VS1 --> VS2
    VS2 --> VS3
    VS1 --> VS4
    VS3 --> VS4

    style VS0 fill:#e8f0fe,stroke:#4285f4
    style VS1 fill:#fce8e6,stroke:#ea4335
    style VS2 fill:#f3e8fd,stroke:#a142f4
    style VS3 fill:#e6f4ea,stroke:#34a853
    style VS4 fill:#fef7e0,stroke:#fbbc04
```

> **Liên kết VS-2 → VS-3 là chỗ cần chú ý.** Phát hiện lãng phí chỉ thành tiền thật tại ngày gia hạn. Một danh sách khuyến nghị tách rời khỏi lịch hợp đồng thì khó được hành động đúng lúc — đây là lý do nhiều nỗ lực tối ưu license không đi tới đâu.

### 5.2. Quy mô phạm vi

| Nhóm | Số luồng | Mã |
| ---- | -------- | -- |
| Hiện thực đầy đủ | **42** | — *(`F-48` ở **mức demo**)* |
| Chỉ đặc tả thiết kế, không code | **4** | `F-16`, `F-24`, `F-32`, `F-46` |
| Ngoài phạm vi | 2 | `F-25`, `F-33` |

> **`48` = `42 / 4 / 2`** (`QĐ-31a`, `QĐ-31b`): `F-32` *(export IdP)* và `F-46` *(bộ thu thập làm nguồn discovery)* ở **giai đoạn sau** — `MF-6` chỉ hiện thực nguồn CSV `F-31`; `F-48` agent hiện thực **mức demo** (phiên người dùng, không service/installer). Nguồn OTel client AI (`FR-4.20`) gắn vào `F-17`/`F-45`, **không** tạo mã luồng mới. Con số đếm trên bảng chốt phạm vi của **User Flows**. *User Flows chưa đồng bộ `QĐ-49` → `QĐ-58`; số đếm giữ nguyên cho tới khi đồng bộ.*

**Main flow trình bày** (`QĐ-49d`): bộ **năm** main flow — **`MF-2`** Yêu cầu, phê duyệt và cấp quyền → **`MF-7`** Điều chỉnh quyền khi nhân viên chuyển phòng → **`MF-5`** Nghỉ việc và thu hồi quyền → **`MF-8`** Kiểm soát và phân bổ chi phí phần mềm theo kỳ → **`MF-4`** Gia hạn, giảm số lượng hoặc hủy thuê bao. `MF-1` là chức năng nền/điều kiện đầu vào, không trình bày như main flow; `MF-3` vẫn trong phạm vi, giới thiệu ngắn và hình chi tiết ở phụ lục; `MF-6` là tính năng bổ sung *Đối soát chi phí phần mềm*, nối từ `MF-8`. Không có main flow rà soát/thanh lý dịch vụ nội bộ ở đợt này. Nội dung nghiệp vụ: BRD mục 5.10.

### 5.3. Bốn chuỗi demo bắt buộc chạy liền mạch

| # | Chuỗi | Thông điệp chứng minh |
| - | ----- | --------------------- |
| **D-1** | Xin công cụ có phát sinh chi phí | Quy trình chính thức nhanh và có kiểm soát. Chuỗi: trưởng phòng xác nhận nhu cầu → **Người duyệt chi** duyệt trên snapshot ngân sách theo chi phí thực chịu, *tùy chọn hỏi Finance* → khoản cam kết → Finance ghi nhận ∥ IT Admin cấp seat (`QĐ-29b`). Người duyệt chi là người yêu cầu ⟹ bước duyệt chi tạo cho người thay thế Super Admin cấu hình trước (`QĐ-28c`). Ca đối chứng: phần mềm đã có, còn seat ⟹ trưởng phòng → IT Admin, không qua Người duyệt chi (`QĐ-29a`); phần mềm mới *không kiểm soát được* ⟹ **IT từ chối** kèm phương án thay thế (`QĐ-53c`) |
| **D-2** | Từ file nhật ký tới tiền tiết kiệm | Phát hiện có bằng chứng, và trung thực về số tiền. `G1`/`G2` chạy chỉ với dữ liệu nội bộ; `G3`/`G4` chỉ khi nguồn usage đủ bao phủ — thiếu thì ghi *chưa đánh giá được*, không kết luận *không sử dụng*; tiết kiệm ngay và tiết kiệm tại kỳ gia hạn tách riêng, không cộng. **Nguồn usage cụ thể dùng để demo chốt ở giai đoạn Tools** (`QĐ-57d`, `QĐ-59a`); kịch bản nguồn trước đây ở [tệp nghiên cứu tool & vendor](../Research-AI/tool-vendor-usage-research-backlog.md) |
| **D-3** | Nhân viên nghỉ việc | Vừa là chi phí vừa là lỗ hổng bảo mật, độ tin cậy tuyệt đối. Không kế nhiệm license; **bàn giao dữ liệu trước khi thu hồi** theo checklist `BM-08`; người nghỉ đang chịu trách nhiệm tài khoản dùng chung phải được thay trước (`QĐ-56b`) |
| **D-4** | Phát hiện chi tiêu ngoài danh mục — hiển thị **Đối soát chi phí phần mềm** (tính năng bổ sung) | Đưa Shadow IT vào diện quản trị, không kết tội. Mỗi khoản chi được đối soát với căn cứ phê duyệt: khớp · vượt số tiền · ngoài thời hạn · nhiều căn cứ · không có căn cứ ⟹ Finance/IT kiểm, chỉ **Người duyệt chi** chấp nhận hay không (`QĐ-33b`). Nguồn **duy nhất** là **CSV sao kê/hóa đơn** (`QĐ-31a`): import có xem trước → chuẩn hóa nhà cung cấp → đối soát khoản chi đã có → đối chiếu danh mục → bản ghi *cần xem xét* → IT điều tra → **Người duyệt chi** quyết. Nói rõ điểm mù: phần mềm miễn phí, tự trả tiền, khoản chi không được nhập |

> **D-1** chạy theo mô hình phòng ban (`QĐ-52`). **Danh sách SaaS dùng để demo** (các ứng dụng được nêu ở buổi Review 1: Codex, Canva, Gemini, Claude, Figma, Notion…) **chốt sau** khi có kết quả nghiên cứu phương pháp thu thập usage — sổ 6.9 dòng 13 (`QĐ-57d`). Phần tài khoản công ty và workspace do IT làm owner được **mô phỏng** vì nhóm không có tenant công ty (`QĐ-54c`).

---

## PHẦN VI — LÝ THUYẾT VÀ CÔNG NGHỆ CẦN NGHIÊN CỨU

### 6.1. "Lý thuyết cần nghiên cứu" trong đề tài này là gì

Trong một đề tài phần mềm, **lý thuyết cần nghiên cứu** là các khái niệm, mô hình, nguyên tắc và phương pháp giúp trả lời năm câu hỏi:

- Bài toán nghiệp vụ cần quản lý những gì?
- Dữ liệu nào cần lưu và liên kết với nhau ra sao?
- Ai được làm gì, ai phê duyệt, ai chịu trách nhiệm?
- Hệ thống dựa vào nguyên tắc nào để đưa ra cảnh báo hoặc khuyến nghị?
- Làm sao để dữ liệu đáng tin cậy, an toàn và kiểm toán được?

**Lý thuyết không phải tên công nghệ.** Ví dụ: *kiểm soát truy cập theo vai trò* là một mô hình phân quyền; *NestJS* và *PostgreSQL* là công nghệ dùng để hiện thực mô hình đó.

Đề tài phân biệt **ba tầng**, và trong báo cáo phải trình bày theo đúng thứ tự này:

| Tầng                            | Là gì                                                     | Ví dụ                                                                     | Mã                     |
| ------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------- |
| **1 · Lý thuyết và nguyên tắc** | Khái niệm và mô hình giải thích *vì sao thiết kế như vậy* | Phân tách trách nhiệm, kiểm soát truy cập theo vai trò, đối sánh thực thể | `LT-x`                 |
| **2 · Chuẩn và giao thức**      | Quy cách kỹ thuật đã được chuẩn hóa để hiện thực tầng 1   | OAuth 2.0, OpenID Connect, SCIM 2.0, JWT                                  | `CN-x` loại *Chuẩn*    |
| **3 · Công nghệ hiện thực**     | Thư viện, nền tảng, hạ tầng cụ thể nhóm chọn dùng         | NestJS, PostgreSQL, Redis, React, MinIO                                   | `CN-x` loại *Kỹ thuật* |

> **Vì sao phải tách rõ tầng 2 và tầng 3:** SCIM và OAuth thường bị xếp nhầm vào nhóm lý thuyết. Chúng là **chuẩn** — tức là một cách hiện thực đã được đồng thuận, không phải một khái niệm giải thích vấn đề. Nếu trình bày lẫn lộn, câu hỏi *"vậy rốt cuộc SCIM là lý thuyết hay công nghệ?"* sẽ khó trả lời gọn.

### 6.2. Mười sáu chủ đề lý thuyết

Mỗi chủ đề có mã `LT-x` để trích dẫn chéo với BRD và các tài liệu khác.

> **Cách đọc phần nguồn.** Mỗi chủ đề chỉ có **một nguồn chính** — đó là thứ người phụ trách bắt buộc phải mở ra đọc. Các nguồn còn lại ghi *đọc thêm* hoặc *nguồn gốc lý thuyết*: dùng khi cần dẫn học thuật trong báo cáo hoặc khi bị hỏi sâu, không bắt buộc đọc hết. Liệt kê nhiều nguồn cho một chủ đề mà không nói cái nào là chính thì trên thực tế không ai đọc cái nào.

#### 6.2.1. Phân công phụ trách

Nguyên tắc phân công: **người nghiên cứu lý thuyết cũng là người hiện thực nó**, để kết quả nghiên cứu đi thẳng vào công việc thay vì nằm lại trong báo cáo. Vai trò `R1`–`R5` theo **`QĐ-05`** *(bảng phân vai có hiệu lực, ánh xạ từ bản `.docx` đã nộp GVHD)* và **`QĐ-06`** *(ánh xạ cột `LT`/`CN`)*. Lịch chính thức chờ kế hoạch do GVHD giao *(Kế hoạch thực hiện cũ nằm ngoài baseline — `QĐ-26`)*.

| Vai trò                             | Thành viên                       | Mã số    | **Phần hệ thống chịu trách nhiệm hiện thực**                                                                                                                                                        | Chủ đề lý thuyết                                    | Chủ đề kỹ thuật                                                                        |
| ----------------------------------- | -------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `R1` Nghiệp vụ và tài liệu          | **Phạm Bảo Phi** *(nhóm trưởng)* | SE185046 | Mô hình dữ liệu; chín vòng đời có máy trạng thái; rule engine tám cổng lọc; cổng kiểm chứng dự báo; từ điển nhà cung cấp — `GCV-2` `GCV-3` `GCV-4` `GCV-5`                                                       | `LT-1` `LT-2` `LT-6` `LT-8` `LT-12` `LT-15` `LT-16` | `CN-11`                                                                                |
| `R2` Backend nền tảng và tích hợp   | **Vương Hoài Bảo**               | SE183866 | Xác thực, phân quyền, nhật ký kiểm toán; khung API; hàng đợi tác vụ nền; pipeline import; tầng ánh xạ danh tính; cổng cấp phát hai kênh; phân hệ tuân thủ — `GCV-1` `GCV-2` `GCV-3` `GCV-4` `GCV-6` | `LT-3` `LT-5` `LT-7` `LT-10` `LT-13` `LT-14`        | `CN-1` `CN-2` `CN-3` `CN-4` `CN-5` `CN-6` `CN-7` `CN-8` `CN-9` `CN-10` `CN-12` `CN-13` |
| `R3` Frontend nghiệp vụ             | **Nguyễn Đức Thiên Ân**          | SE182633 | Màn hình của quản lý, của bộ phận tài chính và luồng phê duyệt — `GCV-3` `GCV-5`                                                                                                                    | `LT-4` `LT-9` `LT-11`                               | `CN-16`                                                                                |
| `R4` Frontend nền tảng              | **Nguyễn Hưng Phú**              | SE183939 | Khung ứng dụng; thư viện thành phần dùng chung; màn hình của bộ phận CNTT và của nhân viên — `GCV-1` `GCV-2` `GCV-4`                                                                                | —                                                   | `CN-5` `CN-15` `CN-16`                                                                 |
| `R5` Tài liệu, thiết kế và kiểm thử | **Nguyễn Sỹ Hải Đăng**           | SE183849 | Hỗ trợ tài liệu và sơ đồ; thiết kế Figma; kịch bản kiểm thử; dữ liệu demo; chuẩn bị bảo vệ — `GCV-4` `GCV-6`                                                                                        | —                                                   | `CN-14`                                                                                |

> **Nguồn phân vai:** bản **`KE_HOACH_THUC_HIEN_DO_AN_TOT_NGHIEP.docx`** (`QĐ-05`, `QĐ-06`, nhóm trưởng chốt 08/09/2026). Cột `LT` và `CN` ánh xạ theo nguyên tắc *người nghiên cứu lý thuyết cũng là người hiện thực nó*: `LT-10` và `LT-13` (pháp lý) thuộc **Bảo** vì Bảo hiện thực phân hệ tuân thủ; `LT-6` (Shadow IT) và `LT-16` (thiết kế dữ liệu) thuộc **Phi** vì Phi giữ `GCV-5` và mô hình dữ liệu (đóng `PH-08`). Ba bảng 6.2.1, 6.3 và 6.5 khớp nhau.
>
> **Phân công hiện thực thực tế mà nhóm trưởng xác nhận 08/09/2026** — dùng để đọc các cột `LT`/`CN` cho đúng: **nghiệp vụ, thiết kế dữ liệu, bộ luật phát hiện lãng phí và toàn bộ tài liệu** do **Phi** giữ vai chính, **cả nhóm cùng tham gia** để mọi người hiểu nghiệp vụ và luồng rồi góp ý tưởng; **backend do Phi và Bảo cùng code**; **frontend web do Ân và Phú**; **Đăng** hỗ trợ tài liệu, sơ đồ và làm Figma UI/UX cùng nhóm frontend, có lúc code cùng frontend. Các mã `LT`/`CN` ghi **người chịu trách nhiệm chính** cho chủ đề đó, không loại trừ người khác cùng làm.
>
> ⚠️ **Rủi ro tải việc:** theo phân vai mới, **Bảo giữ 12 trong 18 chủ đề kỹ thuật và 6 chủ đề lý thuyết** — nặng hơn hẳn bốn người còn lại. Đây là hệ quả trực tiếp của việc `.docx` đặt Bảo làm người backend duy nhất ngoài nhóm trưởng. Việc **Phi cùng code backend** (ghi ở trên) giảm bớt rủi ro này trên thực tế, nhưng cột `CN` vẫn cho thấy tải danh nghĩa lệch. Cần theo dõi ở buổi họp tuần.
>
> **Cách phân công này dựa trên cân đối khối lượng và sự khớp với phần hiện thực, không dựa trên đánh giá năng lực.** Nhóm hoàn toàn có thể hoán đổi trong buổi họp chốt kế hoạch. Hai ràng buộc nên giữ: `LT-10` và `LT-13` phải cùng một người vì hai chủ đề pháp lý này liên quan chặt với nhau; `LT-14` và `CN-13` phải cùng một người vì một bên là lý thuyết và một bên là cách hiện thực của cùng bài toán.
>
> **Nếu bị hỏi vì sao số chủ đề mỗi người không bằng nhau** — `R1` nhiều chủ đề lý thuyết, `R2` nhiều chủ đề kỹ thuật — thì **không trả lời bằng số lượng mã, trả lời bằng cột thứ tư**. Một chủ đề lý thuyết không tương đương một đơn vị khối lượng: `LT-16` thiết kế theo miền nghiệp vụ nặng gấp nhiều lần `CN-3` JWT. Nhóm phân chia theo **chuỗi chức năng mà thành viên chịu trách nhiệm hiện thực**, và các mã `LT`/`CN` chỉ là hệ quả của việc ai sở hữu phần code nào — người viết tầng ánh xạ danh tính thì nhận `LT-14` và `CN-13`, không phải ngược lại.

#### 6.2.2. Chọn nội dung trình bày trong buổi báo cáo

Ba mươi bốn chủ đề là **danh sách nghiên cứu**, không phải danh sách trình bày. Đọc hết trong buổi báo cáo sẽ làm loãng phần quan trọng. Đề xuất chia hai mức:

| Mức                   | Nội dung                                                                                                                                                                                                                                                                                                                                                                               | Số mục                    |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| **Trình bày miệng** ★ | `LT-1` `LT-2` quản trị SaaS và vòng đời license · `LT-3` `LT-5` quản trị truy cập và phân tách trách nhiệm · `LT-8` hệ dựa trên luật và tính giải thích được · `LT-14` đối sánh thực thể · `LT-10` bảo vệ dữ liệu cá nhân · `LT-16` thiết kế theo miền nghiệp vụ. Về kỹ thuật: `CN-2` SCIM, `CN-7` import có bước chạy thử, `CN-8` định dạng xuất của nhà cung cấp, `CN-9` idempotency | 8 lý thuyết + 4 kỹ thuật  |
| **Để phụ lục**        | Toàn bộ phần còn lại, có bảng đầy đủ để tra khi bị hỏi                                                                                                                                                                                                                                                                                                                                 | 8 lý thuyết + 14 kỹ thuật |

> **Câu cần nói khi trình bày danh sách này:** *"Nhóm chưa nghiên cứu hoàn tất toàn bộ các nội dung này. Đây là research backlog **được xác định từ yêu cầu hệ thống**, và **mỗi chủ đề sẽ được nghiên cứu trước giai đoạn hiện thực tương ứng**."*
>
> Ba ý trong câu đó lần lượt chặn ba câu hỏi khác nhau: *chưa hoàn tất* chặn giả định nhóm đang khoe thành quả; *xác định từ yêu cầu hệ thống* chặn nghi ngờ đây là danh sách kiến thức CNTT chung gom lại cho dày; *nghiên cứu trước giai đoạn hiện thực* chặn câu *"ba mươi bốn chủ đề mà làm xong hết trong một kỳ à?"* — vì thứ tự đã có ở mục 6.5 và tiêu chí hoàn thành ở mục 6.6.

**Lý do chọn tám chủ đề trên để nói:** `LT-1`, `LT-2`, `LT-16` là nền không có không hiểu được đề tài; `LT-3`, `LT-5` là chỗ hội đồng hay hỏi nhất; còn `LT-8`, `LT-10`, `LT-14` là ba chủ đề **ít đồ án gọi tên được** nên đáng dành thời gian nói kỹ. Bốn chủ đề kỹ thuật được chọn cũng theo cùng logic — chúng là đặc trưng của hệ thống có tính tin cậy, không phải công nghệ phổ thông.

---

#### Nhóm A — Nghiệp vụ quản trị SaaS và chi phí

**`LT-1` · Quản lý tài sản phần mềm**

Quản lý tài sản CNTT trong toàn bộ vòng đời. Trong phạm vi đề tài, tài sản không phải máy móc mà là **quyền sử dụng phần mềm**: license, suất dùng, thuê bao.

*Cần nghiên cứu:* vòng đời tài sản phần mềm; khái niệm quyền sử dụng và tuân thủ license; sự khác biệt giữa phần mềm mua đứt và phần mềm thuê bao.
*Áp dụng:* nền của phân hệ danh mục và phân bổ suất — BRD mục 5.1, 5.2.
*Kết quả cần tạo ra:* bảng vòng đời tài sản phần mềm kèm danh sách thuộc tính bắt buộc của một bản ghi license, dùng trực tiếp làm đầu vào cho các bảng `Subscription` và `Assignment` trong ranh giới `C1` và `C3` (BRD mục 5.12.1).
*Nguồn chính:* **ISO/IEC 19770-1:2017** — hệ thống quản lý tài sản CNTT.

**`LT-2` · Quản trị SaaS, vòng đời license và quản lý tài chính công nghệ**

Vòng đời một suất dùng đi qua tám chặng, và hệ thống phải theo dõi được từng chặng:

```
Nhu cầu phát sinh → Yêu cầu → Phê duyệt → Mua hoặc gia hạn thuê bao
  → Cấp quyền → Theo dõi sử dụng → Thu hồi hoặc gia hạn → Kết thúc
```

*Cần nghiên cứu:* danh mục SaaS đã phê duyệt; thuê bao, hợp đồng, hóa đơn và quan hệ giữa chúng; hạn chót báo hủy; phân bổ chi phí về đơn vị chịu chi phí; hiển thị chi phí cho đơn vị sử dụng so với quy chi phí thật về đơn vị đó.
*Áp dụng:* toàn bộ phân hệ BRD 5.1, 5.5 và bảng điều khiển tài chính.
*Kết quả cần tạo ra:* sơ đồ tám chặng vòng đời suất dùng, mỗi chặng ánh xạ sang một bảng dữ liệu và một luồng `F-x`; kèm bảng phân biệt *hiển thị chi phí cho đơn vị* và *quy chi phí thật về đơn vị*.
*Nguồn chính:* **FinOps Framework** của FinOps Foundation — các domain *Understand usage & cost* và *Quantify business value*.
*Đọc thêm nếu còn thời gian:* **ITIL 4** thực hành Service Financial Management; báo cáo ngành tại Phần VIII.

**`LT-9` · Kế toán chi phí: cơ sở dòng tiền và cơ sở dồn tích**

Hai cách ghi nhận cùng một khoản chi cho ra hai bức tranh khác nhau.

*Cần nghiên cứu:* ghi nhận theo ngày phát sinh dòng tiền so với phân bổ đều theo kỳ sử dụng; vì sao báo cáo ngân sách và báo cáo đối soát thanh toán cần hai cơ sở khác nhau.
*Áp dụng:* **FR-5.3** và quyết định **OQ-06** — hệ thống lưu cả hai, có nhãn phân biệt. Một hóa đơn năm 12.000 USD trả tháng Một sẽ làm vỡ ngân sách tháng Một và để trống mười một tháng còn lại nếu chỉ dùng cơ sở dòng tiền.
*Kết quả cần tạo ra:* bảng đối chiếu hai cơ sở ghi nhận trên cùng một hóa đơn năm, kèm một test case kiểm tra tổng chi 12 tháng của hai cơ sở phải bằng nhau.
*Nguồn chính:* **VAS 01 — Chuẩn mực chung**, nguyên tắc cơ sở dồn tích (ban hành theo Quyết định 165/2002/QĐ-BTC). Đây là văn bản tiếng Việt, ngắn, đọc được trong một buổi.
*Đối chiếu quốc tế:* **IAS 1** *Presentation of Financial Statements*.

**`LT-11` · Đa tiền tệ trong hệ thống tài chính**

*Cần nghiên cứu:* đồng tiền báo cáo của tổ chức; chốt tỷ giá tại thời điểm ghi nhận giao dịch thay vì quy đổi lại lúc xem báo cáo; vì sao không dùng kiểu số thực dấu phẩy động cho tiền.
*Áp dụng:* **FR-1.6, FR-5.6** và **ADR-03**. Doanh nghiệp Việt Nam mua phần mềm bằng ngoại tệ nhưng báo cáo bằng đồng nội tệ; không có quy đổi có kiểm soát thì mọi biểu đồ so sánh ngân sách đều vô nghĩa.
*Kết quả cần tạo ra:* quy ước lưu tiền theo bộ trường của **bất biến `INV-04`** (BRD mục 5.12.2) — số tiền gốc, loại tiền tệ, tỷ giá, ngày áp dụng, giá trị đã quy đổi — kèm test case chứng minh xem lại một báo cáo cũ vẫn ra đúng số cũ vì tỷ giá đã chốt tại thời điểm ghi nhận.
*Nguồn chính:* **VAS 10** *Ảnh hưởng của việc thay đổi tỷ giá hối đoái* — quy định về tỷ giá tại thời điểm ghi nhận (cùng Quyết định 165/2002/QĐ-BTC với VAS 01).
*Đọc thêm:* Martin Fowler, *Patterns of Enterprise Application Architecture* — mẫu **Money**, cho phần vì sao không dùng số thực dấu phẩy động.

---

#### Nhóm B — Quản trị truy cập và kiểm soát nội bộ

**`LT-3` · Quản trị định danh và quyền truy cập**

*Cần nghiên cứu:* xác thực và phân quyền là hai việc khác nhau; kiểm soát truy cập theo vai trò; nguyên tắc quyền tối thiểu; cấp phát và thu hồi quyền theo vòng đời nhân sự; **rà soát quyền định kỳ**.
*Áp dụng:* sáu vai trò của hệ thống, phân quyền ở tầng API, luồng cấp và thu hồi quyền.
*Kết quả cần tạo ra:* bảng nguyên tắc quản trị truy cập áp dụng cho đề tài, kèm **ma trận ánh xạ Vai trò → Quyền → Endpoint API** đầy đủ, dùng làm đặc tả cho `CN-4` và cho tầng guard của NestJS (`ADR-11`).
*Nguồn chính:* **NIST SP 800-53 Rev. 5**, họ kiểm soát AC — đặc biệt **AC-2** về phê duyệt, tạo, thay đổi, vô hiệu hóa và rà soát tài khoản định kỳ. Đây là nguồn ánh xạ thẳng sang yêu cầu của hệ thống.
*Đọc thêm nếu cần hiểu mô hình RBAC gốc:* Sandhu và cộng sự (1996), *Role-Based Access Control Models*, IEEE Computer 29(2) — bài này dễ đọc hơn bản chuẩn ANSI/INCITS 359.

**`LT-4` · Quản lý quyền và phê duyệt nhiều tầng**

*Cần nghiên cứu:* mô hình người duyệt là **trưởng phòng hiện hành** của phòng người yêu cầu (`QĐ-52a`); người duyệt xác định động theo điều kiện; chuỗi phê duyệt nhiều tầng; người duyệt dự phòng; **người duyệt thay thế khi xung đột lợi ích** cấu hình trước. Hệ thống **không** có ủy quyền có thời hạn (`QĐ-27`); người thay thế là cấu hình tĩnh theo điều kiện do Super Admin đặt trước, không phải ủy quyền do người duyệt tự chọn (`QĐ-28c`).
*Áp dụng:* **FR-3.3 → FR-3.6**, chính sách duyệt cấu hình được; **`FR-3.13`** Người duyệt chi — **một** người do Super Admin cấu hình, tham gia khi Request có chi phí hoặc đưa phần mềm bên ngoài có trả phí/có bản quyền vào danh mục (phần mềm nội bộ do IT đăng ký — `QĐ-50a`; công cụ miễn phí bên ngoài IT đóng — `QĐ-49h`), và duyệt bước nhu cầu khi trưởng phòng tự gửi yêu cầu (`QĐ-52c`); **`FR-3.14`** snapshot ngân sách theo chi phí thực chịu, quyền hỏi Finance và ghi nhận của Finance sau duyệt, không có hiệu lực chặn (`QĐ-29b`, `QĐ-60a`). Mô hình *ma trận nhiều ngưỡng tiền* của Entra đã cân nhắc và **không chọn** cho MVP (`QĐ-22`).
*Kết quả cần tạo ra:* bảng chính sách duyệt cấu hình được theo dạng *điều kiện → chuỗi người duyệt*, kèm bốn test case: người duyệt vắng mặt *(không đổi người, chỉ nhắc và cảnh báo)*, Người duyệt chi là người yêu cầu *(chuyển người thay thế khi xung đột)*, chuỗi duyệt vòng, và người duyệt trùng người yêu cầu (bất biến `INV-08`); thêm test trưởng phòng tự gửi yêu cầu ⟹ bước nhu cầu chuyển cho Người duyệt chi, và test Người duyệt chi hỏi Finance ⟹ SLA của bước **không** dừng và người được giao **không** đổi.
*Nguồn chính:* **Microsoft Entra ID Governance** — entitlement management và dynamic approval. Chọn nguồn này vì nó mô tả một hệ thống có thật đang chạy, không phải mô hình lý thuyết.
*Đọc thêm:* **NIST SP 800-53 Rev. 5** kiểm soát AC-5, AC-6.

**`LT-5` · Phân tách trách nhiệm và kiểm soát nội bộ**

Nguyên tắc: không để một người đồng thời đề xuất, phê duyệt và thực hiện một quyết định quan trọng.

*Cần nghiên cứu:* mục đích của nguyên tắc — giảm rủi ro lạm quyền, gian lận và sai sót không bị phát hiện; cách kiểm chứng nguyên tắc bằng kiểm thử phân quyền.
*Áp dụng:* **SoD-1 → SoD-8**, bất biến `INV-08`, và ba loại quyết định ở mục 3.2 của tài liệu này.
*Kết quả cần tạo ra:* ma trận phân tách trách nhiệm dạng *vai trò × hành động*, kèm **tám** test case phủ định — mỗi nguyên tắc `SoD-x` một trường hợp bắt buộc phải bị hệ thống chặn ở tầng guard — cộng một test **dương** cho ngoại lệ *Manager trùng Người duyệt chi được giữ hai bước và gắn cờ*.
*Nguồn chính:* **ISO/IEC 27001:2022** Annex A, kiểm soát **5.3** *Segregation of duties*. Chỉ khoảng một trang, nhưng đủ để phát biểu nguyên tắc và dẫn được vào `SoD-1 → SoD-8`.
*Đọc thêm nếu bị hỏi sâu:* **COSO Internal Control — Integrated Framework (2013)**. Không cần đọc COBIT cho phạm vi đề tài.

**`LT-15` · Máy trạng thái hữu hạn và mô hình hóa quy trình phê duyệt**

Thứ đề tài cần **không phải** toàn bộ lĩnh vực quản lý quy trình nghiệp vụ, mà hẹp hơn: cách đặc tả một vòng đời bằng tập trạng thái, tập chuyển trạng thái, điều kiện canh và hiệu ứng kèm theo.

*Cần nghiên cứu:* máy trạng thái hữu hạn; điều kiện canh và hiệu ứng phụ; vì sao chuyển trạng thái không có trong bảng thì phải coi là không tồn tại; đo thời hạn xử lý và cơ chế nhắc, thông báo khi quá hạn — *escalate chỉ là thông báo, không đổi người duyệt* (`QĐ-28d`).
*Áp dụng:* **BRD mục 5.12.3** — **chín** vòng đời cần đặc tả bằng máy trạng thái. Lưu ý mô hình đúng của hệ thống là **hai tầng**: yêu cầu có vòng đời riêng, còn từng bước duyệt là thực thể riêng có vòng đời riêng. Không gộp hai tầng — đây là một trong hai nguyên tắc bắt buộc ghi tại BRD mục 5.12.3.
*Kết quả cần tạo ra:* bảng chuyển trạng thái đầy đủ cho chín thực thể — trạng thái nguồn, sự kiện, điều kiện canh, trạng thái đích, hiệu ứng — kèm danh sách các chuyển trạng thái **không hợp lệ** dùng làm bộ test phủ định.
*Nguồn chính:* **OMG UML 2.5.1**, chương *State Machines* — dùng được ngay để đặc tả, có sẵn ký pháp cho điều kiện canh và hiệu ứng.
*Nguồn gốc lý thuyết, trích khi cần dẫn học thuật:* Harel, D. (1987), *Statecharts: A Visual Formalism for Complex Systems*, Science of Computer Programming 8(3).

> Đề tài **không dùng** ký pháp mô hình hóa quy trình nghiệp vụ chuẩn công nghiệp. Nêu rõ điều này để tránh bị hỏi về công cụ mà nhóm không dùng.

---

#### Nhóm C — Dữ liệu, suy luận và độ tin cậy

**`LT-14` · Đối sánh thực thể và liên kết bản ghi**

Bài toán: khớp một định danh lạ từ nguồn ngoài — `baovh`, `bao.pham+figma@cty.vn`, `PAYPAL*CANVA` — về đúng một thực thể nội bộ, khi không có khóa chung.

*Cần nghiên cứu:* khớp tất định so với khớp xác suất; chuẩn hóa chuỗi trước khi so khớp; ngưỡng quyết định và vùng cần người xem lại; đánh đổi giữa **bỏ sót** và **khớp nhầm**; xử lý trường hợp một định danh khớp về nhiều thực thể.
*Áp dụng:* **FR-4.5 → FR-4.8** và **FR-6.5**. Đây là nền lý thuyết của toàn bộ tầng ánh xạ danh tính trong ranh giới `C5` (BRD mục 5.12.1), và là điều kiện để bất biến `INV-12` giữ được.
*Kết quả cần tạo ra:* bộ quy tắc chuẩn hóa chuỗi, chiến lược khớp xếp theo thứ tự ưu tiên, ngưỡng tin cậy đã chốt, và bộ test case gồm cả trường hợp khớp nhầm lẫn trường hợp một định danh khớp nhiều thực thể.
*Nguồn chính:* Christen, P. (2012), *Data Matching*, Springer — sách giáo khoa, chương về chuẩn hóa và chương về so khớp là đủ cho đề tài.
*Nguồn gốc lý thuyết, trích khi cần dẫn học thuật:* Fellegi, I. P. và Sunter, A. B. (1969), *A Theory for Record Linkage*, Journal of the American Statistical Association 64(328).

> **Vì sao chủ đề này cần được chú ý:** nếu tầng ánh xạ sai, mọi kết luận phía sau đều sai mà không có dấu hiệu gì. Đây cũng là chủ đề ít đồ án gọi tên được, nên đáng nhấn khi bảo vệ. Lưu ý phân biệt với `LT-7`: đối sánh thực thể là **bài toán khớp**, chất lượng dữ liệu là **bài toán tin cậy được bao nhiêu**.

**`LT-7` · Chất lượng và nguồn gốc dữ liệu**

*Cần nghiên cứu:* năm chiều chất lượng dữ liệu — đầy đủ, nhất quán, kịp thời, chính xác, truy vết được; khái niệm **cửa sổ dữ liệu bao phủ**; nguồn chân lý khi nhiều nguồn mâu thuẫn; lưu vết kết luận về tới file hoặc lần gọi nào.
*Áp dụng:* **FR-4.3, FR-4.10, FR-7.7** và luồng **F-43**; hai bất biến `INV-10` và `INV-11`. Nguyên tắc chốt: dữ liệu nội bộ đã qua phê duyệt là chân lý về *ý định*, dữ liệu nhà cung cấp là chân lý về *thực tế*, và khi lệch nhau thì không nguồn nào tự ghi đè nguồn kia.
*Kết quả cần tạo ra:* định nghĩa vận hành của **cửa sổ dữ liệu bao phủ**, bảng quy tắc ưu tiên nguồn khi mâu thuẫn (`FR-7.7`), và mẫu bản ghi truy vết cho phép lần từ một kết luận về đúng file hoặc lần gọi API đã sinh ra nó.
*Nguồn chính:* **DAMA-DMBOK** ấn bản 2, chương *Data Quality* — đây là nơi lấy danh sách các chiều chất lượng dữ liệu dùng trong đề tài.
*Nguồn gốc lý thuyết:* Wang, R. Y. và Strong, D. M. (1996), *Beyond Accuracy: What Data Quality Means to Data Consumers*, JMIS 12(4) — bài đặt nền cho quan niệm chất lượng dữ liệu là *sự phù hợp với mục đích sử dụng*. Lưu ý khi trích: khung của Wang và Strong không trùng khít với danh sách năm chiều nêu trên, nên dẫn bài này cho **quan niệm**, dẫn DAMA-DMBOK cho **danh sách chiều**.
*Cho phần lưu vết nguồn gốc:* **W3C PROV-DM**.

**`LT-8` · Hệ ra quyết định dựa trên luật và tính giải thích được**

*Cần nghiên cứu:* hệ dựa trên luật so với mô hình học máy — khi nào chọn cái nào; tính giải thích được như một yêu cầu chức năng chứ không phải tính năng phụ; cổng lọc điều kiện trước khi đánh giá; đánh đổi giữa báo động giả và bỏ sót.
*Áp dụng:* tám cổng lọc của **FR-4.9**, công thức mức tin cậy **FR-4.14**, và tiêu chí nghiệm thu **TC-2** yêu cầu số báo động giả bằng không.
*Kết quả cần tạo ra:* bảng tám cổng lọc ghi rõ đầu vào, điều kiện, đầu ra và **cách xử lý khi không đủ bằng chứng**; kèm công thức mức tin cậy có ít nhất một ví dụ tính tay đầy đủ.
*Nguồn chính:* Rudin, C. (2019), *Stop Explaining Black Box Machine Learning Models for High Stakes Decisions and Use Interpretable Models Instead*, Nature Machine Intelligence 1. Bài này lập luận đúng cái mà `ADR-09` đã quyết: với quyết định có hậu quả, chọn mô hình giải thích được ngay từ đầu thay vì giải thích ngược một mô hình hộp đen.
*Đọc thêm:* Molnar, C., *Interpretable Machine Learning* — sách trực tuyến miễn phí, chương phân biệt mô hình tự giải thích và giải thích hậu kiểm.
*Lập luận chốt:* xem mục 1.5 của tài liệu này và **ADR-09**.

**`LT-12` · Đánh giá sai số dự báo**

*Cần nghiên cứu:* kiểm chứng lùi bằng cách chia dữ liệu huấn luyện và kiểm tra; sai số phần trăm tuyệt đối trung bình; cách diễn giải các dải sai số; vì sao mô hình phức tạp không nhất thiết cho sai số tốt hơn trên chuỗi dữ liệu tháng ngắn.
*Áp dụng:* cổng kiểm chứng **FR-5.7** — hệ thống tự đánh giá và **tự từ chối dự báo** khi sai số vượt ngưỡng.
*Kết quả cần tạo ra:* hàm kiểm chứng lùi chạy được, kèm báo cáo sai số trên một tập dữ liệu mẫu 12 tháng, ngưỡng đã chốt và mô tả hành vi hệ thống khi vượt ngưỡng.
*Nguồn chính:* Hyndman, R. J. và Athanasopoulos, G., *Forecasting: Principles and Practice*, ấn bản 3, OTexts — chương đánh giá độ chính xác dự báo và kiểm chứng chéo chuỗi thời gian. Sách miễn phí, đọc trực tuyến, có ví dụ chạy được.

---

#### Nhóm D — Mô hình hóa hệ thống

**`LT-16` · Thiết kế theo miền nghiệp vụ**

Cách tiếp cận thiết kế xoay quanh nghiệp vụ thực tế, giúp cả nhóm dùng chung một bộ thuật ngữ và chia hệ thống thành các vùng có ranh giới rõ.

*Cần nghiên cứu:* thực thể có định danh và vòng đời riêng; đối tượng giá trị xác định bằng nội dung — ví dụ tiền gồm số tiền và loại tiền tệ; ranh giới ngữ cảnh nghiệp vụ; **bất biến** là quy tắc luôn phải đúng ở tầng dữ liệu; **dữ liệu có hiệu lực theo thời gian** thay vì ghi đè.
*Áp dụng:* **BRD mục 5.12** — tám ranh giới ngữ cảnh `C1` → `C8`, **hai mươi** bất biến `INV-01` → `INV-20`, và các bảng có khoảng hiệu lực theo **ADR-04**. Ranh giới ngữ cảnh cũng là cơ sở chia module ở tầng mã nguồn theo **ADR-11**.
*Kết quả cần tạo ra:* bảng thuật ngữ nghiệp vụ dùng chung cho cả nhóm (đối chiếu BRD mục 12), sơ đồ tám ranh giới ngữ cảnh, và danh sách **hai mươi** bất biến kèm cách ràng buộc từng bất biến ở tầng cơ sở dữ liệu (`INV-14` tách thành `INV-14a`/`INV-14b` — `QĐ-30b`, `QĐ-30c`).
*Nguồn chính:* Evans, E. (2003), *Domain-Driven Design*, Addison-Wesley — phần I và phần IV là đủ; không cần đọc cả sách. Bản tóm tắt miễn phí *DDD Reference* (2015) dùng để tra nhanh.
*Đọc thêm:* Vernon, V. (2013), *Implementing Domain-Driven Design* cho phần ranh giới ngữ cảnh; Fowler, M., *Analysis Patterns* cho nhóm mẫu dữ liệu có hiệu lực theo thời gian, liên quan trực tiếp `ADR-04`.

> **Trọng số của chủ đề này.** Nội dung lõi của mô hình miền nằm ở BRD mục 5.12 (bộ Domain Spec cũ đã gỡ), nên người phụ trách `LT-16` chịu trách nhiệm luôn việc **soạn lại tài liệu thiết kế kỹ thuật** ở giai đoạn hiện thực — lược đồ bảng chi tiết và bảng chuyển trạng thái đầy đủ. Xem mục 7.1.

---

#### Nhóm E — Rủi ro, pháp lý và quyền riêng tư

**`LT-6` · Shadow IT và phát hiện dịch vụ đám mây**

*Cần nghiên cứu:* định nghĩa Shadow IT; các nguồn bằng chứng và **điểm mù của từng nguồn**; phát hiện dựa trên bằng chứng thay vì suy đoán; vì sao không thể cam kết phát hiện toàn bộ.
*Áp dụng:* phân hệ **BRD 5.6**, ranh giới `C6`, và nguyên tắc bản ghi phát hiện không phải kết luận vi phạm (`FR-6.6`).
*Kết quả cần tạo ra:* bảng *nguồn bằng chứng × điểm mù của nguồn đó*, kèm quy tắc phân tầng rủi ro áp cho một bản ghi phát hiện.
*Nguồn chính:* Microsoft Learn về Shadow IT và Cloud Discovery.
*Đọc thêm:* **ISO/IEC 27001:2022** Annex A, kiểm soát **5.23** *Information security for use of cloud services*.

**`LT-10` · Bảo vệ dữ liệu cá nhân** — **ưu tiên cao**

*Cần nghiên cứu:* danh mục **mười hai nhóm dữ liệu cá nhân nhạy cảm** tại Điều 4 Nghị định 356/2025; cơ sở pháp lý xử lý dữ liệu người lao động; **điều kiện minh bạch khi áp dụng biện pháp công nghệ để quản lý người lao động**; nghĩa vụ xóa dữ liệu khi chấm dứt hợp đồng lao động; quyền của chủ thể dữ liệu và thời hạn đáp ứng; nguyên tắc thiết kế bảo vệ quyền riêng tư ngay từ đầu.
*Áp dụng:* **BRD mục 7.7** toàn bộ, **ADR-10**, phân hệ **5.11**, luồng **F-40 → F-42**, và chính sách lưu giữ tại BRD mục 7.5.
*Kết quả cần tạo ra:* **Ma trận phân loại dữ liệu** — mỗi trường dữ liệu cá nhân trong hệ thống ứng với một mức nhạy cảm, một cơ sở pháp lý xử lý và một thời hạn lưu giữ; kèm bản mẫu thông báo minh bạch gửi người lao động theo yêu cầu của luật. **Ma trận này nay bổ sung vào BRD mục 7.7.2** — xem `ND-2` tại mục 7.1.
*Nguồn chính, đọc bản gốc chứ không đọc bài tóm tắt:* **Nghị định 356/2025/NĐ-CP** — trọng tâm là **Điều 4** danh mục dữ liệu nhạy cảm; và **Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15** phần quyền của chủ thể dữ liệu.

*Căn cứ đã đọc (`QĐ-20`):* đã đọc nguyên văn trên PDF Công báo các Điều **3, 7, 8, 9, 11, 19, 21, 25, 32, 38** của Luật 91/2025. Điểm quyết định cho bộ thu thập trên thiết bị là **Điều 25 khoản 3**: biện pháp công nghệ quản lý người lao động chỉ được áp dụng khi phù hợp pháp luật, bảo đảm quyền lợi và *"người lao động biết rõ biện pháp đó"*; cùng **Điều 38 khoản 2**: doanh nghiệp xử lý dữ liệu nhạy cảm **không** được miễn hồ sơ đánh giá tác động. Kết quả đã chuyển thành mười điều kiện `ĐK-01` → `ĐK-10` ở BRD mục 7.7.7 và `ADR-13`. **Còn mở:** thông báo cộng xác nhận có thay được sự đồng ý theo Điều 11 không — `OQ-16`. **Chính sách thiết bị** (`FR-4.21`, `QĐ-58f`) dùng cùng căn cứ: nhân viên ký **xác nhận đã biết rõ** khi nhận máy công ty — không phải *đồng ý*; tính tự nguyện của xác nhận này còn mở ở `OQ-23`.

> ⚠️ **Nghị định 13/2023/NĐ-CP đã hết hiệu lực từ 01/01/2026** — không trích dẫn văn bản này; dùng Luật 91/2025 và Nghị định 356/2025.

**`LT-13` · Pháp luật viễn thông**

*Cần nghiên cứu:* khái niệm **dịch vụ viễn thông cơ bản trên Internet** trong Luật Viễn thông 2023 và phạm vi các dịch vụ nhắn tin, gọi thoại, họp trực tuyến qua Internet.
*Áp dụng:* phân tích vùng xám của nhóm ứng dụng liên lạc tại **BRD mục 7.7.6** và quyết định **ADR-10**. Đây là đường rủi ro pháp lý thật của nhóm ứng dụng này — không phải cụm "dịch vụ truyền thông trực tuyến" như suy đoán ban đầu.
*Kết quả cần tạo ra:* quy tắc ba câu hỏi gắn cờ `is_communication_service` (`FR-1.8`) áp thử trên danh mục **mười một** nhà cung cấp ở [ma trận nhà cung cấp](../Research-AI/tool-vendor-usage-research-backlog.md#631-ma-trận-khả-năng-truy-xuất-dữ-liệu-usage-theo-nhà-cung-cấp) (BRD 6.3.1 cũ), cho ra kết luận *thu thập* hoặc *không thu thập* đối với từng ứng dụng.
*Nguồn chính:* **Luật Viễn thông số 24/2023/QH15** — phần giải thích từ ngữ và phân loại dịch vụ viễn thông.
*Đọc thêm:* **Nghị định 163/2024/NĐ-CP** quy định chi tiết một số điều và biện pháp thi hành Luật Viễn thông.

---

### 6.3. Mười tám chủ đề chuẩn, giao thức và công nghệ hiện thực

Cột **Loại** phân biệt tầng 2 và tầng 3 theo bảng ở mục 6.1.

| #     | Chủ đề                                                              | Loại     | Cần để làm gì                                                                                                             | Kết quả cần tạo ra                                                                                                                                                                  | Ưu tiên    | Phụ trách  |
| ----- | ------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ---------- |
| CN-1  | OAuth 2.0 và OpenID Connect                                         | Chuẩn    | Đọc hiểu dữ liệu cấp quyền phục vụ phát hiện ngoài danh mục — đăng nhập là xác thực nội bộ (`QĐ-46`) | Sơ đồ luồng authorization code + danh sách scope cần xin cho từng nhà cung cấp demo                                                                                                 | Cao        | Bảo        |
| CN-2  | **SCIM 2.0**                                                        | Chuẩn    | Cấp phát và thu hồi tài khoản tự động — nền của cổng cấp phát                                                             | Bản đồ thuộc tính SCIM User → bảng nội bộ + một kịch bản tạo và vô hiệu hóa tài khoản chạy được                                                                                     | Cao        | Bảo        |
| CN-3  | JWT                                                                 | Chuẩn    | Biểu diễn phiên đăng nhập — thiết kế BE ADR-0010, Accepted cho triển khai (`QĐ-47`; chưa implement)                    | Quy ước claim trong token, thời hạn sống và cơ chế làm mới theo BE ADR-0010                                                                                     | Cao        | Bảo        |
| CN-4  | Kiểm soát truy cập theo vai trò ở tầng API                          | Kỹ thuật | Enforce phân quyền, không chỉ ẩn ở giao diện — hiện thực bằng **guard của NestJS**                                        | Ma trận endpoint × vai trò + bộ test trả về 401 và 403 + tám test phủ định cho `SoD-1` → `SoD-8`                                                                           | Cao        | Bảo        |
| CN-5  | Thiết kế REST API                                                   | Kỹ thuật | Hợp đồng giữa frontend và backend                                                                                         | Bản đặc tả OpenAPI cho nhóm endpoint lõi, chốt trước khi frontend bắt đầu; tận dụng chia sẻ kiểu TypeScript giữa hai phía (`ADR-11`)                                                | Cao        | Bảo + Phú  |
| CN-6  | Hàng đợi và tác vụ nền                                              | Kỹ thuật | Chạy rule engine, import, đối soát, thông báo                                                                             | Sơ đồ hàng đợi, danh sách job định kỳ và chính sách thử lại khi thất bại                                                                                                            | Cao        | Bảo        |
| CN-7  | Pipeline xử lý file có bước chạy thử                                | Kỹ thuật | Import sáu bước với xem trước bắt buộc                                                                                    | Bộ file mẫu ba loại — hợp lệ, sai định dạng, trùng khóa — kèm bảng quy định hệ thống phản ứng thế nào với từng loại                                                                 | Cao        | Bảo        |
| CN-8  | **Định dạng xuất dữ liệu của nhà cung cấp**                         | Kỹ thuật | Lịch sử commit GitHub (`QĐ-28a`), báo cáo Microsoft 365, API Atlassian: cấu trúc cột, đơn vị thời gian, **định nghĩa hoạt động**  | **Hai đến ba bộ dữ liệu mẫu thật** + bảng ánh xạ cột và định nghĩa "hoạt động" của từng nguồn (bất biến `INV-11`)                                                                   | **Cao**    | Bảo        |
| CN-9  | Idempotency và cơ chế thử lại                                       | Kỹ thuật | Không tạo tài khoản hai lần khi thử lại                                                                                   | Quy tắc sinh khóa idempotency từ dữ liệu nghiệp vụ + test gọi lặp không sinh bản ghi thứ hai                                                                                        | Trung bình | Bảo        |
| CN-10 | Lưu trữ đối tượng và URL có thời hạn                                | Kỹ thuật | Bảo vệ tệp hợp đồng và hóa đơn                                                                                            | Quy ước đặt tên đối tượng lưu trữ, thời hạn URL và test truy cập sau khi hết hạn                                                                                                    | Trung bình | Bảo        |
| CN-11 | Ràng buộc dữ liệu nâng cao trong PostgreSQL                         | Kỹ thuật | Hiện thực các bất biến ở tầng CSDL: chống chồng lấn thời gian, chống vượt số suất, nhật ký chỉ ghi thêm                   | Tập migration mẫu có ràng buộc loại trừ theo khoảng và chỉ mục duy nhất có điều kiện + test chèn chồng lấn phải thất bại; phủ `INV-01` `INV-02` `INV-05` `INV-13` `INV-14a` `INV-14b` `INV-15` | **Cao**    | Phi        |
| CN-12 | Mẫu ghi nhật ký kiểm toán chỉ ghi thêm                              | Kỹ thuật | Nhật ký không sửa được (`INV-05`)                                                                                         | Định nghĩa bảng nhật ký + bằng chứng `UPDATE` và `DELETE` bị từ chối ở tầng cơ sở dữ liệu                                                                                           | Trung bình | Bảo        |
| CN-13 | Chuẩn hóa chuỗi và khớp mờ                                          | Kỹ thuật | Hiện thực `LT-14` cho nhận diện nhà cung cấp                                                                              | Hàm chuẩn hóa chuỗi + bảng ngưỡng khớp mờ, chạy thử trên tập tên nhà cung cấp thật                                                                                                  | Trung bình | Bảo        |
| CN-14 | Sinh câu trả lời có truy hồi tài liệu                               | Kỹ thuật | Trợ lý tra cứu hợp đồng — **tùy chọn**                                                                                    | Bản thử nghiệm nhỏ có trích dẫn đoạn nguồn + kết luận có giữ trong phạm vi hay không                                                                                                | Thấp       | Đăng       |
| CN-15 | Hệ thống thành phần giao diện, trạng thái rỗng và khả năng tiếp cận | Kỹ thuật | Bốn thành phần mang nghiệp vụ ở UI Spec; bốn loại trạng thái rỗng; tương phản và điều hướng bàn phím                      | Thư viện thành phần trong Figma đặt tên thống nhất với UI Spec + checklist tương phản và điều hướng bàn phím áp được cho mọi màn hình                                               | Cao        | Phú        |
| CN-16 | Trực quan hóa dữ liệu và biểu diễn mức độ không chắc chắn           | Kỹ thuật | Hiển thị hai con số tiết kiệm tách biệt, mức tin cậy, và bốn trạng thái đánh giá được — hiện thực `LT-8` ở tầng giao diện | Quy ước hiển thị: màu và nhãn cho bốn trạng thái đánh giá được, cách vẽ mức tin cậy, và bố cục đặt hai con số tiết kiệm cạnh nhau mà giao diện không cho phép cộng lại              | Trung bình | Ân + Phú   |
| **CN-17** | **Tiện ích trình duyệt** — demo bằng *load unpacked*; **chính sách cài bắt buộc** là thiết kế triển khai, điều kiện còn mở ở BRD `OQ-18` (`QĐ-28b`) | Kỹ thuật | Hiện thực `FR-4.17`, `FR-4.18`: lọc tại máy theo danh sách cho phép, đo thời gian tab đang dùng khi không rảnh, gửi bản tổng hợp theo ngày | Tiện ích chạy được trên máy nhóm + bộ test phủ định: tên miền ngoài danh sách, ứng dụng liên lạc, và dữ liệu trước khi xác nhận **đều không rời khỏi máy**; ghi rõ trình duyệt hỗ trợ (`OQ-17`) | **Cao** | **Phú** tiện ích · **Bảo** endpoint nhận dữ liệu |
| **CN-18** | Agent kiểm kê và đo thời gian ứng dụng desktop — **hiện thực mức demo** (`QĐ-31b`) | Kỹ thuật | `FR-4.19` chạy trong phiên người dùng; `Gap` = không quan sát được | Prototype Go + C# có E2E và phiên người thật (evidence 5c–5e); ActivityWatch không dùng *(mặc định ghi tiêu đề cửa sổ)* | Trung bình | Người làm Agent (`SD-11`) |

> **`CN-8`, `CN-17`, `CN-18` thuộc giai đoạn Tools & Vendor** (`QĐ-59a`, `QĐ-59e`): nghiên cứu sau khi xong Requirements, sơ đồ, ERD và User Stories. Nội dung ba dòng trên là giả định hiện tại; đặc tả chi tiết ở [tệp nghiên cứu tool & vendor](../Research-AI/tool-vendor-usage-research-backlog.md).

> **CN-2, CN-7, CN-9 và CN-8** là những phần ít gặp trong đồ án thông thường, nên đáng nói khi bảo vệ.
>
> **`CN-11` ưu tiên Cao.** Lý do: `ADR-11` chốt NestJS kèm điều kiện ràng buộc *"lớp truy cập dữ liệu phải cho phép chạy migration SQL thuần"*, vì phần lớn trong **hai mươi** bất biến được ràng buộc ở tầng cơ sở dữ liệu (BRD mục 5.12.2, `ADR-11`). Nếu `CN-11` làm muộn, nhóm sẽ phát hiện ORM không hỗ trợ đúng lúc đã viết xong nhiều migration.

### 6.4. Lý thuyết nâng cao hoặc có điều kiện

Các nội dung dưới đây **không** là trọng tâm MVP. Cột cuối ghi rõ quyết định đã chốt trong BRD, để tránh nói nhẹ hơn hoặc nặng hơn thực tế.

| Nội dung                                       | Điều kiện áp dụng                                                    | Trạng thái trong đề tài                                                                                                                            |
| ---------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mô hình xu hướng cho dự báo chi phí            | Tối thiểu 12 tháng dữ liệu **và** sai số kiểm chứng lùi trong ngưỡng | ⏸️ **Hoãn** (`QĐ-25`) — cổng kiểm chứng **FR-5.7** giữ làm đặc tả, **không hiện thực trong MVP**. L1 và L3 vẫn hiện thực |
| Học máy cho phát hiện lãng phí                 | —                                                                    | ❌ **Không dùng, có lý do.** Không phải vì thiếu dữ liệu, mà vì nhãn đã xác định sẵn, quyết định cuối do người, và cần giải thích được — **ADR-09** |
| Học máy cho phân loại mô tả giao dịch          | Kết quả luôn ở mức tin cậy thấp và bắt buộc người xác nhận           | ✅ **Trong phạm vi** (`QĐ-32a`) — mô hình ngôn ngữ **gợi ý** nhà cung cấp cho mục review mà luật không có ứng viên duy nhất, **FR-6.5**; chỉ hiện khi cấu hình model đã qua cổng chất lượng (`QĐ-32b`, `QĐ-37b`: cấu hình định triển khai phải PASS cả `heldout-v4` và `heldout-v5`; chưa cấu hình nào đạt ⟹ gợi ý ẩn); tắt AI thì hàng đợi thủ công chạy đủ; `US-15-01` giữ nguyên, đang ẩn, không đưa vào phần trình bày (`QĐ-49e`) |
| Mô hình ngôn ngữ cho **tóm tắt request đang chờ của Manager** và **bản nháp diễn giải báo cáo chi phí của Finance** | Chỉ dùng dữ liệu trong phạm vi vai; backend tính mọi con số; có nguồn dẫn; Finance xem và sửa bản nháp; quy trình chạy đủ khi AI tắt/lỗi | ✅ **Trong phạm vi cam kết** *(`QĐ-49e`, `QĐ-61e`)* — **chưa hiện thực, chưa kiểm chứng model**; điều kiện gửi dữ liệu tới nhà cung cấp model chưa đánh giá (`OQ-26`) nên chưa gọi model với dữ liệu thật; BRD mục 6.4. Các tính năng AI khác trong `AI_FEATURES_PLAN.md` **không** thuộc MVP; hỏi đáp hợp đồng vẫn là mở rộng |
| Sinh câu trả lời có truy hồi tài liệu          | Tài liệu đã được cấp quyền, bắt buộc trích dẫn đoạn nguồn            | ⏸️ **Mở rộng — hoãn**, Owner không chọn ngày 09/10/2026 (`QĐ-61e`); bản đăng ký nêu tính năng này cùng phân loại giao dịch nên ghi là điểm lệch L-6 (BRD Phụ lục C.0) |
| Phát hiện từ nhật ký truy cập web, proxy, CASB **đầy đủ** | —                                                                    | ❌ **Ngoài phạm vi hoàn toàn.** Ba lý do tại **BRD mục 5.6.1**: vướng khung pháp lý, không có hạ tầng kiểm chứng, giá trị không tương xứng rủi ro   |
| **Tiện ích trình duyệt trên máy công ty** | Máy công ty cấp; nhân viên đã xác nhận; lọc tại máy | ✅ **Hiện thực** — `FR-4.17`, `FR-4.18`, `ADR-13`. Khác log web đầy đủ ở chỗ máy chủ không bao giờ nhận truy cập ngoài danh sách cho phép |
| **Agent trên máy công ty** | Như trên | ✅ **Hiện thực mức demo** (`QĐ-31b`) — `FR-4.19`, chạy trong phiên người dùng; Windows Service/installer/updater vẫn ngoài phạm vi |
| **OpenTelemetry của client AI** | Client được công ty cấu hình trên thiết bị đã đăng ký | ✅ **Hiện thực mức demo** — `FR-4.20`; chỉ là bằng chứng dương, chủ bản ghi theo credential thiết bị + binding |
| **Tiện ích trình duyệt làm nguồn phát hiện ngoài danh mục** | Như tiện ích | ⏸️ **Giai đoạn sau** — `QĐ-31a`; tiện ích vẫn là nguồn usage của `MF-3` |

> **Nguyên tắc chung của đề tài:** khi dữ liệu hoặc điều kiện kiểm chứng chưa đủ, hệ thống **không đưa ra kết luận trông có vẻ chính xác nhưng không đáng tin cậy**. Nguyên tắc này áp dụng cho cả dự báo, phát hiện lãng phí và phát hiện ngoài danh mục.
>
> **Bốn dòng bộ thu thập ở bảng trên là giả định hiện tại** (`QĐ-20`, `QĐ-31`). Loại bộ thu thập và mức hiện thực chốt lại ở giai đoạn Tools & Vendor, theo logic nghiên cứu GVHD đã sửa (`QĐ-57d`, `QĐ-59a`) — [tệp nghiên cứu tool & vendor](../Research-AI/tool-vendor-usage-research-backlog.md).

### 6.5. Thứ tự ưu tiên nghiên cứu

Bám theo thứ tự phát triển của **bốn chuỗi demo `D-1` → `D-4` tại mục 5.3 của chính tài liệu này**, trong cửa sổ phát triển thật **T1–T9** (`RB-1` — BRD mục 1 và mục 9). Lịch chính thức chờ kế hoạch do GVHD giao.

| Đợt           | Chủ đề                                                                                                               | Ai           | Cần xong trước                                                                             |
| ------------- | -------------------------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------ |
| 1             | `LT-1`, `LT-2` quản trị SaaS và vòng đời license · `LT-16` thiết kế theo miền nghiệp vụ · **`CN-11` ràng buộc CSDL** | Phi          | **Tuần 1** — trước khi viết migration đầu tiên (GĐ-0 ở T1–T2)                              |
| 2             | `LT-3`, `LT-5` quản trị truy cập và phân tách trách nhiệm · `CN-1`, `CN-3`, `CN-4`                                   | Bảo          | **Tuần 1** — GĐ-0 làm phân quyền ngay ở T1–T2                                              |
| 3             | `LT-4`, `LT-15` phê duyệt nhiều tầng và máy trạng thái · `CN-15` thành phần giao diện                                | Ân, Phi, Phú | **Cuối Tuần 4** — chuỗi D-1 bắt đầu ở T5                                                   |
| 4             | `LT-14` đối sánh thực thể · `LT-7` chất lượng dữ liệu · `CN-7`, `CN-8`, `CN-13`                                      | Bảo          | **Cuối Tuần 7** — chuỗi D-2 bắt đầu ở T8                                                   |
| 5             | `LT-8` hệ dựa trên luật · `LT-12` đánh giá sai số · `CN-16` biểu diễn không chắc chắn                                | Phi, Phú, Ân | **Cuối Tuần 7** — rule engine đầy đủ nằm trong T8–T9                                       |
| 6             | `LT-9`, `LT-11` kế toán và đa tiền tệ · `LT-6` Shadow IT                                                             | Ân, Phi      | **Cuối Tuần 7** — chuỗi D-4 chạy **song song** trong T8–T9                                 |
| **Song song** | **`LT-10` bảo vệ dữ liệu cá nhân · `LT-13` pháp luật viễn thông**                                                    | **Bảo**      | **Chạy song song từ Tuần 1** — không phụ thuộc tiến độ code, cần thời gian đọc văn bản gốc |

> ⚠️ **Căn cứ của hạn Đợt 5 và Đợt 6 — hiệu lực hiện hành.** Cửa sổ phát triển thật là **T1–T9** (`RB-1`), rule engine đầy đủ và bảng tài chính nằm trong **T8–T9**, còn chuỗi `D-4` chạy **song song**. Vì điều kiện 4 của mục 6.6 buộc mỗi đợt nghiên cứu phải *tạo ra artifact dùng khi hiện thực*, hai đợt này phải xong **cuối T7**; đặt muộn hơn thì `LT-8`, `LT-9`, `LT-11` kết thúc **sau** khi tính năng tương ứng đã phải chạy được, tức nghiên cứu không còn sửa được thiết kế.
>
> **Đợt song song** đặt cuối bảng chỉ vì nó không nằm trong trình tự phụ thuộc, **không phải vì ưu tiên thấp**. Nó độc lập với tiến độ lập trình nên bắt đầu được ngay từ Tuần 1.
>
> **Hạn thật của đợt này là mốc chốt thiết kế thu thập dữ liệu và quyền riêng tư**, không phải mốc bắt đầu viết code phân hệ 5.11. Lý do: `LT-10` và `LT-13` quyết định **những trường dữ liệu nào được phép tồn tại** và **ứng dụng nào bị gắn cờ không thu thập** (`FR-1.8`, `ADR-10`). Hai thứ đó phải chốt **trước khi** lược đồ dữ liệu và cấu hình nguồn được đóng băng — nghiên cứu xong sau thời điểm đó thì kết quả chỉ còn dùng để viết báo cáo, không sửa được thiết kế nữa. Người nhận việc đã được chỉ định cụ thể tại mục 6.2.1 để tránh tình trạng ai cũng nghĩ người khác làm.
>
> **`CN-11` nằm ở Đợt 1** cùng `LT-16`, vì `ADR-11` đặt điều kiện các bất biến phải ràng buộc ở tầng CSDL — cần biết PostgreSQL làm được gì trước khi viết migration đầu tiên, không phải sau.

### 6.6. Thế nào là nghiên cứu xong một chủ đề

Một chủ đề `LT-x` hoặc `CN-x` chỉ được đánh dấu **hoàn thành** khi đủ cả bốn điều kiện sau. Thiếu một điều kiện thì chủ đề vẫn ở trạng thái *đang làm*, kể cả khi người phụ trách đã đọc xong tài liệu.

| #     | Điều kiện                                                                                                                                         | Kiểm tra bằng cách nào                                                                        |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **1** | Có **nguồn tham khảo đáng tin cậy** — tiêu chuẩn, văn bản pháp luật, sách chuyên khảo, bài báo khoa học hoặc tài liệu chính thức của nhà cung cấp | Nguồn ghi được vào Phần VIII kèm ngày truy cập; không nhận nguồn là trang tổng hợp trung gian |
| **2** | **Tóm tắt được nguyên tắc áp dụng** bằng ngôn ngữ của người viết, không chép lại định nghĩa                                                       | Người phụ trách trình bày trong 3 phút ở buổi họp tuần, nhóm hỏi lại được                     |
| **3** | **Chỉ ra được quyết định thiết kế hoặc yêu cầu hệ thống chịu ảnh hưởng** — dẫn đúng mã `FR-x`, `ADR-x`, `INV-x`, `BR-x` hoặc `F-x`                | Mã dẫn chiếu tồn tại thật trong BRD hoặc User Flows                                           |
| **4** | **Tạo ra được artifact hoặc test case dùng khi hiện thực** — đúng phần *Kết quả cần tạo ra* đã ghi ở mục 6.2 và 6.3                               | Artifact nằm trong repo hoặc trong tài liệu nhóm, có thể mở ra xem                            |

**Bốn điều kiện này áp dụng cho ai.** Áp đủ cả bốn cho **16 chủ đề lý thuyết** và cho **13 chủ đề kỹ thuật có yếu tố chưa biết trước**: `CN-1` `CN-2` `CN-7` `CN-8` `CN-9` `CN-11` `CN-12` `CN-13` `CN-14` `CN-15` `CN-16` `CN-17` `CN-18`.

Năm chủ đề còn lại — `CN-3` JWT, `CN-4` phân quyền tầng API, `CN-5` REST API, `CN-6` hàng đợi, `CN-10` lưu trữ đối tượng — là **công nghệ phổ thông, tài liệu đầy đủ, không phải trọng tâm nghiên cứu độc lập của đề tài**. Với nhóm này, điều kiện 2 không bắt buộc và "artifact" chính là **code chạy được kèm test**, đúng phần *Kết quả cần tạo ra* đã ghi ở bảng mục 6.3. Bắt viết báo cáo nghiên cứu cho JWT chỉ tạo ra giấy tờ không ai đọc, và làm loãng phần nghiên cứu thật.

> **Vì sao đặt điều kiện 4:** đây là điều kiện phân biệt nghiên cứu phục vụ hiện thực với nghiên cứu chỉ để viết báo cáo. Một chủ đề dừng ở mức "đã đọc và hiểu" nhưng không để lại thứ gì dùng được khi code thì thực tế chưa tạo ra giá trị nào cho dự án.
>
> Điều kiện 3 cũng là cơ chế tự phát hiện chủ đề thừa: nếu một chủ đề không dẫn được về bất kỳ mã yêu cầu nào, hoặc chủ đề đó nằm ngoài phạm vi, hoặc BRD đang thiếu một yêu cầu. Cả hai trường hợp đều cần xử lý chứ không bỏ qua.

### 6.7. Ánh xạ lý thuyết sang công nghệ hiện thực

Bảng này dùng khi viết chương "công nghệ áp dụng" trong báo cáo: mỗi lựa chọn công nghệ phải chỉ ra nó hiện thực lý thuyết nào.

| Lý thuyết                                              | Chuẩn liên quan                | Công nghệ hiện thực                                                                                                              |
| ------------------------------------------------------ | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `LT-3` quản trị truy cập, `LT-5` phân tách trách nhiệm | OAuth 2.0, OpenID Connect, JWT | **NestJS** — guard ở tầng API; xác thực nội bộ do backend quản lý (`QĐ-46`; phiên/token theo BE ADR-0010 — `QĐ-47`). OAuth/OIDC chỉ còn dùng để đọc dữ liệu cấp quyền phục vụ discovery (`CN-1`) |
| `LT-4`, `LT-15` phê duyệt và máy trạng thái            | —                              | Bảng chính sách cấu hình được; hàng đợi tác vụ nền trên Redis                                                                    |
| `LT-16` thiết kế theo miền nghiệp vụ                   | —                              | **NestJS** — mỗi ranh giới ngữ cảnh `C1` → `C8` là một module; tổ chức Công ty → Phòng ban → Chức vụ → Nhân viên (`QĐ-52`); PostgreSQL; migration; ràng buộc loại trừ và chỉ mục có điều kiện |
| `LT-7` chất lượng dữ liệu, `LT-14` đối sánh thực thể   | —                              | Trình đọc CSV/Excel; chuẩn hóa chuỗi; hàng đợi xử lý; bảng ánh xạ danh tính                                                      |
| `LT-8` hệ dựa trên luật                                | —                              | Rule engine tự viết, cấu hình ngưỡng theo phạm vi                                                                                |
| `LT-1`, `LT-2` quản trị SaaS và cấp phát               | SCIM 2.0, REST API             | Cổng cấp phát hai kênh; kết nối demo                                                                                             |
| `LT-2`, `LT-9`, `LT-11` chi phí và đa tiền tệ          | —                              | PostgreSQL kiểu số thập phân; bảng tỷ giá; React và thư viện biểu đồ                                                             |
| `LT-10` bảo vệ dữ liệu cá nhân                         | —                              | Nhật ký chỉ ghi thêm; URL có thời hạn; tác vụ xóa theo chính sách; quản lý khóa bí mật                                           |
| `LT-12` đánh giá sai số dự báo                         | —                              | Hàm kiểm chứng lùi trong rule engine                                                                                             |

> Trong báo cáo, trình bày **lý thuyết trước, công nghệ sau**. Một lựa chọn công nghệ không gắn được với lý thuyết nào là dấu hiệu lựa chọn theo thói quen chứ không theo yêu cầu.

#### 6.7.1. Quyết định kỹ thuật

> Mã **`QĐKT-xx`** là quyết định kỹ thuật, tách khỏi sổ quyết định dự án `QĐ-xx` (`Docs/Decisions/project-decisions.md`). Ba mã đầu từng mang mã một chữ số `QĐ-1` → `QĐ-3` và đã đổi tiền tố ngày 08/09/2026 để không trùng với `QĐ-01` → `QĐ-09`.

Mỗi lựa chọn kỹ thuật còn treo được quản lý như một quyết định có chủ, có hạn và có tiêu chí — để tới giữa kỳ không bị hỏi *"cuối cùng em dùng cái nào?"* mà không có câu trả lời.

| #        | Quyết định                | Lựa chọn                                                  | Chủ         | Hạn chốt                                                      | Tiêu chí quyết định                                                                                                                 | Đầu ra                                                          |
| -------- | ------------------------- | --------------------------------------------------------- | ----------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **QĐKT-01** | Framework backend         | ✅ **Đã chốt: NestJS** (31/08/2026)                        | `R1` + `R2` | *Đã xong — chốt đúng hạn, trước khi dựng khung dự án backend* | Ba tiêu chí đã áp: năng lực sẵn có của nhóm; hệ sinh thái cho kiểm tra dữ liệu đầu vào, phân quyền và tác vụ nền; mức dễ triển khai | **`ADR-11` của BRD**                                            |
| **QĐKT-02** | Xác thực người dùng | ✅ **Xác thực nội bộ do backend quản lý** — email/mật khẩu, lời mời dùng một lần (`QĐ-46`, BE ADR-0010); thay hướng OIDC + Keycloak tự host chốt 02/10/2026 (`QĐ-39`, BE ADR-0002/ADR-0006) | `R2` | *Đã chốt* | Owner chọn chủ động quản lý tài khoản trong hệ thống, đổi lại phải xây đủ lời mời, đặt lại mật khẩu, thu hồi phiên và kiểm thử | BE ADR-0010; BRD `FR-8.6`/`FR-8.11`; `OQ-15` đã đóng; sổ `QĐ-46`, `QĐ-47` — *quyết định của Owner, chưa phải xác nhận của GVHD* |
| **QĐKT-03** | Thư viện biểu đồ frontend | Chưa chọn                                                 | `R4` + `R5` | Trước Tuần 5, khi bắt đầu màn hình báo cáo                    | Hỗ trợ biểu diễn mức không chắc chắn theo `CN-16`; dung lượng gói; khả năng tiếp cận                                                | Ghi vào UI Spec                                                 |
| **QĐKT-05** | Đường gọi mô hình AI | ✅ **Cổng `VendorSuggestionPort` + adapter giao thức OpenAI-compatible** (model local qua llama.cpp hoặc nhà cung cấp hosted; adapter Anthropic giữ khi có ngân sách) + **cổng chất lượng** trên tập giữ lại trước khi hiện gợi ý (29/09/2026) | Trợ lý, theo ủy quyền của Owner (`QĐ-32`) | *Đã chốt; đổi nhà cung cấp là đổi cấu hình* | Model local 4B/8B chạy được với 0 đồng nhưng trượt cổng; free tier do Owner chọn cho demo chỉ nhận dữ liệu tổng hợp | Evidence 5f; `QĐ-32b` |
| **QĐKT-04** | Ngôn ngữ Desktop Agent | ✅ **Go** (28/09/2026) — C# giữ làm đối chứng lịch sử | Trợ lý, theo ủy quyền của Owner (`QĐ-31`) | *Đã chốt; nhóm được đổi nếu có lý do bảo trì mới* | Cùng hợp đồng và cùng 12/12 E2E như C#; 7,3 vs 35,9 MiB; CPU thấp hơn rõ; không cần runtime; nhóm có kinh nghiệm Go (`SD-11`); đã có đọc nguyên nhân `Gap` từ System log | Evidence 5b–5e; `QĐ-31` |

> Các quyết định trên **không chặn** phần nghiệp vụ: mô hình dữ liệu, máy trạng thái và luật phát hiện đều độc lập với framework. Nêu rõ điều này khi bị hỏi, thay vì trả lời "nhóm chưa quyết".
>
> Khi bị hỏi *"vì sao không dùng dịch vụ định danh ngoài?"*, trả lời theo BE ADR-0010 mục *Alternatives*. Owner cho biết mentor đồng ý flow này — xác nhận do Owner cung cấp, **chưa phải xác nhận của GVHD**.

### 6.8. Đoạn tóm tắt dùng trong đề cương

> Đề tài nghiên cứu các lý thuyết về quản lý tài sản phần mềm và vòng đời license; quản trị SaaS và quản lý tài chính công nghệ, bao gồm hai cơ sở ghi nhận chi phí và xử lý đa tiền tệ; quản trị định danh, kiểm soát truy cập theo vai trò, phê duyệt nhiều tầng và phân tách trách nhiệm; mô hình hóa quy trình bằng máy trạng thái hữu hạn; đối sánh thực thể và chất lượng dữ liệu; hệ ra quyết định dựa trên luật có tính giải thích được và phương pháp đánh giá sai số dự báo; thiết kế theo miền nghiệp vụ; phát hiện phần mềm ngoài danh mục dựa trên bằng chứng; cùng khung pháp lý về bảo vệ dữ liệu cá nhân của người lao động. Các lý thuyết này là cơ sở để thiết kế một hệ thống quản trị SaaS tập trung, minh bạch chi phí, kiểm soát quyền truy cập và hỗ trợ ra quyết định dựa trên dữ liệu có thể giải trình.

### 6.9. Các vấn đề cần tiếp tục kiểm chứng

Đây không phải danh sách việc chưa làm, mà là **sổ theo dõi trạng thái kiểm chứng**. Bốn trạng thái được dùng thống nhất:

| Trạng thái  | Nghĩa là gì                                                         |
| ----------- | ------------------------------------------------------------------- |
| `Open`      | Chưa có câu trả lời, còn phải làm để biết                           |
| `Validated` | Đã kiểm chứng tại nguồn gốc và ghi lại được nguồn                   |
| `Resolved`  | Đã chốt thành một quyết định trong BRD hoặc tài liệu thiết kế       |
| `Deferred`  | Cố ý gác lại, có lý do, và đã có biện pháp để nó không chặn tiến độ |

| #   | Vấn đề                                                                               | Trạng thái   | Người          | **Hạn hoặc mốc quyết định**                                                                        | Căn cứ hoặc bước tiếp theo                                                                                                                     | Chặn gì                                                             |
| --- | ------------------------------------------------------------------------------------ | ------------ | -------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| 1   | Zoom và Notion có bản xuất dữ liệu hoạt động theo từng người không                   | ✅ `Validated` | —            | **Đã xong 14/09/2026**                                                                             | Zoom: có từ gói Pro, nhưng mang cờ liên lạc nên không thu. Notion: chỉ gói Enterprise. Ghi ở ma trận BRD 6.3.1, đóng `OQ-14`                  | Không                                                               |
| 2   | Ngưỡng khớp của tầng ánh xạ danh tính đặt ở mức nào | `Deferred` | Bảo | **Giai đoạn Tools** | Chuyển sang backlog `T-04` của [tệp nghiên cứu tool & vendor](../Research-AI/tool-vendor-usage-research-backlog.md) (`QĐ-59c`); chốt sau khi chạy `LT-14`, `CN-13` trên dữ liệu thật | **Chặn `TC-2`**, không chặn Requirements |
| 3a  | **Framework backend**                                                                | ✅ `Resolved` | —              | **Đã chốt 31/08/2026**                                                                             | **NestJS** — ghi thành `ADR-11` của BRD; BRD mục 6.1 đã cập nhật                                                                               | Không                                                               |
| 3b  | Thư viện biểu đồ *(xác thực đã chốt — `QĐKT-02`)* | `Open` | `R4` `R5` | Theo bảng `QĐKT-03` tại mục 6.7.1 | Xem tiêu chí quyết định tại mục 6.7.1; BRD `OQ-15` đã đóng | Không chặn phần nghiệp vụ |
| 4   | Microsoft 365 và Atlassian có xuất được ngày hoạt động cuối theo từng người không    | `Validated`  | —              | Đã xong 29/08/2026                                                                                 | Đã tra tại tài liệu chính thức, ghi ở ma trận BRD mục 6.3.1 — nguồn 8 và 9 tại Phần VIII                                                       | Không                                                               |
| 5   | Nghị định 356/2025/NĐ-CP thay thế Nghị định 13/2023/NĐ-CP kể từ 01/01/2026           | `Validated`  | —              | Đã xong 29/08/2026                                                                                 | Đã tra tại Công báo và cổng văn bản Chính phủ — nguồn 11 và 12 tại Phần VIII                                                                   | Không. Khoản nợ `ND-1` phát sinh từ đây **đã hết đối tượng** ở v1.1 |
| 6   | Bộ dữ liệu thật để kiểm chứng tầng ánh xạ danh tính                                  | `Resolved`   | —              | Đã chốt                                                                                            | Dùng **lịch sử commit** các repo của org GitHub dự án (`QĐ-28a`), đọc theo **mọi nhánh**, khử trùng repo + SHA (`QĐ-36a`; đọc có xác thực đã kiểm chứng ở prototype 01/10/2026)                                                                                             | Không                                                               |
| 7   | Thời hạn lưu giữ dữ liệu bao lâu là phù hợp                                          | `Resolved`   | —              | Đã chốt                                                                                            | BRD mục 7.5 và `FR-10.6`                                                                                                                       | Không                                                               |
| 8   | Ứng dụng nhắn tin và họp trực tuyến có thuộc nhóm dữ liệu nhạy cảm không             | `Deferred`   | Ân             | Mở lại chỉ khi phạm vi thay đổi                                                                    | Không đóng được bằng đọc văn bản (`OQ-12`). Đã vô hiệu hóa bằng `ADR-10` — mặc định không thu thập, nên câu hỏi không cần trả lời để chạy tiếp | Không                                                               |
| 9   | Có nên đưa `CN-14` sinh câu trả lời có truy hồi tài liệu vào phạm vi không           | `Deferred`   | Nhóm trưởng    | **Mốc kiểm tra Tuần 11**                                                                           | Chỉ quyết sau khi phân hệ lõi chạy được — BRD mục 6.4                                                                                          | Không                                                               |
| 10  | **Soạn lại tài liệu thiết kế kỹ thuật thay cho bộ Domain Spec đã gỡ** | `Open`       | Phi            | **Khi bắt đầu giai đoạn hiện thực**, không cần cho buổi báo cáo đầu                                | Khung đã có ở BRD mục 5.12. Việc còn lại là lược đồ bảng chi tiết và bảng chuyển trạng thái đầy đủ cho chín vòng đời                  | Không chặn báo cáo; chặn giai đoạn viết migration nếu để quá muộn   |
| 11  | **Thông báo + xác nhận chủ động có thay được sự đồng ý theo Điều 11 Luật 91/2025 cho bộ thu thập không** | `Deferred` | Bảo | **Mở lại khi có ý kiến GVHD hoặc chuyên gia pháp lý** | BRD `OQ-16`, mục 10.3 (`QĐ-59b`). Thiết kế đã chọn mức an toàn: không nhận dữ liệu khi chưa xác nhận, có yêu cầu dừng. Báo cáo cuối **không** tuyên bố *đã tuân thủ* | Chặn **phát biểu tuân thủ**, không chặn code |
| 12  | **GVHD chấp nhận các điểm lệch so với bản đăng ký** — bộ thu thập trên máy, đăng nhập nội bộ, Người duyệt chi, bỏ Team | `Open` | Phi | **Buổi gặp GVHD gần nhất** | Báo cáo và mẫu biên bản đã soạn: `Decisions/bao-cao-lech-ban-dang-ky-2026-10-08.md`; danh sách ở BRD Phụ lục C.0 (`QĐ-60d`). Bước tiếp: gặp GVHD, ghi biên bản, ghi kết luận vào sổ quyết định | Không chặn |
| 13  | **Nghiên cứu phương pháp thu thập usage** — công cụ kiểm tra usage/report; nhà cung cấp có cấp dữ liệu không, ở gói nào (`QĐ-57d`) | `Deferred` | Phi | **Giai đoạn Tools** — sau khi nhận bản sửa logic của GVHD | Backlog `T-01` của [tệp nghiên cứu tool & vendor](../Research-AI/tool-vendor-usage-research-backlog.md) (`QĐ-59a`) | Chặn: danh sách SaaS demo, báo cáo hiệu quả sử dụng sau khi cấp, cảnh báo cho Employee dựa trên usage — **không** chặn Requirements |
| 14  | **Quy định thuế khi mua SaaS/phần mềm trong nước và nước ngoài** (`QĐ-55a`, `QĐ-60a`, `QĐ-60b`) | `Validated` | — | **Đã xong 08/10/2026** | Đã đọc bản gốc Luật 48/2024 (Điều 4, 5, 9, 14), Nghị định 252/2026 (Điều 40, 43, 44), Thông tư 69/2025 — ghi chú `Decisions/tax-saas-purchase-research-2026-10-08.md`; BRD `OQ-22` đóng. Điểm còn diễn giải khác nhau không đổi thiết kế vì Finance nhập tỷ lệ | Không |
| 15  | **Chính sách thiết bị khi nhận máy công ty** — văn bản ký *xác nhận đã biết rõ* có đủ làm căn cứ không (`QĐ-57b`, `QĐ-58f`) | `Deferred` | Bảo | **Mở lại khi có ý kiến GVHD hoặc chuyên gia pháp lý** | BRD `FR-4.21`, `OQ-23`, mục 10.3 (`QĐ-59b`). Hệ thống không chặn kỹ thuật; vi phạm do doanh nghiệp xử lý ngoài phạm vi; vẫn thực hiện yêu cầu dừng | Chặn **phát biểu tuân thủ**, không chặn code |

> **Cách dùng bảng này khi bảo vệ:** nếu bị hỏi một câu chưa có lời giải, chỉ vào đúng dòng và nói **trạng thái, người phụ trách và hạn**. Một vấn đề `Open` có chủ, có hạn và có bước kế tiếp thì không phải lỗ hổng; một vấn đề để mở vô thời hạn mới là lỗ hổng.
>
> Mọi dòng `Open` đều phải có ô hạn được điền. Nếu một vấn đề không đặt được hạn thì nó không thuộc bảng này — hoặc nó là `Deferred` có điều kiện mở lại, hoặc nó chưa đủ rõ để theo dõi.

---

## PHẦN VII — Tài liệu liên quan

| Tài liệu | Vai trò | Trạng thái |
| -------- | ------- | ---------- |
| Bản đăng ký `SU26SE166` (mã bản đăng ký cũ; mã dự án `FA26SE174`, mã nhóm `GFA26SE125` — `QĐ-62r`) | Ràng buộc gốc, có chữ ký GVHD | Đã nộp |
| **BRD v3.35** | **Nguồn chân lý duy nhất** — phạm vi, yêu cầu, mô hình miền nghiệp vụ, quyết định kiến trúc | Hiện hành *(12/10/2026 — `QĐ-61` → `QĐ-66`)* |
| **Tài liệu này** | WHY / WHAT / WHO và định hướng nghiên cứu | **v1.24 — đồng bộ BRD v3.35** |
| **Sổ quyết định dự án** | `Docs/Decisions/project-decisions.md` — `QĐ-01` → `QĐ-66` | Nguồn thẩm quyền cao nhất |
| **Ghi chú thuế khi mua SaaS/phần mềm** | Văn bản đã kiểm chứng, ba hồ sơ thuế theo ai nộp, cơ sở chi phí thực chịu, ví dụ tính — `Decisions/tax-saas-purchase-research-2026-10-08.md` | 08/10/2026 — đã đối chiếu văn bản gốc |
| **Báo cáo lệch so với bản đăng ký** | Bốn điểm lệch L-1 → L-4, lý do, mẫu biên bản làm việc với GVHD — `Decisions/bao-cao-lech-ban-dang-ky-2026-10-08.md` | Soạn 08/10/2026; chờ gặp GVHD |
| **Nghiên cứu pháp lý và nhà cung cấp** | Điều khoản Luật 91/2025, ma trận 11 nhà cung cấp, danh mục demo — `Research-AI/usage-tracking-legal-vendor-research-2026-09-14.md` | 14/09/2026; ⚠️ phần phương pháp usage **đang nghiên cứu lại** (sổ 6.9 dòng 13) |
| **Nghiên cứu tool & vendor (bổ sung sau)** | Bộ thu thập cụ thể, ma trận nhà cung cấp, chiến lược chứng minh, kịch bản nguồn của `D-2`; backlog kỹ thuật `T-01` → `T-09` — [tool-vendor-usage-research-backlog.md](../Research-AI/tool-vendor-usage-research-backlog.md) | Tách ra ngày 08/10/2026 (`QĐ-59a`); làm ở giai đoạn Tools |
| **WHY · WHAT · WHO** (bản nộp A4) | Bản trình bày rút gọn cho buổi báo cáo | v2.4 — ⚠️ lỗi thời; làm lại sau khi vẽ lại sơ đồ (`QĐ-59d`) |
| **User Flows nghiệp vụ** | **48** luồng `F-xx` *(`42 / 4 / 2` — mục 5.2)* — [business-flow-catalog.md](../Diagrams/user-flows/business-flow-catalog.md) | v0.13 — ⚠️ chưa đồng bộ `QĐ-49d`, `QĐ-52` → `QĐ-58` |
| **Bộ sơ đồ nghiệp vụ** *(index chung)* | Thứ tự đọc Context → FDD → 5 main flow → workflow → user flow, truy vết — [Diagrams/index.md](../Diagrams/index.md) | Vẽ lại 08–09/10/2026; đồng bộ `QĐ-61` → `QĐ-66` ngày 10–12/10/2026 (BRD v3.35); chờ Owner/GVHD xem |
| **Context Diagram** | DFD mức 0 — 8 tác nhân; số luồng đếm tại [context-diagram/index.md](../Diagrams/context-diagram/index.md) | v3.0 — 08/10/2026 |
| **Business Workflows** | 24 activity diagram có swimlane, `WF-01` → `WF-20` (kể cả `WF-09a`, `WF-12a`, `WF-13a`, `WF-17a`) — [index](../Diagrams/workflows-activity-diagram/index.md) | Vẽ lại 08/10/2026; cập nhật tới `QĐ-66` ngày 12/10/2026 (`WF-15`, `WF-09a`) |
| **Main Business Flows** *(bộ sơ đồ trình bày)* | `MF-2`, `MF-7`, `MF-5`, `MF-8`, `MF-4`; `MF-3` phụ lục; `MF-1` nền; `MF-6` bổ sung — [index](../Diagrams/main-workflows-activity-diagram/index.md) | Vẽ lại 08/10/2026; cập nhật tới `QĐ-66` ngày 12/10/2026 (`MF-4`) |
| **User Flows — luồng màn hình** | 21 luồng `UF-01` → `UF-21`, đầu vào để FE dựng Figma (mã màn hình là đề xuất, `QĐ-08`) — [index](../Diagrams/user-flows/index.md) | 08/10/2026 — vẽ lại theo `QĐ-52` → `QĐ-60` |
| **User Stories** | 146 mã Story (143 dùng), 1 399 tiêu chí chấp nhận và truy vết — [user-stories-and-epics.md](../BE-UserStory/user-stories-and-epics.md) | **v0.15** (11–12/10/2026) — đồng bộ `QĐ-49` → `QĐ-66`; Use Case chưa đồng bộ (hoãn phiên sau) |
| **Conceptual ERD** | `ERD/CONCEPTUAL ERD - DANH SÁCH ENTITY.md` — page `Conceptual ERD v5.1`: **21** thực thể, **42** quan hệ, **20** bất biến (hình tổng thể chốt ở `QĐ-65`; nghiệp vụ `QĐ-49` → `QĐ-66`) | 11–12/10/2026 — đã đồng bộ phòng ban, chức vụ, bất biến `INV-19`, `INV-20` |
| **Logical ERD S0** | [LOGICAL-ERD-S0.md](../ERD/logical/LOGICAL-ERD-S0.md) + `.drawio`/PNG/PDF — một tab, **42** thực thể, **103** quan hệ (`QĐ-48`) | 0.10 — ⚠️ **lỗi thời**: chưa áp `QĐ-52` → `QĐ-66` (`HO-120` → `HO-135`); thiết kế lại ở phiên sau |
| **Kế hoạch thực hiện** | Lịch 15 tuần, ba cổng review, gói công việc, phân vai | Ngoài baseline (`QĐ-26`) |
| UI Spec | **Không có bản đặc tả giao diện chi tiết hiện hành.** File `Figma UI-UX/Ui-spec.md` trùng tên là **Screen Flows v1.0 legacy** — không dùng làm nguồn (`SA-09`). Đặc tả hoãn sang giai đoạn Figma theo `QĐ-08` | Legacy / hoãn có chủ đích |

> **Đối chiếu mã giữa các tài liệu.** Mọi mã `FR`, `ADR`, `OQ`, `KPI`, `TC`, `SoD`, `INV`, `PP` và `G1`–`G4` trích dẫn trong tài liệu này phải tồn tại trong BRD; mọi mã `F-xx` phải tồn tại trong User Flows. Dãy `ADR-01` → `ADR-13` do BRD sở hữu và là duy nhất. Chạy lại phép đối chiếu mỗi lần một tài liệu lên phiên bản mới, và **đếm từng nhóm chứ không chỉ cộng tổng** — một lỗi phân loại luôn ẩn được sau một tổng đúng.

### 7.1. Nợ tài liệu

| #          | Nội dung                                                                                                                                                 | Trạng thái                                                                                                                                                          | Người | Hạn                                |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ---------------------------------- |
| **`ND-2`** | **Ma trận phân loại dữ liệu cá nhân** — mỗi trường dữ liệu ứng với một mức nhạy cảm, một cơ sở pháp lý và một thời hạn lưu | 📝 **Bản nháp đã soạn** ở **BRD mục 7.7.2** (`QĐ-60e`, 08/10/2026) — chờ nhóm review; dòng bộ thu thập cập nhật sau giai đoạn Tools | Ân review | Trước Tuần 6 |
| **`ND-3`** | **Bản mẫu thông báo minh bạch** cho người lao động và **văn bản ký khi nhận máy** `BM-06` | 📝 **Bản nháp đã soạn** ở **BRD Phụ lục D** (`QĐ-60e`) — D.1 thông báo theo `FR-10.4`, D.2 văn bản *xác nhận đã biết rõ* theo `FR-4.21`; chờ review | Ân review | Trước Tuần 6 |
| **`ND-5`** | **Soạn tài liệu thiết kế kỹ thuật** thay cho bộ Domain Spec đã gỡ — lược đồ bảng chi tiết, bảng chuyển trạng thái đầy đủ cho chín vòng đời | ⏳ **Còn mở, không chặn báo cáo.** Khung đã có ở BRD mục 5.12; lần này soạn **sau khi BRD đã ổn định** để không lặp lại tình trạng lệch                              | Phi   | Khi bắt đầu giai đoạn hiện thực    |

> **Nguyên tắc:** hai nguồn chân lý mâu thuẫn tốn kém hơn một nguồn chân lý chưa hoàn hảo — vì vậy bộ Domain Spec cũ đã gỡ và nội dung lõi nằm ở BRD mục 5.12 (hai khoản `ND-1`, `ND-4` đóng theo).
>
> **Thứ tự xử lý còn lại: `ND-2` → `ND-3` → `ND-5`.** Hai khoản đầu gắn với tiến độ `LT-10` nên đi cùng Đợt song song; `ND-5` chờ tới giai đoạn hiện thực.

---

## PHẦN VIII — Danh mục nguồn tham khảo

Mọi nguồn dưới đây đã được tra lại tại trang gốc. **Ngày truy cập 29/08/2026** áp dụng cho báo cáo ngành, văn bản pháp luật và tài liệu nhà cung cấp; tiêu chuẩn, sách chuyên khảo và bài báo khoa học ghi theo thông tin thư mục.

### 8.1. Báo cáo ngành

| #   | Nguồn                                                                                                     | Dùng ở đâu                                                                  | Ghi chú                                 |
| --- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------- |
| 1   | Zylo — *2026 SaaS Management Index*, thông cáo 29/01/2026: https://zylo.com/news/2026-saas-management-index · trang báo cáo (có biểu mẫu tải): https://zylo.com/2026-saas-management-index. Tra lại 09/10/2026 — các con số dẫn ở đây lấy từ thông cáo; bản báo cáo đầy đủ chưa đọc | Mục 1.3 — tỷ lệ 81%/15%, 36% license không dùng, 78% và 61%, 267%           | **Nguồn chính**, dữ liệu mới nhất       |
| 2   | Zylo — *2025 SaaS Management Index*, thông cáo 16/01/2025: https://zylo.com/news/2025-saas-management-index. Lưu ý: bản 2025 ghi bộ phận nghiệp vụ *chiếm* (*account for*) **70%** chi tiêu SaaS, CNTT **26,1%** — khác định nghĩa và kỳ với 81%/15% của bản 2026, **không** ghép thành xu hướng | Mục 1.3 — lãng phí 21 triệu USD/năm                                         | Dùng làm mốc so sánh theo thời gian     |
| 3   | BetterCloud — *2025 State of SaaS Trends*. https://www.bettercloud.com/monitor/2025-state-of-saas-trends/ | Mục 1.3 — 106 ứng dụng, 40/34/25 gia hạn, gần 60% lo Shadow IT, tỷ lệ 1:108 | Khảo sát khoảng 600 chuyên gia CNTT     |
| 4   | BetterCloud — *2026 State of SaaS*. https://www.bettercloud.com/monitor/the-2026-state-of-saas-report/    | Mục 1.3 — dự báo 118 ứng dụng, 22% bộ công cụ có AI, 67% lo mất dữ liệu     | Khảo sát 525 chuyên gia CNTT và bảo mật |

### 8.2. Tài liệu kỹ thuật của nhà cung cấp

| #   | Nguồn                                                                                                                                                                                                                                   | Dùng ở đâu                                                    |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 5   | Microsoft Learn — *Discover applications and Shadow IT*. https://learn.microsoft.com/en-us/entra/global-secure-access/tutorial-internet-access-application-discovery                                                                    | Định nghĩa Shadow IT, BRD mục 2.1; `LT-6`                     |
| 6   | GitHub Docs — *Reviewing the audit log for your organization*. https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization | BRD mục 6.3.1 — chỉ là nguồn hành động quản trị, **không** phải nguồn usage; nguồn usage là GitHub REST *List commits*                  |
| 7   | Figma Help — *View and export activity logs*. https://help.figma.com/hc/en-us/articles/360040449533-View-and-export-activity-logs                                                                                                       | BRD mục 6.3.1 — bằng chứng cho yêu cầu cửa sổ dữ liệu bao phủ |
| 8   | Microsoft Learn — *Microsoft 365 Apps Active Users Report*. https://learn.microsoft.com/en-us/microsoft-365/admin/activity-reports/active-users-ww                                                                                      | BRD mục 6.3.1 — bằng chứng cho nguyên tắc giả danh hóa        |
| 9   | Atlassian Developer — *User's last active dates*. https://developer.atlassian.com/cloud/admin/organization/user-last-active-dates/                                                                                                      | BRD mục 6.3.1 — bằng chứng cho FR-4.16 và `INV-11`            |
| 10  | Microsoft Learn — *Entra ID Governance: dynamic approval*. https://learn.microsoft.com/en-us/entra/id-governance/entitlement-management-dynamic-approval                                                                                | BRD mục 5.3 — mô hình phê duyệt nhiều tầng; `LT-4`            |
| 10b | **Nguồn tra cứu 11 nhà cung cấp và bộ thu thập, ngày 14/09/2026** — GitHub, Microsoft Graph, Google Admin SDK, Slack, Atlassian, Figma, Zoom, Notion, OpenAI, Cursor, Chrome Enterprise, ActivityWatch, osquery. Danh sách liên kết đầy đủ: `Docs/Research-AI/usage-tracking-legal-vendor-research-2026-09-14.md` mục 6 | BRD mục 6.3.1, 5.4.4b; `CN-8`, `CN-17`, `CN-18` |

### 8.3. Văn bản pháp luật và chuẩn mực Việt Nam

| #   | Nguồn                                                                                                                                                                                                                                                                              | Dùng ở đâu                                                           |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 11  | Quốc hội — *Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15*, hiệu lực 01/01/2026. **Cổng văn bản Chính phủ:** https://vanban.chinhphu.vn/?classid=1&docid=214590&pageid=27160&typegroupid=3 · **PDF Công báo số 971 + 972** *(đọc nguyên văn 14/09/2026)*: https://congbaocdn.chinhphu.vn/CongBaoCP/VanBan/2025/6/45578/57730-1-2025971-97291-2025-qh15.pdf | BRD mục 7.7, `ADR-13`, `LT-10` — Điều 25 khoản 3 |
| 12  | Chính phủ — *Nghị định 356/2025/NĐ-CP* quy định chi tiết và biện pháp thi hành Luật Bảo vệ dữ liệu cá nhân. **Cổng văn bản Chính phủ:** https://vanban.chinhphu.vn/?classid=0&docid=216387&pageid=27160                                                                            | BRD mục 7.7, `ADR-10` — danh mục 12 nhóm dữ liệu nhạy cảm tại Điều 4 |
| 13  | Thủ tướng Chính phủ — *Quyết định 1121/QĐ-TTg* về phát triển và chuyển đổi sang nền tảng điện toán đám mây giai đoạn 2025–2030. https://chinhphu.vn/?docid=213903&pageid=27160                                                                                                     | Mục 1.4 mức 1 — bối cảnh Việt Nam                                    |
| 14  | Quốc hội — *Luật Viễn thông số 24/2023/QH15*, khái niệm *dịch vụ viễn thông cơ bản trên Internet*. **Cổng văn bản Chính phủ:** https://vanban.chinhphu.vn/?docid=209631&pageid=27160                                                                                               | BRD mục 7.7.6, `LT-13`                                               |
| 15  | Chính phủ — *Nghị định 163/2024/NĐ-CP* quy định chi tiết một số điều và biện pháp thi hành Luật Viễn thông. https://vanban.chinhphu.vn/?pageid=27160&docid=212144                                                                                                                  | `LT-13` — văn bản hướng dẫn của Luật Viễn thông 2023                 |
| 16  | Bộ Tài chính — *Quyết định 165/2002/QĐ-BTC* ngày 31/12/2002, ban hành sáu chuẩn mực kế toán Việt Nam đợt 2, trong đó có **VAS 01** *Chuẩn mực chung* và **VAS 10** *Ảnh hưởng của việc thay đổi tỷ giá hối đoái*. https://vanban.chinhphu.vn/default.aspx?docid=11581&pageid=27160 | `LT-9`, `LT-11`                                                      |
| 16b | **Văn bản thuế liên quan tới mua SaaS/phần mềm** — Luật Thuế GTGT 48/2024/QH15, Nghị định 353/2025 và các công văn đã dẫn; danh sách và mức kiểm chứng: `Decisions/tax-saas-purchase-research-2026-10-08.md` *(L1 — cần đọc bản gốc trên Công báo)* | BRD `FR-5.13`, `OQ-22`; sổ 6.9 dòng 14 |

> **Quy tắc nguồn — hai vế phải giữ nhất quán trong nhóm khi viết báo cáo.**
>
> **Quy tắc 1 — số liệu.** Không trích số liệu từ các trang tổng hợp thống kê trung gian. Nếu một con số không tìm được tại trang gốc của tổ chức công bố, **bỏ con số đó** thay vì trích lại từ nguồn thứ cấp.
>
> **Quy tắc 2 — văn bản pháp luật.** Nguồn chính là **Công báo Chính phủ, cổng văn bản Chính phủ hoặc cổng Quốc hội**. Các trang tra cứu luật của tư nhân — thuvienphapluat.vn, luatvietnam.vn — rất tiện để đọc và tìm điều khoản, nhưng chỉ được xếp là **nguồn hỗ trợ**, không dùng làm căn cứ chứng minh nội dung pháp lý trong báo cáo.
>
> *Vì sao tách thành hai quy tắc:* quy tắc số liệu không tự bao trùm văn bản pháp luật. `LT-10`, `LT-13` và phần thuế là những chỗ dễ bị hỏi sâu nhất, nên mọi trích dẫn pháp lý phải về bản gốc.

### 8.4. Tiêu chuẩn và khung kỹ thuật

| #   | Nguồn                                                                                                                                                                                                             | Dùng ở đâu                  |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| 17  | **ISO/IEC 19770-1:2017** — Information technology, IT asset management, Part 1. https://www.iso.org/standard/68531.html *(trang mục lục — tiêu chuẩn có phí)*                                                     | `LT-1`                      |
| 18  | **ISO/IEC 27001:2022** Annex A — kiểm soát 5.3 *Segregation of duties*, kiểm soát 5.23 *Information security for use of cloud services*. https://www.iso.org/standard/27001 *(trang mục lục — tiêu chuẩn có phí)* | `LT-5`, `LT-6`              |
| 19  | **NIST SP 800-53 Rev. 5** — họ kiểm soát AC. https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final · DOI: https://doi.org/10.6028/NIST.SP.800-53r5                                                                   | `LT-3`, `LT-4`; BRD mục 5.3 |
| 20  | **ANSI/INCITS 359** — *Role Based Access Control*                                                                                                                                                                 | `LT-3`                      |
| 21  | **OMG UML 2.5.1** — chương *State Machines*. https://www.omg.org/spec/UML/2.5.1                                                                                                                                   | `LT-15`                     |
| 22  | **W3C PROV-DM** — mô hình dữ liệu về nguồn gốc dữ liệu                                                                                                                                                            | `LT-7`                      |
| 23  | **RFC 7643** *SCIM Core Schema* https://www.rfc-editor.org/rfc/rfc7643.html · **RFC 7644** *SCIM Protocol* https://www.rfc-editor.org/rfc/rfc7644.html                                                            | `CN-2`                      |
| 24  | **RFC 6749** *The OAuth 2.0 Authorization Framework* https://www.rfc-editor.org/rfc/rfc6749.html · **OpenID Connect Core 1.0** https://openid.net/specs/openid-connect-core-1_0.html                              | `CN-1`                      |
| 25  | **FinOps Framework** — FinOps Foundation. https://www.finops.org/framework/                                                                                                                                       | `LT-2`                      |
| 26  | **COSO** — *Internal Control — Integrated Framework* (2013); **COBIT 2019**                                                                                                                                       | `LT-5` — đọc thêm           |
| 27  | **IAS 1**, **IAS 21** — đối chiếu quốc tế cho VAS 01 và VAS 10                                                                                                                                                    | `LT-9`, `LT-11`             |

### 8.5. Sách chuyên khảo và bài báo khoa học

| #   | Nguồn                                                                                                                                                                                                                                                                    | Dùng ở đâu                               |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- |
| 28  | Fellegi, I. P. và Sunter, A. B. (1969). *A Theory for Record Linkage*. Journal of the American Statistical Association, 64(328)                                                                                                                                          | `LT-14` — nguồn gốc lý thuyết            |
| 29  | Christen, P. (2012). *Data Matching: Concepts and Techniques for Record Linkage, Entity Resolution, and Duplicate Detection*. Springer. https://link.springer.com/book/10.1007/978-3-642-31164-2                                                                         | `LT-14`, `CN-13`                         |
| 30  | Wang, R. Y. và Strong, D. M. (1996). *Beyond Accuracy: What Data Quality Means to Data Consumers*. Journal of Management Information Systems, 12(4)                                                                                                                      | `LT-7` — quan niệm chất lượng dữ liệu    |
| 31  | DAMA International. *DAMA-DMBOK: Data Management Body of Knowledge*, ấn bản 2 — chương *Data Quality*. https://dama.org/order-dama-dmbok/                                                                                                                                | `LT-7` — danh sách các chiều chất lượng  |
| 32  | Rudin, C. (2019). *Stop Explaining Black Box Machine Learning Models for High Stakes Decisions and Use Interpretable Models Instead*. Nature Machine Intelligence, 1. DOI: https://doi.org/10.1038/s42256-019-0048-x · bản toàn văn mở: https://arxiv.org/abs/1811.10154 | `LT-8`, `ADR-09`                         |
| 33  | Hyndman, R. J. và Athanasopoulos, G. *Forecasting: Principles and Practice*, ấn bản 3. OTexts. https://otexts.com/fpp3/                                                                                                                                                  | `LT-12`, `FR-5.7`                        |
| 34  | Harel, D. (1987). *Statecharts: A Visual Formalism for Complex Systems*. Science of Computer Programming, 8(3)                                                                                                                                                           | `LT-15` — nguồn gốc lý thuyết            |
| 35  | Evans, E. (2003). *Domain-Driven Design: Tackling Complexity in the Heart of Software*. Addison-Wesley. ISBN 978-0321125217. Bản tóm tắt miễn phí: *DDD Reference* (2015). https://www.domainlanguage.com/ddd/reference/                                                 | `LT-16`                                  |
| 36  | Vernon, V. (2013). *Implementing Domain-Driven Design*. Addison-Wesley                                                                                                                                                                                                   | `LT-16` — đọc thêm về ranh giới ngữ cảnh |
| 37  | Fowler, M. *Patterns of Enterprise Application Architecture* — mẫu **Money**; *Analysis Patterns* — nhóm mẫu về dữ liệu có hiệu lực theo thời gian                                                                                                                       | `LT-11`, `LT-16`, `ADR-04`               |
| 38  | Sandhu, R. và cộng sự (1996). *Role-Based Access Control Models*. IEEE Computer, 29(2)                                                                                                                                                                                   | `LT-3`                                   |
| 39  | Molnar, C. *Interpretable Machine Learning*. Sách trực tuyến miễn phí. https://christophm.github.io/interpretable-ml-book/                                                                                                                                               | `LT-8` — đọc thêm                        |

> **Nguồn 17–39 được ghi theo thông tin thư mục chuẩn.** Trước khi trích một câu hoặc một số trang cụ thể vào báo cáo cuối, người phụ trách chủ đề tương ứng phải mở bản gốc để đối chiếu — thư viện trường có quyền truy cập phần lớn các đầu sách và tạp chí trên. Hai tiêu chuẩn ISO là tài liệu có phí; link chỉ mở tới trang mục lục, không phải toàn văn.
