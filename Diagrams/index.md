# SaaS-Sentry — Bộ sơ đồ nghiệp vụ (index)

> **Phiên bản bộ sơ đồ:** 1.4 — 12/10/2026 · **Căn cứ:** BRD v3.35, Định nghĩa phạm vi v1.24, sổ quyết định `QĐ-01` → `QĐ-66` (thứ tự căn cứ: `QĐ` → BRD → sơ đồ). Quyết định thể hiện trong sơ đồ là của **Owner**, **chưa** phải xác nhận của GVHD/hội đồng.
>
> Tệp này **sinh tự động** bằng `python tools/build_index.py` từ catalog và spec — không sửa tay.

## 1. Thứ tự đọc

| Bước | Cấp | Trả lời câu hỏi | Mở |
| --- | --- | --- | --- |
| 1 | Context Diagram | Hệ thống trao đổi dữ liệu gì với ai? | [context-diagram/index.md](context-diagram/index.md) |
| 2 | Functional Decomposition | Hệ thống gồm những nhóm chức năng nào? | [functional-decomposition-diagram/functional-decomposition-guide.md](functional-decomposition-diagram/functional-decomposition-guide.md) |
| 3 | 5 Main Flows | Năm quy trình nghiệp vụ chính chạy thế nào, ai quyết gì? | [main-workflows-activity-diagram/index.md](main-workflows-activity-diagram/index.md) |
| 4 | Workflows | Chi tiết từng bước, kiểm quyền, ngoại lệ? | [workflows-activity-diagram/index.md](workflows-activity-diagram/index.md) |
| 5 | User Flows | Người dùng đi qua màn hình nào? | [user-flows/index.md](user-flows/index.md) |

Lý do chọn 5 main flow và ánh xạ mã cũ → mới: [main-flow-selection.md](main-workflows-activity-diagram/main-flow-selection.md). Quy ước sinh hình và ký pháp: [tools/README.md](tools/README.md). Điểm mở đã phân loại (`DOI-xx`): [open-items.md](open-items.md). Bàn giao ERD/User Stories: [handoff-erd-us-2026-10-09.md](handoff-erd-us-2026-10-09.md). Kiểm chứng: [verification-2026-10-08.md](verification-2026-10-08.md).

## 2. Context và FDD

| Sơ đồ | Nội dung | Tệp |
| --- | --- | --- |
| Context Diagram v3.0 | 1 tiến trình · 8 tác nhân ngoài · 41 luồng (20 vào / 21 ra) | [.drawio](context-diagram/SaaS-Sentry-Context-Diagram.drawio) · [PNG](context-diagram/SaaS-Sentry-Context-Diagram.drawio.png) · [giải thích](context-diagram/index.md) |
| Functional Decomposition v3.2 | 15 nhóm chức năng · 84 chức năng (N.M) | [.drawio](functional-decomposition-diagram/saas-sentry-functional-decomposition.drawio) · [PNG](functional-decomposition-diagram/saas-sentry-functional-decomposition.drawio.png) · [giải thích](functional-decomposition-diagram/functional-decomposition-guide.md) |

## 3. Năm main flow

| # | Mã | Tên | Là gì · phục vụ mục tiêu nào · tạo kết quả gì | Workflow chi tiết | Tệp |
| --- | --- | --- | --- | --- | --- |
| 1 | **MF-2** | Access Request, Approval & Provisioning | Mô tả con đường chính thức để một nhân viên có được quyền dùng một phần mềm: từ phiếu yêu cầu, qua quyết định nhu cầu, cổng kiểm soát phần mềm mới và quyết định chi (chỉ khi phát sinh tiền hoặc thêm phần mềm trả phí vào danh mục), tới lúc tài khoản thật được cấp. | `WF-04`, `WF-09`, `WF-09a`, `WF-10`, `WF-11` | [.drawio](main-workflows-activity-diagram/MF-2-access-request-approval-provisioning.drawio) · [PNG](main-workflows-activity-diagram/MF-2-access-request-approval-provisioning.drawio.png) · [giải thích](main-workflows-activity-diagram/MF-2-access-request-approval-provisioning.md) |
| 2 | **MF-7** | Department Transfer & Access Adjustment | Mô tả việc điều chỉnh quyền khi nhân viên chuyển phòng ban: giữ lịch sử tổ chức, chuyển chi phí sang phòng mới đúng ngày, chuyển trách nhiệm tài khoản dùng chung, và để trưởng phòng mới quyết những công cụ nằm ngoài bộ chuẩn của phòng mới. | `WF-05` | [.drawio](main-workflows-activity-diagram/MF-7-department-transfer-access-adjustment.drawio) · [PNG](main-workflows-activity-diagram/MF-7-department-transfer-access-adjustment.drawio.png) · [giải thích](main-workflows-activity-diagram/MF-7-department-transfer-access-adjustment.md) |
| 3 | **MF-5** | Offboarding & Access Reclaim | Mô tả việc thu hồi toàn bộ quyền khi nhân viên nghỉ việc mà không làm mất dữ liệu của công ty. | `WF-07` | [.drawio](main-workflows-activity-diagram/MF-5-offboarding-access-reclaim.drawio) · [PNG](main-workflows-activity-diagram/MF-5-offboarding-access-reclaim.drawio.png) · [giải thích](main-workflows-activity-diagram/MF-5-offboarding-access-reclaim.md) |
| 4 | **MF-8** | Period Software Cost Control & Allocation | Mô tả việc khép chi phí phần mềm của một kỳ: ghi nhận hóa đơn đúng chứng từ (kể cả dòng thuế), đối soát với bản ghi mua và sao kê, xử lý sai lệch mà không xóa bằng chứng, quy chi phí về đúng Cost Center theo ngày và phát hành báo cáo theo chi phí thực chịu. | `WF-16`, `WF-17`, `WF-17a`, `WF-19`, `WF-20` | [.drawio](main-workflows-activity-diagram/MF-8-period-software-cost-control.drawio) · [PNG](main-workflows-activity-diagram/MF-8-period-software-cost-control.drawio.png) · [giải thích](main-workflows-activity-diagram/MF-8-period-software-cost-control.md) |
| 5 | **MF-4** | Subscription Renewal, Reduction or Cancellation | Mô tả chu kỳ quyết định gia hạn: cảnh báo đúng mốc (tính từ hạn chót báo hủy), chuẩn bị đề xuất có số liệu sử dụng và điều khoản, để Người duyệt chi quyết gia hạn, giảm số lượng hay hủy trước hạn — thời điểm duy nhất khuyến nghị lãng phí thành tiền thật (PP-2, liên kết VS-2 → VS-3).. | `WF-15` | [.drawio](main-workflows-activity-diagram/MF-4-subscription-renewal-decision.drawio) · [PNG](main-workflows-activity-diagram/MF-4-subscription-renewal-decision.drawio.png) · [giải thích](main-workflows-activity-diagram/MF-4-subscription-renewal-decision.md) |

**Nhóm chức năng hỗ trợ** (không phải main flow):

| Mã | Nhóm | Mã cũ | Workflow |
| --- | --- | --- | --- |
| SF-1 | Organization, catalog and initial data setup | MF-1 | `WF-01`, `WF-02` |
| SF-2 | System administration and audit | — | `WF-03` |
| SF-3 | Other workforce lifecycle events | — | `WF-06`, `WF-08` |
| SF-4 | Usage evidence and ghost-seat optimization | MF-3 | `WF-12`, `WF-12a`, `WF-13`, `WF-13a`, `WF-14`, `WF-18` |

