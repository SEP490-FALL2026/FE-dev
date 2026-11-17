# Post-merge cleanup implementation plan

> **For agentic workers:** Use superpowers:dispatching-parallel-agents for the independent domains below; the coordinator reviews and verifies their combined changes.

**Goal:** Remove unreachable Super Admin leftovers and repair checks against the current UI and generated API contract.

**Architecture:** Preserve reachable feature behavior and generated API code. Trace imports from routes and role entry points before deleting files. Test real components and intercept only external HTTP requests, using endpoint-specific contract responses.

**Tech Stack:** React Router, React Query, TypeScript, Vitest, MSW, ESLint, Prettier.

## Constraints

- Keep existing staged merge changes; do not commit, reset, abort the merge, or overwrite unrelated changes.
- Do not change AGENTS.md, ARCHITECTURE.md, UI_UX_DESIGN_GUIDELINES.md or generated API files.
- Delete a module only after confirming there is no reachable production consumer; remove its obsolete tests and translation keys together.
- Keep pending/error behavior and real API mapping. Do not hide failures with broad mocks, skipped assertions or longer timeouts.

## Task 1: Super Admin cleanup

- [x] Trace super-admin-screen.tsx, super-admin-nav.ts and consumers of audit/, ghost-seats/, settings/, transfer/ and overview/components/personnel-metrics.tsx.
- [x] Remove unreachable modules and associated obsolete tests; retain any component used by reachable personnel/account workflows.
- [x] Reconcile admin VI/EN keys according to remaining consumers. Run resources.test.ts and affected Super Admin tests.

## Task 2: Dashboard integration tests

- [x] Repair dashboard-page.test.tsx, dashboard-shell.test.tsx, dashboard-manager-workflows.test.tsx and routes/dashboard.test.tsx against current navigation and notifications.
- [x] Replace removed preview expectations with observable API-backed UI behavior; remove unused handlers and catch-all success responses.
- [x] Run the four affected files with unhandled HTTP requests treated as errors.

## Task 3: Employee and IT test contracts

- [x] Repair employee/employee-api.test.tsx uncertain-write case according to the current form fields and real submission endpoint.
- [x] Repair it-admin/shadow-it/it-shadow-it-view.test.tsx with real QueryClient and precise HTTP handlers.
- [x] Update test/audits/mf23-contract-fixtures.ts to match generated TaskResponseDtoDataTask.termCutAt.
- [x] Run affected tests and inspect pending/error assertions rather than deleting active workflow coverage.

## Task 4: Lint, formatting and final verification

- [x] Remove unused ManagerField imports; correct IT form test accessibility text using existing translations.
- [x] Trace the nine Prettier files to consumers; remove only unused files and format remaining files.
- [x] Run pnpm lint, pnpm typecheck, affected tests, then pnpm check after integration. Review the final diff and report exact results.
