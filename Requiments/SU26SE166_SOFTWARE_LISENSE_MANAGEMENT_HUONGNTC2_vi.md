   <h1 align="center">ĐĂNG KÝ ĐỒ ÁN TỐT NGHIỆP</h1>

Lớp:            Thời gian thực hiện: từ 01/01/2026 đến 30/04/2026

(*) Nghề nghiệp: &lt;Kỹ sư phần mềm&gt;                   Chuyên ngành: &lt;ES&gt; /   &lt;IS&gt; /   &lt;JS&gt; /

(*) Người thực hiện đăng ký:              Giảng viên /                Sinh viên

## 1. Thông tin đăng ký của giảng viên hướng dẫn (nếu có)

| STT                  | Họ và tên            | Điện thoại | E-Mail              | Chức danh |
| -------------------- | -------------------- | ---------- | ------------------- | --------- |
| Giảng viên hướng dẫn | Nguyễn Thị Cẩm Hương |            | huongntc2@fe.edu.vn | Bà        |
| Giảng viên hướng dẫn |                      |            |                     |           |

## 2. Thông tin đăng ký của sinh viên (nếu có)

|     | Họ và tên           | Mã sinh viên | Điện thoại | E-mail                     | Vai trò trong nhóm |
| --- | ------------------- | ------------ | ---------- | -------------------------- | ------------------ |
|     | Phạm Bảo Phi        | SE185046     |            | PhiPBSE185046@fpt.edu.vn   | Trưởng nhóm        |
|     | Nguyễn Đức Thiên Ân | SE182633     |            | AnNDTSE182633@fpt.edu.vn   | Thành viên         |
|     | Vương Hoài Bảo      | SE183866     |            | BaoVHSE183866@fpt.edu.vn   | Thành viên         |
|     | Nguyễn Hưng Phú     | SE183939     |            | PhuNHSE183939@fpt.edu.vn   | Thành viên         |
|     | Nguyễn Sỹ Hải Đăng  | SE183849     |            | DangNSHSE183849@fpt.edu.vn | Thành viên         |

## 3. Nội dung đăng ký Đồ án Tốt nghiệp

### (*) 3.1. Tên Đồ án Tốt nghiệp:

Tiếng Anh: Software License Management & Optimization System

Tiếng Việt: Hệ thống quản trị bản quyền phần mềm & tối ưu chi phí công nghệ

Viết tắt: SaaS-Sentry

Bối cảnh:

