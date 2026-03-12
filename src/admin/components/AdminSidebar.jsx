import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Wallet,
  Settings,
  LogOut,
  X,
  BarChart3,
  FileText,
  BellRing,
  TrendingUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  Zap,
  Store,
  MessageSquare,
} from 'lucide-react';
import { clearToken } from '../../utils/api';
import logo from '../../assets/logo/logo.png';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Investment Plans', icon: TrendingUp, path: '/admin/plans' },
  { label: 'Investments', icon: Zap, path: '/admin/investments' },
  // { label: 'Deposits', icon: ArrowDownToLine, path: '/admin/deposits' },
  { label: 'Marketplace', icon: Store, path: '/admin/marketplace' },
  { label: 'Withdrawals', icon: ArrowUpFromLine, path: '/admin/withdrawals' },
  { label: 'Users', icon: Users, path: '/admin/users' },
  { label: 'Transactions', icon: Wallet, path: '/admin/transactions' },
  { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
  { label: 'Reports', icon: FileText, path: '/admin/reports' },
  { label: 'Notifications', icon: BellRing, path: '/admin/notifications' },
  { label: 'Enquiries', icon: MessageSquare, path: '/admin/enquiries' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

const AdminSidebar = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#0f0a18] border-r border-white/5 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <img src={logo} alt="VC Coin" className="w-9 h-9 rounded-lg object-contain" />
            <div>
              <span className="text-lg font-black text-white tracking-tight block leading-tight">VC Coin</span>
              <span className="text-[10px] font-semibold text-purple uppercase tracking-widest">Admin Panel</span>
            </div>
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
              end={item.path === '/admin'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                  ? 'bg-purple/10 text-purple'
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

export default AdminSidebar;
