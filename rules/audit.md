# Audit frontend code, UX and business behavior

## Trigger and inputs

Use for a diff, feature or workflow review. Identify scope, expected F/UF/FR behavior, actor, API snapshot and whether the review uses mocks or a real backend. Read [context](context.md) and the topic rules selected in [README](README.md).

## Procedure

1. Follow route → public feature API → page → hook/model → generated API. Look for private cross-feature imports, duplicated remote state, generated edits and production mock dependencies.
2. Compare actions and states with backend authority: request approval versus completed provisioning, failed/pending mutations, missing evidence versus inactivity, permission scope, two savings values and data freshness.
3. Exercise loading/empty/error/forbidden/success states that the screen supports. Inspect request payload/status and query invalidation; a screenshot is insufficient for behavioral claims.
4. Check vi/en keys, numbers/currency/date display, keyboard navigation, labels, focus, responsive layout and visible error recovery. Inspect both DOM/behavior and visual output for relevant routes.
5. Examine identity/cache boundaries and sensitive data in persistence, URL, logs or responses. Hidden controls are not proof of backend authorization; flag a BE dependency separately when it cannot be verified here.
6. Validate each finding with a concrete action or code path. Separate business mismatch, functional bug, accessibility issue and subjective visual suggestion.

## Output and completion

Each finding: **severity · file:line or route/control · reproduction · actual/expected · evidence · correction**. Order by user/data impact and include tested locales, viewports, mock/real mode and limitations. Report no findings only within the actual inspected scope.

An audit request alone does not authorize silent feature rewrites. When fixes are also requested, retain the findings and apply [debug](debug.md), then recheck the affected behavior. Do not create permanent reports for every tiny review unless requested; an inline review is sufficient.
