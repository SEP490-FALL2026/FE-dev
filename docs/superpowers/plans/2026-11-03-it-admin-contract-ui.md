# IT Admin contract and UI implementation plan

**Goal:** Align the IT Admin workspace with the deployed backend contract and complete its usable, bilingual workflows and interaction states.

**Architecture:** Keep the existing React Router role shell and vertical slices. Use generated TanStack Query operations, shared HTTP/auth infrastructure, and role-owned components; never edit generated output or protected rule documents. Work in the current checkout because its existing uncommitted contract/auth updates are dependencies of this task; preserve those changes.

**Design:** Use a restrained enterprise workspace: server-scoped operation cards, compact list toolbars, one primary action, visible selected/pressed/focus states, and responsive drawers. Input examples supplement persistent labels. Missing upstream data is explicitly unavailable, never a fabricated zero.

**Sources:** AGENTS.md, ARCHITECTURE.md, UI_UX_DESIGN_GUIDELINES.md; ../docs/Figma UI-UX/API-Integration/{conventions,roles/it-admin,reference/_,flows/_,demo/*}; live OpenAPI read on 2026-11-03 (302 operations, identical to local snapshot). External UI references: Carbon dashboard/data table guidance and Atlassian text field/button guidance.

- [x] Contract audit: inventory IT operations and existing consumers; validate snapshot; authenticate demo IT accounts without persisting credentials and exercise read endpoints.
- [x] Overview: replace three unrelated list totals with `itAdminDashboardGet`; preserve COUNTED / AT_SOURCE / NOT_AVAILABLE distinctions, scope and as-of; route cards to the correct filtered source. Add regression coverage before implementation.
- [x] Assessment: connect `assessmentQueueList`, server pagination, readiness and canAct; retain identifier lookup and read-only access, but block queue-disallowed mutations. Refresh queue/dashboard after writes. Add regression coverage.
- [x] Renewals: implement list/filter/pagination, detail, proposal, outcome, seat ranking and deadline-event reads using generated contracts. IT may propose/record outcomes, never decide spending. Validate conditional quantities/periods, retain failed drafts and prevent repeated writes. Add request/pending/error tests.
- [x] Existing workflows: audit strict payloads and enum/error/null mappings; improve catalog/provisioning/offboarding/issue form examples, field grouping and active states. Use role-local UI styling to preserve other roles.
- [x] Resolve confirmed legacy flow defects from the 02/11 review: choose the actual fulfillment plan independently of alternatives; close only the departing group member with separate rollback evidence; show handover instructions and implement technical transfer closure/responsibility reassignment; edit declared cancellation deadlines without confirming inferred dates; offer failed-task cancellation only with a verified withdrawal.
- [x] Verification: run affected Vitest tests, API validation, typecheck, scoped formatting/lint and `pnpm check`; inspect browser desktop/mobile, dark/light, VI/EN, keyboard focus, overflow and console. Distinguish mocked mutations from real read-only smoke checks.
- [x] Handoff: update IT integration notes and a dated review with actual checks, remaining upstream gaps and evidence. No commits, deployment, baseline closure or shared demo business mutations.
