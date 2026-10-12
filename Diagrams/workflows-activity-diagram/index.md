# Business Workflows — workflow chi tiết

> **Phiên bản:** 1.4 — 12/10/2026 · **Căn cứ:** BRD v3.35, sổ quyết định `QĐ-01` → `QĐ-66` · Quyết định thể hiện là của Owner, **chưa** phải xác nhận của GVHD/hội đồng.
>
> Tệp **sinh tự động** bằng `python tools/build_index.py` từ `specs/catalog.json` và `specs/WF-*.json` — không sửa tay. Mỗi workflow có `.drawio` (sửa được), `.drawio.png` (nhúng nguồn) và `.md` giải thích 12 mục.

Workflow là cấp chi tiết của main flow: đủ điều kiện, kiểm quyền, ngoại lệ; mọi nhánh kết thúc ở một điểm cuối có ý nghĩa. Ký pháp UML Activity, xem [tools/README.md](../tools/README.md). Bộ sơ đồ toàn dự án: [index chung](../index.md).

## 1. MF-2 — Access Request, Approval & Provisioning (main flow)

| Mã | Tên | Vai trò | Mục đích | Gọi / liên quan | Tệp |
| --- | --- | --- | --- | --- | --- |
| **WF-04** | New Employee Onboarding | hỗ trợ | Mô tả cách một nhân viên mới vào hệ thống với đúng phòng ban và chức vụ, rồi được trưởng phòng xin sẵn bộ công cụ chuẩn của vị trí đó. | `MF-2`, `UF-21`, `WF-01`, `WF-02`, `WF-08`, `WF-09` | [PNG](WF-04-new-employee-onboarding.drawio.png) · [.drawio](WF-04-new-employee-onboarding.drawio) · [giải thích](WF-04-new-employee-onboarding.md) |
| **WF-09** | Access Request Routing & Approval | chi tiết | Chi tiết định tuyến và phê duyệt của một yêu cầu cấp quyền: ai giữ từng bước, khi nào cần Người duyệt chi, xử lý quá hạn, hết người duyệt hợp lệ, xác định lại người duyệt khi dữ liệu đổi, rút yêu cầu và hết seat lúc thực hiện — tất cả không dùng ủy quyền. | `MF-2`, `UF-01`, `UF-02`, `UF-04`, `UF-08`, `UF-11`, `UF-15`, `WF-04`, `WF-09a`, `WF-10`, `WF-11` | [PNG](WF-09-access-request-routing-approval.drawio.png) · [.drawio](WF-09-access-request-routing-approval.drawio) · [giải thích](WF-09-access-request-routing-approval.md) |
| **WF-09a** | Provisioning & Reclaim Execution | luồng con dùng chung | Mô tả phần thực thi kỹ thuật dùng chung cho mọi luồng cấp và thu hồi quyền: tách ý định nghiệp vụ (Assignment) khỏi việc tạo/xóa tài khoản thật (Provisioning Task), hỏi xác nhận bàn giao bản nhẹ trước khi gỡ gói có lưu ý mất dữ liệu, chọn kênh Connector hay Manual theo kiểu cấp của gói, thử lại khi lỗi tạm thời, để IT Admin chọn thử lại / làm tay / đóng thất bại khi tác vụ lỗi, và theo dõi lời mời đang chờ chấp nhận tới khi vào hoặc bị thu lại — không bao giờ giả thành công. | `MF-2`, `MF-4`, `MF-5`, `MF-7`, `UF-08`, `WF-05`, `WF-07`, `WF-08`, `WF-09`, `WF-11`, `WF-13`, `WF-15`, `WF-16`, `WF-17` | [PNG](WF-09a-provisioning-reclaim-execution.drawio.png) · [.drawio](WF-09a-provisioning-reclaim-execution.drawio) · [giải thích](WF-09a-provisioning-reclaim-execution.md) |
| **WF-10** | New Software Assessment | luồng con dùng chung | Mô tả bước IT Admin đánh giá phần mềm chưa có trong danh mục trước khi tới Người duyệt chi: phân loại đối tượng (miễn phí bên ngoài / nội bộ / trả phí–có bản quyền), cổng mức kiểm soát, chính sách chia sẻ tài khoản, và ý kiến không chặn của Business Owner khi dữ liệu nhạy cảm. | `MF-2`, `UF-02`, `WF-09`, `WF-17` | [PNG](WF-10-new-software-assessment.drawio.png) · [.drawio](WF-10-new-software-assessment.drawio) · [giải thích](WF-10-new-software-assessment.md) |
| **WF-11** | Access Return & Time-Bound Extension | hỗ trợ | Mô tả hai việc quanh một quyền đang có: (1) hoàn trả — Employee tự trả hoặc trưởng phòng xác nhận không còn cần, IT Admin thu hồi và seat quay về kho; (2) gia hạn quyền có thời hạn — hệ thống nhắc trước 7 ngày, Employee gửi yêu cầu gia hạn và yêu cầu này đi qua phê duyệt thông thường. | `MF-2`, `UF-01`, `UF-08`, `WF-08`, `WF-09`, `WF-09a` | [PNG](WF-11-access-return-time-bound-extension.drawio.png) · [.drawio](WF-11-access-return-time-bound-extension.drawio) · [giải thích](WF-11-access-return-time-bound-extension.md) |

