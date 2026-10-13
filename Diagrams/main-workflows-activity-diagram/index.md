# Main Business Flows — 5 luồng nghiệp vụ chính

> **Phiên bản:** 3.1 — 10/10/2026 (3.0 — 08/10/2026) · **Căn cứ:** BRD v3.32, sổ quyết định `QĐ-01` → `QĐ-64` (thứ tự: `QĐ` → BRD → sơ đồ) · **Trạng thái:** vẽ lại sau Review 1 của hội đồng; quyết định trong sơ đồ là của Owner, **chưa** phải xác nhận của GVHD/hội đồng.
>
> Lý do chọn đúng năm luồng, ánh xạ mã cũ → mới và đánh đổi: [main-flow-selection.md](main-flow-selection.md). Bộ sơ đồ toàn dự án: [index chung](../index.md).

## 1. Năm main flow — thứ tự trình bày

| # | Mã | Tên (trên hình) | Phục vụ | Kết quả cuối | Hình | Giải thích |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | **MF-2** | Access Request, Approval & Provisioning | PP-5 — đường chính thức nhanh, có kiểm soát | Quyền được cấp / từ chối có lý do / đóng | [PNG](MF-2-access-request-approval-provisioning.drawio.png) · [.drawio](MF-2-access-request-approval-provisioning.drawio) | [MF-2](MF-2-access-request-approval-provisioning.md) |
| 2 | **MF-7** | Department Transfer & Access Adjustment | Review 1 Phần 3 — điều chuyển không phải thu hồi | Quyền khớp phòng mới; chi phí chia theo ngày | [PNG](MF-7-department-transfer-access-adjustment.drawio.png) · [.drawio](MF-7-department-transfer-access-adjustment.drawio) | [MF-7](MF-7-department-transfer-access-adjustment.md) |
| 3 | **MF-5** | Offboarding & Access Reclaim | Chi phí + bảo mật (G2); dữ liệu nội bộ | Không còn quyền, dữ liệu đã bàn giao | [PNG](MF-5-offboarding-access-reclaim.drawio.png) · [.drawio](MF-5-offboarding-access-reclaim.drawio) | [MF-5](MF-5-offboarding-access-reclaim.md) |
| 4 | **MF-8** | Period Software Cost Control & Allocation | PP-3 — chi phí về đúng Cost Center; thuế ghi nhận | Báo cáo kỳ theo chi phí thực chịu | [PNG](MF-8-period-software-cost-control.drawio.png) · [.drawio](MF-8-period-software-cost-control.drawio) | [MF-8](MF-8-period-software-cost-control.md) |
| 5 | **MF-4** | Subscription Renewal, Reduction or Cancellation | PP-2 — quyết trước hạn chót báo hủy là mục tiêu; quyết muộn vẫn được thực hiện (`QĐ-62k`) | Gia hạn / giảm / hủy, tiết kiệm tại kỳ gia hạn | [PNG](MF-4-subscription-renewal-decision.drawio.png) · [.drawio](MF-4-subscription-renewal-decision.drawio) | [MF-4](MF-4-subscription-renewal-decision.md) |

**Câu chuyện một hơi:** nhân viên **xin** công cụ (MF-2) → khi đổi phòng thì quyền được **điều chỉnh** (MF-7) → khi nghỉ thì quyền được **thu hồi** sau khi dữ liệu đã bàn giao (MF-5) → mỗi kỳ chi phí được **quy về đúng phòng** theo chi phí thực chịu (MF-8) → trước hạn chót báo hủy, phát hiện lãng phí được **biến thành tiền thật** (MF-4).

## 2. Không phải main flow — nhưng vẫn trong phạm vi

| Mã | Vai trò | Hình chi tiết |
| --- | --- | --- |
| SF-1 (MF-1 cũ) | Khởi tạo tổ chức, danh mục, dữ liệu ban đầu | `WF-01`, `WF-02` |
| SF-2 | Quản trị hệ thống và audit | `WF-03` |
| SF-3 | Nghỉ dài, hết hạn quyền có thời hạn | `WF-06`, `WF-08` |
| SF-4 (MF-3 cũ) | Bằng chứng sử dụng và tối ưu ghost seat | `WF-12`, `WF-12a`, `WF-13`, `WF-13a`, `WF-14`, `WF-18` |
| MF-6 cũ | *Đối soát chi phí phần mềm* — luồng con của MF-8 | `WF-17`, `WF-17a` |

Danh sách workflow: [Business Workflows](../workflows-activity-diagram/index.md).

## 3. Ký pháp chung

UML Activity có swimlane dọc; mỗi làn là một vai, hành động nằm ở làn của người thực hiện. Ký hiệu và cách đọc giải thích trong từng tệp `.md`; quy ước sinh hình: [tools/README.md](../tools/README.md). Mọi chữ trên hình bằng tiếng Anh, nền trắng, không ghi chú trên hình.

## 4. Nguồn canonical và kiểm chứng

| Sơ đồ | Spec (nguồn canonical) |
| --- | --- |
| MF-2 | [specs/MF-2.json](../specs/MF-2.json) |
| MF-7 | [specs/MF-7.json](../specs/MF-7.json) |
| MF-5 | [specs/MF-5.json](../specs/MF-5.json) |
| MF-8 | [specs/MF-8.json](../specs/MF-8.json) |
| MF-4 | [specs/MF-4.json](../specs/MF-4.json) |

Sinh lại và kiểm: `python tools/flowkit.py build "specs/MF-*.json" --png` rồi `python tools/flowkit.py check "specs/MF-*.json"` (từ `Docs/Diagrams`). Kết quả kiểm của lượt này ghi ở [index chung](../index.md#kiem-chung).