## 4. Workflow

| Mã | Tên | Thuộc | Vai trò | Gọi / liên quan | Tệp |
| --- | --- | --- | --- | --- | --- |
| WF-01 | Organization & Initial Data Setup | SF-1 | hỗ trợ | `SF-1`, `WF-02`, `WF-03`, `WF-12`, `WF-15` | [.drawio](workflows-activity-diagram/WF-01-organization-initial-data-setup.drawio) · [PNG](workflows-activity-diagram/WF-01-organization-initial-data-setup.drawio.png) · [giải thích](workflows-activity-diagram/WF-01-organization-initial-data-setup.md) |
| WF-02 | Catalog, Plan & Subscription Setup | SF-1 | hỗ trợ | `SF-1`, `UF-20`, `WF-01`, `WF-09a`, `WF-10`, `WF-15`, `WF-17` | [.drawio](workflows-activity-diagram/WF-02-catalog-plan-subscription-setup.drawio) · [PNG](workflows-activity-diagram/WF-02-catalog-plan-subscription-setup.drawio.png) · [giải thích](workflows-activity-diagram/WF-02-catalog-plan-subscription-setup.md) |
| WF-03 | Account, Role & Configuration Administration | SF-2 | hỗ trợ | `SF-2`, `UF-13`, `UF-17`, `WF-01`, `WF-09`, `WF-15` | [.drawio](workflows-activity-diagram/WF-03-account-role-configuration-administration.drawio) · [PNG](workflows-activity-diagram/WF-03-account-role-configuration-administration.drawio.png) · [giải thích](workflows-activity-diagram/WF-03-account-role-configuration-administration.md) |
| WF-04 | New Employee Onboarding | MF-2 | hỗ trợ | `MF-2`, `UF-21`, `WF-01`, `WF-02`, `WF-08`, `WF-09` | [.drawio](workflows-activity-diagram/WF-04-new-employee-onboarding.drawio) · [PNG](workflows-activity-diagram/WF-04-new-employee-onboarding.drawio.png) · [giải thích](workflows-activity-diagram/WF-04-new-employee-onboarding.md) |
| WF-05 | Department Transfer & Tool Review | MF-7 | chi tiết | `MF-2`, `MF-7`, `MF-8`, `UF-18`, `WF-07`, `WF-09a`, `WF-19` | [.drawio](workflows-activity-diagram/WF-05-department-transfer-tool-review.drawio) · [PNG](workflows-activity-diagram/WF-05-department-transfer-tool-review.drawio.png) · [giải thích](workflows-activity-diagram/WF-05-department-transfer-tool-review.md) |
| WF-06 | Extended Leave & Return | SF-3 | hỗ trợ | `SF-3`, `WF-07`, `WF-13a` | [.drawio](workflows-activity-diagram/WF-06-extended-leave-return.drawio) · [PNG](workflows-activity-diagram/WF-06-extended-leave-return.drawio.png) · [giải thích](workflows-activity-diagram/WF-06-extended-leave-return.md) |
| WF-07 | Offboarding Handover & Full Access Reclaim | MF-5 | chi tiết | `MF-5`, `UF-09`, `WF-03`, `WF-06`, `WF-08`, `WF-09a`, `WF-13` | [.drawio](workflows-activity-diagram/WF-07-offboarding-handover-full-access-reclaim.drawio) · [PNG](workflows-activity-diagram/WF-07-offboarding-handover-full-access-reclaim.drawio.png) · [giải thích](workflows-activity-diagram/WF-07-offboarding-handover-full-access-reclaim.md) |
| WF-08 | Fixed-Term Access Expiry | SF-3 | hỗ trợ | `SF-3`, `WF-07`, `WF-09a`, `WF-11` | [.drawio](workflows-activity-diagram/WF-08-fixed-term-access-expiry.drawio) · [PNG](workflows-activity-diagram/WF-08-fixed-term-access-expiry.drawio.png) · [giải thích](workflows-activity-diagram/WF-08-fixed-term-access-expiry.md) |
| WF-09 | Access Request Routing & Approval | MF-2 | chi tiết | `MF-2`, `UF-01`, `UF-02`, `UF-04`, `UF-08`, `UF-11`, `UF-15`, `WF-04`, `WF-09a`, `WF-10`, `WF-11` | [.drawio](workflows-activity-diagram/WF-09-access-request-routing-approval.drawio) · [PNG](workflows-activity-diagram/WF-09-access-request-routing-approval.drawio.png) · [giải thích](workflows-activity-diagram/WF-09-access-request-routing-approval.md) |
| WF-09a | Provisioning & Reclaim Execution | MF-2 | luồng con dùng chung | `MF-2`, `MF-4`, `MF-5`, `MF-7`, `UF-08`, `WF-05`, `WF-07`, `WF-08`, `WF-09`, `WF-11`, `WF-13`, `WF-15`, `WF-16`, `WF-17` | [.drawio](workflows-activity-diagram/WF-09a-provisioning-reclaim-execution.drawio) · [PNG](workflows-activity-diagram/WF-09a-provisioning-reclaim-execution.drawio.png) · [giải thích](workflows-activity-diagram/WF-09a-provisioning-reclaim-execution.md) |
| WF-10 | New Software Assessment | MF-2 | luồng con dùng chung | `MF-2`, `UF-02`, `WF-09`, `WF-17` | [.drawio](workflows-activity-diagram/WF-10-new-software-assessment.drawio) · [PNG](workflows-activity-diagram/WF-10-new-software-assessment.drawio.png) · [giải thích](workflows-activity-diagram/WF-10-new-software-assessment.md) |
| WF-11 | Access Return & Time-Bound Extension | MF-2 | hỗ trợ | `MF-2`, `UF-01`, `UF-08`, `WF-08`, `WF-09`, `WF-09a` | [.drawio](workflows-activity-diagram/WF-11-access-return-time-bound-extension.drawio) · [PNG](workflows-activity-diagram/WF-11-access-return-time-bound-extension.drawio.png) · [giải thích](workflows-activity-diagram/WF-11-access-return-time-bound-extension.md) |
| WF-12 | Usage Evidence Import | SF-4 | hỗ trợ | `MF-3`, `SF-4`, `UF-06`, `UF-07`, `WF-12a`, `WF-13`, `WF-18` | [.drawio](workflows-activity-diagram/WF-12-usage-evidence-import.drawio) · [PNG](workflows-activity-diagram/WF-12-usage-evidence-import.drawio.png) · [giải thích](workflows-activity-diagram/WF-12-usage-evidence-import.md) |
| WF-12a | Identity Matching | SF-4 | luồng con dùng chung | `SF-4`, `UF-07`, `WF-12`, `WF-13` | [.drawio](workflows-activity-diagram/WF-12a-identity-matching.drawio) · [PNG](workflows-activity-diagram/WF-12a-identity-matching.drawio.png) · [giải thích](workflows-activity-diagram/WF-12a-identity-matching.md) |
| WF-13 | Waste Detection & Department Head Attestation | SF-4 | hỗ trợ | `MF-3`, `MF-4`, `MF-5`, `SF-4`, `UF-05`, `UF-10`, `WF-09a`, `WF-12`, `WF-12a`, `WF-13a` | [.drawio](workflows-activity-diagram/WF-13-waste-detection-department-head-attestation.drawio) · [PNG](workflows-activity-diagram/WF-13-waste-detection-department-head-attestation.drawio.png) · [giải thích](workflows-activity-diagram/WF-13-waste-detection-department-head-attestation.md) |
| WF-13a | Exclusion Gates Before Waste Assessment | SF-4 | luồng con dùng chung | `SF-4`, `UF-10`, `WF-12a`, `WF-13` | [.drawio](workflows-activity-diagram/WF-13a-exclusion-gates-before-waste-assessment.drawio) · [PNG](workflows-activity-diagram/WF-13a-exclusion-gates-before-waste-assessment.drawio.png) · [giải thích](workflows-activity-diagram/WF-13a-exclusion-gates-before-waste-assessment.md) |
| WF-14 | Periodic Access Review (Design Only) | SF-4 | hỗ trợ | `SF-4`, `WF-09a`, `WF-13` | [.drawio](workflows-activity-diagram/WF-14-periodic-access-review-design-only.drawio) · [PNG](workflows-activity-diagram/WF-14-periodic-access-review-design-only.drawio.png) · [giải thích](workflows-activity-diagram/WF-14-periodic-access-review-design-only.md) |
| WF-15 | Renewal Decision Cycle | MF-4 | chi tiết | `MF-4`, `UF-11`, `UF-15`, `UF-20`, `WF-02`, `WF-09a`, `WF-13` | [.drawio](workflows-activity-diagram/WF-15-renewal-decision-cycle.drawio) · [PNG](workflows-activity-diagram/WF-15-renewal-decision-cycle.drawio.png) · [giải thích](workflows-activity-diagram/WF-15-renewal-decision-cycle.md) |
| WF-16 | Invoice & Vendor Reconciliation | MF-8 | chi tiết | `MF-8`, `UF-14`, `UF-19`, `WF-09a`, `WF-17`, `WF-19` | [.drawio](workflows-activity-diagram/WF-16-invoice-vendor-reconciliation.drawio) · [PNG](workflows-activity-diagram/WF-16-invoice-vendor-reconciliation.drawio.png) · [giải thích](workflows-activity-diagram/WF-16-invoice-vendor-reconciliation.md) |
| WF-17 | Spend Reconciliation & Out-of-Catalog Legitimization | MF-8 | luồng con dùng chung | `MF-8`, `UF-12`, `UF-15`, `WF-09`, `WF-09a`, `WF-16`, `WF-17a`, `WF-19` | [.drawio](workflows-activity-diagram/WF-17-spend-reconciliation-out-of-catalog-legitimization.drawio) · [PNG](workflows-activity-diagram/WF-17-spend-reconciliation-out-of-catalog-legitimization.drawio.png) · [giải thích](workflows-activity-diagram/WF-17-spend-reconciliation-out-of-catalog-legitimization.md) |
| WF-17a | Vendor Normalization & Confidence Scoring | MF-8 | luồng con dùng chung | `MF-8`, `UF-12`, `WF-17` | [.drawio](workflows-activity-diagram/WF-17a-vendor-normalization-confidence-scoring.drawio) · [PNG](workflows-activity-diagram/WF-17a-vendor-normalization-confidence-scoring.drawio.png) · [giải thích](workflows-activity-diagram/WF-17a-vendor-normalization-confidence-scoring.md) |
| WF-18 | Company Device Registration & Monitoring Acknowledgment | SF-4 | hỗ trợ | `MF-3`, `MF-5`, `SF-4`, `UF-16`, `WF-12` | [.drawio](workflows-activity-diagram/WF-18-company-device-registration-monitoring-acknowledgment.drawio) · [PNG](workflows-activity-diagram/WF-18-company-device-registration-monitoring-acknowledgment.drawio.png) · [giải thích](workflows-activity-diagram/WF-18-company-device-registration-monitoring-acknowledgment.md) |
| WF-19 | Period Cost Allocation & Budget Reporting | MF-8 | chi tiết | `MF-2`, `MF-7`, `MF-8`, `UF-11`, `UF-19`, `WF-16`, `WF-17`, `WF-20` | [.drawio](workflows-activity-diagram/WF-19-period-cost-allocation-budget-reporting.drawio) · [PNG](workflows-activity-diagram/WF-19-period-cost-allocation-budget-reporting.drawio.png) · [giải thích](workflows-activity-diagram/WF-19-period-cost-allocation-budget-reporting.md) |
| WF-20 | Budget Planning & Commitment Back-fill | MF-8 | hỗ trợ | `MF-2`, `MF-8`, `UF-11`, `UF-19`, `WF-03`, `WF-09`, `WF-19` | [.drawio](workflows-activity-diagram/WF-20-budget-planning-commitment-backfill.drawio) · [PNG](workflows-activity-diagram/WF-20-budget-planning-commitment-backfill.drawio.png) · [giải thích](workflows-activity-diagram/WF-20-budget-planning-commitment-backfill.md) |

