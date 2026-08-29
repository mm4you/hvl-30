import React from "react";
import type { SyncedLyricLine } from "@/data/lyrics/types";

type LyricLineProps = {
  line: SyncedLyricLine;
  index: number;
  isActive: boolean;
  isPast: boolean;
  isUpcoming: boolean;
  onSeek: (time: number) => void;
};

export const LyricLine = React.memo(function LyricLine({
  line,
  isActive,
  isPast,
  isUpcoming,
  onSeek,
}: LyricLineProps) {
  const text = line.text.replace(/^\[.*?\]\s*/g, "").trim();
  const isSectionHeader = line.text.trim().startsWith("[");
  const isEmpty = text === "";

  // Never display [Intro], [Chorus], [Verse], or empty tags
  if (isEmpty || isSectionHeader) {
    return null;
  }

  return (
    <button
      type="button"
      className={`lyric-line ${isActive ? "active" : ""} ${isPast ? "past" : ""} ${isUpcoming ? "upcoming" : ""}`}
      onClick={() => onSeek(line.time)}
      aria-label={`Tua đến ${text}`}
      aria-current={isActive ? "true" : undefined}
    >
      <span className="lyric-line-text">{text}</span>
    </button>
  );
});