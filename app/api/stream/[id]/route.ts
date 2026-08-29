import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// OWASP A03 / A10: Strict File ID pattern (Only alphanumeric, underscore, hyphen)
const DRIVE_FILE_ID_REGEX = /^[A-Za-z0-9_-]{15,100}$/;

// OWASP A10: Allowed Upstream Hostnames for SSRF mitigation
const ALLOWED_HOSTS = new Set([
  "drive.usercontent.google.com",
  "drive.google.com",
  "doc-0s-94-docs.googleusercontent.com",
  "doc-08-94-docs.googleusercontent.com",
]);

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function isAllowedUrl(urlString: string): boolean {
  try {
    const parsed = new URL(urlString);
    if (parsed.protocol !== "https:") return false;
    // Disallow IP literals, localhost, and private networks
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(parsed.hostname)) return false;
    if (parsed.hostname.includes("localhost") || parsed.hostname.endsWith(".internal")) return false;
    return parsed.hostname.endsWith(".google.com") || parsed.hostname.endsWith(".googleusercontent.com");
  } catch {
    return false;
  }
}

function confirmationUrl(html: string, fileId: string): URL | null {
  const form = html.match(/<form[^>]+action=["']([^"']+)["'][^>]*>([\s\S]*?)<\/form>/i);
  if (form) {
    const action = decodeHtml(form[1]);
    const targetUrl = new URL(action, "https://drive.google.com");
    if (!isAllowedUrl(targetUrl.toString())) return null;

    const inputs = form[2].matchAll(/<input\b[^>]*>/gi);
    for (const input of inputs) {
      const name = input[0].match(/\bname=["']([^"']+)["']/i)?.[1];
      const value = input[0].match(/\bvalue=["']([^"']*)["']/i)?.[1] ?? "";
      if (name) targetUrl.searchParams.set(decodeHtml(name), decodeHtml(value));
    }
    if (!targetUrl.searchParams.has("id")) targetUrl.searchParams.set("id", fileId);
    if (!targetUrl.searchParams.has("export")) targetUrl.searchParams.set("export", "download");
    return targetUrl;
  }

  const link = html.match(/https:\/\/[a-z0-9.-]*googleusercontent\.com\/download\?[^"'<>\s]+/i);
  if (link) {
    const decoded = decodeHtml(link[0]);
    if (isAllowedUrl(decoded)) return new URL(decoded);
  }
  return null;
}

function sanitizeHeader(value: string | null): string {
  if (!value) return "";
  // Strip CRLF to prevent HTTP response splitting
  return value.replace(/[\r\n]/g, "").trim();
}

function upstreamHeaders(request: Request, cookie?: string | null): Headers {
  const headers = new Headers({
    Accept: "audio/*,application/octet-stream;q=0.9,*/*;q=0.5",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  });
  const range = request.headers.get("range");
  if (range) {
    const sanitizedRange = sanitizeHeader(range);
    if (/^bytes=\d*-\d*$/.test(sanitizedRange)) {
      headers.set("Range", sanitizedRange);
    }
  }
  if (cookie) {
    const cookieHeader = cookie
      .split(/,(?=[^;,]+=)/)
      .map((part) => part.split(";", 1)[0].trim())
      .filter(Boolean)
      .join("; ");
    if (cookieHeader) headers.set("Cookie", sanitizeHeader(cookieHeader));
  }
  return headers;
}

async function fetchDriveAttempt(request: Request, fileId: string): Promise<Response> {
  const direct = new URL("https://drive.usercontent.google.com/download");
  direct.searchParams.set("id", fileId);
  direct.searchParams.set("export", "download");
  direct.searchParams.set("confirm", "t");

  let response = await fetch(direct.toString(), {
    headers: upstreamHeaders(request, null),
    redirect: "follow",
  });

  const firstType = response.headers.get("content-type") ?? "";
  if (firstType.includes("text/html")) {
    const cookie = response.headers.get("set-cookie");
    const html = await response.text();
    const confirmed = confirmationUrl(html, fileId);
    if (confirmed && isAllowedUrl(confirmed.toString())) {
      response = await fetch(confirmed.toString(), {
        headers: upstreamHeaders(request, cookie),
        redirect: "follow",
      });
    }
  }

  return response;
}

async function fetchDriveFile(request: Request, fileId: string): Promise<Response> {
  let response = await fetchDriveAttempt(request, fileId);
  const contentType = response.headers.get("content-type") ?? "";
  const transientFailure =
    response.status === 403 ||
    response.status === 408 ||
    response.status === 425 ||
    response.status === 429 ||
    response.status >= 500 ||
    contentType.includes("text/html");

  if (!transientFailure) return response;

  try {
    await response.body?.cancel();
  } catch {}

  await new Promise((resolve) => setTimeout(resolve, 300));
  return fetchDriveAttempt(request, fileId);
}

function streamedResponse(upstream: Response, headOnly = false): Response {
  const headers = new Headers();
  const copyHeaders = [
    "accept-ranges",
    "content-length",
    "content-range",
    "etag",
    "last-modified",
  ];
  for (const name of copyHeaders) {
    const value = upstream.headers.get(name);
    if (value) headers.set(name, sanitizeHeader(value));
  }

  headers.set("Content-Type", "audio/flac");
  headers.set("Content-Disposition", "inline");
  headers.set("Cache-Control", "public, max-age=86400, no-transform");
  headers.set("Vary", "Range");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Access-Control-Allow-Origin", "*");

  if (headOnly) {
    void upstream.body?.cancel();
    return new Response(null, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers,
    });
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await context.params;

  // OWASP A03 Input Validation
  if (!id || !DRIVE_FILE_ID_REGEX.test(id)) {
    return new Response(JSON.stringify({ error: "Invalid or malformed File ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json", "X-Content-Type-Options": "nosniff" },
    });
  }

  try {
    const upstream = await fetchDriveFile(request, id);
    const contentType = upstream.headers.get("content-type") ?? "";
    if (!upstream.ok || contentType.includes("text/html")) {
      upstream.body?.cancel();
      return new Response(JSON.stringify({ error: "Audio resource currently unavailable" }), {
        status: 502,
        headers: { "Content-Type": "application/json", "X-Content-Type-Options": "nosniff" },
      });
    }
    return streamedResponse(upstream, false);
  } catch {
    return new Response(JSON.stringify({ error: "Internal streaming error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", "X-Content-Type-Options": "nosniff" },
    });
  }
}

export async function HEAD(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await context.params;

  if (!id || !DRIVE_FILE_ID_REGEX.test(id)) {
    return new Response(null, { status: 400 });
  }

  try {
    const upstream = await fetchDriveFile(request, id);
    return streamedResponse(upstream, true);
  } catch {
    return new Response(null, { status: 500 });
  }
}