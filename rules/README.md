# Frontend rules

Entry: [AGENTS.md](../AGENTS.md). Read [context.md](context.md) first. Paths in backticks are relative to the frontend root. Load only the playbook and topic rules touched by the task.

| Task                                                 | Load                                                                                                  |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Research / design / plan / multi-step implementation | [skill workflow](../../../Docs/rules/skill-workflow.md)                                               |
| Implement / refactor                                 | [implementation](implementation.md), [architecture](architecture.md), [verification](verification.md) |
| Debug / fix                                          | [debug](debug.md), [verification](verification.md), topic rules for the failing boundary              |
| Audit code / UX / business behavior                  | [audit](audit.md), relevant topic rules                                                               |
| API / cache / mutation / permission display          | [api-state](api-state.md)                                                                             |
| UI copy / accessibility / locale                     | [localization](localization.md)                                                                       |
| Build / deployment configuration                     | [configuration](configuration.md)                                                                     |

A business screen usually needs both API/state and localization rules. Business changes/audits also read [domain guardrails](../../../Docs/rules/domain-guardrails.md); cross-repo work reads [change workflow](../../../Docs/rules/change-workflow.md). Do not duplicate these sources here.

Keep durable technical decisions in `ARCHITECTURE.md`; a small task can use an inline plan rather than adding a permanent spec. Generated clients remain generated. Check workspace rules using the shared [gate guide](../../../Docs/rules/automation.md). The checker lives in BE; FE standalone checks remain local formatting/review until that tooling checkout is available. There is no FE CI workflow installed by this change.
