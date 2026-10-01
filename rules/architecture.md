# Architecture

Paths in backticks below are relative to the repository root unless stated otherwise.

## Source boundaries

```text
app/routes      URL, metadata, navigation, route loaders/actions
app/providers   root framework providers
app/features    user-facing business capabilities
app/entities    reusable domain concepts, created only when needed
app/shared      configuration, API, UI primitives, utilities, test support
```

Allowed dependency direction:

```text
routes -> features -> entities -> shared
   |          |                     ^
   +----------+---------------------+
providers --------------------------+
```

- A route module must stay thin. Move reusable rendering and workflows to a feature.
- A feature must not import another feature's internals. Promote genuinely shared
  domain concepts to `entities/` or generic code to `shared/`.
- `shared/` must never import from `features/`, `entities/`, or `routes/`.
- Do not create barrels that hide dependency cycles.
- Do not add an abstraction until there is a concrete second consumer or framework
  boundary that requires it.

## Mandatory file-placement rules

Use this table before creating a file. AI-generated code that lands in the wrong
layer must be moved before the task is considered complete.

| Code being added                        | Required location                         | Must not contain                                 |
| --------------------------------------- | ----------------------------------------- | ------------------------------------------------ |
| URL registration                        | `app/routes.ts`                           | UI, fetching, business rules                     |
| Route metadata/params/redirect/prefetch | `app/routes/<route>.tsx`                  | Reusable page layout or feature workflow         |
| Full route-level UI                     | `app/features/<feature>/pages/*-page.tsx` | Router manifest declarations                     |
| Feature-only UI piece                   | `app/features/<feature>/components/*.tsx` | Generic app-wide primitives                      |
| Feature orchestration hook              | `app/features/<feature>/hooks/use-*.ts`   | Raw `fetch`, translated JSX, unrelated features  |
| Feature mapper/view model               | `app/features/<feature>/model/*.ts`       | React or browser APIs when a pure function works |
| Reusable domain display logic           | `app/entities/<entity>/`                  | One-feature workflow logic                       |
| Generic UI primitive                    | `app/shared/ui/`                          | License/user/approval-specific behavior          |
| Generic utility/config                  | `app/shared/lib/`, `app/shared/config/`   | Imports from routes/features/entities            |
| Generated client/types/mocks            | `app/shared/api/generated/`               | Hand edits                                       |

A small feature may start flat with `home-page.tsx` and its test. Once it has more
than one page, hook, component, or model, use the full shape below; do not accumulate
ten unrelated files at the feature root.

```text
app/features/licenses/
  index.ts                         public exports only
  pages/licenses-page.tsx          route-level composition
  pages/license-details-page.tsx
  components/license-card.tsx      feature-only presentation
  components/license-filters.tsx
  hooks/use-license-list.ts         query + feature orchestration
  hooks/use-license-filters.ts      URL/filter interaction
  model/license-list.model.ts       pure mapping/types
  components/license-card.test.tsx
  pages/licenses-page.test.tsx
```

Other features import only `~/features/licenses`, never
`~/features/licenses/components/license-card`. Routes also prefer the feature's
public `index.ts`. Do not create a barrel for `shared/` or the whole application.
See the complete code example in `ARCHITECTURE.md`.
