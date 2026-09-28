# Hướng dẫn Chuyển đổi & Đưa 122 Frames Thiết kế (UF-07, 08, 09, 10) lên Figma (Light & Dark Theme)

> **Dành cho:** Nhóm dự án Capstone SaaS-Sentry  
> **Phạm vi tài sản:** 122 ảnh raster FullFrame chuẩn Desktop **1440 × 1024** px thuộc 4 User Flow quản trị trọng tâm:
> - **UF-07:** IT Admin xử lý hàng đợi chưa khớp danh tính (11 Light + 11 Dark = **22 frames**)
> - **UF-08:** IT Admin xử lý hàng đợi cấp phát và thu hồi (16 Light + 16 Dark = **32 frames**)
> - **UF-09:** IT Admin xử lý nhân viên nghỉ việc (16 Light + 16 Dark = **32 frames**)
> - **UF-10:** IT Admin xử lý bảng tối ưu license (18 Light + 18 Dark = **36 frames**)
> **Tổng cộng:** **122 frames độc lập** phủ trọn vẹn cả 2 theme **Light Theme** và **Dark Theme**.

---

## 🎯 Ba phương thức đưa lên Figma

Bạn có thể lựa chọn 1 trong 3 phương thức dưới đây tùy theo nhu cầu làm storyboard hay dựng component vector:

| Phương thức | Tốc độ | Kết quả trên Figma | Khi nào nên dùng? |
| :--- | :---: | :--- | :--- |
| **Cách 1: Figma Importer Plugin (Khuyên dùng)** | **~30 giây** | Tự động tạo 4 Section, xếp 2 hàng Light/Dark song song, gán đúng tên frame tiếng Việt chuẩn | **Bàn giao đồ án, báo cáo hội đồng, làm Storyboard & Prototype review** |
| **Cách 2: Kéo thả thủ công từ Windows Explorer** | **~3–5 phút** | 122 ảnh trên Canvas, tự gom nhóm bằng tay | Khi không muốn chạy Node.js hoặc chỉ muốn đưa lẻ vài màn hình |
| **Cách 3: Vector hóa qua plugin "html.to.design"** | **Từng frame** | Vector component, editable text, auto layout | Khi cần chỉnh sửa chi tiết text, nút bấm hoặc trích xuất Design System |

---

## 🚀 CÁCH 1: TỰ ĐỘNG HÓA 1-CLICK BẰNG FIGMA PLUGIN (NHANH NHẤT & CHUẨN NHẤT)

Nhóm đã đóng gói sẵn bộ công cụ **SaaS-Sentry Figma Importer Plugin** nằm tại thư mục:  
📁 `docs/Figma UI-UX/figma-importer-plugin/`

### Bước 1: Khởi động Local Server cấp phát ảnh & metadata
Trong thư mục `docs/Figma UI-UX/figma-importer-plugin/`:
- **Trên Windows:** Click đúp chuột vào file [`start-importer.bat`](figma-importer-plugin/start-importer.bat).
- **Hoặc chạy qua Terminal / PowerShell:**
  ```powershell
  cd "docs/Figma UI-UX/figma-importer-plugin"
  node server.js
  ```
- Terminal sẽ thông báo: `SaaS-Sentry Figma Importer Server đang chạy tại http://localhost:3840` (giữ nguyên cửa sổ này).

### Bước 2: Nạp Plugin vào Figma
1. Mở ứng dụng **Figma** (Desktop App hoặc Web Figma trên trình duyệt).
2. Tạo một file thiết kế mới (hoặc mở file dự án của bạn).
3. Nhấp vào **Menu Figma** (biểu tượng logo Figma ở góc trên bên trái) ➔ chọn **Plugins** ➔ **Development** ➔ **Import plugin from manifest...**.
4. Chọn file [`manifest.json`](figma-importer-plugin/manifest.json) trong thư mục `docs/Figma UI-UX/figma-importer-plugin/`.

### Bước 3: Tiến hành Import tự động
1. Bấm phím tắt `Shift + I` ➔ chọn tab **Plugins** ➔ chọn **SaaS-Sentry UI Importer (UF-07 to 10)** vừa thêm.
2. Cửa sổ plugin mở ra:
   - Plugin tự động kiểm tra và báo: `🟢 Đã kết nối Local Server (122 frames)`.
   - Chọn Flow: `Tất cả 4 Flow (122 frames)` (hoặc chọn riêng UF bạn muốn).
   - Chọn Theme: `Cả 2 Theme (Light & Dark song song)`.
