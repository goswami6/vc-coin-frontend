import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Copy,
  Check,
  Share2,
  Gift,
  Layers,
  IndianRupee,
  Loader2,
} from 'lucide-react';
import { api } from '../../utils/api';

const LEVEL_DATA = [
  { level: 1, pct: '5%' },
  { level: 2, pct: '2%' },
  { level: 3, pct: '1%' },
  { level: 4, pct: '1%' },
  { level: 5, pct: '0.5%' },
  { level: 6, pct: '0.5%' },
];

const StatCard = ({ icon, label, value, color, change }) => {
  const Icon = icon;
  return (
    <div className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
        {change && (
          <span className={`flex items-center gap-0.5 text-xs font-bold ${change > 0 ? 'text-green' : 'text-red-400'}`}>
            {change > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="text-white/40 text-xs font-medium mb-1">{label}</p>
      <p className="text-white text-xl font-bold">{value}</p>
    </div>
  );
};

const QuickAction = ({ icon, label, to, color }) => {
  const Icon = icon;
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-2 p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-white/10 hover:bg-white/7 transition-all group"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
        <Icon size={20} />
      </div>
      <span className="text-xs font-medium text-white/60">{label}</span>
    </Link>
  );
};

const DashboardHome = () => {
  const { user } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [invested, setInvested] = useState(0);
  const [referralCode, setReferralCode] = useState('');
  const [directCount, setDirectCount] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [teamByLevel, setTeamByLevel] = useState([]);
  const [recentIncomes, setRecentIncomes] = useState([]);
  const [copied, setCopied] = useState('');
  const [recentTxns, setRecentTxns] = useState([]);
  const [vcRate, setVcRate] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const [balData, refData, txnData, rateData] = await Promise.allSettled([
          api.getBalance(),
          api.myReferralInfo(),
          api.myTransactions(),
          api.getVcRate(),
        ]);
        if (balData.status === 'fulfilled') {
          setBalance(balData.value.balance ?? 0);
          setInvested(balData.value.totalInvested ?? 0);
        }
        if (refData.status === 'fulfilled') {
          setReferralCode(refData.value.referral_code || '');
          setDirectCount(refData.value.directReferrals?.length || 0);
          setTotalIncome(refData.value.incomeStats?.totalIncome || 0);
          setTeamByLevel(refData.value.teamByLevel || []);
          setRecentIncomes(refData.value.recentIncomes?.slice(0, 5) || []);
        }
        if (txnData.status === 'fulfilled') {
          setRecentTxns((txnData.value.transactions || []).slice(0, 5));
        }
        if (rateData.status === 'fulfilled') {
          setVcRate(rateData.value.vc_rate ?? 0);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const referralLink = referralCode
    ? `${window.location.origin}/signup?ref=${referralCode}`
    : '';

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const totalTeam = teamByLevel.reduce((s, l) => s + l.count, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="animate-spin text-purple" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Welcome back, <span className="text-green">{user?.name?.split(' ')[0] || 'User'}</span>
        </h1>
        <p className="text-white/40 text-sm mt-1">Here's your account overview</p>
      </div>

      {/* VC Coin Rate Banner */}
      <div className="bg-linear-to-r from-green/10 via-cyan/5 to-purple/10 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green/10 rounded-xl flex items-center justify-center">
            <IndianRupee size={20} className="text-green" />
          </div>
          <div>
            <p className="text-white/40 text-xs">VC Coin Live Rate</p>
            <p className="text-white text-lg font-bold">1 VC = <span className="text-green">{Number(vcRate).toFixed(2)}</span></p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white/30 text-xs">Your Balance Worth</p>
          <p className="text-cyan text-lg font-bold">{(Number(balance) * Number(vcRate)).toFixed(2)}</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Wallet} label="Total Balance" value={`${Number(balance).toFixed(2)} VC`} color="bg-green/10 text-green" />
        <StatCard icon={TrendingUp} label="Total Invested" value={`${Number(invested).toFixed(2)} VC`} color="bg-cyan/10 text-cyan" />
        <StatCard icon={Gift} label="Level Income" value={`${Number(totalIncome).toFixed(2)} VC`} color="bg-purple/10 text-purple" />
        <StatCard icon={Users} label="Team Members" value={String(totalTeam)} color="bg-blue-400/10 text-blue-400" />
      </div>

      {/* Referral Section */}
      <div className="bg-linear-to-br from-purple/10 to-cyan/5 border border-white/5 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Share2 size={20} className="text-purple" />
          <h2 className="text-lg font-bold text-white">Refer & Earn</h2>
        </div>
        <p className="text-white/40 text-sm mb-5">
          Share your referral link and earn up to 6 levels of investment income from your network.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Referral Code */}
          <div>
            <label className="text-white/40 text-xs font-medium mb-1.5 block">Your Referral Code</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm tracking-wider">
                {referralCode || '—'}
              </div>
              <button
                onClick={() => handleCopy(referralCode, 'code')}
                className="w-11 h-11 bg-purple/10 hover:bg-purple/20 text-purple rounded-xl flex items-center justify-center transition-all shrink-0"
              >
                {copied === 'code' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* Referral Link */}
          <div>
            <label className="text-white/40 text-xs font-medium mb-1.5 block">Your Referral Link</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/50 text-sm truncate">
                {referralLink || '—'}
              </div>
              <button
                onClick={() => handleCopy(referralLink, 'link')}
                className="w-11 h-11 bg-cyan/10 hover:bg-cyan/20 text-cyan rounded-xl flex items-center justify-center transition-all shrink-0"
              >
                {copied === 'link' ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4 text-xs text-white/30">
          <span className="bg-green/10 text-green px-2 py-0.5 rounded-full font-medium">{directCount} Direct Referrals</span>
          <span className="bg-purple/10 text-purple px-2 py-0.5 rounded-full font-medium">{totalTeam} Total Team</span>
        </div>
      </div>

      {/* Level Income Table */}
      <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-1">
          <Layers size={20} className="text-cyan" />
          <h2 className="text-lg font-bold text-white">Investment Level Income</h2>
        </div>
        <p className="text-white/40 text-xs mb-5">
          Earn extra from your network with 6 Levels Income
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-white/40 text-xs">
                <th className="text-left px-4 py-2.5 font-medium">Level</th>
                <th className="text-center px-4 py-2.5 font-medium">Income %</th>
                <th className="text-center px-4 py-2.5 font-medium">Members</th>
                <th className="text-right px-4 py-2.5 font-medium">Earned</th>
              </tr>
            </thead>
            <tbody>
              {LEVEL_DATA.map((ld) => {
                const lv = teamByLevel.find((t) => t.level === ld.level);
                return (
                  <tr key={ld.level} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-purple/10 text-purple text-xs font-bold">
                        L{ld.level}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-green font-bold">{ld.pct}</span>
                    </td>
                    <td className="px-4 py-3 text-center text-white/60">
                      {lv?.count || 0}
                    </td>
                    <td className="px-4 py-3 text-right text-white font-medium">
                      {/* Earned shown from recent incomes if available */}
                      {recentIncomes
                        .filter((i) => i.level === ld.level)
                        .reduce((s, i) => s + Number(i.amount), 0)
                        .toFixed(2)}{' '}
                      VC
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-white/10">
                <td className="px-4 py-3 text-white font-bold" colSpan={2}>Total</td>
                <td className="px-4 py-3 text-center text-white font-bold">{totalTeam}</td>
                <td className="px-4 py-3 text-right text-green font-bold">{Number(totalIncome).toFixed(2)} VC</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-4 sm:grid-cols-4 gap-3">
          <QuickAction icon={ArrowDownToLine} label="Deposit" to="/dashboard/deposit" color="bg-green/10 text-green" />
          <QuickAction icon={ArrowUpFromLine} label="Withdraw" to="/dashboard/withdraw" color="bg-cyan/10 text-cyan" />
          <QuickAction icon={TrendingUp} label="Invest" to="/dashboard/investments" color="bg-purple/10 text-purple" />
          <QuickAction icon={Users} label="Team" to="/dashboard/team" color="bg-blue-400/10 text-blue-400" />
        </div>
      </div>

      {/* Recent Activity + Account Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white/5 border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Recent Activity</h2>
            <Link to="/dashboard/transactions" className="text-xs text-cyan hover:underline">View All</Link>
          </div>
          {recentTxns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-white/20">
              <Clock size={40} className="mb-3" />
              <p className="text-sm">No recent transactions</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTxns.map((txn, i) => {
                const isCredit = ['deposit', 'transfer_received', 'marketplace_buy'].includes(txn.type);
                return (
                  <div key={`${txn.type}-${txn.id}-${i}`} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                    <div>
                      <p className="text-white text-sm font-medium capitalize">{txn.type.replace(/_/g, ' ')}</p>
                      <p className="text-white/30 text-xs">{txn.detail || '—'}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${isCredit ? 'text-green' : 'text-red-400'}`}>
                        {isCredit ? '+' : '-'}{Number(txn.amount).toFixed(2)} VC
                      </p>
                      <p className="text-white/20 text-[10px]">
                        {new Date(txn.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Account Info</h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-white/30 mb-1">Name</p>
              <p className="text-sm text-white font-medium">{user?.name || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-white/30 mb-1">Email</p>
              <p className="text-sm text-white font-medium">{user?.email || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-white/30 mb-1">Mobile</p>
              <p className="text-sm text-white font-medium">{user?.mobile || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-white/30 mb-1">Referral Code</p>
              <p className="text-sm text-purple font-mono font-bold">{referralCode || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-white/30 mb-1">Member Since</p>
              <p className="text-sm text-white font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