## 2. MF-7 — Department Transfer & Access Adjustment (main flow)

| Mã | Tên | Vai trò | Mục đích | Gọi / liên quan | Tệp |
| --- | --- | --- | --- | --- | --- |
| **WF-05** | Department Transfer & Tool Review | chi tiết | Chi tiết hóa `MF-7`: nhân viên chuyển phòng ban mà không mất lịch sử, chi phí sang phòng mới đúng ngày, tài khoản dùng chung có người chịu trách nhiệm mới, và trưởng phòng mới quyết những công cụ nằm ngoài bộ chuẩn. | `MF-2`, `MF-7`, `MF-8`, `UF-18`, `WF-07`, `WF-09a`, `WF-19` | [PNG](WF-05-department-transfer-tool-review.drawio.png) · [.drawio](WF-05-department-transfer-tool-review.drawio) · [giải thích](WF-05-department-transfer-tool-review.md) |

## 3. MF-5 — Offboarding & Access Reclaim (main flow)

| Mã | Tên | Vai trò | Mục đích | Gọi / liên quan | Tệp |
| --- | --- | --- | --- | --- | --- |
| **WF-07** | Offboarding Handover & Full Access Reclaim | chi tiết | Chi tiết hóa `MF-5`: thu hồi toàn bộ quyền khi nhân viên nghỉ việc mà không làm mất dữ liệu công ty và không để lại lỗ hổng truy cập. | `MF-5`, `UF-09`, `WF-03`, `WF-06`, `WF-08`, `WF-09a`, `WF-13` | [PNG](WF-07-offboarding-handover-full-access-reclaim.drawio.png) · [.drawio](WF-07-offboarding-handover-full-access-reclaim.drawio) · [giải thích](WF-07-offboarding-handover-full-access-reclaim.md) |

## 4. MF-8 — Period Software Cost Control & Allocation (main flow)

