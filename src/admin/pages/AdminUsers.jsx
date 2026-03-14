import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  ShieldCheck,
  ShieldOff,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  Hash,
  Eye,
  Wallet,
  X,
  Plus,
  TrendingUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  Loader2,
} from 'lucide-react';
import { api, API_BASE_URL } from '../../utils/api';

const fmt = (n) => Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [processing, setProcessing] = useState(null);

  // View Detail modal
  const [detailUser, setDetailUser] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Add Wallet modal
  const [walletUser, setWalletUser] = useState(null);
  const [walletAmount, setWalletAmount] = useState('');
  const [walletNote, setWalletNote] = useState('');
  const [walletProcessing, setWalletProcessing] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await api.getAdminUsers();
      setUsers(data.users || []);
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggleBlock = async (userId) => {
    setProcessing(userId);
    try {
      await api.toggleBlockUser(userId);
      await fetchUsers();
    } catch (err) {
      alert(err.message || 'Failed to update user.');
    } finally {
      setProcessing(null);
    }
  };

  const handleViewDetail = async (userId) => {
    setDetailLoading(true);
    setDetailUser(null);
    try {
      const data = await api.getAdminUserDetail(userId);
      setDetailUser(data);
    } catch (err) {
      alert(err.message || 'Failed to load user details.');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleAddWallet = async () => {
    if (!walletUser || !walletAmount || Number(walletAmount) <= 0) return;
    setWalletProcessing(true);
    try {
      await api.adminAddWallet(walletUser.id, Number(walletAmount), walletNote);
      alert(`${walletAmount} VC added to ${walletUser.name || walletUser.email}'s wallet`);
      setWalletUser(null);
      setWalletAmount('');
      setWalletNote('');
    } catch (err) {
      alert(err.message || 'Failed to add wallet.');
    } finally {
      setWalletProcessing(false);
    }
  };

  const filtered = users.filter((u) => {
    if (filter === 'active') return !u.is_blocked && u.user_type !== 'admin';
    if (filter === 'blocked') return u.is_blocked;
    if (filter === 'admin') return u.user_type === 'admin';
    return true;
  }).filter((u) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      (u.name || '').toLowerCase().includes(s) ||
      (u.email || '').toLowerCase().includes(s) ||
      (u.mobile || '').includes(s) ||
      (u.referral_code || '').toLowerCase().includes(s) ||
      String(u.id).includes(s)
    );
  });

  const counts = {
    all: users.length,
    active: users.filter((u) => !u.is_blocked && u.user_type !== 'admin').length,
    blocked: users.filter((u) => u.is_blocked).length,
    admin: users.filter((u) => u.user_type === 'admin').length,
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
          <Users size={24} className="text-purple" /> All Users
        </h1>
        <p className="text-white/40 text-sm mt-1">Manage platform users &mdash; block or unblock accounts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: counts.all, color: 'purple', icon: Users },
          { label: 'Active', value: counts.active, color: 'green', icon: UserCheck },
          { label: 'Blocked', value: counts.blocked, color: 'red-400', icon: UserX },
          { label: 'Admins', value: counts.admin, color: 'cyan', icon: ShieldCheck },
        ].map((s) => (
          <div key={s.label} className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg bg-${s.color}/10 flex items-center justify-center`}>
              <s.icon size={18} className={`text-${s.color}`} />
            </div>
            <div>
              <p className="text-white text-lg font-bold">{s.value}</p>
              <p className="text-white/40 text-xs">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 flex-1 overflow-x-auto">
          {['all', 'active', 'blocked', 'admin'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${filter === f
                ? 'bg-purple/20 text-purple border border-purple/30'
                : 'bg-white/5 text-white/40 border border-white/5 hover:text-white'
                }`}
            >
              {f} ({counts[f]})
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search by name, email, mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-purple/50 w-full sm:w-72"
          />
        </div>
      </div>

      {/* Users Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users size={40} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">No users found</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white/5 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-4">ID</th>
                  <th className="text-left px-5 py-4">User</th>
                  <th className="text-left px-5 py-4">Contact</th>
                  <th className="text-left px-5 py-4">Referral Code</th>
                  <th className="text-left px-5 py-4">Joined</th>
                  <th className="text-left px-5 py-4">Status</th>
                  <th className="text-right px-5 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-5 py-4 text-white/50 font-mono text-xs">#{u.id}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple/10 flex items-center justify-center text-purple font-bold text-sm uppercase">
                          {(u.name || u.email || '?')[0]}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{u.name || '—'}</p>
                          <p className="text-white/30 text-xs">{u.user_type === 'admin' ? 'Admin' : 'User'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-0.5">
                        <p className="text-white/60 text-xs flex items-center gap-1"><Mail size={10} /> {u.email || '—'}</p>
                        <p className="text-white/60 text-xs flex items-center gap-1"><Phone size={10} /> {u.mobile || '—'}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-purple/80 font-mono text-xs bg-purple/5 px-2 py-1 rounded">{u.referral_code || '—'}</span>
                    </td>
                    <td className="px-5 py-4 text-white/40 text-xs">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-4">
                      {u.user_type === 'admin' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase bg-cyan/10 text-cyan">
                          <ShieldCheck size={10} /> Admin
                        </span>
                      ) : u.is_blocked ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase bg-red-400/10 text-red-400">
                          <UserX size={10} /> Blocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase bg-green/10 text-green">
                          <UserCheck size={10} /> Active
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* View Detail */}
                        <button
                          onClick={() => handleViewDetail(u.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-purple/10 text-purple hover:bg-purple/20 transition-all"
                        >
                          <Eye size={12} /> View
                        </button>
                        {u.user_type !== 'admin' && (
                          <>
                            {/* Add Wallet */}
                            <button
                              onClick={() => setWalletUser(u)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan/10 text-cyan hover:bg-cyan/20 transition-all"
                            >
                              <Plus size={12} /> Add VC
                            </button>
                            {/* Block/Unblock */}
                            <button
                              onClick={() => handleToggleBlock(u.id)}
                              disabled={processing === u.id}
                              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${u.is_blocked
                                ? 'bg-green/10 text-green hover:bg-green/20'
                                : 'bg-red-400/10 text-red-400 hover:bg-red-400/20'
                                } disabled:opacity-40`}
                            >
                              {processing === u.id ? (
                                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              ) : u.is_blocked ? (
                                <><ShieldCheck size={12} /> Unblock</>
                              ) : (
                                <><ShieldOff size={12} /> Block</>
                              )}
                            </button>
                            {/* Login as User */}
                            <button
                              onClick={async () => {
                                try {
                                  const res = await fetch(`${API_BASE_URL}/api/admin/users/${u.id}/impersonate`, {
                                    method: 'POST',
                                    headers: { Authorization: `Bearer ${sessionStorage.getItem('vc_token')}` },
                                  });
                                  const data = await res.json();
                                  if (!res.ok || !data.token) throw new Error(data.message || 'Failed to impersonate');
                                  sessionStorage.setItem('adminToken', sessionStorage.getItem('vc_token'));
                                  sessionStorage.setItem('vc_token', data.token);
                                  sessionStorage.setItem('adminUserMode', u.id);
                                  window.location.href = '/dashboard';
                                } catch (err) {
                                  alert(err.message || 'Failed to login as user.');
                                }
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-green/10 text-green hover:bg-green/20 transition-all"
                            >
                              <ShieldCheck size={12} /> Login
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((u) => (
              <div key={u.id} className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple/10 flex items-center justify-center text-purple font-bold uppercase">
                      {(u.name || u.email || '?')[0]}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{u.name || '—'}</p>
                      <p className="text-white/30 text-xs">#{u.id}</p>
                    </div>
                  </div>
                  {u.user_type === 'admin' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase bg-cyan/10 text-cyan">
                      <ShieldCheck size={10} /> Admin
                    </span>
                  ) : u.is_blocked ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase bg-red-400/10 text-red-400">
                      <UserX size={10} /> Blocked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase bg-green/10 text-green">
                      <UserCheck size={10} /> Active
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs">
                  <p className="text-white/50 flex items-center gap-2"><Mail size={12} /> {u.email || '—'}</p>
                  <p className="text-white/50 flex items-center gap-2"><Phone size={12} /> {u.mobile || '—'}</p>
                  <p className="text-white/50 flex items-center gap-2"><Hash size={12} /> {u.referral_code || '—'}</p>
                  <p className="text-white/50 flex items-center gap-2"><Calendar size={12} /> {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}</p>
                </div>

                {u.user_type !== 'admin' ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetail(u.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-purple/10 text-purple hover:bg-purple/20 transition-all"
                    >
                      <Eye size={14} /> View
                    </button>
                    <button
                      onClick={() => setWalletUser(u)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-cyan/10 text-cyan hover:bg-cyan/20 transition-all"
                    >
                      <Plus size={14} /> Add VC
                    </button>
                    <button
                      onClick={() => handleToggleBlock(u.id)}
                      disabled={processing === u.id}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${u.is_blocked
                        ? 'bg-green/10 text-green hover:bg-green/20'
                        : 'bg-red-400/10 text-red-400 hover:bg-red-400/20'
                        } disabled:opacity-40`}
                    >
                      {processing === u.id ? (
                        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : u.is_blocked ? (
                        <><ShieldCheck size={14} /> Unblock</>
                      ) : (
                        <><ShieldOff size={14} /> Block</>
                      )}
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch(`${API_BASE_URL}/api/admin/users/${u.id}/impersonate`, {
                            method: 'POST',
                            headers: { Authorization: `Bearer ${sessionStorage.getItem('vc_token')}` },
                          });
                          const data = await res.json();
                          if (!res.ok || !data.token) throw new Error(data.message || 'Failed');
                          sessionStorage.setItem('adminToken', sessionStorage.getItem('vc_token'));
                          sessionStorage.setItem('vc_token', data.token);
                          sessionStorage.setItem('adminUserMode', u.id);
                          window.location.href = '/dashboard';
                        } catch (err) { alert(err.message); }
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-green/10 text-green hover:bg-green/20 transition-all"
                    >
                      <ShieldCheck size={14} /> Login
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleViewDetail(u.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-purple/10 text-purple hover:bg-purple/20 transition-all"
                  >
                    <Eye size={14} /> View Detail
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      {/* View Detail Modal */}
      {(detailUser || detailLoading) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-dark border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">User Details</h2>
              <button onClick={() => setDetailUser(null)} className="text-white/30 hover:text-white">
                <X size={20} />
              </button>
            </div>
            {detailLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={28} className="animate-spin text-purple" />
              </div>
            ) : detailUser && (
              <div className="p-5 space-y-4 overflow-y-auto">
                {/* User Info */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-purple/10 flex items-center justify-center text-purple font-bold text-xl uppercase">
                    {(detailUser.user?.name || detailUser.user?.email || '?')[0]}
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">{detailUser.user?.name || '—'}</p>
                    <p className="text-white/40 text-sm">{detailUser.user?.email || '—'}</p>
                    <p className="text-white/30 text-xs">{detailUser.user?.mobile || '—'}</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Wallet size={14} className="text-green" />
                      <p className="text-white/40 text-[10px] uppercase">Wallet Balance</p>
                    </div>
                    <p className="text-white font-bold">{fmt(detailUser.balance?.wallet)} VC</p>
                    <p className="text-white/30 text-[10px]">Available: {fmt(detailUser.balance?.available)} VC</p>
                  </div>
                  {/* <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <ArrowDownToLine size={14} className="text-cyan" />
                      <p className="text-white/40 text-[10px] uppercase">Total Deposits</p>
                    </div>
                    <p className="text-white font-bold">{fmt(detailUser.depositStats?.totalDeposited)} VC</p>
                    <p className="text-white/30 text-[10px]">{detailUser.depositStats?.totalCount || 0} transactions</p>
                  </div> */}
                  <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp size={14} className="text-purple" />
                      <p className="text-white/40 text-[10px] uppercase">Investments</p>
                    </div>
                    <p className="text-white font-bold">{fmt(detailUser.investmentStats?.activeAmount)} VC</p>
                    <p className="text-white/30 text-[10px]">{detailUser.investmentStats?.activeCount || 0} active / {detailUser.investmentStats?.totalCount || 0} total</p>
                  </div>
                  <div className="bg-white/5 border border-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <ArrowUpFromLine size={14} className="text-red-400" />
                      <p className="text-white/40 text-[10px] uppercase">Withdrawals</p>
                    </div>
                    <p className="text-white font-bold">{fmt(detailUser.withdrawalStats?.totalAmount)} VC</p>
                    <p className="text-white/30 text-[10px]">{detailUser.withdrawalStats?.totalCount || 0} approved</p>
                  </div>
                </div>

                {/* Extra Info */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Referral Code</span>
                    <span className="text-purple font-mono font-bold">{detailUser.user?.referral_code || '—'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Direct Referrals</span>
                    <span className="text-white font-bold">{detailUser.referralCount || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Status</span>
                    <span className={`font-bold ${detailUser.user?.is_blocked ? 'text-red-400' : 'text-green'}`}>
                      {detailUser.user?.is_blocked ? 'Blocked' : 'Active'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Market Locked</span>
                    <span className="text-white font-bold">{fmt(detailUser.balance?.marketLocked)} VC</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Pending Withdrawals</span>
                    <span className="text-white font-bold">{fmt(detailUser.balance?.pendingWithdrawals)} VC</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Joined</span>
                    <span className="text-white">{detailUser.user?.created_at ? new Date(detailUser.user.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}</span>
                  </div>
                </div>

                {/* Actions */}
                {detailUser.user?.user_type !== 'admin' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setWalletUser(detailUser.user); setDetailUser(null); }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-cyan/10 text-cyan hover:bg-cyan/20 transition-all"
                    >
                      <Plus size={16} /> Add VC to Wallet
                    </button>
                    <button
                      onClick={() => { handleToggleBlock(detailUser.user.id); setDetailUser(null); }}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${detailUser.user?.is_blocked
                        ? 'bg-green/10 text-green hover:bg-green/20'
                        : 'bg-red-400/10 text-red-400 hover:bg-red-400/20'
                        }`}
                    >
                      {detailUser.user?.is_blocked ? <><ShieldCheck size={16} /> Unblock</> : <><ShieldOff size={16} /> Block</>}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Wallet Modal */}
      {walletUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-dark border border-white/10 rounded-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">Add VC to Wallet</h2>
              <button onClick={() => { setWalletUser(null); setWalletAmount(''); setWalletNote(''); }} className="text-white/30 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* User info */}
              <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl p-3">
                <div className="w-10 h-10 rounded-full bg-purple/10 flex items-center justify-center text-purple font-bold uppercase">
                  {(walletUser.name || walletUser.email || '?')[0]}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{walletUser.name || '—'}</p>
                  <p className="text-white/30 text-xs">{walletUser.email || '—'} &bull; #{walletUser.id}</p>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="text-white/40 text-xs font-medium mb-1.5 block">Amount (VC)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={walletAmount}
                  onChange={(e) => setWalletAmount(e.target.value)}
                  placeholder="Enter VC amount"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-cyan/50"
                />
              </div>

              {/* Note */}
              <div>
                <label className="text-white/40 text-xs font-medium mb-1.5 block">Note (optional)</label>
                <input
                  type="text"
                  value={walletNote}
                  onChange={(e) => setWalletNote(e.target.value)}
                  placeholder="e.g. Bonus, Compensation"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-cyan/50"
                />
              </div>

              <button
                onClick={handleAddWallet}
                disabled={walletProcessing || !walletAmount || Number(walletAmount) <= 0}
                className="w-full bg-linear-to-r from-cyan to-purple text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm hover:brightness-110 transition-all disabled:opacity-40"
              >
                {walletProcessing ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <><Wallet size={16} /> Add {walletAmount ? `${walletAmount} VC` : 'VC'} to Wallet</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
