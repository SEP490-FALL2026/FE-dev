# IT Admin live API and interaction alignment

Goal: align the IT workspace with the deployed 337-operation contract and the 06/11 BE guides, with separate detail surfaces and descriptive accessible fields.

Architecture: keep role slices and generated TanStack Query/Axios operations. Device-only collector ingestion and Super Admin monitoring-policy administration stay with their documented actors. Never synthesize unavailable vendor usage, reconciliation, or K4 execution.

Constraints: preserve protected rule documents; no shared business writes, commits or deployments. Strict request bodies, server permissions/state/pagination, VI/EN, pending protection and safe secret handling. Each handwritten TS/TSX file <=500 lines.

- [x] Task 1 — Refresh live snapshot, compare contract, update Orval tags and regenerate from the pinned snapshot. Check generated consumers and migrate incompatible payloads without preserving removed fields.
- [x] Task 2 — Provisioning, offboarding, renewal and assessment: remove grant end date; use accessBlocked; migrate revocation note; implement renewal release selection and outcome notes; update error/state labels. Add regression tests before behavior fixes.
- [x] Task 3 — Catalog and purchase details: replace appended details/vault/seat usage with distinct drawer or detail view; add meaningful help. Test open/close and no accidental writes.
- [x] Task 4 — Devices/collector: implement IT-owned device registry/create/detail/holder/retirement/signature, one-time enrollment code and credential revocation, allowlist, usage/status/rejection reads, plus holder acknowledgement using actual role permissions. Test main lifecycle and secret cleanup.
- [x] Task 5 — Shared dialog accessibility and remaining IT operation coverage: review modal focus/scroll, add scoped department tools/controlled waits when absent; ensure action details do not append below queues.
- [x] Task 6 — Run API validation, typecheck, relevant/full tests, lint, formatting and build. Review independent findings, fix important issues, document real coverage and remaining BE boundaries.
