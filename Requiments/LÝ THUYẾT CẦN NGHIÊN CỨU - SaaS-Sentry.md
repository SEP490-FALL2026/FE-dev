# Các lý thuyết cần nghiên cứu cho dự án SaaS-Sentry

> **Dự án:** SaaS-Sentry — Hệ thống quản trị bản quyền phần mềm và tối ưu chi phí công nghệ  
> **Mục đích:** Xác định các nền tảng lý thuyết cần nghiên cứu để phân tích nghiệp vụ, thiết kế hệ thống và giải thích các quyết định trong báo cáo.

---

## 1. “Lý thuyết cần nghiên cứu” trong đề tài này là gì?

Trong đề tài phần mềm, **lý thuyết cần nghiên cứu** là các khái niệm, mô hình, nguyên tắc và phương pháp giúp trả lời các câu hỏi:

- Bài toán nghiệp vụ cần quản lý những gì?
- Dữ liệu nào cần được lưu và liên kết với nhau?
- Ai được làm gì, ai phê duyệt và ai chịu trách nhiệm?
- Hệ thống dựa vào nguyên tắc nào để đưa ra cảnh báo hoặc khuyến nghị?
- Làm sao để dữ liệu đáng tin cậy, an toàn và có thể kiểm toán?

Lý thuyết **không phải** tên công nghệ. Ví dụ: RBAC là lý thuyết/mô hình phân quyền; React, ASP.NET Core, NestJS và PostgreSQL là công nghệ dùng để hiện thực mô hình đó.

---

## 2. Nhóm lý thuyết cốt lõi

### 2.1. Quản trị SaaS và vòng đời license

**SaaS Management** là hoạt động quản lý các phần mềm được doanh nghiệp sử dụng theo mô hình thuê bao. Khác với phần mềm mua một lần, SaaS phát sinh chi phí định kỳ, có ngày gia hạn, số lượng license thay đổi theo nhu cầu và thường được quản trị trên nhiều cổng của nhà cung cấp.

Vòng đời một license có thể được mô tả như sau:

```text
Nhu cầu phát sinh
  → Yêu cầu
  → Phê duyệt
  → Mua/gia hạn subscription
  → Cấp license
  → Theo dõi sử dụng
  → Thu hồi hoặc gia hạn
  → Kết thúc
```

Các khái niệm cần nghiên cứu:

- **SaaS Catalog:** danh mục phần mềm được doanh nghiệp cho phép sử dụng.
- **Subscription:** đăng ký thuê bao với nhà cung cấp, thường có chu kỳ tháng/năm.
- **License Seat:** một đơn vị quyền sử dụng có thể cấp cho người dùng.
- **Assignment:** việc gán một seat cho một nhân viên.
- **Contract:** hợp đồng quy định điều khoản, giá và điều kiện gia hạn/hủy.
- **Invoice:** hóa đơn hoặc chứng từ ghi nhận khoản chi.
- **Renewal / Cancellation Notice Period:** gia hạn và hạn chót phải báo hủy.

**Áp dụng vào SaaS-Sentry:** Đây là nền tảng của các phân hệ SaaS Catalog, Subscription, Contract, Invoice, License Assignment và cảnh báo gia hạn.

---

### 2.2. Quản lý tài sản CNTT và tối ưu license

**IT Asset Management (ITAM)** là phương pháp quản lý tài sản CNTT trong toàn bộ vòng đời. Trong phạm vi dự án, tài sản không chỉ là máy tính hay máy chủ mà còn là quyền sử dụng phần mềm SaaS, tức license, seat và subscription.

Mục tiêu không phải chỉ là biết doanh nghiệp đã mua gì, mà là trả lời được:

- Đã mua bao nhiêu license và đang trả bao nhiêu tiền?
- Bao nhiêu license đang được cấp và bao nhiêu còn trống?
- License nào có dấu hiệu không còn sử dụng?
- License đó thuộc bộ phận, dự án hoặc Cost Center nào?
- Có nên thu hồi, phân bổ lại hoặc gia hạn license hay không?

Khái niệm quan trọng là **Ghost Seat**: license vẫn được mua hoặc cấp cho một người dùng, nhưng không có dấu hiệu sử dụng trong một khoảng thời gian xác định. Ghost Seat là một tín hiệu tối ưu chi phí, không phải kết luận tuyệt đối rằng người dùng không cần công cụ.

