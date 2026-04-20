# Hooks

## use-rpc.ts

Two hooks for JSON-RPC calls:

- **`useRpc<T>(method, params?, options?)`** — Auto-fetches on mount and when `selectedAccount` changes. Returns `{ data, error, isLoading, execute, setData }`. Use for data display (lists, details).
- **`useRpcAction<T>()`** — Manual trigger only. Returns `{ execute, isLoading, error }`. Use for mutations (send, update, delete).

Both hooks auto-inject `{ account: selectedAccount }` into params. Do not pass `account` manually.

The `execute()` function accepts `overrideParams` that merge on top of the default params.

## use-sse.ts

Manages an `SSEClient` lifecycle tied to `serverUrl` and `selectedAccount`. Reconnects automatically when the account changes. Events are stored in a FIFO buffer (max 500). Not persisted.
