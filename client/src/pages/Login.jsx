import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Building2, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'alex.johnson@gmail.com', password: 'admin' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please enter email and password.');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back to Grand Horizon Hotel! 🏨');
      navigate('/dashboard');
    } catch {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    try {
      await login('alex.johnson@gmail.com', 'admin123');
      toast.success('Logged in as Hotel Administrator Alex Johnson! ✨');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#DDE6E8] p-4 relative overflow-hidden">
      {/* Decorative ambient elements matching reference image */}
      <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-[#DF9E26] opacity-80 pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#C2D8D6] opacity-60 pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative z-10 animate-fadeIn">
        {/* Top Header */}
        <div className="bg-teal-sidebar text-white p-6 text-center relative">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gold/20 border border-gold/30 flex items-center justify-center text-gold mb-3">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black tracking-wider uppercase">Grand Horizon Hotel</h2>
          <p className="text-xs text-teal-muted mt-0.5">Hotel Management System Portal</p>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-5">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900">Sign in to your account</h3>
            <p className="text-xs text-gray-400 mt-1">
              Enter your admin credentials to access the management dashboard
            </p>
          </div>

          {/* Quick 1-Click Demo Login Banner */}
          <div className="bg-[#EEF3F5] rounded-2xl p-4 border border-teal-sidebar/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-teal-sidebar flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-gold" />
                Demo Credentials Preset
              </span>
              <span className="badge badge-gold">Ready</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Role: <strong>Hotel Administrator</strong> (Alex Johnson)
            </p>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={loading}
              className="w-full btn-gold py-2 text-xs shadow-gold"
            >
              <span>1-Click Instant Demo Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3 my-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
              or enter manually
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="alex.johnson@gmail.com"
                  className="input-field pl-10 text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10 text-xs font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-teal py-2.5 text-xs font-bold shadow-md"
            >
              {loading ? 'Authenticating...' : 'Sign In as Administrator'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
