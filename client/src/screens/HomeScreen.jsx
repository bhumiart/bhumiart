import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Hero from '../components/home/Hero';
import TrustTicker from '../components/home/TrustTicker';
import CategoryGrid from '../components/home/CategoryGrid';
import CollectionsList from '../components/home/CollectionsList';
import BestSellerSection from '../components/home/BestSellerSection';
import SignatureArtworks from '../components/home/SignatureArtworks';
import ArtDecorCollection from '../components/home/ArtDecorCollection';
import { ArrowRight, Sparkles } from 'lucide-react';
import brand from './../../images/brand/varnika.png';

const HomeScreen = ({ onAddToCart, onAddToWishlist }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/products');
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh] text-neutral-dark font-black uppercase tracking-widest italic">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-accent-600 mr-6"></div>
      Artisanal Lippan Loading...
    </div>
  );
  if (error) return <div className="text-center py-20 text-red-500 font-black uppercase tracking-widest italic">Error: {error}</div>;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Trust Ticker */}
      <TrustTicker />

      {/* Categories */}
      <CategoryGrid />

      {/* Collections List Section */}
      {/* <CollectionsList /> */}

      {/* Best Seller Section */}
      <BestSellerSection products={products} onAddToCart={onAddToCart} onAddToWishlist={onAddToWishlist} />

      {/* Signature Artworks Section */}
      <SignatureArtworks products={products} onAddToWishlist={onAddToWishlist} />

      {/* Art & Decor Collection Section */}
      <ArtDecorCollection />

      {/* Banner Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-[#5d0e31] rounded-[3rem] p-10 md:p-20 lg:p-12 relative overflow-hidden group shadow-2xl flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          <div className="relative z-10 max-w-xl space-y-8">
             <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[0.9] uppercase tracking-tighter italic">
               ARTISANAL <br /> <span className="text-[#f1c40f]">COLLECTION</span> <br /> GALLERY
             </h2>
             <p className="text-white/70 text-lg md:text-xl font-medium leading-relaxed italic">
               Each piece is meticulously crafted by master artisans using traditional techniques passed down through generations.
             </p>
             <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="space-y-2">
                  <div className="text-3xl font-black text-[#f1c40f] tracking-tighter italic uppercase">HANDMADE</div>
                  <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase leading-tight">TRADITIONAL MUD-WORK</p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-black text-[#f1c40f] tracking-tighter italic uppercase">CUSTOM</div>
                  <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase leading-tight">SIZES & DESIGNS</p>
                </div>
             </div>
          </div>
          <div className="relative lg:w-1/2 w-full">
            <div className="grid grid-cols-2 gap-6 md:gap-10">
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl rotate-2 mb-12 md:mb-20 hover:rotate-0 transition-transform duration-700 border-4 border-white/5">
                <img 
                  src={brand} 
                  className="w-full aspect-square object-cover" 
                  alt="Lippan Art 1" 
                />
              </div>
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl -rotate-2 mt-12 md:mt-20 hover:rotate-0 transition-transform duration-700 border-4 border-white/5">
                <img 
                  src={brand}
                  className="w-full aspect-square object-cover" 
                  alt="Lippan Art 2" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
