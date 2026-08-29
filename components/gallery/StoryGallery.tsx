"use client";

import React from "react";
import Image from "next/image";
import { usePlayer } from "@/context/PlayerContext";
import { Play, Sparkles, Disc, BookOpen } from "lucide-react";
import confetti from "canvas-confetti";

export function StoryGallery() {
  const { tracks, playTrack, currentTrack } = usePlayer();

  const handleArtworkClick = (track: typeof tracks[0]) => {
    playTrack(track);
    confetti({
      particleCount: 35,
      spread: 50,
      origin: { y: 0.85 },
    });
  };

  return (
    <div className="space-y-8">
      {/* Story Introduction Card */}
      <div className="rounded-3xl bg-zinc-950/70 border border-white/10 p-6 md:p-10 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <BookOpen className="w-3.5 h-3.5" /> CÂU CHUYỆN ALBUM
          </span>
          <span className="text-xs text-zinc-400">RPT MCK</span>
        </div>

        <h2 className="text-2xl md:text-4xl font-black text-white mb-4 tracking-tight">
          HVL 30 — Hành Trình Âm Nhạc & Thị Giác Độc Bản
        </h2>

        <div className="space-y-4 text-sm md:text-base text-zinc-300 leading-relaxed max-w-4xl">
          <p>
            <strong className="text-rose-400 font-bold">HVL 30</strong> là dự án trình phát nhạc kỹ thuật số chất lượng cao dành riêng cho album HVL của RPT MCK. Dự án gồm trọn vẹn 30 bài hát định dạng Lossless FLAC nguyên bản, kết hợp cùng 30 bức tranh artwork độc quyền gắn liền với tinh thần của từng ca khúc.
          </p>
          <p>
            Không qua nén hay giảm bitrate, từng tần số âm thanh từ những bản hit như <em>IDK</em>, <em>Wtf Bby I'm Lit</em>, <em>Baby (feat. marzuz)</em>, <em>Nếu Như Ta Chẳng Còn</em>, <em>Envy</em> cho đến <em>Thịt Lợn</em> đều được truyền tải sống động qua hệ thống stream hỗ trợ HTTP Range 206.
          </p>
          <p>
            Đặc biệt, hệ thống lời bài hát đồng bộ (Karaoke Synced Lyrics) giúp bạn hòa mình trọn vẹn vào từng câu chữ và nhịp điệu của album.
          </p>
        </div>
      </div>

      {/* 30 Artworks Gallery */}
      <div className="rounded-3xl bg-zinc-950/70 border border-white/10 p-6 md:p-10 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-400" />
              Gallery 30 Tác Phẩm Artwork
            </h3>
            <p className="text-xs md:text-sm text-zinc-400 mt-1">
              Bấm vào bất kỳ tác phẩm nào để phát ngay bài hát tương ứng
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300">
            30/30 Artwork
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
          {tracks.map((track, idx) => {
            const isCurrent = currentTrack?.id === track.id;

            return (
              <div
                key={track.id}
                onClick={() => handleArtworkClick(track)}
                className={`group relative rounded-2xl overflow-hidden aspect-square border transition-all duration-300 cursor-pointer shadow-md ${
                  isCurrent
                    ? "border-rose-500 ring-2 ring-rose-500/50 scale-105"
                    : "border-white/10 hover:border-rose-500/60 hover:scale-105"
                }`}
              >
                <Image
                  src={track.artworkUrl}
                  alt={track.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Track number badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-white border border-white/10">
                  #{String(idx + 1).padStart(2, "0")}
                </div>

                {/* Hover overlay with title & play icon */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
                  <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg mb-1 mx-auto">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                  <h4 className="text-xs font-bold text-white text-center truncate">
                    {track.title}
                  </h4>
                  <p className="text-[10px] text-zinc-400 text-center truncate">
                    {track.artist}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
