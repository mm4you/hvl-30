import type { Metadata, Viewport } from "next";
import { PlayerProvider } from "@/context/PlayerContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "HVL 30 - RPT MCK | Trình nghe nhạc Lossless FLAC",
  description: "Trình nghe nhạc chất lượng gốc FLAC cho trọn bộ 30 bài hát album HVL của RPT MCK với Synced Lyrics và giao diện hiện đại.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
    apple: "/icon-192.png",
  },
  openGraph: {
    title: "HVL 30 - RPT MCK",
    description: "Trọn bộ 30 bài hát FLAC Lossless album HVL & Synced Lyrics",
    images: ["/artwork/01.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="min-h-screen bg-[#09090b] text-[#f4f4f5] antialiased selection:bg-rose-600 selection:text-white">
        <PlayerProvider>
          {children}
        </PlayerProvider>
      </body>
    </html>
  );
}
