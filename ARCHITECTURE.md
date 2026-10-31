# Kiến Trúc Ứng Dụng Web SaaS-Sentry (Web Architecture)

Trạng thái: Nền tảng được phê duyệt, cập nhật chuẩn hoá tháng 10/2026.

## 1. Bối cảnh & Phạm vi dự án (Context & Scope)

### Khởi tạo SPA và khôi phục phiên (30/10/2026)

- Route dashboard dùng `DashboardEntry` với dynamic import bên trong `RoleGuard`. Chỉ tải workspace sau khi xác thực và kiểm tra role thành công; khách và người sai quyền không tải toàn bộ màn hình dashboard để chờ redirect/403.
- Axios dùng timeout mặc định 15 giây cho mỗi request; request đặc thù có thể cấu hình timeout riêng. Query `/me` của luồng login/khôi phục phiên không tự retry và dùng `networkMode: 'always'` để không bị pause vô hạn khi browser offline: lỗi mạng chuyển sang trạng thái `unavailable`, giữ refresh token và cho người dùng thử lại qua giao diện hiện có.
- Dev pre-bundle khai báo cả `axios` và `sonner` để tránh Vite phát hiện muộn hai dependency này, tối ưu lại và reload giữa lúc khởi tạo. Cache dependency vẫn do Vite quản lý.
- Tailwind giới hạn tự động dò class trong `app/` bằng `source('./')` ở `app/app.css`; không quét tài liệu, skill và cache ở root. Component UI mới phải nằm trong `app/`; nếu dùng UI từ package ngoài thì khai báo `@source` cụ thể.

### Hạ tầng thông báo và giao diện đăng nhập (30/10/2026)

- **Sonner 2** cung cấp toast chung. `app/shared/ui/app-toaster.tsx` sở hữu theme, i18n, Lucide icons, nút đóng và thời gian tự ẩn; `AppProviders` gắn đúng một Toaster để giữ thông báo khi đổi route. Feature gọi `toast` từ callback mutation; HTTP interceptor không phát thông báo UX.
- Login giữ API auth-session, TanStack Query, redirect kiểm tra role và Retry-After. `login-page.tsx` chứa form bên trái; `components/login-showcase.tsx` và `login.css` sở hữu bố cục kính mờ và minh họa mascot bên phải. Ảnh nằm trong `app/assets/auth`, được import và Vite đóng gói cùng client để deploy không phụ thuộc URL ngoài. Light/dark dùng theme tokens; mobile ưu tiên form. Không có liên kết home, đăng nhập bên thứ ba hoặc đăng ký tự do; tài khoản do quản trị viên cấp. Dùng Motion hiện có, hỗ trợ reduced motion, không thêm framework UI khác.
- Kết quả thao tác login, forgot/reset/activate/change password và lỗi logout đi qua toast; validation tại input và page state có retry/điều hướng vẫn nằm trong trang. Quy tắc bắt buộc cho mọi code mới nằm trong `AGENTS.md` và `UI_UX_DESIGN_GUIDELINES.md`.

SaaS-Sentry là hệ thống quản trị dành cho doanh nghiệp nhằm quản lý danh mục phần mềm SaaS, hợp đồng bản quyền, quản lý ghế cấp phát (license seats), quy trình phê duyệt chi phí CNTT, tối ưu hoá lãng phí bản quyền (Ghost Seats), báo cáo tài chính và kiểm soát rủi ro Shadow IT.
Tài liệu yêu cầu nghiệp vụ (BRD) xác định ứng dụng web thích ứng (Responsive Web Application) là trọng tâm của giai đoạn MVP.

Frontend được xây dựng theo mô hình **Modular Monolithic Frontend** tích hợp trong một ứng dụng duy nhất sử dụng React Router 7 (Framework Mode, SPA client-side rendering). Kiến trúc này giúp tối ưu hoá năng suất của đội ngũ, không bị phức tạp hoá quá mức bởi micro-frontends hay các lớp trừu tượng dư thừa, đồng thời đảm bảo tính tổ chức chặt chẽ, sạch sẽ (Clean Architecture) và khả năng mở rộng lâu dài.

## 2. Mô hình Thực thi Runtime (Runtime View)

```text
Trình duyệt (Browser)
  -> Ứng dụng SPA React Router 7
      -> Route Controller mỏng (app/routes/*)
          -> Bộ bảo vệ phân quyền (RoleGuard - RBAC Guard)
              -> Tính năng giao diện / Workflow nghiệp vụ (app/features/*)
                  -> Generated TanStack Query Hook (Orval client)
                      -> Shared Axios mutator and interceptors
                          -> REST API request (/api/*)
                              -> NestJS Backend API (Xác thực, nghiệp vụ, lưu trữ)
```

- **Trình duyệt (Frontend)**: Chịu trách nhiệm hiển thị giao diện, điều hướng, quản lý trạng thái tương tác tạm thời (ephemeral UI state), kiểm tra phân quyền cục bộ và định dạng hiển thị.
- **NestJS (Backend)**: Đảm nhiệm tính đúng đắn của dữ liệu, xác thực phiên làm việc, kiểm tra quyền hạn thực tế (authorization), chuyển đổi trạng thái nghiệp vụ, ghi nhận audit trail, đồng bộ cơ sở dữ liệu và mọi quyết định liên quan đến chi phí, tiền bạc hoặc cấp quyền sử dụng phần mềm.

## 3. Kiến trúc Điều hướng & Bảo mật Phân quyền (Routing Architecture & RBAC)

