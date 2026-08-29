"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import type { Track, RepeatMode } from "@/types/music";
import { INITIAL_TRACKS } from "@/lib/supabase/seed-data";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

interface PlayerContextType {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  volume: number;
  isMuted: boolean;
  isHeadphonesConnected: boolean;
  playbackRate: number;
  shuffle: boolean;
  repeatMode: RepeatMode;
  autoPlay: boolean;
  queue: Track[];
  queueIndex: number;
  searchQuery: string;
  isFullscreenOpen: boolean;
  isLyricsOpen: boolean;
  isStoryOpen: boolean;
  isQueueOpen: boolean;
  activeTab: "tracks" | "lyrics" | "story";
  audioRef: React.RefObject<HTMLAudioElement | null>;
  // Actions
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (seconds: number) => void;
  setVolume: (val: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleAutoPlay: () => void;
  setSearchQuery: (query: string) => void;
  setIsFullscreenOpen: (open: boolean) => void;
  setIsLyricsOpen: (open: boolean) => void;
  setIsStoryOpen: (open: boolean) => void;
  setIsQueueOpen: (open: boolean) => void;
  setActiveTab: (tab: "tracks" | "lyrics" | "story") => void;
  addToQueue: (track: Track) => void;
  playNext: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

const STORAGE_KEY_SETTINGS = "hvl30_settings_v2";
const STORAGE_KEY_LAST_TRACK = "hvl30_last_track_v2";

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [tracks, setTracks] = useState<Track[]>(INITIAL_TRACKS);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(INITIAL_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isHeadphonesConnected, setIsHeadphonesConnected] = useState<boolean>(false);
  const [playbackRate, setPlaybackRateState] = useState<number>(1);
  const [shuffle, setShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("all");
  const [autoPlay, setAutoPlay] = useState<boolean>(true);
  const [queue, setQueue] = useState<Track[]>(INITIAL_TRACKS);
  const [queueIndex, setQueueIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFullscreenOpen, setIsFullscreenOpen] = useState<boolean>(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState<boolean>(false);
  const [isStoryOpen, setIsStoryOpen] = useState<boolean>(false);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"tracks" | "lyrics" | "story">("tracks");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const preloadAudioRef = useRef<HTMLAudioElement | null>(null);

  // Detect Headphones & Audio Output changes
  useEffect(() => {
    if (typeof window === "undefined" || !navigator.mediaDevices?.enumerateDevices) return;

    const checkAudioOutputs = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasHeadphones = devices.some((d) => {
          if (d.kind === "audiooutput") {
            const label = d.label.toLowerCase();
            return (
              label.includes("headphone") ||
              label.includes("headset") ||
              label.includes("earphone") ||
              label.includes("airpod") ||
              label.includes("buds") ||
              label.includes("bluetooth") ||
              label.includes("tai nghe")
            );
          }
          return false;
        });
        setIsHeadphonesConnected(hasHeadphones);
      } catch {}
    };

    checkAudioOutputs();
    navigator.mediaDevices.addEventListener("devicechange", checkAudioOutputs);
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", checkAudioOutputs);
    };
  }, []);

