import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  Users,
  Wallet,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  ArrowDownToLine,
  ArrowUpFromLine,
  Coins,
  AlertTriangle,
  Clock,
  Store,
  Loader2,
  IndianRupee,
} from 'lucide-react';
import { api } from '../../utils/api';

const fmt = (n) => Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

const StatCard = ({ icon, label, value, sub, color, badge }) => {
  const Icon = icon;
  return (
    <div className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
        {badge && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badge.class}`}>
            {badge.text}
          </span>
        )}
      </div>
      <p className="text-white/40 text-xs font-medium mb-0.5">{label}</p>
      <p className="text-white text-xl font-bold">{value}</p>
      {sub && <p className="text-white/30 text-[11px] mt-1">{sub}</p>}
    </div>
  );
};

const AdminHome = () => {
  const { user } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [d, setD] = useState(null);

  useEffect(() => {
    api.getAdminDashboard()
      .then(setD)
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-green" />
      </div>
    );
  }

  if (!d) {
    return <div className="text-center py-20 text-white/30">Failed to load dashboard data</div>;
  }

  const totalPending = (d.deposits.pending.count || 0) + (d.withdrawals.pending.count || 0) + (d.marketplace.pending || 0);

  const timeAgo = (dateStr) => {
    const now = new Date();
    const dt = new Date(dateStr);
    const diff = Math.floor((now - dt) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Welcome */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Admin Panel
          </h1>
          <p className="text-white/40 text-sm mt-1 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-purple" />
            Welcome back, {user?.name?.split(' ')[0] || 'Admin'}
          </p>
        </div>
        {d.vcRate > 0 && (
          <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <Coins size={16} className="text-cyan" />
            <div>
              <p className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">VC Rate</p>
              <p className="text-sm font-bold text-cyan">₹{fmt(d.vcRate)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Pending Alerts */}
      {totalPending > 0 && (
        <div className="flex flex-wrap gap-2">
          {d.deposits.pending.count > 0 && (
            <Link to="/admin/deposits" className="flex items-center gap-2 bg-yellow-400/5 border border-yellow-400/15 rounded-xl px-4 py-2.5 hover:bg-yellow-400/8 transition-all">
              <AlertTriangle size={14} className="text-yellow-400" />
              <span className="text-xs text-yellow-400 font-semibold">{d.deposits.pending.count} pending deposits (₹{fmt(d.deposits.pending.amount)})</span>
            </Link>
          )}
          {d.withdrawals.pending.count > 0 && (
            <Link to="/admin/withdrawals" className="flex items-center gap-2 bg-yellow-400/5 border border-yellow-400/15 rounded-xl px-4 py-2.5 hover:bg-yellow-400/8 transition-all">
              <AlertTriangle size={14} className="text-yellow-400" />
              <span className="text-xs text-yellow-400 font-semibold">{d.withdrawals.pending.count} pending withdrawals (₹{fmt(d.withdrawals.pending.amount)})</span>
            </Link>
          )}
          {d.marketplace.pending > 0 && (
            <Link to="/admin/marketplace" className="flex items-center gap-2 bg-yellow-400/5 border border-yellow-400/15 rounded-xl px-4 py-2.5 hover:bg-yellow-400/8 transition-all">
              <AlertTriangle size={14} className="text-yellow-400" />
              <span className="text-xs text-yellow-400 font-semibold">{d.marketplace.pending} pending marketplace orders</span>
            </Link>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={Users}
          label="Total Users"
          value={d.users.total}
          sub={d.users.today > 0 ? `+${d.users.today} today` : null}
          color="bg-purple/10 text-purple"
          badge={d.users.today > 0 ? { text: `+${d.users.today} today`, class: 'bg-purple/10 text-purple' } : null}
        />
        <StatCard
          icon={ArrowDownToLine}
          label="Total Deposits"
          value={`₹${fmt(d.deposits.approved.amount)}`}
          sub={`${d.deposits.approved.count} transactions`}
          color="bg-green/10 text-green"
          badge={d.deposits.today.count > 0 ? { text: `+₹${fmt(d.deposits.today.amount)} today`, class: 'bg-green/10 text-green' } : null}
        />
        <StatCard
          icon={ArrowUpFromLine}
          label="Total Withdrawals"
          value={`₹${fmt(d.withdrawals.approved.amount)}`}
          sub={`${d.withdrawals.approved.count} transactions`}
          color="bg-red-400/10 text-red-400"
          badge={d.withdrawals.today.count > 0 ? { text: `+₹${fmt(d.withdrawals.today.amount)} today`, class: 'bg-red-400/10 text-red-400' } : null}
        />
        <StatCard
          icon={TrendingUp}
          label="Active Investments"
          value={`₹${fmt(d.investments.active.amount)}`}
          sub={`${d.investments.active.count} active / ${d.investments.total.count} total`}
          color="bg-cyan/10 text-cyan"
        />
      </div>

      {/* Second row stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={Wallet}
          label="Net Cash Flow"
          value={`₹${fmt((d.deposits.approved.amount || 0) - (d.withdrawals.approved.amount || 0))}`}
          color={(d.deposits.approved.amount || 0) >= (d.withdrawals.approved.amount || 0) ? 'bg-green/10 text-green' : 'bg-red-400/10 text-red-400'}
        />
        <StatCard
          icon={Coins}
          label="Level Income Paid"
          value={`₹${fmt(d.levelIncome)}`}
          color="bg-blue/10 text-blue"
        />
        <StatCard
          icon={Store}
          label="Marketplace Pending"
          value={d.marketplace.pending}
          color="bg-yellow-400/10 text-yellow-400"
        />
        <StatCard
          icon={Activity}
          label="Today's Signups"
          value={d.users.today}
          color="bg-purple/10 text-purple"
        />
      </div>

      {/* Recent Users + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="lg:col-span-2 bg-white/5 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">Recent Users</h2>
            <Link to="/admin/users" className="text-[11px] text-purple hover:text-purple-dark transition-colors font-semibold">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-[10px] text-white/30 font-semibold uppercase tracking-wider pb-2.5 pr-3">Name</th>
                  <th className="text-[10px] text-white/30 font-semibold uppercase tracking-wider pb-2.5 pr-3 hidden sm:table-cell">Email</th>
                  <th className="text-[10px] text-white/30 font-semibold uppercase tracking-wider pb-2.5 pr-3">Joined</th>
                  <th className="text-[10px] text-white/30 font-semibold uppercase tracking-wider pb-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {d.recentUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-white/20 text-sm py-10">No users yet</td>
                  </tr>
                ) : (
                  d.recentUsers.slice(0, 7).map((u) => (
                    <tr key={u.id} className="border-b border-white/3 last:border-0">
                      <td className="py-2.5 pr-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-linear-to-br from-purple/20 to-cyan/20 flex items-center justify-center text-[10px] font-bold text-white/60 shrink-0">
                            {(u.name || 'U')[0].toUpperCase()}
                          </div>
                          <span className="text-sm text-white font-medium truncate max-w-30">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 pr-3 hidden sm:table-cell">
                        <span className="text-xs text-white/40 truncate max-w-37.5 block">{u.email}</span>
                      </td>
                      <td className="py-2.5 pr-3">
                        <span className="text-[11px] text-white/30">{timeAgo(u.created_at)}</span>
                      </td>
                      <td className="py-2.5">
                        {u.is_blocked ? (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-400/10 text-red-400 border border-red-400/20">Blocked</span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green/10 text-green border border-green/20">Active</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white">Recent Activity</h2>
            <Link to="/admin/notifications" className="text-[11px] text-purple hover:text-purple-dark transition-colors font-semibold">View All</Link>
          </div>
          <div className="space-y-1">
            {d.recentActivity.length === 0 ? (
              <p className="text-white/20 text-sm text-center py-8">No activity yet</p>
            ) : (
              d.recentActivity.map((a, i) => (
                <div key={`${a.type}-${a.id}-${i}`} className="flex items-center gap-2.5 py-2 rounded-lg">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${a.type === 'deposit' ? 'bg-green/10' : 'bg-red-400/10'}`}>
                    {a.type === 'deposit'
                      ? <ArrowDownToLine size={13} className="text-green" />
                      : <ArrowUpFromLine size={13} className="text-red-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/70 truncate">
                      <span className="font-semibold text-white/90">{a.name}</span>
                      {' '}{a.type === 'deposit' ? 'deposited' : 'withdrew'}{' '}
                      <span className="font-semibold text-white/90">₹{fmt(a.amount)}</span>
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[9px] text-white/25">{timeAgo(a.time)}</span>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${a.status === 'approved' ? 'bg-green/10 text-green' :
                        a.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400' :
                          'bg-red-400/10 text-red-400'
                        }`}>{a.status}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
