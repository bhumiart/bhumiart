import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const ProductCard = ({ product, onAddToWishlist }) => {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `http://localhost:5001${url}`;
    return url;
  };

  return (
    <div className="group bg-[#fffcf0] rounded-[1rem] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 border border-primary-50 flex flex-col h-full relative mb-2">
      <Link to={`/product/${product._id}`} className="flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={getImageUrl(product.image)} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          
          {/* Discount Badge (Top Right) */}
          {discount > 0 && (
            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded text-[10px] font-bold">
              -{discount}%
            </div>
          )}

          {/* Wishlist Button (Bottom Left of Image) */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToWishlist && onAddToWishlist(product);
            }}
            className="absolute bottom-3 left-3 z-20 w-8 h-8 bg-white rounded-full flex items-center justify-center text-neutral-dark/40 hover:text-red-500 hover:scale-110 transition-all shadow-md active:scale-90 border border-primary-50"
            title="Add to Wishlist"
          >
            <Heart size={14} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Category Tag */}
          <div className="mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#db2777] bg-[#fdf2f8] px-2.5 py-1 rounded-md">
              {product.category || 'WALL ACCENTS'}
            </span>
          </div>

          <h3 className="text-sm font-bold text-neutral-dark line-clamp-1 mb-2 leading-snug group-hover:text-accent-700 transition-colors">
            {product.name}
          </h3>
          
          <div className="mt-auto flex items-center space-x-2">
            <span className="text-base font-black text-[#be185d]">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-dark/30 line-through">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
