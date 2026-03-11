import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Save,
  CheckCircle,
  AlertCircle,
  Hash,
  Calendar,
  Shield,
  KeyRound,
  Copy,
  Check,
  Pen,
} from 'lucide-react';
import { api, setToken } from '../../utils/api';

const UserSettings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Profile form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ text: '', type: '' });

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await api.me();
        setUser(data.user);
        setName(data.user.name || '');
        setEmail(data.user.email || '');
        setMobile(data.user.mobile || '');
      } catch { /* ignored */ }
      finally { setLoading(false); }
    };
    fetchUser();
  }, []);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setProfileMsg({ text: 'Name is required.', type: 'error' });
      return;
    }
    setProfileSaving(true);
    setProfileMsg({ text: '', type: '' });
    try {
      const data = await api.updateProfile({ name: name.trim(), email: email.trim(), mobile: mobile.trim() });
      if (data.token) setToken(data.token);
      if (data.user) setUser(data.user);
      setProfileMsg({ text: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setProfileMsg({ text: err.message || 'Failed to update profile.', type: 'error' });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setPwMsg({ text: 'All fields are required.', type: 'error' });
      return;
    }
    if (newPassword.length < 6) {
      setPwMsg({ text: 'New password must be at least 6 characters.', type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMsg({ text: 'Passwords do not match.', type: 'error' });
      return;
    }
    setPwSaving(true);
    setPwMsg({ text: '', type: '' });
    try {
      await api.changePassword({ currentPassword, newPassword });
      setPwMsg({ text: 'Password changed successfully!', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwMsg({ text: err.message || 'Failed to change password.', type: 'error' });
    } finally {
      setPwSaving(false);
    }
  };

  const initials = (user?.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-green/30 border-t-green rounded-full animate-spin" />
      </div>
    );
  }

  const InputField = ({ icon, label, type = 'text', value, onChange, placeholder, rightElement }) => {
    const Icon = icon;
    return (
      <div className="space-y-1.5">
        <label className="text-white/50 text-xs font-semibold uppercase tracking-wider block">{label}</label>
        <div className="relative group">
          <div className="absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center pointer-events-none">
            <Icon size={16} className="text-white/25 group-focus-within:text-green transition-colors" />
          </div>
          <input
            type={type}
            value={value}
            onChange={onChange}
            className="w-full bg-white/3 border border-white/8 rounded-xl pl-11 pr-11 py-3.5 text-sm text-white placeholder:text-white/15 focus:outline-none focus:border-green/40 focus:bg-white/5 transition-all duration-200"
            placeholder={placeholder}
          />
          {rightElement && (
            <div className="absolute right-0 top-0 bottom-0 w-11 flex items-center justify-center">
              {rightElement}
            </div>
          )}
        </div>
      </div>
    );
  };

  const Alert = ({ msg }) => {
    if (!msg.text) return null;
    const isSuccess = msg.type === 'success';
    return (
      <div className={`flex items-center gap-2.5 text-sm px-4 py-3 rounded-xl border ${isSuccess ? 'bg-green/6 text-green border-green/10' : 'bg-red-400/6 text-red-400 border-red-400/10'}`}>
        {isSuccess ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
        <span className="font-medium">{msg.text}</span>
      </div>
    );
  };

  return (
    <div className="animate-fade-in-up max-w-2xl mx-auto space-y-6 pb-8">

      {/* Profile Hero Card */}
      <div className="relative bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
        {/* Gradient background strip */}
        <div className="h-24 bg-linear-to-r from-green/20 via-purple/15 to-cyan/20 relative z-9">
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-white/5 backdrop-blur-sm" />
        </div>

        <div className="px-6 pb-6 z-10 relative">
          {/* Avatar overlapping the gradient */}
          <div className="-mt-10 flex items-end gap-4 mb-5">
            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-green to-cyan flex items-center justify-center text-2xl font-bold text-bg-dark shadow-lg shadow-green/20 ring-4 ring-bg-dark shrink-0">
              {initials}
            </div>
            <div className="pb-1 min-w-0">
              <h1 className="text-xl font-bold text-white truncate">{user?.name}</h1>
              <p className="text-white/40 text-sm truncate">{user?.email || 'No email set'}</p>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/3 border border-white/6 rounded-xl px-4 py-3">
              <p className="text-white/30 text-[10px] font-semibold uppercase tracking-wider mb-0.5">User ID</p>
              <p className="text-white text-sm font-bold">#{user?.id}</p>
            </div>
            <div className="bg-white/3 border border-white/6 rounded-xl px-4 py-3">
              <p className="text-white/30 text-[10px] font-semibold uppercase tracking-wider mb-0.5">Account Type</p>
              <p className="text-sm font-bold">
                <span className={`inline-flex items-center gap-1 ${user?.user_type === 'admin' ? 'text-purple' : 'text-green'}`}>
                  <Shield size={12} />
                  {user?.user_type === 'admin' ? 'Admin' : 'User'}
                </span>
              </p>
            </div>
            <div className="bg-white/3 border border-white/6 rounded-xl px-4 py-3">
              <p className="text-white/30 text-[10px] font-semibold uppercase tracking-wider mb-0.5">Referral Code</p>
              <div className="flex items-center gap-2">
                <p className="text-cyan text-sm font-bold font-mono tracking-wide">{user?.referral_code || '—'}</p>
                {user?.referral_code && (
                  <button
                    onClick={() => handleCopy(user.referral_code)}
                    className="text-white/30 hover:text-green transition-colors"
                  >
                    {copied ? <Check size={12} className="text-green" /> : <Copy size={12} />}
                  </button>
                )}
              </div>
            </div>
            <div className="bg-white/3 border border-white/6 rounded-xl px-4 py-3">
              <p className="text-white/30 text-[10px] font-semibold uppercase tracking-wider mb-0.5">Member Since</p>
              <p className="text-white text-sm font-bold flex items-center gap-1.5">
                <Calendar size={12} className="text-white/30" />
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile */}
      <form onSubmit={handleProfileSave} className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green/10 flex items-center justify-center">
              <Pen size={16} className="text-green" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Edit Profile</h3>
              <p className="text-white/30 text-[11px]">Update your personal information</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <InputField
            icon={User}
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
          />
          <InputField
            icon={Mail}
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <InputField
            icon={Phone}
            label="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter your mobile number"
          />

          <Alert msg={profileMsg} />

          <button
            type="submit"
            disabled={profileSaving}
            className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-linear-to-r from-green to-cyan text-bg-dark text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-green/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
          >
            {profileSaving ? <div className="w-4 h-4 border-2 border-bg-dark border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        </div>
      </form>

      {/* Change Password */}
      <form onSubmit={handlePasswordChange} className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple/10 flex items-center justify-center">
              <KeyRound size={16} className="text-purple" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Change Password</h3>
              <p className="text-white/30 text-[11px]">Secure your account with a strong password</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <InputField
            icon={Lock}
            label="Current Password"
            type={showCurrent ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            rightElement={
              <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="text-white/25 hover:text-white/50 transition-colors">
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
          <InputField
            icon={Lock}
            label="New Password"
            type={showNew ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password (min 6 chars)"
            rightElement={
              <button type="button" onClick={() => setShowNew(!showNew)} className="text-white/25 hover:text-white/50 transition-colors">
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
          <InputField
            icon={Lock}
            label="Confirm New Password"
            type={showConfirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            rightElement={
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-white/25 hover:text-white/50 transition-colors">
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          {/* Strength indicator */}
          {newPassword && (
            <div className="space-y-1.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(i => {
                  const strength = newPassword.length >= 12 ? 4 : newPassword.length >= 8 ? 3 : newPassword.length >= 6 ? 2 : 1;
                  return (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength
                        ? strength <= 1 ? 'bg-red-400' : strength <= 2 ? 'bg-yellow-400' : strength <= 3 ? 'bg-green/70' : 'bg-green'
                        : 'bg-white/6'
                        }`}
                    />
                  );
                })}
              </div>
              <p className="text-[11px] text-white/30">
                {newPassword.length < 6 ? 'Too short' : newPassword.length < 8 ? 'Fair' : newPassword.length < 12 ? 'Good' : 'Strong'}
              </p>
            </div>
          )}

          <Alert msg={pwMsg} />

          <button
            type="submit"
            disabled={pwSaving}
            className="flex items-center justify-center gap-2.5 w-full py-3.5 bg-white/4 border border-white/8 text-white text-sm font-bold rounded-xl hover:bg-white/8 hover:border-white/12 active:scale-[0.99] transition-all duration-200 disabled:opacity-50"
          >
            {pwSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <KeyRound size={16} />}
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserSettings;
