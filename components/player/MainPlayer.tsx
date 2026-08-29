"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePlayer } from "@/context/PlayerContext";
import { 
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, 
  Volume2, VolumeX, Headphones, ListMusic, X 
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

  const [lyricsOpen, setLyricsOpen] = useState(false);
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
    if (lyricsOpen && activeLineRef.current && lyricsScrollRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeLyricIdx, lyricsOpen]);

  if (!currentTrack) return null;

  return (
    <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#120808]/95 via-[#0b0707]/95 to-[#050505]/98 border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.6)] p-6 sm:p-8 md:p-10 backdrop-blur-3xl transition-all duration-500">
      {/* Dynamic ambient color mesh background */}
      <div className="absolute -top-32 right-1/4 w-[500px] h-[500px] bg-[#ff3725]/12 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/4 w-[500px] h-[500px] bg-[#7a0d06]/18 rounded-full blur-[130px] pointer-events-none" />

      {/* When Lyrics View is Opened */}
      {lyricsOpen ? (
        <div className="flex flex-col h-[480px] md:h-[540px] relative animate-in fade-in duration-300">
          {/* Top Bar of Lyrics View */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-white/15">
                <Image src={currentTrack.artworkUrl} alt={currentTrack.title} fill className="object-cover" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white truncate">{currentTrack.title}</h3>
                <p className="text-xs text-zinc-400 truncate">{currentTrack.artist}</p>
              </div>
            </div>

            <button
              onClick={() => setLyricsOpen(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
              Đóng lời
            </button>
          </div>

          {/* Apple Music Real-Time Synced Lyrics Scroll Area */}
          <div 
            ref={lyricsScrollRef}
            className="flex-1 overflow-y-auto space-y-6 py-8 px-2 md:px-6 scroll-smooth text-center md:text-left"
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
                        ? "text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-[0_4px_30px_rgba(255,55,35,0.8)] scale-[1.03] origin-center md:origin-left"
                        : "text-base sm:text-lg md:text-xl font-bold text-white/30 blur-[0.3px] hover:text-white/80 hover:blur-none hover:scale-[1.01]"
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

          {/* Mini Playback Controls in Lyrics View */}
          <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-2 flex-shrink-0">
            <div className="flex items-center gap-4">
              <button onClick={prevTrack} className="p-2 text-zinc-400 hover:text-white cursor-pointer">
                <SkipBack className="w-5 h-5 fill-current" />
              </button>
              <button 
                onClick={togglePlay} 
                className="w-11 h-11 rounded-full bg-[#ff3725] text-white flex items-center justify-center shadow-lg shadow-[#ff3725]/40 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
              </button>
              <button onClick={nextTrack} className="p-2 text-zinc-400 hover:text-white cursor-pointer">
                <SkipForward className="w-5 h-5 fill-current" />
              </button>
            </div>

            <div className="text-xs font-mono text-zinc-400">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>
      ) : (
        /* Standard Clean Focused Player View */
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 animate-in fade-in duration-300">
          {/* Album Cover */}
          <div className="relative w-64 sm:w-72 md:w-80 lg:w-96 aspect-square rounded-[24px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-white/15 bg-zinc-950 flex-shrink-0 group">
            <Image
              src={currentTrack.artworkUrl}
              alt={currentTrack.title}
              fill
              priority
              sizes="(max-width: 768px) 288px, 384px"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <span className="absolute top-4 left-4 text-xs font-mono font-extrabold bg-black/80 backdrop-blur-md text-white px-3 py-1 rounded-xl border border-white/15 shadow-sm">
              #{String(currentTrack.trackNumber).padStart(2, "0")}
            </span>
            <span className="absolute bottom-4 right-4 text-xs font-mono font-black bg-[#ff3725] text-white px-2.5 py-1 rounded-lg shadow-lg shadow-[#ff3725]/40">
              HVL 30
            </span>
          </div>

          {/* Player Info & Full Controls */}
          <div className="flex-1 w-full flex flex-col justify-between">
            {/* Title & Artist */}
            <div className="text-center md:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight truncate drop-shadow-sm">
                {currentTrack.title}
              </h1>
              <p className="text-base sm:text-lg text-zinc-400 font-semibold mt-1">
                {currentTrack.artist}
              </p>
            </div>

            {/* Seekbar */}
            <div className="w-full mt-6">
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

            {/* Core Playback Controls */}
            <div className="flex items-center justify-center md:justify-start gap-8 w-full my-6">
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
            <div className="flex flex-wrap items-center justify-between gap-3 w-full border-t border-white/10 pt-4 text-xs">
              {/* Volume */}
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

              {/* Actions & Lyrics Trigger Button */}
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

                {/* Apple Music Lyrics Toggle Button */}
                <button
                  onClick={() => setLyricsOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border font-bold text-xs sm:text-sm bg-white/5 hover:bg-[#ff3725]/20 hover:text-[#ff3725] text-zinc-300 border-white/10 hover:border-[#ff3725]/40 transition-all cursor-pointer"
                >
                  <AppleLyricsIcon className="w-4 h-4 text-[#ff3725]" />
                  <span>Lời bài hát</span>
                </button>

                <button
                  onClick={onTogglePlaylist}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border font-bold text-xs sm:text-sm transition-all ${
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
        </div>
      )}
    </section>
  );
}