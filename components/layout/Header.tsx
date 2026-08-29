"use client";

import React from "react";
import { Info, Download } from "lucide-react";

export function Header({ onOpenAbout }: { onOpenAbout: () => void }) {
  const handleInstallClick = () => {
    alert("Để cài đặt trên điện thoại:\n- Safari (iOS): Bấm nút Chia sẻ -> Chọn 'Thêm vào Màn hình chính'.\n- Chrome (Android): Bấm menu 3 chấm -> Chọn 'Cài đặt ứng dụng' hoặc 'Thêm vào màn hình chính'.");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#070606]/90 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 py-3 transition-all">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <img src="/favicon.svg" alt="HVL 30" className="w-8 h-8 rounded-lg shadow-md" />
          <div>
            <strong className="text-base font-black tracking-tight text-white block leading-tight">
              HVL 30
            </strong>
            <small className="text-xs text-zinc-400 font-medium">
              30 bài · HVL
            </small>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAbout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            Giới thiệu
          </button>

          <button
            onClick={handleInstallClick}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Cài App
          </button>
        </div>
      </div>
    </header>
  );
}