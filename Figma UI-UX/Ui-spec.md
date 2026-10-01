# SaaS-Sentry — Screen Flows (User Flows mức màn hình)

> **Phiên bản:** 1.0 — 07/09/2026
> **Nội dung:** 14 user flow `UF-01` → `UF-14` ở **mức màn hình**, vẽ theo ký pháp flowchart, áp kỷ luật activity diagram.
> **Tệp đi kèm:** `SaaS-Sentry-User-Flows.drawio` (14 trang) · thư mục `png/` và `svg/` (14 ảnh, xuất sẵn để xem nhanh).
> **Không đụng vào:** 43 mã `F-xx` và các quy tắc `BR-xx.x` của **User Flows nghiệp vụ v0.4** · `FR`, `ADR`, `INV`, `SoD` của **BRD v3.6** · 41 mã màn hình · 21 activity diagram của **Business Workflows v2.2**.
>
> ⚠️ **Trạng thái đối chiếu — đọc trước khi trích tài liệu này** *(ghi ngày 08/09/2026)*: các phép kiểm ở mục 4 **chạy ngày 07/09/2026 với bộ nguồn khi đó**: User Flows **v0.3**, BRD **v3.5**, Business Workflows **v2.0**. Bộ nguồn hiện tại là **v0.4 / v3.6 / v2.2** và **phép kiểm CHƯA được chạy lại toàn bộ** với bộ mới. Chỉ dòng `UF-09` được sửa theo User Flows v0.4 *(`QĐ-08`)* và phép đếm mã màn hình được chạy lại — xem mục 4.1. Vì vậy tài liệu này dùng được như **chỉ mục luồng màn hình**, nhưng **không được trình bày là đã đối chiếu đầy đủ với bộ nguồn hiện hành**.
> **Dùng cho ai:** dev frontend đọc để dựng Figma hoặc đưa vào công cụ sinh giao diện; hội đồng đọc để thấy hệ thống vận hành từ phía người dùng.

---

## 0. Giáo viên hỏi “main flows” thì đưa cái nào

Câu hỏi này có một câu trả lời gọn, và nó phụ thuộc vào **vế sau của câu hỏi**, không phụ thuộc vào tài liệu nào đẹp hơn.

| Giáo viên thực sự đang hỏi                        | Đưa tài liệu nào                                                             | Vì sao                                                                        |
| ------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| *“Hệ thống của em chạy thế nào?”* — mạch tổng thể | **User Flows nghiệp vụ v0.4, mục 1.4 → 1.9** — sáu main flow `MF-0` → `MF-5` | Ngắn, thuần chữ, một main flow vừa một slide. Trả lời được trong 30 giây      |
| *“Ai làm gì, ai bàn giao cho ai?”*                | **Business Workflows v2.2** — 21 activity diagram có swimlane                | Swimlane cho thấy `SoD-1` → `SoD-6` thành hình, không cần giải thích bằng lời |
| *“Người dùng bấm gì, thấy màn hình nào?”*         | **Tài liệu này** — 14 screen flow                                            | Nút là màn hình có mã, cạnh là hành động của người dùng                       |

**Câu trả lời một dòng khi bị hỏi bất ngờ:**

> *“Nhóm em có ba tầng: main flow tổng ở User Flows để nắm mạch, activity diagram để thấy bàn giao giữa các vai trò, và screen flow để dựng giao diện. Thầy muốn xem tầng nào ạ?”*

Câu đó chuyển thế bị động thành chủ động, và nó chứng minh nhóm **biết ba thứ này khác nhau** — điều mà phần lớn đồ án không phân biệt được.

> ⚠️ **Đừng gọi tài liệu này là “main flows”.** Main flow là `MF-0` → `MF-5`. Ba cái tên `MF` / `WF` / `UF` phải giữ tách bạch, nếu không đến buổi bảo vệ sẽ có ba tài liệu cùng tự nhận là “luồng chính”.

---

## 1. Ba tầng và ranh giới giữa chúng

| Tầng          | Tài liệu                | Số lượng                | Một nút là gì                        | Ký pháp                             |
| ------------- | ----------------------- | ----------------------- | ------------------------------------ | ----------------------------------- |
| **Nghiệp vụ** | User Flows v0.4         | 6 `MF` + 43 `F-xx`      | Một bước nghiệp vụ                   | Cây gạch nối thuần chữ              |
| **Quy trình** | Business Workflows v2.2 | 17 `WF` + 4 biểu đồ con | Một hành động của một tác nhân       | UML Activity + swimlane             |
| **Màn hình**  | **Tài liệu này**        | 14 `UF`                 | **Một màn hình có mã trong UI Spec** | Flowchart, kỷ luật activity diagram |

