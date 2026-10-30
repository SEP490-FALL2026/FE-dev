# Super Admin API Implementation Plan

> **For agentic workers:** Use superpowers:dispatching-parallel-agents for independent slices; integrate and review all slices in this workspace. Do not commit the owner's unfinished changes.

**Goal:** Map Super Admin screens to the documented backend and remove obsolete demo runtime data.

**Architecture:** Generated Orval operations → feature hooks → views/components, with shared pagination, query states, dialog controls and mutation feedback. Preserve existing auth and shared Axios.

**Tech Stack:** React 19, React Router 7, Orval 8, TanStack Query 5, TypeScript, Tailwind 4, Vitest/MSW, Sonner, i18next VI/EN.

## Global Constraints

- Follow AGENTS.md, ARCHITECTURE.md and UI_UX_DESIGN_GUIDELINES.md; file limit 500 lines, views below 400, components below 300.
- No manual generated edits, fabricated statuses/endpoints, demo runtime fixtures, local state pretending to save, or automatic mutation retries.
- Only direct grant/revoke for IT_ADMIN, FINANCE, EMPLOYEE. Derived roles come from department heads and approval duties. Unknown status disables dependent writes.
- Both locales updated; server pagination/query keys and targeted invalidation; pending and error handling; preserve owner changes.

### Task 1: Contract and shared integration primitives (root)

- [x] Expand Orval tag filter for Super Admin; generate from committed snapshot and validate.
- [x] Add shared query-state, pagination, form drawer, status label and mutation-feedback controls under super-admin/shared, with request-level tests for failure/pending behavior.
- [x] Provide namespace `admin` for common copy, with separate `adminAccounts`, `adminOrganization`, `adminPersonnel` namespaces owned by each slice.

### Task 2: Accounts and responsibilities (independent)

- [x] Replace accounts/hooks/use-super-admin-accounts.ts and accounts/views/super-admin-accounts-view.tsx using appUserList/Get/Create/ResendInvitation/Lock/Unlock/GrantRole/RevokeRole, accountCandidatesList, approvalRoleList/Set and superAdminTransfer.
- [x] Delete obsolete device/onboarding/demo account components. Status files in accounts/enums reference generated constants; DTOs are generated types.
- [x] Add VI/EN admin-accounts.ts and request integration tests including no grant of derived roles, failures preserving form, unknown statuses, pending, pagination and invalidation.

### Task 3: Organization (independent)

- [x] Replace departments views/components with departmentList/Get/Create/Update/Deactivate, memberList, headAssign/Vacate, successorDesignate/Clear and projectList/Create/Update.
- [x] Reuse generated DTOs and status constants; add admin-organization.ts in both locales; avoid costs or member counts invented from one page.
- [x] Test request field selection, paging, stale/conflict errors and changes visible after successful writes.

### Task 4: Personnel and HR events (independent)

- [x] Replace personnel and transfer demo with employeeCreate/UpdateOfficialFields, import upload/preview/confirm/cancel, departmentTransfer*, longLeave*, offboardingCase* operations owned by Super Admin, and personnelNoticeList/Get/Record/LinkEvent/Reject.
- [x] Add scoped enums and admin-personnel.ts VI/EN. Obtain candidates from paged department members/account candidates where API allows; never assume page one is the directory.
- [x] Test strict payloads/hrBasis, import replay key, error retention, pending and lifecycle actions by known status.

### Task 5: Operational screens, shell, cleanup and verification (root)

- [x] Replace overview with onboardingChecklistGet/superAdminWatchGet. Replace reminders/settings with operatingParameterList/Set/History, nonWorkingDateList/Add/Rename/Remove, reportingCurrencyGet/Set/currencyList. Wire Audit Trail with auditEventList filters/paging.
- [x] Add controlledWaitList/stepCongestionList and incident recording to operational view; wire transfer/settings correctly in role screen.
- [x] Use auth identity for Super Admin shell; remove static nav badges, demo notice, dummy search/notification count for this role. Delete unused super-admin-data.ts and outdated enum/demo translations.
- [x] Review each slice against contract and whole integration. Update architecture/agent current-state notes, run formatting/lint/typecheck/tests/build and report actual outcomes.

## Verification record

Implementation and scoped review completed. See `docs/super-admin-verification.md` for passed checks and the pre-existing repository-wide formatting/lint failures. No commits or live Super Admin writes were performed.