| Mã | Tên | Vai trò | Mục đích | Gọi / liên quan | Tệp |
| --- | --- | --- | --- | --- | --- |
| **WF-16** | Invoice & Vendor Reconciliation | chi tiết | Đối soát hai nguồn sự thật: dữ liệu nhà cung cấp (thực tế) với dữ liệu nội bộ đã qua phê duyệt (ý định). | `MF-8`, `UF-14`, `UF-19`, `WF-09a`, `WF-17`, `WF-19` | [PNG](WF-16-invoice-vendor-reconciliation.drawio.png) · [.drawio](WF-16-invoice-vendor-reconciliation.drawio) · [giải thích](WF-16-invoice-vendor-reconciliation.md) |
| **WF-17** | Spend Reconciliation & Out-of-Catalog Legitimization | luồng con dùng chung | Đối soát từng khoản chi trên sao kê/thẻ với hóa đơn đã ghi nhận và căn cứ phê duyệt, để người có thẩm quyền kiểm tra khoản chi chưa có căn cứ, và đưa phần mềm trả phí ngoài danh mục qua quyết định hợp thức hóa của Người duyệt chi. | `MF-8`, `UF-12`, `UF-15`, `WF-09`, `WF-09a`, `WF-16`, `WF-17a`, `WF-19` | [PNG](WF-17-spend-reconciliation-out-of-catalog-legitimization.drawio.png) · [.drawio](WF-17-spend-reconciliation-out-of-catalog-legitimization.drawio) · [giải thích](WF-17-spend-reconciliation-out-of-catalog-legitimization.md) |
| **WF-17a** | Vendor Normalization & Confidence Scoring | luồng con dùng chung | Chuẩn hóa mô tả giao dịch thô trên sao kê thành một dòng dịch vụ của nhà cung cấp, gán mức tin cậy suy ra từ phương pháp khớp (không lấy điểm số model tự khai) và đưa ca mơ hồ vào hàng đợi review do IT Admin xác nhận. | `MF-8`, `UF-12`, `WF-17` | [PNG](WF-17a-vendor-normalization-confidence-scoring.drawio.png) · [.drawio](WF-17a-vendor-normalization-confidence-scoring.drawio) · [giải thích](WF-17a-vendor-normalization-confidence-scoring.md) |
| **WF-19** | Period Cost Allocation & Budget Reporting | chi tiết | Khép chi phí của một kỳ ở mức chi tiết: chuyển khoản cam kết đã khớp thành chi phí, quy mọi khoản chi phí về đúng Cost Center theo quy tắc, dựng hai cơ sở ghi nhận, cập nhật Budget vs Actual trên chi phí thực chịu, dự báo và phát hành báo cáo theo đúng phạm vi xem của từng vai. | `MF-2`, `MF-7`, `MF-8`, `UF-11`, `UF-19`, `WF-16`, `WF-17`, `WF-20` | [PNG](WF-19-period-cost-allocation-budget-reporting.drawio.png) · [.drawio](WF-19-period-cost-allocation-budget-reporting.drawio) · [giải thích](WF-19-period-cost-allocation-budget-reporting.md) |
| **WF-20** | Budget Planning & Commitment Back-fill | hỗ trợ | Mô tả việc lập ngân sách theo Cost Center và kỳ và hai hệ quả bắt buộc: khoản cam kết tạo trước khi có ngân sách được gắn ngược khi ngân sách ra đời (số còn lại được phép âm, không bị che), và hàng đợi ghi nhận của Finance sau mỗi quyết định chi. | `MF-2`, `MF-8`, `UF-11`, `UF-19`, `WF-03`, `WF-09`, `WF-19` | [PNG](WF-20-budget-planning-commitment-backfill.drawio.png) · [.drawio](WF-20-budget-planning-commitment-backfill.drawio) · [giải thích](WF-20-budget-planning-commitment-backfill.md) |

## 5. MF-4 — Subscription Renewal, Reduction or Cancellation (main flow)

| Mã | Tên | Vai trò | Mục đích | Gọi / liên quan | Tệp |
| --- | --- | --- | --- | --- | --- |
| **WF-15** | Renewal Decision Cycle | chi tiết | Chi tiết hóa `MF-4`: từ lúc hệ thống cảnh báo theo hạn chót báo hủy tới khi Người duyệt chi quyết gia hạn, giảm số lượng hoặc hủy và IT thực hiện — hoặc, nếu quá hạn chót mà không có quyết định, ghi nhận đúng kết cục (sự cố KPI-4 khi tự gia hạn, đánh dấu hết hạn cuối kỳ và mở tác vụ thu hồi như hủy toàn bộ khi không tự gia hạn). | `MF-4`, `UF-11`, `UF-15`, `UF-20`, `WF-02`, `WF-09a`, `WF-13` | [PNG](WF-15-renewal-decision-cycle.drawio.png) · [.drawio](WF-15-renewal-decision-cycle.drawio) · [giải thích](WF-15-renewal-decision-cycle.md) |

## 6. SF-1 — Organization, catalog and initial data setup (nhóm hỗ trợ)

