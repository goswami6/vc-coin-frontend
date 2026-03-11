import React, { useState, useEffect } from 'react';
import {
  History, ArrowDownToLine, ArrowUpFromLine, TrendingUp, Send,
  Store, Loader2, AlertCircle, Search, Filter, ChevronDown, Users,
} from 'lucide-react';
import { api } from '../../utils/api';

const typeConfig = {
  deposit: { label: 'Deposit', icon: ArrowDownToLine, color: 'text-green', bg: 'bg-green/10' },
  withdrawal: { label: 'Withdrawal', icon: ArrowUpFromLine, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  investment: { label: 'Investment', icon: TrendingUp, color: 'text-cyan', bg: 'bg-cyan/10' },
  transfer: { label: 'Transfer', icon: Send, color: 'text-purple', bg: 'bg-purple/10' },
  marketplace: { label: 'Marketplace', icon: Store, color: 'text-blue-400', bg: 'bg-blue-400/10' },
};

const statusStyle = {
  pending: 'bg-yellow-500/10 text-yellow-400',
  approved: 'bg-green/10 text-green',
  completed: 'bg-green/10 text-green',
  active: 'bg-cyan/10 text-cyan',
  rejected: 'bg-red-500/10 text-red-400',
  cancelled: 'bg-white/5 text-white/40',
  purchased: 'bg-blue-500/10 text-blue-400',
};

const adminTypes = [
  { value: '', label: 'All Types' },
  { value: 'deposit', label: 'Deposits' },
  { value: 'withdrawal', label: 'Withdrawals' },
  { value: 'investment', label: 'Investments' },
  { value: 'transfer', label: 'Transfers' },
  { value: 'marketplace', label: 'Marketplace' },
];

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await api.allTransactions();
        setTransactions(data.transactions || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = transactions.filter((t) => {
    if (typeFilter && t.type !== typeFilter) return false;
    if (statusFilter && t.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const name = (t.user_name || '').toLowerCase();
      const email = (t.user_email || '').toLowerCase();
      const detail = (t.detail || '').toLowerCase();
      if (!name.includes(q) && !email.includes(q) && !detail.includes(q) && !String(t.amount).includes(q)) return false;
    }
    return true;
  });

  // Stats
  const countByType = (type) => transactions.filter(t => t.type === type).length;
  const totalVolume = transactions.reduce((s, t) => s + Number(t.amount), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="animate-spin text-purple" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <History size={24} /> All Transactions
        </h1>
        <p className="text-white/40 text-sm mt-1">Platform-wide transaction history</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-[#1e1635] rounded-xl p-4 border border-white/5">
          <p className="text-white/40 text-xs">Total</p>
          <p className="text-xl font-bold text-white">{transactions.length}</p>
        </div>
        <div className="bg-[#1e1635] rounded-xl p-4 border border-white/5">
          <p className="text-white/40 text-xs">Deposits</p>
          <p className="text-xl font-bold text-green">{countByType('deposit')}</p>
        </div>
        <div className="bg-[#1e1635] rounded-xl p-4 border border-white/5">
          <p className="text-white/40 text-xs">Withdrawals</p>
          <p className="text-xl font-bold text-orange-400">{countByType('withdrawal')}</p>
        </div>
        <div className="bg-[#1e1635] rounded-xl p-4 border border-white/5">
          <p className="text-white/40 text-xs">Investments</p>
          <p className="text-xl font-bold text-cyan">{countByType('investment')}</p>
        </div>
        <div className="bg-[#1e1635] rounded-xl p-4 border border-white/5">
          <p className="text-white/40 text-xs">Transfers</p>
          <p className="text-xl font-bold text-purple">{countByType('transfer')}</p>
        </div>
        <div className="bg-[#1e1635] rounded-xl p-4 border border-white/5">
          <p className="text-white/40 text-xs">Marketplace</p>
          <p className="text-xl font-bold text-blue-400">{countByType('marketplace')}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search by user, email, detail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple"
          />
        </div>
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl pl-9 pr-8 py-2.5 text-white text-sm focus:outline-none focus:border-purple appearance-none cursor-pointer"
          >
            {adminTypes.map((t) => (
              <option key={t.value} value={t.value} className="bg-[#1e1635]">{t.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 pr-8 py-2.5 text-white text-sm focus:outline-none focus:border-purple appearance-none cursor-pointer"
          >
            <option value="" className="bg-[#1e1635]">All Status</option>
            {['pending', 'approved', 'completed', 'active', 'rejected', 'cancelled', 'purchased'].map((s) => (
              <option key={s} value={s} className="bg-[#1e1635]">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <History size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No transactions found</p>
        </div>
      ) : (
        <div className="bg-[#1e1635] border border-white/5 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-white/40 text-xs">
                  <th className="text-left px-4 py-3 font-medium">Type</th>
                  <th className="text-left px-4 py-3 font-medium">User</th>
                  <th className="text-left px-4 py-3 font-medium">Detail</th>
                  <th className="text-right px-4 py-3 font-medium">Amount</th>
                  <th className="text-center px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((txn, idx) => {
                  const cfg = typeConfig[txn.type] || { label: txn.type, icon: History, color: 'text-white/50', bg: 'bg-white/5' };
                  const Icon = cfg.icon;

                  return (
                    <tr key={`${txn.type}-${txn.id}-${idx}`} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center`}>
                            <Icon size={14} className={cfg.color} />
                          </div>
                          <span className={`font-medium ${cfg.color}`}>{cfg.label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-white text-xs font-medium">{txn.user_name}</p>
                        <p className="text-white/30 text-[10px]">{txn.user_email}</p>
                      </td>
                      <td className="px-4 py-3 text-white/50 text-xs max-w-50 truncate">{txn.detail || '—'}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-white font-semibold">{Number(txn.amount).toFixed(2)} VC</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusStyle[txn.status] || 'bg-white/5 text-white/40'}`}>
                          {txn.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-white/30 text-xs whitespace-nowrap">
                        {new Date(txn.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTransactions;
