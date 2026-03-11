import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  RefreshCw,
  Coins,
  Clock,
  CheckCircle,
  XCircle,
  Store,
} from 'lucide-react';
import { api } from '../../utils/api';

const WalletPage = () => {
  const { user } = useOutletContext();
  const [balance, setBalance] = useState(0);
  const [stats, setStats] = useState({ totalDeposited: 0, totalCount: 0, pendingAmount: 0, pendingCount: 0 });
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [depData, balData] = await Promise.all([
        api.myDeposits(),
        api.getBalance(),
      ]);
      setBalance(depData.balance || 0);
      setStats(depData.stats || {});
      setDeposits(depData.deposits || []);
    } catch { }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const statusIcon = (status) => {
    if (status === 'approved') return <CheckCircle size={14} className="text-green" />;
    if (status === 'rejected') return <XCircle size={14} className="text-red-400" />;
    return <Clock size={14} className="text-yellow-400" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-green/30 border-t-green rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <Wallet size={28} className="text-green" /> My Wallet
          </h1>
          <p className="text-white/40 text-sm mt-1">Your VC Coin balance & overview</p>
        </div>
        <button
          onClick={handleRefresh}
          className={`p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 text-white/40 hover:text-white transition-all ${refreshing ? 'animate-spin' : ''}`}
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Balance Card */}
      <div className="relative overflow-hidden bg-linear-to-br from-green/10 via-cyan/5 to-purple/10 border border-green/10 rounded-3xl p-7">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-green/5 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-green/10 border border-green/20 flex items-center justify-center">
              <Coins size={22} className="text-green" />
            </div>
            <p className="text-white/40 text-sm font-medium">VC Coin Balance</p>
          </div>
          <p className="text-4xl md:text-5xl font-black text-white mt-3 tracking-tight">
            {Number(balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-green font-bold text-base mt-1">VC Coins</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center mb-3">
            <ArrowDownToLine size={18} className="text-green" />
          </div>
          <p className="text-white/40 text-xs font-medium mb-1">Total Deposited</p>
          <p className="text-white text-xl font-bold">
            {Number(stats.totalDeposited).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-green text-[10px] font-bold mt-0.5">VC Coins</p>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center mb-3">
            <Clock size={18} className="text-yellow-400" />
          </div>
          <p className="text-white/40 text-xs font-medium mb-1">Pending</p>
          <p className="text-white text-xl font-bold">
            {Number(stats.pendingAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-yellow-400 text-[10px] font-bold mt-0.5">VC Coins</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        <Link
          to="/dashboard/deposit"
          className="flex items-center gap-4 bg-green/5 border border-green/10 rounded-2xl p-5 hover:bg-green/10 hover:border-green/20 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-green/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ArrowDownToLine size={22} className="text-green" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Deposit</p>
            <p className="text-white/30 text-xs">Add VC Coins via UPI</p>
          </div>
        </Link>
        <Link
          to="/dashboard/withdraw"
          className="flex items-center gap-4 bg-cyan/5 border border-cyan/10 rounded-2xl p-5 hover:bg-cyan/10 hover:border-cyan/20 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ArrowUpFromLine size={22} className="text-cyan" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Withdraw</p>
            <p className="text-white/30 text-xs">Withdraw VC Coins</p>
          </div>
        </Link>
        <Link
          to="/dashboard/marketplace"
          className="flex items-center gap-4 bg-purple/5 border border-purple/10 rounded-2xl p-5 hover:bg-purple/10 hover:border-purple/20 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-purple/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Store size={22} className="text-purple" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Marketplace</p>
            <p className="text-white/30 text-xs">Buy & Sell VC Coins</p>
          </div>
        </Link>
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Recent Transactions</h2>
        <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
          {deposits.length === 0 ? (
            <div className="text-center py-12">
              <Wallet size={32} className="text-white/10 mx-auto mb-3" />
              <p className="text-white/20 text-sm">No transactions yet</p>
              <Link to="/dashboard/deposit" className="text-green text-xs font-bold mt-2 inline-block hover:underline">
                Make your first deposit
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {deposits.slice(0, 10).map((d) => (
                <div key={d.id} className="flex items-center justify-between px-5 py-4 hover:bg-white/2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-green/10 flex items-center justify-center">
                      <ArrowDownToLine size={16} className="text-green" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Deposit</p>
                      <p className="text-[10px] text-white/30">
                        {new Date(d.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="text-sm font-bold text-white">
                        +{Number(d.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })} VC
                      </p>
                      <p className="text-[10px] text-white/30 capitalize">{d.method}</p>
                    </div>
                    {statusIcon(d.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
