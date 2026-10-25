# SaaS-Sentry Frontend Agent Guide & Quy Chuẩn Phát Triển (Source of Truth)

File này là **nguồn chân lý hoạt động (operational source of truth)** cho tất cả lập trình viên và các AI coding agent làm việc trong codebase frontend này. Mọi thay đổi về cấu trúc, luồng dữ liệu hoặc bổ sung tính năng mới **BẮT BUỘC** phải đọc và tuân thủ tuyệt đối các quy tắc trong tài liệu này và [ARCHITECTURE.md](file:///c:/fe_capstone/FE-dev-main/ARCHITECTURE.md).

---

## 1. Phạm vi dự án & Công nghệ cốt lõi

- **Dự án**: Frontend Web MVP cho hệ thống **SaaS-Sentry** (Quản trị bản quyền phần mềm, hợp đồng SaaS, quy trình phê duyệt chi phí, tối ưu hoá license và phát hiện Shadow IT).
- **Tổng quan nghiệp vụ dự án**: Xem tại [PROJECT_OVERVIEW.md](file:///c:/fe_capstone/FE-dev-main/PROJECT_OVERVIEW.md).
- **Tài liệu nghiệp vụ BRD chi tiết**: Xem tại `../docs/Requiments/BRD - HỆ THỐNG QUẢN TRỊ BẢN QUYỀN PHẦN MỀM & TỐI ƯU CHI PHÍ CÔNG NGHỆ.md`.
- **Backend**: NestJS đảm nhiệm toàn bộ nghiệp vụ (business rules), xác thực & phân quyền (authorization), lưu trữ dữ liệu (persistence), background jobs và cung cấp OpenAPI REST API contract.
- **Tech Stack**:
  - React 19 & React Router 7 (Framework Mode, SPA client rendering).
  - Vite 8 & Tailwind CSS 4.
  - TanStack Query 5 (quản lý server state / cache API).
  - Orval 8 (tự động sinh OpenAPI client, react-query hooks, Faker factories, MSW handlers).
  - Vitest & Testing Library (kiểm thử unit & component).
  - TypeScript strict mode, ESLint flat config, Prettier, pnpm.

---

## 2. Các lệnh thực thi bắt buộc (Commands)

```bash
pnpm install --frozen-lockfile   # Cài đặt dependency chính xác theo lockfile
pnpm api:validate               # Kiểm tra tính hợp lệ của file openapi/openapi.yaml
pnpm api:generate               # Tự động sinh client/types từ OpenAPI (Chạy sau khi sửa openapi.yaml)
pnpm dev                        # Chạy dev server cục bộ
pnpm vitest run <path>          # Chạy kiểm thử cho file hoặc thư mục cụ thể
pnpm typecheck                  # Kiểm tra toàn bộ lỗi TypeScript (react-router typegen && tsc)
pnpm check                      # Kiểm tra tổng thể dự án trước khi bàn giao
```

> **LƯU Ý QUAN TRỌNG**: Sau bất kỳ lần refactor hoặc chỉnh sửa code nào, **bắt buộc** phải chạy `pnpm typecheck` và chạy lại bộ test tương ứng để đảm bảo 0 lỗi TypeScript và test pass 100%.

---

## 3. Ranh giới kiến trúc phân tầng (Source Boundaries)

Cấu trúc thư mục mã nguồn được phân định ranh giới nghiêm ngặt theo chiều phụ thuộc:

```text
app/routes      -> Tầng điều hướng (URL, metadata, route controller mỏng)
    ↓
app/features    -> Tầng tính năng nghiệp vụ người dùng (auth, dashboard của từng role)
    ↓
app/entities    -> Tầng thực thể nghiệp vụ dùng chung (user-role, user, license, request,...)
    ↓
app/shared      -> Tầng hạ tầng dùng chung (i18n, UI primitives, utils, API client)
```

### Chiều phụ thuộc được phép (Dependency Rules):
```text
routes -> features -> entities -> shared
   |          |                     ^
   +----------+---------------------+
providers --------------------------+
```

1. **Route Controller phải cực kỳ mỏng (Thin Controller)**: Không viết state phức tạp hay JSX dài dòng trong `app/routes/`. Toàn bộ giao diện và workflow phải đưa vào `app/features/`.
2. **Feature không được import nội bộ của Feature khác**: Ví dụ, `features/dashboard/finance` **tuyệt đối không** import file nội bộ từ `features/dashboard/manager`. Nếu có logic hoặc kiểu dữ liệu dùng chung cho 2 role trở lên, phải đưa lên `app/entities/` hoặc `app/shared/`.
3. **`shared/` là tầng thấp nhất**: Tuyệt đối **không** được import ngược từ `features/`, `entities/` hoặc `routes/` vào `shared/`.
4. **Không tạo Barrel files (`index.ts`) gây vòng lặp phụ thuộc (circular dependencies)**.

---

## 4. Quy tắc Dữ liệu & Tích hợp API (Data & API Rules)

1. **Server State phải dùng TanStack Query**: Tuyệt đối không gọi fetch API trực tiếp từ `useEffect` tùy tiện.
2. **Không sửa tay code trong `app/shared/api/generated/`**: Toàn bộ thư mục này là code tự sinh bởi Orval từ `openapi/openapi.yaml`. Mọi thay đổi API contract phải sửa trong `openapi.yaml` rồi chạy `pnpm api:generate`.
3. **Phân biệt môi trường Test & Production**: Chỉ import Faker factories và MSW handlers trong các file test (`*.test.tsx`, `*.test.ts`). Không import vào code logic của ứng dụng.
4. **Bảo mật**: Các biến môi trường `VITE_*` là public trên client bundle, tuyệt đối không lưu secret, private key vào đây. Phân quyền và kiểm tra hợp lệ cuối cùng bắt buộc phải được NestJS backend kiểm soát.

---

## 5. Quy chuẩn Đa ngôn ngữ (Strict Zero-Hardcoded-Text Policy)

> **CẤM TUYỆT ĐỐI HARDCODE TEXT TRONG GIAO DIỆN**: Bất kỳ chuỗi văn bản nào hiển thị tới mắt người dùng (tiếng Việt hay tiếng Anh) xuất hiện trực tiếp trong file `.tsx` đều bị coi là **VI PHẠM QUY CHUẨN**.

1. **100% sử dụng hook `useTranslation()`**:
   - Tất cả tiêu đề (`h1`-`h6`), đoạn văn (`p`), nhãn form (`label`), placeholder, nút bấm (`button`), tiêu đề cột bảng (`th`), thông báo lỗi, thông báo rỗng (`empty state`), modal confirm, tooltip đều phải lấy qua:
     ```tsx
     const { t } = useTranslation('dashboard')
     // Sử dụng:
     <h1>{t('role.section.title')}</h1>
     ```
2. **Đồng bộ song ngữ bắt buộc**:
   - Khi tạo mới bất kỳ key dịch nào, **phải thêm đồng thời** vào cả 2 file:
     - Tiếng Việt: `app/shared/i18n/locales/vi/<namespace>.ts`
     - Tiếng Anh: `app/shared/i18n/locales/en/<namespace>.ts`
3. **Quy tắc đặt tên Translation Key**:
   - Không dùng câu tiếng Anh làm key. Phải dùng dot-notation có cấu trúc phân cấp rõ ràng (ví dụ: `itAdmin.provisioning.assignModal.title`, `superAdmin.accounts.createBtn`).
4. **Trường hợp ngoại lệ duy nhất**:
   - Tên thương hiệu riêng hoặc mã code nghiệp vụ động trả về từ API (ví dụ: "Figma", "Notion", "SLACK-001", "VND"). Các nhãn tĩnh bao quanh chúng vẫn phải được bọc i18n đầy đủ.
5. **Định dạng số, ngày tháng, tiền tệ**:
   - Phải sử dụng các hàm helper chuẩn hoá từ `app/features/dashboard/dashboard-ui.tsx` (như `formatCurrency()`, `formatDate()`) hoặc các helper trong `app/shared/utils/`. Tuyệt đối không tự viết logic regex/format thủ công gây sai lệch chuẩn hiển thị.

---

## 6. Quy chuẩn Kích thước File & Phân rã Component (File Size Limit <= 500 lines)

1. **Giới hạn cứng**: Bất kỳ file `.tsx` hoặc `.ts` nào vượt quá 500 dòng đều bị coi là **VI PHẠM QUY CHUẨN**.
2. **Quy tắc phân rã sớm**: Khi file chạm mốc ~400–450 dòng, phải lập tức phân rã:
   - Các modal, dialog, drawer tách thành component con trong `components/`.
   - Các bảng dữ liệu (Table), dải tóm tắt (KPI cards) tách thành component con.
   - Các state, mutation, query phức tạp chuyển vào custom hook trong `hooks/`.
   - Các giá trị hằng số, tab keys, status chuyển vào `enums.ts`.
3. **Mục tiêu của Views**: File trong thư mục `views/` chỉ đóng vai trò container layout, điều phối hiển thị và kết nối URL query params, giữ kích thước dưới 400 dòng.

---

## 7. Kiến trúc Cắt dọc theo Chức năng Nghiệp vụ (Vertical Slice Architecture / Feature-Driven)

> **QUY CHUẨN KIẾN TRÚC QUỐC TẾ**: Dự án áp dụng **Vertical Slice Architecture (VSA)** kết hợp **Feature-Driven Design (FDD)**.
> Thay vì gom ngang toàn bộ views, components, hooks của một role vào các thư mục phẳng dùng chung (dễ gây phình to, khó bảo trì khi mở rộng hệ thống), mã nguồn trong mỗi Role được **cắt dọc theo từng Phân hệ / Chức năng Nghiệp vụ (Sub-feature / Domain Slice)**.

### 7.1 Cấu trúc Chuẩn của một Role:

```text
app/features/dashboard/<role>/
├── <sub-feature-A>/         # Phân hệ nghiệp vụ A (ví dụ: annual-budget, provisioning, ghost-seats,...)
│   ├── views/               # Trang cha (Parent View) của riêng chức năng này (<= 400 dòng)
│   ├── components/          # Component con (Modals, Dialogs, Tables, Cards) của riêng chức năng này (<= 300 dòng)
│   ├── hooks/               # Custom hooks nghiệp vụ của riêng chức năng này
│   └── enums.ts             # Enums, types, tab keys của riêng chức năng này (nếu có)
│
├── <sub-feature-B>/         # Phân hệ nghiệp vụ B
│   ├── views/
│   ├── components/
│   ├── hooks/
│   └── enums.ts
│
├── shared/                  # Thành phần dùng chung giữa các chức năng TRONG CÙNG ROLE
│   ├── components/          # Component dùng chung trong role (ví dụ: confirm dialogs, summary headers)
│   ├── hooks/               # Hook dùng chung trong role (ví dụ: use<Role>Tabs)
│   └── ...
│
├── <role>-data.ts           # Dữ liệu mẫu (mock data), contracts và interface nền tảng của role
├── <role>-nav.ts            # Cấu hình thanh điều hướng sidebar và định nghĩa Tab tổng của role
├── enums.ts                 # Enums, Tab Keys tổng quát của role
└── index.ts                 # Barrel export duy nhất của role ra bên ngoài
```

### 7.2 Chi tiết 6 Roles và các Sub-features đã chuẩn hóa:

1. **Employee (`app/features/dashboard/employee/`)**:
   - `overview/`: Dashboard tổng quan, thẻ tóm tắt sử dụng phần mềm.
   - `software-request/`: Quy trình đăng ký phần mềm mới, stepper, chọn gói, đơn cá nhân và dùng chung theo nhóm (team request).
   - `my-software/`: Danh sách phần mềm được cấp phát, xem license key, gia hạn tạm thời, trả lại bản quyền.
   - `my-requests/`: Theo dõi danh sách và trạng thái chi tiết các yêu cầu của nhân viên.
   - `profile-privacy/`: Hồ sơ nhân viên, minh bạch dữ liệu telemetry, xuất dữ liệu cá nhân.
   - `shared/`: Component thông báo bản demo (`EmployeePreviewNotice`).
   - `index.ts`: Barrel export toàn bộ views, components, hooks, enums của Employee.

2. **Super Admin (`app/features/dashboard/super-admin/`)**:
   - `overview/`: Chỉ số điều hành hệ thống cấp cao toàn tổ chức.
   - `accounts/`: Quản lý tài khoản người dùng, phân quyền vai trò đặc biệt, định danh thiết bị máy tính (Workstation binding).
   - `departments/`: Quản lý danh sách phòng ban, chỉ số thống kê và quản lý người phụ trách.
   - `personnel/`: Danh bạ nhân sự, đồng bộ trạng thái nhân sự.
   - `reminders/`: Cấu hình chính sách và mô phỏng gửi email nhắc nhở tự động.
   - `audit/`: Nhật ký kiểm toán hệ thống (Audit Trail).
   - `transfer/`: Bàn giao và chuyển giao tài sản số.
   - `settings/`: Cấu hình hệ thống chung.
   - `shared/`: Hooks dùng chung (`useSuperAdminTabs`).
   - `index.ts`: Barrel export toàn bộ views, helpers, enums của Super Admin.

3. **Manager (`app/features/dashboard/manager/`)**:
   - `overview/`: Bảng chỉ số tổng quan phòng ban, ngân sách và nhân sự.
   - `team-requests/`: Phê duyệt đơn của nhân viên, tạo đơn đăng ký hộ, duyệt theo đợt (weekly batch), đơn của quản lý.
   - `team/`: Quản lý thành viên đội ngũ, chi tiết nhân sự và phần mềm nhóm đang sử dụng.
   - `access-review/`: Đợt rà soát và tái chứng nhận quyền truy cập định kỳ.
   - `ghost-seats/`: Rà soát tài khoản không hoạt động lãng phí (Ghost Seats) và ra quyết định thu hồi.
   - `annual-budget/`: Lập kế hoạch và gửi đề xuất ngân sách phần mềm năm của bộ phận.
   - `shared/`: Dialog xác nhận, huy hiệu danh tính (`manager-identity-mark`), dải tóm tắt (`manager-summary-strip`), hook tabs.
   - `index.ts`: Barrel export toàn bộ views, components, helpers của Manager.

4. **Spending Approver (`app/features/dashboard/approvals/`)**:
   - `overview/`: Tổng quan tình trạng phê duyệt chi tiêu và biểu đồ chi phí.
   - `queue/`: Hàng đợi phê duyệt mua sắm phần mềm mới, gia hạn, phí vượt mức (overage charges), đề xuất tối ưu hóa.
   - `annual-budget/`: Thẩm định và phê duyệt đề xuất ngân sách năm của các phòng ban.
   - `exceptions/`: Phê duyệt ngoại lệ vượt ngân sách và điều chỉnh ngân sách.
   - `decisions/`: Sổ nhật ký quyết định phê duyệt và báo cáo chi tiêu theo Cost Center.
   - `shared/`: Bảng kiểm tra ngân sách (`approval-budget-check-panel`), hook tabs.
   - `index.ts`: Barrel export toàn bộ views, `ApprovalScreen`, enums của Spending Approver.

5. **IT Admin (`app/features/dashboard/it-admin/`)**:
   - `overview/`: Trung tâm điều hành IT, hàng đợi thao tác kỹ thuật, biểu đồ phân loại.
   - `provisioning/`: Cấp phát tài khoản, bàn giao thông tin đăng nhập, duyệt hàng loạt theo phòng ban.
   - `device-collectors/`: Thu thập dữ liệu telemetry máy tính, quản lý token, giám sát thiết bị.
   - `dept-catalog/`: Quản lý danh mục phần mềm tiêu chuẩn phòng ban, cấu hình gói.
   - `optimization/`: Tối ưu hóa giấy phép, xử lý bản quyền nhàn rỗi hoặc hạ cấp gói.
   - `shadow-it/`: Phát hiện và xử lý ứng dụng ngoài luồng có rủi ro bảo mật.
   - `reconciliation/`: Đối soát số liệu bản quyền với hóa đơn mua hàng.
   - `identities/`: Khớp nối danh tính chưa được định danh (Unmatched Identities).
   - `renewals/`: Đề xuất gia hạn bản quyền công nghệ.
   - `offboarding/`: Quy trình thu hồi tài khoản và bản quyền khi nhân sự nghỉ việc.
   - `usage-import/`: Nhập lịch sử sử dụng phần mềm từ file ngoài.
   - `shared/`: Hooks quản lý tabs (`useItAdminTabs`).
   - `index.ts`: Barrel export toàn bộ views, components, enums của IT Admin.

6. **Finance (`app/features/dashboard/finance/`)**:
   - `overview/`: Báo cáo tài chính SaaS tổng quan, tỷ lệ sử dụng ngân sách.
   - `annual-budget/`: Lập kế hoạch ngân sách thường niên, thương lượng ngân sách và tổng hợp đề xuất.
   - `budget-allocation/`: Phân bổ ngân sách theo phòng ban và mã trung tâm chi phí (Cost Center).
   - `budget-questions/`: Thẩm định thắc mắc ngân sách và gửi yêu cầu giải trình cho Quản lý.
   - `commitments/`: Quản lý cam kết chi tiêu và hóa đơn công nợ chưa thanh toán.
   - `budget-check/`: Kiểm tra tính khả dụng ngân sách, xử lý ngoại lệ vượt định mức.
   - `period-close/`: Quy trình đóng kỳ kế toán, khóa sổ và phát hành báo cáo định kỳ.
   - `cost-optimization/`: Phân tích chi phí, dự báo xu hướng chi phí tương lai và cơ hội tiết kiệm.
   - `spend-import/`: Nhập dữ liệu sao kê chi tiêu thực tế.
   - `decisions/`: Nhật ký lịch sử các quyết định tài chính.
   - `shared/`: Components dùng chung (`filter-panel`, `budget-period-filter`, `finance-chart-panels`, `finance-sidebar-nav`), hooks tabs & budget.
   - `index.ts`: Barrel export toàn bộ views, `FinanceScreen`, enums của Finance.

---

### 7.3 Quy tắc Sử dụng Barrel Export (`index.ts`) & Decoupling

1. **Các Consumer bên ngoài CHỈ ĐƯỢC IMPORT từ Barrel Index của Role**:
   - File điều phối [dashboard-page.tsx](file:///c:/fe_capstone/FE-dev-main/app/features/dashboard/dashboard-page.tsx), thanh điều hướng [dashboard-sidebar.tsx](file:///c:/fe_capstone/FE-dev-main/app/features/dashboard/components/dashboard-sidebar.tsx) và các Route Controller `app/routes/` **tuyệt đối không được import sâu** vào đường dẫn nội bộ dạng `./manager/views/...` hay `./finance/components/...`.
   - **ĐÚNG**:
     ```ts
     import { ManagerOverviewView, ManagerTeamRequestsView } from './manager'
     import { SuperAdminOverviewView } from './super-admin'
     import { FinanceScreen, isValidFinanceTab } from './finance'
     ```
   - **SAI (CẤM)**:
     ```ts
     import { ManagerOverviewView } from './manager/views/manager-overview-view' // VI PHẠM
     ```

2. **Quy tắc Tránh Trùng lặp Export (Collision Resolution)**:
   - Khi một thành phần đã được export từ `<role>-data.ts` hoặc `<role>-nav.ts` (ví dụ: `BudgetStatus`, `SuperAdminTabKey`), **không được** dùng `export * from './enums'` mù quáng trong `index.ts` gây lỗi TS2308. Phải chỉ định rõ ràng các export duy nhất.

3. **Quy tắc Phạm vi Runtime (Local Scope Rule)**:
   - Trong JavaScript/TypeScript, cú pháp `export { X } from './enums'` **không đưa biến `X` vào phạm vi cục bộ của file hiện tại**.
   - Do đó, nếu một hàm trong file (ví dụ `isValidTab(val)`) cần truy cập mảng `TAB_KEYS`, file đó **bắt buộc phải import trước**:
     ```ts
     import { TAB_KEYS, type TabKey } from './enums'
     export { TAB_KEYS, type TabKey }
     ```

4. **Quy tắc Phụ thuộc giữa các Sub-features**:
   - Sub-feature A **không được import trực tiếp** từ Sub-feature B.
   - Nếu cả 2 Sub-feature đều cần dùng chung 1 component, helper hoặc dialog, thành phần đó **bắt buộc phải chuyển vào thư mục `<role>/shared/`**.
   - Nếu component hoặc kiểu dữ liệu được dùng chung giữa 2 Role khác nhau, thành phần đó phải được đưa lên tầng `app/entities/` hoặc `app/shared/`.

### 7.4 Lợi ích & Nguyên tắc cốt lõi:
1. **Tính Đóng gói Cao (High Cohesion & Encapsulation)**: Mọi thứ liên quan đến một tính năng (giao diện, logic, modal, hooks, enums) đều nằm trọn vẹn trong thư mục của tính năng đó.
2. **Khả năng Mở rộng Không Giới Hạn (Enterprise Scalability)**: Khi doanh nghiệp mở rộng thêm các tính năng mới cho Role, lập trình viên/agent chỉ cần thêm một thư mục sub-feature mới mà không làm ảnh hưởng hay gây phình to thư mục của các tính năng khác.
3. **Dễ Kiểm Thử & Loại Bỏ (Isolated Testing & Deprecation)**: Khi cần xoá bỏ hoặc nâng cấp một chức năng cũ, chỉ cần thao tác trên đúng thư mục của chức năng đó, không để lại code rác (dead code) ở các thư mục dùng chung.
4. **Mỗi file bên trong sub-feature vẫn phải tuân thủ nghiêm ngặt**:
   - Views chỉ giữ vai trò parent layout (< 400 dòng).
   - Components con tách nhỏ (< 300 dòng).
   - Tuyệt đối không hardcode text (100% i18n).

---

## 8. Cấu trúc Route & Bảo mật Phân quyền (RBAC Route Guard)

Ứng dụng triển khai hệ thống route phân tách rõ ràng và bảo vệ đa tầng theo chuẩn RBAC:

```text
app/routes/
├── home.tsx                            # Trang chủ Landing page (/)
├── login.tsx                           # Trang đăng nhập (/login)
├── forbidden.tsx                       # Màn hình 403 Forbidden (/forbidden)
├── dashboard.super-admin.tsx           # Route Super Admin (Bảo vệ: Chỉ role 'super-admin')
├── dashboard.it-admin.tsx              # Route IT Admin (Bảo vệ: Chỉ role 'it-admin')
├── dashboard.manager.tsx               # Route Manager (Bảo vệ: Chỉ role 'manager')
├── dashboard.finance.tsx               # Route Finance (Bảo vệ: Chỉ role 'finance')
├── dashboard.spending-approver.tsx     # Route Spending Approver (Bảo vệ: Chỉ role 'spending-approver')
├── dashboard.employee.tsx              # Route Employee (Bảo vệ: Chỉ role 'employee')
├── dashboard.tsx                       # Parameterized Fallback route (/dashboard/:role)
└── not-found.tsx                       # 404 Catch-all route (*)
```

### Cơ chế Bảo vệ RBAC bắt buộc:
1. **Lưu phiên đăng nhập**: Khi đăng nhập tại `/login`, session người dùng được lưu thông qua `setAuthSession()` trong `app/features/auth/auth-session.ts`.
2. **Bộ bảo vệ `RoleGuard`**:
   - Mỗi file route dashboard **bắt buộc** phải bọc component trong `<RoleGuard requiredRole="...">`.
   - **Chưa đăng nhập**: Tự động chuyển hướng về `/login?redirectTo=...`.
   - **Sai Role**: Nếu người dùng cố tình gõ URL của vai trò khác (ví dụ: tài khoản `employee` cố truy cập `/dashboard/super-admin` hoặc `/dashboard/finance`), hệ thống **chặn đứng lập tức**:
     - Không render bất kỳ component hay fetch dữ liệu nào của role đó.
     - Hiển thị giao diện **403 Forbidden** kèm thông báo bảo mật rõ ràng và nút bấm quay về Dashboard đúng vai trò của họ.

---

## 9. Quy trình Checklist bắt buộc cho AI Agent (Agent Workflow)

Mỗi khi nhận nhiệm vụ code hoặc refactor, Agent **BẮT BUỘC** phải tự kiểm tra danh sách sau trước khi báo cáo hoàn thành:

- [ ] **Kiểm tra giới hạn dòng**: Đảm bảo không có file `.tsx` nào mới tạo hoặc chỉnh sửa vượt quá 500 dòng code.
- [ ] **Kiểm tra i18n**: Rà soát kỹ lưỡng, đảm bảo 100% text giao diện hiển thị đều dùng `t('key')`, không hardcode tiếng Việt hay tiếng Anh. Các key mới đã được khai báo ở cả `vi` và `en`.
- [ ] **Kiểm tra cấu trúc Role**: File view đặt đúng trong `views/`, component con đặt đúng trong `components/`, hook đặt đúng trong `hooks/`, enum đặt trong `enums.ts`.
- [ ] **Kiểm tra Bảo mật Route**: Mọi route dashboard phải bọc qua `RoleGuard`.
- [ ] **Chạy Typecheck**: Chạy `pnpm typecheck` thành công với **0 lỗi TypeScript**.
- [ ] **Chạy Unit Test**: Chạy `pnpm vitest run <path-to-test>` đảm bảo toàn bộ test case liên quan đều **Passed (100%)**.
- [ ] **Đồng bộ tài liệu**: Cập nhật thay đổi kiến trúc vào `ARCHITECTURE.md` và `AGENTS.md` bằng tiếng Việt rõ ràng.