**Áp dụng vào SaaS-Sentry:** Hệ thống quản lý số seat đã mua/đã cấp/còn trống, nhập usage data, sinh khuyến nghị Ghost Seat và yêu cầu Manager xác nhận trước khi IT Admin thu hồi quyền.

---

### 2.3. Quản trị danh tính và quyền truy cập

**Identity and Access Management (IAM)** là lĩnh vực quản lý danh tính người dùng và quyền truy cập của họ vào tài nguyên số. Trong hệ thống SaaS, mỗi nhân viên có thể được cấp quyền truy cập tới nhiều ứng dụng; khi đổi vị trí hoặc nghỉ việc, các quyền đó cần được thay đổi hoặc thu hồi đúng lúc.

Các nội dung chính cần nghiên cứu:

- **Authentication:** xác thực người đang đăng nhập là ai.
- **Authorization:** xác định người đó được phép làm gì sau khi đăng nhập.
- **Role-Based Access Control (RBAC):** phân quyền theo vai trò thay vì cấp quyền riêng lẻ cho từng người.
- **OAuth 2.0 và OpenID Connect:** các tiêu chuẩn ủy quyền/xác thực thường dùng khi đăng nhập và tích hợp dịch vụ.
- **JWT:** cơ chế biểu diễn phiên đăng nhập hoặc thông tin xác thực trong ứng dụng web.
- **SCIM:** chuẩn hỗ trợ đồng bộ người dùng và provisioning/deprovisioning giữa các hệ thống.
- **Provisioning / Deprovisioning:** cấp quyền và thu hồi quyền khi nhân viên vào, chuyển vị trí hoặc rời doanh nghiệp.

**Áp dụng vào SaaS-Sentry:** Năm vai trò Employee, Manager, Finance, IT Admin và Super Admin có phạm vi dữ liệu và thao tác khác nhau. Khi có connector được phê duyệt, IT Admin có thể cấp/thu hồi license qua API hoặc SCIM; nếu không, hệ thống tạo task thủ công có thể theo dõi.

---

### 2.4. Phân tách trách nhiệm và kiểm soát nội bộ

**Separation of Duties (SoD)** là nguyên tắc kiểm soát nội bộ: không nên để một người đồng thời đề xuất, phê duyệt và thực hiện một quyết định quan trọng. Nguyên tắc này giảm rủi ro lạm quyền, gian lận hoặc sai sót không được phát hiện.

Trong SaaS-Sentry, trách nhiệm được tách như sau:

| Vai trò     | Trách nhiệm                                                             |
| ----------- | ----------------------------------------------------------------------- |
| Employee    | Nêu nhu cầu và gửi yêu cầu cấp/thay đổi/gia hạn/hoàn trả license.       |
| Manager     | Xác nhận nhu cầu nghiệp vụ của nhân viên trong team.                    |
| Finance     | Kiểm soát và phê duyệt chi tiêu khi yêu cầu có tác động tài chính.      |
| IT Admin    | Thực hiện thao tác kỹ thuật: cấp, thu hồi, đồng bộ và quản trị catalog. |
| Super Admin | Quản trị cấu hình và phân quyền cấp hệ thống.                           |

Ví dụ, Manager không được phê duyệt yêu cầu do chính mình gửi; Finance không tự cấp tài khoản; IT Admin không tự phê duyệt chi tiêu.

**Áp dụng vào SaaS-Sentry:** SoD quyết định thiết kế role, approval workflow, kiểm tra quyền và Audit Trail.

---

### 2.5. Quản lý quy trình nghiệp vụ và workflow phê duyệt

**Business Process Management (BPM)** nghiên cứu cách mô hình hóa, chuẩn hóa, theo dõi và cải tiến quy trình nghiệp vụ. Trong dự án này, quy trình quan trọng nhất là yêu cầu–phê duyệt–thực hiện quyền truy cập phần mềm.

Mỗi yêu cầu cần có:

