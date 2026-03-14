import React, { useState, useEffect } from 'react';
import {
  Store, ShoppingCart, Clock, CheckCircle, XCircle,
  ArrowUpRight, Loader2, AlertCircle, Info,
  Coins, Copy, Tag, Wallet, Upload, Image, IndianRupee, QrCode, Eye,
} from 'lucide-react';
import { api, API_BASE_URL } from '../../utils/api';

const MarketplacePage = () => {
  const [tab, setTab] = useState('buy');
  const [amount, setAmount] = useState('');
  const [pricePerVc, setPricePerVc] = useState('');
  const [sellerUpi, setSellerUpi] = useState('');
  const [sellerQr, setSellerQr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const [myOrders, setMyOrders] = useState([]);
  const [myPurchases, setMyPurchases] = useState([]);
  const [lockedBalance, setLockedBalance] = useState(0);
  const [marketOrders, setMarketOrders] = useState([]);
  const [balance, setBalance] = useState(0);
  const [buyingId, setBuyingId] = useState(null);
  const [buyModal, setBuyModal] = useState(null);
  const [buyAmount, setBuyAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [vcRate, setVcRate] = useState(0);
  const [ordersSubTab, setOrdersSubTab] = useState('selling');

  const fetchData = async () => {
    try {
      const [ordersData, mktData, balData, rateData, purchasesData] = await Promise.all([
        api.mySellOrders(),
        api.browseMarketplace(),
        api.getBalance(),
        api.getVcRate(),
        api.myPurchases(),
      ]);
      setMyOrders(ordersData.orders || []);
      setLockedBalance(ordersData.lockedBalance || 0);
      setMarketOrders(mktData.orders || []);
      setBalance(balData.balance ?? 0);
      setMyPurchases(purchasesData.purchases || []);
      const rate = rateData.vc_rate || 0;
      setVcRate(rate);
      if (!pricePerVc) setPricePerVc(String(rate));
    } catch { }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });
    if (!amount || Number(amount) <= 0 || !pricePerVc || Number(pricePerVc) <= 0) {
      setMsg({ text: 'Enter valid amount and price.', type: 'error' });
      return;
    }
    if (!sellerUpi && !sellerQr) {
      setMsg({ text: 'Provide UPI ID or QR code image.', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('amount', Number(amount));
      formData.append('price_per_vc', Number(pricePerVc));
      if (sellerUpi) formData.append('seller_upi', sellerUpi);
      if (sellerQr) formData.append('seller_qr', sellerQr);
      const res = await api.createSellOrder(formData);
      setMsg({ text: res.message, type: 'success' });
      setAmount('');
      setPricePerVc('');
      setSellerUpi('');
      setSellerQr(null);
      fetchData();
    } catch (err) {
      setMsg({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (orderId) => {
    if (!screenshot) {
      setMsg({ text: 'Please upload payment screenshot.', type: 'error' });
      return;
    }
    if (!buyAmount || Number(buyAmount) <= 0) {
      setMsg({ text: 'Enter a valid VC amount to buy.', type: 'error' });
      return;
    }
    setBuyingId(orderId);
    try {
      const formData = new FormData();
      formData.append('screenshot', screenshot);
      formData.append('amount', Number(buyAmount));
      const res = await api.buyOrder(orderId, formData);
      setMsg({ text: res.message, type: 'success' });
      setBuyModal(null);
      setScreenshot(null);
      setBuyAmount('');
      fetchData();
    } catch (err) {
      setMsg({ text: err.message, type: 'error' });
    } finally {
      setBuyingId(null);
    }
  };

  const copyUpi = (upiId) => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusInfo = (s) => {
    const map = {
      pending: { color: 'text-yellow-400 bg-yellow-400/10', label: 'Pending Verification' },
      approved: { color: 'text-cyan bg-cyan/10', label: 'Active' },
      purchased: { color: 'text-blue-400 bg-blue-400/10', label: 'Buyer Found' },
      completed: { color: 'text-green bg-green/10', label: 'Completed' },
      rejected: { color: 'text-red-400 bg-red-400/10', label: 'Rejected' },
      cancelled: { color: 'text-white/40 bg-white/5', label: 'Cancelled' },
    };
    return map[s] || map.cancelled;
  };

  const purchaseStatusInfo = (s) => {
    const map = {
      pending: { color: 'text-yellow-400 bg-yellow-400/10', label: 'Pending Admin Approval' },
      approved: { color: 'text-green bg-green/10', label: 'Approved - VC Transferred' },
      rejected: { color: 'text-red-400 bg-red-400/10', label: 'Rejected' },
    };
    return map[s] || map.pending;
  };

  const feeAmount = amount ? (Number(amount) * 0.05) : 0;
  const totalPrice = amount && pricePerVc ? Number(amount) * Number(pricePerVc) : 0;
  const available = Number(balance) - lockedBalance;
  const buyTotalPrice = buyAmount && buyModal ? Number(buyAmount) * Number(buyModal.price_per_vc) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Store className="text-purple" size={28} /> VC Coin Marketplace
        </h1>
        <p className="text-white/50 text-sm mt-1">Buy & Sell VC Coins easily</p>
      </div>

      {/* Balance Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#1e1635] rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <IndianRupee size={16} className="text-purple" />
            <span className="text-white/40 text-xs">Current VC Rate</span>
          </div>
          <p className="text-lg font-bold text-purple">₹{Number(vcRate).toFixed(2)}</p>
        </div>
        <div className="bg-[#1e1635] rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Coins size={16} className="text-green" />
            <span className="text-white/40 text-xs">Your Balance</span>
          </div>
          <p className="text-lg font-bold text-green">{Number(balance).toFixed(2)} VC</p>
        </div>
        <div className="bg-[#1e1635] rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Tag size={16} className="text-yellow-400" />
            <span className="text-white/40 text-xs">Locked in Orders</span>
          </div>
          <p className="text-lg font-bold text-yellow-400">{lockedBalance.toFixed(2)} VC</p>
        </div>
        <div className="bg-[#1e1635] rounded-xl p-4 border border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Wallet size={16} className="text-cyan" />
            <span className="text-white/40 text-xs">Available to Sell</span>
          </div>
          <p className="text-lg font-bold text-cyan">{available.toFixed(2)} VC</p>
        </div>
      </div>

      {/* Message */}
      {msg.text && (
        <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${msg.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green/10 text-green border border-green/20'}`}>
          {msg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          {msg.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'buy', label: 'Buy VC Coins', icon: ShoppingCart },
          { key: 'sell', label: 'Sell VC Coins', icon: ArrowUpRight },
          { key: 'orders', label: 'My Orders', icon: Clock },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setMsg({ text: '', type: '' }); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.key ? 'bg-purple text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      {/* BUY TAB */}
      {tab === 'buy' && (
        <div className="space-y-5">
          <div className="bg-[#1e1635] rounded-2xl border border-white/5 p-5">
            <h3 className="text-sm font-bold text-white/60 mb-3 flex items-center gap-2">
              <Info size={14} /> How Buying Works
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { step: '1', title: 'Choose & Enter Amount', desc: 'Pick an order and enter the VC amount you want to buy', color: 'text-cyan' },
                { step: '2', title: 'Pay Seller via UPI', desc: 'Send ₹ to seller\'s UPI/QR & upload screenshot', color: 'text-purple' },
                { step: '3', title: 'Receive VC Coins', desc: 'Admin verifies payment & VC is credited to your wallet', color: 'text-green' },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2 text-sm font-bold ${s.color}`}>
                    {s.step}
                  </div>
                  <p className="text-white text-xs font-semibold">{s.title}</p>
                  <p className="text-white/30 text-[10px] mt-0.5">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShoppingCart className="text-cyan" size={20} /> Available Orders
          </h2>
          {marketOrders.length === 0 ? (
            <div className="bg-[#1e1635] rounded-2xl border border-white/5 p-10 text-center">
              <Store className="mx-auto text-white/20 mb-3" size={40} />
              <p className="text-white/40">No orders available right now. Check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {marketOrders.map((o) => {
                const rem = Number(o.remaining_amount || o.amount);
                return (
                  <div key={o.id} className="bg-[#1e1635] rounded-2xl border border-white/5 p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple/20 flex items-center justify-center text-purple font-bold text-xs">
                          {(o.seller_name || 'U')[0].toUpperCase()}
                        </div>
                        <p className="text-white font-semibold text-sm">{o.seller_name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {o.seller_upi && <span className="text-[10px] text-cyan bg-cyan/10 px-1.5 py-0.5 rounded">UPI</span>}
                        {o.seller_qr && <span className="text-[10px] text-purple bg-purple/10 px-1.5 py-0.5 rounded">QR</span>}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-white/5 rounded-lg p-2">
                        <p className="text-white/40 text-[10px]">Available</p>
                        <p className="text-white font-bold text-sm">{rem.toFixed(2)} VC</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2">
                        <p className="text-white/40 text-[10px]">Price/VC</p>
                        <p className="text-purple font-bold text-sm">₹{Number(o.price_per_vc).toFixed(2)}</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2">
                        <p className="text-white/40 text-[10px]">Total Value</p>
                        <p className="text-green font-bold text-sm">₹{(rem * Number(o.price_per_vc)).toFixed(2)}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => { setBuyModal(o); setBuyAmount(String(rem)); setScreenshot(null); }}
                      className="w-full bg-linear-to-r from-green to-cyan text-bg-dark font-bold py-2.5 rounded-xl hover:opacity-90 transition text-sm flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={16} /> Buy VC Coins
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SELL TAB */}
      {tab === 'sell' && (
        <div className="space-y-5">
          <div className="bg-[#1e1635] rounded-2xl border border-white/5 p-5">
            <h3 className="text-sm font-bold text-white/60 mb-3 flex items-center gap-2">
              <Info size={14} /> How Selling Works
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { step: '1', title: 'Set Your Price', desc: 'Choose VC amount, ₹ price & add UPI/QR', color: 'text-purple' },
                { step: '2', title: 'Instant Listing', desc: 'Your order goes live on marketplace instantly', color: 'text-cyan' },
                { step: '3', title: 'Get Paid via UPI', desc: 'Buyer pays you & admin verifies the trade', color: 'text-green' },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className={`w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2 text-sm font-bold ${s.color}`}>
                    {s.step}
                  </div>
                  <p className="text-white text-xs font-semibold">{s.title}</p>
                  <p className="text-white/30 text-[10px] mt-0.5">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1e1635] rounded-2xl border border-white/5 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ArrowUpRight className="text-purple" size={20} /> Create Sell Order
            </h2>
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/50 text-xs font-semibold mb-1.5 block">VC Coins to Sell</label>
                  <input
                    type="number"
                    step="0.01"
                    min="10"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Min. 10 VC"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple"
                  />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-semibold mb-1.5 block">Price per VC (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={pricePerVc}
                    onChange={(e) => setPricePerVc(e.target.value)}
                    placeholder="e.g. ₹50"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple"
                  />
                  {vcRate > 0 && (
                    <p className="text-white/30 text-[10px] mt-1">Current admin rate: ₹{Number(vcRate).toFixed(2)}/VC</p>
                  )}
                </div>
              </div>

              {/* Payment info: UPI or QR */}
              <div className="bg-white/5 rounded-xl p-4 space-y-3">
                <p className="text-white/60 text-xs font-semibold">Payment Info (provide at least one)</p>
                <div>
                  <label className="text-white/50 text-xs font-semibold mb-1.5 block">UPI ID</label>
                  <input
                    type="text"
                    value={sellerUpi}
                    onChange={(e) => setSellerUpi(e.target.value)}
                    placeholder="e.g. yourname@upi"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple"
                  />
                </div>
                <div className="flex items-center gap-3 text-white/30 text-xs">
                  <div className="flex-1 h-px bg-white/10" />
                  <span>OR</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-semibold mb-1.5 block flex items-center gap-1">
                    <QrCode size={12} /> Upload QR Code
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer bg-white/5 rounded-lg px-4 py-3 hover:bg-white/10 transition border border-white/10">
                    <Upload size={18} className="text-white/40" />
                    <span className="text-white/50 text-sm flex-1">
                      {sellerQr ? sellerQr.name : 'Choose QR code image...'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setSellerQr(e.target.files[0] || null)}
                    />
                  </label>
                  {sellerQr && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-white/10 max-w-[120px]">
                      <img src={URL.createObjectURL(sellerQr)} alt="QR preview" className="w-full object-contain bg-black/30" />
                    </div>
                  )}
                </div>
              </div>

              {/* Preview */}
              {amount && pricePerVc && (
                <div className="bg-white/5 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between text-white/60">
                    <span>VC Coins Listed</span>
                    <span className="text-white font-medium">{Number(amount).toFixed(2)} VC</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>5% Platform Fee</span>
                    <span className="text-red-400 font-medium">-{feeAmount.toFixed(2)} VC</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between text-white">
                    <span className="font-semibold">₹ Buyer Will Pay You</span>
                    <span className="font-bold text-green">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <p className="text-white/30 text-[10px] mt-1">5% fee ({feeAmount.toFixed(2)} VC) is locked from your balance. Buyer pays ₹ directly to your UPI/QR. Order goes live instantly!</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-purple to-cyan text-white font-bold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <ArrowUpRight size={18} />}
                {loading ? 'Listing...' : 'List on Marketplace'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ORDERS TAB */}
      {tab === 'orders' && (
        <div className="space-y-4">
          {/* Sub-tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setOrdersSubTab('selling')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${ordersSubTab === 'selling' ? 'bg-purple/20 text-purple border border-purple/30' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
            >
              <ArrowUpRight size={14} className="inline mr-1" /> My Sell Orders ({myOrders.length})
            </button>
            <button
              onClick={() => setOrdersSubTab('buying')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${ordersSubTab === 'buying' ? 'bg-cyan/20 text-cyan border border-cyan/30' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
            >
              <ShoppingCart size={14} className="inline mr-1" /> My Purchases ({myPurchases.length})
            </button>
          </div>

          {/* My Sell Orders */}
          {ordersSubTab === 'selling' && (
            <div className="space-y-3">
              {myOrders.length === 0 ? (
                <div className="bg-[#1e1635] rounded-2xl border border-white/5 p-10 text-center">
                  <Tag className="mx-auto text-white/20 mb-3" size={40} />
                  <p className="text-white/40">You haven't created any sell orders yet.</p>
                </div>
              ) : (
                myOrders.map((o) => {
                  const si = statusInfo(o.status);
                  const rem = Number(o.remaining_amount || 0);
                  const total = Number(o.amount);
                  const sold = total - rem;
                  return (
                    <div key={o.id} className="bg-[#1e1635] rounded-2xl border border-white/5 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white/40 text-xs">Order #{o.id}</span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${si.color}`}>
                          {si.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
                        <div>
                          <p className="text-white/40 text-[10px]">Total Listed</p>
                          <p className="text-white font-bold text-sm">{total.toFixed(2)} VC</p>
                        </div>
                        <div>
                          <p className="text-white/40 text-[10px]">Remaining</p>
                          <p className="text-cyan font-bold text-sm">{rem.toFixed(2)} VC</p>
                        </div>
                        <div>
                          <p className="text-white/40 text-[10px]">Sold</p>
                          <p className="text-green font-bold text-sm">{sold.toFixed(2)} VC</p>
                        </div>
                        <div>
                          <p className="text-white/40 text-[10px]">Price/VC</p>
                          <p className="text-purple font-bold text-sm">₹{Number(o.price_per_vc).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-white/40 text-[10px]">Fee (5%)</p>
                          <p className="text-red-400 font-bold text-sm">{Number(o.fee_amount || 0).toFixed(2)} VC</p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      {total > 0 && (
                        <div className="mt-3">
                          <div className="w-full bg-white/5 rounded-full h-1.5">
                            <div
                              className="bg-linear-to-r from-green to-cyan h-1.5 rounded-full transition-all"
                              style={{ width: `${Math.min(100, (sold / total) * 100)}%` }}
                            />
                          </div>
                          <p className="text-white/30 text-[10px] mt-1">{((sold / total) * 100).toFixed(0)}% sold</p>
                        </div>
                      )}

                      {/* Purchases on this order */}
                      {o.purchases && o.purchases.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                          <p className="text-white/50 text-xs font-semibold flex items-center gap-1">
                            <ShoppingCart size={12} /> Purchases ({o.purchases.length})
                          </p>
                          {o.purchases.map((p) => {
                            const psi = purchaseStatusInfo(p.status);
                            return (
                              <div key={p.id} className="bg-white/5 rounded-lg p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-white text-xs font-medium">{p.buyer_name} — {Number(p.amount).toFixed(2)} VC (₹{Number(p.total_price).toFixed(2)})</span>
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${psi.color}`}>{psi.label}</span>
                                </div>
                                {p.payment_proof && (
                                  <a href={`${API_BASE_URL}/uploads/${p.payment_proof}`} target="_blank" rel="noopener noreferrer">
                                    <img
                                      src={`${API_BASE_URL}/uploads/${p.payment_proof}`}
                                      alt="Payment proof"
                                      className="w-full max-h-32 object-contain bg-black/30 rounded-lg border border-white/10 cursor-pointer hover:opacity-80 transition"
                                    />
                                  </a>
                                )}
                                {p.admin_note && <p className="text-white/30 text-[10px]">Note: {p.admin_note}</p>}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {o.admin_note && (
                        <div className="mt-2 pt-2 border-t border-white/5">
                          <span className="text-white/30 text-xs">Note: {o.admin_note}</span>
                        </div>
                      )}
                      <p className="text-white/20 text-[10px] mt-2">{new Date(o.createdAt).toLocaleString()}</p>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* My Purchases (as buyer) */}
          {ordersSubTab === 'buying' && (
            <div className="space-y-3">
              {myPurchases.length === 0 ? (
                <div className="bg-[#1e1635] rounded-2xl border border-white/5 p-10 text-center">
                  <ShoppingCart className="mx-auto text-white/20 mb-3" size={40} />
                  <p className="text-white/40">You haven't purchased any VC coins yet.</p>
                </div>
              ) : (
                myPurchases.map((p) => {
                  const psi = purchaseStatusInfo(p.status);
                  return (
                    <div key={p.id} className="bg-[#1e1635] rounded-2xl border border-white/5 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white/40 text-xs">Purchase #{p.id} (Order #{p.sell_order_id})</span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${psi.color}`}>
                          {psi.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-3 text-center">
                        <div>
                          <p className="text-white/40 text-[10px]">VC Bought</p>
                          <p className="text-white font-bold text-sm">{Number(p.amount).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-white/40 text-[10px]">Price/VC</p>
                          <p className="text-purple font-bold text-sm">₹{Number(p.price_per_vc).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-white/40 text-[10px]">Total ₹</p>
                          <p className="text-green font-bold text-sm">₹{Number(p.total_price).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-white/40 text-[10px]">Seller</p>
                          <p className="text-cyan font-bold text-sm truncate">{p.seller_name}</p>
                        </div>
                      </div>
                      {p.payment_proof && (
                        <div className="mt-3 pt-3 border-t border-white/5">
                          <p className="text-white/40 text-xs mb-2 flex items-center gap-1">
                            <Image size={12} /> Your Payment Proof
                          </p>
                          <a href={`${API_BASE_URL}/uploads/${p.payment_proof}`} target="_blank" rel="noopener noreferrer">
                            <img
                              src={`${API_BASE_URL}/uploads/${p.payment_proof}`}
                              alt="Payment proof"
                              className="w-full max-h-48 object-contain bg-black/30 rounded-lg border border-white/10 cursor-pointer hover:opacity-80 transition"
                            />
                          </a>
                        </div>
                      )}
                      {p.admin_note && (
                        <div className="mt-2 pt-2 border-t border-white/5">
                          <span className="text-white/30 text-xs">Admin Note: {p.admin_note}</span>
                        </div>
                      )}
                      <p className="text-white/20 text-[10px] mt-2">{new Date(p.createdAt).toLocaleString()}</p>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      {/* Buy Modal */}
      {buyModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setBuyModal(null); setScreenshot(null); setBuyAmount(''); }}>
          <div className="bg-[#1e1635] rounded-2xl border border-white/10 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto space-y-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingCart className="text-cyan" size={20} /> Buy VC Coins
            </h3>

            {/* Amount Input */}
            <div>
              <label className="text-white/50 text-xs font-semibold mb-1.5 block">VC Amount to Buy</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={Number(buyModal.remaining_amount || buyModal.amount)}
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple"
              />
              <p className="text-white/30 text-[10px] mt-1">Max: {Number(buyModal.remaining_amount || buyModal.amount).toFixed(2)} VC</p>
            </div>

            {/* Order Summary */}
            <div className="bg-white/5 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/50">Seller</span>
                <span className="text-white font-bold">{buyModal.seller_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">VC Coins you'll get</span>
                <span className="text-white font-bold">{Number(buyAmount || 0).toFixed(2)} VC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Price per VC</span>
                <span className="text-purple font-bold">₹{Number(buyModal.price_per_vc).toFixed(2)}</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between">
                <span className="text-white font-semibold">Total ₹ to Pay</span>
                <span className="text-green font-bold text-lg">₹{buyTotalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Seller Payment Info */}
            <div className="bg-cyan/5 border border-cyan/10 rounded-xl p-4 space-y-3">
              <p className="text-cyan text-xs font-semibold">Pay the Seller</p>
              {buyModal.seller_upi && (
                <div>
                  <p className="text-white/40 text-[10px] mb-1">UPI ID</p>
                  <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                    <code className="text-sm text-cyan font-mono flex-1 truncate">{buyModal.seller_upi}</code>
                    <button onClick={() => copyUpi(buyModal.seller_upi)} className="text-white/50 hover:text-white transition">
                      {copied ? <CheckCircle size={16} className="text-green" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              )}
              {buyModal.seller_qr && (
                <div>
                  <p className="text-white/40 text-[10px] mb-1">QR Code</p>
                  <img
                    src={`${API_BASE_URL}/uploads/${buyModal.seller_qr}`}
                    alt="Seller QR"
                    className="w-40 h-40 object-contain bg-white rounded-lg mx-auto border border-white/10"
                  />
                </div>
              )}
              <p className="text-white/30 text-[10px]">
                Pay ₹{buyTotalPrice.toFixed(2)} using GPay, PhonePe, Paytm or any UPI app
              </p>
            </div>

            {/* Screenshot Upload */}
            <div className="bg-purple/5 border border-purple/10 rounded-xl p-4">
              <p className="text-purple text-xs font-semibold mb-2 flex items-center gap-1">
                <Upload size={14} /> Upload Payment Screenshot
              </p>
              <label className="flex items-center gap-3 cursor-pointer bg-white/5 rounded-lg px-4 py-3 hover:bg-white/10 transition">
                <Image size={20} className="text-white/40" />
                <span className="text-white/50 text-sm flex-1">
                  {screenshot ? screenshot.name : 'Choose screenshot...'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setScreenshot(e.target.files[0] || null)}
                />
              </label>
              {screenshot && (
                <div className="mt-2 rounded-lg overflow-hidden border border-white/10">
                  <img src={URL.createObjectURL(screenshot)} alt="Payment proof" className="w-full max-h-48 object-contain bg-black/30" />
                </div>
              )}
            </div>

            <div className="bg-yellow-400/5 border border-yellow-400/10 rounded-xl p-3 flex items-start gap-2 text-xs text-yellow-400/80">
              <Info size={14} className="mt-0.5 shrink-0" />
              <p>Pay the seller via UPI/QR, upload the screenshot, and submit. Admin will verify your payment and transfer VC coins to your wallet.</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setBuyModal(null); setScreenshot(null); setBuyAmount(''); }} className="flex-1 bg-white/10 text-white py-2.5 rounded-xl hover:bg-white/20 transition text-sm font-semibold">
                Cancel
              </button>
              <button
                onClick={() => handleBuy(buyModal.id)}
                disabled={buyingId === buyModal.id || !screenshot || !buyAmount || Number(buyAmount) <= 0}
                className="flex-1 bg-linear-to-r from-green to-cyan text-bg-dark font-bold py-2.5 rounded-xl hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                {buyingId === buyModal.id ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                {buyingId === buyModal.id ? 'Submitting...' : 'Submit Proof'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
