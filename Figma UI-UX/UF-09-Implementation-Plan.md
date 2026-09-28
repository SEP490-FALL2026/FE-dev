# UF-09 Full Frames Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Repository rules prohibit commit unless explicitly authorized; commit steps are replaced by diff/review checkpoints.

**Goal:** Build a deterministic UF-09 desktop UI renderer and export 16 synchronized Light plus 16 Dark PNG artboards that implement the approved offboarding flow.

**Architecture:** A frozen JavaScript data module owns the canonical employee, assignments, tasks, ledgers, seven-step lifecycle and 16-screen registry. A pure renderer converts one screen plus one theme into a fixed 1440 × 1024 App Shell; shared CSS maps semantic tokens to Light/Dark values. PowerShell opens local routes in headless Chrome, preflights render/overflow markers, captures PNGs, and verifies tests, names and dimensions.

**Tech Stack:** HTML5, CSS custom properties, dependency-free browser JavaScript, Node.js built-in `assert`, PowerShell 5+, Google Chrome headless, `System.Drawing` for PNG metadata.

## Global Constraints

- Source of truth: `Figma UI-UX/UF-09-Figma-Design-Spec.md`.
- Output: exactly 16 Light and 16 Dark PNGs, each `1440 × 1024`; no contact sheet.
- Every frame renders the same seven lifecycle steps and a monotonic `Bước n / 7` state.
- Light/Dark pairs use identical text, IDs, numbers, timestamps, order and topology.
- Preserve UF-08 continuity: `OFF-2026-044`, `PV-2042`, `ASN-3872`, `SUB-FIG-PRO-02`, `FIG-EVT-772904`, `NV-0174`.
- Frame 11 creates five tasks while all five seats remain occupied; frame 12–13 release four; frame 14 releases the fifth.
- Frame 15 schedules deletion; frame 16 alone deletes `12,480` detailed usage records.
- IT Admin cannot confirm Manager handover, Automation cannot revoke seats, and G2 never requires Manager confirmation.
- Do not modify BRD, `Diagrams/user-flows/index.md`, `UF-09.drawio`, UF-07 or UF-08 assets.
- Do not commit, push or deploy without explicit authorization.

---

## File Map

| File | Responsibility |
| --- | --- |
| `Figma UI-UX/UF-09-Sources/uf09-data.js` | Frozen canonical entities, ledgers, steps, screens and action guards |
| `Figma UI-UX/UF-09-Sources/uf09-data.test.js` | Registry, continuity, ledger and permission assertions |
| `Figma UI-UX/UF-09-Sources/uf09-renderer.js` | Pure SVG/icon helpers plus App Shell and per-state HTML renderer |
| `Figma UI-UX/UF-09-Sources/uf09-renderer.test.js` | Structural HTML, guard, metadata and parity assertions |
| `Figma UI-UX/UF-09-Sources/uf09.css` | Fixed canvas, responsive-free desktop layout and semantic theme tokens |
| `Figma UI-UX/UF-09-Sources/uf09.html` | Query parsing, render boot, overflow preflight and readiness markers |
| `Figma UI-UX/UF-09-Sources/capture-uf09.ps1` | Safe headless Chrome export to the UF-09 output tree |
| `Figma UI-UX/UF-09-Sources/verify-uf09-assets.ps1` | Node tests plus exact PNG set and dimension verification |
| `Figma UI-UX/UF-09-FullFrames/Light/*.png` | 16 Light artboards |
| `Figma UI-UX/UF-09-FullFrames/Dark/*.png` | 16 Dark artboards |
| `Figma UI-UX/UF-09-Figma-Design-Spec.md` | Final status, source paths and reproducible commands |

---

### Task 1: Canonical data model and failing behavioral tests

**Files:**
- Create: `Figma UI-UX/UF-09-Sources/uf09-data.test.js`
- Create: `Figma UI-UX/UF-09-Sources/uf09-data.js`

**Interfaces:**
- Produces: `globalThis.UF09Data.createUF09Data(): Readonly<UF09Data>` in browser and `module.exports = { createUF09Data }` in Node.
- `UF09Data` contains `actor`, `employee`, `offboarding`, `successions`, `device`, `assignments`, `steps`, `ledgers`, `screens`, `savings`.
- Every screen has `{ id, step, title, subtitle, state, ledgerKey, activeNav, actions }`.

- [x] **Step 1: Write the failing data test**

  Assert exact screen IDs `01..16`, step sequence `[1,1,1,2,2,3,3,4,4,4,5,6,6,6,7,7]`, `totalSteps = 7`, continuity identifiers, five unique assignments/tasks, and frozen output.

- [x] **Step 2: Run the failing test**

  Run: `node "Figma UI-UX/UF-09-Sources/uf09-data.test.js"`  
  Expected: FAIL because `./uf09-data.js` does not exist.

