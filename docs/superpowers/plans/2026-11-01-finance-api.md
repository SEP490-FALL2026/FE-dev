# Finance API Implementation Plan

**Goal:** Replace Finance demo workflows with the documented Orval API integration.

**Architecture:** Generated DTOs and operations are the transport boundary. Each Finance slice owns its screens, forms and status mappings; role shared components provide query states, pagination, forms and mutation feedback. Keep the existing auth and dashboard shell.

**Tech stack:** React 19, TanStack Query 5, Orval 8, TypeScript, i18next, Vitest/MSW.

## Constraints

- Protected rule documents remain unchanged. No handwritten generated code, new dependencies or guessed APIs.
- Views under 400 lines, child components under 300 lines, handwritten TS/TSX under 500 lines.
- VI/EN for every user-visible label and placeholder; money stays as decimal strings.

## Tasks

- [x] Extend Orval tag filters and regenerate from `openapi/openapi.yaml`; validate contract.
- [x] Write failing tests for exact money handling and Finance request/error/pending behavior, then implement shared UI, paging, translated status and mutation feedback.
- [x] Implement proposal intake, version creation/revision/editing/submission, paged lines/import/history/window changes and current budget table.
- [x] Implement Finance review/checks, question answers and commitment release/history using server queries and mutations.
- [x] Implement Cost Center management, exchange rates, vendor tax declaration/history/estimate and catalog reads.
- [x] Connect navigation and real overview counts, replace unsupported demo screens, remove Finance fixtures/stores and resolve Approver preview dependencies.
- [x] Run related tests, typecheck, API validation and `pnpm check`; review source boundaries, protected files, money, enum fallback, search placeholders and residual mocks.

Verification results and contract limitations are recorded in [the handover](../../finance-api-integration.md). The task's tests and source checks passed; repository-wide `pnpm check` remains blocked by existing formatting outside this scope.