## 5. User flow

| Mã | Tên | Liên quan | Tệp |
| --- | --- | --- | --- |
| UF-01 | Employee Requests Catalog Software | `MF-2`, `UF-02`, `UF-04`, `UF-08`, `UF-15`, `WF-09` | [.drawio](user-flows/UF-01-employee-requests-catalog-software.drawio) · [PNG](user-flows/UF-01-employee-requests-catalog-software.drawio.png) · [giải thích](user-flows/UF-01-employee-requests-catalog-software.md) |
| UF-02 | Employee Requests Software Not in Catalog | `MF-2`, `UF-01`, `UF-04`, `UF-08`, `UF-15`, `WF-09`, `WF-10` | [.drawio](user-flows/UF-02-employee-requests-software-not-in-catalog.drawio) · [PNG](user-flows/UF-02-employee-requests-software-not-in-catalog.drawio.png) · [giải thích](user-flows/UF-02-employee-requests-software-not-in-catalog.md) |
| UF-03 | Employee Views and Exports Own Data | `UF-16`, `UF-17`, `WF-12`, `WF-18` | [.drawio](user-flows/UF-03-employee-views-and-exports-own-data.drawio) · [PNG](user-flows/UF-03-employee-views-and-exports-own-data.drawio.png) · [giải thích](user-flows/UF-03-employee-views-and-exports-own-data.md) |
| UF-04 | Department Head Reviews Access Requests | `MF-2`, `UF-01`, `UF-02`, `UF-08`, `UF-15`, `UF-21`, `WF-09` | [.drawio](user-flows/UF-04-department-head-reviews-access-requests.drawio) · [PNG](user-flows/UF-04-department-head-reviews-access-requests.drawio.png) · [giải thích](user-flows/UF-04-department-head-reviews-access-requests.md) |
| UF-05 | Department Head Attests Ghost-Seat Recommendations | `MF-4`, `MF-5`, `UF-10`, `WF-13`, `WF-13a`, `WF-14` | [.drawio](user-flows/UF-05-department-head-attests-ghost-seat-recommendations.drawio) · [PNG](user-flows/UF-05-department-head-attests-ghost-seat-recommendations.drawio.png) · [giải thích](user-flows/UF-05-department-head-attests-ghost-seat-recommendations.md) |
| UF-06 | IT Admin Imports Usage Evidence | `UF-07`, `UF-10`, `UF-16`, `WF-12`, `WF-12a`, `WF-13`, `WF-18` | [.drawio](user-flows/UF-06-it-admin-imports-usage-evidence.drawio) · [PNG](user-flows/UF-06-it-admin-imports-usage-evidence.drawio.png) · [giải thích](user-flows/UF-06-it-admin-imports-usage-evidence.md) |
| UF-07 | IT Admin Resolves Unmatched Identities | `UF-06`, `UF-10`, `UF-14`, `WF-12`, `WF-12a` | [.drawio](user-flows/UF-07-it-admin-resolves-unmatched-identities.drawio) · [PNG](user-flows/UF-07-it-admin-resolves-unmatched-identities.drawio.png) · [giải thích](user-flows/UF-07-it-admin-resolves-unmatched-identities.md) |
| UF-08 | IT Admin Works the Provisioning Queue | `MF-2`, `UF-01`, `UF-09`, `UF-14`, `WF-09`, `WF-09a` | [.drawio](user-flows/UF-08-it-admin-works-the-provisioning-queue.drawio) · [PNG](user-flows/UF-08-it-admin-works-the-provisioning-queue.drawio.png) · [giải thích](user-flows/UF-08-it-admin-works-the-provisioning-queue.md) |
| UF-09 | IT Admin Processes Offboarding | `MF-5`, `UF-08`, `UF-13`, `UF-17`, `WF-07`, `WF-09a`, `WF-18` | [.drawio](user-flows/UF-09-it-admin-processes-offboarding.drawio) · [PNG](user-flows/UF-09-it-admin-processes-offboarding.drawio.png) · [giải thích](user-flows/UF-09-it-admin-processes-offboarding.md) |
| UF-10 | IT Admin Works the License Optimization Board | `SF-4`, `UF-05`, `UF-06`, `UF-07`, `UF-08`, `UF-20`, `WF-13`, `WF-13a`, `WF-14` | [.drawio](user-flows/UF-10-it-admin-works-the-license-optimization-board.drawio) · [PNG](user-flows/UF-10-it-admin-works-the-license-optimization-board.drawio.png) · [giải thích](user-flows/UF-10-it-admin-works-the-license-optimization-board.md) |
| UF-11 | Finance Answers Budget Queries and Records Commitments | `MF-2`, `MF-8`, `UF-13`, `UF-15`, `UF-19`, `WF-09`, `WF-20` | [.drawio](user-flows/UF-11-finance-answers-budget-queries-and-records-commitments.drawio) · [PNG](user-flows/UF-11-finance-answers-budget-queries-and-records-commitments.drawio.png) · [giải thích](user-flows/UF-11-finance-answers-budget-queries-and-records-commitments.md) |
| UF-12 | Spend Reconciliation and Legitimization | `MF-8`, `UF-08`, `UF-14`, `UF-15`, `UF-19`, `WF-17`, `WF-17a`, `WF-19` | [.drawio](user-flows/UF-12-spend-reconciliation-and-legitimization.drawio) · [PNG](user-flows/UF-12-spend-reconciliation-and-legitimization.drawio.png) · [giải thích](user-flows/UF-12-spend-reconciliation-and-legitimization.md) |
| UF-13 | Super Admin Configures Approvers and Policies | `SF-2`, `UF-11`, `UF-15`, `UF-17`, `WF-01`, `WF-03` | [.drawio](user-flows/UF-13-super-admin-configures-approvers-and-policies.drawio) · [PNG](user-flows/UF-13-super-admin-configures-approvers-and-policies.drawio.png) · [giải thích](user-flows/UF-13-super-admin-configures-approvers-and-policies.md) |
| UF-14 | IT Admin Resolves Discrepancies | `MF-8`, `UF-08`, `UF-12`, `UF-19`, `WF-09a`, `WF-16` | [.drawio](user-flows/UF-14-it-admin-resolves-discrepancies.drawio) · [PNG](user-flows/UF-14-it-admin-resolves-discrepancies.drawio.png) · [giải thích](user-flows/UF-14-it-admin-resolves-discrepancies.md) |
| UF-15 | Spending Approver Decides Spend and Renewals | `MF-2`, `MF-4`, `MF-8`, `UF-04`, `UF-11`, `UF-12`, `UF-20`, `WF-09`, `WF-15`, `WF-17` | [.drawio](user-flows/UF-15-spending-approver-decides-spend-and-renewals.drawio) · [PNG](user-flows/UF-15-spending-approver-decides-spend-and-renewals.drawio.png) · [giải thích](user-flows/UF-15-spending-approver-decides-spend-and-renewals.md) |
| UF-16 | Company Device Registration and Monitoring Acknowledgment | `MF-5`, `UF-03`, `UF-06`, `UF-07`, `UF-09`, `UF-17`, `WF-12`, `WF-18` | [.drawio](user-flows/UF-16-company-device-registration-and-monitoring-acknowledgment.drawio) · [PNG](user-flows/UF-16-company-device-registration-and-monitoring-acknowledgment.drawio.png) · [giải thích](user-flows/UF-16-company-device-registration-and-monitoring-acknowledgment.md) |
| UF-17 | Account Activation, Sign-In and Password | `MF-5`, `UF-13`, `WF-03`, `WF-07` | [.drawio](user-flows/UF-17-account-activation-sign-in-and-password.drawio) · [PNG](user-flows/UF-17-account-activation-sign-in-and-password.drawio.png) · [giải thích](user-flows/UF-17-account-activation-sign-in-and-password.md) |
| UF-18 | Department Transfer and New Head Tool Review | `MF-7`, `UF-01`, `UF-08`, `UF-21`, `WF-05` | [.drawio](user-flows/UF-18-department-transfer-and-new-head-tool-review.drawio) · [PNG](user-flows/UF-18-department-transfer-and-new-head-tool-review.drawio.png) · [giải thích](user-flows/UF-18-department-transfer-and-new-head-tool-review.md) |
| UF-19 | Finance Closes Period Costs and Publishes Report | `MF-8`, `UF-11`, `UF-12`, `UF-15`, `WF-17`, `WF-19`, `WF-20` | [.drawio](user-flows/UF-19-finance-closes-period-costs-and-publishes-report.drawio) · [PNG](user-flows/UF-19-finance-closes-period-costs-and-publishes-report.drawio.png) · [giải thích](user-flows/UF-19-finance-closes-period-costs-and-publishes-report.md) |
| UF-20 | IT Admin Prepares Renewal Proposal and Records Outcome | `MF-4`, `UF-08`, `UF-10`, `UF-11`, `UF-15`, `WF-15` | [.drawio](user-flows/UF-20-it-admin-prepares-renewal-proposal-and-records-outcome.drawio) · [PNG](user-flows/UF-20-it-admin-prepares-renewal-proposal-and-records-outcome.drawio.png) · [giải thích](user-flows/UF-20-it-admin-prepares-renewal-proposal-and-records-outcome.md) |
| UF-21 | Department Head Requests Tools for a New Hire or Team | `MF-2`, `UF-01`, `UF-04`, `UF-08`, `UF-15`, `UF-18`, `WF-04`, `WF-09` | [.drawio](user-flows/UF-21-department-head-requests-tools-for-a-new-hire-or-team.drawio) · [PNG](user-flows/UF-21-department-head-requests-tools-for-a-new-hire-or-team.drawio.png) · [giải thích](user-flows/UF-21-department-head-requests-tools-for-a-new-hire-or-team.md) |

