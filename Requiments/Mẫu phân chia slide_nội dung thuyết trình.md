# PHẦN 1: MỞ ĐẦU & WHY (Bối cảnh & Bài toán)

### Slide 1: Trang tiêu đề (Title)
- **Tiêu đề đề tài:** SaaS-Sentry — Hệ thống quản trị bản quyền phần mềm và tối ưu chi phí công nghệ.[cite: 2]
- **Thành viên thực hiện & Giảng viên hướng dẫn.**
- **Thông điệp ngắn:** Quản trị tập trung, minh bạch chi phí và phát hiện lãng phí bản quyền cho doanh nghiệp số.[cite: 2]

---

### Slide 2: Bối cảnh & Dẫn chứng số liệu (Market Context)
- **Nội dung chính:**
  - Doanh nghiệp chuyển dịch mạnh sang mô hình thuê bao (SaaS, AI-native tools).[cite: 2]
  - **Số liệu thực tế (Benchmark Zylo & BetterCloud 2025):**[cite: 2]
    - Trung bình một doanh nghiệp dùng **106 ứng dụng SaaS**.[cite: 2]
    - Chi tiêu bình quân: **4.830 USD/nhân viên/năm** (tăng 21,9%).[cite: 2]
    - Chi phí lãng phí cho license không dùng: trung bình **21 triệu USD/năm/tổ chức**.[cite: 2]
  - **Bối cảnh Việt Nam:** Phù hợp Chương trình chuyển đổi nền tảng đám mây quốc gia (QĐ 1121/QĐ-TTg).[cite: 2]
- **Lời thoại gợi ý:** *"Các số liệu cho thấy chi phí SaaS tăng phi mã, nhưng doanh nghiệp đang chịu áp lực rất lớn vì không kiểm soát được mức độ lãng phí."*[cite: 2]

---

### Slide 3: 5 Nỗi đau thực tế của doanh nghiệp (Pain Points - The WHY)
- **Trực quan hóa 5 vấn đề cốt lõi:**[cite: 2, 3]
  1. **Lãng phí license (Ghost Seat):** Đã mua nhưng không dùng hoặc người nghỉ việc vẫn giữ tài khoản.[cite: 2, 3]
  2. **Bẫy tự gia hạn (Auto-Renewal Trap):** 40% doanh nghiệp theo dõi thủ công, bỏ lỡ hạn chót báo hủy (Cancellation Deadline).[cite: 2, 3]
  3. **Bất đối xứng thông tin:** IT nắm tài khoản, Finance nắm hóa đơn, Manager nắm nhân sự $\rightarrow$ Dữ liệu phân mảnh, không rõ chi phí thuộc về Cost Center nào.[cite: 2, 3]
  4. **Rủi ro Shadow IT:** Nhân viên tự mua công cụ ngoài quy trình gây rò rỉ dữ liệu và trùng lặp chi phí.[cite: 2, 3]
  5. **Nút thắt quy trình:** Luồng xin cấp công cụ chậm khiến nhân viên chủ động đi "đường tắt" (nguyên nhân gốc của Shadow IT).[cite: 2, 3]

---

### Slide 4: Mục tiêu & Định vị hệ thống (Positioning)
- **SaaS-Sentry là gì:** Nền tảng quản trị nội bộ giúp tập trung hóa dữ liệu bản quyền, tự động hóa quy trình phê duyệt và hỗ trợ tối ưu chi phí.[cite: 2, 3]
- **Nguyên tắc "Human-in-the-loop":**
  - Hệ thống cung cấp bằng chứng, dữ liệu và khuyến nghị.[cite: 2, 3]
  - Hệ thống không tự ý phê duyệt chi tiêu, không tự ý thu hồi quyền hay kết luận vi phạm; mọi quyết định đều do con người đưa ra.[cite: 2, 3]

---

# PHẦN 2: WHO (Đối tượng & Ma trận vai trò)

### Slide 5: Đối tượng mục tiêu & Ma trận trách nhiệm (Roles Matrix)
- **Khách hàng mục tiêu:** Doanh nghiệp công nghệ, outsourcing từ 100–500 nhân sự, có 15–40 SaaS, dùng Cost Center.[cite: 2, 3]
- **Phân định rõ 3 trụ cột quyền hạn:**[cite: 3]
  - **Nhu cầu nghiệp vụ:** Manager xác nhận nhân viên có thực sự cần công cụ hay không.[cite: 3]
  - **Chi phí & Thẩm quyền chi:** Người duyệt chi (Spending Approver - CEO/CFO) quyết định khi phát sinh tiền hoặc duyệt SaaS mới.[cite: 3]
  - **Kiểm soát ngân sách:** Finance kiểm tra hạn mức, ghi nhận khoản cam kết (Commitment) và đối soát.[cite: 3]
  - **Thực thi kỹ thuật:** IT Admin đánh giá bảo mật và thực hiện cấp phát/thu hồi qua API hoặc thủ công.[cite: 3]
