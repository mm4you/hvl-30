"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { MainPlayer } from "@/components/player/MainPlayer";
import { PlaylistPanel } from "@/components/player/PlaylistPanel";
import { AboutModal } from "@/components/modal/AboutModal";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  const [playlistVisible, setPlaylistVisible] = useState(true);
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#060606] text-[#f4f0eb] flex flex-col selection:bg-rose-600 selection:text-white">
      {/* Topbar */}
      <Header onOpenAbout={() => setAboutOpen(true)} />

      {/* Main Container - Expansive & Spacious (Widescreen 1440px) */}
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-6 md:py-10">
        {/* Split-Screen Player (Left: Art & Controls, Right: Live Karaoke Lyrics) */}
        <MainPlayer 
          playlistVisible={playlistVisible}
          onTogglePlaylist={() => setPlaylistVisible(!playlistVisible)}
        />

        {/* Collapsible / Inner Scrollable Playlist Panel */}
        <PlaylistPanel isVisible={playlistVisible} />

        {/* Authentic Author Footer */}
        <Footer />
      </main>

      {/* Cinematic Fullscreen About Modal */}
      <AboutModal 
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
      />
    </div>
  );
}