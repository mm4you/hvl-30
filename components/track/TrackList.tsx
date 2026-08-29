"use client";

import React, { useMemo } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { TrackRow } from "./TrackRow";
import { Search, Music } from "lucide-react";

export function TrackList() {
  const { tracks, searchQuery } = usePlayer();

  const filteredTracks = useMemo(() => {
    let list = tracks;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.artist.toLowerCase().includes(q) ||
          String(t.trackNumber) === q
      );
    }
    return list;
  }, [tracks, searchQuery]);

  return (
    <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-4 md:p-6 backdrop-blur-md">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-rose-400" />
          <h2 className="text-base md:text-lg font-bold text-white">
            Danh sách 30 bài hát
          </h2>
          <span className="text-xs text-zinc-400">
            ({filteredTracks.length} bài)
          </span>
        </div>

        <div className="text-xs text-zinc-400 hidden sm:block font-mono">
          FLAC 24-bit/48kHz Lossless
        </div>
      </div>

      {filteredTracks.length > 0 ? (
        <div className="space-y-1">
          {filteredTracks.map((track, index) => (
            <TrackRow key={track.id} track={track} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-zinc-500">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-40 text-rose-400" />
          <p className="text-sm font-medium text-zinc-400">
            Không tìm thấy bài hát phù hợp với từ khóa.
          </p>
        </div>
      )}
    </div>
  );
}