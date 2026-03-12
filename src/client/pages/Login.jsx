import React, { useState, useEffect } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api, setToken, getToken } from '../../utils/api';
import logo from '../../assets/logo/logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (getToken()) navigate('/dashboard', { replace: true });
  }, [navigate]);

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { identifier, password } = formData;

    if (!identifier.trim() || !password) {
      setError('Email/mobile and password are required.');
      return;
    }

    const payload = {
      password,
      ...(isEmail(identifier) ? { email: identifier } : { mobile: identifier }),
    };

    setLoading(true);
    try {
      const data = await api.login(payload);
      setToken(data.token);
      const userType = data.user?.user_type;
      navigate(userType === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4 py-20 relative overflow-hidden">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan/10 blur-[120px] rounded-full -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple/10 blur-[120px] rounded-full -ml-48 -mb-48"></div>

      <div className="w-full max-w-120 relative z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-card">

          {/* Header & Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <img src={logo} alt="VC Coin" className="w-12 h-12 rounded-xl object-contain" />
              <span className="text-2xl font-black text-white tracking-tight">VC Coin</span>
            </Link>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-white/50 text-sm">Sign in to your account to continue trading</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5 animate-fade-in-up">
            {/* Email or Mobile Input */}
            <div className="space-y-2">
              <label className="text-white/70 text-sm font-medium ml-1">Email or Mobile Number</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-cyan transition-colors" size={20} />
                <input
                  name="identifier" value={formData.identifier} onChange={handleInputChange}
                  type="text" placeholder="Enter email or mobile number" required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:border-cyan/50 focus:bg-white/10 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-white/70 text-sm font-medium">Password</label>
                <Link to="/forgot-password" size="sm" className="text-xs text-cyan hover:underline">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-purple transition-colors" size={20} />
                <input
                  name="password" value={formData.password} onChange={handleInputChange}
                  type={showPassword ? "text" : "password"} placeholder="Enter password" required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder:text-white/20 focus:border-purple/50 focus:bg-white/10 outline-none transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2">
              <input
                name="rememberMe" checked={formData.rememberMe} onChange={handleInputChange}
                type="checkbox" id="remember" className="accent-cyan w-4 h-4"
              />
              <label htmlFor="remember" className="text-sm text-white/50 cursor-pointer">Remember me</label>
            </div>

            {error && (
              <div className="text-red-400 text-sm font-medium">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-linear-to-r from-cyan to-blue text-bg-dark font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-110 shadow-glow-cyan'}`}
            >
              {loading ? 'Signing in…' : <><LogIn size={20} /> Sign In</>}
            </button>
          </form>

          <div className="mt-10 text-center text-sm text-white/30">
            Don't have an account? <Link to="/signup" className="text-green font-bold hover:underline">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;