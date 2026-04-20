@AGENTS.md

## Project

Signal Admin is a web-based admin interface for [signal-cli](https://github.com/AsamK/signal-cli/).
It communicates with the signal-cli JSON-RPC 2.0 HTTP API through Next.js proxy routes.

## Tech Stack

- Next.js (App Router), TypeScript
- TailwindCSS v4 (imported via `@import "tailwindcss"`)
- lucide-react (icons), sonner (toasts), clsx + tailwind-merge (classnames)
- No state management library, no form library, no data fetching library

## Commands

- `npm run dev` — Start dev server (Turbopack)
- `npm run build` — Production build
- `npm run lint` — ESLint
- `docker compose up` — Run with Docker (signal-admin + signal-cli)

## Environment Variables

- `SIGNAL_CLI_URL` — URL of the signal-cli HTTP daemon (e.g. `http://localhost:8080`). Basic Auth supported (`http://user:pass@host:port`).

## Architecture

- Pure client-side SPA — all pages are `"use client"`, no SSR data fetching
- signal-cli server URL is configured via `SIGNAL_CLI_URL` environment variable (server-side only)
- Two React Contexts provide global state: `ServerConfigContext` (connection) and `AccountContext` (multi-account)
- CORS is solved via Next.js Route Handlers (`/api/rpc`, `/api/events`) that proxy requests server-side
- Docker-ready with `output: "standalone"` in Next.js config

## Conventions

- All user-facing text in English
- No external state/form libraries — use React hooks and native forms
- Utility function `cn()` from `src/lib/utils.ts` for conditional classnames
- UI style: neutral gray palette, blue accent, minimal/utilitarian
