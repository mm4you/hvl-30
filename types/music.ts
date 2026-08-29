export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  trackNumber: number;
  duration?: number;
  format?: string;
  size?: number;
  audioUrl: string;
  artworkUrl: string;
  sourceDriveId?: string;
  playsCount?: number;
  likesCount?: number;
  hasSyncedLyrics?: boolean;
};

export type RepeatMode = "off" | "all" | "one";

export type LyricLine = {
  time: number; // in seconds
  text: string;
};

export type TrackLyrics = {
  trackId: string;
  title: string;
  artist: string;
  lines: LyricLine[];
  plainText?: string;
};

export type Playlist = {
  id: string;
  name: string;
  description?: string;
  trackIds: string[];
  createdAt: string;
  updatedAt: string;
  isCustom?: boolean;
};

export type PlayerState = {
  currentTrack: Track | null;
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  shuffle: boolean;
  repeatMode: RepeatMode;
  autoPlay: boolean;
  queue: Track[];
  queueIndex: number;
};
