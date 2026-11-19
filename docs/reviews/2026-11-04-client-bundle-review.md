# Client bundle review

The user requested a fix for the remaining large-bundle warning. The original production assets exceeded the default 500 kB threshold: dashboard-page was 1,233.92 kB and theme-provider was 687.92 kB. The new artifact budget check failed against both original assets before the implementation.

## Changes

- The existing public role barrels now expose lazy screen entries. Navigation metadata remains synchronous. Unused eager view exports were removed from the IT Admin, Approver and Super Admin public entries so they cannot pull screen implementations into the shared shell.
- The fallback dashboard, including its charts, loads on demand. Each role has a localized loading state inside the shell.
- Common/authentication/error/theme/not-found translations remain available synchronously. Other typed namespaces load through native imports in an i18next backend. The sidebar requests only the current role's translations.
- Tests explicitly seed their translation resources and wait for lazy screens. Test-only imports prepare screen modules before assertion timeouts; production code retains deferred downloads.
- `pnpm build` now runs `scripts/check-client-bundles.mjs`, which fails if any emitted client JavaScript chunk exceeds 500,000 bytes. The Vite warning threshold and dependencies were unchanged.

## Measured production output

| Client asset             |      Before |     After |
| ------------------------ | ----------: | --------: |
| Dashboard shell          | 1,233.92 kB |  48.53 kB |
| Shared provider          |   687.92 kB |  64.25 kB |
| Largest individual chunk | 1,233.92 kB | 383.57 kB |

There are 154 JavaScript chunks. No chunk exceeds 500 kB. The largest is the deferred fallback dashboard/chart chunk. Splitting increases the number of requests; actual latency depends on hosting, HTTP caching and compression. The default dashboard translation namespace still contains several legacy role sections; those can be separated later if measurements justify further work.

## Verification

- The production build and 500 kB artifact budget passed. There were no large-chunk or ineffective-dynamic-import warnings. Rolldown plugin timing diagnostics remain a separate build-time observation.
- Final `pnpm typecheck` passed after the sidebar and public-entry changes.
- Final `pnpm check` passed end to end: repository formatting, lint, TypeScript, **130 files / 598 Vitest tests**, **3 Node tests**, production build and the 500 kB artifact budget. An earlier run encountered a 5-second first-load Manager timeout; preparing lazy screen modules outside assertion timeouts resolved it without changing the timeout configuration.
- Production-preview Network checks covered all six roles with intercepted synthetic API data: each requested its own screen chunk, IT requested no unrelated role translations/views, and an unauthenticated dashboard visit redirected to login without downloading the dashboard shell or role screens. There were no runtime exceptions or failed resource requests.
- Final IT browser checks covered navigation, catalog and assessment dialogs, renewals, transfers, purchase documents, Vietnamese/English switching, 375px mobile layout, keyboard focus and active button styling. There were 24 read requests, no business writes and no runtime exceptions.
- Final diff review was a self-review. No API contracts, authorization rules, protected convention documents, shared backend data or dependencies changed in this follow-up. SHA-256 comparison confirmed that AGENTS.md, ARCHITECTURE.md and UI_UX_DESIGN_GUIDELINES.md match the pre-follow-up baseline. The temporary production preview and isolated browser were stopped after verification.

Local evidence: `../../../scratch/bundles-build-2.log`, `bundles-typecheck-final.log`, `bundles-network-result.json`, `bundles-it-browser-final.log` and `bundles-check-final.log`.

Implementation references: [React lazy](https://react.dev/reference/react/lazy), [i18next partial bundled resources](https://www.i18next.com/how-to/add-or-load-translations), [backend interface](https://www.i18next.com/misc/creating-own-plugins).
