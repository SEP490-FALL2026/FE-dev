Tôi đã research xong và trả lời từng điểm bên dưới. Phần thuế được ghi thành ghi chú nghiên cứu riêng: [tax-saas-purchase-research-2026-10-08.md](Docs/Research-AI/tax-saas-purchase-research-2026-10-08.md). File này nằm ngoài Requiments. Tôi vẫn chưa sửa file nào trong Requiments.

Từ đây, "SaaS" dùng chung cho cả dịch vụ và phần mềm bản quyền, như bạn đề xuất.

---

## P1-1 — Mô hình tổ chức

**Vẫn giữ 6 role** (cộng tác nhân hệ thống Automation): Super Admin, IT Admin, Manager, Người duyệt chi, Finance, Employee.
- **Chức vụ** (Trưởng phòng, Designer, Dev, Kế toán…) chỉ là thông tin nhân sự, không phải role và không cho thêm quyền.
- Thay đổi duy nhất: **Manager = trưởng phòng được gán**, mỗi phòng 1 người. Trước đây Manager được suy ra từ cây `manager_id`.
- Trưởng phòng tự gửi yêu cầu thì bước duyệt nhu cầu đi lên Người duyệt chi. Đây là đề xuất, cần bạn chốt (câu hỏi 3 bên dưới).

**Cost Center là gì:** hiểu đơn giản là cái "túi tiền" trả lời câu hỏi *khoản chi này tính cho ai*.
- Finance đặt ngân sách cho từng túi.
- Mỗi lần mua hoặc cấp SaaS, chi phí rơi vào đúng một túi.
- Budget vs Actual được so theo từng túi.

**Với mô hình phòng ban:** mỗi phòng có đúng 1 Cost Center (loại `Unit`). Mua SaaS cho nhân viên hoặc cho cả phòng thì tính vào túi của phòng, và Finance cũng đặt ngân sách, theo dõi trên túi này. Đúng như bạn hiểu.

**Loại `Project`:** là một túi riêng, không phải túi con của phòng. Nó chỉ cần khi công ty muốn biết riêng chi phí công cụ của một dự án, ví dụ dự án outsource để tính giá cho khách. Thầy đã nói không quan tâm dự án, nên tôi **đề xuất bỏ loại `Project`**. Khi đó chỉ còn:
- `Unit` = phòng ban
- `Company` = công cụ dùng chung toàn công ty, ví dụ Google Workspace, Slack

**Cost Center có cập nhật được:**
- Finance tạo, sửa và ngừng dùng Cost Center (`FR-3.1` đã có).
- Tạo phòng mới thì tạo Cost Center 1–1 với phòng đó.
- Đổi trưởng phòng hay đổi tên phòng không đổi mã Cost Center, nên lịch sử chi phí không bị gãy (`ADR-04`).
- Tách hoặc gộp phòng: tạo Cost Center mới, Cost Center cũ ngừng dùng nhưng giữ nguyên lịch sử.

## P1-2 — Role và RACI

Bạn hiểu đúng cả ba điểm. Tôi bổ sung hai điểm:
- **IT Admin** có thêm bước *kiểm tra kỹ thuật và điều khoản* trước Người duyệt chi khi xin SaaS mới.
- **Finance** không nằm trên đường duyệt. Finance chỉ trả lời khi được hỏi về ngân sách, và ghi nhận khoản cam kết sau khi đã duyệt.

| Bước | Ai làm |
|---|---|
| Tạo yêu cầu | Employee (hoặc trưởng phòng tạo thay) |
| Duyệt nhu cầu | Manager (trưởng phòng) |
| Kiểm tra kỹ thuật/điều khoản (chỉ với SaaS mới) | IT Admin |
| Duyệt chi, "ký" duyệt mua | Người duyệt chi |
| Ghi nhận ngân sách | Finance |
| Thực hiện cấp/thu hồi | IT Admin |
| Lưu vết | Audit Trail tự động |

## P1-3 — Hồ sơ, biểu mẫu

**a) Phiếu yêu cầu cấp quyền (BM-01).** Đúng, đây là phiếu nhân viên gửi khi xin SaaS. Phiếu gồm:
- SaaS và gói muốn dùng
- Lý do
- Thời hạn cần dùng
- Dùng cá nhân hay dùng chung

