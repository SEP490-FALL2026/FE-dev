# Kiến trúc frontend SaaS-Sentry

Tài liệu này giúp lập trình viên và AI agent xác định ứng dụng chạy như thế nào, mã nguồn nằm ở đâu và phải tuân thủ ranh giới nào khi sửa hoặc thêm chức năng. Nội dung được đối chiếu với mã nguồn và cấu hình trong repository ngày 31/10/2026.

Phần mô tả hiện trạng phản ánh code đang có; phần quy tắc hướng dẫn code mới. Những chỗ code cũ chưa tuân thủ được ghi riêng ở mục 12, không được xem là mẫu để tiếp tục mở rộng.

## 1. Phạm vi và cách đọc tài liệu

SaaS-Sentry là ứng dụng quản trị phần mềm SaaS, bản quyền, cấp phát, phê duyệt và chi phí công nghệ. Frontend là một ứng dụng React dùng chung cho sáu vai trò. Backend NestJS cung cấp REST API và quyết định xác thực, quyền truy cập, trạng thái nghiệp vụ, số liệu tài chính và lưu trữ.

| Tài liệu hoặc cấu hình                                                           | Trách nhiệm                                                             |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [ARCHITECTURE.md](ARCHITECTURE.md)                                               | Cấu trúc mã nguồn, luồng thực thi, trách nhiệm các tầng và cách mở rộng |
| [AGENTS.md](AGENTS.md)                                                           | Quy tắc làm việc và điều kiện bàn giao bắt buộc cho agent               |
| [UI_UX_DESIGN_GUIDELINES.md](UI_UX_DESIGN_GUIDELINES.md)                         | Quy chuẩn bố cục, tương tác, khả năng tiếp cận và thiết kế giao diện    |
| [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)                                       | Bối cảnh và phạm vi nghiệp vụ                                           |
| [package.json](package.json), [pnpm-lock.yaml](pnpm-lock.yaml)                   | Thư viện, lệnh thực thi và phiên bản được khóa                          |
| [openapi/openapi.yaml](openapi/openapi.yaml), [orval.config.ts](orval.config.ts) | Bản chụp hợp đồng API và cấu hình sinh client                           |

Khi làm việc, đọc tài liệu kiến trúc cùng `AGENTS.md`, sau đó kiểm tra trực tiếp các file liên quan. Khi tài liệu và code khác nhau, xác minh từ cấu hình, contract và kiểm thử; không tự dựng thư mục, endpoint hoặc hành vi theo mô tả cũ. `AGENTS.md`, `ARCHITECTURE.md` và `UI_UX_DESIGN_GUIDELINES.md` là tài liệu được bảo vệ theo mục 0 của `AGENTS.md`: khi code chức năng, không tự cập nhật các file này. Nếu cần thay đổi, báo rõ lý do và nội dung đề xuất, chờ người dùng cho phép trước khi sửa.

## 2. Công nghệ đang sử dụng

Các phiên bản dưới đây là dòng phiên bản khai báo trong `package.json`; phiên bản cài đặt cụ thể được khóa trong `pnpm-lock.yaml`.

| Nhóm                    | Thư viện hoặc công cụ                  | Vai trò trong dự án                                                        |
| ----------------------- | -------------------------------------- | -------------------------------------------------------------------------- |
| Giao diện               | React 19.2, React DOM 19.2             | Component, hook và kết xuất giao diện                                      |
| Điều hướng              | React Router 7.18, `@react-router/dev` | Chế độ framework, module route có kiểu, metadata và tách mã theo route     |
| Biên dịch               | Vite 8, TypeScript 5.9                 | Máy chủ phát triển, đóng gói và kiểm tra kiểu ở chế độ `strict`            |
| Giao diện và biểu tượng | Tailwind CSS 4.2, Lucide React         | Lớp CSS tiện ích, biến giao diện và biểu tượng                             |
| Chuyển động và biểu đồ  | Motion 13.4, Recharts 3.10             | Hiệu ứng tương tác và biểu đồ                                              |
| Dữ liệu từ máy chủ      | TanStack Query 5.101                   | Truy vấn, bộ nhớ đệm, mutation và đồng bộ dữ liệu                          |
| HTTP và sinh client     | Axios 1.21, Orval 8.24                 | HTTP client dùng chung; sinh DTO, hàm gọi API và hook từ OpenAPI           |
| Ngôn ngữ                | i18next 26.3, react-i18next 17         | Tài nguyên tiếng Việt/Anh và hook dịch                                     |
| Thông báo               | Sonner 2                               | Toast dùng chung toàn ứng dụng                                             |
| Kiểm thử                | Vitest 4.1, Testing Library, jsdom     | Kiểm thử hàm, hook và hành vi component                                    |
| Công cụ hỗ trợ kiểm thử | MSW 2, Faker 10                        | Có trong dependency phát triển; Orval hiện chưa cấu hình sinh mock/factory |
| Chất lượng mã           | ESLint 10, Prettier 3.9                | Kiểm tra quy tắc và định dạng                                              |
| Quản lý gói             | pnpm 10.34.5                           | Cài đặt và chạy lệnh theo `packageManager`                                 |
| Triển khai              | `@vercel/react-router`, Docker, Nginx  | Hai phương án triển khai cùng đầu ra SPA                                   |

