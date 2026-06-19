import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Zap, Cpu, Swords, ChevronRight, Trophy, Puzzle, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  const { user } = useAuthStore();

  return (
    <div className="flex-1 ml-64 mr-80 p-4 md:p-8 flex flex-col gap-8 h-screen overflow-y-auto bg-neutral-900 scrollbar-hide">
      
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-outfit font-bold text-white mb-1">
            Chào mừng trở lại, {user?.username || 'Kỳ thủ'}!
          </h1>
          <p className="text-neutral-400 font-medium">Bạn muốn chơi gì hôm nay?</p>
        </div>
      </header>

      {/* Quick Play Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <PlayCard 
          icon={<Zap className="w-8 h-8 text-yellow-400" />}
          title="1 min"
          subtitle="Bullet"
          bgClass="bg-gradient-to-br from-neutral-800 to-neutral-800 hover:from-neutral-700 hover:to-neutral-800 border-yellow-500/20 hover:border-yellow-500/50"
        />
        <PlayCard 
          icon={<Zap className="w-8 h-8 text-yellow-400" />}
          title="3 min"
          subtitle="Blitz"
          bgClass="bg-gradient-to-br from-neutral-800 to-neutral-800 hover:from-neutral-700 hover:to-neutral-800 border-yellow-500/20 hover:border-yellow-500/50"
        />
        <PlayCard 
          icon={<Zap className="w-8 h-8 text-cyan-400" />}
          title="10 min"
          subtitle="Rapid"
          bgClass="bg-gradient-to-br from-neutral-800 to-neutral-800 hover:from-cyan-900/20 hover:to-neutral-800 border-cyan-500/20 hover:border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]"
        />
        <PlayCard 
          icon={<Cpu className="w-8 h-8 text-emerald-400" />}
          title="Đấu với Máy"
          subtitle="Stockfish 16"
          bgClass="bg-gradient-to-br from-neutral-800 to-neutral-800 hover:from-emerald-900/20 hover:to-neutral-800 border-emerald-500/20 hover:border-emerald-500/50"
        />
        <PlayCard 
          icon={<Swords className="w-8 h-8 text-purple-400" />}
          title="Custom Game"
          subtitle="Tạo phòng chơi"
          bgClass="bg-gradient-to-br from-neutral-800 to-neutral-800 hover:from-purple-900/20 hover:to-neutral-800 border-purple-500/20 hover:border-purple-500/50"
        />
      </section>

      {/* Middle Section: Puzzles & Dashboard */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 pb-8">
        
        {/* Left Col (2 span): Puzzles & Activity */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-neutral-800/50 rounded-2xl border border-neutral-700/50 p-6 flex flex-col sm:flex-row gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[40px] pointer-events-none" />
            
            <div className="w-32 h-32 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0">
               {/* Giả lập bàn cờ puzzle nhỏ */}
               <Puzzle className="w-12 h-12 text-cyan-500" />
            </div>
            <div className="flex-1 flex flex-col justify-center relative z-10">
              <span className="text-cyan-400 font-bold text-sm mb-1 uppercase tracking-wider">Câu đố trong ngày</span>
              <h3 className="text-2xl font-bold text-white mb-2">Trắng đi trước, chiếu hết trong 2 nước</h3>
              <p className="text-neutral-400 mb-4 text-sm">Cải thiện tư duy chiến thuật với câu đố hàng ngày được chọn lọc từ các ván đấu thực tế.</p>
              <div>
                <button className="bg-cyan-500 hover:bg-cyan-400 text-neutral-900 font-bold px-6 py-2 rounded-lg transition-colors inline-flex items-center gap-2">
                  Giải ngay <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Recent Games */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-neutral-400" /> Ván đấu gần đây
              </h2>
              <Link to="/profile" className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">Xem tất cả</Link>
            </div>
            <div className="bg-neutral-800/50 rounded-xl border border-neutral-700/50 overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-4 gap-4 p-4 border-b border-neutral-700/50 text-sm font-semibold text-neutral-400">
                <div className="col-span-2">Đối thủ</div>
                <div>Kết quả</div>
                <div>Chế độ</div>
              </div>
              {/* Row 1 */}
              <div className="grid grid-cols-4 gap-4 p-4 border-b border-neutral-700/50 items-center hover:bg-neutral-800 transition-colors cursor-pointer">
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-neutral-700 flex items-center justify-center text-xs font-bold text-white">GM</div>
                  <span className="text-white font-medium">Hikaru Nakamura</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-emerald-500 font-bold">Thắng</span>
                </div>
                <div className="text-neutral-400 text-sm font-medium">10 min</div>
              </div>
               {/* Row 2 */}
               <div className="grid grid-cols-4 gap-4 p-4 items-center hover:bg-neutral-800 transition-colors cursor-pointer">
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-neutral-700 flex items-center justify-center text-xs font-bold text-white">GM</div>
                  <span className="text-white font-medium">Magnus Carlsen</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <span className="text-red-500 font-bold">Thua</span>
                </div>
                <div className="text-neutral-400 text-sm font-medium">3 min</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Stats / Courses */}
        <div className="space-y-6">
          {/* Rating Card */}
          <div className="bg-neutral-800/50 rounded-2xl border border-neutral-700/50 p-6 relative overflow-hidden">
            <h2 className="text-lg font-bold text-white mb-6">Thống kê ELO</h2>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-neutral-400 text-sm mb-1 font-medium">Cờ nhanh (Rapid)</div>
                  <div className="text-4xl font-outfit font-bold text-white">{user?.elo || 1200}</div>
                </div>
                <div className="text-emerald-500 text-sm font-bold flex items-center bg-emerald-500/10 px-2 py-1 rounded">
                  +12 hôm nay
                </div>
              </div>
              {/* Fake chart */}
              <div className="h-16 w-full flex items-end gap-1 opacity-80 pt-4">
                {[40, 45, 30, 50, 60, 55, 70, 80].map((h, i) => (
                  <div key={i} className="flex-1 bg-cyan-500/20 rounded-t-sm transition-all hover:bg-cyan-500/40" style={{ height: `${h}%` }}>
                    <div className="w-full bg-cyan-400 h-1 rounded-t-sm shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Active Courses Teaser */}
          <div className="bg-gradient-to-b from-neutral-800/50 to-neutral-900/50 rounded-2xl border border-neutral-700/50 p-6 text-center">
             <div className="w-12 h-12 bg-neutral-800 rounded-full mx-auto flex items-center justify-center mb-4 border border-neutral-700">
               <BookOpen className="w-6 h-6 text-cyan-400" />
             </div>
             <h3 className="text-lg font-bold text-white mb-2">Tiếp tục học tập</h3>
             <p className="text-sm text-neutral-400 mb-4">Bạn chưa tham gia khóa học nào. Khám phá thư viện ngay.</p>
             <Link to="/courses" className="text-cyan-400 font-bold text-sm hover:text-cyan-300 transition-colors">
               Khám phá Khóa học &rarr;
             </Link>
          </div>
        </div>
        
      </section>
    </div>
  );
}

function PlayCard({ icon, title, subtitle, bgClass }: { icon: React.ReactNode, title: string, subtitle: string, bgClass: string }) {
  return (
    <Link 
      to="/play" 
      className={`group p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-2 ${bgClass}`}
    >
      <div className="transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
        {icon}
      </div>
      <div className="text-xl font-outfit font-bold text-white mt-2">{title}</div>
      <div className="text-neutral-400 text-sm font-medium">{subtitle}</div>
    </Link>
  );
}