Các tổ chức ngày càng phụ thuộc vào những ứng dụng Software-as-a-Service (SaaS) như Microsoft 365, GitHub, Jira, Figma, Slack, Zoom và Google Workspace. Rào cản tiếp cận thấp và mô hình thuê bao cho phép áp dụng nhanh chóng, nhưng cũng làm phân tán quyền sở hữu subscription, license seat, hợp đồng, gia hạn, dữ liệu sử dụng và chi tiêu công nghệ. Điều này tạo ra các rủi ro có thể tránh được: license không dùng hoặc trùng lặp, gia hạn ngoài dự kiến, thiếu khả năng quan sát chi tiêu, Shadow IT và Shadow AI. [Microsoft Learn – Discover applications and Shadow IT](https://learn.microsoft.com/en-us/entra/global-secure-access/tutorial-internet-access-application-discovery) định nghĩa Shadow IT là ứng dụng hoặc dịch vụ được sử dụng khi bộ phận CNTT không biết hoặc chưa phê duyệt, đi kèm rủi ro về bảo vệ dữ liệu, bảo mật, tuân thủ và license trùng lặp. [SaaS Management Index 2025 của Zylo](https://zylo.com/news/2025-saas-management-index) phân tích dữ liệu do Zylo quản lý, gồm hơn 40 triệu license SaaS và 40 tỷ USD chi tiêu SaaS, đồng thời ghi nhận mức lãng phí license chưa sử dụng trung bình 21 triệu USD mỗi năm cho mỗi tổ chức; đây là benchmark toàn cầu của một nhà cung cấp, không phải số liệu có thể suy diễn trực tiếp cho doanh nghiệp Việt Nam. [Quyết định 1121/QĐ-TTg](https://chinhphu.vn/?docid=213903&pageid=27160) phê duyệt Chương trình hành động quốc gia phát triển và chuyển đổi sang sử dụng nền tảng điện toán đám mây giai đoạn 2025-2030, cho thấy tính phù hợp của bài toán quản trị SaaS tại Việt Nam.

Giải pháp đề xuất

SaaS-Sentry là nền tảng web tập trung giúp doanh nghiệp quản lý các dịch vụ phần mềm thuê ngoài: danh mục SaaS được phê duyệt, gói thuê bao, license seat, hợp đồng, hóa đơn, chi phí và dữ liệu sử dụng. Hệ thống nhận dữ liệu từ identity provider, API SaaS hoặc file import; dịch vụ chưa tích hợp được theo dõi qua tác vụ thủ công. Dựa trên Team, Cost Center và Manager, hệ thống định tuyến yêu cầu phê duyệt, đồng thời cung cấp cảnh báo, bằng chứng và Audit Trail. Hệ thống không tự động chặn ứng dụng, phê duyệt chi phí hoặc cấp/thu hồi quyền.

Yêu cầu chức năng

1. Quản trị viên CNTT: phụ trách quản trị SaaS Catalog, subscription, hợp đồng, license seat và tích hợp kỹ thuật.

   - Quản lý ứng dụng SaaS đã được phê duyệt, gói dịch vụ, hợp đồng, hóa đơn, ngày gia hạn và trạng thái seat.
   - Sau khi hoàn tất phê duyệt, cấp hoặc thu hồi seat qua API/SCIM connector được phê duyệt khi có; nếu không, tạo và theo dõi tác vụ thực hiện thủ công.
   - Import dữ liệu tổ chức, usage log, bằng chứng tài chính và nguồn discovery được phép; xem xét bản ghi Potential Unapproved SaaS và ghi nhận quyết định cuối cùng. Chỉ sử dụng mã nhân viên và email công việc cho mục đích quản trị.

2. Trưởng nhóm/Quản lý phòng ban: xác nhận nhu cầu nghiệp vụ của nhân viên trực thuộc và tham gia rà soát quyền truy cập trong Team/Department được quản lý.

   - Phê duyệt hoặc từ chối yêu cầu cấp mới, thay đổi, gia hạn có thời hạn và hoàn trả từ nhân viên trực thuộc; có thể tạo yêu cầu onboarding thay cho nhân viên trực thuộc khi cần.
   - Chỉ xem request, assignment và dữ liệu usage tổng hợp của team; xác nhận Keep, Reclaim hoặc Exempt cho khuyến nghị Ghost Seat kèm lý do.
   - Không được phê duyệt yêu cầu của chính mình, cấp hoặc thu hồi seat, truy cập raw activity log, hợp đồng hoặc dữ liệu tài chính toàn công ty.

3. Tài chính: phê duyệt chi tiêu công nghệ và theo dõi chi phí phần mềm, rủi ro gia hạn.

   - Xem Budget versus Actual, chi tiêu theo Cost Center/dự án, dữ liệu đối soát, lịch gia hạn và dự báo dựa trên thời điểm đồng bộ/import gần nhất.
   - Phê duyệt yêu cầu cần seat bổ sung, gói có giá cao hơn, mua SaaS mới hoặc chi tiêu vượt ngân sách.
   - Có thể tra cứu điều khoản tài chính trong hợp đồng đã được cấp quyền bằng trợ lý tài liệu kèm trích dẫn đoạn nguồn.
   - Không thể tự cấp hoặc thu hồi tài khoản.

4. Nhân viên: yêu cầu và hoàn trả quyền truy cập phần mềm phục vụ công việc hằng ngày.

   - Duyệt SaaS Catalog đã được phê duyệt và gửi yêu cầu cấp seat mới, thay đổi gói, gia hạn có thời hạn hoặc hoàn trả, kèm lý do nghiệp vụ, dự án/Cost Center và thời hạn cần sử dụng.
   - Không thể xem dữ liệu sử dụng của đồng nghiệp hoặc dữ liệu tài chính công ty.

5. Dịch vụ Tự động hóa và Hỗ trợ AI tùy chọn: chạy các phân tích có thể giải thích theo lịch ở chế độ nền.

   - Phát hiện hợp đồng sắp gia hạn, seat sử dụng thấp và ứng viên Ghost Seat theo quy tắc cấu hình; mọi hành động thu hồi đều cần con người review và IT thực hiện.
   - Chuẩn hóa bằng chứng từ tài chính, IdP và network log được phép để phát hiện Shadow IT. Mục không khớp chỉ là bản ghi Potential Unapproved SaaS, không phải vi phạm đã được xác nhận.
   - Chạy trong background queue, sinh cảnh báo/khuyến nghị kèm nguồn dữ liệu, thời điểm xử lý và mức độ tin cậy; ghi Audit Trail cho thay đổi dữ liệu.
   - AI/ML tùy chọn có thể phân loại mô tả giao dịch chưa chắc chắn hoặc hỗ trợ hỏi đáp hợp đồng được cấp quyền kèm trích dẫn nguồn. AI không bao giờ phê duyệt chi tiêu, cấp/thu hồi seat hoặc chặn ứng dụng.

Ghi chú về Shadow IT: Hệ thống đối chiếu SaaS Catalog đã được IT phê duyệt với CSV sao kê/hóa đơn, bản xuất OAuth consent/ứng dụng doanh nghiệp từ IdP và file log web/firewall/proxy/CASB được phép import. Mục không khớp được ghi nhận là "SaaS có dấu hiệu chưa được phê duyệt" để Quản trị viên CNTT xem xét; Trưởng nhóm/Quản lý phòng ban chỉ bổ sung bối cảnh nghiệp vụ khi cần. Hệ thống không được kết luận là vi phạm hoặc tự động chặn. Về bằng chứng, sao kê/hóa đơn cho thấy giao dịch chi tiêu; [OAuth2PermissionGrant của Microsoft Graph](https://learn.microsoft.com/en-us/graph/api/resources/oauth2permissiongrant?view=graph-rest-1.0) cho thấy delegated permission đã được cấp cho ứng dụng; còn [Cloud Discovery của Microsoft Defender](https://learn.microsoft.com/en-us/defender-cloud-apps/create-snapshot-cloud-discovery-reports) có thể cung cấp bằng chứng truy cập và thông tin về mô hình sử dụng khi log có trường phù hợp. Độ bao phủ phụ thuộc vào phạm vi và chất lượng log thu thập, nên không suy diễn rằng bất kỳ nguồn đơn lẻ nào phản ánh đầy đủ việc sử dụng.

Yêu cầu phi chức năng:

- Mục tiêu thời gian tải trang không quá 3 giây và kết quả tìm kiếm không quá 2 giây với bộ dữ liệu MVP.
- Hỗ trợ ít nhất 100 người dùng đồng thời trong phạm vi MVP/demo.
- Sử dụng OAuth 2.0/OpenID Connect, JWT session token, role-based access control và cho phép mở rộng multi-factor authentication thông qua identity provider.
- Bảo vệ dữ liệu khi truyền, hạn chế quyền truy cập tệp hợp đồng, quản lý secret, kiểm tra file import, ghi nhận Audit Trail và chỉ thu thập các trường cần thiết cho discovery log được phép.
- Bảo đảm phân tách trách nhiệm: Trưởng nhóm/Quản lý phòng ban không được phê duyệt yêu cầu của chính mình hoặc trực tiếp cấp/thu hồi quyền; Quản trị viên CNTT thực hiện thao tác kỹ thuật sau khi đủ phê duyệt.
- Cung cấp giao diện web responsive, dễ tiếp cận và dễ hiểu. Ứng dụng di động, xử lý thanh toán trực tiếp và triển khai CASB/endpoint agent riêng nằm ngoài phạm vi MVP.

### (*) 3.2. Nội dung đề xuất chính (bao gồm kết quả và sản phẩm)

Lý thuyết và thực hành (tài liệu):

- Quản trị SaaS và IT asset management: SaaS Catalog, vòng đời subscription và license seat, hợp đồng, hóa đơn, gia hạn, usage, ngân sách, Cost Center và tối ưu chi phí. Các chỉ số tối ưu dựa trên số seat đã mua, đang cấp, còn trống, usage và chi phí đã import/đồng bộ.
- Quản trị identity và access: OAuth 2.0, OpenID Connect, SCIM, RBAC, cấu trúc tổ chức, bản ghi request/approval, phân tách trách nhiệm và Audit Trail.
- Tích hợp và vận hành: REST API và connector được phê duyệt; CSV/Excel import là phương án nền tảng; PostgreSQL; background job và queue cho đồng bộ, import, cảnh báo và rà soát định kỳ; object storage an toàn cho hợp đồng và hóa đơn.
- Phát hiện Shadow IT dựa trên bằng chứng: đối chiếu SaaS Catalog được phê duyệt với giao dịch/hóa đơn tài chính, OAuth consent hoặc bản xuất ứng dụng doanh nghiệp từ IdP, và web/firewall/proxy/CASB log được phép. [Microsoft Defender for Cloud Apps](https://learn.microsoft.com/en-us/defender-cloud-apps/best-practices) cũng mô tả Cloud Discovery dựa trên traffic log từ endpoint, firewall và secure web gateway. Độ bao phủ phụ thuộc vào nguồn dữ liệu sẵn có và hệ thống không được cam kết phát hiện 100%.
- Tối ưu có thể giải thích: quy tắc sử dụng thấp theo ngưỡng 30/60 ngày có thể cấu hình, review Ghost Seat, cảnh báo gia hạn và dự báo chi tiêu cơ sở từ hợp đồng, seat và chi tiêu lịch sử. Hồi quy hoặc mô hình chuỗi thời gian chỉ được dùng khi dữ liệu lịch sử đủ và có đánh giá sai số.
- AI tùy chọn: phân loại giao dịch confidence thấp và hỏi đáp hợp đồng bằng retrieval-augmented generation kèm trích dẫn. Các chức năng này hỗ trợ, không phải cơ chế ra quyết định lõi.

Sản phẩm:

Ứng dụng web responsive cho Quản trị viên CNTT, Trưởng nhóm/Quản lý phòng ban, Tài chính và Nhân viên. Ứng dụng di động nằm ngoài phạm vi MVP.

- SaaS Catalog và License Management: subscription, hợp đồng, hóa đơn, seat, trạng thái Available/Assigned/Revoked và lịch gia hạn.
- Organization và Approval Workflow: Department, Team, Cost Center, Direct Manager, định tuyến request, lịch sử phê duyệt, thông báo và thực hiện thủ công có theo dõi khi không có connector.
- Usage và Optimization: import usage log, Last Active Date, khuyến nghị Ghost Seat, manager attestation và hành động cuối cùng của IT.
- Financial Dashboard: Budget versus Actual, chi tiêu theo Cost Center/dự án, đối soát, thời điểm dữ liệu gần nhất và dự báo chi tiêu minh bạch.
- Shadow IT Discovery và Administration: tiếp nhận bằng chứng đa nguồn, chuẩn hóa vendor/domain, review Potential Unapproved SaaS, trạng thái import/job, error log và Audit Trail.
- Audit & Administration: quản lý vai trò, tệp dữ liệu, lỗi đồng bộ, trạng thái background job và nhật ký kiểm toán cho các hành động nghiệp vụ quan trọng.

Công nghệ đề xuất: React/Next.js với TypeScript; ASP.NET Core hoặc NestJS REST API với RBAC; PostgreSQL; Redis và background-job queue; MinIO/S3-compatible object storage; CSV/Excel import là nền tảng và một hoặc hai demo connector như Microsoft Entra, Google Workspace, GitHub hoặc Slack khi có quyền API phù hợp.

Nhiệm vụ đề xuất:

Gói công việc 1: Dữ liệu lõi, bảo mật và quản trị.

- Thiết kế và triển khai mô hình dữ liệu cho SaaS Catalog, Subscription Plan, Contract, Invoice, License Seat, Employee, Department, Team, Cost Center, Direct Manager, Request, Approval Step, Usage Record, Discovery Evidence và Audit Log.
- Triển khai quản trị catalog, hợp đồng, hóa đơn, seat và tổ chức; kiểm tra/import CSV/Excel, ghi nhận lỗi và thời điểm import; lưu trữ tệp an toàn; OIDC/JWT/RBAC; giới hạn quyền theo vai trò và phạm vi tổ chức; Audit Trail; error log và job-status log.

Gói công việc 2: Workflow nghiệp vụ, dashboard và tích hợp bằng chứng.

- Triển khai các luồng cấp mới, thay đổi gói, gia hạn có thời hạn và hoàn trả. Định tuyến chuẩn là Employee -> Trưởng nhóm/Quản lý phòng ban -> Quản trị viên CNTT; yêu cầu có tác động chi phí bổ sung Tài chính; SaaS mới cần IT review catalog/risk trước khi mua hoặc thực hiện.
- Triển khai cấp/thu hồi qua connector hoặc thực hiện thủ công có theo dõi, cảnh báo gia hạn, dashboard subscription/seat, Budget versus Actual, phân bổ chi phí và usage-log import ánh xạ với Employee ID/email để xác định Last Active Date. Chỉ gọi dữ liệu chi tiêu là real-time khi nguồn billing/API thực sự cung cấp cập nhật thời gian thực.
- Triển khai Shadow IT Discovery MVP từ CSV/hóa đơn tài chính, sau đó hỗ trợ IdP export và network/CASB log được phép khi có. Lưu nguồn, thời điểm thu thập, bằng chứng và confidence; yêu cầu IT review và không tự động chặn.

Gói công việc 3: Tự động hóa, kiểm thử và hỗ trợ thông minh tùy chọn.

- Triển khai scheduled rule có thể giải thích cho gia hạn, sử dụng thấp, Ghost Seat, tiết kiệm ước tính và dự báo chi tiêu cơ bản. Dự báo phải hiển thị giả định, khoảng thời gian dữ liệu và sai số khi có mô hình dự báo. Trưởng nhóm xác nhận Keep/Reclaim/Exempt; Quản trị viên CNTT ra quyết định kỹ thuật cuối cùng.
- Triển khai hàng đợi review giao dịch với vendor dictionary, regex và mapping là cơ chế chính. Nếu thử nghiệm AI/ML, phải hiển thị confidence và lý do, đồng thời chuyển kết quả chưa chắc chắn đến người review.
- Tùy chọn triển khai RAG hỏi đáp hợp đồng cho người dùng được cấp quyền kèm trích dẫn nguồn; trợ lý không tạo quyết định tài chính tự động. Kiểm thử luồng nghiệp vụ, ranh giới phân quyền, lỗi import, audit record và demo data; bàn giao tài liệu kiến trúc, API, triển khai và hướng dẫn sử dụng.

## 4. Ý kiến khác (đề xuất mọi nội dung liên quan nếu có).

| Giảng viên hướng dẫn (nếu có)<br>(Ký và ghi rõ họ tên) | TP. HCM, ngày 09/04/2026<br>Đại diện người đăng ký<br>(Ký và ghi rõ họ tên) |
| ------------------------------------------------------ | --------------------------------------------------------------------------- |
| Nguyễn Thị Cẩm Hương                                   |                                                                             |
