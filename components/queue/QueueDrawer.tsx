"use client";

import React from "react";
import Image from "next/image";
import { usePlayer } from "@/context/PlayerContext";
import { X, Play, Trash2, ListMusic } from "lucide-react";
import { EqualizerBars } from "@/components/ui/EqualizerBars";

export function QueueDrawer() {
  const {
    isQueueOpen,
    setIsQueueOpen,
    queue,
    queueIndex,
    currentTrack,
    playTrack,
    removeFromQueue,
    clearQueue,
    isPlaying,
  } = usePlayer();

  if (!isQueueOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm glass-dropdown border-l border-white/10 shadow-2xl p-5 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <ListMusic className="w-5 h-5 text-rose-400" />
          <h3 className="font-bold text-base text-white">
            Danh sách phát tiếp theo
          </h3>
          <span className="text-xs text-zinc-400">
            ({queue.length})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {queue.length > 1 && (
            <button
              onClick={clearQueue}
              className="text-xs text-zinc-400 hover:text-rose-400 px-2 py-1 rounded hover:bg-white/5 transition-colors"
            >
              Xóa danh sách
            </button>
          )}
          <button
            onClick={() => setIsQueueOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Queue items */}
      <div className="flex-1 overflow-y-auto py-3 space-y-1">
        {queue.map((track, idx) => {
          const isCurrent = currentTrack?.id === track.id;

          return (
            <div
              key={`${track.id}-${idx}`}
              onClick={() => playTrack(track)}
              className={`group flex items-center justify-between p-2 rounded-xl transition-colors cursor-pointer ${
                isCurrent
                  ? "bg-rose-950/50 border border-rose-500/30 text-white"
                  : "hover:bg-white/5 text-zinc-300"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-white/10 bg-zinc-900">
                  <Image
                    src={track.artworkUrl}
                    alt={track.title}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                  {isCurrent && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <EqualizerBars isPlaying={isPlaying} />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className={`text-xs font-semibold truncate ${isCurrent ? "text-rose-400" : "text-white"}`}>
                    {track.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 truncate">
                    {track.artist}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!isCurrent && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromQueue(idx);
                    }}
                    className="p-1.5 text-zinc-500 hover:text-rose-400"
                    title="Xóa khỏi hàng đợi"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
