import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Mail,
  Clock,
  Eye,
  Reply,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  X,
} from 'lucide-react';
import { api } from '../../utils/api';

const statusConfig = {
  new: { label: 'New', bg: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20' },
  read: { label: 'Read', bg: 'bg-cyan/10 text-cyan border-cyan/20' },
  replied: { label: 'Replied', bg: 'bg-green/10 text-green border-green/20' },
};

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [newCount, setNewCount] = useState(0);
  const [processing, setProcessing] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [toast, setToast] = useState(null);

  const fetchEnquiries = async () => {
    try {
      const data = await api.getEnquiries();
      setEnquiries(data.enquiries || []);
      setNewCount(data.newCount || 0);
    } catch { /* ignored */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchEnquiries(); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatusUpdate = async (id, status, note) => {
    setProcessing(id);
    try {
      await api.updateEnquiryStatus(id, { status, admin_note: note || null });
      await fetchEnquiries();
      showToast(`Enquiry marked as ${status}`);
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
    } catch { showToast('Failed to update', 'error'); }
    finally { setProcessing(null); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this enquiry permanently?')) return;
    setProcessing(id);
    try {
      await api.deleteEnquiry(id);
      await fetchEnquiries();
      showToast('Enquiry deleted');
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
    } catch { showToast('Failed to delete', 'error'); }
    finally { setProcessing(null); }
  };

  const filtered = enquiries.filter((e) => {
    if (filter !== 'all' && e.status !== filter) return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      (e.name || '').toLowerCase().includes(s) ||
      (e.email || '').toLowerCase().includes(s) ||
      (e.subject || '').toLowerCase().includes(s) ||
      (e.message || '').toLowerCase().includes(s)
    );
  });

  const counts = {
    all: enquiries.length,
    new: enquiries.filter((e) => e.status === 'new').length,
    read: enquiries.filter((e) => e.status === 'read').length,
    replied: enquiries.filter((e) => e.status === 'replied').length,
  };

  const timeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-purple/30 border-t-purple rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl border animate-fade-in-up ${toast.type === 'error' ? 'bg-red-400/10 border-red-400/20 text-red-400' : 'bg-green/10 border-green/20 text-green'}`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span className="text-sm font-medium">{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Enquiries</h1>
          <p className="text-white/40 text-sm mt-1">{enquiries.length} total · {newCount} new</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 gap-2 w-full sm:w-80">
          <Search size={16} className="text-white/30" />
          <input
            type="text"
            placeholder="Search by name, email, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-white placeholder:text-white/20 outline-none w-full"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'new', 'read', 'replied'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-purple/10 text-purple border border-purple/20' : 'bg-white/5 text-white/40 border border-white/5 hover:text-white/60'}`}
            >
              {f} ({counts[f]})
            </button>
          ))}
        </div>
      </div>

      {/* Enquiry List */}
      {filtered.length === 0 ? (
        <div className="bg-white/5 border border-white/5 rounded-2xl p-12 text-center">
          <MessageSquare size={32} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">No enquiries found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((e) => {
            const sc = statusConfig[e.status] || statusConfig.new;
            return (
              <div
                key={e.id}
                className="bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left block */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <div className="w-9 h-9 rounded-xl bg-linear-to-br from-purple/20 to-cyan/20 flex items-center justify-center text-xs font-bold text-white/60 shrink-0">
                        {(e.name || 'U')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{e.name}</p>
                        <p className="text-[11px] text-white/30 flex items-center gap-1"><Mail size={10} /> {e.email}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${sc.bg}`}>{sc.label}</span>
                      <span className="text-[10px] text-white/20 flex items-center gap-1"><Clock size={10} /> {timeAgo(e.createdAt)}</span>
                    </div>

                    {e.subject && <p className="text-xs font-semibold text-white/60 mb-1">{e.subject}</p>}
                    <p className="text-sm text-white/40 leading-relaxed line-clamp-2">{e.message}</p>
                    {e.admin_note && (
                      <div className="mt-2 flex items-start gap-2 px-3 py-2 rounded-lg bg-purple/5 border border-purple/10">
                        <Reply size={12} className="text-purple mt-0.5 shrink-0" />
                        <p className="text-xs text-white/50">{e.admin_note}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {e.status === 'new' && (
                      <button
                        onClick={() => handleStatusUpdate(e.id, 'read')}
                        disabled={processing === e.id}
                        className="p-2 rounded-lg bg-cyan/10 text-cyan hover:bg-cyan/20 transition-all disabled:opacity-40"
                        title="Mark as Read"
                      >
                        {processing === e.id ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
                      </button>
                    )}
                    <button
                      onClick={() => { setSelectedEnquiry(e); setAdminNote(e.admin_note || ''); }}
                      className="p-2 rounded-lg bg-purple/10 text-purple hover:bg-purple/20 transition-all"
                      title="Reply / Update"
                    >
                      <Reply size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(e.id)}
                      disabled={processing === e.id}
                      className="p-2 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-all disabled:opacity-40"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Reply / Detail Modal ── */}
      {selectedEnquiry && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setSelectedEnquiry(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-bg-dark border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Enquiry Details</h3>
                <button onClick={() => setSelectedEnquiry(null)} className="text-white/30 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              {/* Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple/20 to-cyan/20 flex items-center justify-center text-sm font-bold text-white/60">
                    {(selectedEnquiry.name || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{selectedEnquiry.name}</p>
                    <p className="text-xs text-white/30">{selectedEnquiry.email}</p>
                  </div>
                </div>

                {selectedEnquiry.subject && (
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider font-semibold mb-1">Subject</p>
                    <p className="text-sm text-white/70">{selectedEnquiry.subject}</p>
                  </div>
                )}

                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider font-semibold mb-1">Message</p>
                  <p className="text-sm text-white/60 leading-relaxed bg-white/5 rounded-xl p-4 border border-white/5">{selectedEnquiry.message}</p>
                </div>

                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider font-semibold mb-2">Admin Note</p>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    rows={3}
                    placeholder="Add a note or reply..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-purple/40 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => handleStatusUpdate(selectedEnquiry.id, 'replied', adminNote)}
                  disabled={processing === selectedEnquiry.id}
                  className="flex-1 py-3 rounded-xl bg-linear-to-r from-green to-cyan text-bg-dark font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {processing === selectedEnquiry.id ? <Loader2 size={14} className="animate-spin" /> : <Reply size={14} />} Mark Replied
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedEnquiry.id, 'read', adminNote)}
                  disabled={processing === selectedEnquiry.id}
                  className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 font-semibold text-sm hover:bg-white/10 transition-all disabled:opacity-50"
                >
                  Mark Read
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminEnquiries;
