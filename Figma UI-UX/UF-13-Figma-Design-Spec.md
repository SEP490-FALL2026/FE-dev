# SaaS-Sentry — Đặc tả thiết kế Figma cho UF-13

> **Phiên bản:** 1.0 — 17/09/2026  
> **Trạng thái:** Đã hiện thực và kiểm chứng  
> **Hình thức bàn giao:** 32 ảnh PNG độc lập — 16 trạng thái Light và 16 trạng thái Dark; mỗi ảnh là một artboard desktop đầy đủ (1440 × 1024), không ghép contact sheet  
> **Phạm vi:** Desktop web 1440 × 1024; user flow `UF-13` — Super Admin sửa cấu hình và luồng phê duyệt  
> **Nguồn nghiệp vụ:** [BRD v3.11](../Requiments/BRD%20-%20HỆ%20THỐNG%20QUẢN%20TRỊ%20BẢN%20QUYỀN%20PHẦN%20MỀM%20%26%20TỐI%20ƯU%20CHI%20PHÍ%20CÔNG%20NGHỆ.md), [User Flows mục 11.16](../Diagrams/user-flows/index.md#1116-uf-13--super-admin-sửa-cấu-hình-và-luồng-phê-duyệt), [UF-13.drawio](../Diagrams/user-flows/drawio/UF-13.drawio)  
> **Visual reference:** [ThemeDarkExample.jpg](ThemeDarkExample.jpg), [ThemeLightExample.jpg](ThemeLightExample.jpg), bộ ảnh `UF-07-FullFrames`, `UF-08-FullFrames`, `UF-14-FullFrames`, `UF-16-FullFrames`

---

## 1. Mục tiêu và nguyên tắc nghiệp vụ

Thiết kế bộ giao diện Figma hoàn chỉnh cho **Super Admin (QT - Quản trị hệ thống)** quản lý cấu hình hệ thống, thiết lập phạm vi và ngưỡng lãng phí đa tầng (`ADM-02`), biên tập luồng phê duyệt và kiểm tra qua khối xem thử mô phỏng (`ADM-03`), và cơ chế chặn phân tách trách nhiệm tối thượng (`SYS-04`).

### Các nguyên tắc nghiệp vụ cốt lõi:

1. **Phân định trách nhiệm tối thượng (`SoD-1`, `BR-37.1`):**
   Super Admin chỉ cấu hình luật hệ thống, tuyệt đối **không tham gia tác nghiệp thường nhật** (không cấp phát bản quyền, không gán suất cho nhân viên, không phê duyệt yêu cầu nghiệp vụ). Nếu cố tình thao tác gán suất hoặc duyệt yêu cầu, hệ thống sẽ **CHẶN NGAY LẬP TỨC tại màn hình `SYS-04`**.
2. **Thứ tự ưu tiên ghi đè ngưỡng phát hiện lãng phí (`BR-20.1`):**
   Phân giải theo 3 tầng rõ ràng: `Từng ứng dụng > Toàn tổ chức > Mặc định hệ thống` (đã bỏ cấp phòng ban theo `QĐ-23`). Ví dụ: Figma dùng ngưỡng riêng 30 ngày không dùng, ghi đè mức tổ chức 60 ngày.
3. **Cấu hình Người duyệt chi và Người thay thế khi xung đột (`BR-13.10`, `FR-3.13`, `FR-3.15`):**
   - Người duyệt chi (DC) mặc định là CEO (`FR-3.13`), quyết định dựa trên snapshot ngân sách (`QĐ-29b`).
   - Người thay thế khi xung đột lợi ích là cấu hình tĩnh của Quản trị hệ thống, lập trước (`BR-13.10`). Chỉ áp dụng khi Người duyệt chi là người yêu cầu hoặc thụ hưởng license (ví dụ COO thay CEO duyệt). Không để người duyệt tự chọn, không tạo ứng viên song song.
4. **Cấu hình Ngưỡng Backlog cảnh báo (`FR-3.8`):**
   Cảnh báo tắc nghẽn khi bước duyệt tồn đọng quá số ngày quy định hoặc vượt quá số lượng ticket cho phép.
5. **Nội dung thông báo theo dõi có đánh phiên bản (`BR-42.5`):**
   Khi nội dung thông báo minh bạch thay đổi ⟹ hệ thống tự động sinh **phiên bản mới** (ví dụ `v1.2` ➔ `v1.3`). Toàn bộ nhân viên phải bấm xác nhận chủ động lại trước khi thiết bị tiếp tục gửi dữ liệu.
6. **Khối xem thử (Simulation Sandbox) trong biên tập luồng duyệt (`ADM-03` · `a3`, `d3`, `a4`):**
   Không có khối xem thử thì Super Admin chỉnh chính sách trong bóng tối, sai sót chỉ lộ ra khi một yêu cầu thật đi sai đường. Khối xem thử cho phép mô phỏng tình huống giả định để kiểm tra chuỗi bước sinh ra trước khi áp dụng.
7. **Quy tắc bỏ duyệt chi khi không phát sinh chi phí (`QĐ-29a`):**
   Nếu yêu cầu cấp phát từ kho license sẵn có (0 VNĐ) thì không qua Người duyệt chi, chỉ cần Quản lý trực tiếp xác nhận.
8. **Hiệu lực chính sách và Nhật ký kiểm toán Append-Only (`BR-37.2`, `BR-38.1`):**
   - Nhật ký kiểm toán chỉ được ghi thêm (Append-only), không sửa, không xóa.
   - Sửa chính sách duyệt không ảnh hưởng các yêu cầu đang chạy (in-flight); đổi người giữ vai thì bước đang chờ được xác định lại theo `BR-13.9`. Chính sách mới chỉ áp dụng cho yêu cầu tạo từ nay.

---

## 2. Chuẩn Thiết Kế Hệ Thống & Bảng Màu

### 2.1. Light Theme (`ThemeLightExample.jpg`)
- Canvas nền (`--bg`): `#fff9f2` (warm cream)
- Sidebar (`--sidebar`): `#fff4e8`
- Surface / Cards (`--surface`): `#ffffff` (viền `#efddca`, bo góc `8px`–`12px`)
- Accent Brand Color (`--primary`): `#ff7417` (warm energetic SaaS orange)
- Chữ chính (`--text`): `#2b241f`, Chữ phụ (`--muted`): `#897568`
- Badge trạng thái:
  * Info: `#237df0` / soft: `#eaf4ff`
  * Success: `#16875a` / soft: `#eaf8f1`
  * Warning: `#b86a00` / soft: `#fff3d8`
  * Danger: `#d84040` / soft: `#fff0ef`
  * Manual: `#8757c7` / soft: `#f3ecff`

### 2.2. Dark Theme (`ThemeDarkExample.jpg`)
- Canvas nền (`--bg`): `#07182d` (deep rich navy)
- Sidebar (`--sidebar`): `#061426`
- Surface / Cards (`--surface`): `#0d223a` (viền `#213d5c`, bo góc `8px`–`12px`)
- Accent Brand Color (`--primary`): `#2d86ff` (vibrant electric blue)
- Chữ chính (`--text`): `#f5f9ff`, Chữ phụ (`--muted`): `#91a8c2`
- Badge trạng thái:
  * Info: `#4d9cff` / soft: `#123b69`
  * Success: `#43d59a` / soft: `#123e38`
  * Warning: `#ffb53f` / soft: `#4b3716`
  * Danger: `#ff6d72` / soft: `#4b222b`
  * Manual: `#b78aff` / soft: `#342954`

---

## 3. Kiến Trúc Bố Cục & Sổ Dữ Liệu Đồng Bộ

### 3.1. Bố cục Artboard (Desktop 1440 × 1024)
1. **Sidebar cố định bên trái (240px):**
   - Logo SaaS-Sentry, menu điều hướng (*Tổng quan hệ thống, Cấu hình phạm vi & Ngưỡng [Active], Luồng phê duyệt [Active], Vai trò & Chính sách, Nhật ký kiểm toán, Cảnh báo bảo mật*).
   - Thẻ tài khoản: Luôn hiển thị vai trò **Super Admin** `Nguyễn Văn Quản · Quản trị hệ thống (quan.nguyen@company.com)`.
2. **Top Bar (Cao 60px):** Thanh tìm kiếm, thẻ mã màn hình (`ADM-02` / `ADM-03` / `SYS-04`), breadcrumb, badge thông tin quyền hạn `Super Admin (SoD-1 Active)`.
3. **Stepper 6 Chặng ngang (Stage Indicator):**
   `[1] Tổng quan & Ngưỡng lãng phí` → `[2] Phân quyền & Chặn SoD` → `[3] Vai trò & Chính sách` → `[4] Biên tập luồng duyệt` → `[5] Khối xem thử Sandbox` → `[6] Áp dụng & Audit Log`.
4. **Khu vực làm việc trung tâm:** Ma trận phân giải ngưỡng, trình soạn thảo luồng duyệt, sandbox mô phỏng tình huống, bảng SoD chặn truy cập, và panel audit log append-only.

---

### 3.2. Sổ Dữ Liệu Chuẩn Xuyên Suốt (Synchronized State Ledger)

| Sau Frame | Số chính sách (`activePolicies`) | Phiên bản chính sách Figma (`policyVersion`) | Phiên bản thông báo (`noticeVersion`) | Dòng Audit Log (`auditLogCount`) | Yêu cầu đang chạy (`inFlightRequests`) | Diễn giải sự kiện nghiệp vụ |
|:---:|:---:|:---:|:---:|:---:|:---:|---|
| **01** | 12 | v2.1 | v1.2 | 842 | 5 | **Baseline ban đầu**: 12 chính sách, chính sách Figma v2.1, thông báo v1.2, 842 logs, 5 yêu cầu đang chạy. |
| **02** | 12 | v2.1 | v1.2 | 842 | 5 | Super Admin cấu hình ngưỡng lãng phí đa tầng (`a1` · `BR-20.1`): Figma 30 ngày, tổ chức 60 ngày. |
| **03** | 12 | v2.1 | v1.2 | 842 | 5 | Hệ thống phân giải và hiển thị ma trận ưu tiên ghi đè (`s1`): Figma dùng ngưỡng riêng ghi đè tổ chức. |
| **04** | 12 | v2.1 | v1.2 | 842 | 5 | Giả định Super Admin cố tình can thiệp gán suất hoặc duyệt yêu cầu tác nghiệp (`d2`). |
| **05** | 12 | v2.1 | v1.2 | **843** | 5 | **SYS-04 CHẶN PHÂN QUYỀN (`b1` ➔ `e1` · `BR-37.1` · `SoD-1`)**: Ghi log vi phạm SoD (842 ➔ 843). Thao tác bị từ chối. |
| **06** | 12 | v2.1 | v1.2 | 843 | 5 | Cấu hình Người duyệt chi: chọn `Phạm Hoàng Nam (CEO)` (`a5` · `FR-3.13`). |
| **07** | 12 | v2.1 | v1.2 | 843 | 5 | Cấu hình Người thay thế khi xung đột lợi ích: chọn `Vũ Đình Khoa (COO)` (`a5` · `BR-13.10`). |
| **08** | 12 | v2.1 | v1.2 | 843 | 5 | Cấu hình ngưỡng backlog cảnh báo: > 3 ngày hoặc > 8 yêu cầu (`a5` · `FR-3.8`). |
| **09** | 12 | v2.1 | **v1.3** | **844** | 5 | Cập nhật nội dung thông báo minh bạch ⟹ nâng phiên bản `v1.2` ➔ `v1.3` (`s5` · `BR-42.5`). Log tăng 843 ➔ 844. |
| **10** | 12 | v2.1 | v1.3 | 844 | 5 | Mở phân hệ `ADM-03`, chọn biên tập chính sách `POL-DES-2026` (Figma Enterprise). |
| **11** | 12 | v2.1 | v1.3 | 844 | 5 | Soạn thảo điều kiện và chuỗi bước duyệt mới: Bước 1 (QL) ➔ Bước 2 (Người duyệt chi DC) (`a2`). |
| **12** | 12 | v2.1 | v1.3 | 844 | 5 | Khối xem thử (Simulation Sandbox): Giả lập yêu cầu Figma 12.000.000 VNĐ (`a3`). |
| **13** | 12 | v2.1 | v1.3 | 844 | 5 | Phát hiện chuỗi bước chưa đúng ý (`d3=chưa đúng` ➔ `a4`): Thiếu nhánh cấp từ kho sẵn có 0 VNĐ. |
| **14** | 12 | v2.1 | v1.3 | 844 | 5 | Sửa chuỗi bước: Cấp từ kho 0 VNĐ bỏ qua duyệt chi (`QĐ-29a`). Chạy lại mô phỏng thành công (`d3=đúng`). |
| **15** | **13** | **v2.2** | v1.3 | **845** | 5 | Lưu áp dụng chính sách mới: Phiên bản lên `v2.2`. Ghi Audit log append-only (`s3` · `BR-38.1`). Log tăng 844 ➔ 845. |
| **16** | 13 | v2.2 | v1.3 | 845 | 5 | Hiệu lực chính sách (`s4` ➔ `e2` · `BR-37.2`): 5 yêu cầu đang chạy giữ chính sách cũ, yêu cầu mới áp dụng v2.2. |

---

## 4. Danh Sách 16 Màn Hình Chi Tiết

*(Mỗi màn hình được định nghĩa đầy đủ theo chuẩn 1440 × 1024, hỗ trợ Light và Dark theme đồng bộ 100%)*
