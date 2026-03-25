import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ChevronLeft, Trash2, ShoppingCart, ArrowRight, Star } from 'lucide-react';

const WishlistScreen = ({ wishlist, onRemoveFromWishlist, onAddToCart }) => {
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5001${imagePath}`;
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen pt-32 md:pt-40 pb-20 bg-[#fffcf0]/50">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center justify-center text-center">
          <div className="relative mb-8 md:mb-10">
            <div className="w-24 h-24 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-2xl relative z-10 border border-primary-100 p-6">
              <Heart size={48} className="md:size-64 text-primary-600 animate-pulse" fill="currentColor" opacity={0.1} />
            </div>
            <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 w-10 h-10 md:w-12 md:h-12 bg-primary-100 rounded-full flex items-center justify-center z-20 shadow-lg border border-white">
              <span className="text-primary-600 font-bold text-lg">0</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 md:mb-6 tracking-tight uppercase italic">Your Wishlist is Empty</h1>
          <p className="text-slate-500 max-w-md mb-10 md:mb-12 text-base md:text-xl leading-relaxed italic">
            Save your favorite artisanal Lippan Art pieces here and make them yours whenever you're ready.
          </p>
          <Link to="/" className="inline-flex items-center space-x-3 px-8 md:px-12 py-4 md:py-5 bg-primary-900 text-white rounded-full font-bold text-base md:text-lg hover:bg-primary-700 transition-all shadow-2xl shadow-primary-900/20 group uppercase tracking-widest">
            <span>Discover Masterpieces</span>
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-20 md:pb-24 bg-[#fffcf0]/50">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-10 md:mb-16 border-b border-primary-100 pb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-2 uppercase italic">My Wishlist</h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] md:text-xs tracking-widest">You have {wishlist.length} items saved for later</p>
          </div>
          <Link to="/" className="group flex items-center text-primary-600 font-bold hover:text-primary-800 transition-all mt-6 md:mt-0 uppercase text-xs tracking-widest">
            <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
            Continue Browsing
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {wishlist.map(product => (
            <div key={product._id} className="group bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-primary-50 flex flex-col relative">
              {/* Image Container */}
              <div className="aspect-square overflow-hidden relative">
                <img 
                  src={getImageUrl(product.image)} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-500" />
                
                {/* Remove Button */}
                <button 
                  onClick={() => onRemoveFromWishlist(product._id)}
                  className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md text-slate-400 hover:text-red-500 rounded-2xl shadow-lg transition-all transform hover:rotate-12 active:scale-90"
                  title="Remove from wishlist"
                >
                  <Trash2 size={20} />
                </button>

                {/* Rating Badge */}
                <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl flex items-center space-x-1.5 shadow-lg border border-primary-50">
                  <Star size={14} className="text-primary-500 fill-current" />
                  <span className="text-xs font-black text-slate-900">{product.rating || '4.8'}</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-8 flex-grow flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 mb-2">
                  {product.category || 'Handcrafted'}
                </span>
                <Link to={`/product/${product._id}`}>
                  <h3 className="text-xl font-extrabold text-slate-900 hover:text-primary-600 transition-colors leading-tight mb-3">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-auto pt-6 flex items-center justify-between">
                  <p className="text-2xl font-black text-primary-950 tracking-tight italic">
                    ₹{product.price.toLocaleString()}
                  </p>
                  <button 
                    onClick={() => onAddToCart(product)}
                    className="p-4 bg-primary-900 text-white rounded-2xl hover:bg-primary-700 transition-all shadow-xl shadow-primary-900/20 active:scale-95 group/cart"
                    title="Add to Cart"
                  >
                    <ShoppingCart size={20} className="group-hover/cart:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WishlistScreen;
