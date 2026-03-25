import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, login, register } = useAuth();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-50 flex items-center justify-center p-4 py-20">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-[2.5rem] border border-primary-100 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-8 md:p-12 bg-neutral-dark text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter relative z-10">
              {isLogin ? 'Welcome' : 'Join Us'} <span className="text-accent-600">Back</span>
            </h1>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-2 relative z-10 italic">
              {isLogin ? 'Login to your account' : 'Create your masterpiece account'}
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
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 flex items-center ml-4">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-dark/20" size={18} />
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="w-full bg-primary-50 border border-primary-100 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-accent-400 font-bold text-neutral-dark transition-all"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 flex items-center ml-4">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-dark/20" size={18} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-primary-50 border border-primary-100 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-accent-400 font-bold text-neutral-dark transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 flex items-center ml-4">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-dark/20" size={18} />
                  <input
                    type="password"
                    placeholder="Enter your password"
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
                    {isLogin ? 'Login' : 'Register'}
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[10px] font-black uppercase tracking-widest text-neutral-dark/40 hover:text-accent-600 transition-colors"
              >
                {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
