import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

const AdminLoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, login } = useAuth();

  const redirect = location.search ? location.search.split('=')[1] : '/admin';

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      // login logic already updates userInfo, the useEffect will handle navigation
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[2.5rem] border border-primary-100 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-8 md:p-12 bg-neutral-dark text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20">
              <ShieldCheck className="text-accent-400" size={32} />
            </div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter relative z-10">
              Admin <span className="text-accent-600">Access</span>
            </h1>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-2 relative z-10 italic">
              Secure management portal
            </p>
          </div>

          {/* Form */}
          <div className="p-8 md:p-12 space-y-8">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-xs font-bold italic animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <form onSubmit={submitHandler} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 flex items-center ml-4">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-dark/20" size={18} />
                  <input
                    type="email"
                    placeholder="admin@varnika.com"
                    className="w-full bg-primary-50 border border-primary-100 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-accent-400 font-bold text-neutral-dark transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 flex items-center ml-4">
                  Secure Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-dark/20" size={18} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-primary-50 border border-primary-100 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-accent-400 font-bold text-neutral-dark transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent-600 text-white rounded-full py-5 font-black uppercase tracking-widest text-xs hover:bg-accent-700 transition-all shadow-xl shadow-accent-600/20 active:scale-95 flex items-center justify-center group"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Enter Portal
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="text-center">
              <button
                onClick={() => navigate('/')}
                className="text-[10px] font-black uppercase tracking-widest text-neutral-dark/40 hover:text-accent-600 transition-colors"
              >
                Back to Storefront
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default AdminLoginScreen;