## 6. Truy vết Requirement/Decision → chức năng → sơ đồ

Mỗi dòng là một chức năng lá của FDD. Ba mức, **không** coi quan hệ cùng nhóm là bằng chứng thực hiện:

- **DIRECT** — có node cụ thể (`sơ đồ`: id node) mang mã yêu cầu của chức năng trong trường `rules`, và sơ đồ đó thuộc phạm vi luồng khai báo của chức năng (luồng khai báo, main flow/nhóm cha, workflow con, user flow liên hệ). Mã so khớp là `FR`/`BR`; chức năng chỉ có `QĐ` thì so `QĐ`.
- **RELATED** — sơ đồ khai báo hoặc user flow có liên hệ, nhưng không node nào mang mã của chức năng: chỉ liên quan cùng quy trình.
- **GAP** — không có node nào mang mã; **N/A** — chức năng không phải một bước luồng (ghi lý do).

Đây là truy vết theo mã do bộ sinh tính, không thay việc đọc node. User Stories/ERD chưa đồng bộ `QĐ-52` → `QĐ-60` nên chưa nối ở đây; bàn giao theo mã ở [handoff-erd-us-2026-10-09.md](handoff-erd-us-2026-10-09.md) (giai đoạn ERD + User Stories, `QĐ-59e`).

