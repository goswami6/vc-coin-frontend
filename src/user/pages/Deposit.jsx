import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  ArrowDownToLine,
  Wallet,
  Clock,
  Copy,
  CheckCircle,
  XCircle,
  Upload,
  CreditCard,
  QrCode,
  Smartphone,
} from 'lucide-react';
import { api, API_BASE_URL as API_BASE } from '../../utils/api';

const Deposit = () => {
  useOutletContext();
  const [deposits, setDeposits] = useState([]);
  const [stats, setStats] = useState({ totalDeposited: 0, totalCount: 0, pendingAmount: 0, pendingCount: 0 });
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('upi');
  const [txnId, setTxnId] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);
  const fileRef = useRef();

  // Dynamic deposit settings from admin
  const [upiId, setUpiId] = useState('');
  const [qrImage, setQrImage] = useState('');
  const [minAmount, setMinAmount] = useState(500);
  const [maxAmount, setMaxAmount] = useState(1000000);

  const fetchData = async () => {
    try {
      const [depData, settingsData] = await Promise.all([
        api.myDeposits(),
        api.getDepositSettings(),
      ]);
      setDeposits(depData.deposits || []);
      setStats(depData.stats || {});
      setBalance(depData.balance || 0);
      setUpiId(settingsData.upi_id || '');
      setQrImage(settingsData.qr_image || '');
      setMinAmount(settingsData.min_amount || 500);
      setMaxAmount(settingsData.max_amount || 1000000);
    } catch { /* ignored */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScreenshot = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!amount || Number(amount) < minAmount) {
      setError(`Minimum deposit is ₹${minAmount.toLocaleString('en-IN')}.`);
      return;
    }
    if (Number(amount) > maxAmount) {
      setError(`Maximum deposit is ₹${maxAmount.toLocaleString('en-IN')}.`);
      return;
    }
    if (!txnId.trim()) {
      setError('Transaction ID / UTR is required.');
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('amount', amount);
      fd.append('method', method);
      fd.append('txn_id', txnId);
      if (screenshot) fd.append('screenshot', screenshot);

      await api.createDeposit(fd);
      setSuccess('Deposit request submitted! Awaiting admin approval.');
      setAmount('');
      setTxnId('');
      setScreenshot(null);
      setScreenshotPreview(null);
      await fetchData();
    } catch (err) {
      setError(err.message || 'Failed to submit deposit.');
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (status) => {
    const map = {
      pending: 'bg-yellow-400/10 text-yellow-400',
      approved: 'bg-green/10 text-green',
      rejected: 'bg-red-400/10 text-red-400',
    };
    return (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${map[status] || ''}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-green/30 border-t-green rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ArrowDownToLine size={24} className="text-green" /> Deposits
        </h1>
        <p className="text-white/40 text-sm mt-1">Fund your account to start investing</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
          <p className="text-xs text-white/30 mb-1">Total Deposited</p>
          <p className="text-xl font-bold text-white">₹{stats.totalDeposited.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          <p className="text-[10px] text-white/20 mt-1">{stats.totalCount} transactions</p>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
          <p className="text-xs text-white/30 mb-1">Pending</p>
          <p className="text-xl font-bold text-yellow-400">₹{stats.pendingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          <p className="text-[10px] text-white/20 mt-1">{stats.pendingCount} requests</p>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-2xl p-5 col-span-2 lg:col-span-1">
          <p className="text-xs text-white/30 mb-1">Wallet Balance</p>
          <p className="text-xl font-bold text-green">₹{Number(balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* New Deposit Form */}
        <div className="lg:col-span-2 bg-white/5 border border-white/5 rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-bold text-white">New Deposit</h2>

          {/* Payment Methods */}
          <div>
            <p className="text-xs text-white/40 font-medium mb-2">Payment Methods</p>
            <div className="flex gap-2">
              {[
                { id: 'upi', icon: Smartphone, label: 'UPI' },
                { id: 'qr', icon: QrCode, label: 'QR Code' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${method === m.id ? 'bg-green/10 text-green border border-green/20' : 'bg-white/5 text-white/40 border border-white/5 hover:border-white/10'}`}
                >
                  <m.icon size={14} /> {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Info - conditional on method */}
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-3">
            {method === 'upi' && upiId && (
              <div className="space-y-2">
                <p className="text-xs text-white/30 flex items-center gap-1"><Smartphone size={12} /> UPI Payment</p>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-cyan font-mono flex-1 truncate">{upiId}</code>
                  <button
                    onClick={copyUpi}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${copied ? 'bg-green/10 text-green' : 'bg-white/5 text-white/50 hover:text-white'}`}
                  >
                    {copied ? <><CheckCircle size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                  </button>
                </div>
                <p className="text-[10px] text-white/20">Copy UPI ID above and pay using GPay, PhonePe, Paytm, BHIM</p>
              </div>
            )}
            {method === 'upi' && !upiId && (
              <p className="text-white/30 text-xs text-center py-4">UPI ID not configured yet. Contact admin.</p>
            )}
            {method === 'qr' && qrImage && (
              <div className="space-y-2">
                <p className="text-xs text-white/30 flex items-center gap-1"><QrCode size={12} /> Scan QR Code</p>
                <div className="bg-white rounded-xl p-3 inline-block">
                  <img src={`${API_BASE}${qrImage}`} alt="Payment QR" className="w-44 h-44 object-contain" />
                </div>
                <p className="text-[10px] text-white/20">Scan this QR code using any UPI app to make payment</p>
              </div>
            )}
            {method === 'qr' && !qrImage && (
              <p className="text-white/30 text-xs text-center py-4">QR code not configured yet. Contact admin.</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount */}
            <div className="space-y-1.5">
              <label className="text-white/60 text-xs font-medium">Amount (₹)</label>
              <input
                type="number"
                min={minAmount}
                max={maxAmount}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm placeholder:text-white/20 focus:border-green/50 outline-none transition-all"
              />
              <p className="text-[10px] text-white/20">Min: ₹{minAmount.toLocaleString('en-IN')} | Max: ₹{maxAmount.toLocaleString('en-IN')}</p>
            </div>

            {/* Payment Method */}
            <div className="space-y-1.5">
              <label className="text-white/60 text-xs font-medium">Payment Method</label>
              <input
                type="text"
                value={method.toUpperCase()}
                readOnly
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white/50 text-sm outline-none"
              />
            </div>

            {/* TXN ID */}
            <div className="space-y-1.5">
              <label className="text-white/60 text-xs font-medium">Transaction ID / UTR</label>
              <input
                type="text"
                value={txnId}
                onChange={(e) => setTxnId(e.target.value)}
                placeholder="Enter UTR/TXN ID"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm placeholder:text-white/20 focus:border-green/50 outline-none transition-all"
              />
            </div>

            {/* Screenshot */}
            <div className="space-y-1.5">
              <label className="text-white/60 text-xs font-medium">Payment Screenshot</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="bg-white/5 border border-dashed border-white/10 rounded-xl p-3 text-center cursor-pointer hover:border-green/20 transition-all"
              >
                {screenshotPreview ? (
                  <img src={screenshotPreview} alt="Screenshot" className="w-full h-28 object-contain rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 py-3 text-white/20">
                    <Upload size={20} />
                    <span className="text-[10px]">Upload screenshot of your payment (JPG, PNG - Max 5MB)</span>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleScreenshot} className="hidden" />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}
            {success && <p className="text-green text-sm">{success}</p>}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full bg-linear-to-r from-green to-cyan text-bg-dark font-black py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm transition-all ${submitting ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-110'}`}
            >
              {submitting ? 'Submitting…' : <><ArrowDownToLine size={16} /> Submit Deposit</>}
            </button>
          </form>
        </div>

        {/* Deposit History */}
        <div className="lg:col-span-3 bg-white/5 border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Deposit History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-[10px] text-white/30 uppercase font-medium pb-3 pr-3">ID</th>
                  <th className="text-[10px] text-white/30 uppercase font-medium pb-3 pr-3">Amount</th>
                  <th className="text-[10px] text-white/30 uppercase font-medium pb-3 pr-3">Method</th>
                  <th className="text-[10px] text-white/30 uppercase font-medium pb-3 pr-3">TXN ID</th>
                  <th className="text-[10px] text-white/30 uppercase font-medium pb-3 pr-3">Status</th>
                  <th className="text-[10px] text-white/30 uppercase font-medium pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {deposits.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-white/20 text-sm py-12">
                      <Clock size={32} className="mx-auto mb-2 text-white/10" />
                      No deposits yet
                    </td>
                  </tr>
                ) : (
                  deposits.map((d) => (
                    <tr key={d.id} className="border-b border-white/5 last:border-0">
                      <td className="py-3 pr-3 text-xs text-white/40">#{d.id}</td>
                      <td className="py-3 pr-3 text-sm font-bold text-white">₹{Number(d.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 pr-3 text-xs text-white/50 capitalize">{d.method}</td>
                      <td className="py-3 pr-3 text-xs text-white/40 font-mono max-w-30 truncate">{d.txn_id}</td>
                      <td className="py-3 pr-3">{statusBadge(d.status)}</td>
                      <td className="py-3 text-xs text-white/30">
                        {new Date(d.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
