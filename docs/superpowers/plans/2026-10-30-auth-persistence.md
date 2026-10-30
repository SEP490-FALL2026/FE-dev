# Auth persistence implementation plan

**Goal:** Persist the BE token pair in Local Storage so reopening the web app can restore authentication.

**Design:** Keep the existing auth adapter, generated operations, single-flight refresh and `/me` role lookup. Store the complete token response atomically as JSON under `saas-sentry.auth-tokens`. Hydrate a valid access token before `/me`; refresh expired tokens through the existing endpoint. Read the previous Session Storage refresh token for migration, removing it after successful rotation. Keep tokens in memory when storage is unavailable. Logout and invalid sessions clear both stores and the query cache.

**Scope:** No generated code, API contract, environment, UI or unrelated workspace changes. The owner's request authorizes persistent browser token storage in place of the previous session-only policy. No commits of the existing dirty worktree.

- [x] Add failing regression tests for login persistence, reopening with a valid token, expired access token refresh, invalid-session cleanup, logout, and unavailable storage.
- [x] Implement storage validation and token lifecycle integration; preserve legacy refresh-token migration.
- [x] Update existing auth tests and auth documentation to describe the new storage policy.
- [x] Run focused tests, typecheck and `pnpm check`; report check failures separately.

Verification: 43/43 focused auth/API/route tests passed; TypeScript, production build, authored-file ESLint,
Prettier and `git diff --check` passed. The final full Vitest run passed 185/187 tests; two dashboard filter
tests timed out at 5000 ms (`finance/list-filters-spend.test.tsx` and `approvals/approver-list-filters-queue.test.tsx`).
`pnpm check` stopped at 92 formatting warnings outside the files changed for this task. No unrelated files were reformatted.
