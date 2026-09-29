# SaaS-Sentry Web architecture

Status: accepted foundation, 2026-08-11.

## Context

SaaS-Sentry is an enterprise system for SaaS catalog, contracts, license seats,
approval workflows, usage optimization, finance reporting, and Shadow IT review.
Its BRD identifies a responsive web application as the MVP and explicitly excludes
a mobile application from the current product scope.

The frontend started from the React Router welcome template. This architecture is
deliberately a modular frontend inside one deployable application: a five-person,
fourteen-week MVP does not benefit from micro-frontends, a cross-platform UI package,
or a generic repository layer over a generated HTTP client.

## Runtime view

```text
Browser
  -> static React Router SPA
      -> route module
          -> feature UI/workflow
              -> generated TanStack Query hook
                  -> fetch /api/*
                      -> NestJS REST API
```

The browser owns presentation, navigation, and ephemeral interaction state. NestJS
owns validation, authorization, workflow transitions, audit trails, persistence,
and all decisions that affect money or access.

## Key decisions

### Manager request creation preview

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
        api/<tag>/         fetch functions and TanStack Query hooks
        contracts/<tag>/   request/response/domain types
        mocks/<tag>/       Faker factories and MSW handlers
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

`openapi/openapi.yaml` is a versioned snapshot consumed by `orval.config.ts`.
The current bootstrap operation mirrors the existing NestJS root controller; once
Swagger is enabled in the backend, the backend export replaces this bootstrap file.

```text
openapi/openapi.yaml
  -> pnpm api:validate
      -> enforce one declared tag per operation, unique operationId,
         *Request request bodies, and *Response success bodies
  -> pnpm api:generate
      -> app/shared/api/generated/api/<tag>
      -> app/shared/api/generated/contracts/<tag>
      -> app/shared/api/generated/mocks/<tag>/*.faker.ts
      -> app/shared/api/generated/mocks/<tag>/*.msw.ts
```

Orval uses `fetch`, `react-query`, and `tags-split`. `splitByTags` also places
contracts under their owning tag; a contract referenced by multiple tags remains at
the contracts root so it is not duplicated. `tagsSplitDeduplication` extracts shared
transport infrastructure, and generated index files provide deliberate public entry
points. Its base URL reads
`env.API_BASE_URL`, which defaults to `/api`. The built-in fetch generator preserves
typed response data/status and throws for non-success HTTP responses, allowing
TanStack Query to enter its error state. Do not wrap every generated call in a
repository. Add a custom fetch mutator only when authentication, refresh, correlation
IDs, or a normalized API-error contract requires it.

Faker is a development dependency and may be used by unit tests, component examples,
or deterministic fixtures. MSW handlers may be used by integration tests or an
explicit local mock mode. Neither is imported by the production app graph.

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

- `VITE_API_BASE_URL` is public and defaults to `/api`.
- `API_PROXY_TARGET` is read only by the Vite development server and defaults to
  `http://localhost:3000`.
- Vite statically replaces browser environment values during the build. A changed
  production API prefix therefore requires a rebuild unless the deployment keeps the
  stable `/api` ingress contract.
- No token, private key, or service credential belongs in a `VITE_*` variable.

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

- Authentication/session storage awaits the backend OIDC contract. Do not store
  long-lived tokens in local storage by default.
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
