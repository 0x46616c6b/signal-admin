# Signal Admin

Web-based admin interface for [signal-cli](https://github.com/AsamK/signal-cli/). Communicates with the signal-cli JSON-RPC 2.0 HTTP API through Next.js proxy routes.

## Setup

### Docker Compose (recommended)

```bash
docker compose up
```

This starts both signal-admin and signal-cli. The admin UI is available at [http://localhost:3000](http://localhost:3000).

### Manual

Requires a running [signal-cli](https://github.com/AsamK/signal-cli/) daemon with HTTP mode:

```bash
signal-cli --config /path/to/data daemon --http --receive-mode=on-connection
```

Then start the admin UI:

```bash
npm install
SIGNAL_CLI_URL=http://localhost:8080 npm run dev
```

## Configuration

| Variable | Description | Default |
|---|---|---|
| `SIGNAL_CLI_URL` | URL of the signal-cli HTTP daemon | — (required) |

Basic Auth is supported in the URL: `http://user:pass@host:port`

## Development

```bash
npm run dev       # Start dev server (Turbopack)
npm run build     # Production build
npm run lint      # ESLint
```

## Tech Stack

- [Next.js](https://nextjs.org) (App Router), TypeScript
- TailwindCSS v4
- lucide-react, sonner, clsx + tailwind-merge
