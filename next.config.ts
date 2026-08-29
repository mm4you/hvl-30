import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: https://ynhgxygzxqwqghfeieln.supabase.co;
      media-src 'self' blob: data: https://drive.usercontent.google.com https://drive.google.com https://ynhgxygzxqwqghfeieln.supabase.co;
      connect-src 'self' https://ynhgxygzxqwqghfeieln.supabase.co https://drive.usercontent.google.com https://drive.google.com;
      font-src 'self' data:;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
    `.replace(/\s{2,}/g, " ").trim(),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // OWASP: Remove X-Powered-By header
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ynhgxygzxqwqghfeieln.supabase.co",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/api/stream/:id*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, HEAD, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Range, Accept-Ranges, Content-Range" },
          { key: "Cache-Control", value: "public, max-age=86400, no-transform" },
        ],
      },
    ];
  },
};

export default nextConfig;