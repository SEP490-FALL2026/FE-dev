# Demo Authentication and Role Dashboard Design

**Status:** Approved in conversation on 2026-09-28

## Goal

Add a presentation-focused login flow with six BRD-aligned demo accounts and a
shared responsive dashboard shell. Remove registration from the landing page. The
result is intentionally a frontend demonstration and does not represent production
authentication or authorization.

## Product and security boundary

The BRD describes SaaS-Sentry as a single-tenant internal enterprise system where
Super Admin creates and assigns accounts. Self-service registration is therefore
excluded from this slice: the landing-page Register control is removed and no
Register route is created.

Authentication remains backend-owned in the production architecture. For this UI
slice, the browser compares submitted credentials with a small hardcoded fixture and
navigates to a role-specific URL. It does not create or persist a token, cookie,
session, or user record. Dashboard URLs are deliberately unguarded, because their
only purpose is visual review before the real API and OIDC/session contract exists.
Hardcoded credentials are public demo data and must not be presented as secure.

## Demo accounts

The six accounts map exactly to the human roles in BRD section 4. Automation
Service is excluded because it is a system actor, not a login persona.

| Role | Role slug | Email | Password | Display name |
| --- | --- | --- | --- | --- |
| Super Admin | `super-admin` | `superadmin@saas-sentry.test` | `Demo@123` | Minh Anh |
| IT Admin | `it-admin` | `itadmin@saas-sentry.test` | `Demo@123` | Quang Huy |
| Manager | `manager` | `manager@saas-sentry.test` | `Demo@123` | Thu Hà |
| Spending Approver | `spending-approver` | `approver@saas-sentry.test` | `Demo@123` | Hoàng Nam |
| Finance | `finance` | `finance@saas-sentry.test` | `Demo@123` | Ngọc Lan |
| Employee | `employee` | `employee@saas-sentry.test` | `Demo@123` | Đức Anh |

Role labels and supporting descriptions are localized in Vietnamese and English.
The account fixtures contain identifiers and names only; user-visible labels remain
in typed translation resources.

## Routes and navigation

- `/` remains the splash page. Its Login control becomes a link to `/login`, and
  its Register control is removed.
- `/login` renders the demo login experience.
- `/dashboard/:role` renders the shared dashboard for one of the six role slugs.
- An invalid role slug renders the existing localized not-found experience.
- Logout returns to `/login`; it clears no state because this slice stores none.

The role slug in the URL makes each demo view directly addressable and refresh-safe
without introducing temporary client session infrastructure. Route modules remain
thin and pass URL concerns to feature components.

## Login experience

The login page uses the existing SaaS-Sentry theme and language system. It contains:

- brand and a link back to the splash page;
- theme and language controls;
- email and password fields with proper labels and autocomplete attributes;
- show/hide password control;
- a submit action and localized invalid-credential feedback;
- a clearly marked demo-account panel listing all six accounts for testers.

Selecting a demo-account row fills the form to reduce repetitive manual entry.
Submitting matching credentials navigates to `/dashboard/<role-slug>`. Empty or
incorrect values keep the user on `/login` and expose a localized, accessible error.
No network request is made.

## Shared role dashboard

All six roles use one dashboard feature and one role configuration boundary. The
configuration supplies the active role, display name, and localized role label. In
this first slice, navigation labels, metrics, charts, alerts, and body content are
intentionally identical for every role so later work can replace one role at a time
without duplicating the shell.

The visual hierarchy follows `ThemeDarkExample.jpg` and `ThemeLightExample.jpg`
without copying their LicenseHub branding:

- a persistent desktop sidebar with SaaS-Sentry branding, active Overview item,
  shared navigation, an optimization summary, and theme control;
- a compact top bar with page greeting, search field, notification control,
  language control, and current demo persona;
- four KPI cards;
- a monthly-cost line/area chart;
- an attention list;
- a category-cost donut chart;
- a top-software list and recently-added list;
- an optimization recommendation card;
- a compact mobile header and collapsible navigation for small screens.

Dashboard numbers are deterministic illustrative fixtures. They must be presented as
demo content and must not imply that they came from the backend. Currency and numbers
use `Intl` with the active locale.

## Component and source boundaries

- `app/routes` owns `/login` and `/dashboard/:role` registration plus thin route
  modules. The dashboard route validates the role slug and selects either the
  dashboard feature or the existing not-found feature.
- `app/entities/user-role` owns the six supported human-role slugs, their TypeScript
  type, and a small parser shared by authentication and dashboard presentation.
- `app/features/auth` owns demo credentials, credential matching, login form state,
  and login tests.
- `app/features/dashboard` owns role parsing, the shared shell, dashboard fixture
  presentation, charts, navigation behavior, and feature tests.
- `app/shared/i18n` owns every visible and accessible Vietnamese/English string.
- Existing generic theme/language controls remain under `app/shared/ui`.

The demo account module stays inside the auth feature because it is temporary
feature data. Both auth and dashboard consume the role model from `entities` and do
not import each other's internals. No generated API file or OpenAPI contract changes
in this slice.

## Dependencies

Add only `recharts` for responsive line/area and donut chart rendering. Reuse the
existing `lucide-react`, `motion`, React Router, i18next, and Tailwind CSS packages.
Do not add a form library, validation library, component framework, or global state
container for this static demo.

The completion report must identify every newly added dependency, the existing
visual libraries reused, where each is used, and the verification results so the
dependency footprint can be reviewed.

## Localization and accessibility

All headings, buttons, placeholders, field labels, validation messages, navigation
labels, chart labels, status text, and accessible names live in matching typed `vi`
and `en` resources. Brand names, demo email addresses, and display names are data and
are not translated.

Forms use associated labels, errors use an alert/status announcement, icon-only
controls have accessible names, current navigation uses `aria-current`, and the
mobile menu is keyboard operable. Color is not the only signal for status. Motion
respects `prefers-reduced-motion` through the existing motion utilities.

## Error and edge behavior

- Empty or unknown credentials produce one localized login error without navigation.
- Email matching is case-insensitive and trims surrounding whitespace; passwords are
  exact and are not trimmed.
- Invalid dashboard role slugs render the localized not-found page.
- The dashboard does not fail when optional decorative animation is reduced.
- Mobile layouts do not require horizontal page scrolling.

## Testing and verification

Behavior-focused tests cover:

- the landing page links to Login and no longer exposes Register;
- the login page exposes accessible fields and all six BRD roles;
- each of the six accounts maps to its expected dashboard URL;
- invalid credentials show the localized error and do not navigate;
- language and theme controls remain available;
- every valid role renders the same dashboard shell with the correct persona label;
- an invalid role renders the not-found experience;
- responsive navigation exposes an accessible mobile toggle.

Implementation follows test-first red/green cycles. Final verification runs the
focused tests followed by formatting, lint, typecheck, the full test suite, and a
production build. Browser verification covers `/`, `/login`, and at least one role
dashboard in both themes, checks mobile and desktop layouts, confirms a clean console,
and verifies that the demo login emits no network request.

## Deferred work

The following remain explicitly deferred until the backend contract exists:

- production authentication, OIDC, cookies/tokens, refresh, logout invalidation, and
  authorization guards;
- account creation or self-service registration;
- API-backed dashboard data and role-specific permissions;
- finalized per-role navigation and dashboard content;
- password recovery, MFA, and account lockout.
