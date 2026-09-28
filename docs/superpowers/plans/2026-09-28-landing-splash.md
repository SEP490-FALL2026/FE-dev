# SaaS-Sentry Landing Splash Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the temporary Home screen with a responsive, localized SaaS-Sentry splash page featuring continuous product-context animation and static authentication actions.

**Architecture:** Keep `app/routes/home.tsx` as the metadata/route boundary and keep presentation inside `app/features/home/`. Add a pre-auth `landing` i18n namespace, render the mission-control visual as a feature-local component, and reserve token/role redirects for a future route-level slice.

**Tech Stack:** React 19, React Router 7 Framework Mode SPA, Tailwind CSS 4, Motion for React, Lucide React, i18next, Vitest, Testing Library, pnpm.

## Global Constraints

- Brand text is always `SaaS-Sentry` in both locales.
- All visible and accessible copy must come from typed Vietnamese and English i18n resources.
- Login and Register are static controls in this slice; do not add auth routes, token parsing, storage, or redirects.
- Use existing semantic theme tokens only; do not add an unrelated hardcoded color palette.
- Respect `prefers-reduced-motion` and hide decorative animation from the accessibility tree.
- Do not invent savings percentages, customer metrics, or complete Shadow IT detection claims.
- Preserve the dependency direction `routes -> features -> shared`.
- Git metadata is unavailable in this workspace, so implementation steps do not create commits.

---

## File structure

- Create `app/features/home/landing-visual.tsx`: decorative mission-control/evidence-pipeline composition and Motion variants.
- Modify `app/features/home/home-page.tsx`: semantic page shell, header, localized hero content, and static auth actions.
- Modify `app/features/home/home-page.test.tsx`: behavior coverage for localized landing content, auth actions, language, and theme.
- Create `app/shared/i18n/locales/en/landing.ts`: English landing copy.
- Create `app/shared/i18n/locales/vi/landing.ts`: Vietnamese landing copy.
- Modify `app/shared/i18n/resources.ts`: register the typed `landing` namespace and retire `adminHome` from the resource graph.
- Modify `app/shared/i18n/resources.test.ts`: assert locale namespace parity and landing copy shape.
- Modify `app/routes/home.tsx`: use localized landing metadata.
- Create `app/routes/home.test.ts`: verify route title and description metadata.
- Modify `package.json` and `pnpm-lock.yaml` through pnpm: add `motion` and `lucide-react`.
- Delete `app/shared/i18n/locales/en/roles/admin/home.ts` and `app/shared/i18n/locales/vi/roles/admin/home.ts`: remove obsolete bootstrap copy after all consumers move.

### Task 1: Landing localization and route metadata

**Files:**

- Create: `app/shared/i18n/locales/en/landing.ts`
- Create: `app/shared/i18n/locales/vi/landing.ts`
- Modify: `app/shared/i18n/resources.ts`
- Modify: `app/shared/i18n/resources.test.ts`
- Modify: `app/routes/home.tsx`
- Create: `app/routes/home.test.ts`
- Delete: `app/shared/i18n/locales/en/roles/admin/home.ts`
- Delete: `app/shared/i18n/locales/vi/roles/admin/home.ts`

**Interfaces:**

- Produces: typed i18next namespace `landing` with `metaDescription`, `eyebrow`, `title`, `description`, `audience`, `actions`, `lifecycle`, and `visual` keys.
- Produces: `meta({}: Route.MetaArgs)` returning the shared brand title and `landing.metaDescription`.

- [ ] **Step 1: Write failing resource and metadata tests**

Update the resource expectation to:

```ts
const expectedNamespaces = ['common', 'errors', 'landing', 'notFound', 'theme']

expect(Object.keys(resources.vi).sort()).toEqual(expectedNamespaces)
expect(Object.keys(resources.en).sort()).toEqual(expectedNamespaces)
expect(resources.vi).toHaveProperty('landing.lifecycle.purchased')
expect(resources.en).toHaveProperty('landing.lifecycle.purchased')
```

Add `app/routes/home.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import { setAppLanguage } from '~/shared/i18n/i18n'

import { meta } from './home'

describe('home route metadata', () => {
  it('uses localized landing metadata', async () => {
    await setAppLanguage('en', false)

    expect(meta({} as never)).toEqual([
      { title: 'SaaS-Sentry' },
      {
        name: 'description',
        content: 'Unify software spend, access, and usage evidence for better SaaS decisions.'
      }
    ])
  })
})
```

