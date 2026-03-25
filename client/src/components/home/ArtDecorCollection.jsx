import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ArtDecorCard = ({ title, image }) => {
  return (
    <Link to={`/shop?category=${title}`} className="flex flex-col group cursor-pointer">
      <div className="relative aspect-square overflow-hidden rounded-2xl mb-4 shadow-sm border border-primary-50">
        <img 
          src={image || 'https://via.placeholder.com/400x400?text=No+Image'} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <h3 className="text-[10px] md:text-xs font-black text-neutral-dark text-center group-hover:text-accent-700 transition-colors tracking-tight uppercase italic leading-tight px-2">
        {title}
      </h3>
    </Link>
  );
};

const ArtDecorCollection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_BASE_URL || '$(import.meta.env.VITE_API_BASE_URL)';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/categories`);
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return null;
  if (categories.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-10">
          
          {/* Main Text Card */}
          <div className="bg-[#fdf8ed] rounded-2xl p-6 md:p-8 flex flex-col justify-center items-center text-center shadow-sm aspect-square border border-[#f0e6d2] group hover:border-accent-200 transition-all duration-500">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-neutral-dark mb-4 leading-tight tracking-tighter uppercase italic group-hover:scale-105 transition-transform duration-500">
              Art & Decor <br className="hidden md:block" /> Collection
            </h2>
            <div className="w-12 h-0.5 bg-accent-400 mb-6 group-hover:w-20 transition-all duration-500"></div>
            <p className="text-neutral-dark/40 text-[10px] md:text-xs font-black uppercase tracking-widest leading-relaxed max-w-[140px] md:max-w-[160px] italic">
              A well-curated set of pieces for your home
            </p>
          </div>

          {/* Dynamic Collection Cards */}
          {categories.map((item) => (
            <ArtDecorCard 
              key={item._id}
              title={item.name}
              image={item.image}
            />
          ))}

        </div>
      </div>
    </section>
  );
};

export default ArtDecorCollection;

