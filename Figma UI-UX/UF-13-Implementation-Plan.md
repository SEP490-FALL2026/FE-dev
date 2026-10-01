# SaaS-Sentry — Kế hoạch Triển khai & Bộ Mã Nguồn UF-13

> **User Flow:** UF-13 — Super Admin sửa cấu hình và luồng phê duyệt  
> **Tác nhân:** Super Admin (QT - Quản trị hệ thống)  
> **Mục tiêu:** Sinh 32 ảnh PNG độc lập (16 Light + 16 Dark, 1440 × 1024) không tràn viền, kiểm chứng bằng unit test và script kiểm tra tự động.

---

## 1. Cấu trúc thư mục nguồn

```
c:\fe_capstone\docs\Figma UI-UX\
├── UF-13-Figma-Design-Spec.md
├── UF-13-Implementation-Plan.md
├── UF-13-Sources/
│   ├── uf13-data.js
│   ├── uf13-data.test.js
│   ├── uf13-renderer.js
│   ├── uf13-renderer.test.js
│   ├── uf13.css
│   ├── uf13.html
│   ├── capture-uf13.ps1
│   └── verify-uf13-assets.ps1
└── UF-13-FullFrames/
    ├── Light/ (16 PNGs)
    └── Dark/  (16 PNGs)
```

---

## 2. Các bước triển khai

1. **Khởi tạo Data & Ledger (`uf13-data.js`):** Định nghĩa 16 frames, breadcrumb, stepper 6 chặng, state ledger chuyển biến qua từng bước.
2. **Khởi tạo Renderer (`uf13-renderer.js`):** Template generator cho các màn hình:
   - `ADM-02`: Bảng cấu hình ngưỡng đa tầng, Ma trận ưu tiên ghi đè, Modal cấu hình Người duyệt chi (CEO), Modal Người thay thế xung đột lợi ích (COO), Modal cấu hình ngưỡng backlog, Editor thông báo minh bạch đánh phiên bản v1.3.
   - `SYS-04`: Màn hình chặn phân quyền đỏ SoD-1 (Super Admin không có quyền gán suất / duyệt yêu cầu).
   - `ADM-03`: Danh sách chính sách phê duyệt, Trình soạn thảo điều kiện & chuỗi bước duyệt, Khối xem thử Simulation Sandbox (mô phỏng tình huống, phát hiện lỗi thiếu nhánh, sửa đổi thành công), và Panel Audit log append-only.
3. **Thiết kế Styling (`uf13.css`):**
   - Palette màu chuẩn Light (`#fff9f2`, `#ff7417`) và Dark (`#07182d`, `#2d86ff`).
   - Component simulation canvas, multi-tier threshold table, SoD alert banner, policy step nodes, and audit stream cards.
4. **Kiểm tra tự động (`uf13-data.test.js` & `uf13-renderer.test.js`):**
   - Đảm bảo 16/16 frames hợp lệ, biến ledger biến thiên chính xác, render HTML sạch, không layout overflow.
5. **Xuất ảnh Headless Chrome (`capture-uf13.ps1`):**
   - Xuất 16 ảnh Light + 16 ảnh Dark = 32 file PNG 1440 × 1024.
6. **Kiểm tra chất lượng ảnh (`verify-uf13-assets.ps1`):**
   - Độ phân giải chuẩn 1440 × 1024, dung lượng file hợp lệ.
