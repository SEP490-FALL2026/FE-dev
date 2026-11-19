# Super Admin overview and search UX

**Goal:** Replace the flat overview with a clear, interactive overview built from the existing API responses, and describe what users can enter into search/filter inputs.

**Architecture:** Keep generated queries unchanged. A small overview model groups department warnings and computes progress only from supported, known checklist states. Focused hero, metrics, department issues, checklist and account-health components consume this data. Context actions pass existing identifiers through URL parameters; the destination consumes them.

**Constraints:** Follow AGENTS.md and UI_UX_DESIGN_GUIDELINES.md; use existing semantic theme tokens and readable ink colors, VI/EN resources, keyboard-accessible disclosures, <= 300 lines per component, no demo figures, invented time series, backend writes or generated edits. Preserve the existing uncommitted work, including recent theme token improvements.

- [x] Add regression tests for grouped warnings, supported progress, real department drill-down, details expansion, refresh and contextual placeholders.
- [x] Replace the navigation-button row with a strong readiness panel, numeric cards, grouped actionable department issues and an expandable five-stage setup diagram. Retain independent loading/error states for checklist and account health.
- [x] Wire department codes and personnel import context to destination views using search parameters. Finance-owned work must remain explicitly attributed to Finance.
- [x] Add VI/EN placeholders for all Super Admin text search and audit filter inputs. Labels remain visible, placeholder text is descriptive and never becomes the input value.
- [x] Run scoped tests, localization parity, lint, TypeScript, production build and desktop/mobile browser checks with isolated API fixtures. Update architecture and report verification honestly.

Verification and known repository-wide baseline failures: [super-admin-verification.md](../../super-admin-verification.md).
