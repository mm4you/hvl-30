"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePlayer } from "@/context/PlayerContext";
import { 
  X, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, 
  Volume2, VolumeX, Headphones, Mic2 
} from "lucide-react";
import { formatTime } from "@/lib/utils";
import { getLyricsForTrack } from "@/data/lyrics";

export function FullscreenPlayer() {
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
    isMuted,
    toggleMute,
    isHeadphonesConnected,
    shuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    isFullscreenOpen,
    setIsFullscreenOpen,
  } = usePlayer();

  const [mode, setMode] = useState<"cover" | "lyrics">("cover");

  if (!isFullscreenOpen || !currentTrack) return null;

  const trackLyrics = getLyricsForTrack(currentTrack.id);
  const syncedLines = trackLyrics?.syncedLyrics || [];

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-rose-950/90 via-zinc-950/95 to-black/98 backdrop-blur-3xl flex flex-col p-4 md:p-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between max-w-4xl mx-auto w-full mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-600/30 text-rose-300 border border-rose-500/30 font-semibold">
            LOSSLESS FLAC
          </span>
          <span className="text-xs text-zinc-400">
            HVL 30 • RPT MCK
          </span>
        </div>

        <div className="flex items-center gap-1 bg-white/10 p-1 rounded-full border border-white/10">
          <button
            onClick={() => setMode("cover")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              mode === "cover" ? "bg-rose-600 text-white shadow-md" : "text-zinc-400 hover:text-white"
            }`}
          >
            Đĩa than
          </button>
          <button
            onClick={() => setMode("lyrics")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
              mode === "lyrics" ? "bg-rose-600 text-white shadow-md" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Mic2 className="w-3 h-3" /> Lời bài hát
          </button>
        </div>

        <button
          onClick={() => setIsFullscreenOpen(false)}
          className="p-2 text-zinc-400 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col items-center justify-center my-auto">
        {mode === "cover" ? (
          <div className="relative flex flex-col items-center justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
              <div 
                className={`absolute inset-0 rounded-full bg-zinc-950 border-8 border-zinc-900 shadow-2xl shadow-rose-950/50 flex items-center justify-center animate-spin-slow ${
                  !isPlaying ? "paused" : ""
                }`}
                style={{
                  backgroundImage: "repeating-radial-gradient(circle, #18181b 0, #18181b 2px, #09090b 3px, #09090b 4px)",
                }}
              >
                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-zinc-950 shadow-inner">
                  <Image
                    src={currentTrack.artworkUrl}
                    alt={currentTrack.title}
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 m-auto w-5 h-5 rounded-full bg-zinc-950 border-2 border-zinc-700 shadow-inner" />
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-1 tracking-tight">
                {currentTrack.title}
              </h2>
              <p className="text-base text-rose-400 font-semibold">
                {currentTrack.artist}
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full h-80 md:h-96 overflow-y-auto px-4 py-6 text-center space-y-4">
            {syncedLines.length > 0 ? (
              syncedLines.map((line, idx) => {
                const nextLine = syncedLines[idx + 1];
                const isActive = currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
                return (
                  <p
                    key={idx}
                    onClick={() => seek(line.time)}
                    className={`cursor-pointer transition-all duration-300 ${
                      isActive
                        ? "text-2xl md:text-3xl font-black text-rose-400 scale-105"
                        : "text-lg md:text-xl font-medium text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {line.text}
                  </p>
                );
              })
            ) : (
              <div className="text-zinc-500 py-16">
                <Mic2 className="w-12 h-12 mx-auto mb-2 opacity-30 text-rose-400" />
                <p>Bản intro/nhạc dạo không lời.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="max-w-xl mx-auto w-full pb-4">
        <div className="w-full mb-6">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={(e) => seek(parseFloat(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer h-2"
          />
          <div className="flex justify-between text-xs font-mono text-zinc-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={toggleShuffle}
            className={`p-3 rounded-full transition-colors ${
              shuffle ? "text-rose-400" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button onClick={prevTrack} className="p-3 text-zinc-200 hover:text-white active:scale-95">
            <SkipBack className="w-7 h-7 fill-current" />
          </button>

          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-90 text-white flex items-center justify-center shadow-2xl shadow-rose-600/50 transition-all cursor-pointer"
          >
            {isBuffering ? (
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-7 h-7 fill-white" />
            ) : (
              <Play className="w-7 h-7 fill-white ml-1" />
            )}
          </button>

          <button onClick={nextTrack} className="p-3 text-zinc-200 hover:text-white active:scale-95">
            <SkipForward className="w-7 h-7 fill-current" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-3 rounded-full transition-colors ${
              repeatMode !== "off" ? "text-rose-400" : "text-zinc-400 hover:text-white"
            }`}
          >
            {repeatMode === "one" ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
          </button>

          <button onClick={toggleMute} className="p-3 text-zinc-400 hover:text-white">
            {isMuted || volume === 0 ? <VolumeX className="w-6 h-6 text-rose-400" /> : isHeadphonesConnected ? <Headphones className="w-6 h-6 text-rose-400 animate-pulse" /> : <Volume2 className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </div>
  );
}