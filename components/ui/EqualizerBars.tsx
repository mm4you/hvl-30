"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function EqualizerBars({ isPlaying, className }: { isPlaying: boolean; className?: string }) {
  return (
    <div className={cn("flex items-end gap-[2px] h-4 w-4", className)}>
      <span className={cn("w-[2px] bg-rose-500 rounded-full", isPlaying ? "eq-bar-1" : "h-1")} />
      <span className={cn("w-[2px] bg-rose-500 rounded-full", isPlaying ? "eq-bar-2" : "h-3")} />
      <span className={cn("w-[2px] bg-rose-500 rounded-full", isPlaying ? "eq-bar-3" : "h-2")} />
      <span className={cn("w-[2px] bg-rose-500 rounded-full", isPlaying ? "eq-bar-4" : "h-1")} />
    </div>
  );
}