Form và trạng thái giao diện hiện dùng hook React; repository chưa khai báo Redux, Zustand, React Hook Form hoặc một bộ component như Ant Design/MUI. Agent ưu tiên công cụ hiện có, chỉ bổ sung dependency khi yêu cầu thực tế cần đến.

## 3. Cấu trúc repository và trách nhiệm

Mã nguồn ứng dụng nằm trong `app/`, không có thư mục `src/`.

```text
app/
├── root.tsx                      # Khung tài liệu HTML, provider, Outlet và xử lý lỗi route
├── routes.ts                     # Danh sách URL và module route
├── routes/                       # Module route mỏng
├── providers/app-providers.tsx   # Ghép i18n, theme, Query và khởi tạo auth
├── assets/                       # Tài nguyên được import để Vite đóng gói
├── features/
│   ├── home/                     # Trang giới thiệu
│   ├── not-found/                # Trang không tìm thấy
│   ├── auth/                     # Đăng nhập, khôi phục phiên, mật khẩu và kiểm tra quyền
│   └── dashboard/                # Khung dashboard và chức năng theo vai trò
├── entities/
│   ├── user-role/                # Kiểu vai trò và kiểm tra mã vai trò
│   ├── user/                     # Kiểu, avatar và dữ liệu nhân sự mẫu
│   ├── request/                  # Thành phần và dữ liệu yêu cầu mẫu
│   ├── software/                 # Thành phần trình bày phần mềm
│   └── license/                  # Dữ liệu cấp phát, rà soát và bản quyền mẫu
├── shared/
│   ├── api/                      # Query client, Axios, mutator và client được sinh
│   ├── config/env.ts             # Đọc, kiểm tra cấu hình API công khai
│   ├── i18n/                     # Khởi tạo ngôn ngữ, đăng ký tài nguyên và bản dịch
│   ├── theme/                    # Trạng thái sáng/tối và lưu lựa chọn
│   ├── ui/                       # Toaster, chuyển ngôn ngữ/theme, trạng thái tải, thương hiệu
│   └── lib/                      # Tiện ích như CSV và tiêu đề trang
└── app.css                       # Tailwind, biến màu, giao diện sáng/tối và CSS chung

openapi/openapi.yaml              # Bản chụp hợp đồng API để kiểm tra và sinh client
test/setup.ts                     # Thiết lập kiểm thử component
eslint-rules/                     # Quy tắc ESLint riêng và kiểm thử của quy tắc
scripts/                         # Kiểm tra OpenAPI và công cụ hỗ trợ
patches/                         # Bản vá dependency được khai báo cho pnpm
public/                          # Tài nguyên tĩnh phục vụ trực tiếp
docs/                            # Tài liệu thiết kế và kế hoạch; không phải mã chạy
```

Alias `~/` trỏ tới `app/`, được khai báo trong [tsconfig.json](tsconfig.json) và được Vite/Vitest đọc qua `tsconfigPaths`. Thư mục `.react-router/` chứa kiểu được sinh; `build/` chứa đầu ra build. Không sửa tay các đầu ra này.

### Ranh giới phụ thuộc

```text
root.tsx / providers              -> Ghép các thành phần cấp ứng dụng
routes                           -> features, entities, shared
features                         -> entities, shared
entities                         -> shared
shared                           -> Thư viện bên ngoài và module cùng tầng
```

- Route nhận tham số, đặt metadata và nối đến giao diện; nghiệp vụ và JSX của màn hình đặt trong feature.
- `shared/` không import ngược từ `entities/`, `features/` hoặc `routes/`. `entities/` không phụ thuộc vào feature.
- Hai chức năng trong cùng vai trò chia sẻ qua `<role>/shared/`. Khái niệm nghiệp vụ dùng giữa nhiều vai trò đặt trong `entities/<domain>/`; tiện ích không có nghiệp vụ đặt trong `shared/`.
- Code mới không import nội bộ của vai trò khác hoặc chức năng ngang hàng. Tầng ghép ứng dụng được phép kết nối các feature qua giao diện xuất công khai; ví dụ `AppProviders` khởi tạo auth và dashboard đọc phiên đăng nhập.
- `index.ts` ở gốc mỗi vai trò là điểm xuất công khai cho khung dashboard. Bên trong vai trò dùng import trực tiếp đến module sở hữu, tránh import vòng qua chính `index.ts` của vai trò. Không tạo thêm barrel ở mọi thư mục.

## 4. Luồng khởi tạo và điều hướng

[react-router.config.ts](react-router.config.ts) đặt `ssr: false`. Ứng dụng chạy dưới dạng SPA; không có máy chủ React xử lý nghiệp vụ khi triển khai.

