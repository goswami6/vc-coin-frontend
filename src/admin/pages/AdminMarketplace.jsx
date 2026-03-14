import React, { useState, useEffect } from 'react';
import {
  Store, Tag, Clock, CheckCircle, XCircle, Loader2,
  ArrowUpRight, ArrowDownLeft, BarChart3, DollarSign,
  Percent, Eye, X, ShieldCheck, Image, ShoppingCart,
} from 'lucide-react';
import { api, API_BASE_URL as API_BASE } from '../../utils/api';

const AdminMarketplace = () => {
  const [orders, setOrders] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [stats, setStats] = useState({});
  const [mainTab, setMainTab] = useState('purchases');
  const [purchaseFilter, setPurchaseFilter] = useState('pending');
  const [orderFilter, setOrderFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [detailPurchase, setDetailPurchase] = useState(null);
  const [detailOrder, setDetailOrder] = useState(null);
  const [adminNote, setAdminNote] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.getAllSellOrders();
      setOrders(data.orders || []);
      setPurchases(data.purchases || []);
      setStats(data.stats || {});
    } catch { }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handlePurchaseAction = async (id, status) => {
    setActionId(id);
    try {
      await api.updatePurchaseStatus(id, { status, admin_note: adminNote });
      setAdminNote('');
      setDetailPurchase(null);
      fetchData();
    } catch { }
    setActionId(null);
  };

  const handleCancelOrder = async (id) => {
    setActionId(id);
    try {
      await api.updateSellOrderStatus(id, { status: 'cancelled', admin_note: adminNote });
      setAdminNote('');
      setDetailOrder(null);
      fetchData();
    } catch { }
    setActionId(null);
  };

  const filteredPurchases = purchaseFilter === 'all' ? purchases : purchases.filter((p) => p.status === purchaseFilter);
  const filteredOrders = orderFilter === 'all' ? orders : orders.filter((o) => o.status === orderFilter);

  const statusColor = (s) => {
    if (s === 'pending') return 'text-yellow-400 bg-yellow-400/10';
    if (s === 'approved') return 'text-green bg-green/10';
    if (s === 'rejected') return 'text-red-400 bg-red-400/10';
    if (s === 'completed') return 'text-green bg-green/10';
    if (s === 'cancelled') return 'text-white/40 bg-white/5';
    return 'text-cyan bg-cyan/10';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Store className="text-purple" size={28} /> Marketplace Management
        </h1>
        <p className="text-white/50 text-sm mt-1">Approve purchases & manage sell orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Pending Purchases', value: stats.pendingPurchases || 0, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
          { label: 'Approved Purchases', value: stats.approvedPurchases || 0, color: 'text-green', bg: 'bg-green/10' },
          { label: 'Active Sell Orders', value: stats.active || 0, color: 'text-cyan', bg: 'bg-cyan/10' },
          { label: 'Trade Volume', value: `${(stats.totalVolume || 0).toFixed(2)} VC`, color: 'text-purple', bg: 'bg-purple/10' },
        ].map((s, i) => (
          <div key={i} className={`rounded-xl p-4 border border-white/5 ${s.bg}`}>
            <p className="text-white/40 text-xs mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Main Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setMainTab('purchases')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${mainTab === 'purchases' ? 'bg-purple text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
        >
          <ShoppingCart size={16} /> Purchases ({purchases.length})
        </button>
        <button
          onClick={() => setMainTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${mainTab === 'orders' ? 'bg-purple text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
        >
          <Tag size={16} /> Sell Orders ({orders.length})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-purple" size={32} />
        </div>
      ) : (
        <>
          {/* PURCHASES TAB */}
          {mainTab === 'purchases' && (
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {['pending', 'approved', 'rejected', 'all'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setPurchaseFilter(f)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${purchaseFilter === f ? 'bg-purple text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                  >
                    {f} ({f === 'all' ? purchases.length : purchases.filter((p) => p.status === f).length})
                  </button>
                ))}
              </div>

              {filteredPurchases.length === 0 ? (
                <div className="bg-[#1a1230] rounded-2xl border border-white/5 p-10 text-center">
                  <ShoppingCart className="mx-auto text-white/20 mb-3" size={40} />
                  <p className="text-white/40">No purchases found.</p>
                </div>
              ) : (
                <div className="bg-[#1a1230] rounded-2xl border border-white/5 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5 text-white/40 text-xs">
                          <th className="text-left p-4">ID</th>
                          <th className="text-left p-4">Buyer</th>
                          <th className="text-left p-4">Seller</th>
                          <th className="text-left p-4">Amount</th>
                          <th className="text-left p-4">Total ₹</th>
                          <th className="text-left p-4">Status</th>
                          <th className="text-left p-4">Proof</th>
                          <th className="text-left p-4">Date</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPurchases.map((p) => (
                          <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="p-4 text-white/60">#{p.id}</td>
                            <td className="p-4">
                              <p className="text-white font-medium text-xs">{p.buyer_name}</p>
                              <p className="text-white/30 text-[11px]">{p.buyer_email}</p>
                            </td>
                            <td className="p-4">
                              <p className="text-white font-medium text-xs">{p.seller_name}</p>
                              <p className="text-white/30 text-[11px]">{p.seller_email}</p>
                            </td>
                            <td className="p-4 text-white font-semibold">{Number(p.amount).toFixed(2)} VC</td>
                            <td className="p-4 text-green font-medium">₹{Number(p.total_price).toFixed(2)}</td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${statusColor(p.status)}`}>
                                {p.status}
                              </span>
                            </td>
                            <td className="p-4">
                              {p.payment_proof ? (
                                <a href={`${API_BASE}/uploads/${p.payment_proof}`} target="_blank" rel="noopener noreferrer" className="text-cyan text-xs font-semibold hover:underline flex items-center gap-1">
                                  <Image size={12} /> View
                                </a>
                              ) : (
                                <span className="text-white/20 text-xs">—</span>
                              )}
                            </td>
                            <td className="p-4 text-white/40 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                {p.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handlePurchaseAction(p.id, 'approved')}
                                      disabled={actionId === p.id}
                                      className="px-3 py-1.5 rounded-lg bg-green/20 text-green text-xs font-semibold hover:bg-green/30 disabled:opacity-50"
                                    >
                                      {actionId === p.id ? '...' : 'Approve'}
                                    </button>
                                    <button
                                      onClick={() => handlePurchaseAction(p.id, 'rejected')}
                                      disabled={actionId === p.id}
                                      className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/30 disabled:opacity-50"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => { setDetailPurchase(p); setAdminNote(p.admin_note || ''); }}
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
            </div>
          )}

          {/* SELL ORDERS TAB */}
          {mainTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {['all', 'approved', 'completed', 'cancelled'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setOrderFilter(f)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${orderFilter === f ? 'bg-purple text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                  >
                    {f} ({f === 'all' ? orders.length : orders.filter((o) => o.status === f).length})
                  </button>
                ))}
              </div>

              {filteredOrders.length === 0 ? (
                <div className="bg-[#1a1230] rounded-2xl border border-white/5 p-10 text-center">
                  <Store className="mx-auto text-white/20 mb-3" size={40} />
                  <p className="text-white/40">No sell orders found.</p>
                </div>
              ) : (
                <div className="bg-[#1a1230] rounded-2xl border border-white/5 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5 text-white/40 text-xs">
                          <th className="text-left p-4">ID</th>
                          <th className="text-left p-4">Seller</th>
                          <th className="text-left p-4">Total</th>
                          <th className="text-left p-4">Remaining</th>
                          <th className="text-left p-4">Price/VC</th>
                          <th className="text-left p-4">Payment Info</th>
                          <th className="text-left p-4">Status</th>
                          <th className="text-left p-4">Date</th>
                          <th className="text-left p-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((o) => (
                          <tr key={o.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="p-4 text-white/60">#{o.id}</td>
                            <td className="p-4">
                              <p className="text-white font-medium text-xs">{o.seller_name}</p>
                              <p className="text-white/30 text-[11px]">{o.seller_email}</p>
                            </td>
                            <td className="p-4 text-white font-semibold">{Number(o.amount).toFixed(2)} VC</td>
                            <td className="p-4 text-cyan font-semibold">{Number(o.remaining_amount || 0).toFixed(2)} VC</td>
                            <td className="p-4 text-purple font-medium">₹{Number(o.price_per_vc).toFixed(2)}</td>
                            <td className="p-4">
                              <div className="flex gap-1">
                                {o.seller_upi && <span className="text-[10px] text-cyan bg-cyan/10 px-1.5 py-0.5 rounded">UPI</span>}
                                {o.seller_qr && (
                                  <a href={`${API_BASE}/uploads/${o.seller_qr}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-purple bg-purple/10 px-1.5 py-0.5 rounded hover:underline">QR</a>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${statusColor(o.status)}`}>
                                {o.status}
                              </span>
                            </td>
                            <td className="p-4 text-white/40 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                {o.status === 'approved' && (
                                  <button
                                    onClick={() => handleCancelOrder(o.id)}
                                    disabled={actionId === o.id}
                                    className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500/30 disabled:opacity-50"
                                  >
                                    Cancel
                                  </button>
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
            </div>
          )}
        </>
      )}

      {/* Purchase Detail Modal */}
      {detailPurchase && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDetailPurchase(null)}>
          <div className="bg-[#1a1230] rounded-2xl border border-white/10 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Purchase #{detailPurchase.id} Details</h3>
              <button onClick={() => setDetailPurchase(null)} className="text-white/30 hover:text-white"><X size={18} /></button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Buyer', detailPurchase.buyer_name],
                ['Buyer Email', detailPurchase.buyer_email],
                ['Seller', detailPurchase.seller_name],
                ['Seller Email', detailPurchase.seller_email],
                ['VC Amount', `${Number(detailPurchase.amount).toFixed(2)} VC`],
                ['Price/VC', `₹${Number(detailPurchase.price_per_vc).toFixed(2)}`],
                ['Total Price', `₹${Number(detailPurchase.total_price).toFixed(2)}`],
                ['Status', detailPurchase.status],
                ['Order #', detailPurchase.sell_order_id],
                ['Created', new Date(detailPurchase.createdAt).toLocaleString()],
              ].map(([k, v]) => (
                <div key={k} className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/40 text-xs mb-0.5">{k}</p>
                  <p className="text-white font-medium text-xs">{v}</p>
                </div>
              ))}
            </div>

            {/* Seller UPI & QR */}
            {(detailPurchase.seller_upi || detailPurchase.seller_qr) && (
              <div className="bg-cyan/5 border border-cyan/10 rounded-xl p-4 space-y-2">
                <p className="text-cyan text-xs font-semibold">Seller Payment Info</p>
                {detailPurchase.seller_upi && (
                  <div className="bg-white/5 rounded-lg px-3 py-2">
                    <span className="text-white/40 text-xs">UPI: </span>
                    <code className="text-cyan text-xs font-mono">{detailPurchase.seller_upi}</code>
                  </div>
                )}
                {detailPurchase.seller_qr && (
                  <img
                    src={`${API_BASE}/uploads/${detailPurchase.seller_qr}`}
                    alt="Seller QR"
                    className="w-32 h-32 object-contain bg-white rounded-lg border border-white/10"
                  />
                )}
              </div>
            )}

            {/* Payment Proof */}
            {detailPurchase.payment_proof && (
              <div className="bg-purple/5 border border-purple/10 rounded-xl p-4">
                <p className="text-purple text-xs font-semibold mb-2 flex items-center gap-1">
                  <Image size={14} /> Buyer's Payment Screenshot
                </p>
                <img
                  src={`${API_BASE}/uploads/${detailPurchase.payment_proof}`}
                  alt="Payment proof"
                  className="w-full rounded-lg border border-white/10 max-h-64 object-contain bg-black/30"
                />
              </div>
            )}

            {/* Admin Actions */}
            {detailPurchase.status === 'pending' && (
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
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePurchaseAction(detailPurchase.id, 'approved')}
                    disabled={actionId === detailPurchase.id}
                    className="flex-1 bg-green/20 text-green py-2.5 rounded-xl text-sm font-semibold hover:bg-green/30 disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle size={14} /> Approve (Transfer VC)
                  </button>
                  <button
                    onClick={() => handlePurchaseAction(detailPurchase.id, 'rejected')}
                    disabled={actionId === detailPurchase.id}
                    className="flex-1 bg-red-500/20 text-red-400 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-500/30 disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                </div>
              </div>
            )}

            {detailPurchase.admin_note && (
              <div className="bg-white/5 rounded-xl p-3">
                <span className="text-white/40 text-xs">Admin Note: </span>
                <span className="text-white text-xs">{detailPurchase.admin_note}</span>
              </div>
            )}

            <button onClick={() => setDetailPurchase(null)} className="w-full bg-white/10 text-white py-2.5 rounded-xl hover:bg-white/20 transition text-sm font-semibold">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {detailOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDetailOrder(null)}>
          <div className="bg-[#1a1230] rounded-2xl border border-white/10 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Sell Order #{detailOrder.id}</h3>
              <button onClick={() => setDetailOrder(null)} className="text-white/30 hover:text-white"><X size={18} /></button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Seller', detailOrder.seller_name],
                ['Seller Email', detailOrder.seller_email],
                ['Total Amount', `${Number(detailOrder.amount).toFixed(2)} VC`],
                ['Remaining', `${Number(detailOrder.remaining_amount || 0).toFixed(2)} VC`],
                ['Price/VC', `₹${Number(detailOrder.price_per_vc).toFixed(2)}`],
                ['Total ₹ Value', `₹${Number(detailOrder.total_price).toFixed(2)}`],
                ['Fee (5%)', `${Number(detailOrder.fee_amount || 0).toFixed(2)} VC`],
                ['Status', detailOrder.status],
                ['Created', new Date(detailOrder.createdAt).toLocaleString()],
                ['Updated', new Date(detailOrder.updatedAt).toLocaleString()],
              ].map(([k, v]) => (
                <div key={k} className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/40 text-xs mb-0.5">{k}</p>
                  <p className="text-white font-medium text-xs">{v}</p>
                </div>
              ))}
            </div>

            {detailOrder.seller_upi && (
              <div className="bg-white/5 rounded-xl p-3 flex items-center justify-between">
                <span className="text-white/40 text-xs">Seller UPI</span>
                <code className="text-cyan text-xs font-mono">{detailOrder.seller_upi}</code>
              </div>
            )}

            {detailOrder.seller_qr && (
              <div className="bg-purple/5 border border-purple/10 rounded-xl p-4">
                <p className="text-purple text-xs font-semibold mb-2">Seller QR Code</p>
                <img
                  src={`${API_BASE}/uploads/${detailOrder.seller_qr}`}
                  alt="Seller QR"
                  className="w-32 h-32 object-contain bg-white rounded-lg border border-white/10"
                />
              </div>
            )}

            {detailOrder.status === 'approved' && (
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
                <button
                  onClick={() => handleCancelOrder(detailOrder.id)}
                  disabled={actionId === detailOrder.id}
                  className="w-full bg-red-500/20 text-red-400 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-500/30 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <XCircle size={14} /> Cancel This Sell Order
                </button>
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
