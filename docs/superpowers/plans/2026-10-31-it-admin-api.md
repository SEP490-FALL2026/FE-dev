# IT Admin API Implementation Plan

**Goal:** Replace IT Admin demo data and simulated writes with the reviewed OpenAPI client, accessible forms, and honest unavailable states.

**Architecture:** Keep routes thin and slices independent. Generate missing operations through Orval from the local snapshot, use TanStack Query for server state, and preserve existing application shell and UI tokens. Shared IT components own loading/error/empty, pagination, status presentation, and mutation feedback.

**Tech Stack:** React 19, React Router 7, Orval 8, TanStack Query 5, Axios, i18next, Sonner, Vitest/MSW.

## Global Constraints

- Do not edit AGENTS.md, ARCHITECTURE.md, UI_UX_DESIGN_GUIDELINES.md or overwrite the user's existing changes.
- Never hand-edit generated output or invent APIs, statuses, credentials or successful writes.
- All user-facing text, including search placeholders, is translated in Vietnamese and English.
- Views remain under 400 lines; handwritten TypeScript files remain under 500 lines; components under 300 lines.
- Queries have typed parameters, server pagination, loading/error/retry/empty states. Mutations block duplicate submission, preserve drafts on error and invalidate affected cache.
- Preserve a single primary CTA per surface, responsive controls, accessible dialog behavior and existing theme tokens.
- No shared-server writes during verification. Unit/component tests use isolated fixtures only.
- Work in current IDE checkout on phuDev; do not commit, push or deploy.

## Task 1: Client and shared infrastructure

- [x] Extend Orval tag filter for supported IT operations and regenerate from local snapshot.
- [x] Add IT translation resources, query/error/pagination components and feedback helpers.
- [x] Verify generated operations and representative integration behavior.

## Task 2: Provisioning operations

- [x] Replace provisioning demo with paginated/filterable task queue and task details.
- [x] Wire supported accept/start/assign/complete/fail/revocation actions using contract decision gates and evidence.
- [x] Handle pending/error/retry and cache invalidation; remove obsolete provisioning mock components/tests and add meaningful integration tests.

## Task 3: Catalog operations

- [x] Replace department catalog demo with real applications/plans/subscriptions and department rules supported by contract.
- [x] Support creation/editing and status changes only through existing endpoints; expose seat usage/baseline when supported.
- [x] Add translated search hints, validation, feedback and meaningful tests; remove obsolete catalog mock components.

## Task 4: Workspace, offboarding and SaaS issues

- [x] Replace overview fixtures with supported queues and actual counts, never extrapolate a page into global totals.
- [x] Connect offboarding details, account-lock evidence, revocation opening and closure using backend prerequisites.
- [x] Connect SaaS issue list/detail/messages/transitions.
- [x] Expose all implemented tabs; unavailable usage, devices, optimization, renewals and reconciliation show explicit unavailable states without fake data.
- [x] Remove all obsolete IT fixture files, demo labels, enums and consumers; preserve demo modules still used by other roles.

## Task 5: Verification and review

- [x] Run API validation, relevant tests, typecheck and pnpm check; fix failures attributable to the change.
- [x] Review behavior, permissions, statuses, empty/loading/error states and stale cache handling.
- [x] Report exact supported operations, unavailable endpoints, test evidence and any environment limitations.