```text
Trình duyệt mở URL
  -> root.tsx: khung HTML, CSS, Outlet, trạng thái tải và lỗi
  -> AppProviders: i18n -> ThemeProvider -> QueryClientProvider
       -> Áp dụng lựa chọn ngôn ngữ
       -> Đăng ký QueryClient cho auth, khôi phục phiên
       -> Gắn một AppToaster dùng chung
  -> Module trong app/routes/
       -> Trang công khai, hoặc RoleGuard cho dashboard
       -> DashboardEntry tải động DashboardPage sau khi qua guard
       -> Khung dashboard chọn màn hình theo role và tab
```

`AppProviders` tạo một `QueryClient` cho vòng đời provider bằng `useState(createQueryClient)`. Không tạo client mới trong mỗi lần render, mỗi trang hoặc mỗi modal.

Danh sách route chính xác nằm ở [app/routes.ts](app/routes.ts):

| URL                                                                            | Điểm xử lý                                                               |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `/`                                                                            | `routes/home.tsx` -> `features/home/`                                    |
| `/login`                                                                       | `routes/login.tsx` -> `features/auth/login-page.tsx`                     |
| `/logout`                                                                      | `routes/logout.tsx` -> `features/auth/logout-page.tsx`                   |
| `/forgot-password`, `/reset-password`, `/activate-account`, `/change-password` | Module route tương ứng -> `features/auth/auth-action-page.tsx`           |
| `/forbidden`                                                                   | `routes/forbidden.tsx` -> `features/auth/views/forbidden-page.tsx`       |
| `/dashboard/super-admin`, `/dashboard/it-admin`, `/dashboard/manager`          | Route vai trò -> `RoleGuard` -> `DashboardEntry`                         |
| `/dashboard/finance`, `/dashboard/spending-approver`, `/dashboard/employee`    | Route vai trò -> `RoleGuard` -> `DashboardEntry`                         |
| `/dashboard/super-admin/personnel/:formMode`                                   | Route biểu mẫu nhân sự, dùng lại guard và khung Super Admin              |
| `/dashboard/:role`                                                             | Kiểm tra mã vai trò; hợp lệ thì qua guard, không hợp lệ thì hiển thị 404 |
| `*`                                                                            | `routes/not-found.tsx` -> `features/not-found/`                          |

### Khung dashboard và tham số URL

[dashboard-page.tsx](app/features/dashboard/dashboard-page.tsx) ghép `DashboardSidebar`, `DashboardHeader` và vùng nội dung. Khung dùng `h-screen overflow-hidden`; vùng `main` và vùng điều hướng quản lý cuộn bên trong.

Phần lớn chức năng là tab trên URL của vai trò, ví dụ `/dashboard/manager?tab=team-requests` hoặc `/dashboard/super-admin?tab=accounts`. Các tham số như `id`, `section`, `from` mang ngữ cảnh chi tiết hoặc quay lại. Mỗi vai trò định nghĩa tab hợp lệ và cấu hình điều hướng trong `*-nav.ts`, cùng `enums.ts` khi có. Tab không hợp lệ trở về `overview`.

Super Admin, Finance và Spending Approver có component điều phối riêng: `SuperAdminScreen`, `FinanceScreen`, `ApprovalScreen`. Các nhánh Employee, Manager và IT Admin hiện được chọn trực tiếp trong `DashboardPage`. Không giả định mỗi vai trò có một layout route riêng.

Khi thêm màn hình, phải nối đủ tab, điều hướng, export và nhánh hiển thị. Có thư mục hoặc export component chưa có nghĩa màn hình đã truy cập được. Biểu mẫu nhân sự là ví dụ hiện có của chức năng dùng URL con thay vì chỉ dùng `tab`.

## 5. Xác thực và phân quyền

[auth-session.ts](app/features/auth/auth-session.ts) sở hữu phiên, token và cơ chế đăng ký thay đổi. Component đọc trạng thái qua `useSyncExternalStore`, `subscribeAuthSession` và `getAuthState`.

```text
Đăng nhập
  -> authLogin(email, password)
  -> Lưu token pair do BE trả về
  -> Query /api/v1/me
  -> Ánh xạ roles.effective thành vai trò frontend
  -> Công bố phiên đã xác thực và điều hướng phù hợp

Mở lại ứng dụng
  -> Khôi phục token đã lưu
  -> Refresh nếu thiếu access token hoặc token sắp hết hạn
  -> Query /api/v1/me
  -> authenticated, guest hoặc unavailable
```

