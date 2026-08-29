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
      className="fixed inset-0 z-50 bg-[#050505] overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="min-h-screen text-[#f4f0eb] pb-24"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Topbar */}
        <header className="sticky top-0 z-50 w-full bg-[#070606]/95 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 py-3.5">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/favicon.svg" alt="HVL 30" className="w-8 h-8 rounded-lg border border-rose-600/30" />
              <strong className="text-base font-black tracking-tight text-white">HVL 30</strong>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-10 md:pt-16 space-y-16">
          {/* Hero Section with 3D Stack */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Copy */}
            <div className="lg:col-span-7 space-y-6">
              <p className="text-xs font-mono font-bold text-rose-500 uppercase tracking-widest">
                RPT MCK / ALBUM 2026
              </p>
              <h2 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white leading-none">
                <span>H</span><span className="text-rose-600 italic">V</span><span>L</span>
              </h2>
              <p className="text-lg md:text-2xl text-zinc-300 font-medium leading-relaxed max-w-xl">
                30 bài hát. 30 artwork. Một thế giới thị giác tối, lạnh và bùng lên bằng màu đỏ.
              </p>
              
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-400">
                <span>30 ca khúc</span>
                <span className="text-rose-600">/</span>
                <span>1 giờ 30 phút</span>
                <span className="text-rose-600">/</span>
                <span className="text-rose-400 font-bold">FLAC nguyên bản</span>
              </div>

              {/* External Links */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a 
                  href="https://open.spotify.com/album/36e3pjcLAYabHjXlaSmWOe" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-[#1ed760]" />
                  Spotify
                </a>
                <a 
                  href="https://www.youtube.com/playlist?list=PLG5bpInXG8Sc" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-[#ff4a3d]" />
                  YouTube
                </a>
              </div>
            </div>

            {/* 3D Stack Artworks */}
            <div className="lg:col-span-5 relative h-72 md:h-96 w-full flex items-center justify-center">
              <div className="relative w-full max-w-[340px] h-full">
                {/* Image 1 */}
                <div className="absolute top-0 right-0 w-[72%] aspect-[3/2] rounded-xl overflow-hidden shadow-2xl border border-white/15 rotate-6 z-10">
                  <Image src="/artwork/03.jpg" alt="HVL 03" fill className="object-cover" />
                </div>
                {/* Image 2 */}
                <div className="absolute top-1/4 left-0 w-[72%] aspect-[3/2] rounded-xl overflow-hidden shadow-2xl border border-white/15 -rotate-6 z-20">
                  <Image src="/artwork/12.jpg" alt="HVL 12" fill className="object-cover" />
                </div>
                {/* Image 3 */}
                <div className="absolute bottom-0 right-4 w-[72%] aspect-[3/2] rounded-xl overflow-hidden shadow-2xl border border-white/15 rotate-2 z-30">
                  <Image src="/artwork/18.jpg" alt="HVL 18" fill className="object-cover" />
                </div>
                {/* Giant 30 */}
                <strong className="absolute -bottom-4 right-0 z-40 text-7xl md:text-8xl font-black text-rose-600 tracking-tighter drop-shadow-2xl">
                  30
                </strong>
              </div>
            </div>
          </div>

          {/* Statement & Cultural Essay */}
          <div className="border-t border-white/10 pt-12 space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-mono font-bold text-rose-500 uppercase tracking-widest">
                MCK · HVL · VĂN HOÁ RAP
              </p>
              <h3 className="text-2xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
                Có những điều người trẻ chỉ biết nói ra bằng rap.
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-zinc-300 text-sm md:text-base leading-relaxed">
              <div className="lg:col-span-6 space-y-5">
                <p>
                  Có một nỗi ấm ức rất khó gọi tên trong người trẻ hôm nay. Họ được bảo phải ngoan hơn, bình thường hơn, dễ nghe hơn. Họ đi qua áp lực, cô đơn, tiền bạc, tình yêu và cảm giác không ai thật sự hiểu mình. Nhiều điều không thể kể với gia đình, không thể nói trong lớp học, cũng không vừa vặn với một dòng trạng thái đẹp đẽ. Rap trở thành nơi họ được phép nói thật, kể cả khi sự thật ấy xấu xí, vụng về và đầy vết xước.
                </p>
                <p>
                  Vì vậy, nỗi lo rap đang mất chất không chỉ nằm ở âm thanh. Nó nằm trong cảm giác mọi góc cạnh dần bị mài phẳng để vừa với thuật toán, nhãn hàng và những khuôn mẫu an toàn. Khi một tiếng nói từng thuộc về bên lề bước vào trung tâm, người nghe vừa tự hào vừa sợ rằng nó sẽ quên mất vì sao mình đã cất tiếng từ đầu.
                </p>
              </div>

              <div className="lg:col-span-6 space-y-5">
                <blockquote className="border-l-4 border-rose-600 pl-5 py-2 text-lg md:text-xl font-extrabold text-white italic">
                  "Nếu mọi điều khó chịu đều bị xoá đi, thứ còn lại có còn là lời thật của một thế hệ không?"
                </blockquote>
                
                <p>
                  HVL đặt MCK ngay giữa mâu thuẫn ấy. Album có bản năng, kiêu hãnh, sai lầm, những vết thương tình cảm và cả những câu chữ khiến công chúng phản ứng. Không phải câu nào cũng cần được bênh vực. Tự do biểu đạt không có nghĩa là đứng ngoài trách nhiệm. Nhưng với nhiều người nghe, việc một phần lớn album biến mất vẫn để lại cảm giác hụt hẫng, như một trang nhật ký vừa kịp đọc đã bị xé khỏi cuốn sách.
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-4">
              <p className="text-sm md:text-base text-zinc-200 leading-relaxed">
                <strong className="text-white font-bold">Điều đã xảy ra:</strong> Sau khi làm việc với cơ quan chức năng, MCK xin lỗi về ngôn từ chưa phù hợp và cho biết sẽ gỡ các bản ghi liên quan để chỉnh sửa trước khi cân nhắc phát hành lại. Ngày 31 tháng 7 năm 2026, 19 trong 30 bài không còn hiển thị, còn 11 bài được giữ lại trên YouTube Music. Sự việc không chỉ đặt câu hỏi cho riêng MCK. Nó buộc văn hoá rap Việt nhìn lại cách giữ bản sắc, bảo vệ không gian sáng tạo và đồng thời chịu trách nhiệm khi tiếng nói của mình đã chạm tới hàng triệu người.
              </p>
              <p className="text-rose-400 font-semibold text-sm md:text-base italic">
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
          </div>

          {/* 30 Artwork Gallery */}
          <div className="border-t border-white/10 pt-12 space-y-6">
            <div className="space-y-1">
              <p className="text-xs font-mono font-bold text-rose-500 uppercase tracking-widest">
                30 ARTWORK / 30 CA KHÚC
              </p>
              <h3 className="text-xl md:text-2xl font-black text-white">
                Danh sách album · Chạm vào để nghe
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {tracks.map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => {
                    playTrack(track);
                    onClose();
                  }}
                  className="group relative rounded-xl overflow-hidden aspect-[3/2] border border-white/10 hover:border-rose-500 transition-all text-left bg-zinc-900 cursor-pointer shadow-md"
                >
                  <Image 
                    src={track.artworkUrl} 
                    alt={track.title} 
                    fill 
                    sizes="(max-width: 768px) 50vw, 180px"
                    className="object-cover group-hover:scale-105 transition-transform" 
                  />
                  <span className="absolute top-1.5 left-1.5 text-[10px] font-mono font-bold bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-white border border-white/10">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 flex flex-col justify-end p-2 transition-opacity">
                    <span className="text-[11px] font-bold text-white truncate">{track.title}</span>
                    <span className="text-[9px] text-zinc-400 truncate">{track.artist}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Guest Artists & Footer */}
          <div className="border-t border-white/10 pt-10 text-center space-y-4">
            <p className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest">
              NHỮNG GIỌNG NÓI CÙNG XUẤT HIỆN
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-zinc-300">
              {['marzuz', 'Tage', 'A$AP Ướt Mi', 'Tùng Dương', 'Obito', 'THANHDRAW', 'RPT Orijinn'].map((name) => (
                <span key={name} className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  {name}
                </span>
              ))}
            </div>
            <p className="text-xs text-zinc-500 max-w-lg mx-auto pt-4">
              30 file FLAC được phát từ kho riêng của HVL 30, giữ nguyên định dạng và không cần tài khoản.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}