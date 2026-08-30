export type TrackVibe = "chill" | "groove" | "hype";

export interface TrackVibeProfile {
  id: string;
  trackNumber: number;
  title: string;
  vibe: TrackVibe;
  energy: 1 | 2 | 3; // 1: Chill/R&B, 2: Groove/Mid-tempo, 3: Hype/Trap/Drill
  bpm: number;
}

export const TRACK_VIBES: Record<string, TrackVibeProfile> = {
  "track-01": { id: "track-01", trackNumber: 1, title: "Elegie", vibe: "chill", energy: 1, bpm: 78 },
  "track-02": { id: "track-02", trackNumber: 2, title: "IDK", vibe: "groove", energy: 2, bpm: 104 },
  "track-03": { id: "track-03", trackNumber: 3, title: "Wtf Bby I'm Lit", vibe: "hype", energy: 3, bpm: 130 },
  "track-04": { id: "track-04", trackNumber: 4, title: "Anh Không Muốn Nó Dễ Dàng", vibe: "chill", energy: 1, bpm: 82 },
  "track-05": { id: "track-05", trackNumber: 5, title: "Baby", vibe: "chill", energy: 1, bpm: 85 },
  "track-06": { id: "track-06", trackNumber: 6, title: "Yêu Anh Giết Anh", vibe: "groove", energy: 2, bpm: 100 },
  "track-07": { id: "track-07", trackNumber: 7, title: "Mắt Môi Tay Chân", vibe: "hype", energy: 3, bpm: 136 },
  "track-08": { id: "track-08", trackNumber: 8, title: "Đao Của Anh Vừa", vibe: "groove", energy: 2, bpm: 95 },
  "track-09": { id: "track-09", trackNumber: 9, title: "Là Gì Của Nhau", vibe: "chill", energy: 1, bpm: 84 },
  "track-10": { id: "track-10", trackNumber: 10, title: "Night In Prague", vibe: "chill", energy: 1, bpm: 80 },
  "track-11": { id: "track-11", trackNumber: 11, title: "Một Cái Ôm", vibe: "chill", energy: 1, bpm: 86 },
  "track-12": { id: "track-12", trackNumber: 12, title: "Liệm", vibe: "hype", energy: 3, bpm: 140 },
  "track-13": { id: "track-13", trackNumber: 13, title: "Nếu Như Ta Chẳng Còn", vibe: "chill", energy: 1, bpm: 75 },
  "track-14": { id: "track-14", trackNumber: 14, title: "Ai Mới Là Kẻ Xấu Xa", vibe: "groove", energy: 2, bpm: 108 },
  "track-15": { id: "track-15", trackNumber: 15, title: "Slippery", vibe: "chill", energy: 1, bpm: 79 },
  "track-16": { id: "track-16", trackNumber: 16, title: "Intenpol", vibe: "hype", energy: 3, bpm: 132 },
  "track-17": { id: "track-17", trackNumber: 17, title: "Tây Thi", vibe: "groove", energy: 2, bpm: 98 },
  "track-18": { id: "track-18", trackNumber: 18, title: "Hút và Hút", vibe: "hype", energy: 3, bpm: 128 },
  "track-19": { id: "track-19", trackNumber: 19, title: "Dưa Chua", vibe: "groove", energy: 2, bpm: 105 },
  "track-20": { id: "track-20", trackNumber: 20, title: "Xa Xôi", vibe: "chill", energy: 1, bpm: 88 },
  "track-21": { id: "track-21", trackNumber: 21, title: "Che Phủ", vibe: "groove", energy: 2, bpm: 112 },
  "track-22": { id: "track-22", trackNumber: 22, title: "Oanh M = Thuoc", vibe: "hype", energy: 3, bpm: 134 },
  "track-23": { id: "track-23", trackNumber: 23, title: "Ghet Xog Lai Thik", vibe: "groove", energy: 2, bpm: 102 },
  "track-24": { id: "track-24", trackNumber: 24, title: "Nhìn Kẻ Thù Của Tao", vibe: "hype", energy: 3, bpm: 138 },
  "track-25": { id: "track-25", trackNumber: 25, title: "Envy", vibe: "hype", energy: 3, bpm: 142 },
  "track-26": { id: "track-26", trackNumber: 26, title: "Cảm Ơn", vibe: "chill", energy: 1, bpm: 82 },
  "track-27": { id: "track-27", trackNumber: 27, title: "Không Cần Lo Cho Tao", vibe: "groove", energy: 2, bpm: 96 },
  "track-28": { id: "track-28", trackNumber: 28, title: "Huh", vibe: "hype", energy: 3, bpm: 144 },
  "track-29": { id: "track-29", trackNumber: 29, title: "Nguyễn Văn Mười", vibe: "groove", energy: 2, bpm: 110 },
  "track-30": { id: "track-30", trackNumber: 30, title: "Thịt Lợn", vibe: "hype", energy: 3, bpm: 135 },
};

export function getTrackVibe(trackIdOrNumber: string | number): TrackVibeProfile | undefined {
  if (typeof trackIdOrNumber === "number") {
    const key = `track-${String(trackIdOrNumber).padStart(2, "0")}`;
    return TRACK_VIBES[key];
  }
  return TRACK_VIBES[trackIdOrNumber];
}
