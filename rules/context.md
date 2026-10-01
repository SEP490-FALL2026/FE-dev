# Context

## Context-loading playbook

Use at task start or handoff. Inspect branch/diff, then select the task and topic
rules from [README](README.md). Read only the relevant `ARCHITECTURE.md` sections,
route, public feature exports, generated operation, translations and tests.

1. Identify the target route/interaction, actor, expected behavior and whether the
   current environment uses MSW or the backend.
2. Trace F/UF/FR when changing business behavior. BRD owns requirements, backend
   owns authoritative data/actions, and frontend owns presentation. A mock fixture
   or stale example cannot override the API contract.
3. Compare current network/type shape, query ownership and UI states before choosing
   where to edit. Load [api-state](api-state.md) for request/cache work and
   [localization](localization.md) for UI strings.
4. Record goal, source paths/IDs, existing implementation, gaps and next check. An
   inline note is sufficient; do not duplicate the BRD into this repository.

Shared [domain guardrails](../../../Docs/rules/domain-guardrails.md) apply to
business tasks; [change workflow](../../../Docs/rules/change-workflow.md) applies
to cross-repo work. If Docs is missing from a standalone checkout, continue
independent technical work, and obtain missing requirements before implementing
unknown behavior. Handoff must distinguish verified behavior from assumptions.

Paths in backticks below are relative to the repository root unless stated otherwise.

## Product scope

- This repository is the production frontend for the SaaS-Sentry MVP.
- The BRD is at
  `../../Docs/Requiments/BRD - HỆ THỐNG QUẢN TRỊ BẢN QUYỀN PHẦN MỀM & TỐI ƯU CHI PHÍ CÔNG NGHỆ.md`.
- The product is a responsive internal business application deployed for one
  organization per instance, not a multi-tenant subscription platform. NestJS owns business rules,
  authorization, persistence, jobs, and the authoritative OpenAPI contract.

## Stack

- React 19 and React Router 8 in Framework Mode with SPA rendering
- Vite 8 and Tailwind CSS 4
- TanStack Query 5 for remote/server state
- Orval 8 for OpenAPI client, hook, Faker factory, and MSW handler generation
- Vitest and Testing Library
- TypeScript strict mode, ESLint flat config, Prettier, pnpm

For React Router work, also read `.agents/skills/react-router/SKILL.md` and its
Framework Mode reference. Do not apply Data or Declarative Mode patterns here.
