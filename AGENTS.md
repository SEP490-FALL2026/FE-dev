# SaaS-Sentry Frontend Agent Guide & Quy Chuẩn Phát Triển (Source of Truth)

File này là **nguồn chân lý hoạt động (operational source of truth)** cho tất cả lập trình viên và các AI coding agent làm việc trong codebase frontend này. Mọi thay đổi về cấu trúc, luồng dữ liệu hoặc bổ sung tính năng mới **BẮT BUỘC** phải đọc và tuân thủ tuyệt đối các quy tắc trong tài liệu này, [ARCHITECTURE.md](file:///c:/fe_capstone/FE-dev-main/ARCHITECTURE.md) và [UI_UX_DESIGN_GUIDELINES.md](file:///c:/fe_capstone/FE-dev-main/UI_UX_DESIGN_GUIDELINES.md).

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
- **Tương thích Đa tác tử AI (Multi-Agent Support)**:
  - **OpenAI Codex**: Cấu hình tại [CODEX.md](file:///c:/fe_capstone/FE-dev-main/CODEX.md) và [.codex/instructions.md](file:///c:/fe_capstone/FE-dev-main/.codex/instructions.md).
  - **GitHub Copilot**: Cấu hình tại [.github/copilot-instructions.md](file:///c:/fe_capstone/FE-dev-main/.github/copilot-instructions.md).
  - **Claude / Cursor / Windsurf / Gemini**: Cấu hình tại `CLAUDE.md`, `.cursor/rules/`, `.windsurfrules`, `GEMINI.md`.
  - Toàn bộ các Agent đều phải tuân thủ nghiêm ngặt bộ quy tắc thiết kế UI tại [UI_UX_DESIGN_GUIDELINES.md](file:///c:/fe_capstone/FE-dev-main/UI_UX_DESIGN_GUIDELINES.md).

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
5. **HTTP client dùng chung**: Orval sinh React Query hooks với Axios qua `app/shared/api/mutator/custom-axios.ts` và `app/shared/api/axios-client.ts`. Không tự tạo Axios instance riêng trong từng feature. Interceptor gắn token từ auth adapter trong `auth-session.ts`; login/refresh dùng endpoint và kiểu dữ liệu BE đã sinh. Theo yêu cầu lưu phiên của Owner, token pair và hạn dùng lưu dạng JSON tại `localStorage['saas-sentry.auth-tokens']`, khôi phục khi mở lại web, thay thế sau refresh và xóa khi logout/phiên không hợp lệ. Phiên cũ từ `sessionStorage` được chuyển sau refresh thành công; khi storage bị chặn, dùng fallback sessionStorage/bộ nhớ. Dùng `skipAuth` và `skipAuthRefresh` cho request xác thực, tránh refresh đệ quy và retry quá một lần. Không tự đoán URL refresh, log hoặc hiển thị token.

---

## 5. Quy chuẩn Đa ngôn ngữ (Strict Zero-Hardcoded-Text Policy)

### Thông báo thao tác bắt buộc qua toast

- Dùng **Sonner** (`import { toast } from 'sonner'`) cho phản hồi thành công/thất bại của thao tác: đăng nhập, lưu, gửi, xóa, phê duyệt, xuất dữ liệu. **Không tạo khối alert/context/banner cố định trong layout để báo kết quả thao tác**, không dùng `window.alert`.
- `AppToaster` ở `app/shared/ui/app-toaster.tsx` được gắn **một lần** trong `AppProviders`; không gắn Toaster riêng trong page/modal. Toaster dùng theme/i18n hiện hành, tự ẩn sau 5 giây, có nút đóng và tối đa 3 thông báo. Chỉ điều chỉnh cấu hình chung khi có lý do UX cụ thể.
- Gọi toast trong callback `onSuccess`/`onError` của mutation hoặc handler sở hữu thao tác. Không phát toast trong render, effect theo dõi cờ mutation, Axios interceptor hoặc đồng thời nhiều tầng gây thông báo trùng. Chỉ báo thành công sau khi BE xác nhận; mọi nội dung phải dịch đủ VI/EN, ánh xạ mã lỗi sang key frontend, không hiển thị message BE thô hoặc token.
- Dùng `id` ổn định cho kết quả cùng thao tác để tránh xếp chồng lỗi lặp. `requestId` có thể đặt trong description; không nhét chi tiết kỹ thuật dài vào toast.
- **Phân biệt validation/trạng thái trang:** lỗi gắn với ô nhập được phép có hướng dẫn ngắn tại ô đó, `aria-invalid` và mô tả liên kết đúng. Loading, empty, mất kết nối khi tải trang, thiếu quyền hoặc liên kết hết hạn vẫn cần trạng thái trang cùng hành động retry/điều hướng; toast không thay thế các trạng thái này. Không hiển thị lại cùng thông báo thao tác bằng cả toast và banner.
- Giữ `isPending`, spinner, `disabled` và chặn gửi lặp. Với `Retry-After`, hiển thị countdown ở nút để người dùng biết khi nào thử lại dù toast đã ẩn. Lỗi không xóa dữ liệu người dùng vừa nhập.

> **CẤM TUYỆT ĐỐI HARDCODE TEXT TRONG GIAO DIỆN**: Bất kỳ chuỗi văn bản nào hiển thị tới mắt người dùng (tiếng Việt hay tiếng Anh) xuất hiện trực tiếp trong file `.tsx` đều bị coi là **VI PHẠM QUY CHUẨN**.

1. **100% sử dụng hook `useTranslation()`**:
   - Tất cả tiêu đề (`h1`-`h6`), đoạn văn (`p`), nhãn form (`label`), placeholder, nút bấm (`button`), tiêu đề cột bảng (`th`), thông báo lỗi, thông báo rỗng (`empty state`), modal confirm, tooltip đều phải lấy qua:
     ```tsx
     const { t: translate } = useTranslation('dashboard')
     // Sử dụng:
     <h1>{translate('role.section.title')}</h1>
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
   - Tab keys dùng chung cấp role có thể ở `<role>/enums.ts`; status và mã nghiệp vụ của từng chức năng đặt trong `<sub-feature>/enums/` theo mục 11.
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
│   └── enums/               # Mỗi status/mã nghiệp vụ một file riêng khi chức năng có dữ liệu tương ứng
│       └── <domain>-status.ts
│
├── <sub-feature-B>/         # Phân hệ nghiệp vụ B
│   ├── views/
│   ├── components/
│   ├── hooks/
│   └── enums/
│       └── <domain>-status.ts
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
   - `overview/`: Tiến độ khởi tạo, số liệu API, cảnh báo gom theo phòng, checklist mở rộng và tình trạng người giữ vai Super Admin từ BE. Không tính bước `NOT_AVAILABLE` vào tiến độ; thao tác theo cảnh báo phải mở đúng đối tượng qua URL, không thêm dãy nút điều hướng trùng sidebar.
   - `accounts/`: Tài khoản đăng nhập, lời mời, khóa/mở, vai trực tiếp, trách nhiệm phê duyệt và bàn giao Super Admin.
   - `departments/`: Quản lý danh sách phòng ban, chỉ số thống kê và quản lý người phụ trách.
   - `personnel/`: Hồ sơ chính thức, import hai bước, nghỉ dài hạn, nghỉ việc và thông báo BM-09.
   - `reminders/`: Đọc, sửa và xem lịch sử tham số vận hành theo danh sách key của BE.
   - `audit/`: Nhật ký kiểm toán hệ thống (Audit Trail).
   - `transfer/`: Ghi, đổi lịch, hủy sự kiện điều chuyển phòng ban.
   - `settings/`: Lịch nghỉ và tiền tệ báo cáo.
   - `operations/`: Chờ cấu hình, bước tắc nghẽn và ghi nhận sự cố.
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

- Route dashboard import `DashboardEntry`; component này lazy-load `DashboardPage` và phải nằm bên trong `RoleGuard` để không tải workspace trước khi xác thực/phân quyền. Không import trực tiếp `DashboardPage` vào route.
- Giữ timeout mặc định của HTTP client (15 giây/request). Query `/me` dùng cho login/khôi phục phiên không tự retry, dùng `networkMode: 'always'` để không pause vô hạn khi browser offline; lỗi mạng giữ token để người dùng thử lại. Không biến màn hình kiểm tra phiên thành trạng thái chờ vô hạn.
- Tailwind chỉ dò class trong `app/`. Không mở rộng quét về root chứa tài liệu, skill và cache; UI ngoài `app/` cần khai báo `@source` cụ thể.

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
- [ ] **Kiểm tra i18n**: Rà soát kỹ lưỡng, đảm bảo 100% text giao diện hiển thị đều dùng hàm dịch (đặt alias rõ nghĩa như `translate('key')`), không hardcode tiếng Việt hay tiếng Anh. Các key mới đã được khai báo ở cả `vi` và `en`.
- [ ] **Kiểm tra cấu trúc Role**: File view đặt đúng trong `views/`, component con trong `components/`, hook trong `hooks/`; status/mã nghiệp vụ của chức năng có file riêng trong `enums/`, tab key cấp role có thể ở `<role>/enums.ts`.
- [ ] **Kiểm tra Bảo mật Route**: Mọi route dashboard phải bọc qua `RoleGuard`.
- [ ] **Kiểm tra tích hợp BE**: Đối chiếu OpenAPI và kiểu sinh ra; không giữ fixture, `Date.now()` hoặc thay đổi state cục bộ như kết quả ghi dữ liệu thật. Kiểm tra quyền thao tác, query key, phân trang, lọc, cập nhật cache và các trạng thái loading/error/empty/success.
- [ ] **Kiểm tra code clean & hiệu năng**: Tên biến diễn đạt ý nghĩa; không lặp logic; không tạo abstraction chỉ dùng một lần; kiểm tra chi phí render, request trùng, dữ liệu lớn và cleanup tác vụ bất đồng bộ.
- [ ] **Kiểm tra tương tác bất đồng bộ**: Nút gửi/ghi/xóa/xuất dữ liệu có trạng thái pending, chặn thao tác lặp, có chỉ báo loading dễ nhận biết và phản hồi lỗi/thành công đúng kết quả BE.
- [ ] **Kiểm tra UI/UX Design System**: Bắt buộc tuân thủ toàn diện các quy chuẩn trong [UI_UX_DESIGN_GUIDELINES.md](file:///c:/fe_capstone/FE-dev-main/UI_UX_DESIGN_GUIDELINES.md): duy nhất 1 Primary CTA trên một viewport, số/tiền/ngày căn phải (`text-right tabular-nums font-mono`), không văn mẫu AI, không dùng Emoji làm icon, bo góc đồng tâm ($R_{\text{in}} = R_{\text{out}} - P$), khóa khung App Shell (`h-screen overflow-hidden`) và chuyển đổi responsive Card Stack trên mobile.
- [ ] **Chạy Typecheck**: Chạy `pnpm typecheck` thành công với **0 lỗi TypeScript**.
- [ ] **Chạy Unit Test**: Chạy `pnpm vitest run <path-to-test>` đảm bảo toàn bộ test case liên quan đều **Passed (100%)**.
- [ ] **Đồng bộ tài liệu**: Cập nhật thay đổi kiến trúc vào `ARCHITECTURE.md` và `AGENTS.md` bằng tiếng Việt rõ ràng.

---

## 10. Trạng thái hiện tại và nguyên tắc chuyển từ UI mẫu sang BE

**Manager (31/10/2026):** `ManagerScreen` dùng API generated cho duyệt nhu cầu/nhóm, trình lô, gửi hộ, phòng/công cụ, ngân sách năm, điều chuyển, BM-09, bàn giao và thông báo. Public barrel không export fixture/preview. Không có hàng đợi NEED, lịch sử đầy đủ, usage/ghost seats hay rà soát định kỳ; không bù bằng API đặc quyền. `/me` không có ID phòng, roster không có ID nhân viên: dùng ID chính thức hoặc picker được phép. Ngân sách dùng form route riêng và không đọc số còn lại. Ma trận, giới hạn và kiểm chứng: `docs/manager-api-integration.md`. Đoạn mô tả các role còn preview bên dưới áp dụng IT Admin/Finance/Spending Approver và các source preview đã cô lập.

- Nhãn màn trình lô Manager là **Gửi đề nghị chi** (EN: **Submit spending requests**), dùng chung cho sidebar/header; nhãn chờ gửi ở tổng quan/trạng thái/timeline Employee đồng bộ. Đây là gửi yêu cầu phần mềm lên xét chi, tách khỏi lập ngân sách năm và hành động của Người duyệt chi; giữ tab `weekly-batch` và enum/API hiện có.

- UI Manager giữ chất lượng bố cục tương đương Super Admin: dùng header/section/bảng responsive và empty state theo nghiệp vụ. Tổng số lấy từ server, không đếm một trang hay thay lỗi bằng số 0. BM-09 đặt trong Nhân sự phòng ban, không tạo mục thông báo riêng; thông báo nhận mở ở chuông bằng drawer và không đổi trang dữ liệu đang xem. `ManagerScreen` điều phối các slice; không import chéo giữa team, personnel-notices và notifications.

- Danh sách Manager: bỏ khối quy trình duyệt; tìm ID trên bảng yêu cầu. Owner chọn giữ bảng chờ API hàng đợi NEED, ghi rõ thiếu API và khóa phân trang, không dùng thông báo/spend queue giả hàng đợi. Nhân sự/công cụ dùng paging BE khi không tìm kiếm; khi tìm phải đọc đủ trang qua generated client trước khi lọc và phân trang, không lọc riêng trang đang xem hoặc hiển thị kết quả thiếu khi tải lỗi. Ngân sách Manager chưa hỗ trợ file/ngày bắt đầu chu kỳ; import phiên bản chỉ dành Finance. Chi tiết contract/yêu cầu BE: `docs/manager-list-budget-api-audit.md`.

- Form yêu cầu nhóm/gửi hộ Manager dùng dropdown tên/email từ `groupRequestCandidateList`, không nhập ID người. Nhóm chọn tối đa 10; giao diện gửi hộ cá nhân chọn một người. Search/paging trong picker là state cục bộ; giữ lựa chọn và nhãn qua các trang. Owner chọn dropdown gói chờ API danh mục (`API-GAP-02`), không dùng danh sách công cụ đang cấp thay danh mục hoặc gọi `/plans` đặc quyền. Gói IT chia sẻ qua URL có thể thành lựa chọn để giữ luồng nhận gói chính thức; ID chỉ nằm trong payload, BE vẫn kiểm quyền/eligibility. Xem `docs/manager-api-integration.md`.

**Hiện trạng (31/10/2026):** Auth, Super Admin và các luồng Employee có contract đã dùng API generated. Employee đi qua `EmployeeScreen`; public barrel không export preview/fixture cũ. Orval bổ sung access-requests, group-requests, return-requests, notifications, saas-issues, handover-duties và assignment-expiry. Xem ma trận operation và phần còn thiếu tại `docs/employee-api-integration.md`. Các role còn lại vẫn có fixture/`INITIAL_*`; không mô tả chúng là đã tích hợp BE. Super Admin không còn `super-admin-data.ts`, enum demo, định danh workstation hoặc mô phỏng gửi nhắc.

- Employee không có API duyệt danh mục, lịch sử toàn bộ đơn hoặc toàn bộ assignment: dùng mã gói chính thức từ IT, theo dõi đơn theo ID và danh sách nhắc hết hạn riêng; không gọi API đặc quyền của IT/Finance. Không dựng usage, khóa license hay file export giả. `selfServiceOnly` chặn các slice gửi đơn/báo lỗi trước khi mount query.
- UI Employee và Manager dùng các primitive `Workspace*` tại `app/shared/ui/`; wrapper của mỗi role sở hữu bản dịch và không import chéo role. Giữ bảng responsive có nhãn, trạng thái rỗng theo nghiệp vụ và phân trang BE. Tổng quan Employee chỉ dùng tổng bản nháp/bàn giao được BE báo; không suy ra số quyền sử dụng hoặc usage. Chuông Employee vẫn là toast tại header, không tạo trang/mục thông báo riêng khi chỉnh UI.
- Các enum của luồng Employee lấy từ generated DTO trong thư mục `enums/` theo slice; trạng thái Request chung nằm tại `entities/request/enums`. Không dùng enum demo cũ cho payload mới. Tiền định dạng từ chuỗi thập phân qua `shared/lib/format-decimal-money.ts` để không mất độ chính xác.
- Thông báo Employee chỉ qua chuông header: nhấn để hiện một toast từ thông báo chưa đọc và cập nhật số đếm sau API ghi nhận đã đọc. Không tạo trang/tab, mục sidebar hoặc lối tắt tổng quan riêng cho thông báo.

- Super Admin phân biệt `status = ACTIVE | LOCKED` và `activationState = INVITED | ACTIVATED`. Vai trực tiếp do API quản lý; `MANAGER` suy ra từ trưởng phòng và `SPENDING_APPROVER` suy ra từ trách nhiệm phê duyệt. Chuyển giao Super Admin đi qua endpoint riêng, sau đó đọc lại `/me`; auth đồng bộ quyền khi query `/me` cập nhật thành công.
- `super-admin/shared/` chứa form, tra cứu nhân viên/phòng, phân trang, trạng thái tải và phản hồi mutation dùng chung giữa các slice; không import component của slice khác. Mutation nhân sự invalidate các danh sách, chi tiết đã cache, checklist/watch và nguồn chọn nhân viên bị ảnh hưởng. Lỗi ghi không rõ kết quả phải đọc lại dữ liệu; chỉ xác nhận import dùng lại idempotency key cho cùng ý định.
- Không có API danh bạ nhân viên toàn cục: dùng thành viên phòng phân trang, tài khoản phân trang và `accountCandidatesList(search)` (không phân trang) cho picker; giữ nhập mã định danh chính thức khi không có bản ghi có thể chọn. Không tự dựng endpoint, không tải trang đầu rồi coi là toàn bộ danh bạ.

Khi nối một chức năng với BE, agent phải đi theo luồng sau:

1. **Chốt contract trước**: Xác nhận endpoint, request/response, status, mã lỗi, quyền, phân trang/lọc/sắp xếp với OpenAPI do BE cung cấp. Nếu chưa có contract, ghi rõ phần còn thiếu và chỉ xây UI preview hoặc test fixture; không tự đoán response/status hay tạo API giả trong production. Sửa `openapi/openapi.yaml` theo contract đã xác nhận, chạy `pnpm api:validate` và `pnpm api:generate`; không sửa tay generated code.
2. **Tách dữ liệu theo ranh giới**: Generated type/hook là nguồn sự thật cho DTO. Feature hook điều phối query/mutation, tham số URL, chuyển DTO thành view model khi cần; component chỉ nhận dữ liệu và callback có kiểu rõ ràng. Mapper chỉ tồn tại khi có khác biệt thực tế giữa DTO và UI; không tạo repository/wrapper một dòng cho mọi endpoint.
3. **Một nguồn dữ liệu cho mỗi loại state**: Server state ở TanStack Query; bộ lọc/phân trang có thể chia sẻ bằng URL; form draft và dialog state ở local state. Không copy nguyên kết quả query vào `useState` rồi duy trì hai bản dữ liệu. Query key phải chứa mọi tham số ảnh hưởng kết quả; mutation chỉ invalidate hoặc cập nhật đúng các key liên quan sau khi BE xác nhận thành công.
4. **Mỗi màn hình có các trạng thái hoàn chỉnh**: initial loading, refetching khi cần, empty, error có retry phù hợp, success và thiếu quyền. Không dùng danh sách giả thay cho response lỗi/rỗng. Giữ dữ liệu cũ trong lúc đổi trang/lọc chỉ khi UX cho phép và phải báo rõ đang tải dữ liệu mới.
5. **Không tự quyết nghiệp vụ trên client**: BE cấp ID, timestamp, status cuối cùng và xác nhận quyền. Không dùng `Date.now()`, `Math.random()` hay sửa mảng local để giả làm kết quả create/update/delete. Client validation hỗ trợ UX; BE validation và authorization mới quyết định kết quả.

## 11. Quy chuẩn status, enum và kiểu dữ liệu

- **Mỗi chức năng có status hoặc mã nghiệp vụ từ BE phải có thư mục `enums/` riêng**, mỗi khái niệm một file rõ tên, ví dụ `accounts/enums/account-status.ts`, `accounts/enums/device-tracking-status.ts`, `team-requests/enums/request-status.ts`. Chức năng không có status/mã nghiệp vụ thì không tạo thư mục rỗng. `enums.ts` ở cấp role chỉ giữ tab key hoặc cấu hình chung đã tồn tại; code mới không tiếp tục gom status của nhiều chức năng vào đó.
- File status chứa tập mã được contract xác nhận và type tương ứng; ưu tiên `as const`/literal union tương thích với kiểu OpenAPI generated. Không nhân bản một union thủ công ở `*-data.ts`, `enums.ts` và component. Nếu status là khái niệm dùng chung giữa nhiều role, đặt nguồn định nghĩa ở `app/entities/<domain>/enums/` rồi import theo chiều phụ thuộc; không sao chép mỗi role một bản.
- Dùng mã status cho so sánh, filter, mutation payload và cache; dùng i18n cho nhãn hiển thị. Không so sánh theo text đã dịch, không trộn status của BE với trạng thái giao diện như `ALL`, `loading` hoặc tab key. Filter `ALL` là lựa chọn UI riêng, không gửi lên BE nếu contract không định nghĩa.
- Xử lý status BE không nhận diện theo chính sách rõ ràng: không ép kiểu tùy tiện hoặc mặc định về `ACTIVE`/`APPROVED`; hiển thị nhãn fallback an toàn, ghi nhận lỗi contract nếu có cơ chế logging và chặn thao tác phụ thuộc vào status chưa biết. Khi BE thêm status mới, cập nhật contract, mapping nhãn và kiểm thử các nhánh ảnh hưởng.

```ts
// accounts/enums/account-status.ts: mã phải khớp OpenAPI; không dùng làm nhãn UI.
export const ACCOUNT_STATUS = {
  ACTIVE: 'ACTIVE',
  INVITED: 'INVITED',
  LOCKED: 'LOCKED',
  DEACTIVATED: 'DEACTIVATED'
} as const

export type AccountStatus = (typeof ACCOUNT_STATUS)[keyof typeof ACCOUNT_STATUS]
```

## 12. Code clean, tái sử dụng và khả năng mở rộng

1. **Tên đọc vào hiểu ý nghĩa**: Dùng `account`, `previousAccounts`, `requestStatus`, `submitEvent`, `error` thay cho tên một chữ cái như `a`, `d`, `e`, `s`, `t` hoặc tên mơ hồ như `prev`, `data`. Quy tắc áp dụng cả callback `map/filter`, event handler, state, props và tham số hàm. Với i18n, đặt alias `const { t: translate } = useTranslation(...)` trong code mới để tránh biến `t`; khi sửa code cũ thì đổi tên trong phạm vi liên quan. Không dùng tên viết tắt nếu người đọc phải đoán ý nghĩa.
2. **Hàm và component có một nhiệm vụ rõ**: Tách xử lý dữ liệu, validate, side effect và JSX khi chúng thay đổi vì các lý do khác nhau. Tránh hook trả về hàng chục setter hoặc component gánh nhiều workflow; chia theo luồng có tên rõ, input/output có type. Không tách file chỉ để đạt số dòng nếu làm khó theo dõi luồng dữ liệu.
3. **Tái sử dụng theo nhu cầu có thật**: Logic chung giữa hai chức năng cùng role đặt ở `<role>/shared/`; domain chung giữa role đặt ở `entities/`; primitive không có nghiệp vụ đặt ở `shared/`. Trích xuất hook/helper khi có ít nhất hai nơi dùng hoặc một luồng đủ phức tạp cần kiểm thử/tách trách nhiệm. Không tạo “generic hook” với nhiều cờ boolean, callback tùy ý hoặc abstraction che mất nghiệp vụ.
4. **Hook linh động bằng đầu vào rõ ràng**: Hook danh sách nhận filter, page, sort hoặc options có type; không hardcode role, ID, trang đầu tiên, kích thước trang hay endpoint vào hook có ý định dùng lại. Tách hook query, mutation và UI state khi lifecycle khác nhau. Hook phải trả trạng thái và hành động có tên cụ thể, không để component biết chi tiết request/cache.
5. **Loại bỏ magic value và trùng lặp**: Mã status, giới hạn nghiệp vụ, query key, thông điệp lỗi và route quan trọng có nguồn định nghĩa phù hợp; không rải string/number trong nhiều view. Không đưa mọi literal vào `enums/`: cấu hình UI, constant số và type có trách nhiệm riêng. Đặt type ở gần nơi sở hữu, ưu tiên kiểu suy ra từ contract, tránh `any`, non-null assertion và type cast để che dữ liệu chưa được kiểm tra.
6. **Đọc và sửa dễ**: Ưu tiên early return, điều kiện có tên, hàm thuần cho tính toán, props cụ thể và thứ tự code nhất quán. Xóa dead code, comment mô tả _lý do_ thay vì thuật lại từng dòng; không để handler demo giả vờ đã lưu dữ liệu. Mỗi thay đổi chỉ refactor phần liên quan, tránh mở rộng phạm vi không cần thiết.

## 13. Hiệu năng và tương tác bất đồng bộ

- **Đo trước khi tối ưu**: Kiểm tra request waterfall, số lần render, kích thước danh sách và bundle khi có dấu hiệu chậm. Không dùng `useMemo`, `useCallback`, `React.memo` đại trà; chỉ dùng khi phép tính tốn kém, identity ảnh hưởng component con hoặc profiling chứng minh lợi ích. Không tạo state cho giá trị có thể suy ra rẻ từ props/query.
- **Giới hạn dữ liệu và request**: Danh sách lớn dùng phân trang/lọc/sắp xếp từ BE khi contract hỗ trợ; không tải toàn bộ rồi lọc trên client như dữ liệu mẫu. Search tự động cần debounce hợp lý, hủy/loại bỏ kết quả request cũ theo cơ chế của Query và giữ query key chính xác. Dùng lazy loading cho màn hình/biểu đồ nặng khi đo thấy có ích; tránh render hoặc fetch phần không nhìn thấy mà không cần thiết.
- **Chặn thao tác lặp trong lúc mutation**: Với create/update/delete/approve/export bất đồng bộ, dùng `isPending` của mutation hoặc trạng thái pending riêng theo từng hành động. Disable nút và các thao tác xung đột, không gửi request thứ hai khi request đầu chưa hoàn tất. Không khóa toàn màn hình nếu chỉ một hàng đang xử lý. Chỉ đóng dialog/reset form và báo thành công sau response thành công; khi lỗi giữ dữ liệu người dùng đã nhập và cho retry.
- **Hiển thị tiến trình dễ nhận biết**: Nút đang chạy có spinner hoặc biểu tượng loading kèm nhãn i18n phù hợp, `disabled`, `aria-busy` hoặc status thông báo phù hợp với accessibility; không chỉ đổi màu. Initial loading dùng skeleton/progress tương ứng; refetch không làm màn hình nhấp nháy hoặc xóa dữ liệu đang có nếu không cần. Các tác vụ dài có trạng thái theo BE, không giả lập hoàn tất bằng timer.
- **Dọn dẹp và an toàn dữ liệu**: Cleanup timer/subscription và request ngoài Query khi unmount; tránh set state sau tác vụ không còn hiệu lực. Dùng key ổn định cho list, không dùng index khi thứ tự có thể đổi. Với CSV/file export, xử lý escaping, dữ liệu lớn và quyền tải theo nguồn BE; không báo “xuất thành công” trước khi file được tạo/tải thành công.

## 14. Kiểm thử cho luồng dữ liệu thật

- Test mapper/status và fallback cho mã không biết; test hook hoặc component với các trạng thái loading, empty, error/retry, success và mutation pending để xác nhận chặn double submit.
- Dùng MSW cho hành vi request/cache/invalidation khi có API; fixture có type chỉ dùng trong test hoặc preview được ghi nhãn. Không dùng test chỉ lặp lại implementation; ưu tiên hành vi người dùng và contract có rủi ro.
- Sau khi nối BE, chạy `pnpm api:validate`, `pnpm api:generate` nếu contract đổi, test liên quan, `pnpm typecheck` và `pnpm check` trước khi bàn giao. Nêu rõ phần nào vẫn là UI preview, endpoint nào còn thiếu và mọi kiểm tra chưa chạy được.

---

## 15. Quy chuẩn Thiết kế Giao diện & Ràng buộc UI/UX Chống lỗi AI (UI/UX Guardrails)

Mọi component và trang giao diện trong dự án **BẮT BUỘC** phải tuân thủ hướng dẫn chi tiết tại [UI_UX_DESIGN_GUIDELINES.md](file:///c:/fe_capstone/FE-dev-main/UI_UX_DESIGN_GUIDELINES.md). Dưới đây là 8 nguyên tắc cốt lõi:

1. **Khóa khung App Shell**: Toàn bộ ứng dụng chạy trên layout khóa màn hình (`h-screen overflow-hidden flex`). Chỉ vùng nội dung `main` được cuộn dọc (`overflow-y-auto`). Cấm để body cuộn tự do làm xô lệch Header và Sidebar.
2. **Đơn nhất Primary CTA**: Trên mỗi màn hình/modal chỉ có duy nhất 1 nút hành động chính (`bg-primary text-primary-foreground`). Các nút còn lại bắt buộc dùng `variant="outline"` hoặc `ghost`. Cấm spam 3 nút [Sửa][Xóa][Chi tiết] trên từng dòng bảng; phải gom vào nút `...` (Dropdown Menu).
3. **Căn lề dữ liệu nghiêm ngặt**:
   - Chữ, tên, mô tả: `text-left`.
   - Số lượng, giá tiền, ngày tháng, mã ID: `text-right tabular-nums font-mono`.
   - Cột hành động: Ghim sát lề phải (`text-right sticky right-0`).
   - Mọi chuỗi văn bản biến thiên phải bọc `truncate` kèm `title={...}` để không làm vỡ grid.
4. **Bố cục Form khoa học**: Không tạo form 1 cột kéo dài 800px vô lý. Gom nhóm các trường liên quan thành hàng 2 cột (`grid-cols-2`). Form ngắn (1-3 trường) dùng Modal; Form trung bình (4-10 trường) dùng Slide-over Drawer mép phải; Quy trình dài (> 10 trường) chuyển thành sub-route chuyên biệt.
5. **Bo góc đồng tâm & Nguồn sáng tự nhiên**:
   - Bán kính góc trong phải tuân thủ công thức $R_{\text{inner}} = R_{\text{outer}} - \text{Padding}$. Cấm đặt `rounded-xl` cho cả cha lẫn con.
   - Hạn chế `rounded-full` (chỉ dùng cho Avatar và micro-badge). Ưu tiên chuẩn B2B sắc nét: `rounded-md` (6px) hoặc `rounded-lg` (8px).
   - Dùng nguồn sáng từ trên xuống với viền trên sáng hơn nhẹ hoặc highlight mờ; đường viền dùng alpha (`border-black/[0.08]` hoặc `border-white/[0.12]`), cấm dùng mã HEX chết.
6. **Chống rung giật tương tác (Zero Layout Shift)**:
   - Cấm đổi từ `border-1` sang `border-2` hoặc đổi font chữ khi hover. Giữ nguyên kích thước pixel và chỉ đổi màu nền/màu viền nhẹ nhàng (`hover:bg-surface-subtle transition-colors duration-150`).
   - Cấm dùng `hover:scale-105` làm rung lắc thẻ dữ liệu.
7. **Xóa sổ Văn mẫu AI & Chuẩn hóa Icon**:
   - Cấm tuyệt đối các từ vựng AI sáo rỗng: "Unleash", "Elevate", "Seamless", "Supercharge", "Next-Gen", "Dive in" và cấm dấu chấm than (!) ở tiêu đề/thông báo.
   - Cấm viết các đoạn mô tả dài dòng, thừa thãi dưới tiêu đề rõ nghĩa.
   - 100% icon dùng `lucide-react` đồng nhất `strokeWidth={1.5}`. Cấm tuyệt đối dùng Emoji (🚀, 🔥, 💡) làm icon chức năng.
8. **Responsive Mobile chuẩn mực**:
   - Dưới màn hình `md`, bảng biểu lớn tự động chuyển đổi thành Card Stack (`md:hidden`) hoặc cuộn ngang an toàn.
   - Kích thước vùng bấm tối thiểu 44x44px trên mobile. Ô nhập liệu khai báo `text-base md:text-sm` để ngăn chặn hiện tượng tự động zoom trên iOS Safari.
