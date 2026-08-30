"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import type { SyncedLyricLine } from "@/data/lyrics/types";

type LyricShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  trackTitle: string;
  trackArtist: string;
  artworkUrl: string;
  syncedLyrics: SyncedLyricLine[];
  currentActiveLine?: string;
};

export const LyricShareModal: React.FC<LyricShareModalProps> = ({
  isOpen,
  onClose,
  trackTitle,
  trackArtist,
  artworkUrl,
  syncedLyrics,
  currentActiveLine,
}) => {
  // Filter out section headers like [Verse 1], [Chorus]
  const validLyrics = syncedLyrics.filter(
    (l) => l.text.trim() && !l.text.trim().startsWith("["),
  );

  const initialLine = currentActiveLine && !currentActiveLine.startsWith("[")
    ? currentActiveLine
    : (validLyrics[0]?.text || "HVL - RPT MCK");

  const [selectedLines, setSelectedLines] = useState<string[]>([initialLine]);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentActiveLine && !currentActiveLine.startsWith("[")) {
      setSelectedLines([currentActiveLine]);
    }
  }, [currentActiveLine]);

  if (!isOpen) return null;

  const toggleLine = (text: string) => {
    if (selectedLines.includes(text)) {
      if (selectedLines.length > 1) {
        setSelectedLines(selectedLines.filter((l) => l !== text));
      }
    } else {
      if (selectedLines.length < 4) {
        setSelectedLines([...selectedLines, text]);
      }
    }
  };

  // Generate 1080x1350 (4:5) canvas
  const generateCanvas = async (): Promise<HTMLCanvasElement> => {
    const width = 1080;
    const height = 1350;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context failed");

    // 1. Background Gradient (Dark brutalist with subtle red ambient depth)
    const bgGrad = ctx.createRadialGradient(
      width * 0.5, height * 0.4, 100,
      width * 0.5, height * 0.5, 900,
    );
    bgGrad.addColorStop(0, "#1c0a08");
    bgGrad.addColorStop(0.45, "#0e0606");
    bgGrad.addColorStop(1, "#050303");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Decorative subtle ambient glow in bottom left & top right
    const glow1 = ctx.createRadialGradient(width * 0.2, height * 0.8, 0, width * 0.2, height * 0.8, 450);
    glow1.addColorStop(0, "rgba(255, 55, 35, 0.15)");
    glow1.addColorStop(1, "transparent");
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, width, height);

    // Card Inner Frame (Rounded 48px)
    ctx.save();
    ctx.strokeStyle = "rgba(255, 55, 35, 0.22)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(40, 40, width - 80, height - 80, 48);
    ctx.stroke();
    ctx.restore();

    // 2. Track Artwork (Top Left Header)
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // continue even if image fails
        img.src = artworkUrl;
      });

      if (img.width > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(100, 100, 150, 150, 24);
        ctx.clip();
        ctx.drawImage(img, 100, 100, 150, 150);
        ctx.restore();

        // Artwork border glow
        ctx.save();
        ctx.strokeStyle = "rgba(255, 55, 35, 0.5)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(100, 100, 150, 150, 24);
        ctx.stroke();
        ctx.restore();
      }
    } catch {
      // Fallback
    }

    // 3. Track Info (Title & Artist)
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 52px system-ui, -apple-system, sans-serif";
    ctx.fillText(trackTitle, 280, 160);

    ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
    ctx.font = "500 36px system-ui, -apple-system, sans-serif";
    ctx.fillText(`${trackArtist || "RPT MCK"} · HVL`, 280, 218);

    // 4. Quote Mark / Decorative Accent
    ctx.fillStyle = "#FF3725";
    ctx.font = "900 80px serif";
    ctx.fillText("“", 100, 360);

    // 5. Lyric Text (Editorial Typography)
    ctx.fillStyle = "#f4efe9";
    const fontSize = selectedLines.length > 2 ? 50 : 62;
    const lineHeight = fontSize * 1.45;
    ctx.font = `800 ${fontSize}px system-ui, -apple-system, sans-serif`;

    let startY = 460;
    const maxWidth = width - 200;

    for (const line of selectedLines) {
      // Word wrap
      const words = line.split(" ");
      let currentLineText = "";

      for (let n = 0; n < words.length; n++) {
        const testLine = currentLineText + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(currentLineText, 100, startY);
          currentLineText = words[n] + " ";
          startY += lineHeight;
        } else {
          currentLineText = testLine;
        }
      }
      ctx.fillText(currentLineText, 100, startY);
      startY += lineHeight + 28;
    }

    // 6. Footer (HVL Logo & Watermark)
    const footerY = height - 120;

    // Draw HVL Red Monogram Logo manually on canvas
    ctx.save();
    ctx.fillStyle = "#FF3725";
    // Scale and translate for HVL
    ctx.translate(100, footerY - 45);
    const scale = 0.35;
    ctx.scale(scale, scale);
    // H
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(48, 0); ctx.lineTo(48, 76); ctx.lineTo(96, 76);
    ctx.lineTo(96, 0); ctx.lineTo(144, 0); ctx.lineTo(144, 180); ctx.lineTo(96, 180);
    ctx.lineTo(96, 132); ctx.lineTo(48, 132); ctx.lineTo(48, 180); ctx.lineTo(0, 180);
    ctx.closePath();
    ctx.fill();
    // V
    ctx.beginPath();
    ctx.moveTo(154, 0); ctx.lineTo(200, 0); ctx.lineTo(234, 122); ctx.lineTo(268, 0);
    ctx.lineTo(314, 0); ctx.lineTo(258, 180); ctx.lineTo(210, 180); ctx.closePath();
    ctx.fill();
    // L
    ctx.beginPath();
    ctx.moveTo(322, 0); ctx.lineTo(368, 0); ctx.lineTo(368, 132); ctx.lineTo(416, 132);
    ctx.lineTo(416, 180); ctx.lineTo(322, 180); ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Right footer note
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.font = "600 28px system-ui, -apple-system, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("hvl-30.vercel.app", width - 100, footerY);

    return canvas;
  };

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const canvas = await generateCanvas();
      const link = document.createElement("a");
      link.download = `HVL-${trackTitle.replace(/\s+/g, "_")}-quote.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch {
      alert("Không thể tạo ảnh, vui lòng thử lại!");
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopy = async () => {
    setIsExporting(true);
    try {
      const canvas = await generateCanvas();
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } catch {
          handleDownload();
        }
      }, "image/png");
    } catch {
      handleDownload();
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    setIsExporting(true);
    try {
      const canvas = await generateCanvas();
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `HVL-${trackTitle}.png`, { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `${trackTitle} - RPT MCK`,
            text: selectedLines.join("\n"),
          });
        } else {
          handleDownload();
        }
      }, "image/png");
    } catch {
      handleDownload();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <section
        aria-labelledby="lyric-share-title"
        aria-modal="true"
        className="install-dialog lyric-share-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <button
          aria-label="Đóng"
          className="dialog-close"
          onClick={onClose}
          type="button"
        >
          ✕
        </button>

        <h2 id="lyric-share-title" style={{ fontSize: "21px", letterSpacing: "-0.03em" }}>
          Thẻ Trích Dẫn Câu Rap
        </h2>
        <p className="dialog-copy" style={{ margin: "6px 0 16px" }}>
          Tỉ lệ 4:5 chuẩn mạng xã hội. Chọn tối đa 3 câu để tạo ảnh.
        </p>

        {/* 4:5 Aspect Ratio Card Preview */}
        <div className="lyric-card-stage">
          <div className="lyric-card-preview" ref={cardRef}>
            <div className="lyric-card-header">
              <img src={artworkUrl} alt={trackTitle} className="lyric-card-art" />
              <div className="lyric-card-info">
                <strong>{trackTitle}</strong>
                <span>{trackArtist || "RPT MCK"} · HVL</span>
              </div>
            </div>

            <div className="lyric-card-quote">
              <span className="quote-mark">“</span>
              {selectedLines.map((line, idx) => (
                <p key={idx} className="quote-line">{line}</p>
              ))}
            </div>

            <div className="lyric-card-footer">
              <img src="/hvl-logo.svg" alt="HVL" className="lyric-card-logo" />
              <span className="lyric-card-url">hvl-30.vercel.app</span>
            </div>
          </div>
        </div>

        {/* Line selector list */}
        <div className="lyric-selector-container">
          <div className="selector-header-row">
            <span className="selector-hint">Chọn câu rap muốn đưa vào ảnh:</span>
            <span className="selector-count">{selectedLines.length}/3 câu</span>
          </div>
          <div className="lyric-selector-list">
            {validLyrics.map((l, i) => {
              const isSelected = selectedLines.includes(l.text);
              return (
                <button
                  key={i}
                  type="button"
                  className={`lyric-pick-item ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleLine(l.text)}
                >
                  <span className="pick-checkbox">{isSelected ? "✓" : ""}</span>
                  <span className="pick-text">{l.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Unified Action Buttons */}
        <div className="lyric-share-actions">
          <button className="share-btn secondary" onClick={handleCopy} disabled={isExporting} type="button">
            <span>{copied ? "Đã sao chép" : "Sao chép ảnh"}</span>
          </button>
          <button className="share-btn primary" onClick={handleDownload} disabled={isExporting} type="button">
            <span>{isExporting ? "Đang tạo ảnh..." : "Tải ảnh về máy"}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
