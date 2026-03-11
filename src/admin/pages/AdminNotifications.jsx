import React, { useState, useEffect } from 'react';
import {
  BellRing,
  ArrowDownToLine,
  ArrowUpFromLine,
  TrendingUp,
  UserPlus,
  ArrowLeftRight,
  Store,
  Loader2,
  AlertTriangle,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { api } from '../../utils/api';

const TYPE_CONFIG = {
  deposit: { icon: ArrowDownToLine, color: 'text-green', bg: 'bg-green/10', label: 'Deposit' },
  withdrawal: { icon: ArrowUpFromLine, color: 'text-red-400', bg: 'bg-red-400/10', label: 'Withdrawal' },
  investment: { icon: TrendingUp, color: 'text-cyan', bg: 'bg-cyan/10', label: 'Investment' },
  registration: { icon: UserPlus, color: 'text-purple', bg: 'bg-purple/10', label: 'Registration' },
  transfer: { icon: ArrowLeftRight, color: 'text-blue', bg: 'bg-blue/10', label: 'Transfer' },
  marketplace: { icon: Store, color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'Marketplace' },
};

const STATUS_BADGE = {
  pending: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
  approved: 'bg-green/10 text-green border-green/20',
  rejected: 'bg-red-400/10 text-red-400 border-red-400/20',
  completed: 'bg-green/10 text-green border-green/20',
  active: 'bg-cyan/10 text-cyan border-cyan/20',
  cancelled: 'bg-white/5 text-white/40 border-white/10',
};

const fmt = (n) => Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

const timeAgo = (dateStr) => {
  const now = new Date();
  const d = new Date(dateStr);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
};

const buildMessage = (n) => {
  switch (n.type) {
    case 'deposit':
      return <><strong className="text-white">{n.name}</strong> {n.status === 'pending' ? 'requested' : n.status} a deposit of <strong className="text-white">₹{fmt(n.amount)}</strong></>;
    case 'withdrawal':
      return <><strong className="text-white">{n.name}</strong> {n.status === 'pending' ? 'requested' : n.status} a withdrawal of <strong className="text-white">₹{fmt(n.amount)}</strong></>;
    case 'investment':
      return <><strong className="text-white">{n.name}</strong> invested <strong className="text-white">₹{fmt(n.amount)}</strong> in {n.plan_name || 'a plan'}</>;
    case 'registration':
      return <><strong className="text-white">{n.name}</strong> created a new account</>;
    case 'transfer':
      return <><strong className="text-white">{n.sender_name}</strong> transferred <strong className="text-white">₹{fmt(n.amount)}</strong> to <strong className="text-white">{n.receiver_name}</strong></>;
    case 'marketplace':
      return <><strong className="text-white">{n.seller_name}</strong> listed a sell order of <strong className="text-white">₹{fmt(n.amount)}</strong>{n.buyer_name ? <> — bought by <strong className="text-white">{n.buyer_name}</strong></> : ''}</>;
    default:
      return 'Unknown activity';
  }
};

const AdminNotifications = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [pending, setPending] = useState({ deposits: 0, withdrawals: 0, marketplace: 0 });
  const [filter, setFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (showRefresh) => {
    if (showRefresh) setRefreshing(true);
    try {
      const data = await api.getAdminNotifications(100);
      setNotifications(data.notifications || []);
      setPending(data.pending || {});
    } catch { /* ignored */ }
    finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = filter === 'all'
    ? notifications
    : filter === 'pending'
      ? notifications.filter(n => n.status === 'pending')
      : notifications.filter(n => n.type === filter);

  const totalPending = (pending.deposits || 0) + (pending.withdrawals || 0) + (pending.marketplace || 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-green" />
      </div>
    );
  }

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: `Pending${totalPending ? ` (${totalPending})` : ''}` },
    { key: 'deposit', label: 'Deposits' },
    { key: 'withdrawal', label: 'Withdrawals' },
    { key: 'investment', label: 'Investments' },
    { key: 'registration', label: 'Signups' },
    { key: 'transfer', label: 'Transfers' },
    { key: 'marketplace', label: 'Marketplace' },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple/20 to-cyan/20 flex items-center justify-center">
              <BellRing size={20} className="text-purple" />
            </div>
            Notifications
          </h1>
          <p className="text-white/40 text-sm mt-1 ml-13">Recent platform activity feed</p>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Pending Alerts */}
      {totalPending > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {pending.deposits > 0 && (
            <div className="flex items-center gap-3 bg-yellow-400/4 border border-yellow-400/10 rounded-xl px-4 py-3">
              <AlertTriangle size={16} className="text-yellow-400 shrink-0" />
              <div>
                <p className="text-xs text-white/50">Pending Deposits</p>
                <p className="text-sm font-bold text-yellow-400">{pending.deposits}</p>
              </div>
            </div>
          )}
          {pending.withdrawals > 0 && (
            <div className="flex items-center gap-3 bg-yellow-400/4 border border-yellow-400/10 rounded-xl px-4 py-3">
              <AlertTriangle size={16} className="text-yellow-400 shrink-0" />
              <div>
                <p className="text-xs text-white/50">Pending Withdrawals</p>
                <p className="text-sm font-bold text-yellow-400">{pending.withdrawals}</p>
              </div>
            </div>
          )}
          {pending.marketplace > 0 && (
            <div className="flex items-center gap-3 bg-yellow-400/4 border border-yellow-400/10 rounded-xl px-4 py-3">
              <AlertTriangle size={16} className="text-yellow-400 shrink-0" />
              <div>
                <p className="text-xs text-white/50">Pending Marketplace</p>
                <p className="text-sm font-bold text-yellow-400">{pending.marketplace}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f.key
              ? 'bg-purple/15 text-purple border border-purple/20'
              : 'bg-white/5 text-white/40 border border-white/5 hover:text-white/60 hover:bg-white/7'
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-1">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-white/20">
            <BellRing size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No notifications found</p>
          </div>
        ) : (
          filtered.map((n, i) => {
            const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.deposit;
            const Icon = cfg.icon;
            return (
              <div
                key={`${n.type}-${n.id}-${i}`}
                className="flex items-start gap-3 px-4 py-3.5 rounded-xl hover:bg-white/3 transition-all group"
              >
                {/* Icon */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                  <Icon size={16} className={cfg.color} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/60 leading-relaxed">
                    {buildMessage(n)}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-white/25 flex items-center gap-1">
                      <Clock size={9} /> {timeAgo(n.time)}
                    </span>
                    {n.status && (
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${STATUS_BADGE[n.status] || 'bg-white/5 text-white/40 border-white/10'}`}>
                        {n.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
