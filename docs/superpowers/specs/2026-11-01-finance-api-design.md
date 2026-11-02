# Finance API integration

Implement the Finance role against the checked-in OpenAPI snapshot and the integration documentation for BE `25d524477406`. Preserve the existing dashboard shell, role guard and visual tokens. Do not edit the three protected rule documents.

## Contract and UX

- Generate Orval clients for cost centers, proposals, budget versions, current budgets, commitments, Finance reviews, budget information and exchange rates. Use the existing currency, department, vendor and catalog clients.
- Organize screens by business slice. Separate proposal intake from budget versions and from current approved budgets. Finance may return proposals, create/revise/edit/send versions, move approved line windows, review exceptions, answer questions and release commitment remainders. It cannot approve its own budget or decide spending.
- Use generated status constants through domain enum files. Unknown codes display a translated fallback and disable dependent actions. Read the entire response envelope correctly.
- Keep amounts as decimal strings. Never add monetary values using floating point, infer reporting currency from VND, or present page subtotals as organization totals.
- Paginate server lists and nested lists. Expose only filters supported by the corresponding operation; label UUID lookup fields explicitly. Search fields have meaningful translated placeholders that disappear during entry.
- Every screen supports loading, fetching, empty, errors/retry and forbidden states. Mutations retain drafts on failure, block duplicate submission, show pending progress, map error codes to VI/EN messages and invalidate dependent queries after confirmed writes or ambiguous results.
- Retain old deep links where practical by routing them to the corresponding supported workflow. Screens for spend imports, fiscal-period editing, invoices/reconciliation, forecasting, optimization and financial period reports show an unavailable state because G7–G10 APIs do not exist in this revision. No fabricated statistics or successful writes.
- Add missing Finance operations for Cost Center management, exchange rates and vendor tax profiles. Use short modal forms or side drawers according to field count. Responsive tables become labeled cards on mobile.

## Legacy cleanup

Remove Finance demo views, local stores and datasets from its runtime graph. Spending Approver currently imports Finance internals; preserve its existing preview behavior in an explicitly owned Approver preview module while removing that cross-role dependency. This task does not claim to integrate Spending Approver. Delete Finance-only mock files and replace obsolete demo tests with API behavior tests.

## Verification

Test actual request paths/payloads, nested pagination, loading/error/empty states, unknown statuses, exact money formatting, mutation failure draft retention and pending submission guards. Run OpenAPI validation/generation, relevant Vitest tests, typecheck and the repository check command. Report any unrelated baseline failures separately.
