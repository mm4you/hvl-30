import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { INITIAL_TRACKS } from "@/lib/supabase/seed-data";
import type { Track } from "@/types/music";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("tracks")
        .select("*")
        .order("track_number", { ascending: true });

      if (!error && data && data.length > 0) {
        const tracks: Track[] = data.map((t) => ({
          id: t.id,
          title: t.title,
          artist: t.artist,
          album: t.album || "HVL",
          trackNumber: t.track_number,
          format: t.format || "FLAC",
          size: Number(t.size) || 0,
          audioUrl: t.audio_url,
          artworkUrl: t.artwork_url,
          sourceDriveId: t.source_drive_id,
          playsCount: Number(t.plays_count) || 0,
          likesCount: Number(t.likes_count) || 0,
          hasSyncedLyrics: t.id !== "track-01",
        }));
        return NextResponse.json({ success: true, source: "supabase", tracks });
      }
    }
  } catch {
    // Graceful fallback to static data
  }

  return NextResponse.json({
    success: true,
    source: "local",
    tracks: INITIAL_TRACKS,
  });
}