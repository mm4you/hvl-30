import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { SyncedLyricLine } from "@/data/lyrics/types";
import { LyricLine } from "./LyricLine";

type SyncedLyricsProps = {
  syncedLyrics: SyncedLyricLine[];
  currentTime: number;
  duration?: number;
  isPlaying?: boolean;
  isUserScrolling: boolean;
  mediaElement?: HTMLAudioElement | null;
  onSeek: (time: number) => void;
};

export const SyncedLyrics = React.memo(function SyncedLyrics({
  syncedLyrics,
  currentTime,
  isUserScrolling,
  onSeek,
}: SyncedLyricsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Array<HTMLElement | null>>([]);
  const isSeekingRef = useRef(false);

  // Binary search for highest accuracy and performance
  const activeIndex = useMemo(() => {
    if (!syncedLyrics.length) return -1;
    let low = 0;
    let high = syncedLyrics.length - 1;
    let index = -1;

    while (low <= high) {
      const mid = (low + high) >> 1;
      if (syncedLyrics[mid].time <= currentTime) {
        index = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return index;
  }, [currentTime, syncedLyrics]);

  // Butter-smooth RAF auto-scroll
  useEffect(() => {
    if (isUserScrolling || activeIndex < 0 || isSeekingRef.current) return;
    const targetElement = lineRefs.current[activeIndex];
    const container = containerRef.current;
    if (!targetElement || !container) return;

    const frame = requestAnimationFrame(() => {
      const targetRect = targetElement.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const relativeTop = targetRect.top - containerRect.top + container.scrollTop;
      const desiredScrollTop = relativeTop - (container.clientHeight * 0.42) + (targetElement.clientHeight / 2);

      container.scrollTo({
        top: Math.max(0, desiredScrollTop),
        behavior: "smooth",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [activeIndex, isUserScrolling]);

  const handleLineSeek = useCallback(
    (time: number, targetIndex: number) => {
      const targetElement = lineRefs.current[targetIndex];
      const container = containerRef.current;
      if (targetElement && container) {
        const targetRect = targetElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const relativeTop = targetRect.top - containerRect.top + container.scrollTop;
        const desiredScrollTop = relativeTop - (container.clientHeight * 0.42) + (targetElement.clientHeight / 2);
        container.scrollTo({
          top: Math.max(0, desiredScrollTop),
          behavior: "smooth",
        });
      }
      onSeek(time);
    },
    [onSeek]
  );

  return (
    <div className="synced-lyrics-container ultra-smooth-lyrics" ref={containerRef}>
      <div className="synced-lyrics-list" role="feed" aria-label="Lời bài hát đồng bộ">
        {syncedLyrics.map((line, index) => {
          const isActive = index === activeIndex;
          const isPast = activeIndex >= 0 && index < activeIndex;
          const isUpcoming = activeIndex < 0 || index > activeIndex;

          return (
            <div
              key={`${index}-${line.time}`}
              ref={(el) => {
                lineRefs.current[index] = el;
              }}
              className="lyric-line-wrapper"
            >
              <LyricLine
                line={line}
                index={index}
                isActive={isActive}
                isPast={isPast}
                isUpcoming={isUpcoming}
                onSeek={handleLineSeek}
                progress={isActive ? 100 : 0}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});