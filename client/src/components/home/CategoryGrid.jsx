import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_BASE_URL || `${import.meta.env.VITE_API_BASE_URL}`;

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
    <section className="py-12 md:py-16 bg-primary-50 overflow-hidden relative group">
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-neutral-dark tracking-tighter italic uppercase">Shop by Category</h2>
          <div className="flex items-center space-x-4">
            <Link to="/shop" className="text-sm font-bold text-accent-700 hover:text-accent-900 transition-colors uppercase tracking-widest border-b-2 border-accent-100 pb-1 mr-4">View All</Link>
            
            {/* Custom Navigation Buttons */}
            <div className="flex space-x-2">
              <button className="category-prev w-10 h-10 rounded-full border-2 border-primary-200 flex items-center justify-center text-neutral-dark hover:bg-accent-600 hover:border-accent-600 hover:text-white transition-all duration-300 cursor-pointer shadow-sm active:scale-95">
                <ChevronLeft size={20} />
              </button>
              <button className="category-next w-10 h-10 rounded-full border-2 border-primary-200 flex items-center justify-center text-neutral-dark hover:bg-accent-600 hover:border-accent-600 hover:text-white transition-all duration-300 cursor-pointer shadow-sm active:scale-95">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
        
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={2}
          loop={true}
          navigation={{
            prevEl: '.category-prev',
            nextEl: '.category-next',
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 30 },
            1024: { slidesPerView: 5, spaceBetween: 40 },
            1280: { slidesPerView: 6, spaceBetween: 40 },
          }}
          className="categories-swiper !overflow-visible"
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat._id}>
              <Link 
                to={`/shop?category=${cat.name}`} 
                className="flex flex-col items-center group text-center cursor-pointer"
              >
                <div className="relative w-full aspect-square rounded-full overflow-hidden border-4 md:border-[6px] border-white shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-accent-200/50">
                  <img 
                    src={cat.image || 'https://via.placeholder.com/400x400?text=Category'} 
                    alt={cat.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                </div>
                <span className="mt-5 text-[10px] md:text-xs font-black text-neutral-dark tracking-widest uppercase italic group-hover:text-accent-700 transition-colors leading-tight px-2">
                  {cat.name}
                </span>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default CategoryGrid;

