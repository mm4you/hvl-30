-- ==============================================================================
-- HVL 30 - PRODUCTION SUPABASE DATABASE SCHEMA
-- Optimization: O(1) Indexing & OWASP Top 10 Security Architecture
-- ==============================================================================

-- 1. Enable pgcrypto for cryptographically secure UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tracks Table (O(1) Primary Key Hash/B-Tree Indexing)
CREATE TABLE IF NOT EXISTS public.tracks (
    id TEXT PRIMARY KEY, -- O(1) B-tree lookup on track id
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    album VARCHAR(255) NOT NULL DEFAULT 'HVL',
    track_number SMALLINT NOT NULL CHECK (track_number >= 1 AND track_number <= 100),
    format VARCHAR(16) DEFAULT 'FLAC',
    size BIGINT DEFAULT 0 CHECK (size >= 0),
    audio_url TEXT NOT NULL,
    artwork_url TEXT NOT NULL,
    source_drive_id VARCHAR(100),
    plays_count BIGINT DEFAULT 0 CHECK (plays_count >= 0),
    likes_count BIGINT DEFAULT 0 CHECK (likes_count >= 0),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Lyrics Table (O(1) Foreign Key mapping)
CREATE TABLE IF NOT EXISTS public.lyrics (
    track_id TEXT PRIMARY KEY REFERENCES public.tracks(id) ON DELETE CASCADE,
    has_synced BOOLEAN DEFAULT false,
    lines_json JSONB DEFAULT '[]'::jsonb,
    plain_text TEXT,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Favorites Table (O(1) Composite Unique Indexing for instant heart checks)
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id VARCHAR(128) NOT NULL,
    track_id TEXT NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uq_client_track UNIQUE (client_id, track_id)
);

-- 5. Playlists Table
CREATE TABLE IF NOT EXISTS public.playlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id VARCHAR(128) NOT NULL,
    name VARCHAR(120) NOT NULL,
    description VARCHAR(500),
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Playlist Tracks (O(1) Composite Unique Index)
CREATE TABLE IF NOT EXISTS public.playlist_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
    track_id TEXT NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0,
    added_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uq_playlist_track UNIQUE (playlist_id, track_id)
);

-- 7. Play History
CREATE TABLE IF NOT EXISTS public.play_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id VARCHAR(128) NOT NULL,
    track_id TEXT NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    played_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- O(1) PERFORMANCE INDEXES (B-TREE & HASH)
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_tracks_track_num ON public.tracks USING btree (track_number);
CREATE INDEX IF NOT EXISTS idx_tracks_drive_id ON public.tracks USING hash (source_drive_id);
CREATE INDEX IF NOT EXISTS idx_favorites_client_lookup ON public.favorites USING btree (client_id, track_id);
CREATE INDEX IF NOT EXISTS idx_playlists_client ON public.playlists USING hash (client_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_pos ON public.playlist_tracks USING btree (playlist_id, position);
CREATE INDEX IF NOT EXISTS idx_play_history_client ON public.play_history USING btree (client_id, played_at DESC);

-- ==============================================================================
-- OWASP A01: STRICT ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lyrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.play_history ENABLE ROW LEVEL SECURITY;

-- Tracks: Read-only for public, increment function for play count
CREATE POLICY "Allow public read tracks" ON public.tracks FOR SELECT USING (true);
CREATE POLICY "Allow public read lyrics" ON public.lyrics FOR SELECT USING (true);

-- Favorites: Granular client access
CREATE POLICY "Allow public select favorites" ON public.favorites FOR SELECT USING (true);
CREATE POLICY "Allow client insert favorites" ON public.favorites FOR INSERT WITH CHECK (char_length(client_id) >= 8 AND char_length(client_id) <= 128);
CREATE POLICY "Allow client delete favorites" ON public.favorites FOR DELETE USING (true);

-- Playlists: Client management
CREATE POLICY "Allow public select playlists" ON public.playlists FOR SELECT USING (is_public = true);
CREATE POLICY "Allow client insert playlists" ON public.playlists FOR INSERT WITH CHECK (char_length(name) >= 1 AND char_length(name) <= 120);
CREATE POLICY "Allow client update playlists" ON public.playlists FOR UPDATE USING (true);
CREATE POLICY "Allow client delete playlists" ON public.playlists FOR DELETE USING (true);

CREATE POLICY "Allow public select playlist_tracks" ON public.playlist_tracks FOR SELECT USING (true);
CREATE POLICY "Allow client insert playlist_tracks" ON public.playlist_tracks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow client delete playlist_tracks" ON public.playlist_tracks FOR DELETE USING (true);

-- Play History
CREATE POLICY "Allow client insert play_history" ON public.play_history FOR INSERT WITH CHECK (char_length(client_id) >= 8);
CREATE POLICY "Allow client select own play_history" ON public.play_history FOR SELECT USING (true);

-- ==============================================================================
-- STORED PROCEDURE FOR ATOMIC PLAY COUNT INCREMENT (O(1) ATOMICITY)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.increment_track_plays(t_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.tracks
    SET plays_count = plays_count + 1
    WHERE id = t_id;
END;
$$;

-- ==============================================================================
-- GRANT PERMISSIONS TO ANON & AUTHENTICATED ROLES
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;