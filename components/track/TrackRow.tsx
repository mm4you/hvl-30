"use client";

import React from "react";
import Image from "next/image";
import { usePlayer } from "@/context/PlayerContext";
import type { Track } from "@/types/music";
import { Play, Pause, MoreVertical, ListPlus, Mic2 } from "lucide-react";
import { EqualizerBars } from "@/components/ui/EqualizerBars";
import { formatFileSize } from "@/lib/utils";

export function TrackRow({ track, index }: { track: Track; index: number }) {
  const { currentTrack, isPlaying, playTrack, togglePlay, addToQueue, playNext, setActiveTab } = usePlayer();
  const [showMenu, setShowMenu] = React.useState(false);

  const isCurrent = currentTrack?.id === track.id;

  const handleRowClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track);
    }
  };

  return (
    <div 
      className={`group relative flex items-center justify-between px-3 md:px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
        isCurrent
          ? "bg-rose-950/40 border border-rose-500/30 text-white shadow-md shadow-rose-950/20"
          : "hover:bg-white/5 text-zinc-300 hover:text-white"
      }`}
    >
      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0" onClick={handleRowClick}>
        <div className="w-6 flex items-center justify-center flex-shrink-0">
          {isCurrent ? (
            <EqualizerBars isPlaying={isPlaying} />
          ) : (
            <span className="text-xs font-mono text-zinc-500 group-hover:hidden">
              {String(track.trackNumber).padStart(2, "0")}
            </span>
          )}
          <button className={`hidden ${!isCurrent ? "group-hover:flex" : "hidden"} text-zinc-200 hover:text-rose-400`}>
            <Play className="w-4 h-4 fill-current" />
          </button>
        </div>

        <div className="relative w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 border border-white/10 bg-zinc-900 shadow-sm">
          <Image
            src={track.artworkUrl}
            alt={track.title}
            fill
            sizes="44px"
            className="object-cover group-hover:scale-105 transition-transform"
          />
          {isCurrent && isPlaying && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Pause className="w-4 h-4 text-rose-400 fill-rose-400" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 pr-2">
          <div className="flex items-center gap-2">
            <h4 className={`text-sm font-semibold truncate ${isCurrent ? "text-rose-400 font-bold" : "text-zinc-100"}`}>
              {track.title}
            </h4>
            {track.hasSyncedLyrics && (
              <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.2 rounded bg-rose-950/60 text-rose-300 border border-rose-800/40">
                <Mic2 className="w-2.5 h-2.5" /> Lời
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400 truncate">
            {track.artist}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        <span className="hidden md:inline-block text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/5">
          {track.format || "FLAC"} • {formatFileSize(track.size)}
        </span>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 text-zinc-400 hover:text-white transition-colors"
            title="Tùy chọn khác"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-40"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }} 
              />
              <div className="absolute right-0 top-full mt-1 w-48 glass-dropdown rounded-xl py-1 shadow-2xl z-50 text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playNext(track);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-zinc-200 hover:bg-white/10 hover:text-white transition-colors text-left"
                >
                  <ListPlus className="w-3.5 h-3.5" /> Phát tiếp theo
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToQueue(track);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-zinc-200 hover:bg-white/10 hover:text-white transition-colors text-left"
                >
                  <ListPlus className="w-3.5 h-3.5" /> Thêm vào hàng đợi
                </button>
                {track.hasSyncedLyrics && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isCurrent) playTrack(track);
                      setActiveTab("lyrics");
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-zinc-200 hover:bg-white/10 hover:text-white transition-colors text-left"
                  >
                    <Mic2 className="w-3.5 h-3.5 text-rose-400" /> Xem lời bài hát
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}