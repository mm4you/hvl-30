import { NextRequest } from "next/server";

export const runtime = "edge";

// Strict File ID pattern
const DRIVE_FILE_ID_REGEX = /^[A-Za-z0-9_-]{10,200}$/;

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function confirmationUrl(html: string, fileId: string): URL | null {
  const form = html.match(/<form[^>]+action=["']([^"']+)["'][^>]*>([\s\S]*?)<\/form>/i);
  if (form) {
    const action = decodeHtml(form[1]);
    const targetUrl = new URL(action, "https://drive.google.com");

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
    return new URL(decodeHtml(link[0]));
  }
  return null;
}

function upstreamHeaders(request: Request, cookie?: string | null): Headers {
  const headers = new Headers({
    Accept: "audio/*,application/octet-stream;q=0.9,*/*;q=0.5",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  });
  const range = request.headers.get("range");
  if (range) {
    headers.set("Range", range.replace(/[\r\n]/g, "").trim());
  }
  if (cookie) {
    const cookieHeader = cookie
      .split(/,(?=[^;,]+=)/)
      .map((part) => part.split(";", 1)[0].trim())
      .filter(Boolean)
      .join("; ");
    if (cookieHeader) headers.set("Cookie", cookieHeader.replace(/[\r\n]/g, "").trim());
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
    if (confirmed) {
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

  await new Promise((resolve) => setTimeout(resolve, 250));
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
    if (value) headers.set(name, value.replace(/[\r\n]/g, "").trim());
  }

  headers.set("Content-Type", "audio/flac");
  headers.set("Content-Disposition", "inline");
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("CDN-Cache-Control", "public, max-age=31536000, immutable");
  headers.set("Vercel-CDN-Cache-Control", "public, max-age=31536000, immutable");
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

  if (!id || !DRIVE_FILE_ID_REGEX.test(id)) {
    return new Response(JSON.stringify({ error: "Invalid File ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const upstream = await fetchDriveFile(request, id);
    const contentType = upstream.headers.get("content-type") ?? "";
    if (!upstream.ok || contentType.includes("text/html")) {
      upstream.body?.cancel();
      return new Response(JSON.stringify({ error: "Audio currently unavailable" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }
    return streamedResponse(upstream, false);
  } catch {
    return new Response(JSON.stringify({ error: "Stream error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
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