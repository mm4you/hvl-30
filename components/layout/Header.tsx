"use client";

import React from "react";
import { Info, Download } from "lucide-react";

export function Header({ onOpenAbout }: { onOpenAbout: () => void }) {
  const handleInstallClick = () => {
    alert("Để cài đặt trên điện thoại:\n- Safari (iOS): Bấm nút Chia sẻ -> Chọn 'Thêm vào Màn hình chính'.\n- Chrome (Android): Bấm menu 3 chấm -> Chọn 'Cài đặt ứng dụng' hoặc 'Thêm vào màn hình chính'.");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070606]/90 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 lg:px-12 xl:px-16 py-4 transition-all">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3.5">
          <img src="/favicon.svg" alt="HVL 30" className="w-10 h-10 rounded-xl shadow-lg border border-rose-600/30" />
          <div>
            <strong className="text-lg font-black tracking-tight text-white block leading-tight">
              HVL 30
            </strong>
            <small className="text-xs text-zinc-400 font-semibold tracking-wide">
              30 bài · HVL FLAC
            </small>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAbout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold bg-rose-600/15 hover:bg-rose-600/25 text-rose-300 border border-rose-500/30 transition-all cursor-pointer shadow-md"
          >
            <Info className="w-4 h-4 text-rose-400" />
            Giới thiệu
          </button>

          <button
            onClick={handleInstallClick}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs md:text-sm font-medium bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Cài App
          </button>
        </div>
      </div>
    </header>
  );
}