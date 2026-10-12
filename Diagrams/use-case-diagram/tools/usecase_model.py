"""Single editable source for the SaaS-Sentry use case model (one diagram).

The business meaning of every element is specified in ../use-case-specification.md;
change that document first, then this model, then rebuild with build_use_case_diagrams.py.
Since 25/09/2026 the model is drawn on exactly one page; the former overview/detail
pages P00-P09 are retired (see OLD_TO_NEW).
"""

DIAGRAM_FILE = "saas-sentry-use-case-diagram"
DIAGRAM_TITLE = "SaaS-Sentry - Use Case Diagram"

# kind: human | system. abstract actors are drawn with an italic name.
ACTORS = {
    "A01": {"label": "Employee", "vi": "Nhân viên", "kind": "human"},
    "A02": {"label": "Manager", "vi": "Quản lý trực tiếp", "kind": "human"},
    "A03": {"label": "IT Admin", "vi": "Quản trị viên CNTT", "kind": "human"},
    "A04": {"label": "Finance", "vi": "Tài chính / Kế toán", "kind": "human"},
    "A05": {"label": "Spending Approver", "vi": "Người duyệt chi", "kind": "human"},
    "A06": {"label": "Super Admin", "vi": "Quản trị hệ thống", "kind": "human"},
    "A07": {"label": "Business Owner", "vi": "Người sở hữu nghiệp vụ ứng dụng", "kind": "human"},
    "A08": {"label": "SaaS Provider", "vi": "Nhà cung cấp SaaS", "kind": "system"},
    # A09 Identity Provider RETIRED 04/10/2026 (QĐ-46): sign-in is native, no external identity service takes part.
    # The code is never reused. IdP as a discovery data source (F-32, FR-6.3(b)) was never an actor on this model.
    "A10": {"label": "Email Service Provider", "vi": "Dịch vụ gửi thư", "kind": "system"},
    "A11": {"label": "Exchange Rate Service", "vi": "Dịch vụ tỷ giá", "kind": "system"},
    "A12": {"label": "Governance User", "vi": "Người dùng có vai quản trị", "kind": "human", "abstract": True},
    # QĐ-32a/b (29/09/2026): hosted model reached during UC42 (vendor suggestion, Low confidence). Supporting only —
    # never decides. Present only when a hosted provider is configured; a model run inside the deployment is not an actor.
    "A13": {"label": "AI Model Provider", "vi": "Nhà cung cấp mô hình AI", "kind": "system"},
}

