import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  ArrowDownToLine,
  ArrowUpFromLine,
  Wallet,
  Coins,
  ArrowLeftRight,
  Store,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from 'lucide-react';
import { api } from '../../utils/api';

const fmt = (n) => Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [prev, setPrev] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const now = new Date();
        const to = now.toISOString().slice(0, 10);
        const from30 = new Date(now);
        from30.setDate(from30.getDate() - 29);
        const from60 = new Date(now);
        from60.setDate(from60.getDate() - 59);

        const [current, previous] = await Promise.all([
          api.getReport(from30.toISOString().slice(0, 10), to),
          api.getReport(from60.toISOString().slice(0, 10), from30.toISOString().slice(0, 10)),
        ]);
        setData(current);
        setPrev(previous);
      } catch { /* ignored */ }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-green" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-white/30">Failed to load analytics</div>
    );
  }

  const pctChange = (cur, pre) => {
    if (!pre || pre === 0) return cur > 0 ? 100 : 0;
    return Math.round(((cur - pre) / pre) * 100);
  };

  const stats = [
    {
      icon: Users, label: 'New Users', value: data.users.registered,
      prev: prev?.users?.registered || 0, color: 'bg-purple/10 text-purple',
    },
    {
      icon: ArrowDownToLine, label: 'Total Deposits', value: `₹${fmt(data.deposits.approved.amount)}`,
      raw: data.deposits.approved.amount, prevRaw: prev?.deposits?.approved?.amount || 0, color: 'bg-green/10 text-green',
    },
    {
      icon: ArrowUpFromLine, label: 'Total Withdrawals', value: `₹${fmt(data.withdrawals.approved.amount)}`,
      raw: data.withdrawals.approved.amount, prevRaw: prev?.withdrawals?.approved?.amount || 0, color: 'bg-red-400/10 text-red-400',
    },
    {
      icon: TrendingUp, label: 'Active Investments', value: `₹${fmt(data.investments.active.amount)}`,
      raw: data.investments.active.amount, prevRaw: prev?.investments?.active?.amount || 0, color: 'bg-cyan/10 text-cyan',
    },
    {
      icon: ArrowLeftRight, label: 'P2P Transfers', value: `₹${fmt(data.transfers.amount)}`,
      raw: data.transfers.amount, prevRaw: prev?.transfers?.amount || 0, color: 'bg-blue/10 text-blue',
    },
    {
      icon: Store, label: 'Marketplace Volume', value: `₹${fmt(data.marketplace.completed.amount)}`,
      raw: data.marketplace.completed.amount, prevRaw: prev?.marketplace?.completed?.amount || 0, color: 'bg-purple/10 text-purple',
    },
    {
      icon: Coins, label: 'Level Income Paid', value: `₹${fmt(data.levelIncome.amount)}`,
      raw: data.levelIncome.amount, prevRaw: prev?.levelIncome?.amount || 0, color: 'bg-green/10 text-green',
    },
    {
      icon: Activity, label: 'Pending Deposits', value: data.deposits.pending.count,
      prev: prev?.deposits?.pending?.count || 0, color: 'bg-yellow-400/10 text-yellow-400',
    },
  ];

  // Build chart data from daily arrays
  const dailyDep = data.daily?.deposits || [];
  const dailyWith = data.daily?.withdrawals || [];
  const dailyInv = data.daily?.investments || [];
  const dailyUsr = data.daily?.users || [];

  // Merge all unique dates
  const allDates = [...new Set([
    ...dailyDep.map(d => d.date),
    ...dailyWith.map(d => d.date),
    ...dailyInv.map(d => d.date),
    ...dailyUsr.map(d => d.date),
  ])].sort();

  const getVal = (arr, date, key = 'total') => {
    const found = arr.find(d => d.date === date);
    return found ? Number(found[key] || found.count || 0) : 0;
  };

  // Max for bar scaling
  const maxFinancial = Math.max(1, ...allDates.map(d =>
    Math.max(getVal(dailyDep, d), getVal(dailyWith, d), getVal(dailyInv, d))
  ));

  // Net flow = deposits - withdrawals
  const netFlow = (data.deposits.approved.amount || 0) - (data.withdrawals.approved.amount || 0);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-green/20 to-cyan/20 flex items-center justify-center">
            <BarChart3 size={20} className="text-green" />
          </div>
          Analytics
        </h1>
        <p className="text-white/40 text-sm mt-1 ml-13">Last 30 days performance overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => {
          const change = s.raw !== undefined
            ? pctChange(s.raw, s.prevRaw)
            : pctChange(typeof s.value === 'number' ? s.value : 0, s.prev || 0);
          return (
            <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon size={18} />
                </div>
                {change !== 0 && (
                  <span className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${change > 0 ? 'bg-green/10 text-green' : 'bg-red-400/10 text-red-400'}`}>
                    {change > 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                    {Math.abs(change)}%
                  </span>
                )}
              </div>
              <p className="text-white/40 text-[11px] font-medium mb-0.5">{s.label}</p>
              <p className="text-white text-lg font-bold">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Net Flow Banner */}
      <div className={`flex items-center justify-between px-5 py-4 rounded-2xl border ${netFlow >= 0 ? 'bg-green/4 border-green/10' : 'bg-red-400/4 border-red-400/10'}`}>
        <div className="flex items-center gap-3">
          <Wallet size={20} className={netFlow >= 0 ? 'text-green' : 'text-red-400'} />
          <div>
            <p className="text-white/40 text-xs">Net Cash Flow (30 days)</p>
            <p className={`text-xl font-bold ${netFlow >= 0 ? 'text-green' : 'text-red-400'}`}>
              {netFlow >= 0 ? '+' : ''}₹{fmt(netFlow)}
            </p>
          </div>
        </div>
        <span className="text-white/30 text-xs">Deposits − Withdrawals</span>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Daily Financial Activity Bar Chart */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-1">Daily Financial Activity</h3>
          <p className="text-[11px] text-white/30 mb-4">Deposits, withdrawals & investments</p>

          {allDates.length === 0 ? (
            <p className="text-white/20 text-sm text-center py-10">No activity data</p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {allDates.slice(-15).map(date => {
                const dep = getVal(dailyDep, date);
                const wit = getVal(dailyWith, date);
                const inv = getVal(dailyInv, date);
                return (
                  <div key={date} className="group">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-white/30 w-12 shrink-0">{date.slice(5)}</span>
                      <div className="flex-1 space-y-1">
                        {dep > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="h-2 rounded-full bg-green/60" style={{ width: `${Math.max(4, (dep / maxFinancial) * 100)}%` }} />
                            <span className="text-[9px] text-green/70">₹{fmt(dep)}</span>
                          </div>
                        )}
                        {wit > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="h-2 rounded-full bg-red-400/60" style={{ width: `${Math.max(4, (wit / maxFinancial) * 100)}%` }} />
                            <span className="text-[9px] text-red-400/70">₹{fmt(wit)}</span>
                          </div>
                        )}
                        {inv > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="h-2 rounded-full bg-cyan/60" style={{ width: `${Math.max(4, (inv / maxFinancial) * 100)}%` }} />
                            <span className="text-[9px] text-cyan/70">₹{fmt(inv)}</span>
                          </div>
                        )}
                        {dep === 0 && wit === 0 && inv === 0 && (
                          <div className="h-2 rounded-full bg-white/5 w-full" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/5">
            <span className="flex items-center gap-1.5 text-[10px] text-white/40"><span className="w-2 h-2 rounded-full bg-green/60" />Deposits</span>
            <span className="flex items-center gap-1.5 text-[10px] text-white/40"><span className="w-2 h-2 rounded-full bg-red-400/60" />Withdrawals</span>
            <span className="flex items-center gap-1.5 text-[10px] text-white/40"><span className="w-2 h-2 rounded-full bg-cyan/60" />Investments</span>
          </div>
        </div>

        {/* User Growth */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-1">User Registrations</h3>
          <p className="text-[11px] text-white/30 mb-4">New signups per day</p>

          {dailyUsr.length === 0 ? (
            <p className="text-white/20 text-sm text-center py-10">No registration data</p>
          ) : (
            <>
              {/* Simple bar chart */}
              <div className="flex items-end gap-1 h-36">
                {(() => {
                  const last15 = dailyUsr.slice(-15);
                  const maxU = Math.max(1, ...last15.map(d => d.count));
                  return last15.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div className="absolute -top-6 bg-white/10 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {d.date.slice(5)}: {d.count}
                      </div>
                      <div
                        className="w-full bg-linear-to-t from-purple to-purple/40 rounded-t-sm transition-all duration-300 min-h-1"
                        style={{ height: `${(d.count / maxU) * 100}%` }}
                      />
                    </div>
                  ));
                })()}
              </div>
              <div className="flex justify-between mt-2 text-[9px] text-white/20">
                <span>{dailyUsr.slice(-15)[0]?.date.slice(5)}</span>
                <span>{dailyUsr[dailyUsr.length - 1]?.date.slice(5)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Deposits Breakdown */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <ArrowDownToLine size={16} className="text-green" />
            <h3 className="text-sm font-bold text-white">Deposits</h3>
          </div>
          <div className="space-y-3">
            <BreakdownRow label="Approved" count={data.deposits.approved.count} amount={data.deposits.approved.amount} color="text-green" />
            <BreakdownRow label="Pending" count={data.deposits.pending.count} amount={data.deposits.pending.amount} color="text-yellow-400" />
            <BreakdownRow label="Rejected" count={data.deposits.rejected.count} amount={data.deposits.rejected.amount} color="text-red-400" />
            <div className="border-t border-white/5 pt-2">
              <BreakdownRow label="Total" count={data.deposits.total.count} amount={data.deposits.total.amount} color="text-white" bold />
            </div>
          </div>
        </div>

        {/* Withdrawals Breakdown */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <ArrowUpFromLine size={16} className="text-red-400" />
            <h3 className="text-sm font-bold text-white">Withdrawals</h3>
          </div>
          <div className="space-y-3">
            <BreakdownRow label="Approved" count={data.withdrawals.approved.count} amount={data.withdrawals.approved.amount} color="text-green" />
            <BreakdownRow label="Pending" count={data.withdrawals.pending.count} amount={data.withdrawals.pending.amount} color="text-yellow-400" />
            <div className="border-t border-white/5 pt-2">
              <BreakdownRow label="Total" count={data.withdrawals.total.count} amount={data.withdrawals.total.amount} color="text-white" bold />
            </div>
          </div>
        </div>

        {/* Investments Breakdown */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-cyan" />
            <h3 className="text-sm font-bold text-white">Investments</h3>
          </div>
          <div className="space-y-3">
            <BreakdownRow label="Active" count={data.investments.active.count} amount={data.investments.active.amount} color="text-green" />
            <BreakdownRow label="Completed" count={data.investments.completed.count} amount={data.investments.completed.amount} color="text-white/50" />
            <div className="border-t border-white/5 pt-2">
              <BreakdownRow label="Total" count={data.investments.total.count} amount={data.investments.total.amount} color="text-white" bold />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BreakdownRow = ({ label, count, amount, color, bold }) => (
  <div className="flex items-center justify-between">
    <span className={`text-xs ${bold ? 'font-bold text-white' : 'text-white/50'}`}>{label}</span>
    <div className="flex items-center gap-3">
      <span className="text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded">{count}</span>
      <span className={`text-xs font-semibold ${color}`}>₹{fmt(amount)}</span>
    </div>
  </div>
);

export default AdminAnalytics;