  // Load initial settings
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (typeof parsed.volume === "number") setVolumeState(parsed.volume);
        if (typeof parsed.shuffle === "boolean") setShuffle(parsed.shuffle);
        if (parsed.repeatMode) setRepeatMode(parsed.repeatMode);
        if (typeof parsed.autoPlay === "boolean") setAutoPlay(parsed.autoPlay);
      }

      const savedLastTrackId = localStorage.getItem(STORAGE_KEY_LAST_TRACK);
      if (savedLastTrackId) {
        const found = INITIAL_TRACKS.find((t) => t.id === savedLastTrackId);
        if (found) {
          setCurrentTrack(found);
          const idx = INITIAL_TRACKS.findIndex((t) => t.id === savedLastTrackId);
          if (idx >= 0) setQueueIndex(idx);
        }
      }
    } catch {}

    // Fetch live tracks from Supabase
    fetch("/api/tracks")
      .then((res) => res.json())
      .then((data) => {
        if (data?.tracks && data.tracks.length > 0) {
          setTracks(data.tracks);
        }
      })
      .catch(() => {});
  }, []);

  // Save settings
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_SETTINGS,
        JSON.stringify({ volume, shuffle, repeatMode, autoPlay })
      );
    } catch {}
  }, [volume, shuffle, repeatMode, autoPlay]);

  // Helper to record play count
  const recordPlay = useCallback(async (track: Track) => {
    if (!isSupabaseConfigured) return;
    try {
      const { error } = await supabase.rpc("increment_track_plays", { t_id: track.id });
      if (error) {
        const { data } = await supabase.from("tracks").select("plays_count").eq("id", track.id).single();
        if (data) {
          await supabase.from("tracks").update({ plays_count: (data.plays_count || 0) + 1 }).eq("id", track.id);
        }
      }
    } catch {}
  }, []);

  // Preload next track
  useEffect(() => {
    if (!queue.length) return;
    const nextIdx = (queueIndex + 1) % queue.length;
    const nextT = queue[nextIdx];
    if (nextT && typeof window !== "undefined") {
      if (!preloadAudioRef.current) {
        preloadAudioRef.current = new Audio();
        preloadAudioRef.current.preload = "auto";
      }
      preloadAudioRef.current.src = nextT.audioUrl;
    }
  }, [queue, queueIndex]);

  // Media Session integration
  useEffect(() => {
    if (typeof window === "undefined" || !("mediaSession" in navigator) || !currentTrack) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title,
      artist: currentTrack.artist,
      album: "HVL (Lossless FLAC)",
      artwork: [
        { src: currentTrack.artworkUrl, sizes: "512x512", type: "image/jpeg" },
        { src: currentTrack.artworkUrl, sizes: "256x256", type: "image/jpeg" },
        { src: currentTrack.artworkUrl, sizes: "128x128", type: "image/jpeg" },
      ],
    });

    navigator.mediaSession.setActionHandler("play", () => {
      audioRef.current?.play();
      setIsPlaying(true);
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      audioRef.current?.pause();
      setIsPlaying(false);
    });
    navigator.mediaSession.setActionHandler("previoustrack", () => prevTrack());
    navigator.mediaSession.setActionHandler("nexttrack", () => nextTrack());
    navigator.mediaSession.setActionHandler("seekto", (details) => {
      if (details.seekTime !== undefined && audioRef.current) {
        audioRef.current.currentTime = details.seekTime;
      }
    });
    navigator.mediaSession.setActionHandler("seekbackward", (details) => {
      const skip = details.seekOffset || 10;
      if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - skip);
    });
    navigator.mediaSession.setActionHandler("seekforward", (details) => {
      const skip = details.seekOffset || 10;
      if (audioRef.current) audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + skip);
    });
  }, [currentTrack, duration]);

  // Play a specific track
  const playTrack = useCallback(
    (track: Track, newQueue?: Track[]) => {
      setCurrentTrack(track);
      try {
        localStorage.setItem(STORAGE_KEY_LAST_TRACK, track.id);
      } catch {}

      if (newQueue) {
        setQueue(newQueue);
        const idx = newQueue.findIndex((t) => t.id === track.id);
        setQueueIndex(idx >= 0 ? idx : 0);
      } else {
        const idx = queue.findIndex((t) => t.id === track.id);
        if (idx >= 0) {
          setQueueIndex(idx);
        } else {
          setQueue((prev) => [track, ...prev]);
          setQueueIndex(0);
        }
      }

      if (audioRef.current) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.currentTime = 0;
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            recordPlay(track);
          })
          .catch(() => {
            setIsPlaying(false);
          });
      }
    },
    [queue, recordPlay]
  );

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [isPlaying, currentTrack]);

  // Next Track
  const nextTrack = useCallback(() => {
    if (!queue.length) return;
    if (repeatMode === "one" && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    let nextIdx = queueIndex + 1;
    if (nextIdx >= queue.length) {
      if (repeatMode === "off") {
        setIsPlaying(false);
        return;
      }
      nextIdx = 0;
    }

    setQueueIndex(nextIdx);
    const nextT = queue[nextIdx];
    if (nextT) {
      setCurrentTrack(nextT);
      try {
        localStorage.setItem(STORAGE_KEY_LAST_TRACK, nextT.id);
      } catch {}
      if (audioRef.current) {
        audioRef.current.src = nextT.audioUrl;
        audioRef.current.currentTime = 0;
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            recordPlay(nextT);
          })
          .catch(() => setIsPlaying(false));
      }
    }
  }, [queue, queueIndex, repeatMode, recordPlay]);

  // Prev Track
  const prevTrack = useCallback(() => {
    if (!queue.length) return;
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) {
      prevIdx = queue.length - 1;
    }

    setQueueIndex(prevIdx);
    const prevT = queue[prevIdx];
    if (prevT) {
      setCurrentTrack(prevT);
      try {
        localStorage.setItem(STORAGE_KEY_LAST_TRACK, prevT.id);
      } catch {}
      if (audioRef.current) {
        audioRef.current.src = prevT.audioUrl;
        audioRef.current.currentTime = 0;
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            recordPlay(prevT);
          })
          .catch(() => setIsPlaying(false));
      }
    }
  }, [queue, queueIndex, recordPlay]);

  // Seek
  const seek = useCallback((seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  }, []);

  // Volume
  const setVolume = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.muted = false;
    }
  }, [isMuted]);

  // Toggle Mute
  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioRef.current.muted = nextMuted;
  }, [isMuted]);

  // Speed
  const setPlaybackRate = useCallback((rate: number) => {
    setPlaybackRateState(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }, []);

  // Shuffle
  const toggleShuffle = useCallback(() => {
    const nextShuffle = !shuffle;
    setShuffle(nextShuffle);
    if (nextShuffle) {
      const current = currentTrack;
      const otherTracks = tracks.filter((t) => t.id !== current?.id);
      for (let i = otherTracks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [otherTracks[i], otherTracks[j]] = [otherTracks[j], otherTracks[i]];
      }
      const newQ = current ? [current, ...otherTracks] : otherTracks;
      setQueue(newQ);
      setQueueIndex(0);
    } else {
      setQueue(tracks);
      if (currentTrack) {
        const idx = tracks.findIndex((t) => t.id === currentTrack.id);
        setQueueIndex(idx >= 0 ? idx : 0);
      }
    }
  }, [shuffle, tracks, currentTrack]);

  // Repeat
  const toggleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === "off") return "all";
      if (prev === "all") return "one";
      return "off";
    });
  }, []);

  // AutoPlay
  const toggleAutoPlay = useCallback(() => {
    setAutoPlay((prev) => !prev);
  }, []);

  // Queue actions
  const addToQueue = useCallback((track: Track) => {
    setQueue((prev) => [...prev, track]);
  }, []);

  const playNext = useCallback(
    (track: Track) => {
      setQueue((prev) => {
        const copy = [...prev];
        copy.splice(queueIndex + 1, 0, track);
        return copy;
      });
    },
    [queueIndex]
  );

  const removeFromQueue = useCallback((index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearQueue = useCallback(() => {
    if (currentTrack) {
      setQueue([currentTrack]);
      setQueueIndex(0);
    } else {
      setQueue([]);
      setQueueIndex(0);
    }
  }, [currentTrack]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <PlayerContext.Provider
      value={{
        tracks,
        currentTrack,
        isPlaying,
        isBuffering,
        currentTime,
        duration,
        progress,
        volume,
        isMuted,
        isHeadphonesConnected,
        playbackRate,
        shuffle,
        repeatMode,
        autoPlay,
        queue,
        queueIndex,
        searchQuery,
        isFullscreenOpen,
        isLyricsOpen,
        isStoryOpen,
        isQueueOpen,
        activeTab,
        audioRef,
        playTrack,
        togglePlay,
        nextTrack,
        prevTrack,
        seek,
        setVolume,
        toggleMute,
        setPlaybackRate,
        toggleShuffle,
        toggleRepeat,
        toggleAutoPlay,
        setSearchQuery,
        setIsFullscreenOpen,
        setIsLyricsOpen,
        setIsStoryOpen,
        setIsQueueOpen,
        setActiveTab,
        addToQueue,
        playNext,
        removeFromQueue,
        clearQueue,
      }}
    >
      <audio
        ref={audioRef}
        preload="auto"
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => setIsBuffering(false)}
        onCanPlay={() => setIsBuffering(false)}
        onEnded={() => {
          if (autoPlay) nextTrack();
          else setIsPlaying(false);
        }}
      />
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}