| Requirement / Decision | Chức năng | DIRECT (sơ đồ: node) | RELATED (không có node mang mã) | Mức |
| --- | --- | --- | --- | --- |
| FR-3.1, FR-3.17, QĐ-52a | 1.1 Department Profiles | `WF-01`: a_cc, a_dept, a_heads | UF-13 | DIRECT |
| FR-3.1, INV-19, QĐ-58a | 1.2 Department Head Assignment | `MF-5`: d_head · `UF-09`: s_impact · `WF-01`: a_cc, a_dept, a_heads · `WF-07`: d_head | UF-13, UF-17 | DIRECT |
| FR-2.1, FR-2.2, INV-20, QĐ-52b | 1.3 Employee & Position Records | `MF-7`: a_rec, s_period · `UF-18`: t_start · `WF-01`: a_up · `WF-05`: a_rec, s_period, t_eff | UF-13 | DIRECT |
| FR-3.1, OI-04, QĐ-52b | 1.4 Cost Center Catalog | `UF-11`: s_cc · `WF-01`: a_cc, a_dept, a_heads · `WF-20`: a_cc | UF-13, UF-19 | DIRECT |
| FR-3.18, QĐ-52e, QĐ-58c | 1.5 Standard Toolset by Position | `MF-2`: a_req · `MF-7`: s_compare · `UF-18`: d_out, y_cmp · `UF-21`: d_extra, s_kit, s_why · `WF-01`: a_tool · +2 sơ đồ | UF-13 | DIRECT |
| FR-1.1, QĐ-49a, QĐ-49h | 2.1 Catalog Entries | `WF-02`: a_flag, a_reg, a_stat, d_blk … | — | DIRECT |
| FR-1.7, BRD 4.4, OI-05c | 2.2 Business Owner Assignment | `WF-02`: a_bo, d_bo | UF-09, UF-17, WF-07 | DIRECT |
| FR-1.2, ADR-02 | 2.3 Plans & Pricing Models | `WF-02`: a_plan, s_pub | — | DIRECT |
| FR-1.9, QĐ-54a | 2.4 Provisioning Type & Control Level | `MF-2`: c_prov, d_ctrl · `UF-02`: y_it · `WF-02`: a_plan, d_int, d_k4 · `WF-10`: a_bm02, d_ctrl | — | DIRECT |
| FR-1.10, QĐ-54e | 2.5 Vendor Terms Checklist | `MF-4`: a_terms · `UF-20`: s_terms · `WF-02`: a_terms · `WF-15`: a_terms | UF-15 | DIRECT |
| FR-1.8, ADR-10 | 2.6 Communication-Service Flag | `UF-06`: b_comm, d_comm · `WF-02`: a_flag · `WF-12`: d_comm | UF-03, UF-07, UF-16 | DIRECT |
| FR-1.3, ADR-06, QĐ-49c | 3.1 Contracts & Subscriptions | `WF-02`: a_perp, a_term, d_perp | — | DIRECT |
| FR-1.5, BM-05, OI-08a | 3.2 Purchase Documents | `WF-02`: a_doc | UF-14, WF-16 | DIRECT |
| FR-1.4, OI-09a | 3.3 Cancellation-Deadline Alerts | `MF-4`: d_known, s_check, s_dq, s_endd … · `UF-20`: b_dq, d_dq, s_inbox, y_endd · `WF-15`: d_ar, d_dl, d_t7, s_a15 … | UF-05, UF-15 | DIRECT |
| FR-3.13, FR-4.15 | 3.4 Renewal Proposal & Decision | `MF-4`: a_act, a_dec, a_exec, a_prop … · `UF-05`: s_ev · `UF-15`: s_rdec, s_ren, y_ren · `UF-20`: d_dec, d_sav, d_vout, r_uf15 … · `WF-15`: a_act, a_dec, a_exec, a_prop … | — | DIRECT |
| FR-3.2, FR-3.18, BM-01 | 4.1 Access Request Form | `MF-2`: a_req, d_beh · `UF-01`: d_set, s_detail, s_mine, s_pick … · `UF-02`: s_form · `UF-04`: d_flag, s_flag · `UF-21`: d_extra, d_want, s_dept, s_grp … · +3 sơ đồ | UF-08, UF-11, UF-15 | DIRECT |
| FR-3.2, FR-2.11, QĐ-54d | 4.2 Group & On-Behalf Requests | `MF-2`: a_req, d_beh · `UF-21`: d_kind, d_want, s_dept, s_grp … · `WF-04`: a_grp, a_onb, d_head, d_kind | — | DIRECT |
| FR-3.3, FR-3.6, QĐ-52c | 4.3 Need-Approver Routing | `MF-2`: s_route · `UF-01`: y_route · `UF-02`: r_uf04 · `UF-04`: b_own, t_start · `UF-21`: y_route · +3 sơ đồ | UF-08, UF-11, UF-15 | DIRECT |
| FR-3.19, BM-02, QĐ-53c, QĐ-49h, QĐ-50a | 4.4 New Software Assessment | `MF-2`: a_rej, c_assess, d_ctrl · `UF-02`: d_ass, r_uf01, s_rej, y_it · `WF-09`: c_assess · `WF-10`: a_bm02, a_hand, a_rej, d_ctrl … | UF-01, UF-04, UF-08, UF-11, UF-15, UF-21 | DIRECT |
| FR-3.13, FR-3.14, QĐ-60a | 4.5 Spending Decision on Snapshot | `MF-2`: a_fin, a_spend, s_snap · `UF-02`: r_uf15 · `UF-11`: s_ask, s_home, s_op, s_reply … · `UF-15`: s_rdec, s_ren, y_ren · `WF-09`: a_ans, a_dec, a_rec, e_ask … · +1 sơ đồ | UF-01, UF-04, UF-08, UF-21 | DIRECT |
| FR-3.15, QĐ-28c | 4.6 Conflict-of-Interest Substitute | `MF-2`: a_spend · `WF-09`: s_sa | UF-01, UF-02, UF-04, UF-08, UF-11, UF-15, UF-21 | DIRECT |
| FR-3.5, FR-3.8, FR-3.12, FR-3.16 | 4.7 SLA Reminders & Bottleneck Alerts | `MF-2`: a_need · `UF-01`: s_review, y_route · `UF-02`: r_uf04, s_review, s_time · `UF-04`: s_decide, s_queue · `UF-11`: y_note · +3 sơ đồ | UF-08 | DIRECT |
| FR-3.2, FR-2.8, BM-03 | 4.8 Return & Extension Requests | `MF-2`: a_req, d_beh · `WF-11`: a_ext, a_ret, d_start, s_newend | — | DIRECT |
| FR-2.3, FR-2.7, ADR-02, INV-01 | 5.1 Seat Assignment & Capacity Check | `MF-2`: c_prov · `UF-08`: d_man, s_done, y_act · `WF-09a`: d_fix, d_man, s_act, s_task | UF-09, UF-14 | DIRECT |
| FR-2.5, BRD 6.2, ADR-07 | 5.2 Provisioning Tasks by Plan Type | `MF-2`: c_prov, s_fail · `UF-08`: b_err, d_api, d_ch, d_man … · `UF-14`: d_gap, r_exec · `WF-09a`: d_api, d_ch, d_fix, d_man … | UF-09 | DIRECT |
| FR-2.10, QĐ-54b | 5.3 License Key Pool | `MF-2`: c_prov · `UF-08`: d_k4, s_key, y_act, y_free · `UF-09`: r_uf08 · `WF-02`: a_keys, d_k4, s_keys · `WF-09a`: a_man, s_act, s_free | UF-14 | DIRECT |
| FR-2.11, QĐ-54d | 5.4 Shared Accounts & Team Plans | `MF-2`: a_req · `MF-5`: c_reclaim · `UF-08`: d_shr, s_rot, y_rot · `UF-09`: r_uf08 · `WF-07`: c_reclaim, s_tasks · +1 sơ đồ | UF-14, UF-17 | DIRECT |
| FR-2.9, QĐ-54c | 5.5 Company-Account Rule | `MF-2`: c_prov · `UF-08`: s_card · `UF-09`: s_lock · `WF-09a`: a_man, s_task | UF-14 | DIRECT |
| FR-2.4, FR-4.15 | 5.6 Access Reclaim | `UF-08`: y_free · `UF-09`: y_close · `UF-14`: r_exec · `WF-09a`: s_free | — | DIRECT |
| FR-2.6, FR-4.8, OI-14h | 5.7 Vendor Account Reconciliation | `UF-14`: s_queue · `WF-16`: a_conn, d_diff, d_src, d_ver … | — | DIRECT |
| FR-2.2, FR-3.8, QĐ-50b, QĐ-56a | 6.1 Department Transfer & Tool Review | `MF-7`: a_rec, s_period, s_remind, s_task · `UF-18`: s_task, t_start, y_late · `WF-05`: a_rec, s_period, s_remind, s_task … | — | DIRECT |
| FR-2.12, BM-04, BM-08, QĐ-56b | 6.2 Offboarding Handover | `MF-5`: a_data, a_resp, c_reclaim, d_hc … · `UF-09`: d_hc, d_shared, s_impact, s_over … · `WF-07`: a_data, a_resp, a_sudden, c_reclaim … | UF-05, UF-16, UF-17 | DIRECT |
| FR-2.12, QĐ-56c, QĐ-58d | 6.3 Shared-Account Responsibility Handover | `MF-5`: a_data, a_resp, c_reclaim, d_hc … · `MF-7`: a_resp, d_shared · `UF-09`: d_hc, d_shared, s_impact, s_over … · `WF-05`: a_resp, d_shared · `WF-07`: a_data, a_resp, a_sudden, c_reclaim … | UF-17, UF-18 | DIRECT |
| FR-4.9, OQ-04 | 6.4 Extended Leave Status | `WF-06`: s_excl, s_incl | — | DIRECT |
| FR-2.8, INV-07 | 6.5 Fixed-Term Access Expiry | `WF-08`: a_rec, d_first, d_pend, e_dec … | — | DIRECT |
| FR-8.9, QĐ-41a | 6.6 Leaver Account Blocking | `MF-5`: a_hand, a_left, s_block · `UF-09`: s_hand, s_left, s_people, s_sudden … · `UF-17`: b_ref, d_res, y_session · `WF-07`: a_hand, a_left, a_sudden, s_block | — | DIRECT |
| FR-4.1→4.4, FR-4.16, INV-10, INV-11 | 7.1 Usage Source Templates | `UF-06`: d_src2, d_type, s_pick, s_prev … · `WF-12`: a_pick, a_tpl, a_up, d_src2 … | UF-03, UF-07, UF-16 | DIRECT |
| FR-4.5→4.8, INV-12 | 7.2 Identity Matching Queue | `UF-06`: y_match · `UF-07`: d_know, s_cmp, s_conf, s_item … · `WF-12a`: a_man, d_map, d_res, s_look … | — | DIRECT |
| FR-4.9→4.12b, G1–G4, BRD 5.4.1 | 7.3 Exclusion Gates & Waste Detection | `UF-05`: y_ex · `UF-10`: t_start · `WF-13`: a_ex, c_gates, d_pass · `WF-13a`: d_grp, g1, g2, g3 … | UF-06 | DIRECT |
| FR-4.14, FR-4.14a, QĐ-35b | 7.4 Evidence & Confidence | `UF-05`: s_ev · `UF-10`: d_ev, s_g2, s_rec, y_watch · `WF-13`: a_view, d_att, d_col, d_cov … | UF-06 | DIRECT |
| FR-3.10, INV-09, OI-02 | 7.5 Department Head Attestation | `UF-05`: d_choice, s_ex, s_keep, s_rec … · `UF-10`: d_att · `WF-13`: a_ex, d_att, s_notify | UF-06 | DIRECT |
| FR-4.15 | 7.6 Savings Estimation | `MF-4`: a_act, a_prop, a_terms, d_vout … · `UF-05`: s_ev · `UF-10`: r_uf20, s_board, y_acc · `UF-20`: d_sav, d_vout, s_act, s_prop … · `WF-13`: c_mf4, s_acc · +1 sơ đồ | UF-06, UF-15 | DIRECT |
| FR-3.10, F-24 | 7.7 Periodic Access Review | `UF-05`: d_choice, s_ex, s_keep, s_rec … · `UF-10`: d_att · `WF-14`: a_ex, a_rev, d_ch, s_audit … | — | DIRECT |
| FR-4.21, QĐ-57b | 8.1 Company Device Registry | `UF-16`: b_noack, b_per, d_dev, s_hand … · `WF-18`: a_hand, a_reg, a_sign, a_store … | UF-03, UF-06, UF-09 | DIRECT |
| FR-4.18, FR-4.21, BM-06, INV-17 | 8.2 Monitoring Acknowledgment | `UF-03`: r_uf16, s_dev · `UF-09`: y_block · `UF-16`: b_noack, b_per, d_ack, d_dev … · `WF-18`: a_hand, a_reg, a_sign, a_store … | UF-06 | DIRECT |
| ADR-13, FR-4.14a, QĐ-59a | 8.3 Filtered Usage Intake | `WF-18`: c_wf12 | UF-03, UF-06, UF-09, UF-16 | DIRECT |
| FR-5.1, OI-11b | 9.1 Budgets per Cost Center | `MF-8`: s_report · `UF-11`: d_period, s_bud, s_home, y_upd · `UF-19`: s_bva · `WF-20`: a_bud, a_edit, d_period, s_upd | — | DIRECT |
| FR-5.8, FR-5.8a, INV-16, INV-18 | 9.2 Budget Commitments | `MF-2`: d_cost, s_commit, s_fail · `MF-8`: s_commit · `UF-02`: y_buy · `UF-08`: s_close · `UF-11`: d_neg, s_cq, s_home, s_neg … · +4 sơ đồ | UF-01, UF-04, UF-15, UF-21 | DIRECT |
| FR-5.4, FR-5.13, QĐ-34b | 9.3 Invoice Recording with Tax Lines | `MF-8`: a_billerr, a_inv, a_updsub, s_disc … · `UF-11`: s_ask, s_bud, s_op · `UF-12`: y_rec · `UF-14`: d_cause, d_gap, s_berr, s_case … · `UF-15`: y_app · +4 sơ đồ | UF-19 | DIRECT |
| FR-5.13, QĐ-60b | 9.4 Vendor Tax Profiles | `MF-8`: a_inv, s_report, s_tax · `UF-14`: s_queue · `WF-16`: a_inv, d_var, s_tax | — | DIRECT |
| FR-5.2, FR-5.3, QĐ-49g, QĐ-55b | 9.5 Cost Allocation | `MF-8`: s_alloc · `UF-19`: s_bva, s_int, y_alloc · `WF-17`: s_unal · `WF-19`: a_int, d_alloc, d_type, s_bases … | UF-11, UF-12, UF-14, UF-15 | DIRECT |
| FR-5.1, FR-5.13, QĐ-50c, QĐ-60a | 9.6 Budget vs Actual on Borne Cost | `MF-8`: a_inv, s_report, s_tax · `UF-11`: d_period, s_ask, s_bud, s_home … · `UF-14`: s_queue · `UF-15`: y_app · `UF-19`: s_bva · +4 sơ đồ | UF-12 | DIRECT |
| FR-1.6, FR-5.6, ADR-03 | 9.7 Exchange Rates | `UF-19`: s_bva · `WF-19`: s_bases | UF-12 | DIRECT |
| FR-5.5, FR-5.7, QĐ-25 | 9.8 Three-Layer Cost Forecast | `UF-19`: s_fc · `WF-19`: s_fc | UF-12 | DIRECT |
| FR-6.3, QĐ-31a | 10.1 Statement CSV Import | `UF-12`: s_imp · `WF-17`: a_imp, s_link, s_prev | UF-15, UF-19 | DIRECT |
| FR-6.2, FR-6.5, QĐ-38 | 10.2 Vendor Normalization & Confidence | `UF-12`: s_conf, y_rec · `WF-17a`: a_ai, a_fair, a_high, a_med … | — | DIRECT |
| FR-6.4, QĐ-33b | 10.3 Per-Charge Reconciliation | `MF-8`: c_stmt · `UF-12`: d_stat, s_exc, y_rec · `WF-17`: c_norm, d_dept, d_stat, s_exc … | UF-15, UF-19 | DIRECT |
| FR-6.6→6.8, INV-13 | 10.4 Finding Queue & Risk Tiers | `UF-12`: s_conf, s_queue · `WF-17`: d_id, e_conf, s_find | UF-15, UF-19 | DIRECT |
| FR-6.9, FR-3.4c-1, BM-07 | 10.5 Legitimization Decision | `MF-8`: c_leg · `UF-12`: r_prov, r_recl, r_uf15a, r_uf15b … · `UF-15`: s_rc, s_rcdec, y_rc · `WF-17`: a_dh, a_it, a_itx, a_sach … | UF-19 | DIRECT |
| FR-5.14, QĐ-57a | 11.1 Role Dashboards | `UF-05`: t_start, y_notify · `UF-08`: y_rot · `UF-09`: s_over · `UF-10`: y_sent · `UF-11`: y_ntf · +3 sơ đồ | UF-01, UF-02, UF-03, UF-04, UF-06, UF-07, UF-12, UF-13, UF-14, UF-17, UF-19, UF-20, UF-21 | DIRECT |
| FR-5.14, FR-3.11, OI-09b | 11.2 Alert Catalog | `UF-01`: s_time, s_track · `UF-02`: s_review, s_time · `UF-03`: s_dl, s_stat · `UF-04`: s_rej, t_start, y_next, y_rej · `UF-05`: t_start, y_notify · +9 sơ đồ | UF-06, UF-07, UF-12, UF-13, UF-14, UF-17, UF-19 | DIRECT |
| FR-0.1→0.4 | 11.3 Five KPIs | — | UF-12, UF-19, WF-19 | N/A — bộ chỉ số KPI là đầu ra báo cáo/dashboard (BRD mục 2.3), không phải một bước trong luồng |
| FR-5.9 | 11.4 Savings Report | `UF-19`: s_pub · `WF-19`: a_pub | UF-12 | DIRECT |
| FR-5.10, FR-5.10a | 11.5 Usage Efficiency Report | `UF-06`: y_commit · `WF-13`: d_state | UF-05, UF-10 | DIRECT |
| FR-5.11, QĐ-29a | 11.6 Process Performance Report | `UF-11`: s_ask, y_note · `WF-09`: s_remind | UF-01, UF-02, UF-04, UF-08, UF-15, UF-21 | DIRECT |
| FR-5.12, FR-0.4 | 11.7 Data Quality Report | `WF-12`: s_commit | UF-03, UF-06, UF-07, UF-16 | DIRECT |
| FR-7.1→7.4 | 12.1 Six-Step Import with Preview | `UF-06`: d_src2, s_up, y_commit, y_parse · `WF-01`: a_up · `WF-12`: d_src2, s_commit, s_parse | UF-03, UF-07, UF-13, UF-16 | DIRECT |
| FR-7.5, FR-7.6 | 12.2 Time-Zone & Email Normalization | `UF-06`: y_parse · `UF-07`: s_queue · `WF-12a`: s_norm | — | DIRECT |
| FR-7.7 | 12.3 Source Conflict Records | `MF-8`: a_updsub, c_inv, d_ver, s_disc · `UF-14`: d_cause, s_case, s_close, s_inv … · `WF-16`: a_close, a_invs, a_upd, d_cause … | — | DIRECT |
| FR-9.1→9.7 | 12.4 Five-Step Setup Checklist | `WF-01`: a_dept, c_cat, c_sub, c_use … | UF-13 | DIRECT |
| FR-10.1 | 13.1 View Own Data | `UF-03`: s_dev, s_my · `UF-16`: s_dev | — | DIRECT |
| FR-10.2 | 13.2 Export Own Data | `UF-03`: s_dl, s_exp, y_exp | UF-16 | DIRECT |
| FR-10.7, OI-13 | 13.3 Correction Requests | `UF-03`: d_chg, s_corr, y_corr | UF-16 | DIRECT |
| FR-10.5, OI-01a | 13.4 Stop-Collection Requests | `UF-03`: d_auto, d_chg, r_uf16, s_dl … · `UF-16`: d_stop, d_valid, s_close, s_q … · `WF-18`: a_close, d_valid, e_stop, s_stop | UF-06, UF-09 | DIRECT |
| FR-10.4, QĐ-01 | 13.5 Tracking Notices | `UF-03`: s_dev · `UF-06`: d_first, y_notice · `UF-16`: s_notice · `WF-12`: d_first, s_notify · `WF-18`: s_notice | UF-07, UF-09 | DIRECT |
| FR-10.3, FR-10.6 | 13.6 Retention-Based Deletion | `MF-5`: s_close · `UF-09`: y_close · `WF-07`: s_close | UF-17 | DIRECT |
| FR-8.6, FR-8.11, QĐ-46 | 14.1 Accounts & Invitations | `UF-13`: d_post, s_acct, y_apply, y_inv · `UF-17`: b_link, b_ref, d_cur, d_link … · `WF-03`: a_acct, a_set, d_post, s_act … | UF-03, UF-09, UF-16 | DIRECT |
| FR-8.1, FR-8.7, FR-8.8 | 14.2 Role Assignment | `UF-13`: b_gate, d_gate, d_succ, s_acct … · `UF-17`: s_profile · `WF-03`: a_role, d_act, d_gate, d_succ … | — | DIRECT |
| FR-8.10, QĐ-44 | 14.3 Super Admin Transfer | `UF-13`: b_succ, d_succ, s_xf, y_xf · `WF-03`: d_gate, d_succ, e_xf, s_xf | UF-17 | DIRECT |
| FR-8.2 | 14.4 Approver & Threshold Settings | `UF-13`: s_cfg, s_home · `WF-03`: a_cfg, d_act, s_redet | UF-17 | DIRECT |
| FR-8.3, INV-05, OI-08c | 14.5 Append-Only Audit Trail | `UF-13`: s_home, y_apply · `WF-03`: a_aud, e_aud, s_apply | UF-17 | DIRECT |
| FR-8.4 | 14.6 Background Job Monitor | `UF-13`: s_home · `WF-03`: a_aud, e_aud | UF-17 | DIRECT |
| QĐ-49e(1), BRD 6.4 | 15.1 Pending-Request Summary | `MF-2`: a_need · `UF-04`: s_queue · `WF-09`: a_need | UF-01, UF-02, UF-08, UF-11, UF-15, UF-21 | DIRECT |
| QĐ-49e(2), BRD 6.4 | 15.2 Cost Report Narrative Draft | `MF-8`: a_edit, s_ai · `UF-19`: d_ai, s_edit, y_ai · `WF-19`: a_edit, d_ai, s_ai | UF-11, UF-12, UF-14, UF-15 | DIRECT |

