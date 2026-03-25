import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  ChevronLeft, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2,
  Truck,
  Package,
  Info,
  Loader2,
  Lock,
  Plus
} from 'lucide-react';

const CheckoutScreen = ({ cart, onClearCart }) => {
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    country: 'India'
  });
  const [paymentMethod, setPaymentMethod] = useState('cod'); // Default to COD
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  const API_URL = import.meta.env.VITE_API_BASE_URL || '$(import.meta.env.VITE_API_BASE_URL)';

  useEffect(() => {
    if (userInfo) {
      fetchSavedAddresses();
      setShippingAddress(prev => ({ ...prev, email: userInfo.email }));
    }
  }, [userInfo]);

  const fetchSavedAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(`${API_URL}/api/users/profile`, config);
      const addresses = data.addresses || [];
      setSavedAddresses(addresses);
      
      // Auto-select default address
      const defaultAddr = addresses.find(addr => addr.isDefault);
      if (defaultAddr) {
        setShippingAddress({
          fullName: defaultAddr.fullName,
          email: userInfo.email,
          address: defaultAddr.address,
          city: defaultAddr.city,
          postalCode: defaultAddr.postalCode,
          phone: defaultAddr.phone,
          country: defaultAddr.country || 'India'
        });
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const selectAddress = (addr) => {
    setShippingAddress({
      fullName: addr.fullName,
      email: userInfo.email,
      address: addr.address,
      city: addr.city,
      postalCode: addr.postalCode,
      phone: addr.phone,
      country: addr.country || 'India'
    });
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = subtotal > 1000 ? 0 : 50;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      // Basic validation for shipping
      const { fullName, email, address, city, postalCode, phone } = shippingAddress;
      if (!fullName || !email || !address || !city || !postalCode || !phone) {
        alert('Please fill in all shipping details');
        return;
      }
    }
    if (step < 3) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePlaceOrder = async () => {
    if (!userInfo) {
      alert('Please login to place an order');
      navigate('/login?redirect=checkout');
      return;
    }

    try {
      setLoading(true);
      
      const orderData = {
        orderItems: cart.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: total,
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(`${API_URL}/api/orders`, orderData, config);
      
      onClearCart();
      alert('Order placed successfully! Thank you for your purchase.');
      navigate('/profile'); // Redirect to user profile to see orders
    } catch (error) {
      console.error('Order error:', error);
      alert(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `$(import.meta.env.VITE_API_BASE_URL)${imagePath}`;
  };

  const Stepper = () => (
    <div className="flex items-center justify-center mb-8 sm:mb-12 px-4 max-w-md mx-auto sm:max-w-none">
      <div className={`flex flex-col items-center relative ${step >= 1 ? 'text-primary-600' : 'text-slate-300'}`}>
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center mb-1.5 transition-all duration-500 ${step >= 1 ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-slate-200'}`}>
          <MapPin size={14} className="sm:size-16" />
        </div>
        <span className="text-[7px] sm:text-[10px] font-black uppercase tracking-widest">Shipping</span>
      </div>
      <div className={`w-6 sm:w-12 md:w-20 h-0.5 mx-1 sm:mx-3 transition-all duration-500 ${step >= 2 ? 'bg-primary-600' : 'bg-slate-200'}`} />
      <div className={`flex flex-col items-center relative ${step >= 2 ? 'text-primary-600' : 'text-slate-300'}`}>
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center mb-1.5 transition-all duration-500 ${step >= 2 ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-slate-200'}`}>
          <CreditCard size={14} className="sm:size-16" />
        </div>
        <span className="text-[7px] sm:text-[10px] font-black uppercase tracking-widest">Payment</span>
      </div>
      <div className={`w-6 sm:w-12 md:w-20 h-0.5 mx-1 sm:mx-3 transition-all duration-500 ${step >= 3 ? 'bg-primary-600' : 'bg-slate-200'}`} />
      <div className={`flex flex-col items-center relative ${step >= 3 ? 'text-primary-600' : 'text-slate-300'}`}>
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center mb-1.5 transition-all duration-500 ${step >= 3 ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-slate-200'}`}>
          <CheckCircle2 size={14} className="sm:size-16" />
        </div>
        <span className="text-[7px] sm:text-[10px] font-black uppercase tracking-widest">Review</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-4 sm:pt-20 pb-16 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="mb-6 sm:mb-10">
          <Link to="/cart" className="group inline-flex items-center text-slate-400 text-sm font-bold hover:text-primary-600 transition-all mb-2">
            <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Cart
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Checkout</h1>
        </div>

        <Stepper />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {step === 1 && (
              <div className="space-y-6">
                {/* Saved Addresses Section */}
                {savedAddresses.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-6 flex items-center">
                      <ShieldCheck className="mr-2 text-primary-600" size={20} />
                      Your Saved Addresses
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {savedAddresses.map((addr) => (
                        <div 
                          key={addr._id}
                          onClick={() => selectAddress(addr)}
                          className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                            shippingAddress.address === addr.address 
                              ? 'border-primary-600 bg-primary-50' 
                              : 'border-slate-100 hover:border-slate-200 bg-white'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-black text-sm text-slate-900">{addr.fullName}</p>
                            {addr.isDefault && (
                              <span className="text-[8px] font-black uppercase tracking-widest bg-primary-200 text-primary-700 px-2 py-0.5 rounded-full">Default</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed truncate">{addr.address}</p>
                          <p className="text-xs text-slate-500">{addr.city}, {addr.postalCode}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-2">{addr.phone}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center">
                      <MapPin className="mr-2 text-primary-600" size={20} />
                      {savedAddresses.length > 0 ? 'Or Use Different Address' : 'Shipping Information'}
                    </h2>
                    {savedAddresses.length > 0 && (
                      <button 
                        onClick={() => setShippingAddress({
                          fullName: '',
                          email: userInfo.email,
                          address: '',
                          city: '',
                          postalCode: '',
                          phone: '',
                          country: 'India'
                        })}
                        className="text-[10px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-800 transition-colors"
                      >
                        Clear Form
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all font-bold text-slate-900 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={shippingAddress.email}
                      onChange={handleInputChange}
                      placeholder="rahul@example.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all font-bold text-slate-900 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Street Address</label>
                    <input 
                      type="text" 
                      name="address"
                      value={shippingAddress.address}
                      onChange={handleInputChange}
                      placeholder="123 Art Street, Sector 5"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all font-bold text-slate-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">City</label>
                    <input 
                      type="text" 
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      placeholder="Ahmedabad"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all font-bold text-slate-900 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Postal Code</label>
                    <input 
                      type="text" 
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={handleInputChange}
                      placeholder="380001"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all font-bold text-slate-900 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-600/20 focus:border-primary-600 transition-all font-bold text-slate-900 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-6 flex items-center">
                  <CreditCard className="mr-2 text-primary-600" size={20} />
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <div className="relative group opacity-50 cursor-not-allowed">
                    <div className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-100 bg-slate-50/50 transition-all">
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center">
                          <div className="w-2 h-2 bg-slate-300 rounded-full" />
                        </div>
                        <div>
                          <span className="font-bold text-sm text-slate-400 block">Credit / Debit Card</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center">
                            <Lock size={10} className="mr-1" /> Currently Unavailable
                          </span>
                        </div>
                      </div>
                      <CreditCard size={18} className="text-slate-300" />
                    </div>
                  </div>

                  <div className="relative group opacity-50 cursor-not-allowed">
                    <div className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-100 bg-slate-50/50 transition-all">
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center">
                          <div className="w-2 h-2 bg-slate-300 rounded-full" />
                        </div>
                        <div>
                          <span className="font-bold text-sm text-slate-400 block">UPI / Net Banking</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center">
                            <Lock size={10} className="mr-1" /> Currently Unavailable
                          </span>
                        </div>
                      </div>
                      <div className="text-slate-300 font-black text-xs">UPI</div>
                    </div>
                  </div>

                  <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${paymentMethod === 'cod' ? 'border-primary-600 bg-primary-50/50 shadow-md' : 'border-slate-100 hover:border-slate-200'}`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-primary-600' : 'border-slate-300'}`}>
                        {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-primary-600 rounded-full" />}
                      </div>
                      <div>
                        <span className="font-black text-sm text-slate-900 block">Cash on Delivery</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Pay when you receive</span>
                      </div>
                    </div>
                    <Truck size={20} className="text-primary-600" />
                    <input type="radio" name="payment" className="hidden" onChange={() => setPaymentMethod('cod')} checked={paymentMethod === 'cod'} />
                  </label>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-6 flex items-center">
                  <ShieldCheck className="mr-2 text-primary-600" size={20} />
                  Order Review
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center">
                      <MapPin size={10} className="mr-1.5" />
                      Shipping Address
                    </h3>
                    <p className="font-black text-sm text-slate-900 mb-0.5">{shippingAddress.fullName}</p>
                    <p className="text-xs text-slate-600 font-medium">{shippingAddress.address}</p>
                    <p className="text-xs text-slate-600 font-medium">{shippingAddress.city}, {shippingAddress.postalCode}</p>
                    <p className="text-xs text-slate-600 font-medium mt-1.5">{shippingAddress.phone}</p>
                  </div>
                  
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center">
                      <CreditCard size={10} className="mr-1.5" />
                      Payment Method
                    </h3>
                    <p className="font-black text-sm text-slate-900 uppercase">
                      {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}
                    </p>
                    <p className="text-xs text-slate-600 font-medium mt-1.5 flex items-center">
                      <ShieldCheck size={10} className="mr-1 text-green-500" />
                      Pay at Delivery
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Order Items</h3>
                  {cart.map(item => (
                    <div key={item._id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                          <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-xs text-slate-900 leading-tight mb-0.5 truncate max-w-[120px] sm:max-w-none">{item.name}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">QTY: {item.qty} × ₹{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                      <p className="font-black text-sm text-slate-900">₹{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              {step > 1 ? (
                <button 
                  onClick={handlePrevStep}
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 text-slate-400 font-black uppercase tracking-widest hover:text-primary-600 transition-colors text-[10px] order-2 sm:order-1 disabled:opacity-50"
                >
                  Go Back
                </button>
              ) : <div className="hidden sm:block order-2 sm:order-1" />}
              
              {step < 3 ? (
                <button 
                  onClick={handleNextStep}
                  className="w-full sm:w-auto px-8 py-3.5 bg-primary-900 text-white rounded-xl font-black text-sm hover:bg-primary-700 transition-all shadow-lg shadow-primary-900/20 flex items-center justify-center group order-1 sm:order-2"
                >
                  Continue to {step === 1 ? 'Payment' : 'Review'}
                  <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button 
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full sm:w-auto px-10 py-4 bg-green-600 text-white rounded-xl font-black text-base hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 flex items-center justify-center group order-1 sm:order-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="mr-3 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      Place Order Now
                      <CheckCircle2 size={20} className="ml-3 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-100 sticky top-24">
              <h2 className="text-lg font-black text-slate-900 mb-6 tracking-tight">Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-slate-500 font-bold text-sm">
                  <span className="tracking-tight">Subtotal</span>
                  <span className="text-slate-900">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 font-bold text-sm">
                  <span className="tracking-tight">Shipping</span>
                  <span>{shipping === 0 ? <span className="text-green-500 uppercase text-[10px] tracking-widest">Free</span> : `₹${shipping.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 font-bold text-sm pb-4 border-b border-slate-100">
                  <span className="tracking-tight">GST (18%)</span>
                  <span className="text-slate-900">₹{tax.toLocaleString()}</span>
                </div>
                
                <div className="pt-2 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-0.5">Total Amount</span>
                    <span className="text-3xl font-black text-primary-950 tracking-tighter italic">₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                <div className="flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <Package size={12} />
                  <span>Package Details</span>
                </div>
                <p className="text-[10px] font-medium text-slate-600 leading-relaxed">
                  Your order contains {cart.reduce((acc, item) => acc + item.qty, 0)} artisanal pieces from our collection.
                </p>
                <div className="flex items-center text-[9px] text-primary-600 font-black uppercase tracking-widest pt-1">
                  <Info size={10} className="mr-1.5" />
                  Estimated delivery: 5-7 days
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center space-x-2 text-slate-300 font-bold text-[9px] uppercase tracking-[0.2em]">
                <ShieldCheck size={12} />
                <span>Secure SSL Encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutScreen;

