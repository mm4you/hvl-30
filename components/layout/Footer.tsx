"use client";

import React from "react";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 text-center text-xs text-zinc-500 pb-12">
      <a 
        href="https://github.com/mm4you" 
        target="_blank" 
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
      >
        <Github className="w-3.5 h-3.5" /> Built by Khang · @mm4you
      </a>
    </footer>
  );
}