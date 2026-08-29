"use client";

import React from "react";
import { usePlayer } from "@/context/PlayerContext";
import { Navbar } from "@/components/layout/Navbar";
import { AlbumHero } from "@/components/album/AlbumHero";
import { TrackList } from "@/components/track/TrackList";
import { SyncedLyricsView } from "@/components/lyrics/SyncedLyricsView";
import { StoryGallery } from "@/components/gallery/StoryGallery";
import { BottomPlayer } from "@/components/player/BottomPlayer";
import { FullscreenPlayer } from "@/components/player/FullscreenPlayer";
import { QueueDrawer } from "@/components/queue/QueueDrawer";

export default function HomePage() {
  const { activeTab } = usePlayer();

  return (
    <div className="min-h-screen bg-[#060608] text-[#f4f0eb] pb-32">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        {activeTab === "tracks" && (
          <div className="space-y-6">
            <AlbumHero />
            <TrackList />
          </div>
        )}

        {activeTab === "lyrics" && (
          <div className="py-2">
            <SyncedLyricsView />
          </div>
        )}

        {activeTab === "story" && (
          <div className="py-2">
            <StoryGallery />
          </div>
        )}
      </main>

      <BottomPlayer />
      <FullscreenPlayer />
      <QueueDrawer />
    </div>
  );
}