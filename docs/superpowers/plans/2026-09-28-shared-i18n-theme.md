# Shared i18n and Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split localization into typed locale/role/capability namespaces and add a persistent light/dark theme foundation derived from the supplied reference images.

**Architecture:** `resources.ts` becomes an assembly-only module over locale files, with role-owned business copy under `locales/<locale>/roles/<role>/`. A shared `ThemeProvider` owns the global theme while CSS semantic tokens map the reference palettes to Tailwind utilities used by authored UI.

**Tech Stack:** React 19, React Router 7 Framework Mode SPA, react-i18next 17, i18next 26, Tailwind CSS 4, Vitest, Testing Library

## Global Constraints

- Light is the deterministic default theme.
- Persist theme under `saas-sentry.theme` in `localStorage`.
- Only `light` and `dark` are valid stored theme values.
- Use the exact palette recorded in `docs/superpowers/specs/2026-09-28-shared-i18n-theme-design.md`.
- Authored components use semantic theme utilities instead of Slate/Teal theme colors.
- Every namespace has matching Vietnamese and English modules.
- Create only namespaces with a current consumer.

---

### Task 1: Refactor i18n into typed locale and role namespaces

**Files:**

- Create: `app/shared/i18n/locales/en/common.ts`
- Create: `app/shared/i18n/locales/en/errors.ts`
- Create: `app/shared/i18n/locales/en/not-found.ts`
- Create: `app/shared/i18n/locales/en/theme.ts`
- Create: `app/shared/i18n/locales/en/roles/admin/home.ts`
- Create: `app/shared/i18n/locales/vi/common.ts`
- Create: `app/shared/i18n/locales/vi/errors.ts`
- Create: `app/shared/i18n/locales/vi/not-found.ts`
- Create: `app/shared/i18n/locales/vi/theme.ts`
- Create: `app/shared/i18n/locales/vi/roles/admin/home.ts`
- Modify: `app/shared/i18n/resources.ts`
- Modify: `app/shared/i18n/i18n.ts`
- Modify: `app/shared/i18n/types.d.ts`
- Modify: `app/root.tsx`
- Modify: `app/routes/home.tsx`
- Modify: `app/features/home/home-page.tsx`
- Modify: `app/features/not-found/not-found-page.tsx`
- Modify: `app/shared/ui/language-switch.tsx`
- Modify: existing feature tests

**Interfaces:**

- Produces namespaces `common`, `errors`, `notFound`, `theme`, and `adminHome`.
- Produces typed `resources`, `defaultNS`, `SupportedLanguage`, and `TranslationNamespace` exports.

- [ ] **Step 1: Update feature tests to render copy from explicit namespaces**

Keep the existing behavioral assertions for Vietnamese rendering, English switching, the Not Found link, and translated document titles. The tests must fail after components request the new namespaces but before the namespace resources exist.

- [ ] **Step 2: Create locale modules with the existing copy**

Move sentences without rewriting them. Add theme strings `light`, `dark`, and `switchTo` in both locales.

- [ ] **Step 3: Assemble resources and configure typed namespaces**

`resources.ts` imports locale modules and exports:

```ts
export const defaultNS = 'common' as const
export const resources = {
  en: { common: enCommon, errors: enErrors, notFound: enNotFound, theme: enTheme, adminHome: enAdminHome },
  vi: { common: viCommon, errors: viErrors, notFound: viNotFound, theme: viTheme, adminHome: viAdminHome }
} as const
```

Initialize i18next with `defaultNS`, all namespace names, Vietnamese fallback, and the existing language lifecycle.

- [ ] **Step 4: Update consumers to explicit namespaces**

Use `useTranslation('errors')`, `useTranslation('notFound')`, `useTranslation('adminHome')`, and `useTranslation('common')`. The home route metadata reads `adminHome.metaDescription` from the initialized i18n instance.

- [ ] **Step 5: Run the focused feature tests**

Run `pnpm exec vitest run app/features/home/home-page.test.tsx app/features/not-found/not-found-page.test.tsx`.
Expected: 2 files and 4 tests pass.

