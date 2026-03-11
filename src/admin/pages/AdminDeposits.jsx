import React, { useState, useEffect } from 'react';
import {
  ArrowDownToLine,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { api, API_BASE_URL as API_BASE } from '../../utils/api';

const AdminDeposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewDeposit, setViewDeposit] = useState(null);
  const [processing, setProcessing] = useState(null);

  const fetchDeposits = async () => {
    try {
      const data = await api.getAllDeposits();
      setDeposits(data.deposits || []);
    } catch { /* ignored */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDeposits(); }, []);

  const handleAction = async (id, status) => {
    setProcessing(id);
    try {
      await api.updateDepositStatus(id, { status });
      await fetchDeposits();
      if (viewDeposit?.id === id) setViewDeposit(null);
    } catch (err) {
      alert(err.message || 'Failed to update.');
    } finally {
      setProcessing(null);
    }
  };

  const filtered = filter === 'all' ? deposits : deposits.filter((d) => d.status === filter);

  const statusBadge = (status) => {
    const map = {
      pending: { bg: 'bg-yellow-400/10 text-yellow-400', icon: Clock },
      approved: { bg: 'bg-green/10 text-green', icon: CheckCircle },
      rejected: { bg: 'bg-red-400/10 text-red-400', icon: XCircle },
    };
    const s = map[status] || map.pending;
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${s.bg}`}>
        <s.icon size={10} /> {status}
      </span>
    );
  };

  const counts = {
    all: deposits.length,
    pending: deposits.filter((d) => d.status === 'pending').length,
    approved: deposits.filter((d) => d.status === 'approved').length,
    rejected: deposits.filter((d) => d.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-purple/30 border-t-purple rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ArrowDownToLine size={24} className="text-purple" /> Deposit Requests
        </h1>
        <p className="text-white/40 text-sm mt-1">Approve or reject user deposit requests</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'approved', 'rejected'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize ${filter === f ? 'bg-purple/10 text-purple border border-purple/20' : 'bg-white/5 text-white/40 border border-white/5 hover:border-white/10'}`}
          >
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-[10px] text-white/30 uppercase font-medium p-4">ID</th>
                <th className="text-[10px] text-white/30 uppercase font-medium p-4">User</th>
                <th className="text-[10px] text-white/30 uppercase font-medium p-4">Amount</th>
                <th className="text-[10px] text-white/30 uppercase font-medium p-4">Method</th>
                <th className="text-[10px] text-white/30 uppercase font-medium p-4">TXN ID</th>
                <th className="text-[10px] text-white/30 uppercase font-medium p-4">Status</th>
                <th className="text-[10px] text-white/30 uppercase font-medium p-4">Date</th>
                <th className="text-[10px] text-white/30 uppercase font-medium p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-white/20 text-sm py-16">
                    No deposits found
                  </td>
                </tr>
              ) : (
                filtered.map((d) => (
                  <tr key={d.id} className="border-b border-white/5 last:border-0 hover:bg-white/2">
                    <td className="p-4 text-xs text-white/40">#{d.id}</td>
                    <td className="p-4">
                      <p className="text-sm font-medium text-white">{d.user_name || '-'}</p>
                      <p className="text-[10px] text-white/30">{d.user_email || ''}</p>
                    </td>
                    <td className="p-4 text-sm font-bold text-white">
                      ₹{Number(d.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-xs text-white/50 capitalize">{d.method}</td>
                    <td className="p-4 text-xs text-white/40 font-mono max-w-25 truncate">{d.txn_id}</td>
                    <td className="p-4">{statusBadge(d.status)}</td>
                    <td className="p-4 text-xs text-white/30">
                      {new Date(d.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setViewDeposit(d)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                          title="View"
                        >
                          <Eye size={14} />
                        </button>
                        {d.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAction(d.id, 'approved')}
                              disabled={processing === d.id}
                              className="p-2 rounded-lg bg-green/5 hover:bg-green/10 text-green/60 hover:text-green transition-all"
                              title="Approve"
                            >
                              <CheckCircle size={14} />
                            </button>
                            <button
                              onClick={() => handleAction(d.id, 'rejected')}
                              disabled={processing === d.id}
                              className="p-2 rounded-lg bg-red-400/5 hover:bg-red-400/10 text-red-400/60 hover:text-red-400 transition-all"
                              title="Reject"
                            >
                              <XCircle size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Detail Modal */}
      {viewDeposit && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-dark border border-white/10 rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">Deposit #{viewDeposit.id}</h2>
              <button onClick={() => setViewDeposit(null)} className="text-white/30 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-white/30 mb-1">User</p>
                  <p className="text-sm text-white font-medium">{viewDeposit.user_name}</p>
                  <p className="text-[10px] text-white/30">{viewDeposit.user_email}</p>
                </div>
                <div>
                  <p className="text-xs text-white/30 mb-1">Amount</p>
                  <p className="text-lg text-white font-bold">₹{Number(viewDeposit.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-xs text-white/30 mb-1">Method</p>
                  <p className="text-sm text-white capitalize">{viewDeposit.method}</p>
                </div>
                <div>
                  <p className="text-xs text-white/30 mb-1">TXN ID</p>
                  <p className="text-sm text-cyan font-mono break-all">{viewDeposit.txn_id}</p>
                </div>
                <div>
                  <p className="text-xs text-white/30 mb-1">Status</p>
                  {statusBadge(viewDeposit.status)}
                </div>
                <div>
                  <p className="text-xs text-white/30 mb-1">Date</p>
                  <p className="text-sm text-white">
                    {new Date(viewDeposit.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Screenshot */}
              {viewDeposit.screenshot && (
                <div>
                  <p className="text-xs text-white/30 mb-2">Payment Screenshot</p>
                  <img
                    src={`${API_BASE}${viewDeposit.screenshot}`}
                    alt="Payment Screenshot"
                    className="w-full rounded-xl border border-white/5 max-h-64 object-contain bg-black/30"
                  />
                </div>
              )}

              {/* Actions */}
              {viewDeposit.status === 'pending' && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleAction(viewDeposit.id, 'approved')}
                    disabled={processing === viewDeposit.id}
                    className="flex-1 bg-green/10 hover:bg-green/20 text-green font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all"
                  >
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button
                    onClick={() => handleAction(viewDeposit.id, 'rejected')}
                    disabled={processing === viewDeposit.id}
                    className="flex-1 bg-red-400/10 hover:bg-red-400/20 text-red-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm transition-all"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDeposits;
