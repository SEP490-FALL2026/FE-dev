# TÀI LIỆU PHÂN TÍCH YÊU CẦU NGHIỆP VỤ (BRD)

## DỰ ÁN: HỆ THỐNG QUẢN TRỊ BẢN QUYỀN PHẦN MỀM & TỐI ƯU CHI PHÍ CÔNG NGHỆ

**Phiên bản:** 3.11
**Thay đổi ở v3.11 — Owner chốt 16/09/2026, CÓ thay đổi yêu cầu** _(Phụ lục `B.14`; sổ quyết định `QĐ-30a` → `QĐ-30c`)_: đóng ba lệch ngữ nghĩa mức High mà kiểm tra độc lập ngày 16/09/2026 nêu ra. **(a) `QĐ-30b`** — đóng `SA-02`: khoản cam kết ngân sách **tồn tại được khi chưa có `Budget`**, mang lý do _Chưa có ngân sách_, và được **gắn ngược tự động** khi ngân sách của đúng cost center và kỳ đó được lập; ngân sách còn lại **được phép âm** — **`FR-5.8a` mới**, **`INV-18` mới**, 5.12.3 dòng `BudgetCommitment`. **(b) `QĐ-30c`** — đóng `SA-03`: tách `INV-14` thành **`INV-14a`** _(không chồng lấn — ràng buộc loại trừ)_ và **`INV-14b`** _(bắt buộc tồn tại — `NOT NULL`)_, chốt `INV-14b` có hiệu lực; **`FR-9.7` mới** đưa Cost Center thành trường bắt buộc của file nhân sự; cập nhật `OQ-02`, 5.12.1, `ADR-04`. **(c) `QĐ-30a`** — đóng `SA-01`: chỉ sửa **biểu diễn** trên `WF-09`, `WF-10`, `WF-15`, **không đổi yêu cầu**. **Kèm theo — sửa tham chiếu lạc hậu, không đổi yêu cầu:** `OQ-08` về đúng **6 tháng** cho mọi ứng dụng (`SA-04`); dòng _Thời gian phát triển_ thôi dẫn Kế hoạch thực hiện v1.1 đã bị `QĐ-26` loại (`SA-06`); khối kiểm chứng pháp lý mục 7.5 **tách hai vế** _đã đọc nguyên văn điều khoản_ và _chưa có kết luận đủ pháp lý_ (`SA-08`). Người quyết là **Owner**; chưa phải xác nhận của mentor/GVHD.
**Thay đổi ở v3.10 — Owner chốt 15/09/2026, CÓ thay đổi yêu cầu** _(Phụ lục `B.13`; sổ quyết định `QĐ-29a` → `QĐ-29c`)_: **(a) `QĐ-29a`** — đóng `OQ-19`: nhánh (a) **không** qua Người duyệt chi; `FR-5.11` thêm tổng hợp seat cấp theo nhánh (a) cho Người duyệt chi. **(b) `QĐ-29b`** — đóng `OQ-20`: Người duyệt chi quyết trên **snapshot ngân sách**, có thể **hỏi Finance** (SLA không dừng); hệ thống tạo khoản cam kết khi duyệt; **Finance ghi nhận chính thức ∥ IT cấp phát** — viết lại `FR-3.4` (b)(c), `FR-3.13`, **`FR-3.14`**, `FR-5.8`, `FR-5.11`, `SoD-3`, `SoD-8`, 4.1, bảng ngoại lệ 5.3, 5.10, 5.12.1, 5.12.3, thuật ngữ. **(c) `QĐ-29c`** — bỏ `Delegation` khỏi Conceptual ERD (34 entity, 67 quan hệ); 5.12.1 C4. Người quyết là **Owner**; chưa phải xác nhận của mentor/GVHD.
**Thay đổi ở v3.9 — nhóm trưởng chốt 15/09/2026, CÓ thay đổi yêu cầu** _(Phụ lục `B.12`; sổ quyết định `QĐ-27`, `QĐ-28a` → `QĐ-28d`)_: **(a) `QĐ-27`** — **bỏ ủy quyền duyệt**: `FR-3.5` viết lại thành _không ủy quyền_; mọi chỗ dùng ủy quyền để thay người duyệt bị gỡ. **(b) `QĐ-28d`** — _escalate_ **chỉ là thông báo**, bỏ vế _"chuyển lên cấp trên"_ ở `FR-3.8`; cảnh báo backlog cho Super Admin; **`FR-3.16` mới** — chỉ xác định lại người duyệt khi dữ liệu tổ chức hoặc cấu hình vai trò đổi thật. **(c) `QĐ-28c`** — **`FR-3.15` mới**: Người duyệt chi thay thế khi xung đột lợi ích, cấu hình trước. **(d) `QĐ-28a`** — GitHub đo sử dụng bằng **lịch sử commit và tiện ích trình duyệt**; audit log organization **không** là nguồn usage vì chỉ ghi hành động quản trị — sửa 6.3.1, `KL-1`, `KL-2`, bảng chiến lược chứng minh. **(e) `QĐ-28b`** — demo tiện ích bằng _load unpacked_, force-install là thiết kế triển khai — ghi chú `FR-4.17`, `GĐ-9`, `OQ-18` mới. Người quyết là **nhóm trưởng**; chưa phải xác nhận của GVHD.
**Thay đổi ở v3.8 — xử lý góp ý của GVHD và mentor sau buổi review, nhóm trưởng chốt 14/09/2026, CÓ thay đổi yêu cầu** _(Phụ lục `B.11`; sổ quyết định `QĐ-20` → `QĐ-25`; nghiên cứu kèm theo: `Docs/Research-AI/usage-tracking-legal-vendor-research-2026-09-14.md`)_: **(a) `QĐ-20`** — bổ sung **bộ thu thập trên thiết bị công ty**: tiện ích trình duyệt **hiện thực** (`FR-4.17`, `FR-4.18`), agent trên máy **chỉ đặc tả thiết kế** (`FR-4.19`); điều kiện triển khai dựa trên **Điều 25 khoản 3 Luật 91/2025/QH15, đọc nguyên văn**; `ADR-13` mới; viết lại `RB-5`, mục 5.6.1, 7.7. **(b) `QĐ-21`** — mở rộng ma trận nhà cung cấp mục 6.3.1 lên **11 dòng**, đóng `OQ-14`. **(c) `QĐ-22`** — thêm vai trò thứ sáu **Người duyệt chi**; Finance chuyển từ _người duyệt_ sang _người kiểm soát ngân sách_; **khoản cam kết ngân sách** (`FR-3.13`, `FR-3.14`, `FR-5.8`, `SoD-7`, `SoD-8`, `INV-16`). **(d) `QĐ-23`** — **bỏ Phòng ban và Đội nhóm**; tổ chức chỉ còn cây quản lý trực tiếp và cost center. **(e) `QĐ-24`** — năm nhóm báo cáo (`FR-5.9` → `FR-5.12`). **(f) `QĐ-25`** — **hoãn dự báo lớp L2** (`FR-5.7` thành chỉ thiết kế). Người quyết là **nhóm trưởng**; góp ý do nhóm trưởng thuật lại, **không** phải xác nhận trực tiếp của GVHD.
**Thay đổi ở v3.7 — hai quyết định của nhóm trưởng, chốt 09/09/2026, CÓ thêm yêu cầu** _(Phụ lục `B.10`; sổ quyết định: `Docs/Decisions/project-decisions.md`)_: `QĐ-12` → **`FR-3.5`** _(khi người được ủy quyền chính là người yêu cầu thì bước quay về người ủy quyền, rồi mới leo cấp theo `FR-3.3`, cuối cùng là `FR-3.6`)_; `QĐ-13` → **`FR-3.12` mới** _(khi cả chuỗi không còn người duyệt hợp lệ: giữ Request ở trạng thái chờ có kiểm soát, nhắc và leo cấp theo `FR-3.8`, đồng thời báo Super Admin cấu hình lại approver dự phòng — cấu hình không phải phê duyệt nên không phá `SoD-1`)_ và một dòng mới ở bảng ngoại lệ mục 5.3. **Đổi số phiên bản vì đợt này THÊM một yêu cầu chức năng** — khác ba đợt của v3.6 vốn chỉ sửa lỗi và điều chỉnh yêu cầu đã có. Các tài liệu dẫn _"BRD v3.6"_ ở phát biểu **hiện hành** đã được cập nhật; phần dẫn trong **báo cáo review theo ngày** giữ nguyên làm lịch sử.
**Thay đổi ở v3.6 — vòng review tài liệu ngày 08/09/2026. Gồm HAI đợt; chi tiết đầy đủ ở Phụ lục `B.9`.** — **ĐỢT 1: sửa lỗi trích dẫn và tham chiếu, KHÔNG thay đổi yêu cầu chức năng nào** _(Phụ lục `B.9.2`)_: **(a)** sửa bảng truy vết mục 2.3 — `PP-1` dẫn nhầm `FR-3.6` (approver dự phòng) thay vì `FR-3.10` (Manager xác nhận Keep/Reclaim/Exempt), và mở rộng dải cho đúng phạm vi thật của hai phân hệ. **(b)** Đổi căn cứ thời lượng từ _"14 tuần"_ sang **"9 tuần phát triển thật (T1–T9)"** theo Kế hoạch thực hiện v1.0 — lập luận thu hẹp phạm vi ở mục 5.6.1, `ADR-01`, `ADR-11` mạnh lên chứ không yếu đi; **bản đăng ký đã ký không bị sửa**, chênh lệch mốc chuyển thành câu hỏi cho GVHD ở Phụ lục C.4. **(c)** Cập nhật bảng tài liệu liên quan mục 11: sửa hai phiên bản đã lạc hậu (Kế hoạch v0.2→v1.0, User Flows v0.2→v0.4) và bổ sung ba tài liệu đang hoạt động nhưng chưa được liệt kê (Context Diagram v2.0, Business Workflows v2.2, Screen Flows v1.0). **(d)** Sửa _"Ba kết luận"_ thành _"Năm kết luận"_ ở mục 6.3.1. **(e)** Bổ sung ràng buộc đã kiểm chứng cho Lớp 3 tại mục 6.3: API nhật ký kiểm toán của GitHub chỉ dùng được với Enterprise Cloud. **(f)** 🛑 **Sửa lỗi trích dẫn pháp lý nghiêm trọng ở mục 7.7.6.** Đọc bản gốc có chữ ký số của Nghị định 356/2025/NĐ-CP cho thấy bản trích điểm `l)` khoản 1 Điều 4 ở các phiên bản trước **bị cắt mất vế "và các dịch vụ khác trên không gian mạng"**. Vế này khiến danh mục **không còn đóng**, nên kết luận cũ _"công cụ công việc thông thường không thuộc nhóm nhạy cảm"_ mất căn cứ. Trích dẫn đã được sửa cho đúng nguyên văn, và `OQ-11` **được mở lại ở đợt này**. **(g)** Ghi rõ dòng lưu giữ 6 tháng của nhóm ứng dụng liên lạc ở mục 7.5 **chỉ phát sinh khi doanh nghiệp chủ động bật thu thập**, căn cứ `ADR-10`.
**Thay đổi ở v3.6 — ĐỢT 2: chín quyết định của nhóm trưởng chốt cùng ngày 08/09/2026, CÓ thay đổi yêu cầu** _(Phụ lục `B.9.1`; sổ quyết định đầy đủ: `Docs/Decisions/project-decisions.md`)_: sáu quyết định chạm BRD. `QĐ-01` mở rộng nguyên tắc thận trọng cho **mọi** ứng dụng — `FR-10.4` thành **bắt buộc cho mọi ứng dụng**, mục 7.5 rút lưu giữ bản ghi hoạt động chi tiết từ 12 xuống **6 tháng**, `ADR-10` từ hai chế độ thành **ba mức**, `OQ-11` **đóng ở mức thiết kế**. Còn lại: `QĐ-02` → `FR-3.6`; `QĐ-03` → mục 6.3; `QĐ-04` → mục 6.1 và `ADR-12` mới; `QĐ-07` → Phụ lục C.4; `QĐ-09` → `FR-4.12` và `FR-4.12b` mới. ⚠️ **Hai đính chính so với bản nháp changelog trước:** (1) phát biểu _"v3.6 không thay đổi yêu cầu nghiệp vụ nào"_ chỉ đúng với **đợt 1** — đợt 2 có đổi yêu cầu; (2) phát biểu _"`ADR-10` không đổi"_ cũng chỉ đúng với đợt 1 — đợt 2 **có sửa `ADR-10`**. Về `OQ-11`: đợt 1 **mở lại** nó, đợt 2 **đóng nó ở mức thiết kế**; trạng thái cuối của v3.6 là **đã vô hiệu hóa bằng thiết kế** (mục 10), còn **kết luận pháp lý vẫn để ngỏ**.
**Thay đổi so với v2.0:** bổ sung mục Định nghĩa thành công với 5 chỉ số đo được; bổ sung phân hệ Khởi tạo dữ liệu ban đầu (FR-9.x) và luồng tương ứng; chuyển dự báo chi phí từ "loại trừ hoàn toàn" sang mô hình ba lớp có cổng kiểm chứng sai số; giữ discovery từ log web/CASB ngoài phạm vi nhưng bổ sung giải trình đầy đủ về lý do pháp lý và hạ tầng; đóng bốn câu hỏi còn treo OQ-02, OQ-03, OQ-06, OQ-07.
**Thay đổi ở v3.1 (khẩn):** cập nhật toàn bộ khung pháp lý — Nghị định 13/2023/NĐ-CP đã **hết hiệu lực từ 01/01/2026**, thay bằng Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Nghị định 356/2025/NĐ-CP; bổ sung mục 7.7 về cơ sở pháp lý và bảng đối chiếu nghĩa vụ với thiết kế; bổ sung phân hệ Quyền của chủ thể dữ liệu (FR-10.x); điều chỉnh chính sách lưu giữ.
**Thay đổi ở v3.2:** đóng toàn bộ 8 hạng mục còn treo — chốt ngôn ngữ định vị là hệ thống nội bộ doanh nghiệp; bổ sung hồ sơ tổ chức mục tiêu (3.4), giả định và ràng buộc (3.5), trách nhiệm Business Owner (4.4, FR-1.7), nhóm người dùng không phải nhân viên chính thức (4.5, FR-2.8), chính sách xử lý nguồn dữ liệu mâu thuẫn (5.7.1, FR-7.7), thuật ngữ nghiệp vụ tiếng Việt (mục 12), và phụ lục đối chiếu với bản đăng ký đồ án (Phụ lục C).
**Thay đổi ở v3.3:** đóng bốn câu hỏi còn lại sau khi tra cứu văn bản gốc và tài liệu nhà cung cấp — OQ-08 chính sách lưu giữ, OQ-09 ngưỡng sai số dự báo, OQ-10 tiêu chí nghiệm thu thay cho mục tiêu KPI, OQ-11 dữ liệu hành vi có thuộc nhóm nhạy cảm hay không; bổ sung ADR-10, FR-1.8, FR-10.6, và ma trận khả năng truy xuất dữ liệu usage theo từng nhà cung cấp (mục 6.3.1).
**Thay đổi ở v3.4:** đóng OQ-12 và OQ-13. Xác định lại đường rủi ro pháp lý thật của nhóm ứng dụng liên lạc là qua khái niệm _dịch vụ viễn thông cơ bản trên Internet_ chứ không phải _dịch vụ truyền thông trực tuyến_; nâng cấp ADR-10 với quy tắc gắn cờ ba câu hỏi và **mặc định không thu thập dữ liệu hoạt động chi tiết** cho nhóm này; hoàn thiện ma trận truy xuất usage với 8 nhà cung cấp; bổ sung FR-4.16 về định nghĩa hoạt động của nguồn.
**Thay đổi ở v3.5:** **(a)** chốt framework backend là **NestJS**, bổ sung **ADR-11**, cập nhật mục 6.1 — đóng quyết định `QĐ-1` vốn được theo dõi ở tài liệu _Định nghĩa Phạm vi & Nghiệp vụ_ mục 6.7.1 _(mã cũ, giữ nguyên vì là changelog lịch sử; mã hiện hành là `QĐKT-01` — xem `ADR-11`)_. **(b)** Bộ tài liệu **Domain Spec (Phần 1, 1b, 1c, 2, 3, 4) đã được gỡ bỏ** vì lệch quá xa so với BRD sau bốn vòng cập nhật; phần nội dung lõi của nó — ranh giới ngữ cảnh, bất biến dữ liệu và máy trạng thái — nay được đưa thẳng vào BRD tại **mục 5.12 mới**, và mọi dẫn chiếu tới Domain Spec trong tài liệu này đã được gỡ. Hệ quả: BRD trở thành **nguồn chân lý duy nhất** về nghiệp vụ và mô hình miền. **(c)** Sửa các lỗi tồn: ô trạng thái BRD ở mục 11 ghi "v3.0" trong khi tài liệu đã v3.4; ghi chú OQ-02/03/06/07 dẫn về một tài liệu không còn tồn tại.
**Chi tiết thay đổi:** xem Phụ lục B.

---

## 1. THÔNG TIN CHUNG DỰ ÁN

| Hạng mục             | Nội dung                                                                                                                                                                                                                                                                                                                                                                                 |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tên dự án            | SaaS-Sentry — Hệ thống quản trị bản quyền phần mềm và tối ưu chi phí công nghệ                                                                                                                                                                                                                                                                                                           |
| Tên tiếng Anh        | Software License Management & Optimization System                                                                                                                                                                                                                                                                                                                                        |
| Loại sản phẩm        | **Hệ thống quản trị nội bộ doanh nghiệp**, thuộc lĩnh vực quản trị SaaS và quản lý chi phí công nghệ                                                                                                                                                                                                                                                                                     |
| Môi trường chạy      | Ứng dụng web, trình duyệt máy tính để bàn, giao diện co giãn theo màn hình                                                                                                                                                                                                                                                                                                               |
| Mô hình triển khai   | Cài đặt riêng cho từng doanh nghiệp (dedicated instance) — xem ADR-01                                                                                                                                                                                                                                                                                                                    |
| Thời gian phát triển | Học kỳ 15 tuần; **cửa sổ phát triển thật T1–T9**, hạn thật là hội đồng lần 1 ở **T12**. 📁 _Sửa ở v3.11 (`SA-06`): dòng này trước dẫn **Kế hoạch thực hiện v1.1 mục 1** — tài liệu đã bị `QĐ-26` loại khỏi baseline ngày 15/09/2026, nên **không** còn được dùng làm nguồn suy ra lịch. Hai mốc T1–T9 và T12 giữ nguyên làm ràng buộc `RB-1`; lịch chính thức chờ kế hoạch do GVHD giao_ |
| Quy mô nhân sự       | 5 thành viên (Software Engineers)                                                                                                                                                                                                                                                                                                                                                        |

> **Ghi chú v3.2 về định vị:** hai dòng "Phân khúc sản phẩm — Enterprise SaaS Management" và "Mô hình vận hành — B2B" ở các phiên bản trước dùng ngôn ngữ của một **sản phẩm nền tảng bán cho nhiều khách hàng**, trong khi toàn bộ nội dung tài liệu, ADR-01 và bản đăng ký đồ án đều mô tả một **hệ thống cài riêng cho một doanh nghiệp**. Hai cách nói này không tương thích: một nền tảng cần đăng ký tự phục vụ, quản trị xuyên tổ chức và mô hình tính phí — cả ba đều nằm ngoài phạm vi theo ADR-01.
>
> v3.2 chốt theo hướng **hệ thống**, khớp với bản đăng ký đã có chữ ký GVHD. Nếu nhóm muốn định vị lại thành nền tảng thì phải sửa ADR-01 trước, không sửa mỗi dòng chữ ở đây.

---

## 2. BỐI CẢNH VÀ NỖI ĐAU NGHIỆP VỤ (PAIN POINTS)

### 2.1. Thống kê thị trường & Bối cảnh Việt Nam

Việc doanh nghiệp cần quản trị SaaS tập trung là một vấn đề có thật. Microsoft định nghĩa Shadow IT là các ứng dụng/dịch vụ được sử dụng mà bộ phận CNTT không biết hoặc chưa phê duyệt; các rủi ro đi kèm gồm thất thoát dữ liệu, tuân thủ, bảo mật và trùng lặp license gây lãng phí ngân sách. [Microsoft Learn – Discover applications and Shadow IT](https://learn.microsoft.com/en-us/entra/global-secure-access/tutorial-internet-access-application-discovery)

SaaS Management Index 2025 của Zylo phân tích hơn 40 triệu license và 40 tỷ USD chi tiêu SaaS trong tập dữ liệu của họ; báo cáo nêu mức lãng phí license chưa dùng trung bình 21 triệu USD/năm. Đây là benchmark của một nhà cung cấp SaaS-management, chủ yếu phản ánh tổ chức lớn quốc tế, nên chỉ dùng để minh họa xu hướng và **không suy diễn trực tiếp cho doanh nghiệp Việt Nam hoặc SME**. [Zylo – 2025 SaaS Management Index](https://zylo.com/news/2025-saas-management-index)

Tại Việt Nam, việc ứng dụng cloud tiếp tục là định hướng cấp quốc gia: Quyết định 1121/QĐ-TTg phê duyệt Chương trình hành động quốc gia phát triển và chuyển đổi sang sử dụng nền tảng điện toán đám mây giai đoạn 2025–2030. Điều này củng cố tính phù hợp của bài toán quản trị SaaS, nhưng không tự nó chứng minh mức chi tiêu hay tỷ lệ lãng phí SaaS của từng doanh nghiệp. [Cổng Thông tin điện tử Chính phủ](https://chinhphu.vn/?docid=213903&pageid=27160)

Trong phạm vi dự án, bối cảnh mục tiêu là các công ty công nghệ, software outsourcing và doanh nghiệp đang chuyển đổi số, nơi việc mua và sử dụng Jira, Figma, Slack, GitHub, Zoom hoặc Microsoft 365 có thể phân tán theo phòng ban. Hệ thống tập trung vào việc tạo minh bạch dữ liệu và quy trình kiểm soát; không khẳng định một tỷ lệ lãng phí cố định nếu chưa có dữ liệu thực tế của khách hàng.

### 2.2. Các nỗi đau cốt lõi (Core Pain Points)

**PP-1 — Lãng phí "License ảo" (Ghost Seats).** Doanh nghiệp mua gói 100 tài khoản Figma nhưng thực tế chỉ có 70 nhà thiết kế đang hoạt động. 30 tài khoản còn lại vẫn bị tính tiền đều đặn. Lãng phí này có nhiều dạng khác nhau với mức độ khó phát hiện khác nhau — xem bảng phân loại tại mục 5.4.

**PP-2 — Quên hủy dịch vụ (Auto-Renewal Trap).** Dự án ngắn hạn kết thúc nhưng thẻ tín dụng công ty vẫn bị trừ tiền tự động do không có ai chịu trách nhiệm theo dõi và hủy gói. Nghiêm trọng hơn: nhiều hợp đồng yêu cầu báo hủy trước 30–60 ngày, nên khi phát hiện thì đã quá hạn báo hủy và buộc phải trả thêm một chu kỳ.

**PP-3 — Bất đối xứng thông tin giữa Tài chính và IT.** Bộ phận kế toán chỉ thấy các khoản trừ tiền trên sao kê ngân hàng mà không biết phần mềm đó do ai dùng, dùng vào việc gì, dẫn đến khó khăn trong phân bổ chi phí nội bộ (Cost Center allocation).

**PP-4 — Mua sắm phần mềm phân tán ngoài tầm kiểm soát của IT (Shadow IT).** Phòng ban tự đăng ký công cụ bằng thẻ tín dụng cá nhân hoặc thẻ công ty, thường vì quy trình mua sắm chính thức mất quá nhiều thời gian. Hệ quả:

- IT không biết dữ liệu công ty đang nằm ở đâu để bảo vệ hoặc thu hồi khi nhân viên nghỉ việc
- Finance thấy khoản chi trên sao kê nhưng không xác định được thuộc phần mềm nào
- Công ty có thể trả tiền cho hai công cụ trùng chức năng ở hai phòng ban khác nhau
- Sự phổ biến của công cụ AI tạo sinh làm vấn đề nghiêm trọng hơn, vì dữ liệu nội bộ có thể được đưa vào dịch vụ bên thứ ba mà không qua đánh giá nào

> **Ghi chú về cách phát biểu mục tiêu:** hệ thống **không** cam kết "giảm Shadow IT" theo nghĩa giảm số lượng ứng dụng, vì hệ thống không chặn được ứng dụng và không phát hiện được 100%. Mục tiêu chính xác là **đưa Shadow IT vào diện quản trị** — chuyển từ trạng thái "không ai biết" sang trạng thái "có bằng chứng, có người chịu trách nhiệm, có quyết định được ghi nhận". Chỉ số đo là **KPI-1** tại mục 2.4.

**PP-5 — Quy trình cấp phát chậm là nguyên nhân gốc của Shadow IT.** Nhân viên đi đường vòng vì đường chính thức quá chậm. Vì vậy phân hệ Approval Workflow (mục 5.3) không phải một module độc lập nằm cạnh phân hệ Discovery (mục 5.6) — nó là **biện pháp xử lý nguyên nhân**, còn Discovery chỉ xử lý triệu chứng. Hệ thống phải đo được thời gian trung bình từ lúc gửi yêu cầu tới lúc có tài khoản, và có SLA cho từng bước phê duyệt.

### 2.3. Bảng truy vết Pain Point ↔ Yêu cầu chức năng

| Pain point                  | Yêu cầu chức năng xử lý                                    | Chỉ số đo |
| --------------------------- | ---------------------------------------------------------- | --------- |
| PP-1 Ghost Seats            | FR-4.1 → FR-4.18, FR-2.3, FR-2.4, FR-3.10                  | KPI-3     |
| PP-2 Auto-Renewal Trap      | FR-1.1, FR-1.3, FR-1.4                                     | KPI-4     |
| PP-3 Bất đối xứng thông tin | FR-3.13, FR-3.14, FR-5.1, FR-5.2, FR-5.4, FR-5.8 → FR-5.12 | KPI-1     |
| PP-4 Shadow IT              | FR-6.1 → FR-6.9                                            | KPI-1     |
| PP-5 Quy trình chậm         | FR-3.4, FR-3.8, FR-3.9, FR-3.13, FR-5.11                   | KPI-2     |

> **Sửa ở v3.8:** `PP-1` mở rộng tới `FR-4.18` _(bộ thu thập trên thiết bị — `QĐ-20`)_; `PP-3` thêm Người duyệt chi, ý kiến ngân sách, khoản cam kết và bộ báo cáo _(`QĐ-22`, `QĐ-24`)_; `PP-5` thêm `FR-3.13` vì bước duyệt chi là một bước có SLA và được đo trong KPI-2.

> **Sửa ở v3.6:** dòng `PP-1` trước đây dẫn `FR-3.6` — đó là _approver dự phòng ở gốc cây tổ chức_, không liên quan Ghost Seat; mã đúng là **`FR-3.10`** (Manager chọn Keep / Reclaim / Exempt). Dải cũ `FR-4.1 → FR-4.5` chỉ phủ nguồn dữ liệu và ánh xạ danh tính, bỏ sót toàn bộ rule phát hiện; nay dẫn nguyên mục 5.4 là `FR-4.1 → FR-4.16`, trong đó `FR-4.15` là điểm _hai con số tiết kiệm tách biệt_. Bổ sung `FR-2.4` vì thu hồi suất là bước kết thúc của luồng Ghost Seat. Dòng `PP-4` mở rộng tới `FR-6.9` để gồm chống trùng lặp, phân tầng rủi ro và bước IT Admin xử lý.

### 2.4. Định nghĩa thành công _(bổ sung ở v3.0)_

BRD v2.0 mô tả rất chi tiết hệ thống làm gì nhưng không định nghĩa **thế nào là làm tốt**. Mục này bổ sung năm chỉ số, tất cả đều tính được từ chính dữ liệu hệ thống, không cần khảo sát bên ngoài.

| Mã        | Chỉ số                                               | Công thức                                                                         | Xử lý pain point    |
| --------- | ---------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------- |
| **KPI-1** | Tỷ lệ chi tiêu nằm trong danh mục đã phê duyệt       | Chi tiêu khớp CatalogEntry ÷ tổng chi tiêu quan sát được                          | PP-3, PP-4          |
| **KPI-2** | Thời gian trung bình từ gửi yêu cầu tới có tài khoản | Trung vị của `(assignment.Active − request.submitted)`, tách theo từng bước duyệt | PP-5                |
| **KPI-3** | Tỷ lệ seat đang hoạt động trên tổng seat đã mua      | Seat có hoạt động trong 30 ngày ÷ `purchased_quantity`, chỉ tính gói per-seat     | PP-1                |
| **KPI-4** | Số thuê bao gia hạn ngoài ý muốn                     | Đếm subscription tự gia hạn mà không có quyết định được ghi nhận trước hạn hủy    | PP-2                |
| **KPI-5** | Tỷ lệ khuyến nghị bị bác bỏ                          | `(Dismissed + Superseded) ÷ tổng khuyến nghị sinh ra`                             | Chất lượng hệ thống |

**Yêu cầu kèm theo:**

- **FR-0.1:** Hệ thống tính và hiển thị được cả năm chỉ số trên, kèm khoảng thời gian tính và thời điểm cập nhật.
- **FR-0.2:** KPI-2 phải tách được theo từng bước phê duyệt, không chỉ tổng thời gian — nếu không thì biết chậm mà không biết chậm ở đâu.
- **FR-0.3:** KPI-5 hiển thị trên màn hình quản trị hệ thống, không hiển thị cho Manager.
- **FR-0.4:** _(mới ở v3.8 — `QĐ-24`)_ Kèm năm KPI, hệ thống tính **ba chỉ số phụ** — không phải KPI mới, không đặt mục tiêu: **chi phí trên mỗi người dùng có hoạt động** _(chỉ gói per-seat và ứng dụng có nguồn phát hiện được G3/G4; không đủ điều kiện thì ẩn kèm lý do)_, **tỷ lệ bước phê duyệt quá SLA**, và **trạng thái bộ thu thập** _(số thiết bị đã đăng ký, đã xác nhận, gửi dữ liệu gần nhất)_. Cách trình bày theo năm nhóm báo cáo tại `FR-5.9` → `FR-5.12`.

> **Về KPI-5 — chỉ số đo chất lượng của chính hệ thống.** Tỷ lệ khuyến nghị bị Manager bác bỏ hoặc bị dữ liệu mới phủ định là thước đo trực tiếp cho mức độ báo động giả. Tỷ lệ cao nghĩa là ngưỡng đang quá nhạy, hoặc dữ liệu import quá thưa, hoặc tầng ánh xạ danh tính đang sai. Một hệ thống phát hiện lãng phí mà **tự đo được mức độ mình sai** là điểm khác biệt đáng nhấn: mục tiêu không phải "tìm ra nhiều" mà là "tìm ra đúng".

**Về việc đặt con số mục tiêu** _(chốt ở v3.3 — đóng OQ-10)_: dự án **không** đặt con số mục tiêu cho năm chỉ số trên. Lý do: chúng đo hiệu quả của **tổ chức sử dụng hệ thống**, mà tổ chức trong phạm vi demo là mô phỏng — đặt mục tiêu cho một tổ chức không có thật là đặt một con số không kiểm chứng được.

Thay vào đó, dự án cam kết hai thứ **kiểm chứng được thật**:

**(a) Hệ thống tính đúng năm chỉ số.** Kiểm chứng bằng bộ dữ liệu mô phỏng có đáp án biết trước, đối chiếu kết quả hệ thống với đáp án tính tay.

**(b) Tiêu chí nghiệm thu cho chính rule engine** — đây mới là con số dự án chịu trách nhiệm:

| Mã   | Tiêu chí                                                                                                                                               | Ngưỡng đạt | Vì sao đo được                                    |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ------------------------------------------------- |
| TC-1 | Phát hiện đúng toàn bộ trường hợp nhóm G1 và G2 trong bộ dữ liệu kiểm thử                                                                              | **100%**   | Hai nhóm này tất định, chỉ dùng dữ liệu nội bộ    |
| TC-2 | **Số báo động giả trên các hồ sơ đặt bẫy** — nhân viên mới vào, đang nghỉ dài, tài khoản dịch vụ, định danh chưa khớp, assignment ngoài cửa sổ dữ liệu | **Bằng 0** | Bộ dữ liệu mô phỏng cố tình cài sẵn các hồ sơ này |
| TC-3 | Mọi khuyến nghị sinh ra đều truy được về đầy đủ căn cứ đã chụp lại                                                                                     | **100%**   | Kiểm tra trường bằng chứng của từng khuyến nghị   |
| TC-4 | Không có khuyến nghị nào được sinh khi nguồn dữ liệu quá hạn hoặc chưa khớp danh tính                                                                  | **100%**   | Kiểm tra tám cổng lọc của FR-4.9                  |

> **TC-2 là tiêu chí quan trọng nhất và cũng là điểm nên nhấn khi bảo vệ.** Chứng minh hệ thống **không báo động giả** có giá trị hơn chứng minh nó tìm ra nhiều: một hệ thống báo động giả sẽ bị người quản lý bỏ qua sau hai tuần, dù nó chạy đúng về mặt kỹ thuật. Đây cũng là lý do bộ dữ liệu mô phỏng bắt buộc phải chứa sẵn các hồ sơ cần loại trừ (mục 6.3).

---

## 3. PHẠM VI DỰ ÁN (PROJECT SCOPE)

### 3.1. Thuộc phạm vi phát triển (In-Scope)

| Phân hệ                               | Nội dung                                                                                                                                                                  |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Khởi tạo dữ liệu ban đầu**          | Đưa doanh nghiệp từ trạng thái chưa có dữ liệu tới trạng thái hệ thống tạo được giá trị _(bổ sung ở v3.0)_                                                                |
| Danh mục SaaS                         | Quản lý tập trung thông tin dịch vụ đám mây doanh nghiệp đang mua bản quyền                                                                                               |
| Quản lý Hợp đồng & Thuê bao           | Chu kỳ thanh toán, ngày hết hạn, hạn chót báo hủy, nhắc gia hạn chủ động                                                                                                  |
| Phân bổ License/Seat                  | Gán quyền sử dụng cho từng nhân viên, theo dõi trạng thái seat                                                                                                            |
| Quản lý tổ chức & Luồng phê duyệt     | Cây quản lý trực tiếp và Cost Center; định tuyến phê duyệt theo nhu cầu và tác động chi phí; Người duyệt chi _(v3.8 — bỏ Phòng ban, Team theo `QĐ-23`)_                   |
| Thực thi cấp phát (Provisioning)      | Cấp/thu hồi qua connector được phê duyệt hoặc tác vụ thủ công có theo dõi; đối soát sai lệch với nhà cung cấp                                                             |
| Phân tích hiệu suất sử dụng           | Import file log hoạt động, xác định Last Active Date, khuyến nghị cắt giảm                                                                                                |
| **Bộ thu thập trên thiết bị công ty** | **Tiện ích trình duyệt** gửi dữ liệu sử dụng đã lọc tại nguồn; đăng ký thiết bị và xác nhận chủ động của nhân viên _(v3.8 — `QĐ-20`)_. Agent trên máy chỉ đặc tả thiết kế |
| Dashboard Tài chính                   | Chi phí theo tháng/quý/năm, phân bổ theo cost center, dự án, cây người phụ trách; Budget vs Actual vs **khoản cam kết**; báo cáo tiết kiệm                                |
| Phát hiện SaaS ngoài danh mục         | Đối chiếu danh mục đã duyệt với dữ liệu tài chính và OAuth consent được phép import                                                                                       |
| Quản trị hệ thống & Audit             | Quản lý người dùng, vai trò, quyền, cấu hình ngưỡng, nhật ký kiểm toán                                                                                                    |
| **Đo lường hiệu quả**                 | Tính và hiển thị năm chỉ số tại mục 2.4 _(bổ sung ở v3.0)_; báo cáo hiệu suất và chất lượng `FR-5.10`, `FR-5.12` _(v3.8)_                                                 |
| **Quyền của chủ thể dữ liệu**         | Nhân viên xem và yêu cầu xuất dữ liệu của chính mình; xóa tự động theo chính sách lưu giữ _(bổ sung ở v3.1)_                                                              |

### 3.2. Ngoài phạm vi phát triển (Out-of-Scope)

**Nhóm nền tảng:**

- Không phát triển ứng dụng di động
- Không tích hợp trực tiếp phần cứng hoặc hệ thống mạng
- Không tích hợp cổng thanh toán để tự động hủy/mua gói từ nhà cung cấp
- Không tự triển khai CASB, firewall hoặc proxy cho khách hàng _(sửa ở v3.8: gỡ "endpoint agent" khỏi dòng này — xem hai dòng dưới)_
- **Không hiện thực agent trên máy trong MVP** — chỉ đặc tả thiết kế tại `FR-4.19`; nâng lên hiện thực bằng một quyết định riêng nếu còn thời gian _(v3.8 — `QĐ-20`)_
- **Tiện ích trình duyệt thuộc phạm vi** (`FR-4.17`), nhưng **không** thu nhật ký truy cập web đầy đủ: chỉ giữ tên miền nằm trong danh sách cho phép, lọc ngay trên máy
- Không tự động chặn ứng dụng hoặc thu hồi quyền chỉ dựa trên cảnh báo

**Nhóm mô hình triển khai** _(theo ADR-01)_:

- Không có đăng ký tự phục vụ (tenant self-signup) và luồng onboarding khách hàng mới
- Không có trang quản trị cấp platform (xuyên tổ chức)
- Không có cấu hình giao diện/thương hiệu riêng theo từng khách hàng
- Không triển khai Row-Level Security và vòng lặp đa tổ chức trong background job
- Không xây dựng mô hình thuê bao/tính phí của chính SaaS-Sentry

**Nhóm thu hẹp có chủ đích** _(xem mục 9 để biết lý do)_:

- Không triển khai khuyến nghị hạ gói dựa trên mức độ sử dụng chi tiết (nhóm G5, mục 5.4)
- **Không triển khai discovery từ log web/firewall/proxy/CASB đầy đủ** — xem giải trình tại mục 5.6.1 _(mở rộng ở v3.0; v3.8 tách riêng phần tiện ích trình duyệt lọc theo danh sách cho phép)_
- Không tích hợp hệ thống nhân sự (HRM) để lấy dữ liệu nghỉ phép
- **Không triển khai lớp L2 của dự báo chi phí trong MVP** — `FR-5.7` giữ làm đặc tả thiết kế _(v3.8 — `QĐ-25`)_
- Không có ma trận nhiều ngưỡng tiền cho thẩm quyền chi — **một** Người duyệt chi do Super Admin cấu hình _(v3.8 — `QĐ-22`)_

> **Thay đổi ở v3.0:** dòng "không áp dụng hồi quy hoặc mô hình chuỗi thời gian cho dự báo chi phí" đã được **gỡ khỏi mục Out-of-Scope** và chuyển sang mục 3.3 dưới dạng phạm vi có điều kiện. Lý do: bản đăng ký đồ án vốn phát biểu điều này dưới dạng điều kiện _("chỉ được dùng khi dữ liệu lịch sử đủ và có đánh giá sai số")_, nên cách trung thành nhất là **hiện thực chính cái điều kiện đó**, thay vì loại bỏ hoàn toàn.

### 3.3. Phạm vi có điều kiện _(mục mới ở v3.0)_

Một số năng lực chỉ được kích hoạt khi dữ liệu đạt điều kiện kiểm chứng. Hệ thống **tự đánh giá điều kiện và tự quyết định có hiển thị kết quả hay không** — người dùng không tự bật.

| Năng lực                                       | Điều kiện kích hoạt                                                                                                                                                     | Khi không đạt điều kiện                                                                                                                                     |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dự báo chi phí biến động bằng mô hình xu hướng | Có tối thiểu 12 tháng dữ liệu chi tiêu **và** sai số kiểm chứng lùi nằm trong ngưỡng                                                                                    | Không hiển thị dự báo mô hình; chỉ hiển thị khoảng kịch bản, kèm lý do vì sao ẩn. ⏸️ **v3.8 — `QĐ-25`: không hiện thực trong MVP**, dòng này giữ làm đặc tả |
| Phát hiện lãng phí nhóm G3, G4                 | Nguồn usage có trường ngày hoạt động cuối và cửa sổ bao phủ đủ dài, **hoặc** có dữ liệu từ bộ thu thập trên thiết bị của nhân viên **đã xác nhận** (`FR-4.18`) _(v3.8)_ | Chỉ chạy G1, G2; giao diện nêu rõ giới hạn của nguồn hiện có                                                                                                |
| Đối soát tự động với nhà cung cấp              | Ứng dụng có connector đã được cấu hình                                                                                                                                  | Chỉ đối soát các ứng dụng có connector; phần còn lại không sinh sai lệch giả                                                                                |

> **Nguyên tắc chung của mục này:** khi điều kiện không đạt, hệ thống **im lặng về mặt kết luận nhưng lên tiếng về mặt lý do**. Nó không đưa ra con số kém tin cậy, và cũng không để trống mà không giải thích.

### 3.4. Hồ sơ tổ chức mục tiêu _(mục mới ở v3.2)_

Không có mô tả này thì mọi con số trong phần demo đều lơ lửng, và không ai biết hệ thống được thiết kế cho quy mô nào.

| Đặc điểm         | Giá trị mục tiêu                                                                                     | Vì sao chọn mức này                                                 |
| ---------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Loại hình        | Công ty công nghệ, software outsourcing, doanh nghiệp đang chuyển đổi số                             | Nơi việc dùng SaaS đã đủ nhiều để trở thành vấn đề                  |
| Quy mô nhân sự   | 100–500 người                                                                                        | Đủ lớn để mất kiểm soát; đủ nhỏ để chưa mua nổi nền tảng thương mại |
| Số ứng dụng SaaS | 15–40 ứng dụng                                                                                       | Vượt ngưỡng quản lý được bằng bảng tính                             |
| Cơ cấu tổ chức   | Có cây quản lý trực tiếp rõ ràng và cost center _(v3.8 — hệ thống không quản lý phòng ban, `QĐ-23`)_ | Điều kiện để luồng phê duyệt có ý nghĩa                             |
| Hiện trạng CNTT  | 1–3 IT Admin; có thể chưa có hệ thống định danh tập trung                                            | Lý do việc import file là nền móng, connector là bổ sung            |
| Dữ liệu sẵn có   | Chủ yếu là file xuất thủ công từ trang quản trị của nhà cung cấp                                     | Quyết định toàn bộ chiến lược dữ liệu tại mục 6.3                   |

**Không phải đối tượng mục tiêu:** tập đoàn trên 5.000 nhân sự (đã có nền tảng thương mại và đội vận hành riêng), doanh nghiệp dưới 30 người (bảng tính vẫn đủ), và tổ chức chưa dùng SaaS ở mức đáng kể.

> Hồ sơ này cũng là **cơ sở để sinh dữ liệu mô phỏng**: bộ dữ liệu demo phải khớp quy mô ở bảng trên, không phải một con số tùy chọn.

### 3.5. Giả định và ràng buộc _(mục mới ở v3.2)_

#### 3.5.1. Giả định về môi trường triển khai

Mỗi giả định kèm hệ quả nếu nó sai — đây là phần quan trọng hơn bản thân giả định.

| Mã   | Giả định                                                                                                                                                                                                                                                                                                        | Nếu giả định sai thì sao                                                                                                                                                                                                                                                                                            |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GĐ-1 | Doanh nghiệp xuất được danh sách nhân sự dạng file, có quản lý trực tiếp và cost center _(v3.8)_                                                                                                                                                                                                                | Không dựng được cây tổ chức ⟹ **toàn bộ luồng phê duyệt không chạy được**                                                                                                                                                                                                                                           |
| GĐ-2 | Mỗi nhân viên có đúng một email công việc, dùng làm khóa ánh xạ chính                                                                                                                                                                                                                                           | Tầng ánh xạ danh tính phải dựa vào khớp thủ công ⟹ hàng đợi chưa khớp phình to                                                                                                                                                                                                                                      |
| GĐ-3 | IT Admin có quyền quản trị trên các ứng dụng SaaS để lấy danh sách thành viên                                                                                                                                                                                                                                   | Không lấy được dữ liệu usage ⟹ chỉ chạy được nhóm lãng phí G1 và G2                                                                                                                                                                                                                                                 |
| GĐ-4 | Hợp đồng và hóa đơn tồn tại dưới dạng file tải lên được                                                                                                                                                                                                                                                         | Không có hạn báo hủy và đơn giá ⟹ mất phân hệ cảnh báo gia hạn và ước tính tiết kiệm                                                                                                                                                                                                                                |
| GĐ-5 | Doanh nghiệp có **một người có thẩm quyền chi** giữ vai Người duyệt chi, và **một người Tài chính** kiểm soát ngân sách _(viết lại ở v3.8 — `QĐ-22`; sửa v3.10 — `QĐ-29b`)_                                                                                                                                     | Thiếu người thẩm quyền chi ⟹ Request có chi phí dừng ở trạng thái chờ có kiểm soát (`FR-3.12`). Thiếu Tài chính ⟹ Người duyệt chi vẫn quyết được trên snapshot ngân sách, nhưng yêu cầu thông tin không có người trả lời và khoản cam kết không được ghi nhận chính thức; **không** được gộp vào IT Admin (`SoD-3`) |
| GĐ-6 | Phần lớn phần mềm được mua bằng tài khoản doanh nghiệp, thanh toán qua kênh có sao kê                                                                                                                                                                                                                           | Phân hệ phát hiện ngoài danh mục mất nguồn bằng chứng chính                                                                                                                                                                                                                                                         |
| GĐ-7 | Doanh nghiệp chấp nhận cập nhật tay trạng thái nghỉ phép dài                                                                                                                                                                                                                                                    | Điều kiện loại trừ số 3 của FR-4.9 không hoạt động ⟹ báo động giả với người nghỉ dài                                                                                                                                                                                                                                |
| GĐ-8 | Lấy được tỷ giá từ nguồn công khai và cập nhật định kỳ                                                                                                                                                                                                                                                          | Phải nhập tỷ giá tay ⟹ báo cáo đa tiền tệ kém tin cậy                                                                                                                                                                                                                                                               |
| GĐ-9 | Doanh nghiệp **quản lý được trình duyệt trên máy công ty cấp** để cài bắt buộc tiện ích _(mới ở v3.8)_. _(v3.9 — `QĐ-28b`)_ Demo của đồ án **không** chứng minh giả định này: máy nhóm không được quản lý, tiện ích nạp bằng _load unpacked_; điều kiện force-install tiện ích ngoài Web Store còn mở ở `OQ-18` | Không có bộ thu thập ⟹ chỉ còn nguồn nhà cung cấp; ứng dụng không có bản xuất hoạt động ở gói đang dùng chỉ phát hiện được G1, G2                                                                                                                                                                                   |

#### 3.5.2. Ràng buộc của dự án

| Mã   | Ràng buộc                                                                                        | Ảnh hưởng tới thiết kế                                                                                                                                                                                                                                                                                                           |
| ---- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RB-1 | **9 tuần phát triển thật** (T1–T9, trước cổng `RV-3`), 5 thành viên, đồng thời học các môn khác  | Buộc phải cắt phạm vi có chủ đích — xem mục 9                                                                                                                                                                                                                                                                                    |
| RB-2 | Không tiếp cận được môi trường doanh nghiệp thật                                                 | Dữ liệu chủ yếu mô phỏng; cần chiến lược ba lớp tại mục 6.3 để vẫn có bằng chứng thật                                                                                                                                                                                                                                            |
| RB-3 | Phần lớn nhà cung cấp đặt tính năng xuất nhật ký hoạt động ở gói cao mà nhóm không tiếp cận được | Chỉ demo được một vài nguồn; ranh giới hệ thống phải đặt ở **định dạng file**, không đặt ở nhà cung cấp                                                                                                                                                                                                                          |
| RB-4 | Không có ngân sách mua gói SaaS bậc cao                                                          | Connector demo giới hạn ở nhà cung cấp có API miễn phí                                                                                                                                                                                                                                                                           |
| RB-5 | Nhóm không có chuyên môn pháp lý _(viết lại ở v3.8 — `QĐ-20`)_                                   | Phần chạm dữ liệu nhạy cảm — dữ liệu từ bộ thu thập trên thiết bị — **chỉ hiện thực khi thỏa đủ điều kiện đọc được từ văn bản gốc** (`ADR-13`, mục 7.7.7): lọc tại nguồn, xác nhận chủ động, không thu nội dung. Nhật ký truy cập web đầy đủ vẫn ngoài phạm vi (mục 5.6.1). Phát biểu tuân thủ vẫn cần ý kiến pháp lý chuyên môn |

> **Vì sao mục này đáng có trong BRD:** phần lớn quyết định thu hẹp phạm vi ở mục 9 đều bắt nguồn từ một ràng buộc cụ thể ở đây. Khi bảo vệ, trả lời _"chúng em không làm X vì ràng buộc RB-3"_ mạnh hơn hẳn _"chúng em không kịp làm X"_.

---

## 4. ĐỐI TƯỢNG SỬ DỤNG (USER PERSONAS)

Hệ thống có **6 vai trò người dùng** và **1 tác nhân hệ thống** _(v3.8 — thêm Người duyệt chi theo `QĐ-22`)_.

> **Nguyên tắc rút gọn của toàn bộ mục này:** _người quyết định nhu cầu (Manager), người quyết định chi tiền (Người duyệt chi) và người thực hiện kỹ thuật (IT Admin) là ba vai khác nhau; Tài chính kiểm soát ngân sách nhưng không quyết chi; và không ai được duyệt yêu cầu của chính mình._ Tám nguyên tắc SoD tại mục 4.2 đều suy ra từ câu này.
>
> **Sửa ở v3.8:** câu cũ viết _"người duyệt chi phí"_ là Finance. Theo góp ý của mentor, trong doanh nghiệp thực tế kế toán **không có thẩm quyền quyết chi** — người quyết là người có thẩm quyền chi (CTO/CEO). Finance chuyển sang **kiểm soát ngân sách**. _(Sửa ở v3.10 — `QĐ-29b`)_ Finance **không** nằm trên đường duyệt: người quyết xem snapshot ngân sách và hỏi Finance khi cần; Finance ghi nhận ngân sách và khoản cam kết **sau khi** quyết. _(v3.8 → v3.9: Finance ghi ý kiến trước khi quyết.)_

### 4.1. Bảng vai trò

| Vai trò                                                       | Trách nhiệm chính                                                                                 | Hành động chính                                                                                                                                                                                                                                                                                           | AI hỗ trợ                                                    |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **Super Admin**<br>Quản trị hệ thống                          | Quản lý người dùng, vai trò, phân quyền, cấu hình hệ thống, giám sát audit                        | Tạo/khóa tài khoản đăng nhập, gán vai trò, cấu hình ngưỡng và tham số, xem toàn bộ Audit Trail, quản lý job và trạng thái đồng bộ                                                                                                                                                                         | Không                                                        |
| **IT Admin**<br>Quản trị viên CNTT                            | SaaS Catalog, license, cấp/thu hồi seat, import dữ liệu usage, xử lý cảnh báo SaaS ngoài danh mục | Quản lý danh mục và hợp đồng, thực hiện cấp/thu hồi seat, import file, xem xét và quyết định trên Discovery Finding, xử lý sai lệch với nhà cung cấp                                                                                                                                                      | Có — trợ lý phân loại Shadow IT (tùy chọn)                   |
| **Manager**<br>Quản lý trực tiếp _(v3.8)_                     | Xác nhận nhu cầu nghiệp vụ của nhân viên trực thuộc, tham gia review Ghost Seat và access review  | Phê duyệt/từ chối request trong phạm vi quản lý, tạo request thay nhân viên khi onboarding, chọn Keep/Reclaim/Exempt kèm lý do, xem usage summary của cấp dưới                                                                                                                                            | Có — tóm tắt tình trạng license của cấp dưới (tùy chọn)      |
| **Người duyệt chi**<br>Người có thẩm quyền chi _(mới ở v3.8)_ | Quyết định cuối cho mọi khoản chi và mọi thay đổi danh mục SaaS của công ty                       | Duyệt/từ chối request **phát sinh chi phí** hoặc **SaaS chưa có trong danh mục** (`FR-3.4`) trên **snapshot ngân sách**, **tùy chọn hỏi Finance** (`FR-3.14`); quyết định gia hạn, giảm số lượng, hủy thuê bao; xem báo cáo tổng chi, tiết kiệm, tóm tắt quy trình gồm seat cấp theo nhánh (a) _(v3.10)_  | Không                                                        |
| **Finance**<br>Quản lý Tài chính/Kế toán                      | **Kiểm soát ngân sách** _(v3.8 — không còn là người duyệt)_, giám sát dòng tiền, đối soát hóa đơn | Trả lời **yêu cầu thông tin ngân sách** khi Người duyệt chi hỏi; **ghi nhận ngân sách chính thức sau khi duyệt chi** trên khoản cam kết (`FR-3.14`, `FR-5.8`) — **không** nằm trên đường duyệt _(v3.10 — `QĐ-29b`)_; xem Budget vs Actual, đối soát hóa đơn với seat và usage, xem lịch gia hạn và dự báo | Có — trợ lý tra cứu hợp đồng và diễn giải chi phí (tùy chọn) |
| **Employee**<br>Nhân viên                                     | Người sử dụng trực tiếp tài khoản công nghệ                                                       | Xem danh sách phần mềm được cấp, gửi request cấp mới/đổi gói/gia hạn có thời hạn/hoàn trả seat                                                                                                                                                                                                            | Không                                                        |
| **Automation Service**<br>Tác nhân hệ thống                   | Chạy rule định kỳ, sinh cảnh báo và khuyến nghị, chuẩn hóa dữ liệu import                         | Chạy trong background queue, sinh khuyến nghị kèm nguồn dữ liệu và mức độ tin cậy, duy trì Audit Trail                                                                                                                                                                                                    | —                                                            |

### 4.2. Ranh giới quyền hạn (Separation of Duties)

Đây là nguyên tắc thiết kế bắt buộc, không phải khuyến nghị:

| Nguyên tắc | Diễn giải                                                                                                                                                                                                                                                  |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SoD-1**  | Super Admin **không** gán/thu hồi seat và **không** phê duyệt request nghiệp vụ. Vai trò này chỉ quản trị hệ thống. Nếu Super Admin làm được mọi thứ thì việc tách vai trò mất ý nghĩa                                                                     |
| **SoD-2**  | Manager không tự cấp/thu hồi quyền, không xem hợp đồng, dữ liệu tài chính toàn công ty hoặc raw activity log                                                                                                                                               |
| **SoD-3**  | Finance không thực hiện thao tác kỹ thuật, không tự cấp/thu hồi tài khoản, và **không quyết định chi** — chỉ trả lời yêu cầu thông tin ngân sách, ghi nhận ngân sách và theo dõi khoản cam kết _(viết lại ở v3.8; sửa v3.10)_                              |
| **SoD-4**  | Người yêu cầu không được tự phê duyệt yêu cầu của chính mình, kể cả khi có vai trò cho phép phê duyệt                                                                                                                                                      |
| **SoD-5**  | IT Admin là bên duy nhất thực hiện thay đổi license seat, và chỉ sau khi đủ phê duyệt                                                                                                                                                                      |
| **SoD-6**  | Automation Service không tự phê duyệt chi phí, không tự cấp/thu hồi seat, không tự chặn ứng dụng                                                                                                                                                           |
| **SoD-7**  | _(mới ở v3.8)_ Người duyệt chi không cấp/thu hồi seat, không thực hiện thao tác kỹ thuật, và không duyệt chi cho Request mà mình là **người yêu cầu hoặc người thụ hưởng**                                                                                 |
| **SoD-8**  | _(mới ở v3.8; phát biểu lại v3.10 — `QĐ-29b`)_ Người **trả lời yêu cầu thông tin ngân sách** hoặc **ghi nhận ngân sách** và Người duyệt chi của **cùng một Request** phải là hai người khác nhau — ý kiến kiểm soát không được do chính người quyết đưa ra |

> **Một ngoại lệ có chủ đích, chốt ở v3.8:** nếu **Manager trực tiếp** của người yêu cầu **chính là Người duyệt chi**, hệ thống **vẫn giữ hai bước riêng** — nhu cầu và chi phí — cho cùng một người, và nhật ký gắn cờ _cùng người_. Hai quyết định khác loại vẫn truy vết được riêng, còn nguyên tắc cốt lõi _không ai tự duyệt yêu cầu của chính mình_ (`SoD-4`, `SoD-7`) vẫn giữ.
>
> **Bổ sung ở v3.9 — `QĐ-28c`:** khi Người duyệt chi là **người yêu cầu hoặc người thụ hưởng**, bước duyệt chi của Request đó do **Người duyệt chi thay thế khi xung đột** đã cấu hình trước đảm nhận (`FR-3.15`). Đây không phải ủy quyền: không ai trong luồng tự chọn người thay.

### 4.3. Vai trò là thuộc tính, không phải danh tính

Một người có thể mang nhiều vai trò đồng thời (ví dụ IT Admin cũng là Employee và cần xin seat cho chính mình). Hệ thống tách **tài khoản đăng nhập** khỏi **hồ sơ nhân sự**:

- `Employee` — hồ sơ nhân sự, tồn tại kể cả khi người đó không có tài khoản đăng nhập
- `AppUser` — tài khoản đăng nhập, liên kết tới một Employee
- `Role` — nhiều vai trò gán cho một AppUser

Vai trò **Manager là vai trò phái sinh**: hệ thống suy ra từ việc có nhân viên nào trỏ `manager_id` về người đó, thay vì gán tay — tránh lệch dữ liệu khi tổ chức thay đổi.

Vai trò **Người duyệt chi được gán tay** _(v3.8)_: Super Admin cấu hình **một** Employee giữ vai này, mặc định là CEO. Thẩm quyền chi không suy ra được từ cây quản lý, nên không thể phái sinh như Manager.

### 4.4. Người sở hữu nghiệp vụ của ứng dụng (Business Owner) _(mục mới ở v3.2)_

FR-1.1 yêu cầu mỗi ứng dụng trong danh mục phải có một "người sở hữu nghiệp vụ", nhưng các phiên bản trước không nói người đó làm gì. Kết quả là một trường dữ liệu bắt buộc mà không ai biết điền để làm gì.

**Business Owner là một thuộc tính gắn vào ứng dụng, không phải một vai trò đăng nhập riêng.** Người giữ vai trò này thường đã là Manager hoặc IT Admin; hệ thống không tạo thêm quyền đăng nhập mới.

| Trách nhiệm                                                                                          | Khi nào phát sinh                                      |
| ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Trả lời câu hỏi _"ứng dụng này dùng để làm gì, ai nên được cấp"_                                     | Khi IT Admin hoặc Manager cần bối cảnh trước khi duyệt |
| Nhận cảnh báo trước hạn báo hủy, cùng IT Admin và Tài chính                                          | Tại các mốc cảnh báo của FR-1.4                        |
| Cho ý kiến khi phát hiện một ứng dụng ngoài danh mục **trùng chức năng** với ứng dụng mình phụ trách | Trong luồng xử lý phát hiện ngoài danh mục (FR-6.9)    |
| Xác nhận khi ứng dụng được đề xuất chuyển sang trạng thái ngừng sử dụng                              | Khi doanh nghiệp cân nhắc bỏ một ứng dụng              |

**Ranh giới:** Business Owner **không** được cấp hay thu hồi seat — SoD-5 vẫn áp dụng nguyên vẹn. Vai trò này cung cấp bối cảnh và ý kiến, không thực hiện thao tác.

- **FR-1.7:** Mỗi mục trong danh mục SaaS bắt buộc có một Business Owner đang làm việc. Khi người đó chuyển trạng thái sang đã nghỉ việc, hệ thống cảnh báo IT Admin chỉ định người thay thế và **không** để trường này rỗng.
- **FR-1.8:** Mỗi mục trong danh mục có cờ **nhóm dịch vụ liên lạc** (`is_communication_service`). Ứng dụng mang cờ này — công cụ nhắn tin, họp trực tuyến, thư điện tử — được áp dụng chế độ xử lý dữ liệu chặt hơn theo ADR-10, bất kể kết luận pháp lý cuối cùng về việc chúng có thuộc nhóm dữ liệu nhạy cảm hay không.

### 4.5. Nhóm người dùng không phải nhân viên chính thức _(mục mới ở v3.2)_

Các phiên bản trước chỉ nói tới "nhân viên". Thực tế có bốn nhóm khác, và mỗi nhóm ảnh hưởng trực tiếp tới rule phát hiện lãng phí ở mục 5.4.

| Nhóm                          | Vấn đề đặc thù                                                   | Cách xử lý trong MVP                                                                      |
| ----------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Nhà thầu, freelancer          | Không có mã nhân viên chuẩn, nhưng có ngày kết thúc rõ ràng      | Quản lý như Employee, **bắt buộc** có ngày kết thúc dự kiến trên Assignment               |
| Thực tập sinh                 | Vòng đời ngắn, rất dễ quên thu hồi                               | Như nhà thầu; hệ thống nhắc trước ngày kết thúc 7 ngày                                    |
| Tài khoản dùng chung của team | Không thuộc về một cá nhân, không đánh giá được mức dùng cá nhân | Gán cho **một người chịu trách nhiệm**; loại khỏi rule ghost seat, nhưng vẫn tính chi phí |
| Tài khoản dịch vụ (bot, CI)   | Không "đăng nhập" theo cách thông thường                         | Đã có cờ loại trừ tại FR-4.9 điều kiện 2; **bắt buộc ghi chú lý do**                      |

> **Vì sao bắt buộc ghi chú lý do cho tài khoản dịch vụ:** cờ này là một cửa thoát khỏi toàn bộ cơ chế phát hiện lãng phí. Nếu bật được mà không cần giải thích, sau vài tháng sẽ có hàng chục seat mang nhãn "tài khoản dịch vụ" mà không ai nhớ vì sao — và hệ thống mất khả năng phát hiện đúng thứ nó sinh ra để phát hiện.

- **FR-2.8:** Assignment gắn với nhà thầu, freelancer hoặc thực tập sinh **bắt buộc** có ngày kết thúc dự kiến. Hệ thống nhắc IT Admin và quản lý trực tiếp trước 7 ngày, và đưa vào hàng đợi cần xử lý khi quá hạn.

---

## 5. YÊU CẦU CHỨC NĂNG CHI TIẾT (FUNCTIONAL REQUIREMENTS)

Các yêu cầu dưới đây mô tả phạm vi MVP; chi tiết UI, API contract và acceptance criteria sẽ được bổ sung trong SRS/backlog.

### 5.1. Phân hệ Quản lý Danh mục SaaS & Hợp đồng

**Mô hình dữ liệu:** BRD v1.0 gộp danh mục, gói, hợp đồng và hóa đơn vào một khai báo. Từ v2.0 tách thành chuỗi:

```
Vendor → SaaS Product → Plan → Subscription → (Contract, Invoice)
```

- **Contract** — văn bản pháp lý, có thể bao nhiều Subscription, có thể kéo nhiều năm
- **Subscription** — một chu kỳ mua cụ thể: gói nào, bao nhiêu seat, từ ngày nào đến ngày nào, giá bao nhiêu
- **Invoice** — sự kiện thanh toán thực tế

Ngày gia hạn thuộc Subscription, **không** thuộc Contract — một hợp đồng khung 3 năm có thể chứa nhiều chu kỳ gia hạn.

**Yêu cầu:**

- **FR-1.1:** IT Admin khai báo dịch vụ SaaS mới gồm: tên phần mềm, nhà cung cấp, tên miền liên quan, mức độ nhạy cảm dữ liệu, người sở hữu nghiệp vụ, trạng thái phê duyệt.
- **FR-1.2:** Khai báo gói (Plan) với **mô hình giá** là thuộc tính bắt buộc: `per_seat`, `flat_rate`, `concurrent`, `consumption`, `per_host`. Mô hình giá quyết định các phân hệ phía sau có áp dụng được hay không (xem ADR-02).
- **FR-1.3:** Khai báo thuê bao (Subscription) gồm: số lượng seat đã mua, đơn giá, chu kỳ thanh toán, ngày bắt đầu, ngày kết thúc, ngày gia hạn, **hạn chót báo hủy**, cờ tự động gia hạn, và cờ cho phép giảm số lượng giữa kỳ.
- **FR-1.4:** Cảnh báo chủ động tính theo **hạn chót báo hủy**, không tính theo ngày gia hạn.
  > _Lý do:_ nếu hợp đồng yêu cầu báo hủy trước 30 ngày mà hệ thống chỉ cảnh báo trước 7 ngày so với ngày gia hạn thì cảnh báo đã vô dụng — đúng vào PP-2. Ngưỡng cảnh báo mặc định: 15 và 7 ngày trước hạn chót báo hủy, cấu hình được.
  >
  > _Trường hợp thiếu dữ liệu:_ nếu không có hạn chót báo hủy nhưng hợp đồng có số ngày báo trước, hệ thống suy ra và **ghi rõ đây là giá trị suy ra, chưa xác nhận**. Nếu thiếu cả hai mà thuê bao có tự động gia hạn, hệ thống **không suy đoán** mà hiển thị cảnh báo chất lượng dữ liệu.
- **FR-1.5:** Quản lý tệp đính kèm hóa đơn/hợp đồng gốc (PDF, ảnh). File không được truy cập công khai; hệ thống phát signed URL có thời hạn.
- **FR-1.6:** Mọi trường tiền lưu kèm loại tiền tệ gốc, tỷ giá và ngày áp dụng tỷ giá, cùng giá trị đã quy đổi về đồng tiền báo cáo của tổ chức (xem ADR-03).

### 5.2. Phân hệ Phân bổ License & Quản lý Nhân sự

**Mô hình seat:** hệ thống **không** tạo N bản ghi cho gói N seat. Thay vào đó lưu số lượng đã mua trên Subscription và đếm số Assignment đang chiếm chỗ. Seat trống là giá trị dẫn xuất (xem ADR-02).

- **FR-2.1:** Quản lý danh sách nhân viên được đồng bộ hoặc import (mã nhân viên, họ tên, email công việc, trạng thái làm việc, ngày vào/nghỉ).
- **FR-2.2:** Quản lý quan hệ tổ chức **có lịch sử**: mỗi nhân viên gắn với Cost Center và Direct Manager trong một khoảng thời gian hiệu lực. Khi nhân viên đổi người quản lý hoặc cost center, hệ thống tạo bản ghi mới thay vì ghi đè (xem ADR-04).
  > _Sửa ở v3.8 — `QĐ-23`:_ bỏ Department và Team. Hệ thống **không** quản lý phòng ban; nếu file nhân sự có cột tên phòng ban thì chỉ lưu làm **nhãn hiển thị tùy chọn**, không dùng cho định tuyến, phân quyền, ngưỡng hay báo cáo.
  > _Lý do:_ nếu chỉ lưu trạng thái hiện tại thì báo cáo chi phí của các tháng trước sẽ bị gán sai Cost Center.
- **FR-2.3:** Cấp phát seat (Assign): IT Admin gán một seat trống cho nhân viên sau khi request đủ phê duyệt. Hệ thống ghi nhận Assignment ở trạng thái tương ứng và sinh **tác vụ thực thi** riêng biệt.
- **FR-2.4:** Thu hồi seat (Deprovision): khi nhân viên nghỉ việc, chuyển dự án hoặc hoàn trả, IT Admin thu hồi Assignment; seat quay về trạng thái trống để tái phân bổ.
- **FR-2.5:** Tách **ý định nghiệp vụ** khỏi **thực thi kỹ thuật**. Assignment ghi nhận quyết định của tổ chức; Provisioning Task ghi nhận việc tạo/xóa tài khoản thật phía nhà cung cấp, với kênh thực hiện là `Connector` hoặc `Manual`, kèm trạng thái, số lần thử lại và lỗi gần nhất.
  > _Lý do:_ cho phép mô tả đúng tình huống "đã duyệt, đã ghi nhận, nhưng chưa tạo được tài khoản thật" — tình huống mà v1.0 không diễn tả được.
- **FR-2.6:** Hệ thống chạy job đối soát định kỳ giữa dữ liệu nội bộ và dữ liệu phía nhà cung cấp (với các app có connector). Sai lệch được ghi nhận thành bản ghi Discrepancy với hai loại: _có trong hệ thống nhưng không có ở nhà cung cấp_, và _có ở nhà cung cấp nhưng không có trong hệ thống_.
  > _Loại thứ hai là phát hiện quan trọng:_ nghĩa là có người được cấp quyền ngoài quy trình.
- **FR-2.7:** Một nhân viên không được có hai Assignment đang hiệu lực trên cùng một Subscription tại cùng thời điểm. Các khoảng hiệu lực của cùng cặp (nhân viên, thuê bao) không được chồng lấn.

### 5.3. Phân hệ Quản lý Tổ chức & Luồng Phê duyệt

Việc dùng quản lý trực tiếp làm approver và áp dụng approval nhiều tầng là mô hình access governance phổ biến. Microsoft Entra hỗ trợ approver là quản lý trực tiếp, quản lý cấp hai hoặc approver xác định động, đồng thời hỗ trợ multi-stage approval. [Microsoft Learn – Dynamic approval](https://learn.microsoft.com/en-us/entra/id-governance/entitlement-management-dynamic-approval) [Microsoft Learn – Request process](https://learn.microsoft.com/en-us/entra/id-governance/entitlement-management-process) Nguyên tắc này phù hợp với NIST SP 800-53 AC-2 về phê duyệt, tạo, thay đổi, vô hiệu hóa và review account định kỳ. [NIST SP 800-53 Rev. 5](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final)

- **FR-3.1:** Quản lý cấu trúc tổ chức gồm **cây quản lý trực tiếp** (Direct Manager) và **Cost Center** _(sửa ở v3.8 — bỏ Department, Team theo `QĐ-23`)_. Báo cáo gom theo **cây của người phụ trách** thay cho gom theo phòng ban.
- **FR-3.2:** Employee tạo request cấp mới, đổi gói, gia hạn có thời hạn hoặc hoàn trả seat, kèm lý do nghiệp vụ, dự án/cost center và thời hạn cần sử dụng. Manager có thể tạo request thay nhân viên trực thuộc khi onboarding.
- **FR-3.3:** Hệ thống tự xác định approver theo Direct Manager. Người yêu cầu không được tự phê duyệt request của chính mình (SoD-4). Nếu người yêu cầu là Manager, request chuyển lên quản lý cấp trên.
- **FR-3.4:** Định tuyến request theo loại:

  | Nhánh   | Tình huống                                                                                                                                                            | Chuỗi phê duyệt                                                                                                                                                                                                                        |
  | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | **(a)** | SaaS đã có trong danh mục, còn seat trống, không phát sinh chi phí — **cấp quyền trên seat đã mua, không phải yêu cầu mua** _(v3.9; Owner xác nhận v3.10 — `QĐ-29a`)_ | Employee → Manager → IT Admin. Người duyệt chi thấy tổng hợp trong báo cáo quy trình (`FR-5.11`)                                                                                                                                       |
  | **(b)** | SaaS đã có trong danh mục nhưng cần mua thêm seat, nâng gói hoặc vượt ngân sách                                                                                       | Employee → Manager → **Người duyệt chi** _(snapshot ngân sách, tùy chọn hỏi Finance)_ → hệ thống tạo khoản cam kết → song song: **Finance ghi nhận ngân sách** ∥ IT Admin mua/cấp seat                                                 |
  | **(c)** | SaaS chưa có trong danh mục — **kể cả gói miễn phí**                                                                                                                  | Employee → Manager → IT Admin đánh giá danh mục/rủi ro → **Người duyệt chi** _(snapshot ngân sách và tùy chọn hỏi Finance, **chỉ khi có chi phí**)_ → [khoản cam kết và Finance ghi nhận, **chỉ khi có chi phí**] ∥ IT Admin thực hiện |

  Chuỗi phê duyệt được lưu dưới dạng **chính sách cấu hình được**, không hard-code trong mã nguồn.

  > **Viết lại ở v3.8 — `QĐ-22`.** Người duyệt chi tham gia khi và chỉ khi Request **làm thay đổi tiền hoặc danh mục SaaS của công ty**. Nhánh (c) đi qua Người duyệt chi **kể cả khi miễn phí**, vì thêm một SaaS nghĩa là thêm một nơi dữ liệu công ty nằm và thêm một đối tượng phải quản trị. Nhánh (a) **không** đi qua Người duyệt chi — nếu đi qua, người đó thành nút thắt và tự tạo lại PP-5.
  >
  > **Sửa ở v3.10 — `QĐ-29b`.** Nhánh (b), (c) trước đây đặt _Finance ghi ý kiến ngân sách_ **trước** Người duyệt chi. Thứ tự đó không còn hiệu lực: Finance không nằm trên đường duyệt; người quyết thấy ngân sách qua snapshot và hỏi Finance khi cần (`FR-3.14`).
  >
  > _Bảng cũ (v3.7), giữ để đối chiếu:_ nhánh có chi phí là _Employee → Manager → **Finance** → IT Admin_ với Finance là người duyệt. Bảng này **không còn hiệu lực**.

- **FR-3.5:** _(viết lại ở v3.9 — `QĐ-27`)_ **Không có ủy quyền duyệt.** Mỗi bước được hệ thống gán cho **đúng người có thẩm quyền** theo `FR-3.3`, `FR-3.6`, `FR-3.13`, `FR-3.15`; người đó tự nhận và tự quyết. Người được giao **không** được chỉ định người thay thế, **không** chuyển quyền duyệt thủ công, và hệ thống **không** tạo ứng viên song song. Người duyệt vắng hoặc nghẽn thì xử lý theo `FR-3.8` — nhắc và cảnh báo, **không** đổi người. Người được giao chỉ đổi khi dữ liệu tổ chức hoặc cấu hình vai trò đổi thật, theo `FR-3.16`.
  > _Lý do:_ chức năng giao người khác duyệt thay làm luồng khó truy vết và khó kiểm soát; nếu người được giao lại nghẽn thì cả chuỗi vẫn kẹt. Tốc độ xử lý (`PP-5`) được giữ bằng SLA đo từng bước và cảnh báo backlog có người chịu trách nhiệm, không bằng việc chuyền quyền.
  > 📁 _Lịch sử:_ v3.4 → v3.8 cho phép ủy quyền có thời hạn, và `QĐ-12` (v3.7) quy định bước _quay về người ủy quyền_ khi người được ủy quyền trùng người yêu cầu. Cả hai **không còn hiệu lực** từ v3.9.
- **FR-3.6:** Tổ chức phải khai báo **approver dự phòng ở gốc cây tổ chức** cho trường hợp người yêu cầu không có quản lý trực tiếp. **Super Admin cấu hình một Employee cụ thể** giữ vai này; người đó duyệt **với tư cách vai Manager**, không phải một vai trò mới _(chốt ở v3.6 — `QĐ-02`)_.
  > _Vì sao không giao cho IT Admin:_ như vậy IT Admin vừa quyết nhu cầu vừa thực hiện cấp seat, phá `SoD-5`. Vì sao không giao Finance: Finance kiểm soát ngân sách _(v3.8; trước đó là duyệt chi phí)_, không nắm nhu cầu nghiệp vụ của người dùng. Giữ đúng nguyên tắc _ba loại quyết định, ba người khác nhau_ ở mục 4.2. Vai Manager là vai **phái sinh** theo `ADR-08` nên cơ chế đã có sẵn.
- **FR-3.7:** Manager xem usage summary và request/assignment của nhân viên trực thuộc; không xem raw activity log, hợp đồng hoặc dữ liệu tài chính toàn công ty.
- **FR-3.8:** Mỗi bước phê duyệt có **thời hạn xử lý (SLA)**. Quá hạn, hệ thống **nhắc lại** người được giao và **thông báo** quản lý cấp trên của người đó nếu có. **Escalate chỉ là thông báo** — hệ thống **không** đổi người duyệt, **không** tự phê duyệt và **không** tự từ chối. _(viết lại ở v3.9 — `QĐ-28d`; trước đó ghi "có thể chuyển lên cấp trên theo cấu hình")_
  **Cảnh báo nghẽn** _(`QĐ-27`)_: mỗi bước lưu người được giao, thời điểm nhận, tuổi SLA và số lần nhắc. Khi số bước đang chờ của một người vượt **ngưỡng backlog** do Super Admin cấu hình (`FR-8.2`), hoặc có bước quá SLA, hệ thống cảnh báo Super Admin và đưa vào **bảng theo dõi nghẽn**. Super Admin chỉ được sửa cấu hình, dữ liệu tổ chức hoặc ghi nhận sự cố — **không** được phê duyệt thay (`SoD-1`).
- **FR-3.9:** Hệ thống đo và hiển thị **thời gian trung bình từ lúc gửi request tới lúc hoàn tất cấp phát**, tách theo từng bước, phục vụ PP-5 và KPI-2.
- **FR-3.10:** Trong đợt review Ghost Seat hoặc access review, Manager chọn Keep, Reclaim hoặc Exempt kèm lý do. Lựa chọn Exempt **bắt buộc có thời hạn** (tối đa 12 tháng), sau đó tự động quay lại hàng đợi review.
  > _Lý do:_ nếu Exempt không có hạn, sau vài tháng nó trở thành nợ kỹ thuật vĩnh viễn.
- **FR-3.11:** Hệ thống gửi thông báo trạng thái cho người yêu cầu và approver; lưu người phê duyệt, thời điểm, quyết định, lý do, trạng thái thực hiện và Audit Trail cho mọi request.
- **FR-3.12:** _(mới ở v3.7 — `QĐ-13`)_ Khi chuỗi xác định người duyệt của một bước **không còn ai hợp lệ** — quản lý trực tiếp, quản lý cấp trên và approver dự phòng ở gốc đều trùng người yêu cầu hoặc không tồn tại — hệ thống **giữ Request ở trạng thái chờ**, gắn cờ **`chưa có người duyệt hợp lệ`**, tiếp tục nhắc và thông báo theo `FR-3.8` _(escalate chỉ là thông báo — sửa ở v3.9)_, và **thông báo cho Super Admin để cấu hình lại approver dự phòng theo `FR-3.6`**. Ngay khi cấu hình được sửa, hệ thống xác định lại người duyệt và gán tiếp bước đó (`FR-3.16`).
  > **Vì sao việc này không phá `SoD-1`:** Super Admin được yêu cầu **cấu hình** người duyệt, **không** phê duyệt Request. `FR-8.5` và `SoD-1` vẫn giữ nguyên.
  > **Ba lối bị loại bỏ, ghi rõ để không ai hiện thực nhầm:** hệ thống **không** tự phê duyệt (`FR-3.8`, `BR-07.7`), **không** tự từ chối hay tự hủy (bảng ngoại lệ ngay dưới), và **không** giao quyền duyệt cho Super Admin hay IT Admin (`SoD-1`, `SoD-5`). Người yêu cầu vẫn có thể tự rút Request theo quy tắc _cho phép rút khi đang chờ_ ở mục 5.12.3.
  > **Áp cho bước duyệt chi** _(v3.8; sửa ở v3.9)_: khi chưa cấu hình Người duyệt chi, hoặc Người duyệt chi bị xung đột lợi ích mà chưa cấu hình người thay thế (`FR-3.15`), hoặc người thay thế cũng xung đột, bước duyệt chi đi theo đúng yêu cầu này và thông báo Super Admin cấu hình lại. Người duyệt chi **vắng mặt** không thuộc yêu cầu này — xử lý theo `FR-3.8`. Approver dự phòng ở gốc của `FR-3.6` **không** thay được Người duyệt chi, vì người đó duyệt với tư cách **Manager**.
- **FR-3.13:** _(mới ở v3.8 — `QĐ-22`)_ **Người duyệt chi.** Super Admin cấu hình **một** Employee giữ vai Người duyệt chi, mặc định là CEO. Hệ thống gán bước _Duyệt chi_ cho người này ở nhánh (b) và (c) của `FR-3.4`, **ngay sau** bước Manager (nhánh b) hoặc bước IT đánh giá (nhánh c) _(sửa ở v3.10 — `QĐ-29b`)_. Bước duyệt chi có SLA riêng (`FR-3.8`), **không** hỗ trợ ủy quyền (`FR-3.5`, sửa ở v3.9) và được đo riêng trong KPI-2 (`FR-3.9`). Người duyệt chi cũng quyết định **gia hạn, giảm số lượng hoặc hủy** thuê bao, trên snapshot ngân sách kèm số liệu sử dụng, và có thể hỏi Finance theo `FR-3.14` _(sửa ở v3.10)_.
  > _Vì sao chỉ một người, không phải ma trận nhiều ngưỡng tiền:_ nhóm trưởng chốt một mức cho MVP. Rủi ro là người này thành nút thắt khi nhiều Request có chi phí dồn về; được giảm nhờ nhánh (a) không đi qua, phát hiện được qua `FR-3.9` và cảnh báo backlog của `FR-3.8` _(v3.9 — không còn giảm bằng ủy quyền, `QĐ-27`)_. Nếu KPI-2 cho thấy chậm ở bước này thì mở lại phương án nhiều mức.
- **FR-3.14:** _(mới ở v3.8 — `QĐ-22`; **viết lại ở v3.10 — `QĐ-29b`**)_ **Thông tin ngân sách cho quyết định chi và ghi nhận của Finance.** Ba phần:
  **(1) Snapshot ngân sách.** Màn duyệt chi hiển thị sẵn theo cost center và kỳ của Request: **ngân sách · thực chi · khoản cam kết đang giữ · còn lại** _(= ngân sách − thực chi − cam kết đang giữ, `FR-5.8`)_ · **tổng giá trị Request có chi phí đang chờ duyệt** · thời điểm dữ liệu. Chưa có ngân sách thì hiện _Chưa có ngân sách_, **không** hiện 0. Snapshot **được chụp lại tại lúc quyết** và lưu làm bằng chứng của bước duyệt chi.
  **(2) Hỏi Finance — tùy chọn.** Người duyệt chi có thể gửi **yêu cầu thông tin ngân sách** tới Finance. Bước duyệt chi **vẫn giao cho Người duyệt chi** (không phải ủy quyền, `FR-3.5`); **đồng hồ SLA của bước không dừng, không đặt lại**; thời gian Finance phản hồi đo riêng (`FR-5.11`). Finance trả lời `Trong hạn mức` / `Vượt hạn mức` / `Chưa có ngân sách` kèm ghi chú; câu trả lời **không duyệt, không chặn**. Người duyệt chi quyết được bất cứ lúc nào, kể cả khi Finance chưa trả lời.
  **(3) Ghi nhận sau duyệt.** Khi Request có chi phí được duyệt, Finance ghi **ý kiến chính thức** trên khoản cam kết vừa tạo, cùng ba giá trị trên. Ghi _Vượt hạn mức_ hoặc _Chưa có ngân sách_ ⟹ **thông báo** Người duyệt chi; **không** hoàn tác quyết định, **không** dừng cấp phát. Bước ghi nhận có SLA riêng và **không** nằm trên đường chờ tới lúc có tài khoản.
  > _Lý do (`QĐ-29b`):_ người quyết vẫn có thông tin ngân sách, nhưng Finance không còn là bước bắt buộc trước quyết định — tránh hiểu Finance là cửa duyệt, rút ngắn KPI-2, và snapshot tính cả phần đang chờ duyệt nên xử lý tốt hơn Request song song. 📁 _Lịch sử:_ v3.8 → v3.9 bắt Finance ghi ý kiến **trước** bước duyệt chi.
- **FR-3.15:** _(mới ở v3.9 — `QĐ-28c`)_ **Người duyệt chi thay thế khi xung đột lợi ích.** Super Admin cấu hình **trước** **một** Employee giữ vai này _(ví dụ Chủ tịch HĐQT hoặc CFO)_. Khi **và chỉ khi** Người duyệt chi là **người yêu cầu hoặc người thụ hưởng** của một Request cụ thể (`SoD-7`), hệ thống **tạo** bước duyệt chi **của Request đó** cho người thay thế và ghi Audit Trail lý do _xung đột lợi ích_. Người thay thế chịu đủ `SoD-7`, `SoD-8`. Chưa cấu hình, hoặc người thay thế cũng xung đột ⟹ `FR-3.12`.
  **Sáu ràng buộc bắt buộc** _(`QĐ-28c`)_: **(1)** chỉ áp khi Người duyệt chi là người yêu cầu hoặc người thụ hưởng · **(2)** người thay thế được Super Admin **cấu hình trước**, không cấu hình theo từng Request · **(3)** **không** do Manager, Người duyệt chi hay người yêu cầu chọn · **(4)** **không** áp cho backlog, vắng mặt hay quá SLA · **(5)** **không** tạo ứng viên song song — bước chỉ có một người được giao · **(6)** **không** dùng để né SLA — xung đột được biết ngay khi tạo bước nên bước được tạo thẳng cho người thay thế, SLA tính từ lúc tạo; chỉ sự kiện dữ liệu của `FR-3.16` mới xác định lại người, và khi đó SLA không đặt lại.
  > _Vì sao không phải ủy quyền:_ không ai trong luồng tự chọn người thay; người thay thế là cấu hình tĩnh lập trước và chỉ áp theo điều kiện xung đột trên đúng Request đó, **không** áp khi Người duyệt chi vắng mặt hay bận — hai ca đó vẫn theo `FR-3.8`.
- **FR-3.16:** _(mới ở v3.9 — `QĐ-28d`)_ **Xác định lại người duyệt khi dữ liệu thay đổi thật.** Hệ thống chạy lại quy tắc định tuyến (`FR-3.3`, `FR-3.6`, `FR-3.13`, `FR-3.15`) cho các bước **đang chờ** **chỉ** khi có một trong các sự kiện: `manager_id` của người yêu cầu thay đổi · người được giao chuyển sang _đã nghỉ việc_ · Super Admin đổi người giữ vai Người duyệt chi, Người duyệt chi thay thế, hoặc approver dự phòng ở gốc. Audit Trail ghi sự kiện nguồn, người cũ, người mới. **Đồng hồ SLA không đặt lại.** Nghỉ phép, vắng mặt hay backlog cao **không** phải sự kiện kích hoạt. **Phạm vi:** chỉ **người cụ thể** giữ bước được xác định lại; **nhánh và chuỗi loại bước** đã chốt khi gửi yêu cầu giữ nguyên, nên việc sửa chính sách duyệt giữa chừng vẫn không ảnh hưởng yêu cầu đang chạy.
  > _Vì sao không phá `FR-3.5`:_ người mới là kết quả của quy tắc định tuyến chạy trên dữ liệu tổ chức mới — giống hệt khi Request được gửi sau thay đổi đó — không phải lựa chọn của người đang giữ bước hay của Admin cho một Request cụ thể. Mọi thay đổi `manager_id` và cấu hình vai trò đều đã có Audit Trail.

**Các tình huống ngoại lệ phải xử lý** _(chi tiết máy trạng thái nằm ở mục 5.12)_:

| Tình huống                                                                                                   | Xử lý                                                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Người yêu cầu rút request khi đang chờ duyệt chi _(sửa ở v3.8, v3.10)_                                       | Cho phép hủy, ghi nhận trạng thái Cancelled; yêu cầu thông tin ngân sách đang mở (nếu có) đóng theo                                                                                         |
| Approver nghỉ việc giữa chừng                                                                                | Xác định lại người duyệt theo quy tắc định tuyến trên dữ liệu tổ chức mới (`FR-3.16`); SLA không đặt lại _(sửa ở v3.9)_                                                                     |
| **Approver vắng mặt, nghỉ phép hoặc nghẽn** _(mới ở v3.9)_                                                   | **Không** đổi người duyệt, **không** ủy quyền. Nhắc, thông báo cấp trên, cảnh báo backlog cho Super Admin (`FR-3.8`)                                                                        |
| Đã duyệt nhưng đến bước IT thì hết seat trống                                                                | Quay lại **nhánh (b)** — bổ sung bước duyệt chi _(sửa ở v3.8, v3.10)_; không tự động từ chối                                                                                                |
| **Request bị hủy hoặc mua/cấp phát thất bại sau khi đã duyệt chi** _(mới ở v3.8)_                            | **Giải phóng khoản cam kết** (`FR-5.8`), ghi Audit Trail; seat không được cấp                                                                                                               |
| **Finance ghi nhận _Vượt hạn mức_ hoặc _Chưa có ngân sách_ sau khi đã duyệt chi** _(mới ở v3.10 — `QĐ-29b`)_ | Thông báo Người duyệt chi; quyết định và cấp phát **giữ nguyên**; khoản cam kết vẫn _Đang giữ_                                                                                              |
| **Finance chưa trả lời yêu cầu thông tin khi bước duyệt chi đã quá SLA** _(mới ở v3.10)_                     | Không dừng SLA, không chặn quyết định; nhắc Finance, cảnh báo nghẽn theo `FR-3.8` như mọi bước                                                                                              |
| **Manager trực tiếp chính là Người duyệt chi** _(mới ở v3.8)_                                                | Giữ hai bước riêng cho cùng một người; nhật ký gắn cờ _cùng người_ (ngoại lệ ghi dưới `SoD-8`)                                                                                              |
| **Người duyệt chi là người yêu cầu hoặc người thụ hưởng** _(mới ở v3.8; sửa ở v3.9)_                         | Bước duyệt chi gán cho **Người duyệt chi thay thế khi xung đột** (`FR-3.15`); chưa cấu hình thì chờ có kiểm soát (`FR-3.12`). Không tự duyệt (`SoD-7`)                                      |
| Provisioning thất bại                                                                                        | Assignment chuyển trạng thái lỗi, sinh tác vụ cho IT Admin, không mất dấu vết                                                                                                               |
| Request quá hạn không ai xử lý                                                                               | Nhắc và thông báo — escalate chỉ là thông báo (`FR-3.8`); không đổi người, không tự duyệt, không tự từ chối _(sửa ở v3.9)_                                                                  |
| **Không còn người duyệt hợp lệ nào trong cả chuỗi** _(mới ở v3.7)_                                           | Giữ ở trạng thái chờ kèm cờ _chưa có người duyệt hợp lệ_; nhắc và thông báo theo `FR-3.8`; **báo Super Admin cấu hình lại approver dự phòng** (`FR-3.12`). Không tự duyệt, không tự từ chối |
| ~~**Người được ủy quyền chính là người yêu cầu**~~ _(v3.7)_                                                  | 📁 **Không còn áp dụng từ v3.9** — không có ủy quyền (`FR-3.5`, `QĐ-27`)                                                                                                                    |

### 5.4. Phân hệ Phân tích Tối ưu & Đọc Log hoạt động

#### 5.4.1. Phân loại 5 nhóm lãng phí license

| Mã     | Loại                                         | Nguồn dữ liệu    | Độ tin cậy | Hành động                 | Phạm vi MVP      |
| ------ | -------------------------------------------- | ---------------- | ---------- | ------------------------- | ---------------- |
| **G1** | Seat đã mua nhưng chưa gán cho ai            | Nội bộ           | 100%       | Giảm số lượng khi gia hạn | ✅ Có            |
| **G2** | Seat gán cho người **đã nghỉ việc**          | Nội bộ           | 100%       | Thu hồi ngay              | ✅ Có            |
| **G3** | Seat đã gán nhưng **chưa từng** có hoạt động | Cần log ngoài    | Cao        | Kiểm tra rồi thu hồi      | ✅ Có            |
| **G4** | Seat từng dùng nhưng **đã ngừng**            | Cần log ngoài    | Trung bình | Manager xác nhận          | ✅ Có            |
| **G5** | Seat vẫn dùng nhưng **dùng ít so với gói**   | Cần log chi tiết | Thấp       | Hạ gói                    | ❌ Ngoài phạm vi |

> **Điểm cần nhấn:** G1 và G2 **không cần một dòng log bên ngoài nào**, chạy được ngay từ dữ liệu nội bộ với độ chính xác tuyệt đối. G2 đặc biệt quan trọng vì vừa là lãng phí chi phí vừa là lỗ hổng bảo mật — người đã nghỉ việc vẫn còn tài khoản truy cập dữ liệu công ty.

#### 5.4.2. Yêu cầu về nguồn dữ liệu usage

- **FR-4.1:** IT Admin tải lên file log hoạt động xuất từ hệ thống gốc. Hệ thống hỗ trợ hai hình dạng file:
  - **Dạng tổng hợp** — mỗi người dùng một dòng, thường có sẵn cột ngày hoạt động cuối
  - **Dạng sự kiện** — mỗi dòng một sự kiện, hệ thống tự tổng hợp

  _Bổ sung ở v3.8 — `QĐ-20`:_ ngoài file, hệ thống nhận dữ liệu từ **bộ thu thập trên thiết bị công ty** (`FR-4.17`), ở **dạng tổng hợp theo ngày** đã lọc tại nguồn. Mỗi bộ thu thập là một nguồn usage có mẫu cấu hình, cửa sổ bao phủ và định nghĩa hoạt động riêng như mọi nguồn khác (`INV-10`, `INV-11`).

- **FR-4.2:** Mỗi nguồn usage được mô tả bằng một **mẫu cấu hình** (template) gồm: ánh xạ cột, loại định danh trong cột actor (email / username / ID), định dạng ngày, múi giờ nguồn, và bảng phân loại loại sự kiện. Thêm một nhà cung cấp mới là thêm một bản ghi cấu hình, **không** viết mã mới.
- **FR-4.3:** Mỗi nguồn usage **bắt buộc** khai báo **cửa sổ dữ liệu bao phủ** (từ ngày nào đến ngày nào). Khai báo tay khi file không tự chứa thông tin này, hoặc suy ra từ dữ liệu khi có thể.
  > _Lý do:_ nếu file log chỉ export 30 ngày gần nhất, mọi nhân viên hoạt động ngoài cửa sổ đó sẽ bị kết luận nhầm là "chưa từng hoạt động". Đây là lỗi âm thầm — hệ thống chạy trơn tru nhưng kết luận sai.
- **FR-4.4:** Mỗi nguồn usage khai báo **ma trận năng lực**: có danh sách thành viên hay không, có ngày hoạt động cuối hay không, có chi tiết loại sự kiện hay không, độ dài lịch sử tối đa. Từ đó hệ thống **tự suy ra** nó phát hiện được nhóm lãng phí nào:

  | Năng lực nguồn              | Phát hiện được | Không phát hiện được |
  | --------------------------- | -------------- | -------------------- |
  | Chỉ có danh sách thành viên | G1, G2         | G3, G4, G5           |
  | + ngày hoạt động cuối       | G1, G2, G3, G4 | G5                   |
  | + chi tiết sự kiện          | Toàn bộ        | —                    |

  Giao diện phải hiển thị rõ giới hạn này cho từng ứng dụng, ví dụ: _"Nguồn hiện tại chỉ có danh sách thành viên; hệ thống phát hiện được seat trống và seat của người đã nghỉ việc, chưa đánh giá được mức độ sử dụng."_

#### 5.4.3. Ánh xạ danh tính (Identity Resolution)

- **FR-4.5:** Hệ thống duy trì bảng ánh xạ giữa định danh phía nhà cung cấp và nhân viên nội bộ, lưu: nhà cung cấp, khóa định danh bên ngoài, phương pháp khớp, mức độ tin cậy, người xác nhận.
- **FR-4.6:** Bản ghi không khớp được đi vào **hàng đợi chờ xử lý**, không bị bỏ qua im lặng và không được dùng để kết luận.
- **FR-4.7:** Log gắn vào **Assignment tại thời điểm sự kiện xảy ra**, không gắn trực tiếp vào nhân viên.
  > _Lý do:_ một nhân viên có thể được cấp seat, trả seat, rồi được cấp lại — đó là các Assignment riêng biệt. Nếu gắn vào nhân viên rồi lấy ngày hoạt động lớn nhất, Assignment mới sẽ thừa hưởng lịch sử của Assignment cũ và không bao giờ bị phát hiện.
- **FR-4.8:** Trường hợp có hoạt động nhưng **không tìm thấy Assignment tương ứng** được ghi nhận thành sai lệch (xem FR-2.6) — đây là dấu hiệu seat được cấp ngoài quy trình.

#### 5.4.4. Rule phát hiện

- **FR-4.9:** Trước khi đánh giá, hệ thống loại khỏi phạm vi các trường hợp sau:

  | #   | Điều kiện loại trừ                                        | Lý do                                                   |
  | --- | --------------------------------------------------------- | ------------------------------------------------------- |
  | 1   | Mô hình giá không phải per-seat                           | Gói flat-rate/consumption không có khái niệm ghost seat |
  | 2   | Tài khoản dịch vụ (bot, CI, integration)                  | Không bao giờ "đăng nhập" theo cách thông thường        |
  | 3   | Nhân viên đang nghỉ phép dài hoặc đang bàn giao           | Tránh báo động giả                                      |
  | 4   | Assignment mới tạo dưới ngưỡng ân hạn (mặc định 14 ngày)  | Vừa cấp seat, chưa kịp dùng                             |
  | 5   | Assignment bắt đầu sau khi cửa sổ dữ liệu bắt đầu         | Không đủ dữ liệu để kết luận                            |
  | 6   | Dữ liệu nguồn quá cũ (quá 7 ngày kể từ ngày bao phủ cuối) | Không chạy rule, hiển thị cảnh báo dữ liệu lỗi thời     |
  | 7   | Đang trong thời hạn miễn trừ do Manager xác nhận          | Tôn trọng quyết định đã có                              |
  | 8   | Đã có khuyến nghị đang mở cho Assignment đó               | Tránh sinh trùng                                        |

- **FR-4.10:** Hệ thống phân biệt ba trạng thái khác nhau của "không có ngày hoạt động":

  | Trạng thái               | Nghĩa                                                 | Xử lý                                |
  | ------------------------ | ----------------------------------------------------- | ------------------------------------ |
  | Chưa từng hoạt động      | Có dữ liệu bao phủ, người này thực sự không xuất hiện | Kết luận được → G3                   |
  | Không có dữ liệu         | Chưa import log cho ứng dụng này                      | **Không** kết luận                   |
  | Chưa khớp được danh tính | Có hoạt động trong log nhưng không map được           | **Không** kết luận, đẩy vào hàng đợi |

- **FR-4.11:** Phân loại sự kiện theo mức ý nghĩa: sự kiện tạo giá trị (chỉnh sửa, tạo file, commit), sự kiện thụ động (xem), và sự kiện chỉ xác thực (đăng nhập, SSO redirect). **Sự kiện chỉ xác thực không tính là hoạt động.**

  > _Lý do:_ khi tổ chức bật SSO, nhiều ứng dụng tự đăng nhập mỗi sáng. Nếu tính đăng nhập là hoạt động thì mọi người đều "đang dùng" và kết quả phát hiện về 0.

- **FR-4.12:** Rule phân tầng theo số ngày không hoạt động, ngưỡng cấu hình được:

  | Tầng        | Điều kiện mặc định                                     | Hành động                                            |
  | ----------- | ------------------------------------------------------ | ---------------------------------------------------- |
  | Theo dõi    | 30–59 ngày                                             | Chỉ hiển thị trên dashboard, **không** gửi thông báo |
  | Cần xem xét | ≥ 60 ngày                                              | Sinh khuyến nghị, gửi Manager xác nhận               |
  | Cần xử lý   | ≥ 90 ngày, hoặc chưa từng hoạt động, hoặc đã nghỉ việc | Khuyến nghị + thông báo cả IT Admin                  |

  **Chốt ở v3.6** _(`QĐ-09`)_: tầng **Theo dõi** chỉ hiển thị cho **IT Admin**, **không** hiện trên màn hình của Manager. Manager chỉ nhận thứ cần quyết, từ tầng _Cần xem xét_ trở lên — khớp `SoD-2` và nguyên tắc mỗi lần hỏi Manager phải kèm đủ bằng chứng để quyết ngay.

- **FR-4.12b** _(chốt ở v3.6 — `QĐ-09`)_: **lịch chạy rule phát hiện** — nhóm `G1` và `G2` chạy **hằng ngày**; nhóm `G3` và `G4` chạy **hằng tuần**.

  > _Lý do:_ `G1`/`G2` chỉ dùng dữ liệu nội bộ nên chi phí thấp và kết quả đổi mỗi ngày theo biến động nhân sự. `G3`/`G4` phụ thuộc dữ liệu usage nhập theo đợt, chạy hằng ngày không thêm thông tin mới. Lịch này cấu hình được theo `FR-8.2`.

- **FR-4.13:** Ngưỡng cấu hình theo thứ tự ưu tiên: **theo từng ứng dụng > toàn tổ chức > mặc định hệ thống** _(sửa ở v3.8 — bỏ cấp "theo phòng ban" theo `QĐ-23`)_.

  > _Lý do:_ Figma dùng hàng ngày nên 30 ngày không đụng là bất thường; phần mềm quyết toán thuế chỉ dùng mỗi quý nên ngưỡng chung sẽ báo động giả toàn bộ.

- **FR-4.14:** Mỗi khuyến nghị kèm **mức độ tin cậy** tính từ độ dài không hoạt động, chất lượng dữ liệu (độ dài cửa sổ bao phủ) và độ chắc chắn của phép khớp danh tính. Khuyến nghị hiển thị đầy đủ căn cứ để người dùng phản biện được, ví dụ: _"Không hoạt động 87 ngày (log Figma import ngày 05/08, bao phủ 120 ngày, khớp email chính xác). Ước tính tiết kiệm tại kỳ gia hạn 15/12: 180 USD."_

- **FR-4.16:** Mẫu cấu hình nguồn (FR-4.2) **bắt buộc** khai báo _nguồn này hiểu "hoạt động" là gì_ — ví dụ "xem trang từ 2 giây", "có sự kiện bất kỳ trong nhật ký kiểm toán", "đăng nhập thành công". Giá trị này hiển thị kèm mọi khuyến nghị sinh ra từ nguồn đó, và được tính vào mức độ tin cậy: nguồn có định nghĩa lỏng bị hạ mức tin cậy.
  > _Lý do:_ Atlassian tính một lượt xem trang 2 giây là hoạt động. Nếu nhận con số ngày hoạt động cuối mà không biết nó có nghĩa gì, hệ thống sẽ kết luận mọi người đều đang dùng và phân hệ phát hiện mất tác dụng — cùng loại sai lầm với việc tính đăng nhập là hoạt động (FR-4.11).

#### 5.4.4b. Bộ thu thập trên thiết bị công ty _(mục mới ở v3.8 — `QĐ-20`)_

Nguồn nhà cung cấp mù đúng ở chỗ doanh nghiệp vừa cần: dữ liệu hoạt động theo từng người gần như luôn nằm ở **gói cao nhất** — Figma, Notion, ChatGPT: Enterprise; Microsoft `signInActivity`: Entra ID P1/P2 _(mục 6.3.1)_. Bộ thu thập lấp khoảng đó mà không cần mua gói.

- **FR-4.17:** **Tiện ích trình duyệt** cài bắt buộc trên trình duyệt được quản lý của máy công ty cấp. Tiện ích **lọc ngay trên máy** theo **danh sách cho phép** lấy từ danh mục SaaS và từ điển nhà cung cấp (`FR-6.2`), **loại mọi ứng dụng mang cờ liên lạc** (`FR-1.8`), và chỉ gửi: định danh thiết bị, tên miền trong danh sách, ngày, **số phút hoạt động làm tròn**. Tiện ích **không** gửi URL đầy đủ, tiêu đề trang, nội dung, hay tên miền ngoài danh sách. Máy chủ **từ chối** mọi bản ghi mang trường ngoài lược đồ cho phép.
  > _Định nghĩa "hoạt động" khai báo theo `FR-4.16`:_ tab thuộc tên miền trong danh sách đang ở phía trước **và** trình duyệt không ở trạng thái rảnh, cộng dồn **≥ N phút trong ngày** (N cấu hình được).
  > _Về demo (v3.9 — `QĐ-28b`):_ tiện ích được nạp bằng _Developer mode → Load unpacked_ trên máy thành viên nhóm. Cài bắt buộc qua chính sách trình duyệt được quản lý là **thiết kế triển khai tại doanh nghiệp**, không được trình bày là thứ đang chạy (`OQ-18`). Mọi kiểm soát phía máy chủ — từ chối trường ngoài lược đồ, thiết bị chưa đăng ký, nhân viên chưa xác nhận (`INV-17`) — vẫn phải **chạy thật**. Đặc tả kỹ thuật của tiện ích (định danh thiết bị, tải danh sách cho phép, phát hiện tab phía trước và trạng thái rảnh, lược đồ bản ghi, bộ đệm, chống gửi trùng, múi giờ) phải có **trước khi** bắt đầu hiện thực.
- **FR-4.18:** **Đăng ký thiết bị và xác nhận chủ động.** IT Admin đăng ký thiết bị công ty ↔ nhân viên, có khoảng hiệu lực (`ADR-04`). Trước khi nhận bất kỳ dữ liệu nào, hệ thống hiển thị thông báo theo `FR-10.4` và yêu cầu nhân viên **bấm xác nhận chủ động**; bản ghi xác nhận lưu **phiên bản nội dung thông báo và thời điểm**. **Chưa xác nhận thì không nhận dữ liệu** từ thiết bị đó (`INV-17`). Nhân viên có **nút yêu cầu dừng thu thập**; yêu cầu được ghi nhận theo `FR-10.5`, và khi được xử lý thì thiết bị ngừng được nhận dữ liệu. Nhân viên nghỉ việc thì đăng ký thiết bị hết hiệu lực.
- **FR-4.19:** **Agent trên máy — 📐 CHỈ ĐẶC TẢ THIẾT KẾ, không hiện thực trong MVP.** Agent quan sát **tên tiến trình** của ứng dụng desktop trong danh sách cho phép và thời gian cửa sổ ở phía trước khi máy không rảnh, cộng dồn theo ngày, cùng danh sách phần mềm đã cài. Áp **nguyên vẹn** `FR-4.17` và `FR-4.18`, cộng thêm: **không** thu tiêu đề cửa sổ, phím bấm, ảnh màn hình. Được nâng lên hiện thực bằng một quyết định riêng nếu còn thời gian hoặc GVHD yêu cầu.
  > _Ghi chú kỹ thuật cho người hiện thực sau này:_ ActivityWatch _(mã nguồn mở, MPL-2.0)_ **mặc định ghi tiêu đề cửa sổ**. Nếu dùng làm nền thì bộ xuất dữ liệu chạy trên máy phải bỏ tiêu đề trước khi gửi.

> **Điều kiện pháp lý của mục này** nằm ở **mục 7.7.7** và **`ADR-13`**. Căn cứ chính là **Điều 25 khoản 3 Luật 91/2025/QH15**, đọc nguyên văn: biện pháp công nghệ quản lý người lao động _"chỉ được áp dụng ... phù hợp với quy định của pháp luật và bảo đảm quyền, lợi ích của chủ thể dữ liệu cá nhân, trên cơ sở người lao động biết rõ biện pháp đó"_.

#### 5.4.5. Ước tính tiết kiệm

- **FR-4.15:** Hệ thống tách **hai con số tiết kiệm khác nhau**:
  - _Tiết kiệm có thể thực hiện ngay_ — chỉ áp dụng với gói theo tháng hoặc gói có điều khoản cho phép giảm số lượng giữa kỳ
  - _Tiết kiệm tại kỳ gia hạn kế tiếp_ — áp dụng với gói cam kết theo năm

  > **Đây là điểm quan trọng về tính trung thực của số liệu:** với hợp đồng cam kết theo năm, thu hồi seat giữa kỳ **không tiết kiệm được đồng nào**; tiền chỉ thật khi giảm số lượng tại ngày gia hạn. Báo cáo gộp hai con số này lại là sai lệch.

### 5.5. Phân hệ Báo cáo Tài chính & Dự báo

- **FR-5.1:** Biểu đồ tổng chi tiêu phần mềm theo dữ liệu mới nhất đã đồng bộ/import, so sánh với hạn mức ngân sách. Dashboard hiển thị rõ thời điểm cập nhật gần nhất; chỉ gọi là dữ liệu thời gian thực khi nguồn billing/API thực sự hỗ trợ. _(v3.8)_ Tách riêng ba con số **ngân sách — thực chi — khoản cam kết đang giữ** (`FR-5.8`). _(v3.9 — `QĐ-24`)_ Kèm con số **còn lại = ngân sách − thực chi − cam kết đang giữ**; không cộng thực chi với cam kết đã chuyển thành chi phí lần nữa.
- **FR-5.2:** Phân loại chi phí theo Cost Center hoặc theo dự án. _(v3.8 — `QĐ-23`, `QĐ-24`)_ Thêm các chiều nhóm **theo ứng dụng**, **theo nhà cung cấp**, và **theo cây của người phụ trách** — tổng chi của mọi người dưới quyền một người, dựa trên quan hệ quản lý có hiệu lực tại thời điểm phát sinh chi phí (`ADR-04`).
- **FR-5.3:** Hệ thống hiển thị **cả hai cơ sở ghi nhận chi phí**, có nhãn phân biệt rõ:
  - _Theo dòng tiền_ — ghi nhận tại ngày hóa đơn, phục vụ đối soát thanh toán
  - _Theo kỳ_ — phân bổ đều theo thời gian sử dụng, phục vụ theo dõi ngân sách

  > _Lý do:_ một hóa đơn năm 12.000 USD trả trong tháng 1 sẽ làm vỡ ngân sách tháng 1 và để trống 11 tháng còn lại nếu chỉ dùng cơ sở dòng tiền.

- **FR-5.4:** Đối soát hóa đơn với số seat và mức sử dụng, làm rõ khoản chi thuộc phần mềm nào, do đơn vị nào dùng (xử lý PP-3).

#### 5.5.1. Dự báo chi phí — mô hình ba lớp _(viết lại ở v3.0)_

- **FR-5.5:** Dự báo chi phí được tách thành **ba lớp có bản chất khác nhau**, mỗi lớp dùng một cơ chế riêng. Hệ thống **không** áp dụng chung một phương pháp cho cả ba.

  | Lớp                                   | Nội dung                                                                | Cơ chế dự báo                                                           |
  | ------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
  | **L1 — Chi phí đã cam kết**           | Thuê bao có hợp đồng, số lượng và đơn giá đã biết, ngày gia hạn đã biết | **Công thức xác định** từ dữ liệu hợp đồng. Không dùng mô hình thống kê |
  | **L2 — Chi phí biến động**            | Gói tính theo mức tiêu thụ, chi phí thay đổi theo tháng                 | **Mô hình xu hướng có cổng kiểm chứng** — xem FR-5.7                    |
  | **L3 — Chi phí phụ thuộc quyết định** | Nhu cầu phát sinh do tuyển thêm người, mở dự án mới, đổi gói            | **Ba kịch bản** dựa trên giả định do người dùng nhập                    |

  > _Lý do tách lớp:_ với L1, dùng hồi quy để dự báo một con số đã ghi trong hợp đồng sẽ cho kết quả **kém chính xác hơn** đọc thẳng hợp đồng. Ngược lại, L2 là chỗ duy nhất mà phương pháp thống kê có ý nghĩa thật. Gộp cả ba lớp vào một phương pháp là sai ở cả hai đầu.

- **FR-5.6:** Xử lý đa tiền tệ: mọi báo cáo quy đổi về đồng tiền báo cáo của tổ chức theo tỷ giá chốt tại thời điểm ghi nhận giao dịch, không quy đổi lại khi xem báo cáo.

- **FR-5.7:** ⏸️ **HOÃN — không hiện thực trong MVP, giữ làm đặc tả thiết kế** _(v3.8 — `QĐ-25`)_. Lớp L2 cần ≥ 12 tháng dữ liệu chi tiêu và kiểm chứng lùi, trong khi demo không có dữ liệu thật đủ dài. MVP hiện thực **L1 và L3**; với chi phí biến động, giao diện nêu rõ _"dự báo theo mô hình chưa được hiện thực"_ thay vì để trống. Nội dung đặc tả dưới đây **giữ nguyên**.

  **Cổng kiểm chứng cho lớp L2.** Hệ thống chỉ hiển thị dự báo bằng mô hình khi vượt qua đủ hai điều kiện, và tự đánh giá — người dùng không tự bật:

  | Điều kiện                                        | Ngưỡng mặc định      | Khi không đạt                                                           |
  | ------------------------------------------------ | -------------------- | ----------------------------------------------------------------------- |
  | Độ dài dữ liệu lịch sử                           | ≥ 12 tháng           | Hiển thị _"Chưa đủ dữ liệu lịch sử để dự báo có kiểm chứng"_            |
  | Sai số kiểm chứng lùi (huấn luyện 9, kiểm tra 3) | ≤ 20%, cấu hình được | **Ẩn dự báo mô hình**, chỉ hiển thị khoảng kịch bản L3, nêu rõ lý do ẩn |

  Khi hiển thị, dự báo **bắt buộc** kèm: khoảng thời gian dữ liệu đã dùng, các giả định đang áp dụng, sai số kiểm chứng đo được, và thời điểm tính. **Không** hiển thị một con số dự báo trần trụi trong bất kỳ trường hợp nào.

  **Về con số 20%** _(chốt ở v3.3 — đóng OQ-09)_: sai số đo bằng phần trăm sai lệch tuyệt đối trung bình. Cách diễn giải thông dụng trong thực hành dự báo xếp dưới 10% là rất tốt, 10–20% là dùng được, 20–50% là tham khảo được, trên 50% là không dùng được. Dự án chọn **20% làm ranh giới giữa "hiển thị được" và "không hiển thị"**, nghĩa là chỉ đưa ra con số khi nó còn nằm trong vùng dùng được. Ngưỡng cấu hình được trong khoảng 10–40% để doanh nghiệp tự siết hoặc nới.

  > Đây là một **quy ước thực hành, không phải một chuẩn bắt buộc**. Điều quan trọng không nằm ở việc chọn đúng con số 20%, mà ở chỗ hệ thống **có một ngưỡng tường minh, đo được và hiển thị ra ngoài** — thay vì luôn vẽ một đường dự báo bất kể dữ liệu tốt hay xấu. Sai số đo được phải hiển thị cạnh dự báo, không chỉ dùng ngầm để bật tắt.

  Mô hình sử dụng ở mức đơn giản nhất đủ dùng — trung bình trượt kết hợp xu hướng tuyến tính. Phạm vi MVP **không** áp dụng ARIMA, Prophet hoặc mô hình học máy, vì với chuỗi dữ liệu tháng ngắn chúng không cho kết quả tốt hơn mà lại khó giải thích.

  > **Vì sao cổng kiểm chứng là phần đáng giá nhất của FR-5.5 và FR-5.7:** một hệ thống **tự từ chối dự báo khi biết mình sẽ sai** trung thực hơn hẳn một hệ thống luôn vẽ được một đường xu hướng. Đây cũng chính là điều kiện mà bản đăng ký đồ án đã đặt ra — _"chỉ được dùng khi dữ liệu lịch sử đủ và có đánh giá sai số"_ — nên đây là cách hiện thực trung thành nhất với cam kết ban đầu.

#### 5.5.2. Khoản cam kết ngân sách _(mục mới ở v3.8 — `QĐ-22`)_

- **FR-5.8:** Khi Người duyệt chi duyệt một Request **có chi phí**, **hệ thống tạo** một **khoản cam kết ngân sách** gắn với **đúng Request đó** và cost center liên quan (`INV-16`); Finance **ghi nhận chính thức** trên khoản đó theo `FR-3.14` (3) _(sửa ở v3.10 — `QĐ-29b`; trước đó Finance tạo)_. Vòng đời: **Đang giữ** → **Đã thành chi phí** khi hóa đơn tương ứng được đối soát khớp (`FR-5.4`), hoặc → **Đã giải phóng** khi Request bị hủy, mua hoặc cấp phát thất bại. **Không** tạo khoản cam kết khi Người duyệt chi từ chối. Ngân sách còn lại hiển thị ở snapshot `FR-3.14` luôn trừ cả thực chi lẫn cam kết đang giữ.
  > _Lý do:_ chỉ so thực chi với ngân sách thì hai Request chạy song song đều thấy _"còn đủ"_ rồi cùng làm vượt hạn mức. Đây là lỗ hổng đã được chỉ ra trong ghi chú nghiên cứu nghiệp vụ của mentor.
- **FR-5.8a:** _(mới ở v3.11 — `QĐ-30b`)_ **Khoản cam kết khi chưa có ngân sách.** Khi Request có chi phí được duyệt mà **chưa có** `Budget` của cost center và kỳ đó _(snapshot hiển thị `Chưa có ngân sách` theo `FR-3.14` (1))_, hệ thống **vẫn tạo** khoản cam kết theo `FR-5.8`; khoản đó **chưa gắn ngân sách**, mang lý do _Chưa có ngân sách_ và vào hàng đợi ghi nhận của Finance (`INV-18`). Quyết định duyệt chi và việc cấp phát **không bị chặn**.
  **Gắn ngược khi ngân sách ra đời:** ngay khi `Budget` của **đúng cost center và kỳ đó** được lập, hệ thống **tự gắn** mọi khoản cam kết chưa có ngân sách thuộc kỳ đó vào ngân sách vừa lập, ghi Audit Trail sự kiện gắn. Từ thời điểm đó, khoản cam kết được tính vào _cam kết đang giữ_ của công thức ngân sách còn lại.
  **Ngân sách còn lại được phép âm.** Nếu tổng cam kết được gắn ngược vượt hạn mức vừa lập, hệ thống hiển thị số **âm** kèm nhãn _đã cam kết vượt hạn mức_, **không** làm tròn về 0 và **không** ẩn. Báo cáo của Finance (`FR-5.8`, `FR-5.11`) nêu rõ phần vượt đến từ cam kết tạo trước khi có ngân sách.
  > _Lý do (`QĐ-30b`):_ `QĐ-29b` cho phép Người duyệt chi quyết khi chưa có ngân sách, nên mô hình phải biểu diễn được khoản cam kết sinh ra từ quyết định đó. Không gắn ngược thì tiền đã cam kết thật vĩnh viễn nằm ngoài mọi ngân sách — tái tạo đúng `PP-3`. Hiển thị số âm là **thông tin đúng**: nó nói _đã cam kết vượt hạn mức vừa lập_; che đi mới là sai. **Không** tạo `Budget` giữ chỗ hạn mức 0 — trái `FR-3.14` (1) _"không hiện 0"_.

#### 5.5.3. Năm nhóm báo cáo _(mục mới ở v3.8 — `QĐ-24`)_

Hệ thống quản trị chi phí nội bộ **không có doanh thu**. Phần tương đương _"tiền hệ thống mang lại"_ là **báo cáo tiết kiệm**, luôn đặt cạnh **tổng chi**.

- **FR-5.9:** **Báo cáo tiết kiệm** — hai con số **tách riêng, không bao giờ cộng lại** theo `FR-4.15`: _tiết kiệm thực hiện ngay_ và _tiết kiệm tại kỳ gia hạn kế tiếp_; kèm số seat đã thu hồi và danh sách khuyến nghị đã thực hiện làm căn cứ.
- **FR-5.10:** **Báo cáo hiệu suất sử dụng** — KPI-3, số seat theo từng nhóm G1 → G4, và **chi phí trên mỗi người dùng có hoạt động** (`FR-0.4`), theo ứng dụng và theo cây người phụ trách. _(v3.9 — đồng bộ quy tắc đọc báo cáo của `QĐ-24`)_ Mỗi seat được xếp **đúng một** trong bốn trạng thái: **đang hoạt động**, **không hoạt động**, **không có dữ liệu**, **chưa khớp danh tính** (`FR-4.10`). Mẫu số của tỷ lệ usage chỉ gồm seat **đánh giá được** trong cửa sổ bao phủ; _không có dữ liệu_ và _chưa khớp_ **không** được tính thành _không hoạt động_ hay hiển thị thành 0.
- **FR-5.11:** **Báo cáo hiệu suất quy trình** — KPI-2 **tách theo từng bước** (nhu cầu, đánh giá IT, duyệt chi, cấp phát), kèm **thời gian Finance phản hồi yêu cầu thông tin** và **thời gian Finance ghi nhận sau duyệt** đo riêng, không cộng vào đường chờ _(v3.10 — `QĐ-29b`)_; **tỷ lệ bước quá SLA**, và KPI-4. _(v3.9 — `QĐ-27`, `QĐ-28d`)_ Kèm **bảng theo dõi nghẽn**: số bước đang chờ theo từng người được giao, tuổi SLA, số lần nhắc, số lần xác định lại người duyệt theo sự kiện dữ liệu (`FR-3.16`) và số bước gán cho người thay thế khi xung đột (`FR-3.15`). _(v3.10 — `QĐ-29a`)_ Kèm **tổng hợp seat cấp theo nhánh (a)** theo ứng dụng và cost center trong kỳ — Người duyệt chi xem ở mức tóm tắt.
- **FR-5.12:** **Báo cáo chất lượng** — KPI-5, KPI-1, tỷ lệ định danh đã khớp, độ mới của từng nguồn usage, số sai lệch đang mở, tỷ lệ thuê bao thiếu hạn chót báo hủy, và **trạng thái bộ thu thập** (`FR-0.4`).

**Ai xem báo cáo nào:**

| Vai trò         | Tổng chi (`FR-5.1`, `FR-5.2`)                                      | Tiết kiệm | Hiệu suất sử dụng       | Hiệu suất quy trình  | Chất lượng              |
| --------------- | ------------------------------------------------------------------ | --------- | ----------------------- | -------------------- | ----------------------- |
| Người duyệt chi | ✅                                                                 | ✅        | Tóm tắt                 | Tóm tắt              | —                       |
| Finance         | ✅ + khoản cam kết                                                 | ✅        | —                       | —                    | —                       |
| IT Admin        | —                                                                  | ✅        | ✅                      | ✅                   | ✅ trừ KPI-5            |
| Super Admin     | —                                                                  | —         | —                       | ✅                   | ✅ gồm KPI-5 (`FR-0.3`) |
| Manager         | Chỉ phạm vi cấp dưới, không có số tài chính toàn công ty (`SoD-2`) | —         | Cấp dưới, dạng tổng hợp | Request của cấp dưới | —                       |

### 5.6. Phân hệ Phát hiện SaaS ngoài Danh mục (Shadow IT Discovery)

- **FR-6.1:** Hệ thống duy trì SaaS Catalog là danh mục ứng dụng đã được IT phê duyệt, gồm nhà cung cấp, tên miền liên quan, trạng thái phê duyệt, người sở hữu nghiệp vụ và mức độ nhạy cảm dữ liệu.
- **FR-6.2:** Hệ thống duy trì **từ điển nhận diện nhà cung cấp dùng chung** gồm tên chuẩn, tên miền và các mẫu nhận dạng, tách khỏi danh mục riêng của tổ chức.
- **FR-6.3:** Hệ thống tiếp nhận và chuẩn hóa **ba** nguồn bằng chứng trong phạm vi MVP: **(a)** CSV sao kê/hóa đơn chi phí, **(b)** export OAuth consent hoặc enterprise-app từ IdP, **(c)** _(mới ở v3.8)_ dữ liệu từ **tiện ích trình duyệt** (`FR-4.17`) — **chỉ các tên miền có trong từ điển nhà cung cấp** mà chưa nằm trong danh mục đã duyệt. Log web/firewall/proxy/CASB **đầy đủ** vẫn **nằm ngoài phạm vi**, xem mục 5.6.1.
- **FR-6.4:** Quy trình xử lý theo chuỗi: **dữ liệu thô → chuẩn hóa → khớp nhà cung cấp → đối chiếu danh mục → tạo bản ghi cần xem xét**. Hệ thống lưu **cả giá trị thô lẫn giá trị đã chuẩn hóa**, kèm phương pháp khớp và mức độ tin cậy, để giải trình được.
- **FR-6.5:** Mức độ tin cậy tính từ **phương pháp khớp**, không lấy con số do mô hình tự khai:

  | Phương pháp            | Tin cậy    | Xử lý                       |
  | ---------------------- | ---------- | --------------------------- |
  | Khớp chính xác từ điển | Cao        | Tự động chuẩn hóa           |
  | Khớp theo mẫu (regex)  | Khá        | Tự động, có thể xem lại     |
  | Khớp mờ (fuzzy)        | Trung bình | Đưa vào hàng đợi review     |
  | Gợi ý bởi mô hình AI   | Thấp       | **Bắt buộc** người xác nhận |

  Các trường hợp cần xử lý: nhà bán lại và cổng thanh toán trung gian (`PAYPAL*CANVA` → Canva); tên miền phụ (`figma.com`, `www.figma.com`); cùng một nhà cung cấp xuất hiện ở nhiều nguồn.

- **FR-6.6:** Mục không khớp với danh mục được tạo dưới trạng thái **cần xem xét**, **không** được kết luận là vi phạm cho tới khi IT Admin xử lý.
- **FR-6.7:** Chống trùng lặp: mỗi nhà cung cấp chỉ có một bản ghi đang mở. Nhà cung cấp xuất hiện lại ở kỳ sau thì cập nhật thời điểm nhìn thấy gần nhất và số lần xuất hiện, không tạo bản ghi mới. Bản ghi đã đóng ở trạng thái "báo nhầm" mà xuất hiện lại thì được mở lại.
- **FR-6.8:** Bản ghi được phân tầng rủi ro dựa trên: mức nhạy cảm dữ liệu ứng dụng chạm tới, số nhân viên liên quan, và ứng dụng có hỗ trợ đăng nhập tập trung hay không.
- **FR-6.9:** IT Admin xem bằng chứng, gán người chịu trách nhiệm, đánh dấu Đã duyệt / Chưa duyệt / Báo nhầm, tạo yêu cầu hợp thức hóa hoặc đóng cảnh báo. Manager cung cấp bối cảnh nghiệp vụ khi cảnh báo liên quan tới nhân viên trong phạm vi quản lý trực tiếp của mình _(cây người phụ trách; dùng Cost Center khi cần gom theo đơn vị chi phí — `QĐ-23`)_. Mọi quyết định ghi Audit Trail.
  > **Lưu ý về cách hiểu:** trạng thái "Đã duyệt" (hợp thức hóa ứng dụng) là một kết cục **bình thường và tích cực**, không phải ngoại lệ. Shadow IT thường là tín hiệu cho thấy bộ công cụ đã phê duyệt còn thiếu.
- **FR-6.10:** _(Đặc tả thiết kế cho tương lai, không hiện thực ở MVP.)_ Nếu về sau tổ chức cung cấp log web/proxy, hệ thống chỉ yêu cầu và lưu trường tối thiểu: thời điểm, định danh người dùng đã ánh xạ, tên miền đích, số lượt truy cập hoặc dung lượng. Không lưu đường dẫn đầy đủ, không lưu tham số truy vấn, không hiển thị dữ liệu không liên quan trên dashboard.

#### 5.6.1. Vì sao discovery từ log web/firewall/proxy/CASB nằm ngoài phạm vi _(mục mới ở v3.0)_

> **Cập nhật ở v3.8 — `QĐ-20`: phần dưới vẫn đúng với nhật ký truy cập web ĐẦY ĐỦ, nhưng không còn áp cho tiện ích trình duyệt.** Tiện ích ở `FR-4.17` khác log web ở ba điểm quyết định: **(1)** lọc **tại máy** theo danh sách cho phép, nên máy chủ không bao giờ nhận truy cập ngoài danh sách — đúng các trường tối thiểu mà `FR-6.10` đã đặc tả; **(2)** chỉ chạy trên **thiết bị công ty cấp** sau khi nhân viên **xác nhận chủ động**, trả lời lý do 1 bằng Điều 25 khoản 3 Luật 91/2025/QH15 đọc nguyên văn (mục 7.7.7); **(3)** không cần hạ tầng proxy hay CASB, nên lý do 2 không áp dụng — nhóm kiểm chứng được trên chính máy của mình. Lý do 3 được xem lại: với doanh nghiệp vừa, nguồn nhà cung cấp mù ở phần lớn ứng dụng (mục 6.3.1), nên giá trị gia tăng **lớn hơn** đánh giá ở v3.0.

Bản đăng ký đồ án nêu nguồn này ở dạng "hỗ trợ khi có". Sau khi phân tích, dự án quyết định **đưa hẳn ra ngoài phạm vi hiện thực** và chỉ giữ lại đặc tả thiết kế tại FR-6.10. Ba lý do, xếp theo mức độ quan trọng:

**Lý do 1 — Vướng khung pháp lý về dữ liệu cá nhân, và nhóm chưa đủ căn cứ để làm đúng.**

Log truy cập web của nhân viên là dữ liệu hành vi ở mức chi tiết cao hơn hẳn log sử dụng phần mềm. Nó cho biết một người truy cập trang nào, vào lúc nào, bao nhiêu lần — bao gồm cả những truy cập không liên quan tới công việc.

Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Nghị định 356/2025/NĐ-CP là khung pháp lý liên quan trực tiếp (xem mục 7.7). Điểm đáng chú ý: Nghị định 356/2025 **mở rộng nhóm dữ liệu cá nhân nhạy cảm**, trong đó có dữ liệu về hành vi và thói quen thu thập được từ dịch vụ viễn thông, mạng xã hội và dịch vụ truyền thông trực tuyến. Log truy cập web nằm rất gần — nếu không muốn nói là nằm trong — nhóm này. Xử lý dữ liệu nhạy cảm kéo theo yêu cầu chặt hơn về cơ sở pháp lý, thông báo cho người lao động và biện pháp bảo vệ.

Trong phạm vi 9 tuần phát triển thật của đồ án, nhóm **không đủ điều kiện làm phần này cho đúng**, và triển khai nửa vời với một hệ thống xử lý dữ liệu nhạy cảm là lựa chọn tệ hơn không triển khai.

**Lý do 2 — Không có hạ tầng để kiểm chứng, nên không chứng minh được độ bao phủ.**

Nguồn này giả định doanh nghiệp đã vận hành sẵn proxy, firewall hoặc CASB. Nhóm không thể dựng một hạ tầng giám sát ở quy mô doanh nghiệp để kiểm chứng. Có thể tự thu một mẫu nhỏ trên máy của nhóm, nhưng mẫu đó chỉ chứng minh **tầng xử lý file chạy được**, không chứng minh được điều mà nguồn này hứa hẹn là **độ bao phủ**. Trình bày một mẫu nhỏ như bằng chứng cho năng lực phát hiện toàn tổ chức là phóng đại.

**Lý do 3 — Giá trị gia tăng không tương xứng với rủi ro trong phạm vi MVP.**

Hai nguồn còn lại đã trả lời được hai câu hỏi quan trọng nhất: sao kê cho biết _công ty đang trả tiền cho ai_, OAuth consent cho biết _ứng dụng nào đã được cấp quyền vào dữ liệu công ty_. Nguồn thứ ba trả lời _ai đang thực sự truy cập_ — có giá trị, nhưng là giá trị bổ sung, không phải giá trị nền.

**Hệ quả phải nêu rõ trong sản phẩm — bảng điểm mù của từng nguồn:**

| Nguồn                             | Trả lời câu hỏi                                               | Điểm mù                                                                                                                        | Phạm vi MVP |
| --------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| Sao kê / hóa đơn                  | Công ty đang **trả tiền** cho ai?                             | Mù hoàn toàn với công cụ miễn phí; mô tả giao dịch thường mơ hồ; các khoản qua hoàn ứng cá nhân không thấy được                | ✅ Có       |
| OAuth / IdP                       | Ứng dụng nào đã được **cấp quyền** vào dữ liệu công ty?       | Không bao phủ ứng dụng đăng ký bằng tài khoản cá nhân                                                                          | ✅ Có       |
| Traffic / CASB                    | Ai đang **thực sự truy cập**?                                 | Chỉ thấy thiết bị và mạng được giám sát                                                                                        | ❌ Ngoài    |
| **Tiện ích trình duyệt** _(v3.8)_ | Ai đang **thực sự mở** một SaaS **đã biết** trên máy công ty? | Mù với SaaS chưa có trong từ điển; ứng dụng desktop; trình duyệt không được quản lý; thiết bị cá nhân; nhân viên chưa xác nhận | ✅ Có       |

**Trường hợp cả ba nguồn đều mù:** nhân viên dùng công cụ AI miễn phí bằng tài khoản cá nhân trên máy cá nhân. Không có giao dịch, không có OAuth grant, không đi qua mạng công ty. Hệ thống **không cam kết phát hiện 100% Shadow IT** — và với việc bỏ nguồn thứ ba, giới hạn này còn rộng hơn, nên càng phải nói rõ thay vì giấu đi.

### 5.7. Phân hệ Import dữ liệu

- **FR-7.1:** Mọi luồng import (hợp đồng, hóa đơn, nhân sự, usage log, sao kê) dùng chung khung xử lý theo 6 bước:

  ```
  Tải lên → Phân tích → Ánh xạ danh tính → Xem trước → Ghi nhận → Tổng hợp lại
  ```

- **FR-7.2:** **Bước xem trước là bắt buộc.** Trước khi ghi dữ liệu thật, hệ thống hiển thị: số dòng hợp lệ, số dòng lỗi kèm lý do, số dòng đã tồn tại sẽ bỏ qua, số định danh chưa khớp được, cửa sổ dữ liệu, và số bản ghi sẽ bị ảnh hưởng. Người dùng xác nhận rồi hệ thống mới ghi.
- **FR-7.3:** Lỗi ở một dòng không làm hỏng cả file. Dòng lỗi được ghi nhận riêng kèm số dòng, cột và mã lỗi, cho phép tải về danh sách lỗi.
- **FR-7.4:** Hệ thống tính mã băm nội dung file để phát hiện import trùng, cảnh báo khi file đã được import trước đó.
- **FR-7.5:** Dữ liệu được chuẩn hóa múi giờ về múi giờ của tổ chức trước khi cắt theo ngày.
- **FR-7.6:** Chuẩn hóa email theo quy tắc cấu hình được (chuyển thường, xử lý phần sau dấu cộng), áp dụng nhất quán ở cả khi tạo ánh xạ lẫn khi đối chiếu.

#### 5.7.1. Xử lý khi các nguồn dữ liệu mâu thuẫn nhau _(mục mới ở v3.2)_

Hệ thống nhận dữ liệu từ nhiều nguồn độc lập: file nhân sự, danh sách thành viên phía nhà cung cấp, hóa đơn, log hoạt động. Chúng **sẽ** mâu thuẫn nhau, và tài liệu phải nói trước cách xử lý thay vì để mỗi lập trình viên tự quyết.

- **FR-7.7:** Khi hai nguồn dữ liệu nói khác nhau, hệ thống **không để nguồn nào tự ghi đè nguồn kia**. Hệ thống ghi nhận sai lệch thành một bản ghi cần người xử lý, giữ nguyên cả hai giá trị.

**Nguyên tắc phân định nguồn chân lý:**

> **Dữ liệu nội bộ đã qua quy trình phê duyệt là nguồn chân lý về _ý định_. Dữ liệu từ nhà cung cấp là nguồn chân lý về _thực tế_. Khi hai thứ lệch nhau, đó là một sự kiện nghiệp vụ cần người xử lý, không phải một lỗi dữ liệu cần tự sửa.**

| Tình huống mâu thuẫn                                                  | Nguồn nào thắng                             | Hệ thống làm gì                                                                                   |
| --------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Nhân sự nói đã nghỉ việc, nhà cung cấp vẫn còn tài khoản              | Nhân sự thắng **về trạng thái nhân viên**   | Sinh lãng phí nhóm G2 mức cần xử lý ngay, kèm việc thu hồi cho IT Admin                           |
| Nhà cung cấp có tài khoản, hệ thống không có Assignment tương ứng     | **Không nguồn nào thắng**                   | Sinh sai lệch loại _có ở nhà cung cấp nhưng không có trong hệ thống_; **không** tự tạo Assignment |
| Hệ thống có Assignment đang hiệu lực, nhà cung cấp không có tài khoản | **Không nguồn nào thắng**                   | Sinh sai lệch loại _có trong hệ thống nhưng không có ở nhà cung cấp_                              |
| Số seat trên hóa đơn khác số seat khai trong thuê bao                 | **Không nguồn nào thắng**                   | Đưa vào màn hình đối soát hóa đơn (FR-5.4); **không** tự sửa thuê bao                             |
| File nhân sự nhập mới thiếu một người đang giữ seat                   | **Không nguồn nào thắng**                   | Không tự đánh dấu đã nghỉ, không tự xóa; đưa vào hàng đợi cần xem xét                             |
| Hai file log cùng ứng dụng, cửa sổ dữ liệu chồng lấn nhau             | Nguồn có cửa sổ **kết thúc muộn hơn** thắng | Hợp nhất theo khóa (danh tính, ngày); ghi nhận nguồn đã dùng cho từng dòng                        |
| Cùng một định danh khớp về hai nhân viên khác nhau                    | **Không nguồn nào thắng**                   | Đẩy vào hàng đợi chưa khớp danh tính, **không** dùng để kết luận (FR-4.6)                         |

> **Vì sao không cho phép tự ghi đè:** ba trong bảy tình huống trên là **dấu hiệu của một vấn đề nghiệp vụ thật** — có người được cấp quyền ngoài quy trình, có người nghỉ việc mà chưa thu hồi, hoặc hóa đơn tính sai. Nếu hệ thống tự đồng bộ cho khớp, nó xóa mất chính bằng chứng mà nó sinh ra để tìm.

### 5.8. Phân hệ Quản trị hệ thống & Audit

- **FR-8.1:** Super Admin quản lý tài khoản đăng nhập, gán vai trò, khóa/mở tài khoản.
- **FR-8.2:** Super Admin cấu hình tham số hệ thống: ngưỡng cảnh báo, ngưỡng phát hiện theo từng cấp, thời hạn SLA phê duyệt, chính sách lưu giữ dữ liệu, **ngưỡng sai số của cổng kiểm chứng dự báo (FR-5.7)**. _(v3.8)_ Thêm: **Người duyệt chi** (`FR-3.13`), **nội dung thông báo theo dõi có đánh phiên bản** (`FR-4.18`), và ngưỡng _N phút_ của định nghĩa hoạt động cho bộ thu thập (`FR-4.17`). Việc cấu hình Người duyệt chi là **cấu hình**, không phải phê duyệt, nên `SoD-1` giữ nguyên. _(v3.9)_ Thêm: **Người duyệt chi thay thế khi xung đột** (`FR-3.15`) và **ngưỡng backlog** mỗi người duyệt dùng cho cảnh báo nghẽn (`FR-3.8`). Đổi các cấu hình này kích hoạt xác định lại người duyệt theo `FR-3.16`.
- **FR-8.3:** Nhật ký kiểm toán (Audit Trail) ghi nhận mọi thay đổi dữ liệu nghiệp vụ với: người thực hiện, vai trò tại thời điểm đó, hành động, đối tượng, giá trị trước và sau, mã tương quan, thời điểm. Nhật ký **chỉ ghi thêm, không cho sửa hoặc xóa**.
- **FR-8.4:** Hệ thống hiển thị trạng thái các tác vụ nền: lần chạy gần nhất, kết quả, số bản ghi xử lý, lỗi.
- **FR-8.5:** Super Admin không thực hiện thao tác nghiệp vụ (không gán seat, không phê duyệt request) — theo SoD-1.

### 5.9. Phân hệ Khởi tạo dữ liệu ban đầu _(mục mới ở v3.0)_

BRD v2.0 mô tả đầy đủ cách hệ thống vận hành khi đã có dữ liệu, nhưng không trả lời câu hỏi _"ngày đầu tiên triển khai, doanh nghiệp phải làm gì"_. Không có phần này thì hệ thống không có điểm bắt đầu.

**Năm bước khởi tạo, theo đúng thứ tự phụ thuộc:**

| Bước | Nội dung                                                                        | Phụ thuộc bước trước         | Giá trị đạt được sau bước này            |
| ---- | ------------------------------------------------------------------------------- | ---------------------------- | ---------------------------------------- |
| 1    | Nhập danh sách nhân sự, cost center, quản lý trực tiếp _(v3.8 — bỏ phòng ban)_  | —                            | Có cây tổ chức để định tuyến phê duyệt   |
| 2    | Khai báo ứng dụng đang dùng, kèm người sở hữu nghiệp vụ và mức nhạy cảm dữ liệu | Cần bước 1 để gán chủ sở hữu | Có danh mục đã phê duyệt                 |
| 3    | Nhập hợp đồng, gói, số seat đã mua, kỳ hạn, hạn chót báo hủy                    | Cần bước 2                   | **Cảnh báo gia hạn bắt đầu chạy (PP-2)** |
| 4    | Ghi nhận hiện trạng ai đang giữ seat nào                                        | Cần bước 1 và 3              | **Phát hiện được G1 và G2 (PP-1)**       |
| 5    | Import log sử dụng nếu lấy được                                                 | Cần bước 4                   | Phát hiện thêm G3 và G4                  |

**Yêu cầu:**

- **FR-9.1:** Hệ thống cung cấp một checklist khởi tạo năm bước, hiển thị trạng thái hoàn thành từng bước và dẫn thẳng tới màn hình tương ứng.
- **FR-9.2:** Mỗi bước dùng lại khung import 6 bước tại FR-7.1, gồm cả bước xem trước bắt buộc. Không có luồng nhập liệu riêng cho khởi tạo.
- **FR-9.3:** Hệ thống cung cấp file mẫu tải về cho từng loại dữ liệu ở bước 1 đến bước 4, kèm mô tả từng cột và ví dụ.
- **FR-9.4:** Assignment nhập ở bước 4 được phép **không có** request nguồn, và được đánh dấu là dữ liệu khởi tạo để phân biệt với assignment sinh từ quy trình.
- **FR-9.5:** Sau bước 4, hệ thống chạy ngay lần đánh giá đầu tiên cho nhóm G1 và G2, và hiển thị kết quả trên bảng điều khiển.
- **FR-9.6:** Trạng thái rỗng của mọi màn hình chính phải dẫn người dùng về đúng bước khởi tạo còn thiếu, thay vì hiển thị một trang trắng.
- **FR-9.7:** _(mới ở v3.11 — `QĐ-30c`)_ **Cost Center là trường bắt buộc của file nhân sự ở bước 1.** Bản ghi nhân sự **thiếu Cost Center bị từ chối** ở bước xem trước của khung import (`FR-7.1`), kèm thông báo nêu đúng dòng và cột thiếu; hệ thống **không** tạo nhân viên không có Cost Center (`INV-14b`). File mẫu ở `FR-9.3` đánh dấu cột này là bắt buộc.
  > _Cách xử lý các ca không thuộc một đơn vị cụ thể:_ tài khoản dịch vụ, bot/CI và tài khoản dùng chung của team gắn vào một Cost Center **`type = Company`** theo `OQ-07` — đây là một loại đã được thiết kế, **không** phải giá trị giữ chỗ. Nhà thầu, freelancer và thực tập sinh gắn vào Cost Center **`type = Project`** của dự án tương ứng.
  > ⚠️ **Không** được tạo một Cost Center tên _"Chưa phân loại"_ để lách `INV-14b`. Làm vậy là đưa lại đúng trạng thái `0..1` dưới một cái tên khác, và làm hỏng mọi báo cáo quy về đơn vị chịu chi phí.

> **Điểm cần nhấn khi trình bày:** sau **bước 4**, hệ thống đã tạo ra giá trị đo được mà **chưa cần một dòng log bên ngoài nào** — nó biết ngay có bao nhiêu seat đã mua mà chưa gán, và bao nhiêu seat còn nằm trong tay người đã nghỉ việc. Bước 5 chỉ mở khóa thêm hai nhóm lãng phí tinh vi hơn. Điều này quan trọng vì nó cho thấy hệ thống **không phụ thuộc hoàn toàn vào việc lấy được log từ nhà cung cấp** — vốn là rủi ro lớn nhất của phân hệ Usage.

### 5.10. Luồng nghiệp vụ chính (Key Business Flows)

| Luồng                                  | Diễn tiến                                                                                                                                                                                                                                                                                  |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Khởi tạo dữ liệu ban đầu**           | IT Admin nhập nhân sự → khai báo ứng dụng → nhập hợp đồng và thuê bao → ghi nhận hiện trạng seat → hệ thống chạy đánh giá G1/G2 đầu tiên → import log nếu có _(bổ sung ở v3.0)_                                                                                                            |
| **Cấp quyền thông thường**             | Employee gửi request → Manager xác nhận nhu cầu → IT Admin cấp seat qua connector hoặc tác vụ thủ công → hệ thống thông báo kết quả và ghi Audit Trail                                                                                                                                     |
| **Phát sinh chi phí**                  | Employee gửi request → Manager xác nhận → Người duyệt chi duyệt trên snapshot ngân sách _(tùy chọn hỏi Finance)_ → hệ thống tạo khoản cam kết → song song: Finance ghi nhận ngân sách, IT Admin mua/cấp seat → hệ thống ghi nhận Cost Center và Audit Trail _(viết lại ở v3.8; sửa v3.10)_ |
| **SaaS mới** _(v3.8)_                  | Employee gửi request → Manager xác nhận → IT Admin đánh giá danh mục và rủi ro → Người duyệt chi duyệt _(snapshot và tùy chọn hỏi Finance nếu có chi phí)_ → khoản cam kết và Finance ghi nhận nếu có chi phí ∥ IT Admin thêm vào danh mục và cấp seat _(sửa v3.10)_                       |
| **Bộ thu thập trên thiết bị** _(v3.8)_ | IT Admin đăng ký thiết bị ↔ nhân viên → nhân viên đọc thông báo và xác nhận chủ động → tiện ích gửi dữ liệu đã lọc tại nguồn → hệ thống nhận vào nguồn usage → rule G3/G4 và bằng chứng Shadow IT dùng dữ liệu này                                                                         |
| **Hoàn trả / thu hồi**                 | Employee yêu cầu hoàn trả hoặc Manager xác nhận không còn nhu cầu → IT Admin thu hồi → seat về trạng thái trống để tái phân bổ hoặc giảm số lượng khi gia hạn                                                                                                                              |
| **Ghost Seat**                         | Automation Service sinh khuyến nghị theo rule → Manager chọn Keep/Reclaim/Exempt kèm lý do → IT Admin quyết định cuối cùng và thực hiện → Finance nhận thông tin tiết kiệm ước tính                                                                                                        |
| **Thay đổi nhân sự**                   | IT Admin cập nhật trạng thái hoặc quan hệ tổ chức → hệ thống cập nhật phạm vi quản lý và tạo danh sách assignment cần review                                                                                                                                                               |
| **Nhân viên nghỉ việc**                | Trạng thái chuyển sang đã nghỉ → hệ thống tự động liệt kê toàn bộ seat đang giữ → IT Admin thu hồi → ghi nhận vào báo cáo tiết kiệm                                                                                                                                                        |
| **Shadow IT**                          | Import nguồn bằng chứng → chuẩn hóa và đối chiếu danh mục → tạo bản ghi cần xem xét → IT Admin xử lý → nếu hợp thức hóa thì tạo mục danh mục mới và request mua chính thức                                                                                                                 |
| **Đối soát nhà cung cấp**              | Job định kỳ so sánh dữ liệu nội bộ với nhà cung cấp → phát hiện sai lệch → IT Admin xử lý                                                                                                                                                                                                  |

_Chi tiết từng luồng ở mức nghiệp vụ nằm ở tài liệu **User Flows nghiệp vụ**; đặc tả máy trạng thái nằm ở **mục 5.12** của chính tài liệu này._

### 5.11. Phân hệ Quyền của chủ thể dữ liệu _(mục mới ở v3.1)_

Hệ thống xử lý dữ liệu hành vi của người lao động, nên các quyền của chủ thể dữ liệu theo Luật Bảo vệ dữ liệu cá nhân không phải yêu cầu bên ngoài mà là **yêu cầu chức năng thật**. Phần lớn đã có sẵn nền tảng trong thiết kế hiện tại, chỉ cần gọi tên và bổ sung phần thiếu.

- **FR-10.1:** Nhân viên xem được toàn bộ dữ liệu hệ thống đang lưu về mình: danh sách seat được cấp, lịch sử yêu cầu, và dữ liệu sử dụng đã tổng hợp của chính mình. _(v3.8)_ Gồm cả dữ liệu từ bộ thu thập trên thiết bị, thiết bị đã đăng ký và các lần xác nhận chủ động.
- **FR-10.2:** Nhân viên yêu cầu xuất dữ liệu cá nhân của mình ra file. Hệ thống ghi nhận thời điểm tiếp nhận và thời điểm hoàn tất.
- **FR-10.3:** Hệ thống tự động xóa dữ liệu quá hạn lưu giữ theo chính sách tại mục 7.5, có ghi nhật ký số bản ghi đã xóa.
- **FR-10.4:** **Bắt buộc cho MỌI ứng dụng, không riêng nhóm dịch vụ liên lạc** _(mở rộng ở v3.6 — `QĐ-01`)_. Khi một ứng dụng bắt đầu được theo dõi mức độ sử dụng, hệ thống thông báo cho các nhân viên đang giữ seat của ứng dụng đó, nêu rõ loại dữ liệu được thu thập và mục đích. _(v3.8 — `QĐ-20`)_ Với **bộ thu thập trên thiết bị**, thông báo phải được gửi **trước** khi thiết bị gửi dữ liệu và phải có **xác nhận chủ động** của nhân viên theo `FR-4.18`; thông báo đơn thuần là **không đủ** cho nguồn này.
- **FR-10.5:** Hệ thống ghi nhận mọi yêu cầu liên quan tới quyền chủ thể dữ liệu kèm thời điểm tiếp nhận, người xử lý và thời điểm hoàn tất, phục vụ chứng minh việc đáp ứng đúng thời hạn.

**Thời hạn đáp ứng theo quy định** _(tham chiếu Nghị định 356/2025/NĐ-CP — cần nhóm kiểm chứng lại tại văn bản gốc trước khi đưa vào báo cáo cuối)_:

| Loại yêu cầu                                         | Thời hạn        |
| ---------------------------------------------------- | --------------- |
| Phản hồi yêu cầu rút đồng ý, hạn chế, phản đối xử lý | 2 ngày làm việc |
| Cung cấp, xem, chỉnh sửa dữ liệu                     | 10 ngày         |
| Thực hiện yêu cầu khi trực tiếp xử lý                | tối đa 15 ngày  |
| Xóa dữ liệu                                          | 20 ngày         |

> **Vì sao nên làm phân hệ này thay vì chỉ nhắc tới trong tài liệu:** ba trong năm yêu cầu trên đã gần như có sẵn — FR-10.1 dựa trên màn hình "Phần mềm của tôi" đã thiết kế, FR-10.3 dựa trên chính sách lưu giữ đã có, FR-10.5 dựa trên Audit Trail đã có. Chi phí bổ sung thấp, nhưng nó biến phần tuân thủ từ một mục rủi ro trong báo cáo thành **một nhóm tính năng demo được** — điều mà rất ít đồ án làm.

### 5.12. Khung mô hình miền nghiệp vụ _(mục mới ở v3.5)_

**Vì sao mục này tồn tại:** tới v3.4, ba nội dung — ranh giới ngữ cảnh, bất biến dữ liệu và máy trạng thái — nằm ở bộ tài liệu _Domain Spec_ tách rời. Sau bốn vòng cập nhật BRD, bộ tài liệu đó lệch quá xa so với BRD và đã được gỡ bỏ ở v3.5. Phần lõi của nó được đưa vào đây để **BRD trở thành nguồn chân lý duy nhất**, không còn tài liệu treo mà người đọc không tra được.

Mục này dừng ở mức **khung**: nêu ranh giới, bất biến và vòng đời cùng căn cứ của từng thứ. Lược đồ bảng chi tiết, kiểu dữ liệu từng cột và bảng chuyển trạng thái đầy đủ thuộc về tài liệu thiết kế kỹ thuật sẽ soạn ở giai đoạn hiện thực.

#### 5.12.1. Tám ranh giới ngữ cảnh nghiệp vụ

Hệ thống chia thành tám vùng, mỗi vùng có bộ thuật ngữ và quy tắc riêng. Ranh giới này là cơ sở để chia module ở tầng mã nguồn (xem ADR-11).

| Mã     | Ranh giới ngữ cảnh           | Thực thể chính                                                                                                                                                                 | Phân hệ tương ứng |
| ------ | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------- |
| **C1** | Danh mục & Hợp đồng          | Vendor, SaaSProduct, Plan, Subscription, Contract, Invoice                                                                                                                     | 5.1               |
| **C2** | Nhân sự & Tổ chức            | Employee, CostCenter, quan hệ quản lý có lịch sử _(v3.8 — bỏ Department, Team)_                                                                                                | 5.2, 5.3          |
| **C3** | Cấp phát License             | Assignment, ProvisioningTask, Discrepancy                                                                                                                                      | 5.2               |
| **C4** | Yêu cầu & Phê duyệt          | Request, ApprovalStep _(loại bước: nhu cầu, đánh giá IT, duyệt chi — v3.10 bỏ loại ý kiến ngân sách)_, chính sách định tuyến. _(v3.10 — `QĐ-29c`: bỏ Delegation khỏi mô hình)_ | 5.3               |
| **C5** | Sử dụng & Tối ưu             | UsageSource, UsageRecord, IdentityMapping, GhostSeatRecommendation, Attestation, **ManagedDevice**, **MonitoringAcknowledgment** _(v3.8)_                                      | 5.4               |
| **C6** | Phát hiện ngoài danh mục     | VendorDictionary, DiscoveryEvidence, DiscoveryFinding                                                                                                                          | 5.6               |
| **C7** | Tài chính & Kế hoạch chi phí | CostAllocation, Budget, **BudgetCommitment** _(v3.8)_, Forecast, ExchangeRate                                                                                                  | 5.5               |
| **C8** | Nền tảng & Quản trị          | AppUser, Role, AuditTrail, Job, cấu hình hệ thống, yêu cầu quyền chủ thể dữ liệu                                                                                               | 5.8, 5.11         |

> **Nguyên tắc chia ranh giới:** chia theo **nghiệp vụ**, không chia theo tầng kỹ thuật. Lý do nằm ở C3 và C4: _quyết định cho một người dùng phần mềm_ (C4) và _việc tạo tài khoản thật phía nhà cung cấp_ (C3) là hai chuyện khác nhau, có vòng đời khác nhau — đúng như ADR-07 đã chốt. Nếu gộp chúng vào một vùng thì không mô tả được tình huống "đã duyệt nhưng chưa tạo được tài khoản".
>
> **Điểm giao nhau cần chú ý:** C5 phụ thuộc C3 (log gắn vào Assignment chứ không gắn vào nhân viên — FR-4.7), và C7 phụ thuộc C2 (chi phí quy về Cost Center **tại thời điểm phát sinh** — ADR-04). Hai phụ thuộc này là nơi lỗi âm thầm hay xuất hiện nhất.

#### 5.12.2. Mười tám bất biến dữ liệu, ghi thành mười chín dòng _(mười lăm tới v3.7; thêm `INV-16`, `INV-17` ở v3.8; thêm `INV-18` và tách `INV-14` thành `INV-14a`/`INV-14b` ở v3.11 — `QĐ-30b`, `QĐ-30c`)_

**Bất biến** là quy tắc luôn phải đúng, bất kể thao tác nào vừa xảy ra. Nguyên tắc của dự án: bất biến nào có thể ràng buộc ở **tầng cơ sở dữ liệu** thì phải đặt ở đó, không đặt ở tầng ứng dụng — vì kiểm tra ở tầng ứng dụng vẫn bị phá khi hai người thao tác đồng thời.

| Mã          | Bất biến                                                                                                                                                                                                                                                                                                                                                                                              | Căn cứ                    | Ràng buộc ở đâu                                                                          |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ---------------------------------------------------------------------------------------- |
| **INV-01**  | Số Assignment đang chiếm chỗ không vượt quá `purchased_quantity` của Subscription                                                                                                                                                                                                                                                                                                                     | 7.4, ADR-02               | CSDL + kiểm tra tranh chấp                                                               |
| **INV-02**  | Các khoảng hiệu lực của cùng cặp (nhân viên, thuê bao) không được chồng lấn                                                                                                                                                                                                                                                                                                                           | FR-2.7, 7.4               | **CSDL** — ràng buộc loại trừ theo khoảng thời gian                                      |
| **INV-03**  | Tổng tỷ lệ phân bổ chi phí của một Subscription bằng 100%                                                                                                                                                                                                                                                                                                                                             | 7.4                       | CSDL + kiểm tra khi ghi                                                                  |
| **INV-04**  | Mọi trường tiền có loại tiền tệ, tỷ giá, ngày áp dụng tỷ giá và giá trị đã quy đổi                                                                                                                                                                                                                                                                                                                    | FR-1.6, ADR-03, 7.4       | CSDL — `NOT NULL` trên cả bộ trường                                                      |
| **INV-05**  | Nhật ký kiểm toán chỉ ghi thêm; `UPDATE` và `DELETE` bị từ chối                                                                                                                                                                                                                                                                                                                                       | FR-8.3                    | **CSDL** — quy tắc từ chối ở tầng bảng                                                   |
| **INV-06**  | Mỗi mục danh mục SaaS có đúng một Business Owner đang làm việc, không được rỗng                                                                                                                                                                                                                                                                                                                       | FR-1.7                    | Ứng dụng + cảnh báo khi chủ sở hữu nghỉ việc                                             |
| **INV-07**  | Assignment gắn với nhà thầu, freelancer hoặc thực tập sinh bắt buộc có ngày kết thúc dự kiến                                                                                                                                                                                                                                                                                                          | FR-2.8                    | CSDL — ràng buộc có điều kiện                                                            |
| **INV-08**  | Người yêu cầu không đồng thời là người phê duyệt của cùng một Request                                                                                                                                                                                                                                                                                                                                 | SoD-4, FR-3.3             | Ứng dụng — chặn ở tầng API, có test phủ định                                             |
| **INV-09**  | Quyết định miễn trừ (Exempt) bắt buộc có thời hạn, tối đa 12 tháng                                                                                                                                                                                                                                                                                                                                    | FR-3.10                   | CSDL — `NOT NULL` + kiểm tra khoảng                                                      |
| **INV-10**  | Mỗi nguồn usage bắt buộc khai báo cửa sổ dữ liệu bao phủ                                                                                                                                                                                                                                                                                                                                              | FR-4.3                    | CSDL — `NOT NULL`                                                                        |
| **INV-11**  | Mỗi nguồn usage bắt buộc khai báo định nghĩa "hoạt động" của nguồn đó                                                                                                                                                                                                                                                                                                                                 | FR-4.16                   | CSDL — `NOT NULL`                                                                        |
| **INV-12**  | Bản ghi chưa khớp được danh tính không được dùng làm căn cứ cho bất kỳ khuyến nghị nào                                                                                                                                                                                                                                                                                                                | FR-4.6, FR-4.10           | Ứng dụng — cổng lọc của rule engine                                                      |
| **INV-13**  | Mỗi nhà cung cấp chỉ có một Discovery Finding đang mở tại một thời điểm                                                                                                                                                                                                                                                                                                                               | FR-6.7                    | CSDL — chỉ mục duy nhất có điều kiện                                                     |
| **INV-14a** | Các khoảng hiệu lực _(nhân viên, Cost Center)_ của cùng một nhân viên không chồng lấn — **nhiều nhất một** Cost Center tại mỗi thời điểm                                                                                                                                                                                                                                                              | OQ-02, ADR-04             | **CSDL** — ràng buộc loại trừ theo khoảng thời gian                                      |
| **INV-14b** | Mỗi nhân viên **luôn có** một Cost Center đang hiệu lực; trường này **không được rỗng** _(chốt ở v3.11 — `QĐ-30c`)_                                                                                                                                                                                                                                                                                   | OQ-02, `QĐ-30c`           | **CSDL** — `NOT NULL` trên khóa ngoại Cost Center của khoảng đang hiệu lực               |
| **INV-15**  | Mọi bảng gốc nghiệp vụ mang cột định danh tổ chức, và cột này đứng đầu mọi ràng buộc duy nhất                                                                                                                                                                                                                                                                                                         | ADR-01                    | CSDL — quy ước lược đồ                                                                   |
| **INV-16**  | Mỗi khoản cam kết ngân sách gắn với **đúng một** Request đã được Người duyệt chi duyệt; một Request có tối đa một khoản cam kết                                                                                                                                                                                                                                                                       | FR-5.8, FR-3.13           | CSDL — khóa ngoại bắt buộc + chỉ mục duy nhất                                            |
| **INV-17**  | Không có bản ghi sử dụng nào từ thiết bị **chưa đăng ký** hoặc của nhân viên **chưa xác nhận chủ động** tại thời điểm ghi nhận                                                                                                                                                                                                                                                                        | FR-4.18, ADR-13           | Ứng dụng — chặn ở endpoint nhận dữ liệu, có test phủ định                                |
| **INV-18**  | _(mới ở v3.11 — `QĐ-30b`)_ Khoản cam kết ngân sách **được phép chưa gắn** `Budget` khi tại lúc duyệt chi chưa có ngân sách của cost center và kỳ đó; khoản đó **bắt buộc** mang lý do _Chưa có ngân sách_ và nằm trong hàng đợi ghi nhận của Finance. Khi `Budget` của **đúng cost center và kỳ đó** được lập, hệ thống **gắn** mọi khoản cam kết chưa có ngân sách thuộc kỳ đó vào ngân sách vừa lập | FR-3.14, FR-5.8, `QĐ-30b` | Ứng dụng — cổng tạo khoản cam kết và tác vụ gắn ngược khi tạo `Budget`; có test phủ định |

> **Ba bất biến quan trọng nhất khi bảo vệ:** `INV-02` (chống chồng lấn) và `INV-05` (nhật ký chỉ ghi thêm) là hai chỗ thể hiện rõ nhất nguyên tắc _đặt ràng buộc ở tầng cơ sở dữ liệu_; `INV-12` là thứ giữ cho tiêu chí nghiệm thu `TC-2` — không báo động giả — có thể đạt được.
>
> **Ghi chú về nguồn gốc:** danh sách này được **suy lại từ chính các yêu cầu của BRD** khi soạn v3.5, không sao chép từ bộ Domain Spec đã gỡ. Mỗi dòng đều dẫn được về một mã `FR`, `ADR`, `OQ` hoặc một mục còn tồn tại trong tài liệu này.

#### 5.12.3. Chín vòng đời có máy trạng thái _(tám tới v3.7; thêm BudgetCommitment ở v3.8)_

Chín thực thể dưới đây có vòng đời riêng và phải được đặc tả bằng máy trạng thái hữu hạn: tập trạng thái, tập chuyển trạng thái hợp lệ, điều kiện canh và hiệu ứng kèm theo.

| Thực thể                            | Vòng đời mô tả điều gì                                                                                                                                                                                                                                                                                                                                                                                      | Ràng buộc chính                                                                                                                                                                                                                                         |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Request**                         | Từ lúc nhân viên gửi yêu cầu tới lúc hoàn tất hoặc bị hủy. _(v3.8)_ Thêm trạng thái chờ **duyệt chi** ở nhánh (b), (c) của `FR-3.4` _(v3.10 — bỏ trạng thái chờ ý kiến ngân sách)_                                                                                                                                                                                                                          | Không tự duyệt khi quá hạn (FR-3.8); cho phép rút khi đang chờ                                                                                                                                                                                          |
| **BudgetCommitment** _(mới ở v3.8)_ | Khoản cam kết ngân sách: **đang giữ** → **đã thành chi phí**, hoặc → **đã giải phóng**. Ghi nhận của Finance là hành động trên khoản _đang giữ_, không phải trạng thái chặn _(v3.10)_. **Việc gắn ngân sách là thuộc tính, không phải trạng thái** _(v3.11 — `QĐ-30b`)_: khoản cam kết có thể ở _đang giữ_ mà **chưa gắn** `Budget`, rồi được gắn khi ngân sách ra đời — vòng đời **không** đổi vì việc gắn | Chỉ sinh khi Người duyệt chi duyệt Request có chi phí; gắn đúng một Request (`INV-16`); **được phép chưa gắn `Budget`** kèm lý do _Chưa có ngân sách_, gắn ngược khi ngân sách được lập (`INV-18`, `FR-5.8a`); không chuyển ngược từ _đã thành chi phí_ |
| **ApprovalStep**                    | Một mắt xích trong chuỗi duyệt của một Request                                                                                                                                                                                                                                                                                                                                                              | Có SLA riêng; approver dự phòng (FR-3.6); **không** ủy quyền (FR-3.5); người được giao chỉ đổi theo FR-3.15, FR-3.16 _(sửa ở v3.9)_                                                                                                                     |
| **Assignment**                      | Ý định của tổ chức về việc một người được dùng một phần mềm                                                                                                                                                                                                                                                                                                                                                 | Có khoảng hiệu lực; không chồng lấn (`INV-02`)                                                                                                                                                                                                          |
| **ProvisioningTask**                | Thao tác tạo hoặc xóa tài khoản thật phía nhà cung cấp: _chờ thực thi → đang thực thi → **chờ chấp nhận** → hoàn tất_, hoặc _→ thất bại_                                                                                                                                                                                                                                                                    | Tách khỏi Assignment (ADR-07); có số lần thử lại và lỗi gần nhất. **Trạng thái _chờ chấp nhận_** dùng cho ca nhà cung cấp mới chỉ tạo **lời mời `pending`**; **không** chuyển sang _hoàn tất_ chỉ vì API trả thành công — phải đối soát, xem mục 6.3    |
| **GhostSeatRecommendation**         | Vòng đời một khuyến nghị thu hồi: sinh ra → chờ xác nhận → được chấp nhận, bị bác bỏ, hoặc bị dữ liệu mới phủ định                                                                                                                                                                                                                                                                                          | Trạng thái _bị bác bỏ_ và _bị phủ định_ là đầu vào của KPI-5                                                                                                                                                                                            |
| **Attestation**                     | Xác nhận của quản lý: Giữ lại / Thu hồi / Tạm miễn trừ                                                                                                                                                                                                                                                                                                                                                      | Miễn trừ bắt buộc có hạn (`INV-09`)                                                                                                                                                                                                                     |
| **Employee**                        | Trạng thái làm việc: đang làm → nghỉ dài → đã nghỉ việc                                                                                                                                                                                                                                                                                                                                                     | Chuyển sang _đã nghỉ việc_ kích hoạt liệt kê seat và tác vụ xóa dữ liệu (FR-10.6)                                                                                                                                                                       |
| **DiscoveryFinding**                | Bản ghi phát hiện ngoài danh mục: cần xem xét → đã duyệt / chưa duyệt / báo nhầm                                                                                                                                                                                                                                                                                                                            | Không được kết luận là vi phạm khi chưa xử lý (FR-6.6); có thể mở lại (FR-6.7)                                                                                                                                                                          |

**Hai nguyên tắc bắt buộc khi đặc tả:**

1. **Không gộp hai tầng vòng đời.** Request có vòng đời riêng, và từng ApprovalStep bên trong nó cũng là một thực thể có vòng đời riêng. Gộp lại thì không mô tả được tình huống một bước quá SLA hoặc được xác định lại người duyệt (`FR-3.16`) trong khi cả Request vẫn đang chờ. _(ví dụ sửa ở v3.9 — trước đó dùng ca ủy quyền)_
2. **Chuyển trạng thái không có trong bảng thì coi như không tồn tại.** Danh sách các chuyển trạng thái **không hợp lệ** phải được viết ra và dùng làm bộ kiểm thử phủ định — cùng loại với bộ test phủ định của tám nguyên tắc `SoD`.

> **Thay đổi so với v3.4:** trước đây mục 5.3 và 5.10 dẫn người đọc sang _Domain Spec Phần 2_ để tra máy trạng thái. Từ v3.5, cả hai dẫn về mục này.

---

## 6. CÔNG NGHỆ ÁP DỤNG

### 6.1. Công nghệ nền và kiến trúc

| Thành phần        | Lựa chọn                                                                                                  |
| ----------------- | --------------------------------------------------------------------------------------------------------- |
| Frontend          | **React Router 8** Framework Mode chạy chế độ SPA (`ssr: false`) + **Vite** + TypeScript — xem **ADR-12** |
| Backend           | **NestJS** (Node.js / TypeScript); REST API, phân quyền theo vai trò ở tầng API — xem **ADR-11**          |
| Cơ sở dữ liệu     | PostgreSQL cho dữ liệu nghiệp vụ; ràng buộc toàn vẹn đặt ở tầng CSDL theo mục 5.12.2                      |
| Hàng đợi & cache  | Redis và background-job queue                                                                             |
| Lưu tệp           | MinIO/S3-compatible; không public trực tiếp, dùng signed URL                                              |
| Tích hợp          | CSV/Excel import là nền tảng; một connector demo có API thật                                              |
| Quan sát hệ thống | Audit log, error log, trạng thái job, thời điểm đồng bộ cuối                                              |

### 6.2. Kiến trúc thực thi cấp phát (Provisioning Port)

Hệ thống định nghĩa một giao diện trừu tượng cho việc cấp/thu hồi quyền với các thao tác: cấp quyền, thu hồi quyền, liệt kê người dùng, liệt kê license. Các bản triển khai:

- **Connector adapter** — gọi API của nhà cung cấp có hỗ trợ
- **Manual adapter** — sinh tác vụ cho IT Admin thực hiện tay và xác nhận hoàn tất

> **Ý nghĩa thiết kế:** "làm thủ công" trở thành một adapter bình thường thay vì một nhánh điều kiện rải khắp mã nguồn. Yêu cầu kèm theo: khóa chống gọi trùng, cơ chế thử lại có giãn cách, giới hạn tần suất, và job đối soát sai lệch.

### 6.3. Chiến lược dữ liệu cho phân hệ Usage

#### 6.3.1. Ma trận khả năng truy xuất dữ liệu usage theo nhà cung cấp _(mục mới ở v3.3)_

Đây là ràng buộc quyết định phân hệ 5.4 làm được tới đâu, nên cần số liệu tra cứu chứ không phải phỏng đoán. _(v3.8 — `QĐ-21`)_ Bảng dưới đây mở rộng từ 8 lên **11 nhà cung cấp**, thêm ba cột **thành viên/seat**, **cấp phát**, **cờ liên lạc**, tra tại tài liệu chính thức **ngày 14/09/2026**. Chi tiết trích dẫn và nguồn từng ô: `Docs/Research-AI/usage-tracking-legal-vendor-research-2026-09-14.md` mục 3.

**Mức kiểm chứng:** ✅ đọc trực tiếp tài liệu chính thức ngày 14/09/2026 · 🔎 chỉ qua kết quả tìm kiếm hoặc trang tóm tắt · 📁 kế thừa bảng v3.3–v3.6, tra ngày 29/08/2026 hoặc 08/09/2026 · ❓ chưa kiểm chứng. **Ô 🔎 và ❓ không được đưa vào báo cáo cuối như sự thật đã kiểm chứng.**

| Nhà cung cấp                           | Thành viên / seat                                                                                        | Dữ liệu hoạt động                                                                                                                                                                                                                                                                                                                                                                        | Cấp phát                                                                             | Cờ liên lạc               | Tầng demo                  |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------- | -------------------------- |
| **GitHub** (Organization)              | ✅ `GET /orgs/{org}/members`; ✅ `GET /orgs/{org}` trả `plan.seats`, `plan.filled_seats` — cần org owner | ✅ _(tra lại 15/09/2026 — `QĐ-28a`)_ Audit log CSV/JSON 180 ngày chỉ ghi **hành động quản trị** — **không** có push/commit/PR, **không** dùng làm nguồn usage. Events API chỉ 300 sự kiện/30 ngày — không dùng. **Nguồn usage:** lịch sử commit `GET /repos/{owner}/{repo}/commits?author=&since=` (hoạt động = có commit vào repo của org) **và** tiện ích trình duyệt với `github.com` | ✅ `PUT`/`DELETE .../memberships/{username}` — `PUT` tạo lời mời `pending` (`QĐ-03`) | Không                     | **A**                      |
| **GitHub Copilot** Business/Enterprise | ✅ `GET /orgs/{org}/copilot/billing/seats`, chỉ org owner                                                | ✅ `last_activity_at`, `last_activity_editor` mỗi seat — hoạt động trong IDE khi bật telemetry                                                                                                                                                                                                                                                                                           | ✅ `POST`/`DELETE .../copilot/billing/selected_users`                                | Không                     | B                          |
| **Microsoft 365**                      | ✅ `GET /subscribedSkus` → `prepaidUnits.enabled`, `consumedUnits`                                       | ✅ `getOffice365ActiveUserDetail`: _Last Activity Date_ theo Exchange, OneDrive, SharePoint, Teams; kỳ `D7/D30/D90/D180`. ✅ `signInActivity` **cần Entra ID P1/P2**. 📁 Tên người dùng ẩn mặc định                                                                                                                                                                                      | ❓                                                                                   | **Exchange, Teams: có**   | **B**                      |
| **Google Workspace**                   | ✅ Directory API `users.list`, trường `lastLoginTime`                                                    | 🔎 Reports API _user usage_; bậc phiên bản chưa xác minh. `lastLoginTime` là sự kiện xác thực — chỉ làm **bằng chứng phủ định** (`FR-4.11`)                                                                                                                                                                                                                                              | ✅ Directory API `insert`, `delete`                                                  | **Gmail, Meet, Chat: có** | B                          |
| **Slack**                              | ❓ `users.list`                                                                                          | ✅ `team.accessLogs`: workspace **trả phí**; trả `date_last`, `count` **kèm IP, user agent, vùng địa lý** — phải bỏ khi nhập                                                                                                                                                                                                                                                             | 🔎 SCIM: Business+ và Enterprise Grid                                                | **Có**                    | **C**                      |
| **Atlassian**                          | 📁 Xuất danh sách người dùng CSV                                                                         | ✅ API _last active dates_ theo sản phẩm; hoạt động = _xem trang ≥ 2 giây_; trễ tới 24 giờ; không nêu ràng buộc gói cho endpoint lõi                                                                                                                                                                                                                                                     | 🔎 SCIM cần **Atlassian Guard Standard**                                             | Không                     | **B**                      |
| **Figma**                              | 📁                                                                                                       | 📁 Xuất nhật ký hoạt động CSV từ gói **Organization**, **không hồi tố**. ✅ **Activity Logs API chỉ gói Enterprise**                                                                                                                                                                                                                                                                     | 🔎 SCIM gói Organization và Enterprise                                               | Không                     | **B**                      |
| **Zoom**                               | 🔎 `GET /users` có `last_login_time`                                                                     | ✅ Báo cáo host hoạt động/không hoạt động: gói **Pro trở lên**, owner/admin                                                                                                                                                                                                                                                                                                              | ❓                                                                                   | **Có**                    | C                          |
| **Notion**                             | ❓                                                                                                       | ✅ Workspace analytics có _last active_ theo thành viên, xuất CSV — **chỉ gói Enterprise**                                                                                                                                                                                                                                                                                               | 🔎 SCIM chỉ Enterprise                                                               | Không                     | **C** → G3/G4 nhờ tiện ích |
| **ChatGPT** Business/Enterprise        | ❓                                                                                                       | 🔎 Enterprise và Edu xuất CSV có ngày hoạt động cuối trong kỳ; **Business không xuất được**                                                                                                                                                                                                                                                                                              | ❓                                                                                   | Không                     | C → G3/G4 nhờ tiện ích     |
| **Cursor** Teams                       | ✅ `GET /teams/members`                                                                                  | ✅ `POST /teams/daily-usage-data`: `isActive` theo ngày, mỗi lần ≤ 30 ngày                                                                                                                                                                                                                                                                                                               | ✅ `POST /teams/remove-member` _(chỉ thu hồi)_                                       | Không                     | B                          |

**Tầng demo** _(chốt ở `QĐ-21`)_: **A** — dữ liệu thật (GitHub org của nhóm, tiện ích trình duyệt trên máy nhóm) · **B** — file mô phỏng đúng cấu trúc xuất thật; **bắt buộc demo Microsoft 365, Atlassian, Figma** · **C** — chỉ G1/G2 cộng hợp đồng và chi phí; **bắt buộc demo Slack, Notion** · **D** — không xử lý được: tài khoản cá nhân trên thiết bị cá nhân, ứng dụng desktop khi agent chưa hiện thực, trình duyệt không được quản lý. Chữ **in đậm** ở cột tầng là dịch vụ bắt buộc demo.

> **Đóng hai ô "chưa kết luận" của bảng cũ:** Zoom **có** dữ liệu hoạt động từ gói Pro nhưng mang cờ liên lạc nên **không thu** (`ADR-10`). Notion **chỉ có** ngày hoạt động theo người ở gói Enterprise.

**Sáu kết luận rút ra, ảnh hưởng trực tiếp tới phạm vi** _(năm tới v3.7; thêm `KL-6` ở v3.8)_:

**KL-1 — GitHub là nguồn dữ liệu thật khả thi nhất, và nên là nguồn thật chính của đồ án.** _(viết lại ở v3.9 — `QĐ-28a`)_ Không phải vì audit log: tra lại ngày 15/09/2026, audit log của organization chỉ ghi _"events triggered by activities that affect your organization"_ — hành động quản trị như tạo team, quản lý repo, cấu hình bảo mật — **không** có push, commit hay PR, nên **không** chứng minh được ai đang dùng. GitHub khả thi vì **lịch sử commit** của các repo thuộc org đọc được qua REST API **không cần gói trả phí**, không bị giới hạn 30 ngày như Events API, và nhóm có sẵn repo dự án nên có dữ liệu thật, hợp lệ. Nguồn thứ hai là tiện ích trình duyệt với `github.com`.

> 📁 _Phát biểu cũ (v3.3 → v3.8), không còn hiệu lực:_ ~~"cho phép xuất dữ liệu hoạt động ở cấp Organization … với lịch sử 180 ngày"~~ — đánh đồng audit log với dữ liệu sử dụng.

**KL-2 — GitHub buộc tầng ánh xạ danh tính phải chạy thật.** _(sửa ở v3.9)_ Commit gắn với **`login` chứ không phải email công việc** — email trong commit có thể là email cá nhân hoặc địa chỉ ẩn danh của GitHub — nên tầng ánh xạ danh tính (FR-4.5) phải hoạt động thật chứ không khớp trực tiếp được. Commit không khớp tài khoản (`author` rỗng) phải vào hàng đợi chưa khớp (FR-4.6), không được dùng để kết luận. Hệ thống cũng phải tự tổng hợp nhiều commit thành ngày hoạt động cuối theo Assignment (FR-4.1 dạng sự kiện, FR-4.7). **Điểm mù phải nói:** người chỉ review hoặc đọc code không tạo commit — đó là lý do cần nguồn thứ hai.

**KL-3 — Trường hợp Figma là bằng chứng thực tế cho FR-4.3.** Figma ghi rõ nhật ký hoạt động **không áp dụng hồi tố** sau khi nâng gói: dữ liệu chỉ bắt đầu từ ngày nâng cấp. Đây chính xác là tình huống mà cột "cửa sổ dữ liệu bao phủ" sinh ra để xử lý — nếu hệ thống không biết dữ liệu chỉ bắt đầu từ tháng trước, nó sẽ kết luận nhầm toàn bộ người dùng cũ là "chưa từng hoạt động". Nên trích dẫn ví dụ này khi bảo vệ FR-4.3.

**KL-4 — Microsoft 365 mặc định ẩn tên người dùng trong báo cáo sử dụng.** Quản trị viên phải chủ động bật mới thấy được danh tính; mặc định báo cáo hiển thị dạng ẩn danh. Đây là **bằng chứng thực tế cho thấy nguyên tắc giả danh hóa ở màn hình usage (OQ-03) là chuẩn mực ngành**, không phải quy tắc nhóm tự nghĩ ra. Nên dẫn ví dụ này khi bảo vệ quyết định ẩn họ tên ở phân hệ 5.4.

**KL-5 — Mỗi nhà cung cấp định nghĩa "hoạt động" một kiểu, và có nơi định nghĩa rất lỏng.** Atlassian tính là hoạt động khi người dùng **xem một trang từ 2 giây trở lên**. Nếu hệ thống nhận con số "ngày hoạt động cuối" từ nguồn này mà không biết nó có nghĩa gì, thì mọi người đều "đang dùng" và kết quả phát hiện về gần 0 — cùng loại sai lầm với việc tính sự kiện đăng nhập là hoạt động (FR-4.11).

Hệ quả: mẫu cấu hình nguồn không chỉ cần ghi _có hay không có trường ngày hoạt động cuối_, mà phải ghi cả **nguồn đó hiểu "hoạt động" là gì** — xem FR-4.16.

**KL-6 — Dữ liệu hoạt động theo từng người gần như luôn nằm ở gói cao nhất** _(mới ở v3.8)_. Figma, Notion, ChatGPT: Enterprise; Microsoft `signInActivity`: Entra ID P1/P2; Slack: gói trả phí. Doanh nghiệp vừa hiếm khi mua đủ các gói này, nên nguồn nhà cung cấp một mình không trả lời được câu hỏi _"nhân viên có thật sự dùng không"_. Đây là căn cứ của bộ thu thập trên thiết bị (mục 5.4.4b) và là bằng chứng mới cho `RB-3`.

**Nguồn tra cứu cho bảng trên** _(ngày truy cập 29/08/2026)_:
[GitHub — Reviewing the audit log for your organization](https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization) ·
[Figma — View and export activity logs](https://help.figma.com/hc/en-us/articles/360040449533-View-and-export-activity-logs) ·
[Google Workspace — User reports: Accounts](https://knowledge.workspace.google.com/admin/reports/user-reports-accounts) ·
[Slack — View your Slack analytics dashboard](https://slack.com/help/articles/218407447-View-your-Slack-analytics-dashboard) ·
[Microsoft 365 — Apps Active Users Report](https://learn.microsoft.com/en-us/microsoft-365/admin/activity-reports/active-users-ww?view=o365-worldwide) ·
[Atlassian — User's last active dates](https://developer.atlassian.com/cloud/admin/organization/user-last-active-dates/)

> **Số liệu trong bảng thay đổi theo chính sách nhà cung cấp.** Nhóm phải kiểm chứng lại tại trang tài liệu chính thức trước khi đưa vào báo cáo cuối, và ghi ngày truy cập. _(v3.8)_ Danh sách nguồn trên là của bảng v3.3; **nguồn của năm nhà cung cấp mới và các cột mới** nằm ở báo cáo nghiên cứu ngày 14/09/2026 mục 6. Zoom và Notion **đã được tra** ở đợt đó.

**Nguyên tắc thiết kế rút ra:** ranh giới giữa SaaS-Sentry và thế giới bên ngoài đặt ở **định dạng dữ liệu**, không đặt ở **nhà cung cấp**. Hệ thống nhận một file có cấu trúc được mô tả bằng mẫu cấu hình; việc file đó do nhà cung cấp sinh ra hay do khách hàng tự chuẩn bị là chuyện của khách hàng. Đây cũng là cách các nền tảng SaaS management thương mại vận hành — không nền tảng nào có API tới toàn bộ ứng dụng SaaS trên thị trường.

**Chiến lược ba lớp cho phần chứng minh:**

| Lớp                              | Nội dung                                                                                           | Mục đích                                                                                                                                                                                              |
| -------------------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Nguồn thật**                | **Lịch sử commit** các repo của org GitHub dự án _(sửa ở v3.9 — `QĐ-28a`; trước đó ghi audit log)_ | Chứng minh tầng ánh xạ chạy được với dữ liệu thật: định danh là `login` chứ không phải email, timestamp UTC, commit không khớp tài khoản, lịch sử giới hạn; hợp nhất với nguồn tiện ích theo `FR-7.7` |
| **2. Dữ liệu mô phỏng**          | Script sinh dữ liệu theo cấu trúc export thực tế, mỗi nhân viên mang một hồ sơ hành vi có chủ đích | Bao phủ đủ các nhánh rule, gồm cả các trường hợp hệ thống phải **loại trừ**                                                                                                                           |
| **3. Connector thật**            | GitHub REST API                                                                                    | Chứng minh kênh Connector hoạt động, đối lập với kênh Manual                                                                                                                                          |
| **4. Bộ thu thập thật** _(v3.8)_ | Tiện ích trình duyệt chạy trên máy của thành viên nhóm, **sau khi từng người xác nhận chủ động**   | Chứng minh lọc tại nguồn, chặn dữ liệu khi chưa xác nhận (`INV-17`), và nâng một ứng dụng từ chỉ G1/G2 lên G3/G4 bằng dữ liệu thật                                                                    |

> ⚠️ **Ràng buộc đã kiểm chứng cho Lớp 3** _(tra tại tài liệu GitHub, ngày truy cập 08/09/2026)_: **REST API và GraphQL API của nhật ký kiểm toán tổ chức chỉ dùng được với GitHub Enterprise Cloud** — nguyên văn: _"Organizations that use GitHub Enterprise Cloud can interact with the audit log using the GraphQL API and REST API."_ Bản xuất CSV/JSON qua giao diện quản trị và lịch sử 180 ngày **không** bị ràng buộc này.
>
> **Hệ quả:** ràng buộc này không chặn đồ án. _(sửa ở v3.9 — `QĐ-28a`)_ Audit log — dù xuất file hay gọi API — chỉ ghi hành động quản trị nên **không** còn là nguồn usage của Lớp 1; Lớp 1 dùng lịch sử commit qua REST API, vốn không mang ràng buộc Enterprise Cloud.
>
> ✅ **Đã chốt ở v3.6** _(**`QĐ-03`** của sổ quyết định — connector GitHub)_: Lớp 3 dùng **API thành viên tổ chức**, không đụng tới audit-log API:
>
> | Thao tác của Provisioning Port                  | Endpoint                                    | Ngữ nghĩa thật của API                                                                                                                                                                      |
> | ----------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
> | Liệt kê người dùng                              | `GET /orgs/{org}/members`                   | Trả về thành viên **đã kích hoạt**. Người gọi là thành viên của tổ chức thì thấy cả thành viên công khai lẫn ẩn danh; **người được mời nhưng chưa chấp nhận KHÔNG nằm trong danh sách này** |
> | **Mời / thêm hoặc cập nhật tư cách thành viên** | `PUT /orgs/{org}/memberships/{username}`    | Với người **chưa** là thành viên, API **gửi thư mời**; trạng thái là **`pending` cho tới khi người đó chấp nhận**. Với người **đã** là thành viên, nó cập nhật vai trò                      |
> | Thu hồi tư cách thành viên                      | `DELETE /orgs/{org}/memberships/{username}` | Gỡ người dùng khỏi tổ chức, kèm mọi team và repo của tổ chức                                                                                                                                |
>
> ⚠️ **Ba điều chỉnh so với bản nháp trước — quan trọng khi vẽ luồng và khi demo:**
>
> 1. **Mã quyết định đúng là `QĐ-03`**, không phải `QĐ-02` (`QĐ-02` là approver dự phòng, `FR-3.6`). Bản nháp trước dẫn nhầm mã.
> 2. **`PUT` không phải là "cấp quyền" hoàn tất.** Nó tạo **lời mời ở trạng thái `pending`**. **Lời mời đã gửi không đồng nghĩa thành viên đã kích hoạt, cũng không đồng nghĩa seat đã được cấp.** Vì vậy `ProvisioningTask` **không được** chuyển sang trạng thái hoàn tất chỉ vì `PUT` trả về thành công — cần một bước đối soát lại bằng `GET .../members` hoặc bằng trạng thái membership. Đây là ràng buộc thật của nhà cung cấp, không phải lựa chọn thiết kế.
> 3. **Điều kiện quyền:** tài liệu chính thức ghi rõ **chỉ chủ sở hữu tổ chức (org owner) đã xác thực** mới được thêm/cập nhật hoặc gỡ thành viên. Với fine-grained token, cần quyền ghi ở nhóm **`Members`**.
>
> _(Kiểm chứng lại tại `docs.github.com/en/rest/orgs/members` ngày 08/09/2026, đọc trực tiếp trang tài liệu.)_
>
> Trang tài liệu của nhóm endpoint này **không mang ràng buộc gói nào** — khác hẳn trang audit log. Cách này khớp `RB-4` _(chỉ dùng nhà cung cấp có API miễn phí)_ và vẫn chứng minh được kênh Connector đối lập kênh Manual.
>
> 🔴 **Điều kiện còn phải thỏa — CHƯA XÁC MINH, là điểm chặn demo của nhánh connector:** nhóm cần một **tổ chức GitHub thật**, một tài khoản giữ quyền **owner** trên tổ chức đó, và **token có quyền ghi `Members`**. Tài liệu GitHub chứng minh _endpoint tồn tại và cần quyền gì_; nó **không** chứng minh nhóm đang có tổ chức hay quyền đó.
>
> [GitHub — Reviewing the audit log for your organization](https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization)

**Yêu cầu với dữ liệu mô phỏng:** phải chứa sẵn các hồ sơ dùng nhiều, dùng thưa, đã ngừng dùng, chưa từng dùng, đã nghỉ việc, mới vào (bị loại bởi ngưỡng ân hạn), đang nghỉ phép (bị loại bởi cổng lọc), và định danh không khớp được. Chính nhờ ba hồ sơ cuối mà hệ thống chứng minh được nó **không báo động giả** — điều quan trọng hơn việc tìm ra nhiều.

**Nguyên tắc minh bạch:** tài liệu và phần demo gọi rõ đây là _dữ liệu mô phỏng theo cấu trúc export thực tế của nhà cung cấp_, kèm phụ lục chứa cả file thật lẫn script sinh dữ liệu.

### 6.4. Lớp AI hỗ trợ (tùy chọn, không phải lõi hệ thống)

**Nguyên tắc xuyên suốt:** backend tính toán ra số và ra kết luận; AI chỉ diễn giải và hỗ trợ tra cứu. AI **không** tự phê duyệt chi phí, **không** tự cấp/thu hồi seat, **không** tự chặn ứng dụng, **không** tự đóng cảnh báo.

| Vai trò      | Tính năng AI                | Mô tả                                                                                                                    | Ràng buộc                                                                                                            |
| ------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| **IT Admin** | Trợ lý phân loại Shadow IT  | Gợi ý nhà cung cấp cho các mô tả giao dịch mà từ điển và mẫu nhận dạng không xử lý được                                  | Chỉ chạy cho trường hợp không khớp được bằng rule; kết quả luôn ở mức tin cậy thấp và **bắt buộc** IT Admin xác nhận |
| **Finance**  | Trợ lý tra cứu hợp đồng     | Hỏi đáp trên tệp hợp đồng được cấp quyền theo cơ chế truy hồi (RAG): ngày hết hạn, điều kiện hủy, đơn giá                | **Bắt buộc** trích dẫn đoạn nguồn trong tài liệu; không đưa ra quyết định tài chính                                  |
| **Finance**  | Diễn giải chi phí           | Chuyển kết quả tính toán của backend thành đoạn giải thích ngôn ngữ tự nhiên                                             | Backend tính số, AI chỉ diễn giải; mọi con số trong câu trả lời phải truy được về nguồn tính toán                    |
| **Manager**  | Tóm tắt tình trạng cấp dưới | Tóm tắt các khuyến nghị đang chờ xác nhận cho nhân viên trong phạm vi quản lý trực tiếp _(cây người phụ trách, `QĐ-23`)_ | Chỉ dùng dữ liệu tổng hợp, **không** truy cập raw activity log (theo SoD-2)                                          |

**Về con số độ tin cậy:** mức tin cậy hiển thị cho người dùng được tính từ **phương pháp khớp** (theo FR-6.5), không lấy con số do mô hình ngôn ngữ tự báo cáo, vì mô hình ngôn ngữ không hiệu chỉnh xác suất đáng tin cậy.

**Vì sao không dùng học máy cho phát hiện Ghost Seat:** bài toán có nhãn xác định (dùng hoặc không dùng), quyết định cuối cùng vẫn do con người, và điều người dùng cần nhất là hiểu được lý do. Ngoài ra không có tập dữ liệu huấn luyện có nhãn. Rule-based có thể giải thích là lựa chọn đúng về mặt kỹ thuật ở đây.

**Điều kiện triển khai:** lớp AI chỉ được triển khai sau khi các phân hệ lõi hoàn tất. Hệ thống phải vận hành đầy đủ khi lớp AI bị tắt.

---

## 7. YÊU CẦU PHI CHỨC NĂNG VÀ BẢO MẬT

### 7.1. Hiệu năng

- Tải trang ≤ 3 giây; tìm kiếm ≤ 2 giây
- Hỗ trợ ≥ 100 người dùng đồng thời trong phạm vi dữ liệu demo/MVP

### 7.2. Xác thực và phân quyền

- OAuth 2.0 / OpenID Connect, JWT session token, phân quyền theo vai trò
- Có thể mở rộng xác thực đa yếu tố khi tích hợp IdP
- Phân quyền kiểm soát ở tầng API, không chỉ ẩn ở giao diện — hiện thực bằng cơ chế guard của NestJS (ADR-11)

### 7.3. Bảo vệ dữ liệu

- Mã hóa khi truyền
- Kiểm soát truy cập tệp hợp đồng qua signed URL có thời hạn
- Quản lý secret tách khỏi mã nguồn
- Kiểm tra và xác thực file import
- Audit Trail chỉ ghi thêm cho mọi thay đổi

### 7.4. Toàn vẹn dữ liệu

- Số Assignment đang chiếm chỗ không vượt quá số seat đã mua; xử lý tranh chấp khi hai người thao tác đồng thời
- Các khoảng hiệu lực của cùng cặp (nhân viên, thuê bao) không chồng lấn
- Tổng tỷ lệ phân bổ chi phí bằng 100%
- Mọi trường tiền có loại tiền tệ và giá trị quy đổi

_Danh sách đầy đủ mười bảy bất biến và nơi đặt ràng buộc: xem mục 5.12.2._

### 7.5. Quyền riêng tư và chính sách lưu giữ

- Chỉ thu thập trường dữ liệu tối thiểu cần cho mục đích quản trị license
- Giới hạn quyền xem theo vai trò và phạm vi quản lý
- Manager chỉ thấy dữ liệu tổng hợp của nhân viên trực thuộc, không xem raw activity log (SoD-2)
- Màn hình usage và discovery hiển thị mã nhân viên và email công việc, ẩn họ tên (OQ-03)

**Chính sách lưu giữ** _(chốt ở v3.3 — đóng OQ-08)_:

| Loại dữ liệu                                                                       | Thời hạn lưu giữ                                                                                                                                                              | Căn cứ                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bản ghi hoạt động chi tiết theo ngày — **mọi ứng dụng**                            | **6 tháng**, hoặc **30 ngày sau ngày làm việc cuối** của nhân viên — cái nào đến trước                                                                                        | **Rút từ 12 xuống 6 tháng ở v3.6 theo `QĐ-01`, nhóm trưởng xác nhận con số 08/09/2026.** Vẫn phủ ngưỡng phát hiện dài nhất **90 ngày** (`FR-4.12`) với dư biên gấp đôi; **so sánh theo kỳ và dự báo dùng bảng tổng hợp đã phi định danh giữ 24 tháng** ở dòng dưới, không dùng bản ghi chi tiết. Mốc 6 tháng vốn đã áp cho nhóm liên lạc, nay áp nhất quán cho tất cả. ⚠️ _Đây là **quyết định lưu giữ của dự án** theo nguyên tắc thận trọng, **không phải** một kết luận rằng mốc này đáp ứng đủ nghĩa vụ pháp lý — xem giới hạn ở mục 7.7.7_ |
| **Bản ghi từ bộ thu thập trên thiết bị** _(v3.8)_ và **bản ghi xác nhận chủ động** | Bản ghi sử dụng: **6 tháng**, hoặc 30 ngày sau ngày làm việc cuối — cái nào đến trước. Bản ghi xác nhận: giữ **cùng thời hạn với dữ liệu mà nó làm căn cứ**, rồi xóa cùng lúc | Dữ liệu được coi là **nhạy cảm** (mục 7.7.6); xóa khi chấm dứt hợp đồng theo **Điều 25 khoản 2 điểm c Luật 91/2025/QH15, đã đọc nguyên văn**                                                                                                                                                                                                                                                                                                                                                                                                    |
| Bản ghi hoạt động của **ứng dụng nhóm dịch vụ liên lạc** (FR-1.8)                  | **6 tháng**, hoặc 30 ngày sau ngày làm việc cuối — cái nào đến trước                                                                                                          | Nguyên tắc thận trọng theo ADR-10. **Chỉ phát sinh khi doanh nghiệp chủ động bật thu thập cho nhóm này** — ở chế độ mặc định của `ADR-10`, hệ thống không tạo ra loại dữ liệu này nên không có gì để lưu                                                                                                                                                                                                                                                                                                                                        |
| Dữ liệu tổng hợp **đã phi định danh** theo ứng dụng và đơn vị                      | 24 tháng                                                                                                                                                                      | Không còn là dữ liệu cá nhân; phục vụ so sánh theo kỳ và dự báo                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Nhật ký kiểm toán                                                                  | Theo yêu cầu của pháp luật kế toán, kiểm toán và nội quy doanh nghiệp                                                                                                         | Chỉ ghi thêm; **không** xóa theo chính sách này                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Bằng chứng discovery từ sao kê, hóa đơn                                            | 24 tháng                                                                                                                                                                      | Chủ yếu là dữ liệu giao dịch doanh nghiệp                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

**Lý do của quy tắc "30 ngày sau ngày làm việc cuối":** phần diễn giải Luật Bảo vệ dữ liệu cá nhân mà nhóm đọc được hiểu rằng dữ liệu cá nhân của người lao động được lưu trữ trong thời hạn theo quy định pháp luật hoặc theo thỏa thuận, và khi chấm dứt hợp đồng lao động thì các bên **xóa, hủy dữ liệu cá nhân của người lao động**, trừ trường hợp có thỏa thuận khác hoặc pháp luật quy định khác. Nhóm **chọn** thiết kế hệ thống theo hướng thận trọng đó: không mặc định giữ dữ liệu hành vi của người đã nghỉ tới hết kỳ lưu giữ chung.

> ⚠️ **Mức độ kiểm chứng — tách làm hai vế, viết lại ở v3.11 (`SA-08`).** Hai vế dưới đây khác nhau và **không được gộp**:
>
> 1. **Đã kiểm chứng nguyên văn điều khoản — xong.** Điều 25 khoản 2 điểm c Luật 91/2025/QH15 đã được đọc tại bản Công báo _(chi tiết ở khối ✅ ngay dưới, tra ngày 14/09/2026)_. Diễn giải ở đoạn trên **khớp** nguyên văn. Vế này **không còn là khoảng trống**.
> 2. **Chưa có kết luận về mức đủ pháp lý — còn mở.** Việc mốc **30 ngày**, cơ chế **xác nhận chủ động** và chính sách lưu giữ hiện tại có **đáp ứng đủ** nghĩa vụ luật định hay không là một **kết luận pháp lý**, cần ý kiến chuyên môn — xem `OQ-16` và mục 7.7.7. Luật **không** quy định con số 30 ngày; đó là **quyết định thiết kế của dự án**.
>
> ⟹ Báo cáo cuối được phép nói _"đã đối chiếu nguyên văn Điều 25 khoản 2 điểm c"_, nhưng **không** được nói _"hệ thống đã tuân thủ"_ khi chưa có ý kiến pháp lý.
> 📁 _Bản v3.6 của khối này ghi "chưa được kiểm chứng ở mức điều khoản" — đúng tại thời điểm đó, **không còn đúng** sau khi đọc nguyên văn ở v3.8._
>
> ✅ **Cập nhật ở v3.8 — đã đọc nguyên văn điều khoản.** **Điều 25 khoản 2 điểm c** Luật 91/2025/QH15, PDF Công báo số 971 + 972 ngày 24/07/2025: _"Phải xóa, hủy dữ liệu cá nhân của người lao động khi chấm dứt hợp đồng, trừ trường hợp theo thỏa thuận hoặc pháp luật có quy định khác."_ Diễn giải ở trên **khớp** nguyên văn. Luật **không** quy định con số _30 ngày_ — đó vẫn là **quyết định thiết kế** của dự án về thời gian thực hiện việc xóa.

- **FR-10.6:** Khi một nhân viên chuyển sang trạng thái đã nghỉ việc, hệ thống tự động xóa bản ghi hoạt động chi tiết của người đó trong vòng 30 ngày kể từ ngày làm việc cuối, đồng thời **giữ lại** dữ liệu tổng hợp đã phi định danh và nhật ký kiểm toán. Tác vụ xóa ghi nhận số bản ghi đã xóa và thời điểm thực hiện.

> **Cần lưu ý khi triển khai thật:** nếu doanh nghiệp muốn giữ dữ liệu lâu hơn mốc trên — ví dụ để phục vụ tranh chấp lao động hoặc kiểm toán — thì phải có **thỏa thuận** trong hợp đồng lao động hoặc chính sách nội bộ đã thông báo, không thể chỉ đặt cấu hình trong hệ thống.
>
> Dòng "90 ngày cho log truy cập thô" ở v2.0 và v3.0 **đã được gỡ bỏ**, vì nguồn log web/proxy không còn nằm trong phạm vi hệ thống (mục 5.6.1).

Chi tiết về khung pháp lý, cơ sở xử lý và đối chiếu nghĩa vụ với thiết kế: xem **mục 7.7**.

### 7.6. Phân tách trách nhiệm

Theo bảng SoD-1 đến SoD-8 tại mục 4.2 _(SoD-7, SoD-8 thêm ở v3.8)_. Bộ kiểm thử phủ định cho tám nguyên tắc này chạy ở tầng guard của API (ADR-11).

### 7.7. Tuân thủ pháp luật bảo vệ dữ liệu cá nhân _(mục mới ở v3.1)_

#### 7.7.1. Khung pháp lý áp dụng

| Văn bản                                         | Tình trạng                     | Vai trò với dự án                     |
| ----------------------------------------------- | ------------------------------ | ------------------------------------- |
| **Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15** | Hiệu lực từ **01/01/2026**     | Văn bản gốc điều chỉnh                |
| **Nghị định 356/2025/NĐ-CP**                    | Hiệu lực từ **01/01/2026**     | Hướng dẫn thi hành, quy định chi tiết |
| ~~Nghị định 13/2023/NĐ-CP~~                     | **Hết hiệu lực từ 01/01/2026** | Không còn viện dẫn                    |

_(v3.8)_ **Văn bản hỗ trợ** được viện dẫn cho bộ thu thập trên thiết bị: Bộ luật Lao động 2019 Điều 118 _(nội quy lao động)_, Bộ luật Dân sự 2015 Điều 38 _(bí mật đời tư, thư tín, cơ sở dữ liệu điện tử)_. Hai văn bản này mới được đọc qua trang đăng lại, **chưa đọc tại Công báo** — không dùng làm căn cứ chính.

**Đã đọc nguyên văn ở v3.8** _(ngày 14/09/2026)_: Luật 91/2025/QH15 các Điều **3, 7, 8, 9, 11, 19, 21, 25, 32, 38** trên [PDF Công báo số 971 + 972](https://congbaocdn.chinhphu.vn/CongBaoCP/VanBan/2025/6/45578/57730-1-2025971-97291-2025-qh15.pdf). Bản PDF ký số của Nghị định 356/2025 là **ảnh quét**, không trích được chữ; chỉ điểm `l)` khoản 1 Điều 4 đã đọc bằng mắt ở v3.6.

**Nguồn tra cứu** _(ngày truy cập 29/08/2026 — nhóm cần đọc trực tiếp văn bản gốc)_:
[Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 — cổng văn bản Chính phủ](https://vanban.chinhphu.vn/?classid=1&docid=214590&pageid=27160&typegroupid=3) ·
[Nghị định 356/2025/NĐ-CP — cổng văn bản Chính phủ](https://vanban.chinhphu.vn/?classid=0&docid=216387&pageid=27160) ·
[Luật Viễn thông số 24/2023/QH15 — cổng văn bản Chính phủ](https://vanban.chinhphu.vn/?docid=209631&pageid=27160)

> **Quy tắc nguồn của nhóm:** văn bản pháp luật dẫn về **Công báo, cổng văn bản Chính phủ hoặc cổng Quốc hội**. Các trang tra cứu luật tư nhân chỉ là nguồn hỗ trợ để đọc nhanh, không dùng làm căn cứ trong báo cáo.
>
> ⚠️ **Cảnh báo cho nhóm:** BRD v2.0 và v3.0 viện dẫn Nghị định 13/2023/NĐ-CP như văn bản đang hiệu lực. Điều này **không còn đúng**. Trích dẫn một văn bản đã hết hiệu lực là lỗi hội đồng phát hiện rất nhanh.

#### 7.7.2. Phân loại dữ liệu hệ thống xử lý theo mức rủi ro

Việc phân loại này quyết định phần nào của hệ thống cần biện pháp chặt hơn. Phần lớn hệ thống xử lý dữ liệu doanh nghiệp, không phải dữ liệu cá nhân.

| Nhóm dữ liệu                                                                                                        | Là dữ liệu cá nhân?                                                    | Mức rủi ro                                                           | Phân hệ liên quan |
| ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------- | ----------------- |
| Hợp đồng, hóa đơn, thuê bao, chi phí                                                                                | Không — dữ liệu doanh nghiệp                                           | Không nằm trong phạm vi điều chỉnh                                   | 5.1, 5.5          |
| Mã nhân viên, họ tên, email công việc, đơn vị                                                                       | Có — dữ liệu cơ bản                                                    | Thấp                                                                 | 5.2               |
| Ai được cấp seat phần mềm nào, từ khi nào                                                                           | Có — dữ liệu cơ bản                                                    | Thấp                                                                 | 5.2               |
| **Ngày hoạt động cuối, số ngày không sử dụng**                                                                      | Có — **dữ liệu hành vi**                                               | **Trung bình — trục rủi ro chính**                                   | 5.4               |
| Bản ghi OAuth consent — ai cấp quyền cho ứng dụng nào                                                               | Có — dữ liệu hành vi                                                   | Trung bình                                                           | 5.6               |
| Sao kê, mô tả giao dịch                                                                                             | Chủ yếu doanh nghiệp                                                   | Thấp                                                                 | 5.6               |
| **Dữ liệu từ bộ thu thập trên thiết bị** _(v3.8)_ — tên miền/tiến trình trong danh sách cho phép, số phút theo ngày | Có — **dữ liệu theo dõi hành vi sử dụng dịch vụ trên không gian mạng** | **Cao — coi là nhạy cảm**; chỉ xử lý khi thỏa điều kiện của `ADR-13` | 5.4, 5.6          |
| Bản ghi xác nhận chủ động của nhân viên _(v3.8)_                                                                    | Có — dữ liệu cơ bản                                                    | Thấp — bản thân là cơ chế minh bạch                                  | 5.4               |
| ~~Log truy cập web, proxy, CASB~~                                                                                   | Có — **có khả năng thuộc nhóm nhạy cảm**                               | **Cao — đã loại khỏi phạm vi**                                       | —                 |
| Nhật ký kiểm toán                                                                                                   | Có — dữ liệu cơ bản                                                    | Thấp — bản thân là cơ chế tuân thủ                                   | 5.8               |

> **Điểm cần nêu khi bảo vệ:** rủi ro pháp lý của đề tài **tập trung vào đúng hai phân hệ** (5.4 Usage và 5.6 Discovery), không rải đều toàn hệ thống. Và nhóm dữ liệu rủi ro cao nhất đã được chủ động loại khỏi phạm vi (mục 5.6.1) — trước cả khi khung pháp lý mới mở rộng định nghĩa dữ liệu nhạy cảm.
>
> **Sửa ở v3.8:** câu _"nhóm dữ liệu rủi ro cao nhất đã được loại khỏi phạm vi"_ nay chỉ đúng với **log web đầy đủ**. Dữ liệu từ bộ thu thập cũng ở mức **cao** và **có** trong phạm vi — nhưng chỉ dưới mười điều kiện của `ADR-13`. Cách nói đúng khi bảo vệ: _"Nhóm có xử lý một loại dữ liệu nhạy cảm, và thiết kế để máy chủ không bao giờ nhận phần vượt mục đích."_

#### 7.7.3. Cơ sở pháp lý xử lý dữ liệu

| Nhóm dữ liệu                                      | Cơ sở đề xuất                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dữ liệu nhân sự cơ bản                            | Thực hiện quan hệ lao động và quản lý tài sản công nghệ thông tin của doanh nghiệp                                                                                                                                                                                                                                                                              |
| Phân bổ và thu hồi license                        | Như trên                                                                                                                                                                                                                                                                                                                                                        |
| **Dữ liệu hành vi sử dụng**                       | Doanh nghiệp triển khai xác định cơ sở phù hợp, **kèm nghĩa vụ thông báo minh bạch trước khi xử lý** (FR-10.4)                                                                                                                                                                                                                                                  |
| **Dữ liệu từ bộ thu thập trên thiết bị** _(v3.8)_ | **Điều 25 khoản 3 Luật 91/2025/QH15** — biện pháp công nghệ quản lý người lao động, _"trên cơ sở người lao động biết rõ biện pháp đó"_ — **cộng xác nhận chủ động kiểm chứng được** (Điều 9 khoản 3). Thiết kế không dựa vào im lặng (Điều 9 khoản 4 điểm d). Việc xác nhận có đủ thay **sự đồng ý** theo Điều 11 khoản 1 hay không **chưa kết luận** — `OQ-16` |

> **Một lưu ý quan trọng:** Luật 91/2025 có sử dụng khái niệm "lợi ích hợp pháp", nhưng phạm vi của khái niệm này **hẹp hơn đáng kể** so với khái niệm tương ứng trong GDPR. Vì vậy không nên mặc định coi đây là cơ sở xử lý an toàn cho dữ liệu hành vi, và không nên sao chép lập luận từ tài liệu GDPR.

#### 7.7.4. Đối chiếu nguyên tắc bảo vệ dữ liệu với thiết kế đã có

Điểm may của đề tài: phần lớn nguyên tắc đã nằm sẵn trong thiết kế từ v2.0, chỉ chưa được gọi tên bằng ngôn ngữ pháp lý.

| Nguyên tắc                       | Thiết kế đã có trong BRD                                                                     |
| -------------------------------- | -------------------------------------------------------------------------------------------- |
| Tối thiểu hóa dữ liệu            | FR-6.10, mục 7.5 — chỉ thu thập trường cần thiết                                             |
| Giới hạn mục đích                | Mục 5.4 — dữ liệu usage chỉ dùng cho phát hiện lãng phí license                              |
| Giới hạn thời gian lưu trữ       | Mục 7.5 — bảng chính sách lưu giữ                                                            |
| Giả danh hóa                     | OQ-03 — ẩn họ tên ở màn hình usage và discovery                                              |
| Kiểm soát truy cập theo vai trò  | SoD-1 → SoD-8, mục 7.2                                                                       |
| Trách nhiệm giải trình           | FR-8.3, INV-05 — Audit Trail chỉ ghi thêm                                                    |
| Quyền truy cập của chủ thể       | FR-10.1, FR-10.2                                                                             |
| Quyền được xóa                   | FR-10.3, FR-10.6                                                                             |
| Minh bạch với chủ thể dữ liệu    | FR-10.4; _(v3.8)_ xác nhận chủ động và yêu cầu dừng thu thập — FR-4.18                       |
| Tối thiểu hóa tại nguồn _(v3.8)_ | FR-4.17, ADR-13 — lọc trên máy theo danh sách cho phép; máy chủ từ chối trường ngoài lược đồ |
| Bảo mật khi truyền và lưu trữ    | Mục 7.3                                                                                      |

#### 7.7.5. Nghĩa vụ nằm ngoài phạm vi phần mềm

Những việc sau thuộc trách nhiệm của **doanh nghiệp triển khai**, không phải tính năng hệ thống. Nêu ra để phạm vi rõ ràng, và để nhóm không bị hỏi bất ngờ:

| Nghĩa vụ                                                       | Ghi chú                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lập hồ sơ đánh giá tác động xử lý dữ liệu cá nhân (DPIA)       | **Kiểm chứng ở v3.8:** nộp cơ quan chuyên trách trong **60 ngày** kể từ ngày đầu xử lý (**Điều 21** Luật 91/2025). Doanh nghiệp nhỏ và khởi nghiệp được chọn không lập trong 5 năm, **trừ** khi _"trực tiếp xử lý dữ liệu cá nhân nhạy cảm"_ (**Điều 38 khoản 2**). Bật bộ thu thập nghĩa là xử lý dữ liệu nhạy cảm, nên **không được miễn**. Hồ sơ tổ chức mục tiêu 100–500 người (mục 3.4) vốn cũng vượt ngưỡng doanh nghiệp vừa trong lĩnh vực dịch vụ |
| **Đưa chính sách giám sát vào nội quy lao động** _(v3.8)_      | Bộ luật Lao động 2019 Điều 118: doanh nghiệp từ 10 lao động phải có nội quy bằng văn bản, và phải tham khảo tổ chức đại diện người lao động trước khi ban hành hoặc sửa _(đọc qua trang đăng lại, chưa đọc tại Công báo)_                                                                                                                                                                                                                                 |
| Chỉ định bộ phận hoặc nhân sự phụ trách bảo vệ dữ liệu cá nhân | Có yêu cầu về trình độ và kinh nghiệm                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Thông báo cho người lao động về việc xử lý dữ liệu             | Hệ thống hỗ trợ bằng FR-10.4 nhưng nội dung thông báo là trách nhiệm doanh nghiệp                                                                                                                                                                                                                                                                                                                                                                         |
| Đánh giá tác động chuyển dữ liệu xuyên biên giới               | Chỉ phát sinh nếu hệ thống được đặt tại hạ tầng nước ngoài. Với mô hình dedicated instance đặt trong nước thì không phát sinh                                                                                                                                                                                                                                                                                                                             |

#### 7.7.6. Dữ liệu hoạt động có thuộc nhóm nhạy cảm không — phân tích và kết luận _(viết lại ở v3.3, đóng OQ-11)_

> **🛑 CẢNH BÁO — TOÀN BỘ MỤC 7.7.6 CẦN ĐƯỢC XEM XÉT LẠI**
>
> **Phát hiện ngày 08/09/2026 khi đọc bản gốc có chữ ký số của Nghị định 356/2025/NĐ-CP** _(tệp `356-nd.signed.pdf`, cổng văn bản Chính phủ, ký ngày 05/01/2026, trang 3)_: **bản trích dẫn điểm `l)` ở các phiên bản BRD trước bị cắt mất vế cuối.**
>
> Nguyên văn đầy đủ có thêm cụm **"và các dịch vụ khác trên không gian mạng"**. Chính vế bị cắt này là vế quyết định: nó khiến điểm `l)` **không còn là một liệt kê đóng**.
>
> **Hệ quả:** lập luận _"đây là danh mục liệt kê, không phải định nghĩa mở"_ và kết luận _"công cụ thiết kế, lập trình, quản lý công việc không thuộc danh mục nhạy cảm"_ ở phần dưới **được dựng trên bản trích thiếu, nên không còn đứng vững**. Figma, GitHub, Jira đều là dịch vụ trên không gian mạng.
>
> ✅ **Đã có phương án xử lý ở v3.6 — `QĐ-01`, nhóm trưởng chốt ngày 08/09/2026:** **mở rộng nguyên tắc thận trọng cho MỌI ứng dụng.** Hệ thống coi **toàn bộ** dữ liệu hoạt động là _có thể_ nhạy cảm và áp biện pháp chặt cho tất cả — `FR-10.4` thông báo trước khi theo dõi trở thành **bắt buộc cho mọi ứng dụng**, thu thập tối thiểu, lưu giữ rút còn **6 tháng** (mục 7.5). **Vẫn thu thập, nên `G3` và `G4` giữ nguyên.**
>
> **Vì sao cách này đóng được vấn đề:** nó lặp lại đúng nước đi của `ADR-10` — làm thiết kế **không phụ thuộc** vào việc phân loại pháp lý được giải quyết hay chưa. Câu hỏi _"công cụ làm việc có thuộc nhóm nhạy cảm không"_ **không còn chặn tiến độ**, vì hệ thống đã hành xử như thể câu trả lời là "có".
>
> **`OQ-11` vẫn để ngỏ về mặt pháp lý** _(mục 10)_ — quyết định trên là quyết định **thiết kế**, không phải kết luận pháp luật, và không tự biến thành kết luận pháp luật. Phần văn bản phân tích bên dưới **giữ nguyên** để đối chiếu lịch sử.
>
> **Điều KHÔNG thay đổi:** `ADR-10` vẫn đúng nguyên vẹn. Nhóm ứng dụng liên lạc vẫn ở chế độ **mặc định không thu thập** — chặt hơn mức áp cho ứng dụng thông thường. `QĐ-01` **mở rộng** nguyên tắc chứ không hạ nó xuống.

**Danh mục dữ liệu cá nhân nhạy cảm** quy định tại **Điều 4 Nghị định 356/2025/NĐ-CP**. Cấu trúc chính xác: **khoản 1** liệt kê **12 điểm, đánh chữ từ `a)` đến `m)`** — không đánh số 1–12. Điểm liên quan tới đề tài là **điểm `l)`**:

> _"Dữ liệu theo dõi hành vi, hoạt động sử dụng dịch vụ viễn thông, mạng xã hội, dịch vụ truyền thông trực tuyến **và các dịch vụ khác trên không gian mạng**;"_
>
> — nguyên văn khoản 1 điểm `l)` Điều 4, đọc trực tiếp tại bản PDF có chữ ký số của Chính phủ, ngày kiểm tra 08/09/2026.

Điểm `m)` là điều khoản quét: _"Dữ liệu cá nhân khác được pháp luật quy định cần giữ bí mật hoặc cần có biện pháp bảo mật chặt chẽ."_

> ⚠️ Đoạn phân tích bên dưới **giữ nguyên như v3.5** và **chưa được cập nhật** theo bản trích đầy đủ ở trên. Đọc kèm khối cảnh báo đầu mục.

**Áp vào từng loại dữ liệu của hệ thống:**

| Dữ liệu                                                                                               | Loại dịch vụ                                                                      | Kết luận                                                                                                                             |
| ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Ngày hoạt động cuối trên **công cụ thiết kế, lập trình, quản lý công việc** (Figma, GitHub, Jira)     | Không phải viễn thông, không phải mạng xã hội, không phải truyền thông trực tuyến | 🛑 **Kết luận cũ — KHÔNG còn dùng được.** Bỏ qua vế _"và các dịch vụ khác trên không gian mạng"_ của điểm `l)`. Xem cảnh báo đầu mục |
| Ngày hoạt động cuối trên **công cụ nhắn tin, họp trực tuyến, thư điện tử** (Slack, Teams, Zoom, Meet) | Có thể được xem là **dịch vụ truyền thông trực tuyến**                            | ⚠️ **Vùng xám — không kết luận được từ văn bản**                                                                                     |
| Nhật ký truy cập web, proxy, CASB                                                                     | Bao trùm mọi dịch vụ, gồm cả ba loại được liệt kê                                 | **Rơi vào điểm `l)`** — xác nhận quyết định loại khỏi phạm vi tại 5.6.1                                                              |

> 🛑 **Kết luận cũ của v3.3–v3.5 — ĐÃ BỊ BÁC, giữ lại chỉ để đối chiếu lịch sử. Không trích dẫn như kết luận hiện hành của BRD:**
>
> ~~_"Với phạm vi hiện tại của hệ thống, dữ liệu hoạt động phần lớn không thuộc nhóm nhạy cảm. Rủi ro tập trung ở đúng một nhóm ứng dụng, và ở nguồn dữ liệu đã được loại bỏ."_~~
>
> Câu này dựa trên bản trích thiếu vế _"và các dịch vụ khác trên không gian mạng"_, đúng cùng một lỗi đã nêu ở cảnh báo đầu mục. Nó cũng mâu thuẫn với `QĐ-01`, vốn **chủ ý không** kết luận về phân loại pháp lý.

**Phát biểu hiện hành thay cho kết luận trên — là phát biểu THIẾT KẾ, không phải kết luận pháp lý:** BRD **không xác định** dữ liệu hoạt động của công cụ làm việc có thuộc nhóm dữ liệu cá nhân nhạy cảm hay không. Câu hỏi đó là `OQ-11`, **vẫn để ngỏ** và cần ý kiến pháp lý chuyên môn. Thay vào đó, hệ thống **áp các biện pháp bảo vệ đã chọn cho mọi ứng dụng** — thông báo trước khi theo dõi (`FR-10.4`), thu thập tối thiểu, lưu giữ 6 tháng, giới hạn quyền xem theo `SoD-2` — **bất kể kết luận phân loại sau này ra sao**. Đây là điều nhóm kiểm soát được; việc phân loại thì không.

**Dữ liệu từ bộ thu thập trên thiết bị** _(v3.8 — `QĐ-20`)_: khác với _ngày hoạt động cuối_ xuất từ nhà cung cấp, đây là dữ liệu mà **chính hệ thống tạo ra** bằng cách theo dõi việc dùng dịch vụ trực tuyến trên máy của người lao động. Đọc văn bản cho thấy nó **rơi thẳng vào điểm `l)`**. BRD **coi đây là dữ liệu nhạy cảm** và không chờ kết luận pháp lý — cùng nước đi của `ADR-10`, nhưng theo hướng **xử lý có điều kiện** thay vì không thu thập. Điều kiện ở mục 7.7.7 và `ADR-13`.

**Quyết định thiết kế không phụ thuộc vào việc giải quyết vùng xám:** xem **ADR-10**. Tóm tắt — hệ thống áp dụng chế độ xử lý chặt hơn cho nhóm ứng dụng liên lạc (FR-1.8) bất kể kết luận pháp lý cuối cùng ra sao. Cách này khiến câu trả lời cho vùng xám **không còn chặn tiến độ phát triển**.

**Đào sâu vùng xám** _(bổ sung ở v3.4 — đóng OQ-12)_:

Tra cứu thêm cho thấy **không có định nghĩa pháp lý minh thị cho cụm "dịch vụ truyền thông trực tuyến"** trong các văn bản tiếp cận được. Các bình luận pháp lý hiểu cụm này theo hướng nền tảng nội dung số, phát trực tiếp và truyền hình qua Internet — tức là nhóm dịch vụ nội dung, không phải công cụ làm việc.

Nhưng quá trình tra cứu làm lộ ra một điều quan trọng hơn: **đường rủi ro thật không đi qua cụm "truyền thông trực tuyến", mà đi qua cụm "dịch vụ viễn thông"** ở ngay đầu mục 11.

| Cụm trong Điều 4 mục 11         | Căn cứ định nghĩa                                                                                                                                                                     | Ứng dụng nhắn tin, họp trực tuyến có rơi vào không                   |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Dịch vụ viễn thông              | Luật Viễn thông 2023 đưa **"dịch vụ viễn thông cơ bản trên Internet"** — nhắn tin, gọi điện, họp trực tuyến qua Internet — vào diện quản lý; phân loại chi tiết do Chính phủ quy định | ⚠️ **Đây mới là đường rủi ro chính**                                 |
| Mạng xã hội                     | Có định nghĩa trong pháp luật về quản lý Internet; gắn với đặc trưng chia sẻ nội dung công khai và yêu cầu giấy phép                                                                  | Khả năng thấp — công cụ nội bộ doanh nghiệp không mang đặc trưng này |
| Dịch vụ truyền thông trực tuyến | **Không tìm thấy định nghĩa minh thị**; bình luận hiểu theo hướng nền tảng nội dung số                                                                                                | Khả năng thấp                                                        |

**Kết luận về OQ-12:** câu hỏi **không đóng được bằng cách đọc văn bản** — cụm từ then chốt chưa được định nghĩa, và việc phân loại dịch vụ viễn thông cơ bản trên Internet được giao cho văn bản dưới luật. Tuy nhiên câu hỏi **không còn cần trả lời để tiến hành**, vì ADR-10 đã chuyển sang mặc định **không thu thập** dữ liệu hoạt động cho nhóm ứng dụng này. Không có dữ liệu thì không phát sinh vấn đề phân loại.

Nếu về sau doanh nghiệp muốn bật thu thập cho nhóm này, khi đó mới cần ý kiến pháp lý chuyên môn — và đó là quyết định của doanh nghiệp triển khai, không phải của nhóm làm đồ án.

#### 7.7.7. Nghĩa vụ minh bạch khi giám sát người lao động _(mục mới ở v3.3)_

Đây là điểm quan trọng phát hiện khi rà soát Luật 91/2025: pháp luật cho phép doanh nghiệp áp dụng biện pháp công nghệ để quản lý người lao động, nhưng **kèm điều kiện người lao động biết rõ biện pháp đó**, và cấm xử lý dữ liệu thu thập từ các biện pháp công nghệ trái quy định.

Hệ quả cho hệ thống: **`FR-10.4` — thông báo cho nhân viên khi một ứng dụng bắt đầu được theo dõi mức độ sử dụng — được đặt là yêu cầu bắt buộc, không phải tính năng tùy chọn cho đẹp.** Nếu bỏ yêu cầu này, phân hệ 5.4 mất đi biện pháp minh bạch chính của nó.

> ⚠️ **Giới hạn của phát biểu trên — sửa ở v3.6 sau vòng review độc lập.** Các bản trước viết `FR-10.4` là _"điều kiện để việc thu thập dữ liệu là hợp pháp"_. Đó là **một kết luận pháp lý**, và nó **chưa được kiểm chứng ở mức điều khoản**: vòng review mới chỉ xác minh **danh tính và ngày hiệu lực** của Luật 91/2025/QH15, **chưa đọc toàn văn các điều khoản** cần thiết để rút ra kết luận đó.
>
> **Cách đọc đúng ở phiên bản này:** `FR-10.4` là một **biện pháp thiết kế** nhằm phục vụ minh bạch và thu thập tối thiểu, được nhóm chọn theo nguyên tắc thận trọng của `ADR-10` và `QĐ-01`. **BRD không khẳng định** rằng có `FR-10.4` thì việc thu thập là hợp pháp, cũng không khẳng định thiếu nó thì là bất hợp pháp. Cơ sở pháp lý, các ngoại lệ và kết luận tuân thủ **vẫn là hạng mục cần rà soát pháp lý** — xem `OQ-11` và cảnh báo đầu mục 7.7.6.

Nội dung thông báo tối thiểu: ứng dụng nào đang được theo dõi, loại dữ liệu nào được thu thập (ngày hoạt động, số lượt — **không** thu thập nội dung), mục đích sử dụng (phát hiện license không dùng để cắt giảm chi phí), thời hạn lưu giữ, và cách nhân viên xem dữ liệu của chính mình (FR-10.1).

> ✅ **Cập nhật ở v3.8 — `QĐ-20`: đã đọc nguyên văn điều khoản.** Luật 91/2025/QH15, **Điều 25 khoản 3**, PDF Công báo số 971 + 972 ngày 24/07/2025:
>
> _"3. Việc xử lý dữ liệu cá nhân của người lao động được thu thập bằng biện pháp công nghệ, kỹ thuật trong quản lý người lao động được quy định như sau:_
> _a) Chỉ được áp dụng các biện pháp công nghệ, kỹ thuật phù hợp với quy định của pháp luật và bảo đảm quyền, lợi ích của chủ thể dữ liệu cá nhân, trên cơ sở người lao động biết rõ biện pháp đó;_
> _b) Không được xử lý, sử dụng dữ liệu cá nhân thu thập từ các biện pháp công nghệ, kỹ thuật trái quy định của pháp luật."_
>
> Đoạn _"pháp luật cho phép doanh nghiệp áp dụng biện pháp công nghệ ... kèm điều kiện người lao động biết rõ"_ ở đầu mục **khớp nguyên văn**. **Không tìm thấy** điều khoản cấm, cũng **không tìm thấy** ngoại lệ miễn nghĩa vụ vì thiết bị thuộc sở hữu công ty. Mức phạt tối đa với tổ chức cho vi phạm loại này là **03 tỷ đồng** (Điều 8 khoản 5).

**Mười điều kiện triển khai bộ thu thập trên thiết bị** _(v3.8 — áp cho cả tiện ích `FR-4.17` và agent `FR-4.19`)_:

| Mã    | Điều kiện                                                                                                | Căn cứ                                                            | Hiện thực bằng                                                                                      |
| ----- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| ĐK-01 | Chỉ thiết bị **do công ty cấp và quản lý**; không cài trên thiết bị cá nhân                              | Điều 3 khoản 2                                                    | `FR-4.18` đăng ký thiết bị                                                                          |
| ĐK-02 | Người lao động **biết rõ trước khi thu**                                                                 | Điều 25 khoản 3 điểm a; Điều 9 khoản 2                            | `FR-10.4`, `FR-4.18`                                                                                |
| ĐK-03 | **Xác nhận chủ động, kiểm chứng được**; im lặng không phải đồng ý                                        | Điều 9 khoản 3, khoản 4 điểm d                                    | `FR-4.18`, `INV-17`                                                                                 |
| ĐK-04 | **Lọc ngay trên máy** theo danh sách cho phép                                                            | Điều 3 khoản 2                                                    | `FR-4.17`                                                                                           |
| ĐK-05 | **Không thu** URL đầy đủ, tiêu đề, nội dung, phím bấm, ảnh màn hình, vị trí                              | Điều 3 khoản 2; Điều 38 BLDS _(đọc qua trang đăng lại)_           | `FR-4.17`; máy chủ từ chối trường ngoài lược đồ                                                     |
| ĐK-06 | **Không thu ứng dụng liên lạc**                                                                          | `ADR-10`                                                          | Danh sách cho phép loại cờ `FR-1.8`                                                                 |
| ĐK-07 | Coi là **dữ liệu nhạy cảm**; doanh nghiệp **lập hồ sơ đánh giá tác động** trong 60 ngày, không được miễn | Điểm `l)` khoản 1 Điều 4 NĐ 356; Điều 21, Điều 38 khoản 2 Luật 91 | Mục 7.7.5 — ngoài phần mềm                                                                          |
| ĐK-08 | Lưu **6 tháng**; **xóa khi chấm dứt hợp đồng**                                                           | `QĐ-01`; Điều 25 khoản 2 điểm c                                   | Mục 7.5, `FR-10.3`, `FR-10.6`                                                                       |
| ĐK-09 | **Chỉ dùng cho tối ưu license**; không chấm năng suất, không kỷ luật                                     | Điều 3 khoản 2; Điều 25 khoản 3 điểm b                            | Không có màn hình xếp hạng thời gian dùng theo người; Manager chỉ thấy có/không hoạt động (`SoD-2`) |
| ĐK-10 | Chính sách giám sát nằm trong **nội quy lao động**                                                       | Điều 118 BLLĐ 2019 _(đọc qua trang đăng lại)_                     | Mục 7.7.5 — ngoài phần mềm                                                                          |

> **Điều v3.8 KHÔNG kết luận:** việc _thông báo + xác nhận chủ động_ có đủ thay **sự đồng ý** theo Điều 11 khoản 1 hay không — `OQ-16`. Thiết kế đã chọn mức an toàn nhất trong phạm vi phần mềm: không nhận dữ liệu khi chưa xác nhận, và cho phép yêu cầu dừng.

> **Giới hạn của tài liệu này:** đây là tài liệu phân tích nghiệp vụ, không phải tư vấn pháp lý. Nhóm cần đọc trực tiếp Luật 91/2025/QH15 và Nghị định 356/2025/NĐ-CP, và trao đổi với giảng viên hướng dẫn về mức độ chi tiết cần trình bày trong báo cáo. Các diễn giải trong mục này cần được kiểm chứng lại tại văn bản gốc trước khi đưa vào báo cáo cuối.

---

## 8. QUYẾT ĐỊNH KIẾN TRÚC (ARCHITECTURE DECISION RECORDS)

### ADR-01 — Mô hình triển khai: single-tenant, lược đồ dữ liệu có nhận biết tổ chức ✅

**Quyết định:** triển khai dedicated instance — mỗi doanh nghiệp một bản cài đặt riêng. MVP vận hành cho một tổ chức duy nhất. Tuy nhiên lược đồ dữ liệu vẫn giữ nhận biết tổ chức: mọi bảng gốc nghiệp vụ mang cột định danh tổ chức, và mọi ràng buộc duy nhất đặt cột này ở vị trí đầu tiên (`INV-15`).

**Lý do:** hệ thống lưu hợp đồng, dữ liệu tài chính và log hành vi người dùng — thuộc nhóm nhạy cảm nhất của doanh nghiệp. Trong phạm vi 9 tuần phát triển thật, mô hình nhiều tổ chức dùng chung cơ sở dữ liệu không thêm giá trị nghiệp vụ nào nhưng tiêu tốn thời gian của các phân hệ tạo giá trị. Giữ cột định danh tổ chức cho phép chuyển đổi sau này mà không cần thay đổi lược đồ.

**Bảng dùng chung, không mang định danh tổ chức:** từ điển nhà cung cấp, danh mục sản phẩm SaaS chuẩn, bảng tỷ giá, danh mục vai trò.

**Câu trả lời chuẩn bị cho phản biện:** _mô hình triển khai dedicated instance được chọn có chủ đích do đặc thù dữ liệu; mô hình dữ liệu đã thiết kế nhận biết tổ chức nên có thể chuyển sang mô hình dùng chung mà không thay đổi lược đồ; phần onboarding khách hàng nằm ngoài phạm vi MVP._

### ADR-02 — Seat không được vật chất hóa thành nhiều bản ghi

**Quyết định:** không tạo 100 bản ghi cho gói 100 seat. Lưu số lượng đã mua trên Subscription; đếm số Assignment đang chiếm chỗ; seat trống là giá trị dẫn xuất, không lưu.

**Lý do:** mô hình giá SaaS không đồng nhất. Vật chất hóa seat chỉ đúng với mô hình tính theo người dùng, sai hoàn toàn với gói cố định, gói dùng chung và gói tính theo mức tiêu thụ.

**Hệ quả:** mô hình giá là thuộc tính phân nhánh — các phân hệ Usage, Optimization và Forecast phải rẽ nhánh theo giá trị này.

**Ngoại lệ:** khi seat có danh tính riêng (khóa bản quyền, tài khoản host được đặt tên), dùng bảng phụ gắn vào Assignment.

### ADR-03 — Tiền là đối tượng giá trị, luôn kèm loại tiền tệ

**Quyết định:** mọi trường tiền lưu bộ giá trị gồm số tiền gốc, loại tiền tệ, tỷ giá, ngày áp dụng tỷ giá và số tiền đã quy đổi (`INV-04`). Đồng tiền báo cáo cấu hình ở cấp tổ chức.

**Lý do:** doanh nghiệp Việt Nam mua SaaS bằng ngoại tệ và báo cáo bằng VND. Không có quy đổi có kiểm soát thì mọi biểu đồ so sánh ngân sách đều vô nghĩa.

**Hệ quả:** tỷ giá chốt tại thời điểm ghi nhận giao dịch, không quy đổi lại khi xem báo cáo — nếu không, số liệu quá khứ sẽ thay đổi mỗi lần mở dashboard. Không dùng kiểu số thực dấu phẩy động cho tiền.

### ADR-04 — Dữ liệu tổ chức và phân bổ seat có hiệu lực theo thời gian

**Quyết định:** quan hệ nhân sự–đơn vị và Assignment đều dùng khoảng hiệu lực (từ ngày, đến ngày), không ghi đè.

**Lý do:** báo cáo phân bổ chi phí theo Cost Center cần biết nhân viên thuộc đơn vị nào **tại thời điểm phát sinh chi phí**. Đây cũng là điều kiện để Audit Trail có ý nghĩa.

**Hệ quả:** sinh ra hai bất biến chống chồng lấn — `INV-02` cho cặp (nhân viên, thuê bao) và `INV-14a` cho cặp (nhân viên, cost center) _(v3.11 — vế bắt buộc tồn tại tách ra thành `INV-14b`, `QĐ-30c`)_.

### ADR-05 — Từ điển nhà cung cấp tách khỏi danh mục của tổ chức

**Quyết định:** hai tầng dữ liệu — từ điển nhà cung cấp và mẫu nhận dạng dùng chung; danh mục ứng dụng đã phê duyệt riêng theo tổ chức.

**Lý do:** kiến thức chuẩn hóa nhà cung cấp là kiến thức chung, không gắn với một doanh nghiệp cụ thể. Tách ra giúp bảo trì tập trung, và giải quyết bài toán nhận diện các mô tả giao dịch qua cổng thanh toán trung gian.

### ADR-06 — Contract, Subscription và Invoice là ba thực thể tách biệt

**Quyết định:** chuỗi quan hệ Vendor → SaaS Product → Plan → Subscription → (Contract, Invoice).

**Lý do:** ngày gia hạn thuộc chu kỳ mua cụ thể, không thuộc văn bản hợp đồng — một hợp đồng khung nhiều năm chứa nhiều chu kỳ.

### ADR-07 — Tách ý định nghiệp vụ khỏi thực thi kỹ thuật

**Quyết định:** Assignment ghi nhận quyết định của tổ chức; Provisioning Task ghi nhận thao tác thật phía nhà cung cấp. Hai thực thể có vòng đời riêng (mục 5.12.3).

**Lý do:** cho phép mô tả trạng thái "đã duyệt nhưng chưa thực hiện được", xử lý lỗi provisioning, và đối soát sai lệch.

### ADR-08 — Vai trò là thuộc tính của tài khoản, không phải danh tính

**Quyết định:** tách hồ sơ nhân sự, tài khoản đăng nhập và vai trò thành ba thực thể. Một người có thể mang nhiều vai trò. Vai trò Manager suy ra từ cấu trúc tổ chức thay vì gán tay.

**Lý do:** IT Admin cũng là nhân viên và cũng cần xin seat cho chính mình; quy tắc không tự phê duyệt (`INV-08`) phải áp dụng được trong tình huống đó.

### ADR-09 — Dự báo tách lớp, và mô hình thống kê phải qua cổng kiểm chứng _(mới ở v3.0)_

**Quyết định:** dự báo chi phí chia ba lớp (FR-5.5). Lớp cam kết dùng công thức xác định. Lớp biến động dùng mô hình xu hướng nhưng chỉ hiển thị khi qua cổng kiểm chứng sai số (FR-5.7). Lớp phụ thuộc quyết định dùng kịch bản.

**Lý do:** ba lớp có bản chất khác nhau. Dùng mô hình thống kê cho dữ liệu đã biết chắc từ hợp đồng cho kết quả **kém chính xác hơn** đọc thẳng hợp đồng; ngược lại, loại bỏ hoàn toàn mô hình thống kê thì bỏ mất lớp duy nhất mà nó có ý nghĩa.

**Hệ quả:** hệ thống phải lưu được lịch sử chi tiêu đủ dài để chạy kiểm chứng lùi, và phải có cơ chế hiển thị "không dự báo được vì lý do X" như một trạng thái hợp lệ, không phải lỗi.

**Câu trả lời chuẩn bị cho phản biện** _("sao không dùng ARIMA/Prophet/học máy?")_: với chuỗi dữ liệu tháng ngắn trong phạm vi một doanh nghiệp, mô hình phức tạp không cho sai số tốt hơn mà mất khả năng giải thích; và phần lớn chi tiêu SaaS thuộc lớp đã cam kết, nơi mọi mô hình thống kê đều thua công thức từ hợp đồng.

### ADR-10 — Xử lý dữ liệu hành vi theo nguyên tắc thận trọng, không chờ kết luận pháp lý _(mới ở v3.3)_

**Bối cảnh** _(sửa ở v3.6)_**:** điểm `l)` khoản 1 Điều 4 Nghị định 356/2025 xếp _"dữ liệu theo dõi hành vi, hoạt động sử dụng dịch vụ viễn thông, mạng xã hội, dịch vụ truyền thông trực tuyến **và các dịch vụ khác trên không gian mạng**"_ vào nhóm dữ liệu cá nhân nhạy cảm.

> 🛑 **Câu tiếp theo đã sai và được giữ lại để đối chiếu:** ~~_"Công cụ thiết kế và lập trình rõ ràng không thuộc ba loại đó"_~~. Bản trích ở các phiên bản trước **thiếu vế cuối**, nên mới kết luận được như vậy. Với vế đầy đủ, câu hỏi cho công cụ làm việc thông thường **đang mở** — xem `OQ-11` và cảnh báo đầu mục 7.7.6. Công cụ nhắn tin và họp trực tuyến vẫn ở vùng xám như cũ.
>
> **Quyết định của `ADR-10` bên dưới không đổi.** Nó vốn được thiết kế để **không phụ thuộc** vào kết luận phân loại — đó chính là điểm mạnh của nó, và phát hiện này càng củng cố cách tiếp cận đó.
>
> ✅ **Mở rộng ở v3.6 (`QĐ-01`):** nguyên tắc thận trọng của `ADR-10` nay áp cho **mọi ứng dụng**, không riêng nhóm liên lạc. Hai chế độ trở thành **ba mức**. **Bảng chính sách hiện hành nằm ở phần _Quyết định_ ngay bên dưới** — `ADR-10` chỉ có **một** bảng có hiệu lực, để không thể đọc ra hai chính sách lưu giữ khác nhau từ cùng một `ADR`.

**Quyết định** — ✅ **CHÍNH SÁCH HIỆN HÀNH, cập nhật ở v3.6 theo `QĐ-01`:** không chờ giải quyết vùng xám. Hệ thống phân loại ứng dụng bằng cờ `is_communication_service` (FR-1.8) và áp dụng **ba mức xử lý dữ liệu**:

|                                | Ứng dụng thông thường                            | Ứng dụng nhóm dịch vụ liên lạc                                                              | Nhật ký truy cập web, proxy, CASB |
| ------------------------------ | ------------------------------------------------ | ------------------------------------------------------------------------------------------- | --------------------------------- |
| **Thu thập dữ liệu hoạt động** | Có                                               | **Mặc định KHÔNG** — chỉ dùng danh sách thành viên, phát hiện G1 và G2                      | **Ngoài phạm vi** (mục 5.6.1)     |
| Nếu bật thu thập               | —                                                | Cần xác nhận có chủ đích của Super Admin, ghi nhật ký kiểm toán, nêu lý do và cơ sở pháp lý | —                                 |
| Dữ liệu lưu khi đã bật         | Ngày hoạt động + số lượt; **thu thập tối thiểu** | **Chỉ ngày hoạt động**, không lưu số lượt chi tiết                                          | —                                 |
| **Thời hạn lưu giữ**           | **6 tháng** _(rút từ 12 ở v3.6 — `QĐ-01`)_       | **6 tháng**                                                                                 | —                                 |
| Manager xem được               | Số liệu tổng hợp của nhân viên trực thuộc        | **Chỉ trạng thái có hoạt động hay không**, không thấy số liệu                               | —                                 |
| Yêu cầu thông báo trước        | **Bắt buộc** (FR-10.4) — **mọi ứng dụng**        | Có, và nêu rõ đây là ứng dụng liên lạc                                                      | —                                 |

> **Bổ sung ở v3.8 — mức thứ tư, _bộ thu thập trên thiết bị_:** không thêm cột vào bảng trên để giữ nguyên chính sách đã chốt. Chính sách của mức này nằm ở **`ADR-13`**: thu thập **có điều kiện**, lưu **6 tháng**, và **luôn bỏ ứng dụng mang cờ liên lạc** — tức `ADR-10` được giữ nguyên ngay cả khi có bộ thu thập.
>
> **Một mốc lưu giữ duy nhất:** cả hai nhóm có thu thập đều là **6 tháng**. Mốc này khớp mục 7.5 và `FR-10.4`. Con số 12 tháng của v3.3–v3.5 **không còn hiệu lực ở bất kỳ mục nào**.
>
> 📁 **Bảng hai chế độ của v3.3–v3.5 — ĐÃ ĐƯỢC THAY THẾ, giữ lại chỉ để đối chiếu lịch sử. Không dùng để hiện thực.** Khác biệt duy nhất so với bảng hiện hành: cột _Ứng dụng thông thường_ khi đó ghi **12 tháng** thay vì 6 tháng, thông báo trước ghi _"Có (FR-10.4)"_ thay vì _"bắt buộc cho mọi ứng dụng"_, và bảng chỉ có **hai** cột vì nhóm log web/proxy/CASB chưa được nêu thành mức riêng trong `ADR`.
>
> | _(lịch sử v3.3–v3.5)_       | Ứng dụng thông thường | Ứng dụng nhóm dịch vụ liên lạc  |
> | --------------------------- | --------------------- | ------------------------------- |
> | Thu thập dữ liệu hoạt động  | Có                    | Mặc định KHÔNG                  |
> | ~~Thời hạn lưu giữ~~        | ~~12 tháng~~          | 6 tháng                         |
> | ~~Yêu cầu thông báo trước~~ | ~~Có (FR-10.4)~~      | Có, nêu rõ là ứng dụng liên lạc |

**Quy tắc gắn cờ — ba câu hỏi, trả lời "có" ở bất kỳ câu nào thì gắn cờ:**

1. Ứng dụng có cho phép **nhắn tin giữa người với người** không?
2. Ứng dụng có cho phép **gọi thoại hoặc họp trực tuyến** không?
3. Ứng dụng có phải là **hộp thư điện tử** không?

Bình luận trong tài liệu, ghi chú trong công cụ quản lý công việc, hay nhận xét trên bản thiết kế **không** tính là nhắn tin — vì chúng gắn với một đối tượng công việc cụ thể, không phải kênh liên lạc độc lập. Ví dụ áp dụng: Slack, Teams, Zoom, Google Meet, Gmail, Outlook **có** gắn cờ; Figma, Jira, GitHub, Notion **không** gắn cờ.

**Lý do:**

1. **Không thu thập thì không phát sinh câu hỏi.** Đây là điểm cốt lõi. Nếu hệ thống không thu thập dữ liệu hoạt động của nhóm ứng dụng liên lạc, thì việc nhóm đó có thuộc danh mục nhạy cảm hay không **trở thành câu hỏi không cần trả lời để tiến hành**. Cách xử lý rẻ nhất cho một rủi ro pháp lý là không tạo ra dữ liệu gây rủi ro.
2. **Chi phí gần bằng không, và không mất nhiều năng lực.** Nhóm ứng dụng liên lạc vẫn phát hiện được lãng phí G1 (suất mua thừa) và G2 (suất của người đã nghỉ) — hai nhóm có độ tin cậy tuyệt đối và không cần một dòng nhật ký nào. Chỉ mất G3 và G4 cho riêng nhóm ứng dụng này.
3. **Gỡ bỏ một nút chặn tiến độ.** Nếu chờ câu trả lời pháp lý mới thiết kế, phân hệ 5.4 bị treo vô thời hạn.
4. **Nhất quán với nguyên tắc chung của hệ thống:** không kết luận khi chưa chắc chắn. Áp dụng chính nguyên tắc đó cho rủi ro pháp lý là hợp lý.

**Hệ quả:**

- Ứng dụng nào được gắn cờ là **quyết định nghiệp vụ** do IT Admin đưa ra theo quy tắc ba câu hỏi ở trên, không suy ra tự động từ tên nhà cung cấp. Hệ thống gợi ý, người xác nhận.
- Nếu doanh nghiệp muốn bật thu thập cho nhóm này, đó phải là một hành động **có chủ đích, được ghi nhật ký kiểm toán, kèm lý do và cơ sở pháp lý** — không phải một ô cấu hình bật tắt tùy tiện.
- Demo của đồ án chạy ở chế độ mặc định, tức không thu thập dữ liệu hoạt động của ứng dụng liên lạc.

**Câu trả lời chuẩn bị cho phản biện** _("nhóm có chắc dữ liệu này không nhạy cảm không?")_:

> 🛑 **KHÔNG DÙNG BẢN DƯỚI ĐÂY — đã sai từ v3.6.** Câu này khẳng định _"công cụ công việc thông thường không thuộc nhóm nào"_, dựa trên bản trích thiếu vế **"và các dịch vụ khác trên không gian mạng"** của điểm `l)` khoản 1 Điều 4. Nói câu này trước hội đồng là tự tạo ra một điểm bị vặn. Giữ lại nguyên văn để đối chiếu, **không để dùng**.
>
> ~~_"Chúng em không khẳng định, và cũng không cần khẳng định. Điều 4 Nghị định 356/2025 liệt kê 12 nhóm nhạy cảm; công cụ công việc thông thường không thuộc nhóm nào. Riêng ứng dụng nhắn tin và họp trực tuyến nằm ở vùng xám, có thể chạm tới khái niệm dịch vụ viễn thông cơ bản trên Internet theo Luật Viễn thông 2023. Vì vậy hệ thống mặc định không thu thập dữ liệu hoạt động của nhóm đó — không có dữ liệu thì không có rủi ro, và kết luận pháp lý cuối cùng không làm thay đổi thiết kế."_~~
>
> **Phần vẫn còn đúng và vẫn dùng được:** vế cuối — _hệ thống mặc định không thu thập dữ liệu hoạt động của nhóm ứng dụng liên lạc; không tạo ra dữ liệu thì không phát sinh rủi ro cho nhóm đó_. Đó là nội dung của `ADR-10` và **không phụ thuộc** vào việc phân loại Điều 4.
>
> **Phần cần soạn lại:** câu trả lời cho _công cụ làm việc thông thường_ (Figma, GitHub, Jira). Đây là **`OQ-11` đang mở**, cần GVHD hoặc ý kiến pháp lý — xem cảnh báo đầu mục 7.7.6. Không tự soạn câu trả lời khẳng định khi câu hỏi chưa đóng.

### ADR-11 — Chọn NestJS làm framework backend _(mới ở v3.5)_

> 🔠 **Đổi mã ngày 08/09/2026:** quyết định kỹ thuật này trước ghi là **`QĐ-1`**, nay là **`QĐKT-01`** — đổi tiền tố để không trùng với sổ quyết định dự án `QĐ-01`→`QĐ-09`. **Chỉ đổi mã, nội dung và trạng thái không đổi.** Bảng ánh xạ đầy đủ ở _Định nghĩa Phạm vi & Nghiệp vụ_ mục 6.7.1. Các khối changelog và Phụ lục `B.7` bên dưới **giữ nguyên mã cũ** vì là lịch sử.

**Bối cảnh:** từ v3.0 tới v3.4, mục 6.1 để ngỏ lựa chọn _"ASP.NET Core hoặc NestJS"_. Tài liệu _Định nghĩa Phạm vi & Nghiệp vụ_ theo dõi việc này bằng quyết định `QĐKT-01`, với hạn chốt là **trước khi dựng khung dự án backend** và ba tiêu chí đã đặt sẵn.

**Quyết định:** dùng **NestJS** (Node.js, TypeScript) cho toàn bộ backend — REST API, phân quyền ở tầng API, rule engine, máy trạng thái và tác vụ nền.

**Lý do — theo đúng ba tiêu chí đã đặt ra tại `QĐKT-01`, không thêm tiêu chí mới sau khi đã chọn:**

| Tiêu chí của `QĐKT-01`                                                       | Đánh giá                                                                                                                                              |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Năng lực sẵn có của nhóm                                                     | Nhóm đã quen TypeScript qua phần frontend React; chi phí học thấp hơn so với phải làm quen một hệ sinh thái thứ hai                                   |
| Hệ sinh thái thư viện cho kiểm tra dữ liệu đầu vào, phân quyền và tác vụ nền | NestJS có sẵn ba cơ chế tương ứng với ba nhu cầu này: pipe kiểm tra dữ liệu đầu vào, guard cho phân quyền, và tích hợp hàng đợi tác vụ nền trên Redis |
| Mức dễ triển khai                                                            | Một runtime duy nhất cho cả frontend và backend, đơn giản hóa việc dựng môi trường trong phạm vi đồ án                                                |

**Hệ quả thiết kế:**

- Cấu trúc **module** của NestJS ánh xạ trực tiếp sang **tám ranh giới ngữ cảnh** ở mục 5.12.1 — mỗi ranh giới một module, giúp giữ đúng nguyên tắc chia theo miền nghiệp vụ thay vì chia theo tầng kỹ thuật.
- **Guard** ở tầng API là nơi enforce kiểm soát truy cập theo vai trò (mục 7.2) và các nguyên tắc `SoD-1` → `SoD-8` _(tám từ v3.8)_. Bộ kiểm thử phủ định cho SoD và cho `INV-08` chạy trực tiếp trên tầng này.
- Hàng đợi tác vụ nền trên Redis (mục 6.1) phục vụ rule engine định kỳ, pipeline import sáu bước và job đối soát.
- Dùng chung TypeScript với frontend cho phép **chia sẻ kiểu dữ liệu của hợp đồng API**, giảm lệch giữa hai phía — đáng kể với một nhóm 5 người trong 9 tuần phát triển.

**Điều bắt buộc phải giữ, không được đánh đổi vì framework:**

Lớp truy cập dữ liệu phải cho phép chạy **migration SQL thuần**, vì phần lớn bất biến ở mục 5.12.2 được ràng buộc ở **tầng cơ sở dữ liệu**, không ở tầng ứng dụng:

- Ràng buộc chống **chồng lấn khoảng hiệu lực** — `INV-02`, `INV-14a`
- **Chỉ mục duy nhất có điều kiện** — `INV-13`, và cột định danh tổ chức đứng đầu mọi ràng buộc duy nhất — `INV-15`
- Nhật ký kiểm toán **chỉ ghi thêm**: `UPDATE` và `DELETE` bị từ chối ngay ở tầng cơ sở dữ liệu — `INV-05`

ORM chỉ cần **không cản trở** việc chạy các migration này; không được thay thế chúng bằng kiểm tra ở tầng ứng dụng, vì như vậy thì hai người thao tác đồng thời vẫn phá được ràng buộc.

**Không ảnh hưởng phần nghiệp vụ:** mô hình dữ liệu, chín vòng đời có máy trạng thái và luật phát hiện đều độc lập với framework. Đây chính là lý do `QĐKT-01` được phép để mở tới thời điểm này mà không chặn tiến độ của bất kỳ phân hệ nào.

**Câu trả lời chuẩn bị cho phản biện** _("vì sao không dùng ASP.NET Core?")_:

> _"Cả hai đều đáp ứng được yêu cầu kỹ thuật của đề tài — đây không phải đánh giá hơn kém về công nghệ. Nhóm chọn theo hai tiêu chí đã đặt ra từ trước: năng lực sẵn có và chi phí chuyển ngữ cảnh trong một nhóm 5 người làm trong 9 tuần phát triển. Quyết định được ghi thành ADR-11 kèm cả điều kiện ràng buộc: dù dùng framework nào thì các bất biến toàn vẹn vẫn phải đặt ở tầng cơ sở dữ liệu."_

### ADR-12 — Chọn React Router 8 chế độ SPA làm khung frontend _(mới ở v3.6)_

**Bối cảnh:** từ bản đăng ký tới v3.5, mục 6.1 ghi _"React/Next.js"_. Đó là **đề xuất công nghệ** trong bản đăng ký, không phải cam kết khóa cứng. Khi rà lại mã nguồn ở vòng review ngày 08/09/2026 thì frontend thực tế đã dựng bằng React Router 8, không có Next.js — tài liệu và mã nguồn lệch nhau mà chưa có quyết định nào ghi lại.

**Quyết định:** dùng **React Router 8 Framework Mode chạy ở chế độ SPA** (`ssr: false`) cùng **Vite** và TypeScript cho toàn bộ frontend.

**Căn cứ đã kiểm chứng tại mã nguồn** _(`Code/FE-web`, ngày 08/09/2026)_: `package.json` khai `react-router ^8`, `@react-router/dev ^8`, `vite ^8.0.3`, **không có** `next`; `react-router.config` đặt `ssr: false`; `ARCHITECTURE.md` mô tả _"static React Router SPA"_.

**Lý do:**

| Tiêu chí                         | Đánh giá                                                                                                                                                                                                          |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Khớp quyết định kiến trúc đã có  | Mục 5 đã chốt hệ thống là **SPA**, NestJS là nơi duy nhất giữ thẩm quyền phân quyền. `ssr: false` khớp đúng; năng lực render phía máy chủ của Next.js không được dùng tới                                         |
| Chi phí chuyển đổi               | Nền frontend đã dựng và chạy được: ESLint 10 flat config, Orval sinh client từ OpenAPI, TanStack Query, MSW, bộ test, và một bản build production đã kiểm chứng. Viết lại sang Next.js là vứt bỏ toàn bộ phần này |
| Ngân sách thời gian              | Cửa sổ phát triển thật chỉ còn **9 tuần** (`RB-1`). Đổi khung frontend ở thời điểm này lấy đi thời gian của các phân hệ tạo giá trị                                                                               |
| Chia sẻ kiểu dữ liệu với backend | Vẫn giữ nguyên — cả hai phía dùng TypeScript, hợp đồng API sinh từ OpenAPI theo `CN-5`                                                                                                                            |

**Điều bắt buộc phải giữ, không đánh đổi vì framework:**

- Phân quyền **enforce ở tầng API** bằng guard của NestJS (mục 7.2). Việc ẩn menu ở frontend **không** được coi là kiểm soát truy cập.
- Ranh giới hệ thống với thế giới bên ngoài vẫn đặt ở **định dạng dữ liệu**, không đặt ở framework.

**Không ảnh hưởng phần nghiệp vụ:** mô hình dữ liệu, chín vòng đời có máy trạng thái, luật phát hiện và mười bảy bất biến đều độc lập với lựa chọn này.

**Câu trả lời chuẩn bị cho phản biện** _("bản đăng ký ghi Next.js, sao lại đổi?")_:

> _"Bản đăng ký nêu React/Next.js ở phần đề xuất công nghệ, không phải cam kết khóa cứng — cũng như phần backend nêu 'ASP.NET Core hoặc NestJS'. Hệ thống đã chốt là ứng dụng một trang, nên phần render phía máy chủ của Next.js không được dùng tới. Nhóm chọn React Router 8 vì nó phục vụ đúng mô hình đó, và quyết định được ghi thành ADR-12 thay vì để tài liệu lệch với mã nguồn."_

### ADR-13 — Bộ thu thập trên thiết bị lọc tại nguồn; máy chủ không bao giờ nhận dữ liệu thô _(mới ở v3.8)_

**Bối cảnh:** góp ý của GVHD sau buổi review: _"khi nhân viên mua phần mềm, phải biết họ có dùng hay không thì đồ án mới có ý nghĩa"_, kèm gợi ý theo dõi trên máy tính công ty cấp. Ma trận mục 6.3.1 cho thấy dữ liệu hoạt động theo người gần như chỉ có ở gói cao nhất (`KL-6`). Trong khi đó dữ liệu theo dõi việc dùng dịch vụ trực tuyến trên máy người lao động là **dữ liệu nhạy cảm** theo điểm `l)` khoản 1 Điều 4 Nghị định 356/2025.

**Quyết định** _(`QĐ-20`)_:

1. **Tiện ích trình duyệt hiện thực trong MVP; agent trên máy chỉ đặc tả thiết kế.**
2. **Lọc tại nguồn.** Danh sách cho phép — tên miền và tên tiến trình lấy từ danh mục SaaS và từ điển nhà cung cấp, **trừ mọi ứng dụng mang cờ liên lạc** — được đẩy xuống thiết bị. Thiết bị chỉ gửi bản tổng hợp theo ngày cho mục trong danh sách. **Máy chủ không bao giờ nhận** URL, tiêu đề, nội dung, phím bấm, ảnh màn hình, hay mục ngoài danh sách.
3. **Máy chủ phòng thủ lớp hai.** Endpoint nhận dữ liệu **từ chối** bản ghi có trường ngoài lược đồ, từ thiết bị chưa đăng ký, hoặc của nhân viên chưa xác nhận (`INV-17`).
4. **Không có xác nhận thì không có dữ liệu.** Xác nhận chủ động, lưu phiên bản nội dung thông báo và thời điểm; có yêu cầu dừng thu thập (`FR-4.18`).
5. **Mười điều kiện `ĐK-01` → `ĐK-10`** ở mục 7.7.7 là **điều kiện bắt buộc**, không phải khuyến nghị.

**Lý do:**

| Tiêu chí                                  | Đánh giá                                                                                                                |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Tối thiểu hóa theo Điều 3 khoản 2 Luật 91 | Dữ liệu vượt mục đích **không tồn tại** ở máy chủ, nên không có gì để lộ, để truy vấn nhầm, hay để bị dùng sai mục đích |
| Nhất quán với `ADR-10`                    | Cùng nguyên tắc _cách rẻ nhất loại một rủi ro là không tạo ra dữ liệu gây rủi ro_ — áp ở **thiết bị** thay vì ở phạm vi |
| Kiểm chứng được                           | Bộ test phủ định: gửi bản ghi có trường cấm, từ thiết bị chưa đăng ký, hoặc trước khi xác nhận ⟹ bị từ chối             |
| Chi phí                                   | Danh sách cho phép vốn đã có sẵn dưới dạng danh mục và từ điển nhà cung cấp                                             |

**Đã loại:** _agent thu tiêu đề cửa sổ hoặc ảnh màn hình_ — vượt mục đích, có thể chứa nội dung liên lạc riêng tư · _gửi dữ liệu thô rồi lọc ở máy chủ_ — máy chủ vẫn giữ dữ liệu vượt mục đích dù chỉ tạm thời · _chỉ thông báo, không cần xác nhận_ — im lặng không phải đồng ý (Điều 9 khoản 4 điểm d).

**Hệ quả:** thêm phân hệ con 5.4.4b; `FR-4.17` → `FR-4.19`; `INV-17`; mở rộng `FR-6.3`, `FR-10.4`; ba mục chính sách lưu giữ ở 7.5; hai nghĩa vụ ngoài phần mềm ở 7.7.5. Bản đăng ký đồ án ghi endpoint agent ngoài MVP — lệch được ghi ở Phụ lục C.1.

**Câu trả lời chuẩn bị cho phản biện** _("theo dõi máy nhân viên có vi phạm quyền riêng tư không?")_:

> _"Luật Bảo vệ dữ liệu cá nhân, Điều 25 khoản 3, cho phép doanh nghiệp dùng biện pháp công nghệ để quản lý người lao động nếu phù hợp pháp luật và người lao động biết rõ. Nhóm coi dữ liệu này là nhạy cảm và thiết kế để máy chủ không bao giờ nhận phần vượt mục đích: tiện ích chỉ gửi tên miền của các SaaS công ty đang trả tiền cùng số phút dùng mỗi ngày, bỏ qua ứng dụng nhắn tin, và không gửi gì cho tới khi nhân viên bấm xác nhận. Việc xác nhận đó có thay được sự đồng ý theo luật hay không là câu hỏi pháp lý nhóm để ngỏ, và đã chọn mức an toàn nhất trong phạm vi phần mềm."_

---

## 9. QUYẾT ĐỊNH VỀ PHẠM VI VÀ LÝ DO

Các hạng mục sau được **chủ động đưa ra ngoài phạm vi** hoặc **đưa vào phạm vi có điều kiện**, kèm lý do kỹ thuật. Đây là quyết định phạm vi có căn cứ, không phải phần chưa kịp làm.

| Hạng mục                                            | Trạng thái           | Lý do                                                                                                                                                                                                                                                                                        | Hướng phát triển                                                                 |
| --------------------------------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **G5 — khuyến nghị hạ gói theo mức sử dụng**        | ❌ Ngoài phạm vi     | Cần dữ liệu chi tiết về loại thao tác và tần suất mà hầu hết nguồn export không cung cấp. Log thường chỉ ghi sự kiện đăng nhập, không phân biệt được người chỉ xem với người chỉnh sửa                                                                                                       | Triển khai khi có nguồn dữ liệu chi tiết theo loại seat                          |
| **Discovery từ log web/firewall/proxy/CASB đầy đủ** | ❌ Ngoài phạm vi     | Ba lý do tại mục 5.6.1: vướng khung pháp lý về dữ liệu cá nhân mà nhóm chưa đủ căn cứ xử lý đúng; không có hạ tầng để kiểm chứng độ bao phủ; giá trị gia tăng không tương xứng rủi ro _(mở rộng ở v3.0)_. _(v3.8)_ Tiện ích trình duyệt lọc theo danh sách cho phép **không** thuộc dòng này | Giữ đặc tả thiết kế tại FR-6.10 cho giai đoạn sau                                |
| **Agent trên máy công ty** _(v3.8)_                 | 📐 **Chỉ thiết kế**  | `QĐ-20`: đặc tả đầy đủ ở `FR-4.19` và `ADR-13`, không hiện thực để giữ cửa sổ 9 tuần (`RB-1`)                                                                                                                                                                                                | Nâng lên hiện thực bằng một quyết định riêng nếu còn thời gian hoặc GVHD yêu cầu |
| **Dự báo bằng mô hình thống kê**                    | ⏸️ **Hoãn** _(v3.8)_ | _(Đổi ở v3.0)_ Không loại bỏ, nhưng chỉ áp dụng cho lớp chi phí biến động và chỉ hiển thị khi qua cổng kiểm chứng sai số. **v3.8 — `QĐ-25`:** không hiện thực lớp L2 trong MVP vì demo không có ≥ 12 tháng dữ liệu thật; L1 và L3 vẫn hiện thực                                              | Mở rộng khi có ít nhất 24 tháng dữ liệu chi tiêu thật                            |
| **Ma trận nhiều ngưỡng thẩm quyền chi** _(v3.8)_    | ❌ Ngoài phạm vi     | `QĐ-22`: một Người duyệt chi duy nhất đủ cho MVP                                                                                                                                                                                                                                             | Mở lại nếu KPI-2 cho thấy chậm ở bước duyệt chi                                  |
| **Tích hợp hệ thống nhân sự**                       | ❌ Ngoài phạm vi     | Không có nguồn dữ liệu nghỉ phép trong phạm vi dự án                                                                                                                                                                                                                                         | Trạng thái nghỉ phép do IT Admin cập nhật tay                                    |
| **Mô hình nhiều tổ chức dùng chung**                | ❌ Ngoài phạm vi     | Theo ADR-01                                                                                                                                                                                                                                                                                  | Lược đồ đã sẵn sàng để chuyển đổi                                                |
| **Tự động chặn ứng dụng**                           | ❌ Ngoài phạm vi     | Vượt ranh giới trách nhiệm của hệ thống quản trị license; cần công cụ bảo mật chuyên dụng                                                                                                                                                                                                    | Phối hợp với công cụ bảo mật sẵn có của doanh nghiệp                             |

---

## 10. CÁC VẤN ĐỀ CÒN MỞ

| Mã    | Câu hỏi                                                                                                                                                                                                                | Ảnh hưởng                                                                                            | Quyết định                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Trạng thái                                                   |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| OQ-01 | Mô hình triển khai                                                                                                                                                                                                     | Toàn bộ lược đồ dữ liệu                                                                              | Single-tenant, lược đồ nhận biết tổ chức                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | ✅ Đã chốt — ADR-01                                          |
| OQ-02 | Nhân viên gắn với một hay nhiều Cost Center?                                                                                                                                                                           | Quyết định có bảng phân bổ tỷ lệ hay không                                                           | **Hai tầng:** nhân viên gắn **đúng một** Cost Center tại mỗi thời điểm; gói dùng chung (flat-rate, concurrent) chia theo tỷ lệ ở cấp Subscription (`INV-03`). _(Làm rõ ở v3.11 — `QĐ-30c`)_ Vế thứ nhất tách thành **`INV-14a`** _(không chồng lấn — nhiều nhất một)_ và **`INV-14b`** _(bắt buộc tồn tại — không được rỗng)_; trước đó hai vế viết gộp trong một dòng `INV-14` mà cột thực thi chỉ phủ được vế đầu                                                                                                                   | ✅ **Đã chốt ở v3.0; tách hai vế ở v3.11**                   |
| OQ-03 | Giới hạn "IT Admin chỉ thấy mã NV và email" áp dụng ở tầng nào?                                                                                                                                                        | Thiết kế DTO và toàn bộ kiểm thử phân quyền                                                          | **Tầng API.** IT Admin thấy tên ở màn hình gán seat, xử lý cấp phát và chi tiết request; **ẩn tên** ở màn hình usage và discovery                                                                                                                                                                                                                                                                                                                                                                                                     | ✅ **Đã chốt ở v3.0**                                        |
| OQ-04 | Nguồn dữ liệu nghỉ phép                                                                                                                                                                                                | Điều kiện loại trừ số 3 của FR-4.9                                                                   | Cập nhật tay bởi IT Admin, không tích hợp HRM                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | ✅ Đã chốt                                                   |
| OQ-05 | Phạm vi cấu hình ngưỡng và thứ tự ưu tiên                                                                                                                                                                              | Thiết kế bảng cấu hình và rule engine                                                                | Ứng dụng > Phòng ban > Tổ chức > Mặc định. **Sửa ở v3.8 (`QĐ-23`):** bỏ cấp Phòng ban — nay là Ứng dụng > Tổ chức > Mặc định                                                                                                                                                                                                                                                                                                                                                                                                          | ✅ Đã chốt — FR-4.13                                         |
| OQ-06 | Cơ sở ghi nhận chi phí: dòng tiền hay theo kỳ?                                                                                                                                                                         | Thiết kế bảng tổng hợp chi tiêu                                                                      | **Lưu cả hai**, phân biệt bằng nhãn. Theo kỳ dùng cho dashboard ngân sách; theo dòng tiền dùng cho đối soát hóa đơn                                                                                                                                                                                                                                                                                                                                                                                                                   | ✅ **Đã chốt ở v3.0**                                        |
| OQ-07 | Dự án là thực thể riêng hay một loại Cost Center?                                                                                                                                                                      | Thiết kế FR-5.2                                                                                      | **Một loại Cost Center** (`type ∈ {Unit, Project, Company}`), không tạo thực thể riêng. _(v3.8 — đổi nhãn `Department` thành `Unit` để không nhầm với thực thể Phòng ban đã bỏ ở `QĐ-23`; ý nghĩa không đổi)_                                                                                                                                                                                                                                                                                                                         | ✅ **Đã chốt ở v3.0**                                        |
| OQ-08 | Chính sách lưu giữ dữ liệu usage                                                                                                                                                                                       | Tuân thủ quy định bảo vệ dữ liệu cá nhân                                                             | **6 tháng, hoặc 30 ngày sau ngày làm việc cuối — cái nào đến trước**, áp cho bản ghi hoạt động chi tiết của **mọi ứng dụng**. Dữ liệu tổng hợp đã phi định danh giữ 24 tháng. Căn cứ: nghĩa vụ xóa dữ liệu người lao động khi chấm dứt hợp đồng. Bảng đầy đủ ở mục 7.5, cùng `FR-10.6`. 📁 _Sửa ở v3.11 (`SA-04`): ô này còn ghi **12 tháng** và **6 tháng riêng cho nhóm liên lạc** — cả hai đã bị `QĐ-01` thay thế ở v3.6 khi mốc 6 tháng được áp nhất quán cho mọi ứng dụng; con số 12 tháng là **lịch sử**, không được hiện thực_ | ✅ **Đã chốt ở v3.3; rút xuống 6 tháng ở v3.6 theo `QĐ-01`** |
| OQ-09 | Ngưỡng sai số của cổng kiểm chứng dự báo là bao nhiêu?                                                                                                                                                                 | Quyết định khi nào ẩn dự báo (FR-5.7)                                                                | **Sai số phần trăm tuyệt đối trung bình ≤ 20%**, cấu hình được trong khoảng 10–40%. Sai số đo được phải hiển thị cạnh dự báo                                                                                                                                                                                                                                                                                                                                                                                                          | ✅ **Đã chốt ở v3.3**                                        |
| OQ-10 | Có đặt con số mục tiêu cho 5 KPI tại mục 2.4 không?                                                                                                                                                                    | Cách trình bày phần đánh giá kết quả                                                                 | **Không** đặt mục tiêu cho KPI của tổ chức. Thay bằng **4 tiêu chí nghiệm thu TC-1 → TC-4 cho rule engine**, kiểm chứng được trên bộ dữ liệu có đáp án                                                                                                                                                                                                                                                                                                                                                                                | ✅ **Đã chốt ở v3.3**                                        |
| OQ-11 | "Ngày hoạt động cuối trên ứng dụng công việc" có thuộc nhóm dữ liệu cá nhân nhạy cảm theo Nghị định 356/2025 không?                                                                                                    | Mức độ chặt của biện pháp bảo vệ ở phân hệ 5.4                                                       | **Thiết kế đã đóng ở v3.6 bằng `QĐ-01`** — mở rộng nguyên tắc thận trọng cho mọi ứng dụng, nên câu hỏi không còn chặn tiến độ. **Kết luận pháp lý vẫn để ngỏ** và không cần thiết để chạy tiếp. Xem mục 7.7.6                                                                                                                                                                                                                                                                                                                         | ✅ **Đã vô hiệu hóa bằng thiết kế**                          |
| OQ-12 | Ứng dụng nhắn tin, họp trực tuyến có thuộc nhóm nhạy cảm không?                                                                                                                                                        | Ảnh hưởng cách xử lý dữ liệu của nhóm ứng dụng này                                                   | **Không đóng được bằng đọc văn bản** — cụm "dịch vụ truyền thông trực tuyến" chưa có định nghĩa minh thị; đường rủi ro thật là qua "dịch vụ viễn thông cơ bản trên Internet" của Luật Viễn thông 2023. **Câu hỏi không còn cần trả lời** vì ADR-10 chuyển sang mặc định không thu thập                                                                                                                                                                                                                                                | ✅ **Đã vô hiệu hóa ở v3.4**                                 |
| OQ-13 | Khả năng xuất dữ liệu usage của Microsoft 365, Atlassian, Zoom, Notion                                                                                                                                                 | Bộ nguồn dữ liệu demo và ma trận năng lực tại mục 6.3.1                                              | **Microsoft 365 và Atlassian: có** ngày hoạt động cuối theo từng người, xuất được. **Zoom và Notion: không tìm thấy tài liệu chính thức** xác nhận. Ma trận mục 6.3.1 đã cập nhật đủ 8 nhà cung cấp                                                                                                                                                                                                                                                                                                                                   | ✅ **Đã chốt ở v3.4**                                        |
| OQ-14 | Zoom và Notion có bản xuất ngày hoạt động cuối theo từng người không?                                                                                                                                                  | Chỉ mở rộng bộ nguồn demo, không ảnh hưởng thiết kế                                                  | **Tra lại 14/09/2026:** Zoom **có** báo cáo host hoạt động/không hoạt động từ gói Pro, nhưng mang cờ liên lạc nên **không thu** (`ADR-10`). Notion **chỉ có** ngày hoạt động theo thành viên ở gói **Enterprise**. Xem mục 6.3.1                                                                                                                                                                                                                                                                                                      | ✅ **Đã đóng ở v3.8**                                        |
| OQ-15 | Nhà cung cấp định danh: tự làm bảng tài khoản hay dùng dịch vụ ngoài? _(mới ở v3.5)_                                                                                                                                   | `CN-1` OAuth/OIDC có chạy thật trong demo hay không                                                  | Chưa chốt. Vốn được đặt cùng mốc với quyết định framework backend; framework đã chốt (ADR-11) nên câu hỏi này không còn lý do chờ                                                                                                                                                                                                                                                                                                                                                                                                     | ⏳ **Cần chốt sớm**                                          |
| OQ-16 | _(mới ở v3.8)_ Thông báo cộng **xác nhận chủ động** có đủ thay **sự đồng ý** theo Điều 11 khoản 1 Luật 91/2025 cho dữ liệu từ bộ thu thập không?                                                                       | Phát biểu tuân thủ trong báo cáo cuối; **không** chặn thiết kế                                       | Văn bản không nói rõ Điều 25 khoản 3 tự nó có thay được sự đồng ý không. Thiết kế đã chọn mức an toàn nhất trong phạm vi phần mềm (`ADR-13`)                                                                                                                                                                                                                                                                                                                                                                                          | ⏳ **Cần ý kiến pháp lý**                                    |
| OQ-17 | _(mới ở v3.8)_ Tiện ích trình duyệt hỗ trợ những trình duyệt nào?                                                                                                                                                      | Điểm mù của nguồn bộ thu thập                                                                        | Chưa chốt. Nhóm trưởng không chọn giới hạn chính thức ở `QĐ-25`; quyết ở thiết kế kỹ thuật của tiện ích                                                                                                                                                                                                                                                                                                                                                                                                                               | ⏳ Trước khi bắt đầu hiện thực `FR-4.17`                     |
| OQ-18 | _(mới ở v3.9 — `QĐ-28b`)_ Điều kiện để **cài bắt buộc** tiện ích **không đăng trên Chrome Web Store** trên Windows/macOS: máy phải thuộc domain, đăng ký Chrome Enterprise Core, hay phải đăng tiện ích dạng unlisted? | Phát biểu _"nhân viên không gỡ được tiện ích"_ trong báo cáo cuối; **không** chặn hiện thực hay demo | Chưa kiểm chứng tại tài liệu chính thức ở lượt 15/09/2026. Demo dùng _load unpacked_ và **không** claim cài bắt buộc                                                                                                                                                                                                                                                                                                                                                                                                                  | ⏳ Spike trước báo cáo cuối                                  |
| OQ-19 | _(mới ở v3.9)_ Nhánh (a) — cấp quyền trên seat đã mua, không đổi tiền, hợp đồng hay danh mục — có được **bỏ qua Người duyệt chi** không?                                                                               | `FR-3.4`, `FR-3.13`, KPI-2, nguy cơ nút thắt `PP-5`                                                  | **Có.** Nhánh (a) không qua Người duyệt chi; báo cáo quy trình có tổng hợp seat cấp theo nhánh (a) (`FR-5.11`) — `QĐ-29a`                                                                                                                                                                                                                                                                                                                                                                                                             | ✅ **Owner chốt ở v3.10** — nên báo mentor                   |
| OQ-20 | _(mới ở v3.9)_ Finance ghi ý kiến ngân sách **trước** hay **sau** Người duyệt chi?                                                                                                                                     | `FR-3.4`, `FR-3.14`, `FR-5.8`, thứ tự bước và KPI-2                                                  | **Sau.** Người duyệt chi quyết trên snapshot ngân sách, có thể hỏi Finance (SLA không dừng); Finance ghi nhận chính thức sau duyệt, song song cấp phát — `QĐ-29b`                                                                                                                                                                                                                                                                                                                                                                     | ✅ **Owner chốt ở v3.10** — nên báo mentor                   |

> **Ghi chú về OQ-02, OQ-03, OQ-06, OQ-07:** bốn câu hỏi này được phân tích và chốt phương án từ v3.0. Ở v3.4 trở về trước, ghi chú tại đây dẫn về _Domain Spec Phần 1b_ để tra chi tiết. Từ **v3.5**, bộ Domain Spec đã được gỡ bỏ và phần lõi của nó chuyển vào **mục 5.12**; các bất biến liên quan tới bốn quyết định này nay là `INV-03`, `INV-14a` và `INV-14b` _(v3.11 — `QĐ-30c`)_.

---

## 11. TÀI LIỆU LIÊN QUAN

| Tài liệu                                        | Vai trò                                                                                                                                                                                                                                                                                                                                                       | Trạng thái                                                     |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Bản đăng ký đồ án** `SU26SE166`               | Ràng buộc gốc, đã có chữ ký GVHD                                                                                                                                                                                                                                                                                                                              | Đã nộp                                                         |
| **BRD** (tài liệu này)                          | **Nguồn chân lý duy nhất** về nghiệp vụ và mô hình miền                                                                                                                                                                                                                                                                                                       | **v3.10**                                                      |
| **Sổ quyết định dự án**                         | Quyết định của nhóm trưởng, `QĐ-01` → `QĐ-29` — `Decisions/project-decisions.md`                                                                                                                                                                                                                                                                              | Đang cập nhật                                                  |
| **Nghiên cứu pháp lý và nhà cung cấp** _(v3.8)_ | Điều khoản Luật 91/2025, ma trận 11 nhà cung cấp, danh mục demo — `Research-AI/usage-tracking-legal-vendor-research-2026-09-14.md`                                                                                                                                                                                                                            | 14/09/2026; kiểm chứng lại 15/09/2026 (`QĐ-28a`, `QĐ-28b`)     |
| **Định nghĩa Phạm vi & Nghiệp vụ**              | WHY/WHAT/WHO, chốt scope các luồng, lý thuyết cần nghiên cứu                                                                                                                                                                                                                                                                                                  | v1.6                                                           |
| **WHY · WHAT · WHO** (bản nộp A4)               | Bản trình bày rút gọn cho buổi báo cáo                                                                                                                                                                                                                                                                                                                        | v2.4 — ⚠️ chưa đồng bộ v3.8                                    |
| **User Flows nghiệp vụ**                        | **48** luồng `F-xx` _(`43 / 3 / 2`)_, sáu main flow, luồng màn hình `UF-xx` — 16 `UF-01`→`UF-16`                                                                                                                                                                                                                                                              | v0.7 — đồng bộ `QĐ-29` ngày 15/09/2026, gồm `.drawio`/HTML/PDF |
| **Conceptual ERD**                              | `ERD/CONCEPTUAL ERD - DANH SÁCH ENTITY.md` — 34 entity, 67 quan hệ, 17 bất biến                                                                                                                                                                                                                                                                               | Markdown, Draw.io, JPG, manifest đồng bộ v3.10 (15/09/2026)    |
| **Context Diagram**                             | DFD mức 0 — 11 tác nhân, luồng dữ liệu đếm tại `Diagrams/context-diagram/index.md`                                                                                                                                                                                                                                                                            | v2.3                                                           |
| **Business Workflows**                          | 22 activity diagram có swimlane, `WF-01` → `WF-18`                                                                                                                                                                                                                                                                                                            | v2.5                                                           |
| **User Flows — luồng màn hình**                 | 16 luồng `UF-01` → `UF-16`, đầu vào để FE dựng Figma. Artifact hiện hành: [index.md](../Diagrams/user-flows/index.md) Phần 11, [HTML](../Diagrams/user-flows/SaaS-Sentry-Luong-man-hinh.html), [PDF](../Diagrams/user-flows/SaaS-Sentry-User-Flows.pdf), [manifest](../Diagrams/user-flows/SaaS-Sentry-User-Flows.export-manifest.json), `drawio/UF-01…UF-16` | User Flows v0.7 _(thay dòng Screen Flows v1.0 / 14 luồng)_     |
| **Kế hoạch thực hiện**                          | Lịch 15 tuần, ba cổng review, gói công việc, phân vai                                                                                                                                                                                                                                                                                                         | 📁 Ngoài baseline từ 15/09/2026 (`QĐ-26`)                      |
| UI Spec                                         | **Không có bản đặc tả giao diện chi tiết hiện hành.** File `Figma UI-UX/Ui-spec.md` trùng tên là **Screen Flows v1.0 legacy**, không phải UI Spec _(làm rõ ở v3.11 — `SA-09`)_. Hoãn có chủ đích sang giai đoạn Figma theo `QĐ-08`                                                                                                                            | 📁 Legacy / hoãn có chủ đích                                   |
| ~~Domain Spec Phần 1, 1b, 1c, 2, 3, 4~~         | ~~Mô hình dữ liệu, ERD, máy trạng thái~~                                                                                                                                                                                                                                                                                                                      | **Đã gỡ bỏ ở v3.5** — nội dung lõi chuyển vào mục 5.12         |

> **Về việc gỡ bộ Domain Spec** _(v3.5)_: sau bốn vòng cập nhật BRD (v3.1 → v3.4), bộ Domain Spec lệch quá xa so với BRD — nó vẫn dẫn Nghị định 13/2023 đã hết hiệu lực, và dãy mã `ADR` của nó trùng số với dãy của BRD nhưng mang nghĩa hoàn toàn khác. Duy trì hai nguồn chân lý mâu thuẫn tốn kém hơn là hợp nhất. Phần nội dung còn giá trị — tám ranh giới ngữ cảnh, mười lăm bất biến, tám máy trạng thái — đã được suy lại từ chính BRD và đưa vào **mục 5.12**.
>
> **Hệ quả tích cực:** khoản nợ tài liệu về đụng mã `ADR` (`ND-4` trong tài liệu _Định nghĩa Phạm vi_) **tự tiêu**, vì không còn tài liệu thứ hai để đụng. Mã `ADR-11` dùng cho quyết định NestJS không còn xung đột với bất kỳ mã nào.
>
> **Việc còn lại:** lược đồ bảng chi tiết và bảng chuyển trạng thái đầy đủ sẽ được soạn lại thành một **tài liệu thiết kế kỹ thuật** ở giai đoạn hiện thực, lần này viết sau khi BRD đã ổn định để không lặp lại tình trạng lệch.

**Nguyên tắc phân định BRD và SRS:** BRD dừng ở mức "hệ thống phải đối chiếu được nhiều nguồn bằng chứng với danh mục đã duyệt và tạo hàng đợi xem xét". Cách hiện thực (từ điển, mẫu nhận dạng, mô hình) thuộc về SRS và tài liệu kiến trúc. Một số mục trong tài liệu này (đặc biệt 5.12, 6.2, 6.3) đã đi sâu hơn mức BRD thông thường; giữ lại vì chúng ràng buộc phạm vi và cần được thống nhất sớm trong nhóm.

---

## 12. THUẬT NGỮ NGHIỆP VỤ _(mục mới ở v3.2)_

Bảng này dành cho người đọc không chuyên kỹ thuật — giảng viên phản biện, thành viên nhóm phụ trách phần khác, hoặc người dùng doanh nghiệp. **Quy ước chung:** trong giao diện và tài liệu nộp dùng cột tiếng Việt; trong mã nguồn và cơ sở dữ liệu dùng cột tiếng Anh. Không trộn lẫn hai tầng.

| Tiếng Việt                 | Tiếng Anh trong mã        | Nghĩa                                                                                                                                                                                                  |
| -------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Danh mục SaaS              | Catalog Entry             | Bản khai báo một phần mềm đã được bộ phận CNTT phê duyệt cho doanh nghiệp dùng                                                                                                                         |
| Gói                        | Plan                      | Một bậc giá của một phần mềm, ví dụ Free / Pro / Business                                                                                                                                              |
| Mô hình giá                | Pricing model             | Cách nhà cung cấp tính tiền: theo đầu người, gói cố định, dùng chung, theo mức tiêu thụ                                                                                                                |
| Thuê bao                   | Subscription              | Một lần mua cụ thể: gói nào, bao nhiêu chỗ, từ ngày nào tới ngày nào, giá bao nhiêu                                                                                                                    |
| Hợp đồng                   | Contract                  | Văn bản pháp lý, có thể bao nhiều thuê bao và kéo dài nhiều năm                                                                                                                                        |
| Chỗ ngồi / suất dùng       | Seat                      | Quyền cho **một người** dùng một phần mềm. Không phải một bản ghi riêng, mà là một con số đếm được                                                                                                     |
| Suất đã mua                | Purchased quantity        | Số suất ghi trong thuê bao                                                                                                                                                                             |
| Suất đang dùng             | Occupied seats            | Số suất hiện đang gán cho người cụ thể                                                                                                                                                                 |
| Suất trống                 | Available seats           | Đã mua trừ đang dùng. Là **giá trị tính ra**, không lưu trong cơ sở dữ liệu                                                                                                                            |
| Cấp quyền                  | Assignment                | Quyết định của tổ chức cho một người dùng một phần mềm, trong một khoảng thời gian                                                                                                                     |
| Tác vụ cấp phát            | Provisioning Task         | Việc **tạo hoặc xóa tài khoản thật** phía nhà cung cấp — khác với quyết định ở trên                                                                                                                    |
| Yêu cầu                    | Request                   | Phiếu do nhân viên hoặc quản lý tạo để xin, đổi, gia hạn hay trả lại quyền                                                                                                                             |
| Bước phê duyệt             | Approval Step             | Một mắt xích trong chuỗi duyệt của một yêu cầu                                                                                                                                                         |
| Hạn chót báo hủy           | Cancellation deadline     | Ngày cuối cùng còn kịp báo hủy để không bị gia hạn. **Khác với ngày gia hạn**                                                                                                                          |
| License ảo / suất lãng phí | Ghost Seat                | Suất đã trả tiền nhưng không ai dùng, hoặc dùng không đáng kể                                                                                                                                          |
| Xác nhận của quản lý       | Attestation               | Quyết định Giữ lại / Thu hồi / Tạm miễn trừ mà quản lý chọn cho một khuyến nghị                                                                                                                        |
| Cửa sổ dữ liệu bao phủ     | Coverage window           | Khoảng thời gian mà một file nhật ký thực sự chứa dữ liệu. Ngoài khoảng này **không kết luận được**                                                                                                    |
| Ánh xạ danh tính           | Identity Resolution       | Việc nối một tên tài khoản lạ phía nhà cung cấp về đúng một nhân viên nội bộ                                                                                                                           |
| Phần mềm ngoài danh mục    | Discovery Finding         | Bản ghi cần xem xét khi phát hiện một phần mềm chưa nằm trong danh mục. **Không phải kết luận vi phạm**                                                                                                |
| Đơn vị chịu chi phí        | Cost Center               | Nơi chi phí được quy về. Trong hệ thống này, dự án cũng là một loại đơn vị chịu chi phí                                                                                                                |
| Đối soát                   | Reconciliation            | So sánh dữ liệu hệ thống với dữ liệu phía nhà cung cấp hoặc với hóa đơn để tìm chỗ lệch                                                                                                                |
| Sai lệch                   | Discrepancy               | Kết quả của việc đối soát khi hai bên không khớp                                                                                                                                                       |
| Nhật ký kiểm toán          | Audit Trail               | Ghi chép mọi thay đổi: ai làm, khi nào, đổi từ gì sang gì. Chỉ ghi thêm, không sửa không xóa                                                                                                           |
| Phân tách trách nhiệm      | Separation of Duties      | Nguyên tắc: người quyết định nhu cầu, người quyết chi và người thực hiện kỹ thuật là ba vai khác nhau _(sửa ở v3.8)_                                                                                   |
| Người duyệt chi            | Budget Approver           | Người có thẩm quyền chi, quyết định cuối cho khoản chi và cho việc thêm SaaS mới. Một người, Super Admin cấu hình _(v3.8)_                                                                             |
| Ý kiến ngân sách           | Budget Opinion            | Nhận định của Tài chính: trong hạn mức / vượt hạn mức / chưa có ngân sách — khi **trả lời yêu cầu thông tin** của Người duyệt chi, hoặc khi **ghi nhận sau duyệt**. **Không chặn** _(v3.8; sửa v3.10)_ |
| Snapshot ngân sách         | Budget Snapshot           | Ngân sách, thực chi, cam kết đang giữ, còn lại và phần đang chờ duyệt của cost center tại lúc Người duyệt chi quyết; lưu làm bằng chứng _(v3.10)_                                                      |
| Khoản cam kết ngân sách    | Budget Commitment         | Phần ngân sách đã được duyệt chi nhưng chưa thành hóa đơn; tính vào ngân sách đã dùng _(v3.8)_                                                                                                         |
| Bộ thu thập                | Collector                 | Phần mềm của hệ thống chạy trên thiết bị công ty, gửi dữ liệu sử dụng đã lọc tại nguồn: tiện ích trình duyệt, agent _(v3.8)_                                                                           |
| Danh sách cho phép         | Allowlist                 | Tên miền và tên tiến trình mà bộ thu thập được quan sát. Lấy từ danh mục SaaS và từ điển nhà cung cấp, trừ ứng dụng liên lạc _(v3.8)_                                                                  |
| Xác nhận chủ động          | Monitoring Acknowledgment | Việc nhân viên bấm xác nhận đã đọc thông báo theo dõi. Chưa có thì hệ thống không nhận dữ liệu từ thiết bị _(v3.8)_                                                                                    |
| Ranh giới ngữ cảnh         | Bounded Context           | Một vùng nghiệp vụ có bộ thuật ngữ và quy tắc riêng — xem mục 5.12.1 _(bổ sung ở v3.5)_                                                                                                                |
| Bất biến                   | Invariant                 | Quy tắc luôn phải đúng ở tầng dữ liệu, bất kể thao tác nào vừa xảy ra — xem mục 5.12.2 _(bổ sung ở v3.5)_                                                                                              |

---

## PHỤ LỤC A — Thay đổi so với BRD v1.0

| #   | Thay đổi                                                                       | Mục                            |
| --- | ------------------------------------------------------------------------------ | ------------------------------ |
| 1   | Chốt mô hình triển khai single-tenant                                          | 1, 3.2, ADR-01                 |
| 2   | Bổ sung vai trò Super Admin và bảng phân tách trách nhiệm                      | 4.1, 4.2                       |
| 3   | Bổ sung pain point Shadow IT và quan hệ nhân quả với quy trình phê duyệt chậm  | 2.2 (PP-4, PP-5)               |
| 4   | Bổ sung bảng truy vết pain point ↔ yêu cầu chức năng                           | 2.3                            |
| 5   | Tách Contract / Subscription / Invoice                                         | 5.1, ADR-06                    |
| 6   | Bổ sung mô hình giá làm thuộc tính phân nhánh                                  | FR-1.2, ADR-02                 |
| 7   | Đổi cơ sở cảnh báo gia hạn sang hạn chót báo hủy                               | FR-1.4                         |
| 8   | Bổ sung yêu cầu đa tiền tệ                                                     | FR-1.6, FR-5.6, ADR-03         |
| 9   | Bổ sung quan hệ tổ chức có lịch sử                                             | FR-2.2, ADR-04                 |
| 10  | Tách Assignment khỏi Provisioning Task, bổ sung đối soát sai lệch              | FR-2.5, FR-2.6, ADR-07         |
| 11  | Bổ sung ủy quyền phê duyệt, approver dự phòng, SLA và chỉ số thời gian xử lý   | FR-3.5, FR-3.6, FR-3.8, FR-3.9 |
| 12  | Bổ sung thời hạn bắt buộc cho quyết định miễn trừ                              | FR-3.10                        |
| 13  | Bổ sung bảng tình huống ngoại lệ của luồng phê duyệt                           | 5.3                            |
| 14  | Phân loại 5 nhóm lãng phí license                                              | 5.4.1                          |
| 15  | Bổ sung mẫu cấu hình nguồn, cửa sổ dữ liệu bao phủ, ma trận năng lực nguồn     | FR-4.2, FR-4.3, FR-4.4         |
| 16  | Bổ sung tầng ánh xạ danh tính                                                  | FR-4.5 → FR-4.8                |
| 17  | Bổ sung cổng lọc điều kiện và phân biệt ba trạng thái thiếu dữ liệu            | FR-4.9, FR-4.10                |
| 18  | Bổ sung phân loại mức ý nghĩa của sự kiện                                      | FR-4.11                        |
| 19  | Tách hai con số ước tính tiết kiệm                                             | FR-4.15                        |
| 20  | Bổ sung hai cơ sở ghi nhận chi phí                                             | FR-5.3                         |
| 21  | Tách từ điển nhà cung cấp khỏi danh mục tổ chức                                | FR-6.2, ADR-05                 |
| 22  | Bổ sung quy tắc tính độ tin cậy theo phương pháp khớp                          | FR-6.5                         |
| 23  | Bổ sung chống trùng lặp và phân tầng rủi ro cho Discovery                      | FR-6.7, FR-6.8                 |
| 24  | Bổ sung phân hệ Import với bước xem trước bắt buộc                             | 5.7                            |
| 25  | Bổ sung phân hệ Quản trị hệ thống                                              | 5.8                            |
| 26  | Bổ sung kiến trúc Provisioning Port                                            | 6.2                            |
| 27  | Bổ sung chiến lược dữ liệu ba lớp cho Usage                                    | 6.3                            |
| 28  | Sắp xếp lại lớp AI theo vai trò, làm rõ nguyên tắc backend tính — AI diễn giải | 6.4                            |
| 29  | Bổ sung mục quyết định phạm vi kèm lý do                                       | 9                              |
| 30  | Bổ sung danh sách vấn đề còn mở có mã theo dõi                                 | 10                             |

---

## PHỤ LỤC B — Thay đổi so với BRD v2.0

### B.1. Năm nhóm thay đổi ở v3.0

| #   | Thay đổi                                                                                                  | Mục bị ảnh hưởng                                      | Loại    |
| --- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------- |
| 1   | **Bổ sung Định nghĩa thành công** — 5 chỉ số KPI-1 → KPI-5, kèm FR-0.1 → FR-0.3                           | Mục 2.4 (mới), 2.3 (thêm cột), 3.1 (thêm dòng)        | Bổ sung |
| 2   | **Bổ sung phân hệ Khởi tạo dữ liệu ban đầu** — 5 bước, FR-9.1 → FR-9.6                                    | Mục 5.9 (mới), 5.10 (thêm luồng), 3.1 (thêm dòng)     | Bổ sung |
| 3   | **Dự báo chuyển từ loại trừ sang ba lớp có cổng kiểm chứng** — FR-5.5 viết lại, FR-5.7 mới, ADR-09 mới    | FR-5.5, FR-5.7, FR-8.2, mục 3.2, 3.3 (mới), 9, ADR-09 | Mở rộng |
| 4   | **Discovery từ log web/CASB giữ ngoài phạm vi, bổ sung giải trình ba lý do** — FR-6.3 và FR-6.10 viết lại | FR-6.3, FR-6.10, mục 5.6.1 (mới), 3.1, 3.2, 7.5, 9    | Làm rõ  |
| 5   | **Đóng OQ-02, OQ-03, OQ-06, OQ-07**; bổ sung OQ-09, OQ-10                                                 | Mục 10                                                | Đồng bộ |

### B.2. Thay đổi phụ đi kèm ở v3.0

| Mục            | Nội dung                                                                                       |
| -------------- | ---------------------------------------------------------------------------------------------- |
| Mục 4 (mở đầu) | Bổ sung câu rút gọn nguyên tắc phân tách trách nhiệm                                           |
| FR-1.4         | Bổ sung đoạn xử lý trường hợp thiếu dữ liệu hạn báo hủy                                        |
| FR-3.9         | Bổ sung tham chiếu KPI-2                                                                       |
| FR-8.2         | Bổ sung tham số ngưỡng sai số của cổng kiểm chứng dự báo                                       |
| Mục 7.5        | Bổ sung ghi chú về việc mức nhạy cảm dữ liệu giảm sau khi bỏ nguồn CASB                        |
| ADR-05         | Bỏ mệnh đề "cải thiện một lần dùng cho mọi tenant" — không đúng với mô hình dedicated instance |
| Mục 5.9 cũ     | Đổi số thành 5.10 do chèn phân hệ Khởi tạo dữ liệu vào vị trí 5.9                              |

### B.3. Thay đổi ở v3.1 — cập nhật khung pháp lý

**Nguyên nhân:** rà soát lại phát hiện Nghị định 13/2023/NĐ-CP mà BRD viện dẫn **đã hết hiệu lực từ 01/01/2026**, được thay bằng Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Nghị định 356/2025/NĐ-CP. Đây là lỗi cần sửa gấp vì tài liệu đang dẫn văn bản không còn hiệu lực.

| #   | Thay đổi                                                                                                                                                              | Mục bị ảnh hưởng         | Loại    |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------- |
| 1   | **Thay toàn bộ trích dẫn** Nghị định 13/2023 → Luật 91/2025 + Nghị định 356/2025                                                                                      | 5.6.1, 7.5, 7.7.1, OQ-08 | Sửa lỗi |
| 2   | **Bổ sung mục 7.7** — khung pháp lý, phân loại dữ liệu theo rủi ro, cơ sở pháp lý xử lý, đối chiếu nghĩa vụ với thiết kế, nghĩa vụ ngoài phạm vi phần mềm             | 7.7 (mới, 6 tiểu mục)    | Bổ sung |
| 3   | **Bổ sung phân hệ Quyền của chủ thể dữ liệu** — FR-10.1 → FR-10.5, kèm bảng thời hạn đáp ứng                                                                          | 5.11 (mới), 3.1          | Bổ sung |
| 4   | **Viết lại chính sách lưu giữ** thành bảng theo loại dữ liệu; **gỡ dòng "90 ngày cho log truy cập thô"** vì nguồn đó không còn trong phạm vi                          | 7.5                      | Sửa     |
| 5   | **Bổ sung lập luận mới cho mục 5.6.1** — Nghị định 356/2025 mở rộng nhóm dữ liệu nhạy cảm sang dữ liệu hành vi, làm quyết định loại bỏ nguồn log web trở nên vững hơn | 5.6.1                    | Mở rộng |
| 6   | **Bổ sung OQ-11** — dữ liệu "ngày hoạt động cuối" có thuộc nhóm nhạy cảm không, ưu tiên cao                                                                           | Mục 10                   | Bổ sung |

### B.4. Thay đổi ở v3.2 — đóng toàn bộ hạng mục còn treo

Tám hạng mục ghi "chưa xử lý" ở v3.0 và v3.1 nay đã xử lý hết.

| #   | Hạng mục còn treo trước đây                     | Đã xử lý thế nào                                                                                                               | Vị trí mới        |
| --- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ----------------- |
| 1   | Ngôn ngữ định vị ở mục 1                        | Chốt theo hướng **hệ thống nội bộ doanh nghiệp**, khớp bản đăng ký; viết lại bảng thông tin chung và ghi chú giải thích vì sao | Mục 1             |
| 2   | Phụ lục đối chiếu "bản đăng ký ↔ BRD"           | Đưa vào thân BRD thay vì tách tài liệu riêng — đối chiếu 5 điểm bổ sung, 2 điểm thu hẹp, 1 điểm giữ có điều kiện               | **Phụ lục C**     |
| 3   | Hồ sơ tổ chức mục tiêu                          | Bảng 6 đặc điểm kèm mức mục tiêu và lý do; nêu rõ ai **không** phải đối tượng                                                  | Mục 3.4           |
| 4   | Mục giả định tường minh                         | 8 giả định kèm **hệ quả nếu giả định sai**, và 5 ràng buộc dự án                                                               | Mục 3.5           |
| 5   | Trách nhiệm cụ thể của Business Owner           | 4 trách nhiệm, ranh giới quyền hạn, và FR-1.7 chống để trống trường này                                                        | Mục 4.4, FR-1.7   |
| 6   | Chính sách khi các nguồn dữ liệu mâu thuẫn      | Nguyên tắc phân định nguồn chân lý + bảng 7 tình huống + FR-7.7                                                                | Mục 5.7.1, FR-7.7 |
| 7   | Nhóm người dùng không phải nhân viên chính thức | Bảng 4 nhóm kèm cách xử lý, và FR-2.8 bắt buộc ngày kết thúc                                                                   | Mục 4.5, FR-2.8   |
| 8   | Thuật ngữ tiếng Việt cho người không kỹ thuật   | 24 thuật ngữ, kèm quy ước dùng tiếng Việt ở giao diện và tiếng Anh trong mã                                                    | Mục 12            |

### B.5. Thay đổi ở v3.3 — đóng bốn câu hỏi cuối

Bốn câu hỏi được đóng sau khi **tra cứu văn bản gốc và tài liệu chính thức của nhà cung cấp**, không phỏng đoán.

| Câu hỏi   | Kết luận                                                                                                                                                                                                      | Căn cứ                                                                       | Vị trí trong BRD      |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------- |
| **OQ-11** | ~~Công cụ công việc thông thường **không thuộc** 12 nhóm nhạy cảm~~ — 🛑 **kết luận v3.3 này đã bị bác ở v3.6**, xem mục 10. Phần còn đúng: ứng dụng liên lạc là vùng xám; log truy cập web rơi vào điểm `l)` | Điều 4 Nghị định 356/2025 — **bản trích khi đó thiếu vế cuối** của điểm `l)` | 7.7.6, ADR-10, FR-1.8 |
| **OQ-08** | 12 tháng **hoặc** 30 ngày sau ngày làm việc cuối, cái nào đến trước; 6 tháng với ứng dụng liên lạc                                                                                                            | Nghĩa vụ xóa, hủy dữ liệu người lao động khi chấm dứt hợp đồng lao động      | 7.5, FR-10.6          |
| **OQ-09** | Sai số phần trăm tuyệt đối trung bình ≤ 20%, cấu hình 10–40%, phải hiển thị con số đo được                                                                                                                    | Quy ước thực hành trong dự báo, nêu rõ là quy ước                            | FR-5.7                |
| **OQ-10** | Không đặt mục tiêu KPI cho tổ chức; thay bằng 4 tiêu chí nghiệm thu TC-1 → TC-4 cho rule engine                                                                                                               | Mục tiêu trên tổ chức mô phỏng không kiểm chứng được                         | 2.4                   |

**Bổ sung đi kèm:** ADR-10 (mục 8) · FR-1.8 (mục 4.4) · FR-10.6 (mục 7.5) · ma trận truy xuất usage (mục 6.3.1) · nghĩa vụ minh bạch khi giám sát người lao động (mục 7.7.7) · OQ-12, OQ-13 (mục 10).

### B.6. Thay đổi ở v3.4 — đóng OQ-12 và OQ-13

**OQ-12 — xác định lại đường rủi ro pháp lý.** Tra cứu cho thấy cụm _"dịch vụ truyền thông trực tuyến"_ tại Điều 4 mục 11 **không có định nghĩa pháp lý minh thị**, và các bình luận hiểu nó theo hướng nền tảng nội dung số chứ không phải công cụ làm việc. Nhưng quá trình tra làm lộ ra rằng đường rủi ro thật của nhóm ứng dụng nhắn tin và họp trực tuyến đi qua cụm **"dịch vụ viễn thông"** — Luật Viễn thông 2023 đã đưa _dịch vụ viễn thông cơ bản trên Internet_ vào diện quản lý.

Hệ quả: **nâng cấp ADR-10** từ "xử lý chặt hơn" sang **"mặc định không thu thập dữ liệu hoạt động"** cho nhóm ứng dụng này, kèm quy tắc gắn cờ ba câu hỏi. Đây là thay đổi có ý nghĩa: nó biến một câu hỏi pháp lý chưa có lời giải thành một câu hỏi **không cần lời giải**.

**OQ-13 — hoàn thiện ma trận truy xuất usage** từ 4 lên 8 nhà cung cấp.

| #   | Thay đổi                                                                                                 | Vị trí           |
| --- | -------------------------------------------------------------------------------------------------------- | ---------------- |
| 1   | Bổ sung Microsoft 365 và Atlassian vào ma trận — cả hai đều có ngày hoạt động cuối theo từng người       | Mục 6.3.1        |
| 2   | Ghi nhận Zoom và Notion **không tìm thấy tài liệu chính thức**, không suy đoán                           | Mục 6.3.1, OQ-14 |
| 3   | **KL-4** — Microsoft 365 mặc định ẩn tên người dùng trong báo cáo usage, là bằng chứng ngành cho OQ-03   | Mục 6.3.1        |
| 4   | **KL-5** — Atlassian tính "xem trang 2 giây" là hoạt động; mỗi nguồn định nghĩa hoạt động một kiểu       | Mục 6.3.1        |
| 5   | **FR-4.16** — mẫu cấu hình nguồn bắt buộc khai báo nguồn đó hiểu "hoạt động" là gì, tính vào mức tin cậy | Mục 5.4.4        |
| 6   | Nâng cấp **ADR-10** — mặc định không thu thập, quy tắc gắn cờ ba câu hỏi, ví dụ áp dụng cụ thể           | Mục 8            |
| 7   | Viết lại **mục 7.7.6** — bảng phân tích ba cụm từ trong Điều 4 mục 11 và đường rủi ro thật               | Mục 7.7.6        |
| 8   | **OQ-14** mới — Zoom và Notion, ưu tiên thấp, không ảnh hưởng thiết kế                                   | Mục 10           |

### B.7. Thay đổi ở v3.5 — chốt NestJS và hợp nhất Domain Spec

> 🔠 _(chú thích thêm 08/09/2026)_ **Mục này giữ nguyên mã cũ `QĐ-1`** vì là bản ghi lịch sử của v3.5. Mã hiện hành của quyết định đó là **`QĐKT-01`** — xem `ADR-11` và _Định nghĩa Phạm vi_ mục 6.7.1.

Ba nhóm thay đổi.

**(a) Chốt framework backend là NestJS**

| #   | Thay đổi                                                                                                             | Vị trí   | Loại            |
| --- | -------------------------------------------------------------------------------------------------------------------- | -------- | --------------- |
| 1   | Chốt **NestJS**, bỏ cách viết "ASP.NET Core hoặc NestJS"                                                             | Mục 6.1  | Chốt quyết định |
| 2   | Bổ sung **ADR-11** — lý do chọn theo đúng ba tiêu chí đã đặt, hệ quả thiết kế, và ràng buộc bắt buộc giữ ở tầng CSDL | Mục 8    | Bổ sung         |
| 3   | Bổ sung tham chiếu ADR-11 ở mục 7.2 (guard) và 7.6 (test phủ định SoD)                                               | 7.2, 7.6 | Làm rõ          |

Quyết định này đóng `QĐ-1` _(mã cũ; nay là `QĐKT-01`)_ — vốn được theo dõi ở tài liệu _Định nghĩa Phạm vi & Nghiệp vụ_ mục 6.7.1.

**(b) Gỡ bộ Domain Spec, hợp nhất nội dung lõi vào BRD**

| #   | Thay đổi                                                                                                              | Vị trí    | Loại    |
| --- | --------------------------------------------------------------------------------------------------------------------- | --------- | ------- |
| 1   | **Bổ sung mục 5.12 mới** — tám ranh giới ngữ cảnh, mười lăm bất biến `INV-01` → `INV-15`, tám vòng đời máy trạng thái | Mục 5.12  | Bổ sung |
| 2   | Mục 5.3 và 5.10: dẫn chiếu _Domain Spec Phần 2_ → dẫn về **mục 5.12**                                                 | 5.3, 5.10 | Sửa     |
| 3   | Mục 7.4: bổ sung câu dẫn sang danh sách bất biến đầy đủ ở 5.12.2                                                      | 7.4       | Làm rõ  |
| 4   | Ghi chú OQ-02/03/06/07: bỏ dẫn chiếu _Domain Spec Phần 1b_, thay bằng `INV-03` và `INV-14`                            | Mục 10    | Sửa     |
| 5   | Mục 11: gỡ 6 dòng Domain Spec khỏi bảng tài liệu liên quan, kèm ghi chú giải trình lý do gỡ                           | Mục 11    | Sửa     |
| 6   | Mục 12: bổ sung hai thuật ngữ _Ranh giới ngữ cảnh_ và _Bất biến_                                                      | Mục 12    | Bổ sung |
| 7   | ADR-01, 03, 04, 07, 08: bổ sung dẫn chiếu tới mã `INV-x` tương ứng                                                    | Mục 8     | Làm rõ  |

> **Hệ quả tích cực ngoài dự kiến:** khoản nợ tài liệu `ND-4` — đụng mã `ADR` giữa BRD và Domain Spec Phần 1b — **tự tiêu**, vì không còn tài liệu thứ hai để đụng. Mã `ADR-11` dùng cho NestJS không xung đột với bất kỳ mã nào. Tương tự, `ND-1` (Domain Spec Phần 1 còn trích Nghị định 13/2023) cũng hết đối tượng.

**(c) Sửa lỗi tồn**

| #   | Lỗi                                                                                                                         | Vị trí    |
| --- | --------------------------------------------------------------------------------------------------------------------------- | --------- |
| 1   | Ô trạng thái BRD ở bảng mục 11 ghi "v3.0" trong khi tài liệu đã tới v3.4                                                    | Mục 11    |
| 2   | Link NIST SP 800-53 ở mục 5.3 trỏ tệp OSCAL; đổi sang trang xuất bản chính thức bản Update 1                                | Mục 5.3   |
| 3   | Nguồn tra cứu văn bản pháp luật ở mục 7.7.1 trỏ trang tra cứu tư nhân; đổi sang cổng văn bản Chính phủ, kèm quy tắc nguồn   | Mục 7.7.1 |
| 4   | Bổ sung **OQ-15** — nhà cung cấp định danh, vốn được đặt cùng mốc với `QĐ-1` _(mã cũ; nay là `QĐKT-01`)_ nên nay đã tới hạn | Mục 10    |

### B.8. Còn lại sau v3.5

> 🛑 **Câu tổng kết dưới đây đúng ở thời điểm v3.5 nhưng KHÔNG còn đúng ở v3.6.** `OQ-11` đã **mở lại** với mức ưu tiên cao — xem `B.9` và mục 10. Giữ nguyên văn để đối chiếu lịch sử.

~~BRD **không còn hạng mục nội dung nào chưa soạn, và không còn câu hỏi nào chặn tiến độ hay chặn thiết kế**.~~

| Việc                                                                          | Loại                            | Có chặn gì không                                                                               |
| ----------------------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------- |
| **OQ-15** — nhà cung cấp định danh                                            | **Cần chốt sớm**                | Không chặn nghiệp vụ, nhưng quyết định `CN-1` OAuth/OIDC có chạy thật trong demo hay không     |
| OQ-14 — Zoom và Notion có bản xuất hoạt động không                            | Ưu tiên thấp                    | **Không** — GitHub, Microsoft 365, Atlassian đã đủ                                             |
| Soạn tài liệu thiết kế kỹ thuật (lược đồ bảng, bảng chuyển trạng thái đầy đủ) | Việc mới sau khi gỡ Domain Spec | **Không** — mục 5.12 đã đủ cho giai đoạn báo cáo; tài liệu chi tiết soạn khi bắt đầu hiện thực |
| Trao đổi với GVHD về mức độ trình bày phần pháp lý trong báo cáo              | Việc ngoài BRD                  | **Không** — nội dung đã có, chỉ là chọn độ sâu trình bày                                       |

### B.9. Thay đổi ở v3.6 — vòng review tài liệu ngày 08/09/2026

v3.6 gồm **hai đợt**. Đợt 1 là sửa lỗi trích dẫn và tham chiếu, **không đổi yêu cầu chức năng nào** — bảng ngay dưới. Đợt 2 là **các quyết định do nhóm trưởng chốt cùng ngày**, có đổi nội dung yêu cầu — bảng ở `B.9.1`. Sổ quyết định đầy đủ: `Docs/Decisions/project-decisions.md`.

#### B.9.1. Đợt 2 — quyết định của nhóm trưởng, chốt 08/09/2026

| Mã      | Quyết định                                                                                                    | Thay đổi trong BRD                                                                                                                             |
| ------- | ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `QĐ-01` | Mở rộng nguyên tắc thận trọng cho **mọi** ứng dụng; vẫn thu thập nên giữ `G3`/`G4`                            | `FR-10.4` thành bắt buộc cho mọi ứng dụng · mục 7.5 rút lưu giữ từ 12 xuống **6 tháng** · `ADR-10` thành ba mức · `OQ-11` đóng về mặt thiết kế |
| `QĐ-02` | Approver dự phòng ở gốc cây là **một Employee cụ thể** do Super Admin cấu hình, duyệt với tư cách vai Manager | `FR-3.6`                                                                                                                                       |
| `QĐ-03` | Connector GitHub dùng **API thành viên tổ chức**, không đụng audit-log API                                    | Mục 6.3                                                                                                                                        |
| `QĐ-04` | Frontend là **React Router 8** chế độ SPA + Vite                                                              | Mục 6.1 · **`ADR-12`** mới                                                                                                                     |
| `QĐ-07` | Chênh lệch mốc thời gian với bản đăng ký là việc hành chính, không ghi vào tài liệu kỹ thuật                  | Phụ lục C.4                                                                                                                                    |
| `QĐ-09` | Tầng _Theo dõi_ chỉ IT Admin thấy; `G1`/`G2` chạy hằng ngày, `G3`/`G4` hằng tuần                              | `FR-4.12`, **`FR-4.12b`** mới                                                                                                                  |

> **Về `QĐ-01`:** đây là quyết định **thiết kế và phạm vi demo**, **không phải** kết luận pháp lý. Nó không khẳng định dữ liệu hoạt động của công cụ làm việc có hay không thuộc nhóm nhạy cảm — nó làm cho câu trả lời đó **không còn cần thiết để chạy tiếp**.

#### B.9.2. Đợt 1 — sửa lỗi trích dẫn và tham chiếu

**Không thay đổi yêu cầu chức năng nào.**

| #   | Thay đổi                                                                                                                                                                                         | Vị trí                                    | Loại        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- | ----------- |
| 1   | 🛑 **Sửa trích dẫn điểm `l)` khoản 1 Điều 4 NĐ 356/2025** — bổ sung vế bị cắt _"và các dịch vụ khác trên không gian mạng"_; đính chính cấu trúc là **12 điểm `a)`→`m)`** chứ không phải "12 mục" | 7.7.6                                     | **Sửa lỗi** |
| 2   | **Mở lại `OQ-11`** với mức ưu tiên cao; gắn cờ bốn chỗ còn khẳng định kết luận cũ: `ADR-10` Bối cảnh, câu trả lời phản biện của `ADR-10`, Phụ lục B.5, Phụ lục B.8                               | 10, mục 8, B.5, B.8                       | **Sửa lỗi** |
| 3   | Sửa bảng truy vết `PP-1` — `FR-3.6` → `FR-3.10`, dải đổi thành `FR-4.1` → `FR-4.16`, bổ sung `FR-2.4`; `PP-4` mở rộng tới `FR-6.9`                                                               | 2.3                                       | Sửa lỗi     |
| 4   | Đổi căn cứ thời lượng _"14 tuần"_ → **"9 tuần phát triển thật (T1–T9)"** theo Kế hoạch v1.0                                                                                                      | 1, `RB-1`, 5.6.1, `ADR-01`, `ADR-11`, C.4 | Đồng bộ     |
| 5   | Cập nhật bảng tài liệu liên quan: sửa hai phiên bản lạc hậu, bổ sung Context Diagram, Business Workflows, Screen Flows                                                                           | 11                                        | Đồng bộ     |
| 6   | Sửa _"Ba kết luận"_ → _"Năm kết luận"_                                                                                                                                                           | 6.3.1                                     | Sửa lỗi     |
| 7   | Bổ sung ràng buộc đã kiểm chứng: API nhật ký kiểm toán GitHub chỉ có ở Enterprise Cloud                                                                                                          | 6.3                                       | Bổ sung     |
| 8   | Ghi rõ dòng lưu giữ 6 tháng của nhóm ứng dụng liên lạc **chỉ phát sinh khi doanh nghiệp chủ động bật thu thập**                                                                                  | 7.5                                       | Làm rõ      |

#### B.9.3. Đợt 3 — sửa mâu thuẫn nội bộ và hiệu chỉnh phát biểu pháp lý, sau review độc lập 08/09/2026

**Không thêm yêu cầu chức năng mới.** Đợt này xử lý tám phát hiện `CX-01`→`CX-08` của một vòng review độc lập chạy sau khi đợt 1 và đợt 2 đã ghi vào tệp; chuỗi báo cáo cũ đã được rút gọn tại `Docs/Reviews/review-history-summary.md`. Các thay đổi ở đây **làm cho tài liệu nhất quán với chính nó**, không đổi chính sách đã chốt ở đợt 2.

| #   | Thay đổi                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Vị trí        | Mã      | Loại              |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------- | ----------------- |
| 1   | **`ADR-10` chỉ còn MỘT bảng chính sách có hiệu lực.** Bảng _Quyết định_ cũ vẫn ghi _"hai chế độ"_ và **12 tháng** cho ứng dụng thông thường, mâu thuẫn với `QĐ-01`, mục 7.5 và `FR-10.4` đã sửa ở đợt 2. Nay bảng hiện hành là **ba mức** với mốc **6 tháng**; bảng hai chế độ chuyển thành khối lịch sử có nhãn rõ                                                                                                                                                                                 | `ADR-10`      | `CX-01` | **Sửa mâu thuẫn** |
| 2   | **Tách changelog v3.6 thành đợt 1 và đợt 2** cho khớp `B.9.1`/`B.9.2`. Bản trước mô tả cả v3.6 là _"không thay đổi yêu cầu nghiệp vụ nào"_ và _"`ADR-10` không đổi"_ — hai phát biểu chỉ đúng với đợt 1. Ghi rõ `OQ-11` **mở lại ở đợt 1 rồi đóng ở mức thiết kế ở đợt 2** trong cùng một ngày                                                                                                                                                                                                      | Đầu tệp       | `CX-02` | **Sửa mâu thuẫn** |
| 3   | **Gỡ kết luận pháp lý cũ khỏi phần đang có hiệu lực.** Câu _"dữ liệu hoạt động phần lớn không thuộc nhóm nhạy cảm"_ vẫn nằm ở mục 7.7.6 dưới dạng kết luận hiện hành dù cảnh báo đầu mục đã vô hiệu hóa nó. Nay gạch và gắn nhãn lịch sử, thay bằng phát biểu thiết kế: hệ thống áp biện pháp bảo vệ **mà không xác định phân loại pháp lý**                                                                                                                                                        | 7.7.6         | `CX-03` | **Sửa mâu thuẫn** |
| 4   | **Sửa mã quyết định connector `QĐ-02` → `QĐ-03`**; mô tả đúng ngữ nghĩa API: `PUT .../memberships/{username}` **gửi lời mời, trạng thái `pending` cho tới khi người dùng chấp nhận** — lời mời đã gửi **không** đồng nghĩa thành viên đã kích hoạt hay seat đã cấp; ghi rõ điều kiện **org owner** và quyền ghi `Members`; nâng điều kiện org thật thành **điểm chặn demo**                                                                                                                         | 6.3           | `CX-05` | **Sửa lỗi**       |
| 5   | **Hạ cấp hai phát biểu tuân thủ xuống đúng mức bằng chứng.** Mục 7.7.7 trước ghi `FR-10.4` là _"điều kiện để việc thu thập dữ liệu là hợp pháp"_; mục 7.5 ghi mốc 6 tháng _"đồng thời đáp ứng nghĩa vụ"_. Vòng review chỉ xác minh **danh tính và ngày hiệu lực** của Luật 91/2025/QH15, **chưa đọc điều khoản**. Nay cả hai được phát biểu là **biện pháp thiết kế** và **quyết định lưu giữ của dự án**; căn cứ pháp lý ở mục 7.5 cũng được gắn nhãn _diễn giải chưa kiểm chứng ở mức điều khoản_ | 7.5, 7.7.7    | `CX-08` | **Hiệu chỉnh**    |
| 6   | **Nhóm trưởng xác nhận mốc lưu giữ 6 tháng** — trước đó đây là _hệ quả suy ra_ của người soạn từ cụm _"rút ngắn lưu giữ"_, chưa có xác nhận trực tiếp. Kiểm chứng kèm theo: 180 ngày phủ ngưỡng phát hiện dài nhất 90 ngày (`FR-4.12`) gấp đôi, và **so sánh theo kỳ dùng bảng tổng hợp phi định danh 24 tháng**, không dùng bản ghi chi tiết                                                                                                                                                       | 7.5, `ADR-10` | `CX-01` | **Xác nhận**      |

> **Ba phát hiện còn lại của vòng review** không nằm trong BRD: `CX-04` (bảng phân công mục 6.3 của _Định nghĩa Phạm vi_), `CX-06` (bản kiểm kê phiên bản lịch sử) và `CX-07` (tham chiếu phiên bản cũ trong _Screen Flows_). Xử lý đã được nhập vào source liên quan; chuỗi review cũ được tóm tắt tại `Docs/Reviews/review-history-summary.md`.
>
> **Phiên bản không đổi.** Đợt 3 vẫn thuộc **v3.6** vì nó chạy trong cùng vòng review ngày 08/09/2026 và **không thêm yêu cầu nào**; đánh số v3.7 sẽ khiến mọi tham chiếu chéo _"BRD v3.6"_ ở các tài liệu khác sai ngay lập tức. Cần phân biệt ba đợt thì dùng mã `B.9.1`, `B.9.2`, `B.9.3`.

### B.10. Thay đổi ở v3.7 — hai quyết định của nhóm trưởng, chốt 09/09/2026

Đợt này **có thêm một yêu cầu chức năng** (`FR-3.12`), nên **đổi số phiên bản** — khác ba đợt của v3.6. Hai câu hỏi được đóng ở đây phát sinh từ vòng kiểm chéo độc lập ngày 09/09/2026 _(phát hiện `WF-APP-01` và `WF-APP-02`; lịch sử tại `Reviews/review-history-summary.md`)_: sơ đồ `WF-09` cần biểu diễn ràng buộc không tự duyệt cho người được ủy quyền, và khi làm việc đó mới lộ ra rằng **nguồn chưa nói** bước đi đâu khi ứng viên bị loại.

| Mã      | Quyết định                                                                                                                                                      | Thay đổi trong BRD                                      |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `QĐ-12` | Người được ủy quyền trùng người yêu cầu ⟹ bước **quay về người ủy quyền**, rồi mới `FR-3.3` _(cấp trên)_, cuối cùng `FR-3.6` _(dự phòng ở gốc)_                 | **`FR-3.5`** mở rộng · một dòng ở bảng ngoại lệ mục 5.3 |
| `QĐ-13` | Không còn người duyệt hợp lệ ⟹ **chờ có kiểm soát**: giữ trạng thái chờ, gắn cờ, nhắc/leo cấp theo `FR-3.8`, **báo Super Admin cấu hình lại** approver dự phòng | **`FR-3.12`** mới · một dòng ở bảng ngoại lệ mục 5.3    |

**Điều v3.7 KHÔNG làm:**

- **Không** đổi `FR-3.3`, `FR-3.6`, `SoD-1` → `SoD-6`, `INV-08` — cả hai quyết định chạy **bên trong** các ràng buộc đó.
- **Không** thêm vai trò hay actor mới. Người duyệt dự phòng vẫn là **một** Employee do Super Admin cấu hình (`QĐ-02` giữ nguyên); phương án _"cấu hình ít nhất hai người dự phòng"_ đã được cân nhắc và **không chọn** ở lượt này.
- **Không** thay đổi chính sách lưu giữ, phân hệ Usage, connector hay bất kỳ mục nào ngoài 5.3.

### B.11. Thay đổi ở v3.8 — xử lý góp ý sau buổi review, nhóm trưởng chốt 14/09/2026

Đợt này **có thay đổi yêu cầu chức năng, thêm vai trò và thêm bất biến**, nên **đổi số phiên bản**. Góp ý của GVHD và mentor **do nhóm trưởng thuật lại**; mọi dòng dưới đây là **quyết định của nhóm trưởng**, không phải xác nhận của GVHD. Căn cứ bên ngoài nằm ở `Research-AI/usage-tracking-legal-vendor-research-2026-09-14.md`.

| Mã      | Quyết định                                                                                                                              | Thay đổi trong BRD                                                                                                                                                                                                                                                                           |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `QĐ-20` | Ba nguồn bằng chứng sử dụng: nhà cung cấp; **tiện ích trình duyệt** hiện thực; **agent** chỉ thiết kế. Xác nhận chủ động, lọc tại nguồn | 3.1, 3.2, 3.3, `GĐ-9`, `RB-5` · **5.4.4b mới** (`FR-4.17` → `FR-4.19`) · `FR-4.1`, `FR-6.3`, `FR-8.2`, `FR-10.4` · 5.6.1 · 5.10 · 5.12.1 C5 · **`INV-17`** · 6.3 lớp 4 · 7.5, 7.7.1 → 7.7.7 · **`ADR-13` mới** · ghi chú `ADR-10` · 9 · `OQ-16`, `OQ-17` · 12 · C.1                          |
| `QĐ-21` | Ma trận 11 nhà cung cấp; danh mục demo bốn tầng                                                                                         | 6.3.1 thay bảng · **`KL-6`** · đóng `OQ-14`                                                                                                                                                                                                                                                  |
| `QĐ-22` | **Người duyệt chi** — vai trò thứ sáu, một người; Finance ghi ý kiến ngân sách, không chặn; **khoản cam kết ngân sách**                 | Mục 4, 4.1, 4.2 (`SoD-3` viết lại, **`SoD-7`, `SoD-8` mới**), 4.3 · `GĐ-5` · **`FR-3.4` viết lại**, **`FR-3.13`, `FR-3.14` mới**, bảng ngoại lệ 5.3 · `FR-5.1` · **5.5.2 mới** (`FR-5.8`) · 5.10 · 5.12.1 C4, C7 · **`INV-16`** · 5.12.3 thêm vòng đời BudgetCommitment · 7.6 · 9 · 12 · C.1 |
| `QĐ-23` | Bỏ Phòng ban và Đội nhóm; giữ Cost Center                                                                                               | 3.1, 3.4, `GĐ-1`, 4.1 · tiêu đề 5.3 · `FR-2.2`, `FR-3.1`, `FR-4.13`, `FR-5.2` · 5.9 bước 1 · 5.12.1 C2                                                                                                                                                                                       |
| `QĐ-24` | Năm nhóm báo cáo; "doanh thu" trả lời bằng tổng chi và tiết kiệm                                                                        | 2.3 · **`FR-0.4` mới** · 3.1 · **5.5.3 mới** (`FR-5.9` → `FR-5.12`)                                                                                                                                                                                                                          |
| `QĐ-25` | Hoãn dự báo lớp L2                                                                                                                      | 3.2, 3.3 · `FR-5.7` · 9 · C.2                                                                                                                                                                                                                                                                |

**Điều v3.8 KHÔNG làm:**

- **Không** đổi `QĐ-02`: approver dự phòng ở gốc vẫn duyệt với tư cách Manager và **không** thay được Người duyệt chi.
- **Không** đổi `QĐ-12`, `QĐ-13`, `SoD-1`, `SoD-4`, `INV-08`.
- **Không** mở lại việc thu thập dữ liệu hoạt động của ứng dụng liên lạc — `ADR-10` giữ nguyên, bộ thu thập cũng bỏ nhóm này.
- **Không** kết luận pháp lý thay cho `OQ-11` hay `OQ-16`.
- **Không** sửa bản đăng ký đồ án — lệch được ghi ở Phụ lục C.
- **Chưa** đồng bộ sơ đồ draw.io, ảnh xuất, Business Workflows, Context Diagram, Kế hoạch thực hiện và code — để phiên sau theo `QĐ-25`. 📁 _Ghi nhận tại v3.8; riêng **Kế hoạch thực hiện** không còn đối tượng đồng bộ từ 15/09/2026 vì `QĐ-26` đã loại tài liệu này khỏi baseline._

**Còn mở sau v3.6:**

| Việc                                                           | Ai quyết | Có chặn gì không                                                             |
| -------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------- |
| **`OQ-11`** — phân loại dữ liệu hoạt động của công cụ làm việc | **GVHD** | **Chặn** việc chốt biện pháp bảo vệ ở phân hệ 5.4; không chặn cấu trúc luồng |
| `OQ-15` — nhà cung cấp định danh                               | `R2`     | Không chặn nghiệp vụ                                                         |
| Endpoint GitHub cho connector demo                             | `R3`     | Chỉ chặn nhánh connector, không chặn nhánh thủ công                          |
| Mốc thời gian chính thức so với bản đăng ký                    | **GVHD** | Không                                                                        |

### B.12. Thay đổi ở v3.9 — bỏ ủy quyền duyệt và bốn lỗ hổng sau vòng rà soát, nhóm trưởng chốt 15/09/2026

Đợt này **có thay đổi yêu cầu chức năng** (`FR-3.5` viết lại, `FR-3.8` sửa, **`FR-3.15`, `FR-3.16` mới**), nên **đổi số phiên bản**. Mọi dòng là **quyết định của nhóm trưởng**, không phải xác nhận của GVHD. Phát hiện kỹ thuật tra tại `docs.github.com` và `developer.chrome.com` ngày 15/09/2026.

| Mã       | Quyết định                                                                                             | Thay đổi trong BRD                                                                                                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `QĐ-27`  | Không ủy quyền duyệt; nghẽn xử lý bằng nhắc, cảnh báo backlog, Admin chỉ hỗ trợ                        | **`FR-3.5` viết lại** · `FR-3.8` cảnh báo nghẽn · `FR-3.12` ghi chú · `FR-3.13` bỏ ủy quyền · bảng ngoại lệ 5.3 · `FR-8.2` · **`FR-5.11` bảng theo dõi nghẽn** · 5.12.1 C4 · 5.12.3 ApprovalStep và nguyên tắc 1 |
| `QĐ-28a` | GitHub đo sử dụng bằng lịch sử commit và tiện ích; audit log không là nguồn usage                      | 6.3.1 dòng GitHub · **`KL-1`, `KL-2` viết lại** · bảng chiến lược chứng minh lớp 1                                                                                                                               |
| `QĐ-28b` | Demo tiện ích bằng _load unpacked_; force-install là thiết kế triển khai                               | `FR-4.17` ghi chú demo · `GĐ-9` · **`OQ-18` mới**                                                                                                                                                                |
| `QĐ-28c` | Người duyệt chi thay thế khi xung đột lợi ích, cấu hình trước                                          | **`FR-3.15` mới** · ghi chú dưới `SoD-8` · bảng ngoại lệ 5.3 · `FR-8.2`                                                                                                                                          |
| `QĐ-28d` | Escalate chỉ là thông báo; xác định lại người duyệt khi dữ liệu tổ chức hoặc cấu hình vai trò đổi thật | **`FR-3.8` sửa** · **`FR-3.16` mới** · bảng ngoại lệ 5.3 dòng _Approver nghỉ việc_, dòng mới _Approver vắng mặt_                                                                                                 |

| _(không có mã quyết định mới)_ | Ghi hai điểm **chờ mentor/Owner** lên mục 10, không tự chọn | **`OQ-19`** nhánh (a) có bỏ qua Người duyệt chi · **`OQ-20`** Finance ý kiến trước hay sau · nhãn _cấp quyền trên seat đã mua_ ở nhánh (a) của `FR-3.4` |

**Điều v3.9 KHÔNG làm:**

- **Không** đổi `QĐ-02`, `QĐ-13`, `QĐ-22`: approver dự phòng ở gốc vẫn duyệt với tư cách Manager; một Người duyệt chi; Finance ghi ý kiến không chặn.
- **Không** xóa entity `Delegation` khỏi Conceptual ERD — theo `QĐ-27`, rà ở lượt review Conceptual ERD. _(Đã xóa ở v3.10 — `QĐ-29c`.)_
- **Không** thay các phát biểu lịch sử ở changelog v3.7, Phụ lục `B.10`, `B.11` — chúng mô tả đúng quyết định **tại thời điểm đó**.
- **Chưa** đồng bộ User Flows, Business Workflows, Context Diagram, Conceptual ERD `.drawio` — xem khối cuối `QĐ-28`.

### B.13. Thay đổi ở v3.10 — đóng `OQ-19`, `OQ-20` và bỏ `Delegation`, Owner chốt 15/09/2026

Đợt này **có thay đổi yêu cầu chức năng** (`FR-3.14` viết lại; `FR-3.4`, `FR-3.13`, `FR-5.8`, `FR-5.11` sửa), nên **đổi số phiên bản**. Mọi dòng là **quyết định của Owner**, chưa phải xác nhận của mentor hoặc GVHD.

| Mã       | Quyết định                                                                                                                                                 | Thay đổi trong BRD                                                                                                                                                                                                                                    |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `QĐ-29a` | Nhánh (a) không qua Người duyệt chi; tổng hợp seat cấp theo nhánh (a) trong báo cáo quy trình                                                              | `FR-3.4` nhánh (a) · `FR-5.11` · 4.1 dòng Người duyệt chi · 2.3 `PP-5` · **`OQ-19` đóng**                                                                                                                                                             |
| `QĐ-29b` | Người duyệt chi quyết trên snapshot ngân sách, tùy chọn hỏi Finance (SLA không dừng); hệ thống tạo khoản cam kết khi duyệt; Finance ghi nhận ∥ IT cấp phát | **`FR-3.14` viết lại** · `FR-3.4` (b)(c) · `FR-3.13` · `FR-5.8` · `FR-5.11` · 4.1 Finance · `SoD-3`, `SoD-8` · `GĐ-5` · bảng ngoại lệ 5.3 (sửa 2 dòng, thêm 2 dòng) · 5.10 · 5.12.1 C4 · 5.12.3 Request, BudgetCommitment · mục 12 · **`OQ-20` đóng** |
| `QĐ-29c` | Bỏ `Delegation` khỏi Conceptual ERD                                                                                                                        | 5.12.1 C4 · mục 11 số lượng ERD                                                                                                                                                                                                                       |

**Điều v3.10 KHÔNG làm:** không đổi ba nhánh, một Người duyệt chi, `SoD-7`, `INV-16`, `FR-3.15`, `FR-3.16`; không thêm entity; không sửa phát biểu lịch sử ở changelog v3.8, v3.9 và Phụ lục `B.11`, `B.12`.

---

### B.14. Thay đổi ở v3.11 — đóng ba lệch ngữ nghĩa mức High của baseline review, Owner chốt 16/09/2026

Nguồn phát hiện: `Docs/Reviews/astra-complete-baseline-verification-2026-09-15.md` _(kiểm tra độc lập ngày 16/09/2026)_. Đợt này **có thay đổi yêu cầu chức năng** (`FR-5.8a`, `FR-9.7` mới; `INV-14` tách; `INV-18` mới), nên **đổi số phiên bản**. Mọi dòng là **quyết định của Owner**, chưa phải xác nhận của mentor hoặc GVHD.

| Mã       | Finding đóng     | Quyết định                                                                                                  | Thay đổi trong BRD                                                                                      |
| -------- | ---------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `QĐ-30a` | `SA-01`, `DA-01` | Hỏi Tài chính là **luồng phụ độc lập**, không phải nhánh của bước duyệt chi                                 | **Không đổi BRD.** `FR-3.14` (2) đã đúng từ v3.10; đây là sửa **biểu diễn** ở `WF-09`, `WF-10`, `WF-15` |
| `QĐ-30b` | `SA-02`          | Khoản cam kết tồn tại được khi chưa có ngân sách; **back-fill tự động**; ngân sách còn lại được phép âm     | **`FR-5.8a` mới** · **`INV-18` mới** · 5.12.3 dòng `BudgetCommitment` · `INV-16` **giữ nguyên**         |
| `QĐ-30c` | `SA-03`          | Tách `INV-14` thành `INV-14a` (không chồng lấn) và `INV-14b` (bắt buộc tồn tại); chốt `INV-14b` có hiệu lực | **`INV-14` tách hai dòng** · **`FR-9.7` mới** · `OQ-02` · 5.12.1 `ADR-04` · mục 5.12.2 đổi số đếm       |

**Sửa tham chiếu lạc hậu kèm theo — KHÔNG đổi yêu cầu:**

| Finding | Chỗ sửa                            | Nội dung                                                                                                                                                                                                                             |
| ------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `SA-04` | `OQ-08` mục 10                     | Ô này còn ghi **12 tháng** và _6 tháng riêng cho nhóm liên lạc_; cả hai đã bị `QĐ-01` thay thế ở v3.6 — mốc **6 tháng** áp nhất quán cho **mọi ứng dụng**, đúng như bảng mục 7.5 vẫn ghi. Con số 12 tháng đánh dấu **lịch sử**       |
| `SA-06` | Mục 1, dòng _Thời gian phát triển_ | Thôi dẫn **Kế hoạch thực hiện v1.1** — tài liệu đã bị `QĐ-26` loại khỏi baseline. Hai mốc T1–T9 và T12 giữ nguyên làm `RB-1`                                                                                                         |
| `SA-08` | Mục 7.5, khối ⚠️ dưới bảng lưu giữ | **Tách hai vế**: (1) _đã đọc nguyên văn Điều 25 khoản 2 điểm c_ — **xong**; (2) _mức đủ pháp lý của mốc 30 ngày và cơ chế xác nhận chủ động_ — **còn mở**, xem `OQ-16`. Bản v3.6 gộp hai vế nên mâu thuẫn với khối ✅ v3.8 ngay dưới |

**Điều v3.11 KHÔNG làm:** không đổi `QĐ-29b` — ngân sách **không** quay lại thành điều kiện chặn, Finance **không** trở lại đường duyệt; không đổi `INV-16`, `SoD-3`, `SoD-7`, `SoD-8`; không tạo `Budget` giữ chỗ hạn mức 0; không tạo `CostCenter` _"Chưa phân loại"_; không sửa phát biểu lịch sử ở changelog và Phụ lục `B.9` → `B.13`.

---

## PHỤ LỤC C — Đối chiếu với bản đăng ký đồ án _(mục mới ở v3.2)_

**Vì sao cần phụ lục này:** bản đăng ký `SU26SE166_SOFTWARE_LISENSE_MANAGEMENT_HUONGNTC2` đã nộp và có chữ ký giảng viên hướng dẫn — nó là **ràng buộc gốc**. BRD đã phát triển qua nhiều phiên bản kể từ đó, nên cần một bảng nói rõ chỗ nào mở rộng, chỗ nào thu hẹp, và vì sao. Không có bảng này, hội đồng đọc hai tài liệu sẽ thấy khác nhau mà không biết là có chủ đích hay do thiếu sót.

### C.1. Những điểm BRD đã BỔ SUNG so với bản đăng ký

Bổ sung không phải vấn đề, nhưng nên chủ động trình bày là _kết quả phân tích sâu hơn sau khi đăng ký_, không phải phát sinh ngoài kế hoạch.

| #   | Bản đăng ký                                                          | BRD hiện tại                                                                                               | Lý do bổ sung                                                                                                                                                                                       |
| --- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 4 vai trò người dùng                                                 | **6 vai trò** — thêm Super Admin; _(v3.8)_ thêm **Người duyệt chi**                                        | Không tách quản trị hệ thống khỏi quản trị nghiệp vụ thì SoD-1 không tồn tại. _(v3.8)_ Theo góp ý mentor, kế toán không có thẩm quyền quyết chi                                                     |
| 2   | Không nhắc tiền tệ                                                   | Đa tiền tệ là yêu cầu lõi (FR-1.6, ADR-03)                                                                 | Doanh nghiệp Việt Nam mua SaaS bằng ngoại tệ, báo cáo bằng VND                                                                                                                                      |
| 3   | Không nhắc hạn báo hủy                                               | Cảnh báo tính theo hạn chót báo hủy (FR-1.4)                                                               | Cảnh báo theo ngày gia hạn là cảnh báo vô dụng — đúng vào PP-2                                                                                                                                      |
| 4   | Không có chỉ số thành công                                           | 5 chỉ số KPI-1 → KPI-5 (mục 2.4)                                                                           | Mô tả hệ thống làm gì mà không định nghĩa thế nào là thành công                                                                                                                                     |
| 5   | Không có luồng khởi tạo dữ liệu                                      | Phân hệ Khởi tạo dữ liệu ban đầu (mục 5.9, FR-9.x)                                                         | Không trả lời được "ngày đầu triển khai phải làm gì"                                                                                                                                                |
| 6   | Không nhắc quyền chủ thể dữ liệu                                     | Phân hệ Quyền của chủ thể dữ liệu (mục 5.11, FR-10.x)                                                      | Khung pháp lý mới có hiệu lực sau khi đăng ký                                                                                                                                                       |
| 7   | Không nhắc cổng kiểm chứng dự báo                                    | Cổng kiểm chứng sai số (FR-5.7, ADR-09)                                                                    | Là cách hiện thực đúng điều kiện mà bản đăng ký đã đặt ra                                                                                                                                           |
| 8   | Không nhắc mô hình miền nghiệp vụ                                    | Tám ranh giới, mười bảy bất biến, chín máy trạng thái (mục 5.12)                                           | _(bổ sung ở v3.5; số bất biến và máy trạng thái cập nhật ở v3.8)_ Cần thiết để chia module và đặt ràng buộc toàn vẹn đúng chỗ                                                                       |
| 9   | **Ghi "triển khai CASB/endpoint agent riêng nằm ngoài phạm vi MVP"** | **Tiện ích trình duyệt trên thiết bị công ty thuộc phạm vi** (`FR-4.17`); agent **chỉ đặc tả** (`FR-4.19`) | _(v3.8 — `QĐ-20`)_ **Đây là LỆCH so với bản đăng ký**, không chỉ là bổ sung. Làm theo góp ý của GVHD sau buổi review; nhóm **báo lại GVHD ở buổi gần nhất và ghi biên bản**. CASB vẫn ngoài phạm vi |
| 10  | Không nhắc ngân sách cam kết                                         | Khoản cam kết ngân sách, ý kiến ngân sách, Người duyệt chi (5.3, 5.5.2)                                    | _(v3.8 — `QĐ-22`)_ Theo góp ý mentor về quy trình mua trong doanh nghiệp thật                                                                                                                       |

### C.2. Những điểm BRD đã THU HẸP so với bản đăng ký

Đây là phần cần chuẩn bị câu trả lời kỹ nhất, vì nó là cắt bớt so với cam kết.

| #   | Bản đăng ký                                                                                         | BRD hiện tại                                                       | Lý do, và ở đâu trong BRD                                                                                                      |
| --- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Network/CASB log "hỗ trợ khi có"                                                                    | **Ngoài phạm vi hiện thực**, chỉ giữ đặc tả thiết kế               | Ba lý do tại mục 5.6.1: vướng khung pháp lý, không có hạ tầng kiểm chứng, giá trị không tương xứng rủi ro. Ràng buộc RB-5      |
| 2   | Không nêu G5 (hạ gói theo mức dùng) nhưng hàm ý phân tích usage đầy đủ                              | **Ngoài phạm vi** (mục 5.4.1)                                      | Nguồn export không cung cấp dữ liệu chi tiết theo loại thao tác. Ràng buộc RB-3                                                |
| 3   | _"Hồi quy hoặc mô hình chuỗi thời gian chỉ được dùng khi dữ liệu lịch sử đủ và có đánh giá sai số"_ | **Hoãn** — đặc tả giữ nguyên, không hiện thực trong MVP (`FR-5.7`) | _(v3.8 — `QĐ-25`)_ Demo không có ≥ 12 tháng dữ liệu thật; ưu tiên thời gian cho bộ thu thập và luồng duyệt chi. Ràng buộc RB-1 |

### C.3. Điểm được GIỮ nhưng đổi cách phát biểu

| Bản đăng ký                                                                                             | BRD hiện tại                                                     | Nhận xét                                                                                                                               |
| ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| _"Hồi quy hoặc mô hình chuỗi thời gian **chỉ được dùng khi** dữ liệu lịch sử đủ và có đánh giá sai số"_ | Dự báo ba lớp, lớp biến động có cổng kiểm chứng (FR-5.5, FR-5.7) | Bản đăng ký vốn là **câu điều kiện**, không phải lời hứa. BRD hiện thực chính điều kiện đó — trung thành hơn là loại bỏ hoàn toàn      |
| Ngưỡng phát hiện "30/60 ngày"                                                                           | Ba tầng 30–59 / ≥60 / ≥90, cấu hình được (FR-4.12)               | Tinh chỉnh, không phải thay đổi bản chất                                                                                               |
| _"SaaS-Sentry là **nền tảng** web tập trung"_                                                           | **Hệ thống** quản trị nội bộ doanh nghiệp (mục 1)                | Bản đăng ký dùng từ "nền tảng" một lần ở phần Giải pháp, mâu thuẫn với chính tiêu đề "System / Hệ thống" của nó. BRD chốt theo tiêu đề |

### C.4. Lệch nhỏ cần thống nhất

| Hạng mục            | Bản đăng ký             | BRD hiện hành                                    | 📁 Kế hoạch v1.0 _(lịch sử, không dùng làm baseline — `QĐ-26`)_ | Đề xuất                                                                                                                                                                             |
| ------------------- | ----------------------- | ------------------------------------------------ | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Thời gian thực hiện | 01/01/2026 → 30/04/2026 | Học kỳ 15 tuần; cửa sổ phát triển T1–T9 (`RB-1`) | 15 tuần; hội đồng 1 ở T12; T13–T15 dự phòng                     | **Nhóm trưởng quyết ngày 08/09/2026 (`QĐ-07`):** đây là việc hành chính, không ghi vào tài liệu kỹ thuật. Tài liệu tiếp tục dùng số tuần T1–T15. Bản đăng ký giữ nguyên làm lịch sử |

> **Căn cứ hiện hành:** cửa sổ phát triển thật **T1–T9 (9 tuần)**, hạn thật là hội đồng lần 1 ở **T12**, là ràng buộc **`RB-1`** của chính BRD _(mục 1 và mục 9)_; các chỗ viện dẫn ở mục 5.6.1, `ADR-01` và `ADR-11` lấy nguồn từ `RB-1`. **Bản đăng ký không bị sửa** theo BRD: đó là tài liệu đã ký, chênh lệch mốc phải do GVHD phân xử.
>
> 📁 _Lịch sử — không dùng làm baseline (`QĐ-26`): BRD trước v3.6 ghi "3,5 tháng (khoảng 14 tuần)"; con số **9 tuần** vào tài liệu ở v3.6 qua Kế hoạch thực hiện v1.0, tài liệu nay đã bị `QĐ-26` loại khỏi baseline ngày 15/09/2026. Giữ đoạn này để giải thích nguồn gốc con số, không dùng để suy ra lịch; lịch chính thức chờ kế hoạch do GVHD giao._

### C.5. Cách trình bày khi bảo vệ

Ba câu chuẩn bị sẵn cho phần đối chiếu này:

1. **Về phần bổ sung:** _"Sau khi phân tích nghiệp vụ sâu hơn và nhận góp ý sau buổi review, nhóm bổ sung mười hạng mục mà bản đăng ký chưa nêu. Tất cả đều nằm trong cùng phạm vi bài toán, không mở rộng sang lĩnh vực mới. Riêng tiện ích trình duyệt là điểm lệch so với bản đăng ký, được làm theo góp ý của GVHD."_
2. **Về phần thu hẹp:** _"Ba hạng mục được chủ động đưa ra ngoài phạm vi hoặc hoãn, mỗi hạng mục có lý do kỹ thuật hoặc pháp lý cụ thể được ghi trong BRD, kèm hướng phát triển tiếp. Đây là quyết định phạm vi có căn cứ, không phải phần chưa kịp làm."_
3. **Về phần dự báo:** _"Bản đăng ký đặt điều kiện cho việc dùng mô hình thống kê. Nhóm giữ nguyên điều kiện đó dưới dạng đặc tả cổng kiểm chứng; lớp dự báo bằng mô hình được hoãn vì demo chưa có đủ 12 tháng dữ liệu thật để cổng kiểm chứng có ý nghĩa."_ _(sửa ở v3.8)_
