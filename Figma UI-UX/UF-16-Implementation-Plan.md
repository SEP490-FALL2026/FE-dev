# UF-16 Full Frames Implementation Plan

> **For agentic workers:** Implement this plan task-by-task. Repository rules prohibit commit unless explicitly authorized.

**Goal:** Build a deterministic UF-16 data model, renderer, and export 16 synchronized Light plus 16 Dark PNG artboards (32 PNGs total) for User Flow `UF-16` (IT Admin deploys browser collector, employee confirms tracking disclosure).

**Architecture:** A frozen JavaScript data module (`uf16-data.js`) owns the canonical devices, allowlists, disclosure text, ledger states, and 16-screen registry. A pure renderer (`uf16-renderer.js`) converts any screen ID into a pixel-perfect 1440 × 1024 SaaS-Sentry desktop layout. Semantic CSS custom properties in `uf16.css` provide 100% Light and Dark theme parity conforming to `ThemeLightExample.jpg` and `ThemeDarkExample.jpg`. PowerShell scripts run headless Chrome to capture all 32 PNGs and verify their integrity.

---

## File Map

| File                                               | Responsibility                                                                    |
| -------------------------------------------------- | --------------------------------------------------------------------------------- |
| `Figma UI-UX/UF-16-Sources/uf16-data.js`           | Canonical devices, allowlists, disclosure text, ledger states, 16-screen registry |
| `Figma UI-UX/UF-16-Sources/uf16-data.test.js`      | Node test verifying screens, stages, ledger consistency, business rules           |
| `Figma UI-UX/UF-16-Sources/uf16-renderer.js`       | DOM generator for 16 screens, headers, sidebars, metrics, modals                  |
| `Figma UI-UX/UF-16-Sources/uf16-renderer.test.js`  | Node test verifying DOM structure, data attributes, guard statements              |
| `Figma UI-UX/UF-16-Sources/uf16.css`               | Light and Dark tokens, typography, layout, cards, badges                          |
| `Figma UI-UX/UF-16-Sources/uf16.html`              | Browser harness reading query params `?theme=light&screen=01`                     |
| `Figma UI-UX/UF-16-Sources/capture-uf16.ps1`       | Headless Chrome screenshot automation script                                      |
| `Figma UI-UX/UF-16-Sources/verify-uf16-assets.ps1` | Asset verification for 32 PNG files at 1440 × 1024                                |
| `Figma UI-UX/UF-16-FullFrames/Light/*.png`         | 16 Light artboard PNGs                                                            |
| `Figma UI-UX/UF-16-FullFrames/Dark/*.png`          | 16 Dark artboard PNGs                                                             |
