import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Users,
} from 'lucide-react';
import { api } from '../../utils/api';

const AdminInvestments = () => {
  const [investments, setInvestments] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    api.getAllInvestments()
      .then((d) => {
        setInvestments(d.investments || []);
        setStats(d.stats || {});
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this investment? Amount will be refunded to user wallet.')) return;
    setCancelling(id);
    try {
      await api.cancelInvestment(id);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to cancel.');
    } finally {
      setCancelling(null);
    }
  };

  const filtered = filter === 'all' ? investments : investments.filter((i) => i.status === filter);

  const statusBadge = (status) => {
    const map = {
      active: { bg: 'bg-green/10 text-green', icon: Zap },
      completed: { bg: 'bg-cyan/10 text-cyan', icon: CheckCircle },
      cancelled: { bg: 'bg-red-400/10 text-red-400', icon: XCircle },
    };
    const s = map[status] || map.active;
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${s.bg}`}>
        <s.icon size={10} /> {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-purple/30 border-t-purple rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <TrendingUp size={24} className="text-purple" /> Investments
        </h1>
        <p className="text-white/40 text-sm mt-1">All user investments overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center">
              <Zap size={18} className="text-green" />
            </div>
            <p className="text-xs text-white/30 font-medium">Active Investments</p>
          </div>
          <p className="text-3xl font-black text-white">{stats.activeCount || 0}</p>
          <p className="text-sm text-green font-bold mt-1">
            ₹{Number(stats.activeAmount || 0).toLocaleString('en-IN')}
          </p>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center">
              <CheckCircle size={18} className="text-cyan" />
            </div>
            <p className="text-xs text-white/30 font-medium">Completed Investments</p>
          </div>
          <p className="text-3xl font-black text-white">{stats.completedCount || 0}</p>
          <p className="text-sm text-cyan font-bold mt-1">
            ₹{Number(stats.completedAmount || 0).toLocaleString('en-IN')}
          </p>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-400/10 flex items-center justify-center">
              <XCircle size={18} className="text-red-400" />
            </div>
            <p className="text-xs text-white/30 font-medium">Cancelled Investments</p>
          </div>
          <p className="text-3xl font-black text-white">{stats.cancelledCount || 0}</p>
          <p className="text-sm text-red-400 font-bold mt-1">
            ₹{Number(stats.cancelledAmount || 0).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'active', 'completed', 'cancelled'].map((f) => {
          const count =
            f === 'all'
              ? investments.length
              : investments.filter((i) => i.status === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize ${filter === f
                ? 'bg-purple/10 text-purple border border-purple/20'
                : 'bg-white/5 text-white/40 border border-white/5 hover:border-white/10'
                }`}
            >
              {f} ({count})
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-[10px] text-white/30 uppercase font-medium p-4">ID</th>
                <th className="text-[10px] text-white/30 uppercase font-medium p-4">User</th>
                <th className="text-[10px] text-white/30 uppercase font-medium p-4">Plan</th>
                <th className="text-[10px] text-white/30 uppercase font-medium p-4">Amount</th>
                <th className="text-[10px] text-white/30 uppercase font-medium p-4">Daily ROI</th>
                <th className="text-[10px] text-white/30 uppercase font-medium p-4">Progress</th>
                <th className="text-[10px] text-white/30 uppercase font-medium p-4">Earned</th>
                <th className="text-[10px] text-white/30 uppercase font-medium p-4">Status</th>
                <th className="text-[10px] text-white/30 uppercase font-medium p-4">Date</th>
                <th className="text-[10px] text-white/30 uppercase font-medium p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center text-white/20 text-sm py-16">
                    No investments found
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => (
                  <tr key={inv.id} className="border-b border-white/5 last:border-0 hover:bg-white/2">
                    <td className="p-4 text-xs text-white/40">#{inv.id}</td>
                    <td className="p-4">
                      <p className="text-sm font-medium text-white">{inv.user_name || '-'}</p>
                    </td>
                    <td className="p-4 text-sm text-white/60">{inv.plan_name}</td>
                    <td className="p-4 text-sm font-bold text-white">
                      ₹{Number(inv.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-sm text-cyan font-medium">
                      ₹{Number(inv.dailyAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-green to-cyan rounded-full"
                            style={{ width: `${inv.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-white/30 whitespace-nowrap">
                          {inv.daysActive}/{inv.tenure_days}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-bold text-green">
                      ₹{Number(inv.earned || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">{statusBadge(inv.status)}</td>
                    <td className="p-4 text-xs text-white/30">
                      {new Date(inv.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4">
                      {inv.status === 'active' && (
                        <button
                          onClick={() => handleCancel(inv.id)}
                          disabled={cancelling === inv.id}
                          className="p-2 rounded-lg bg-red-400/5 hover:bg-red-400/10 text-red-400/60 hover:text-red-400 transition-all"
                          title="Cancel Investment"
                        >
                          <XCircle size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminInvestments;
