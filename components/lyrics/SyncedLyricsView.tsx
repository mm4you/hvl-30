"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { usePlayer } from "@/context/PlayerContext";
import { getLyricsForTrack } from "@/data/lyrics";
import { Mic2, Music, Sparkles, FileText, Check } from "lucide-react";
import { formatTime } from "@/lib/utils";

export function SyncedLyricsView() {
  const { currentTrack, currentTime, seek } = usePlayer();
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [viewMode, setViewMode] = useState<"synced" | "plain">("synced");

  const trackLyrics = useMemo(() => {
    return currentTrack ? getLyricsForTrack(currentTrack.id) : null;
  }, [currentTrack]);

  const syncedLines = trackLyrics?.syncedLyrics || [];
  const plainLines = trackLyrics?.lyrics || [];

  // Find active line index in synced lines
  let activeIndex = -1;
  for (let i = 0; i < syncedLines.length; i++) {
    const currentL = syncedLines[i];
    const nextL = syncedLines[i + 1];
    if (currentTime >= currentL.time && (!nextL || currentTime < nextL.time)) {
      activeIndex = i;
      break;
    }
  }

  // Auto-scroll effect
  useEffect(() => {
    if (autoScroll && activeLineRef.current && containerRef.current && viewMode === "synced") {
      activeLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeIndex, autoScroll, viewMode]);

  if (!currentTrack) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
        <Music className="w-12 h-12 mb-3 text-rose-500/40" />
        <p>Chọn một bài hát để xem lời</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-3xl bg-gradient-to-b from-zinc-900/80 via-zinc-950/90 to-black border border-white/10 p-6 md:p-10 shadow-2xl backdrop-blur-2xl overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/3 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between pb-6 border-b border-white/10 gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg border border-white/15 bg-zinc-900 flex-shrink-0">
            <Image
              src={currentTrack.artworkUrl}
              alt={currentTrack.title}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                <Mic2 className="w-3 h-3" /> KARAOKE LYRICS
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                #{String(currentTrack.trackNumber).padStart(2, "0")} / 30
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
              {currentTrack.title}
            </h2>
            <p className="text-sm font-semibold text-rose-400">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* View Mode & AutoScroll Switch */}
        <div className="flex items-center gap-2">
          {syncedLines.length > 0 && (
            <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setViewMode("synced")}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  viewMode === "synced"
                    ? "bg-rose-600 text-white shadow-md font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Đồng bộ
              </button>
              <button
                onClick={() => setViewMode("plain")}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  viewMode === "plain"
                    ? "bg-rose-600 text-white shadow-md font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Toàn văn
              </button>
            </div>
          )}

          {viewMode === "synced" && syncedLines.length > 0 && (
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                autoScroll
                  ? "bg-rose-600/20 text-rose-300 border border-rose-500/30"
                  : "bg-white/5 text-zinc-400 border border-white/10 hover:text-white"
              }`}
            >
              {autoScroll ? "Tự cuộn: Bật" : "Tự cuộn: Tắt"}
            </button>
          )}
        </div>
      </div>

      {/* Lyrics Content Container */}
      <div
        ref={containerRef}
        className="relative z-10 h-[480px] md:h-[560px] overflow-y-auto px-2 md:px-6 py-8 space-y-4 scroll-smooth"
      >
        {viewMode === "synced" && syncedLines.length > 0 ? (
          syncedLines.map((line, idx) => {
            const isActive = idx === activeIndex;
            const isPassed = activeIndex !== -1 && idx < activeIndex;

            return (
              <div
                key={idx}
                ref={isActive ? activeLineRef : null}
                onClick={() => seek(line.time)}
                className={`group flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 ${
                  isActive
                    ? "bg-rose-950/40 border border-rose-500/40 shadow-xl shadow-rose-950/40 scale-[1.02]"
                    : "hover:bg-white/5 opacity-70 hover:opacity-100"
                }`}
              >
                {/* Timestamp pill */}
                <span
                  className={`text-xs font-mono px-2 py-0.5 rounded-md flex-shrink-0 transition-opacity ${
                    isActive
                      ? "text-rose-300 bg-rose-900/70 font-bold"
                      : "text-zinc-500 group-hover:text-zinc-300 bg-white/5 opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {formatTime(line.time)}
                </span>

                {/* Lyric text */}
                <p
                  className={`text-lg md:text-2xl font-bold tracking-tight transition-all duration-300 ${
                    isActive
                      ? "text-rose-400 font-extrabold"
                      : isPassed
                      ? "text-zinc-500"
                      : "text-zinc-300 group-hover:text-white"
                  }`}
                >
                  {line.text}
                </p>
              </div>
            );
          })
        ) : plainLines.length > 0 ? (
          <div className="space-y-2 py-4">
            {plainLines.map((line, idx) => (
              <p key={idx} className="text-base md:text-lg text-zinc-300 font-medium leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-2">
            <Sparkles className="w-10 h-10 text-rose-500/40" />
            <p className="text-base font-semibold text-zinc-300">
              Bản intro / nhạc dạo không lời
            </p>
            <p className="text-xs text-zinc-500">
              Giai điệu mở màn tuyệt vời của album HVL.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
