import React, { useEffect, useMemo, useRef, useState } from "react";
import type { SyncedLyricLine } from "@/data/lyrics/types";
import { LyricLine } from "./LyricLine";

type SyncedLyricsProps = {
  syncedLyrics: SyncedLyricLine[];
  currentTime: number;
  isUserScrolling: boolean;
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

  // Clean vocal lines without bracket section headers
  const vocalLines = useMemo(() => {
    return syncedLyrics.filter((line) => {
      const text = line.text.replace(/^\[.*?\]\s*/g, "").trim();
      return text.length > 0 && !line.text.trim().startsWith("[");
    });
  }, [syncedLyrics]);

  // Binary search for highest accuracy active index
  const activeIndex = useMemo(() => {
    if (!vocalLines.length) return -1;
    let low = 0;
    let high = vocalLines.length - 1;
    let index = -1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (vocalLines[mid].time <= currentTime) {
        index = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return index;
  }, [currentTime, vocalLines]);

  // Smooth centering with RAF lerping
  useEffect(() => {
    if (isUserScrolling || activeIndex < 0) return;
    const targetElement = lineRefs.current[activeIndex];
    const container = containerRef.current;
    if (!targetElement || !container) return;

    const targetRect = targetElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const relativeTop = targetRect.top - containerRect.top + container.scrollTop;
    const desiredScrollTop = relativeTop - (container.clientHeight / 2) + (targetElement.clientHeight / 2);

    container.scrollTo({
      top: Math.max(0, desiredScrollTop),
      behavior: "smooth",
    });
  }, [activeIndex, isUserScrolling]);

  return (
    <div className="synced-lyrics-container supreme-lyrics-scroll" ref={containerRef}>
      <div className="synced-lyrics-list supreme-lyrics-flow" role="feed" aria-label="Lời bài hát đồng bộ">
        {vocalLines.map((line, index) => {
          const isActive = index === activeIndex;
          const isPast = activeIndex >= 0 && index < activeIndex;
          const isUpcoming = activeIndex < 0 || index > activeIndex;
          const distanceFromActive = activeIndex >= 0 ? Math.abs(index - activeIndex) : 999;

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
                distanceFromActive={distanceFromActive}
                onSeek={onSeek}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});