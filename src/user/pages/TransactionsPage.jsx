import React, { useState, useEffect } from 'react';
import {
  History, ArrowDownToLine, ArrowUpFromLine, TrendingUp, Send, ArrowDown,
  Store, Loader2, AlertCircle, Search, Filter, ChevronDown,
} from 'lucide-react';
import { api } from '../../utils/api';

const typeConfig = {
  deposit: { label: 'Deposit', icon: ArrowDownToLine, color: 'text-green', bg: 'bg-green/10' },
  withdrawal: { label: 'Withdrawal', icon: ArrowUpFromLine, color: 'text-orange-400', bg: 'bg-orange-400/10' },
  investment: { label: 'Investment', icon: TrendingUp, color: 'text-cyan', bg: 'bg-cyan/10' },
  transfer_sent: { label: 'Sent', icon: Send, color: 'text-red-400', bg: 'bg-red-400/10' },
  transfer_received: { label: 'Received', icon: ArrowDown, color: 'text-green', bg: 'bg-green/10' },
  marketplace_sell: { label: 'Sell Order', icon: Store, color: 'text-purple', bg: 'bg-purple/10' },
  marketplace_buy: { label: 'Buy Order', icon: Store, color: 'text-blue-400', bg: 'bg-blue-400/10' },
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

const allTypes = [
  { value: '', label: 'All Types' },
  { value: 'deposit', label: 'Deposits' },
  { value: 'withdrawal', label: 'Withdrawals' },
  { value: 'investment', label: 'Investments' },
  { value: 'transfer_sent', label: 'Sent Transfers' },
  { value: 'transfer_received', label: 'Received' },
  { value: 'marketplace_sell', label: 'Sell Orders' },
  { value: 'marketplace_buy', label: 'Buy Orders' },
];

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await api.myTransactions();
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
      const detail = (t.detail || '').toLowerCase();
      const type = (typeConfig[t.type]?.label || t.type).toLowerCase();
      if (!detail.includes(q) && !type.includes(q) && !String(t.amount).includes(q)) return false;
    }
    return true;
  });

  // Stats
  const totalDeposits = transactions.filter(t => t.type === 'deposit' && t.status === 'approved').reduce((s, t) => s + Number(t.amount), 0);
  const totalWithdrawals = transactions.filter(t => t.type === 'withdrawal' && t.status === 'approved').reduce((s, t) => s + Number(t.amount), 0);
  const totalInvested = transactions.filter(t => t.type === 'investment' && (t.status === 'active' || t.status === 'completed')).reduce((s, t) => s + Number(t.amount), 0);

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
          <History size={24} /> Transactions
        </h1>
        <p className="text-white/40 text-sm mt-1">Complete history of all your activities</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#1e1635] rounded-xl p-4 border border-white/5">
          <p className="text-white/40 text-xs">Total Txns</p>
          <p className="text-xl font-bold text-white">{transactions.length}</p>
        </div>
        <div className="bg-[#1e1635] rounded-xl p-4 border border-white/5">
          <p className="text-white/40 text-xs">Deposits</p>
          <p className="text-xl font-bold text-green">{totalDeposits.toFixed(2)} VC</p>
        </div>
        <div className="bg-[#1e1635] rounded-xl p-4 border border-white/5">
          <p className="text-white/40 text-xs">Withdrawals</p>
          <p className="text-xl font-bold text-orange-400">{totalWithdrawals.toFixed(2)} VC</p>
        </div>
        <div className="bg-[#1e1635] rounded-xl p-4 border border-white/5">
          <p className="text-white/40 text-xs">Invested</p>
          <p className="text-xl font-bold text-cyan">{totalInvested.toFixed(2)} VC</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search transactions..."
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
            {allTypes.map((t) => (
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
              <option key={s} value={s} className="bg-[#1e1635] capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
        </div>
      </div>

      {/* Transactions List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-white/30">
          <History size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No transactions found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((txn) => {
            const cfg = typeConfig[txn.type] || { label: txn.type, icon: History, color: 'text-white/50', bg: 'bg-white/5' };
            const Icon = cfg.icon;
            const isCredit = ['deposit', 'transfer_received', 'marketplace_buy'].includes(txn.type);

            return (
              <div
                key={`${txn.type}-${txn.id}`}
                className="bg-[#1e1635] border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:border-white/10 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}>
                  <Icon size={18} className={cfg.color} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white text-sm font-semibold">{cfg.label}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusStyle[txn.status] || 'bg-white/5 text-white/40'}`}>
                      {txn.status}
                    </span>
                  </div>
                  <p className="text-white/30 text-xs mt-0.5 truncate">{txn.detail || '—'}</p>
                </div>

                <div className="text-right shrink-0">
                  <p className={`text-sm font-bold ${isCredit ? 'text-green' : 'text-red-400'}`}>
                    {isCredit ? '+' : '-'}{Number(txn.amount).toFixed(2)} VC
                  </p>
                  <p className="text-white/20 text-[10px] mt-0.5">
                    {new Date(txn.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