Cost Center tự lấy theo phòng của nhân viên. Nếu SaaS chưa có trong danh mục thì đi kèm BM-02.

**b) Đề xuất mua SaaS mới (BM-02)** — đây là chỗ quyết định hệ thống *có kiểm soát được* SaaS đó hay không. Nhân viên chỉ khai phần nhu cầu, còn **IT Admin hoàn thiện phần đánh giá**:
- Nhà cung cấp, gói định mua (Cá nhân / Team / Business / Enterprise), mô hình giá, số người dùng
- Giá trước thuế, hồ sơ thuế, tổng ước tính (xem P2-5)
- Kiểu cấp: K1–K5 ở P2-4
- Có trang quản trị không, có xuất được danh sách thành viên/usage không, có SSO không
- Điều khoản có cho chia sẻ tài khoản không, loại dữ liệu sẽ đưa vào SaaS
- Công cụ trùng chức năng đã có trong danh mục

Từ các thông tin trên, IT Admin kết luận **mức kiểm soát** và Người duyệt chi nhìn thấy mức này khi quyết:
- **Đầy đủ**: có trang quản trị và xuất được danh sách thành viên
- **Một phần**: gói cá nhân, hệ thống chỉ biết những gì IT tự ghi lại
- **Không kiểm soát được**: phải ghi rõ rủi ro

**c) Quyết định hợp thức hóa (BM-07).** Dùng khi hệ thống phát hiện một SaaS **đang được dùng hoặc trả tiền ngoài danh mục** (Shadow IT), ví dụ sao kê có khoản trả Figma nhưng Figma chưa có trong danh mục. Quy trình (`WF-17`/`FR-3.4c-1` đã có):
1. Phát hiện.
2. IT xác minh: ai dùng, ai trả, gói gì, dữ liệu gì.
3. IT đánh giá kỹ thuật và điều khoản.
4. Người duyệt chi chọn một trong ba hướng:
   - **Hợp thức hóa**: đưa vào danh mục, tạo thuê bao, cấp quyền cho người đang dùng
   - **Thay bằng công cụ đã có**: chuyển người dùng sang công cụ có sẵn, hủy gói
   - **Từ chối**: hủy gói và thu hồi

Hồ sơ đi kèm:
- Bằng chứng phát hiện (dòng sao kê, receipt, dữ liệu quan sát)
- Đánh giá của IT
- Ý kiến của Business Owner nếu có công cụ trùng chức năng
- Quyết định kèm lý do
- Chứng từ của khoản đã chi, để Finance ghi nhận

*Lưu ý:* `MF-6` hiện đang là luồng phụ lục/bổ sung (`QĐ-49d`).

## P2-2 — Dùng chung tài khoản

Cần tách ba khái niệm hay bị lẫn:

| Khái niệm | Ví dụ | Cách xin |
|---|---|---|
| **Tài khoản cá nhân** (mặc định) | Mỗi người 1 lần đăng nhập Claude | Mỗi người gửi 1 yêu cầu |
| **Gói team** — nhiều tài khoản cá nhân nằm trong 1 workspace | ChatGPT Business cho 10 người: vẫn 10 lần đăng nhập riêng | **Trưởng phòng gửi 1 yêu cầu theo nhóm**, kèm danh sách người dùng → hệ thống tạo 10 quyền cá nhân |
| **Tài khoản dùng chung thật** — 1 bộ đăng nhập cho nhiều người | 1 tài khoản Canva cho cả phòng Marketing, 1 tài khoản host Zoom | 1 người đại diện xin, **chỉ được phép nếu điều khoản của gói cho chia sẻ** (P4-1) |

**Người chịu trách nhiệm tài khoản dùng chung:** mặc định là trưởng phòng, hoặc một nhân viên được chỉ định. Người này giữ danh sách ai đang dùng và báo khi có thay đổi. Chi phí tính vào Cost Center của phòng.

**Các vấn đề của tài khoản dùng chung:**
1. Vi phạm điều khoản, có nguy cơ bị nhà cung cấp khóa tài khoản.
2. Không đo được mức dùng của từng người, nên loại khỏi rule ghost seat (đã có ở 4.5).
3. Có người rời nhóm thì phải đổi mật khẩu. Hệ thống tạo việc này cho IT.
4. Không truy được ai đã làm gì trong tài khoản.
5. Mã xác thực 2 lớp (MFA/OTP) chỉ gửi về một điện thoại.
6. Dữ liệu của nhiều người bị trộn lẫn.

