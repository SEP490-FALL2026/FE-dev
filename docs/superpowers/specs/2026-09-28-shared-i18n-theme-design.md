# Shared i18n and theme design

## Scope

Refactor localization into typed i18next namespaces organized by locale, role,
and business capability. Add an application-wide light/dark theme foundation
whose semantic color variables are derived from `ThemeLightExample.jpg` and
`ThemeDarkExample.jpg`.

This slice does not build the application sidebar/topbar shell yet. It creates
the shared configuration and controls that the shell will consume.

## Localization structure

Translations are stored by locale first. Role-specific business copy is then
stored below the role that owns the experience.

```text
app/shared/i18n/
  i18n.ts
  resources.ts
  types.d.ts
  locales/
    en/
      common.ts
      errors.ts
      not-found.ts
      theme.ts
      roles/admin/home.ts
    vi/
      common.ts
      errors.ts
      not-found.ts
      theme.ts
      roles/admin/home.ts
```

Only concrete namespaces used by the current application are created. Future
roles and capabilities add matching `vi` and `en` files when their first screen
is implemented.

The public namespaces are `common`, `errors`, `notFound`, `theme`, and
`adminHome`. `resources.ts` only assembles those modules; it contains no UI
sentences. Components call `useTranslation(namespace)` and use keys local to
that namespace.

## Theme model

The supported themes are `light` and `dark`. Light is the deterministic default.
The browser restores a valid value from `localStorage` key
`saas-sentry.theme`; an absent or invalid value resolves to light. Applying a
theme sets `data-theme` and `color-scheme` on `<html>`.

`ThemeProvider` owns the current theme for the application subtree. The shared
`ThemeSwitch` consumes that context and exposes a translated accessible label.

## Color tokens

Components use semantic CSS variables only. The palette was sampled from the
two supplied JPG references; JPEG compression produces neighboring pixel
values, so each token uses the representative sampled value for its visual
role.

| Token            | Light     | Dark      |
| ---------------- | --------- | --------- |
| background       | `#fef7ef` | `#05162a` |
| sidebar          | `#fdfaf5` | `#011226` |
| surface          | `#fefbf6` | `#0d1c33` |
| surface-subtle   | `#fdf3e7` | `#102440` |
| border           | `#efe3d7` | `#1b3553` |
| foreground       | `#241c18` | `#f8fcff` |
| muted-foreground | `#7c7068` | `#a8b8cc` |
| primary          | `#ff7020` | `#2888ff` |
| primary-hover    | `#f06018` | `#4098ff` |
| primary-soft     | `#ffe0c0` | `#103870` |
| success          | `#40b880` | `#10b8c0` |
| warning          | `#ffc070` | `#f0a830` |
| danger           | `#e84840` | `#f04850` |
| info             | `#2888d8` | `#2888ff` |

Tailwind exposes these variables as semantic utilities such as
`bg-background`, `bg-surface`, `text-foreground`, `text-muted-foreground`,
`border-border`, and `text-primary`. Authored components do not introduce a
second hardcoded theme palette.

## Integration and tests

`AppProviders` adds `ThemeProvider` alongside i18next and TanStack Query.
Existing pages and shared controls move from Slate/Teal color utilities to the
semantic theme utilities so the theme can be observed immediately.

Tests cover namespace rendering, language switching, the default light theme,
restoring a stored dark theme, switching themes, persistence, and the HTML
theme attribute. The full repository quality gate must pass.
