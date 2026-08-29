"use client";

import React from "react";
import { usePlayer } from "@/context/PlayerContext";
import { Music2, Mic2, BookOpen, Search, Download, Database } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export function Navbar() {
  const { activeTab, setActiveTab, searchQuery, setSearchQuery, tracks } = usePlayer();

  const handleInstallClick = () => {
    alert("Để cài đặt ứng dụng trên điện thoại:\n- Safari (iOS): Bấm nút Chia sẻ (Share) -> Chọn 'Thêm vào Màn hình chính'.\n- Chrome (Android/Desktop): Bấm menu 3 chấm -> Chọn 'Cài đặt ứng dụng' hoặc 'Thêm vào màn hình chính'.");
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 md:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div 
            onClick={() => setActiveTab("tracks")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center font-bold text-white tracking-wider shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-transform">
              30
            </div>
            <div>
              <span className="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-white via-zinc-200 to-rose-400 bg-clip-text text-transparent">
                HVL 30
              </span>
              <span className="ml-2 text-xs font-semibold px-1.5 py-0.5 rounded bg-white/10 text-zinc-300">
                FLAC
              </span>
            </div>
          </div>

          {/* Mobile Supabase & Install */}
          <div className="flex items-center gap-2 md:hidden">
            {isSupabaseConfigured && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <Database className="w-3 h-3" /> Supabase
              </span>
            )}
            <button
              onClick={handleInstallClick}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg bg-white/5"
              title="Cài đặt App"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab("tracks")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === "tracks"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/30 font-semibold"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Music2 className="w-3.5 h-3.5" />
            30 Bài hát ({tracks.length})
          </button>

          <button
            onClick={() => setActiveTab("lyrics")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === "lyrics"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/30 font-semibold"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Mic2 className="w-3.5 h-3.5" />
            Karaoke Lyrics
          </button>

          <button
            onClick={() => setActiveTab("story")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === "story"
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/30 font-semibold"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Câu chuyện HVL & Gallery
          </button>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm bài hát, ca sĩ..."
              className="w-48 lg:w-56 bg-white/5 hover:bg-white/10 focus:bg-zinc-900 border border-white/10 focus:border-rose-500 rounded-full pl-9 pr-3.5 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all"
            />
          </div>

          {isSupabaseConfigured && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-full font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Supabase
            </div>
          )}

          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Cài App
          </button>
        </div>
      </div>
    </header>
  );
}