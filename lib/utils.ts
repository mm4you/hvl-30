import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function formatDurationDetailed(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0 phút";
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours} giờ ${mins} phút`;
  }
  return `${mins} phút`;
}

export function formatFileSize(bytes?: number): string {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

export function parseLrcTime(timeStr: string): number {
  const match = timeStr.match(/(?:\[)?(\d{2}):(\d{2})(?:\.(\d{2,3}))?(?:\])?/);
  if (!match) return 0;
  const mins = parseInt(match[1], 10);
  const secs = parseInt(match[2], 10);
  const ms = match[3] ? parseInt(match[3].padEnd(3, "0").slice(0, 3), 10) / 1000 : 0;
  return mins * 60 + secs + ms;
}
