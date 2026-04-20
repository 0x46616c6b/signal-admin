import { NextRequest, NextResponse } from "next/server";
import { getSignalCliUrl } from "@/lib/proxy-utils";

export async function POST(request: NextRequest) {
  try {
    const { url, authHeader } = getSignalCliUrl();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (authHeader) headers["Authorization"] = authHeader;

    const body = await request.json();
    const upstream = await fetch(`${url}/api/v1/rpc`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to reach signal-cli server: ${message}` },
      { status: 502 },
    );
  }
}
