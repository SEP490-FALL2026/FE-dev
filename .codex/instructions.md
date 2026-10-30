# Codex Instructions — SaaS-Sentry Web

1. Read and follow `AGENTS.md`, `ARCHITECTURE.md`, and `UI_UX_DESIGN_GUIDELINES.md`.
2. Adhere strictly to the Anti-AI UI guardrails in `UI_UX_DESIGN_GUIDELINES.md`:
   - Single Primary CTA (`bg-primary`); table row actions inside `...` dropdown menu.
   - Text left with `truncate`; numbers/currency/dates right with `tabular-nums font-mono`; actions sticky right.
   - Locked app shell (`h-screen overflow-hidden flex`); scroll only `main.overflow-y-auto`.
   - Concentric radii: $R_{inner} = R_{outer} - padding$. No `rounded-full` everywhere.
   - No AI buzzwords ("Unleash", "Elevate", "Seamless", "Supercharge") and no exclamation marks.
   - No emojis as UI icons; 100% `lucide-react` with `strokeWidth={1.5}`.
   - Responsive mobile: table collapses to Card Stack on `< 768px`, inputs `text-base md:text-sm` (prevent iOS zoom), touch targets >= 44px.
3. Obey `routes -> features -> entities -> shared`.
4. Max 500 lines per file. Zero hardcoded text (100% i18n).
5. Verify changes with `pnpm typecheck` before finishing.

