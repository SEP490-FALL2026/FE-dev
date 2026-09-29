# UF-10 Full Frames Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Repository rules prohibit commit unless explicitly authorized; commit steps are replaced by diff/review checkpoints.

**Goal:** Build a deterministic UF-10 branch-workspace renderer and export 18 synchronized Light plus 18 Dark PNG artboards for G1–G4 license optimization.

**Architecture:** A frozen JavaScript data module owns the rule run, group totals, branch entities, savings ledgers, six-stage presentation map and 18-screen registry. A pure renderer converts one screen into a fixed 1440 × 1024 SaaS-Sentry shell; CSS semantic tokens produce Light/Dark parity. PowerShell preflights local routes in headless Chrome, captures each artboard independently, and verifies tests, filenames and dimensions.

**Tech Stack:** HTML5, CSS custom properties, dependency-free browser JavaScript, Node.js built-in `assert`, PowerShell 5+, Google Chrome headless and `System.Drawing`.

## Global Constraints

- Source of truth: `Figma UI-UX/UF-10-Figma-Design-Spec.md`.
- Output exactly 18 Light and 18 Dark PNGs, each `1440 × 1024`; no contact sheet deliverable.
- Presentation stages: `Tổng quan → G1 · Gia hạn → G2 · Nghỉ việc → G3/G4 · Usage → Xử lý → Tiết kiệm`.
- Screen stage sequence: `[1,1,2,2,2,2,3,3,3,4,4,4,4,5,5,5,5,6]`.
- `G1` targets Subscription quantities, not people; current handoff order is `UF-15 → UF-11`.
- `G2` never waits for Manager; frames 08–09 create tasks without releasing seats.
- `G3/G4` carry immutable evidence snapshots and go through `UF-05`.
- Frame 15 and frames 16–17 are mutually exclusive branches from frame 14; frame 18 continues branch A.
- Do not total `740.000 đ/tháng` with `48.000.000 đ/năm`.
- Notion `3.600.000 đ/năm` remains an unrecorded opportunity until a future G1 decision.
- Preserve UF-08 task identifiers `PV-2058`, `PV-2059`, `PV-2060`, `PV-2061` and the agreed/disagreed branch behavior.
- Do not modify BRD, `index.md`, `UF-10.drawio`, or UF-06/07/08/09 assets.
- Do not commit, push or deploy without explicit authorization.

---

## File Map

| File                                               | Responsibility                                                                  |
| -------------------------------------------------- | ------------------------------------------------------------------------------- |
| `Figma UI-UX/UF-10-Sources/uf10-data.js`           | Frozen canonical run, G1/G2/G3/G4 entities, ledgers, stages and screen registry |
| `Figma UI-UX/UF-10-Sources/uf10-data.test.js`      | Registry, branch, savings, handoff and immutability assertions                  |
| `Figma UI-UX/UF-10-Sources/uf10-renderer.js`       | Pure app shell, components and 18 state bodies                                  |
| `Figma UI-UX/UF-10-Sources/uf10-renderer.test.js`  | Markup metadata, guard text and branch parity assertions                        |
| `Figma UI-UX/UF-10-Sources/uf10.css`               | Fixed canvas and semantic Light/Dark tokens                                     |
| `Figma UI-UX/UF-10-Sources/uf10.html`              | Query boot, readiness and overflow markers                                      |
| `Figma UI-UX/UF-10-Sources/capture-uf10.ps1`       | Safe 36-artboard Chrome capture                                                 |
| `Figma UI-UX/UF-10-Sources/verify-uf10-assets.ps1` | Node tests plus filename/dimension verification                                 |
| `Figma UI-UX/UF-10-FullFrames/Light/*.png`         | 18 Light artboards                                                              |
| `Figma UI-UX/UF-10-FullFrames/Dark/*.png`          | 18 Dark artboards                                                               |

---

### Task 1: Canonical branch model

**Files:**

- Create: `Figma UI-UX/UF-10-Sources/uf10-data.test.js`
- Create: `Figma UI-UX/UF-10-Sources/uf10-data.js`

**Interfaces:**

- Produces `globalThis.UF10Data.createUF10Data(): Readonly<UF10Data>` and Node export `{ createUF10Data }`.
- `UF10Data` contains `actor`, `run`, `stages`, `groups`, `g1`, `g2`, `usageRecommendations`, `branches`, `savings`, `ledgers`, `screens`, `audit`.
- Every screen contains `{ id, stage, totalStages, title, subtitle, state, ledgerKey, activeNav, branch }`.

- [x] **Step 1: Write the failing data test**

  Assert screen IDs `01..18`, stage sequence from Global Constraints, six stage labels, frozen output and every ledger reference.

- [x] **Step 2: Run the failing test**

  Run: `node "Figma UI-UX/UF-10-Sources/uf10-data.test.js"`  
  Expected: FAIL because `./uf10-data.js` does not exist.

- [x] **Step 3: Implement canonical data**

  Encode exact values from spec sections 3–6. Ledger keys must expose:

  ```js
  {
    ;(g1Open,
      g2Open,
      managerPending,
      itReview,
      tasksOpen,
      seatsReleased,
      renewalReductionApproved,
      immediateSaving,
      renewalSaving)
  }
  ```

- [x] **Step 4: Add guarded branch assertions**

  Verify `G1` has no employee decision target; frame 05 handoff order is `['UF-15','UF-11']`; frames 07–09 have `managerRequired = false`; frame 15 creates `PV-2060`; frame 17 has no `PV-2060`; frame 18 keeps the two savings units separate and marks Notion opportunity unrecorded.