Tổng: **83** DIRECT · **0** GAP · **1** N/A trên 84 chức năng.

### 6.1. Kiểm ngược: yêu cầu BRD chưa có chức năng hoặc node

Mã `FR` được định nghĩa trong BRD: **123**. Chưa xuất hiện ở cột yêu cầu của chức năng nào **và** không node nào mang mã: `FR-11.1`, `FR-6.10`, `FR-8.5`, `FR-9.6`. Danh sách này là tín hiệu để rà, không tự kết luận yêu cầu bị thiếu. Bộ sinh chỉ đọc **mã đầu** của khoảng mã ở cột yêu cầu (ví dụ `FR-0.1 → 0.4`, `FR-9.1 → 9.7`), nên mã nằm trong khoảng vẫn có thể xuất hiện ở cột yêu cầu dạng khoảng mà không được tính ở đây. **DIRECT chỉ nghĩa là có ít nhất một node dẫn mã đầu của cột yêu cầu trong phạm vi luồng — không chứng minh mọi mã trong khoảng hay mọi tiêu chí chấp nhận đã được vẽ.**

| Mã | Phân loại | Nơi thể hiện / lý do |
| --- | --- | --- |
| `FR-11.1` | Quy tắc chung (bao trùm) | Quản lý các loại hồ sơ BM-01…BM-08: từng biểu mẫu đã có mã `BM-xx` trên node và ở cột yêu cầu của FDD; mã bao trùm không gắn hàng loạt lên node. Bàn giao: `HO-80`, `HO-03`. |
| `FR-6.10` | Hoãn / ngoài phạm vi sơ đồ | BRD ghi *không hiện thực ở MVP* (đặc tả cho tương lai); ngoài phạm vi theo BRD 3.2, 5.6.1 và `QĐ-31a`. Ranh giới nêu ở `WF-17` (`excluded`), Context và hướng dẫn FDD; không gắn mã lên node. |
| `FR-8.5` | Quy tắc chung (tách quyền) | Cụ thể hóa `SoD-1`: Super Admin không thực hiện thao tác nghiệp vụ. Thể hiện bằng việc làn Super Admin chỉ có node quản trị và các điểm nói rõ không duyệt thay (`WF-03 d_act`, `WF-09 s_wait`, `WF-17 d_out`); enforce ở guard API, không phải bước luồng. |
| `FR-9.6` | Quy tắc chung (phi chức năng, trình bày) | Trạng thái rỗng của màn hình dẫn về bước khởi tạo còn thiếu là quy tắc trình bày xuyên màn hình; chờ UI Spec/Figma (`QĐ-08`, `US-02-04`, `CN-15`). Không có node thể hiện — không phải bước luồng, không gắn lên `WF-01`. |

