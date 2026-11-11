# Luồng chạy từng màn — Finance và Spending Approver

Căn cứ: `SEP/mainflows.md` (08/11/2026), `app/features/dashboard/{finance,approvals}`, `openapi/openapi.yaml`.
URL dạng `/dashboard/finance?tab=<tab>&id=<id>` và `/dashboard/spending-approver?tab=<tab>&id=<id>`.

Ký hiệu: ✅ đã có màn và có API · 🆕 màn mới thêm (10/11/2026) · ⚠ có một phần / lệch luồng · ❌ chưa có màn (cần BE)

---

## A. Spending Approver (`/dashboard/spending-approver`)

Menu: **Tổng quan** (`overview`) · **Hàng đợi** (`queue`) · **Ngân sách năm** (`annual-budget`).
Màn chi tiết không có trên menu, mở từ hàng đợi: `need`, `request`, `batch`.

### A1. MF-1 — Duyệt chi một Request ✅

| Bước | Màn | Việc làm | API |
|---|---|---|---|
| 1 | Tổng quan | Xem việc chờ duyệt chi, hạn sắp tới, thống kê kiểm tra ngân sách | `spendApprovalList`, `budgetVersionList` |
| 2 | Hàng đợi → tab *Chi* | Chọn Request cần quyết | `spendApprovalList` |
| 3 | Chi tiết Request (`request`) | Xem nhu cầu, snapshot ngân sách, kết quả kiểm tra (trong cơ sở / dùng dự phòng / bị chặn), cờ dự phòng + lý do trưởng phòng, cờ GH-3, tiền cả năm nếu là gói năm đầu | `accessRequestGet`, `spendApprovalGet`, `budgetCheckGet`, `budgetCheckYearList` |
| 4 | Chi tiết Request | Chọn **Duyệt** hoặc **Từ chối**; hệ thống kiểm lại ngân sách lúc duyệt. Check bị chặn thì khóa quyết định | `spendApprovalDecide` (nhóm: `spendApprovalLineDecide` từng người) |
| 5 | Chi tiết Request | (Tùy chọn) hỏi Finance qua trao đổi ngân sách; câu hỏi mở không khóa quyết định | `budgetInformationOfRequest`, `budgetInformationAsk` |
| 6 | Quay về Hàng đợi | Request đã quyết biến khỏi danh sách | — |

### A2. MF-1 — Duyệt cả lô ✅

1. Hàng đợi → tab *Chi* → mở lô (`batch`).
2. Chi tiết lô: xem từng Request trong lô (`spendBatchGet`, `spendBatchItemList`).
3. Quyết từng mục hoặc cả lô (`spendBatchDecide`). Kết quả hiện từng dòng, mục bị bỏ qua có lý do `SKIPPED`; không override hàng loạt.
4. Từ một Request trong lô có thể mở `request?batch=<id>` rồi quay lại lô.

### A3. MF-1 — Request một bước (trưởng phòng / phòng chưa có trưởng phòng) ✅

1. Hàng đợi → tab *Nhu cầu* (`?list=need`) → mở Request (`need`). Danh sách lấy từ thông báo `STEP_ASSIGNED`.
2. Màn nhu cầu: Approver quyết **nhu cầu** thay trưởng phòng; Request nhóm thì quyết theo từng người (`accessRequestNeedDecide`, `accessRequestLineNeedDecide`).
3. Sang màn *Chi tiết Request* (A1) để quyết chi; màn hiện lý do là Request một bước và cờ dự phòng.

### A4. MF-4 B5 — Duyệt phiên bản ngân sách phòng ✅

1. Ngân sách năm (`annual-budget`): danh sách phiên bản, lọc theo năm/trạng thái (`budgetVersionList`).
2. Chi tiết phiên bản: số cơ sở, dự phòng, đề xuất gốc (chỉ đọc), cờ vượt, lịch sử (`budgetVersionGet`, `budgetVersionLineList`, `budgetVersionHistoryList`, `budgetProposalGet`).
3. Quyết **Duyệt** / **Yêu cầu sửa** / **Từ chối**; hai lựa chọn sau bắt buộc lý do (`budgetVersionDecide`).
4. Duyệt → phiên bản thành hiện hành và khóa cả năm (B6, do hệ thống). Yêu cầu sửa → về Finance (màn F4). Từ chối → Finance lập phiên bản mới.

### A5. Chưa có màn ❌

| Nhu cầu | Lý do |
|---|---|
| Nhận báo cáo kỳ Finance phát hành (SBF-11 bước 7) | Chưa có API kỳ/báo cáo |
| Cảnh báo sự cố gia hạn ngoài ý muốn (SBF-20) | Chưa xác nhận API/thông báo cho role này |
| Hàng đợi Nhu cầu riêng, tìm kiếm toàn hàng đợi | API chưa có |