- Token pair và hạn dùng lưu dưới dạng JSON tại `localStorage['saas-sentry.auth-tokens']`. Access token được khôi phục vào bộ nhớ trước khi gọi `/me`. Khi lưu thất bại, code dùng bộ nhớ và refresh token trong `sessionStorage` làm phương án dự phòng; phiên cũ được chuyển sau refresh thành công.
- Vai trò lấy từ `/me`, không suy ra quyền từ nội dung JWT hoặc lựa chọn giao diện. Một tài khoản có thể có nhiều vai trò; guard kiểm tra `session.roles.includes(requiredRole)`. `session.role` là vai trò mặc định.
- Auth có bốn trạng thái: `checking`, `guest`, `authenticated`, `unavailable`. Guard hiển thị tải khi kiểm tra; chưa đăng nhập thì chuyển về `/login?redirectTo=...`; sai quyền thì hiển thị `ForbiddenPage`; lỗi dịch vụ tạm thời có nút thử lại.
- Truy vấn `/me` trong luồng đăng nhập/khôi phục dùng `retry: false`, `staleTime: 0`, `networkMode: 'always'`. Lỗi mạng không được làm chờ vô hạn hoặc mặc định xóa token còn có thể dùng để thử lại.
- `configureAuthQueryClient` theo dõi kết quả `/me` thành công trong cache để đồng bộ lại quyền khi tài khoản hoặc trách nhiệm thay đổi. Xóa phiên đồng thời xóa Query cache để tránh giữ dữ liệu người trước.
- Logout gọi BE để thu hồi phiên rồi mới xóa trạng thái cục bộ. Khi request logout thất bại, giao diện phải xử lý lỗi, không giả định phiên phía BE đã bị thu hồi.

Mọi route dashboard phải đặt `DashboardEntry` bên trong [RoleGuard](app/features/auth/components/role-guard.tsx). Không import trực tiếp `DashboardPage` vào route: bước tải động hiện được đặt sau xác thực và kiểm tra vai trò. Backend vẫn phải kiểm tra quyền cho từng request; guard chỉ kiểm soát giao diện.

## 6. Tổ chức chức năng theo vai trò

Mỗi vai trò nằm tại `app/features/dashboard/<role>/`, được chia theo chức năng nghiệp vụ. Bảng dưới liệt kê thư mục đang có, không khẳng định tất cả đều đã được nối vào menu hoặc API.

| Vai trò trên URL    | Thư mục        | Các nhóm chức năng hiện có                                                                                                                                              |
| ------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `employee`          | `employee/`    | `overview`, `software-request`, `my-software`, `my-requests`, `profile-privacy`                                                                                         |
| `super-admin`       | `super-admin/` | `overview`, `accounts`, `departments`, `personnel`, `reminders`, `audit`, `transfer`, `settings`, `operations`                                                          |
| `manager`           | `manager/`     | `overview`, `team-requests`, `team`, `access-review`, `ghost-seats`, `annual-budget`                                                                                    |
| `spending-approver` | `approvals/`   | `overview`, `queue`, `annual-budget`, `exceptions`, `decisions`                                                                                                         |
| `it-admin`          | `it-admin/`    | `overview`, `provisioning`, `device-collectors`, `dept-catalog`, `optimization`, `shadow-it`, `reconciliation`, `identities`, `renewals`, `offboarding`, `usage-import` |
| `finance`           | `finance/`     | `overview`, `annual-budget`, `budget-allocation`, `budget-questions`, `commitments`, `budget-check`, `period-close`, `cost-optimization`, `spend-import`, `decisions`   |

Cấu trúc cho một chức năng mới:

```text
app/features/dashboard/<role>/
├── <function>/
│   ├── views/<role>-<function>-view.tsx  # Ghép màn hình và nối dữ liệu với giao diện
│   ├── components/                     # Bảng, bộ lọc, biểu mẫu, dialog của chức năng
│   ├── hooks/                          # Điều phối truy vấn, mutation hoặc tương tác phức tạp
│   ├── enums/<domain>-status.ts        # Mã trạng thái đã được contract xác nhận
│   └── <behavior>.test.tsx             # Kiểm thử hành vi, đặt gần chức năng
├── shared/                             # Thành phần thực sự dùng chung trong vai trò
├── <role>-nav.ts                       # Cấu hình điều hướng và kiểm tra tab
├── enums.ts                            # Tab và cấu hình chung cấp vai trò nếu cần
└── index.ts                            # Export công khai có chủ đích
```

Chỉ tạo thư mục khi có nội dung. `views/` ghép màn hình; `components/` trình bày từng phần; `hooks/` tách luồng đủ phức tạp. State đơn giản của một dialog vẫn có thể nằm cạnh component sở hữu, không cần tạo hook chỉ để bọc một `useState`.

Quy tắc cho code viết tay theo `AGENTS.md`: tối đa 500 dòng mỗi file `.ts`/`.tsx`, view giữ dưới 400 dòng, component con dưới 300 dòng; bắt đầu tách khi file tiến gần giới hạn. Tên file dùng `kebab-case`, component dùng `PascalCase`, hook dùng `useCamelCase`. Tên biến và callback phải nêu được ý nghĩa; không tạo abstraction chỉ để chuyển tiếp một lời gọi.

## 7. Dữ liệu, API và bộ nhớ đệm

### Trạng thái tích hợp hiện tại

| Phạm vi                                                           | Nguồn dữ liệu hiện tại                                                                     |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Auth và hồ sơ `/me`                                               | Hàm gọi API và kiểu được Orval sinh                                                        |
| Chức năng Super Admin                                             | Query/mutation được sinh; form, phân trang, mapping lỗi và cache do feature điều phối      |
| Dashboard Employee, Manager, IT Admin, Finance, Spending Approver | Còn dùng dữ liệu mẫu, draft hoặc store trong bộ nhớ; chưa phải tích hợp API nghiệp vụ thật |
| Một số module trong `entities/`                                   | Có các file `*-demo.ts`, `*-preview.ts` phục vụ màn hình mẫu; chưa phải mô hình dữ liệu BE |

