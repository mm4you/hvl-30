import React from "react";
import type { SyncedLyricLine } from "@/data/lyrics/types";

type LyricLineProps = {
  line: SyncedLyricLine;
  index: number;
  isActive: boolean;
  isPast: boolean;
  isUpcoming: boolean;
  distanceFromActive: number;
  onSeek: (time: number) => void;
};

export const LyricLine = React.memo(function LyricLine({
  line,
  isActive,
  isPast,
  isUpcoming,
  distanceFromActive,
  onSeek,
}: LyricLineProps) {
  const text = line.text.replace(/^\[.*?\]\s*/g, "").trim();
  const isSectionHeader = line.text.trim().startsWith("[");
  const isEmpty = text === "";

  if (isEmpty || isSectionHeader) {
    return null;
  }

  // Apple Music style visual depth based on distance from active line
  let depthClass = "depth-far";
  if (isActive) depthClass = "depth-active";
  else if (distanceFromActive === 1) depthClass = "depth-adjacent";
  else if (distanceFromActive === 2) depthClass = "depth-near";

  return (
    <button
      type="button"
      className={`supreme-lyric-line ${isActive ? "active" : ""} ${isPast ? "past" : ""} ${isUpcoming ? "upcoming" : ""} ${depthClass}`}
      onClick={() => onSeek(line.time)}
      aria-label={`Tua đến: ${text}`}
      aria-current={isActive ? "true" : undefined}
    >
      <span className="lyric-text">{text}</span>
    </button>
  );
});