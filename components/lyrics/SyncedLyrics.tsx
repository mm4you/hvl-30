import React, { useEffect, useMemo, useRef, useCallback } from "react";
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
  const animFrameRef = useRef<number | null>(null);

  // Exact timestamp matching: find active line index
  const activeIndex = useMemo(() => {
    let index = -1;
    for (let i = 0; i < syncedLyrics.length; i++) {
      if (currentTime >= syncedLyrics[i].time) {
        index = i;
      } else {
        break;
      }
    }
    return index;
  }, [currentTime, syncedLyrics]);

  // Smooth cubic-bezier scroll easing
  const smoothScrollTo = useCallback((targetTop: number) => {
    const container = containerRef.current;
    if (!container) return;

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const start = container.scrollTop;
    const change = targetTop - start;
    const duration = 280;
    const startTime = performance.now();

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      container.scrollTop = start + change * easeOutCubic(progress);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        animFrameRef.current = null;
      }
    };

    animFrameRef.current = requestAnimationFrame(step);
  }, []);

  // Smoothly center the active line
  useEffect(() => {
    if (isUserScrolling || activeIndex < 0) return;
    const el = lineRefs.current[activeIndex];
    const container = containerRef.current;
    if (!el || !container) return;

    const desiredTop = el.offsetTop - container.clientHeight * 0.45 + el.clientHeight / 2;
    smoothScrollTo(Math.max(0, desiredTop));

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeIndex, isUserScrolling, smoothScrollTo]);

  const handleSeek = useCallback(
    (time: number, index: number) => {
      onSeek(time);
      const el = lineRefs.current[index];
      const container = containerRef.current;
      if (el && container) {
        const desiredTop = el.offsetTop - container.clientHeight * 0.45 + el.clientHeight / 2;
        smoothScrollTo(Math.max(0, desiredTop));
      }
    },
    [onSeek, smoothScrollTo]
  );

  return (
    <div 
      className="synced-lyrics-container" 
      ref={containerRef}
      style={{
        maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
      }}
    >
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
                onSeek={() => handleSeek(line.time, index)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});