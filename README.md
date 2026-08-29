# HVL 30 — RPT MCK (Lossless FLAC & Synced Lyrics Web Player)

Trình phát nhạc kỹ thuật số cao cấp trọn bộ **30 bài hát album HVL** của **RPT MCK** định dạng **FLAC Lossless nguyên bản**, tích hợp **Karaoke Synced Lyrics** thời gian thực, lưu trữ dữ liệu với **Supabase** và tối ưu hóa để triển khai trên **Vercel**.

---

## ✨ Tính Năng Nổi Bật

* 🎧 **30 Bài hát FLAC Lossless:** Phát trực tiếp file âm thanh nguyên bản không nén hay giảm chất lượng qua HTTP Range Request (206 Partial Content).
* 🎨 **30 Tác phẩm Artwork:** Đóng gói tĩnh 30 bức tranh artwork độc quyền gắn liền với 30 ca khúc.
* 🎤 **Karaoke Synced Lyrics (Apple Music / Spotify Style):**
  * Tự động cuộn theo câu hát đang phát với hiệu ứng làm mờ và highlight câu hát.
  * Bấm vào bất kỳ dòng lyric nào để tua nhạc đến đúng giây đó ngay lập tức.
  * Chuyển đổi linh hoạt giữa chế độ *Đồng bộ (Karaoke)* và *Toàn văn (Plain Text)*.
* 🎛️ **Trình phát toàn năng:**
  * **Bottom Floating Player:** Thanh phát nhạc thu nhỏ cố định ở đáy màn hình, luôn đồng hành khi lướt web.
  * **Fullscreen Turntable Vinyl Mode:** Trải nghiệm đĩa than xoay vinyl chân thực, hào quang neon đỏ và giao diện điều khiển chuyên sâu.
  * **Điều khiển đầy đủ:** Play, Pause, Next, Prev, Seekbar, Shuffle (Trộn bài ngẫu nhiên Fisher-Yates), Repeat (Tắt / Lặp 1 bài / Lặp toàn bộ), Tốc độ phát (0.75x, 1x, 1.25x, 1.5x, 2x), Âm lượng & Tắt tiếng.
  * **Up Next Queue Drawer:** Xem danh sách phát tiếp theo, thêm bài, xóa bài khỏi hàng đợi.
  * **Yêu thích (Favorites):** Thả tim lưu bài hát yêu thích, đồng bộ LocalStorage & Supabase.
* 📱 **Hỗ trợ MediaSession & PWA:**
  * Điều khiển từ màn hình khóa (Lockscreen), Dynamic Island, Control Center trên iOS Safari & Android kèm ảnh bìa 512x512.
  * Cài đặt như một Native App trên màn hình chính (Add to Home Screen).
* 🗄️ **Tích hợp Database Supabase:**
  * Schema PostgreSQL tối ưu lưu trữ bài hát, lời bài hát, lượt nghe, lượt thích, danh sách yêu thích và lịch sử phát.
  * Tự động fallback dữ liệu cục bộ khi offline.

---

## 🚀 Công Nghệ Sử Dụng

* **Framework:** Next.js 15+ (App Router), React 19, TypeScript
* **Database & Backend:** Supabase (PostgreSQL)
* **Styling:** Tailwind CSS v4, Lucide Icons, Canvas Confetti
* **Platform:** Vercel (Edge & Node runtime)

---

## 🛠️ Cài Đặt & Chạy Môi Trường Cục Bộ

### 1. Cài đặt dependencies:
```bash
npm install
```

### 2. Cấu hình biến môi trường:
Tạo file `.env.local` ở thư mục gốc:
```env
NEXT_PUBLIC_SUPABASE_URL=https://ynhgxygzxqwqghfeieln.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_Fn-cYF4w6umDRyLVWypNjg_d2pQGFf9
```

### 3. Chạy môi trường phát triển:
```bash
npm run dev
```
Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

### 4. Build kiểm tra production:
```bash
npm run build
```

---

## 🗄️ Cấu Hình Supabase Database (1-Click)

1. Đăng nhập vào [Supabase Dashboard](https://supabase.com/dashboard/project/ynhgxygzxqwqghfeieln).
2. Vào mục **SQL Editor** -> Tạo **New query**.
3. Mở file `supabase/schema.sql` trong dự án, copy toàn bộ nội dung và dán vào SQL Editor rồi bấm **Run** để tạo cấu trúc bảng & RLS policies.
4. Mở file `supabase/seed.sql`, copy và dán vào SQL Editor rồi bấm **Run** để nạp sẵn toàn bộ metadata của 30 bài hát.

---

## 🌐 Triển Khai Lên Vercel (1-Click Deployment)

1. Đẩy code lên GitHub repository: [mm4you/hvl-30](https://github.com/mm4you/hvl-30).
2. Truy cập [Vercel Dashboard](https://vercel.com/new).
3. Chọn **Import** repository `mm4you/hvl-30`.
4. Trong mục **Environment Variables**, thêm:
   * `NEXT_PUBLIC_SUPABASE_URL`: `https://ynhgxygzxqwqghfeieln.supabase.co`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `sb_publishable_Fn-cYF4w6umDRyLVWypNjg_d2pQGFf9`
5. Bấm **Deploy**. Vercel sẽ tự động build và cung cấp domain live cho bạn trong vòng 1 phút!

---

## 🖤 Tác Giả & Bản Quyền
* Album: **HVL** — **RPT MCK**
* Remake & Modernization by [mm4you](https://github.com/mm4you)