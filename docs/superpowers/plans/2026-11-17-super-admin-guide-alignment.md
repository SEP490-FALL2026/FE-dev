# Super Admin guide and interaction alignment

**Goal:** Repair Super Admin contracts and implement documented administration workflows with clear bilingual forms and intentional detail navigation.

**Architecture:** Keep existing vertical slices and generated Orval operations. Shared Super Admin form presentation supplies accessible descriptions and required markers. Long details replace list content through URL state; small actions use dialogs. Generated files and protected architecture documents remain unchanged.

**Constraints:** Preserve existing user edits; no commits, deployment, shared backend writes, fabricated endpoints, or changes to other roles. Vietnamese and English resources must match. Source files stay below 500 lines. Use generated clients, server pagination and mutation feedback.

- [x] Repair policy query signatures, response fields, pagination, translation namespaces and unsaved publishing; verify request semantics with MSW.
- [x] Repair personnel contract mismatch safely at the contract boundary, compare offboarding/transfer/leave/import flows with guide, add required markers and descriptions to personnel forms.
- [x] Audit every operation listed for Super Admin against runtime usage; implement missing documented administration slices through existing generated clients.
- [x] Fix account unblocking after cancelled departure, align account email creation, and improve account/department/parameter/calendar form descriptions and history navigation.
- [x] Add regression tests for actual request behavior, required markers, descriptions, Vietnamese rendering and dialog/page transitions.
- [x] Run focused tests, ESLint, Prettier, typecheck; report unrelated existing whole-project errors separately and review changes against the baseline.

User approved implementation and specified the interaction and language requirements directly in the current request. Implementation proceeds in this workspace to preserve and build on their existing uncommitted fixes.

Verification and backend limitations are recorded in `docs/reviews/2026-11-17-super-admin-guide-alignment.md`.
