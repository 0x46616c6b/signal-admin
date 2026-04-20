# API Proxy Routes

These Route Handlers are **server-side proxies** that forward requests from the browser to the signal-cli daemon. They exist to solve CORS and to handle Basic Auth securely.

## Security

- The signal-cli server URL (potentially including credentials) is passed from the client via `X-Signal-Server` header (RPC) or `?server=` query param (SSE)
- `parseServerUrl()` from `src/lib/proxy-utils.ts` extracts credentials and builds an `Authorization: Basic` header
- Credentials are **never** returned to the client — they are only used server-side for the upstream request

## Adding a new proxy route

1. Create `src/app/api/<name>/route.ts`
2. Read the server URL from headers/params
3. Use `parseServerUrl()` to extract auth
4. Forward the request to signal-cli and stream/return the response
5. Return `502` with a descriptive message on upstream failure

## SSE Route (`events/route.ts`)

- Uses `force-dynamic` export since it streams
- Pipes `upstream.body` directly to the client response
- Long-lived connection — does not work in serverless environments (Vercel), only in `standalone` mode or `npm run dev`
