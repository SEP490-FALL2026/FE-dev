<h1 align="center">ĐĂNG KÝ ĐỒ ÁN TỐT NGHIỆP</h1>

**Lớp:**            **Thời gian thực hiện: từ 01/01/2026 đến 30/04/2026**

**(\*) Nghề nghiệp:** &lt;Kỹ sư phần mềm&gt;                   **Chuyên ngành:** &lt;SE&gt;    &lt;IS&gt;    &lt;JS&gt;

**(\*) Người thực hiện đăng ký:**            Giảng viên                Sinh viên

**1. Thông tin đăng ký của giảng viên hướng dẫn (nếu có)**

| STT                  | Họ và tên            | Điện thoại | E-Mail              | Chức danh |
| -------------------- | -------------------- | ---------- | ------------------- | --------- |
| Giảng viên hướng dẫn | Nguyễn Thị Cẩm Hương |            | huongntc2@fe.edu.vn | Bà        |
| Giảng viên hướng dẫn |                      |            |                     |           |

**2. Thông tin đăng ký của sinh viên (nếu có)**

| STT | Họ và tên           | Mã sinh viên | Điện thoại | E-mail                     | Vai trò trong nhóm |
| --- | ------------------- | ------------ | ---------- | -------------------------- | ------------------ |
| 1   | Phạm Bảo Phi        | SE185046     |            | PhiPBSE185046@fpt.edu.vn   | Trưởng nhóm        |
| 2   | Nguyễn Đức Thiên Ân | SE182633     |            | AnNDTSE182633@fpt.edu.vn   | Thành viên         |
| 3   | Vương Hoài Bảo      | SE183866     |            | BaoVHSE183866@fpt.edu.vn   | Thành viên         |
| 4   | Nguyễn Hưng Phú     | SE183939     |            | PhuNHSE183939@fpt.edu.vn   | Thành viên         |
| 5   | Nguyễn Sỹ Hải Đăng  | SE183849     |            | DangNSHSE183849@fpt.edu.vn | Thành viên         |

**3. Nội dung đăng ký Đồ án Tốt nghiệp**

**(\*) 3.1. Tên Đồ án Tốt nghiệp:**

- Tiếng Anh: Software License Management & Optimization System
- Tiếng Việt: Hệ thống quản trị bản quyền phần mềm & tối ưu chi phí công nghệ
- Viết tắt: SaaS-Sentry

a. **Bối cảnh:**