---

## B. Finance (`/dashboard/finance`)

Menu: **Tổng quan** · **Cost Center** · **Chu kỳ ngân sách** · **Đề xuất năm** · **Phiên bản ngân sách** · **Lô trình chi** · **Cam kết** · **Đóng kỳ** · **Báo cáo kỳ**.
Ngoài menu: `vendor-tax`, `saas-cost` (danh mục).

### F1. MF-4 B1 — Mở kỳ, nhập Trần năm, xem số liệu nền ✅ + 🆕

| Bước | Màn | Việc làm | API |
|---|---|---|---|
| 1 | Chu kỳ ngân sách | Bấm *Mở kỳ ngân sách*: năm, hạn nộp đề xuất, hạn duyệt, **Trần ngân sách phần mềm năm**, ưu tiên | `budgetCycleOpen` |
| 2 | Chu kỳ ngân sách → chi tiết kỳ (`id=<năm>`) | Xem trần, dự phòng kho, đã chia / chưa chia, hạn | `budgetCycleGet` |
| 3 | 🆕 Chi tiết kỳ → mục **Số liệu nền** | Xem theo phòng: số seat, chi phí ước tính cả năm, thực chi năm nay; bấm tên phòng để xem từng phần mềm (số seat/đã mua, giá tháng, số tháng, KPI-3, gợi ý Renew). Đầu mục có dòng **Chưa phân bổ — kho dùng chung** (seat Trống, chi phí, số thuê bao) và cảnh báo thuê bao thiếu giá | `budgetCycleBaseline` |
| 4 | Chi tiết kỳ | Lãnh đạo đổi trần → mở lại kỳ và nhập lại; bản cũ nằm trong lịch sử | `budgetCycleUpdate` |

### F2. MF-4 B2 — Chia Trần của phòng + Dự phòng kho ✅

1. Chi tiết kỳ → mục *Chia trần theo phòng*: nhập trần từng phòng, **Dự phòng kho dùng chung**, giải trình (`budgetDepartmentCeilingsSet`).
2. Mục *Gói tổng hợp các phòng* hiện còn lại cho các phòng, tổng đề xuất, tổng phiên bản, số vượt (`budgetCyclePackage`). Σ trần phòng + dự phòng kho > trần năm thì chia lại.
3. Bấm **Phát hành** (`budgetCyclePublish`). Chỉ bấm được khi trạng thái kỳ cho phép. Đổi trần sau khi phát hành thì kỳ hiện cảnh báo *đã đổi sau phát hành*.

### F3. MF-4 B3 — Nhận đề xuất BM-10 của trưởng phòng ✅

1. Đề xuất năm (`annual-proposals`): danh sách đề xuất đã nộp (`budgetProposalList`).
2. Chi tiết đề xuất: các dòng Renew / Change / New / Cancel, giải trình ZBB, cờ vượt trần phòng, tệp đính kèm (`budgetProposalGet`, `budgetProposalLineList`, `budgetProposalAttachmentList`).
3. Hai lựa chọn: **Trả đề xuất** về trưởng phòng kèm lý do (`budgetProposalReturn`) hoặc **Lập phiên bản** (F4).

### F4. MF-4 B4 — Lập phiên bản từng phòng ✅

1. Phiên bản ngân sách (`budget-negotiation`): tạo phiên bản từ đề xuất hoặc từ số liệu nền (`budgetVersionCreate`).
2. Chi tiết phiên bản: sửa số cơ sở, dự phòng (mặc định 10 %, khác thì ghi lý do), quý; thêm/sửa dòng, nhập dòng hàng loạt, đính kèm (`budgetVersionUpdate`, `budgetVersionLineAdd/Update`, `budgetVersionImport`, `budgetVersionAttachmentDeclare`).
3. Σ phiên bản > trần năm − dự phòng kho thì **chia lại** ngay ở bước này hoặc **trả đề xuất** (F3).
4. **Gửi duyệt** (`budgetVersionSend`) → Approver xử lý ở A4.
5. Nếu Approver yêu cầu sửa: phiên bản quay lại đây. Nếu từ chối: bấm **Dựng lại** để lập phiên bản mới (`budgetVersionCreate`).
6. Lịch sử mọi thay đổi ở mục *Lịch sử* (`budgetVersionHistoryList`).

### F5. MF-4 B6–B7 — Xem ngân sách hiện hành ✅

Cost Center (`cost-centers`): danh sách → chi tiết: KPI, các phiên bản đã duyệt, cam kết. Sau 01/01 phiên bản thành đối chiếu bất biến, do hệ thống đóng năm (Finance không thao tác).

### F6. Quản lý Cost Center ✅

