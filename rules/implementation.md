# Implementation

For research, design, planning or multi-step implementation, follow the [skill workflow](../../../Docs/rules/skill-workflow.md). Stop at the output requested by the user; preserve any explicitly requested spec/plan approval checkpoint. Small fixes use the focused playbook. If Docs is absent in a standalone checkout, continue independent work and obtain missing sources before dependent steps.

## Trigger, inputs and completion

Use for a new feature, behavior change or refactor. Start with [context](context.md),
[architecture](architecture.md), [verification](verification.md) and the relevant
API/localization/configuration rules. Identify route, actor, acceptance criteria
and API readiness before editing. If the API is not implemented, label the local
mock explicitly and do not call the integration complete.

Build the smallest usable slice with its supported loading/error/empty/permission
states. Derive rejection cases from the contract, not invented FE authority.
Refactors preserve behavior and public API; do not bundle unrelated product changes.

Completion requires checks appropriate to the diff, relevant browser behavior,
updated translations/contracts when affected and a handoff naming any remaining
mocked or unverified boundary. Follow the workflow below without creating empty
folders, pass-through hooks or test cases that merely mirror code.

Paths in backticks below are relative to the repository root unless stated otherwise.

## AI workflow

1. Read this playbook and the relevant `ARCHITECTURE.md` sections.
2. Inspect the nearest feature, its public `index.ts`, generated API export, and tests
   before editing. Search before inventing a new pattern.
3. Write the target file tree in the task plan for any feature touching three or more
   authored files; assign every file one responsibility.
4. State any assumption that changes product behavior or access control.
5. Make one vertical slice: route -> page -> hook/model -> component -> test. Generate
   rather than hand-edit API code.
6. Re-read the diff specifically for oversized components, cross-feature private
   imports, duplicate API wrappers, `useEffect` fetching, hardcoded copy, and `any`.
7. Run relevant checks and report exact results plus any remaining risk.

For bug fixes, first reproduce the behavior at the owning layer: URL/navigation,
query/cache, generated contract, view model or presentation. Add a regression test
for behavior that needs protection; verify simple visual/copy corrections directly.
Do not fix a server contract defect with a one-off cast or handcrafted response in
a page. Coordinate the backend export, snapshot and regenerated client when needed.

Before starting, inspect the repo's current diff and preserve unrelated changes.
For browser verification, report whether the page used MSW or a real backend;
mock success does not prove integration. If browser or backend access is unavailable,
complete the independent checks and name the missing validation. Do not declare
the workflow complete from a screenshot or passing render alone, and do not
automatically commit, push or deploy.