**Vì sao screen flow không dùng lại swimlane.** User flow theo nghĩa UX là hành trình của **một vai trò**. Không có nhiều làn thì swimlane mất đúng thứ làm nó đáng dùng, và vẽ lại 21 `WF` ở dạng khác chỉ tạo ra tài liệu thứ hai để lệch. Ở đây các bước của vai trò khác được thể hiện bằng **nút hệ thống** (người dùng chỉ thấy trạng thái) hoặc **nút chuyển sang user flow khác**.

**Quy tắc phân biệt, dùng khi không chắc một thứ thuộc tầng nào:**

- Có bàn giao giữa hai tác nhân → **workflow** (`WF`).
- Một tác nhân, đi qua nhiều màn hình, có màn hình rỗng và màn hình lỗi → **screen flow** (`UF`).
- Không có sự kiện kích hoạt, chỉ là màn hình để tra cứu → **không phải flow**, để ở UI Spec.

---

## 2. Ký pháp

### 2.1. Sáu loại nút

| Hình                               | Loại                                  | Nghĩa                                                                                       |
| ---------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------- |
| Chữ nhật bo tròn hai đầu, viền mực | **Bắt đầu · Kết thúc**                | Mỗi sơ đồ có đúng một điểm bắt đầu; kết thúc nền xanh là kết cục tốt, nền đỏ là kết cục xấu |
| Chữ nhật viền xanh, nền trắng      | **Màn hình người dùng thao tác**      | Dòng đầu in đậm là **mã màn hình trong UI Spec**                                            |
| Chữ nhật viền xám, nền xám nhạt    | **Hệ thống tự xử lý**                 | Người dùng không bấm gì, chỉ thấy kết quả                                                   |
| Hình thoi viền hổ phách            | **Điểm rẽ nhánh**                     | Mọi cạnh ra **bắt buộc** mang guard trong nhãn                                              |
| Chữ nhật viền đỏ                   | **Màn hình chặn hoặc trạng thái lỗi** | Hiện thực `NT-UI-5`: lỗi là công dân hạng nhất                                              |
| Chữ nhật nét đứt, nền xanh xám     | **Sang user flow khác**               | Không vẽ lại nội dung đã có ở `UF` kia                                                      |

### 2.2. Bảy quy tắc vẽ

1. **Một sơ đồ, một điểm bắt đầu.** Nhiều điểm bắt đầu nghĩa là đang gộp hai flow.
2. **Mọi cạnh ra của điểm rẽ nhánh mang guard**, đặt trong nhãn trên cạnh — không đặt trong nút.
3. **Nút mang tên hành động hoặc tên màn hình**, không mang quy tắc nghiệp vụ dài dòng; mã `BR` đặt ở dòng cuối của nút.
4. **Không nút mồ côi, không nhánh cụt.** Mọi nút trừ điểm bắt đầu đều có cạnh vào; mọi nút trừ điểm kết thúc đều có cạnh ra.
5. **Đường đi vuông góc**, không có đường chéo.
6. **Không dùng màu làm kênh thông tin duy nhất** — hình dạng và viền đã đủ phân biệt loại nút, đúng yêu cầu tiếp cận ở UI Spec mục 9.
7. **Dưới 24 nút một sơ đồ.** Vượt ngưỡng thì tách sang một `UF` khác và nối bằng nút nét đứt.

### 2.3. Mười phép kiểm chạy tự động trước khi xuất

Bộ sinh từ chối xuất nếu vi phạm bất kỳ điều kiện nào. Đây là cách bắt lỗi ký pháp bằng máy thay vì bằng mắt.

| #   | Phép kiểm                                             |
| --- | ----------------------------------------------------- |
| K1  | Mỗi sơ đồ có đúng một điểm bắt đầu                    |
| K2  | Mỗi sơ đồ có ít nhất một điểm kết thúc                |
| K3  | Điểm bắt đầu không có cạnh vào và có đúng một cạnh ra |
| K4  | Điểm kết thúc không có cạnh ra                        |
| K5  | Mọi nút đều có cạnh vào                               |
| K6  | Mọi nút trừ điểm kết thúc đều có cạnh ra              |
| K7  | **Mọi cạnh ra của điểm rẽ nhánh đều mang guard**      |
| K8  | Điểm rẽ nhánh có ít nhất hai cạnh ra                  |
| K9  | Không hai nút nào trùng ô lưới                        |
| K10 | Không cạnh nào đi xuyên qua một nút khác              |

