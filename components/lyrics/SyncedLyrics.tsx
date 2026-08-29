import React, { useEffect, useMemo, useRef } from "react";
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

  // Filter out any [Intro], [Chorus], [Verse] section headers
  const vocalLines = useMemo(() => {
    return syncedLyrics.filter((line) => {
      const text = line.text.replace(/^\[.*?\]\s*/g, "").trim();
      return text.length > 0 && !line.text.trim().startsWith("[");
    });
  }, [syncedLyrics]);

  // Calculate active index based on vocal lines only
  const activeIndex = useMemo(() => {
    let index = -1;
    for (let i = 0; i < vocalLines.length; i++) {
      if (vocalLines[i].time <= currentTime) {
        index = i;
      } else {
        break;
      }
    }
    return index;
  }, [currentTime, vocalLines]);

  // Smooth auto-scroll when active line changes and user is not manually scrolling
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
    <div className="synced-lyrics-container" ref={containerRef}>
      <div className="synced-lyrics-list" role="feed" aria-label="Lời bài hát đồng bộ">
        {vocalLines.map((line, index) => {
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
                onSeek={onSeek}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});