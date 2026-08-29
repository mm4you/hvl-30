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
      {/* Authentic Topbar */}
      <Header onOpenAbout={() => setAboutOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 md:px-8 py-6 md:py-10">
        {/* Central Player Card with Artwork & Lyrics */}
        <MainPlayer 
          playlistVisible={playlistVisible}
          onTogglePlaylist={() => setPlaylistVisible(!playlistVisible)}
        />

        {/* Collapsible / Scrollable Inner Playlist Panel */}
        <PlaylistPanel isVisible={playlistVisible} />

        {/* Authentic Author Footer */}
        <Footer />
      </main>

      {/* About Modal ("Đôi lời quan trọng của tôi") */}
      <AboutModal 
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
      />
    </div>
  );
}