**Kết quả lần chạy cuối: 14 sơ đồ, 0 lỗi, 0 nút bị tràn chữ.**

### 2.4. Vì sao bản `.drawio` và bản ảnh không thể lệch nhau

Cả hai sinh ra từ **một tệp đặc tả duy nhất**. Mỗi nút và mỗi cạnh chỉ được viết một lần; sửa một bước thì cả hai bản đổi cùng lúc và mười phép kiểm chạy lại. Đây là cách xử lý trực tiếp bài học đã ghi ở Định nghĩa Phạm vi mục 7.1: *hai nguồn chân lý mâu thuẫn tốn kém hơn một nguồn chân lý chưa hoàn hảo.*

---

## 3. Mười bốn user flow

| Mã        | User flow                                         | Vai trò      | Nút | Rẽ nhánh | Màn hình                               | Chuỗi demo | Luồng nghiệp vụ  |
| --------- | ------------------------------------------------- | ------------ | --- | -------- | -------------------------------------- | ---------- | ---------------- |
| **UF-01** | Nhân viên xin cấp phần mềm                        | Employee     | 22  | 5        | EMP-01 → EMP-04                        | **D-1**    | F-07, F-08       |
| **UF-02** | Nhân viên xin phần mềm chưa có trong danh mục     | Employee     | 16  | 2        | EMP-01, EMP-02, EMP-03, SYS-02         | —          | F-09             |
| **UF-03** | Nhân viên xem và xuất dữ liệu của chính mình      | Employee     | 11  | 1        | SYS-02, SYS-03, EMP-01, EMP-03         | —          | F-40             |
| **UF-04** | Quản lý duyệt yêu cầu cấp quyền                   | Manager      | 15  | 3        | MGR-02, MGR-03, MGR-06                 | **D-1**    | F-07, F-08, F-13 |
| **UF-05** | Quản lý xác nhận license                          | Manager      | 15  | 2        | MGR-04                                 | **D-2**    | F-21, F-23       |
| **UF-06** | IT Admin nạp dữ liệu sử dụng                      | IT Admin     | 23  | 6        | ITA-07, ITA-08                         | **D-2**    | F-17, F-42       |
| **UF-07** | IT Admin xử lý hàng đợi chưa khớp danh tính       | IT Admin     | 12  | 2        | ITA-09                                 | —          | F-18             |
| **UF-08** | IT Admin xử lý hàng đợi cấp phát                  | IT Admin     | 17  | 4        | ITA-05                                 | —          | F-10, F-11, F-12 |
| **UF-09** | IT Admin xử lý nhân viên nghỉ việc                | IT Admin     | 17  | 2        | ITA-04, ITA-10, ITA-12, ITA-13, ITA-14 | **D-3**    | F-05, F-41       |
| **UF-10** | IT Admin xử lý bảng tối ưu license                | IT Admin     | 17  | 2        | ITA-04, ITA-10                         | **D-2**    | F-19, F-20, F-22 |
| **UF-11** | Tài chính duyệt chi phí và quyết định kỳ gia hạn  | Finance      | 19  | 3        | FIN-03, FIN-05                         | —          | F-08, F-26, F-27 |
| **UF-12** | Phát hiện và hợp thức hóa phần mềm ngoài danh mục | Finance + IT | 21  | 4        | FIN-04, ITA-03, ITA-07, ITA-15         | **D-4**    | F-31, F-32, F-34 |
| **UF-13** | Super Admin sửa cấu hình và luồng phê duyệt       | Super Admin  | 15  | 3        | ADM-02, ADM-03, SYS-04                 | —          | F-37, F-38       |
| **UF-14** | IT Admin xử lý sai lệch và mâu thuẫn dữ liệu      | IT + Finance | 19  | 3        | ITA-04, ITA-05, ITA-11, ITA-15, FIN-04 | —          | F-28, F-35, F-43 |

**Tổng: 239 nút · 39 điểm rẽ nhánh · 27 màn hình · 4 chuỗi demo được phủ kín.**

### 3.1. Bốn chuỗi demo đi qua những user flow nào