| Mã | Tên | Vai trò | Mục đích | Gọi / liên quan | Tệp |
| --- | --- | --- | --- | --- | --- |
| **WF-01** | Organization & Initial Data Setup | hỗ trợ | Đưa một tổ chức từ chưa có dữ liệu tới có đủ nền để mọi luồng khác chạy được, theo đúng năm bước có thứ tự phụ thuộc: phòng ban và nhân sự → danh mục → hợp đồng/thuê bao (cảnh báo gia hạn bắt đầu) → hiện trạng seat (có G1/G2 ngay) → log sử dụng (tùy chọn). | `SF-1`, `WF-02`, `WF-03`, `WF-12`, `WF-15` | [PNG](WF-01-organization-initial-data-setup.drawio.png) · [.drawio](WF-01-organization-initial-data-setup.drawio) · [giải thích](WF-01-organization-initial-data-setup.md) |
| **WF-02** | Catalog, Plan & Subscription Setup | hỗ trợ | Đưa một phần mềm vào danh mục quản lý với đủ dữ liệu để các luồng sau chạy: Business Owner đang làm việc, gói có kiểu cấp và điều khoản, thuê bao có hạn chót báo hủy (để cảnh báo gia hạn) hoặc khoản mua vĩnh viễn không có kỳ; hồ sơ thuế của nhà cung cấp do Finance giữ. | `SF-1`, `UF-20`, `WF-01`, `WF-09a`, `WF-10`, `WF-15`, `WF-17` | [PNG](WF-02-catalog-plan-subscription-setup.drawio.png) · [.drawio](WF-02-catalog-plan-subscription-setup.drawio) · [giải thích](WF-02-catalog-plan-subscription-setup.md) |

## 7. SF-2 — System administration and audit (nhóm hỗ trợ)

| Mã | Tên | Vai trò | Mục đích | Gọi / liên quan | Tệp |
| --- | --- | --- | --- | --- | --- |
| **WF-03** | Account, Role & Configuration Administration | hỗ trợ | Mô tả cách Super Admin quản lý tài khoản, vai trò và tham số hệ thống mà vẫn không có đường vượt SoD: tài khoản chỉ tạo từ hồ sơ nhân viên và kích hoạt qua lời mời dùng một lần (người dùng tự đặt mật khẩu), mọi thay đổi qua cổng quy tắc và ghi Audit Trail chỉ-ghi-thêm, cấu hình không phải phê duyệt. | `SF-2`, `UF-13`, `UF-17`, `WF-01`, `WF-09`, `WF-15` | [PNG](WF-03-account-role-configuration-administration.drawio.png) · [.drawio](WF-03-account-role-configuration-administration.drawio) · [giải thích](WF-03-account-role-configuration-administration.md) |

## 8. SF-3 — Other workforce lifecycle events (nhóm hỗ trợ)

| Mã | Tên | Vai trò | Mục đích | Gọi / liên quan | Tệp |
| --- | --- | --- | --- | --- | --- |
| **WF-06** | Extended Leave & Return | hỗ trợ | Mô tả việc ghi nhận nghỉ dài và quay lại để hệ thống không sinh khuyến nghị thu hồi sai cho người đang nghỉ phép dài. | `SF-3`, `WF-07`, `WF-13a` | [PNG](WF-06-extended-leave-return.drawio.png) · [.drawio](WF-06-extended-leave-return.drawio) · [giải thích](WF-06-extended-leave-return.md) |
| **WF-08** | Fixed-Term Access Expiry | hỗ trợ | Bảo đảm quyền của nhà thầu, freelancer, thực tập sinh không tồn tại quá ngày kết thúc dự kiến mà không ai xử lý: nhắc trước 7 ngày, đưa vào hàng đợi khi tới hạn, rồi hoặc gia hạn qua yêu cầu có duyệt, hoặc thu hồi. | `SF-3`, `WF-07`, `WF-09a`, `WF-11` | [PNG](WF-08-fixed-term-access-expiry.drawio.png) · [.drawio](WF-08-fixed-term-access-expiry.drawio) · [giải thích](WF-08-fixed-term-access-expiry.md) |

## 9. SF-4 — Usage evidence and ghost-seat optimization (nhóm hỗ trợ)

