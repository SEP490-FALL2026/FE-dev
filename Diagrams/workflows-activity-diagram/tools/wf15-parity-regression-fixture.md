# WF-15 parity regression fixture — pre-fix ART-PRES-01 / WF-PAR-01

**Captured:** 12/09/2026  
**Purpose:** Preserve the minimal, machine-checkable symptom of the pre-fix
WF-15 graph split. This is a regression fixture, not a replacement source for
the diagram and not an archive to restore from.

## Source under test

| Field                       | Value                                                                                                                                                                                                             |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Source                      | `Diagrams/workflows-activity-diagram/drawio/WF-15.drawio`                                                                                                                                                         |
| SHA-256 before fix          | `6950815B06F60C63BEF56A10F66697F53AE543FC728FC9BEE1403DB605A69C0D`                                                                                                                                                |
| Expected canonical behavior | Mermaid in `workflows-activity-diagram/index.md` §3.18: `ini → t1 → a1 → d1`, then three guarded outcomes `[có mốc rõ ràng] → m2`, `[chỉ có số ngày báo trước] → a2 → m2`, `[không có dữ liệu] → a3 → flow final` |

## Pre-fix failure signature

The fixture must fail if either condition is present:

1. Two semantically identical System-lane cells have equal type, normalized
   label, and bounds but different parent/ID; for example `d1` in `_lane_HT`
   and `g7qGk5OvlPCoZiqTDQWY-5` in the nested System lane, both labeled
   `Dữ liệu hạn báo hủy?` at `358,424,158,84`.
2. Incoming and outgoing control edges for the same business node are split
   across aliases. Before the fix, `a1 → g7q…-5 → m2`, while the outer `d1`
   separately routes to `a2` and `a3`; the initial `ini` is not connected to
   the outer `t1`.

The pre-fix duplicate lane has ID `g7qGk5OvlPCoZiqTDQWY-1`; it contains the
second copies of `ini`, `t1`, `a1`, `d1`, `a2`, `a3`, `ff1`, `m2`, `t2`,
`a4`, `a7`–`a11`, `m3`, and `fin`. Its presence is evidence of a copied graph,
not a permitted phase or note exception.

## Post-fix acceptance signature

- Exactly one direct child System lane, `_lane_HT`, carries the canonical graph.
- `d1` has precisely the three guarded control outcomes above; no nested alias
  participates in them.
- `ini → t1 → a1 → d1`, `a2 → m2`, and `a7 → m3` use the canonical IDs.
- The unchanged F-26/F-27 outcomes remain: renewal unchanged, renewal with a
  lower quantity and recorded saving, cancellation, and the separately guarded
  automatic-renewal incident path.

Bounds and labels are only duplicate signals. The decisive evidence is the
combination of semantic duplication **and** split control topology.
