"use client";

import React from "react";
import Image from "next/image";
import { usePlayer } from "@/context/PlayerContext";
import { Play, Shuffle, Sparkles, Disc3, ShieldCheck, Share2 } from "lucide-react";
import confetti from "canvas-confetti";

export function AlbumHero() {
  const { tracks, playTrack, toggleShuffle, shuffle, isPlaying, currentTrack } = usePlayer();

  const handlePlayAll = () => {
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  const handleShufflePlay = () => {
    if (tracks.length > 0) {
      if (!shuffle) toggleShuffle();
      const randomIdx = Math.floor(Math.random() * tracks.length);
      playTrack(tracks[randomIdx], tracks);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "HVL 30 - RPT MCK",
        text: "Nghe trọn bộ 30 bài hát Lossless FLAC album HVL của RPT MCK",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Đã sao chép liên kết vào bộ nhớ tạm!");
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-rose-950/40 via-zinc-900/60 to-zinc-950/90 border border-white/10 p-6 md:p-8 mb-8 shadow-2xl backdrop-blur-xl">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-1/4 w-80 h-80 bg-rose-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
        {/* Album Artwork with Vinyl Peek Effect */}
        <div className="relative group flex-shrink-0 cursor-pointer" onClick={handlePlayAll}>
          {/* Vinyl behind */}
          <div 
            className={`absolute top-0 left-6 md:left-8 w-44 h-44 md:w-56 md:h-56 rounded-full bg-zinc-950 border-4 border-zinc-800 shadow-2xl flex items-center justify-center transition-all duration-700 ${
              isPlaying ? "translate-x-8 rotate-45" : "group-hover:translate-x-6"
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-rose-900/60 border border-zinc-700 flex items-center justify-center">
              <Disc3 className="w-8 h-8 text-white/50 animate-spin-slow" />
            </div>
          </div>

          {/* Main Cover */}
          <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-zinc-900">
            <Image
              src="/artwork/01.jpg"
              alt="HVL - RPT MCK Album Cover"
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl shadow-rose-600/50 scale-90 group-hover:scale-100 transition-transform">
                <Play className="w-6 h-6 fill-white ml-0.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Metadata & Actions */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              <Sparkles className="w-3 h-3" /> OFFICIAL ALBUM
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3 h-3" /> 100% FLAC LOSSLESS
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2">
            HVL
          </h1>
          <p className="text-base md:text-lg font-semibold text-rose-400 mb-2">
            RPT MCK
          </p>

          <p className="text-xs md:text-sm text-zinc-400 max-w-2xl mb-6 line-clamp-2 md:line-clamp-none">
            Trọn vẹn 30 bài hát với 30 tác phẩm nghệ thuật độc quyền. Phát trực tiếp file âm thanh nguyên bản không nén hay giảm chất lượng, tích hợp Karaoke Synced Lyrics.
          </p>

          {/* Stats & Action Buttons */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <button
              onClick={handlePlayAll}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold px-6 py-3 rounded-full shadow-lg shadow-rose-600/40 transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              Phát toàn bộ 30 bài
            </button>

            <button
              onClick={handleShufflePlay}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/15 active:scale-95 text-white font-semibold px-5 py-3 rounded-full border border-white/15 transition-all cursor-pointer"
            >
              <Shuffle className="w-4 h-4" />
              Trộn bài ngẫu nhiên
            </button>

            <button
              onClick={handleShare}
              className="p-3 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded-full border border-white/10 transition-colors"
              title="Chia sẻ album"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
