import React, { useState, useEffect } from 'react';
import {
  User, Mail, Phone, Gift, Lock, Eye, EyeOff,
  ArrowRight, ArrowLeft, Check
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, setToken } from '../../utils/api';
import logo from '../../assets/logo/logo.png';

const Signup = () => {
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    referral: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-fill referral code from URL
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) setFormData((prev) => ({ ...prev, referral: ref }));
  }, [searchParams]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    setError('');

    if (!formData.fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const data = await api.register({
        name: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        referral_code: formData.referral || undefined,
      });

      setToken(data.token);
      setStep(3); // success step
    } catch (err) {
      setError(err.message || 'Unable to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = (e) => {
    e.preventDefault();
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4 py-20 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green/10 blur-[120px] rounded-full -ml-48 -mt-48"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple/10 blur-[120px] rounded-full -mr-48 -mb-48"></div>

      <div className="w-full max-w-125 relative z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-card">

          {/* Header & Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <img src={logo} alt="VC Coin" className="w-12 h-12 rounded-xl object-contain" />
              <span className="text-2xl font-black text-white tracking-tight">VC Coin</span>
            </Link>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {step === 3 ? "Success!" : "Create Account"}
            </h2>
            <p className="text-white/50 text-sm">
              {step === 3 ? "Welcome to the future of investing" : "Join the VC Coin community and start investing today"}
            </p>
          </div>

          {/* Step Wizard (Hide on Success) */}
          {step < 3 && (
            <div className="flex items-center justify-center mb-10 gap-2">
              {[1, 2].map((num) => (
                <React.Fragment key={num}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${step >= num ? 'bg-green text-bg-dark shadow-glow-green' : 'bg-white/10 text-white/30'
                    }`}>
                    {step > num ? <Check size={16} strokeWidth={4} /> : num}
                  </div>
                  {num < 2 && (
                    <div className={`w-12 h-0.5 rounded-full transition-all duration-500 ${step > num ? 'bg-green shadow-[0_0_10px_#5EFC8D]' : 'bg-white/10'
                      }`}></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Step 1: Personal Details */}
          {step === 1 && (
            <form onSubmit={nextStep} className="space-y-5 animate-fade-in-up">
              <div className="space-y-2">
                <label className="text-white/70 text-sm font-medium ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-green transition-colors" size={20} />
                  <input
                    name="fullName" value={formData.fullName} onChange={handleInputChange}
                    type="text" placeholder="Enter your full name" required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-green/50 focus:bg-white/10 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-white/70 text-sm font-medium ml-1">Email Address/ UserID</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-cyan transition-colors" size={20} />
                  <input
                    name="email" value={formData.email} onChange={handleInputChange}
                    type="email" placeholder="Enter your email" required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-cyan/50 focus:bg-white/10 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-white/70 text-sm font-medium ml-1">Mobile Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-purple transition-colors" size={20} />
                  <input
                    name="mobile" value={formData.mobile} onChange={handleInputChange}
                    type="tel" placeholder="+91 XXXXX XXXXX" required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-purple/50 focus:bg-white/10 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-white/70 text-sm font-medium ml-1 flex justify-between">
                  Referral Code <span className="text-white/30">(Optional)</span>
                </label>
                <div className="relative group">
                  <Gift className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-green transition-colors" size={20} />
                  <input
                    name="referral" value={formData.referral} onChange={handleInputChange}
                    type="text" placeholder="Enter referral code"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-green/50 focus:bg-white/10 outline-none transition-all"
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-linear-to-r from-green to-green-dark text-bg-dark font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:brightness-110 shadow-glow-green transition-all mt-8">
                Continue <ArrowRight size={20} />
              </button>
            </form>
          )}

          {/* Step 2: Password Setup */}
          {step === 2 && (
            <form onSubmit={handleCreateAccount} className="space-y-5 animate-fade-in-up">
              <div className="space-y-2">
                <label className="text-white/70 text-sm font-medium ml-1">Create Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-green transition-colors" size={20} />
                  <input
                    name="password" value={formData.password} onChange={handleInputChange}
                    type={showPassword ? "text" : "password"} placeholder="Strong password" required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder:text-white/20 focus:border-green/50 focus:bg-white/10 outline-none transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {/* Strength Bar */}
                <div className="flex gap-1 mt-2 px-1">
                  {[1, 2, 3, 4].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${formData.password.length > i * 2 ? 'bg-green shadow-[0_0_5px_#5EFC8D]' : 'bg-white/10'}`}></div>)}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-white/70 text-sm font-medium ml-1">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-cyan transition-colors" size={20} />
                  <input
                    name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange}
                    type={showConfirmPassword ? "text" : "password"} placeholder="Confirm password" required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder:text-white/20 focus:border-cyan/50 focus:bg-white/10 outline-none transition-all"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-400 text-sm font-medium">{error}</div>
              )}

              <div className="flex items-start gap-3 py-2">
                <input type="checkbox" id="terms" required className="mt-1 accent-green" />
                <label htmlFor="terms" className="text-xs text-white/50 leading-relaxed">
                  I agree to the <span className="text-cyan cursor-pointer hover:underline">Terms of Service</span> and <span className="text-cyan cursor-pointer hover:underline">Privacy Policy</span>
                </label>
              </div>

              <div className="flex gap-4 mt-8">
                <button type="button" onClick={prevStep} className="flex-1 bg-white/5 border border-white/10 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                  <ArrowLeft size={18} /> Back
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-2 bg-linear-to-r from-green to-green-dark text-bg-dark font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-110 shadow-glow-green'
                    }`}
                >
                  {loading ? 'Creating account…' : 'Create Account'} <ArrowRight size={18} />
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Success State */}
          {step === 3 && (
            <div className="text-center animate-success-pop">
              <div className="w-20 h-20 bg-green/20 rounded-full flex items-center justify-center text-green mx-auto mb-8 border border-green/30 shadow-glow-green">
                <Check size={40} strokeWidth={3} />
              </div>
              <h3 className="text-white text-2xl font-black mb-4">Account Created!</h3>
              <p className="text-white/50 mb-10 leading-relaxed">
                Your VC Coin account has been successfully created. Start building your portfolio today!
              </p>
              <Link to="/dashboard" className="w-full bg-linear-to-r from-green to-cyan text-bg-dark font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:brightness-110 shadow-glow-green transition-all">
                Go to Dashboard <ArrowRight size={20} />
              </Link>
            </div>
          )}

          {/* Footer Link (Hide on Success) */}
          {step < 3 && (
            <div className="mt-10 text-center text-sm text-white/30">
              Already have an account? <Link to="/login" className="text-green font-bold hover:underline">Sign In</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;