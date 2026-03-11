import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Download,
  Users,
  ArrowDownToLine,
  ArrowUpFromLine,
  TrendingUp,
  ArrowLeftRight,
  Store,
  Coins,
  BarChart3,
  Loader2,
} from 'lucide-react';
import { api } from '../../utils/api';

const fmt = (n) => Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

const today = () => new Date().toISOString().slice(0, 10);
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};
const startOfWeek = () => {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().slice(0, 10);
};
const startOfMonth = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
};

const AdminReports = () => {
  const [from, setFrom] = useState(today());
  const [to, setTo] = useState(today());
  const [preset, setPreset] = useState('today');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [downloading, setDownloading] = useState('');

  const applyPreset = (key) => {
    setPreset(key);
    const t = today();
    if (key === 'today') { setFrom(t); setTo(t); }
    else if (key === 'yesterday') { setFrom(daysAgo(1)); setTo(daysAgo(1)); }
    else if (key === 'week') { setFrom(startOfWeek()); setTo(t); }
    else if (key === 'month') { setFrom(startOfMonth()); setTo(t); }
    else if (key === '7days') { setFrom(daysAgo(6)); setTo(t); }
    else if (key === '30days') { setFrom(daysAgo(29)); setTo(t); }
  };

  const generate = async () => {
    if (!from || !to) return;
    setLoading(true);
    setError('');
    try {
      const data = await api.getReport(from, to);
      setReport(data);
    } catch (err) {
      setError(err.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const presets = [
    { key: 'today', label: 'Today' },
    { key: 'yesterday', label: 'Yesterday' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
    { key: '7days', label: 'Last 7 Days' },
    { key: '30days', label: 'Last 30 Days' },
  ];

  const SectionCard = ({ title, icon, color, downloadType, downloadLabel, children }) => {
    const Icon = icon;
    return (
      <div className="bg-white/5 border border-white/5 rounded-xl overflow-hidden">
        <div className={`flex items-center justify-between px-5 py-3 border-b border-white/5 bg-${color}/5`}>
          <div className="flex items-center gap-2">
            <Icon size={16} className={`text-${color}`} />
            <h3 className={`text-sm font-bold text-${color}`}>{title}</h3>
          </div>
          {downloadType && (
            <button
              onClick={() => downloadDetailCSV(downloadType, downloadLabel || title)}
              disabled={downloading === downloadType}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-white/40 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-all disabled:opacity-40"
            >
              {downloading === downloadType ? <Loader2 size={10} className="animate-spin" /> : <Download size={10} />}
              CSV
            </button>
          )}
        </div>
        <div className="p-5">{children}</div>
      </div>
    );
  };

  const StatRow = ({ label, count, amount, highlight }) => (
    <div className={`flex items-center justify-between py-2 ${highlight ? '' : 'border-b border-white/5'}`}>
      <span className={`text-sm ${highlight ? 'text-white font-semibold' : 'text-white/50'}`}>{label}</span>
      <div className="flex items-center gap-4">
        <span className="text-white/40 text-xs">{count} txn{count !== 1 ? 's' : ''}</span>
        <span className={`text-sm font-bold ${highlight ? 'text-white' : 'text-white/70'}`}>₹{fmt(amount)}</span>
      </div>
    </div>
  );

  const downloadCSV = () => {
    if (!report) return;
    const r = report;
    let csv = 'VC Coin Report\n';
    csv += `Period,${r.period.from} to ${r.period.to}\n\n`;

    csv += 'SUMMARY\n';
    csv += 'Category,Count,Amount (INR)\n';
    csv += `New Users,${r.users.registered},\n`;
    csv += `Deposits (Total),${r.deposits.total.count},${r.deposits.total.amount}\n`;
    csv += `Deposits (Approved),${r.deposits.approved.count},${r.deposits.approved.amount}\n`;
    csv += `Deposits (Pending),${r.deposits.pending.count},${r.deposits.pending.amount}\n`;
    csv += `Deposits (Rejected),${r.deposits.rejected.count},${r.deposits.rejected.amount}\n`;
    csv += `Withdrawals (Total),${r.withdrawals.total.count},${r.withdrawals.total.amount}\n`;
    csv += `Withdrawals (Approved),${r.withdrawals.approved.count},${r.withdrawals.approved.amount}\n`;
    csv += `Withdrawals (Pending),${r.withdrawals.pending.count},${r.withdrawals.pending.amount}\n`;
    csv += `Investments (Total),${r.investments.total.count},${r.investments.total.amount}\n`;
    csv += `Investments (Active),${r.investments.active.count},${r.investments.active.amount}\n`;
    csv += `Investments (Completed),${r.investments.completed.count},${r.investments.completed.amount}\n`;
    csv += `P2P Transfers,${r.transfers.count},${r.transfers.amount}\n`;
    csv += `Marketplace (Total),${r.marketplace.total.count},${r.marketplace.total.amount}\n`;
    csv += `Marketplace (Completed),${r.marketplace.completed.count},${r.marketplace.completed.amount}\n`;
    csv += `Level Income,${r.levelIncome.count},${r.levelIncome.amount}\n\n`;

    if (r.daily) {
      const dateSet = new Set();
      r.daily.deposits.forEach(d => dateSet.add(d.date));
      r.daily.withdrawals.forEach(d => dateSet.add(d.date));
      r.daily.investments.forEach(d => dateSet.add(d.date));
      r.daily.users.forEach(d => dateSet.add(d.date));
      const dates = [...dateSet].sort();
      if (dates.length > 0) {
        csv += 'DAILY BREAKDOWN\n';
        csv += 'Date,Deposits,Withdrawals,Investments,New Users\n';
        dates.forEach((date) => {
          const dep = r.daily.deposits.find(d => d.date === date)?.total || 0;
          const wit = r.daily.withdrawals.find(d => d.date === date)?.total || 0;
          const inv = r.daily.investments.find(d => d.date === date)?.total || 0;
          const usr = r.daily.users.find(d => d.date === date)?.count || 0;
          csv += `${date},${dep},${wit},${inv},${usr}\n`;
        });
      }
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VC-Coin-Report_${r.period.from}_to_${r.period.to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const csvHeaders = {
    deposits: ['ID', 'Name', 'Email', 'Mobile', 'Amount', 'Method', 'Txn ID', 'Status', 'Date'],
    withdrawals: ['ID', 'Name', 'Email', 'Mobile', 'Amount', 'Method', 'Account Details', 'Status', 'Date'],
    investments: ['ID', 'Name', 'Email', 'Mobile', 'Plan', 'Amount', 'Daily ROI%', 'Tenure', 'Total Return', 'Start', 'End', 'Status', 'Date'],
    transfers: ['ID', 'Sender', 'Sender Email', 'Receiver', 'Receiver Email', 'Amount', 'Note', 'Date'],
    marketplace: ['ID', 'Seller', 'Seller Email', 'Buyer', 'VC Amount', 'Price/VC', 'Total Price', 'Fee', 'Net Amount', 'Status', 'Date'],
    level_income: ['ID', 'User', 'Email', 'From User', 'Level', 'Percentage', 'Amount', 'Date'],
    users: ['ID', 'Name', 'Email', 'Mobile', 'Referral Code', 'Referred By', 'Joined'],
  };

  const csvRow = (type, r) => {
    const esc = (v) => `"${String(v ?? '—').replace(/"/g, '""')}"`;
    const d = (v) => v ? new Date(v).toLocaleString('en-IN') : '—';
    if (type === 'deposits') return [r.id, esc(r.name), esc(r.email), r.mobile, r.amount, r.method, r.txn_id, r.status, d(r.createdAt)];
    if (type === 'withdrawals') return [r.id, esc(r.name), esc(r.email), r.mobile, r.amount, r.method, esc(r.account_details), r.status, d(r.createdAt)];
    if (type === 'investments') return [r.id, esc(r.name), esc(r.email), r.mobile, esc(r.plan_name), r.amount, r.daily_roi, r.tenure_days, r.total_return, r.start_date, r.end_date, r.status, d(r.createdAt)];
    if (type === 'transfers') return [r.id, esc(r.sender_name), esc(r.sender_email), esc(r.receiver_name), esc(r.receiver_email), r.amount, esc(r.note), d(r.createdAt)];
    if (type === 'marketplace') return [r.id, esc(r.seller_name), esc(r.seller_email), esc(r.buyer_name), r.amount, r.price_per_vc, r.total_price, r.fee_amount, r.net_amount, r.status, d(r.createdAt)];
    if (type === 'level_income') return [r.id, esc(r.user_name), esc(r.user_email), esc(r.from_user_name), r.level, r.percentage, r.amount, d(r.createdAt)];
    if (type === 'users') return [r.id, esc(r.name), esc(r.email), r.mobile, r.referral_code, esc(r.referred_by_name), d(r.created_at)];
    return [];
  };

  const downloadDetailCSV = async (type, label) => {
    if (!from || !to) return;
    setDownloading(type);
    try {
      const data = await api.getReportDetails(from, to, type);
      const records = data.records || [];
      if (records.length === 0) {
        alert(`No ${label} records found in this period.`);
        return;
      }
      let csv = `${label} Report (${from} to ${to})\n`;
      csv += csvHeaders[type].join(',') + '\n';
      records.forEach((r) => {
        csv += csvRow(type, r).join(',') + '\n';
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${label.replace(/\s+/g, '-')}_${from}_to_${to}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message || 'Download failed');
    } finally {
      setDownloading('');
    }
  };

  // Find max value for bar chart
  const getBarMax = () => {
    if (!report?.daily) return 1;
    const all = [
      ...report.daily.deposits.map(d => d.total),
      ...report.daily.withdrawals.map(d => d.total),
      ...report.daily.investments.map(d => d.total),
    ];
    return Math.max(...all, 1);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText size={24} className="text-purple" /> Reports
        </h1>
        <p className="text-white/40 text-sm mt-1">Generate date-wise, weekly & monthly reports</p>
      </div>

      {/* Controls */}
      <div className="bg-white/5 border border-white/5 rounded-xl p-5 space-y-4">
        {/* Preset Buttons */}
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.key}
              onClick={() => applyPreset(p.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${preset === p.key
                ? 'bg-purple/20 text-purple border border-purple/30'
                : 'bg-white/5 text-white/40 border border-white/5 hover:text-white'
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Date Range + Generate */}
        <div className="flex flex-col sm:flex-row items-end gap-3">
          <div className="flex-1 w-full">
            <label className="text-white/40 text-xs font-medium mb-1 block">From</label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="date"
                value={from}
                onChange={(e) => { setFrom(e.target.value); setPreset('custom'); }}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple/50 scheme-dark"
              />
            </div>
          </div>
          <div className="flex-1 w-full">
            <label className="text-white/40 text-xs font-medium mb-1 block">To</label>
            <div className="relative">
              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="date"
                value={to}
                onChange={(e) => { setTo(e.target.value); setPreset('custom'); }}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple/50 scheme-dark"
              />
            </div>
          </div>
          <button
            onClick={generate}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-purple to-cyan text-white text-sm font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <BarChart3 size={16} />}
            Generate Report
          </button>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>

      {/* Report Content */}
      {report && (
        <div className="space-y-6">
          {/* Period Banner */}
          <div className="bg-linear-to-r from-purple/10 to-cyan/10 border border-purple/20 rounded-xl px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Calendar size={14} className="text-purple" />
              Report: <span className="text-white font-semibold">{report.period.from}</span> to <span className="text-white font-semibold">{report.period.to}</span>
            </div>
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white/60 hover:text-white hover:bg-white/10 transition-all"
            >
              <Download size={14} /> Download CSV
            </button>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { label: 'New Users', value: report.users.registered, icon: Users, color: 'purple' },
              { label: 'Deposits', value: `₹${fmt(report.deposits.approved.amount)}`, icon: ArrowDownToLine, color: 'green' },
              { label: 'Withdrawals', value: `₹${fmt(report.withdrawals.approved.amount)}`, icon: ArrowUpFromLine, color: 'red-400' },
              { label: 'Investments', value: `₹${fmt(report.investments.total.amount)}`, icon: TrendingUp, color: 'cyan' },
              { label: 'Transfers', value: `₹${fmt(report.transfers.amount)}`, icon: ArrowLeftRight, color: 'yellow-400' },
              { label: 'Marketplace', value: `₹${fmt(report.marketplace.total.amount)}`, icon: Store, color: 'pink-400' },
              { label: 'Level Income', value: `₹${fmt(report.levelIncome.amount)}`, icon: Coins, color: 'orange-400' },
            ].map((c) => (
              <div key={c.label} className="bg-white/5 border border-white/5 rounded-xl p-4 text-center">
                <c.icon size={20} className={`text-${c.color} mx-auto mb-2`} />
                <p className="text-white font-bold text-sm">{c.value}</p>
                <p className="text-white/30 text-[10px] uppercase tracking-wider mt-1">{c.label}</p>
              </div>
            ))}
          </div>

          {/* Detailed Sections */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Deposits */}
            <SectionCard title="Deposits" icon={ArrowDownToLine} color="green" downloadType="deposits">
              <StatRow label="Total" count={report.deposits.total.count} amount={report.deposits.total.amount} highlight />
              <StatRow label="Approved" count={report.deposits.approved.count} amount={report.deposits.approved.amount} />
              <StatRow label="Pending" count={report.deposits.pending.count} amount={report.deposits.pending.amount} />
              <StatRow label="Rejected" count={report.deposits.rejected.count} amount={report.deposits.rejected.amount} />
            </SectionCard>

            {/* Withdrawals */}
            <SectionCard title="Withdrawals" icon={ArrowUpFromLine} color="red-400" downloadType="withdrawals">
              <StatRow label="Total" count={report.withdrawals.total.count} amount={report.withdrawals.total.amount} highlight />
              <StatRow label="Approved" count={report.withdrawals.approved.count} amount={report.withdrawals.approved.amount} />
              <StatRow label="Pending" count={report.withdrawals.pending.count} amount={report.withdrawals.pending.amount} />
            </SectionCard>

            {/* Investments */}
            <SectionCard title="Investments" icon={TrendingUp} color="cyan" downloadType="investments">
              <StatRow label="Total" count={report.investments.total.count} amount={report.investments.total.amount} highlight />
              <StatRow label="Active" count={report.investments.active.count} amount={report.investments.active.amount} />
              <StatRow label="Completed" count={report.investments.completed.count} amount={report.investments.completed.amount} />
            </SectionCard>

            {/* Transfers */}
            <SectionCard title="P2P Transfers" icon={ArrowLeftRight} color="yellow-400" downloadType="transfers">
              <StatRow label="Total Transfers" count={report.transfers.count} amount={report.transfers.amount} highlight />
            </SectionCard>

            {/* Marketplace */}
            <SectionCard title="Marketplace" icon={Store} color="pink-400" downloadType="marketplace">
              <StatRow label="Total Orders" count={report.marketplace.total.count} amount={report.marketplace.total.amount} highlight />
              <StatRow label="Completed" count={report.marketplace.completed.count} amount={report.marketplace.completed.amount} />
            </SectionCard>

            {/* Level Income */}
            <SectionCard title="Level Income" icon={Coins} color="orange-400" downloadType="level_income" downloadLabel="Level-Income">
              <StatRow label="Total Credited" count={report.levelIncome.count} amount={report.levelIncome.amount} highlight />
            </SectionCard>

            {/* Users */}
            <SectionCard title="New Users" icon={Users} color="purple" downloadType="users">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-white font-semibold">Registered</span>
                <span className="text-sm font-bold text-white">{report.users.registered}</span>
              </div>
            </SectionCard>
          </div>

          {/* Daily Breakdown Table */}
          {report.daily && report.daily.deposits.length + report.daily.withdrawals.length + report.daily.investments.length > 0 && (
            <div className="bg-white/5 border border-white/5 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5 bg-purple/5">
                <BarChart3 size={16} className="text-purple" />
                <h3 className="text-sm font-bold text-purple">Daily Breakdown</h3>
              </div>

              {/* Bar Chart */}
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-5 text-[10px] uppercase tracking-wider">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-green" /> Deposits</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-400" /> Withdrawals</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-cyan" /> Investments</span>
                </div>

                {(() => {
                  // Merge all dates
                  const dateSet = new Set();
                  report.daily.deposits.forEach(d => dateSet.add(d.date));
                  report.daily.withdrawals.forEach(d => dateSet.add(d.date));
                  report.daily.investments.forEach(d => dateSet.add(d.date));
                  const dates = [...dateSet].sort();
                  const barMax = getBarMax();

                  return (
                    <div className="space-y-2">
                      {dates.map((date) => {
                        const dep = report.daily.deposits.find(d => d.date === date)?.total || 0;
                        const wit = report.daily.withdrawals.find(d => d.date === date)?.total || 0;
                        const inv = report.daily.investments.find(d => d.date === date)?.total || 0;
                        const usr = report.daily.users.find(d => d.date === date)?.count || 0;

                        return (
                          <div key={date} className="flex items-center gap-3">
                            <span className="text-white/40 text-xs w-20 shrink-0">{new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                            <div className="flex-1 space-y-1">
                              {dep > 0 && (
                                <div className="flex items-center gap-2">
                                  <div className="h-4 rounded-sm bg-green/80" style={{ width: `${Math.max((dep / barMax) * 100, 2)}%` }} />
                                  <span className="text-white/40 text-[10px]">₹{fmt(dep)}</span>
                                </div>
                              )}
                              {wit > 0 && (
                                <div className="flex items-center gap-2">
                                  <div className="h-4 rounded-sm bg-red-400/80" style={{ width: `${Math.max((wit / barMax) * 100, 2)}%` }} />
                                  <span className="text-white/40 text-[10px]">₹{fmt(wit)}</span>
                                </div>
                              )}
                              {inv > 0 && (
                                <div className="flex items-center gap-2">
                                  <div className="h-4 rounded-sm bg-cyan/80" style={{ width: `${Math.max((inv / barMax) * 100, 2)}%` }} />
                                  <span className="text-white/40 text-[10px]">₹{fmt(inv)}</span>
                                </div>
                              )}
                              {dep === 0 && wit === 0 && inv === 0 && usr > 0 && (
                                <span className="text-white/20 text-[10px]">Users only</span>
                              )}
                            </div>
                            {usr > 0 && (
                              <span className="text-purple/60 text-[10px] shrink-0">+{usr} user{usr > 1 ? 's' : ''}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Table */}
              <div className="overflow-x-auto border-t border-white/5">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-white/30 uppercase tracking-wider border-b border-white/5">
                      <th className="text-left px-5 py-3">Date</th>
                      <th className="text-right px-5 py-3">Deposits</th>
                      <th className="text-right px-5 py-3">Withdrawals</th>
                      <th className="text-right px-5 py-3">Investments</th>
                      <th className="text-right px-5 py-3">New Users</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const dateSet = new Set();
                      report.daily.deposits.forEach(d => dateSet.add(d.date));
                      report.daily.withdrawals.forEach(d => dateSet.add(d.date));
                      report.daily.investments.forEach(d => dateSet.add(d.date));
                      report.daily.users.forEach(d => dateSet.add(d.date));
                      const dates = [...dateSet].sort();

                      return dates.map((date) => (
                        <tr key={date} className="border-b border-white/5 hover:bg-white/2">
                          <td className="px-5 py-3 text-white/60">{new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                          <td className="px-5 py-3 text-right text-green font-medium">₹{fmt(report.daily.deposits.find(d => d.date === date)?.total || 0)}</td>
                          <td className="px-5 py-3 text-right text-red-400 font-medium">₹{fmt(report.daily.withdrawals.find(d => d.date === date)?.total || 0)}</td>
                          <td className="px-5 py-3 text-right text-cyan font-medium">₹{fmt(report.daily.investments.find(d => d.date === date)?.total || 0)}</td>
                          <td className="px-5 py-3 text-right text-purple font-medium">{report.daily.users.find(d => d.date === date)?.count || 0}</td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!report && !loading && (
        <div className="text-center py-20">
          <FileText size={48} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/30 text-sm mb-1">No report generated yet</p>
          <p className="text-white/20 text-xs">Select a date range and click Generate Report</p>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