3. Nhấp vào nút xanh: **`🚀 Bắt đầu Import lên Figma`**.
4. Chờ thanh tiến trình chạy trong khoảng 15–30 giây:
   - Toàn bộ **122 Frame 1440 × 1024** sẽ được tự động vẽ lên Canvas.
   - Chia thành 4 Section lớn (`UF-07`, `UF-08`, `UF-09`, `UF-10`).
   - Mỗi Section có 2 hàng: Hàng 1 là **Light Theme**, Hàng 2 là **Dark Theme** thẳng hàng nhau để hội đồng hoặc team dev tiện đối chiếu.
   - Tên từng frame được gán đầy đủ: Ví dụ `UF-08-Light-01: Hàng đợi thực thi cấp phát`, `UF-09-Dark-08: Năm khuyến nghị G2 cần xử lý ngay`,...

---

## 📂 CÁCH 2: KÉO THẢ THỦ CÔNG TỪ WINDOWS EXPLORER VÀO FIGMA

Nếu bạn không muốn chạy Node.js:
1. Trong Figma, tạo 4 **Section** (phím tắt `Shift + S`) đặt tên:
   - `UF-07 · Hàng đợi chưa khớp danh tính`
   - `UF-08 · Hàng đợi cấp phát và thu hồi`
   - `UF-09 · Xử lý nhân viên nghỉ việc`
   - `UF-10 · Bảng tối ưu license`
2. Mở File Explorer trên máy tính, truy cập vào các thư mục:
   - `docs\Figma UI-UX\UF-07-FullFrames\Light` & `Dark`
   - `docs\Figma UI-UX\UF-08-FullFrames\Light` & `Dark`
   - `docs\Figma UI-UX\UF-09-FullFrames\Light` & `Dark`
   - `docs\Figma UI-UX\UF-10-FullFrames\Light` & `Dark`
3. Chọn toàn bộ file PNG và kéo thả trực tiếp vào từng Section trên Canvas của Figma.
4. Đổi tên layer/frame tương ứng theo bảng danh mục màn hình.

---

## 🎨 CÁCH 3: BIẾN THÀNH VECTOR/COMPONENT CHỈNH SỬA ĐƯỢC BẰNG PLUGIN "HTML.TO.DESIGN"

Nếu hội đồng hoặc nhóm cần các layer vector editable (chỉnh sửa text, đổi màu button, responsive auto layout thật):
Vì trong các folder `UF-07-Sources` đến `UF-10-Sources`, chúng ta đã có sẵn mã HTML/CSS/JS render pixel-perfect chuẩn W3C:

1. **Khởi động HTTP Server phục vụ HTML**:
   Mở terminal tại thư mục gốc và chạy:
   ```bash
   npx serve "docs/Figma UI-UX" -p 5000
   ```
