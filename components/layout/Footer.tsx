"use client";

import React from "react";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 text-center text-xs text-zinc-500 space-y-2 pb-12">
      <p className="max-w-xl mx-auto leading-relaxed">
        Không cần tài khoản. 30 bài nhạc dùng chung được phát từ kho của HVL 30; file giữ nguyên định dạng gốc, không chuyển mã hoặc giảm chất lượng.
      </p>
      <div>
        <a 
          href="https://github.com/mm4you" 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
        >
          <Github className="w-3.5 h-3.5" /> Built by Khang · @mm4you
        </a>
      </div>
    </footer>
  );
}