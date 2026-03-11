import React, { useState, useEffect } from 'react';
import {
  Users,
  ChevronDown,
  ChevronUp,
  Loader2,
  UserPlus,
  Copy,
  Check,
  Share2,
  Layers,
  TrendingUp,
  Search,
} from 'lucide-react';
import { api } from '../../utils/api';

const LEVEL_COLORS = [
  'from-green/20 to-green/5 border-green/20 text-green',
  'from-cyan/20 to-cyan/5 border-cyan/20 text-cyan',
  'from-purple/20 to-purple/5 border-purple/20 text-purple',
  'from-blue-400/20 to-blue-400/5 border-blue-400/20 text-blue-400',
  'from-yellow-400/20 to-yellow-400/5 border-yellow-400/20 text-yellow-400',
  'from-pink-400/20 to-pink-400/5 border-pink-400/20 text-pink-400',
];

const LEVEL_BADGE = [
  'bg-green/10 text-green',
  'bg-cyan/10 text-cyan',
  'bg-purple/10 text-purple',
  'bg-blue-400/10 text-blue-400',
  'bg-yellow-400/10 text-yellow-400',
  'bg-pink-400/10 text-pink-400',
];

const TeamPage = () => {
  const [loading, setLoading] = useState(true);
  const [levels, setLevels] = useState([]);
  const [totalMembers, setTotalMembers] = useState(0);
  const [referralCode, setReferralCode] = useState('');
  const [expandedLevels, setExpandedLevels] = useState({ 1: true });
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [teamData, refData] = await Promise.all([
          api.myTeamMembers(),
          api.referralDashboardStats(),
        ]);
        setLevels(teamData.levels || []);
        setTotalMembers(teamData.totalMembers || 0);
        setReferralCode(refData.referral_code || '');
      } catch (err) {
        console.error('Team fetch error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleLevel = (lvl) => {
    setExpandedLevels((prev) => ({ ...prev, [lvl]: !prev[lvl] }));
  };

  const referralLink = referralCode
    ? `${window.location.origin}/signup?ref=${referralCode}`
    : '';

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  const filterMembers = (members) => {
    if (!searchQuery.trim()) return members;
    const q = searchQuery.toLowerCase();
    return members.filter(
      (m) =>
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.mobile?.includes(q)
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="animate-spin text-purple" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">My Team</h1>
        <p className="text-white/40 text-sm mt-1">Your referral network across 6 levels</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} className="text-green" />
            <span className="text-white/40 text-xs">Total Team</span>
          </div>
          <p className="text-white text-xl font-bold">{totalMembers}</p>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <UserPlus size={16} className="text-cyan" />
            <span className="text-white/40 text-xs">Direct Referrals</span>
          </div>
          <p className="text-white text-xl font-bold">{levels[0]?.members?.length || 0}</p>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Layers size={16} className="text-purple" />
            <span className="text-white/40 text-xs">Active Levels</span>
          </div>
          <p className="text-white text-xl font-bold">
            {levels.filter((l) => l.members.length > 0).length}
          </p>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-yellow-400" />
            <span className="text-white/40 text-xs">Total Invested</span>
          </div>
          <p className="text-white text-xl font-bold">
            {levels
              .flatMap((l) => l.members)
              .reduce((s, m) => s + Number(m.totalInvested), 0)
              .toFixed(2)}{' '}
            <span className="text-sm text-white/40">VC</span>
          </p>
        </div>
      </div>

      {/* Referral Invite Box */}
      <div className="bg-linear-to-r from-purple/10 to-cyan/5 border border-white/5 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Share2 size={18} className="text-purple" />
          <h3 className="text-white font-bold">Invite & Grow Your Team</h3>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1">
            <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white/50 text-sm truncate font-mono">
              {referralLink || '—'}
            </div>
            <button
              onClick={() => handleCopy(referralLink, 'link')}
              className="px-4 py-2.5 bg-purple/20 hover:bg-purple/30 text-purple rounded-xl text-sm font-medium flex items-center gap-1.5 transition-all shrink-0"
            >
              {copied === 'link' ? <Check size={14} /> : <Copy size={14} />}
              {copied === 'link' ? 'Copied' : 'Copy Link'}
            </button>
          </div>
          <button
            onClick={() => handleCopy(referralCode, 'code')}
            className="px-4 py-2.5 bg-cyan/10 hover:bg-cyan/20 text-cyan rounded-xl text-sm font-medium flex items-center gap-1.5 transition-all shrink-0"
          >
            {copied === 'code' ? <Check size={14} /> : <Copy size={14} />}
            Code: {referralCode || '—'}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Search team members by name, email, or mobile..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-purple/50 focus:outline-none transition-all"
        />
      </div>

      {/* Level Accordion */}
      <div className="space-y-4">
        {levels.map((lvl, idx) => {
          const filtered = filterMembers(lvl.members);
          const isExpanded = expandedLevels[lvl.level];

          return (
            <div
              key={lvl.level}
              className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden"
            >
              {/* Level Header */}
              <button
                onClick={() => toggleLevel(lvl.level)}
                className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-white/2 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center justify-center w-9 h-9 rounded-xl text-sm font-bold ${LEVEL_BADGE[idx]}`}
                  >
                    L{lvl.level}
                  </span>
                  <div className="text-left">
                    <p className="text-white font-semibold text-sm">
                      Level {lvl.level}{' '}
                      {lvl.level === 1 && (
                        <span className="text-white/30 font-normal text-xs ml-1">
                          (Direct Referrals)
                        </span>
                      )}
                    </p>
                    <p className="text-white/30 text-xs">
                      {lvl.percentage}% income on investments
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${LEVEL_BADGE[idx]}`}
                  >
                    {lvl.members.length} members
                  </span>
                  {isExpanded ? (
                    <ChevronUp size={18} className="text-white/30" />
                  ) : (
                    <ChevronDown size={18} className="text-white/30" />
                  )}
                </div>
              </button>

              {/* Members Table */}
              {isExpanded && (
                <div className="border-t border-white/5">
                  {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-white/20">
                      <Users size={32} className="mb-2" />
                      <p className="text-sm">
                        {lvl.members.length === 0
                          ? 'No members at this level yet'
                          : 'No matching members'}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/5 text-white/30 text-xs">
                            <th className="text-left px-4 md:px-5 py-3 font-medium">#</th>
                            <th className="text-left px-4 md:px-5 py-3 font-medium">Name</th>
                            <th className="text-left px-4 md:px-5 py-3 font-medium hidden sm:table-cell">
                              Email
                            </th>
                            <th className="text-left px-4 md:px-5 py-3 font-medium hidden md:table-cell">
                              Mobile
                            </th>
                            <th className="text-right px-4 md:px-5 py-3 font-medium">Invested</th>
                            <th className="text-right px-4 md:px-5 py-3 font-medium">
                              Your Earning
                            </th>
                            <th className="text-right px-4 md:px-5 py-3 font-medium hidden sm:table-cell">
                              Joined
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map((m, mi) => (
                            <tr
                              key={m.id}
                              className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors"
                            >
                              <td className="px-4 md:px-5 py-3 text-white/30">{mi + 1}</td>
                              <td className="px-4 md:px-5 py-3">
                                <p className="text-white font-medium">{m.name || '—'}</p>
                                <p className="text-white/30 text-xs sm:hidden">{m.email || ''}</p>
                              </td>
                              <td className="px-4 md:px-5 py-3 text-white/50 hidden sm:table-cell">
                                {m.email || '—'}
                              </td>
                              <td className="px-4 md:px-5 py-3 text-white/50 hidden md:table-cell">
                                {m.mobile || '—'}
                              </td>
                              <td className="px-4 md:px-5 py-3 text-right">
                                <span className="text-cyan font-medium">
                                  {Number(m.totalInvested).toFixed(2)}
                                </span>
                                <span className="text-white/30 text-xs ml-1">VC</span>
                              </td>
                              <td className="px-4 md:px-5 py-3 text-right">
                                <span className="text-green font-medium">
                                  {Number(m.incomeEarned).toFixed(2)}
                                </span>
                                <span className="text-white/30 text-xs ml-1">VC</span>
                              </td>
                              <td className="px-4 md:px-5 py-3 text-right text-white/30 text-xs hidden sm:table-cell">
                                {m.createdAt
                                  ? new Date(m.createdAt).toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                  })
                                  : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamPage;
