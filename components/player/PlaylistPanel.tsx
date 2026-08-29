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
    <section className="mt-8 md:mt-12 rounded-3xl bg-[#0d0909]/95 border border-white/10 shadow-2xl p-6 sm:p-8 lg:p-10 backdrop-blur-2xl animate-in fade-in duration-200">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/10 mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Danh sách phát
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 mt-0.5">
            {tracks.length} bài hát · HVL 30 Lossless
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm bài hát..."
            className="w-full bg-white/5 hover:bg-white/10 focus:bg-zinc-900 border border-white/10 focus:border-rose-500 rounded-full pl-11 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Spacious 2-Column Responsive Track List */}
      <div className="max-h-[520px] overflow-y-auto pr-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {filteredTracks.map((track) => {
            const isCurrent = currentTrack?.id === track.id;

            return (
              <div
                key={track.id}
                onClick={() => {
                  if (isCurrent) togglePlay();
                  else playTrack(track);
                }}
                className={`group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                  isCurrent
                    ? "bg-rose-950/50 border border-rose-500/30 text-white shadow-md shadow-rose-950/20"
                    : "hover:bg-white/5 text-zinc-300 hover:text-white border border-transparent"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  {/* Artwork with Track number */}
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 bg-zinc-900 shadow-sm">
                    <Image
                      src={track.artworkUrl}
                      alt={track.title}
                      fill
                      sizes="48px"
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    {isCurrent && isPlaying ? (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Pause className="w-4 h-4 text-rose-400 fill-rose-400" />
                      </div>
                    ) : (
                      <span className="absolute bottom-1 right-1 text-[9px] font-mono font-bold bg-black/80 px-1 rounded text-zinc-300">
                        {String(track.trackNumber).padStart(2, "0")}
                      </span>
                    )}
                  </div>

                  {/* Title & Artist */}
                  <div className="min-w-0 flex-1">
                    <h4 className={`text-sm md:text-base font-bold truncate ${isCurrent ? "text-rose-400" : "text-zinc-100"}`}>
                      {track.title}
                    </h4>
                    <p className="text-xs text-zinc-400 truncate">
                      {track.artist}
                    </p>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {isCurrent && (
                    <EqualizerBars isPlaying={isPlaying} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}