Hệ thống **không lưu mật khẩu** dùng chung. Mật khẩu để trong trình quản lý mật khẩu của công ty, ngoài phạm vi.

## P2-3 — Chỉ dùng tài khoản do công ty cấp

**Đồng ý, và tôi khuyến nghị làm vậy.** Cần làm rõ hai điểm:
- "Gmail" phải là **Google Workspace có tên miền công ty** (ten@congty.vn), **không** phải @gmail.com cá nhân do công ty tạo. Chỉ với tên miền công ty thì admin mới khóa được, sở hữu được dữ liệu, và đăng nhập bằng Google một lần cho mọi tool.
- **Vẫn phải "thêm" người vào workspace** với gói team. Có thể mời, tự tham gia theo tên miền, hoặc đồng bộ SCIM ở gói Enterprise. Điểm khác là chỉ chấp nhận email công ty, nên việc mời vẫn nằm trong kiểm soát.
- Lợi ích khi nghỉ việc: khóa tài khoản Google là chặn đăng nhập mọi tool cùng lúc. Nhưng **không tự dừng tính tiền**, vẫn phải gỡ seat ở từng nhà cung cấp.

⚠️ Nhóm hiện chỉ có tài khoản cá nhân, nên demo phải **mô phỏng** phần này và cần nói rõ khi trình bày.

## P2-4 — Kiểu cấp (định nghĩa ở mức **gói**, không ở mức ứng dụng)

Cùng là Claude: gói Pro thuộc K1, gói Team thuộc K2. Vì vậy kiểu cấp và mức kiểm soát là thuộc tính của **gói**.

| Kiểu | Ví dụ | Cách cấp | Cách thu hồi | Mức kiểm soát |
|---|---|---|---|---|
| **K1 Gói cá nhân** | Claude Pro, ChatGPT Plus, Canva Pro | IT mua gói trên email công ty của nhân viên, trả bằng thẻ công ty | Hủy gia hạn (vẫn dùng được tới hết kỳ), khóa tài khoản công ty | Thấp: không có trang quản trị, mỗi người một hóa đơn |
| **K2 Gói Team/Business** | Claude Team, ChatGPT Business, Figma, Notion, GitHub Team | IT là owner của workspace, thêm email công ty vào và gán seat | Gỡ thành viên trong trang quản trị | Trung bình–cao: xuất được danh sách thành viên để đối soát (`FR-2.6`); usage theo người còn hạn chế |
| **K3 Enterprise (SSO/SCIM)** | — | Tự động đồng bộ từ hệ thống định danh | Tự động | Cao, nhưng **chỉ đặc tả** vì không có ngân sách mua gói này (`RB-4`) |
| **K4 Khóa bản quyền** | Office 2021, Windows | IT import cả lô key (mã hóa, che bớt khi hiển thị), gán key cho người và máy công ty | Gỡ cài đặt; key về kho nếu license cho phép chuyển máy | Theo cặp key–thiết bị. *JetBrains có thể cấp theo tài khoản chứ không theo key, cần kiểm tra lại* |
| **K5 Nội bộ** | Phần mềm công ty tự làm | Theo `QĐ-50a`: Employee → Manager → IT cấp thủ công kèm bằng chứng | Thủ công | Không có chi phí, không đếm seat |

Đề xuất thêm một quy tắc: **từ 3 người dùng trở lên thì ưu tiên K2** để kiểm soát được.

Về chi phí: với Claude Team, gỡ thành viên **không được hoàn tiền ngay**, seat trống chỉ dùng lại được cho người khác. Như vậy tiền tiết kiệm chỉ có khi giảm số seat lúc gia hạn, khớp với `FR-4.15` đã có.

## P2-5 — Thuế (tóm tắt nghiên cứu)

**Có thuế, và có 3 trường hợp:**

