# Spending Approver API integration

**Goal:** Replace the Spending Approver demo with the operations documented in `../docs/Figma UI-UX/API-Integration/roles/spending-approver.md` and the reviewed local OpenAPI snapshot.

**Architecture:** Generated Orval queries/mutations own server data. Vertical slices own draft forms, typed statuses and views. Shared role UI owns loading/error/empty states, pagination, accessible controls and feedback. Preserve all pre-existing Finance and generated changes; leave protected rule documents unchanged.

**Constraints:** VI/EN copy, no production fixtures, no hand-edited generated clients, exact decimal money, one primary action, mobile cards, no fabricated endpoints or client decisions. Continue in the current user workspace because pending integrations are dependencies of this task. Do not commit or publish.

- [x] Generate missing spend approvals, spend submission and notification operations from the local snapshot, preserving existing tags.
- [x] Build shared accessible UI, error translation, Retry-After handling and mutation cache recovery; meaningful integration tests use the real Axios client with an isolated adapter.
- [x] Replace annual-budget demo with version list/detail/lines/history and approve/reject/request-changes actions, plus read-only proposals. Pending mutations block duplicates; own-version and stale-version errors refresh authoritative state.
- [x] Replace Request queue/detail with spend list, detail, budget check and paged years, Finance opinion and questions, individual/group decisions and explicit overrides; add batch read/decision with per-item skipped results.
- [x] Replace overview with server totals and assigned need notifications; allow the documented need-decision operation with its required plan/term confirmations.
- [x] Replace unsupported optimization, overage, exception ledger and historical spend reports with honest unavailable states; preserve useful old URLs. Renewal Requests use the same authoritative spend detail and decision flow. Remove all obsolete role mock stores/components/tests and replace tests with API behavior coverage.
- [x] Add contextual search placeholders and functioning navigation/search where contract permits. Do not present filtering of one page as a global search.
- [x] Run API validation, scoped integration tests, typecheck, lint, formatting and full `pnpm check`; inspect diff and line counts. Workspace failures outside this role are recorded in `docs/spending-approver-api-integration.md`.

**Verification cases:** Queue paging changes query parameters; empty/error responses never show fixtures; decision body uses APPROVE/REJECT and rejection reason; insufficient/no-budget approval requires explicit reason/years; group decisions cover confirmed beneficiaries across pages; batch SKIPPED is not success; year/version changes invalidate related caches; mutation failures preserve drafts; unknown statuses disable writes; placeholders disappear naturally while typing.
