import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Users, TrendingUp, IndianRupee, Loader2, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    growth: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userInfo } = useAuth();

  const API_URL = import.meta.env.VITE_API_BASE_URL || '$(import.meta.env.VITE_API_BASE_URL)';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get(`${API_URL}/api/dashboard/stats`, config);
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchStats();
    }
  }, [userInfo, API_URL]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] text-neutral-dark font-bold uppercase tracking-widest italic pt-20">
      <Loader2 className="animate-spin text-accent-600 mr-4" size={32} />
      Loading Dashboard...
    </div>
  );

  if (error) return (
    <div className="text-center py-20 text-red-500 font-bold uppercase tracking-widest italic">
      Error: {error}
    </div>
  );

  const statCards = [
    { title: 'Total Sales', value: `₹${stats.totalSales.toLocaleString()}`, icon: <IndianRupee size={24} />, color: 'bg-blue-500' },
    { title: 'Total Orders', value: stats.totalOrders.toString(), icon: <ShoppingBag size={24} />, color: 'bg-green-500' },
    { title: 'Total Customers', value: stats.totalUsers.toString(), icon: <Users size={24} />, color: 'bg-purple-500' },
    { title: 'Growth', value: `${stats.growth >= 0 ? '+' : ''}${stats.growth}%`, icon: <TrendingUp size={24} />, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl md:text-5xl font-black text-neutral-dark tracking-tighter uppercase italic">
          Admin <span className="text-accent-600">Dashboard</span>
        </h1>
        <p className="text-neutral-dark/40 text-xs font-black uppercase tracking-widest mt-1">
          Welcome back to the Lippan Art Control Center
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-primary-50 p-8 rounded-[2rem] border border-primary-100 shadow-sm group hover:scale-105 transition-all duration-300">
            <div className={`w-14 h-14 ${stat.color} text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 mb-1">{stat.title}</p>
            <p className="text-2xl font-black text-neutral-dark italic">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-primary-50 rounded-[2.5rem] border border-primary-100 p-10 shadow-sm">
        <h2 className="text-xl font-black text-neutral-dark tracking-tight uppercase italic mb-6">Recent Activity</h2>
        <div className="space-y-6">
          {stats.recentOrders.length > 0 ? (
            stats.recentOrders.map((order, i) => (
              <div key={order._id} className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-primary-100">
                <div className="w-10 h-10 bg-accent-100 text-accent-700 rounded-full flex items-center justify-center font-black">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-neutral-dark">
                    New order from {order.shippingAddress.fullName}
                  </p>
                  <p className="text-[10px] text-neutral-dark/40 font-bold uppercase tracking-widest">
                    {new Date(order.createdAt).toLocaleString()} • ID: #{order._id.slice(-6).toUpperCase()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-accent-600">₹{order.totalPrice.toLocaleString()}</p>
                  <p className={`text-[8px] font-black uppercase tracking-widest ${
                    order.status === 'Delivered' ? 'text-green-600' : 'text-amber-600'
                  }`}>{order.status}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <Package size={48} className="mx-auto text-neutral-dark/10 mb-4" />
              <p className="text-neutral-dark/40 font-black uppercase tracking-widest italic">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

