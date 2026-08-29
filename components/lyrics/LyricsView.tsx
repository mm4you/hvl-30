"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { TrackLyrics } from "@/data/lyrics/types";
import { SyncedLyrics } from "./SyncedLyrics";
import { StaticLyrics } from "./StaticLyrics";
import { X } from "lucide-react";

type LyricsViewProps = {
  trackLyrics: TrackLyrics | null;
  trackTitle?: string;
  trackArtist?: string;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onSeek: (time: number) => void;
  onClose?: () => void;
  isCompact?: boolean;
};

export const LyricsView = React.memo(function LyricsView({
  trackLyrics,
  trackTitle,
  currentTime,
  onSeek,
  onClose,
}: LyricsViewProps) {
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleUserInteraction = useCallback(() => {
    setIsUserScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
      scrollTimeoutRef.current = null;
    }, 3000);
  }, []);

  useEffect(() => {
    setIsUserScrolling(false);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }
  }, [trackLyrics?.trackId]);

  const hasSynced = Boolean(trackLyrics?.syncedLyrics && trackLyrics.syncedLyrics.length > 0);
  const hasStatic = Boolean(trackLyrics?.lyrics && trackLyrics.lyrics.length > 0);

  return (
    <section
      aria-label="Lời bài hát"
      className="relative w-full h-full flex flex-col bg-[#0a0707]/95 overflow-hidden select-none"
      onWheel={handleUserInteraction}
      onTouchMove={handleUserInteraction}
      onPointerDown={handleUserInteraction}
    >
      {/* Sleek Floating Close Button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/15 backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-md"
          aria-label="Đóng lời bài hát"
        >
          <X className="w-3.5 h-3.5" />
          <span>Đóng</span>
        </button>
      )}

      {/* Main Lyrics Scroll View */}
      <div className="relative flex-1 w-full h-full min-h-0 overflow-hidden">
        {hasSynced && trackLyrics?.syncedLyrics ? (
          <SyncedLyrics
            syncedLyrics={trackLyrics.syncedLyrics}
            currentTime={currentTime}
            isUserScrolling={isUserScrolling}
            onSeek={onSeek}
          />
        ) : hasStatic && trackLyrics?.lyrics ? (
          <StaticLyrics lyrics={trackLyrics.lyrics} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500 p-6">
            <p className="text-sm font-semibold">Bản nhạc không lời hoặc không có lyrics.</p>
          </div>
        )}
      </div>
    </section>
  );
});