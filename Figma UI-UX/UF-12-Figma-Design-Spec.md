# SaaS-Sentry — Đặc tả thiết kế UI cho UF-12

> **Phiên bản:** 1.0 — 17/09/2026  
> **Trạng thái:** Đã hiện thực và kiểm chứng  
> **Bàn giao:** 20 PNG Light + 20 PNG Dark, mỗi ảnh là một artboard desktop độc lập 1440 × 1024  
> **Nguồn nghiệp vụ:** BRD mục 5.6 (`FR-6.1`–`FR-6.9`), User Flows mục 11.15 (`UF-12`), `UF-12.drawio`, `QĐ-20`, `QĐ-23`

## 1. Mục tiêu và nguyên tắc khóa

UF-12 đưa Shadow IT vào diện quản trị: có bằng chứng, người chịu trách nhiệm và quyết định đã ghi audit — không kết luận vi phạm trước khi IT Admin quyết định.

- Có đúng ba nguồn evidence: sao kê/hóa đơn, export OAuth/enterprise-app từ IdP và dữ liệu tiện ích trình duyệt đã lọc.
- Giá trị thô, giá trị chuẩn hóa, phương pháp khớp và confidence luôn được lưu/hiển thị cùng nhau.
- Exact dictionary và regex tự chuẩn hóa; fuzzy/AI luôn confidence thấp và bắt buộc IT xác nhận.
- Collector chỉ có tên miền trong VendorDictionary, số nhân viên đã xác nhận, khoảng ngày; không URL, tiêu đề, nội dung hoặc tên miền lạ.
- Một vendor có tối đa một DiscoveryFinding mở. Evidence xuất hiện lại cập nhật finding đó; finding `Báo nhầm` xuất hiện lại thì mở lại.
- `Đã duyệt` là kết cục bình thường/tích cực: IT hoàn thiện catalog, tạo request mua chính thức và ghi người đang dùng thành quyền chính thức. Không suy diễn purchase request đã được duyệt chi.
- `Chưa duyệt` chỉ handoff sang UF-08; không tự thu hồi quyền. Manager chỉ được yêu cầu bối cảnh trong cây quản lý trực tiếp; Cost Center dùng khi cần gom chi phí.

## 2. Khung giao diện

Workspace dùng shell SaaS-Sentry của UF-07 đến UF-10: sidebar trái, topbar, tracker, vùng nội dung và panel kiểm soát phải. Tracker có sáu chặng trình bày, không phải business wizard: `Tổng quan → Tiếp nhận → Chuẩn hóa → Finding → Quyết định → Kết quả`.

Panel phải giữ ID lần chạy `RUN-DISC-20260917-0900`, lần import cuối, nguồn đang xem, số finding mở, vendor đã chuẩn hóa, finding chờ IT, finding đã đóng và audit gần nhất. Light dùng kem/cam; Dark dùng navy/xanh điện từ ThemeLightExample/ThemeDarkExample.

## 3. Dữ liệu demo chuẩn

| Thực thể | Giá trị đồng bộ |
| --- | --- |
| Run | `RUN-DISC-20260917-0900` · 17/09/2026 09:00 ICT · Automation Service |
| Finding chính | `FND-2026-045` · Canva Pro · `Cần xem xét` · 7 người · 1.800.000 đ/tháng · rủi ro Cao |
| Evidence Finance | `EVD-FIN-8891` · raw `PAYPAL*CANVA PRO 0926` → `Canva` · AI suggestion → IT xác nhận bắt buộc |
| Evidence IdP | `EVD-IDP-4420` · `www.microsoft.com` → Microsoft 365 · catalog đã duyệt |
| Evidence Collector | `EVD-COL-1728` · `loom.com` → Loom · 3 nhân viên xác nhận · 10–16/09/2026 · không URL |
| Dedupe | `EVD-COL-1741` thêm vào `FND-2026-045`; last seen cập nhật, không sinh finding thứ hai |
| Owner context | Lê Thu Hà · NV-0311 · “Nhóm Marketing dùng Canva để chuẩn hóa bộ nhận diện chiến dịch.” |
| Báo nhầm | `FND-2026-039` · `Canva Test Sandbox` · đóng 12/09; nếu tái xuất hiện sẽ `Mở lại` |
| Hợp thức hóa | `CAT-CANVA-01` · request mua `REQ-2026-212` · 7 Assignment ghi nguồn `Regularized from FND-2026-045` |
| Handoff chưa duyệt | `PV-2074` chỉ được tạo dưới dạng ProvisioningTask trong UF-08 sau quyết định `Chưa duyệt` |