- [ ] **Step 2: Run tests and verify they fail for the missing namespace**

Run:

```powershell
node_modules\.bin\vitest.cmd run app/shared/i18n/resources.test.ts app/routes/home.test.ts
```

Expected: FAIL because `landing` is not registered and the route still reads `adminHome`.

- [ ] **Step 3: Add matching Vietnamese and English landing resources**

Create matching `landing` objects with these exact key paths:

```ts
export const landing = {
  actions: { login: '...', register: '...' },
  audience: '...',
  description: '...',
  eyebrow: '...',
  lifecycle: {
    assigned: '...',
    needed: '...',
    purchased: '...',
    used: '...'
  },
  metaDescription: '...',
  title: '...',
  visual: {
    availableSeats: '...',
    controlCenter: '...',
    evidenceReady: '...',
    renewalAttention: '...',
    systemOnline: '...'
  }
} as const
```

English `metaDescription` must exactly match the metadata test. Vietnamese copy must describe the same meaning naturally, not mirror English word order.

- [ ] **Step 4: Register `landing`, remove `adminHome`, and update route metadata**

Import both landing modules in `resources.ts`, expose `landing` for both locales, remove both `adminHome` imports/entries, and change the route metadata namespace to `landing`. Remove the now-unreferenced admin Home locale files.

- [ ] **Step 5: Run focused tests**

Run the Step 2 command.

Expected: PASS.

### Task 2: Landing behavior contract and UI dependencies

**Files:**

- Modify: `app/features/home/home-page.test.tsx`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Interfaces:**

- Consumes: `landing` namespace from Task 1.
- Produces: test contract requiring a banner/header, brand, localized hero heading, four lifecycle labels, and accessible Login/Register buttons.
- Produces: package imports `motion/react` and `lucide-react`.

- [ ] **Step 1: Replace bootstrap assertions with landing assertions**

The Vietnamese test must assert:

```ts
expect(screen.getByRole('banner')).toBeInTheDocument()
expect(screen.getByText('SaaS-Sentry')).toBeInTheDocument()
expect(screen.getByRole('heading', { level: 1, name: /quyết định saas/i })).toBeInTheDocument()
expect(screen.getByRole('button', { name: 'Đăng nhập' })).toBeInTheDocument()
expect(screen.getByRole('button', { name: 'Đăng ký' })).toBeInTheDocument()
expect(screen.getByText('Đã mua')).toBeInTheDocument()
expect(screen.getByText('Đã cấp')).toBeInTheDocument()
expect(screen.getByText('Có dùng')).toBeInTheDocument()
expect(screen.getByText('Còn cần')).toBeInTheDocument()
```

The English-switch test must click the existing localized language control and assert an English H1 matching `/SaaS decisions/i`, plus `Login`, `Register`, `Purchased`, `Assigned`, `Used`, and `Still needed`.

Keep the existing theme persistence test.

- [ ] **Step 2: Run the Home test and verify it fails against the old screen**

Run:

```powershell
node_modules\.bin\vitest.cmd run app/features/home/home-page.test.tsx
```

Expected: FAIL because the old architecture-demo screen does not expose the landing contract.

- [ ] **Step 3: Add approved UI libraries with pnpm**

Run:

```powershell
npm.cmd exec --yes pnpm@10.34.5 -- add motion lucide-react
```

Expected: `package.json` and `pnpm-lock.yaml` contain the resolved dependencies; do not edit the lockfile manually.

### Task 3: Animated mission-control visual

**Files:**

- Create: `app/features/home/landing-visual.tsx`

**Interfaces:**

- Consumes: `useTranslation('landing')`, `motion`, `useReducedMotion`, and Lucide icons.
- Produces: `export function LandingVisual(): React.ReactElement` with all decoration inside an `aria-hidden='true'` container.

- [ ] **Step 1: Implement the feature-local visual**

Use these stable data keys:

```ts
const lifecycleNodes = [
  { key: 'purchased', Icon: ReceiptText },
  { key: 'assigned', Icon: UserRoundCheck },
  { key: 'used', Icon: Activity },
  { key: 'needed', Icon: CircleCheckBig }
] as const
```

Build a bounded `relative aspect-square` composition with:

