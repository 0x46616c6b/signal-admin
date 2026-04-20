# Signal Admin — Agent Guidelines

## Project Overview

Admin interface for [signal-cli](https://github.com/AsamK/signal-cli/) JSON-RPC 2.0 HTTP API.
The signal-cli daemon exposes:
- `POST /api/v1/rpc` — JSON-RPC method calls
- `GET /api/v1/events` — Server-Sent Events stream (incoming messages)
- `GET /api/v1/check` — Health check

## Architecture

```
Browser → Next.js Proxy Routes → signal-cli daemon
            /api/rpc              POST /api/v1/rpc
            /api/events           GET  /api/v1/events
```

The browser never calls signal-cli directly. Proxy routes handle CORS and Basic Auth.

### Key Files

| File | Purpose |
|---|---|
| `src/lib/rpc-client.ts` | JSON-RPC 2.0 client class, sends requests via `/api/rpc` proxy |
| `src/lib/sse-client.ts` | EventSource wrapper, connects via `/api/events` proxy |
| `src/lib/proxy-utils.ts` | Extracts Basic Auth credentials from URLs for proxy routes |
| `src/lib/types.ts` | TypeScript types for all signal-cli entities |
| `src/contexts/server-config-context.tsx` | Server URL (localStorage), connection state, health checks |
| `src/contexts/account-context.tsx` | Account list, selected account (from `listAccounts` RPC) |
| `src/hooks/use-rpc.ts` | `useRpc` (auto-fetch) and `useRpcAction` (manual trigger) hooks |
| `src/hooks/use-sse.ts` | SSE subscription hook, manages EventSource lifecycle |
| `src/app/api/rpc/route.ts` | Proxy: forwards JSON-RPC to signal-cli with auth headers |
| `src/app/api/events/route.ts` | Proxy: streams SSE from signal-cli to client |

### State Management

- `ServerConfigContext` — server URL (persisted in localStorage), `isConnected`, `rpcClient` instance
- `AccountContext` — `accounts[]`, `selectedAccount` (phone number)
- `useRpc` hook auto-injects `{ account: selectedAccount }` into every RPC call
- Per-page data is local state, no global cache

### JSON-RPC Protocol

Requests follow this format:
```json
{"jsonrpc": "2.0", "method": "send", "params": {"account": "+49...", "recipients": ["+49..."], "message": "Hi"}, "id": "uuid"}
```

The `account` param is required in multi-account mode and auto-injected by `useRpc`.

## Conventions

- All page components under `src/app/(app)/` are `"use client"` and wrapped in `<AppShell title="...">`
- New pages: create `src/app/(app)/<name>/page.tsx`, add nav entry in `src/components/layout/sidebar.tsx`
- New RPC methods: add TypeScript types in `src/lib/types.ts`, use `useRpc` or `useRpcAction` hooks
- Error handling: use `toast.error()` from sonner for user-facing errors
- TailwindCSS v4 — utility classes only, no `tailwind.config.ts` theme extensions, use `@theme inline` in `globals.css`
- Icons: import from `lucide-react`
