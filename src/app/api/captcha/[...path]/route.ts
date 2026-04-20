import { NextRequest, NextResponse } from "next/server";

const UPSTREAM = "https://signalcaptchas.org";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const targetPath = "/" + path.join("/");
  const url = new URL(targetPath, UPSTREAM);
  url.search = request.nextUrl.search;

  const upstream = await fetch(url.toString(), {
    headers: { "User-Agent": request.headers.get("user-agent") ?? "" },
  });

  const contentType = upstream.headers.get("content-type") ?? "";

  if (contentType.includes("text/html")) {
    let html = await upstream.text();
    // Rewrite absolute paths so assets load through our proxy
    html = html.replace(/href="\//g, 'href="/api/captcha/');
    html = html.replace(/src="\//g, 'src="/api/captcha/');
    html = html.replace(/'\/shortener'/g, "'/api/captcha/shortener'");
    return new NextResponse(html, {
      status: upstream.status,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  const body = await upstream.arrayBuffer();
  return new NextResponse(body, {
    status: upstream.status,
    headers: { "content-type": contentType },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const targetPath = "/" + path.join("/");
  const url = new URL(targetPath, UPSTREAM);

  const upstream = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "content-type": request.headers.get("content-type") ?? "text/plain",
      "User-Agent": request.headers.get("user-agent") ?? "",
    },
    body: await request.text(),
  });

  const body = await upstream.text();
  return new NextResponse(body, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "text/plain",
    },
  });
}