- **Nguyên tắc vàng:** Không ai tự duyệt yêu cầu của chính mình.[cite: 3]

---

# PHẦN 3: WHAT (Quy trình & Tính năng)

### Slide 6: Tổng quan kiến trúc tính năng (Feature Modules)
- **5 phân hệ cốt lõi:**[cite: 3]
  1. **SaaS Catalog & Contract:** Quản lý vòng đời hợp đồng, hạn báo hủy, Cost Center.[cite: 2, 3]
  2. **Request & Provisioning:** Cổng yêu cầu và tự động hóa cấp phát.[cite: 3]
  3. **Ghost Seat Detection Engine:** Cơ chế phát hiện lãng phí từ G1 đến G4.[cite: 3]
  4. **Shadow IT Discovery:** Bóc tách hóa đơn, OAuth SSO và Browser Extension.[cite: 3]
  5. **Cost & Savings Dashboard:** Báo cáo Budget vs Actual, tách bạch tiết kiệm ngay và tiết kiệm kỳ gia hạn.[cite: 2, 3]

---

### Slide 7: Swimlane 1 — Luồng yêu cầu cấp quyền (Request & Approval)
*(Hiển thị dạng sơ đồ bơi ngang qua các làn: Nhân viên $\rightarrow$ Manager $\rightarrow$ Finance $\rightarrow$ Người duyệt chi $\rightarrow$ IT Admin)*[cite: 1, 3]

- **Điểm nhấn thuyết trình (3 nhánh rõ ràng):**[cite: 3]
  - **Nhánh A (Còn seat sẵn):** Employee $\rightarrow$ Manager xác nhận $\rightarrow$ IT Admin cấp ngay (Không cần duyệt chi, bỏ qua CEO).[cite: 3]
  - **Nhánh B (Phát sinh chi phí):** Cần mua thêm seat $\rightarrow$ Chuyển qua Người duyệt chi xem Snapshot ngân sách, đối chiếu cam kết $\rightarrow$ Duyệt $\rightarrow$ IT Admin cấp tài khoản song song Finance ghi nhận.[cite: 3]
  - **Nhánh C (Phần mềm mới):** IT thẩm định rủi ro $\rightarrow$ Người duyệt chi chốt $\rightarrow$ Đưa vào Catalog.[cite: 3]

---

### Slide 8: Swimlane 2 — Luồng phát hiện & Thu hồi lãng phí (Ghost Seat Flow)
*(Hiển thị sơ đồ từ Bằng chứng $\rightarrow$ Đánh giá $\rightarrow$ Ra quyết định $\rightarrow$ Cắt giảm)*[cite: 3]

- **Cơ chế phân loại lãng phí:**[cite: 3]
  - **G1:** Mua nhưng chưa gán | **G2:** Nhân viên đã nghỉ việc còn giữ tài khoản.[cite: 3]
  - **G3:** Chưa từng hoạt động | **G4:** Đã ngừng hoạt động sau một khoảng thời gian.[cite: 3]
- **Quy trình thu hồi an toàn:**
  - Bằng chứng sử dụng (API/Extension) $\rightarrow$ Sinh khuyến nghị $\rightarrow$ Manager chọn Giữ / Thu hồi / Miễn trừ (kèm lý do) $\rightarrow$ IT Admin thực thi.[cite: 2, 3]
- **Lưu ý tài chính:** Tách bạch tiết kiệm ngay (gói tháng) và tiết kiệm tại kỳ gia hạn (hợp đồng năm).[cite: 3]

---

### Slide 9: Luồng phát hiện phần mềm ngoài danh mục (Shadow IT Discovery)
- **3 nguồn thu thập:**
  1. Sao kê/hóa đơn từ Finance (Giao dịch lạ).[cite: 3]
  2. Báo cáo cấp quyền OAuth từ Google/Microsoft Workspace.[cite: 3]
  3. Tiện ích trình duyệt (Browser Extension) khớp với từ điển SaaS.[cite: 3]
- **Hợp thức hóa (Legitimize):** Đưa mục cần xem xét cho IT đánh giá $\rightarrow$ Người duyệt chi phê duyệt $\rightarrow$ Chuyển thành quyền chính thức mà không gián đoạn công việc của nhân viên.[cite: 3]

---

### Slide 10: Cơ chế thu thập dữ liệu & Quyền riêng tư (Privacy & Evidence)
- **Bằng chứng qua API chính thức:** Demo thực tế từ GitHub (Commit), Jira (Worklog), Notion (Page edit), Figma (Version history).[cite: 3]
- **Browser Extension (Tiện ích trình duyệt):**
  - Chỉ hoạt động trên máy công ty, chỉ đo tên miền trong Allowlist.[cite: 3]
  - **Tuyệt đối không thu thập:** Nội dung chat, file, phím bấm, mật khẩu, URL chi tiết.[cite: 3]
  - **Tuân thủ bảo vệ dữ liệu:** Nhân viên phải ấn xác nhận đồng ý mới ghi nhận dữ liệu.[cite: 3]