## 4. Registry 20 frame

| # | Chặng | State | Nội dung bắt buộc |
| ---: | ---: | --- | --- |
| 01 | 1 | dashboard | Ba nguồn, 6 finding mở, không gọi finding là vi phạm |
| 02 | 1 | source-map | Khác biệt, giới hạn và dữ liệu tối thiểu của ba nguồn |
| 03 | 2 | finance-intake | Upload/preview sao kê `EVD-FIN-8891`, raw value còn nguyên |
| 04 | 2 | idp-intake | Import enterprise-app `EVD-IDP-4420` |
| 05 | 2 | collector-intake | Batch `EVD-COL-1728`, privacy guard: không URL/nội dung |
| 06 | 3 | normalize-overview | Raw → normalized → match → catalog → finding |
| 07 | 3 | auto-match | Exact/regex auto normalize; method quyết định confidence |
| 08 | 3 | assisted-confirm | Fuzzy/AI low confidence, IT phải xác nhận Canva |
| 09 | 3 | catalog-compare | Đối chiếu `VendorDictionary` với SaaS Catalog |
| 10 | 3 | catalog-present | Microsoft 365 đã trong catalog, kết thúc không tạo finding |
| 11 | 4 | dedupe-finding | Canva evidence thứ hai cập nhật `FND-2026-045` |
| 12 | 4 | finding-queue | Danh sách 6 finding, risk tier và owner state |
| 13 | 4 | finding-detail | Evidence bất biến, raw/normalized/method/confidence |
| 14 | 4 | owner-context | Yêu cầu/nhận bối cảnh trong đúng cây quản lý trực tiếp |
| 15 | 5 | it-decision | IT chọn Báo nhầm / Đã duyệt / Chưa duyệt, audit-required |
| 16 | 6 | false-positive | Nhánh Báo nhầm đóng finding, hiển thị rule reopen |
| 17 | 6 | approve-catalog | Nhánh Đã duyệt: form catalog đầy đủ, Business Owner bắt buộc |
| 18 | 6 | approve-success | Request mua được tạo, 7 quyền chính thức, finding đã duyệt |
| 19 | 6 | reject-handoff | Nhánh Chưa duyệt: handoff UF-08, không tự revoke |
| 20 | 6 | audit-summary | Timeline cuối và ba kết cục không chạy đồng thời |

## 5. Tính liên kết và acceptance criteria

Tracker sequence là `[1,1,2,2,2,3,3,3,3,3,4,4,4,4,5,6,6,6,6,6]`. Mọi frame dùng chung run ID, evidence ID, vendor mapping, owner, finding ID, count và timestamp. Frame 16–18–19 là các kết cục thay thế từ frame 15; frame 20 chỉ là summary minh họa cả ba, không ngụ ý một finding đi đồng thời qua ba kết cục.

Đạt khi: 20 ảnh mỗi theme; tất cả 1440 × 1024, không overflow; test kiểm mapping/branch/invariant; visual QA toàn bộ 40 ảnh; không đổi BRD, index, drawio hay UF-06–UF-10.

## 6. Hiện thực và kiểm chứng

- Artboard Light: `UF-12-FullFrames/Light/UF-12-Light-01.png` đến `UF-12-Light-20.png`.
- Artboard Dark: `UF-12-FullFrames/Dark/UF-12-Dark-01.png` đến `UF-12-Dark-20.png`.
- Mã nguồn tái tạo và script kiểm chứng nằm tại `UF-12-Sources/`.
- Đã chạy `uf12-data.test.js`, `uf12-renderer.test.js` và `verify-uf12-assets.ps1`: 20 ảnh Light + 20 ảnh Dark, mỗi ảnh 1440 × 1024; metadata evidence, outcome branch và tệp đầu ra đều hợp lệ.
- Đã kiểm tra trực quan toàn bộ 40 artboard ở cả hai theme: không thấy overflow, cắt chữ hay mất tương phản semantic.
