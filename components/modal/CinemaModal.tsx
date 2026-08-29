"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { 
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, 
  Volume2, VolumeX, Headphones, Minimize2 
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
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Keyboard shortcut: ESC to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const trackLyrics = currentTrack ? getLyricsForTrack(currentTrack.id) : null;
  const syncedLines = trackLyrics?.syncedLyrics || [];

  // Match active lyric
  let activeLyricIdx = -1;
  for (let i = 0; i < syncedLines.length; i++) {
    if (currentTime >= syncedLines[i].time) {
      activeLyricIdx = i;
    } else {
      break;
    }
  }

  // Smooth centering
  useEffect(() => {
    if (isOpen && activeLineRef.current && scrollContainerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeLyricIdx, isOpen]);

  if (!isOpen || !currentTrack) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#060404]/98 flex flex-col justify-between p-6 sm:p-10 md:p-14 overflow-hidden backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-300">
      {/* Massive Ambient Background Glow */}
      <div className="absolute -top-1/4 -left-1/4 w-[80vw] h-[80vw] bg-[#ff3725]/12 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-1/4 -right-1/4 w-[80vw] h-[80vw] bg-[#600a06]/15 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Bar: Minimalist Info & Exit */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff3725] animate-ping" />
          <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-zinc-400">
            CINEMA STUDIO MODE • HVL 30 LOSSLESS
          </span>
        </div>

        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all active:scale-95 cursor-pointer text-xs font-bold"
          title="Thoát chế độ toàn màn hình (ESC)"
        >
          <Minimize2 className="w-4 h-4" />
          <span>Thoát Cinema</span>
        </button>
      </div>

      {/* Center Stage: Split Screen (Artwork on Left, Floating Lyrics on Right) */}
      <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center my-4 min-h-0">
        {/* LEFT: 3:2 Floating Artwork & Track Info */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="relative w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[480px] aspect-[3/2] rounded-3xl overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.8)] border border-white/15 bg-zinc-950 group">
            <Image
              src={currentTrack.artworkUrl}
              alt={currentTrack.title}
              fill
              priority
              sizes="(max-width: 1024px) 420px, 480px"
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <span className="absolute top-3.5 left-3.5 text-xs font-mono font-black bg-black/80 backdrop-blur-md text-white px-3 py-1 rounded-xl border border-white/20">
              #{String(currentTrack.trackNumber).padStart(2, "0")} • FLAC 24-bit
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

        {/* RIGHT: Flowing Large Karaoke Typography */}
        <div 
          ref={scrollContainerRef}
          className="lg:col-span-7 h-[340px] sm:h-[420px] lg:h-[520px] overflow-y-auto space-y-6 py-12 px-4 scroll-smooth text-center lg:text-left"
          style={{
            maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
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
                  onClick={() => seek(line.time)}
                  className={`cursor-pointer transition-all duration-300 ease-out select-none leading-relaxed ${
                    isActive
                      ? "text-2xl sm:text-3xl lg:text-5xl font-black text-white drop-shadow-[0_4px_30px_rgba(255,55,35,0.9)] scale-[1.03] origin-center lg:origin-left"
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

      {/* Bottom Floating Control Bar */}
      <div className="relative z-10 w-full max-w-4xl mx-auto rounded-2xl bg-black/60 border border-white/10 backdrop-blur-2xl p-4 sm:p-5 shadow-2xl">
        {/* Scrub bar */}
        <div className="w-full mb-3">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={(e) => seek(parseFloat(e.target.value))}
            className="w-full accent-[#ff3725] cursor-pointer h-1.5"
          />
          <div className="flex justify-between text-xs font-mono text-zinc-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Buttons Bar */}
        <div className="flex items-center justify-between gap-4">
          {/* Left: Volume with Headphone detection */}
          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="text-zinc-400 hover:text-white p-1 cursor-pointer transition-colors">
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
              className="w-20 sm:w-28 accent-[#ff3725] cursor-pointer h-1"
            />
          </div>

          {/* Center: Controls */}
          <div className="flex items-center gap-6">
            <button onClick={prevTrack} className="p-2 text-zinc-300 hover:text-white active:scale-90 transition-transform cursor-pointer">
              <SkipBack className="w-6 h-6 fill-current" />
            </button>
            <button
              onClick={togglePlay}
              className="w-13 h-13 rounded-full bg-[#ff3725] hover:bg-[#ff4e3e] active:scale-90 text-white flex items-center justify-center shadow-lg shadow-[#ff3725]/50 transition-all cursor-pointer"
            >
              {isBuffering ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-6 h-6 fill-white" />
              ) : (
                <Play className="w-6 h-6 fill-white ml-0.5" />
              )}
            </button>
            <button onClick={nextTrack} className="p-2 text-zinc-300 hover:text-white active:scale-90 transition-transform cursor-pointer">
              <SkipForward className="w-6 h-6 fill-current" />
            </button>
          </div>

          {/* Right: Shuffle & Repeat */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleShuffle}
              className={`p-2 rounded-xl border transition-all ${
                shuffle
                  ? "bg-[#ff3725]/20 text-[#ff3725] border-[#ff3725]/40"
                  : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
              }`}
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button
              onClick={toggleRepeat}
              className={`p-2 rounded-xl border transition-all ${
                repeatMode !== "off"
                  ? "bg-[#ff3725]/20 text-[#ff3725] border-[#ff3725]/40"
                  : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
              }`}
            >
              {repeatMode === "one" ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}