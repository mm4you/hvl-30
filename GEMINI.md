# HVL 30 — Project Rules

## Project Overview
- **Tên:** HVL 30 — Trình phát nhạc album HVL của RPT MCK
- **Tech Stack:** Next.js 16 (App Router, Turbopack) + Supabase (PostgreSQL, Storage) + Vercel
- **Repo:** github.com/mm4you/hvl-30
- **Live:** hvl-30.vercel.app
- **Workspace:** D:\hvl-30

## Architecture
- 30 bài FLAC lossless với artwork riêng cho từng bài
- Synced Lyrics (LRC format) highlight nguyên dòng
- Audio-reactive neon border glow (Web Audio API AnalyserNode → CSS `--glow` variable)
- PWA với icon HVL đỏ bold trên nền đen
- Edge CDN caching cho `/api/catalog`
- Supabase region: `ap-southeast-1` (Singapore), Vercel region: `sin1`

## Key Files
- `app/page.tsx` — Toàn bộ player logic + UI (single-page app)
- `app/globals.css` — Tất cả styles, animations, responsive
- `app/layout.tsx` — Metadata, PWA manifest, icons
- `app/api/catalog/route.ts` — Edge-cached catalog API
- `app/api/stream/[id]/route.ts` — Audio streaming endpoint
- `components/lyrics/LyricLine.tsx` — Lyric line component
- `public/artwork/` — 30 ảnh bìa (01.jpg → 30.jpg)
- `public/favicon.svg` — Logo HVL đỏ bold monogram

## Build & Deploy Rules
- **LUÔN chạy `npm run build` trước khi commit/push** để đảm bảo 0 error
- Push lên `main` branch → Vercel auto-deploy
- Commit message format: `feat:`, `fix:`, `style:`, `perf:`

## UI/UX Decisions (Đã Được User Duyệt)
- Dark theme nhất quán, phong cách Underground/Hip-Hop
- Artwork đứng yên hoàn toàn, chỉ viền sáng đỏ nhấp nháy theo sóng nhạc
- Lyrics highlight nguyên dòng (không từng chữ)
- Label "Đôi lời" (không phải "Giới thiệu")
- Footer chỉ có: `Built by Khang with Codex · @mm4you`
- Không cần tài khoản đăng nhập
- `overflow: visible` trên `.player-card` để glow không bị cắt