- [x] **Step 3: Implement the minimum canonical module**

  Define the exact demo values from spec sections 4–6. Ledgers must expose numeric keys:

  ```js
  { seatAttached, successionBlockers, handoverBlockers,
    g2Open, tasksOpen, seatReleased, usageDetail }
  ```

  Screen guards must include:

  ```js
  frame06.actions = ['remind-manager'];
  frame10.typedCountRequired = 5;
  frame10.reasonRequired = true;
  frame11.provisioningCreated = true;
  frame13.openTaskId = 'PV-2042';
  frame16.deletionCompleted = true;
  ```

- [x] **Step 4: Extend the test with negative permission assertions**

  Verify frame 06 lacks `confirm-handover-as-it` and `bulk-revoke`; frames before 08 have no G2; frame 11 has five occupied seats; frame 13 has one; frame 16 has zero usage detail.

- [x] **Step 5: Run the data test**

  Run: `node "Figma UI-UX/UF-09-Sources/uf09-data.test.js"`  
  Expected: `PASS uf09-data: 16 states preserve seven-step continuity, offboarding ledgers, and UF-08 identifiers`.

- [x] **Step 6: Review checkpoint**

  Run: `git diff -- "Figma UI-UX/UF-09-Sources/uf09-data.js" "Figma UI-UX/UF-09-Sources/uf09-data.test.js"` and compare all values to spec sections 4 and 5.

### Task 2: Pure renderer, App Shell and theme system

**Files:**
- Create: `Figma UI-UX/UF-09-Sources/uf09-renderer.test.js`
- Create: `Figma UI-UX/UF-09-Sources/uf09-renderer.js`
- Create: `Figma UI-UX/UF-09-Sources/uf09.css`
- Create: `Figma UI-UX/UF-09-Sources/uf09.html`

**Interfaces:**
- Consumes: `createUF09Data()` from Task 1.
- Produces: `globalThis.UF09Renderer.renderApp(data, screenId): string` and Node export `{ renderApp }`.
- Root markup exposes `data-screen`, `data-step`, `data-total-steps`, all seven ledger values, `data-render-ready` and `data-overflow`.

- [x] **Step 1: Write the failing renderer test**

  For every screen, render HTML and assert its title, `Bước n / 7`, all seven step labels, canonical case/employee IDs and ledger metadata. Add targeted assertions for frames 06, 08, 10, 11, 13, 15 and 16.

- [x] **Step 2: Run the failing renderer test**

  Run: `node "Figma UI-UX/UF-09-Sources/uf09-renderer.test.js"`  
  Expected: FAIL because `renderApp` is not defined.

- [x] **Step 3: Implement shared shell and components**

  Implement helpers for escaped text, inline SVG icons, sidebar, top bar, breadcrumb, lifecycle stepper, case panel, audit timeline, metric cards, tables, badges, buttons and dialogs. Keep icons inline and dependency-free.

- [x] **Step 4: Implement the 16 state bodies**

  Use explicit state renderers grouped by responsibility:

  ```js
  const stateRenderers = {
    'employee-list': renderEmployeeList,
    'employee-impact': renderEmployeeImpact,
    'start-dialog': renderStartDialog,
    'plan-created': renderPlan,
    'successor-assignment': renderSuccession,
    'handover-waiting': renderHandoverWaiting,
    'handover-confirmed': renderHandoverConfirmed,
    'g2-created': renderG2Created,
    'bulk-selection': renderBulkSelection,
    'bulk-confirm': renderBulkConfirm,
    'tasks-created': renderTasksCreated,
    'evidence-overview': renderEvidenceOverview,
    'evidence-insufficient': renderEvidenceInsufficient,
    'evidence-complete': renderEvidenceComplete,
    'deletion-scheduled': renderDeletionScheduled,
    'deletion-complete': renderDeletionComplete,
  };
  ```

- [x] **Step 5: Implement fixed 1440 × 1024 CSS**

  Reuse UF-07/UF-08 proportions: 224 px sidebar, 64 px top bar, 24 px content gutter. Define semantic variables for both themes and keep layout/component selectors theme-neutral. Add compact typography for the seven-step tracker and dense tables without horizontal scrolling.

- [x] **Step 6: Implement HTML boot and preflight**

  Parse `?theme=light|dark&screen=01..16`, render into `#app`, set theme on `<html>`, then set `data-render-ready=true`. Compute overflow against 1440 × 1024 and set `data-overflow=true|false`.

- [x] **Step 7: Run renderer and data tests**

  Run:

  ```powershell
  node "Figma UI-UX/UF-09-Sources/uf09-data.test.js"
  node "Figma UI-UX/UF-09-Sources/uf09-renderer.test.js"
  ```

  Expected: both PASS.

