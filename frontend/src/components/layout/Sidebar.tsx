import { BookOpen, Gamepad2, LayoutDashboard, Puzzle, User, LogOut, ChevronLeft } from 'lucide-react';
import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';

export function Sidebar() {
  const { user, logout } = useAuthStore();

  return (
    <aside className="w-64 fixed h-screen left-0 bg-neutral-900 border-r border-neutral-800 p-4 flex flex-col z-20">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <span className="text-neutral-900 font-bold text-lg font-outfit">V</span>
        </div>
        <span className="text-xl font-outfit font-bold text-white tracking-wide">
          VANTAGE<span className="text-cyan-400">CHESS</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        <SidebarItem icon={<LayoutDashboard />} label="Trang chủ" active />
        <SidebarItem icon={<Gamepad2 />} label="Chơi ngay" />
        <SidebarItem icon={<Puzzle />} label="Bài tập" />
        <SidebarItem icon={<BookOpen />} label="Khóa học" />
        <div className="my-4 border-t border-neutral-800/50 pt-4" />
        <SidebarItem icon={<User />} label="Hồ sơ" />
      </nav>

      <button className="flex items-center gap-2 px-4 py-2 mt-auto mb-4 text-sm text-neutral-400 hover:text-white transition-colors border border-neutral-800 rounded-lg hover:bg-neutral-800">
        <ChevronLeft className="w-4 h-4" />
        <span>Thu gọn</span>
      </button>

      {/* User Info */}
      <div className="pt-4 border-t border-neutral-800">
        <div className="flex items-center justify-between px-2 py-2 group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-neutral-900 font-bold shadow-lg">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-sm font-semibold text-white truncate max-w-[100px]">{user?.username || 'Guest User'}</p>
              <p className="text-xs font-medium text-cyan-400">{user?.elo || 1200} ELO</p>
            </div>
          </div>
          <button onClick={logout} className="text-neutral-500 hover:text-red-400 transition-colors p-2 opacity-0 group-hover:opacity-100" title="Đăng xuất">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <a href="#" className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${active ? 'bg-cyan-500/10 text-cyan-400' : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'}`}>
      {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
      <span className="font-medium text-sm">{label}</span>
    </a>
  );
}