### 6.2. Kiểm ngược: node sơ đồ chưa dẫn nguồn

Node bước (hành động, rẽ nhánh, gọi, sự kiện, màn hình) không có trường `rules`. Phần lớn là bước nối/hiển thị đã giải thích trong `vi`; cần dẫn nguồn nếu bước mang quy tắc nghiệp vụ.

| Sơ đồ | Node chưa có `rules` |
| --- | --- |
| `MF-2` | d_need, d_prov |
| `MF-4` | t_dead, d_auto, d_dec |
| `MF-5` | d_conf |
| `MF-7` | t_eff, d_out, t_due, d_choice, d_open, d_more |
| `MF-8` | d_stmt, d_var, d_cause, d_ai |
| `UF-01` | d_cat, r_uf02, d_res |
| `UF-02` | d_need, d_alt, d_spend, d_res |
| `UF-03` | d_act, d_out |
| `UF-04` | r_uf15 |
| `UF-05` | r_uf10 |
| `UF-06` | r_uf07 |
| `UF-08` | d_op |
| `UF-10` | r_uf05 |
| `UF-11` | d_item, r_uf15, d_op |
| `UF-12` | d_v |
| `UF-13` | r_uf17 |
| `UF-14` | d_ver |
| `UF-15` | d_type |
| `UF-17` | d_what, d_act, d_chg |
| `UF-18` | r_uf21 |
| `UF-21` | r_uf01, d_res |
| `WF-08` | d_dec |
| `WF-09` | d_ass, d_res |
| `WF-09a` | d_op |
| `WF-11` | d_res, d_ext |
| `WF-20` | d_op |

