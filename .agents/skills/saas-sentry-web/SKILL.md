---
name: saas-sentry-web
description: Use when implementing, debugging, reviewing, testing, or generating API code in the SaaS-Sentry React Router web client, especially for route modules, feature boundaries, TanStack Query, Orval, Faker/MSW mocks, or frontend quality gates.
---

# SaaS-Sentry Web

Build changes that preserve the repository's modular boundaries and leave evidence
from the relevant quality gates.

## Workflow

1. Read [AGENTS](../../../AGENTS.md), follow its [task router](../../../rules/README.md),
   and read the relevant architecture sections. Paths in Markdown links are relative
   to this skill; command and source paths are relative to the frontend root.
2. If the task touches routes, loaders, actions, metadata, or rendering, also read
   the [React Router skill](../react-router/SKILL.md) and only its Framework Mode guidance.
3. Inspect the closest route, feature, generated API surface, and tests before
   selecting a boundary.
4. Keep route modules thin. Put user workflows in `app/features`, reusable domain
   presentation in `app/entities`, and generic infrastructure in `app/shared`.
5. For API contract changes, obtain the backend-exported artifact and update
   `openapi/openapi.yaml` through the shared contract handoff in the
   [API rules](../../../rules/api-state.md). For generator-only changes, edit
   `orval.config.ts`. Run `pnpm api:validate` and `pnpm api:generate` as applicable.
   Never hand-edit `app/shared/api/generated` or invent a frontend-only backend
   contract. If BE is unavailable, report the pending handoff; do not claim integration.
6. Keep Faker/MSW imports in test or explicit development-only code.
7. Put every user-visible/accessibility string in both typed `vi` and `en` resources;
   never bypass the hardcoded-UI-text rule.
8. Follow [verification](../../../rules/verification.md). Add behavioral tests when
   behavior needs protection; verify simple copy/style/documentation corrections
   directly. For fixes, cover the regression before correcting the behavior.
9. Report the commands run, exact failures, assumptions, and any remaining risk.

Do not introduce a library, global state container, repository wrapper, or shared
component without a concrete requirement and consumer.
