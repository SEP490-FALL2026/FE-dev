# OpenAI Codex Agent Guidance — SaaS-Sentry Web

This file provides system instructions and operational rules for **OpenAI Codex**, **Codex CLI**, and **GitHub Copilot Workspace** agents working in `c:\fe_capstone\FE-dev-main`.

---

## 1. Canonical Sources of Truth
Codex **MUST** read and strictly adhere to these three source files before inspecting or altering code:
1. **[AGENTS.md](file:///c:/fe_capstone/FE-dev-main/AGENTS.md)**: Operational source of truth, boundaries, i18n policy, quality gates.
2. **[ARCHITECTURE.md](file:///c:/fe_capstone/FE-dev-main/ARCHITECTURE.md)**: Vertical slice architecture, role structure, dependencies.
3. **[UI_UX_DESIGN_GUIDELINES.md](file:///c:/fe_capstone/FE-dev-main/UI_UX_DESIGN_GUIDELINES.md)**: Mandatory UI/UX constraints and Anti-AI design guardrails.

---

## 2. Mandatory UI/UX Design Constraints (Anti-AI Guardrails)

When designing, updating, or refactoring components and layouts, Codex **MUST NOT** generate typical "AI-looking" interfaces. Strictly apply these 8 core rules:

### Rule 1: Locked App Shell (No Broken Scrolling)
- Lock the viewport: `<div className="flex h-screen w-full overflow-hidden bg-background">`.
- Header and Sidebar **MUST remain fixed**.
- Only the main content area scrolls independently: `<main className="flex-1 overflow-y-auto px-6 py-8">`.
- **FORBIDDEN**: Allowing the entire `body` to scroll, which breaks sticky headers and sidebars.

### Rule 2: Single Primary CTA & No Table Row Button Spam
- In any screen, header, or dialog, allow **EXACTLY ONE Primary Button** (`bg-primary text-primary-foreground`). All other buttons must be Secondary (`variant="outline"`) or Ghost (`hover:bg-surface-subtle`).
- **FORBIDDEN**: Placing `[Edit]` (blue), `[Delete]` (red), and `[View]` (gray) buttons on every table row.
- **MANDATORY**: Group row actions into a single `...` Dropdown Menu (`<MoreHorizontal className="w-4 h-4" />`), or show subtle icon actions only on row hover (`opacity-0 group-hover:opacity-100`).

### Rule 3: Strict Table Data Alignment & Text Defense
- **Text / Names / Emails / Roles**: `text-left truncate max-w-[200px]` with `title={fullText}`.
- **Numbers / Currencies / Percentages / Dates**: `text-right font-mono tabular-nums`.
- **Status Badges**: `text-left` or `text-center`, compact with indicator dot (`● Active`).
- **Actions Column**: `text-right sticky right-0`.
- **FORBIDDEN**: 4-sided borders around each cell (Excel gridlines). Use only subtle horizontal borders: `border-b border-border/40`.

### Rule 4: Responsive Form Layouts & Surface Decisions
- Form Surface Decision Tree:
  - 1–3 inputs (simple confirm/edit): **Modal / Dialog** (`max-w-md` or `max-w-lg`).
  - 4–10 inputs (workflows, approvals, filters): **Slide-over Drawer from the right** (`w-[480px]` - `w-[640px]`).
  - > 10 inputs (complex onboarding, annual budgets): **Dedicated Page Route**.
  - **FORBIDDEN**: Cramming a 15-field form into a tiny centered modal.
- Form Grid: Group related short inputs (Zipcode, Start/End date) into 2 columns (`grid grid-cols-1 sm:grid-cols-2 gap-4`). Never stretch a 6-character input to 100% width across an 800px screen.
- Error validation: Reserve space (`min-h-[20px]`) so appearing errors do not cause layout shifts.

### Rule 5: Concentric Border Radii & Top-Down Lighting
- Always apply the concentric radius formula:
  $$\mathbf{R_{\text{inner}} = R_{\text{outer}} - \text{Padding}}$$
  - **FORBIDDEN**: Placing `rounded-xl` inside a `rounded-xl` card.
- Avoid `rounded-full` everywhere: Professional B2B enterprise UI uses crisp radii: `rounded-md` (6px) or `rounded-lg` (8px). Only use `rounded-full` for circular user avatars and tiny notification dots.
- Use top-down subtle lighting: Subtle inset top highlight (`shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]` or `border-t-white/10`).
- Use alpha borders: `border-black/[0.08]` (light) or `border-white/[0.12]` (dark). **NEVER** use dead hard hex colors like `#E5E7EB`.

### Rule 6: Interaction & Zero Layout Shift
- **FORBIDDEN**: Changing `border-1` to `border-2`, or changing `font-normal` to `font-bold` on hover or active state.
- Keep dimensions identical; only transition subtle colors: `hover:bg-surface-subtle transition-colors duration-150`.
- **FORBIDDEN**: `hover:scale-105` bouncy card animations on dashboard data cards.

### Rule 7: Zero AI Slop Copywriting & No Emojis in Functional UI
- **FORBIDDEN BUZZWORDS**: "Unleash", "Elevate", "Seamless", "Supercharge", "Next-Gen", "Dive in", "Revolutionize".
- **FORBIDDEN**: Exclamation marks (!) in titles, alerts, or button labels.
- **FORBIDDEN**: Adding long redundant text descriptions under self-explanatory section titles.
- **FORBIDDEN**: Using emojis (🚀, 🔥, ⚡, 💡) as UI action icons.
- **MANDATORY**: 100% `lucide-react` icons with uniform `strokeWidth={1.5}`.

### Rule 8: Mobile Responsive Standards
- Tables **MUST** transform to a **Card Stack** (`md:hidden flex flex-col gap-3`) on mobile screens, or provide smooth horizontal scroll with shadow indicators.
- Modals on mobile should dock to bottom as **Bottom Sheets**.
- **iOS Safari Auto-zoom Defense**: Inputs and selects **MUST** use `text-base md:text-sm` (minimum 16px font size on mobile to prevent Safari viewport auto-zooming).
- Touch target minimum: 44x44px on mobile, 32x32px on desktop.

---

## 3. Architecture & Code Boundaries
- **Dependency Flow**: `routes -> features -> entities -> shared`.
- **Route modules MUST remain thin**: Max ~50 lines, delegate to `app/features/<feature>`.
- **Zero Hardcoded Text**: 100% of user-visible strings must use `useTranslation()` with typed keys in both `vi` and `en` locale files.
- **File Length Limit**: Any `.tsx` or `.ts` file exceeding **500 lines** is a strict violation. Decompose into components, hooks, or enums.
- **API Generated Code**: Never hand-edit `app/shared/api/generated/`. Update `openapi/openapi.yaml` and run `pnpm api:generate`.

---

## 4. Verification Commands for Codex
Before concluding any task, Codex must ensure:
```bash
pnpm typecheck   # Must exit with 0 errors
pnpm check       # Lint, prettier, typecheck, tests, and build
```

