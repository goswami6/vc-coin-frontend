import React, { useState, useRef, useEffect } from 'react';
import { Mail, KeyRound, Lock, Eye, EyeOff, ArrowLeft, Send, ShieldCheck, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const otpRefs = useRef([]);

  useEffect(() => {
    if (step === 2 && otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, [step]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      await api.forgotPassword({ email });
      setSuccess('OTP sent to your email.');
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      await api.verifyOtp({ email, otp: otpString });
      setSuccess('OTP verified! Set your new password.');
      setStep(3);
    } catch (err) {
      setError(err.message || 'Invalid OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.resetPassword({ email, otp: otp.join(''), password });
      setSuccess('Password reset successful! Redirecting to login…');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  const stepInfo = [
    { num: 1, label: 'Email' },
    { num: 2, label: 'Verify' },
    { num: 3, label: 'Reset' },
  ];

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4 py-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple/10 blur-[120px] rounded-full -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan/10 blur-[120px] rounded-full -ml-48 -mb-48"></div>

      <div className="w-full max-w-120 relative z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-card">

          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 bg-linear-to-br from-green to-cyan rounded-lg flex items-center justify-center shadow-glow-green">
                <span className="text-bg-dark font-black text-xl">VC</span>
              </div>
              <span className="text-2xl font-black text-white tracking-tight">VC Coin</span>
            </Link>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Reset Password</h2>
            <p className="text-white/50 text-sm">
              {step === 1 && 'Enter your email to receive a verification code'}
              {step === 2 && 'Enter the 6-digit code sent to your email'}
              {step === 3 && 'Create a new password for your account'}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {stepInfo.map((s, i) => (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step > s.num
                    ? 'bg-green text-bg-dark'
                    : step === s.num
                      ? 'bg-linear-to-br from-cyan to-blue text-bg-dark'
                      : 'bg-white/10 text-white/30'
                    }`}>
                    {step > s.num ? <CheckCircle size={18} /> : s.num}
                  </div>
                  <span className={`text-[10px] font-medium ${step >= s.num ? 'text-white/70' : 'text-white/25'}`}>{s.label}</span>
                </div>
                {i < 2 && (
                  <div className={`w-12 h-0.5 rounded-full mb-4 transition-all ${step > s.num ? 'bg-green' : 'bg-white/10'}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-5 animate-fade-in-up">
              <div className="space-y-2">
                <label className="text-white/70 text-sm font-medium ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-cyan transition-colors" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-cyan/50 focus:bg-white/10 outline-none transition-all"
                  />
                </div>
              </div>

              {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
              {success && <p className="text-green text-sm font-medium">{success}</p>}

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-linear-to-r from-cyan to-blue text-bg-dark font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-110 shadow-glow-cyan'}`}
              >
                {loading ? 'Sending…' : <><Send size={18} /> Send OTP</>}
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5 animate-fade-in-up">
              <div className="space-y-3">
                <label className="text-white/70 text-sm font-medium ml-1">Verification Code</label>
                <div className="flex justify-center gap-2.5" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 bg-white/5 border border-white/10 rounded-xl text-center text-white text-xl font-bold focus:border-cyan/50 focus:bg-white/10 outline-none transition-all"
                    />
                  ))}
                </div>
                <p className="text-white/30 text-xs text-center mt-2">
                  Sent to <span className="text-cyan">{email}</span> · Valid for 10 minutes
                </p>
              </div>

              {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
              {success && <p className="text-green text-sm font-medium">{success}</p>}

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-linear-to-r from-cyan to-blue text-bg-dark font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-110 shadow-glow-cyan'}`}
              >
                {loading ? 'Verifying…' : <><ShieldCheck size={18} /> Verify OTP</>}
              </button>

              <button
                type="button"
                onClick={() => { setError(''); setSuccess(''); handleSendOtp({ preventDefault: () => { } }); }}
                disabled={loading}
                className="w-full text-white/40 hover:text-white text-sm font-medium py-2 transition-colors"
              >
                Didn't receive code? Resend OTP
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-5 animate-fade-in-up">
              <div className="space-y-2">
                <label className="text-white/70 text-sm font-medium ml-1">New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-purple transition-colors" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder:text-white/20 focus:border-purple/50 focus:bg-white/10 outline-none transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-white/70 text-sm font-medium ml-1">Confirm Password</label>
                <div className="relative group">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-purple transition-colors" size={20} />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder:text-white/20 focus:border-purple/50 focus:bg-white/10 outline-none transition-all"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
              {success && <p className="text-green text-sm font-medium">{success}</p>}

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-linear-to-r from-green to-cyan text-bg-dark font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-110 shadow-glow-green'}`}
              >
                {loading ? 'Resetting…' : <><Lock size={18} /> Reset Password</>}
              </button>
            </form>
          )}

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
