# Api State

Paths in backticks below are relative to the repository root unless stated otherwise.

## Data and API rules

- Remote state belongs in TanStack Query. Do not fetch remote data from ad-hoc
  `useEffect` calls.
- React Router loaders/actions are for URL-dependent orchestration, redirects, and
  critical prefetch; they are not a second cache.
- `openapi/openapi.yaml` is the committed frontend snapshot of the backend contract.
  Obtain it from the BE export through the shared [contract handoff](../../../Docs/rules/change-workflow.md#4-khi-be-và-fe-cùng-thay-đổi); do not invent a contract only in FE.
- Everything below `app/shared/api/generated/` is generated. Never edit it by hand.
- Every operation must have exactly one declared OpenAPI tag and a unique
  `operationId`. Request body components end in `Request`; successful response
  components end in `Response`. `pnpm api:validate` enforces this before Orval runs.
- Generated output is organized as `api/<tag>` (fetch functions/query hooks),
  `contracts/<tag>` (request/response/domain types), and `mocks/<tag>`
  (Faker factories and MSW handlers). Cross-tag types remain at the contracts root.
- Import Faker factories or MSW handlers only from tests, stories, or explicit dev
  tooling. Never import them into production route/feature code.
- `VITE_*` values are public in browser bundles. Never store secrets there.
- Authorization decisions must be enforced by the backend even when the UI hides an
  action based on role.

## Business UI and mutation rules

- Link new workflows to their relevant `FR`/`F`/`UF` and acceptance criteria. Derive
  available actions from the backend contract/current state, not a hardcoded role
  switch that silently grants access.
- Keep assigned, active, pending, revoked and failed states distinct. An approved
  request or successful invitation does not prove provisioning is complete.
- Never convert missing/old/unmatched usage into zero activity. Present the reason
  evaluation is unavailable, data freshness, coverage and recommendation evidence
  supplied by BE. Manager sees actionable reviews within their scope; the monitoring
  tier is for IT Admin under the current requirements.
- Show immediate and renewal savings separately, with currency, period and
  assumptions. Format authoritative values with locale-aware display; do not
  reconstruct financial calculations or rule-engine confidence in the browser.
- Keep mutation pending/error/success explicit; prevent accidental duplicate
  submissions. Do not optimistically display an approval, revoke or completed
  provisioning before the backend confirms the corresponding state. Use the
  generated query keys to invalidate affected data after confirmed changes.
- Treat validation errors, unauthenticated, forbidden, conflicts and temporary
  service outages as distinct outcomes where the API defines them. A 503 identity
  verification outage must not become an automatic logout loop.
- Review auth/session cache boundaries: clear scoped sensitive server state when
  the signed-in identity changes or logs out. Do not retain another user's data in
  cache or browser persistence. Never store long-lived tokens as a convenience
  fallback while the session contract is unresolved.
- Use semantic controls, associated labels, keyboard access and predictable focus
  for dialogs/errors. Verify changed business screens in both vi/en and relevant
  viewport sizes; translated strings must not silently overflow or lose meaning.
