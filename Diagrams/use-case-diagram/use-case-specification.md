# SaaS-Sentry — Đặc tả Use Case (một sơ đồ tổng thể)

> ⚠️ **STALE / NEEDS_UPDATE (ghi 09/10/2026).** Tài liệu v2.0 ngày 25/09/2026 chưa đồng bộ `QĐ-49` → `QĐ-62`: phòng ban thay cây quản lý (`QĐ-52`), hai tính năng AI là phạm vi cam kết (`QĐ-61e` — dòng *ba tính năng AI mở rộng* và UC53 dưới đây đã lỗi thời), **ứng dụng mobile native trong phạm vi** cho bốn tác vụ (`QĐ-61`, thay vế *mobile ngoài phạm vi*), các quy tắc của `QĐ-62`. Bộ sơ đồ hiện hành ở [index](../index.md); việc cập nhật Use Case/User Stories được bàn giao ở [handoff-erd-us-2026-10-09.md](../handoff-erd-us-2026-10-09.md). Nội dung dưới đây giữ làm lịch sử.

**Phiên bản:** 2.0 · **Ngày:** 25/09/2026 · **Trạng thái:** DRAFT — mô hình yêu cầu, **không phải trạng thái hiện thực**\
**Người đọc:** GVHD/mentor, BA, nhóm BE/FE cần thống nhất *ai tương tác với SaaS-Sentry để đạt mục tiêu gì, theo quy tắc nào*.\
**Sơ đồ duy nhất:** [saas-sentry-use-case-diagram.drawio](saas-sentry-use-case-diagram.drawio) · [PNG](saas-sentry-use-case-diagram.drawio.png) — một trang, một boundary.\
**Nguồn nghiệp vụ:** [BRD][brd] (FR, SoD, INV, ADR) · [Scope][scope] · [sổ quyết định][qd] (`QĐ`) · [checkpoint 21/09][dq] (`DQ`) · [User Flows][uf] (F, BR, UF) · [Workflows][wf] (WF) · [User Stories][us] (US, BF, OQ-US) · [Context][ctx].\
**Thay thế:** bộ overview P00 + chín trang chi tiết P01–P09 và ba tài liệu `use-case-catalog.md`, `use-case-drawing-guide.md`, `use-case-traceability.md` (nay chỉ còn trang dẫn hướng về đây). Nguồn chỉnh sửa hình: [`tools/usecase_model.py`](tools/usecase_model.py), [`tools/layouts.json`](tools/layouts.json); truy vết: [`tools/usecase_trace.py`](tools/usecase_trace.py); dựng và kiểm: [`tools/build_use_case_diagrams.py`](tools/build_use_case_diagrams.py), [`tools/build_use_case_spec.py`](tools/build_use_case_spec.py), [`tools/check_use_case_diagrams.py`](tools/check_use_case_diagrams.py).

> **Thay đổi ở 2.0 (25/09/2026, theo phản hồi mới của GVHD):** một sơ đồ tổng thể thay overview + nhiều trang; mô hình lại theo **mục tiêu** — 48 UC MVP cũ còn **37 UC trên hình** (36 user-goal/subfunction + 1 UC trừu tượng) và 5 UC deferred; thêm actor trừu tượng **Governance User**; dùng đủ bốn loại quan hệ UML **khi đúng nghĩa**: 12 actor, 53 association, 6 generalization actor, 3 generalization use case, 2 «include», 2 «extend». Quan hệ `UC08 «include» UC22` cũ được **mô hình lại thành `UC22 «extend» UC08`** vì offboarding người không giữ seat nào vẫn hoàn chỉnh. Owner chốt 34 điểm mở trong phiên này — xem [mục 8](#decisions). Bảng chuyển đổi UC cũ → mới ở [mục 7](#old-to-new).

<a id="edited-view"></a>
## Bản edited để trình bày — cập nhật 29/09/2026

**Áp dụng riêng cho [bản edited](saas-sentry-use-case-diagram-edited.drawio)** *(PNG/SVG của bản này đã được gỡ khỏi thư mục ngày 02/10/2026, commit `4af5d84`; ảnh render kiểm tra lượt 04/10/2026 nằm ở `Reviews/evidence/native-handoff-completion-2026-10-04/`)*. Đây là view tổng quan chọn lọc, không thay thế mô hình nghiệp vụ đầy đủ và chưa được nâng thành canonical. Owner chủ động lược actor, thuật lại góp ý của giáo viên; không suy ra giáo viên đã duyệt mọi chi tiết chỉnh sửa. Bản gốc và generator được giữ nguyên trong lượt này. Các thống kê/actor Governance User trong phần mô hình gốc bên dưới không phải thống kê/actor của edited; không chạy generator gốc lên edited.

Edited (đếm lại từ tệp `.drawio` ngày **04/10/2026** bằng `tools/check_edited_use_case.py`) có **một page, 8 actor, 39 use case, 53 association, 6 actor generalization, 3 use-case generalization, 2 include, 2 extend** — tổng 66 connector *(lượt vẽ bổ sung tám association, 04/10/2026; trước đó 45 association, 58 connector)*. So với bản 01/10/2026 (9 actor, 37 use case, 52 association, 65 connector): **(1) `QĐ-46` bỏ actor A09 Identity Provider** và association A09–UC01; **(2)** thêm **UC59 Manage My Account** (mục tiêu tự phục vụ về tài khoản: kích hoạt, quên/đặt lại/đổi mật khẩu, hồ sơ — oval do Owner vẽ tay 02/10/2026 tên *Manage Profile*, nay có mã) nối A12 System User; **(3)** thêm **UC60 Transfer Super Admin Role** (`US-01-09`) nối A06; **(4)** sửa generalization `GA02` (Manager → System User) từng **không có đích**; **(5)** *(04/10/2026, lượt hoàn tất bàn giao native)* vẽ **tám association** mà lần chỉnh tay 02/10/2026 bỏ sót — nguồn nghiệp vụ từng cặp ở [bảng tám association](#edited-eight-associations). Quyết định của Owner ở (1)–(4), chưa phải xác nhận của GVHD; (5) là đồng bộ hình theo nguồn đã có, không phải quyết định mới.

> **Đối soát 04/10/2026 (thay đoạn *"Chưa đối soát"* của lượt `QĐ-46`).** Lệch của lần chỉnh tay 02/10/2026 được **phân loại**, không sửa về số đếm cho xanh: **lỗi thật đã sửa** — `GA02` dangling; oval *Manage Profile* chưa có mã. **Kỳ vọng lỗi thời của checker đã thay** — số `51 association / 64 connector` (nay suy từ mô hình), *"A12 chỉ nối UC01"* (nay UC01 và UC59), *"không giữ oval Profile"* (hồ sơ nay thuộc UC59 vì `US-01-10` đưa tự phục vụ vào phạm vi), và so sánh với kho kiểm kê 29/09 (nay chỉ cung cấp thông tin, không chặn). **Giữ kiểm tra nghiệp vụ/quyền:** actor chọn lọc, không A09, UC56 chỉ nối vai quản trị, UC60 chỉ nối A06, Finance không nối UC quyết chi, Super Admin không nối UC nghiệp vụ, generalization/include/extend đúng đầu mút. **Tám association còn thiếu so với đặc tả** (A03–UC07, A02–UC11, A03/A04/A06–UC29, A02/A03/A06–UC56) — *(cập nhật 04/10/2026)* đối chiếu từng cặp với nguồn nghiệp vụ: cả tám **bắt buộc**, nên **đã vẽ** bằng định tuyến/giãn cách cục bộ (không dựng lại bố cục); `KNOWN_OMISSIONS` của checker nay **rỗng** — xem [bảng tám association](#edited-eight-associations). Các hàng *Vai trò và quyền* dưới đây mô tả **ý nghĩa nghiệp vụ**, không đồng nghĩa mọi đường đều được vẽ trên view.

### Vai trò và quyền trong view

| Actor | Tương tác và giới hạn |
| --- | --- |
| Employee (A01) | UC11 yêu cầu quyền, UC13 trả lại quyền, UC27 xác nhận thông báo theo dõi thiết bị, UC44 xem dữ liệu cá nhân/yêu cầu đính chính, UC48 nhận thông báo theo dõi. Không có quyền xem toàn bộ báo cáo |
| Manager (A02) | Duyệt nhu cầu, quản lý direct-report; UC11 yêu cầu hộ nhân viên mới theo US-03-02, không tự duyệt yêu cầu mình tạo: chuyển cấp trên theo SoD-4. UC56 chỉ dữ liệu thuộc phạm vi quản lý |
| IT Admin (A03) | UC07 quản lý hồ sơ nhân sự, UC21 thực hiện cấp phát; UC29 tiếp nhận/xử lý cảnh báo gia hạn; UC47 xác minh và xử lý yêu cầu dữ liệu; các mục tiêu vận hành trên hình. UC28 có IT tham gia kiểm tra/trả lại tối đa một lần theo điều kiện đã chốt, Manager quyết cuối; association không đồng nghĩa cùng quyền |
| Finance (A04) | Ngân sách, commitment, hóa đơn, tỷ giá, Cost Center và khai báo/sửa phân bổ UC33; không quyết chi |
| Spending Approver (A05) | Quyết định chi theo phân quyền, không đồng nhất Finance; xem báo cáo trong phạm vi được cấp |
| Super Admin (A06) | Quản trị hệ thống, policy/audit/job; **UC60** chuyển giao vai Super Admin cho người kế nhiệm đủ điều kiện (`US-01-09`) — khôi phục khi người giữ vai không dùng được là thủ tục **ngoài ứng dụng** của người vận hành, không phải UC (chế độ `REASSIGN` giai đoạn 1 được tạo tài khoản **chưa kích hoạt, không vai** cho người nhận khi không còn Super Admin dùng được — ngoại lệ Owner duyệt `QĐ-47f` của `QĐ-46a(3)`); không được suy quyền quyết chi từ cấp quản trị |
| SaaS Provider (A08) | API/seat/usage và kết quả thực thi khi connector hỗ trợ; không cam kết tự động hóa mọi vendor. Phương án manual/import vẫn có |
| System User (A12) | Vai người dùng chung, chỉ nối trực tiếp **UC01 Sign In** và **UC59 Manage My Account**. Sáu vai người dùng chuyên biệt kế thừa hành vi đăng nhập và tự phục vụ tài khoản; không kế thừa quyền quản trị/báo cáo/quyết chi |

**Đăng nhập (`QĐ-46`, 04/10/2026):** hệ thống tự xác thực người dùng bằng email đăng nhập và mật khẩu do chính SaaS-Sentry quản lý; **không còn actor Identity Provider** trên hình và không còn dịch vụ định danh bên ngoài tham gia đăng nhập. Mã `A09` đã gỡ, không dùng lại. IdP **làm nguồn dữ liệu discovery** (`F-32`, `FR-6.3(b)`, `US-13-02`) chưa bao giờ là actor của mô hình này và **không đổi** — vẫn deferred theo `QĐ-31a`.

Người giữ vai Manager/IT/Finance/Spending Approver/Super Admin **sử dụng vai Employee khi tự phục vụ**. Đây là một người đảm nhiệm nhiều vai trong tương tác, không phải thêm generalization theo chức danh và không cấp quyền Employee xem dữ liệu người khác. UC44 không cho tự sửa email, role, manager hoặc usage; yêu cầu được IT xử lý qua UC47, có xác minh, lý do/kết quả và audit theo BR-40.4–8. Không giữ ba oval Profile vì chưa có mục tiêu tự sửa độc lập được chốt.

UC56 nối trực tiếp A02/A03/A04/A05/A06, không nối A01/A12. Phạm vi theo BRD §5.5.3:

| Vai | Dữ liệu báo cáo UC56 |
| --- | --- |
| Manager | Chi phí thực tế và commitment đang giữ của cây nhân sự; usage tổng hợp và tiến độ yêu cầu thuộc phạm vi; không ngân sách còn lại/tổng công ty, savings hay quality |
| IT Admin | Savings, usage, quy trình và quality trừ KPI-5; không tổng chi phí công ty |
| Finance | Chi phí/commitment và savings; không tự có quyền usage, process hoặc quality |
| Spending Approver | Chi phí, savings, usage và process tổng hợp; không quality |
| Super Admin | Process và quality gồm KPI-5; không suy quyền xem tài chính/usage |

### Truy vết và các mô tả cần đọc theo baseline mới

Mọi UC trên edited giữ mã để tra **[mục 4](#uc-specs)** và **[bảng FR/US/BR mục 6](#traceability)**; các đường actor và giới hạn riêng của view đọc theo phần này. [Evidence truy vết toàn bộ edited](../../Reviews/evidence/use-case-edited-remediation-2026-09-29/after-check.json) ghi UC → association trực tiếp → FR/US/BR/WF từ trace hiện hành. Nó là kiểm tra tham chiếu, không chứng minh toàn bộ AC đã implement.

| UC | Áp dụng trong edited / nguồn |
| --- | --- |
<a id="edited-eight-associations"></a>
**Tám association bổ sung (04/10/2026).** Trên view này mọi vai (GA01–GA06) chỉ generalize về **A12 System User**, và A12 chỉ nối UC01, UC59 — kế thừa actor **không** phủ cặp nào dưới đây, nên association phải vẽ trực tiếp. Không cặp nào là lược trình bày; không đổi quyền: association chỉ là tham gia, không trao quyền quyết.

| Cặp | Kết luận | Nguồn nghiệp vụ | Xử lý trên hình |
| --- | --- | --- | --- |
| A03–UC07 | Bắt buộc | `US-03-01`, `US-03-03` (*Persona: IT Admin* — đổi quản lý/Cost Center, nghỉ dài), `FR-2.1`/`FR-2.2`; `QĐ-47` (IT nhập tay/import nhân viên) | Đổi chỗ oval UC07 ↔ UC14 trong cụm Manager (UC07 dịch trái 28 px) để IT Admin nối thẳng, đi ngoài UC42 |
| A02–UC11 | Bắt buộc | `US-03-02` (*Manager tạo yêu cầu hộ cho nhân viên mới*; không tự duyệt — `BR-02.2`, `SoD-4`) | Đường thẳng tới mép trái UC11 |
| A03–UC29 | Bắt buộc | BRD `FR-1.4` (mốc 15 ngày báo IT Admin, Finance, Business Owner, Người duyệt chi — `OI-09a`) | Qua khe UC48/UC09 (UC09 dịch phải 50 px, UC48 dịch trái 30 px), một điểm gấp |
| A04–UC29 | Bắt buộc | BRD `FR-1.4` (Finance nhận mốc 15 ngày) | Một điểm gấp dưới UC56, vào đáy UC29 |
| A06–UC29 | Bắt buộc *(tham gia: nhận cảnh báo; không quyết gia hạn — `SoD-1`, `FR-8.5`)* | BRD `FR-1.4` (*mốc 7 ngày báo thêm Super Admin*) | Một điểm gấp ngoài boundary, phải UC05 |
| A02–UC56 | Bắt buộc *(chỉ dữ liệu cây cấp dưới)* | BRD 5.5.3 bảng *Ai xem báo cáo nào* (Manager: thực chi + cam kết đang giữ, hiệu suất sử dụng, request của cấp dưới — `OI-08b`, `SoD-2`); `FR-5.10`, `FR-5.11` | Đi dưới UC08, lên theo trục dọc giữa UC08/UC22 và UC21 (nhãn «extend» của EX05 dời về phía UC08) |
| A03–UC56 | Bắt buộc | BRD 5.5.3 (IT Admin: tiết kiệm, hiệu suất sử dụng, quy trình, chất lượng trừ KPI-5); `FR-5.9`→`FR-5.12` | Song song với A03–UC29 qua cùng khe (cách 27 px), một điểm gấp |
| A06–UC56 | Bắt buộc *(chỉ quy trình và chất lượng)* | BRD 5.5.3 (Super Admin: hiệu suất quy trình, chất lượng gồm KPI-5); `FR-0.3`, `FR-5.11`, `FR-5.12` | Qua khe UC02/UC04 (UC04 dịch xuống 20 px, UC60 xuống 8 px), một điểm gấp |

Kiểm: `check_edited_use_case.py` — `associations_match_model_except_known_omissions` đúng với tập kỳ vọng (`KNOWN_OMISSIONS` rỗng) và kiểm mới `associations_do_not_cross_other_ovals` (không association nào cắt oval khác). Đường dây cũ khác **không** đổi đích; chỉ `AS-A03-UC06` đổi điểm vào (góc dưới trái UC06) để tách khỏi đường tới UC09 đã dịch, và hai đường của Manager tới UC07/UC14 đổi kiểu điểm ra theo chỗ mới.

| UC07 | IT tham gia ngoài Manager; FR-2.1/2.2/2.8, US-03-01/03/05, WF-04/05/06/08; xem các BR-03/04/05 trong trace |
| UC11 | Employee tự yêu cầu; Manager yêu cầu hộ theo US-03-02; không tự duyệt theo SoD-4 |
| UC29 | IT nhận/xử lý cảnh báo, không bỏ trách nhiệm Business Owner vì actor không vẽ; WF-15 và catalog UC29 |
| UC44 / UC47 | Tách xem/yêu cầu dữ liệu cá nhân với xác minh/xử lý/trả kết quả của IT; US-09-04, US-14-02/06, BR-40.4–8, catalog UC44/47. Không biến đề nghị đính chính thành tự sửa dữ liệu nhạy cảm |
| UC56 | Một mục tiêu Review Governance Reports, phân quyền BRD §5.5.3 và trace UC56; không thêm oval cho từng KPI |
| UC59 | *(04/10/2026)* Tự phục vụ về tài khoản của chính mình: kích hoạt bằng lời mời, quên/đặt lại/đổi mật khẩu, xem hồ sơ và sửa ngôn ngữ; `FR-8.6`, `FR-8.11`, `US-01-10`, `UF-17`. Không phải một UC cho mỗi endpoint |
| UC60 | *(04/10/2026)* Chuyển giao vai Super Admin trong ứng dụng; `FR-8.10`, `US-01-09`, `QĐ-44c`. Tách khỏi UC02 vì là thao tác **duy nhất** đổi người giữ vai |
| UC24 / UC26 | QĐ-31b/32c: MF-3 gồm extension, Agent phiên người dùng và OTel theo demo đã chốt. Agent không phải service/installer/updater doanh nghiệp. OTel là positive evidence; Gap/thiếu coverage không chứng minh không hoạt động. Dedup trước tổng hợp; usage theo quy tắc max/sum, coverage không cộng chồng. FR-4.19/4.20, US-08-08; không khẳng định đã test chỉ từ diagram |
| UC42 | QĐ-31a: MF-6 hiện thực CSV; discovery qua IdP/browser deferred. QĐ-32a/b, US-15-01: rule trước, AI gợi ý vendor cho dòng chưa giải quyết, IT xác nhận; chỉ hiển thị sau quality gate. Demo hosted dùng synthetic data; production còn điều kiện riêng. Không AI tự chuẩn hóa/quyết định/thu hồi |

Baseline hiện hành: **42 F trong phạm vi, 4 design-only (F-16/F-24/F-32/F-46), 2 ngoài phạm vi (F-25/F-33)**. Forecast L2 hoãn, không đồng nghĩa bỏ L1/L3. Agent phiên người dùng và AI vendor suggestion ở trên thuộc phạm vi; AI Gateway, US-15-02–04 deferred. Các câu extension-only/agent-deferred hoặc số 43/3/2 trong mô tả cũ bên dưới không được dùng để phủ định QĐ-31/32; phần này là đính chính cho edited, không tuyên bố đã đồng bộ hình gốc/generated model. Nguồn: [quyết định][qd], [BRD][brd], [Scope][scope], [User Stories][us], [User Flows/BR][uf].

### Actor/tương tác chủ động lược khỏi canvas

| Actor không vẽ | Trách nhiệm/tương tác vẫn giữ và nơi đọc đầy đủ |
| --- | --- |
| Business Owner | Nhận cảnh báo UC29; ý kiến được IT ghi nhận, không biến thành người quyết chi hay điều kiện chặn. Catalog actor/UC29 và WF-15 |
| Email Service Provider | Kênh email cho UC29/UC48 theo điều kiện đã chốt; thông báo trong ứng dụng vẫn có. Catalog và quyết định OI-EMAIL/OI-09b |
| Exchange Rate Service | US-04-05 vẫn có nguồn tỷ giá công khai và manual fallback; lưu tỷ giá/ngày theo baseline. Bỏ actor khỏi view **không đổi thành manual-only**; catalog UC10 |
| AI Client | Tương tác bên ngoài phát sinh tín hiệu OTel theo QĐ-31b, US-08-08; không chuyển thành module nội bộ để giấu boundary |
| AI Model Provider | Dịch vụ gợi ý vendor bên ngoài theo QĐ-32a/b, US-15-01; người xác nhận là IT. Không thêm actor lên canvas chọn lọc. *(30/09)* Tương tác lược: **A13 ↔ UC42** — chỉ khi dùng nhà cung cấp hosted; gợi ý **chưa hiện** vì chưa cấu hình nào qua cổng chất lượng |

**Use case mô hình đầy đủ không vẽ trên view này** *(30/09/2026 — `QĐ-33`, Owner chọn H2/H3; tiếp nhận `HANDOFF`)*:

| UC không vẽ | Tương tác lược | Nơi đọc |
| --- | --- | --- |
| [UC57](#uc57) Đối soát khoản chi phần mềm | **Finance ↔ UC57** (chính) · **IT Admin ↔ UC57** (hỗ trợ) | UC57, `US-13-07`, `WF-17` `rx1`, `UF-12` `FIN-07` |
| [UC58](#uc58) Quyết định khoản chi chưa có căn cứ | **Spending Approver ↔ UC58** qua UC55 (chuyên biệt hóa); **không** Finance/IT | UC58, `WF-17` `rd1`, `UF-12` `APV-01`→`APV-02` |

Lý do không vẽ: view chọn lọc giữ 39 UC; Owner giữ nguyên bố cục và bản gốc. Hai UC này **có** trong mô hình đầy đủ và trong truy vết; không suy ra tính năng đối soát bị bỏ.

Extension/Agent/connector do nhóm xây là thành phần của SaaS-Sentry trong boundary này, không tự thêm actor cho mỗi công nghệ. Bảng lược không có nghĩa mọi tích hợp đã chạy hay mọi provider production đã được chọn.

### Đọc hình và thuyết trình

Đọc actor → mục tiêu oval → phạm vi quyền ở bảng trên; dùng workflow để giải thích thứ tự, nhánh lỗi và SLA. Association chỉ nói tham gia, không trao cùng quyền cho mọi actor nối chung oval. Include là hành vi bắt buộc dùng lại trong ngữ cảnh; extend là bổ sung có điều kiện (hỏi Finance, reclaim khi offboarding còn seat); ba use-case generalization chuyên biệt hóa quyết chi. Không vẽ duyệt → thực thi thành include.

Giữ một diagram. **Bản fit toàn hình không phù hợp để đọc từng nhãn trên slide 16:9**; dùng SVG và zoom từng vùng hoặc bốn crop từ cùng diagram trong evidence của lượt sửa. Crop không phải sơ đồ nghiệp vụ mới; tăng DPI không làm chữ lớn hơn ở cùng kích thước trình chiếu. Không thêm legend dài lên canvas.

Câu trả lời gợi ý: “Em chọn các vai/mục tiêu chính cho view trình bày; các tương tác email, tỷ giá, Business Owner và AI vẫn được mô tả trong đặc tả. Việc lược actor không đổi baseline hay chứng minh tích hợp đã hoàn thành. Quyền chi, dữ liệu cá nhân và báo cáo vẫn phân biệt theo vai.”

## Mục lục

1. [Phạm vi, system boundary và quy ước](#scope)
2. [Actor catalog](#actors)
3. [Danh mục use case, độ phủ năng lực và quan hệ UML](#use-cases)
4. [Đặc tả từng use case](#uc-specs)
5. [Business Rules](#business-rules)
6. [Truy vết UC ↔ US ↔ FR ↔ BR ↔ actor ↔ luồng](#traceability)
7. [Chuyển đổi UC cũ → mới](#old-to-new)
8. [Quyết định và câu hỏi còn mở](#decisions)
9. [Hướng dẫn đọc sơ đồ và script thuyết trình](#reading-guide)

<a id="scope"></a>
## 1. Phạm vi, system boundary và quy ước

### 1.1. System boundary

**SaaS-Sentry** — hệ thống quản trị SaaS nội bộ cho **một doanh nghiệp trên một instance** (`ADR-01`): ứng dụng web, backend, dữ liệu, job/rule nền và **tiện ích trình duyệt** do dự án xây dựng đều nằm **trong** boundary (`ADR-13`). Nhà cung cấp SaaS, dịch vụ gửi thư và nguồn tỷ giá nằm **ngoài**; đăng nhập do chính hệ thống thực hiện (`QĐ-46`, từ 04/10/2026 không còn nhà cung cấp định danh làm actor). Hệ thống nhân sự, ngân hàng/kế toán chỉ tạo file mà IT/Finance tải lên nên **không** là actor.

Mô hình phủ **toàn bộ phạm vi MVP hiện hành** (Scope mục 5.2: 48 luồng F = 43 hiện thực / 3 chỉ thiết kế / 2 ngoài phạm vi). Không oval nào có nghĩa *đã được code*.

| Phạm vi | Cách thể hiện |
| --- | --- |
| MVP hiện thực | 39 UC trên sơ đồ ([mục 3.1](#uc-list); 37 tới 03/10/2026, +UC59, +UC60) · *(30/09/2026 — `QĐ-33`)* **+ 2 UC mô hình đầy đủ chưa vẽ**: [UC57](#uc57), [UC58](#uc58) ⟹ **39 mục tiêu trong mô hình đầy đủ**. Các bảng sinh tự động (mục 3.1, 3.3, 6, 7) phản ánh **sơ đồ gốc** mà Owner giữ nguyên nên chưa có hai UC này — truy vết của chúng ở chính mục 4.4 và 4.8 |
| Chỉ thiết kế / hoãn — đổi gói (`F-16`), rà soát quyền định kỳ (`F-24`), dự báo L2 (`FR-5.7`), **ba tính năng AI mở rộng** của BRD 6.4 *(tra cứu hợp đồng, diễn giải chi phí, tóm tắt cho Manager — UC53)* | UC49–UC53, chỉ ở [mục 4.4](#deferred); **không** vẽ. *(29/09/2026 — `QĐ-31b`: agent desktop `F-48` lên hiện thực mức demo, đi trong [UC26](#uc26) như tiện ích; `QĐ-32a`: gợi ý nhà cung cấp bằng AI là **một bước** trong [UC42](#uc42), không phải UC riêng)* |
| Ngoài phạm vi — G5 (`F-25`), log web/proxy/CASB đầy đủ (`F-33`, `FR-6.10`), ủy quyền duyệt (`QĐ-27`), AI tự quyết, rule tự thu hồi/tự chặn (`SoD-6`), multi-tenant, thanh toán trong hệ thống, mobile, tích hợp HRM/ngân hàng | Không có oval, không có actor |

### 1.2. Quy ước mã và khái niệm

| Mã / khái niệm | Nghĩa trong tài liệu này — không dùng thay nhau |
| --- | --- |
| **UC** — Use Case | Mục tiêu có kết quả quan sát được mà actor đạt được với SaaS-Sentry. Mã `UCxx` là mã của mô hình này; mã cũ giữ nguyên khi nghĩa giữ nguyên ([mục 7](#old-to-new)) |
| **US** — User Story | Story trong [User Stories][us] (`US-xx-yy`), có acceptance criteria. Một UC gom nhiều US |
| **UR** — User Requirement | Nhu cầu của người dùng phát biểu bằng lời. **Dự án không có hệ mã UR riêng**; UR được diễn đạt ở cột *Nhu cầu người dùng* của [bảng năng lực](#capabilities), ở *Mục tiêu* của từng UC và bằng câu "Là…, tôi muốn…, để…" của US. Không tự tạo mã UR |
| **FR** — Functional Requirement | Yêu cầu chức năng trong [BRD][brd] (`FR-x.y`); BRD sở hữu |
| **BR** — Business Rule | Quy tắc nghiệp vụ `BR-ff.n` do [User Flows][uf] sở hữu (ff = số luồng `F-ff`), cùng `SoD-n` và `INV-nn` của BRD. BR mới của phiên này được thêm **vào User Flows** trước, rồi mới dẫn ở đây ([mục 5](#business-rules)) |
| **F / WF / UF** | Luồng nghiệp vụ (User Flows) / workflow activity / user flow màn hình |
| **P-AUTH** | Precondition chung: phiên hợp lệ (qua [UC01](#uc01)), AppUser hoạt động, đúng vai/phạm vi và SoD **tại thời điểm thao tác**. Không vẽ «include» Sign In |
| **Kết quả** | Từ chối hợp lệ là **kết quả thành công** của UC quyết định; lỗi quyền/dữ liệu/hạ tầng là thất bại. Gửi yêu cầu thành công ≠ đã cấp quyền |
| **Trạng thái** | `MVP` — trong phạm vi; `MVP — OWNER DECISION 25/09/2026` — quy tắc do Owner chốt trong phiên này, **không** phải xác nhận của mentor/GVHD; `DEFERRED` — chỉ thiết kế |

### 1.3. Ký pháp (OMG UML 2.5.1, formal/2017-12-05)

Đối chiếu [đặc tả PDF chính thức](https://www.omg.org/spec/UML/2.5.1/PDF), tải và đọc lại ngày 25/09/2026. Số trang là trang in của tài liệu.

| Phần tử | Ký pháp trên sơ đồ | Căn cứ |
| --- | --- | --- |
| Boundary | Hình chữ nhật, tên **SaaS-Sentry** ở góc trên-trái | §18.1.4, tr. 641 |
| Use case | Oval, nhãn `UCxx` + tên; UC trừu tượng tên **in nghiêng** (UC55) | §18.1.4, tr. 641; §9.2.4.1, tr. 101 |
| Extension point | Ngăn `extension points` trong oval của UC được mở rộng | §18.1.4, tr. 642 |
| Actor | Hình người que cho mọi actor; hệ thống ngoài ghi thêm từ khóa `«system»` phía trên tên; actor trừu tượng tên in nghiêng | §18.1.4, tr. 642 (stick-man; có thể dùng biểu tượng khác cho actor không phải người) |
| Association | Đường liền, không mũi tên: actor **tham gia** mục tiêu — **không** tự đồng nghĩa quyền quyết | §18.1.3.1, tr. 639–640 |
| «include» | Nét đứt, mũi tên mở từ UC bao gồm tới UC được bao gồm | §18.1.3.3 tr. 641; §18.1.4 tr. 642 |
| «extend» | Nét đứt, mũi tên mở từ UC mở rộng tới UC được mở rộng; điều kiện ghi trong đặc tả (note điều kiện là tùy chọn) | §18.1.3.2 tr. 640–641; §18.1.4 tr. 642; ràng buộc §18.2.2.5 tr. 648 |
| Generalization | Đường liền, tam giác rỗng ở đầu tổng quát; các nhánh tới cùng một actor cha gộp theo *shared target style* và chạy **ngoài** boundary | §9.2.3.2 tr. 100; §9.2.4.2 tr. 102 |

<a id="actors"></a>
## 2. Actor catalog

12 actor: 7 vai người (1 trừu tượng), 1 vai trách nhiệm theo ứng dụng, 4 hệ thống ngoài *(v2.x, 29/09/2026: thêm A13 AI Model Provider — `QĐ-32b`; 04/10/2026: gỡ A09 Identity Provider — `QĐ-46a`, trước đó 13 actor và 5 hệ thống ngoài)*. Một người thật có thể đóng nhiều actor (§18.1.3.1: một thực thể có thể đóng nhiều vai). Actor **không** phải bảng dữ liệu: `Employee` (hồ sơ nhân sự) ≠ `AppUser` (tài khoản) ≠ actor *Employee* (vai nhân viên dùng hệ thống).

| ID | Tên Anh / Việt | Loại | Actor cha | Mục tiêu | Trách nhiệm — được làm / không được làm | UC tham gia (chính · hỗ trợ · kế thừa) | Nguồn |
| --- | --- | --- | --- | --- | --- | --- | --- |
| <a id="a01"></a>**A01** | Employee / Nhân viên | Người | — (actor gốc) | Có đúng công cụ để làm việc; biết và kiểm soát dữ liệu hệ thống lưu về mình | Được: tự yêu cầu/rút/hoàn trả quyền **của mình**, xem/xuất/yêu cầu chỉnh sửa dữ liệu **của mình**, xác nhận hoặc xin dừng theo dõi thiết bị **của mình**. Không: duyệt, cấp/thu hồi, xem dữ liệu đồng nghiệp (`BR-40.1`, `SoD-4`) | Chính: [UC01](#uc01), [UC11](#uc11), [UC13](#uc13), [UC27](#uc27), [UC44](#uc44), [UC59](#uc59) · hỗ trợ: [UC48](#uc48) (nhận thông báo) | BRD 4.1, 4.3; `FR-3.2`, `FR-4.18`, `FR-10.1`–`FR-10.7` |
| <a id="a12"></a>**A12** | *Governance User* / Người dùng có vai quản trị | Người, **trừu tượng** | A01 | Theo dõi kết quả quản trị trong phạm vi vai của mình | Là Employee đang giữ ít nhất một vai quản trị. Được: xem báo cáo **theo ma trận quyền** ([UC56](#uc56), BRD 5.5.3, `BR-29.8`). Không có thể hiện trực tiếp: mọi thể hiện là một trong A02–A06 (§9.2.3.2) | Chính: [UC56](#uc56) · kế thừa UC của A01 | BRD 4.1, 4.3, 5.5.3; `QĐ-24` |
| <a id="a02"></a>**A02** | Manager / Quản lý trực tiếp | Người — vai **phái sinh** từ cây quản lý | A12 | Quyết nhu cầu của cấp dưới; giữ/thu hồi/miễn trừ license có bằng chứng | Được: xác nhận nhu cầu (`FR-3.3`), quyết cuối Keep/Reclaim/Exempt (OI-02), tạo yêu cầu **hộ** nhân viên mới và gia hạn cho nhà thầu trực thuộc ([UC11](#uc11); `FR-3.2`, `US-03-05`), cung cấp bối cảnh nhân sự/nghỉ việc/Shadow IT, xem báo cáo **cây cấp dưới** (`BR-29.8`). Không: cấp/thu hồi, xem hợp đồng, tài chính toàn công ty, log thô (`SoD-2`); duyệt yêu cầu của chính mình (`SoD-4`). Approver dự phòng ở gốc duyệt **với tư cách Manager** (`QĐ-02`) | Chính: [UC14](#uc14), [UC28](#uc28) · hỗ trợ: [UC07](#uc07), [UC08](#uc08), [UC42](#uc42) · kế thừa: UC56 và UC của A01 | BRD 4.1–4.3; `FR-3.3`, `FR-3.7`, `FR-3.10` |
| <a id="a03"></a>**A03** | IT Admin / Quản trị viên CNTT | Người | A12 | Danh mục, dữ liệu và license đúng thực tế; thực thi đúng quyết định | Được: vận hành danh mục/hợp đồng/nhân sự/bằng chứng/thiết bị, import, đánh giá SaaS mới, **thực thi** cấp/thu hồi sau khi đủ quyết định (`SoD-5`), điều tra Shadow IT, xử lý yêu cầu quyền dữ liệu (OI-01). Không: quyết chi, quyết hợp thức hóa (`DQ-06`), quyết thay Manager ở review license (OI-02) | Chính: [UC06](#uc06), [UC07](#uc07), [UC08](#uc08), [UC09](#uc09), [UC10](#uc10), [UC15](#uc15), [UC21](#uc21), [UC22](#uc22), [UC23](#uc23), [UC24](#uc24), [UC26](#uc26), [UC28](#uc28), [UC29](#uc29), [UC42](#uc42), [UC47](#uc47), [UC48](#uc48), [UC54](#uc54) · kế thừa: UC56 (trừ KPI-5) và UC của A01 | BRD 4.1; `FR-1.x`, `FR-2.x`, `FR-4.x`, `FR-6.x`, `FR-10.5`; `SoD-5` |
| <a id="a04"></a>**A04** | Finance / Tài chính–Kế toán | Người | A12 | Kiểm soát ngân sách và chi phí thực, không nằm trên đường duyệt | Được: lập ngân sách, trả lời hỏi ngân sách, ghi nhận khoản cam kết sau duyệt, đối soát hóa đơn, quản lý Cost Center và phân bổ (OI-03, OI-04), dự báo, import chứng từ, nhận cảnh báo gia hạn. Không: quyết/chặn chi, thao tác kỹ thuật (`SoD-3`); trả lời/ghi nhận cho Request mà mình là người quyết (`SoD-8`) | Chính: [UC20](#uc20), [UC29](#uc29), [UC32](#uc32), [UC33](#uc33), [UC36](#uc36), [UC54](#uc54) · kế thừa: UC56 (tổng chi + cam kết, tiết kiệm) và UC của A01 | BRD 4.1; `FR-3.14`, `FR-5.x`; `QĐ-29b` |
| <a id="a05"></a>**A05** | Spending Approver / Người duyệt chi | Người — gán tay, mặc định CEO | A12 | Quyết mọi thay đổi tiền hoặc danh mục SaaS của công ty | Được: quyết khoản chi/SaaS mới, gia hạn/giảm/hủy, hợp thức hóa Shadow IT ([UC55](#uc55) và ba UC con), hỏi Finance tùy chọn ([UC17](#uc17)), mở tệp gốc **của hồ sơ đang quyết** (OI-08a), nhận cảnh báo gia hạn từ T−15 (OI-09a). Không: cấp/thu hồi (`SoD-7`), duyệt Request mình yêu cầu/thụ hưởng — khi đó người thay thế cấu hình trước đảm nhận (`FR-3.15`) | Chính: [UC55](#uc55) (kế thừa xuống [UC16](#uc16), [UC30](#uc30), [UC43](#uc43)), [UC29](#uc29) · kế thừa: UC56 và UC của A01 | `FR-3.4`, `FR-3.4c-1`, `FR-3.13`–`FR-3.15`; `DQ-06`; `SoD-7` |
| <a id="a06"></a>**A06** | Super Admin / Quản trị hệ thống | Người | A12 | Hệ thống cấu hình đúng, giải trình được, vận hành ổn định | Được: tài khoản/vai, chính sách, người giữ vai duyệt, tham số, audit, job; nhận cảnh báo gia hạn ở T−7. Không: gán/thu hồi seat, duyệt nghiệp vụ, quyết thay khi nghẽn (`SoD-1`, `FR-8.5`) | Chính: [UC02](#uc02), [UC03](#uc03), [UC04](#uc04), [UC05](#uc05) · hỗ trợ: [UC29](#uc29) · kế thừa: UC56 (quy trình, chất lượng gồm KPI-5) và UC của A01 | `FR-8.1`–`FR-8.5`, `FR-0.3`; `SoD-1` |
| <a id="a07"></a>**A07** | Business Owner / Người sở hữu nghiệp vụ ứng dụng | Người — **trách nhiệm gắn với ứng dụng**, không phải vai đăng nhập | — | Không bị bất ngờ bởi hạn báo hủy của ứng dụng mình phụ trách | Nhận cảnh báo hạn báo hủy (qua email khi kênh được cấu hình). Ý kiến nghiệp vụ (SaaS mới trùng chức năng, Shadow IT, ngừng sử dụng) được **IT ghi nhận** trong [UC15](#uc15)/[UC42](#uc42)/[UC09](#uc09) (OI-05a/b) — Business Owner không có thao tác trên hệ thống. Không cấp/thu hồi, không duyệt (BRD 4.4) | Hỗ trợ: [UC29](#uc29) | BRD 4.4; `FR-1.4`, `FR-1.7` |
| <a id="a08"></a>**A08** | SaaS Provider / Nhà cung cấp SaaS | Hệ thống ngoài | — | — (cung cấp dịch vụ) | Nhận lệnh cấp/thu hồi và trả kết quả; cung cấp danh sách thành viên và dữ liệu hoạt động **qua connector được hỗ trợ** (MVP: GitHub thật, còn lại file/thủ công). Không quyết nghiệp vụ; tải file thủ công không nối actor này | Hỗ trợ: [UC21](#uc21), [UC22](#uc22), [UC23](#uc23), [UC24](#uc24) | `FR-2.5`, `FR-2.6`, `FR-4.1`; BRD 6.3; `QĐ-03`, `QĐ-28a` |
| <a id="a09"></a>**A09** | ~~Identity Provider / Nhà cung cấp định danh~~ — **đã gỡ 04/10/2026** | *(không còn)* | — | — | Không còn actor: hệ thống tự xác thực email + mật khẩu do mình quản lý, mọi tài khoản do Super Admin tạo từ Employee và người dùng tự đặt mật khẩu qua lời mời dùng một lần (`QĐ-46a`) — ngoại lệ duy nhất: lệnh khôi phục `REASSIGN` ngoài ứng dụng tạo tài khoản chưa kích hoạt, không vai cho người nhận khi không còn Super Admin dùng được (`QĐ-47f`). Anchor giữ để link cũ không gãy; mã `A09` không dùng lại | Trước đó hỗ trợ [UC01](#uc01) | `QĐ-46a`; ADR BE 0010 (Accepted — quyết định của Owner, chưa implement) thay phần OIDC của ADR BE 0002/0004 |
| <a id="a10"></a>**A10** | Email Service Provider / Dịch vụ gửi thư | Hệ thống ngoài | — | — | Chuyển thư **chỉ** cho cảnh báo hạn báo hủy và thông báo trước khi theo dõi, khi kênh email được cấu hình (OI-EMAIL, OI-09b). Lỗi gửi ≠ đã thông báo (`BR-42.7`). *Ngoại lệ `QĐ-46` (BRD `FR-3.11`): thư vòng đời tài khoản (lời mời, liên kết đặt lại, thông báo đã đổi mật khẩu) là cơ chế bảo mật của [UC59](#uc59)/[UC02](#uc02); mô hình chưa thêm association A10 cho các UC này — việc theo dõi ở mục 8.4* | Hỗ trợ: [UC29](#uc29), [UC48](#uc48) | `FR-1.4`, `FR-10.4`; Context MAIL-1 |
| <a id="a11"></a>**A11** | Exchange Rate Service / Dịch vụ tỷ giá | Hệ thống ngoài — có đường lui | — | — | Cung cấp tỷ giá tại ngày ghi nhận; không lấy được thì người nhập dữ liệu nhập tay có nguồn (`GĐ-8`). Không quyết nghiệp vụ | Hỗ trợ: [UC10](#uc10), [UC20](#uc20), [UC32](#uc32) | `FR-1.6`, `FR-5.6`; BRD `ADR-03` |
| <a id="a13"></a>**A13** | AI Model Provider / Nhà cung cấp mô hình AI | Hệ thống ngoài — **chỉ khi** cấu hình nhà cung cấp hosted *(demo: free tier, chỉ dữ liệu tổng hợp — `QĐ-32b`)* | — | — | Nhận mô tả giao dịch **đã che** thông tin cá nhân và từ điển nhà cung cấp; trả **gợi ý** tin cậy Thấp. **Không** quyết, **không** chuẩn hóa, **không** thấy số tiền/chủ thẻ/nhân viên. Model chạy tại chỗ trong triển khai thì **không** là actor | Hỗ trợ [UC42](#uc42) | `QĐ-32a`, `QĐ-32b`, BRD 6.4, `FR-6.5` |

**Không vẽ thành actor:** SaaS-Sentry, Automation Service/Scheduler/Rule Engine (thành phần nội bộ — hành vi nền được mô tả trong luồng của UC liên quan), Database, tiện ích trình duyệt (trong boundary, `ADR-13`), agent desktop (deferred, trong boundary), AI module (deferred), AppUser/Cost Center/seat (dữ liệu), hệ thống nhân sự và ngân hàng (chỉ tạo file do IT/Finance tải lên), Ban giám đốc/kiểm toán (không có tài khoản; người giữ vai duyệt chi đã là A05). Người duyệt thay thế khi xung đột vẫn là **A05** (`QĐ-28c`); approver dự phòng ở gốc vẫn là **A02** (`QĐ-02`); không có ủy quyền (`QĐ-27`).

<a id="actor-generalization"></a>
### 2.1. Đánh giá generalization của actor

*Đánh giá lại theo yêu cầu mới, không mặc định giữ kết luận cũ "không cần".*

| Ứng viên | Hành vi/association chung thật sự | Actor con kế thừa gì | Có vô tình trao thêm quyền? | Kết luận |
| --- | --- | --- | --- | --- |
| Manager, IT Admin, Finance, Spending Approver, Super Admin → **Employee** (qua A12) | BRD 4.3: mọi AppUser liên kết **một** Employee; "IT Admin cũng là Employee và cần xin seat cho chính mình". Mọi người giữ vai quản trị đều đăng nhập, xin/rút/hoàn trả quyền cho chính mình, xem/xuất dữ liệu của mình, xác nhận/xin dừng theo dõi thiết bị của mình | UC01, UC11, UC13, UC27, UC44 và vai nhận thông báo ở UC48 — **toàn bộ đều giới hạn ở dữ liệu của chính người đó** | **Không.** Các UC của Employee đều tự phục vụ; kế thừa chỉ nói "một Manager cũng là nhân viên". SoD-4 vẫn chặn tự duyệt. Theo §9.2.3.2 (type conformance), thể hiện Manager được đứng ở đầu association có kiểu Employee — đúng thực tế | **Dùng** — `GA01`–`GA06` |
| Năm vai trên → **Governance User** (trừu tượng) → Employee | BRD 5.5.3: đúng năm vai này, và chỉ năm vai này, có quyền xem báo cáo quản trị, mỗi vai một phạm vi | Association với [UC56](#uc56) | **Không**, vì phạm vi từng vai do ma trận BRD 5.5.3 + `BR-29.8` quy định trong UC56; association chỉ nói "được xem báo cáo trong phạm vi của mình". Không có quyền duyệt/thực thi nào đặt ở A12 | **Dùng** — tránh năm đường dài hội tụ về một oval; A12 không có thể hiện trực tiếp |
| Business Owner → Employee | Người giữ trách nhiệm luôn là nhân viên đang làm việc (`FR-1.7`) | — | — | **Không dùng**: BRD 4.4 định nghĩa Business Owner là **thuộc tính của ứng dụng**, không phải vai đăng nhập; tương tác duy nhất của nó (nhận cảnh báo, có thể qua email) không cần đăng nhập. Khi người đó đăng nhập, họ đóng vai A01 — một người đóng hai actor (§18.1.3.1), không cần kế thừa |
| Người duyệt thay thế → Spending Approver; approver dự phòng → Manager | — | — | — | **Không tạo actor con**: họ thực hiện **đúng** vai A05/A02 theo cấu hình (`QĐ-28c`, `QĐ-02`) |
| Cây quản lý (Manager cấp trên → Manager) | — | — | Tạo quyền theo chức danh | **Không** — generalization không biểu diễn sơ đồ tổ chức |

<a id="use-cases"></a>
## 3. Danh mục use case, độ phủ năng lực và quan hệ UML

<a id="uc-list"></a>
### 3.1. Danh mục use case trên sơ đồ

<!-- GENERATED:uc-list:BEGIN -->
| UC | Tên (EN · VN) | Mức | Actor chính | Actor hỗ trợ | Tham gia qua kế thừa | Quan hệ UC–UC | Nhóm |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [UC01](#uc01) | Sign In · Đăng nhập | User goal | [A01](#a01) Employee | — | A02–A06 qua A12 → A01 (chỉ phạm vi bản thân) | — | Truy cập và quản trị |
| [UC02](#uc02) | Manage User Accounts and Roles · Quản lý tài khoản và vai trò | User goal | [A06](#a06) Super Admin | — | — | — | Truy cập và quản trị |
| [UC03](#uc03) | Configure System Policies · Cấu hình chính sách hệ thống | User goal | [A06](#a06) Super Admin | — | — | — | Truy cập và quản trị |
| [UC04](#uc04) | Review Audit Trail · Tra cứu nhật ký kiểm toán | User goal | [A06](#a06) Super Admin | — | — | — | Truy cập và quản trị |
| [UC05](#uc05) | Monitor System Operations · Giám sát vận hành hệ thống | User goal | [A06](#a06) Super Admin | — | — | — | Truy cập và quản trị |
| [UC06](#uc06) | Initialize Organization Data · Khởi tạo dữ liệu tổ chức | User goal | [A03](#a03) IT Admin | — | — | IN02: «include» UC54 | Tổ chức và vòng đời nhân sự |
| [UC07](#uc07) | Manage Workforce Records · Quản lý hồ sơ nhân sự và tổ chức | User goal | [A03](#a03) IT Admin | [A02](#a02) Manager | — | — | Tổ chức và vòng đời nhân sự |
| [UC08](#uc08) | Offboard Employee · Xử lý nhân viên nghỉ việc | User goal | [A03](#a03) IT Admin | [A02](#a02) Manager | — | EX05: được UC22 «extend» tại *Reclaim Access* | Tổ chức và vòng đời nhân sự |
| [UC09](#uc09) | Manage SaaS Catalog · Quản lý danh mục SaaS | User goal | [A03](#a03) IT Admin | — | — | — | Danh mục, hợp đồng, thuê bao |
| [UC10](#uc10) | Manage Contracts and Subscriptions · Quản lý hợp đồng và thuê bao | User goal | [A03](#a03) IT Admin | [A11](#a11) Exchange Rate Service | — | — | Danh mục, hợp đồng, thuê bao |
| [UC11](#uc11) | Request Software Access · Yêu cầu quyền sử dụng phần mềm | User goal | [A01](#a01) Employee | — | A02–A06 qua A12 → A01 (chỉ phạm vi bản thân) | — | Yêu cầu, quyết định, thực thi |
| [UC13](#uc13) | Return Software Access · Hoàn trả quyền sử dụng | User goal | [A01](#a01) Employee | — | A02–A06 qua A12 → A01 (chỉ phạm vi bản thân) | — | Yêu cầu, quyết định, thực thi |
| [UC14](#uc14) | Review Access Need · Xác nhận nhu cầu | User goal | [A02](#a02) Manager | — | — | — | Yêu cầu, quyết định, thực thi |
| [UC15](#uc15) | Assess New SaaS · Đánh giá SaaS mới | User goal | [A03](#a03) IT Admin | — | — | — | Yêu cầu, quyết định, thực thi |
| [UC55](#uc55) | *Decide Spending Matter* · Quyết định vấn đề chi tiêu | Trừu tượng | [A05](#a05) Spending Approver | — | — | GU01: tổng quát của UC16; GU02: tổng quát của UC30; GU03: tổng quát của UC43; EX04: được UC17 «extend» tại *Assess Budget* | Yêu cầu, quyết định, thực thi |
| [UC16](#uc16) | Decide Spending Request · Quyết định yêu cầu có chi phí | User goal | — | — | A05 qua UC55 | GU01: chuyên biệt hóa UC55 | Yêu cầu, quyết định, thực thi |
| [UC30](#uc30) | Decide Subscription Renewal · Quyết định gia hạn thuê bao | User goal | — | — | A05 qua UC55 | GU02: chuyên biệt hóa UC55 | Yêu cầu, quyết định, thực thi |
| [UC43](#uc43) | Decide SaaS Legitimization · Quyết định hợp thức hóa SaaS | User goal | — | — | A05 qua UC55 | GU03: chuyên biệt hóa UC55 | Yêu cầu, quyết định, thực thi |
| [UC17](#uc17) | Request Budget Information · Hỏi thông tin ngân sách | Subfunction (phần mở rộng) | — | — | A05 trong lần thực hiện UC55 (EX04) | EX04: «extend» UC55 | Yêu cầu, quyết định, thực thi |
| [UC21](#uc21) | Provision Software Access · Cấp quyền sử dụng | User goal | [A03](#a03) IT Admin | [A08](#a08) SaaS Provider | — | — | Yêu cầu, quyết định, thực thi |
| [UC22](#uc22) | Revoke Software Access · Thu hồi quyền sử dụng | User goal | [A03](#a03) IT Admin | [A08](#a08) SaaS Provider | — | EX05: «extend» UC08 | Yêu cầu, quyết định, thực thi |
| [UC20](#uc20) | Control Budgets and Commitments · Kiểm soát ngân sách và khoản cam kết | User goal | [A04](#a04) Finance | [A11](#a11) Exchange Rate Service | — | — | Ngân sách và chi phí |
| [UC32](#uc32) | Reconcile Invoices · Đối soát hóa đơn | User goal | [A04](#a04) Finance | [A11](#a11) Exchange Rate Service | — | IN03: «include» UC54 | Ngân sách và chi phí |
| [UC33](#uc33) | Manage Cost Centers and Allocations · Quản lý Cost Center và phân bổ chi phí | User goal | [A04](#a04) Finance | — | — | — | Ngân sách và chi phí |
| [UC36](#uc36) | Forecast Costs · Dự báo chi phí | User goal | [A04](#a04) Finance | — | — | — | Ngân sách và chi phí |
| [UC24](#uc24) | Manage Usage Evidence · Quản lý bằng chứng sử dụng | User goal | [A03](#a03) IT Admin | [A08](#a08) SaaS Provider | — | — | Bằng chứng sử dụng và tối ưu license |
| [UC26](#uc26) | Operate Device Monitoring · Vận hành thu thập trên thiết bị | User goal | [A03](#a03) IT Admin | — | — | — | Bằng chứng sử dụng và tối ưu license |
| [UC27](#uc27) | Acknowledge Device Monitoring · Xác nhận thông báo theo dõi thiết bị | User goal | [A01](#a01) Employee | — | A02–A06 qua A12 → A01 (chỉ phạm vi bản thân) | — | Bằng chứng sử dụng và tối ưu license |
| [UC48](#uc48) | Notify Employees of Monitoring · Thông báo trước khi theo dõi | User goal | [A03](#a03) IT Admin | [A01](#a01) Employee, [A10](#a10) Email Service Provider | A02–A06 qua A12 → A01 (chỉ phạm vi bản thân) | — | Bằng chứng sử dụng và tối ưu license |
| [UC28](#uc28) | Review License Recommendations · Xem xét khuyến nghị license | User goal | [A02](#a02) Manager, [A03](#a03) IT Admin | — | — | — | Bằng chứng sử dụng và tối ưu license |
| [UC23](#uc23) | Resolve Vendor Discrepancies · Xử lý sai lệch với nhà cung cấp | User goal | [A03](#a03) IT Admin | [A08](#a08) SaaS Provider | — | — | Bằng chứng sử dụng và tối ưu license |
| [UC29](#uc29) | Review Renewal Alerts · Theo dõi cảnh báo gia hạn | User goal | [A03](#a03) IT Admin, [A04](#a04) Finance, [A05](#a05) Spending Approver | [A06](#a06) Super Admin, [A07](#a07) Business Owner, [A10](#a10) Email Service Provider | — | — | Gia hạn |
| [UC42](#uc42) | Investigate Shadow IT · Điều tra Shadow IT | User goal | [A03](#a03) IT Admin | [A02](#a02) Manager, [A13](#a13) AI Model Provider | — | — | Shadow IT |
| [UC56](#uc56) | Review Governance Reports · Xem báo cáo quản trị | User goal | [A12](#a12) Governance User | — | A02–A06 qua A12 (phạm vi theo BRD 5.5.3) | — | Báo cáo |
| [UC59](#uc59) | Manage My Account · Quản lý tài khoản của tôi | User goal | [A01](#a01) Employee | — | A02–A06 qua A12 → A01 (chỉ tài khoản của chính mình) | — | Truy cập và quản trị |
| [UC60](#uc60) | Transfer Super Admin Role · Chuyển giao vai Super Admin | User goal | [A06](#a06) Super Admin | — | — | — | Truy cập và quản trị |
| [UC44](#uc44) | Exercise Personal Data Rights · Thực hiện quyền dữ liệu cá nhân | User goal | [A01](#a01) Employee | — | A02–A06 qua A12 → A01 (chỉ phạm vi bản thân) | — | Quyền dữ liệu cá nhân |
| [UC47](#uc47) | Process Data Subject Requests · Xử lý yêu cầu quyền dữ liệu | User goal | [A03](#a03) IT Admin | — | — | — | Quyền dữ liệu cá nhân |
| [UC54](#uc54) | Import Business Data File · Nhập tệp dữ liệu nghiệp vụ | Subfunction | [A03](#a03) IT Admin, [A04](#a04) Finance | — | — | IN02: được UC06 «include»; IN03: được UC32 «include» | Import dùng chung |

**Tổng:** 39 UC trên sơ đồ — 36 user goal, 2 subfunction, 1 trừu tượng; *(04/10/2026: +UC59, +UC60)* 5 UC deferred ở [mục 4.12](#deferred). Mọi UC có ít nhất một actor tham gia trực tiếp hoặc qua kế thừa; UC17 tham gia qua UC cơ sở UC55.
<!-- GENERATED:uc-list:END -->

<a id="capabilities"></a>
### 3.2. Phân tích lại theo mục tiêu — năng lực → nhu cầu → kết quả → UC

Bảng này được lập **trước** khi vẽ lại. Mỗi dòng trả lời: người dùng cần gì, kết quả nào có ý nghĩa, UC nào đại diện, và khác gì so với mô hình cũ. Mã FR/US/BR đầy đủ của từng UC ở [mục 6](#traceability).

| Nhóm năng lực | Nhu cầu người dùng (UR) | Kết quả mong muốn | UC | Actor | FR / US / BR chính | Phạm vi | Thay đổi so với UC cũ |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Truy cập và quản trị | Đúng người đăng nhập với đúng vai; chính sách và người giữ thẩm quyền cấu hình được; giải trình được mọi thay đổi | Phiên có vai hiện hành; cấu hình có phiên bản; audit chỉ ghi thêm; job minh bạch | UC01, UC02, UC03, UC04, UC05 | A01 (và mọi vai kế thừa), A06 | `FR-8.1`–`FR-8.5`, `FR-3.5`/`3.15`/`3.16`; `US-01-01`–`US-01-08`; `SoD-1`, `BR-37.x`, `BR-38.x` | MVP | UC01 lên sơ đồ (không còn lược) nhờ generalization; UC02 đổi tên |
| Tổ chức và vòng đời nhân sự | Nhân sự, quản lý, Cost Center đúng theo thời gian; khởi tạo nhanh từ dữ liệu có sẵn; người nghỉ không còn quyền | Cây tổ chức có lịch sử; checklist khởi tạo; G1/G2 đầu tiên; offboarding khép | UC06, UC07, UC08, UC33 (danh mục Cost Center), UC54 | A03, A02, A04 | `FR-2.1`, `FR-2.2`, `FR-3.1`, `FR-9.x`, `FR-2.4`; `US-02-x`, `US-03-x`, `US-04-09`; `BR-01.x`, `BR-03.x`, `BR-05.x` | MVP | Thêm quyền quản lý Cost Center cho Finance (OI-04); UC08–UC22 đổi include → extend; import 6 bước thành UC54 được include |
| Danh mục, hợp đồng, thuê bao (NL-1) | Biết đang mua gì, gói nào, bao nhiêu, tới khi nào, ai phụ trách | Danh mục được phép; nghĩa vụ thuê bao, hạn báo hủy, kỳ mới có lịch sử | UC09, UC10 | A03, A11 | `FR-1.1`–`FR-1.8`, `FR-6.1`/`6.2`; `US-04-01`–`US-04-07`, `US-11-03`; `BR-06.x`, `BR-27.x` | MVP | UC31 (ghi kỳ mới) và phần IT của UC34 (đọc hồ sơ) thành thao tác của UC10; thêm nhóm chức năng, ngừng sử dụng (OI-14e, OI-05b) |
| Yêu cầu, quyết định, thực thi (NL-2, NL-3) | Xin quyền nhanh hơn đường tắt; nhu cầu do quản lý quyết, tiền do người có thẩm quyền quyết, IT chỉ thực thi | Request có nhánh; quyết định có lý do; quyền thật được xác nhận | UC11, UC13, UC14, UC15, UC55 (UC16), UC17, UC21, UC22 | A01, A02, A03, A05, A08 | `FR-3.2`–`FR-3.16`, `FR-2.3`–`FR-2.7`; `US-05-x`, `US-06-01`/`02`/`08`, `US-07-01`–`05`; `BR-07.x`, `BR-09.x`, `BR-10.x`, `BR-12.x`, `BR-13.x` | MVP | UC12 (rút) gộp vào UC11; UC16 thành con của UC55; ba extend EX01–EX03 thành một extend EX04 lên UC55 |
| Ngân sách và chi phí (NL-5) | Tiền của ai, đã hứa chi bao nhiêu, còn bao nhiêu; hóa đơn khớp seat; gói dùng chung chia đúng | Ngân sách, cam kết, thực chi, còn lại; đối soát; phân bổ 100% | UC20, UC32, UC33, UC36 | A04, A11 | `FR-5.1`–`FR-5.8a`, `FR-3.14`; `US-06-03`–`09`, `US-12-02`/`03`, `US-04-08`; `BR-29.x`, `BR-35.x`, `BR-36.x` | MVP (L2 hoãn) | UC18 + UC19 gộp vào UC20; phần hóa đơn của UC23 và phần Finance của UC34 về UC32 |
| Bằng chứng sử dụng và tối ưu license (NL-4, PP-1) | Biết seat có thật sự được dùng không, chắc tới đâu; nhân viên được báo trước; không báo động giả | Bằng chứng có nguồn, coverage; khuyến nghị có căn cứ; Keep/Reclaim/Exempt | UC24, UC26, UC27, UC48, UC28, UC23 | A03, A08, A01, A02, A10 | `FR-4.x`, `FR-10.4`, `FR-2.6`; `US-08-x`, `US-09-x`, `US-10-01`–`08`, `US-07-06`/`07`; `BR-17.x`–`BR-23.1`, `BR-42.x`, `BR-45.x` | MVP | UC25 (khớp danh tính) gộp vào UC24; UC23 hẹp lại còn sai lệch với nhà cung cấp |
| Gia hạn (PP-2) | Biết trước hạn báo hủy; quyết giữ/giảm/hủy đúng lúc | Cảnh báo đúng mốc; quyết định trước hạn; kỳ mới đúng thực tế | UC29, UC55 (UC30), UC10 | A03, A04, A05, A06, A07, A10 | `FR-1.4`, `FR-3.13`; `US-11-01`–`04`; `BR-26.x`, `BR-27.x` | MVP | Spending Approver nhận cảnh báo (OI-09a); UC30 thành con của UC55 |
| Shadow IT (NL-6, PP-4) | Thấy SaaS ngoài danh mục mà không kết tội; hợp thức hóa đúng thẩm quyền | Finding có bằng chứng; một trong ba kết cục | UC54, UC42, UC55 (UC43) | A03, A04, A02, A05 | `FR-6.3`–`FR-6.9`, `FR-3.4c-1`; `US-13-01`–`06`; `BR-31.x`, `BR-34.x`, `BR-46.x` | MVP | UC41 tách: phần import → UC54, phần khớp/finding → UC42; UC43 thành con của UC55 |
| Báo cáo | Mỗi vai thấy đúng số liệu mình cần, có nguồn và độ mới | Năm nhóm báo cáo đúng phạm vi vai | UC56 | A12 (A02–A06) | `FR-0.x`, `FR-5.9`–`FR-5.12`; `US-12-01`/`04`–`07`; `BR-29.x`, `BR-47.x` | MVP | UC35, UC37–UC40 gộp thành UC56 (ma trận quyền giữ trong đặc tả) |
| Quyền dữ liệu cá nhân (BRD 5.11) | Biết hệ thống lưu gì về mình; xin xuất, dừng theo dõi, chỉnh sửa; có người chịu trách nhiệm xử lý | Yêu cầu có thời điểm tiếp nhận/hoàn tất, người xử lý, kết quả | UC44, UC47 | A01, A03 | `FR-10.1`–`FR-10.7`, `FR-4.18`; `US-14-01`/`02`/`06`, `US-09-04`; `BR-40.x`, `BR-42.6` | MVP | UC45, UC46 gộp vào UC44; thêm yêu cầu chỉnh sửa (OI-13); quy tắc xử lý OI-01a/b/c |

**Rà soát độ vụn / trùng / quá rộng** *(kiểm theo trigger, kết quả và thẩm quyền — không theo tên)*:

- **Quá vụn → gộp:** UC12 *rút yêu cầu* là thao tác trên chính Request của người gửi (cùng đối tượng, cùng phạm vi quyền, cùng vòng đời) → thao tác của UC11. UC25 *khớp danh tính* là bước làm sạch bằng chứng của cùng IT, cùng kết quả "bằng chứng gắn đúng người" → thao tác của UC24. UC31 *ghi kỳ thuê bao mới* là cập nhật vòng đời Subscription của cùng IT → thao tác của UC10. UC34 *đọc hồ sơ gốc* là bước đọc trong công việc khác → subflow của UC10 (IT), UC32 (Finance), UC55 (Spending Approver, OI-08a). UC45/UC46 là hai loại yêu cầu quyền dữ liệu của cùng nhân viên → UC44.
- **Cùng mục tiêu kiểm soát ngân sách → gộp:** UC18 *trả lời hỏi ngân sách* và UC19 *ghi nhận cam kết* chính là hai việc `SoD-3` liệt kê cho Finance ("chỉ trả lời yêu cầu thông tin ngân sách, ghi nhận ngân sách và theo dõi khoản cam kết") → UC20 *Control Budgets and Commitments*. Tên dùng *Control*, không *Approve*, để không gợi Finance là cửa duyệt.
- **Cùng một năng lực báo cáo → gộp:** UC35, UC37–UC40 là năm nhóm báo cáo của cùng module BRD 5.5.3 (`QĐ-24`), đều chỉ đọc, phạm vi theo vai → UC56. Không che quyết định/thực thi nào; phần tiết kiệm hai con số (KB-3) giữ bằng `BR-29.7`, `BR-20.2`.
- **Quá rộng → tách/hẹp:** UC23 cũ gộp sai lệch nhà cung cấp (IT) với chênh lệch hóa đơn (Finance) → UC23 chỉ còn sai lệch với nhà cung cấp; chênh lệch hóa đơn thuộc UC32 (`FR-7.7` bảng tình huống). UC41 cũ trộn *nhập file* với *khớp nhà cung cấp/tạo finding* → UC54 + UC42.
- **Không gộp dù dùng chung entity:** UC21/UC22 (cấp khác thu hồi: điều kiện, kết quả, tiết kiệm khác); UC14/UC55 (nhu cầu khác tiền — ba loại quyết định, ba người); UC27/UC48 (xác nhận chủ động khác thông báo); UC29/UC30 (được báo khác quyết); UC09/UC10 (được phép dùng khác nghĩa vụ trả tiền); UC28/UC22 (quyết định khác thực thi, `SoD-5`).
- **Không dùng "Manage X" để che:** các UC tên *Manage…* (UC02, UC07, UC09, UC10, UC24, UC33) chỉ gom tạo/xem/sửa/ngừng dùng dữ liệu của **một** actor chính; mọi duyệt, thực thi, thu hồi, đối soát là UC riêng.

<a id="relationships"></a>
### 3.3. Quan hệ UML — sổ quan hệ

<!-- GENERATED:relationship-ledger:BEGIN -->
| ID | Loại | Từ | Tới | Ý nghĩa · extension point · điều kiện | UML 2.5.1 |
| --- | --- | --- | --- | --- | --- |
| GA01 | Generalization (actor) | [A12](#a12) Governance User | [A01](#a01) Employee | Mỗi Governance User là một Employee; chỉ kế thừa association của actor cha | §9.2.3.2 tr. 100; §9.2.4.2 tr. 102 |
| GA02 | Generalization (actor) | [A02](#a02) Manager | [A12](#a12) Governance User | Mỗi Manager là một Governance User; chỉ kế thừa association của actor cha | §9.2.3.2 tr. 100; §9.2.4.2 tr. 102 |
| GA03 | Generalization (actor) | [A03](#a03) IT Admin | [A12](#a12) Governance User | Mỗi IT Admin là một Governance User; chỉ kế thừa association của actor cha | §9.2.3.2 tr. 100; §9.2.4.2 tr. 102 |
| GA04 | Generalization (actor) | [A04](#a04) Finance | [A12](#a12) Governance User | Mỗi Finance là một Governance User; chỉ kế thừa association của actor cha | §9.2.3.2 tr. 100; §9.2.4.2 tr. 102 |
| GA05 | Generalization (actor) | [A05](#a05) Spending Approver | [A12](#a12) Governance User | Mỗi Spending Approver là một Governance User; chỉ kế thừa association của actor cha | §9.2.3.2 tr. 100; §9.2.4.2 tr. 102 |
| GA06 | Generalization (actor) | [A06](#a06) Super Admin | [A12](#a12) Governance User | Mỗi Super Admin là một Governance User; chỉ kế thừa association của actor cha | §9.2.3.2 tr. 100; §9.2.4.2 tr. 102 |
| GU01 | Generalization (use case) | [UC16](#uc16) Decide Spending Request | [UC55](#uc55) *Decide Spending Matter* | Kế thừa hành vi quyết định chung, association với A05 và extension point *Assess Budget* | §9.2.3.2 tr. 100; §9.2.4.2 tr. 102 |
| GU02 | Generalization (use case) | [UC30](#uc30) Decide Subscription Renewal | [UC55](#uc55) *Decide Spending Matter* | Kế thừa hành vi quyết định chung, association với A05 và extension point *Assess Budget* | §9.2.3.2 tr. 100; §9.2.4.2 tr. 102 |
| GU03 | Generalization (use case) | [UC43](#uc43) Decide SaaS Legitimization | [UC55](#uc55) *Decide Spending Matter* | Kế thừa hành vi quyết định chung, association với A05 và extension point *Assess Budget* | §9.2.3.2 tr. 100; §9.2.4.2 tr. 102 |
| IN02 | «include» | [UC06](#uc06) Initialize Organization Data | [UC54](#uc54) Import Business Data File | Each initialization step loads its file through the shared six-step import (FR-9.2, FR-7.1) | §18.1.3.3 tr. 641 |
| IN03 | «include» | [UC32](#uc32) Reconcile Invoices | [UC54](#uc54) Import Business Data File | Every reconciliation starts by loading the invoice file through the shared import (US-12-02, FR-7.1) | §18.1.3.3 tr. 641 |
| EX04 | «extend» | [UC17](#uc17) Request Budget Information | [UC55](#uc55) Decide Spending Matter | Extension point *Assess Budget*; điều kiện `[matter has a cost and the approver chooses to ask Finance]` | §18.1.3.2 tr. 640–641; §18.2.2.5 tr. 648 |
| EX05 | «extend» | [UC22](#uc22) Revoke Software Access | [UC08](#uc08) Offboard Employee | Extension point *Reclaim Access*; điều kiện `[departing employee still holds an active or pending seat]` | §18.1.3.2 tr. 640–641; §18.2.2.5 tr. 648 |

**Association (55)** — đường liền, không mũi tên; *chính* = actor sở hữu mục tiêu, *hỗ trợ* = cung cấp đầu vào/dịch vụ hoặc nhận kết quả. Hai loại vẽ giống nhau (UML không phân biệt); mã của mỗi đường là `AS-<actor>-<UC>`.

| Actor | Chính | Hỗ trợ | Số |
| --- | --- | --- | --- |
| [A01](#a01) Employee | [UC01](#uc01), [UC11](#uc11), [UC13](#uc13), [UC27](#uc27), [UC44](#uc44), [UC59](#uc59) | [UC48](#uc48) | 7 |
| [A02](#a02) Manager | [UC14](#uc14), [UC28](#uc28) | [UC07](#uc07), [UC08](#uc08), [UC42](#uc42) | 5 |
| [A03](#a03) IT Admin | [UC06](#uc06), [UC07](#uc07), [UC08](#uc08), [UC09](#uc09), [UC10](#uc10), [UC15](#uc15), [UC21](#uc21), [UC22](#uc22), [UC23](#uc23), [UC24](#uc24), [UC26](#uc26), [UC28](#uc28), [UC29](#uc29), [UC42](#uc42), [UC47](#uc47), [UC48](#uc48), [UC54](#uc54) | — | 17 |
| [A04](#a04) Finance | [UC20](#uc20), [UC29](#uc29), [UC32](#uc32), [UC33](#uc33), [UC36](#uc36), [UC54](#uc54) | — | 6 |
| [A05](#a05) Spending Approver | [UC55](#uc55), [UC29](#uc29) | — | 2 |
| [A06](#a06) Super Admin | [UC02](#uc02), [UC03](#uc03), [UC04](#uc04), [UC05](#uc05), [UC60](#uc60) | [UC29](#uc29) | 6 |
| [A07](#a07) Business Owner | — | [UC29](#uc29) | 1 |
| [A08](#a08) SaaS Provider | — | [UC21](#uc21), [UC22](#uc22), [UC23](#uc23), [UC24](#uc24) | 4 |
| [A10](#a10) Email Service Provider | — | [UC29](#uc29), [UC48](#uc48) | 2 |
| [A11](#a11) Exchange Rate Service | — | [UC10](#uc10), [UC20](#uc20), [UC32](#uc32) | 3 |
| [A12](#a12) Governance User | [UC56](#uc56) | — | 1 |
| [A13](#a13) AI Model Provider | — | [UC42](#uc42) | 1 |

**Tổng quan hệ trên sơ đồ:** 55 association + 6 generalization actor + 3 generalization use case + 2 «include» + 2 «extend» = 68 *(đồ thị đầy đủ của mô hình; view edited vẽ 53 association — mục *Bản edited*)*.
<!-- GENERATED:relationship-ledger:END -->

<a id="relationship-analysis"></a>
### 3.4. Phân tích từng ứng viên quan hệ

*Mỗi dòng dựa trên scenario trong nguồn và điều khoản UML 2.5.1; "workflow gọi subflow" không tự đủ để chứng minh include.*

**«include»** — hành vi được bao gồm **luôn** chạy trong mỗi lần thực hiện UC bao gồm và là phần dùng chung (§18.1.3.3).

| Ứng viên | Kịch bản kiểm | Kết luận |
| --- | --- | --- |
| **IN02** UC06 → UC54 | BRD `FR-9.2`: "Mỗi bước dùng lại khung import 6 bước tại FR-7.1… Không có luồng nhập liệu riêng cho khởi tạo". Khởi tạo công ty mới: bước 1 nhập file nhân sự, bước 3 hợp đồng, bước 4 hiện trạng seat — mỗi lần đều qua xem trước bắt buộc, báo dòng lỗi, phát hiện file trùng. Không có lần khởi tạo nào không import | **Include hợp lệ**: hành vi bắt buộc, dùng chung với UC32 và các lần import khác (`FR-7.1` "mọi luồng import dùng chung khung") |
| **IN03** UC32 → UC54 | `US-12-02`: "Finance import hóa đơn, được ghép dòng… so ba con số". Mỗi lần đối soát bắt đầu bằng nạp file hóa đơn qua khung 6 bước; không có FR nhập hóa đơn tay | **Include hợp lệ** |
| UC08 → UC22 *(IN01 cũ)* | Nhân viên thực tập nghỉ khi **không giữ seat nào**: offboarding vẫn đặt ngày nghỉ, hết hiệu lực thiết bị, lên lịch xóa dữ liệu — hành vi thu hồi **không chạy**. UC22 lại được định nghĩa trên **một** Assignment (một tác vụ thu hồi), không phải "mọi seat" | **Không phải include** — hành vi có điều kiện → mô hình lại thành **EX05** (dưới) |
| UC24 → UC54, UC07 → UC54, UC10 → UC54 | Nguồn usage có thể là connector (GitHub) hoặc bộ thu thập, không phải file; nhân sự và hợp đồng có thể sửa tay | Không include (có lần thực hiện không import). Việc nạp file cho các dữ liệu này là **chính UC54** do IT/Finance thực hiện trực tiếp (association), không cần quan hệ UC–UC |
| UC11 → UC14/UC55/UC21; UC28 → UC22; UC43 → UC09/UC21; UC29 → UC30; UC44 → UC47 | Các UC sau do actor khác làm, ở lần thực hiện khác, có chờ và có nhánh từ chối (Keep/Exempt, từ chối chi, không duyệt) | Không include — là **thứ tự workflow** (Activity Diagram WF-09/10/13/15/17), không phải hành vi chèn vào cùng một lần thực hiện |
| Mọi UC → UC01 Sign In | Phiên hợp lệ là điều kiện trước; một phiên phục vụ nhiều mục tiêu | Không include — P-AUTH là precondition |

**«extend»** — UC cơ sở có nghĩa độc lập; hành vi mở rộng chèn vào tại extension point **khi** điều kiện đúng (§18.1.3.2; điều kiện đúng thì phần mở rộng *chắc chắn* chạy, sai thì không).

| Ứng viên | Kịch bản kiểm | Kết luận |
| --- | --- | --- |
| **EX04** UC17 → UC55, extension point *Assess Budget*, điều kiện `[matter has a cost and the approver chooses to ask Finance]` | Spending Approver mở yêu cầu Figma 3 seat có phí, snapshot còn 12 triệu nhưng muốn biết khoản sắp chi của quý → hỏi Finance tại điểm *Assess Budget* → vẫn quyết ngay; Finance trả lời sau (UC20). Không hỏi thì quyết định vẫn hoàn chỉnh (`QĐ-29b`, `FR-3.14` (2)) | **Extend hợp lệ.** Đặt trên **UC cha trừu tượng**: extension point thuộc UC55 (thỏa §18.2.2.5); UC16/UC30/UC43 là thể hiện gián tiếp của UC55 (§9.2.3.2) nên cùng được mở rộng — thay ba extend EX01–EX03 cũ bằng một |
| **EX05** UC22 → UC08, extension point *Reclaim Access*, điều kiện `[departing employee still holds an active or pending seat]` | E7 nghỉ 30/09 còn giữ Figma và GitHub → tới ngày cuối, tại *Reclaim Access* IT chạy thu hồi (GitHub qua connector, Figma thủ công); UC08 chỉ đóng khi cả hai `success`. Thực tập sinh không giữ seat nào → điều kiện sai, UC08 vẫn hoàn chỉnh (thiết bị, xóa dữ liệu). UC22 cũng tồn tại độc lập (hoàn trả, reclaim, Shadow IT bị từ chối) | **Extend hợp lệ** — thay IN01 cũ |
| UC20 (trả lời) → UC17 | Finance trả lời ở lần thực hiện khác, có thể sau khi đã quyết | Không — hai mục tiêu của hai actor; liên hệ hồ sơ mô tả trong luồng |
| UC47 → UC44 | IT xử lý sau, có SLA riêng | Không — cùng lý do |
| UC54 → UC24/UC07/UC10 `[nguồn là file]` | Có thể mô hình là extend, nhưng actor tự thực hiện UC54 như một mục tiêu riêng ("nạp file vào hệ thống") với xem trước và xác nhận | Không vẽ: association trực tiếp A03/A04–UC54 diễn đạt đúng hơn và tránh ba đường phụ thuộc không thêm nghĩa |
| Lỗi/nhánh ngoại lệ (cấp phát thất bại, thiếu approver, nguồn cũ) | Là luồng thay thế của chính UC | Không extend — ghi ở *Alternate flows* |

**Generalization use case** — UC con thừa hưởng hành vi, extension point và association của UC cha, thêm phần chuyên biệt (§9.2.3.2).

| Ứng viên | Hành vi chung đã đặc tả | Phần chuyên biệt | Kết luận |
| --- | --- | --- | --- |
| **GU01–GU03** UC16, UC30, UC43 → **UC55** *Decide Spending Matter* (trừu tượng) | Cùng actor A05 và cùng hợp đồng quyết định của `FR-3.13`/`FR-3.14`/`FR-3.4c-1`: xem hồ sơ và đánh giá; **snapshot ngân sách cùng Cost Center và kỳ** chụp lại khi quyết; *Assess Budget* hỏi Finance tùy chọn, SLA không dừng; mở tệp gốc của hồ sơ đang quyết; lý do bắt buộc khi từ chối; xung đột → người thay thế cấu hình trước; không ủy quyền; không cấp/thu hồi | UC16: duyệt/từ chối Request, tạo đúng một khoản cam kết khi duyệt có phí. UC30: giữ/giảm/hủy kỳ tới trước hạn báo hủy. UC43: báo nhầm/không duyệt/duyệt hợp thức hóa, không duyệt chi lần hai | **Dùng.** Đánh giá cũ bác vì "chưa có hành vi chung được đặc tả" — nay hành vi chung được đặc tả ở [UC55](#uc55) và chính nguồn nói "cùng một nguyên tắc" (`BR-27.4`, `FR-3.4c-1`). UC55 trừu tượng nên không bao giờ thực hiện trực tiếp |
| UC21, UC22 → *Execute Access Change* | Cùng khung thực thi WF-09a (hàng đợi, connector/thủ công, xác nhận quyền thật, thử lại) | Cấp khác thu hồi | **Không dùng**: không giảm đường nối (IT và SaaS Provider vẫn nối từng UC để giữ EX05 đúng đích), thêm một oval; hành vi chung đã nêu trong cả hai đặc tả |
| Năm nhóm báo cáo → *Review Reports* | Cùng nhãn cơ sở/độ mới, "không có dữ liệu ≠ 0" | Mỗi nhóm một bộ chỉ số | **Không** — đã gom thành một UC (UC56) vì không có actor nào cần nhìn các nhóm như mục tiêu riêng |

**Association** — tham gia không đồng nghĩa quyền quyết: UC28 Manager quyết cuối, IT chỉ trả lại tối đa một lần (OI-02); UC43 chỉ có Spending Approver (qua UC55) — đánh giá của IT nằm ở UC42, thực thi ở UC09/UC21/UC22, giống UC16 với UC15/UC21 (DQ-06); UC07/UC08/UC42 Manager chỉ cung cấp bối cảnh; UC29 Business Owner, Super Admin, Email chỉ nhận cảnh báo; UC48 Employee chỉ nhận thông báo; SaaS Provider, Email, Exchange Rate tham gia **có điều kiện** và không có thẩm quyền.

<a id="uc-specs"></a>
## 4. Đặc tả từng use case

Mỗi UC ghi: mục tiêu · giá trị · actor · trigger · precondition · luồng chính · luồng thay thế/lỗi · hậu điều kiện · quyền và BR · quan hệ · nguồn · trạng thái. Nội dung đầy đủ của từng BR ở [mục 5](#business-rules); FR/US/F/WF/UF đầy đủ ở [mục 6](#traceability). *P-AUTH* áp cho mọi UC có phiên, trừ nơi ghi khác.

### 4.1. Truy cập và quản trị hệ thống

<a id="uc01"></a>
#### UC01 — Sign In · Đăng nhập

- **Mục tiêu / giá trị:** vào hệ thống bằng **thông tin đăng nhập do chính SaaS-Sentry quản lý** (email đăng nhập + mật khẩu; hệ thống chỉ lưu dạng băm) với đúng danh tính và vai hiện hành, để mọi thao tác sau đó chạy đúng quyền và truy vết được. *(04/10/2026 — `QĐ-46a`, thay đăng nhập OIDC.)*
- **Actor:** chính A01 Employee — mọi vai quản trị dùng UC này **qua kế thừa**. **Không có actor hỗ trợ**: không có dịch vụ định danh bên ngoài tham gia đăng nhập.
- **Trigger:** mở chức năng cần phiên, hoặc phiên hết hạn.
- **Precondition:** có AppUser liên kết một Employee, do Super Admin tạo từ hồ sơ nhân viên đã có ([UC02](#uc02); ngoại lệ `QĐ-47f`: lệnh khôi phục `REASSIGN` ngoài ứng dụng) và đã **kích hoạt** — người dùng đã tự đặt mật khẩu qua lời mời dùng một lần; tài khoản không bị khóa; Employee không ở trạng thái đã nghỉ việc (BRD 4.3). Tài khoản mới tạo ở trạng thái **chưa kích hoạt (đã mời)**: vai gán trước — kể cả `SUPER_ADMIN`, `IT_ADMIN`, `FINANCE` — được **lưu nhưng chưa có hiệu lực sử dụng** cho tới khi kích hoạt, rồi có hiệu lực từ thao tác kế tiếp (`FR-8.6`, `US-01-01` AC-11).
- **Luồng chính:** (1) người dùng nhập email đăng nhập và mật khẩu; (2) hệ thống đối chiếu với thông tin đăng nhập đã lưu (dạng băm); (3) hệ thống ánh xạ AppUser → Employee, suy vai Manager từ cây quản lý, đọc các vai gán tay; (4) mở phiên nội bộ với vai và phạm vi hiện hành.
- **Luồng thay thế/lỗi:** sai email hoặc mật khẩu, email không có tài khoản hoặc chưa được mời → không có phiên và **cùng một thông báo chung**, không lộ email có tồn tại, đã mời hay chưa kích hoạt (`US-01-01` AC-10); AppUser **chưa kích hoạt** (chưa đặt mật khẩu), bị khóa, không liên kết Employee hoặc Employee đã nghỉ việc → từ chối ngay cả khi người dùng nhớ mật khẩu, **không** tự tạo tài khoản và **không** cấp vai khi đăng nhập; lời mời hết hạn, đã dùng hoặc đã bị lời mời mới thay thế → không đặt được mật khẩu, Super Admin **gửi lại lời mời** (làm vô hiệu lời mời cũ; `FR-8.6`, `FR-8.11(a)`; không gửi cho tài khoản của chính mình — `FR-8.8`; không có thao tác đặt hay xem mật khẩu thay người khác) — con số thời hạn lời mời là thiết kế BE đang **Proposed**, chưa là quyết định; nhập sai nhiều lần → từ chối tạm thời, **không bao giờ** khóa vĩnh viễn (`FR-8.11(f)`); thành phần xác thực của hệ thống lỗi → báo lỗi, **không** có đường vòng bỏ xác thực, không báo như sai mật khẩu.
- **Vòng đời thông tin đăng nhập (cùng UC, tự phục vụ; `QĐ-46a`, `FR-8.11`, `US-01-10`):** *kích hoạt lần đầu* — người dùng mở lời mời dùng một lần gửi tới email đăng nhập và tự đặt mật khẩu → tài khoản kích hoạt; *quên/đặt lại mật khẩu* — người dùng tự yêu cầu, phản hồi giống hệt nhau dù email có hay không có trong hệ thống, chỉ tài khoản đã kích hoạt, đang hoạt động và có nhân viên chưa nghỉ việc mới nhận thư, liên kết dùng một lần; *đổi mật khẩu* — người dùng đã đăng nhập tự đổi, cần nhập mật khẩu hiện tại. Đặt lại hoặc đổi mật khẩu **thu hồi mọi phiên** và **không** đổi vai, trạng thái khóa hay trạng thái nhân viên. Không ai — kể cả Super Admin, IT Admin hay người vận hành — thấy hoặc biết mật khẩu; không gửi mật khẩu lâu dài qua email.
- **Hậu điều kiện:** thành công — phiên với vai tại thời điểm đăng nhập; thất bại — không có phiên, không đổi dữ liệu nghiệp vụ. Khóa tài khoản hoặc nhân viên nghỉ việc chặn truy cập **từ thao tác kế tiếp**.
- **Quyền và BR:** xác thực thành công ≠ quyền nghiệp vụ; SoD kiểm ở từng thao tác, tại tầng API (BRD 7.2). Quyền nghiệp vụ nằm trong CSDL, không lấy từ email, tên miền hay thông tin bên ngoài.
- **Quan hệ:** không UC nào include UC01 (P-AUTH là precondition). *(04/10/2026)* Kích hoạt, quên, đặt lại và đổi mật khẩu cùng xem hồ sơ là **một mục tiêu tự phục vụ riêng**, [UC59](#uc59) — không vẽ mỗi thao tác thành một use case; bước Super Admin **tạo tài khoản/gửi lời mời** thuộc [UC02](#uc02).
- **Trạng thái:** MVP. Hướng đăng nhập nội bộ là **quyết định của Owner** (`QĐ-46`, 03–04/10/2026), **chưa phải xác nhận của GVHD**; BE chưa implement (ADR-0010). Việc dùng email cho lời mời/đặt lại mật khẩu mở rộng phạm vi kênh email đã ghi ở `OI-09b`/`BR-42.7` — xem [mục 8.4](#open-items).

<a id="uc02"></a>
#### UC02 — Manage User Accounts and Roles · Quản lý tài khoản và vai trò

- **Mục tiêu / giá trị:** đúng người có tài khoản và vai phù hợp.
- **Actor:** chính A06 Super Admin.
- **Trigger:** nhân sự mới cần tài khoản, đổi vai, khóa/mở tài khoản.
- **Precondition:** P-AUTH; Employee liên quan đã có.
- **Luồng chính (tạo/xem/sửa/khóa):** (1) chọn Employee/AppUser; (2) tạo AppUser liên kết Employee — tài khoản mới ở trạng thái **chưa kích hoạt**, Super Admin gửi (hoặc gửi lại) lời mời dùng một lần và người dùng **tự đặt mật khẩu** ([UC01](#uc01), `QĐ-46a`, `US-01-10`; Super Admin không đặt hay thấy mật khẩu) — gán hoặc gỡ vai gán tay (IT Admin, Finance, Super Admin; vai gán cho tài khoản chưa kích hoạt được lưu nhưng chưa có hiệu lực cho tới khi kích hoạt — `FR-8.6`); (3) khóa/mở; (4) hệ thống kiểm tra, lưu và ghi Audit Trail.
- **Luồng thay thế/lỗi:** vai Manager **không gán tay** — suy từ cây quản lý (`US-01-02`); người giữ vai Người duyệt chi, người thay thế, approver dự phòng cấu hình ở [UC03](#uc03); đổi vai làm thay đổi người được giao bước đang chờ → xác định lại người theo `FR-3.16`, SLA không đặt lại. Không xóa cứng AppUser đã có lịch sử.
- **Hậu điều kiện:** tài khoản/vai cập nhật và truy vết được; thay đổi bị từ chối không áp dụng.
- **Quyền và BR:** Super Admin không gán seat, không duyệt nghiệp vụ (`SoD-1`, `BR-37.1`, `FR-8.5`).
- **Trạng thái:** MVP.

<a id="uc03"></a>
#### UC03 — Configure System Policies · Cấu hình chính sách hệ thống

- **Mục tiêu / giá trị:** hệ thống vận hành theo chính sách và người giữ thẩm quyền đã cấu hình, không hard-code.
- **Actor:** chính A06 Super Admin.
- **Trigger:** thiết lập ban đầu hoặc thay đổi chính sách.
- **Precondition:** P-AUTH; người được chọn giữ vai là Employee hợp lệ.
- **Luồng chính:** khai báo/sửa (1) chính sách duyệt theo nhánh (a)/(b)/(c) (`FR-3.4`); (2) SLA từng loại bước — **giờ làm việc, mặc định 2 ngày làm việc** (`BR-13.11`), ngưỡng backlog (`FR-3.8`); (3) người giữ vai: Người duyệt chi, **người thay thế khi xung đột** (không trùng Người duyệt chi — `BR-13.12`), approver dự phòng ở gốc (`QĐ-02`); (4) ngưỡng/lịch rule phát hiện (`FR-4.13`, `FR-4.12b`, `BR-20.1`); (5) chính sách lưu giữ (`FR-10.3`); (6) nội dung thông báo theo dõi **có phiên bản**, ngưỡng N phút của bộ thu thập — **mặc định 5** (`BR-45.5`); (7) loại kỳ ngân sách — **mặc định quý** (`BR-36.8`); (8) bật thu thập cho ứng dụng nhóm liên lạc có lý do (`BR-06.5`); hệ thống lưu phiên bản và Audit Trail.
- **Luồng thay thế/lỗi:** không có ủy quyền (`QĐ-27`, `BR-13.8`); đổi **chính sách** không ảnh hưởng yêu cầu đang chạy, đổi **người giữ vai** xác định lại người của bước đang chờ, SLA không đặt lại (`BR-07.2`, `BR-37.2`, `BR-13.9`); thiếu Người duyệt chi/người thay thế → bước chờ có kiểm soát và báo Super Admin (`FR-3.12`); kéo dài lưu giữ cần thỏa thuận đã thông báo (`BR-44.5`); đổi loại kỳ ngân sách khi đã có ngân sách → từ chối (`BR-36.8`).
- **Hậu điều kiện:** cấu hình có hiệu lực đúng phạm vi, có phiên bản; lỗi → giữ cấu hình hợp lệ trước đó.
- **Quyền và BR:** cấu hình **không phải** phê duyệt (`SoD-1`).
- **Trạng thái:** MVP — OWNER DECISION 25/09/2026 cho giá trị mặc định SLA, N, loại kỳ và ràng buộc người thay thế (OI-14a, OI-14b, OI-11b, OI-17).

<a id="uc04"></a>
#### UC04 — Review Audit Trail · Tra cứu nhật ký kiểm toán

- **Mục tiêu / giá trị:** giải trình ai đã làm gì, khi nào, trên cơ sở nào.
- **Actor:** chính A06 Super Admin — **vai duy nhất** tra cứu Audit Trail (OI-08c, `BR-38.3`).
- **Trigger:** cần kiểm tra một hành động hoặc chuỗi xử lý.
- **Luồng chính:** chọn đối tượng/khoảng thời gian/người → xem người thực hiện, vai lúc đó, trước/sau, mã tương quan, thời điểm → đối chiếu quyết định với thực thi.
- **Luồng thay thế/lỗi:** Audit Trail chỉ ghi thêm, không sửa/xóa (`INV-05`, `BR-38.1`), không bị xóa theo chính sách lưu giữ (`BR-41.3`, `BR-44.3`); vai khác xem lịch sử của đối tượng trong phạm vi mình **ngay trong UC tương ứng**, không qua UC04.
- **Hậu điều kiện:** có bằng chứng truy vết; lịch sử không đổi.
- **Trạng thái:** MVP — OI-08c.

<a id="uc05"></a>
#### UC05 — Monitor System Operations · Giám sát vận hành hệ thống

- **Mục tiêu / giá trị:** biết tác vụ nền (rule, đồng bộ, xuất dữ liệu, xóa dữ liệu) chạy ra sao để xử lý kịp.
- **Actor:** chính A06 Super Admin.
- **Luồng chính:** xem lần chạy gần nhất, kết quả, số bản ghi, lỗi của từng job (`FR-8.4`); với job xóa dữ liệu, xem số bản ghi đã xóa theo lớp (`BR-44.4`); chuyển lỗi tới nơi xử lý qua chức năng được phép.
- **Luồng thay thế/lỗi:** job thất bại phải hiện, không im lặng (`BR-38.2`); không đánh dấu thành công giả; không suy ra quyền chạy lại tùy ý hay vượt quyết định nghiệp vụ.
- **Quyền và BR:** xóa là xóa thật, tổng hợp phải phi định danh (`BR-41.1`, `BR-41.2`, `BR-44.1`, `BR-44.2`).
- **Trạng thái:** MVP.

### 4.2. Tổ chức và vòng đời nhân sự

<a id="uc06"></a>
#### UC06 — Initialize Organization Data · Khởi tạo dữ liệu tổ chức

- **Mục tiêu / giá trị:** doanh nghiệp có giá trị đo được (G1/G2) ngay khi triển khai, chỉ từ dữ liệu nội bộ.
- **Actor:** chính A03 IT Admin.
- **Trigger:** instance mới hoặc còn thiếu bước khởi tạo.
- **Precondition:** P-AUTH; **danh mục Cost Center đã được Finance khai báo** ([UC33](#uc33), OI-04).
- **Luồng chính:** checklist năm bước (`FR-9.1`): (1) nhập nhân sự, quản lý trực tiếp, mã Cost Center; (2) khai báo ứng dụng; (3) hợp đồng, gói, thuê bao; (4) hiện trạng ai giữ seat nào — Assignment không có Request, gắn nhãn *khởi tạo* (`BR-01.2`); (5) log usage nếu có. Mỗi bước nạp file qua **[UC54](#uc54)** («include» IN02). Sau bước 4 hệ thống chạy G1/G2 lần đầu (`FR-9.5`); IT **chốt hoàn tất bước 4** → đóng giai đoạn khởi tạo (`BR-01.7`).
- **Luồng thay thế/lỗi:** chưa xong bước 1 và 3 thì không sang bước 4 (`BR-01.1`); dòng thiếu Cost Center (`BR-01.5`) hoặc mã Cost Center chưa có trong danh mục (`BR-01.6`) bị từ chối ở xem trước; vượt số seat đã mua, chồng lấn, nhà thầu thiếu ngày kết thúc → từ chối dòng (`US-02-05`); màn hình rỗng dẫn về bước còn thiếu (`BR-01.4`); sau khi chốt bước 4, Assignment không Request bị từ chối — chênh lệch đi qua [UC23](#uc23).
- **Hậu điều kiện:** dữ liệu nền có nguồn gốc; G1/G2 hiển thị; thất bại → giữ tiến độ checklist, công khai dòng lỗi.
- **Quan hệ:** «include» [UC54](#uc54) (IN02).
- **Trạng thái:** MVP — OWNER DECISION 25/09/2026 (OI-04, OI-10).

<a id="uc07"></a>
#### UC07 — Manage Workforce Records · Quản lý hồ sơ nhân sự và tổ chức

- **Mục tiêu / giá trị:** nhân sự, quản lý trực tiếp và Cost Center đúng **theo thời gian**, để định tuyến duyệt và quy chi phí đúng.
- **Actor:** chính A03 IT Admin; hỗ trợ A02 Manager (bối cảnh cấp dưới).
- **Trigger:** onboarding, đổi quản lý/Cost Center, nghỉ dài/quay lại, nhà thầu sắp hết hạn, nghỉ việc.
- **Luồng chính (tạo/xem/sửa theo hiệu lực):** (1) IT cập nhật hồ sơ, trạng thái, quan hệ quản lý và Cost Center có ngày hiệu lực — sửa tay hoặc nạp file nhân sự qua [UC54](#uc54); (2) hệ thống tạo giai đoạn mới, không ghi đè (`ADR-04`, `BR-03.2`); (3) áp tác động: xác định lại người duyệt bước đang chờ khi `manager_id` đổi (`FR-3.16`), gửi Manager mới danh sách seat để xem lại (`BR-03.3`), nhắc nhà thầu/thực tập sinh trước 7 ngày (`FR-2.8`).
- **Luồng thay thế/lỗi:** ngày hiệu lực trong quá khứ → cảnh báo ảnh hưởng báo cáo đã phát hành (`BR-03.1`); mã Cost Center chưa có → từ chối (`BR-01.6`); bước duyệt chi/IT đang chờ không đổi người (`BR-03.4`); nghỉ dài quá hạn → nhắc IT, không tự đổi trạng thái (`BR-04.3`); chuyển *đã nghỉ việc* bắt buộc ngày nghỉ (`BR-05.3`) và mở [UC08](#uc08); nhà thầu quá hạn chưa xử lý nổi lên như mục nợ (`BR-39.3`); Manager chọn gia hạn cho nhà thầu → tạo Request qua [UC11](#uc11).
- **Hậu điều kiện:** hồ sơ đúng tại mọi thời điểm; dòng lỗi không áp dụng.
- **Quyền và BR:** không quản lý phòng ban/đội (`QĐ-23`); Cost Center do Finance quản lý (`BR-29.9`); không tích hợp HRM (`BR-04.2`).
- **Trạng thái:** MVP.

<a id="uc08"></a>
#### UC08 — Offboard Employee · Xử lý nhân viên nghỉ việc

- **Mục tiêu / giá trị:** người đã rời công ty không còn quyền truy cập — vừa là chi phí vừa là lỗ hổng bảo mật (G2).
- **Actor:** chính A03 IT Admin; hỗ trợ A02 Manager (xác nhận bàn giao).
- **Trigger:** IT chuyển nhân viên sang *đang bàn giao* với ngày làm việc cuối, hoặc thẳng *đã nghỉ việc*. Trong lúc *đang bàn giao* IT cũng có thể **đổi ngày làm việc cuối** hoặc **hủy bàn giao** (`QĐ-48a`→`QĐ-48c`, `US-03-04` AC-14, AC-15) — hai thao tác này thuộc UC08, không phải [UC07](#uc07) và không có use case riêng.
- **Extension point:** **Reclaim Access** — sau khi nhân viên chuyển *đã nghỉ việc*.
- **Luồng chính:** (1) hệ thống liệt kê seat, thiết bị, ứng dụng người đó làm Business Owner; (2) gửi Manager danh sách bàn giao, **hạn 1 ngày làm việc trước ngày cuối** (`BR-05.6`), gửi IT danh sách thu hồi; (3) Manager xác nhận bàn giao; (4) nhân viên chuyển *đã nghỉ việc* — **lát S0: IT chuyển bằng tay; lát S2: hệ thống tự chuyển khi tới ngày cuối** (`QĐ-41a`; ở S0 qua ngày cuối mà chưa chuyển thì chưa thu hồi, chưa sinh G2, tài khoản vẫn dùng được — `US-03-04` AC-10, AC-12) — rồi hệ thống sinh G2 mức cần xử lý, không qua Manager (`BR-05.1`, `BR-05.2`); (5) **[Reclaim Access]** nếu còn seat → [UC22](#uc22) thu hồi (EX05), thu hồi hàng loạt phải gõ số lượng và lý do chung (`BR-05.4`); (6) **sau khi đã nghỉ việc** — không phải lúc bắt đầu bàn giao — hết hiệu lực đăng ký thiết bị (`BR-45.7`, `US-09-08`); gắn cờ *cần thay thế* cho ứng dụng người đó làm Business Owner (`BR-06.7`); xác định lại người duyệt các bước người đó đang giữ (`FR-3.16`); lên lịch xóa log chi tiết 30 ngày (`BR-05.5`, `BR-41.x`).
- **Luồng thay thế/lỗi:** nghỉ đột ngột → *đã nghỉ việc* ngay; Manager chưa xác nhận bàn giao → nhắc, tới ngày cuối **vẫn thu hồi** và ghi cờ; nhà cung cấp không xóa tự động → việc thủ công trong cùng hàng đợi; thu hồi lỗi → tác vụ còn mở, UC08 chưa đóng. *(05/10/2026 — `QĐ-48a`→`QĐ-48c`)* **Đổi ngày làm việc cuối:** chỉ IT Admin, chỉ khi hôm nay ≤ ngày cuối hiện tại, ngày mới ≥ max(hôm nay, ngày vào), **bắt buộc lý do**; ánh xạ quản lý kế nhiệm mang sang ngày sau ngày mới và được kiểm lại — cấp dưới thiếu kế nhiệm hợp lệ → từ chối kèm danh sách, không ghi gì; đã qua ngày cuối → từ chối, chỉ còn hủy hoặc cho *đã nghỉ việc*. **Hủy bàn giao:** bất kỳ lúc nào trước *đã nghỉ việc*, bắt buộc lý do; ánh xạ chưa hiệu lực bị hủy, ánh xạ đã hiệu lực (ngày ≤ hôm nay, kể cả kế nhiệm *không có quản lý*) được giữ và vẫn hiện hành — cấp dưới **không** tự trả về, IT đổi quản lý có ngày hiệu lực qua [UC07](#uc07) nếu cần; hủy không thu hồi, không sinh G2. **Từ chối chung:** nhân viên không đang bàn giao hoặc đã *đã nghỉ việc*, phiên bản hồ sơ lỗi thời, thiếu lý do — không ghi gì.
- **Hậu điều kiện:** thành công — không còn Assignment hiệu lực, thiết bị hết hiệu lực, xóa dữ liệu đã lên lịch; thất bại — quyền còn tồn được liệt kê, chưa đóng. Nhánh đổi ngày: nhân viên vẫn *đang bàn giao* với ngày mới, Audit Trail ghi ngày cũ/mới, ánh xạ và lý do. Nhánh hủy: nhân viên không còn *đang bàn giao*; kế nhiệm đã hiệu lực còn nguyên; UC08 kết thúc mà không có thu hồi.
- **Quan hệ:** được [UC22](#uc22) «extend» tại *Reclaim Access* khi `[departing employee still holds an active or pending seat]` (EX05).
- **Trạng thái:** MVP — OWNER DECISION 25/09/2026 cho hạn bàn giao (OI-14c) và Business Owner nghỉ việc (OI-05c); 05/10/2026 thêm đổi ngày và hủy bàn giao (`QĐ-48a`→`QĐ-48c`, Owner chốt qua prompt phiên; chưa phải xác nhận GVHD).

### 4.3. Danh mục, hợp đồng, thuê bao

<a id="uc09"></a>
#### UC09 — Manage SaaS Catalog · Quản lý danh mục SaaS

- **Mục tiêu / giá trị:** một danh mục ứng dụng được phép, đủ thông tin để quản trị, định tuyến và nhận diện.
- **Actor:** chính A03 IT Admin.
- **Trigger:** ứng dụng được quyết đưa vào danh mục ([UC16](#uc16) nhánh c, [UC43](#uc43) duyệt), khởi tạo ([UC06](#uc06)), cần cập nhật, hoặc đề xuất ngừng sử dụng.
- **Precondition:** P-AUTH; SaaS mới phải có quyết định hợp lệ (trừ dữ liệu khởi tạo).
- **Luồng chính (tạo/xem/sửa/ngừng dùng):** khai báo nhà cung cấp, sản phẩm, gói với **mô hình giá** (`FR-1.2`), tên miền, mức nhạy cảm, **Business Owner đang làm việc** (`BR-06.1`), cờ nhóm liên lạc (`FR-1.8`), **nhóm chức năng** (`BR-06.9`); duy trì từ điển nhà cung cấp dùng chung và danh sách cho phép (`FR-6.2`); chuyển *ngừng sử dụng*: kiểm tra quyền còn hiệu lực và **ghi xác nhận của Business Owner** (`BR-06.6`).
- **Luồng thay thế/lỗi:** thiếu Business Owner/trường bắt buộc → chưa lưu; Business Owner nghỉ việc → giữ người cũ + cờ *cần thay thế*, cảnh báo IT (`BR-06.7`); gói không per-seat → phân hệ lãng phí hiện "không áp dụng" (`BR-06.4`); nhóm liên lạc mặc định không thu hoạt động (`BR-06.2`, `BR-06.3`).
- **Hậu điều kiện:** mục danh mục đủ điều kiện quản trị; lịch sử giữ.
- **Quyền và BR:** IT không tự hợp thức hóa ứng dụng ngoài danh mục (`DQ-06`).
- **Trạng thái:** MVP — OWNER DECISION 25/09/2026 (OI-05b, OI-05c, OI-14e).

<a id="uc10"></a>
#### UC10 — Manage Contracts and Subscriptions · Quản lý hợp đồng và thuê bao

- **Mục tiêu / giá trị:** biết số lượng, giá, kỳ, hạn báo hủy và lịch sử từng kỳ — nền của cảnh báo gia hạn (PP-2) và mọi con số chi phí.
- **Actor:** chính A03 IT Admin; hỗ trợ A11 Exchange Rate Service.
- **Trigger:** có hợp đồng/thuê bao đã được quyết; có quyết định gia hạn/giảm/hủy từ [UC30](#uc30); cần sửa dữ liệu có căn cứ.
- **Luồng chính (tạo/xem/sửa, ghi kỳ mới):** (1) ghi Contract, Subscription (số seat, đơn giá, chu kỳ, ngày gia hạn, **hạn chót báo hủy**, tự gia hạn, cho giảm giữa kỳ — `FR-1.3`), Invoice riêng (`ADR-06`); (2) đính kèm tệp gốc, truy cập qua đường dẫn có thời hạn (`BR-06.8`); (3) lưu tiền kèm loại tiền, tỷ giá và ngày tỷ giá (`FR-1.6`, `INV-04`); (4) khi có quyết định gia hạn: tạo **kỳ mới** nối chuỗi, không ghi đè kỳ cũ (`BR-27.1`), chuyển Assignment trong cùng giao dịch, ghi tiết kiệm thật chỉ khi số seat giảm (`BR-27.2`); hủy → kiểm tra quyền còn hiệu lực, cảnh báo người đang dùng (`BR-27.3`).
- **Luồng thay thế/lỗi:** thiếu hạn báo hủy → cảnh báo, giá trị suy ra phải gắn nhãn (`FR-1.4`); không có tỷ giá → nhập tay có nguồn; quyết định **giảm dưới số Assignment** → phần vượt phải được thu hồi ([UC22](#uc22)) trước ngày bắt đầu kỳ mới, kỳ mới chỉ ghi khi số Assignment ≤ số mua (`BR-27.5`, `INV-01`); thay đổi phía nhà cung cấp chưa xác nhận → không ghi tiết kiệm.
- **Hậu điều kiện:** nghĩa vụ và hồ sơ đúng thực tế, có lịch sử kỳ.
- **Trạng thái:** MVP — OWNER DECISION 25/09/2026 (OI-11c).

### 4.4. Yêu cầu, quyết định và thực thi

<a id="uc11"></a>
#### UC11 — Request Software Access · Yêu cầu quyền sử dụng phần mềm

- **Mục tiêu / giá trị:** có đúng công cụ để làm việc bằng đường chính thức, nhanh hơn đường tắt (PP-5).
- **Actor:** chính A01 Employee; A02 Manager dùng UC này cho chính mình (kế thừa) **và** tạo hộ nhân viên mới trực thuộc, gia hạn quyền có thời hạn cho nhà thầu trực thuộc (`FR-3.2`, `BR-02.1`, `US-03-05`).
- **Trigger:** có nhu cầu công việc; onboarding; quyền có thời hạn sắp hết.
- **Precondition:** P-AUTH; người thụ hưởng đang làm việc hoặc sắp vào làm.
- **Luồng chính (gửi, theo dõi, rút):** (1) chọn ứng dụng trong danh mục hoặc mô tả SaaS mới; nhập lý do, Cost Center/dự án, thời hạn; (2) hệ thống hiện chi phí ước tính, chuỗi người duyệt, thời gian dự kiến — bước này không được bỏ (`BR-07.1`); (3) gửi → **chốt cứng** nhánh và chuỗi loại bước (`BR-07.2`), định tuyến (a)/(b)/(c) (`FR-3.4`), tạo bước cho [UC14](#uc14), [UC15](#uc15), [UC16](#uc16); (4) người gửi theo dõi trạng thái và nhận thông báo trong ứng dụng (`FR-3.11`, `BR-42.7`); (5) có thể **rút** khi tác vụ cấp phát còn *chờ thực thi* (`BR-07.11`).
- **Luồng thay thế/lỗi:** đã có quyền hiệu lực trên cùng thuê bao → chặn ở bước 1 (`BR-07.3`); thời hạn trên 12 tháng hoặc gia hạn liên tiếp trên 12 tháng → cần **xác nhận tường minh của Manager** ở UC14 (`BR-07.4`, `BR-15.1`, `BR-39.4`); nhà thầu/thực tập sinh bắt buộc ngày kết thúc (`BR-39.1`); người yêu cầu là Manager → bước nhu cầu chuyển lên cấp trên, Manager tạo hộ không tự duyệt bước của mình (`BR-02.2`, `FR-3.3`); người chưa tới ngày vào làm → quyền không hiệu lực trước ngày vào (`BR-02.3`); không còn người duyệt hợp lệ → chờ có kiểm soát (`FR-3.12`); rút sau khi IT **đã bắt đầu** thực thi → không cho, dùng [UC13](#uc13) sau khi có quyền; rút khi đã có khoản cam kết → cam kết được giải phóng ngay, Finance và IT được báo; cấp phát thất bại → người yêu cầu được báo (`BR-12.5`).
- **Hậu điều kiện:** Request có nhánh, người yêu cầu/người thụ hưởng, lịch sử; rút → trạng thái *Cancelled*; gửi thành công **không** có nghĩa đã cấp quyền.
- **Quyền và BR:** `SoD-4`, `INV-08`.
- **Trạng thái:** MVP — OWNER DECISION 25/09/2026 (OI-06, OI-07a, OI-09b).

<a id="uc13"></a>
#### UC13 — Return Software Access · Hoàn trả quyền sử dụng

- **Mục tiêu / giá trị:** nhả license không còn cần để tái dùng hoặc giảm ở kỳ gia hạn.
- **Actor:** chính A01 Employee.
- **Trigger:** nhân viên không còn cần một quyền đang giữ.
- **Luồng chính:** (1) chọn quyền của mình, nêu lý do; (2) hệ thống ghi yêu cầu hoàn trả làm **nguồn quyết định** và tạo tác vụ thu hồi — **không có bước duyệt** (BRD 5.10, `F-14`; OQ-US-15 đóng theo nguồn); (3) IT thực hiện [UC22](#uc22); (4) nhân viên thấy kết quả khi IT xác nhận.
- **Luồng thay thế/lỗi:** tài khoản thật chưa xóa → seat chưa nhả (`BR-14.2`); gửi yêu cầu ≠ nhà cung cấp đã thu hồi.
- **Quyền và BR:** mọi thu hồi gắn một nguồn quyết định (`BR-14.1`).
- **Trạng thái:** MVP.

<a id="uc14"></a>
#### UC14 — Review Access Need · Xác nhận nhu cầu

- **Mục tiêu / giá trị:** người hiểu công việc quyết nhu cầu — tách khỏi quyết tiền và thực thi.
- **Actor:** chính A02 Manager (kể cả approver dự phòng ở gốc, `QĐ-02`).
- **Trigger:** bước xác nhận nhu cầu được giao cho Manager.
- **Precondition:** P-AUTH; đúng người được giao; không phải người yêu cầu (`SoD-4`).
- **Luồng chính:** (1) xem yêu cầu, quyền người đó đang giữ và **công cụ cùng nhóm chức năng** (`BR-06.9`), usage tổng hợp (không log thô, `FR-3.7`); (2) duyệt hoặc từ chối — từ chối **bắt buộc lý do** (`BR-07.5`); thời hạn trên 12 tháng phải **tích xác nhận riêng kèm lý do** (`BR-07.4`); (3) hệ thống ghi quyết định, tiếp tục nhánh đã chốt: nhánh (a) đi thẳng tới IT ([UC21](#uc21), `QĐ-29a`), nhánh (b) tới [UC55](#uc55)/[UC16](#uc16), nhánh (c) tới [UC15](#uc15).
- **Luồng thay thế/lỗi:** quá SLA (giờ làm việc, mặc định 2 ngày — `BR-13.11`) → nhắc và **thông báo** cấp trên, **không** đổi người, không tự duyệt (`BR-07.7`, `BR-13.8`); dữ liệu tổ chức đổi thật → xác định lại người, SLA không đặt lại (`BR-13.2`, `BR-13.9`); không còn người hợp lệ → chờ có kiểm soát (`BR-13.6`); Manager trực tiếp cũng là Người duyệt chi → hai bước riêng, nhật ký gắn cờ (`BR-07.8`); người gọi không phải người được giao → từ chối (`BR-13.4`).
- **Hậu điều kiện:** quyết định nhu cầu truy vết được (từ chối hợp lệ cũng là hoàn tất); lỗi → bước vẫn chờ.
- **Trạng thái:** MVP — OWNER DECISION 25/09/2026 (OI-07a, OI-14a, OI-14e).

<a id="uc15"></a>
#### UC15 — Assess New SaaS · Đánh giá SaaS mới

- **Mục tiêu / giá trị:** người quyết chi có căn cứ kỹ thuật/rủi ro trước khi thêm một nơi dữ liệu công ty tồn tại.
- **Actor:** chính A03 IT Admin.
- **Trigger:** yêu cầu nhánh (c) đã qua bước nhu cầu.
- **Luồng chính:** (1) kiểm tra trùng chức năng theo **nhóm chức năng** trong danh mục (`BR-06.9`), dữ liệu chạm tới, giá, khả năng vận hành; (2) với ứng dụng chạm dữ liệu nhạy cảm cao, **ghi ý kiến** của Business Owner ứng dụng tương đương (nếu có) hoặc Manager của người yêu cầu — **đầu vào không chặn**, thiếu thì ghi rõ (`BR-09.3`, OI-05a); (3) lưu đánh giá và đề xuất cho [UC55](#uc55)/[UC16](#uc16).
- **Luồng thay thế/lỗi:** công ty đã có công cụ tương đương → đề xuất *không duyệt* là kết quả tích cực, hướng người yêu cầu sang công cụ có sẵn (`BR-09.2`); thiếu thông tin → nêu rõ thiếu gì.
- **Hậu điều kiện:** có đánh giá; **chưa** có quyết định hay quyền.
- **Quyền và BR:** đánh giá và thực thi là hai vai khác nhau của IT (`BR-09.1`); IT không quyết đưa SaaS vào phạm vi công ty (`QĐ-22`, `SoD-5`).
- **Trạng thái:** MVP — OWNER DECISION 25/09/2026 (OI-05a).

<a id="uc55"></a>
#### UC55 — *Decide Spending Matter* · Quyết định vấn đề chi tiêu *(UC trừu tượng)*

- **Mục tiêu / giá trị:** mọi thay đổi tiền hoặc danh mục SaaS được một người có thẩm quyền quyết, trên thông tin ngân sách, không biến Finance thành cửa duyệt.
- **Actor:** chính A05 Spending Approver (association đặt ở UC cha, các UC con kế thừa).
- **Bản chất:** UC **trừu tượng** — không thực hiện trực tiếp; mỗi lần quyết là một trong [UC16](#uc16), [UC30](#uc30), [UC43](#uc43) (§9.2.3.2).
- **Extension point:** **Assess Budget** — sau khi xem snapshot, trước khi ghi quyết định.
- **Hành vi chung mà UC con kế thừa:** (1) mở hồ sơ được giao (Request, kỳ thuê bao, hoặc finding) kèm đánh giá của IT; (2) xem **snapshot ngân sách** của **Cost Center và kỳ** liên quan: ngân sách · thực chi · cam kết đang giữ · còn lại · tổng Request có chi phí đang chờ trong **cùng Cost Center và kỳ** · thời điểm dữ liệu — chưa có ngân sách hiện *Chưa có ngân sách*, không hiện 0 (`FR-3.14` (1), `BR-36.8`); (3) **[Assess Budget]** tùy chọn hỏi Finance ([UC17](#uc17)); (4) được mở **tệp gốc hợp đồng/hóa đơn của chính hồ sơ này** (`BR-06.8`, OI-08a); (5) ghi quyết định và lý do (bắt buộc khi từ chối); snapshot được chụp lại làm bằng chứng.
- **Luồng thay thế/lỗi chung:** hỏi Finance **không** dừng/đặt lại SLA; quyết được khi Finance chưa trả lời (`BR-07.9`); quá SLA → nhắc, không đổi người, không ủy quyền (`BR-13.8`, `BR-13.11`); Người duyệt chi là người yêu cầu/thụ hưởng → bước tạo thẳng cho **người thay thế cấu hình trước** (`BR-13.10`, `FR-3.15`); chưa cấu hình → chờ có kiểm soát; vượt ngân sách **không chặn** quyết định (`BR-36.3`).
- **Quyền và BR:** `SoD-7`, `SoD-8`; không cấp/thu hồi.
- **Quan hệ:** cha của UC16, UC30, UC43 (GU01–GU03); được [UC17](#uc17) «extend» tại *Assess Budget* (EX04).
- **Trạng thái:** MVP (UC mới của mô hình; hành vi lấy nguyên từ `FR-3.13`, `FR-3.14`, `FR-3.4c-1`, `BR-27.4`) — OWNER DECISION 25/09/2026 cho phạm vi snapshot (OI-11d) và quyền mở tệp gốc (OI-08a).

<a id="uc16"></a>
#### UC16 — Decide Spending Request · Quyết định yêu cầu có chi phí

- **Mục tiêu / giá trị:** duyệt hoặc từ chối yêu cầu mua thêm/nâng gói/SaaS mới theo thẩm quyền.
- **Actor:** A05 Spending Approver (kế thừa từ UC55).
- **Trigger:** Request nhánh (b) sau bước nhu cầu, hoặc nhánh (c) sau đánh giá IT; hoặc hết seat giữa luồng chèn thêm bước này (`BR-07.6`).
- **Luồng chính:** hành vi chung của UC55, cộng: duyệt Request **có chi phí** → hệ thống tạo **đúng một khoản cam kết** gắn Request và Cost Center (`INV-16`, `BR-36.1`, `BR-07.10`), rồi mở song song: Finance ghi nhận ([UC20](#uc20)) ∥ IT cấp ([UC21](#uc21)).
- **Luồng thay thế/lỗi:** từ chối → không tạo cam kết; SaaS mới **miễn phí** vẫn phải qua bước này nhưng không có snapshot/cam kết (`BR-09.4`); chưa có ngân sách → vẫn tạo cam kết mang lý do *Chưa có ngân sách* (`BR-36.5`, `FR-5.8a`); nhánh (a) không có bước này (`QĐ-29a`).
- **Hậu điều kiện:** quyết định và snapshot được lưu; duyệt có phí thì có cam kết.
- **Quan hệ:** chuyên biệt hóa UC55 (GU01); kế thừa extension point *Assess Budget*.
- **Trạng thái:** MVP.

<a id="uc30"></a>
#### UC30 — Decide Subscription Renewal · Quyết định gia hạn thuê bao

- **Mục tiêu / giá trị:** quyết giữ nguyên, giảm hay hủy cho kỳ tới **trước hạn báo hủy** — nơi tiền tiết kiệm trở thành thật (KB-3).
- **Actor:** A05 Spending Approver (kế thừa từ UC55).
- **Trigger:** kỳ thuê bao sắp tới hạn báo hủy ([UC29](#uc29)).
- **Luồng chính:** hành vi chung của UC55, cộng: xem số seat kỳ này/kỳ trước, khuyến nghị lãng phí đang mở, tiết kiệm tại kỳ gia hạn; quyết *gia hạn nguyên trạng / giảm / hủy* (`BR-27.4`); IT ghi kết quả ở [UC10](#uc10).
- **Luồng thay thế/lỗi:** quyết **giảm dưới số Assignment đang hiệu lực** → hệ thống liệt kê phần vượt (ưu tiên khuyến nghị đang mở) để IT thu hồi trước kỳ mới (`BR-27.5`); qua hạn báo hủy chưa quyết + tự gia hạn → sự cố KPI-4; không tự gia hạn → hết hạn, không phải sự cố (`BR-26.3`, `DQ-07`); quyết hủy không tự làm mất quyền bên nhà cung cấp.
- **Hậu điều kiện:** có quyết định truy vết được trước hạn báo hủy.
- **Quan hệ:** chuyên biệt hóa UC55 (GU02).
- **Trạng thái:** MVP — OWNER DECISION 25/09/2026 (OI-11c).

<a id="uc43"></a>
#### UC43 — Decide SaaS Legitimization · Quyết định hợp thức hóa SaaS

- **Mục tiêu / giá trị:** đưa phần mềm ngoài danh mục vào diện quản trị đúng thẩm quyền, không kết tội người dùng.
- **Actor:** A05 Spending Approver (kế thừa từ UC55). IT Admin **không** nối UC này: hồ sơ và đánh giá kỹ thuật do IT lập ở [UC42](#uc42), kết quả do IT thực thi ở [UC09](#uc09)/[UC21](#uc21)/[UC22](#uc22) — cùng cách UC16 dựa trên [UC15](#uc15) và [UC21](#uc21).
- **Trigger:** finding đã được điều tra ([UC42](#uc42)); khớp nhà cung cấp mức tin cậy thấp đã được người xác nhận.
- **Luồng chính:** hành vi chung của UC55, cộng: chọn một trong ba kết cục (`DQ-06`, `FR-3.4c-1`): **báo nhầm** → đóng, mở lại nếu tái xuất hiện; **không duyệt** → IT thu hồi/hướng sang công cụ có sẵn ([UC22](#uc22)); **duyệt hợp thức hóa** → IT đưa vào danh mục ([UC09](#uc09)) và ghi người đang dùng thành quyền chính thức ([UC21](#uc21)) mà họ **không** phải xin lại (`BR-34.2`), **không** duyệt chi lần hai.
- **Luồng thay thế/lỗi:** *không duyệt* và *báo nhầm* **bắt buộc lý do** (`BR-34.3`); ứng dụng có chi phí → khoản cam kết theo quy tắc chung; *không duyệt* không tự thu hồi khi IT chưa thao tác.
- **Hậu điều kiện:** mọi việc thực hiện truy về **đúng một** quyết định chi.
- **Quyền và BR:** IT không quyết (`SoD-5`); Finance, Super Admin không duyệt; "đã duyệt" là kết cục tích cực (`BR-34.1`).
- **Quan hệ:** chuyên biệt hóa UC55 (GU03).
- **Trạng thái:** MVP — `DQ-06` (mentor/GVHD xác nhận 21/09/2026); OWNER DECISION 25/09/2026 cho lý do bắt buộc (OI-14g).

<a id="uc58"></a>
#### UC58 — Decide Unbased Software Charge · Quyết định khoản chi phần mềm chưa có căn cứ *(mô hình đầy đủ; chưa vẽ)*

> **Vì sao là UC riêng (H3, Owner chọn 30/09/2026):** [UC43](#uc43) quyết **hợp thức hóa một ứng dụng**; UC58 quyết **một khoản tiền** của nhà cung cấp có thể đã được duyệt. Chuyên biệt hóa [UC55](#uc55) như UC16/UC30/UC43 — kế thừa snapshot ngân sách, *Assess Budget* và luật người thay thế. **Không vẽ** trên sơ đồ gốc và bản edited.

- **Mục tiêu / giá trị:** khoản chi không có căn cứ phê duyệt được **người có thẩm quyền chi** chấp nhận hoặc không chấp nhận, truy vết được, không kéo theo khoản chi khác.
- **Actor:** A05 Spending Approver (kế thừa từ UC55). **Không** association của Finance hay IT Admin: họ chuyển hồ sơ ở [UC57](#uc57), không quyết.
- **Trigger:** Finance hoặc IT chuyển một ngoại lệ đối soát ([UC57](#uc57)); khoản chi xuất hiện ở hàng đợi duyệt chi (`APV-01`).
- **Luồng chính:** hành vi chung của UC55, cộng: xem khoản chi, căn cứ đã thử, lý do ngoại lệ, ghi chú của Finance/IT; quyết **chấp nhận** → hệ thống tạo nhiệm vụ cho Finance *ghi căn cứ phê duyệt cho khoản chi* hoặc **không chấp nhận** (lý do **bắt buộc**) → nhiệm vụ cho IT *theo dõi khoản chi bị từ chối*.
- **Luồng thay thế/lỗi:** Người duyệt chi là **người giữ thẻ** của khoản chi → chỉ **người thay thế cấu hình trước** quyết (`SoD-7`, `FR-3.15`); ngoại lệ chưa được chuyển → không quyết được (`INVALID_TRANSITION`); kết cục **không** tự thu hồi, tự đăng ký thuê bao hay tự đòi tiền. *(30/09/2026 đêm — `QĐ-35a`)* SLA theo `BR-13.11` với loại bước riêng, tính từ lúc mục được **chuyển**; hỏi Finance không dừng đồng hồ; quá hạn → nhắc và thông báo cấp trên, **không** tự quyết (`BR-13.8`); đổi người giữ vai không đặt lại tuổi SLA (`BR-13.2`).
- **Hậu điều kiện:** khoản chi có quyết định chi truy vết được; các khoản chi khác của cùng nhà cung cấp giữ nguyên trạng thái.
- **Quan hệ:** chuyên biệt hóa UC55 *(mô hình đầy đủ, chưa vẽ)*; kế thừa extension point *Assess Budget*.
- **Truy vết:** `FR-3.4c-1`, `DQ-06`, `SoD-7`, `FR-3.15`, `QĐ-33b`, `QĐ-35a`, `BR-13.11`, `US-13-07` AC-5, AC-11, `US-05-09` AC-7, `WF-17` nhánh `rd1`, `UF-12` (`APV-01` → `APV-02`), test prototype `DC-28`, `DC-29`, `M2-48`.
- **Trạng thái:** MVP — `QĐ-33b`; tạo UC58 — Owner chọn phương án H3 ngày 30/09/2026. **Chưa phải xác nhận của GVHD.**

<a id="uc17"></a>
#### UC17 — Request Budget Information · Hỏi thông tin ngân sách

- **Mục tiêu / giá trị:** người quyết bổ sung căn cứ ngân sách mà **không** tạo thêm cửa duyệt.
- **Actor:** thực hiện bởi A05 Spending Approver **trong** lần thực hiện của UC cơ sở (không có association riêng — tương tác đi qua UC55).
- **Điều kiện mở rộng:** `[matter has a cost and the approver chooses to ask Finance]` tại *Assess Budget* của UC55.
- **Luồng (phần chèn vào):** (1) ghi câu hỏi gắn hồ sơ quyết định; (2) hệ thống giao yêu cầu thông tin cho Finance (người khác người quyết, `SoD-8`); (3) quay lại UC cơ sở — người duyệt có thể quyết ngay.
- **Luồng thay thế/lỗi:** gửi lỗi → báo lỗi, không khóa bước duyệt chi; hồ sơ bị rút → yêu cầu thông tin đóng theo (BRD 5.3).
- **Quan hệ:** «extend» UC55 (EX04), do đó mở rộng cả UC16, UC30, UC43.
- **Trạng thái:** MVP — `QĐ-29b`, `QĐ-30a`.

<a id="uc21"></a>
#### UC21 — Provision Software Access · Cấp quyền sử dụng

- **Mục tiêu / giá trị:** người được duyệt có quyền **thật** phía nhà cung cấp, được xác nhận.
- **Actor:** chính A03 IT Admin; hỗ trợ A08 SaaS Provider (khi có connector).
- **Trigger:** công việc cấp phát đủ quyết định: nhánh (a) sau UC14, (b)/(c) sau UC16, hợp thức hóa sau UC43.
- **Luồng chính:** (1) IT nhận việc, giữ chỗ seat (`BR-10.4`); (2) tạo tác vụ thực thi với khóa chống gọi trùng (`BR-10.2`) qua connector hoặc thủ công — cùng một hàng đợi, cùng cách đo (`BR-10.3`); (3) xác nhận kết quả: thủ công phải có tên người thật xác nhận (`BR-10.1`); (4) chỉ khi quyền thật thành công mới hoàn tất, báo người nhận trong ứng dụng.
- **Luồng thay thế/lỗi:** lời mời *pending* chưa là hoàn tất, vẫn chiếm chỗ (BRD 5.12.3); lỗi tạm thời thử lại, lỗi vĩnh viễn không thử lại vô ích (`BR-12.1`); thất bại nằm trong hàng đợi tới khi có người quyết (`BR-12.2`), quá 7 ngày nổi lên mục nợ (`BR-12.3`), thông báo lỗi tiếng Việt (`BR-12.4`), người yêu cầu cũng được báo (`BR-12.5`); hết seat làm đổi chi phí → quay đúng nhánh duyệt, không âm thầm mua thêm (`BR-07.6`); trùng quyền hiệu lực → chặn (`BR-07.3`, `INV-02`).
- **Hậu điều kiện:** quyền thật xác nhận, Assignment phù hợp; pending/lỗi giữ trạng thái và dấu vết.
- **Quyền và BR:** chỉ IT thay đổi seat, sau khi đủ quyết định (`SoD-5`); không tự động cấp chỉ vì cảnh báo (`SoD-6`); `INV-01`.
- **Trạng thái:** MVP; connector thật chỉ GitHub (`QĐ-03`) — điều kiện token/owner còn phải xác minh (sổ quyết định, phụ thuộc 2).

<a id="uc22"></a>
#### UC22 — Revoke Software Access · Thu hồi quyền sử dụng

- **Mục tiêu / giá trị:** quyền không còn căn cứ bị gỡ thật, seat được nhả đúng lúc, tiết kiệm được ghi đúng loại.
- **Actor:** chính A03 IT Admin; hỗ trợ A08 SaaS Provider.
- **Trigger:** có nguồn quyết định: nghỉ việc ([UC08](#uc08)), hoàn trả ([UC13](#uc13)), Reclaim cuối cùng của Manager ([UC28](#uc28)), Shadow IT không duyệt ([UC43](#uc43)), phần vượt khi giảm seat ở kỳ mới (`BR-27.5`), quyền có thời hạn hết hạn.
- **Luồng chính:** (1) IT nhận việc, kiểm tra nguồn quyết định (`BR-14.1`); (2) thực thi qua connector/thủ công như UC21; (3) xác nhận quyền thật đã mất; (4) kết thúc Assignment, nhả seat **chỉ sau** khi tài khoản thật bị xóa hoặc IT xác nhận không cần xóa (`BR-14.2`); (5) ghi tiết kiệm **thực tế** đúng loại (`BR-22.2`, `FR-4.15`).
- **Luồng thay thế/lỗi:** thu hồi chỉ có success/failed (không *pending*); lỗi không giải phóng seat giả; với khuyến nghị lãng phí, IT thực thi **quyết định cuối của Manager** sau tối đa một lần trả lại (`BR-22.1`, OI-02); quyền nhà thầu tới hạn không tự thu hồi (`BR-39.2`); thu hồi hàng loạt khi offboarding cần gõ số lượng và lý do (`BR-05.4`).
- **Hậu điều kiện:** quyền thật mất, seat tái dùng được; lỗi → rủi ro còn hiển thị, không ghi tiết kiệm.
- **Quan hệ:** «extend» [UC08](#uc08) tại *Reclaim Access* khi `[departing employee still holds an active or pending seat]` (EX05); cũng là UC độc lập cho các nguồn khác.
- **Trạng thái:** MVP.

### 4.5. Ngân sách và chi phí

<a id="uc20"></a>
#### UC20 — Control Budgets and Commitments · Kiểm soát ngân sách và khoản cam kết

- **Mục tiêu / giá trị:** biết tiền đã chi, đã hứa chi, còn lại theo Cost Center và kỳ — Finance kiểm soát mà không là cửa duyệt.
- **Actor:** chính A04 Finance; hỗ trợ A11 Exchange Rate Service.
- **Trigger:** đầu kỳ ngân sách; câu hỏi từ [UC17](#uc17); khoản cam kết mới sau [UC16](#uc16); hóa đơn đối soát khớp; Request bị rút/thất bại.
- **Luồng chính (thao tác):** (1) **lập/sửa ngân sách** theo Cost Center và kỳ (loại kỳ `BR-36.8`) — nhập tay hoặc nạp file qua [UC54](#uc54); hệ thống lưu tỷ giá tại ghi nhận; xem ngân sách · thực chi · cam kết đang giữ · còn lại cạnh nhau (`BR-29.7`); (2) **trả lời hỏi ngân sách**: *Trong hạn mức / Vượt hạn mức / Chưa có ngân sách* + ghi chú — không duyệt, không chặn (`BR-07.9`); (3) **ghi nhận chính thức** trên khoản cam kết hệ thống vừa tạo, song song IT cấp phát; (4) theo dõi vòng đời cam kết: trừ dần theo từng hóa đơn khớp (`BR-36.7`), *Đã thành chi phí* khi hết, *Đã giải phóng* khi Request bị rút/thất bại (`BR-07.10`, `BR-07.11`), giải phóng phần dư kèm lý do.
- **Luồng thay thế/lỗi:** ghi nhận *Vượt hạn mức/Chưa có ngân sách* → thông báo Người duyệt chi, **không** hoàn tác quyết định, **không** dừng cấp phát (`FR-3.14` (3)); ngân sách lập sau → tự gắn ngược cam kết chưa có ngân sách của đúng Cost Center và kỳ (`BR-36.5`); số còn lại có thể âm, có nhãn (`BR-36.6`); không tạo ngân sách 0 giữ chỗ; cam kết không chuyển ngược từ *Đã thành chi phí* (`BR-36.2`); Finance chưa trả lời khi bước duyệt chi quá SLA → chỉ nhắc/cảnh báo.
- **Hậu điều kiện:** ngân sách và cam kết phản ánh đúng thực chi/hứa chi; không trừ hai lần.
- **Quyền và BR:** không quyết/chặn chi, không thao tác kỹ thuật (`SoD-3`); người trả lời/ghi nhận khác người quyết cùng Request (`SoD-8`); `INV-16`, `INV-18`.
- **Trạng thái:** MVP — `QĐ-29b`, `QĐ-30b`; OWNER DECISION 25/09/2026 (OI-11a, OI-11b).

<a id="uc32"></a>
#### UC32 — Reconcile Invoices · Đối soát hóa đơn

- **Mục tiêu / giá trị:** mỗi khoản chi thực quy về đúng phần mềm, thuê bao, đơn vị (PP-3); chênh lệch được giải thích.
- **Actor:** chính A04 Finance; hỗ trợ A11 Exchange Rate Service.
- **Trigger:** nhận hóa đơn hoặc đến kỳ đối soát.
- **Luồng chính:** (1) nạp file hóa đơn qua **[UC54](#uc54)** («include» IN03); (2) ghép dòng về thuê bao/hợp đồng (Invoice có thể chưa liên kết Contract — `QĐ-19`), quy đổi theo tỷ giá ngày giao dịch (`FR-5.6`); (3) so **số seat trên hóa đơn · số seat khai trong thuê bao · số seat đang dùng** — không cái nào bị tự sửa (`BR-35.1`); (4) chênh lệch → bản ghi mâu thuẫn, quy về một trong ba nguyên nhân (`BR-35.2`), giữ cả hai giá trị (`BR-43.1`), có người chịu trách nhiệm, không tự đóng (`BR-43.2`, `BR-43.3`); (5) khoản cam kết tương ứng trừ dần theo số tiền (`BR-36.7`); (6) khi cần, mở tệp gốc hợp đồng/hóa đơn (`BR-06.8`).
- **Luồng thay thế/lỗi:** dòng không ghép được → chi phí ngoài danh mục, có thể thành bằng chứng Shadow IT ([UC42](#uc42)); lỗi một dòng không làm hỏng file (`BR-17.7`).
- **Hậu điều kiện:** chi phí ghi nhận có căn cứ; khoản chưa khớp còn mở.
- **Quyền và BR:** Finance không xem usage thô; không sửa quyền thật (`SoD-3`).
- **Quan hệ:** «include» [UC54](#uc54) (IN03).
- **Trạng thái:** MVP — OWNER DECISION 25/09/2026 (OI-11a).

<a id="uc33"></a>
#### UC33 — Manage Cost Centers and Allocations · Quản lý Cost Center và phân bổ chi phí

- **Mục tiêu / giá trị:** mọi chi phí có đơn vị chịu; gói dùng chung chia đúng tỷ lệ.
- **Actor:** chính A04 Finance.
- **Trigger:** thiết lập ban đầu (trước khi IT nhập nhân sự); đơn vị/dự án mới; gói dùng chung cần phân bổ.
- **Luồng chính (tạo/xem/sửa/ngừng dùng):** (1) quản lý **danh mục Cost Center** `Unit`/`Project`/`Company` (`BR-29.9`, OI-04); (2) khai báo phân bổ gói dùng chung theo tỷ lệ và khoảng hiệu lực — tổng **100%** (`INV-03`, `BR-29.4`, OI-03); (3) hệ thống lưu lịch sử làm cơ sở báo cáo.
- **Luồng thay thế/lỗi:** tổng khác 100% hoặc thiếu đơn vị → chưa lưu; không tạo Cost Center *Chưa phân loại* (`FR-9.7`); ngừng dùng Cost Center còn nhân viên hiệu lực → từ chối; chi phí per-seat quy theo Cost Center của người giữ seat **tại thời điểm phát sinh**, không bởi phân bổ (`BR-29.3`).
- **Hậu điều kiện:** danh mục và phân bổ hợp lệ, có hiệu lực theo thời gian.
- **Quyền và BR:** IT Admin không tạo mã Cost Center; `INV-14b`.
- **Trạng thái:** MVP — OI-03 (Owner 24/09/2026) và OWNER DECISION 25/09/2026 (OI-04).

<a id="uc36"></a>
#### UC36 — Forecast Costs · Dự báo chi phí

- **Mục tiêu / giá trị:** lập kế hoạch chi dựa trên nghĩa vụ đã biết và kịch bản có giả định rõ.
- **Actor:** chính A04 Finance.
- **Luồng chính:** chọn kỳ → xem **L1** tính thẳng từ hợp đồng (`BR-30.1`) → nhập giả định **L3** (tuyển người, dự án, đổi gói) và xem chênh lệch → mọi con số kèm khoảng dữ liệu, giả định, thời điểm tính (`BR-30.2`, `BR-30.3`).
- **Luồng thay thế/lỗi:** chi phí biến động hiển thị *"dự báo theo mô hình chưa được hiện thực"* (L2 hoãn — [UC52](#uc52)); thiếu giá/nguồn → nêu rõ.
- **Trạng thái:** MVP (L1, L3) — `QĐ-25`, `ADR-09`.

### 4.6. Bằng chứng sử dụng và tối ưu license

<a id="uc24"></a>
#### UC24 — Manage Usage Evidence · Quản lý bằng chứng sử dụng

> **Đính chính 29/09 — QĐ-31b/32c:** đọc [mapping edited](#edited-view): bao gồm tín hiệu OTel/Agent theo phạm vi demo, dedup và hợp nhất coverage; thiếu tín hiệu không phải inactivity. Hình gốc không được chứng nhận đồng bộ bởi đính chính này.

- **Mục tiêu / giá trị:** có bằng chứng sử dụng đủ chất lượng, gắn đúng người và đúng quyền, để kết luận không sai.
- **Actor:** chính A03 IT Admin; hỗ trợ A08 SaaS Provider (connector, ví dụ lịch sử commit GitHub — `QĐ-28a`).
- **Luồng chính (thao tác):** (1) **cấu hình nguồn usage**: ánh xạ cột, loại định danh, múi giờ, **cửa sổ bao phủ bắt buộc** (`BR-17.1`), **định nghĩa "hoạt động"** (`BR-17.5`), ma trận năng lực (`FR-4.4`); (2) nhận dữ liệu từ connector hoặc từ file đã nạp qua [UC54](#uc54); dữ liệu bộ thu thập đến qua cổng của [UC26](#uc26) (`BR-17.9`); (3) hệ thống gắn hoạt động vào **Assignment tại ngày sự kiện** (`BR-17.6`), loại sự kiện chỉ xác thực (`BR-17.4`), hợp nhất nhiều nguồn theo bảng mâu thuẫn `FR-7.7`; (4) **xử lý hàng đợi định danh chưa khớp**: xác nhận khớp thủ công ghi tên người xác nhận (`BR-18.3`), một định danh khớp hai người thì chặn (`BR-18.4`), giữ chuỗi gốc lẫn chuẩn hóa (`BR-18.2`).
- **Luồng thay thế/lỗi:** bản ghi chưa khớp không dùng để kết luận (`BR-18.1`, `INV-12`); có hoạt động mà không có Assignment → sai lệch ([UC23](#uc23), `FR-4.8`); ứng dụng nhóm liên lạc không nhập hoạt động trừ khi đã bật có chủ đích (`BR-17.8`); thiếu thông báo trước khi theo dõi → không ghi usage ([UC48](#uc48)).
- **Hậu điều kiện:** bằng chứng có nguồn, coverage, giới hạn rõ; phần chưa khớp nằm trong hàng đợi.
- **Trạng thái:** MVP; một số nguồn phụ thuộc bằng chứng vendor/dữ liệu demo (`US-08-06` RESEARCH-DEPENDENT).

<a id="uc26"></a>
#### UC26 — Operate Device Monitoring · Vận hành thu thập trên thiết bị

> **Đính chính 29/09 — QĐ-31b/32c:** extension vẫn có; bổ sung Agent phiên người dùng demo (US-09-09), không service/installer/updater doanh nghiệp. OTel US-08-08 là positive evidence, Gap không chứng minh không hoạt động. Xem [phạm vi edited](#edited-view); không đọc đoạn mô tả tiện ích bên dưới như giới hạn extension-only.

- **Mục tiêu / giá trị:** biết nhân viên có thật sự mở một SaaS **đã biết** trên máy công ty, trong giới hạn dữ liệu tối thiểu.
- **Actor:** chính A03 IT Admin.
- **Luồng chính:** (1) đăng ký thiết bị công ty ↔ nhân viên có hiệu lực — một nhân viên **nhiều** thiết bị được, mỗi thiết bị xác nhận riêng; thiết bị dùng chung **không** đăng ký (`BR-45.8`); (2) hệ thống sinh danh sách cho phép từ **danh mục + từ điển nhà cung cấp**, loại ứng dụng liên lạc (`BR-45.4`, Scope 1.5/`BF-05`); (3) tiện ích lọc tại máy, gửi tổng hợp theo ngày và **bản ghi bao phủ** theo thiết bị/ngày (`FR-4.3a`); định nghĩa hoạt động: phía trước + không rảnh ≥ N phút/ngày, **mặc định 5** (`BR-45.5`); (4) cổng nhận từ chối thiết bị chưa đăng ký, nhân viên chưa xác nhận, trường ngoài lược đồ (`BR-45.1`–`BR-45.3`, `INV-17`); (5) IT xem trạng thái bộ thu thập; áp kết quả yêu cầu dừng từ [UC47](#uc47).
- **Luồng thay thế/lỗi:** ngày không có bản ghi bao phủ = ngoài cửa sổ, không phải không dùng; nhân viên nghỉ → đăng ký hết hiệu lực (`BR-45.7`); dữ liệu chỉ dùng cho tối ưu license, không xếp hạng theo người (`BR-45.6`).
- **Quyền và BR:** bằng chứng **có điều kiện** — không đủ một mình để kết luận G3/G4 hay thu hồi (`FR-4.14a`, `DQ-03`); chỉ phát hiện tên miền có trong từ điển (`BR-46.1`).
- **Trạng thái:** MVP; demo dùng *load unpacked* (`QĐ-28b`); đặc tả kỹ thuật tiện ích phải có trước khi code (`US-09-05`/`06` RESEARCH-DEPENDENT) — OWNER DECISION 25/09/2026 (OI-14b, OI-14d).

<a id="uc27"></a>
#### UC27 — Acknowledge Device Monitoring · Xác nhận thông báo theo dõi thiết bị

- **Mục tiêu / giá trị:** nhân viên biết rõ biện pháp theo dõi trước khi dữ liệu thiết bị được nhận.
- **Actor:** chính A01 Employee (mọi vai kế thừa khi thiết bị của họ được đăng ký).
- **Trigger:** thiết bị được đăng ký, hoặc nội dung thông báo có phiên bản mới.
- **Luồng chính:** xem thông báo có phiên bản (phạm vi, loại dữ liệu, mục đích) → **bấm xác nhận chủ động** cho từng thiết bị → hệ thống lưu phiên bản và thời điểm, mở cổng nhận khi các điều kiện khác cũng đạt (`BR-42.4`).
- **Luồng thay thế/lỗi:** không xác nhận → không có dữ liệu (`BR-45.1`, `INV-17`); phiên bản mới → phải xác nhận lại (`BR-42.5`); muốn dừng → [UC44](#uc44).
- **Hậu điều kiện:** có bằng chứng xác nhận; **không** được trình bày là kết luận pháp lý về sự đồng ý (`OQ-16`).
- **Trạng thái:** MVP.

<a id="uc48"></a>
#### UC48 — Notify Employees of Monitoring · Thông báo trước khi theo dõi

- **Mục tiêu / giá trị:** mọi ứng dụng được theo dõi mức sử dụng đều có thông báo trước tới người giữ seat — điều kiện để ghi usage.
- **Actor:** chính A03 IT Admin; hỗ trợ A01 Employee (nhận), A10 Email Service Provider (khi kênh email được cấu hình).
- **Trigger:** bắt đầu theo dõi một ứng dụng; người được cấp seat sau thời điểm thông báo.
- **Luồng chính:** chuẩn bị/ghi nhận thông báo về loại dữ liệu và mục đích → gửi người giữ seat trong ứng dụng và, nếu cấu hình, qua email (`BR-42.7`) → lưu bằng chứng → mở điều kiện ghi dữ liệu.
- **Luồng thay thế/lỗi:** chưa ghi nhận thông báo → không ghi dữ liệu (`BR-42.2`); người được cấp sau cũng nhận (`BR-42.3`); email lỗi ≠ đã thông báo; với thiết bị, thông báo **không đủ** — còn cần [UC27](#uc27).
- **Quyền và BR:** là biện pháp thiết kế, **không** khẳng định đã đủ điều kiện pháp lý (`BR-42.1`); áp cho **mọi** ứng dụng (`QĐ-01`).
- **Trạng thái:** MVP — OI-EMAIL, OI-09b.

<a id="uc28"></a>
#### UC28 — Review License Recommendations · Xem xét khuyến nghị license

- **Mục tiêu / giá trị:** thu hồi lãng phí có bằng chứng, không báo động giả (TC-2).
- **Actor:** chính A03 IT Admin (rà bảng tối ưu, thực thi sau) và A02 Manager (quyết nhu cầu của cấp dưới).
- **Trigger:** khuyến nghị sinh theo lịch (G1/G2 hằng ngày, G3/G4 hằng tuần — `FR-4.12b`); miễn trừ hết hạn.
- **Luồng chính:** (1) hệ thống áp cổng lọc — **G1/G2 chỉ cổng 1 và 8** (`BR-20.6`), G3/G4 đủ tám cổng, cổng 5 tính phần cửa sổ từ ngày cấp (`BR-20.7`); (2) IT xem bảng tối ưu bốn nhóm, tầng *theo dõi* chỉ IT thấy (`BR-20.5`); (3) khuyến nghị cần Manager hiện bằng chứng chụp lại, mức tin cậy, giới hạn dữ liệu, **hai con số tiết kiệm** (`BR-20.2`, `BR-20.3`, `BR-21.4`); (4) Manager chọn **Keep / Reclaim / Exempt** kèm lý do (chọn hàng loạt một lý do chung — `BR-21.2`), Exempt có hạn ≤ 12 tháng (`BR-21.3`, `INV-09`); (5) IT không đồng ý có lý do kỹ thuật/hợp đồng → **trả lại tối đa một lần**; lần hai của Manager là cuối (`BR-22.1`, OI-02); Reclaim → IT thực thi [UC22](#uc22).
- **Luồng thay thế/lỗi:** G2 không qua Manager (`BR-05.2`, `BR-19.2`); G1 nhắm thuê bao, xử lý ở kỳ gia hạn (`BR-19.1`); nguồn quá cũ → dừng cả ứng dụng (`BR-20.4`); thiếu bao phủ → `INSUFFICIENT EVIDENCE`, không khuyến nghị thu hồi (`FR-4.14a`); Keep không đóng vĩnh viễn (`BR-21.5`); khuyến nghị bị dữ liệu mới phủ định đóng im lặng (`BR-21.6`); miễn trừ sắp hết báo trước 7 ngày (`BR-23.1`); nghỉ dài được trừ khỏi số ngày không hoạt động (`BR-04.1`).
- **Hậu điều kiện:** quyết định nhu cầu và bằng chứng được ghi; không bao giờ tự thu hồi (`SoD-6`).
- **Quyền và BR:** Manager không xem log thô (`BR-21.1`); `INV-12`.
- **Trạng thái:** MVP — OI-02 (Owner 24/09/2026); OWNER DECISION 25/09/2026 (OI-12a, OI-12b); `BF-03` đóng theo nguồn.

<a id="uc23"></a>
#### UC23 — Resolve Vendor Discrepancies · Xử lý sai lệch với nhà cung cấp

- **Mục tiêu / giá trị:** phát hiện quyền cấp ngoài quy trình hoặc quyền đã hết mà còn tài khoản, không xóa mất bằng chứng.
- **Actor:** chính A03 IT Admin; hỗ trợ A08 SaaS Provider.
- **Trigger:** job đối soát **hằng ngày** (cấu hình được — OI-14h) với ứng dụng có connector; hoặc usage có hoạt động không có Assignment.
- **Luồng chính:** xem hai giá trị và nguồn → đối chiếu hiện trạng → ghi lựa chọn và căn cứ → nếu cần cấp/thu hồi/sửa hợp đồng thì chuyển [UC21](#uc21)/[UC22](#uc22)/[UC10](#uc10).
- **Luồng thay thế/lỗi:** chỉ đối soát ứng dụng có connector (`BR-28.1`); không tự sửa để khớp (`BR-28.2`); *có ở nhà cung cấp nhưng hệ thống không biết* → cảnh báo mức rất cao (`BR-28.3`); giữ cả hai giá trị, có người chịu trách nhiệm, không tự đóng (`BR-43.x`).
- **Trạng thái:** MVP — phần chênh lệch hóa đơn chuyển sang [UC32](#uc32).

### 4.7. Gia hạn

<a id="uc29"></a>
#### UC29 — Review Renewal Alerts · Theo dõi cảnh báo gia hạn

- **Mục tiêu / giá trị:** không bao giờ bị gia hạn ngoài ý muốn (PP-2); người quyết có đủ thời gian.
- **Actor:** chính A03 IT Admin, A04 Finance, **A05 Spending Approver** (OI-09a); hỗ trợ A07 Business Owner, A06 Super Admin (T−7), A10 Email Service Provider.
- **Trigger:** tác vụ hằng ngày tới mốc cảnh báo tính từ **hạn chót báo hủy** (`BR-26.1`).
- **Luồng chính:** (1) mốc T−15: báo IT, Finance, Business Owner và Người duyệt chi; T−7: báo thêm Super Admin (`BR-26.4`); kênh trong ứng dụng, thêm email nếu cấu hình (`BR-42.7`); (2) người nhận xem cảnh báo kèm **khuyến nghị lãng phí đang mở** của thuê bao (`BR-26.2`); (3) Người duyệt chi chuyển sang [UC30](#uc30).
- **Luồng thay thế/lỗi:** thiếu hạn báo hủy nhưng có số ngày báo trước → suy ra và gắn nhãn; thiếu cả hai mà tự gia hạn → cảnh báo chất lượng dữ liệu, không suy đoán (`FR-1.4`); Business Owner đã nghỉ → không gửi người đó (`BR-06.7`); lỗi gửi → chưa coi là đã thông báo; quá hạn báo hủy chưa quyết + tự gia hạn → sự cố KPI-4 (`BR-26.3`).
- **Hậu điều kiện:** bên có trách nhiệm biết hạn; nhận cảnh báo không trao thêm quyền quyết.
- **Trạng thái:** MVP — OWNER DECISION 25/09/2026 (OI-09a, OI-09b); OI-EMAIL.

### 4.8. Shadow IT

<a id="uc42"></a>
#### UC42 — Investigate Shadow IT · Điều tra Shadow IT

> **Phạm vi edited 29/09 — QĐ-31a/32a/b:** MF-6 hiện thực CSV; discovery IdP/browser deferred; AI gợi ý vendor sau rule, qua quality gate và cần IT xác nhận. Demo hosted chỉ synthetic data; không AI tự quyết. Actor hỗ trợ được lược trên canvas nhưng tương tác ngoài boundary không bị xóa; xem [bảng lược](#edited-view).

- **Mục tiêu / giá trị:** biến dấu hiệu SaaS ngoài danh mục thành hồ sơ đủ căn cứ để quyết, không kết tội.
- **Actor:** chính A03 IT Admin; hỗ trợ A02 Manager (bối cảnh cấp dưới), [A13](#a13) AI Model Provider *(chỉ khi cấu hình nhà cung cấp hosted — `QĐ-32b`)*.
- **Trigger:** finding mới, mở lại hoặc có bằng chứng mới — từ sao kê/hóa đơn (Finance nạp qua [UC54](#uc54)). *(29/09/2026 — `QĐ-31a`: export IdP/OAuth và bộ thu thập làm nguồn discovery là **giai đoạn sau**.)*
- **Luồng chính:** (1) hệ thống chuẩn hóa, khớp nhà cung cấp và chấm tin cậy theo phương pháp (`FR-6.5`), giữ giá trị thô và chuẩn hóa (`BR-31.4`), gộp **một finding mở mỗi nhà cung cấp** (`BR-31.2`, `INV-13`), phân tầng rủi ro (`BR-31.5`); **(1a)** *(H1 — 30/09/2026, `QĐ-33b`)* hệ thống **đối soát từng khoản chi** với căn cứ phê duyệt (thuê bao/hợp đồng có số tiền theo kỳ và thời hạn; yêu cầu đã duyệt có khoản cam kết; quyết định chi) — khoản khớp **không** sinh hồ sơ; mỗi ngoại lệ là **một mục riêng cho khoản chi đó**, xử lý ở [UC57](#uc57); finding theo nhà cung cấp **chỉ** gom khoản *nhà cung cấp chưa được duyệt* (`QĐ-33c`). Tên mô tả dùng dữ liệu thô: tên nhà cung cấp chỉ được coi là bên nhận tiền khi đứng ở vị trí bên nhận của mô tả (F31 — nhắc tên trong phần sau mô tả vào review, không tự chuẩn hóa); (2) IT **xác nhận** các khớp mức tin cậy thấp **và các mục trong hàng đợi review** (một lý do chính trong 8 lý do — `QĐ-32c`) trước khi vào hàng đợi quyết; với mục rule **không có ứng viên duy nhất**, hệ thống có thể gắn **gợi ý nhà cung cấp** của A13 (tin cậy Thấp, căn cứ là chuỗi con của mô tả) khi AI bật và cấu hình đã qua cổng chất lượng — gợi ý **không** đổi giao dịch hay finding; IT chấp nhận hoặc bác, audit ghi kết cục (`QĐ-32a`, `US-15-01`); (3) IT xem bằng chứng, gán người chịu trách nhiệm, lấy bối cảnh Manager và ghi ý kiến Business Owner của ứng dụng **cùng nhóm chức năng**; (4) chuyển hồ sơ sang [UC43](#uc43).
- **Luồng thay thế/lỗi:** finding không phải vi phạm (`BR-31.1`, `BR-46.3`); đóng *báo nhầm* mà tái xuất hiện → mở lại (`BR-31.3`); đóng *không duyệt* mà tái xuất hiện → mở lại với cờ và nâng rủi ro; đóng *duyệt* → không mở (đã vào danh mục) (`BR-31.6`); bộ thu thập mù với SaaS chưa có trong từ điển (`BR-46.1`); AI tắt/lỗi/chưa qua cổng/nhà cung cấp không phản hồi → hàng đợi thủ công như cũ; mô tả chứa văn bản giống chỉ dẫn → gợi ý MATCH bị hạ `UNCERTAIN`.
- **Hậu điều kiện:** finding đủ căn cứ cho UC43, hoặc giữ mở.
- **Quyền và BR:** IT **không** quyết ba kết cục (`DQ-06`).
- **Trạng thái:** MVP — OWNER DECISION 25/09/2026 (OI-14e, OI-14f); bước gợi ý AI — `QĐ-32a` (Owner yêu cầu AI 29/09/2026, trợ lý chọn tính năng; chưa phải xác nhận GVHD); bước (1a) — `QĐ-33b` (trợ lý theo ủy quyền Owner 29/09/2026; áp vào đặc tả 30/09/2026 khi tiếp nhận `HANDOFF`).

<a id="uc57"></a>
#### UC57 — Reconcile Software Charges · Đối soát khoản chi phần mềm *(mô hình đầy đủ; chưa vẽ)*

> **Vì sao là UC riêng (H2, Owner chọn 30/09/2026):** gộp vào [UC42](#uc42) sẽ thiếu association của Finance (UC42 chỉ nối A03), và mục tiêu khác: UC42 hỏi *phần mềm này có trong diện quản trị chưa*, UC57 hỏi *khoản tiền này có căn cứ được chi không*. **Không vẽ** lên sơ đồ gốc (Owner giữ nguyên bản gốc) và **lược** khỏi bản edited — xem [bảng lược](#edited-view).

- **Mục tiêu / giá trị:** mỗi khoản chi phần mềm có một trạng thái đối soát so với căn cứ phê duyệt; khoản *cần kiểm tra* có người xử lý, không bị gộp hay đóng hàng loạt (`US-13-07`).
- **Actor:** chính A04 Finance (đối soát, cung cấp bằng chứng, lỗi tính tiền); hỗ trợ A03 IT Admin (điều tra phần mềm, liên kết căn cứ). **Không** có Employee, Manager, Super Admin.
- **Trigger:** commit một import sao kê/hóa đơn ([UC54](#uc54)); hoặc IT xác nhận nhà cung cấp cho một dòng review ([UC42](#uc42)) — chỉ dòng đó được đối soát lại.
- **Tiền điều kiện:** căn cứ phê duyệt đã được ghi nhận trong hệ thống ([UC10](#uc10), [UC16](#uc16), [UC43](#uc43)); khoản chi đã nhận diện được nhà cung cấp.
- **Luồng chính:** (1) hệ thống tìm căn cứ cùng nhà cung cấp → lọc theo thời hạn và tiền tệ (**không** quy đổi) → nếu **đúng một** căn cứ có số tiền: so **lũy kế trong kỳ** (khoản đã khớp + khoản chi đã đối chiếu **hóa đơn đã ghi nhận** cùng kỳ — `QĐ-34b`) + khoản này với số được duyệt → *khớp căn cứ* hoặc *ngoại lệ — vượt số tiền*; (2) ngoại lệ khác kèm lý do: *không có căn cứ · ngoài thời hạn · nhiều căn cứ* (liệt kê, không chọn giúp) *· khác tiền tệ · căn cứ thiếu dữ liệu*; (3) Finance/IT mở ngoại lệ, xem căn cứ, kỳ, *đã dùng / được duyệt*, nhãn **“Cần kiểm tra — không phải vi phạm”**; (4) chọn một cách xử lý: **liên kết căn cứ khác** (hệ thống kiểm lại — không che được phần vượt), **lỗi tính tiền của nhà cung cấp** (chỉ Finance, ghi chú bắt buộc), hoặc **chuyển Người duyệt chi** (ghi chú bắt buộc) → [UC58](#uc58).
- **Luồng thay thế/lỗi:** *(30/09 tối — `QĐ-34`)* khoản chi trùng **hóa đơn Finance đã nhập** → *đã ghi nhận*, đối chiếu bằng **phân bổ số tiền** (tự động theo số hóa đơn, hoặc nhà cung cấp + số tiền + ±3 ngày duy nhất; Finance phân bổ tay cho trả một phần/một khoản nhiều hóa đơn; khác tiền tệ chỉ liên kết tay toàn hóa đơn có ghi chú; hủy phân bổ có lý do) — hóa đơn **không** bao giờ là *đã thanh toán*; Finance đánh dấu *lỗi tính tiền* → mục đóng kèm ghi chú, **không** tạo hồ sơ sai lệch (`Discrepancy`), không có bước quyết thứ hai; căn cứ được chọn không bao được khoản chi → từ chối liên kết, ngoại lệ giữ nguyên; tái nhập cùng tệp → không thêm dòng, không mở ngoại lệ mới, lũy kế không đổi; hoàn tiền và dòng *không phải phần mềm* có trạng thái riêng, không vào hàng đợi ngoại lệ; khoản của nhà cung cấp *chưa được duyệt* đi [UC42](#uc42), không vào đây.
- **Hậu điều kiện:** khoản chi có một trạng thái đối soát; ngoại lệ có người xử lý hoặc đang chờ [UC58](#uc58); không khoản chi khác bị đổi.
- **Quyền và BR:** Finance và IT **không** chấp nhận hay không chấp nhận khoản chi (`FR-3.4c-1`, `DQ-06`); người giữ thẻ/người nhập CSV **không** phải bằng chứng người mua hay người dùng; mọi thao tác ghi audit (`INV-05`).
- **Phân biệt với [UC32](#uc32):** UC32 ghép **hóa đơn** về thuê bao và so **số seat** (hóa đơn · khai báo · đang dùng); UC57 so **từng khoản chi** với **căn cứ được phép chi**. Hai UC dùng chung dữ liệu tài chính nhưng trả lời hai câu hỏi khác nhau.
- **Truy vết:** `FR-6.4`, `FR-6.7` (ghi chú v3.16), `FR-3.4c-1`, `INV-13`, `QĐ-33a/b/c`, **`QĐ-34a/b`**, `US-13-07` AC-1→**AC-10**, `WF-17` nhánh `rx1`, `UF-12` (`FIN-07`), test prototype `DC-26`→`DC-32`, `recon-synthetic`, **`IV-01`→`IV-08`**.
- **Trạng thái:** MVP — `QĐ-33` (Owner; logic do trợ lý thiết kế theo ủy quyền); tạo UC57 — Owner chọn phương án H2 ngày 30/09/2026. **Chưa phải xác nhận của GVHD.**

### 4.9. Báo cáo

<a id="uc56"></a>
#### UC56 — Review Governance Reports · Xem báo cáo quản trị

- **Mục tiêu / giá trị:** mỗi vai thấy đúng số liệu mình cần — tiền của ai, đã tiết kiệm bao nhiêu, dùng tới đâu, chậm ở đâu, tin được tới đâu.
- **Actor:** chính A12 *Governance User* — thực tế là A02, A03, A04, A05, A06 qua kế thừa, **mỗi vai một phạm vi**.
- **Luồng chính:** chọn nhóm báo cáo, kỳ, chiều nhóm → xem số liệu kèm nguồn, cơ sở ghi nhận, thời điểm cập nhật (`BR-29.2`, `BR-29.5`) → bấm để xem căn cứ tính (`BR-47.3`).

| Vai | Tổng chi (`FR-5.1`, `FR-5.2`) | Tiết kiệm (`FR-5.9`) | Hiệu suất sử dụng (`FR-5.10`) | Hiệu suất quy trình (`FR-5.11`) | Chất lượng (`FR-5.12`) |
| --- | --- | --- | --- | --- | --- |
| Spending Approver | ✅ | ✅ | Tóm tắt | Tóm tắt, gồm tổng hợp seat cấp nhánh (a) | — |
| Finance | ✅ + khoản cam kết | ✅ | — | — | — |
| IT Admin | — | ✅ | ✅ | ✅ | ✅ trừ KPI-5 |
| Super Admin | — | — | — | ✅ (gồm bảng theo dõi nghẽn) | ✅ gồm KPI-5 |
| Manager | **Thực chi + cam kết đang giữ của cây cấp dưới**, theo ứng dụng/nhà cung cấp; không ngân sách, không còn lại, không tổng công ty (`BR-29.8`) | — | Cấp dưới, tổng hợp | Request của cấp dưới | — |

- **Luồng thay thế/lỗi:** không có ngân sách không hiện 0; số âm do gắn ngược được giải thích (`BR-36.6`); tiết kiệm **hai con số tách riêng, không cộng** (`BR-29.7`, `BR-20.2`); KPI-3 = seat hoạt động ÷ `purchased_quantity`, tách độ bao phủ và tỷ lệ trong phần đánh giá được (`FR-5.10a`); thiếu bao phủ → `INSUFFICIENT EVIDENCE`; *không có dữ liệu* và *chưa khớp* không phải *không hoạt động*; chi phí trên người dùng có hoạt động chỉ cho gói per-seat có nguồn G3/G4 (`BR-47.1`); không đặt mục tiêu KPI (`BR-47.2`); không xếp hạng nhân viên theo thời gian dùng (`BR-45.6`, `BR-47.4`); đa tiền tệ theo tỷ giá ghi nhận (`BR-29.1`).
- **Trạng thái:** MVP — `QĐ-24`, `DQ-05`, `KPI3-DENOM`; OWNER DECISION 25/09/2026 cho phạm vi Manager (OI-08b).

<a id="uc59"></a>
#### UC59 — Manage My Account · Quản lý tài khoản của tôi *(mới ở 04/10/2026 — `QĐ-46`, `QĐ-47`)*

- **Mục tiêu / giá trị:** người dùng tự làm chủ tài khoản của mình — vào được lần đầu, lấy lại quyền vào khi quên mật khẩu, đổi mật khẩu khi cần, biết vai hiệu lực của mình — mà **không ai khác biết mật khẩu**.
- **Actor:** chính A01 Employee (mọi người dùng có tài khoản, qua kế thừa A12 System User). **Không có actor hỗ trợ trên view**: lời mời và liên kết đặt lại đi qua kênh thư điện tử của hệ thống (ngoại lệ bảo mật của `FR-3.11`, `QĐ-46`), không vẽ A10 trên view edited.
- **Trigger:** nhận thư lời mời; quên mật khẩu; muốn đổi mật khẩu; mở hồ sơ.
- **Precondition:** kích hoạt/đặt lại — có liên kết một lần còn dùng được; đổi mật khẩu/hồ sơ — đã đăng nhập ([UC01](#uc01)).
- **Luồng chính:** (1) *kích hoạt* — mở lời mời, tự đặt mật khẩu → tài khoản kích hoạt, **không** tự đăng nhập; (2) *quên mật khẩu* — nhập email → phản hồi giống hệt nhau, chỉ tài khoản đủ điều kiện nhận thư, mở liên kết, đặt mật khẩu mới → mọi phiên cũ bị thu hồi; (3) *đổi mật khẩu* — nhập mật khẩu hiện tại và mật khẩu mới → mọi phiên bị thu hồi; (4) *hồ sơ* — xem vai hiệu lực (gán trực tiếp ∪ suy ra) và **chỉ** sửa ngôn ngữ.
- **Luồng thay thế/lỗi:** liên kết hết hạn/đã dùng/bị thay thế, hoặc tài khoản không còn đủ điều kiện → thông báo chung, xin liên kết mới (quên mật khẩu hoặc Super Admin gửi lại lời mời); mật khẩu không đạt chính sách → nhập lại; tài khoản bị khóa hoặc nhân viên đã nghỉ việc → đặt lại/đổi mật khẩu **không** mở lại được (`FR-8.9`); nhập sai nhiều lần → từ chối tạm thời, không khóa vĩnh viễn; tài khoản **đang chờ khôi phục thông tin đăng nhập** → quên mật khẩu thông thường không gửi thư (`QĐ-47a`).
- **Hậu điều kiện:** mật khẩu chỉ lưu dạng băm; thao tác có Audit Trail không chứa mật khẩu hay mã; đặt lại/đổi mật khẩu **không** đổi vai, trạng thái khóa hay trạng thái nhân viên.
- **Quyền và BR:** chỉ trên tài khoản **của chính mình**; Super Admin chỉ tạo tài khoản và gửi/gửi lại lời mời ([UC02](#uc02)), không đặt hay xem mật khẩu thay ai (`FR-8.11`, `SoD-4`). Không sửa email đăng nhập, vai, tên qua hồ sơ.
- **Quan hệ:** không «include» UC01 (P-AUTH là precondition). Khôi phục thông tin đăng nhập của Super Admin duy nhất (mất cả mật khẩu và hộp thư) là thủ tục **ngoài ứng dụng** của người vận hành hạ tầng (`QĐ-47a`), **không** thuộc UC này; người nhận được tạo tài khoản ở giai đoạn 1 của `REASSIGN` (`QĐ-47f`) kích hoạt bằng chính luồng lời mời của UC này — kích hoạt không cấp vai.
- **Trạng thái:** MVP — quyết định của Owner (`QĐ-46`, `QĐ-47`), chưa phải xác nhận của GVHD; BE chưa implement (ADR-0010). Luồng màn hình: [`UF-17`](../user-flows/index.md).

<a id="uc60"></a>
#### UC60 — Transfer Super Admin Role · Chuyển giao vai Super Admin *(mới ở 04/10/2026 — `QĐ-44c`, `QĐ-47`)*

- **Mục tiêu / giá trị:** đổi người giữ vai Super Admin trong **một** thao tác mà tổ chức luôn có đúng một Super Admin.
- **Actor:** chính A06 Super Admin (đang giữ vai và dùng được).
- **Trigger:** Super Admin sắp đổi nhiệm vụ hoặc nghỉ việc — nghỉ **có kế hoạch**: *chuyển giao trước, rồi mới cho nghỉ việc* (`QĐ-47b`).
- **Precondition:** P-AUTH; người kế nhiệm là nhân viên đang làm việc (không nghỉ dài/đang bàn giao), tài khoản hoạt động và **đã kích hoạt** (đã tự đặt mật khẩu qua lời mời), không giữ `IT_ADMIN`/`FINANCE`/vai duyệt.
- **Luồng chính:** chọn người kế nhiệm → nhập lại mật khẩu hiện tại → hệ thống kiểm điều kiện, thu hồi vai người cũ và cấp vai người mới trong **một** giao dịch → Audit Trail cho cả hai tài khoản → thao tác kế tiếp của người cũ đánh giá theo vai mới.
- **Luồng thay thế/lỗi:** người kế nhiệm không đủ điều kiện → từ chối, không đổi gì; lỗi giữa chừng → hoàn tác; hai yêu cầu đồng thời → một thành công; người gọi không còn giữ vai → từ chối.
- **Hậu điều kiện:** đúng một người giữ vai; mọi vai khác không đổi.
- **Quyền và BR:** ngoại lệ có kiểm soát **duy nhất** của việc không tự đổi vai của chính mình (`FR-8.8`, `FR-8.10`); không cho Super Admin quyền nghiệp vụ (`SoD-1`). Khi người giữ vai bàn giao/nghỉ việc mà chưa chuyển: IT Admin nhận **cảnh báo** (không chặn), có audit; nếu người giữ vai không còn dùng được thì **khôi phục ngoài ứng dụng** (`US-01-09` AC-9→AC-14; `REASSIGN` hai giai đoạn — `QĐ-47e` suy ra, `QĐ-47f` ngoại lệ tạo tài khoản chưa kích hoạt) — không phải UC trong view.
- **Trạng thái:** MVP — `US-01-09`; quyết định của Owner (`QĐ-44`, `QĐ-47`), chưa phải xác nhận của GVHD; BE chưa implement (ADR-0009 Accepted cho triển khai theo ủy quyền của Owner).

### 4.10. Quyền dữ liệu cá nhân

<a id="uc44"></a>
#### UC44 — Exercise Personal Data Rights · Thực hiện quyền dữ liệu cá nhân

- **Mục tiêu / giá trị:** biết hệ thống lưu gì về mình và thực hiện quyền đối với dữ liệu đó.
- **Actor:** chính A01 Employee (mọi vai kế thừa cho dữ liệu của chính họ).
- **Luồng chính (thao tác):** (1) **xem** seat, lịch sử yêu cầu, usage tổng hợp, thiết bị, lần xác nhận (`FR-10.1`); (2) **yêu cầu xuất** — hệ thống tự sinh file đọc được (`BR-40.3`), ghi thời điểm tiếp nhận/hoàn tất (`BR-40.2`); (3) **yêu cầu dừng thu thập** trên thiết bị của mình (`BR-42.6`); (4) **yêu cầu chỉnh sửa** dữ liệu sai (`BR-40.7`, OI-13); (5) theo dõi trạng thái các yêu cầu.
- **Luồng thay thế/lỗi:** chỉ dữ liệu của chính mình (`BR-40.1`); gửi yêu cầu dừng ≠ đã dừng; sinh file lỗi → yêu cầu chưa hoàn tất, chuyển ngoại lệ cho [UC47](#uc47); yêu cầu không hợp lệ bị đóng kèm lý do, được gửi lại (`BR-40.5`).
- **Hậu điều kiện:** minh bạch trong phạm vi bản thân; yêu cầu có dấu thời gian.
- **Trạng thái:** MVP — OWNER DECISION 25/09/2026 (OI-13, OI-01b).

<a id="uc47"></a>
#### UC47 — Process Data Subject Requests · Xử lý yêu cầu quyền dữ liệu

- **Mục tiêu / giá trị:** yêu cầu quyền dữ liệu có người chịu trách nhiệm, thời hạn và kết quả chứng minh được.
- **Actor:** chính A03 IT Admin (OI-01).
- **Trigger:** yêu cầu dừng thu thập, yêu cầu chỉnh sửa, hoặc ngoại lệ xuất dữ liệu từ [UC44](#uc44).
- **Luồng chính:** (1) IT nhận yêu cầu; hệ thống ghi người xử lý và thời điểm (`FR-10.5`); (2) **dừng thu thập** — xử lý trong **2 ngày làm việc** (`BR-40.4`); yêu cầu hợp lệ **luôn được thực hiện** (`BR-40.5`): kết thúc/đình chỉ đăng ký thiết bị để cổng nhận ngừng nhận (`FR-4.18`); (3) **chỉnh sửa** hoặc **ngoại lệ xuất** — trong **10 ngày** (`BR-40.8`): sửa dữ liệu cá nhân được phép, không sửa usage gốc/Audit Trail, dữ liệu nhân sự sai sửa theo nguồn nhân sự qua [UC07](#uc07) (`BR-40.7`); (4) ghi kết quả và thời điểm hoàn tất.
- **Luồng thay thế/lỗi:** yêu cầu **không hợp lệ** (không phải thiết bị của mình, trùng, đã dừng) → đóng kèm lý do, không có kháng nghị trong MVP; IT Admin xử lý yêu cầu **của chính mình** → được, Audit Trail gắn cờ *tự xử lý* (`BR-40.6`); quá hạn → nhắc/cảnh báo nghẽn. Thời hạn 2 ngày/10 ngày lấy từ bảng BRD 5.11 — **căn cứ pháp lý còn chờ kiểm chứng**, không trình bày là đã tuân thủ.
- **Hậu điều kiện:** kết quả thật và người/thời điểm xử lý có bằng chứng; dừng → không còn ingest từ thiết bị đó.
- **Trạng thái:** MVP — OI-01 (Owner 24/09/2026); OWNER DECISION 25/09/2026 (OI-01a, OI-01b, OI-01c, OI-13, OI-13b).

### 4.11. Import dùng chung

<a id="uc54"></a>
#### UC54 — Import Business Data File · Nhập tệp dữ liệu nghiệp vụ

- **Mục tiêu / giá trị:** đưa dữ liệu ngoài vào hệ thống **đúng và kiểm soát được** — không dòng lỗi nào âm thầm thành kết luận.
- **Actor:** chính A03 IT Admin (nhân sự, danh mục, hợp đồng, hiện trạng seat, log usage, export IdP/OAuth) và A04 Finance (hóa đơn, sao kê, ngân sách). Mỗi vai chỉ nạp loại file thuộc phạm vi của mình.
- **Mức:** subfunction dùng chung — vừa được thực hiện trực tiếp, vừa được [UC06](#uc06) và [UC32](#uc32) «include».
- **Luồng chính (sáu bước `FR-7.1`):** tải lên → phân tích → ánh xạ danh tính → **xem trước bắt buộc** (số dòng hợp lệ, lỗi kèm lý do, đã tồn tại, định danh chưa khớp, cửa sổ dữ liệu, số bản ghi bị ảnh hưởng — `FR-7.2`) → người dùng xác nhận → ghi nhận → tổng hợp lại.
- **Luồng thay thế/lỗi:** lỗi một dòng không hỏng cả file, tải về danh sách lỗi (`FR-7.3`, `BR-17.7`); file đã import trước → cảnh báo trùng theo mã băm (`FR-7.4`); chuẩn hóa múi giờ và email bằng một hàm dùng chung (`BR-17.2`, `BR-17.3`); bằng chứng discovery giữ cả giá trị thô và chuẩn hóa (`BR-31.4`); dòng không hợp lệ theo quy tắc nghiệp vụ của loại file (ví dụ `BR-01.5`, `BR-01.6`) bị từ chối ở xem trước.
- **Hậu điều kiện:** chỉ dòng đã xác nhận được ghi; dòng lỗi có danh sách.
- **Quan hệ:** được include bởi UC06 (IN02), UC32 (IN03).
- **Trạng thái:** MVP (UC mới của mô hình; hành vi lấy từ BRD 5.7, `US-02-01`).

<a id="deferred"></a>
### 4.12. Use case deferred / design-only (không vẽ)

| UC | Tên | Actor định hướng | Nguồn | Vì sao không vẽ |
| --- | --- | --- | --- | --- |
| <a id="uc49"></a>UC49 | Change Subscription Plan · Đổi gói thuê bao | A01; A02, A05, A03 hỗ trợ | `FR-3.2` (đổi gói), `F-16`, `US-05-16` | `F-16` chỉ thiết kế (`QĐ-25`); yêu cầu có nhưng hiện thực hoãn (`OQ-US-16` đóng theo nguồn) |
| <a id="uc50"></a>UC50 | Conduct Periodic Access Review · Rà soát quyền định kỳ | A02; A03 | `FR-3.10` (access review), `F-24`, `WF-14`, `US-10-09` | `F-24`, `WF-14` chỉ thiết kế |
| <a id="uc51"></a>UC51 | Monitor Desktop Usage · Theo dõi ứng dụng desktop | A03; A01 | `FR-4.19`, `F-48`, `US-09-09` | *(29/09/2026 — `QĐ-31b`)* Agent phiên người dùng **lên hiện thực mức demo** và đi chung [UC26](#uc26) (cùng đăng ký, xác nhận, cổng nhận); giữ mã UC51 để truy vết, **không** vẽ oval riêng. *(Tới 28/09: agent chỉ đặc tả — `QĐ-20`)* |
| <a id="uc52"></a>UC52 | Forecast Variable Costs · Dự báo chi phí biến động | A04 | `FR-5.7`, `US-12-08` | L2 hoãn (`QĐ-25`); L1/L3 thuộc UC36 |
| <a id="uc53"></a>UC53 | Consult AI Assistant · Hỏi trợ lý AI | A04, A02 | BRD 6.4, `US-15-02`–`US-15-04` | Ba tính năng AI **mở rộng**, hoãn; AI không tự quyết. *(29/09/2026 — `QĐ-32a`: `US-15-01` gợi ý nhà cung cấp chuyển vào [UC42](#uc42) như một bước, không phải UC riêng)* |

<a id="business-rules"></a>
## 5. Business Rules

Nội dung BR lấy **nguyên văn từ nguồn sở hữu** (User Flows cho `BR-ff.n`; BRD cho `SoD`, `INV`), sinh bằng [`tools/build_use_case_spec.py`](tools/build_use_case_spec.py) để không lệch. BR đánh dấu *mới 25/09/2026* đã được thêm vào User Flows theo quyết định Owner ở [mục 8](#decisions); BR đánh dấu *làm rõ 25/09/2026* giữ mã và nghĩa, chỉ điền người/giá trị còn thiếu. *Phạm vi & ngoại lệ* nằm ngay trong câu quy tắc; UC/US/FR là nơi áp dụng.

<!-- GENERATED:br-table:BEGIN -->
| BR | Nội dung (nguyên văn nguồn) | Phạm vi | UC | US | FR | Nguồn | Trạng thái |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `SoD-1` | Super Admin **không** gán/thu hồi seat và **không** phê duyệt request nghiệp vụ. Vai trò này chỉ quản trị hệ thống. Nếu Super Admin làm được mọi thứ thì việc tách vai trò mất ý nghĩa | BRD 4.2 — phân tách nhiệm vụ | [UC02](#uc02), [UC03](#uc03), [UC04](#uc04), [UC05](#uc05) | `US-01-01`, `US-01-03`, `US-01-04`, `US-01-05`, `US-01-07`, `US-01-09`, `US-01-10`, `US-05-03`, `US-05-10`, `US-05-11`, `US-07-01` | `FR-3.5`, `FR-3.6`, `FR-3.8`, `FR-3.12`, `FR-3.13`, `FR-3.15`, `FR-3.16`, `FR-4.13`, `FR-4.17`, `FR-8.1`, `FR-8.2`, `FR-8.3`, `FR-8.4`, `FR-8.5`, `FR-8.6` | BRD | Hiện hành |
| `SoD-2` | Manager không tự cấp/thu hồi quyền, không xem hợp đồng, dữ liệu tài chính toàn công ty hoặc raw activity log | BRD 4.2 — phân tách nhiệm vụ | [UC14](#uc14), [UC56](#uc56) | `US-01-02`, `US-01-05`, `US-04-04`, `US-05-04`, `US-06-09`, `US-08-08`, `US-09-07`, `US-10-03`, `US-10-04`, `US-10-06`, `US-11-01`, `US-12-01`, `US-14-05`, `US-15-04` | `FR-0.4`, `FR-3.3`, `FR-3.6`, `FR-3.7`, `FR-4.15`, `FR-5.1`, `FR-5.2`, `FR-5.3`, `FR-5.6`, `FR-5.12` | BRD | Hiện hành |
| `SoD-3` | Finance không thực hiện thao tác kỹ thuật, không tự cấp/thu hồi tài khoản, và **không quyết định chi** — chỉ trả lời yêu cầu thông tin ngân sách, ghi nhận ngân sách và theo dõi khoản cam kết *(viết lại ở v3.8; sửa v3.10)* | BRD 4.2 — phân tách nhiệm vụ | [UC20](#uc20), [UC32](#uc32) | `US-01-05`, `US-06-01`, `US-06-03`, `US-06-05`, `US-07-01`, `US-11-02` | `FR-3.14`, `FR-5.8` | BRD | Hiện hành |
| `SoD-4` | Người yêu cầu không được tự phê duyệt yêu cầu của chính mình, kể cả khi có vai trò cho phép phê duyệt | BRD 4.2 — phân tách nhiệm vụ | [UC01](#uc01), [UC11](#uc11), [UC14](#uc14) | `US-01-05`, `US-03-02`, `US-05-02`, `US-05-03`, `US-05-14` | `FR-3.2`, `FR-3.3`, `FR-3.4`, `FR-3.6`, `FR-3.7`, `FR-3.12` | BRD | Hiện hành |
| `SoD-5` | IT Admin là bên duy nhất thực hiện thay đổi license seat, và chỉ sau khi đủ phê duyệt | BRD 4.2 — phân tách nhiệm vụ | [UC08](#uc08), [UC15](#uc15), [UC21](#uc21), [UC22](#uc22), [UC43](#uc43) | `US-01-05`, `US-03-04`, `US-03-05`, `US-04-01`, `US-05-03`, `US-05-06`, `US-05-07`, `US-05-11`, `US-05-13`, `US-07-01`, `US-07-05`, `US-10-07`, `US-13-06` | `FR-1.7`, `FR-2.3`, `FR-2.4`, `FR-2.5`, `FR-2.7`, `FR-3.4`, `FR-3.4c-1`, `FR-4.15`, `FR-6.9`, `FR-10.6` | BRD | Hiện hành |
| `SoD-6` | Automation Service không tự phê duyệt chi phí, không tự cấp/thu hồi seat, không tự chặn ứng dụng | BRD 4.2 — phân tách nhiệm vụ | [UC08](#uc08), [UC21](#uc21), [UC22](#uc22) | `US-01-05`, `US-02-06`, `US-03-04`, `US-05-09`, `US-06-04`, `US-07-03`, `US-07-05`, `US-07-06`, `US-10-01`, `US-13-03` | `FR-2.4`, `FR-2.5`, `FR-4.15`, `FR-10.6` | BRD | Hiện hành |
| `SoD-7` | *(mới ở v3.8)* Người duyệt chi không cấp/thu hồi seat, không thực hiện thao tác kỹ thuật, và không duyệt chi cho Request mà mình là **người yêu cầu hoặc người thụ hưởng** | BRD 4.2 — phân tách nhiệm vụ | [UC16](#uc16), [UC30](#uc30), [UC43](#uc43), [UC55](#uc55) | `US-01-05`, `US-06-01`, `US-06-08`, `US-07-01`, `US-11-02`, `US-13-06`, `US-13-07` | `FR-3.4`, `FR-3.4c-1`, `FR-3.5`, `FR-3.13`, `FR-3.14`, `FR-3.15`, `FR-5.8`, `FR-6.9` | BRD | Hiện hành |
| `SoD-8` | *(mới ở v3.8; phát biểu lại v3.10 — `QĐ-29b`)* Người **trả lời yêu cầu thông tin ngân sách** hoặc **ghi nhận ngân sách** và Người duyệt chi của **cùng một Request** phải là hai người khác nhau — ý kiến kiểm soát không được do chính người quyết đưa ra | BRD 4.2 — phân tách nhiệm vụ | [UC17](#uc17), [UC20](#uc20), [UC55](#uc55) | `US-01-05`, `US-06-02`, `US-06-03`, `US-06-05`, `US-06-08` | `FR-3.5`, `FR-3.14`, `FR-3.15`, `FR-5.8` | BRD | Hiện hành |
| `INV-01` | Số Assignment đang chiếm chỗ không vượt quá `purchased_quantity` của Subscription | BRD 5.12.2 — bất biến | [UC10](#uc10), [UC21](#uc21) | `US-02-05`, `US-07-01`, `US-11-03`, `US-12-05` | `FR-2.3`, `FR-2.5`, `FR-2.7` | BRD | Hiện hành |
| `INV-02` | Các khoảng hiệu lực của cùng cặp (nhân viên, thuê bao) không được chồng lấn | BRD 5.12.2 — bất biến | [UC11](#uc11), [UC21](#uc21) | `US-02-05`, `US-07-01` | `FR-2.3`, `FR-2.5`, `FR-2.7` | BRD | Hiện hành |
| `INV-03` | Tổng tỷ lệ phân bổ chi phí của một Subscription bằng 100% | BRD 5.12.2 — bất biến | [UC33](#uc33) | `US-04-08` | `FR-5.2` | BRD | Hiện hành |
| `INV-04` | Mọi trường tiền có loại tiền tệ, tỷ giá, ngày áp dụng tỷ giá và giá trị đã quy đổi | BRD 5.12.2 — bất biến | [UC10](#uc10), [UC32](#uc32) | `US-04-05`, `US-06-04` | `FR-1.6`, `FR-5.6`, `FR-5.8` | BRD | Hiện hành |
| `INV-05` | Nhật ký kiểm toán chỉ ghi thêm; `UPDATE` và `DELETE` bị từ chối | BRD 5.12.2 — bất biến | [UC04](#uc04) | `US-01-01`, `US-01-06`, `US-01-09`, `US-01-10` | `FR-8.3` | BRD | Hiện hành |
| `INV-06` | Mỗi mục danh mục SaaS có đúng một Business Owner đang làm việc, không được rỗng | BRD 5.12.2 — bất biến | [UC08](#uc08), [UC09](#uc09) | `US-04-01`, `US-04-06` | `FR-1.1`, `FR-1.7`, `FR-1.8`, `FR-6.1` | BRD | Hiện hành |
| `INV-07` | Assignment gắn với nhà thầu, freelancer hoặc thực tập sinh bắt buộc có ngày kết thúc dự kiến | BRD 5.12.2 — bất biến | [UC07](#uc07) | `US-02-05`, `US-03-05` | `FR-2.8` | BRD | Hiện hành |
| `INV-08` | Người yêu cầu không đồng thời là người phê duyệt của cùng một Request | BRD 5.12.2 — bất biến | [UC11](#uc11), [UC14](#uc14) | `US-01-05`, `US-05-03` | `FR-3.3`, `FR-3.6`, `FR-3.12` | BRD | Hiện hành |
| `INV-09` | Quyết định miễn trừ (Exempt) bắt buộc có thời hạn, tối đa 12 tháng | BRD 5.12.2 — bất biến | [UC28](#uc28) | `US-10-06`, `US-10-08` | `FR-3.10` | BRD | Hiện hành |
| `INV-10` | Mỗi nguồn usage bắt buộc khai báo cửa sổ dữ liệu bao phủ | BRD 5.12.2 — bất biến | [UC24](#uc24) | `US-08-01`, `US-08-07`, `US-09-06` | `FR-4.2`, `FR-4.3`, `FR-4.4`, `FR-4.16`, `FR-7.7` | BRD | Hiện hành |
| `INV-11` | Mỗi nguồn usage bắt buộc khai báo định nghĩa "hoạt động" của nguồn đó | BRD 5.12.2 — bất biến | [UC24](#uc24) | `US-08-01`, `US-08-07` | `FR-4.2`, `FR-4.3`, `FR-4.4`, `FR-4.16`, `FR-7.7` | BRD | Hiện hành |
| `INV-12` | Bản ghi chưa khớp được danh tính không được dùng làm căn cứ cho bất kỳ khuyến nghị nào | BRD 5.12.2 — bất biến | [UC24](#uc24), [UC28](#uc28) | `US-08-04`, `US-10-03` | `FR-4.5`, `FR-4.6`, `FR-4.10`, `FR-4.12`, `FR-4.12b`, `FR-4.13` | BRD | Hiện hành |
| `INV-13` | Mỗi nhà cung cấp chỉ có một Discovery Finding đang mở tại một thời điểm | BRD 5.12.2 — bất biến | [UC42](#uc42) | `US-13-03`, `US-13-07` | `FR-6.4`, `FR-6.6`, `FR-6.7`, `FR-6.8` | BRD | Hiện hành |
| `INV-14a` | Các khoảng hiệu lực *(nhân viên, Cost Center)* của cùng một nhân viên không chồng lấn — **nhiều nhất một** Cost Center tại mỗi thời điểm | BRD 5.12.2 — bất biến | [UC07](#uc07) | `US-03-01` | `FR-2.2`, `FR-3.1`, `FR-3.16` | BRD | Hiện hành |
| `INV-14b` | Mỗi nhân viên **luôn có** một Cost Center đang hiệu lực; trường này **không được rỗng** *(chốt ở v3.11 — `QĐ-30c`)* | BRD 5.12.2 — bất biến | [UC06](#uc06), [UC07](#uc07), [UC33](#uc33) | `US-02-03`, `US-04-09` | `FR-3.1`, `FR-9.3`, `FR-9.7` | BRD | Hiện hành |
| `INV-15` | Mọi bảng gốc nghiệp vụ mang cột định danh tổ chức, và cột này đứng đầu mọi ràng buộc duy nhất | BRD 5.12.2 — bất biến | — | — | — | BRD | Hiện hành |
| `INV-16` | Mỗi khoản cam kết ngân sách gắn với **đúng một** Request đã được Người duyệt chi duyệt; một Request có tối đa một khoản cam kết | BRD 5.12.2 — bất biến | [UC16](#uc16), [UC20](#uc20) | `US-06-04`, `US-06-07` | `FR-3.14`, `FR-5.8`, `FR-5.8a` | BRD | Hiện hành |
| `INV-17` | Không có bản ghi sử dụng nào từ thiết bị **chưa đăng ký** hoặc của nhân viên **chưa xác nhận chủ động** tại thời điểm ghi nhận | BRD 5.12.2 — bất biến | [UC26](#uc26), [UC27](#uc27) | `US-08-08`, `US-09-03`, `US-09-05`, `US-09-06`, `US-09-09`, `US-13-04` | `FR-4.3a`, `FR-4.14a`, `FR-4.17`, `FR-4.18`, `FR-4.19`, `FR-4.20`, `FR-10.4` | BRD | Hiện hành |
| `INV-18` | *(mới ở v3.11 — `QĐ-30b`)* Khoản cam kết ngân sách **được phép chưa gắn** `Budget` khi tại lúc duyệt chi chưa có ngân sách của cost center và kỳ đó; khoản đó **bắt buộc** mang lý do *Chưa có ngân sách* và nằm trong hàng đợi ghi nhận của Finance. Khi `Budget` của **đúng cost center và kỳ đó** được lập, hệ thống **gắn** mọi khoản cam kết chưa có ngân sách thuộc kỳ đó vào ngân sách vừa lập | BRD 5.12.2 — bất biến | [UC16](#uc16), [UC20](#uc20) | `US-06-07` | `FR-3.14`, `FR-5.8`, `FR-5.8a` | BRD | Hiện hành |
| `BR-01.1` | Không cho sang bước 4 nếu bước 1 và bước 3 chưa xong — không thể gán suất khi chưa có người và chưa có thuê bao | `F-01` Khởi tạo dữ liệu ban đầu | [UC06](#uc06) | `US-02-02`, `US-02-04`, `US-02-05` | `FR-9.1`, `FR-9.2`, `FR-9.3`, `FR-9.4`, `FR-9.6` | User Flows `F-01` | Hiện hành |
| `BR-01.2` | Bản ghi cấp quyền nhập ở bước 4 được phép **không có** yêu cầu nguồn, và phải đánh dấu là dữ liệu khởi tạo để phân biệt với bản ghi sinh từ quy trình | `F-01` Khởi tạo dữ liệu ban đầu | [UC06](#uc06) | `US-02-05` | `FR-9.4` | User Flows `F-01` | Hiện hành |
| `BR-01.3` | Mọi bước dùng chung khung import sáu bước, gồm cả bước xem trước bắt buộc — không có luồng nhập liệu riêng cho khởi tạo | `F-01` Khởi tạo dữ liệu ban đầu | [UC54](#uc54) | `US-02-01` | `FR-7.1`, `FR-7.4`, `FR-7.6`, `FR-9.2` | User Flows `F-01` | Hiện hành |
| `BR-01.4` | Trạng thái rỗng của mọi màn hình chính phải dẫn về đúng bước khởi tạo còn thiếu, không hiển thị trang trắng | `F-01` Khởi tạo dữ liệu ban đầu | [UC06](#uc06) | `US-02-04` | `FR-9.1`, `FR-9.2`, `FR-9.3`, `FR-9.6` | User Flows `F-01` | Hiện hành |
| `BR-01.5` | Dòng nhân sự **thiếu Cost Center** bị từ chối ở bước xem trước, nêu đúng dòng và cột; hệ thống **không** tạo nhân viên không có Cost Center và **không** dùng Cost Center kiểu *Chưa phân loại* để lách *(mới ở v0.8 — BRD `FR-9.7`, `INV-14b`, `QĐ-30c` — đồng bộ `BF-04`)* | `F-01` Khởi tạo dữ liệu ban đầu | [UC06](#uc06) | `US-02-03` | `FR-9.3`, `FR-9.7` | User Flows `F-01` · BRD `FR-9.7`, `INV-14b`, `QĐ-30c` — đồng bộ `BF-04` | Mới 25/09/2026 — OWNER DECISION |
| `BR-01.6` | Mã Cost Center trong file nhân sự phải **đã có** trong danh mục Cost Center do **Finance** quản lý; mã chưa có bị từ chối theo dòng ở bước xem trước, **không** tự tạo mã khi import *(mới ở v0.8 — OI-04 (Owner 25/09/2026))* | `F-01` Khởi tạo dữ liệu ban đầu | [UC06](#uc06), [UC07](#uc07), [UC33](#uc33) | `US-02-03`, `US-04-09` | `FR-3.1`, `FR-9.3`, `FR-9.7` | User Flows `F-01` · OI-04 (Owner 25/09/2026) | Mới 25/09/2026 — OWNER DECISION |
| `BR-01.7` | Giai đoạn khởi tạo — giai đoạn duy nhất được nhập Assignment **không có Request** — kết thúc khi IT Admin **chốt hoàn tất bước 4** trên checklist (ghi Audit Trail). Sau đó mọi Assignment phải có Request; không mở lại trong MVP; chênh lệch phát hiện sau đi qua đối soát sai lệch *(mới ở v0.8 — OI-10 (Owner 25/09/2026); BRD `FR-9.4`)* | `F-01` Khởi tạo dữ liệu ban đầu | [UC06](#uc06) | `US-02-05` | `FR-9.4` | User Flows `F-01` · OI-10 (Owner 25/09/2026); BRD `FR-9.4` | Mới 25/09/2026 — OWNER DECISION |
| `BR-02.1` | Quản lý được tạo yêu cầu hộ, nhưng **người thụ hưởng vẫn là nhân viên mới** — hai trường người yêu cầu và người thụ hưởng khác nhau | `F-02` Nhân viên mới vào | [UC11](#uc11) | `US-03-02` | `FR-3.2`, `FR-3.3` | User Flows `F-02` | Hiện hành |
| `BR-02.2` | Quản lý tạo hộ thì **không tự duyệt bước quản lý** của chính yêu cầu đó; yêu cầu chuyển lên cấp trên | `F-02` Nhân viên mới vào | [UC11](#uc11), [UC14](#uc14) | `US-03-02`, `US-05-03` | `FR-3.2`, `FR-3.3`, `FR-3.6`, `FR-3.7`, `FR-3.12` | User Flows `F-02` | Hiện hành |
| `BR-02.3` | Yêu cầu cho người chưa tới ngày vào làm được phép tạo trước, nhưng ngày hiệu lực của quyền không sớm hơn ngày vào | `F-02` Nhân viên mới vào | [UC11](#uc11) | `US-03-02` | `FR-3.2`, `FR-3.3` | User Flows `F-02` | Hiện hành |
| `BR-03.1` | Ngày hiệu lực được phép đặt trong quá khứ, nhưng phải cảnh báo là sẽ làm thay đổi báo cáo chi phí đã phát hành | `F-03` Nhân viên đổi người quản lý hoặc cost center | [UC07](#uc07) | `US-03-01` | `FR-2.2`, `FR-3.1`, `FR-3.16` | User Flows `F-03` | Hiện hành |
| `BR-03.2` | Các giai đoạn quan hệ tổ chức của cùng một nhân viên **không được chồng lấn** nhau | `F-03` Nhân viên đổi người quản lý hoặc cost center | [UC07](#uc07) | — | — | User Flows `F-03` | Hiện hành |
| `BR-03.3` | Suất **đi theo người**; chỉ đơn vị chịu chi phí thay đổi. Nhưng quản lý mới nhận danh sách để xem lại | `F-03` Nhân viên đổi người quản lý hoặc cost center | [UC07](#uc07) | — | — | User Flows `F-03` | Hiện hành |
| `BR-03.4` | Yêu cầu đã tới bước duyệt chi hoặc bước IT thì **không** chuyển approver — giữ nguyên để không mất tính liên tục của quyết định *(sửa ở v0.5, v0.7)* | `F-03` Nhân viên đổi người quản lý hoặc cost center | [UC07](#uc07), [UC14](#uc14) | `US-03-01`, `US-05-12` | `FR-2.2`, `FR-3.1`, `FR-3.16` | User Flows `F-03` | Hiện hành |
| `BR-04.1` | Số ngày không hoạt động tính bằng tổng ngày trừ đi khoảng thời gian nghỉ dài — nếu không, người vừa nghỉ ba tháng về sẽ bị báo ngay | `F-04` Nhân viên nghỉ dài và quay lại | [UC28](#uc28) | `US-03-03`, `US-10-03` | `FR-4.9`, `FR-4.10`, `FR-4.12`, `FR-4.12b`, `FR-4.13` | User Flows `F-04` | Hiện hành |
| `BR-04.2` | Trạng thái nghỉ dài do IT cập nhật tay; hệ thống **không** tích hợp hệ thống nhân sự | `F-04` Nhân viên nghỉ dài và quay lại | [UC07](#uc07) | — | — | User Flows `F-04` | Hiện hành |
| `BR-04.3` | Nghỉ dài quá thời hạn dự kiến mà chưa cập nhật thì hệ thống nhắc IT, không tự đổi trạng thái | `F-04` Nhân viên nghỉ dài và quay lại | [UC07](#uc07) | `US-03-03` | — | User Flows `F-04` | Hiện hành |
| `BR-05.1` | Khuyến nghị nhóm G2 có mức độ tin cậy tuyệt đối và mức xử lý cao nhất, **bỏ qua mọi ngưỡng ngày** | `F-05` Nhân viên nghỉ việc | [UC08](#uc08), [UC28](#uc28) | `US-03-04`, `US-10-01` | `FR-2.4`, `FR-4.12b`, `FR-10.6` | User Flows `F-05` | Hiện hành |
| `BR-05.2` | G2 **không cần** quản lý xác nhận — chuyển thẳng cho IT thực hiện. Người đã nghỉ thì không có gì để bàn | `F-05` Nhân viên nghỉ việc | [UC08](#uc08), [UC28](#uc28) | `US-10-01`, `US-10-05` | `FR-4.12b` | User Flows `F-05` | Hiện hành |
| `BR-05.3` | Trạng thái đã nghỉ việc bắt buộc có ngày nghỉ; không cho để trống | `F-05` Nhân viên nghỉ việc | [UC07](#uc07), [UC08](#uc08) | `US-03-04` | `FR-2.4`, `FR-10.6` | User Flows `F-05` | Hiện hành |
| `BR-05.4` | Thu hồi hàng loạt yêu cầu **gõ số lượng để xác nhận** và nhập lý do chung | `F-05` Nhân viên nghỉ việc | [UC08](#uc08), [UC22](#uc22) | — | — | User Flows `F-05` | Hiện hành |
| `BR-05.5` | Dữ liệu hoạt động chi tiết bị xóa sau 30 ngày kể từ ngày làm việc cuối; dữ liệu tổng hợp phi định danh và nhật ký kiểm toán được giữ lại | `F-05` Nhân viên nghỉ việc | [UC08](#uc08) | `US-03-04`, `US-14-03` | `FR-2.4`, `FR-10.6` | User Flows `F-05` | Hiện hành |
| `BR-05.6` | Hạn Manager xác nhận danh sách bàn giao mặc định là **1 ngày làm việc trước ngày làm việc cuối**; quá hạn chỉ nhắc. Tới ngày làm việc cuối IT **vẫn thu hồi**, ghi cờ *chưa xác nhận bàn giao* — bảo mật ưu tiên hơn bàn giao *(mới ở v0.8 — OI-14c (Owner 25/09/2026) — `OQ-US-08`)* | `F-05` Nhân viên nghỉ việc | [UC08](#uc08) | `US-03-04` | `FR-2.4`, `FR-10.6` | User Flows `F-05` · OI-14c (Owner 25/09/2026) — `OQ-US-08` | Mới 25/09/2026 — OWNER DECISION |
| `BR-06.1` | Người sở hữu nghiệp vụ **bắt buộc** và phải là người đang làm việc | `F-06` Khai báo danh mục, gói, hợp đồng, thuê bao | [UC09](#uc09) | `US-04-01`, `US-04-06` | `FR-1.1`, `FR-1.7`, `FR-1.8`, `FR-6.1` | User Flows `F-06` | Hiện hành |
| `BR-06.2` | Cờ nhóm dịch vụ liên lạc quyết định chế độ xử lý dữ liệu: nhóm này **mặc định không thu thập dữ liệu hoạt động**, chỉ dùng danh sách thành viên | `F-06` Khai báo danh mục, gói, hợp đồng, thuê bao | [UC09](#uc09) | `US-01-08`, `US-04-01` | `FR-1.1`, `FR-1.7`, `FR-1.8`, `FR-6.1` | User Flows `F-06` | Hiện hành |
| `BR-06.3` | Bình luận trong tài liệu, ghi chú trong công cụ quản lý công việc, nhận xét trên bản thiết kế **không** tính là nhắn tin | `F-06` Khai báo danh mục, gói, hợp đồng, thuê bao | [UC09](#uc09) | `US-04-01` | `FR-1.1`, `FR-1.7`, `FR-1.8`, `FR-6.1` | User Flows `F-06` | Hiện hành |
| `BR-06.4` | Mô hình giá không phải theo đầu người thì các phân hệ phát hiện lãng phí và đếm suất **không áp dụng** — giao diện hiển thị "không áp dụng", không hiển thị số 0 | `F-06` Khai báo danh mục, gói, hợp đồng, thuê bao | [UC09](#uc09), [UC28](#uc28), [UC56](#uc56) | `US-04-02` | `FR-1.2`, `FR-4.9` | User Flows `F-06` | Hiện hành |
| `BR-06.5` | Bật thu thập dữ liệu hoạt động cho nhóm liên lạc cần xác nhận của quản trị hệ thống, ghi nhật ký kiểm toán kèm lý do | `F-06` Khai báo danh mục, gói, hợp đồng, thuê bao | [UC03](#uc03) | `US-01-08` | — | User Flows `F-06` | Hiện hành |
| `BR-06.6` | Chuyển ứng dụng sang *ngừng sử dụng* là thao tác của IT Admin: kiểm tra quyền còn hiệu lực và ghi **xác nhận của Business Owner** (người, thời điểm, nội dung) làm căn cứ. Business Owner không có thao tác trên hệ thống *(mới ở v0.8 — OI-05b (Owner 25/09/2026) — `OQ-US-10`; BRD 4.4)* | `F-06` Khai báo danh mục, gói, hợp đồng, thuê bao | [UC09](#uc09) | `US-04-01` | `FR-1.1`, `FR-1.7`, `FR-1.8`, `FR-6.1` | User Flows `F-06` · OI-05b (Owner 25/09/2026) — `OQ-US-10`; BRD 4.4 | Mới 25/09/2026 — OWNER DECISION |
| `BR-06.7` | Business Owner nghỉ việc: giữ người cũ kèm cờ *cần thay thế* và cảnh báo IT tới khi có người mới đang làm việc; `INV-06` ghi nhận là vi phạm tạm thời có cảnh báo. Cảnh báo gia hạn **không** gửi cho người đã nghỉ *(mới ở v0.8 — OI-05c (Owner 25/09/2026) — `OQ-US-12`; BRD `FR-1.7`)* | `F-06` Khai báo danh mục, gói, hợp đồng, thuê bao | [UC08](#uc08), [UC09](#uc09) | `US-04-06`, `US-11-01` | `FR-1.7` | User Flows `F-06` · OI-05c (Owner 25/09/2026) — `OQ-US-12`; BRD `FR-1.7` | Mới 25/09/2026 — OWNER DECISION |
| `BR-06.8` | Tệp gốc hợp đồng/hóa đơn chỉ mở qua đường dẫn có thời hạn: IT Admin trong quản lý hợp đồng, Finance trong đối soát, **Người duyệt chi chỉ của hồ sơ đang được giao quyết**; Manager không mở (`SoD-2`) *(mới ở v0.8 — OI-08a (Owner 25/09/2026) — `OQ-US-11`; BRD `FR-1.5`)* | `F-06` Khai báo danh mục, gói, hợp đồng, thuê bao | [UC10](#uc10), [UC32](#uc32), [UC55](#uc55) | `US-04-04`, `US-06-01` | `FR-1.5`, `FR-3.13`, `FR-3.14`, `FR-5.8` | User Flows `F-06` · OI-08a (Owner 25/09/2026) — `OQ-US-11`; BRD `FR-1.5` | Mới 25/09/2026 — OWNER DECISION |
| `BR-06.9` | Mỗi mục danh mục có một **nhóm chức năng** chọn từ danh sách do IT Admin duy trì; dùng để hiện công cụ tương tự khi Manager xét nhu cầu và kiểm trùng chức năng khi đánh giá SaaS mới/Shadow IT. Không dùng cho `G5` (ngoài phạm vi) *(mới ở v0.8 — OI-14e (Owner 25/09/2026) — `OQ-US-14`)* | `F-06` Khai báo danh mục, gói, hợp đồng, thuê bao | [UC09](#uc09) | `US-04-01`, `US-05-04` | `FR-1.1`, `FR-1.7`, `FR-1.8`, `FR-6.1` | User Flows `F-06` · OI-14e (Owner 25/09/2026) — `OQ-US-14` | Mới 25/09/2026 — OWNER DECISION |
| `BR-07.1` | Bước 3 **không được bỏ**. Người yêu cầu phải nhìn thấy con số và thời gian dự kiến trước khi gửi — biện pháp rẻ nhất để giảm yêu cầu thừa | `F-07` Xin cấp suất | [UC11](#uc11) | `US-05-01` | `FR-3.2` | User Flows `F-07` | Hiện hành |
| `BR-07.2` | Chính sách duyệt được **chốt cứng tại thời điểm gửi**. Nếu quản trị hệ thống sửa chính sách giữa chừng, yêu cầu đang chạy vẫn theo luật cũ. *(v0.6 — phân phạm vi với `QĐ-28d`)* Thứ được chốt là **nhánh và chuỗi loại bước**; **người cụ thể** giữ một bước đang chờ vẫn được xác định lại khi có sự kiện dữ liệu theo `BR-13.9` | `F-07` Xin cấp suất | [UC11](#uc11) | `US-01-04`, `US-05-02`, `US-05-07`, `US-05-12` | `FR-3.2`, `FR-3.4` | User Flows `F-07` | Hiện hành |
| `BR-07.3` | Một nhân viên không được có hai quyền đang hiệu lực trên cùng một thuê bao | `F-07` Xin cấp suất | [UC11](#uc11), [UC21](#uc21) | `US-05-01`, `US-07-01` | `FR-2.3`, `FR-2.5`, `FR-2.7`, `FR-3.2` | User Flows `F-07` | Hiện hành |
| `BR-07.4` | Thời hạn cần dùng quá 12 tháng phải có xác nhận thêm — là **xác nhận tường minh của Manager** ngay trong bước xét nhu cầu, kèm lý do; không thêm bước duyệt *(làm rõ ở v0.8 — OI-07a, Owner 25/09/2026)* | `F-07` Xin cấp suất | [UC11](#uc11), [UC14](#uc14) | `US-05-01`, `US-05-04` | `FR-3.2`, `FR-3.3`, `FR-3.7`, `FR-3.11` | User Flows `F-07` | Làm rõ 25/09/2026 — OWNER DECISION |
| `BR-07.5` | Từ chối **bắt buộc** có lý do; duyệt thì không bắt buộc | `F-07` Xin cấp suất | [UC14](#uc14) | `US-05-04`, `US-06-01` | `FR-3.3`, `FR-3.7` | User Flows `F-07` | Hiện hành |
| `BR-07.6` | Hết suất giữa luồng thì **chèn thêm bước duyệt chi vào chuỗi hiện có**, không hủy yêu cầu bắt làm lại *(sửa ở v0.5, v0.7)* | `F-07` Xin cấp suất | [UC16](#uc16) | `US-05-07` | `FR-3.4` | User Flows `F-07` | Hiện hành |
| `BR-07.7` | Quá hạn xử lý thì nhắc người được giao và **thông báo** cấp trên — *escalate chỉ là thông báo*, **không đổi người duyệt**. **Không bao giờ tự duyệt** *(sửa ở v0.6 — `QĐ-28d`, BRD `FR-3.8`)* | `F-07` Xin cấp suất | [UC14](#uc14) | `US-05-09` | `FR-3.8` | User Flows `F-07` | Hiện hành |
| `BR-07.8` | *(mới ở v0.5)* **Quản lý trực tiếp chính là Người duyệt chi** ⟹ vẫn **hai bước riêng** cho cùng một người, nhật ký **gắn cờ *cùng người***. Người duyệt chi là người yêu cầu hoặc người thụ hưởng ⟹ không tự duyệt; bước duyệt chi **tạo thẳng cho người thay thế khi xung đột** đã cấu hình trước (`BR-13.10`), chưa cấu hình thì chờ có kiểm soát — BRD `SoD-7`, `FR-3.15`, `FR-3.12` *(sửa ở v0.6 — trước đó đi theo ủy quyền)* | `F-07` Xin cấp suất | [UC14](#uc14), [UC55](#uc55) | `US-01-05`, `US-06-01`, `US-06-08` | `FR-3.3`, `FR-3.5`, `FR-3.12`, `FR-3.13`, `FR-3.14`, `FR-3.15`, `FR-3.16` | User Flows `F-07` | Hiện hành |
| `BR-07.9` | *(mới ở v0.5; viết lại ở v0.7 — `QĐ-29b`)* **Tài chính không nằm trên đường duyệt.** Người duyệt chi quyết trên snapshot ngân sách; **hỏi Tài chính là tùy chọn**, bước vẫn thuộc Người duyệt chi, **SLA không dừng, không đặt lại**; câu trả lời và ghi nhận sau duyệt **không chặn** — Người duyệt chi quyết cả khi *Chưa có ngân sách* hoặc Tài chính chưa trả lời — BRD `FR-3.14` | `F-07` Xin cấp suất | [UC17](#uc17), [UC20](#uc20), [UC55](#uc55) | `US-06-01`, `US-06-02`, `US-06-03`, `US-06-05` | `FR-3.5`, `FR-3.13`, `FR-3.14`, `FR-5.8` | User Flows `F-07` | Hiện hành |
| `BR-07.10` | *(mới ở v0.5)* Khoản cam kết **chỉ sinh khi duyệt chi**. Từ chối thì không sinh; yêu cầu bị hủy hoặc cấp phát thất bại hẳn thì **giải phóng** — BRD `FR-5.8`, `INV-16` | `F-07` Xin cấp suất | [UC16](#uc16), [UC20](#uc20) | `US-06-01`, `US-06-04`, `US-06-06` | `FR-3.4`, `FR-3.13`, `FR-3.14`, `FR-5.1`, `FR-5.8` | User Flows `F-07` | Hiện hành |
| `BR-07.11` | Người yêu cầu được **rút** yêu cầu tới khi tác vụ cấp phát còn *chờ thực thi*, kể cả khi đã duyệt đủ; khoản cam kết (nếu có) được **giải phóng ngay** và Finance, IT được thông báo. Tác vụ đã *đang thực thi* thì không rút, dùng hoàn trả sau khi có quyền *(mới ở v0.8 — OI-06 (Owner 25/09/2026) — `BF-12`; BRD 5.12.3, `FR-5.8`)* | `F-07` Xin cấp suất | [UC11](#uc11), [UC20](#uc20) | `US-05-08`, `US-06-06` | `FR-3.12`, `FR-5.1`, `FR-5.8` | User Flows `F-07` · OI-06 (Owner 25/09/2026) — `BF-12`; BRD 5.12.3, `FR-5.8` | Mới 25/09/2026 — OWNER DECISION |
| `BR-09.1` | Bước 3 và bước 5 là **hai vai trò khác nhau của cùng bộ phận**: đánh giá được phép dùng hay không, và thực hiện. Không gộp | `F-09` Xin phần mềm chưa có trong danh mục | [UC15](#uc15) | `US-05-06` | `FR-3.4` | User Flows `F-09` | Hiện hành |
| `BR-09.2` | Kết quả "không duyệt" là kết quả hợp lệ và tích cực nếu công ty đã có công cụ tương đương — khi đó hệ thống hướng người yêu cầu sang công cụ sẵn có | `F-09` Xin phần mềm chưa có trong danh mục | [UC15](#uc15) | `US-05-06` | `FR-3.4` | User Flows `F-09` | Hiện hành |
| `BR-09.3` | Ứng dụng chạm dữ liệu ở mức nhạy cảm cao: IT **ghi nhận ý kiến** của người sở hữu nghiệp vụ ứng dụng tương đương (nếu có) hoặc Manager của người yêu cầu **trước** bước 4 *(bước duyệt chi)*. Ý kiến là **đầu vào không chặn** — không thêm bước, SLA hay người duyệt; không lấy được thì ghi rõ lý do *(làm rõ ở v0.8 — OI-05a, Owner 25/09/2026)* | `F-09` Xin phần mềm chưa có trong danh mục | [UC15](#uc15) | `US-05-06` | `FR-3.4` | User Flows `F-09` | Làm rõ 25/09/2026 — OWNER DECISION |
| `BR-09.4` | *(mới ở v0.5 — `QĐ-22`)* **SaaS chưa có trong danh mục luôn đi qua Người duyệt chi, kể cả gói miễn phí** — thêm một SaaS nghĩa là thêm một nơi dữ liệu công ty nằm và thêm một đối tượng phải quản trị. Snapshot ngân sách, khoản cam kết và ghi nhận của Tài chính **chỉ có khi có chi phí** *(sửa ở v0.7)* | `F-09` Xin phần mềm chưa có trong danh mục | [UC16](#uc16), [UC43](#uc43) | `US-05-06`, `US-06-01`, `US-13-06` | `FR-3.4`, `FR-3.4c-1`, `FR-3.13`, `FR-3.14`, `FR-5.8`, `FR-6.9` | User Flows `F-09` | Hiện hành |
| `BR-10.1` | Với kênh thủ công, hệ thống **không** tự chuyển sang hoàn tất; phải có tên người thật xác nhận | `F-10` Thực thi cấp phát | [UC21](#uc21), [UC22](#uc22) | `US-07-02` | `FR-2.5` | User Flows `F-10` | Hiện hành |
| `BR-10.2` | Khóa chống gọi trùng sinh từ dữ liệu nghiệp vụ, không sinh ngẫu nhiên — sinh ngẫu nhiên mỗi lần thử lại thì không chống được gì | `F-10` Thực thi cấp phát | [UC21](#uc21), [UC22](#uc22) | `US-07-03` | `FR-2.5` | User Flows `F-10` | Hiện hành |
| `BR-10.3` | Hai kênh dùng chung một hàng đợi và một cách đo, để so sánh được thời gian xử lý giữa ứng dụng có kết nối và ứng dụng làm tay | `F-10` Thực thi cấp phát | [UC21](#uc21), [UC22](#uc22) | `US-07-01`, `US-07-02` | `FR-2.3`, `FR-2.5`, `FR-2.7` | User Flows `F-10` | Hiện hành |
| `BR-10.4` | Quyền vẫn **chiếm chỗ** trong suốt thời gian đang thực hiện, kể cả khi thất bại — nếu nhả chỗ, người khác sẽ được gán và khi thử lại thành công thì vượt hạn mức | `F-10` Thực thi cấp phát | [UC21](#uc21), [UC22](#uc22) | `US-07-01`, `US-07-03` | `FR-2.3`, `FR-2.5`, `FR-2.7` | User Flows `F-10` | Hiện hành |
| `BR-12.1` | Thử lại một lỗi vĩnh viễn là vô nghĩa và gây hại — nó tạo sáu dòng nhật ký giống nhau và trì hoãn thời điểm có người thật nhìn vào | `F-12` Xử lý cấp phát thất bại | [UC21](#uc21), [UC22](#uc22) | `US-07-04` | `FR-2.5` | User Flows `F-12` | Hiện hành |
| `BR-12.2` | Việc thất bại **không biến mất khỏi tầm nhìn**; nằm trong hàng đợi cho tới khi có người quyết định thử lại hay đóng lại | `F-12` Xử lý cấp phát thất bại | [UC21](#uc21), [UC22](#uc22) | — | — | User Flows `F-12` | Hiện hành |
| `BR-12.3` | Thất bại quá 7 ngày chưa xử lý thì nổi lên bảng điều khiển như một mục nợ | `F-12` Xử lý cấp phát thất bại | [UC21](#uc21), [UC22](#uc22) | — | — | User Flows `F-12` | Hiện hành |
| `BR-12.4` | Thông báo lỗi cho người dùng cuối bằng tiếng Việt, không hiện mã lỗi kỹ thuật; mã lỗi để trong phần chi tiết mở rộng cho IT | `F-12` Xử lý cấp phát thất bại | [UC21](#uc21), [UC22](#uc22) | — | — | User Flows `F-12` | Hiện hành |
| `BR-12.5` | Người yêu cầu **cũng được báo** khi cấp phát thất bại — để họ biết mà không chờ vô ích | `F-12` Xử lý cấp phát thất bại | [UC11](#uc11), [UC21](#uc21) | `US-05-15`, `US-07-04` | `FR-2.5`, `FR-3.11` | User Flows `F-12` | Hiện hành |
| `BR-13.1` | 📁 **Nghỉ hưu ở v0.6** — chặn ủy quyền vòng tròn; không còn ủy quyền (`QĐ-27`) | `F-13` Xử lý bước duyệt nghẽn, xung đột lợi ích và xác định lại người duyệt | — *(nghỉ hưu)* | — | — | User Flows `F-13` | Nghỉ hưu |
| `BR-13.2` | Mọi lần xác định lại người duyệt **không đặt lại đồng hồ thời hạn xử lý**. Thời hạn thuộc về bước, không thuộc về người *(tới v0.5 phát biểu cho ủy quyền; nghĩa gốc giữ nguyên)* | `F-13` Xử lý bước duyệt nghẽn, xung đột lợi ích và xác định lại người duyệt | [UC14](#uc14), [UC55](#uc55) | `US-05-09`, `US-05-12` | `FR-3.5`, `FR-3.8`, `FR-3.16` | User Flows `F-13` | Hiện hành |
| `BR-13.3` | 📁 **Nghỉ hưu ở v0.6** — ràng buộc của người được ủy quyền; không còn ủy quyền. Nguyên tắc không tự duyệt vẫn giữ ở `SoD-4`, `INV-08` | `F-13` Xử lý bước duyệt nghẽn, xung đột lợi ích và xác định lại người duyệt | — *(nghỉ hưu)* | — | — | User Flows `F-13` | Nghỉ hưu |
| `BR-13.4` | Nhật ký ghi tách **người được giao** và **người quyết thực tế**, cộng lịch sử mọi lần xác định lại. Từ v0.6 hai người phải trùng nhau tại lúc quyết — lệch là lỗi phân quyền, không phải ủy quyền | `F-13` Xử lý bước duyệt nghẽn, xung đột lợi ích và xác định lại người duyệt | [UC14](#uc14) | `US-01-05`, `US-05-03`, `US-05-04` | `FR-3.3`, `FR-3.6`, `FR-3.7`, `FR-3.12` | User Flows `F-13` | Hiện hành |
| `BR-13.5` | 📁 **Nghỉ hưu ở v0.6** — người được ủy quyền trùng người yêu cầu (`QĐ-12`, bị `QĐ-27` thay thế) | `F-13` Xử lý bước duyệt nghẽn, xung đột lợi ích và xác định lại người duyệt | — *(nghỉ hưu)* | — | — | User Flows `F-13` | Nghỉ hưu |
| `BR-13.6` | **Hết người duyệt hợp lệ trong cả chuỗi ⟹ giữ Request ở trạng thái chờ**, gắn cờ *chưa có người duyệt hợp lệ*, nhắc và **thông báo** theo `FR-3.8`, **báo Quản trị hệ thống cấu hình lại**. Không tự duyệt, không tự từ chối, không giao quyền duyệt cho Quản trị hệ thống *(`SoD-1`)* — `QĐ-13`, BRD `FR-3.12` *(sửa ở v0.6: bỏ chữ “leo cấp”)* | `F-13` Xử lý bước duyệt nghẽn, xung đột lợi ích và xác định lại người duyệt | [UC14](#uc14) | `US-05-11` | `FR-3.6`, `FR-3.8`, `FR-3.12` | User Flows `F-13` | Hiện hành |
| `BR-13.7` | 📁 **Nghỉ hưu ở v0.6** — Người duyệt chi ủy quyền được; không còn ủy quyền | `F-13` Xử lý bước duyệt nghẽn, xung đột lợi ích và xác định lại người duyệt | — *(nghỉ hưu)* | — | — | User Flows `F-13` | Nghỉ hưu |
| `BR-13.8` | *(mới ở v0.6 — `QĐ-27`, `QĐ-28d`)* **Nghẽn chỉ được xử lý bằng nhắc, thông báo và cảnh báo.** Không ủy quyền, không đổi người, không tự duyệt, không tự từ chối. Quản trị hệ thống **không** được duyệt thay — BRD `FR-3.5`, `FR-3.8` | `F-13` Xử lý bước duyệt nghẽn, xung đột lợi ích và xác định lại người duyệt | [UC03](#uc03), [UC14](#uc14) | `US-05-09`, `US-05-10` | `FR-3.5`, `FR-3.8`, `FR-8.2` | User Flows `F-13` | Hiện hành |
| `BR-13.9` | *(mới ở v0.6 — `QĐ-28d`)* **Chỉ xác định lại người duyệt khi có sự kiện dữ liệu thật** — `manager_id` đổi, người được giao nghỉ việc hoặc không còn hợp lệ, Quản trị hệ thống đổi cấu hình vai trò. Nghỉ phép, vắng mặt, backlog cao **không** phải sự kiện — BRD `FR-3.16` | `F-13` Xử lý bước duyệt nghẽn, xung đột lợi ích và xác định lại người duyệt | [UC03](#uc03), [UC14](#uc14) | `US-03-01`, `US-05-09`, `US-05-12` | `FR-3.5`, `FR-3.8`, `FR-3.16` | User Flows `F-13` | Hiện hành |
| `BR-13.10` | *(mới ở v0.6 — `QĐ-28c`)* **Người thay thế khi xung đột** là cấu hình tĩnh của Quản trị hệ thống, lập trước. Chỉ áp khi Người duyệt chi là người yêu cầu hoặc người thụ hưởng; **không** do Quản lý, Người duyệt chi hay người yêu cầu chọn; **không** áp cho backlog; **không** tạo ứng viên song song; **không** dùng để né SLA — bước được tạo thẳng cho người thay thế ngay từ đầu. Người thay thế chịu đủ `SoD-7`, `SoD-8` — BRD `FR-3.15` | `F-13` Xử lý bước duyệt nghẽn, xung đột lợi ích và xác định lại người duyệt | [UC03](#uc03), [UC55](#uc55) | `US-01-03`, `US-06-08` | `FR-3.5`, `FR-3.6`, `FR-3.12`, `FR-3.13`, `FR-3.15`, `FR-3.16`, `FR-8.2` | User Flows `F-13` | Hiện hành |
| `BR-13.11` | SLA của mọi loại bước tính theo **giờ làm việc** của tổ chức; mặc định **2 ngày làm việc**, Super Admin chỉnh theo từng loại bước *(mới ở v0.8 — OI-14a (Owner 25/09/2026) — `OQ-US-02`; BRD `FR-3.8`)* | `F-13` Xử lý bước duyệt nghẽn, xung đột lợi ích và xác định lại người duyệt | [UC03](#uc03), [UC14](#uc14), [UC55](#uc55) | `US-01-04`, `US-05-09` | `FR-3.5`, `FR-3.8`, `FR-4.13`, `FR-4.17`, `FR-8.2` | User Flows `F-13` · OI-14a (Owner 25/09/2026) — `OQ-US-02`; BRD `FR-3.8` | Mới 25/09/2026 — OWNER DECISION |
| `BR-13.12` | Không lưu được cấu hình *Người duyệt chi thay thế khi xung đột* **trùng** Người duyệt chi (kể cả khi đổi Người duyệt chi thành chính người thay thế) *(mới ở v0.8 — OI-17 (Owner 25/09/2026) — `OQ-US-01`; BRD `FR-3.15`)* | `F-13` Xử lý bước duyệt nghẽn, xung đột lợi ích và xác định lại người duyệt | [UC03](#uc03) | `US-01-03` | `FR-3.5`, `FR-3.6`, `FR-3.12`, `FR-3.13`, `FR-3.15`, `FR-3.16`, `FR-8.2` | User Flows `F-13` · OI-17 (Owner 25/09/2026) — `OQ-US-01`; BRD `FR-3.15` | Mới 25/09/2026 — OWNER DECISION |
| `BR-14.1` | Không cho thu hồi "không lý do" — mọi thu hồi phải gắn với một nguồn quyết định | `F-14` Hoàn trả và gia hạn có thời hạn | [UC13](#uc13), [UC22](#uc22) | `US-05-13`, `US-07-05` | `FR-2.4`, `FR-3.2`, `FR-4.15` | User Flows `F-14` | Hiện hành |
| `BR-14.2` | Suất được nhả về trạng thái trống **chỉ sau khi** tài khoản thật đã bị xóa hoặc IT xác nhận không cần xóa | `F-14` Hoàn trả và gia hạn có thời hạn | [UC13](#uc13), [UC22](#uc22) | `US-05-13`, `US-07-05` | `FR-2.4`, `FR-3.2`, `FR-4.15` | User Flows `F-14` | Hiện hành |
| `BR-15.1` | Gia hạn quá 12 tháng liên tiếp cần xác nhận thêm — **xác nhận tường minh của Manager** trong bước xét nhu cầu như `BR-07.4` *(làm rõ ở v0.8 — OI-07a)* | `F-15` Hoàn trả và gia hạn có thời hạn | [UC11](#uc11), [UC14](#uc14) | `US-05-14` | `FR-3.2` | User Flows `F-15` | Làm rõ 25/09/2026 — OWNER DECISION |
| `BR-17.1` | Khoảng thời gian bao phủ **bắt buộc**. File không tự chứa thì IT khai tay, không cho bỏ qua | `F-17` Import dữ liệu sử dụng | [UC24](#uc24) | `US-02-01`, `US-08-01`, `US-08-02` | `FR-4.1`, `FR-4.2`, `FR-4.3`, `FR-4.4`, `FR-4.16` | User Flows `F-17` | Hiện hành |
| `BR-17.2` | Chuẩn hóa múi giờ về múi giờ tổ chức **trước khi** cắt theo ngày | `F-17` Import dữ liệu sử dụng | [UC54](#uc54) | — | — | User Flows `F-17` | Hiện hành |
| `BR-17.3` | Chuẩn hóa email theo đúng một hàm dùng chung, áp cả khi tạo ánh xạ lẫn khi đối chiếu | `F-17` Import dữ liệu sử dụng | [UC54](#uc54) | `US-02-01` | `FR-7.1`, `FR-7.4`, `FR-7.6`, `FR-9.2` | User Flows `F-17` | Hiện hành |
| `BR-17.4` | Sự kiện chỉ mang tính xác thực — đăng nhập, chuyển hướng đăng nhập một lần — **không** tính là hoạt động | `F-17` Import dữ liệu sử dụng | [UC24](#uc24) | `US-08-03` | `FR-4.7`, `FR-4.8`, `FR-4.11` | User Flows `F-17` | Hiện hành |
| `BR-17.5` | Mẫu cấu hình **bắt buộc** khai báo nguồn hiểu "hoạt động" là gì. Nguồn có định nghĩa lỏng bị hạ mức tin cậy | `F-17` Import dữ liệu sử dụng | [UC24](#uc24) | `US-08-01` | `FR-4.2`, `FR-4.3`, `FR-4.4`, `FR-4.16` | User Flows `F-17` | Hiện hành |
| `BR-17.6` | Dữ liệu hoạt động gắn vào **quyền đang hiệu lực tại ngày xảy ra sự kiện**, không gắn vào con người | `F-17` Import dữ liệu sử dụng | [UC24](#uc24) | `US-08-03` | `FR-4.7`, `FR-4.8`, `FR-4.11` | User Flows `F-17` | Hiện hành |
| `BR-17.7` | Lỗi ở một dòng không làm hỏng cả file | `F-17` Import dữ liệu sử dụng | [UC54](#uc54) | `US-02-01` | `FR-7.1`, `FR-7.4`, `FR-7.6`, `FR-9.2` | User Flows `F-17` | Hiện hành |
| `BR-17.8` | Không import dữ liệu hoạt động cho ứng dụng có cờ nhóm dịch vụ liên lạc, trừ khi đã được bật có chủ đích | `F-17` Import dữ liệu sử dụng | [UC24](#uc24) | `US-01-08`, `US-08-02` | `FR-4.1` | User Flows `F-17` | Hiện hành |
| `BR-17.9` | *(mới ở v0.5 — `QĐ-20`)* Dữ liệu từ bộ thu thập **không đi qua bước xem trước** vì đến tự động theo ngày, nhưng vẫn qua đủ **khớp danh tính, cửa sổ bao phủ, định nghĩa hoạt động**; và **bị từ chối ngay tại cổng nhận** nếu thiết bị chưa đăng ký, nhân viên chưa xác nhận, hoặc bản ghi mang trường ngoài lược đồ — BRD `INV-17`, `ADR-13` | `F-17` Import dữ liệu sử dụng | [UC24](#uc24), [UC26](#uc26) | `US-02-01`, `US-09-05` | `FR-4.17`, `FR-4.18` | User Flows `F-17` | Hiện hành |
| `BR-18.1` | Bản ghi chưa khớp **không bao giờ** được dùng để kết luận về bất kỳ ai | `F-18` Xử lý hàng đợi chưa khớp danh tính | [UC24](#uc24) | `US-08-04` | `FR-4.5`, `FR-4.6` | User Flows `F-18` | Hiện hành |
| `BR-18.2` | Giữ **cả chuỗi gốc lẫn bản đã chuẩn hóa** — khi IT phải giải thích vì sao kết luận `baovh` là Vũ Hoàng Bảo, họ cần thấy chuỗi gốc | `F-18` Xử lý hàng đợi chưa khớp danh tính | [UC24](#uc24) | — | — | User Flows `F-18` | Hiện hành |
| `BR-18.3` | Khớp thủ công bắt buộc ghi tên người xác nhận | `F-18` Xử lý hàng đợi chưa khớp danh tính | [UC24](#uc24) | — | — | User Flows `F-18` | Hiện hành |
| `BR-18.4` | Một định danh khớp về hai nhân viên khác nhau thì chặn, đưa lên cho người xử lý | `F-18` Xử lý hàng đợi chưa khớp danh tính | [UC24](#uc24) | `US-08-04` | `FR-4.5`, `FR-4.6` | User Flows `F-18` | Hiện hành |
| `BR-19.1` | G1 nhắm vào **thuê bao**, không nhắm vào người — hành động là giảm số lượng tại kỳ gia hạn | `F-19` Phát hiện lãng phí | [UC28](#uc28) | `US-10-01`, `US-10-05` | `FR-4.12b` | User Flows `F-19` | Hiện hành |
| `BR-19.2` | G2 bỏ qua mọi ngưỡng ngày và không cần quản lý xác nhận | `F-19` Phát hiện lãng phí | [UC28](#uc28) | `US-10-01` | `FR-4.12b` | User Flows `F-19` | Hiện hành |
| `BR-20.1` | Ngưỡng phân giải theo thứ tự: từng ứng dụng > tổ chức > mặc định hệ thống *(sửa ở v0.5 — bỏ cấp phòng ban, `QĐ-23`)* | `F-20` Phát hiện lãng phí | [UC03](#uc03), [UC28](#uc28) | `US-01-04`, `US-10-03` | `FR-3.8`, `FR-4.10`, `FR-4.12`, `FR-4.12b`, `FR-4.13`, `FR-4.17`, `FR-8.2` | User Flows `F-20` | Hiện hành |
| `BR-20.2` | Số tiết kiệm thực hiện được ngay chỉ lớn hơn 0 khi gói theo tháng hoặc hợp đồng cho giảm giữa kỳ | `F-20` Phát hiện lãng phí | [UC28](#uc28), [UC56](#uc56) | `US-10-04`, `US-10-05`, `US-10-07` | `FR-4.14`, `FR-4.15` | User Flows `F-20` | Hiện hành |
| `BR-20.3` | Bằng chứng là **bản chụp tại thời điểm sinh**, không phải con trỏ tới nguồn — nếu nguồn bị import đè, khuyến nghị cũ sẽ hiển thị căn cứ của dữ liệu mới | `F-20` Phát hiện lãng phí | [UC28](#uc28) | `US-10-04` | `FR-4.14`, `FR-4.15` | User Flows `F-20` | Hiện hành |
| `BR-20.4` | Cổng lọc số 6 làm cả lần chạy dừng cho ứng dụng đó, **không** âm thầm chạy với dữ liệu cũ | `F-20` Phát hiện lãng phí | [UC28](#uc28) | `US-10-02` | `FR-4.9`, `FR-4.12` | User Flows `F-20` | Hiện hành |
| `BR-20.5` | Mức "theo dõi" **không gửi thông báo** — nếu mọi phát hiện đều gửi thư, quản lý sẽ lọc vào thùng rác trong tuần đầu. **Chốt ở `QĐ-09`, đã ghi vào `FR-4.12`:** mức này **chỉ IT Admin thấy**, không hiện trên màn hình của quản lý; quản lý chỉ nhận từ mức *cần xem xét* trở lên | `F-20` Phát hiện lãng phí | [UC28](#uc28) | `US-10-03`, `US-10-05` | `FR-4.10`, `FR-4.12`, `FR-4.12b`, `FR-4.13` | User Flows `F-20` | Hiện hành |
| `BR-20.6` | `G1`, `G2` chỉ áp **cổng 1** (gói per-seat) và **cổng 8** (không trùng khuyến nghị mở); cổng 2–7 là cổng bằng chứng sử dụng/người dùng, chỉ áp `G3`, `G4` *(mới ở v0.8 — OI-12a (Owner 25/09/2026) — `OQ-US-22`; BRD `FR-4.9`)* | `F-20` Phát hiện lãng phí | [UC28](#uc28) | `US-10-01`, `US-10-02` | `FR-4.9`, `FR-4.12`, `FR-4.12b` | User Flows `F-20` · OI-12a (Owner 25/09/2026) — `OQ-US-22`; BRD `FR-4.9` | Mới 25/09/2026 — OWNER DECISION |
| `BR-20.7` | Cổng 5 chỉ dùng các ngày bao phủ **từ ngày bắt đầu Assignment**: đủ ngưỡng tầng tương ứng (`FR-4.12`) thì được kết luận, thiếu thì không kết luận và ghi lý do cổng 5 *(mới ở v0.8 — OI-12b (Owner 25/09/2026) — `OQ-US-23`)* | `F-20` Phát hiện lãng phí | [UC28](#uc28) | `US-10-02` | `FR-4.9`, `FR-4.12` | User Flows `F-20` · OI-12b (Owner 25/09/2026) — `OQ-US-23` | Mới 25/09/2026 — OWNER DECISION |
| `BR-21.1` | Quản lý **không** xem được nhật ký hoạt động thô — chỉ thấy số liệu tổng hợp | `F-21` Quản lý xác nhận | [UC28](#uc28) | `US-10-06`, `US-14-05` | `FR-3.10` | User Flows `F-21` | Hiện hành |
| `BR-21.2` | Chọn hàng loạt phải nhập **một** lý do chung, không cho để trống | `F-21` Quản lý xác nhận | [UC28](#uc28) | — | — | User Flows `F-21` | Hiện hành |
| `BR-21.3` | Miễn trừ không có ngày hết hạn bị chặn ở cả ba tầng: giao diện, dịch vụ, cơ sở dữ liệu | `F-21` Quản lý xác nhận | [UC28](#uc28) | — | — | User Flows `F-21` | Hiện hành |
| `BR-21.4` | Hiển thị phải nêu rõ giới hạn dữ liệu, ví dụ *"nguồn chỉ bao phủ 30 ngày — chưa đủ để kết luận chưa từng dùng"* | `F-21` Quản lý xác nhận | [UC28](#uc28) | `US-10-04` | `FR-4.14`, `FR-4.15` | User Flows `F-21` | Hiện hành |
| `BR-21.5` | "Giữ lại" **không** đóng vĩnh viễn; chu kỳ sau vẫn hỏi nhưng hiển thị kèm quyết định lần trước | `F-21` Quản lý xác nhận | [UC28](#uc28) | `US-10-06` | `FR-3.10` | User Flows `F-21` | Hiện hành |
| `BR-21.6` | Khuyến nghị bị dữ liệu mới phủ định thì đóng **im lặng**, không thông báo | `F-21` Quản lý xác nhận | [UC28](#uc28) | `US-10-04` | `FR-4.14`, `FR-4.15` | User Flows `F-21` | Hiện hành |
| `BR-22.1` | OI-02: Manager quyết cuối Keep/Reclaim/Exempt; IT trả lại tối đa một lần có lý do kỹ thuật/hợp đồng, sau đó thực thi nếu Reclaim. G2 không qua Manager; lỗi kỹ thuật không là quyền phủ quyết lần hai. | `F-22` Thu hồi và mở lại khuyến nghị | [UC22](#uc22), [UC28](#uc28) | `US-10-07` | `FR-2.4`, `FR-4.15` | User Flows `F-22` | Hiện hành |
| `BR-22.2` | Số tiết kiệm ghi nhận vào báo cáo là số **thực tế thu được**, không phải số ước tính ban đầu | `F-22` Thu hồi và mở lại khuyến nghị | [UC22](#uc22), [UC56](#uc56) | `US-10-07`, `US-12-04` | `FR-2.4`, `FR-4.15`, `FR-5.9`, `FR-5.12` | User Flows `F-22` | Hiện hành |
| `BR-23.1` | Thông báo trước 7 ngày khi miễn trừ sắp hết hạn, để quản lý chuẩn bị | `F-23` Thu hồi và mở lại khuyến nghị | [UC28](#uc28) | `US-10-06`, `US-10-08` | `FR-3.10` | User Flows `F-23` | Hiện hành |
| `BR-26.1` | Cảnh báo tính từ **hạn chót báo hủy**, không tính từ ngày gia hạn | `F-26` Cảnh báo trước hạn chót báo hủy | [UC29](#uc29) | `US-04-03`, `US-11-01` | `FR-1.4` | User Flows `F-26` | Hiện hành |
| `BR-26.2` | Mỗi mốc cảnh báo hiển thị kèm **các khuyến nghị lãng phí đang mở của chính thuê bao đó** | `F-26` Cảnh báo trước hạn chót báo hủy | [UC29](#uc29) | `US-11-01` | `FR-1.4` | User Flows `F-26` | Hiện hành |
| `BR-26.3` | Thuê bao tự gia hạn mà không có quyết định được ghi nhận trước hạn báo hủy được đếm vào chỉ số KPI-4 như một sự cố | `F-26` Cảnh báo trước hạn chót báo hủy | [UC29](#uc29), [UC30](#uc30) | `US-11-04` | — | User Flows `F-26` | Hiện hành |
| `BR-26.4` | Mốc T−15 gửi cảnh báo cho IT Admin, Finance, Business Owner **và Người duyệt chi**; mốc T−7 báo thêm Super Admin *(mới ở v0.8 — OI-09a (Owner 25/09/2026) — `BF-08`; BRD 4.4, `FR-1.4`)* | `F-26` Cảnh báo trước hạn chót báo hủy | [UC29](#uc29) | `US-11-01` | `FR-1.4` | User Flows `F-26` · OI-09a (Owner 25/09/2026) — `BF-08`; BRD 4.4, `FR-1.4` | Mới 25/09/2026 — OWNER DECISION |
| `BR-27.1` | Gia hạn **không sửa đè** ngày trên bản ghi cũ — sửa đè sẽ xóa mất lịch sử giá và số lượng | `F-27` Quyết định gia hạn | [UC10](#uc10) | `US-11-03` | — | User Flows `F-27` | Hiện hành |
| `BR-27.2` | Số tiết kiệm thật chỉ được ghi nhận khi số suất kỳ mới **thấp hơn** kỳ cũ | `F-27` Quyết định gia hạn | [UC10](#uc10), [UC56](#uc56) | `US-11-03`, `US-12-04` | `FR-4.15`, `FR-5.9`, `FR-5.12` | User Flows `F-27` | Hiện hành |
| `BR-27.3` | Hủy dịch vụ phải kiểm tra còn quyền nào đang hiệu lực không, và cảnh báo người đang dùng | `F-27` Quyết định gia hạn | [UC10](#uc10) | `US-11-02` | `FR-4.15` | User Flows `F-27` | Hiện hành |
| `BR-27.4` | *(mới ở v0.5 — `QĐ-22`; sửa ở v0.7 — `QĐ-29b`)* Quyết định gia hạn, giảm, hủy thuộc **Người duyệt chi**, trên snapshot ngân sách; hỏi Tài chính là tùy chọn, Tài chính ghi nhận **sau** quyết định. Cùng một nguyên tắc với luồng mua mới — BRD `FR-3.13`, `FR-3.14` | `F-27` Quyết định gia hạn | [UC30](#uc30) | `US-06-02`, `US-10-05`, `US-11-02` | `FR-3.13`, `FR-3.14` | User Flows `F-27` | Hiện hành |
| `BR-27.5` | Quyết định **giảm** xuống dưới số Assignment đang hiệu lực: hệ thống liệt kê phần vượt (ưu tiên khuyến nghị lãng phí đang mở), IT thu hồi **trước** ngày bắt đầu kỳ mới; kỳ mới chỉ được ghi khi số Assignment ≤ số đã mua (`INV-01`) *(mới ở v0.8 — OI-11c (Owner 25/09/2026) — `OQ-US-25`)* | `F-27` Quyết định gia hạn | [UC10](#uc10), [UC30](#uc30) | `US-04-03`, `US-11-02`, `US-11-03` | `FR-1.3`, `FR-1.4`, `FR-3.13`, `FR-3.14`, `FR-4.15` | User Flows `F-27` · OI-11c (Owner 25/09/2026) — `OQ-US-25` | Mới 25/09/2026 — OWNER DECISION |
| `BR-28.1` | Chỉ đối soát ứng dụng có kết nối tự động; ứng dụng không có kết nối **không sinh sai lệch giả** | `F-28` Đối soát với nhà cung cấp | [UC23](#uc23) | `US-07-06` | `FR-2.6`, `FR-4.8`, `FR-7.7` | User Flows `F-28` | Hiện hành |
| `BR-28.2` | Hệ thống **không tự sửa** để hai bên khớp nhau — xem F-43 | `F-28` Đối soát với nhà cung cấp | [UC23](#uc23) | `US-07-07` | `FR-7.7` | User Flows `F-28` | Hiện hành |
| `BR-28.3` | Sai lệch loại "có ở nhà cung cấp nhưng hệ thống không biết" gửi thông báo mức rất cao | `F-28` Đối soát với nhà cung cấp | [UC23](#uc23) | `US-07-06` | `FR-2.6`, `FR-4.8`, `FR-7.7` | User Flows `F-28` | Hiện hành |
| `BR-29.1` | Mọi số tiền hiển thị theo đồng tiền báo cáo; di chuột thì hiện nguyên tệ và tỷ giá đã dùng | `F-29` Bảng chi tiêu, tiết kiệm và phân bổ | [UC10](#uc10), [UC20](#uc20), [UC32](#uc32), [UC56](#uc56) | `US-04-05`, `US-12-01` | `FR-1.6`, `FR-5.1`, `FR-5.2`, `FR-5.3`, `FR-5.6`, `FR-5.8` | User Flows `F-29` | Hiện hành |
| `BR-29.2` | Bảng luôn hiển thị **cơ sở ghi nhận đang xem** — theo kỳ hay theo dòng tiền — không để người dùng đọc một con số mà không biết nó là gì | `F-29` Bảng chi tiêu, tiết kiệm và phân bổ | [UC56](#uc56) | — | — | User Flows `F-29` | Hiện hành |
| `BR-29.3` | Chi phí của gói theo đầu người quy về **cost center** của nhân viên **tại thời điểm phát sinh**, không phải cost center hiện tại *(sửa chữ ở v0.5)* | `F-29` Bảng chi tiêu, tiết kiệm và phân bổ | [UC33](#uc33) | `US-04-08` | `FR-5.2` | User Flows `F-29` | Hiện hành |
| `BR-29.4` | Chi phí của gói cố định và gói dùng chung chia theo tỷ lệ khai ở cấp thuê bao | `F-29` Bảng chi tiêu, tiết kiệm và phân bổ | [UC33](#uc33) | `US-04-08` | `FR-5.2` | User Flows `F-29` | Hiện hành |
| `BR-29.5` | Hiển thị **thời điểm dữ liệu cập nhật gần nhất**; chỉ gọi là thời gian thực khi nguồn thực sự hỗ trợ | `F-29` Bảng chi tiêu, tiết kiệm và phân bổ | [UC56](#uc56) | `US-12-01` | `FR-5.1`, `FR-5.2`, `FR-5.3`, `FR-5.6` | User Flows `F-29` | Hiện hành |
| `BR-29.6` | *(mới ở v0.5 — `QĐ-23`, `QĐ-24`)* Thêm các chiều nhóm **theo ứng dụng, nhà cung cấp, và cây người phụ trách** — tổng chi của mọi người dưới quyền một người, theo quan hệ quản lý có hiệu lực tại thời điểm phát sinh. **Không** có chiều nhóm theo phòng ban | `F-29` Bảng chi tiêu, tiết kiệm và phân bổ | [UC56](#uc56) | — | — | User Flows `F-29` | Hiện hành |
| `BR-29.7` | *(mới ở v0.5)* Tách ba con số **ngân sách — thực chi — khoản cam kết đang giữ**. Bảng **tiết kiệm** luôn đặt cạnh tổng chi, với *tiết kiệm thực hiện ngay* và *tiết kiệm tại kỳ gia hạn* **tách riêng, không cộng** — BRD `FR-5.8`, `FR-5.9` | `F-29` Bảng chi tiêu, tiết kiệm và phân bổ | [UC20](#uc20), [UC56](#uc56) | `US-12-01`, `US-12-04` | `FR-4.15`, `FR-5.1`, `FR-5.2`, `FR-5.3`, `FR-5.6`, `FR-5.8`, `FR-5.9`, `FR-5.12` | User Flows `F-29` | Hiện hành |
| `BR-29.8` | Manager thấy **thực chi và cam kết đang giữ** quy về người trong cây cấp dưới (theo hiệu lực thời gian), nhóm theo ứng dụng/nhà cung cấp; **không** thấy ngân sách, số còn lại, tổng công ty hay cây khác *(mới ở v0.8 — OI-08b (Owner 25/09/2026) — `OQ-US-26`; BRD 5.5.3, `SoD-2`)* | `F-29` Bảng chi tiêu, tiết kiệm và phân bổ | [UC56](#uc56) | `US-12-01` | `FR-5.1`, `FR-5.2`, `FR-5.3`, `FR-5.6` | User Flows `F-29` · OI-08b (Owner 25/09/2026) — `OQ-US-26`; BRD 5.5.3, `SoD-2` | Mới 25/09/2026 — OWNER DECISION |
| `BR-29.9` | Danh mục Cost Center (`Unit`/`Project`/`Company`) do **Finance** tạo, sửa và ngừng dùng; IT Admin không tạo mã; không tạo Cost Center *Chưa phân loại* *(mới ở v0.8 — OI-04 (Owner 25/09/2026) — `OQ-US-05`; BRD `FR-3.1`, `FR-9.7`)* | `F-29` Bảng chi tiêu, tiết kiệm và phân bổ | [UC33](#uc33) | `US-04-09` | `FR-3.1`, `FR-9.7` | User Flows `F-29` · OI-04 (Owner 25/09/2026) — `OQ-US-05`; BRD `FR-3.1`, `FR-9.7` | Mới 25/09/2026 — OWNER DECISION |
| `BR-30.1` | Không dùng mô hình thống kê cho lớp L1 — dùng sẽ cho kết quả **kém chính xác hơn** đọc thẳng hợp đồng | `F-30` Dự báo chi phí ba lớp | [UC36](#uc36) | `US-12-03` | `FR-5.5`, `FR-5.6`, `FR-5.7` | User Flows `F-30` | Hiện hành |
| `BR-30.2` | **Không** hiển thị con số dự báo trần trụi trong bất kỳ trường hợp nào; luôn kèm khoảng dữ liệu, giả định, sai số đo được và thời điểm tính | `F-30` Dự báo chi phí ba lớp | [UC36](#uc36) | — | — | User Flows `F-30` | Hiện hành |
| `BR-30.3` | Sai số đo được hiển thị cạnh dự báo, không chỉ dùng ngầm để bật tắt | `F-30` Dự báo chi phí ba lớp | [UC36](#uc36) | `US-12-03` | `FR-5.5`, `FR-5.6`, `FR-5.7` | User Flows `F-30` | Hiện hành |
| `BR-31.1` | Bản ghi phát hiện **không phải** kết luận vi phạm — là "có dấu hiệu một phần mềm chưa nằm trong danh mục", chờ người xem xét | `F-31` Phát hiện phần mềm ngoài danh mục | [UC42](#uc42) | `US-13-03`, `US-13-05` | `FR-6.4`, `FR-6.6`, `FR-6.7`, `FR-6.8`, `FR-6.9` | User Flows `F-31` | Hiện hành |
| `BR-31.2` | Mỗi nhà cung cấp chỉ có một bản ghi đang mở; xuất hiện lại thì cập nhật lần thấy gần nhất và số lần, không tạo bản ghi mới | `F-31` Phát hiện phần mềm ngoài danh mục | [UC42](#uc42) | — | — | User Flows `F-31` | Hiện hành |
| `BR-31.3` | Bản ghi đã đóng ở trạng thái báo nhầm mà xuất hiện lại thì được mở lại | `F-31` Phát hiện phần mềm ngoài danh mục | [UC42](#uc42) | `US-13-03` | `FR-6.4`, `FR-6.6`, `FR-6.7`, `FR-6.8` | User Flows `F-31` | Hiện hành |
| `BR-31.4` | Lưu **cả giá trị thô lẫn giá trị đã chuẩn hóa** kèm phương pháp khớp, để giải trình được | `F-31` Phát hiện phần mềm ngoài danh mục | [UC42](#uc42), [UC54](#uc54) | `US-13-01` | `FR-6.3`, `FR-6.4`, `FR-6.5` | User Flows `F-31` | Hiện hành |
| `BR-31.5` | Phân tầng rủi ro theo mức nhạy cảm dữ liệu, số nhân viên liên quan, và ứng dụng có hỗ trợ đăng nhập tập trung không | `F-31` Phát hiện phần mềm ngoài danh mục | [UC42](#uc42) | `US-13-03` | `FR-6.4`, `FR-6.6`, `FR-6.7`, `FR-6.8` | User Flows `F-31` | Hiện hành |
| `BR-31.6` | Bản ghi đã đóng *duyệt hợp thức hóa* không mở lại (ứng dụng đã vào danh mục). Bản ghi đã đóng *không duyệt* mà bằng chứng xuất hiện lại thì **mở lại chính bản ghi đó** với cờ *tái xuất hiện sau khi không duyệt* và nâng mức rủi ro *(mới ở v0.8 — OI-14f (Owner 25/09/2026) — `OQ-US-29`; BRD `FR-6.7`, `INV-13`)* | `F-31` Phát hiện phần mềm ngoài danh mục | [UC42](#uc42) | `US-13-03`, `US-13-06` | `FR-6.4`, `FR-6.6`, `FR-6.7`, `FR-6.8`, `FR-6.9` | User Flows `F-31` · OI-14f (Owner 25/09/2026) — `OQ-US-29`; BRD `FR-6.7`, `INV-13` | Mới 25/09/2026 — OWNER DECISION |
| `BR-34.1` | "Đã duyệt" là **kết cục bình thường và tích cực**, không phải ngoại lệ. Shadow IT thường là tín hiệu bộ công cụ đã duyệt còn thiếu | `F-34` Hợp thức hóa ứng dụng vào danh mục | [UC43](#uc43) | `US-13-05`, `US-13-06` | `FR-3.4`, `FR-3.4c-1`, `FR-6.9` | User Flows `F-34` | Hiện hành |
| `BR-34.2` | Người đang dùng ứng dụng đó được ghi nhận thành quyền chính thức, không bắt xin lại từ đầu | `F-34` Hợp thức hóa ứng dụng vào danh mục | [UC21](#uc21), [UC43](#uc43) | `US-13-06` | `FR-3.4`, `FR-3.4c-1`, `FR-6.9` | User Flows `F-34` | Hiện hành |
| `BR-34.3` | Quyết định *không duyệt* và *báo nhầm* **bắt buộc có lý do**; *duyệt hợp thức hóa* không bắt buộc *(mới ở v0.8 — OI-14g (Owner 25/09/2026) — `OQ-US-30`)* | `F-34` Hợp thức hóa ứng dụng vào danh mục | [UC43](#uc43) | `US-13-05`, `US-13-06` | `FR-3.4`, `FR-3.4c-1`, `FR-6.9` | User Flows `F-34` · OI-14g (Owner 25/09/2026) — `OQ-US-30` | Mới 25/09/2026 — OWNER DECISION |
| `BR-35.1` | Hệ thống **không tự sửa** thuê bao theo hóa đơn — xem F-43 | `F-35` Đối soát hóa đơn | [UC32](#uc32) | `US-07-07`, `US-12-02` | `FR-5.4`, `FR-5.8`, `FR-7.7` | User Flows `F-35` | Hiện hành |
| `BR-35.2` | Chênh lệch phải quy được về một trong ba nguyên nhân: đã mua thêm chưa cập nhật, nhà cung cấp tính sai, hoặc dữ liệu nội bộ sai | `F-35` Đối soát hóa đơn | [UC32](#uc32) | `US-12-02` | `FR-5.4`, `FR-5.8`, `FR-7.7` | User Flows `F-35` | Hiện hành |
| `BR-36.1` | Mỗi khoản cam kết gắn **đúng một** yêu cầu đã được Người duyệt chi duyệt; một yêu cầu có **tối đa một** khoản cam kết — BRD `INV-16` | `F-36` Lập và theo dõi ngân sách | [UC16](#uc16), [UC20](#uc20) | `US-06-04`, `US-06-09` | `FR-5.1`, `FR-5.8` | User Flows `F-36` | Hiện hành |
| `BR-36.2` | Khoản cam kết **không chuyển ngược** từ *Đã thành chi phí* | `F-36` Lập và theo dõi ngân sách | [UC20](#uc20), [UC32](#uc32) | `US-06-06` | `FR-5.1`, `FR-5.4`, `FR-5.8` | User Flows `F-36` | Hiện hành |
| `BR-36.3` | Vượt ngân sách **không chặn** việc duyệt chi — chỉ hiện cảnh báo và ý kiến của Tài chính (`BR-07.9`) | `F-36` Lập và theo dõi ngân sách | [UC16](#uc16), [UC20](#uc20), [UC55](#uc55) | `US-06-01` | `FR-3.4`, `FR-3.13`, `FR-3.14`, `FR-5.8` | User Flows `F-36` | Hiện hành |
| `BR-36.4` | Mọi số tiền theo quy tắc đa tiền tệ của `BR-29.1` | `F-36` Lập và theo dõi ngân sách | [UC20](#uc20) | `US-04-05`, `US-06-09` | `FR-5.1`, `FR-5.6`, `FR-5.8` | User Flows `F-36` | Hiện hành |
| `BR-36.5` | Duyệt chi khi **chưa có ngân sách** vẫn tạo khoản cam kết, mang lý do *Chưa có ngân sách*; ngân sách của đúng Cost Center và kỳ được lập sau thì **tự gắn ngược** các khoản đó *(mới ở v0.8 — BRD `FR-5.8a`, `INV-18`, `QĐ-30b` — đồng bộ `BF-04`)* | `F-36` Lập và theo dõi ngân sách | [UC20](#uc20) | — | `FR-5.8a` | User Flows `F-36` · BRD `FR-5.8a`, `INV-18`, `QĐ-30b` — đồng bộ `BF-04` | Mới 25/09/2026 — OWNER DECISION |
| `BR-36.6` | Số còn lại được phép **âm** khi cam kết gắn ngược vượt hạn mức, kèm nhãn *đã cam kết vượt hạn mức*; không làm tròn về 0, không tạo ngân sách 0 giữ chỗ *(mới ở v0.8 — BRD `FR-5.8a`, `QĐ-30b` — đồng bộ `BF-04`)* | `F-36` Lập và theo dõi ngân sách | [UC20](#uc20), [UC56](#uc56) | — | `FR-5.8a` | User Flows `F-36` · BRD `FR-5.8a`, `QĐ-30b` — đồng bộ `BF-04` | Mới 25/09/2026 — OWNER DECISION |
| `BR-36.7` | Hóa đơn khớp một phần: mỗi hóa đơn chuyển **đúng số tiền đó** thành chi phí, phần còn lại vẫn *Đang giữ*; hết số còn lại thì *Đã thành chi phí*; Finance được giải phóng phần dư kèm lý do khi không còn hóa đơn; không trừ hai lần *(mới ở v0.8 — OI-11a (Owner 25/09/2026) — `OQ-US-18`; BRD `FR-5.8`)* | `F-36` Lập và theo dõi ngân sách | [UC20](#uc20), [UC32](#uc32) | `US-06-06`, `US-12-02` | `FR-5.1`, `FR-5.4`, `FR-5.8`, `FR-7.7` | User Flows `F-36` · OI-11a (Owner 25/09/2026) — `OQ-US-18`; BRD `FR-5.8` | Mới 25/09/2026 — OWNER DECISION |
| `BR-36.8` | Kỳ ngân sách là **một loại kỳ cho toàn tổ chức** (tháng/quý/năm) do Super Admin đặt một lần, mặc định **quý**; không đổi khi đã có ngân sách. Snapshot tính *tổng Request có chi phí đang chờ duyệt* trong **cùng Cost Center và kỳ** của Request *(mới ở v0.8 — OI-11b, OI-11d (Owner 25/09/2026) — `OQ-US-19`, `OQ-US-17`)* | `F-36` Lập và theo dõi ngân sách | [UC03](#uc03), [UC20](#uc20) | `US-01-04`, `US-06-01`, `US-06-09` | `FR-3.8`, `FR-3.13`, `FR-3.14`, `FR-4.13`, `FR-4.17`, `FR-5.1`, `FR-5.8`, `FR-8.2` | User Flows `F-36` · OI-11b, OI-11d (Owner 25/09/2026) — `OQ-US-19`, `OQ-US-17` | Mới 25/09/2026 — OWNER DECISION |
| `BR-37.1` | Quản trị hệ thống **không** gán suất và **không** phê duyệt yêu cầu nghiệp vụ | `F-37` Quản trị hệ thống và nhật ký | [UC02](#uc02) | `US-01-01`, `US-01-05`, `US-01-09` | `FR-8.1`, `FR-8.5`, `FR-8.6` | User Flows `F-37` | Hiện hành |
| `BR-37.2` | Sửa **chính sách duyệt** (nhánh, chuỗi loại bước) không ảnh hưởng các yêu cầu đang chạy. *(v0.6 — `QĐ-28d`)* Đổi **người giữ vai** — Người duyệt chi, người thay thế khi xung đột, người duyệt dự phòng ở gốc — thì bước đang chờ được xác định lại theo `BR-13.9`, SLA không đặt lại | `F-37` Quản trị hệ thống và nhật ký | [UC03](#uc03) | `US-01-03`, `US-01-04`, `US-05-02`, `US-05-12` | `FR-3.5`, `FR-3.6`, `FR-3.8`, `FR-3.12`, `FR-3.13`, `FR-3.15`, `FR-3.16`, `FR-4.13`, `FR-4.17`, `FR-8.2` | User Flows `F-37` | Hiện hành |
| `BR-38.1` | Nhật ký kiểm toán chỉ ghi thêm, không sửa không xóa | `F-38` Quản trị hệ thống và nhật ký | [UC04](#uc04) | `US-01-06` | `FR-8.3` | User Flows `F-38` | Hiện hành |
| `BR-38.2` | Tác vụ nền thất bại phải hiện lên, không im lặng bỏ qua | `F-38` Quản trị hệ thống và nhật ký | [UC05](#uc05) | `US-01-07`, `US-14-04` | `FR-8.4`, `FR-10.3` | User Flows `F-38` | Hiện hành |
| `BR-38.3` | Chỉ **Super Admin** tra cứu Audit Trail. Vai khác thấy lịch sử quyết định/trạng thái của đối tượng trong phạm vi của mình ngay trong chức năng tương ứng *(mới ở v0.8 — OI-08c (Owner 25/09/2026) — `OQ-US-04`; BRD `FR-8.3`)* | `F-38` Quản trị hệ thống và nhật ký | [UC04](#uc04) | `US-01-06` | `FR-8.3` | User Flows `F-38` · OI-08c (Owner 25/09/2026) — `OQ-US-04`; BRD `FR-8.3` | Mới 25/09/2026 — OWNER DECISION |
| `BR-39.1` | Quyền cấp cho nhà thầu, freelancer, thực tập sinh **bắt buộc** có ngày kết thúc dự kiến — không cho để trống | `F-39` Nhà thầu và thực tập sinh sắp hết hạn | [UC07](#uc07), [UC11](#uc11) | `US-03-05` | `FR-2.8` | User Flows `F-39` | Hiện hành |
| `BR-39.2` | Hệ thống **không tự thu hồi** khi tới hạn. Tự thu hồi có thể cắt quyền của người đang làm dở việc | `F-39` Nhà thầu và thực tập sinh sắp hết hạn | [UC22](#uc22) | — | — | User Flows `F-39` | Hiện hành |
| `BR-39.3` | Quá hạn mà chưa xử lý thì nổi lên bảng điều khiển IT như một mục nợ, không im lặng | `F-39` Nhà thầu và thực tập sinh sắp hết hạn | [UC07](#uc07) | `US-03-05` | `FR-2.8` | User Flows `F-39` | Hiện hành |
| `BR-39.4` | Gia hạn quá 12 tháng liên tiếp phải có xác nhận thêm — dấu hiệu người này thực chất là nhân viên chính thức; là **xác nhận tường minh của Manager** trong bước xét nhu cầu như `BR-07.4` *(làm rõ ở v0.8 — OI-07a)* | `F-39` Nhà thầu và thực tập sinh sắp hết hạn | [UC11](#uc11), [UC14](#uc14) | `US-03-05`, `US-05-14` | `FR-2.8`, `FR-3.2` | User Flows `F-39` | Làm rõ 25/09/2026 — OWNER DECISION |
| `BR-40.1` | Nhân viên chỉ xem được dữ liệu của chính mình, không xem được của đồng nghiệp | `F-40` Nhân viên xem và xuất dữ liệu của chính mình | [UC44](#uc44) | `US-14-01`, `US-14-06` | `FR-10.1`, `FR-10.5`, `FR-10.7` | User Flows `F-40` | Hiện hành |
| `BR-40.2` | Hệ thống ghi nhận **thời điểm tiếp nhận và thời điểm hoàn tất** mỗi yêu cầu, phục vụ chứng minh đáp ứng đúng thời hạn quy định | `F-40` Nhân viên xem và xuất dữ liệu của chính mình | [UC44](#uc44), [UC47](#uc47) | `US-14-02` | `FR-10.2`, `FR-10.5` | User Flows `F-40` | Hiện hành |
| `BR-40.3` | Dữ liệu xuất ra ở định dạng đọc được, không phải kết xuất kỹ thuật thô | `F-40` Nhân viên xem và xuất dữ liệu của chính mình | [UC44](#uc44) | `US-14-02` | `FR-10.2`, `FR-10.5` | User Flows `F-40` | Hiện hành |
| `BR-40.4` | Yêu cầu **dừng thu thập** được xử lý trong **2 ngày làm việc** (mặc định, cấu hình được); quá hạn thì nhắc và cảnh báo nghẽn như `FR-3.8`. Căn cứ pháp lý của con số còn chờ kiểm chứng văn bản gốc *(mới ở v0.8 — OI-01a (Owner 25/09/2026); BRD 5.11)* | `F-40` Nhân viên xem và xuất dữ liệu của chính mình | [UC47](#uc47) | `US-09-04` | `FR-3.8`, `FR-4.18`, `FR-10.5` | User Flows `F-40` · OI-01a (Owner 25/09/2026); BRD 5.11 | Mới 25/09/2026 — OWNER DECISION |
| `BR-40.5` | Yêu cầu dừng thu thập **hợp lệ** (thiết bị đã đăng ký của chính người gửi) **luôn được thực hiện**; IT chỉ đóng yêu cầu **không hợp lệ** (không phải thiết bị của mình, trùng, đã dừng) kèm lý do; nhân viên gửi lại được; không có luồng kháng nghị trong MVP *(mới ở v0.8 — OI-01b (Owner 25/09/2026))* | `F-40` Nhân viên xem và xuất dữ liệu của chính mình | [UC44](#uc44), [UC47](#uc47) | `US-09-04`, `US-14-06` | `FR-4.18`, `FR-10.5`, `FR-10.7` | User Flows `F-40` · OI-01b (Owner 25/09/2026) | Mới 25/09/2026 — OWNER DECISION |
| `BR-40.6` | IT Admin được tự xử lý yêu cầu quyền dữ liệu của chính mình; Audit Trail gắn cờ *tự xử lý* *(mới ở v0.8 — OI-01c (Owner 25/09/2026))* | `F-40` Nhân viên xem và xuất dữ liệu của chính mình | [UC47](#uc47) | `US-09-04`, `US-14-02`, `US-14-06` | `FR-4.18`, `FR-10.2`, `FR-10.5`, `FR-10.7` | User Flows `F-40` · OI-01c (Owner 25/09/2026) | Mới 25/09/2026 — OWNER DECISION |
| `BR-40.7` | Nhân viên được **yêu cầu chỉnh sửa** dữ liệu cá nhân (ví dụ email, liên kết thiết bị sai); IT Admin xử lý. Không sửa dữ liệu usage gốc hay Audit Trail; dữ liệu nhân sự sai được sửa theo nguồn nhân sự *(mới ở v0.8 — OI-13 (Owner 25/09/2026) — `OQ-US-31`; BRD 5.11)* | `F-40` Nhân viên xem và xuất dữ liệu của chính mình | [UC44](#uc44), [UC47](#uc47) | `US-14-06` | `FR-10.5`, `FR-10.7` | User Flows `F-40` · OI-13 (Owner 25/09/2026) — `OQ-US-31`; BRD 5.11 | Mới 25/09/2026 — OWNER DECISION |
| `BR-40.8` | Yêu cầu chỉnh sửa và **ngoại lệ xuất dữ liệu** được xử lý trong **10 ngày** (mặc định, cấu hình được); quá hạn thì nhắc và cảnh báo nghẽn. Căn cứ pháp lý còn chờ kiểm chứng *(mới ở v0.8 — OI-13b (Owner 25/09/2026); BRD 5.11)* | `F-40` Nhân viên xem và xuất dữ liệu của chính mình | [UC47](#uc47) | `US-14-02`, `US-14-06` | `FR-10.2`, `FR-10.5`, `FR-10.7` | User Flows `F-40` · OI-13b (Owner 25/09/2026); BRD 5.11 | Mới 25/09/2026 — OWNER DECISION |
| `BR-41.1` | Xóa là **xóa thật**, không phải đánh dấu ẩn | `F-41` Xóa dữ liệu hoạt động của người đã nghỉ | [UC05](#uc05), [UC08](#uc08) | `US-14-03` | `FR-10.6` | User Flows `F-41` | Hiện hành |
| `BR-41.2` | Dữ liệu tổng hợp giữ lại phải **không truy ngược được** về cá nhân | `F-41` Xóa dữ liệu hoạt động của người đã nghỉ | [UC05](#uc05), [UC08](#uc08) | — | — | User Flows `F-41` | Hiện hành |
| `BR-41.3` | Nhật ký kiểm toán không bị xóa theo chính sách này — nó phục vụ nghĩa vụ pháp luật khác | `F-41` Xóa dữ liệu hoạt động của người đã nghỉ | [UC04](#uc04), [UC08](#uc08) | `US-01-06` | `FR-8.3` | User Flows `F-41` | Hiện hành |
| `BR-41.4` | Muốn giữ lâu hơn mốc 30 ngày thì phải có thỏa thuận trong hợp đồng lao động hoặc chính sách nội bộ đã thông báo, không chỉ đặt cấu hình | `F-41` Xóa dữ liệu hoạt động của người đã nghỉ | [UC08](#uc08) | `US-01-04`, `US-14-03` | `FR-4.18`, `FR-10.6` | User Flows `F-41` | Hiện hành |
| `BR-42.1` | Đây **không phải tính năng tùy chọn**. *(Sửa ở v0.5:)* Nó là **biện pháp thiết kế** hiện thực yêu cầu *"người lao động biết rõ biện pháp đó"* của **Điều 25 khoản 3 Luật 91/2025/QH15, đã đọc nguyên văn**. Tài liệu **không** khẳng định có nó thì việc thu thập đã hợp pháp — xem BRD mục 7.7.7 | `F-42` Thông báo khi bắt đầu theo dõi một ứng dụng | [UC48](#uc48) | `US-08-05` | `FR-10.4` | User Flows `F-42` | Hiện hành |
| `BR-42.2` | Không cho ghi dữ liệu trước khi thông báo được ghi nhận | `F-42` Thông báo khi bắt đầu theo dõi một ứng dụng | [UC48](#uc48) | — | — | User Flows `F-42` | Hiện hành |
| `BR-42.3` | Nhân viên được cấp suất **sau** thời điểm thông báo cũng nhận thông báo tại thời điểm được cấp | `F-42` Thông báo khi bắt đầu theo dõi một ứng dụng | [UC48](#uc48) | `US-08-05` | `FR-10.4` | User Flows `F-42` | Hiện hành |
| `BR-42.4` | *(mới ở v0.5 — `QĐ-20`)* Với **bộ thu thập trên thiết bị**, thông báo **đơn thuần là không đủ**: nhân viên phải **bấm xác nhận chủ động**, hệ thống lưu **phiên bản nội dung thông báo và thời điểm**. Chưa xác nhận thì **không nhận dữ liệu** từ thiết bị đó — BRD `FR-4.18`, `INV-17` | `F-42` Thông báo khi bắt đầu theo dõi một ứng dụng | [UC27](#uc27) | `US-09-03` | `FR-4.18`, `FR-10.4` | User Flows `F-42` | Hiện hành |
| `BR-42.5` | *(mới ở v0.5)* Nội dung thông báo đổi ⟹ **phiên bản mới** ⟹ nhân viên phải xác nhận lại trước khi thiết bị tiếp tục gửi dữ liệu | `F-42` Thông báo khi bắt đầu theo dõi một ứng dụng | [UC27](#uc27) | `US-01-04`, `US-09-03` | `FR-4.18`, `FR-10.4` | User Flows `F-42` | Hiện hành |
| `BR-42.6` | *(mới ở v0.5)* Nhân viên có **nút yêu cầu dừng thu thập**; yêu cầu đi theo quy trình quyền chủ thể dữ liệu (`F-40`, BRD `FR-10.5`) | `F-42` Thông báo khi bắt đầu theo dõi một ứng dụng | [UC44](#uc44) | `US-09-04` | `FR-4.18`, `FR-10.5` | User Flows `F-42` | Hiện hành |
| `BR-42.7` | Kênh thông báo MVP: **trong ứng dụng** cho mọi thông báo; **thư điện tử** (khi kênh email được cấu hình) chỉ thêm cho **cảnh báo trước hạn báo hủy** (`F-26`) và **thông báo trước khi theo dõi** (`F-42`). Lỗi gửi thư không được coi là đã thông báo *(mới ở v0.8 — OI-EMAIL, OI-09b (Owner 25/09/2026) — `OQ-US-07`, `TE-05`)* | `F-42` Thông báo khi bắt đầu theo dõi một ứng dụng | [UC29](#uc29), [UC48](#uc48) | `US-05-15`, `US-08-05`, `US-11-01` | `FR-1.4`, `FR-10.4` | User Flows `F-42` · OI-EMAIL, OI-09b (Owner 25/09/2026) — `OQ-US-07`, `TE-05` | Mới 25/09/2026 — OWNER DECISION |
| `BR-43.1` | Hệ thống giữ nguyên **cả hai giá trị** khi có mâu thuẫn, không ghi đè | `F-43` Xử lý khi các nguồn dữ liệu mâu thuẫn | [UC23](#uc23), [UC24](#uc24), [UC32](#uc32) | `US-07-07` | `FR-7.7` | User Flows `F-43` | Hiện hành |
| `BR-43.2` | Mỗi bản ghi mâu thuẫn phải có người chịu trách nhiệm xử lý | `F-43` Xử lý khi các nguồn dữ liệu mâu thuẫn | [UC23](#uc23), [UC32](#uc32) | — | — | User Flows `F-43` | Hiện hành |
| `BR-43.3` | Mâu thuẫn không được tự đóng theo thời gian | `F-43` Xử lý khi các nguồn dữ liệu mâu thuẫn | [UC23](#uc23), [UC32](#uc32) | `US-07-07` | `FR-7.7` | User Flows `F-43` | Hiện hành |
| `BR-44.1` | Mốc **6 tháng** áp cho **mọi** nhân viên, không chỉ người đã nghỉ. Người đang làm việc vẫn được xóa dữ liệu hoạt động cũ hơn mốc | `F-44` Xóa dữ liệu quá hạn lưu giữ theo chính sách | [UC05](#uc05) | `US-14-04` | `FR-10.3` | User Flows `F-44` | Hiện hành |
| `BR-44.2` | Xóa là **xóa thật**, không đánh dấu ẩn và không "phi định danh" bằng cách chỉ đổi tên hiển thị | `F-44` Xóa dữ liệu quá hạn lưu giữ theo chính sách | [UC05](#uc05) | — | — | User Flows `F-44` | Hiện hành |
| `BR-44.3` | **Ngoại lệ duy nhất của chính sách này là nhật ký kiểm toán** — chỉ ghi thêm, không xóa (BRD mục 7.5). **Bằng chứng discovery từ sao kê và hóa đơn KHÔNG phải ngoại lệ**: vẫn xóa thật ở mốc 24 tháng. Hồ sơ tài chính của phân hệ 5.1/5.5 nằm ngoài bảng lưu giữ nên tác vụ này không quét tới; đặt mốc cho chúng cần một chính sách riêng có tên và nguồn | `F-44` Xóa dữ liệu quá hạn lưu giữ theo chính sách | [UC04](#uc04) | `US-01-06` | `FR-8.3` | User Flows `F-44` | Hiện hành |
| `BR-44.4` | Mỗi lần chạy ghi **số bản ghi đã xóa theo từng lớp** và thời điểm — đây là bằng chứng đáp ứng `FR-10.3`, không phải log kỹ thuật | `F-44` Xóa dữ liệu quá hạn lưu giữ theo chính sách | [UC05](#uc05) | `US-01-07` | `FR-8.4`, `FR-10.3` | User Flows `F-44` | Hiện hành |
| `BR-44.5` | Muốn giữ lâu hơn mốc đã công bố thì phải có **thỏa thuận** trong hợp đồng lao động hoặc chính sách nội bộ đã thông báo, không chỉ đổi cấu hình (`BR-41.4`) | `F-44` Xóa dữ liệu quá hạn lưu giữ theo chính sách | [UC03](#uc03) | `US-01-04`, `US-14-04` | `FR-3.8`, `FR-4.13`, `FR-4.17`, `FR-8.2`, `FR-10.3` | User Flows `F-44` | Hiện hành |
| `BR-45.1` | **Chưa xác nhận thì không có dữ liệu.** Không có đường nào để dữ liệu từ thiết bị vào hệ thống trước bước 4 — BRD `INV-17` | `F-45` Triển khai và vận hành tiện ích trình duyệt trên thiết bị công ty | [UC26](#uc26), [UC27](#uc27) | `US-09-01`, `US-09-03`, `US-09-05`, `US-09-09` | `FR-4.17`, `FR-4.18`, `FR-4.19`, `FR-10.4` | User Flows `F-45` | Hiện hành |
| `BR-45.2` | **Lọc tại nguồn là bắt buộc**, lọc ở máy chủ chỉ là lớp phòng thủ thứ hai — BRD `ADR-13` | `F-45` Triển khai và vận hành tiện ích trình duyệt trên thiết bị công ty | [UC26](#uc26) | `US-09-06` | `FR-4.3a`, `FR-4.14a`, `FR-4.17` | User Flows `F-45` | Hiện hành |
| `BR-45.3` | **Không bao giờ** thu: URL đầy đủ, tiêu đề trang, nội dung, phím bấm, ảnh màn hình, vị trí, tên miền ngoài danh sách | `F-45` Triển khai và vận hành tiện ích trình duyệt trên thiết bị công ty | [UC26](#uc26) | `US-09-05`, `US-09-06` | `FR-4.3a`, `FR-4.14a`, `FR-4.17`, `FR-4.18` | User Flows `F-45` | Hiện hành |
| `BR-45.4` | Ứng dụng mang cờ liên lạc **không bao giờ** nằm trong danh sách cho phép — `ADR-10` giữ nguyên | `F-45` Triển khai và vận hành tiện ích trình duyệt trên thiết bị công ty | [UC26](#uc26) | `US-01-08`, `US-04-01`, `US-09-02` | `FR-4.17` | User Flows `F-45` | Hiện hành |
| `BR-45.5` | Định nghĩa hoạt động khai báo theo `FR-4.16`: đang ở phía trước **và** không rảnh, cộng dồn **≥ N phút/ngày** — mặc định **N = 5**, Super Admin cấu hình *(làm rõ ở v0.8 — OI-14b, Owner 25/09/2026)* | `F-45` Triển khai và vận hành tiện ích trình duyệt trên thiết bị công ty | [UC03](#uc03), [UC26](#uc26) | `US-01-04`, `US-09-05`, `US-09-06` | `FR-3.8`, `FR-4.3a`, `FR-4.13`, `FR-4.14a`, `FR-4.16`, `FR-4.17`, `FR-4.18`, `FR-8.2` | User Flows `F-45` | Làm rõ 25/09/2026 — OWNER DECISION |
| `BR-45.6` | Chỉ dùng cho tối ưu license. **Không** có màn hình xếp hạng thời gian dùng theo người; Manager chỉ thấy *có / không hoạt động* — BRD `SoD-2`, `ĐK-09` | `F-45` Triển khai và vận hành tiện ích trình duyệt trên thiết bị công ty | [UC26](#uc26), [UC56](#uc56) | `US-09-06`, `US-09-07`, `US-12-05`, `US-14-05` | `FR-0.1`, `FR-0.4`, `FR-4.3a`, `FR-4.14a`, `FR-4.17`, `FR-5.10`, `FR-5.10a`, `FR-5.12` | User Flows `F-45` | Hiện hành |
| `BR-45.7` | Nhân viên nghỉ việc ⟹ đăng ký thiết bị hết hiệu lực; dữ liệu xóa theo `F-41`, `F-44` | `F-45` Triển khai và vận hành tiện ích trình duyệt trên thiết bị công ty | [UC08](#uc08), [UC26](#uc26) | `US-03-04`, `US-09-08`, `US-09-09` | `FR-2.4`, `FR-4.17`, `FR-4.18`, `FR-4.19`, `FR-10.6` | User Flows `F-45` | Hiện hành |
| `BR-45.8` | Một nhân viên có thể có **nhiều** thiết bị đăng ký, mỗi thiết bị xác nhận riêng; thiết bị **dùng chung** nhiều người **không** đăng ký thu thập trong MVP (ghi là điểm mù) *(mới ở v0.8 — OI-14d (Owner 25/09/2026) — `OQ-US-21`)* | `F-45` Triển khai và vận hành tiện ích trình duyệt trên thiết bị công ty | [UC26](#uc26), [UC27](#uc27) | `US-09-01` | `FR-4.18` | User Flows `F-45` · OI-14d (Owner 25/09/2026) — `OQ-US-21` | Mới 25/09/2026 — OWNER DECISION |
| `BR-46.1` | **Chỉ tên miền đã có trong từ điển** mới được xét. Tên miền lạ chưa có trong từ điển đã bị bỏ ngay trên máy (`BR-45.3`), nên nguồn này **mù với SaaS hoàn toàn mới** — ghi rõ khi trình bày | `F-46` Phát hiện SaaS ngoài danh mục từ bộ thu thập | [UC26](#uc26), [UC42](#uc42) | `US-13-04` | `FR-6.3` | User Flows `F-46` | Hiện hành |
| `BR-46.2` | Một nhà cung cấp chỉ có **một** bản ghi phát hiện đang mở, dù bằng chứng đến từ ba nguồn — BRD `INV-13` | `F-46` Phát hiện SaaS ngoài danh mục từ bộ thu thập | [UC42](#uc42) | `US-13-03` | `FR-6.4`, `FR-6.6`, `FR-6.7`, `FR-6.8` | User Flows `F-46` | Hiện hành |
| `BR-46.3` | Bản ghi phát hiện **không phải kết luận vi phạm** — BRD `FR-6.6` | `F-46` Phát hiện SaaS ngoài danh mục từ bộ thu thập | [UC42](#uc42) | `US-13-04` | `FR-6.3`, `FR-6.6` | User Flows `F-46` | Hiện hành |
| `BR-47.1` | *Chi phí trên mỗi người dùng có hoạt động* **chỉ tính** cho gói theo đầu người **và** ứng dụng có nguồn phát hiện được G3/G4; không đủ điều kiện thì **ẩn kèm lý do** | `F-47` Xem báo cáo hiệu suất và chất lượng | [UC56](#uc56) | `US-12-05` | `FR-0.1`, `FR-0.4`, `FR-5.10`, `FR-5.10a`, `FR-5.12` | User Flows `F-47` | Hiện hành |
| `BR-47.2` | **Không đặt con số mục tiêu** cho KPI — BRD `OQ-10` | `F-47` Xem báo cáo hiệu suất và chất lượng | [UC56](#uc56) | `US-12-07` | `FR-0.1`, `FR-0.3`, `FR-0.4`, `FR-5.12` | User Flows `F-47` | Hiện hành |
| `BR-47.3` | Mọi con số bấm được để xem căn cứ tính, như `F-29` | `F-47` Xem báo cáo hiệu suất và chất lượng | [UC56](#uc56) | — | — | User Flows `F-47` | Hiện hành |
| `BR-47.4` | Không có báo cáo nào xếp hạng nhân viên theo thời gian sử dụng (`BR-45.6`) | `F-47` Xem báo cáo hiệu suất và chất lượng | [UC56](#uc56) | `US-09-07`, `US-12-05` | `FR-0.1`, `FR-0.4`, `FR-5.10`, `FR-5.10a`, `FR-5.12` | User Flows `F-47` | Hiện hành |

**Tổng:** 223 quy tắc — 27 SoD/INV của BRD, 196 BR của User Flows (31 mới, 5 làm rõ, 4 nghỉ hưu). Cột *US* liệt kê story có trích mã quy tắc trong đặc tả/AC; *FR* là FR được chính quy tắc hoặc story đó trích và thuộc UC liên quan.
<!-- GENERATED:br-table:END -->

<a id="traceability"></a>
## 6. Truy vết UC ↔ US ↔ FR ↔ BR ↔ actor ↔ luồng

<!-- GENERATED:traceability:BEGIN -->
| UC | Actor | FR | SoD / INV | BR | Luồng F | WF | UF | US | Quyết định |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [UC01](#uc01) | A01 | `FR-8.1`, `FR-8.9`, `FR-8.11` | `SoD-4` | — | — | — | `UF-13` | `US-01-01`, `US-01-10` | `QĐ-46` |
| [UC02](#uc02) | A06 | `FR-8.1`, `FR-8.5`, `FR-8.6` | `SoD-1` | `BR-37.1` | `F-37` | `WF-03` | `UF-13` | `US-01-01`, `US-01-02`, `US-01-05`, `US-01-10` | `QĐ-46` |
| [UC03](#uc03) | A06 | `FR-3.5`, `FR-3.6`, `FR-3.8`, `FR-3.12`, `FR-3.13`, `FR-3.15`, `FR-3.16`, `FR-4.13`, `FR-4.17`, `FR-8.2`, `FR-10.3` | `SoD-1` | `BR-06.5`, `BR-13.8`, `BR-13.9`, `BR-13.10`, `BR-13.11`, `BR-13.12`, `BR-20.1`, `BR-36.8`, `BR-37.2`, `BR-44.5`, `BR-45.5` | `F-13`, `F-37`, `F-44` | `WF-03` | `UF-13` | `US-01-03`, `US-01-04`, `US-01-08` | `QĐ-02`, `QĐ-27`, `QĐ-28c`, `QĐ-28d`, `OI-14a`, `OI-14b`, `OI-11b`, `OI-17` |
| [UC04](#uc04) | A06 | `FR-8.3` | `SoD-1`, `INV-05` | `BR-38.1`, `BR-38.3`, `BR-41.3`, `BR-44.3` | `F-38` | `WF-03` | — | `US-01-06` | `OI-08c` |
| [UC05](#uc05) | A06 | `FR-8.4`, `FR-10.3`, `FR-10.6` | `SoD-1` | `BR-38.2`, `BR-41.1`, `BR-41.2`, `BR-44.1`, `BR-44.2`, `BR-44.4` | `F-38`, `F-41`, `F-44` | `WF-03` | — | `US-01-07`, `US-14-03`, `US-14-04` | — |
| [UC06](#uc06) | A03 | `FR-9.1`, `FR-9.2`, `FR-9.3`, `FR-9.4`, `FR-9.5`, `FR-9.6`, `FR-9.7` | `INV-14b` | `BR-01.1`, `BR-01.2`, `BR-01.4`, `BR-01.5`, `BR-01.6`, `BR-01.7` | `F-01`, `F-19` | `WF-01` | `UF-06` | `US-02-02`, `US-02-03`, `US-02-04`, `US-02-05`, `US-02-06` | `OI-04`, `OI-10` |
| [UC07](#uc07) | A02, A03 | `FR-2.1`, `FR-2.2`, `FR-2.8`, `FR-3.1`, `FR-3.16`, `FR-9.7` | `INV-07`, `INV-14a`, `INV-14b` | `BR-01.6`, `BR-03.1`, `BR-03.2`, `BR-03.3`, `BR-03.4`, `BR-04.2`, `BR-04.3`, `BR-05.3`, `BR-39.1`, `BR-39.3` | `F-02`, `F-03`, `F-04`, `F-39` | `WF-04`, `WF-05`, `WF-06`, `WF-08` | `UF-01` | `US-02-02`, `US-02-03`, `US-03-01`, `US-03-03`, `US-03-05` | `QĐ-23`, `QĐ-28d`, `OI-04` |
| [UC08](#uc08) | A02, A03 | `FR-1.7`, `FR-2.4`, `FR-4.18`, `FR-10.6` | `SoD-5`, `SoD-6`, `INV-06` | `BR-05.1`, `BR-05.2`, `BR-05.3`, `BR-05.4`, `BR-05.5`, `BR-05.6`, `BR-06.7`, `BR-41.1`, `BR-41.2`, `BR-41.3`, `BR-41.4`, `BR-45.7` | `F-05`, `F-41` | `WF-07`, `WF-09a` | `UF-08`, `UF-09` | `US-03-04`, `US-07-05`, `US-09-08`, `US-14-03` | `OI-05c`, `OI-14c`, `QĐ-41a`, `QĐ-48a`, `QĐ-48b`, `QĐ-48c` |
| [UC09](#uc09) | A03 | `FR-1.1`, `FR-1.2`, `FR-1.7`, `FR-1.8`, `FR-6.1`, `FR-6.2` | `INV-06` | `BR-06.1`, `BR-06.2`, `BR-06.3`, `BR-06.4`, `BR-06.6`, `BR-06.7`, `BR-06.9` | `F-06`, `F-34` | `WF-02` | `UF-12` | `US-04-01`, `US-04-02`, `US-04-06`, `US-04-07` | `ADR-05`, `OI-05b`, `OI-05c`, `OI-14e` |
| [UC10](#uc10) | A03, A11 | `FR-1.3`, `FR-1.4`, `FR-1.5`, `FR-1.6`, `FR-4.15`, `FR-5.6` | `INV-01`, `INV-04` | `BR-06.8`, `BR-27.1`, `BR-27.2`, `BR-27.3`, `BR-27.5`, `BR-29.1` | `F-06`, `F-27` | `WF-02`, `WF-15` | `UF-11`, `UF-15` | `US-04-03`, `US-04-04`, `US-04-05`, `US-11-03` | `QĐ-16`, `QĐ-18`, `ADR-06`, `OI-11c` |
| [UC11](#uc11) | A01 | `FR-2.8`, `FR-3.2`, `FR-3.3`, `FR-3.4`, `FR-3.11`, `FR-3.12` | `SoD-4`, `INV-02`, `INV-08` | `BR-02.1`, `BR-02.2`, `BR-02.3`, `BR-07.1`, `BR-07.2`, `BR-07.3`, `BR-07.4`, `BR-07.11`, `BR-12.5`, `BR-15.1`, `BR-39.1`, `BR-39.4` | `F-02`, `F-07`, `F-08`, `F-09`, `F-15`, `F-39` | `WF-08`, `WF-09`, `WF-10`, `WF-11` | `UF-01`, `UF-02`, `UF-04` | `US-03-02`, `US-03-05`, `US-05-01`, `US-05-02`, `US-05-03`, `US-05-08`, `US-05-14`, `US-05-15` | `QĐ-29a`, `OI-06`, `OI-07a` |
| [UC13](#uc13) | A01 | `FR-2.4`, `FR-3.2` | — | `BR-14.1`, `BR-14.2` | `F-14` | `WF-11` | `UF-08`, `UF-09` | `US-05-13`, `US-07-05` | `OI-07b` |
| [UC14](#uc14) | A02 | `FR-3.3`, `FR-3.6`, `FR-3.7`, `FR-3.8`, `FR-3.12`, `FR-3.16` | `SoD-2`, `SoD-4`, `INV-08` | `BR-02.2`, `BR-03.4`, `BR-07.4`, `BR-07.5`, `BR-07.7`, `BR-07.8`, `BR-13.2`, `BR-13.4`, `BR-13.6`, `BR-13.8`, `BR-13.9`, `BR-13.11`, `BR-15.1`, `BR-39.4` | `F-07`, `F-08`, `F-09`, `F-13`, `F-15` | `WF-09`, `WF-10` | `UF-01`, `UF-04`, `UF-13` | `US-05-04`, `US-05-05`, `US-05-09`, `US-05-10`, `US-05-11`, `US-05-12` | `QĐ-02`, `QĐ-13`, `QĐ-27`, `QĐ-28d`, `QĐ-29a`, `OI-07a`, `OI-14a`, `OI-14e` |
| [UC15](#uc15) | A03 | `FR-3.4` | `SoD-5` | `BR-09.1`, `BR-09.2`, `BR-09.3` | `F-09` | `WF-10` | `UF-02` | `US-05-06` | `QĐ-22`, `OI-05a`, `OI-14e` |
| [UC55](#uc55) | A05 | `FR-1.5`, `FR-3.5`, `FR-3.8`, `FR-3.13`, `FR-3.14`, `FR-3.15` | `SoD-7`, `SoD-8` | `BR-06.8`, `BR-07.8`, `BR-07.9`, `BR-13.2`, `BR-13.10`, `BR-13.11`, `BR-36.3` | `F-08`, `F-09`, `F-13`, `F-27`, `F-34` | `WF-09`, `WF-10`, `WF-15`, `WF-17` | `UF-15` | `US-04-04`, `US-06-01`, `US-06-08`, `US-11-02`, `US-13-06` | `QĐ-22`, `QĐ-27`, `QĐ-28c`, `QĐ-29b`, `QĐ-30a`, `OI-08a`, `OI-11d`, `OI-14a` |
| [UC16](#uc16) | A05 *(qua UC55)* | `FR-3.4`, `FR-3.13`, `FR-3.14`, `FR-3.15`, `FR-5.8`, `FR-5.8a` | `SoD-7`, `INV-16`, `INV-18` | `BR-07.6`, `BR-07.10`, `BR-09.4`, `BR-36.1`, `BR-36.3` | `F-08`, `F-09`, `F-15` | `WF-09`, `WF-10` | `UF-15` | `US-05-07`, `US-06-01`, `US-06-04`, `US-06-07`, `US-06-08` | `QĐ-22`, `QĐ-29b`, `QĐ-30b` |
| [UC30](#uc30) | A05 *(qua UC55)* | `FR-1.4`, `FR-3.13`, `FR-3.14` | `SoD-7` | `BR-26.3`, `BR-27.4`, `BR-27.5` | `F-27` | `WF-15` | `UF-10`, `UF-15` | `US-11-02` | `QĐ-22`, `DQ-07`, `OI-11c` |
| [UC43](#uc43) | A05 *(qua UC55)* | `FR-3.4`, `FR-3.4c-1`, `FR-6.9` | `SoD-5`, `SoD-7` | `BR-09.4`, `BR-34.1`, `BR-34.2`, `BR-34.3` | `F-34` | `WF-17` | `UF-12` | `US-13-06` | `DQ-06`, `BF-01`, `OI-14g` |
| [UC17](#uc17) | A05 *(qua UC55)* | `FR-3.14` | `SoD-8` | `BR-07.9` | `F-08`, `F-09`, `F-27` | `WF-09`, `WF-10`, `WF-15` | `UF-15` | `US-06-02` | `QĐ-29b`, `QĐ-30a` |
| [UC21](#uc21) | A03, A08 | `FR-2.3`, `FR-2.5`, `FR-2.7`, `FR-3.11` | `SoD-5`, `SoD-6`, `INV-01`, `INV-02` | `BR-07.3`, `BR-10.1`, `BR-10.2`, `BR-10.3`, `BR-10.4`, `BR-12.1`, `BR-12.2`, `BR-12.3`, `BR-12.4`, `BR-12.5`, `BR-34.2` | `F-07`, `F-08`, `F-09`, `F-10`, `F-11`, `F-12`, `F-15`, `F-34`, `F-39` | `WF-09a` | `UF-01`, `UF-08`, `UF-14` | `US-05-07`, `US-05-15`, `US-07-01`, `US-07-02`, `US-07-03`, `US-07-04` | `QĐ-03` |
| [UC22](#uc22) | A03, A08 | `FR-2.4`, `FR-2.5`, `FR-4.15` | `SoD-5`, `SoD-6` | `BR-05.4`, `BR-10.1`, `BR-10.2`, `BR-10.3`, `BR-10.4`, `BR-12.1`, `BR-12.2`, `BR-12.3`, `BR-12.4`, `BR-14.1`, `BR-14.2`, `BR-22.1`, `BR-22.2`, `BR-39.2` | `F-05`, `F-12`, `F-14`, `F-22`, `F-34`, `F-39` | `WF-07`, `WF-09a`, `WF-11`, `WF-13`, `WF-17` | `UF-08`, `UF-09`, `UF-10` | `US-07-05`, `US-10-07` | `OI-02` |
| [UC20](#uc20) | A04, A11 | `FR-3.14`, `FR-5.1`, `FR-5.6`, `FR-5.8`, `FR-5.8a` | `SoD-3`, `SoD-8`, `INV-16`, `INV-18` | `BR-07.9`, `BR-07.10`, `BR-07.11`, `BR-29.1`, `BR-29.7`, `BR-36.1`, `BR-36.2`, `BR-36.3`, `BR-36.4`, `BR-36.5`, `BR-36.6`, `BR-36.7`, `BR-36.8` | `F-08`, `F-09`, `F-29`, `F-36` | `WF-09`, `WF-10`, `WF-15` | `UF-11`, `UF-15` | `US-06-03`, `US-06-04`, `US-06-05`, `US-06-06`, `US-06-07`, `US-06-09` | `QĐ-29b`, `QĐ-30b`, `OI-11a`, `OI-11b` |
| [UC32](#uc32) | A04, A11 | `FR-1.5`, `FR-5.4`, `FR-5.6`, `FR-5.8`, `FR-7.7` | `SoD-3`, `INV-04` | `BR-06.8`, `BR-29.1`, `BR-35.1`, `BR-35.2`, `BR-36.2`, `BR-36.7`, `BR-43.1`, `BR-43.2`, `BR-43.3` | `F-06`, `F-35`, `F-43` | `WF-16` | `UF-11`, `UF-14` | `US-04-04`, `US-04-05`, `US-06-06`, `US-07-07`, `US-12-02` | `QĐ-19`, `OI-11a` |
| [UC33](#uc33) | A04 | `FR-3.1`, `FR-5.2`, `FR-9.7` | `INV-03`, `INV-14b` | `BR-01.6`, `BR-29.3`, `BR-29.4`, `BR-29.9` | `F-01`, `F-29` | — | — | `US-04-08`, `US-04-09` | `QĐ-23`, `QĐ-30c`, `OI-03`, `OI-04` |
| [UC36](#uc36) | A04 | `FR-5.5`, `FR-5.6`, `FR-5.7` | — | `BR-30.1`, `BR-30.2`, `BR-30.3` | `F-30` | — | — | `US-12-03` | `QĐ-25`, `ADR-09` |
| [UC24](#uc24) | A03, A08 | `FR-4.1`, `FR-4.2`, `FR-4.3`, `FR-4.4`, `FR-4.5`, `FR-4.6`, `FR-4.7`, `FR-4.8`, `FR-4.11`, `FR-4.16`, `FR-7.7` | `INV-10`, `INV-11`, `INV-12` | `BR-17.1`, `BR-17.4`, `BR-17.5`, `BR-17.6`, `BR-17.8`, `BR-17.9`, `BR-18.1`, `BR-18.2`, `BR-18.3`, `BR-18.4`, `BR-43.1` | `F-17`, `F-18`, `F-20`, `F-43` | `WF-12`, `WF-12a` | `UF-06`, `UF-07` | `US-08-01`, `US-08-02`, `US-08-03`, `US-08-04`, `US-08-06`, `US-08-07` | `QĐ-21`, `QĐ-28a` |
| [UC26](#uc26) | A03 | `FR-4.3a`, `FR-4.14a`, `FR-4.17`, `FR-4.18`, `FR-4.19`, `FR-4.20` | `INV-17` | `BR-17.9`, `BR-45.1`, `BR-45.2`, `BR-45.3`, `BR-45.4`, `BR-45.5`, `BR-45.6`, `BR-45.7`, `BR-45.8`, `BR-46.1` | `F-20`, `F-45`, `F-46`, `F-48` | `WF-18` | `UF-09`, `UF-12`, `UF-16` | `US-09-01`, `US-09-02`, `US-09-05`, `US-09-06`, `US-09-07`, `US-09-08`, `US-09-09`, `US-13-04`, `US-08-08` | `QĐ-20`, `QĐ-28b`, `DQ-03`, `DQ-04`, `OI-14b`, `OI-14d`, `BF-05`, `QĐ-31b`, `QĐ-32c` |
| [UC27](#uc27) | A01 | `FR-4.18`, `FR-10.4` | `INV-17` | `BR-42.4`, `BR-42.5`, `BR-45.1`, `BR-45.8` | `F-42`, `F-45` | `WF-18` | `UF-16` | `US-09-03` | `QĐ-20` |
| [UC48](#uc48) | A01, A03, A10 | `FR-4.18`, `FR-10.4` | — | `BR-42.1`, `BR-42.2`, `BR-42.3`, `BR-42.7` | `F-42` | `WF-12`, `WF-18` | `UF-06`, `UF-16` | `US-08-05`, `US-09-03` | `QĐ-01`, `QĐ-20`, `OI-EMAIL`, `OI-09b`, `BF-07` |
| [UC28](#uc28) | A02, A03 | `FR-3.10`, `FR-4.9`, `FR-4.10`, `FR-4.11`, `FR-4.12`, `FR-4.13`, `FR-4.14`, `FR-4.15`, `FR-4.12b`, `FR-4.14a` | `INV-09`, `INV-12` | `BR-04.1`, `BR-05.1`, `BR-05.2`, `BR-06.4`, `BR-19.1`, `BR-19.2`, `BR-20.1`, `BR-20.2`, `BR-20.3`, `BR-20.4`, `BR-20.5`, `BR-20.6`, `BR-20.7`, `BR-21.1`, `BR-21.2`, `BR-21.3`, `BR-21.4`, `BR-21.5`, `BR-21.6`, `BR-22.1`, `BR-23.1` | `F-04`, `F-19`, `F-20`, `F-21`, `F-23` | `WF-13`, `WF-13a` | `UF-05`, `UF-09`, `UF-10` | `US-10-01`, `US-10-02`, `US-10-03`, `US-10-04`, `US-10-05`, `US-10-06`, `US-10-07`, `US-10-08` | `QĐ-09`, `DQ-03`, `OI-02`, `OI-12a`, `OI-12b`, `BF-03` |
| [UC23](#uc23) | A03, A08 | `FR-2.6`, `FR-4.8`, `FR-7.7` | — | `BR-28.1`, `BR-28.2`, `BR-28.3`, `BR-43.1`, `BR-43.2`, `BR-43.3` | `F-12`, `F-28`, `F-43` | `WF-16` | `UF-14` | `US-07-06`, `US-07-07` | `QĐ-15`, `OI-14h` |
| [UC29](#uc29) | A03, A04, A05, A06, A07, A10 | `FR-1.4`, `FR-3.13` | — | `BR-26.1`, `BR-26.2`, `BR-26.3`, `BR-26.4`, `BR-42.7` | `F-26` | `WF-15` | `UF-11` | `US-11-01`, `US-11-04` | `DQ-07`, `OI-EMAIL`, `OI-09a`, `OI-09b`, `OI-05c` |
| [UC42](#uc42) | A02, A03, A13 | `FR-6.3`, `FR-6.4`, `FR-6.5`, `FR-6.6`, `FR-6.7`, `FR-6.8`, `FR-6.9` | `INV-13` | `BR-31.1`, `BR-31.2`, `BR-31.3`, `BR-31.4`, `BR-31.5`, `BR-31.6`, `BR-46.1`, `BR-46.2`, `BR-46.3` | `F-31`, `F-32`, `F-46` | `WF-17`, `WF-17a` | `UF-12` | `US-13-01`, `US-13-02`, `US-13-03`, `US-13-04`, `US-13-05`, `US-15-01` | `QĐ-20`, `DQ-06`, `OI-14e`, `OI-14f`, `QĐ-31a`, `QĐ-32a`, `QĐ-32b` |
| [UC56](#uc56) | A12 | `FR-0.1`, `FR-0.2`, `FR-0.3`, `FR-0.4`, `FR-3.8`, `FR-3.9`, `FR-4.14a`, `FR-4.15`, `FR-5.1`, `FR-5.2`, `FR-5.3`, `FR-5.6`, `FR-5.8a`, `FR-5.9`, `FR-5.10`, `FR-5.10a`, `FR-5.11`, `FR-5.12` | `SoD-2` | `BR-06.4`, `BR-20.2`, `BR-22.2`, `BR-27.2`, `BR-29.1`, `BR-29.2`, `BR-29.5`, `BR-29.6`, `BR-29.7`, `BR-29.8`, `BR-36.6`, `BR-45.6`, `BR-47.1`, `BR-47.2`, `BR-47.3`, `BR-47.4` | `F-13`, `F-22`, `F-29`, `F-47` | — | `UF-04`, `UF-13`, `UF-15` | `US-05-09`, `US-05-10`, `US-05-15`, `US-12-01`, `US-12-04`, `US-12-05`, `US-12-06`, `US-12-07` | `QĐ-24`, `QĐ-29a`, `DQ-05`, `KPI3-DENOM`, `OI-08b` |
| [UC59](#uc59) | A01 | `FR-8.6`, `FR-8.9`, `FR-8.11` | `SoD-4` | — | `F-37` | `WF-03` | `UF-17` | `US-01-10`, `US-01-01` | `QĐ-46`, `QĐ-47c` |
| [UC60](#uc60) | A06 | `FR-8.8`, `FR-8.10` | `SoD-1` | `BR-37.1` | `F-37` | `WF-03` | `UF-13` | `US-01-09` | `QĐ-44`, `QĐ-47a`, `QĐ-47b`, `QĐ-47e`, `QĐ-47f` |
| [UC44](#uc44) | A01 | `FR-3.11`, `FR-4.18`, `FR-10.1`, `FR-10.2`, `FR-10.5`, `FR-10.7` | — | `BR-40.1`, `BR-40.2`, `BR-40.3`, `BR-40.5`, `BR-40.7`, `BR-42.6` | `F-40`, `F-44`, `F-45` | — | `UF-01`, `UF-03` | `US-05-15`, `US-09-04`, `US-14-01`, `US-14-02`, `US-14-05`, `US-14-06` | `OI-01b`, `OI-13` |
| [UC47](#uc47) | A03 | `FR-4.18`, `FR-10.2`, `FR-10.5`, `FR-10.7` | — | `BR-40.2`, `BR-40.4`, `BR-40.5`, `BR-40.6`, `BR-40.7`, `BR-40.8` | `F-40` | — | `UF-03` | `US-09-04`, `US-14-02`, `US-14-06` | `OI-01`, `OI-01a`, `OI-01b`, `OI-01c`, `OI-13`, `OI-13b` |
| [UC54](#uc54) | A03, A04 | `FR-7.1`, `FR-7.2`, `FR-7.3`, `FR-7.4`, `FR-7.5`, `FR-7.6`, `FR-2.1`, `FR-4.1`, `FR-5.4`, `FR-6.3`, `FR-6.4`, `FR-9.2` | — | `BR-01.3`, `BR-17.2`, `BR-17.3`, `BR-17.7`, `BR-31.4` | `F-01`, `F-17`, `F-31`, `F-32`, `F-35` | `WF-01`, `WF-12`, `WF-16`, `WF-17a` | `UF-06`, `UF-12` | `US-02-01`, `US-06-09`, `US-08-02`, `US-12-02`, `US-13-01`, `US-13-02` | — |
| [UC49](#uc49) | *(deferred)* | `FR-3.2` | — | — | `F-16` | `WF-11` | — | `US-05-16` | `QĐ-25` |
| [UC50](#uc50) | *(deferred)* | `FR-3.10` | — | — | `F-24` | `WF-14` | — | `US-10-09` | — |
| [UC51](#uc51) | *(deferred)* | `FR-4.19` | — | — | `F-48` | — | — | `US-09-09` | `QĐ-20` |
| [UC52](#uc52) | *(deferred)* | `FR-5.7` | — | — | `F-30` | — | — | `US-12-08` | `QĐ-25` |
| [UC53](#uc53) | *(deferred)* | — | — | — | — | — | — | `US-15-02`, `US-15-03`, `US-15-04` | `QĐ-25`, `QĐ-32a` |

**Chiều ngược — User Story → UC** (mọi story của User Stories; story của TE/EP kỹ thuật không có mục tiêu actor thì ghi *kỹ thuật*):

| Epic | US → UC |
| --- | --- |
| EP-01 | `US-01-01` → UC01, UC02; `US-01-02` → UC02; `US-01-03` → UC03; `US-01-04` → UC03; `US-01-05` → UC02; `US-01-06` → UC04; `US-01-07` → UC05; `US-01-08` → UC03; `US-01-09` → *kỹ thuật*; `US-01-10` → UC01, UC02 |
| EP-02 | `US-02-01` → UC54; `US-02-02` → UC06, UC07; `US-02-03` → UC06, UC07; `US-02-04` → UC06; `US-02-05` → UC06; `US-02-06` → UC06 |
| EP-03 | `US-03-01` → UC07; `US-03-02` → UC11; `US-03-03` → UC07; `US-03-04` → UC08; `US-03-05` → UC07, UC11 |
| EP-04 | `US-04-01` → UC09; `US-04-02` → UC09; `US-04-03` → UC10; `US-04-04` → UC10, UC55, UC32; `US-04-05` → UC10, UC32; `US-04-06` → UC09; `US-04-07` → UC09; `US-04-08` → UC33; `US-04-09` → UC33 |
| EP-05 | `US-05-01` → UC11; `US-05-02` → UC11; `US-05-03` → UC11; `US-05-04` → UC14; `US-05-05` → UC14; `US-05-06` → UC15; `US-05-07` → UC16, UC21; `US-05-08` → UC11; `US-05-09` → UC14, UC56; `US-05-10` → UC14, UC56; `US-05-11` → UC14; `US-05-12` → UC14; `US-05-13` → UC13; `US-05-14` → UC11; `US-05-15` → UC11, UC21, UC56, UC44; `US-05-16` → UC49 |
| EP-06 | `US-06-01` → UC55, UC16; `US-06-02` → UC17; `US-06-03` → UC20; `US-06-04` → UC16, UC20; `US-06-05` → UC20; `US-06-06` → UC20, UC32; `US-06-07` → UC16, UC20; `US-06-08` → UC55, UC16; `US-06-09` → UC20, UC54 |
| EP-07 | `US-07-01` → UC21; `US-07-02` → UC21; `US-07-03` → UC21; `US-07-04` → UC21; `US-07-05` → UC08, UC13, UC22; `US-07-06` → UC23; `US-07-07` → UC32, UC23 |
| EP-08 | `US-08-01` → UC24; `US-08-02` → UC24, UC54; `US-08-03` → UC24; `US-08-04` → UC24; `US-08-05` → UC48; `US-08-06` → UC24; `US-08-07` → UC24; `US-08-08` → UC26 |
| EP-09 | `US-09-01` → UC26; `US-09-02` → UC26; `US-09-03` → UC27, UC48; `US-09-04` → UC44, UC47; `US-09-05` → UC26; `US-09-06` → UC26; `US-09-07` → UC26; `US-09-08` → UC08, UC26; `US-09-09` → UC26, UC51 |
| EP-10 | `US-10-01` → UC28; `US-10-02` → UC28; `US-10-03` → UC28; `US-10-04` → UC28; `US-10-05` → UC28; `US-10-06` → UC28; `US-10-07` → UC22, UC28; `US-10-08` → UC28; `US-10-09` → UC50 |
| EP-11 | `US-11-01` → UC29; `US-11-02` → UC55, UC30; `US-11-03` → UC10; `US-11-04` → UC29 |
| EP-12 | `US-12-01` → UC56; `US-12-02` → UC32, UC54; `US-12-03` → UC36; `US-12-04` → UC56; `US-12-05` → UC56; `US-12-06` → UC56; `US-12-07` → UC56; `US-12-08` → UC52 |
| EP-13 | `US-13-01` → UC42, UC54; `US-13-02` → UC42, UC54; `US-13-03` → UC42; `US-13-04` → UC26, UC42; `US-13-05` → UC42; `US-13-06` → UC55, UC43; `US-13-07` → *kỹ thuật* |
| EP-14 | `US-14-01` → UC44; `US-14-02` → UC44, UC47; `US-14-03` → UC05, UC08; `US-14-04` → UC05; `US-14-05` → UC44; `US-14-06` → UC44, UC47 |
| EP-15 | `US-15-01` → UC42; `US-15-02` → UC53; `US-15-03` → UC53; `US-15-04` → UC53 |

**Chiều ngược — FR → UC:**

| Nhóm | FR → UC |
| --- | --- |
| FR-0.x | `FR-0.1` → UC56; `FR-0.2` → UC56; `FR-0.3` → UC56; `FR-0.4` → UC56 |
| FR-1.x | `FR-1.1` → UC09; `FR-1.2` → UC09; `FR-1.3` → UC10; `FR-1.4` → UC10, UC30, UC29; `FR-1.5` → UC10, UC55, UC32; `FR-1.6` → UC10; `FR-1.7` → UC08, UC09; `FR-1.8` → UC09 |
| FR-2.x | `FR-2.1` → UC07, UC54; `FR-2.2` → UC07; `FR-2.3` → UC21; `FR-2.4` → UC08, UC13, UC22; `FR-2.5` → UC21, UC22; `FR-2.6` → UC23; `FR-2.7` → UC21; `FR-2.8` → UC07, UC11 |
| FR-3.x | `FR-3.1` → UC07, UC33; `FR-3.2` → UC11, UC13, UC49; `FR-3.3` → UC11, UC14; `FR-3.4` → UC11, UC15, UC16, UC43; `FR-3.4c-1` → UC43; `FR-3.5` → UC03, UC55; `FR-3.6` → UC03, UC14; `FR-3.7` → UC14; `FR-3.8` → UC03, UC14, UC55, UC56; `FR-3.9` → UC56; `FR-3.10` → UC28, UC50; `FR-3.11` → UC11, UC21, UC44; `FR-3.12` → UC03, UC11, UC14; `FR-3.13` → UC03, UC55, UC16, UC30, UC29; `FR-3.14` → UC55, UC16, UC30, UC17, UC20; `FR-3.15` → UC03, UC55, UC16; `FR-3.16` → UC03, UC07, UC14 |
| FR-4.x | `FR-4.1` → UC24, UC54; `FR-4.2` → UC24; `FR-4.3` → UC24; `FR-4.3a` → UC26; `FR-4.4` → UC24; `FR-4.5` → UC24; `FR-4.6` → UC24; `FR-4.7` → UC24; `FR-4.8` → UC24, UC23; `FR-4.9` → UC28; `FR-4.10` → UC28; `FR-4.11` → UC24, UC28; `FR-4.12` → UC28; `FR-4.12b` → UC28; `FR-4.13` → UC03, UC28; `FR-4.14` → UC28; `FR-4.14a` → UC26, UC28, UC56; `FR-4.15` → UC10, UC22, UC28, UC56; `FR-4.16` → UC24; `FR-4.17` → UC03, UC26; `FR-4.18` → UC08, UC26, UC27, UC48, UC44, UC47; `FR-4.19` → UC26, UC51; `FR-4.20` → UC26 |
| FR-5.x | `FR-5.1` → UC20, UC56; `FR-5.2` → UC33, UC56; `FR-5.3` → UC56; `FR-5.4` → UC32, UC54; `FR-5.5` → UC36; `FR-5.6` → UC10, UC20, UC32, UC36, UC56; `FR-5.7` → UC36, UC52; `FR-5.8` → UC16, UC20, UC32; `FR-5.8a` → UC16, UC20, UC56; `FR-5.9` → UC56; `FR-5.10` → UC56; `FR-5.10a` → UC56; `FR-5.11` → UC56; `FR-5.12` → UC56 |
| FR-6.x | `FR-6.1` → UC09; `FR-6.2` → UC09; `FR-6.3` → UC42, UC54; `FR-6.4` → UC42, UC54; `FR-6.5` → UC42; `FR-6.6` → UC42; `FR-6.7` → UC42; `FR-6.8` → UC42; `FR-6.9` → UC43, UC42 |
| FR-7.x | `FR-7.1` → UC54; `FR-7.2` → UC54; `FR-7.3` → UC54; `FR-7.4` → UC54; `FR-7.5` → UC54; `FR-7.6` → UC54; `FR-7.7` → UC32, UC24, UC23 |
| FR-8.x | `FR-8.1` → UC01, UC02; `FR-8.2` → UC03; `FR-8.3` → UC04; `FR-8.4` → UC05; `FR-8.5` → UC02; `FR-8.6` → UC02; `FR-8.9` → UC01; `FR-8.11` → UC01 |
| FR-9.x | `FR-9.1` → UC06; `FR-9.2` → UC06, UC54; `FR-9.3` → UC06; `FR-9.4` → UC06; `FR-9.5` → UC06; `FR-9.6` → UC06; `FR-9.7` → UC06, UC07, UC33 |
| FR-10.x | `FR-10.1` → UC44; `FR-10.2` → UC44, UC47; `FR-10.3` → UC03, UC05; `FR-10.4` → UC27, UC48; `FR-10.5` → UC44, UC47; `FR-10.6` → UC05, UC08; `FR-10.7` → UC44, UC47 |

**Mã có chủ đích không gán UC:**

| Mã | Lý do |
| --- | --- |
| `FR-6.10` | Ngoài phạm vi hiện thực (F-33): thu thập web/firewall/proxy/CASB đầy đủ chỉ giữ đặc tả tương lai |
| `F-25` | G5 hạ gói — ngoài phạm vi |
| `F-33` | Discovery từ log web/proxy/CASB đầy đủ — ngoài phạm vi |
| `BR-13.1` | Nghỉ hưu ở User Flows v0.6 (QĐ-27, không còn ủy quyền) |
| `BR-13.3` | Nghỉ hưu ở User Flows v0.6 (QĐ-27) |
| `BR-13.5` | Nghỉ hưu ở User Flows v0.6 (QĐ-12 bị QĐ-27 thay thế) |
| `BR-13.7` | Nghỉ hưu ở User Flows v0.6 (QĐ-27) |
<!-- GENERATED:traceability:END -->

<a id="old-to-new"></a>
## 7. Chuyển đổi UC cũ → mới

Mã cũ giữ nguyên khi nghĩa giữ nguyên hoặc chỉ mở rộng thao tác của cùng mục tiêu; mã bị gộp **không tái sử dụng** cho nghĩa khác; UC mới nhận mã mới (UC54–UC56). Quan hệ cũ: IN01, EX01–EX03 không còn dùng mã; nghĩa chuyển sang EX04, EX05.

<!-- GENERATED:old-to-new:BEGIN -->
| UC cũ | Tên cũ | Hành động | UC mới | Lý do |
| --- | --- | --- | --- | --- |
| UC01 | Sign In | Giữ | [UC01](#uc01) | Giữ nguyên; nay vẽ trên sơ đồ tổng thể — mọi vai dùng qua generalization về Employee |
| UC02 | Administer User Accounts | Đổi tên / mở rộng | [UC02](#uc02) | Tên nêu đủ mục tiêu: tài khoản và vai trò gán tay |
| UC03 | Configure System Policies | Giữ | [UC03](#uc03) | Giữ; thêm giá trị mặc định SLA, N phút, loại kỳ ngân sách, ràng buộc người thay thế |
| UC04 | Review Audit Trail | Giữ | [UC04](#uc04) | Giữ; chỉ Super Admin (OI-08c) |
| UC05 | Monitor System Operations | Giữ | [UC05](#uc05) | Giữ |
| UC06 | Initialize Organization | Đổi tên / mở rộng | [UC06](#uc06) | Tên nêu đối tượng; «include» UC54 cho khung import dùng chung (FR-9.2) |
| UC07 | Manage Workforce | Đổi tên / mở rộng | [UC07](#uc07) | Tên nêu đối tượng là hồ sơ nhân sự theo thời gian |
| UC08 | Offboard Employee | Giữ | [UC08](#uc08) | Giữ; quan hệ với UC22 đổi từ «include» sang «extend» có điều kiện (EX05) |
| UC09 | Maintain SaaS Catalog | Đổi tên / mở rộng | [UC09](#uc09) | Thống nhất động từ Manage; thêm ngừng sử dụng và nhóm chức năng (OI-05b, OI-14e) |
| UC10 | Manage Contracts and Subscriptions | Giữ | [UC10](#uc10) | Giữ; nhận thêm ghi kỳ thuê bao mới (UC31 cũ) và đọc tệp gốc của IT (một phần UC34 cũ) |
| UC11 | Request Software Access | Giữ | [UC11](#uc11) | Giữ; nhận thêm thao tác rút yêu cầu (UC12 cũ) |
| UC12 | Withdraw Access Request | Gộp | [UC11](#uc11) | Rút là thao tác của người gửi trên chính Request của mình — cùng đối tượng, cùng quyền, không phải mục tiêu riêng |
| UC13 | Return Software Access | Giữ | [UC13](#uc13) | Giữ |
| UC14 | Review Access Need | Giữ | [UC14](#uc14) | Giữ |
| UC15 | Assess New SaaS | Giữ | [UC15](#uc15) | Giữ |
| UC16 | Decide Spending Request | Giữ | [UC16](#uc16) | Giữ; nay là UC con của UC55 (GU01) |
| UC17 | Request Budget Information | Giữ | [UC17](#uc17) | Giữ; «extend» UC55 (EX04) thay ba extend EX01–EX03 lên UC16/UC30/UC43 |
| UC18 | Respond to Budget Inquiry | Gộp | [UC20](#uc20) | Trả lời hỏi ngân sách là một việc kiểm soát ngân sách của Finance (SoD-3), cùng actor và cùng dữ liệu |
| UC19 | Record Budget Commitment | Gộp | [UC20](#uc20) | Ghi nhận khoản cam kết cùng mục tiêu kiểm soát ngân sách — theo dõi đã hứa chi |
| UC20 | Manage Budgets | Đổi tên / mở rộng | [UC20](#uc20) | Mở rộng thành Control Budgets and Commitments sau khi gộp UC18, UC19; không dùng chữ Approve |
| UC21 | Provision Software Access | Giữ | [UC21](#uc21) | Giữ |
| UC22 | Revoke Software Access | Giữ | [UC22](#uc22) | Giữ; «extend» UC08 khi người nghỉ còn giữ seat (EX05) |
| UC23 | Resolve Data Discrepancies | Đổi tên / mở rộng | [UC23](#uc23), [UC32](#uc32) | Quá rộng (hai actor, hai loại chênh lệch): sai lệch với nhà cung cấp giữ ở UC23; chênh lệch hóa đơn về UC32 |
| UC24 | Manage Usage Evidence | Giữ | [UC24](#uc24) | Giữ; nhận thêm hàng đợi khớp danh tính (UC25 cũ) |
| UC25 | Resolve Identity Matches | Gộp | [UC24](#uc24) | Khớp danh tính là bước làm sạch bằng chứng của cùng IT, cùng kết quả |
| UC26 | Operate Device Monitoring | Giữ | [UC26](#uc26) | Giữ |
| UC27 | Acknowledge Device Monitoring | Giữ | [UC27](#uc27) | Giữ |
| UC28 | Review License Recommendations | Giữ | [UC28](#uc28) | Giữ; Manager quyết cuối (OI-02) |
| UC29 | Review Renewal Alerts | Giữ | [UC29](#uc29) | Giữ; thêm Spending Approver (OI-09a) |
| UC30 | Decide Subscription Renewal | Giữ | [UC30](#uc30) | Giữ; nay là UC con của UC55 (GU02) |
| UC31 | Record Subscription Changes | Gộp | [UC10](#uc10) | Ghi kỳ mới là cập nhật vòng đời thuê bao của cùng IT sau UC30 |
| UC32 | Reconcile Invoices | Giữ | [UC32](#uc32) | Giữ; nhận chênh lệch hóa đơn từ UC23 cũ; «include» UC54 (IN03) |
| UC33 | Allocate Shared Costs | Đổi tên / mở rộng | [UC33](#uc33) | Mở rộng thành Manage Cost Centers and Allocations — Finance quản lý danh mục Cost Center (OI-04) |
| UC34 | Review Contract Evidence | Thành bước con | [UC10](#uc10), [UC32](#uc32), [UC55](#uc55) | Đọc tệp gốc là bước trong công việc khác: IT (UC10), Finance (UC32), Spending Approver (UC55, OI-08a) |
| UC35 | Review Spending | Gộp | [UC56](#uc56) | Một nhóm báo cáo của UC56; phạm vi theo vai giữ trong đặc tả |
| UC36 | Forecast Costs | Giữ | [UC36](#uc36) | Giữ (L1, L3) |
| UC37 | Review Savings | Gộp | [UC56](#uc56) | Một nhóm báo cáo của UC56 |
| UC38 | Review Usage Performance | Gộp | [UC56](#uc56) | Một nhóm báo cáo của UC56 |
| UC39 | Review Process Performance | Gộp | [UC56](#uc56) | Một nhóm báo cáo của UC56 |
| UC40 | Review Data Quality | Gộp | [UC56](#uc56) | Một nhóm báo cáo của UC56 |
| UC41 | Import Discovery Evidence | Tách | [UC54](#uc54), [UC42](#uc42) | Trộn hai mục tiêu: nạp file (UC54, IT/Finance) và khớp nhà cung cấp/tạo finding (UC42) |
| UC42 | Investigate Shadow IT | Giữ | [UC42](#uc42) | Giữ; IT xác nhận khớp tin cậy thấp trước khi chuyển quyết |
| UC43 | Decide SaaS Legitimization | Giữ | [UC43](#uc43) | Giữ; nay là UC con của UC55 (GU03); bỏ association hỗ trợ của IT — đánh giá thuộc UC42, thực thi thuộc UC09/UC21/UC22 |
| UC44 | View Personal Access and Data | Đổi tên / mở rộng | [UC44](#uc44) | Mở rộng thành Exercise Personal Data Rights sau khi gộp UC45, UC46 và thêm yêu cầu chỉnh sửa (OI-13) |
| UC45 | Request Personal Data Export | Gộp | [UC44](#uc44) | Một loại yêu cầu quyền dữ liệu của cùng nhân viên |
| UC46 | Request Monitoring Stop | Gộp | [UC44](#uc44) | Một loại yêu cầu quyền dữ liệu của cùng nhân viên |
| UC47 | Process Data Subject Requests | Giữ | [UC47](#uc47) | Giữ; SLA và quy tắc xử lý OI-01a/b/c, OI-13b |
| UC48 | Notify Employees of Monitoring | Giữ | [UC48](#uc48) | Giữ |
| UC49 | Change Subscription Plan | Deferred | [UC49](#uc49) | Giữ mã, vẫn deferred (F-16 chỉ thiết kế) |
| UC50 | Conduct Periodic Access Review | Deferred | [UC50](#uc50) | Giữ mã, vẫn deferred (F-24, WF-14) |
| UC51 | Monitor Desktop Usage | Deferred | [UC51](#uc51) | Giữ mã, vẫn deferred (QĐ-20) |
| UC52 | Forecast Variable Costs | Deferred | [UC52](#uc52) | Giữ mã, vẫn deferred (L2, QĐ-25) |
| UC53 | Consult AI Assistant | Deferred | [UC53](#uc53) | Giữ mã, vẫn deferred (lớp AI tùy chọn) |

| UC mới | Tên | Nguồn gốc |
| --- | --- | --- |
| [UC54](#uc54) | Import Business Data File | Tách từ UC41 và từ khung import lặp lại ở UC06/UC24/UC32 (BRD 5.7, FR-7.1) |
| [UC55](#uc55) | Decide Spending Matter | UC trừu tượng gom hành vi quyết định chung của UC16, UC30, UC43 (FR-3.13, FR-3.14, FR-3.4c-1) |
| [UC56](#uc56) | Review Governance Reports | Gộp năm nhóm báo cáo UC35, UC37–UC40 (BRD 5.5.3, QĐ-24) |

| Quan hệ cũ | Nay là |
| --- | --- |
| IN01 | EX05 (UC08 «include» UC22 re-modelled as UC22 «extend» UC08: offboarding without any held seat is complete) |
| EX01 | EX04 (UC17 now extends the general UC55; UC16 inherits the extension point) |
| EX02 | EX04 (inherited by UC30 through GU02) |
| EX03 | EX04 (inherited by UC43 through GU03) |

**Tổng:** Giữ 26, Đổi tên / mở rộng 8, Gộp 12, Thành bước con 1, Tách 1, Deferred 5 = 53 mã cũ (48 MVP + 5 deferred); 3 mã mới. Không mã cũ nào bị dùng lại với nghĩa khác.
<!-- GENERATED:old-to-new:END -->

<a id="decisions"></a>
## 8. Quyết định và câu hỏi còn mở

### 8.1. Quyết định giữ nguyên, không hỏi lại

`QĐ-01`–`QĐ-30` (sổ quyết định); `DQ-01`, `DQ-02`, `DQ-03`, `DQ-05`, `DQ-06`, `DQ-07` (mentor/GVHD xác nhận 21/09/2026), `DQ-04`, `KPI3-DENOM` (Owner); **OI-01** IT Admin xử lý yêu cầu quyền dữ liệu; **OI-02** Manager quyết cuối, IT trả lại tối đa một lần; **OI-03** Finance khai/sửa phân bổ; **OI-EMAIL** Email Service Provider chỉ nối UC29 và UC48 (Owner 25/09/2026, xác nhận lại trong yêu cầu này và nay ghi vào sổ quyết định). Finance không nằm trên đường duyệt (`QĐ-29b`). Không có ủy quyền (`QĐ-27`).

<a id="session-decisions"></a>
### 8.2. Quyết định Owner trong phiên 25/09/2026

Owner trả lời trực tiếp từng câu hỏi trong phiên dựng mô hình này; **không** phải xác nhận của mentor/GVHD. Đã ghi vào [sổ quyết định][qd] và đồng bộ các nguồn liệt kê.

| Mã | Câu hỏi nguồn | Quyết định | Áp dụng trong mô hình | Đã đồng bộ nguồn |
| --- | --- | --- | --- | --- |
| OI-01a | SLA dừng thu thập (BF-13 phần còn mở) | 2 ngày làm việc, cấu hình được; quá hạn nhắc/cảnh báo nghẽn; căn cứ pháp lý chờ kiểm chứng | UC47, `BR-40.4` | BRD `FR-10.5`; User Flows `BR-40.4`; `US-09-04` |
| OI-01b | Từ chối/kháng nghị yêu cầu dừng | Yêu cầu hợp lệ luôn thực hiện; chỉ đóng yêu cầu không hợp lệ kèm lý do; không kháng nghị MVP | UC44, UC47, `BR-40.5` | BRD `FR-10.5`; `BR-40.5`; `US-09-04` |
| OI-01c | IT Admin tự xử lý yêu cầu của mình | Được, Audit Trail gắn cờ | UC47, `BR-40.6` | `BR-40.6`; `US-09-04`, `US-14-02` |
| OI-13 | `OQ-US-31` quyền chỉnh sửa dữ liệu cá nhân | Đưa vào MVP: gửi qua UC44, IT xử lý ở UC47; không sửa usage gốc/Audit Trail | UC44, UC47, `BR-40.7` | BRD `FR-10.7` mới; `BR-40.7`; `US-14-06` mới |
| OI-13b | Thời hạn chỉnh sửa và ngoại lệ xuất | 10 ngày, cấu hình được | UC47, `BR-40.8` | `BR-40.8`; `US-14-02`, `US-14-06` |
| OI-09a | `BF-08` Spending Approver có nhận cảnh báo gia hạn | Nhận từ T−15 cùng IT/Finance/Business Owner | Association A05–UC29, `BR-26.4` | BRD 4.4, `FR-1.4`; `BR-26.4`; `US-11-01`; WF-15 ghi chú |
| OI-09b | `OQ-US-07`, `TE-05`, Context MAIL-1 | Thông báo khác chỉ trong ứng dụng; email chỉ cho cảnh báo hạn báo hủy và thông báo trước khi theo dõi | `BR-42.7`; không đổi association | BRD `FR-3.11`; `BR-42.7`; `TE-05`, `US-05-15`, `US-08-05`; Context MAIL-1 (văn bản) |
| OI-04 | `OQ-US-05` chủ quản danh mục Cost Center | Finance; mã chưa có bị từ chối, không tự tạo | UC33, UC06, UC07, `BR-01.6`, `BR-29.9` | BRD `FR-3.1`, `FR-9.7`; `BR-01.6`, `BR-29.9`; `US-02-03`, `US-04-09` mới; Context FIN-10 |
| OI-06 | `BF-12` mốc rút yêu cầu | Tới khi tác vụ cấp phát còn *chờ thực thi*; giải phóng cam kết ngay | UC11, UC20, `BR-07.11` | BRD 5.3 bảng ngoại lệ, 5.12.3; `BR-07.11`; `US-05-08` |
| OI-07a | `OQ-US-09` xác nhận thời hạn > 12 tháng | Manager tích xác nhận riêng kèm lý do trong UC14; không thêm bước | UC11, UC14; `BR-07.4`, `BR-15.1`, `BR-39.4` (làm rõ) | User Flows 3 BR; `US-03-05`, `US-05-01`, `US-05-14` |
| OI-05a | `BF-11` ý kiến Business Owner cho SaaS mới nhạy cảm | Đầu vào không chặn do IT ghi | UC15, `BR-09.3` (làm rõ) | `BR-09.3`; WF-10 ghi chú; `US-05-06` |
| OI-05b | `OQ-US-10` ngừng sử dụng ứng dụng | Thao tác IT trong UC09, ghi xác nhận Business Owner | UC09, `BR-06.6` | BRD 4.4; `BR-06.6`; `US-04-01` |
| OI-05c | `OQ-US-12` Business Owner nghỉ việc | Giữ người cũ gắn cờ tới khi có người thay; không gửi cảnh báo cho người đã nghỉ | UC08, UC09, UC29, `BR-06.7` | BRD `FR-1.7`; `BR-06.7`; `US-04-06` |
| OI-08a | `OQ-US-11` Spending Approver mở tệp gốc | Được, chỉ của hồ sơ đang quyết | UC55, `BR-06.8` | BRD `FR-1.5`; `BR-06.8`; `US-04-04` |
| OI-08b | `OQ-US-26` Manager xem số tài chính nào | Thực chi + cam kết của cây cấp dưới; không ngân sách/còn lại/tổng công ty | UC56, `BR-29.8` | BRD 5.5.3; `BR-29.8`; `US-12-01` |
| OI-08c | `OQ-US-04` ai đọc Audit Trail | Chỉ Super Admin | UC04, `BR-38.3` | `BR-38.3`; `US-01-06` |
| OI-10 | `OQ-US-06` đóng giai đoạn khởi tạo | Khi IT chốt bước 4 | UC06, `BR-01.7` | BRD `FR-9.4`; `BR-01.7`; `US-02-05` |
| OI-11a | `OQ-US-18` hóa đơn khớp một phần | Trừ dần theo số tiền; Finance giải phóng phần dư có lý do | UC20, UC32, `BR-36.7` | BRD `FR-5.8`; `BR-36.7`; `US-06-06`, `US-12-02` |
| OI-11b | `OQ-US-19` kỳ ngân sách | Một loại kỳ cho tổ chức, mặc định quý | UC03, UC20, `BR-36.8` | BRD `FR-5.1`; `BR-36.8`; `US-06-09`, `US-01-04` |
| OI-11c | `OQ-US-25` giảm seat dưới số Assignment | Thu hồi phần vượt trước khi ghi kỳ mới | UC30, UC10, `BR-27.5` | `BR-27.5`; `US-11-02`, `US-11-03` |
| OI-11d | `OQ-US-17` phạm vi "tổng đang chờ" trong snapshot | Cùng Cost Center và kỳ | UC55, `BR-36.8` | BRD `FR-3.14`; `BR-36.8`; `US-06-01` |
| OI-12a | `OQ-US-22` cổng lọc cho G1/G2 | Chỉ cổng 1 và 8 | UC28, `BR-20.6` | BRD `FR-4.9`; `BR-20.6`; `US-10-01`, `US-10-02` |
| OI-12b | `OQ-US-23` cách đọc cổng 5 | Tính phần cửa sổ từ ngày cấp | UC28, `BR-20.7` | `BR-20.7`; `US-10-02` |
| OI-14a | `OQ-US-02` SLA | Giờ làm việc, mặc định 2 ngày làm việc mỗi loại bước | UC03, UC14, UC55, `BR-13.11` | BRD `FR-3.8`; `BR-13.11`; User Flows mục 10 câu 2; `US-01-04`, `US-05-09` |
| OI-14b | `OQ-US-03` ngưỡng N phút | 5 phút/ngày | UC03, UC26, `BR-45.5` (làm rõ) | BRD `FR-4.17`; `BR-45.5`; `US-01-04`, `US-09-06` |
| OI-14c | `OQ-US-08` hạn bàn giao | 1 ngày làm việc trước ngày cuối; không chặn thu hồi | UC08, `BR-05.6` | `BR-05.6`; `US-03-04` |
| OI-14d | `OQ-US-21` nhiều thiết bị / dùng chung | Nhiều thiết bị được; dùng chung không thu | UC26, UC27, `BR-45.8` | BRD `FR-4.18`; `BR-45.8`; `US-09-01` |
| OI-14e | `OQ-US-14` nhóm chức năng | Thuộc tính do IT gán trong danh mục | UC09, UC14, UC15, UC42, `BR-06.9` | BRD `FR-1.1`; `BR-06.9`; `US-04-01`, `US-05-04` |
| OI-14f | `OQ-US-29` finding đóng tái xuất hiện | Duyệt: không mở; Không duyệt: mở lại có cờ | UC42, `BR-31.6` | `BR-31.6`; `US-13-03` |
| OI-14g | `OQ-US-30` lý do khi quyết finding | Bắt buộc với không duyệt/báo nhầm | UC43, `BR-34.3` | `BR-34.3`; `US-13-05`, `US-13-06` |
| OI-14h | `OQ-US-20` tần suất đối soát nhà cung cấp | Hằng ngày, cấu hình được | UC23 | BRD `FR-2.6`; `US-07-06` |
| OI-17 | `OQ-US-01` người thay thế trùng Người duyệt chi | Chặn khi lưu | UC03, `BR-13.12` | BRD `FR-3.15`; `BR-13.12`; `US-01-03` |
| OI-EMAIL | Email Service Provider nối UC nào | Chỉ UC29, UC48 | A10 | Sổ quyết định (lần này); `BR-42.7` |

<a id="closed-by-source"></a>
### 8.3. Điểm mở đã có câu trả lời trong nguồn — đóng, không hỏi

| Mã | Câu trả lời có sẵn | Căn cứ | Việc đã làm |
| --- | --- | --- | --- |
| `BF-01` | Hợp thức hóa đi đúng nhánh (c): Spending Approver quyết trước khi thêm vào danh mục, kể cả miễn phí; ba kết cục | `DQ-06` (mentor/GVHD xác nhận), BRD `FR-3.4c-1`, WF-17 đã vẽ lại | Đóng trong User Stories; viết lại thân `US-13-06`, `US-13-05` cho khớp |
| `BF-03` | Cột "Ai quyết định" của G1 là Người duyệt chi tại kỳ gia hạn (IT đề xuất) | BRD `FR-3.13`, `BR-27.4`, `QĐ-22` | Sửa bảng bốn nhóm ở User Flows mục 4.3; đóng |
| `BF-04` | Chuỗi F/BR cần mang `FR-5.8a`/`INV-18`/`FR-9.7` | BRD v3.11 (`QĐ-30b`, `QĐ-30c`) | Thêm `BR-01.5`, `BR-36.5`, `BR-36.6` vào User Flows; WF/UF không đổi nhánh; đóng |
| `BF-05` | Danh sách cho phép = danh mục **+** từ điển nhà cung cấp | Scope v1.7 mục 1.5 (`SA-07`), `FR-4.17`, `FR-6.3`(c) | Sửa câu phản biện `ADR-13` (BRD) và mục đích `F-45`; đóng |
| `BF-07` | `BR-42.1` là biện pháp thiết kế, không là kết luận pháp lý | BRD 7.7.7, User Flows `BR-42.1` | Sửa câu ở bảng WF-12 (Workflows index); đóng |
| `BF-10` | Đồng tiền báo cáo cấu hình theo tổ chức; Business Owner không có quyền phê duyệt | BRD `ADR-03`, 4.4 | Ghi trả lời; **ERD chưa đồng bộ** (ngoài quyền sửa lần này) |
| `OQ-US-15` | Hoàn trả không cần bước duyệt | BRD 5.10 dòng *Hoàn trả*, `F-14`, `BR-14.1` | Đóng; UC13 không có Manager |
| `OQ-US-16` | Đổi gói, rà soát định kỳ: yêu cầu có nhưng hiện thực hoãn | Scope 5.2 (3 luồng chỉ thiết kế), `QĐ-25` | Đóng; UC49, UC50 deferred |

<a id="open-items"></a>
### 8.4. Còn mở — không chặn mô hình

| Mã | Nội dung | Loại | Người/điều kiện đóng | Ảnh hưởng tới mô hình |
| --- | --- | --- | --- | --- |
| `OQ-US-24` | Công thức mức tin cậy của khuyến nghị | Nghiên cứu (`R1`) | Đặc tả kỹ thuật rule engine | Không đổi actor/UC; UC28 giữ yêu cầu hiển thị mức tin cậy |
| `OQ-US-27` | Ngưỡng khớp mờ nhà cung cấp | Nghiên cứu/tham số | Thử trên dữ liệu demo | Không |
| `OQ-US-28` | Định dạng export IdP/OAuth dùng cho demo | Kỹ thuật | Chọn nguồn demo | Không |
| `OQ-15` / `QĐKT-02` | ~~Nhà cung cấp định danh cụ thể~~ — **thay bởi `QĐ-46`** (04/10/2026): không còn nhà cung cấp định danh cho đăng nhập | Đã thay | — | A09 đã gỡ khỏi mô hình |
| ~~`QĐ-46d`~~ | ~~Các điểm Owner chưa quyết~~ — **đã chốt 04/10/2026 (`QĐ-47`)**: khôi phục thông tin đăng nhập ngoài ứng dụng; không thêm quy trình hai người cho việc nghỉ của Super Admin; 0 vai gán trực tiếp; múi giờ bất biến | Đã quyết | — | Thêm UC59, UC60; khôi phục là thủ tục ngoài ứng dụng nên **không** có UC/actor mới |
| Lệch `.drawio` edited ↔ đặc tả (02/10) — **đã phân loại 04/10/2026** | **Đã sửa:** `GA02` thiếu đích; oval *Manage Profile* thành **UC59**; thêm UC60. **Đã thay kỳ vọng lỗi thời** của checker (số đếm, A12, oval Profile, kho kiểm kê 29/09). ~~**Còn lại — Owner quyết:** tám association có trong đặc tả nhưng không vẽ~~ — **đóng 04/10/2026**: đối chiếu nguồn (`US-03-01/02/03`, `FR-1.4`, BRD 5.5.3, `FR-0.3`) cho thấy cả tám là bắt buộc nên đã vẽ — [bảng tám association](#edited-eight-associations) | Nhất quán nguồn/hình | — | `check_edited_use_case.py` **pass**, `KNOWN_OMISSIONS` rỗng, 53 association, không đường nào cắt oval khác |
| Email của `QĐ-46` | Lời mời/đặt lại mật khẩu gửi qua email, trong khi `OI-09b`/`BR-42.7`/`FR-3.11` giới hạn email cho cảnh báo hạn báo hủy và thông báo trước khi theo dõi | ✅ **Đóng 04/10/2026**: BRD v3.24 ghi **ngoại lệ thư vòng đời tài khoản** của `FR-3.11` (`QĐ-46`); Context thêm `G41`/`G42` và mở rộng nội dung `G37` | — | Vẫn **không** vẽ A10 trên view edited (Owner đã lược actor). *(Đính chính 04/10/2026)* Mô hình đầy đủ (`tools/usecase_model.py`, bảng actor A10) vẫn chỉ nối A10 với UC29, UC48; thư vòng đời của UC59/UC02 được ghi ở đặc tả UC và Context (`G41`/`G42`), **chưa** thành association — thêm hay không là việc theo dõi, không tự vẽ |
| `OQ-16` | Xác nhận chủ động có thay được sự đồng ý | Pháp lý | Ý kiến pháp lý | Không — không trình bày là đã tuân thủ |
| `OQ-17`, `OQ-18` | Trình duyệt hỗ trợ; điều kiện force-install | Kỹ thuật | Đặc tả tiện ích, spike | Không |
| Thời hạn pháp lý BRD 5.11 | Con số 2 ngày làm việc / 10 ngày dùng cho OI-01a, OI-13b | Pháp lý | Kiểm chứng văn bản gốc NĐ 356/2025 | Không đổi UC; nếu văn bản khác, sửa giá trị mặc định |
| `GOV-1` | Mentor/GVHD chưa xác nhận `QĐ-29`, `QĐ-30` | Quản trị | Buổi review | Không |
| `BF-06`, `BF-09` | `INV-15` ERD ↔ BRD; số phiên bản/số đếm lạc hậu | Tài liệu | Lượt đồng bộ ERD/BRD sau | Không |
| Connector GitHub | Ghi `Members` (mời/gỡ) — *(02/10/2026)* phần **đọc** (owner, thành viên, commit theo mọi nhánh) đã kiểm chứng ở prototype (`TE-11a`, `QĐ-36a`); phần **ghi** chưa (`TE-11b`) | Bằng chứng kỹ thuật | Owner duyệt phạm vi thao tác ghi + tài khoản thử | Không — A08 tham gia có điều kiện |
| Context PNG | `SaaS-Sentry-Context-Diagram.drawio.png` không còn trên đĩa, `.drawio` bị phiên khác sửa | Artifact | Người phụ trách Context tái sinh | Không; tài liệu này dẫn tới Context index, không tới PNG |
| `WF-07` nhánh không còn seat | Sau `Mark Employee Departed`, `WF-07` luôn rẽ sang *Confirm Bulk Reclaim* → `WF-09a`; không có quyết định `[không còn seat nào]` như EX05 ([UC08](#uc08)) | Tài liệu (Workflow) | Người phụ trách Workflows thêm quyết định trước `a4` (cả `.drawio` lẫn Mermaid, cập nhật manifest parity) | Không — mô hình Use Case đã đúng; workflow chỉ thiếu nhánh rỗng, hành vi có seat không đổi |

<a id="reading-guide"></a>
## 9. Hướng dẫn đọc sơ đồ và script thuyết trình

<a id="caption"></a>
**Caption ngắn đi cùng ảnh** (đặt ngay dưới hình; canvas không chứa caption):

> Hình — Use case SaaS-Sentry (một sơ đồ, phạm vi MVP; in A3 ngang). Đường liền = actor tham gia, không đồng nghĩa quyền quyết. Tam giác rỗng = generalization: mọi vai quản trị cũng là Employee; Governance User là vai trừu tượng xem báo cáo theo phạm vi; ba quyết định của Người duyệt chi chuyên biệt hóa *Decide Spending Matter*. Nét đứt: «include» tới khung import dùng chung; «extend» hỏi Finance tùy chọn và thu hồi khi người nghỉ còn giữ seat. Actor «system» tham gia có điều kiện, không chứng nhận tích hợp đã chạy. Đặc tả, quy tắc và truy vết: `use-case-specification.md`.

### 9.1. Cách đọc

1. **Khung SaaS-Sentry** là hệ thống; mọi actor ở ngoài. Hình người có `«system»` là hệ thống ngoài.
2. **Đường liền** = tham gia mục tiêu. Vai chính/hỗ trợ và giới hạn quyền nằm trong đặc tả, **không** suy từ việc có dây.
3. **Tam giác rỗng** chạy vòng ngoài boundary: Manager, IT Admin, Finance, Spending Approver, Super Admin → *Governance User* → Employee. Nghĩa: người giữ vai nào cũng dùng được các UC của nhân viên cho **chính mình** (đăng nhập, xin quyền, dữ liệu cá nhân) và xem báo cáo **trong phạm vi vai**. Không kế thừa quyền duyệt hay thực thi.
4. **UC in nghiêng** (UC55) là UC trừu tượng: không thực hiện trực tiếp; ba UC con (UC16, UC30, UC43) thừa hưởng hành vi quyết trên snapshot và điểm mở rộng *Assess Budget*.
5. **Nét đứt «include»** (UC06, UC32 → UC54): luôn chạy khung import 6 bước. **Nét đứt «extend»**: UC17 → UC55 (hỏi Finance *nếu muốn*), UC22 → UC08 (thu hồi *nếu* người nghỉ còn seat). Điểm mở rộng ghi trong ngăn dưới của oval.
6. **Không đọc sơ đồ như workflow:** vị trí không phải thứ tự. Thứ tự và nhánh lỗi xem Workflows (WF-07, WF-09/10, WF-13, WF-15, WF-17).

### 9.2. Script thuyết trình (4–5 phút)

"(Khung) Đây là SaaS-Sentry — một hệ thống quản trị nội bộ cho một doanh nghiệp. Mỗi oval là một mục tiêu có kết quả; hình người là vai; bốn hình có chữ «system» là hệ thống ngoài. Đường liền chỉ nói *ai tham gia*, không nói ai quyết.

(Trên cùng) Mọi người dùng trước hết là **Employee**: đăng nhập, xin quyền dùng phần mềm, hoàn trả, xác nhận thông báo theo dõi thiết bị và thực hiện quyền dữ liệu của mình — xem, xuất, xin dừng theo dõi, xin chỉnh sửa. Các tam giác rỗng chạy vòng ngoài cho thấy Manager, IT, Finance, Người duyệt chi, Super Admin đều là Employee — nhưng kế thừa chỉ các việc *cho chính mình*; phần xem báo cáo được gom qua vai trừu tượng Governance User, mỗi vai một phạm vi.

(Trái — IT Admin) IT là bên vận hành và **thực thi**: danh mục, hợp đồng, nhân sự, bằng chứng sử dụng, thiết bị, cấp và thu hồi quyền thật — khi có connector thì SaaS Provider tham gia. Khi một người nghỉ việc, UC08 *có thể* được mở rộng bởi thu hồi UC22 — chỉ khi người đó còn giữ seat; thực tập sinh không giữ gì thì offboarding vẫn hoàn chỉnh. Khởi tạo và đối soát hóa đơn luôn đi qua khung import dùng chung UC54.

(Góc trái dưới — Manager) Manager quyết **nhu cầu** ở UC14 và quyết cuối Keep/Reclaim/Exempt ở UC28 — IT chỉ được trả lại một lần có lý do.

(Phải trên — Người duyệt chi) Mọi thay đổi **tiền hoặc danh mục** do Người duyệt chi quyết qua UC trừu tượng *Decide Spending Matter*: yêu cầu có chi phí, gia hạn/giảm/hủy, hợp thức hóa Shadow IT. Mũi tên «extend» từ UC17 cho thấy hỏi Finance là *tùy chọn* tại điểm *Assess Budget* — không hỏi thì quyết định vẫn hoàn chỉnh. Vì vậy Finance không phải cửa duyệt.

(Phải — Finance, Super Admin) Finance kiểm soát ngân sách và khoản cam kết, đối soát hóa đơn, quản lý Cost Center và phân bổ, dự báo. Trước hạn báo hủy, UC29 cảnh báo IT, Finance, Người duyệt chi, Business Owner; Super Admin thêm ở T−7; email là kênh cho cảnh báo này và thông báo trước khi theo dõi. Super Admin quản trị tài khoản, chính sách, audit, job — không duyệt nghiệp vụ.

(Kết) 37 mục tiêu trên một trang phủ toàn bộ phạm vi MVP; năm mục tiêu hoãn nằm trong đặc tả. Quy tắc và truy vết ở tài liệu đặc tả; muốn xem thứ tự và nhánh lỗi thì chuyển sang Workflow."

### 9.3. Câu hỏi có thể gặp

| Câu hỏi | Trả lời có căn cứ |
| --- | --- |
| Vì sao Manager kế thừa Employee mà không trao thêm quyền? | UC của Employee đều tự phục vụ; kế thừa chỉ nói Manager cũng là nhân viên (BRD 4.3). SoD-4 vẫn chặn tự duyệt ([2.1](#actor-generalization)) |
| Governance User có đăng nhập riêng không? | Không — trừu tượng, không có thể hiện trực tiếp; là cách gom association báo cáo của năm vai (BRD 5.5.3) |
| Sao không include Sign In? | Phiên là precondition; một phiên phục vụ nhiều mục tiêu |
| Sao UC08 → UC22 không còn là include? | Người nghỉ không giữ seat thì không có thu hồi; include đòi luôn chạy (§18.1.3.3) → extend có điều kiện (§18.1.3.2) |
| Một extend lên UC cha có đúng cho UC con? | Extension point thuộc UC55 (§18.2.2.5); thể hiện của UC con cũng là thể hiện của UC cha (§9.2.3.2) |
| Finance có duyệt chi không? | Không — trả lời khi được hỏi, ghi nhận sau duyệt, song song cấp phát (`QĐ-29b`, `SoD-3`) |
| Vì sao Email chỉ nối hai UC? | OI-EMAIL: chỉ nơi thư là kết quả của mục tiêu; thông báo khác chỉ trong ứng dụng (OI-09b) |
| Có actor SaaS Provider nghĩa là API đã chạy? | Không — tham gia có điều kiện; MVP có connector thật cho GitHub, còn lại file/thủ công |
| Mô hình có chứng minh tuân thủ pháp luật? | Không — chỉ mô tả biện pháp thiết kế; `OQ-16` còn mở |

[brd]: <../../Requiments/BRD - HỆ THỐNG QUẢN TRỊ BẢN QUYỀN PHẦN MỀM & TỐI ƯU CHI PHÍ CÔNG NGHỆ.md>
[scope]: <../../Requiments/Định nghĩa phạm vi & nghiệp vụ.md>
[qd]: ../../Decisions/project-decisions.md
[dq]: ../../Reviews/system-decisions-baseline.md#source-decision-session-checkpoint-2026-09-21
[ctx]: ../context-diagram/index.md
[wf]: ../workflows-activity-diagram/index.md
[uf]: ../user-flows/index.md
[us]: ../../BE-UserStory/user-stories-and-epics.md
