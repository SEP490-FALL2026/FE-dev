# Localization

Paths in backticks below are relative to the repository root unless stated otherwise.

## Localization rules

- Vietnamese (`vi`) and English (`en`) are supported through typed i18next resources
  in `app/shared/i18n/`. A component renders copy with `t('namespace.key')`; it does
  not contain a Vietnamese or English UI literal.
- This applies to headings, buttons, empty/error/loading states, tooltips,
  placeholders, `alt`, `title`, `aria-label`, validation messages, toasts, and modal
  copy. Brand/domain data returned by the API is not translated unless the contract
  explicitly models a translation key.
- Add the key to both `resources.vi` and `resources.en` in the same change. Do not use
  an English string as a translation key.
- `project/no-hardcoded-ui-text` blocks literal JSX and accessibility copy. The rule
  is a guardrail, not permission to hide literals in variables; reviews must reject
  user-visible copy outside the i18n layer.
- Persisted browser preference uses `localStorage`; `vi` is the deterministic
  build/hydration fallback. Dates, currencies, percentages, and numbers use `Intl`
  with the active locale.
