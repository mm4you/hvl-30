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
    <section className="mt-6 rounded-3xl bg-[#110b0c]/95 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-5 sm:p-7 backdrop-blur-3xl animate-in fade-in duration-200">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            Danh sách bài hát
          </h2>
          <p className="text-xs text-zinc-400 font-semibold mt-0.5">
            {tracks.length} ca khúc • HVL 30
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài hát..."
            className="w-full bg-white/5 hover:bg-white/10 focus:bg-zinc-950 border border-white/10 focus:border-[#ff3725]/60 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Clean Single 1-Column List */}
      <div className="flex flex-col gap-1.5 max-h-[500px] overflow-y-auto pr-1.5 custom-scrollbar">
        {filteredTracks.map((track) => {
          const isCurrent = currentTrack?.id === track.id;

          return (
            <div
              key={track.id}
              onClick={() => {
                if (isCurrent) togglePlay();
                else playTrack(track);
              }}
              className={`group flex items-center justify-between p-2.5 sm:p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                isCurrent
                  ? "bg-[#ff3725]/15 border border-[#ff3725]/40 text-white shadow-md"
                  : "hover:bg-white/5 text-zinc-300 hover:text-white border border-transparent hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {/* 3:2 Landscape Thumbnail */}
                <div className="relative w-16 aspect-[3/2] rounded-xl overflow-hidden flex-shrink-0 border border-white/10 bg-zinc-900 shadow-sm">
                  <Image
                    src={track.artworkUrl}
                    alt={track.title}
                    fill
                    sizes="64px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {isCurrent && isPlaying ? (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Pause className="w-4 h-4 text-[#ff3725] fill-[#ff3725]" />
                    </div>
                  ) : (
                    <span className="absolute bottom-1 right-1 text-[9px] font-mono font-black bg-black/80 px-1.5 py-0.5 rounded text-zinc-300">
                      {String(track.trackNumber).padStart(2, "0")}
                    </span>
                  )}
                </div>

                {/* Title & Artist */}
                <div className="min-w-0 flex-1">
                  <h4 className={`text-xs sm:text-sm font-bold truncate ${isCurrent ? "text-[#ff3725]" : "text-white"}`}>
                    {track.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-semibold truncate mt-0.5">
                    {track.artist}
                  </p>
                </div>
              </div>

              {/* Equalizer Indicator */}
              <div className="flex items-center gap-2 flex-shrink-0 pl-2">
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