2. **Cài đặt Plugin**:
   Trong Figma Community, tìm và cài plugin **[html.to.design](https://www.figma.com/community/plugin/1159128288015633845)**.
3. **Import theo URL**:
   - Mở plugin **html.to.design**.
   - Nhập URL màn hình bạn muốn chuyển thành vector, ví dụ:
     - `http://localhost:5000/UF-08-Sources/uf08.html?theme=light&screen=01`
     - `http://localhost:5000/UF-08-Sources/uf08.html?theme=dark&screen=01`
     - `http://localhost:5000/UF-10-Sources/uf10.html?theme=light&screen=18`
   - Thiết lập Viewport: **1440 × 1024**.
   - Bấm **Import**: Plugin sẽ dịch toàn bộ DOM HTML, CSS Variables, Typography, SVG icons và Layout flexbox thành các Node Figma Vector và Auto Layout hoàn toàn chỉnh sửa được!

---

## 🗺️ Bố cục Canvas Figma sau khi Import

```text
+-------------------------------------------------------------------------------------------------------------+
|  SECTION: UF-07 · Hàng đợi chưa khớp danh tính (11 màn hình)                                                |
|  [☀️ LIGHT]  [UF-07-Light-01]  [UF-07-Light-02]  ...  [UF-07-Light-11]                                      |
|  [🌙 DARK ]  [UF-07-Dark-01]   [UF-07-Dark-02]   ...  [UF-07-Dark-11]                                       |
+-------------------------------------------------------------------------------------------------------------+

+-------------------------------------------------------------------------------------------------------------+
|  SECTION: UF-08 · Hàng đợi cấp phát và thu hồi (16 màn hình)                                                |
|  [☀️ LIGHT]  [UF-08-Light-01]  [UF-08-Light-02]  ...  [UF-08-Light-16]                                      |
|  [🌙 DARK ]  [UF-08-Dark-01]   [UF-08-Dark-02]   ...  [UF-08-Dark-16]                                       |
+-------------------------------------------------------------------------------------------------------------+

+-------------------------------------------------------------------------------------------------------------+
|  SECTION: UF-09 · Xử lý nhân viên nghỉ việc (16 màn hình)                                                   |
|  [☀️ LIGHT]  [UF-09-Light-01]  [UF-09-Light-02]  ...  [UF-09-Light-16]                                      |
|  [🌙 DARK ]  [UF-09-Dark-01]   [UF-09-Dark-02]   ...  [UF-09-Dark-16]                                       |
+-------------------------------------------------------------------------------------------------------------+

+-------------------------------------------------------------------------------------------------------------+
|  SECTION: UF-10 · Bảng tối ưu license (18 màn hình)                                                         |
|  [☀️ LIGHT]  [UF-10-Light-01]  [UF-10-Light-02]  ...  [UF-10-Light-18]                                      |
|  [🌙 DARK ]  [UF-10-Dark-01]   [UF-10-Dark-02]   ...  [UF-10-Dark-18]                                       |
+-------------------------------------------------------------------------------------------------------------+
```

---

## 📋 Danh mục 122 Màn hình & Tên Frame chuẩn

### 1. UF-07: Hàng đợi chưa khớp danh tính (11 frames × 2 theme = 22)
- `01`: Hàng đợi chưa khớp danh tính
- `02`: Xem gợi ý khớp danh tính
- `03`: Xác nhận khớp thủ công
- `04`: Đang chạy lại tổng hợp
- `05`: Khớp danh tính thành công
- `06`: Không tìm được ứng viên phù hợp
- `07`: Xác nhận bỏ qua định danh
- `08`: Đã bỏ qua định danh
- `09`: Phát hiện xung đột danh tính
- `10`: Không thể tự chọn một nhân viên
- `11`: Đang chờ xử lý xung đột

### 2. UF-08: Hàng đợi cấp phát và thu hồi (16 frames × 2 theme = 32)
- `01`: Hàng đợi thực thi cấp phát
- `02`: Tác vụ tự động sẵn sàng
- `03`: Connector đang thực thi
- `04`: Lời mời đã gửi — chờ chấp nhận
- `05`: Bàn giao đối soát thành viên
- `06`: Tác vụ thủ công chưa có người nhận
- `07`: Đang xử lý thủ công
- `08`: Xác nhận hoàn tất thủ công
- `09`: Thu hồi thủ công hoàn tất
- `10`: Hàng đợi tác vụ thất bại
- `11`: Lỗi tạm thời đang thử lại
- `12`: Đã hết sáu lần thử tự động
- `13`: Chuyển tác vụ sang làm thủ công
- `14`: Lỗi xác thực — không thử lại
- `15`: Đã hết hạn mức license
- `16`: Đã mua thêm — trở lại thực thi

### 3. UF-09: Xử lý nhân viên nghỉ việc (16 frames × 2 theme = 32)
- `01`: Nhân sự sắp nghỉ việc
- `02`: Tác động khi Trần Minh nghỉ việc
- `03`: Thiết lập ngày làm việc cuối
- `04`: Kế hoạch offboarding đã tạo
- `05`: Chỉ định người kế nhiệm
- `06`: Chờ xác nhận bàn giao dữ liệu
- `07`: Bàn giao đã được xác nhận
- `08`: Năm khuyến nghị G2 cần xử lý ngay
- `09`: Chọn thu hồi hàng loạt
- `10`: Xác nhận thu hồi 5 seat
- `11`: Đã tạo năm tác vụ thực thi
- `12`: Theo dõi bằng chứng thu hồi
- `13`: Bằng chứng Figma chưa đủ
- `14`: Đủ bằng chứng — nhả seat cuối
- `15`: Không còn seat · chờ xóa dữ liệu
- `16`: Đã xóa dữ liệu theo lịch

### 4. UF-10: Bảng tối ưu license (18 frames × 2 theme = 36)
- `01`: Bảng tối ưu license
- `02`: Vì sao G1–G4 không được trộn?
- `03`: G1 · Seat mua nhưng chưa gán
- `04`: Đề nghị giảm 12 seat Microsoft 365
- `05`: Chuyển quyết định kỳ gia hạn
- `06`: Đã duyệt giảm 8 seat tại kỳ gia hạn
- `07`: G2 · Seat của người đã nghỉ việc
- `08`: Xác nhận thu hồi ngay 3 seat
- `09`: Đã tạo 3 tác vụ thu hồi G2
- `10`: G3/G4 · Khuyến nghị theo mức dùng
- `11`: Căn cứ bất biến của REC-2026-331
- `12`: Gửi batch xác nhận Manager tuần 38
- `13`: Kết quả xác nhận từ UF-05
- `14`: IT xem quyết định Thu hồi
- `15`: Nhánh A · IT đồng ý thu hồi
- `16`: Nhánh B · Ghi lý do không đồng ý
- `17`: Đã trả Manager xem xét
- `18`: Tiết kiệm được ghi đúng loại