---

### Task 2: Add the shared theme state and switch

**Files:**

- Create: `app/shared/theme/theme.ts`
- Create: `app/shared/theme/theme-provider.tsx`
- Create: `app/shared/theme/theme-provider.test.tsx`
- Create: `app/shared/ui/theme-switch.tsx`
- Modify: `app/providers/app-providers.tsx`
- Modify: `app/features/home/home-page.tsx`
- Modify: `app/features/home/home-page.test.tsx`

**Interfaces:**

- `AppTheme = 'light' | 'dark'`
- `DEFAULT_THEME = 'light'`
- `THEME_STORAGE_KEY = 'saas-sentry.theme'`
- `isSupportedTheme(value): value is AppTheme`
- `readStoredTheme(): AppTheme`
- `applyTheme(theme, persist?): void`
- `useTheme(): { theme; setTheme; toggleTheme }`

- [ ] **Step 1: Write failing theme behavior tests**

Cover deterministic light default, invalid stored value falling back to light,
restoring dark, updating `<html data-theme>`, toggling, persistence, and the
translated accessible switch label.

- [ ] **Step 2: Run the theme tests and verify expected failure**

Run `pnpm exec vitest run app/shared/theme/theme-provider.test.tsx`.
Expected: FAIL because the theme modules do not exist.

- [ ] **Step 3: Implement the minimal theme model and provider**

The provider starts with light for deterministic rendering, restores storage
after mount, applies the theme to `<html>`, and exposes stable set/toggle
operations through context.

- [ ] **Step 4: Implement and integrate ThemeSwitch**

Use the `theme` namespace for all visible and accessible text. Place the switch
next to `LanguageSwitch` on the current Home page so both configurations are
immediately testable; the later AppShell will move both controls into the
shared navigation shell.

- [ ] **Step 5: Run the focused theme and Home tests**

Run `pnpm exec vitest run app/shared/theme/theme-provider.test.tsx app/features/home/home-page.test.tsx`.
Expected: both files pass without console errors.

---

### Task 3: Add image-derived semantic theme tokens

**Files:**

- Modify: `app/app.css`
- Modify: `app/root.tsx`
- Modify: `app/features/home/home-page.tsx`
- Modify: `app/features/not-found/not-found-page.tsx`
- Modify: `app/shared/ui/language-switch.tsx`
- Modify: `app/shared/ui/theme-switch.tsx`

**Interfaces:**

- Tailwind utilities: `bg-background`, `bg-sidebar`, `bg-surface`, `bg-surface-subtle`, `text-foreground`, `text-muted-foreground`, `text-primary`, `border-border`, plus success/warning/danger/info tokens.

- [ ] **Step 1: Define light and dark CSS variables**

Define palette variables under `:root, [data-theme='light']` and
`[data-theme='dark']`, then map them through `@theme inline` to Tailwind color
utilities. Set `color-scheme` per theme.

- [ ] **Step 2: Replace authored Slate/Teal theme colors**

Update the current root states, Home cards, Not Found screen, language switch,
and theme switch to consume semantic tokens. Layout/spacing utilities remain
unchanged.

- [ ] **Step 3: Run lint and focused UI tests**

Run `pnpm lint` and `pnpm test`.
Expected: no hardcoded UI text violations and all tests pass.

---

### Task 4: Verify the complete slice

**Files:**

- Verify all files changed by Tasks 1-3.

**Interfaces:**

- Produces a reusable typed i18n/theme foundation for the future AppShell.

- [ ] **Step 1: Run strict dependency verification**

Run `pnpm install --frozen-lockfile --strict-peer-dependencies`.
Expected: lockfile is current and dependency resolution succeeds.

- [ ] **Step 2: Run the complete quality gate**

Run `pnpm check`.
Expected: Prettier, lint, typecheck, all tests, and production build pass.

- [ ] **Step 3: Inspect the final diff**

Confirm `resources.ts` contains assembly only, every locale namespace has a
matching peer, all theme colors come from semantic variables, and generated API
files remain unchanged.