Màn Cost Center hiện **chỉ xem** (danh sách, chi tiết, ngân sách, cam kết). Code không có thao tác tạo, đổi tên hay ngừng Cost Center, dù API có `costCenterCreate/Rename/Deactivate`. Đã sửa lại mục này sau khi kiểm tra, trước đó ghi nhầm là có.

### F7. MF-1 — Theo dõi lô trình chi ⚠

1. Lô trình chi (`spend-batches`) → danh sách theo phòng → chi tiết lô (`spendBatchList/Get/ItemList`). **Chỉ xem**, Finance không nằm trên đường Request.
2. Lệch với `mainflows.md`: màn còn nhãn "Chuyển Finance rà soát" (`SENT_TO_FINANCE`). Kiểu sinh từ OpenAPI đã bỏ `FINANCE_REVIEW`, nên cần rà lại phần này.

### F8. SBF-19 — Hóa đơn ⚠

1. Cam kết (`commitments`): lọc theo năm/Request, xem phần cam kết còn giữ (`budgetCommitmentList`).
2. **Ghi hóa đơn** vào cam kết: số, ngày, tiền gốc, thuế khấu trừ / không khấu trừ → kết quả `MATCHED` / `TAX_ONLY` / `PRICE_QUANTITY_EXCEPTION` (`budgetCommitmentInvoiceRecord`).
3. Xem hóa đơn của cam kết (`budgetCommitmentInvoiceList`); **giải phóng** phần dư (`budgetCommitmentRelease`, `budgetCommitmentReleases`).
4. **Lệch luồng:** `mainflows.md` quy định IT nộp, Finance xác nhận hoặc trả lại. API và màn hiện để Finance tự nhập, không có trạng thái chờ/xác nhận/trả lại.

### F9. Thuế nhà cung cấp và danh mục ✅

- `vendor-tax`: khai hồ sơ thuế nhà cung cấp, ước tính thuế, lịch sử.
- `saas-cost`: xem ứng dụng, gói, thuê bao (chỉ xem, SBF-20 Finance chỉ được báo).

### F10. Chưa có màn ❌ (cần BE)

| Luồng | Tình trạng |
|---|---|
| SBF-19 xác nhận / trả lại hóa đơn IT nộp | Thiếu trạng thái và endpoint |
| SBF-11 quy chi phí theo kỳ, đóng kỳ, báo cáo, phát hành | Menu *Đóng kỳ* và *Báo cáo kỳ* mở ra màn "chưa hỗ trợ" |
| SBF-11a sai lệch hóa đơn | Không có API |
| SBF-07 import sao kê, SBF-07a chi ngoài quy trình | Không có API |
| Cảnh báo dòng kho vượt dự phòng kho (G14), tỷ lệ seat Trống > 10 % | Chưa rõ mã thông báo |

---

## C0. Lịch sử phiên bản là màn riêng (11/11/2026)

- Approver: Ngân sách năm → chi tiết phiên bản → nút *Lịch sử phiên bản* → màn `?tab=version-history&id=<phiên bản>`; nút *Về phiên bản ngân sách* quay lại chi tiết.
- Finance: Phiên bản ngân sách → chi tiết → nút *Xem lịch sử* → màn `?tab=version-history&id=<phiên bản>`; quay lại bằng *Về phiên bản ngân sách*. Menu vẫn sáng mục *Phiên bản ngân sách*.
- Finance, Cam kết → nút *Giải phóng* ở một dòng → màn `?tab=commitment-release&id=<cam kết>&request=<request>`: xem cam kết (phòng, số tiền, đã giải phóng, đang giữ), nhập **Lý do** (bắt buộc) rồi *Giải phóng phần dư*; bên dưới là bảng *Các lần giải phóng trước đó*. Xong thì về danh sách Cam kết. Trước đây là hộp thoại.
- Role khác không bị đổi.

## C. Thay đổi lần này

- 🆕 `finance/budget-cycles/components/cycle-baseline.tsx`: mục **Số liệu nền** trong chi tiết kỳ (F1 bước 3), gọi `useBudgetCycleBaseline` (endpoint đã có, trước đó chưa màn nào dùng).
- `cycle-detail.tsx`: thêm mục trên. Bản dịch VI/EN ở `finance-budget.ts` (`budgetCycle.baseline.*`, `budgetCycle.baselineTitle`).
- Test: `budget-cycles/cycle-baseline.test.tsx`. Bộ test Finance và i18n (17 file, 50 ca) qua trước khi thêm test mới; test mới qua (1 ca). ESLint sạch.
- `pnpm typecheck` hiện vẫn lỗi ở các file ngoài phạm vi này (fixture test Employee/Super Admin và `request-actions.ts` còn dùng `AWAITING_FINANCE_REVIEW`, `FINANCE_REVIEW` mà OpenAPI đã bỏ). Không có lỗi trong file Finance mới.