| Chuỗi                                      | Đi qua                                                    | Thông điệp chứng minh                                       |
| ------------------------------------------ | --------------------------------------------------------- | ----------------------------------------------------------- |
| **D-1** Xin công cụ có phát sinh chi phí   | `UF-01` → `UF-04` → `UF-11` → `UF-08` → về `UF-01`        | Quy trình chính thức nhanh và có kiểm soát                  |
| **D-2** Từ file nhật ký tới tiền tiết kiệm | `UF-06` → `UF-07` → `UF-10` → `UF-05` → `UF-08` → `UF-11` | Phát hiện có bằng chứng, và trung thực về số tiền           |
| **D-3** Nhân viên nghỉ việc                | `UF-09` → `UF-08`                                         | Vừa là chi phí vừa là lỗ hổng bảo mật, độ tin cậy tuyệt đối |
| **D-4** Phát hiện chi tiêu ngoài danh mục  | `UF-12` → `UF-02` → `UF-08`                               | Đưa Shadow IT vào diện quản trị, không kết tội              |

### 3.2. Mười bốn màn hình không có screen flow, và vì sao

| Màn hình                                                                | Vì sao không vẽ                                                                        |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `SYS-01` Đăng nhập · `SYS-05` Checklist khởi tạo                        | Luồng tuyến tính, không có điểm rẽ nhánh nghiệp vụ                                     |
| `ITA-01`, `FIN-01` Bảng điều khiển                                      | **Năng lực tra cứu, không có sự kiện kích hoạt** — mỗi ô là điểm vào của một `UF` khác |
| `ITA-02`, `ITA-06`, `MGR-01`, `MGR-05`, `FIN-02` Danh sách và tổng quan | Như trên                                                                               |
| `FIN-06` Ngân sách · `ADM-04` Nhật ký · `ADM-05` Tác vụ nền             | Như trên                                                                               |
| `ADM-01` Người dùng và vai trò                                          | Thao tác quản trị đơn lẻ, đã nằm trong `UF-13` ở mức nguyên tắc                        |
| `ITA-03` Chi tiết ứng dụng                                              | Là đích đến của `UF-12`, không phải một hành trình riêng                               |

> Nói ra danh sách này có lợi khi bảo vệ: nó chứng minh 14 flow **được lọc**, không phải gom cho dày. Phép kiểm dùng ở đây giống hệt phép kiểm ở Business Workflows mục 2.3.

---

## 4. Kết quả đối chiếu — chạy ngày 07/09/2026 *(với bộ nguồn v0.3 / v3.5 / v2.0)*

> 📌 **Nhãn thời điểm.** Toàn bộ mục 4 là **kết quả của lần chạy ngày 07/09/2026**, đối chiếu với User Flows v0.3, BRD v3.5 và Business Workflows v2.0. Giữ nguyên làm bằng chứng lịch sử. **Không đọc mục này như kết quả đối chiếu với v0.4 / v3.6 / v2.2.** Ngoại lệ duy nhất đã chạy lại ngày 08/09/2026 là dòng mã màn hình ở mục 4.1.

### 4.1. Đối chiếu mã của chính tài liệu này

| Nhóm mã                                                                                       | Số lượng dùng | Kết quả                                                      |
| --------------------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------ |
| Mã màn hình `SYS/EMP/MGR/ITA/FIN/ADM`                                                         | **41**        | ✅ **Chạy lại 08/09/2026:** 41 mã duy nhất, **khớp đúng 41 mã của User Flows v0.4, không có mã chết**. 🛑 *Kết quả cũ ghi "27 mã, toàn bộ tồn tại trong UI Spec mục 4" — **không kiểm chứng được**: tài liệu UI Spec đặc tả màn hình **không tồn tại trong repo**. Nay đối chiếu với User Flows, là nguồn có thật* |
| Quy tắc `BR-xx.x`                                                                             | 36            | **Toàn bộ tồn tại trong User Flows v0.3** — không có mã chết |
| Luồng `F-xx`                                                                                  | 26            | **Toàn bộ tồn tại trong User Flows v0.3**                    |
| `FR-3.6`, `FR-4.15`, `FR-6.5`, `FR-7.2`                                                       | 4             | Tồn tại trong BRD v3.5                                       |
| `SoD-1`, `SoD-2`, `SoD-4` · `KPI-4` · `ADR-10` · `G1` → `G4` · `PP-2`, `PP-5` · `D-1` → `D-4` | 15            | Tồn tại                                                      |

### 4.2. Đối chiếu nội dung với BRD v3.5

Bảy điểm dễ vẽ sai nhất đã tra lại tại nguồn:

