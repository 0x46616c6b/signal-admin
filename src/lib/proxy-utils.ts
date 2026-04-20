/**
 * Parse a server URL that may contain Basic Auth credentials.
 * Input:  "http://user:pass@host:8080"
 * Output: { url: "http://host:8080", authHeader: "Basic dXNlcjpwYXNz" }
 */
export function parseServerUrl(raw: string): {
  url: string;
  authHeader: string | null;
} {
  const parsed = new URL(raw);

  if (parsed.username) {
    const credentials = `${decodeURIComponent(parsed.username)}:${decodeURIComponent(parsed.password)}`;
    const authHeader = `Basic ${Buffer.from(credentials).toString("base64")}`;
    parsed.username = "";
    parsed.password = "";
    return { url: parsed.origin + parsed.pathname.replace(/\/+$/, ""), authHeader };
  }

  return { url: parsed.origin + parsed.pathname.replace(/\/+$/, ""), authHeader: null };
}