Việc tất cả dashboard đều qua auth thật không đồng nghĩa dữ liệu nghiệp vụ của mọi vai trò đã lấy từ BE. Các file `*-data.ts`, `INITIAL_*`, `MOCK_*` và store mô phỏng không được dùng thay cho kết quả request thật khi tích hợp.

### Đường đi của một request

```text
View / feature hook
  -> Hook TanStack Query hoặc operation do Orval sinh
  -> shared/api/mutator/custom-axios.ts
  -> shared/api/axios-client.ts
       -> Token, timeout, xử lý refresh
  -> env.API_BASE_URL + đường dẫn /api/v1/... từ contract
  -> NestJS
  -> Response body -> Query cache -> giao diện
```

- `customAxios` trả `response.data` của Axios, tức toàn bộ body theo contract. Nếu body có trường `data`, feature vẫn phải đọc trường đó; mutator không tự bóc thêm lớp envelope. Lỗi giữ dạng `AxiosError`.
- `axios-client.ts` sở hữu instance HTTP dùng chung, timeout mặc định 15 giây và auth adapter. Feature không tự tạo instance hoặc interceptor riêng.
- Với 401 mang mã `INVALID_ACCESS_TOKEN` hoặc `AUTHENTICATION_REQUIRED`, client dùng chung một lượt refresh đang chạy và thử lại request tối đa một lần. `skipAuth`/`skipAuthRefresh` bảo vệ request auth khỏi gắn token sai hoặc refresh đệ quy. Không refresh cho mọi lỗi 401 một cách tùy tiện.
- `AUTH.SESSION_INVALID` làm mất hiệu lực phiên; lỗi dịch vụ tạm thời được trả về để giao diện xử lý. Không phát toast từ interceptor.
- `query-client.ts` đặt `staleTime: 30_000`, tắt refetch khi focus cửa sổ, thử lại query tối đa một lần cho lỗi mạng hoặc HTTP từ 500, không tự retry mutation. Luồng auth và từng query có thể ghi đè mặc định khi có lý do cụ thể.

### Nguồn sở hữu trạng thái

| Loại trạng thái                                                   | Nơi sở hữu                                             |
| ----------------------------------------------------------------- | ------------------------------------------------------ |
| Dữ liệu BE, trạng thái query/mutation                             | TanStack Query                                         |
| Tab, định danh chi tiết, bộ lọc cần chia sẻ hoặc giữ khi quay lại | URL và hook điều hướng của chức năng                   |
| Draft biểu mẫu, dialog, lựa chọn tạm thời                         | State của component hoặc hook sở hữu                   |
| Phiên và quyền hiệu lực                                           | `auth-session.ts`, được xác nhận qua BE                |
| Ngôn ngữ, giao diện sáng/tối                                      | i18n và ThemeProvider                                  |
| Quyết định ngân sách/tối ưu hóa trong bản mẫu                     | Store mô phỏng hiện có; không phải dữ liệu lưu trên BE |

Không sao chép nguyên kết quả query vào `useState` để duy trì hai bản dữ liệu. Không gọi API trong `useEffect` cho luồng server state. Query key phải chứa tham số ảnh hưởng kết quả; ưu tiên `get...QueryKey` được sinh, tránh tự lặp chuỗi URL.

Mutation phải chặn gửi lặp, báo tiến trình và chỉ xác nhận thành công sau khi BE xác nhận. Khi thành công, cập nhật hoặc invalidate các danh sách, chi tiết, chỉ số và picker bị ảnh hưởng; khi lỗi giữ draft. Với kết quả ghi không rõ ràng, đọc lại dữ liệu theo luồng chức năng. Không dùng thời gian hoặc ID do client tạo để giả làm kết quả ghi thật.

Super Admin có ví dụ dùng lại tại `accounts/hooks/use-super-admin-accounts.ts` và `shared/hooks/use-admin-mutation-feedback.ts`: feature giữ mutation có kiểu cùng phạm vi query key, helper chung xử lý phản hồi và làm mới cache. Không biến helper này thành lớp repository bọc mọi endpoint.

### Hợp đồng và sinh client

[orval.config.ts](orval.config.ts) dùng `client: 'react-query'`, `httpClient: 'axios'`, `mode: 'tags-operations'` và `splitByTags: true`:

```text
Nguồn OpenAPI
  -> Orval lọc tag được khai báo trong cấu hình
  -> app/shared/api/generated/operations/<tag>/<operation>.ts
  -> app/shared/api/generated/model/<tag>/<schema>.ts
```

Model dùng chung có thể nằm ở gốc `model/`. Danh sách tag hiện bao gồm `auth`, `me` và các nhóm API phục vụ Super Admin. Không giả định endpoint mới sẽ được sinh nếu tag chưa nằm trong bộ lọc.

