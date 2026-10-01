# Debug frontend behavior

## Trigger and inputs

Use for a broken route, UI interaction, request or state transition. Read [context](context.md), [verification](verification.md) and the relevant topic rules. Capture route/search params, locale, viewport, actor scope, reproduction steps, console/network evidence and whether MSW is active. Sanitize screenshots and payloads.

## Procedure

1. Reproduce the reported interaction, including refresh/deep-link/back navigation when relevant. Identify whether the failure exists with the real backend, mocks or both.
2. Follow route → feature → hook/query → generated transport → response → mapper → presentation. Compare the network shape/status with OpenAPI before blaming rendering.
3. Classify the failure: routing/base URL, stale cache/key, mutation invalidation, API contract, presentation, translation or focus/accessibility. Change one hypothesis at a time.
4. Check duplicate requests, identity changes and query error handling. Do not clear all state on every render, cast around missing fields or install a fake success fallback. A backend 503 is not proof the user needs to log in again.
5. Put behavioral regression tests beside the owning feature/model. Use MSW when network/cache behavior matters and exercise the failure response, not only a happy fixture. Verify simple visual/copy fixes directly.
6. Correct the source: OpenAPI/config for generated defects, shared translation resources for copy, feature for orchestration. Run relevant checks and revisit the actual route in the browser.

## Completion evidence

Report root cause, before/after interaction, tests, browser/locale/viewport and mock versus real API. Say precisely what could not be exercised. A green build or screenshot alone does not prove the request workflow works.