| Trường hợp | Ai nộp | Ví dụ |
|---|---|---|
| **T1 — Nhà cung cấp trong nước** | Nhà cung cấp, có hóa đơn điện tử VN. Phần mềm có thể không chịu GTGT nếu đủ tiêu chí, không đủ thì 10% | Đại lý license, SaaS Việt |
| **T2 — Nước ngoài, đã đăng ký thuế tại VN** | Nhà cung cấp tự nộp, doanh nghiệp **không** khấu trừ | OpenAI, Anthropic, Canva, Google, Microsoft, Adobe, Zoom (có trong danh sách tới 29/04/2026) |
| **T3 — Nước ngoài, chưa đăng ký** | **Doanh nghiệp khấu trừ và nộp thay** thuế nhà thầu | Figma, Notion, Atlassian, GitHub, Slack, JetBrains (không thấy trong danh sách) |

**Các nguồn đang mâu thuẫn:**
- Có nguồn coi SaaS là *dịch vụ phần mềm*: không chịu GTGT, TNDN 5%.
- Có nguồn coi SaaS là *dịch vụ đám mây/viễn thông*: GTGT 10% từ 07/2025.
- Nếu là bản quyền cài đặt thì TNDN 10%.

Đây là lý do mạnh để **hệ thống không tự tính thuế**.

**Vì sao giá lúc duyệt khác tiền lúc trả:** nhà cung cấp nước ngoài thường báo giá net. Ở T3, doanh nghiệp phải quy đổi lên giá gross. Ví dụ giá 100 thành **≈110,8**. Ngoài ra còn tỷ giá và phí thẻ quốc tế.

**Khuyến nghị — phương án A: chỉ ghi nhận thuế, không tính và không kê khai.** Độ khó thấp–trung bình.
1. Mỗi nhà cung cấp có **hồ sơ thuế** (T1/T2/T3 kèm tỷ lệ ước tính) do Finance khai.
2. Request và khoản cam kết hiển thị: giá trước thuế + thuế ước tính + tổng.
3. IT mua và đính kèm receipt.
4. Finance nhập hóa đơn với **từng dòng thuế đúng như chứng từ**: loại thuế, tỷ lệ, số tiền, do nhà cung cấp thu hay doanh nghiệp nộp thay.
5. Báo cáo tách riêng **chênh lệch do thuế/tỷ giá** khỏi chênh lệch số lượng/đơn giá.

Phương án B (hệ thống tự tính thuế) khó và rủi ro pháp lý, vượt ràng buộc `RB-5`. Kê khai thuế, sổ cái, khấu trừ GTGT đầu vào vẫn ngoài phạm vi.

## P2-6, P4-2, P4-3, T-1 — gom thành một hạng mục nghiên cứu

Gom vào **một hạng mục "Nghiên cứu phương pháp thu thập usage"**: có tool nào làm được không, nhà cung cấp có cấp dữ liệu không, gói nào lấy được gì. Danh sách SaaS demo (T-1) sẽ chốt sau khi có kết quả hạng mục này.

**Riêng P4-3:** các cảnh báo dựa trên **dữ liệu nội bộ** thì làm được ngay, không cần chờ nghiên cứu:
- Quyền có thời hạn sắp hết
- Seat sắp bị thu hồi theo quyết định của Manager
- Trạng thái yêu cầu

Chỉ các cảnh báo dựa trên usage mới phụ thuộc hạng mục nghiên cứu.

## P3-1 — Phòng ban

**Dự án:** tôi đề xuất **không quản lý dự án như một đối tượng** — không có thành viên, không có bước duyệt, không có Cost Center. Dự án chỉ là **danh sách mô tả trong hồ sơ phòng**: tên, mô tả, các phòng tham gia, trạng thái. Nhân viên có thể ghi tên dự án vào yêu cầu để làm ngữ cảnh. Cách này khớp với ý thầy là không quan tâm dự án.

**Danh sách công cụ của phòng:** bạn hiểu đúng. Đây là toàn bộ quyền đang hiệu lực của phòng, gồm quyền cấp cho từng nhân viên, quyền dùng chung và key. Danh sách này **tự tổng hợp** từ dữ liệu cấp quyền, không ai phải nhập tay.

## P3-2 và P3-4 — Bộ công cụ chuẩn

Bạn hiểu đúng:
- **Chức vụ** (P3-4) kết hợp với **phòng ban** tạo thành **bộ công cụ chuẩn**.
- Khi Employee xin quyền, hệ thống hiện bộ chuẩn trước.
- Xin ngoài bộ chuẩn thì **bắt buộc ghi lý do** và hệ thống gắn cờ cho Manager.

