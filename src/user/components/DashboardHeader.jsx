import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';

const DashboardHeader = ({ user, onMenuClick }) => {
  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-30 bg-[#140e1f]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between px-4 md:px-8 py-3.5">
        {/* Left: Menu + Search */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-white/50 hover:text-white transition-colors"
          >
            <Menu size={22} />
          </button>

          <div className="hidden sm:flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2 gap-2 w-64">
            <Search size={16} className="text-white/30" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-white placeholder:text-white/20 outline-none w-full"
            />
          </div>
        </div>

        {/* Right: Notification + User */}
        <div className="flex items-center gap-4">
          <button className="relative text-white/50 hover:text-white transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green rounded-full"></span>
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-white leading-tight">{user?.name || 'User'}</p>
              <p className="text-xs text-white/40">{user?.email || user?.mobile || ''}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-green to-cyan flex items-center justify-center text-bg-dark font-bold text-sm">
              {initial}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
