import React, { useState } from 'react';
import { Save, Shield, User, Loader2, Bell, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminSettings = () => {
  const { userInfo, updateUserInfo } = useAuth();
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_BASE_URL || '';

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `${API_URL}/api/users/profile`,
        { name, email, password },
        config
      );

      setMessage('Profile updated successfully');
      updateUserInfo(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl md:text-5xl font-black text-neutral-dark tracking-tighter uppercase italic">
          Admin <span className="text-accent-600">Settings</span>
        </h1>
        <p className="text-neutral-dark/40 text-xs font-black uppercase tracking-widest mt-1">
          Manage your account and store preferences
        </p>
      </div>

      <div className="max-w-4xl">
        <div className="bg-primary-50 rounded-[2.5rem] border border-primary-100 overflow-hidden shadow-sm">
          <div className="p-10">
            <div className="flex items-center space-x-4 mb-10">
              <div className="w-12 h-12 bg-accent-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-neutral-dark tracking-tight uppercase italic">Account Profile</h2>
                <p className="text-neutral-dark/40 text-[10px] font-black uppercase tracking-widest">Your personal administrative details</p>
              </div>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center space-x-3 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                <Shield size={18} />
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="mb-8 p-4 bg-green-50 border border-green-100 text-green-600 rounded-2xl flex items-center space-x-3 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 size={18} />
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={submitHandler} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 flex items-center ml-4">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-primary-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent-400 font-bold text-neutral-dark transition-all shadow-sm"
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 flex items-center ml-4">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-primary-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent-400 font-bold text-neutral-dark transition-all shadow-sm"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-primary-100/50">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 flex items-center ml-4">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-primary-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent-400 font-bold text-neutral-dark transition-all shadow-sm"
                    placeholder="Leave blank to keep current"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 flex items-center ml-4">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white border border-primary-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent-400 font-bold text-neutral-dark transition-all shadow-sm"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-5 bg-accent-600 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-accent-700 transition-all shadow-xl shadow-accent-600/20 flex items-center space-x-3 group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <Save size={18} className="group-hover:scale-110 transition-transform" />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-[2rem] border border-primary-100 p-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-primary-50 text-neutral-dark/40 rounded-xl flex items-center justify-center">
              <Bell size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-dark uppercase tracking-tight">System Notifications</p>
              <p className="text-[10px] text-neutral-dark/40 font-bold uppercase tracking-widest">Manage how you receive alerts</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-primary-50 text-neutral-dark/40 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-primary-100 transition-all">
            Configure
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