**Có nên dùng AI?** Đề xuất **làm bằng quy tắc trước**: bộ chuẩn là danh sách cấu hình sẵn, kết quả luôn tất định. Có thể thêm AI sau, ví dụ gợi ý công cụ có sẵn trong danh mục dựa trên lý do nhân viên ghi. Nhưng `QĐ-49e` đang giới hạn MVP ở 2 tính năng AI, và thầy xếp AI ưu tiên cuối, nên nếu thêm thì cần một quyết định mới.

## P3-3 — Điều chuyển, nghỉ việc, kiêm nhiệm

### Quyền cá nhân

**Khi điều chuyển:**
- Công cụ có trong bộ chuẩn của phòng mới: giữ nguyên.
- Công cụ không có trong bộ chuẩn: trưởng phòng mới rà soát trong 5 ngày làm việc và chọn Giữ hoặc Thu hồi (`MF-7`).
- Chi phí chuyển sang Cost Center của phòng mới kể từ ngày hiệu lực.

**Khi nghỉ việc:** thu hồi toàn bộ quyền, **không có người kế nhiệm license**. Seat về pool (K2), hủy gia hạn (K1), hoặc key về kho (K4).

Tuy nhiên **"không kế nhiệm license" khác với "không bàn giao dữ liệu"**. Research cho thấy dữ liệu có thể mất nếu gỡ người trước khi bàn giao:
- **ChatGPT Business:** project và GPT chuyển cho owner, nhưng chat của người bị gỡ không chuyển và owner không xem được.
- **Figma:** file có thể thành *không có chủ sở hữu*. Ở gói Professional, bản nháp (draft) bị xóa vĩnh viễn.
- **Canva Teams:** phải chọn "chuyển design rồi gỡ", nếu không người bị gỡ mất quyền vào design ngay.
- **Claude Team:** mất quyền ngay, không được hoàn tiền ngay.

Vì vậy đề xuất **checklist nghỉ việc**:
1. Bàn giao dữ liệu theo **"lưu ý trước khi thu hồi"** ghi sẵn cho từng gói trong danh mục.
2. IT gỡ khỏi workspace, hủy gói hoặc thu key.
3. Khóa tài khoản công ty.
4. Seat trống chỉ thành tiền tiết kiệm khi giảm seat lúc gia hạn.

### Trường hợp team/dùng chung

| Tình huống | Xử lý |
|---|---|
| Người rời là **thành viên** của tài khoản dùng chung | Tạo việc cho IT đổi mật khẩu/OTP, cập nhật danh sách người dùng |
| Người rời là **người chịu trách nhiệm** tài khoản dùng chung | Phải chỉ định người mới trước khi đóng hồ sơ nghỉ việc. Mặc định là trưởng phòng; nếu chính trưởng phòng nghỉ thì trưởng phòng mới nhận (khớp `QĐ-40a`) |
| Người rời là **owner workspace phía nhà cung cấp** | Quy tắc mới: **owner/admin workspace luôn là tài khoản IT của công ty**, không bao giờ là cá nhân nhân viên, để tránh workspace mồ côi |
| Phòng bị giải thể hoặc gộp | Tài khoản dùng chung của phòng chuyển sang phòng mới hoặc đóng |

### Kiêm nhiệm

Mỗi người **chỉ thuộc 1 phòng tại một thời điểm**. Trưởng phòng của phòng đó duyệt yêu cầu, và Cost Center của phòng đó trả tiền.

Nếu người đó có giúp việc cho phòng khác, hệ thống **không ghi phòng thứ hai**. Công cụ cần cho phần việc đó vẫn xin qua phòng của mình và tính vào phòng của mình. Câu tôi viết lần trước ("thành viên dự án, Cost Center dự án") phức tạp hơn mức cần, và đã bỏ cùng với việc bỏ loại `Project`.

## P4-1 — Quản lý điều khoản của nhà cung cấp

Mỗi **gói** trong danh mục lưu:
- Link điều khoản và ngày IT rà soát gần nhất.
- Checklist các điều khoản chính:
  1. Có được chia sẻ tài khoản không
  2. Dữ liệu nhập vào có bị dùng để huấn luyện AI không, có tắt được không
  3. Nơi lưu trữ dữ liệu
  4. Giới hạn số cài đặt/thiết bị
  5. Có được dùng cho mục đích thương mại không (gói Free/Education thường không)
  6. Điều khoản hủy, tự gia hạn, hoàn tiền

