# SaaS-Sentry UI/UX Design System & Anti-AI Design Guardrails

> **Tài liệu ràng buộc quy chuẩn thiết kế giao diện & Chống lỗi UI do AI tạo ra (AI-Generated UI Anti-Patterns)**
> **Áp dụng cho**: Toàn bộ lập trình viên, Frontend Engineers và AI Coding Agents làm việc trên dự án SaaS-Sentry.
> **Triết lý chủ đạo**: Clean, Minimalist, Craft-focused, Utilitarian B2B Enterprise (Lấy cảm hứng từ [Minimal Gallery](https://minimal.gallery/), Linear, Vercel, Stripe, Raycast).

---

## Mục lục

1. [Triết lý Thiết kế Cốt lõi (Design Philosophy & Aesthetic North Star)](#1-triết-lý-thiết-kế-cốt-lõi)
2. [Cấu trúc Khung Ứng dụng & Điều hướng (App Shell & Navigation)](#2-cấu-trúc-khung-ứng-dụng--điều-hướng)
3. [Bảng biểu & Hiển thị Dữ liệu lớn (Data Tables & Lists)](#3-bảng-biểu--hiển-thị-dữ-liệu-lớn)
4. [Biểu mẫu & Hệ thống Nút bấm (Forms & CTA Hierarchy)](#4-biểu-mẫu--hệ-thống-nút-bấm)
5. [Hình học, Bo góc & Căn chỉnh Thị giác (Geometry, Radii & Optical Alignment)](#5-hình-học-bo-góc--căn-chỉnh-thị-giác)
6. [Bề mặt, Chiều sâu, Nguồn sáng & Đường viền (Surfaces, Depth, Lighting & Borders)](#6-bề-mặt-chiều-sâu-nguồn-sáng--đường-viền)
7. [Hành vi Tương tác & Chuyển động (Interaction & Motion Standards)](#7-hành-vi-tương-tác--chuyển-động)
8. [Kiểu chữ Tinh vi & Ngôn ngữ Giao diện (Micro-Typography & Human Copywriting)](#8-kiểu-chữ-tinh-vi--ngôn-ngữ-giao-diện)
9. [Đồ họa, Biểu đồ & Iconography (Visuals, Charts & Icons)](#9-đồ-họa-biểu-đồ--iconography)
10. [Thiết kế Đa nền tảng & Responsive Mobile (Mobile & Responsive Rules)](#10-thiết-kế-đa-nền-tảng--responsive-mobile)
11. [Bảng Tra cứu Nhanh: NÊN LÀM vs. CẤM LÀM (DOs & DONTs Matrix)](#11-bảng-tra-cứu-nhanh-nên-làm-vs-cấm-làm)
12. [Checklist Tự kiểm duyệt Giao diện trước khi Bàn giao (Pre-Commit UI Checklist)](#12-checklist-tự-kiểm-duyệt-giao-diện)

---

## 1. Triết lý Thiết kế Cốt lõi

### Phản hồi thao tác: dùng toast, không dựng khối thông báo cố định

Toàn dự án dùng **Sonner** qua một `AppToaster` trong `AppProviders`. Kết quả đăng nhập, lưu, gửi, xóa, duyệt và các mutation khác dùng `toast.success`/`toast.error` từ callback sở hữu thao tác. Thông báo tự ẩn sau 5 giây, có nút đóng, hỗ trợ theme/VI/EN, tối đa ba toast. Không dựng banner/context box trong form để báo lỗi đăng nhập hoặc kết quả thao tác; không phát cùng lỗi ở nhiều tầng.

Validation gắn với từng input vẫn cần chỉ dẫn sửa và accessibility phù hợp. Trạng thái trang như lỗi tải dữ liệu có retry, liên kết không hợp lệ, empty hoặc thiếu quyền vẫn hiển thị trong trang. Đây là nội dung cần thiết để tiếp tục công việc, không phải thông báo thao tác tạm thời. Giữ pending/spinner và Retry-After countdown tại nút; toast không phải nguồn trạng thái duy nhất.

Trang đăng nhập dùng đồ họa vector/CSS và Motion hiện có, không thêm card mô tả thừa hay số liệu minh họa dễ bị hiểu là dữ liệu thật. Tôn trọng `prefers-reduced-motion`, mobile ưu tiên form. Trang auth là trang độc lập được cuộn tự nhiên khi màn hình thấp hoặc mở bàn phím; quy tắc khóa App Shell bên dưới áp dụng dashboard có header/sidebar.

Hệ thống quản trị nội bộ công ty (B2B SaaS / Enterprise Portal) sinh ra để nhân viên và cấp quản lý giải quyết công việc với **tốc độ cao nhất, độ tập trung tối đa và sai sót tối thiểu**. Giao diện chuyên nghiệp không phải là giao diện vẽ nhiều màu sắc hay hiệu ứng bay bổng, mà là giao diện có:

1. **Khoảng thở có chủ đích (Deliberate Whitespace)**: Chia rõ các khối nội dung lớn, tách biệt rành mạch, không nhồi nhét.
2. **Loại bỏ rác thị giác (Zero Visual Clutter)**: Không viền chồng viền, không bóng đổ lem nhem, không chữ mô tả thừa thãi.
3. **Phân cấp thị giác sắc nét (Unforgiving Visual Hierarchy)**: Chỉ 1 hành động chính (Primary CTA) trên một khu vực. Mắt người dùng phải quét ngay ra trọng tâm chỉ sau 200ms.
4. **Sự đồng nhất tuyệt đối (Absolute Geometric Rigor)**: Chiều cao nút bấm, bán kính bo góc đồng tâm, độ dày icon và khoảng cách padding phải tuân thủ toán học và hệ thống token.

---

## 2. Cấu trúc Khung Ứng dụng & Điều hướng

### 2.1. Khóa chiều cao Viewport (App Shell Architecture)

- **Lỗi AI thường gặp**: Để `body` hoặc toàn bộ trang cuộn trôi tuột từ trên xuống dưới. Khi cuộn, Header và Sidebar bị kéo lệch hoặc AI dùng `fixed top-0` đè lên nội dung gây mất góc bấm.
- **Quy chuẩn bắt buộc**: Khung App Shell phải khóa cứng 100% viewport (`h-screen overflow-hidden flex flex-col md:flex-row`). Chỉ cho phép vùng nội dung chính cuộn dọc độc lập (`main.flex-1.overflow-y-auto`).

```tsx
// ❌ SAI: Để toàn bộ body cuộn tự do
<div className="min-h-screen">
  <header className="fixed top-0 w-full z-10">...</header>
  <aside className="fixed left-0 top-16 w-64">...</aside>
  <div className="pt-20 pl-68">...nội dung cuộn trôi tuột...</div>
</div>

// ✅ ĐÚNG: Khóa cứng App Shell, cuộn nội bộ mượt mà
<div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
  <aside className="hidden md:flex w-64 flex-col border-r border-border/60 bg-sidebar shrink-0">
    {/* Navigation Menu cố định */}
  </aside>
  <div className="flex flex-1 flex-col overflow-hidden">
    <header className="h-14 border-b border-border/60 bg-surface px-6 flex items-center justify-between shrink-0">
      {/* Top Bar cố định */}
    </header>
    <main className="flex-1 overflow-y-auto px-6 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Chỉ vùng này cuộn */}
      </div>
    </main>
  </div>
</div>
```

---

### 2.2. Giải quyết "Ngộ độc điều hướng" (Navigation Inception)

- **Lỗi AI thường gặp**: Vẽ ra cùng lúc 4 tầng menu: Top Navigation Bar đầy đủ link, Left Sidebar cố định 10 mục, Sub-tabs ngang 5 mục bên dưới, rồi lại thêm Breadcrumbs 3 nấc. Vùng nội dung chính bị bóp nghẹt.
- **Quy chuẩn phân cấp**:
  1. **Level 1 (Module chính)**: Nằm ở Left Sidebar (Logo, Dashboard, Licenses, Requests, Audit, Settings).
  2. **Level 2 (Trang hiện tại & Ngữ cảnh)**: Hiển thị trên Page Header gọn gàng kèm breadcrumb 1 dòng hoặc tiêu đề trang lớn.
  3. **Level 3 (Phân loại trong trang)**: Dùng **Segmented Controls** hoặc **Underline Tabs** tinh gọn, tối đa 1 hàng duy nhất ngay dưới Page Header. Tuyệt đối không sinh thêm tầng sub-tabs con bên trong nữa.

---

### 2.3. Quy tắc chọn Vùng hiển thị Thao tác (Modal vs. Drawer vs. Page)

AI thường nhét mọi form tạo/sửa vào một Dialog/Modal nhỏ giữa màn hình khiến người dùng phải cuộn trong một chiếc hộp chật hẹp. Tuân thủ cây quyết định sau:

| Loại thao tác / Nội dung                                                      | Độ phức tạp                             | Khung hiển thị bắt buộc                                                              |
| :---------------------------------------------------------------------------- | :-------------------------------------- | :----------------------------------------------------------------------------------- |
| **Xác nhận nhanh** (Confirm/Alert/Delete)                                     | 1-2 câu hỏi, 2 nút bấm                  | **Modal / Dialog** (`max-w-md`)                                                      |
| **Form ngắn** (Đổi tên, Reset mật khẩu)                                       | 1-3 ô nhập liệu đơn giản                | **Modal / Dialog** (`max-w-lg`)                                                      |
| **Form trung bình & Chi tiết** (Cấp phát license, Phê duyệt, Bộ lọc nâng cao) | 4-10 ô nhập liệu, bảng tóm tắt, lịch sử | **Slide-over Drawer / Sheet** (Trượt từ mép phải, rộng `w-[480px]` - `w-[640px]`)    |
| **Quy trình phức tạp** (Onboarding, Wizard nhiều bước, Báo cáo ngân sách năm) | > 10 ô nhập liệu, phân nhóm phức tạp    | **Dedicated Page / Sub-route riêng** (VD: `/dashboard/finance/annual-budget/create`) |

---

## 3. Bảng biểu & Hiển thị Dữ liệu lớn

### 3.1. Quy chuẩn Căn lề Bảng dữ liệu (Table Alignment Rigor)

- **Lỗi AI**: Để `text-left` cho toàn bộ các cột, dẫn đến số tiền và ngày tháng thẳng hàng chữ nhìn cực kỳ nghiệp dư.
- **Quy chuẩn quốc tế bắt buộc**:

| Loại dữ liệu                     | Căn lề (Tailwind)               | Định dạng bổ sung                  | Ví dụ                               |
| :------------------------------- | :------------------------------ | :--------------------------------- | :---------------------------------- |
| **Tên, Email, Mô tả, Text**      | `text-left`                     | `truncate` hoặc `line-clamp-1`     | "Nguyễn Văn A", "Bộ phận Kế toán"   |
| **Số lượng, Tiền tệ, Phần trăm** | `text-right`                    | `font-mono tabular-nums`           | `15,400,000 ₫`, `98.5%`, `42 seats` |
| **Ngày tháng, Giờ, Mã ID/SKU**   | `text-right` hoặc `text-center` | `font-mono tabular-nums text-xs`   | `29/10/2026`, `REQ-2026-089`        |
| **Trạng thái (Status Badge)**    | `text-left` hoặc `text-center`  | Tinh gọn, có chấm màu trạng thái   | `● Active`, `● Pending`             |
| **Hành động (Action Column)**    | `text-right sticky right-0`     | Nằm sát mép phải, cố định khi cuộn | Icon `...` hoặc Quick Actions       |

---

### 3.2. Chấm dứt "Rừng nút bấm" trên từng dòng (No Row Button Spam)

- **Lỗi AI**: Trên mỗi dòng của bảng 15 hàng, AI vẽ 3 nút to: `[Sửa]` xanh, `[Xóa]` đỏ, `[Chi tiết]` xám. Giao diện trở thành một mê cung 45 nút bấm chói lọi.
- **Giải pháp**:
  - **Mặc định**: Chỉ hiển thị 1 nút Action Menu (`...` - `MoreHorizontal`) mở Dropdown Menu.
  - **Hoặc Quick Action khi Hover**: Ẩn các nút hành động, chỉ hiện khi di chuột qua dòng (`group-hover:opacity-100 opacity-0 transition-opacity`).

```tsx
// ❌ SAI: Spam nút lòe loẹt trên từng dòng
<td className="flex gap-2">
  <button className="bg-blue-600 px-3 py-1 text-white">Sửa</button>
  <button className="bg-red-600 px-3 py-1 text-white">Xóa</button>
  <button className="bg-gray-600 px-3 py-1 text-white">Chi tiết</button>
</td>

// ✅ ĐÚNG: Tinh tế với Dropdown hoặc Hover Quick Actions
<td className="text-right py-3 pr-4">
  <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100">
    <button
      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-subtle transition-colors"
      title="Tùy chọn thao tác"
    >
      <MoreHorizontal className="w-4 h-4" />
    </button>
  </div>
</td>
```

---

### 3.3. Xóa bỏ Bảng "Kẻ ô Excel" & Quá tải Badge

1. **Đường kẻ bảng**: Bỏ toàn bộ viền dọc (`border-r`). Chỉ dùng duy nhất đường kẻ ngang siêu mảnh ngăn cách các dòng: `border-b border-border/40` hoặc `divide-y divide-border/40`.
2. **Nền xen kẽ (Zebra Striping)**: Trong UI hiện đại, hạn chế zebra striping thô. Thay vào đó, dùng hiệu ứng hover nhẹ nhàng trên toàn dòng: `hover:bg-surface-subtle/50 transition-colors`.
3. **Phòng chống vỡ Grid do chữ dài**: Tất cả các cột hiển thị text động (tên người dùng, tên phần mềm, email) **bắt buộc** phải có `truncate max-w-[200px]` hoặc `line-clamp-1` kèm thuộc tính `title={fullText}` để người dùng di chuột xem tooltip.
4. **Giảm tải Badge (No Badge Fatigue)**: Mỗi dòng chỉ cho phép tối đa 1 Status Badge chính. Không bọc tất cả từ ngữ (phòng ban, vai trò, gói cước) vào trong các thẻ pill sặc sỡ. Các thông tin phụ chỉ hiển thị dưới dạng plain text màu `text-muted-foreground`.

---

## 4. Biểu mẫu & Hệ thống Nút bấm

### 4.1. Quy tắc Sắt đá: Đơn nhất Nút hành động chính (Single Primary CTA)

- Trong bất kỳ một vùng nhìn thấy (Header, Modal Footer, Form Footer), **CHỈ ĐƯỢC PHÉP CÓ DUY NHẤT 1 NÚT PRIMARY** (`bg-primary text-primary-foreground`).
- Các nút hành động khác bắt buộc phải hạ cấp:
  - Hành động bổ trợ (Lọc, Xuất dữ liệu, Lưu nháp): **Secondary Button** (`border border-border bg-surface hover:bg-surface-subtle text-foreground`).
  - Hành động đóng / Hủy bỏ: **Ghost Button** (`hover:bg-surface-subtle text-muted-foreground hover:text-foreground`).
  - Hành động nguy hiểm (Xóa, Thu hồi vĩnh viễn): Trong danh sách/bảng dùng icon xám đổi sang đỏ khi hover; chỉ dùng nền đỏ đặc (`bg-danger text-white`) bên trong Dialog xác nhận bước cuối cùng.

```tsx
// ❌ SAI: Hai nút Primary tranh chấp thị giác
<div className="flex gap-3">
  <button className="bg-primary text-white px-4 py-2">Lưu thay đổi</button>
  <button className="bg-primary text-white px-4 py-2">Gửi phê duyệt</button>
</div>

// ✅ ĐÚNG: Phân cấp rõ rệt
<div className="flex items-center justify-end gap-3">
  <button className="px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-subtle rounded-md transition-colors">
    Hủy bỏ
  </button>
  <button className="px-3.5 py-2 text-sm font-medium border border-border bg-surface hover:bg-surface-subtle text-foreground rounded-md transition-colors shadow-2xs">
    Lưu nháp
  </button>
  <button className="px-4 py-2 text-sm font-medium bg-primary hover:bg-primary-hover text-primary-foreground rounded-md transition-colors shadow-sm">
    Gửi phê duyệt
  </button>
</div>
```

---

### 4.2. Bố cục Form Khoa học & Triệt tiêu "Bức tường Input"

1. **Không kéo dài 100% vô lý**: Một ô nhập Zip Code, Mã phòng ban, hay Số lượng seat chỉ cần 4-8 ký tự thì không được phép để `w-full` dài 900px ngang bằng ô Địa chỉ. Hãy giới hạn chiều rộng (`max-w-[180px]` hoặc `max-w-xs`).
2. **Nhóm cột hợp lý**: Các trường liên quan trực tiếp (Họ & Tên, Thành phố & Mã bưu chính, Thời hạn bắt đầu & Kết thúc) phải đặt trên cùng một hàng ngang sử dụng `grid grid-cols-1 sm:grid-cols-2 gap-4`.
3. **Phân đoạn Form dài**: Form trên 6 trường phải được gom nhóm thành các cụm thông tin có tiêu đề phân đoạn (Section Heading) hoặc Card riêng, ví dụ: "1. Thông tin bản quyền", "2. Phân bổ ngân sách", "3. Thiết bị chỉ định".
4. **Chống giật khung hình khi báo lỗi (Prevent Layout Shift)**:
   - Thông báo lỗi form (`error message`) không được đột ngột xuất hiện đẩy toàn bộ các ô bên dưới nhảy giật cục.
   - Hãy dự phòng khoảng trống nhỏ (`min-h-[20px]`) hoặc hiển thị icon chấm than nhỏ màu đỏ ngay góc phải của Input kèm Tooltip.

---

### 4.3. Đồng nhất Chiều cao Điều khiển (Consistent Control Heights)

Khi đặt ô Tìm kiếm (Input), nút Bộ lọc (Select/Button), nút Hành động (CTA) trên cùng một hàng ngang, chúng **BẮT BUỘC phải có cùng một token chiều cao**:

| Size Token         | Height (Tailwind) | Chiều cao thực | Cỡ chữ      | Padding ngang | Ngữ cảnh sử dụng                                   |
| :----------------- | :---------------- | :------------- | :---------- | :------------ | :------------------------------------------------- |
| **Compact (sm)**   | `h-8`             | 32px           | `text-xs`   | `px-2.5`      | Bảng dữ liệu, Toolbar thu nhỏ, Bộ lọc phụ          |
| **Standard (md)**  | `h-9` hoặc `h-10` | 36px / 40px    | `text-sm`   | `px-3.5`      | **Mặc định toàn hệ thống** (Form, Search, Toolbar) |
| **Prominent (lg)** | `h-11`            | 44px           | `text-base` | `px-4`        | Màn hình Login, Landing page, Empty State CTA      |

---

## 5. Hình học, Bo góc & Căn chỉnh Thị giác

### 5.1. Công thức Toán học Bo góc đồng tâm (Concentric Border Radius)

- **Lỗi AI**: Đặt cùng một class `rounded-xl` (12px) cho cả khung Card cha lẫn thẻ con hoặc ảnh bên trong. Kết quả là góc cong bên trong bị méo mó, khoảng hở ở góc dày mỏng không đều gây phản cảm.
- **Công thức bất di bất dịch**:
  $$\mathbf{R_{\text{inner}} = R_{\text{outer}} - \text{Padding}}$$
  _(Nếu $R_{\text{outer}} - \text{Padding} \le 0$ thì phần tử bên trong không bo góc hoặc bo góc siêu nhỏ 2-4px)._

```tsx
// ❌ SAI: Bọc ngoài rounded-2xl (16px), p-4 (16px), con lại bo rounded-2xl (16px) -> Méo góc
<div className="rounded-2xl p-4 bg-surface border border-border">
  <div className="rounded-2xl bg-surface-subtle p-3">...</div>
</div>

// ✅ ĐÚNG: Card ngoài 16px (rounded-2xl), padding 4px (p-1) -> Con trong bo 12px (rounded-xl)
<div className="rounded-2xl p-1 bg-surface border border-border">
  <div className="rounded-xl bg-surface-subtle p-3">
    {/* R_inner = 16px - 4px = 12px */}
  </div>
</div>
```

---

### 5.2. Chấm dứt Hội chứng "Bo tròn đồ chơi" (No Pill-Shape Overload)

- **Lỗi AI**: Gắn `rounded-full` vô tội vạ lên khắp nơi: Input tìm kiếm, Nút bấm lớn, Card, Header, Tag. Giao diện trở nên nhí nhố giống ứng dụng trẻ em thay vì phần mềm doanh nghiệp nghiêm túc.
- **Quy chuẩn**:
  - Giao diện quản trị B2B SaaS chuyên nghiệp (Linear / Stripe / Minimal Gallery) luôn sử dụng bo góc nhẹ, sắc sảo và hiện đại: **`rounded-md` (6px) hoặc `rounded-lg` (8px)**.
  - `rounded-full` **chỉ được phép dùng duy nhất cho**:
    1. Ảnh đại diện người dùng (Avatar tròn).
    2. Chấm trạng thái nhỏ (Indicator dot `w-2 h-2 rounded-full`).
    3. Micro-badges chỉ số cực ngắn (ví dụ: số thông báo `(3)`).

---

### 5.3. Căn chỉnh Thị giác vs. Căn chỉnh Toán học (Optical Alignment)

- Căn giữa toán học (`items-center justify-center`) thường làm lệch mắt người xem khi đối tượng có trọng tâm thị giác không đối xứng (như icon Play hình tam giác, hoặc cụm chữ in hoa đi kèm icon).
- **Quy tắc bù trừ**:
  - Icon Play tam giác: Phải dịch sang phải `translate-x-[1px]` hoặc `translate-x-[1.5px]`.
  - Icon bên cạnh dòng chữ: Thêm căn chỉnh `relative top-[0.5px]` để trục giữa của icon khớp chính xác với trục giữa chiều cao chữ (X-height).

---

## 6. Bề mặt, Chiều sâu, Nguồn sáng & Đường viền

### 6.1. Quy luật Nguồn sáng Tự nhiên từ Trên xuống (Top-down Lighting)

Trong thế giới thực, ánh sáng chiếu từ trên đỉnh đầu xuống. Một giao diện phẳng lì với 4 cạnh viền tối như nhau sẽ tạo cảm giác như một bản vẽ kỹ thuật thô. Các giao diện cao cấp tạo chiều sâu tinh tế bằng cách:

1. **Highlight cạnh trên**: Thêm một đường sáng cực mảnh ở cạnh trên bằng `border-t-white/10` (dark mode) hoặc `shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]`.
2. **Đổ bóng phân tầng (Layered Soft Shadow)**: Sử dụng đổ bóng 2 tầng nhẹ thay vì 1 vệt bóng đen sì:
   - `shadow-xs`: `shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]`
   - `shadow-sm`: `shadow-[0_1px_3px_0_rgba(0,0,0,0.06),0_1px_2px_-1px_rgba(0,0,0,0.06)]`

---

### 6.2. Đường viền có Độ trong suốt (Alpha Borders) & Chống "Viền chồng viền"

1. **Cấm dùng mã HEX chết cho Border**: Không dùng `#E5E7EB` hay `#374151` cứng. Luôn dùng màu nền kết hợp opacity:
   - Light theme: `border-black/[0.08]` hoặc `border-border`
   - Dark theme: `border-white/[0.12]` hoặc `border-border`
   - Nhờ độ trong suốt, đường viền sẽ tự động hòa hợp mượt mà khi đặt trên bất kỳ sắc độ nền nào.
2. **Khắc phục "Viền chồng viền" (Double Borders)**:
   - Khi đặt hai phần tử có border cạnh nhau, đường tiếp giáp sẽ dày lên gấp đôi (2px) rất thô.
   - Giải pháp: Dùng `divide-y divide-border` trên container cha, hoặc cho container cha nền `bg-border` và các ô con cách nhau `gap-[1px]`.

---

### 6.3. Giới hạn Glassmorphism & Backdrop Blur

- **CẤM**: Dùng `backdrop-blur-md bg-white/10` hoặc `bg-black/20` trên một bề mặt đặt trên nền đơn sắc tĩnh. Nó hoàn toàn vô tác dụng thị giác nhưng gây tụt FPS nghiêm trọng khi cuộn trang và làm chữ bị đục ngầu.
- **CHỈ DÙNG**: `backdrop-blur` cho **Sticky Header** hoặc **Floating Action Dock** khi nội dung bên dưới cuộn trượt qua nó, với độ mờ vừa phải (`backdrop-blur-md bg-background/80`).

---

## 7. Hành vi Tương tác & Chuyển động

### 7.1. Chống Hiện tượng Nhảy Khung hình (Prevent Layout Shift on Hover)

- **Lỗi AI**: Khi rê chuột hoặc chọn tab, AI đổi từ `border` (1px) sang `border-2` (2px), hoặc đổi từ `font-normal` sang `font-bold`. Việc này làm phần tử phình to thêm vài pixel, đẩy toàn bộ các nút xung quanh giật nảy.
- **Quy chuẩn**:
  - Đổi màu viền: Giữ nguyên độ dày 1px, chỉ đổi màu `border-border` $\rightarrow$ `border-primary` (hoặc dùng `ring-1 ring-primary`).
  - Active Tab: Giữ nguyên `font-medium`, chỉ thay đổi màu chữ `text-muted-foreground` $\rightarrow$ `text-foreground`, và dùng đường gạch chân indicator (`absolute bottom-0 h-0.5 w-full bg-primary`).

---

### 7.2. Cấm Hiệu ứng Hover "Nhún nhảy" quá đà trên Dashboard

- **Lỗi AI**: Gắn `hover:scale-105` hoặc `hover:-translate-y-2 hover:shadow-xl` vào mọi chiếc KPI Card. Khi người dùng lướt chuột qua lại, cả màn hình rung lắc chao đảo như công viên giải trí.
- **Quy chuẩn B2B**: Trên trang quản trị dữ liệu, các thẻ hiển thị phải tĩnh tại và chắc chắn. Tương tác hover chỉ nên là:
  - Đổi nhẹ màu nền: `hover:bg-surface-subtle/80`
  - Đổi nhẹ màu viền: `hover:border-border-hover` (hoặc `hover:border-primary/40`)
  - Thời gian chuyển động nhanh, dứt khoát: `duration-150 ease-out`.

---

### 7.3. Kích thước Vùng bấm Tối thiểu (Hit Targets) & Transition

1. **Desktop Hit Target**: Tối thiểu `32px x 32px`. Một icon 16px (như nút Đóng X, nút More) phải được bọc trong một container button có padding hoặc kích thước tối thiểu `h-8 w-8 flex items-center justify-center`.
2. **Mobile Hit Target**: Tối thiểu **`44px x 44px`** theo tiêu chuẩn Apple Human Interface Guidelines.
3. **Cấm lạm dụng `transition-all`**: Chỉ định rõ thuộc tính cần chuyển đổi (`transition-colors duration-150` hoặc `transition-opacity duration-150`). Tuyệt đối không dùng `transition-all` làm cả padding, width, height đều bị co giãn giật cục khi resize cửa sổ.

---

## 8. Kiểu chữ Tinh vi & Ngôn ngữ Giao diện

### 8.1. Tuyệt đối Xóa sổ "Văn mẫu AI" (No Robotic AI Copywriting)

AI sinh nội dung thường tự động chèn những từ ngữ sáo rỗng kèm dấu chấm than (!) ở khắp nơi. Bảng cấm kỵ sau đây áp dụng cho toàn bộ văn bản UI và file i18n:

| Từ ngữ AI sáo rỗng (CẤM)                           | Cách viết Chuẩn xác, Con người, Chuyên nghiệp             |
| :------------------------------------------------- | :-------------------------------------------------------- |
| ❌ "Unleash the full power of your licenses!"      | ✅ "Quản lý và cấp phát bản quyền"                        |
| ❌ "Elevate your team's workflow seamlessly"       | ✅ "Danh sách thành viên phòng ban"                       |
| ❌ "Supercharge your SaaS optimization today!"     | ✅ "Đề xuất cắt giảm chi phí giấy phép nhàn rỗi"          |
| ❌ "Dive into analytics and explore deep insights" | ✅ "Báo cáo sử dụng theo quý"                             |
| ❌ "Revolutionize your approval process"           | ✅ "Hàng đợi phê duyệt yêu cầu"                           |
| ❌ Dấu chấm than (!) ở tiêu đề và thông báo        | ✅ Không dùng dấu chấm than. Dùng câu trần thuật gãy gọn. |

> **Quy tắc mô tả tiêu đề**: Nếu tiêu đề đã rõ nghĩa (ví dụ: `Hồ sơ nhân sự`), **KHÔNG TỰ Ý THÊM** đoạn văn mô tả lê thê bên dưới (như _"Tại đây bạn có thể xem và cập nhật tất cả hồ sơ nhân sự trong công ty..."_). Chỉ thêm hint text khi thực sự cần giải thích một logic phức tạp hoặc cảnh báo rủi ro.

---

### 8.2. Micro-Typography: Quy chuẩn Chữ viết Tinh tế

1. **Tiêu đề Chống mồ côi chữ (No Widows/Orphans)**: Luôn áp dụng thuộc tính CSS hiện đại `[text-wrap:balance]` cho tiêu đề (`h1`-`h4`) và `[text-wrap:pretty]` cho các đoạn văn bản giải thích.
2. **Quy tắc Bắt buộc cho Chữ IN HOA (UPPERCASE)**:
   - Khi dùng `uppercase` cho các nhãn nhỏ (Label cột bảng, Kicker badge, Header nhóm), **BẮT BUỘC** phải đi kèm `tracking-wider` hoặc `tracking-widest` (letter-spacing: 0.05em - 0.1em) và cỡ chữ nhỏ `text-[11px]` hoặc `text-xs font-semibold`. Nếu không có tracking, chữ hoa sẽ dính tịt vào nhau rất khó đọc.
3. **Tỷ lệ Nghịch giữa Cỡ chữ và Chiều cao dòng (Line-Height & Tracking)**:
   - Chữ càng lớn (`text-2xl`, `text-3xl`, `text-4xl`), khoảng cách chữ và dòng càng phải thu hẹp lại: Dùng `leading-tight tracking-tight` hoặc `leading-none`.
   - Chữ nhỏ (`text-xs`, `text-sm`) đọc nội dung dài thì giãn dòng: Dùng `leading-relaxed`.

---

## 9. Đồ họa, Biểu đồ & Iconography

### 9.1. Biểu đồ Chuyên nghiệp (No Rainbow Charts & No Chartjunk)

- **Lỗi AI**: Vẽ biểu đồ cột/đường mỗi cột một màu sặc sỡ: Cột 1 xanh lá, Cột 2 tím, Cột 3 vàng, Cột 4 đỏ chót; kèm theo hệ thống lưới tọa độ đen đặc và chú thích thô kệch.
- **Quy chuẩn thiết kế Biểu đồ B2B**:
  1. **Bảng màu Đơn sắc Tinh tế (Monochromatic / Tonal Palette)**: Dùng các sắc độ đậm nhạt khác nhau của màu chủ đạo (Brand Primary) với độ mờ khác nhau: `bg-primary`, `bg-primary/70`, `bg-primary/40`, `bg-primary/20`.
  2. **Chỉ dùng màu tương phản cho Ngữ nghĩa Đặc biệt**: Xanh lục (Đạt ngân sách), Hổ phách (Cảnh báo vượt mức), Đỏ (Vi phạm chính sách).
  3. **Xóa sổ Rác thị giác (Strip Chartjunk)**: Ẩn hoàn toàn đường viền trục ngoài, chỉ giữ lại các đường gióng ngang cực mờ (`strokeDasharray="3 3" opacity={0.3}`). Ẩn các nhãn trục rườm rà. Tooltip biểu đồ thiết kế tối giản như một popover nhỏ có bo góc 6px và đổ bóng nhẹ.

---

### 9.2. Ảnh & Avatar Phải có Viền bao (Captured Media)

- Khi hiển thị ảnh chân dung (Avatar), Logo phần mềm (Figma, Notion) hoặc ảnh đính kèm:
  - Nếu ảnh nền sáng đặt trên giao diện nền sáng, cạnh viền của ảnh sẽ bị hòa tan vào nền làm giao diện nham nhở.
  - **Quy chuẩn**: Bắt buộc bọc mọi Avatar/Image bằng một lớp viền mờ bên trong: `ring-1 ring-inset ring-black/10` (light mode) hoặc `ring-1 ring-inset ring-white/10` (dark mode).

---

### 9.3. Nhất quán Phong cách Icon & CẤM DÙNG EMOJI trong UI

1. **Một Thư viện Duy nhất**: 100% icon sử dụng `lucide-react`. Không pha trộn icon từ FontAwesome hay Heroicons.
2. **Độ dày Nét vẽ Đồng nhất (Stroke Width Consistency)**:
   - Toàn bộ icon trong hệ thống sử dụng chung độ dày nét: `strokeWidth={1.5}` (hoặc `strokeWidth={1.75}`).
   - Cấm chỗ thì icon nét sợi chỉ 1.0, chỗ lại dùng icon nét dày 2.5 hoặc icon dạng khối đặc (solid).
3. **CẤM TUYỆT ĐỐI DÙNG EMOJI THAY ICON**:
   - Việc dùng Emoji (🚀, 🔥, 💡, ✨, 🎉, ⚠️) làm icon đại diện cho chức năng quản trị là **dấu hiệu điển hình nhất của giao diện AI rẻ tiền**. Tuyệt đối không dùng emoji trong menu, tiêu đề panel hay nút bấm.

---

## 10. Thiết kế Đa nền tảng & Responsive Mobile

Hệ thống quản trị SaaS-Sentry dù tập trung vào Desktop cho nhân viên văn phòng, nhưng **bắt buộc phải hiển thị hoàn hảo trên Mobile** (điện thoại của Quản lý khi duyệt đơn khẩn cấp, nhân viên tra cứu phần mềm).

### 10.1. Chiến lược Chuyển đổi Bảng biểu trên Mobile (Table to Card Stack)

Trên màn hình hẹp (`< 768px`), một bảng dữ liệu 7 cột sẽ bị bóp nghẹt hoặc bắt cuộn ngang vô tận.

- **Giải pháp bắt buộc**:
  - Dưới breakpoint `md`: Ẩn thẻ `<table>` (`hidden md:table`), thay thế bằng danh sách thẻ **Card Stack** (`flex flex-col gap-3 md:hidden`). Mỗi dòng dữ liệu trở thành một Card nhỏ gọn chứa các cặp Key-Value thiết yếu.

```tsx
// ✅ Mẫu chuyển đổi Table sang Card Stack responsive
export function LicenseList({ items }: { items: LicenseItem[] }) {
  return (
    <div>
      {/* 1. Mobile View: Hiển thị dạng Card Stack */}
      <div className='space-y-3 md:hidden'>
        {items.map((item) => (
          <div key={item.id} className='rounded-lg border border-border/70 bg-surface p-4 space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='font-semibold text-foreground'>{item.softwareName}</span>
              <StatusBadge status={item.status} />
            </div>
            <div className='flex justify-between text-xs text-muted-foreground'>
              <span>Người dùng: {item.assigneeName}</span>
              <span className='font-mono tabular-nums'>{item.costFormatted}</span>
            </div>
            <div className='pt-2 border-t border-border/40 flex justify-end'>
              <button className='text-xs text-primary font-medium'>Chi tiết →</button>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Desktop View: Hiển thị Bảng chuẩn */}
      <div className='hidden md:block overflow-hidden rounded-lg border border-border/70 bg-surface'>
        <table className='w-full text-sm'>{/* thead & tbody chuẩn */}</table>
      </div>
    </div>
  )
}
```

---

### 10.2. Điều hướng trên Mobile (Responsive Mobile Shell)

1. **Sidebar sang Drawer/Sheet**: Trên mobile, Left Sidebar thu gọn lại. Thay vào đó là thanh Topbar có nút Hamburger (`Menu` icon) bấm vào mở một Slide-over Drawer từ bên trái có phủ backdrop đen mờ.
2. **Modal biến thành Bottom Sheet**: Trên màn hình điện thoại, Modal nằm lơ lửng giữa màn hình rất khó chạm ngón tay. Các Modal xác nhận/nhập liệu trên mobile phải gắn sát đáy màn hình dạng **Bottom Sheet** để dễ thao tác bằng ngón tay cái.
3. **Thanh Thao tác Cố định Dưới đáy (Mobile Sticky Action Bar)**: Khi người dùng điền form trên mobile, các nút Primary/Secondary CTA phải được ghim cố định ở đáy màn hình có tính toán khoảng an toàn: `pb-[calc(1rem+env(safe-area-inset-bottom))]`.

---

### 10.3. Phòng chống Tự động Phóng to trên iOS Safari (Input Zoom Prevention)

- **Quy tắc then chốt**: Trên iOS Safari, nếu một ô `<input>` hoặc `<select>` có cỡ chữ nhỏ hơn 16px, trình duyệt sẽ **tự động phóng to (zoom in)** màn hình khi người dùng chạm vào gõ chữ, làm vỡ toàn bộ bố cục trang.
- **Giải pháp**: Luôn khai báo cỡ chữ ô input là `text-base md:text-sm`. Cỡ chữ 16px (`text-base`) trên mobile ngăn chặn zoom, và chuyển về 14px (`text-sm`) sắc sảo trên desktop.

---

## 11. Bảng Tra cứu Nhanh: NÊN LÀM vs. CẤM LÀM

| Hạng mục              | ❌ TUYỆT ĐỐI CẤM (Anti-Patterns)                                                     | ✅ BẮT BUỘC THỰC HIỆN (Pro Solutions)                                                                    |
| :-------------------- | :----------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------- |
| **Bố cục khung**      | Cuộn cả trang web; Top Nav + Sidebar + Tabs tranh chấp diện tích                     | Khóa cứng `h-screen overflow-hidden`; chỉ cuộn `main.overflow-y-auto`                                    |
| **Nút bấm chính**     | Đặt 2-3 nút cùng màu `bg-primary` cạnh nhau; spam nút [Sửa][Xóa] trên từng dòng bảng | Duy nhất 1 Primary CTA; các nút khác là Secondary/Ghost; bảng dùng nút `...` Dropdown                    |
| **Căn lề bảng**       | Căn trái (`text-left`) toàn bộ các cột; kẻ viền 4 cạnh ô như Excel                   | Số/tiền căn phải (`text-right font-mono tabular-nums`); chỉ dùng viền ngang siêu mảnh                    |
| **Form nhập liệu**    | Kéo dài 1 cột thẳng đuột 15 ô input; dùng `<select>` mặc định của trình duyệt        | Gom nhóm 2 cột (`grid-cols-2`); trường ngắn giới hạn `max-w-xs`; có khoảng trống giữ chỗ lỗi             |
| **Modal / Dialog**    | Tống form 10-15 trường vào Modal nhỏ giữa màn hình                                   | Form ngắn dùng Modal; Form dài dùng Slide-over Drawer mép phải hoặc Sub-route riêng                      |
| **Bo góc**            | `rounded-full` bừa bãi; Card ngoài `rounded-xl` con bên trong cũng `rounded-xl`      | Giữ chuẩn B2B `rounded-md` (6px) hoặc `rounded-lg` (8px); tính $R_{\text{inner}} = R_{\text{outer}} - P$ |
| **Chiều sâu & Nền**   | Glassmorphism blur trên nền phẳng; viền dùng mã HEX chết `#E5E7EB`                   | Nguồn sáng từ trên xuống với `border-t` highlight; viền trong suốt có alpha `border-black/10`            |
| **Hover & Motion**    | `hover:scale-105` làm giật thẻ; đổi `border-1` thành `border-2` gây nhảy pixel       | Đổi màu nền nhẹ nhàng `hover:bg-surface-subtle`; giữ nguyên kích thước pixel; `duration-150`             |
| **Văn bản & Tiêu đề** | Văn mẫu AI: "Unleash", "Elevate", dấu (!); đoạn mô tả lê thê thừa thãi               | Câu chữ ngắn gọn, đi thẳng vào việc; tiêu đề dùng `[text-wrap:balance]`; UPPERCASE có `tracking-wider`   |
| **Biểu đồ & Icon**    | Biểu đồ cột 5 màu cầu vồng; dùng Emoji (🚀🔥) làm biểu tượng tính năng               | Biểu đồ đơn sắc phân tầng; 100% `lucide-react` đồng nhất `strokeWidth={1.5}`; cấm emoji                  |
| **Responsive**        | Bảng 7 cột tràn màn hình trên điện thoại; input chữ nhỏ bị Safari zoom               | Chuyển bảng sang Card Stack trên mobile; Modal thành Bottom Sheet; input `text-base md:text-sm`          |

---

## 12. Checklist Tự kiểm duyệt Giao diện

Trước khi hoàn thành bất kỳ tác vụ tạo mới hoặc refactor component giao diện nào, AI Coding Agent **bắt buộc phải tự rà soát danh sách 10 điểm sau**:

- [ ] **1. Kiểm tra Khung cuộn**: Màn hình có bị cuộn kép (nested scrollbars) không? Header và Sidebar có đứng yên vững chãi khi cuộn nội dung không?
- [ ] **2. Kiểm tra Phân cấp Nút (CTA)**: Trên màn hình hiện tại có nhiều hơn 1 nút `bg-primary` không? Các nút phụ đã chuyển về `variant="outline"` hoặc `ghost` chưa?
- [ ] **3. Kiểm tra Căn lề Bảng (Table)**: Cột số lượng/tiền tệ/ngày tháng đã có `text-right tabular-nums font-mono` chưa? Cột chữ có `truncate` chống vỡ dòng chưa?
- [ ] **4. Kiểm tra Viền & Bo góc**: Có hiện tượng viền chồng viền (double borders) không? Bo góc của phần tử con có tuân thủ công thức $R_{\text{in}} = R_{\text{out}} - P$ không?
- [ ] **5. Kiểm tra Chiều cao Điều khiển**: Các ô Input, Select, Button trên cùng một hàng có cùng một token chiều cao (`h-9` hoặc `h-10`) không?
- [ ] **6. Rà soát Văn mẫu AI**: Có còn sót từ ngữ "Unleash", "Elevate", "Seamless", "Supercharge" hay dấu chấm than (!) nào không? Các đoạn mô tả thừa đã được cắt bỏ chưa?
- [ ] **7. Rà soát Icon & Emoji**: Có emoji nào bị dùng làm icon chức năng không? Icon đã thống nhất `lucide-react` nét 1.5 chưa?
- [ ] **8. Rà soát Chuyển động (Motion)**: Có hiệu ứng nhảy khung hình (layout shift) khi di chuột vào nút/tab không? Có class `hover:scale-105` nào không phù hợp không?
- [ ] **9. Kiểm tra Tương thích Mobile**: Khi co màn hình về chiều rộng 375px (iPhone), bảng biểu có chuyển sang dạng Card hoặc cuộn ngang an toàn không? Input có `text-base md:text-sm` không?
- [ ] **10. Tuân thủ i18n & Giới hạn dòng**: Toàn bộ chuỗi hiển thị đã qua `useTranslation()` chưa? File component có dưới 500 dòng code theo quy định không?
