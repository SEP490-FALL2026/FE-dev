# Client bundle loading plan

**Goal:** Remove the production warning for JavaScript chunks above 500 kB and avoid loading other roles' screens at dashboard entry.

**Architecture:** Keep navigation metadata behind each role's existing public barrel. Export lazy screen entries from those barrels, with a localized loading state inside the dashboard shell. Keep common translations synchronous for startup/error rendering; load other typed namespaces through an i18next backend using native dynamic imports. Keep full resources available for type inference and translation parity tests only.

**Constraints:** No dependencies, API or permission changes; no warning threshold increase. Preserve Vietnamese/English, stored language, role guards, thin routes and current UI. No commits or protected documentation edits.

- [x] Add a production artifact budget check; demonstrate failure against the existing 1,233.92 kB / 687.92 kB chunks.
- [x] Add lazy screen entries for the six roles and defer the fallback dashboard charts. Preserve role public barrels; remove unused eager view exports from the IT, Approver and Super Admin barrels.
- [x] Split translation loading by namespace and language; test loading, language switching, and error propagation. Explicitly seed translations in existing integration tests that assume synchronous resources.
- [x] Run targeted dashboard and translation tests, typecheck, then `pnpm check`; inspect emitted sizes. Final complete gate passed: 130 test files / 598 Vitest tests, 3 Node tests, formatting, lint, TypeScript, production build and the 500 kB budget.
- [x] Verify production network requests for guests and authenticated roles, navigation and language changes in an isolated browser. Review the final diff and record evidence.

The user authorized implementation directly. This plan applies the debugging, brainstorming, writing-plans, test-driven-development and verification-before-completion workflows without adding an approval stop.

References: [React lazy](https://react.dev/reference/react/lazy), [i18next partial bundled resources](https://www.i18next.com/how-to/add-or-load-translations), [i18next backend interface](https://www.i18next.com/misc/creating-own-plugins).
