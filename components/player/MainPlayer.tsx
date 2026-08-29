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
  
  // Clean real vocal lines
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
    if (!lyricsOpen || userScrolling || activeIndex < 0) return;
    const targetElement = activeLineRef.current;
    const container = lyricsScrollRef.current;
    if (!targetElement || !container) return;

    const containerHeight = container.clientHeight;
    const targetTop = targetElement.offsetTop;
    const targetHeight = targetElement.clientHeight;
    const desiredScrollTop = targetTop - (containerHeight / 2) + (targetHeight / 2);

    container.scrollTo({
      top: Math.max(0, desiredScrollTop),
      behavior: "smooth",
    });
  }, [activeIndex, lyricsOpen, userScrolling]);

  const handleUserScroll = useCallback(() => {
    setUserScrolling(true);
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      setUserScrolling(false);
    }, 2500);
  }, []);

  if (!currentTrack) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#0e0c0d] border border-white/[0.08] shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
      {lyricsOpen ? (
        /* Lyrics Mode inside Player */
        <div className="flex flex-col h-[400px] sm:h-[440px] relative animate-in fade-in duration-200">
          {/* Header of lyrics view */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-2 flex-shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-12 aspect-[3/2] rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                <Image src={currentTrack.artworkUrl} alt={currentTrack.title} fill className="object-cover" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white truncate">{currentTrack.title}</h3>
                <p className="text-xs text-zinc-400 truncate">{currentTrack.artist}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onOpenCinema && (
                <button
                  onClick={onOpenCinema}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
                  title="Toàn màn hình Cinema"
                >
                  <Maximize2 className="w-4 h-4 text-[#ff3725]" />
                </button>
              )}
              <button
                onClick={() => setLyricsOpen(false)}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
                title="Đóng lời bài hát"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrolling lyrics */}
          <div
            ref={lyricsScrollRef}
            onWheel={handleUserScroll}
            onTouchMove={handleUserScroll}
            className="flex-1 overflow-y-auto space-y-4 py-8 px-4 scroll-smooth text-center no-scrollbar"
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
                    ref={isActive ? activeLineRef : null}
                    onClick={() => {
                      seek(line.time);
                      setUserScrolling(false);
                    }}
                    className={`cursor-pointer transition-all duration-300 select-none leading-relaxed ${
                      isActive
                        ? "text-xl sm:text-2xl md:text-3xl font-extrabold text-white scale-[1.02] drop-shadow-[0_2px_20px_rgba(255,55,35,0.8)]"
                        : "text-sm sm:text-base font-semibold text-white/30 hover:text-white/70"
                    }`}
                  >
                    {text}
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-zinc-500 text-sm">
                <p>Không có lời cho bài hát này.</p>
              </div>
            )}
          </div>

          {/* Mini bottom scrubber in lyrics */}
          <div className="flex items-center justify-between border-t border-white/[0.08] pt-3 mt-1 text-xs">
            <div className="flex items-center gap-2">
              <button onClick={prevTrack} className="p-1.5 text-zinc-400 hover:text-white"><SkipBack className="w-4 h-4" /></button>
              <button onClick={togglePlay} className="w-8 h-8 rounded-full bg-[#ff3725] text-white flex items-center justify-center shadow-md">
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              </button>
              <button onClick={nextTrack} className="p-1.5 text-zinc-400 hover:text-white"><SkipForward className="w-4 h-4" /></button>
            </div>
            <div className="font-mono text-zinc-400 text-[11px]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>
      ) : (
        /* Standard Elegant Studio Deck */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Artwork on Left (5 cols) */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] md:max-w-none aspect-[3/2] rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-zinc-950">
              <Image
                src={currentTrack.artworkUrl}
                alt={currentTrack.title}
                fill
                priority
                sizes="(max-width: 768px) 340px, 420px"
                className="object-cover"
              />
              <span className="absolute top-2.5 left-2.5 text-[11px] font-mono font-bold bg-black/80 backdrop-blur-md text-white px-2 py-0.5 rounded-md border border-white/10">
                #{String(currentTrack.trackNumber).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Controls on Right (7 cols) */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-5">
            {/* Title & Artist */}
            <div>
              <span className="text-[10px] font-mono font-bold text-[#ff3725] uppercase tracking-wider block mb-1">
                {isPlaying ? "ĐANG PHÁT" : "HVL 30"}
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight truncate">
                {currentTrack.title}
              </h1>
              <p className="text-sm text-zinc-400 font-medium mt-0.5">
                {currentTrack.artist}
              </p>
            </div>

            {/* Scrub bar */}
            <div className="space-y-1">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={(e) => seek(parseFloat(e.target.value))}
                className="w-full accent-[#ff3725] cursor-pointer h-1.5"
              />
              <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Central Controls */}
            <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-6 pt-1">
              <button
                onClick={toggleShuffle}
                className={`p-2 rounded-lg border transition-colors ${
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
                className="p-2 text-zinc-300 hover:text-white transition-colors"
                title="Bài trước"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-[#ff3725] hover:bg-[#ff4e3e] text-white flex items-center justify-center shadow-lg shadow-[#ff3725]/40 transition-all active:scale-95 cursor-pointer"
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
                className="p-2 text-zinc-300 hover:text-white transition-colors"
                title="Bài tiếp theo"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>

              <button
                onClick={toggleRepeat}
                className={`p-2 rounded-lg border transition-colors ${
                  repeatMode !== "off"
                    ? "bg-[#ff3725]/20 text-[#ff3725] border-[#ff3725]/40"
                    : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
                }`}
                title="Lặp lại"
              >
                {repeatMode === "one" ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
              </button>
            </div>

            {/* Bottom Utilities */}
            <div className="flex items-center justify-between border-t border-white/[0.08] pt-3.5 text-xs">
              {/* Volume */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="text-zinc-400 hover:text-white p-1"
                  title={isHeadphonesConnected ? "Tai nghe đang kết nối" : "Âm lượng"}
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
                  className="w-20 sm:w-24 accent-[#ff3725] cursor-pointer h-1"
                />
              </div>

              {/* Lyrics & Cinema & Playlist buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLyricsOpen(true)}
                  className="p-2 rounded-lg border bg-white/5 hover:bg-[#ff3725]/20 text-zinc-300 hover:text-[#ff3725] border-white/10 hover:border-[#ff3725]/40 transition-colors"
                  title="Lời bài hát"
                >
                  <AppleLyricsIcon className="w-4 h-4" />
                </button>

                {onOpenCinema && (
                  <button
                    onClick={onOpenCinema}
                    className="p-2 rounded-lg border bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white border-white/10 transition-colors"
                    title="Chế độ Cinema"
                  >
                    <Maximize2 className="w-4 h-4 text-[#ff3725]" />
                  </button>
                )}

                <button
                  onClick={onTogglePlaylist}
                  className={`p-2 rounded-lg border transition-colors ${
                    playlistVisible
                      ? "bg-[#ff3725]/20 text-[#ff3725] border-[#ff3725]/40"
                      : "bg-white/5 text-zinc-300 border-white/10 hover:text-white"
                  }`}
                  title={playlistVisible ? "Ẩn danh sách" : "Hiện danh sách"}
                >
                  <ListMusic className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}