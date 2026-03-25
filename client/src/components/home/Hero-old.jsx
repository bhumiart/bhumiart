import React from 'react';
import { ArrowRight, Sparkles, Star } from 'lucide-react';

const Hero = () => {
  return (
    <section className="bg-white py-10 ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Large Card */}
          <div className="lg:col-span-7 relative group overflow-hidden rounded-[2rem] shadow-2xl h-[400px] lg:h-[600px]">
            <img 
              src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1200" 
              alt="Lippan Art Exhibition" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-accent-900/80 via-accent-900/20 to-transparent"></div>
            <div className="absolute bottom-10 left-10 right-10">
              <div className="inline-flex items-center space-x-2 bg-primary-400/30 backdrop-blur-md border border-primary-400/40 px-4 py-2 rounded-full mb-6">
                <Sparkles size={16} className="text-primary-100" />
                <span className="text-primary-100 text-xs font-bold tracking-widest uppercase italic">As seen on Shark Tank India</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
                India's Largest <span className="text-primary-400 italic underline decoration-accent-500">Wall Art</span> Destination
              </h1>
              <p className="text-primary-50/80 text-lg mb-8 max-w-lg leading-relaxed font-medium">
                Bringing the timeless elegance of Kutch to your contemporary space. Hand-crafted by master artisans with traditional techniques.
              </p>
              <button className="px-10 py-5 bg-primary-400 text-accent-900 font-black rounded-2xl hover:bg-primary-300 transition-all duration-300 flex items-center group shadow-xl shadow-primary-900/20 uppercase tracking-widest text-sm">
                Shop the Collection
                <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column Grid */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-6 h-full">
            {/* Offer Card */}
            <div className="bg-accent-700 rounded-[2rem] p-10 flex flex-col justify-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 text-accent-600/20 transform rotate-12">
                <Star size={120} className="fill-current" />
              </div>
              <div className="relative z-10">
                <h3 className="text-white text-3xl font-black mb-4 uppercase tracking-tighter">Art for Everyone</h3>
                <p className="text-accent-100 text-lg mb-6 max-w-xs leading-relaxed">
                  High-quality artisanal pieces starting from <span className="text-primary-400 font-black">₹999</span>.
                </p>
                <div className="text-5xl font-black text-primary-400 mb-8 uppercase tracking-tighter">
                  30% <span className="text-2xl text-white">OFF</span>
                </div>
                <button className="px-8 py-4 bg-white text-accent-800 font-black rounded-xl hover:bg-primary-100 transition-all uppercase tracking-widest text-xs shadow-lg">
                  Grab Offer
                </button>
              </div>
            </div>

            {/* Sub-Banner Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="relative group overflow-hidden rounded-[2rem] h-[220px]">
                <img 
                  src="https://www.artociti.com/cdn/shop/files/3x2-feet-divine-krishna-with-bansuri-3d-relief-mural-art-976.webp?v=1771434031&width=1000" 
                  alt="Modern Mirror Art" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
                <div className="absolute bottom-6 left-6">
                  <span className="text-white font-black text-lg uppercase tracking-widest italic">Mirror Art</span>
                </div>
              </div>
              <div className="relative group overflow-hidden rounded-[2rem] h-[220px]">
                <img 
                  src="https://www.artociti.com/cdn/shop/articles/vastu-inspired-wall-art-collection.png?v=1766599170&width=700" 
                  alt="Wall Plates" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
                <div className="absolute bottom-6 left-6">
                  <span className="text-white font-black text-lg uppercase tracking-widest italic">Wall Plates</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
