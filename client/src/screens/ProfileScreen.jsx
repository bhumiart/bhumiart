import React, { useState, useEffect } from 'react';
import { User, Package, Heart, MapPin, LogOut, ChevronRight, Settings, CreditCard, ShieldCheck, Bell, Save, Trash2, Plus, Loader2, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// --- Sub-components for Panel Content (Defined outside to prevent focus loss) ---

const OrdersSection = ({ loadingOrders, orders, navigate }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-black uppercase italic tracking-tighter text-neutral-dark">My <span className="text-accent-600">Orders</span></h2>
      <div className="flex gap-2">
        {['All', 'Processing', 'Shipped', 'Delivered'].map(status => (
          <button key={status} className="px-4 py-2 bg-white border border-primary-100 rounded-full text-[10px] font-black uppercase tracking-widest text-neutral-dark/40 hover:border-accent-600 hover:text-accent-600 transition-all">
            {status}
          </button>
        ))}
      </div>
    </div>
    
    {loadingOrders ? (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-accent-600" size={32} />
      </div>
    ) : orders.length === 0 ? (
      <div className="bg-primary-50 rounded-[2rem] border border-primary-100 p-12 text-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-neutral-dark/20 border border-primary-100">
          <Package size={32} />
        </div>
        <p className="text-neutral-dark/40 font-black uppercase tracking-widest italic">You haven't placed any orders yet</p>
        <button onClick={() => navigate('/shop')} className="mt-8 px-8 py-4 bg-accent-600 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-accent-700 transition-all shadow-lg shadow-accent-600/20">
          Start Shopping
        </button>
      </div>
    ) : (
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-primary-50 rounded-[2rem] border border-primary-100 overflow-hidden hover:border-accent-200 transition-all duration-300">
            <div className="p-6 md:p-8 bg-white/50 border-b border-primary-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-dark/40 mb-1">Order ID</p>
                  <p className="font-bold text-neutral-dark">#{order._id.slice(-6).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-dark/40 mb-1">Date</p>
                  <p className="font-bold text-neutral-dark">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-dark/40 mb-1">Total</p>
                  <p className="font-black italic text-accent-600">₹{order.totalPrice.toLocaleString()}</p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                order.isDelivered ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'
              }`}>
                {order.status}
              </div>
            </div>
            <div className="p-6 md:p-8 space-y-4">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-primary-100 bg-white" />
                  <div className="flex-1">
                    <p className="font-bold text-neutral-dark line-clamp-1">{item.name}</p>
                    <p className="text-xs text-neutral-dark/40 font-medium">{item.qty} x ₹{item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const AddressesSection = ({ 
  loadingAddresses, 
  addresses, 
  setShowAddressModal, 
  handleSetDefaultAddress, 
  handleDeleteAddress,
  showAddressModal,
  handleAddAddress,
  addressForm,
  setAddressForm
}) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-black uppercase italic tracking-tighter text-neutral-dark">Shipping <span className="text-accent-600">Addresses</span></h2>
      <button 
        onClick={() => setShowAddressModal(true)}
        className="flex items-center gap-2 px-6 py-3 bg-neutral-dark text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-neutral-800 transition-all shadow-xl"
      >
        <Plus size={16} /> Add New
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {loadingAddresses ? (
        <div className="col-span-full py-10 text-center">
          <Loader2 className="animate-spin mx-auto text-accent-600" size={32} />
        </div>
      ) : addresses.length === 0 ? (
        <div className="col-span-full bg-primary-50 rounded-[2rem] border border-primary-100 p-12 text-center">
          <p className="text-neutral-dark/40 font-black uppercase tracking-widest italic">No addresses saved yet</p>
        </div>
      ) : (
        addresses.map((addr) => (
          <div key={addr._id} className={`bg-white border-2 rounded-[2rem] p-8 relative overflow-hidden group transition-all ${addr.isDefault ? 'border-accent-600 shadow-lg' : 'border-primary-100 hover:border-accent-200'}`}>
            {addr.isDefault && (
              <div className="absolute top-0 right-0 p-4">
                <div className="bg-accent-600 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">Default</div>
              </div>
            )}
            <h3 className="font-black uppercase italic tracking-tighter text-neutral-dark mb-4 text-lg">{addr.fullName}</h3>
            <p className="text-neutral-dark/60 text-sm font-medium leading-relaxed mb-6">
              {addr.address}<br />
              {addr.city}, {addr.postalCode}<br />
              {addr.country}<br />
              Phone: {addr.phone}
            </p>
            <div className="flex gap-4 pt-4 border-t border-primary-50">
              {!addr.isDefault && (
                <button 
                  onClick={() => handleSetDefaultAddress(addr._id)}
                  className="text-[10px] font-black uppercase tracking-widest text-accent-600 hover:text-accent-700 transition-colors"
                >
                  Set Default
                </button>
              )}
              <button 
                onClick={() => handleDeleteAddress(addr._id)}
                className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))
      )}
    </div>

    {/* Address Modal */}
    {showAddressModal && (
      <div className="fixed inset-0 bg-neutral-dark/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-[2.5rem] w-full max-w-xl p-8 md:p-12 shadow-2xl animate-in zoom-in-95 duration-300">
          <h3 className="text-2xl font-black uppercase italic tracking-tighter text-neutral-dark mb-8">Add New <span className="text-accent-600">Address</span></h3>
          <form onSubmit={handleAddAddress} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-dark/40 ml-2">Full Name</label>
                <input required type="text" value={addressForm.fullName} onChange={(e) => setAddressForm({...addressForm, fullName: e.target.value})} className="w-full bg-primary-50 border border-primary-100 rounded-xl py-3 px-5 focus:outline-none focus:border-accent-400 font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-dark/40 ml-2">Phone Number</label>
                <input required type="tel" value={addressForm.phone} onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})} className="w-full bg-primary-50 border border-primary-100 rounded-xl py-3 px-5 focus:outline-none focus:border-accent-400 font-bold" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-dark/40 ml-2">Street Address</label>
              <input required type="text" value={addressForm.address} onChange={(e) => setAddressForm({...addressForm, address: e.target.value})} className="w-full bg-primary-50 border border-primary-100 rounded-xl py-3 px-5 focus:outline-none focus:border-accent-400 font-bold" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-dark/40 ml-2">City</label>
                <input required type="text" value={addressForm.city} onChange={(e) => setAddressForm({...addressForm, city: e.target.value})} className="w-full bg-primary-50 border border-primary-100 rounded-xl py-3 px-5 focus:outline-none focus:border-accent-400 font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-dark/40 ml-2">Postal Code</label>
                <input required type="text" value={addressForm.postalCode} onChange={(e) => setAddressForm({...addressForm, postalCode: e.target.value})} className="w-full bg-primary-50 border border-primary-100 rounded-xl py-3 px-5 focus:outline-none focus:border-accent-400 font-bold" />
              </div>
            </div>
            <div className="flex items-center gap-3 ml-2">
              <input type="checkbox" id="default" checked={addressForm.isDefault} onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})} className="w-4 h-4 rounded border-primary-200 text-accent-600 focus:ring-accent-600" />
              <label htmlFor="default" className="text-xs font-bold text-neutral-dark/60 uppercase tracking-widest">Set as default address</label>
            </div>
            <div className="flex gap-4 pt-4">
              <button type="submit" className="flex-1 py-4 bg-accent-600 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-accent-700 transition-all shadow-lg shadow-accent-600/20">Save Address</button>
              <button type="button" onClick={() => setShowAddressModal(false)} className="px-8 py-4 bg-primary-50 text-neutral-dark/40 rounded-full font-black uppercase tracking-widest text-xs hover:bg-primary-100 transition-all">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
);

const AccountSection = ({ 
  error, 
  message, 
  handleUpdateProfile, 
  name, 
  setName, 
  email, 
  setEmail, 
  password, 
  setPassword, 
  confirmPassword, 
  setConfirmPassword, 
  updateLoading 
}) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
    <h2 className="text-2xl font-black uppercase italic tracking-tighter text-neutral-dark">Account <span className="text-accent-600">Settings</span></h2>
    
    {error && (
      <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center space-x-3 text-sm font-bold">
        <ShieldCheck size={18} />
        <span>{error}</span>
      </div>
    )}

    {message && (
      <div className="p-4 bg-green-50 border border-green-100 text-green-600 rounded-2xl flex items-center space-x-3 text-sm font-bold">
        <CheckCircle2 size={18} />
        <span>{message}</span>
      </div>
    )}

    <div className="bg-primary-50 rounded-[2.5rem] border border-primary-100 p-8 md:p-12">
      <form onSubmit={handleUpdateProfile} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 flex items-center ml-4">Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-primary-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent-400 font-bold text-neutral-dark transition-all shadow-sm" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 flex items-center ml-4">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-primary-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent-400 font-bold text-neutral-dark transition-all shadow-sm" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 flex items-center ml-4">New Password</label>
            <input 
              type="password" 
              placeholder="Leave blank to keep current" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-primary-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent-400 font-bold text-neutral-dark transition-all shadow-sm" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-dark/40 flex items-center ml-4">Confirm Password</label>
            <input 
              type="password" 
              placeholder="Confirm new password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white border border-primary-100 rounded-2xl py-4 px-6 focus:outline-none focus:border-accent-400 font-bold text-neutral-dark transition-all shadow-sm" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={updateLoading}
          className="px-10 py-5 bg-accent-600 text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-accent-700 transition-all shadow-xl shadow-accent-600/20 flex items-center gap-2 group disabled:opacity-70"
        >
          {updateLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} className="group-hover:scale-110 transition-transform" />}
          Save Changes
        </button>
      </form>
    </div>
  </div>
);

const ProfileScreen = () => {
  const { userInfo, logout, updateUserInfo } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  
  // Form states
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Address form states
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'India',
    isDefault: false
  });

  const API_URL = import.meta.env.VITE_API_BASE_URL || '';

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      fetchMyOrders();
      fetchMyProfile(); // To get addresses
    }
  }, [userInfo, navigate]);

  const fetchMyProfile = async () => {
    try {
      setLoadingAddresses(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(`${API_URL}/api/users/profile`, config);
      setAddresses(data.addresses || []);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.post(`${API_URL}/api/users/addresses`, addressForm, config);
      setAddresses(data);
      setShowAddressModal(false);
      setAddressForm({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'India',
        isDefault: false
      });
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Delete this address?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.delete(`${API_URL}/api/users/addresses/${id}`, config);
        setAddresses(data);
      } catch (error) {
        alert(error.response?.data?.message || error.message);
      }
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(`${API_URL}/api/users/addresses/${id}/default`, {}, config);
      setAddresses(data);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setUpdateLoading(true);
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
      setUpdateLoading(false);
    }
  };

  const fetchMyOrders = async () => {
    try {
      setLoadingOrders(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(`${API_URL}/api/orders/myorders`, config);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  if (!userInfo) return null;

  const logoutHandler = () => {
    logout();
    navigate('/');
  };

  // Navigation Menu Logic
  const sidebarItems = [
    { id: 'orders', icon: <Package size={20} />, title: 'My Orders' },
    { id: 'addresses', icon: <MapPin size={20} />, title: 'Shipping Addresses' },
    { id: 'account', icon: <User size={20} />, title: 'Account Settings' },
    { id: 'wishlist', icon: <Heart size={20} />, title: 'My Wishlist', link: '/wishlist' },
    { id: 'admin', icon: <Settings size={20} />, title: 'Admin Panel', link: '/admin', show: userInfo.isAdmin },
  ].filter(item => item.show !== false);

  return (
    <div className="bg-primary-50 min-h-screen py-12 md:py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0 space-y-8">
            {/* User Info Card */}
            <div className="bg-neutral-dark rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-accent-600 rounded-full flex items-center justify-center text-3xl font-black italic border-4 border-white/10 shadow-xl">
                  {userInfo.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase italic tracking-tighter">{userInfo.name}</h2>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1 italic">logo.png Member</p>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="bg-white rounded-[2.5rem] border border-primary-100 p-6 shadow-sm overflow-hidden">
              <div className="space-y-2">
                {sidebarItems.map((item) => (
                  item.link ? (
                    <button 
                      key={item.id}
                      onClick={() => navigate(item.link)}
                      className="w-full flex items-center justify-between p-4 rounded-2xl text-neutral-dark/40 hover:bg-primary-50 hover:text-accent-600 transition-all group font-black uppercase tracking-widest text-[10px]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center group-hover:bg-accent-600 group-hover:text-white transition-all duration-300">
                          {item.icon}
                        </div>
                        {item.title}
                      </div>
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  ) : (
                    <button 
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group font-black uppercase tracking-widest text-[10px] ${
                        activeTab === item.id 
                          ? 'bg-accent-600 text-white shadow-lg shadow-accent-600/20' 
                          : 'text-neutral-dark/40 hover:bg-primary-50 hover:text-accent-600'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          activeTab === item.id ? 'bg-white/20 text-white' : 'bg-primary-50 text-neutral-dark/40 group-hover:bg-accent-600 group-hover:text-white'
                        }`}>
                          {item.icon}
                        </div>
                        {item.title}
                      </div>
                      <ChevronRight size={14} className={`${activeTab === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-all`} />
                    </button>
                  )
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-primary-50">
                <button 
                  onClick={logoutHandler}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all font-black uppercase tracking-widest text-[10px] group"
                >
                  <div className="w-10 h-10 bg-red-50/50 rounded-xl flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                    <LogOut size={20} />
                  </div>
                  Logout
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Content Panel */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-[3rem] border border-primary-100 p-8 md:p-16 shadow-sm min-h-[600px]">
              {activeTab === 'orders' && (
                <OrdersSection 
                  loadingOrders={loadingOrders} 
                  orders={orders} 
                  navigate={navigate} 
                />
              )}
              {activeTab === 'addresses' && (
                <AddressesSection 
                  loadingAddresses={loadingAddresses} 
                  addresses={addresses} 
                  setShowAddressModal={setShowAddressModal}
                  handleSetDefaultAddress={handleSetDefaultAddress}
                  handleDeleteAddress={handleDeleteAddress}
                  showAddressModal={showAddressModal}
                  handleAddAddress={handleAddAddress}
                  addressForm={addressForm}
                  setAddressForm={setAddressForm}
                />
              )}
              {activeTab === 'account' && (
                <AccountSection 
                  error={error}
                  message={message}
                  handleUpdateProfile={handleUpdateProfile}
                  name={name}
                  setName={setName}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  confirmPassword={confirmPassword}
                  setConfirmPassword={setConfirmPassword}
                  updateLoading={updateLoading}
                />
              )}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;

