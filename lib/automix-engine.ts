import { getTrackVibe, TrackVibeProfile } from "@/data/track-vibes";

export const DEFAULT_CROSSFADE_SECONDS = 5;

/**
 * Thuật toán Equal-Power Crossfade (chuẩn Spotify & DJ):
 * Đảm bảo tổng năng lượng âm thanh của 2 bài ở mọi mili-giây luôn đạt 100% (P_A + P_B = 1),
 * triệt tiêu hoàn toàn hiện tượng hụt âm lượng (volume drop) ở điểm giao nhau.
 *
 * @param progress Giá trị từ 0 (bắt đầu mix) đến 1 (kết thúc mix)
 */
export function calculateEqualPowerGains(progress: number): {
  outgoingGain: number;
  incomingGain: number;
} {
  const clamped = Math.max(0, Math.min(1, progress));
  const angle = (clamped * Math.PI) / 2;
  return {
    outgoingGain: Math.cos(angle),
    incomingGain: Math.sin(angle),
  };
}

export interface MinimalTrack {
  id: string;
  trackNumber?: number;
  title?: string;
}

/**
 * Thuật toán Smart DJ Selector:
 * Chọn bài hát tiếp theo có vibe và năng lượng tương thích nhất,
 * tạo cảm giác như một DJ đang dẫn dắt mạch cảm xúc không bị sốc nhịp.
 */
export function getSmartDJNextTrack<T extends MinimalTrack>(
  currentTrackId: string,
  playlist: T[],
  playedTrackIds: Set<string>
): { track: T; index: number } | null {
  if (!playlist.length) return null;
  if (playlist.length === 1) return { track: playlist[0], index: 0 };

  // Lọc các bài chưa nghe trong phiên hiện tại
  let candidates = playlist.filter(
    (t) => !playedTrackIds.has(t.id) && t.id !== currentTrackId
  );

  // Nếu đã nghe hết cả danh sách, reset để bắt đầu vòng mới
  if (candidates.length === 0) {
    candidates = playlist.filter((t) => t.id !== currentTrackId);
  }

  const currentVibe = getTrackVibe(currentTrackId) ?? {
    id: currentTrackId,
    trackNumber: 1,
    title: "",
    vibe: "groove",
    energy: 2,
    bpm: 100,
  };

  // Tính điểm tương thích cho từng bài ứng viên
  const scored = candidates.map((track) => {
    const vibe = getTrackVibe(track.id) ?? {
      id: track.id,
      trackNumber: track.trackNumber ?? 1,
      title: track.title ?? "",
      vibe: "groove",
      energy: 2,
      bpm: 100,
    };

    // 1. Độ lệch năng lượng (Energy Delta): 0 là hoàn hảo, 1 là chấp nhận được, 2 là chênh lệch lớn
    const energyDiff = Math.abs(vibe.energy - currentVibe.energy);
    const energyScore = energyDiff === 0 ? 40 : energyDiff === 1 ? 25 : 5;

    // 2. Độ gần BPM (Tempo match): Chênh lệch < 15 BPM được cộng điểm cao
    const bpmDiff = Math.abs(vibe.bpm - currentVibe.bpm);
    const bpmScore = Math.max(0, 30 - bpmDiff);

    // 3. Hệ số ngẫu hứng nhẹ (Jitter 0-15 điểm) để không bị cố định một thứ tự mỗi lần nghe
    const jitter = Math.random() * 15;

    const totalScore = energyScore + bpmScore + jitter;

    return { track, score: totalScore };
  });

  // Sắp xếp điểm tương thích cao nhất
  scored.sort((a, b) => b.score - a.score);

  // Chọn trong top 2 bài tốt nhất để tạo sự bất ngờ tự nhiên
  const topPoolSize = Math.min(2, scored.length);
  const pickedItem = scored[Math.floor(Math.random() * topPoolSize)];
  const pickedTrack = pickedItem.track;

  const targetIndex = playlist.findIndex((t) => t.id === pickedTrack.id);
  return { track: pickedTrack, index: Math.max(0, targetIndex) };
}