| Nội dung trên sơ đồ                                               | Căn cứ BRD | Khớp |
| ----------------------------------------------------------------- | ---------- | ---- |
| Ngưỡng 30–59 / ≥60 / ≥90 ngày, mức “theo dõi” không gửi thông báo | `FR-4.12`  | ✅    |
| Thứ tự ưu tiên ngưỡng: ứng dụng > phòng ban > tổ chức > mặc định  | `FR-4.13`  | ✅    |
| Hai con số tiết kiệm tách biệt, không bao giờ cộng                | `FR-4.15`  | ✅    |
| Nguồn bắt buộc khai định nghĩa “hoạt động”                        | `FR-4.16`  | ✅    |
| Miễn trừ bắt buộc có hạn, tối đa 12 tháng                         | `FR-3.10`  | ✅    |
| Quá hạn thì nhắc rồi leo cấp, **không tự duyệt**                  | `FR-3.8`   | ✅    |
| Người duyệt dự phòng ở gốc cây tổ chức                            | `FR-3.6`   | ✅    |

### 4.3. Có cần đối chiếu với Business Workflows v2.0 không

**Về nguyên tắc thì không** — BRD v3.5 là nguồn chân lý duy nhất, hai tài liệu cùng suy ra từ đó nên đối chiếu chéo không thêm thẩm quyền.

**Nhưng vẫn nên chạy một lần**, vì hai tài liệu cùng nguồn vẫn lệch nhau được, và hội đồng bắt lỗi lệch chứ không bắt lỗi thẩm quyền. Lần chạy này tìm được một chỗ:

> Business Workflows v2.0 mục 0.5 đã chuyển `F-35` (đối soát hóa đơn) từ `WF-17` sang `WF-16`, và mục 6 việc số 5 ghi rõ **User Flows v0.3 cần cập nhật theo**. Việc đó **vẫn chưa làm**. Tài liệu này vẽ `F-35` cùng chỗ với `F-28` và `F-43` ở `UF-14`, tức là theo cách phân loại mới — nên nếu nhóm không sửa User Flows, sẽ có ba tài liệu nói hai kiểu.

---

## 5. Sáu lỗi tồn phát hiện khi đối chiếu

Xếp theo mức dễ bị hội đồng nhặt ra.

| #     | Ở đâu                                  | Lỗi                                                                                                                                                 | Sửa thành                                                                                         |
| ----- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **1** | UI Spec `NT-UI-3` và mục 11            | Dẫn `INV-08` cho *“thu hồi seat giữa kỳ không tiết kiệm được đồng nào”*. Trong BRD v3.5, **`INV-08` là “không ai duyệt yêu cầu của chính mình”**    | Dẫn **`FR-4.15`** — không có mã `INV` nào cho nội dung này                                        |
| **2** | UI Spec `MGR-04` và mục 11             | Dẫn `INV-11` cho hộp thoại miễn trừ bắt buộc có hạn. **`INV-11` là “nguồn phải khai định nghĩa hoạt động”**                                         | Dẫn **`INV-09`** (BRD mục 5.12.3, vòng đời `Attestation`)                                         |
| **3** | UI Spec `NT-UI-6`                      | Dẫn `INV-14` cho *“đánh dấu `is_service_account` bắt buộc ghi chú”*. **`INV-14` là “một nhân viên gắn với đúng một Cost Center tại mỗi thời điểm”** | Bỏ mã, hoặc tìm đúng mã trong BRD mục 5.12.2                                                      |
| **4** | UI Spec `EMP-02` bước 2                | Dẫn `BR-01.2` cho *“quá 12 tháng cần xác nhận thêm”*. **`BR-01.2` là quy tắc đánh dấu dữ liệu khởi tạo**                                            | Dẫn **`BR-07.4`**                                                                                 |
| **5** | UI Spec, dòng nguồn và 4 chỗ dẫn chiếu | Ghi *“Nguồn: BRD v2.0, Domain Spec Phần 1, Phần 1b (ERD), Phần 2”*; còn dẫn *“Phần 1b mục 4.5”*, *“Phần 2 mục 5.2”*, *“Phần 2 mục 10”*              | BRD nay là **v3.6**; bộ Domain Spec **đã gỡ bỏ** ở v3.5 và **đã xóa khỏi repo**, nội dung lõi chuyển vào **BRD mục 5.12** |
| **6** | Tên tệp Business Workflows             | Tệp tên `... v1.0.md` nhưng nội dung bên trong ghi *“Phiên bản 2.0 — thay thế v1.0”*                                                                | Đổi tên tệp thành **v2.0**                                                                        |

**Hai khoản nợ cũ** đã ghi ở User Flows v0.3 mục 10 và Business Workflows mục 6 — **cả hai nay đã đóng**:

