# IT Admin provisioning correction

**Goal:** Make account provisioning follow the IT Admin's assigned departments and prevent choosing exhausted or unrelated subscriptions.

**Architecture:** Use existing generated API operations and TanStack Query. Resolve department responsibility from `departmentList` and `/me`, then associate grant beneficiaries with their current employee department. Keep backend provisioning decisions authoritative.

**Constraints:** Preserve generated clients and protected repository guidelines. Translate all UI copy in Vietnamese and English. Use the organization date returned by seat usage for subscription eligibility. Do not set an access end date in the grant body.

## Work

- [x] Read the IT Admin role guide, paid access flow, grant queue, provisioning and subscription seat usage contracts.
- [x] Reproduce foreign department visibility and exhausted subscription selection in component tests.
- [x] Add `provisioning/hooks/use-provisioning-departments.ts` to resolve assigned departments and read paginated API results completely.
- [x] Update `provisioning-grant-queue.tsx` to filter by assigned department before UI pagination and search by employee name/code or software/plan.
- [x] Extract `grant-dialog.tsx`; require an explicitly selected paid subscription owned by the beneficiary's department, with positive free seats and current effective dates. Show plan, purchase sequence, effective dates and seat availability instead of UUIDs.
- [x] Preserve K5 grants without subscriptions and block K3/K4 grants through this account workflow.
- [x] Make Awaiting grant the default, explain execution tracking and revocation, and keep task lists on `scope=MINE`.
- [x] Limit expiry queries to a selected assigned department and hide task details outside the default responsible IT Admin's scope.
- [x] Refresh grant and subscription queries after writes; on capacity conflict, preserve entered account details and block another submission against exhausted seats.

## Verification

Run `pnpm vitest run app/features/dashboard/it-admin/provisioning app/features/dashboard/it-admin/it-admin-english-audit.test.tsx`, `pnpm typecheck`, and `pnpm check`.

Regression cases cover assigned departments across API pages, foreign departments, no department assignment, full/unknown/unavailable seat capacity, explicit subscription selection, refreshed grant removal, concurrent seat conflicts, K5 access, read-only approved end dates, revocation confirmation and direct links to unrelated work.

## Contract limitation

`grantQueueList` supports beneficiary filtering but has no department/scope parameter and no department summary in its response. FE reads all queue pages and matches beneficiaries against paginated `departmentTechnicalMemberList` results for assigned departments, then applies department filtering. The technical-members API is authorized for IT Admin; full employee profiles are restricted to Super Admin. This corrects UI visibility and pagination; backend data isolation and efficient server pagination require a department-scoped grant queue contract. Task and expiry endpoints already expose `scope=MINE` and `departmentId`, respectively.

The API creates a provisioning task and reserves a seat. External provisioning still requires performing the task and recording completion. The UI must not describe task creation as completed external account provisioning.
