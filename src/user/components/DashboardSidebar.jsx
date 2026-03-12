import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  Users,
  History,
  Settings,
  LogOut,
  X,
  TrendingUp,
  Send,
  Store,
} from 'lucide-react';
import { clearToken } from '../../utils/api';
import logo from '../../assets/logo/logo.png';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Wallet', icon: Wallet, path: '/dashboard/wallet' },
  // { label: 'Deposit', icon: ArrowDownToLine, path: '/dashboard/deposit' },
  { label: 'Withdraw', icon: ArrowUpFromLine, path: '/dashboard/withdraw' },
  { label: 'Investments', icon: TrendingUp, path: '/dashboard/investments' },
  { label: 'Transfer', icon: Send, path: '/dashboard/transfer' },
  { label: 'Marketplace', icon: Store, path: '/dashboard/marketplace' },
  { label: 'Team', icon: Users, path: '/dashboard/team' },
  { label: 'Transactions', icon: History, path: '/dashboard/transactions' },
  { label: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

const DashboardSidebar = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#140e1f] border-r border-white/5 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <img src={logo} alt="VC Coin" className="w-9 h-9 rounded-lg object-contain" />
            <span className="text-xl font-black text-white tracking-tight">VC Coin</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/40 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto sidebar-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                  ? 'bg-green/10 text-green'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-400/10 w-full transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