- Loại yêu cầu: cấp mới, đổi gói, gia hạn, hoàn trả hoặc yêu cầu SaaS mới.
- Người yêu cầu và người cần được cấp quyền.
- Lý do nghiệp vụ, dự án hoặc Cost Center liên quan.
- Các bước duyệt, người duyệt, thời điểm duyệt và quyết định.
- Trạng thái hiện tại của yêu cầu.
- SLA hoặc thời gian xử lý cho từng bước.

Ví dụ về trạng thái:

```text
Draft → Submitted → Manager Review → Finance Review (nếu cần)
      → Approved → Provisioning → Active
      → Rejected / Cancelled / Failed
```

**Áp dụng vào SaaS-Sentry:** Workflow giúp minh bạch ai đang xử lý yêu cầu, tránh yêu cầu bị thất lạc và đo được bước nào làm chậm việc cấp phần mềm. Đây là cách xử lý nguyên nhân gốc khiến người dùng tự tìm công cụ ngoài quy trình.

---

### 2.6. Phân tích usage và phát hiện Ghost Seat

**Usage Analytics** là việc phân tích dữ liệu sử dụng để hiểu một tài nguyên có đang tạo ra giá trị hay không. Với SaaS, dữ liệu phổ biến nhất là **Last Active Date** — ngày hoạt động gần nhất của một tài khoản.

Khi xây dựng luật phát hiện Ghost Seat, cần nghiên cứu:

- Ngưỡng không hoạt động: ví dụ 30–59, từ 60 hoặc từ 90 ngày.
- **Coverage Window:** file/API usage đang bao phủ khoảng thời gian nào.
- Định nghĩa “hoạt động” của từng nhà cung cấp: đăng nhập, tạo nội dung, xem trang hay sử dụng tính năng trả phí.
- Các trường hợp loại trừ: nhân viên nghỉ phép dài, tài khoản dùng chung, quyền truy cập chỉ cần khi có sự cố, tài khoản dịch vụ.
- Báo động giả và cách Manager xác nhận bối cảnh thực tế.

Nguyên tắc quan trọng: nếu nguồn usage chỉ có dữ liệu 30 ngày gần nhất, hệ thống không được suy diễn rằng người không xuất hiện trong file đã không hoạt động từ nhiều tháng trước.

**Áp dụng vào SaaS-Sentry:** Hệ thống sinh khuyến nghị có giải thích, nêu nguồn dữ liệu, thời điểm import và mức độ tin cậy; Manager xác nhận Keep, Reclaim hoặc Exempt.

---

### 2.7. Quản trị chi phí SaaS theo FinOps

**FinOps** là phương pháp phối hợp giữa Finance, IT và các đơn vị sử dụng để đưa tính minh bạch, trách nhiệm và tối ưu hóa vào chi phí công nghệ. Dù FinOps thường gắn với cloud infrastructure, các nguyên tắc của nó phù hợp với chi phí SaaS.

Các nội dung cần nghiên cứu:

- **Budget vs Actual:** so sánh ngân sách với chi tiêu thực tế.
- Phân bổ chi phí theo Cost Center, phòng ban hoặc dự án.
- **Showback/Chargeback:** hiển thị hoặc quy chi phí về đơn vị sử dụng.
- Quản lý chi phí đa tiền tệ: số tiền gốc, loại tiền, tỷ giá và tiền tệ báo cáo.
- Đối soát hóa đơn, hợp đồng, subscription và dữ liệu từ nhà cung cấp.
- Dự báo chi phí cơ sở từ hợp đồng, số seat và dữ liệu lịch sử.

**Áp dụng vào SaaS-Sentry:** Finance có dashboard theo dõi Budget vs Actual, chi tiêu theo Cost Center/dự án, lịch gia hạn, dữ liệu đối soát và dự báo có điều kiện.

---

### 2.8. Shadow IT và quản trị rủi ro SaaS

**Shadow IT** là các ứng dụng hoặc dịch vụ được dùng trong doanh nghiệp mà IT không biết hoặc chưa phê duyệt. Nguyên nhân có thể là quy trình mua sắm chậm, nhu cầu công việc gấp hoặc catalog hiện tại chưa đáp ứng.

Rủi ro chính:

