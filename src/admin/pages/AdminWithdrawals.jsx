import React, { useState, useEffect } from 'react';
import {
  ArrowUpFromLine, Clock, CheckCircle, XCircle, Loader2,
  Eye, X, Banknote, CreditCard, DollarSign,
} from 'lucide-react';
import { api } from '../../utils/api';

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [adminNote, setAdminNote] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.getAllWithdrawals();
      setWithdrawals(data.withdrawals || []);
      setStats(data.stats || {});
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAction = async (id, status) => {
    setActionId(id);
    try {
      await api.updateWithdrawalStatus(id, { status, admin_note: adminNote });
      setAdminNote('');
      setDetailItem(null);
      fetchData();
    } catch { }
    setActionId(null);
  };

  const filtered = filter === 'all' ? withdrawals : withdrawals.filter((w) => w.status === filter);

  const statusColor = (s) => {
    if (s === 'pending') return 'text-yellow-400 bg-yellow-400/10';
    if (s === 'approved') return 'text-green bg-green/10';
    if (s === 'rejected') return 'text-red-400 bg-red-400/10';
    return 'text-white/40 bg-white/5';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ArrowUpFromLine className="text-purple" size={28} /> Withdrawal Requests
        </h1>
        <p className="text-white/50 text-sm mt-1">Review & approve user withdrawal requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Pending', value: stats.pending || 0, sub: `${(stats.pendingAmount || 0).toFixed(2)} VC`, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
          { label: 'Approved', value: stats.approved || 0, sub: `${(stats.approvedAmount || 0).toFixed(2)} VC`, color: 'text-green', bg: 'bg-green/10' },
          { label: 'Rejected', value: stats.rejected || 0, sub: '', color: 'text-red-400', bg: 'bg-red-400/10' },
          { label: 'Total Requests', value: withdrawals.length, sub: '', color: 'text-purple', bg: 'bg-purple/10' },
        ].map((s, i) => (
          <div key={i} className={`rounded-xl p-4 border border-white/5 ${s.bg}`}>
            <p className="text-white/40 text-xs mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            {s.sub && <p className="text-white/30 text-xs mt-0.5">{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'approved', 'rejected'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-purple text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
          >
            {f} ({f === 'all' ? withdrawals.length : withdrawals.filter((w) => w.status === f).length})
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-purple" size={32} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#1a1230] rounded-2xl border border-white/5 p-10 text-center">
          <ArrowUpFromLine className="mx-auto text-white/20 mb-3" size={40} />
          <p className="text-white/40">No withdrawal requests found.</p>
        </div>
      ) : (
        <div className="bg-[#1a1230] rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-white/40 text-xs">
                  <th className="text-left p-4">ID</th>
                  <th className="text-left p-4">User</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Method</th>
                  <th className="text-left p-4">Account Details</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((w) => (
                  <tr key={w.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-white/60">#{w.id}</td>
                    <td className="p-4">
                      <div>
                        <p className="text-white font-medium text-xs">{w.user_name}</p>
                        <p className="text-white/30 text-[11px]">{w.user_email}</p>
                      </div>
                    </td>
                    <td className="p-4 text-white font-semibold">{Number(w.amount).toFixed(2)} VC</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-white/60 text-xs">
                        {w.method === 'upi' ? <CreditCard size={12} /> : <Banknote size={12} />}
                        {w.method === 'upi' ? 'UPI' : 'Bank'}
                      </span>
                    </td>
                    <td className="p-4 text-white/50 text-xs max-w-[200px] truncate">{w.account_details}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${statusColor(w.status)}`}>
                        {w.status === 'pending' && <Clock size={12} />}
                        {w.status === 'approved' && <CheckCircle size={12} />}
                        {w.status === 'rejected' && <XCircle size={12} />}
                        {w.status}
                      </span>
                    </td>
                    <td className="p-4 text-white/40 text-xs">{new Date(w.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {w.status === 'pending' && (
                          <>
                            <button
                              onClick={() => { setDetailItem(w); setAdminNote(''); }}
                              className="px-3 py-1.5 rounded-lg bg-green/20 text-green text-xs font-semibold hover:bg-green/30"
                            >
                              Review
                            </button>
                          </>
                        )}
                        {w.status !== 'pending' && (
                          <button
                            onClick={() => { setDetailItem(w); setAdminNote(w.admin_note || ''); }}
                            className="px-3 py-1.5 rounded-lg bg-white/5 text-white/50 text-xs font-semibold hover:bg-white/10"
                          >
                            <Eye size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail / Review Modal */}
      {detailItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDetailItem(null)}>
          <div className="bg-[#1a1230] rounded-2xl border border-white/10 p-6 max-w-lg w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Withdrawal #{detailItem.id}</h3>
              <button onClick={() => setDetailItem(null)} className="text-white/30 hover:text-white"><X size={18} /></button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['User', detailItem.user_name],
                ['Email', detailItem.user_email],
                ['Amount', `${Number(detailItem.amount).toFixed(2)} VC`],
                ['Method', detailItem.method === 'upi' ? 'UPI' : 'Bank Transfer'],
                ['Status', detailItem.status],
                ['Date', new Date(detailItem.createdAt).toLocaleString()],
              ].map(([k, v]) => (
                <div key={k} className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/40 text-xs mb-0.5">{k}</p>
                  <p className="text-white font-medium text-xs">{v}</p>
                </div>
              ))}
            </div>

            {/* Account Details (full) */}
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-white/40 text-xs mb-1">Account Details</p>
              <p className="text-white font-medium text-sm whitespace-pre-wrap break-all">{detailItem.account_details}</p>
            </div>

            {/* Admin Note + Actions (only for pending) */}
            {detailItem.status === 'pending' ? (
              <div className="space-y-3">
                <div>
                  <label className="text-white/50 text-xs font-semibold">Admin Note (optional)</label>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    rows={2}
                    className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple"
                    placeholder="Add a note..."
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction(detailItem.id, 'approved')}
                    disabled={actionId === detailItem.id}
                    className="flex-1 bg-green/20 text-green py-2.5 rounded-xl text-sm font-semibold hover:bg-green/30 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionId === detailItem.id ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(detailItem.id, 'rejected')}
                    disabled={actionId === detailItem.id}
                    className="flex-1 bg-red-500/20 text-red-400 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {actionId === detailItem.id ? <Loader2 className="animate-spin" size={16} /> : <XCircle size={16} />}
                    Reject
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 rounded-lg p-3">
                <p className="text-white/40 text-xs mb-0.5">Admin Note</p>
                <p className="text-white text-sm">{detailItem.admin_note || '—'}</p>
              </div>
            )}

            <button onClick={() => setDetailItem(null)} className="w-full bg-white/10 text-white py-2.5 rounded-xl hover:bg-white/20 transition text-sm font-semibold">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWithdrawals;
