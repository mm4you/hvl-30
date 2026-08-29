"use client";

import React from "react";
import Image from "next/image";
import { usePlayer } from "@/context/PlayerContext";
import { X, ExternalLink } from "lucide-react";

export function AboutModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { tracks, playTrack } = usePlayer();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 md:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-[#0e0c0c] border border-white/15 rounded-3xl p-6 md:p-10 shadow-2xl my-auto text-[#f4f0eb] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="HVL 30" className="w-8 h-8 rounded-lg" />
            <strong className="text-lg font-black tracking-tight">HVL 30</strong>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="flex-1 text-center md:text-left">
            <p className="text-xs font-mono font-semibold text-rose-500 tracking-wider mb-1">RPT MCK / ALBUM 2026</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-3">
              <span>H</span><span className="text-rose-500 italic">V</span><span>L</span>
            </h2>
            <p className="text-sm text-zinc-300 mb-4 leading-relaxed">
              30 bài hát. 30 artwork. Một thế giới thị giác tối, lạnh và bùng lên bằng màu đỏ.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-3 text-xs text-zinc-400 font-medium">
              <span>30 ca khúc</span>
              <span>•</span>
              <span>1 giờ 30 phút</span>
              <span>•</span>
              <span className="text-rose-400 font-semibold">FLAC nguyên bản</span>
            </div>
          </div>

          <div className="relative w-36 h-36 rounded-2xl overflow-hidden shadow-2xl border border-white/20 flex-shrink-0">
            <Image src="/artwork/01.jpg" alt="HVL" fill className="object-cover" />
          </div>
        </div>

        {/* Statement / Essay */}
        <div className="space-y-4 border-t border-b border-white/10 py-6 my-6 text-sm text-zinc-300 leading-relaxed">
          <p className="text-xs font-mono text-rose-500 font-bold uppercase tracking-wider">MCK · HVL · VĂN HOÁ RAP</p>
          <h3 className="text-xl md:text-2xl font-black text-white">Có những điều người trẻ chỉ biết nói ra bằng rap.</h3>
          
          <p>
            Có một nỗi ấm ức rất khó gọi tên trong người trẻ hôm nay. Họ được bảo phải ngoan hơn, bình thường hơn, dễ nghe hơn. Họ đi qua áp lực, cô đơn, tiền bạc, tình yêu và cảm giác không ai thật sự hiểu mình. Nhiều điều không thể kể với gia đình, không thể nói trong lớp học, cũng không vừa vặn với một dòng trạng thái đẹp đẽ. Rap trở thành nơi họ được phép nói thật, kể cả khi sự thật ấy xấu xí, vụng về và đầy vết xước.
          </p>
          <p>
            Vì vậy, nỗi lo rap đang mất chất không chỉ nằm ở âm thanh. Nó nằm trong cảm giác mọi góc cạnh dần bị mài phẳng để vừa với thuật toán, nhãn hàng và những khuôn mẫu an toàn. Khi một tiếng nói từng thuộc về bên lề bước vào trung tâm, người nghe vừa tự hào vừa sợ rằng nó sẽ quên mất vì sao mình đã cất tiếng từ đầu.
          </p>
          
          <blockquote className="border-l-2 border-rose-500 pl-4 py-1 my-4 text-base font-bold text-white italic">
            "Nếu mọi điều khó chịu đều bị xoá đi, thứ còn lại có còn là lời thật của một thế hệ không?"
          </blockquote>

          <p>
            HVL đặt MCK ngay giữa mâu thuẫn ấy. Album có bản năng, kiêu hãnh, sai lầm, những vết thương tình cảm và cả những câu chữ khiến công chúng phản ứng. Không phải câu nào cũng cần được bênh vực. Tự do biểu đạt không có nghĩa là đứng ngoài trách nhiệm. Nhưng với nhiều người nghe, việc một phần lớn album biến mất vẫn để lại cảm giác hụt hẫng, như một trang nhật ký vừa kịp đọc đã bị xé khỏi cuốn sách.
          </p>
          <p>
            <strong className="text-white">Điều đã xảy ra:</strong> sau khi làm việc với cơ quan chức năng, MCK xin lỗi về ngôn từ chưa phù hợp và cho biết sẽ gỡ các bản ghi liên quan để chỉnh sửa trước khi cân nhắc phát hành lại. Ngày 31 tháng 7 năm 2026, 19 trong 30 bài không còn hiển thị, còn 11 bài được giữ lại trên YouTube Music. Sự việc không chỉ đặt câu hỏi cho riêng MCK. Nó buộc văn hoá rap Việt nhìn lại cách giữ bản sắc, bảo vệ không gian sáng tạo và đồng thời chịu trách nhiệm khi tiếng nói của mình đã chạm tới hàng triệu người.
          </p>
          <p className="text-rose-400 font-semibold italic">
            Một album có thể được chỉnh sửa. Một nghệ sĩ có thể nhận sai. Nhưng những đối thoại mà HVL mở ra không nên biến mất cùng nút gỡ bài.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs">
            <a 
              href="https://vov.vn/giai-tri/mck-xin-loi-thong-bao-go-bo-cac-noi-dung-khong-phu-hop-trong-album-moi-post1320186.vov" 
              target="_blank" 
              rel="noreferrer"
              className="text-zinc-400 hover:text-rose-400 flex items-center gap-1 underline"
            >
              Thông báo và hướng khắc phục <ExternalLink className="w-3 h-3" />
            </a>
            <a 
              href="https://kenh14.vn/19-bai-hat-bi-go-cua-mck-215260731173623501.chn" 
              target="_blank" 
              rel="noreferrer"
              className="text-zinc-400 hover:text-rose-400 flex items-center gap-1 underline"
            >
              Danh sách 19 bài bị ẩn <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* 30 Artwork Gallery */}
        <div className="mb-6">
          <div className="mb-4">
            <p className="text-xs font-mono text-rose-500 font-bold uppercase">30 ARTWORK / 30 CA KHÚC</p>
            <h3 className="text-lg font-bold text-white">Chạm vào một artwork để nghe bài đó</h3>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-2.5">
            {tracks.map((track, index) => (
              <button
                key={track.id}
                onClick={() => {
                  playTrack(track);
                  onClose();
                }}
                className="group relative rounded-xl overflow-hidden aspect-square border border-white/10 hover:border-rose-500 transition-all text-left"
              >
                <Image src={track.artworkUrl} alt={track.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                <span className="absolute top-1 left-1 text-[10px] font-mono font-bold bg-black/80 px-1.5 py-0.5 rounded text-white">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center p-1 text-[10px] text-center font-bold text-white transition-opacity">
                  {track.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured artists */}
        <div className="text-center pt-4 border-t border-white/10">
          <p className="text-xs text-zinc-400 mb-2">NHỮNG GIỌNG NÓI CÙNG XUẤT HIỆN</p>
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-zinc-300">
            {['marzuz', 'Tage', 'A$AP Ướt Mi', 'Tùng Dương', 'Obito', 'THANHDRAW', 'RPT Orijinn'].map((name) => (
              <span key={name} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                {name}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-zinc-500 mt-4">
            30 file FLAC được phát từ kho riêng của HVL 30, giữ nguyên định dạng và không cần tài khoản.
          </p>
        </div>
      </div>
    </div>
  );
}