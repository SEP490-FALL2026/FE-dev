# Finance spend integration

Implemented the review queue, request review/budget-check detail, budget questions, and commitments using generated Orval hooks. Removed the former demo filters, exception views, and unpaid-commitment panels from these slices. Finance provides assessments and recommendations; it does not approve expenditure.

- Review mutation sends exactly `ASSESSED` with opinion/direction, or `RETURN_TO_HEAD` / `NEEDS_BUDGET` with reason. Recorded outcome codes are displayed separately.
- Review requires the current effective Finance role, matching employee/assignee, a known actionable state, and refreshed check/year data. WAITING and unknown states remain read-only.
- Explicit request UUID lookup can retrieve completed budget-revision reviews. A later action requires the current recorded `BUDGET_REVISION_NEEDED` outcome and a separately verified `AWAITING_BUDGET` request. Cached waiting state cannot reactivate a completed assessment. Repeating NEEDS_BUDGET is blocked.
- All list pages, nested budget-year pages, and release-history pages come from their API pagination. Money remains a decimal string and uses the shared formatter.
- Forms preserve drafts on failed writes, guard duplicate submissions, disable while pending/refetching, and use shared feedback with generated invalidation keys. Review drafts survive a failed post-write detail refetch. Pending drawers cannot close.
- Domain concepts have individual enum files sourced from generated constants; the access-request state is a generated inline union, so its waiting-budget literal has a dedicated local module.
- English and Vietnamese strings are provided by the financeSpend namespace.

## Verification

`pnpm vitest run app/features/dashboard/finance/budget-check/finance-spend-api.test.tsx app/features/dashboard/finance/budget-questions/finance-questions-api.test.tsx app/features/dashboard/finance/commitments/finance-commitments-api.test.tsx --maxWorkers=1`: 3 files, 15 tests passed. These use the real generated query/mutation hooks, QueryClient, and the shared Axios adapter, with deterministic response fixtures. Coverage includes payload exclusivity, draft retention after conflict, assignee/role/state guards, verified waiting-budget continuation, cached-state regression, and server pagination.

Focused ESLint completed successfully for all three slices and both locale files. Prettier was applied only within this ownership scope. All owned files remain below their line limits. No production mock imports remain.

The initial `pnpm typecheck` attempt stopped at react-router typegen with EPERM removing `.react-router/types` during concurrent work. The subsequent standalone tsc run saw i18n namespace errors while root registration was still being edited, plus unrelated existing super-admin translation errors. Root owns the final serial whole-project typecheck.

## API limitations

Questions and commitments have no read-by-ID endpoint. A URL item outside the current list page is identified as such, with instructions to filter/page to it; the UI does not fabricate a detail or search arbitrary cached rows. Commitment release eligibility depends on request completion and expected invoices, which the list does not expose. The UI requires HELD and Finance, explains the condition, and lets the release endpoint perform the authoritative check.

No protected rule files or generated API files were edited, and no commits were created.
