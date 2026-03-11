import React, { useState, useEffect, useRef } from 'react';
import {
  Settings, IndianRupee, Save, Loader2, CheckCircle, AlertCircle, Coins,
  QrCode, Smartphone, Upload, ArrowDownToLine,
} from 'lucide-react';
import { api, API_BASE_URL as API_BASE } from '../../utils/api';

const AdminSettings = () => {
  const [vcRate, setVcRate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  // Deposit settings
  const [depUpi, setDepUpi] = useState('');
  const [depMin, setDepMin] = useState('');
  const [depMax, setDepMax] = useState('');
  const [depQrPreview, setDepQrPreview] = useState('');
  const [depQrFile, setDepQrFile] = useState(null);
  const [savingDep, setSavingDep] = useState(false);
  const [depMsg, setDepMsg] = useState({ text: '', type: '' });
  const qrRef = useRef();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [rateData, depData] = await Promise.all([
          api.getVcRate(),
          api.getDepositSettings(),
        ]);
        if (active) {
          setVcRate(String(rateData.vc_rate || 50));
          setDepUpi(depData.upi_id || '');
          setDepMin(String(depData.min_amount || 500));
          setDepMax(String(depData.max_amount || 1000000));
          if (depData.qr_image) setDepQrPreview(`${API_BASE}${depData.qr_image}`);
        }
      } catch { /* ignored */ }
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!vcRate || Number(vcRate) <= 0) {
      setMsg({ text: 'Enter a valid rate.', type: 'error' });
      return;
    }
    setSaving(true);
    setMsg({ text: '', type: '' });
    try {
      const res = await api.updateVcRate(Number(vcRate));
      setMsg({ text: res.message, type: 'success' });
    } catch (err) {
      setMsg({ text: err.message, type: 'error' });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-purple" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="text-purple" size={28} /> Platform Settings
        </h1>
        <p className="text-white/50 text-sm mt-1">Configure marketplace rates and platform options</p>
      </div>

      {/* Message */}
      {msg.text && (
        <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${msg.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green/10 text-green border border-green/20'}`}>
          {msg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          {msg.text}
        </div>
      )}

      {/* VC Rate Card */}
      <div className="bg-[#1a1230] rounded-2xl border border-white/5 p-6 max-w-lg">
        <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <Coins className="text-green" size={20} /> VC Coin Rate
        </h2>
        <p className="text-white/40 text-xs mb-5">Set the current rate of 1 VC Coin in INR (₹). This rate will be shown to users on the marketplace when they create a sell order.</p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-white/50 text-xs font-semibold mb-1.5 block">1 VC Coin = ₹</label>
            <div className="relative">
              <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={vcRate}
                onChange={(e) => setVcRate(e.target.value)}
                placeholder="e.g. 50"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-lg font-bold focus:outline-none focus:border-purple"
              />
            </div>
          </div>

          {/* Preview */}
          {vcRate && Number(vcRate) > 0 && (
            <div className="bg-white/5 rounded-xl p-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-white/60">
                <span>1 VC</span>
                <span className="text-green font-bold">₹{Number(vcRate).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>10 VC</span>
                <span className="text-white font-medium">₹{(Number(vcRate) * 10).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>100 VC</span>
                <span className="text-white font-medium">₹{(Number(vcRate) * 100).toFixed(2)}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-purple text-white font-bold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Save Rate'}
          </button>
        </form>
      </div>

      {/* Deposit Settings Card */}
      <div className="bg-[#1a1230] rounded-2xl border border-white/5 p-6 max-w-lg">
        <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <ArrowDownToLine className="text-cyan" size={20} /> Deposit Settings
        </h2>
        <p className="text-white/40 text-xs mb-5">Configure UPI ID, QR code, and deposit limits shown to users on the deposit page.</p>

        {depMsg.text && (
          <div className={`p-3 rounded-xl text-sm flex items-center gap-2 mb-4 ${depMsg.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green/10 text-green border border-green/20'}`}>
            {depMsg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
            {depMsg.text}
          </div>
        )}

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setSavingDep(true);
            setDepMsg({ text: '', type: '' });
            try {
              const fd = new FormData();
              fd.append('upi_id', depUpi);
              fd.append('min_amount', depMin);
              fd.append('max_amount', depMax);
              if (depQrFile) fd.append('qr_image', depQrFile);
              const res = await api.updateDepositSettings(fd);
              setDepMsg({ text: res.message, type: 'success' });
              if (res.qr_image) setDepQrPreview(`${API_BASE}${res.qr_image}`);
            } catch (err) {
              setDepMsg({ text: err.message, type: 'error' });
            }
            setSavingDep(false);
          }}
          className="space-y-4"
        >
          {/* UPI ID */}
          <div>
            <label className="text-white/50 text-xs font-semibold mb-1.5 flex items-center gap-1">
              <Smartphone size={12} /> UPI ID
            </label>
            <input
              type="text"
              value={depUpi}
              onChange={(e) => setDepUpi(e.target.value)}
              placeholder="e.g. merchant@upi"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan"
            />
          </div>

          {/* QR Code Upload */}
          <div>
            <label className="text-white/50 text-xs font-semibold mb-1.5 flex items-center gap-1">
              <QrCode size={12} /> Payment QR Code
            </label>
            <div
              onClick={() => qrRef.current?.click()}
              className="bg-white/5 border border-dashed border-white/10 rounded-xl p-4 text-center cursor-pointer hover:border-cyan/30 transition-all"
            >
              {depQrPreview ? (
                <img src={depQrPreview} alt="QR" className="w-40 h-40 object-contain mx-auto rounded-lg" />
              ) : (
                <div className="flex flex-col items-center gap-2 py-4 text-white/20">
                  <Upload size={24} />
                  <span className="text-xs">Upload QR code image (JPG, PNG)</span>
                </div>
              )}
            </div>
            <input
              ref={qrRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setDepQrFile(file);
                  setDepQrPreview(URL.createObjectURL(file));
                }
              }}
              className="hidden"
            />
          </div>

          {/* Min / Max Amounts */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-white/50 text-xs font-semibold mb-1.5 block">Min Amount (₹)</label>
              <input
                type="number"
                min="0"
                value={depMin}
                onChange={(e) => setDepMin(e.target.value)}
                placeholder="500"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs font-semibold mb-1.5 block">Max Amount (₹)</label>
              <input
                type="number"
                min="1"
                value={depMax}
                onChange={(e) => setDepMax(e.target.value)}
                placeholder="1000000"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={savingDep}
            className="w-full bg-cyan text-bg-dark font-bold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {savingDep ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {savingDep ? 'Saving...' : 'Save Deposit Settings'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
