import React, { useState, useEffect } from 'react';
import {
  ArrowUpFromLine, Wallet, Clock, CheckCircle, XCircle,
  Loader2, AlertCircle, Banknote, CreditCard, Eye,
} from 'lucide-react';
import { api } from '../../utils/api';

const WithdrawPage = () => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('upi');
  const [accountDetails, setAccountDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const [withdrawals, setWithdrawals] = useState([]);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [detailItem, setDetailItem] = useState(null);

  const fetchData = async () => {
    try {
      const [wData, balData] = await Promise.all([
        api.myWithdrawals(),
        api.getBalance(),
      ]);
      setWithdrawals(wData.withdrawals || []);
      setTotalWithdrawn(wData.totalWithdrawn || 0);
      setPendingAmount(wData.pendingAmount || 0);
      setBalance(balData.balance ?? 0);
    } catch { }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });
    if (!amount || Number(amount) <= 0) {
      setMsg({ text: 'Enter a valid amount.', type: 'error' });
      return;
    }
    if (!accountDetails.trim()) {
      setMsg({ text: 'Enter your payment details.', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      const res = await api.requestWithdraw({
        amount: Number(amount),
        method,
        account_details: accountDetails.trim(),
      });
      setMsg({ text: res.message, type: 'success' });
      setAmount('');
      setAccountDetails('');
      fetchData();
    } catch (err) {
      setMsg({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (s) => {
    if (s === 'pending') return 'text-yellow-400 bg-yellow-400/10';
    if (s === 'approved') return 'text-green bg-green/10';
    if (s === 'rejected') return 'text-red-400 bg-red-400/10';
    return 'text-white/40 bg-white/5';
  };

  const available = Number(balance) - pendingAmount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ArrowUpFromLine className="text-green" size={28} /> Withdraw VC Coin
        </h1>
        <p className="text-white/50 text-sm mt-1">Request withdrawal — admin approval required</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Wallet Balance', value: `${Number(balance).toFixed(2)} VC`, icon: Wallet, color: 'text-green' },
          { label: 'Pending Withdrawals', value: `${pendingAmount.toFixed(2)} VC`, icon: Clock, color: 'text-yellow-400' },
          { label: 'Available', value: `${available.toFixed(2)} VC`, icon: Banknote, color: 'text-cyan' },
          { label: 'Total Withdrawn', value: `${totalWithdrawn.toFixed(2)} VC`, icon: CheckCircle, color: 'text-purple' },
        ].map((s, i) => (
          <div key={i} className="bg-[#1e1635] rounded-xl p-4 border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <s.icon size={16} className={s.color} />
              <span className="text-white/40 text-xs">{s.label}</span>
            </div>
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Message */}
      {msg.text && (
        <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${msg.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green/10 text-green border border-green/20'}`}>
          {msg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          {msg.text}
        </div>
      )}

      {/* Withdraw Form */}
      <div className="bg-[#1e1635] rounded-2xl border border-white/5 p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Banknote className="text-green" size={20} /> New Withdrawal Request
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Method Selector */}
          <div>
            <label className="text-white/50 text-xs font-semibold mb-2 block">Payment Method</label>
            <div className="flex gap-3">
              {[
                { key: 'upi', label: 'UPI', icon: CreditCard },
                { key: 'bank', label: 'Bank Transfer', icon: Banknote },
              ].map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setMethod(m.key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all border ${method === m.key ? 'bg-green/10 text-green border-green/30' : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'}`}
                >
                  <m.icon size={16} /> {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="text-white/50 text-xs font-semibold mb-1.5 block">Amount (VC)</label>
            <input
              type="number"
              step="0.01"
              min="10"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Min 10 VC"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-green"
            />
          </div>

          {/* Account Details */}
          <div>
            <label className="text-white/50 text-xs font-semibold mb-1.5 block">
              {method === 'upi' ? 'UPI ID' : 'Bank Account Details (Name, A/C No, IFSC)'}
            </label>
            <textarea
              rows={method === 'upi' ? 1 : 3}
              value={accountDetails}
              onChange={(e) => setAccountDetails(e.target.value)}
              placeholder={method === 'upi' ? 'yourname@upi' : 'Account Holder Name\nAccount Number\nIFSC Code'}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-green resize-none"
            />
          </div>

          {/* Preview */}
          {amount && Number(amount) > 0 && (
            <div className="bg-white/5 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between text-white/60">
                <span>Withdraw Amount</span>
                <span className="text-white font-medium">{Number(amount).toFixed(2)} VC</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Payment Method</span>
                <span className="text-white font-medium capitalize">{method === 'upi' ? 'UPI' : 'Bank Transfer'}</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between">
                <span className="text-white/60">Remaining Balance</span>
                <span className="text-cyan font-bold">{(available - Number(amount)).toFixed(2)} VC</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-green to-cyan text-bg-dark font-bold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <ArrowUpFromLine size={18} />}
            {loading ? 'Submitting...' : 'Submit Withdrawal Request'}
          </button>
        </form>
      </div>

      {/* Withdrawal History */}
      <div className="bg-[#1e1635] rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="text-yellow-400" size={20} /> Withdrawal History
          </h2>
        </div>
        {withdrawals.length === 0 ? (
          <div className="p-10 text-center">
            <ArrowUpFromLine className="mx-auto text-white/20 mb-3" size={40} />
            <p className="text-white/40">No withdrawals yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-white/40 text-xs">
                  <th className="text-left p-4">ID</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Method</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4"></th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4 text-white/60">#{w.id}</td>
                    <td className="p-4 text-white font-semibold">{Number(w.amount).toFixed(2)} VC</td>
                    <td className="p-4 text-white/60 capitalize">{w.method === 'upi' ? 'UPI' : 'Bank'}</td>
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
                      <button onClick={() => setDetailItem(w)} className="text-white/30 hover:text-white">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDetailItem(null)}>
          <div className="bg-[#1e1635] rounded-2xl border border-white/10 p-6 max-w-md w-full space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white">Withdrawal #{detailItem.id}</h3>
            <div className="space-y-2 text-sm">
              {[
                ['Amount', `${Number(detailItem.amount).toFixed(2)} VC`],
                ['Method', detailItem.method === 'upi' ? 'UPI' : 'Bank Transfer'],
                ['Account Details', detailItem.account_details],
                ['Status', detailItem.status],
                ['Date', new Date(detailItem.createdAt).toLocaleString()],
                ['Admin Note', detailItem.admin_note || '—'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-white/40">{k}</span>
                  <span className="text-white font-medium text-right max-w-[200px] break-all">{v}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setDetailItem(null)} className="w-full bg-white/10 text-white py-2.5 rounded-xl hover:bg-white/20 transition text-sm font-semibold">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawPage;
