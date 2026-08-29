"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePlayer } from "@/context/PlayerContext";
import { 
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, 
  Volume2, VolumeX, Headphones, Mic2, Maximize2, ListMusic, Gauge 
} from "lucide-react";
import { formatTime } from "@/lib/utils";

export function BottomPlayer() {
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
    playbackRate,
    setPlaybackRate,
    shuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    setIsFullscreenOpen,
    isQueueOpen,
    setIsQueueOpen,
    activeTab,
    setActiveTab,
  } = usePlayer();

  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seek(val);
  };

  const handleLyricsToggle = () => {
    if (activeTab === "lyrics") {
      setActiveTab("tracks");
    } else {
      setActiveTab("lyrics");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/10 px-3 md:px-6 py-2.5 shadow-2xl backdrop-blur-2xl transition-all">
      <div 
        className="absolute top-0 left-0 right-0 h-[2px] bg-white/10 md:hidden cursor-pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const pct = clickX / rect.width;
          seek(pct * duration);
        }}
      >
        <div 
          className="h-full bg-rose-500 transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-6">
        <div className="flex items-center gap-3 min-w-0 flex-1 md:flex-initial md:w-1/4">
          <div 
            onClick={() => setIsFullscreenOpen(true)}
            className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer group shadow-md border border-white/10"
          >
            <Image
              src={currentTrack.artworkUrl}
              alt={currentTrack.title}
              fill
              sizes="48px"
              className="object-cover group-hover:scale-110 transition-transform"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Maximize2 className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="min-w-0 pr-2">
            <h4 
              onClick={() => setIsFullscreenOpen(true)}
              className="text-sm font-bold text-white truncate cursor-pointer hover:text-rose-400 transition-colors"
            >
              {currentTrack.title}
            </h4>
            <p className="text-xs text-zinc-400 truncate">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center flex-1 max-w-xl">
          <div className="flex items-center gap-3 md:gap-5">
            <button
              onClick={toggleShuffle}
              className={`p-1.5 rounded-full transition-colors hidden sm:block ${
                shuffle ? "text-rose-400 bg-rose-950/60" : "text-zinc-400 hover:text-white"
              }`}
              title={shuffle ? "Đang bật trộn bài" : "Bật trộn bài"}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={prevTrack}
              className="p-1.5 text-zinc-300 hover:text-white active:scale-95 transition-all"
              title="Bài trước"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-90 text-white flex items-center justify-center shadow-lg shadow-rose-600/50 transition-all cursor-pointer"
              title={isPlaying ? "Tạm dừng" : "Phát"}
            >
              {isBuffering ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-white" />
              ) : (
                <Play className="w-5 h-5 fill-white ml-0.5" />
              )}
            </button>

            <button
              onClick={nextTrack}
              className="p-1.5 text-zinc-300 hover:text-white active:scale-95 transition-all"
              title="Bài tiếp theo"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={toggleRepeat}
              className={`p-1.5 rounded-full transition-colors hidden sm:block ${
                repeatMode !== "off" ? "text-rose-400 bg-rose-950/60" : "text-zinc-400 hover:text-white"
              }`}
              title={
                repeatMode === "one"
                  ? "Lặp lại 1 bài"
                  : repeatMode === "all"
                  ? "Lặp lại toàn bộ"
                  : "Không lặp lại"
              }
            >
              {repeatMode === "one" ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2.5 w-full mt-1">
            <span className="text-[11px] font-mono text-zinc-400 w-8 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeekChange}
              className="flex-1 accent-rose-500 cursor-pointer"
            />
            <span className="text-[11px] font-mono text-zinc-400 w-8">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-1.5 md:gap-3 flex-shrink-0 md:w-1/4">
          <div className="relative hidden lg:block">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10"
              title="Tốc độ phát"
            >
              <Gauge className="w-3 h-3" />
              {playbackRate}x
            </button>

            {showSpeedMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSpeedMenu(false)} />
                <div className="absolute bottom-full mb-2 right-0 glass-dropdown rounded-xl py-1 shadow-2xl z-50 text-xs w-24">
                  {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => {
                        setPlaybackRate(rate);
                        setShowSpeedMenu(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left transition-colors ${
                        playbackRate === rate ? "text-rose-400 font-bold bg-white/5" : "text-zinc-300 hover:bg-white/10"
                      }`}
                    >
                      {rate}x {rate === 1 && "(Chuẩn)"}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-1.5">
            <button onClick={toggleMute} className="text-zinc-400 hover:text-white p-1">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : isHeadphonesConnected ? <Headphones className="w-4 h-4 text-rose-400 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 accent-rose-500 cursor-pointer"
            />
          </div>

          <button
            onClick={handleLyricsToggle}
            className={`p-2 rounded-xl transition-all ${
              activeTab === "lyrics"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/40 font-bold"
                : "text-zinc-400 hover:text-white bg-white/5"
            }`}
            title="Lời bài hát (Karaoke)"
          >
            <Mic2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsQueueOpen(!isQueueOpen)}
            className={`p-2 rounded-xl transition-all ${
              isQueueOpen
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/40"
                : "text-zinc-400 hover:text-white bg-white/5"
            }`}
            title="Danh sách phát tiếp theo"
          >
            <ListMusic className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreenOpen(true)}
            className="p-2 text-zinc-400 hover:text-white bg-white/5 rounded-xl hidden sm:flex"
            title="Mở toàn màn hình"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}