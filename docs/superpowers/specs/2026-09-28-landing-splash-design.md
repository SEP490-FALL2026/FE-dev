# SaaS-Sentry landing splash design

## Goal

Replace the temporary architecture-demo Home screen with a polished, responsive
landing splash for SaaS-Sentry. The page is the unauthenticated entry point today
and is intentionally prepared for a later route-level session check that redirects
authenticated users to the correct role workspace.

This slice is visual only. Login and Register are present as static actions; it does
not add authentication, token storage, role resolution, or auth routes.

## Product framing

The landing copy and visuals are grounded in the BRD v3.11 and the business feature
description. SaaS-Sentry is a dedicated internal enterprise system, not a public
multi-tenant SaaS storefront. The page must therefore communicate operational
clarity and trustworthy evidence rather than sales claims.

The core visual narrative is the four questions the product connects:

1. What software has the organization purchased?
2. Who has been assigned access?
3. Is that access actually being used?
4. Is the access still needed?

The page must not claim guaranteed savings, complete Shadow IT detection, automatic
revocation, or organization-level outcomes that the BRD does not support.

## Visual direction

The approved direction combines **SaaS Mission Control** with an **Evidence
Pipeline**.

- SaaS-Sentry is the stable center of the composition.
- Four animated nodes represent Purchased, Assigned, Used, and Needed.
- Data trails converge on the center to show contracts, access, usage evidence, and
  cost context becoming one decision-ready view.
- Small status cards communicate relevant product concepts such as available seats,
  renewal attention, and evidence quality. They remain illustrative and avoid fake
  customer statistics.
- Background grid, soft token-colored glows, scanning pulses, and orbit motion create
  continuous ambient activity without resembling a loading screen.

The visual remains decorative. Important meaning is also present in localized text
so the page does not depend on animation or color to communicate its purpose.

## Page composition

### Header

The header sits at the top of the viewport and remains visually lightweight.

- Left: the project name `SaaS-Sentry`, sourced from the shared brand resource and
  unchanged in both locales.
- Right, in this order: theme switch, VI/EN language switch, Login, Register.
- On narrow screens, controls retain a usable touch target and may use shorter
  labels or wrap without covering the hero.

### Hero content

The left side contains:

- a short product-category eyebrow;
- a localized headline about connecting software spend, access, and real usage;
- a concise explanation centered on evidence-backed decisions shared by IT,
  Finance, and managers;
- the four product questions as compact semantic chips;
- static Login and Register actions repeated at hero level only if the composition
  remains clear at the target breakpoint.

The copy must describe an internal governance system, not a public subscription
product. It must avoid invented metrics and must not imply employee surveillance.

### Animated system visual

The right side contains one composed illustration implemented as application UI,
not as a raster screenshot:

- a central SaaS-Sentry control node;
- four orbit/evidence nodes for Purchased, Assigned, Used, and Needed;
- directional connectors and traveling signal dots;
- contextual cards for license capacity, renewal timing, and evidence status;
- a subtle shield/check motif to convey controlled, auditable decisions.

On small screens the visual moves below the copy and simplifies its orbit radius and
card density to prevent horizontal overflow.

## Animation behavior

Motion is continuous but restrained:

- slow orbit rotation for lifecycle nodes;
- staggered data pulses along connectors;
- gentle float for supporting cards;
- low-opacity background glow drift;
- a periodic scan or heartbeat on the central control node.

Animation must not move the header or primary copy. Motion uses transforms and
opacity for smooth rendering. The implementation respects `prefers-reduced-motion`:
the same composition remains visible, while continuous movement is removed or
reduced to a minimal opacity transition.

## Styling and libraries

- React 19 provides the component structure.
- Tailwind CSS 4 provides layout, responsive behavior, and styling.
- Motion for React provides declarative animation and reduced-motion handling.
- Lucide React provides consistent interface icons.

Ant Design is not added for this slice. The application already owns semantic theme
tokens extracted from the supplied light and dark references, while Ant Design would
introduce a second token system and substantial component styling for only a few
buttons.

All authored colors use existing semantic theme variables such as `background`,
`surface`, `border`, `foreground`, `muted-foreground`, `primary`, `primary-soft`,
`success`, `warning`, and `info`. Transparent variants and gradients may use CSS
`color-mix()` derived from those variables; no unrelated palette is introduced.

## Localization

Landing content receives its own non-role namespace because the page is rendered
before the user's role is known:

```text
app/shared/i18n/locales/en/landing.ts
app/shared/i18n/locales/vi/landing.ts
```

`resources.ts` assembles the new `landing` namespace for both locales. The obsolete
admin-oriented Home copy is removed from this route rather than reused with the
wrong ownership. All headings, actions, chips, supporting cards, accessibility
labels, and route metadata are translated. `SaaS-Sentry` stays identical in English
and Vietnamese through `common.brand`.

## Architecture boundaries

- `app/routes/home.tsx` stays thin and owns route metadata only.
- `app/features/home/home-page.tsx` owns the landing composition.
- Feature-local presentational components may be extracted under
  `app/features/home/` when that makes the visual easier to maintain.
- Shared language and theme controls remain in `app/shared/ui/`.
- No auth state, token parsing, remote request, or role decision is added to the
  feature.

When authentication is implemented later, the index route will own browser/session
orchestration and redirect authenticated users. Backend-provided session and
permissions remain authoritative; the splash component stays presentational.

## Accessibility and responsiveness

- Use semantic `header`, `nav`, and `main` landmarks with one primary `h1`.
- Buttons retain visible keyboard focus and at least practical mobile touch targets.
- Decorative animation is hidden from the accessibility tree.
- Text and controls must meet contrast expectations in both supplied themes.
- The layout supports mobile through wide desktop without horizontal scrolling.
- Motion is reduced for users who request it.

## Verification

Behavior-focused tests cover:

- Vietnamese landing content by default;
- complete language switching to English;
- light-to-dark theme switching and persistence;
- presence and accessible names of Login and Register actions;
- matching `landing` namespaces in both locale resource trees;
- route metadata using landing copy.

Implementation is verified with focused Vitest tests, Prettier, ESLint, TypeScript,
and a production build. The full repository check is also attempted, with unrelated
pre-existing failures reported separately.
