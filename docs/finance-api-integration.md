# Finance API integration handover

Implemented against `openapi/openapi.yaml`, with the Finance flow and API reference under `../docs/Figma UI-UX/API-Integration/`. Orval generation uses the checked-in snapshot explicitly; generated files were not edited manually. Dependencies, the API snapshot, and the three protected rule documents are unchanged.

## Implemented workflows

| Workspace        | API operations                                                                                                                                                                                        |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Overview         | Server pagination totals from submitted proposals, draft versions, pending Finance reviews and open budget questions                                                                                  |
| Cost centers     | `costCenterList`, `costCenterCreate`, `costCenterRename`, `costCenterDeactivate`, `costCenterEmployeeList`                                                                                            |
| Proposal intake  | `budgetProposalList`, `budgetProposalGet`, `budgetProposalLineList`, `budgetProposalReturn`, `budgetVersionCreate`                                                                                    |
| Budget versions  | List/get, edit figures, create revisions, rebuild rejected versions, send for approval, paginated plan lines, add/update lines, multipart imports, purchase-window changes and both history endpoints |
| Current budgets  | `budgetTable`, with server year filtering and pagination; amounts come directly from the response                                                                                                     |
| Finance review   | Queue, review detail, budget check and paginated yearly figures; assessment with recommendation, return to head, or request budget revision                                                           |
| Budget questions | Server list/state filters and `budgetInformationAnswer`                                                                                                                                               |
| Commitments      | Server list/year/request/attachment filters, release history and release of remainders                                                                                                                |
| Exchange rates   | `exchangeRateList`, `exchangeRateRecord`, `currencyList`; no Super Admin reporting-currency request                                                                                                   |
| Vendor tax       | Vendor list, current/default profile, declaration, paginated history and server tax estimate                                                                                                          |
| Catalog reads    | Applications, plans and subscriptions, with supported filters and pagination                                                                                                                          |

Finance does not approve spending or decide its own budget version. Its review actions are recommendations and assessments. Recorded outcomes and submission outcomes use their respective contract enums.

## Data and interaction

- Server state uses generated Orval/TanStack Query operations and the existing authenticated Axios client. Mutations invalidate affected lists/details/history; purchase-window changes also invalidate cached request checks.
- Monetary amounts remain decimal strings. The formatter groups the integer with `BigInt` and preserves supplied fractional precision, including amounts beyond JavaScript's safe integer range.
- Status modules reference generated constants within each business slice. Unknown states display a translated fallback and cannot enable state-dependent actions.
- Lists and nested lists use backend pagination. Loading, refetching, empty, error/retry and forbidden states are explicit.
- Forms block duplicate writes, retain drafts after failed writes and failed refreshes, and use the shared session `Retry-After` cooldown. An edit form can retry its line query without losing its draft.
- Searches have VI/EN placeholders. Server searches are debounced. The header search finds and opens Finance functions instead of being an inert input.
- Mobile data rows use labeled cards; long forms use the existing shared form surface, and short detail workflows use drawers/dialogs.
- All four Finance namespaces have matching VI/EN key sets: 150 shared, 107 budget, 71 spend and 123 settings keys.

## Mock cleanup and scope

Finance's old datasets, in-memory stores, demo label mappings, simulated financial screens and obsolete demo tests were removed. The Finance runtime has no imports of those fixtures. Static navigation counts, notification badges and the Finance demo identity were removed.

Spending Approver previously imported Finance internals. Its existing sample workflows were moved into its own explicitly labeled `approvals/shared/preview/` modules, with large datasets split into bounded files. That role remains a preview and is not claimed to be API-integrated by this task.

## Backend limitations

- Spend statements/imports, invoices/reconciliation, cost optimization/forecasting, fiscal-period administration and period-close/reporting do not have APIs in this contract. Their old mock actions are replaced by an unavailable state.
- Creating a Cost Center requires `departmentId`, but Finance cannot call the department directory endpoint. The form accepts an explicitly labeled department UUID with guidance; it does not call the forbidden directory API.
- Budget questions and commitments do not expose GET-by-ID operations. A detail outside the current filtered page is identified with guidance to locate its page; the UI does not invent a detail endpoint or silently treat page one as the whole list.
- Plan responses can contain provisioning type `K5`, while the generated list filter accepts only `K1`–`K4`. The UI displays `K5` and sends only filter values allowed by the request contract.
- Live authenticated Finance operations against the shared backend were not exercised. Automated tests use deterministic API fixtures with the real generated operations and shared request adapter.

## Verification

- `pnpm api:validate` and Orval generation from the local snapshot succeeded.
- `pnpm typecheck` and `pnpm build` succeeded. The build retains the repository's large-chunk warnings.
- The final affected test batch covered 23 files and 88 cases. Twenty-two files, including every Finance test file, passed; one Approver decision-filter case exceeded its existing five-second limit. Its repeated role-tree scans were replaced with equivalent label/text queries, and the complete three-case file passed on rerun. The timeout configuration was not increased. All 88 affected cases passed across these runs.
- Final test commands: `pnpm exec vitest run app/features/dashboard/finance app/features/dashboard/approvals app/features/dashboard/dashboard-page.test.tsx app/features/dashboard/dashboard-shell.test.tsx --maxWorkers=1`, followed by `pnpm exec vitest run app/features/dashboard/approvals/approver-list-filters-decisions.test.tsx --maxWorkers=1` for that corrected test file.
- ESLint and Prettier passed for the changed Finance, Approver, dashboard and Finance translation files.
- Source line limits, matching VI/EN keys, residual Finance mock imports, protected-document diffs and `git diff --check` were checked.
- `pnpm check` stops at 27 existing formatting violations outside the task's formatted files. Global ESLint also identified existing unused imports in Employee overview and hardcoded UI text in two Super Admin test files; these unrelated sources were left unchanged.
- Missing existing Super Admin translation keys were added in VI/EN to unblock typecheck, without changing its workflows or protected documentation.
