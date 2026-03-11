import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Send,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  CheckCircle,
  Search,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../../utils/api';

const TransferPage = () => {
  const { user } = useOutletContext();
  const [balance, setBalance] = useState(0);
  const [transfers, setTransfers] = useState([]);
  const [totalSent, setTotalSent] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);
  const [loading, setLoading] = useState(true);

  // Form
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      const [balData, txData] = await Promise.all([
        api.getBalance(),
        api.myTransfers(),
      ]);
      setBalance(balData.balance || 0);
      setTransfers(txData.transfers || []);
      setTotalSent(txData.totalSent || 0);
      setTotalReceived(txData.totalReceived || 0);
    } catch { }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!receiver.trim()) return setError('Enter email or mobile of the receiver.');
    if (!amount || Number(amount) < 10) return setError('Minimum transfer is 10 VC.');
    if (Number(amount) > balance) return setError('Insufficient balance.');

    setSending(true);
    try {
      const res = await api.sendTransfer({
        receiver_identifier: receiver.trim(),
        amount: Number(amount),
        note: note.trim() || undefined,
      });
      setSuccess(res.message);
      setReceiver('');
      setAmount('');
      setNote('');
      fetchData();
    } catch (err) {
      setError(err.message || 'Transfer failed.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-green/30 border-t-green rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
          <Send size={28} className="text-cyan" /> P2P Transfer
        </h1>
        <p className="text-white/40 text-sm mt-1">Send VC Coins to another user instantly</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center mb-3">
            <Wallet size={18} className="text-green" />
          </div>
          <p className="text-xs text-white/30 mb-1">Balance</p>
          <p className="text-xl font-bold text-white">{Number(balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })} <span className="text-green text-xs">VC</span></p>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-red-400/10 flex items-center justify-center mb-3">
            <ArrowUpRight size={18} className="text-red-400" />
          </div>
          <p className="text-xs text-white/30 mb-1">Total Sent</p>
          <p className="text-xl font-bold text-white">{Number(totalSent).toLocaleString('en-IN', { minimumFractionDigits: 2 })} <span className="text-red-400 text-xs">VC</span></p>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
          <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center mb-3">
            <ArrowDownLeft size={18} className="text-cyan" />
          </div>
          <p className="text-xs text-white/30 mb-1">Total Received</p>
          <p className="text-xl font-bold text-white">{Number(totalReceived).toLocaleString('en-IN', { minimumFractionDigits: 2 })} <span className="text-cyan text-xs">VC</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Send Form */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Send size={18} className="text-cyan" /> Send VC Coins
            </h2>

            <form onSubmit={handleSend} className="space-y-4">
              {/* Receiver */}
              <div>
                <label className="text-xs text-white/40 font-medium block mb-1.5">Receiver (Email or Mobile)</label>
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
                  <input
                    type="text"
                    value={receiver}
                    onChange={(e) => setReceiver(e.target.value)}
                    placeholder="email@example.com or 9876543210"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-cyan/30"
                  />
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="text-xs text-white/40 font-medium block mb-1.5">Amount (VC)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Min 10 VC"
                  min="10"
                  step="0.01"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-cyan/30"
                />
              </div>

              {/* Note */}
              <div>
                <label className="text-xs text-white/40 font-medium block mb-1.5">Note (Optional)</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Payment for..."
                  maxLength={200}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-cyan/30"
                />
              </div>

              {/* Error / Success */}
              {error && (
                <div className="bg-red-400/10 border border-red-400/20 rounded-xl p-3 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-400 shrink-0" />
                  <p className="text-red-400 text-xs">{error}</p>
                </div>
              )}
              {success && (
                <div className="bg-green/10 border border-green/20 rounded-xl p-3 flex items-center gap-2">
                  <CheckCircle size={16} className="text-green shrink-0" />
                  <p className="text-green text-xs">{success}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-linear-to-r from-cyan to-blue text-white font-black py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm hover:brightness-110 transition-all disabled:opacity-50"
              >
                <Send size={16} /> {sending ? 'Sending...' : 'Send VC Coins'}
              </button>
            </form>
          </div>
        </div>

        {/* Transfer History */}
        <div className="lg:col-span-3">
          <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/5">
              <h2 className="text-sm font-bold text-white">Transfer History</h2>
            </div>
            {transfers.length === 0 ? (
              <div className="text-center py-12">
                <Send size={32} className="text-white/10 mx-auto mb-3" />
                <p className="text-white/20 text-sm">No transfers yet</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {transfers.map((t) => {
                  const isSent = t.sender_id === user?.id;
                  return (
                    <div key={t.id} className="flex items-center justify-between px-5 py-4 hover:bg-white/2">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isSent ? 'bg-red-400/10' : 'bg-green/10'}`}>
                          {isSent
                            ? <ArrowUpRight size={16} className="text-red-400" />
                            : <ArrowDownLeft size={16} className="text-green" />
                          }
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {isSent ? `To ${t.receiver_name}` : `From ${t.sender_name}`}
                          </p>
                          <p className="text-[10px] text-white/30">
                            {new Date(t.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {t.note && <p className="text-[10px] text-white/20 mt-0.5">{t.note}</p>}
                        </div>
                      </div>
                      <p className={`text-sm font-bold ${isSent ? 'text-red-400' : 'text-green'}`}>
                        {isSent ? '-' : '+'}{Number(t.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })} VC
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferPage;
