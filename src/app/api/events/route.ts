import { NextRequest } from "next/server";
import { parseServerUrl } from "@/lib/proxy-utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("server");
  const account = request.nextUrl.searchParams.get("account");

  if (!rawUrl) {
    return new Response("Missing server parameter", { status: 400 });
  }

  try {
    const { url, authHeader } = parseServerUrl(rawUrl);
    let targetUrl = `${url}/api/v1/events`;
    if (account) targetUrl += `?account=${encodeURIComponent(account)}`;

    const headers: Record<string, string> = {
      Accept: "text/event-stream",
    };
    if (authHeader) headers["Authorization"] = authHeader;

    const upstream = await fetch(targetUrl, { headers });

    if (!upstream.ok || !upstream.body) {
      return new Response("Failed to connect to SSE stream", {
        status: upstream.status,
      });
    }

    return new Response(upstream.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(`SSE connection failed: ${message}`, { status: 502 });
  }
}