`pnpm api:validate` kiểm tra file `openapi/openapi.yaml` bằng script riêng của repository. Script có nhánh kiểm tra bản export BE và nhánh kiểm tra quy ước tag/tên; đây không phải bộ kiểm tra đầy đủ mọi ràng buộc của chuẩn OpenAPI.

**Orval mặc định đọc bản export trực tiếp** tại `/api/docs-json`, lấy origin từ cấu hình môi trường phát triển. Để sinh đúng từ bản chụp đã review, đặt `ORVAL_OPENAPI_SOURCE` rõ ràng. Trong PowerShell:

```powershell
$env:ORVAL_OPENAPI_SOURCE = './openapi/openapi.yaml'
pnpm api:generate
Remove-Item Env:ORVAL_OPENAPI_SOURCE
```

`api:generate` chạy validate trước rồi gọi Orval. Thư mục đầu ra có `clean: true`; tuyệt đối không đặt code viết tay trong `generated/`. Quy trình thay contract: nhận bản BE đã xác nhận, cập nhật snapshot, validate, sinh lại từ snapshot, sửa feature theo kiểu mới, chạy kiểm tra và review cả contract lẫn đầu ra.

Cấu hình hiện không có sinh MSW handler hoặc Faker factory. Không hướng dẫn import `generated/mocks/` như một thư mục đang tồn tại. Mock và fixture cho kiểm thử phải tách khỏi đường import của code chạy thật.

## 8. Kiểu dữ liệu và mã trạng thái

- DTO, request, response và mã BE lấy từ `shared/api/generated/model/`. View model chỉ tạo khi UI cần hình dạng khác DTO; mapper đặt cạnh chức năng sở hữu.
- Mỗi khái niệm trạng thái của chức năng có file riêng trong `<function>/enums/`; ưu tiên dùng hoặc suy ra từ constant/type được sinh. Ví dụ `accounts/enums/account-status.ts` và `accounts/enums/activation-state.ts` sử dụng hai trường độc lập: `status` và `activationState`.
- `enums.ts` cấp vai trò dành cho tab hoặc cấu hình chung đã có. Không tiếp tục gom mã nghiệp vụ của nhiều chức năng vào một file này.
- Mã trạng thái phục vụ điều kiện, payload và filter; nhãn trạng thái đi qua i18n. Không so sánh bằng text đã dịch, không gửi giá trị giao diện như `ALL` nếu contract không định nghĩa.
- Mã BE chưa nhận diện phải có nhãn dự phòng và chặn hành động phụ thuộc trạng thái chưa biết. Không ép về `ACTIVE`/`APPROVED` hoặc dùng ép kiểu để che sai contract.
- Khi export lại một giá trị vẫn cần dùng trong module, phải import giá trị đó vào phạm vi cục bộ; riêng `export { X } from '...'` không tạo biến `X` để sử dụng trong file.

## 9. Ngôn ngữ và hạ tầng giao diện

### Bản dịch

`shared/i18n/i18n.ts` khởi tạo tiếng Việt để kết quả ban đầu nhất quán. Sau mount, ứng dụng ưu tiên lựa chọn tại `localStorage['saas-sentry.language']`, rồi ngôn ngữ trình duyệt được hỗ trợ. Chuyển ngôn ngữ cập nhật i18next và thuộc tính `<html lang>`.

`shared/i18n/resources.ts` đăng ký namespace; nội dung nằm trong `shared/i18n/locales/vi/` và `shared/i18n/locales/en/`. Một namespace có thể ghép từ nhiều file tài nguyên. Namespace đang có gồm `common`, `auth`, `errors`, `dashboard`, `admin`, `adminAccounts`, `adminOrganization`, `adminPersonnel`, `landing`, `notFound`, `theme`.

- Mọi nhãn tĩnh, placeholder, tooltip, nội dung hỗ trợ tiếp cận và thông báo dùng bản dịch. Code mới dùng alias rõ nghĩa: `const { t: translate } = useTranslation('dashboard')`.
- Thêm hoặc sửa key đồng thời ở VI/EN; dùng key theo ý nghĩa, không lấy câu hiển thị làm key. Namespace mới phải được đăng ký trong `resources.ts`.
- Dữ liệu nghiệp vụ từ API giữ đúng giá trị; mã lỗi BE được ánh xạ thành key ở feature, không hiển thị trực tiếp message kỹ thuật.
- Định dạng ngày, số và tiền bằng `Intl` hoặc helper hiện có như `useDashboardFormat` trong `dashboard-ui.tsx`; dùng đúng locale và đơn vị tiền của dữ liệu.
- ESLint có quy tắc `project/no-hardcoded-ui-text` cho JSX và thuộc tính thông dụng. Quy tắc không bắt được mọi chuỗi trong helper, cấu hình bảng hoặc callback; vẫn phải kiểm tra thủ công.

### Giao diện sáng/tối, thông báo và tài nguyên

