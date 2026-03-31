import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
  ChevronLeft, Star, Heart, Share2, ShieldCheck,
  Truck, RotateCcw, MessageCircle, Info, ChevronDown, Plus, Minus,
  Image as ImageIcon, ShoppingCart
} from 'lucide-react';
import ProductCard from '../components/ProductCard';

const ProductDetailScreen = ({ onAddToCart, onAddToWishlist }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`);
        setProduct(data);
        setSelectedImage(data.image);

        // Fetch related products from the same category
        const { data: related } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/products?category=${data.category}`);
        setRelatedProducts(related.filter(p => p._id !== id).slice(0, 4));

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] text-neutral-dark font-bold uppercase tracking-widest italic pt-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-accent-600 mr-6"></div>
      Loading Masterpiece...
    </div>
  );

  if (error) return <div className="text-center py-20 text-red-500 font-bold uppercase tracking-widest italic">Error: {error}</div>;

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `${import.meta.env.VITE_API_BASE_URL}${url}`;
    return url;
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4">

        {/* Breadcrumbs */}
        <div className="container mx-auto px-4 py-4 md:py-6 overflow-x-auto no-scrollbar">
          <nav className="flex items-center space-x-2 text-[10px] md:text-xs font-bold text-neutral-dark/40 uppercase tracking-widest whitespace-nowrap">
            <Link to="/" className="hover:text-accent-700 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-accent-700 transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-neutral-dark truncate max-w-[150px] md:max-w-[300px] italic">{product.name}</span>
          </nav>
        </div>

        <main className="container mx-auto px-0 md:px-4 pb-16 md:pb-20 border-b border-primary-50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-16">

            {/* Left: Image Gallery */}
            <div className="lg:col-span-6">
              <div className="sticky top-24 md:top-32 flex flex-col md:flex-row gap-4 md:gap-6">
                {/* Vertical Thumbnails (Desktop) */}
                <div className="hidden md:flex flex-col space-y-4 w-20 lg:w-24 flex-shrink-0">
                  <div 
                    className={`aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-105 ${selectedImage === product.image ? 'border-accent-600 shadow-lg' : 'border-primary-50'}`}
                    onClick={() => setSelectedImage(product.image)}
                  >
                    <img src={getImageUrl(product.image)} className="w-full h-full object-cover" alt="" />
                  </div>
                  {product.images && product.images.map((img, idx) => (
                    <div 
                      key={idx}
                      className={`aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-105 ${selectedImage === img ? 'border-accent-600 shadow-lg' : 'border-primary-50'}`}
                      onClick={() => setSelectedImage(img)}
                    >
                      <img src={getImageUrl(img)} className="w-full h-full object-cover" alt="" />
                    </div>
                  ))}
                </div>

                {/* Main Image Container */}
                <div className="relative flex-grow aspect-square rounded-[2rem] md:rounded-[1.5rem] overflow-hidden bg-primary-50 border border-primary-100 group shadow-sm">
                  <img
                    src={getImageUrl(selectedImage)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  {discount > 0 && (
                    <div className="absolute top-4 md:top-6 right-4 md:right-6 bg-accent-600 text-white px-3 md:px-5 py-1.5 md:py-2.5 rounded-2xl text-[10px] md:text-xs font-black shadow-2xl uppercase tracking-widest">
                      -{discount}% OFF
                    </div>
                  )}
                  <button 
                    onClick={() => onAddToWishlist(product)}
                    className="absolute bottom-4 md:bottom-6 right-4 md:right-6 p-3 md:p-4 bg-white/90 backdrop-blur-md rounded-full text-neutral-dark hover:text-red-500 transition-all shadow-2xl hover:scale-110 active:scale-90 border border-white/50"
                    title="Add to Wishlist"
                  >
                    <Heart size={20} className="md:size-4" />
                  </button>
                </div>

                {/* Mobile Thumbnails (Horizontal) */}
                <div className="flex md:hidden space-x-3 overflow-x-auto no-scrollbar pb-2 px-4">
                  <div 
                    className={`w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === product.image ? 'border-accent-600 scale-95 shadow-lg' : 'border-primary-100'}`}
                    onClick={() => setSelectedImage(product.image)}
                  >
                    <img src={getImageUrl(product.image)} className="w-full h-full object-cover" alt="" />
                  </div>
                  {product.images && product.images.map((img, idx) => (
                    <div 
                      key={idx}
                      className={`w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-accent-600 scale-95 shadow-lg' : 'border-primary-100'}`}
                      onClick={() => setSelectedImage(img)}
                    >
                      <img src={getImageUrl(img)} className="w-full h-full object-cover" alt="" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="lg:col-span-6 space-y-8 md:space-y-10 px-4 md:px-0">
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center space-x-2 text-[#be185d] font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em]">
                  <Star size={12} className="fill-[#be185d]" />
                  <span>PREMIUM QUALITY HAND-CRAFTED ART</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-dark leading-tight tracking-tight">
                  {product.name}
                </h1>
                <div className="flex items-center space-x-4">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={16} className={s <= 5 ? 'fill-yellow-400' : 'text-primary-100'} />
                    ))}
                  </div>
                  <span className="text-[10px] md:text-xs font-bold text-neutral-dark/40 uppercase tracking-widest">
                    (15 VERIFIED REVIEWS)
                  </span>
                </div>
              </div>

              <div className="p-8 md:p-6 bg-[#fffcf0]/50 rounded-[2rem] border border-[#f0e6d2] space-y-8">
                <div className="flex items-baseline space-x-4">
                  <span className="text-3xl md:text-4xl font-black text-[#be185d]">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-xl md:text-2xl text-neutral-dark/20 line-through font-bold decoration-neutral-dark/10">₹{product.originalPrice.toLocaleString()}</span>
                  )}
                </div>

                <div className="space-y-6">
                  <p className="text-[10px] font-black text-neutral-dark uppercase tracking-widest">QUANTITY</p>
                  <div className="flex flex-col sm:flex-row items-stretch gap-4 md:gap-6">
                    <div className="flex items-center justify-between border border-[#f0e6d2] rounded-lg bg-white p-0 min-w-[10px] shadow-sm">
                      <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="p-3 text-neutral-dark hover:text-accent-700 transition-colors"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="w-12 text-center font-black text-xl">{qty}</span>
                      <button
                        onClick={() => setQty(qty + 1)}
                        className="p-3 text-neutral-dark hover:text-accent-700 transition-colors"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <div className="flex flex-grow">
                      <button
                        onClick={() => onAddToCart({ ...product, qty })}
                        className="w-full py-5 md:py-4 bg-[#be185d] text-white font-black rounded-xl hover:bg-[#9d174d] transition-all shadow-xl shadow-[#be185d]/20 uppercase tracking-widest text-xs flex items-center justify-center space-x-3"
                      >
                        <span>ADD TO BAG</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button className="w-full py-3 border border-neutral-dark text-neutral-dark font-bold rounded-xl hover:bg-neutral-dark hover:text-white transition-all uppercase tracking-widest text-[10px] flex items-center justify-center space-x-3 group">
                    <MessageCircle size={18} />
                    <span>INQUIRE ON WHATSAPP</span>
                  </button>
                </div>
              </div>

              {/* Features List */}
              <div className="grid grid-cols-1 gap-6 pt-4">
                {[
                  { icon: <Truck size={20} />, title: 'Free Global Shipping', desc: 'On orders above ₹5000' },
                  { icon: <ShieldCheck size={20} />, title: '100% Authentic Art', desc: 'Crafted by master artisans' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-6">
                    <div className="w-14 h-14 bg-[#fffcf0] border border-[#f0e6d2] rounded-2xl flex items-center justify-center text-[#be185d]">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-black text-neutral-dark uppercase tracking-tight">{item.title}</p>
                      <p className="text-xs text-neutral-dark/40 font-bold uppercase tracking-widest mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product Description Section */}
          <section className="mt-20 md:mt-24 py-2 text-center border-t border-primary-50">
            <h2 className="text-xl md:text-3xl font-bold text-neutral-dark mb-10">Description</h2>
            <p className="text-base md:text-lg text-neutral-dark/50 leading-relaxed max-w-3xl mx-auto font-medium">
              {product.description || "Intricately carved heritage elephant sculpture representing strength and wisdom in traditional style."}
            </p>
          </section>

          {/* Customer Reviews Section */}
          <section className="mt-20 md:mt-32 py-12 px-4 md:px-0 border-t border-primary-50">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
              {/* Left Side: Summary */}
              <div className="lg:col-span-4 space-y-12">
                <div className="space-y-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-neutral-dark tracking-tight">Customer reviews</h2>
                  <div className="flex items-center space-x-4">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={24} className="fill-yellow-400" />
                      ))}
                    </div>
                    <span className="text-2xl font-bold text-neutral-dark">5 out of 5</span>
                  </div>
                  <p className="text-xs font-bold text-neutral-dark/30 uppercase tracking-widest italic">1 global ratings</p>
                </div>

                {/* Rating Bars */}
                <div className="space-y-5">
                  {[
                    { label: '5 star', percent: 100 },
                    { label: '4 star', percent: 0 },
                    { label: '3 star', percent: 0 },
                    { label: '2 star', percent: 0 },
                    { label: '1 star', percent: 0 }
                  ].map((bar, idx) => (
                    <div key={idx} className="flex items-center space-x-6">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-dark/60 w-12">{bar.label}</span>
                      <div className="flex-grow h-3.5 bg-[#fffcf0] border border-[#f0e6d2] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#be185d] rounded-full transition-all duration-1000" 
                          style={{ width: `${bar.percent}%` }}
                        ></div>
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-dark/30 w-8">{bar.percent}%</span>
                    </div>
                  ))}
                </div>

                <div className="pt-10 border-t border-primary-100 space-y-6">
                  <h3 className="text-sm font-bold text-neutral-dark uppercase tracking-widest">Review this product</h3>
                  <p className="text-xs text-neutral-dark/40 font-bold leading-relaxed">Share your thoughts with other customers</p>
                  <button className="w-full py-4 border border-neutral-dark text-neutral-dark font-bold rounded-xl hover:bg-neutral-dark hover:text-white transition-all text-[10px] uppercase tracking-[0.2em]">
                    Write a product review
                  </button>
                </div>
              </div>

              {/* Right Side: Review List & Form */}
              <div className="lg:col-span-8 space-y-20">
                <div className="space-y-10">
                  <h3 className="text-xl md:text-2xl font-bold text-neutral-dark tracking-tight">Select to learn more</h3>
                  <div className="flex flex-wrap gap-4">
                    {['Smell', 'Longevity', 'Value for money', 'Freshness'].map(tag => (
                      <span key={tag} className="px-6 py-3 border border-[#f0e6d2] rounded-full text-[10px] font-bold text-neutral-dark/40 cursor-pointer hover:border-[#be185d] hover:text-[#be185d] transition-all uppercase tracking-widest">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-12">
                  <h3 className="text-xl md:text-2xl font-bold text-neutral-dark tracking-tight">Top reviews from India</h3>
                  
                  {/* Single Review Card */}
                  <div className="space-y-6 p-10 bg-[#fffcf0]/30 rounded-[2rem] border border-[#f0e6d2]">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white border border-[#f0e6d2] rounded-full flex items-center justify-center text-neutral-dark font-bold text-sm">
                        R
                      </div>
                      <div>
                        <span className="font-bold text-neutral-dark">Rohit Kumar</span>
                        <div className="flex items-center space-x-3 mt-1">
                          <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} size={12} className="fill-yellow-400" />
                            ))}
                          </div>
                          <span className="text-[8px] font-black text-[#be185d] uppercase tracking-widest">Verified Purchase</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[10px] text-neutral-dark/30 font-bold uppercase tracking-widest">REVIEWED ON 07 MARCH 2026</p>
                    <p className="text-neutral-dark font-medium leading-relaxed italic text-base">
                      "Nice artwork, looks very beautiful in my living room. The mirror work is detailed."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Product Collection Gallery Banner */}
          <section className="mt-12 px-4 md:px-0 hidden">
            <div className="bg-[#5d0e31] rounded-[3rem] p-12 lg:p-12 relative overflow-hidden group shadow-2xl flex flex-col lg:flex-row items-center gap-16">
              <div className="relative z-10 max-w-xl space-y-10">
                <h2 className="text-4xl md:text-7xl font-black text-white leading-[0.9] uppercase tracking-tighter italic">
                  ARTISANAL <br /> <span className="text-[#f1c40f]">COLLECTION</span> <br /> GALLERY
                </h2>
                <p className="text-white/70 text-lg md:text-xl font-medium leading-relaxed italic">
                  Each piece is meticulously crafted by master artisans using traditional techniques passed down through generations.
                </p>
                <div className="grid grid-cols-2 gap-10 pt-6">
                  <div className="space-y-3">
                    <div className="text-3xl md:text-4xl font-black text-[#f1c40f] tracking-tighter italic uppercase">HANDMADE</div>
                    <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase leading-tight">TRADITIONAL MUD-WORK</p>
                  </div>
                  <div className="space-y-3">
                    <div className="text-3xl md:text-4xl font-black text-[#f1c40f] tracking-tighter italic uppercase">CUSTOM</div>
                    <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase leading-tight">SIZES & DESIGNS</p>
                  </div>
                </div>
              </div>
              <div className="relative lg:w-1/2 w-full">
                <div className="grid grid-cols-2 gap-6 md:gap-10">
                  <div className="relative rounded-[2rem] overflow-hidden shadow-2xl rotate-2 mb-12 md:mb-20 hover:rotate-0 transition-transform duration-700 border-4 border-white/5">
                    <img src={getImageUrl(product.image)} className="w-full aspect-square object-cover" alt="" />
                  </div>
                  <div className="relative rounded-[2rem] overflow-hidden shadow-2xl -rotate-2 mt-12 md:mt-20 hover:rotate-0 transition-transform duration-700 border-4 border-white/5">
                    <img src={getImageUrl(product.image)} className="w-full aspect-square object-cover" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* You May Also Like Section */}
          {relatedProducts.length > 0 && (
            <section className="mt-32 md:mt-48 px-4 md:px-0">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                  <h2 className="text-3xl md:text-5xl font-black text-neutral-dark tracking-tighter italic uppercase">Related Pieces</h2>
                  <p className="text-neutral-dark/40 text-xs md:text-sm font-black uppercase tracking-widest mt-4">Discover more from the {product.category} collection</p>
                </div>
                <Link to="/shop" className="w-full md:w-auto px-10 py-4 bg-primary-50 text-neutral-dark font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-neutral-dark hover:text-white transition-all text-center">
                  Shop Entire Gallery
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                {relatedProducts.map(p => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </section>
          )}
        </main>

      </div>

    </div>
  );
};

export default ProductDetailScreen;

