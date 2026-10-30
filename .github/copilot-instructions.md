# SaaS-Sentry Web instructions

Use `AGENTS.md`, `ARCHITECTURE.md`, `UI_UX_DESIGN_GUIDELINES.md`, and `CODEX.md` as canonical guidance.
This is React Router Framework Mode configured as an SPA with Tailwind CSS v4.
- Obey UI/UX Guardrails in `UI_UX_DESIGN_GUIDELINES.md`: Single primary CTA, table text left / numbers right with tabular-nums, locked `h-screen` App Shell, responsive card stack on mobile, no AI buzzwords, no emojis as UI icons.
- Keep route modules thin, use TanStack Query for remote state, and generate API code with Orval. Never hand-edit generated files.
- Add tests and run the relevant pnpm quality gates (`pnpm typecheck`, `pnpm test`) before proposing completion.
- Use typed vi/en i18n keys for every user-visible/accessibility string, and preserve the generated `api/<tag>`, `contracts/<tag>`, `mocks/<tag>` contract structure.