# MVP use cases on the diagram. "abstract": True -> italic name, no direct instance.
USE_CASES = {
    "UC01": {"name": "Sign In", "vi": "Đăng nhập"},
    "UC02": {"name": "Manage User Accounts and Roles", "vi": "Quản lý tài khoản và vai trò"},
    "UC03": {"name": "Configure System Policies", "vi": "Cấu hình chính sách hệ thống"},
    "UC04": {"name": "Review Audit Trail", "vi": "Tra cứu nhật ký kiểm toán"},
    "UC05": {"name": "Monitor System Operations", "vi": "Giám sát vận hành hệ thống"},
    "UC06": {"name": "Initialize Organization Data", "vi": "Khởi tạo dữ liệu tổ chức"},
    "UC07": {"name": "Manage Workforce Records", "vi": "Quản lý hồ sơ nhân sự và tổ chức"},
    "UC08": {"name": "Offboard Employee", "vi": "Xử lý nhân viên nghỉ việc"},
    "UC09": {"name": "Manage SaaS Catalog", "vi": "Quản lý danh mục SaaS"},
    "UC10": {"name": "Manage Contracts and Subscriptions", "vi": "Quản lý hợp đồng và thuê bao"},
    "UC11": {"name": "Request Software Access", "vi": "Yêu cầu quyền sử dụng phần mềm"},
    "UC13": {"name": "Return Software Access", "vi": "Hoàn trả quyền sử dụng"},
    "UC14": {"name": "Review Access Need", "vi": "Xác nhận nhu cầu"},
    "UC15": {"name": "Assess New SaaS", "vi": "Đánh giá SaaS mới"},
    "UC16": {"name": "Decide Spending Request", "vi": "Quyết định yêu cầu có chi phí"},
    "UC17": {"name": "Request Budget Information", "vi": "Hỏi thông tin ngân sách"},
    "UC20": {"name": "Control Budgets and Commitments", "vi": "Kiểm soát ngân sách và khoản cam kết"},
    "UC21": {"name": "Provision Software Access", "vi": "Cấp quyền sử dụng"},
    "UC22": {"name": "Revoke Software Access", "vi": "Thu hồi quyền sử dụng"},
    "UC23": {"name": "Resolve Vendor Discrepancies", "vi": "Xử lý sai lệch với nhà cung cấp"},
    "UC24": {"name": "Manage Usage Evidence", "vi": "Quản lý bằng chứng sử dụng"},
    "UC26": {"name": "Operate Device Monitoring", "vi": "Vận hành thu thập trên thiết bị"},
    "UC27": {"name": "Acknowledge Device Monitoring", "vi": "Xác nhận thông báo theo dõi thiết bị"},
    "UC28": {"name": "Review License Recommendations", "vi": "Xem xét khuyến nghị license"},
    "UC29": {"name": "Review Renewal Alerts", "vi": "Theo dõi cảnh báo gia hạn"},
    "UC30": {"name": "Decide Subscription Renewal", "vi": "Quyết định gia hạn thuê bao"},
    "UC32": {"name": "Reconcile Invoices", "vi": "Đối soát hóa đơn"},
    "UC33": {"name": "Manage Cost Centers and Allocations", "vi": "Quản lý Cost Center và phân bổ chi phí"},
    "UC36": {"name": "Forecast Costs", "vi": "Dự báo chi phí"},
    "UC42": {"name": "Investigate Shadow IT", "vi": "Điều tra Shadow IT"},
    "UC43": {"name": "Decide SaaS Legitimization", "vi": "Quyết định hợp thức hóa SaaS"},
    "UC44": {"name": "Exercise Personal Data Rights", "vi": "Thực hiện quyền dữ liệu cá nhân"},
    "UC47": {"name": "Process Data Subject Requests", "vi": "Xử lý yêu cầu quyền dữ liệu"},
    "UC48": {"name": "Notify Employees of Monitoring", "vi": "Thông báo trước khi theo dõi"},
    "UC54": {"name": "Import Business Data File", "vi": "Nhập tệp dữ liệu nghiệp vụ"},
    "UC55": {"name": "Decide Spending Matter", "vi": "Quyết định vấn đề chi tiêu", "abstract": True},
    "UC56": {"name": "Review Governance Reports", "vi": "Xem báo cáo quản trị"},
    "UC59": {"name": "Manage My Account", "vi": "Quản lý tài khoản của tôi"},   # 04/10/2026 QĐ-46/47: activation, forgot/reset/change password, profile
    "UC60": {"name": "Transfer Super Admin Role", "vi": "Chuyển giao vai Super Admin"},   # 04/10/2026 QĐ-44c/47
}

DEFERRED_USE_CASES = {
    "UC49": {"name": "Change Subscription Plan", "vi": "Đổi gói thuê bao", "status": "DEFERRED / DESIGN-ONLY"},
    "UC50": {"name": "Conduct Periodic Access Review", "vi": "Rà soát quyền định kỳ", "status": "DEFERRED / DESIGN-ONLY"},
    "UC51": {"name": "Monitor Desktop Usage", "vi": "Theo dõi ứng dụng desktop", "status": "DEFERRED / DESIGN-ONLY"},  # 29/09 QĐ-31b: agent now demo, carried by UC26
    "UC52": {"name": "Forecast Variable Costs", "vi": "Dự báo chi phí biến động", "status": "DEFERRED / DESIGN-ONLY"},
    "UC53": {"name": "Consult AI Assistant", "vi": "Hỏi trợ lý AI", "status": "DEFERRED / OPTIONAL"},
}

