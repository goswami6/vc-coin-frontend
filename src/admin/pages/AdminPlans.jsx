import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  TrendingUp,
  Edit3,
  Trash2,
  X,
  Upload,
  Calendar,
  DollarSign,
  Percent,
  Image as ImageIcon,
  CheckCircle,
} from 'lucide-react';
import { api, API_BASE_URL as API_BASE } from '../../utils/api';

const emptyForm = {
  name: '',
  investment_amount: '',
  daily_roi: '',
  tenure_days: '',
  total_return: '',
};

const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileRef = useRef();

  const fetchPlans = async () => {
    try {
      const data = await api.getPlans();
      setPlans(data.plans || []);
    } catch {
      setError('Failed to load plans.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlans(); }, []);

  // Auto-compute total return
  const computedReturn = () => {
    const amt = Number(form.investment_amount) || 0;
    const roi = Number(form.daily_roi) || 0;
    const days = Number(form.tenure_days) || 0;
    return (amt + (amt * roi / 100) * days).toFixed(2);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const openCreate = () => {
    setEditingPlan(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const openEdit = (plan) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name,
      investment_amount: plan.investment_amount,
      daily_roi: plan.daily_roi,
      tenure_days: plan.tenure_days,
      total_return: plan.total_return,
    });
    setImageFile(null);
    setImagePreview(plan.image ? `${API_BASE}${plan.image}` : null);
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('investment_amount', form.investment_amount);
      fd.append('daily_roi', form.daily_roi);
      fd.append('tenure_days', form.tenure_days);
      fd.append('total_return', form.total_return || computedReturn());
      if (imageFile) fd.append('image', imageFile);

      if (editingPlan) {
        fd.append('status', editingPlan.status || 'active');
        await api.updatePlan(editingPlan.id, fd);
        setSuccess('Plan updated successfully!');
      } else {
        await api.createPlan(fd);
        setSuccess('Plan created successfully!');
      }

      await fetchPlans();
      setTimeout(() => { setShowModal(false); setSuccess(''); }, 1200);
    } catch (err) {
      setError(err.message || 'Failed to save plan.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    try {
      await api.deletePlan(id);
      setPlans(plans.filter((p) => p.id !== id));
    } catch {
      alert('Failed to delete plan.');
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Investment Plans</h1>
          <p className="text-white/40 text-sm mt-1">Create and manage investment plans</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-linear-to-r from-purple to-cyan text-white font-bold px-5 py-2.5 rounded-xl hover:brightness-110 transition-all text-sm"
        >
          <Plus size={18} /> Add Plan
        </button>
      </div>

      {/* Plans Grid */}
      {plans.length === 0 ? (
        <div className="bg-white/5 border border-white/5 rounded-2xl p-12 text-center">
          <TrendingUp size={48} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/30 text-sm">No investment plans yet. Create your first plan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all group">
              {/* Image */}
              <div className="h-40 bg-linear-to-br from-purple/20 to-cyan/10 flex items-center justify-center overflow-hidden">
                {plan.image ? (
                  <img src={`${API_BASE}${plan.image}`} alt={plan.name} className="w-full h-full object-cover" />
                ) : (
                  <TrendingUp size={48} className="text-white/10" />
                )}
              </div>

              {/* Info */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${plan.status === 'active' ? 'bg-green/10 text-green' : 'bg-red-400/10 text-red-400'}`}>
                    {plan.status?.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider">Investment</p>
                    <p className="text-sm font-bold text-cyan">{Number(plan.investment_amount).toLocaleString()} VC</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider">Daily ROI</p>
                    <p className="text-sm font-bold text-green">{plan.daily_roi}%</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider">Tenure</p>
                    <p className="text-sm font-bold text-white">{plan.tenure_days} Days</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider">Total Return</p>
                    <p className="text-sm font-bold text-purple">{Number(plan.total_return).toLocaleString()} VC</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => openEdit(plan)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-medium py-2.5 rounded-xl transition-all"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="flex items-center justify-center gap-1.5 bg-red-400/5 hover:bg-red-400/10 text-red-400/60 hover:text-red-400 text-xs font-medium py-2.5 px-4 rounded-xl transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-bg-dark border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-lg font-bold text-white">
                {editingPlan ? 'Edit Plan' : 'Create New Plan'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-white/30 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Plan Name */}
              <div className="space-y-1.5">
                <label className="text-white/60 text-xs font-medium">Plan Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Starter Plan"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm placeholder:text-white/20 focus:border-purple/50 outline-none transition-all"
                />
              </div>

              {/* Plan Image */}
              <div className="space-y-1.5">
                <label className="text-white/60 text-xs font-medium">Plan Image</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="bg-white/5 border border-dashed border-white/10 rounded-xl p-4 text-center cursor-pointer hover:border-purple/30 transition-all"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-4 text-white/20">
                      <Upload size={24} />
                      <span className="text-xs">Click to upload image</span>
                    </div>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Amount + ROI */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-white/60 text-xs font-medium flex items-center gap-1">
                    <DollarSign size={12} /> Investment Amount
                  </label>
                  <input
                    name="investment_amount"
                    type="number"
                    min="0"
                    step="any"
                    value={form.investment_amount}
                    onChange={handleChange}
                    placeholder="1000"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm placeholder:text-white/20 focus:border-purple/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-white/60 text-xs font-medium flex items-center gap-1">
                    <Percent size={12} /> Daily ROI (%)
                  </label>
                  <input
                    name="daily_roi"
                    type="number"
                    min="0"
                    step="any"
                    value={form.daily_roi}
                    onChange={handleChange}
                    placeholder="0.5"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm placeholder:text-white/20 focus:border-purple/50 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Tenure + Total Return */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-white/60 text-xs font-medium flex items-center gap-1">
                    <Calendar size={12} /> Tenure Days
                  </label>
                  <input
                    name="tenure_days"
                    type="number"
                    min="1"
                    value={form.tenure_days}
                    onChange={handleChange}
                    placeholder="400"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm placeholder:text-white/20 focus:border-purple/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-white/60 text-xs font-medium flex items-center gap-1">
                    <TrendingUp size={12} /> Total Return
                  </label>
                  <input
                    name="total_return"
                    type="number"
                    min="0"
                    step="any"
                    value={form.total_return || computedReturn()}
                    onChange={handleChange}
                    placeholder="Auto-calculated"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-cyan text-sm placeholder:text-white/20 focus:border-purple/50 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-purple/5 border border-purple/10 rounded-xl p-3 space-y-1.5 text-xs text-white/40">
                <p className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green" /> Level Income up to 6 levels</p>
                <p className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green" /> Minimum investment: 1000 VC</p>
                <p className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green" /> Minimum withdrawal: 500 VC</p>
                <p className="flex items-center gap-1.5"><CheckCircle size={12} className="text-green" /> Admin charge: 2% on all transactions</p>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}
              {success && <p className="text-green text-sm">{success}</p>}

              <button
                type="submit"
                disabled={saving}
                className={`w-full bg-linear-to-r from-purple to-cyan text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all text-sm ${saving ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-110'}`}
              >
                {saving ? 'Saving…' : editingPlan ? 'Update Plan' : 'Create Plan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlans;