- token-derived background rings and grid;
- a central shield/control card;
- four absolutely positioned lifecycle nodes;
- three small contextual cards for seats, renewal, and evidence;
- traveling signal dots and low-opacity pulses.

Motion rules:

```ts
const loop = shouldReduceMotion ? undefined : { duration: 12, ease: 'linear' as const, repeat: Infinity }
```

Use only `transform` and `opacity` for looping animation. With reduced motion, retain all nodes at their readable resting positions and omit infinite transitions.

- [ ] **Step 2: Format and typecheck the new visual in isolation**

Run:

```powershell
node_modules\.bin\prettier.cmd --write app/features/home/landing-visual.tsx
node_modules\.bin\tsc.cmd --noEmit
```

Expected: no TypeScript error from `LandingVisual` or Motion variants.

### Task 4: Responsive landing page composition

**Files:**

- Modify: `app/features/home/home-page.tsx`

**Interfaces:**

- Consumes: `LandingVisual`, `LanguageSwitch`, `ThemeSwitch`, `common.brand`, and the `landing` namespace.
- Produces: `HomePage` containing semantic header/navigation and main hero layout with static auth buttons.

- [ ] **Step 1: Implement the header and hero**

Use this semantic structure:

```tsx
<div className='relative min-h-screen overflow-hidden bg-background'>
  <header>...</header>
  <main>
    <section>
      <div>{/* localized copy and lifecycle chips */}</div>
      <LandingVisual />
    </section>
  </main>
</div>
```

Header requirements:

- brand at the left;
- a `nav` at the right containing `ThemeSwitch`, `LanguageSwitch`, Login, Register in that exact order;
- static auth controls use `type='button'` and have no click handler in this slice.

Hero requirements:

- one H1 and one concise supporting paragraph;
- a compact audience/evidence statement;
- four lifecycle chips rendered from typed keys;
- desktop two-column layout, mobile stacked layout, no horizontal overflow;
- all backgrounds, borders, shadows, and gradients derived from semantic theme tokens.

- [ ] **Step 2: Run the Home tests and fix only contract mismatches**

Run:

```powershell
node_modules\.bin\vitest.cmd run app/features/home/home-page.test.tsx
```

Expected: PASS for Vietnamese content, English switching, auth action names, and persisted theme switching.

- [ ] **Step 3: Run localization and route tests together**

Run:

```powershell
node_modules\.bin\vitest.cmd run app/features/home/home-page.test.tsx app/shared/i18n/resources.test.ts app/routes/home.test.ts
```

Expected: PASS.

### Task 5: Quality verification

**Files:**

- Modify only files implicated by verification failures caused by this slice.

**Interfaces:**

- Consumes: completed landing slice.
- Produces: formatted, lint-clean, type-safe, tested production build.

- [ ] **Step 1: Format changed authored files**

Run:

```powershell
node_modules\.bin\prettier.cmd --write app/features/home/home-page.tsx app/features/home/landing-visual.tsx app/features/home/home-page.test.tsx app/routes/home.tsx app/routes/home.test.ts app/shared/i18n/resources.ts app/shared/i18n/resources.test.ts app/shared/i18n/locales/en/landing.ts app/shared/i18n/locales/vi/landing.ts docs/superpowers/specs/2026-09-28-landing-splash-design.md docs/superpowers/plans/2026-09-28-landing-splash.md
```

- [ ] **Step 2: Run targeted lint and typechecking**

Run:

```powershell
node_modules\.bin\eslint.cmd app/features/home app/routes/home.tsx app/routes/home.test.ts app/shared/i18n
npm.cmd exec --yes pnpm@10.34.5 -- run typecheck
```

Expected: both commands exit 0.

- [ ] **Step 3: Run all authored tests**

Run:

```powershell
npm.cmd exec --yes pnpm@10.34.5 -- test
```

Expected: Vitest, Node script tests, and ESLint rule tests pass.

- [ ] **Step 4: Build production assets**

Run:

```powershell
npm.cmd exec --yes pnpm@10.34.5 -- run build
```

Expected: React Router SPA build completes successfully.

- [ ] **Step 5: Attempt the complete repository gate**

Run:

```powershell
npm.cmd exec --yes pnpm@10.34.5 -- run check
```

Expected: pass, or report exact unrelated pre-existing formatting failures separately without modifying out-of-scope requirement/diagram artifacts.