# (actor, use case, role): "primary" = owns the goal; "support" = provides input/service
# or receives the result. Both use the same UML notation (solid line, no arrow);
# participation never grants decision authority by itself.
ASSOCIATIONS = [
    ("A01", "UC01", "primary"),
    ("A01", "UC11", "primary"), ("A01", "UC13", "primary"), ("A01", "UC27", "primary"),
    ("A01", "UC44", "primary"), ("A01", "UC48", "support"),
    ("A02", "UC07", "support"), ("A02", "UC08", "support"), ("A02", "UC14", "primary"),
    ("A02", "UC28", "primary"), ("A02", "UC42", "support"),
    ("A03", "UC06", "primary"), ("A03", "UC07", "primary"), ("A03", "UC08", "primary"),
    ("A03", "UC09", "primary"), ("A03", "UC10", "primary"), ("A03", "UC15", "primary"),
    ("A03", "UC21", "primary"), ("A03", "UC22", "primary"), ("A03", "UC23", "primary"),
    ("A03", "UC24", "primary"), ("A03", "UC26", "primary"), ("A03", "UC28", "primary"),
    ("A03", "UC29", "primary"), ("A03", "UC42", "primary"),
    ("A03", "UC47", "primary"), ("A03", "UC48", "primary"), ("A03", "UC54", "primary"),
    ("A04", "UC20", "primary"), ("A04", "UC29", "primary"), ("A04", "UC32", "primary"),
    ("A04", "UC33", "primary"), ("A04", "UC36", "primary"), ("A04", "UC54", "primary"),
    ("A05", "UC55", "primary"), ("A05", "UC29", "primary"),
    ("A06", "UC02", "primary"), ("A06", "UC03", "primary"), ("A06", "UC04", "primary"),
    ("A06", "UC05", "primary"), ("A06", "UC29", "support"), ("A06", "UC60", "primary"),
    ("A01", "UC59", "primary"),
    ("A07", "UC29", "support"),
    ("A08", "UC21", "support"), ("A08", "UC22", "support"), ("A08", "UC23", "support"),
    ("A08", "UC24", "support"),
    ("A10", "UC29", "support"), ("A10", "UC48", "support"),
    ("A11", "UC10", "support"), ("A11", "UC20", "support"), ("A11", "UC32", "support"),
    ("A12", "UC56", "primary"),
    ("A13", "UC42", "support"),
]

# Actor generalization (specific -> general). Every governance role holder is an
# Employee (BRD 4.3: AppUser linked to one Employee) and inherits only the
# self-scoped Employee use cases; Governance User adds the scoped report view.
ACTOR_GENERALIZATIONS = [
    {"id": "GA01", "specific": "A12", "general": "A01"},
    {"id": "GA02", "specific": "A02", "general": "A12"},
    {"id": "GA03", "specific": "A03", "general": "A12"},
    {"id": "GA04", "specific": "A04", "general": "A12"},
    {"id": "GA05", "specific": "A05", "general": "A12"},
    {"id": "GA06", "specific": "A06", "general": "A12"},
]

# Use case generalization (specific -> general): three decisions of the Spending
# Approver share the budget-snapshot decision behaviour of UC55.
UC_GENERALIZATIONS = [
    {"id": "GU01", "specific": "UC16", "general": "UC55"},
    {"id": "GU02", "specific": "UC30", "general": "UC55"},
    {"id": "GU03", "specific": "UC43", "general": "UC55"},
]

INCLUDES = [
    {"id": "IN02", "source": "UC06", "target": "UC54",
     "behaviour": "Each initialization step loads its file through the shared six-step import (FR-9.2, FR-7.1)"},
    {"id": "IN03", "source": "UC32", "target": "UC54",
     "behaviour": "Every reconciliation starts by loading the invoice file through the shared import (US-12-02, FR-7.1)"},
]