- Dữ liệu doanh nghiệp có thể nằm ở dịch vụ chưa được đánh giá bảo mật.
- Khó thu hồi quyền truy cập khi nhân viên nghỉ việc.
- Chi phí phát sinh mà Finance không xác định được nguồn gốc.
- Nhiều phòng ban mua công cụ trùng chức năng.
- Công cụ AI có thể tiếp nhận dữ liệu nội bộ mà không qua đánh giá.

Phát hiện Shadow IT cần dựa trên **evidence-based discovery**: đối chiếu SaaS Catalog đã được phê duyệt với sao kê/hóa đơn tài chính, OAuth consent hoặc dữ liệu Identity Provider được phép sử dụng.

**Áp dụng vào SaaS-Sentry:** Hệ thống chỉ tạo finding `Potential Unapproved SaaS` để IT Admin xem xét. Hệ thống không tự kết luận vi phạm, không tự chặn ứng dụng và không cam kết phát hiện toàn bộ Shadow IT.

---

### 2.9. Bảo mật, quyền riêng tư và khả năng kiểm toán

Hệ thống lưu dữ liệu nhân viên, quyền truy cập phần mềm, hợp đồng, hóa đơn và đôi khi là dữ liệu usage. Vì vậy cần nghiên cứu ba nguyên tắc:

1. **Bảo mật thông tin:** bảo vệ tính bí mật, toàn vẹn và sẵn sàng của dữ liệu.
2. **Privacy by Design:** chỉ thu thập dữ liệu cần thiết, đúng mục đích; hạn chế truy cập; có chính sách lưu giữ và xóa dữ liệu.
3. **Auditability:** mọi thay đổi quan trọng phải truy vết được ai làm, khi nào, thay đổi gì và dựa trên quyết định nào.

Các biện pháp liên quan:

- RBAC và nguyên tắc least privilege.
- Mã hóa dữ liệu khi truyền; quản lý secret/token connector.
- Kiểm tra file import và giới hạn quyền tải tệp hợp đồng/hóa đơn.
- Signed URL có thời hạn cho file lưu trữ.
- Audit Log theo nguyên tắc append-only: chỉ thêm mới, không sửa hoặc xóa.
- Chính sách lưu giữ/xóa dữ liệu usage phù hợp.

**Áp dụng vào SaaS-Sentry:** Đây là cơ sở cho yêu cầu xác thực, phân quyền, lưu tệp an toàn, quản lý secret và Audit Trail.

---

### 2.10. Mô hình hóa miền nghiệp vụ và chất lượng dữ liệu

**Domain-Driven Design (DDD)** là cách tiếp cận thiết kế phần mềm xoay quanh nghiệp vụ thực tế. DDD giúp nhóm dùng thuật ngữ thống nhất và chia hệ thống thành các vùng nghiệp vụ rõ ràng.

Các khái niệm cần nghiên cứu:

- **Entity:** đối tượng có định danh và vòng đời riêng, như Employee, Contract hoặc Subscription.
- **Value Object:** giá trị được xác định bằng nội dung, như Money gồm amount và currency.
- **Bounded Context:** ranh giới giữa các nhóm nghiệp vụ, ví dụ Catalog & Contract, Entitlement, Request & Approval, Usage & Optimization, Finance, Discovery.
- **Invariant:** quy tắc luôn phải đúng, ví dụ số license đã cấp không được vượt số license đã mua.
- **Temporal Data:** lưu lịch sử hiệu lực của assignment và cơ cấu tổ chức thay vì ghi đè dữ liệu cũ.

Bên cạnh đó, cần nghiên cứu **Data Quality** để xử lý dữ liệu import/tích hợp:

- Tính đầy đủ: dữ liệu có đủ trường cần thiết không?
- Tính nhất quán: nhiều nguồn có mâu thuẫn không?
- Tính kịp thời: dữ liệu được import/cập nhật lúc nào?
- Nguồn chân lý: trong mỗi tình huống, nguồn nào được ưu tiên?
- Khả năng truy vết: kết quả cảnh báo đến từ file/API nào?

**Áp dụng vào SaaS-Sentry:** DDD định hướng ERD, module backend và quy tắc nghiệp vụ; Data Quality giúp import an toàn, giải thích cảnh báo và tránh kết luận sai từ dữ liệu không đủ.

---

## 3. Các lý thuyết nâng cao hoặc có điều kiện

