"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePlayer } from "@/context/PlayerContext";
import { 
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, 
  Volume2, VolumeX, Headphones, Mic2, ListMusic 
} from "lucide-react";
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

  // Smooth auto-scroll lyrics
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
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#140b0b]/95 via-[#0e0909]/95 to-[#060606]/98 border border-white/10 shadow-2xl p-6 sm:p-8 lg:p-12 backdrop-blur-2xl">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 right-1/4 w-[600px] h-[600px] bg-rose-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/4 w-[600px] h-[600px] bg-rose-950/25 rounded-full blur-[120px] pointer-events-none" />

      {/* Mobile Switcher Tab */}
      <div className="flex md:hidden items-center justify-center gap-2 mb-6 bg-black/40 p-1.5 rounded-2xl border border-white/10">
        <button
          onClick={() => setMobileTab("cover")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            mobileTab === "cover"
              ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Trình phát
        </button>
        <button
          onClick={() => setMobileTab("lyrics")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === "lyrics"
              ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Mic2 className="w-3.5 h-3.5" />
          Lời bài hát
        </button>
      </div>

      {/* Spacious Split Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 xl:gap-16 items-center">
        {/* LEFT COLUMN: Cover & Player Controls */}
        <div className={`md:col-span-6 lg:col-span-5 flex flex-col items-center md:items-start ${mobileTab === "lyrics" ? "hidden md:flex" : "flex"}`}>
          {/* High-definition Album Cover */}
          <div className="relative w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[420px] aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-zinc-950 group mx-auto md:mx-0">
            <Image
              src={currentTrack.artworkUrl}
              alt={currentTrack.title}
              fill
              priority
              sizes="(max-width: 768px) 320px, 440px"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Gloss overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <span className="absolute top-3.5 left-3.5 text-xs font-mono font-bold bg-black/80 backdrop-blur-md text-white px-3 py-1 rounded-lg border border-white/15">
              #{String(currentTrack.trackNumber).padStart(2, "0")}
            </span>
            <span className="absolute bottom-3.5 right-3.5 text-xs font-mono font-extrabold bg-rose-600 text-white px-2.5 py-1 rounded-lg shadow-xl shadow-rose-600/40">
              HVL 30
            </span>
          </div>

          {/* Track Heading */}
          <div className="w-full text-center md:text-left mt-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight truncate">
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
              className="w-full accent-rose-500 cursor-pointer h-2"
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
              className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-90 text-white flex items-center justify-center shadow-2xl shadow-rose-600/50 transition-all cursor-pointer"
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

          {/* Volume with Headphone detection & Actions */}
          <div className="flex items-center justify-between w-full border-t border-white/10 pt-4 text-xs">
            {/* Volume */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={toggleMute}
                className="text-zinc-400 hover:text-white p-1"
                title={isHeadphonesConnected ? "Đang kết nối tai nghe" : "Âm lượng"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-rose-400" />
                ) : isHeadphonesConnected ? (
                  <Headphones className="w-5 h-5 text-rose-400 animate-pulse" />
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
                className="w-24 sm:w-28 accent-rose-500 cursor-pointer h-1.5"
              />
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleShuffle}
                className={`p-2.5 rounded-xl border transition-all ${
                  shuffle
                    ? "bg-rose-600/20 text-rose-400 border-rose-500/40"
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
                    ? "bg-rose-600/20 text-rose-400 border-rose-500/40"
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
                    ? "bg-rose-600/20 text-rose-300 border-rose-500/40"
                    : "bg-white/5 text-zinc-300 border-white/10 hover:text-white"
                }`}
              >
                <ListMusic className="w-4 h-4" />
                <span>{playlistVisible ? "Ẩn danh sách" : "Hiện danh sách"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Dedicated Live Synced Karaoke Lyrics Panel */}
        <div className={`md:col-span-6 lg:col-span-7 h-[460px] md:h-[540px] lg:h-[600px] flex flex-col rounded-3xl bg-black/40 border border-white/10 p-5 md:p-8 overflow-hidden ${mobileTab === "cover" ? "hidden md:flex" : "flex"}`}>
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-2">
            <div className="flex items-center gap-2">
              <Mic2 className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-300">
                KARAOKE LYRICS
              </span>
            </div>
            <span className="text-xs text-zinc-500">
              Chạm câu hát để tua
            </span>
          </div>

          {/* Scrollable lyrics */}
          <div 
            ref={lyricsScrollRef}
            className="flex-1 overflow-y-auto space-y-5 py-8 text-right md:text-left pr-3 scroll-smooth"
          >
            {syncedLines.length > 0 ? (
              syncedLines.map((line, idx) => {
                const isActive = idx === activeLyricIdx;
                return (
                  <div
                    key={idx}
                    ref={isActive ? activeLineRef : null}
                    onClick={() => seek(line.time)}
                    className={`cursor-pointer transition-all duration-300 leading-relaxed ${
                      isActive
                        ? "text-2xl md:text-3xl lg:text-4xl font-black text-rose-400 drop-shadow-lg scale-[1.02] origin-left"
                        : "text-base md:text-lg lg:text-xl font-medium text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {line.text}
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500 space-y-2">
                <Mic2 className="w-10 h-10 opacity-30 text-rose-500" />
                <p className="text-base font-medium">Bản intro / nhạc dạo không lời.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}