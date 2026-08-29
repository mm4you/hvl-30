"use client";

import React, { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { 
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, 
  Volume2, VolumeX, Headphones, X 
} from "lucide-react";
import { formatTime } from "@/lib/utils";
import type { Track, RepeatMode } from "@/types/music";
import { getLyricsForTrack } from "@/data/lyrics";

interface CinemaModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrack: Track | null;
  isPlaying: boolean;
  isBuffering: boolean;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  currentTime: number;
  duration: number;
  seek: (time: number) => void;
  volume: number;
  setVolume: (val: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
  isHeadphonesConnected: boolean;
  shuffle: boolean;
  toggleShuffle: () => void;
  repeatMode: RepeatMode;
  toggleRepeat: () => void;
}

export function CinemaModal({
  isOpen,
  onClose,
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
}: CinemaModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Array<HTMLDivElement | null>>([]);

  // ESC to exit, Space to toggle playback
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
      } else if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, togglePlay]);

  const trackLyrics = currentTrack ? getLyricsForTrack(currentTrack.id) : null;
  
  // Real vocal lines only
  const syncedLines = useMemo(() => {
    return (trackLyrics?.syncedLyrics || []).filter((line) => {
      const clean = line.text.replace(/^\[.*?\]\s*/g, "").trim();
      return clean.length > 0;
    });
  }, [trackLyrics]);

  // Exact timestamp matching
  const activeIndex = useMemo(() => {
    let index = -1;
    for (let i = 0; i < syncedLines.length; i++) {
      if (syncedLines[i].time <= currentTime) {
        index = i;
      } else {
        break;
      }
    }
    return index;
  }, [currentTime, syncedLines]);

  // Smooth scroll
  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    const targetElement = lineRefs.current[activeIndex];
    const container = containerRef.current;
    if (!targetElement || !container) return;

    const containerHeight = container.clientHeight;
    const targetTop = targetElement.offsetTop;
    const targetHeight = targetElement.clientHeight;
    const desiredScrollTop = targetTop - (containerHeight / 2) + (targetHeight / 2);

    container.scrollTo({
      top: Math.max(0, desiredScrollTop),
      behavior: "smooth",
    });
  }, [activeIndex, isOpen]);

  if (!isOpen || !currentTrack) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#070505] text-[#f4f0eb] flex flex-col justify-between overflow-hidden select-none animate-in fade-in duration-300">
      {/* Dynamic Ambient Background Glow */}
      <div 
        className="absolute inset-0 bg-cover bg-center scale-150 opacity-15 blur-[140px] pointer-events-none transition-all duration-1000"
        style={{ backgroundImage: `url(${currentTrack.artworkUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#070505]/90 via-[#070505]/60 to-[#070505]/95 pointer-events-none" />

      {/* Top Header: Brand & Floating Close Button */}
      <header className="relative z-20 flex items-center justify-between w-full max-w-7xl mx-auto px-6 sm:px-10 pt-6">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff3725] shadow-[0_0_12px_#ff3725]" />
          <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-zinc-400">
            HVL 30 • CINEMA
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-xl transition-all active:scale-95 cursor-pointer shadow-lg"
          title="Thoát chế độ Cinema (ESC)"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main Center Stage: Left Artwork, Right Synced Lyrics */}
      <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center px-6 sm:px-10 my-auto min-h-0 py-4">
        {/* LEFT (5 cols): Large 3:2 Artwork */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="relative w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[480px] aspect-[3/2] rounded-3xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.85)] border border-white/15 bg-zinc-950 group">
            <Image
              src={currentTrack.artworkUrl}
              alt={currentTrack.title}
              fill
              priority
              sizes="(max-width: 1024px) 420px, 480px"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <span className="absolute top-3.5 left-3.5 text-xs font-mono font-extrabold bg-black/80 backdrop-blur-md text-white px-3 py-1 rounded-xl border border-white/20 shadow-md">
              #{String(currentTrack.trackNumber).padStart(2, "0")}
            </span>
          </div>

          <div className="mt-6 w-full max-w-[480px]">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight truncate drop-shadow-md">
              {currentTrack.title}
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 font-semibold mt-1">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* RIGHT (7 cols): Clean Flowing Large Lyrics (No ugly scrollbar) */}
        <div 
          ref={containerRef}
          className="lg:col-span-7 h-[360px] sm:h-[460px] lg:h-[540px] overflow-y-auto space-y-6 py-16 px-4 scroll-smooth text-center lg:text-left no-scrollbar"
          style={{
            maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
          }}
        >
          {syncedLines.length > 0 ? (
            syncedLines.map((line, idx) => {
              const isActive = idx === activeIndex;
              const text = line.text.replace(/^\[.*?\]\s*/g, "").trim();
              if (!text) return null;

              return (
                <div
                  key={idx}
                  ref={(el) => {
                    lineRefs.current[idx] = el;
                  }}
                  onClick={() => seek(line.time)}
                  className={`cursor-pointer transition-all duration-300 ease-out select-none leading-relaxed ${
                    isActive
                      ? "text-2xl sm:text-3xl lg:text-5xl font-black text-white drop-shadow-[0_2px_32px_rgba(255,55,35,0.95)] scale-[1.03] origin-center lg:origin-left"
                      : "text-base sm:text-xl lg:text-2xl font-bold text-white/25 hover:text-white/70 hover:scale-[1.01]"
                  }`}
                >
                  {text}
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500">
              <p className="text-lg font-bold">Bản nhạc không lời hoặc không có lyrics.</p>
            </div>
          )}
        </div>
      </div>

      {/* Unified Bottom Control Deck (Full Width, Perfectly Aligned) */}
      <footer className="relative z-20 w-full bg-[#0d090a]/95 border-t border-white/10 backdrop-blur-3xl px-6 sm:px-10 py-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col gap-3">
          {/* Top of Deck: Continuous Scrub Bar */}
          <div className="w-full">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="w-full accent-[#ff3725] cursor-pointer h-1.5"
            />
            <div className="flex justify-between text-xs font-mono text-zinc-400 font-semibold mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Core Controls Bar */}
          <div className="flex items-center justify-between gap-4">
            {/* Left: Track Info */}
            <div className="flex items-center gap-3 min-w-0 max-w-[240px] sm:max-w-xs">
              <div className="relative w-12 aspect-[3/2] rounded-lg overflow-hidden flex-shrink-0 border border-white/10 bg-zinc-900 shadow-sm">
                <Image src={currentTrack.artworkUrl} alt={currentTrack.title} fill className="object-cover" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-white truncate tracking-tight">{currentTrack.title}</h4>
                <p className="text-xs text-zinc-400 font-semibold truncate">{currentTrack.artist}</p>
              </div>
            </div>

            {/* Center: Playback Buttons */}
            <div className="flex items-center gap-4 sm:gap-6">
              <button
                onClick={toggleShuffle}
                className={`p-2 rounded-xl border transition-all active:scale-90 cursor-pointer hidden sm:block ${
                  shuffle
                    ? "bg-[#ff3725]/20 text-[#ff3725] border-[#ff3725]/40"
                    : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
                }`}
                title="Trộn bài"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={prevTrack}
                className="p-2 text-zinc-300 hover:text-white active:scale-90 transition-transform cursor-pointer"
                title="Bài trước"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-[#ff3725] hover:bg-[#ff4e3e] active:scale-90 text-white flex items-center justify-center shadow-lg shadow-[#ff3725]/50 transition-all cursor-pointer"
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

              <button
                onClick={toggleRepeat}
                className={`p-2 rounded-xl border transition-all active:scale-90 cursor-pointer hidden sm:block ${
                  repeatMode !== "off"
                    ? "bg-[#ff3725]/20 text-[#ff3725] border-[#ff3725]/40"
                    : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
                }`}
                title="Lặp lại"
              >
                {repeatMode === "one" ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
              </button>
            </div>

            {/* Right: Volume & Exit */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <button onClick={toggleMute} className="text-zinc-400 hover:text-white p-1 cursor-pointer transition-colors">
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
                  className="w-20 sm:w-28 accent-[#ff3725] cursor-pointer h-1"
                />
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all active:scale-95 cursor-pointer text-xs font-bold"
                title="Thoát Cinema (ESC)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}