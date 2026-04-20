# Core Libraries

## rpc-client.ts

JSON-RPC 2.0 client. Sends requests to `/api/rpc` (the Next.js proxy), not directly to signal-cli.

Error hierarchy:
- `RpcTransportError` — network/HTTP failure (server unreachable, 500, etc.)
- `RpcError` — JSON-RPC error response (invalid method, bad params, signal-cli internal error)

## sse-client.ts

Wraps `EventSource` for the SSE stream. Connects to `/api/events?account=...`.
Signal-cli sends JSON-RPC notifications as SSE events. The envelope is at `data.params.envelope` or `data.params`.

## types.ts

All TypeScript interfaces for signal-cli entities. When signal-cli adds new fields or methods, update types here first.
Type names match the signal-cli JSON-RPC documentation (camelCase params, not kebab-case).

## proxy-utils.ts

Server-side only (uses `Buffer`). Reads the signal-cli URL from the `SIGNAL_CLI_URL` environment variable.
Parses `http://user:pass@host:port` into a clean URL + `Authorization` header.
Used by both proxy Route Handlers.
