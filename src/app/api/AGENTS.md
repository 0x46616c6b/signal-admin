# API Proxy Routes

These Route Handlers are **server-side proxies** that forward requests from the browser to the signal-cli daemon. They exist to solve CORS and to handle Basic Auth securely.

## Security

- The signal-cli server URL is read from the `SIGNAL_CLI_URL` environment variable (server-side only)
- `getSignalCliUrl()` from `src/lib/proxy-utils.ts` reads the env var and extracts credentials via `parseServerUrl()`
- Credentials are **never** returned to the client — they are only used server-side for the upstream request

## Adding a new proxy route

1. Create `src/app/api/<name>/route.ts`
2. Use `getSignalCliUrl()` to get the parsed URL and auth header
3. Forward the request to signal-cli and stream/return the response
4. Return `502` with a descriptive message on upstream failure

## SSE Route (`events/route.ts`)

- Uses `force-dynamic` export since it streams
- Pipes `upstream.body` directly to the client response
- Long-lived connection — does not work in serverless environments (Vercel), only in `standalone` mode or `npm run dev`
