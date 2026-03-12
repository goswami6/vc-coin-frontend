import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Home, LogOut } from 'lucide-react';
import { clearToken } from '../../utils/api';

const DashboardHeader = ({ user, onMenuClick }) => {
  const initial = user?.name?.charAt(0)?.toUpperCase() || 'U';
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-30 bg-[#140e1f]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between px-4 md:px-8 py-3.5">
        {/* Left: Menu + Home Link */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-white/50 hover:text-white transition-colors"
          >
            <Menu size={22} />
          </button>

          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
          >
            <Home size={15} />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </div>

        {/* Right: Logout + User */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-sm font-medium"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Logout</span>
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
