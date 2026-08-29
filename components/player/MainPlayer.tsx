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
  
  // Filter clean real vocal lines
  const syncedLines = useMemo(() => {
    return (trackLyrics?.syncedLyrics || []).filter((line) => {
      const clean = line.text.replace(/^\[.*?\]\s*/g, "").trim();
      return clean.length > 0;
    });
  }, [trackLyrics]);

  // Exact timestamp matching with 0.1s acoustic lead
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
    <section className="relative overflow-hidden rounded-3xl bg-[#110b0c]/95 border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.7)] p-6 sm:p-8 md:p-10 backdrop-blur-3xl transition-all duration-300">
      {/* Dynamic Ambient Red Back-Glow */}
      <div className={`absolute -top-24 -left-24 w-[420px] h-[420px] bg-[#ff3725]/15 rounded-full blur-[150px] pointer-events-none transition-opacity duration-1000 ${isPlaying ? "opacity-100" : "opacity-40"}`} />
      <div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] bg-[#600a06]/20 rounded-full blur-[150px] pointer-events-none" />

      {/* When Lyrics View is Active */}
      {lyricsOpen ? (
        <div className="flex flex-col h-[420px] sm:h-[480px] relative animate-in fade-in duration-200">
          {/* Top Bar of Lyrics View */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-2 flex-shrink-0">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="relative w-14 aspect-[3/2] rounded-xl overflow-hidden flex-shrink-0 border border-white/15 shadow-md">
                <Image src={currentTrack.artworkUrl} alt={currentTrack.title} fill className="object-cover" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-extrabold text-white truncate tracking-tight">{currentTrack.title}</h3>
                <p className="text-xs text-zinc-400 font-semibold truncate">{currentTrack.artist}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onOpenCinema && (
                <button
                  onClick={onOpenCinema}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all active:scale-95 cursor-pointer shadow-sm"
                  title="Chế độ Cinema toàn màn hình (C)"
                >
                  <Maximize2 className="w-4 h-4 text-[#ff3725]" />
                </button>
              )}

              <button
                onClick={() => setLyricsOpen(false)}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all cursor-pointer active:scale-95 shadow-sm"
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
            className="flex-1 overflow-y-auto space-y-5 py-10 px-4 sm:px-8 scroll-smooth text-center"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)",
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
                        ? "text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-[0_2px_28px_rgba(255,55,35,0.95)] scale-[1.03]"
                        : "text-base sm:text-lg md:text-xl font-bold text-white/30 hover:text-white/80 hover:scale-[1.01]"
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
          <div className="flex items-center justify-between border-t border-white/10 pt-3.5 mt-1 flex-shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={prevTrack} className="p-2 text-zinc-400 hover:text-white cursor-pointer active:scale-90 transition-transform">
                <SkipBack className="w-4 h-4 fill-current" />
              </button>
              <button 
                onClick={togglePlay} 
                className="w-11 h-11 rounded-full bg-[#ff3725] hover:bg-[#ff4e3e] text-white flex items-center justify-center shadow-lg shadow-[#ff3725]/40 cursor-pointer active:scale-95 transition-all"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
              </button>
              <button onClick={nextTrack} className="p-2 text-zinc-400 hover:text-white cursor-pointer active:scale-90 transition-transform">
                <SkipForward className="w-4 h-4 fill-current" />
              </button>
            </div>

            <div className="text-xs font-mono text-zinc-400 font-semibold">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>
      ) : (
        /* Perfectly Balanced 2-Column Grid (Artwork 5 : Controls 7) */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Left Column (5 cols): 3:2 Landscape Artwork */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[360px] sm:max-w-[400px] md:max-w-none aspect-[3/2] rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-zinc-950 group">
              <Image
                src={currentTrack.artworkUrl}
                alt={currentTrack.title}
                fill
                priority
                sizes="(max-width: 768px) 380px, 460px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              
              {/* Clean Number Badge */}
              <span className="absolute top-3 left-3 text-xs font-mono font-extrabold bg-black/80 backdrop-blur-md text-white px-2.5 py-1 rounded-xl border border-white/15 shadow-md">
                #{String(currentTrack.trackNumber).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Right Column (7 cols): Symmetrically Balanced Controls */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-6">
            {/* Title & Artist */}
            <div className="text-center md:text-left space-y-1">
              <p className="text-xs font-mono font-extrabold text-[#ff3725] uppercase tracking-widest">
                {isPlaying ? "ĐANG PHÁT" : "HVL 30"}
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight truncate leading-tight">
                {currentTrack.title}
              </h1>
              <p className="text-sm sm:text-base text-zinc-400 font-semibold">
                {currentTrack.artist}
              </p>
            </div>

            {/* Seekbar */}
            <div className="w-full space-y-1.5">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={(e) => seek(parseFloat(e.target.value))}
                className="w-full accent-[#ff3725] cursor-pointer h-1.5"
              />
              <div className="flex justify-between text-xs font-mono text-zinc-400 font-semibold">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Core Playback Control Buttons */}
            <div className="flex items-center justify-center md:justify-start gap-5 sm:gap-7 w-full py-1">
              <button
                onClick={toggleShuffle}
                className={`p-2.5 rounded-xl border transition-all active:scale-90 cursor-pointer ${
                  shuffle
                    ? "bg-[#ff3725]/20 text-[#ff3725] border-[#ff3725]/40 shadow-sm"
                    : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
                }`}
                title={shuffle ? "Trộn bài: Đã bật" : "Trộn bài: Đã tắt"}
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={prevTrack}
                className="p-2.5 text-zinc-300 hover:text-white active:scale-90 transition-transform cursor-pointer"
                title="Bài trước"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-[#ff3725] hover:bg-[#ff4e3e] active:scale-90 text-white flex items-center justify-center shadow-xl shadow-[#ff3725]/50 transition-all cursor-pointer"
                title={isPlaying ? "Tạm dừng" : "Phát"}
              >
                {isBuffering ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-6 h-6 fill-white" />
                ) : (
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                )}
              </button>

              <button
                onClick={nextTrack}
                className="p-2.5 text-zinc-300 hover:text-white active:scale-90 transition-transform cursor-pointer"
                title="Bài tiếp theo"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={toggleRepeat}
                className={`p-2.5 rounded-xl border transition-all active:scale-90 cursor-pointer ${
                  repeatMode !== "off"
                    ? "bg-[#ff3725]/20 text-[#ff3725] border-[#ff3725]/40 shadow-sm"
                    : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
                }`}
                title={repeatMode === "one" ? "Lặp 1 bài" : repeatMode === "all" ? "Lặp toàn bộ" : "Không lặp"}
              >
                {repeatMode === "one" ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
              </button>
            </div>

            {/* Bottom Sub-Controls: Volume & Utility Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 w-full border-t border-white/10 pt-4">
              {/* Volume Slider */}
              <div className="flex items-center gap-2.5">
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
                  className="w-24 sm:w-28 accent-[#ff3725] cursor-pointer h-1"
                />
              </div>

              {/* Lyrics, Cinema & Playlist Toggle Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLyricsOpen(true)}
                  className="p-2.5 rounded-xl border bg-white/5 hover:bg-[#ff3725]/20 text-zinc-300 hover:text-[#ff3725] border-white/10 hover:border-[#ff3725]/40 transition-all cursor-pointer active:scale-90 shadow-sm"
                  title="Lời bài hát (L)"
                >
                  <AppleLyricsIcon className="w-4 h-4" />
                </button>

                {onOpenCinema && (
                  <button
                    onClick={onOpenCinema}
                    className="p-2.5 rounded-xl border bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white border-white/10 transition-all cursor-pointer active:scale-90 shadow-sm"
                    title="Chế độ Cinema toàn màn hình (C)"
                  >
                    <Maximize2 className="w-4 h-4 text-[#ff3725]" />
                  </button>
                )}

                <button
                  onClick={onTogglePlaylist}
                  className={`p-2.5 rounded-xl border transition-all active:scale-90 cursor-pointer shadow-sm ${
                    playlistVisible
                      ? "bg-[#ff3725]/20 text-[#ff3725] border-[#ff3725]/40"
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