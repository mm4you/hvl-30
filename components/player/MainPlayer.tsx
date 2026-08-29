"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePlayer } from "@/context/PlayerContext";
import { 
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, 
  Volume2, VolumeX, Headphones, Mic2, ListMusic 
} from "lucide-react";
import { formatTime } from "@/lib/utils";
import { getLyricsForTrack } from "@/data/lyrics";

export function MainPlayer({
  playlistVisible,
  onTogglePlaylist,
}: {
  playlistVisible: boolean;
  onTogglePlaylist: () => void;
}) {
  const {
    currentTrack,
    isPlaying,
    isBuffering,
    togglePlay,
    nextTrack,
    prevTrack,
    currentTime,
    duration,
    seek,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    isHeadphonesConnected,
    shuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    autoPlay,
    toggleAutoPlay,
  } = usePlayer();

  const [lyricsVisible, setLyricsVisible] = useState(false);
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);

  const trackLyrics = currentTrack ? getLyricsForTrack(currentTrack.id) : null;
  const syncedLines = trackLyrics?.syncedLyrics || [];

  // Find active lyric index
  let activeLyricIdx = -1;
  for (let i = 0; i < syncedLines.length; i++) {
    const cur = syncedLines[i];
    const nxt = syncedLines[i + 1];
    if (currentTime >= cur.time && (!nxt || currentTime < nxt.time)) {
      activeLyricIdx = i;
      break;
    }
  }

  // Auto scroll lyrics
  useEffect(() => {
    if (lyricsVisible && activeLineRef.current && lyricsContainerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeLyricIdx, lyricsVisible]);

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#100d0d] border border-white/10 shadow-2xl p-5 md:p-8 backdrop-blur-xl">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-stretch">
        {/* Artwork / Lyrics Display Box */}
        <div className="relative w-full max-w-[280px] md:max-w-[320px] aspect-square rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-zinc-950 flex-shrink-0">
          {lyricsVisible ? (
            /* Synced Lyrics overlay directly inside player */
            <div 
              ref={lyricsContainerRef}
              className="w-full h-full overflow-y-auto p-4 space-y-3 bg-black/90 text-center scroll-smooth"
            >
              <div className="sticky top-0 bg-black/80 backdrop-blur-md pb-2 border-b border-white/10 mb-2 flex items-center justify-between text-xs text-rose-400 font-bold">
                <span>LỜI BÀI HÁT</span>
                <button 
                  onClick={() => setLyricsVisible(false)}
                  className="text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-white/10"
                >
                  Đóng
                </button>
              </div>

              {syncedLines.length > 0 ? (
                syncedLines.map((line, idx) => {
                  const isActive = idx === activeLyricIdx;
                  return (
                    <div
                      key={idx}
                      ref={isActive ? activeLineRef : null}
                      onClick={() => seek(line.time)}
                      className={`cursor-pointer transition-all duration-300 py-1 ${
                        isActive
                          ? "text-base md:text-lg font-black text-rose-400 scale-105"
                          : "text-xs md:text-sm text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {line.text}
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center h-48 text-zinc-500 text-xs">
                  Bản intro / nhạc dạo không lời
                </div>
              )}
            </div>
          ) : (
            /* Main High-Res Artwork */
            <>
              <Image
                src={currentTrack.artworkUrl}
                alt={currentTrack.title}
                fill
                priority
                sizes="(max-width: 768px) 280px, 320px"
                className="object-cover"
              />
              <span className="absolute top-3 left-3 text-xs font-mono font-bold bg-black/80 backdrop-blur-md text-white px-2 py-0.5 rounded-md border border-white/10">
                #{String(currentTrack.trackNumber).padStart(2, "0")}
              </span>
              <span className="absolute bottom-3 right-3 text-[11px] font-mono font-bold bg-rose-600/90 text-white px-2 py-0.5 rounded-md shadow-md">
                HVL
              </span>
            </>
          )}
        </div>

        {/* Player Controls & Info */}
        <div className="flex-1 flex flex-col justify-between w-full">
          {/* Track Heading */}
          <div>
            <p className="text-xs font-mono text-rose-500 font-semibold uppercase tracking-wider mb-1">
              {isPlaying ? "ĐANG PHÁT" : "HVL 30"}
            </p>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-1">
              {currentTrack.title}
            </h1>
            <p className="text-sm md:text-base text-zinc-400 font-medium mb-3">
              {currentTrack.artist}
            </p>
            
            <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
              <span className="text-rose-400 font-bold">{currentTrack.format || "FLAC"}</span>
              <span>•</span>
              <span>Chất lượng gốc</span>
            </div>
          </div>

          {/* Timeline Seekbar */}
          <div className="my-4">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer h-1.5"
            />
            <div className="flex justify-between text-xs font-mono text-zinc-400 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Core Controls */}
          <div className="flex items-center justify-center gap-6 my-2">
            <button
              onClick={prevTrack}
              className="p-2 text-zinc-300 hover:text-white active:scale-90 transition-all cursor-pointer"
              title="Bài trước"
            >
              <SkipBack className="w-6 h-6 fill-current" />
            </button>

            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-90 text-white flex items-center justify-center shadow-xl shadow-rose-600/40 transition-all cursor-pointer"
              title={isPlaying ? "Tạm dừng" : "Phát"}
            >
              {isBuffering ? (
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-6 h-6 fill-white" />
              ) : (
                <Play className="w-6 h-6 fill-white ml-0.5" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="p-2 text-zinc-300 hover:text-white active:scale-90 transition-all cursor-pointer"
              title="Bài tiếp theo"
            >
              <SkipForward className="w-6 h-6 fill-current" />
            </button>
          </div>

          {/* Volume with Headphone detection */}
          <div className="hidden sm:flex items-center justify-center gap-3 my-2">
            <button
              onClick={toggleMute}
              className="text-zinc-400 hover:text-white"
              title={isHeadphonesConnected ? "Đang kết nối tai nghe" : "Âm lượng"}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : isHeadphonesConnected ? (
                <Headphones className="w-4 h-4 text-rose-400 animate-pulse" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-32 accent-rose-500 cursor-pointer h-1"
            />
          </div>

          {/* Playback Options Toolbar */}
          <div className="flex items-center justify-between border-t border-white/10 pt-3 mt-2 text-xs">
            <div className="flex items-center gap-2">
              {/* Shuffle */}
              <button
                onClick={toggleShuffle}
                className={`p-2 rounded-xl border transition-all ${
                  shuffle
                    ? "bg-rose-600/20 text-rose-400 border-rose-500/40"
                    : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
                }`}
                title={shuffle ? "Trộn bài: Đã bật" : "Trộn bài: Đã tắt"}
              >
                <Shuffle className="w-4 h-4" />
              </button>

              {/* Repeat */}
              <button
                onClick={toggleRepeat}
                className={`p-2 rounded-xl border transition-all ${
                  repeatMode !== "off"
                    ? "bg-rose-600/20 text-rose-400 border-rose-500/40"
                    : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
                }`}
                title={repeatMode === "one" ? "Lặp 1 bài" : repeatMode === "all" ? "Lặp toàn bộ" : "Không lặp"}
              >
                {repeatMode === "one" ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
              </button>

              {/* Lyrics button */}
              <button
                onClick={() => setLyricsVisible(!lyricsVisible)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border font-semibold transition-all ${
                  lyricsVisible
                    ? "bg-rose-600 text-white border-rose-600 shadow-md"
                    : "bg-white/5 text-zinc-300 border-white/10 hover:text-white"
                }`}
              >
                <Mic2 className="w-3.5 h-3.5" />
                <span>{lyricsVisible ? "Ẩn lời" : "Lời bài hát"}</span>
              </button>
            </div>

            {/* Playlist Toggle button */}
            <button
              onClick={onTogglePlaylist}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border font-bold transition-all ${
                playlistVisible
                  ? "bg-rose-600/20 text-rose-300 border-rose-500/40 shadow-sm"
                  : "bg-white/5 text-zinc-300 border-white/10 hover:text-white"
              }`}
            >
              <ListMusic className="w-3.5 h-3.5" />
              <span>{playlistVisible ? "Ẩn danh sách" : "Hiện danh sách"}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}