EXTENDS = [
    {"id": "EX04", "source": "UC17", "target": "UC55", "point": "Assess Budget",
     "condition": "[matter has a cost and the approver chooses to ask Finance]"},
    {"id": "EX05", "source": "UC22", "target": "UC08", "point": "Reclaim Access",
     "condition": "[departing employee still holds an active or pending seat]"},
]

# Former model (48 MVP use cases on P00-P09, relations IN01, EX01-EX03) -> this model.
# old code -> (action, new codes, former English label, reason). action: keep | rename | merge | split |
# subflow | deferred. A merged code is never reused with another meaning.
OLD_TO_NEW = {
    "UC01": ("keep", ["UC01"], "Sign In",
             "Giữ nguyên; nay vẽ trên sơ đồ tổng thể — mọi vai dùng qua generalization về Employee"),
    "UC02": ("rename", ["UC02"], "Administer User Accounts",
             "Tên nêu đủ mục tiêu: tài khoản và vai trò gán tay"),
    "UC03": ("keep", ["UC03"], "Configure System Policies",
             "Giữ; thêm giá trị mặc định SLA, N phút, loại kỳ ngân sách, ràng buộc người thay thế"),
    "UC04": ("keep", ["UC04"], "Review Audit Trail", "Giữ; chỉ Super Admin (OI-08c)"),
    "UC05": ("keep", ["UC05"], "Monitor System Operations", "Giữ"),
    "UC06": ("rename", ["UC06"], "Initialize Organization",
             "Tên nêu đối tượng; «include» UC54 cho khung import dùng chung (FR-9.2)"),
    "UC07": ("rename", ["UC07"], "Manage Workforce", "Tên nêu đối tượng là hồ sơ nhân sự theo thời gian"),
    "UC08": ("keep", ["UC08"], "Offboard Employee",
             "Giữ; quan hệ với UC22 đổi từ «include» sang «extend» có điều kiện (EX05)"),
    "UC09": ("rename", ["UC09"], "Maintain SaaS Catalog",
             "Thống nhất động từ Manage; thêm ngừng sử dụng và nhóm chức năng (OI-05b, OI-14e)"),
    "UC10": ("keep", ["UC10"], "Manage Contracts and Subscriptions",
             "Giữ; nhận thêm ghi kỳ thuê bao mới (UC31 cũ) và đọc tệp gốc của IT (một phần UC34 cũ)"),
    "UC11": ("keep", ["UC11"], "Request Software Access", "Giữ; nhận thêm thao tác rút yêu cầu (UC12 cũ)"),
    "UC12": ("merge", ["UC11"], "Withdraw Access Request",
             "Rút là thao tác của người gửi trên chính Request của mình — cùng đối tượng, cùng quyền, không phải mục tiêu riêng"),
    "UC13": ("keep", ["UC13"], "Return Software Access", "Giữ"),
    "UC14": ("keep", ["UC14"], "Review Access Need", "Giữ"),
    "UC15": ("keep", ["UC15"], "Assess New SaaS", "Giữ"),
    "UC16": ("keep", ["UC16"], "Decide Spending Request", "Giữ; nay là UC con của UC55 (GU01)"),
    "UC17": ("keep", ["UC17"], "Request Budget Information",
             "Giữ; «extend» UC55 (EX04) thay ba extend EX01–EX03 lên UC16/UC30/UC43"),
    "UC18": ("merge", ["UC20"], "Respond to Budget Inquiry",
             "Trả lời hỏi ngân sách là một việc kiểm soát ngân sách của Finance (SoD-3), cùng actor và cùng dữ liệu"),
    "UC19": ("merge", ["UC20"], "Record Budget Commitment",
             "Ghi nhận khoản cam kết cùng mục tiêu kiểm soát ngân sách — theo dõi đã hứa chi"),
    "UC20": ("rename", ["UC20"], "Manage Budgets",
             "Mở rộng thành Control Budgets and Commitments sau khi gộp UC18, UC19; không dùng chữ Approve"),
    "UC21": ("keep", ["UC21"], "Provision Software Access", "Giữ"),
    "UC22": ("keep", ["UC22"], "Revoke Software Access", "Giữ; «extend» UC08 khi người nghỉ còn giữ seat (EX05)"),
    "UC23": ("rename", ["UC23", "UC32"], "Resolve Data Discrepancies",
             "Quá rộng (hai actor, hai loại chênh lệch): sai lệch với nhà cung cấp giữ ở UC23; chênh lệch hóa đơn về UC32"),
    "UC24": ("keep", ["UC24"], "Manage Usage Evidence", "Giữ; nhận thêm hàng đợi khớp danh tính (UC25 cũ)"),
    "UC25": ("merge", ["UC24"], "Resolve Identity Matches",
             "Khớp danh tính là bước làm sạch bằng chứng của cùng IT, cùng kết quả"),
    "UC26": ("keep", ["UC26"], "Operate Device Monitoring", "Giữ"),
    "UC27": ("keep", ["UC27"], "Acknowledge Device Monitoring", "Giữ"),
    "UC28": ("keep", ["UC28"], "Review License Recommendations", "Giữ; Manager quyết cuối (OI-02)"),
    "UC29": ("keep", ["UC29"], "Review Renewal Alerts", "Giữ; thêm Spending Approver (OI-09a)"),
    "UC30": ("keep", ["UC30"], "Decide Subscription Renewal", "Giữ; nay là UC con của UC55 (GU02)"),
    "UC31": ("merge", ["UC10"], "Record Subscription Changes",
             "Ghi kỳ mới là cập nhật vòng đời thuê bao của cùng IT sau UC30"),
    "UC32": ("keep", ["UC32"], "Reconcile Invoices",
             "Giữ; nhận chênh lệch hóa đơn từ UC23 cũ; «include» UC54 (IN03)"),
    "UC33": ("rename", ["UC33"], "Allocate Shared Costs",
             "Mở rộng thành Manage Cost Centers and Allocations — Finance quản lý danh mục Cost Center (OI-04)"),
    "UC34": ("subflow", ["UC10", "UC32", "UC55"], "Review Contract Evidence",
             "Đọc tệp gốc là bước trong công việc khác: IT (UC10), Finance (UC32), Spending Approver (UC55, OI-08a)"),
    "UC35": ("merge", ["UC56"], "Review Spending", "Một nhóm báo cáo của UC56; phạm vi theo vai giữ trong đặc tả"),
    "UC36": ("keep", ["UC36"], "Forecast Costs", "Giữ (L1, L3)"),
    "UC37": ("merge", ["UC56"], "Review Savings", "Một nhóm báo cáo của UC56"),
    "UC38": ("merge", ["UC56"], "Review Usage Performance", "Một nhóm báo cáo của UC56"),
    "UC39": ("merge", ["UC56"], "Review Process Performance", "Một nhóm báo cáo của UC56"),
    "UC40": ("merge", ["UC56"], "Review Data Quality", "Một nhóm báo cáo của UC56"),
    "UC41": ("split", ["UC54", "UC42"], "Import Discovery Evidence",
             "Trộn hai mục tiêu: nạp file (UC54, IT/Finance) và khớp nhà cung cấp/tạo finding (UC42)"),
    "UC42": ("keep", ["UC42"], "Investigate Shadow IT", "Giữ; IT xác nhận khớp tin cậy thấp trước khi chuyển quyết"),
    "UC43": ("keep", ["UC43"], "Decide SaaS Legitimization",
             "Giữ; nay là UC con của UC55 (GU03); bỏ association hỗ trợ của IT — đánh giá thuộc UC42, thực thi thuộc UC09/UC21/UC22"),
    "UC44": ("rename", ["UC44"], "View Personal Access and Data",
             "Mở rộng thành Exercise Personal Data Rights sau khi gộp UC45, UC46 và thêm yêu cầu chỉnh sửa (OI-13)"),
    "UC45": ("merge", ["UC44"], "Request Personal Data Export", "Một loại yêu cầu quyền dữ liệu của cùng nhân viên"),
    "UC46": ("merge", ["UC44"], "Request Monitoring Stop", "Một loại yêu cầu quyền dữ liệu của cùng nhân viên"),
    "UC47": ("keep", ["UC47"], "Process Data Subject Requests", "Giữ; SLA và quy tắc xử lý OI-01a/b/c, OI-13b"),
    "UC48": ("keep", ["UC48"], "Notify Employees of Monitoring", "Giữ"),
    "UC49": ("deferred", ["UC49"], "Change Subscription Plan", "Giữ mã, vẫn deferred (F-16 chỉ thiết kế)"),
    "UC50": ("deferred", ["UC50"], "Conduct Periodic Access Review", "Giữ mã, vẫn deferred (F-24, WF-14)"),
    "UC51": ("deferred", ["UC51"], "Monitor Desktop Usage", "Giữ mã, vẫn deferred (QĐ-20)"),
    "UC52": ("deferred", ["UC52"], "Forecast Variable Costs", "Giữ mã, vẫn deferred (L2, QĐ-25)"),
    "UC53": ("deferred", ["UC53"], "Consult AI Assistant", "Giữ mã, vẫn deferred (lớp AI tùy chọn)"),
}
# Use cases that did not exist in the former model (new codes, never reused).
NEW_USE_CASES = {
    "UC54": "Tách từ UC41 và từ khung import lặp lại ở UC06/UC24/UC32 (BRD 5.7, FR-7.1)",
    "UC55": "UC trừu tượng gom hành vi quyết định chung của UC16, UC30, UC43 (FR-3.13, FR-3.14, FR-3.4c-1)",
    "UC56": "Gộp năm nhóm báo cáo UC35, UC37–UC40 (BRD 5.5.3, QĐ-24)",
    "UC59": "Mục tiêu tự phục vụ về tài khoản của người dùng: kích hoạt, quên/đặt lại/đổi mật khẩu, hồ sơ (US-01-10; QĐ-46, QĐ-47c)",
    "UC60": "Chuyển giao vai Super Admin trong ứng dụng (US-01-09; QĐ-44c) — tách khỏi UC02 vì là thao tác duy nhất đổi người giữ vai",
}
OLD_RELATIONS_TO_NEW = {
    "IN01": "EX05 (UC08 «include» UC22 re-modelled as UC22 «extend» UC08: offboarding without any held seat is complete)",
    "EX01": "EX04 (UC17 now extends the general UC55; UC16 inherits the extension point)",
    "EX02": "EX04 (inherited by UC30 through GU02)",
    "EX03": "EX04 (inherited by UC43 through GU03)",
}

# Decisions taken by the Owner in the 24-25/09/2026 sessions (not mentor/GVHD confirmations).
SESSION_DECISIONS = {
    "OI-01": "IT Admin processes data subject requests (UC47)",
    "OI-02": "Manager decides Keep/Reclaim/Exempt last; IT may return once (UC28)",
    "OI-03": "Finance declares shared-cost allocation (UC33)",
    "OI-EMAIL": "Email Service Provider only on UC29 and UC48",
}


def uc_label(uc):
    return (USE_CASES.get(uc) or DEFERRED_USE_CASES[uc])["name"]


def association_id(actor, uc):
    return f"AS-{actor}-{uc}"


def actors_of(uc):
    return [a for a, u, _ in ASSOCIATIONS if u == uc]


def ucs_of(actor):
    return [u for a, u, _ in ASSOCIATIONS if a == actor]


def all_relationship_ids():
    return ([g["id"] for g in ACTOR_GENERALIZATIONS + UC_GENERALIZATIONS]
            + [r["id"] for r in INCLUDES + EXTENDS])