Các tổ chức ngày càng phụ thuộc vào những ứng dụng Software-as-a-Service (SaaS) như Microsoft 365, GitHub, Jira, Figma, Slack, Zoom và Google Workspace. Rào cản tiếp cận thấp và mô hình thuê bao cho phép áp dụng nhanh chóng, nhưng cũng làm phân tán quyền sở hữu subscription, license seat, hợp đồng, gia hạn, dữ liệu sử dụng và chi tiêu công nghệ. Điều này tạo ra các rủi ro có thể tránh được: license không dùng hoặc trùng lặp, gia hạn ngoài dự kiến, thiếu khả năng quan sát chi tiêu, Shadow IT và Shadow AI. [Microsoft Learn – Discover applications and Shadow IT](https://learn.microsoft.com/en-us/entra/global-secure-access/tutorial-internet-access-application-discovery) định nghĩa Shadow IT là ứng dụng hoặc dịch vụ được sử dụng khi bộ phận CNTT không biết hoặc chưa phê duyệt, đi kèm rủi ro về bảo vệ dữ liệu, bảo mật, tuân thủ và license trùng lặp. [SaaS Management Index 2025 của Zylo](https://zylo.com/news/2025-saas-management-index) phân tích dữ liệu do Zylo quản lý, gồm hơn 40 triệu license SaaS và 40 tỷ USD chi tiêu SaaS, đồng thời ghi nhận mức lãng phí license chưa sử dụng trung bình 21 triệu USD mỗi năm cho mỗi tổ chức; đây là benchmark toàn cầu của một nhà cung cấp, không phải số liệu có thể suy diễn trực tiếp cho doanh nghiệp Việt Nam. [Quyết định 1121/QĐ-TTg](https://chinhphu.vn/?docid=213903&pageid=27160) phê duyệt Chương trình hành động quốc gia phát triển và chuyển đổi sang sử dụng nền tảng điện toán đám mây giai đoạn 2025-2030, cho thấy tính phù hợp của bài toán quản trị SaaS tại Việt Nam.

b. **Giải pháp đề xuất:**

SaaS-Sentry là hệ thống web quản trị nội bộ, cài đặt riêng cho doanh nghiệp quy mô khoảng 100–500 nhân sự có cấp máy làm việc. Hệ thống quản lý tập trung SaaS trả phí, phần mềm thương mại có bản quyền (kể cả license vĩnh viễn) và phần mềm/dịch vụ nội bộ; không bao gồm phần mềm miễn phí bên ngoài. Giải pháp hỗ trợ quản lý bản quyền, phê duyệt và cấp/thu hồi quyền, theo dõi mức sử dụng, kiểm soát chi phí và phát hiện lãng phí. Dữ liệu được nhập từ file, kết nối với nhà cung cấp và bộ thu thập trên máy công ty. Báo cáo, cảnh báo và khuyến nghị giúp các bộ phận phối hợp và ra quyết định.

- **Yêu cầu chức năng:**

  1. Quản trị viên CNTT: quản lý danh mục phần mềm, license seat và tích hợp kỹ thuật cho các phòng ban mình phụ trách.
     - Quản lý danh mục, gói, thuê bao, hợp đồng, kho khóa bản quyền, điều khoản nhà cung cấp và bộ công cụ chuẩn theo phòng ban, chức vụ; xác định người phụ trách nghiệp vụ (Business Owner) cho từng phần mềm.
     - Đánh giá phần mềm mới được đề xuất mua; từ chối ngay nếu phần mềm không kiểm soát được.
     - Cấp/thu hồi seat sau phê duyệt qua kết nối API hoặc tác vụ thủ công có theo dõi; phối hợp bàn giao dữ liệu và thu hồi quyền khi nhân viên nghỉ việc.
     - Import nhân sự, hiện trạng seat và usage log; đăng ký thiết bị công ty; điều tra khoản chi ngoài danh mục và thực thi quyết định của Người duyệt chi.
  2. Trưởng phòng: xác nhận nhu cầu nghiệp vụ của nhân viên trong phòng.
     - Phê duyệt hoặc từ chối yêu cầu cấp mới, đổi gói, gia hạn; tạo yêu cầu thay nhân viên khi onboarding hoặc gửi yêu cầu theo nhóm.
     - Quyết định giữ, thu hồi hoặc tạm miễn trừ đối với khuyến nghị license không sử dụng (Ghost Seat); xác nhận bàn giao khi nghỉ việc và rà soát công cụ khi nhân viên điều chuyển.
     - Chỉ xem dữ liệu của phòng mình; không duyệt yêu cầu của chính mình, không cấp hoặc thu hồi seat.
  3. Người duyệt chi: người có thẩm quyền chi (mặc định là CEO), quyết định cuối cho mọi khoản chi mới.
     - Phê duyệt hoặc từ chối yêu cầu mua thêm seat, nâng gói, vượt ngân sách hoặc mua phần mềm mới, dựa trên thông tin ngân sách.
     - Quyết định gia hạn, giảm số lượng hoặc hủy thuê bao; quyết định hợp thức hóa khoản chi phần mềm ngoài danh mục.
     - Không thực hiện thao tác kỹ thuật, không duyệt chi cho yêu cầu mà mình là người yêu cầu hoặc người thụ hưởng.
  4. Tài chính: kiểm soát ngân sách và chi phí phần mềm; không nằm trên đường phê duyệt.
     - Quản lý Cost Center và ngân sách; trả lời khi Người duyệt chi hỏi; ghi nhận khoản cam kết sau khi khoản chi được duyệt.
     - Nhập và đối soát hóa đơn, ghi nhận dòng thuế theo chứng từ (không tính thuế), phân bổ chi phí; xem Budget versus Actual, lịch gia hạn và dự báo.
     - Không quyết định chi, không cấp hoặc thu hồi tài khoản.
  5. Nhân viên: yêu cầu và hoàn trả quyền truy cập phần mềm phục vụ công việc.
     - Gửi yêu cầu cấp mới, đổi gói, gia hạn có thời hạn hoặc hoàn trả quyền kèm lý do; tham khảo bộ công cụ chuẩn theo phòng ban và chức vụ.
     - Xác nhận chính sách theo dõi trên máy công ty; xem và yêu cầu xuất dữ liệu cá nhân của mình.
  6. Quản trị hệ thống: quản lý tài khoản, vai trò, cấu hình hệ thống và Audit Trail.
     - Tạo tài khoản và gửi lời mời kích hoạt, gán vai trò, cấu hình ngưỡng, người duyệt và thời hạn xử lý bước phê duyệt theo thỏa thuận mức dịch vụ (Service Level Agreement – SLA).
     - Không phê duyệt nghiệp vụ, không cấp hoặc thu hồi seat.
  7. Dịch vụ Tự động hóa và Hỗ trợ AI: chạy các phân tích có thể giải thích theo lịch ở chế độ nền.
     - Cảnh báo trước hạn chót báo hủy, quyền sắp hết hạn và bước duyệt quá SLA; phát hiện seat trống, seat của người đã nghỉ việc và ứng viên Ghost Seat kèm bằng chứng và mức độ tin cậy.
     - AI tóm tắt yêu cầu chờ duyệt cho trưởng phòng và soạn bản nháp diễn giải báo cáo chi phí cho Tài chính; AI không phê duyệt chi tiêu, không cấp/thu hồi seat.

- **Yêu cầu phi chức năng:**

  - Xác thực nội bộ qua tài khoản được mời kích hoạt; bảo vệ mật khẩu, phân quyền theo vai trò và phạm vi dữ liệu phòng ban.
  - Bảo mật dữ liệu truyền, tệp hợp đồng/hóa đơn và khóa bản quyền; Audit Trail chỉ ghi thêm. Bộ thu thập trên máy công ty chỉ gửi dữ liệu cần thiết đã lọc tại máy, sau khi nhân viên xác nhận.
  - Phân tách trách nhiệm: trưởng phòng quyết định nhu cầu, Người duyệt chi quyết định chi, Quản trị viên CNTT thực hiện kỹ thuật; không ai được duyệt yêu cầu của chính mình.
  - Giao diện web responsive, dễ tiếp cận và dễ hiểu. Ngoài phạm vi MVP: ứng dụng di động, xử lý thanh toán, tính/kê khai thuế, triển khai CASB/proxy và tự động chặn ứng dụng.

**(\*) 3.2. Nội dung đề xuất chính (bao gồm kết quả và sản phẩm):**

a. **Lý thuyết và thực hành (tài liệu):**

- Quản trị SaaS và tài sản CNTT: vòng đời bản quyền, thuê bao, hợp đồng, ngân sách và tối ưu chi phí phần mềm.
- Quản trị định danh và truy cập: xác thực, phân quyền theo vai trò, quy trình phê duyệt, phân tách trách nhiệm và nhật ký kiểm toán.
- Tích hợp và vận hành: REST API, nhập CSV/Excel, PostgreSQL, tác vụ nền và lưu trữ tệp an toàn.
- Phát hiện Shadow IT: đối soát chi phí với danh mục phần mềm và căn cứ phê duyệt, dựa trên dữ liệu sẵn có.
- Tối ưu có thể giải thích: phân tích mức sử dụng và bằng chứng để phát hiện Ghost Seat, đánh giá tiết kiệm và dự báo chi phí theo hợp đồng, kịch bản. Mô hình dự báo thống kê chỉ ở mức đặc tả trong MVP.
- Bảo vệ dữ liệu cá nhân: quyền của người lao động, bảo mật và minh bạch khi thu thập dữ liệu sử dụng.
- AI hỗ trợ: tóm tắt yêu cầu và diễn giải báo cáo từ dữ liệu hệ thống, hỗ trợ người dùng ra quyết định.

b. **Sản phẩm:**

Ứng dụng web responsive cho sáu vai trò: Quản trị hệ thống, Quản trị viên CNTT, Trưởng phòng, Người duyệt chi, Tài chính và Nhân viên. Ứng dụng di động nằm ngoài phạm vi MVP.

- Software Catalog và License Management: ba loại đối tượng quản lý, gói và kiểu cấp, thuê bao, hợp đồng, hóa đơn, kho khóa bản quyền, tài khoản dùng chung, điều khoản nhà cung cấp, số seat đã mua/đang gán/còn trống và lịch gia hạn theo hạn chót báo hủy.
- Organization và Approval Workflow: quản lý phòng ban, chức vụ, trưởng phòng, Cost Center, CNTT phụ trách và bộ công cụ chuẩn; biểu mẫu yêu cầu, định tuyến và lịch sử phê duyệt, thời hạn xử lý (SLA), thông báo. Hỗ trợ cấp/thu hồi quyền, điều chuyển, nghỉ việc và tác vụ thủ công khi chưa có kết nối API.
- Financial Dashboard: Budget versus Actual và khoản cam kết theo Cost Center/phòng ban trên chi phí thực chịu, ghi nhận thuế theo chứng từ, đối soát hóa đơn, báo cáo tiết kiệm, thời điểm dữ liệu gần nhất và dự báo chi tiêu minh bạch; dashboard theo vai trò và danh mục cảnh báo.
- Shadow IT Discovery (Đối soát chi phí phần mềm): nhập CSV sao kê/hóa đơn, nhận diện nhà cung cấp, đối chiếu khoản chi với danh mục và căn cứ phê duyệt; hỗ trợ rà soát khoản chi chưa được phê duyệt và ghi nhận quyết định hợp thức hóa.
- Audit & Administration: tài khoản nội bộ kích hoạt qua lời mời, quản lý vai trò và cấu hình, tệp dữ liệu, trạng thái import/background job, error log, quyền của chủ thể dữ liệu, năm chỉ số đo hiệu quả và nhật ký kiểm toán cho các hành động nghiệp vụ quan trọng.

c. **Nhiệm vụ đề xuất:**

- Gói công việc 1 – Hệ thống cốt lõi và quản trị dữ liệu: Phân tích yêu cầu, thiết kế hệ thống và cơ sở dữ liệu; xây dựng quản lý tài khoản, phân quyền, tổ chức, danh mục phần mềm và bản quyền.

- Gói công việc 2 – Nghiệp vụ, tích hợp và tối ưu: Phát triển quy trình yêu cầu, phê duyệt, cấp/thu hồi quyền; tích hợp dữ liệu sử dụng, quản lý và đối soát chi phí, báo cáo, cảnh báo, khuyến nghị tối ưu và các tính năng AI hỗ trợ.

- Gói công việc 3 – Kiểm thử, triển khai và tài liệu: Thực hiện kiểm thử đơn vị, tích hợp và nghiệm thu người dùng; triển khai môi trường demo, hoàn thiện tài liệu kỹ thuật và hướng dẫn sử dụng, vận hành.

**4. Ý kiến khác (đề xuất mọi nội dung liên quan nếu có).**

| **Giảng viên hướng dẫn (nếu có)**<br>*(Ký và ghi rõ họ tên)* | TP. HCM, ngày 09/04/2026<br>**Đại diện người đăng ký**<br>*(Ký và ghi rõ họ tên)* |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| Nguyễn Thị Cẩm Hương                                         |                                                                                   |