- ~~Định nghĩa Phạm vi v1.1 mục 5.2 vẫn ghi phạm vi `37 / 5 / 1`~~ → ✅ **đã sửa thành `38 / 3 / 2`** ở Định nghĩa Phạm vi v1.2 *(08/09/2026)*.
- ~~Chưa chốt vai trò nào đóng người duyệt dự phòng ở gốc cây~~ → ✅ **đã chốt** *(`QĐ-02`, nhóm trưởng, 08/09/2026)*: **một Employee cụ thể do Super Admin cấu hình**, duyệt với tư cách vai Manager. Xem BRD `FR-3.6`. Nhánh trên `UF-01` và `UF-04` nay có tác nhân.

> ✅ **Đã sửa trong chính tài liệu này ngày 08/09/2026** *(`QĐ-08`)*: dòng `UF-09` ở bảng mục 2 trước ghi `ITA-05, ITA-10, ITA-12 → ITA-14`, lệch hai chỗ so với User Flows v0.4 (bản mới hơn). Nay sửa thành `ITA-04, ITA-10, ITA-12, ITA-13, ITA-14`. `ITA-13` là màn hình *"Chuyển trạng thái Đang bàn giao, đặt ngày làm việc cuối"*, gắn `BR-05.3`.
>
> ⚠️ **Chưa sửa và KHÔNG được đánh dấu đã sửa:** sáu lỗi ở bảng trên nằm trong **UI Spec** — tài liệu đó **không tồn tại trong repo**, nên không có tệp đích để sửa. Chúng vẫn mở.
>
> 🔄 **Đính chính 08/09/2026 — kiểm tại nguồn ở lượt review diagram.** Mô tả *"`.drawio` của `UF-09` chưa đồng bộ — cần **thêm** nút `ITA-13` và **đổi** `ITA-05` thành `ITA-04`"* **là sai**. Parse XML và render trang `UF-09` cho thấy các nút **đã đúng từ trước**: `ITA-12` · `ITA-13` *(kèm `BR-05.3`)* · `ITA-14` · `ITA-10` ×2 · `ITA-04` *(kèm `BR-14.2`)*, và **không tồn tại nút `ITA-05` nào** trong trang này. Thứ thật sự lệch chỉ là **dòng phụ đề (metadata)** ghi *"màn hình ITA-12, ITA-13, ITA-10, ITA-05"*. **Đã sửa phụ đề** ở lượt này; không thêm hay đổi nút nào.
>
> Năm trong sáu lỗi nằm ở UI Spec, và UI Spec là **đầu vào trực tiếp của Figma**. Sửa trước khi dựng rẻ hơn nhiều so với sửa sau, vì mỗi mã sai sẽ được chép lại vào chú thích trong Figma, rồi vào comment trong mã nguồn.

---

## 6. Việc còn lại

| #   | Việc                                                                                                       | Người     | Mốc                           |
| --- | ---------------------------------------------------------------------------------------------------------- | --------- | ----------------------------- |
| 1   | Sửa 4 mã sai trong UI Spec (`INV-08`, `INV-11`, `INV-14`, `BR-01.2`) và cập nhật dòng nguồn                | Phú       | Trước khi dựng Figma          |
| 2   | ~~Sửa con số phạm vi ở Định nghĩa Phạm vi mục 5.2 thành `38 / 3 / 2`~~ → ✅ **đã xong** ở Định nghĩa Phạm vi v1.2 *(08/09/2026)* | Phi       | ✅ Đã đóng                     |
| 3   | Ghi `F-35` thuộc `WF-16` vào **User Flows v0.4** mục 1.10 — **vẫn mở**                                     | Phi       | Lần cập nhật kế tiếp          |
| 4   | ~~Chốt vai trò người duyệt dự phòng ở gốc cây~~ → ✅ **đã chốt** *(`QĐ-02`, 08/09/2026)*: một Employee cụ thể do Super Admin cấu hình | Nhóm      | ✅ Đã đóng                     |
| 5   | Dùng 14 sơ đồ này làm đầu vào cho Figma: mỗi nút màn hình là một frame, mỗi cạnh là một liên kết prototype | Phú, Đăng | Sau khi có ERD                |
| 6   | Đối chiếu mã màn hình khi UI Spec lên v0.2 — nếu thêm hoặc bỏ màn hình thì chạy lại phép kiểm mục 4.1      | Phú       | Mỗi lần UI Spec đổi phiên bản |