Hệ thống cảnh báo khi:
- Đến hạn rà soát lại, ví dụ trước mỗi lần gia hạn.
- Có **vi phạm**, ví dụ tài khoản dùng chung trên gói cấm chia sẻ.

IT ghi lại những gì mình đọc được, có ý kiến của Business Owner. Hệ thống **không diễn giải pháp lý**.

## Các điểm khác

- **T-4:** bỏ, và ghi vào Out-of-scope.
- **P1-2 (RACI), P2-1, T-3, T-5, T-6, T-7:** làm theo đề xuất ở bảng trước.

---

## Cần bạn chốt thêm

1. **Bỏ Cost Center loại `Project`**, dự án chỉ là thông tin mô tả trong hồ sơ phòng? *(khuyến nghị: có)*
2. **Thuế:** chọn phương án A (chỉ ghi nhận), và so ngân sách trên **tổng chi thực tế gồm thuế**? *(khuyến nghị: có cả hai)*
3. **Trưởng phòng tự gửi yêu cầu** thì bước duyệt nhu cầu do Người duyệt chi đảm nhận? *(khuyến nghị: có)*
4. **Owner/admin workspace phía nhà cung cấp luôn là tài khoản IT công ty?** *(khuyến nghị: có)*

Khi bạn chốt xong, tôi sẽ ghi các quyết định từ `QĐ-52` vào sổ quyết định, rồi mới sửa BRD và Scope. Việc ghi vào sổ cần bạn cho phép rõ ràng.

**Nguồn:**
- [HMP Law — thuế dịch vụ điện toán đám mây](https://hmplaw.vn/vi/nghia-vu-thue-cua-doanh-nghiep-nuoc-ngoai-doi-voi-dich-vu-dien-toan-dam-may-tai-viet-nam)
- [Luật ACC — SaaS nước ngoài và thuế nhà thầu](https://congtyluatacc.vn/thanh-toan-phan-mem-saas-nuoc-ngoai-co-tinh-thue-nha-thau-khong/)
- [Gonnapass — danh sách nhà cung cấp nước ngoài đã đăng ký thuế](https://gonnapass.com/danh-sach-nha-thau-nuoc-ngoai-dang-ky-thue/)
- [TS24 — Công văn 94769/CT-TTHT](https://vbpl.ts24.com.vn/support/solutions/articles/16000123917-c%C3%B4ng-v%C4%83n-94769-ct-ttht-thu%E1%BA%BF-nh%C3%A0-th%E1%BA%A7u-%C4%91%E1%BB%91i-v%E1%BB%9Bi-d%E1%BB%8Bch-v%E1%BB%A5-%C4%91i%E1%BB%87n-to%C3%A1n-%C4%91%C3%A1m-m%C3%A2y)
- [Luật 48/2024/QH15 (Công báo)](https://datafiles.chinhphu.vn/cpp/files/vbpq/2025/01/luat48.pdf)
- [Thư viện pháp luật — phần mềm và thuế GTGT 2026](https://thuvienphapluat.vn/phap-luat/nam-2026-san-pham-phan-mem-va-dich-vu-phan-mem-co-chiu-thue-gtgt-khong-co-duoc-khau-tru-thue-gtgt-d-270123-260796.html)
- [TACA — bán phần mềm có chịu GTGT không](https://taca.com.vn/ban-phan-mem-co-chiu-thue-gtgt-khong)
- [Kế toán An Pha — tính thuế nhà thầu giá net/gross](https://ketoananpha.vn/cach-tinh-thue-nha-thau-nuoc-ngoai.html)
- [OpenAI — dữ liệu khi gỡ thành viên khỏi workspace](https://help.openai.com/en/articles/8266418)
- [Figma — gỡ người khỏi organization](https://help.figma.com/hc/en-us/articles/360040453453)
- [Canva — quản lý thành viên](https://www.canva.com/help/article/manage-members/)
- [Claude — cách tính hóa đơn gói Team](https://support.claude.com/en/articles/9267289)
- [Claude — dữ liệu khi gỡ thành viên](https://support.claude.com/en/articles/12053672-what-happens-to-a-user-s-data-when-they-are-removed-from-a-team-or-enterprise-organization)