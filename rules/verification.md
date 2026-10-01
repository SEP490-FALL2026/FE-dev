# Verification

Paths in backticks below are relative to the repository root unless stated otherwise.

## Commands

```bash
pnpm install --frozen-lockfile
pnpm api:validate
pnpm api:generate
pnpm dev
pnpm test
pnpm check
```

Run `pnpm api:generate` after every `openapi/openapi.yaml` change. Before handing
off a change, run the smallest relevant check and then `pnpm check` for a complete
feature or architecture change.

Use the pinned package manager; on Windows use `pnpm.cmd` when PowerShell blocks
`pnpm.ps1`, without changing machine policy. For documentation-only changes, verify
changed-file formatting, links and diff; a full app build is unnecessary.
`pnpm check` does not run API generation or prove connectivity to a real backend.

## Quality rules

- Preserve strict TypeScript; do not introduce `any` to bypass a contract.
- Add behavior-focused tests next to features. Prefer accessible queries.
- Keep a clean browser console and verify changed routes in a real browser.
- For changed routes, check refresh/deep links through the host fallback, accessible
  headings/controls, and request URLs against the API contract; check duplicate
  requests. Report the tested locale/viewport and whether MSW or real BE was used.
- Keep loading, empty, error, and permission-denied states explicit for API screens.
- Do not manually edit `pnpm-lock.yaml`; change dependencies through pnpm.
- Do not commit `.env`, build output, coverage, or generated React Router types.
- Update `ARCHITECTURE.md` when changing a boundary, public interface, rendering
  model, API generation policy, or deployment assumption.
- A page/screen is composition; a component is presentation; a hook is stateful
  orchestration; a model is pure data transformation. Do not put all four jobs in
  one 300-line component.
- Before adding a new helper, search for an existing equivalent. Before promoting
  code to `shared`, identify at least two real consumers and remove domain naming.
- Refactor AI output in the same task: split mixed responsibilities, remove duplicate
  fetching/state, replace hardcoded copy with i18n keys, and add behavior tests. A
  passing render with known structural debt is not "done".
