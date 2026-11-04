# Super Admin contract and interface implementation plan

**Goal:** Align Super Admin with the 03 November backend contract and improve form clarity, interaction feedback and responsive layouts.

**Architecture:** Keep generated operations as the API boundary, TanStack Query as server state, and each business workflow inside its existing vertical slice. Shared Super Admin forms own translated input guidance; reusable controls own focus, pressed and disabled styling. Preserve all pre-existing changes and the three protected rule documents.

**Tech stack:** React 19, TypeScript, React Router, TanStack Query, Orval, Tailwind 4, Vitest, Testing Library.

## Constraints

- Read `AGENTS.md`, `ARCHITECTURE.md`, `UI_UX_DESIGN_GUIDELINES.md` and current API role/reference documents.
- No manual generated-code edits, invented endpoints, fake counts or client-side business decisions.
- Both Vietnamese and English for every static UI string; no credentials in source or reports.
- Maximum 500 lines per handwritten TypeScript file; views below 400 and components below 300.
- One primary CTA, stable control dimensions, visible focus/pressed states and minimum 44px mobile targets.
- Work in the current dirty checkout so the user's existing integration changes remain available; do not reset, commit or stage unrelated work.

## Tasks

- [x] Directory: use `employeeList` for search, filter and pagination, `employeeGet` for detail, and `employeeFirstPlacement` for unplaced staff. Preserve create/correct routes; invalidate directory/detail and affected dashboard/cache sources after writes. Test HTTP requests and user flows.
- [x] Overview: consume `superAdminDashboardGet`; show numeric metrics only for `COUNTED`, source links for `AT_SOURCE`, and unavailable text for `NOT_AVAILABLE`. Refresh all overview queries together. Test metrics and source navigation.
- [x] Operating parameters: display backend label/groupLabel/unitLabel; build int/enum/int-list inputs from constraints and make unknown kinds read-only. Test validation and payload types.
- [x] Departments: edit changed official fields, then assign/vacate head through the distinct endpoint. Keep successful first-stage writes when the head step fails, and read back ambiguous outcomes. Test no-op, partial success and retry.
- [x] Shared UI: add translated examples to personnel/account/audit/settings inputs; consistent selected/pressed/focus states, responsive toolbar/table and pending feedback. Preserve labels and accessible error association.
- [x] Contract/cache audit: confirm no app-based Super Admin handover remains; extend employee/dashboard invalidation where affected; verify API snapshot against supplied docs and backend export without exposing credentials.
- [x] Validation: focused tests, `pnpm api:validate`, `pnpm typecheck`, `pnpm check`; review final scope and protected-file diff. Browser inspection completed at desktop and 375px. Full check formatting failure outside task scope is documented in the review report.

## Design references

- Carbon data tables: restrained horizontal separators, explicit row and control states, compact toolbar.
- Atlassian text fields: retain visible labels and use placeholder examples for expected input.
- Existing SaaS-Sentry theme tokens, light/dark modes and locked dashboard shell remain the visual foundation.
