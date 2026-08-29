"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { MainPlayer } from "@/components/player/MainPlayer";
import { PlaylistPanel } from "@/components/player/PlaylistPanel";
import { AboutModal } from "@/components/modal/AboutModal";
import { CinemaModal } from "@/components/modal/CinemaModal";
import { Footer } from "@/components/layout/Footer";
import { usePlayer } from "@/context/PlayerContext";

export default function HomePage() {
  const [playlistVisible, setPlaylistVisible] = useState(true);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [cinemaOpen, setCinemaOpen] = useState(false);

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
    shuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
  } = usePlayer();

  return (
    <div className="min-h-screen bg-[#070505] text-[#f4f0eb] flex flex-col selection:bg-[#ff3725] selection:text-white">
      {/* Top Header */}
      <Header onOpenAbout={() => setAboutOpen(true)} />

      {/* Main Container - Spacious Widescreen Layout */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 md:px-8 py-6 sm:py-10">
        {/* Modern Hi-Fi Studio Player with 3:2 Artwork & Cinema Mode */}
        <MainPlayer
          playlistVisible={playlistVisible}
          onTogglePlaylist={() => setPlaylistVisible(!playlistVisible)}
          onOpenCinema={() => setCinemaOpen(true)}
        />

        {/* 2-Column Responsive Playlist Panel */}
        <PlaylistPanel isVisible={playlistVisible} />

        {/* Clean Attribution Footer */}
        <Footer />
      </main>

      {/* Fullscreen About Modal (50/50 Balanced Editorial Layout) */}
      <AboutModal
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
      />

      {/* Immersive Cinema Studio Mode */}
      <CinemaModal
        isOpen={cinemaOpen}
        onClose={() => setCinemaOpen(false)}
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        isBuffering={isBuffering}
        togglePlay={togglePlay}
        nextTrack={nextTrack}
        prevTrack={prevTrack}
        currentTime={currentTime}
        duration={duration}
        seek={seek}
        volume={volume}
        setVolume={setVolume}
        isMuted={isMuted}
        toggleMute={toggleMute}
        isHeadphonesConnected={isHeadphonesConnected}
        shuffle={shuffle}
        toggleShuffle={toggleShuffle}
        repeatMode={repeatMode}
        toggleRepeat={toggleRepeat}
      />
    </div>
  );
}