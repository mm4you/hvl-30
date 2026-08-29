import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { INITIAL_TRACKS } from "@/lib/supabase/seed-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("tracks")
        .select("*")
        .order("track_number", { ascending: true });

      if (!error && data && data.length > 0) {
        const tracks = data.map((t) => ({
          id: t.id,
          title: t.title,
          artist: t.artist,
          album: t.album || "HVL",
          trackNumber: t.track_number,
          format: t.format || "FLAC",
          size: Number(t.size) || 0,
          originalUrl: `https://drive.google.com/file/d/${t.source_drive_id}/view`,
          audioUrl: t.audio_url,
          artworkUrl: t.artwork_url,
          sourceDriveId: t.source_drive_id,
          playsCount: Number(t.plays_count) || 0,
          likesCount: Number(t.likes_count) || 0,
        }));

        return NextResponse.json({
          complete: true,
          imported: tracks.length,
          total: 30,
          tracks,
        });
      }
    }
  } catch (err) {
    console.error("Error reading catalog:", err);
  }

  const fallbackTracks = INITIAL_TRACKS.map((t) => ({
    ...t,
    originalUrl: `https://drive.google.com/file/d/${t.sourceDriveId}/view`,
  }));

  return NextResponse.json({
    complete: true,
    imported: fallbackTracks.length,
    total: 30,
    tracks: fallbackTracks,
  });
}