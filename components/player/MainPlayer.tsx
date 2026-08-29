"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePlayer } from "@/context/PlayerContext";
import { 
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, 
  Volume2, VolumeX, Headphones, ListMusic 
} from "lucide-react";
import { AppleLyricsIcon } from "@/components/ui/AppleLyricsIcon";
import { formatTime } from "@/lib/utils";
import { getLyricsForTrack } from "@/data/lyrics";

export function MainPlayer({
  playlistVisible,
  onTogglePlaylist,
}: {
  playlistVisible: boolean;
  onTogglePlaylist: () => void;
}) {
  const {
    currentTrack,
    isPlaying,
    isBuffering,
    togglePlay,
    nextTrack,
    prevTrack,
    currentTime,
    duration,
    seek,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    isHeadphonesConnected,
    shuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
  } = usePlayer();

  const [mobileTab, setMobileTab] = useState<"cover" | "lyrics">("cover");
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const lyricsScrollRef = useRef<HTMLDivElement | null>(null);

  const trackLyrics = currentTrack ? getLyricsForTrack(currentTrack.id) : null;
  const syncedLines = trackLyrics?.syncedLyrics || [];

  // Find active lyric index
  let activeLyricIdx = -1;
  for (let i = 0; i < syncedLines.length; i++) {
    const cur = syncedLines[i];
    const nxt = syncedLines[i + 1];
    if (currentTime >= cur.time && (!nxt || currentTime < nxt.time)) {
      activeLyricIdx = i;
      break;
    }
  }

  // Smooth Apple Music auto-scroll
  useEffect(() => {
    if (activeLineRef.current && lyricsScrollRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeLyricIdx]);

  if (!currentTrack) return null;

  return (
    <section className="relative overflow-hidden rounded-[32px] bg-[#0d0707]/90 border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.6)] p-6 sm:p-8 lg:p-12 backdrop-blur-3xl">
      {/* Dynamic ambient color mesh background (Apple Music style) */}
      <div 
        className="absolute -top-40 -right-20 w-[650px] h-[650px] bg-[#ff3725]/15 rounded-full blur-[140px] pointer-events-none transition-all duration-1000"
      />
      <div 
        className="absolute -bottom-40 -left-20 w-[650px] h-[650px] bg-[#7a0d06]/20 rounded-full blur-[140px] pointer-events-none transition-all duration-1000"
      />

      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden items-center justify-center gap-2 mb-6 bg-black/50 p-1.5 rounded-2xl border border-white/10">
        <button
          onClick={() => setMobileTab("cover")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            mobileTab === "cover"
              ? "bg-[#ff3725] text-white shadow-lg shadow-[#ff3725]/30"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Trình phát
        </button>
        <button
          onClick={() => setMobileTab("lyrics")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === "lyrics"
              ? "bg-[#ff3725] text-white shadow-lg shadow-[#ff3725]/30"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <AppleLyricsIcon className="w-3.5 h-3.5" />
          Lời bài hát
        </button>
      </div>

      {/* Spacious Split Grid (Apple Music Style) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 xl:gap-16 items-center">
        {/* LEFT SIDE: Album Artwork & Core Player */}
        <div className={`md:col-span-6 lg:col-span-5 flex flex-col items-center md:items-start ${mobileTab === "lyrics" ? "hidden md:flex" : "flex"}`}>
          {/* High-res Album Art with soft reflection */}
          <div className="relative w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[420px] aspect-square rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/15 bg-zinc-950 group mx-auto md:mx-0">
            <Image
              src={currentTrack.artworkUrl}
              alt={currentTrack.title}
              fill
              priority
              sizes="(max-width: 768px) 320px, 440px"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <span className="absolute top-4 left-4 text-xs font-mono font-extrabold bg-black/80 backdrop-blur-md text-white px-3 py-1 rounded-xl border border-white/15 shadow-sm">
              #{String(currentTrack.trackNumber).padStart(2, "0")}
            </span>
            <span className="absolute bottom-4 right-4 text-xs font-mono font-black bg-[#ff3725] text-white px-2.5 py-1 rounded-lg shadow-lg shadow-[#ff3725]/40">
              HVL 30
            </span>
          </div>

          {/* Track Heading */}
          <div className="w-full text-center md:text-left mt-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight truncate drop-shadow-sm">
              {currentTrack.title}
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 font-semibold mt-1">
              {currentTrack.artist}
            </p>
          </div>

          {/* Seekbar */}
          <div className="w-full mt-5">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="w-full accent-[#ff3725] cursor-pointer h-2"
            />
            <div className="flex justify-between text-xs font-mono text-zinc-400 mt-1.5">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Core Controls */}
          <div className="flex items-center justify-center md:justify-start gap-8 w-full my-4">
            <button
              onClick={prevTrack}
              className="p-3 text-zinc-300 hover:text-white active:scale-90 transition-all cursor-pointer"
              title="Bài trước"
            >
              <SkipBack className="w-7 h-7 fill-current" />
            </button>

            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full bg-[#ff3725] hover:bg-[#ff4e3e] active:scale-90 text-white flex items-center justify-center shadow-[0_10px_35px_rgba(255,55,35,0.45)] transition-all cursor-pointer"
              title={isPlaying ? "Tạm dừng" : "Phát"}
            >
              {isBuffering ? (
                <div className="w-7 h-7 border-3 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-7 h-7 fill-white" />
              ) : (
                <Play className="w-7 h-7 fill-white ml-0.5" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="p-3 text-zinc-300 hover:text-white active:scale-90 transition-all cursor-pointer"
              title="Bài tiếp theo"
            >
              <SkipForward className="w-7 h-7 fill-current" />
            </button>
          </div>

          {/* Bottom Controls Bar */}
          <div className="flex items-center justify-between w-full border-t border-white/10 pt-4 text-xs">
            {/* Volume with Headphones detection */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={toggleMute}
                className="text-zinc-400 hover:text-white p-1 transition-colors"
                title={isHeadphonesConnected ? "Đang kết nối tai nghe" : "Âm lượng"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-[#ff3725]" />
                ) : isHeadphonesConnected ? (
                  <Headphones className="w-5 h-5 text-[#ff3725] animate-pulse" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 sm:w-28 accent-[#ff3725] cursor-pointer h-1.5"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleShuffle}
                className={`p-2.5 rounded-xl border transition-all ${
                  shuffle
                    ? "bg-[#ff3725]/20 text-[#ff3725] border-[#ff3725]/40 shadow-sm"
                    : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
                }`}
                title={shuffle ? "Trộn bài: Đã bật" : "Trộn bài: Đã tắt"}
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={toggleRepeat}
                className={`p-2.5 rounded-xl border transition-all ${
                  repeatMode !== "off"
                    ? "bg-[#ff3725]/20 text-[#ff3725] border-[#ff3725]/40 shadow-sm"
                    : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
                }`}
                title={repeatMode === "one" ? "Lặp 1 bài" : repeatMode === "all" ? "Lặp toàn bộ" : "Không lặp"}
              >
                {repeatMode === "one" ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
              </button>

              <button
                onClick={onTogglePlaylist}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border font-bold text-xs sm:text-sm transition-all ${
                  playlistVisible
                    ? "bg-[#ff3725]/20 text-rose-300 border-[#ff3725]/40 shadow-sm"
                    : "bg-white/5 text-zinc-300 border-white/10 hover:text-white"
                }`}
              >
                <ListMusic className="w-4 h-4" />
                <span>{playlistVisible ? "Ẩn danh sách" : "Hiện danh sách"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Dedicated Apple Music Real-Time Lyrics View */}
        <div className={`md:col-span-6 lg:col-span-7 h-[480px] md:h-[560px] lg:h-[620px] flex flex-col rounded-[28px] bg-black/40 border border-white/10 p-6 md:p-8 lg:p-10 relative overflow-hidden backdrop-blur-2xl ${mobileTab === "cover" ? "hidden md:flex" : "flex"}`}>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-2 flex-shrink-0">
            <div className="flex items-center gap-2.5 text-[#ff3725]">
              <AppleLyricsIcon className="w-5 h-5" />
              <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-zinc-200">
                LYRICS
              </span>
            </div>
            <span className="text-xs text-zinc-500 font-medium">
              Chạm câu hát để phát
            </span>
          </div>

          {/* Top & Bottom gradient masks for Apple Music depth */}
          <div 
            ref={lyricsScrollRef}
            className="flex-1 overflow-y-auto space-y-6 py-10 pr-2 scroll-smooth"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
            }}
          >
            {syncedLines.length > 0 ? (
              syncedLines.map((line, idx) => {
                const isActive = idx === activeLyricIdx;
                return (
                  <div
                    key={idx}
                    ref={isActive ? activeLineRef : null}
                    onClick={() => seek(line.time)}
                    className={`cursor-pointer transition-all duration-300 ease-out select-none leading-relaxed ${
                      isActive
                        ? "text-2xl sm:text-3xl lg:text-4xl font-black text-white drop-shadow-[0_4px_30px_rgba(255,55,35,0.7)] scale-[1.03] origin-left"
                        : "text-base sm:text-xl lg:text-2xl font-bold text-white/30 blur-[0.4px] hover:text-white/80 hover:blur-none hover:scale-[1.01]"
                    }`}
                  >
                    {line.text}
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500 space-y-3">
                <AppleLyricsIcon className="w-12 h-12 opacity-30 text-[#ff3725]" />
                <p className="text-base font-semibold">Bản intro / nhạc dạo không lời.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}