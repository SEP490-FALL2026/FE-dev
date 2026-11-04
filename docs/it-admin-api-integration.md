# IT Admin: API integration

Implementation uses `openapi/openapi.yaml` and the Orval-generated operations. On 03/11/2026 the live OpenAPI contained 302 operations and was identical to the existing local snapshot; this change did not edit or regenerate the contract. Flow/reference documentation is under `../docs/Figma UI-UX/API-Integration/`. The current review and verification are recorded in [03/11 contract and UI review](reviews/2026-11-03-it-admin-contract-ui-review.md); verification further below describes the earlier integration.

## Supported screens

| Screen                       | Backend operations and behavior                                                                                                                                                                                                                                                                                                            |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Overview                     | `itAdminDashboardGet` supplies department scope, business date and nine operation sections. COUNTED, AT_SOURCE and NOT_AVAILABLE remain distinct; missing sources never become zero. SaaS issue links use `scope=assigned`, not the reporter's `mine` scope.                                                                               |
| Provisioning                 | Task queue, approved request queue and expired rights; grant, claim, evidence completion, failure, available retry/hand-off/close/cancel decisions, revocation completion and access-cut recording. Service-account boundary review supports accept/reject with backend prerequisites.                                                     |
| Software catalog             | Application create/edit/retirement, plan create/edit, subscription create/edit/completion and seat usage. Draft completion supports exchange-rate recovery after Finance records the rate.                                                                                                                                                 |
| Initial seat baseline        | Purchased subscription or internal K5 plan import, preview, paginated row errors, confirmation/cancellation and organization-wide baseline closure. Confirmation preserves its idempotency key for the same import preview.                                                                                                                |
| License keys                 | K4 subscription selection, masked paginated keys, batch import and explicit confirmed reveal. Secret values stay out of Query/Mutation result data and hide on timeout, blur, backgrounding or navigation. A late reveal response cannot undo hiding.                                                                                      |
| Offboarding                  | Case detail, checklist, rights, open requests/tasks, account-lock evidence, selected revocations, eligible request cancellation and guarded closure. Service-account responsibility transfer and IT-authorized handover confirmation address closure prerequisites. Recording lock evidence does not perform the external account lock.    |
| SaaS issues                  | List/state filter, detail, paginated conversation, messages, supported state transitions and duplicate linking. A vendor ticket reference is optional; no message is sent to the vendor.                                                                                                                                                   |
| External software assessment | `assessmentQueueList` supplies paginated rows, readiness, missing field count and `canAct`. Identifier/deep-link access checks requester and beneficiary IDs before allowing assessment. Registered fulfillment plans are selected independently of equivalent-tool suggestions, checked with `planGet` and reread before linking.         |
| Renewals                     | List and state/late filters, case detail, proposal, outcome recording, server seat ranking, active subscription cancellation dates and deadline events. REDUCE sends only the remaining quantity; confirmed periods use strict conditional nextPeriod payloads. IT does not call the spending decision operation.                          |
| Terms and ownership          | Paginated term-review warnings, per-plan terms and opinion history, editable declared terms, informational Business Owner opinions, departed-owner warnings and today's owner retirement confirmation. Uncertain append-only writes preserve drafts and block blind resubmission.                                                          |
| Contracts and documents      | Create/read a contract, read a document, declare/upload/verify/attach a file, or attach an existing uploaded file. Signed upload URLs stay out of Query/Mutation results; storage requests omit authentication credentials. File opening obtains a fresh short-lived link. There is no contract list API, so lookup uses saved references. |
| Technical transfers          | IT work on recorded department transfers, server list/filter/pagination, case detail, closure prerequisites, service-account responsibility reassignment and authorized handover confirmation. Personnel event creation remains outside the IT role.                                                                                       |

## Contract limits