`shared/theme/` quản lý hai chế độ `light`/`dark`, lưu lựa chọn tại `saas-sentry.theme` và áp dụng `data-theme` lên phần tử HTML. `app.css` khai báo biến màu và ánh xạ sang token Tailwind. Dùng token hiện có thay vì rải mã màu riêng trong component.

Tailwind chỉ tự dò class trong `app/` nhờ `@import 'tailwindcss' source('./')`. Giao diện mới đặt trong `app/`; khi thật sự cần quét package ngoài, khai báo `@source` cụ thể thay vì mở quét cả repository.

`AppToaster` được gắn một lần trong `AppProviders`, theo theme/ngôn ngữ hiện hành, tự ẩn sau 5 giây và hiển thị tối đa 3 toast. Feature phát toast trong handler hoặc callback mutation sở hữu hành động, dùng ID ổn định khi cần chống trùng. Lỗi tại ô nhập và trạng thái tải/rỗng/lỗi trang vẫn cần hiển thị ở đúng vị trí; toast không thay thế chúng.

Biểu tượng dùng Lucide; chuyển động dùng Motion và tôn trọng reduced motion; biểu đồ dùng Recharts. Ảnh import từ `app/assets/` được Vite đóng gói; tài nguyên trong `public/` được phục vụ theo đường dẫn tĩnh. Chi tiết thiết kế và tương tác tuân theo `UI_UX_DESIGN_GUIDELINES.md`.

## 10. Cấu hình môi trường và triển khai

| Biến hoặc file         | Cách sử dụng                                                                       |
| ---------------------- | ---------------------------------------------------------------------------------- |
| `VITE_API_BASE_URL`    | Bắt buộc; `shared/config/env.ts` kiểm tra không rỗng và bỏ dấu `/` cuối            |
| `API_PROXY_TARGET`     | Dùng trong công cụ Node/Vite để proxy và tìm nguồn OpenAPI; không phải biến client |
| `ORVAL_OPENAPI_SOURCE` | Ghi đè nguồn OpenAPI khi sinh client, ví dụ đường dẫn snapshot cục bộ              |
| `.env.example`         | Mẫu cấu hình có trong repository                                                   |
| `.env`                 | Cấu hình phát triển cục bộ; mẫu dùng `VITE_API_BASE_URL=/backend`                  |
| `.env.product`         | Cấu hình cho `pnpm build`, vì script dùng `--mode product`                         |

Máy chủ phát triển chạy HTTP tại `localhost:5173`, dùng `strictPort: true`. Vite proxy `/backend` tới `API_PROXY_TARGET` và bỏ prefix này; operation đã có `/api/v1`, không tự thêm lần nữa vào base URL.

Biến `VITE_*` được đưa vào bundle lúc build, không chứa secret. Đổi API origin triển khai cần build lại. Bản build dùng URL BE tuyệt đối cần BE cho phép CORS của origin frontend; proxy phát triển không tồn tại trên host tĩnh.

Đầu ra SPA là `build/client/`:

- **Docker/Nginx:** `Dockerfile` build bằng Node rồi chép `build/client` vào Nginx. `nginx.conf` dùng `try_files ... /index.html` để mở trực tiếp URL con. File Nginx hiện không khai báo proxy API; cấu hình API phải khớp hạ tầng triển khai thực tế.
- **Vercel:** dùng preset khai báo trong `react-router.config.ts`. Đặt thư mục dự án tại nơi có `package.json` này, cấu hình biến môi trường trước build và kiểm tra truy cập trực tiếp URL dashboard. Không dùng đường dẫn root của repository cũ hoặc tự thêm rewrite khi chưa kiểm tra cấu hình preset.

`pnpm-workspace.yaml` hiện chứa chính sách build dependency, override và bản vá `@react-router/dev`; chưa khai báo nhiều package ứng dụng. Giữ file này và `patches/` đồng bộ với lockfile khi thay dependency.

## 11. Cách thêm hoặc sửa chức năng

1. Đọc `AGENTS.md`, xác định vai trò, chức năng sở hữu và nhánh điều hướng thực sự đang render. Kiểm tra chức năng đang dùng API hay dữ liệu mẫu.
2. Với tích hợp BE, đối chiếu contract về endpoint, DTO, quyền, status, mã lỗi và phân trang trước. Nếu thiếu contract, nêu phần thiếu; không tự tạo response hoặc endpoint để giả hoàn thành tích hợp.
3. Đặt view/component/hook/status đúng thư mục. Khi có nhu cầu dùng chung, chọn `<role>/shared/`, `entities/` hoặc `shared/` theo trách nhiệm; không import xuyên vào chức năng khác.
4. Nối tab và điều hướng qua `*-nav.ts`, `enums.ts` nếu có, `index.ts` và component điều phối tương ứng. Nếu thêm route bảo vệ, giữ `RoleGuard` bao ngoài `DashboardEntry`.
5. Dùng generated query/mutation và HTTP client chung; xác định query key cùng phạm vi cache cần cập nhật. Giữ draft cục bộ, chặn thao tác lặp, xử lý tải/rỗng/lỗi/thành công và thiếu quyền.
6. Thêm bản dịch VI/EN, áp dụng token giao diện và quy chuẩn tương tác. Xác nhận UI mẫu được ghi nhãn đúng và không báo như đã lưu trên BE.
7. Chạy kiểm tra phù hợp và review diff. Nếu kiến trúc hoặc mức tích hợp thay đổi cần cập nhật tài liệu được bảo vệ, báo file/mục, lý do và nội dung đề xuất; chỉ sửa khi người dùng cho phép rõ ràng theo mục 0 của `AGENTS.md`. Khi chưa được duyệt, giữ nguyên tài liệu và nêu đề xuất trong bàn giao. Không sửa lan sang các chức năng độc lập.

