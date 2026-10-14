# SaaS-Sentry — Use Case Catalog *(đã thay thế)*

> **Trang dẫn hướng, không phải nguồn hiện hành.** Từ 25/09/2026 tài liệu này (danh mục và đặc tả 48 UC của mô hình nhiều trang (P00–P09)) được thay bằng **[đặc tả Use Case một sơ đồ](use-case-specification.md)** và sơ đồ duy nhất [saas-sentry-use-case-diagram.drawio](saas-sentry-use-case-diagram.drawio). Nội dung cũ còn trong lịch sử git của thư mục `Docs`; không dùng lại làm căn cứ. Mã UC cũ đổi ra sao: [đặc tả mục 7](use-case-specification.md#old-to-new).

Bảng dưới giữ **mọi anchor cũ** của trang này để liên kết từ tài liệu khác không gãy; mỗi dòng trỏ tới nơi nội dung tương ứng nằm bây giờ.

| Anchor cũ | Nay ở |
| --- | --- |
| <a id="conventions"></a>`#conventions` | [1. Phạm vi và quy ước](use-case-specification.md#scope) |
| <a id="actors"></a>`#actors` | [2. Actor catalog](use-case-specification.md#actors) |
| <a id="a01"></a>`#a01` | [Actor A01 Employee](use-case-specification.md#a01) |
| <a id="a02"></a>`#a02` | [Actor A02 Manager](use-case-specification.md#a02) |
| <a id="a03"></a>`#a03` | [Actor A03 IT Admin](use-case-specification.md#a03) |
| <a id="a04"></a>`#a04` | [Actor A04 Finance](use-case-specification.md#a04) |
| <a id="a05"></a>`#a05` | [Actor A05 Spending Approver](use-case-specification.md#a05) |
| <a id="a06"></a>`#a06` | [Actor A06 Super Admin](use-case-specification.md#a06) |
| <a id="a07"></a>`#a07` | [Actor A07 Business Owner](use-case-specification.md#a07) |
| <a id="a08"></a>`#a08` | [Actor A08 SaaS Provider](use-case-specification.md#a08) |
| <a id="a09"></a>`#a09` | [Actor A09 Identity Provider — **đã gỡ 04/10/2026** (`QĐ-46`)](use-case-specification.md#a09) |
| <a id="a10"></a>`#a10` | [Actor A10 Email Service Provider](use-case-specification.md#a10) |
| <a id="a11"></a>`#a11` | [Actor A11 Exchange Rate Service](use-case-specification.md#a11) |
| <a id="uc-summary"></a>`#uc-summary` | [3.1. Danh mục use case](use-case-specification.md#uc-list) |
| <a id="uc-detail"></a>`#uc-detail` | [4. Đặc tả từng use case](use-case-specification.md#uc-specs) |
| <a id="uc01"></a>`#uc01` | [UC01 Sign In](use-case-specification.md#uc01) |
| <a id="uc02"></a>`#uc02` | [UC02 Manage User Accounts and Roles *(cũ: Administer User Accounts)*](use-case-specification.md#uc02) |
| <a id="uc03"></a>`#uc03` | [UC03 Configure System Policies](use-case-specification.md#uc03) |
| <a id="uc04"></a>`#uc04` | [UC04 Review Audit Trail](use-case-specification.md#uc04) |
| <a id="uc05"></a>`#uc05` | [UC05 Monitor System Operations](use-case-specification.md#uc05) |
| <a id="uc06"></a>`#uc06` | [UC06 Initialize Organization Data *(cũ: Initialize Organization)*](use-case-specification.md#uc06) |
| <a id="uc07"></a>`#uc07` | [UC07 Manage Workforce Records *(cũ: Manage Workforce)*](use-case-specification.md#uc07) |
| <a id="uc08"></a>`#uc08` | [UC08 Offboard Employee](use-case-specification.md#uc08) |
| <a id="uc09"></a>`#uc09` | [UC09 Manage SaaS Catalog *(cũ: Maintain SaaS Catalog)*](use-case-specification.md#uc09) |
| <a id="uc10"></a>`#uc10` | [UC10 Manage Contracts and Subscriptions](use-case-specification.md#uc10) |
| <a id="uc11"></a>`#uc11` | [UC11 Request Software Access](use-case-specification.md#uc11) |
| <a id="uc12"></a>`#uc12` | [UC11 *(merge từ UC12 Withdraw Access Request)*](use-case-specification.md#uc11) |
| <a id="uc13"></a>`#uc13` | [UC13 Return Software Access](use-case-specification.md#uc13) |
| <a id="uc14"></a>`#uc14` | [UC14 Review Access Need](use-case-specification.md#uc14) |
| <a id="uc15"></a>`#uc15` | [UC15 Assess New SaaS](use-case-specification.md#uc15) |
| <a id="uc16"></a>`#uc16` | [UC16 Decide Spending Request](use-case-specification.md#uc16) |
| <a id="uc17"></a>`#uc17` | [UC17 Request Budget Information](use-case-specification.md#uc17) |
| <a id="uc18"></a>`#uc18` | [UC20 *(merge từ UC18 Respond to Budget Inquiry)*](use-case-specification.md#uc20) |
| <a id="uc19"></a>`#uc19` | [UC20 *(merge từ UC19 Record Budget Commitment)*](use-case-specification.md#uc20) |
| <a id="uc20"></a>`#uc20` | [UC20 Control Budgets and Commitments *(cũ: Manage Budgets)*](use-case-specification.md#uc20) |
| <a id="uc21"></a>`#uc21` | [UC21 Provision Software Access](use-case-specification.md#uc21) |
| <a id="uc22"></a>`#uc22` | [UC22 Revoke Software Access](use-case-specification.md#uc22) |
| <a id="uc23"></a>`#uc23` | [UC23, UC32 Resolve Vendor Discrepancies *(cũ: Resolve Data Discrepancies)*](use-case-specification.md#uc23) |
| <a id="uc24"></a>`#uc24` | [UC24 Manage Usage Evidence](use-case-specification.md#uc24) |
| <a id="uc25"></a>`#uc25` | [UC24 *(merge từ UC25 Resolve Identity Matches)*](use-case-specification.md#uc24) |
| <a id="uc26"></a>`#uc26` | [UC26 Operate Device Monitoring](use-case-specification.md#uc26) |
| <a id="uc27"></a>`#uc27` | [UC27 Acknowledge Device Monitoring](use-case-specification.md#uc27) |
| <a id="uc28"></a>`#uc28` | [UC28 Review License Recommendations](use-case-specification.md#uc28) |
| <a id="uc29"></a>`#uc29` | [UC29 Review Renewal Alerts](use-case-specification.md#uc29) |
| <a id="uc30"></a>`#uc30` | [UC30 Decide Subscription Renewal](use-case-specification.md#uc30) |
| <a id="uc31"></a>`#uc31` | [UC10 *(merge từ UC31 Record Subscription Changes)*](use-case-specification.md#uc10) |
| <a id="uc32"></a>`#uc32` | [UC32 Reconcile Invoices](use-case-specification.md#uc32) |
| <a id="uc33"></a>`#uc33` | [UC33 Manage Cost Centers and Allocations *(cũ: Allocate Shared Costs)*](use-case-specification.md#uc33) |
| <a id="uc34"></a>`#uc34` | [UC10, UC32, UC55 *(subflow từ UC34 Review Contract Evidence)*](use-case-specification.md#uc10) |
| <a id="uc35"></a>`#uc35` | [UC56 *(merge từ UC35 Review Spending)*](use-case-specification.md#uc56) |
| <a id="uc36"></a>`#uc36` | [UC36 Forecast Costs](use-case-specification.md#uc36) |
| <a id="uc37"></a>`#uc37` | [UC56 *(merge từ UC37 Review Savings)*](use-case-specification.md#uc56) |
| <a id="uc38"></a>`#uc38` | [UC56 *(merge từ UC38 Review Usage Performance)*](use-case-specification.md#uc56) |
| <a id="uc39"></a>`#uc39` | [UC56 *(merge từ UC39 Review Process Performance)*](use-case-specification.md#uc56) |
| <a id="uc40"></a>`#uc40` | [UC56 *(merge từ UC40 Review Data Quality)*](use-case-specification.md#uc56) |
| <a id="uc41"></a>`#uc41` | [UC54, UC42 *(split từ UC41 Import Discovery Evidence)*](use-case-specification.md#uc54) |
| <a id="uc42"></a>`#uc42` | [UC42 Investigate Shadow IT](use-case-specification.md#uc42) |
| <a id="uc43"></a>`#uc43` | [UC43 Decide SaaS Legitimization](use-case-specification.md#uc43) |
| <a id="uc44"></a>`#uc44` | [UC44 Exercise Personal Data Rights *(cũ: View Personal Access and Data)*](use-case-specification.md#uc44) |
| <a id="uc45"></a>`#uc45` | [UC44 *(merge từ UC45 Request Personal Data Export)*](use-case-specification.md#uc44) |
| <a id="uc46"></a>`#uc46` | [UC44 *(merge từ UC46 Request Monitoring Stop)*](use-case-specification.md#uc44) |
| <a id="uc47"></a>`#uc47` | [UC47 Process Data Subject Requests](use-case-specification.md#uc47) |
| <a id="uc48"></a>`#uc48` | [UC48 Notify Employees of Monitoring](use-case-specification.md#uc48) |
| <a id="relationships"></a>`#relationships` | [3.3. Sổ quan hệ UML](use-case-specification.md#relationships) |
| <a id="diagrams"></a>`#diagrams` | [9. Hướng dẫn đọc và script](use-case-specification.md#reading-guide) |
| <a id="deferred"></a>`#deferred` | [4.12. Use case deferred](use-case-specification.md#deferred) |
| <a id="uc49"></a>`#uc49` | [UC49 Change Subscription Plan *(cũ: Change Subscription Plan)*](use-case-specification.md#uc49) |
| <a id="uc50"></a>`#uc50` | [UC50 Conduct Periodic Access Review *(cũ: Conduct Periodic Access Review)*](use-case-specification.md#uc50) |
| <a id="uc51"></a>`#uc51` | [UC51 Monitor Desktop Usage *(cũ: Monitor Desktop Usage)*](use-case-specification.md#uc51) |
| <a id="uc52"></a>`#uc52` | [UC52 Forecast Variable Costs *(cũ: Forecast Variable Costs)*](use-case-specification.md#uc52) |
| <a id="uc53"></a>`#uc53` | [UC53 Consult AI Assistant *(cũ: Consult AI Assistant)*](use-case-specification.md#uc53) |
| <a id="uc59"></a>`#uc59` | [UC59 Manage My Account *(mới 04/10/2026 — `QĐ-46`, `QĐ-47`)*](use-case-specification.md#uc59) |
| <a id="uc60"></a>`#uc60` | [UC60 Transfer Super Admin Role *(mới 04/10/2026 — `QĐ-44c`, `QĐ-47`)*](use-case-specification.md#uc60) |
| <a id="not-modelled"></a>`#not-modelled` | [6. Truy vết](use-case-specification.md#traceability) |
