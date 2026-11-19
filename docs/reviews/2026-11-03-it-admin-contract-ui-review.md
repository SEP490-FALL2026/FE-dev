# IT Admin contract and UI review — 03/11/2026

The IT workspace has been aligned with the deployed 302-operation contract and extended to cover the newly available workflows. Existing authentication, generated clients and other roles remain dependencies of the current dirty checkout; this work does not overwrite their pre-existing changes. Protected rule documents were read and not edited by this task.

## Sources and design

- Project constraints: AGENTS.md, ARCHITECTURE.md, UI_UX_DESIGN_GUIDELINES.md.
- API semantics: the live OpenAPI, local snapshot, generated DTOs, and ../docs/Figma UI-UX/API-Integration conventions, IT role, operation references and demo-account documentation.
- Legacy flow findings: [02/11 review](2026-11-02-it-admin-api-flow-review.md). Findings are checked against the current contract rather than assumed to remain current.
- Visual references: [Carbon dashboards](https://v10.carbondesignsystem.com/data-visualization/dashboards/), [Carbon data tables](https://www.carbondesignsystem.com/building-blocks/core/components/data-table/guidelines), [Atlassian text fields](https://atlassian.design/components/textfield/code). Applied a restrained operational layout, deliberate control hierarchy, readable dense data, persistent labels and explicit selection/focus states using the repository's existing theme.

## Behavior changed

1. Overview reads the dedicated scoped dashboard, preserving counted, source-only and unavailable metrics. Links open the matching source; assigned SaaS reports use the correct scope.
2. Software assessment has a server-paginated queue and preserves server readiness/canAct. UUID and deep-link access also checks request parties so IT cannot assess its own request. Linking a registered fulfillment plan is independent of the equivalent-tool suggestion (R01).
3. Renewals support proposal, detail, vendor outcome, conditional confirmed next period, seat review order and deadline history. There is no IT spending-decision action.
4. Catalog supports terms warnings, fresh term editing, paginated opinion history, departed-owner warnings and owner retirement confirmation. Unknown append-only write results block immediate resubmission.
5. Contract documents follow declaration → signed storage PUT → completion → permanent attachment. Bearer credentials are omitted from the storage request; signed URLs never enter query/mutation result data. Contract creation and document declaration do not report success on an uncertain response.
6. Departure handles group lines separately from individual requests, sends separate rollback evidence, and shows available right/handover/access-end context (R02–R04).
7. Technical transfer work includes responsibility reassignment and permitted closure/confirmation, without adding IT personnel-event creation (R05).
8. Subscription editing exposes the declared cancellation deadline and the effective date's source; inferred dates are not silently confirmed (R06). Failed grant cancellation requires confirmed withdrawal context (R11).
9. Forms include bilingual placeholders, field-specific examples, accessible descriptions and role-local focus/pressed/selected styling. Existing native choice controls were replaced with the shared accessible picker. A lazy directory helper uses departmentList and scoped departmentTechnicalMemberList instead of privileged personnel APIs.

## Verified against the shared backend

The two demo IT accounts each completed login, 22 read requests and logout. All 44 reads returned 200; logout returned 204. Coverage includes /me, scoped dashboard, assessment/task/grant/expiry queues, applications, plans, plan terms/opinions, subscriptions/seat usage, renewals/deadline events, assigned SaaS issues, departure cases, ownership/term warnings, departments and an owned department's technical roster. No credentials or response bodies containing personnel data are stored in this report.

These checks prove read connectivity and current authorization for the seeded accounts. They do not prove vendor execution, storage CORS, multi-role transactions or write acceptance. Business writes are checked with isolated fixtures; no shared demo requests, subscriptions, assignments, contracts or baselines were mutated.

## Browser evidence

Chrome was exercised with intercepted synthetic API responses on desktop 1440px and mobile 375px, in light/dark and VI/EN. The shell remained locked, the mobile page had no horizontal overflow, the drawer width was 369px within 375px, mobile lookup inputs used 16px text, active and inactive buttons had different computed colors, keyboard focus was visible, and no runtime exceptions or business writes occurred.

Local evidence is under ../../../scratch/it-admin-20261103-*.png and the sanitized browser-result JSON. Relevant captures: overview-desktop, assessment-desktop, assessment-dark, terms-desktop, renewal-proposal-desktop, catalog-form-mobile and purchase-documents-mobile-vi.

Production-preview coverage also opens the technical-transfer screen and links a selected persisted application/plan for an assessment with no equivalent-tool suggestion. The confirmation becomes enabled only after fresh plan details match the choice; the browser test never submits that mutation. See catalog-link-actual-plan and transfers-desktop captures.

## Technical verification

- Full Vitest: 129 files, **596 tests passed**, using `pnpm exec vitest run --maxWorkers=2 --testTimeout=15000`. The repository test-timeout configuration was not changed. A prior default parallel run timed out in the Employee group-dropdown tests; the affected file passed independently before the final constrained full run.
- Node validator/ESLint-rule tests: **3 passed**, using `node --test scripts/*.test.mjs eslint-rules/*.test.cjs`.
- `pnpm api:validate`: passed for the current local contract.
- `pnpm typecheck`: passed after integrating the role slices.
- `pnpm lint`: passed across the repository.
- `pnpm build`: passed. Existing large-chunk and plugin-timing warnings remain; no dependency or bundling-policy change was made for this task.
- Handwritten IT components remain within the documented component/view/file size limits. Changed files pass whitespace checks.
- `pnpm check`: stops at the formatting stage with **15 pre-existing files outside this change**: .codex/instructions.md, .github/copilot-instructions.md, CODEX.md, index.md, PROJECT_OVERVIEW.md; en/vi dashboard-spend.ts and errors.ts; and en/vi it-admin-deviceCollectors-extra.ts, it-admin-offboarding-extra.ts and it-admin-provisioning-extra.ts. These files were not reformatted as part of this task. The checks after formatting were executed independently as listed above.
- Independent read-only reviews identified and verified fixes for uncertain contract/opinion creation and UUID self-assessment authorization. A further review checked declared deadlines, withdrawal gating, handover confirmation, transfer scoping and cache invalidation; the baseline-import preview invalidation gap it found was fixed.

## Remaining backend boundaries

The frontend bundle-size warning was resolved in the [2026-11-04 bundle follow-up](2026-11-04-client-bundle-review.md). The final complete `pnpm check` passed with 598 Vitest tests, 3 Node tests and a largest client chunk of 383.57 kB. Earlier size warnings and verification results below are historical.

### Follow-up: formatting blockers resolved

After the user requested details and fixes for the remaining issues, all 15 Prettier violations listed above were corrected. The earlier `pnpm check` result is historical. The changes normalize wrapping, quotes, trailing commas/newlines and Markdown tables without changing translation tokens or document content. Hashes confirm that AGENTS.md, ARCHITECTURE.md and UI_UX_DESIGN_GUIDELINES.md were unchanged by this follow-up.

Fresh follow-up verification: repository-wide `pnpm prettier`, `pnpm lint`, `pnpm typecheck`, and both i18n resource tests passed; `git diff --check` passed for the 15 files. The full 596-test suite and production build were not rerun for these formatting-only changes. Build-size warnings and the backend boundaries below are separate from the resolved formatting failures.

- No usage/telemetry, device registry, identity matching, usage-based optimization or cost reconciliation source exists in this snapshot. Those views remain explicitly unavailable.
- K4 is limited to its supported inventory/import/reveal surfaces; its complete assignment/device-binding/revocation lifecycle is not delivered by the current provisioning contract.
- Contract/document list and attachment-association history are not exposed, so existing items are opened by saved reference. No OCR or quantity reconciliation is simulated.
- Some task execution/closure prerequisites lack a structured readiness projection. FE displays the metadata that exists and leaves the final decision to BE; it does not invent retention deadlines from due dates.
- Storage upload and vendor execution were not exercised against shared infrastructure. An isolated environment is needed for write acceptance across roles without changing the demo scenarios.