Các lệnh chuẩn, chạy tại thư mục chứa `package.json`:

| Lệnh                             | Mục đích                                                          |
| -------------------------------- | ----------------------------------------------------------------- |
| `pnpm install --frozen-lockfile` | Cài dependency đúng lockfile                                      |
| `pnpm dev`                       | Chạy máy chủ phát triển                                           |
| `pnpm api:validate`              | Kiểm tra quy ước hợp đồng cục bộ                                  |
| `pnpm api:generate`              | Validate và sinh client; chú ý nguồn mặc định/biến ghi đè ở mục 7 |
| `pnpm exec vitest run <path>`    | Chạy kiểm thử liên quan                                           |
| `pnpm typecheck`                 | Sinh kiểu route và chạy TypeScript                                |
| `pnpm test`                      | Chạy Vitest và kiểm thử Node cho script/quy tắc ESLint            |
| `pnpm build`                     | Build SPA bằng mode `product`                                     |
| `pnpm check`                     | Prettier -> ESLint -> typecheck -> test -> build                  |

`vitest.config.ts` chỉ khám phá `app/**/*.test.{ts,tsx}`, dùng jsdom và `test/setup.ts`. Kiểm thử hiện đặt gần code hoặc ở cấp chức năng; không bắt buộc tạo `__tests__/`. Test HTTP có thể dùng Axios adapter cô lập hoặc MSW khi cần kiểm tra ranh giới mạng. Không phụ thuộc API thật cho unit/component test.

Sau khi sửa code, chạy typecheck và test liên quan theo `AGENTS.md`; khi tích hợp BE, chạy các bước kiểm tra contract và `pnpm check` được yêu cầu. Thay đổi chỉ tài liệu cần kiểm tra định dạng, liên kết và độ khớp với source. Báo rõ lệnh chưa chạy hoặc thất bại; không tuyên bố mọi kiểm tra đã qua khi chưa có kết quả.

## 12. Những điểm code hiện tại chưa đồng nhất

Các điểm này là hiện trạng cần lưu ý khi sửa phần liên quan, không phải quy tắc kiến trúc cho code mới:

- `approvals/` đang import dữ liệu, store và một số component nội bộ từ `finance/`. Hai store `finance/annual-budget-store.ts` và `finance/optimization-store.ts` dùng `useSyncExternalStore` để mô phỏng luồng giữa Finance và Spending Approver trong bộ nhớ; tải lại trang sẽ khôi phục dữ liệu mẫu. Khi thay luồng này bằng API, đưa phần nghiệp vụ dùng chung về tầng phù hợp, không tiếp tục mở rộng import xuyên vai trò.
- `DashboardPage` vẫn chứa nhiều nhánh màn hình và một số state mô phỏng của Manager. Các vai trò chưa được tách đồng đều thành component điều phối riêng. Code mới cần tránh tiếp tục làm phình file trung tâm.
- Nhiều file dữ liệu mẫu và bản dịch hiện vượt giới hạn 500 dòng, ví dụ `it-admin-data.ts`, `finance/annual-budget-data.ts`, `manager-data.ts` và tài nguyên `dashboard.ts`. Đây không phải bằng chứng rằng giới hạn trong `AGENTS.md` đã được tuân thủ toàn bộ.
- Một số `enums.ts` cấp vai trò còn gộp status nghiệp vụ mẫu. Chức năng mới hoặc phần đang tích hợp BE áp dụng thư mục `enums/` theo từng chức năng và dùng mã từ contract.
- IT Admin có cả `it-admin/views/it-dept-catalog-view.tsx` và `it-admin/dept-catalog/views/it-dept-catalog-view.tsx`. Điểm export hiện dùng bản trong `dept-catalog/views/`; xác minh đường import trước khi sửa để tránh tác động vào bản không được dashboard sử dụng.
- Các thư mục IT Admin như `identities/`, `renewals/`, `offboarding/` có component nhưng chưa nằm trong tập tab hiện hành của `IT_ADMIN_TAB_KEYS`. Không mô tả chúng như chức năng đã được nối đầy đủ.

Tài liệu kiến trúc chỉ giữ mô hình hiện tại và quy tắc mở rộng. Chi tiết từng thiết kế mẫu, số liệu minh họa, lịch sử triển khai hoặc kế hoạch chưa thực hiện đặt trong tài liệu chức năng/thiết kế tương ứng, tránh ghép lại thành các mô hình kiến trúc cạnh tranh trong file này.