- [x] **Step 5: Run data test and review values**

  Expected: `PASS uf10-data: 18 states preserve branch semantics, handoff order, ledgers, and separated savings`.

### Task 2: Renderer and theme system

**Files:**

- Create: `Figma UI-UX/UF-10-Sources/uf10-renderer.test.js`
- Create: `Figma UI-UX/UF-10-Sources/uf10-renderer.js`
- Create: `Figma UI-UX/UF-10-Sources/uf10.css`
- Create: `Figma UI-UX/UF-10-Sources/uf10.html`

**Interfaces:**

- Consumes `createUF10Data()`.
- Produces `globalThis.UF10Renderer.renderApp(data, screenId): string` and Node export `{ renderApp }`.
- Root markup exposes `data-screen`, `data-stage`, `data-total-stages` and all numeric ledger fields.

- [x] **Step 1: Write the failing renderer test**

  For each screen assert title, `Chặng n / 6`, all six stage labels, run ID, ledger metadata and branch badge. Targeted checks:

  ```text
  04: Subscription target + 12 proposed + 72m estimate
  05: UF-15 before UF-11 and Finance is not approver
  08: typed count 3 + common reason + no Manager
  09: PV-2058/PV-2059/PV-2061 + seatsReleased 0
  11: snapshot/coverage/activity definition
  13: Keep/Reclaim/Exempt; only Reclaim returns
  15: PV-2060 created, Assignment still occupied
  16: mandatory disagreement reason
  17: no PV-2060
  18: 740k/month and 48m/year, no combined total, Notion unrecorded
  ```

- [x] **Step 2: Run renderer test and confirm missing-module failure**

- [x] **Step 3: Implement shared shell**

  Build escaped text helpers, sidebar, topbar, six-stage tracker, group badge, ledger panel, tables, metrics, notices, dialogs and handoff cards.

- [x] **Step 4: Implement 18 explicit state bodies**

  Use a state renderer map keyed by the 18 state names in spec section 4. Keep branch A/B labels visible on frames 15–17.

- [x] **Step 5: Implement fixed theme-neutral CSS**

  Use the exact light/dark tokens from spec section 7; fixed 1440 × 1024, 218 px sidebar, 64 px topbar and 270 px context panel. Tables must fit without horizontal scrolling.

- [x] **Step 6: Implement HTML boot and preflight**

  Parse `?theme=light|dark&screen=01..18`; render; then set `data-render-ready=true` and computed `data-overflow=true|false`.

- [x] **Step 7: Run both Node tests**

  Expected: both PASS.

### Task 3: Capture and asset verification

**Files:**

- Create: `Figma UI-UX/UF-10-Sources/capture-uf10.ps1`
- Create: `Figma UI-UX/UF-10-Sources/verify-uf10-assets.ps1`
- Create outputs under `Figma UI-UX/UF-10-FullFrames/{Light,Dark}`.

**Interfaces:**

- Capture accepts `-RootPath`, optional `-Resume`, optional `[ValidateRange(1,18)] -Screens`.
- Produces `UF-10-{Light|Dark}-{01..18}.png`.

- [x] **Step 1: Implement safe capture script**

  Resolve paths, restrict output root, create a GUID Chrome profile under system temp, use hidden headless Chrome, require readiness/no overflow, and delete only the validated temporary profile.

- [x] **Step 2: Implement verification script**

  Run both Node tests, require exact 18-file sets per theme, inspect every PNG with `System.Drawing`, and require `1440 × 1024`.

- [x] **Step 3: Capture all 36 artboards**

  Run:

  ```powershell
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\Figma UI-UX\UF-10-Sources\capture-uf10.ps1" -RootPath "."
  ```

  Expected: `PASS capture: 36 UF-10 artboards generated, 0 existing artboards skipped.`

- [x] **Step 4: Verify assets**

  Expected: `PASS UF-10 assets: 18 Light + 18 Dark PNGs, all 1440x1024; branch continuity and separated savings verified.`

### Task 4: Visual QA and handoff

**Files:**

- Modify as defects require: `Figma UI-UX/UF-10-Sources/uf10-renderer.js`, `uf10.css`, `uf10-data.js`
- Modify: `Figma UI-UX/UF-10-Figma-Design-Spec.md`
- Modify: `Figma UI-UX/UF-10-Implementation-Plan.md`

- [x] **Step 1: Open all 18 Light frames**

  Check text, stage tracker, tables, branch labels, panel values, clipping and financial units.

- [x] **Step 2: Open all 18 Dark frames**

  Check the same items plus contrast and semantic differentiation of G1–G4.

- [x] **Step 3: Fix one defect at a time**

  Add a failing regression assertion for logic defects, apply one fix, run tests, then targeted recapture. Recapture all 36 after shared CSS changes.

- [x] **Step 4: Run final verification**

  Require both Node PASS lines plus exact 36-file and dimension PASS.

- [x] **Step 5: Update documentation truthfully**

  Mark spec `Đã hiện thực và kiểm chứng`, add source/output paths, commands and visual review statement. Mark plan checkboxes only after their evidence exists.

- [x] **Step 6: Review workspace scope**

  Run `git status --short -- "Figma UI-UX"` and confirm no existing UF-06/07/08/09 tracked file changed. Do not commit or push.
