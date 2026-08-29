"use client";

import React from "react";
import { Info, Maximize2 } from "lucide-react";

export function Header({ 
  onOpenAbout,
  onOpenCinema,
}: { 
  onOpenAbout: () => void;
  onOpenCinema?: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#080606]/95 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-6 md:px-8 py-3.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3.5">
          <img 
            src="/favicon.svg" 
            alt="HVL 30" 
            className="w-9 h-9 rounded-xl shadow-lg border border-white/10" 
          />
          <div>
            <strong className="text-base font-extrabold tracking-tight text-white block leading-tight">
              HVL 30
            </strong>
            <span className="text-[11px] text-zinc-400 font-semibold block">
              RPT MCK • 30 Ca khúc
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {onOpenCinema && (
            <button
              onClick={onOpenCinema}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-all cursor-pointer active:scale-95 shadow-sm"
              title="Chế độ Cinema toàn màn hình (C)"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#ff3725]" />
              <span className="hidden sm:inline">Cinema</span>
            </button>
          )}

          <button
            onClick={onOpenAbout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#ff3725]/15 hover:bg-[#ff3725]/25 text-rose-300 border border-[#ff3725]/30 transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <Info className="w-3.5 h-3.5 text-[#ff3725]" />
            <span>Giới thiệu</span>
          </button>
        </div>
      </div>
    </header>
  );
}