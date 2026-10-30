# SaaS-Sentry frontend

## Backend and auth setup

The backend Swagger UI is at `https://wdp.novaproj.site/api/docs`; its machine-readable contract is at
`https://wdp.novaproj.site/api/docs-json`. Orval reads that URL by default and generates the `auth`, `me` and Super Admin business
tags for this integration phase. `openapi/openapi.yaml` is the captured BE export; set
`ORVAL_OPENAPI_SOURCE=./openapi/openapi.yaml` to generate offline. Run `pnpm api:generate` after contract changes.

Copy `.env.example` to `.env` and save it as UTF-8 without a byte-order mark (BOM). Local development uses:

```dotenv
VITE_API_BASE_URL=/backend
API_PROXY_TARGET=https://wdp.novaproj.site
```

Git ignores `.env` and every `.env.*` file, including `.env.product` and `.env.*.local`, in all directories.
Only `.env.example` is versioned; keep it limited to non-sensitive example values. Do not force-add environment files.
Variables prefixed with `VITE_` are embedded in the public browser bundle, so they must not contain secrets even when the env file is ignored.

Run `pnpm install` and `pnpm dev`, then open `http://localhost:5173`. The browser calls `/backend/api/v1/...` on
the same origin. Vite removes `/backend` and forwards to `API_PROXY_TARGET` over HTTPS, avoiding browser CORS
for local development. Orval uses `API_PROXY_TARGET` to fetch `/api/docs-json`. Port 5173 is strict.
Restart `pnpm dev` after changing `.env`.

For deployment, create `.env.product`:

```dotenv
VITE_API_BASE_URL=https://wdp.novaproj.site
```

`pnpm build` runs `react-router build --mode product`, so `.env.product` overrides the local API URL. The deployed
browser calls the backend directly; BE CORS must allow the deployed FE origin. Generated routes already contain
`/api/v1`. Provide `.env.product` before building (including Docker), or set `VITE_API_BASE_URL` in the hosting
platform's build environment. Vite embeds the value during build; copying an env file beside existing static
assets does not update their API URL. Production HTTPS is managed by the hosting platform or reverse proxy.

React Router future flags explicitly keep v7 behavior. The pnpm patch in `patches/` replaces the dependency's
deprecated `envFile: false` options with `envDir: false` for Vite 8 compatibility.

Login stores the BE token pair and expiry timestamps as JSON in Local Storage under `saas-sentry.auth-tokens`
on the frontend origin (for local development, `http://localhost:5173`). The shared Axios client automatically
adds `Authorization: Bearer <accessToken>` to protected API requests; use the generated Orval operations or
`customAxios` for new APIs. On reopening, auth loads `/me` with the saved access token, refreshing first when
it is expired or within 30 seconds of expiry. A successful refresh replaces the stored pair. Logout and invalid
sessions remove it; temporary network failures retain it for retry. Existing Session Storage refresh tokens
migrate on their next successful refresh. If Local Storage is blocked, auth falls back to Session Storage and
memory, so persistence across browser restarts is unavailable. Browser storage is readable by same-origin
JavaScript; these tokens must not be logged or rendered in the UI.

Run `pnpm typecheck`, `pnpm vitest run`, `pnpm lint`, and `pnpm build` before release. The auth integration follows
the live BE contract; verification against real credentials requires an account supplied separately by the Owner.

# React Router template notes

A modern, production-ready template for building full-stack React applications using React Router.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
