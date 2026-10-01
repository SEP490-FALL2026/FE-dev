# Configuration

Paths in backticks below are relative to the repository root unless stated otherwise.

## Configuration file map

- `vitest.config.ts` configures test discovery, the jsdom browser-like environment,
  global setup, and path resolution. It is not a production/Vite build config.
- `nginx.conf` serves `build/client` in the Docker/VPS image and falls back unknown
  routes to `index.html`. Vercel does not read this file.
- `react-router.config.ts` selects SPA rendering and enables the official Vercel
  preset. On Vercel set the project root to this package; the preset handles the
  React Router build. Keep `/api` on a reachable backend/ingress.
- `openapi/` stores the reviewed, versioned backend contract snapshot consumed by
  Orval; it is input, not handwritten frontend DTO code.
- `pnpm-workspace.yaml` marks this package as a pnpm workspace root and centralizes
  dependency-resolution/build-script policy even though it currently has one
  package. `allowBuilds` is an explicit supply-chain allowlist; do not broaden it
  casually.
