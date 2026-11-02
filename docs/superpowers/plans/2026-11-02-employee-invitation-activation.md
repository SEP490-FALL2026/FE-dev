# Employee Invitation Activation Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task in the current session.

**Goal:** Complete the existing public invitation page so employees can set a password and proceed to login.

**Architecture:** Keep `/activate-account` and its thin route pointing to `AuthActionPage`. Use the generated redeem API and the existing Query/Axios infrastructure. Test the real route component with MSW at the HTTP boundary.

**Tech Stack:** React 19, React Router 7, TanStack Query 5, Axios, i18next, Sonner, Vitest, Testing Library, MSW.

## Global Constraints

- Approved spec: `docs/superpowers/specs/2026-11-02-employee-invitation-activation-design.md`.
- Password length: 12–128 characters; token maximum: 256 characters; preserve password whitespace.
- Public requests use `skipAuth: true`, `skipAuthRefresh: true`; never retry redemption automatically.
- Keep VI/EN translations, pending protection, persistent invalid-link recovery, and existing non-activation behavior.
- No generated code, protected rule files, commits, push, deployment, or new dependencies.
- Work in the supplied checkout on `phuDev`; auth files are clean, while unrelated user changes elsewhere must be preserved.

## Task 1: Token intake and public request boundary

Files: `app/features/auth/auth-action-page.tsx`; create `app/features/auth/invitation-activation.test.tsx`.

- [x] Add MSW tests against the actual `ActivateAccountRoute` for absent/query-only/blank/oversized/duplicate tokens, fragment removal, and preserving the raw password in `{ token, password }`.
- [x] Run `pnpm vitest run app/features/auth/invitation-activation.test.tsx` and confirm malformed-token cases fail against the current implementation.
- [x] Validate activation fragments during the state initializer:

```ts
const tokens = new URLSearchParams(window.location.hash.slice(1)).getAll('token')
const token = tokens[0] ?? ''
return tokens.length === 1 && token.trim().length > 0 && token.length <= 256 ? token : ''
```

- [x] Remove activation fragments even when rejected; retain reset-page behavior. Guard submission when activation has no usable token.
- [x] Confirm no Authorization or auth refresh is sent, no redemption happens on mount, and pending submission cannot emit a second request.

## Task 2: Completion and recoverable errors

Files: `app/features/auth/auth-action-page.tsx`; VI/EN `app/shared/i18n/locales/*/auth.ts`; invitation test file.

- [x] Add failing tests for successful navigation to `/login`, uncertain server/network outcomes, and password-policy accessibility.
- [x] On activation success, retain the existing success toast and call `navigate('/login', { replace: true })`.
- [x] Explicitly set mutation `retry: false`. For activation-only server errors with status >= 500 or absent response, choose `actions.activate.uncertainResult`; explain trying login with the chosen password before manual retry. Preserve validation and rate-limit messages.
- [x] Keep an activation-specific invalid-link hint that also mentions signing in if the user already submitted successfully or lost the response.
- [x] Represent local validation as `'mismatch' | 'policy' | null`, translate at render, and connect the correct input to its error description. Mark BE password-policy errors on the password field.
- [x] Test field validation, invalid invitation, 503/manual retry, network failure, 429 cooldown, and both languages. Include a failed 401 response proving the public request cannot trigger refresh.
- [x] Run invitation and existing auth tests; check reset/forgot behavior remains valid.

## Task 3: Verification and integration notes

Files: create `docs/reviews/2026-11-02-employee-invitation-activation.md`; update plan checkboxes and spec status.

- [x] Format only changed files with `pnpm exec prettier --write <files>`.
- [x] Run `pnpm vitest run app/features/auth`, `pnpm typecheck`, and `pnpm check`; report unrelated workspace failures separately.
- [x] Review scoped diff for authorization, token disclosure, unintended retries, translation completeness, and file sizes below 500 lines.
- [x] Record the FE URL `${APP_PUBLIC_URL}/activate-account#token=...`, confirmed API contract, test evidence, and the limit that the BE email template/live delivery has not been exercised.
- [x] Obtain a focused code review and resolve material findings. Leave changes in the workspace for the user.