Toàn bộ hệ thống Route được định nghĩa tập trung tại [app/routes.ts](file:///c:/fe_capstone/FE-dev-main/app/routes.ts) và triển khai thành các Route Controller độc lập tại [app/routes/](file:///c:/fe_capstone/FE-dev-main/app/routes), được bảo vệ bởi cơ chế kiểm soát truy cập dựa trên vai trò (Role-Based Access Control - RBAC).

```text
app/routes/
├── home.tsx                            # Trang chủ Landing page (/)
├── login.tsx                           # Trang đăng nhập (/login)
├── logout.tsx                          # Kết thúc phiên qua BE (/logout)
├── forgot-password.tsx                 # Yêu cầu email khôi phục
├── reset-password.tsx                  # Đặt lại mật khẩu từ URL fragment
├── activate-account.tsx                # Kích hoạt từ lời mời
├── change-password.tsx                 # Đổi mật khẩu khi đã đăng nhập
├── forbidden.tsx                       # Màn hình từ chối truy cập 403 Forbidden (/forbidden)
│
├── dashboard.super-admin.tsx           # Route quản trị cấp cao Super Admin (/dashboard/super-admin)
├── dashboard.it-admin.tsx              # Route quản trị kỹ thuật IT Admin (/dashboard/it-admin)
├── dashboard.manager.tsx               # Route quản lý phòng ban Manager (/dashboard/manager)
├── dashboard.finance.tsx               # Route tài chính kế toán Finance (/dashboard/finance)
├── dashboard.spending-approver.tsx     # Route cấp phê duyệt chi tiêu Spending Approver (/dashboard/spending-approver)
├── dashboard.employee.tsx              # Route nhân viên Employee (/dashboard/employee)
│
├── dashboard.tsx                       # Parameterized Fallback route (/dashboard/:role)
└── not-found.tsx                       # Route bắt lỗi 404 không tìm thấy trang (*)
```

### Nguyên tắc Bảo mật Phân quyền RBAC (Security Enforcement):

1. **Thin Route Controllers**: Mỗi file trong `app/routes/` chỉ đóng vai trò là Controller mỏng, nhận tham số URL, thiết lập metadata trang và bọc giao diện trong bộ bảo vệ `RoleGuard`.
2. **Bộ bảo vệ `RoleGuard` ([app/features/auth/components/role-guard.tsx](file:///c:/fe_capstone/FE-dev-main/app/features/auth/components/role-guard.tsx))**:
   - Mọi Route Dashboard của từng vai trò đều bắt buộc phải được bọc bởi `<RoleGuard requiredRole="...">`.
   - **Xác thực phiên (Authentication Check)**: Nếu người dùng chưa đăng nhập, tự động chuyển hướng ngay về `/login?redirectTo=...`.
   - **Phân quyền truy cập (Authorization Check)**: Nếu người dùng đang đăng nhập với vai trò A (ví dụ: `employee`) nhưng cố tình truy cập vào URL của vai trò B (ví dụ: `/dashboard/super-admin` hoặc `/dashboard/finance`):
     - **Hệ thống chặn truy cập ngay lập tức**: Tuyệt đối không khởi tạo hay render các component, hook dữ liệu hoặc bảng biểu bảo mật của vai trò bị cấm.
     - **Hiển thị màn hình 403 Forbidden**: Giải thích rõ quyền hạn bị giới hạn và cung cấp liên kết điều hướng an toàn trở lại Dashboard đúng vai trò của người dùng.

## 4. Kiến trúc Phân vùng Thư mục & Cắt dọc Nghiệp vụ (Vertical Slice Architecture)

Hệ thống áp dụng chuẩn quốc tế **Vertical Slice Architecture (VSA)** kết hợp **Feature-Driven Design (FDD)**.
Thư mục `app/features/` được phân tách thành 2 khối lớn: `auth/` (xác thực & phiên làm việc) và `dashboard/` (bàn làm việc của từng vai trò).

Trong mỗi vai trò (Role), thay vì gom toàn bộ file vào các thư mục ngang lớn gây quá tải và xung đột khi dự án mở rộng, toàn bộ mã nguồn được **chia cắt dọc theo từng Phân hệ / Chức năng Nghiệp vụ (Sub-feature / Domain Module)**:

```text
app/features/
├── auth/                               # Xác thực, phiên đăng nhập và khôi phục tài khoản
│   ├── auth-session.ts                 # Token pair trong localStorage, khôi phục bộ nhớ khi mở lại web
│   ├── enums.ts                        # Enums trạng thái auth, danh sách role
│   ├── auth-action-page.tsx             # Kích hoạt, khôi phục và đổi mật khẩu qua API
│   ├── components/                     # Bộ bảo vệ RoleGuard, form đăng nhập
│   └── views/                          # Giao diện LoginPage, ForbiddenPage (403)
│
└── dashboard/                          # Khung điều phối Dashboard & Workspace của 6 Roles
    ├── components/                     # Component vỏ khung (DashboardHeader, DashboardSidebar, DefaultView)
    ├── dashboard-page.tsx              # Component điều phối hiển thị trung tâm (<= 500 dòng)
    ├── dashboard-ui.tsx                # Primitives định dạng hiển thị dùng chung (tiền tệ, ngày tháng, badge)
    ├── dashboard-data.ts               # Hồ sơ vai trò (Role profiles) và dữ liệu điều hướng
    │
    ├── employee/                       # Role Nhân viên (Employee)
    │   ├── overview/                   # Chức năng: Dashboard tổng quan mức sử dụng phần mềm
    │   ├── software-request/           # Chức năng: Đăng ký phần mềm mới & dùng chung theo nhóm
    │   ├── my-software/                # Chức năng: Phần mềm đang dùng, xem license key, gia hạn, trả lại
    │   ├── my-requests/                # Chức năng: Theo dõi lịch sử & tiến độ các đơn yêu cầu
    │   ├── profile-privacy/            # Chức năng: Hồ sơ cá nhân & minh bạch thu thập dữ liệu
    │   ├── shared/                     # Components, hooks, preview notice dùng chung trong Employee
    │   ├── employee-data.ts            # Mock data, fixture và contracts của Employee
    │   ├── employee-nav.ts             # Cấu hình navigation và helper tabs của Employee
    │   ├── enums.ts                    # Enums và Tab Keys của Employee
    │   └── index.ts                    # Barrel export duy nhất của Employee ra bên ngoài
    │
    ├── super-admin/                    # Role Quản trị cấp cao (Super Admin)
    │   ├── overview/                   # Chức năng: Bảng chỉ số điều hành cấp cao toàn tổ chức
    │   ├── accounts/                   # Chức năng: Quản lý tài khoản người dùng & định danh máy tính (Workstation binding)
    │   ├── departments/                # Chức năng: Cơ cấu tổ chức phòng ban & chỉ số KPI
    │   ├── personnel/                  # Chức năng: Danh bạ nhân sự toàn công ty
    │   ├── reminders/                  # Chức năng: Cấu hình chính sách & nhắc nhở tự động
    │   ├── audit/                      # Chức năng: Nhật ký kiểm toán hệ thống (Audit Trail)
    │   ├── transfer/                   # Chức năng: Bàn giao và chuyển giao tài sản số
    │   ├── settings/                   # Chức năng: Cấu hình hệ thống chung
    │   ├── shared/                     # Hooks tabs dùng chung trong Super Admin
    │   ├── operations/                 # Chờ cấu hình, bước tắc nghẽn và ghi sự cố
    │   ├── super-admin-screen.tsx      # Điều phối các màn hình API thật
    │   ├── super-admin-nav.ts          # Cấu hình navigation và helper tabs của Super Admin
    │   ├── <slice>/enums/              # Mỗi khái niệm một file, lấy mã từ generated contract
    │   └── index.ts                    # Barrel export duy nhất của Super Admin ra bên ngoài
    │
    ├── manager/                        # Role Quản lý bộ phận (Manager)
    │   ├── overview/                   # Chức năng: Thống kê tổng quan phòng ban
    │   ├── team-requests/              # Chức năng: Xét duyệt & tổng hợp đơn của nhân viên (weekly batch)
    │   ├── team/                       # Chức năng: Danh sách nhân sự & phần mềm cấp cho nhóm
    │   ├── access-review/              # Chức năng: Đợt tái chứng nhận quyền truy cập định kỳ
    │   ├── ghost-seats/                # Chức năng: Rà soát tài khoản lãng phí không hoạt động (Ghost Seats)
    │   ├── annual-budget/              # Chức năng: Đề xuất ngân sách năm của bộ phận
    │   ├── shared/                     # Components dùng chung (confirm dialog, summary strip), hook tabs
    │   ├── manager-data.ts             # Mock data và contracts của Manager
    │   ├── manager-nav.ts              # Cấu hình navigation và helper tabs của Manager
    │   ├── enums.ts                    # Enums và Tab Keys của Manager
    │   └── index.ts                    # Barrel export duy nhất của Manager ra bên ngoài
    │
    ├── approvals/                      # Role Cấp phê duyệt chi tiêu (Spending Approver)
    │   ├── overview/                   # Chức năng: Tổng quan ngân sách & dòng phê duyệt
    │   ├── queue/                      # Chức năng: Hàng chờ phê duyệt chi tiêu phần mềm, gia hạn, tối ưu hóa
    │   ├── annual-budget/              # Chức năng: Thẩm định & phê duyệt đề xuất ngân sách năm các phòng ban
    │   ├── exceptions/                 # Chức năng: Phê duyệt ngoại lệ vượt ngân sách & điều chỉnh
    │   ├── decisions/                  # Chức năng: Lịch sử và sổ quyết định phê duyệt theo Cost Center
    │   ├── shared/                     # Panel kiểm tra ngân sách, hook tabs
    │   ├── approval-data.ts            # Mock data và contracts của Approvals
    │   ├── approvals-nav.ts            # Cấu hình navigation và helper tabs của Approvals
    │   ├── enums.ts                    # Enums và Tab Keys của Approvals
    │   └── index.ts                    # Barrel export duy nhất của Approvals ra bên ngoài
    │
    ├── it-admin/                       # Role Quản trị kỹ thuật (IT Admin)
    │   ├── overview/                   # Chức năng: Trung tâm điều hành IT tổng quan
    │   ├── provisioning/               # Chức năng: Cấp phát, kích hoạt & thu hồi bản quyền
    │   ├── device-collectors/          # Chức năng: Thu thập telemetry máy tính & định danh thiết bị
    │   ├── dept-catalog/               # Chức năng: Quản lý danh mục phần mềm tiêu chuẩn phòng ban
    │   ├── optimization/               # Chức năng: Tối ưu hoá giấy phép & hạ cấp gói nhàn rỗi
    │   ├── shadow-it/                  # Chức năng: Giám sát phần mềm ngoài luồng không được phê duyệt
    │   ├── reconciliation/             # Chức năng: Đối soát số liệu bản quyền với hóa đơn mua hàng
    │   ├── identities/                 # Chức năng: Khớp nối danh tính chưa được định danh (Unmatched Identities)
    │   ├── renewals/                   # Chức năng: Đề xuất gia hạn bản quyền công nghệ
    │   ├── offboarding/                # Chức năng: Thu hồi tài khoản và bản quyền khi nhân sự nghỉ việc
    │   ├── usage-import/               # Chức năng: Nhập lịch sử sử dụng phần mềm từ file ngoài
    │   ├── shared/                     # Hook quản lý tabs dùng chung trong IT Admin
    │   ├── it-admin-data.ts            # Mock data và contracts của IT Admin
    │   ├── it-admin-nav.ts             # Cấu hình navigation và helper tabs của IT Admin
    │   ├── enums.ts                    # Enums và Tab Keys của IT Admin
    │   └── index.ts                    # Barrel export duy nhất của IT Admin ra bên ngoài
    │
    └── finance/                        # Role Tài chính (Finance)
        ├── overview/                   # Chức năng: Báo cáo tài chính SaaS tổng quan & tỷ lệ giải ngân
        ├── annual-budget/              # Chức năng: Kế hoạch ngân sách năm, thương lượng & tổng hợp
        ├── budget-allocation/          # Chức năng: Phân bổ ngân sách theo phòng ban & Cost Center
        ├── budget-questions/           # Chức năng: Thẩm định giải trình thắc mắc & ngoại lệ ngân sách
        ├── commitments/                # Chức năng: Quản lý cam kết chi tiêu & hóa đơn công nợ
        ├── budget-check/               # Chức năng: Kiểm tra khả dụng ngân sách & cảnh báo vượt mức
        ├── period-close/               # Chức năng: Khóa sổ kỳ kế toán & phát hành báo cáo
        ├── cost-optimization/          # Chức năng: Phân tích dự báo chi phí SaaS & cơ hội tiết kiệm
        ├── spend-import/               # Chức năng: Nhập dữ liệu sao kê chi tiêu thực tế
        ├── decisions/                  # Chức năng: Nhật ký lịch sử các quyết định tài chính
        ├── shared/                     # Components dùng chung (filter panel, period filter, charts), hooks
        ├── finance-data.ts             # Mock data và contracts của Finance
        ├── finance-nav.ts              # Cấu hình navigation và helper tabs của Finance
        ├── enums.ts                    # Enums và Tab Keys của Finance
        └── index.ts                    # Barrel export duy nhất của Finance ra bên ngoài
```

### 4.1 Quy chuẩn Sử dụng Barrel Export (`index.ts`) & Decoupling Standard

Để duy trì tính toàn vẹn kiến trúc và ngăn ngừa khớp nối lỏng lẻo (tight coupling), toàn bộ codebase tuân thủ 4 nguyên tắc barrel export sau:

1. **Phân tách trách nhiệm Consumer (Consumer Decoupling)**:
   - Các consumer cấp cao như [dashboard-page.tsx](file:///c:/fe_capstone/FE-dev-main/app/features/dashboard/dashboard-page.tsx), [dashboard-sidebar.tsx](file:///c:/fe_capstone/FE-dev-main/app/features/dashboard/components/dashboard-sidebar.tsx) và các Route Controller tại `app/routes/` **chỉ được phép import từ file barrel index gốc của Role** (`./employee`, `./super-admin`, `./manager`, `./approvals`, `./it-admin`, `./finance`).
   - Tuyệt đối cấm import sâu vào đường dẫn con của từng sub-feature (ví dụ: `import { ManagerTeamRequestsView } from './manager/team-requests/views/...'` là **VI PHẠM**).
   - **ĐÚNG**:
     ```ts
     import { EmployeeOverviewView, EmployeeSoftwareRequestView } from './employee'
     import { ManagerOverviewView, ManagerTeamRequestsView } from './manager'
     import { FinanceScreen, isValidFinanceTab } from './finance'
     ```

2. **Ranh giới Độc lập giữa các Sub-features (Sub-feature Isolation)**:
   - Sub-feature A **tuyệt đối không được import trực tiếp** từ thư mục con của Sub-feature B trong cùng role.
   - Nếu 2 sub-features cần dùng chung một dialog, modal, table, helper hay hook, thành phần đó **bắt buộc phải được chuyển vào thư mục `<role>/shared/`**.
   - Nếu một thành phần được sử dụng bởi 2 roles khác nhau, thành phần đó phải được đưa lên tầng `app/entities/` (nếu liên quan đến thực thể nghiệp vụ) hoặc `app/shared/` (nếu là UI primitive / utility).

3. **Ngăn chặn Xung đột Export (TS2308 Collision Prevention)**:
   - Khi một enum hoặc type đã được export từ file dữ liệu (`<role>-data.ts`) hoặc điều hướng (`<role>-nav.ts`), trong file `index.ts` **không được sử dụng cú pháp mù quáng `export * from './enums'`**.
   - Phải khai báo tường minh từng export duy nhất (named exports) để TypeScript nhận diện chính xác và không báo lỗi trùng lặp biểu tượng (TS2308).

4. **Quy tắc Phạm vi Runtime Cục bộ (Runtime Local Scope Invariant)**:
   - Cú pháp `export { X } from './enums'` trong TypeScript chỉ tái xuất khẩu giao diện module nhưng **không đưa biến `X` vào phạm vi runtime cục bộ** của file đó.
   - Do đó, nếu trong file có hàm logic (ví dụ `isValidTab(val)`) cần tham chiếu trực tiếp đến mảng `TAB_KEYS`, file bắt buộc phải viết:
     ```ts
     import { TAB_KEYS, type TabKey } from './enums'
     export { TAB_KEYS, type TabKey }
     ```

### 4.2 Các Nguyên Tắc Kiến Trúc Bắt Buộc (Strict Architectural Invariants)

1. **Tính Đóng gói Độc lập (High Cohesion & Low Coupling)**:
   - Toàn bộ giao diện (`views/`), thành phần con (`components/`), hook xử lý (`hooks/`) và định nghĩa kiểu dữ liệu (`enums.ts`) của chức năng nào phải nằm trọn vẹn trong chức năng đó.
2. **Phân cấp Trang Cha (Views) và Component Con (Components)**:
   - `views/`: Chỉ chứa trang cha cấp cao nhất đại diện cho Route/Tab, quản lý URL query params và layout tổng thể. Giới hạn tối đa <= 400 dòng code.
   - `components/`: Chứa các component con độc lập (Modals, Dialogs, Tables, Cards) với kích thước nhỏ gọn <= 300 dòng code.
3. **Cô lập State & Workflow vào Custom Hooks (`hooks/`)**:
   - Tách toàn bộ state, form validation, filter logic và TanStack Query hooks ra khỏi JSX để đảm bảo component giao diện luôn thanh thoát, dễ đọc và dễ test.
4. **Khai báo Enum Tập Trung (`enums.ts`)**:
   - Định nghĩa rõ ràng cho Tab Keys, Workflow Statuses, Filter Values, loại bỏ hoàn toàn magic strings trong toàn bộ logic điều kiện.
5. **Giới Hạn Cứng Kích Thước File (Strict <= 500 dòng/file)**:
   - Mọi file `.tsx` hoặc `.ts` bắt buộc phải dưới 500 dòng code. Khi đạt ngưỡng ~400–450 dòng, phải lập tức phân rã thành component con hoặc custom hook.
6. **Quy chuẩn Đa ngôn ngữ (Strict Zero-Hardcoded-Text)**:
   - 100% văn bản hiển thị trên giao diện phải thông qua `useTranslation()`. Cấm tuyệt đối hardcode chuỗi text trong JSX. Khai báo đồng thời ở cả `vi` và `en`.
7. **Bảo mật Phân quyền Đa tầng (RBAC Route Guard & Backend Authority)**:
   - Mọi route dashboard phải bọc trong `<RoleGuard requiredRole="...">`. Cố tình truy cập sai vai trò sẽ bị chặn ngay lập tức và hiển thị 403 Forbidden. Phân quyền cuối cùng luôn do NestJS backend thẩm định.

## Key decisions

### Manager tích hợp API (31/10/2026)

Màn gửi lô yêu cầu có nhãn **Gửi đề nghị chi** (EN: **Submit spending requests**) trên menu/header; trạng thái chờ gửi và timeline Employee dùng cùng thuật ngữ. Tab `weekly-batch`, enum và operation không đổi. Nhãn phân biệt nhiệm vụ gửi của Manager với phê duyệt chi của Spending Approver và đề xuất ngân sách năm đi Finance.

`ManagerScreen` thay nhánh preview trong dashboard. Public barrel chỉ export bộ điều phối, chuông thông báo và điều hướng; shell không giữ fixture, mảng đánh dấu/gửi hoặc ID do FE tạo. Các slice live dùng Orval/shared Axios và TanStack Query; form/dialog giữ draft, URL giữ phân trang/ID. Enum theo slice lấy từ generated; Request state từ entities. `useManagerAction` sở hữu phản hồi mutation, invalidation, chống click lặp, lỗi field/429 và khóa gửi lại khi chưa biết kết quả. Chỉ điều hướng sau BE xác nhận và khi component còn mount.

Giữ app shell và theme Manager, thay nội dung không có dữ liệu BE. Ngân sách có route form riêng cho lập/gửi lại đề xuất, qua RoleGuard; dòng kế hoạch bắt buộc có cửa sổ mua/kỳ dịch vụ/chu kỳ lặp theo luật nghiệp vụ, tiền giữ chuỗi. Không tải số ngân sách còn lại. Dialog chung bổ sung tùy chọn sheet/drawer để form Manager đáp ứng mobile. Ma trận API, giới hạn và kiểm chứng ở `docs/manager-api-integration.md`.

Giao diện Manager dùng chung header, section, empty state và bảng responsive trong `manager/shared/components`, theo phân cấp nội dung của Super Admin. Bảng chỉ có một cây DOM, hiển thị dạng hàng có nhãn trên mobile. Tổng quan đọc `pagination.totalItems` của spend queue, review `OPEN` và handover `OPEN` thuộc `mine`; lỗi tải không biến thành số 0. Không dựng biểu đồ usage/chi phí thiếu nguồn. BM-09 nằm tại Nhân sự phòng ban (`tab=my-team&section=changes`), không có mục thông báo nhân sự riêng. Chuông mở drawer qua `notifications=open`, giữ tab/phân trang bên dưới; paging và bộ lọc của drawer là state cục bộ. URL cũ `personnel-notices`/`notifications` chuyển sang ngữ cảnh mới. Chi tiết đề xuất ngân sách mở drawer; Escape trong xác nhận con chỉ đóng xác nhận đó.

Màn Duyệt nhu cầu dùng ô tìm UUID phía trên bảng, bỏ khối quy trình. Owner chọn giữ khung hàng đợi có thông báo thiếu API NEED và khóa phân trang cho đến khi BE bổ sung; kết quả tra cứu thật không được coi là hàng đợi. Nhân sự/công cụ mặc định phân trang BE; do hai API chưa hỗ trợ search, tìm kiếm đọc đủ trang qua Orval/TanStack Query trước khi lọc và phân trang kết quả, không công bố kết quả thiếu khi một trang lỗi. Search/page/context nằm trong URL; tìm mới hoặc xóa tìm kiếm đưa về trang đầu.

Tạo yêu cầu nhóm/gửi hộ dùng `ManagerChoiceSelect`: dropdown có tìm kiếm, bàn phím/Escape/focus, tên/email và lựa chọn lưu qua phân trang. `ManagerPeoplePicker` đọc `groupRequestCandidateList` theo phạm vi BE (còn làm việc, có email công việc); không nhập UUID hay dùng directory khác. Nhóm chọn tối đa 10, gửi hộ cá nhân chọn một người; confirmation hiển thị tên/gói, payload chỉ lấy ID của lựa chọn. Owner giữ dropdown gói chờ API danh mục (`API-GAP-02`), không dùng công cụ đang cấp làm danh mục. Liên kết IT có `planId` hợp lệ và nhãn gói có thể cung cấp một lựa chọn; BE kiểm lại lúc check/gửi. Không tạo danh mục fixture hoặc gọi `/plans` của IT/Finance.

`/me` không trả ID phòng và roster không trả ID nhân viên; không gọi directory Super Admin để bù, dùng ID chính thức/picker nhóm được phép. Usage/ghost seats/rà soát định kỳ/AI/export sử dụng/upload chứng từ ngân sách cho Manager chưa có API. Import `/budget-versions/{id}/imports` thuộc Finance; đề xuất Manager vẫn nhận JSON, không có ngày bắt đầu chu kỳ hoặc file. Bằng chứng và yêu cầu BE ở `docs/manager-list-budget-api-audit.md`. Các đoạn **Manager preview** trong tài liệu này chỉ ghi lịch sử thiết kế, đã bị thay trong runtime bởi quyết định này; không coi chúng là trạng thái chức năng hiện hành.

### Employee tích hợp API (31/10/2026)

`EmployeeScreen` thay bộ điều kiện preview trong dashboard; public API của role chỉ export bộ điều phối, chuông thông báo và điều hướng. Các slice tạo đơn, bản nháp/theo dõi, gia hạn/hoàn trả, báo lỗi SaaS, thông báo, bàn giao và hồ sơ dùng client Orval và shared Axios. Giữ source preview cũ cô lập khỏi public barrel để không đưa fixture vào luồng sản phẩm. Ma trận endpoint và giới hạn contract: `docs/employee-api-integration.md`.

Giao diện Employee dùng `WorkspacePageHeader`, `WorkspaceSection`, `WorkspaceEmptyState` và `WorkspaceDataTable` tại `app/shared/ui/`, cùng các wrapper giữ namespace riêng của Employee/Manager. Không import nội bộ giữa hai role. CSS bảng responsive nằm cùng primitive; chỉ một cây DOM cho bảng desktop và hàng có nhãn trên mobile. Tổng quan hiển thị danh tính thật, tổng số bản nháp/bàn giao từ `pagination.totalItems` và tối đa bốn việc bàn giao `OPEN` thuộc `mine`; lỗi không thay bằng số 0, self-service không mount dữ liệu bản nháp. Các trang quyền sử dụng, bản nháp, sự cố, bàn giao có trạng thái rỗng theo nghiệp vụ. Chi tiết yêu cầu tách thông tin khỏi timeline; chi tiết sự cố tách tóm tắt khỏi trao đổi. Form giữ kiểm tra xem trước và draft hiện có; các xác nhận dùng bottom sheet trên mobile.

Thông báo Employee chỉ mở qua chuông trên header: mỗi lần nhấn lấy một thông báo chưa đọc, ghi nhận đã đọc qua API và hiển thị một toast Sonner dùng ID ổn định. Không có trang/tab, mục sidebar hoặc lối tắt tổng quan cho thông báo; URL cũ `tab=notifications` về tổng quan.

Tạo đơn cá nhân/nhóm bắt buộc xem trước hoặc kiểm tra từ BE; chỉnh form hủy hiệu lực lần kiểm tra trước. Đơn nhóm chọn nhân viên cùng phòng qua picker phân trang, gửi employeeId và ngày kết thúc từng người, không giữ email trong URL. Mã đơn trả về dùng để mở chi tiết ngay. Bản nháp gửi body rỗng và xác nhận thao tác. Query giữ paging trong URL; server state không chép sang local state. Kết quả ghi không rõ không được tự gửi lại; lỗi 422 liên kết với field, 429 có countdown và 403 đồng bộ `/me`.

Không có catalog và danh sách toàn bộ request/assignment dành cho Employee ở contract đối chiếu: màn hình giải thích giới hạn, nhận mã gói từ IT, mở đơn theo ID và hiển thị nhắc hết hạn đúng phạm vi. Không gọi endpoint IT Admin/Finance để bù phần thiếu. Usage, license key, avatar upload và xuất dữ liệu cá nhân không được mô phỏng thành dữ liệu thật. Phiên `selfServiceOnly` chỉ mở tổng quan hạn chế, thông báo, bàn giao và hồ sơ.

Các mã nghiệp vụ re-export từ generated vào `enums/` của từng slice; Request state chung nằm ở `entities/request/enums`. Fallback status không cấp quyền thao tác. Money dùng chuỗi thập phân và BigInt khi định dạng. Các test MSW xác nhận payload strict, paging, pending, lỗi, cache, enum lạ và ranh giới self-service; kiểm tra với tài khoản BE thật vẫn là bước xác minh riêng.

### Super Admin tích hợp API (30/10/2026)

Super Admin sử dụng các slice tài khoản/trách nhiệm, phòng ban/dự án, nhân sự/import/sự kiện, tổng quan checklist/watch, tham số vận hành, lịch nghỉ/tiền tệ, giám sát quy trình và Audit Trail. `SuperAdminScreen` điều phối qua tab của shell. Các hook Orval gọi shared Axios; server state ở Query, form/dialog ở state cục bộ. Đã xóa fixture runtime, enum demo, translation demo và các màn định danh máy hoặc mô phỏng gửi email không có API. Dữ liệu mẫu của IT Admin và role khác vẫn thuộc phạm vi preview riêng.

Tổng quan gồm khối tiến độ tương phản, thẻ số liệu, cảnh báo gom theo phòng và sơ đồ checklist mở rộng được. Tiến độ chỉ tính các bước có trạng thái đã biết và đang được BE hỗ trợ, loại `NOT_AVAILABLE`; không dựng số liệu biểu đồ lịch sử. Cảnh báo mở đúng chi tiết phòng bằng mã từ API; query tra cứu mã duyệt các trang kết quả đã lọc đến khi khớp chính xác. URL giữ lựa chọn phòng, tìm kiếm, trạng thái và trang để browser Back khôi phục đúng ngữ cảnh. Liên kết import mang `section`/`importId`; nhiệm vụ trung tâm chi phí ghi rõ thuộc Finance. Search có placeholder VI/EN riêng, không dùng placeholder làm giá trị nhập.

Form tạo/sửa hồ sơ nhân viên dùng sub-route `/dashboard/super-admin/personnel/new|correct` qua route controller mỏng và RoleGuard. Shell giữ vùng main cuộn; form dài có hai cột và phần căn cứ nhân sự, không bị nhét vào drawer. Nút điều hướng sidebar trở về URL dashboard theo tab để tránh giữ chế độ form khi đổi phân hệ.

Tài khoản gắn với hồ sơ nhân viên; status và activationState độc lập. FE chỉ cấp/thu hồi các vai trực tiếp cho phép trong request enum; trưởng phòng và trách nhiệm phê duyệt tạo ra các vai suy ra. Chuyển giao Super Admin dùng operation riêng và đọc lại `/me`; `auth-session` theo dõi query thành công để cập nhật quyền dùng bởi RoleGuard. 403 đọc lại `/me`, không refresh token do lỗi phân quyền.

Form, trạng thái query, phân trang và picker được chia sẻ trong `super-admin/shared/`; nhân sự và điều chuyển không import nội bộ lẫn nhau. API không cung cấp GET toàn bộ nhân viên: picker dùng app-user phân trang hoặc account-candidates theo search; danh sách thành viên dùng API từng phòng. Các write invalidate nguồn đọc liên quan, không thay mảng local như đã lưu. Import hai bước giữ idempotency key cho cùng payload/preview khi thử lại. Test MSW kiểm payload, phân trang, lỗi, pending, enum lạ và replay import; fixture test không đi vào bundle sản phẩm.

### Không gian Employee

Xem quyết định tích hợp Employee bên dưới và `docs/employee-api-integration.md`. Các module preview cũ không còn thuộc public API của role.

### Manager request preview

The Manager Team Requests preview uses the same individual/shared form labels in
place of its estimated-cost list column. Two sample Manager requests are shared;
their detail resolves registered colleagues by ID from the existing Manager team
roster and shows the requester as representative. This is illustrative display
data and does not submit or provision access for those colleagues.

Manager request approval marks an illustrative employee request and opens the
`weekly-batch` route, presented as Marked Requests. This page lists all unsent
marked requests directly and offers one action for the full list, with no weekly
schedule or intermediate form. The action records a sent-preview state in the
dashboard session and removes those items from the pending list. No request is
actually transmitted to the CEO: backend submission, authorization, and
persistence require an authoritative API contract. Session state is lost on reload.

### Manager request creation preview

The dashboard Manager shell exposes one annual budget proposal tab for the
department. The Manager selects an exact budget period start date,
then selects supporting staff documents received outside the system. The document
section and proposal summary replace the former per-software needs form; the
summary shows the date and document count. The Manager does
not calculate or enter a budget:
Finance would price the proposal and add a contingency buffer, then a spending
approver would authorize the resulting department budget. The step display is
explanatory only. Submitting currently records a session-only preview state;
attachments are not uploaded and no proposal reaches Finance. Backend contracts
must own file storage, pricing, approvals, future request budget checks, and
authorization before this becomes an operational workflow. No other role UI is
changed by this tab.

In the dashboard Manager shell, the create-request sidebar item expands to team
and individual choices. Both open the existing `create-employee-request` preview
tab with `scope=team|individual` in the URL. Individual mode keeps the single
employee selector; team mode lets the manager choose multiple members from the
available sample list. Both modes collect a free-text desired license plan and
a usage date range using native date inputs. The end date must be on or after the
start date. The Manager sidebar's `my-requests` tab shows previews explicitly
saved from either mode in the current dashboard session. These records are local
component state, are lost on reload, and are labeled as unsubmitted previews;
they are not authoritative requests. Neither mode creates or authorizes backend
requests. Other entry points without `scope` retain individual mode.

`/manager/create-request` renders the first employee-selection screen of the
Manager create-employee-request feature. The sidebar, My Team and Employee Detail
link to it; the `employee` search param selects a known team member, with an empty
value explicitly clearing selection and unknown IDs showing an error. The source's
initial employee maps to the existing first team member. Shared employee metadata
and assignment samples live in `entities/user/` and `entities/license/` so the
employee detail and request selection remain consistent despite conflicting designs.
Search is local presentation state; summary selection is URL state. No employee IDs
or assignments are invented for other team members. Only step one has a supplied
design, so Next and the later stages remain unavailable with an explanation. No
request is created, no remote cache is introduced, and backend authorization and
approval workflow responsibilities remain unchanged.

### Manager Ghost Seat Review preview

The dashboard Manager overview visualizes only the six available illustrative
software records. Its seat-allocation bars show assigned versus available seats,
and its cost ring shows each record's share of that six-record sample. The
independent summary figures describe eight applications and VND 54.8 million in
monthly spend, so the sample ring is explicitly labeled and is never presented
as a breakdown of the summary total. Pending requests and flagged seats retain
their navigation to review screens.

The dashboard Manager tab also has an illustrative usage review. It presents each
employee's assigned tool, recorded inactive days, and estimated monthly cost. The
Manager can inspect a record but cannot mark a seat as revoked or retained. Its
request-to-IT control stays unavailable until the backend provides a request
operation and authorization contract; the preview must not report that a request
was sent. Inactive days are a tool-usage signal, not a measure of employee work
performance. Internal waste-rule codes are not shown to Managers.

### Dashboard Manager access review preview

The dashboard access-review tab groups sample access records by employee. Expanding
an employee reveals the tools in the review. Its usage link opens that employee's
existing detail view, which shows sample active minutes for software plans and
credit consumption for AI agents. Every illustrative software assignment has an
explicit recent session start and end; these timestamps are not inferred from
aggregate minutes. AI agents show credits used against a daily or request
allocation, with Codex as a request-based sample. A local Excel export uses
separate minute, credit, and session-time columns for those assigned tools. The
detail places usage evidence before profile information, shows no monetary amounts,
offers the same export, and keeps the access-review navigation context through the
URL's `from` parameter. The Manager detail has no assign-software control and does
not directly revoke access or mark licenses as retained here. Revocation requests remain unavailable
until the backend publishes a request operation and authorization contract; the UI
does not claim a request was sent or access changed. Usage signals are not employee
productivity scores.

`/manager/ghost-seat-review` composes the private Manager ghost-seat-review feature
inside the shared warm orange Manager shell. Search, tier, recommendation,
application, critical view, sorting and pagination belong to
search params; row selection is local presentation state. The supplied design has
10 records but independent overview figures (24 seats, 18 pending, 6 critical,
USD 4,320 monthly savings). Its inactivity durations also conflict with the displayed
dates. The preview labels these limitations and preserves the supplied values
without deriving current policy decisions or inventing missing rows. Per-record
review status and historical snapshots were not provided, so the pending view and
date control remain disabled. View links open the selected record's detail route;
reclaim, keep and exemption decisions await backend contracts and authorization.
No API contract or existing access-control behavior is changed by this preview.

`/manager/ghost-seat-review/:id` renders the separate ghost-seat-detail feature.
Shared seat records, filter ordering and logos live in `entities/license/` because
both review and detail consume them. View links preserve list filters and pagination;
the detail's `panel` param selects its accessible tabs without overriding the list's
`tab` filter. Previous/next follows the filtered record order. Missing IDs render an
explicit not-found state. The Figma design supplies additional sample fields only;
all other records show their own core data and explicit missing detail states. Where
the designs disagree, the review row supplies identity, dates, duration and confidence.
The first timeline date follows that row; sample cost and evidence are not API facts.
REQ-1024 is an unverified relationship to a different employee, so no request link is
enabled. Notes are unsaved local drafts; backend review decisions and note persistence
remain unavailable.

### React Router Framework Mode as an SPA

`react-router.config.ts` sets `ssr: false`. Framework Mode remains valuable for
typed route modules, route discovery, code splitting, metadata, and loader/action
orchestration. SSR is not needed for the authenticated enterprise MVP, and a single
NestJS backend avoids splitting authorization and operational ownership across two
servers.

The SPA build is `build/client/`. Every static host must fall back unknown document
requests to `index.html`; `nginx.conf` contains this rule. `/api` must be routed to
NestJS by the deployment ingress/reverse proxy. Vite supplies the equivalent proxy
in local development.

### Feature-oriented source tree (Multi-Role Enterprise Architecture)

SaaS-Sentry serves multiple user roles with distinct business capabilities:

- **Employee**: Self-service portal (my software, license requests, renewals, return seat).
- **IT Admin**: SaaS catalog, license seat inventory & allocation, vendor contracts, Shadow IT discovery.
- **Manager / Approver**: Approval inbox, team license overview, department spend.
- **Finance**: SaaS cost analysis, optimization recommendations, budget tracking.

To keep the codebase maintainable as the number of screens grows, routes and features are grouped by role/portal, while cross-role domain logic is shared through `entities/`:

```text
app/
  root.tsx                 document shell and error boundary
  routes.ts                route manifest defining nested layouts per role
  routes/                  thin route modules grouped by role/portal
    auth/                  login, sso-callback, forbidden
    employee/              employee portal routes (layout, dashboard, software, requests...)
    admin/                 IT admin portal routes (layout, catalog, licenses, contracts...)
    manager/               manager portal routes (layout, approvals...)
    finance/               finance portal routes (layout, cost-analytics...)
  providers/               root-only framework providers
  features/                business capabilities grouped by role/portal
    employee/              employee portal features (layout, dashboard, my-software, requests...)
    admin/                 IT admin portal features (layout, catalog, licenses, contracts...)
    manager/               manager portal features (layout, approvals...)
    finance/               finance portal features (layout, cost-optimization...)
    shared/                cross-role features (auth, profile-settings, notifications)
  entities/                domain presentation logic and models shared across roles
    license/               LicenseStatusBadge, LicenseCard, license domain types
    software/              SoftwareLogo, SoftwarePlanBadge, software domain types
    request/               RequestStatusBadge, ApprovalTimeline, request domain types
    user/                  UserAvatar, UserRoleBadge, user domain types
  shared/
    api/
      generated/
        operations/<tag>/  one Axios request and TanStack Query hook per operation file
        model/<tag>/       request/response/domain types and Faker factories
        mocks/<tag>/       MSW handlers per operation
      mutator/              hand-written Orval Axios adapter
      axios-client.ts       shared Axios instance, auth adapter, 401 refresh handling
      query-client.ts       TanStack Query defaults
    config/                 validated public runtime/build configuration
    i18n/                   typed vi/en resources and language lifecycle
    lib/                    framework-neutral utilities
    ui/                     reusable presentation primitives (Button, Modal, Input, Table...)
test/                       global test setup
openapi/                    committed API contract snapshot
```

Folders are created when they gain a real member; empty taxonomy is not architecture.

Dependency rules are directional:

```text
routes -> features -> entities -> shared
providers -------------------------> shared
```

A lower layer cannot import a higher layer:

- A route module only renders its corresponding feature and configures loaders/meta.
- Features within one role do not import features from another role.
- Cross-role presentation or domain concepts MUST live in `entities/` (e.g. both Employee and Admin can import `LicenseStatusBadge` from `entities/license/`).
- Generic UI primitives and infrastructure live in `shared/ui/` and `shared/api/`.

### Role layouts and access control (RBAC)

1. **Dedicated Role Layouts**: Each role has its own layout shell (e.g., `features/employee/layout/employee-layout.tsx` for Employee, `features/admin/layout/admin-layout.tsx` for Admin). This ensures navigation items, headers, and quick actions are role-tailored without complex conditional logic in a single monolith layout.
2. **Layout-Level Route Guards**: Access control checks (e.g. verifying role permissions) run at the parent layout route module in `routes/<role>/layout.tsx`. Unauthorized users are intercepted before child route screens mount.

### Feature-internal organization

Each feature is self-contained. When a feature screen grows beyond a comfortable size, split it into focused files inside that feature folder:

```text
features/
  <role>/
    <feature>/
      <feature>-page.tsx              page component (~100 lines, composes children)
      components/                     feature-private child components
        <child-component>.tsx
      hooks/                          feature-private hooks
        use-<feature>-filters.ts
      __tests__/
        <feature>-page.test.tsx
```

Child components and hooks inside `components/` and `hooks/` are private to the
feature. Do not import them from other features. When a genuine second consumer
appears, promote the module to `entities/` (domain concept) or `shared/ui/`
(generic primitive).

#### Naming conventions

All file names use `kebab-case`. Exported symbols use their idiomatic JavaScript
casing (PascalCase for components, camelCase for hooks and functions).

| File type       | File name pattern            | Export pattern     | Example                                                 |
| --------------- | ---------------------------- | ------------------ | ------------------------------------------------------- |
| Page/screen     | `<feature>-page.tsx`         | `<Feature>Page`    | `employee-dashboard-page.tsx` → `EmployeeDashboardPage` |
| Child component | `<description>.tsx`          | `<Description>`    | `software-table.tsx` → `SoftwareTable`                  |
| Hook            | `use-<description>.ts`       | `use<Description>` | `use-license-filters.ts` → `useLicenseFilters`          |
| Utility         | `<description>.ts`           | named exports      | `format-currency.ts` → `formatCurrency`                 |
| Type-only       | `<description>.types.ts`     | named exports      | `license.types.ts`                                      |
| Constants       | `<description>.constants.ts` | named exports      | `license.constants.ts`                                  |
| Test            | `<source-file>.test.tsx`     | —                  | `software-table.test.tsx`                               |

#### File size guideline

These are soft guidelines, not hard rules. Tailwind class names make JSX wider than
CSS-module equivalents, so the threshold is slightly generous.

| Lines   | Action                                                                  |
| ------- | ----------------------------------------------------------------------- |
| ≤ 150   | Ideal. Keep as-is.                                                      |
| 150–300 | Review: split if the file has two or more distinct responsibilities.    |
| > 300   | Split. A file this long almost certainly handles more than one concern. |

#### Splitting triggers

Beyond line count, split a component when any of these apply:

- The component owns two or more independent UI sections (table + filters + drawer).
- It accumulates more than four or five pieces of local state (`useState`,
  `useReducer`); extract a custom hook.
- A rendered list item has non-trivial logic of its own; extract an item component.
- The same markup or logic appears in two features; promote to `entities/` or
  `shared/ui/`.

### State ownership

- URL state: route params and search params.
- Remote state: TanStack Query keys, cache, mutations, invalidation, and retries.
- Form state: local to the feature/form until a chosen form library is justified.
- Ephemeral UI state: local component state; context only for a genuine subtree-wide
  concern.
- Auth and permissions: backend-authoritative; the client may derive display helpers
  from a returned session/permission model but cannot grant access.

Avoid copying query results into local state and avoid request calls in `useEffect`.
Use a route loader only when navigation itself needs the data or must redirect; use
`queryClient.ensureQueryData` with generated query options when loader prefetch is
introduced so Router and Query do not become competing caches.

### Contract-first client generation

`openapi/openapi.yaml` is a versioned snapshot of the live BE OpenAPI export at
`https://wdp.novaproj.site/api/docs-json`. A snapshot of that export is kept in
`openapi/openapi.yaml` for review and offline generation
(`ORVAL_OPENAPI_SOURCE=./openapi/openapi.yaml`). Orval filters `auth`, `me` and the Super Admin business tags listed explicitly in `orval.config.ts`. Employee business tags are also generated; see the integration matrix. Other roles remain previews.

```text
openapi/openapi.yaml
  -> pnpm api:validate
      -> check the auth operation IDs and paths in the BE export
  -> pnpm api:generate
      -> app/shared/api/generated/operations/<tag>/<operation>.ts
      -> app/shared/api/generated/model/<tag>/<schema>.ts
```

Orval uses `axios`, `react-query`, and `tags-operations`: each OpenAPI tag owns a
directory, and each operation gets its own generated file. `splitByTags` places
models under their owning tag; a model referenced by multiple tags remains in the
shared model directory so it is not duplicated. Generated index files provide public
entry points. Generated mocks are disabled because the BE export's `allOf` response
examples currently produce invalid mock `message` types in Orval 8.
`app/shared/api/mutator/custom-axios.ts` is hand-written and passes generated
operations through the shared Axios instance. It returns the response body directly;
HTTP failures remain `AxiosError` values for TanStack Query. The generated URL reads
`env.API_BASE_URL`, which reads the required `VITE_API_BASE_URL`. In local
development, `.env` sets `/backend` and Vite forwards to `API_PROXY_TARGET`
after removing that prefix. Orval uses the proxy target to locate the OpenAPI
export. `pnpm build` uses mode `product` and reads `.env.product`, whose API URL
points directly to the BE. BE CORS must allow the deployed FE origin.
`axios-client.ts` attaches an access token
from a registered auth adapter, shares one in-flight refresh after 401 responses, and
retries each failed request at most once. Auth requests can use `skipAuth` and
`skipAuthRefresh`. The auth adapter is registered by `auth-session.ts`. It persists the complete token pair
atomically as JSON under `saas-sentry.auth-tokens` in Local Storage, restores access tokens before `/me`,
and migrates legacy Session Storage refresh tokens after a successful refresh. Storage failures fall back to
Session Storage and memory. Logout and invalid sessions clear persisted credentials. It rotates
both tokens after a single-flight refresh, clears the session on
`AUTH.SESSION_INVALID`, and retains tokens on temporary service failures. `/me`
supplies effective roles; no role is taken from a token. The default workspace follows the
`USER_ROLES` priority, so a derived Manager or Spending Approver role takes precedence over
Employee regardless of the API array order. Login ignores a generic Employee-root redirect
for those users while preserving explicit links into Employee screens. Do not wrap every generated
call in a repository.

Auth tests use an isolated Axios adapter. No test fixture is imported by the
production auth graph.

Mock data does use Orval: Faker generators create typed object factories from schema
constraints/examples, while MSW generators wrap those factories as HTTP handlers.
Use Faker when code needs a typed object without a network boundary; use MSW when the
test must exercise loading/error/cache/request behavior. Override generated defaults
inside the test instead of editing generated mock files.

Tag and contract naming is what creates the folder architecture. Backend Swagger
must declare exactly one stable business tag such as `Users`, `Licenses`, or
`Approval Workflows` on every operation. Request bodies reference names such as
`CreateUserRequest`; successful bodies reference wrappers such as `UserResponse` or
`UsersPageResponse`. Reusable inner objects use semantic names such as `UserDto`,
`MoneyDto`, or `LicenseStatus`. Orval cannot reliably infer whether an ambiguously
named DTO is a request or response, so `api:validate` rejects ambiguous top-level body
names before generation.

### Localization as a source boundary

`app/shared/i18n/resources.ts` is the source of truth for Vietnamese and English UI
copy. i18next is initialized with Vietnamese as the deterministic build/hydration
fallback; after mounting, a stored choice or supported browser language is applied.
The switch updates i18next, `<html lang>`, and browser storage.

Translation keys describe meaning (`licenses.empty.title`), not source text
(`noLicensesFound`). Both languages are changed atomically. UI components own
layout, while resources own sentences; do not split sentences into translated
fragments because grammar and word order differ. API-provided business data is kept
as data. Backend error codes should be mapped to frontend translation keys at the
feature boundary rather than displaying backend English text directly.

ESLint's local `project/no-hardcoded-ui-text` rule covers literal JSX text and common
visible/accessibility attributes. It intentionally does not guess every string in
ordinary TypeScript, so code review still checks alerts, schema validation messages,
table metadata, and third-party component props. `Intl` handles locale-aware dates,
numbers, currencies, percentages, and lists.

Contract update workflow:

1. Export OpenAPI from the backend and review the contract diff.
2. Replace `openapi/openapi.yaml`.
3. Run `pnpm api:generate`.
4. Fix feature code against generated types; never patch generated output.
5. Run `pnpm check` and commit contract plus generated output together.

### Configuration

- `.env` is for local development: `VITE_API_BASE_URL=/backend` and
  `API_PROXY_TARGET=https://wdp.novaproj.site`. The proxy target is only used
  by Node tooling and is not exposed as a browser environment variable.
- `.env.product` is for deployment: `VITE_API_BASE_URL=https://wdp.novaproj.site`.
  The build script passes `--mode product` so this file overrides `.env`.
- Vite statically replaces browser environment values during the build. Changing
  the production API origin therefore requires a rebuild.
- The Vite development server uses HTTP at `http://localhost:5173` and proxies
  API requests to the BE over HTTPS. Production TLS is managed by the hosting
  platform or reverse proxy. Port 5173 is strict.
- No token, private key, or service credential belongs in a `VITE_*` variable.
- React Router future flags explicitly retain v7 behavior. The versioned pnpm
  patch replaces internal deprecated `envFile: false` options with `envDir: false`.

### Testing and debugging

`vitest.config.ts` is exclusively the test-runner configuration. It limits discovery
to authored app tests, uses jsdom so DOM/accessibility behavior is available, loads
`test/setup.ts`, and reuses TypeScript path aliases. It does not configure the
production bundle; React Router/Vite build behavior lives in `vite.config.ts` and
`react-router.config.ts`.

The minimum test pyramid is:

1. Pure unit tests for formatting, mapping, and permission-display helpers.
2. Feature/component tests with Testing Library and generated Faker factories.
3. Request integration tests with generated MSW handlers where network behavior
   matters.
4. Browser smoke tests for navigation, console, accessibility tree, and important
   network requests.

Generated API output is TypeScript-checked but not hand-linted as authored code.
Failures should be fixed in the OpenAPI document or Orval configuration.

### Deployment files: VPS/Docker versus Vercel

The two deployment paths share the same static `build/client` output but use
different adapters:

- Docker/VPS: the final image copies `build/client` into Nginx. `nginx.conf` serves
  static assets and uses `try_files ... /index.html` so a hard refresh on a client
  route still boots React Router. A deployment ingress must route `/api` to NestJS,
  or the frontend must be built with a public absolute API URL.
- Vercel: Nginx and `nginx.conf` are not used. `react-router.config.ts` contains the
  official Vercel preset and keeps `ssr: false`; Vercel supports React Router SPA
  builds without a custom server. Configure the Vercel project root as `Code/FE-web`
  (when deploying this parent repository), keep the pnpm install/build commands, and
  set public environment values in the Vercel project before building. Test a deep
  route in Preview, not only `/`.

Do not add a broad Vercel rewrite on top of the React Router preset unless an actual
preview proves it is necessary; generic Vite SPAs need an `index.html` rewrite, while
the official React Router preset already understands the route/build structure.

### Why `openapi/` and `pnpm-workspace.yaml` exist

`openapi/` contains a reviewed snapshot of the backend's machine-readable contract.
Committing it makes backend changes diffable, generation reproducible offline, and
frontend/CI behavior independent of a live Swagger server. The backend remains the
author; clients replace the snapshot, validate it, regenerate, and commit the
contract plus output together.

`pnpm-workspace.yaml` declares the workspace root even with one package. Omitting a
`packages` list means only this root package participates today, while the file is
also the canonical place for pnpm resolution, supply-chain, and dependency build
policy. `allowBuilds` permits install scripts only for named packages such as
`esbuild` and `msw`; adding a package there grants code execution during install and
requires review. It is not evidence that this repository is already a monorepo and
does not require creating empty packages.

## Deferred decisions

The Manager shell now provides a shared header (breadcrumbs, sample manager identity,
and the language switch) for Dashboard and My Team at `/manager/my-team`. My Team
uses the eight profiles in the supplied design; its overview figures represent the
eighteen-member sample design. Search, filters, and pagination live in URL search
parameters. CSV export includes all filtered sample profiles, with localized headers
and spreadsheet formula escaping. Member details navigate to `/manager/my-team/:id`
and preserve list filters for the return link. Employee request creation links to
the employee-selection preview; later stages await designs and a backend contract.

`entities/user` now owns the shared TeamMember presentation type, sample team list,
and member avatar used by My Team and Employee Detail. Detail tab selection lives in
URL search parameters. The supplied detailed records belong only to employee `1`;
other sample employees show their known profile fields and explicit missing-data
states. Unknown IDs show a localized missing-employee screen. Monthly cost is derived
from the four assigned licenses (USD 57.99), rather than the inconsistent USD 48
figure in the source design. Request SLA and usage dates are labeled sample values;
approval and access-review mutations remain disabled pending backend integration.

The Manager presentation preview is available at `/manager/dashboard` with its own
layout under `features/manager/layout`. Dashboard fixtures reproduce the supplied
design and are explicitly labeled as sample data. Date search parameters filter
only the recent sample requests; KPI, usage, status, and cost panels remain static.
The supplied usage series are preserved independently and must not be interpreted
as an active/inactive partition until the backend defines these metrics.
Unimplemented navigation destinations are disabled. Authentication and Manager
layout route guards await the backend session/role contract; this preview does not
grant permissions or perform business mutations.

Team Requests is available at `/manager/team-requests`. Its six supplied sample
records support URL search, status/type/software/date filters, ID sorting,
pagination, and links to `/manager/team-requests/:id` for request approval detail.
The initial status is All so every supplied row is visible; overview totals
remain independent illustrative figures. Date filters initially cover August 2026.
The source's contradictory Overdue status and six hours left are retained and
explained on the detail page; SLA is not inferred from the current clock.
The shared header search uses the same URL search parameter as the table.
Approval mutations and authentication await the backend contract.

Request Approval Detail preserves list query parameters for the return link.
`entities/request` owns the shared Manager request presentation fixtures, status
badge, requester avatar, and software summary used by the list and detail features.
Only REQ-1024 has the extended supplied fields and sample approval flow; other
known requests show their own summary with explicit missing fields and history.
Unknown IDs render a missing-request state. Submitted dates match the list;
the conflicting May dates in the detailed source are not used to infer a deadline.
Download exports a localized, labeled sample text summary. Approve and Reject
remain disabled until backend permissions and workflow transitions are defined.

Team Software / Usage is available at `/manager/team-software`, with the supplied
eight software rows and independently labeled illustrative overview/chart values.
The only available usage snapshot is May 18–24, 2026; selecting another period
shows a missing-snapshot state rather than recalculating unsupported usage data.
Search, status, usage band, ghost/expiring flags, and pagination live in the URL.
Organization selectors are disabled because no allocation mapping was supplied.
Ghost review filters the table; row disclosures explain the pending assignment
and activity integration. Export contains all filtered table records in localized
CSV. CSV cell encoding is shared with My Team under `shared/lib/csv`.
The Figma mark is shared by request and software presentations under
`entities/software`.
Team Software uses the shared warm orange palette. The Manager shell is fixed to
the viewport, with scrolling confined to its main content and sidebar navigation,
so document scrolling cannot reveal unused body space below the portal.

- Authentication uses the BE login/refresh contract. Per the owner's persistence requirement, the token pair
  is stored in Local Storage; browser scripts on the FE origin can read it. Never log or render credentials.
- Form, table, chart, and component libraries should be chosen from real screens and
  accessibility requirements, not installed as architecture placeholders.
- A shared Web/Mobile package is deferred. Web is the MVP and native presentation
  constraints differ; share the API contract and domain language before sharing UI.

Access Review is available at `/manager/access-review`. Its three supplied pending
assignments use shared team identities, with cycle-specific sample activity and
risk. Overview and tab counts remain explicitly independent design figures. URL
parameters control search, status, software, team, risk, employee, and pagination;
reviewed/exempt views show missing-sample states rather than invented records.
Selection spans pages, while bulk preview includes only selected filtered results.
Row View links open `/manager/access-review/:id`, preserving list filters. Bulk
review opens a read-only summary with links to individual details. Opening either
never changes status or access. The only available cycle is Q2 2026. CSV exports all filtered sample rows
with localized headers and shared spreadsheet escaping. Backend review decisions,
permissions, and live campaign data await an OpenAPI contract.

Assignment Details renders the supplied decision screen in the Manager shell.
Shared assignment records and filtering live in `entities/license/` because list
and detail both consume them. The list's Q2 cycle and Manager identity take
precedence over conflicting Q1/IT Admin labels in the detail source. Only AR-1 has
the supplied business-purpose/project examples; other assignments show missing
extended fields. Employee identity and cost center come from shared team records.
Unknown IDs show a recoverable missing-record state. Keep/Reclaim/Exempt and the
required reason (maximum 250 characters) are ephemeral unsaved drafts reset when
the assignment changes. Submit remains unavailable pending backend authorization
and review workflow; no decision is persisted or reported as successful.

## Official references

- [React Router SPA mode](https://reactrouter.com/how-to/spa)
- [React Router rendering strategies](https://reactrouter.com/start/framework/rendering)
- [Vite environment variables](https://vite.dev/guide/env-and-mode)
- [TanStack Query React installation](https://tanstack.com/query/latest/docs/framework/react/installation)
- [Orval React Query client](https://orval.dev/docs/guides/react-query/)
- [Orval Faker generation](https://orval.dev/docs/guides/faker/)
- [Orval MSW generation](https://orval.dev/docs/guides/msw/)
- [Orval output configuration](https://orval.dev/docs/reference/configuration/output/)
- [Faker usage and bundle-size guidance](https://fakerjs.dev/guide/usage)
- [Vitest configuration](https://vitest.dev/config/)
- [React i18next `useTranslation`](https://react.i18next.com/latest/usetranslation-hook)
- [Vercel React Router preset](https://vercel.com/docs/frameworks/frontend/react-router)
- [pnpm workspace settings](https://pnpm.io/settings)
