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
} from 'lucide-react';
import { api } from '../../utils/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | active | blocked | admin
  const [processing, setProcessing] = useState(null);

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
                      {u.user_type !== 'admin' && (
                        <button
                          onClick={() => handleToggleBlock(u.id)}
                          disabled={processing === u.id}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${u.is_blocked
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
                      )}
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

                {u.user_type !== 'admin' && (
                  <button
                    onClick={() => handleToggleBlock(u.id)}
                    disabled={processing === u.id}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${u.is_blocked
                        ? 'bg-green/10 text-green hover:bg-green/20'
                        : 'bg-red-400/10 text-red-400 hover:bg-red-400/20'
                      } disabled:opacity-40`}
                  >
                    {processing === u.id ? (
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : u.is_blocked ? (
                      <><ShieldCheck size={14} /> Unblock User</>
                    ) : (
                      <><ShieldOff size={14} /> Block User</>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminUsers;