## 7. Ánh xạ mã cũ → mới

| Mã cũ | Vị trí mới |
| --- | --- |
| MF-1 Organization Setup | SF-1 → `WF-01`, `WF-02` |
| MF-2, MF-4, MF-5, MF-7, MF-8 | Giữ mã, vẽ lại |
| MF-3 Usage Evidence & Ghost Seat | SF-4 → `WF-12`, `WF-12a`, `WF-13`, `WF-13a`, `WF-14`, `WF-18` |
| MF-6 Shadow IT / Spend Reconciliation | Luồng con của MF-8 → `WF-17`, `WF-17a` |
| `MF-0` → `MF-5` trong tài liệu F-xx cũ | Xem [main-flow-selection.md mục 5.2](main-workflows-activity-diagram/main-flow-selection.md) |
| `UF-01` → `UF-17` (bản Mermaid/Việt) | Giữ mã, vẽ lại bằng tiếng Anh; thêm `UF-18` → `UF-21` |
| Tài liệu F-01 → F-48 (User Flows nghiệp vụ) | Giữ nguyên văn ở [user-flows/business-flow-catalog.md](user-flows/business-flow-catalog.md), chưa đồng bộ |

## 8. Kiểm chứng {#kiem-chung}

Lệnh kiểm lại toàn bộ (từ `Docs/Diagrams`):

```bash
python tools/flowkit.py check "specs/*.json"
python context-diagram/tools/build_context_diagram.py --check
python functional-decomposition-diagram/build_fdd.py --check
python tools/build_index.py --check
```

Kết quả kiểm của lượt vẽ lại 08/10/2026 và danh sách ảnh đã xem: [verification-2026-10-08.md](verification-2026-10-08.md).
