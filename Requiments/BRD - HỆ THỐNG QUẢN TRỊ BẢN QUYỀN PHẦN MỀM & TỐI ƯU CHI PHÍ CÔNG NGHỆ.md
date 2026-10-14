# TÀI LIỆU PHÂN TÍCH YÊU CẦU NGHIỆP VỤ (BRD)

## DỰ ÁN: HỆ THỐNG QUẢN TRỊ BẢN QUYỀN PHẦN MỀM & TỐI ƯU CHI PHÍ CÔNG NGHỆ

**Phiên bản:** 3.36 — 12/10/2026

> **Cách đọc.** Tài liệu chỉ ghi **nội dung đang có hiệu lực**. Mỗi quy tắc kèm mã nguồn quyết định ngắn — `QĐ-xx` ([sổ quyết định](../Decisions/project-decisions.md)), `OI-xx`, `DQ-xx` — để tra lý do. Nội dung đã bị thay, nhật ký sửa từng đợt và các phụ lục thay đổi cũ **không** còn nằm ở đây: xem bảng *Lịch sử phiên bản* bên dưới, sổ quyết định và lịch sử git của repo Docs.
>
> **Thẩm quyền.** Quyết định trong tài liệu là của **nhóm trưởng/Owner**; trừ chỗ ghi rõ, **chưa phải xác nhận** của hội đồng, GVHD hay mentor. **Thứ tự căn cứ:** sổ quyết định (`QĐ`) → BRD hiện hành → sơ đồ và hình trình bày. Sơ đồ, ERD, User Stories hay code chưa cập nhật **không** phủ định quyết định mới.

### Lịch sử phiên bản

| Phiên bản | Ngày | Thay đổi chính | Nguồn |
| --- | --- | --- | --- |
| 1.0 | — | BRD ban đầu | — |
| 2.0 | — | Single-tenant; Super Admin và phân tách trách nhiệm; Shadow IT và phê duyệt chậm; tách Contract/Subscription/Invoice; mô hình giá; cảnh báo theo hạn chót báo hủy; đa tiền tệ; quan hệ tổ chức có lịch sử | ADR-01 → ADR-08 |
| 3.0 | — | Định nghĩa thành công (KPI-1 → KPI-5); khởi tạo dữ liệu (FR-9); dự báo ba lớp có cổng kiểm chứng; giải trình discovery ngoài phạm vi | ADR-09 |
| 3.1 – 3.5 | 08/2026 | Khung pháp lý Luật 91/2025 + NĐ 356/2025 (7.7, 5.11); hồ sơ tổ chức, giả định, ràng buộc, Business Owner; chính sách lưu giữ; ADR-10; NestJS (ADR-11); hợp nhất Domain Spec vào 5.12 | ADR-10, ADR-11 |
| 3.6 – 3.7 | 08–09/09/2026 | Thận trọng dữ liệu cho mọi ứng dụng; approver dự phòng; chờ có kiểm soát khi hết người duyệt; React Router SPA (ADR-12) | `QĐ-01` → `QĐ-13` |
| 3.8 – 3.11 | 14–16/09/2026 | Bộ thu thập trên thiết bị (ADR-13); Người duyệt chi; Finance kiểm soát ngân sách; khoản cam kết; năm nhóm báo cáo; bỏ ủy quyền duyệt; nhánh (a) không qua Người duyệt chi | `QĐ-20` → `QĐ-30` |
| 3.12 – 3.13 | 21–25/09/2026 | Quyết định chung với mentor/GVHD (`DQ-xx`); quyết định phiên Use Case (`OI-xx`), yêu cầu chỉnh sửa dữ liệu cá nhân | `DQ-03` → `DQ-07`, `OI-01` → `OI-17` |
| 3.14 – 3.19 | 28/09–02/10/2026 | Phương pháp thu thập bằng chứng `MF-3`/`MF-6`; một tính năng AI; *Đối soát chi phí phần mềm*; hóa đơn là khoản chi đã ghi nhận; GitHub đọc theo nhánh | `QĐ-31` → `QĐ-38` |
| 3.20 – 3.24 | 02–05/10/2026 | Tài khoản đăng nhập; một Super Admin; xác thực nội bộ; khôi phục; sửa/hủy bàn giao | `QĐ-39` → `QĐ-48` |
| 3.25 | 05/10/2026 | Ba loại đối tượng quản lý (kể cả phần mềm nội bộ); bộ năm main flow; hai tính năng AI | `QĐ-49`, `QĐ-50` |
| 3.26 | 08/10/2026 | Review 1 của hội đồng: tổ chức theo phòng ban (thay `QĐ-23`); ma trận trách nhiệm; biểu mẫu; kiểu cấp, kho khóa, tài khoản công ty, tài khoản dùng chung, điều khoản nhà cung cấp; ghi nhận thuế; dashboard và cảnh báo | `QĐ-51` → `QĐ-57` |
| 3.27 | 08/10/2026 | Một người làm trưởng tối đa một phòng; phạm vi IT Admin; cập nhật bộ công cụ chuẩn; ngân sách so trên tổng chi gồm thuế; chính sách thiết bị công ty (`FR-4.21`); **dọn tài liệu chỉ còn nội dung hiện hành** | `QĐ-58` |
| 3.28 | 08/10/2026 | BRD tập trung vào nghiệp vụ: chi tiết bộ thu thập, ma trận nhà cung cấp và chiến lược chứng minh chuyển sang tệp nghiên cứu tool & vendor (bổ sung sau); câu hỏi pháp lý chuyển *hoãn có điều kiện*; câu hỏi kỹ thuật chuyển giai đoạn Tools | `QĐ-59` |
| 3.29 | 08/10/2026 | Kiểm chứng thuế trên văn bản gốc (`OQ-22` đóng): ngân sách so trên **chi phí thực chịu**, hồ sơ thuế chia theo **ai nộp**; ma trận phân loại dữ liệu cá nhân (7.7.2); mẫu thông báo và mẫu `BM-06` (Phụ lục D); bổ sung các điểm lệch so với bản đăng ký (Phụ lục C.0) | `QĐ-60` |
| 3.30 | 09/10/2026 | Ứng dụng mobile native (bốn tác vụ, không push/offline) và hai tính năng AI là phạm vi cam kết; điểm lệch L-5, L-6; chốt các điểm mở của bộ sơ đồ (tạo thay, sửa thuê bao, phòng thiếu trưởng phòng, nghỉ đột ngột, bàn giao khi thu hồi, gia hạn muộn, tác vụ cấp phát lỗi, ngân sách giữa kỳ, phần mềm nội bộ ngoài MVP); `OQ-26`; tên vai *Spending Approver*; link ma trận nhà cung cấp; mã dự án/nhóm; ngoại lệ ngôn ngữ cho tài liệu nộp trường | `QĐ-61`, `QĐ-62` |
| 3.31 | 10/10/2026 | Bổ sung phạm vi bàn giao dữ liệu của `FR-2.12`: bốn ca thu hồi do IT thực hiện (hết hạn quyền, giảm/hủy thuê bao, không hợp thức hóa, thực thi lại sau sai lệch) — IT Admin ghi xác nhận; giữ nguyên người xác nhận ở các ca khác. Không đổi mục khác | `QĐ-63` |
| 3.32 | 10/10/2026 | Ca chồng lấn của `FR-2.12`: seat vừa được trưởng phòng quyết *Thu hồi* (ghost seat) vừa nằm trong phần vượt khi giảm thuê bao — một tác vụ thu hồi, trưởng phòng đó xác nhận bàn giao. Không đổi mục khác | `QĐ-64` |
| 3.33 | 11/10/2026 | Đồng bộ câu chữ với quyết định đã có, không thêm quy tắc mới (rà mục I.1 của User Stories v0.15): `FR-2.8` thêm Employee vào người nhận nhắc quyền có thời hạn sắp hết (`QĐ-57a`, khớp bảng cảnh báo `FR-5.14`); bảng 5.4.1 ghi `G1`/`G2` là tất định, hiển thị *Xác định từ dữ liệu nội bộ*, không xếp mức (`QĐ-35b`, `FR-4.14`); vòng đời `Request` ở 5.12.3 thêm kết cục *Đóng — phần mềm miễn phí bên ngoài* (`QĐ-49h`) và *Thất bại* khi IT đóng tác vụ (`QĐ-62i`, `FR-2.5`) | `QĐ-35b`, `QĐ-49h`, `QĐ-57a`, `QĐ-62i` |
| 3.34 | 11/10/2026 | **Owner trả lời các câu hỏi chặn AC của User Stories v0.15 (`QĐ-66`):** trưởng phòng là thành viên phòng, ngừng/gộp phòng, danh mục chức vụ, hoàn tất bước 1, ngày hiệu lực điều chuyển; ngừng dùng khoản vĩnh viễn, sức chứa `K4`, sao kê do Finance tải; tài khoản dùng chung (xin mới trên gói cấm chia sẻ, thêm thành viên, thời điểm thay người chịu trách nhiệm); yêu cầu theo nhóm có chi phí; trưởng phòng tự gửi khi chưa có Người duyệt chi; lý do từ chối; xác nhận bàn giao (phạm vi `QĐ-62f`, ca chồng lấn, thuê bao hết hạn); loại trừ `G3`/`G4` cho trưởng phòng; khuyến nghị khi điều chuyển, hạn quyết định; tiết kiệm thực hiện; chọn seat khi giảm; phí thẻ/tỷ giá, dòng *Chưa phân bổ*, seat trống, không phát hành lại báo cáo, phạm vi lời diễn giải; thiết bị; hợp thức hóa (số seat, lưu ý thu hồi, kết cục `BM-07`); gom danh mục cảnh báo `FR-5.14`; giới hạn số cài đặt của gói `K4` | `QĐ-66` |
| 3.35 | 12/10/2026 | **Làm rõ `FR-6.9`/`QĐ-66ag` với `SoD-7` (không đổi lựa chọn Owner):** không thiết kế người thay thế riêng cho quyết định hợp thức hóa **không** có nghĩa được tự duyệt; `SoD-7`/`FR-3.15` viết cho Request, nên hành vi khi Người duyệt chi là người dùng/trả của hồ sơ là *ca chưa hỗ trợ*. Đồng bộ bảng tài liệu liên quan (mục 11) theo phiên bản thực tế. Không đổi lựa chọn của Owner, không thêm quy tắc nghiệp vụ mới | `QĐ-66ag` |
| **3.36** | **12/10/2026** | **Owner chốt `QĐ-67`:** khởi tạo cài đặt tối thiểu ngoài ứng dụng — `FR-9.8` mới, là ngoại lệ có kiểm soát của `FR-3.1`, `FR-3.17`, `FR-9.2`, `FR-8.6`, `FR-8.11(a)` cho dữ liệu khởi tạo và tài khoản Super Admin đầu tiên; Employee của Finance vào bằng import; IT Admin **nhập tay** từng nhân viên với cùng kiểm tra như một dòng import (`FR-2.1`); *Finance một người* tính theo grant chưa thu hồi, cho phép tạm thời không có Finance (bảng vai trò 4.1). Không đổi mục khác | `QĐ-67` |

---

## 1. THÔNG TIN CHUNG DỰ ÁN

| Hạng mục             | Nội dung |
| -------------------- | -------- |
| Tên dự án            | SaaS-Sentry — Hệ thống quản trị bản quyền phần mềm và tối ưu chi phí công nghệ |
| Tên tiếng Anh        | Software License Management & Optimization System |
| Loại sản phẩm        | **Hệ thống quản trị nội bộ doanh nghiệp**, thuộc lĩnh vực quản trị SaaS và quản lý chi phí công nghệ |
| Môi trường chạy      | **Ứng dụng web** (trình duyệt máy tính để bàn, giao diện co giãn theo màn hình) — kênh đầy đủ; **ứng dụng mobile native** cho bốn tác vụ của Employee, trưởng phòng và Người duyệt chi, không push, không offline (`QĐ-61a`–`QĐ-61c`) |
| Mã dự án / mã nhóm   | `FA26SE174` / `GFA26SE125` — bản đăng ký cũ mang mã `SU26SE166` (`QĐ-62r`) |
| Mô hình triển khai   | Cài đặt riêng cho từng doanh nghiệp (dedicated instance) — xem ADR-01 |
| Thời gian phát triển | Học kỳ 15 tuần; **cửa sổ phát triển thật T1–T9**, hạn thật là hội đồng lần 1 ở **T12** (`RB-1`). Lịch chính thức chờ kế hoạch do GVHD giao (`QĐ-26`) |
| Quy mô nhân sự       | 5 thành viên (Software Engineers) |

> **Định vị:** SaaS-Sentry là **hệ thống cài riêng cho một doanh nghiệp**, khớp với bản đăng ký đồ án đã có chữ ký GVHD — không phải nền tảng bán cho nhiều khách hàng (đăng ký tự phục vụ, quản trị xuyên tổ chức và mô hình tính phí đều ngoài phạm vi theo ADR-01). Muốn định vị lại thành nền tảng thì phải sửa ADR-01 trước.

---

## 2. BỐI CẢNH VÀ NỖI ĐAU NGHIỆP VỤ (PAIN POINTS)

### 2.1. Thống kê thị trường & Bối cảnh Việt Nam

Việc doanh nghiệp cần quản trị SaaS tập trung là một vấn đề có thật. Microsoft định nghĩa Shadow IT là các ứng dụng/dịch vụ được sử dụng mà bộ phận CNTT không biết hoặc chưa phê duyệt; các rủi ro đi kèm gồm thất thoát dữ liệu, tuân thủ, bảo mật và trùng lặp license gây lãng phí ngân sách. [Microsoft Learn – Discover applications and Shadow IT](https://learn.microsoft.com/en-us/entra/global-secure-access/tutorial-internet-access-application-discovery)

SaaS Management Index 2025 của Zylo phân tích hơn 40 triệu license và 40 tỷ USD chi tiêu SaaS trong tập dữ liệu của họ; báo cáo nêu mức lãng phí license chưa dùng trung bình 21 triệu USD/năm. Đây là benchmark của một nhà cung cấp SaaS-management, chủ yếu phản ánh tổ chức lớn quốc tế, nên chỉ dùng để minh họa xu hướng và **không suy diễn trực tiếp cho doanh nghiệp Việt Nam hoặc SME**. [Zylo – 2025 SaaS Management Index](https://zylo.com/news/2025-saas-management-index)

Tại Việt Nam, việc ứng dụng cloud tiếp tục là định hướng cấp quốc gia: Quyết định 1121/QĐ-TTg phê duyệt Chương trình hành động quốc gia phát triển và chuyển đổi sang sử dụng nền tảng điện toán đám mây giai đoạn 2025–2030. Điều này củng cố tính phù hợp của bài toán quản trị SaaS, nhưng không tự nó chứng minh mức chi tiêu hay tỷ lệ lãng phí SaaS của từng doanh nghiệp. [Cổng Thông tin điện tử Chính phủ](https://chinhphu.vn/?docid=213903&pageid=27160)

Trong phạm vi dự án, bối cảnh mục tiêu là các công ty công nghệ, software outsourcing, công ty làm sản phẩm và doanh nghiệp đang chuyển đổi số có cấp máy cho nhân viên, nơi việc mua và sử dụng Jira, Figma, Slack, GitHub, Zoom hoặc Microsoft 365 có thể phân tán theo phòng ban. Hệ thống tập trung vào việc tạo minh bạch dữ liệu và quy trình kiểm soát; không khẳng định một tỷ lệ lãng phí cố định nếu chưa có dữ liệu thực tế của khách hàng.

### 2.2. Các nỗi đau cốt lõi (Core Pain Points)

**PP-1 — Lãng phí "License ảo" (Ghost Seats).** Doanh nghiệp mua gói 100 tài khoản Figma nhưng thực tế chỉ có 70 nhà thiết kế đang hoạt động. 30 tài khoản còn lại vẫn bị tính tiền đều đặn. Lãng phí này có nhiều dạng khác nhau với mức độ khó phát hiện khác nhau — xem bảng phân loại tại mục 5.4.

**PP-2 — Quên hủy dịch vụ (Auto-Renewal Trap).** Dự án ngắn hạn kết thúc nhưng thẻ tín dụng công ty vẫn bị trừ tiền tự động do không có ai chịu trách nhiệm theo dõi và hủy gói. Nghiêm trọng hơn: nhiều hợp đồng yêu cầu báo hủy trước 30–60 ngày, nên khi phát hiện thì đã quá hạn báo hủy và buộc phải trả thêm một chu kỳ.

**PP-3 — Bất đối xứng thông tin giữa Tài chính và IT.** Bộ phận kế toán chỉ thấy các khoản trừ tiền trên sao kê ngân hàng mà không biết phần mềm đó do ai dùng, dùng vào việc gì, dẫn đến khó khăn trong phân bổ chi phí nội bộ (Cost Center allocation).

**PP-4 — Mua sắm phần mềm phân tán ngoài tầm kiểm soát của IT (Shadow IT).** Phòng ban tự đăng ký công cụ bằng thẻ tín dụng cá nhân hoặc thẻ công ty, thường vì quy trình mua sắm chính thức mất quá nhiều thời gian. Hệ quả:

- IT không biết dữ liệu công ty đang nằm ở đâu để bảo vệ hoặc thu hồi khi nhân viên nghỉ việc
- Finance thấy khoản chi trên sao kê nhưng không xác định được thuộc phần mềm nào
- Công ty có thể trả tiền cho hai công cụ trùng chức năng ở hai phòng ban khác nhau
- Sự phổ biến của công cụ AI tạo sinh làm vấn đề nghiêm trọng hơn, vì dữ liệu nội bộ có thể được đưa vào dịch vụ bên thứ ba mà không qua đánh giá nào

> **Cách phát biểu mục tiêu:** hệ thống **không** cam kết "giảm Shadow IT" theo nghĩa giảm số lượng ứng dụng, vì hệ thống không chặn được ứng dụng và không phát hiện được 100%. Mục tiêu chính xác là **đưa Shadow IT vào diện quản trị** — chuyển từ trạng thái "không ai biết" sang trạng thái "có bằng chứng, có người chịu trách nhiệm, có quyết định được ghi nhận". Chỉ số đo là **KPI-1** tại mục 2.4.

**PP-5 — Quy trình cấp phát chậm là nguyên nhân gốc của Shadow IT.** Nhân viên đi đường vòng vì đường chính thức quá chậm. Vì vậy phân hệ Approval Workflow (mục 5.3) không phải một module độc lập nằm cạnh phân hệ Discovery (mục 5.6) — nó là **biện pháp xử lý nguyên nhân**, còn Discovery chỉ xử lý triệu chứng. Hệ thống phải đo được thời gian trung bình từ lúc gửi yêu cầu tới lúc có tài khoản, và có SLA cho từng bước phê duyệt.

### 2.3. Bảng truy vết Pain Point ↔ Yêu cầu chức năng

| Pain point                  | Yêu cầu chức năng xử lý | Chỉ số đo |
| --------------------------- | ----------------------- | --------- |
| PP-1 Ghost Seats            | FR-4.1 → FR-4.21, FR-1.9, FR-2.3, FR-2.4, FR-2.10, FR-2.12, FR-3.10 | KPI-3 |
| PP-2 Auto-Renewal Trap      | FR-1.1, FR-1.3, FR-1.4, FR-1.10 | KPI-4 |
| PP-3 Bất đối xứng thông tin | FR-3.13, FR-3.14, FR-3.17, FR-5.1, FR-5.2, FR-5.4, FR-5.8 → FR-5.14 | KPI-1 |
| PP-4 Shadow IT              | FR-6.1 → FR-6.10, FR-1.10, FR-2.9, FR-3.19 | KPI-1 |
| PP-5 Quy trình chậm         | FR-3.4, FR-3.8, FR-3.9, FR-3.13, FR-3.18, FR-5.11, FR-11.1 | KPI-2 |

### 2.4. Định nghĩa thành công

Năm chỉ số dưới đây đều tính được từ chính dữ liệu hệ thống, không cần khảo sát bên ngoài.

| Mã        | Chỉ số                                               | Công thức | Xử lý pain point |
| --------- | ---------------------------------------------------- | --------- | ---------------- |
| **KPI-1** | Tỷ lệ chi tiêu nằm trong danh mục đã phê duyệt       | Chi tiêu khớp CatalogEntry ÷ tổng chi tiêu quan sát được | PP-3, PP-4 |
| **KPI-2** | Thời gian trung bình từ gửi yêu cầu tới có tài khoản | Trung vị của `(assignment.Active − request.submitted)`, tách theo từng bước duyệt | PP-5 |
| **KPI-3** | Tỷ lệ seat đang hoạt động trên tổng seat đã mua      | Seat có hoạt động trong 30 ngày ÷ `purchased_quantity`, **chỉ tính gói per-seat**; slot `pending` **vẫn nằm trong mẫu số** vì đang chiếm sức chứa (`INV-01`; `DQ-05`, `KPI3-DENOM`) | PP-1 |
| **KPI-4** | Số thuê bao gia hạn ngoài ý muốn                     | Đếm subscription **có bật tự gia hạn** đã **quá hạn chót báo hủy** mà không có quyết định được ghi nhận. Quá SLA duyệt **không** tính; thuê bao **không** bật tự gia hạn thì **hết hạn**, không phải sự cố (`DQ-07`) | PP-2 |
| **KPI-5** | Tỷ lệ khuyến nghị bị bác bỏ                          | `(Dismissed + Superseded) ÷ tổng khuyến nghị sinh ra` | Chất lượng hệ thống |

**Yêu cầu kèm theo:**

- **FR-0.1:** Hệ thống tính và hiển thị được cả năm chỉ số trên, kèm khoảng thời gian tính và thời điểm cập nhật.
- **FR-0.2:** KPI-2 phải tách được theo từng bước phê duyệt, không chỉ tổng thời gian — nếu không thì biết chậm mà không biết chậm ở đâu.
- **FR-0.3:** KPI-5 hiển thị trên màn hình quản trị hệ thống, không hiển thị cho Manager.
- **FR-0.4:** Kèm năm KPI, hệ thống tính **ba chỉ số phụ** — không phải KPI mới, không đặt mục tiêu: **chi phí trên mỗi người dùng có hoạt động** *(chỉ gói per-seat và ứng dụng có nguồn phát hiện được G3/G4; không đủ điều kiện thì ẩn kèm lý do)*, **tỷ lệ bước phê duyệt quá SLA**, và **trạng thái bộ thu thập** *(số thiết bị đã đăng ký, đã xác nhận, gửi dữ liệu gần nhất)*. Cách trình bày theo năm nhóm báo cáo tại `FR-5.9` → `FR-5.12` (`QĐ-24`).

> **Về KPI-5 — chỉ số đo chất lượng của chính hệ thống.** Tỷ lệ khuyến nghị bị Manager bác bỏ hoặc bị dữ liệu mới phủ định là thước đo trực tiếp cho mức độ báo động giả. Tỷ lệ cao nghĩa là ngưỡng đang quá nhạy, hoặc dữ liệu import quá thưa, hoặc tầng ánh xạ danh tính đang sai. Một hệ thống phát hiện lãng phí mà **tự đo được mức độ mình sai** là điểm khác biệt đáng nhấn: mục tiêu không phải "tìm ra nhiều" mà là "tìm ra đúng".

**Về việc đặt con số mục tiêu** (`OQ-10`): dự án **không** đặt con số mục tiêu cho năm chỉ số trên. Lý do: chúng đo hiệu quả của **tổ chức sử dụng hệ thống**, mà tổ chức trong phạm vi demo là mô phỏng — đặt mục tiêu cho một tổ chức không có thật là đặt một con số không kiểm chứng được.

Thay vào đó, dự án cam kết hai thứ **kiểm chứng được thật**:

**(a) Hệ thống tính đúng năm chỉ số.** Kiểm chứng bằng bộ dữ liệu mô phỏng có đáp án biết trước, đối chiếu kết quả hệ thống với đáp án tính tay.

**(b) Tiêu chí nghiệm thu cho chính rule engine** — đây mới là con số dự án chịu trách nhiệm:

| Mã   | Tiêu chí | Ngưỡng đạt | Vì sao đo được |
| ---- | -------- | ---------- | -------------- |
| TC-1 | Phát hiện đúng toàn bộ trường hợp nhóm G1 và G2 trong bộ dữ liệu kiểm thử | **100%** | Hai nhóm này tất định, chỉ dùng dữ liệu nội bộ |
| TC-2 | **Số báo động giả trên các hồ sơ đặt bẫy** — nhân viên mới vào, đang nghỉ dài, tài khoản dịch vụ, định danh chưa khớp, assignment ngoài cửa sổ dữ liệu | **Bằng 0** | Bộ dữ liệu mô phỏng cố tình cài sẵn các hồ sơ này |
| TC-3 | Mọi khuyến nghị sinh ra đều truy được về đầy đủ căn cứ đã chụp lại | **100%** | Kiểm tra trường bằng chứng của từng khuyến nghị |
| TC-4 | Không có khuyến nghị nào được sinh khi nguồn dữ liệu quá hạn hoặc chưa khớp danh tính | **100%** | Kiểm tra tám cổng lọc của FR-4.9 |

> **TC-2 là tiêu chí quan trọng nhất và cũng là điểm nên nhấn khi bảo vệ.** Chứng minh hệ thống **không báo động giả** có giá trị hơn chứng minh nó tìm ra nhiều: một hệ thống báo động giả sẽ bị người quản lý bỏ qua sau hai tuần, dù nó chạy đúng về mặt kỹ thuật. Đây cũng là lý do bộ dữ liệu mô phỏng bắt buộc phải chứa sẵn các hồ sơ cần loại trừ (mục 6.3).

---

## 3. PHẠM VI DỰ ÁN (PROJECT SCOPE)

### 3.1. Thuộc phạm vi phát triển (In-Scope)

| Phân hệ | Nội dung |
| ------- | -------- |
| **Khởi tạo dữ liệu ban đầu** | Đưa doanh nghiệp từ trạng thái chưa có dữ liệu tới trạng thái hệ thống tạo được giá trị |
| Danh mục phần mềm | Quản lý tập trung ba loại đối tượng: **SaaS có trả phí**, **phần mềm thương mại có bản quyền** (không mặc định là thuê bao — có thể là license vĩnh viễn) và **phần mềm/dịch vụ nội bộ**. Phần mềm/SaaS miễn phí bên ngoài **không** phải đối tượng quản lý (`QĐ-49a`) |
| **Phần mềm/dịch vụ nội bộ** | Danh mục, Business Owner (người phụ trách), quyền sử dụng, chi phí đã ghi nhận (nếu có). IT cấp/thu hồi **ngoài hệ thống** rồi xác nhận và lưu bằng chứng (kênh thủ công). **Không** bắt buộc hợp đồng mua, hóa đơn license hay paid seat; **không** có API cấp/thu hồi riêng, **không** quản trị vận hành máy chủ (`QĐ-49b`) |
| Quản lý Hợp đồng & Thuê bao | Chu kỳ thanh toán, ngày hết hạn, hạn chót báo hủy, nhắc gia hạn chủ động |
| **Điều khoản nhà cung cấp** | Lưu điều khoản và checklist sáu điểm theo gói, nhắc rà soát, cảnh báo vi phạm (`FR-1.10`) |
| Phân bổ License/Seat | Gán quyền sử dụng cho từng nhân viên, theo dõi trạng thái seat; kiểu cấp K1–K5 theo gói, **kho khóa bản quyền**, chỉ tài khoản công ty, tài khoản dùng chung và yêu cầu theo nhóm (`QĐ-54`) |
| Quản lý tổ chức & Luồng phê duyệt | **Phòng ban** (trưởng phòng, Cost Center `Unit`, IT Admin phụ trách, dự án mô tả, bộ công cụ chuẩn) và chức vụ; định tuyến phê duyệt theo nhu cầu và tác động chi phí; Người duyệt chi; ma trận trách nhiệm theo loại yêu cầu (mục 4.6) (`QĐ-52`) |
| **Hồ sơ và biểu mẫu** | Danh mục hồ sơ `BM-01` → `BM-08` theo từng giai đoạn (mục 5.13) |
| Thực thi cấp phát (Provisioning) | Cấp/thu hồi qua connector được phê duyệt hoặc tác vụ thủ công có theo dõi; đối soát sai lệch với nhà cung cấp |
| Phân tích hiệu suất sử dụng | Import file log hoạt động, xác định Last Active Date, khuyến nghị cắt giảm |
| **Bộ thu thập trên thiết bị công ty** | Nguồn bằng chứng sử dụng đã lọc tại nguồn trên **máy công ty cấp**; đăng ký thiết bị và xác nhận của nhân viên (`FR-4.18`); chính sách thiết bị công ty (`FR-4.21`); nguyên tắc bắt buộc ở `ADR-13`. **Loại bộ thu thập cụ thể** — tiện ích trình duyệt, Desktop Agent phiên người dùng, OpenTelemetry của client AI (`FR-4.17`, `FR-4.19`, `FR-4.20`) — và mức hiện thực **chốt lại ở giai đoạn Tools** (`QĐ-59a`); giả định hiện tại: tiện ích trong MVP, agent và OTel mức demo (`QĐ-20`, `QĐ-31b`) |
| Dashboard Tài chính | Chi phí theo tháng/quý/năm, phân bổ theo Cost Center và phòng ban; Budget vs Actual vs **khoản cam kết** trên **chi phí thực chịu**; báo cáo tiết kiệm; **ghi nhận thuế trên hóa đơn, không tính thuế** (`QĐ-55a`, `QĐ-60a`). Dashboard theo vai trò và danh mục cảnh báo (mục 5.5.4) |
| Phát hiện SaaS ngoài danh mục | Đối chiếu danh mục đã duyệt với **dữ liệu tài chính CSV (sao kê/hóa đơn)**, đối soát với dữ liệu chi và phê duyệt đã có (`QĐ-31a`) |
| Quản trị hệ thống & Audit | Quản lý người dùng, vai trò, quyền, cấu hình ngưỡng, nhật ký kiểm toán |
| **Đo lường hiệu quả** | Tính và hiển thị năm chỉ số tại mục 2.4; báo cáo hiệu suất và chất lượng `FR-5.10`, `FR-5.12` |
| **Quyền của chủ thể dữ liệu** | Nhân viên xem và yêu cầu xuất dữ liệu của chính mình; xóa tự động theo chính sách lưu giữ |
| **Ứng dụng mobile** | Ứng dụng **native** cho bốn tác vụ (`QĐ-61b`): Employee xem phần mềm và yêu cầu của mình, gửi hoặc rút yêu cầu đơn giản — *yêu cầu đơn giản* là cấp mới phần mềm **đã có trong danh mục** (`QĐ-66o`); trưởng phòng duyệt **bước nhu cầu** của phòng mình; Người duyệt chi duyệt chi trên snapshot ngân sách chỉ đọc, và duyệt bước nhu cầu của yêu cầu do trưởng phòng tự gửi (`QĐ-61h`); hộp thông báo trong ứng dụng. Cùng nghiệp vụ, phân quyền và `SoD` với web, không thêm vai trò; mọi tác vụ khác chỉ trên web |
| **AI hỗ trợ** | Hai tính năng **cam kết** (`QĐ-49e`, `QĐ-61e`): Manager tóm tắt các request đang chờ mình duyệt; Finance bản nháp diễn giải báo cáo chi phí từ số liệu backend. AI chỉ hỗ trợ, quy trình chạy đủ khi AI tắt (mục 6.4) |

### 3.2. Ngoài phạm vi phát triển (Out-of-Scope)

**Nhóm nền tảng:**
- **Ứng dụng mobile chỉ gồm bốn tác vụ của `QĐ-61b`:** **không** push notification, **không** chế độ offline, **không** biometrics, **không** tải tệp, **không** chức năng của IT Admin, Finance, Super Admin trên mobile (`QĐ-61c`, `QĐ-61d`). Ứng dụng mobile **không** theo dõi usage trên điện thoại — bộ thu thập không mở rộng sang điện thoại
- Không tích hợp trực tiếp phần cứng hoặc hệ thống mạng
- Không tích hợp cổng thanh toán để tự động hủy/mua gói từ nhà cung cấp
- Không tự triển khai CASB, firewall hoặc proxy cho khách hàng
- Desktop Agent chỉ ở **mức demo** (`QĐ-31b`): Windows Service, installer/updater phân phối diện rộng, ký số, phát hiện phần mềm ngoài danh sách cho phép hay phần mềm crack **ngoài phạm vi**
- **Không hiện thực nguồn (b) export IdP và (c) tiện ích trình duyệt cho phát hiện ngoài danh mục** — giữ đặc tả, chuyển giai đoạn sau (`QĐ-31a`)
- **Tiện ích trình duyệt thuộc phạm vi** (`FR-4.17`), nhưng **không** thu nhật ký truy cập web đầy đủ: chỉ giữ tên miền nằm trong danh sách cho phép, lọc ngay trên máy
- Không tự động chặn ứng dụng hoặc thu hồi quyền chỉ dựa trên cảnh báo
- **Không chặn kỹ thuật** việc dùng dịch vụ của công ty trên máy cá nhân — chính sách thiết bị (`FR-4.21`) là quy định nội bộ, vi phạm do doanh nghiệp xử lý

**Nhóm đối tượng quản lý và AI** (`QĐ-49`):
- **Phần mềm/SaaS miễn phí bên ngoài không phải đối tượng quản lý** (`QĐ-49a`). Câu này **không** cấm dùng thư viện mã nguồn mở, API miễn phí hay gói Free/Trial để **kiểm thử/demo** của đồ án. Yêu cầu công cụ miễn phí bên ngoài được IT đóng với lý do ngoài phạm vi quản lý (`QĐ-49h`, `FR-3.4`)
- **Phần mềm/dịch vụ nội bộ:** **không** có API cấp/thu hồi riêng; **không** quản trị vận hành máy chủ; **không** bắt buộc hợp đồng, hóa đơn license hay paid seat (`QĐ-49b`); nguồn usage, nhận diện `G2`–`G4` và cách ghi tiết kiệm cho phần mềm nội bộ **ngoài MVP** (`QĐ-62o`)
- **Không có main flow rà soát/thanh lý dịch vụ nội bộ** ở đợt này (`QĐ-49d`)
- **AI:** phạm vi AI **cam kết** là đúng **hai** tính năng của `QĐ-49e` (Manager tóm tắt request đang chờ; Finance bản nháp diễn giải báo cáo chi phí) — `QĐ-61e`; `US-15-01` giữ trạng thái đang ẩn. AI chỉ hỗ trợ, quy trình chạy đủ khi AI tắt. Trợ lý soạn yêu cầu, tóm tắt gia hạn **không** được chọn. Các tính năng AI khác trong `AI_FEATURES_PLAN.md` **không** thuộc MVP. **Vẫn ngoài phạm vi:** AI Gateway; hỏi đáp hợp đồng (RAG — mở rộng, hoãn); dùng đăng nhập subscription làm backend AI
- **Quản lý chi phí không mở rộng sang ngân hàng/kế toán** — không thanh toán, sổ cái, công nợ phải trả, ERP (`QĐ-34`). **Thuế:** hệ thống **ghi nhận** thuế đúng như chứng từ và hiển thị thuế ước tính; **không** phân loại thuế, **không** tính thuế phải nộp, **không** kê khai/nộp thuế, **không** làm thủ tục khấu trừ GTGT đầu vào — chỉ lưu cờ *được khấu trừ* do Finance đánh dấu theo chứng từ (`QĐ-55a`, `QĐ-60a`)

**Nhóm tổ chức, phân quyền và tài khoản** (`QĐ-52` → `QĐ-57`):
- Tổ chức **duyệt nhiều cấp** (phòng → đơn vị cấp trên → …, ví dụ cơ quan nhà nước) — phòng ban là **một cấp phẳng** dưới công ty
- **Quản lý dự án** như đối tượng có thành viên, ngân sách hay bước duyệt — dự án chỉ là thông tin mô tả trong hồ sơ phòng
- **Chữ ký số/CA** cho phê duyệt — "ký duyệt" là bản ghi phê duyệt điện tử kèm Audit Trail (`QĐ-53a`)
- Cấp quyền trả phí vào **tài khoản cá nhân**; **lưu mật khẩu** của tài khoản dùng chung (`QĐ-54c`, `QĐ-54d`)
- **Hạn mức, quota, rate limit theo phòng ban** (`QĐ-57c`)
- Lưu **địa chỉ IP**, đăng ký hay theo dõi **máy cá nhân** (`QĐ-57b`)
- Tự động hóa cấp phát qua **SSO/SCIM gói Enterprise** (kiểu cấp K3) — chỉ đặc tả (`RB-4`)

**Nhóm mô hình triển khai** (ADR-01):
- Không có đăng ký tự phục vụ (tenant self-signup) và luồng onboarding khách hàng mới
- Không có trang quản trị cấp platform (xuyên tổ chức)
- Không có cấu hình giao diện/thương hiệu riêng theo từng khách hàng
- Không triển khai Row-Level Security và vòng lặp đa tổ chức trong background job
- Không xây dựng mô hình thuê bao/tính phí của chính SaaS-Sentry

**Nhóm thu hẹp có chủ đích** (lý do ở mục 9):
- Không triển khai khuyến nghị hạ gói dựa trên mức độ sử dụng chi tiết (nhóm G5, mục 5.4)
- **Không triển khai discovery từ log web/firewall/proxy/CASB đầy đủ** — giải trình tại mục 5.6.1; tiện ích trình duyệt lọc theo danh sách cho phép **không** thuộc dòng này
- Không tích hợp hệ thống nhân sự (HRM) để lấy dữ liệu nghỉ phép
- **Không triển khai lớp L2 của dự báo chi phí trong MVP** — `FR-5.7` giữ làm đặc tả thiết kế (`QĐ-25`)
- Không có ma trận nhiều ngưỡng tiền cho thẩm quyền chi — **một** Người duyệt chi do Super Admin cấu hình (`QĐ-22`)

> Dự báo bằng mô hình xu hướng **không** bị loại trừ hoàn toàn mà thuộc **phạm vi có điều kiện** (mục 3.3): bản đăng ký đồ án phát biểu *"chỉ được dùng khi dữ liệu lịch sử đủ và có đánh giá sai số"*, nên cách trung thành nhất là hiện thực chính điều kiện đó.

### 3.3. Phạm vi có điều kiện

Một số năng lực chỉ được kích hoạt khi dữ liệu đạt điều kiện kiểm chứng. Hệ thống **tự đánh giá điều kiện và tự quyết định có hiển thị kết quả hay không** — người dùng không tự bật.

| Năng lực | Điều kiện kích hoạt | Khi không đạt điều kiện |
| -------- | ------------------- | ----------------------- |
| Dự báo chi phí biến động bằng mô hình xu hướng | Có tối thiểu 12 tháng dữ liệu chi tiêu **và** sai số kiểm chứng lùi nằm trong ngưỡng | Không hiển thị dự báo mô hình; chỉ hiển thị khoảng kịch bản, kèm lý do vì sao ẩn. ⏸️ **Không hiện thực trong MVP** (`QĐ-25`), giữ làm đặc tả |
| Phát hiện lãng phí nhóm G3, G4 | Nguồn usage có trường ngày hoạt động cuối và cửa sổ bao phủ đủ dài, **hoặc** có dữ liệu từ bộ thu thập trên thiết bị của nhân viên **đã xác nhận** (`FR-4.18`) | Chỉ chạy G1, G2; giao diện nêu rõ giới hạn của nguồn hiện có |
| Đối soát tự động với nhà cung cấp | Ứng dụng có connector đã được cấu hình | Chỉ đối soát các ứng dụng có connector; phần còn lại không sinh sai lệch giả |

> **Nguyên tắc chung của mục này:** khi điều kiện không đạt, hệ thống **im lặng về mặt kết luận nhưng lên tiếng về mặt lý do**. Nó không đưa ra con số kém tin cậy, và cũng không để trống mà không giải thích.

**Khả năng áp dụng theo loại đối tượng quản lý** (`QĐ-49a` → `QĐ-49c`, `QĐ-50a`):

| Nội dung | SaaS bên ngoài có trả phí | Phần mềm thương mại có bản quyền | Phần mềm/dịch vụ nội bộ |
| --- | --- | --- | --- |
| Hợp đồng / hóa đơn / số lượng đã mua; kiểm tra sức chứa seat | Có thuê bao (kỳ thuê bao); hợp đồng, hóa đơn theo quy tắc hiện hành; **có** kiểm tra sức chứa seat | Có khoản mua (giấy phép đã mua); **không mặc định là thuê bao** — có thể là license vĩnh viễn; kiểm sức chứa seat khi có số lượng đã mua | **Không bắt buộc** hợp đồng, hóa đơn license hay paid seat; không có số lượng đã mua nên **không** kiểm tra sức chứa seat |
| Gia hạn (`MF-4`) | Có, khi có kỳ cần gia hạn | Chỉ khi **có thời hạn cần gia hạn**; license vĩnh viễn **không** | **Không** mặc định đi qua gia hạn thuê bao |
| Dữ liệu sử dụng (usage) và ghost seat (mục 5.4) | Có, theo `G1`–`G4` | Có sức chứa đã mua nên `G1` áp dụng; `G2`–`G4` theo nguồn usage hiện có | Không có số lượng đã mua ⟹ không có `G1`. Nguồn usage và nhận diện `G2`–`G4` cho phần mềm nội bộ **ngoài MVP** (`QĐ-62o`) |
| Tiết kiệm (`FR-4.15`) | Hai con số tách riêng theo `FR-4.15`; thu hồi một quyền **không** tự ghi nhận tiền tiết kiệm | Như SaaS khi có kỳ gia hạn; license vĩnh viễn **không có điểm gia hạn** nên không có *tiết kiệm tại kỳ gia hạn* — thu hồi chỉ đưa seat về kho | Thu hồi một quyền **không** tự ghi nhận tiết kiệm. Chi phí đã ghi nhận giảm là thay đổi chi phí, không phải kết quả thu hồi quyền; cách ghi nhận tiết kiệm cho trường hợp đó **ngoài MVP** (`QĐ-62o`) |
| Kênh cấp/thu hồi quyền | Connector hoặc thủ công (`FR-2.5`); kiểu cấp K1–K3 (`FR-1.9`) | Connector (nếu có) hoặc thủ công; kiểu cấp K4 với khóa bản quyền | **Thủ công ngoài hệ thống**: IT thực hiện, xác nhận và lưu bằng chứng — kiểu K5 |
| Yêu cầu quyền truy cập (`FR-3.4`) | Nhánh (a)/(b)/(c) | Nhánh (a)/(b)/(c) | Đã có trong danh mục, không phí: Employee → trưởng phòng → IT Admin thực hiện thủ công, xác nhận kèm bằng chứng; **không** kiểm sức chứa seat, **không** cam kết ngân sách. Đăng ký vào danh mục do IT Admin cùng Business Owner, **không** có bước Người duyệt chi và không qua nhánh (c) |
| Chi phí | Hóa đơn → phân bổ theo seat hoặc tỷ lệ (`INV-03`) | Như SaaS (khoản mua, không có kỳ gia hạn nếu vĩnh viễn) | Khoản chi đã ghi nhận (nếu có) do Finance gán cho **đúng một Cost Center** (`QĐ-49g`) |

> Phần mềm/SaaS **miễn phí bên ngoài** không nằm trong bảng vì **không** phải đối tượng quản lý (`QĐ-49a`).

### 3.4. Hồ sơ tổ chức mục tiêu

Không có mô tả này thì mọi con số trong phần demo đều lơ lửng, và không ai biết hệ thống được thiết kế cho quy mô nào.

| Đặc điểm | Giá trị mục tiêu | Vì sao chọn mức này |
| -------- | ---------------- | ------------------- |
| Loại hình | Công ty công nghệ, software outsourcing, công ty làm sản phẩm, doanh nghiệp đang chuyển đổi số; **cấp máy cho nhân viên** | Nơi việc dùng SaaS đã đủ nhiều để trở thành vấn đề |
| Quy mô nhân sự | 100–500 người | Đủ lớn để mất kiểm soát; đủ nhỏ để chưa mua nổi nền tảng thương mại |
| Số ứng dụng SaaS | 15–40 ứng dụng SaaS | Vượt ngưỡng quản lý được bằng bảng tính. **Giả định thiết kế** của hồ sơ này, không phải số liệu khảo sát; chỉ nói về SaaS, **không** phải tổng ba loại đối tượng quản lý (`QĐ-49a`) — số phần mềm thương mại có bản quyền và phần mềm nội bộ không được giả định |
| Cơ cấu tổ chức | **Các phòng ban phẳng dưới công ty**, mỗi phòng có một trưởng phòng và một cost center; nhân viên có chức vụ (`QĐ-52`) | Điều kiện để luồng phê duyệt có ý nghĩa |
| Hiện trạng CNTT | 1–3 IT Admin, mỗi người phụ trách một số phòng; tài khoản công việc trên tên miền công ty (Google Workspace hoặc Microsoft 365) | Lý do việc import file là nền móng, connector là bổ sung |
| Dữ liệu sẵn có | Chủ yếu là file xuất thủ công từ trang quản trị của nhà cung cấp | Quyết định toàn bộ chiến lược dữ liệu tại mục 6.3 |

**Không phải đối tượng mục tiêu:** tập đoàn trên 5.000 nhân sự (đã có nền tảng thương mại và đội vận hành riêng), doanh nghiệp dưới 30 người (bảng tính vẫn đủ), tổ chức chưa dùng SaaS ở mức đáng kể, và tổ chức duyệt nhiều cấp như cơ quan nhà nước.

> Hồ sơ này cũng là **cơ sở để sinh dữ liệu mô phỏng**: bộ dữ liệu demo phải khớp quy mô ở bảng trên, không phải một con số tùy chọn.

### 3.5. Giả định và ràng buộc

#### 3.5.1. Giả định về môi trường triển khai

Mỗi giả định kèm hệ quả nếu nó sai — đây là phần quan trọng hơn bản thân giả định.

| Mã | Giả định | Nếu giả định sai thì sao |
| -- | -------- | ------------------------ |
| GĐ-1 | Doanh nghiệp xuất được danh sách nhân sự dạng file, có **phòng ban và chức vụ**; mỗi phòng có trưởng phòng và cost center | Không dựng được tổ chức ⟹ **toàn bộ luồng phê duyệt không chạy được** |
| GĐ-2 | Mỗi nhân viên có đúng một email công việc **thuộc tên miền công ty**, dùng làm khóa ánh xạ chính và là tài khoản duy nhất được cấp quyền trả phí (`QĐ-54c`) | Tầng ánh xạ danh tính phải dựa vào khớp thủ công ⟹ hàng đợi chưa khớp phình to; quyền cấp vào tài khoản cá nhân không thu hồi được khi nghỉ việc |
| GĐ-3 | IT Admin có quyền quản trị trên các ứng dụng SaaS để lấy danh sách thành viên | Không lấy được dữ liệu usage ⟹ chỉ chạy được nhóm lãng phí G1 và G2 |
| GĐ-4 | Hợp đồng và hóa đơn tồn tại dưới dạng file tải lên được | Không có hạn báo hủy và đơn giá ⟹ mất phân hệ cảnh báo gia hạn và ước tính tiết kiệm |
| GĐ-5 | Doanh nghiệp có **một người có thẩm quyền chi** giữ vai Người duyệt chi, và **đúng một người Tài chính** kiểm soát ngân sách (`QĐ-22`, `QĐ-29b`, `QĐ-52d`) | Thiếu người thẩm quyền chi ⟹ Request có chi phí dừng ở trạng thái chờ có kiểm soát (`FR-3.12`). Thiếu Tài chính ⟹ Người duyệt chi vẫn quyết được trên snapshot ngân sách, nhưng yêu cầu thông tin không có người trả lời và khoản cam kết không được ghi nhận chính thức; **không** được gộp vào IT Admin (`SoD-3`) |
| GĐ-6 | Phần lớn phần mềm được mua bằng tài khoản doanh nghiệp, thanh toán qua kênh có sao kê | Phân hệ phát hiện ngoài danh mục mất nguồn bằng chứng chính |
| GĐ-7 | Doanh nghiệp chấp nhận cập nhật tay trạng thái nghỉ phép dài | Điều kiện loại trừ số 3 của FR-4.9 không hoạt động ⟹ báo động giả với người nghỉ dài |
| GĐ-8 | Lấy được tỷ giá từ nguồn công khai và cập nhật định kỳ | Phải nhập tay tỷ giá ⟹ báo cáo đa tiền tệ kém tin cậy |
| GĐ-9 | Doanh nghiệp **quản lý được trình duyệt trên máy công ty cấp** để cài bắt buộc tiện ích, và có **chính sách thiết bị** trong nội quy (`FR-4.21`). Demo của đồ án **không** chứng minh giả định này: máy nhóm không được quản lý, tiện ích nạp bằng *load unpacked*; điều kiện force-install tiện ích ngoài Web Store còn mở ở `OQ-18` (`QĐ-28b`) | Không có bộ thu thập ⟹ chỉ còn nguồn nhà cung cấp; ứng dụng không có bản xuất hoạt động ở gói đang dùng chỉ phát hiện được G1, G2 |

#### 3.5.2. Ràng buộc của dự án

| Mã | Ràng buộc | Ảnh hưởng tới thiết kế |
| -- | --------- | ---------------------- |
| RB-1 | **9 tuần phát triển thật** (T1–T9, trước cổng `RV-3`), 5 thành viên, đồng thời học các môn khác | Buộc phải cắt phạm vi có chủ đích — xem mục 9 |
| RB-2 | Không tiếp cận được môi trường doanh nghiệp thật | Dữ liệu chủ yếu mô phỏng; cần chiến lược ba lớp tại mục 6.3 để vẫn có bằng chứng thật |
| RB-3 | Phần lớn nhà cung cấp đặt tính năng xuất nhật ký hoạt động ở gói cao mà nhóm không tiếp cận được | Chỉ demo được một vài nguồn; ranh giới hệ thống phải đặt ở **định dạng file**, không đặt ở nhà cung cấp |
| RB-4 | Không có ngân sách mua gói SaaS bậc cao; không có tenant công ty | Connector demo giới hạn ở nhà cung cấp có API miễn phí; tài khoản công ty và workspace do IT làm owner được **mô phỏng** |
| RB-5 | Nhóm không có chuyên môn pháp lý và thuế | Phần chạm dữ liệu nhạy cảm — dữ liệu từ bộ thu thập trên thiết bị — **chỉ hiện thực khi thỏa đủ điều kiện đọc được từ văn bản gốc** (`ADR-13`, mục 7.7.7): lọc tại nguồn, xác nhận chủ động, không thu nội dung. Nhật ký truy cập web đầy đủ vẫn ngoài phạm vi (mục 5.6.1). Thuế chỉ ghi nhận, không tính (`QĐ-55a`). Phát biểu tuân thủ vẫn cần ý kiến chuyên môn |

> **Vì sao mục này đáng có trong BRD:** phần lớn quyết định thu hẹp phạm vi ở mục 9 đều bắt nguồn từ một ràng buộc cụ thể ở đây. Khi bảo vệ, trả lời *"chúng em không làm X vì ràng buộc RB-3"* mạnh hơn hẳn *"chúng em không kịp làm X"*.

---

## 4. ĐỐI TƯỢNG SỬ DỤNG (USER PERSONAS)

Hệ thống có **6 vai trò người dùng** và **1 tác nhân hệ thống**: **Finance một người**, **Người duyệt chi một người**, **IT Admin có thể nhiều người — mỗi phòng một IT Admin phụ trách**, **mỗi phòng một trưởng phòng giữ vai Manager** (`QĐ-22`, `QĐ-52d`). **Chức vụ** (Designer, Developer, Kế toán…) là thuộc tính nhân sự, **không** phải vai trò và **không** cấp quyền.

> **Nguyên tắc rút gọn của toàn bộ mục này:** *người quyết định nhu cầu (Manager), người quyết định chi tiền (Người duyệt chi) và người thực hiện kỹ thuật (IT Admin) là ba vai khác nhau; Tài chính kiểm soát ngân sách nhưng không quyết chi; và không ai được duyệt yêu cầu của chính mình.* Tám nguyên tắc SoD tại mục 4.2 đều suy ra từ câu này.
>
> Trong doanh nghiệp thực tế kế toán **không có thẩm quyền quyết chi** — người quyết là người có thẩm quyền chi (CEO/CTO). Finance **kiểm soát ngân sách** và **không** nằm trên đường duyệt: người quyết xem snapshot ngân sách và hỏi Finance khi cần; Finance ghi nhận ngân sách và khoản cam kết **sau khi** quyết (`QĐ-22`, `QĐ-29b`).

### 4.1. Bảng vai trò

| Vai trò | Trách nhiệm chính | Hành động chính | AI hỗ trợ |
| ------- | ----------------- | --------------- | --------- |
| **Super Admin**<br>Quản trị hệ thống | Quản lý người dùng, vai trò, phân quyền, cấu hình hệ thống, giám sát audit | Tạo/khóa tài khoản đăng nhập, gán vai trò, cấu hình ngưỡng và tham số, xem toàn bộ Audit Trail, quản lý job và trạng thái đồng bộ | Không |
| **IT Admin**<br>Quản trị viên CNTT | Danh mục phần mềm, license, cấp/thu hồi seat, import dữ liệu usage, xử lý cảnh báo phần mềm ngoài danh mục. Mỗi IT Admin **phụ trách một số phòng ban**: quản lý cấp phát, thu hồi, dữ liệu phòng và tác vụ của các phòng đó (`QĐ-52d`, `QĐ-58b`); đánh giá **mức kiểm soát** của phần mềm mới và từ chối khi *không kiểm soát được* (`QĐ-53c`) | Quản lý danh mục, hợp đồng, dữ liệu phòng ban, kiểu cấp, điều khoản nhà cung cấp, **kho khóa bản quyền** và bộ công cụ chuẩn; cấp/thu hồi seat; import file; đánh giá kỹ thuật và thực thi Discovery Finding (Người duyệt chi quyết hợp thức hóa); xử lý sai lệch với nhà cung cấp và yêu cầu quyền dữ liệu (`OI-01`) | Có — gợi ý nhà cung cấp trong hàng đợi review `US-15-01` (tùy chọn; **hiện ẩn** vì chưa cấu hình nào qua cổng chất lượng) |
| **Manager**<br>Trưởng phòng | Xác nhận nhu cầu nghiệp vụ của nhân viên **trong phòng**, tham gia review Ghost Seat và access review; chịu trách nhiệm mặc định cho tài khoản dùng chung của phòng; đề xuất bộ công cụ chuẩn của phòng (`QĐ-52a`) | Phê duyệt/từ chối request của nhân viên trong phòng, tạo request thay nhân viên khi onboarding, gửi yêu cầu theo nhóm, chọn Keep/Reclaim/Exempt kèm lý do, xem usage summary của phòng | Có — tóm tắt các request đang chờ mình duyệt (`QĐ-49e`, `QĐ-61e`; chỉ hỗ trợ, có thể không dùng) |
| **Người duyệt chi**<br>Người có thẩm quyền chi | Quyết định cuối cho mọi **khoản chi mới** và cho việc **đưa phần mềm bên ngoài có trả phí/có bản quyền vào danh mục**; phần mềm nội bộ do IT Admin đăng ký cùng Business Owner, không qua Người duyệt chi — ngoại lệ này không bỏ duyệt khoản chi mới (`QĐ-22`, `QĐ-50a`). Duyệt **bước nhu cầu** khi trưởng phòng tự gửi yêu cầu (`QĐ-52c`) | Duyệt/từ chối request **phát sinh chi phí** hoặc **phần mềm bên ngoài có trả phí/có bản quyền chưa có trong danh mục** (`FR-3.4`) trên **snapshot ngân sách**, **tùy chọn hỏi Finance** (`FR-3.14`); quyết định gia hạn, giảm số lượng, hủy thuê bao; quyết hợp thức hóa phần mềm ngoài danh mục; xem báo cáo tổng chi, tiết kiệm, tóm tắt quy trình gồm seat cấp theo nhánh (a) | Không |
| **Finance**<br>Quản lý Tài chính/Kế toán | **Kiểm soát ngân sách**, giám sát dòng tiền, đối soát hóa đơn. **Một người** giữ vai (`QĐ-52d`; tính theo grant chưa thu hồi, kể cả tài khoản chưa kích hoạt hoặc bị khóa; được tạm thời không có Finance — `QĐ-67e`); khai **hồ sơ thuế** nhà cung cấp, ghi **dòng thuế** trên hóa đơn và đánh dấu dòng GTGT **được khấu trừ** (`QĐ-55a`, `QĐ-60a`); quản lý danh mục Cost Center (`OI-04`) | Trả lời **yêu cầu thông tin ngân sách** khi Người duyệt chi hỏi; **ghi nhận ngân sách chính thức sau khi duyệt chi** trên khoản cam kết (`FR-3.14`, `FR-5.8`) — **không** nằm trên đường duyệt; xem Budget vs Actual, đối soát hóa đơn với seat và usage, xem lịch gia hạn và dự báo | Có — bản nháp diễn giải báo cáo chi phí từ số liệu backend (`QĐ-49e`, `QĐ-61e`; chỉ hỗ trợ, Finance xem và sửa); trợ lý tra cứu hợp đồng là mở rộng, không chọn |
| **Employee**<br>Nhân viên | Người sử dụng trực tiếp tài khoản công nghệ | Xem danh sách phần mềm được cấp, gửi request cấp mới/đổi gói/gia hạn có thời hạn/hoàn trả seat; xác nhận chính sách thiết bị khi nhận máy công ty (`FR-4.21`) | Không |
| **Automation Service**<br>Tác nhân hệ thống | Chạy rule định kỳ, sinh cảnh báo và khuyến nghị, chuẩn hóa dữ liệu import | Chạy trong background queue, sinh khuyến nghị kèm nguồn dữ liệu và mức độ tin cậy, duy trì Audit Trail | — |

### 4.2. Ranh giới quyền hạn (Separation of Duties)

Đây là nguyên tắc thiết kế bắt buộc, không phải khuyến nghị:

| Nguyên tắc | Diễn giải |
| ---------- | --------- |
| **SoD-1** | Super Admin **không** gán/thu hồi seat và **không** phê duyệt request nghiệp vụ. Vai trò này chỉ quản trị hệ thống. Nếu Super Admin làm được mọi thứ thì việc tách vai trò mất ý nghĩa |
| **SoD-2** | Manager không tự cấp/thu hồi quyền, không xem hợp đồng, dữ liệu tài chính toàn công ty hoặc raw activity log |
| **SoD-3** | Finance không thực hiện thao tác kỹ thuật, không tự cấp/thu hồi tài khoản, và **không quyết định chi** — chỉ trả lời yêu cầu thông tin ngân sách, ghi nhận ngân sách và theo dõi khoản cam kết |
| **SoD-4** | Người yêu cầu không được tự phê duyệt yêu cầu của chính mình, kể cả khi có vai trò cho phép phê duyệt |
| **SoD-5** | IT Admin là bên duy nhất thực hiện thay đổi license seat, và chỉ sau khi đủ phê duyệt |
| **SoD-6** | Automation Service không tự phê duyệt chi phí, không tự cấp/thu hồi seat, không tự chặn ứng dụng |
| **SoD-7** | Người duyệt chi không cấp/thu hồi seat, không thực hiện thao tác kỹ thuật, và không duyệt chi cho Request mà mình là **người yêu cầu hoặc người thụ hưởng** |
| **SoD-8** | Người **trả lời yêu cầu thông tin ngân sách** hoặc **ghi nhận ngân sách** và Người duyệt chi của **cùng một Request** phải là hai người khác nhau — ý kiến kiểm soát không được do chính người quyết đưa ra (`QĐ-29b`) |

> **Ngoại lệ có chủ đích — cùng một người giữ hai bước:** nếu người duyệt **bước nhu cầu** (trưởng phòng; hoặc Người duyệt chi khi trưởng phòng tự gửi — `QĐ-52c`) **chính là Người duyệt chi**, hệ thống **vẫn giữ hai bước riêng** — nhu cầu và chi phí — và nhật ký gắn cờ *cùng người*. Hai quyết định khác loại vẫn truy vết được riêng, còn nguyên tắc *không ai tự duyệt yêu cầu của chính mình* (`SoD-4`, `SoD-7`) vẫn giữ.
>
> **Xung đột lợi ích của Người duyệt chi** (`QĐ-28c`): khi Người duyệt chi là **người yêu cầu hoặc người thụ hưởng**, bước duyệt chi của Request đó do **Người duyệt chi thay thế khi xung đột** đã cấu hình trước đảm nhận (`FR-3.15`). Đây không phải ủy quyền: không ai trong luồng tự chọn người thay.

### 4.3. Vai trò là thuộc tính, không phải danh tính

Một người có thể mang nhiều vai trò đồng thời (ví dụ IT Admin cũng là Employee và cần xin seat cho chính mình). Hệ thống tách **tài khoản đăng nhập** khỏi **hồ sơ nhân sự**:

- `Employee` — hồ sơ nhân sự, tồn tại kể cả khi người đó không có tài khoản đăng nhập
- `AppUser` — tài khoản đăng nhập, liên kết tới một Employee
- `Role` — các vai trò gán cho một AppUser; có thể **không có** vai gán trực tiếp nào; hệ thống không tự thêm vai; vai hiệu lực = vai gán trực tiếp ∪ vai suy ra hợp lệ (`QĐ-47c`)

Vai trò **Manager là vai trò phái sinh**: hệ thống suy ra từ việc người đó **đang là trưởng phòng có hiệu lực** của một phòng ban, thay vì gán tay — tránh lệch dữ liệu khi tổ chức thay đổi. Phạm vi của Manager là **nhân viên trong phòng mình**. **Một người làm trưởng tối đa một phòng** tại một thời điểm (`QĐ-58a`, `INV-19`). Đổi trưởng phòng **không** đổi thành viên phòng (`QĐ-51`, `QĐ-52a`). Người mang `SUPER_ADMIN` **không** được làm trưởng phòng (`FR-8.7`).

Vai trò **Người duyệt chi được gán tay**: Super Admin cấu hình **một** Employee giữ vai này, mặc định là CEO. Thẩm quyền chi không suy ra được từ cơ cấu tổ chức, nên không thể phái sinh như Manager.

### 4.4. Người sở hữu nghiệp vụ của ứng dụng (Business Owner)

**Business Owner là một thuộc tính gắn vào ứng dụng, không phải một vai trò đăng nhập riêng.** Người giữ vai trò này thường đã là Manager hoặc IT Admin; hệ thống không tạo thêm quyền đăng nhập mới. Áp dụng cho cả phần mềm/dịch vụ nội bộ (`QĐ-49b`) — với phần mềm nội bộ không có các mốc gắn với hạn báo hủy/gia hạn.

| Trách nhiệm | Khi nào phát sinh |
| ----------- | ----------------- |
| Trả lời câu hỏi *"ứng dụng này dùng để làm gì, ai nên được cấp"* | Khi IT Admin hoặc Manager cần bối cảnh trước khi duyệt |
| Nhận cảnh báo trước hạn báo hủy, cùng IT Admin, Tài chính và Người duyệt chi (`OI-09a`) | Tại các mốc cảnh báo của FR-1.4 |
| Cho ý kiến khi phát hiện một ứng dụng ngoài danh mục **trùng chức năng** với ứng dụng mình phụ trách | Trong luồng xử lý phát hiện ngoài danh mục (FR-6.9) |
| Xác nhận khi ứng dụng được đề xuất chuyển sang trạng thái ngừng sử dụng — IT Admin ghi xác nhận khi chuyển trạng thái (`OI-05b`) | Khi doanh nghiệp cân nhắc bỏ một ứng dụng |

**Ranh giới:** Business Owner **không** được cấp hay thu hồi seat — SoD-5 vẫn áp dụng nguyên vẹn. Ý kiến và xác nhận của Business Owner được **IT Admin ghi nhận** trên hệ thống; ý kiến là **đầu vào không chặn** — không thêm bước, SLA hay người duyệt (`OI-05a`). Với SaaS mới chạm dữ liệu nhạy cảm cao, IT ghi ý kiến của Business Owner ứng dụng tương đương (nếu có) hoặc trưởng phòng của người yêu cầu trước bước duyệt chi.

- **FR-1.7:** Mỗi mục trong danh mục (gồm cả phần mềm/dịch vụ nội bộ) bắt buộc có một Business Owner đang làm việc. Khi người đó chuyển trạng thái sang đã nghỉ việc, hệ thống cảnh báo IT Admin chỉ định người thay thế và **không** để trường này rỗng. Tới khi có người thay thế đang làm việc, hệ thống **giữ người cũ kèm cờ *cần thay thế*** và cảnh báo IT Admin — là vi phạm tạm thời có cảnh báo của `INV-06`, không phải trạng thái hợp lệ lâu dài; cảnh báo gia hạn **không** gửi cho người đã nghỉ (`OI-05c`).
- **FR-1.8:** Mỗi mục trong danh mục có cờ **nhóm dịch vụ liên lạc** (`is_communication_service`). Ứng dụng mang cờ này — công cụ nhắn tin, họp trực tuyến, thư điện tử — được áp dụng chế độ xử lý dữ liệu chặt hơn theo ADR-10, bất kể kết luận pháp lý cuối cùng về việc chúng có thuộc nhóm dữ liệu nhạy cảm hay không.

### 4.5. Nhóm người dùng không phải nhân viên chính thức

Ngoài nhân viên chính thức còn bốn nhóm khác, và mỗi nhóm ảnh hưởng trực tiếp tới rule phát hiện lãng phí ở mục 5.4.

| Nhóm | Vấn đề đặc thù | Cách xử lý trong MVP |
| ---- | -------------- | -------------------- |
| Nhà thầu, freelancer | Không có mã nhân viên chuẩn, nhưng có ngày kết thúc rõ ràng | Quản lý như Employee thuộc phòng họ làm việc, **bắt buộc** có ngày kết thúc dự kiến trên Assignment |
| Thực tập sinh | Vòng đời ngắn, rất dễ quên thu hồi | Như nhà thầu; hệ thống nhắc trước ngày kết thúc 7 ngày |
| Tài khoản dùng chung | Không thuộc về một cá nhân, không đánh giá được mức dùng cá nhân | Chỉ khi chính sách chia sẻ của gói cho phép; gán cho **một người chịu trách nhiệm** (mặc định trưởng phòng); loại khỏi rule ghost seat, nhưng vẫn tính chi phí — xem `FR-2.11` |
| Tài khoản dịch vụ (bot, CI) | Không "đăng nhập" theo cách thông thường | Đã có cờ loại trừ tại FR-4.9 điều kiện 2; **bắt buộc ghi chú lý do** |

> **Vì sao bắt buộc ghi chú lý do cho tài khoản dịch vụ:** cờ này là một cửa thoát khỏi toàn bộ cơ chế phát hiện lãng phí. Nếu bật được mà không cần giải thích, sau vài tháng sẽ có hàng chục seat mang nhãn "tài khoản dịch vụ" mà không ai nhớ vì sao — và hệ thống mất khả năng phát hiện đúng thứ nó sinh ra để phát hiện.

> **Tài khoản dùng chung và tài khoản dịch vụ không là `Employee`** — `Employee` luôn là người thật; file nhân sự chỉ chứa người. Mỗi tài khoản như vậy là **một Assignment** do một Employee **chịu trách nhiệm** giữ, mang loại *dùng chung* hoặc *dịch vụ* (dịch vụ bắt buộc có lý do). Chi phí ghi Cost Center **trên Assignment**: tài khoản dùng chung **của một phòng** → Cost Center `Unit` của phòng đó; tài khoản dùng chung **toàn công ty** và **tài khoản dịch vụ** → Cost Center `Company` (`QĐ-40d`, `QĐ-54d`).

- **FR-2.8:** Assignment gắn với nhà thầu, freelancer hoặc thực tập sinh **bắt buộc** có ngày kết thúc dự kiến. Hệ thống nhắc **Employee** giữ quyền, IT Admin và trưởng phòng trước 7 ngày (`QĐ-57a`, bảng cảnh báo `FR-5.14`), và đưa vào hàng đợi cần xử lý khi quá hạn. IT Admin phụ trách xử lý mục quá hạn. Yêu cầu gia hạn gửi **trước** ngày kết thúc mà chưa được quyết ⟹ quyền **giữ nguyên tới khi có quyết định**, bước đang chờ chạy nhắc SLA (`FR-3.8`); bị từ chối hoặc rút ⟹ IT thu hồi; yêu cầu gửi **sau** ngày kết thúc là yêu cầu mới, không dừng thu hồi (`QĐ-62h`).

### 4.6. Ma trận trách nhiệm theo loại yêu cầu

Ai tạo, ai kiểm tra, ai phê duyệt, ai ký duyệt và hệ thống lưu lịch sử thế nào cho từng loại yêu cầu (`QĐ-53a`). **Trưởng phòng** là người giữ vai Manager của phòng người yêu cầu; **trưởng phòng tự gửi** thì bước nhu cầu do Người duyệt chi đảm nhận (`QĐ-52c`). **IT Admin** ở cột *Thực hiện* là IT Admin phụ trách phòng; IT Admin khác có thể xử lý thay, có ghi Audit Trail (`QĐ-58b`). Mọi bước đều tuân `SoD-1` → `SoD-8`. **Trưởng phòng tạo thay** nhân viên phòng mình (onboarding, yêu cầu theo nhóm) ⟹ việc tạo thay ghi nhận **bước nhu cầu đã được xác nhận** (ghi rõ người tạo, người thụ hưởng); phần mà chính trưởng phòng là người thụ hưởng vẫn theo `QĐ-52c` (`QĐ-62a`).

| Loại yêu cầu | Tạo | Kiểm tra | Duyệt nhu cầu | Duyệt chi (ký duyệt mua) | Thực hiện | Hồ sơ |
| --- | --- | --- | --- | --- | --- | --- |
| Cấp quyền phần mềm **đã có** trong danh mục, còn seat — nhánh (a) | Employee; trưởng phòng tạo thay khi onboarding hoặc gửi **yêu cầu theo nhóm** (`FR-2.11`) | Hệ thống kiểm sức chứa seat và bộ công cụ chuẩn (`FR-3.18`) | Trưởng phòng | — | IT Admin | `BM-01` |
| Mua thêm seat, nâng gói, vượt ngân sách — nhánh (b) | Employee / trưởng phòng | Hệ thống lập snapshot ngân sách; Finance trả lời **khi được hỏi** (`FR-3.14`) | Trưởng phòng | **Người duyệt chi** | IT Admin mua/cấp ∥ Finance ghi nhận khoản cam kết | `BM-01`, `BM-05` |
| Phần mềm trả phí/có bản quyền **chưa có** trong danh mục — nhánh (c) | Employee | **IT Admin** đánh giá danh mục, rủi ro và **mức kiểm soát** — *không kiểm soát được* ⟹ IT từ chối, kết thúc (`FR-3.19`) | Trưởng phòng | **Người duyệt chi** | IT Admin thêm vào danh mục, mua, cấp | `BM-01`, `BM-02`, `BM-05` |
| Phần mềm nội bộ, không phí (`QĐ-50a`) | Employee | — | Trưởng phòng | — | IT Admin cấp thủ công kèm bằng chứng | `BM-01` |
| Gia hạn, giảm số lượng, hủy thuê bao (`MF-4`) | Hệ thống cảnh báo trước hạn báo hủy (`FR-1.4`); IT Admin lập đề xuất | Finance (ngân sách), Business Owner (ý kiến, không chặn), IT rà điều khoản (`FR-1.10`) | — | **Người duyệt chi** | IT Admin | `BM-05` |
| Hoàn trả / thu hồi theo nhu cầu | Employee hoặc trưởng phòng | — | Trưởng phòng (khi thu hồi theo quyết định của phòng) | — | IT Admin | `BM-03` |
| Điều chuyển phòng (`MF-7`) | IT Admin ghi điều chuyển kèm ngày hiệu lực | Hệ thống so với bộ công cụ chuẩn của phòng mới | Trưởng phòng **mới** rà soát công cụ ngoài bộ chuẩn trong 5 ngày làm việc | — | IT Admin | `BM-04` |
| Nghỉ việc (`MF-5`) | IT Admin ghi bàn giao/nghỉ việc | Trưởng phòng xác nhận **bàn giao dữ liệu** (`FR-2.12`) | — | — | IT Admin thu hồi theo checklist | `BM-04`, `BM-08` |
| Thu hồi ghost seat (`MF-3`) | Automation Service sinh khuyến nghị | IT Admin trả lại tối đa một lần (`OI-02`) | Trưởng phòng chọn Keep/Reclaim/Exempt | — | IT Admin | — |
| Hợp thức hóa phần mềm ngoài danh mục (`MF-6`) | Hệ thống tạo finding từ CSV sao kê/hóa đơn | IT Admin đánh giá kỹ thuật và mức kiểm soát (chỉ là đầu vào); trưởng phòng cung cấp bối cảnh | — | **Người duyệt chi** quyết (`FR-3.4c-1`) | IT Admin thực thi | `BM-07` |

**"Ký duyệt" và lưu lịch sử** (`QĐ-53a`): mỗi quyết định được lưu thành **bản ghi phê duyệt điện tử** — người quyết, vai tại thời điểm đó, thời điểm, quyết định, lý do, snapshot ngân sách nếu có — và **Audit Trail chỉ ghi thêm** (`FR-8.3`, `INV-05`). Hệ thống **không** dùng chữ ký số/CA. Tệp chứng từ gốc lưu theo `FR-1.5`.

---

## 5. YÊU CẦU CHỨC NĂNG CHI TIẾT (FUNCTIONAL REQUIREMENTS)

Các yêu cầu dưới đây mô tả phạm vi MVP; chi tiết UI, API contract và acceptance criteria thuộc SRS/backlog.

### 5.1. Phân hệ Quản lý Danh mục SaaS & Hợp đồng

**Mô hình dữ liệu:** danh mục, gói, hợp đồng và hóa đơn tách thành chuỗi:

```
Vendor → SaaS Product → Plan → Subscription → (Contract, Invoice)
```

- **Contract** — văn bản pháp lý, có thể bao nhiều Subscription, có thể kéo nhiều năm
- **Subscription** — một chu kỳ mua cụ thể: gói nào, bao nhiêu seat, từ ngày nào đến ngày nào, giá bao nhiêu
- **Invoice** — sự kiện thanh toán thực tế

Ngày gia hạn thuộc Subscription, **không** thuộc Contract — một hợp đồng khung 3 năm có thể chứa nhiều chu kỳ gia hạn.

> Chuỗi trên áp cho SaaS có trả phí và phần mềm thương mại có bản quyền. **Phần mềm/dịch vụ nội bộ không đi qua chuỗi này**: không bắt buộc Vendor, Contract, Subscription hay Invoice; chi phí đã ghi nhận (nếu có) gắn một Cost Center (`QĐ-49g`). **License vĩnh viễn** là một khoản mua **không có kỳ gia hạn** (`QĐ-49a` → `QĐ-49c`).

**Yêu cầu:**

- **FR-1.1:** IT Admin khai báo phần mềm mới gồm: tên phần mềm, nhà cung cấp, tên miền liên quan, mức độ nhạy cảm dữ liệu, người sở hữu nghiệp vụ, trạng thái phê duyệt và **nhóm chức năng** chọn từ danh sách do IT Admin duy trì — dùng để hiện công cụ tương tự khi xét nhu cầu và kiểm trùng chức năng khi đánh giá phần mềm mới hoặc Shadow IT (`OI-14e`). Danh mục gồm **SaaS có trả phí**, **phần mềm thương mại có bản quyền** và **phần mềm/dịch vụ nội bộ**. Với phần mềm nội bộ, IT Admin đăng ký cùng Business Owner, **không** có bước Người duyệt chi; **nhà cung cấp, hợp đồng, thuê bao, hóa đơn không bắt buộc** (`QĐ-50a`). Phần mềm/SaaS miễn phí bên ngoài **không** được thêm vào danh mục (`QĐ-49h`). **Ngừng dùng** một mục trong danh mục bị chặn tới khi mọi Assignment đã thu hồi và thuê bao đã hủy/hết hạn; hệ thống liệt kê thứ đang chặn (`QĐ-62n`). Mục chỉ có **khoản mua vĩnh viễn** (không có ngày kết thúc): ngừng dùng được khi mọi Assignment đã thu hồi (`QĐ-66f`).
- **FR-1.2:** Khai báo gói (Plan) với **mô hình giá** là thuộc tính bắt buộc: `per_seat`, `flat_rate`, `concurrent`, `consumption`, `per_host`. Mô hình giá quyết định các phân hệ phía sau có áp dụng được hay không (xem ADR-02).
- **FR-1.3:** Khai báo thuê bao (Subscription) gồm: số lượng seat đã mua, đơn giá, chu kỳ thanh toán, ngày bắt đầu, ngày kết thúc, ngày gia hạn, **hạn chót báo hủy**, cờ tự động gia hạn, và cờ cho phép giảm số lượng giữa kỳ. Mục này mô tả cả **kỳ thuê bao** lẫn **giấy phép đã mua**. **License vĩnh viễn** là khoản mua không có kỳ gia hạn: ngày kết thúc, ngày gia hạn, hạn chót báo hủy và cờ tự động gia hạn **không áp dụng**, và `FR-1.4` không phát cảnh báo cho khoản đó (`QĐ-49c`).
- **FR-1.4:** Cảnh báo chủ động tính theo **hạn chót báo hủy**, không tính theo ngày gia hạn. Ngưỡng mặc định: 15 và 7 ngày trước hạn chót báo hủy, cấu hình được. Mốc 15 ngày báo IT Admin, Finance, Business Owner và Người duyệt chi; mốc 7 ngày báo thêm Super Admin (`OI-09a`). Kênh theo `FR-3.11`. Thuê bao **không** có hạn chót, **không** có số ngày báo trước và **không** tự gia hạn ⟹ hai mốc tính theo **ngày kết thúc**, ghi rõ *theo ngày kết thúc* (`QĐ-62l`). Tới hạn chót mà quyết định gia hạn đã ghi nhưng **chưa ghi kết quả thực hiện** ⟹ cảnh báo IT Admin và Người duyệt chi, gắn cờ **thực hiện trễ** (không tính `KPI-4`). Cảnh báo T−7 được bỏ qua khi cả quyết định lẫn kết quả thực hiện đã ghi trước mốc đó (`QĐ-62t`). Quyết định ghi **sau** hạn chót **không** bị hủy: thực hiện từ thời điểm còn làm được — giữa kỳ nếu gói cho phép giảm giữa kỳ, nếu không thì kỳ kế tiếp; kết quả của nhà cung cấp ghi theo thực tế, tiết kiệm chỉ ghi khi chi phí thực giảm (`QĐ-62k`, `FR-4.15`).
  > *Lý do:* nếu hợp đồng yêu cầu báo hủy trước 30 ngày mà hệ thống chỉ cảnh báo trước 7 ngày so với ngày gia hạn thì cảnh báo đã vô dụng — đúng vào PP-2.
  >
  > *Trường hợp thiếu dữ liệu:* nếu không có hạn chót báo hủy nhưng hợp đồng có số ngày báo trước, hệ thống suy ra và **ghi rõ đây là giá trị suy ra, chưa xác nhận**. Nếu thiếu cả hai mà thuê bao có tự động gia hạn, hệ thống **không suy đoán** mà hiển thị cảnh báo chất lượng dữ liệu.
- **FR-1.5:** Quản lý tệp đính kèm hóa đơn/hợp đồng gốc (PDF, ảnh). File không được truy cập công khai; hệ thống phát signed URL có thời hạn. Được mở tệp gốc: IT Admin (quản lý hợp đồng), Finance (đối soát) và **Người duyệt chi — chỉ tệp của hồ sơ đang được giao quyết**; Manager không mở (`SoD-2`, `OI-08a`).
- **FR-1.6:** Mọi trường tiền lưu kèm loại tiền tệ gốc, tỷ giá và ngày áp dụng tỷ giá, cùng giá trị đã quy đổi về đồng tiền báo cáo của tổ chức (xem ADR-03).
- **FR-1.9:** **Kiểu cấp, mức kiểm soát và lưu ý trước khi thu hồi là thuộc tính của gói** — không phải của ứng dụng, vì cùng một ứng dụng, gói cá nhân và gói Team có cách cấp khác nhau (`QĐ-54a`, `QĐ-53c`). IT Admin khai cho mỗi gói:

  | Kiểu | Khi nào | Cấp | Thu hồi | Mức kiểm soát mặc định |
  | --- | --- | --- | --- | --- |
  | **K1** Gói cá nhân | Mỗi người một thuê bao riêng (ví dụ gói Pro/Plus) | IT mua gói trên **tài khoản công ty** của nhân viên (`FR-2.9`) | Hủy gia hạn (dùng tới hết kỳ) và khóa tài khoản công ty | **Một phần** — không có trang quản trị chung; hệ thống chỉ biết điều IT ghi lại |
  | **K2** Gói Team/Business có workspace | Nhiều người trong một workspace do IT quản trị | IT là owner/admin workspace, thêm email công ty vào và gán seat | Gỡ thành viên trong trang quản trị; seat trống dùng lại | **Đầy đủ** khi xuất được danh sách thành viên để đối soát (`FR-2.6`) |
  | **K3** Enterprise SSO/SCIM | Đồng bộ tự động từ hệ thống định danh | Tự động | Tự động | Cao — **chỉ đặc tả**, không hiện thực (`RB-4`) |
  | **K4** Khóa bản quyền | License cài đặt theo khóa (ví dụ Office 2021) | Gán khóa từ kho cho người và thiết bị (`FR-2.10`) | Gỡ kích hoạt, khóa về kho nếu điều khoản cho chuyển máy | Theo cặp khóa–thiết bị |
  | **K5** Phần mềm nội bộ | Phần mềm công ty tự xây dựng (`QĐ-50a`) | IT cấp thủ công kèm bằng chứng | Thủ công kèm bằng chứng | Không có chi phí, không đếm seat |

  **Mức kiểm soát** nhận một trong ba giá trị *Đầy đủ* · *Một phần* · *Không kiểm soát được*, dùng ở cổng đánh giá phần mềm mới (`FR-3.19`). **Lưu ý trước khi thu hồi** ghi dữ liệu nào mất khi gỡ người dùng và cần chuyển gì trước — đầu vào bắt buộc của bàn giao dữ liệu (`FR-2.12`). Khuyến nghị, **không chặn**: từ 3 người dùng cùng một phần mềm thì IT ưu tiên K2.
- **FR-1.10:** **Điều khoản nhà cung cấp** (`QĐ-54e`). Mỗi gói lưu liên kết điều khoản sử dụng, **ngày IT rà soát gần nhất** và checklist sáu điểm: **(1)** có cho chia sẻ tài khoản không (**chính sách chia sẻ** của gói, dùng ở `FR-2.11`) · **(2)** dữ liệu nhập vào có bị dùng để huấn luyện AI không, có tắt được không · **(3)** nơi lưu trữ dữ liệu · **(4)** giới hạn số cài đặt/thiết bị · **(5)** có được dùng cho mục đích thương mại không · **(6)** điều khoản hủy, tự gia hạn, hoàn tiền. Hệ thống **cảnh báo** IT Admin khi tới hạn rà soát lại (mặc định trước mỗi hạn chót báo hủy của `FR-1.4`) và khi phát hiện **vi phạm** mà dữ liệu nội bộ chỉ ra được — ví dụ tài khoản dùng chung trên gói cấm chia sẻ, số cài đặt vượt giới hạn — với gói `K4` giới hạn ở điểm (4) lưu dạng số và vi phạm là số thiết bị gắn trên một khóa vượt giới hạn; gói khác chỉ lưu văn bản, không tự phát hiện (`QĐ-66al`). IT ghi lại điều mình đọc được, **không** diễn giải pháp lý; Business Owner cho ý kiến không chặn (mục 4.4).

**Vòng đời và thuộc tính chính của một khoản mua** (bảng tóm tắt, không thêm quy tắc — nguồn ở `FR-1.2` → `FR-1.10`, `FR-2.10`, `FR-5.13`):

| Nhóm | Thuộc tính quản lý |
| --- | --- |
| Thời gian | Ngày bắt đầu, ngày kết thúc, chu kỳ thanh toán, ngày gia hạn, **hạn chót báo hủy**, tự gia hạn (license vĩnh viễn không có kỳ — `FR-1.3`) |
| Số lượng | Số đã mua, số đang gán, số trống (tính ra — `ADR-02`), cho phép giảm giữa kỳ hay không |
| Cách cấp | Kiểu cấp K1–K5, mức kiểm soát, lưu ý trước khi thu hồi (`FR-1.9`), kho khóa với K4 (`FR-2.10`) |
| Điều khoản | Chính sách chia sẻ, checklist sáu điểm, ngày rà soát (`FR-1.10`) |
| Tiền | Đơn giá, tiền tệ, tỷ giá (`FR-1.6`), giá trước thuế, thuế ước tính (tách phần được khấu trừ), chi phí ước tính, hồ sơ thuế nhà cung cấp (`FR-5.13`) |
| Trạng thái | Đang dùng → sắp tới hạn báo hủy → gia hạn / giảm số lượng / hủy (`MF-4`, quyết định của Người duyệt chi) |

### 5.2. Phân hệ Phân bổ License & Quản lý Nhân sự

**Mô hình seat:** hệ thống **không** tạo N bản ghi cho gói N seat. Thay vào đó lưu số lượng đã mua trên Subscription và đếm số Assignment đang chiếm chỗ. Seat trống là giá trị dẫn xuất (xem ADR-02).

- **FR-2.1:** Quản lý danh sách nhân viên được đồng bộ hoặc import (mã nhân viên, họ tên, email công việc, trạng thái làm việc, ngày vào/nghỉ). IT Admin tạo nhân viên bằng **import** (`FR-9.7`) hoặc **nhập tay từng người** với **cùng kiểm tra** như một dòng của file nhân sự — mã phòng đã có, chức vụ có trong danh mục, email công việc không trùng; mã nhân viên đã có bị từ chối, không ghi đè; nhập tay **không** tạo tài khoản, vai hay lời mời và ghi Audit Trail (`QĐ-67d`).
- **FR-2.2:** Quản lý quan hệ tổ chức **có lịch sử**: mỗi nhân viên gắn với **đúng một phòng ban** và một **chức vụ** trong một khoảng thời gian hiệu lực; Cost Center của nhân viên **suy ra** từ Cost Center `Unit` của phòng; trưởng phòng của phòng cũng có hiệu lực theo thời gian. Khi nhân viên đổi phòng hoặc chức vụ, hoặc phòng đổi trưởng phòng, hệ thống tạo bản ghi mới thay vì ghi đè (ADR-04, `INV-19`, `INV-20`). **Kiêm nhiệm** không ghi phòng thứ hai: công cụ cho việc phụ xin qua phòng của mình và tính vào phòng của mình (`QĐ-52a`, `QĐ-52b`). Ngày hiệu lực điều chuyển **không** được trước hôm nay (`QĐ-66e`). Nhân viên mới là thành viên phòng từ lúc hồ sơ được ghi vào phòng — trưởng phòng tạo yêu cầu thay trước ngày vào được — còn quyền chỉ hiệu lực từ ngày vào (`QĐ-66ak`).
  > *Lý do:* nếu chỉ lưu trạng thái hiện tại thì báo cáo chi phí của các tháng trước sẽ bị gán sai Cost Center.
- **FR-2.3:** Cấp phát seat (Assign): IT Admin gán một seat trống cho nhân viên sau khi request đủ phê duyệt. Hệ thống ghi nhận Assignment ở trạng thái tương ứng và sinh **tác vụ thực thi** riêng biệt. Với **phần mềm/dịch vụ nội bộ**, cấp quyền **không** dựa trên seat trống hay Subscription — **không** kiểm tra sức chứa seat và **không** tạo cam kết ngân sách: IT thực hiện **ngoài hệ thống** rồi xác nhận và lưu bằng chứng (kênh thủ công); Assignment ghi nhận quyền đã cấp (`QĐ-49b`, `QĐ-50a`).
- **FR-2.4:** Thu hồi seat (Deprovision): khi nhân viên nghỉ việc, đổi phòng mà không còn nhu cầu, hoặc hoàn trả, IT Admin thu hồi Assignment; seat quay về trạng thái trống để tái phân bổ. **Thu hồi một quyền không tự ghi nhận tiền tiết kiệm; tiết kiệm chỉ ghi khi hợp đồng/khoản chi thực sự giảm theo `FR-4.15`**: license vĩnh viễn — seat chỉ về kho; cam kết theo năm — tiền chỉ giảm tại kỳ gia hạn; phần mềm nội bộ — không có số lượng đã mua nên không có seat để giảm, và việc một chi phí đã ghi nhận (ví dụ hosting) chấm dứt là thay đổi chi phí, không phải kết quả của việc thu hồi quyền một người. Phần mềm nội bộ: IT thu hồi ngoài hệ thống rồi xác nhận kèm bằng chứng (`QĐ-49b`).
- **FR-2.5:** Tách **ý định nghiệp vụ** khỏi **thực thi kỹ thuật**. Assignment ghi nhận quyết định của tổ chức; Provisioning Task ghi nhận việc tạo/xóa tài khoản thật phía nhà cung cấp, với kênh thực hiện là `Connector` hoặc `Manual`, kèm trạng thái, số lần thử lại và lỗi gần nhất. Tác vụ lỗi vĩnh viễn hoặc hết lượt thử lại (số lượt là cấu hình) ⟹ IT Admin chọn **thử lại**, **chuyển làm tay** kèm bằng chứng, hoặc **đóng là thất bại** với lý do bắt buộc; chỉ khi đóng mới là kết cục cuối — Request/Assignment thất bại, khoản cam kết được giải phóng (`FR-5.8`), người yêu cầu được báo (`QĐ-62i`). Lời mời của nhà cung cấp chưa được chấp nhận: seat vẫn bị chiếm, đối soát tiếp tục; sau **N** ngày nhắc nhân viên và IT Admin; sau **M** ngày IT được thu lại lời mời và đóng tác vụ thất bại có lý do (N, M cấu hình được — `QĐ-62j`).
  > *Lý do:* cho phép mô tả đúng tình huống "đã duyệt, đã ghi nhận, nhưng chưa tạo được tài khoản thật".
- **FR-2.6:** Hệ thống chạy job đối soát định kỳ — **mặc định hằng ngày**, cấu hình được (`OI-14h`) — giữa dữ liệu nội bộ và dữ liệu phía nhà cung cấp (với các app có connector). Sai lệch được ghi nhận thành bản ghi Discrepancy với hai loại: *có trong hệ thống nhưng không có ở nhà cung cấp*, và *có ở nhà cung cấp nhưng không có trong hệ thống*.
  > *Loại thứ hai là phát hiện quan trọng:* nghĩa là có người được cấp quyền ngoài quy trình.

  **Ranh giới với đối soát khoản chi** (`QĐ-34a`): ngoại lệ đối soát của **một khoản chi** trên sao kê (`FR-6.4`) **không** là và **không** tự sinh `Discrepancy`. Khi Finance đánh dấu *lỗi tính tiền của nhà cung cấp*, mục ngoại lệ đóng kèm ghi chú bắt buộc, không có bước quyết của Người duyệt chi; nếu khoản chi đã gắn một hóa đơn đang có `Discrepancy` mở thì màn đối soát chỉ **hiển thị** hồ sơ đó.
- **FR-2.7:** Một nhân viên không được có hai Assignment đang hiệu lực trên cùng một Subscription tại cùng thời điểm. Các khoảng hiệu lực của cùng cặp (nhân viên, thuê bao) không được chồng lấn.
- **FR-2.9:** **Chỉ tài khoản công ty** (`QĐ-54c`). Mọi quyền trả phí được cấp trên tài khoản gắn **email công việc thuộc tên miền công ty** (Google Workspace hoặc Microsoft 365 của công ty); hệ thống **không** ghi nhận Assignment trả phí cho tài khoản cá nhân. Tài khoản cá nhân được công ty trả tiền đi qua đối soát chi phí/Shadow IT (mục 5.6). **Owner/admin workspace phía nhà cung cấp luôn là tài khoản IT của công ty**, không bao giờ là tài khoản cá nhân của nhân viên — để workspace không bị mồ côi khi người đó nghỉ. Với gói K2 vẫn phải *thêm người* vào workspace (mời, tự tham gia theo tên miền, hoặc SCIM ở K3), nhưng chỉ nhận email công ty. Khóa tài khoản công ty chặn đăng nhập vào mọi công cụ dùng đăng nhập công ty, nhưng **không** tự dừng tính tiền — IT vẫn gỡ seat ở từng nhà cung cấp.
  > *Giới hạn demo:* nhóm không có tenant công ty (`RB-4`); phần này được **mô phỏng** bằng dữ liệu và phải nói rõ khi trình bày.
- **FR-2.10:** **Kho khóa bản quyền** cho gói K4 (`QĐ-54b`). IT Admin import lô khóa của một khoản mua; khóa lưu **mã hóa**, hiển thị che bớt, chỉ IT Admin xem đầy đủ khi cấp và **mỗi lần xem ghi Audit Trail**. Mỗi khóa gắn với tối đa **một** Assignment đang hiệu lực tại một thời điểm, kèm thiết bị công ty đã cài. Thu hồi = gỡ kích hoạt; khóa **về kho** nếu điều khoản cho chuyển máy (`FR-1.10` điểm 4), nếu không thì chuyển *ngừng dùng*. Sức chứa của khoản mua `K4` = **min(số đã mua, số khóa còn dùng được)**; khóa *ngừng dùng* không tính; số khóa khác số đã mua ⟹ cảnh báo IT Admin (`INV-01`, `QĐ-66g`).
- **FR-2.11:** **Tài khoản cá nhân, gói team và tài khoản dùng chung là ba khái niệm khác nhau** (`QĐ-54d`):

  | Khái niệm | Ví dụ | Cách xin | Ai chịu trách nhiệm | Chi phí |
  | --- | --- | --- | --- | --- |
  | Tài khoản cá nhân (mặc định) | Mỗi người một lần đăng nhập | Mỗi người một yêu cầu | Người được cấp | Cost Center của phòng người đó |
  | **Gói team** — nhiều tài khoản cá nhân trong một workspace | Gói Business cho 10 người: vẫn 10 lần đăng nhập riêng | Trưởng phòng gửi **một yêu cầu theo nhóm** kèm danh sách người ⟹ hệ thống tạo **một Assignment cho mỗi người** | Từng người được cấp | Như trên |
  | **Tài khoản dùng chung** — một bộ đăng nhập cho nhiều người | Một tài khoản thiết kế cho cả phòng, một tài khoản host họp | Một người đại diện xin; **chỉ khi chính sách chia sẻ của gói cho phép** (`FR-1.10`) — không cho phép thì yêu cầu bị từ chối ở bước đánh giá của IT; phần mềm đã có trong danh mục (nhánh (a)/(b)) ⟹ **chặn ngay lúc gửi** (`QĐ-66j`) | **Trưởng phòng** (mặc định) hoặc nhân viên được chỉ định; giữ danh sách người đang dùng | Cost Center `Unit` của phòng; dùng chung **toàn công ty** thì `Company` (mục 4.5) |

  Tài khoản dùng chung bị loại khỏi rule ghost seat nhưng vẫn tính chi phí (mục 4.5). Hệ thống **không lưu mật khẩu** dùng chung — mật khẩu thuộc trình quản lý mật khẩu của công ty, ngoài phạm vi. Rủi ro phải nêu khi xét duyệt: vi phạm điều khoản có thể bị khóa tài khoản; không truy được ai làm gì; mã xác thực hai lớp chỉ gửi về một thiết bị; dữ liệu của nhiều người trộn lẫn. Khi một thành viên rời nhóm, hệ thống tạo việc cho IT **đổi mật khẩu/thiết bị xác thực** và cập nhật danh sách. Thành viên **điều chuyển phòng** ⟹ tư cách thành viên kết thúc tại ngày hiệu lực; còn cần thì xin lại theo luồng thường (`QĐ-62g`). Đổi mật khẩu là **tác vụ IT riêng** có cảnh báo; hồ sơ thu hồi/nghỉ việc hoàn tất khi tác vụ **đã được tạo** (`QĐ-62p`). **Thêm thành viên** vào tài khoản dùng chung đã có đi qua yêu cầu thường (trưởng phòng duyệt nhu cầu, IT cập nhật danh sách); người chịu trách nhiệm không phải trưởng phòng do **trưởng phòng chỉ định**, IT Admin ghi lại (`QĐ-66n`).
- **FR-2.12:** **Bàn giao dữ liệu trước khi thu hồi; không kế nhiệm license** (`QĐ-56b`, `QĐ-56c`, `QĐ-58d`). Khi nhân viên nghỉ việc, toàn bộ quyền cá nhân bị thu hồi; **không** chuyển license cho người kế nhiệm — seat về kho (K2), hủy gia hạn (K1) hoặc khóa về kho (K4). Nhưng **dữ liệu của công ty phải được bàn giao trước** khi gỡ người dùng, theo *lưu ý trước khi thu hồi* của từng gói (`FR-1.9`); trưởng phòng xác nhận *đã bàn giao* hoặc *không cần*. Bàn giao **không** chặn thu hồi quá hạn (hạn `OI-14c`). **Nghỉ đột ngột** (chuyển thẳng *đã nghỉ việc*): đăng nhập bị chặn ngay (`FR-8.9`); riêng gói có lưu ý *mất dữ liệu khi gỡ*, việc gỡ ở nhà cung cấp chờ trưởng phòng xác nhận bàn giao **hoặc** tới hạn cấu hình được (mặc định **1 ngày làm việc**), gói khác gỡ ngay; trong thời gian giữ seat vẫn tính phí và hiện là `G2` (`QĐ-62e`). **Thu hồi khác nghỉ việc** — tự hoàn trả, trưởng phòng báo không cần, sau điều chuyển, ghost seat — hiện lưu ý của gói và **người kích hoạt thu hồi** xác nhận trước khi gỡ ở nhà cung cấp (ca điều chuyển: trưởng phòng mới); không chặn sau hạn ngắn (`QĐ-62f`); xác nhận chỉ cần với gói có lưu ý *dữ liệu sẽ mất*, gói khác chỉ hiện lưu ý (`QĐ-66p`). **Bốn ca do IT thực hiện** — hết hạn quyền có thời hạn, giảm/hủy thuê bao, không hợp thức hóa, thực thi lại sau sai lệch với nhà cung cấp — do **IT Admin** ghi xác nhận đã xử lý bàn giao trước khi gỡ, cũng không chặn sau hạn ngắn (`QĐ-63a`). IT Admin chỉ ghi nhận việc bàn giao: không là chủ sở hữu dữ liệu, không duyệt nhu cầu hay chi phí (`SoD-5`, `SoD-7`); xác nhận bàn giao tách khỏi kết quả thu hồi, do tác vụ thu hồi ghi (`QĐ-63b`, `QĐ-62i`). **Seat vừa được trưởng phòng quyết *Thu hồi* (ghost seat) vừa nằm trong phần vượt khi giảm thuê bao** chỉ có một tác vụ thu hồi và do **trưởng phòng đó** xác nhận bàn giao, IT Admin không xác nhận thêm; đã có xác nhận hợp lệ thì dùng lại (`QĐ-64a`; phạm vi và giới hạn ở `QĐ-64b`). Quy tắc này áp cả khi seat đã quyết *Thu hồi* nằm trong **hủy toàn bộ thuê bao**, **hết hạn quyền có thời hạn** hoặc **thực thi lại** (`QĐ-66u`). Thuê bao **hết hạn** vì không tự gia hạn và không có quyết định gia hạn được xử lý **như hủy toàn bộ**: IT thu hồi trước ngày kết thúc, IT Admin xác nhận bàn giao (`QĐ-66v`). Phòng chưa có trưởng phòng ⟹ việc xác nhận chờ, không giao người khác; hết hạn thì thu hồi tiếp (`QĐ-62c`). Checklist `BM-08`: **(1)** bàn giao dữ liệu → **(2)** IT gỡ khỏi workspace, hủy gia hạn gói cá nhân hoặc thu khóa → **(3)** khóa tài khoản công ty → **(4)** seat trống; tiết kiệm chỉ ghi theo `FR-4.15`.

  **Ca tài khoản dùng chung:** người rời là *thành viên* ⟹ IT đổi mật khẩu/thiết bị xác thực · người rời — do **nghỉ việc hoặc điều chuyển phòng** — là *người chịu trách nhiệm* ⟹ phải chỉ định người mới **trước ngày hiệu lực** (mặc định trưởng phòng; trưởng phòng rời thì trưởng phòng mới) — ghi bàn giao/điều chuyển **không** bị chặn, chỉ nhắc; tới ngày hiệu lực chưa có ⟹ cảnh báo và hồ sơ **không đóng được** (`QĐ-66i`) · phòng giải thể hoặc gộp ⟹ chuyển sang phòng nhận hoặc đóng. Ca *người rời là owner workspace phía nhà cung cấp* không xảy ra vì owner luôn là tài khoản IT (`FR-2.9`).
  > *Vì sao bắt buộc bàn giao trước:* hành vi khi gỡ thành viên khác nhau theo nhà cung cấp và theo gói, và có ca **mất dữ liệu không khôi phục được**. Tra ngày 08/10/2026 tại tài liệu trợ giúp chính thức: ChatGPT Business — dự án và GPT của người bị gỡ chuyển cho owner, nhưng cuộc trò chuyện **không** chuyển và owner không xem được ([OpenAI](https://help.openai.com/en/articles/8266418)); Figma — tệp có thể thành *không có chủ sở hữu*, bản nháp ở gói Starter/Professional **bị xóa vĩnh viễn** ([Figma](https://help.figma.com/hc/en-us/articles/360040453453)); Canva Teams — phải chọn *chuyển thiết kế rồi gỡ*, nếu không người bị gỡ mất quyền vào thiết kế ngay ([Canva](https://www.canva.com/help/article/manage-members/)); Claude Team — mất quyền ngay, gỡ thành viên **không** được hoàn tiền ngay, seat trống dùng lại được ([Anthropic](https://support.claude.com/en/articles/9267289)). Điều kiện từng gói có thể đổi; IT ghi lại ở *lưu ý trước khi thu hồi* khi rà soát điều khoản (`FR-1.10`).

### 5.3. Phân hệ Quản lý Tổ chức & Luồng Phê duyệt

Việc dùng người quản lý làm approver và áp dụng approval nhiều bước là mô hình access governance phổ biến. Microsoft Entra hỗ trợ approver là quản lý trực tiếp, quản lý cấp hai hoặc approver xác định động, đồng thời hỗ trợ multi-stage approval. [Microsoft Learn – Dynamic approval](https://learn.microsoft.com/en-us/entra/id-governance/entitlement-management-dynamic-approval) [Microsoft Learn – Request process](https://learn.microsoft.com/en-us/entra/id-governance/entitlement-management-process) Nguyên tắc này phù hợp với NIST SP 800-53 AC-2 về phê duyệt, tạo, thay đổi, vô hiệu hóa và review account định kỳ. [NIST SP 800-53 Rev. 5](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final)

- **FR-3.1:** Quản lý cấu trúc tổ chức **Công ty → Phòng ban → Chức vụ → Nhân sự** (`QĐ-52a`, `QĐ-52b`). Phòng ban là **một cấp phẳng** dưới công ty (không có phòng cha–con). Mỗi phòng có **đúng một trưởng phòng** có hiệu lực và **một người làm trưởng tối đa một phòng** (`INV-19`, `QĐ-58a`); mỗi phòng gắn **đúng một** Cost Center loại `Unit`. Báo cáo gom **theo phòng ban** và Cost Center. **Danh mục Cost Center** gồm hai loại `Unit` và `Company`, do **Finance** tạo, sửa và ngừng dùng; mã chưa có bị từ chối khi import (`FR-9.7`, `OI-04`). *Ngoại lệ cài đặt:* lệnh khởi tạo tạo Cost Center `Unit`, phòng và chức vụ **đầu tiên** (`FR-9.8`, `QĐ-67a`). Đổi tên phòng hay đổi trưởng phòng **không** đổi Cost Center; tách/gộp phòng ⟹ Cost Center mới, Cost Center cũ ngừng dùng, lịch sử giữ nguyên. **Dự án** chỉ là thông tin mô tả trong hồ sơ phòng — không phải Cost Center, không có thành viên, không phải cấp duyệt. **Trưởng phòng phải là thành viên** của chính phòng đó tại ngày hiệu lực; người ngoài phòng phải được điều chuyển vào trước (`QĐ-66a`). **Ngừng phòng** chỉ khi không còn thành viên, tài khoản dùng chung hay việc đang mở; gộp/tách phòng **không** có thao tác hàng loạt — Finance tạo Cost Center mới, IT tạo phòng mới rồi điều chuyển từng người qua `MF-7` cùng ngày hiệu lực (`QĐ-66b`).
- **FR-3.2:** Employee tạo request cấp mới, đổi gói, gia hạn có thời hạn hoặc hoàn trả seat, kèm lý do nghiệp vụ và thời hạn cần sử dụng; Cost Center lấy theo phòng của người yêu cầu, tên dự án (nếu có) chỉ là ngữ cảnh. Trưởng phòng có thể tạo request thay nhân viên trong phòng khi onboarding và gửi **yêu cầu theo nhóm** cho gói team (`FR-2.11`). Người thụ hưởng phải là nhân viên phòng của trưởng phòng; request ghi **người tạo** và **người thụ hưởng** riêng. Việc trưởng phòng tạo thay ghi nhận bước nhu cầu đã được xác nhận; phần mà chính trưởng phòng là người thụ hưởng đi theo `FR-3.3` — Người duyệt chi xác nhận nhu cầu; trưởng phòng là Người duyệt chi ⟹ approver dự phòng (`FR-3.6`). Yêu cầu theo nhóm được xét theo từng người thụ hưởng (`QĐ-62a`) — kể cả bước duyệt chi: Người duyệt chi quyết **từng người** trên cùng một bước; **một** khoản cam kết cho Request bằng tổng phần được duyệt; rút một phần thì giải phóng phần đó (`QĐ-66m`). Hồ sơ đi kèm theo mục 5.13.
- **FR-3.3:** Hệ thống tự xác định người duyệt **bước nhu cầu** là **trưởng phòng** của người yêu cầu tại thời điểm gửi (`QĐ-52c`). Người yêu cầu không được tự phê duyệt request của chính mình (`SoD-4`). **Trưởng phòng tự gửi yêu cầu ⟹ bước nhu cầu do Người duyệt chi đảm nhận**; nếu trưởng phòng đó **chính là** Người duyệt chi ⟹ approver dự phòng ở gốc (`FR-3.6`). Phòng **chưa có** trưởng phòng ⟹ approver dự phòng ở gốc.
- **FR-3.4:** Định tuyến request theo loại:

  | Nhánh | Tình huống | Chuỗi phê duyệt |
  | ----- | ---------- | --------------- |
  | **(a)** | Phần mềm đã có trong danh mục, còn seat trống, không phát sinh chi phí — **cấp quyền trên seat đã mua, không phải yêu cầu mua** (`QĐ-29a`). Phần mềm nội bộ đã có trong danh mục, không phí cũng đi chuỗi này nhưng **không** kiểm sức chứa seat (ghi chú 2) | Employee → trưởng phòng → IT Admin. Người duyệt chi thấy tổng hợp trong báo cáo quy trình (`FR-5.11`) |
  | **(b)** | Phần mềm đã có trong danh mục nhưng cần mua thêm seat, nâng gói hoặc vượt ngân sách | Employee → trưởng phòng → **Người duyệt chi** *(snapshot ngân sách, tùy chọn hỏi Finance)* → hệ thống tạo khoản cam kết → song song: **Finance ghi nhận ngân sách** ∥ IT Admin mua/cấp seat |
  | **(c)** | Phần mềm **trả phí/có bản quyền** chưa có trong danh mục | Employee → trưởng phòng → IT Admin đánh giá danh mục, rủi ro và **mức kiểm soát** (`FR-3.19`) → **Người duyệt chi** *(snapshot ngân sách và tùy chọn hỏi Finance, **chỉ khi có chi phí**)* → [khoản cam kết và Finance ghi nhận, **chỉ khi có chi phí**] ∥ IT Admin thực hiện |

  Chuỗi phê duyệt được lưu dưới dạng **chính sách cấu hình được**, không hard-code trong mã nguồn.

  > **Khi nào cần Người duyệt chi** (`QĐ-22`): khi và chỉ khi Request **làm thay đổi tiền hoặc danh mục của công ty** — *thay đổi danh mục* nghĩa là **đưa phần mềm bên ngoài có trả phí hoặc có bản quyền vào danh mục**, vì thêm một phần mềm là thêm một nơi dữ liệu công ty nằm và thêm một đối tượng phải quản trị. Request làm **phát sinh khoản chi** — kể cả liên quan phần mềm nội bộ — luôn qua Người duyệt chi theo nhánh (b)/(c). Nhánh (a) **không** đi qua Người duyệt chi — nếu đi qua, người đó thành nút thắt và tự tạo lại PP-5. Finance **không** nằm trên đường duyệt: người quyết thấy ngân sách qua snapshot và hỏi Finance khi cần (`FR-3.14`, `QĐ-29b`).
  >
  > **`FR-3.4c-1` — Hợp thức hóa Shadow IT dùng đúng bước duyệt của nhánh (c)** (`DQ-06`, mentor/GVHD xác nhận 21/09/2026). Khi một ứng dụng ngoài danh mục được phát hiện và được đề nghị đưa vào danh mục (`WF-17`), **quyết định hợp thức hóa chính là quyết định của nhánh (c)** và thuộc **Người duyệt chi**. Bốn hệ quả bắt buộc:
  >
  > 1. Quyết định **không** thuộc IT Admin — giao cho IT là trao thẩm quyền chi cho IT, trái `SoD-5`.
  > 2. IT Admin giữ phần việc **kỹ thuật**: đánh giá danh mục, rủi ro và mức kiểm soát (chỉ là đầu vào — cổng *không kiểm soát được* của `FR-3.19` **không** áp ở đây, `QĐ-58d`), và thu hồi/chuyển hướng người dùng khi không được duyệt.
  > 3. Khi được duyệt, `WF-09` được gọi sau **chỉ để cấp quyền** — **không** duyệt chi lần thứ hai.
  > 4. **Finance** và **Super Admin** không trở thành người duyệt trong đường này (`QĐ-29b`, `SoD-3`).
  >
  > **Các đường đặc biệt** (`QĐ-49h`, `QĐ-50a`, `QĐ-52c`, `QĐ-53c`, `QĐ-54d`):
  >
  > 1. **Công cụ miễn phí bên ngoài:** nếu IT đánh giá công cụ được yêu cầu là **phần mềm miễn phí bên ngoài**, IT **đóng yêu cầu** với lý do *"phần mềm miễn phí bên ngoài — ngoài phạm vi quản lý"* kèm hướng dẫn theo chính sách công ty; **không** qua Người duyệt chi và **không** thêm vào danh mục.
  > 2. **Phần mềm/dịch vụ nội bộ:** IT Admin **đăng ký vào danh mục** cùng Business Owner (`FR-1.1`), **không** có bước Người duyệt chi và **không** qua nhánh (c). Yêu cầu quyền cho phần mềm nội bộ **đã có trong danh mục**, **không phát sinh chi phí**: Employee → trưởng phòng → IT Admin thực hiện thủ công ngoài hệ thống rồi xác nhận kèm bằng chứng; **không** kiểm sức chứa seat và **không** tạo khoản cam kết. Phần mềm nội bộ **chưa có** trong danh mục: request vào bước *phần mềm chưa có trong danh mục*; khi IT xác định đó là phần mềm công ty tự xây dựng, IT đăng ký vào danh mục rồi request đi tiếp đường không phí — **không** đi tiếp phần duyệt chi của nhánh (c).
  > 3. **Cổng mức kiểm soát ở nhánh (c):** *không kiểm soát được* ⟹ IT **từ chối ngay**, **không** tới Người duyệt chi (`FR-3.19`). Đây là cổng kỹ thuật như mục 1, **không** trao thẩm quyền chi cho IT.
  > 4. **Tài khoản dùng chung** chỉ xin được khi chính sách chia sẻ của gói cho phép (`FR-2.11`); **yêu cầu theo nhóm** cho gói team đi cùng nhánh, mỗi người một Assignment.

- **FR-3.5:** **Không có ủy quyền duyệt** (`QĐ-27`). Mỗi bước được hệ thống gán cho **đúng người có thẩm quyền** theo `FR-3.3`, `FR-3.6`, `FR-3.13`, `FR-3.15`; người đó tự nhận và tự quyết. Người được giao **không** được chỉ định người thay thế, **không** chuyển quyền duyệt thủ công, và hệ thống **không** tạo ứng viên song song. Người duyệt vắng hoặc nghẽn thì xử lý theo `FR-3.8` — nhắc và cảnh báo, **không** đổi người. Người được giao chỉ đổi khi dữ liệu tổ chức hoặc cấu hình vai trò đổi thật, theo `FR-3.16`.
  > *Lý do:* chức năng giao người khác duyệt thay làm luồng khó truy vết và khó kiểm soát; nếu người được giao lại nghẽn thì cả chuỗi vẫn kẹt. Tốc độ xử lý (`PP-5`) được giữ bằng SLA đo từng bước và cảnh báo backlog có người chịu trách nhiệm, không bằng việc chuyền quyền.
- **FR-3.6:** Tổ chức phải khai báo **approver dự phòng ở gốc**, áp khi **phòng chưa có trưởng phòng** hoặc khi **trưởng phòng gửi yêu cầu mà chính trưởng phòng đó là Người duyệt chi** (`QĐ-52c`). **Super Admin cấu hình một Employee cụ thể** giữ vai này; người đó duyệt **với tư cách vai Manager**, không phải một vai trò mới (`QĐ-02`). Approver dự phòng **chỉ** thay trưởng phòng ở **bước nhu cầu**. Các việc khác vốn giao trưởng phòng — rà soát sau điều chuyển, xác nhận ghost seat, xác nhận bàn giao dữ liệu, bối cảnh Shadow IT — **chờ** tới khi phòng có trưởng phòng; quyền giữ nguyên; IT Admin và Super Admin thấy cảnh báo *phòng thiếu trưởng phòng*; việc đang mở chuyển cho trưởng phòng mới, hạn không đặt lại (`QĐ-62c`).
  > *Vì sao không giao cho IT Admin:* như vậy IT Admin vừa quyết nhu cầu vừa thực hiện cấp seat, phá `SoD-5`. Vì sao không giao Finance: Finance kiểm soát ngân sách, không nắm nhu cầu nghiệp vụ của người dùng. Giữ đúng nguyên tắc *ba loại quyết định, ba người khác nhau* ở mục 4.2. Vai Manager là vai **phái sinh** theo `ADR-08` nên cơ chế đã có sẵn.
- **FR-3.7:** Manager xem usage summary và request/assignment của nhân viên **trong phòng mình**, cùng danh sách công cụ đang dùng của phòng (`FR-3.17`); không xem raw activity log, hợp đồng hoặc dữ liệu tài chính toàn công ty.
- **FR-3.8:** Mỗi bước phê duyệt có **thời hạn xử lý (SLA)**, tính theo **giờ làm việc** của tổ chức, mặc định **2 ngày làm việc** cho mỗi loại bước; Super Admin chỉnh theo loại bước (`FR-8.2`, `OI-14a`). Quá hạn, hệ thống **nhắc lại** người được giao và **thông báo** cấp trên của người đó nếu có — cấp trên của nhân viên là trưởng phòng, của trưởng phòng là Người duyệt chi (`QĐ-52c`). **Escalate chỉ là thông báo** — hệ thống **không** đổi người duyệt, **không** tự phê duyệt và **không** tự từ chối (`QĐ-28d`). Bước **quyết định khoản chi chưa có căn cứ** (`FR-6.4`) theo cùng quy tắc: đồng hồ bắt đầu khi mục ngoại lệ được **chuyển** cho Người duyệt chi, **không** dừng khi hỏi Finance, **không** tự quyết khi quá hạn; không tính vào `KPI-2`, `KPI-4` (`QĐ-35a`).

  **Cảnh báo nghẽn** (`QĐ-27`): mỗi bước lưu người được giao, thời điểm nhận, tuổi SLA và số lần nhắc. Khi số bước đang chờ của một người vượt **ngưỡng backlog** do Super Admin cấu hình (`FR-8.2`), hoặc có bước quá SLA, hệ thống cảnh báo Super Admin và đưa vào **bảng theo dõi nghẽn**. Super Admin chỉ được sửa cấu hình, dữ liệu tổ chức hoặc ghi nhận sự cố — **không** được phê duyệt thay (`SoD-1`).

  **Hạn rà soát sau điều chuyển** (`MF-7`, `QĐ-50b`): trưởng phòng **mới** rà soát công cụ **ngoài bộ công cụ chuẩn** của phòng mới (`FR-3.18`) trong **5 ngày làm việc** kể từ ngày hiệu lực; số ngày do Super Admin cấu hình (`FR-8.2`). Đây **không** phải một bước phê duyệt của request. Quá hạn, hệ thống **nhắc trưởng phòng** và **cảnh báo IT Admin** — **chỉ** hai việc đó: **không** tự thu hồi, **không** giao lại cho người khác, **không** tự quyết. Chưa có quyết định ⟹ quyền giữ nguyên.
- **FR-3.9:** Hệ thống đo và hiển thị **thời gian trung bình từ lúc gửi request tới lúc hoàn tất cấp phát**, tách theo từng bước, phục vụ PP-5 và KPI-2.
- **FR-3.10:** Trong đợt review Ghost Seat hoặc access review, Manager chọn Keep, Reclaim hoặc Exempt kèm lý do. Lựa chọn Exempt **bắt buộc có thời hạn** (tối đa 12 tháng), sau đó tự động quay lại hàng đợi review.
  Quyết định có **hạn** cấu hình được; quá hạn chỉ nhắc trưởng phòng và cảnh báo IT Admin, khuyến nghị vẫn mở, **không** tự quyết (`QĐ-66t`). Nhân viên điều chuyển khi khuyến nghị đang chờ ⟹ khuyến nghị chuyển cho **trưởng phòng mới**, hạn không đặt lại; miễn trừ giữ tới hết hạn (`QĐ-66r`).
  > *Lý do:* nếu Exempt không có hạn, sau vài tháng nó trở thành nợ kỹ thuật vĩnh viễn.
- **FR-3.11:** Hệ thống gửi thông báo trạng thái cho người yêu cầu và approver; lưu người phê duyệt, thời điểm, quyết định, lý do, trạng thái thực hiện và Audit Trail cho mọi request. Kênh MVP: **trong ứng dụng** cho mọi thông báo; **thư điện tử** (khi được cấu hình) chỉ thêm cho cảnh báo trước hạn báo hủy (`FR-1.4`) và thông báo trước khi theo dõi (`FR-10.4`); lỗi gửi thư không được coi là đã thông báo (`OI-09b`). **Ngoại lệ:** thư điện tử vòng đời tài khoản — lời mời, liên kết đặt lại mật khẩu, thông báo đã đổi/đặt lại mật khẩu (không chứa mật khẩu hay mã) — là cơ chế bảo mật, không thuộc kênh thông báo nghiệp vụ (`QĐ-46`). **Ứng dụng mobile** dùng hộp thông báo trong ứng dụng, **không** push (`QĐ-61c`).
- **FR-3.12:** Khi chuỗi xác định người duyệt của một bước **không còn ai hợp lệ** — người duyệt theo `FR-3.3` và approver dự phòng ở gốc đều trùng người yêu cầu hoặc không tồn tại — hệ thống **giữ Request ở trạng thái chờ**, gắn cờ **`chưa có người duyệt hợp lệ`**, tiếp tục nhắc và thông báo theo `FR-3.8`, và **thông báo cho Super Admin để cấu hình lại approver dự phòng theo `FR-3.6`**. Ngay khi cấu hình được sửa, hệ thống xác định lại người duyệt và gán tiếp bước đó (`FR-3.16`, `QĐ-13`). Trưởng phòng tự gửi yêu cầu khi **chưa cấu hình** Người duyệt chi cũng theo yêu cầu này — approver dự phòng **không** thay; thông báo cho Super Admin ở ca này là để cấu hình **Người duyệt chi** (`FR-3.13`), không phải approver dự phòng (`QĐ-66k`).
  > **Vì sao việc này không phá `SoD-1`:** Super Admin được yêu cầu **cấu hình** người duyệt, **không** phê duyệt Request. `FR-8.5` và `SoD-1` vẫn giữ nguyên.
  > **Ba lối bị loại bỏ, ghi rõ để không ai hiện thực nhầm:** hệ thống **không** tự phê duyệt (`FR-3.8`, `BR-07.7`), **không** tự từ chối hay tự hủy (bảng ngoại lệ ngay dưới), và **không** giao quyền duyệt cho Super Admin hay IT Admin (`SoD-1`, `SoD-5`). Người yêu cầu vẫn có thể tự rút Request theo quy tắc *cho phép rút tới khi tác vụ cấp phát còn chờ thực thi* ở mục 5.12.3.
  > **Áp cho bước duyệt chi:** khi chưa cấu hình Người duyệt chi, hoặc Người duyệt chi bị xung đột lợi ích mà chưa cấu hình người thay thế (`FR-3.15`), hoặc người thay thế cũng xung đột, bước duyệt chi đi theo đúng yêu cầu này và thông báo Super Admin cấu hình lại. Người duyệt chi **vắng mặt** không thuộc yêu cầu này — xử lý theo `FR-3.8`. Approver dự phòng ở gốc **không** thay được Người duyệt chi, vì người đó duyệt với tư cách **Manager**.
- **FR-3.13:** **Người duyệt chi** (`QĐ-22`). Super Admin cấu hình **một** Employee giữ vai Người duyệt chi, mặc định là CEO. Hệ thống gán bước *Duyệt chi* cho người này ở nhánh (b) và (c) của `FR-3.4`, **ngay sau** bước nhu cầu (nhánh b) hoặc bước IT đánh giá (nhánh c). Bước duyệt chi có SLA riêng (`FR-3.8`), **không** hỗ trợ ủy quyền (`FR-3.5`) và được đo riêng trong KPI-2 (`FR-3.9`). Người duyệt chi cũng quyết định **gia hạn, giảm số lượng hoặc hủy** thuê bao, trên snapshot ngân sách kèm số liệu sử dụng, và có thể hỏi Finance theo `FR-3.14`. Quyết **giảm** xuống dưới số seat đang gán thì Người duyệt chi chọn seat phải thu hồi từ danh sách hệ thống xếp sẵn: đã quyết thu hồi → `G2` → `G3`/`G4` → hoạt động cuối cũ nhất (`QĐ-66x`).
  > *Vì sao chỉ một người, không phải ma trận nhiều ngưỡng tiền:* nhóm trưởng chốt một mức cho MVP. Rủi ro là người này thành nút thắt khi nhiều Request có chi phí dồn về; được giảm nhờ nhánh (a) không đi qua, phát hiện được qua `FR-3.9` và cảnh báo backlog của `FR-3.8`. Nếu KPI-2 cho thấy chậm ở bước này thì mở lại phương án nhiều mức.
- **FR-3.14:** **Thông tin ngân sách cho quyết định chi và ghi nhận của Finance** (`QĐ-22`, `QĐ-29b`). Ba phần:

  **(1) Snapshot ngân sách.** Màn duyệt chi hiển thị sẵn theo Cost Center và kỳ của Request: **ngân sách · thực chi · khoản cam kết đang giữ · còn lại** *(= ngân sách − thực chi − cam kết đang giữ, `FR-5.8`)* · **tổng giá trị Request có chi phí đang chờ duyệt** *(cùng Cost Center và kỳ — `OI-11d`)* · thời điểm dữ liệu. Mọi số tiền tính trên **chi phí thực chịu** — giá trị của Request đang chờ là **chi phí ước tính** (giá cộng thuế không được khấu trừ); GTGT được khấu trừ hiện riêng để tham khảo (`FR-5.13`, `QĐ-60a`). Chưa có ngân sách thì hiện *Chưa có ngân sách*, **không** hiện 0. Snapshot **được chụp lại tại lúc quyết** và lưu làm bằng chứng của bước duyệt chi.

  **(2) Hỏi Finance — tùy chọn.** Người duyệt chi có thể gửi **yêu cầu thông tin ngân sách** tới Finance. Bước duyệt chi **vẫn giao cho Người duyệt chi** (không phải ủy quyền, `FR-3.5`); **đồng hồ SLA của bước không dừng, không đặt lại**; thời gian Finance phản hồi đo riêng (`FR-5.11`). Finance trả lời `Trong hạn mức` / `Vượt hạn mức` / `Chưa có ngân sách` kèm ghi chú; câu trả lời **không duyệt, không chặn**. Người duyệt chi quyết được bất cứ lúc nào, kể cả khi Finance chưa trả lời.

  **(3) Ghi nhận sau duyệt.** Khi Request có chi phí được duyệt, Finance ghi **ý kiến chính thức** trên khoản cam kết vừa tạo, cùng ba giá trị trên. Ghi *Vượt hạn mức* hoặc *Chưa có ngân sách* ⟹ **thông báo** Người duyệt chi; **không** hoàn tác quyết định, **không** dừng cấp phát. Bước ghi nhận có SLA riêng và **không** nằm trên đường chờ tới lúc có tài khoản.
  > *Lý do:* người quyết vẫn có thông tin ngân sách, nhưng Finance không phải bước bắt buộc trước quyết định — tránh hiểu Finance là cửa duyệt, rút ngắn KPI-2, và snapshot tính cả phần đang chờ duyệt nên xử lý tốt hơn Request song song.
- **FR-3.15:** **Người duyệt chi thay thế khi xung đột lợi ích** (`QĐ-28c`). Super Admin cấu hình **trước** **một** Employee giữ vai này *(ví dụ Chủ tịch HĐQT hoặc CFO)*; không lưu được cấu hình người thay thế **trùng** Người duyệt chi (`OI-17`). Khi **và chỉ khi** Người duyệt chi là **người yêu cầu hoặc người thụ hưởng** của một Request cụ thể (`SoD-7`), hệ thống **tạo** bước duyệt chi **của Request đó** cho người thay thế và ghi Audit Trail lý do *xung đột lợi ích*. Người thay thế chịu đủ `SoD-7`, `SoD-8`. Chưa cấu hình, hoặc người thay thế cũng xung đột ⟹ `FR-3.12`.

  **Sáu ràng buộc bắt buộc:** **(1)** chỉ áp khi Người duyệt chi là người yêu cầu hoặc người thụ hưởng · **(2)** người thay thế được Super Admin **cấu hình trước**, không cấu hình theo từng Request · **(3)** **không** do Manager, Người duyệt chi hay người yêu cầu chọn · **(4)** **không** áp cho backlog, vắng mặt hay quá SLA · **(5)** **không** tạo ứng viên song song — bước chỉ có một người được giao · **(6)** **không** dùng để né SLA — xung đột được biết ngay khi tạo bước nên bước được tạo thẳng cho người thay thế, SLA tính từ lúc tạo; chỉ sự kiện dữ liệu của `FR-3.16` mới xác định lại người, và khi đó SLA không đặt lại.
  > *Vì sao không phải ủy quyền:* không ai trong luồng tự chọn người thay; người thay thế là cấu hình tĩnh lập trước và chỉ áp theo điều kiện xung đột trên đúng Request đó, **không** áp khi Người duyệt chi vắng mặt hay bận — hai ca đó vẫn theo `FR-3.8`.
- **FR-3.16:** **Xác định lại người duyệt khi dữ liệu thay đổi thật** (`QĐ-28d`). Hệ thống chạy lại quy tắc định tuyến (`FR-3.3`, `FR-3.6`, `FR-3.13`, `FR-3.15`) cho các bước **đang chờ** **chỉ** khi có một trong các sự kiện: **phòng của người yêu cầu thay đổi** · **trưởng phòng của phòng đó thay đổi** · người được giao chuyển sang *đã nghỉ việc* · Super Admin đổi người giữ vai Người duyệt chi, Người duyệt chi thay thế, hoặc approver dự phòng ở gốc. Audit Trail ghi sự kiện nguồn, người cũ, người mới. **Đồng hồ SLA không đặt lại.** Nghỉ phép, vắng mặt hay backlog cao **không** phải sự kiện kích hoạt. **Phạm vi:** chỉ **người cụ thể** giữ bước được xác định lại; **nhánh và chuỗi loại bước** đã chốt khi gửi yêu cầu giữ nguyên, nên việc sửa chính sách duyệt giữa chừng không ảnh hưởng yêu cầu đang chạy.
  > *Vì sao không phá `FR-3.5`:* người mới là kết quả của quy tắc định tuyến chạy trên dữ liệu tổ chức mới — giống hệt khi Request được gửi sau thay đổi đó — không phải lựa chọn của người đang giữ bước hay của Admin cho một Request cụ thể. Mọi thay đổi phòng ban, trưởng phòng và cấu hình vai trò đều có Audit Trail.
- **FR-3.17:** **Hồ sơ phòng ban và phạm vi IT Admin** (`QĐ-52a`, `QĐ-52d`, `QĐ-58b`). Mỗi phòng có: mã, tên, **chức năng/mô tả công việc**, trưởng phòng, Cost Center `Unit`, **IT Admin phụ trách**, danh sách **dự án** chỉ để mô tả (tên, mô tả, các phòng tham gia, trạng thái) và **bộ công cụ chuẩn** (`FR-3.18`). **Danh sách công cụ đang dùng của phòng** — quyền cá nhân, tài khoản dùng chung, khóa bản quyền đang hiệu lực — là **giá trị tổng hợp**, không nhập tay. **IT Admin phụ trách** quản lý dữ liệu phòng, cấp phát, thu hồi, rà soát và cảnh báo kỹ thuật của các phòng mình đảm nhận; tác vụ của phòng được giao mặc định cho người này. **IT Admin khác được xử lý thay** (ví dụ khi người phụ trách vắng), có ghi Audit Trail — thực thi không phải bước phê duyệt nên `FR-3.5` không áp. Cost Center phải có trước khi tạo phòng (`FR-3.1`).
- **FR-3.18:** **Bộ công cụ chuẩn theo phòng ban × chức vụ** (`QĐ-52e`, `QĐ-58c`). Mỗi cặp (phòng, chức vụ) có một danh sách mục danh mục/gói chuẩn, do **IT Admin cấu hình** — theo đề xuất của trưởng phòng, hoặc chủ động khi danh mục thay đổi (ví dụ một công cụ ngừng dùng hoặc được thay thế). Mỗi lần cập nhật bắt buộc ghi lý do, ghi Audit Trail và **thông báo trưởng phòng**. Khi Employee tạo yêu cầu, hệ thống **hiện bộ chuẩn trước**; yêu cầu **ngoài bộ chuẩn bắt buộc có lý do** và được **gắn cờ** cho trưởng phòng. Khi onboarding, trưởng phòng có thể tạo yêu cầu theo bộ chuẩn cho người mới. Bộ chuẩn **không** tự cấp hay thu hồi quyền của ai — mọi quyền vẫn đi qua `FR-3.4`. Đợt này **không** dùng AI để gợi ý (`QĐ-49e`). Đổi **chức vụ trong cùng phòng** không mở rà soát: quyền đang có giữ nguyên, bộ chuẩn mới áp cho yêu cầu mới (`QĐ-62p`).
- **FR-3.19:** **Cổng mức kiểm soát cho phần mềm mới** (`QĐ-53c`, `QĐ-58d`). Ở nhánh (c), IT Admin hoàn thiện phần đánh giá của `BM-02` và kết luận **mức kiểm soát** của gói định mua (`FR-1.9`): kiểu cấp, có trang quản trị không, xuất được danh sách thành viên/usage không, có SSO không, chính sách chia sẻ và điều khoản (`FR-1.10`), loại dữ liệu sẽ đưa vào. **Không kiểm soát được ⟹ IT Admin từ chối ngay**, thông báo **Employee và trưởng phòng** kèm **lý do bắt buộc** và **gợi ý phương án thay thế** (gói kiểm soát được hoặc công cụ có trong danh mục) — không có phương án nào thì chỉ bắt buộc lý do (`QĐ-66l`); yêu cầu **không** tới Người duyệt chi; Employee gửi yêu cầu mới nếu chọn phương án thay thế. *Một phần* ⟹ đi tiếp; Người duyệt chi thấy mức kiểm soát và rủi ro khi quyết. *Đầy đủ* ⟹ đi tiếp. Cổng này **không** áp cho hợp thức hóa phần mềm ngoài danh mục — ở đó mức kiểm soát chỉ là đầu vào, Người duyệt chi vẫn quyết (`FR-3.4c-1`).

**Các tình huống ngoại lệ phải xử lý** *(chi tiết máy trạng thái nằm ở mục 5.12)*:

| Tình huống | Xử lý |
| ---------- | ----- |
| Người yêu cầu rút request **tới khi tác vụ cấp phát còn chờ thực thi** (`OI-06`) | Cho phép hủy, ghi nhận trạng thái Cancelled; yêu cầu thông tin ngân sách đang mở (nếu có) đóng theo; khoản cam kết (nếu có) **giải phóng ngay**, báo Finance và IT. Tác vụ đã *đang thực thi* thì không rút — dùng hoàn trả sau khi có quyền |
| Người duyệt nghỉ việc giữa chừng | Xác định lại người duyệt theo quy tắc định tuyến trên dữ liệu tổ chức mới (`FR-3.16`); SLA không đặt lại |
| **Người duyệt vắng mặt, nghỉ phép hoặc nghẽn** | **Không** đổi người duyệt, **không** ủy quyền. Nhắc, thông báo cấp trên, cảnh báo backlog cho Super Admin (`FR-3.8`) |
| Đã duyệt nhưng đến bước IT thì hết seat trống | Quay lại **nhánh (b)** — bổ sung bước duyệt chi; không tự động từ chối |
| **Request bị hủy hoặc mua/cấp phát thất bại sau khi đã duyệt chi** | **Giải phóng khoản cam kết** (`FR-5.8`), ghi Audit Trail; seat không được cấp |
| **Finance ghi nhận *Vượt hạn mức* hoặc *Chưa có ngân sách* sau khi đã duyệt chi** | Thông báo Người duyệt chi; quyết định và cấp phát **giữ nguyên**; khoản cam kết vẫn *Đang giữ* |
| **Finance chưa trả lời yêu cầu thông tin khi bước duyệt chi đã quá SLA** | Không dừng SLA, không chặn quyết định; nhắc Finance, cảnh báo nghẽn theo `FR-3.8` như mọi bước |
| **Trưởng phòng của người yêu cầu chính là Người duyệt chi** | Giữ hai bước riêng cho cùng một người; nhật ký gắn cờ *cùng người* (ngoại lệ ghi dưới `SoD-8`) |
| **Trưởng phòng tự gửi yêu cầu** (`QĐ-52c`) | Bước nhu cầu do **Người duyệt chi** đảm nhận; có chi phí thì bước duyệt chi cũng của Người duyệt chi ⟹ hai bước riêng, gắn cờ *cùng người*. Trưởng phòng đó **chính là** Người duyệt chi ⟹ bước nhu cầu tới approver dự phòng ở gốc (`FR-3.6`), bước duyệt chi tới người thay thế khi xung đột (`FR-3.15`) |
| **Phòng chưa có trưởng phòng** | Bước nhu cầu tới approver dự phòng ở gốc (`FR-3.6`); IT Admin thấy cảnh báo *phòng thiếu trưởng phòng* |
| **IT đánh giá phần mềm mới là *không kiểm soát được*** (`QĐ-53c`) | IT từ chối ngay kèm lý do và phương án thay thế; không tới Người duyệt chi (`FR-3.19`) |
| **Người duyệt chi là người yêu cầu hoặc người thụ hưởng** | Bước duyệt chi gán cho **Người duyệt chi thay thế khi xung đột** (`FR-3.15`); chưa cấu hình thì chờ có kiểm soát (`FR-3.12`). Không tự duyệt (`SoD-7`) |
| Provisioning thất bại | Assignment chuyển trạng thái lỗi, sinh tác vụ cho IT Admin, không mất dấu vết |
| Request quá hạn không ai xử lý | Nhắc và thông báo — escalate chỉ là thông báo (`FR-3.8`); không đổi người, không tự duyệt, không tự từ chối |
| **Không còn người duyệt hợp lệ nào trong cả chuỗi** | Giữ ở trạng thái chờ kèm cờ *chưa có người duyệt hợp lệ*; nhắc và thông báo theo `FR-3.8`; **báo Super Admin cấu hình lại approver dự phòng** (`FR-3.12`). Không tự duyệt, không tự từ chối |

### 5.4. Phân hệ Phân tích Tối ưu & Đọc Log hoạt động

#### 5.4.1. Phân loại 5 nhóm lãng phí license

| Mã | Loại | Nguồn dữ liệu | Độ tin cậy | Hành động | Phạm vi MVP |
| -- | ---- | ------------- | ---------- | --------- | ----------- |
| **G1** | Seat đã mua nhưng chưa gán cho ai | Nội bộ | Tất định — hiển thị *Xác định từ dữ liệu nội bộ*, không xếp mức (`QĐ-35b`) | Giảm số lượng khi gia hạn | ✅ Có |
| **G2** | Seat gán cho người **đã nghỉ việc** | Nội bộ | Tất định — như `G1` | Thu hồi ngay | ✅ Có |
| **G3** | Seat đã gán nhưng **chưa từng** có hoạt động | Cần log ngoài | Bắt đầu ở *Cao*, hạ một bậc mỗi yếu tố (`FR-4.14`, `QĐ-35b`) | Kiểm tra rồi thu hồi | ✅ Có |
| **G4** | Seat từng dùng nhưng **đã ngừng** | Cần log ngoài | Như `G3` | Manager xác nhận | ✅ Có |
| **G5** | Seat vẫn dùng nhưng **dùng ít so với gói** | Cần log chi tiết | Thấp | Hạ gói | ❌ Ngoài phạm vi |

> **Điểm cần nhấn:** G1 và G2 **không cần một dòng log bên ngoài nào**, chạy được ngay từ dữ liệu nội bộ với độ chính xác tuyệt đối. G2 đặc biệt quan trọng vì vừa là lãng phí chi phí vừa là lỗ hổng bảo mật — người đã nghỉ việc vẫn còn tài khoản truy cập dữ liệu công ty.

> **`G1`, `KPI-3` chỉ có nghĩa khi có số lượng đã mua** (`QĐ-49a`, `QĐ-49b`). Phần mềm/dịch vụ **nội bộ** không có số lượng đã mua ⟹ không có `G1`; nhận diện `G2`–`G4` cho phần mềm nội bộ **ngoài MVP** (`QĐ-62o`). Thu hồi một quyền khi nhân viên nghỉ việc hoặc điều chuyển chỉ đưa quyền/seat về trạng thái trống — tiết kiệm theo `FR-4.15`.

#### 5.4.2. Yêu cầu về nguồn dữ liệu usage

> **Phạm vi của BRD ở phân hệ này** (`QĐ-59a`): BRD giữ **quy tắc nghiệp vụ** về bằng chứng sử dụng — mẫu cấu hình nguồn, cửa sổ bao phủ, ma trận năng lực, ánh xạ danh tính, luật phát hiện, mức tin cậy và các giới hạn quyền riêng tư. **Cách lấy dữ liệu** — bộ thu thập cụ thể, ma trận nhà cung cấp, chiến lược chứng minh và connector — nằm ở [tệp nghiên cứu tool & vendor](../Research-AI/tool-vendor-usage-research-backlog.md), **bổ sung sau** theo logic nghiên cứu GVHD đã sửa (`QĐ-57d`). Danh sách SaaS demo, báo cáo hiệu quả sử dụng sau khi cấp và cảnh báo cho Employee dựa trên usage chờ kết quả đó.

- **FR-4.1:** IT Admin tải lên file log hoạt động xuất từ hệ thống gốc. Hệ thống hỗ trợ hai hình dạng file:
  - **Dạng tổng hợp** — mỗi người dùng một dòng, thường có sẵn cột ngày hoạt động cuối
  - **Dạng sự kiện** — mỗi dòng một sự kiện, hệ thống tự tổng hợp

  Ngoài file, hệ thống nhận được dữ liệu từ **kết nối nhà cung cấp** và từ **bộ thu thập trên thiết bị công ty** ở dạng tổng hợp theo ngày đã lọc tại nguồn. Mỗi nguồn có mẫu cấu hình, cửa sổ bao phủ và định nghĩa hoạt động riêng (`INV-10`, `INV-11`). **Một sản phẩm được có nhiều nguồn**; nguồn chỉ cho bằng chứng dương không được dùng để kết luận *không hoạt động*. Quy tắc hợp nhất nhiều bộ thu thập: [tệp nghiên cứu tool & vendor](../Research-AI/tool-vendor-usage-research-backlog.md).
- **FR-4.2:** Mỗi nguồn usage được mô tả bằng một **mẫu cấu hình** (template) gồm: ánh xạ cột, loại định danh trong cột actor (email / username / ID), định dạng ngày, múi giờ nguồn, và bảng phân loại loại sự kiện. Thêm một nhà cung cấp mới là thêm một bản ghi cấu hình, **không** viết mã mới.
- **FR-4.3:** Mỗi nguồn usage **bắt buộc** khai báo **cửa sổ dữ liệu bao phủ** (từ ngày nào đến ngày nào). Khai báo tay khi file không tự chứa thông tin này, hoặc suy ra từ dữ liệu khi có thể.
  > *Lý do:* nếu file log chỉ export 30 ngày gần nhất, mọi nhân viên hoạt động ngoài cửa sổ đó sẽ bị kết luận nhầm là "chưa từng hoạt động". Đây là lỗi âm thầm — hệ thống chạy trơn tru nhưng kết luận sai.

  > **`FR-4.3a` — Bao phủ của bộ thu thập** (`DQ-04`): ngày bộ thu thập không chạy là ngày **ngoài cửa sổ bao phủ**, không phải ngày *không sử dụng*. Cách bộ thu thập báo bao phủ: [tệp nghiên cứu tool & vendor](../Research-AI/tool-vendor-usage-research-backlog.md).
- **FR-4.4:** Mỗi nguồn usage khai báo **ma trận năng lực**: có danh sách thành viên hay không, có ngày hoạt động cuối hay không, có chi tiết loại sự kiện hay không, độ dài lịch sử tối đa. Từ đó hệ thống **tự suy ra** nó phát hiện được nhóm lãng phí nào:

  | Năng lực nguồn | Phát hiện được | Không phát hiện được |
  | -------------- | -------------- | -------------------- |
  | Chỉ có danh sách thành viên | G1, G2 | G3, G4, G5 |
  | + ngày hoạt động cuối | G1, G2, G3, G4 | G5 |
  | + chi tiết sự kiện | Toàn bộ | — |

  Giao diện phải hiển thị rõ giới hạn này cho từng ứng dụng, ví dụ: *"Nguồn hiện tại chỉ có danh sách thành viên; hệ thống phát hiện được seat trống và seat của người đã nghỉ việc, chưa đánh giá được mức độ sử dụng."*

#### 5.4.3. Ánh xạ danh tính (Identity Resolution)

- **FR-4.5:** Hệ thống duy trì bảng ánh xạ giữa định danh phía nhà cung cấp và nhân viên nội bộ, lưu: nhà cung cấp, khóa định danh bên ngoài, phương pháp khớp, mức độ tin cậy, người xác nhận.
- **FR-4.6:** Bản ghi không khớp được đi vào **hàng đợi chờ xử lý**, không bị bỏ qua im lặng và không được dùng để kết luận.
- **FR-4.7:** Log gắn vào **Assignment tại thời điểm sự kiện xảy ra**, không gắn trực tiếp vào nhân viên. Gia hạn kỳ thuê bao mở Assignment mới **nối chuỗi** với Assignment kỳ cũ; *ngày hoạt động cuối* và rule `G3`/`G4` đọc **cả chuỗi**, nên việc gia hạn không làm một người thành *chưa từng hoạt động*. Cấp lại sau thu hồi vẫn là Assignment mới **không** nối chuỗi (`QĐ-35c`).
  > *Lý do:* một nhân viên có thể được cấp seat, trả seat, rồi được cấp lại — đó là các Assignment riêng biệt. Nếu gắn vào nhân viên rồi lấy ngày hoạt động lớn nhất, Assignment mới sẽ thừa hưởng lịch sử của Assignment cũ và không bao giờ bị phát hiện.
- **FR-4.8:** Trường hợp có hoạt động nhưng **không tìm thấy Assignment tương ứng** được ghi nhận thành sai lệch (xem FR-2.6) — đây là dấu hiệu seat được cấp ngoài quy trình.

#### 5.4.4. Rule phát hiện

- **FR-4.9:** Trước khi đánh giá, hệ thống loại khỏi phạm vi các trường hợp sau:

  | # | Điều kiện loại trừ | Lý do |
  | - | ------------------ | ----- |
  | 1 | Mô hình giá không phải per-seat | Gói flat-rate/consumption không có khái niệm ghost seat |
  | 2 | Tài khoản dịch vụ (bot, CI, integration) | Không bao giờ "đăng nhập" theo cách thông thường |
  | 3 | Nhân viên đang nghỉ phép dài, đang bàn giao, hoặc **đang là trưởng phòng** (`QĐ-66s`) | Tránh báo động giả; trưởng phòng ít dùng công cụ là bình thường |
  | 4 | Assignment mới tạo dưới ngưỡng ân hạn (mặc định 14 ngày) | Vừa cấp seat, chưa kịp dùng |
  | 5 | Assignment bắt đầu sau khi cửa sổ dữ liệu bắt đầu | Không đủ dữ liệu để kết luận |
  | 6 | Dữ liệu nguồn quá cũ (quá 7 ngày kể từ ngày bao phủ cuối) | Không chạy rule, hiển thị cảnh báo dữ liệu lỗi thời |
  | 7 | Đang trong thời hạn miễn trừ do Manager xác nhận | Tôn trọng quyết định đã có |
  | 8 | Đã có khuyến nghị đang mở cho Assignment đó | Tránh sinh trùng |

  `G1`, `G2` chỉ áp điều kiện **1** và **8**; điều kiện 2–7 là điều kiện về bằng chứng sử dụng và người dùng, chỉ áp `G3`, `G4`. Điều kiện 5 được đọc là: chỉ dùng các ngày bao phủ **từ ngày bắt đầu Assignment** — đủ ngưỡng của `FR-4.12` thì được đánh giá, thiếu thì loại kèm lý do điều kiện 5 (`OI-12a`, `OI-12b`).

- **FR-4.10:** Hệ thống phân biệt ba trạng thái khác nhau của "không có ngày hoạt động":

  | Trạng thái | Nghĩa | Xử lý |
  | ---------- | ----- | ----- |
  | Chưa từng hoạt động | Có dữ liệu bao phủ, người này thực sự không xuất hiện | Kết luận được → G3 |
  | Không có dữ liệu | Chưa import log cho ứng dụng này | **Không** kết luận |
  | Chưa khớp được danh tính | Có hoạt động trong log nhưng không map được | **Không** kết luận, đẩy vào hàng đợi |

- **FR-4.11:** Phân loại sự kiện theo mức ý nghĩa: sự kiện tạo giá trị (chỉnh sửa, tạo file, commit), sự kiện thụ động (xem), và sự kiện chỉ xác thực (đăng nhập, SSO redirect). **Sự kiện chỉ xác thực không tính là hoạt động.**
  > *Lý do:* khi tổ chức bật SSO, nhiều ứng dụng tự đăng nhập mỗi sáng. Nếu tính đăng nhập là hoạt động thì mọi người đều "đang dùng" và kết quả phát hiện về 0.

- **FR-4.12:** Rule phân tầng theo số ngày không hoạt động, ngưỡng cấu hình được:

  | Tầng | Điều kiện mặc định | Hành động |
  | ---- | ------------------ | --------- |
  | Theo dõi | 30–59 ngày | Chỉ hiển thị trên dashboard, **không** gửi thông báo |
  | Cần xem xét | ≥ 60 ngày | Sinh khuyến nghị, gửi Manager xác nhận |
  | Cần xử lý | ≥ 90 ngày, hoặc chưa từng hoạt động, hoặc đã nghỉ việc | Khuyến nghị + thông báo cả IT Admin |

  Tầng **Theo dõi** chỉ hiển thị cho **IT Admin**, **không** hiện trên màn hình của Manager. Manager chỉ nhận thứ cần quyết, từ tầng *Cần xem xét* trở lên — khớp `SoD-2` và nguyên tắc mỗi lần hỏi Manager phải kèm đủ bằng chứng để quyết ngay (`QĐ-09`).

- **FR-4.12b:** **Lịch chạy rule phát hiện** — nhóm `G1` và `G2` chạy **hằng ngày**; nhóm `G3` và `G4` chạy **hằng tuần** (`QĐ-09`).
  > *Lý do:* `G1`/`G2` chỉ dùng dữ liệu nội bộ nên chi phí thấp và kết quả đổi mỗi ngày theo biến động nhân sự. `G3`/`G4` phụ thuộc dữ liệu usage nhập theo đợt, chạy hằng ngày không thêm thông tin mới. Lịch này cấu hình được theo `FR-8.2`.

- **FR-4.13:** Ngưỡng cấu hình theo thứ tự ưu tiên: **theo từng ứng dụng > toàn tổ chức > mặc định hệ thống**. Không có cấp ngưỡng theo phòng ban — hạn mức/ngưỡng theo phòng ngoài phạm vi (`QĐ-57c`).
  > *Lý do:* Figma dùng hàng ngày nên 30 ngày không đụng là bất thường; phần mềm quyết toán thuế chỉ dùng mỗi quý nên ngưỡng chung sẽ báo động giả toàn bộ.

- **FR-4.14:** Mỗi khuyến nghị kèm **mức độ tin cậy** tính từ độ dài không hoạt động, chất lượng dữ liệu (độ dài cửa sổ bao phủ) và độ chắc chắn của phép khớp danh tính. Khuyến nghị hiển thị đầy đủ căn cứ để người dùng phản biện được, ví dụ: *"Không hoạt động 87 ngày (log Figma import ngày 05/08, bao phủ 120 ngày, khớp email chính xác). Ước tính tiết kiệm tại kỳ gia hạn 15/12: 180 USD."*

  **Cách tính** (`QĐ-35b`): điều kiện của `FR-4.9`, `FR-4.10`, `FR-4.11`, `FR-4.12` và `FR-4.14a` là **cổng** — trượt thì **không** có khuyến nghị, không yếu tố nào bù được. `G1`/`G2` hiển thị *Xác định từ dữ liệu nội bộ*, không xếp mức. `G3`/`G4` bắt đầu ở **Cao** và hạ **một bậc** cho mỗi yếu tố: danh tính khớp bằng luật bí danh · định nghĩa hoạt động lỏng (`FR-4.16`) · bằng chứng *không dùng* chỉ từ bộ thu thập · bao phủ dưới 80 % số ngày trong khoảng xét · dữ liệu cũ 4–7 ngày · số ngày bao phủ vượt ngưỡng tầng dưới 14 ngày · tín hiệu mâu thuẫn (đăng nhập sau ngày hoạt động cuối, sai lệch mở, ánh xạ đổi) — 1 yếu tố ⟹ **Trung bình**, từ 2 ⟹ **Thấp**; mỗi yếu tố hiển thị thành câu lý do. Mức tin cậy **không** đổi tầng hay người nhận của `FR-4.12` và **không** hiển thị dạng phần trăm khi chưa có dữ liệu hiệu chỉnh.

  > **`FR-4.14a` — Bộ thu thập là bằng chứng có điều kiện** (`DQ-03`, mentor/GVHD xác nhận 21/09/2026). Dữ liệu từ bộ thu thập trên thiết bị (`FR-4.17`) **chỉ chứng minh** rằng một **tên miền/ứng dụng được quan sát trên một thiết bị công ty đã đăng ký**. Nó **không** xác định được **tài khoản SaaS nào** đang đăng nhập, và đó là **giới hạn thiết kế** chứ không phải khiếm khuyết hiện thực: biết được tài khoản đòi phải đọc cookie hoặc nội dung trang — đúng thứ `ĐK-05` cấm và `ADR-13` thiết kế để máy chủ không bao giờ nhận.
  >
  > Vì vậy, để dùng cho nhóm rule **G3/G4**, bằng chứng từ bộ thu thập **bắt buộc** đi kèm **bằng chứng seat từ nguồn nhà cung cấp** xác nhận đúng người đó đang giữ seat của đúng ứng dụng đó. Bốn ràng buộc phải giữ:
  >
  > 1. **Không** dùng bộ thu thập **một mình** để kết luận G3/G4, và **tuyệt đối không** dùng một mình để thu hồi quyền.
  > 2. Mọi khuyến nghị có dùng nguồn này phải hiển thị nhãn `P-05`: *"Quan sát trên thiết bị công ty — không xác định tài khoản SaaS."*
  > 3. **Không có dữ liệu ≠ không sử dụng.** Ngày ngoài cửa sổ bao phủ (`FR-4.3a`) **không** được đếm thành ngày không hoạt động.
  > 4. Khi cửa sổ bao phủ không đủ ngưỡng của `FR-4.12`, hệ thống trả về **`INSUFFICIENT EVIDENCE`** kèm lý do, **không** hiển thị một con số trông như đã đánh giá xong và **không** sinh khuyến nghị thu hồi.
  >
  > Khuyến nghị vẫn chỉ là **đề xuất**: quyết định giữ/thu hồi/miễn trừ thuộc về Manager qua `Attestation` (`INV-09`). Không có đường nào biến khuyến nghị thành thu hồi tự động.

- **FR-4.16:** Mẫu cấu hình nguồn (FR-4.2) **bắt buộc** khai báo *nguồn này hiểu "hoạt động" là gì* — ví dụ "xem trang từ 2 giây", "có sự kiện bất kỳ trong nhật ký kiểm toán", "đăng nhập thành công". Giá trị này hiển thị kèm mọi khuyến nghị sinh ra từ nguồn đó, và được tính vào mức độ tin cậy: nguồn có định nghĩa lỏng bị hạ mức tin cậy. Với nguồn **bộ thu thập trên thiết bị**, định nghĩa phải khai đúng bản chất quan sát được — *quan sát trên thiết bị công ty*, **không** phải *tài khoản đã đăng nhập* — và nguồn này luôn bị hạ một bậc tin cậy khi đứng riêng (`FR-4.14a`).
  > *Lý do:* Atlassian tính một lượt xem trang 2 giây là hoạt động. Nếu nhận con số ngày hoạt động cuối mà không biết nó có nghĩa gì, hệ thống sẽ kết luận mọi người đều đang dùng và phân hệ phát hiện mất tác dụng — cùng loại sai lầm với việc tính đăng nhập là hoạt động (FR-4.11).

#### 5.4.4b. Thiết bị công ty và bộ thu thập trên thiết bị

Dữ liệu hoạt động theo từng người của nhà cung cấp gần như chỉ có ở gói cao nhất, nên hệ thống cần một nguồn bằng chứng trên **máy công ty cấp**. BRD quy định **điều kiện nghiệp vụ và quyền riêng tư** cho nguồn này; **bộ thu thập cụ thể** được đặc tả ở tệp nghiên cứu.

- **FR-4.17, FR-4.19, FR-4.20 — Bộ thu thập cụ thể** (tiện ích trình duyệt, Desktop Agent phiên người dùng, OpenTelemetry của client AI): đặc tả ở [tệp nghiên cứu tool & vendor](../Research-AI/tool-vendor-usage-research-backlog.md), **chốt lại ở giai đoạn Tools** (`QĐ-59a`). Mọi bộ thu thập được chọn phải thỏa `ADR-13`, `FR-4.18`, `FR-4.21`, `INV-17`, `ĐK-01` → `ĐK-10`, và chỉ là **bằng chứng có điều kiện** theo `FR-4.14a`.
- **FR-4.18:** **Đăng ký thiết bị và xác nhận chủ động.** IT Admin đăng ký thiết bị công ty ↔ nhân viên, có khoảng hiệu lực (`ADR-04`). Trước khi nhận bất kỳ dữ liệu nào, hệ thống hiển thị thông báo theo `FR-10.4` và yêu cầu nhân viên **bấm xác nhận chủ động**; bản ghi xác nhận lưu **phiên bản nội dung thông báo và thời điểm**. **Chưa xác nhận thì không nhận dữ liệu** từ thiết bị đó (`INV-17`). Nhân viên có **nút yêu cầu dừng thu thập**; yêu cầu được ghi nhận theo `FR-10.5`, và khi được xử lý thì thiết bị ngừng được nhận dữ liệu. Nút xác nhận chỉ mở sau khi IT Admin đã lưu bản ký `BM-06` của máy đó (`QĐ-66ad`). Bật lại sau khi dừng: nhân viên **tự xác nhận chủ động lại** (bản ghi xác nhận mới), không ký lại nếu đăng ký thiết bị còn hiệu lực (`QĐ-66ae`). Nhân viên nghỉ việc thì đăng ký thiết bị hết hiệu lực. Một nhân viên có thể có **nhiều** thiết bị đăng ký, mỗi thiết bị xác nhận riêng; thiết bị **dùng chung** nhiều người **không** được đăng ký thu thập trong MVP (điểm mù có ghi nhận; `OI-14d`).
- **FR-4.21:** **Chính sách thiết bị công ty** (`QĐ-57b`, `QĐ-58f`).
  1. **Xác nhận khi nhận máy:** khi bàn giao máy công ty, nhân viên **ký văn bản xác nhận đã biết rõ** chính sách theo dõi trên máy đó. IT Admin lưu bản ký (`BM-06`, `FR-1.5`), và nhân viên xác nhận lại trong hệ thống theo `FR-4.18`. Chưa xác nhận ⟹ không nhận dữ liệu từ máy (`INV-17`) và IT Admin thấy cảnh báo. Văn bản viết là ***xác nhận đã biết rõ***, **không** viết là *đồng ý*.
  2. **Chỉ dùng trên máy công ty:** dịch vụ phần mềm do công ty cấp chỉ được sử dụng trên **thiết bị do công ty cấp**. Máy cá nhân **không** đăng ký và **không** bị thu dữ liệu.
  3. **Sổ thiết bị:** mã tài sản, hệ điều hành, tên máy, người giữ, khoảng hiệu lực. **Không** lưu địa chỉ IP, vì IP thay đổi liên tục và là dữ liệu cá nhân.
  4. **Giới hạn của hệ thống:** hệ thống **không** chặn kỹ thuật việc dùng dịch vụ trên máy cá nhân — chặn theo thiết bị/IP là tính năng của gói Enterprise, ngoài phạm vi. Hệ thống cũng **không** xử lý kỷ luật. Vi phạm do doanh nghiệp xử lý theo nội quy lao động, ngoài phạm vi hệ thống.
  5. **Yêu cầu dừng thu thập** vẫn được nhận và xử lý theo `FR-10.5`. Hệ quả của việc dừng theo nội quy do doanh nghiệp quyết.
  6. Ký văn bản **không** miễn các điều kiện `ĐK-01` → `ĐK-10` (mục 7.7.7). Hệ thống vẫn chỉ thu trên máy công ty, lọc tại nguồn, không thu nội dung, và chỉ dùng cho tối ưu license.
  > *Căn cứ:* quy tắc này khớp **Điều 25 khoản 3 Luật 91/2025/QH15** — biện pháp công nghệ quản lý người lao động *"trên cơ sở người lao động biết rõ biện pháp đó"*; chữ ký là bằng chứng *biết rõ* kiểm chứng được. Nó cũng khớp `ĐK-10` (chính sách nằm trong nội quy lao động). **Còn mở** (`OQ-16`, `OQ-23`): chữ ký lúc nhận máy có được coi là *sự đồng ý tự nguyện* theo Điều 11 hay không. Báo cáo **không** khẳng định đã tuân thủ.

> **Điều kiện pháp lý của mục này** nằm ở **mục 7.7.7** và **`ADR-13`**. Căn cứ chính là **Điều 25 khoản 3 Luật 91/2025/QH15**, đọc nguyên văn: biện pháp công nghệ quản lý người lao động *"chỉ được áp dụng ... phù hợp với quy định của pháp luật và bảo đảm quyền, lợi ích của chủ thể dữ liệu cá nhân, trên cơ sở người lao động biết rõ biện pháp đó"*.

#### 5.4.5. Ước tính tiết kiệm

- **FR-4.15:** Hệ thống tách **hai con số tiết kiệm khác nhau**:
  - *Tiết kiệm có thể thực hiện ngay* — chỉ áp dụng với gói theo tháng hoặc gói có điều khoản cho phép giảm số lượng giữa kỳ
  - *Tiết kiệm tại kỳ gia hạn kế tiếp* — áp dụng với gói cam kết theo năm

  *Chi phí thực sự giảm* nghĩa là **tổng chi phí kỳ mới thấp hơn kỳ cũ** (cùng độ dài kỳ); *tiết kiệm thực hiện* được ghi khi IT Admin ghi kết quả gia hạn hoặc điều chỉnh giữa kỳ đã được nhà cung cấp xác nhận (`QĐ-66w`). Ví dụ: 100 seat × 15 → 88 seat × 18 thì **không** có tiết kiệm.

  > **Đây là điểm quan trọng về tính trung thực của số liệu:** với hợp đồng cam kết theo năm, thu hồi seat giữa kỳ **không tiết kiệm được đồng nào**; tiền chỉ thật khi giảm số lượng tại ngày gia hạn. Báo cáo gộp hai con số này lại là sai lệch.
  >
  > **Thu hồi một quyền không tự ghi nhận tiền tiết kiệm; tiết kiệm chỉ ghi khi hợp đồng/khoản chi thực sự giảm.** License vĩnh viễn: không có tiết kiệm tức thời (seat về lại kho). Cam kết theo năm: chỉ tiết kiệm khi gia hạn. Phần mềm nội bộ: không có số lượng đã mua; một chi phí đã ghi nhận giảm là thay đổi chi phí, không phải kết quả thu hồi quyền (cách ghi nhận ngoài MVP — `QĐ-62o`).

### 5.5. Phân hệ Báo cáo Tài chính & Dự báo

- **FR-5.1:** Biểu đồ tổng chi tiêu phần mềm theo dữ liệu mới nhất đã đồng bộ/import, so sánh với hạn mức ngân sách. Dashboard hiển thị rõ thời điểm cập nhật gần nhất; chỉ gọi là dữ liệu thời gian thực khi nguồn billing/API thực sự hỗ trợ. Tách riêng ba con số **ngân sách — thực chi — khoản cam kết đang giữ** (`FR-5.8`), kèm con số **còn lại = ngân sách − thực chi − cam kết đang giữ**; không cộng thực chi với cam kết đã chuyển thành chi phí lần nữa (`QĐ-24`). Mọi con số so với ngân sách tính trên **chi phí thực chịu**; GTGT được khấu trừ hiển thị ở cột riêng, không trừ vào ngân sách (`FR-5.13`, `QĐ-60a`). **Kỳ ngân sách** là một loại kỳ cho toàn tổ chức (tháng/quý/năm) do Super Admin đặt một lần, mặc định **quý**; không đổi khi đã có ngân sách (`OI-11b`). Finance **được sửa** số tiền ngân sách giữa kỳ với **lý do bắt buộc**, ghi Audit Trail và lịch sử; snapshot đã chụp lúc quyết giữ nguyên (`FR-3.14`); Người duyệt chi được báo. Kỳ **không khóa**: mỗi báo cáo đã phát hành là bản chụp bất biến có thời điểm; khoản đến muộn hiện ở báo cáo sau dưới nhãn *điều chỉnh kỳ trước* (`QĐ-62m`). Báo cáo đã phát hành **không** được phát hành lại; sửa sai cũng hiện ở báo cáo kỳ sau (`QĐ-66ab`).
- **FR-5.2:** Phân loại chi phí theo Cost Center, kèm các chiều nhóm **theo phòng ban** — tổng chi của mọi người thuộc phòng, dựa trên quan hệ nhân viên–phòng có hiệu lực tại thời điểm phát sinh chi phí (`ADR-04`, `QĐ-52a`) — **theo ứng dụng** và **theo nhà cung cấp** (`QĐ-24`). Finance khai báo/sửa phân bổ gói dùng chung theo tỷ lệ và hiệu lực, tổng 100% (`OI-03`).

  **Chi phí phần mềm nội bộ** (`QĐ-49g`): mỗi khoản chi phí đã ghi nhận được Finance gán cho **đúng một Cost Center**; muốn chia thì Finance ghi **nhiều khoản**. Phân bổ theo tỷ lệ (`INV-03`) **chỉ áp cho Subscription**.

  **Khoản chi trên sao kê chưa được hóa đơn giải thích** (`QĐ-50c`): phần chưa được giải thích vẫn là thực chi (`FR-5.4`). Đặt vào Cost Center: **có căn cứ** ⟹ theo căn cứ — căn cứ là subscription ⟹ theo quy tắc phân bổ của subscription đó; căn cứ là khoản cam kết của yêu cầu đã duyệt ⟹ Cost Center của yêu cầu đó (khớp khoản chi **không** đổi trạng thái khoản cam kết, `FR-5.8`); **chưa có căn cứ** ⟹ hiện ở dòng riêng **"Chưa phân bổ Cost Center"** trong thực chi của kỳ, **không** ép vào Cost Center nào. Người duyệt chi **chấp nhận** khoản chi ngoại lệ ⟹ bắt buộc chọn Cost Center lúc quyết; **không chấp nhận** ⟹ vẫn ở dòng *Chưa phân bổ*, nhãn *không chấp nhận* (`QĐ-66z`).

  **Chi phí seat trống** hoặc đã thu hồi mà thuê bao chưa giảm: chia cho các phòng **đang giữ seat** của thuê bao đó theo số seat trong ngày; không ai giữ ⟹ dòng *Chưa phân bổ*; `G1` vẫn hiện ở báo cáo hiệu suất (`QĐ-66aa`). Dòng này là dòng báo cáo, **không** phải một bản ghi Cost Center (xem cảnh báo ở `FR-9.7`).
- **FR-5.3:** Hệ thống hiển thị **cả hai cơ sở ghi nhận chi phí**, có nhãn phân biệt rõ:
  - *Theo dòng tiền* — ghi nhận tại ngày hóa đơn, phục vụ đối soát thanh toán
  - *Theo kỳ* — phân bổ đều theo thời gian sử dụng, phục vụ theo dõi ngân sách

  > *Lý do:* một hóa đơn năm 12.000 USD trả trong tháng 1 sẽ làm vỡ ngân sách tháng 1 và để trống 11 tháng còn lại nếu chỉ dùng cơ sở dòng tiền.

  **Khi nhân viên đổi phòng** (`QĐ-55b`), chi phí *theo kỳ* chia **theo ngày**: mỗi ngày tính vào Cost Center có hiệu lực của nhân viên **ngày đó**. Chi phí đã phát sinh **không** bị viết lại sang phòng mới; *theo dòng tiền*, hóa đơn thuộc Cost Center tại **ngày hóa đơn** và không đổi. Ví dụ: Figma 15 USD/tháng, điều chuyển hiệu lực 16/10 ⟹ 1–15/10 tính cho phòng A, 16–31/10 tính cho phòng B; báo cáo tháng 9 của phòng A giữ nguyên.
- **FR-5.4:** Đối soát hóa đơn với số seat và mức sử dụng, làm rõ khoản chi thuộc phần mềm nào, do đơn vị nào dùng (xử lý PP-3).

  **Hóa đơn là khoản chi đã ghi nhận nội bộ** (`QĐ-34b`). Dòng sao kê/thẻ được nhập **đối chiếu** hóa đơn bằng **phân bổ số tiền** (một khoản chi có thể trả nhiều hóa đơn, một hóa đơn có thể được trả nhiều lần; Σ phân bổ không vượt số tiền mỗi phía; cùng tiền tệ — khác tiền tệ chỉ liên kết tay toàn hóa đơn kèm ghi chú; sửa sai bằng hủy phân bổ có lý do). Thực chi theo dòng tiền (`FR-5.3`) tính từ hóa đơn cộng phần khoản chi **chưa** hóa đơn nào giải thích — cùng một khoản tiền không đếm hai lần. Trạng thái của hóa đơn chỉ là *chưa có khoản chi đối chiếu · đối chiếu một phần · đã đối chiếu đủ — theo sao kê đã nhập*; hệ thống **không** kết luận *đã thanh toán* hay *chưa thanh toán*, và không có chức năng thanh toán.

  **Hóa đơn lệch vì nhà cung cấp tính sai** (`QĐ-49f`). Khi hóa đơn khác thuê bao (số lượng hoặc đơn giá) và xác minh cho thấy nhà cung cấp tính sai: hóa đơn **vẫn nằm trong chi thực tế như đã nhận**; hồ sơ sai lệch (`Discrepancy`, `FR-7.7`) đóng với quyết định *"nhà cung cấp tính sai"* kèm **ghi chú bắt buộc**; bản điều chỉnh (nếu có) đến sau bằng **hóa đơn hoặc điều chỉnh mới**. Hệ thống **không** tự sửa thuê bao hay hóa đơn và **không** có quy trình tranh chấp hay thanh toán (`QĐ-34`). *Hai khoảng chênh khác nhau:* hóa đơn 110 so với thuê bao 100 là **sai lệch hóa đơn**; thuê bao 100 so với 80 Assignment là **seat đã mua nhưng chưa gán** (`G1`, đầu vào của `MF-3`/`MF-4`), không phải sai lệch hóa đơn. Chênh lệch chỉ do **thuế hoặc tỷ giá** được tách riêng theo `FR-5.13`, không mở `Discrepancy`.

  **Phần khoản chi không được hóa đơn nào giải thích** (`QĐ-50c`): vẫn là thực chi theo dòng tiền, **không** đếm hai lần với hóa đơn. Cost Center đặt theo `FR-5.2`. Mục ngoại lệ **vẫn mở** cho tới khi xử lý qua `MF-6` — chỉ Người duyệt chi chấp nhận hoặc không chấp nhận (`FR-6.4`, `FR-3.4c-1`); Finance đối soát và cung cấp bằng chứng nhưng không quyết.

- **FR-5.13:** **Ghi nhận thuế, không tính thuế** (`QĐ-55a`, `QĐ-60a`, `QĐ-60b`).
  1. **Hồ sơ thuế của nhà cung cấp** do Finance khai, chia theo **ai nộp thuế**:
     - *T1 — Trong nước:* hóa đơn điện tử Việt Nam, kể cả đại lý trong nước bán lại SaaS nước ngoài. GTGT 10% hoặc *không chịu thuế* (sản phẩm/dịch vụ phần mềm đủ tiêu chí, license vĩnh viễn) theo đúng hóa đơn.
     - *T2 — Nước ngoài, doanh nghiệp khấu trừ nộp thay* — **mặc định** khi mua dịch vụ của nhà cung cấp nước ngoài qua nền tảng số. Từ 01/07/2026, doanh nghiệp tính GTGT theo phương pháp khấu trừ phải khấu trừ, nộp thay GTGT và TNDN tại thời điểm thanh toán (Luật 48/2024/QH15 Điều 4 khoản 4; Nghị định 252/2026/NĐ-CP Điều 43 khoản 3, Điều 44).
     - *T3 — Nước ngoài, thuế đã được nhà cung cấp hoặc nền tảng thu trên chứng từ* — **ngoại lệ**, ví dụ giao dịch trước 01/07/2026 hoặc doanh nghiệp không dùng phương pháp khấu trừ.

     Mỗi hồ sơ kèm **tỷ lệ ước tính** của từng loại thuế và cờ **được khấu trừ đầu vào** mặc định, đều do Finance nhập.
  2. Request có chi phí, snapshot ngân sách và khoản cam kết hiển thị **giá trước thuế · thuế ước tính** (tách phần được khấu trừ và không được khấu trừ) **· chi phí ước tính · tổng tiền phải trả ước tính**, ghi rõ là *ước tính*.
  3. Hóa đơn ghi **từng dòng thuế đúng như chứng từ**: loại thuế, tỷ lệ, số tiền, *nhà cung cấp thu* hay *doanh nghiệp nộp thay*, và **được khấu trừ: có/không**. Cờ này mặc định theo hồ sơ thuế; Finance sửa theo chứng từ thực tế. Khoản thuế nộp thay kèm chứng từ (`FR-1.5`).
  4. **Cơ sở so ngân sách là chi phí thực chịu:** giá, cộng thuế **không được khấu trừ** (TNDN nộp thay; GTGT khi doanh nghiệp không được khấu trừ), cộng phí thẻ/chênh lệch tỷ giá nếu có trên sao kê — phần chênh này do **Finance đánh dấu** khi đối soát, kèm ghi chú, và tính vào Cost Center của hóa đơn (đối soát, không phải quyết chi — `QĐ-66y`).
     - Cơ sở này dùng cho snapshot ngân sách (`FR-3.14`), khoản cam kết (`FR-5.8`) và Budget vs Actual (`FR-5.1`).
     - GTGT **được khấu trừ** vẫn được ghi và hiển thị ở **cột riêng**, nhưng **không** tính vào ngân sách đã dùng.
  5. Báo cáo tách riêng **phần thuế** và **chênh lệch do thuế/tỷ giá/phí** khỏi chênh lệch số lượng/đơn giá (`FR-5.4`), để giải thích vì sao tiền thực trả khác giá đã duyệt.

  Hệ thống **không** phân loại khoản mua theo luật thuế, **không** tính thuế phải nộp, **không** kê khai, **không** tự quyết khoản thuế nào được khấu trừ, và **không** làm thủ tục khấu trừ (mục 3.2).
  > *Lý do:*
  > - SaaS nước ngoài mua qua nền tảng số chịu GTGT **10%** (Luật 48/2024 Điều 9 khoản 3). Dịch vụ điện toán đám mây được coi là dịch vụ viễn thông, không phải *dịch vụ phần mềm* không chịu thuế (Luật Viễn thông 2023; Công văn 296/CT-CS ngày 19/01/2026).
  > - TNDN nhà thầu là **5%** (dịch vụ) hoặc **10%** (tiền bản quyền) (Nghị định 320/2025).
  > - GTGT nộp thay có **chứng từ nộp thay** được khấu trừ đầu vào (Luật 48/2024 Điều 14 khoản 2 điểm a). Vì vậy GTGT này **không** phải chi phí thật của doanh nghiệp dùng phương pháp khấu trừ; TNDN nộp thay thì **là** chi phí thật.
  > - So trên chi phí thực chịu khớp cách kế toán ghi chi phí, và vẫn giải thích được vì sao Budget vs Actual khác giá niêm yết.
  > - Tỷ lệ cụ thể (5% hay 10% TNDN; có quy đổi giá net lên gross hay không) còn tùy hợp đồng và diễn giải của cơ quan thuế, nên hệ thống **không** tự tính mà dùng tỷ lệ Finance nhập.
  >
  > Nguồn và ví dụ tính: [ghi chú thuế đã kiểm chứng](../Decisions/tax-saas-purchase-research-2026-10-08.md) (`OQ-22` đóng).

#### 5.5.1. Dự báo chi phí — mô hình ba lớp

- **FR-5.5:** Dự báo chi phí được tách thành **ba lớp có bản chất khác nhau**, mỗi lớp dùng một cơ chế riêng. Hệ thống **không** áp dụng chung một phương pháp cho cả ba.

  | Lớp | Nội dung | Cơ chế dự báo |
  | --- | -------- | ------------- |
  | **L1 — Chi phí đã cam kết** | Thuê bao có hợp đồng, số lượng và đơn giá đã biết, ngày gia hạn đã biết | **Công thức xác định** từ dữ liệu hợp đồng. Không dùng mô hình thống kê |
  | **L2 — Chi phí biến động** | Gói tính theo mức tiêu thụ, chi phí thay đổi theo tháng | **Mô hình xu hướng có cổng kiểm chứng** — xem FR-5.7 |
  | **L3 — Chi phí phụ thuộc quyết định** | Nhu cầu phát sinh do tuyển thêm người, mở dự án mới, đổi gói | **Ba kịch bản** dựa trên giả định do người dùng nhập |

  > *Lý do tách lớp:* với L1, dùng hồi quy để dự báo một con số đã ghi trong hợp đồng sẽ cho kết quả **kém chính xác hơn** đọc thẳng hợp đồng. Ngược lại, L2 là chỗ duy nhất mà phương pháp thống kê có ý nghĩa thật. Gộp cả ba lớp vào một phương pháp là sai ở cả hai đầu.

- **FR-5.6:** Xử lý đa tiền tệ: mọi báo cáo quy đổi về đồng tiền báo cáo của tổ chức theo tỷ giá chốt tại thời điểm ghi nhận giao dịch, không quy đổi lại khi xem báo cáo.

- **FR-5.7:** ⏸️ **HOÃN — không hiện thực trong MVP, giữ làm đặc tả thiết kế** (`QĐ-25`). Lớp L2 cần ≥ 12 tháng dữ liệu chi tiêu và kiểm chứng lùi, trong khi demo không có dữ liệu thật đủ dài. MVP hiện thực **L1 và L3**; với chi phí biến động, giao diện nêu rõ *"dự báo theo mô hình chưa được hiện thực"* thay vì để trống.

  **Cổng kiểm chứng cho lớp L2.** Hệ thống chỉ hiển thị dự báo bằng mô hình khi vượt qua đủ hai điều kiện, và tự đánh giá — người dùng không tự bật:

  | Điều kiện | Ngưỡng mặc định | Khi không đạt |
  | --------- | --------------- | ------------- |
  | Độ dài dữ liệu lịch sử | ≥ 12 tháng | Hiển thị *"Chưa đủ dữ liệu lịch sử để dự báo có kiểm chứng"* |
  | Sai số kiểm chứng lùi (huấn luyện 9, kiểm tra 3) | ≤ 20%, cấu hình được | **Ẩn dự báo mô hình**, chỉ hiển thị khoảng kịch bản L3, nêu rõ lý do ẩn |

  Khi hiển thị, dự báo **bắt buộc** kèm: khoảng thời gian dữ liệu đã dùng, các giả định đang áp dụng, sai số kiểm chứng đo được, và thời điểm tính. **Không** hiển thị một con số dự báo trần trụi trong bất kỳ trường hợp nào.

  **Về con số 20%** (`OQ-09`): sai số đo bằng phần trăm sai lệch tuyệt đối trung bình. Cách diễn giải thông dụng trong thực hành dự báo xếp dưới 10% là rất tốt, 10–20% là dùng được, 20–50% là tham khảo được, trên 50% là không dùng được. Dự án chọn **20% làm ranh giới giữa "hiển thị được" và "không hiển thị"**. Ngưỡng cấu hình được trong khoảng 10–40% để doanh nghiệp tự siết hoặc nới.

  > Đây là một **quy ước thực hành, không phải một chuẩn bắt buộc**. Điều quan trọng không nằm ở việc chọn đúng con số 20%, mà ở chỗ hệ thống **có một ngưỡng tường minh, đo được và hiển thị ra ngoài** — thay vì luôn vẽ một đường dự báo bất kể dữ liệu tốt hay xấu.

  Mô hình sử dụng ở mức đơn giản nhất đủ dùng — trung bình trượt kết hợp xu hướng tuyến tính. Phạm vi MVP **không** áp dụng ARIMA, Prophet hoặc mô hình học máy, vì với chuỗi dữ liệu tháng ngắn chúng không cho kết quả tốt hơn mà lại khó giải thích.

  > **Vì sao cổng kiểm chứng là phần đáng giá nhất của FR-5.5 và FR-5.7:** một hệ thống **tự từ chối dự báo khi biết mình sẽ sai** trung thực hơn hẳn một hệ thống luôn vẽ được một đường xu hướng. Đây cũng chính là điều kiện mà bản đăng ký đồ án đã đặt ra — *"chỉ được dùng khi dữ liệu lịch sử đủ và có đánh giá sai số"*.

#### 5.5.2. Khoản cam kết ngân sách

- **FR-5.8:** Khi Người duyệt chi duyệt một Request **có chi phí**, **hệ thống tạo** một **khoản cam kết ngân sách** gắn với **đúng Request đó** và Cost Center liên quan (`INV-16`), ghi **chi phí ước tính** — giá cộng thuế không được khấu trừ (`FR-5.13`); Finance **ghi nhận chính thức** trên khoản đó theo `FR-3.14` (3) (`QĐ-22`, `QĐ-29b`). Vòng đời: **Đang giữ** → **Đã thành chi phí** khi hóa đơn tương ứng được đối soát khớp (`FR-5.4`), hoặc → **Đã giải phóng** khi Request bị hủy, mua hoặc cấp phát thất bại. **Không** tạo khoản cam kết khi Người duyệt chi từ chối. Ngân sách còn lại hiển thị ở snapshot `FR-3.14` luôn trừ cả thực chi lẫn cam kết đang giữ. Hóa đơn khớp **một phần**: mỗi hóa đơn chuyển đúng số tiền đó thành chi phí, phần còn lại vẫn *Đang giữ*; hết số còn lại thì *Đã thành chi phí*; Finance được giải phóng phần dư kèm lý do khi không còn hóa đơn; không trừ hai lần (`OI-11a`). Khoản chi trên sao kê khớp một khoản cam kết khi **chưa** có hóa đơn được tính vào Cost Center của yêu cầu tương ứng nhưng **không** làm đổi trạng thái khoản cam kết; chuyển *Đã thành chi phí* vẫn chỉ theo hóa đơn (`QĐ-50c`). Quyết định gia hạn/giảm/hủy thuê bao **không** tạo khoản cam kết; chi phí kỳ gia hạn hiện ở dự báo L1 (`FR-5.5`, `QĐ-62s`).
  > *Lý do:* chỉ so thực chi với ngân sách thì hai Request chạy song song đều thấy *"còn đủ"* rồi cùng làm vượt hạn mức.
- **FR-5.8a:** **Khoản cam kết khi chưa có ngân sách** (`QĐ-30b`). Khi Request có chi phí được duyệt mà **chưa có** `Budget` của Cost Center và kỳ đó *(snapshot hiển thị `Chưa có ngân sách` theo `FR-3.14` (1))*, hệ thống **vẫn tạo** khoản cam kết theo `FR-5.8`; khoản đó **chưa gắn ngân sách**, mang lý do *Chưa có ngân sách* và vào hàng đợi ghi nhận của Finance (`INV-18`). Quyết định duyệt chi và việc cấp phát **không bị chặn**.

  **Gắn ngược khi ngân sách ra đời:** ngay khi `Budget` của **đúng Cost Center và kỳ đó** được lập, hệ thống **tự gắn** mọi khoản cam kết chưa có ngân sách thuộc kỳ đó vào ngân sách vừa lập, ghi Audit Trail sự kiện gắn. Từ thời điểm đó, khoản cam kết được tính vào *cam kết đang giữ* của công thức ngân sách còn lại.

  **Ngân sách còn lại được phép âm.** Nếu tổng cam kết được gắn ngược vượt hạn mức vừa lập, hệ thống hiển thị số **âm** kèm nhãn *đã cam kết vượt hạn mức*, **không** làm tròn về 0 và **không** ẩn. Báo cáo của Finance (`FR-5.8`, `FR-5.11`) nêu rõ phần vượt đến từ cam kết tạo trước khi có ngân sách.
  > *Lý do:* Người duyệt chi được quyết khi chưa có ngân sách, nên mô hình phải biểu diễn được khoản cam kết sinh ra từ quyết định đó. Không gắn ngược thì tiền đã cam kết thật vĩnh viễn nằm ngoài mọi ngân sách — tái tạo đúng `PP-3`. Hiển thị số âm là **thông tin đúng**; che đi mới là sai. **Không** tạo `Budget` giữ chỗ hạn mức 0 — trái `FR-3.14` (1) *"không hiện 0"*.

#### 5.5.3. Năm nhóm báo cáo

Hệ thống quản trị chi phí nội bộ **không có doanh thu**. Phần tương đương *"tiền hệ thống mang lại"* là **báo cáo tiết kiệm**, luôn đặt cạnh **tổng chi** (`QĐ-24`).

- **FR-5.9:** **Báo cáo tiết kiệm** — hai con số **tách riêng, không bao giờ cộng lại** theo `FR-4.15`: *tiết kiệm thực hiện ngay* và *tiết kiệm tại kỳ gia hạn kế tiếp*; kèm số seat đã thu hồi và danh sách khuyến nghị đã thực hiện làm căn cứ. Số seat đã thu hồi chỉ là căn cứ; thu hồi một quyền **không** tự thêm tiền vào hai con số này.
- **FR-5.10:** **Báo cáo hiệu suất sử dụng** — KPI-3, số seat theo từng nhóm G1 → G4, và **chi phí trên mỗi người dùng có hoạt động** (`FR-0.4`), theo ứng dụng và theo phòng ban. Mỗi seat được xếp **đúng một** trong bốn trạng thái: **đang hoạt động**, **không hoạt động**, **không có dữ liệu**, **chưa khớp danh tính** (`FR-4.10`). *Không có dữ liệu* và *chưa khớp* **không** được tính thành *không hoạt động* hay hiển thị thành 0.

  > **`FR-5.10a` — Ba tỷ lệ, ba câu hỏi khác nhau** (`KPI3-DENOM`). Báo cáo hiển thị **ba** chỉ số tách bạch, **không** dùng chung một tên:
  >
  > | Chỉ số | Công thức | Trả lời câu hỏi |
  > | --- | --- | --- |
  > | **`KPI-3`** *(chỉ số chính thức)* | seat đang hoạt động ÷ **`purchased_quantity`** của gói per-seat | *"Tiền bỏ ra có được dùng không?"* |
  > | **Độ bao phủ bằng chứng** | seat **đánh giá được** ÷ `purchased_quantity` | *"Hệ thống nhìn thấy được bao nhiêu phần?"* |
  > | **Tỷ lệ hoạt động trong phần đánh giá được** *(chỉ số giải thích)* | seat đang hoạt động ÷ seat **đánh giá được** | *"Trong phần nhìn thấy được, tỷ lệ dùng là bao nhiêu?"* |
  >
  > **Ví dụ chuẩn để đọc báo cáo** — 100 seat đã mua · 70 seat đánh giá được · 56 seat có hoạt động ⟹ **`KPI-3` = 56%** · độ bao phủ = **70%** · tỷ lệ hoạt động trong phần đánh giá được = **80%**.
  >
  > Ba ràng buộc **bắt buộc**:
  >
  > 1. Chỉ số thứ ba **không bao giờ** được gọi là `KPI-3` ở báo cáo, slide hay user story. Gọi nhầm sẽ báo 80% thay cho 56% — chênh 24 điểm phần trăm.
  > 2. 30 seat không đánh giá được **không** bị đếm là *không hoạt động*; chúng hiện ra ở **độ bao phủ**, không bị giấu.
  > 3. Khi độ bao phủ dưới ngưỡng của `FR-4.12`, báo cáo gắn nhãn **`INSUFFICIENT EVIDENCE`** thay vì hiển thị một con số trông như đã đánh giá xong.
- **FR-5.11:** **Báo cáo hiệu suất quy trình** — KPI-2 **tách theo từng bước** (nhu cầu, đánh giá IT, duyệt chi, cấp phát), kèm **thời gian Finance phản hồi yêu cầu thông tin** và **thời gian Finance ghi nhận sau duyệt** đo riêng, không cộng vào đường chờ; **tỷ lệ bước quá SLA**, và KPI-4. Kèm **bảng theo dõi nghẽn**: số bước đang chờ theo từng người được giao, tuổi SLA, số lần nhắc, số lần xác định lại người duyệt theo sự kiện dữ liệu (`FR-3.16`) và số bước gán cho người thay thế khi xung đột (`FR-3.15`). Kèm **tổng hợp seat cấp theo nhánh (a)** theo ứng dụng và Cost Center trong kỳ — Người duyệt chi xem ở mức tóm tắt (`QĐ-29a`).
- **FR-5.12:** **Báo cáo chất lượng** — KPI-5, KPI-1, tỷ lệ định danh đã khớp, độ mới của từng nguồn usage, số sai lệch đang mở, tỷ lệ thuê bao thiếu hạn chót báo hủy, và **trạng thái bộ thu thập** (`FR-0.4`).

**Ai xem báo cáo nào** *(lời diễn giải của báo cáo chi phí — kể cả từ bản nháp AI — chỉ nằm trong bản của Finance và Người duyệt chi, `QĐ-66ac`)*:

| Vai trò | Tổng chi (`FR-5.1`, `FR-5.2`) | Tiết kiệm | Hiệu suất sử dụng | Hiệu suất quy trình | Chất lượng |
| --- | --- | --- | --- | --- | --- |
| Người duyệt chi | ✅ | ✅ | Tóm tắt | Tóm tắt | — |
| Finance | ✅ + khoản cam kết | ✅ | — | — | — |
| IT Admin | — | ✅ | ✅ | ✅ | ✅ trừ KPI-5 |
| Super Admin | — | — | — | ✅ | ✅ gồm KPI-5 (`FR-0.3`) |
| Manager | **Thực chi + khoản cam kết đang giữ** của **phòng mình**, theo ứng dụng/nhà cung cấp; **không** ngân sách, số còn lại hay tổng công ty (`SoD-2`, `OI-08b`) | — | Nhân viên trong phòng, dạng tổng hợp | Request của nhân viên trong phòng | — |

#### 5.5.4. Dashboard theo vai trò và danh mục cảnh báo

- **FR-5.14:** Mỗi vai trò có **một trang tổng quan** khi đăng nhập, dùng lại số liệu của `FR-5.1` → `FR-5.13` theo đúng phạm vi xem ở bảng trên; mọi **cảnh báo** của hệ thống nằm trong **một danh mục duy nhất** dưới đây (cảnh báo gì, gửi ai, khi nào). Kênh gửi vẫn theo `FR-3.11`. Danh mục **không** thêm quy tắc phát hiện mới ngoài các yêu cầu được dẫn (`QĐ-57a`).

| Vai trò | Trang tổng quan |
| --- | --- |
| Employee | Phần mềm đang được cấp (gồm tài khoản dùng chung mình đang dùng), yêu cầu đang chờ và kết quả, quyền có thời hạn sắp hết |
| Manager (trưởng phòng) | Yêu cầu đang chờ mình duyệt, công cụ đang dùng của phòng (`FR-3.17`), rà soát điều chuyển và ghost seat đang chờ, thực chi + cam kết của phòng |
| IT Admin | Hàng đợi cấp/thu hồi của các phòng mình phụ trách, sai lệch, thuê bao sắp tới hạn báo hủy, kho khóa bản quyền, điều khoản cần rà soát, bàn giao nghỉ việc, máy chưa có xác nhận chính sách |
| Finance | Ngân sách · thực chi · cam kết · còn lại theo Cost Center/phòng, hóa đơn chờ đối soát, chênh lệch do thuế/tỷ giá, cam kết chờ ghi nhận |
| Người duyệt chi | Yêu cầu chờ duyệt chi, đề xuất gia hạn/giảm/hủy, tổng chi và tiết kiệm |
| Super Admin | Bảng theo dõi nghẽn, tác vụ nền, cấu hình người duyệt, cảnh báo vai trò |

| Cảnh báo | Gửi ai | Khi nào | Nguồn |
| --- | --- | --- | --- |
| Sắp tới hạn chót báo hủy | IT Admin, Finance, Business Owner, Người duyệt chi; thêm Super Admin ở T−7 | T−15, T−7 | `FR-1.4` |
| Điều khoản cần rà soát lại / vi phạm điều khoản | IT Admin phụ trách | Trước hạn báo hủy; khi dữ liệu nội bộ cho thấy vi phạm | `FR-1.10` |
| Quyền có thời hạn sắp hết | **Employee**, trưởng phòng, IT Admin | T−7 | `FR-2.8` |
| Quyết định thu hồi sắp được thực hiện | **Employee** | Khi trưởng phòng chọn Reclaim hoặc khi Employee tự hoàn trả (hoàn trả không có bước duyệt — mục 4.6) | `FR-3.10`, `FR-2.4` |
| Thu hồi đã hủy | **Employee** | Khi trưởng phòng đổi Reclaim thành Keep/Exempt sau khi IT trả lại | `FR-3.10`, `QĐ-62p` |
| Trạng thái yêu cầu thay đổi | **Employee** và người duyệt liên quan | Mỗi lần đổi trạng thái | `FR-3.11` |
| Bước duyệt quá SLA / nghẽn | Người được giao, cấp trên, Super Admin | Quá SLA, vượt ngưỡng backlog | `FR-3.8` |
| Hạn rà soát sau điều chuyển | Trưởng phòng mới; IT Admin khi quá hạn | Ngày làm việc thứ 5 | `FR-3.8` |
| Phòng thiếu trưởng phòng / IT Admin phụ trách | IT Admin, Super Admin | Khi phát sinh | `FR-3.17` |
| Bộ công cụ chuẩn của phòng thay đổi | Trưởng phòng | Mỗi lần IT cập nhật | `FR-3.18` |
| Bàn giao dữ liệu chưa xác nhận / người chịu trách nhiệm tài khoản dùng chung sắp rời | Trưởng phòng, IT Admin | Trong thời gian *đang bàn giao* hoặc trước ngày hiệu lực điều chuyển; **cảnh báo** khi tới ngày hiệu lực điều chuyển/nghỉ việc mà chưa có người chịu trách nhiệm mới (`QĐ-66i`) | `FR-2.11`, `FR-2.12` |
| Đổi mật khẩu tài khoản dùng chung | IT Admin phụ trách | Khi một thành viên rời nhóm | `FR-2.11` |
| Máy công ty chưa có xác nhận chính sách theo dõi | IT Admin | Sau bàn giao máy; khi phiên bản thông báo được đánh dấu *cần xác nhận lại* | `FR-4.21`, `QĐ-62q` |
| Gia hạn đã quyết nhưng chưa có kết quả thực hiện (*thực hiện trễ*) | IT Admin, Người duyệt chi | Tại hạn chót báo hủy | `FR-1.4`, `QĐ-62k` |
| Lời mời của nhà cung cấp chưa được chấp nhận | **Employee**, IT Admin | Sau N ngày; IT được đóng sau M ngày | `FR-2.5`, `QĐ-62j` |
| Ngân sách thay đổi giữa kỳ | Người duyệt chi | Khi Finance sửa ngân sách | `FR-5.1`, `QĐ-62m` |
| Ngân sách vượt / chưa có ngân sách sau duyệt chi | Người duyệt chi | Khi Finance ghi nhận | `FR-3.14` |
| Khuyến nghị ghost seat mới | Trưởng phòng | Khi rule sinh khuyến nghị | `FR-3.10`, 5.4 |
| Quyết định ghost seat quá hạn | Trưởng phòng; IT Admin | Khi quá hạn cấu hình | `FR-3.10`, `QĐ-66t` |
| Miễn trừ sắp hết hạn | Trưởng phòng | T−7 trước ngày hết hạn | `FR-3.10`, `QĐ-66aj` |
| Dữ liệu usage lỗi thời | IT Admin *(người nhận chi tiết còn mở ở User Stories)* | Nguồn quá 7 ngày kể từ ngày bao phủ cuối | `FR-4.9` điều kiện 6, `QĐ-66aj` |
| Business Owner nghỉ việc — cần người thay | IT Admin | Khi Business Owner chuyển *đã nghỉ việc* | `FR-1.7`, `QĐ-66aj` |
| Thông báo trước khi theo dõi một ứng dụng | Employee giữ seat ứng dụng đó | Trước khi bắt đầu thu dữ liệu sử dụng (trong ứng dụng + thư điện tử) | `FR-10.4`, `QĐ-66aj` |
| Kết nối nhà cung cấp hết hạn (lỗi xác thực) | Super Admin | Khi tác vụ ghi lỗi xác thực | `FR-2.5`, `QĐ-62i`, `QĐ-66aj` |
| Chưa có người duyệt hợp lệ | Super Admin | Khi Request vào chờ có kiểm soát | `FR-3.12`, `QĐ-66aj` |
| Khuyến nghị `G2` do nhân viên nghỉ việc | IT Admin | Khi nhân viên chuyển *đã nghỉ việc* | 5.4.1, `QĐ-66aj` |
| Số khóa bản quyền khác số đã mua | IT Admin | Khi import hoặc đổi trạng thái khóa | `FR-2.10`, `QĐ-66g` |
| *Cảnh báo cho Employee dựa trên mức sử dụng* | — | ⏸️ Chờ nghiên cứu phương pháp usage (`QĐ-57d`) | — |

### 5.6. Phân hệ Phát hiện SaaS ngoài Danh mục (Shadow IT Discovery)

> **Tên hiển thị: *Đối soát chi phí phần mềm* — tính năng bổ sung** (`QĐ-33a`). Mục tiêu: phát hiện khoản chi phần mềm **có dấu hiệu không khớp phạm vi được phép hoặc chưa có căn cứ phê duyệt**, để người có thẩm quyền kiểm tra. Nguồn: CSV sao kê/hóa đơn **nếu có**; khoản chi/hóa đơn đã ghi nhận trong hệ thống; yêu cầu, quyết định phê duyệt, hợp đồng/subscription, catalog, thông tin mua sắm. **Không cam kết:** phát hiện toàn bộ Shadow IT; mọi ứng dụng miễn phí hoặc nhân viên tự trả; chứng minh rò rỉ dữ liệu; tự kết luận một người vi phạm. Tên mục và mã yêu cầu dưới đây giữ nguyên để truy vết.

- **FR-6.1:** Hệ thống duy trì SaaS Catalog là danh mục ứng dụng đã được IT phê duyệt, gồm nhà cung cấp, tên miền liên quan, trạng thái phê duyệt, người sở hữu nghiệp vụ và mức độ nhạy cảm dữ liệu.
- **FR-6.2:** Hệ thống duy trì **từ điển nhận diện nhà cung cấp dùng chung** gồm tên chuẩn, tên miền và các mẫu nhận dạng, tách khỏi danh mục riêng của tổ chức. **Một mục từ điển = một dòng dịch vụ có thuê bao/tài khoản tính tiền riêng**, thuộc đúng một nhà cung cấp (công ty), gồm các sản phẩm được tính tiền chung — ví dụ Microsoft 365 và Azure là hai mục; ChatGPT và OpenAI API là hai mục. Từ điển giữ thêm **nhóm theo nhà cung cấp** (thương hiệu, tên miền thương hiệu, các dòng tính tiền riêng). Mô tả chỉ cho thấy thương hiệu, pháp nhân hoặc mã thanh toán chung của nhà cung cấp **nhiều dòng** thì **không** tự chuẩn hóa: vào hàng đợi review (`NO_VENDOR_MATCH`) với các dòng của nhà cung cấp đó làm ứng viên (`QĐ-38`).
- **FR-6.3:** Hệ thống thiết kế cho **ba** nguồn bằng chứng: **(a)** CSV sao kê/hóa đơn chi phí, **(b)** export OAuth consent hoặc enterprise-app từ IdP, **(c)** dữ liệu từ **tiện ích trình duyệt** (`FR-4.17`) — **chỉ các tên miền có trong từ điển nhà cung cấp** mà chưa nằm trong danh mục đã duyệt. Log web/firewall/proxy/CASB **đầy đủ** **nằm ngoài phạm vi**, xem mục 5.6.1.

  **Đợt hiện thực này chỉ xây nguồn (a)** (`QĐ-31a`). Nguồn (b) và (c) dùng cho phát hiện ngoài danh mục chuyển sang giai đoạn sau — đặc tả giữ nguyên. Giao dịch CSV được **đối soát với dữ liệu chi và phê duyệt đã có**: dòng trùng một khoản thanh toán đã ghi nhận thì **liên kết**, không tạo khoản chi thứ hai; *đã duyệt* không được coi là *đã thanh toán* hay *đã sử dụng*. Phạm vi được tuyên bố: **phát hiện khoản chi SaaS/phần mềm ngoài danh mục từ dữ liệu tài chính được nhập** — không phải mọi Shadow IT, không phải phát hiện rò rỉ dữ liệu.

  Tệp sao kê do **Finance** tải với mục đích riêng *sao kê chi phí* (đọc: Finance, IT Admin); IT Admin xử lý hàng đợi review (`QĐ-66h`). Hệ thống nhận **mẫu CSV chuẩn SaaS-Sentry** và **mẫu cấu hình theo ngân hàng** (bản ghi cấu hình, không viết mã mới); tệp mã hóa **UTF-8 (có hoặc không có BOM)** hoặc **UTF-16 LE/BE có BOM** — UTF-16 không BOM, mã hóa cũ (Windows-1258, TCVN3), XLSX, PDF bị từ chối cả tệp, không đoán (`OQ-MF6-02`, `QĐ-32`). Không phát biểu *hỗ trợ export của ngân hàng X* khi chưa kiểm tệp thật của ngân hàng đó (`QĐ-32c`).
- **FR-6.4:** Quy trình xử lý theo chuỗi: **dữ liệu thô → chuẩn hóa → khớp nhà cung cấp → đối chiếu danh mục → tạo bản ghi cần xem xét**. Hệ thống lưu **cả giá trị thô lẫn giá trị đã chuẩn hóa**, kèm phương pháp khớp và mức độ tin cậy, để giải trình được.

  **Đối soát theo từng khoản chi** (`QĐ-33b`). Ngoài đối chiếu danh mục, mỗi khoản chi được so với **căn cứ phê duyệt** của tổ chức — subscription/hợp đồng (số tiền theo kỳ, thời hạn), yêu cầu đã duyệt (khoản cam kết), quyết định chi của Người duyệt chi — và nhận **một trạng thái đối soát**: *khớp căn cứ* · *đã ghi nhận* · *ngoại lệ* với lý do *không có căn cứ / ngoài thời hạn / vượt số tiền được duyệt (lũy kế trong kỳ) / nhiều căn cứ cùng khớp / khác tiền tệ (không quy đổi) / căn cứ thiếu dữ liệu* · *vendor chưa được duyệt* · *chưa nhận diện vendor* · *hoàn tiền/điều chỉnh* · *không phải phần mềm*. Không suy *vendor đã duyệt ⟹ mọi khoản chi được phép*, *đã duyệt ⟹ đã mua/đã thanh toán*, *không thấy căn cứ ⟹ chi trái phép*, *người giữ thẻ ⟹ người mua/người dùng*. Ngoại lệ là **cần kiểm tra**, không phải vi phạm: Finance đối soát và cung cấp bằng chứng, IT điều tra phần mềm, **chỉ Người duyệt chi** chấp nhận hoặc không chấp nhận khoản chi (`FR-3.4c-1`, `SoD-7`); kết cục chỉ tạo nhiệm vụ cho người. Đối soát ở mức nhà cung cấp — sản phẩm chỉ dùng khi dữ liệu có. So sánh số tiền trên chứng từ thanh toán với **tổng tiền phải trả ước tính** của căn cứ; chênh lệch do thuế, tỷ giá, phí được tách riêng (`FR-5.13`).

  Bước *liên kết khoản chi đã ghi nhận* nghĩa là đối chiếu với **hóa đơn Finance đã nhập** (`FR-5.4`): tự động khi số tham chiếu trên sao kê là số hóa đơn, hoặc cùng nhà cung cấp + tiền tệ + số tiền còn lại của hóa đơn + ngày lệch ≤ 3, **duy nhất**; nhiều hóa đơn cùng có thể khớp ⟹ hàng đợi review, không chọn giúp (`QĐ-34b`).
- **FR-6.5:** Mức độ tin cậy tính từ **phương pháp khớp**, không lấy con số do mô hình tự khai:

  | Phương pháp | Tin cậy | Xử lý |
  | ----------- | ------- | ----- |
  | Khớp chính xác từ điển | Cao | Tự động chuẩn hóa |
  | Khớp theo mẫu (regex) | Khá | Tự động, có thể xem lại |
  | Khớp mờ (fuzzy) | Trung bình | Đưa vào hàng đợi review |
  | Gợi ý bởi mô hình AI | Thấp | **Bắt buộc** người xác nhận |

  Các trường hợp cần xử lý: nhà bán lại và cổng thanh toán trung gian (`PAYPAL*CANVA` → Canva); tên miền phụ (`figma.com`, `www.figma.com`); cùng một nhà cung cấp xuất hiện ở nhiều nguồn.

  **Ca mơ hồ không tự chuẩn hóa, vào hàng đợi review** (`QĐ-31d`): nhiều nhà cung cấp cùng khớp một mô tả · mô tả chứa văn bản giống chỉ dẫn (chỉ là dữ liệu, không thực thi) · alias trùng từ thông dụng mà không có tên miền đi kèm (vd. `SENTRY INSURANCE`) · khớp mờ · cổng thanh toán không kèm merchant nhận diện được · mô tả chung chung không đủ kết luận. Hoàn tiền (số âm) được ghi làm bối cảnh, không tự tạo bản ghi phát hiện.

  Dòng **gợi ý bởi mô hình AI** được hiện thực cho các mục review mà rule **không có ứng viên duy nhất** (xem 6.4): gợi ý chỉ **gắn vào mục review**, không tự chuẩn hóa, không tạo hay đóng bản ghi phát hiện; chỉ hiện cho IT Admin khi cấu hình model đã **qua cổng chất lượng**; lỗi hoặc tắt AI thì hàng đợi thủ công chạy đủ (`QĐ-32a`, `QĐ-32b`).

- **FR-6.6:** Mục không khớp với danh mục được tạo dưới trạng thái **cần xem xét**, **không** được kết luận là vi phạm cho tới khi được xử lý. Hàng đợi review dùng **tám** lý do đóng: sáu lý do mơ hồ của `FR-6.5` + *không nhận diện được nhà cung cấp* + *có thể trùng một khoản chi nội bộ*. Mỗi dòng có **một lý do chính** kèm tín hiệu phụ; mục review **không bao giờ bị xóa**, mỗi dòng giao dịch nằm trên đúng một đường xử lý, và khoản chi chưa phân loại vẫn hiện trong mẫu số `KPI-1` (`QĐ-32c`).
- **FR-6.7:** Chống trùng lặp: mỗi nhà cung cấp chỉ có một bản ghi đang mở. Nhà cung cấp xuất hiện lại ở kỳ sau thì cập nhật thời điểm nhìn thấy gần nhất và số lần xuất hiện, không tạo bản ghi mới. Bản ghi đã đóng ở trạng thái "báo nhầm" mà xuất hiện lại thì được mở lại. Bản ghi đã đóng *duyệt hợp thức hóa* không mở lại (ứng dụng đã vào danh mục); bản ghi đã đóng *không duyệt* mà bằng chứng xuất hiện lại thì mở lại chính bản ghi đó với cờ *tái xuất hiện sau khi không duyệt* và nâng mức rủi ro (`OI-14f`). Bản ghi theo nhà cung cấp chỉ gom các khoản chi *vendor chưa được duyệt*; mọi kết quả đối soát khác nằm ở **từng khoản chi**. Quyết định trên bản ghi được ghi vào từng khoản chi của nó; không khoản chi nào bị gộp mất hay đóng hàng loạt vì một dòng khác đã giải quyết (`QĐ-33c`).
- **FR-6.8:** Bản ghi được phân tầng rủi ro dựa trên: mức nhạy cảm dữ liệu ứng dụng chạm tới, số nhân viên liên quan, và ứng dụng có hỗ trợ đăng nhập tập trung hay không. Mức nhạy cảm và SSO **chỉ** lấy từ hồ sơ nhà cung cấp do IT Admin ghi — không suy từ tên, không do mô hình. Chưa ghi mức nhạy cảm ⟹ **chưa đủ thông tin** (`UNRATED`) trừ khi có yếu tố quan sát được nâng lên cao (≥ 5 nhân viên). Mức rủi ro là **mức ưu tiên xem xét**, hiển thị kèm luật và từng yếu tố; **không** phải bằng chứng rò rỉ dữ liệu hay vi phạm (`QĐ-32c`).
- **FR-6.9:** IT Admin xem bằng chứng, gán người chịu trách nhiệm, xác nhận các khớp tin cậy thấp và chuẩn bị hồ sơ (`BM-07`); **Người duyệt chi** quyết một trong ba kết cục *Báo nhầm / Không duyệt / Duyệt hợp thức hóa* theo `FR-3.4c-1`, IT thực thi kết quả (`DQ-06`). *Không duyệt* và *Báo nhầm* **bắt buộc có lý do** (`OI-14g`). Khi **Duyệt hợp thức hóa**, Người duyệt chi nêu **số seat** (có thể mua thêm); ít hơn số người đang dùng thì chọn người được giữ, người còn lại đi đường *không duyệt* (`QĐ-66af`, `INV-01`). Khi **Không duyệt**, IT Admin ghi *lưu ý trước khi thu hồi* trong phần đánh giá kỹ thuật của `BM-07` để dùng cho xác nhận bàn giao (`QĐ-66ah`, `QĐ-63a`). *Thay bằng công cụ đã có* là *Không duyệt* kèm chuyển người dùng sang công cụ có sẵn và hủy gói (`QĐ-66ai`). Không có quy tắc người thay thế riêng khi Người duyệt chi là người dùng hoặc người trả của phần mềm được xét — Owner xác định ca này không xảy ra trong phạm vi (`QĐ-66ag`). Điều đó **không** có nghĩa được tự duyệt: `SoD-7` và `FR-3.15` viết cho Request, còn quyết định hợp thức hóa là quyết định trên bản ghi phát hiện, nên hành vi khi ca này phát sinh **chưa được quyết** — ca chưa hỗ trợ (rủi ro với `SoD-7`). Trưởng phòng cung cấp bối cảnh nghiệp vụ khi cảnh báo liên quan tới nhân viên trong phòng mình. Bối cảnh **không chặn** quyết định: hệ thống hỏi và nhắc, có thì hiện trên `BM-07`; Người duyệt chi quyết được khi chưa có; phòng chưa có trưởng phòng thì yêu cầu bối cảnh **treo, không giao ai** và chuyển cho trưởng phòng mới khi được bổ nhiệm — quyết định không chờ (`QĐ-62d`, `QĐ-62c`). Mọi quyết định ghi Audit Trail.
  > **Lưu ý về cách hiểu:** trạng thái "Đã duyệt" (hợp thức hóa ứng dụng) là một kết cục **bình thường và tích cực**, không phải ngoại lệ. Shadow IT thường là tín hiệu cho thấy bộ công cụ đã phê duyệt còn thiếu.
- **FR-6.10:** *(Đặc tả thiết kế cho tương lai, không hiện thực ở MVP.)* Nếu về sau tổ chức cung cấp log web/proxy, hệ thống chỉ yêu cầu và lưu trường tối thiểu: thời điểm, định danh người dùng đã ánh xạ, tên miền đích, số lượt truy cập hoặc dung lượng. Không lưu đường dẫn đầy đủ, không lưu tham số truy vấn, không hiển thị dữ liệu không liên quan trên dashboard.

#### 5.6.1. Vì sao discovery từ log web/firewall/proxy/CASB đầy đủ nằm ngoài phạm vi

Dự án chỉ giữ đặc tả thiết kế tại FR-6.10 cho nhật ký truy cập web **đầy đủ**. Ba lý do, xếp theo mức độ quan trọng:

**Lý do 1 — Vướng khung pháp lý về dữ liệu cá nhân, và nhóm chưa đủ căn cứ để làm đúng.** Log truy cập web của nhân viên là dữ liệu hành vi ở mức chi tiết cao hơn hẳn log sử dụng phần mềm. Nó cho biết một người truy cập trang nào, vào lúc nào, bao nhiêu lần — bao gồm cả những truy cập không liên quan tới công việc. Nghị định 356/2025 **mở rộng nhóm dữ liệu cá nhân nhạy cảm**, trong đó có dữ liệu về hành vi và thói quen thu thập được từ dịch vụ viễn thông, mạng xã hội và dịch vụ truyền thông trực tuyến (mục 7.7). Log truy cập web nằm rất gần — nếu không muốn nói là nằm trong — nhóm này. Trong cửa sổ 9 tuần, triển khai nửa vời với một hệ thống xử lý dữ liệu nhạy cảm là lựa chọn tệ hơn không triển khai.

**Lý do 2 — Không có hạ tầng để kiểm chứng, nên không chứng minh được độ bao phủ.** Nguồn này giả định doanh nghiệp đã vận hành sẵn proxy, firewall hoặc CASB. Một mẫu nhỏ trên máy của nhóm chỉ chứng minh **tầng xử lý file chạy được**, không chứng minh được **độ bao phủ**.

**Lý do 3 — Giá trị gia tăng không tương xứng với rủi ro trong phạm vi MVP.** Sao kê cho biết *công ty đang trả tiền cho ai*, OAuth consent cho biết *ứng dụng nào đã được cấp quyền vào dữ liệu công ty*. Nguồn thứ ba trả lời *ai đang thực sự truy cập* — có giá trị, nhưng là giá trị bổ sung, không phải giá trị nền.

> **Tiện ích trình duyệt (`FR-4.17`) không thuộc diện trên** (`QĐ-20`), vì khác log web ở ba điểm: **(1)** lọc **tại máy** theo danh sách cho phép, nên máy chủ không bao giờ nhận truy cập ngoài danh sách — đúng các trường tối thiểu mà `FR-6.10` đã đặc tả; **(2)** chỉ chạy trên **thiết bị công ty cấp** sau khi nhân viên **xác nhận**, đáp ứng lý do 1 bằng Điều 25 khoản 3 Luật 91/2025/QH15 (mục 7.7.7); **(3)** không cần hạ tầng proxy hay CASB, nên lý do 2 không áp dụng.

**Bảng điểm mù của từng nguồn:**

| Nguồn | Trả lời câu hỏi | Điểm mù | Phạm vi MVP |
| ----- | --------------- | ------- | ----------- |
| Sao kê / hóa đơn | Công ty đang **trả tiền** cho ai? | Mù hoàn toàn với công cụ miễn phí; mô tả giao dịch thường mơ hồ; các khoản qua hoàn ứng cá nhân không thấy được; khoản chi không được nhập | ✅ Có — **nguồn duy nhất của `MF-6`** |
| OAuth / IdP | Ứng dụng nào đã được **cấp quyền** vào dữ liệu công ty? | Không bao phủ ứng dụng đăng ký bằng tài khoản cá nhân | ⏸️ Giai đoạn sau (`QĐ-31a`) |
| Traffic / CASB | Ai đang **thực sự truy cập**? | Chỉ thấy thiết bị và mạng được giám sát | ❌ Ngoài |
| **Tiện ích trình duyệt** | Ai đang **thực sự mở** một SaaS **đã biết** trên máy công ty? | Mù với SaaS chưa có trong từ điển; ứng dụng desktop; trình duyệt không được quản lý; thiết bị cá nhân; nhân viên chưa xác nhận | ⏸️ Giai đoạn sau **cho discovery** (`QĐ-31a`); vẫn ✅ là nguồn usage của `MF-3` |

**Trường hợp mọi nguồn đều mù:** nhân viên dùng công cụ AI miễn phí bằng tài khoản cá nhân trên máy cá nhân. Không có giao dịch, không có OAuth grant, không đi qua mạng công ty. Hệ thống **không cam kết phát hiện 100% Shadow IT** — và phải nói rõ giới hạn này thay vì giấu đi.

### 5.7. Phân hệ Import dữ liệu

- **FR-7.1:** Mọi luồng import (hợp đồng, hóa đơn, nhân sự, usage log, sao kê) dùng chung khung xử lý theo 6 bước:

  ```
  Tải lên → Phân tích → Ánh xạ danh tính → Xem trước → Ghi nhận → Tổng hợp lại
  ```

- **FR-7.2:** **Bước xem trước là bắt buộc.** Trước khi ghi dữ liệu thật, hệ thống hiển thị: số dòng hợp lệ, số dòng lỗi kèm lý do, số dòng đã tồn tại sẽ bỏ qua, số định danh chưa khớp được, cửa sổ dữ liệu, và số bản ghi sẽ bị ảnh hưởng. Người dùng xác nhận rồi hệ thống mới ghi.
- **FR-7.3:** Lỗi ở một dòng không làm hỏng cả file. Dòng lỗi được ghi nhận riêng kèm số dòng, cột và mã lỗi, cho phép tải về danh sách lỗi.
- **FR-7.4:** Hệ thống tính mã băm nội dung file để phát hiện import trùng, cảnh báo khi file đã được import trước đó.
- **FR-7.5:** Dữ liệu được chuẩn hóa múi giờ về múi giờ của tổ chức trước khi cắt theo ngày. Múi giờ tổ chức **chọn lúc khởi tạo** và **bất biến qua mọi API thông thường** sau khởi tạo; muốn đổi về sau cần một thiết kế chuyển đổi riêng (`QĐ-47d`).
- **FR-7.6:** Chuẩn hóa email theo quy tắc cấu hình được (chuyển thường, xử lý phần sau dấu cộng), áp dụng nhất quán ở cả khi tạo ánh xạ lẫn khi đối chiếu.

#### 5.7.1. Xử lý khi các nguồn dữ liệu mâu thuẫn nhau

Hệ thống nhận dữ liệu từ nhiều nguồn độc lập: file nhân sự, danh sách thành viên phía nhà cung cấp, hóa đơn, log hoạt động. Chúng **sẽ** mâu thuẫn nhau, và tài liệu phải nói trước cách xử lý thay vì để mỗi lập trình viên tự quyết.

- **FR-7.7:** Khi hai nguồn dữ liệu nói khác nhau, hệ thống **không để nguồn nào tự ghi đè nguồn kia**. Hệ thống ghi nhận sai lệch thành một bản ghi cần người xử lý, giữ nguyên cả hai giá trị.

**Nguyên tắc phân định nguồn chân lý:**

> **Dữ liệu nội bộ đã qua quy trình phê duyệt là nguồn chân lý về *ý định*. Dữ liệu từ nhà cung cấp là nguồn chân lý về *thực tế*. Khi hai thứ lệch nhau, đó là một sự kiện nghiệp vụ cần người xử lý, không phải một lỗi dữ liệu cần tự sửa.**

| Tình huống mâu thuẫn | Nguồn nào thắng | Hệ thống làm gì |
| -------------------- | --------------- | --------------- |
| Nhân sự nói đã nghỉ việc, nhà cung cấp vẫn còn tài khoản | Nhân sự thắng **về trạng thái nhân viên** | Sinh lãng phí nhóm G2 mức cần xử lý ngay, kèm việc thu hồi cho IT Admin |
| Nhà cung cấp có tài khoản, hệ thống không có Assignment tương ứng | **Không nguồn nào thắng** | Sinh sai lệch loại *có ở nhà cung cấp nhưng không có trong hệ thống*; **không** tự tạo Assignment |
| Hệ thống có Assignment đang hiệu lực, nhà cung cấp không có tài khoản | **Không nguồn nào thắng** | Sinh sai lệch loại *có trong hệ thống nhưng không có ở nhà cung cấp* |
| Số seat trên hóa đơn khác số seat khai trong thuê bao | **Không nguồn nào thắng** | Đưa vào màn hình đối soát hóa đơn (FR-5.4); **không** tự sửa thuê bao. Nếu xác minh cho thấy **nhà cung cấp tính sai**: hồ sơ đóng với quyết định *nhà cung cấp tính sai* kèm ghi chú bắt buộc; hóa đơn vẫn tính như đã nhận (`QĐ-49f`) — ca ở **mức hóa đơn**, khác ngoại lệ của **một khoản chi** trên sao kê (`QĐ-34a`) |
| File nhân sự nhập mới thiếu một người đang giữ seat | **Không nguồn nào thắng** | Không tự đánh dấu đã nghỉ, không tự xóa; đưa vào hàng đợi cần xem xét |
| Hai file log cùng ứng dụng, cửa sổ dữ liệu chồng lấn nhau | Nguồn có cửa sổ **kết thúc muộn hơn** thắng | Hợp nhất theo khóa (danh tính, ngày); ghi nhận nguồn đã dùng cho từng dòng |
| Cùng một định danh khớp về hai nhân viên khác nhau | **Không nguồn nào thắng** | Đẩy vào hàng đợi chưa khớp danh tính, **không** dùng để kết luận (FR-4.6) |

> **Vì sao không cho phép tự ghi đè:** ba trong bảy tình huống trên là **dấu hiệu của một vấn đề nghiệp vụ thật** — có người được cấp quyền ngoài quy trình, có người nghỉ việc mà chưa thu hồi, hoặc hóa đơn tính sai. Nếu hệ thống tự đồng bộ cho khớp, nó xóa mất chính bằng chứng mà nó sinh ra để tìm.

### 5.8. Phân hệ Quản trị hệ thống & Audit

- **FR-8.1:** Super Admin quản lý tài khoản đăng nhập, gán vai trò, khóa/mở tài khoản. Tài khoản được phép **không có vai gán trực tiếp nào**; hệ thống **không** tự thêm `EMPLOYEE` hay vai nào khác; thu hồi vai cuối được phép. Quyền hiệu lực của một tài khoản là vai gán trực tiếp **cộng** vai suy ra hợp lệ (`MANAGER`, Người duyệt chi); chỉ tài khoản **không có cả hai** mới chỉ còn tự phục vụ (hồ sơ, đổi mật khẩu, đăng xuất). Thu hồi `IT_ADMIN` của tài khoản mang `IT_ADMIN` + `EMPLOYEE` **không** thu hồi `EMPLOYEE` (`QĐ-47c`).
- **FR-8.2:** Super Admin cấu hình tham số hệ thống: ngưỡng cảnh báo, ngưỡng phát hiện theo từng cấp, thời hạn SLA phê duyệt, chính sách lưu giữ dữ liệu, **ngưỡng sai số của cổng kiểm chứng dự báo (FR-5.7)**, **Người duyệt chi** (`FR-3.13`), **Người duyệt chi thay thế khi xung đột** (`FR-3.15`), approver dự phòng ở gốc (`FR-3.6`), **ngưỡng backlog** mỗi người duyệt dùng cho cảnh báo nghẽn (`FR-3.8`), **nội dung thông báo theo dõi có đánh phiên bản** (`FR-4.18`), ngưỡng *N phút* của định nghĩa hoạt động cho bộ thu thập (`FR-4.17`), và **số ngày làm việc của hạn rà soát sau điều chuyển** (mặc định 5; `FR-3.8`, `QĐ-50b`). Việc cấu hình người duyệt là **cấu hình**, không phải phê duyệt, nên `SoD-1` giữ nguyên. Đổi các cấu hình người duyệt kích hoạt xác định lại người duyệt theo `FR-3.16`.
- **FR-8.3:** Nhật ký kiểm toán (Audit Trail) ghi nhận mọi thay đổi dữ liệu nghiệp vụ với: người thực hiện, vai trò tại thời điểm đó, hành động, đối tượng, giá trị trước và sau, mã tương quan, thời điểm. Nhật ký **chỉ ghi thêm, không cho sửa hoặc xóa**. Chỉ **Super Admin** tra cứu Audit Trail; vai khác thấy lịch sử của đối tượng trong phạm vi mình ngay trong chức năng tương ứng (`OI-08c`).
- **FR-8.4:** Hệ thống hiển thị trạng thái các tác vụ nền: lần chạy gần nhất, kết quả, số bản ghi xử lý, lỗi.
- **FR-8.5:** Super Admin không thực hiện thao tác nghiệp vụ (không gán seat, không phê duyệt request) — theo SoD-1.
- **FR-8.6:** **Tài khoản nội bộ và kích hoạt qua lời mời** (`QĐ-46a`). Backend sở hữu thông tin đăng nhập và là **cơ chế đăng nhập duy nhất**; không có nhà cung cấp định danh bên ngoài cho việc đăng nhập. Tài khoản do **Super Admin tạo từ một hồ sơ nhân viên đã có**; ngoài ứng dụng có **hai** ngoại lệ có kiểm soát: lệnh khởi tạo tạo tài khoản Super Admin **đầu tiên** (`FR-9.8`, `QĐ-67a`) và thủ tục khôi phục chuyển lại vai theo phiếu phê duyệt (`FR-8.10(d2)`, `QĐ-47f`). Hệ thống **không** cho tự đăng ký công khai, đăng nhập **không bao giờ** tạo tài khoản hay cấp vai, và **không** lấy vai trò từ email, tên miền hay nguồn ngoài. Tài khoản chỉ dùng được sau khi **kích hoạt**: người dùng nhận **lời mời dùng một lần** gửi tới email đăng nhập và **tự đặt mật khẩu của mình**. Riêng tài khoản Super Admin đầu tiên do lệnh khởi tạo tạo đã **kích hoạt ngay**, mật khẩu do **chính người giữ vai** đặt khi chạy lệnh (`FR-9.8`). Mọi tài khoản khác mang vai `SUPER_ADMIN`, `IT_ADMIN`, `FINANCE` cũng không ngoại lệ: vai được lưu khi gán nhưng **chưa có hiệu lực sử dụng** cho tới khi tài khoản được kích hoạt, và không ai — kể cả Super Admin — đặt hay biết mật khẩu thay người đó. Tạo tài khoản, gửi/gửi lại lời mời và kích hoạt ghi Audit Trail, không bao giờ ghi mật khẩu hay mã lời mời. Vòng đời thông tin đăng nhập: `FR-8.11`.
- **FR-8.7:** **Super Admin không kiêm vai nghiệp vụ** (`QĐ-39b`): tài khoản mang `SUPER_ADMIN` không đồng thời mang `IT_ADMIN` hoặc `FINANCE`; người có tài khoản `SUPER_ADMIN` không được cấu hình làm Người duyệt chi, người thay thế khi xung đột hay approver dự phòng ở gốc, **không** được gán làm **trưởng phòng** và **không** nhận vai Manager suy ra (`QĐ-52a`). Người đó vẫn thuộc một phòng như mọi nhân viên và yêu cầu của mình đi tới trưởng phòng đó. Cụ thể hóa `SoD-1`, `FR-8.5`.
- **FR-8.8:** Không ai tự cấp/thu hồi vai, khóa/mở hay kích hoạt (phát hoặc gửi lại lời mời kích hoạt) cho **tài khoản của chính mình** (`QĐ-39c`); người dùng tự đặt, quên hoặc đổi mật khẩu của mình theo `FR-8.11` là tự phục vụ, không thuộc quy tắc này. Ngoại lệ có kiểm soát **duy nhất** là chuyển giao vai Super Admin (`FR-8.10`, `QĐ-44e`).
- **FR-8.9:** Từ khi nhân viên chuyển **đã nghỉ việc**, mọi thao tác của tài khoản liên kết với người đó bị từ chối ngay mà không cần ai thao tác; hệ thống nhắc Super Admin khóa tài khoản chính thức (`FR-8.1`, `QĐ-39d`). Giai đoạn *đang bàn giao* và nghỉ dài không ảnh hưởng tài khoản. Khóa tài khoản có hiệu lực từ thao tác kế tiếp, kể cả khi phiên/token nội bộ của tài khoản đó chưa hết hạn. Điều kiện chặn là **trạng thái** *đã nghỉ việc*, **không** phải ngày làm việc cuối: người *đang bàn giao* đã qua ngày cuối mà chưa được chuyển *đã nghỉ việc* vẫn truy cập được và hiện trong danh sách cần xử lý của IT Admin (`QĐ-41a`).
- **FR-8.10:** **Một Super Admin mỗi tổ chức** (`QĐ-44`).
  - **(a)** Mỗi tổ chức có **tối đa một** tài khoản giữ vai Super Admin có hiệu lực ở mọi thời điểm — bất biến của dữ liệu, không chỉ của seed hay demo; cấp vai thứ hai bị từ chối, và thao tác gán/thu hồi vai thông thường **không** cấp hay thu hồi vai này.
  - **(b)** *Đang giữ vai* khác *dùng được*: khóa tài khoản hoặc nhân viên nghỉ việc **không** làm vai trống và **không** mở đường cấp vai cho người khác ngoài quy trình; vì vậy tài khoản đang giữ vai không khóa được trong ứng dụng — muốn khóa phải chuyển giao trước.
  - **(c)** **Chuyển giao** là cách duy nhất đổi người giữ vai trong ứng dụng: do Super Admin đang giữ vai và dùng được thực hiện cho **một** người kế nhiệm đủ điều kiện (tài khoản hoạt động, nhân viên đang làm việc, tài khoản đã kích hoạt và nguồn xác minh email hợp lệ, không giữ `IT_ADMIN`/`FINANCE`/vai duyệt); thu hồi vai người cũ và cấp vai người mới trong **một** giao dịch, lỗi thì hoàn tác toàn bộ; quyền của người cũ bị đánh giá lại ở thao tác kế tiếp; ghi Audit Trail cho cả hai tài khoản.
  - **(d)** **Khôi phục ngoài ứng dụng** (`QĐ-41b`, `QĐ-44d`, `QĐ-47a`, `QĐ-47e`, `QĐ-47f`) — chỉ do người vận hành hạ tầng thực hiện theo **phiếu phê duyệt bằng văn bản**; không có đường HTTP, không có cờ cho API bỏ qua xác thực, **không** dùng khởi tạo để sửa tài khoản đã có; người vận hành và người phê duyệt **không bao giờ** đặt, thấy hay biết mật khẩu hoặc mã — người nhận tự đặt qua liên kết dùng một lần. Ba chế độ:
    - **(d1) Mở khóa** — tài khoản người giữ vai bị khóa, nhân viên còn làm việc: chỉ mở khóa, không cấp vai thứ hai.
    - **(d2) Chuyển lại vai** — người giữ vai không dùng được vì nhân viên **đã nghỉ việc**, hoặc không còn người giữ vai, hoặc tài khoản người giữ vai bị khóa mà phiếu chọn người nhận **khác**: thu hồi vai người cũ rồi cấp vai người nhận trong **một** giao dịch, không kích hoạt lại nhân viên đã nghỉ; người nhận phải đủ điều kiện như người kế nhiệm (trừ nhập lại mật khẩu) **tại thời điểm nhận vai**. Nếu người nhận chưa có tài khoản đủ điều kiện, thủ tục **chuẩn bị** một tài khoản chưa kích hoạt và gửi lời mời **dưới cùng một phiếu**; vai chỉ chuyển ở giai đoạn **hoàn tất** sau khi người nhận đã kích hoạt — kích hoạt bằng lời mời **không bao giờ** tự cấp vai. Việc tạo tài khoản ở giai đoạn chuẩn bị là **một trong hai** ngoại lệ có kiểm soát ngoài ứng dụng của `FR-8.6` (ngoại lệ kia là lệnh khởi tạo — `FR-9.8`), chỉ được làm khi đồng thời: có phiếu phê duyệt bằng văn bản; tổ chức **không có Super Admin dùng được**; người nhận **chưa có** tài khoản đang hoạt động và đã kích hoạt; nhân viên của người nhận **đang làm việc** (không nghỉ dài, không đang bàn giao, không đã nghỉ việc) và thỏa các điều kiện người kế nhiệm khác ngoài kích hoạt — tài khoản tạo từ hồ sơ nhân viên đã có, Audit Trail ghi tác nhân hệ thống kèm mã phiếu, **không** cấp vai nào, **không** đổi trạng thái nhân viên.
    - **(d3) Khôi phục thông tin đăng nhập** — người giữ vai còn hoạt động, nhân viên còn làm việc, mất cả mật khẩu lẫn hộp thư: xóa thông tin đăng nhập cũ, thu hồi mọi phiên và liên kết, người nhận tự đặt mật khẩu mới qua liên kết dùng một lần; **ngoại lệ duy nhất** cho phép thay email đăng nhập (chỉ ở chế độ này, chỉ khi hộp thư cũ đã mất, địa chỉ mới duy nhất trong tổ chức, người phê duyệt đã xác minh danh tính ngoài hệ thống và ghi mã tham chiếu); nhãn *đã xác minh* chỉ có hiệu lực với địa chỉ mới sau khi người nhận mở liên kết gửi tới chính địa chỉ đó.

    Chạy lại cùng phiếu không tác động lần hai; trong lúc khôi phục đang chờ, quên mật khẩu thông thường **không** gửi thư cho tài khoản đó.
  - **(e)** Khi IT Admin chuyển người đang giữ vai sang *đang bàn giao* hoặc *đã nghỉ việc*, hệ thống **cảnh báo** (không chặn) rằng vai chưa được chuyển giao, **ghi audit có cờ**, và người giữ vai cùng danh sách việc cần xử lý của IT Admin thấy cảnh báo trong thời gian *đang bàn giao*; **không** thêm quy trình hai người duyệt việc nghỉ của người giữ vai (`QĐ-47b`). Quá ngày làm việc cuối mà nhân viên chưa được chuyển *đã nghỉ việc* **không** làm mất quyền (`FR-8.9`) — chỉ là cảnh báo quá hạn bàn giao. Giám sát vận hành báo **riêng** ba điều: *không còn người giữ vai*, *người giữ vai không dùng được* (bị khóa, đã nghỉ việc, chưa kích hoạt, hoặc đang chờ đặt lại thông tin đăng nhập) và *cảnh báo quá hạn bàn giao*. Nghỉ có kế hoạch theo thứ tự *chuyển giao trước, rồi mới cho nghỉ việc*; nghỉ khẩn cấp xử lý bằng (d2).
- **FR-8.11:** **Vòng đời thông tin đăng nhập do backend quản lý** (`QĐ-46a`). **(a)** Đặt mật khẩu lần đầu qua **lời mời dùng một lần** gửi tới email đăng nhập — trừ tài khoản Super Admin đầu tiên, do chính người giữ vai đặt khi chạy lệnh khởi tạo (`FR-9.8`); lời mời hết hạn, đã dùng hoặc đã bị lời mời mới thay thế thì bị từ chối, và gửi lại lời mời làm vô hiệu lời mời cũ. **(b)** **Không ai** — kể cả Super Admin, IT Admin hay người vận hành — thấy hoặc biết mật khẩu; hệ thống chỉ lưu dạng băm, không gửi mật khẩu qua email, không ghi mật khẩu hay mã lời mời vào nhật ký. **(c)** Quên mật khẩu là **tự phục vụ**: phản hồi **giống hệt nhau** dù email có hay không có trong hệ thống; chỉ tài khoản đã kích hoạt, đang hoạt động và có nhân viên chưa nghỉ việc mới nhận thư; liên kết đặt lại dùng một lần. **(d)** Đặt lại hoặc đổi mật khẩu **thu hồi mọi phiên đăng nhập** của tài khoản và **không** đổi vai, trạng thái khóa hay trạng thái nhân viên; đổi mật khẩu cần nhập mật khẩu hiện tại. **(e)** Tài khoản bị khóa hoặc của nhân viên đã nghỉ việc **không đăng nhập được** (`FR-8.9`). **(f)** Nhập sai nhiều lần dẫn tới **từ chối tạm thời**, **không bao giờ** khóa vĩnh viễn tài khoản; đặt lại mật khẩu vẫn dùng được. **(g)** Phiên đăng nhập là phiên/token nội bộ của hệ thống. **(h)** Khôi phục thông tin đăng nhập của Super Admin duy nhất và việc thay email đăng nhập: xem `FR-8.10(d3)`. Giá trị cụ thể — thời hạn lời mời và phiên, chính sách mật khẩu, thuật toán băm, giới hạn tần suất — là thiết kế kỹ thuật của BE (`QĐ-47`), **không** là yêu cầu nghiệp vụ của tài liệu này.

### 5.9. Phân hệ Khởi tạo dữ liệu ban đầu

Phân hệ này trả lời câu hỏi *"ngày đầu tiên triển khai, doanh nghiệp phải làm gì"*. Không có nó thì hệ thống không có điểm bắt đầu.

**Năm bước khởi tạo, theo đúng thứ tự phụ thuộc:**

| Bước | Nội dung | Phụ thuộc bước trước | Giá trị đạt được sau bước này |
| ---- | -------- | -------------------- | ----------------------------- |
| 1 | Nhập **phòng ban** (trưởng phòng, Cost Center, IT Admin phụ trách) và danh sách nhân sự kèm phòng, chức vụ (`QĐ-52`) | — | Có tổ chức để định tuyến phê duyệt |
| 2 | Khai báo ứng dụng đang dùng, kèm người sở hữu nghiệp vụ và mức nhạy cảm dữ liệu | Cần bước 1 để gán chủ sở hữu | Có danh mục đã phê duyệt |
| 3 | Nhập hợp đồng, gói, số seat đã mua, kỳ hạn, hạn chót báo hủy | Cần bước 2 | **Cảnh báo gia hạn bắt đầu chạy (PP-2)** |
| 4 | Ghi nhận hiện trạng ai đang giữ seat nào | Cần bước 1 và 3 | **Phát hiện được G1 và G2 (PP-1)** |
| 5 | Import log sử dụng nếu lấy được | Cần bước 4 | Phát hiện thêm G3 và G4 |

**Yêu cầu:**

- **FR-9.1:** Hệ thống cung cấp một checklist khởi tạo năm bước, hiển thị trạng thái hoàn thành từng bước và dẫn thẳng tới màn hình tương ứng. Bước 1 **hoàn tất** khi file nhân sự hết dòng lỗi và mọi phòng có Cost Center; phòng thiếu trưởng phòng hoặc IT Admin phụ trách chỉ cảnh báo; bộ công cụ chuẩn **không** là điều kiện của bước nào (`QĐ-66d`).
- **FR-9.2:** Mỗi bước dùng lại khung import 6 bước tại FR-7.1, gồm cả bước xem trước bắt buộc. Không có luồng nhập liệu riêng cho khởi tạo — trừ lệnh khởi tạo cài đặt **trước bước 1**, ngoài ứng dụng (`FR-9.8`). Nhập tay từng nhân viên (`FR-2.1`) là thao tác thường, không phải luồng khởi tạo riêng.
- **FR-9.3:** Hệ thống cung cấp file mẫu tải về cho từng loại dữ liệu ở bước 1 đến bước 4, kèm mô tả từng cột và ví dụ.
  > *Thứ tự triển khai* (`QĐ-43e`, không đổi yêu cầu): lát S0 hiện thực `FR-9.2`/`FR-9.3` cho **bước 1** (nhân sự) và **bước 4** (hiện trạng seat); bước 2–3 ở S0 nhập **tay**. Import tệp và file mẫu cho danh mục/thuê bao làm ở **lát sau S0**. Hai yêu cầu **vẫn** trong phạm vi đồ án và **chưa** hoàn tất cho tới khi phủ đủ bốn bước.
- **FR-9.4:** Assignment nhập ở bước 4 được phép **không có** request nguồn, và được đánh dấu là dữ liệu khởi tạo để phân biệt với assignment sinh từ quy trình. Giai đoạn khởi tạo — giai đoạn duy nhất cho phép Assignment không có request — **đóng khi IT Admin chốt hoàn tất bước 4** (ghi Audit Trail); sau đó mọi Assignment phải có request, chênh lệch đi qua đối soát sai lệch (`OI-10`).
- **FR-9.5:** Sau bước 4, hệ thống chạy ngay lần đánh giá đầu tiên cho nhóm G1 và G2, và hiển thị kết quả trên bảng điều khiển.
- **FR-9.6:** Trạng thái rỗng của mọi màn hình chính phải dẫn người dùng về đúng bước khởi tạo còn thiếu, thay vì hiển thị một trang trắng.
- **FR-9.7:** **Phòng ban là trường bắt buộc của file nhân sự ở bước 1**, cùng với **chức vụ** (`QĐ-30c`, `QĐ-52a`, `QĐ-52b`). Chức vụ lấy từ **danh mục chức vụ** do IT Admin duy trì; giá trị không có trong danh mục ⟹ lỗi dòng, không tự tạo (`QĐ-66c`). Cost Center của nhân viên **suy ra** từ Cost Center `Unit` của phòng nên `INV-14b` vẫn giữ. Bản ghi nhân sự **thiếu phòng ban bị từ chối** ở bước xem trước của khung import (`FR-7.1`), kèm thông báo nêu đúng dòng và cột thiếu; hệ thống **không** tạo nhân viên không có phòng (`INV-20`). Mã phòng trong file phải **đã có**; mã chưa có bị từ chối theo dòng, **không** tự tạo. Cost Center của phòng phải có trong danh mục do Finance quản lý (`FR-3.1`, `OI-04`). File mẫu ở `FR-9.3` đánh dấu các cột này là bắt buộc.
  > *Các ca không thuộc một phòng cụ thể:* tài khoản dịch vụ, bot/CI và tài khoản dùng chung **không** là dòng của file nhân sự; Cost Center của chúng ghi trên **Assignment** — `Company` cho tài khoản dịch vụ và tài khoản dùng chung toàn công ty, `Unit` của phòng cho tài khoản dùng chung của phòng (mục 4.5, `QĐ-40d`, `QĐ-54d`). `Company` là một loại đã được thiết kế, **không** phải giá trị giữ chỗ. Nhà thầu, freelancer và thực tập sinh thuộc **phòng ban** họ làm việc và dùng Cost Center `Unit` của phòng đó.
  >
  > *Import lại file nhân sự* chỉ tạo nhân viên chưa có; dòng của nhân viên đã có mà khác dữ liệu hiện hành được báo là khác biệt, **không** ghi — đổi phòng hay chức vụ đi qua thao tác có ngày hiệu lực (`FR-2.2`, `QĐ-40b`, `QĐ-40c`).
  >
  > ⚠️ **Không** được tạo một phòng hay Cost Center tên *"Chưa phân loại"* để lách `INV-14b`/`INV-20`. Làm vậy là đưa lại đúng trạng thái `0..1` dưới một cái tên khác, và làm hỏng mọi báo cáo quy về đơn vị chịu chi phí.
- **FR-9.8:** **Khởi tạo cài đặt** (`QĐ-67a`, `QĐ-67b`). Trước bước 1, một lệnh **ngoài ứng dụng**, chạy **một lần** khi chưa có tổ chức, tạo trong **một giao dịch**: tổ chức (múi giờ — `FR-7.5`; đồng tiền báo cáo), **một** Cost Center `Unit`, **một** phòng gắn Cost Center đó, **một** chức vụ, Employee của người sẽ giữ vai Super Admin và **một** Employee IT chưa có tài khoản — cả hai thuộc phòng đó từ ngày vào (`INV-20`) — và tài khoản Super Admin **đã kích hoạt**, mật khẩu do **chính người giữ vai** đặt khi chạy lệnh (`FR-8.11(b)`). Giá trị là giá trị thật của tổ chức, không giữ chỗ. Audit Trail ghi **ngoại lệ cài đặt**, cùng giao dịch với dữ liệu; cách nhận diện người vận hành là thiết kế kỹ thuật của BE. Đây là ngoại lệ có kiểm soát của `FR-3.1`, `FR-3.17`, danh mục chức vụ (`FR-9.7`), `FR-9.2`, `FR-8.6` và `FR-8.11(a)`; trong ứng dụng các quy tắc đó giữ nguyên và Super Admin vẫn không tạo nhân viên hay phòng (`SoD-1`). Chạy lại khi đã có tổ chức thì thoát, không sửa gì; **không** dùng khởi tạo để sửa tài khoản đã có (`FR-8.10(d)`). Sau khởi tạo, Finance và IT Admin sửa các bản ghi bằng thao tác thường; Employee của Finance vào bằng import rồi Super Admin tạo tài khoản (`QĐ-67c`).

> **Điểm cần nhấn khi trình bày:** sau **bước 4**, hệ thống đã tạo ra giá trị đo được mà **chưa cần một dòng log bên ngoài nào** — nó biết ngay có bao nhiêu seat đã mua mà chưa gán, và bao nhiêu seat còn nằm trong tay người đã nghỉ việc. Bước 5 chỉ mở khóa thêm hai nhóm lãng phí tinh vi hơn. Điều này cho thấy hệ thống **không phụ thuộc hoàn toàn vào việc lấy được log từ nhà cung cấp** — vốn là rủi ro lớn nhất của phân hệ Usage.

### 5.10. Luồng nghiệp vụ chính (Key Business Flows)

| Luồng | Diễn tiến |
| ----- | --------- |
| **Khởi tạo dữ liệu ban đầu** | IT Admin nhập phòng ban và nhân sự → khai báo ứng dụng → nhập hợp đồng và thuê bao → ghi nhận hiện trạng seat → hệ thống chạy đánh giá G1/G2 đầu tiên → import log nếu có |
| **Cấp quyền thông thường** | Employee gửi request (hệ thống hiện bộ công cụ chuẩn trước) → trưởng phòng xác nhận nhu cầu → IT Admin cấp seat theo kiểu cấp của gói, qua connector hoặc tác vụ thủ công → hệ thống thông báo kết quả và ghi Audit Trail |
| **Phát sinh chi phí** | Employee gửi request → trưởng phòng xác nhận → Người duyệt chi duyệt trên snapshot ngân sách theo chi phí thực chịu *(tùy chọn hỏi Finance)* → hệ thống tạo khoản cam kết → song song: Finance ghi nhận ngân sách, IT Admin mua/cấp seat → hệ thống ghi nhận Cost Center và Audit Trail |
| **Phần mềm mới** | Employee gửi request (`BM-02`) → trưởng phòng xác nhận → IT Admin đánh giá danh mục, rủi ro **và mức kiểm soát** — *không kiểm soát được* ⟹ IT từ chối, báo Employee và trưởng phòng kèm phương án thay thế, kết thúc (`QĐ-53c`) → Người duyệt chi duyệt *(snapshot và tùy chọn hỏi Finance nếu có chi phí)* → khoản cam kết và Finance ghi nhận nếu có chi phí ∥ IT Admin thêm vào danh mục và cấp seat |
| **Bộ thu thập trên thiết bị** | IT Admin bàn giao và đăng ký thiết bị ↔ nhân viên → nhân viên ký xác nhận đã biết rõ chính sách và xác nhận trong hệ thống (`FR-4.21`) → tiện ích / agent phiên người dùng / client AI có OTel gửi dữ liệu đã lọc tại nguồn → hệ thống nhận vào nguồn usage → rule G3/G4 dùng dữ liệu này. Bằng chứng Shadow IT từ bộ thu thập chuyển sang giai đoạn sau (`QĐ-31a`) |
| **Hoàn trả / thu hồi** | Employee yêu cầu hoàn trả hoặc trưởng phòng xác nhận không còn nhu cầu → IT Admin thu hồi → seat về trạng thái trống để tái phân bổ hoặc giảm số lượng khi gia hạn. Phần mềm nội bộ: IT thu hồi **ngoài hệ thống** rồi xác nhận kèm bằng chứng. **Thu hồi một quyền không tự ghi nhận tiền tiết kiệm** — tiết kiệm chỉ ghi khi hợp đồng/khoản chi thực sự giảm theo `FR-4.15`; license vĩnh viễn chỉ đưa seat về kho |
| **Ghost Seat** | Automation Service sinh khuyến nghị theo rule → trưởng phòng chọn Keep/Reclaim/Exempt kèm lý do và giữ quyết định cuối → IT được trả lại tối đa một lần có lý do kỹ thuật/hợp đồng, trưởng phòng quyết lại; IT thực thi nếu Reclaim → Finance nhận thông tin tiết kiệm (`OI-02`) |
| **Điều chuyển phòng** (`MF-7`) | IT Admin ghi phòng mới (kèm chức vụ nếu đổi) và ngày hiệu lực → hệ thống đóng kỳ tổ chức cũ và mở kỳ mới, **không ghi đè** (`FR-2.2`, `ADR-04`) → chi phí theo kỳ chia **theo ngày** (`FR-5.3`); **chỉ các bước chờ duyệt nhu cầu** được xác định lại cho trưởng phòng mới (`FR-3.16`, SLA không đặt lại; bước chi tiền và bước thực thi giữ người xử lý) → người điều chuyển đang chịu trách nhiệm tài khoản dùng chung của phòng cũ phải được thay **trước ngày hiệu lực** (`FR-2.12`) → hệ thống so quyền đang giữ với **bộ công cụ chuẩn** của phòng mới: công cụ thuộc bộ chuẩn mặc định *giữ*; công cụ ngoài bộ chuẩn do trưởng phòng mới rà soát trong **5 ngày làm việc** — **còn cần** → giữ · **không còn cần** → IT thu hồi (`WF-09a`; phần mềm nội bộ thu hồi ngoài hệ thống kèm bằng chứng) · **cần công cụ mới** → yêu cầu mới theo `MF-2`. **Điều chuyển không phải thu hồi:** hệ thống **không** tự thu hồi quyền nào; chưa có quyết định ⟹ quyền giữ nguyên; quá hạn ⟹ nhắc trưởng phòng và cảnh báo IT Admin (`FR-3.8`, `QĐ-50b`, `QĐ-56a`). Seat thu hồi về kho; tiết kiệm chỉ ghi theo `FR-4.15` |
| **Nhân viên nghỉ việc** (`MF-5`) | IT Admin ghi bàn giao kèm ngày làm việc cuối → trưởng phòng xác nhận **bàn giao dữ liệu** theo *lưu ý trước khi thu hồi* của từng gói; người nghỉ đang chịu trách nhiệm tài khoản dùng chung phải được thay; người nghỉ là trưởng phòng ⟹ IT chỉ định **trưởng phòng mới** (chưa có ⟹ `FR-3.6`) → trạng thái chuyển sang đã nghỉ → hệ thống liệt kê toàn bộ quyền đang giữ → IT Admin thu hồi theo checklist `BM-08`: gỡ khỏi workspace / hủy gia hạn gói cá nhân / thu khóa → khóa tài khoản công ty → seat về kho. **Không** có người kế nhiệm license; tiết kiệm chỉ ghi khi hợp đồng/khoản chi thực sự giảm (`FR-4.15`, `FR-2.12`). Tài khoản đăng nhập bị chặn từ khi đã nghỉ (`FR-8.9`). Bàn giao đã ghi có thể **đổi ngày làm việc cuối** (khi chưa qua ngày cuối) hoặc **hủy** (trước khi đã nghỉ), bắt buộc lý do (`QĐ-48a` → `QĐ-48c`); chỉ định trưởng phòng mới chưa hiệu lực dời theo ngày cuối mới hoặc bị hủy khi hủy bàn giao (`QĐ-66q`) |
| **Shadow IT** | Import bằng chứng CSV sao kê/hóa đơn (`QĐ-31a`) → đối soát dữ liệu chi đã có → đối chiếu danh mục → tạo finding → IT đánh giá kỹ thuật và mức kiểm soát; trưởng phòng cung cấp bối cảnh **khi** khoản chi gắn với nhân viên phòng mình — không chặn quyết định (`QĐ-62d`) → Người duyệt chi quyết *báo nhầm / không duyệt / hợp thức hóa* (`BM-07`) → IT thực thi; không duyệt chi lần hai sau hợp thức hóa (`FR-3.4c-1`, `DQ-06`) |
| **Đối soát nhà cung cấp** | Job định kỳ so sánh dữ liệu nội bộ với nhà cung cấp → phát hiện sai lệch → IT Admin xử lý |
| **Kiểm soát và phân bổ chi phí theo kỳ** (`MF-8`) | Finance nhập hoặc import hóa đơn của kỳ kèm **dòng thuế theo chứng từ** (`FR-5.13`), **hoặc ghi một khoản chi phí phần mềm nội bộ** (phần mềm, ngày/kỳ, số tiền và tiền tệ, đúng một Cost Center — đi thẳng tới phân bổ, không cần hóa đơn, thuê bao hay nhà cung cấp; `QĐ-49g`); khoản chi trên sao kê/thẻ đối soát từng khoản qua `MF-6` → hệ thống ghép dòng hóa đơn với thuê bao/phần mềm và kỳ → so với bản ghi mua: **khớp** → ghi nhận; **chỉ lệch do thuế/tỷ giá** → ghi nhận, tách vào chênh lệch thuế/tỷ giá; **lệch số lượng/đơn giá** → hóa đơn **vẫn tính vào chi thực tế như đã nhận** (`QĐ-34b`), song song mở `Discrepancy` giữ cả hai giá trị, IT điều tra cùng Finance: *mua đã duyệt nhưng chưa ghi* → **IT Admin** cập nhật thuê bao theo căn cứ, Finance đính hóa đơn/căn cứ; IT Admin đóng hồ sơ (`QĐ-62b`) · ***nhà cung cấp tính sai*** → ghi chú xác minh bắt buộc, điều chỉnh đến sau bằng hóa đơn mới (`QĐ-49f`) · *quyền cấp ngoài quy trình* → hợp thức hóa hoặc thu hồi (`WF-17`/`WF-09a`; chỉ Người duyệt chi quyết hợp thức hóa); hồ sơ chỉ đóng bằng quyết định, không tự đóng theo thời gian → chuyển khoản cam kết đã khớp thành chi phí theo số tiền (`FR-5.8`) → phân bổ về Cost Center: theo seat → phòng có hiệu lực tại ngày chi phí, chia theo ngày khi điều chuyển (`ADR-04`, `FR-5.3`); tài khoản dịch vụ và dùng chung toàn công ty → `Company`, dùng chung của phòng → `Unit` của phòng; gói dùng chung → tỷ lệ Finance khai báo, tổng 100% (`INV-03`); **phần mềm nội bộ → đúng một Cost Center do Finance gán**; **khoản chi sao kê chưa được hóa đơn giải thích** → thực chi của kỳ, theo căn cứ nếu có, nếu chưa có ⟹ dòng *Chưa phân bổ Cost Center* và ngoại lệ vẫn mở qua `MF-6` (`QĐ-50c`) → cập nhật báo cáo kỳ trên **chi phí thực chịu** (GTGT được khấu trừ ở cột riêng): ngân sách · thực chi · cam kết đang giữ · còn lại · dòng *Chưa phân bổ Cost Center* (nếu có) · ngoại lệ đang mở; tùy chọn **AI soạn bản nháp diễn giải** từ số liệu backend, Finance xem và sửa (`QĐ-49e`; AI tắt/lỗi thì viết tay hoặc phát hành báo cáo như cũ). Finance **không** là người duyệt. Hệ thống **không** có thanh toán, sổ cái, kết nối ngân hàng; thuế chỉ **ghi nhận**, không tính/kê khai (`QĐ-34`, `QĐ-55a`) |

> **Bộ năm main flow trình bày** (`QĐ-49d`): **`MF-2`** Yêu cầu, phê duyệt và cấp quyền → **`MF-7`** Điều chỉnh quyền khi nhân viên chuyển phòng → **`MF-5`** Nghỉ việc và thu hồi quyền → **`MF-8`** Kiểm soát và phân bổ chi phí phần mềm theo kỳ → **`MF-4`** Gia hạn, giảm số lượng hoặc hủy thuê bao. **`MF-1`** (khởi tạo tổ chức) là chức năng nền, không trình bày như một main flow. **`MF-3`** vẫn trong phạm vi: giới thiệu ngắn, hình chi tiết ở phụ lục. **`MF-6`** là tính năng bổ sung *Đối soát chi phí phần mềm* (`QĐ-33a`), nối từ `MF-8`. **Không** có main flow rà soát/thanh lý dịch vụ nội bộ ở đợt này. Hình ở [Main Business Flows](../Diagrams/main-workflows-activity-diagram/index.md); hình và workflow chuẩn chưa cập nhật theo `QĐ-49` → `QĐ-58` **không** phủ định BRD.

*Chi tiết từng luồng ở mức nghiệp vụ nằm ở tài liệu **User Flows nghiệp vụ**; đặc tả máy trạng thái nằm ở **mục 5.12** của chính tài liệu này.*

### 5.11. Phân hệ Quyền của chủ thể dữ liệu

Hệ thống xử lý dữ liệu hành vi của người lao động, nên các quyền của chủ thể dữ liệu theo Luật Bảo vệ dữ liệu cá nhân không phải yêu cầu bên ngoài mà là **yêu cầu chức năng thật**.

- **FR-10.1:** Nhân viên xem được toàn bộ dữ liệu hệ thống đang lưu về mình: danh sách seat được cấp, lịch sử yêu cầu, dữ liệu sử dụng đã tổng hợp của chính mình, dữ liệu từ bộ thu thập trên thiết bị, thiết bị đã đăng ký và các lần xác nhận.
- **FR-10.2:** Nhân viên yêu cầu xuất dữ liệu cá nhân của mình ra file. Hệ thống ghi nhận thời điểm tiếp nhận và thời điểm hoàn tất.
- **FR-10.3:** Hệ thống tự động xóa dữ liệu quá hạn lưu giữ theo chính sách tại mục 7.5, có ghi nhật ký số bản ghi đã xóa.
- **FR-10.4:** **Bắt buộc cho MỌI ứng dụng, không riêng nhóm dịch vụ liên lạc** (`QĐ-01`). Khi một ứng dụng bắt đầu được theo dõi mức độ sử dụng, hệ thống thông báo cho các nhân viên đang giữ seat của ứng dụng đó, nêu rõ loại dữ liệu được thu thập và mục đích. Với **bộ thu thập trên thiết bị**, thông báo phải được gửi **trước** khi thiết bị gửi dữ liệu và phải có **xác nhận chủ động** của nhân viên theo `FR-4.18`; thông báo đơn thuần là **không đủ** cho nguồn này (`QĐ-20`). Thông báo có **phiên bản**: Super Admin đánh dấu phiên bản *cần xác nhận lại* khi **loại dữ liệu hoặc mục đích** thay đổi — khi đó không nhận dữ liệu từ thiết bị tới khi nhân viên xác nhận lại (`INV-17`); phiên bản chỉ sửa câu chữ thì chỉ thông báo (`QĐ-62q`).
- **FR-10.5:** Hệ thống ghi nhận mọi yêu cầu liên quan tới quyền chủ thể dữ liệu kèm thời điểm tiếp nhận, người xử lý và thời điểm hoàn tất, phục vụ chứng minh việc đáp ứng đúng thời hạn. **IT Admin** tiếp nhận/xử lý yêu cầu dừng thu thập và ngoại lệ xuất dữ liệu; happy path xuất file vẫn tự động (`OI-01`). Yêu cầu dừng thu thập xử lý trong **2 ngày làm việc**; yêu cầu chỉnh sửa (`FR-10.7`) và ngoại lệ xuất dữ liệu trong **10 ngày** — mặc định theo bảng thời hạn dưới đây, cấu hình được; quá hạn thì nhắc và cảnh báo nghẽn như `FR-3.8`. Yêu cầu **hợp lệ** luôn được thực hiện; chỉ yêu cầu **không hợp lệ** (không phải thiết bị/dữ liệu của mình, trùng, đã dừng) bị đóng kèm lý do, nhân viên gửi lại được; MVP không có luồng kháng nghị. IT Admin được tự xử lý yêu cầu của chính mình, Audit Trail gắn cờ *tự xử lý* (`OI-01a`, `OI-01b`, `OI-01c`, `OI-13b`). Hệ quả của việc dừng thu thập theo nội quy lao động do doanh nghiệp quyết, ngoài phạm vi hệ thống (`FR-4.21`).
- **FR-10.7:** Nhân viên **yêu cầu chỉnh sửa** dữ liệu cá nhân sai (ví dụ email, liên kết thiết bị); IT Admin xử lý và ghi nhận theo `FR-10.5`. **Không** sửa dữ liệu usage gốc hay Audit Trail; dữ liệu nhân sự sai được sửa theo nguồn nhân sự (`FR-2.1`, `OI-13`).

**Thời hạn đáp ứng theo quy định** *(tham chiếu Nghị định 356/2025/NĐ-CP — cần nhóm kiểm chứng lại tại văn bản gốc trước khi đưa vào báo cáo cuối)*:

| Loại yêu cầu | Thời hạn |
| ------------ | -------- |
| Phản hồi yêu cầu rút đồng ý, hạn chế, phản đối xử lý | 2 ngày làm việc |
| Cung cấp, xem, chỉnh sửa dữ liệu | 10 ngày |
| Thực hiện yêu cầu khi trực tiếp xử lý | tối đa 15 ngày |
| Xóa dữ liệu | 20 ngày |

> **Vì sao nên làm phân hệ này:** phần lớn yêu cầu trên dựa trên thứ đã có — FR-10.1 dựa trên màn hình "Phần mềm của tôi", FR-10.3 dựa trên chính sách lưu giữ, FR-10.5 dựa trên Audit Trail. Chi phí bổ sung thấp, nhưng nó biến phần tuân thủ từ một mục rủi ro trong báo cáo thành **một nhóm tính năng demo được**.

### 5.12. Khung mô hình miền nghiệp vụ

Mục này giữ ba nội dung lõi của mô hình miền — ranh giới ngữ cảnh, bất biến dữ liệu và máy trạng thái — để **BRD là nguồn chân lý duy nhất**. Mục dừng ở mức **khung**: nêu ranh giới, bất biến và vòng đời cùng căn cứ của từng thứ. Lược đồ bảng chi tiết, kiểu dữ liệu từng cột và bảng chuyển trạng thái đầy đủ thuộc về tài liệu thiết kế kỹ thuật.

#### 5.12.1. Tám ranh giới ngữ cảnh nghiệp vụ

Hệ thống chia thành tám vùng, mỗi vùng có bộ thuật ngữ và quy tắc riêng. Ranh giới này là cơ sở để chia module ở tầng mã nguồn (xem ADR-11).

| Mã | Ranh giới ngữ cảnh | Thực thể chính | Phân hệ tương ứng |
| -- | ------------------ | -------------- | ----------------- |
| **C1** | Danh mục & Hợp đồng | Vendor, SaaSProduct, Plan (kiểu cấp, mức kiểm soát, điều khoản — `FR-1.9`, `FR-1.10`), Subscription, Contract, Invoice | 5.1 |
| **C2** | Nhân sự & Tổ chức | Employee, **Department** (trưởng phòng, IT Admin phụ trách, bộ công cụ chuẩn), chức vụ, CostCenter, quan hệ nhân viên–phòng có lịch sử (`QĐ-52`) | 5.2, 5.3 |
| **C3** | Cấp phát License | Assignment, ProvisioningTask, Discrepancy, kho khóa bản quyền (`FR-2.10`) | 5.2 |
| **C4** | Yêu cầu & Phê duyệt | Request, ApprovalStep *(loại bước: nhu cầu, đánh giá IT, duyệt chi)*, chính sách định tuyến, hồ sơ/biểu mẫu (5.13) | 5.3 |
| **C5** | Sử dụng & Tối ưu | UsageSource, UsageRecord, IdentityMapping, GhostSeatRecommendation, Attestation, **ManagedDevice**, **MonitoringAcknowledgment** | 5.4 |
| **C6** | Phát hiện ngoài danh mục | VendorDictionary, DiscoveryEvidence, DiscoveryFinding | 5.6 |
| **C7** | Tài chính & Kế hoạch chi phí | CostAllocation, Budget, **BudgetCommitment**, Forecast, ExchangeRate, hồ sơ thuế nhà cung cấp và dòng thuế hóa đơn (`FR-5.13`) | 5.5 |
| **C8** | Nền tảng & Quản trị | AppUser, Role, AuditTrail, Job, cấu hình hệ thống, yêu cầu quyền chủ thể dữ liệu | 5.8, 5.11 |

> **Nguyên tắc chia ranh giới:** chia theo **nghiệp vụ**, không chia theo tầng kỹ thuật. Lý do nằm ở C3 và C4: *quyết định cho một người dùng phần mềm* (C4) và *việc tạo tài khoản thật phía nhà cung cấp* (C3) là hai chuyện khác nhau, có vòng đời khác nhau — đúng như ADR-07 đã chốt. Nếu gộp chúng vào một vùng thì không mô tả được tình huống "đã duyệt nhưng chưa tạo được tài khoản".
>
> **Điểm giao nhau cần chú ý:** C5 phụ thuộc C3 (log gắn vào Assignment chứ không gắn vào nhân viên — FR-4.7), và C7 phụ thuộc C2 (chi phí quy về Cost Center **tại thời điểm phát sinh** — ADR-04). Hai phụ thuộc này là nơi lỗi âm thầm hay xuất hiện nhất.

#### 5.12.2. Hai mươi bất biến dữ liệu

**Bất biến** là quy tắc luôn phải đúng, bất kể thao tác nào vừa xảy ra. Nguyên tắc của dự án: bất biến nào có thể ràng buộc ở **tầng cơ sở dữ liệu** thì phải đặt ở đó, không đặt ở tầng ứng dụng — vì kiểm tra ở tầng ứng dụng vẫn bị phá khi hai người thao tác đồng thời.

| Mã | Bất biến | Căn cứ | Ràng buộc ở đâu |
| -- | -------- | ------ | --------------- |
| **INV-01** | Số Assignment đang chiếm chỗ không vượt quá `purchased_quantity` của Subscription | 7.4, ADR-02 | CSDL + kiểm tra tranh chấp |
| **INV-02** | Các khoảng hiệu lực của cùng cặp (nhân viên, thuê bao) không được chồng lấn | FR-2.7, 7.4 | **CSDL** — ràng buộc loại trừ theo khoảng thời gian |
| **INV-03** | Tổng tỷ lệ phân bổ chi phí của một Subscription bằng 100% | 7.4 | CSDL + kiểm tra khi ghi |
| **INV-04** | Mọi trường tiền có loại tiền tệ, tỷ giá, ngày áp dụng tỷ giá và giá trị đã quy đổi | FR-1.6, ADR-03, 7.4 | CSDL — `NOT NULL` trên cả bộ trường |
| **INV-05** | Nhật ký kiểm toán chỉ ghi thêm; `UPDATE` và `DELETE` bị từ chối | FR-8.3 | **CSDL** — quy tắc từ chối ở tầng bảng |
| **INV-06** | Mỗi mục danh mục có đúng một Business Owner đang làm việc, không được rỗng | FR-1.7 | Ứng dụng + cảnh báo khi chủ sở hữu nghỉ việc |
| **INV-07** | Assignment gắn với nhà thầu, freelancer hoặc thực tập sinh bắt buộc có ngày kết thúc dự kiến | FR-2.8 | CSDL — ràng buộc có điều kiện |
| **INV-08** | Người yêu cầu không đồng thời là người phê duyệt của cùng một Request | SoD-4, FR-3.3 | Ứng dụng — chặn ở tầng API, có test phủ định |
| **INV-09** | Quyết định miễn trừ (Exempt) bắt buộc có thời hạn, tối đa 12 tháng | FR-3.10 | CSDL — `NOT NULL` + kiểm tra khoảng |
| **INV-10** | Mỗi nguồn usage bắt buộc khai báo cửa sổ dữ liệu bao phủ | FR-4.3 | CSDL — `NOT NULL` |
| **INV-11** | Mỗi nguồn usage bắt buộc khai báo định nghĩa "hoạt động" của nguồn đó | FR-4.16 | CSDL — `NOT NULL` |
| **INV-12** | Bản ghi chưa khớp được danh tính không được dùng làm căn cứ cho bất kỳ khuyến nghị nào | FR-4.6, FR-4.10 | Ứng dụng — cổng lọc của rule engine |
| **INV-13** | Mỗi nhà cung cấp chỉ có một Discovery Finding đang mở tại một thời điểm | FR-6.7 | CSDL — chỉ mục duy nhất có điều kiện |
| **INV-14a** | Các khoảng hiệu lực *(nhân viên, Cost Center)* của cùng một nhân viên không chồng lấn — **nhiều nhất một** Cost Center tại mỗi thời điểm | OQ-02, ADR-04 | **CSDL** — ràng buộc loại trừ theo khoảng thời gian; suy ra từ `INV-20` |
| **INV-14b** | Mỗi nhân viên **luôn có** một Cost Center đang hiệu lực; trường này **không được rỗng** (`QĐ-30c`) | OQ-02, `QĐ-30c` | **CSDL** — `NOT NULL`; suy ra từ `INV-20` và Cost Center 1–1 của phòng |
| **INV-15** | Mọi bảng gốc nghiệp vụ mang cột định danh tổ chức, và cột này đứng đầu mọi ràng buộc duy nhất | ADR-01 | CSDL — quy ước lược đồ |
| **INV-16** | Mỗi khoản cam kết ngân sách gắn với **đúng một** Request đã được Người duyệt chi duyệt; một Request có tối đa một khoản cam kết | FR-5.8, FR-3.13 | CSDL — khóa ngoại bắt buộc + chỉ mục duy nhất |
| **INV-17** | Không có bản ghi sử dụng nào từ thiết bị **chưa đăng ký** hoặc của nhân viên **chưa xác nhận chủ động** tại thời điểm ghi nhận | FR-4.18, FR-4.21, ADR-13 | Ứng dụng — chặn ở endpoint nhận dữ liệu, có test phủ định |
| **INV-18** | Khoản cam kết ngân sách **được phép chưa gắn** `Budget` khi tại lúc duyệt chi chưa có ngân sách của Cost Center và kỳ đó; khoản đó **bắt buộc** mang lý do *Chưa có ngân sách* và nằm trong hàng đợi ghi nhận của Finance. Khi `Budget` của **đúng Cost Center và kỳ đó** được lập, hệ thống **gắn** mọi khoản cam kết chưa có ngân sách thuộc kỳ đó vào ngân sách vừa lập | FR-3.14, FR-5.8, `QĐ-30b` | Ứng dụng — cổng tạo khoản cam kết và tác vụ gắn ngược khi tạo `Budget`; có test phủ định |
| **INV-19** | Mỗi phòng ban có **nhiều nhất một** trưởng phòng có hiệu lực tại mỗi thời điểm, **và** mỗi người làm trưởng **nhiều nhất một** phòng tại mỗi thời điểm; khoảng hiệu lực không chồng lấn (`QĐ-52a`, `QĐ-58a`); trưởng phòng phải là **thành viên** của phòng đó suốt giai đoạn làm trưởng phòng (`QĐ-66a`) | `FR-3.1`, ADR-04 | **CSDL** — ràng buộc loại trừ theo khoảng thời gian ở cả hai chiều |
| **INV-20** | Mỗi nhân viên **luôn thuộc đúng một** phòng ban có hiệu lực — không chồng lấn, không rỗng (`QĐ-52a`) | `FR-2.2`, ADR-04 | **CSDL** — ràng buộc loại trừ theo khoảng + `NOT NULL` |

> **Ba bất biến quan trọng nhất khi bảo vệ:** `INV-02` (chống chồng lấn) và `INV-05` (nhật ký chỉ ghi thêm) là hai chỗ thể hiện rõ nhất nguyên tắc *đặt ràng buộc ở tầng cơ sở dữ liệu*; `INV-12` là thứ giữ cho tiêu chí nghiệm thu `TC-2` — không báo động giả — có thể đạt được.
>
> Mỗi dòng đều dẫn được về một mã `FR`, `ADR`, `OQ` hoặc một mục còn tồn tại trong tài liệu này.

#### 5.12.3. Chín vòng đời có máy trạng thái

Chín thực thể dưới đây có vòng đời riêng và phải được đặc tả bằng máy trạng thái hữu hạn: tập trạng thái, tập chuyển trạng thái hợp lệ, điều kiện canh và hiệu ứng kèm theo.

| Thực thể | Vòng đời mô tả điều gì | Ràng buộc chính |
| -------- | ---------------------- | --------------- |
| **Request** | Từ lúc nhân viên gửi yêu cầu tới lúc hoàn tất, bị từ chối (gồm IT từ chối ở cổng mức kiểm soát — `FR-3.19`), bị hủy, **đóng vì là phần mềm miễn phí bên ngoài** (`QĐ-49h`) hoặc **thất bại** khi IT Admin đóng tác vụ cấp phát là thất bại (`QĐ-62i`, `FR-2.5`); có trạng thái chờ **duyệt chi** ở nhánh (b), (c) của `FR-3.4` | Không tự duyệt khi quá hạn (FR-3.8); cho phép rút tới khi tác vụ cấp phát còn chờ thực thi (`OI-06`) |
| **BudgetCommitment** | Khoản cam kết ngân sách: **đang giữ** → **đã thành chi phí**, hoặc → **đã giải phóng**. Ghi nhận của Finance là hành động trên khoản *đang giữ*, không phải trạng thái chặn. **Việc gắn ngân sách là thuộc tính, không phải trạng thái**: khoản cam kết có thể ở *đang giữ* mà **chưa gắn** `Budget`, rồi được gắn khi ngân sách ra đời (`QĐ-30b`) | Chỉ sinh khi Người duyệt chi duyệt Request có chi phí; gắn đúng một Request (`INV-16`); **được phép chưa gắn `Budget`** kèm lý do *Chưa có ngân sách*, gắn ngược khi ngân sách được lập (`INV-18`, `FR-5.8a`); không chuyển ngược từ *đã thành chi phí* |
| **ApprovalStep** | Một mắt xích trong chuỗi duyệt của một Request | Có SLA riêng; approver dự phòng (FR-3.6); **không** ủy quyền (FR-3.5); người được giao chỉ đổi theo FR-3.15, FR-3.16 |
| **Assignment** | Ý định của tổ chức về việc một người được dùng một phần mềm | Có khoảng hiệu lực; không chồng lấn (`INV-02`) |
| **ProvisioningTask** | Thao tác tạo hoặc xóa tài khoản thật phía nhà cung cấp: *chờ thực thi → đang thực thi → **chờ chấp nhận** → hoàn tất*, hoặc *→ thất bại* | Tách khỏi Assignment (ADR-07); có số lần thử lại và lỗi gần nhất. **Trạng thái *chờ chấp nhận*** dùng cho ca nhà cung cấp mới chỉ tạo **lời mời `pending`**; **không** chuyển sang *hoàn tất* chỉ vì API trả thành công — phải đối soát, xem mục 6.3 |
| **GhostSeatRecommendation** | Vòng đời một khuyến nghị thu hồi: sinh ra → chờ xác nhận → được chấp nhận, bị bác bỏ, hoặc bị dữ liệu mới phủ định | Trạng thái *bị bác bỏ* và *bị phủ định* là đầu vào của KPI-5 |
| **Attestation** | Xác nhận của quản lý: Giữ lại / Thu hồi / Tạm miễn trừ | Miễn trừ bắt buộc có hạn (`INV-09`) |
| **Employee** | Trạng thái làm việc: đang làm → nghỉ dài → đang bàn giao → đã nghỉ việc | Chuyển sang *đã nghỉ việc* kích hoạt liệt kê quyền, thu hồi theo `FR-2.12` và tác vụ xóa dữ liệu (FR-10.6) |
| **DiscoveryFinding** | Bản ghi phát hiện ngoài danh mục: cần xem xét → đã duyệt / chưa duyệt / báo nhầm | Không được kết luận là vi phạm khi chưa xử lý (FR-6.6); có thể mở lại (FR-6.7) |

**Hai nguyên tắc bắt buộc khi đặc tả:**

1. **Không gộp hai tầng vòng đời.** Request có vòng đời riêng, và từng ApprovalStep bên trong nó cũng là một thực thể có vòng đời riêng. Gộp lại thì không mô tả được tình huống một bước quá SLA hoặc được xác định lại người duyệt (`FR-3.16`) trong khi cả Request vẫn đang chờ.
2. **Chuyển trạng thái không có trong bảng thì coi như không tồn tại.** Danh sách các chuyển trạng thái **không hợp lệ** phải được viết ra và dùng làm bộ kiểm thử phủ định — cùng loại với bộ test phủ định của tám nguyên tắc `SoD`.

### 5.13. Hồ sơ và biểu mẫu

Ở mỗi giai đoạn cần giấy tờ, tài liệu, biểu mẫu gì và nhân viên phải nộp gì (`QĐ-53b`). Biểu mẫu là **màn hình nhập liệu có trường bắt buộc** trong hệ thống, không phải tệp Word; tệp đính kèm lưu theo `FR-1.5`.

- **FR-11.1:** Hệ thống quản lý các loại hồ sơ dưới đây; mỗi loại có **trường bắt buộc**, **bước phát sinh**, **người nộp** và **người được xem** như bảng. Thiếu trường bắt buộc thì không chuyển được sang bước kế tiếp.
- **FR-11.2:** Mọi hồ sơ gắn với đúng một yêu cầu, Assignment, nhân viên, thiết bị hoặc khoản mua, có Audit Trail; **không** sửa sau khi bước dùng hồ sơ đó đã có quyết định — sửa sai bằng hồ sơ bổ sung có lý do.

| Mã | Hồ sơ | Ai nộp / hoàn thiện | Bước | Trường chính | Bắt buộc khi | Ai xem |
| --- | --- | --- | --- | --- | --- | --- |
| `BM-01` | **Phiếu yêu cầu cấp quyền** | Employee (trưởng phòng tạo thay hoặc gửi theo nhóm) | Gửi yêu cầu (`FR-3.2`) | Phần mềm/gói, lý do nghiệp vụ, thời hạn cần dùng, cá nhân hay dùng chung, danh sách người (yêu cầu theo nhóm), dự án liên quan (chỉ ngữ cảnh), lý do ngoài bộ chuẩn (`FR-3.18`) | Mọi yêu cầu cấp mới, đổi gói, gia hạn có thời hạn | Người yêu cầu, người duyệt, IT Admin |
| `BM-02` | **Đề xuất mua phần mềm mới + đánh giá của IT** | Employee khai nhu cầu; **IT Admin hoàn thiện** phần đánh giá | Nhánh (c) — bước IT đánh giá (`FR-3.19`) | Nhà cung cấp, gói định mua, mô hình giá, số người dùng, giá trước thuế, hồ sơ thuế, thuế ước tính và chi phí ước tính (`FR-5.13`); kiểu cấp, trang quản trị, xuất danh sách thành viên, SSO, chính sách chia sẻ và điều khoản (`FR-1.9`, `FR-1.10`), loại dữ liệu sẽ đưa vào, công cụ trùng chức năng đã có; **mức kiểm soát** và kết luận | Phần mềm trả phí/có bản quyền chưa có trong danh mục | Người yêu cầu, trưởng phòng, IT Admin, Người duyệt chi |
| `BM-03` | **Phiếu hoàn trả / thu hồi** | Employee hoặc trưởng phòng | Hoàn trả, thu hồi theo nhu cầu | Quyền cần trả, lý do, ngày | Mọi hoàn trả chủ động | Người liên quan, IT Admin |
| `BM-04` | **Biên bản bàn giao khi điều chuyển / nghỉ việc** | IT Admin lập; trưởng phòng xác nhận | `MF-7`, `MF-5` | Ngày hiệu lực/ngày làm việc cuối, danh sách quyền đang giữ, tài khoản dùng chung phải chuyển người chịu trách nhiệm, xác nhận bàn giao dữ liệu | Mọi điều chuyển phòng và nghỉ việc | Trưởng phòng cũ/mới, IT Admin |
| `BM-05` | **Chứng từ mua** — báo giá, hợp đồng, hóa đơn, chứng từ thuế nộp thay | IT Admin (báo giá, hợp đồng), Finance (hóa đơn, thuế) | Duyệt chi, mua, đối soát | Tệp gốc, số tiền, tiền tệ, dòng thuế (`FR-5.13`) | Mọi khoản chi | Theo `FR-1.5` |
| `BM-06` | **Xác nhận đã biết rõ chính sách theo dõi trên máy công ty** | Employee ký; IT Admin lưu bản ký | Bàn giao máy công ty (`FR-4.21`) | Thiết bị, phiên bản chính sách, bản ký, thời điểm xác nhận trong hệ thống — mẫu ở **Phụ lục D.2** | Trước khi nhận dữ liệu từ máy (`FR-4.18`, `INV-17`) | Chính nhân viên, IT Admin |
| `BM-07` | **Quyết định hợp thức hóa phần mềm ngoài danh mục** | IT Admin lập hồ sơ; **Người duyệt chi** quyết | `MF-6` (`FR-3.4c-1`) | Bằng chứng phát hiện (dòng sao kê/hóa đơn), ai dùng, ai trả, đánh giá kỹ thuật và mức kiểm soát, ý kiến Business Owner nếu trùng chức năng, quyết định *Báo nhầm / Không duyệt / Duyệt hợp thức hóa* (`FR-6.9`; *thay bằng công cụ có sẵn* là *Không duyệt* kèm chuyển người dùng — `QĐ-66ai`) kèm lý do, số seat khi hợp thức hóa, *lưu ý trước khi thu hồi* khi không duyệt, chứng từ khoản đã chi | Mọi finding được xử lý | IT Admin, Người duyệt chi, Finance |
| `BM-08` | **Checklist thu hồi khi nghỉ việc** | IT Admin; trưởng phòng xác nhận bước 1 | `MF-5` (`FR-2.12`) | (1) bàn giao dữ liệu theo *lưu ý trước khi thu hồi* · (2) gỡ khỏi workspace / hủy gia hạn / thu khóa · (3) khóa tài khoản công ty · (4) seat trống | Mọi nhân viên nghỉ việc | Trưởng phòng, IT Admin |

> **Quyết định hợp thức hóa là gì:** khi hệ thống phát hiện một phần mềm **đang được dùng hoặc trả tiền nhưng chưa có trong danh mục** (ví dụ sao kê có khoản trả Figma nhưng Figma chưa được duyệt), Người duyệt chi quyết một trong ba kết cục của `FR-6.9`: **Duyệt hợp thức hóa** (đưa vào danh mục, tạo thuê bao, cấp quyền cho người đang dùng — không duyệt chi lần hai), **Không duyệt** (hủy gói, thu hồi; biến thể *thay bằng công cụ đã có* thì chuyển người dùng sang công cụ có sẵn — `QĐ-66ai`), hoặc **Báo nhầm**. `BM-07` là hồ sơ của quyết định đó.

---

## 6. CÔNG NGHỆ ÁP DỤNG

### 6.1. Công nghệ nền và kiến trúc

| Thành phần | Lựa chọn |
| ---------- | -------- |
| Frontend | **React Router 8** Framework Mode chạy chế độ SPA (`ssr: false`) + **Vite** + TypeScript — xem **ADR-12** |
| Ứng dụng mobile | **Ứng dụng native** iOS/Android cho bốn tác vụ của `QĐ-61b`, dùng chung REST API, xác thực và phân quyền của backend; không push, không offline. Công nghệ chốt ở thiết kế kỹ thuật — **chưa có ADR**; khung `Code/Mobile` hiện chỉ là nền nghiên cứu |
| Backend | **NestJS** (Node.js / TypeScript); REST API, phân quyền theo vai trò ở tầng API — xem **ADR-11** |
| Cơ sở dữ liệu | PostgreSQL cho dữ liệu nghiệp vụ; ràng buộc toàn vẹn đặt ở tầng CSDL theo mục 5.12.2 |
| Hàng đợi & cache | Redis và background-job queue |
| Lưu tệp | MinIO/S3-compatible; không public trực tiếp, dùng signed URL |
| Tích hợp | CSV/Excel import là nền tảng; một connector demo có API thật |
| Quan sát hệ thống | Audit log, error log, trạng thái job, thời điểm đồng bộ cuối |

### 6.2. Kiến trúc thực thi cấp phát (Provisioning Port)

Hệ thống định nghĩa một giao diện trừu tượng cho việc cấp/thu hồi quyền với các thao tác: cấp quyền, thu hồi quyền, liệt kê người dùng, liệt kê license. Các bản triển khai:

- **Connector adapter** — gọi API của nhà cung cấp có hỗ trợ
- **Manual adapter** — sinh tác vụ cho IT Admin thực hiện tay và xác nhận hoàn tất

> **Ý nghĩa thiết kế:** "làm thủ công" trở thành một adapter bình thường thay vì một nhánh điều kiện rải khắp mã nguồn. Yêu cầu kèm theo: khóa chống gọi trùng, cơ chế thử lại có giãn cách, giới hạn tần suất, và job đối soát sai lệch. Kiểu cấp K1–K5 của gói (`FR-1.9`) quyết định adapter nào được dùng.

### 6.3. Chiến lược dữ liệu cho phân hệ Usage

**Nguyên tắc thiết kế rút ra:** ranh giới giữa SaaS-Sentry và thế giới bên ngoài đặt ở **định dạng dữ liệu**, không đặt ở **nhà cung cấp**. Hệ thống nhận một file có cấu trúc được mô tả bằng mẫu cấu hình; việc file đó do nhà cung cấp sinh ra hay do khách hàng tự chuẩn bị là chuyện của khách hàng. Đây cũng là cách các nền tảng SaaS management thương mại vận hành — không nền tảng nào có API tới toàn bộ ứng dụng SaaS trên thị trường.

Ma trận khả năng truy xuất dữ liệu usage của các nhà cung cấp, sáu kết luận rút ra, chiến lược chứng minh bốn lớp, ràng buộc connector GitHub và yêu cầu với dữ liệu mô phỏng nằm ở [tệp nghiên cứu tool & vendor](../Research-AI/tool-vendor-usage-research-backlog.md) — **bổ sung sau** ở giai đoạn Tools (`QĐ-59a`). Hai giới hạn nghiệp vụ rút từ đó vẫn áp ở BRD: dữ liệu hoạt động theo người thường chỉ có ở **gói cao nhất** (nên `G1`/`G2` phải chạy được chỉ với dữ liệu nội bộ — mục 5.4.1), và mỗi nhà cung cấp định nghĩa *hoạt động* một kiểu (nên `FR-4.16` bắt buộc khai báo).

### 6.4. Lớp AI hỗ trợ

**Phạm vi** (`QĐ-49e`, `QĐ-61e`): **hai tính năng AI là phạm vi cam kết của dự án** — **(1) Manager: tóm tắt các request đang chờ mình duyệt** (`MF-2`); **(2) Finance: diễn giải / bản nháp báo cáo chi phí từ số liệu backend đã tính** (`MF-8`) — cộng `US-15-01` (trợ lý phân loại Shadow IT của `MF-6`) **giữ nguyên ở trạng thái *chưa qua cổng chất lượng, đang ẩn***, không đưa vào phần trình bày. Hỏi đáp hợp đồng (RAG) là mở rộng, hoãn. Các tính năng AI khác trong `AI_FEATURES_PLAN.md` không thuộc MVP (tệp đó là đề xuất). Theo thứ tự ưu tiên thầy đưa ở Review 1, AI làm sau *công cụ và quản lý công cụ* và *luồng nghiệp vụ lõi*.

AI **chỉ hỗ trợ**: có nguồn (liên kết tới request hoặc số liệu báo cáo đã dùng); tôn trọng phạm vi vai (Manager chỉ hàng đợi của mình; Finance chỉ dữ liệu Finance được thấy); **không** tính tiền, **không** duyệt, **không** cấp/thu hồi quyền, **không** kết luận vi phạm; backend tính mọi con số; Finance xem và sửa bản nháp. Dữ liệu đưa vào AI giới hạn trong phạm vi quyền của chính người đang dùng; AI không mở rộng quyền xem. Quy trình nghiệp vụ chạy đầy đủ khi AI tắt hoặc lỗi. Hai tính năng mới **chưa hiện thực và chưa kiểm chứng model**; điều kiện dữ liệu gửi tới nhà cung cấp model cho hai tính năng này **chưa được đánh giá** (`OQ-26`, mục 10.1) — tới khi có điều kiện, **không** gửi dữ liệu thật hoặc dữ liệu cá nhân tới model bên ngoài hệ thống, chỉ dùng dữ liệu giả lập (`QĐ-61f`). *Thuộc phạm vi* không có nghĩa mọi giao dịch phải gọi AI: người dùng có thể không dùng gợi ý, và AI không có trên ứng dụng mobile trừ khi quyết định riêng.

**Cổng chất lượng của `US-15-01`** (`QĐ-32a`, `QĐ-32b`, `QĐ-37b`): gợi ý nhà cung cấp chỉ cho các mục review mà rule không có ứng viên duy nhất, và **chỉ hiện** cho IT Admin khi cấu hình model (model + prompt + rule + từ điển) đã chạy trên tập giữ lại đóng băng và đạt ngưỡng: khớp sai ≤ 1, injection thành công = 0, đúng ≥ 70 % ca trả lời được, không khớp sai ≥ 95 % ca không-khớp; chưa đạt thì chạy ẩn để đo. Với cấu hình định triển khai hiện tại (`hardened-v5.1`), *tập giữ lại* là **hai** tập: PASS trên `heldout-v4` **và** PASS trên `heldout-v5`. Ngày 02/10/2026 **chưa** cấu hình nào đạt ⟹ gợi ý **ẩn**, hàng đợi review thủ công chạy độc lập với AI. Dữ liệu gửi tới nhà cung cấp chỉ gồm mô tả giao dịch đã che thông tin cá nhân và từ điển nhà cung cấp; free tier (điều khoản cấm dữ liệu nhạy cảm/bí mật/cá nhân) chỉ nhận dữ liệu **tổng hợp** (`QĐ-34d`). Không dùng đăng nhập subscription làm backend.

**Nguyên tắc xuyên suốt:** backend tính toán ra số và ra kết luận; AI chỉ diễn giải và hỗ trợ tra cứu. AI **không** tự phê duyệt chi phí, **không** tự cấp/thu hồi seat, **không** tự chặn ứng dụng, **không** tự đóng cảnh báo.

| Vai trò | Tính năng AI | Mô tả | Ràng buộc | Trạng thái |
| --- | --- | --- | --- | --- |
| **Manager** | **Tóm tắt các request đang chờ mình duyệt** (`MF-2`) | Gom các request đang chờ bước duyệt của chính Manager thành bản tóm tắt ngắn; mỗi dòng dẫn liên kết tới request nguồn | Chỉ hàng đợi của **chính Manager**, không raw activity log (`SoD-2`); AI **không** duyệt, từ chối hay bỏ qua bước — Manager vẫn quyết; AI tắt/lỗi thì hàng đợi chạy như cũ | Chưa hiện thực, chưa kiểm chứng model |
| **Finance** | **Diễn giải / bản nháp báo cáo chi phí** (`MF-8`) | Chuyển số liệu báo cáo kỳ do backend đã tính thành đoạn diễn giải hoặc bản nháp báo cáo | Backend tính mọi con số; AI **không** tính tiền, **không** kết luận vi phạm; mỗi con số truy được về số liệu báo cáo đã dùng; chỉ dữ liệu Finance được thấy; Finance xem và **sửa** trước khi dùng; AI tắt/lỗi thì viết tay hoặc phát hành báo cáo như cũ | Chưa hiện thực, chưa kiểm chứng model |
| **IT Admin** | Trợ lý phân loại Shadow IT (`US-15-01`) | Gợi ý nhà cung cấp cho các mô tả giao dịch mà từ điển và mẫu nhận dạng không xử lý được | Chỉ chạy cho trường hợp không khớp được bằng rule; kết quả luôn ở mức tin cậy thấp và **bắt buộc** IT Admin xác nhận | **Chưa qua cổng chất lượng, đang ẩn** (`QĐ-37`); **không** đưa vào phần trình bày |
| **Finance** | Trợ lý tra cứu hợp đồng | Hỏi đáp trên tệp hợp đồng được cấp quyền theo cơ chế truy hồi (RAG): ngày hết hạn, điều kiện hủy, đơn giá | **Bắt buộc** trích dẫn đoạn nguồn trong tài liệu; không đưa ra quyết định tài chính | **Mở rộng — hoãn** |

**Về con số độ tin cậy:** mức tin cậy hiển thị cho người dùng được tính từ **phương pháp khớp** (theo FR-6.5), không lấy con số do mô hình ngôn ngữ tự báo cáo, vì mô hình ngôn ngữ không hiệu chỉnh xác suất đáng tin cậy.

**Vì sao không dùng học máy cho phát hiện Ghost Seat:** bài toán có nhãn xác định (dùng hoặc không dùng), quyết định cuối cùng vẫn do con người, và điều người dùng cần nhất là hiểu được lý do. Ngoài ra không có tập dữ liệu huấn luyện có nhãn. Rule-based có thể giải thích là lựa chọn đúng về mặt kỹ thuật ở đây.

**Điều kiện triển khai:** lớp AI chỉ được triển khai sau khi các phân hệ lõi hoàn tất. Hệ thống phải vận hành đầy đủ khi lớp AI bị tắt.

---

## 7. YÊU CẦU PHI CHỨC NĂNG VÀ BẢO MẬT

### 7.1. Hiệu năng
- Tải trang ≤ 3 giây; tìm kiếm ≤ 2 giây
- Hỗ trợ ≥ 100 người dùng đồng thời trong phạm vi dữ liệu demo/MVP

### 7.2. Xác thực và phân quyền
- **Xác thực nội bộ do backend quản lý** (email + mật khẩu; tài khoản kích hoạt qua lời mời dùng một lần; mật khẩu chỉ lưu dạng băm; phiên/token nội bộ), phân quyền theo vai trò — xem `FR-8.6`, `FR-8.11` (`QĐ-46`). Cơ chế phiên, token và chính sách mật khẩu cụ thể là thiết kế kỹ thuật theo BE ADR-0010 (`QĐ-47`)
- Có thể mở rộng xác thực đa yếu tố ở giai đoạn sau; chưa có quyết định về MFA
- Phân quyền kiểm soát ở tầng API, không chỉ ẩn ở giao diện — hiện thực bằng cơ chế guard của NestJS (ADR-11). Phạm vi dữ liệu của Manager là **phòng mình**; của IT Admin theo vai, tác vụ ưu tiên theo phòng phụ trách (`FR-3.17`)
- **Bộ thu thập trên thiết bị** xác thực bằng **credential thiết bị** — cơ chế riêng, chỉ cho các đường nhận dữ liệu thiết bị/OTLP, **không** thay thế và **không** lùi về đăng nhập người dùng khi thất bại (`QĐ-32c`). Tổ chức, thiết bị và nhân viên xác định từ credential và binding tại thời điểm sự kiện, không từ dữ liệu client gửi; credential chỉ lưu dạng băm, có hạn dùng, xoay vòng và thu hồi tức thời

### 7.3. Bảo vệ dữ liệu
- Mã hóa khi truyền
- Kiểm soát truy cập tệp hợp đồng và hồ sơ qua signed URL có thời hạn
- **Khóa bản quyền lưu mã hóa**, hiển thị che bớt, mỗi lần xem đầy đủ ghi Audit Trail (`FR-2.10`)
- **Không lưu mật khẩu** của tài khoản dùng chung (`FR-2.11`)
- Quản lý secret tách khỏi mã nguồn
- Kiểm tra và xác thực file import
- Audit Trail chỉ ghi thêm cho mọi thay đổi

### 7.4. Toàn vẹn dữ liệu
- Số Assignment đang chiếm chỗ không vượt quá số seat đã mua; xử lý tranh chấp khi hai người thao tác đồng thời
- Các khoảng hiệu lực của cùng cặp (nhân viên, thuê bao) không chồng lấn
- Mỗi nhân viên thuộc đúng một phòng; mỗi phòng một trưởng phòng; mỗi người làm trưởng tối đa một phòng
- Tổng tỷ lệ phân bổ chi phí bằng 100%
- Mọi trường tiền có loại tiền tệ và giá trị quy đổi

*Danh sách đầy đủ các bất biến và nơi đặt ràng buộc: xem mục 5.12.2.*

### 7.5. Quyền riêng tư và chính sách lưu giữ

- Chỉ thu thập trường dữ liệu tối thiểu cần cho mục đích quản trị license
- Giới hạn quyền xem theo vai trò và phạm vi quản lý
- Manager chỉ thấy dữ liệu tổng hợp của nhân viên **trong phòng mình**, không xem raw activity log (SoD-2)
- Màn hình usage và discovery hiển thị mã nhân viên và email công việc, ẩn họ tên (OQ-03)
- **Không** lưu địa chỉ IP của thiết bị; **không** đăng ký hay thu dữ liệu từ máy cá nhân (`FR-4.21`)

**Chính sách lưu giữ** (`OQ-08`):

| Loại dữ liệu | Thời hạn lưu giữ | Căn cứ |
| ------------ | ---------------- | ------ |
| Bản ghi hoạt động chi tiết theo ngày — **mọi ứng dụng** | **6 tháng**, hoặc **30 ngày sau ngày làm việc cuối** của nhân viên — cái nào đến trước | `QĐ-01`. Vẫn phủ ngưỡng phát hiện dài nhất **90 ngày** (`FR-4.12`) với dư biên gấp đôi; **so sánh theo kỳ và dự báo dùng bảng tổng hợp đã phi định danh giữ 24 tháng** ở dòng dưới, không dùng bản ghi chi tiết. ⚠️ *Đây là **quyết định lưu giữ của dự án** theo nguyên tắc thận trọng, **không phải** một kết luận rằng mốc này đáp ứng đủ nghĩa vụ pháp lý — xem mục 7.7.7* |
| **Bản ghi từ bộ thu thập trên thiết bị** và **bản ghi xác nhận** | Bản ghi sử dụng: **6 tháng**, hoặc 30 ngày sau ngày làm việc cuối — cái nào đến trước. Bản ghi xác nhận (kể cả bản ký `BM-06`): giữ **cùng thời hạn với dữ liệu mà nó làm căn cứ**, rồi xóa cùng lúc | Dữ liệu được coi là **nhạy cảm** (mục 7.7.6); xóa khi chấm dứt hợp đồng theo **Điều 25 khoản 2 điểm c Luật 91/2025/QH15, đã đọc nguyên văn** |
| Bản ghi hoạt động của **ứng dụng nhóm dịch vụ liên lạc** (FR-1.8) | **6 tháng**, hoặc 30 ngày sau ngày làm việc cuối — cái nào đến trước | Nguyên tắc thận trọng theo ADR-10. **Chỉ phát sinh khi doanh nghiệp chủ động bật thu thập cho nhóm này** — ở chế độ mặc định của `ADR-10`, hệ thống không tạo ra loại dữ liệu này |
| Dữ liệu tổng hợp **đã phi định danh** theo ứng dụng và đơn vị | 24 tháng | Không còn là dữ liệu cá nhân; phục vụ so sánh theo kỳ và dự báo |
| Nhật ký kiểm toán | Theo yêu cầu của pháp luật kế toán, kiểm toán và nội quy doanh nghiệp | Chỉ ghi thêm; **không** xóa theo chính sách này |
| Bằng chứng discovery từ sao kê, hóa đơn | 24 tháng | Chủ yếu là dữ liệu giao dịch doanh nghiệp |

**Lý do của quy tắc "30 ngày sau ngày làm việc cuối":** **Điều 25 khoản 2 điểm c** Luật 91/2025/QH15 (đã đọc nguyên văn tại PDF Công báo số 971 + 972 ngày 24/07/2025): *"Phải xóa, hủy dữ liệu cá nhân của người lao động khi chấm dứt hợp đồng, trừ trường hợp theo thỏa thuận hoặc pháp luật có quy định khác."* Nhóm **chọn** thiết kế hệ thống theo hướng thận trọng đó: không mặc định giữ dữ liệu hành vi của người đã nghỉ tới hết kỳ lưu giữ chung. Luật **không** quy định con số *30 ngày* — đó là **quyết định thiết kế** của dự án về thời gian thực hiện việc xóa.

> ⚠️ **Mức độ kiểm chứng — hai vế khác nhau, không được gộp** (`SA-08`):
>
> 1. **Đã kiểm chứng nguyên văn điều khoản.** Diễn giải ở đoạn trên **khớp** nguyên văn Điều 25 khoản 2 điểm c.
> 2. **Chưa có kết luận về mức đủ pháp lý — còn mở.** Việc mốc **30 ngày**, cơ chế **xác nhận** và chính sách lưu giữ hiện tại có **đáp ứng đủ** nghĩa vụ luật định hay không là một **kết luận pháp lý**, cần ý kiến chuyên môn — xem `OQ-16`, `OQ-23` và mục 7.7.7.
>
> ⟹ Báo cáo cuối được phép nói *"đã đối chiếu nguyên văn Điều 25 khoản 2 điểm c"*, nhưng **không** được nói *"hệ thống đã tuân thủ"* khi chưa có ý kiến pháp lý.

- **FR-10.6:** Khi một nhân viên chuyển sang trạng thái đã nghỉ việc, hệ thống tự động xóa bản ghi hoạt động chi tiết của người đó trong vòng 30 ngày kể từ ngày làm việc cuối, đồng thời **giữ lại** dữ liệu tổng hợp đã phi định danh và nhật ký kiểm toán. Tác vụ xóa ghi nhận số bản ghi đã xóa và thời điểm thực hiện.

> **Cần lưu ý khi triển khai thật:** nếu doanh nghiệp muốn giữ dữ liệu lâu hơn mốc trên — ví dụ để phục vụ tranh chấp lao động hoặc kiểm toán — thì phải có **thỏa thuận** trong hợp đồng lao động hoặc chính sách nội bộ đã thông báo, không thể chỉ đặt cấu hình trong hệ thống.

Chi tiết về khung pháp lý, cơ sở xử lý và đối chiếu nghĩa vụ với thiết kế: xem **mục 7.7**.

### 7.6. Phân tách trách nhiệm
Theo bảng SoD-1 đến SoD-8 tại mục 4.2. Bộ kiểm thử phủ định cho tám nguyên tắc này chạy ở tầng guard của API (ADR-11).

### 7.7. Tuân thủ pháp luật bảo vệ dữ liệu cá nhân

#### 7.7.1. Khung pháp lý áp dụng

| Văn bản | Tình trạng | Vai trò với dự án |
| ------- | ---------- | ----------------- |
| **Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15** | Hiệu lực từ **01/01/2026** | Văn bản gốc điều chỉnh |
| **Nghị định 356/2025/NĐ-CP** | Hiệu lực từ **01/01/2026** | Hướng dẫn thi hành, quy định chi tiết |
| Nghị định 13/2023/NĐ-CP | **Hết hiệu lực từ 01/01/2026** | **Không** viện dẫn |

**Văn bản hỗ trợ** được viện dẫn cho bộ thu thập trên thiết bị: Bộ luật Lao động 2019 Điều 118 *(nội quy lao động)*, Bộ luật Dân sự 2015 Điều 38 *(bí mật đời tư, thư tín, cơ sở dữ liệu điện tử)*. Hai văn bản này mới được đọc qua trang đăng lại, **chưa đọc tại Công báo** — không dùng làm căn cứ chính.

**Đã đọc nguyên văn** *(ngày 14/09/2026)*: Luật 91/2025/QH15 các Điều **3, 7, 8, 9, 11, 19, 21, 25, 32, 38** trên [PDF Công báo số 971 + 972](https://congbaocdn.chinhphu.vn/CongBaoCP/VanBan/2025/6/45578/57730-1-2025971-97291-2025-qh15.pdf). Bản PDF ký số của Nghị định 356/2025 là **ảnh quét**, không trích được chữ; chỉ điểm `l)` khoản 1 Điều 4 đã đọc bằng mắt.

**Nguồn tra cứu** *(nhóm cần đọc trực tiếp văn bản gốc)*:
[Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 — cổng văn bản Chính phủ](https://vanban.chinhphu.vn/?classid=1&docid=214590&pageid=27160&typegroupid=3) ·
[Nghị định 356/2025/NĐ-CP — cổng văn bản Chính phủ](https://vanban.chinhphu.vn/?classid=0&docid=216387&pageid=27160) ·
[Luật Viễn thông số 24/2023/QH15 — cổng văn bản Chính phủ](https://vanban.chinhphu.vn/?docid=209631&pageid=27160)

> **Quy tắc nguồn của nhóm:** văn bản pháp luật dẫn về **Công báo, cổng văn bản Chính phủ hoặc cổng Quốc hội**. Các trang tra cứu luật tư nhân chỉ là nguồn hỗ trợ để đọc nhanh, không dùng làm căn cứ trong báo cáo.

#### 7.7.2. Phân loại dữ liệu hệ thống xử lý theo mức rủi ro

Việc phân loại này quyết định phần nào của hệ thống cần biện pháp chặt hơn. Phần lớn hệ thống xử lý dữ liệu doanh nghiệp, không phải dữ liệu cá nhân.

| Nhóm dữ liệu | Là dữ liệu cá nhân? | Mức rủi ro | Phân hệ liên quan |
| ------------ | ------------------- | ---------- | ----------------- |
| Hợp đồng, hóa đơn, thuê bao, chi phí, thuế | Không — dữ liệu doanh nghiệp | Không nằm trong phạm vi điều chỉnh | 5.1, 5.5 |
| Mã nhân viên, họ tên, email công việc, phòng ban, chức vụ | Có — dữ liệu cơ bản | Thấp | 5.2, 5.3 |
| Ai được cấp seat phần mềm nào, từ khi nào | Có — dữ liệu cơ bản | Thấp | 5.2 |
| **Ngày hoạt động cuối, số ngày không sử dụng** | Có — **dữ liệu hành vi** | **Trung bình — trục rủi ro chính** | 5.4 |
| Bản ghi OAuth consent — ai cấp quyền cho ứng dụng nào | Có — dữ liệu hành vi | Trung bình | 5.6 |
| Sao kê, mô tả giao dịch | Chủ yếu doanh nghiệp | Thấp | 5.6 |
| **Dữ liệu từ bộ thu thập trên thiết bị** — tên miền/tiến trình trong danh sách cho phép, số phút theo ngày | Có — **dữ liệu theo dõi hành vi sử dụng dịch vụ trên không gian mạng** | **Cao — coi là nhạy cảm**; chỉ xử lý khi thỏa điều kiện của `ADR-13` | 5.4, 5.6 |
| Sổ thiết bị, bản ký và bản ghi xác nhận của nhân viên | Có — dữ liệu cơ bản | Thấp — bản thân là cơ chế minh bạch | 5.4 |
| Log truy cập web, proxy, CASB | Có — **có khả năng thuộc nhóm nhạy cảm** | **Cao — loại khỏi phạm vi** | — |
| Nhật ký kiểm toán | Có — dữ liệu cơ bản | Thấp — bản thân là cơ chế tuân thủ | 5.8 |

> **Điểm cần nêu khi bảo vệ:** rủi ro pháp lý của đề tài **tập trung vào đúng hai phân hệ** (5.4 Usage và 5.6 Discovery), không rải đều toàn hệ thống. Log web đầy đủ — rủi ro cao nhất — đã được chủ động loại khỏi phạm vi (mục 5.6.1). Dữ liệu từ bộ thu thập cũng ở mức **cao** và **có** trong phạm vi — nhưng chỉ dưới mười điều kiện của `ADR-13`. Cách nói đúng: *"Nhóm có xử lý một loại dữ liệu nhạy cảm, và thiết kế để máy chủ không bao giờ nhận phần vượt mục đích."*

**Ma trận phân loại theo từng trường dữ liệu cá nhân** (`ND-2`, `QĐ-60e`). *Bản nháp do trợ lý soạn ngày 08/10/2026 theo các căn cứ đã đọc nguyên văn (Luật 91/2025 Điều 3, 9, 11, 19, 21, 25, 38; Nghị định 356/2025 Điều 4 khoản 1 điểm l); chờ nhóm review. Cột cơ sở xử lý là **đề xuất cho doanh nghiệp triển khai**, không phải kết luận pháp lý.* Dòng của bộ thu thập ghi theo *danh sách cho phép*; chi tiết trường chốt ở giai đoạn Tools (`QĐ-59a`).

| # | Trường dữ liệu | Loại theo luật | Mức rủi ro | Cơ sở xử lý đề xuất | Thời hạn lưu | Ai được xem | Yêu cầu |
| - | -------------- | -------------- | ---------- | ------------------- | ------------ | ----------- | ------- |
| 1 | Mã nhân viên, họ tên, email công việc | Cơ bản | Thấp | Thực hiện quan hệ lao động và quản lý tài sản công nghệ thông tin; nêu trong nội quy | Khi đang làm việc; sau nghỉ việc chỉ giữ phần cần để truy vết chứng từ chi phí và Audit Trail — doanh nghiệp ghi rõ trong nội quy/thỏa thuận (Điều 25 khoản 2 điểm c) | Super Admin, IT Admin, Finance (bản đọc), trưởng phòng (phòng mình); màn usage và discovery ẩn họ tên | `FR-2.1`, `QĐ-41c`, `OQ-03` |
| 2 | Phòng ban, chức vụ, trưởng phòng, Cost Center — có hiệu lực theo thời gian | Cơ bản | Thấp | Như dòng 1 | Như dòng 1; lịch sử hiệu lực giữ cùng chứng từ chi phí | Như dòng 1 | `FR-3.17`, `ADR-04` |
| 3 | Tài khoản đăng nhập: email đăng nhập, mật khẩu đã băm, phiên, lời mời | Cơ bản | Trung bình — rủi ro bảo mật | Cần để vận hành hệ thống | Theo vòng đời tài khoản; khóa khi nghỉ việc | Chủ tài khoản; Super Admin chỉ thấy trạng thái, **không** ai thấy mật khẩu | `FR-8.6`, `FR-8.11` |
| 4 | Ai giữ seat/khóa bản quyền nào, từ khi nào; tài khoản ở nhà cung cấp | Cơ bản | Thấp | Quản lý tài sản phần mềm | Giữ cùng chứng từ chi phí liên quan | IT Admin, Finance, trưởng phòng (phòng mình), chính nhân viên | `FR-2.x`, `QĐ-43c` |
| 5 | Yêu cầu, lý do, bước duyệt, người quyết | Cơ bản | Thấp | Thực hiện quy trình nội bộ | Giữ cùng Audit Trail | Người yêu cầu, người duyệt các bước, IT Admin | `FR-3.x`, `QĐ-53a` |
| 6 | Ngày hoạt động cuối, bản ghi hoạt động theo ngày từ nhà cung cấp | Hành vi | Trung bình — trục rủi ro chính | Doanh nghiệp xác định cơ sở phù hợp **và** thông báo trước khi xử lý (`FR-10.4`, mẫu Phụ lục D.1) | **6 tháng**, hoặc 30 ngày sau ngày làm việc cuối — mốc đến trước; tổng hợp phi định danh 24 tháng | IT Admin (ẩn họ tên); trưởng phòng chỉ thấy có/không hoạt động; chính nhân viên | `FR-10.6`, `QĐ-01`, `SoD-2` |
| 7 | Dữ liệu từ bộ thu thập trên thiết bị: tên miền/ứng dụng **trong danh sách cho phép**, số phút theo ngày, bao phủ theo ngày | **Nhạy cảm** — theo dõi hành vi sử dụng dịch vụ trên không gian mạng (Nghị định 356/2025 Điều 4 khoản 1 điểm l) | **Cao** | Điều 25 khoản 3 Luật 91/2025 (*người lao động biết rõ*) + văn bản `BM-06` (Phụ lục D.2) + xác nhận chủ động trong hệ thống. Có đủ thay sự đồng ý theo Điều 11 hay không: **hoãn có điều kiện** (`OQ-16`, `OQ-23`). Doanh nghiệp lập hồ sơ đánh giá tác động trong 60 ngày (Điều 21, Điều 38 khoản 2) | Như dòng 6 | Chính nhân viên, IT Admin; trưởng phòng chỉ thấy có/không hoạt động; không bảng xếp hạng thời gian dùng | `FR-4.18`, `INV-17`, `ADR-13`, `ĐK-01` → `ĐK-10` |
| 8 | Sổ thiết bị: mã tài sản, hệ điều hành, tên máy, người giữ | Cơ bản | Thấp | Quản lý tài sản của doanh nghiệp | Theo khoảng hiệu lực; hết hiệu lực khi nghỉ việc | IT Admin, chính nhân viên | `FR-4.21` |
| 9 | Bản ký `BM-06`, bản ghi xác nhận (phiên bản thông báo, thời điểm), yêu cầu dừng | Cơ bản | Thấp — là cơ chế minh bạch | Bằng chứng *biết rõ* (Điều 25 khoản 3) | Cùng thời hạn với dữ liệu mà nó làm căn cứ, rồi xóa cùng lúc | Chính nhân viên, IT Admin | `FR-4.18`, `FR-4.21`, `FR-10.5` |
| 10 | Yêu cầu quyền chủ thể dữ liệu: xem, xuất, sửa, dừng | Cơ bản | Thấp | Nghĩa vụ theo luật | Giữ cùng Audit Trail để chứng minh đã đáp ứng đúng hạn | Chính nhân viên, IT Admin | `FR-10.1` → `FR-10.7` |
| 11 | Mô tả giao dịch trên sao kê/hóa đơn (có thể chứa tên người mua) | Chủ yếu dữ liệu doanh nghiệp | Thấp | Đối soát chi phí | 24 tháng | Finance, IT Admin, Người duyệt chi (hồ sơ đang quyết) | `FR-6.x`, `QĐ-33b` |
| 12 | Audit Trail (ai làm gì, khi nào) | Cơ bản | Thấp — là cơ chế tuân thủ | Nghĩa vụ kiểm soát nội bộ, pháp luật kế toán | Theo pháp luật kế toán và nội quy; **không** xóa theo chính sách lưu giữ | Chỉ Super Admin tra cứu | `FR-8.3`, `INV-05`, `OI-08c` |
| 13 | Dữ liệu hoạt động của ứng dụng liên lạc (nhắn tin, họp) | Có khả năng nhạy cảm | Cao | — | **Không thu** ở chế độ mặc định | — | `ADR-10`, `FR-1.8` |
| 14 | Địa chỉ IP, URL đầy đủ, tiêu đề, nội dung, phím bấm, ảnh màn hình, vị trí; dữ liệu từ máy cá nhân | — | — | — | **Không bao giờ thu** | — | `ĐK-05`, `FR-4.21` |

> Doanh nghiệp triển khai vẫn chịu các nghĩa vụ ngoài phần mềm ở mục 7.7.5 — nội quy lao động, hồ sơ đánh giá tác động, chỉ định người phụ trách bảo vệ dữ liệu. Ma trận này là đầu vào cho các hồ sơ đó, **không** thay thế chúng.

#### 7.7.3. Cơ sở pháp lý xử lý dữ liệu

| Nhóm dữ liệu | Cơ sở đề xuất |
| ------------ | ------------- |
| Dữ liệu nhân sự cơ bản | Thực hiện quan hệ lao động và quản lý tài sản công nghệ thông tin của doanh nghiệp |
| Phân bổ và thu hồi license | Như trên |
| **Dữ liệu hành vi sử dụng** | Doanh nghiệp triển khai xác định cơ sở phù hợp, **kèm nghĩa vụ thông báo minh bạch trước khi xử lý** (FR-10.4) |
| **Dữ liệu từ bộ thu thập trên thiết bị** | **Điều 25 khoản 3 Luật 91/2025/QH15** — biện pháp công nghệ quản lý người lao động, *"trên cơ sở người lao động biết rõ biện pháp đó"* — **cộng văn bản xác nhận đã biết rõ khi nhận máy và xác nhận chủ động kiểm chứng được** (Điều 9 khoản 3; `FR-4.21`). Thiết kế không dựa vào im lặng (Điều 9 khoản 4 điểm d). Việc xác nhận có đủ thay **sự đồng ý** theo Điều 11 khoản 1 hay không **chưa kết luận** — `OQ-16`, `OQ-23` |

> **Một lưu ý quan trọng:** Luật 91/2025 có sử dụng khái niệm "lợi ích hợp pháp", nhưng phạm vi của khái niệm này **hẹp hơn đáng kể** so với khái niệm tương ứng trong GDPR. Vì vậy không nên mặc định coi đây là cơ sở xử lý an toàn cho dữ liệu hành vi, và không nên sao chép lập luận từ tài liệu GDPR.

#### 7.7.4. Đối chiếu nguyên tắc bảo vệ dữ liệu với thiết kế đã có

| Nguyên tắc | Thiết kế trong BRD |
| ---------- | ------------------ |
| Tối thiểu hóa dữ liệu | FR-6.10, mục 7.5 — chỉ thu thập trường cần thiết; không lưu IP (`FR-4.21`) |
| Giới hạn mục đích | Mục 5.4 — dữ liệu usage chỉ dùng cho phát hiện lãng phí license |
| Giới hạn thời gian lưu trữ | Mục 7.5 — bảng chính sách lưu giữ |
| Giả danh hóa | OQ-03 — ẩn họ tên ở màn hình usage và discovery |
| Kiểm soát truy cập theo vai trò | SoD-1 → SoD-8, mục 7.2 |
| Trách nhiệm giải trình | FR-8.3, INV-05 — Audit Trail chỉ ghi thêm |
| Quyền truy cập của chủ thể | FR-10.1, FR-10.2 |
| Quyền được xóa | FR-10.3, FR-10.6 |
| Minh bạch với chủ thể dữ liệu | FR-10.4; văn bản xác nhận khi nhận máy, xác nhận chủ động và yêu cầu dừng thu thập — FR-4.18, FR-4.21 |
| Tối thiểu hóa tại nguồn | FR-4.17, ADR-13 — lọc trên máy theo danh sách cho phép; máy chủ từ chối trường ngoài lược đồ |
| Bảo mật khi truyền và lưu trữ | Mục 7.3 |

#### 7.7.5. Nghĩa vụ nằm ngoài phạm vi phần mềm

Những việc sau thuộc trách nhiệm của **doanh nghiệp triển khai**, không phải tính năng hệ thống:

| Nghĩa vụ | Ghi chú |
| -------- | ------- |
| Lập hồ sơ đánh giá tác động xử lý dữ liệu cá nhân (DPIA) | Nộp cơ quan chuyên trách trong **60 ngày** kể từ ngày đầu xử lý (**Điều 21** Luật 91/2025). Doanh nghiệp nhỏ và khởi nghiệp được chọn không lập trong 5 năm, **trừ** khi *"trực tiếp xử lý dữ liệu cá nhân nhạy cảm"* (**Điều 38 khoản 2**). Bật bộ thu thập nghĩa là xử lý dữ liệu nhạy cảm, nên **không được miễn**. Hồ sơ tổ chức mục tiêu 100–500 người (mục 3.4) vốn cũng vượt ngưỡng doanh nghiệp vừa trong lĩnh vực dịch vụ |
| **Đưa chính sách giám sát và chính sách thiết bị vào nội quy lao động; xử lý vi phạm** | Bộ luật Lao động 2019 Điều 118: doanh nghiệp từ 10 lao động phải có nội quy bằng văn bản, và phải tham khảo tổ chức đại diện người lao động trước khi ban hành hoặc sửa *(đọc qua trang đăng lại, chưa đọc tại Công báo)*. Văn bản nhân viên ký khi nhận máy (`FR-4.21`) do doanh nghiệp soạn; xử lý vi phạm *"chỉ dùng dịch vụ trên máy công ty"* là việc của doanh nghiệp |
| Chỉ định bộ phận hoặc nhân sự phụ trách bảo vệ dữ liệu cá nhân | Có yêu cầu về trình độ và kinh nghiệm |
| Thông báo cho người lao động về việc xử lý dữ liệu | Hệ thống hỗ trợ bằng FR-10.4 nhưng nội dung thông báo là trách nhiệm doanh nghiệp |
| Kê khai, nộp và khấu trừ thuế khi mua phần mềm | Hệ thống chỉ ghi nhận thuế theo chứng từ (`FR-5.13`) |
| Đánh giá tác động chuyển dữ liệu xuyên biên giới | Chỉ phát sinh nếu hệ thống được đặt tại hạ tầng nước ngoài. Với mô hình dedicated instance đặt trong nước thì không phát sinh |

#### 7.7.6. Dữ liệu hoạt động có thuộc nhóm nhạy cảm không

**Danh mục dữ liệu cá nhân nhạy cảm** quy định tại **Điều 4 Nghị định 356/2025/NĐ-CP**: **khoản 1** liệt kê **12 điểm, đánh chữ từ `a)` đến `m)`**. Điểm liên quan tới đề tài là **điểm `l)`**:

> *"Dữ liệu theo dõi hành vi, hoạt động sử dụng dịch vụ viễn thông, mạng xã hội, dịch vụ truyền thông trực tuyến **và các dịch vụ khác trên không gian mạng**;"*
>
> — nguyên văn khoản 1 điểm `l)` Điều 4, đọc trực tiếp tại bản PDF có chữ ký số của Chính phủ (`356-nd.signed.pdf`, ký ngày 05/01/2026, trang 3), ngày kiểm tra 08/09/2026.

Điểm `m)` là điều khoản quét: *"Dữ liệu cá nhân khác được pháp luật quy định cần giữ bí mật hoặc cần có biện pháp bảo mật chặt chẽ."*

Vế *"và các dịch vụ khác trên không gian mạng"* khiến điểm `l)` **không phải liệt kê đóng**: Figma, GitHub, Jira đều là dịch vụ trên không gian mạng.

**Phát biểu hiện hành — là phát biểu THIẾT KẾ, không phải kết luận pháp lý** (`QĐ-01`): BRD **không xác định** dữ liệu hoạt động của công cụ làm việc có thuộc nhóm dữ liệu cá nhân nhạy cảm hay không. Câu hỏi đó là `OQ-11`, **vẫn để ngỏ** và cần ý kiến pháp lý chuyên môn. Thay vào đó, hệ thống **coi toàn bộ dữ liệu hoạt động là *có thể* nhạy cảm và áp biện pháp bảo vệ cho mọi ứng dụng** — thông báo trước khi theo dõi (`FR-10.4`), thu thập tối thiểu, lưu giữ 6 tháng, giới hạn quyền xem theo `SoD-2` — **bất kể kết luận phân loại sau này ra sao**. Vẫn thu thập, nên `G3`, `G4` giữ nguyên. Đây là điều nhóm kiểm soát được; việc phân loại thì không.

**Dữ liệu từ bộ thu thập trên thiết bị** (`QĐ-20`): khác với *ngày hoạt động cuối* xuất từ nhà cung cấp, đây là dữ liệu mà **chính hệ thống tạo ra** bằng cách theo dõi việc dùng dịch vụ trực tuyến trên máy của người lao động. Đọc văn bản cho thấy nó **rơi thẳng vào điểm `l)`**. BRD **coi đây là dữ liệu nhạy cảm** và không chờ kết luận pháp lý — xử lý có điều kiện theo mục 7.7.7 và `ADR-13`.

**Nhóm ứng dụng liên lạc** (nhắn tin, họp trực tuyến, thư điện tử): **mặc định không thu thập** dữ liệu hoạt động (`ADR-10`) — chặt hơn mức áp cho ứng dụng thông thường. Câu hỏi phân loại (`OQ-12`) **không đóng được bằng đọc văn bản** nhưng **không còn cần trả lời để tiến hành**:

| Cụm trong Điều 4 | Căn cứ định nghĩa | Ứng dụng nhắn tin, họp trực tuyến có rơi vào không |
| ---------------- | ----------------- | -------------------------------------------------- |
| Dịch vụ viễn thông | Luật Viễn thông 2023 đưa **"dịch vụ viễn thông cơ bản trên Internet"** — nhắn tin, gọi điện, họp trực tuyến qua Internet — vào diện quản lý; phân loại chi tiết do Chính phủ quy định | ⚠️ **Đây là đường rủi ro chính** |
| Mạng xã hội | Có định nghĩa trong pháp luật về quản lý Internet; gắn với đặc trưng chia sẻ nội dung công khai và yêu cầu giấy phép | Khả năng thấp — công cụ nội bộ doanh nghiệp không mang đặc trưng này |
| Dịch vụ truyền thông trực tuyến | **Không tìm thấy định nghĩa minh thị**; bình luận hiểu theo hướng nền tảng nội dung số | Khả năng thấp |

Nếu về sau doanh nghiệp muốn bật thu thập cho nhóm liên lạc, khi đó mới cần ý kiến pháp lý chuyên môn — và đó là quyết định của doanh nghiệp triển khai, không phải của nhóm làm đồ án.

#### 7.7.7. Nghĩa vụ minh bạch khi giám sát người lao động

Pháp luật cho phép doanh nghiệp áp dụng biện pháp công nghệ để quản lý người lao động, nhưng **kèm điều kiện người lao động biết rõ biện pháp đó**, và cấm xử lý dữ liệu thu thập từ các biện pháp công nghệ trái quy định. **Luật 91/2025/QH15, Điều 25 khoản 3** (đọc nguyên văn tại PDF Công báo số 971 + 972 ngày 24/07/2025):

> *"3. Việc xử lý dữ liệu cá nhân của người lao động được thu thập bằng biện pháp công nghệ, kỹ thuật trong quản lý người lao động được quy định như sau:*
> *a) Chỉ được áp dụng các biện pháp công nghệ, kỹ thuật phù hợp với quy định của pháp luật và bảo đảm quyền, lợi ích của chủ thể dữ liệu cá nhân, trên cơ sở người lao động biết rõ biện pháp đó;*
> *b) Không được xử lý, sử dụng dữ liệu cá nhân thu thập từ các biện pháp công nghệ, kỹ thuật trái quy định của pháp luật."*

**Không tìm thấy** điều khoản cấm, cũng **không tìm thấy** ngoại lệ miễn nghĩa vụ vì thiết bị thuộc sở hữu công ty. Mức phạt tối đa với tổ chức cho vi phạm loại này là **03 tỷ đồng** (Điều 8 khoản 5).

Hệ quả cho hệ thống: **`FR-10.4` — thông báo cho nhân viên khi một ứng dụng bắt đầu được theo dõi mức độ sử dụng — là yêu cầu bắt buộc**, và **`FR-4.21` — văn bản xác nhận đã biết rõ khi nhận máy công ty** — là bằng chứng *biết rõ* kiểm chứng được. Cả hai là **biện pháp thiết kế** phục vụ minh bạch và thu thập tối thiểu, chọn theo nguyên tắc thận trọng của `ADR-10` và `QĐ-01`. **BRD không khẳng định** rằng có các biện pháp này thì việc thu thập là hợp pháp, cũng không khẳng định thiếu chúng thì là bất hợp pháp. Cơ sở pháp lý, các ngoại lệ và kết luận tuân thủ **vẫn là hạng mục cần rà soát pháp lý** — xem `OQ-11`, `OQ-16`, `OQ-23`.

Nội dung thông báo tối thiểu: ứng dụng nào đang được theo dõi, loại dữ liệu nào được thu thập (ngày hoạt động, số lượt — **không** thu thập nội dung), mục đích sử dụng (phát hiện license không dùng để cắt giảm chi phí), thời hạn lưu giữ, và cách nhân viên xem dữ liệu của chính mình (FR-10.1). Mẫu: **Phụ lục D.1**; văn bản ký khi nhận máy: **Phụ lục D.2** (`ND-3`).

**Mười điều kiện triển khai bộ thu thập trên thiết bị** (`QĐ-20` — áp cho cả tiện ích `FR-4.17` và agent `FR-4.19`):

| Mã | Điều kiện | Căn cứ | Hiện thực bằng |
| --- | --- | --- | --- |
| ĐK-01 | Chỉ thiết bị **do công ty cấp và quản lý**; không cài trên thiết bị cá nhân | Điều 3 khoản 2 | `FR-4.18` đăng ký thiết bị, `FR-4.21` |
| ĐK-02 | Người lao động **biết rõ trước khi thu** | Điều 25 khoản 3 điểm a; Điều 9 khoản 2 | `FR-10.4`, `FR-4.18`, văn bản ký khi nhận máy (`FR-4.21`) |
| ĐK-03 | **Xác nhận chủ động, kiểm chứng được**; im lặng không phải đồng ý | Điều 9 khoản 3, khoản 4 điểm d | `FR-4.18`, `INV-17` |
| ĐK-04 | **Lọc ngay trên máy** theo danh sách cho phép | Điều 3 khoản 2 | `FR-4.17` |
| ĐK-05 | **Không thu** URL đầy đủ, tiêu đề, nội dung, phím bấm, ảnh màn hình, vị trí, địa chỉ IP | Điều 3 khoản 2; Điều 38 BLDS *(đọc qua trang đăng lại)* | `FR-4.17`, `FR-4.21`; máy chủ từ chối trường ngoài lược đồ |
| ĐK-06 | **Không thu ứng dụng liên lạc** | `ADR-10` | Danh sách cho phép loại cờ `FR-1.8` |
| ĐK-07 | Coi là **dữ liệu nhạy cảm**; doanh nghiệp **lập hồ sơ đánh giá tác động** trong 60 ngày, không được miễn | Điểm `l)` khoản 1 Điều 4 NĐ 356; Điều 21, Điều 38 khoản 2 Luật 91 | Mục 7.7.5 — ngoài phần mềm |
| ĐK-08 | Lưu **6 tháng**; **xóa khi chấm dứt hợp đồng** | `QĐ-01`; Điều 25 khoản 2 điểm c | Mục 7.5, `FR-10.3`, `FR-10.6` |
| ĐK-09 | **Chỉ dùng cho tối ưu license**; không chấm năng suất, không kỷ luật | Điều 3 khoản 2; Điều 25 khoản 3 điểm b | Không có màn hình xếp hạng thời gian dùng theo người; Manager chỉ thấy có/không hoạt động (`SoD-2`) |
| ĐK-10 | Chính sách giám sát và chính sách thiết bị nằm trong **nội quy lao động** | Điều 118 BLLĐ 2019 *(đọc qua trang đăng lại)* | Mục 7.7.5 — ngoài phần mềm; văn bản ký khi nhận máy (`FR-4.21`) |

> **Điều BRD KHÔNG kết luận:** việc *văn bản xác nhận khi nhận máy + thông báo + xác nhận chủ động* có đủ thay **sự đồng ý** theo Điều 11 khoản 1 hay không — `OQ-16`, `OQ-23`. Thiết kế đã chọn mức an toàn nhất trong phạm vi phần mềm: không nhận dữ liệu khi chưa xác nhận, và vẫn nhận yêu cầu dừng.

> **Giới hạn của tài liệu này:** đây là tài liệu phân tích nghiệp vụ, không phải tư vấn pháp lý. Các diễn giải trong mục này cần được kiểm chứng lại tại văn bản gốc trước khi đưa vào báo cáo cuối.

---

## 8. QUYẾT ĐỊNH KIẾN TRÚC (ARCHITECTURE DECISION RECORDS)

### ADR-01 — Mô hình triển khai: single-tenant, lược đồ dữ liệu có nhận biết tổ chức ✅

**Quyết định:** triển khai dedicated instance — mỗi doanh nghiệp một bản cài đặt riêng. MVP vận hành cho một tổ chức duy nhất. Tuy nhiên lược đồ dữ liệu vẫn giữ nhận biết tổ chức: mọi bảng gốc nghiệp vụ mang cột định danh tổ chức, và mọi ràng buộc duy nhất đặt cột này ở vị trí đầu tiên (`INV-15`).

**Lý do:** hệ thống lưu hợp đồng, dữ liệu tài chính và log hành vi người dùng — thuộc nhóm nhạy cảm nhất của doanh nghiệp. Trong phạm vi 9 tuần phát triển thật, mô hình nhiều tổ chức dùng chung cơ sở dữ liệu không thêm giá trị nghiệp vụ nào nhưng tiêu tốn thời gian của các phân hệ tạo giá trị. Giữ cột định danh tổ chức cho phép chuyển đổi sau này mà không cần thay đổi lược đồ.

**Bảng dùng chung, không mang định danh tổ chức:** từ điển nhà cung cấp, danh mục sản phẩm SaaS chuẩn, bảng tỷ giá, danh mục vai trò.

**Câu trả lời chuẩn bị cho phản biện:** *mô hình triển khai dedicated instance được chọn có chủ đích do đặc thù dữ liệu; mô hình dữ liệu đã thiết kế nhận biết tổ chức nên có thể chuyển sang mô hình dùng chung mà không thay đổi lược đồ; phần onboarding khách hàng nằm ngoài phạm vi MVP.*

### ADR-02 — Seat không được vật chất hóa thành nhiều bản ghi

**Quyết định:** không tạo 100 bản ghi cho gói 100 seat. Lưu số lượng đã mua trên Subscription; đếm số Assignment đang chiếm chỗ; seat trống là giá trị dẫn xuất, không lưu.

**Lý do:** mô hình giá SaaS không đồng nhất. Vật chất hóa seat chỉ đúng với mô hình tính theo người dùng, sai hoàn toàn với gói cố định, gói dùng chung và gói tính theo mức tiêu thụ.

**Hệ quả:** mô hình giá là thuộc tính phân nhánh — các phân hệ Usage, Optimization và Forecast phải rẽ nhánh theo giá trị này.

**Ngoại lệ:** khi seat có danh tính riêng (khóa bản quyền, tài khoản host được đặt tên), dùng bảng phụ gắn vào Assignment — kho khóa bản quyền của `FR-2.10` là trường hợp này.

### ADR-03 — Tiền là đối tượng giá trị, luôn kèm loại tiền tệ

**Quyết định:** mọi trường tiền lưu bộ giá trị gồm số tiền gốc, loại tiền tệ, tỷ giá, ngày áp dụng tỷ giá và số tiền đã quy đổi (`INV-04`). Đồng tiền báo cáo cấu hình ở cấp tổ chức.

**Lý do:** doanh nghiệp Việt Nam mua SaaS bằng ngoại tệ và báo cáo bằng VND. Không có quy đổi có kiểm soát thì mọi biểu đồ so sánh ngân sách đều vô nghĩa.

**Hệ quả:** tỷ giá chốt tại thời điểm ghi nhận giao dịch, không quy đổi lại khi xem báo cáo — nếu không, số liệu quá khứ sẽ thay đổi mỗi lần mở dashboard. Không dùng kiểu số thực dấu phẩy động cho tiền. **(1)** Giá trị quy đổi làm tròn **về số gần nhất** theo đơn vị nhỏ nhất của đồng tiền báo cáo, **chỉ** giá trị đúng giữa ra xa số 0, một lần lúc ghi. **(2)** Ngày tỷ giá của giá thuê bao là ngày giá được **ghi nhận hoặc sửa**, kể cả khai bổ sung; thiếu tỷ giá ngày đó ⟹ thuê bao nháp, không quy đổi tạm. **(3)** Đồng tiền báo cáo **không đổi được** khi tổ chức đã có bản ghi tỷ giá hoặc ảnh chụp quy đổi; ảnh chụp cũ không bao giờ tính lại (`QĐ-42a` → `QĐ-42c`). Cách biểu diễn vật lý thuộc BE ADR-0007.

### ADR-04 — Dữ liệu tổ chức và phân bổ seat có hiệu lực theo thời gian

**Quyết định:** quan hệ nhân viên–phòng ban, phòng–trưởng phòng và Assignment đều dùng khoảng hiệu lực (từ ngày, đến ngày), không ghi đè (`QĐ-52`).

**Lý do:** báo cáo phân bổ chi phí theo Cost Center cần biết nhân viên thuộc phòng nào **tại thời điểm phát sinh chi phí**. Đây cũng là điều kiện để Audit Trail có ý nghĩa.

**Hệ quả:** sinh ra các bất biến chống chồng lấn — `INV-02` cho cặp (nhân viên, thuê bao), `INV-20` cho cặp (nhân viên, phòng), `INV-19` cho cặp (phòng, trưởng phòng), và `INV-14a`/`INV-14b` cho Cost Center của nhân viên. Đổi phòng không viết lại chi phí đã phát sinh; chi phí theo kỳ chia theo ngày (`FR-5.3`, `QĐ-55b`).

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

**Quyết định:** tách hồ sơ nhân sự, tài khoản đăng nhập và vai trò thành ba thực thể. Một người có thể mang nhiều vai trò. Vai trò Manager suy ra từ việc đang là **trưởng phòng** có hiệu lực thay vì gán tay (`QĐ-52a`). **Chức vụ** là thuộc tính của hồ sơ nhân sự, không phải vai trò.

**Lý do:** IT Admin cũng là nhân viên và cũng cần xin seat cho chính mình; quy tắc không tự phê duyệt (`INV-08`) phải áp dụng được trong tình huống đó.

### ADR-09 — Dự báo tách lớp, và mô hình thống kê phải qua cổng kiểm chứng

**Quyết định:** dự báo chi phí chia ba lớp (FR-5.5). Lớp cam kết dùng công thức xác định. Lớp biến động dùng mô hình xu hướng nhưng chỉ hiển thị khi qua cổng kiểm chứng sai số (FR-5.7). Lớp phụ thuộc quyết định dùng kịch bản.

**Lý do:** ba lớp có bản chất khác nhau. Dùng mô hình thống kê cho dữ liệu đã biết chắc từ hợp đồng cho kết quả **kém chính xác hơn** đọc thẳng hợp đồng; ngược lại, loại bỏ hoàn toàn mô hình thống kê thì bỏ mất lớp duy nhất mà nó có ý nghĩa.

**Hệ quả:** hệ thống phải lưu được lịch sử chi tiêu đủ dài để chạy kiểm chứng lùi, và phải có cơ chế hiển thị "không dự báo được vì lý do X" như một trạng thái hợp lệ, không phải lỗi.

**Câu trả lời chuẩn bị cho phản biện** *("sao không dùng ARIMA/Prophet/học máy?")*: với chuỗi dữ liệu tháng ngắn trong phạm vi một doanh nghiệp, mô hình phức tạp không cho sai số tốt hơn mà mất khả năng giải thích; và phần lớn chi tiêu SaaS thuộc lớp đã cam kết, nơi mọi mô hình thống kê đều thua công thức từ hợp đồng.

### ADR-10 — Xử lý dữ liệu hành vi theo nguyên tắc thận trọng, không chờ kết luận pháp lý

**Bối cảnh:** điểm `l)` khoản 1 Điều 4 Nghị định 356/2025 xếp *"dữ liệu theo dõi hành vi, hoạt động sử dụng dịch vụ viễn thông, mạng xã hội, dịch vụ truyền thông trực tuyến **và các dịch vụ khác trên không gian mạng**"* vào nhóm dữ liệu cá nhân nhạy cảm. Với vế cuối, câu hỏi cho công cụ làm việc thông thường **đang mở** (`OQ-11`); công cụ nhắn tin và họp trực tuyến ở vùng xám (`OQ-12`). Quyết định dưới đây được thiết kế để **không phụ thuộc** vào kết luận phân loại.

**Quyết định** (`QĐ-01`): không chờ giải quyết vùng xám. Hệ thống phân loại ứng dụng bằng cờ `is_communication_service` (FR-1.8) và áp dụng **ba mức xử lý dữ liệu**:

| | Ứng dụng thông thường | Ứng dụng nhóm dịch vụ liên lạc | Nhật ký truy cập web, proxy, CASB |
| --- | --- | --- | --- |
| **Thu thập dữ liệu hoạt động** | Có | **Mặc định KHÔNG** — chỉ dùng danh sách thành viên, phát hiện G1 và G2 | **Ngoài phạm vi** (mục 5.6.1) |
| Nếu bật thu thập | — | Cần xác nhận có chủ đích của Super Admin, ghi nhật ký kiểm toán, nêu lý do và cơ sở pháp lý | — |
| Dữ liệu lưu khi đã bật | Ngày hoạt động + số lượt; **thu thập tối thiểu** | **Chỉ ngày hoạt động**, không lưu số lượt chi tiết | — |
| **Thời hạn lưu giữ** | **6 tháng** | **6 tháng** | — |
| Manager xem được | Số liệu tổng hợp của nhân viên trong phòng | **Chỉ trạng thái có hoạt động hay không**, không thấy số liệu | — |
| Yêu cầu thông báo trước | **Bắt buộc** (FR-10.4) — **mọi ứng dụng** | Có, và nêu rõ đây là ứng dụng liên lạc | — |

> **Mức thứ tư — bộ thu thập trên thiết bị:** chính sách nằm ở **`ADR-13`**: thu thập **có điều kiện**, lưu **6 tháng**, và **luôn bỏ ứng dụng mang cờ liên lạc** — tức `ADR-10` được giữ nguyên ngay cả khi có bộ thu thập. Mốc lưu giữ **6 tháng** là mốc duy nhất, khớp mục 7.5.

**Quy tắc gắn cờ — ba câu hỏi, trả lời "có" ở bất kỳ câu nào thì gắn cờ:**

1. Ứng dụng có cho phép **nhắn tin giữa người với người** không?
2. Ứng dụng có cho phép **gọi thoại hoặc họp trực tuyến** không?
3. Ứng dụng có phải là **hộp thư điện tử** không?

Bình luận trong tài liệu, ghi chú trong công cụ quản lý công việc, hay nhận xét trên bản thiết kế **không** tính là nhắn tin — vì chúng gắn với một đối tượng công việc cụ thể, không phải kênh liên lạc độc lập. Ví dụ áp dụng: Slack, Teams, Zoom, Google Meet, Gmail, Outlook **có** gắn cờ; Figma, Jira, GitHub, Notion **không** gắn cờ.

**Lý do:**

1. **Không thu thập thì không phát sinh câu hỏi.** Nếu hệ thống không thu thập dữ liệu hoạt động của nhóm ứng dụng liên lạc, thì việc nhóm đó có thuộc danh mục nhạy cảm hay không **trở thành câu hỏi không cần trả lời để tiến hành**. Cách xử lý rẻ nhất cho một rủi ro pháp lý là không tạo ra dữ liệu gây rủi ro.
2. **Chi phí gần bằng không, và không mất nhiều năng lực.** Nhóm ứng dụng liên lạc vẫn phát hiện được lãng phí G1 (suất mua thừa) và G2 (suất của người đã nghỉ) — hai nhóm có độ tin cậy tuyệt đối và không cần một dòng nhật ký nào. Chỉ mất G3 và G4 cho riêng nhóm ứng dụng này.
3. **Gỡ bỏ một nút chặn tiến độ.** Nếu chờ câu trả lời pháp lý mới thiết kế, phân hệ 5.4 bị treo vô thời hạn.
4. **Nhất quán với nguyên tắc chung của hệ thống:** không kết luận khi chưa chắc chắn.

**Hệ quả:**
- Ứng dụng nào được gắn cờ là **quyết định nghiệp vụ** do IT Admin đưa ra theo quy tắc ba câu hỏi ở trên, không suy ra tự động từ tên nhà cung cấp. Hệ thống gợi ý, người xác nhận.
- Nếu doanh nghiệp muốn bật thu thập cho nhóm này, đó phải là một hành động **có chủ đích, được ghi nhật ký kiểm toán, kèm lý do và cơ sở pháp lý** — không phải một ô cấu hình bật tắt tùy tiện.
- Demo của đồ án chạy ở chế độ mặc định, tức không thu thập dữ liệu hoạt động của ứng dụng liên lạc.

**Câu trả lời chuẩn bị cho phản biện** *("nhóm có chắc dữ liệu này không nhạy cảm không?")*: *"Chúng em không khẳng định. Điểm `l)` Điều 4 Nghị định 356/2025 có vế 'và các dịch vụ khác trên không gian mạng', nên câu hỏi với công cụ làm việc còn mở và cần ý kiến pháp lý. Vì vậy hệ thống áp biện pháp bảo vệ cho mọi ứng dụng — thông báo trước khi theo dõi, thu thập tối thiểu, lưu 6 tháng — bất kể kết luận phân loại; và mặc định không thu thập dữ liệu hoạt động của nhóm ứng dụng liên lạc, nên không tạo ra dữ liệu gây rủi ro cho nhóm đó."* **Không** khẳng định *"công cụ công việc thông thường không thuộc nhóm nhạy cảm"* — câu này dựa trên bản trích thiếu vế cuối và đã sai.

### ADR-11 — Chọn NestJS làm framework backend

**Bối cảnh:** bản đăng ký và các bản BRD đầu để ngỏ lựa chọn *"ASP.NET Core hoặc NestJS"*, theo dõi bằng quyết định kỹ thuật `QĐKT-01` (*Định nghĩa Phạm vi & Nghiệp vụ* mục 6.7.1) với ba tiêu chí đặt sẵn.

**Quyết định:** dùng **NestJS** (Node.js, TypeScript) cho toàn bộ backend — REST API, phân quyền ở tầng API, rule engine, máy trạng thái và tác vụ nền.

**Lý do — theo đúng ba tiêu chí đã đặt ra tại `QĐKT-01`, không thêm tiêu chí mới sau khi đã chọn:**

| Tiêu chí của `QĐKT-01` | Đánh giá |
| ---------------------- | -------- |
| Năng lực sẵn có của nhóm | Nhóm đã quen TypeScript qua phần frontend React; chi phí học thấp hơn so với phải làm quen một hệ sinh thái thứ hai |
| Hệ sinh thái thư viện cho kiểm tra dữ liệu đầu vào, phân quyền và tác vụ nền | NestJS có sẵn ba cơ chế tương ứng với ba nhu cầu này: pipe kiểm tra dữ liệu đầu vào, guard cho phân quyền, và tích hợp hàng đợi tác vụ nền trên Redis |
| Mức dễ triển khai | Một runtime duy nhất cho cả frontend và backend, đơn giản hóa việc dựng môi trường trong phạm vi đồ án |

**Hệ quả thiết kế:**

- Cấu trúc **module** của NestJS ánh xạ trực tiếp sang **tám ranh giới ngữ cảnh** ở mục 5.12.1 — mỗi ranh giới một module, giúp giữ đúng nguyên tắc chia theo miền nghiệp vụ thay vì chia theo tầng kỹ thuật.
- **Guard** ở tầng API là nơi enforce kiểm soát truy cập theo vai trò (mục 7.2) và các nguyên tắc `SoD-1` → `SoD-8`. Bộ kiểm thử phủ định cho SoD và cho `INV-08` chạy trực tiếp trên tầng này.
- Hàng đợi tác vụ nền trên Redis (mục 6.1) phục vụ rule engine định kỳ, pipeline import sáu bước và job đối soát.
- Dùng chung TypeScript với frontend cho phép **chia sẻ kiểu dữ liệu của hợp đồng API**, giảm lệch giữa hai phía — đáng kể với một nhóm 5 người trong 9 tuần phát triển.

**Điều bắt buộc phải giữ, không được đánh đổi vì framework:** lớp truy cập dữ liệu phải cho phép chạy **migration SQL thuần**, vì phần lớn bất biến ở mục 5.12.2 được ràng buộc ở **tầng cơ sở dữ liệu**, không ở tầng ứng dụng:

- Ràng buộc chống **chồng lấn khoảng hiệu lực** — `INV-02`, `INV-14a`, `INV-19`, `INV-20`
- **Chỉ mục duy nhất có điều kiện** — `INV-13`, và cột định danh tổ chức đứng đầu mọi ràng buộc duy nhất — `INV-15`
- Nhật ký kiểm toán **chỉ ghi thêm**: `UPDATE` và `DELETE` bị từ chối ngay ở tầng cơ sở dữ liệu — `INV-05`

ORM chỉ cần **không cản trở** việc chạy các migration này; không được thay thế chúng bằng kiểm tra ở tầng ứng dụng, vì như vậy thì hai người thao tác đồng thời vẫn phá được ràng buộc.

**Không ảnh hưởng phần nghiệp vụ:** mô hình dữ liệu, chín vòng đời có máy trạng thái và luật phát hiện đều độc lập với framework.

**Câu trả lời chuẩn bị cho phản biện** *("vì sao không dùng ASP.NET Core?")*:

> *"Cả hai đều đáp ứng được yêu cầu kỹ thuật của đề tài — đây không phải đánh giá hơn kém về công nghệ. Nhóm chọn theo hai tiêu chí đã đặt ra từ trước: năng lực sẵn có và chi phí chuyển ngữ cảnh trong một nhóm 5 người làm trong 9 tuần phát triển. Quyết định được ghi thành ADR-11 kèm cả điều kiện ràng buộc: dù dùng framework nào thì các bất biến toàn vẹn vẫn phải đặt ở tầng cơ sở dữ liệu."*

### ADR-12 — Chọn React Router 8 chế độ SPA làm khung frontend

**Bối cảnh:** bản đăng ký ghi *"React/Next.js"* như **đề xuất công nghệ**, không phải cam kết khóa cứng. Mã nguồn frontend thực tế đã dựng bằng React Router 8, không có Next.js.

**Quyết định:** dùng **React Router 8 Framework Mode chạy ở chế độ SPA** (`ssr: false`) cùng **Vite** và TypeScript cho toàn bộ frontend.

**Căn cứ đã kiểm chứng tại mã nguồn** *(`Code/FE-web`, ngày 08/09/2026)*: `package.json` khai `react-router ^8`, `@react-router/dev ^8`, `vite ^8.0.3`, **không có** `next`; `react-router.config` đặt `ssr: false`; `ARCHITECTURE.md` mô tả *"static React Router SPA"*.

**Lý do:**

| Tiêu chí | Đánh giá |
| --- | --- |
| Khớp quyết định kiến trúc đã có | Hệ thống là **SPA**, NestJS là nơi duy nhất giữ thẩm quyền phân quyền. `ssr: false` khớp đúng; năng lực render phía máy chủ của Next.js không được dùng tới |
| Chi phí chuyển đổi | Nền frontend đã dựng và chạy được: ESLint 10 flat config, Orval sinh client từ OpenAPI, TanStack Query, MSW, bộ test, và một bản build production đã kiểm chứng. Viết lại sang Next.js là vứt bỏ toàn bộ phần này |
| Ngân sách thời gian | Cửa sổ phát triển thật chỉ **9 tuần** (`RB-1`). Đổi khung frontend lấy đi thời gian của các phân hệ tạo giá trị |
| Chia sẻ kiểu dữ liệu với backend | Cả hai phía dùng TypeScript, hợp đồng API sinh từ OpenAPI theo `CN-5` |

**Điều bắt buộc phải giữ, không đánh đổi vì framework:**

- Phân quyền **enforce ở tầng API** bằng guard của NestJS (mục 7.2). Việc ẩn menu ở frontend **không** được coi là kiểm soát truy cập.
- Ranh giới hệ thống với thế giới bên ngoài vẫn đặt ở **định dạng dữ liệu**, không đặt ở framework.

**Không ảnh hưởng phần nghiệp vụ:** mô hình dữ liệu, chín vòng đời có máy trạng thái, luật phát hiện và các bất biến đều độc lập với lựa chọn này.

**Câu trả lời chuẩn bị cho phản biện** *("bản đăng ký ghi Next.js, sao lại đổi?")*:

> *"Bản đăng ký nêu React/Next.js ở phần đề xuất công nghệ, không phải cam kết khóa cứng — cũng như phần backend nêu 'ASP.NET Core hoặc NestJS'. Hệ thống đã chốt là ứng dụng một trang, nên phần render phía máy chủ của Next.js không được dùng tới. Nhóm chọn React Router 8 vì nó phục vụ đúng mô hình đó, và quyết định được ghi thành ADR-12 thay vì để tài liệu lệch với mã nguồn."*

### ADR-13 — Bộ thu thập trên thiết bị lọc tại nguồn; máy chủ không bao giờ nhận dữ liệu thô

> **Phạm vi:** ADR này là **nguyên tắc bắt buộc cho mọi bộ thu thập trên thiết bị**. Loại bộ thu thập và mức hiện thực chốt lại ở giai đoạn Tools (`QĐ-59a`); nguyên tắc *lọc tại nguồn, máy chủ không nhận dữ liệu thô* **không** đổi.

**Bối cảnh:** góp ý của GVHD: *"khi nhân viên mua phần mềm, phải biết họ có dùng hay không thì đồ án mới có ý nghĩa"*, kèm gợi ý theo dõi trên máy tính công ty cấp. [Ma trận nhà cung cấp](../Research-AI/tool-vendor-usage-research-backlog.md#631-ma-trận-khả-năng-truy-xuất-dữ-liệu-usage-theo-nhà-cung-cấp) (BRD 6.3.1 cũ, chuyển sang tệp nghiên cứu tool & vendor theo `QĐ-59a`; đang nghiên cứu lại theo `QĐ-57d`) cho thấy dữ liệu hoạt động theo người gần như chỉ có ở gói cao nhất (`KL-6`). Trong khi đó dữ liệu theo dõi việc dùng dịch vụ trực tuyến trên máy người lao động là **dữ liệu nhạy cảm** theo điểm `l)` khoản 1 Điều 4 Nghị định 356/2025.

**Quyết định** (`QĐ-20`, `QĐ-31b`, `QĐ-58f`):

1. **Bộ thu thập trên thiết bị là một nguồn bằng chứng trong phạm vi.** Loại cụ thể và mức hiện thực chốt ở giai đoạn Tools (`QĐ-59a`); giả định hiện tại: tiện ích trình duyệt trong MVP, Desktop Agent phiên người dùng và OTel mức demo (`QĐ-20`, `QĐ-31b`; `FR-4.17`, `FR-4.19`, `FR-4.20`).
2. **Lọc tại nguồn.** Danh sách cho phép — tên miền và tên tiến trình lấy từ danh mục SaaS và từ điển nhà cung cấp, **trừ mọi ứng dụng mang cờ liên lạc** — được đẩy xuống thiết bị. Thiết bị chỉ gửi bản tổng hợp theo ngày cho mục trong danh sách. **Máy chủ không bao giờ nhận** URL, tiêu đề, nội dung, phím bấm, ảnh màn hình, địa chỉ IP, hay mục ngoài danh sách.
3. **Máy chủ phòng thủ lớp hai.** Endpoint nhận dữ liệu **từ chối** bản ghi có trường ngoài lược đồ, từ thiết bị chưa đăng ký, hoặc của nhân viên chưa xác nhận (`INV-17`).
4. **Không có xác nhận thì không có dữ liệu.** Nhân viên ký văn bản xác nhận đã biết rõ khi nhận máy (`FR-4.21`) và xác nhận chủ động trong hệ thống, lưu phiên bản nội dung thông báo và thời điểm; có yêu cầu dừng thu thập (`FR-4.18`).
5. **Chỉ máy công ty cấp**; máy cá nhân không đăng ký, không thu (`FR-4.21`).
6. **Mười điều kiện `ĐK-01` → `ĐK-10`** ở mục 7.7.7 là **điều kiện bắt buộc**, không phải khuyến nghị.

**Lý do:**

| Tiêu chí | Đánh giá |
| --- | --- |
| Tối thiểu hóa theo Điều 3 khoản 2 Luật 91 | Dữ liệu vượt mục đích **không tồn tại** ở máy chủ, nên không có gì để lộ, để truy vấn nhầm, hay để bị dùng sai mục đích |
| Nhất quán với `ADR-10` | Cùng nguyên tắc *cách rẻ nhất loại một rủi ro là không tạo ra dữ liệu gây rủi ro* — áp ở **thiết bị** thay vì ở phạm vi |
| Kiểm chứng được | Bộ test phủ định: gửi bản ghi có trường cấm, từ thiết bị chưa đăng ký, hoặc trước khi xác nhận ⟹ bị từ chối |
| Chi phí | Danh sách cho phép vốn đã có sẵn dưới dạng danh mục và từ điển nhà cung cấp |

**Đã loại:** *agent thu tiêu đề cửa sổ hoặc ảnh màn hình* — vượt mục đích, có thể chứa nội dung liên lạc riêng tư · *gửi dữ liệu thô rồi lọc ở máy chủ* — máy chủ vẫn giữ dữ liệu vượt mục đích dù chỉ tạm thời · *chỉ thông báo, không cần xác nhận* — im lặng không phải đồng ý (Điều 9 khoản 4 điểm d).

**Hệ quả:** phân hệ con 5.4.4b; `FR-4.17` → `FR-4.21`; `INV-17`; mở rộng `FR-6.3`, `FR-10.4`; chính sách lưu giữ ở 7.5; nghĩa vụ ngoài phần mềm ở 7.7.5. Bản đăng ký đồ án ghi endpoint agent ngoài MVP — lệch được ghi ở Phụ lục C.1.

**Câu trả lời chuẩn bị cho phản biện** *("theo dõi máy nhân viên có vi phạm quyền riêng tư không?")*:

> *"Luật Bảo vệ dữ liệu cá nhân, Điều 25 khoản 3, cho phép doanh nghiệp dùng biện pháp công nghệ để quản lý người lao động nếu phù hợp pháp luật và người lao động biết rõ. Nhân viên ký văn bản xác nhận đã biết rõ khi nhận máy công ty, và hệ thống chỉ chạy trên máy công ty. Nhóm coi dữ liệu này là nhạy cảm và thiết kế để máy chủ không bao giờ nhận phần vượt mục đích: tiện ích chỉ gửi tên miền của các SaaS đã biết cùng số phút dùng mỗi ngày, bỏ qua ứng dụng nhắn tin, và không gửi gì cho tới khi nhân viên xác nhận. Việc xác nhận đó có thay được sự đồng ý theo luật hay không là câu hỏi pháp lý nhóm để ngỏ, và đã chọn mức an toàn nhất trong phạm vi phần mềm."*

---

## 9. QUYẾT ĐỊNH VỀ PHẠM VI VÀ LÝ DO

Các hạng mục sau được **chủ động đưa ra ngoài phạm vi** hoặc **đưa vào phạm vi có điều kiện**, kèm lý do. Đây là quyết định phạm vi có căn cứ, không phải phần chưa kịp làm.

| Hạng mục | Trạng thái | Lý do | Hướng phát triển |
| -------- | ---------- | ----- | ---------------- |
| **G5 — khuyến nghị hạ gói theo mức sử dụng** | ❌ Ngoài phạm vi | Cần dữ liệu chi tiết về loại thao tác và tần suất mà hầu hết nguồn export không cung cấp. Log thường chỉ ghi sự kiện đăng nhập, không phân biệt được người chỉ xem với người chỉnh sửa | Triển khai khi có nguồn dữ liệu chi tiết theo loại seat |
| **Discovery từ log web/firewall/proxy/CASB đầy đủ** | ❌ Ngoài phạm vi | Ba lý do tại mục 5.6.1: vướng khung pháp lý về dữ liệu cá nhân mà nhóm chưa đủ căn cứ xử lý đúng; không có hạ tầng để kiểm chứng độ bao phủ; giá trị gia tăng không tương xứng rủi ro. Tiện ích trình duyệt lọc theo danh sách cho phép **không** thuộc dòng này | Giữ đặc tả thiết kế tại FR-6.10 cho giai đoạn sau |
| **Agent trên máy công ty — mức sản phẩm** | 📐 Chỉ thiết kế | `QĐ-31b`: agent phiên người dùng chỉ ở **mức demo**; Windows Service, installer/updater, ký số ngoài phạm vi (`RB-1`) | Quyết định riêng nếu còn thời gian hoặc GVHD yêu cầu |
| **Dự báo bằng mô hình thống kê** | ⏸️ Hoãn | Không loại bỏ, nhưng chỉ áp dụng cho lớp chi phí biến động và chỉ hiển thị khi qua cổng kiểm chứng sai số. Không hiện thực lớp L2 trong MVP vì demo không có ≥ 12 tháng dữ liệu thật; L1 và L3 vẫn hiện thực (`QĐ-25`) | Mở rộng khi có ít nhất 24 tháng dữ liệu chi tiêu thật |
| **Ma trận nhiều ngưỡng thẩm quyền chi** | ❌ Ngoài phạm vi | `QĐ-22`: một Người duyệt chi duy nhất đủ cho MVP | Mở lại nếu KPI-2 cho thấy chậm ở bước duyệt chi |
| **Tích hợp hệ thống nhân sự** | ❌ Ngoài phạm vi | Không có nguồn dữ liệu nghỉ phép trong phạm vi dự án | Trạng thái nghỉ phép do IT Admin cập nhật tay |
| **Mô hình nhiều tổ chức dùng chung** | ❌ Ngoài phạm vi | Theo ADR-01 | Lược đồ đã sẵn sàng để chuyển đổi |
| **Tự động chặn ứng dụng; chặn dùng dịch vụ trên máy cá nhân** | ❌ Ngoài phạm vi | Vượt ranh giới trách nhiệm của hệ thống quản trị license; cần công cụ bảo mật chuyên dụng hoặc gói Enterprise. Chính sách thiết bị (`FR-4.21`) là quy định nội bộ do doanh nghiệp thực thi | Phối hợp với công cụ bảo mật sẵn có của doanh nghiệp |
| **Phần mềm/SaaS miễn phí bên ngoài** | ❌ Không phải đối tượng quản lý | `QĐ-49a`, `QĐ-49h`: đối tượng quản lý là SaaS có trả phí, phần mềm thương mại có bản quyền và phần mềm/dịch vụ nội bộ. IT đóng yêu cầu công cụ miễn phí bên ngoài. **Không** cấm thư viện mã nguồn mở, API miễn phí hay gói Free/Trial để kiểm thử/demo | Chưa có quyết định mở rộng |
| **Luồng rà soát/thanh lý dịch vụ nội bộ** | ⏸️ Chưa trong đợt này | `QĐ-49d`: phần mềm nội bộ chỉ có danh mục, Business Owner, quyền sử dụng, chi phí đã ghi nhận (`QĐ-49b`) | Quyết định riêng nếu cần |
| **API cấp/thu hồi riêng cho dịch vụ nội bộ; quản trị vận hành máy chủ** | ❌ Ngoài phạm vi | `QĐ-49b`: IT thực hiện ngoài hệ thống rồi xác nhận kèm bằng chứng | Quyết định riêng cho từng dịch vụ cụ thể nếu cần |
| **Tính năng AI ngoài hai tính năng của `QĐ-49e`; hỏi đáp hợp đồng (RAG); AI gợi ý bộ công cụ chuẩn; trợ lý soạn yêu cầu; tóm tắt gia hạn** | ⏸️ Hoãn / mở rộng | `QĐ-49e`, `QĐ-52e`, `QĐ-61e`: phạm vi AI cam kết là đúng hai tính năng của `QĐ-49e`; `US-15-01` đang ẩn; Owner không chọn thêm tính năng AI ngày 09/10/2026; thầy xếp AI ưu tiên sau *công cụ* và *luồng lõi* | Quyết định riêng sau khi có kết quả kiểm chứng |
| **Tính thuế, kê khai, khấu trừ thuế** | ❌ Ngoài phạm vi — **chỉ ghi nhận** | `QĐ-55a`: quy định thuế cho phần mềm/đám mây thay đổi liên tục trong 2025–2026 (Luật 48/2024, Nghị định 252/2026, Công văn 296/CT-CS) và một số điểm còn diễn giải khác nhau; nhóm không có chuyên môn thuế (`RB-5`). Ghi nhận dòng thuế theo chứng từ và thuế ước tính là đủ để giải thích chênh lệch giá duyệt ↔ tiền trả (`FR-5.13`) | Tích hợp phần mềm kế toán nếu doanh nghiệp yêu cầu |
| **Hạn mức/quota/rate limit theo phòng ban** | ❌ Ngoài phạm vi | `QĐ-57c`: quá khó làm trong cửa sổ `RB-1`; ngân sách theo Cost Center `Unit` của phòng vẫn có | Quyết định riêng nếu có thời gian |
| **Tổ chức duyệt nhiều cấp; quản lý dự án** | ❌ Ngoài phạm vi | `QĐ-52a`, `QĐ-52b`: phòng ban phẳng dưới công ty; dự án chỉ là mô tả. Đối tượng mục tiêu là doanh nghiệp 100–500 người (mục 3.4), không phải cơ quan nhà nước | Mô hình phòng ban nhiều cấp nếu mở rộng đối tượng |
| **Push notification, offline, biometrics; chức năng IT/Finance/quản trị trên mobile** | ⏸️ Sau MVP | `QĐ-61b`, `QĐ-61c`: mobile MVP chỉ bốn tác vụ và hộp thông báo trong ứng dụng | Quyết định riêng sau MVP |
| **Theo dõi usage trên điện thoại** | ❌ Ngoài phạm vi | `QĐ-61d`: ứng dụng mobile là kênh sử dụng, không phải bộ thu thập; điện thoại là vùng không quan sát (`QĐ-57b`, `QĐ-58f`) | — |
| **Usage, `G2`–`G4` và tiết kiệm cho phần mềm nội bộ** | ❌ Ngoài MVP | `QĐ-62o`: MVP chỉ quản lý danh mục, Business Owner, quyền, chi phí đã ghi nhận (`QĐ-49b`) | Quyết định riêng khi có nguồn usage nội bộ |
| **Cấp phát qua SSO/SCIM gói Enterprise (K3)** | 📐 Chỉ thiết kế | `QĐ-54a`, `RB-4`: không có ngân sách gói Enterprise | Hiện thực khi có tenant Enterprise |

---

## 10. CÁC VẤN ĐỀ CÒN MỞ

### 10.1. Đang mở

**Không còn câu hỏi mở chặn Requirements** (`QĐ-60c`). Câu hỏi dưới đây **không chặn Requirements** nhưng chặn đúng phần việc ghi ở cột *Chặn*; câu hỏi hoãn có điều kiện nằm ở mục 10.3; câu hỏi kỹ thuật giai đoạn Tools nằm ở [tệp nghiên cứu tool & vendor](../Research-AI/tool-vendor-usage-research-backlog.md); các điểm mở của bộ sơ đồ (`DOI-xx`) được phân loại ở [biên bản kiểm chứng sơ đồ](../Diagrams/verification-2026-10-08.md). *(Khoảng trống phần mềm nội bộ — nguồn usage, `G2`–`G4`, tiết kiệm — đã chốt **ngoài MVP** ở `QĐ-62o`, không cần mã câu hỏi.)*

| Mã | Câu hỏi | Hiện trạng | Chặn | Ai / khi nào |
| -- | ------- | ---------- | ---- | ------------ |
| OQ-26 | Điều kiện gửi dữ liệu tới nhà cung cấp model cho hai tính năng AI của `QĐ-49e`: dữ liệu nào, che/tổng hợp tới mức nào, model chạy local hay dịch vụ ngoài, điều khoản nhà cung cấp nào chấp nhận được | **Chưa đánh giá** (mục 6.4). Quy tắc dữ liệu của `US-15-01` (`QĐ-34d`) **không** áp sang hai tính năng này. Tới khi có điều kiện: **không** gửi dữ liệu thật hoặc dữ liệu cá nhân tới model ngoài hệ thống, chỉ dữ liệu giả lập (`QĐ-61f`) | Gọi model với dữ liệu thật, kiểm chứng model, tuyên bố đã hiện thực hai tính năng AI. **Không** chặn Requirements, sơ đồ, ERD, luồng lõi | Owner; trước khi hiện thực/đánh giá lớp AI |

### 10.2. Đã chốt

| Mã | Câu hỏi | Kết quả | Nguồn |
| -- | ------- | ------- | ----- |
| OQ-01 | Mô hình triển khai | Single-tenant, lược đồ nhận biết tổ chức | ADR-01 |
| OQ-02 | Nhân viên gắn với một hay nhiều Cost Center? | **Hai tầng:** nhân viên gắn **đúng một** Cost Center tại mỗi thời điểm — nay suy ra từ phòng ban (`INV-20`); gói dùng chung (flat-rate, concurrent) chia theo tỷ lệ ở cấp Subscription (`INV-03`). Hai vế tách thành `INV-14a` (không chồng lấn) và `INV-14b` (không rỗng) | `QĐ-30c`, `QĐ-52b` |
| OQ-03 | Giới hạn "IT Admin chỉ thấy mã NV và email" áp dụng ở tầng nào? | **Tầng API.** IT Admin thấy tên ở màn hình gán seat, xử lý cấp phát và chi tiết request; **ẩn tên** ở màn hình usage và discovery | — |
| OQ-04 | Nguồn dữ liệu nghỉ phép | Cập nhật tay bởi IT Admin, không tích hợp HRM | — |
| OQ-05 | Phạm vi cấu hình ngưỡng và thứ tự ưu tiên | **Ứng dụng > Tổ chức > Mặc định**; không có cấp phòng ban (hạn mức theo phòng ngoài phạm vi) | FR-4.13, `QĐ-57c` |
| OQ-06 | Cơ sở ghi nhận chi phí: dòng tiền hay theo kỳ? | **Lưu cả hai**, phân biệt bằng nhãn. Theo kỳ dùng cho dashboard ngân sách; theo dòng tiền dùng cho đối soát hóa đơn | FR-5.3 |
| OQ-07 | Dự án là thực thể riêng hay một loại Cost Center? | **Không phải cả hai:** dự án chỉ là thông tin mô tả trong hồ sơ phòng; Cost Center chỉ còn `Unit` (1–1 với phòng) và `Company` | `QĐ-52b` |
| OQ-08 | Chính sách lưu giữ dữ liệu usage | **6 tháng, hoặc 30 ngày sau ngày làm việc cuối — cái nào đến trước**, cho bản ghi hoạt động chi tiết của **mọi ứng dụng**. Dữ liệu tổng hợp đã phi định danh giữ 24 tháng | Mục 7.5, `FR-10.6`, `QĐ-01` |
| OQ-09 | Ngưỡng sai số của cổng kiểm chứng dự báo | **Sai số phần trăm tuyệt đối trung bình ≤ 20%**, cấu hình được trong khoảng 10–40%. Sai số đo được phải hiển thị cạnh dự báo | FR-5.7 |
| OQ-10 | Có đặt con số mục tiêu cho 5 KPI tại mục 2.4 không? | **Không** đặt mục tiêu cho KPI của tổ chức. Thay bằng **4 tiêu chí nghiệm thu TC-1 → TC-4 cho rule engine** | Mục 2.4 |
| OQ-12 | Ứng dụng nhắn tin, họp trực tuyến có thuộc nhóm nhạy cảm không? | **Không đóng được bằng đọc văn bản**; câu hỏi **không còn cần trả lời** vì ADR-10 mặc định không thu thập | ADR-10, mục 7.7.6 |
| OQ-13 | Khả năng xuất dữ liệu usage của Microsoft 365, Atlassian, Zoom, Notion | Microsoft 365 và Atlassian: có ngày hoạt động cuối theo từng người | [Ma trận nhà cung cấp](../Research-AI/tool-vendor-usage-research-backlog.md#631-ma-trận-khả-năng-truy-xuất-dữ-liệu-usage-theo-nhà-cung-cấp) (BRD 6.3.1 cũ, `QĐ-59a`) |
| OQ-14 | Zoom và Notion có bản xuất ngày hoạt động cuối theo từng người không? | Zoom **có** từ gói Pro nhưng mang cờ liên lạc nên **không thu**; Notion **chỉ có** ở gói **Enterprise** | [Ma trận nhà cung cấp](../Research-AI/tool-vendor-usage-research-backlog.md#631-ma-trận-khả-năng-truy-xuất-dữ-liệu-usage-theo-nhà-cung-cấp) (BRD 6.3.1 cũ, `QĐ-59a`) |
| OQ-15 | Nhà cung cấp định danh: tự làm bảng tài khoản hay dùng dịch vụ ngoài? | **Xác thực nội bộ do backend quản lý** — tài khoản tạo từ hồ sơ nhân viên, người dùng tự đặt mật khẩu qua lời mời dùng một lần (BE ADR-0010) | `FR-8.6`, `FR-8.11`, `QĐ-46` |
| OQ-19 | Nhánh (a) có được **bỏ qua Người duyệt chi** không? | **Có**; báo cáo quy trình có tổng hợp seat cấp theo nhánh (a) | `FR-5.11`, `QĐ-29a` |
| OQ-20 | Finance ghi ý kiến ngân sách **trước** hay **sau** Người duyệt chi? | **Sau.** Người duyệt chi quyết trên snapshot ngân sách, có thể hỏi Finance; Finance ghi nhận chính thức sau duyệt, song song cấp phát | `FR-3.14`, `QĐ-29b` |
| OQ-21 | Sau điều chuyển, trưởng phòng mới phải rà soát quyền trong bao lâu? | **5 ngày làm việc**, cấu hình được; quá hạn chỉ nhắc và cảnh báo, không tự thu hồi | `FR-3.8`, `QĐ-50b` |
| OQ-24 | Một người có được làm trưởng của **nhiều phòng** cùng lúc không? | **Không** — mỗi người làm trưởng tối đa một phòng tại một thời điểm | `INV-19`, `QĐ-58a` |
| OQ-22 | Quy định thuế hiện hành khi mua SaaS/phần mềm của nhà cung cấp trong nước và nước ngoài | **Đã kiểm chứng trên văn bản gốc** các điểm thiết kế phụ thuộc: GTGT 10% cho dịch vụ của nhà cung cấp nước ngoài qua nền tảng số; doanh nghiệp mua khấu trừ, nộp thay từ 01/07/2026; GTGT nộp thay được khấu trừ đầu vào. Thiết kế đổi theo: cơ sở **chi phí thực chịu**, hồ sơ thuế chia theo ai nộp. Điểm còn diễn giải khác nhau (TNDN 5% hay 10% cho cloud; quy đổi giá net lên gross) **không** đổi thiết kế vì Finance nhập tỷ lệ | `FR-5.13`, `QĐ-60` |

### 10.3. Hoãn có điều kiện

Các câu hỏi dưới **không chặn** thiết kế hay hiện thực; Requirements được coi là xong mà không chờ chúng (`QĐ-59b`, `QĐ-59c`).

| Mã | Câu hỏi | Xử lý hiện hành | Mở lại khi |
| -- | ------- | --------------- | ---------- |
| OQ-11 | "Ngày hoạt động cuối trên ứng dụng công việc" có thuộc nhóm dữ liệu cá nhân nhạy cảm theo Nghị định 356/2025 không? | Đã vô hiệu hóa bằng thiết kế (`QĐ-01`): áp biện pháp bảo vệ cho mọi ứng dụng — mục 7.7.6 | Có ý kiến của GVHD hoặc người có chuyên môn pháp lý |
| OQ-16 | Thông báo cộng **xác nhận chủ động** có đủ thay **sự đồng ý** theo Điều 11 khoản 1 Luật 91/2025 cho dữ liệu từ bộ thu thập không? | Thiết kế chọn mức an toàn nhất trong phạm vi phần mềm (`ADR-13`, `INV-17`, `FR-10.5`). Báo cáo cuối **không** tuyên bố *đã tuân thủ*; chỉ nêu rủi ro đã giảm bằng thiết kế | Như trên |
| OQ-23 | Văn bản *xác nhận đã biết rõ* ký khi nhận máy (`FR-4.21`) có được coi là **sự đồng ý tự nguyện** không, hay cần căn cứ khác (nội quy, hợp đồng lao động)? | Như `OQ-16`; văn bản viết *xác nhận đã biết rõ*, không viết *đồng ý*; yêu cầu dừng hợp lệ luôn được thực hiện | Như trên |
| OQ-17 | Tiện ích trình duyệt hỗ trợ những trình duyệt nào? | **Chuyển giai đoạn Tools** — [tệp nghiên cứu tool & vendor](../Research-AI/tool-vendor-usage-research-backlog.md) | Khi chốt bộ thu thập |
| OQ-18 | Điều kiện để **cài bắt buộc** tiện ích không đăng trên Chrome Web Store | **Chuyển giai đoạn Tools**; demo không tuyên bố cài bắt buộc (`QĐ-28b`) | Khi chốt bộ thu thập |

---

## 11. TÀI LIỆU LIÊN QUAN

| Tài liệu | Vai trò | Trạng thái |
| -------- | ------- | ---------- |
| **Bản đăng ký đồ án** `SU26SE166` (mã của bản đăng ký cũ; mã dự án hiện hành `FA26SE174`, mã nhóm `GFA26SE125` — `QĐ-62r`) | Ràng buộc gốc, đã có chữ ký GVHD — `Requiments/Origins/` | Đã nộp; lưu làm lịch sử |
| **BRD** (tài liệu này) | **Nguồn chân lý duy nhất** về nghiệp vụ và mô hình miền | **v3.35** (12/10/2026) |
| **Sổ quyết định dự án** | Quyết định của Owner/nhóm trưởng `QĐ-01` → `QĐ-66` — [Decisions/project-decisions.md](../Decisions/project-decisions.md) | Đang cập nhật; số tiếp theo `QĐ-67` |
| **Định nghĩa Phạm vi & Nghiệp vụ** | WHY/WHAT/WHO, chốt scope các luồng, lý thuyết cần nghiên cứu | **v1.24** (12/10/2026 — đồng bộ v3.35; nội dung WHY/WHAT/WHO không đổi, chỉ bảng tài liệu liên quan) |
| **Nghiên cứu pháp lý và nhà cung cấp** | Điều khoản Luật 91/2025, ma trận 11 nhà cung cấp, danh mục demo — `Research-AI/usage-tracking-legal-vendor-research-2026-09-14.md` | 14/09/2026; **đang nghiên cứu lại phương pháp** (`QĐ-57d`) |
| **Nghiên cứu tool & vendor (bổ sung sau)** | Bộ thu thập cụ thể, ma trận nhà cung cấp, chiến lược chứng minh, connector; backlog kỹ thuật của giai đoạn Tools — [tool-vendor-usage-research-backlog.md](../Research-AI/tool-vendor-usage-research-backlog.md) | Tách khỏi BRD v3.28 (`QĐ-59a`); chờ logic nghiên cứu GVHD đã sửa (`QĐ-57d`) |
| **Ghi chú thuế khi mua SaaS/phần mềm** | Ba hồ sơ thuế, cơ sở chi phí thực chịu, ví dụ tính, văn bản đã kiểm chứng — `Decisions/tax-saas-purchase-research-2026-10-08.md` | 08/10/2026 — đã đối chiếu văn bản gốc (`OQ-22` đóng, `QĐ-60`) |
| **Báo cáo lệch so với bản đăng ký** | Bốn điểm lệch, căn cứ, mẫu biên bản làm việc với GVHD — [bao-cao-lech-ban-dang-ky-2026-10-08.md](../Decisions/bao-cao-lech-ban-dang-ky-2026-10-08.md) | Soạn 08/10/2026; chờ gặp GVHD (`QĐ-60d`) |
| **WHY · WHAT · WHO** (bản nộp A4) | Bản trình bày rút gọn cho buổi báo cáo — `Requiments/SaaS-Sentry_WHY_WHAT_WHO.docx` | ⚠️ Lỗi thời — làm lại sau khi vẽ lại sơ đồ (`QĐ-59d`) |
| **User Flows nghiệp vụ** | **48** luồng `F-xx` — [business-flow-catalog.md](../Diagrams/user-flows/business-flow-catalog.md) | v0.13 — ⚠️ chưa đồng bộ `QĐ-49` → `QĐ-58` |
| **Bộ sơ đồ nghiệp vụ** | Context, FDD, 5 main flow, 24 workflow, 21 user flow `UF-01` → `UF-21` và truy vết — [Diagrams/index.md](../Diagrams/index.md) | Vẽ lại 08–09/10/2026; đồng bộ `QĐ-61` → `QĐ-66` ngày 10–12/10/2026 (kể cả nhánh thu hồi khi thuê bao hết hạn không gia hạn ở `MF-4`/`WF-15`, `DOI-106`); chờ Owner/GVHD xem |
| **Conceptual ERD** | `ERD/CONCEPTUAL ERD - DANH SÁCH ENTITY.md` — page `Conceptual ERD v5.1`: 21 thực thể, 42 quan hệ, 20 bất biến (hình tổng thể chốt ở `QĐ-65`; nghiệp vụ `QĐ-49` → `QĐ-66`) · [Logical ERD S0](../ERD/logical/LOGICAL-ERD-S0.md) 0.10 | Conceptual đã đồng bộ (11–12/10/2026); ⚠️ **Logical S0 0.10 lỗi thời** — `HO-120` → `HO-135`, thiết kế lại ở phiên sau |
| **Context Diagram** | DFD mức 0 — [context-diagram/index.md](../Diagrams/context-diagram/index.md) | v3.0 — 08/10/2026 |
| **Business Workflows** | Activity diagram có swimlane, `WF-01` → `WF-20` — [index](../Diagrams/workflows-activity-diagram/index.md) | Vẽ lại 08/10/2026; cập nhật tới `QĐ-66` ngày 12/10/2026 (`WF-15` 3.6) |
| **Main Business Flows** | Bộ năm main flow trình bày `MF-2`, `MF-7`, `MF-5`, `MF-8`, `MF-4` — [index](../Diagrams/main-workflows-activity-diagram/index.md) | Vẽ lại 08/10/2026; cập nhật tới `QĐ-66` ngày 12/10/2026 (`MF-4` 3.6) |
| **User Stories** | Story, tiêu chí chấp nhận và truy vết — [user-stories-and-epics.md](../BE-UserStory/user-stories-and-epics.md) | **v0.15** (11–12/10/2026) — 146 mã Story (143 dùng), 1 399 AC; đồng bộ `QĐ-49` → `QĐ-66`, 0 câu `chặn-AC`; **Use Case chưa đồng bộ** (hoãn phiên sau) |
| **Kế hoạch thực hiện** | Lịch 15 tuần, ba cổng review, gói công việc, phân vai | 📁 Ngoài baseline (`QĐ-26`) |
| UI Spec | **Không có bản đặc tả giao diện chi tiết hiện hành.** File `Figma UI-UX/Ui-spec.md` là **Screen Flows v1.0 legacy** (`SA-09`); hoãn có chủ đích sang giai đoạn Figma (`QĐ-08`) | Legacy / hoãn có chủ đích |

**Nguyên tắc phân định BRD và SRS:** BRD dừng ở mức "hệ thống phải đối chiếu được nhiều nguồn bằng chứng với danh mục đã duyệt và tạo hàng đợi xem xét". Cách hiện thực (từ điển, mẫu nhận dạng, mô hình) thuộc về SRS và tài liệu kiến trúc. Một số mục trong tài liệu này (đặc biệt 5.12, 6.2) đi sâu hơn mức BRD thông thường; giữ lại vì chúng ràng buộc phạm vi và cần được thống nhất sớm trong nhóm. Lược đồ bảng chi tiết và bảng chuyển trạng thái đầy đủ sẽ được soạn trong **tài liệu thiết kế kỹ thuật** ở giai đoạn hiện thực.

---

## 12. THUẬT NGỮ NGHIỆP VỤ

Bảng này dành cho người đọc không chuyên kỹ thuật — giảng viên phản biện, thành viên nhóm phụ trách phần khác, hoặc người dùng doanh nghiệp. **Quy ước chung:** trong giao diện và tài liệu nội bộ của dự án (BRD, Định nghĩa Phạm vi, sổ quyết định, đặc tả, giải thích sơ đồ) dùng cột tiếng Việt; trong mã nguồn và cơ sở dữ liệu dùng cột tiếng Anh. Không trộn lẫn hai tầng. **Ngoại lệ:** báo cáo và bài trình bày nộp trường theo mẫu SEP490 viết bằng **tiếng Anh** theo quy định của trường (*SEP490 Student Guide*: tiếng Anh là ngôn ngữ chính thức của mọi tài liệu và buổi trình bày) và dùng cột tiếng Anh của bảng này; chữ trên sơ đồ cũng dùng tiếng Anh. Ngoại lệ không áp cho tài liệu nội bộ.

| Tiếng Việt | Tiếng Anh trong mã | Nghĩa |
| ---------- | ------------------ | ----- |
| Danh mục phần mềm | Catalog Entry | Bản khai báo một phần mềm đã được bộ phận CNTT phê duyệt cho doanh nghiệp dùng: SaaS có trả phí, phần mềm thương mại có bản quyền hoặc phần mềm/dịch vụ nội bộ (`QĐ-49a`). Còn gọi là *danh mục SaaS* |
| Phần mềm/dịch vụ nội bộ | Internal Software | Phần mềm hoặc dịch vụ do công ty tự xây dựng. Quản lý danh mục, Business Owner, quyền sử dụng, chi phí đã ghi nhận; không bắt buộc hợp đồng, hóa đơn hay seat đã mua (`QĐ-49b`) |
| License vĩnh viễn | Perpetual License | Giấy phép mua đứt, không có kỳ gia hạn; không đi qua gia hạn thuê bao (`QĐ-49c`) |
| Gói | Plan | Một bậc giá của một phần mềm, ví dụ Free / Pro / Business |
| Mô hình giá | Pricing model | Cách nhà cung cấp tính tiền: theo đầu người, gói cố định, dùng chung, theo mức tiêu thụ |
| Kiểu cấp | Provisioning Type | Cách cấp/thu hồi của một gói: K1 gói cá nhân, K2 workspace Team/Business, K3 SSO/SCIM, K4 khóa bản quyền, K5 nội bộ (`FR-1.9`) |
| Mức kiểm soát | Control Level | *Đầy đủ* · *Một phần* · *Không kiểm soát được*; phần mềm mới không kiểm soát được bị IT từ chối (`FR-3.19`) |
| Điều khoản nhà cung cấp | Vendor Terms | Điều khoản sử dụng của gói và checklist sáu điểm IT rà soát (`FR-1.10`) |
| Thuê bao | Subscription | Một lần mua cụ thể: gói nào, bao nhiêu chỗ, từ ngày nào tới ngày nào, giá bao nhiêu |
| Hợp đồng | Contract | Văn bản pháp lý, có thể bao nhiều thuê bao và kéo dài nhiều năm |
| Chỗ ngồi / suất dùng | Seat | Quyền cho **một người** dùng một phần mềm. Không phải một bản ghi riêng, mà là một con số đếm được |
| Suất đã mua | Purchased quantity | Số suất ghi trong thuê bao |
| Suất đang dùng | Occupied seats | Số suất hiện đang gán cho người cụ thể |
| Suất trống | Available seats | Đã mua trừ đang dùng. Là **giá trị tính ra**, không lưu trong cơ sở dữ liệu |
| Kho khóa bản quyền | License Key Pool | Các khóa của một khoản mua, lưu mã hóa, mỗi khóa gắn tối đa một quyền đang hiệu lực (`FR-2.10`) |
| Gói team / tài khoản dùng chung | Team Plan / Shared Account | Gói team: nhiều tài khoản riêng trong một workspace, mỗi người một quyền. Tài khoản dùng chung: một bộ đăng nhập cho nhiều người, chỉ khi điều khoản cho phép (`FR-2.11`) |
| Cấp quyền | Assignment | Quyết định của tổ chức cho một người dùng một phần mềm, trong một khoảng thời gian |
| Tác vụ cấp phát | Provisioning Task | Việc **tạo hoặc xóa tài khoản thật** phía nhà cung cấp — khác với quyết định ở trên |
| Thu hồi quyền ≠ tiết kiệm | — | Thu hồi một quyền không tự ghi nhận tiền tiết kiệm; tiết kiệm chỉ ghi khi hợp đồng/khoản chi thực sự giảm theo `FR-4.15` |
| Yêu cầu | Request | Phiếu do nhân viên hoặc trưởng phòng tạo để xin, đổi, gia hạn hay trả lại quyền |
| Yêu cầu theo nhóm | Group Request | Một yêu cầu của trưởng phòng cho nhiều người cùng một gói team; hệ thống tạo một quyền cho mỗi người (`FR-2.11`) |
| Bước phê duyệt | Approval Step | Một mắt xích trong chuỗi duyệt của một yêu cầu |
| Hồ sơ / biểu mẫu | Form (`BM-xx`) | Màn hình nhập liệu có trường bắt buộc ở từng giai đoạn (mục 5.13) |
| Hạn chót báo hủy | Cancellation deadline | Ngày cuối cùng còn kịp báo hủy để không bị gia hạn. **Khác với ngày gia hạn** |
| License ảo / suất lãng phí | Ghost Seat | Suất đã trả tiền nhưng không ai dùng, hoặc dùng không đáng kể |
| Xác nhận của quản lý | Attestation | Quyết định Giữ lại / Thu hồi / Tạm miễn trừ mà trưởng phòng chọn cho một khuyến nghị |
| Cửa sổ dữ liệu bao phủ | Coverage window | Khoảng thời gian mà một file nhật ký thực sự chứa dữ liệu. Ngoài khoảng này **không kết luận được** |
| Ánh xạ danh tính | Identity Resolution | Việc nối một tên tài khoản lạ phía nhà cung cấp về đúng một nhân viên nội bộ |
| Phần mềm ngoài danh mục | Discovery Finding | Bản ghi cần xem xét khi phát hiện một phần mềm chưa nằm trong danh mục. **Không phải kết luận vi phạm** |
| Hợp thức hóa | Legitimization | Quyết định của Người duyệt chi đưa một phần mềm đang được dùng ngoài danh mục vào danh mục (`BM-07`, `FR-3.4c-1`) |
| Phòng ban | Department | Đơn vị tổ chức phẳng dưới công ty; có đúng một trưởng phòng, một Cost Center `Unit`, một IT Admin phụ trách, bộ công cụ chuẩn (`QĐ-52a`) |
| Trưởng phòng | Department Head | Người giữ vai Manager của phòng — vai suy ra, không gán tay; mỗi người làm trưởng tối đa một phòng (`FR-3.3`, `INV-19`) |
| Chức vụ | Position | Thuộc tính nhân sự (Designer, Developer, Kế toán…), dùng cho bộ công cụ chuẩn; **không** cấp quyền |
| Bộ công cụ chuẩn | Standard Toolset | Danh sách gói chuẩn theo phòng × chức vụ, hiện trước khi xin quyền; ngoài bộ chuẩn phải có lý do (`FR-3.18`) |
| Điều chuyển nhân viên | Employee Transfer | Nhân viên **đổi phòng ban**: giữ lịch sử, không thu hồi toàn bộ quyền; công cụ thuộc bộ chuẩn của phòng mới giữ nguyên, công cụ ngoài bộ chuẩn do trưởng phòng mới rà soát trong 5 ngày làm việc; chi phí theo kỳ chia theo ngày (`MF-7`) |
| Đơn vị chịu chi phí | Cost Center | Nơi chi phí được quy về — "túi tiền" Finance đặt ngân sách. Hai loại: `Unit` gắn 1–1 với một phòng ban, `Company` cho công cụ dùng chung toàn công ty và tài khoản dịch vụ (`QĐ-52b`) |
| Chưa phân bổ Cost Center | Unallocated Cost Center line | Dòng báo cáo (không phải một Cost Center) cho phần khoản chi trên sao kê chưa được hóa đơn giải thích và chưa có căn cứ; ngoại lệ vẫn mở qua `MF-6` (`QĐ-50c`) |
| Đối soát | Reconciliation | So sánh dữ liệu hệ thống với dữ liệu phía nhà cung cấp hoặc với hóa đơn để tìm chỗ lệch |
| Sai lệch | Discrepancy | Kết quả của việc đối soát khi hai bên không khớp |
| Nhật ký kiểm toán | Audit Trail | Ghi chép mọi thay đổi: ai làm, khi nào, đổi từ gì sang gì. Chỉ ghi thêm, không sửa không xóa |
| Phân tách trách nhiệm | Separation of Duties | Nguyên tắc: người quyết định nhu cầu, người quyết chi và người thực hiện kỹ thuật là ba vai khác nhau |
| Người duyệt chi | Spending Approver (`SPENDING_APPROVER`) | Người có thẩm quyền chi, quyết định cuối cho khoản chi mới và cho việc đưa phần mềm bên ngoài có trả phí/có bản quyền vào danh mục; duyệt bước nhu cầu khi trưởng phòng tự gửi yêu cầu. Một người, Super Admin cấu hình |
| Ứng dụng mobile | Mobile App | Ứng dụng native cho bốn tác vụ của `QĐ-61b` (yêu cầu của tôi, duyệt nhu cầu, duyệt chi, hộp thông báo); cùng nghiệp vụ và phân quyền với web. **Không** phải bộ thu thập usage trên điện thoại |
| Ý kiến ngân sách | Budget Opinion | Nhận định của Tài chính: trong hạn mức / vượt hạn mức / chưa có ngân sách — khi **trả lời yêu cầu thông tin** của Người duyệt chi, hoặc khi **ghi nhận sau duyệt**. **Không chặn** |
| Snapshot ngân sách | Budget Snapshot | Ngân sách, thực chi, cam kết đang giữ, còn lại và phần đang chờ duyệt của Cost Center tại lúc Người duyệt chi quyết, tính trên chi phí thực chịu; lưu làm bằng chứng |
| Khoản cam kết ngân sách | Budget Commitment | Phần ngân sách đã được duyệt chi nhưng chưa thành hóa đơn, ghi theo chi phí ước tính; tính vào ngân sách đã dùng |
| Chi phí thực chịu | Borne Cost | Giá cộng thuế không được khấu trừ (TNDN nộp thay; GTGT khi không được khấu trừ) cộng phí thẻ/chênh lệch tỷ giá; cơ sở so ngân sách. GTGT được khấu trừ ghi riêng (`FR-5.13`) |
| Hồ sơ thuế | Vendor Tax Profile | Chia theo ai nộp thuế: T1 trong nước (hóa đơn Việt Nam) · T2 nước ngoài, doanh nghiệp khấu trừ nộp thay (mặc định) · T3 nước ngoài, thuế đã thu trên chứng từ (ngoại lệ); kèm tỷ lệ ước tính và cờ được khấu trừ; hệ thống ghi nhận, không tính thuế (`FR-5.13`) |
| Bộ thu thập | Collector | Phần mềm của hệ thống chạy trên thiết bị công ty, gửi dữ liệu sử dụng đã lọc tại nguồn: tiện ích trình duyệt, agent |
| Danh sách cho phép | Allowlist | Tên miền và tên tiến trình mà bộ thu thập được quan sát. Lấy từ danh mục SaaS và từ điển nhà cung cấp, trừ ứng dụng liên lạc |
| Xác nhận chủ động | Monitoring Acknowledgment | Việc nhân viên ký văn bản *xác nhận đã biết rõ* khi nhận máy và bấm xác nhận trong hệ thống. Chưa có thì hệ thống không nhận dữ liệu từ thiết bị (`FR-4.18`, `FR-4.21`) |
| Ranh giới ngữ cảnh | Bounded Context | Một vùng nghiệp vụ có bộ thuật ngữ và quy tắc riêng — xem mục 5.12.1 |
| Bất biến | Invariant | Quy tắc luôn phải đúng ở tầng dữ liệu, bất kể thao tác nào vừa xảy ra — xem mục 5.12.2 |

---

## PHỤ LỤC C — Đối chiếu với bản đăng ký đồ án

**Vì sao cần phụ lục này:** bản đăng ký `SU26SE166_SOFTWARE_LISENSE_MANAGEMENT_HUONGNTC2` (lưu ở `Requiments/Origins/`) đã nộp và có chữ ký giảng viên hướng dẫn — nó là **ràng buộc gốc**. Bảng dưới nói rõ chỗ nào mở rộng, chỗ nào thu hẹp, và vì sao, để hội đồng đọc hai tài liệu không thấy khác nhau mà không biết là có chủ đích.

### C.0. Các điểm LỆCH cần báo GVHD và ghi biên bản (`QĐ-60d`)

**Lệch** khác **bổ sung**: lệch là chỗ BRD làm **khác** điều bản đăng ký đã viết. Bổ sung là phần bản đăng ký **chưa nhắc**, ví dụ văn bản ký khi nhận máy hay sổ thiết bị — các phần này đi kèm bộ thu thập, **không** phải điểm lệch riêng. Báo cáo gửi GVHD và mẫu biên bản: [bao-cao-lech-ban-dang-ky-2026-10-08.md](../Decisions/bao-cao-lech-ban-dang-ky-2026-10-08.md).

| # | Bản đăng ký ghi | BRD hiện hành | Quyết định | Trạng thái |
| - | --------------- | ------------- | ---------- | ---------- |
| L-1 | *"Triển khai CASB/endpoint agent riêng nằm ngoài phạm vi MVP"* (dòng 86) | Có **bộ thu thập trên máy công ty** làm nguồn bằng chứng sử dụng; loại cụ thể (tiện ích trình duyệt, agent, OTel) và mức hiện thực chốt lại ở giai đoạn Tools | `QĐ-20`, `QĐ-31b`, `QĐ-59a` | Lệch về **giải pháp thu dữ liệu**; mức lệch cuối cùng phụ thuộc giai đoạn Tools |
| L-2 | *"OAuth 2.0/OpenID Connect … multi-factor authentication thông qua identity provider"*; *"OIDC/JWT/RBAC"* (dòng 83, 117) | **Xác thực nội bộ** do backend quản lý — email/mật khẩu, lời mời dùng một lần; OAuth/OIDC chỉ còn dùng đọc dữ liệu discovery | `QĐ-46`, `QĐ-47` | Lệch về **công nghệ đăng nhập**; Owner cho biết mentor đồng ý, GVHD chưa xác nhận |
| L-3 | *"Tài chính: phê duyệt chi tiêu công nghệ … phê duyệt yêu cầu cần seat bổ sung, gói giá cao hơn, mua SaaS mới"* (dòng 58–62, 121) | **Người duyệt chi** (mặc định CEO) quyết khoản chi; Finance **kiểm soát ngân sách**, không nằm trên đường duyệt | `QĐ-22`, `QĐ-29b` | Lệch về **ai phê duyệt chi** — theo góp ý mentor về thực tế doanh nghiệp |
| L-4 | *"Department, Team, Cost Center, Direct Manager"* (dòng 104, 116) | Công ty → **Phòng ban** → Chức vụ → Nhân viên; **bỏ Team**; Manager là trưởng phòng | `QĐ-52` | Lệch nhỏ — thu hẹp, theo góp ý Review 1 của hội đồng |
| L-5 | *"Ứng dụng di động … nằm ngoài phạm vi MVP"*; *"Ứng dụng web responsive … Ứng dụng di động nằm ngoài phạm vi MVP"* (dòng 86, 101) | Có **ứng dụng mobile native** cho bốn tác vụ (yêu cầu của tôi, duyệt nhu cầu, duyệt chi, hộp thông báo); không push, không offline | `QĐ-61a`–`QĐ-61d` | Lệch — **mở rộng** phạm vi theo quyết định Owner 09/10/2026 |
| L-6 | *"AI/ML tùy chọn … phân loại mô tả giao dịch … hỏi đáp hợp đồng … kèm trích dẫn"* (dòng 75, 97, 127) | AI cam kết là **hai** tính năng khác: Manager tóm tắt request đang chờ, Finance bản nháp diễn giải báo cáo chi phí (`QĐ-49e`); phân loại giao dịch (`US-15-01`) chưa qua cổng chất lượng, đang ẩn; hỏi đáp hợp đồng (RAG) hoãn | `QĐ-49e`, `QĐ-61e`, `QĐ-37` | Lệch về **tính năng AI**; vẫn giữ nguyên tắc AI chỉ hỗ trợ của bản đăng ký |

### C.1. Những điểm BRD đã BỔ SUNG so với bản đăng ký

Bổ sung không phải vấn đề, nhưng nên chủ động trình bày là *kết quả phân tích sâu hơn và góp ý sau các buổi review*, không phải phát sinh ngoài kế hoạch.

| # | Bản đăng ký | BRD hiện tại | Lý do bổ sung |
| - | ----------- | ------------ | ------------- |
| 1 | 4 vai trò người dùng | **6 vai trò** — thêm Super Admin và **Người duyệt chi** | Không tách quản trị hệ thống khỏi quản trị nghiệp vụ thì SoD-1 không tồn tại. Theo góp ý mentor, kế toán không có thẩm quyền quyết chi |
| 2 | Không nhắc tiền tệ | Đa tiền tệ là yêu cầu lõi (FR-1.6, ADR-03) | Doanh nghiệp Việt Nam mua SaaS bằng ngoại tệ, báo cáo bằng VND |
| 3 | Không nhắc hạn báo hủy | Cảnh báo tính theo hạn chót báo hủy (FR-1.4) | Cảnh báo theo ngày gia hạn là cảnh báo vô dụng — đúng vào PP-2 |
| 4 | Không có chỉ số thành công | 5 chỉ số KPI-1 → KPI-5 (mục 2.4) | Mô tả hệ thống làm gì mà không định nghĩa thế nào là thành công |
| 5 | Không có luồng khởi tạo dữ liệu | Phân hệ Khởi tạo dữ liệu ban đầu (mục 5.9, FR-9.x) | Không trả lời được "ngày đầu triển khai phải làm gì" |
| 6 | Không nhắc quyền chủ thể dữ liệu | Phân hệ Quyền của chủ thể dữ liệu (mục 5.11, FR-10.x) | Khung pháp lý mới có hiệu lực sau khi đăng ký |
| 7 | Không nhắc cổng kiểm chứng dự báo | Cổng kiểm chứng sai số (FR-5.7, ADR-09) | Là cách hiện thực đúng điều kiện mà bản đăng ký đã đặt ra |
| 8 | Không nhắc mô hình miền nghiệp vụ | Tám ranh giới, hai mươi bất biến, chín máy trạng thái (mục 5.12) | Cần thiết để chia module và đặt ràng buộc toàn vẹn đúng chỗ |
| 9 | **Ghi "triển khai CASB/endpoint agent riêng nằm ngoài phạm vi MVP"** | **Tiện ích trình duyệt trên thiết bị công ty thuộc phạm vi** (`FR-4.17`); agent phiên người dùng **mức demo** (`FR-4.19`) | `QĐ-20`, `QĐ-31b`. **Đây là LỆCH so với bản đăng ký**, không chỉ là bổ sung. Làm theo góp ý của GVHD sau buổi review; nhóm **báo lại GVHD và ghi biên bản**. CASB vẫn ngoài phạm vi |
| 10 | Không nhắc ngân sách cam kết | Khoản cam kết ngân sách, ý kiến ngân sách, Người duyệt chi (5.3, 5.5.2) | `QĐ-22` — theo góp ý mentor về quy trình mua trong doanh nghiệp thật |
| 11 | Không định nghĩa cơ cấu tổ chức, hồ sơ, cách cấp và thuế | Tổ chức theo phòng ban, ma trận trách nhiệm, biểu mẫu `BM-01` → `BM-08`, kiểu cấp và kho khóa, tài khoản dùng chung, điều khoản nhà cung cấp, ghi nhận thuế, dashboard và cảnh báo (mục 3–5) | `QĐ-52` → `QĐ-58` — theo góp ý Review 1 của hội đồng |

### C.2. Những điểm BRD đã THU HẸP so với bản đăng ký

Đây là phần cần chuẩn bị câu trả lời kỹ nhất, vì nó là cắt bớt so với cam kết.

| # | Bản đăng ký | BRD hiện tại | Lý do, và ở đâu trong BRD |
| - | ----------- | ------------ | ------------------------- |
| 1 | Network/CASB log "hỗ trợ khi có" | **Ngoài phạm vi hiện thực**, chỉ giữ đặc tả thiết kế | Ba lý do tại mục 5.6.1: vướng khung pháp lý, không có hạ tầng kiểm chứng, giá trị không tương xứng rủi ro. Ràng buộc RB-5 |
| 2 | Không nêu G5 (hạ gói theo mức dùng) nhưng hàm ý phân tích usage đầy đủ | **Ngoài phạm vi** (mục 5.4.1) | Nguồn export không cung cấp dữ liệu chi tiết theo loại thao tác. Ràng buộc RB-3 |
| 3 | *"Hồi quy hoặc mô hình chuỗi thời gian chỉ được dùng khi dữ liệu lịch sử đủ và có đánh giá sai số"* | **Hoãn** — đặc tả giữ nguyên, không hiện thực trong MVP (`FR-5.7`) | `QĐ-25`: demo không có ≥ 12 tháng dữ liệu thật; ưu tiên thời gian cho bộ thu thập và luồng duyệt chi. Ràng buộc RB-1 |

### C.3. Điểm được GIỮ nhưng đổi cách phát biểu

| Bản đăng ký | BRD hiện tại | Nhận xét |
| ----------- | ------------ | -------- |
| *"Hồi quy hoặc mô hình chuỗi thời gian **chỉ được dùng khi** dữ liệu lịch sử đủ và có đánh giá sai số"* | Dự báo ba lớp, lớp biến động có cổng kiểm chứng (FR-5.5, FR-5.7) | Bản đăng ký vốn là **câu điều kiện**, không phải lời hứa. BRD hiện thực chính điều kiện đó — trung thành hơn là loại bỏ hoàn toàn |
| Ngưỡng phát hiện "30/60 ngày" | Ba tầng 30–59 / ≥60 / ≥90, cấu hình được (FR-4.12) | Tinh chỉnh, không phải thay đổi bản chất |
| *"SaaS-Sentry là **nền tảng** web tập trung"* | **Hệ thống** quản trị nội bộ doanh nghiệp (mục 1) | Bản đăng ký dùng từ "nền tảng" một lần ở phần Giải pháp, mâu thuẫn với chính tiêu đề "System / Hệ thống" của nó. BRD chốt theo tiêu đề |

### C.4. Lệch nhỏ cần thống nhất

| Hạng mục | Bản đăng ký | BRD hiện hành | Đề xuất |
| -------- | ----------- | ------------- | ------- |
| Thời gian thực hiện | 01/01/2026 → 30/04/2026 | Học kỳ 15 tuần; cửa sổ phát triển T1–T9 (`RB-1`), hội đồng lần 1 ở T12 | Việc hành chính, không ghi vào tài liệu kỹ thuật (`QĐ-07`). Tài liệu dùng số tuần T1–T15; bản đăng ký giữ nguyên làm lịch sử; chênh lệch mốc do GVHD phân xử. Lịch chính thức chờ kế hoạch do GVHD giao (`QĐ-26`) |

### C.5. Cách trình bày khi bảo vệ

1. **Về phần bổ sung:** *"Sau khi phân tích nghiệp vụ sâu hơn và nhận góp ý ở các buổi review — gần nhất là Review 1 của hội đồng — nhóm bổ sung các hạng mục mà bản đăng ký chưa nêu. Tất cả đều nằm trong cùng phạm vi bài toán, không mở rộng sang lĩnh vực mới. Riêng tiện ích trình duyệt là điểm lệch so với bản đăng ký, được làm theo góp ý của GVHD."*
2. **Về phần thu hẹp:** *"Các hạng mục được chủ động đưa ra ngoài phạm vi hoặc hoãn đều có lý do kỹ thuật hoặc pháp lý cụ thể được ghi trong BRD, kèm hướng phát triển tiếp. Đây là quyết định phạm vi có căn cứ, không phải phần chưa kịp làm."*
3. **Về phần dự báo:** *"Bản đăng ký đặt điều kiện cho việc dùng mô hình thống kê. Nhóm giữ nguyên điều kiện đó dưới dạng đặc tả cổng kiểm chứng; lớp dự báo bằng mô hình được hoãn vì demo chưa có đủ 12 tháng dữ liệu thật để cổng kiểm chứng có ý nghĩa."*

---

## PHỤ LỤC D — Mẫu văn bản minh bạch dữ liệu (`ND-3`, `QĐ-60e`)

*Bản nháp do trợ lý soạn ngày 08/10/2026, chờ nhóm review. Đây là **mẫu cho doanh nghiệp triển khai**, không phải tư vấn pháp lý. Phần ghi* `{…}` *là chỗ điền. Câu chữ dùng* **xác nhận đã biết rõ**, *không dùng* **đồng ý** *(`QĐ-58f`, `OQ-16`, `OQ-23`). Mục "dữ liệu được thu" của D.2 viết theo danh sách cho phép; sửa lại khi giai đoạn Tools chốt loại bộ thu thập (`QĐ-59a`).*

### D.1. Thông báo theo dõi mức độ sử dụng ứng dụng (`FR-10.4`)

Gửi trong ứng dụng, kèm thư điện tử, **trước** khi bắt đầu thu dữ liệu sử dụng của một ứng dụng (`OI-09b`).

> **Tiêu đề:** Thông báo theo dõi mức độ sử dụng {Tên ứng dụng}
>
> Chào {Họ tên},
>
> Từ ngày {dd/mm/yyyy}, {Tên công ty} bắt đầu theo dõi **mức độ sử dụng** {Tên ứng dụng} — ứng dụng bạn đang được cấp quyền.
>
> 1. **Mục đích:** chỉ để phát hiện quyền sử dụng phần mềm không còn dùng, giúp công ty giảm chi phí bản quyền. Dữ liệu **không** dùng để đánh giá năng suất hay xử lý kỷ luật.
> 2. **Dữ liệu được thu:** ngày hoạt động gần nhất và số ngày có hoạt động trên {Tên ứng dụng}, theo báo cáo của nhà cung cấp {và/hoặc bộ thu thập trên máy công ty — nếu có}.
> 3. **Không thu:** nội dung bạn tạo hay trao đổi, tin nhắn, tệp, URL, ảnh màn hình, địa chỉ IP.
> 4. **Ai xem được:** bạn; IT Admin (màn hình ẩn họ tên); trưởng phòng của bạn chỉ thấy *có* hoặc *không* hoạt động.
> 5. **Lưu giữ:** 6 tháng, hoặc 30 ngày sau ngày làm việc cuối của bạn — mốc nào đến trước. Sau đó chỉ còn số liệu tổng hợp không gắn với tên người.
> 6. **Quyền của bạn:** xem và xuất dữ liệu của mình, yêu cầu sửa dữ liệu sai (xử lý trong 10 ngày), tại {đường dẫn trang Dữ liệu của tôi}. Người phụ trách: {IT Admin / email}.
>
> Nếu dữ liệu cho thấy bạn không dùng {Tên ứng dụng} trong thời gian dài, trưởng phòng sẽ được hỏi có giữ quyền hay không. Không có quyền nào bị thu hồi tự động chỉ dựa trên dữ liệu này.

### D.2. Văn bản xác nhận đã biết rõ chính sách thiết bị và theo dõi trên máy công ty (`BM-06`)

Ký khi bàn giao máy công ty (`FR-4.21`); IT Admin lưu bản ký. Nhân viên xác nhận lại trong hệ thống trước khi máy được gửi dữ liệu (`FR-4.18`, `INV-17`).

> **{TÊN CÔNG TY}**
> **VĂN BẢN XÁC NHẬN ĐÃ BIẾT RÕ CHÍNH SÁCH SỬ DỤNG THIẾT BỊ VÀ THEO DÕI MỨC ĐỘ SỬ DỤNG PHẦN MỀM TRÊN MÁY CÔNG TY**
> Phiên bản chính sách: {vX.Y} · Ngày hiệu lực: {dd/mm/yyyy}
>
> **Bên giao:** {Tên công ty} — người đại diện bàn giao: {Họ tên IT Admin}
> **Người nhận:** {Họ tên} · Mã nhân viên: {…} · Phòng ban: {…}
> **Thiết bị:** Mã tài sản {…} · Tên máy {…} · Hệ điều hành {…} · Ngày bàn giao {dd/mm/yyyy}
>
> **1. Sử dụng thiết bị.** Dịch vụ và phần mềm công ty cấp cho tôi chỉ được dùng trên **thiết bị công ty cấp**. Công ty không cài phần mềm theo dõi và không thu dữ liệu trên máy cá nhân của tôi. Việc dùng sai quy định được xử lý theo nội quy lao động của công ty.
>
> **2. Dữ liệu được thu trên máy này.** Chỉ với các ứng dụng và trang web **của công ty có trong danh sách cho phép** (danh sách xem tại {đường dẫn}): tên ứng dụng hoặc tên miền, ngày, và **số phút sử dụng làm tròn theo ngày**. Công ty cũng ghi nhận ngày bộ thu thập có hoạt động.
>
> **3. Dữ liệu không bao giờ thu.** Nội dung trang và tài liệu, URL đầy đủ, tiêu đề cửa sổ, phím bấm, ảnh màn hình, vị trí, địa chỉ IP; ứng dụng nhắn tin và họp trực tuyến; mọi ứng dụng hay trang web ngoài danh sách cho phép. Việc lọc được thực hiện **ngay trên máy**.
>
> **4. Mục đích.** Chỉ để quản lý và tối ưu chi phí bản quyền phần mềm. **Không** dùng để chấm năng suất, xếp hạng hay xử lý kỷ luật.
>
> **5. Ai xem được và lưu bao lâu.** Tôi; IT Admin; trưởng phòng chỉ thấy *có* hoặc *không* hoạt động. Dữ liệu lưu 6 tháng, hoặc 30 ngày sau ngày làm việc cuối của tôi — mốc nào đến trước. Văn bản này được giữ cùng thời hạn với dữ liệu nó làm căn cứ.
>
> **6. Quyền của tôi.** Xem, xuất, yêu cầu sửa dữ liệu của mình; **yêu cầu dừng thu thập** trên thiết bị này — yêu cầu hợp lệ được thực hiện trong 2 ngày làm việc. Hệ quả của việc dừng đối với công việc theo nội quy lao động: {…}. Người phụ trách: {IT Admin / email}.
>
> **7. Căn cứ.** Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15, Điều 25 khoản 3 — biện pháp công nghệ quản lý người lao động được áp dụng *trên cơ sở người lao động biết rõ biện pháp đó*; nội quy lao động của công ty, mục {…}.
>
> **Tôi xác nhận đã được giải thích và biết rõ các nội dung trên.**
>
> Người nhận thiết bị (ký, ghi rõ họ tên): ……………… · Ngày: ……
> Đại diện công ty (ký, ghi rõ họ tên): ……………… · Ngày: ……
