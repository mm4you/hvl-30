"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { usePlayer } from "@/context/PlayerContext";
import { Pause, Search } from "lucide-react";
import { EqualizerBars } from "@/components/ui/EqualizerBars";

export function PlaylistPanel({ isVisible }: { isVisible: boolean }) {
  const { tracks, currentTrack, isPlaying, playTrack, togglePlay, searchQuery, setSearchQuery } = usePlayer();

  const filteredTracks = useMemo(() => {
    let list = tracks;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          String(t.trackNumber) === q
      );
    }
    return list;
  }, [tracks, searchQuery]);

  if (!isVisible) return null;

  return (
    <section className="mt-6 rounded-3xl bg-[#120a0b]/90 border border-white/10 shadow-xl p-4 sm:p-6 backdrop-blur-2xl animate-in fade-in duration-200">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Danh sách bài hát
          </h2>
          <p className="text-xs text-zinc-400">
            {tracks.length} bài · HVL 30 Lossless
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm bài hát..."
            className="w-full bg-white/5 hover:bg-white/10 focus:bg-zinc-900 border border-white/10 focus:border-rose-500 rounded-full pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Track List with 3:2 Landscape Thumbnails */}
      <div className="max-h-[440px] overflow-y-auto space-y-1 pr-1">
        {filteredTracks.map((track) => {
          const isCurrent = currentTrack?.id === track.id;

          return (
            <div
              key={track.id}
              onClick={() => {
                if (isCurrent) togglePlay();
                else playTrack(track);
              }}
              className={`group flex items-center justify-between p-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                isCurrent
                  ? "bg-rose-950/50 border border-rose-500/30 text-white shadow-sm"
                  : "hover:bg-white/5 text-zinc-300 hover:text-white border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* 3:2 Landscape Thumbnail (Never Cropped!) */}
                <div className="relative w-14 aspect-[3/2] rounded-lg overflow-hidden flex-shrink-0 border border-white/10 bg-zinc-900 shadow-sm">
                  <Image
                    src={track.artworkUrl}
                    alt={track.title}
                    fill
                    sizes="56px"
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  {isCurrent && isPlaying ? (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Pause className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                    </div>
                  ) : (
                    <span className="absolute bottom-0.5 right-0.5 text-[8px] font-mono font-bold bg-black/80 px-1 rounded text-zinc-300">
                      {String(track.trackNumber).padStart(2, "0")}
                    </span>
                  )}
                </div>

                {/* Title & Artist */}
                <div className="min-w-0 flex-1">
                  <h4 className={`text-xs sm:text-sm font-semibold truncate ${isCurrent ? "text-rose-400 font-bold" : "text-zinc-100"}`}>
                    {track.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 truncate">
                    {track.artist}
                  </p>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {isCurrent && (
                  <EqualizerBars isPlaying={isPlaying} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}