# UF-12 Full Frames Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify 20 synchronized Light and 20 Dark full-frame designs for UF-12 Shadow IT Discovery.

**Architecture:** A frozen data module owns the evidence, vendors, findings, audit events, three mutually exclusive outcomes and screen registry. A pure HTML renderer uses the established SaaS-Sentry shell and semantic tokens. Capture and verification scripts render independent 1440 × 1024 PNGs.

**Tech Stack:** HTML5, CSS custom properties, browser JavaScript, Node `assert`, PowerShell and headless Chrome.

## Global Constraints

- Follow `UF-12-Figma-Design-Spec.md` and BRD `FR-6.1`–`FR-6.9`.
- Output exactly 20 Light and 20 Dark PNGs; no contact sheet.
- Keep raw + normalized values, match method and confidence together.
- AI/fuzzy matching requires IT confirmation; do not auto-approve it.
- Finding is `Cần xem xét`, not a violation; exact one open finding per vendor.
- Do not imply purchase request is approved, or that `Chưa duyệt` automatically revokes access.
- Do not commit/push; do not modify source business documents or existing UF assets.

---

### Task 1: Canonical discovery model

**Files:** Create `Figma UI-UX/UF-12-Sources/uf12-data.test.js`, `Figma UI-UX/UF-12-Sources/uf12-data.js`.

**Interfaces:** `createUF12Data(): Readonly<UF12Data>` returns sources, vendors, findings, branches, ledgers and 20-screen registry.

- [x] Write a failing Node test for IDs `01..20`, the six-stage sequence, exactly three evidence sources, fuzzy/AI confirmation, dedupe, reopen and separated outcomes.
- [x] Run `node "Figma UI-UX/UF-12-Sources/uf12-data.test.js"` and observe module-not-found failure.
- [x] Implement frozen canonical data with the IDs and facts in the design spec.
- [x] Run the data test and confirm it passes.

### Task 2: Renderer and themes

**Files:** Create `uf12-renderer.test.js`, `uf12-renderer.js`, `uf12.css`, `uf12.html` in `Figma UI-UX/UF-12-Sources/`.

**Interfaces:** `renderApp(data, screenId): string` produces one full artboard and exposes screen/stage/ledger metadata.

- [x] Write a failing renderer test covering frames 03, 05, 08, 10, 11, 15, 16, 18 and 19.
- [x] Run it and observe missing renderer failure.
- [x] Implement shared shell, six-stage tracker, context ledger and explicit 20 state bodies.
- [x] Implement light/dark semantic CSS and HTML query boot with overflow preflight.
- [x] Run both Node tests and confirm they pass.

### Task 3: Capture and assets

**Files:** Create `capture-uf12.ps1`, `verify-uf12-assets.ps1` under Sources; create outputs under `UF-12-FullFrames/Light` and `Dark`.

- [x] Capture `UF-12-{Light|Dark}-01.png` through `20.png`, each 1440 × 1024, only after DOM readiness and no overflow.
- [x] Verify both Node tests, the exact file set and every image dimension.

### Task 4: Visual QA and handoff

**Files:** Modify sources only if a defect is found; update this plan and the design spec with truthful final status.

- [x] Open all 20 Light frames and inspect text, tables, raw/normalized values, branch labels and units.
- [x] Open all 20 Dark frames and inspect contrast plus semantic status colors.
- [x] No visual or behavior defect was found during QA; no regression was needed.
- [x] Run final verification; confirm no tracked UF-06 through UF-10 file changed; leave worktree uncommitted.
