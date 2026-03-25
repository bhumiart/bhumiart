import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronLeft, Trash2, ShieldCheck, ArrowRight, Minus, Plus, ShoppingCart, Truck, CreditCard, RotateCcw } from 'lucide-react';

const CartScreen = ({ cart, onRemoveFromCart, onUpdateQty }) => {
  const navigate = useNavigate();
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = subtotal > 1000 ? 0 : 50; 
  const tax = subtotal * 0.18; 
  const total = subtotal + shipping + tax;

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${import.meta.env.VITE_API_BASE_URL}${imagePath}`;
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-16 pb-16 bg-slate-50">
        <div className="container mx-auto px-6 flex flex-col items-center justify-center text-center">
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl relative z-10">
              <ShoppingBag size={48} className="text-primary-600 animate-pulse" />
            </div>
            <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center z-20 shadow-md">
              <span className="text-primary-600 font-bold text-lg">0</span>
            </div>
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Your cart is empty</h1>
          <p className="text-slate-500 max-w-md mb-8 text-lg leading-relaxed">
            Discover our exclusive collection of handcrafted Lippan Art and find something special for your home.
          </p>
          <Link to="/" className="inline-flex items-center space-x-3 px-10 py-4 bg-primary-900 text-white rounded-full font-bold text-base hover:bg-primary-700 transition-all shadow-xl shadow-primary-900/20 group">
            <span>Explore Collection</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-16 bg-slate-50">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-10 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">Shopping Cart</h1>
            <p className="text-slate-500 text-sm font-medium">You have {cart.reduce((acc, item) => acc + item.qty, 0)} items in your cart</p>
          </div>
          <Link to="/" className="group flex items-center text-primary-600 text-sm font-bold hover:text-primary-800 transition-all mt-4 md:mt-0">
            <ChevronLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Gallery
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <div className="col-span-6">Product Details</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {cart.map(item => (
              <div key={item._id} className="group bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary-50/30 rounded-bl-full -mr-10 -mt-10 group-hover:bg-primary-50/50 transition-colors" />
                
                <div className="flex flex-col sm:grid sm:grid-cols-12 gap-4 sm:gap-6 items-center relative z-10">
                  {/* Product Info */}
                  <div className="sm:col-span-6 flex items-center space-x-4 sm:space-x-6 w-full">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 shadow-md group-hover:scale-105 transition-transform duration-500 bg-slate-50 border border-slate-100">
                      <img 
                        src={getImageUrl(item.image)} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <span className="inline-block px-2 py-0.5 bg-primary-50 text-primary-600 text-[8px] font-bold uppercase tracking-widest rounded-full mb-1 sm:mb-2">
                        {item.category || 'Handcrafted Art'}
                      </span>
                      <Link to={`/product/${item._id}`}>
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 hover:text-primary-600 transition-colors leading-tight mb-1 truncate">
                          {item.name}
                        </h3>
                      </Link>
                      <div className="flex items-center space-x-2 sm:space-x-3 text-[10px] sm:text-xs font-medium text-slate-400">
                        <span className="flex items-center"><ShieldCheck size={10} className="mr-1 text-green-500" /> In Stock</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block" />
                        <span className="hidden sm:block">Ready to Ship</span>
                      </div>
                    </div>
                  </div>

                  {/* Price (Hidden on mobile) */}
                  <div className="hidden sm:block sm:col-span-2 text-center">
                    <p className="text-sm font-bold text-slate-900">₹{item.price.toLocaleString()}</p>
                  </div>

                  {/* Quantity Control (Desktop) */}
                  <div className="hidden sm:flex sm:col-span-2 justify-center">
                    <div className="flex items-center bg-slate-50 rounded-xl p-0.5 border border-slate-200">
                      <button 
                        onClick={() => onUpdateQty(item._id, Math.max(1, item.qty - 1))}
                        className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-white hover:text-primary-600 rounded-lg transition-all shadow-sm active:scale-95 disabled:opacity-30"
                        disabled={item.qty <= 1}
                      >
                        <Minus size={14} strokeWidth={3} />
                      </button>
                      <span className="w-8 text-center font-black text-slate-900 text-sm">{item.qty}</span>
                      <button 
                        onClick={() => onUpdateQty(item._id, Math.min(item.countInStock, item.qty + 1))}
                        className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-white hover:text-primary-600 rounded-lg transition-all shadow-sm active:scale-95 disabled:opacity-30"
                        disabled={item.qty >= item.countInStock}
                      >
                        <Plus size={14} strokeWidth={3} />
                      </button>
                    </div>
                  </div>

                  {/* Item Total & Remove (Desktop) */}
                  <div className="hidden sm:flex sm:col-span-2 flex-col items-end space-y-2">
                    <p className="text-lg font-black text-primary-900 tracking-tight">₹{(item.price * item.qty).toLocaleString()}</p>
                    <button 
                      onClick={() => onRemoveFromCart(item._id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 group/trash"
                      title="Remove from cart"
                    >
                      <Trash2 size={18} className="group-hover/trash:scale-110 transition-transform" />
                    </button>
                  </div>

                  {/* Mobile Layout row */}
                  <div className="flex items-center justify-between w-full sm:hidden border-t border-slate-50 pt-3">
                    <div className="flex items-center bg-slate-50 rounded-lg p-0.5 border border-slate-200">
                      <button 
                        onClick={() => onUpdateQty(item._id, Math.max(1, item.qty - 1))}
                        className="w-7 h-7 flex items-center justify-center text-slate-500"
                        disabled={item.qty <= 1}
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                      <span className="w-7 text-center font-black text-slate-900 text-xs">{item.qty}</span>
                      <button 
                        onClick={() => onUpdateQty(item._id, Math.min(item.countInStock, item.qty + 1))}
                        className="w-7 h-7 flex items-center justify-center text-slate-500"
                        disabled={item.qty >= item.countInStock}
                      >
                        <Plus size={12} strokeWidth={3} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold">₹{item.price.toLocaleString()} each</p>
                      <p className="text-base font-black text-primary-900 tracking-tight">₹{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-200">
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                <Truck className="text-primary-600 mb-2" size={20} />
                <h4 className="font-bold text-slate-900 text-[10px] mb-0.5">Fast Shipping</h4>
                <p className="text-[8px] text-slate-400">Insured delivery</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                <RotateCcw className="text-primary-600 mb-2" size={20} />
                <h4 className="font-bold text-slate-900 text-[10px] mb-0.5">Easy Returns</h4>
                <p className="text-[8px] text-slate-400">7-day policy</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                <ShieldCheck className="text-primary-600 mb-2" size={20} />
                <h4 className="font-bold text-slate-900 text-[10px] mb-0.5">Secure Checkout</h4>
                <p className="text-[8px] text-slate-400">Encrypted payments</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                <CreditCard className="text-primary-600 mb-2" size={20} />
                <h4 className="font-bold text-slate-900 text-[10px] mb-0.5">Quality Art</h4>
                <p className="text-[8px] text-slate-400">Handcrafted authenticity</p>
              </div>
            </div>
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-100 sticky top-28 overflow-hidden">
              <h2 className="text-lg font-black text-slate-900 mb-6 tracking-tight">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-slate-500 text-sm font-bold">
                  <span className="tracking-tight">Subtotal ({cart.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                  <span className="text-slate-900">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 text-sm font-bold">
                  <span className="tracking-tight">Shipping</span>
                  <span>
                    {shipping === 0 ? <span className="text-green-500 uppercase text-[10px] tracking-widest">Free</span> : `₹${shipping.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-500 text-sm font-bold pb-4 border-b border-slate-100">
                  <span className="tracking-tight">GST (18%)</span>
                  <span className="text-slate-900">₹{tax.toLocaleString()}</span>
                </div>
                
                {shipping > 0 && (
                  <div className="bg-primary-50/50 p-3 rounded-xl border border-primary-100">
                    <p className="text-[10px] text-primary-700 font-bold text-center leading-relaxed">
                      Add <span className="text-primary-900">₹{(1000 - subtotal).toLocaleString()}</span> more for <span className="uppercase tracking-widest">Free Shipping</span>
                    </p>
                  </div>
                )}
                
                <div className="pt-2 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-0.5">Grand Total</span>
                    <span className="text-3xl font-black text-primary-950 tracking-tighter italic">₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-primary-900 text-white rounded-xl font-black text-base hover:bg-primary-700 transition-all flex items-center justify-center space-x-3 shadow-xl shadow-primary-900/20 group mb-6 active:scale-[0.98]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center space-x-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                <ShieldCheck size={14} className="text-green-500" />
                <span>Secure SSL Encryption</span>
              </div>
              <div className="mt-6 flex justify-center items-center space-x-4 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                <CreditCard size={20} />
                <ShoppingCart size={20} />
                <ShieldCheck size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;

