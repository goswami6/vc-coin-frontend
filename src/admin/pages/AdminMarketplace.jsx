import React, { useState, useEffect } from 'react';
import {
  Store, Tag, Clock, CheckCircle, XCircle, Loader2,
  ArrowUpRight, ArrowDownLeft, BarChart3, DollarSign,
  Percent, Eye, X, ShieldCheck, Image,
} from 'lucide-react';
import { api, API_BASE_URL as API_BASE } from '../../utils/api';

const AdminMarketplace = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [detailOrder, setDetailOrder] = useState(null);
  const [adminNote, setAdminNote] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getAllSellOrders();
      setOrders(data.orders || []);
      setStats(data.stats || {});
    } catch { /* ignored */ }
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const data = await api.getAllSellOrders();
        if (active) {
          setOrders(data.orders || []);
          setStats(data.stats || {});
        }
      } catch { /* ignored */ }
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const handleAction = async (id, status) => {
    setActionId(id);
    try {
      await api.updateSellOrderStatus(id, { status, admin_note: adminNote });
      setAdminNote('');
      setDetailOrder(null);
      fetchOrders();
    } catch { /* ignored */ }
    setActionId(null);
  };

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  const statusColor = (s) => {
    if (s === 'pending') return 'text-yellow-400 bg-yellow-400/10';
    if (s === 'approved') return 'text-cyan bg-cyan/10';
    if (s === 'purchased') return 'text-blue-400 bg-blue-400/10';
    if (s === 'completed') return 'text-green bg-green/10';
    if (s === 'rejected') return 'text-red-400 bg-red-400/10';
    return 'text-white/40 bg-white/5';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Store className="text-purple" size={28} /> Marketplace Management
        </h1>
        <p className="text-white/50 text-sm mt-1">Buy/Sell orders, approvals & reports</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {[
          { label: 'Pending', value: stats.pending || 0, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
          { label: 'Approved', value: stats.approved || 0, color: 'text-cyan', bg: 'bg-cyan/10' },
          { label: 'Purchased', value: stats.purchased || 0, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Completed', value: stats.completed || 0, color: 'text-green', bg: 'bg-green/10' },
          { label: 'Trade Volume', value: `${(stats.totalVolume || 0).toFixed(2)} VC`, color: 'text-purple', bg: 'bg-purple/10' },
          { label: 'Fee Earned', value: `${(stats.totalFees || 0).toFixed(2)} VC`, color: 'text-green', bg: 'bg-green/10' },
        ].map((s, i) => (
          <div key={i} className={`rounded-xl p-4 border border-white/5 ${s.bg}`}>
            <p className="text-white/40 text-xs mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'approved', 'purchased', 'completed', 'rejected', 'cancelled'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-purple text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
          >
            {f} {f === 'all' ? `(${orders.length})` : `(${orders.filter((o) => o.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-purple" size={32} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#1a1230] rounded-2xl border border-white/5 p-10 text-center">
          <Store className="mx-auto text-white/20 mb-3" size={40} />
          <p className="text-white/40">No orders found.</p>
        </div>
      ) : (
        <div className="bg-[#1a1230] rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-white/40 text-xs">
                  <th className="text-left p-4">ID</th>
                  <th className="text-left p-4">Seller</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Price/VC</th>
                  <th className="text-left p-4">Total ₹</th>
                  <th className="text-left p-4">Fee (5%)</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Proof</th>
                  <th className="text-left p-4">Buyer</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-white/60">#{o.id}</td>
                    <td className="p-4">
                      <div>
                        <p className="text-white font-medium text-xs">{o.seller_name}</p>
                        <p className="text-white/30 text-[11px]">{o.seller_email}</p>
                      </div>
                    </td>
                    <td className="p-4 text-white font-semibold">{Number(o.amount).toFixed(2)} VC</td>
                    <td className="p-4 text-purple font-medium">₹{Number(o.price_per_vc).toFixed(2)}</td>
                    <td className="p-4 text-white">₹{Number(o.total_price).toFixed(2)}</td>
                    <td className="p-4 text-red-400 text-xs">{Number(o.fee_amount).toFixed(2)} VC</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${statusColor(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {o.payment_proof ? (
                        <a href={`${API_BASE}/uploads/${o.payment_proof}`} target="_blank" rel="noopener noreferrer" className="text-cyan text-xs font-semibold hover:underline flex items-center gap-1">
                          <Image size={12} /> View
                        </a>
                      ) : (
                        <span className="text-white/20 text-xs">—</span>
                      )}
                    </td>
                    <td className="p-4 text-white/50 text-xs">{o.buyer_name || '—'}</td>
                    <td className="p-4 text-white/40 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {o.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleAction(o.id, 'approved')}
                              disabled={actionId === o.id}
                              className="px-3 py-1.5 rounded-lg bg-green/20 text-green text-xs font-semibold hover:bg-green/30 disabled:opacity-50"
                            >
                              {actionId === o.id ? '...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleAction(o.id, 'rejected')}
                              disabled={actionId === o.id}
                              className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/30 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {o.status === 'approved' && (
                          <button
                            onClick={() => handleAction(o.id, 'cancelled')}
                            disabled={actionId === o.id}
                            className="px-3 py-1.5 rounded-lg bg-yellow-400/20 text-yellow-400 text-xs font-semibold hover:bg-yellow-400/30 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        )}
                        {o.status === 'purchased' && (
                          <>
                            <button
                              onClick={() => handleAction(o.id, 'completed')}
                              disabled={actionId === o.id}
                              className="px-3 py-1.5 rounded-lg bg-green/20 text-green text-xs font-semibold hover:bg-green/30 disabled:opacity-50"
                            >
                              {actionId === o.id ? '...' : 'Complete'}
                            </button>
                            <button
                              onClick={() => handleAction(o.id, 'cancelled')}
                              disabled={actionId === o.id}
                              className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/30 disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => { setDetailOrder(o); setAdminNote(o.admin_note || ''); }}
                          className="px-3 py-1.5 rounded-lg bg-white/5 text-white/50 text-xs font-semibold hover:bg-white/10"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDetailOrder(null)}>
          <div className="bg-[#1a1230] rounded-2xl border border-white/10 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Order #{detailOrder.id} Details</h3>
              <button onClick={() => setDetailOrder(null)} className="text-white/30 hover:text-white"><X size={18} /></button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Seller', detailOrder.seller_name],
                ['Seller Email', detailOrder.seller_email],
                ['Amount', `${Number(detailOrder.amount).toFixed(2)} VC`],
                ['Price/VC', `₹${Number(detailOrder.price_per_vc).toFixed(2)}`],
                ['Total Price', `₹${Number(detailOrder.total_price).toFixed(2)}`],
                ['Fee (5%)', `${Number(detailOrder.fee_amount).toFixed(2)} VC`],
                ['Net Amount', `${Number(detailOrder.net_amount).toFixed(2)} VC`],
                ['Status', detailOrder.status],
                ['Buyer', detailOrder.buyer_name || '—'],
                ['Buyer Email', detailOrder.buyer_email || '—'],
                ['Created', new Date(detailOrder.createdAt).toLocaleString()],
                ['Updated', new Date(detailOrder.updatedAt).toLocaleString()],
              ].map(([k, v]) => (
                <div key={k} className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/40 text-xs mb-0.5">{k}</p>
                  <p className="text-white font-medium text-xs">{v}</p>
                </div>
              ))}
            </div>

            {/* Payment Proof for purchased/completed orders */}
            {detailOrder.payment_proof && (
              <div className="bg-cyan/5 border border-cyan/10 rounded-xl p-4">
                <p className="text-cyan text-xs font-semibold mb-2 flex items-center gap-1">
                  <Image size={14} /> Payment Screenshot
                </p>
                <img
                  src={`${API_BASE}/uploads/${detailOrder.payment_proof}`}
                  alt="Payment proof"
                  className="w-full rounded-lg border border-white/10 max-h-64 object-contain bg-black/30"
                />
              </div>
            )}

            {/* Seller UPI */}
            {detailOrder.seller_upi && (
              <div className="bg-white/5 rounded-xl p-3 flex items-center justify-between">
                <span className="text-white/40 text-xs">Seller UPI</span>
                <code className="text-cyan text-xs font-mono">{detailOrder.seller_upi}</code>
              </div>
            )}

            {/* Admin Note & Actions */}
            {['pending', 'approved', 'purchased'].includes(detailOrder.status) && (
              <div className="space-y-3">
                <div>
                  <label className="text-white/50 text-xs font-semibold">Admin Note (optional)</label>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    rows={2}
                    className="w-full mt-1.5 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-purple"
                    placeholder="Add a note..."
                  />
                </div>
                {detailOrder.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(detailOrder.id, 'approved')}
                      disabled={actionId === detailOrder.id}
                      className="flex-1 bg-green/20 text-green py-2.5 rounded-xl text-sm font-semibold hover:bg-green/30 disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button
                      onClick={() => handleAction(detailOrder.id, 'rejected')}
                      disabled={actionId === detailOrder.id}
                      className="flex-1 bg-red-500/20 text-red-400 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-500/30 disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                )}
                {detailOrder.status === 'approved' && (
                  <button
                    onClick={() => handleAction(detailOrder.id, 'cancelled')}
                    disabled={actionId === detailOrder.id}
                    className="w-full bg-yellow-400/20 text-yellow-400 py-2.5 rounded-xl text-sm font-semibold hover:bg-yellow-400/30 disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    <XCircle size={14} /> Cancel Listing
                  </button>
                )}
                {detailOrder.status === 'purchased' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction(detailOrder.id, 'completed')}
                      disabled={actionId === detailOrder.id}
                      className="flex-1 bg-green/20 text-green py-2.5 rounded-xl text-sm font-semibold hover:bg-green/30 disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle size={14} /> Complete (Transfer VC)
                    </button>
                    <button
                      onClick={() => handleAction(detailOrder.id, 'cancelled')}
                      disabled={actionId === detailOrder.id}
                      className="flex-1 bg-red-500/20 text-red-400 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-500/30 disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      <XCircle size={14} /> Cancel
                    </button>
                  </div>
                )}
              </div>
            )}

            <button onClick={() => setDetailOrder(null)} className="w-full bg-white/10 text-white py-2.5 rounded-xl hover:bg-white/20 transition text-sm font-semibold">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMarketplace;