- Assessment queue, renewal and dashboard APIs are available and integrated. Completed assessments awaiting a registered fulfillment plan can still be opened by their saved request reference; the assessment queue itself lists the assessment stage.
- No department requestability-rule endpoint exists; the catalog accurately represents organization applications/plans/subscriptions.
- Usage imports/telemetry, usage identity matching, ghost-seat recommendations and cost reconciliation still lack contracts. Their tabs explain availability; they contain no sample records or simulated writes. Contract attachments do not calculate purchased-seat discrepancies or replace an invoice/OCR workflow.
- Backend authorization and business prerequisites remain authoritative. Business mutations are tested with isolated fixtures. Read-only smoke checks use both supplied demo IT accounts; only login/logout lifecycle requests are sent as writes to the shared server.

## State and UI rules

- DTOs and enum adapters reference generated contracts. Each slice owns its `enums/`; unknown states show translated fallbacks and do not acquire actionable defaults.
- Server data lives in TanStack Query. Forms keep drafts on errors, block duplicate writes, and use Sonner feedback. Import confirmation is the explicitly idempotent retry path.
- Query keys come from Orval. Assignment mutations refresh departure prerequisites and seat availability; subscription changes refresh seat usage and active baseline previews.
- Plan/subscription editors wait for a fresh opening snapshot, synchronize pristine fields, and preserve dirty drafts while blocking stale writes until explicit reload.
- Search and identifier lookup include VI/EN placeholders. Application search debounces before sending its server filter. Mobile inputs use 16px text; forms use modal/drawer/page surfaces according to size.
- Role forms provide persistent labels, contextual examples, accessible input descriptions, selected/pressed/focus styles and custom choice controls. Optional directory lookup uses active departments and scoped technical-member APIs; it never calls a Super Admin personnel endpoint.
- Group departure closes the departing employee's line; individual departure cancels the request. Both support a separate rollback-evidence field. Rights and expiry work expose available handover instructions and fresh confirmer permissions without inferring an execution gate from the due date.
- Subscription editing distinguishes declared cancellation deadlines from inferred unconfirmed dates. Saving unrelated fields never silently confirms the inferred date. Subscription changes invalidate renewal and terms-warning data.
- Failed grants offer withdrawn-task cancellation only after the linked request confirms a withdrawal. The failure status alone does not enable cancellation.
- The IT workspace has no static badge counts, demo identity, generated credentials or client-simulated success branches. Other roles' existing demo modules remain outside this integration's scope.

## Review and verification

Unit/component coverage exercises request parameters, server pagination, permissions and state gates, pending writes, draft retention, import idempotency, stale-cache editing, cross-screen invalidation and secret reveal lifecycle. Browser smoke checks cover the locked shell, desktop and 375px layout, search placeholder/input sizing, form width and explicit unavailable states, using intercepted API fixtures only.

Repository-wide formatting/lint issues outside this change are reported separately in the handoff; they are not silently reformatted as part of IT integration. Protected rule documents were left untouched, including the user's pre-existing edits.

### Final verification

- `pnpm api:validate`: passed against the local OpenAPI snapshot.
- `pnpm typecheck`: passed. The catalog-link reader explicitly narrows the API's request/draft response union before checking eligibility.
- `pnpm build`: passed; the existing large-chunk warning remains.
- ESLint and Prettier checks scoped to the changed handwritten source: passed. All changed handwritten TypeScript files are within the 500-line limit.
- `node --test scripts/*.test.mjs eslint-rules/*.test.cjs`: 3 passed.
- Full Vitest run (`--maxWorkers=1`): 255 passed, one existing Approver filter test exceeded the default 5-second timeout. All 48 IT Admin tests across 20 files passed; no assertion failures were reported.
- Isolated rerun of `approver-list-filters-queue.test.tsx` with `--maxWorkers=1 --testTimeout=15000`: all 3 tests passed. The repository's default test timeout was not changed.
- Chrome on the final build: desktop 1440px and mobile 375px passed; no body overflow, mobile form width 369px, search placeholder present and input text 16px. No runtime exceptions or backend writes.
- `pnpm check` stops at 24 existing formatting violations outside this change. A separate repository-wide lint run reports two existing unused imports (`ArrowRight`, `useState`) in `employee/overview/views/employee-overview-view.tsx`. These files were not reformatted or modified.