- [x] **Step 8: Browser preflight one Light and one Dark frame**

  Run Chrome `--headless=new --dump-dom` for `screen=01&theme=light` and `screen=16&theme=dark`. Expected DOM contains `data-render-ready="true"` and `data-overflow="false"`.

- [x] **Step 9: Review checkpoint**

  Inspect rendered DOM for all 16 state titles and ensure frame 06 has no IT confirmation CTA, frame 11 says seats still occupied, and frame 15 says deletion is scheduled rather than completed.

### Task 3: Capture and verification pipeline

**Files:**
- Create: `Figma UI-UX/UF-09-Sources/capture-uf09.ps1`
- Create: `Figma UI-UX/UF-09-Sources/verify-uf09-assets.ps1`
- Create directories: `Figma UI-UX/UF-09-FullFrames/Light/`, `Figma UI-UX/UF-09-FullFrames/Dark/`

**Interfaces:**
- Consumes: `uf09.html` routes from Task 2.
- Produces: `UF-09-{Light|Dark}-{01..16}.png`.
- Capture parameters: `-RootPath`, optional `-Resume`, optional `[ValidateRange(1,16)] -Screens`.

- [x] **Step 1: Implement capture script from the proven UF-08 pattern**

  Resolve all paths, restrict outputs to `UF-09-FullFrames`, use a GUID temp Chrome profile under system temp, use hidden headless Chrome, preflight readiness/overflow before screenshot, and delete only the validated temp profile in `finally`.

- [x] **Step 2: Implement verify script**

  Run both Node tests; require exact filename sets for Light/Dark; open every PNG with `System.Drawing`; assert `1440 × 1024`; print a single PASS summary.

- [x] **Step 3: Run tests before capture**

  Run:

  ```powershell
  node "Figma UI-UX/UF-09-Sources/uf09-data.test.js"
  node "Figma UI-UX/UF-09-Sources/uf09-renderer.test.js"
  ```

  Expected: both PASS.

- [x] **Step 4: Capture all assets**

  Run:

  ```powershell
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File '.\Figma UI-UX\UF-09-Sources\capture-uf09.ps1' -RootPath '.'
  ```

  Expected: `PASS capture: 32 UF-09 artboards generated, 0 existing artboards skipped.`

- [x] **Step 5: Run full asset verification**

  Run:

  ```powershell
  powershell.exe -NoProfile -ExecutionPolicy Bypass -File '.\Figma UI-UX\UF-09-Sources\verify-uf09-assets.ps1' -RootPath '.'
  ```

  Expected: `PASS UF-09 assets: 16 Light + 16 Dark PNGs, all 1440x1024; canonical offboarding continuity verified.`

### Task 4: Visual validation and handoff documentation

**Files:**
- Modify: `Figma UI-UX/UF-09-Sources/uf09.css`
- Modify if a state defect is found: `Figma UI-UX/UF-09-Sources/uf09-renderer.js`
- Modify if canonical content is wrong: `Figma UI-UX/UF-09-Sources/uf09-data.js`
- Modify: `Figma UI-UX/UF-09-Figma-Design-Spec.md`

**Interfaces:**
- Consumes: all 32 generated PNGs.
- Produces: visually reviewed assets plus reproducible commands and truthful completion status in the spec.

- [x] **Step 1: Build contact previews only in memory, not as deliverables**

  Inspect all individual PNGs; use `view_image` on representative frames first, then every remaining frame or temporary local montages if needed. Do not save a storyboard under `UF-09-FullFrames`.

- [x] **Step 2: Review every Light frame**

  Check sidebar/topbar stability, seven-step tracker, Vietnamese text, table clipping, dialogs, disabled actions, ledger values, and frame-to-frame continuity.

- [x] **Step 3: Review every Dark frame**

  Check the same items plus contrast and semantic status differentiation against `ThemeDarkExample.jpg`.

- [x] **Step 4: Fix one defect at a time and recapture affected screens**

  Use `-Screens <n>` for targeted recapture. After any shared CSS change, recapture all 32 because the change can affect every frame.

- [x] **Step 5: Re-run full verification**

  Run the verify script from Task 3 and require PASS after the final recapture.

- [x] **Step 6: Update the spec truthfully**

  Change status to `Đã hiện thực và kiểm chứng`, add source/output paths, exact capture/verify commands, and the actual visual-review statement. Do not claim editable Figma components.

- [x] **Step 7: Final diff and untracked-file review**

  Run:

  ```powershell
  git status --short -- 'Figma UI-UX'
  git diff -- 'Figma UI-UX/UF-09-Figma-Design-Spec.md' 'Figma UI-UX/UF-09-Implementation-Plan.md'
  ```

  Confirm no existing UF-06/UF-07/UF-08 files were modified.
