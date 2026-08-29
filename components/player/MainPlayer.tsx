"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import { usePlayer } from "@/context/PlayerContext";
import { 
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, 
  Volume2, VolumeX, Headphones, ListMusic, Maximize2, X 
} from "lucide-react";
import { AppleLyricsIcon } from "@/components/ui/AppleLyricsIcon";
import { formatTime } from "@/lib/utils";
import { getLyricsForTrack } from "@/data/lyrics";

export function MainPlayer({
  playlistVisible,
  onTogglePlaylist,
  onOpenCinema,
}: {
  playlistVisible: boolean;
  onTogglePlaylist: () => void;
  onOpenCinema?: () => void;
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
  const [userScrolling, setUserScrolling] = useState(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trackLyrics = currentTrack ? getLyricsForTrack(currentTrack.id) : null;
  
  // Clean real vocal lines only
  const syncedLines = useMemo(() => {
    return (trackLyrics?.syncedLyrics || []).filter((line) => {
      const clean = line.text.replace(/^\[.*?\]\s*/g, "").trim();
      return clean.length > 0;
    });
  }, [trackLyrics]);

  // Exact timestamp matching with 0.1s natural acoustic lead
  const activeLyricIdx = useMemo(() => {
    if (!syncedLines.length || currentTime < syncedLines[0].time) return -1;
    let idx = -1;
    const timeWithLead = currentTime + 0.1;
    for (let i = 0; i < syncedLines.length; i++) {
      if (timeWithLead >= syncedLines[i].time) {
        idx = i;
      } else {
        break;
      }
    }
    return idx;
  }, [currentTime, syncedLines]);

  // Smooth scroll to active line
  useEffect(() => {
    if (!lyricsOpen || userScrolling || activeLyricIdx < 0) return;
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeLyricIdx, lyricsOpen, userScrolling]);

  const handleUserScroll = useCallback(() => {
    setUserScrolling(true);
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      setUserScrolling(false);
    }, 2600);
  }, []);

  if (!currentTrack) return null;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#120a0b]/90 border border-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.6)] p-5 sm:p-7 md:p-8 backdrop-blur-2xl transition-all duration-300">
      {/* Dynamic Ambient Red Back-Glow */}
      <div className={`absolute -top-20 -left-20 w-96 h-96 bg-[#ff3725]/15 rounded-full blur-[140px] pointer-events-none transition-opacity duration-1000 ${isPlaying ? "opacity-100" : "opacity-40"}`} />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#600a06]/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Lyrics View */}
      {lyricsOpen ? (
        <div className="flex flex-col h-[400px] sm:h-[450px] relative animate-in fade-in duration-200">
          {/* Top Bar of Lyrics View */}
          <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-2 flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-12 aspect-[3/2] rounded-lg overflow-hidden flex-shrink-0 border border-white/15 shadow-sm">
                <Image src={currentTrack.artworkUrl} alt={currentTrack.title} fill className="object-cover" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white truncate tracking-tight">{currentTrack.title}</h3>
                <p className="text-xs text-zinc-400 truncate">{currentTrack.artist}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onOpenCinema && (
                <button
                  onClick={onOpenCinema}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all active:scale-95 cursor-pointer"
                  title="Chế độ Cinema toàn màn hình"
                >
                  <Maximize2 className="w-4 h-4 text-[#ff3725]" />
                </button>
              )}

              <button
                onClick={() => setLyricsOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all cursor-pointer active:scale-95"
                title="Đóng lời bài hát"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Smooth Real-Time Synced Lyrics (Pure Typography) */}
          <div 
            ref={lyricsScrollRef}
            onWheel={handleUserScroll}
            onTouchMove={handleUserScroll}
            className="flex-1 overflow-y-auto space-y-4 py-8 px-2 sm:px-6 scroll-smooth text-center"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
            }}
          >
            {syncedLines.length > 0 ? (
              syncedLines.map((line, idx) => {
                const isActive = idx === activeLyricIdx;
                const text = line.text.replace(/^\[.*?\]\s*/g, "").trim();
                if (!text) return null;

                return (
                  <div
                    key={idx}
                    ref={isActive ? activeLineRef : null}
                    onClick={() => {
                      seek(line.time);
                      setUserScrolling(false);
                    }}
                    className={`cursor-pointer transition-all duration-300 ease-out select-none leading-relaxed ${
                      isActive
                        ? "text-xl sm:text-2xl md:text-3xl font-extrabold text-white drop-shadow-[0_2px_24px_rgba(255,55,35,0.9)] scale-[1.03]"
                        : "text-sm sm:text-base font-semibold text-white/35 hover:text-white/80 hover:scale-[1.01]"
                    }`}
                  >
                    {text}
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500 space-y-2">
                <AppleLyricsIcon className="w-8 h-8 opacity-30 text-[#ff3725]" />
                <p className="text-sm font-medium">Bản nhạc không lời hoặc không có lyrics.</p>
              </div>
            )}
          </div>

          {/* Mini Playback Controls in Lyrics View */}
          <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-1 flex-shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={prevTrack} className="p-2 text-zinc-400 hover:text-white cursor-pointer active:scale-90 transition-transform">
                <SkipBack className="w-4 h-4 fill-current" />
              </button>
              <button 
                onClick={togglePlay} 
                className="w-10 h-10 rounded-full bg-[#ff3725] hover:bg-[#ff4e3e] text-white flex items-center justify-center shadow-lg shadow-[#ff3725]/40 cursor-pointer active:scale-95 transition-all"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
              </button>
              <button onClick={nextTrack} className="p-2 text-zinc-400 hover:text-white cursor-pointer active:scale-90 transition-transform">
                <SkipForward className="w-4 h-4 fill-current" />
              </button>
            </div>

            <div className="text-xs font-mono text-zinc-400">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>
      ) : (
        /* Standard Hi-Fi Studio Player View with 3:2 Landscape Artwork */
        <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 md:gap-10 animate-in fade-in duration-200">
          {/* 3:2 Landscape Artwork with Ambient Back-Glow */}
          <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[360px] aspect-[3/2] rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-zinc-950 flex-shrink-0 group">
            <Image
              src={currentTrack.artworkUrl}
              alt={currentTrack.title}
              fill
              priority
              sizes="(max-width: 768px) 320px, 360px"
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            {/* Soft ambient inner shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            
            {/* Minimalist Index Badge */}
            <span className="absolute top-2.5 left-2.5 text-[11px] font-mono font-bold bg-black/80 backdrop-blur-md text-white px-2.5 py-0.5 rounded-lg border border-white/15 shadow-sm">
              #{String(currentTrack.trackNumber).padStart(2, "0")}
            </span>
          </div>

          {/* Player Info & Balanced Controls */}
          <div className="flex-1 w-full flex flex-col justify-between">
            {/* Title & Artist */}
            <div className="text-center md:text-left">
              <p className="text-[11px] font-mono font-bold text-[#ff3725] uppercase tracking-widest mb-1">
                {isPlaying ? "ĐANG PHÁT" : "HVL 30"}
              </p>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight truncate">
                {currentTrack.title}
              </h1>
              <p className="text-sm text-zinc-400 font-medium mt-0.5">
                {currentTrack.artist}
              </p>
            </div>

            {/* Seekbar */}
            <div className="w-full mt-4">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={(e) => seek(parseFloat(e.target.value))}
                className="w-full accent-[#ff3725] cursor-pointer h-1.5"
              />
              <div className="flex justify-between text-[11px] font-mono text-zinc-400 mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Core Playback Controls (Tactile Spring Physics) */}
            <div className="flex items-center justify-center md:justify-start gap-7 w-full my-3">
              <button
                onClick={prevTrack}
                className="p-2 text-zinc-300 hover:text-white active:scale-90 transition-transform cursor-pointer"
                title="Bài trước"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={togglePlay}
                className="w-13 h-13 rounded-full bg-[#ff3725] hover:bg-[#ff4e3e] active:scale-90 text-white flex items-center justify-center shadow-xl shadow-[#ff3725]/40 transition-all cursor-pointer"
                title={isPlaying ? "Tạm dừng" : "Phát"}
              >
                {isBuffering ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5 fill-white" />
                ) : (
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                )}
              </button>

              <button
                onClick={nextTrack}
                className="p-2 text-zinc-300 hover:text-white active:scale-90 transition-transform cursor-pointer"
                title="Bài tiếp theo"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>
            </div>

            {/* Bottom Controls Bar (Pure Icons Only) */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 w-full border-t border-white/10 pt-3.5 text-xs">
              {/* Volume with Headphone detection */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="text-zinc-400 hover:text-white p-1 transition-colors cursor-pointer active:scale-90"
                  title={isHeadphonesConnected ? "Đang kết nối tai nghe" : "Âm lượng"}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-[#ff3725]" />
                  ) : isHeadphonesConnected ? (
                    <Headphones className="w-4 h-4 text-[#ff3725] animate-pulse" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-20 accent-[#ff3725] cursor-pointer h-1"
                />
              </div>

              {/* Actions, Lyrics & Cinema Mode Trigger Buttons (Pure Icons) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleShuffle}
                  className={`p-2 rounded-xl border transition-all active:scale-90 ${
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
                  className={`p-2 rounded-xl border transition-all active:scale-90 ${
                    repeatMode !== "off"
                      ? "bg-[#ff3725]/20 text-[#ff3725] border-[#ff3725]/40 shadow-sm"
                      : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
                  }`}
                  title={repeatMode === "one" ? "Lặp 1 bài" : repeatMode === "all" ? "Lặp toàn bộ" : "Không lặp"}
                >
                  {repeatMode === "one" ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                </button>

                {/* Lyrics Toggle (Pure Icon) */}
                <button
                  onClick={() => setLyricsOpen(true)}
                  className="p-2 rounded-xl border bg-white/5 hover:bg-[#ff3725]/20 text-zinc-300 hover:text-[#ff3725] border-white/10 hover:border-[#ff3725]/40 transition-all cursor-pointer active:scale-90"
                  title="Lời bài hát"
                >
                  <AppleLyricsIcon className="w-4 h-4" />
                </button>

                {/* Fullscreen Cinema Mode (Pure Icon) */}
                {onOpenCinema && (
                  <button
                    onClick={onOpenCinema}
                    className="p-2 rounded-xl border bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white border-white/10 transition-all cursor-pointer active:scale-90"
                    title="Chế độ Cinema toàn màn hình"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                )}

                {/* Playlist Toggle (Pure Icon) */}
                <button
                  onClick={onTogglePlaylist}
                  className={`p-2 rounded-xl border transition-all active:scale-90 ${
                    playlistVisible
                      ? "bg-[#ff3725]/20 text-[#ff3725] border-[#ff3725]/40 shadow-sm"
                      : "bg-white/5 text-zinc-300 border-white/10 hover:text-white"
                  }`}
                  title={playlistVisible ? "Ẩn danh sách bài hát" : "Hiện danh sách bài hát"}
                >
                  <ListMusic className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}