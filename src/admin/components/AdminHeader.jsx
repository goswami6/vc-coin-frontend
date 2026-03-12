import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const searchItems = [
  { label: 'Dashboard', path: '/admin' },
  { label: 'Investment Plans', path: '/admin/plans' },
  { label: 'Investments', path: '/admin/investments' },
  { label: 'Deposits', path: '/admin/deposits' },
  { label: 'Marketplace', path: '/admin/marketplace' },
  { label: 'Withdrawals', path: '/admin/withdrawals' },
  { label: 'Users', path: '/admin/users' },
  { label: 'Transactions', path: '/admin/transactions' },
  { label: 'Analytics', path: '/admin/analytics' },
  { label: 'Reports', path: '/admin/reports' },
  { label: 'Notifications', path: '/admin/notifications' },
  { label: 'Enquiries', path: '/admin/enquiries' },
  { label: 'Settings', path: '/admin/settings' },
];

const AdminHeader = ({ user, onMenuClick }) => {
  const initial = user?.name?.charAt(0)?.toUpperCase() || 'A';
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef(null);

  const filtered = query.trim()
    ? searchItems.filter((item) =>
      item.label.toLowerCase().includes(query.toLowerCase())
    )
    : [];

  const handleSelect = (path) => {
    navigate(path);
    setQuery('');
    setShowResults(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-[#0f0a18]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between px-4 md:px-8 py-3.5">
        {/* Left: Menu + Search */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-white/50 hover:text-white transition-colors"
          >
            <Menu size={22} />
          </button>

          <div className="hidden sm:block relative" ref={wrapperRef}>
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2 gap-2 w-72">
              <Search size={16} className="text-white/30" />
              <input
                type="text"
                placeholder="Search pages..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowResults(true);
                }}
                onFocus={() => query.trim() && setShowResults(true)}
                className="bg-transparent text-sm text-white placeholder:text-white/20 outline-none w-full"
              />
            </div>

            {showResults && filtered.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-[#1a1228] border border-white/10 rounded-xl shadow-lg overflow-hidden z-50">
                {filtered.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleSelect(item.path)}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-all text-left"
                  >
                    <Search size={14} className="text-white/20" />
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-white leading-tight">{user?.name || 'Admin'}</p>
              <p className="text-xs text-purple font-medium flex items-center justify-end gap-1">
                <ShieldCheck size={12} /> Admin
              </p>
            </div>
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-purple to-cyan flex items-center justify-center text-white font-bold text-sm">
              {initial}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