| Mã | Tên | Vai trò | Mục đích | Gọi / liên quan | Tệp |
| --- | --- | --- | --- | --- | --- |
| **WF-12** | Usage Evidence Import | hỗ trợ | Mô tả cách đưa bằng chứng sử dụng vào hệ thống một cách có kiểm soát: mỗi nguồn có mẫu cấu hình, cửa sổ bao phủ, định nghĩa hoạt động và ma trận năng lực, để các bước sau biết nguồn này đủ sức kết luận nhóm lãng phí nào. | `MF-3`, `SF-4`, `UF-06`, `UF-07`, `WF-12a`, `WF-13`, `WF-18` | [PNG](WF-12-usage-evidence-import.drawio.png) · [.drawio](WF-12-usage-evidence-import.drawio) · [giải thích](WF-12-usage-evidence-import.md) |
| **WF-12a** | Identity Matching | luồng con dùng chung | Biến một định danh thô phía nhà cung cấp thành một nhân viên cụ thể và gắn hoạt động vào đúng Assignment — hoặc thừa nhận chưa khớp được và không kết luận gì. | `SF-4`, `UF-07`, `WF-12`, `WF-13` | [PNG](WF-12a-identity-matching.drawio.png) · [.drawio](WF-12a-identity-matching.drawio) · [giải thích](WF-12a-identity-matching.md) |
| **WF-13** | Waste Detection & Department Head Attestation | hỗ trợ | Mô tả cách phát hiện seat lãng phí và để Department Head xác nhận có kiểm soát: mọi khuyến nghị chỉ sinh ra khi qua các cổng, đủ bằng chứng và đủ bao phủ; không có đường nào tự thu hồi từ một khuyến nghị. | `MF-3`, `MF-4`, `MF-5`, `SF-4`, `UF-05`, `UF-10`, `WF-09a`, `WF-12`, `WF-12a`, `WF-13a` | [PNG](WF-13-waste-detection-department-head-attestation.drawio.png) · [.drawio](WF-13-waste-detection-department-head-attestation.drawio) · [giải thích](WF-13-waste-detection-department-head-attestation.md) |
| **WF-13a** | Exclusion Gates Before Waste Assessment | luồng con dùng chung | Chứng minh hệ thống không báo động giả. Tám cổng chạy trước mọi đánh giá: trượt một cổng thì không có khuyến nghị (kèm lý do), không yếu tố nào bù được; dữ liệu quá cũ thì không chạy rule mà hiển thị cảnh báo. | `SF-4`, `UF-10`, `WF-12a`, `WF-13` | [PNG](WF-13a-exclusion-gates-before-waste-assessment.drawio.png) · [.drawio](WF-13a-exclusion-gates-before-waste-assessment.drawio) · [giải thích](WF-13a-exclusion-gates-before-waste-assessment.md) |
| **WF-14** | Periodic Access Review (Design Only) | hỗ trợ | Mô tả rà soát quyền truy cập định kỳ theo thiết kế: Department Head xác nhận từng quyền của nhân viên trong phòng mình là còn cần hay không bằng Keep / Reclaim / Exempt kèm lý do, và mọi quyết định được lưu làm bằng chứng kiểm toán. | `SF-4`, `WF-09a`, `WF-13` | [PNG](WF-14-periodic-access-review-design-only.drawio.png) · [.drawio](WF-14-periodic-access-review-design-only.drawio) · [giải thích](WF-14-periodic-access-review-design-only.md) |
| **WF-18** | Company Device Registration & Monitoring Acknowledgment | hỗ trợ | Mô tả việc đăng ký thiết bị công ty và bảo đảm nhân viên biết rõ, xác nhận chủ động trước khi nhận bất kỳ dữ liệu nào từ máy. | `MF-3`, `MF-5`, `SF-4`, `UF-16`, `WF-12` | [PNG](WF-18-company-device-registration-monitoring-acknowledgment.drawio.png) · [.drawio](WF-18-company-device-registration-monitoring-acknowledgment.drawio) · [giải thích](WF-18-company-device-registration-monitoring-acknowledgment.md) |

## Tệp cũ

Bộ WF Mermaid/draw.io trước Review 1 (thư mục `drawio/`, tệp gộp, manifest, hướng dẫn đọc cũ) đã được thay bằng bộ này. Bản cũ còn trong lịch sử Git của repo Docs (commit `e89412e` trở về trước).