Những nội dung dưới đây không nên là trọng tâm MVP, nhưng có thể nghiên cứu để phát triển hoặc trình bày hướng mở rộng:

| Nội dung                             | Chỉ nên áp dụng khi                                                             | Ứng dụng khả thi                         |
| ------------------------------------ | ------------------------------------------------------------------------------- | ---------------------------------------- |
| Dự báo chuỗi thời gian / hồi quy     | Có tối thiểu 12 tháng dữ liệu chi tiêu và kết quả backtesting đạt ngưỡng sai số | Dự báo biến động chi phí SaaS            |
| Machine Learning                     | Có dữ liệu đã gán nhãn đủ lớn và có cách đánh giá chất lượng rõ ràng            | Phân loại mô tả giao dịch chưa rõ vendor |
| Retrieval-Augmented Generation (RAG) | Tài liệu hợp đồng đã được cấp quyền, có cơ chế trích dẫn nguồn                  | Hỏi đáp điều khoản hợp đồng              |
| Discovery từ network/CASB log        | Có cơ sở pháp lý, hạ tầng và quyền xử lý dữ liệu phù hợp                        | Bổ sung bằng chứng phát hiện Shadow IT   |

Nguyên tắc của dự án là: **khi dữ liệu hoặc điều kiện kiểm chứng chưa đủ, hệ thống không đưa ra kết luận có vẻ chính xác nhưng không đáng tin cậy.**

---

## 4. Thứ tự ưu tiên nghiên cứu cho MVP

Để phù hợp tiến độ, nhóm nên ưu tiên theo thứ tự sau:

1. Quản trị SaaS, vòng đời license và IT Asset Management.
2. IAM, RBAC và Separation of Duties.
3. Workflow phê duyệt và các trạng thái nghiệp vụ.
4. ERD, Domain-Driven Design, Audit Trail và Data Quality.
5. FinOps cơ bản: Cost Center, Budget vs Actual, đa tiền tệ và đối soát.
6. Usage Analytics, rule-based detection và Ghost Seat.
7. Shadow IT theo hướng evidence-based discovery.
8. Bảo mật, quyền riêng tư và chính sách lưu giữ dữ liệu.
9. Dự báo, AI/RAG và các tích hợp nâng cao.

---

## 5. Đoạn tóm tắt dùng trong đề cương hoặc báo cáo

> Đề tài nghiên cứu các lý thuyết về quản trị SaaS và vòng đời license; quản lý tài sản CNTT và tối ưu license; quản trị danh tính và phân quyền truy cập; phân tách trách nhiệm; quản lý workflow phê duyệt; phân tích usage để phát hiện Ghost Seat; quản trị chi phí SaaS theo FinOps; Shadow IT; bảo mật, quyền riêng tư và Audit Trail; cùng phương pháp mô hình hóa miền nghiệp vụ bằng ERD và Domain-Driven Design. Các lý thuyết này là cơ sở để thiết kế hệ thống quản lý SaaS tập trung, minh bạch chi phí, kiểm soát quyền truy cập và hỗ trợ ra quyết định dựa trên dữ liệu.

---

## 6. Phân biệt lý thuyết và công nghệ triển khai

| Lý thuyết / nguyên tắc              | Công nghệ có thể dùng để hiện thực                                |
| ----------------------------------- | ----------------------------------------------------------------- |
| RBAC, OAuth 2.0, OpenID Connect     | ASP.NET Core hoặc NestJS; JWT; Identity Provider                  |
| Workflow và background processing   | REST API; Redis; BullMQ/Hangfire/queue tương đương                |
| ERD, DDD, auditability              | PostgreSQL; migration; AuditLog append-only                       |
| Data Quality và import              | CSV/Excel parser; validation; job queue                           |
| SaaS integration, provisioning      | REST API; SCIM; Microsoft Entra/Google Workspace/GitHub connector |
| Dashboard FinOps và usage analytics | React/TypeScript; PostgreSQL; biểu đồ dashboard                   |
| Bảo vệ hợp đồng, hóa đơn            | MinIO/S3-compatible storage; signed URL; secret management        |

Vì vậy, trong báo cáo nên trình bày **lý thuyết trước**, sau đó mới mô tả **công nghệ được chọn để hiện thực lý thuyết đó**.
